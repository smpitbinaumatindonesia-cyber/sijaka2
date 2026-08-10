import { Anggota, KeluargaMember, Kematian, Iuran, BukuKas, ChatMessage, FonnteConfig, BroadcastLog, UserAccount, UserSession, PelayananJenazah, SantunanKematian } from '../types';
import { maskNik, maskPhone } from '../utils/formatters';

const LOCAL_STORAGE_KEY = 'SIJAKA_DB_V2';

const INITIAL_USERS: UserAccount[] = [
  { id_user: 'U001', username: 'admin', password: 'admin123', role: 'Admin' },
  { id_user: 'Ketua', username: 'Wardjo', password: 'Wardjo123', role: 'Admin' },
  { id_user: 'Bend1', username: 'Imam', password: 'Imam123', role: 'Admin' },
  { id_user: 'Bend2', username: 'Dino', password: 'Dino123', role: 'Admin' },
];

const INITIAL_SESSIONS: UserSession[] = [];
const INITIAL_PELAYANAN: PelayananJenazah[] = [];
const INITIAL_SANTUNAN: SantunanKematian[] = [];
const INITIAL_KELUARGA: KeluargaMember[] = [];
const INITIAL_ANGGOTA: Anggota[] = [];
const INITIAL_KEMATIAN: Kematian[] = [];
const INITIAL_IURAN: Iuran[] = [];
const INITIAL_BUKUKAS: BukuKas[] = [];

