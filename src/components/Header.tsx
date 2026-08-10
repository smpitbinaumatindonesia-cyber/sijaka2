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
  ShieldAlert,
  Camera,
  Upload,
  Link,
  RotateCcw,
  X,
  Check,
  Lock
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'webApp' | 'waBot' | 'sheets' | 'code' | 'settings';
  setActiveTab: (tab: 'webApp' | 'waBot' | 'sheets' | 'code' | 'settings') => void;
  onOpenSettings: () => void;
  userRole?: 'Admin' | 'Anggota';
  setUserRole?: (role: 'Admin' | 'Anggota') => void;
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
    <header className="bg-slate-950/95 text-white border-b border-slate-800/80 sticky top-0 z-40 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Brand Logo & Global Status Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between py-3 gap-3">
          
          {/* Logo & System Brand */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsLogoModalOpen(true)}
                className="group relative p-0.5 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-teal-400 shadow-lg shadow-blue-500/20 shrink-0 transition-transform active:scale-95 text-left"
                title="Klik untuk mengganti Logo SIJAKA"
              >
                <div className="w-9 h-9 bg-slate-950 rounded-[10px] flex items-center justify-center font-extrabold text-lg text-blue-400 tracking-tight overflow-hidden relative">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo SIJAKA" className="w-full h-full object-cover" />
                  ) : (
                    "S"
                  )}
                  
                  {/* Overlay Hover Icon */}
                  <div className="absolute inset-0 bg-slate-950/75 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-4 h-4 text-blue-300" />
                  </div>
                </div>
              </button>
              
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
                    SIJAKA
                  </h1>
                  <span className="hidden md:inline-block text-xs font-semibold text-slate-400">
                    Sistem Informasi Jaminan Kematian
                  </span>
                  <span className="text-[10px] font-bold bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-500/30 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-blue-400" />
                    GAS + Fonnte WA
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 sm:hidden">
                  Sistem Informasi Jaminan Kematian Anggota
                </p>
              </div>
            </div>

            {/* Mobile Settings Button */}
            {userRole === 'Admin' && (
              <button 
                onClick={onOpenSettings}
                className="sm:hidden p-2 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg border border-slate-700"
                title="Pengaturan WA Bot"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Actions & Role Switcher */}
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5 text-xs font-semibold w-full sm:w-auto">
            
            {/* Interactive Role Switcher Pill */}
            {setUserRole && (
              <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-inner">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-2 hidden lg:inline">
                  Hak Akses:
                </span>
                
                <button
                  onClick={() => setUserRole('Anggota')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    userRole === 'Anggota'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40 border border-emerald-400/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Akses Dibatasi (Dashboard, Lapor Kematian, Tambah Anggota)"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Anggota</span>
                  {userRole === 'Anggota' && (
                    <span className="bg-emerald-950 text-emerald-200 text-[9px] px-1.5 py-0.2 rounded-full font-bold hidden md:inline">
                      Terbatas
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setUserRole('Admin')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    userRole === 'Admin'
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-900/40 border border-amber-400/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Akses Penuh Pengurus / Admin"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin / Pengurus</span>
                  {userRole === 'Admin' && (
                    <span className="bg-amber-950 text-amber-200 text-[9px] px-1.5 py-0.2 rounded-full font-bold hidden md:inline">
                      Full
                    </span>
                  )}
                </button>
              </div>
            )}

            {userRole === 'Admin' && (
              <a
                href="https://docs.google.com/spreadsheets/d/1b2bMaHY8TiuBtJQwCJgxRz3fzlJh6iakcgpDkhGvA_c/edit?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 px-3 py-1.5 rounded-lg border border-emerald-500/30 transition-all shadow-sm hover:border-emerald-500/60"
                title="Buka Google Spreadsheet Database Utama SIJAKA (Akses Admin)"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Spreadsheet Database</span>
              </a>
            )}

            {userRole === 'Admin' && (
              <button 
                onClick={onOpenSettings}
                className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-3.5 py-1.5 rounded-lg font-bold transition-all shadow-md shadow-blue-900/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Pengaturan WA Bot</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="py-1.5">
          <nav className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800/80 overflow-x-auto scrollbar-none shadow-inner">
            <button
              onClick={() => setActiveTab('webApp')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'webApp'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 border border-blue-400/20'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              <Globe className={`w-4 h-4 ${activeTab === 'webApp' ? 'text-white' : 'text-blue-400'}`} />
              <span>1. Dashboard Web</span>
            </button>

            <button
              onClick={() => setActiveTab('waBot')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'waBot'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 border border-blue-400/20'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              <MessageSquare className={`w-4 h-4 ${activeTab === 'waBot' ? 'text-white' : 'text-emerald-400'}`} />
              <span>2. Simulator WA Bot</span>
            </button>

            {userRole === 'Admin' && (
              <>
                <button
                  onClick={() => setActiveTab('sheets')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    activeTab === 'sheets'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 border border-blue-400/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }`}
                >
                  <Table className={`w-4 h-4 ${activeTab === 'sheets' ? 'text-white' : 'text-purple-400'}`} />
                  <span>3. Database Sheets</span>
                </button>

                <button
                  onClick={() => setActiveTab('code')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    activeTab === 'code'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 border border-blue-400/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }`}
                >
                  <Code2 className={`w-4 h-4 ${activeTab === 'code' ? 'text-white' : 'text-amber-400'}`} />
                  <span>4. Salin Code.gs & Index.html</span>
                </button>
              </>
            )}
          </nav>
        </div>

      </div>

      {/* Modal Pengaturan Logo SIJAKA */}
      {isLogoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200 text-slate-900 font-sans">
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

            <div className="p-5 space-y-5">
              {/* Preview Logo */}
              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="p-1 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-teal-400 shadow-md mb-2">
                  <div className="w-16 h-16 bg-slate-950 rounded-xl flex items-center justify-center font-extrabold text-2xl text-blue-400 overflow-hidden">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Preview Logo" className="w-full h-full object-cover" />
                    ) : (
                      "S"
                    )}
                  </div>
                </div>
                <span className="text-xs text-slate-500 font-medium">Tampilan Logo Saat Ini</span>
              </div>

              {/* Opsi 1: Upload File Gambar */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-blue-600" />
                  Opsi 1: Unggah Gambar Logo Baru
                </label>
                <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-blue-50/50 hover:border-blue-400 transition-all text-xs text-slate-600 font-semibold gap-2">
                  <Upload className="w-4 h-4 text-slate-500" />
                  <span>Pilih File Gambar (PNG / JPG / SVG)</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileUpload} 
                    className="hidden" 
                  />
                </label>
                <span className="text-[10px] text-slate-400 block mt-1">Maksimal ukuran file: 2MB</span>
              </div>

              {/* Opsi 2: Input URL Gambar */}
              <form onSubmit={handleSaveUrl} className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Link className="w-4 h-4 text-indigo-600" />
                  Opsi 2: Menggunakan URL Gambar
                </label>
                <div className="flex gap-2">
                  <input 
                    type="url" 
                    placeholder="https://domain.com/logo.png"
                    value={tempUrlInput}
                    onChange={(e) => setTempUrlInput(e.target.value)}
                    className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono text-slate-800"
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

              {/* Reset Logo */}
              {logoUrl && (
                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={handleResetLogo}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset ke Logo Default (S)
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


