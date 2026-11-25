export type BuildingId = 'mall' | 'hospital';

export type FloorId = 'GF' | '1F' | '2F' | '3F';

export type Language = 'en' | 'te' | 'hi';

export interface LocalizedText {
  en: string;
  te: string;
  hi: string;
}

export type PlaceCategory =
  | 'store'
  | 'dining'
  | 'entertainment'
  | 'clinic'
  | 'diagnostics'
  | 'emergency_care'
  | 'ward'
  | 'pharmacy'
  | 'facility'
  | 'transit'
  | 'exit'
  | 'entrance';

export type ConnectorKind = 'corridor' | 'lift' | 'escalator' | 'stairs';

export interface NavNode {
  id: string;
  floor: FloorId;
  x: number; // Coordinate in SVG viewBox X (0..1000)
  y: number; // Coordinate in SVG viewBox Y (0..viewBoxHeight)
  kind: 'corridor' | 'place' | 'lift' | 'escalator' | 'stairs' | 'exit' | 'entrance';
  wheelchairAccessible: boolean;
  label?: LocalizedText;
}

export interface NavEdge {
  from: string;
  to: string;
  kind: ConnectorKind;
  weight?: number; // Optional override; defaults to Euclidean distance or floor transition cost
  wheelchairAccessible: boolean;
}

export interface Place {
  id: string;
  nodeId: string;
  floor: FloorId;
  x: number;
  y: number;
  name: LocalizedText;
  category: PlaceCategory;
  description: LocalizedText;
  keywords: string[];
  wheelchairAccessible: boolean;
  isEmergencyExit?: boolean;
  isLift?: boolean;
  isRestroom?: boolean;
  isQRCheckpoint?: boolean;
  qrCode?: string;
}

export interface DangerZone {
  id: string;
  floor: FloorId;
  x: number;
  y: number;
  radius: number;
  label: LocalizedText;
  description: LocalizedText;
  blockedNodeIds: string[];
  blockedEdgePairs?: Array<[string, string]>;
}

export interface EmergencyScenario {
  id: string;
  title: LocalizedText;
  alertBanner: LocalizedText;
  severity: 'critical' | 'high';
  affectedFloors: FloorId[];
  dangerZones: DangerZone[];
}

export interface FloorConfig {
  id: FloorId;
  order: number;
  shortName: LocalizedText;
  fullName: LocalizedText;
  subtitle: LocalizedText;
  imageUrl: string;
}

export interface BuildingDataset {
  id: BuildingId;
  name: LocalizedText;
  tagline: LocalizedText;
  viewBoxWidth: number;
  viewBoxHeight: number;
  defaultStartPlaceId: string;
  floors: FloorConfig[];
  places: Place[];
  nodes: NavNode[];
  edges: NavEdge[];
  emergencyScenarios: EmergencyScenario[];
}

export interface WorkspaceLaunchOptions {
  emergency?: boolean;
  openAssistant?: boolean;
  openSOS?: boolean;
}

export interface RouteStep {
  id: string;
  floor: FloorId;
  type: 'start' | 'walk' | 'floor_change' | 'arrive' | 'evacuate';
  connector?: ConnectorKind;
  fromFloor?: FloorId;
  toFloor?: FloorId;
  distanceMeters: number;
  instruction: LocalizedText;
  targetNodeId: string;
}

export interface FloorSegment {
  floor: FloorId;
  points: Array<{ x: number; y: number; nodeId: string }>;
  transitionOut?: {
    kind: ConnectorKind;
    toFloor: FloorId;
    x: number;
    y: number;
  };
}

export interface RouteResult {
  found: boolean;
  reason?: 'no_accessible_route' | 'blocked_by_hazard' | 'same_location' | 'not_found';
  startPlace: Place;
  endPlace: Place;
  nodePath: NavNode[];
  segmentsByFloor: Record<FloorId, FloorSegment[]>;
  floorsInvolved: FloorId[];
  totalDistanceMeters: number;
  estimatedMinutes: number;
  wheelchairFriendly: boolean;
  isEmergencyEvacuation: boolean;
  steps: RouteStep[];
}

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedPlaceId?: string;
  suggestedEmergencyExit?: boolean;
}
