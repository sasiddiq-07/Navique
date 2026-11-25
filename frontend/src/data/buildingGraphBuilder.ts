import {
  FloorId,
  LocalizedText,
  NavEdge,
  NavNode,
  Place,
} from '../types/navigation';

export interface PlaceSeed {
  id: string;
  floor: FloorId;
  x: number;
  y: number;
  connectTo: string;
  existingNodeId?: string;
  name: LocalizedText;
  category: Place['category'];
  description: LocalizedText;
  keywords: string[];
  wheelchairAccessible?: boolean;
  isEmergencyExit?: boolean;
  isLift?: boolean;
  isRestroom?: boolean;
  isQRCheckpoint?: boolean;
  qrCode?: string;
}

export function attachPlacesToGraph(
  baseNodes: NavNode[],
  baseEdges: NavEdge[],
  seeds: PlaceSeed[]
): { nodes: NavNode[]; edges: NavEdge[]; places: Place[] } {
  const nodes: NavNode[] = [...baseNodes];
  const edges: NavEdge[] = [...baseEdges];
  const places: Place[] = [];

  for (const seed of seeds) {
    const nodeId = seed.existingNodeId ?? `node_${seed.id}`;
    const isAccessible = seed.wheelchairAccessible ?? true;

    if (!seed.existingNodeId) {
      nodes.push({
        id: nodeId,
        floor: seed.floor,
        x: seed.x,
        y: seed.y,
        kind: seed.isEmergencyExit
          ? 'exit'
          : seed.category === 'entrance'
            ? 'entrance'
            : 'place',
        wheelchairAccessible: isAccessible,
        label: seed.name,
      });

      edges.push({
        from: nodeId,
        to: seed.connectTo,
        kind: 'corridor',
        wheelchairAccessible: isAccessible,
      });
    }

    places.push({
      id: seed.id,
      nodeId,
      floor: seed.floor,
      x: seed.x,
      y: seed.y,
      name: seed.name,
      category: seed.category,
      description: seed.description,
      keywords: seed.keywords,
      wheelchairAccessible: isAccessible,
      isEmergencyExit: seed.isEmergencyExit,
      isLift: seed.isLift,
      isRestroom: seed.isRestroom,
      isQRCheckpoint: seed.isQRCheckpoint,
      qrCode: seed.qrCode,
    });
  }

  return { nodes, edges, places };
}
