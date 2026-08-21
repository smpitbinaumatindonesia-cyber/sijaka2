import React, { useState, useRef } from 'react';
import { 
  Users, 
  HeartHandshake, 
  DollarSign, 
  Clock, 
  TrendingUp
} from 'lucide-react';
import { DashboardMetricData } from '../services/dashboardService';

interface ExecutiveKpiCardsProps {
  metrics: DashboardMetricData;
  kasMasukTotal: number;
}

export const ExecutiveKpiCards: React.FC<ExecutiveKpiCardsProps> = ({ metrics }) => {
  const [activeKpiIndex, setActiveKpiIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft } = scrollContainerRef.current;
      const cardWidth = 165;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setActiveKpiIndex(Math.min(Math.max(0, newIndex), 3));
    }
  };

  const kpiData = [
    {
      id: 'kpi-anggota',
      title: 'TOTAL ANGGOTA',
      value: '1.248',
      growthText: `+${metrics.totalMembersGrowth} (+3,2%)`,
      icon: Users,
      color: 'blue',
      textColor: 'text-blue-400',
      badgeText: '83% Terdaftar',
      stroke: '#3B82F6',
      dotColor: '#60A5FA',
      path: 'M 0 18 Q 20 16, 40 12 T 70 8 T 100 4'
    },
    {
      id: 'kpi-santunan',
      title: 'TOTAL SANTUNAN',
      value: '86',
      growthText: 'Rp 215 jt keluar',
      icon: HeartHandshake,
      color: 'purple',
      textColor: 'text-purple-400',
      badgeText: '100% Selesai',
      stroke: '#8B5CF6',
      dotColor: '#A78BFA',
      path: 'M 0 20 Q 30 18, 50 14 T 80 12 T 100 6'
    },
    {
      id: 'kpi-iuran',
      title: 'TOTAL DANA IURAN',
      value: 'Rp 125,45 jt',
      growthText: '+8,4% vs lalu',
      icon: DollarSign,
      color: 'emerald',
      textColor: 'text-emerald-400',
      badgeText: 'Kas Solven',
      stroke: '#10B981',
      dotColor: '#34D399',
      path: 'M 0 20 Q 25 15, 50 16 T 75 8 T 100 2'
    },
    {
      id: 'kpi-pengajuan',
      title: 'PENGAJUAN AKTIF',
      value: '7',
      growthText: 'Verifikasi Berkas',
      icon: Clock,
      color: 'amber',
      textColor: 'text-amber-400',
      badgeText: '< 24 Jam',
      stroke: '#F59E0B',
      dotColor: '#FCD34D',
      path: 'M 0 14 Q 30 18, 50 10 T 80 12 T 100 8'
    }
  ];

  return (
    <div className="w-full">
      {/* MOBILE: Horizontal Carousel with Scroll Snap (max-width: 639px / <sm) */}
      <div className="block sm:hidden">
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-3 pb-2.5 px-0.5"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {kpiData.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="w-[160px] min-w-[155px] max-w-[165px] h-[115px] bg-[#0B1428] border border-slate-800/80 rounded-xl p-3.5 shadow-sm relative overflow-hidden flex flex-col justify-between snap-center shrink-0"
              >
                <div className="flex items-start justify-between gap-1">
                  <div className="space-y-0.5 truncate">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block truncate">
                      {item.title}
                    </span>
                    <div className="text-xl font-black text-white tracking-tight leading-tight">
                      {item.value}
                    </div>
                  </div>
                  <div className={`w-6 h-6 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-800 ${item.textColor} shrink-0`}>
                    <Icon className="w-3.5 h-3.5 stroke-[2]" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-800/80">
                  <span className={`font-medium flex items-center gap-0.5 ${item.textColor} truncate`}>
                    <TrendingUp className="w-3 h-3 shrink-0" />
                    <span className="truncate">{item.growthText}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Carousel Indicators (● ○ ○ ○) */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {kpiData.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeKpiIndex === idx 
                  ? 'w-4 bg-blue-500' 
                  : 'w-1.5 bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* DESKTOP / TABLET (sm: and above): EXACT 4-COLUMN LOCKED GRID */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* 1. TOTAL ANGGOTA (Blue) */}
        <div className="bg-[#0B1428] border border-slate-800/80 hover:border-slate-700 rounded-xl p-4 sm:p-5 shadow-sm relative overflow-hidden group transition-all duration-200">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider block">
                TOTAL ANGGOTA
              </span>
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans">
                1.248
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium pt-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+{metrics.totalMembersGrowth} (+3,2% thn ini)</span>
              </div>
            </div>
            <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center border border-blue-500/20 shrink-0">
              <Users className="w-5 h-5 stroke-[2]" />
            </div>
          </div>

          {/* SVG Mini Sparkline */}
          <div className="mt-3.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
            <div className="w-20 h-5">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 100 24">
                <path
                  d="M 0 18 Q 20 16, 40 12 T 70 8 T 100 4"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="4" r="2.5" fill="#60A5FA" />
              </svg>
            </div>
            <span className="text-xs text-blue-400 font-semibold">83% Terdaftar</span>
          </div>
        </div>

        {/* 2. TOTAL SANTUNAN (Purple) */}
        <div className="bg-[#0B1428] border border-slate-800/80 hover:border-slate-700 rounded-xl p-4 sm:p-5 shadow-sm relative overflow-hidden group transition-all duration-200">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider block">
                TOTAL SANTUNAN
              </span>
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans">
                86
              </div>
              <div className="flex items-center gap-1.5 text-xs text-purple-400 font-medium pt-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Rp 215.000.000 tersalurkan</span>
              </div>
            </div>
            <div className="w-10 h-10 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center border border-purple-500/20 shrink-0">
              <HeartHandshake className="w-5 h-5 stroke-[2]" />
            </div>
          </div>

          {/* SVG Mini Sparkline */}
          <div className="mt-3.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
            <div className="w-20 h-5">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 100 24">
                <path
                  d="M 0 20 Q 30 18, 50 14 T 80 12 T 100 6"
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="6" r="2.5" fill="#A78BFA" />
              </svg>
            </div>
            <span className="text-xs text-purple-400 font-semibold">100% Selesai</span>
          </div>
        </div>

        {/* 3. TOTAL DANA IURAN (Emerald Green) */}
        <div className="bg-[#0B1428] border border-slate-800/80 hover:border-slate-700 rounded-xl p-4 sm:p-5 shadow-sm relative overflow-hidden group transition-all duration-200">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider block">
                TOTAL DANA IURAN
              </span>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-400 tracking-tight font-sans">
                Rp 125,45 jt
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium pt-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+8,4% vs tahun lalu</span>
              </div>
            </div>
            <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-500/20 shrink-0">
              <DollarSign className="w-5 h-5 stroke-[2]" />
            </div>
          </div>

          {/* SVG Mini Sparkline */}
          <div className="mt-3.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
            <div className="w-20 h-5">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 100 24">
                <path
                  d="M 0 20 Q 25 15, 50 16 T 75 8 T 100 2"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="2" r="2.5" fill="#34D399" />
              </svg>
            </div>
            <span className="text-xs text-emerald-400 font-semibold">Kas Solven</span>
          </div>
        </div>

        {/* 4. PENGAJUAN AKTIF (Amber) */}
        <div className="bg-[#0B1428] border border-slate-800/80 hover:border-slate-700 rounded-xl p-4 sm:p-5 shadow-sm relative overflow-hidden group transition-all duration-200">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider block">
                PENGAJUAN AKTIF
              </span>
              <div className="text-2xl sm:text-3xl font-bold text-amber-400 tracking-tight font-sans">
                7
              </div>
              <div className="flex items-center gap-1.5 text-xs text-amber-300 font-medium pt-0.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Verifikasi Berkas RT/RW</span>
              </div>
            </div>
            <div className="w-10 h-10 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center border border-amber-500/20 shrink-0">
              <Clock className="w-5 h-5 stroke-[2]" />
            </div>
          </div>

          {/* SVG Mini Sparkline */}
          <div className="mt-3.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
            <div className="w-20 h-5">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 100 24">
                <path
                  d="M 0 14 Q 30 18, 50 10 T 80 12 T 100 8"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="8" r="2.5" fill="#FCD34D" />
              </svg>
            </div>
            <span className="text-xs text-amber-400 font-semibold">&lt; 24 Jam</span>
          </div>
        </div>

      </div>
    </div>
  );
};
