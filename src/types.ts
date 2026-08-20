export type SijakaRole = 'Public' | 'Anggota' | 'Pengurus' | 'Ketua' | 'Admin' | 'Super Admin';

export interface UserAccount {
  id_user: string;
  username: string;
  passwordHash?: string;
  password?: string;
  role: SijakaRole | 'Admin' | 'Anggota';
  nama?: string;
}

export interface UserSession {
  session_id: string;
  user_id?: string;
  username: string;
  role?: SijakaRole | 'Admin' | 'Anggota';
  created_at?: string;
  expires_at?: string;
  status?: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
  last_login?: string;
  last_activity?: string;
  revoked_at?: string;
}

export type GranularPermission =
  | 'AUTH_READ_SELF'
  | 'LETTER_CREATE'
  | 'DEATH_REPORT_CREATE'
  | 'DEATH_REPORT_READ_SELF'
  | 'MEMBER_READ_ALL'
  | 'MEMBER_WRITE'
  | 'FAMILY_READ_ALL'
  | 'FAMILY_WRITE'
  | 'DEATH_VERIFY'
  | 'DEATH_APPROVE'
  | 'CLAIM_CREATE'
  | 'CLAIM_APPROVE'
  | 'PAYMENT_CREATE'
  | 'CASH_READ'
  | 'CASH_WRITE'
  | 'AUDIT_READ'
  | 'BACKUP_CREATE'
  | 'BACKUP_RESTORE'
  | 'CONFIG_READ'
  | 'CONFIG_WRITE'
  | 'DATABASE_RESET'
  | 'RECONCILIATION_RUN';

export interface AuditLogEntry {
  auditId: string;
  timestamp: string;
  userId: string;
  role: 'Admin' | 'Anggota' | 'System';
  action: string;
  resource: string;
  resourceId?: string;
  requestId: string;
  result: 'SUCCESS' | 'BLOCKED' | 'FAILED' | 'WARNING';
  details: string;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
}

export interface BackupRecord {
  backupId: string;
  timestamp: string;
  type: 'MANUAL_ADMIN' | 'AUTO_PRE_RESET' | 'AUTO_PRE_RESTORE' | 'DAILY_SCHEDULED';
  recordCounts: {
    anggota: number;
    keluarga: number;
    kematian: number;
    iuran: number;
    bukukas: number;
    santunan: number;
    pelayanan: number;
  };
  checksum: string;
  status: 'VERIFIED' | 'FAILED';
  createdBy: string;
  payloadJson: string;
}

export interface ReconciliationResult {
  timestamp: string;
  saldoAwal: number;
  totalPemasukan: number;
  totalPengeluaran: number;
  saldoSeharusnya: number;
  saldoBukuKas: number;
  difference: number;
  status: 'RECONCILED_MATCH' | 'RECONCILIATION_MISMATCH';
  severity: 'HEALTHY' | 'CRITICAL';
  claimsVerifiedCount: number;
  claimsTotalNominal: number;
  unmatchedClaims: string[];
  unmatchedIuran: string[];
  notes: string;
}

export interface SecurityTestResult {
  id: string;
  category: 'AUTH' | 'RBAC' | 'IDOR' | 'IDEMPOTENCY' | 'FINANCE' | 'WEBHOOK' | 'PRIVACY' | 'BACKUP';
  title: string;
  description: string;
  status: 'PASSED' | 'FAILED' | 'BLOCKED' | 'NOT_VERIFIED';
  detail: string;
}

export interface PelayananJenazah {
  ID_Laporan: string;
  Petugas: string;
  Dimandikan: 'Sudah' | 'Belum' | boolean;
  Dikafani: 'Sudah' | 'Belum' | boolean;
  Disalatkan: 'Sudah' | 'Belum' | boolean;
  Dimakamkan: 'Sudah' | 'Belum' | boolean;
}

export interface SantunanKematian {
  ID_Laporan: string;
  Tgl_Pencairan: string;
  Nama_Penerima: string;
  Nominal_Santunan: number;
}

export interface KeluargaMember {
  id: string; // e.g. KLG-001
  id_anggota: string; // ANG-001
  nik: string;
  nama: string;
  hubungan: 'Suami' | 'Istri' | 'Anak' | 'Orang Tua' | 'Mertua' | 'Lainnya';
  tanggal_lahir?: string;
  status: 'Hidup' | 'Meninggal';
}

export interface Anggota {
  id: string; // e.g. ANG-001
  nik: string;
  nama: string;
  alamat: string;
  no_hp: string;
  status: 'Aktif' | 'Nonaktif';
  jumlah_keluarga?: number;
  keluarga?: KeluargaMember[];
}

export interface Kematian {
  id_laporan: string; // e.g. LPK-001
  tanggal_lapor: string;
  id_anggota: string;
  waktu_kematian: string;
  tempat: string;
  status: 'Menunggu Verifikasi' | 'Terverifikasi' | 'Selesai';
  catatan?: string;
}

export interface Iuran {
  id_iuran: string; // e.g. IRN-001
  tanggal: string;
  id_anggota: string;
  bulan_tahun: string;
  nominal: number;
  keterangan: string;
}

export interface BukuKas {
  id_kas: string; // e.g. KAS-001
  tanggal: string;
  tipe: 'Masuk' | 'Keluar';
  nominal: number;
  keterangan: string;
}

export type IuranRecord = Iuran;
export type KematianRecord = Kematian;
export type BukuKasRecord = BukuKas;

export interface FonnteConfig {
  fonnteToken: string;
  nomorKetua: string;
  nomorBendahara: string;
  nomorSekretaris: string;
  nomorOperasional: string;
  autoBroadcast: boolean;
  spreadsheetId?: string;
  spreadsheetUrl?: string;
  apiUrl?: string;
  gasExecUrl?: string; // deprecated alias
  environment?: 'production' | 'staging' | 'development';
}

export interface ChatMessage {
  id: string;
  sender: string; // e.g. "628123456789"
  senderName: string;
  isGroup: boolean;
  message: string;
  timestamp: string;
  type: 'incoming' | 'outgoing' | 'system';
  status?: 'ignored_spam' | 'processed' | 'broadcast';
}

export interface BroadcastLog {
  id: string;
  timestamp: string;
  target: string;
  message: string;
  status: 'SENT' | 'FAILED' | 'NOT_CONFIGURED';
  statusNote?: string;
}
