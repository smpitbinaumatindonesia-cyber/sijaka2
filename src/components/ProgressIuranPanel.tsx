import React from 'react';
import { 
  ShieldCheck
} from 'lucide-react';
import { YearPaymentHistory, paymentDataStore } from '../services/dashboardService';

interface ProgressIuranPanelProps {
  selectedYear: number;
  onSelectYear: (year: number) => void;
}

export const ProgressIuranPanel: React.FC<ProgressIuranPanelProps> = ({
  selectedYear,
  onSelectYear
}) => {
  const currentData: YearPaymentHistory = paymentDataStore[selectedYear] || paymentDataStore[2026];

  // Specific 12-month indicators layout as requested:
  // Jan ✓, Feb ✓, Mar ✓, Apr ✓, Mei ✓, Jun ✓, Jul ✓, Agt ✓, Sep !, Okt –, Nov –, Des –
  const monthsStatus = [
    { label: 'Jan', symbol: '✓', status: 'lunas', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { label: 'Feb', symbol: '✓', status: 'lunas', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { label: 'Mar', symbol: '✓', status: 'lunas', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { label: 'Apr', symbol: '✓', status: 'lunas', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { label: 'Mei', symbol: '✓', status: 'lunas', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { label: 'Jun', symbol: '✓', status: 'lunas', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { label: 'Jul', symbol: '✓', status: 'lunas', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { label: 'Agt', symbol: '✓', status: 'lunas', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { label: 'Sep', symbol: '!', status: 'terlambat', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    { label: 'Okt', symbol: '–', status: 'unpaid', color: 'text-slate-500 bg-slate-900 border-slate-800' },
    { label: 'Nov', symbol: '–', status: 'unpaid', color: 'text-slate-500 bg-slate-900 border-slate-800' },
    { label: 'Des', symbol: '–', status: 'unpaid', color: 'text-slate-500 bg-slate-900 border-slate-800' },
  ];

  return (
    <div className="bg-[#0B1428] border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl h-full flex flex-col justify-between">
      
      {/* Header & Year Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
              PROGRESS IURAN ANDA
            </h3>
            <p className="text-[11px] text-slate-400">
              Monitoring kepatuhan tahun berjalan
            </p>
          </div>
        </div>

        {/* Year Selector Pills */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold self-start sm:self-auto">
          {[2024, 2025, 2026].map((yr) => (
            <button
              key={yr}
              onClick={() => onSelectYear(yr)}
              className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                selectedYear === yr
                  ? 'bg-emerald-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {yr}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="space-y-4 my-auto pt-3">
        
        {/* Summary Block */}
        <div className="flex items-center gap-4 p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800/80">
          {/* Circular Indicator */}
          <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-500 transition-all duration-1000 ease-out"
                strokeDasharray="80, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-sm font-black text-white">80%</span>
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="text-[11px] font-black text-emerald-400 uppercase tracking-wider">
              TEPAT WAKTU
            </div>
            <div className="text-sm font-extrabold text-white">
              8 dari 12 Bulan Lunas
            </div>
            <div className="text-[10px] text-slate-400">
              Periode Tahun {selectedYear}
            </div>
          </div>
        </div>

        {/* 12-Month Badges Grid (4 cols x 3 rows) */}
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {monthsStatus.map((m) => (
            <div
              key={m.label}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl border text-xs font-black transition-all ${m.color}`}
            >
              <span>{m.label}</span>
              <span>{m.symbol}</span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-400 font-semibold border-t border-slate-800/80">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-slate-300">Lunas</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="text-slate-300">Terlambat</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-600"></span>
            <span className="text-slate-300">Belum Dibayar</span>
          </div>
        </div>

      </div>
    </div>
  );
};
