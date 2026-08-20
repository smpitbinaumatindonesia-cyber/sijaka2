import React, { useEffect } from 'react';
import { 
  X, 
  AlertTriangle, 
  DollarSign, 
  UserPlus, 
  FileText, 
  Heart,
  Bot,
  User,
  HelpCircle
} from 'lucide-react';
import { SijakaRole } from '../types';

interface FloatingActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLaporKematian: () => void;
  onOpenInputIuran: () => void;
  onOpenTambahAnggota: () => void;
  onSelectSubTab: (tab: 'kematian' | 'iuran' | 'anggota' | 'bukukas' | 'users' | 'layanan') => void;
  onOpenWaBot?: () => void;
  onOpenProfile?: () => void;
  userRole: SijakaRole;
}

export const FloatingActionModal: React.FC<FloatingActionModalProps> = ({
  isOpen,
  onClose,
  onOpenLaporKematian,
  onOpenInputIuran,
  onOpenTambahAnggota,
  onSelectSubTab,
  onOpenWaBot,
  onOpenProfile,
  userRole
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isAdmin = userRole === 'Admin' || userRole === 'Super Admin';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div className="w-full max-w-md bg-[#0B1428] border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4 animate-in slide-in-from-bottom duration-200">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div>
            <h3 className="text-base font-bold text-white">Menu Aksi Cepat</h3>
            <p className="text-xs text-slate-400">Pilih tindakan operasional yang ingin dilakukan</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {/* Lapor Kematian */}
          <button
            onClick={() => {
              onClose();
              onOpenLaporKematian();
            }}
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800/80 hover:border-slate-700 text-left transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white group-hover:text-rose-300">Lapor Kematian Baru</div>
              <div className="text-[11px] text-slate-400">Proses klaim & pemulasaraan santunan Rp 2,5jt</div>
            </div>
          </button>

          {/* Input Iuran */}
          <button
            onClick={() => {
              onClose();
              onOpenInputIuran();
            }}
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800/80 hover:border-slate-700 text-left transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white group-hover:text-emerald-300">Pembayaran Iuran Kas</div>
              <div className="text-[11px] text-slate-400">Pencatatan kas masuk anggota jamaah</div>
            </div>
          </button>

          {/* + Anggota */}
          <button
            onClick={() => {
              onClose();
              onOpenTambahAnggota();
            }}
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800/80 hover:border-slate-700 text-left transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white group-hover:text-blue-300">Daftar Anggota Baru</div>
              <div className="text-[11px] text-slate-400">Pendaftaran KK & tanggungan keluarga</div>
            </div>
          </button>

          {/* Buku Kas / Laporan */}
          <button
            onClick={() => {
              onClose();
              onSelectSubTab('bukukas');
            }}
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800/80 hover:border-slate-700 text-left transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white group-hover:text-purple-300">Lihat Laporan & Buku Kas</div>
              <div className="text-[11px] text-slate-400">Rekapitulasi arus kas masuk, keluar, dan saldo</div>
            </div>
          </button>

          {/* Non-Admin: Profil / Bantuan */}
          {!isAdmin && (
            <button
              onClick={() => {
                onClose();
                if (onOpenProfile) onOpenProfile();
              }}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800/80 hover:border-slate-700 text-left transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white group-hover:text-indigo-300">Lihat Profil Anggota</div>
                <div className="text-[11px] text-slate-400">Status perlindungan & data kartu keluarga</div>
              </div>
            </button>
          )}

          {/* Admin only: Simulator WA */}
          {isAdmin && onOpenWaBot && (
            <button
              onClick={() => {
                onClose();
                onOpenWaBot();
              }}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-indigo-950/40 hover:bg-indigo-950/60 border border-indigo-500/40 text-left transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-indigo-300">Buka Simulator WA Bot</div>
                <div className="text-[11px] text-slate-400">Uji coba interaksi bot WhatsApp Fonnte</div>
              </div>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
