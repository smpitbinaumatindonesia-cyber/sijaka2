export interface UserAccount {
  id_user: string;
  username: string;
  password?: string;
  role: string;
}

export interface UserSession {
  session_id: string;
  username: string;
  last_login: string;
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

export interface FonnteConfig {
  fonnteToken: string;
  nomorKetua: string;
  nomorBendahara: string;
  nomorSekretaris: string;
  nomorOperasional: string;
  autoBroadcast: boolean;
  spreadsheetId?: string;
  spreadsheetUrl?: string;
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
  status: 'SENT' | 'FAILED';
}
