import React from 'react';
import { 
  Home, 
  Users, 
  Plus, 
  FileText, 
  User, 
  Heart,
  DollarSign,
  AlertTriangle
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'webApp' | 'waBot' | 'sheets' | 'code' | 'security' | 'settings';
  setActiveTab: (tab: 'webApp' | 'waBot' | 'sheets' | 'code' | 'security' | 'settings') => void;
  onOpenQuickMenu: () => void;
  onSelectSubTab?: (subTab: 'kematian' | 'iuran' | 'anggota' | 'bukukas' | 'users' | 'layanan') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenQuickMenu,
  onSelectSubTab
}) => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-slate-950/95 border-t border-slate-800/90 backdrop-blur-xl shadow-2xl safe-area-pb">
      <div className="flex items-center justify-around px-2 py-2 relative">
        
        {/* 1. Dashboard */}
        <button
          onClick={() => setActiveTab('webApp')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeTab === 'webApp' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">Dashboard</span>
        </button>

        {/* 2. Anggota */}
        <button
          onClick={() => {
            setActiveTab('webApp');
            if (onSelectSubTab) onSelectSubTab('anggota');
          }}
          className="flex flex-col items-center justify-center flex-1 py-1 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">Anggota</span>
        </button>

        {/* 3. Center Floating Circular '+' Button */}
        <div className="flex-1 flex justify-center -mt-6">
          <button
            onClick={onOpenQuickMenu}
            className="w-13 h-13 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-emerald-950/80 border-4 border-slate-950 hover:scale-105 active:scale-95 transition-transform"
            title="Menu Aksi Cepat"
            aria-label="Aksi Cepat SIJAKA"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* 4. Laporan / Buku Kas */}
        <button
          onClick={() => {
            setActiveTab('webApp');
            if (onSelectSubTab) onSelectSubTab('bukukas');
          }}
          className="flex flex-col items-center justify-center flex-1 py-1 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">Laporan</span>
        </button>

        {/* 5. Akun / Security */}
        <button
          onClick={() => setActiveTab('security')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeTab === 'security' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">Akun</span>
        </button>

      </div>
    </div>
  );
};
