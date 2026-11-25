import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Accessibility,
  AlertTriangle,
  ArrowLeft,
  ArrowUpDown,
  Bot,
  Building2,
  CheckCircle2,
  ChevronRight,
  Compass,
  Hospital,
  MapPin,
  Navigation,
  PanelLeftClose,
  PanelLeftOpen,
  QrCode,
  Route,
  Search,
  ShieldAlert,
  Store,
  X,
} from 'lucide-react';
import {
  BuildingDataset,
  BuildingId,
  FloorId,
  Language,
  Place,
  RouteResult,
} from '../types/navigation';
import {
  CATEGORY_LABELS,
  FLOOR_FULL_LABELS,
  UI_TRANSLATIONS,
} from '../data/translations';
import {
  calculateIndoorRoute,
  findNearestSafeExitRoute,
} from '../utils/pathfinding';
import { FloorMapCanvas } from './FloorMapCanvas';
import { AIAssistantPanel } from './AIAssistantPanel';
import { QrCheckpointModal } from './QrCheckpointModal';
import { EmergencySosModal } from './EmergencySosModal';

interface NavigationWorkspaceProps {
  dataset: BuildingDataset;
  onBackToHome: () => void;
  onSwitchBuilding: (building: BuildingId) => void;
  initialEmergency?: boolean;
  initialOpenAssistant?: boolean;
  initialOpenSOS?: boolean;
}

