import {
  BuildingDataset,
  EmergencyScenario,
  Language,
  Place,
} from '../types/navigation';
import { FLOOR_FULL_LABELS } from '../data/translations';
import {
  calculateIndoorRoute,
  findNearestPlaceByFilter,
  findNearestSafeExitRoute,
} from '../utils/pathfinding';

export interface AssistantResponsePayload {
  reply: string;
  targetPlaceId?: string;
  suggestEmergencyExit?: boolean;
}

interface AskAssistantParams {
  question: string;
  dataset: BuildingDataset;
  language: Language;
  currentPlace: Place | null;
  wheelchairMode: boolean;
  emergencyMode: boolean;
  activeScenario: EmergencyScenario | null;
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\p{L}\p{M}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
}

function matchBestPlace(question: string, places: Place[]): Place | null {
  const q = normalize(question);
  if (!q) return null;

  let bestPlace: Place | null = null;
  let bestScore = 0;

  for (const place of places) {
    const names = [
      normalize(place.name.en),
      normalize(place.name.te),
      normalize(place.name.hi),
    ];

    let score = 0;
    for (const n of names) {
      if (!n) continue;
      if (q.includes(n)) {
        score = Math.max(score, 100 + n.length);
      } else {
        const tokens = n.split(' ').filter((t) => t.length > 2);
        const matches = tokens.filter((t) => q.includes(t)).length;
        if (matches > 0) {
          score = Math.max(score, matches * 25);
        }
      }
    }

    for (const kw of place.keywords) {
      const k = normalize(kw);
      if (k.length >= 2 && q.includes(k)) {
        score = Math.max(score, 60 + k.length);
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestPlace = place;
    }
  }

  return bestScore >= 40 ? bestPlace : null;
}

function runLocalAssistant(params: AskAssistantParams): AssistantResponsePayload {
  const {
    question,
    dataset,
    language,
    currentPlace,
    wheelchairMode,
    emergencyMode,
    activeScenario,
  } = params;

  const q = normalize(question);
  const startPlace =
    currentPlace ??
    dataset.places.find((p) => p.id === dataset.defaultStartPlaceId) ??
    dataset.places[0];

  const dangerZones = emergencyMode && activeScenario ? activeScenario.dangerZones : [];

  const isEmergencyQuery =
    /(emergency|safe exit|fire exit|evacuate|danger|sos|nearest exit|exit|way out|అత్యవసర|నిష్క్రమణ|आपातकाल|निकास)/i.test(q);
  const isRestroomQuery =
    /(restroom|washroom|toilet|bathroom|wc|రెస్ట్|వాష్|शौचालय|रेस्टरूम)/i.test(q);
  const isLiftQuery =
    /(lift|elevator|wheelchair|లిఫ్ట్|వీల్|लिफ्ट|व्हीलचेयर)/i.test(q);

  // 1. Emergency Exit query or active Emergency evacuation request
  if (isEmergencyQuery) {
    const safeRoute = findNearestSafeExitRoute(dataset, startPlace, {
      wheelchairFriendly: wheelchairMode,
      dangerZones,
    });

    if (safeRoute && safeRoute.found) {
      const exit = safeRoute.endPlace;
      const floorText = FLOOR_FULL_LABELS[exit.floor][language];
      const replies: Record<Language, string> = {
        en: `Prototype Safety Guidance: The nearest available safe exit from ${startPlace.name.en} is ${exit.name.en} on ${floorText} (${safeRoute.totalDistanceMeters}m, ~${safeRoute.estimatedMinutes} min)${
          wheelchairMode ? ' via wheelchair-accessible paths' : ''
        }. Tap "Navigate Now" below to highlight the safe route avoiding any active danger zones.`,
        te: `ప్రోటోటైప్ భద్రతా మార్గదర్శనం: ${startPlace.name.te} నుండి సమీప సురక్షిత నిష్క్రమణ ${floorText} లోని ${exit.name.te} (${safeRoute.totalDistanceMeters} మీ, ~${safeRoute.estimatedMinutes} నిమి). సురక్షిత మార్గాన్ని చూడటానికి "ఇప్పుడే నావిగేట్ చేయి" క్లిక్ చేయండి.`,
        hi: `प्रोटोटाइप सुरक्षा मार्गदर्शन: ${startPlace.name.hi} से निकटतम सुरक्षित निकास ${floorText} पर ${exit.name.hi} है (${safeRoute.totalDistanceMeters} मी, ~${safeRoute.estimatedMinutes} मिनट)। सुरक्षित मार्ग देखने के लिए नीचे "अभी नेविगेट करें" पर क्लिक करें।`,
      };

      return {
        reply: replies[language],
        targetPlaceId: exit.id,
        suggestEmergencyExit: true,
      };
    }
  }

  // 2. Nearest Restroom query
  if (isRestroomQuery) {
    const nearest = findNearestPlaceByFilter(
      dataset,
      startPlace,
      (p) => Boolean(p.isRestroom),
      { wheelchairFriendly: wheelchairMode, dangerZones }
    );
    if (nearest) {
      const target = nearest.place;
      const floorText = FLOOR_FULL_LABELS[target.floor][language];
      const dist = nearest.route.found ? `${nearest.route.totalDistanceMeters}m` : '';
      const replies: Record<Language, string> = {
        en: `The nearest restrooms are ${target.name.en} on ${floorText}${dist ? ` (${dist} away)` : ''}. ${target.description.en}`,
        te: `సమీప రెస్ట్‌రూమ్‌లు ${floorText} లోని ${target.name.te}${dist ? ` (${dist} దూరంలో)` : ''}. ${target.description.te}`,
        hi: `निकटतम शौचालय ${floorText} पर ${target.name.hi} हैं${dist ? ` (${dist} दूर)` : ''}। ${target.description.hi}`,
      };
      return { reply: replies[language], targetPlaceId: target.id };
    }
  }

  // 3. Nearest Lift query
  if (isLiftQuery && !matchBestPlace(question, dataset.places.filter((p) => !p.isLift))) {
    const nearest = findNearestPlaceByFilter(
      dataset,
      startPlace,
      (p) => Boolean(p.isLift),
      { wheelchairFriendly: wheelchairMode, dangerZones }
    );
    if (nearest) {
      const target = nearest.place;
      const floorText = FLOOR_FULL_LABELS[target.floor][language];
      const dist = nearest.route.found ? `${nearest.route.totalDistanceMeters}m` : '';
      const replies: Record<Language, string> = {
        en: `The nearest wheelchair-accessible elevator is ${target.name.en} on ${floorText}${dist ? ` (${dist} from ${startPlace.name.en})` : ''}. It connects GF, 1F, 2F, and 3F.`,
        te: `సమీప వీల్‌చైర్-అనుకూల లిఫ్ట్ ${floorText} లోని ${target.name.te}${dist ? ` (${dist} దూరంలో)` : ''}. ఇది అన్ని అంతస్తులను కలుపుతుంది.`,
        hi: `निकटतम व्हीलचेयर-अनुकूल लिफ्ट ${floorText} पर ${target.name.hi} है${dist ? ` (${dist} दूर)` : ''}। यह सभी मंजिलों (GF से 3F) को जोड़ती है।`,
      };
      return { reply: replies[language], targetPlaceId: target.id };
    }
  }

  // 4. Specific Place match (shop, clinic, department, pharmacy, food court, etc.)
  const matched = matchBestPlace(question, dataset.places);
  if (matched) {
    const route = calculateIndoorRoute(dataset, startPlace, matched, {
      wheelchairFriendly: wheelchairMode,
      dangerZones,
    });
    const floorText = FLOOR_FULL_LABELS[matched.floor][language];

    if (route.found) {
      const wheelchairNote: Record<Language, string> = {
        en: wheelchairMode ? ' using step-free wheelchair-accessible lifts and corridors' : '',
        te: wheelchairMode ? ' (వీల్‌చైర్-అనుకూల లిఫ్ట్‌లు మరియు కారిడార్ల ద్వారా)' : '',
        hi: wheelchairMode ? ' (व्हीलचेयर-अनुकूल लिफ्ट और समतल गलियारों से)' : '',
      };

      const replies: Record<Language, string> = {
        en: `${matched.name.en} is located on ${floorText}. ${matched.description.en} From ${startPlace.name.en}, it is approximately ${route.totalDistanceMeters}m (~${route.estimatedMinutes} min)${wheelchairNote.en}.`,
        te: `${matched.name.te} ${floorText} లో ఉంది. ${matched.description.te} ${startPlace.name.te} నుండి ఇది సుమారు ${route.totalDistanceMeters} మీటర్లు (~${route.estimatedMinutes} నిమిషాలు)${wheelchairNote.te}.`,
        hi: `${matched.name.hi} ${floorText} पर स्थित है। ${matched.description.hi} ${startPlace.name.hi} से यह लगभग ${route.totalDistanceMeters} मीटर (~${route.estimatedMinutes} मिनट)${wheelchairNote.hi} की दूरी पर है।`,
      };
      return { reply: replies[language], targetPlaceId: matched.id };
    }

    const blockedReplies: Record<Language, string> = {
      en: `${matched.name.en} is on ${floorText}. Currently, the route from ${startPlace.name.en} is affected by ${
        route.reason === 'no_accessible_route' ? 'accessibility constraints' : 'an active emergency zone'
      }.`,
      te: `${matched.name.te} ${floorText} లో ఉంది. ప్రస్తుతం ${startPlace.name.te} నుండి మార్గం నిరోధించబడింది.`,
      hi: `${matched.name.hi} ${floorText} पर है। वर्तमान में ${startPlace.name.hi} से रास्ता अवरुद्ध है।`,
    };
    return { reply: blockedReplies[language], targetPlaceId: matched.id };
  }

  // 5. Floor overview query (GF / 1F / 2F / 3F)
  const floorMatch: { floor: 'GF' | '1F' | '2F' | '3F'; pattern: RegExp }[] = [
    { floor: 'GF', pattern: /\b(gf|ground floor|floor 0|గ్రౌండ్|भूतल)\b/i },
    { floor: '1F', pattern: /\b(1f|first floor|1st floor|floor 1|మొదటి అంతస్తు|पहली मंजिल)\b/i },
    { floor: '2F', pattern: /\b(2f|second floor|2nd floor|floor 2|రెండవ అంతస్తు|दूसरी मंजिल)\b/i },
    { floor: '3F', pattern: /\b(3f|third floor|3rd floor|floor 3|మూడవ అంతస్తు|तीसरी मंजिल)\b/i },
  ];
  const matchedFloor = floorMatch.find(({ pattern }) => pattern.test(q))?.floor;
  if (matchedFloor) {
    const highlights = dataset.places
      .filter((p) => p.floor === matchedFloor && p.category !== 'transit' && !p.isLift && !p.isRestroom)
      .slice(0, 8)
      .map((p) => p.name[language]);
    if (highlights.length > 0) {
      const floorLabel = FLOOR_FULL_LABELS[matchedFloor][language];
      const list = highlights.join(', ');
      const replies: Record<Language, string> = {
        en: `On ${floorLabel} of ${dataset.name.en}, you can find: ${list}. Ask me about any of these places for step-by-step directions.`,
        te: `${dataset.name.te} లోని ${floorLabel} లో ఇవి ఉన్నాయి: ${list}. వీటిలో దేనికైనా మార్గం కోసం నన్ను అడగండి.`,
        hi: `${dataset.name.hi} की ${floorLabel} पर ये स्थान हैं: ${list}। इनमें से किसी के भी मार्ग के लिए मुझसे पूछें।`,
      };
      return { reply: replies[language] };
    }
  }

  // 6. Helpful directory fallback if question didn't match a specific place
  const fallbackReplies: Record<Language, string> = {
    en:
      dataset.id === 'mall'
        ? `I can help you navigate ${dataset.name.en} across GF (Zudio, Max, Apollo Pharmacy, Reliance Smart Bazaar), 1F (Zara, H&M, Nike, Puma), 2F (Apple Store, Croma, Bowling Zone, Gaming & VR Arcade), and 3F (Multiplex Cinema, Food Court, Barbeque Nation). Try asking "Where is Apollo Pharmacy?" or "How do I reach the Food Court?"`
        : `I can guide you inside ${dataset.name.en} across GF (Emergency, Pharmacy, Diagnostics), 1F (Cardiology, Neurology, Paediatrics, Orthopaedics), 2F (MRI, CT Scan, X-Ray, Dialysis, Physiotherapy), and 3F (Surgery, OT 1 & OT 3, ICU, Maternity). Try asking "Which floor has Cardiology?" or "Where is the Pharmacy?"`,
    te:
      dataset.id === 'mall'
        ? `నేను ${dataset.name.te} లోని GF (అపోలో ఫార్మసీ, జూడియో), 1F (జారా, నైకీ), 2F (ఆపిల్ స్టోర్, బౌలింగ్), 3F (సినిమా, ఫుడ్ కోర్ట్) లకు మార్గదర్శనం చేయగలను. "ఫార్మసీ ఎక్కడ ఉంది?" లేదా "ఫుడ్ కోర్ట్ కు ఎలా వెళ్ళాలి?" అని అడగండి.`
        : `నేను ${dataset.name.te} లోని GF (ఎమర్జెన్సీ, ఫార్మసీ), 1F (కార్డియాలజీ, పీడియాట్రిక్స్), 2F (MRI, CT స్కాన్, డయాలసిస్), 3F (సర్జరీ, ICU, మెటర్నిటీ) లకు మార్గదర్శనం చేయగలను. "కార్డియాలజీ ఏ అంతస్తులో ఉంది?" అని అడగండి.`,
    hi:
      dataset.id === 'mall'
        ? `मैं ${dataset.name.hi} में GF (अपोलो फार्मेसी, ज़ूडियो), 1F (ज़ारा, नाइकी), 2F (एप्पल स्टोर, बॉलिंग), और 3F (मल्टीप्लेक्स सिनेमा, फूड कोर्ट) तक पहुँचने में आपकी मदद कर सकता हूँ। "फार्मेसी कहाँ है?" या "फूड कोर्ट कैसे पहुँचें?" पूछें।`
        : `मैं ${dataset.name.hi} में GF (आपातकाल, फार्मेसी), 1F (कार्डियोलॉजी, पीडियाट्रिक्स), 2F (एमआरआई, सीटी स्कैन, डायलिसिस), और 3F (सर्जरी, आईसीयू, मातृत्व) तक मार्गदर्शन कर सकता हूँ। "कार्डियोलॉजी किस मंजिल पर है?" पूछें।`,
  };

  return { reply: fallbackReplies[language] };
}

export async function askNavigationAssistant(
  params: AskAssistantParams
): Promise<AssistantResponsePayload> {
  const {
    question,
    dataset,
    language,
    currentPlace,
    wheelchairMode,
    emergencyMode,
    activeScenario,
  } = params;

  const startPlace =
    currentPlace ??
    dataset.places.find((p) => p.id === dataset.defaultStartPlaceId) ??
    dataset.places[0];

  const dangerZones = emergencyMode && activeScenario ? activeScenario.dangerZones : [];
  const nearestExit = emergencyMode
    ? findNearestSafeExitRoute(dataset, startPlace, {
        wheelchairFriendly: wheelchairMode,
        dangerZones,
      })
    : null;

  const controller = new AbortController();
  const timeoutMs = 60_000;
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch('/api/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        question,
        buildingName: dataset.name[language],
        language,
        currentLocationName: currentPlace?.name[language],
        currentLocationFloor: currentPlace?.floor,
        wheelchairMode,
        emergencyMode,
        activeScenarioTitle: activeScenario?.title[language],
        activeDangerZones: dangerZones.map((d) => `${d.label[language]} (${d.floor})`),
        nearestSafeExitName: nearestExit?.endPlace.name[language],
        nearestSafeExitFloor: nearestExit?.endPlace.floor,
        places: dataset.places.map((p) => ({
          id: p.id,
          name: p.name[language],
          floor: p.floor,
          category: p.category,
          description: p.description[language],
          wheelchairAccessible: p.wheelchairAccessible,
          isEmergencyExit: p.isEmergencyExit,
        })),
      }),
    });

    if (!response.ok) {
      let responseBody = '';
      try {
        responseBody = (await response.text()).slice(0, 300);
      } catch {
        // Ignore body read failures when logging HTTP errors
      }
      console.error(
        `[AssistantClient] /api/assistant returned non-OK status ${response.status} (${response.statusText})${
          responseBody ? `: ${responseBody}` : ''
        }`
      );
    } else {
      const contentType = response.headers.get('content-type') ?? '';
      if (!contentType.toLowerCase().includes('application/json')) {
        let preview = '';
        try {
          preview = (await response.text()).slice(0, 120).replace(/\s+/g, ' ').trim();
        } catch {
          // Ignore body read failures when logging non-JSON responses
        }
        console.error(
          `[AssistantClient] /api/assistant returned non-JSON response (content-type: "${contentType || 'unknown'}")${
            preview ? `: ${preview}` : ''
          }`
        );
      } else {
        try {
          const data = (await response.json()) as {
            reply?: unknown;
            targetPlaceId?: unknown;
            suggestEmergencyExit?: unknown;
          };

          if (typeof data?.reply === 'string' && data.reply.trim().length > 0) {
            const validPlace =
              typeof data.targetPlaceId === 'string'
                ? dataset.places.find((p) => p.id === data.targetPlaceId)?.id
                : undefined;
            return {
              reply: data.reply,
              targetPlaceId: validPlace,
              suggestEmergencyExit: Boolean(data.suggestEmergencyExit),
            };
          }

          console.error(
            '[AssistantClient] /api/assistant returned an invalid payload (missing non-empty "reply" string):',
            data
          );
        } catch (parseError) {
          console.error('[AssistantClient] /api/assistant returned invalid JSON:', parseError);
        }
      }
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error(
        `[AssistantClient] /api/assistant request timed out after ${timeoutMs / 1000} seconds.`
      );
    } else {
      console.error('[AssistantClient] /api/assistant network or request failure:', error);
    }
  } finally {
    clearTimeout(timeout);
  }

  console.warn('[AssistantClient] Falling back to local navigation assistant.');
  return runLocalAssistant(params);
}
