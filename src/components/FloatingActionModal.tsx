import React from 'react';
import { 
  X, 
  AlertTriangle, 
  DollarSign, 
  UserPlus, 
  FileText, 
  Heart,
  Bot
} from 'lucide-react';

interface FloatingActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLaporKematian: () => void;
  onOpenInputIuran: () => void;
  onOpenTambahAnggota: () => void;
  onSelectSubTab: (tab: 'kematian' | 'iuran' | 'anggota' | 'bukukas' | 'users' | 'layanan') => void;
  onOpenWaBot: () => void;
  userRole: 'Admin' | 'Anggota';
}

export const FloatingActionModal: React.FC<FloatingActionModalProps> = ({
  isOpen,
  onClose,
  onOpenLaporKematian,
  onOpenInputIuran,
  onOpenTambahAnggota,
  onSelectSubTab,
  onOpenWaBot,
  userRole
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-300">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Menu Aksi Cepat</h3>
            <p className="text-xs text-slate-400">Pilih tindakan operasional yang ingin dilakukan</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
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
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-rose-950/40 hover:bg-rose-950/60 border border-rose-500/40 text-left transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-rose-300">Lapor Kematian Baru</div>
              <div className="text-[11px] text-slate-400">Proses klaim & pemulasaraan santunan Rp 2,5jt</div>
            </div>
          </button>

          {/* Input Iuran */}
          <button
            onClick={() => {
              onClose();
              onOpenInputIuran();
            }}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-950/40 hover:bg-emerald-950/60 border border-emerald-500/40 text-left transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-300">Input Pembayaran Iuran</div>
              <div className="text-[11px] text-slate-400">Pencatatan kas masuk anggota jamaah</div>
            </div>
          </button>

          {/* + Anggota */}
          <button
            onClick={() => {
              onClose();
              onOpenTambahAnggota();
            }}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-blue-950/40 hover:bg-blue-950/60 border border-blue-500/40 text-left transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-blue-300">Daftar Anggota Baru</div>
              <div className="text-[11px] text-slate-400">Pendaftaran KK & tanggungan keluarga</div>
            </div>
          </button>

          {/* Buku Kas */}
          <button
            onClick={() => {
              onClose();
              onSelectSubTab('bukukas');
            }}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-purple-950/40 hover:bg-purple-950/60 border border-purple-500/40 text-left transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-purple-300">Lihat Buku Kas & Keuangan</div>
              <div className="text-[11px] text-slate-400">Rekapitulasi arus kas masuk, keluar, dan saldo</div>
            </div>
          </button>

          {/* WA Bot */}
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
        </div>

      </div>
    </div>
  );
};
