import React, { useState, useEffect } from 'react';
import { StateData } from '../types/state';
import { STATES_BY_ID } from '../data/states';
import {
  MapPin, Clock, Gauge, Scale, AlertOctagon,
  Fuel, ShieldAlert, ArrowRight, Share2, Check,
  Building2, Milestone, Globe, TrendingUp, AlertTriangle,
  FileCheck2, Compass, Wrench, Shield
} from 'lucide-react';

interface StateDetailCardProps {
  state: StateData;
  onSelectNeighbor: (neighborState: StateData) => void;
}

export const StateDetailCard: React.FC<StateDetailCardProps> = ({ state, onSelectNeighbor }) => {
  const [localTime, setLocalTime] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Live timer for this state's timezone
  useEffect(() => {
    const updateTime = () => {
      try {
        const timeStr = new Intl.DateTimeFormat('en-US', {
          timeZone: state.timeZoneId,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }).format(new Date());
        setLocalTime(timeStr);
      } catch {
        setLocalTime('--:--');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [state.timeZoneId]);

  const handleCopySummary = () => {
    const text = `AQSh Shtati: ${state.name} (${state.id}) - "${state.nickname}"
Poytaxti: ${state.capital} | Eng yirik shahri: ${state.largestCity}
Vaqt zonasi: ${state.timeZoneName}
Bozor turi: ${state.marketType} (${state.marketTypeUz})
Asosiy Magistrallar: ${state.interstates.join(', ')}
Yuk tezlik chegarasi: ${state.truckSpeedLimit}
KPRA Ko'prik Qonuni: ${state.kpraRule}
Zanjir qoidalari: ${state.chainLaws}
Mavsumiy xavflar: ${state.seasonalAlert}
Dispetcher maxsus maslahati: ${state.dispatcherInsiderTip}
Chegaradosh shtatlar: ${state.borderingStates.join(', ')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-md space-y-6">
      {/* Top Banner: Code, Name, Nickname, Region & Live Clock */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex flex-col items-center justify-center text-slate-950 font-mono font-black shadow-xl shadow-amber-500/20 ring-2 ring-amber-400/60 shrink-0">
            <span className="text-3xl sm:text-4xl leading-none">{state.id}</span>
            {state.aliases && (
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-amber-950/80 mt-0.5">
                alias: {state.aliases.join(',')}
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {state.name}
              </h2>
              <span className="text-sm font-semibold text-amber-400/90 italic">
                "{state.nickname}"
              </span>
              {state.isTerritory && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  AQSh Hududi
                </span>
              )}
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {state.regionUz}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-400 mt-2 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-amber-400" />
                Poytaxti: <strong className="text-slate-200">{state.capital}</strong>
              </span>
              <span className="text-slate-700">•</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-sky-400" />
                Katta shahri: <strong className="text-slate-200">{state.largestCity}</strong>
              </span>
              <span className="text-slate-700">•</span>
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Bozor: <strong className="text-emerald-300">{state.marketType}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Live Clock & Action */}
        <div className="flex items-center gap-3 self-start lg:self-center">
          <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-right">
            <div className="text-[11px] font-bold text-slate-400 flex items-center justify-end gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              Shtatdagi Hozirgi Vaqt:
            </div>
            <div className="text-lg sm:text-xl font-mono font-extrabold text-amber-300">
              {localTime || 'Yuklanmoqda...'}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              {state.timeZoneName}
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopySummary}
            className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-all flex items-center justify-center shrink-0"
            title="Shtat logistika ma'lumotlarini nusxalash"
            aria-label="Shtat ma'lumotlarini nusxalash"
          >
            {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Special Permit Alert Banner (if applicable) */}
      {state.hasSpecialPermit && (
        <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-200 flex items-start gap-3 shadow-lg">
          <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0 mt-0.5 animate-pulse" />
          <div>
            <div className="text-sm font-extrabold text-rose-300 uppercase tracking-wide flex items-center gap-2">
              DIQQAT: Maxsus Shtat Litsenziyasi / Ruxsatnomasi Talab Qilinadi!
            </div>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed">
              Ushbu shtatda harakatlanish uchun maxsus <strong>{state.specialPermitName}</strong> bo'lishi shart. Aks holda shtat tarozisida trak ushlanib, yuzlab dollar jarima qo'llanadi.
            </p>
          </div>
        </div>
      )}

      {/* Grid of Key Logistics Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Freight Market Profile */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              <TrendingUp className="w-4 h-4" /> Yuk Bozori Xarakteristikasi
            </div>
            <div className="text-sm font-bold text-white mb-1">
              {state.marketTypeUz}
            </div>
            <div className="text-xs text-slate-300 mt-2">
              <span className="text-slate-400">Tavsiya etiladigan treylerlar:</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {state.primaryTrailers.map(tr => (
                  <span key={tr} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-300 font-mono text-xs font-semibold">
                    {tr}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Freight Hubs & Ports */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400 mb-2">
              <Building2 className="w-4 h-4" /> Asosiy Yuk Markazlari (Freight Hubs)
            </div>
            <ul className="space-y-1.5">
              {state.freightHubs.map((hub, idx) => (
                <li key={idx} className="text-xs sm:text-sm text-slate-200 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                  <span>{hub}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Card 3: Interstates */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
              <Milestone className="w-4 h-4" /> Asosiy Magistrallar (Interstates)
            </div>
            <div className="flex flex-wrap gap-1.5">
              {state.interstates.map(hw => (
                <span
                  key={hw}
                  className="px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-emerald-200 font-mono text-xs font-bold"
                >
                  {hw}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-2.5 leading-relaxed">
              Maksimal balandlik chegarasi: <strong className="text-slate-200">{state.maxHeight}</strong>
            </p>
          </div>
        </div>

        {/* Card 4: Truck Speed Limit & KPRA Bridge Formula */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
            <Gauge className="w-4 h-4" /> Tezlik & KPRA Ko'prik Qonuni
          </div>
          <div className="text-xs sm:text-sm font-semibold text-white">
            Tezlik: {state.truckSpeedLimit}
          </div>
          <div className="text-xs text-slate-300 mt-2">
            <span className="text-slate-400">KPRA (Kingpin to Rear Axle):</span>
            <div className="font-semibold text-amber-300 mt-0.5">
              {state.kpraRule}
            </div>
          </div>
        </div>

        {/* Card 5: Chain Laws & Winter Hazards */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">
            <AlertOctagon className="w-4 h-4" /> Qor Zanjiri Qoidalari (Chain Laws)
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {state.chainLaws}
          </p>
          {state.hasMandatoryChainLaw && (
            <span className="inline-block mt-2 text-[11px] font-bold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500 text-cyan-300">
              Qishda zanjirlar kabinada bo'lishi SHART!
            </span>
          )}
        </div>

        {/* Card 6: Weigh Stations & Toll Systems */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-400 mb-2">
            <Scale className="w-4 h-4" /> Tarozilar & Toll Tizimlari
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-2">
            {state.weighStationInfo}
          </p>
          <div className="text-xs text-slate-400 flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-800">
            <span>To'lov:</span>
            {state.tollSystems.map(toll => (
              <span key={toll} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200 font-mono text-[11px]">
                {toll}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Seasonal Alert Banner */}
      <div className="p-4 rounded-xl bg-orange-950/30 border border-orange-500/30 text-orange-200">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-orange-300">
              Mavsumiy Xavflar va Ob-Havo Ogohlantirishlari ({state.name})
            </div>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed">
              {state.seasonalAlert}
            </p>
          </div>
        </div>
      </div>

      {/* Logistics Dispatcher Pro Insider Tip */}
      <div className="p-4 sm:p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400 shrink-0 mt-0.5">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold text-amber-300 uppercase tracking-wide">
              Dispetcher Uchun Amaliy Insider Maslahatlar ({state.name})
            </h4>
            <p className="text-xs sm:text-sm text-slate-100 mt-1.5 leading-relaxed font-medium">
              {state.dispatcherInsiderTip}
            </p>
            <p className="text-xs text-slate-400 mt-2 pt-2 border-t border-amber-500/20">
              Qo'shimcha logistika eslatmasi: {state.logisticsNotesUz}
            </p>
          </div>
        </div>
      </div>

      {/* Bordering States (Clickable Navigation) */}
      <div className="pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
            <Globe className="w-4 h-4 text-sky-400" />
            Chegaradosh Shtatlar ({state.borderingStates.length} ta):
          </div>
          <span className="text-[11px] text-slate-500">
            O'tish uchun bosing (Tranzit yo'li)
          </span>
        </div>

        {state.borderingStates.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {state.borderingStates.map(bId => {
              const bState = STATES_BY_ID.get(bId);
              return (
                <button
                  key={bId}
                  type="button"
                  onClick={() => bState && onSelectNeighbor(bState)}
                  className="group flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500 hover:bg-sky-950/40 transition-all text-xs font-semibold text-slate-200 shadow-sm"
                >
                  <span className="font-mono font-bold text-sky-400 group-hover:text-sky-300">
                    {bId}
                  </span>
                  <span>{bState ? bState.name : bId}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all" />
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-xs text-slate-500 italic">
            Bu shtat/hudud boshqa AQSh shtatlari bilan quruqlik chegarasiga ega emas (Orol yoki anklav).
          </div>
        )}
      </div>
    </div>
  );
};
