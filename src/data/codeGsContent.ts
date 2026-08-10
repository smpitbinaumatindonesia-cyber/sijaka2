export const CODE_GS_CONTENT = `/**
 * ==============================================================================
 * SIJAKA - Sistem Informasi Jaminan Kematian Anggota
 * Full Backend Script (Code.gs) for Google Apps Script & Fonnte WhatsApp API
 * ==============================================================================
 * 
 * PETUNJUK PENGGUNAAN:
 * 1. Buka Google Sheets Anda (Database SIJAKA).
 * 2. Klik menu 'Ekstensi' > 'Apps Script'.
 * 3. Hapus kode default, lalu PASTE SELURUH KODE INI ke dalam file 'Code.gs'.
 * 4. Buat file baru bernama 'Index.html' di Apps Script dan salin isi file Index.html.
 * 5. Sesuaikan SPREADSHEET_ID dan FONNTE_TOKEN di bawah ini.
 * 6. Klik 'Deploy' > 'Deployment Baru' > Pilih Jenis: 'Aplikasi Web'.
 * 7. Akses: 'Siapa saja' (Anyone), jalankan sebagai 'Saya'.
 * 8. Copy URL Web App yang dihasilkan untuk didaftarkan ke Webhook Fonnte.
 * ==============================================================================
 */

// CONFIGURATION & CONSTANTS
const SPREADSHEET_ID = '1ZrYAwb8PTg-nTR-6H8HF3c9J130bnhwX-rElXrL-i5E'; // ID Google Spreadsheet Database SIJAKA Anda
const FONNTE_TOKEN = 'YOUR_FONNTE_TOKEN_HERE'; // Ganti dengan Token Fonnte WhatsApp API Anda

// NOMOR WHATSAPP PENGURUS SIJAKA (Untuk WA Broadcast Notifikasi Kematian)
const PENGURUS_NO = {
  KETUA: '081234567890',
  BENDAHARA: '081298765432',
  SEKRETARIS: '085712345678',
  OPERASIONAL: '088801234567'
};

/**
 * Helper Membuka Spreadsheet
 */
function getSpreadsheet() {
  if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== '' && SPREADSHEET_ID !== 'YOUR_SPREADSHEET_ID_HERE') {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Inisialisasi Database Sheet jika belum ada
 */
function setupDatabaseSheets() {
  const ss = getSpreadsheet();
  
  // Sheet 'Anggota'
  let sheetAnggota = ss.getSheetByName('Anggota');
  if (!sheetAnggota) {
    sheetAnggota = ss.insertSheet('Anggota');
    sheetAnggota.appendRow(['ID', 'NIK', 'Nama', 'Alamat', 'No_HP', 'Status']);
    sheetAnggota.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#1e293b').setFontColor('#ffffff');
    // Sample Data
    sheetAnggota.appendRow(['ANG-001', '3201012304850001', 'Budi Santoso', 'Jl. Merdeka No. 12', '081234567891', 'Aktif']);
    sheetAnggota.appendRow(['ANG-002', '3201011508790002', 'Siti Rahmawati', 'Jl. Mawar No. 05', '085712345672', 'Aktif']);
    sheetAnggota.appendRow(['ANG-003', '3201012211900003', 'Ahmad Hidayat', 'Jl. Melati No. 88', '088899900011', 'Aktif']);
  }

  // Sheet 'Keluarga'
  let sheetKeluarga = ss.getSheetByName('Keluarga');
  if (!sheetKeluarga) {
    sheetKeluarga = ss.insertSheet('Keluarga');
    sheetKeluarga.appendRow(['id', 'id_anggota', 'nik', 'nama', 'hubungan', 'status']);
    sheetKeluarga.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#1e293b').setFontColor('#ffffff');
    sheetKeluarga.appendRow(['KLG-001', 'ANG-001', '3201015504870001', 'Dewi Lestari', 'Istri', 'Hidup']);
    sheetKeluarga.appendRow(['KLG-002', 'ANG-001', '3201011210120002', 'Rizky Santoso', 'Anak', 'Hidup']);
    sheetKeluarga.appendRow(['KLG-003', 'ANG-002', '3201010101650003', 'Bambang Raharjo', 'Suami', 'Hidup']);
    sheetKeluarga.appendRow(['KLG-004', 'ANG-003', '3201011802950004', 'Nurlaila Hidayat', 'Istri', 'Hidup']);
    sheetKeluarga.appendRow(['KLG-005', 'ANG-004', '3201012512920005', 'Anisa Kurniawan', 'Istri', 'Hidup']);
  }

  // Sheet 'Kematian'
  let sheetKematian = ss.getSheetByName('Kematian');
  if (!sheetKematian) {
    sheetKematian = ss.insertSheet('Kematian');
    sheetKematian.appendRow(['ID_Laporan', 'Tanggal_Lapor', 'ID_Anggota', 'Waktu_Kematian', 'Tempat', 'Status']);
    sheetKematian.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#1e293b').setFontColor('#ffffff');
    sheetKematian.appendRow(['LPK-001', '2026-08-01', 'ANG-001', '2026-08-01 04:30', 'RS Daerah', 'Selesai']);
  }

  // Sheet 'Iuran'
  let sheetIuran = ss.getSheetByName('Iuran');
  if (!sheetIuran) {
    sheetIuran = ss.insertSheet('Iuran');
    sheetIuran.appendRow(['ID_Iuran', 'Tanggal', 'ID_Anggota', 'Bulan_Tahun', 'Nominal', 'Keterangan']);
    sheetIuran.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#1e293b').setFontColor('#ffffff');
    sheetIuran.appendRow(['IRN-001', '2026-08-02', 'ANG-001', 'Agustus 2026', 50000, 'Iuran Rutin Bulanan']);
    sheetIuran.appendRow(['IRN-002', '2026-08-03', 'ANG-002', 'Agustus 2026', 50000, 'Iuran Rutin Bulanan']);
  }

  // Sheet 'BukuKas'
  let sheetBukuKas = ss.getSheetByName('BukuKas');
  if (!sheetBukuKas) {
    sheetBukuKas = ss.insertSheet('BukuKas');
    sheetBukuKas.appendRow(['ID_Kas', 'Tanggal', 'Tipe', 'Nominal', 'Keterangan']);
    sheetBukuKas.getRange(1, 1, 1, 5).setFontWeight('bold').setBackground('#1e293b').setFontColor('#ffffff');
    sheetBukuKas.appendRow(['KAS-001', '2026-08-01', 'Masuk', 10000000, 'Saldo Awal Kas SIJAKA']);
    sheetBukuKas.appendRow(['KAS-002', '2026-08-02', 'Masuk', 50000, 'Iuran ANG-001 Agustus 2026']);
    sheetBukuKas.appendRow(['KAS-003', '2026-08-03', 'Masuk', 50000, 'Iuran ANG-002 Agustus 2026']);
    sheetBukuKas.appendRow(['KAS-004', '2026-08-05', 'Keluar', 2500000, 'Santunan Kematian ANG-001']);
  }

  // Sheet 'Users'
  let sheetUsers = ss.getSheetByName('Users');
  if (!sheetUsers) {
    sheetUsers = ss.insertSheet('Users');
    sheetUsers.appendRow(['id_user', 'username', 'password', 'role']);
    sheetUsers.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#1e293b').setFontColor('#ffffff');
    sheetUsers.appendRow(['U001', 'admin', 'admin123', 'Admin']);
    sheetUsers.appendRow(['Ketua', 'Wardjo', 'Wardjo123', 'Admin']);
    sheetUsers.appendRow(['Bend1', 'Imam', 'Imam123', 'Admin']);
    sheetUsers.appendRow(['Bend2', 'Dino', 'Dino123', 'Admin']);
  }

  // Sheet 'Sessions'
  let sheetSessions = ss.getSheetByName('Sessions');
  if (!sheetSessions) {
    sheetSessions = ss.insertSheet('Sessions');
    sheetSessions.appendRow(['session_id', 'username', 'last_login']);
    sheetSessions.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#1e293b').setFontColor('#ffffff');
    sheetSessions.appendRow(['SES-001', 'admin', '2026-08-09 18:40:00']);
    sheetSessions.appendRow(['SES-002', 'Wardjo', '2026-08-09 08:15:00']);
  }

  // Sheet 'Pelayanan'
  let sheetPelayanan = ss.getSheetByName('Pelayanan');
  if (!sheetPelayanan) {
    sheetPelayanan = ss.insertSheet('Pelayanan');
    sheetPelayanan.appendRow(['ID_Laporan', 'Petugas', 'Dimandikan', 'Dikafani', 'Disalatkan', 'Dimakamkan']);
    sheetPelayanan.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#1e293b').setFontColor('#ffffff');
    sheetPelayanan.appendRow(['LPK-001', 'Dedi Kurniawan & Tim Operasional', 'Sudah', 'Sudah', 'Sudah', 'Sudah']);
  }

  // Sheet 'Santunan'
  let sheetSantunan = ss.getSheetByName('Santunan');
  if (!sheetSantunan) {
    sheetSantunan = ss.insertSheet('Santunan');
    sheetSantunan.appendRow(['ID_Laporan', 'Tgl_Pencairan', 'Nama_Penerima', 'Nominal_Santunan']);
    sheetSantunan.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#1e293b').setFontColor('#ffffff');
    sheetSantunan.appendRow(['LPK-001', '2026-08-05', 'Dewi Lestari (Ahli Waris ANG-001)', 2500000]);
  }

  return "Database SIJAKA siap digunakan dengan 9 Sheet Terpadu!";
}

/**
 * Web App Handler (doGet) - Menampilkan Web Dashboard SIJAKA
 */
function doGet(e) {
  setupDatabaseSheets();
  const template = HtmlService.createTemplateFromFile('Index');
  return template.evaluate()
    .setTitle('SIJAKA - Sistem Informasi Jaminan Kematian Anggota')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Helper Include HTML File
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Webhook Handler (doPost) - Menerima Data dari Fonnte WhatsApp API
 */
function doPost(e) {
  try {
    let postData;
    if (e.postData && e.postData.contents) {
      postData = JSON.parse(e.postData.contents);
    } else {
      postData = e.parameter || {};
    }

    const sender = postData.sender || postData.from || '';
    const message = (postData.message || postData.text || '').trim();
    const isGroup = postData.isGroup || (sender.indexOf('-') !== -1) || false;

    // -------------------------------------------------------------------
    // RULE 1: ANTI-SPAM GRUP
    // Abaikan semua pesan dari Grup WhatsApp
    // -------------------------------------------------------------------
    if (isGroup || sender.includes('-')) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'ignored', reason: 'Group Message' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Process Message Engine
    const responseText = processIncomingMessage(sender, message);

    if (responseText) {
      sendFonnteMessage(sender, responseText);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'success', messageSent: !!responseText }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * LOGIKA BOT WHATSAPP & PENANGANAN PESAN
 */
function processIncomingMessage(sender, rawMessage) {
  const message = rawMessage.trim();
  const lowerMsg = message.toLowerCase();

  // -------------------------------------------------------------------
  // RULE 2: SAPAAN UMUM & PENANGKAP NOMOR / MENU SALAH
  // -------------------------------------------------------------------
  const generalGreetings = ['halo', 'hi', 'hello', 'pagi', 'selamat pagi', 'siang', 'sore', 'malam', 'ping', 'p', 'assalamualaikum', 'salam'];
  if (generalGreetings.includes(lowerMsg) || lowerMsg === 'menu') {
    return getMenuMessage();
  }

  // Jika mengetik angka 1 - 8
  if (/^[1-8]$/.exec(message)) {
    return handleNumericMenu(parseInt(message, 10), sender);
  }

  // Jika mengetik angka di luar 1-8 (misal '9', '0', '99')
  if (/^\\d+$/.exec(message) && !['1','2','3','4','5','6','7','8'].includes(message)) {
    return "⚠️ *Pilihan Menu Tidak Valid!*\\n\\nAnda memasukkan angka: *" + message + "*\\nPilihan menu yang tersedia hanya angka *1* sampai *8*.\\n\\nSilakan ketik *menu* atau angka *1* - *8* untuk mengakses layanan SIJAKA.";
  }

  // -------------------------------------------------------------------
  // RULE 3: PERINTAH BAKU (#bayariuran & #laporkematian)
  // -------------------------------------------------------------------
  if (message.startsWith('#bayariuran')) {
    return handleBayarIuranCmd(sender, message);
  }

  if (message.startsWith('#laporkematian')) {
    return handleLaporKematianCmd(sender, message);
  }

  // -------------------------------------------------------------------
  // RULE 4: ANTI-SPAM PESAN TIDAK DIKENALI
  // Pesan chat pribadi yang tidak dikenali/salah HANYA dibalas jika diawali '#' atau '!'
  // Jika tidak diawali '#' atau '!', BOT mengabaikannya (return null) agar tidak mengganggu pengguna.
  // -------------------------------------------------------------------
  if (message.startsWith('#') || message.startsWith('!')) {
    return "⚠️ *Perintah Tidak Dikenali!*\\n\\nPerintah *" + message + "* tidak terdaftar dalam sistem SIJAKA.\\n\\n*Perintah Baku:*\\n• *#bayariuran|ID_Anggota|Bulan_Tahun|Nominal|Keterangan*\\n• *#laporkematian|ID_Anggota|WaktuKematian|Tempat*\\n\\nKetik *menu* untuk melihat daftar opsi.";
  }

  // Abaikan pesan acak biasa (Anti-Spam Silent Ignore)
  return null;
}

/**
 * Teks Menu Utama
 */
function getMenuMessage() {
  return "🏛️ *SISTEM INFORMASI JAMINAN KEMATIAN ANGGOTA (SIJAKA)* 🏛️\\n" +
         "========================================\\n\\n" +
         "Selamat datang di Layanan Bot Resmi SIJAKA.\\n" +
         "Silakan ketik angka *1* s/d *8* sesuai kebutuhan Anda:\\n\\n" +
         "1️⃣ *Info Layanan & Profil SIJAKA*\\n" +
         "2️⃣ *Cek Status Anggota*\\n" +
         "3️⃣ *Format Pembayaran Iuran*\\n" +
         "4️⃣ *Format Pelaporan Kematian*\\n" +
         "5️⃣ *Cek Saldo Kas SIJAKA*\\n" +
         "6️⃣ *Cek Status Laporan Kematian*\\n" +
         "7️⃣ *Kontak Pengurus SIJAKA*\\n" +
         "8️⃣ *Bantuan & Panduan Penggunaan*\\n\\n" +
         "----------------------------------------\\n" +
         "💡 *Aturan Perintah Langsung:*\\n" +
         "• Bayar Iuran: *#bayariuran|ID_Anggota|Bulan_Tahun|Nominal|Keterangan*\\n" +
         "• Lapor Kematian: *#laporkematian|ID_Anggota|WaktuKematian|Tempat*";
}

/**
 * Penanganan Menu 1-8
 */
function handleNumericMenu(option, sender) {
  switch (option) {
    case 1:
      return "ℹ️ *PROFIL & LAYANAN SIJAKA*\\n\\n" +
             "SIJAKA adalah program perlindungan sosial anggota untuk memberikan santunan jaminan kematian tepat waktu.\\n\\n" +
             "• *Besaran Iuran:* Rp 50.000 / Bulan\\n" +
             "• *Santunan Kematian:* Rp 2.500.000 / Anggota\\n" +
             "• *Proses Verifikasi:* Maksimal 1x24 Jam";

    case 2:
      const dataAnggota = getAnggotaByNoHp(sender);
      if (dataAnggota) {
        return "👤 *DATA ANGGOTA SIJAKA*\\n\\n" +
               "• *ID Anggota:* " + dataAnggota.id + "\\n" +
               "• *NIK:* " + dataAnggota.nik + "\\n" +
               "• *Nama:* " + dataAnggota.nama + "\\n" +
               "• *Alamat:* " + dataAnggota.alamat + "\\n" +
               "• *Status:* " + (dataAnggota.status === 'Aktif' ? '✅ Aktif' : '❌ Nonaktif');
      } else {
        return "⚠️ *Nomor WA Anda (" + sender + ") Belum Terdaftar!*\\n\\n" +
               "Silakan hubungi Pengurus SIJAKA untuk melakukan pendaftaran Anggota baru.";
      }

    case 3:
      return "💳 *FORMAT PEMBAYARAN IURAN*\\n\\n" +
             "Gunakan format berikut untuk mencatat pembayaran iuran:\\n\\n" +
             "*#bayariuran|ID_Anggota|Bulan_Tahun|Nominal|Keterangan*\\n\\n" +
             "_Contoh:_\\n" +
             "*#bayariuran|ANG-001|Agustus 2026|50000|Iuran Rutin*";

    case 4:
      return "🚨 *FORMAT PELAPORAN KEMATIAN*\\n\\n" +
             "Gunakan format berikut untuk melaporkan kematian anggota:\\n\\n" +
             "*#laporkematian|ID_Anggota|WaktuKematian|Tempat*\\n\\n" +
             "_Contoh:_\\n" +
             "*#laporkematian|ANG-001|09-08-2026 04:30|RS Merdeka*\\n\\n" +
             "⚠️ _Sistem akan otomatis mengirimkan notifikasi broadcast ke seluruh Pengurus & Kontak Keluarga._";

    case 5:
      const kasInfo = getSummaryBukuKas();
      return "💰 *RINGKASAN BUKU KAS SIJAKA*\\n\\n" +
             "• *Total Kas Masuk:* " + formatRupiah(kasInfo.masuk) + "\\n" +
             "• *Total Kas Keluar:* " + formatRupiah(kasInfo.keluar) + "\\n" +
             "----------------------------------------\\n" +
             "💵 *SALDO AKHIR KAS:* *" + formatRupiah(kasInfo.saldo) + "*";

    case 6:
      const lapKematian = getLastKematianReport();
      if (lapKematian) {
        return "📋 *STATUS LAPORAN KEMATIAN TERAKHIR*\\n\\n" +
               "• *ID Laporan:* " + lapKematian.id_laporan + "\\n" +
               "• *ID Anggota:* " + lapKematian.id_anggota + "\\n" +
               "• *Waktu Kematian:* " + lapKematian.waktu_kematian + "\\n" +
               "• *Tempat:* " + lapKematian.tempat + "\\n" +
               "• *Status:* *" + lapKematian.status + "*";
      } else {
        return "ℹ️ Belum ada laporan kematian yang tersimpan dalam sistem.";
      }

    case 7:
      return "📞 *KONTAK PENGURUS SIJAKA*\\n\\n" +
             "1. Ketua: " + PENGURUS_NO.KETUA + "\\n" +
             "2. Bendahara: " + PENGURUS_NO.BENDAHARA + "\\n" +
             "3. Sekretaris: " + PENGURUS_NO.SEKRETARIS + "\\n" +
             "4. Tim Operasional: " + PENGURUS_NO.OPERASIONAL;

    case 8:
      return "📖 *PANDUAN PENGGUNAAN BOT*\\n\\n" +
             "1. Ketik *menu* untuk melihat opsi utama.\\n" +
             "2. Ketik angka *1-8* untuk informasi cepat.\\n" +
             "3. Gunakan awalan *#* untuk melakukan transaksi atau pelaporan.\\n" +
             "4. Nominal otomatis dibersihkan dari simbol huruf/titik/koma.";

    default:
      return getMenuMessage();
  }
}

/**
 * PEMBERSIH NOMINAL AUTOMATIS (REGEXP /[^0-9]/g)
 * Mencegah error pada Buku Kas akibat karakter unik (misal: "Rp 50.000,-")
 */
function cleanNominal(inputVal) {
  if (typeof inputVal === 'number') return inputVal;
  if (!inputVal) return 0;
  const cleanedStr = String(inputVal).replace(/[^0-9]/g, '');
  const parsed = parseInt(cleanedStr, 10);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Perintah #bayariuran
 * Format: #bayariuran|ID_Anggota|Bulan_Tahun|Nominal|Keterangan
 */
function handleBayarIuranCmd(sender, message) {
  const parts = message.split('|');
  if (parts.length < 4) {
    return "❌ *Format Pembayaran Iuran Salah!*\\n\\nGunakan format:\\n*#bayariuran|ID_Anggota|Bulan_Tahun|Nominal|Keterangan*\\n\\n_Contoh:_\\n#bayariuran|ANG-001|Agustus 2026|50000|Iuran Bulanan";
  }

  const idAnggota = parts[1].trim();
  const bulanTahun = parts[2].trim();
  const rawNominal = parts[3].trim();
  const keterangan = parts[4] ? parts[4].trim() : 'Iuran Anggota via WA';

  // Pembersih nominal otomatis
  const nominal = cleanNominal(rawNominal);

  if (nominal <= 0) {
    return "❌ Nominal iuran tidak valid! Masukkan angka nominal yang benar (misal 50000).";
  }

  // Validasi ID Anggota
  const anggota = getAnggotaById(idAnggota);
  if (!anggota) {
    return "❌ Anggota dengan ID *" + idAnggota + "* tidak ditemukan dalam database SIJAKA!";
  }

  const ss = getSpreadsheet();
  const sheetIuran = ss.getSheetByName('Iuran');
  const sheetBukuKas = ss.getSheetByName('BukuKas');

  const nowStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  const idIuran = 'IRN-' + Math.floor(1000 + Math.random() * 9000);
  const idKas = 'KAS-' + Math.floor(1000 + Math.random() * 9000);

  // Simpan ke Sheet 'Iuran'
  sheetIuran.appendRow([idIuran, nowStr, idAnggota, bulanTahun, nominal, keterangan]);

  // Simpan Otomatis ke Sheet 'BukuKas'
  sheetBukuKas.appendRow([idKas, nowStr, 'Masuk', nominal, 'Iuran ' + idAnggota + ' (' + anggota.nama + ') - ' + bulanTahun]);

  return "✅ *PEMBAYARAN IURAN BERHASIL DICATAT!*\\n\\n" +
         "• *ID Transaksi:* " + idIuran + "\\n" +
         "• *ID Anggota:* " + idAnggota + " (" + anggota.nama + ")\\n" +
         "• *Periode:* " + bulanTahun + "\\n" +
         "• *Nominal:* " + formatRupiah(nominal) + "\\n" +
         "• *Status Buku Kas:* Catatan Kas Masuk " + idKas + "\\n\\n" +
         "Terima kasih atas partisipasi Anda dalam SIJAKA.";
}

/**
 * Perintah #laporkematian
 * Format: #laporkematian|ID_Anggota|WaktuKematian|Tempat
 */
function handleLaporKematianCmd(sender, message) {
  const parts = message.split('|');
  if (parts.length < 4) {
    return "❌ *Format Pelaporan Kematian Salah!*\\n\\nGunakan format:\\n*#laporkematian|ID_Anggota|WaktuKematian|Tempat*\\n\\n_Contoh:_\\n#laporkematian|ANG-001|09-08-2026 04:30|RS Merdeka";
  }

  const idAnggota = parts[1].trim();
  const waktuKematian = parts[2].trim();
  const tempat = parts[3].trim();

  const anggota = getAnggotaById(idAnggota);
  if (!anggota) {
    return "❌ Anggota dengan ID *" + idAnggota + "* tidak ditemukan!";
  }

  const ss = getSpreadsheet();
  const sheetKematian = ss.getSheetByName('Kematian');

  const nowStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  const idLaporan = 'LPK-' + Math.floor(1000 + Math.random() * 9000);

  // Simpan Laporan Kematian
  sheetKematian.appendRow([idLaporan, nowStr, idAnggota, waktuKematian, tempat, 'Menunggu Verifikasi']);

  // Data Objek untuk Notifikasi
  const dataLaporan = {
    id_laporan: idLaporan,
    tanggal_lapor: nowStr,
    id_anggota: idAnggota,
    nama_anggota: anggota.nama,
    no_hp_anggota: anggota.no_hp,
    waktu_kematian: waktuKematian,
    tempat: tempat,
    status: 'Menunggu Verifikasi'
  };

  // BROADCAST NOTIFIKASI KEMATIAN OTOMATIS
  broadcastDeathNotification(dataLaporan, anggota);

  return "🚨 *LAPORAN KEMATIAN BERHASIL DITERIMA* 🚨\\n\\n" +
         "• *ID Laporan:* " + idLaporan + "\\n" +
         "• *ID / Nama:* " + idAnggota + " / " + anggota.nama + "\\n" +
         "• *Waktu Kematian:* " + waktuKematian + "\\n" +
         "• *Tempat:* " + tempat + "\\n" +
         "• *Status:* Menunggu Verifikasi Pengurus\\n\\n" +
         "📲 *Sistem telah secara otomatis mengirimkan notifikasi WA Broadcast ke Pengurus SIJAKA dan Keluarga/Ahli Waris.*";
}

/**
 * NOTIFIKASI OTOMATIS KEMATIAN VIA FONNTE BROADCAST
 * Mengirim pesan ke Pengurus & Ahli Waris secara bersamaan
 */
function broadcastDeathNotification(laporan, anggota) {
  const broadcastMsg = 
    "🚨 *NOTIFIKASI URGENT: LAPORAN KEMATIAN ANGGOTA SIJAKA* 🚨\\n" +
    "========================================\\n\\n" +
    "Innalillahi wa inna ilaihi raji'un.\\n" +
    "Telah diterima laporan kematian anggota SIJAKA:\\n\\n" +
    "• *ID Laporan:* " + laporan.id_laporan + "\\n" +
    "• *ID Anggota:* " + laporan.id_anggota + "\\n" +
    "• *Nama Almarhum/ah:* *" + anggota.nama + "*\\n" +
    "• *NIK:* " + anggota.nik + "\\n" +
    "• *Alamat:* " + anggota.alamat + "\\n" +
    "• *Waktu Kematian:* " + laporan.waktu_kematian + "\\n" +
    "• *Tempat:* " + laporan.tempat + "\\n" +
    "• *No. HP / Ahli Waris:* " + anggota.no_hp + "\\n\\n" +
    "----------------------------------------\\n" +
    "📌 *TINDAKAN PENGURUS:*\\n" +
    "Mohon Tim Operasional & Bendahara segera melakukan verifikasi lapangan dan pemrosesan dana santunan.\\n\\n" +
    "_Pesan Otomatis oleh SIJAKA Backend System_";

  // Daftar penerima Broadcast: Seluruh Pengurus + Kontak Keluarga/Ahli Waris
  const recipientList = [
    PENGURUS_NO.KETUA,
    PENGURUS_NO.BENDAHARA,
    PENGURUS_NO.SEKRETARIS,
    PENGURUS_NO.OPERASIONAL,
    anggota.no_hp // Kontak Anggota / Ahli Waris
  ];

  // Kirim broadcast via Fonnte Multi-Target
  const targets = recipientList.filter(Boolean).join(',');
  sendFonnteMessage(targets, broadcastMsg);
}

/**
 * Helper Send Fonnte WhatsApp API Message
 */
function sendFonnteMessage(target, message) {
  if (!FONNTE_TOKEN || FONNTE_TOKEN === 'YOUR_FONNTE_TOKEN_HERE') {
    Logger.log("Fonnte Token belum diatur.");
    return;
  }

  const url = 'https://api.fonnte.com/send';
  const payload = {
    'target': target,
    'message': message,
    'countryCode': '62'
  };

  const options = {
    'method': 'post',
    'headers': {
      'Authorization': FONNTE_TOKEN
    },
    'payload': payload,
    'muteHttpExceptions': true
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    Logger.log("Fonnte Response: " + response.getContentText());
  } catch (err) {
    Logger.log("Error sending Fonnte message: " + err.toString());
  }
}

// -------------------------------------------------------------------
// HELPER DATABASE QUERY (Google Sheets)
// -------------------------------------------------------------------

function getAnggotaById(id) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName('Anggota');
  if (!sheet) return null;
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).toUpperCase() === String(id).toUpperCase()) {
      return {
        id: data[i][0],
        nik: data[i][1],
        nama: data[i][2],
        alamat: data[i][3],
        no_hp: data[i][4],
        status: data[i][5]
      };
    }
  }
  return null;
}

function getAnggotaByNoHp(noHp) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName('Anggota');
  if (!sheet) return null;
  const data = sheet.getDataRange().getValues();
  const cleanSearch = String(noHp).replace(/[^0-9]/g, '');
  for (let i = 1; i < data.length; i++) {
    const hpRow = String(data[i][4]).replace(/[^0-9]/g, '');
    if (hpRow === cleanSearch || hpRow.endsWith(cleanSearch.slice(-8))) {
      return {
        id: data[i][0],
        nik: data[i][1],
        nama: data[i][2],
        alamat: data[i][3],
        no_hp: data[i][4],
        status: data[i][5]
      };
    }
  }
  return null;
}

function getSummaryBukuKas() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName('BukuKas');
  let masuk = 0;
  let keluar = 0;
  if (sheet) {
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      const tipe = String(data[i][2]).trim();
      const nominal = cleanNominal(data[i][3]);
      if (tipe.toLowerCase() === 'masuk') {
        masuk += nominal;
      } else if (tipe.toLowerCase() === 'keluar') {
        keluar += nominal;
      }
    }
  }
  return {
    masuk: masuk,
    keluar: keluar,
    saldo: masuk - keluar
  };
}

function getLastKematianReport() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName('Kematian');
  if (!sheet) return null;
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return null;
  const lastRow = data[data.length - 1];
  return {
    id_laporan: lastRow[0],
    tanggal_lapor: lastRow[1],
    id_anggota: lastRow[2],
    waktu_kematian: lastRow[3],
    tempat: lastRow[4],
    status: lastRow[5]
  };
}

function formatRupiah(number) {
  return "Rp " + Number(number).toLocaleString('id-ID');
}

// -------------------------------------------------------------------
// API METHOD UNTUK WEB DASHBOARD (google.script.run)
// -------------------------------------------------------------------

function getDashboardData() {
  setupDatabaseSheets();
  const ss = getSpreadsheet();

  const getSheetData = (name) => {
    const sheet = ss.getSheetByName(name);
    if (!sheet) return [];
    const values = sheet.getDataRange().getValues();
    if (values.length <= 1) return [];
    const headers = values[0];
    return values.slice(1).map(row => {
      let obj = {};
      headers.forEach((h, idx) => {
        obj[String(h).toLowerCase()] = row[idx];
      });
      return obj;
    });
  };

  const anggota = getSheetData('Anggota');
  const keluarga = getSheetData('Keluarga');
  const kematian = getSheetData('Kematian');
  const iuran = getSheetData('Iuran');
  const bukukas = getSheetData('BukuKas');
  const users = getSheetData('Users');
  const sessions = getSheetData('Sessions');
  const pelayanan = getSheetData('Pelayanan');
  const santunan = getSheetData('Santunan');
  const summaryKas = getSummaryBukuKas();

  return {
    anggota: anggota,
    keluarga: keluarga,
    kematian: kematian,
    iuran: iuran,
    bukukas: bukukas,
    users: users,
    sessions: sessions,
    pelayanan: pelayanan,
    santunan: santunan,
    summaryKas: summaryKas
  };
}

function apiLoginUser(username, password) {
  const ss = getSpreadsheet();
  const sheetUsers = ss.getSheetByName('Users');
  const sheetSessions = ss.getSheetByName('Sessions');
  if (!sheetUsers) return { success: false, message: 'Sheet Users tidak ditemukan' };

  const values = sheetUsers.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    const rowUser = String(values[i][1]).trim();
    const rowPass = String(values[i][2]).trim();
    if (rowUser.toLowerCase() === String(username).trim().toLowerCase() && rowPass === String(password).trim()) {
      const sessionId = 'SES-' + Math.floor(1000 + Math.random() * 9000);
      const nowStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
      if (sheetSessions) {
        sheetSessions.appendRow([sessionId, rowUser, nowStr]);
      }
      return {
        success: true,
        session_id: sessionId,
        user: {
          id_user: values[i][0],
          username: values[i][1],
          role: values[i][3]
        }
      };
    }
  }
  return { success: false, message: 'Username atau Password salah!' };
}

function apiSubmitPelayanan(data) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName('Pelayanan');
  if (!sheet) return { success: false };

  sheet.appendRow([
    data.id_laporan || data.ID_Laporan,
    data.petugas || data.Petugas,
    data.dimandikan || data.Dimandikan || 'Sudah',
    data.dikafani || data.Dikafani || 'Sudah',
    data.disalatkan || data.Disalatkan || 'Sudah',
    data.dimakamkan || data.Dimakamkan || 'Sudah'
  ]);
  return { success: true };
}

function apiSubmitSantunan(data) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName('Santunan');
  if (!sheet) return { success: false };

  const nominal = cleanNominal(data.nominal_santunan || data.Nominal_Santunan);
  sheet.appendRow([
    data.id_laporan || data.ID_Laporan,
    data.tgl_pencairan || data.Tgl_Pencairan,
    data.nama_penerima || data.Nama_Penerima,
    nominal
  ]);
  return { success: true };
}

function apiSubmitKematian(data) {
  const ss = getSpreadsheet();
  const sheetKematian = ss.getSheetByName('Kematian');
  const idLaporan = 'LPK-' + Math.floor(1000 + Math.random() * 9000);
  const nowStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');

  sheetKematian.appendRow([
    idLaporan,
    nowStr,
    data.id_anggota,
    data.waktu_kematian,
    data.tempat,
    'Menunggu Verifikasi'
  ]);

  const anggota = getAnggotaById(data.id_anggota) || { nama: 'Anggota', nik: '-', alamat: '-', no_hp: '-' };

  // Broadcast notifikasi WA
  broadcastDeathNotification({
    id_laporan: idLaporan,
    id_anggota: data.id_anggota,
    waktu_kematian: data.waktu_kematian,
    tempat: data.tempat
  }, anggota);

  return { success: true, id_laporan: idLaporan };
}

function apiSubmitIuran(data) {
  const nominal = cleanNominal(data.nominal);
  const ss = getSpreadsheet();
  const sheetIuran = ss.getSheetByName('Iuran');
  const sheetBukuKas = ss.getSheetByName('BukuKas');

  const idIuran = 'IRN-' + Math.floor(1000 + Math.random() * 9000);
  const idKas = 'KAS-' + Math.floor(1000 + Math.random() * 9000);
  const nowStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');

  sheetIuran.appendRow([
    idIuran,
    nowStr,
    data.id_anggota,
    data.bulan_tahun,
    nominal,
    data.keterangan || 'Iuran via Web App'
  ]);

  sheetBukuKas.appendRow([
    idKas,
    nowStr,
    'Masuk',
    nominal,
    'Iuran ' + data.id_anggota + ' - ' + data.bulan_tahun
  ]);

  return { success: true, id_iuran: idIuran };
}

function apiSubmitAnggota(data) {
  const ss = getSpreadsheet();
  const sheetAnggota = ss.getSheetByName('Anggota');
  const idAnggota = 'ANG-' + String(sheetAnggota.getLastRow()).padStart(3, '0');

  sheetAnggota.appendRow([
    idAnggota,
    data.nik,
    data.nama,
    data.alamat,
    data.no_hp,
    data.status || 'Aktif'
  ]);

  return { success: true, id_anggota: idAnggota };
}

function apiUpdateStatusKematian(idLaporan, statusBaru) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName('Kematian');
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(idLaporan)) {
      sheet.getRange(i + 1, 6).setValue(statusBaru);

      // Jika status diset Selesai / Terverifikasi, opsional buat pengeluaran santunan
      if (statusBaru === 'Terverifikasi') {
        const idAnggota = data[i][2];
        const sheetKas = ss.getSheetByName('BukuKas');
        const idKas = 'KAS-' + Math.floor(1000 + Math.random() * 9000);
        const nowStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
        sheetKas.appendRow([idKas, nowStr, 'Keluar', 2500000, 'Santunan Kematian ' + idAnggota + ' (' + idLaporan + ')']);
      }

      return { success: true };
    }
  }
  return { success: false, message: 'ID Laporan tidak ditemukan' };
}
`;
