import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  DollarSign, 
  Users, 
  Heart, 
  UserPlus, 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  CreditCard,
  Edit2,
  PhoneCall,
  Sparkles,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { MemberStatusType, ActivityItem } from '../../services/dashboardService';
import { ProgressIuranPanel } from '../ProgressIuranPanel';
import { Anggota, KeluargaMember, IuranRecord, KematianRecord } from '../../types';

interface MemberDashboardProps {
  activeAnggota: Anggota;
  keluargaList: KeluargaMember[];
  iuranList: IuranRecord[];
  kematianList: KematianRecord[];
  memberStatus: MemberStatusType;
  onStatusChange: (status: MemberStatusType) => void;
  onOpenLaporKematian: () => void;
  onOpenInputIuran: () => void;
  onOpenTambahKeluarga: () => void;
  onOpenEditKeluarga: (member: KeluargaMember) => void;
  onOpenEditAnggota: (anggota: Anggota) => void;
  onSelectSubTab: (tab: 'kematian' | 'iuran' | 'anggota' | 'bukukas') => void;
  activities: ActivityItem[];
  allAnggota: Anggota[];
  onSelectAnggotaId: (id: string) => void;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({
  activeAnggota,
  keluargaList,
  iuranList,
  kematianList,
  memberStatus,
  onStatusChange,
  onOpenLaporKematian,
  onOpenInputIuran,
  onOpenTambahKeluarga,
  onOpenEditKeluarga,
  onOpenEditAnggota,
  onSelectSubTab,
  activities,
  allAnggota,
  onSelectAnggotaId
}) => {
  const memberName = activeAnggota?.nama || 'Ahmad S.';
  const memberId = activeAnggota?.id || 'ANG-001';
  const memberNik = activeAnggota?.nik || '3507041205800001';
  const memberPhone = activeAnggota?.no_hp || '081234567890';
  const memberAddress = activeAnggota?.alamat || 'Perum GPA Blok C-12, RT 06';

  // Member-specific filtered family and iuran records
  const myFamily = keluargaList.filter(k => k.id_anggota?.toUpperCase() === memberId.toUpperCase());
  const myIuran = iuranList.filter(i => i.id_anggota?.toUpperCase() === memberId.toUpperCase());
  const myKematian = kematianList.filter(k => k.id_anggota?.toUpperCase() === memberId.toUpperCase());

  // Count months paid in 2026
  const monthsPaid2026 = myIuran.filter(i => (i.bulan_tahun || '').includes('2026')).length;
  const totalMonthsTarget = 12;
  const progressPercent = Math.min(100, Math.round((monthsPaid2026 / totalMonthsTarget) * 100));

  // Determine semantic color and status label
  const isActive = memberStatus === 'active';
  const isRenewal = memberStatus === 'renewal';
  const isExpired = memberStatus === 'expired';

  const getStatusBadge = () => {
    if (isActive) {
      return {
        label: 'Aktif',
        color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
        dot: 'bg-emerald-400',
        icon: ShieldCheck
      };
    }
    if (isRenewal) {
      return {
        label: 'Perlu Perpanjangan',
        color: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
        dot: 'bg-amber-400',
        icon: AlertTriangle
      };
    }
    return {
      label: 'Nonaktif',
      color: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
      dot: 'bg-rose-400',
      icon: ShieldAlert
    };
  };

  const statusBadge = getStatusBadge();
  const StatusIcon = statusBadge.icon;

  return (
    <div className="space-y-6 sm:space-y-8 font-sans animate-in fade-in duration-300">
      
      {/* 1. PERSONAL WELCOME HERO */}
      <div className={`relative rounded-3xl p-6 sm:p-8 lg:p-9 border shadow-xl overflow-hidden transition-all duration-300 ${
        isRenewal 
          ? 'bg-[#0B1428] border-amber-500/40 text-white' 
          : isExpired 
          ? 'bg-[#0B1428] border-rose-500/40 text-white' 
          : 'bg-[#0B1428] border-slate-800/80 text-white'
      }`}>
        {/* Glow */}
        <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-15 ${
          isRenewal ? 'bg-amber-500' : isExpired ? 'bg-rose-500' : 'bg-emerald-500'
        }`}></div>

        <div className="relative z-10 space-y-5">
          
          {/* Top Row: Salam & Account Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div className="space-y-0.5">
              <span className="text-xs text-slate-400 font-medium">Assalamu’alaikum warahmatullahi wabarakatuh</span>
              <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                <span>Selamat Datang, Bapak/Ibu {memberName}</span>
                <span>👋</span>
              </h1>
            </div>

            {/* Quick Switcher for Simulation Testing */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">Pilih KK:</span>
              <select
                value={memberId}
                onChange={(e) => onSelectAnggotaId(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {allAnggota.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.id} - {a.nama}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subtitles */}
          <div className="space-y-1">
            <div className="text-sm sm:text-base font-bold text-blue-400 tracking-wide uppercase">
              DASHBOARD ANGGOTA SIJAKA
            </div>
            <div className="text-xs text-slate-400 font-medium">
              Sistem Informasi Jaminan Kematian • Jamaah Tahlil Ar Rohman • RT 06 • RT 07 • RT 10 — Perum GPA Ngijo
            </div>
          </div>

          {/* Narrative Body */}
          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl space-y-2">
            <p>
              Selamat datang di ruang layanan anggota SIJAKA. Pantau status keanggotaan, iuran, jaminan kematian, dan riwayat pelayanan Anda dengan mudah, aman, tertib, dan transparan.
            </p>
            <p className="text-slate-400 text-xs italic">
              SIJAKA hadir sebagai wujud kepedulian dan semangat ta’awun untuk saling membantu dan menguatkan sesama anggota serta keluarga.
            </p>
          </div>

          {/* Tagline */}
          <div className="pt-1 flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
              Semboyan Jamaah:
            </span>
            <span className="font-semibold text-slate-200">
              “Bersama dalam Kepedulian, Saling Menguatkan dalam Kebersamaan.”
            </span>
          </div>

        </div>
      </div>

      {/* 2. MEMBER STATUS AREA (Visual Priority: 1. Status Kepesertaan, 2. Progress Iuran, 3. Pembayaran Berikutnya) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Status Kepesertaan */}
        <div className="p-5 rounded-2xl bg-[#0B1428] border border-slate-800/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Status Kepesertaan</span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusBadge.color}`}>
              <span className={`w-2 h-2 rounded-full ${statusBadge.dot}`}></span>
              <span>{statusBadge.label}</span>
            </span>
          </div>

          <div>
            <div className="text-2xl font-black text-white flex items-center gap-2">
              <StatusIcon className={`w-6 h-6 ${
                isActive ? 'text-emerald-400' : isRenewal ? 'text-amber-400' : 'text-rose-400'
              }`} />
              <span>{isActive ? 'Terlindungi Penuh' : isRenewal ? 'Perlu Diselesaikan' : 'Tertunda'}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Hak santunan Rp 2.500.000 mencakup seluruh keluarga terdaftar dalam KK.
            </p>
          </div>

          {/* Simulator status buttons */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Simulasi Status:</span>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => onStatusChange('active')} 
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${isActive ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'}`}
              >
                Aktif
              </button>
              <button 
                onClick={() => onStatusChange('renewal')} 
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${isRenewal ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400'}`}
              >
                Perpanjang
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Progress Iuran */}
        <div className="p-5 rounded-2xl bg-[#0B1428] border border-slate-800/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Progress Iuran Tahun 2026</span>
            <span className="text-xs font-bold text-blue-400 font-mono">
              {monthsPaid2026} / {totalMonthsTarget} Bulan
            </span>
          </div>

          <div>
            <div className="text-2xl font-black text-white font-mono">
              {progressPercent}% <span className="text-xs font-normal text-slate-400">Tercatat</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden mt-2 border border-slate-800">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Iuran Rutin:</span>
            <span className="font-bold text-white font-mono">Rp 50.000 / Bulan</span>
          </div>
        </div>

        {/* Card 3: Pembayaran Berikutnya */}
        <div className="p-5 rounded-2xl bg-[#0B1428] border border-slate-800/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Iuran Berikutnya</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
              Rutin
            </span>
          </div>

          <div>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              Rp 100.000
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Estimasi iuran periode 2 bulan berikutnya.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <button
              onClick={onOpenInputIuran}
              className="w-full py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Bayar / Konfirmasi Iuran</span>
            </button>
          </div>
        </div>

      </div>

      {/* 3. KPI PRIBADI */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-[#0B1428] border border-slate-800/80">
          <div className="text-[11px] text-slate-400 font-semibold">Tanggungan Terdaftar</div>
          <div className="text-xl sm:text-2xl font-black text-white mt-1">
            {myFamily.length + 1} Jiwa
          </div>
          <div className="text-[10px] text-blue-400 mt-0.5">1 KK + {myFamily.length} Anggota</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B1428] border border-slate-800/80">
          <div className="text-[11px] text-slate-400 font-semibold">Total Iuran Tercatat</div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1 font-mono">
            {myIuran.length}x Setor
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Riwayat Pembayaran</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B1428] border border-slate-800/80">
          <div className="text-[11px] text-slate-400 font-semibold">Nilai Hak Santunan</div>
          <div className="text-xl sm:text-2xl font-black text-amber-400 mt-1">
            Rp 2,5 Juta
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Per Peristiwa Kematian</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0B1428] border border-slate-800/80">
          <div className="text-[11px] text-slate-400 font-semibold">Status Pengajuan</div>
          <div className="text-xl sm:text-2xl font-black text-purple-400 mt-1">
            {myKematian.length > 0 ? `${myKematian.length} Klaim` : 'Nihil'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Alhamdulillah Nihil</div>
        </div>
      </div>

      {/* 4. PROGRESS & RIWAYAT IURAN PRIBADI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div className="bg-[#0B1428] border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Riwayat Pembayaran Iuran Saya</h3>
                  <p className="text-[11px] text-slate-400">Catatan transaksi iuran KK {memberName}</p>
                </div>
              </div>

              <button
                onClick={() => onSelectSubTab('iuran')}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {myIuran.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800/60">
                Belum ada riwayat pembayaran yang tercatat untuk akun ini.
              </div>
            ) : (
              <div className="space-y-2">
                {myIuran.slice(0, 4).map((item, idx) => (
                  <div key={item.id_iuran || idx} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="font-bold text-white">{item.bulan_tahun || 'Iuran Bulanan'}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2">
                        <span>{item.tanggal || 'Terverifikasi'}</span>
                        <span>•</span>
                        <span>{item.keterangan || 'Iuran Rutin'}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-emerald-400 font-mono">
                        Rp {Number(item.nominal || 50000).toLocaleString('id-ID')}
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-300 font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Lunas</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 5. KELUARGA TERDAFTAR */}
        <div className="lg:col-span-5">
          <div className="bg-[#0B1428] border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Anggota Keluarga (KK)</h3>
                  <p className="text-[11px] text-slate-400">Tanggungan yang tercakup hak santunan</p>
                </div>
              </div>

              <button
                onClick={onOpenTambahKeluarga}
                className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 transition-all"
                title="Tambah Anggota Keluarga"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tambah</span>
              </button>
            </div>

            {/* KK Leader row */}
            <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/30 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span>{memberName}</span>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Kepala Keluarga
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">NIK: {memberNik}</div>
              </div>

              <button
                onClick={() => onOpenEditAnggota(activeAnggota)}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800"
                title="Edit Data Kepala Keluarga"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Family members list */}
            {myFamily.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800/60">
                Belum ada anggota keluarga tambahan. Klik "Tambah" untuk mendaftarkan istri / anak.
              </div>
            ) : (
              <div className="space-y-2">
                {myFamily.map((fam) => (
                  <div key={fam.id} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{fam.nama}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-semibold">
                          {fam.hubungan}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">NIK: {fam.nik || '-'}</div>
                    </div>

                    <button
                      onClick={() => onOpenEditKeluarga(fam)}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800"
                      title="Edit Anggota Keluarga"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 6. QUICK ACTIONS RELEVAN (Hanya aksi yang diizinkan untuk Anggota) */}
      <div className="p-5 rounded-2xl bg-[#0B1428] border border-slate-800/80 space-y-3">
        <h3 className="font-bold text-white text-sm">Layanan Cepat Anggota</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={onOpenLaporKematian}
            className="p-3.5 rounded-xl bg-rose-950/40 hover:bg-rose-950/60 border border-rose-500/30 text-left flex items-center gap-3 transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-rose-300">Lapor Kematian / Musibah</div>
              <div className="text-[11px] text-slate-400">Klaim santunan Rp 2,5jt & pemulasaraan</div>
            </div>
          </button>

          <button
            onClick={onOpenInputIuran}
            className="p-3.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/60 border border-emerald-500/30 text-left flex items-center gap-3 transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-emerald-300">Pembayaran Iuran Kas</div>
              <div className="text-[11px] text-slate-400">Konfirmasi pembayaran kas rutin</div>
            </div>
          </button>

          <button
            onClick={onOpenTambahKeluarga}
            className="p-3.5 rounded-xl bg-blue-950/40 hover:bg-blue-950/60 border border-blue-500/30 text-left flex items-center gap-3 transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-blue-300">Tambah Anggota Keluarga</div>
              <div className="text-[11px] text-slate-400">Daftarkan tanggungan dalam KK</div>
            </div>
          </button>
        </div>
      </div>

    </div>
  );
};
