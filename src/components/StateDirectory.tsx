import React, { useState, useMemo } from 'react';
import { US_STATES } from '../data/states';
import { StateData } from '../types/state';
import { Search, Filter, ArrowUpRight, Clock, Building2, ShieldAlert, Snowflake, TrendingUp } from 'lucide-react';

interface StateDirectoryProps {
  onSelectState: (state: StateData) => void;
  selectedStateId?: string;
}

export const StateDirectory: React.FC<StateDirectoryProps> = ({ onSelectState, selectedStateId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedTz, setSelectedTz] = useState<string>('All');
  const [selectedMarket, setSelectedMarket] = useState<string>('All');

  const filteredStates = useMemo(() => {
    return US_STATES.filter(st => {
      const matchSearch =
        st.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        st.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        st.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        st.capital.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (st.aliases && st.aliases.some(a => a.toLowerCase().includes(searchTerm.toLowerCase())));

      const matchRegion = selectedRegion === 'All' || st.region === selectedRegion;
      const matchTz = selectedTz === 'All' || st.timeZoneName.includes(selectedTz);
      const matchMarket = selectedMarket === 'All' || st.marketType === selectedMarket;

      return matchSearch && matchRegion && matchTz && matchMarket;
    });
  }, [searchTerm, selectedRegion, selectedTz, selectedMarket]);

  const regions = ['All', 'Midwest', 'Southeast', 'Northeast', 'Southwest', 'West', 'Territory'];
  const timezones = ['All', 'EST', 'CST', 'MST', 'PST'];
  const markets = ['All', 'Outbound Heavy', 'Inbound Consumer', 'Transit Hub', 'Balanced'];

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-md space-y-4">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h3 className="text-xl font-extrabold text-white">
            Barcha Shtatlar va Hududlar Katalogi ({filteredStates.length} / {US_STATES.length})
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            50 ta Shtat + 6 ta Hudud: Qisqartmalar, bozor xususiyatlari, vaqt zonalari va poytaxtlar
          </p>
        </div>

        {/* Search input in Directory */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Qisqartma, nom yoki laqab bo'yicha..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-2 border-b border-slate-800/60 text-xs">
        {/* Region filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-amber-400" /> Mintaqa:
          </span>
          {regions.map(reg => (
            <button
              key={reg}
              type="button"
              onClick={() => setSelectedRegion(reg)}
              className={`px-2 py-0.5 rounded-lg font-medium transition-colors ${
                selectedRegion === reg
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {reg === 'All' ? 'Barchasi' : reg === 'Territory' ? 'Hududlar' : reg}
            </button>
          ))}
        </div>

        {/* Timezone filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-sky-400" /> Vaqt:
          </span>
          {timezones.map(tz => (
            <button
              key={tz}
              type="button"
              onClick={() => setSelectedTz(tz)}
              className={`px-2 py-0.5 rounded-lg font-mono text-xs transition-colors ${
                selectedTz === tz
                  ? 'bg-sky-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {tz === 'All' ? 'Barchasi' : tz}
            </button>
          ))}
        </div>

        {/* Market Profile filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Bozor:
          </span>
          {markets.map(m => (
            <button
              key={m}
              type="button"
              onClick={() => setSelectedMarket(m)}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-colors ${
                selectedMarket === m
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {m === 'All' ? 'Barchasi' : m}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of States */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4 max-h-[640px] overflow-y-auto pr-1">
        {filteredStates.map(st => {
          const isSelected = selectedStateId === st.id;
          return (
            <div
              key={st.id}
              onClick={() => onSelectState(st)}
              className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between group ${
                isSelected
                  ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-600 hover:bg-slate-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-lg font-black text-amber-400 group-hover:text-amber-300">
                      {st.id}
                    </span>
                    {st.aliases && (
                      <span className="text-[10px] px-1 py-0.2 bg-slate-800 text-slate-400 rounded font-mono">
                        {st.aliases.join(',')}
                      </span>
                    )}
                    {st.hasSpecialPermit && (
                      <span title="Maxsus ruxsatnoma kerak (KYU, WDT, HUT)">
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                      </span>
                    )}
                    {st.hasMandatoryChainLaw && (
                      <span title="Qor zanjiri majburiy">
                        <Snowflake className="w-3.5 h-3.5 text-cyan-400" />
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60">
                    {st.region}
                  </span>
                </div>

                <div className="font-bold text-sm text-slate-100 group-hover:text-white truncate">
                  {st.name}
                </div>
                <div className="text-[11px] text-amber-400/80 italic truncate">
                  "{st.nickname}"
                </div>

                <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                  <span className="truncate flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    {st.capital}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-emerald-400 font-medium">
                    {st.marketType.split(' ')[0]}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/70 flex items-center justify-between text-[11px] text-slate-400">
                <span className="truncate font-mono">{st.timeZoneName.split('/')[0]}</span>
                <span className="text-amber-400 flex items-center gap-0.5 font-semibold group-hover:translate-x-0.5 transition-transform">
                  Ko'rish <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
