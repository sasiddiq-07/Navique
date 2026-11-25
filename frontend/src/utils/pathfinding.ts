import {
  BuildingDataset,
  ConnectorKind,
  DangerZone,
  FloorId,
  FloorSegment,
  LocalizedText,
  NavNode,
  Place,
  RouteResult,
  RouteStep,
} from '../types/navigation';
import { FLOOR_FULL_LABELS } from '../data/translations';

interface PathOptions {
  wheelchairFriendly: boolean;
  dangerZones?: DangerZone[];
  isEmergencyEvacuation?: boolean;
}

const PIXELS_PER_METER = 8.5;

function edgeKey(a: string, b: string): string {
  return a < b ? `${a}__${b}` : `${b}__${a}`;
}

function getBlockedSets(dangerZones: DangerZone[] = []): {
  blockedNodes: Set<string>;
  blockedEdges: Set<string>;
} {
  const blockedNodes = new Set<string>();
  const blockedEdges = new Set<string>();

  for (const dz of dangerZones) {
    for (const nid of dz.blockedNodeIds) {
      blockedNodes.add(nid);
    }
    for (const [u, v] of dz.blockedEdgePairs ?? []) {
      blockedEdges.add(edgeKey(u, v));
    }
  }
  return { blockedNodes, blockedEdges };
}

function distanceBetween(a: NavNode, b: NavNode): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

interface AdjacencyItem {
  to: string;
  weight: number;
  kind: ConnectorKind;
  wheelchairAccessible: boolean;
}

function buildAdjacency(
  dataset: BuildingDataset,
  options: PathOptions,
  startNodeId: string,
  endNodeId: string
): Map<string, AdjacencyItem[]> {
  const nodeMap = new Map<string, NavNode>();
  for (const n of dataset.nodes) {
    nodeMap.set(n.id, n);
  }

  const { blockedNodes, blockedEdges } = getBlockedSets(options.dangerZones);
  const adj = new Map<string, AdjacencyItem[]>();

  for (const edge of dataset.edges) {
    const u = nodeMap.get(edge.from);
    const v = nodeMap.get(edge.to);
    if (!u || !v) continue;

    if (options.wheelchairFriendly) {
      if (!edge.wheelchairAccessible) continue;
      if (edge.kind === 'stairs' || edge.kind === 'escalator') continue;
      if ((!u.wheelchairAccessible && u.id !== startNodeId) || (!v.wheelchairAccessible && v.id !== endNodeId)) {
        continue;
      }
    }

    if (blockedEdges.has(edgeKey(edge.from, edge.to))) continue;
    // Avoid entering blocked hazard nodes (allow leaving start node if user happens to be near danger edge)
    if (blockedNodes.has(edge.from) && edge.from !== startNodeId) continue;
    if (blockedNodes.has(edge.to) && edge.to !== startNodeId) continue;

    const computedWeight =
      edge.weight ??
      (u.floor === v.floor ? Math.max(8, distanceBetween(u, v)) : 120);

    // Slight preference for accessible corridors in wheelchair mode
    const finalWeight =
      options.wheelchairFriendly && edge.kind === 'lift'
        ? computedWeight * 0.9
        : computedWeight;

    if (!adj.has(edge.from)) adj.set(edge.from, []);
    if (!adj.has(edge.to)) adj.set(edge.to, []);

    adj.get(edge.from)!.push({
      to: edge.to,
      weight: finalWeight,
      kind: edge.kind,
      wheelchairAccessible: edge.wheelchairAccessible,
    });
    adj.get(edge.to)!.push({
      to: edge.from,
      weight: finalWeight,
      kind: edge.kind,
      wheelchairAccessible: edge.wheelchairAccessible,
    });
  }

  return adj;
}

function runDijkstra(
  dataset: BuildingDataset,
  startNodeId: string,
  endNodeId: string,
  options: PathOptions
): { path: NavNode[]; edgeKinds: ConnectorKind[]; cost: number } | null {
  const nodeMap = new Map<string, NavNode>();
  for (const n of dataset.nodes) nodeMap.set(n.id, n);

  const adj = buildAdjacency(dataset, options, startNodeId, endNodeId);
  const dist = new Map<string, number>();
  const prev = new Map<string, { nodeId: string; kind: ConnectorKind }>();
  const visited = new Set<string>();

  dist.set(startNodeId, 0);

  while (true) {
    let currentId: string | null = null;
    let bestDist = Infinity;

    for (const [id, d] of dist.entries()) {
      if (!visited.has(id) && d < bestDist) {
        bestDist = d;
        currentId = id;
      }
    }

    if (currentId === null || bestDist === Infinity) break;
    if (currentId === endNodeId) break;

    visited.add(currentId);
    const neighbors = adj.get(currentId) ?? [];

    for (const edge of neighbors) {
      if (visited.has(edge.to)) continue;
      const alt = bestDist + edge.weight;
      if (alt < (dist.get(edge.to) ?? Infinity)) {
        dist.set(edge.to, alt);
        prev.set(edge.to, { nodeId: currentId, kind: edge.kind });
      }
    }
  }

  if (!dist.has(endNodeId) || dist.get(endNodeId) === Infinity) {
    return null;
  }

  const nodeIds: string[] = [];
  const edgeKinds: ConnectorKind[] = [];
  let cursor: string | undefined = endNodeId;

  while (cursor) {
    nodeIds.push(cursor);
    const parent = prev.get(cursor);
    if (!parent) break;
    edgeKinds.push(parent.kind);
    cursor = parent.nodeId;
  }

  nodeIds.reverse();
  edgeKinds.reverse();

  const path = nodeIds
    .map((id) => nodeMap.get(id))
    .filter((n): n is NavNode => Boolean(n));

  return {
    path,
    edgeKinds,
    cost: dist.get(endNodeId)!,
  };
}

