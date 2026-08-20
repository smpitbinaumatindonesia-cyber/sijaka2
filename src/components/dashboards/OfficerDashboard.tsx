import React from 'react';
import { 
  Users, 
  DollarSign, 
  Heart, 
  FileText, 
  CreditCard, 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  UserPlus, 
  Plus, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  Activity
} from 'lucide-react';
import { DashboardMetricData, ActivityItem } from '../../services/dashboardService';
import { Anggota, IuranRecord, KematianRecord, BukuKasRecord } from '../../types';
import { RecentActivitiesPanel } from '../RecentActivitiesPanel';

interface OfficerDashboardProps {
  officerName?: string;
  metrics: DashboardMetricData;
  anggotaList: Anggota[];
  iuranList: IuranRecord[];
  kematianList: KematianRecord[];
  bukuKasList: BukuKasRecord[];
  summaryKas: { masuk: number; keluar: number; saldo: number };
  activities: ActivityItem[];
  onOpenInputIuran: () => void;
  onOpenLaporKematian: () => void;
  onOpenTambahAnggota: () => void;
  onSelectSubTab: (tab: 'kematian' | 'iuran' | 'anggota' | 'bukukas') => void;
}

export const OfficerDashboard: React.FC<OfficerDashboardProps> = ({
  officerName = 'Budi Santoso',
  metrics,
  anggotaList,
  iuranList,
  kematianList,
  bukuKasList,
  summaryKas,
  activities,
  onOpenInputIuran,
  onOpenLaporKematian,
  onOpenTambahAnggota,
  onSelectSubTab
}) => {
  // Pending actions calculations
  const pendingKematian = kematianList.filter(k => (k.status || '').toLowerCase().includes('menunggu') || (k.status || '').toLowerCase().includes('verifikasi'));
  const recentUnprocessedIuran = iuranList.slice(0, 3);

  const formatRupiah = (num: number) => {
    return `Rp ${num.toLocaleString('id-ID')}`;
  };

  return (
    <div className="space-y-6 sm:space-y-8 font-sans animate-in fade-in duration-300">
      
      {/* 1. OPERATIONAL WELCOME HERO */}
      <div className="relative rounded-3xl p-6 sm:p-8 lg:p-9 bg-[#0B1428] border border-blue-500/30 shadow-xl overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-5">
          
          {/* Header & Salam */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div className="space-y-0.5">
              <span className="text-xs text-slate-400 font-medium">Assalamu’alaikum warahmatullahi wabarakatuh</span>
              <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                <span>Selamat Datang, Bapak/Ibu {officerName}</span>
                <span>👋</span>
              </h1>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>PENGURUS OPERASIONAL</span>
            </div>
          </div>

          {/* Subtitles */}
          <div className="space-y-1">
            <div className="text-sm sm:text-base font-bold text-blue-400 tracking-wide uppercase">
              PUSAT KENDALI PENGURUS SIJAKA
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Sistem Informasi Jaminan Kematian • Jamaah Tahlil Ar Rohman • RT 06 • RT 07 • RT 10 — Perum GPA Ngijo
            </div>
          </div>

          {/* Narrative */}
          <p className="text-xs sm:text-sm text-slate-300 max-w-4xl leading-relaxed">
            Kelola pelayanan anggota dengan amanah, tertib, transparan, dan bertanggung jawab.
          </p>

          {/* Service Area Quick Indicators */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-2 text-xs">
            <button 
              onClick={() => onSelectSubTab('anggota')}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex flex-col items-center gap-1 transition-all"
            >
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-[10px] font-semibold text-slate-300">Anggota</span>
            </button>

            <button 
              onClick={() => onSelectSubTab('iuran')}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex flex-col items-center gap-1 transition-all"
            >
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-semibold text-slate-300">Iuran</span>
            </button>

            <button 
              onClick={() => onSelectSubTab('kematian')}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex flex-col items-center gap-1 transition-all"
            >
              <Heart className="w-4 h-4 text-rose-400" />
              <span className="text-[10px] font-semibold text-slate-300">Santunan</span>
            </button>

            <button 
              onClick={() => onSelectSubTab('kematian')}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex flex-col items-center gap-1 transition-all"
            >
              <FileText className="w-4 h-4 text-purple-400" />
              <span className="text-[10px] font-semibold text-slate-300">Pelayanan</span>
            </button>

            <button 
              onClick={() => onSelectSubTab('bukukas')}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex flex-col items-center gap-1 transition-all"
            >
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] font-semibold text-slate-300">Kas</span>
            </button>

            <button 
              onClick={() => onSelectSubTab('bukukas')}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex flex-col items-center gap-1 transition-all"
            >
              <TrendingUp className="w-4 h-4 text-teal-400" />
              <span className="text-[10px] font-semibold text-slate-300">Laporan</span>
            </button>

            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center gap-1">
              <Bell className="w-4 h-4 text-blue-400" />
              <span className="text-[10px] font-semibold text-slate-300">Notifikasi</span>
            </div>

            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center gap-1">
              <Activity className="w-4 h-4 text-indigo-400" />
              <span className="text-[10px] font-semibold text-slate-300">Sistem</span>
            </div>
          </div>

          {/* Tagline */}
          <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            <span className="font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
              Semboyan Pengurus:
            </span>
            <span className="font-semibold text-slate-200">
              “Mengelola dengan Amanah, Melayani dengan Kepedulian, Menguatkan dalam Kebersamaan.”
            </span>
          </div>

        </div>
      </div>

      {/* 2. BUTUH TINDAKAN HARI INI (OFFICER PRIORITY) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0B1428] border border-amber-500/40 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Butuh Tindakan Hari Ini</h2>
              <p className="text-[11px] text-slate-400">Daftar item operasional yang memerlukan perhatian segera</p>
            </div>
          </div>

          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
            {pendingKematian.length > 0 ? `${pendingKematian.length} Menunggu` : 'Semua Bersih'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          
          {/* Action item 1 */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start justify-between gap-2">
            <div className="space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>Pengajuan Kematian</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                {pendingKematian.length > 0 
                  ? `${pendingKematian.length} berkas kematian memerlukan verifikasi klaim.` 
                  : 'Tidak ada pengajuan kematian yang tertunda.'}
              </p>
            </div>
            <button
              onClick={() => onSelectSubTab('kematian')}
              className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] shrink-0"
            >
              Periksa
            </button>
          </div>

          {/* Action item 2 */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start justify-between gap-2">
            <div className="space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Input Iuran Jamaah</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Pencatatan kas masuk iuran bulanan dari koordinator RT 06, 07, 10.
              </p>
            </div>
            <button
              onClick={onOpenInputIuran}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] shrink-0"
            >
              Catat
            </button>
          </div>

          {/* Action item 3 */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start justify-between gap-2">
            <div className="space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <UserPlus className="w-3.5 h-3.5 text-blue-400" />
                <span>Pendaftaran Anggota Baru</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Registrasi warga baru pindahan atau KK baru ke database jamaah.
              </p>
            </div>
            <button
              onClick={onOpenTambahAnggota}
              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] shrink-0"
            >
              Daftar
            </button>
          </div>

        </div>
      </div>

      {/* 3. KPI OPERASIONAL */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-[#0B1428] border border-slate-800/80">
          <div className="text-[11px] text-slate-400 font-semibold">Total Kepala Keluarga</div>
          <div className="text-xl sm:text-2xl font-black text-white mt-1">{anggotaList.length} KK</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Semua RT 06, 07, 10</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B1428] border border-slate-800/80">
          <div className="text-[11px] text-slate-400 font-semibold">Iuran Masuk (Buku Kas)</div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1 font-mono">
            {formatRupiah(summaryKas.masuk)}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Total Akumulasi Masuk</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B1428] border border-slate-800/80">
          <div className="text-[11px] text-slate-400 font-semibold">Santunan Tersalurkan</div>
          <div className="text-xl sm:text-2xl font-black text-rose-400 mt-1 font-mono">
            {formatRupiah(summaryKas.keluar)}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">{kematianList.length} Kejadian Tercatat</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B1428] border border-slate-800/80">
          <div className="text-[11px] text-slate-400 font-semibold">Saldo Kas Operasional</div>
          <div className="text-xl sm:text-2xl font-black text-blue-400 mt-1 font-mono">
            {formatRupiah(summaryKas.saldo)}
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Kas Siap Pakai</div>
        </div>
      </div>

      {/* 4 & 5. PENGAJUAN & IURAN PERLU DIPROSES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Pengajuan Kematian & Pelayanan */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#0B1428] border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Status Santunan & Pelayanan</h3>
                  <p className="text-[11px] text-slate-400">Data kematian dan santunan duka terbaru</p>
                </div>
              </div>

              <button
                onClick={() => onSelectSubTab('kematian')}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <span>Kelola</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {kematianList.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800/60">
                Tidak ada pengajuan santunan kematian saat ini.
              </div>
            ) : (
              <div className="space-y-2">
                {kematianList.slice(0, 3).map((item, idx) => (
                  <div key={item.id_laporan || idx} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="font-bold text-white">{item.id_anggota} - {item.tempat || 'Laporan Kematian'}</div>
                      <div className="text-[11px] text-slate-400">
                        {item.waktu_kematian} • {item.tanggal_lapor}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        {item.status || 'Tersalurkan'}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-mono">Rp 2.500.000</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Transaksi Iuran Terkini */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#0B1428] border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Iuran Masuk Terakhir</h3>
                  <p className="text-[11px] text-slate-400">Catatan pembayaran kas anggota</p>
                </div>
              </div>

              <button
                onClick={() => onSelectSubTab('iuran')}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <span>Buka Iuran</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {iuranList.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800/60">
                Belum ada transaksi iuran yang tercatat.
              </div>
            ) : (
              <div className="space-y-2">
                {iuranList.slice(0, 3).map((item, idx) => (
                  <div key={item.id_iuran || idx} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="font-bold text-white">{item.id_anggota} - {item.bulan_tahun}</div>
                      <div className="text-[11px] text-slate-400">{item.tanggal || 'Tercatat'}</div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-emerald-400 font-mono">
                        Rp {Number(item.nominal || 50000).toLocaleString('id-ID')}
                      </div>
                      <span className="text-[10px] text-slate-400">{item.keterangan || 'Rutin'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 6. RINGKASAN KAS OPERASIONAL & AKTIVITAS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-12">
          <RecentActivitiesPanel activities={activities} />
        </div>
      </div>

      {/* 7. QUICK ACTIONS SESUAI PERMISSION EXISTING */}
      <div className="p-5 rounded-2xl bg-[#0B1428] border border-slate-800/80 space-y-3">
        <h3 className="font-bold text-white text-sm">Aksi Operasional Cepat</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={onOpenInputIuran}
            className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
              <DollarSign className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white group-hover:text-emerald-300">Input Iuran Kas</div>
            <div className="text-[10px] text-slate-400">Pencatatan kas masuk</div>
          </button>

          <button
            onClick={onOpenLaporKematian}
            className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center mb-2">
              <Heart className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white group-hover:text-rose-300">Lapor Kematian</div>
            <div className="text-[10px] text-slate-400">Klaim santunan & layanan</div>
          </button>

          <button
            onClick={onOpenTambahAnggota}
            className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2">
              <UserPlus className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white group-hover:text-blue-300">Daftar Anggota</div>
            <div className="text-[10px] text-slate-400">Registrasi KK baru</div>
          </button>

          <button
            onClick={() => onSelectSubTab('bukukas')}
            className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-left transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2">
              <FileText className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white group-hover:text-purple-300">Buku Kas & Laporan</div>
            <div className="text-[10px] text-slate-400">Rekapitulasi keuangan</div>
          </button>
        </div>
      </div>

    </div>
  );
};
