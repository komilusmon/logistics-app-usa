import React, { useState } from 'react';
import { Header } from './components/Header';
import { StateSearchBar } from './components/StateSearchBar';
import { GoogleMapsViewer } from './components/GoogleMapsViewer';
import { RealUsMapViewer } from './components/RealUsMapViewer';
import { UsMapViewer } from './components/UsMapViewer';
import { StateDetailCard } from './components/StateDetailCard';
import { StateDirectory } from './components/StateDirectory';
import { DispatcherQuiz } from './components/DispatcherQuiz';
import { RoutePlanner } from './components/RoutePlanner';
import { US_STATES, STATES_BY_ID } from './data/states';
import { StateData } from './types/state';
import { Map, BookOpen, Award, Navigation, Globe, Radio, Layers, Route } from 'lucide-react';

type MapEngine = 'real' | 'google' | 'svg';

export default function App() {
  const [selectedState, setSelectedState] = useState<StateData>(STATES_BY_ID.get('TX') || US_STATES[0]);
  const [activeTab, setActiveTab] = useState<'map' | 'directory' | 'quiz' | 'route'>('map');
  const [mapEngine, setMapEngine] = useState<MapEngine>('real');
  const [routeStateIds, setRouteStateIds] = useState<string[]>([]);

  const handleStateSelect = (state: StateData) => {
    setSelectedState(state);
    if (activeTab !== 'map' && activeTab !== 'directory') {
      setActiveTab('map');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <TabButton active={activeTab === 'map'} onClick={() => setActiveTab('map')} icon={<Map className="w-4 h-4" />}>
              Qidiruv & Xarita
            </TabButton>
            <TabButton active={activeTab === 'directory'} onClick={() => setActiveTab('directory')} icon={<BookOpen className="w-4 h-4" />}>
              Shtatlar Katalogi
            </TabButton>
            <TabButton active={activeTab === 'quiz'} onClick={() => setActiveTab('quiz')} icon={<Award className="w-4 h-4" />}>
              Savol-Javob (Quiz)
            </TabButton>
            <TabButton active={activeTab === 'route'} onClick={() => setActiveTab('route')} icon={<Navigation className="w-4 h-4" />}>
              Fura Yo'l Qidiruv
            </TabButton>
          </div>

          {selectedState && (
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Aktiv Shtat:</span>
              <strong className="text-amber-400 font-mono">{selectedState.id}</strong>
              <span className="text-slate-400">({selectedState.name})</span>
            </div>
          )}
        </div>

        {activeTab === 'map' && (
          <div className="space-y-6">
            <StateSearchBar onStateFound={setSelectedState} selectedState={selectedState} />

            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  Xarita Turi:
                </span>
                <MapModeButton
                  active={mapEngine === 'real'}
                  onClick={() => setMapEngine('real')}
                  icon={<Route className="w-3.5 h-3.5" />}
                  label="Real Chegaralar (GeoJSON)"
                  activeClass="bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25"
                />
                <MapModeButton
                  active={mapEngine === 'google'}
                  onClick={() => setMapEngine('google')}
                  icon={<Radio className="w-3.5 h-3.5" />}
                  label="Google Maps"
                  activeClass="bg-sky-500 text-slate-950 shadow-md shadow-sky-500/25"
                />
                <MapModeButton
                  active={mapEngine === 'svg'}
                  onClick={() => setMapEngine('svg')}
                  icon={<Layers className="w-3.5 h-3.5" />}
                  label="Sxematik"
                  activeClass="bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25"
                />
              </div>
              <div className="text-[11px] text-slate-400">
                {mapEngine === 'real' && 'Census Bureau haqiqiy chegaralar'}
                {mapEngine === 'google' && 'Google Maps JavaScript API'}
                {mapEngine === 'svg' && 'Sxematik vektor xarita'}
              </div>
            </div>

            {mapEngine === 'real' && (
              <RealUsMapViewer
                selectedState={selectedState}
                onSelectState={setSelectedState}
                routeStateIds={routeStateIds}
              />
            )}
            {mapEngine === 'google' && (
              <GoogleMapsViewer
                selectedState={selectedState}
                onSelectState={setSelectedState}
              />
            )}
            {mapEngine === 'svg' && (
              <UsMapViewer
                selectedState={selectedState}
                onSelectState={setSelectedState}
              />
            )}

            {selectedState && (
              <StateDetailCard
                state={selectedState}
                onSelectNeighbor={setSelectedState}
              />
            )}
          </div>
        )}

        {activeTab === 'directory' && (
          <StateDirectory
            onSelectState={(st) => {
              setSelectedState(st);
              setActiveTab('map');
            }}
            selectedStateId={selectedState?.id}
          />
        )}

        {activeTab === 'quiz' && (
          <DispatcherQuiz
            onInspectState={(st) => {
              setSelectedState(st);
              setActiveTab('map');
            }}
          />
        )}

        {activeTab === 'route' && (
          <RoutePlanner
            onSelectState={(st) => {
              setSelectedState(st);
              setActiveTab('map');
              setMapEngine('real');
            }}
            onRouteStatesChange={setRouteStateIds}
          />
        )}
      </main>

      <footer className="w-full bg-slate-900/80 border-t border-slate-800/80 py-6 mt-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white">US Logistics States</span>
            <span className="text-slate-600">|</span>
            <span>Vercel web app • Real xarita • Fura yo'l qidiruv</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Dasturchi:</span>
            <span className="font-mono font-bold text-amber-400 px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
              @komilusmondev
            </span>
          </div>
          <div className="text-slate-500 text-[11px]">
            50 ta Shtat + 6 ta Hudud • Deploy: Vercel
          </div>
        </div>
      </footer>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
        active
          ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25'
          : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
      }`}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}

function MapModeButton({
  active,
  onClick,
  icon,
  label,
  activeClass,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  activeClass: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
        active ? activeClass : 'bg-slate-950 text-slate-400 hover:text-white'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
