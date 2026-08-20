import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  ShieldCheck, 
  UserCheck, 
  LogOut, 
  Settings, 
  Zap,
  Lock,
  User,
  Heart,
  DollarSign,
  FileText,
  HelpCircle,
  Database,
  Bot,
  Users
} from 'lucide-react';
import { SijakaRole } from '../types';
import { AdminAccount } from './AdminLoginModal';

interface ExecutiveTopbarProps {
  userRole: SijakaRole;
  currentAdmin: AdminAccount | null;
  onOpenSettings: () => void;
  onRequestRoleChange: (role: SijakaRole) => void;
  onOpenProfile?: () => void;
  onNavigate?: (tab: 'webApp' | 'waBot' | 'sheets' | 'code' | 'security', subTab?: 'kematian' | 'iuran' | 'anggota' | 'bukukas') => void;
  searchTerm: string;
  onSearchChange: (query: string) => void;
}

export const ExecutiveTopbar: React.FC<ExecutiveTopbarProps> = ({
  userRole,
  currentAdmin,
  onOpenSettings,
  onRequestRoleChange,
  onOpenProfile,
  onNavigate,
  searchTerm,
  onSearchChange
}) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

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

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAdmin = userRole === 'Admin' || userRole === 'Super Admin';

  // Role display details
  const getRoleDisplayName = (role: SijakaRole) => {
    switch (role) {
      case 'Public':
        return 'Publik';
      case 'Anggota':
        return 'Anggota';
      case 'Pengurus':
        return 'Pengurus';
      case 'Ketua':
        return 'Ketua';
      case 'Admin':
      case 'Super Admin':
        return 'Super Admin';
      default:
        return role;
    }
  };

  const getRoleBadgeColor = (role: SijakaRole) => {
    switch (role) {
      case 'Public':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
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

  const getUserName = () => {
    if (currentAdmin && currentAdmin.nama) {
      return currentAdmin.nama;
    }
    switch (userRole) {
      case 'Public':
        return 'Pengunjung SIJAKA';
      case 'Anggota':
        return 'Ahmad S.';
      case 'Pengurus':
        return 'Budi Santoso';
      case 'Ketua':
        return 'H. Ahmad';
      case 'Admin':
      case 'Super Admin':
        return 'Administrator Utama';
      default:
        return 'User SIJAKA';
    }
  };

  const getAvatarInitials = () => {
    switch (userRole) {
      case 'Public':
        return 'PB';
      case 'Anggota':
        return 'AS';
      case 'Pengurus':
        return 'BS';
      case 'Ketua':
        return 'HA';
      case 'Admin':
      case 'Super Admin':
        return 'AD';
      default:
        return 'SJ';
    }
  };

  // Role-Aware Search Items
  const allSearchItems = [
    { id: 'dash', title: 'Dashboard Utama', category: 'Navigasi', icon: Zap, roles: ['Anggota', 'Pengurus', 'Ketua', 'Admin', 'Super Admin'], tab: 'webApp' as const },
    { id: 'iuran', title: 'Iuran & Riwayat Pembayaran', category: 'Keuangan', icon: DollarSign, roles: ['Anggota', 'Pengurus', 'Ketua', 'Admin', 'Super Admin'], tab: 'webApp' as const, subTab: 'iuran' as const },
    { id: 'pengajuan', title: 'Pengajuan Santunan & Lapor Kematian', category: 'Layanan', icon: Heart, roles: ['Anggota', 'Pengurus', 'Ketua', 'Admin', 'Super Admin'], tab: 'webApp' as const, subTab: 'kematian' as const },
    { id: 'laporan', title: 'Laporan Keuangan & Buku Kas', category: 'Laporan', icon: FileText, roles: ['Anggota', 'Pengurus', 'Ketua', 'Admin', 'Super Admin'], tab: 'webApp' as const, subTab: 'bukukas' as const },
    { id: 'anggota_kel', title: 'Data Anggota & Keluarga', category: 'Data', icon: Users, roles: ['Pengurus', 'Ketua', 'Admin', 'Super Admin'], tab: 'webApp' as const, subTab: 'anggota' as const },
    { id: 'profil', title: 'Profil & Status Kepesertaan', category: 'Akun', icon: User, roles: ['Anggota', 'Pengurus', 'Ketua', 'Admin', 'Super Admin'], action: () => { if (onOpenProfile) onOpenProfile(); } },
    { id: 'bantuan', title: 'Pusat Bantuan & Panduan Jamaah', category: 'Bantuan', icon: HelpCircle, roles: ['Anggota', 'Pengurus', 'Ketua', 'Admin', 'Super Admin'], action: () => window.open('https://wa.me/6281234567890?text=Bantuan%20SIJAKA', '_blank') },
    // Admin Only items
    { id: 'database_sheets', title: 'Database Google Sheets Live', category: 'Admin Tools', icon: Database, roles: ['Admin', 'Super Admin'], tab: 'sheets' as const },
    { id: 'wabot_sim', title: 'Simulator Fonnte WhatsApp Bot', category: 'Developer', icon: Bot, roles: ['Admin', 'Super Admin'], tab: 'waBot' as const },
    { id: 'security_center', title: 'Security & Audit Control Center', category: 'Security', icon: ShieldCheck, roles: ['Admin', 'Super Admin'], tab: 'security' as const },
  ];

  const filteredSearchItems = allSearchItems
    .filter(item => item.roles.includes(userRole))
    .filter(item => !searchTerm.trim() || item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.category.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <header className="bg-[#050A18]/95 border-b border-slate-800/80 sticky top-0 z-40 backdrop-blur-md px-4 sm:px-6 py-3 font-sans">
      <div className="flex items-center justify-between gap-4 max-w-[1600px] mx-auto">
        
        {/* Left: Role-Aware Search Box */}
        <div ref={searchContainerRef} className="flex-1 max-w-md relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              id="topbar-search-input"
              type="text"
              value={searchTerm}
              onFocus={() => setShowSearchDropdown(true)}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setShowSearchDropdown(true);
              }}
              placeholder="Cari menu, data, atau layanan..."
              className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-xl pl-9 pr-14 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
            <div className="absolute right-2.5 hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono border border-slate-700 pointer-events-none">
              <span>Ctrl</span>
              <span>/</span>
            </div>
          </div>

          {/* Search Suggestions Dropdown */}
          {showSearchDropdown && searchTerm.trim() && (
            <div className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl z-50 text-xs space-y-1">
              <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Hasil Pencarian ({filteredSearchItems.length})
              </div>
              {filteredSearchItems.length === 0 ? (
                <div className="p-3 text-slate-500 text-center text-xs">
                  Tidak ditemukan hasil untuk "{searchTerm}"
                </div>
              ) : (
                filteredSearchItems.slice(0, 5).map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setShowSearchDropdown(false);
                        onSearchChange('');
                        if (item.action) {
                          item.action();
                        } else if (item.tab && onNavigate) {
                          onNavigate(item.tab, item.subTab);
                        }
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-800 text-left transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-bold text-white group-hover:text-blue-300 transition-colors">
                          {item.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                        {item.category}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Right: Notifications & Clean Profile Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Production Environment Badge (Admin/Super Admin Only) */}
          {isAdmin && (
            <button
              onClick={onOpenSettings}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider transition-all"
              title="Buka Konfigurasi Produksi"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>PRODUCTION</span>
            </button>
          )}

          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 relative transition-all"
              title="Notifikasi"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400"></span>
            </button>

            {showNotificationDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl z-50 text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white">Notifikasi Sistem</span>
                  <span className="text-[10px] text-blue-400 cursor-pointer" onClick={() => setShowNotificationDropdown(false)}>Tutup</span>
                </div>
                <div className="space-y-2 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                    <div className="font-bold text-emerald-400">Status Iuran Terverifikasi</div>
                    <div className="text-slate-400 mt-0.5">Iuran kas kematian bulan berjalan telah tercatat lunas.</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                    <div className="font-bold text-blue-400">Layanan Siap 24 Jam</div>
                    <div className="text-slate-400 mt-0.5">Layanan pelaporan kematian dan santunan aktif.</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Info & Role Indicator */}
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-2.5 p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-sm border border-blue-400/20">
                {getAvatarInitials()}
              </div>
              
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{getUserName()}</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full border ${getRoleBadgeColor(userRole)}`}>
                    {getRoleDisplayName(userRole)}
                  </span>
                </div>
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Profile Dropdown */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-[#0B1428] border border-slate-800 rounded-2xl p-2.5 shadow-2xl z-50 text-xs space-y-2">
                <div className="p-2 border-b border-slate-800">
                  <div className="font-bold text-white text-xs">
                    {getUserName()}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                    <span>Peran:</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${getRoleBadgeColor(userRole)}`}>
                      {getRoleDisplayName(userRole)}
                    </span>
                  </div>
                </div>

                {/* Profile View Link */}
                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    if (onOpenProfile) onOpenProfile();
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800/80 text-slate-300 hover:text-white font-bold transition-all text-left"
                >
                  <User className="w-4 h-4 text-blue-400" />
                  <span>Lihat Profil Lengkap</span>
                </button>

                {/* Quick Role Switcher for simulation testing */}
                <div className="pt-2 border-t border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 px-2 mb-1.5 uppercase tracking-wider">
                    Ganti Peran Akses:
                  </div>
                  <div className="grid grid-cols-2 gap-1 px-1">
                    {(['Public', 'Anggota', 'Pengurus', 'Ketua', 'Admin'] as SijakaRole[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          setShowProfileDropdown(false);
                          onRequestRoleChange(r);
                        }}
                        className={`p-1.5 rounded-lg text-[11px] font-bold text-left transition-colors flex items-center gap-1.5 ${
                          userRole === r
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${userRole === r ? 'bg-white' : 'bg-slate-600'}`}></span>
                        <span>{r}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Admin Settings (Admin only) */}
                {isAdmin && (
                  <div className="pt-2 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        onOpenSettings();
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800/80 text-slate-300 hover:text-white font-bold transition-all text-left"
                    >
                      <Settings className="w-4 h-4 text-purple-400" />
                      <span>Pengaturan Gateway WA</span>
                    </button>
                  </div>
                )}

              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