export const NavigationWorkspace: React.FC<NavigationWorkspaceProps> = ({
  dataset,
  onBackToHome,
  onSwitchBuilding,
  initialEmergency = false,
  initialOpenAssistant = false,
  initialOpenSOS = false,
}) => {
  const [language, setLanguage] = useState<Language>('en');
  const [activeFloor, setActiveFloor] = useState<FloorId>('GF');
  const [currentLocationId, setCurrentLocationId] = useState<string | null>(
    initialEmergency ? null : dataset.defaultStartPlaceId
  );
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [destinationPlaceId, setDestinationPlaceId] = useState<string | null>(null);
  const [wheelchairMode, setWheelchairMode] = useState(false);

  const [emergencyMode, setEmergencyMode] = useState(initialEmergency);
  const [activeScenarioId, setActiveScenarioId] = useState<string>(
    dataset.emergencyScenarios[0]?.id ?? ''
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [directoryFilter, setDirectoryFilter] = useState<'all' | Place['category']>('all');

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState(initialOpenSOS);
  const [isAssistantOpen, setIsAssistantOpen] = useState(initialOpenAssistant);
  const [qrToast, setQrToast] = useState<string | null>(null);
  const [mobilePanelOpen, setMobilePanelOpen] = useState(true);

  const qrToastTimerRef = useRef<number | null>(null);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  const t = UI_TRANSLATIONS[language];

  // Clear pending toast timer on unmount
  useEffect(() => {
    return () => {
      if (qrToastTimerRef.current !== null) {
        window.clearTimeout(qrToastTimerRef.current);
      }
    };
  }, []);

  // Dismiss autocomplete search dropdown when clicking outside or pressing Escape
  useEffect(() => {
    if (!searchFocused) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setSearchFocused(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSearchFocused(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [searchFocused]);

  // Reset building-specific state cleanly whenever switching between Mall & Hospital
  useEffect(() => {
    setActiveFloor('GF');
    setCurrentLocationId(initialEmergency ? null : dataset.defaultStartPlaceId);
    setSelectedPlaceId(null);
    setDestinationPlaceId(null);
    setSearchQuery('');
    setDirectoryFilter('all');
    setActiveScenarioId(dataset.emergencyScenarios[0]?.id ?? '');
    setEmergencyMode(initialEmergency);
    setIsSosModalOpen(initialOpenSOS);
    setIsAssistantOpen(initialOpenAssistant);
  }, [dataset, initialEmergency, initialOpenAssistant, initialOpenSOS]);

  const placeMap = useMemo(() => {
    const map = new Map<string, Place>();
    for (const p of dataset.places) map.set(p.id, p);
    return map;
  }, [dataset.places]);

  const currentPlace = currentLocationId ? placeMap.get(currentLocationId) ?? null : null;
  const selectedPlace = selectedPlaceId ? placeMap.get(selectedPlaceId) ?? null : null;
  const destinationPlace = destinationPlaceId ? placeMap.get(destinationPlaceId) ?? null : null;

  const activeScenario = useMemo(() => {
    if (!emergencyMode) return null;
    return (
      dataset.emergencyScenarios.find((s) => s.id === activeScenarioId) ??
      dataset.emergencyScenarios[0] ??
      null
    );
  }, [dataset.emergencyScenarios, emergencyMode, activeScenarioId]);

  const activeDangerZones = useMemo(
    () => (emergencyMode && activeScenario ? activeScenario.dangerZones : []),
    [emergencyMode, activeScenario]
  );

  // Automatic route calculation (reacts immediately to start, destination, wheelchair, emergency, scenario changes)
  const activeRoute: RouteResult | null = useMemo(() => {
    if (!currentPlace) return null;

    if (emergencyMode) {
      if (destinationPlace && destinationPlace.isEmergencyExit) {
        return calculateIndoorRoute(dataset, currentPlace, destinationPlace, {
          wheelchairFriendly: wheelchairMode,
          dangerZones: activeDangerZones,
          isEmergencyEvacuation: true,
        });
      }
      return findNearestSafeExitRoute(dataset, currentPlace, {
        wheelchairFriendly: wheelchairMode,
        dangerZones: activeDangerZones,
      });
    }

    if (!destinationPlace) return null;
    return calculateIndoorRoute(dataset, currentPlace, destinationPlace, {
      wheelchairFriendly: wheelchairMode,
      dangerZones: [],
      isEmergencyEvacuation: false,
    });
  }, [
    dataset,
    currentPlace,
    destinationPlace,
    wheelchairMode,
    emergencyMode,
    activeDangerZones,
  ]);

  // Search filtering across all 4 floors in all 3 languages + keywords
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return dataset.places
      .filter((p) => {
        return (
          p.name.en.toLowerCase().includes(q) ||
          p.name.te.toLowerCase().includes(q) ||
          p.name.hi.toLowerCase().includes(q) ||
          p.description.en.toLowerCase().includes(q) ||
          CATEGORY_LABELS[p.category][language].toLowerCase().includes(q) ||
          p.floor.toLowerCase().includes(q) ||
          p.keywords.some((k) => k.toLowerCase().includes(q))
        );
      })
      .slice(0, 12);
  }, [dataset.places, searchQuery, language]);

  // Places on the currently visible floor for quick directory browsing
  const activeFloorPlaces = useMemo(() => {
    return dataset.places.filter(
      (p) =>
        p.floor === activeFloor &&
        (directoryFilter === 'all' || p.category === directoryFilter)
    );
  }, [dataset.places, activeFloor, directoryFilter]);

  const floorCategories = useMemo(() => {
    const set = new Set<Place['category']>();
    for (const p of dataset.places) {
      if (p.floor === activeFloor) set.add(p.category);
    }
    return Array.from(set);
  }, [dataset.places, activeFloor]);

  const handleSelectPlace = (place: Place) => {
    setSelectedPlaceId(place.id);
    setActiveFloor(place.floor);
    setSearchFocused(false);
    setSearchQuery('');
  };

  const handleNavigateToPlace = (place: Place) => {
    if (!currentLocationId) {
      setCurrentLocationId(dataset.defaultStartPlaceId);
    }
    if (emergencyMode && !place.isEmergencyExit) {
      setEmergencyMode(false);
    }
    setSelectedPlaceId(place.id);
    setDestinationPlaceId(place.id);
    const startFloor = currentPlace?.floor ?? 'GF';
    setActiveFloor(startFloor);
  };

  const handleSetCurrentLocation = (place: Place, viaQR = false) => {
    setCurrentLocationId(place.id);
    setActiveFloor(place.floor);
    if (viaQR) {
      setQrToast(`${t.qrScannedSuccess}: ${place.name[language]} (${place.floor})`);
      if (qrToastTimerRef.current !== null) {
        window.clearTimeout(qrToastTimerRef.current);
      }
      qrToastTimerRef.current = window.setTimeout(() => {
        setQrToast(null);
        qrToastTimerRef.current = null;
      }, 4000);
    }
  };

  const handleToggleEmergencyMode = () => {
    if (emergencyMode) {
      setEmergencyMode(false);
      setDestinationPlaceId(null);
      return;
    }
    setEmergencyMode(true);
    setDestinationPlaceId(null);
    const scenario =
      dataset.emergencyScenarios.find((s) => s.id === activeScenarioId) ??
      dataset.emergencyScenarios[0];
    if (currentPlace) {
      setActiveFloor(currentPlace.floor);
    } else if (scenario && scenario.affectedFloors[0]) {
      setActiveFloor(scenario.affectedFloors[0]);
    }
  };

  const handleAssistantFocusPlace = (placeId: string, startNav: boolean) => {
    const place = placeMap.get(placeId);
    if (!place) return;
    setSelectedPlaceId(place.id);
    if (startNav) {
      handleNavigateToPlace(place);
    } else {
      setActiveFloor(place.floor);
    }
  };

  const handleTriggerSafeExit = () => {
    setEmergencyMode(true);
    setDestinationPlaceId(null);
    if (!currentLocationId) {
      setCurrentLocationId(dataset.defaultStartPlaceId);
    }
  };

  const placesByFloor = useMemo(() => {
    const grouped: Record<FloorId, Place[]> = { GF: [], '1F': [], '2F': [], '3F': [] };
    for (const p of dataset.places) grouped[p.floor].push(p);
    return grouped;
  }, [dataset.places]);

  return (
    <div className="min-h-screen h-screen flex flex-col bg-[#fbf8f3] text-[#111111] overflow-hidden">
      {/* TOP NAVIGATION BAR */}
      <header className="shrink-0 z-30 bg-[#fbf8f3] border-b border-brand-borderWarm px-3 sm:px-5 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Left: Home + Brand + Building Switcher */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-neutral-700 hover:text-brand-maroon bg-white border border-brand-borderWarm hover:border-brand-maroon/40 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.backToHome}</span>
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-brand-maroon text-white flex items-center justify-center shrink-0 shadow-xs">
                {dataset.id === 'mall' ? (
                  <Store className="w-4 h-4" />
                ) : (
                  <Hospital className="w-4 h-4" />
                )}
              </div>
              <div className="min-w-0">
                <h1 className="font-serif-heading text-base sm:text-lg font-bold text-neutral-950 leading-tight truncate">
                  {dataset.name[language]}
                </h1>
                <p className="hidden lg:block text-[11px] text-neutral-500 truncate">
                  {dataset.tagline[language]}
                </p>
              </div>
            </div>

            {/* Switch Environment Segmented Control */}
            <div className="hidden md:flex items-center p-0.5 rounded-full bg-brand-creambg border border-brand-borderWarm ml-2 shrink-0">
              <button
                type="button"
                onClick={() => onSwitchBuilding('mall')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  dataset.id === 'mall'
                    ? 'bg-brand-maroon text-white shadow-xs'
                    : 'text-neutral-700 hover:text-neutral-950'
                }`}
              >
                {t.switchToMall}
              </button>
              <button
                type="button"
                onClick={() => onSwitchBuilding('hospital')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  dataset.id === 'hospital'
                    ? 'bg-neutral-950 text-white shadow-xs'
                    : 'text-neutral-700 hover:text-neutral-950'
                }`}
              >
                {t.switchToHospital}
              </button>
            </div>
          </div>

          {/* Right: Language Switcher, Wheelchair Mode, Emergency SOS */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Language Switcher: English / Telugu / Hindi */}
            <div
              className="flex items-center p-0.5 rounded-full bg-white border border-brand-borderWarm"
              role="group"
              aria-label="Language selection"
            >
              {(
                [
                  ['en', 'EN'],
                  ['te', 'తెలుగు'],
                  ['hi', 'हिन्दी'],
                ] as const
              ).map(([code, label]) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLanguage(code)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    language === code
                      ? 'bg-brand-teal text-white'
                      : 'text-neutral-700 hover:text-neutral-950'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Wheelchair-Friendly Toggle */}
            <button
              type="button"
              onClick={() => setWheelchairMode((v) => !v)}
              aria-pressed={wheelchairMode}
              title={t.wheelchairModeDesc}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                wheelchairMode
                  ? 'bg-brand-teal text-white border-brand-tealDark shadow-xs'
                  : 'bg-white text-neutral-800 border-brand-borderWarm hover:border-brand-teal'
              }`}
            >
              <Accessibility className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.wheelchairMode}</span>
            </button>

            {/* Emergency Mode Button */}
            <button
              type="button"
              onClick={handleToggleEmergencyMode}
              aria-pressed={emergencyMode}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                emergencyMode
                  ? 'bg-neutral-950 text-white hover:bg-neutral-800'
                  : 'bg-red-700 text-white hover:bg-red-800'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{emergencyMode ? t.exitEmergencyMode : t.emergencyMode}</span>
            </button>

            {/* Mobile sidebar toggle */}
            <button
              type="button"
              onClick={() => setMobilePanelOpen((v) => !v)}
              className="lg:hidden inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-brand-borderWarm text-neutral-800 cursor-pointer"
              aria-label={mobilePanelOpen ? t.closeControls : t.openControls}
            >
              {mobilePanelOpen ? (
                <PanelLeftClose className="w-4 h-4" />
              ) : (
                <PanelLeftOpen className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile building switcher */}
        <div className="flex md:hidden items-center gap-2 mt-2">
          <button
            type="button"
            onClick={() => onSwitchBuilding('mall')}
            className={`flex-1 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              dataset.id === 'mall'
                ? 'bg-brand-maroon text-white'
                : 'bg-white text-neutral-700 border border-brand-borderWarm'
            }`}
          >
            {t.switchToMall}
          </button>
          <button
            type="button"
            onClick={() => onSwitchBuilding('hospital')}
            className={`flex-1 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              dataset.id === 'hospital'
                ? 'bg-neutral-950 text-white'
                : 'bg-white text-neutral-700 border border-brand-borderWarm'
            }`}
          >
            {t.switchToHospital}
          </button>
        </div>
      </header>

      {/* PROTOTYPE EMERGENCY BANNER (when Emergency Mode is active) */}
      {emergencyMode && (
        <div className="shrink-0 z-20 bg-red-800 text-white px-4 py-2.5 border-b border-red-900">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5">
            <div className="flex items-start gap-2.5 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold tracking-wide">{t.emergencyPrototypeBanner}</p>
                {activeScenario && (
                  <p className="text-red-100">{activeScenario.alertBanner[language]}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <select
                value={activeScenarioId}
                onChange={(e) => {
                  const nextId = e.target.value;
                  setActiveScenarioId(nextId);
                  const sc = dataset.emergencyScenarios.find((s) => s.id === nextId);
                  if (sc?.affectedFloors[0]) setActiveFloor(sc.affectedFloors[0]);
                }}
                aria-label={t.selectScenario}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-950/80 text-white border border-red-400/50 focus:outline-none"
              >
                {dataset.emergencyScenarios.map((sc) => (
                  <option key={sc.id} value={sc.id}>
                    {sc.title[language]}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setIsSosModalOpen(true)}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white text-red-800 hover:bg-red-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                {t.requestSOS}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Scan Confirmation Banner */}
      {qrToast && (
        <div className="shrink-0 bg-brand-teal text-white px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{qrToast}</span>
        </div>
      )}

      {/* MAIN WORKSPACE BODY */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* LEFT CONTROL SIDEBAR */}
        <aside
          className={`${
            mobilePanelOpen ? 'flex' : 'hidden lg:flex'
          } flex-col w-full sm:w-[370px] lg:w-[390px] shrink-0 bg-[#fbf8f3] border-r border-brand-borderWarm overflow-y-auto z-20 absolute lg:static inset-y-0 left-0 shadow-xl lg:shadow-none`}
        >
          <div className="p-4 space-y-4">
            {/* 1. SMART LIVE SEARCH */}
            <div ref={searchContainerRef} className="relative">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setSearchFocused(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchFocused(true);
                  }}
                  placeholder={t.searchPlaceholder}
                  className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white border border-brand-borderWarm text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-maroon/30 focus:border-brand-maroon shadow-xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSearchFocused(false);
                    }}
                    className="absolute right-3 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                    aria-label={t.close}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Autocomplete Search Results Dropdown */}
              {searchFocused && searchQuery.trim().length > 0 && (
                <div className="absolute left-0 right-0 mt-1.5 bg-white rounded-2xl border border-brand-borderWarm shadow-xl z-30 max-h-72 overflow-y-auto divide-y divide-brand-borderLight">
                  {searchResults.length === 0 ? (
                    <div className="p-4 text-xs text-neutral-500 text-center">
                      {t.searchNoResults}
                    </div>
                  ) : (
                    searchResults.map((place) => (
                      <button
                        key={place.id}
                        type="button"
                        onClick={() => handleSelectPlace(place)}
                        className="w-full px-3.5 py-2.5 text-left hover:bg-brand-creambg transition-colors flex items-center justify-between gap-2 cursor-pointer"
                      >
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-semibold text-neutral-900 truncate">
                            {place.name[language]}
                          </p>
                          <p className="text-[11px] text-neutral-500 truncate">
                            {CATEGORY_LABELS[place.category][language]} ·{' '}
                            {FLOOR_FULL_LABELS[place.floor][language]}
                          </p>
                        </div>
                        <span className="shrink-0 text-xs font-bold text-brand-maroon font-mono">
                          {place.floor}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* 2. CURRENT LOCATION & QR CHECKPOINT SELECTOR */}
            <div
              className={`p-3.5 rounded-2xl border ${
                emergencyMode && !currentPlace
                  ? 'bg-red-50 border-red-400'
                  : 'bg-white border-brand-borderWarm'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <label
                  htmlFor="current-location-select"
                  className="text-xs font-bold text-neutral-800 flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-sky-600" />
                  {t.currentLocation}
                </label>
                <button
                  type="button"
                  onClick={() => setIsQrModalOpen(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-brand-creambg hover:bg-brand-cardcream text-brand-maroon border border-brand-borderWarm transition-colors cursor-pointer"
                >
                  <QrCode className="w-3 h-3" />
                  {t.scanQR}
                </button>
              </div>

              {emergencyMode && !currentPlace && (
                <p className="text-xs font-semibold text-red-700 mb-2">
                  {t.promptLocationForEmergency}
                </p>
              )}

              <select
                id="current-location-select"
                value={currentLocationId ?? ''}
                onChange={(e) => {
                  const p = placeMap.get(e.target.value);
                  if (p) handleSetCurrentLocation(p, false);
                  else setCurrentLocationId(null);
                }}
                className="w-full px-3 py-2 rounded-xl bg-brand-creambg border border-brand-borderWarm text-xs sm:text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-maroon/30"
              >
                <option value="">{t.selectCurrentLocation}...</option>
                {dataset.floors.map((fl) => (
                  <optgroup key={fl.id} label={fl.fullName[language]}>
                    {placesByFloor[fl.id].map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name[language]} ({p.floor})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* 3. EMERGENCY SAFE EXIT SUMMARY (when Emergency Mode active) */}
            {emergencyMode && activeScenario && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-serif-heading text-sm font-bold text-red-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-700" />
                    {t.dangerZonesActive}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsSosModalOpen(true)}
                    className="text-xs font-bold text-red-700 hover:underline cursor-pointer"
                  >
                    {t.requestSOS} →
                  </button>
                </div>
                <div className="space-y-2">
                  {activeScenario.dangerZones.map((dz) => (
                    <button
                      key={dz.id}
                      type="button"
                      onClick={() => setActiveFloor(dz.floor)}
                      className="w-full text-left p-2.5 rounded-xl bg-white border border-red-200 hover:border-red-400 transition-colors cursor-pointer"
                    >
                      <p className="text-xs font-bold text-red-900">
                        {dz.label[language]} ({dz.floor})
                      </p>
                      <p className="text-[11px] text-neutral-600 mt-0.5">
                        {dz.description[language]}
                      </p>
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-red-800">{t.blockedPathsNote}</p>
              </div>
            )}

            {/* 4. ACTIVE ROUTE & TURN-BY-TURN DIRECTIONS */}
            {activeRoute && (
              <div
                className={`p-4 rounded-2xl border space-y-3 ${
                  activeRoute.isEmergencyEvacuation
                    ? 'bg-emerald-50/70 border-emerald-300'
                    : 'bg-white border-brand-borderWarm shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-serif-heading text-base font-bold text-neutral-950 flex items-center gap-1.5">
                      <Route
                        className={`w-4 h-4 ${
                          activeRoute.isEmergencyEvacuation
                            ? 'text-emerald-700'
                            : 'text-brand-maroon'
                        }`}
                      />
                      {activeRoute.isEmergencyEvacuation
                        ? t.evacuationRouteBadge
                        : t.activeRoute}
                    </h3>
                    <p className="text-xs text-neutral-600 mt-0.5">
                      {activeRoute.startPlace.name[language]} ({activeRoute.startPlace.floor}) →{' '}
                      <strong className="text-neutral-900">
                        {activeRoute.endPlace.name[language]} ({activeRoute.endPlace.floor})
                      </strong>
                    </p>
                  </div>
                  {!emergencyMode && (
                    <button
                      type="button"
                      onClick={() => setDestinationPlaceId(null)}
                      className="text-xs font-semibold text-neutral-500 hover:text-brand-maroon cursor-pointer shrink-0"
                    >
                      {t.clearRoute}
                    </button>
                  )}
                </div>

                {!activeRoute.found ? (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs leading-relaxed">
                    {activeRoute.reason === 'no_accessible_route'
                      ? t.noAccessibleRouteError
                      : activeRoute.reason === 'same_location'
                        ? t.sameLocationNote
                        : t.blockedByHazardError}
                  </div>
                ) : (
                  <>
                    {/* Metrics Row */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="p-2.5 rounded-xl bg-brand-creambg border border-brand-borderLight">
                        <p className="text-[11px] text-neutral-500">{t.distanceLabel}</p>
                        <p className="text-sm font-bold text-neutral-950 font-mono tabular-nums">
                          {activeRoute.totalDistanceMeters} {t.metersShort}
                        </p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-brand-creambg border border-brand-borderLight">
                        <p className="text-[11px] text-neutral-500">{t.etaLabel}</p>
                        <p className="text-sm font-bold text-neutral-950 font-mono tabular-nums">
                          ~{activeRoute.estimatedMinutes} {t.minutesShort}
                        </p>
                      </div>
                    </div>

                    {/* Wheelchair confirmation notice */}
                    {activeRoute.wheelchairFriendly && (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-tealDark">
                        <Accessibility className="w-3.5 h-3.5" />
                        <span>{t.stepFreeVerified}</span>
                      </div>
                    )}

                    {/* Involved Floors Switcher */}
                    <div>
                      <p className="text-[11px] font-semibold text-neutral-500 mb-1.5">
                        {t.floorsInvolved} ({t.tapFloorToInspect})
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {activeRoute.floorsInvolved.map((fl, idx) => (
                          <React.Fragment key={fl}>
                            <button
                              type="button"
                              onClick={() => setActiveFloor(fl)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                                activeFloor === fl
                                  ? activeRoute.isEmergencyEvacuation
                                    ? 'bg-emerald-700 text-white'
                                    : 'bg-brand-maroon text-white'
                                  : 'bg-brand-creambg text-neutral-800 border border-brand-borderWarm hover:bg-brand-cardcream'
                              }`}
                            >
                              {fl}
                            </button>
                            {idx < activeRoute.floorsInvolved.length - 1 && (
                              <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    {/* Step-by-Step Directions */}
                    <div className="pt-1 border-t border-brand-borderLight">
                      <p className="text-xs font-bold text-neutral-800 mb-2">
                        {t.stepByStepDirections}
                      </p>
                      <ol className="space-y-2">
                        {activeRoute.steps.map((step, i) => (
                          <li key={step.id}>
                            <button
                              type="button"
                              onClick={() => setActiveFloor(step.floor)}
                              className={`w-full text-left p-2.5 rounded-xl border transition-colors flex items-start gap-2.5 cursor-pointer ${
                                activeFloor === step.floor
                                  ? 'bg-brand-creambg border-brand-borderWarm'
                                  : 'bg-white border-brand-borderLight hover:bg-brand-cream'
                              }`}
                            >
                              <span
                                className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 tabular-nums ${
                                  step.type === 'floor_change'
                                    ? 'bg-sky-600 text-white'
                                    : step.type === 'evacuate'
                                      ? 'bg-emerald-700 text-white'
                                      : step.type === 'arrive'
                                        ? 'bg-brand-maroon text-white'
                                        : 'bg-neutral-200 text-neutral-800'
                                }`}
                              >
                                {step.type === 'floor_change' ? (
                                  <ArrowUpDown className="w-3 h-3" />
                                ) : (
                                  i + 1
                                )}
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs text-neutral-800 leading-snug">
                                  {step.instruction[language]}
                                </p>
                                <p className="text-[10px] text-neutral-500 mt-0.5 font-mono">
                                  {step.floor}
                                  {step.distanceMeters > 0
                                    ? ` · ${step.distanceMeters}${t.metersShort}`
                                    : ''}
                                </p>
                              </div>
                            </button>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* 5. SELECTED PLACE DETAILS CARD */}
            {selectedPlace ? (
              <div className="p-4 rounded-2xl bg-white border border-brand-borderWarm shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-medium text-neutral-500">
                      {CATEGORY_LABELS[selectedPlace.category][language]} ·{' '}
                      {FLOOR_FULL_LABELS[selectedPlace.floor][language]}
                    </p>
                    <h3 className="font-serif-heading text-lg font-bold text-neutral-950 mt-0.5">
                      {selectedPlace.name[language]}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedPlaceId(null)}
                    aria-label={t.close}
                    className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {selectedPlace.description[language]}
                </p>

                <div className="text-xs text-neutral-600 flex items-center gap-1.5">
                  <Accessibility
                    className={`w-3.5 h-3.5 ${
                      selectedPlace.wheelchairAccessible
                        ? 'text-brand-tealDark'
                        : 'text-amber-600'
                    }`}
                  />
                  <span>
                    {selectedPlace.wheelchairAccessible
                      ? t.wheelchairAccessibleYes
                      : t.wheelchairAccessibleNo}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleNavigateToPlace(selectedPlace)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold text-white bg-brand-maroon hover:bg-brand-maroonHover transition-colors cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    {t.navigateHere}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetCurrentLocation(selectedPlace, false)}
                    className="px-3.5 py-2.5 rounded-full text-xs font-semibold text-neutral-800 bg-brand-creambg hover:bg-brand-cardcream border border-brand-borderWarm transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {t.setAsCurrentLocation}
                  </button>
                </div>
              </div>
            ) : (
              !activeRoute && (
                <div className="p-4 rounded-2xl bg-white/80 border border-brand-borderLight text-xs text-neutral-600 flex items-start gap-2.5">
                  <Compass className="w-4 h-4 text-brand-maroon shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{t.selectDestinationPrompt}</p>
                </div>
              )
            )}

            {/* 6. QUICK DIRECTORY FOR ACTIVE FLOOR */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <h3 className="font-serif-heading text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-brand-maroon" />
                  {t.quickDirectory} · {activeFloor}
                </h3>
                <span className="text-[11px] text-neutral-500 font-mono tabular-nums">
                  {activeFloorPlaces.length}
                </span>
              </div>

              {/* Category Filter Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setDirectoryFilter('all')}
                  className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                    directoryFilter === 'all'
                      ? 'bg-neutral-900 text-white'
                      : 'bg-white text-neutral-700 border border-brand-borderWarm hover:bg-brand-creambg'
                  }`}
                >
                  {t.allCategories}
                </button>
                {floorCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setDirectoryFilter(cat)}
                    className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      directoryFilter === cat
                        ? 'bg-brand-maroon text-white'
                        : 'bg-white text-neutral-700 border border-brand-borderWarm hover:bg-brand-creambg'
                    }`}
                  >
                    {CATEGORY_LABELS[cat][language]}
                  </button>
                ))}
              </div>

              {/* Directory Place List */}
              <div className="space-y-1.5">
                {activeFloorPlaces.map((place) => {
                  const isSel = selectedPlaceId === place.id;
                  const isCur = currentLocationId === place.id;
                  return (
                    <button
                      key={place.id}
                      type="button"
                      onClick={() => {
                        handleSelectPlace(place);
                        if (window.innerWidth < 1024) setMobilePanelOpen(false);
                      }}
                      className={`w-full px-3 py-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                        isSel
                          ? 'bg-brand-maroon/5 border-brand-maroon text-neutral-950'
                          : 'bg-white border-brand-borderLight hover:border-brand-borderWarm text-neutral-800'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate">
                          {place.name[language]}
                        </p>
                        <p className="text-[11px] text-neutral-500 truncate">
                          {CATEGORY_LABELS[place.category][language]}
                          {isCur ? ` · ${t.youAreHere}` : ''}
                        </p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT INTERACTIVE FLOOR MAP CANVAS */}
        <main className="flex-1 min-w-0 relative flex flex-col">
          <FloorMapCanvas
            dataset={dataset}
            activeFloor={activeFloor}
            onFloorChange={(fl) => {
              setActiveFloor(fl);
              setDirectoryFilter('all');
            }}
            language={language}
            currentPlace={currentPlace}
            selectedPlace={selectedPlace}
            onSelectPlace={(p) => setSelectedPlaceId(p.id)}
            onNavigateToPlace={handleNavigateToPlace}
            route={activeRoute}
            emergencyMode={emergencyMode}
            dangerZones={activeDangerZones}
          />
        </main>
      </div>

      {/* FLOATING AI ASSISTANT LAUNCHER BUTTON */}
      {!isAssistantOpen && (
        <button
          type="button"
          onClick={() => setIsAssistantOpen(true)}
          className="fixed bottom-14 right-4 z-40 inline-flex items-center gap-2 px-4 py-3 rounded-full bg-brand-maroon hover:bg-brand-maroonHover text-white text-xs font-semibold shadow-xl hover:shadow-2xl transition-all active:scale-95 cursor-pointer"
        >
          <Bot className="w-4 h-4" />
          <span>{t.aiAssistantTitle}</span>
        </button>
      )}

      {/* AI ASSISTANT PANEL */}
      <AIAssistantPanel
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        dataset={dataset}
        language={language}
        currentPlace={currentPlace}
        wheelchairMode={wheelchairMode}
        emergencyMode={emergencyMode}
        activeScenario={activeScenario}
        onFocusPlace={handleAssistantFocusPlace}
        onTriggerSafeExit={handleTriggerSafeExit}
      />

      {/* QR CHECKPOINT MODAL */}
      <QrCheckpointModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        dataset={dataset}
        language={language}
        onSelectCheckpoint={(place) => handleSetCurrentLocation(place, true)}
      />

      {/* SOS PROTOTYPE MODAL */}
      <EmergencySosModal
        isOpen={isSosModalOpen}
        onClose={() => setIsSosModalOpen(false)}
        dataset={dataset}
        language={language}
        currentPlace={currentPlace}
        wheelchairMode={wheelchairMode}
      />
    </div>
  );
};
