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
  Shield
} from 'lucide-react';

interface ExecutiveSidebarProps {
  activeTab: 'webApp' | 'waBot' | 'sheets' | 'code' | 'security' | 'settings';
  setActiveTab: (tab: 'webApp' | 'waBot' | 'sheets' | 'code' | 'security' | 'settings') => void;
  activeSubTab?: 'kematian' | 'iuran' | 'anggota' | 'bukukas' | 'users' | 'layanan';
  onSelectSubTab?: (tab: 'kematian' | 'iuran' | 'anggota' | 'bukukas' | 'users' | 'layanan') => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  userRole: 'Admin' | 'Anggota';
}

export const ExecutiveSidebar: React.FC<ExecutiveSidebarProps> = ({
  activeTab,
  setActiveTab,
  activeSubTab,
  onSelectSubTab,
  isCollapsed,
  onToggleCollapse,
  userRole
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, tab: 'webApp', subTab: undefined },
    { id: 'anggota', label: 'Anggota', icon: Users, tab: 'webApp', subTab: 'anggota' as const },
    { id: 'iuran', label: 'Iuran', icon: DollarSign, tab: 'webApp', subTab: 'iuran' as const },
    { id: 'laporan', label: 'Laporan', icon: FileText, tab: 'webApp', subTab: 'bukukas' as const },
    { id: 'pengajuan', label: 'Pengajuan', icon: Heart, tab: 'webApp', subTab: 'kematian' as const },
    { id: 'database', label: 'Database', icon: Database, tab: 'sheets', subTab: undefined },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings, tab: 'security', subTab: undefined },
  ];

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
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = (item.tab === activeTab && (!item.subTab || item.subTab === activeSubTab)) ||
            (item.id === 'dashboard' && activeTab === 'webApp' && !activeSubTab);

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.tab as any);
                if (item.subTab && onSelectSubTab) {
                  onSelectSubTab(item.subTab);
                }
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative group ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-900/40 border border-blue-400/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/80 border border-transparent'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-white scale-110' : 'text-slate-400 group-hover:text-white'}`} />
              
              {!isCollapsed && (
                <span className="truncate">{item.label}</span>
              )}

              {/* Active glow indicator */}
              {isActive && !isCollapsed && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-sm"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Section: Bantuan & Dukungan + Collapse Controls */}
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        {!isCollapsed && (
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Ar-Rohman Online</span>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                v1.4.2
              </span>
            </div>
            <div className="text-slate-400 text-[10px]">
              Hak Akses: <strong className="text-white font-mono">{userRole}</strong>
            </div>
          </div>
        )}

        <div className="flex items-center gap-1">
          {!isCollapsed && (
            <button
              onClick={() => window.open('https://wa.me/6281234567890?text=Bantuan%20SIJAKA', '_blank')}
              className="flex-1 py-1.5 px-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
              <span>Bantuan & Dukungan</span>
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
