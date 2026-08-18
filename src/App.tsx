import React, { useState } from 'react';
import { Header } from './components/Header';
import { WebDashboard } from './components/WebDashboard';
import { WaBotSimulator } from './components/WaBotSimulator';
import { DatabaseSimulator } from './components/DatabaseSimulator';
import { CodeExporter } from './components/CodeExporter';
import { SecurityControlCenter } from './components/SecurityControlCenter';
import { FonnteSettingsModal } from './components/FonnteSettingsModal';
import { AdminLoginModal, AdminAccount } from './components/AdminLoginModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'webApp' | 'waBot' | 'sheets' | 'code' | 'security' | 'settings'>('webApp');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [userRole, setUserRole] = useState<'Admin' | 'Anggota'>('Anggota');
  const [currentAdmin, setCurrentAdmin] = useState<AdminAccount | null>(null);

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
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased flex flex-col selection:bg-blue-500 selection:text-white">
      
      {/* Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        userRole={userRole}
        setUserRole={handleRoleChangeRequest}
      />

      {/* Main View Port */}
      <main className="flex-1 pb-12">
        {activeTab === 'webApp' && <WebDashboard userRole={userRole} setUserRole={handleRoleChangeRequest} />}
        {activeTab === 'waBot' && <WaBotSimulator />}
        {activeTab === 'sheets' && <DatabaseSimulator userRole={userRole} onRequestAdminLogin={() => setIsAdminLoginOpen(true)} />}
        {activeTab === 'code' && <CodeExporter userRole={userRole} onRequestAdminLogin={() => setIsAdminLoginOpen(true)} />}
        {activeTab === 'security' && <SecurityControlCenter userRole={userRole} onRequestAdminLogin={() => setIsAdminLoginOpen(true)} />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="text-white font-bold">SIJAKA</span>
            <span>• Sistem Informasi Jaminan Kematian Anggota</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${userRole === 'Admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>
              Mode: {userRole} {currentAdmin ? `(${currentAdmin.username})` : ''}
            </span>
          </div>
          <p className="text-slate-500">
            Google Apps Script + Google Sheets + Fonnte WhatsApp API Integration
          </p>
        </div>
      </footer>

      {/* Fonnte Settings Modal */}
      <FonnteSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={handleLoginSuccess}
      />

    </div>
  );
}

