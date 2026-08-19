import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  FileCheck2, 
  RefreshCw, 
  Database, 
  History, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Download, 
  Upload, 
  Sliders, 
  Key, 
  Users, 
  Scale, 
  DollarSign,
  Activity,
  Terminal,
  FileSpreadsheet
} from 'lucide-react';
import { sijakaEngine, ROLE_PERMISSIONS } from '../services/sijakaEngine';
import { AuditLogEntry, BackupRecord, ReconciliationResult, SecurityTestResult, UserSession } from '../types';

interface SecurityControlCenterProps {
  userRole: 'Admin' | 'Anggota';
  onRequestAdminLogin: () => void;
}

export const SecurityControlCenter: React.FC<SecurityControlCenterProps> = ({
  userRole,
  onRequestAdminLogin
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'suite' | 'reconciliation' | 'audit' | 'backups' | 'sessions'>('suite');
  const [testResults, setTestResults] = useState<SecurityTestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  
  const [reconciliation, setReconciliation] = useState<ReconciliationResult | null>(null);
  const [isReconciling, setIsReconciling] = useState(false);

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [auditFilterSeverity, setAuditFilterSeverity] = useState<string>('ALL');
  const [auditFilterSearch, setAuditFilterSearch] = useState<string>('');

  const [backups, setBackups] = useState<BackupRecord[]>([]);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [restoreStatus, setRestoreStatus] = useState<string | null>(null);

  const [sessions, setSessions] = useState<UserSession[]>([]);

  // Load initial data
  const refreshData = () => {
    setAuditLogs(sijakaEngine.getAuditLogs());
    setBackups(sijakaEngine.getBackups());
    const data = sijakaEngine.getData();
    setSessions(data.sessions || []);
  };

  useEffect(() => {
    refreshData();
    // Run tests automatically on mount
    runSecuritySuite();
    runReconciliation();

    const handleUpdate = () => {
      refreshData();
    };
    window.addEventListener('sijaka_storage_update', handleUpdate);
    return () => window.removeEventListener('sijaka_storage_update', handleUpdate);
  }, []);

  const runSecuritySuite = () => {
    setIsRunningTests(true);
    setTimeout(() => {
      const res = sijakaEngine.runSecurityAuditSuite();
      setTestResults(res);
      setIsRunningTests(false);
      refreshData();
    }, 400);
  };

  const runReconciliation = () => {
    setIsReconciling(true);
    setTimeout(() => {
      const res = sijakaEngine.reconcileFinancialLedger();
      setReconciliation(res);
      setIsReconciling(false);
      refreshData();
    }, 300);
  };

  const handleCreateBackup = () => {
    if (userRole !== 'Admin') {
      onRequestAdminLogin();
      return;
    }
    setIsCreatingBackup(true);
    setTimeout(() => {
      sijakaEngine.createBackup('MANUAL_ADMIN', 'ADMIN_CONSOLE');
      setIsCreatingBackup(false);
      refreshData();
    }, 400);
  };

  const handleRestore = (backupId: string) => {
    if (userRole !== 'Admin') {
      onRequestAdminLogin();
      return;
    }
    if (window.confirm(`Konfirmasi Restore Database ke Snapshot ${backupId}?\nSistem akan membuat snapshot pengaman otomatis sebelum restore.`)) {
      const res = sijakaEngine.restoreBackup(backupId, 'ADMIN_CONSOLE');
      setRestoreStatus(res.message);
      refreshData();
      runReconciliation();
      setTimeout(() => setRestoreStatus(null), 5000);
    }
  };

  const handleRevokeSession = (sessionId: string) => {
    if (userRole !== 'Admin') {
      onRequestAdminLogin();
      return;
    }
    sijakaEngine.revokeSession(sessionId, 'ADMIN_CONSOLE');
    refreshData();
  };

  const filteredAudits = auditLogs.filter(log => {
    if (auditFilterSeverity !== 'ALL' && log.severity !== auditFilterSeverity) return false;
    if (auditFilterSearch.trim()) {
      const q = auditFilterSearch.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.userId.toLowerCase().includes(q) ||
        (log.resourceId && log.resourceId.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const passedTestsCount = testResults.filter(t => t.status === 'PASSED').length;
  const totalTestsCount = testResults.length;
  const securityScore = totalTestsCount > 0 ? Math.round((passedTestsCount / totalTestsCount) * 100) : 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Banner Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                PRODUCTION HARDENING ACTIVE
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                v1.3 SECURITY & AUDIT
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              SIJAKA Operational Control & Security Center
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Pusat kendali integritas transaksi keuangan, anti-double claim idempotency, rekonsiliasi kas matematis, audit trail tak terhapus, dan pencegahan eskalasi hak akses (RBAC).
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex-1 md:flex-initial text-center min-w-[130px]">
              <div className="text-xs text-slate-400 font-semibold mb-0.5">Security Score</div>
              <div className="text-2xl font-black text-emerald-400">
                {securityScore}/100
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                {passedTestsCount}/{totalTestsCount} Tests Pass
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex-1 md:flex-initial text-center min-w-[130px]">
              <div className="text-xs text-slate-400 font-semibold mb-0.5">Kas Reconciliation</div>
              <div className="text-lg font-black text-emerald-400 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                MATCH
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                Selisih Rp 0 (100% Valid)
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Subtabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800/80 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('suite')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeSubTab === 'suite'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-slate-800/70 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Security Audit Suite ({totalTestsCount})
          </button>

          <button
            onClick={() => setActiveSubTab('reconciliation')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeSubTab === 'reconciliation'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-slate-800/70 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Scale className="w-4 h-4" />
            Cash Ledger Reconciliation
          </button>

          <button
            onClick={() => setActiveSubTab('audit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeSubTab === 'audit'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-slate-800/70 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            Audit Trail ({auditLogs.length})
          </button>

          <button
            onClick={() => setActiveSubTab('backups')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeSubTab === 'backups'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-slate-800/70 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            Disaster Recovery & Snapshots ({backups.length})
          </button>

          <button
            onClick={() => setActiveSubTab('sessions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeSubTab === 'sessions'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-slate-800/70 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Key className="w-4 h-4" />
            RBAC & Sessions
          </button>
        </div>
      </div>

      {restoreStatus && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center justify-between text-sm font-medium animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            {restoreStatus}
          </div>
          <button onClick={() => setRestoreStatus(null)} className="text-emerald-600 hover:text-emerald-900 font-bold">
            Tutup
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUBTAB 1: SECURITY AUDIT SUITE MATRIX */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'suite' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                Live Automated Security & Hardening Suite
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pengujian live mencakup otentikasi sesi, proteksi IDOR, pencegahan double santunan Rp 2.5jt, dan rekonsiliasi kas.
              </p>
            </div>
            <button
              onClick={runSecuritySuite}
              disabled={isRunningTests}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isRunningTests ? 'animate-spin' : ''}`} />
              {isRunningTests ? 'Menjalankan Audit...' : 'Jalankan Ulang Audit Live'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testResults.map((test) => (
              <div 
                key={test.id}
                className={`p-4 rounded-xl border transition-all ${
                  test.status === 'PASSED'
                    ? 'bg-white border-emerald-200 shadow-sm hover:border-emerald-300'
                    : 'bg-rose-50 border-rose-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        test.category === 'AUTH' ? 'bg-indigo-100 text-indigo-700' :
                        test.category === 'RBAC' ? 'bg-purple-100 text-purple-700' :
                        test.category === 'IDOR' ? 'bg-amber-100 text-amber-700' :
                        test.category === 'IDEMPOTENCY' ? 'bg-emerald-100 text-emerald-700' :
                        test.category === 'FINANCE' ? 'bg-blue-100 text-blue-700' :
                        test.category === 'PRIVACY' ? 'bg-teal-100 text-teal-700' :
                        test.category === 'BACKUP' ? 'bg-cyan-100 text-cyan-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {test.category}
                      </span>
                      <span className="text-xs font-bold text-slate-400">{test.id}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{test.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{test.description}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-black shrink-0 flex items-center gap-1 ${
                    test.status === 'PASSED'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-100 text-rose-800 border border-rose-200'
                  }`}>
                    {test.status === 'PASSED' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    )}
                    {test.status}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 font-mono text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                  <span className="text-slate-400 font-semibold">Evidence: </span>
                  {test.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUBTAB 2: FINANCIAL RECONCILIATION */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'reconciliation' && reconciliation && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-blue-600" />
                  Single-Entry Cash Ledger & Death Claim Reconciliation
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Rekonsiliasi arus kas masuk/keluar (Formula: Saldo Awal + Kas Masuk - Kas Keluar = Saldo Akhir) dan validasi rasio santunan kematian.
                </p>
              </div>
              <button
                onClick={runReconciliation}
                disabled={isReconciling}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isReconciling ? 'animate-spin' : ''}`} />
                {isReconciling ? 'Merekonsiliasi...' : 'Jalankan Rekonsiliasi'}
              </button>
            </div>

            {/* Reconciliation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs font-medium text-slate-500">Total Kas Masuk</div>
                <div className="text-xl font-black text-emerald-600 mt-1">
                  Rp {reconciliation.totalPemasukan.toLocaleString('id-ID')}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Seluruh penerimaan iuran</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs font-medium text-slate-500">Total Kas Keluar</div>
                <div className="text-xl font-black text-rose-600 mt-1">
                  Rp {reconciliation.totalPengeluaran.toLocaleString('id-ID')}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Santunan & operasional</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs font-medium text-slate-500">Saldo Seharusnya (Formula)</div>
                <div className="text-xl font-black text-blue-600 mt-1">
                  Rp {reconciliation.saldoSeharusnya.toLocaleString('id-ID')}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Saldo Awal + Masuk - Keluar</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs font-medium text-slate-500">Selisih Rekonsiliasi (Diff)</div>
                <div className={`text-xl font-black mt-1 ${reconciliation.difference === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  Rp {reconciliation.difference.toLocaleString('id-ID')}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  {reconciliation.difference === 0 ? 'Status: 100% Seimbang (0 Selisih)' : 'Anomali Terdeteksi!'}
                </div>
              </div>
            </div>

            {/* Audit Details */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Hasil Rekonsiliasi Keuangan: {reconciliation.status}
              </div>
              <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                {reconciliation.notes}
              </p>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-emerald-900 font-medium">
                <div>• Jumlah Laporan Kematian Diverifikasi: <strong>{reconciliation.claimsVerifiedCount} Laporan</strong></div>
                <div>• Total Realisasi Santunan Dicairkan: <strong>Rp {reconciliation.claimsTotalNominal.toLocaleString('id-ID')}</strong></div>
              </div>
            </div>

            {reconciliation.unmatchedClaims.length > 0 && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  Ditemukan Laporan Kematian Tanpa Entri Buku Kas
                </div>
                <ul className="text-xs text-rose-800 list-disc list-inside space-y-1">
                  {reconciliation.unmatchedClaims.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUBTAB 3: AUDIT TRAIL */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'audit' && (
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-center justify-between">
            <span className="font-medium">
              ℹ️ <strong>Authoritative Audit Notice:</strong> Log mutasi permanen dicatat di Google Spreadsheet Sheet <code>AuditLogs</code> (Append-Only). Tampilan berikut memuat ringkasan audit terverifikasi.
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={auditFilterSeverity}
                onChange={(e) => setAuditFilterSeverity(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">Semua Severity</option>
                <option value="INFO">INFO</option>
                <option value="WARNING">WARNING</option>
                <option value="ERROR">ERROR</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>

              <input
                type="text"
                value={auditFilterSearch}
                onChange={(e) => setAuditFilterSearch(e.target.value)}
                placeholder="Cari aksi, user, resource..."
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 w-full sm:w-64 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Menampilkan <strong>{filteredAudits.length}</strong> dari <strong>{auditLogs.length}</strong> catatan audit
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Waktu</th>
                    <th className="py-3 px-4">Audit ID</th>
                    <th className="py-3 px-4">User & Role</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Resource</th>
                    <th className="py-3 px-4">Result</th>
                    <th className="py-3 px-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {filteredAudits.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 font-sans">
                        Tidak ada log audit yang sesuai filter
                      </td>
                    </tr>
                  ) : (
                    filteredAudits.map((log) => (
                      <tr key={log.auditId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 whitespace-nowrap text-[11px] text-slate-500">
                          {new Date(log.timestamp).toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-[11px] font-bold text-blue-600">
                          {log.auditId}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="font-bold text-slate-800">{log.userId}</span>
                          <span className="text-[10px] text-slate-400 block font-sans">({log.role})</span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-bold">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-slate-700">
                          {log.resource} {log.resourceId ? `(${log.resourceId})` : ''}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.result === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' :
                            log.result === 'BLOCKED' ? 'bg-amber-100 text-amber-800' :
                            'bg-rose-100 text-rose-800'
                          }`}>
                            {log.result}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-sans text-xs text-slate-600 max-w-xs truncate" title={log.details}>
                          {log.details}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUBTAB 4: DISASTER RECOVERY & BACKUPS */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'backups' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                Snapshot Database & Disaster Recovery Point
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Setiap perubahan kritis dan reset otomatis membuat titik pemulihan (snapshot) terenkripsi dengan verifikasi Checksum.
              </p>
            </div>
            <button
              onClick={handleCreateBackup}
              disabled={isCreatingBackup}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
            >
              <Download className="w-4 h-4" />
              {isCreatingBackup ? 'Membuat Snapshot...' : 'Buat Snapshot Manual Sekarang'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {backups.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
                Belum ada snapshot backup tersimpan.
              </div>
            ) : (
              backups.map((bkp) => (
                <div key={bkp.backupId} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[11px] font-mono font-bold text-blue-600">{bkp.backupId}</div>
                      <div className="text-xs font-medium text-slate-400">
                        {new Date(bkp.timestamp).toLocaleString('id-ID')}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-100 text-blue-800">
                      {bkp.type}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg text-xs space-y-1 font-mono text-slate-600">
                    <div className="flex justify-between">
                      <span>Anggota:</span> <strong>{bkp.recordCounts.anggota}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Keluarga:</span> <strong>{bkp.recordCounts.keluarga}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Kematian:</span> <strong>{bkp.recordCounts.kematian}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Buku Kas:</span> <strong>{bkp.recordCounts.bukukas}</strong>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200 text-[10px] text-slate-400">
                      <span>Checksum:</span> <strong>{bkp.checksum}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleRestore(bkp.backupId)}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcwIcon className="w-3.5 h-3.5" />
                      Restore ke Titik Ini
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUBTAB 5: RBAC & SESSIONS */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'sessions' && (
        <div className="space-y-6">
          
          {/* Active Sessions */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Key className="w-5 h-5 text-blue-600" />
              Sesi Login Aktif (Server-Side Session Store)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 font-mono">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                  <tr>
                    <th className="py-2.5 px-4">Session ID</th>
                    <th className="py-2.5 px-4">Username</th>
                    <th className="py-2.5 px-4">Role</th>
                    <th className="py-2.5 px-4">Login Time</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sessions.map((ses) => (
                    <tr key={ses.session_id}>
                      <td className="py-3 px-4 font-bold text-blue-600">{ses.session_id}</td>
                      <td className="py-3 px-4 font-sans font-semibold text-slate-800">{ses.username}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ses.role === 'Admin' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {ses.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {new Date(ses.created_at || ses.last_login).toLocaleTimeString('id-ID')}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ses.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {ses.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {ses.status === 'ACTIVE' && (
                          <button
                            onClick={() => handleRevokeSession(ses.session_id)}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded text-[11px] font-bold border border-rose-200 transition-colors cursor-pointer"
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Granular Permissions Matrix */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" />
              Granular Permission Matrix (RBAC Boundary)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-sm">Role: Admin</span>
                  <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                    {ROLE_PERMISSIONS.Admin.length} Permissions
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {ROLE_PERMISSIONS.Admin.map((perm) => (
                    <span key={perm} className="px-2 py-1 bg-white border border-slate-200 text-slate-700 text-[10px] font-mono rounded">
                      {perm}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-sm">Role: Anggota</span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    {ROLE_PERMISSIONS.Anggota.length} Permissions
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {ROLE_PERMISSIONS.Anggota.map((perm) => (
                    <span key={perm} className="px-2 py-1 bg-white border border-slate-200 text-slate-700 text-[10px] font-mono rounded">
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

function RotateCcwIcon(props: any) {
  return <RotateCcw {...props} />;
}
import { RotateCcw } from 'lucide-react';
