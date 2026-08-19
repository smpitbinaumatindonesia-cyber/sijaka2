import React, { useState } from 'react';
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

export default function App() {
  const [activeTab, setActiveTab] = useState<'webApp' | 'waBot' | 'sheets' | 'code' | 'security' | 'settings'>('webApp');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [userRole, setUserRole] = useState<'Admin' | 'Anggota'>('Anggota');
  const [currentAdmin, setCurrentAdmin] = useState<AdminAccount | null>(null);

  // Executive Shell State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleRoleChangeRequest = (requestedRole: 'Admin' | 'Anggota') => {
    if (requestedRole === 'Admin') {
      if (userRole === 'Admin') {
        return;
      }
      setIsAdminLoginOpen(true);
    } else {
      setUserRole('Anggota');
      setCurrentAdmin(null);
    }
  };

  const handleLoginSuccess = (account: AdminAccount) => {
    setUserRole('Admin');
    setCurrentAdmin(account);
    setIsAdminLoginOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-row selection:bg-blue-600 selection:text-white">
      
      {/* 1. Desktop Executive Sidebar */}
      <ExecutiveSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        userRole={userRole}
      />

      {/* 2. Main Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0 pb-28 md:pb-0 overflow-x-hidden">
        
        {/* Executive Topbar */}
        <ExecutiveTopbar
          userRole={userRole}
          currentAdmin={currentAdmin}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onRequestRoleChange={handleRoleChangeRequest}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Secondary Navigation Ribbon (Tabs) */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenSettings={() => setIsSettingsOpen(true)}
          userRole={userRole}
          setUserRole={handleRoleChangeRequest}
        />

        {/* Main Viewport */}
        <main className="flex-1 p-3 sm:p-6">
          {activeTab === 'webApp' && (
            <WebDashboard 
              userRole={userRole} 
              setUserRole={handleRoleChangeRequest} 
              onOpenWaBotSimulator={() => setActiveTab('waBot')}
            />
          )}
          {activeTab === 'waBot' && <WaBotSimulator />}
          {activeTab === 'sheets' && <DatabaseSimulator userRole={userRole} onRequestAdminLogin={() => setIsAdminLoginOpen(true)} />}
          {activeTab === 'code' && <CodeExporter userRole={userRole} onRequestAdminLogin={() => setIsAdminLoginOpen(true)} />}
          {activeTab === 'security' && <SecurityControlCenter userRole={userRole} onRequestAdminLogin={() => setIsAdminLoginOpen(true)} />}
        </main>

        {/* Footer */}
        <footer className="bg-slate-950 text-slate-500 text-xs py-6 border-t border-slate-900 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-medium">
              <span className="text-white font-bold">SIJAKA</span>
              <span>• Sistem Informasi Jaminan Kematian Jamaah Tahlil</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${userRole === 'Admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>
                Mode: {userRole} {currentAdmin ? `(${currentAdmin.username})` : ''}
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
        setActiveTab={setActiveTab}
        onOpenQuickMenu={() => setIsQuickMenuOpen(true)}
      />

      {/* 4. Floating Action Modal (Mobile & Fast Operations) */}
      <FloatingActionModal
        isOpen={isQuickMenuOpen}
        onClose={() => setIsQuickMenuOpen(false)}
        onOpenLaporKematian={() => {
          setActiveTab('webApp');
        }}
        onOpenInputIuran={() => {
          setActiveTab('webApp');
        }}
        onOpenTambahAnggota={() => {
          setActiveTab('webApp');
        }}
        onSelectSubTab={() => {
          setActiveTab('webApp');
        }}
        onOpenWaBot={() => setActiveTab('waBot')}
        userRole={userRole}
      />

      {/* 5. Fonnte Settings Modal */}
      <FonnteSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* 6. Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* 7. Floating WhatsApp Gateway (Non-intrusive 48-54px) */}
      <FloatingWhatsAppButton
        onOpenSimulator={() => setActiveTab('waBot')}
        userRole={userRole}
      />

    </div>
  );
}

