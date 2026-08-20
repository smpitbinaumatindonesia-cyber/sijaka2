import React, { useState } from 'react';
import { 
  BarChart2, 
  ChevronDown
} from 'lucide-react';
import { YearPaymentHistory, multiYearComparison } from '../services/dashboardService';

interface PaymentChartProps {
  paymentHistory: YearPaymentHistory;
  selectedYear: number;
  onSelectYear: (year: number) => void;
}

export const InteractivePaymentChart: React.FC<PaymentChartProps> = ({
  paymentHistory,
  selectedYear,
  onSelectYear,
}) => {
  const [viewMode, setViewMode] = useState<'bulan' | 'tahun'>('bulan');
  const [hoveredMonth, setHoveredMonth] = useState<any | null>(null);
  const [hoveredYearItem, setHoveredYearItem] = useState<any | null>(null);

  // 12 Realistic Monthly Data points matching requirements:
  // Green = tepat waktu (80%), Orange = terlambat (10%), Gray = belum bayar (10%)
  const fullYearMonths = [
    { name: 'Januari', shortName: 'Jan', amount: 10450000, status: 'paid', tepatWaktuPct: 85, terlambatPct: 10, belumBayarPct: 5, note: '100% Lunas Tepat Waktu' },
    { name: 'Februari', shortName: 'Feb', amount: 10450000, status: 'paid', tepatWaktuPct: 82, terlambatPct: 12, belumBayarPct: 6, note: '100% Lunas Tepat Waktu' },
    { name: 'Maret', shortName: 'Mar', amount: 10450000, status: 'paid', tepatWaktuPct: 80, terlambatPct: 10, belumBayarPct: 10, note: '100% Lunas Tepat Waktu' },
    { name: 'April', shortName: 'Apr', amount: 10450000, status: 'paid', tepatWaktuPct: 84, terlambatPct: 8, belumBayarPct: 8, note: '100% Lunas Tepat Waktu' },
    { name: 'Mei', shortName: 'Mei', amount: 10450000, status: 'paid', tepatWaktuPct: 80, terlambatPct: 10, belumBayarPct: 10, note: 'Tepat Waktu: 80% • Terlambat: 10%' },
    { name: 'Juni', shortName: 'Jun', amount: 10450000, status: 'paid', tepatWaktuPct: 81, terlambatPct: 11, belumBayarPct: 8, note: '100% Lunas Tepat Waktu' },
    { name: 'Juli', shortName: 'Jul', amount: 10450000, status: 'paid', tepatWaktuPct: 83, terlambatPct: 9, belumBayarPct: 8, note: '100% Lunas Tepat Waktu' },
    { name: 'Agustus', shortName: 'Agt', amount: 10450000, status: 'paid', tepatWaktuPct: 80, terlambatPct: 10, belumBayarPct: 10, note: '100% Lunas Tepat Waktu' },
    { name: 'September', shortName: 'Sep', amount: 7250000, status: 'late', tepatWaktuPct: 60, terlambatPct: 30, belumBayarPct: 10, note: 'Terlambat (Sebagian Belum Setor)' },
    { name: 'Oktober', shortName: 'Okt', amount: 0, status: 'unpaid', tepatWaktuPct: 0, terlambatPct: 0, belumBayarPct: 100, note: 'Belum Jatuh Tempo / Belum Bayar' },
    { name: 'November', shortName: 'Nov', amount: 0, status: 'unpaid', tepatWaktuPct: 0, terlambatPct: 0, belumBayarPct: 100, note: 'Belum Jatuh Tempo / Belum Bayar' },
    { name: 'Desember', shortName: 'Des', amount: 0, status: 'unpaid', tepatWaktuPct: 0, terlambatPct: 0, belumBayarPct: 100, note: 'Belum Jatuh Tempo / Belum Bayar' },
  ];

  const formatRupiah = (num: number) => {
    return 'Rp ' + Number(num || 0).toLocaleString('id-ID');
  };

  const maxMonthAmount = 12000000;
  const maxYearAmount = Math.max(...multiYearComparison.map(y => y.total), 220);

  return (
    <div className="bg-[#0B1428] border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden h-full flex flex-col justify-between">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <BarChart2 className="w-4 h-4 stroke-[2]" />
            </span>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
              RIWAYAT PEMBAYARAN IURAN
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Analisis kepatuhan kas jaminan kematian jamaah tahun {selectedYear}
          </p>
        </div>

        {/* View mode toggle & Year selector */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Toggle Bulan / Tahun */}
          <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setViewMode('bulan')}
              className={`px-3 py-1 rounded-md transition-all text-xs font-semibold ${
                viewMode === 'bulan'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Bulan
            </button>
            <button
              onClick={() => setViewMode('tahun')}
              className={`px-3 py-1 rounded-md transition-all text-xs font-semibold ${
                viewMode === 'tahun'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tahun
            </button>
          </div>

          {/* Year Dropdown */}
          {viewMode === 'bulan' && (
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => onSelectYear(Number(e.target.value))}
                className="appearance-none bg-slate-900 text-slate-200 border border-slate-800 hover:border-slate-700 px-3 py-1 pr-7 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-sm"
              >
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="mt-4 flex-1">
        {viewMode === 'bulan' ? (
          <div>
            {/* Legend indicators */}
            <div className="flex flex-wrap items-center gap-4 text-xs mb-3 text-slate-300 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 shadow-sm"></span>
                <span className="text-[11px]">Tepat Waktu (80%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 shadow-sm"></span>
                <span className="text-[11px]">Terlambat (10%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-700 shadow-sm"></span>
                <span className="text-[11px]">Belum Bayar (10%)</span>
              </div>
            </div>

            {/* Responsive 12 Monthly Bar Chart */}
            <div className="overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-700">
              <div className="min-w-[540px] h-48 flex items-end justify-between gap-2.5 pt-6 px-1 relative border-b border-slate-800">
                {/* Horizontal Grid lines */}
                <div className="absolute inset-x-0 top-4 border-b border-slate-800/40 pointer-events-none"></div>
                <div className="absolute inset-x-0 top-18 border-b border-slate-800/40 pointer-events-none"></div>
                <div className="absolute inset-x-0 top-32 border-b border-slate-800/40 pointer-events-none"></div>

                {fullYearMonths.map((m) => {
                  const heightPercent = m.amount > 0 ? Math.round((m.amount / maxMonthAmount) * 100) : 6;
                  const isPaid = m.status === 'paid';
                  const isLate = m.status === 'late';
                  const isUnpaid = m.status === 'unpaid';

                  return (
                    <div
                      key={m.shortName}
                      className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                      onMouseEnter={() => setHoveredMonth(m)}
                      onMouseLeave={() => setHoveredMonth(null)}
                      onClick={() => setHoveredMonth(m)}
                    >
                      {/* Bar Pillar */}
                      <div className="w-full max-w-[34px] bg-slate-900 rounded-t-md overflow-hidden flex flex-col justify-end p-0.5 relative transition-all duration-200 group-hover:scale-105">
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full rounded-t-sm transition-all duration-300 ${
                            isPaid
                              ? 'bg-emerald-500 group-hover:bg-emerald-400'
                              : isLate
                              ? 'bg-amber-500 group-hover:bg-amber-400'
                              : 'bg-slate-700 group-hover:bg-slate-600'
                          }`}
                        ></div>
                      </div>

                      {/* Month Label */}
                      <div className="mt-2 text-center">
                        <span className="text-[11px] font-semibold text-slate-400 group-hover:text-white transition-colors">
                          {m.shortName}
                        </span>
                        <div className="mt-0.5">
                          <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                            isPaid ? 'bg-emerald-400' : isLate ? 'bg-amber-400' : 'bg-slate-600'
                          }`}></span>
                        </div>
                      </div>

                      {/* Tooltip on Hover */}
                      {hoveredMonth?.shortName === m.shortName && (
                        <div className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-white text-[11px] p-2.5 rounded-xl shadow-lg z-30 pointer-events-none whitespace-nowrap min-w-[160px]">
                          <div className="font-bold text-white text-xs border-b border-slate-800 pb-1 mb-1.5 flex items-center justify-between">
                            <span>{m.name} {selectedYear}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                              isPaid ? 'bg-emerald-950 text-emerald-300' : isLate ? 'bg-amber-950 text-amber-300' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {isPaid ? 'Lunas' : isLate ? 'Terlambat' : 'Belum Bayar'}
                            </span>
                          </div>
                          <div className="space-y-0.5 text-slate-300 text-[10px]">
                            <div>Tepat Waktu: <strong className="text-emerald-400 font-mono">{m.tepatWaktuPct}%</strong></div>
                            <div>Terlambat: <strong className="text-amber-400 font-mono">{m.terlambatPct}%</strong></div>
                            <div>Belum Dibayar: <strong className="text-slate-400 font-mono">{m.belumBayarPct}%</strong></div>
                            <div className="pt-1 border-t border-slate-800/80 text-white font-medium">Total: <strong className="font-mono">{formatRupiah(m.amount)}</strong></div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Multi Year Comparison View */
          <div>
            <div className="text-xs text-slate-400 mb-3 font-medium">
              Perbandingan akumulasi dana iuran masuk tahunan (dalam Juta Rupiah):
            </div>
            <div className="h-48 flex items-end justify-around gap-4 pt-6 px-3 border-b border-slate-800">
              {multiYearComparison.map((y) => {
                const heightPercent = Math.round((y.total / maxYearAmount) * 100);
                return (
                  <div
                    key={y.year}
                    className="flex-1 max-w-[100px] flex flex-col items-center h-full justify-end group cursor-pointer relative"
                    onMouseEnter={() => setHoveredYearItem(y)}
                    onMouseLeave={() => setHoveredYearItem(null)}
                  >
                    <div className="w-full bg-slate-900 rounded-t-lg p-1 flex flex-col justify-end">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-blue-600 hover:bg-blue-500 rounded-t-md transition-all duration-300 shadow-sm"
                      ></div>
                    </div>
                    <div className="mt-2 text-center">
                      <span className="text-xs font-semibold text-white block">{y.year}</span>
                      <span className="text-[10px] font-mono text-blue-400 font-bold block">Rp {y.total} jt</span>
                    </div>

                    {hoveredYearItem?.year === y.year && (
                      <div className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-white text-xs p-2.5 rounded-xl shadow-lg z-30 pointer-events-none whitespace-nowrap">
                        <div className="font-semibold text-blue-400 mb-0.5">Tahun {y.year}</div>
                        <div>Total: <strong>Rp {y.total}.000.000</strong></div>
                        <div className="text-[11px] text-slate-400">Kepatuhan: {y.kepatuhan}%</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
