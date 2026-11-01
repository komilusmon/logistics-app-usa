import React, { useState } from 'react';
import { US_STATES, STATES_BY_ID } from '../data/states';
import { StateData } from '../types/state';
import { Navigation2, ArrowRight, Clock, AlertTriangle, ShieldCheck, MapPin } from 'lucide-react';

interface RoutePlannerProps {
  onSelectState: (state: StateData) => void;
}

export const RoutePlanner: React.FC<RoutePlannerProps> = ({ onSelectState }) => {
  const [originId, setOriginId] = useState('IL');
  const [destinationId, setDestinationId] = useState('TX');

  const origin = STATES_BY_ID.get(originId) || US_STATES[0];
  const destination = STATES_BY_ID.get(destinationId) || US_STATES[1];

  // Common interstate overlap
  const sharedInterstates = origin.interstates.filter(h => destination.interstates.includes(h));

  // Advisory check
  const advisories: string[] = [];
  if (originId === 'CA' || destinationId === 'CA') {
    advisories.push('Kaliforniya (CA): CARB qoidalari amal qiladi. 55 mph qat\'iy tezlik chegarasi.');
  }
  if (originId === 'WY' || destinationId === 'WY') {
    advisories.push('Wyoming (WY): Elk Mountain I-80 da kuchli shamol (blow-over) va qishda zanjir qoidalari.');
  }
  if (originId === 'CO' || destinationId === 'CO') {
    advisories.push('Colorado (CO): I-70 Eisenhower tunneli uchun zanjir (Code 15/16) talabi mavjud.');
  }
  if (originId === 'KY' || destinationId === 'KY') {
    advisories.push('Kentucky (KY): Tranzit uchun KYU raqami kerak.');
  }
  if (originId === 'NM' || destinationId === 'NM') {
    advisories.push('New Mexico (NM): NM WDT (Weight-Distance Tax) ruxsatnomasi kerak.');
  }
  if (originId === 'NY' || destinationId === 'NY') {
    advisories.push('New York (NY): NY HUT ruxsatnomasi va NYC Parkways cheklovlari.');
  }
  if (originId === 'OR' || destinationId === 'OR') {
    advisories.push('Oregon (OR): IFTA o\'rniga Weight-Mile Tax amal qiladi.');
  }

  const handleSwap = () => {
    const temp = originId;
    setOriginId(destinationId);
    setDestinationId(temp);
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-md">
      <div className="flex items-center gap-2.5 border-b border-slate-800/80 pb-4 mb-5">
        <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
          <Navigation2 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-white">
            Yuk Yo'nalishi Tranzit Koridori (Route Transit Advisor)
          </h3>
          <p className="text-xs text-slate-400">
            Yuk jo'natish (Pick-up) va yetkazib berish (Delivery) shtatlari o'rtasidagi logistika tahlili
          </p>
        </div>
      </div>

      {/* Origin & Destination Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
        {/* Origin */}
        <div className="md:col-span-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
          <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-4 h-4" /> Pick-up Shtati (Boshlang'ich)
          </label>
          <select
            value={originId}
            onChange={(e) => setOriginId(e.target.value)}
            className="w-full py-2.5 px-3 bg-slate-900 border border-slate-700 rounded-lg text-white font-semibold text-sm focus:outline-none focus:border-amber-500"
          >
            {US_STATES.map(s => (
              <option key={s.id} value={s.id}>
                {s.id} - {s.name} ({s.capital})
              </option>
            ))}
          </select>
          <div className="text-xs text-slate-400 mt-2 flex items-center justify-between">
            <span>Vaqt zonasi: <strong className="text-slate-200">{origin.timeZoneName.split('/')[0]}</strong></span>
            <button
              type="button"
              onClick={() => onSelectState(origin)}
              className="text-amber-400 hover:underline font-bold"
            >
              Ko'rish
            </button>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center md:col-span-1">
          <button
            type="button"
            onClick={handleSwap}
            className="p-3 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 rounded-full border border-slate-700 transition-all shadow-lg"
            title="Shtatlarni almashtirish"
          >
            <ArrowRight className="w-5 h-5 rotate-90 md:rotate-0" />
          </button>
        </div>

        {/* Destination */}
        <div className="md:col-span-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
          <label className="block text-xs font-bold uppercase tracking-wider text-sky-400 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-4 h-4" /> Delivery Shtati (Yetkazish)
          </label>
          <select
            value={destinationId}
            onChange={(e) => setDestinationId(e.target.value)}
            className="w-full py-2.5 px-3 bg-slate-900 border border-slate-700 rounded-lg text-white font-semibold text-sm focus:outline-none focus:border-sky-500"
          >
            {US_STATES.map(s => (
              <option key={s.id} value={s.id}>
                {s.id} - {s.name} ({s.capital})
              </option>
            ))}
          </select>
          <div className="text-xs text-slate-400 mt-2 flex items-center justify-between">
            <span>Vaqt zonasi: <strong className="text-slate-200">{destination.timeZoneName.split('/')[0]}</strong></span>
            <button
              type="button"
              onClick={() => onSelectState(destination)}
              className="text-sky-400 hover:underline font-bold"
            >
              Ko'rish
            </button>
          </div>
        </div>
      </div>

      {/* Corridor Analysis */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Timezone difference & Interstates */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400" /> Vaqt Zonalari va Tranzit
          </h4>
          <div className="text-xs text-slate-300 space-y-2">
            <div>
              • <strong>Boshlang'ich nuqta ({origin.id}):</strong> {origin.timeZoneName}
            </div>
            <div>
              • <strong>Yetkazish nuqtasi ({destination.id}):</strong> {destination.timeZoneName}
            </div>
            {origin.timeZoneName !== destination.timeZoneName ? (
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 font-medium">
                Diqqat: Ushbu marshrutda vaqt zonasi o'zgaradi! Broker va qabul qiluvchi ombor (receiver warehouse) ish vaqtiga alohida e'tibor bering.
              </div>
            ) : (
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 font-medium">
                Ikkala shtat bir xil asosiy vaqt zonasida joylashgan.
              </div>
            )}
          </div>
        </div>

        {/* Regulatory Warnings */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Maxsus Eslatmalar & Ruxsatnomalar
          </h4>
          {advisories.length > 0 ? (
            <ul className="space-y-1.5">
              {advisories.map((adv, i) => (
                <li key={i} className="text-xs text-slate-200 flex items-start gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{adv}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-xs text-slate-400 p-3 bg-slate-900/40 rounded-lg">
              Standart IFTA va federal DOT qoidalari amal qiladi. Maxsus alohida shtat ruxsatnomasi talab etilmaydi.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
