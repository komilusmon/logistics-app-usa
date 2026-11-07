import React, { useEffect, useMemo, useState } from 'react';
import { geoAlbersUsa, geoPath, GeoPermissibleObjects } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { FeatureCollection, Geometry } from 'geojson';
import { StateData } from '../types/state';
import { US_STATES } from '../data/states';
import { FIPS_TO_STATE } from '../data/fipsToState';
import {
  Compass, ZoomIn, ZoomOut, RotateCcw, Layers, MapPin,
  Snowflake, ShieldAlert, Loader2
} from 'lucide-react';

interface RealUsMapViewerProps {
  selectedState: StateData | null;
  onSelectState: (state: StateData) => void;
  /** Highlighted state IDs along an active truck route */
  routeStateIds?: string[];
}

type MapLayer = 'standard' | 'timezones' | 'chainlaws' | 'permits';

type StatesTopo = Topology<{ states: GeometryCollection }>;

const WIDTH = 975;
const HEIGHT = 610;

export const RealUsMapViewer: React.FC<RealUsMapViewerProps> = ({
  selectedState,
  onSelectState,
  routeStateIds = [],
}) => {
  const [geo, setGeo] = useState<FeatureCollection<Geometry> | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [hoveredFips, setHoveredFips] = useState<string | null>(null);
  const [activeLayer, setActiveLayer] = useState<MapLayer>('standard');
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/geo/states-10m.json');
        if (!res.ok) throw new Error(`GeoJSON yuklanmadi (${res.status})`);
        const topo = (await res.json()) as StatesTopo;
        const fc = feature(topo, topo.objects.states) as FeatureCollection<Geometry>;
        if (!cancelled) setGeo(fc);
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : 'Xarita ma\'lumoti yuklanmadi');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const projection = useMemo(
    () => geoAlbersUsa().translate([WIDTH / 2, HEIGHT / 2]).scale(1300),
    []
  );
  const pathGen = useMemo(() => geoPath(projection), [projection]);

  const routeSet = useMemo(() => new Set(routeStateIds), [routeStateIds]);

  const isSelected = (id: string) => selectedState?.id === id;
  const isNeighbor = (id: string) => selectedState?.borderingStates.includes(id) ?? false;

  const getStateByFips = (fips: string) => {
    const code = FIPS_TO_STATE[fips];
    return code ? US_STATES.find((s) => s.id === code) : undefined;
  };

  const getFillStroke = (stateId: string) => {
    const state = US_STATES.find((s) => s.id === stateId);
    const active = isSelected(stateId);
    const neighbor = isNeighbor(stateId);
    const onRoute = routeSet.has(stateId);
    const hovered = hoveredFips && FIPS_TO_STATE[hoveredFips] === stateId;

    if (active) {
      return { fill: '#f59e0b', stroke: '#fde68a', strokeWidth: 1.6 };
    }
    if (onRoute) {
      return { fill: '#059669', stroke: '#6ee7b7', strokeWidth: 1.4 };
    }

    if (activeLayer === 'timezones' && state) {
      if (state.timeZoneName.includes('EST')) return { fill: '#312e81', stroke: '#6366f1', strokeWidth: 0.6 };
      if (state.timeZoneName.includes('CST')) return { fill: '#064e3b', stroke: '#10b981', strokeWidth: 0.6 };
      if (state.timeZoneName.includes('MST')) return { fill: '#78350f', stroke: '#f59e0b', strokeWidth: 0.6 };
      if (state.timeZoneName.includes('PST')) return { fill: '#0c4a6e', stroke: '#0284c7', strokeWidth: 0.6 };
      return { fill: '#4c1d95', stroke: '#8b5cf6', strokeWidth: 0.6 };
    }
    if (activeLayer === 'chainlaws' && state) {
      if (state.hasMandatoryChainLaw) return { fill: '#0e7490', stroke: '#38bdf8', strokeWidth: 1 };
      return { fill: '#0f172a', stroke: '#1e293b', strokeWidth: 0.5 };
    }
    if (activeLayer === 'permits' && state) {
      if (state.hasSpecialPermit) return { fill: '#881337', stroke: '#fb7185', strokeWidth: 1 };
      return { fill: '#0f172a', stroke: '#1e293b', strokeWidth: 0.5 };
    }

    if (neighbor) return { fill: '#0369a1', stroke: '#7dd3fc', strokeWidth: 1 };
    if (hovered) return { fill: '#334155', stroke: '#94a3b8', strokeWidth: 1.1 };
    return { fill: '#1e293b', stroke: '#475569', strokeWidth: 0.55 };
  };

  const hoveredState = hoveredFips ? getStateByFips(hoveredFips) : null;
  const territories = US_STATES.filter((s) => s.isTerritory);

  return (
    <div className="relative w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 lg:p-6 shadow-2xl backdrop-blur-md overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 flex-wrap">
              AQSh Real Chegaralar Xaritasi
              {selectedState && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {selectedState.name} ({selectedState.id})
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              Census Bureau GeoJSON — haqiqiy shtat chegaralari (Albers USA proyeksiyasi)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-amber-400" /> Qatlam:
          </span>
          {(
            [
              ['standard', 'Standart', 'bg-amber-500 text-slate-950'],
              ['timezones', 'Vaqt Zonalari', 'bg-indigo-600 text-white'],
              ['chainlaws', 'Zanjir', 'bg-cyan-600 text-white'],
              ['permits', 'Ruxsatnomalar', 'bg-rose-600 text-white'],
            ] as const
          ).map(([id, label, activeCls]) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveLayer(id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeLayer === id
                  ? `${activeCls} font-bold shadow-md`
                  : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              {id === 'chainlaws' && <Snowflake className="w-3 h-3 inline mr-1" />}
              {id === 'permits' && <ShieldAlert className="w-3 h-3 inline mr-1" />}
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end mb-2">
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button type="button" onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.5))} className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800" aria-label="Zoom in">
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="px-1 text-[11px] font-mono text-slate-400">{Math.round(zoomLevel * 100)}%</span>
          <button type="button" onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.8))} className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800" aria-label="Zoom out">
            <ZoomOut className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => setZoomLevel(1)} className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800" aria-label="Reset">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="relative w-full aspect-[16/10] max-h-[560px] flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-xl border border-slate-800/80 overflow-hidden">
        {!geo && !loadError && (
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
            Real chegaralar yuklanmoqda…
          </div>
        )}
        {loadError && (
          <div className="text-rose-300 text-sm px-4 text-center">{loadError}</div>
        )}
        {geo && (
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="w-full h-full select-none transition-transform duration-300"
            style={{ transform: `scale(${zoomLevel})` }}
            role="img"
            aria-label="AQSh shtatlari real chegaralar xaritasi"
          >
            <defs>
              <linearGradient id="oceanGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
            </defs>
            <rect width={WIDTH} height={HEIGHT} fill="url(#oceanGrad)" />

            {geo.features.map((f) => {
              const fips = String(f.id ?? '');
              const stateId = FIPS_TO_STATE[fips];
              if (!stateId) return null;
              // Skip non-contiguous insets that AlbersUSA already handles; still render AK/HI via projection
              const d = pathGen(f as GeoPermissibleObjects);
              if (!d) return null;
              const { fill, stroke, strokeWidth } = getFillStroke(stateId);
              const centroid = pathGen.centroid(f as GeoPermissibleObjects);
              const state = US_STATES.find((s) => s.id === stateId);

              return (
                <g
                  key={fips}
                  className="cursor-pointer"
                  onClick={() => state && onSelectState(state)}
                  onMouseEnter={() => setHoveredFips(fips)}
                  onMouseLeave={() => setHoveredFips(null)}
                >
                  <path
                    d={d}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    strokeLinejoin="round"
                    className="transition-colors duration-150 hover:brightness-125"
                  />
                  {centroid && Number.isFinite(centroid[0]) && (
                    <text
                      x={centroid[0]}
                      y={centroid[1]}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={isSelected(stateId) ? '#fff' : '#cbd5e1'}
                      fontSize={isSelected(stateId) ? 11 : 9}
                      fontWeight={700}
                      pointerEvents="none"
                      className="font-mono"
                    >
                      {stateId}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        )}

        {hoveredState && (
          <div className="absolute top-4 left-4 z-20 pointer-events-none bg-slate-900/95 border border-slate-700 rounded-xl p-3.5 shadow-2xl backdrop-blur-md max-w-xs">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-amber-400 font-mono">{hoveredState.id}</span>
              <div>
                <div className="text-sm font-bold text-white leading-none">{hoveredState.name}</div>
                <div className="text-[11px] text-amber-300/90 italic">"{hoveredState.nickname}"</div>
              </div>
            </div>
            <div className="text-xs text-slate-300 mt-2 space-y-1 pt-1.5 border-t border-slate-800">
              <div className="flex justify-between"><span className="text-slate-400">Poytaxti:</span><strong>{hoveredState.capital}</strong></div>
              <div className="flex justify-between"><span className="text-slate-400">Max height:</span><strong>{hoveredState.maxHeight}</strong></div>
              <div className="flex justify-between"><span className="text-slate-400">Bozor:</span><strong>{hoveredState.marketType}</strong></div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500" /><span className="text-slate-200">Tanlangan</span></div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-sky-600" /><span className="text-slate-200">Chegaradosh</span></div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-600" /><span className="text-slate-200">Yo'nalishdagi shtatlar</span></div>
        <div className="text-[11px] text-slate-500 flex items-center gap-1 ml-auto">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          Real geografik chegaralar
        </div>
      </div>

      <div className="mt-4">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">AQSh Hududlari</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {territories.map((t) => {
            const active = isSelected(t.id);
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onSelectState(t)}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                  active
                    ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div>
                  <div className="font-mono text-sm font-black text-amber-400">{t.id}</div>
                  <div className="text-xs font-semibold text-slate-200 truncate max-w-[95px]">{t.name}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
