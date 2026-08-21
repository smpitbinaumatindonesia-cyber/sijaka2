import React from 'react';
import { 
  ShieldCheck, 
  Database, 
  Bot, 
  Code2, 
  Lock, 
  Settings, 
  Server
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
  summaryKas,
  paymentHistory,
  selectedYear,
  onYearChange,
  activities,
  onOpenSettings,
  onNavigateTab,
  onSelectSubTab
}) => {
  const isSuperAdmin = userRole === 'Super Admin';

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto animate-in fade-in duration-300">
      
      {/* 1. ADMINISTRATIVE HERO RINGKAS */}
      <div className="rounded-3xl p-6 sm:p-8 bg-[#0B1428] border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="space-y-1.5 min-w-0">
            <span className="text-sm sm:text-base text-slate-400 font-medium block">
              Assalamu’alaikum warahmatullahi wabarakatuh
            </span>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-tight flex items-center gap-2">
              <span>Pusat Kendali Administrasi Sistem</span>
            </h1>
            <div className="text-base sm:text-lg font-semibold text-amber-400">
              Dashboard Administrator & Super Admin
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Jamaah Tahlil Ar Rohman • RT 06 • RT 07 • RT 10 — Perum GPA Ngijo
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs sm:text-sm font-bold self-start sm:self-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>{isSuperAdmin ? 'SUPER ADMINISTRATOR' : 'ADMINISTRATOR UTAMA'}</span>
          </div>
        </div>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
          Pengawasan infrastruktur backend Vercel Serverless API, sinkronisasi 10 skema Google Sheets, audit keamanan PBKDF2, dan gateway notifikasi WhatsApp.
        </p>
      </div>

      {/* 2. SYSTEM HEALTH & INTEGRATION STATUS BAR */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0B1428] border border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              <span>Status Infrastruktur & Integrasi</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>PRODUCTION READY</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Backend Vercel API: Online (Secure Data Layer) • Enkripsi PBKDF2-HMAC-SHA256 Aktif
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span>10 Skema Sheets: OK</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
            <span>WA Fonnte: Aktif</span>
          </span>

          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all text-xs sm:text-sm min-h-[36px]"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Konfigurasi</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. MAKSIMAL 4 KPI UTAMA SISTEM */}
      <ExecutiveKpiCards
        metrics={metrics}
        kasMasukTotal={summaryKas.masuk}
      />

      {/* 4. ALAT ADMINISTRASI & PENGAWASAN SISTEM */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0B1428] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base sm:text-lg font-bold text-white">Alat Administrasi & Pengawasan Sistem</h2>
          <span className="text-xs sm:text-sm text-slate-400">Akses Terproteksi RBAC</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          
          <button
            onClick={() => onNavigateTab && onNavigateTab('sheets')}
            className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-left transition-all group min-h-[52px]"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2">
              <Database className="w-4 h-4" />
            </div>
            <div className="font-bold text-white group-hover:text-blue-300 text-xs sm:text-sm">Database Sheets</div>
            <div className="text-xs text-slate-400 mt-0.5">10 Skema Spreadsheet</div>
          </button>

          <button
            onClick={() => onNavigateTab && onNavigateTab('waBot')}
            className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-left transition-all group min-h-[52px]"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
              <Bot className="w-4 h-4" />
            </div>
            <div className="font-bold text-white group-hover:text-emerald-300 text-xs sm:text-sm">WA Gateway Bot</div>
            <div className="text-xs text-slate-400 mt-0.5">Simulator & Notifikasi</div>
          </button>

          <button
            onClick={() => onNavigateTab && onNavigateTab('code')}
            className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-left transition-all group min-h-[52px]"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2">
              <Code2 className="w-4 h-4" />
            </div>
            <div className="font-bold text-white group-hover:text-purple-300 text-xs sm:text-sm">Vercel API Exporter</div>
            <div className="text-xs text-slate-400 mt-0.5">Skema & Serverless Handler</div>
          </button>

          <button
            onClick={() => onNavigateTab && onNavigateTab('security')}
            className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-left transition-all group min-h-[52px]"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center mb-2">
              <Lock className="w-4 h-4" />
            </div>
            <div className="font-bold text-white group-hover:text-rose-300 text-xs sm:text-sm">Security Center</div>
            <div className="text-xs text-slate-400 mt-0.5">Audit Logs & RBAC</div>
          </button>

          <button
            onClick={onOpenSettings}
            className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-left transition-all group min-h-[52px]"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2">
              <Settings className="w-4 h-4" />
            </div>
            <div className="font-bold text-white group-hover:text-amber-300 text-xs sm:text-sm">Konfigurasi Produksi</div>
            <div className="text-xs text-slate-400 mt-0.5">Masked Secret & API Endpoint</div>
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
