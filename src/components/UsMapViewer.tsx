import React, { useState } from 'react';
import { StateData, FreightHubPin, InterstateCorridor } from '../types/state';
import { US_STATES } from '../data/states';
import { US_MAP_PATHS, MAJOR_FREIGHT_HUBS, MAJOR_CORRIDORS } from '../data/usMapPaths';
import {
  Compass, ZoomIn, ZoomOut, RotateCcw,
  Layers, MapPin, Truck, AlertTriangle, Snowflake, ShieldAlert, FileText, Check
} from 'lucide-react';

interface UsMapViewerProps {
  selectedState: StateData | null;
  onSelectState: (state: StateData) => void;
}

type MapLayer = 'standard' | 'timezones' | 'chainlaws' | 'permits';

export const UsMapViewer: React.FC<UsMapViewerProps> = ({ selectedState, onSelectState }) => {
  const [hoveredStateId, setHoveredStateId] = useState<string | null>(null);
  const [activeLayer, setActiveLayer] = useState<MapLayer>('standard');
  const [showHubs, setShowHubs] = useState<boolean>(true);
  const [showCorridors, setShowCorridors] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredHub, setHoveredHub] = useState<FreightHubPin | null>(null);

  // Determine state relations
  const isSelected = (id: string) => selectedState?.id === id;
  const isNeighbor = (id: string) => selectedState?.borderingStates.includes(id) ?? false;

  const territories = US_STATES.filter(s => s.isTerritory);

  const hoveredState = hoveredStateId
    ? US_STATES.find(s => s.id === hoveredStateId)
    : null;

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2.0));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.8));
  const handleResetZoom = () => setZoomLevel(1);

  // Compute state color based on active layer
  const getStateFillAndStroke = (stateId: string) => {
    const state = US_STATES.find(s => s.id === stateId);
    const active = isSelected(stateId);
    const neighbor = isNeighbor(stateId);
    const isHovered = hoveredStateId === stateId;

    if (active) {
      return { fill: 'url(#selectedGlow)', stroke: '#fbbf24', strokeWidth: 2.8 };
    }

    if (activeLayer === 'timezones' && state) {
      if (state.timeZoneName.includes('EST')) {
        return { fill: '#312e81', stroke: '#6366f1', strokeWidth: 1.2 }; // Indigo
      } else if (state.timeZoneName.includes('CST')) {
        return { fill: '#064e3b', stroke: '#10b981', strokeWidth: 1.2 }; // Emerald
      } else if (state.timeZoneName.includes('MST')) {
        return { fill: '#78350f', stroke: '#f59e0b', strokeWidth: 1.2 }; // Amber
      } else if (state.timeZoneName.includes('PST')) {
        return { fill: '#0c4a6e', stroke: '#0284c7', strokeWidth: 1.2 }; // Sky
      } else {
        return { fill: '#4c1d95', stroke: '#8b5cf6', strokeWidth: 1.2 };
      }
    }

    if (activeLayer === 'chainlaws' && state) {
      if (state.hasMandatoryChainLaw) {
        return { fill: '#0e7490', stroke: '#38bdf8', strokeWidth: 2 }; // Ice Cyan
      }
      return { fill: '#0f172a', stroke: '#1e293b', strokeWidth: 1 };
    }

    if (activeLayer === 'permits' && state) {
      if (state.hasSpecialPermit) {
        return { fill: '#881337', stroke: '#fb7185', strokeWidth: 2.2 }; // Rose/Red
      }
      return { fill: '#0f172a', stroke: '#1e293b', strokeWidth: 1 };
    }

    // Default standard layer
    if (neighbor) {
      return { fill: 'url(#neighborGlow)', stroke: '#38bdf8', strokeWidth: 1.8 };
    } else if (isHovered) {
      return { fill: '#334155', stroke: '#94a3b8', strokeWidth: 2 };
    }

    return { fill: '#1e293b', stroke: '#334155', strokeWidth: 1.2 };
  };

  return (
    <div className="relative w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 lg:p-6 shadow-2xl backdrop-blur-md overflow-hidden">
      {/* Map Control Bar & Layer Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 flex-wrap">
              AQSh Interaktiv Logistika & Tranzit Xaritasi
              {selectedState && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {selectedState.name} ({selectedState.id}) • {selectedState.nickname}
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              Qatlamlarni o'zgartiring, magistrallar va yuk markazlarini xaritada yoqing
            </p>
          </div>
        </div>

        {/* Layer Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-amber-400" /> Qatlam:
          </span>
          <button
            type="button"
            onClick={() => setActiveLayer('standard')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeLayer === 'standard'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            Standart
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('timezones')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeLayer === 'timezones'
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20'
                : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            Vaqt Zonalari
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('chainlaws')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              activeLayer === 'chainlaws'
                ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/20'
                : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            <Snowflake className="w-3 h-3" /> Zanjir Talablari
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('permits')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              activeLayer === 'permits'
                ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-600/20'
                : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            <ShieldAlert className="w-3 h-3" /> Ruxsatnomalar
          </button>
        </div>
      </div>

      {/* Map Feature Toggles & Zoom Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 text-xs">
        {/* Toggle Overlays */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white select-none">
            <input
              type="checkbox"
              checked={showHubs}
              onChange={(e) => setShowHubs(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-amber-500/40"
            />
            <span className="flex items-center gap-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-amber-400" /> Yuk Markazlari & Portlar
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white select-none">
            <input
              type="checkbox"
              checked={showCorridors}
              onChange={(e) => setShowCorridors(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-amber-500/40"
            />
            <span className="flex items-center gap-1 font-medium">
              <Truck className="w-3.5 h-3.5 text-sky-400" /> Bosh Magistrallar (I-80, I-90, I-10...)
            </span>
          </label>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
            title="Kattalashtirish"
            aria-label="Kattalashtirish"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="px-1 text-[11px] font-mono text-slate-400">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
            title="Kichraytirish"
            aria-label="Kichraytirish"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
            title="Tiklash"
            aria-label="Tiklash"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Map Container */}
      <div className="relative w-full aspect-[16/10] max-h-[540px] flex items-center justify-center bg-slate-950/80 rounded-xl border border-slate-800/80 overflow-hidden">
        <svg
          viewBox="0 0 960 620"
          className="w-full h-full select-none transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
          role="img"
          aria-label="AQSh Shtatlari va Magistrallari Xaritasi"
        >
          {/* Subtle Background Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2,2" />
            </pattern>
            <radialGradient id="selectedGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#b45309" stopOpacity="0.95" />
            </radialGradient>
            <radialGradient id="neighborGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.95" />
            </radialGradient>
            <filter id="hubGlow">
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#f59e0b" />
            </filter>
          </defs>

          <rect width="960" height="620" fill="url(#grid)" />

          {/* Ocean Water Labeling */}
          <text x="60" y="30" fill="#334155" fontSize="12" fontWeight="700" letterSpacing="2">TINCH OKEANI (PACIFIC OCEAN)</text>
          <text x="760" y="50" fill="#334155" fontSize="12" fontWeight="700" letterSpacing="2">ATLANTIKA OKEANI</text>
          <text x="560" y="590" fill="#334155" fontSize="11" fontWeight="600" letterSpacing="1">MEKSIKA KO'RFAZI (GULF OF MEXICO)</text>

          {/* Render State Polygons */}
          {Object.entries(US_MAP_PATHS).map(([stateId, data]) => {
            const state = US_STATES.find(s => s.id === stateId);
            const active = isSelected(stateId);
            const neighbor = isNeighbor(stateId);
            const { fill, stroke, strokeWidth } = getStateFillAndStroke(stateId);

            return (
              <g
                key={stateId}
                className="cursor-pointer transition-all duration-200"
                onClick={() => state && onSelectState(state)}
                onMouseEnter={() => setHoveredStateId(stateId)}
                onMouseLeave={() => setHoveredStateId(null)}
              >
                <path
                  d={data.path}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  strokeLinejoin="round"
                  className="transition-colors duration-200 hover:brightness-125"
                />

                {/* State Abbreviation Text Label */}
                <text
                  x={data.x}
                  y={data.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={active ? '#ffffff' : neighbor ? '#e0f2fe' : '#cbd5e1'}
                  fontSize={active ? '13' : '11'}
                  fontWeight={active || neighbor ? '800' : '700'}
                  pointerEvents="none"
                  className="font-mono"
                >
                  {stateId}
                </text>

                {/* Pulse Pin on Selected State */}
                {active && (
                  <g transform={`translate(${data.x}, ${data.y - 14})`}>
                    <circle r="5" fill="#fbbf24" className="animate-ping opacity-75" />
                    <circle r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.2" />
                  </g>
                )}
              </g>
            );
          })}

          {/* Major Interstate Highway Corridors Overlay */}
          {showCorridors && (
            <g pointerEvents="none">
              {MAJOR_CORRIDORS.map(corridor => (
                <g key={corridor.code}>
                  <path
                    d={corridor.path}
                    fill="none"
                    stroke={corridor.color}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.85"
                  />
                  <path
                    d={corridor.path}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                    strokeDasharray="4,4"
                    opacity="0.9"
                  />
                </g>
              ))}
            </g>
          )}

          {/* Major Freight Hubs Overlay */}
          {showHubs && (
            <g>
              {MAJOR_FREIGHT_HUBS.map(hub => {
                const isSelectedState = selectedState?.id === hub.stateId;
                return (
                  <g
                    key={hub.id}
                    transform={`translate(${hub.x}, ${hub.y})`}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredHub(hub)}
                    onMouseLeave={() => setHoveredHub(null)}
                    onClick={() => {
                      const st = US_STATES.find(s => s.id === hub.stateId);
                      if (st) onSelectState(st);
                    }}
                  >
                    <circle
                      r={isSelectedState ? '6' : '4.5'}
                      fill={isSelectedState ? '#fbbf24' : '#38bdf8'}
                      stroke="#0f172a"
                      strokeWidth="1.5"
                      filter="url(#hubGlow)"
                    />
                    <circle
                      r="2"
                      fill="#ffffff"
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* Alaska & Hawaii Inset Box Dividers */}
          <rect x="50" y="450" width="140" height="130" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3,3" rx="8" />
          <text x="58" y="466" fill="#94a3b8" fontSize="10" fontWeight="700">ALASKA (AK)</text>

          <rect x="200" y="515" width="110" height="75" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3,3" rx="8" />
          <text x="208" y="529" fill="#94a3b8" fontSize="10" fontWeight="700">HAWAII (HI)</text>
        </svg>

        {/* Hover Tooltip Overlay for State */}
        {hoveredState && !hoveredHub && (
          <div className="absolute top-4 left-4 z-20 pointer-events-none bg-slate-900/95 border border-slate-700 rounded-xl p-3.5 shadow-2xl backdrop-blur-md max-w-xs animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-amber-400 font-mono">
                {hoveredState.id}
              </span>
              <div>
                <div className="text-sm font-bold text-white leading-none">
                  {hoveredState.name}
                </div>
                <div className="text-[11px] text-amber-300/90 italic">
                  "{hoveredState.nickname}"
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-300 mt-2 space-y-1 pt-1.5 border-t border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Poytaxti:</span>
                <strong className="text-slate-100">{hoveredState.capital}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Vaqt zonasi:</span>
                <strong className="text-slate-100">{hoveredState.timeZoneName.split('/')[0]}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Bozor turi:</span>
                <strong className="text-slate-100">{hoveredState.marketType}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Trak tezligi:</span>
                <strong className="text-slate-100">{hoveredState.truckSpeedLimit.split('(')[0]}</strong>
              </div>
              {hoveredState.hasSpecialPermit && (
                <div className="text-[11px] font-bold text-rose-400 flex items-center gap-1 mt-1">
                  <ShieldAlert className="w-3 h-3" /> Maxsus ruxsatnoma talab etiladi!
                </div>
              )}
            </div>
          </div>
        )}

        {/* Hover Tooltip Overlay for Hub */}
        {hoveredHub && (
          <div className="absolute top-4 left-4 z-20 pointer-events-none bg-slate-900/95 border border-amber-500/60 rounded-xl p-3 shadow-2xl backdrop-blur-md max-w-xs animate-in fade-in duration-150">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> {hoveredHub.type}
            </div>
            <div className="text-sm font-extrabold text-white mt-0.5">
              {hoveredHub.name}
            </div>
            <div className="text-xs text-slate-300 mt-1">
              Shtat: <strong className="text-amber-300 font-mono">{hoveredHub.stateId}</strong> • Muhimlik: <strong className="text-emerald-400">{hoveredHub.importance}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Layer Legend Guidance */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 border-b border-slate-800/80 pb-3">
        {activeLayer === 'standard' && (
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-500 border border-amber-300" />
              <span className="text-slate-200">Tanlangan shtat</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-sky-600 border border-sky-400" />
              <span className="text-slate-200">Chegaradosh shtatlar (Tranzit)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700" />
              <span>Boshqa shtatlar</span>
            </div>
          </div>
        )}

        {activeLayer === 'timezones' && (
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-indigo-700 border border-indigo-400" />
              <span>EST (Sharqiy)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-700 border border-emerald-400" />
              <span>CST (Markaziy)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-700 border border-amber-400" />
              <span>MST (Tog'li)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-sky-700 border border-sky-400" />
              <span>PST (Tinch okeani)</span>
            </div>
          </div>
        )}

        {activeLayer === 'chainlaws' && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-cyan-600 border border-cyan-400" />
              <span className="text-cyan-200 font-bold">Qor zanjiri majburiy bo'lgan shtatlar (CA, CO, WY, OR, WA, MT, UT, ID)</span>
            </div>
          </div>
        )}

        {activeLayer === 'permits' && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-700 border border-rose-400" />
              <span className="text-rose-200 font-bold">Maxsus ruxsatnoma talab etiladigan shtatlar (KY KYU, NM WDT, NY HUT, OR Weight-Mile)</span>
            </div>
          </div>
        )}

        <div className="text-[11px] text-slate-500">
          Xaritadagi har qanday shtat yoki xab ustiga bosib to'liq ma'lumotlarni oching
        </div>
      </div>

      {/* Territories Row (PR, VI, GU, MP, AS, TT) */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            AQSh Hududlari va Orollari (Territories)
          </span>
          <span className="text-[11px] text-slate-500">
            Karib dengizi va Tinch okeani orol portlari
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {territories.map(t => {
            const active = isSelected(t.id);
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onSelectState(t)}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                  active
                    ? 'bg-amber-500/20 border-amber-500 text-amber-200 shadow-md shadow-amber-500/20 ring-1 ring-amber-400'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="font-mono text-sm font-black text-amber-400">
                    {t.id}
                  </div>
                  <div className="text-xs font-semibold text-slate-200 truncate max-w-[95px]">
                    {t.name}
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-mono">
                  {t.id === 'PR' ? 'Karib' : t.id === 'VI' ? 'Karib' : 'Okean'}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
