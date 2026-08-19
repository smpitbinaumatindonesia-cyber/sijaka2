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
  Check
} from 'lucide-react';
import { MemberStatusType } from '../services/dashboardService';

interface DynamicHeroProps {
  memberStatus: MemberStatusType;
  onStatusChange: (newStatus: MemberStatusType) => void;
  onOpenLaporKematian: () => void;
  onOpenInputIuran: () => void;
  onOpenTambahAnggota: () => void;
  onRefresh: () => void;
  userRole: 'Admin' | 'Anggota';
}

export const DynamicHero: React.FC<DynamicHeroProps> = ({
  memberStatus,
  onStatusChange,
  onOpenLaporKematian,
  onOpenInputIuran,
  onOpenTambahAnggota,
  onRefresh,
  userRole
}) => {
  const isRenewal = memberStatus === 'renewal';
  const isExpired = memberStatus === 'expired';
  const isPending = memberStatus === 'pending';
  const isActive = memberStatus === 'active';

  return (
    <div 
      id="sijaka-executive-hero"
      className={`relative rounded-3xl p-5 sm:p-8 lg:p-9 border shadow-2xl overflow-hidden transition-all duration-500 ${
        isRenewal
          ? 'bg-gradient-to-br from-[#050A18] via-[#1A1207] to-[#0B1428] border-amber-500/40 text-white'
          : isExpired
          ? 'bg-gradient-to-br from-[#050A18] via-[#1F0A0E] to-[#0B1428] border-rose-500/40 text-white'
          : 'bg-gradient-to-br from-[#050A18] via-[#0B1733] to-[#050A18] border-slate-800 text-white'
      }`}
    >
      {/* Decorative ambient lighting */}
      <div className={`absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-35 transition-colors ${
        isRenewal ? 'bg-amber-500' : isExpired ? 'bg-rose-500' : 'bg-emerald-500'
      }`}></div>
      <div className={`absolute bottom-0 left-1/3 -mb-10 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-25 transition-colors ${
        isRenewal ? 'bg-yellow-500' : isExpired ? 'bg-red-500' : 'bg-blue-600'
      }`}></div>

      {/* Grid: Responsive 3-Part on Desktop, Clean 1-hand stack on Mobile */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-center">
        
        {/* LEFT COLUMN: Member identity & Quick Call-to-actions (5 of 12 cols on desktop) */}
        <div className="lg:col-span-5 space-y-3 sm:space-y-4">
          
          {/* Status badge & Simulation Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className={`text-xs font-bold px-3 py-1 rounded-xl border flex items-center gap-1.5 shadow-sm backdrop-blur-md transition-all ${
              isActive
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
                : isRenewal
                ? 'bg-amber-950/90 text-amber-300 border-amber-500/40 animate-pulse'
                : isExpired
                ? 'bg-rose-950/90 text-rose-300 border-rose-500/40'
                : 'bg-blue-950/90 text-blue-300 border-blue-500/40'
            }`}>
              {isActive ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>✓ ANGGOTA AKTIF</span>
                </>
              ) : isRenewal ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>⚠ PERLU PERPANJANGAN</span>
                </>
              ) : isExpired ? (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span>✕ NONAKTIF</span>
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  <span>◷ VERIFIKASI</span>
                </>
              )}
            </span>

            {/* Test Simulation Switcher for Review */}
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
                Perpanjangan
              </button>
            </div>
          </div>

          {/* Member Greeting & Name (Mobile Typography: 12-14px greeting, 26-32px name) */}
          <div className="space-y-0.5 sm:space-y-1">
            <span className="text-xs sm:text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Selamat datang kembali,
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-[38px] font-black text-white tracking-tight leading-tight flex items-center gap-2">
              Ahmad S. <span className="inline-block text-xl sm:text-3xl">👋</span>
            </h1>
          </div>

          {/* Dynamic Protection Description */}
          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {isActive ? (
              <p>
                Perlindungan Anda aktif. Iuran berjalan lancar tanpa tunggakan pada tahun 2026.
              </p>
            ) : isRenewal ? (
              <p className="text-amber-200 font-medium">
                Perlindungan Anda akan segera berakhir pada akhir bulan ini. Segera selesaikan iuran untuk menjaga hak santunan jamaah.
              </p>
            ) : (
              <p className="text-rose-200 font-medium">
                Perlindungan santunan Anda saat ini sedang nonaktif karena tunggakan iuran. Mohon selesaikan administrasi segera.
              </p>
            )}
          </div>

          {/* Mobile Micro Protection Highlight Box (Visible on mobile only for instant single-hand scanning) */}
          <div className="flex sm:hidden items-center justify-between p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold text-white text-[11px]">80% Tepat Waktu</div>
                <div className="text-[10px] text-slate-400">8 dari 12 Bulan Lunas</div>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
              Terlindungi
            </span>
          </div>

          {/* Primary Action Buttons (Min 48px touch target on Mobile) */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-1">
            {isActive ? (
              <>
                <button
                  onClick={onOpenInputIuran}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold px-4 py-3 sm:py-2.5 min-h-[48px] rounded-xl shadow-lg shadow-emerald-950/50 active:scale-[0.97] transition-all touch-manipulation"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Input Iuran</span>
                </button>
                <button
                  onClick={onOpenLaporKematian}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs sm:text-sm font-bold px-4 py-3 sm:py-2.5 min-h-[48px] rounded-xl shadow-lg shadow-rose-950/50 active:scale-[0.97] transition-all touch-manipulation"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Lapor Kematian</span>
                </button>
              </>
            ) : isRenewal ? (
              <button
                onClick={onOpenInputIuran}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs sm:text-sm font-bold px-5 py-3 sm:py-2.5 min-h-[48px] rounded-xl shadow-lg shadow-amber-950/50 active:scale-[0.97] transition-all touch-manipulation"
              >
                <CreditCard className="w-4 h-4" />
                <span>Bayar Sekarang</span>
              </button>
            ) : (
              <button
                onClick={onOpenInputIuran}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs sm:text-sm font-bold px-5 py-3 sm:py-2.5 min-h-[48px] rounded-xl shadow-lg shadow-rose-950/50 active:scale-[0.97] transition-all touch-manipulation"
              >
                <CreditCard className="w-4 h-4" />
                <span>Aktifkan Perlindungan</span>
              </button>
            )}

            <button
              onClick={onOpenTambahAnggota}
              className="flex items-center justify-center gap-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold px-3.5 py-3 sm:py-2.5 min-h-[48px] rounded-xl border border-slate-800 active:scale-[0.97] transition-all touch-manipulation"
            >
              <UserCheck className="w-4 h-4 text-blue-400" />
              <span>+ Anggota</span>
            </button>
          </div>
        </div>

        {/* CENTER COLUMN: Large Visual Shield Protection Asset with Emerald Glow & Circular Ring (3 of 12 cols on desktop - hidden on mobile) */}
        <div className="hidden lg:flex lg:col-span-3 flex-col items-center justify-center relative py-2">
          {/* Circular Protection Rings with Glow */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Outer pulsating ring */}
            <div className={`absolute inset-0 rounded-full border-2 ${
              isActive 
                ? 'border-emerald-400/30 animate-pulse' 
                : isRenewal 
                ? 'border-amber-400/30 animate-pulse' 
                : 'border-rose-400/30'
            }`}></div>

            {/* Inner secondary ring */}
            <div className="absolute inset-2.5 rounded-full border border-dashed border-blue-400/30"></div>

            {/* Shield Icon Container with Glass Aura */}
            <div className={`w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl relative transition-transform hover:scale-105 ${
              isActive
                ? 'bg-gradient-to-tr from-emerald-600/30 via-[#0B1428] to-teal-500/20 border-2 border-emerald-400/40 shadow-emerald-950/80'
                : isRenewal
                ? 'bg-gradient-to-tr from-amber-600/30 via-[#0B1428] to-yellow-500/20 border-2 border-amber-400/40 shadow-amber-950/80'
                : 'bg-gradient-to-tr from-rose-600/30 via-[#0B1428] to-red-500/20 border-2 border-rose-400/40 shadow-rose-950/80'
            }`}>
              {/* Electric blue and emerald icon */}
              {isActive ? (
                <ShieldCheck className="w-12 h-12 text-emerald-400 stroke-[2] drop-shadow-md" />
              ) : isRenewal ? (
                <ShieldAlert className="w-12 h-12 text-amber-400 stroke-[2] drop-shadow-md" />
              ) : (
                <ShieldAlert className="w-12 h-12 text-rose-400 stroke-[2] drop-shadow-md" />
              )}
            </div>

            {/* Floating verification badge */}
            <div className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-slate-900 border border-emerald-400/40 text-[10px] font-black text-emerald-300 shadow-md flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
              <span>TERVERIFIKASI</span>
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

        {/* RIGHT COLUMN: Executive Status & Compliance Progress Card (4 of 12 cols on desktop, hidden on mobile for clean vertical flow) */}
        <div className="hidden sm:block lg:col-span-4">
          <div className={`p-5 sm:p-6 rounded-2xl border backdrop-blur-xl relative shadow-2xl transition-all duration-300 ${
            isActive
              ? 'bg-[#0B1428]/95 border-emerald-500/30 ring-1 ring-emerald-500/20'
              : isRenewal
              ? 'bg-[#0B1428]/95 border-amber-500/30 ring-1 ring-amber-500/20'
              : 'bg-[#0B1428]/95 border-rose-500/30 ring-1 ring-rose-500/20'
          }`}>
            
            {/* Header: STATUS ANDA */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  STATUS ANDA
                </span>
                <span className={`text-base font-black flex items-center gap-1.5 ${
                  isActive ? 'text-emerald-400' : isRenewal ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  <span>{isActive ? '✓ AKTIF' : isRenewal ? '⚠ PERLU SETOR' : '✕ NONAKTIF'}</span>
                </span>
              </div>

              <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : isRenewal
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
              }`}>
                {isActive ? 'TERLINDUNGI' : isRenewal ? 'ACTION' : 'OFFLINE'}
              </span>
            </div>

            {/* Checklist of protection factors */}
            <div className="py-3 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Perlindungan aktif jaminan keluarga</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Iuran berjalan & tidak ada tunggakan</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Kewajiban administrasi terpenuhi</span>
              </div>
            </div>

            {/* Micro Progress Bar inside Status */}
            <div className="pt-3 border-t border-slate-800/80">
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                <span className="text-[11px] text-slate-400">Kepatuhan Iuran 2026</span>
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
