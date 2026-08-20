import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  Calendar, 
  Clock, 
  Info,
  CreditCard,
  UserCheck,
  Shield,
  Check,
  Users,
  FileText,
  TrendingUp,
  Activity
} from 'lucide-react';
import { MemberStatusType } from '../services/dashboardService';
import { SijakaRole } from '../types';

interface DynamicHeroProps {
  memberStatus: MemberStatusType;
  onStatusChange: (newStatus: MemberStatusType) => void;
  onOpenLaporKematian: () => void;
  onOpenInputIuran: () => void;
  onOpenTambahAnggota: () => void;
  onRefresh: () => void;
  onSelectSubTab?: (tab: 'kematian' | 'iuran' | 'anggota' | 'bukukas') => void;
  userRole?: SijakaRole;
}

export const DynamicHero: React.FC<DynamicHeroProps> = ({
  memberStatus,
  onStatusChange,
  onOpenLaporKematian,
  onOpenInputIuran,
  onOpenTambahAnggota,
  onRefresh,
  onSelectSubTab,
  userRole = 'Anggota'
}) => {
  const isRenewal = memberStatus === 'renewal';
  const isExpired = memberStatus === 'expired';
  const isPending = memberStatus === 'pending';
  const isActive = memberStatus === 'active';

  const isAnggota = userRole === 'Anggota';
  const isPengurus = userRole === 'Pengurus';
  const isKetua = userRole === 'Ketua';
  const isAdmin = userRole === 'Admin' || userRole === 'Super Admin';

  // Role Eyebrow
  const getEyebrow = () => {
    if (isAnggota) return 'Status Perlindungan Anda';
    if (isPengurus) return 'Ringkasan Operasional SIJAKA';
    if (isKetua) return 'Ringkasan Eksekutif SIJAKA';
    return 'Pusat Kendali Administrasi SIJAKA';
  };

  // Role Headline
  const getHeadline = () => {
    if (isAnggota) return 'Ahmad S.';
    if (isPengurus) return 'Budi Santoso (Pengurus)';
    if (isKetua) return 'H. Ahmad (Ketua Jamaah)';
    return 'Administrator Utama';
  };

  // Role Badge Color
  const getRoleBadge = () => {
    if (isAnggota) return { label: 'ANGGOTA AKTIF', color: 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40' };
    if (isPengurus) return { label: 'PENGURUS OPERASIONAL', color: 'bg-blue-950/90 text-blue-300 border-blue-500/40' };
    if (isKetua) return { label: 'KETUA JAMAAH', color: 'bg-purple-950/90 text-purple-300 border-purple-500/40' };
    if (userRole === 'Super Admin') return { label: 'SUPER ADMIN', color: 'bg-rose-950/90 text-rose-300 border-rose-500/40' };
    return { label: 'ADMINISTRATOR', color: 'bg-amber-950/90 text-amber-300 border-amber-500/40' };
  };

  return (
    <div 
      id="sijaka-executive-hero"
      className={`relative rounded-2xl p-5 sm:p-7 lg:p-8 border shadow-lg overflow-hidden transition-all duration-300 font-sans ${
        isRenewal && isAnggota
          ? 'bg-[#0B1428] border-amber-500/30 text-white'
          : isExpired && isAnggota
          ? 'bg-[#0B1428] border-rose-500/30 text-white'
          : 'bg-[#0B1428] border-slate-800/80 text-white'
      }`}
    >
      {/* Calm ambient lighting */}
      <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-15 transition-colors ${
        isRenewal && isAnggota ? 'bg-amber-500' : isExpired && isAnggota ? 'bg-rose-500' : isKetua ? 'bg-purple-600' : isPengurus ? 'bg-blue-600' : 'bg-emerald-600'
      }`}></div>

      {/* Grid: Responsive Layout */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-center">
        
        {/* LEFT COLUMN: Role Header & Contextual Actions */}
        <div className="lg:col-span-5 space-y-3 sm:space-y-4">
          
          {/* Status badge & Simulation Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className={`text-xs font-bold px-3 py-1 rounded-xl border flex items-center gap-1.5 shadow-sm backdrop-blur-md transition-all ${
              isAnggota
                ? isActive
                  ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
                  : isRenewal
                  ? 'bg-amber-950/90 text-amber-300 border-amber-500/40 animate-pulse'
                  : 'bg-rose-950/90 text-rose-300 border-rose-500/40'
                : getRoleBadge().color
            }`}>
              {isAnggota ? (
                isActive ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>✓ ANGGOTA AKTIF</span>
                  </>
                ) : isRenewal ? (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>⚠ PERLU PERPANJANGAN</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    <span>✕ NONAKTIF</span>
                  </>
                )
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  <span>{getRoleBadge().label}</span>
                </>
              )}
            </span>

            {/* Test Simulation Switcher for Member role */}
            {isAnggota && (
              <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-[10px]">
                <button
                  onClick={() => onStatusChange('active')}
                  className={`px-2 py-0.5 rounded-md font-bold transition-all min-h-[24px] ${
                    isActive ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Simulasi Status Aktif"
                >
                  Aktif
                </button>
                <button
                  onClick={() => onStatusChange('renewal')}
                  className={`px-2 py-0.5 rounded-md font-bold transition-all min-h-[24px] ${
                    isRenewal ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Simulasi Status Perlu Perpanjangan"
                >
                  Perpanjang
                </button>
              </div>
            )}
          </div>

          {/* Member / Role Greeting & Name */}
          <div className="space-y-0.5 sm:space-y-1">
            <span className="text-xs sm:text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              {getEyebrow()}
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-[36px] font-black text-white tracking-tight leading-tight flex items-center gap-2">
              {getHeadline()} <span className="inline-block text-xl sm:text-3xl">👋</span>
            </h1>
          </div>

          {/* Dynamic Protection / Operational Description */}
          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {isAnggota ? (
              isActive ? (
                <p>
                  Perlindungan Anda aktif. Terdaftar sejak Januari 2024 dengan santunan tunai Rp 2.500.000 dan bebas tunggakan tahun 2026.
                </p>
              ) : isRenewal ? (
                <p className="text-amber-200 font-medium">
                  Perlindungan Anda akan segera berakhir pada akhir bulan ini. Segera selesaikan iuran untuk menjaga hak santunan jamaah.
                </p>
              ) : (
                <p className="text-rose-200 font-medium">
                  Perlindungan santunan Anda saat ini sedang nonaktif karena tunggakan iuran. Mohon selesaikan administrasi segera.
                </p>
              )
            ) : isPengurus ? (
              <p>
                Ringkasan operasional harian: pantau 1.248 jiwa anggota jamaah, verifikasi pengajuan santunan duka, dan validasi setoran kas masuk.
              </p>
            ) : isKetua ? (
              <p>
                Ringkasan eksekutif tata kelola dana sosial kematian: transparansi kas masuk Rp 125,45jt, total santunan Rp 27,5jt, dan saldo kas sehat.
              </p>
            ) : (
              <p>
                Pusat kendali dan audit administrasi sistem: Google Sheets database sinkron, WhatsApp bot online, dan log keamanan terenkripsi.
              </p>
            )}
          </div>

          {/* Mobile Micro Protection Highlight Box */}
          <div className="flex sm:hidden items-center justify-between p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold text-white text-[11px]">
                  {isAnggota ? '80% Tepat Waktu' : '1.248 Jiwa Terdaftar'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {isAnggota ? '8 dari 12 Bulan Lunas' : '100% Perlindungan Jamaah'}
                </div>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
              Terlindungi
            </span>
          </div>

          {/* Primary Action Buttons (Clean Visual Hierarchy) */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-1">
            {isAnggota ? (
              isActive ? (
                <>
                  <button
                    onClick={onOpenInputIuran}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold px-4 py-2.5 min-h-[44px] rounded-xl shadow-sm active:scale-[0.97] transition-all touch-manipulation"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>Bayar Iuran</span>
                  </button>
                  <button
                    onClick={onOpenLaporKematian}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-rose-300 hover:text-white border border-rose-500/30 text-xs sm:text-sm font-semibold px-4 py-2.5 min-h-[44px] rounded-xl active:scale-[0.97] transition-all touch-manipulation"
                  >
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>Lapor Kematian</span>
                  </button>
                </>
              ) : isRenewal ? (
                <button
                  onClick={onOpenInputIuran}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white text-xs sm:text-sm font-bold px-5 py-2.5 min-h-[44px] rounded-xl shadow-sm active:scale-[0.97] transition-all touch-manipulation"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Bayar Sekarang</span>
                </button>
              ) : (
                <button
                  onClick={onOpenInputIuran}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold px-5 py-2.5 min-h-[44px] rounded-xl shadow-sm active:scale-[0.97] transition-all touch-manipulation"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Aktifkan Perlindungan</span>
                </button>
              )
            ) : isPengurus ? (
              <>
                <button
                  onClick={onOpenInputIuran}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold px-4 py-2.5 min-h-[44px] rounded-xl shadow-sm active:scale-[0.97] transition-all touch-manipulation"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Input Iuran Anggota</span>
                </button>
                <button
                  onClick={() => onSelectSubTab && onSelectSubTab('kematian')}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 min-h-[44px] rounded-xl border border-slate-800 active:scale-[0.97] transition-all touch-manipulation"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Pengajuan Aktif</span>
                </button>
              </>
            ) : isKetua ? (
              <>
                <button
                  onClick={() => onSelectSubTab && onSelectSubTab('bukukas')}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold px-4 py-2.5 min-h-[44px] rounded-xl shadow-sm active:scale-[0.97] transition-all touch-manipulation"
                >
                  <FileText className="w-4 h-4" />
                  <span>Lihat Laporan Kas</span>
                </button>
                <button
                  onClick={() => onSelectSubTab && onSelectSubTab('kematian')}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 min-h-[44px] rounded-xl border border-slate-800 active:scale-[0.97] transition-all touch-manipulation"
                >
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Ringkasan Pengajuan</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onOpenInputIuran}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold px-4 py-2.5 min-h-[44px] rounded-xl shadow-sm active:scale-[0.97] transition-all touch-manipulation"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Input Iuran</span>
                </button>
                <button
                  onClick={onOpenLaporKematian}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-rose-300 hover:text-white border border-rose-500/30 text-xs sm:text-sm font-semibold px-4 py-2.5 min-h-[44px] rounded-xl active:scale-[0.97] transition-all touch-manipulation"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Lapor Kematian</span>
                </button>
              </>
            )}

            <button
              onClick={onOpenTambahAnggota}
              className="flex items-center justify-center gap-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold px-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-800 active:scale-[0.97] transition-all touch-manipulation"
            >
              <UserCheck className="w-4 h-4 text-blue-400" />
              <span>+ Anggota</span>
            </button>
          </div>
        </div>

        {/* CENTER COLUMN: Visual Shield Protection Asset */}
        <div className="hidden lg:flex lg:col-span-3 flex-col items-center justify-center relative py-2">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Outer pulsating ring */}
            <div className={`absolute inset-0 rounded-full border-2 ${
              isAnggota
                ? isActive ? 'border-emerald-400/30 animate-pulse' : isRenewal ? 'border-amber-400/30 animate-pulse' : 'border-rose-400/30'
                : isKetua ? 'border-purple-400/30 animate-pulse' : isPengurus ? 'border-blue-400/30 animate-pulse' : 'border-emerald-400/30'
            }`}></div>

            {/* Inner secondary ring */}
            <div className="absolute inset-2.5 rounded-full border border-dashed border-blue-400/30"></div>

            {/* Shield Icon Container with Glass Aura */}
            <div className={`w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl relative transition-transform hover:scale-105 ${
              isAnggota
                ? isActive
                  ? 'bg-gradient-to-tr from-emerald-600/30 via-[#0B1428] to-teal-500/20 border-2 border-emerald-400/40 shadow-emerald-950/80'
                  : isRenewal
                  ? 'bg-gradient-to-tr from-amber-600/30 via-[#0B1428] to-yellow-500/20 border-2 border-amber-400/40 shadow-amber-950/80'
                  : 'bg-gradient-to-tr from-rose-600/30 via-[#0B1428] to-red-500/20 border-2 border-rose-400/40 shadow-rose-950/80'
                : isKetua
                ? 'bg-gradient-to-tr from-purple-600/30 via-[#0B1428] to-indigo-500/20 border-2 border-purple-400/40 shadow-purple-950/80'
                : isPengurus
                ? 'bg-gradient-to-tr from-blue-600/30 via-[#0B1428] to-indigo-500/20 border-2 border-blue-400/40 shadow-blue-950/80'
                : 'bg-gradient-to-tr from-amber-600/30 via-[#0B1428] to-emerald-500/20 border-2 border-amber-400/40 shadow-amber-950/80'
            }`}>
              {isAnggota ? (
                isActive ? (
                  <ShieldCheck className="w-12 h-12 text-emerald-400 stroke-[2] drop-shadow-md" />
                ) : isRenewal ? (
                  <ShieldAlert className="w-12 h-12 text-amber-400 stroke-[2] drop-shadow-md" />
                ) : (
                  <ShieldAlert className="w-12 h-12 text-rose-400 stroke-[2] drop-shadow-md" />
                )
              ) : isKetua ? (
                <TrendingUp className="w-12 h-12 text-purple-400 stroke-[2] drop-shadow-md" />
              ) : isPengurus ? (
                <Users className="w-12 h-12 text-blue-400 stroke-[2] drop-shadow-md" />
              ) : (
                <ShieldCheck className="w-12 h-12 text-amber-400 stroke-[2] drop-shadow-md" />
              )}
            </div>

            {/* Floating verification badge */}
            <div className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-slate-900 border border-emerald-400/40 text-[10px] font-black text-emerald-300 shadow-md flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
              <span>{isAnggota ? 'TERVERIFIKASI' : 'SISTEM ONLINE'}</span>
            </div>
          </div>

          <div className="text-center mt-3">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
              JAMINAN PERLINDUNGAN
            </span>
            <span className="text-[10px] text-slate-400">
              Jamaah Tahlil Ar-Rohman
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: Executive Status & Checklist Card */}
        <div className="hidden sm:block lg:col-span-4">
          <div className={`p-4 sm:p-5 rounded-xl border relative shadow-sm transition-all duration-300 ${
            isAnggota
              ? isActive
                ? 'bg-[#050A18]/90 border-emerald-500/25'
                : isRenewal
                ? 'bg-[#050A18]/90 border-amber-500/25'
                : 'bg-[#050A18]/90 border-rose-500/25'
              : isKetua
              ? 'bg-[#050A18]/90 border-purple-500/25'
              : isPengurus
              ? 'bg-[#050A18]/90 border-blue-500/25'
              : 'bg-[#050A18]/90 border-slate-700/60'
          }`}>
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  {isAnggota ? 'STATUS ANDA' : isPengurus ? 'STATUS OPERASIONAL' : isKetua ? 'STATUS ORGANISASI' : 'STATUS SISTEM'}
                </span>
                <span className={`text-sm font-bold flex items-center gap-1.5 ${
                  isAnggota
                    ? isActive ? 'text-emerald-400' : isRenewal ? 'text-amber-400' : 'text-rose-400'
                    : isKetua ? 'text-purple-400' : isPengurus ? 'text-blue-400' : 'text-amber-400'
                }`}>
                  <span>
                    {isAnggota
                      ? isActive ? '✓ AKTIF' : isRenewal ? '⚠ PERLU SETOR' : '✕ NONAKTIF'
                      : isKetua ? '✓ SALDO KAS AMAN' : isPengurus ? '✓ 1.248 ANGGOTA' : '✓ 100% SIAP'}
                  </span>
                </span>
              </div>

              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                isAnggota
                  ? isActive ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : isRenewal ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                  : isKetua ? 'bg-purple-500/15 text-purple-300 border-purple-500/30' : isPengurus ? 'bg-blue-500/15 text-blue-300 border-blue-500/30' : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
              }`}>
                {isAnggota ? (isActive ? 'TERLINDUNGI' : isRenewal ? 'ACTION' : 'OFFLINE') : isKetua ? 'EKSEKUTIF' : isPengurus ? 'OPERASIONAL' : 'ADMIN'}
              </span>
            </div>

            {/* Checklist */}
            <div className="py-3 space-y-1.5 text-xs text-slate-300">
              {isAnggota ? (
                <>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Perlindungan aktif jaminan keluarga</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Iuran berjalan lancar (8/12 bulan)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Kewajiban administrasi terpenuhi</span>
                  </div>
                </>
              ) : isPengurus ? (
                <>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>1.248 jiwa anggota jamaah aktif</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>7 pengajuan klaim menunggu verifikasi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Setoran iuran kas masuk tertib</span>
                  </div>
                </>
              ) : isKetua ? (
                <>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>Saldo kas utama: Rp 97.950.000</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Realisasi santunan 11 klaim tuntas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Kepatuhan iuran jamaah 80%</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Spreadsheet Google Sheets terhubung</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Gateway Fonnte WhatsApp API siap</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Audit log RBAC terlindungi</span>
                  </div>
                </>
              )}
            </div>

            {/* Micro Progress Bar */}
            <div className="pt-3 border-t border-slate-800/80">
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                <span className="text-[11px] text-slate-400">
                  {isAnggota ? 'Kepatuhan Iuran 2026' : 'Capaian Iuran Wilayah'}
                </span>
                <span className="text-emerald-400 font-bold font-mono text-xs">80% Tepat Waktu</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden flex">
                <div className="bg-emerald-500 h-full w-4/5 transition-all duration-500"></div>
                <div className="bg-slate-800 h-full w-1/5"></div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
