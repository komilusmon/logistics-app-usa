import React, { useState } from 'react';
import { Header } from './components/Header';
import { StateSearchBar } from './components/StateSearchBar';
import { UsMapViewer } from './components/UsMapViewer';
import { StateDetailCard } from './components/StateDetailCard';
import { StateDirectory } from './components/StateDirectory';
import { DispatcherQuiz } from './components/DispatcherQuiz';
import { RoutePlanner } from './components/RoutePlanner';
import { US_STATES, STATES_BY_ID } from './data/states';
import { StateData } from './types/state';
import { Map, BookOpen, Award, Navigation, Heart, ExternalLink } from 'lucide-react';

export default function App() {
  // Default selected state is Texas (TX) - the heart of US freight
  const [selectedState, setSelectedState] = useState<StateData>(STATES_BY_ID.get('TX') || US_STATES[0]);
  const [activeTab, setActiveTab] = useState<'map' | 'directory' | 'quiz' | 'route'>('map');

  const handleStateSelect = (state: StateData) => {
    setSelectedState(state);
    // If user is on another tab, we can let them inspect on map
    if (activeTab !== 'map' && activeTab !== 'directory') {
      setActiveTab('map');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navigation & Live Time Clocks */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeTab === 'map'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>Qidiruv & Xarita</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('directory')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeTab === 'directory'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Shtatlar Katalogi (56 ta)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeTab === 'quiz'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Dispetcher Mashqi (Quiz)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('route')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeTab === 'route'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Navigation className="w-4 h-4" />
              <span>Yo'nalish Tranziti</span>
            </button>
          </div>

          {/* Active State badge summary */}
          {selectedState && (
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Aktiv Shtat:</span>
              <strong className="text-amber-400 font-mono">{selectedState.id}</strong>
              <span className="text-slate-400">({selectedState.name})</span>
            </div>
          )}
        </div>

        {/* Tab 1: Map & Search View */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            {/* Search Input Bar */}
            <StateSearchBar
              onStateFound={setSelectedState}
              selectedState={selectedState}
            />

            {/* Interactive US SVG Map */}
            <UsMapViewer
              selectedState={selectedState}
              onSelectState={setSelectedState}
            />

            {/* Full Logistics Sheet for the State */}
            {selectedState && (
              <StateDetailCard
                state={selectedState}
                onSelectNeighbor={setSelectedState}
              />
            )}
          </div>
        )}

        {/* Tab 2: Directory / Cheat Sheet */}
        {activeTab === 'directory' && (
          <div className="space-y-6">
            <StateDirectory
              onSelectState={(st) => {
                setSelectedState(st);
                setActiveTab('map');
              }}
              selectedStateId={selectedState?.id}
            />
          </div>
        )}

        {/* Tab 3: Dispatcher Quiz & Flashcards */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            <DispatcherQuiz
              onInspectState={(st) => {
                setSelectedState(st);
                setActiveTab('map');
              }}
            />
          </div>
        )}

        {/* Tab 4: Route Transit Advisor */}
        {activeTab === 'route' && (
          <div className="space-y-6">
            <RoutePlanner
              onSelectState={(st) => {
                setSelectedState(st);
                setActiveTab('map');
              }}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-slate-900/80 border-t border-slate-800/80 py-6 mt-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white">US Logistics States</span>
            <span className="text-slate-600">|</span>
            <span>AQSh shtatlari qisqartmalari va dispetcherlar tizimi</span>
          </div>

          <div className="flex items-center gap-2">
            <span>Dasturchi:</span>
            <span className="font-mono font-bold text-amber-400 px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
              @komilusmondev
            </span>
          </div>

          <div className="text-slate-500 text-[11px]">
            50 ta Shtat + 6 ta Hudud (AL dan WY, PR, GU, VI, MP, AS, TT gacha)
          </div>
        </div>
      </footer>
    </div>
  );
}
