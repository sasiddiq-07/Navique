import { GoogleGenAI, Type } from '@google/genai';

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

export async function generateAssistantReply(
  payload: AssistantRequestPayload
): Promise<AssistantReply | null> {
  const client = createClient();
  if (!client) return null;

  const response = await client.models.generateContent({
    model: 'gemini-4-hydrogen',
    contents: payload.question.slice(0, 600),
    config: {
      systemInstruction: buildSystemPrompt(payload),
      responseMimeType: 'application/json',
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

  const rawText = (response.text ?? '')
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();

  if (!rawText) {
    return null;
  }

  const parsed = JSON.parse(rawText) as {
    reply?: string;
    targetPlaceId?: string;
    suggestEmergencyExit?: boolean;
  };

  if (!parsed.reply) {
    return null;
  }

  return {
    reply: parsed.reply,
    targetPlaceId: parsed.targetPlaceId || undefined,
    suggestEmergencyExit: Boolean(parsed.suggestEmergencyExit),
  };
}
