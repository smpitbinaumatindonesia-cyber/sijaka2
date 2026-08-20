import React from 'react';
import { 
  Users, 
  DollarSign, 
  Heart, 
  AlertTriangle, 
  UserPlus, 
  ShieldCheck, 
  ChevronRight
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
  anggotaList,
  iuranList,
  kematianList,
  summaryKas,
  activities,
  onOpenInputIuran,
  onOpenLaporKematian,
  onOpenTambahAnggota,
  onSelectSubTab
}) => {
  const pendingKematian = kematianList.filter(k => 
    (k.status || '').toLowerCase().includes('menunggu') || 
    (k.status || '').toLowerCase().includes('verifikasi')
  );

  const formatRupiah = (num: number) => {
    return `Rp ${num.toLocaleString('id-ID')}`;
  };

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto animate-in fade-in duration-300">
      
      {/* 1. HERO OPERASIONAL RINGKAS (Workspace Header) */}
      <div className="rounded-3xl p-6 sm:p-8 bg-[#0B1428] border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">Assalamu’alaikum warahmatullahi wabarakatuh</span>
            <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Ruang Kerja Pengurus: {officerName}</span>
            </h1>
            <p className="text-xs text-slate-400">
              Jamaah Tahlil Ar Rohman • RT 06 • RT 07 • RT 10 — Perum GPA Ngijo
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold self-start sm:self-center">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>PENGURUS OPERASIONAL</span>
          </div>
        </div>

        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
          Kelola pencatatan iuran kas, verifikasi penyaluran santunan kematian, dan pemutakhiran data warga jamaah secara amanah dan tertib.
        </p>
      </div>

      {/* 2. BUTUH TINDAKAN HARI INI (Fokus Visual Utama Operasional) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0B1428] border border-amber-500/40 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-white">Butuh Tindakan Hari Ini</h2>
              <p className="text-xs text-slate-400">Tugas operasional yang memerlukan aksi pengurus</p>
            </div>
          </div>

          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
            {pendingKematian.length > 0 ? `${pendingKematian.length} Perlu Verifikasi` : 'Antrean Bersih'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          
          {/* Action 1: Pengajuan Kematian */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between gap-3">
            <div className="space-y-1.5">
              <div className="font-bold text-white flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>Pengajuan Kematian</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                {pendingKematian.length > 0 
                  ? `${pendingKematian.length} berkas kematian memerlukan verifikasi klaim santunan.` 
                  : 'Tidak ada pengajuan santunan yang tertunda saat ini.'}
              </p>
            </div>
            <button
              onClick={() => onSelectSubTab('kematian')}
              className="w-full py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all min-h-[36px]"
            >
              Periksa Berkas Musibah
            </button>
          </div>

          {/* Action 2: Input Iuran */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between gap-3">
            <div className="space-y-1.5">
              <div className="font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Input Iuran Jamaah</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Catat kas masuk pembayaran iuran gotong royong dari koordinator RT 06, 07, 10.
              </p>
            </div>
            <button
              onClick={onOpenInputIuran}
              className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all min-h-[36px]"
            >
              Catat Iuran Masuk
            </button>
          </div>

          {/* Action 3: Tambah Anggota */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between gap-3">
            <div className="space-y-1.5">
              <div className="font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-400" />
                <span>Pendaftaran KK Baru</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Registrasi warga baru atau perubahan susunan anggota keluarga ke database.
              </p>
            </div>
            <button
              onClick={onOpenTambahAnggota}
              className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all min-h-[36px]"
            >
              Daftarkan Anggota Baru
            </button>
          </div>

        </div>
      </div>

      {/* 3. 4 KPI OPERASIONAL (Lebih Tipis, Compact & Angka Dominan) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0B1428] border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Kepala Keluarga</div>
          <div className="text-2xl sm:text-3xl font-black text-white">{anggotaList.length} KK</div>
          <div className="text-[11px] text-slate-400">RT 06, 07, & 10</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B1428] border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Iuran Masuk</div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            {formatRupiah(summaryKas.masuk)}
          </div>
          <div className="text-[11px] text-slate-400">Akumulasi Kas Masuk</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B1428] border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Santunan Keluar</div>
          <div className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">
            {formatRupiah(summaryKas.keluar)}
          </div>
          <div className="text-[11px] text-slate-400">{kematianList.length} Musibah Tersalurkan</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0B1428] border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Saldo Operasional</div>
          <div className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">
            {formatRupiah(summaryKas.saldo)}
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold">Kas Siap Salur</div>
        </div>
      </div>

      {/* 4. DAFTAR PEKERJAAN PRIORITAS & ANTREAN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Antrean Berkas Kematian */}
        <div className="lg:col-span-6">
          <div className="bg-[#0B1428] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                <h3 className="font-bold text-white text-sm">Laporan Musibah Terbaru</h3>
              </div>

              <button
                onClick={() => onSelectSubTab('kematian')}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {kematianList.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800/60">
                Tidak ada riwayat laporan kematian tercatat.
              </div>
            ) : (
              <div className="space-y-2">
                {kematianList.slice(0, 3).map((item, idx) => (
                  <div key={item.id_laporan || idx} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between text-xs">
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

        {/* Setoran Iuran Terbaru */}
        <div className="lg:col-span-6">
          <div className="bg-[#0B1428] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">Pencatatan Iuran Kas Terbaru</h3>
              </div>

              <button
                onClick={() => onSelectSubTab('iuran')}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {iuranList.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800/60">
                Belum ada transaksi iuran tercatat.
              </div>
            ) : (
              <div className="space-y-2">
                {iuranList.slice(0, 3).map((item, idx) => (
                  <div key={item.id_iuran || idx} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="font-bold text-white">{item.id_anggota} - {item.bulan_tahun}</div>
                      <div className="text-[11px] text-slate-400">{item.tanggal || 'Tercatat'}</div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-emerald-400 font-mono">
                        Rp {Number(item.nominal || 50000).toLocaleString('id-ID')}
                      </div>
                      <span className="text-[10px] text-slate-400">Kas Masuk</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 5. AKTIVITAS TERBARU */}
      <RecentActivitiesPanel activities={activities} />

    </div>
  );
};
