import React from 'react';
import { 
  Home, 
  DollarSign, 
  Plus, 
  FileText, 
  User, 
  ShieldCheck,
  Users
} from 'lucide-react';
import { SijakaRole } from '../types';

interface MobileBottomNavProps {
  activeTab: 'webApp' | 'waBot' | 'sheets' | 'code' | 'security' | 'settings';
  setActiveTab: (tab: 'webApp' | 'waBot' | 'sheets' | 'code' | 'security' | 'settings') => void;
  activeSubTab?: 'kematian' | 'iuran' | 'anggota' | 'bukukas' | 'users' | 'layanan';
  onOpenQuickMenu: () => void;
  onOpenProfile?: () => void;
  onSelectSubTab?: (subTab: 'kematian' | 'iuran' | 'anggota' | 'bukukas' | 'users' | 'layanan') => void;
  userRole?: SijakaRole;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  activeSubTab,
  onOpenQuickMenu,
  onOpenProfile,
  onSelectSubTab,
  userRole = 'Anggota'
}) => {
  const isDashboardActive = activeTab === 'webApp' && !activeSubTab;
  const isIuranActive = activeTab === 'webApp' && activeSubTab === 'iuran';
  const isLaporanActive = activeTab === 'webApp' && activeSubTab === 'bukukas';

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-[#050A18]/95 border-t border-slate-800/80 backdrop-blur-md shadow-lg safe-area-pb">
      <div className="flex items-center justify-around px-2 py-2 relative">
        
        {/* 1. Dashboard */}
        <button
          onClick={() => {
            setActiveTab('webApp');
            if (onSelectSubTab) onSelectSubTab(undefined as any);
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            isDashboardActive ? 'text-blue-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-1">Dashboard</span>
        </button>

        {/* 2. Iuran */}
        <button
          onClick={() => {
            setActiveTab('webApp');
            if (onSelectSubTab) onSelectSubTab('iuran');
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            isIuranActive ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <DollarSign className="w-5 h-5" />
          <span className="text-[10px] mt-1">Iuran</span>
        </button>

        {/* 3. Center Floating Circular '+' Button */}
        <div className="flex-1 flex justify-center -mt-5">
          <button
            onClick={onOpenQuickMenu}
            className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-md border-4 border-[#050A18] active:scale-95 transition-transform"
            title="Menu Aksi Cepat"
            aria-label="Aksi Cepat SIJAKA"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* 4. Laporan */}
        <button
          onClick={() => {
            setActiveTab('webApp');
            if (onSelectSubTab) onSelectSubTab('bukukas');
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            isLaporanActive ? 'text-purple-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] mt-1">Laporan</span>
        </button>

        {/* 5. Profil */}
        <button
          onClick={() => {
            if (onOpenProfile) onOpenProfile();
          }}
          className="flex flex-col items-center justify-center flex-1 py-1 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-1">Profil</span>
        </button>

      </div>
    </div>
  );
};
