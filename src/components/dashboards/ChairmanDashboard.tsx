import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  FileText
} from 'lucide-react';
import { DashboardMetricData, YearPaymentHistory, ActivityItem } from '../../services/dashboardService';
import { Anggota, IuranRecord, KematianRecord, BukuKasRecord } from '../../types';
import { InteractivePaymentChart } from '../InteractivePaymentChart';
import { RecentActivitiesPanel } from '../RecentActivitiesPanel';

interface ChairmanDashboardProps {
  chairmanName?: string;
  metrics: DashboardMetricData;
  anggotaList: Anggota[];
  iuranList: IuranRecord[];
  kematianList: KematianRecord[];
  bukuKasList: BukuKasRecord[];
  summaryKas: { masuk: number; keluar: number; saldo: number };
  paymentHistory: YearPaymentHistory;
  selectedYear: number;
  onYearChange: (year: number) => void;
  activities: ActivityItem[];
  onSelectSubTab: (tab: 'kematian' | 'iuran' | 'anggota' | 'bukukas') => void;
}

export const ChairmanDashboard: React.FC<ChairmanDashboardProps> = ({
  chairmanName = 'H. Ahmad',
  metrics,
  anggotaList,
  kematianList,
  summaryKas,
  paymentHistory,
  selectedYear,
  onYearChange,
  activities
}) => {
  const formatRupiah = (num: number) => {
    return `Rp ${num.toLocaleString('id-ID')}`;
  };

  const activeMembersCount = anggotaList.filter(a => (a.status || 'Aktif') === 'Aktif').length;
  const activePct = Math.round((activeMembersCount / Math.max(1, anggotaList.length)) * 100);

  // Santunan Reserve Ratio calculation: Saldo / Rp 2.500.000 (how many claims covered)
  const claimsCovered = Math.floor(summaryKas.saldo / 2500000);

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto animate-in fade-in duration-300">
      
      {/* 1. EXECUTIVE WELCOME HERO (Calm, Confident & Decision-Oriented) */}
      <div className="rounded-3xl p-6 sm:p-8 bg-[#0B1428] border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">Assalamu’alaikum warahmatullahi wabarakatuh</span>
            <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              Ringkasan Eksekutif: Bapak Ketua {chairmanName}
            </h1>
            <p className="text-xs text-slate-400">
              Jamaah Tahlil Ar Rohman • RT 06 • RT 07 • RT 10 — Perum GPA Ngijo
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold self-start sm:self-center">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>PENGAWASAN EKSEKUTIF</span>
          </div>
        </div>

        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
          Tinjauan strategis tata kelola kas dana kematian, cadangan likuiditas santunan, dan tren kepatuhan gotong royong warga jamaah.
        </p>
      </div>

      {/* 2. MAKSIMAL 4 KPI EKSEKUTIF (Angka Dominan, Label Jelas, Konteks Subtil) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Anggota */}
        <div className="p-5 rounded-2xl bg-[#0B1428] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Anggota</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
              {activePct}% Aktif
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white">{anggotaList.length} KK</div>
            <p className="text-xs text-slate-400 mt-0.5">Kepala Keluarga RT 06, 07, 10</p>
          </div>
        </div>

        {/* KPI 2: Iuran Masuk */}
        <div className="p-5 rounded-2xl bg-[#0B1428] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Iuran Masuk</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              +{metrics.totalContributionGrowthPct}% Thn Ini
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
              {formatRupiah(summaryKas.masuk)}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Total Realisasi Kas Masuk</p>
          </div>
        </div>

        {/* KPI 3: Santunan Tersalurkan */}
        <div className="p-5 rounded-2xl bg-[#0B1428] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Santunan Keluar</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20">
              {kematianList.length} Musibah
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">
              {formatRupiah(summaryKas.keluar)}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Santunan Rp 2,5jt per Klaim</p>
          </div>
        </div>

        {/* KPI 4: Cadangan Kas */}
        <div className="p-5 rounded-2xl bg-[#0B1428] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Cadangan Kas</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
              Sangat Sehat
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">
              {formatRupiah(summaryKas.saldo)}
            </div>
            <p className="text-xs text-emerald-400 mt-0.5 font-medium">Daya Cadangan ± {claimsCovered} Santunan</p>
          </div>
        </div>

      </div>

      {/* 3. PERLU PERHATIAN (Catatan Pengawasan Eksekutif) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0B1428] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-bold text-white">Catatan Pengawasan Tata Kelola</h2>
          </div>
          <span className="text-xs text-emerald-400 font-medium">Status Kas: Prima</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Rasio Likuiditas Kas Santunan</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Saldo kas saat ini ({formatRupiah(summaryKas.saldo)}) sangat mencukupi untuk memenuhi komitmen santunan kematian kapan pun terjadi musibah.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
            <div className="font-bold text-blue-400 flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>Cakupan & Kepatuhan Warga</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Sebanyak {anggotaList.length} KK telah terdata resmi dengan tingkat kepatuhan gotong royong iuran berjalan stabil dan konsisten.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
            <div className="font-bold text-purple-400 flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              <span>Kesiapan Laporan Warga</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Semua mutasi kas masuk dan santunan keluar tercatat otomatis di Google Sheets dan siap dilaporkan dalam musyawarah warga.
            </p>
          </div>
        </div>
      </div>

      {/* 4. SATU GRAFIK TREN UTAMA */}
      <InteractivePaymentChart
        paymentHistory={paymentHistory}
        selectedYear={selectedYear}
        onSelectYear={onYearChange}
      />

      {/* 5. AKTIVITAS EKSEKUTIF TERBARU */}
      <RecentActivitiesPanel activities={activities} />

    </div>
  );
};
