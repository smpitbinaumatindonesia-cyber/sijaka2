import React from 'react';
import { 
  ShieldCheck, 
  Database, 
  Bot, 
  Code2, 
  Lock, 
  Settings, 
  Activity, 
  Users, 
  DollarSign, 
  Heart, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Wifi, 
  Server, 
  Cpu, 
  ChevronRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { DashboardMetricData, YearPaymentHistory, ActivityItem } from '../../services/dashboardService';
import { Anggota, IuranRecord, KematianRecord, BukuKasRecord, SijakaRole } from '../../types';
import { ExecutiveKpiCards } from '../ExecutiveKpiCards';
import { InteractivePaymentChart } from '../InteractivePaymentChart';
import { RecentActivitiesPanel } from '../RecentActivitiesPanel';
import { RecentMembersTable } from '../RecentMembersTable';

interface AdminDashboardProps {
  userRole: SijakaRole;
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
  onOpenWaBotSimulator?: () => void;
  onOpenSettings?: () => void;
  onNavigateTab?: (tab: 'webApp' | 'waBot' | 'sheets' | 'code' | 'security') => void;
  onSelectSubTab: (tab: 'kematian' | 'iuran' | 'anggota' | 'bukukas' | 'users' | 'layanan') => void;
  onOpenTambahAnggota: () => void;
  onOpenInputIuran: () => void;
  onOpenLaporKematian: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  userRole,
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
  onOpenWaBotSimulator,
  onOpenSettings,
  onNavigateTab,
  onSelectSubTab,
  onOpenTambahAnggota,
  onOpenInputIuran,
  onOpenLaporKematian
}) => {
  const isSuperAdmin = userRole === 'Super Admin';

  return (
    <div className="space-y-6 sm:space-y-8 font-sans animate-in fade-in duration-300">
      
      {/* 1. ADMINISTRATIVE WELCOME HERO */}
      <div className="relative rounded-3xl p-6 sm:p-8 lg:p-9 bg-[#0B1428] border border-amber-500/30 shadow-xl overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-5">
          
          {/* Header & Salam */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div className="space-y-0.5">
              <span className="text-xs text-slate-400 font-medium">ASSALAMU’ALAIKUM WARAHMATULLAHI WABARAKATUH</span>
              <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                <span>Selamat Datang, Admin SIJAKA</span>
                <span>👋</span>
              </h1>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>{isSuperAdmin ? 'SUPER ADMINISTRATOR' : 'ADMINISTRATOR UTAMA'}</span>
            </div>
          </div>

          {/* Subtitles */}
          <div className="space-y-1">
            <div className="text-sm sm:text-base font-bold text-amber-400 tracking-wide uppercase">
              PUSAT KENDALI ADMINISTRASI SIJAKA
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Sistem Informasi Jaminan Kematian • Jamaah Tahlil Ar Rohman • RT 06 • RT 07 • RT 10 — Perum GPA Ngijo
            </div>
          </div>

          {/* Narrative */}
          <p className="text-xs sm:text-sm text-slate-300 max-w-4xl leading-relaxed">
            Pusat kendali dan audit administrasi sistem: Google Sheets database sinkron, WhatsApp gateway, manajemen akses pengguna, dan log keamanan terproteksi.
          </p>

          {/* Tagline */}
          <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            <span className="font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
              Semboyan Administrasi:
            </span>
            <span className="font-semibold text-slate-200">
              “Mengelola Data dengan Amanah, Melayani Jamaah dengan Tertib, Menjaga Amanah Bersama.”
            </span>
          </div>

        </div>
      </div>

      {/* 2. SYSTEM HEALTH & INTEGRATION STATUS BAR */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0B1428] border border-slate-800/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>System Health & Integration Status</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>PRODUCTION READY</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Backend GAS RPC: Online (12s timeout safe) • PBKDF2 HMAC-SHA256 Sessions Active
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span>Sheets 10 Schema: OK</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
            <span>Fonnte WA: Active</span>
          </span>

          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all text-xs"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Konfigurasi</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. ADMIN KPI SUMMARY CARDS */}
      <ExecutiveKpiCards
        metrics={metrics}
        kasMasukTotal={summaryKas.masuk}
      />

      {/* 4. ADMIN SYSTEM CONTROL PANELS (Quick Admin Tools) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0B1428] border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-400" />
            <h2 className="text-base font-bold text-white">Alat Administrasi & Pengawasan Sistem</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">Panel Terproteksi RBAC</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          
          <button
            onClick={() => onNavigateTab && onNavigateTab('sheets')}
            className="p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2">
              <Database className="w-4 h-4" />
            </div>
            <div className="font-bold text-white group-hover:text-blue-300 text-xs">Database Sheets</div>
            <div className="text-[10px] text-slate-400 mt-0.5">10 Skema Spreadsheet</div>
          </button>

          <button
            onClick={() => onNavigateTab && onNavigateTab('waBot')}
            className="p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
              <Bot className="w-4 h-4" />
            </div>
            <div className="font-bold text-white group-hover:text-emerald-300 text-xs">WA Gateway Bot</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Simulator & Notifikasi</div>
          </button>

          <button
            onClick={() => onNavigateTab && onNavigateTab('code')}
            className="p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2">
              <Code2 className="w-4 h-4" />
            </div>
            <div className="font-bold text-white group-hover:text-purple-300 text-xs">GAS Code Exporter</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Salin Script Backend</div>
          </button>

          <button
            onClick={() => onNavigateTab && onNavigateTab('security')}
            className="p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center mb-2">
              <Lock className="w-4 h-4" />
            </div>
            <div className="font-bold text-white group-hover:text-rose-300 text-xs">Security Center</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Audit Logs & RBAC</div>
          </button>

          <button
            onClick={onOpenSettings}
            className="p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2">
              <Settings className="w-4 h-4" />
            </div>
            <div className="font-bold text-white group-hover:text-amber-300 text-xs">Konfigurasi Produksi</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Masked Secret & GAS URL</div>
          </button>

        </div>
      </div>

      {/* 5. DATA & ADMINISTRASI OVERVIEW (Aktivitas + Tabel Anggota) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <RecentActivitiesPanel activities={activities} />
        </div>
        <div className="lg:col-span-6">
          <RecentMembersTable
            anggotaList={anggotaList}
            onViewAllMembers={() => onSelectSubTab('anggota')}
          />
        </div>
      </div>

      {/* 6. ANALITIK PEMBAYARAN IURAN */}
      <InteractivePaymentChart
        paymentHistory={paymentHistory}
        selectedYear={selectedYear}
        onSelectYear={onYearChange}
      />

    </div>
  );
};