const INITIAL_CONFIG: FonnteConfig = {
  fonnteToken: 'FONNTE_DEMO_TOKEN_998811',
  nomorKetua: '081234567890',
  nomorBendahara: '081298765432',
  nomorSekretaris: '085712345678',
  nomorOperasional: '088801234567',
  autoBroadcast: true,
  spreadsheetId: '1b2bMaHY8TiuBtJQwCJgxRz3fzlJh6iakcgpDkhGvA_c',
  spreadsheetUrl: 'https://docs.google.com/spreadsheets/d/1b2bMaHY8TiuBtJQwCJgxRz3fzlJh6iakcgpDkhGvA_c/edit?usp=sharing'
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

  constructor() {
    try {
      localStorage.removeItem('SIJAKA_DB_V1');
    } catch (e) {}

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
        this.sessions = parsed.sessions || [];
        this.pelayanan = parsed.pelayanan || [];
        this.santunan = parsed.santunan || [];
        this.config = parsed.config || INITIAL_CONFIG;
        this.chatHistory = parsed.chatHistory || [];
        this.broadcastLogs = parsed.broadcastLogs || [];
      } catch (e) {
        this.anggota = [];
        this.keluarga = [];
        this.kematian = [];
        this.iuran = [];
        this.bukukas = [];
        this.users = [...INITIAL_USERS];
        this.sessions = [];
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
      this.sessions = [];
      this.pelayanan = [];
      this.santunan = [];
      this.config = { ...INITIAL_CONFIG };
      this.chatHistory = [];
      this.broadcastLogs = [];
      this.saveState();
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
  }

  public resetDatabase() {
    this.anggota = [];
    this.keluarga = [];
    this.kematian = [];
    this.iuran = [];
    this.bukukas = [];
    this.users = [...INITIAL_USERS];
    this.sessions = [];
    this.pelayanan = [];
    this.santunan = [];
    this.config = { ...INITIAL_CONFIG };
    this.chatHistory = [];
    this.broadcastLogs = [];
    this.saveState();
  }

  // Getters
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

  public getConfig() {
    return this.config;
  }

  public updateConfig(newConfig: Partial<FonnteConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.saveState();
  }

  public getChatHistory() {
    return this.chatHistory;
  }

  public getBroadcastLogs() {
    return this.broadcastLogs;
  }

  // Cleaner regex helper
  public cleanNominal(val: string | number): number {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    const cleanStr = String(val).replace(/[^0-9]/g, '');
    const num = parseInt(cleanStr, 10);
    return isNaN(num) ? 0 : num;
  }

  // API Methods for Web
  public submitKematian(data: { id_anggota: string; waktu_kematian: string; tempat: string }) {
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

    this.saveState();
    return { success: true, id_laporan: idLaporan };
  }

  public submitIuran(data: { id_anggota: string; bulan_tahun: string; nominal: number | string; keterangan?: string }) {
    const nominalClean = this.cleanNominal(data.nominal);
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
      data.keluargaAwal.forEach((k, idx) => {
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

    this.saveState();
    return { success: true, id_anggota: idAnggota };
  }

  public submitKeluarga(data: {
    id_anggota: string;
    nik: string;
    nama: string;
    hubungan: KeluargaMember['hubungan'];
    status?: 'Hidup' | 'Meninggal';
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
    this.saveState();
    return { success: true, id_keluarga: idKeluarga };
  }

  public updateAnggota(id: string, data: {
    nik?: string;
    nama?: string;
    alamat?: string;
    no_hp?: string;
    status?: 'Aktif' | 'Nonaktif';
  }) {
    const item = this.anggota.find(a => a.id.toUpperCase() === id.toUpperCase());
    if (item) {
      if (data.nik !== undefined) item.nik = data.nik;
      if (data.nama !== undefined) item.nama = data.nama;
      if (data.alamat !== undefined) item.alamat = data.alamat;
      if (data.no_hp !== undefined) item.no_hp = data.no_hp;
      if (data.status !== undefined) item.status = data.status;
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
  }) {
    const item = this.keluarga.find(k => k.id.toUpperCase() === id.toUpperCase());
    if (item) {
      if (data.nik !== undefined) item.nik = data.nik;
      if (data.nama !== undefined) item.nama = data.nama;
      if (data.hubungan !== undefined) item.hubungan = data.hubungan;
      if (data.status !== undefined) item.status = data.status;
      this.saveState();
      return { success: true };
    }
    return { success: false, message: 'Data keluarga tidak ditemukan' };
  }

  public deleteKeluarga(id: string) {
    const idx = this.keluarga.findIndex(k => k.id.toUpperCase() === id.toUpperCase());
    if (idx !== -1) {
      this.keluarga.splice(idx, 1);
      this.saveState();
      return { success: true };
    }
    return { success: false };
  }

  public deleteAnggota(id: string) {
    const idx = this.anggota.findIndex(a => a.id.toUpperCase() === id.toUpperCase());
    if (idx !== -1) {
      const deleted = this.anggota.splice(idx, 1)[0];
      // Also remove all family members belonging to this id_anggota
      this.keluarga = this.keluarga.filter(k => k.id_anggota.toUpperCase() !== id.toUpperCase());
      this.saveState();
      return { success: true, deleted };
    }
    return { success: false, message: 'Anggota tidak ditemukan' };
  }

  public updateKematianStatus(idLaporan: string, newStatus: 'Menunggu Verifikasi' | 'Terverifikasi' | 'Selesai') {
    const item = this.kematian.find(k => k.id_laporan === idLaporan);
    if (item) {
      item.status = newStatus;
      if (newStatus === 'Selesai' || newStatus === 'Terverifikasi') {
        const idKas = 'KAS-' + Math.floor(1000 + Math.random() * 9000);
        const today = new Date().toISOString().split('T')[0];
        
        // Check if kas entry exists
        const existingKas = this.bukukas.find(b => b.keterangan.includes(idLaporan));
        if (!existingKas) {
          this.bukukas.unshift({
            id_kas: idKas,
            tanggal: today,
            tipe: 'Keluar',
            nominal: 2500000,
            keterangan: `Santunan Kematian ${item.id_anggota} (${idLaporan})`
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
      this.saveState();
      return true;
    }
    return false;
  }

  public submitUser(data: { id_user: string; username: string; password?: string; role?: string }) {
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
  // WA BOT WEBHOOK SIMULATOR ENGINE (Exact replica of Code.gs doPost)
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
        const iuranList = this.iuran.filter(i => i.id_anggota.toUpperCase() === found.id.toUpperCase());
        const totalIuran = iuranList.reduce((acc, curr) => acc + curr.nominal, 0);
        return `📊 *LAPORAN IURAN ANGGOTA (${found.id} - ${found.nama})*\n\n• *Total Terbayar:* Rp ${totalIuran.toLocaleString('id-ID')}\n• *Jumlah Transaksi:* ${iuranList.length} kali\n• *Transaksi Terakhir:* ${iuranList[0] ? `${iuranList[0].bulan_tahun} (Rp ${iuranList[0].nominal.toLocaleString('id-ID')})` : 'Belum ada'}`;
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
      keterangan: keterangan
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
      tempat: tempat
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

    targets.forEach(t => {
      this.broadcastLogs.unshift({
        id: 'BC-' + Math.floor(100000 + Math.random() * 900000),
        timestamp: new Date().toLocaleTimeString('id-ID'),
        target: `${t.name} (${t.phone})`,
        message: messageText,
        status: 'SENT'
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
    updateKematianStatus: (id: string, st: any) => sijakaEngine.updateKematianStatus(id, st)
  };
}
