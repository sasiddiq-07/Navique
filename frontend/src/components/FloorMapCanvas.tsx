import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  Compass,
  Eye,
  EyeOff,
  Maximize2,
  Minus,
  Navigation,
  Plus,
} from 'lucide-react';
import {
  BuildingDataset,
  DangerZone,
  FloorId,
  Language,
  NavNode,
  Place,
  RouteResult,
} from '../types/navigation';
import { UI_TRANSLATIONS } from '../data/translations';

interface FloorMapCanvasProps {
  dataset: BuildingDataset;
  activeFloor: FloorId;
  onFloorChange: (floor: FloorId) => void;
  language: Language;
  currentPlace: Place | null;
  selectedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
  onNavigateToPlace: (place: Place) => void;
  route: RouteResult | null;
  emergencyMode: boolean;
  dangerZones: DangerZone[];
}

function getMarkerColor(place: Place): { fill: string; stroke: string } {
  if (place.isEmergencyExit) return { fill: '#15803d', stroke: '#ffffff' };
  if (place.isLift) return { fill: '#0284c7', stroke: '#ffffff' };
  if (place.isRestroom) return { fill: '#4f46e5', stroke: '#ffffff' };
  switch (place.category) {
    case 'pharmacy':
    case 'emergency_care':
      return { fill: '#dc2626', stroke: '#ffffff' };
    case 'dining':
      return { fill: '#d97706', stroke: '#ffffff' };
    case 'entertainment':
      return { fill: '#7c3aed', stroke: '#ffffff' };
    case 'clinic':
    case 'diagnostics':
      return { fill: '#0f766e', stroke: '#ffffff' };
    case 'ward':
      return { fill: '#be185d', stroke: '#ffffff' };
    case 'transit':
      return { fill: '#0369a1', stroke: '#ffffff' };
    case 'entrance':
      return { fill: '#111827', stroke: '#ffffff' };
    default:
      return { fill: '#741046', stroke: '#ffffff' };
  }
}

