import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WebDashboard } from './components/WebDashboard';
import { WaBotSimulator } from './components/WaBotSimulator';
import { DatabaseSimulator } from './components/DatabaseSimulator';
import { CodeExporter } from './components/CodeExporter';
import { SecurityControlCenter } from './components/SecurityControlCenter';
import { FonnteSettingsModal } from './components/FonnteSettingsModal';
import { AdminLoginModal, AdminAccount } from './components/AdminLoginModal';
import { ExecutiveSidebar } from './components/ExecutiveSidebar';
import { ExecutiveTopbar } from './components/ExecutiveTopbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { FloatingActionModal } from './components/FloatingActionModal';
import { FloatingWhatsAppButton } from './components/FloatingWhatsAppButton';
import { ProfileModal } from './components/ProfileModal';
import { SijakaErrorBoundary } from './components/SijakaErrorBoundary';
import { SijakaRole } from './types';
import { WifiOff, RefreshCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'webApp' | 'waBot' | 'sheets' | 'code' | 'security' | 'settings'>('webApp');
  const [activeSubTab, setActiveSubTab] = useState<'kematian' | 'iuran' | 'anggota' | 'bukukas' | 'users' | 'layanan' | undefined>(undefined);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<SijakaRole>('Anggota');
  const [currentAdmin, setCurrentAdmin] = useState<AdminAccount | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Executive Shell State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleRoleChangeRequest = (requestedRole: SijakaRole) => {
    if (requestedRole === 'Admin' || requestedRole === 'Super Admin') {
      if (userRole === 'Admin' || userRole === 'Super Admin') {
        return;
      }
      setIsAdminLoginOpen(true);
    } else {
      setUserRole(requestedRole);
      // Auto-populate friendly display name based on role
      if (requestedRole === 'Public') {
        setCurrentAdmin(null);
      } else if (requestedRole === 'Anggota') {
        setCurrentAdmin({
          id_user: 'ANG-001',
          username: 'ahmad',
          passwordHash: '',
          role: 'Anggota',
          nama: 'Ahmad S.'
        });
      } else if (requestedRole === 'Pengurus') {
        setCurrentAdmin({
          id_user: 'Bend1',
          username: 'Imam',
          passwordHash: '',
          role: 'Pengurus',
          nama: 'Budi Santoso'
        });
      } else if (requestedRole === 'Ketua') {
        setCurrentAdmin({
          id_user: 'Ketua',
          username: 'Wardjo',
          passwordHash: '',
          role: 'Ketua',
          nama: 'H. Ahmad'
        });
      }
    }
  };

  const handleLoginSuccess = (account: AdminAccount) => {
    setUserRole(account.role || 'Admin');
    setCurrentAdmin(account);
    setIsAdminLoginOpen(false);
  };

  const handleNavigate = (
    tab: 'webApp' | 'waBot' | 'sheets' | 'code' | 'security', 
    subTab?: 'kematian' | 'iuran' | 'anggota' | 'bukukas'
  ) => {
    setActiveTab(tab);
    if (subTab) {
      setActiveSubTab(subTab);
    }
  };

  const isAdmin = userRole === 'Admin' || userRole === 'Super Admin';

  return (
    <div className="min-h-screen bg-[#050A18] text-slate-100 font-sans antialiased flex flex-row selection:bg-blue-600 selection:text-white">
      
      {/* 1. Desktop Executive Sidebar */}
      <ExecutiveSidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'webApp') {
            setActiveSubTab(undefined);
          }
        }}
        activeSubTab={activeSubTab}
        onSelectSubTab={(subTab) => {
          setActiveTab('webApp');
          setActiveSubTab(subTab);
        }}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        userRole={userRole}
      />

      {/* 2. Main Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0 pb-28 md:pb-0 overflow-x-hidden">
        
        {/* Offline Status Warning Bar */}
        {!isOnline && (
          <div className="bg-amber-600/90 text-white text-xs font-semibold px-4 py-2 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4" />
              <span>Anda sedang offline. Data akan disinkronkan saat koneksi internet kembali normal.</span>
            </div>
            <button
              onClick={() => setIsOnline(navigator.onLine)}
              className="inline-flex items-center gap-1 bg-black/20 hover:bg-black/40 px-2.5 py-1 rounded text-[11px] font-bold"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Periksa Koneksi</span>
            </button>
          </div>
        )}

        {/* Executive Topbar: Search, Notifications, Role-Aware Profile */}
        <ExecutiveTopbar
          userRole={userRole}
          currentAdmin={currentAdmin}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onRequestRoleChange={handleRoleChangeRequest}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onNavigate={handleNavigate}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Secondary Navigation Ribbon (Tabs) - Visible strictly for Admin */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenSettings={() => setIsSettingsOpen(true)}
          userRole={userRole}
          setUserRole={handleRoleChangeRequest}
        />

        {/* Main Viewport with SijakaErrorBoundary */}
        <main className="flex-1 p-3 sm:p-6">
          <SijakaErrorBoundary sectionName="Halaman Utama SIJAKA" userRole={userRole}>
            {activeTab === 'webApp' && (
              <WebDashboard 
                userRole={userRole} 
                setUserRole={handleRoleChangeRequest} 
                onOpenWaBotSimulator={() => setActiveTab('waBot')}
                onOpenProfile={() => setIsProfileModalOpen(true)}
                onOpenSettings={() => setIsSettingsOpen(true)}
                onNavigateTab={(tab) => {
                  setActiveTab(tab);
                  setActiveSubTab(undefined);
                }}
                activeSubTab={activeSubTab}
                onSelectSubTab={setActiveSubTab}
              />
            )}
            {activeTab === 'waBot' && <WaBotSimulator userRole={userRole} onRequestAdminLogin={() => setIsAdminLoginOpen(true)} />}
            {activeTab === 'sheets' && <DatabaseSimulator userRole={userRole} onRequestAdminLogin={() => setIsAdminLoginOpen(true)} />}
            {activeTab === 'code' && <CodeExporter userRole={userRole} onRequestAdminLogin={() => setIsAdminLoginOpen(true)} />}
            {activeTab === 'security' && <SecurityControlCenter userRole={userRole} onRequestAdminLogin={() => setIsAdminLoginOpen(true)} />}
          </SijakaErrorBoundary>
        </main>

        {/* Footer */}
        <footer className="bg-[#030712] text-slate-500 text-xs py-6 border-t border-slate-900 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-medium">
              <span className="text-white font-bold">SIJAKA</span>
              <span>• Sistem Informasi Jaminan Kematian Jamaah Tahlil</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                isAdmin 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                  : userRole === 'Ketua'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                  : userRole === 'Pengurus'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                Role: {userRole} {currentAdmin ? `(${currentAdmin.nama || currentAdmin.username})` : ''}
              </span>
            </div>
            <p className="text-slate-500">
              Google Apps Script + Google Sheets + Fonnte WhatsApp API Integration
            </p>
          </div>
        </footer>

      </div>

      {/* 3. Mobile Bottom Navigation (Visible on mobile screens) */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'webApp') {
            setActiveSubTab(undefined);
          }
        }}
        activeSubTab={activeSubTab}
        onSelectSubTab={(subTab) => {
          setActiveTab('webApp');
          setActiveSubTab(subTab);
        }}
        onOpenQuickMenu={() => setIsQuickMenuOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        userRole={userRole}
      />

      {/* 4. Floating Action Modal (Mobile & Fast Operations) */}
      <FloatingActionModal
        isOpen={isQuickMenuOpen}
        onClose={() => setIsQuickMenuOpen(false)}
        onOpenLaporKematian={() => {
          setActiveTab('webApp');
          setActiveSubTab('kematian');
        }}
        onOpenInputIuran={() => {
          setActiveTab('webApp');
          setActiveSubTab('iuran');
        }}
        onOpenTambahAnggota={() => {
          setActiveTab('webApp');
          setActiveSubTab('anggota');
        }}
        onSelectSubTab={(subTab) => {
          setActiveTab('webApp');
          setActiveSubTab(subTab);
        }}
        onOpenWaBot={() => setActiveTab('waBot')}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        userRole={userRole}
      />

      {/* 5. Member Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userRole={userRole}
        userName={currentAdmin?.nama}
        onSwitchRole={handleRoleChangeRequest}
      />

      {/* 6. Production Configuration Modal (Admin & Super Admin Only) */}
      <FonnteSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userRole={userRole}
      />

      {/* 7. Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* 8. Floating WhatsApp Gateway (Non-intrusive 48-54px) */}
      <FloatingWhatsAppButton
        onOpenSimulator={() => setActiveTab('waBot')}
        userRole={userRole as any}
      />

    </div>
  );
}
