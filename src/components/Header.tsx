import React, { useState, useEffect } from 'react';
import { Truck, Clock, ShieldCheck, UserCheck } from 'lucide-react';

interface ZoneClock {
  label: string;
  name: string;
  tz: string;
}

const TIMEZONES: ZoneClock[] = [
  { label: 'EST', name: 'Sharqiy', tz: 'America/New_York' },
  { label: 'CST', name: 'Markaziy', tz: 'America/Chicago' },
  { label: 'MST', name: 'Tog\'li', tz: 'America/Denver' },
  { label: 'PST', name: 'Tinch okeani', tz: 'America/Los_Angeles' },
];

export const Header: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTzTime = (tz: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(time);
    } catch {
      return '--:--';
    }
  };

  return (
    <header className="w-full bg-slate-900/90 border-b border-slate-800 backdrop-blur-xl sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/25 ring-1 ring-amber-400/50">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-extrabold text-white tracking-tight">
                  US Logistics States
                </h1>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Dispetcher Tizimi
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  @komilusmondev
                </span>
              </div>
              <p className="text-xs text-slate-400">
                AQSh shtatlari qisqartmalari, yuk magistrallari, vaqt zonalari va interaktiv xaritasi
              </p>
            </div>
          </div>

          {/* Real-time US Timezone Clocks */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold px-2 py-1 bg-slate-950/60 rounded-lg border border-slate-800">
              <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>AQSh Soatlari:</span>
            </div>
            {TIMEZONES.map(z => (
              <div
                key={z.label}
                className="flex flex-col px-2.5 py-1 bg-slate-950/80 rounded-lg border border-slate-800/80 min-w-[76px]"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                  <span className="text-amber-400 font-mono">{z.label}</span>
                  <span className="text-[9px] text-slate-500">{z.name}</span>
                </div>
                <div className="text-xs font-mono font-bold text-slate-200">
                  {formatTzTime(z.tz)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