export const FloorMapCanvas: React.FC<FloorMapCanvasProps> = ({
  dataset,
  activeFloor,
  onFloorChange,
  language,
  currentPlace,
  selectedPlace,
  onSelectPlace,
  onNavigateToPlace,
  route,
  emergencyMode,
  dangerZones,
}) => {
  const t = UI_TRANSLATIONS[language];
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [imgError, setImgError] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const floorConfig = dataset.floors.find((f) => f.id === activeFloor) ?? dataset.floors[0];
  const floorPlaces = useMemo(
    () => dataset.places.filter((p) => p.floor === activeFloor),
    [dataset.places, activeFloor]
  );
  const floorDangerZones = useMemo(
    () => (emergencyMode ? dangerZones.filter((dz) => dz.floor === activeFloor) : []),
    [emergencyMode, dangerZones, activeFloor]
  );

  const nodeMap = useMemo(() => {
    const map = new Map<string, NavNode>();
    for (const node of dataset.nodes) map.set(node.id, node);
    return map;
  }, [dataset.nodes]);

  const blockedEdgeCoords = useMemo(() => {
    if (!emergencyMode) return [];
    const coords: Array<{ x1: number; y1: number; x2: number; y2: number; key: string }> = [];
    const blockedNodeIds = new Set<string>();

    for (const dz of floorDangerZones) {
      for (const nid of dz.blockedNodeIds) blockedNodeIds.add(nid);
      for (const [uId, vId] of dz.blockedEdgePairs ?? []) {
        const u = nodeMap.get(uId);
        const v = nodeMap.get(vId);
        if (u && v && u.floor === activeFloor && v.floor === activeFloor) {
          coords.push({ x1: u.x, y1: u.y, x2: v.x, y2: v.y, key: `pair-${uId}-${vId}` });
        }
      }
    }

    for (const edge of dataset.edges) {
      if (edge.kind !== 'corridor') continue;
      if (!blockedNodeIds.has(edge.from) && !blockedNodeIds.has(edge.to)) continue;
      const u = nodeMap.get(edge.from);
      const v = nodeMap.get(edge.to);
      if (u && v && u.floor === activeFloor && v.floor === activeFloor) {
        coords.push({
          x1: u.x,
          y1: u.y,
          x2: v.x,
          y2: v.y,
          key: `edge-${edge.from}-${edge.to}`,
        });
      }
    }

    return coords;
  }, [emergencyMode, floorDangerZones, nodeMap, activeFloor, dataset.edges]);

  const routeSegments = route?.found ? route.segmentsByFloor[activeFloor] ?? [] : [];

  const handleZoomIn = () => setZoom((z) => Math.min(2.6, Number((z + 0.25).toFixed(2))));
  const handleZoomOut = () => {
    setZoom((z) => {
      const next = Math.max(0.85, Number((z - 0.25).toFixed(2)));
      if (next <= 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button, [data-map-interactive="true"]')) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: dragStartRef.current.panX + dx,
      y: dragStartRef.current.panY + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    dragStartRef.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  useEffect(() => {
    const stageElement = stageRef.current;
    if (!stageElement) return;

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaY) > 0) {
        event.preventDefault();
        const delta = event.deltaY < 0 ? 0.15 : -0.15;
        setZoom((z) => {
          const next = Math.min(2.6, Math.max(0.85, Number((z + delta).toFixed(2))));
          if (next <= 1) setPan({ x: 0, y: 0 });
          return next;
        });
      }
    };

    stageElement.addEventListener('wheel', handleWheel, { passive: false });
    return () => stageElement.removeEventListener('wheel', handleWheel);
  }, []);

  const isCurrentOnFloor = currentPlace?.floor === activeFloor;
  const isDestinationOnFloor = route?.found && route.endPlace.floor === activeFloor;

  return (
    <div className="relative flex flex-col w-full h-full bg-[#f4efe6] overflow-hidden select-none">
      {/* Top Map Info Bar */}
      <div className="z-20 flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-white/95 backdrop-blur border-b border-brand-borderWarm">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-serif-heading text-base sm:text-lg font-bold text-neutral-950 truncate">
              {floorConfig.fullName[language]}
            </h2>
            {emergencyMode && floorDangerZones.length > 0 && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 whitespace-nowrap">
                <AlertTriangle className="w-3.5 h-3.5" />
                {floorDangerZones.length} {t.dangerZone}
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-600 truncate">{floorConfig.subtitle[language]}</p>
        </div>

        {/* Floor Switcher Segmented Control */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-brand-creambg border border-brand-borderWarm">
          {dataset.floors.map((floor) => {
            const isActive = floor.id === activeFloor;
            const isOnRoute = route?.found && route.floorsInvolved.includes(floor.id);
            const hasHazard =
              emergencyMode && dangerZones.some((dz) => dz.floor === floor.id);
            const isStartFloor = currentPlace?.floor === floor.id;

            return (
              <button
                key={floor.id}
                type="button"
                onClick={() => {
                  setImgError(false);
                  onFloorChange(floor.id);
                }}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? emergencyMode
                      ? 'bg-red-700 text-white shadow-sm'
                      : 'bg-brand-maroon text-white shadow-sm'
                    : 'text-neutral-700 hover:bg-white hover:text-neutral-950'
                }`}
              >
                {floor.shortName[language]}
                {isOnRoute && !isActive && (
                  <span
                    className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-brand-teal align-middle"
                    title={t.floorsInvolved}
                  />
                )}
                {hasHazard && !isActive && (
                  <span
                    className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-red-600 align-middle"
                    title={t.dangerZone}
                  />
                )}
                {isStartFloor && !isActive && !isOnRoute && (
                  <span
                    className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-sky-500 align-middle"
                    title={t.youAreHere}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Pan/Zoom Stage */}
      <div
        ref={stageRef}
        className={`relative flex-1 overflow-hidden flex items-center justify-center p-2 sm:p-4 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          style={{
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
            aspectRatio: `${dataset.viewBoxWidth} / ${dataset.viewBoxHeight}`,
          }}
          className="relative max-w-full max-h-full w-auto h-auto rounded-2xl overflow-hidden shadow-lg border border-brand-borderWarm bg-white"
        >
          {/* Reference Floor Map Image */}
          {!imgError ? (
            <img
              src={floorConfig.imageUrl}
              alt={`${dataset.name[language]} - ${floorConfig.fullName[language]}`}
              referrerPolicy="no-referrer"
              draggable={false}
              onError={() => setImgError(true)}
              className="block w-full h-full object-contain pointer-events-none select-none"
            />
          ) : (
            <div className="w-[800px] h-[520px] flex flex-col items-center justify-center bg-brand-creambg text-neutral-700 p-8 text-center">
              <Compass className="w-10 h-10 text-brand-maroon mb-2" />
              <p className="font-serif-heading text-lg font-bold">{floorConfig.fullName[language]}</p>
              <p className="text-xs text-neutral-500 mt-1">{floorConfig.subtitle[language]}</p>
            </div>
          )}

          {/* Aligned Interactive SVG Overlay */}
          <svg
            viewBox={`0 0 ${dataset.viewBoxWidth} ${dataset.viewBoxHeight}`}
            className="absolute inset-0 w-full h-full"
            aria-label={`${dataset.name[language]} interactive floor map overlay`}
          >
            <defs>
              <radialGradient id="dangerGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#dc2626" stopOpacity="0.48" />
                <stop offset="65%" stopColor="#ef4444" stopOpacity="0.24" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.02" />
              </radialGradient>
              <filter id="pinShadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.32" />
              </filter>
            </defs>

            {/* 1. Danger Zones (Emergency Mode) */}
            {floorDangerZones.map((dz) => (
              <g key={dz.id}>
                <circle
                  cx={dz.x}
                  cy={dz.y}
                  r={dz.radius}
                  fill="url(#dangerGradient)"
                  stroke="#dc2626"
                  strokeWidth="2.5"
                  strokeDasharray="8 6"
                />
                <circle
                  cx={dz.x}
                  cy={dz.y}
                  r={dz.radius * 0.55}
                  fill="none"
                  stroke="#b91c1c"
                  strokeWidth="1.5"
                  className="animate-pulse-ring"
                />
                <g transform={`translate(${dz.x}, ${dz.y - 12})`}>
                  <rect
                    x="-76"
                    y="-14"
                    width="152"
                    height="24"
                    rx="12"
                    fill="#991b1b"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    filter="url(#pinShadow)"
                  />
                  <text
                    x="0"
                    y="2"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="700"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    ⚠ {t.dangerZone.toUpperCase()}
                  </text>
                </g>
              </g>
            ))}

            {/* 2. Blocked / Unsafe Pathways */}
            {blockedEdgeCoords.map((seg) => {
              const mx = (seg.x1 + seg.x2) / 2;
              const my = (seg.y1 + seg.y2) / 2;
              return (
                <g key={seg.key}>
                  <line
                    x1={seg.x1}
                    y1={seg.y1}
                    x2={seg.x2}
                    y2={seg.y2}
                    stroke="#dc2626"
                    strokeWidth="6"
                    strokeDasharray="6 6"
                    strokeLinecap="round"
                    opacity="0.85"
                  />
                  <circle cx={mx} cy={my} r="7" fill="#dc2626" stroke="#ffffff" strokeWidth="1.5" />
                  <path
                    d={`M ${mx - 3} ${my - 3} L ${mx + 3} ${my + 3} M ${mx + 3} ${my - 3} L ${mx - 3} ${my + 3}`}
                    stroke="#ffffff"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </g>
              );
            })}

            {/* 3. Calculated Indoor Route Polylines on Active Floor */}
            {routeSegments.map((segment, idx) => {
              const pointsAttr = segment.points.map((pt) => `${pt.x},${pt.y}`).join(' ');
              const routeColor = route?.isEmergencyEvacuation ? '#15803d' : '#741046';
              const routeGlow = route?.isEmergencyEvacuation ? '#86efac' : '#2cb5a0';

              return (
                <g key={`route-seg-${idx}`}>
                  {/* Soft outer highlight */}
                  <polyline
                    points={pointsAttr}
                    fill="none"
                    stroke={routeGlow}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.45"
                  />
                  {/* Solid base path */}
                  <polyline
                    points={pointsAttr}
                    fill="none"
                    stroke={routeColor}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Animated directional flow dash */}
                  <polyline
                    points={pointsAttr}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    strokeDasharray="8 8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-route-dash"
                  />

                  {/* Floor transition badge (clickable to jump to target floor) */}
                  {segment.transitionOut && (
                    <g
                      data-map-interactive="true"
                      transform={`translate(${segment.transitionOut.x}, ${segment.transitionOut.y - 26})`}
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        onFloorChange(segment.transitionOut!.toFloor);
                      }}
                    >
                      <rect
                        x="-58"
                        y="-13"
                        width="116"
                        height="26"
                        rx="13"
                        fill={route?.isEmergencyEvacuation ? '#15803d' : '#0a0a0a'}
                        stroke="#ffffff"
                        strokeWidth="2"
                        filter="url(#pinShadow)"
                      />
                      <text
                        x="0"
                        y="3.5"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="10.5"
                        fontWeight="700"
                        fontFamily="Plus Jakarta Sans, sans-serif"
                      >
                        {segment.transitionOut.kind === 'lift'
                          ? `${t.takeLiftTo} ${segment.transitionOut.toFloor}`
                          : segment.transitionOut.kind === 'escalator'
                            ? `${t.takeEscalatorTo} ${segment.transitionOut.toFloor}`
                            : `${t.takeStairsTo} ${segment.transitionOut.toFloor}`}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* 4. Clickable Place Markers */}
            {floorPlaces.map((place) => {
              const isCurrent = currentPlace?.id === place.id;
              const isSelected = selectedPlace?.id === place.id;
              const isRouteDestination = route?.found && route.endPlace.id === place.id;
              const colors = getMarkerColor(place);

              const radius = isSelected || isRouteDestination || isCurrent ? 8.5 : 4.6;

              return (
                <g
                  key={place.id}
                  data-map-interactive="true"
                  transform={`translate(${place.x}, ${place.y})`}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPlace(place);
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${place.name[language]} (${place.floor})`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectPlace(place);
                    }
                  }}
                >
                  {/* Generous invisible hit area for touch ergonomics */}
                  <circle r="16" fill="transparent" />

                  {/* Distinct Pulsing Ring for Current Location */}
                  {isCurrent && (
                    <>
                      <circle r="14" fill="#0284c7" opacity="0.22" className="animate-pulse-ring" />
                      <circle r="9.5" fill="#0284c7" stroke="#ffffff" strokeWidth="2.5" filter="url(#pinShadow)" />
                      <circle r="3.5" fill="#ffffff" />
                    </>
                  )}

                  {/* Distinct Beacon for Destination */}
                  {!isCurrent && isRouteDestination && (
                    <>
                      <circle
                        r="14.5"
                        fill={route?.isEmergencyEvacuation ? '#15803d' : '#741046'}
                        opacity="0.28"
                        className="animate-pulse-ring"
                      />
                      <circle
                        r="9"
                        fill={route?.isEmergencyEvacuation ? '#15803d' : '#741046'}
                        stroke="#ffffff"
                        strokeWidth="2.5"
                        filter="url(#pinShadow)"
                      />
                      <circle r="3.5" fill="#ffffff" />
                    </>
                  )}

                  {/* Standard / Emergency Exit / Selected Marker */}
                  {!isCurrent && !isRouteDestination && (
                    <>
                      {isSelected && (
                        <circle r="13.5" fill="#741046" opacity="0.25" className="animate-pulse-ring" />
                      )}
                      {place.isEmergencyExit ? (
                        <g filter="url(#pinShadow)">
                          <rect
                            x={isSelected ? '-8' : '-6.5'}
                            y={isSelected ? '-8' : '-6.5'}
                            width={isSelected ? '16' : '13'}
                            height={isSelected ? '16' : '13'}
                            rx={isSelected ? '4.5' : '3.5'}
                            fill="#15803d"
                            stroke="#ffffff"
                            strokeWidth="1.6"
                          />
                          <text
                            x="0"
                            y={isSelected ? '3' : '2.8'}
                            textAnchor="middle"
                            fill="#ffffff"
                            fontSize={isSelected ? '8.5' : '7.5'}
                            fontWeight="800"
                            fontFamily="Plus Jakarta Sans, sans-serif"
                          >
                            E
                          </text>
                        </g>
                      ) : (
                        <circle
                          r={radius}
                          fill={isSelected ? '#741046' : colors.fill}
                          stroke={colors.stroke}
                          strokeWidth={isSelected ? 2.5 : 1.6}
                          filter="url(#pinShadow)"
                        />
                      )}
                    </>
                  )}

                  {/* Optional persistent labels when toggled on */}
                  {showLabels && !isSelected && !isCurrent && !isRouteDestination && (
                    <g transform="translate(0, -14)">
                      <rect
                        x={-Math.min(68, Math.max(36, place.name[language].length * 3.3))}
                        y="-10"
                        width={Math.min(136, Math.max(72, place.name[language].length * 6.6))}
                        height="17"
                        rx="6"
                        fill="rgba(17, 17, 17, 0.84)"
                      />
                      <text
                        x="0"
                        y="1.5"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="8.5"
                        fontWeight="600"
                        fontFamily="Plus Jakarta Sans, sans-serif"
                      >
                        {place.name[language].slice(0, 22)}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* 5. Floating Badge for Current Location */}
            {isCurrentOnFloor && currentPlace && (() => {
              const isSameAsSelected = selectedPlace?.id === currentPlace.id;
              const badgeY = currentPlace.y < 58
                ? currentPlace.y + 22
                : isSameAsSelected
                  ? currentPlace.y - 44
                  : currentPlace.y - 22;
              const badgeX = Math.min(dataset.viewBoxWidth - 60, Math.max(60, currentPlace.x));
              return (
                <g transform={`translate(${badgeX}, ${badgeY})`} pointerEvents="none">
                  <rect
                    x="-48"
                    y="-9.5"
                    width="96"
                    height="19"
                    rx="9.5"
                    fill="#0369a1"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    filter="url(#pinShadow)"
                  />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="9"
                    fontWeight="700"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    {t.youAreHere}
                  </text>
                </g>
              );
            })()}

            {/* 6. Floating Selected Place Callout */}
            {selectedPlace && selectedPlace.floor === activeFloor && (
              <g
                transform={`translate(${Math.min(
                  dataset.viewBoxWidth - 95,
                  Math.max(95, selectedPlace.x)
                )}, ${Math.max(30, selectedPlace.y - 22)})`}
              >
                <rect
                  x="-88"
                  y="-15"
                  width="176"
                  height="26"
                  rx="13"
                  fill="#0a0a0a"
                  stroke="#ffffff"
                  strokeWidth="1.8"
                  filter="url(#pinShadow)"
                />
                <text
                  x="0"
                  y="1.5"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="700"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                >
                  {selectedPlace.name[language].slice(0, 28)}
                </text>
              </g>
            )}

            {/* 7. Destination Callout if different from selectedPlace */}
            {isDestinationOnFloor &&
              route &&
              route.endPlace.id !== selectedPlace?.id && (
                <g
                  transform={`translate(${Math.min(
                    dataset.viewBoxWidth - 95,
                    Math.max(95, route.endPlace.x)
                  )}, ${Math.max(30, route.endPlace.y - 22)})`}
                >
                  <rect
                    x="-84"
                    y="-15"
                    width="168"
                    height="26"
                    rx="13"
                    fill={route.isEmergencyEvacuation ? '#15803d' : '#741046'}
                    stroke="#ffffff"
                    strokeWidth="1.8"
                    filter="url(#pinShadow)"
                  />
                  <text
                    x="0"
                    y="1.5"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="700"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    {route.endPlace.name[language].slice(0, 26)}
                  </text>
                </g>
              )}
          </svg>
        </div>

        {/* Floating Quick Action Bar when a place is selected on map */}
        {selectedPlace && (
          <div className="absolute bottom-4 left-4 right-[4.5rem] sm:right-auto sm:max-w-[calc(100%-5.5rem)] md:max-w-sm z-20 bg-white/95 backdrop-blur border border-brand-borderWarm rounded-2xl px-4 py-3 shadow-lg flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-neutral-500">
                {selectedPlace.floor} · {selectedPlace.wheelchairAccessible ? t.wheelchairAccessibleYes : t.wheelchairAccessibleNo}
              </p>
              <p className="font-serif-heading text-sm font-bold text-neutral-950 truncate">
                {selectedPlace.name[language]}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToPlace(selectedPlace)}
              className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-white bg-brand-maroon hover:bg-brand-maroonHover transition-colors cursor-pointer whitespace-nowrap"
            >
              <Navigation className="w-3.5 h-3.5" />
              {t.navigateHere}
            </button>
          </div>
        )}

        {/* Right Floating Zoom & Map Controls */}
        <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5 bg-white/95 backdrop-blur border border-brand-borderWarm rounded-2xl p-1.5 shadow-lg">
          <button
            type="button"
            onClick={handleZoomIn}
            title={t.zoomIn}
            aria-label={t.zoomIn}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-neutral-800 hover:bg-brand-creambg transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
          <div className="text-[10px] font-mono font-semibold text-center text-neutral-500 tabular-nums">
            {Math.round(zoom * 100)}%
          </div>
          <button
            type="button"
            onClick={handleZoomOut}
            title={t.zoomOut}
            aria-label={t.zoomOut}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-neutral-800 hover:bg-brand-creambg transition-colors cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="h-px bg-brand-borderLight my-0.5" />
          <button
            type="button"
            onClick={handleResetView}
            title={t.resetView}
            aria-label={t.resetView}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-neutral-800 hover:bg-brand-creambg transition-colors cursor-pointer"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowLabels((v) => !v)}
            title={showLabels ? t.hidePlaceLabels : t.showPlaceLabels}
            aria-label={showLabels ? t.hidePlaceLabels : t.showPlaceLabels}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
              showLabels
                ? 'bg-brand-maroon text-white'
                : 'text-neutral-800 hover:bg-brand-creambg'
            }`}
          >
            {showLabels ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Compact Map Legend Strip */}
      <div className="z-20 px-4 py-2 bg-white border-t border-brand-borderWarm flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[11px] text-neutral-600">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-600 border border-white shadow-xs" />
          {t.youAreHere}
        </span>
        <span className="inline-flex items-center gap-1.5 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-maroon border border-white shadow-xs" />
          {t.destination}
        </span>
        <span className="inline-flex items-center gap-1.5 font-medium">
          <span className="w-3 h-3 rounded bg-green-700 text-white text-[8px] font-bold flex items-center justify-center">
            E
          </span>
          {t.emergencyExit}
        </span>
        <span className="inline-flex items-center gap-1.5 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
          {t.liftsLabel}
        </span>
        {emergencyMode && (
          <>
            <span className="inline-flex items-center gap-1.5 font-semibold text-red-700">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
              {t.dangerZone}
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-red-700">
              <span className="w-4 border-t-2 border-dashed border-red-600" />
              {t.blockedPath}
            </span>
          </>
        )}
      </div>
    </div>
  );
};
