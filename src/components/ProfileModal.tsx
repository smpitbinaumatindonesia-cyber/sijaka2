import React, { useEffect } from 'react';
import { 
  User, 
  ShieldCheck, 
  Heart, 
  Calendar, 
  Phone, 
  MapPin, 
  X, 
  Users, 
  FileText, 
  CheckCircle2,
  Award
} from 'lucide-react';
import { SijakaRole } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: SijakaRole;
  userName?: string;
  activeAnggotaId?: string;
  onSwitchRole?: (role: SijakaRole) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userRole,
  userName,
  activeAnggotaId = 'ANG-001',
  onSwitchRole
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

  const getRoleDisplayName = (role: SijakaRole) => {
    switch (role) {
      case 'Anggota':
        return 'Anggota Jamaah (KK)';
      case 'Pengurus':
        return 'Pengurus / Bendahara';
      case 'Ketua':
        return 'Ketua Jamaah Tahlil';
      case 'Admin':
      case 'Super Admin':
        return 'Administrator Utama';
      default:
        return role;
    }
  };

  const getRoleBadgeStyle = (role: SijakaRole) => {
    switch (role) {
      case 'Anggota':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      case 'Pengurus':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
      case 'Ketua':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'Admin':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'Super Admin':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const displayName = userName || (
    userRole === 'Anggota' ? 'Ahmad Subagyo' :
    userRole === 'Pengurus' ? 'Budi Santoso (Bendahara)' :
    userRole === 'Ketua' ? 'H. Wardjo (Ketua Jamaah)' :
    'Administrator SIJAKA'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div className="w-full max-w-lg bg-[#0B1428] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-400 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-blue-900/40 border border-blue-400/30">
              {displayName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white tracking-tight">
                {displayName}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${getRoleBadgeStyle(userRole)}`}>
                  {getRoleDisplayName(userRole)}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  ID: {activeAnggotaId}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Protection / Status Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-950 border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Status Jaminan Kematian Aktif</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/40">
              LUNAS s/d MEI 2026
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Terdaftar dalam program jaminan kematian jamaah tahlil. Berhak atas santunan pemakaman tunai Rp 2.500.000 dan pemulasaraan jenazah lengkap.
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
            <div className="text-[10px] text-slate-400 flex items-center gap-1 font-bold">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>Tanggungan Keluarga</span>
            </div>
            <div className="font-bold text-white text-sm">4 Jiwa Terdaftar</div>
            <div className="text-[10px] text-slate-400">1 Istri, 2 Anak, 1 Orang Tua</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
            <div className="text-[10px] text-slate-400 flex items-center gap-1 font-bold">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tingkat Kepatuhan</span>
            </div>
            <div className="font-bold text-emerald-400 text-sm">80% Tepat Waktu</div>
            <div className="text-[10px] text-slate-400">8 dari 12 Bulan Lunas</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1 col-span-2">
            <div className="text-[10px] text-slate-400 flex items-center gap-1 font-bold">
              <MapPin className="w-3.5 h-3.5 text-purple-400" />
              <span>Alamat & Wilayah</span>
            </div>
            <div className="font-semibold text-slate-200 text-xs">
              RT 03 / RW 02, Dusun Krajan Barat, Desa Sukomakmur
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>0812-3456-7890</span>
            </div>
          </div>
        </div>

        {/* Quick Role Switcher for seamless verification & demonstration */}
        {onSwitchRole && (
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400">
                Simulasi Peran Akses (Testing Switcher):
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {(['Anggota', 'Pengurus', 'Ketua', 'Admin'] as SijakaRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    onSwitchRole(r);
                    onClose();
                  }}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border text-center ${
                    userRole === r
                      ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-900/50'
                      : 'bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-white border-slate-800'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Close button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold border border-slate-800 transition-colors"
          >
            Tutup Profil
          </button>
        </div>

      </div>
    </div>
  );
};