function connectorNames(kind: ConnectorKind): LocalizedText {
  switch (kind) {
    case 'lift':
      return { en: 'the accessible lift', te: 'యాక్సెసిబుల్ లిఫ్ట్', hi: 'सुगम लिफ्ट' };
    case 'escalator':
      return { en: 'the escalator', te: 'ఎస్కలేటర్', hi: 'एस्केलेटर' };
    case 'stairs':
      return { en: 'the stairs', te: 'మెట్లు', hi: 'सीढ़ियाँ' };
    default:
      return { en: 'the corridor', te: 'కారిడార్', hi: 'गलियारा' };
  }
}

function buildDirections(
  startPlace: Place,
  endPlace: Place,
  path: NavNode[],
  edgeKinds: ConnectorKind[],
  isEmergencyEvacuation: boolean
): {
  steps: RouteStep[];
  segmentsByFloor: Record<FloorId, FloorSegment[]>;
  floorsInvolved: FloorId[];
  totalDistanceMeters: number;
} {
  const segmentsByFloor: Record<FloorId, FloorSegment[]> = {
    GF: [],
    '1F': [],
    '2F': [],
    '3F': [],
  };

  const floorsInvolved: FloorId[] = [];
  const steps: RouteStep[] = [];

  if (path.length === 0) {
    return { steps, segmentsByFloor, floorsInvolved, totalDistanceMeters: 0 };
  }

  // Group continuous same-floor points into FloorSegments
  let currentSegment: FloorSegment = {
    floor: path[0].floor,
    points: [{ x: path[0].x, y: path[0].y, nodeId: path[0].id }],
  };
  floorsInvolved.push(path[0].floor);

  for (let i = 1; i < path.length; i++) {
    const prevNode = path[i - 1];
    const currNode = path[i];
    const kind = edgeKinds[i - 1] ?? 'corridor';

    if (currNode.floor !== prevNode.floor) {
      currentSegment.transitionOut = {
        kind,
        toFloor: currNode.floor,
        x: prevNode.x,
        y: prevNode.y,
      };
      segmentsByFloor[currentSegment.floor].push(currentSegment);

      currentSegment = {
        floor: currNode.floor,
        points: [{ x: currNode.x, y: currNode.y, nodeId: currNode.id }],
      };
      if (!floorsInvolved.includes(currNode.floor)) {
        floorsInvolved.push(currNode.floor);
      }
    } else {
      currentSegment.points.push({ x: currNode.x, y: currNode.y, nodeId: currNode.id });
    }
  }
  segmentsByFloor[currentSegment.floor].push(currentSegment);

  // Build clean human-readable step-by-step instructions
  steps.push({
    id: 'step-start',
    floor: startPlace.floor,
    type: 'start',
    distanceMeters: 0,
    targetNodeId: path[0].id,
    instruction: {
      en: `Start at ${startPlace.name.en} on ${FLOOR_FULL_LABELS[startPlace.floor].en}.`,
      te: `${FLOOR_FULL_LABELS[startPlace.floor].te} లోని ${startPlace.name.te} వద్ద ప్రారంభించండి.`,
      hi: `${FLOOR_FULL_LABELS[startPlace.floor].hi} पर ${startPlace.name.hi} से प्रारंभ करें।`,
    },
  });

  let totalDistanceMeters = 0;
  let accumPixels = 0;
  let stepCounter = 1;

  for (let i = 1; i < path.length; i++) {
    const prevNode = path[i - 1];
    const currNode = path[i];
    const kind = edgeKinds[i - 1] ?? 'corridor';

    if (currNode.floor !== prevNode.floor) {
      // Flush accumulated corridor walk before floor change
      if (accumPixels > 5) {
        const meters = Math.max(4, Math.round(accumPixels / PIXELS_PER_METER));
        totalDistanceMeters += meters;
        const connLabel = prevNode.label ?? connectorNames(kind);
        steps.push({
          id: `step-walk-${stepCounter++}`,
          floor: prevNode.floor,
          type: 'walk',
          distanceMeters: meters,
          targetNodeId: prevNode.id,
          instruction: {
            en: `Follow the corridor for ${meters}m to ${connLabel.en}.`,
            te: `${connLabel.te} వరకు కారిడార్‌లో ${meters} మీటర్లు నడవండి.`,
            hi: `${connLabel.hi} तक गलियारे में ${meters} मीटर चलें।`,
          },
        });
        accumPixels = 0;
      }

      // Collapse consecutive same-connector vertical jumps (e.g., GF -> 1F -> 2F -> 3F in one lift ride)
      let targetIdx = i;
      while (
        targetIdx + 1 < path.length &&
        path[targetIdx + 1].floor !== path[targetIdx].floor &&
        edgeKinds[targetIdx] === kind
      ) {
        targetIdx++;
      }

      const targetFloor = path[targetIdx].floor;
      const conn = connectorNames(kind);
      const liftLabel = prevNode.label;
      const floorStepMeters = Math.abs(targetIdx - i + 1) * 6;
      totalDistanceMeters += floorStepMeters;

      steps.push({
        id: `step-floor-${stepCounter++}`,
        floor: targetFloor,
        type: 'floor_change',
        connector: kind,
        fromFloor: prevNode.floor,
        toFloor: targetFloor,
        distanceMeters: floorStepMeters,
        targetNodeId: path[targetIdx].id,
        instruction: {
          en: `Take ${liftLabel ? liftLabel.en : conn.en} from ${prevNode.floor} to ${FLOOR_FULL_LABELS[targetFloor].en}.`,
          te: `${prevNode.floor} నుండి ${FLOOR_FULL_LABELS[targetFloor].te} కు ${liftLabel ? liftLabel.te : conn.te} ద్వారా వెళ్ళండి.`,
          hi: `${prevNode.floor} से ${FLOOR_FULL_LABELS[targetFloor].hi} तक ${liftLabel ? liftLabel.hi : conn.hi} से जाएं।`,
        },
      });

      i = targetIdx;
    } else {
      accumPixels += distanceBetween(prevNode, currNode);
    }
  }

  if (accumPixels > 2) {
    const meters = Math.max(4, Math.round(accumPixels / PIXELS_PER_METER));
    totalDistanceMeters += meters;
    steps.push({
      id: `step-walk-final-${stepCounter++}`,
      floor: endPlace.floor,
      type: 'walk',
      distanceMeters: meters,
      targetNodeId: endPlace.nodeId,
      instruction: isEmergencyEvacuation
        ? {
            en: `Follow the safe highlighted corridor for ${meters}m directly to ${endPlace.name.en}.`,
            te: `సురక్షిత మార్గంలో ${meters} మీటర్లు నేరుగా ${endPlace.name.te} వద్దకు వెళ్ళండి.`,
            hi: `सुरक्षित चिह्नित गलियारे पर ${meters} मीटर चलकर सीधे ${endPlace.name.hi} तक पहुँचें।`,
          }
        : {
            en: `Continue along the walkway for ${meters}m to reach ${endPlace.name.en}.`,
            te: `${endPlace.name.te} చేరుకోవడానికి నడక మార్గంలో ${meters} మీటర్లు ముందుకు వెళ్ళండి.`,
            hi: `${endPlace.name.hi} तक पहुँचने के लिए गलियारे में ${meters} मीटर आगे बढ़ें।`,
          },
    });
  }

  steps.push({
    id: 'step-arrive',
    floor: endPlace.floor,
    type: isEmergencyEvacuation ? 'evacuate' : 'arrive',
    distanceMeters: 0,
    targetNodeId: endPlace.nodeId,
    instruction: isEmergencyEvacuation
      ? {
          en: `Arrive at ${endPlace.name.en} (${endPlace.floor}). Exit calmly to the outdoor assembly area (Prototype Demo).`,
          te: `${endPlace.name.te} (${endPlace.floor}) వద్దకు చేరుకున్నారు. ప్రశాంతంగా బయటకు వెళ్ళండి (ప్రోటోటైప్ డెమో).`,
          hi: `${endPlace.name.hi} (${endPlace.floor}) पर पहुँच गए हैं। शांतिपूर्वक बाहर सुरक्षित स्थान पर जाएं (प्रोटोटाइप डेमो)।`,
        }
      : {
          en: `You have arrived at ${endPlace.name.en} on ${FLOOR_FULL_LABELS[endPlace.floor].en}.`,
          te: `మీరు ${FLOOR_FULL_LABELS[endPlace.floor].te} లోని ${endPlace.name.te} వద్దకు చేరుకున్నారు.`,
          hi: `आप ${FLOOR_FULL_LABELS[endPlace.floor].hi} पर ${endPlace.name.hi} पहुँच गए हैं।`,
        },
  });

  return { steps, segmentsByFloor, floorsInvolved, totalDistanceMeters };
}

