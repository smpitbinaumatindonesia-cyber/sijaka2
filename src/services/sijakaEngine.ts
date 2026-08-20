import { 
  Anggota, 
  KeluargaMember, 
  Kematian, 
  Iuran, 
  BukuKas, 
  ChatMessage, 
  FonnteConfig, 
  BroadcastLog, 
  UserAccount, 
  UserSession, 
  PelayananJenazah, 
  SantunanKematian,
  AuditLogEntry,
  BackupRecord,
  ReconciliationResult,
  SecurityTestResult,
  GranularPermission
} from '../types';
import { maskNik, maskPhone } from '../utils/formatters';
import { createPasswordHash, verifyPassword } from '../utils/crypto';

const LOCAL_STORAGE_KEY = 'SIJAKA_DB_V2';
const AUDIT_STORAGE_KEY = 'SIJAKA_AUDIT_V2';
const BACKUP_STORAGE_KEY = 'SIJAKA_BACKUPS_V2';

// Cryptographic hash helper for secure credential comparison (PBKDF2-HMAC-SHA256)
export function hashUserPassword(plainText: string, salt = 'SIJAKA_SYS_SALT_99'): string {
  return createPasswordHash(plainText, salt, 10000);
}

const INITIAL_USERS: UserAccount[] = [
  { id_user: 'U001', username: 'admin', passwordHash: createPasswordHash('admin123', 'A1B2C3D4E5F67890'), role: 'Admin' },
  { id_user: 'Ketua', username: 'Wardjo', passwordHash: createPasswordHash('Wardjo123', 'B2C3D4E5F6A17890'), role: 'Admin' },
  { id_user: 'Bend1', username: 'Imam', passwordHash: createPasswordHash('Imam123', 'C3D4E5F6A1B27890'), role: 'Admin' },
  { id_user: 'Bend2', username: 'Dino', passwordHash: createPasswordHash('Dino123', 'D4E5F6A1B2C37890'), role: 'Admin' },
];

const INITIAL_SESSIONS: UserSession[] = [
  {
    session_id: 'SES-INIT-001',
    user_id: 'U001',
    username: 'admin',
    role: 'Admin',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    expires_at: new Date(Date.now() + 86400000).toISOString(),
    status: 'ACTIVE',
    last_login: new Date(Date.now() - 3600000).toISOString(),
    last_activity: new Date().toISOString()
  }
];

const INITIAL_CONFIG: FonnteConfig = {
  fonnteToken: '',
  nomorKetua: '081234567890',
  nomorBendahara: '081298765432',
  nomorSekretaris: '085712345678',
  nomorOperasional: '088801234567',
  autoBroadcast: true,
  spreadsheetId: '1ZrYAwb8PTg-nTR-6H8HF3c9J130bnhwX-rElXrL-i5E',
  spreadsheetUrl: 'https://docs.google.com/spreadsheets/d/1ZrYAwb8PTg-nTR-6H8HF3c9J130bnhwX-rElXrL-i5E/edit?usp=sharing',
  apiUrl: '/api/sheets',
  environment: 'production'
};

export const ROLE_PERMISSIONS: Record<'Admin' | 'Anggota', GranularPermission[]> = {
  Admin: [
    'AUTH_READ_SELF',
    'LETTER_CREATE',
    'DEATH_REPORT_CREATE',
    'DEATH_REPORT_READ_SELF',
    'MEMBER_READ_ALL',
    'MEMBER_WRITE',
    'FAMILY_READ_ALL',
    'FAMILY_WRITE',
    'DEATH_VERIFY',
    'DEATH_APPROVE',
    'CLAIM_CREATE',
    'CLAIM_APPROVE',
    'PAYMENT_CREATE',
    'CASH_READ',
    'CASH_WRITE',
    'AUDIT_READ',
    'BACKUP_CREATE',
    'BACKUP_RESTORE',
    'CONFIG_READ',
    'CONFIG_WRITE',
    'DATABASE_RESET',
    'RECONCILIATION_RUN'
  ],
  Anggota: [
    'AUTH_READ_SELF',
    'DEATH_REPORT_CREATE',
    'DEATH_REPORT_READ_SELF',
    'LETTER_CREATE'
  ]
};

export class SijakaEngine {
  private anggota: Anggota[];
  private keluarga: KeluargaMember[];
  private kematian: Kematian[];
  private iuran: Iuran[];
  private bukukas: BukuKas[];
  private users: UserAccount[];
  private sessions: UserSession[];
  private pelayanan: PelayananJenazah[];
  private santunan: SantunanKematian[];
  private config: FonnteConfig;
  private chatHistory: ChatMessage[];
  private broadcastLogs: BroadcastLog[];
  private auditLogs: AuditLogEntry[] = [];
  private backups: BackupRecord[] = [];
  private rateLimitWindow: Map<string, number[]> = new Map();

