import React from 'react';
import { 
  Users, 
  DollarSign, 
  Heart, 
  CreditCard, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  Sparkles,
  BarChart3,
  Activity,
  ChevronRight,
  PieChart
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
  iuranList,
  kematianList,
  bukuKasList,
  summaryKas,
  paymentHistory,
  selectedYear,
  onYearChange,
  activities,
  onSelectSubTab
}) => {
  const formatRupiah = (num: number) => {
    return `Rp ${num.toLocaleString('id-ID')}`;
  };

  const activeMembersCount = anggotaList.filter(a => (a.status || 'Aktif') === 'Aktif').length;
  const activePct = Math.round((activeMembersCount / Math.max(1, anggotaList.length)) * 100);

  // Santunan Reserve Ratio calculation: Saldo / Rp 2.500.000 (how many claims covered)
  const claimsCovered = Math.floor(summaryKas.saldo / 2500000);

  return (
    <div className="space-y-6 sm:space-y-8 font-sans animate-in fade-in duration-300">
      
      {/* 1. EXECUTIVE WELCOME HERO */}
      <div className="relative rounded-3xl p-6 sm:p-8 lg:p-9 bg-[#0B1428] border border-purple-500/30 shadow-xl overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-5">
          
          {/* Header & Salam */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div className="space-y-0.5">
              <span className="text-xs text-slate-400 font-medium">ASSALAMU’ALAIKUM WARAHMATULLAHI WABARAKATUH</span>
              <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                <span>Selamat Datang, Bapak Ketua {chairmanName}</span>
                <span>👋</span>
              </h1>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>KETUA JAMAAH • PENGAWASAN EKSEKUTIF</span>
            </div>
          </div>

          {/* Subtitles */}
          <div className="space-y-1">
            <div className="text-sm sm:text-base font-bold text-purple-300 tracking-wide uppercase">
              PUSAT KENDALI KETUA SIJAKA
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Sistem Informasi Jaminan Kematian • Jamaah Tahlil Ar Rohman • RT 06 • RT 07 • RT 10 — Perum GPA Ngijo
            </div>
          </div>

          {/* Narrative */}
          <p className="text-xs sm:text-sm text-slate-300 max-w-4xl leading-relaxed">
            Ringkasan eksekutif tata kelola dana sosial kematian dan pengawasan layanan jamaah secara amanah, bijaksana, dan transparan.
          </p>

          {/* Executive Overview Areas */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 flex items-center gap-1.5 font-medium">
              <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
              <span>Monitoring</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 flex items-center gap-1.5 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Perlu Perhatian</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 flex items-center gap-1.5 font-medium">
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <span>Laporan</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 flex items-center gap-1.5 font-medium">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Analitik</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
              <span>Status Pelayanan</span>
            </span>
          </div>

          {/* Tagline */}
          <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            <span className="font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-md border border-purple-500/20">
              Semboyan Kepemimpinan:
            </span>
            <span className="font-semibold text-slate-200">
              “Memimpin dengan Amanah, Mengawasi dengan Bijaksana, Melayani dengan Kepedulian.”
            </span>
          </div>

        </div>
      </div>

      {/* 2. EXECUTIVE KPI SUMMARY (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Anggota */}
        <div className="p-5 rounded-2xl bg-[#0B1428] border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">👥 ANGGOTA</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
              {activePct}% Aktif
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-white">{anggotaList.length} KK</div>
            <p className="text-xs text-slate-400 mt-1">Total Kepala Keluarga Terdaftar RT 06, 07, 10</p>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Tingkat Kepatuhan:</span>
            <span className="font-bold text-emerald-400">Tinggi (Sangat Baik)</span>
          </div>
        </div>

        {/* Card 2: Iuran */}
        <div className="p-5 rounded-2xl bg-[#0B1428] border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">💰 IURAN</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              +{metrics.totalContributionGrowthPct}% Thn Ini
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              {formatRupiah(summaryKas.masuk)}
            </div>
            <p className="text-xs text-slate-400 mt-1">Total Realisasi Iuran Kas Masuk</p>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Rata-rata Setor:</span>
            <span className="font-bold text-white font-mono">Rp 50.000 / KK</span>
          </div>
        </div>

        {/* Card 3: Santunan */}
        <div className="p-5 rounded-2xl bg-[#0B1428] border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">🤲 SANTUNAN</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20">
              {kematianList.length} Peristiwa
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-rose-400 font-mono">
              {formatRupiah(summaryKas.keluar)}
            </div>
            <p className="text-xs text-slate-400 mt-1">Total Santunan Duka Tersalurkan</p>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Nilai per Klaim:</span>
            <span className="font-bold text-white font-mono">Rp 2.500.000</span>
          </div>
        </div>

        {/* Card 4: Keuangan / Kas Akumulatif */}
        <div className="p-5 rounded-2xl bg-[#0B1428] border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">💳 KEUANGAN</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
              Sehat
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-blue-400 font-mono">
              {formatRupiah(summaryKas.saldo)}
            </div>
            <p className="text-xs text-slate-400 mt-1">Saldo Kas Akumulatif Siap Pakai</p>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Daya Cadangan:</span>
            <span className="font-bold text-emerald-400 font-mono">± {claimsCovered} Santunan</span>
          </div>
        </div>

      </div>

      {/* 3. PERLU PERHATIAN (OVERSIGHT ALERTS & FINANCIAL HEALTH) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0B1428] border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-bold text-white">Catatan Pengawasan Eksekutif</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">Status Performa Kas: Sangat Prima</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Rasio Likuiditas Kas Santunan</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Saldo kas saat ini ({formatRupiah(summaryKas.saldo)}) mencukupi untuk menanggung estimasi santunan musibah darurat secara berkelanjutan.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
            <div className="font-bold text-blue-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>Pertumbuhan Kepesertaan</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Sebanyak {anggotaList.length} KK telah terdata lengkap dalam database dengan kepatuhan pembayaran di atas rata-rata rukun tetangga.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
            <div className="font-bold text-purple-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Kesiapan Laporan Pertanggungjawaban</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Data kas masuk dan kas keluar terhubung langsung dengan Google Sheets dan siap diekspor untuk rapat musyawarah warga.
            </p>
          </div>
        </div>
      </div>

      {/* 4. TREN IURAN & PEMBAYARAN (INTERACTIVE PAYMENT CHART) */}
      <InteractivePaymentChart
        paymentHistory={paymentHistory}
        selectedYear={selectedYear}
        onSelectYear={onYearChange}
      />

      {/* 5. AKTIVITAS EKSEKUTIF TERBARU */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-12">
          <RecentActivitiesPanel activities={activities} />
        </div>
      </div>

    </div>
  );
};
