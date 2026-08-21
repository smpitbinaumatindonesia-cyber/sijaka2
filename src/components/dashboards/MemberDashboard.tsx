import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  DollarSign, 
  Users, 
  UserPlus, 
  CheckCircle2, 
  CreditCard,
  Edit2,
  ChevronRight
} from 'lucide-react';
import { MemberStatusType, ActivityItem } from '../../services/dashboardService';
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
  memberStatus,
  onStatusChange,
  onOpenLaporKematian,
  onOpenInputIuran,
  onOpenTambahKeluarga,
  onOpenEditKeluarga,
  onOpenEditAnggota,
  onSelectSubTab,
  allAnggota,
  onSelectAnggotaId
}) => {
  const memberName = activeAnggota?.nama || 'Ahmad S.';
  const memberId = activeAnggota?.id || 'ANG-001';
  const memberNik = activeAnggota?.nik || '3507041205800001';

  // Member-specific filtered family and iuran records
  const myFamily = keluargaList.filter(k => k.id_anggota?.toUpperCase() === memberId.toUpperCase());
  const myIuran = iuranList.filter(i => i.id_anggota?.toUpperCase() === memberId.toUpperCase());

  // Count months paid in 2026
  const monthsPaid2026 = myIuran.filter(i => (i.bulan_tahun || '').includes('2026')).length;
  const totalMonthsTarget = 12;
  const progressPercent = Math.min(100, Math.round((monthsPaid2026 / totalMonthsTarget) * 100));

  const isActive = memberStatus === 'active';
  const isRenewal = memberStatus === 'renewal';

  const getStatusBadge = () => {
    if (isActive) {
      return {
        label: 'Terlindungi Aktif',
        subtext: 'Hak santunan Rp 2,5jt untuk 1 KK berlaku penuh',
        color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
        dot: 'bg-emerald-400',
        icon: ShieldCheck
      };
    }
    if (isRenewal) {
      return {
        label: 'Perlu Perpanjangan',
        subtext: 'Ada iuran kas tertunda untuk periode berjalan',
        color: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
        dot: 'bg-amber-400',
        icon: AlertTriangle
      };
    }
    return {
      label: 'Status Tertunda',
      subtext: 'Silakan konfirmasi iuran kas kepada pengurus',
      color: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
      dot: 'bg-rose-400',
      icon: ShieldAlert
    };
  };

  const statusBadge = getStatusBadge();
  const StatusIcon = statusBadge.icon;

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto animate-in fade-in duration-300">
      
      {/* 1. WELCOME HERO RINGKAS (Konteks Cepat & Jelas dalam 3 Detik) */}
      <div className="rounded-3xl p-6 sm:p-8 bg-[#0B1428] border border-slate-800 shadow-xl space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-start border-b border-slate-800 pb-4">
          <div className="space-y-1.5 min-w-0">
            <span className="text-sm sm:text-base text-slate-400 font-medium block">
              Assalamu’alaikum warahmatullahi wabarakatuh
            </span>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-tight">
              Selamat Datang, Bapak/Ibu {memberName}
            </h1>
            <div className="text-base sm:text-lg font-semibold text-blue-400">
              Dashboard Anggota SIJAKA
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Jamaah Tahlil Ar Rohman • RT 06 • RT 07 • RT 10 — Perum GPA Ngijo
            </p>
          </div>

          {/* Quick Member Switcher */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 rounded-xl p-2 shrink-0">
            <span className="text-xs sm:text-sm text-slate-400 font-medium whitespace-nowrap">Pilih KK:</span>
            <select
              value={memberId}
              onChange={(e) => onSelectAnggotaId(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {allAnggota.map(a => (
                <option key={a.id} value={a.id}>
                  {a.id} - {a.nama}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
          Pantau status perlindungan keluarga, catatan iuran gotong royong, dan akses layanan santunan jaminan kematian dengan aman dan transparan.
        </p>
      </div>

      {/* 2. MAKSIMAL 3 KPI UTAMA ANGGOTA (Prioritas Visual Tinggi) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* KPI 1: Status Kepesertaan */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0B1428] border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-slate-400">Status Kepesertaan</span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusBadge.color}`}>
              <span className={`w-2 h-2 rounded-full ${statusBadge.dot}`}></span>
              <span>{statusBadge.label}</span>
            </span>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
              <StatusIcon className={`w-6 h-6 shrink-0 ${
                isActive ? 'text-emerald-400' : isRenewal ? 'text-amber-400' : 'text-rose-400'
              }`} />
              <span>{isActive ? 'Terlindungi Penuh' : isRenewal ? 'Perlu Diperbarui' : 'Tertunda'}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {statusBadge.subtext}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Simulasi Status:</span>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => onStatusChange('active')} 
                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${isActive ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
              >
                Aktif
              </button>
              <button 
                onClick={() => onStatusChange('renewal')} 
                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${isRenewal ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
              >
                Perpanjang
              </button>
            </div>
          </div>
        </div>

        {/* KPI 2: Progress Iuran 2026 */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0B1428] border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-slate-400">Progress Iuran 2026</span>
            <span className="text-xs sm:text-sm font-bold text-blue-400 font-mono">
              {monthsPaid2026} / {totalMonthsTarget} Bulan
            </span>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono">
              {progressPercent}% <span className="text-xs sm:text-sm font-normal text-slate-400">Lunas</span>
            </div>
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden mt-2 border border-slate-800">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs sm:text-sm text-slate-400">
            <span>Iuran Rutin:</span>
            <span className="font-bold text-white font-mono">Rp 50.000 / Bulan</span>
          </div>
        </div>

        {/* KPI 3: Pembayaran Berikutnya & Tanggungan */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0B1428] border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-slate-400">Tanggungan Terdaftar</span>
            <span className="text-xs sm:text-sm font-bold text-purple-300 font-mono">
              {myFamily.length + 1} Jiwa
            </span>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">
              1 KK + {myFamily.length} Anggota
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Hak santunan Rp 2.500.000 berlaku per anggota KK
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={onOpenInputIuran}
              className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all min-h-[40px]"
            >
              <CreditCard className="w-4 h-4" />
              <span>Konfirmasi Pembayaran Iuran</span>
            </button>
          </div>
        </div>

      </div>

      {/* 3. LAYANAN CEPAT ANGGOTA (Aksi Prioritas) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0B1428] border border-slate-800 space-y-3">
        <h3 className="text-base sm:text-lg font-bold text-white">Layanan Mandiri Anggota</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={onOpenLaporKematian}
            className="p-4 rounded-xl bg-rose-950/40 hover:bg-rose-950/60 border border-rose-500/30 text-left flex items-center gap-3 transition-all group min-h-[48px]"
          >
            <div className="w-9 h-9 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white group-hover:text-rose-300">Lapor Kematian / Musibah</div>
              <div className="text-xs text-slate-400">Pengajuan santunan & pemulasaraan</div>
            </div>
          </button>

          <button
            onClick={onOpenInputIuran}
            className="p-4 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/60 border border-emerald-500/30 text-left flex items-center gap-3 transition-all group min-h-[48px]"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300">Pembayaran Iuran Kas</div>
              <div className="text-xs text-slate-400">Konfirmasi setoran iuran rutin</div>
            </div>
          </button>

          <button
            onClick={onOpenTambahKeluarga}
            className="p-4 rounded-xl bg-blue-950/40 hover:bg-blue-950/60 border border-blue-500/30 text-left flex items-center gap-3 transition-all group min-h-[48px]"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-300">Tambah Anggota Keluarga</div>
              <div className="text-xs text-slate-400">Daftarkan tanggungan dalam KK</div>
            </div>
          </button>
        </div>
      </div>

      {/* 4. DETAIL RINGKAS: RIWAYAT IURAN & KELUARGA TERDAFTAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Riwayat Pembayaran */}
        <div className="lg:col-span-7">
          <div className="bg-[#0B1428] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base sm:text-lg font-bold text-white">Riwayat Pembayaran Iuran Saya</h3>
              </div>

              <button
                onClick={() => onSelectSubTab('iuran')}
                className="text-xs sm:text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {myIuran.length === 0 ? (
              <div className="py-6 text-center text-xs sm:text-sm text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800/60">
                Belum ada riwayat pembayaran yang tercatat untuk akun ini.
              </div>
            ) : (
              <div className="space-y-2">
                {myIuran.slice(0, 4).map((item, idx) => (
                  <div key={item.id_iuran || idx} className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between text-xs sm:text-sm">
                    <div className="space-y-0.5">
                      <div className="font-bold text-white">{item.bulan_tahun || 'Iuran Bulanan'}</div>
                      <div className="text-xs text-slate-400">
                        {item.tanggal || 'Terverifikasi'} • {item.keterangan || 'Iuran Rutin'}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-emerald-400 font-mono text-sm sm:text-base">
                        Rp {Number(item.nominal || 50000).toLocaleString('id-ID')}
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-300 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Lunas</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Susunan Keluarga KK */}
        <div className="lg:col-span-5">
          <div className="bg-[#0B1428] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                <h3 className="text-base sm:text-lg font-bold text-white">Anggota Keluarga (KK)</h3>
              </div>

              <button
                onClick={onOpenTambahKeluarga}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold flex items-center gap-1 transition-all"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </button>
            </div>

            {/* KK Leader row */}
            <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/30 flex items-center justify-between text-xs sm:text-sm">
              <div className="space-y-0.5">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span>{memberName}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Kepala Keluarga
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono">NIK: {memberNik}</div>
              </div>

              <button
                onClick={() => onOpenEditAnggota(activeAnggota)}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800"
                title="Edit Data Kepala Keluarga"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            {/* Family members list */}
            {myFamily.length === 0 ? (
              <div className="py-4 text-center text-xs sm:text-sm text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800/60">
                Belum ada anggota keluarga tambahan terdaftar.
              </div>
            ) : (
              <div className="space-y-2 max-h-[180px] overflow-y-auto">
                {myFamily.map((fam) => (
                  <div key={fam.id} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between text-xs sm:text-sm">
                    <div className="space-y-0.5">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{fam.nama}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                          {fam.hubungan}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 font-mono">NIK: {fam.nik || '-'}</div>
                    </div>

                    <button
                      onClick={() => onOpenEditKeluarga(fam)}
                      className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800"
                      title="Edit Anggota Keluarga"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