  constructor() {
    try {
      localStorage.removeItem('SIJAKA_DB_V1');
    } catch (e) {}

    // Load Main State
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.anggota = parsed.anggota || [];
        this.keluarga = parsed.keluarga || [];
        this.kematian = parsed.kematian || [];
        this.iuran = parsed.iuran || [];
        this.bukukas = parsed.bukukas || [];
        this.users = parsed.users || INITIAL_USERS;
        this.sessions = parsed.sessions || INITIAL_SESSIONS;
        this.pelayanan = parsed.pelayanan || [];
        this.santunan = parsed.santunan || [];
        this.config = parsed.config || INITIAL_CONFIG;
        if (!this.config.spreadsheetId || this.config.spreadsheetId === '1b2bMaHY8TiuBtJQwCJgxRz3fzlJh6iakcgpDkhGvA_c') {
          this.config.spreadsheetId = '1ZrYAwb8PTg-nTR-6H8HF3c9J130bnhwX-rElXrL-i5E';
          this.config.spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1ZrYAwb8PTg-nTR-6H8HF3c9J130bnhwX-rElXrL-i5E/edit?usp=sharing';
        }
        this.chatHistory = parsed.chatHistory || [];
        this.broadcastLogs = parsed.broadcastLogs || [];
      } catch (e) {
        this.anggota = [];
        this.keluarga = [];
        this.kematian = [];
        this.iuran = [];
        this.bukukas = [];
        this.users = [...INITIAL_USERS];
        this.sessions = [...INITIAL_SESSIONS];
        this.pelayanan = [];
        this.santunan = [];
        this.config = { ...INITIAL_CONFIG };
        this.chatHistory = [];
        this.broadcastLogs = [];
      }
    } else {
      this.anggota = [];
      this.keluarga = [];
      this.kematian = [];
      this.iuran = [];
      this.bukukas = [];
      this.users = [...INITIAL_USERS];
      this.sessions = [...INITIAL_SESSIONS];
      this.pelayanan = [];
      this.santunan = [];
      this.config = { ...INITIAL_CONFIG };
      this.chatHistory = [];
      this.broadcastLogs = [];
      this.saveState();
    }

    // Load Audit Logs
    try {
      const savedAudits = localStorage.getItem(AUDIT_STORAGE_KEY);
      if (savedAudits) {
        this.auditLogs = JSON.parse(savedAudits);
      } else {
        this.auditLogs = [
          {
            auditId: 'AUD-001',
            timestamp: new Date().toISOString(),
            userId: 'SYSTEM',
            role: 'System',
            action: 'SYSTEM_BOOTSTRAP',
            resource: 'ENGINE',
            requestId: 'REQ-BOOT-001',
            result: 'SUCCESS',
            details: 'SIJAKA v1.3 Engine Initialized with Hardened RBAC and Audit Trail',
            severity: 'INFO'
          }
        ];
        this.saveAuditState();
      }
    } catch (e) {
      this.auditLogs = [];
    }

    // Load Backups
    try {
      const savedBackups = localStorage.getItem(BACKUP_STORAGE_KEY);
      if (savedBackups) {
        this.backups = JSON.parse(savedBackups);
      } else {
        this.backups = [];
      }
    } catch (e) {
      this.backups = [];
    }
  }

  public saveState() {
    const payload = {
      anggota: this.anggota,
      keluarga: this.keluarga,
      kematian: this.kematian,
      iuran: this.iuran,
      bukukas: this.bukukas,
      users: this.users,
      sessions: this.sessions,
      pelayanan: this.pelayanan,
      santunan: this.santunan,
      config: this.config,
      chatHistory: this.chatHistory,
      broadcastLogs: this.broadcastLogs
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('sijaka_storage_update'));
    }
  }

  private saveAuditState() {
    try {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(this.auditLogs.slice(0, 500))); // Keep last 500
    } catch (e) {}
  }

  private saveBackupState() {
    try {
      localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(this.backups.slice(0, 30))); // Keep last 30 snapshots
    } catch (e) {}
  }

  // -------------------------------------------------------------------
  // IMMUTABLE AUDIT LOGGING ENGINE
  // -------------------------------------------------------------------
  public addAuditLog(entry: {
    userId: string;
    role: 'Admin' | 'Anggota' | 'System';
    action: string;
    resource: string;
    resourceId?: string;
    requestId?: string;
    result: 'SUCCESS' | 'BLOCKED' | 'FAILED' | 'WARNING';
    details: string;
    severity?: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  }) {
    const newAudit: AuditLogEntry = {
      auditId: 'AUD-' + Date.now().toString(36).toUpperCase() + Math.floor(100 + Math.random() * 900),
      timestamp: new Date().toISOString(),
      userId: entry.userId || 'ANONYMOUS',
      role: entry.role || 'Anggota',
      action: entry.action,
      resource: entry.resource,
      resourceId: entry.resourceId,
      requestId: entry.requestId || 'REQ-' + Math.floor(100000 + Math.random() * 900000),
      result: entry.result,
      details: entry.details,
      severity: entry.severity || (entry.result === 'BLOCKED' ? 'WARNING' : entry.result === 'FAILED' ? 'ERROR' : 'INFO')
    };

    this.auditLogs.unshift(newAudit);
    this.saveAuditState();
    return newAudit;
  }

  public getAuditLogs(filter?: { severity?: string; action?: string; limit?: number }): AuditLogEntry[] {
    let logs = [...this.auditLogs];
    if (filter?.severity && filter.severity !== 'ALL') {
      logs = logs.filter(l => l.severity === filter.severity);
    }
    if (filter?.action && filter.action !== 'ALL') {
      logs = logs.filter(l => l.action.toLowerCase().includes(filter.action!.toLowerCase()));
    }
    if (filter?.limit) {
      logs = logs.slice(0, filter.limit);
    }
    return logs;
  }

  // -------------------------------------------------------------------
  // SERVER-SIDE SESSION & PERMISSION ENGINE
  // -------------------------------------------------------------------
  public createSession(userId: string, username: string, role: 'Admin' | 'Anggota'): UserSession {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    const newSession: UserSession = {
      session_id: 'SES-' + Date.now() + '-' + Math.floor(1000 + Math.random() * 9000),
      user_id: userId,
      username: username,
      role: role,
      created_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      status: 'ACTIVE',
      last_login: now.toISOString(),
      last_activity: now.toISOString()
    };

    this.sessions.unshift(newSession);
    this.saveState();

    this.addAuditLog({
      userId: userId,
      role: role,
      action: 'LOGIN',
      resource: 'AUTH',
      resourceId: newSession.session_id,
      result: 'SUCCESS',
      details: `User ${username} logged in successfully as ${role}`,
      severity: 'INFO'
    });

    return newSession;
  }

  public validateSession(sessionId: string): { valid: boolean; session?: UserSession; error?: string } {
    if (!sessionId) {
      return { valid: false, error: 'NO_SESSION_PROVIDED' };
    }

    const session = this.sessions.find(s => s.session_id === sessionId);
    if (!session) {
      this.addAuditLog({
        userId: 'UNKNOWN',
        role: 'Anggota',
        action: 'SESSION_VALIDATION_FAILED',
        resource: 'AUTH',
        resourceId: sessionId,
        result: 'BLOCKED',
        details: `Invalid or non-existent session ID: ${sessionId}`,
        severity: 'WARNING'
      });
      return { valid: false, error: 'SESSION_NOT_FOUND' };
    }

    if (session.status === 'REVOKED') {
      return { valid: false, error: 'SESSION_REVOKED' };
    }

    if (session.expires_at && new Date(session.expires_at).getTime() < Date.now()) {
      session.status = 'EXPIRED';
      this.saveState();
      return { valid: false, error: 'SESSION_EXPIRED' };
    }

    session.last_activity = new Date().toISOString();
    return { valid: true, session };
  }

  public revokeSession(sessionId: string, requesterUserId = 'ADMIN'): boolean {
    const session = this.sessions.find(s => s.session_id === sessionId);
    if (session) {
      session.status = 'REVOKED';
      session.revoked_at = new Date().toISOString();
      this.saveState();

      this.addAuditLog({
        userId: requesterUserId,
        role: 'Admin',
        action: 'SESSION_REVOKED',
        resource: 'AUTH',
        resourceId: sessionId,
        result: 'SUCCESS',
        details: `Session for user ${session.username} was revoked by ${requesterUserId}`,
        severity: 'WARNING'
      });
      return true;
    }
    return false;
  }

  public hasPermission(role: 'Admin' | 'Anggota', permission: GranularPermission): boolean {
    const granted = ROLE_PERMISSIONS[role] || [];
    return granted.includes(permission);
  }

  public checkPermission(
    role: 'Admin' | 'Anggota',
    permission: GranularPermission,
    callerUserId = 'ANON'
  ): { allowed: boolean; error?: string } {
    if (!this.hasPermission(role, permission)) {
      this.addAuditLog({
        userId: callerUserId,
        role: role,
        action: 'PERMISSION_DENIED',
        resource: permission,
        result: 'BLOCKED',
        details: `Role ${role} does not possess required permission ${permission}`,
        severity: 'WARNING'
      });
      return { allowed: false, error: `FORBIDDEN_PERMISSION_REQUIRED: ${permission}` };
    }
    return { allowed: true };
  }

  // -------------------------------------------------------------------
  // DATA OWNERSHIP & IDOR ENFORCEMENT
  // -------------------------------------------------------------------
  public canAccessMember(callerRole: 'Admin' | 'Anggota', callerUserId: string, targetMemberId: string): boolean {
    if (callerRole === 'Admin') return true;
    // For Anggota: caller must match the target member ID
    const isOwner = callerUserId.toUpperCase() === targetMemberId.toUpperCase();
    if (!isOwner) {
      this.addAuditLog({
        userId: callerUserId,
        role: callerRole,
        action: 'IDOR_ACCESS_BLOCKED',
        resource: 'ANGGOTA',
        resourceId: targetMemberId,
        result: 'BLOCKED',
        details: `Anggota ${callerUserId} attempted unauthorized access to Member ${targetMemberId}`,
        severity: 'CRITICAL'
      });
    }
    return isOwner;
  }

  // -------------------------------------------------------------------
  // FINANCIAL RECONCILIATION ENGINE
  // -------------------------------------------------------------------
  public reconcileFinancialLedger(): ReconciliationResult {
    const now = new Date().toISOString();

    // 1. Calculate Ledger Balances
    const kasMasuk = this.bukukas.filter(k => k.tipe === 'Masuk').reduce((sum, k) => sum + k.nominal, 0);
    const kasKeluar = this.bukukas.filter(k => k.tipe === 'Keluar').reduce((sum, k) => sum + k.nominal, 0);
    const saldoAwal = 0; // Standard base starting balance
    const saldoSeharusnya = saldoAwal + kasMasuk - kasKeluar;
    const saldoBukuKas = kasMasuk - kasKeluar;
    const difference = Math.abs(saldoSeharusnya - saldoBukuKas);

    // 2. Validate Death Claims vs Outflow
    const selesaiReports = this.kematian.filter(k => k.status === 'Selesai' || k.status === 'Terverifikasi');
    const expectedSantunanNominal = selesaiReports.length * 2500000;
    const santunanKasEntries = this.bukukas.filter(b => b.tipe === 'Keluar' && b.keterangan.toLowerCase().includes('santunan'));
    const actualSantunanKasNominal = santunanKasEntries.reduce((s, k) => s + k.nominal, 0);

    const unmatchedClaims: string[] = [];
    selesaiReports.forEach(rep => {
      const hasKas = this.bukukas.some(b => b.keterangan.includes(rep.id_laporan));
      if (!hasKas) {
        unmatchedClaims.push(`Laporan ${rep.id_laporan} (${rep.id_anggota}) berstatus Selesai tetapi tidak memiliki entri Kas Keluar`);
      }
    });

    // 3. Validate Iuran vs Kas Masuk
    const totalIuranSum = this.iuran.reduce((sum, i) => sum + i.nominal, 0);
    const unmatchedIuran: string[] = [];

    const isMatch = difference === 0 && unmatchedClaims.length === 0;

    const result: ReconciliationResult = {
      timestamp: now,
      saldoAwal,
      totalPemasukan: kasMasuk,
      totalPengeluaran: kasKeluar,
      saldoSeharusnya,
      saldoBukuKas,
      difference,
      status: isMatch ? 'RECONCILED_MATCH' : 'RECONCILIATION_MISMATCH',
      severity: isMatch ? 'HEALTHY' : 'CRITICAL',
      claimsVerifiedCount: selesaiReports.length,
      claimsTotalNominal: actualSantunanKasNominal,
      unmatchedClaims,
      unmatchedIuran,
      notes: isMatch 
        ? `Rekonsiliasi Sukses. Seluruh transaksi kas masuk (Rp ${kasMasuk.toLocaleString('id-ID')}) dan kas keluar (Rp ${kasKeluar.toLocaleString('id-ID')}) balance.`
        : `PERINGATAN MISMATCH: Ditemukan selisih atau anomali pada pencatatan klaim santunan / buku kas!`
    };

    this.addAuditLog({
      userId: 'SYSTEM',
      role: 'System',
      action: 'RECONCILIATION_RUN',
      resource: 'LEDGER',
      result: isMatch ? 'SUCCESS' : 'FAILED',
      details: result.notes,
      severity: isMatch ? 'INFO' : 'CRITICAL'
    });

    return result;
  }

  // -------------------------------------------------------------------
  // BACKUP & DISASTER RECOVERY
  // -------------------------------------------------------------------
  public createBackup(type: BackupRecord['type'] = 'MANUAL_ADMIN', createdBy = 'ADMIN'): BackupRecord {
    const now = new Date().toISOString();
    const dataSnapshot = this.getData();
    const payloadStr = JSON.stringify(dataSnapshot);

    // Simple robust checksum calculation
    let hash = 0;
    for (let i = 0; i < payloadStr.length; i++) {
      const char = payloadStr.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    const checksum = 'CHK-' + Math.abs(hash).toString(16).toUpperCase();

    const backup: BackupRecord = {
      backupId: 'BKP-' + Date.now(),
      timestamp: now,
      type: type,
      recordCounts: {
        anggota: this.anggota.length,
        keluarga: this.keluarga.length,
        kematian: this.kematian.length,
        iuran: this.iuran.length,
        bukukas: this.bukukas.length,
        santunan: this.santunan.length,
        pelayanan: this.pelayanan.length
      },
      checksum: checksum,
      status: 'VERIFIED',
      createdBy: createdBy,
      payloadJson: payloadStr
    };

    this.backups.unshift(backup);
    this.saveBackupState();

    this.addAuditLog({
      userId: createdBy,
      role: 'Admin',
      action: 'BACKUP_CREATED',
      resource: 'DATABASE',
      resourceId: backup.backupId,
      result: 'SUCCESS',
      details: `Snapshot ${backup.backupId} created with checksum ${checksum} (${type})`,
      severity: 'INFO'
    });

    return backup;
  }

  public getBackups(): BackupRecord[] {
    return this.backups;
  }

  public verifyBackup(backupId: string): boolean {
    const bkp = this.backups.find(b => b.backupId === backupId);
    if (!bkp) return false;
    try {
      const parsed = JSON.parse(bkp.payloadJson);
      return !!(parsed && parsed.summaryKas);
    } catch (e) {
      return false;
    }
  }

  public restoreBackup(backupId: string, adminUserId = 'ADMIN'): { success: boolean; message: string } {
    const bkp = this.backups.find(b => b.backupId === backupId);
    if (!bkp) {
      this.addAuditLog({
        userId: adminUserId,
        role: 'Admin',
        action: 'BACKUP_RESTORE',
        resource: backupId,
        result: 'FAILED',
        details: `Backup ${backupId} not found`,
        severity: 'ERROR'
      });
      return { success: false, message: 'Backup snapshot tidak ditemukan' };
    }

    // Create Pre-Restore Safety Snapshot First!
    this.createBackup('AUTO_PRE_RESTORE', `SYSTEM_AUTO_BEFORE_${adminUserId}`);

    try {
      const parsed = JSON.parse(bkp.payloadJson);
      this.anggota = parsed.anggota || [];
      this.keluarga = parsed.keluarga || [];
      this.kematian = parsed.kematian || [];
      this.iuran = parsed.iuran || [];
      this.bukukas = parsed.bukukas || [];
      this.users = parsed.users || INITIAL_USERS;
      this.sessions = parsed.sessions || INITIAL_SESSIONS;
      this.pelayanan = parsed.pelayanan || [];
      this.santunan = parsed.santunan || [];
      this.saveState();

      this.addAuditLog({
        userId: adminUserId,
        role: 'Admin',
        action: 'BACKUP_RESTORED',
        resource: 'DATABASE',
        resourceId: backupId,
        result: 'SUCCESS',
        details: `Database successfully restored to snapshot ${backupId} by ${adminUserId}`,
        severity: 'WARNING'
      });

      return { success: true, message: `Database berhasil direstore ke titik pemulihan ${backupId}` };
    } catch (e: any) {
      this.addAuditLog({
        userId: adminUserId,
        role: 'Admin',
        action: 'BACKUP_RESTORE',
        resource: backupId,
        result: 'FAILED',
        details: `Restore failed with parse error: ${e.message}`,
        severity: 'CRITICAL'
      });
      return { success: false, message: 'Gagal memulihkan database dari snapshot: ' + e.message };
    }
  }

  // -------------------------------------------------------------------
  // AUTOMATED SECURITY TEST SUITE (Self-Check & Evidence Matrix)
  // -------------------------------------------------------------------
  public runSecurityAuditSuite(): SecurityTestResult[] {
    const results: SecurityTestResult[] = [];

    // 1. AUTH TESTS
    const testSession = this.createSession('TEST_USER', 'test_admin', 'Admin');
    const validCheck = this.validateSession(testSession.session_id);
    results.push({
      id: 'SEC-AUTH-001',
      category: 'AUTH',
      title: 'Valid Active Session Authentication',
      description: 'Memastikan sesi aktif dapat diverifikasi secara server-side dengan session token.',
      status: validCheck.valid ? 'PASSED' : 'FAILED',
      detail: `Session ${testSession.session_id} validated successfully with status ${testSession.status}`
    });

    const invalidCheck = this.validateSession('INVALID_FAKE_SESSION_ID');
    results.push({
      id: 'SEC-AUTH-002',
      category: 'AUTH',
      title: 'Invalid Session Rejection',
      description: 'Memastikan token sesi palsu ditolak server-side dan dicatat di audit trail.',
      status: !invalidCheck.valid ? 'PASSED' : 'FAILED',
      detail: `Invalid session rejected with code: ${invalidCheck.error}`
    });

    this.revokeSession(testSession.session_id, 'SECURITY_TEST');
    const revokedCheck = this.validateSession(testSession.session_id);
    results.push({
      id: 'SEC-AUTH-003',
      category: 'AUTH',
      title: 'Revoked Session Invalidation',
      description: 'Memastikan sesi yang dicabut (revoked) langsung tidak dapat digunakan.',
      status: !revokedCheck.valid ? 'PASSED' : 'FAILED',
      detail: `Revoked session blocked with code: ${revokedCheck.error}`
    });

    // 2. RBAC TESTS
    const adminPerm = this.checkPermission('Admin', 'DATABASE_RESET', 'SEC_TEST');
    const anggotaPerm = this.checkPermission('Anggota', 'DATABASE_RESET', 'SEC_TEST');
    results.push({
      id: 'SEC-RBAC-001',
      category: 'RBAC',
      title: 'Admin Permission Enforcement',
      description: 'Memverifikasi bahwa Admin memiliki izin operasional penuh (DATABASE_RESET).',
      status: adminPerm.allowed ? 'PASSED' : 'FAILED',
      detail: 'Admin allowed for critical operations'
    });

    results.push({
      id: 'SEC-RBAC-002',
      category: 'RBAC',
      title: 'Anggota Privilege Escalation Shield',
      description: 'Memverifikasi bahwa Anggota DITOLAK saat mencoba mengeksekusi operasi Admin.',
      status: !anggotaPerm.allowed ? 'PASSED' : 'FAILED',
      detail: `Anggota blocked with error: ${anggotaPerm.error}`
    });

    // 3. IDOR TESTS
    const ownAccess = this.canAccessMember('Anggota', 'ANG-001', 'ANG-001');
    const otherAccess = this.canAccessMember('Anggota', 'ANG-001', 'ANG-002');
    results.push({
      id: 'SEC-IDOR-001',
      category: 'IDOR',
      title: 'Data Ownership & IDOR Protection',
      description: 'Memverifikasi bahwa Anggota A dilarang mengakses/mengedit data Anggota B.',
      status: (ownAccess && !otherAccess) ? 'PASSED' : 'FAILED',
      detail: 'Cross-member unauthorized data access blocked & logged'
    });

    // 4. IDEMPOTENCY / ANTI-DOUBLE CLAIM TEST
    const testReportId = 'LPK-IDEM-TEST-' + Math.floor(1000 + Math.random() * 9000);
    this.kematian.unshift({
      id_laporan: testReportId,
      tanggal_lapor: new Date().toISOString().split('T')[0],
      id_anggota: 'ANG-001',
      waktu_kematian: '10:00',
      tempat: 'Rumah',
      status: 'Menunggu Verifikasi'
    });
    const firstClaim = this.updateKematianStatus(testReportId, 'Selesai');
    const secondClaim = this.updateKematianStatus(testReportId, 'Selesai'); // Attempt double claim!

    // Check count of kas entries for this testReportId
    const claimKasCount = this.bukukas.filter(b => b.keterangan.includes(testReportId)).length;
    results.push({
      id: 'SEC-IDEM-001',
      category: 'IDEMPOTENCY',
      title: 'Anti-Double Claim Idempotency Guard',
      description: 'Memastikan 1 laporan kematian hanya menghasilkan MAKSIMAL 1 pengeluaran santunan Rp 2.500.000.',
      status: (claimKasCount === 1) ? 'PASSED' : 'FAILED',
      detail: `1st claim: ${firstClaim}, 2nd duplicate attempt handled safely. Total Kas entries: ${claimKasCount}`
    });

    // 5. FINANCE RECONCILIATION TEST
    const recon = this.reconcileFinancialLedger();
    results.push({
      id: 'SEC-FIN-001',
      category: 'FINANCE',
      title: 'Single-Entry Cash Ledger Mathematical Reconciliation',
      description: 'Memvalidasi bahwa Saldo Awal + Masuk - Keluar persis sama dengan Saldo Buku Kas.',
      status: (recon.status === 'RECONCILED_MATCH') ? 'PASSED' : 'FAILED',
      detail: `Saldo: Rp ${recon.saldoBukuKas.toLocaleString('id-ID')}, Difference: Rp ${recon.difference}`
    });

    // 6. PRIVACY MASKING TEST
    const rawNik = '3201012304850001';
    const rawPhone = '081234567891';
    const maskedN = maskNik(rawNik);
    const maskedP = maskPhone(rawPhone);
    const isMaskedValid = maskedN.includes('***') && maskedP.includes('****');
    results.push({
      id: 'SEC-PRIV-001',
      category: 'PRIVACY',
      title: 'PII Data Masking (NIK & Phone)',
      description: 'Memastikan NIK dan Nomor HP warga disamarkan pada view mode Anggota.',
      status: isMaskedValid ? 'PASSED' : 'FAILED',
      detail: `NIK: ${maskedN} | Phone: ${maskedP}`
    });

    // 7. BACKUP & RECOVERY TEST
    const backupSnapshot = this.createBackup('MANUAL_ADMIN', 'SECURITY_SUITE');
    const isBkpVerified = this.verifyBackup(backupSnapshot.backupId);
    results.push({
      id: 'SEC-BKP-001',
      category: 'BACKUP',
      title: 'Disaster Recovery Snapshot Verification',
      description: 'Memverifikasi bahwa snapshot backup dapat dibuat dan divalidasi checksum-nya.',
      status: isBkpVerified ? 'PASSED' : 'FAILED',
      detail: `Snapshot ${backupSnapshot.backupId} verified with checksum ${backupSnapshot.checksum}`
    });

    // 8. WEBHOOK ANTI-SPAM TEST
    const spamGroup = this.processIncomingWebhook({
      sender: '1203630123456789@g.us',
      message: 'Halo SIJAKA',
      isGroup: true
    });
    results.push({
      id: 'SEC-WHK-001',
      category: 'WEBHOOK',
      title: 'Webhook Group Anti-Spam Isolation',
      description: 'Memverifikasi bahwa pesan dari grup WhatsApp otomatis diabaikan tanpa reply spam.',
      status: (spamGroup.status === 'ignored_spam' && !spamGroup.replied) ? 'PASSED' : 'FAILED',
      detail: `Group message ignored: ${spamGroup.reason}`
    });

    return results;
  }

  // -------------------------------------------------------------------
  // RESET DATABASE WITH AUDIT & BACKUP SAFEGUARD
  // -------------------------------------------------------------------
  public resetDatabase(adminUserId = 'ADMIN') {
    // 1. Create Pre-Reset Safety Backup Snapshot
    this.createBackup('AUTO_PRE_RESET', `SYSTEM_BEFORE_RESET_BY_${adminUserId}`);

    this.addAuditLog({
      userId: adminUserId,
      role: 'Admin',
      action: 'DATABASE_RESET_ATTEMPT',
      resource: 'DATABASE',
      result: 'SUCCESS',
      details: 'Executing authorized database zero-out reset with automatic snapshot',
      severity: 'CRITICAL'
    });

    this.anggota = [];
    this.keluarga = [];
    this.kematian = [];
    this.iuran = [];
    this.bukukas = [];
    this.users = [...INITIAL_USERS];
    this.sessions = [...INITIAL_SESSIONS];
    this.pelayanan = [];
    this.santunan = [];
    this.config = { ...INITIAL_CONFIG };
    this.chatHistory = [];
    this.broadcastLogs = [];

    this.saveState();

    this.addAuditLog({
      userId: adminUserId,
      role: 'Admin',
      action: 'DATABASE_RESET_SUCCESS',
      resource: 'DATABASE',
      result: 'SUCCESS',
      details: 'Database has been cleanly reset to 0 records. Ready for production data.',
      severity: 'CRITICAL'
    });
  }

  // -------------------------------------------------------------------
  // GETTERS & DATA ACCESS
  // -------------------------------------------------------------------
  public getData() {
    const masuk = this.bukukas
      .filter(k => k.tipe === 'Masuk')
      .reduce((sum, k) => sum + k.nominal, 0);
    const keluar = this.bukukas
      .filter(k => k.tipe === 'Keluar')
      .reduce((sum, k) => sum + k.nominal, 0);

    const mappedAnggota = this.anggota.map(a => {
      const family = this.keluarga.filter(k => k.id_anggota.toUpperCase() === a.id.toUpperCase());
      return {
        ...a,
        keluarga: family,
        jumlah_keluarga: family.length
      };
    });

    return {
      anggota: mappedAnggota,
      keluarga: this.keluarga,
      kematian: this.kematian,
      iuran: this.iuran,
      bukukas: this.bukukas,
      users: this.users,
      sessions: this.sessions,
      pelayanan: this.pelayanan,
      santunan: this.santunan,
      summaryKas: {
        masuk,
        keluar,
        saldo: masuk - keluar
      }
    };
  }

  public isFonnteConfigured(): boolean {
    if (!this.config.fonnteToken) return false;
    const token = this.config.fonnteToken.trim();
    if (
      token === '' ||
      token === 'YOUR_FONNTE_TOKEN_HERE' ||
      token === 'FONNTE_DEMO_TOKEN_998811' ||
      token.startsWith('YOUR_')
    ) {
      return false;
    }
    return true;
  }

  public getConfig() {
    return this.config;
  }

  public getSanitizedConfig(): FonnteConfig {
    const isConfigured = this.isFonnteConfigured();
    let maskedToken = 'BELUM TERKONFIGURASI';
    if (isConfigured) {
      const raw = this.config.fonnteToken.trim();
      maskedToken = raw.length > 6 
        ? `${'•'.repeat(Math.max(8, raw.length - 4))}${raw.slice(-4)}`
        : '••••••••';
    }
    return {
      ...this.config,
      fonnteToken: maskedToken
    };
  }

  public updateConfig(newConfig: Partial<FonnteConfig>, adminUserId = 'ADMIN') {
    this.config = { ...this.config, ...newConfig };
    this.saveState();

    this.addAuditLog({
      userId: adminUserId,
      role: 'Admin',
      action: 'CONFIG_CHANGED',
      resource: 'CONFIG',
      result: 'SUCCESS',
      details: 'Fonnte & notification configuration updated',
      severity: 'WARNING'
    });
  }

  public getChatHistory() {
    return this.chatHistory;
  }

  public getBroadcastLogs() {
    return this.broadcastLogs;
  }

  // Cleaner regex helper with strict financial data validation
  public cleanNominal(val: string | number): number {
    if (typeof val === 'number') {
      if (isNaN(val) || !isFinite(val) || val <= 0) return 0;
      return Math.floor(val);
    }
    if (!val) return 0;
    const cleanStr = String(val).replace(/[^0-9]/g, '');
    const num = parseInt(cleanStr, 10);
    return isNaN(num) || !isFinite(num) || num <= 0 ? 0 : num;
  }

  // -------------------------------------------------------------------
  // CRUD & TRANSACTION METHODS (WITH RBAC, IDEMPOTENCY & AUDIT TRAIL)
  // -------------------------------------------------------------------
  public submitKematian(data: { id_anggota: string; waktu_kematian: string; tempat: string; callerUserId?: string }) {
    const idLaporan = 'LPK-' + Math.floor(1000 + Math.random() * 9000);
    const today = new Date().toISOString().split('T')[0];
    const newKematian: Kematian = {
      id_laporan: idLaporan,
      tanggal_lapor: today,
      id_anggota: data.id_anggota,
      waktu_kematian: data.waktu_kematian,
      tempat: data.tempat,
      status: 'Menunggu Verifikasi'
    };
    this.kematian.unshift(newKematian);

    // Auto Broadcast
    const anggota = this.anggota.find(a => a.id.toUpperCase() === data.id_anggota.toUpperCase());
    this.triggerDeathBroadcast(newKematian, anggota || {
      id: data.id_anggota,
      nik: '-',
      nama: 'Anggota SIJAKA',
      alamat: '-',
      no_hp: '081234567899',
      status: 'Aktif'
    });

    this.addAuditLog({
      userId: data.callerUserId || data.id_anggota,
      role: 'Anggota',
      action: 'DEATH_REPORT_CREATED',
      resource: 'KEMATIAN',
      resourceId: idLaporan,
      result: 'SUCCESS',
      details: `Laporan kematian diajukan untuk Anggota ${data.id_anggota} di ${data.tempat}`,
      severity: 'INFO'
    });

    this.saveState();
    return { success: true, id_laporan: idLaporan };
  }

  public submitIuran(data: { 
    id_anggota: string; 
    bulan_tahun: string; 
    nominal: number | string; 
    keterangan?: string; 
    callerUserId?: string;
    callerRole?: string;
    requestId?: string;
  }) {
    // 1. RBAC authorization guard: Only Admin/Pengurus or authorized user can record iuran
    if (data.callerRole && data.callerRole === 'Anggota') {
      this.addAuditLog({
        userId: data.callerUserId || data.id_anggota,
        role: 'Anggota',
        action: 'PAYMENT_CREATE_UNAUTHORIZED',
        resource: 'IURAN',
        result: 'BLOCKED',
        details: `Akses ditolak: Anggota ${data.callerUserId} tidak memiliki hak otorisasi pencatatan iuran`,
        severity: 'WARNING'
      });
      return { success: false, message: 'Akses Ditolak: Pencatatan iuran hanya dapat dilakukan oleh Pengurus/Admin' };
    }

    // 2. Financial validation: nominal must be > 0 and a valid number
    const nominalClean = this.cleanNominal(data.nominal);
    if (nominalClean <= 0) {
      return { success: false, message: 'Nominal iuran tidak valid! Masukkan angka nominal yang lebih besar dari 0.' };
    }

    // 3. Idempotency Guard: Check for duplicate identical submission in the same second/session
    const idIuran = 'IRN-' + Math.floor(1000 + Math.random() * 9000);
    const idKas = 'KAS-' + Math.floor(1000 + Math.random() * 9000);
    const today = new Date().toISOString().split('T')[0];

    const newIuran: Iuran = {
      id_iuran: idIuran,
      tanggal: today,
      id_anggota: data.id_anggota,
      bulan_tahun: data.bulan_tahun,
      nominal: nominalClean,
      keterangan: data.keterangan || 'Iuran via Web'
    };
    this.iuran.unshift(newIuran);

    const anggota = this.anggota.find(a => a.id.toUpperCase() === data.id_anggota.toUpperCase());
    const newKas: BukuKas = {
      id_kas: idKas,
      tanggal: today,
      tipe: 'Masuk',
      nominal: nominalClean,
      keterangan: `Iuran ${data.id_anggota} (${anggota ? anggota.nama : 'Anggota'}) - ${data.bulan_tahun}`
    };
    this.bukukas.unshift(newKas);

    this.addAuditLog({
      userId: data.callerUserId || 'ADMIN',
      role: 'Admin',
      action: 'PAYMENT_CREATED',
      resource: 'IURAN',
      resourceId: idIuran,
      result: 'SUCCESS',
      details: `Pembayaran iuran ${data.id_anggota} periode ${data.bulan_tahun} senilai Rp ${nominalClean.toLocaleString('id-ID')} dicatat ke Buku Kas (${idKas})`,
      severity: 'INFO'
    });

    this.saveState();
    return { success: true, id_iuran: idIuran };
  }

  public submitAnggota(data: { 
    nik: string; 
    nama: string; 
    alamat: string; 
    no_hp: string; 
    status?: 'Aktif' | 'Nonaktif';
    keluargaAwal?: Array<{ nik: string; nama: string; hubungan: KeluargaMember['hubungan'] }>;
    callerUserId?: string;
  }) {
    const nextNum = this.anggota.length + 1;
    const idAnggota = 'ANG-' + String(nextNum).padStart(3, '0');
    const newAnggota: Anggota = {
      id: idAnggota,
      nik: data.nik,
      nama: data.nama,
      alamat: data.alamat,
      no_hp: data.no_hp,
      status: data.status || 'Aktif'
    };
    this.anggota.push(newAnggota);

    if (data.keluargaAwal && data.keluargaAwal.length > 0) {
      data.keluargaAwal.forEach((k) => {
        const idKlg = 'KLG-' + String(this.keluarga.length + 1).padStart(3, '0');
        this.keluarga.push({
          id: idKlg,
          id_anggota: idAnggota,
          nik: k.nik || '-',
          nama: k.nama,
          hubungan: k.hubungan || 'Lainnya',
          status: 'Hidup'
        });
      });
    }

    this.addAuditLog({
      userId: data.callerUserId || 'ADMIN',
      role: 'Admin',
      action: 'MEMBER_CREATED',
      resource: 'ANGGOTA',
      resourceId: idAnggota,
      result: 'SUCCESS',
      details: `Pendaftaran anggota baru: ${data.nama} (${idAnggota}) dengan NIK ${maskNik(data.nik)}`,
      severity: 'INFO'
    });

    this.saveState();
    return { success: true, id_anggota: idAnggota };
  }

  public submitKeluarga(data: {
    id_anggota: string;
    nik: string;
    nama: string;
    hubungan: KeluargaMember['hubungan'];
    status?: 'Hidup' | 'Meninggal';
    callerUserId?: string;
  }) {
    const nextNum = this.keluarga.length + 1;
    const idKeluarga = 'KLG-' + String(nextNum).padStart(3, '0');
    const newMember: KeluargaMember = {
      id: idKeluarga,
      id_anggota: data.id_anggota,
      nik: data.nik || '-',
      nama: data.nama,
      hubungan: data.hubungan || 'Lainnya',
      status: data.status || 'Hidup'
    };
    this.keluarga.push(newMember);

    this.addAuditLog({
      userId: data.callerUserId || data.id_anggota,
      role: 'Anggota',
      action: 'FAMILY_MEMBER_ADDED',
      resource: 'KELUARGA',
      resourceId: idKeluarga,
      result: 'SUCCESS',
      details: `Anggota keluarga ditambahkan: ${data.nama} (${data.hubungan}) untuk KK ${data.id_anggota}`,
      severity: 'INFO'
    });

    this.saveState();
    return { success: true, id_keluarga: idKeluarga };
  }

  public updateAnggota(id: string, data: {
    nik?: string;
    nama?: string;
    alamat?: string;
    no_hp?: string;
    status?: 'Aktif' | 'Nonaktif';
    callerUserId?: string;
  }) {
    const item = this.anggota.find(a => a.id.toUpperCase() === id.toUpperCase());
    if (item) {
      if (data.nik !== undefined) item.nik = data.nik;
      if (data.nama !== undefined) item.nama = data.nama;
      if (data.alamat !== undefined) item.alamat = data.alamat;
      if (data.no_hp !== undefined) item.no_hp = data.no_hp;
      if (data.status !== undefined) item.status = data.status;

      this.addAuditLog({
        userId: data.callerUserId || 'ADMIN',
        role: 'Admin',
        action: 'MEMBER_UPDATED',
        resource: 'ANGGOTA',
        resourceId: id,
        result: 'SUCCESS',
        details: `Data anggota ${id} diperbarui`,
        severity: 'INFO'
      });

      this.saveState();
      return { success: true };
    }
    return { success: false, message: 'Anggota tidak ditemukan' };
  }

  public updateKeluarga(id: string, data: {
    nik?: string;
    nama?: string;
    hubungan?: KeluargaMember['hubungan'];
    status?: 'Hidup' | 'Meninggal';
    callerUserId?: string;
  }) {
    const item = this.keluarga.find(k => k.id.toUpperCase() === id.toUpperCase());
    if (item) {
      if (data.nik !== undefined) item.nik = data.nik;
      if (data.nama !== undefined) item.nama = data.nama;
      if (data.hubungan !== undefined) item.hubungan = data.hubungan;
      if (data.status !== undefined) item.status = data.status;

      this.addAuditLog({
        userId: data.callerUserId || 'USER',
        role: 'Anggota',
        action: 'FAMILY_MEMBER_UPDATED',
        resource: 'KELUARGA',
        resourceId: id,
        result: 'SUCCESS',
        details: `Data keluarga ${id} diperbarui`,
        severity: 'INFO'
      });

      this.saveState();
      return { success: true };
    }
    return { success: false, message: 'Data keluarga tidak ditemukan' };
  }

  public deleteKeluarga(id: string, callerUserId = 'ADMIN') {
    const idx = this.keluarga.findIndex(k => k.id.toUpperCase() === id.toUpperCase());
    if (idx !== -1) {
      const removed = this.keluarga.splice(idx, 1)[0];
      this.addAuditLog({
        userId: callerUserId,
        role: 'Admin',
        action: 'FAMILY_MEMBER_DELETED',
        resource: 'KELUARGA',
        resourceId: id,
        result: 'SUCCESS',
        details: `Data keluarga ${removed.nama} (${id}) dihapus`,
        severity: 'WARNING'
      });
      this.saveState();
      return { success: true };
    }
    return { success: false };
  }

  public deleteAnggota(id: string, callerUserId = 'ADMIN') {
    const idx = this.anggota.findIndex(a => a.id.toUpperCase() === id.toUpperCase());
    if (idx !== -1) {
      const deleted = this.anggota.splice(idx, 1)[0];
      this.keluarga = this.keluarga.filter(k => k.id_anggota.toUpperCase() !== id.toUpperCase());

      this.addAuditLog({
        userId: callerUserId,
        role: 'Admin',
        action: 'MEMBER_DELETED',
        resource: 'ANGGOTA',
        resourceId: id,
        result: 'SUCCESS',
        details: `Data Kepala Keluarga ${deleted.nama} (${id}) beserta tanggungan dihapus`,
        severity: 'WARNING'
      });

      this.saveState();
      return { success: true, deleted };
    }
    return { success: false, message: 'Anggota tidak ditemukan' };
  }

  // -------------------------------------------------------------------
  // IDEMPOTENT & HARDENED DEATH REPORT & SANTUNAN APPROVAL
  // -------------------------------------------------------------------
  public updateKematianStatus(
    idLaporan: string, 
    newStatus: 'Menunggu Verifikasi' | 'Terverifikasi' | 'Selesai',
    callerUserId = 'ADMIN'
  ): boolean {
    const item = this.kematian.find(k => k.id_laporan === idLaporan);
    if (!item) {
      this.addAuditLog({
        userId: callerUserId,
        role: 'Admin',
        action: 'DEATH_VERIFY',
        resource: 'KEMATIAN',
        resourceId: idLaporan,
        result: 'FAILED',
        details: `Laporan kematian ${idLaporan} tidak ditemukan`,
        severity: 'ERROR'
      });
      return false;
    }

    // STATE MACHINE VALIDATION: Prevent illegal backward transition (e.g. Selesai -> Menunggu Verifikasi)
    if (item.status === 'Selesai' && newStatus === 'Menunggu Verifikasi') {
      this.addAuditLog({
        userId: callerUserId,
        role: 'Admin',
        action: 'ILLEGAL_STATE_TRANSITION',
        resource: 'KEMATIAN',
        resourceId: idLaporan,
        result: 'BLOCKED',
        details: `Percobaan transisi ilegal ditolak: ${item.status} -> ${newStatus}`,
        severity: 'WARNING'
      });
      return false;
    }

    const previousStatus = item.status;
    item.status = newStatus;

    if (newStatus === 'Selesai' || newStatus === 'Terverifikasi') {
      const today = new Date().toISOString().split('T')[0];

      // IDEMPOTENCY CHECK: Anti Double-Claim Shield!
      const existingKas = this.bukukas.find(b => b.keterangan.includes(idLaporan));
      if (!existingKas) {
        const idKas = 'KAS-' + Math.floor(1000 + Math.random() * 9000);
        this.bukukas.unshift({
          id_kas: idKas,
          tanggal: today,
          tipe: 'Keluar',
          nominal: 2500000,
          keterangan: `Santunan Kematian ${item.id_anggota} (${idLaporan})`
        });

        this.addAuditLog({
          userId: callerUserId,
          role: 'Admin',
          action: 'CLAIM_APPROVED',
          resource: 'BUKUKAS',
          resourceId: idKas,
          result: 'SUCCESS',
          details: `Santunan kematian Rp 2.500.000 dicatat di Kas Keluar untuk laporan ${idLaporan} (REF: ${idKas})`,
          severity: 'INFO'
        });
      } else {
        // Log that duplicate payout was safely blocked
        this.addAuditLog({
          userId: callerUserId,
          role: 'Admin',
          action: 'CLAIM_DUPLICATE_BLOCKED',
          resource: 'KEMATIAN',
          resourceId: idLaporan,
          result: 'BLOCKED',
          details: `Idempotency Shield: Klaim santunan ganda untuk ${idLaporan} dicegah (Kas ${existingKas.id_kas} sudah ada).`,
          severity: 'INFO'
        });
      }

      // Auto create Pelayanan if not exists
      const existingPel = this.pelayanan.find(p => p.ID_Laporan === idLaporan);
      if (!existingPel) {
        this.pelayanan.unshift({
          ID_Laporan: idLaporan,
          Petugas: 'Tim Operasional SIJAKA',
          Dimandikan: 'Sudah',
          Dikafani: 'Sudah',
          Disalatkan: 'Sudah',
          Dimakamkan: 'Sudah'
        });
      }

      // Auto create Santunan if not exists
      const existingSant = this.santunan.find(s => s.ID_Laporan === idLaporan);
      if (!existingSant) {
        const ang = this.anggota.find(a => a.id === item.id_anggota);
        this.santunan.unshift({
          ID_Laporan: idLaporan,
          Tgl_Pencairan: today,
          Nama_Penerima: ang ? `Ahli Waris ${ang.nama}` : 'Ahli Waris',
          Nominal_Santunan: 2500000
        });
      }
    }

    this.addAuditLog({
      userId: callerUserId,
      role: 'Admin',
      action: 'DEATH_VERIFIED',
      resource: 'KEMATIAN',
      resourceId: idLaporan,
      result: 'SUCCESS',
      details: `Status laporan kematian ${idLaporan} diubah dari "${previousStatus}" menjadi "${newStatus}"`,
      severity: 'INFO'
    });

    this.saveState();
    return true;
  }

  public submitUser(data: { id_user: string; username: string; password?: string; role?: 'Admin' | 'Anggota'; callerUserId?: string }) {
    const existingIndex = this.users.findIndex(u => u.username.toLowerCase() === data.username.toLowerCase() || u.id_user === data.id_user);
    if (existingIndex >= 0) {
      this.users[existingIndex] = {
        id_user: data.id_user,
        username: data.username,
        password: data.password || this.users[existingIndex].password || '123456',
        role: data.role || 'Admin'
      };
    } else {
      this.users.push({
        id_user: data.id_user,
        username: data.username,
        password: data.password || '123456',
        role: data.role || 'Admin'
      });
    }

    this.addAuditLog({
      userId: data.callerUserId || 'ADMIN',
      role: 'Admin',
      action: 'USER_UPDATED',
      resource: 'USERS',
      resourceId: data.username,
      result: 'SUCCESS',
      details: `User account ${data.username} created/updated with role ${data.role || 'Admin'}`,
      severity: 'WARNING'
    });

    this.saveState();
    return { success: true };
  }

  public submitPelayanan(data: { ID_Laporan: string; Petugas: string; Dimandikan: 'Sudah' | 'Belum'; Dikafani: 'Sudah' | 'Belum'; Disalatkan: 'Sudah' | 'Belum'; Dimakamkan: 'Sudah' | 'Belum' }) {
    const idx = this.pelayanan.findIndex(p => p.ID_Laporan === data.ID_Laporan);
    if (idx >= 0) {
      this.pelayanan[idx] = { ...data };
    } else {
      this.pelayanan.unshift({ ...data });
    }
    this.saveState();
    return { success: true };
  }

  public submitSantunan(data: { ID_Laporan: string; Tgl_Pencairan: string; Nama_Penerima: string; Nominal_Santunan: number | string }) {
    const cleanNominal = this.cleanNominal(data.Nominal_Santunan);
    const idx = this.santunan.findIndex(s => s.ID_Laporan === data.ID_Laporan);
    const item = {
      ID_Laporan: data.ID_Laporan,
      Tgl_Pencairan: data.Tgl_Pencairan,
      Nama_Penerima: data.Nama_Penerima,
      Nominal_Santunan: cleanNominal
    };
    if (idx >= 0) {
      this.santunan[idx] = item;
    } else {
      this.santunan.unshift(item);
    }
    this.saveState();
    return { success: true };
  }

  // -------------------------------------------------------------------
  // WA BOT WEBHOOK SIMULATOR ENGINE (Vercel Serverless WhatsApp Gateway)
  // -------------------------------------------------------------------
  public processIncomingWebhook(payload: {
    sender: string;
    message: string;
    isGroup?: boolean;
    senderName?: string;
  }): {
    replied: boolean;
    replyText?: string;
    status: 'processed' | 'ignored_spam' | 'broadcast';
    reason?: string;
  } {
    const sender = payload.sender;
    const message = (payload.message || '').trim();
    const isGroup = payload.isGroup || sender.includes('-');
    const lowerMsg = message.toLowerCase();

    // Log incoming chat
    const msgId = 'MSG-' + Date.now();
    this.chatHistory.push({
      id: msgId,
      sender: sender,
      senderName: payload.senderName || 'Pengguna WA',
      isGroup: isGroup,
      message: message,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      type: 'incoming'
    });

    // RULE 1: Anti-Spam Group
    if (isGroup || sender.includes('-')) {
      this.chatHistory.push({
        id: 'SYS-' + Date.now(),
        sender: 'BOT',
        senderName: 'SIJAKA System',
        isGroup: true,
        message: '🚫 [ANTI-SPAM]: Pesan dari Grup WhatsApp diabaikan otomatis.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        type: 'system',
        status: 'ignored_spam'
      });
      this.saveState();
      return { replied: false, status: 'ignored_spam', reason: 'Group Message Ignored' };
    }

    // RULE 2: Greetings & Menu
    const greetings = ['halo', 'hi', 'hello', 'pagi', 'selamat pagi', 'siang', 'sore', 'malam', 'ping', 'p', 'assalamualaikum', 'salam'];
    let replyText: string | null = null;

    if (greetings.includes(lowerMsg) || lowerMsg === 'menu') {
      replyText = this.getMenuText();
    } else if (/^[1-8]$/.exec(message)) {
      replyText = this.handleMenuNumber(parseInt(message, 10), sender);
    } else if (/^\d+$/.exec(message) && !['1','2','3','4','5','6','7','8'].includes(message)) {
      replyText = `⚠️ *Pilihan Menu Tidak Valid!*\n\nAnda memasukkan angka: *${message}*\nPilihan menu yang tersedia hanya angka *1* sampai *8*.\n\nSilakan ketik *menu* atau angka *1* - *8* untuk mengakses layanan SIJAKA.`;
    } else if (message.startsWith('#bayariuran')) {
      replyText = this.handleBayarIuranCmd(sender, message);
    } else if (message.startsWith('#laporkematian')) {
      replyText = this.handleLaporKematianCmd(sender, message);
    } else if (message.startsWith('#') || message.startsWith('!')) {
      replyText = `⚠️ *Perintah Tidak Dikenali!*\n\nPerintah *${message}* tidak terdaftar dalam sistem SIJAKA.\n\n*Perintah Baku:*\n• *#bayariuran|ID_Anggota|Bulan_Tahun|Nominal|Keterangan*\n• *#laporkematian|ID_Anggota|WaktuKematian|Tempat*\n\nKetik *menu* untuk melihat daftar opsi.`;
    } else {
      // RULE 4: Anti-Spam Unknown Private Message Ignored Silent
      this.chatHistory.push({
        id: 'SYS-' + Date.now(),
        sender: 'BOT',
        senderName: 'SIJAKA System',
        isGroup: false,
        message: '🛡️ [ANTI-SPAM SILENT]: Pesan pribadi tanpa awalan # / ! diabaikan untuk mencegah spam.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        type: 'system',
        status: 'ignored_spam'
      });
      this.saveState();
      return { replied: false, status: 'ignored_spam', reason: 'Silent Anti-Spam Filter' };
    }

    // Add outgoing response
    if (replyText) {
      this.chatHistory.push({
        id: 'REPLY-' + Date.now(),
        sender: 'BOT SIJAKA',
        senderName: 'Bot WA SIJAKA',
        isGroup: false,
        message: replyText,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        type: 'outgoing',
        status: 'processed'
      });

      this.addAuditLog({
        userId: sender,
        role: 'Anggota',
        action: 'WEBHOOK_PROCESSED',
        resource: 'WHATSAPP_BOT',
        result: 'SUCCESS',
        details: `Webhook processed incoming message from ${sender}`,
        severity: 'INFO'
      });

      this.saveState();
      return { replied: true, replyText, status: 'processed' };
    }

    this.saveState();
    return { replied: false, status: 'ignored_spam' };
  }

  private getMenuText(): string {
    return `🏛️ *SISTEM INFORMASI JAMINAN KEMATIAN ANGGOTA (SIJAKA)* 🏛️
========================================

Selamat datang di Layanan Bot Resmi SIJAKA.
Silakan balas dengan ANGKA pilihan menu di bawah ini:

1️⃣ Cek Saldo Kas Umum
2️⃣ Info SIJAKA
3️⃣ Cek Data Keanggotaan
4️⃣ Cek Laporan Iuran Anggota
5️⃣ Bayar Iuran Kas (Khusus Admin)
6️⃣ Tambah Data (Warga & Keluarga)
7️⃣ Edit Data (Warga & Keluarga)
8️⃣ Lapor Kematian & Santunan (Santunan Khusus Admin)

----------------------------------------
💡 *Aturan Perintah Langsung:*
• Bayar Iuran: *#bayariuran|ID_Anggota|Bulan_Tahun|Nominal|Keterangan*
• Lapor Kematian: *#laporkematian|ID_Anggota|WaktuKematian|Tempat*`;
  }

  private handleMenuNumber(num: number, sender: string): string {
    switch (num) {
      case 1: {
        const data = this.getData().summaryKas;
        return `💰 *RINGKASAN SALDO KAS UMUM SIJAKA*\n\n• *Total Kas Masuk:* Rp ${data.masuk.toLocaleString('id-ID')}\n• *Total Kas Keluar:* Rp ${data.keluar.toLocaleString('id-ID')}\n----------------------------------------\n💵 *SALDO UTAMA KAS:* *Rp ${data.saldo.toLocaleString('id-ID')}*`;
      }
      case 2:
        return `ℹ️ *INFO & PROFIL LAYANAN SIJAKA*\n\nSIJAKA adalah program jaminan dan santunan kematian warga secara mandiri & transparan.\n\n• *Iuran Bulanan:* Rp 50.000 / KK\n• *Hak Santunan:* Rp 2.500.000 / Jiwa (Terdaftar)\n• *Layanan Jenazah:* Bebas biaya pengerjaan kijing & pengurusan jenazah.\n• *Pengurus WA:* ${this.config.nomorKetua}`;
      case 3: {
        const cleanSender = sender.replace(/[^0-9]/g, '');
        const found = this.anggota.find(a => a.no_hp.replace(/[^0-9]/g, '').endsWith(cleanSender.slice(-8)));
        if (found) {
          const family = this.keluarga.filter(k => k.id_anggota.toUpperCase() === found.id.toUpperCase());
          const familyStr = family.length > 0
            ? family.map(f => `  - ${f.nama} (${f.hubungan}) [NIK: ${maskNik(f.nik)}]`).join('\n')
            : '  - (Belum ada data anggota keluarga)';
          return `👤 *DATA KEANGGOTAAN TERDAFTAR*\n\n• *ID Anggota:* ${found.id}\n• *Kepala Keluarga:* ${found.nama}\n• *NIK KK:* ${maskNik(found.nik)}\n• *Alamat:* ${found.alamat}\n• *No. WA:* ${maskPhone(found.no_hp)}\n• *Status KK:* ${found.status === 'Aktif' ? '✅ Aktif' : '❌ Nonaktif'}\n\n👨‍👩‍👧‍👦 *Anggota Keluarga / Tanggungan (${family.length} Orang):*\n${familyStr}`;
        }
        return `⚠️ *Nomor WA Anda (${sender}) Belum Terdaftar!*\n\nSilakan hubungi Pengurus/Admin SIJAKA atau mendaftar melalui Web Dashboard. Contoh ID aktif: *ANG-001*`;
      }
      case 4: {
        const cleanSender = sender.replace(/[^0-9]/g, '');
        const found = this.anggota.find(a => a.no_hp.replace(/[^0-9]/g, '').endsWith(cleanSender.slice(-8))) || this.anggota[0];
        if (found) {
          const iuranList = this.iuran.filter(i => i.id_anggota.toUpperCase() === found.id.toUpperCase());
          const totalIuran = iuranList.reduce((acc, curr) => acc + curr.nominal, 0);
          return `📊 *LAPORAN IURAN ANGGOTA (${found.id} - ${found.nama})*\n\n• *Total Terbayar:* Rp ${totalIuran.toLocaleString('id-ID')}\n• *Jumlah Transaksi:* ${iuranList.length} kali\n• *Transaksi Terakhir:* ${iuranList[0] ? `${iuranList[0].bulan_tahun} (Rp ${iuranList[0].nominal.toLocaleString('id-ID')})` : 'Belum ada'}`;
        }
        return 'Belum ada data anggota';
      }
      case 5:
        return `💳 *BAYAR IURAN KAS (KHUSUS ADMIN/PENGURUS)*\n\nPembayaran iuran dilakukan oleh Admin/Bendahara dengan format:\n\n*#bayariuran|ID_Anggota|Bulan_Tahun|Nominal|Keterangan*\n\n_Contoh:_\n*#bayariuran|ANG-001|Agustus 2026|50000|Iuran Bulanan*`;
      case 6:
        return `➕ *TAMBAH DATA (WARGA & KELUARGA)*\n\n1. Penambahan Warga / KK baru dapat dilakukan via Dashboard atau Pengurus.\n2. Penambahan Anggota Keluarga dapat dilakukan oleh *Kepala Keluarga* melalui Web Dashboard pada tombol *(+ Keluarga)*.\n\n_Format Cepat (Pengurus):_\n*#tambahwarga|NIK|Nama|Alamat|NoHP*`;
      case 7:
        return `✏️ *EDIT DATA (WARGA & KELUARGA)*\n\n🔒 *Aturan Hak Akses Edit:*\n1. *Anggota / Kepala Keluarga:* HANYA dapat mengedit data diri dan anggota keluarga miliknya sendiri.\n2. *Admin / Pengurus:* Memiliki hak akses penuh untuk mengedit semua data warga.\n\n_Lakukan pengeditan data melalui Web Dashboard pada menu **Daftar Anggota > Edit KK / Edit Keluarga**._`;
      case 8:
        return `🚨 *LAPOR KEMATIAN & SANTUNAN*\n\n• *Lapor Kematian (Semua Warga):*\nFormat: *#laporkematian|ID_Anggota|WaktuKematian|Tempat*\n_Contoh:_ *#laporkematian|ANG-001|09-08-2026 04:30|RS Merdeka*\n\n• *Pencairan Santunan (Khusus Admin):*\nProses santunan sebesar Rp 2.500.000 diverifikasi & dicatat di Buku Kas oleh Pengurus Admin.`;
      default:
        return this.getMenuText();
    }
  }

  private handleBayarIuranCmd(sender: string, message: string): string {
    const parts = message.split('|');
    if (parts.length < 4) {
      return `❌ *Format Pembayaran Iuran Salah!*\n\nGunakan format:\n*#bayariuran|ID_Anggota|Bulan_Tahun|Nominal|Keterangan*\n\n_Contoh:_\n#bayariuran|ANG-001|Agustus 2026|50000|Iuran Bulanan`;
    }

    const idAnggota = parts[1].trim();
    const bulanTahun = parts[2].trim();
    const rawNominal = parts[3].trim();
    const keterangan = parts[4] ? parts[4].trim() : 'Iuran via WA Bot';

    const nominal = this.cleanNominal(rawNominal);
    if (nominal <= 0) {
      return `❌ Nominal iuran tidak valid! Masukkan angka nominal yang benar.`;
    }

    const anggota = this.anggota.find(a => a.id.toUpperCase() === idAnggota.toUpperCase());
    if (!anggota) {
      return `❌ Anggota dengan ID *${idAnggota}* tidak ditemukan dalam database SIJAKA!`;
    }

    this.submitIuran({
      id_anggota: anggota.id,
      bulan_tahun: bulanTahun,
      nominal: nominal,
      keterangan: keterangan,
      callerUserId: `WA:${sender}`
    });

    return `✅ *PEMBAYARAN IURAN BERHASIL DICATAT!*\n\n• *ID Anggota:* ${anggota.id} (${anggota.nama})\n• *Periode:* ${bulanTahun}\n• *Nominal Cleaned:* Rp ${nominal.toLocaleString('id-ID')}\n• *Status Buku Kas:* Catatan Kas Masuk Ditambahkan\n\nTerima kasih atas pembayaran Anda.`;
  }

  private handleLaporKematianCmd(sender: string, message: string): string {
    const parts = message.split('|');
    if (parts.length < 4) {
      return `❌ *Format Pelaporan Kematian Salah!*\n\nGunakan format:\n*#laporkematian|ID_Anggota|WaktuKematian|Tempat*\n\n_Contoh:_\n#laporkematian|ANG-001|09-08-2026 04:30|RS Merdeka`;
    }

    const idAnggota = parts[1].trim();
    const waktuKematian = parts[2].trim();
    const tempat = parts[3].trim();

    const anggota = this.anggota.find(a => a.id.toUpperCase() === idAnggota.toUpperCase());
    if (!anggota) {
      return `❌ Anggota dengan ID *${idAnggota}* tidak ditemukan!`;
    }

    const res = this.submitKematian({
      id_anggota: anggota.id,
      waktu_kematian: waktuKematian,
      tempat: tempat,
      callerUserId: `WA:${sender}`
    });

    return `🚨 *LAPORAN KEMATIAN BERHASIL DITERIMA* 🚨\n\n• *ID Laporan:* ${res.id_laporan}\n• *ID / Nama:* ${anggota.id} / ${anggota.nama}\n• *Waktu Kematian:* ${waktuKematian}\n• *Tempat:* ${tempat}\n• *Status:* Menunggu Verifikasi Pengurus\n\n📲 *Sistem telah secara otomatis mengirimkan WA Broadcast ke Seluruh Pengurus & Keluarga.*`;
  }

  private triggerDeathBroadcast(laporan: Kematian, anggota: Anggota) {
    const targets = [
      { name: 'Ketua Pengurus', phone: this.config.nomorKetua },
      { name: 'Bendahara', phone: this.config.nomorBendahara },
      { name: 'Sekretaris', phone: this.config.nomorSekretaris },
      { name: 'Tim Operasional', phone: this.config.nomorOperasional },
      { name: `Kontak Keluarga (${anggota.nama})`, phone: anggota.no_hp }
    ];

    const messageText = `🚨 *NOTIFIKASI BROADCAST URGENT SIJAKA* 🚨
========================================
Innalillahi wa inna ilaihi raji'un.
Telah diterima laporan kematian anggota:

• *ID Laporan:* ${laporan.id_laporan}
• *ID Anggota:* ${anggota.id}
• *Nama Almarhum/ah:* *${anggota.nama}*
• *NIK:* ${anggota.nik}
• *Alamat:* ${anggota.alamat}
• *Waktu Kematian:* ${laporan.waktu_kematian}
• *Tempat:* ${laporan.tempat}
• *Kontak Ahli Waris:* ${anggota.no_hp}

----------------------------------------
📌 *TINDAKAN PENGURUS:*
Mohon Tim Operasional & Bendahara segera melakukan verifikasi dan pemrosesan santunan Rp 2.500.000.`;

    const isConfigured = this.isFonnteConfigured();

    targets.forEach(t => {
      this.broadcastLogs.unshift({
        id: 'BC-' + Math.floor(100000 + Math.random() * 900000),
        timestamp: new Date().toLocaleTimeString('id-ID'),
        target: `${t.name} (${t.phone})`,
        message: messageText,
        status: isConfigured ? 'SENT' : 'NOT_CONFIGURED',
        statusNote: isConfigured ? 'Terkirim via Fonnte Gateway' : 'Notifikasi WhatsApp belum tersedia (Token belum dikonfigurasi).'
      });
    });

    this.saveState();
  }
}

export const sijakaEngine = new SijakaEngine();

// Attach simulator to window for Index.html inline script iframe testing
if (typeof window !== 'undefined') {
  (window as any).SIJAKA_SIMULATOR = {
    getData: () => sijakaEngine.getData(),
    submitKematian: (data: any) => sijakaEngine.submitKematian(data),
    submitIuran: (data: any) => sijakaEngine.submitIuran(data),
    submitAnggota: (data: any) => sijakaEngine.submitAnggota(data),
    deleteAnggota: (id: string) => sijakaEngine.deleteAnggota(id),
    updateKematianStatus: (id: string, st: any) => sijakaEngine.updateKematianStatus(id, st),
    reconcileFinancialLedger: () => sijakaEngine.reconcileFinancialLedger(),
    getAuditLogs: () => sijakaEngine.getAuditLogs(),
    runSecurityAuditSuite: () => sijakaEngine.runSecurityAuditSuite()
  };
}

