import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

export interface AssistantPlaceSummary {
  id: string;
  name: string;
  floor: string;
  category: string;
  description: string;
  wheelchairAccessible: boolean;
  isEmergencyExit?: boolean;
}

export interface AssistantRequestPayload {
  question: string;
  buildingName: string;
  language: 'en' | 'te' | 'hi';
  currentLocationName?: string;
  currentLocationFloor?: string;
  wheelchairMode: boolean;
  emergencyMode: boolean;
  activeScenarioTitle?: string;
  activeDangerZones?: string[];
  nearestSafeExitName?: string;
  nearestSafeExitFloor?: string;
  places: AssistantPlaceSummary[];
}

export interface AssistantReply {
  reply: string;
  targetPlaceId?: string;
  suggestEmergencyExit: boolean;
}

function createClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey === 'MY_GEMINI_API_KEY' || apiKey.length < 10) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function getLanguageLabel(language: AssistantRequestPayload['language']): string {
  if (language === 'te') return 'Telugu (తెలుగు)';
  if (language === 'hi') return 'Hindi (हिन्दी)';
  return 'English';
}

function buildSystemPrompt(payload: AssistantRequestPayload): string {
  const languageName = getLanguageLabel(payload.language);

  const directory = payload.places
    .map(
      (place) =>
        `- id="${place.id}" | ${place.name} | Floor: ${place.floor} | Category: ${place.category} | Accessible: ${place.wheelchairAccessible ? 'Yes' : 'No'}${place.isEmergencyExit ? ' | EMERGENCY EXIT' : ''} | ${place.description}`
    )
    .join('\n');

  const locationContext = payload.currentLocationName
    ? `${payload.currentLocationName} (${payload.currentLocationFloor ?? ''})`
    : 'Not set yet';

  const accessibilityContext = payload.wheelchairMode
    ? 'ENABLED (always mention accessible lifts and step-free corridors; avoid stairs and escalators)'
    : 'Disabled';

  const emergencyContext = payload.emergencyMode
    ? `ACTIVE SIMULATION ("${payload.activeScenarioTitle ?? 'Active Alert'}"). Danger zones: ${(payload.activeDangerZones ?? []).join(', ') || 'None'}. Nearest safe exit: ${payload.nearestSafeExitName ?? 'Available emergency exit'} (${payload.nearestSafeExitFloor ?? ''}). Remind the visitor this is a simulated alert and guide them to a safe exit away from danger zones.`
    : 'Inactive';

  return `You are Navique's indoor navigation assistant for "${payload.buildingName}".
Follow these rules strictly:
1. Respond only in ${languageName}.
2. Use only places and details from the building directory below; never invent rooms, shops, or floors.
3. Keep responses concise and helpful (2 to 4 short sentences).
4. Visitor current location: ${locationContext}.
5. Wheelchair-friendly mode: ${accessibilityContext}.
6. Emergency mode: ${emergencyContext}.
7. If the visitor asks about a specific place or nearest amenity, return its exact directory "id" in targetPlaceId; otherwise return an empty string "".

BUILDING DIRECTORY:
${directory}`;
}

export function isGeminiConfigured(): boolean {
  return createClient() !== null;
}

const ASSISTANT_MODELS = ['gemini-4-hydrogen', 'gemini-3.1-flash-lite'] as const;
const modelCooldownUntil = new Map<string, number>();

function getErrorStatus(error: unknown): number | undefined {
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const status = Number((error as { status?: unknown }).status);
    if (Number.isFinite(status)) return status;
  }
  return undefined;
}

function isQuotaOrRateLimitError(error: unknown): boolean {
  const status = getErrorStatus(error);
  if (status === 429) return true;
  const message = error instanceof Error ? error.message : String(error);
  return message.includes('RESOURCE_EXHAUSTED') || message.includes('"code":429');
}

function isTransientUpstreamError(error: unknown): boolean {
  const status = getErrorStatus(error);
  if (status === 500 || status === 502 || status === 503 || status === 504 || status === 408) {
    return true;
  }
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes('UNAVAILABLE') ||
    message.includes('INTERNAL') ||
    message.includes('high demand') ||
    message.includes('fetch failed') ||
    message.includes('ECONNRESET')
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseAssistantJson(rawText: string): AssistantReply | null {
  const cleaned = rawText
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();

  if (!cleaned) return null;

  let jsonCandidate = cleaned;
  if (!jsonCandidate.startsWith('{')) {
    const start = jsonCandidate.indexOf('{');
    const end = jsonCandidate.lastIndexOf('}');
    if (start !== -1 && end > start) {
      jsonCandidate = jsonCandidate.slice(start, end + 1);
    }
  }

  const parsed = JSON.parse(jsonCandidate) as {
    reply?: unknown;
    targetPlaceId?: unknown;
    suggestEmergencyExit?: unknown;
  };

  if (typeof parsed.reply !== 'string' || !parsed.reply.trim()) {
    return null;
  }

  return {
    reply: parsed.reply.trim(),
    targetPlaceId:
      typeof parsed.targetPlaceId === 'string' && parsed.targetPlaceId.trim()
        ? parsed.targetPlaceId.trim()
        : undefined,
    suggestEmergencyExit: Boolean(parsed.suggestEmergencyExit),
  };
}

export async function generateAssistantReply(
  payload: AssistantRequestPayload
): Promise<AssistantReply | null> {
  const client = createClient();
  if (!client) return null;

  const now = Date.now();
  const availableModels = ASSISTANT_MODELS.filter(
    (model) => (modelCooldownUntil.get(model) ?? 0) <= now
  );
  const modelsToTry = availableModels.length > 0 ? availableModels : [...ASSISTANT_MODELS];

  const systemInstruction = buildSystemPrompt(payload);
  const contents = payload.question.slice(0, 600);
  const maxAttemptsPerModel = 3;
  let lastError: unknown = null;

  for (const model of modelsToTry) {
    for (let attempt = 1; attempt <= maxAttemptsPerModel; attempt += 1) {
      try {
        const response = await client.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            ...(model === 'gemini-4-hydrogen'
              ? { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } }
              : {}),
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                reply: {
                  type: Type.STRING,
                  description: 'Helpful navigation response in the requested language.',
                },
                targetPlaceId: {
                  type: Type.STRING,
                  description: 'Exact place id from the directory if relevant, else empty string.',
                },
                suggestEmergencyExit: {
                  type: Type.BOOLEAN,
                  description: 'True when the user asks for an emergency exit or evacuation guidance.',
                },
              },
              required: ['reply', 'targetPlaceId', 'suggestEmergencyExit'],
            },
          },
        });

        const parsed = parseAssistantJson(response.text ?? '');
        if (parsed) {
          return parsed;
        }
      } catch (error) {
        lastError = error;

        if (isQuotaOrRateLimitError(error)) {
          // Skip this exhausted model for 15 minutes and immediately try the next model
          modelCooldownUntil.set(model, Date.now() + 15 * 60 * 1000);
          break;
        }

        if (isTransientUpstreamError(error) && attempt < maxAttemptsPerModel) {
          const delayMs = attempt * 700 + Math.floor(Math.random() * 250);
          await sleep(delayMs);
          continue;
        }

        // If transient retries exhausted on this model, try the next model before giving up
        if (isTransientUpstreamError(error)) {
          break;
        }

        throw error;
      }
    }
  }

  if (lastError) {
    throw lastError;
  }

  return null;
}
