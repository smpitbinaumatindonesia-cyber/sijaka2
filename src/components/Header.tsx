import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  MessageSquare, 
  Table, 
  Code2, 
  Settings, 
  ShieldCheck, 
  FileSpreadsheet,
  Zap,
  UserCheck,
  Camera,
  Upload,
  Link,
  RotateCcw,
  X,
  Check,
  Lock
} from 'lucide-react';

import { SijakaRole } from '../types';

interface HeaderProps {
  activeTab: 'webApp' | 'waBot' | 'sheets' | 'code' | 'security' | 'settings';
  setActiveTab: (tab: 'webApp' | 'waBot' | 'sheets' | 'code' | 'security' | 'settings') => void;
  onOpenSettings: () => void;
  userRole?: SijakaRole;
  setUserRole?: (role: SijakaRole) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  setActiveTab, 
  onOpenSettings,
  userRole = 'Anggota',
  setUserRole
}) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [tempUrlInput, setTempUrlInput] = useState('');

  useEffect(() => {
    const savedLogo = localStorage.getItem('sijaka_custom_logo');
    if (savedLogo) {
      setLogoUrl(savedLogo);
    }
  }, []);

  // Strictly hide technical admin navigation ribbon for Anggota, Pengurus, and Ketua
  const isAdmin = userRole === 'Admin' || userRole === 'Super Admin';
  if (!isAdmin) {
    return null;
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file maksimal 2 MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setLogoUrl(result);
          localStorage.setItem('sijaka_custom_logo', result);
          setIsLogoModalOpen(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempUrlInput.trim()) {
      setLogoUrl(tempUrlInput.trim());
      localStorage.setItem('sijaka_custom_logo', tempUrlInput.trim());
      setTempUrlInput('');
      setIsLogoModalOpen(false);
    }
  };

  const handleResetLogo = () => {
    setLogoUrl(null);
    localStorage.removeItem('sijaka_custom_logo');
    setIsLogoModalOpen(false);
  };

  return (
    <header className="bg-[#050A18]/95 text-white border-b border-slate-800/80 sticky top-0 z-40 backdrop-blur-md font-sans">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact Utility Ribbon (Height 55-65px) */}
        <div className="flex items-center justify-between py-2.5 gap-3 border-b border-slate-900/60">
          
          {/* Left: Brand Identity & Integration Tag */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLogoModalOpen(true)}
              className="group relative p-0.5 rounded-lg bg-gradient-to-tr from-blue-600 to-teal-400 shrink-0 transition-transform active:scale-95 text-left focus:outline-none"
              title="Ganti Logo SIJAKA"
            >
              <div className="w-7 h-7 bg-slate-950 rounded-md flex items-center justify-center font-black text-xs text-blue-400 overflow-hidden relative">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo SIJAKA" className="w-full h-full object-cover" />
                ) : (
                  <span>S</span>
                )}
              </div>
            </button>
            
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black tracking-tight text-white">
                SIJAKA
              </h2>
              <span className="hidden md:inline text-xs text-slate-400 font-medium">
                • Sistem Jaminan Kematian
              </span>
              <span className="text-[10px] font-bold bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded-md border border-blue-500/20 flex items-center gap-1">
                <Zap className="w-3 h-3 text-blue-400" />
                GAS + Fonnte WA
              </span>
            </div>
          </div>

          {/* Right: Quick Role Switcher for Admin Header & Direct Links */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            {setUserRole && (
              <div className="flex items-center bg-slate-900/90 p-0.5 rounded-lg border border-slate-800">
                <button
                  onClick={() => setUserRole('Anggota')}
                  className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition-all text-slate-400 hover:text-slate-200"
                  title="Beralih ke Tampilan Anggota"
                >
                  <UserCheck className="w-3 h-3" />
                  <span>Mode Anggota</span>
                </button>

                <button
                  onClick={() => setUserRole('Admin')}
                  className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition-all bg-amber-600 text-white shadow-sm"
                  title="Akses Penuh Pengurus / IT"
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>Admin Utama</span>
                </button>
              </div>
            )}

            {isAdmin && (
              <a
                href="https://docs.google.com/spreadsheets/d/1ZrYAwb8PTg-nTR-6H8HF3c9J130bnhwX-rElXrL-i5E/edit?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 px-3 py-1 rounded-lg border border-emerald-500/30 text-xs font-bold transition-all"
                title="Spreadsheet Database"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Spreadsheet</span>
              </a>
            )}

            {userRole === 'Admin' && (
              <button 
                onClick={onOpenSettings}
                className="hidden sm:flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-sm"
              >
                <Settings className="w-3 h-3" />
                <span>Pengaturan WA</span>
              </button>
            )}
          </div>
        </div>

        {/* Secondary Navigation Ribbon: Tabs */}
        <div className="py-1.5">
          <nav className="flex items-center gap-1 bg-[#0B1428]/80 p-1 rounded-xl border border-slate-800/80 overflow-x-auto scrollbar-none" aria-label="Main Navigation">
            <button
              onClick={() => setActiveTab('webApp')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'webApp'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              <Globe className={`w-3.5 h-3.5 ${activeTab === 'webApp' ? 'text-white' : 'text-blue-400'}`} />
              <span>1. Dashboard Web</span>
            </button>

            <button
              onClick={() => setActiveTab('waBot')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'waBot'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              <MessageSquare className={`w-3.5 h-3.5 ${activeTab === 'waBot' ? 'text-white' : 'text-emerald-400'}`} />
              <span>2. Simulator WA Bot</span>
            </button>

            <button
              onClick={() => setActiveTab('sheets')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'sheets'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              <Table className={`w-3.5 h-3.5 ${activeTab === 'sheets' ? 'text-white' : 'text-purple-400'}`} />
              <span>3. Database Sheets</span>
              {userRole !== 'Admin' && <Lock className="w-3 h-3 text-amber-400/80 ml-0.5" />}
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'code'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              <Code2 className={`w-3.5 h-3.5 ${activeTab === 'code' ? 'text-white' : 'text-amber-400'}`} />
              <span>4. Salin Code.gs & Index.html</span>
              {userRole !== 'Admin' && <Lock className="w-3 h-3 text-amber-400/80 ml-0.5" />}
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'security'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${activeTab === 'security' ? 'text-white' : 'text-teal-400'}`} />
              <span>5. Security & Control Center</span>
            </button>
          </nav>
        </div>

      </div>

      {/* Modal Pengaturan Logo SIJAKA */}
      {isLogoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 text-slate-900 font-sans">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-400" />
                <h3 className="font-extrabold text-sm tracking-tight">Pengaturan Logo SIJAKA</h3>
              </div>
              <button 
                onClick={() => setIsLogoModalOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Preview Logo */}
              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-14 h-14 bg-slate-950 rounded-xl flex items-center justify-center font-extrabold text-xl text-blue-400 overflow-hidden shadow-md mb-2">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Preview Logo" className="w-full h-full object-cover" />
                  ) : (
                    "S"
                  )}
                </div>
                <span className="text-xs text-slate-500 font-medium">Tampilan Logo Saat Ini</span>
              </div>

              {/* Upload Form */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-blue-600" />
                  Unggah Gambar Logo Baru
                </label>
                <label className="flex items-center justify-center w-full px-4 py-2.5 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-blue-50/50 hover:border-blue-400 transition-all text-xs text-slate-600 font-semibold gap-2">
                  <Upload className="w-4 h-4 text-slate-500" />
                  <span>Pilih File Gambar (PNG / JPG / SVG)</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileUpload} 
                    className="hidden" 
                  />
                </label>
              </div>

              {/* URL Form */}
              <form onSubmit={handleSaveUrl} className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Link className="w-4 h-4 text-indigo-600" />
                  Atau Menggunakan URL Gambar
                </label>
                <div className="flex gap-2">
                  <input 
                    type="url" 
                    placeholder="https://domain.com/logo.png"
                    value={tempUrlInput}
                    onChange={(e) => setTempUrlInput(e.target.value)}
                    className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-xl font-mono text-slate-800"
                  />
                  <button 
                    type="submit"
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 shrink-0"
                  >
                    <Check className="w-4 h-4" />
                    Simpan
                  </button>
                </div>
              </form>

              {logoUrl && (
                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={handleResetLogo}
                    className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset ke Logo Default
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
