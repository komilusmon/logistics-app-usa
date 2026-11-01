import React, { useState, useEffect, useRef } from 'react';
import { Search, X, AlertTriangle, CheckCircle2, Sparkles, CornerDownLeft } from 'lucide-react';
import { searchState } from '../utils/searchState';
import { StateData, SearchResult } from '../types/state';

interface StateSearchBarProps {
  onStateFound: (state: StateData) => void;
  selectedState: StateData | null;
}

const QUICK_CHIPS = [
  { code: 'TX', name: 'Texas' },
  { code: 'CA', name: 'California' },
  { code: 'IL', name: 'Illinois' },
  { code: 'FL', name: 'Florida' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'OH', name: 'Ohio' },
  { code: 'GA', name: 'Georgia' },
  { code: 'W', name: 'Wyoming (W/WY)' },
  { code: 'PR', name: 'Puerto Rico' },
  { code: 'TT', name: 'Trust Territories' },
];

export const StateSearchBar: React.FC<StateSearchBarProps> = ({ onStateFound, selectedState }) => {
  const [query, setQuery] = useState('');
  const [lastResult, setLastResult] = useState<SearchResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // When query changes, perform search
  const handleSearch = (text: string) => {
    setQuery(text);
    if (!text.trim()) {
      setLastResult(null);
      return;
    }

    const res = searchState(text);
    setLastResult(res);

    if (res.state) {
      onStateFound(res.state);
    }
  };

  const handleClear = () => {
    setQuery('');
    setLastResult(null);
    inputRef.current?.focus();
  };

  const handleSelectAlternative = (altState: StateData) => {
    setQuery(altState.id);
    const res = searchState(altState.id);
    setLastResult(res);
    onStateFound(altState);
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-md">
      <div className="flex flex-col gap-3">
        {/* Search Bar Input Container */}
        <div className="relative flex items-center">
          <div className="absolute left-4 text-amber-400 pointer-events-none">
            <Search className="w-5 h-5" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Shtat qisqartmasini yozing (masalan: TX, CA, IL, W, NY, PR...) yoki shtat nomini..."
            className="w-full pl-12 pr-28 py-3.5 bg-slate-950 border border-slate-700/80 rounded-xl text-base sm:text-lg font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-sans"
            aria-label="Shtat qisqartmasi qidiruvi"
          />

          <div className="absolute right-3 flex items-center gap-1.5">
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Tozalash"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[11px] font-mono text-slate-400 bg-slate-800/90 border border-slate-700 rounded-md">
              <CornerDownLeft className="w-3 h-3" /> ENTER
            </kbd>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Tezkor tanlov:
          </span>
          {QUICK_CHIPS.map(chip => (
            <button
              key={chip.code}
              type="button"
              onClick={() => handleSearch(chip.code)}
              className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-all shrink-0 ${
                selectedState?.id === chip.code || (chip.code === 'W' && selectedState?.id === 'WY')
                  ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/50'
                  : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-amber-500/50 hover:text-amber-300'
              }`}
            >
              {chip.code} <span className="font-sans font-normal text-[11px] opacity-80">({chip.name.split(' ')[0]})</span>
            </button>
          ))}
        </div>

        {/* Dynamic Search Feedback & Typo Autocorrection Alert */}
        {lastResult && (
          <div className="mt-1">
            {lastResult.matchType === 'exact_code' && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs sm:text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">To'g'ri qisqartma topildi:</span>{' '}
                  <strong className="text-white font-mono text-base">{lastResult.state?.id}</strong> ={' '}
                  <strong className="text-white">{lastResult.state?.name}</strong> shtati. Quyida xaritadagi joylashuvi va to'liq logistika ma'lumotlari chiqarildi.
                </div>
              </div>
            )}

            {lastResult.matchType === 'exact_name' && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs sm:text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Shtat nomi aniqlandi:</span>{' '}
                  <strong className="text-white">{lastResult.state?.name}</strong>. Rasmiy qisqartmasi:{' '}
                  <strong className="text-white font-mono text-base">{lastResult.state?.id}</strong>.
                </div>
              </div>
            )}

            {lastResult.matchType === 'alias' && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs sm:text-sm">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Maxsus qisqartma aniqlandi:</span>{' '}
                  "{lastResult.query}" qisqartmasi{' '}
                  <strong className="text-white">{lastResult.state?.name} ({lastResult.state?.id})</strong> shtatiga yo'naltirildi.
                </div>
              </div>
            )}

            {lastResult.matchType === 'fuzzy' && (
              <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-amber-950/50 border border-amber-500/40 text-amber-200 text-xs sm:text-sm shadow-lg">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-bounce" />
                  <div>
                    <span className="font-bold text-amber-300">Xatolik topildi, lekin to'g'ri javob aniqlandi!</span>
                    <p className="mt-0.5 text-slate-200">
                      Siz kiritgan so'rov: <code className="px-1.5 py-0.5 rounded bg-slate-900 font-mono text-amber-300 font-bold">{lastResult.query}</code> rasmiy 2-harfli qisqartma emas.
                      Eng yaqin to'g'ri shtat:{' '}
                      <strong className="text-white font-semibold underline decoration-amber-400 underline-offset-2">
                        {lastResult.state?.name} ({lastResult.state?.id})
                      </strong>.
                    </p>
                  </div>
                </div>

                {lastResult.alternativeMatches && lastResult.alternativeMatches.length > 0 && (
                  <div className="flex items-center gap-2 pt-1 border-t border-amber-500/20 text-xs flex-wrap">
                    <span className="text-amber-300/80 font-medium">Balki boshqa shtatni nazarda tutgandirsiz?</span>
                    {lastResult.alternativeMatches.map(alt => (
                      <button
                        key={alt.id}
                        type="button"
                        onClick={() => handleSelectAlternative(alt)}
                        className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-white font-mono hover:bg-amber-500 hover:text-slate-950 font-bold transition-colors"
                      >
                        {alt.id} - {alt.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {lastResult.matchType === 'none' && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs sm:text-sm">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Topilmadi:</span> "{lastResult.query}" bo'yicha hech qaysi AQSh shtati yoki hududi aniqlanmadi. Iltimos, 2 xonali qisqartmani (masalan: AL, CA, TX, IL, WY) tekshirib qayta kiriting.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
