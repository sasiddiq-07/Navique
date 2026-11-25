import { useState } from 'react';
import { BuildingId, WorkspaceLaunchOptions } from './types/navigation';
import { MALL_DATASET } from './data/mallData';
import { HOSPITAL_DATASET } from './data/hospitalData';
import { LandingPage } from './components/LandingPage';
import { NavigationWorkspace } from './components/NavigationWorkspace';

export default function App() {
  const [activeView, setActiveView] = useState<'landing' | BuildingId>('landing');
  const [launchOptions, setLaunchOptions] = useState<WorkspaceLaunchOptions>({});

  const handleOpenBuilding = (
    building: BuildingId,
    options: WorkspaceLaunchOptions = {}
  ) => {
    setLaunchOptions(options);
    setActiveView(building);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const handleSwitchBuilding = (building: BuildingId) => {
    setLaunchOptions({});
    setActiveView(building);
  };

  if (activeView === 'landing') {
    return <LandingPage onOpenBuilding={handleOpenBuilding} />;
  }

  const dataset = activeView === 'mall' ? MALL_DATASET : HOSPITAL_DATASET;

  return (
    <NavigationWorkspace
      key={activeView}
      dataset={dataset}
      onBackToHome={() => {
        setLaunchOptions({});
        setActiveView('landing');
      }}
      onSwitchBuilding={handleSwitchBuilding}
      initialEmergency={Boolean(launchOptions.emergency)}
      initialOpenAssistant={Boolean(launchOptions.openAssistant)}
      initialOpenSOS={Boolean(launchOptions.openSOS)}
    />
  );
}