export function calculateIndoorRoute(
  dataset: BuildingDataset,
  startPlace: Place,
  endPlace: Place,
  options: PathOptions
): RouteResult {
  if (startPlace.id === endPlace.id) {
    return {
      found: false,
      reason: 'same_location',
      startPlace,
      endPlace,
      nodePath: [],
      segmentsByFloor: { GF: [], '1F': [], '2F': [], '3F': [] },
      floorsInvolved: [startPlace.floor],
      totalDistanceMeters: 0,
      estimatedMinutes: 0,
      wheelchairFriendly: options.wheelchairFriendly,
      isEmergencyEvacuation: Boolean(options.isEmergencyEvacuation),
      steps: [],
    };
  }

  const result = runDijkstra(dataset, startPlace.nodeId, endPlace.nodeId, options);

  if (!result) {
    // Check if an unrestricted route exists so we give the exact reason
    let reason: RouteResult['reason'] = 'not_found';
    if (options.wheelchairFriendly) {
      const nonWheelchair = runDijkstra(dataset, startPlace.nodeId, endPlace.nodeId, {
        ...options,
        wheelchairFriendly: false,
      });
      reason = nonWheelchair ? 'no_accessible_route' : 'blocked_by_hazard';
    } else if (options.dangerZones && options.dangerZones.length > 0) {
      reason = 'blocked_by_hazard';
    }

    return {
      found: false,
      reason,
      startPlace,
      endPlace,
      nodePath: [],
      segmentsByFloor: { GF: [], '1F': [], '2F': [], '3F': [] },
      floorsInvolved: [],
      totalDistanceMeters: 0,
      estimatedMinutes: 0,
      wheelchairFriendly: options.wheelchairFriendly,
      isEmergencyEvacuation: Boolean(options.isEmergencyEvacuation),
      steps: [],
    };
  }

  const { steps, segmentsByFloor, floorsInvolved, totalDistanceMeters } = buildDirections(
    startPlace,
    endPlace,
    result.path,
    result.edgeKinds,
    Boolean(options.isEmergencyEvacuation)
  );

  // Walking speed: ~65 m/min (normal) or ~48 m/min (wheelchair)
  const speed = options.wheelchairFriendly ? 48 : 65;
  const estimatedMinutes = Math.max(1, Math.ceil(totalDistanceMeters / speed));

  return {
    found: true,
    startPlace,
    endPlace,
    nodePath: result.path,
    segmentsByFloor,
    floorsInvolved,
    totalDistanceMeters,
    estimatedMinutes,
    wheelchairFriendly: options.wheelchairFriendly,
    isEmergencyEvacuation: Boolean(options.isEmergencyEvacuation),
    steps,
  };
}

