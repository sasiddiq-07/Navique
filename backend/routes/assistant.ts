import { Router } from 'express';
import {
  AssistantRequestPayload,
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
    console.error('Assistant route error:', error);
    res.status(502).json({ fallback: true, reason: 'Assistant service unavailable' });
  }
});

export { assistantRouter };
