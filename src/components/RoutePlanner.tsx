import React, { useEffect, useMemo, useState } from 'react';
import { FREIGHT_CITIES, CITIES_BY_ID } from '../data/cities';
import { StateData } from '../types/state';
import { STATES_BY_ID } from '../data/states';
import {
  findTruckRoutes,
  TRUCK_PRESETS,
  TruckSpecs,
  ScoredRoute,
} from '../utils/truckRouteFinder';
import {
  Navigation2, ArrowRightLeft, Ruler, ArrowUpFromLine, RotateCw,
  Truck, AlertTriangle, CheckCircle2, MapPin, Route, Gauge, Search
} from 'lucide-react';

interface RoutePlannerProps {
  onSelectState: (state: StateData) => void;
  onRouteStatesChange?: (stateIds: string[]) => void;
}

const sortedCities = [...FREIGHT_CITIES].sort((a, b) => a.name.localeCompare(b.name));

export const RoutePlanner: React.FC<RoutePlannerProps> = ({
  onSelectState,
  onRouteStatesChange,
}) => {
  const [originId, setOriginId] = useState('CHI');
  const [destinationId, setDestinationId] = useState('DFW');
  const [preset, setPreset] = useState<string>('dry_van_53');
  const [cargoWidthFt, setCargoWidthFt] = useState(8.5);
  const [cargoHeightFt, setCargoHeightFt] = useState(13.5);
  const [truckLengthFt, setTruckLengthFt] = useState(70);
  const [turnRadiusFt, setTurnRadiusFt] = useState(45);
  const [searched, setSearched] = useState(false);
  const [selectedRouteIdx, setSelectedRouteIdx] = useState(0);

  const applyPreset = (key: string) => {
    setPreset(key);
    const p = TRUCK_PRESETS[key];
    if (!p) return;
    setCargoWidthFt(p.specs.cargoWidthFt);
    setCargoHeightFt(p.specs.cargoHeightFt);
    setTruckLengthFt(p.specs.truckLengthFt);
    setTurnRadiusFt(p.specs.turnRadiusFt);
  };

  const truck: TruckSpecs = useMemo(
    () => ({ cargoWidthFt, cargoHeightFt, truckLengthFt, turnRadiusFt }),
    [cargoWidthFt, cargoHeightFt, truckLengthFt, turnRadiusFt]
  );

  const result = useMemo(() => {
    if (!searched) return null;
    return findTruckRoutes(originId, destinationId, truck, 3);
  }, [searched, originId, destinationId, truck]);

  const activeRoute: ScoredRoute | null =
    result && result.routes.length > 0
      ? result.routes[Math.min(selectedRouteIdx, result.routes.length - 1)]
      : null;

  useEffect(() => {
    if (!onRouteStatesChange) return;
    if (!activeRoute) {
      onRouteStatesChange([]);
      return;
    }
    const stateIds = [
      ...new Set(
        activeRoute.cityPath
          .map((id) => CITIES_BY_ID.get(id)?.stateId)
          .filter(Boolean) as string[]
      ),
    ];
    onRouteStatesChange(stateIds);
  }, [activeRoute, onRouteStatesChange]);

  const handleSearch = () => {
    setSelectedRouteIdx(0);
    setSearched(true);
  };

  const handleSwap = () => {
    setOriginId(destinationId);
    setDestinationId(originId);
    setSelectedRouteIdx(0);
  };

  const openState = (stateId: string) => {
    const st = STATES_BY_ID.get(stateId);
    if (st) onSelectState(st);
  };

  return (
    <div className="w-full space-y-5">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-2.5 border-b border-slate-800/80 pb-4 mb-5">
          <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
            <Navigation2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white">
              Fura Yo'l Qidiruv — Shahardan Shaharga
            </h3>
            <p className="text-xs text-slate-400">
              Yo'l kengligi, yuk balandligi, burilish radiusi va sifat bo'yicha eng yaqin mos marshrutlar
            </p>
          </div>
        </div>

        {/* Cities */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> Qayerdan (Pick-up)
            </label>
            <select
              value={originId}
              onChange={(e) => setOriginId(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-950 border border-slate-700 rounded-lg text-white font-semibold text-sm focus:outline-none focus:border-amber-500"
            >
              {sortedCities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.stateId}) — {c.nameUz}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleSwap}
              className="p-3 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 rounded-full border border-slate-700 transition-all"
              title="Almashtirish"
            >
              <ArrowRightLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-sky-400 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> Qayerga (Delivery)
            </label>
            <select
              value={destinationId}
              onChange={(e) => setDestinationId(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-950 border border-slate-700 rounded-lg text-white font-semibold text-sm focus:outline-none focus:border-sky-500"
            >
              {sortedCities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.stateId}) — {c.nameUz}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Truck presets */}
        <div className="mt-5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-amber-400" /> Fura / yuk profili
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(TRUCK_PRESETS).map(([key, p]) => (
              <button
                key={key}
                type="button"
                onClick={() => applyPreset(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  preset === key
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                    : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-600'
                }`}
              >
                {p.labelUz}
              </button>
            ))}
          </div>
        </div>

        {/* Dimensions */}
        <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
          <DimensionInput
            icon={<Ruler className="w-4 h-4" />}
            label="Yuk kengligi (ft)"
            value={cargoWidthFt}
            min={6}
            max={14}
            step={0.1}
            onChange={(v) => { setCargoWidthFt(v); setPreset('custom'); }}
          />
          <DimensionInput
            icon={<ArrowUpFromLine className="w-4 h-4" />}
            label="Yuk balandligi (ft)"
            value={cargoHeightFt}
            min={8}
            max={16}
            step={0.1}
            onChange={(v) => { setCargoHeightFt(v); setPreset('custom'); }}
          />
          <DimensionInput
            icon={<Truck className="w-4 h-4" />}
            label="Umumiy uzunlik (ft)"
            value={truckLengthFt}
            min={20}
            max={90}
            step={1}
            onChange={(v) => { setTruckLengthFt(v); setPreset('custom'); }}
          />
          <DimensionInput
            icon={<RotateCw className="w-4 h-4" />}
            label="Burilish radiusi (ft)"
            value={turnRadiusFt}
            min={25}
            max={80}
            step={1}
            onChange={(v) => { setTurnRadiusFt(v); setPreset('custom'); }}
          />
        </div>

        <button
          type="button"
          onClick={handleSearch}
          className="mt-5 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/25 transition-all"
        >
          <Search className="w-4 h-4" />
          Eng yaqin va sifatli yo'llarni topish
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2 space-y-3">
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <Route className="w-4 h-4 text-amber-400" />
              {result.messageUz}
            </div>

            {result.routes.length === 0 && (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 text-sm text-rose-200">
                <AlertTriangle className="w-4 h-4 inline mr-1.5" />
                Cheklovlarga mos magistral topilmadi. Kenglik/balandlikni kamaytiring yoki box truck profilini sinab ko'ring.
              </div>
            )}

            {result.routes.map((route, idx) => (
              <button
                key={route.cityPath.join('-')}
                type="button"
                onClick={() => setSelectedRouteIdx(idx)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedRouteIdx === idx
                    ? 'bg-amber-500/15 border-amber-500/50 ring-1 ring-amber-400/40'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                    #{idx + 1} {idx === 0 ? '• Eng yaxshi' : '• Muqobil'}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    score {route.score.toFixed(0)}
                  </span>
                </div>
                <div className="text-sm font-bold text-white">
                  {route.totalMiles.toLocaleString()} mil
                </div>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                  <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                  Sifat: {route.avgQuality.toFixed(1)}/10
                </div>
                <div className="text-[11px] text-slate-500 mt-2 line-clamp-2">
                  {route.summaryUz}
                </div>
              </button>
            ))}

            {result.blockedSegments.length > 0 && (
              <details className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-xs text-slate-400">
                <summary className="cursor-pointer font-semibold text-slate-300">
                  Bloklangan bo'laklar ({result.blockedSegments.length})
                </summary>
                <ul className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                  {result.blockedSegments.slice(0, 12).map((b) => (
                    <li key={b.segmentId} className="border-t border-slate-800 pt-2">
                      <strong className="text-rose-300">{b.highway}</strong> ({b.segmentId})
                      <ul className="list-disc ml-4 mt-0.5">
                        {b.reasons.map((r) => (
                          <li key={r}>{r}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>

          <div className="lg:col-span-3">
            {activeRoute ? (
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-lg font-extrabold text-white">Marshrut tafsiloti</h4>
                </div>

                <ol className="space-y-3">
                  {activeRoute.legs.map((leg, i) => (
                    <li
                      key={`${leg.segment.id}-${i}`}
                      className="flex gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 font-black text-sm flex items-center justify-center shrink-0">
                        {i + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-white">
                          {leg.fromCity.name} → {leg.toCity.name}
                        </div>
                        <div className="text-xs text-amber-300 font-mono mt-0.5">
                          {leg.segment.highway} • {leg.segment.distanceMiles} mil
                        </div>
                        <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                          <Stat label="Kenglik" value={`${leg.segment.usableWidthFt} ft`} ok={leg.segment.usableWidthFt >= cargoWidthFt + 0.5} />
                          <Stat label="Balandlik" value={`${leg.segment.clearanceHeightFt} ft`} ok={leg.segment.clearanceHeightFt >= cargoHeightFt + 0.25} />
                          <Stat label="Burilish" value={`${leg.segment.turnDifficulty}/5`} ok={leg.segment.turnDifficulty <= 3} />
                          <Stat label="Sifat" value={`${leg.segment.quality}/10`} ok={leg.segment.quality >= 7} />
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1.5">{leg.segment.notesUz}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => openState(leg.fromCity.stateId)}
                            className="text-[11px] font-bold text-sky-400 hover:underline"
                          >
                            {leg.fromCity.stateId} shtati
                          </button>
                          <button
                            type="button"
                            onClick={() => openState(leg.toCity.stateId)}
                            className="text-[11px] font-bold text-sky-400 hover:underline"
                          >
                            {leg.toCity.stateId} shtati
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>

                <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200">
                  Jami: <strong>{activeRoute.totalMiles} mil</strong> • O'rtacha sifat:{' '}
                  <strong>{activeRoute.avgQuality.toFixed(1)}/10</strong> • O'tadigan shtatlar:{' '}
                  <strong>
                    {[
                      ...new Set(
                        activeRoute.cityPath
                          .map((id) => CITIES_BY_ID.get(id)?.stateId)
                          .filter(Boolean)
                      ),
                    ].join(', ')}
                  </strong>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/60 border border-dashed border-slate-700 rounded-2xl p-8 text-center text-slate-400 text-sm">
                Natijani ko'rish uchun qidiruvni bosing
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

function DimensionInput({
  icon,
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block bg-slate-950/80 border border-slate-800 rounded-xl p-3">
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1.5">
        <span className="text-amber-400">{icon}</span>
        {label}
      </span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono font-bold text-sm focus:outline-none focus:border-amber-500"
      />
    </label>
  );
}

function Stat({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className={`rounded-lg px-2 py-1.5 border ${ok ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200' : 'bg-rose-500/10 border-rose-500/20 text-rose-200'}`}>
      <div className="text-[10px] uppercase tracking-wide opacity-70">{label}</div>
      <div className="font-mono font-bold">{value}</div>
    </div>
  );
}
