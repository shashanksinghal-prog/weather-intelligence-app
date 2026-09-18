import React from 'react';
import { CloudSun, RefreshCw, Globe } from 'lucide-react';

interface HeaderProps {
  tempUnit: 'C' | 'F';
  onToggleUnit: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdated?: string;
}

export const Header: React.FC<HeaderProps> = ({
  tempUnit,
  onToggleUnit,
  onRefresh,
  isRefreshing,
  lastUpdated,
}) => {
  return (
    <header className="w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-sky-400 flex items-center justify-center shadow-xs">
            <CloudSun className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-none">
              Weather Intelligence
            </h1>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block mt-0.5">
              Accurate multi-timezone insights & forecast analytics
            </p>
          </div>
        </div>

        {/* Right Controls: Unit Toggle & Refresh Button */}
        <div className="flex items-center gap-2.5">
          {/* Temperature unit switch */}
          <div
            id="unit-toggle-group"
            className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/60"
          >
            <button
              id="btn-unit-c"
              type="button"
              onClick={tempUnit === 'F' ? onToggleUnit : undefined}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                tempUnit === 'C'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              °C
            </button>
            <button
              id="btn-unit-f"
              type="button"
              onClick={tempUnit === 'C' ? onToggleUnit : undefined}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                tempUnit === 'F'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              °F
            </button>
          </div>

          {/* Refresh Button */}
          <button
            id="btn-refresh-weather"
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-xs transition-all disabled:opacity-50 active:scale-95"
            title="Refresh current forecast"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-600' : 'text-slate-500'}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>
    </header>
  );
};
