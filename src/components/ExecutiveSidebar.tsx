import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  FileText, 
  Heart, 
  Database, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  HelpCircle,
  Shield,
  User,
  MessageSquare,
  Code2,
  Lock
} from 'lucide-react';
import { SijakaRole } from '../types';

interface ExecutiveSidebarProps {
  activeTab: 'webApp' | 'waBot' | 'sheets' | 'code' | 'security' | 'settings';
  setActiveTab: (tab: 'webApp' | 'waBot' | 'sheets' | 'code' | 'security' | 'settings') => void;
  activeSubTab?: 'kematian' | 'iuran' | 'anggota' | 'bukukas' | 'users' | 'layanan';
  onSelectSubTab?: (tab: 'kematian' | 'iuran' | 'anggota' | 'bukukas' | 'users' | 'layanan') => void;
  onOpenProfile?: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  userRole: SijakaRole;
}

export const ExecutiveSidebar: React.FC<ExecutiveSidebarProps> = ({
  activeTab,
  setActiveTab,
  activeSubTab,
  onSelectSubTab,
  onOpenProfile,
  isCollapsed,
  onToggleCollapse,
  userRole
}) => {
  const isAdmin = userRole === 'Admin' || userRole === 'Super Admin';

  // 1. Menu Items for ANGGOTA, PENGURUS, KETUA (Strictly Clean & Focused)
  // Urutan: Dashboard -> Iuran -> Pengajuan -> Laporan -> Profil -> Bantuan
  const memberMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, tab: 'webApp' as const, subTab: undefined },
    { id: 'iuran', label: 'Iuran', icon: DollarSign, tab: 'webApp' as const, subTab: 'iuran' as const },
    { id: 'pengajuan', label: 'Pengajuan', icon: Heart, tab: 'webApp' as const, subTab: 'kematian' as const },
    { id: 'laporan', label: 'Laporan', icon: FileText, tab: 'webApp' as const, subTab: 'bukukas' as const },
    { id: 'profil', label: 'Profil', icon: User, tab: undefined, subTab: undefined, isProfile: true },
  ];

  // 2. Full Menu Items for ADMIN / SUPER ADMIN
  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, tab: 'webApp' as const, subTab: undefined },
    { id: 'anggota', label: 'Anggota & Keluarga', icon: Users, tab: 'webApp' as const, subTab: 'anggota' as const },
    { id: 'iuran', label: 'Data Iuran', icon: DollarSign, tab: 'webApp' as const, subTab: 'iuran' as const },
    { id: 'pengajuan', label: 'Pengajuan & Santunan', icon: Heart, tab: 'webApp' as const, subTab: 'kematian' as const },
    { id: 'laporan', label: 'Laporan & Buku Kas', icon: FileText, tab: 'webApp' as const, subTab: 'bukukas' as const },
    { id: 'database', label: 'Database Sheets', icon: Database, tab: 'sheets' as const, subTab: undefined },
    { id: 'wabot', label: 'Simulator WA Bot', icon: MessageSquare, tab: 'waBot' as const, subTab: undefined },
    { id: 'code', label: 'Vercel API & Config', icon: Code2, tab: 'code' as const, subTab: undefined },
    { id: 'security', label: 'Security & Control', icon: ShieldCheck, tab: 'security' as const, subTab: undefined },
  ];

  const currentMenuItems = isAdmin ? adminMenuItems : memberMenuItems;

  return (
    <aside className={`hidden md:flex flex-col bg-[#050A18] border-r border-slate-800/80 text-white transition-all duration-300 relative z-30 shrink-0 ${
      isCollapsed ? 'w-20' : 'w-[240px]'
    }`}>
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-400 flex items-center justify-center font-black text-sm text-white shadow-lg shadow-blue-900/30 border border-blue-400/20">
              <Shield className="w-5 h-5 fill-white/20 stroke-white stroke-[2.2]" />
            </div>
            <div>
              <div className="text-sm font-black text-white tracking-wider flex items-center gap-1.5">
                <span>SIJAKA</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium leading-tight">
                Sistem Informasi Jaminan Kematian
              </div>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="mx-auto w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-blue-900/30 border border-blue-400/20">
            <Shield className="w-5 h-5 stroke-[2.2]" />
          </div>
        )}

        {/* Collapse Toggle Button */}
        <button
          onClick={onToggleCollapse}
          className={`p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all ${
            isCollapsed ? 'hidden' : 'block'
          }`}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Main Navigation List */}
      <div className="flex-1 py-4 px-2 space-y-1.5 overflow-y-auto">
        {currentMenuItems.map((item) => {
          const Icon = item.icon;
          
          let isActive = false;
          if (item.isProfile) {
            isActive = false;
          } else if (item.id === 'dashboard') {
            isActive = activeTab === 'webApp' && !activeSubTab;
          } else if (item.tab === 'webApp' && item.subTab) {
            isActive = activeTab === 'webApp' && activeSubTab === item.subTab;
          } else if (item.tab && item.tab === activeTab) {
            isActive = true;
          }

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.isProfile) {
                  if (onOpenProfile) onOpenProfile();
                  return;
                }
                if (item.tab) {
                  setActiveTab(item.tab);
                }
                if (onSelectSubTab) {
                  onSelectSubTab(item.subTab as any);
                }
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative group ${
                isActive
                  ? 'bg-blue-600/15 text-blue-300 font-bold border border-blue-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
              
              {!isCollapsed && (
                <span className="truncate">{item.label}</span>
              )}

              {/* Clean Active Dot Indicator */}
              {isActive && !isCollapsed && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Section: Bantuan & Status Akses */}
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        {!isCollapsed && (
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SIJAKA Online</span>
              </div>
              <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border ${
                userRole === 'Anggota'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/30'
                  : userRole === 'Pengurus'
                  ? 'bg-blue-950 text-blue-300 border-blue-500/30'
                  : userRole === 'Ketua'
                  ? 'bg-purple-950 text-purple-300 border-purple-500/30'
                  : userRole === 'Super Admin'
                  ? 'bg-rose-950 text-rose-300 border-rose-500/30'
                  : 'bg-amber-950 text-amber-300 border-amber-500/30'
              }`}>
                {userRole}
              </span>
            </div>
            <div className="text-slate-400 text-[10px]">
              {isAdmin ? 'Akses Penuh Pengurus / IT' : 'Layanan Anggota Jamaah'}
            </div>
          </div>
        )}

        <div className="flex items-center gap-1">
          {!isCollapsed && (
            <button
              onClick={() => window.open('https://wa.me/6281234567890?text=Assalamu%27alaikum%20Bantuan%20SIJAKA', '_blank')}
              className="flex-1 py-1.5 px-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
              <span>Bantuan</span>
            </button>
          )}

          <button
            onClick={onToggleCollapse}
            className={`py-1.5 px-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all ${
              isCollapsed ? 'w-full flex items-center justify-center' : 'shrink-0'
            }`}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

    </aside>
  );
};
