import React from 'react';
import { 
  AlertTriangle, 
  DollarSign, 
  UserPlus, 
  FileText, 
  Heart, 
  Bot, 
  User
} from 'lucide-react';
import { SijakaRole } from '../types';

interface QuickActionsPanelProps {
  onOpenLaporKematian: () => void;
  onOpenInputIuran: () => void;
  onOpenTambahAnggota: () => void;
  onSelectSubTab: (tab: 'kematian' | 'iuran' | 'anggota' | 'bukukas' | 'users' | 'layanan') => void;
  onOpenWaBotSimulator?: () => void;
  onOpenProfile?: () => void;
  userRole: SijakaRole;
}

export const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({
  onOpenLaporKematian,
  onOpenInputIuran,
  onOpenTambahAnggota,
  onSelectSubTab,
  onOpenWaBotSimulator,
  onOpenProfile,
  userRole
}) => {
  const isAdmin = userRole === 'Admin' || userRole === 'Super Admin';

  return (
    <div className="space-y-2.5 sm:space-y-3 font-sans">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          AKSI CEPAT SIJAKA
        </h3>
        <span className="text-[11px] text-slate-500 font-normal hidden sm:inline">
          Layanan Operasional Harian
        </span>
      </div>

      {/* Grid: 2 columns on Mobile (<sm:), 3 columns on tablet (sm:), 6 columns on Desktop (lg:) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        
        {/* 1. Lapor Kematian (RED) */}
        <button
          onClick={onOpenLaporKematian}
          className="flex flex-col items-start p-3 sm:p-3.5 min-h-[76px] sm:min-h-[82px] bg-[#0B1428] hover:bg-[#0E1B38] border border-slate-800/80 hover:border-slate-700 rounded-xl transition-all duration-150 group shadow-sm text-left relative overflow-hidden active:scale-[0.98] touch-manipulation focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20 mb-2 shrink-0">
            <AlertTriangle className="w-4 h-4 stroke-[2]" />
          </div>
          <span className="text-xs font-semibold text-white group-hover:text-rose-300 transition-colors block truncate w-full">
            Lapor Kematian
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 leading-tight block truncate w-full">
            Pengajuan Santunan
          </span>
        </button>

        {/* 2. Input Iuran (GREEN) */}
        <button
          onClick={onOpenInputIuran}
          className="flex flex-col items-start p-3 sm:p-3.5 min-h-[76px] sm:min-h-[82px] bg-[#0B1428] hover:bg-[#0E1B38] border border-slate-800/80 hover:border-slate-700 rounded-xl transition-all duration-150 group shadow-sm text-left relative overflow-hidden active:scale-[0.98] touch-manipulation focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 mb-2 shrink-0">
            <DollarSign className="w-4 h-4 stroke-[2]" />
          </div>
          <div className="flex items-center gap-1 w-full">
            <span className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors truncate">
              {userRole === 'Anggota' ? 'Bayar Iuran' : 'Input Iuran'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 leading-tight block truncate w-full">
            Kas Masuk Anggota
          </span>
        </button>

        {/* 3. + Anggota (BLUE) */}
        <button
          onClick={onOpenTambahAnggota}
          className="flex flex-col items-start p-3 sm:p-3.5 min-h-[76px] sm:min-h-[82px] bg-[#0B1428] hover:bg-[#0E1B38] border border-slate-800/80 hover:border-slate-700 rounded-xl transition-all duration-150 group shadow-sm text-left relative overflow-hidden active:scale-[0.98] touch-manipulation focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 mb-2 shrink-0">
            <UserPlus className="w-4 h-4 stroke-[2]" />
          </div>
          <span className="text-xs font-semibold text-white group-hover:text-blue-300 transition-colors block truncate w-full">
            + Anggota
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 leading-tight block truncate w-full">
            Daftar KK Baru
          </span>
        </button>

        {/* 4. Laporan / Buku Kas (PURPLE) */}
        <button
          onClick={() => onSelectSubTab('bukukas')}
          className="flex flex-col items-start p-3 sm:p-3.5 min-h-[76px] sm:min-h-[82px] bg-[#0B1428] hover:bg-[#0E1B38] border border-slate-800/80 hover:border-slate-700 rounded-xl transition-all duration-150 group shadow-sm text-left relative overflow-hidden active:scale-[0.98] touch-manipulation focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 mb-2 shrink-0">
            <FileText className="w-4 h-4 stroke-[2]" />
          </div>
          <div className="flex items-center gap-1 w-full">
            <span className="text-xs font-semibold text-white group-hover:text-purple-300 transition-colors truncate">
              Laporan
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 leading-tight block truncate w-full">
            Buku Kas & Rekap
          </span>
        </button>

        {/* 5. Pengajuan Santunan (AMBER) */}
        <button
          onClick={() => onSelectSubTab('kematian')}
          className="flex flex-col items-start p-3 sm:p-3.5 min-h-[76px] sm:min-h-[82px] bg-[#0B1428] hover:bg-[#0E1B38] border border-slate-800/80 hover:border-slate-700 rounded-xl transition-all duration-150 group shadow-sm text-left relative overflow-hidden active:scale-[0.98] touch-manipulation focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 mb-2 shrink-0">
            <Heart className="w-4 h-4 stroke-[2]" />
          </div>
          <span className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors block truncate w-full">
            Pengajuan
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 leading-tight block truncate w-full">
            Status Klaim Aktif
          </span>
        </button>

        {/* 6. Admin: Simulator WA / Non-Admin: Profil Saya */}
        {isAdmin ? (
          <button
            onClick={onOpenWaBotSimulator}
            className="flex flex-col items-start p-3 sm:p-3.5 min-h-[76px] sm:min-h-[82px] bg-[#0B1428] hover:bg-[#0E1B38] border border-slate-800/80 hover:border-slate-700 rounded-xl transition-all duration-150 group shadow-sm text-left relative overflow-hidden active:scale-[0.98] touch-manipulation focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20 mb-2 shrink-0">
              <Bot className="w-4 h-4 stroke-[2]" />
            </div>
            <span className="text-xs font-semibold text-white group-hover:text-teal-300 transition-colors block truncate w-full">
              Simulator WA
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 leading-tight block truncate w-full">
              Fonnte Gateway
            </span>
          </button>
        ) : (
          <button
            onClick={onOpenProfile}
            className="flex flex-col items-start p-3 sm:p-3.5 min-h-[76px] sm:min-h-[82px] bg-[#0B1428] hover:bg-[#0E1B38] border border-slate-800/80 hover:border-slate-700 rounded-xl transition-all duration-150 group shadow-sm text-left relative overflow-hidden active:scale-[0.98] touch-manipulation focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20 mb-2 shrink-0">
              <User className="w-4 h-4 stroke-[2]" />
            </div>
            <span className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors block truncate w-full">
              Profil Saya
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 leading-tight block truncate w-full">
              Status Perlindungan
            </span>
          </button>
        )}

      </div>
    </div>
  );
};
