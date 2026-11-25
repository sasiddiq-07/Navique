import { Router } from 'express';
import {
  type AssistantRequestPayload,
  generateAssistantReply,
  isGeminiConfigured,
} from '../services/geminiService.ts';

const assistantRouter = Router();

assistantRouter.post('/', async (req, res) => {
  const body = req.body as Partial<AssistantRequestPayload>;

  if (
    !body?.question ||
    typeof body.question !== 'string' ||
    !body.buildingName ||
    !Array.isArray(body.places)
  ) {
    res.status(400).json({ error: 'Invalid request payload' });
    return;
  }

  if (!isGeminiConfigured()) {
    res.status(503).json({ fallback: true, reason: 'Assistant API key not configured' });
    return;
  }

  try {
    const result = await generateAssistantReply({
      question: body.question,
      buildingName: body.buildingName,
      language: body.language ?? 'en',
      currentLocationName: body.currentLocationName,
      currentLocationFloor: body.currentLocationFloor,
      wheelchairMode: Boolean(body.wheelchairMode),
      emergencyMode: Boolean(body.emergencyMode),
      activeScenarioTitle: body.activeScenarioTitle,
      activeDangerZones: body.activeDangerZones,
      nearestSafeExitName: body.nearestSafeExitName,
      nearestSafeExitFloor: body.nearestSafeExitFloor,
      places: body.places,
    });

    if (!result) {
      res.status(502).json({ fallback: true, reason: 'Empty assistant response' });
      return;
    }

    res.json(result);
  } catch (error) {
    const status =
      typeof error === 'object' && error !== null && 'status' in error
        ? Number((error as { status?: unknown }).status)
        : undefined;
    const message = error instanceof Error ? error.message : 'Unknown upstream error';
    console.error('Assistant route error:', { status, message });
    const httpStatus = status === 429 ? 429 : status === 503 ? 503 : 502;
    const reason =
      status === 429
        ? 'Assistant quota or rate limit exceeded'
        : status === 503
          ? 'Assistant service temporarily busy'
          : 'Assistant service unavailable';
    res.status(httpStatus).json({
      fallback: true,
      reason,
    });
  }
});

assistantRouter.all('/', (_req, res) => {
  res.status(405).json({ error: 'Method not allowed. Use POST /api/assistant.' });
});

export { assistantRouter };