export function findNearestSafeExitRoute(
  dataset: BuildingDataset,
  startPlace: Place,
  options: Omit<PathOptions, 'isEmergencyEvacuation'>
): RouteResult | null {
  const { blockedNodes } = getBlockedSets(options.dangerZones);
  const exitPlaces = dataset.places.filter(
    (p) => p.isEmergencyExit && !blockedNodes.has(p.nodeId)
  );

  let bestRoute: RouteResult | null = null;
  let bestScore = Infinity;

  for (const exitPlace of exitPlaces) {
    const candidate = calculateIndoorRoute(dataset, startPlace, exitPlace, {
      ...options,
      isEmergencyEvacuation: true,
    });
    if (!candidate.found) continue;

    // Strongly prefer safe exits on the same floor to minimize evacuation time
    const sameFloorBonus = exitPlace.floor === startPlace.floor ? 0 : 120;
    const score = candidate.totalDistanceMeters + sameFloorBonus;
    if (score < bestScore) {
      bestScore = score;
      bestRoute = candidate;
    }
  }

  return bestRoute;
}

export function findNearestPlaceByFilter(
  dataset: BuildingDataset,
  startPlace: Place,
  predicate: (place: Place) => boolean,
  options: PathOptions
): { place: Place; route: RouteResult } | null {
  const candidates = dataset.places.filter(predicate);
  let best: { place: Place; route: RouteResult } | null = null;

  for (const candidate of candidates) {
    if (candidate.id === startPlace.id) {
      return {
        place: candidate,
        route: calculateIndoorRoute(dataset, startPlace, candidate, options),
      };
    }
    const route = calculateIndoorRoute(dataset, startPlace, candidate, options);
    if (!route.found) continue;
    if (!best || route.totalDistanceMeters < best.route.totalDistanceMeters) {
      best = { place: candidate, route };
    }
  }

  return best;
}
