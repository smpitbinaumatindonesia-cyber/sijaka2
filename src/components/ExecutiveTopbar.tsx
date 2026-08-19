import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  ShieldCheck, 
  UserCheck, 
  LogOut, 
  Settings, 
  Zap,
  Lock
} from 'lucide-react';
import { AdminAccount } from './AdminLoginModal';

interface ExecutiveTopbarProps {
  userRole: 'Admin' | 'Anggota';
  currentAdmin: AdminAccount | null;
  onOpenSettings: () => void;
  onRequestRoleChange: (role: 'Admin' | 'Anggota') => void;
  searchTerm: string;
  onSearchChange: (query: string) => void;
}

export const ExecutiveTopbar: React.FC<ExecutiveTopbarProps> = ({
  userRole,
  currentAdmin,
  onOpenSettings,
  onRequestRoleChange,
  searchTerm,
  onSearchChange
}) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

  // Keyboard shortcut Ctrl+/ or Cmd+/ to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        const searchInput = document.getElementById('topbar-search-input');
        if (searchInput) {
          searchInput.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="bg-[#050A18]/95 border-b border-slate-800/80 sticky top-0 z-40 backdrop-blur-md px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left: Search Box with Ctrl / shortcut */}
        <div className="flex-1 max-w-md relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              id="topbar-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari menu, data, atau anggota..."
              className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-xl pl-9 pr-14 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
            <div className="absolute right-2.5 hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono border border-slate-700 pointer-events-none">
              <span>Ctrl</span>
              <span>/</span>
            </div>
          </div>
        </div>

        {/* Right: Notifications & Profile Dropdown */}
        <div className="flex items-center gap-3">
          
          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 relative transition-all"
              title="Notifikasi Sistem"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            </button>

            {showNotificationDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl z-50 text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white">Notifikasi (3)</span>
                  <span className="text-[10px] text-blue-400 cursor-pointer">Tandai Dibaca</span>
                </div>
                <div className="space-y-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                    <div className="font-bold text-white">Laporan Kematian Baru</div>
                    <div className="text-slate-400">Pengajuan dari Bpk. Ahmad S. menunggu verifikasi RT/RW.</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                    <div className="font-bold text-emerald-400">Pembayaran Iuran Sukses</div>
                    <div className="text-slate-400">Ibu Siti Aisyah telah melunasi iuran Agustus 2026.</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Info & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-2.5 p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {userRole === 'Admin' ? 'A' : 'KK'}
              </div>
              
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  <span>{currentAdmin ? currentAdmin.nama_lengkap : 'Admin Pengurus'}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-semibold">
                  {userRole === 'Admin' ? 'Super Admin' : 'Anggota / KK'}
                </div>
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Profile Menu Dropdown */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl z-50 text-xs space-y-1">
                <div className="p-2.5 border-b border-slate-800">
                  <div className="font-bold text-white text-xs">
                    {currentAdmin ? currentAdmin.nama_lengkap : 'Admin Pengurus'}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Mode Akses: {userRole}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    onRequestRoleChange(userRole === 'Admin' ? 'Anggota' : 'Admin');
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white font-bold transition-all text-left"
                >
                  <UserCheck className="w-4 h-4 text-blue-400" />
                  <span>Ganti Mode ke {userRole === 'Admin' ? 'Anggota' : 'Admin'}</span>
                </button>

                {userRole === 'Admin' && (
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      onOpenSettings();
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white font-bold transition-all text-left"
                  >
                    <Settings className="w-4 h-4 text-purple-400" />
                    <span>Pengaturan WA Gateway</span>
                  </button>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
