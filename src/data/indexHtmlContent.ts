export const INDEX_HTML_CONTENT = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SIJAKA - Web Dashboard</title>
  <!-- Bootstrap 5 CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- FontAwesome Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
  <style>
    :root {
      --primary-color: #0f172a;
      --accent-color: #2563eb;
      --bg-slate: #f8fafc;
    }
    body {
      background-color: var(--bg-slate);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    .navbar-sijaka {
      background-color: var(--primary-color);
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    }
    .card-stat {
      border: none;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      transition: transform 0.2s ease;
    }
    .card-stat:hover {
      transform: translateY(-2px);
    }
    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
    }
    .badge-status {
      font-weight: 600;
      padding: 0.35em 0.65em;
      border-radius: 20px;
    }
    .table-custom {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .table-custom th {
      background-color: #1e293b;
      color: white;
      font-weight: 500;
      border: none;
    }
  </style>
</head>
<body>

  <!-- NAVBAR -->
  <nav class="navbar navbar-expand-lg navbar-dark navbar-sijaka sticky-top py-3">
    <div class="container">
      <a class="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4" href="#">
        <i class="fa-solid fa-hands-holding-child text-primary"></i> SIJAKA
      </a>
      <span class="navbar-text text-light opacity-75 small">
        Sistem Informasi Jaminan Kematian Anggota
      </span>
      <div class="ms-auto d-flex align-items-center gap-2">
        <span class="badge bg-success"><i class="fa-solid fa-circle-check me-1"></i> Apps Script Active</span>
      </div>
    </div>
  </nav>

  <!-- MAIN CONTAINER -->
  <div class="container my-4">

    <!-- SUMMARY STAT CARDS -->
    <div class="row g-3 mb-4">
      <div class="col-md-3">
        <div class="card card-stat p-3 bg-white">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <div class="text-muted small fw-medium">Total Anggota</div>
              <h3 class="fw-bold mb-0 text-dark" id="stat-total-anggota">0</h3>
            </div>
            <div class="stat-icon bg-primary bg-opacity-10 text-primary">
              <i class="fa-solid fa-users"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card card-stat p-3 bg-white">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <div class="text-muted small fw-medium">Kas Masuk (Iuran)</div>
              <h3 class="fw-bold mb-0 text-success" id="stat-kas-masuk">Rp 0</h3>
            </div>
            <div class="stat-icon bg-success bg-opacity-10 text-success">
              <i class="fa-solid fa-arrow-down-left"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card card-stat p-3 bg-white">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <div class="text-muted small fw-medium">Kas Keluar (Santunan)</div>
              <h3 class="fw-bold mb-0 text-danger" id="stat-kas-keluar">Rp 0</h3>
            </div>
            <div class="stat-icon bg-danger bg-opacity-10 text-danger">
              <i class="fa-solid fa-arrow-up-right"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card card-stat p-3 bg-white">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <div class="text-muted small fw-medium">Saldo Kas Akhir</div>
              <h3 class="fw-bold mb-0 text-primary" id="stat-saldo-kas">Rp 0</h3>
            </div>
            <div class="stat-icon bg-info bg-opacity-10 text-info">
              <i class="fa-solid fa-wallet"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ACTION BUTTONS & NAV TABS -->
    <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
      <ul class="nav nav-pills bg-white p-1 rounded-3 shadow-sm" id="sijakaTab" role="tablist">
        <li class="nav-item">
          <button class="nav-link active fw-medium" id="kematian-tab" data-bs-toggle="tab" data-bs-target="#kematian-pane">
            <i class="fa-solid fa-triangle-exclamation me-1 text-danger"></i> Laporan Kematian
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link fw-medium" id="iuran-tab" data-bs-toggle="tab" data-bs-target="#iuran-pane">
            <i class="fa-solid fa-file-invoice-dollar me-1 text-success"></i> Data Iuran
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link fw-medium" id="anggota-tab" data-bs-toggle="tab" data-bs-target="#anggota-pane">
            <i class="fa-solid fa-address-book me-1 text-primary"></i> Data Anggota
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link fw-medium" id="bukukas-tab" data-bs-toggle="tab" data-bs-target="#bukukas-pane">
            <i class="fa-solid fa-book-bookmark me-1 text-info"></i> Buku Kas
          </button>
        </li>
      </ul>

      <div class="d-flex gap-2">
        <button class="btn btn-danger text-white fw-bold shadow-sm" data-bs-toggle="modal" data-bs-target="#modalLaporKematian">
          <i class="fa-solid fa-plus me-1"></i> Lapor Kematian
        </button>
        <button class="btn btn-success text-white fw-bold shadow-sm" data-bs-toggle="modal" data-bs-target="#modalInputIuran">
          <i class="fa-solid fa-money-bill-wave me-1"></i> Input Iuran
        </button>
        <button class="btn btn-outline-secondary bg-white fw-medium shadow-sm" onclick="loadDashboardData()">
          <i class="fa-solid fa-rotate me-1"></i> Refresh
        </button>
      </div>
    </div>

    <!-- TAB CONTENTS -->
    <div class="tab-content" id="sijakaTabContent">
      
      <!-- TAB 1: LAPORAN KEMATIAN -->
      <div class="tab-pane fade show active" id="kematian-pane">
        <div class="table-responsive table-custom">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>ID Laporan</th>
                <th>Tanggal Lapor</th>
                <th>ID Anggota</th>
                <th>Waktu Kematian</th>
                <th>Tempat Kematian</th>
                <th>Status Verifikasi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody id="tbody-kematian">
              <tr><td colspan="7" class="text-center py-4 text-muted">Memuat data laporan...</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 2: DATA IURAN -->
      <div class="tab-pane fade" id="iuran-pane">
        <div class="table-responsive table-custom">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>ID Iuran</th>
                <th>Tanggal</th>
                <th>ID Anggota</th>
                <th>Periode (Bulan/Tahun)</th>
                <th>Nominal</th>
                <th>Keterangan</th>
              </tr>
            </thead>
            <tbody id="tbody-iuran">
              <tr><td colspan="6" class="text-center py-4 text-muted">Memuat data iuran...</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 3: DATA ANGGOTA -->
      <div class="tab-pane fade" id="anggota-pane">
        <div class="d-flex justify-content-end mb-2">
          <button class="btn btn-primary btn-sm fw-bold" data-bs-toggle="modal" data-bs-target="#modalTambahAnggota">
            <i class="fa-solid fa-user-plus me-1"></i> Tambah Anggota Baru
          </button>
        </div>
        <div class="table-responsive table-custom">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>ID Anggota</th>
                <th>NIK</th>
                <th>Nama Lengkap</th>
                <th>Alamat</th>
                <th>No. WhatsApp</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody id="tbody-anggota">
              <tr><td colspan="6" class="text-center py-4 text-muted">Memuat data anggota...</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 4: BUKU KAS -->
      <div class="tab-pane fade" id="bukukas-pane">
        <div class="table-responsive table-custom">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>ID Kas</th>
                <th>Tanggal</th>
                <th>Tipe</th>
                <th>Nominal</th>
                <th>Keterangan Transaksi</th>
              </tr>
            </thead>
            <tbody id="tbody-bukukas">
              <tr><td colspan="5" class="text-center py-4 text-muted">Memuat data buku kas...</td></tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>

  <!-- MODAL: LAPOR KEMATIAN -->
  <div class="modal fade" id="modalLaporKematian" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title fw-bold"><i class="fa-solid fa-triangle-exclamation me-2"></i> Formulir Pelaporan Kematian</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <form id="formKematian" onsubmit="handleKematianSubmit(event)">
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label fw-medium">Pilih / Input ID Anggota <span class="text-danger">*</span></label>
              <input type="text" class="form-control" id="kematian-id-anggota" placeholder="Contoh: ANG-001" required>
            </div>
            <div class="mb-3">
              <label class="form-label fw-medium">Waktu Kematian <span class="text-danger">*</span></label>
              <input type="text" class="form-control" id="kematian-waktu" placeholder="Contoh: 09-08-2026 04:30 WIB" required>
            </div>
            <div class="mb-3">
              <label class="form-label fw-medium">Tempat Kematian <span class="text-danger">*</span></label>
              <input type="text" class="form-control" id="kematian-tempat" placeholder="Contoh: RS Daerah / Rumah Duka" required>
            </div>
            <div class="alert alert-warning small mb-0">
              <i class="fa-solid fa-bullhorn me-1"></i> Setelah disimpan, sistem akan secara otomatis mengirimkan <strong>WA Broadcast</strong> ke seluruh Pengurus & Kontak Ahli Waris.
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Batal</button>
            <button type="submit" class="btn btn-danger fw-bold" id="btn-submit-kematian">Kirim & Broadcast WA</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- MODAL: INPUT IURAN -->
  <div class="modal fade" id="modalInputIuran" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header bg-success text-white">
          <h5 class="modal-title fw-bold"><i class="fa-solid fa-money-bill-wave me-2"></i> Input Pembayaran Iuran</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <form id="formIuran" onsubmit="handleIuranSubmit(event)">
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label fw-medium">ID Anggota <span class="text-danger">*</span></label>
              <input type="text" class="form-control" id="iuran-id-anggota" placeholder="Contoh: ANG-001" required>
            </div>
            <div class="mb-3">
              <label class="form-label fw-medium">Bulan & Tahun Periode <span class="text-danger">*</span></label>
              <input type="text" class="form-control" id="iuran-bulan-tahun" placeholder="Contoh: Agustus 2026" required>
            </div>
            <div class="mb-3">
              <label class="form-label fw-medium">Nominal (Rp) <span class="text-danger">*</span></label>
              <input type="text" class="form-control" id="iuran-nominal" placeholder="50.000 (Otomatis Dibersihkan Regex)" oninput="cleanInputNominal(this)" required>
            </div>
            <div class="mb-3">
              <label class="form-label fw-medium">Keterangan</label>
              <input type="text" class="form-control" id="iuran-keterangan" placeholder="Contoh: Iuran Rutin Bulanan">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Batal</button>
            <button type="submit" class="btn btn-success fw-bold" id="btn-submit-iuran">Simpan Iuran & Buku Kas</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- MODAL: TAMBAH ANGGOTA -->
  <div class="modal fade" id="modalTambahAnggota" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title fw-bold"><i class="fa-solid fa-user-plus me-2"></i> Pendaftaran Anggota Baru</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <form id="formAnggota" onsubmit="handleAnggotaSubmit(event)">
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label fw-medium">NIK <span class="text-danger">*</span></label>
              <input type="text" class="form-control" id="anggota-nik" placeholder="3201..." required>
            </div>
            <div class="mb-3">
              <label class="form-label fw-medium">Nama Lengkap <span class="text-danger">*</span></label>
              <input type="text" class="form-control" id="anggota-nama" required>
            </div>
            <div class="mb-3">
              <label class="form-label fw-medium">Alamat Lengkap</label>
              <textarea class="form-control" id="anggota-alamat" rows="2"></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label fw-medium">No. WhatsApp <span class="text-danger">*</span></label>
              <input type="text" class="form-control" id="anggota-nohp" placeholder="0812..." required>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Batal</button>
            <button type="submit" class="btn btn-primary fw-bold" id="btn-submit-anggota">Daftarkan Anggota</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Bootstrap 5 JS -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

  <!-- CLIENT SCRIPT -->
  <script>
    // Global state fallback for preview simulator
    let cachedData = {
      anggota: [],
      kematian: [],
      iuran: [],
      bukukas: [],
      summaryKas: { masuk: 0, keluar: 0, saldo: 0 }
    };

    document.addEventListener('DOMContentLoaded', function() {
      loadDashboardData();
    });

    // Formatting Helpers
    function formatRupiah(num) {
      return 'Rp ' + Number(num || 0).toLocaleString('id-ID');
    }

    function cleanInputNominal(el) {
      let val = el.value.replace(/[^0-9]/g, '');
      if (val) {
        el.value = parseInt(val, 10).toLocaleString('id-ID');
      } else {
        el.value = '';
      }
    }

    function getRawCleanNumber(str) {
      return parseInt(String(str || '0').replace(/[^0-9]/g, ''), 10) || 0;
    }

    // Load Data from Apps Script google.script.run
    function loadDashboardData() {
      if (typeof google !== 'undefined' && google.script && google.script.run) {
        google.script.run
          .withSuccessHandler(renderDashboard)
          .withFailureHandler(function(err) {
            alert('Gagal memuat data dari Spreadsheet: ' + err);
          })
          .getDashboardData();
      } else {
        // Dev / Local Preview Mock
        console.log("Running in simulator environment");
        if (window.SIJAKA_SIMULATOR) {
          renderDashboard(window.SIJAKA_SIMULATOR.getData());
        }
      }
    }

    function renderDashboard(data) {
      if (!data) return;
      cachedData = data;

      // Stats
      document.getElementById('stat-total-anggota').innerText = data.anggota ? data.anggota.length : 0;
      document.getElementById('stat-kas-masuk').innerText = formatRupiah(data.summaryKas ? data.summaryKas.masuk : 0);
      document.getElementById('stat-kas-keluar').innerText = formatRupiah(data.summaryKas ? data.summaryKas.keluar : 0);
      document.getElementById('stat-saldo-kas').innerText = formatRupiah(data.summaryKas ? data.summaryKas.saldo : 0);

      // Render Tables
      renderKematianTable(data.kematian);
      renderIuranTable(data.iuran);
      renderAnggotaTable(data.anggota);
      renderBukuKasTable(data.bukukas);
    }

    function renderKematianTable(rows) {
      const tbody = document.getElementById('tbody-kematian');
      if (!rows || rows.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">Belum ada laporan kematian.</td></tr>';
        return;
      }
      tbody.innerHTML = rows.map(r => {
        let badgeClass = 'bg-warning text-dark';
        if (r.status === 'Terverifikasi') badgeClass = 'bg-info text-dark';
        if (r.status === 'Selesai') badgeClass = 'bg-success';

        return \`
          <tr>
            <td class="fw-bold">\${r.id_laporan || '-'}</td>
            <td>\${r.tanggal_lapor || '-'}</td>
            <td><span class="badge bg-secondary">\${r.id_anggota || '-'}</span></td>
            <td>\${r.waktu_kematian || '-'}</td>
            <td>\${r.tempat || '-'}</td>
            <td><span class="badge badge-status \${badgeClass}">\${r.status || 'Menunggu Verifikasi'}</span></td>
            <td>
              \${r.status !== 'Selesai' ? \`
                <button class="btn btn-sm btn-outline-success fw-medium" onclick="updateStatus('\${r.id_laporan}', 'Selesai')">
                  <i class="fa-solid fa-check me-1"></i> Verifikasi & Selesai
                </button>
              \` : '<span class="text-success small fw-bold"><i class="fa-solid fa-circle-check me-1"></i> Tuntas</span>'}
            </td>
          </tr>
        \`;
      }).join('');
    }

    function renderIuranTable(rows) {
      const tbody = document.getElementById('tbody-iuran');
      if (!rows || rows.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-muted">Belum ada data iuran.</td></tr>';
        return;
      }
      tbody.innerHTML = rows.map(r => \`
        <tr>
          <td class="fw-bold">\${r.id_iuran || '-'}</td>
          <td>\${r.tanggal || '-'}</td>
          <td><span class="badge bg-secondary">\${r.id_anggota || '-'}</span></td>
          <td>\${r.bulan_tahun || '-'}</td>
          <td class="fw-bold text-success">\${formatRupiah(r.nominal)}</td>
          <td class="text-muted">\${r.keterangan || '-'}</td>
        </tr>
      \`).join('');
    }

    function renderAnggotaTable(rows) {
      const tbody = document.getElementById('tbody-anggota');
      if (!rows || rows.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-muted">Belum ada data anggota.</td></tr>';
        return;
      }
      tbody.innerHTML = rows.map(r => \`
        <tr>
          <td class="fw-bold text-primary">\${r.id || '-'}</td>
          <td>\${r.nik || '-'}</td>
          <td class="fw-bold">\${r.nama || '-'}</td>
          <td>\${r.alamat || '-'}</td>
          <td>\${r.no_hp || '-'}</td>
          <td>
            <span class="badge \${r.status === 'Aktif' ? 'bg-success' : 'bg-danger'}">
              \${r.status || 'Aktif'}
            </span>
          </td>
        </tr>
      \`).join('');
    }

    function renderBukuKasTable(rows) {
      const tbody = document.getElementById('tbody-bukukas');
      if (!rows || rows.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-muted">Belum ada transaksi buku kas.</td></tr>';
        return;
      }
      tbody.innerHTML = rows.map(r => {
        const isMasuk = String(r.tipe).toLowerCase() === 'masuk';
        return \`
          <tr>
            <td class="fw-bold">\${r.id_kas || '-'}</td>
            <td>\${r.tanggal || '-'}</td>
            <td>
              <span class="badge \${isMasuk ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'} fw-bold">
                \${isMasuk ? '➕ MASUK' : '➖ KELUAR'}
              </span>
            </td>
            <td class="fw-bold \${isMasuk ? 'text-success' : 'text-danger'}">
              \${isMasuk ? '+' : '-'}\${formatRupiah(r.nominal)}
            </td>
            <td>\${r.keterangan || '-'}</td>
          </tr>
        \`;
      }).join('');
    }

    // Handlers Form Submit
    function handleKematianSubmit(e) {
      e.preventDefault();
      const data = {
        id_anggota: document.getElementById('kematian-id-anggota').value.trim(),
        waktu_kematian: document.getElementById('kematian-waktu').value.trim(),
        tempat: document.getElementById('kematian-tempat').value.trim()
      };

      if (typeof google !== 'undefined' && google.script && google.script.run) {
        google.script.run
          .withSuccessHandler(function(res) {
            bootstrap.Modal.getInstance(document.getElementById('modalLaporKematian')).hide();
            alert('Laporan Kematian berhasil disimpan! ID: ' + res.id_laporan);
            loadDashboardData();
          })
          .apiSubmitKematian(data);
      } else if (window.SIJAKA_SIMULATOR) {
        window.SIJAKA_SIMULATOR.submitKematian(data);
        bootstrap.Modal.getInstance(document.getElementById('modalLaporKematian')).hide();
        loadDashboardData();
      }
    }

    function handleIuranSubmit(e) {
      e.preventDefault();
      const data = {
        id_anggota: document.getElementById('iuran-id-anggota').value.trim(),
        bulan_tahun: document.getElementById('iuran-bulan-tahun').value.trim(),
        nominal: getRawCleanNumber(document.getElementById('iuran-nominal').value),
        keterangan: document.getElementById('iuran-keterangan').value.trim()
      };

      if (typeof google !== 'undefined' && google.script && google.script.run) {
        google.script.run
          .withSuccessHandler(function(res) {
            bootstrap.Modal.getInstance(document.getElementById('modalInputIuran')).hide();
            alert('Iuran berhasil dicatat!');
            loadDashboardData();
          })
          .apiSubmitIuran(data);
      } else if (window.SIJAKA_SIMULATOR) {
        window.SIJAKA_SIMULATOR.submitIuran(data);
        bootstrap.Modal.getInstance(document.getElementById('modalInputIuran')).hide();
        loadDashboardData();
      }
    }

    function handleAnggotaSubmit(e) {
      e.preventDefault();
      const data = {
        nik: document.getElementById('anggota-nik').value.trim(),
        nama: document.getElementById('anggota-nama').value.trim(),
        alamat: document.getElementById('anggota-alamat').value.trim(),
        no_hp: document.getElementById('anggota-nohp').value.trim(),
        status: 'Aktif'
      };

      if (typeof google !== 'undefined' && google.script && google.script.run) {
        google.script.run
          .withSuccessHandler(function(res) {
            bootstrap.Modal.getInstance(document.getElementById('modalTambahAnggota')).hide();
            alert('Anggota baru berhasil terdaftar!');
            loadDashboardData();
          })
          .apiSubmitAnggota(data);
      } else if (window.SIJAKA_SIMULATOR) {
        window.SIJAKA_SIMULATOR.submitAnggota(data);
        bootstrap.Modal.getInstance(document.getElementById('modalTambahAnggota')).hide();
        loadDashboardData();
      }
    }

    function updateStatus(idLaporan, status) {
      if (!confirm('Ubah status laporan ' + idLaporan + ' menjadi ' + status + '?')) return;

      if (typeof google !== 'undefined' && google.script && google.script.run) {
        google.script.run
          .withSuccessHandler(function() {
            loadDashboardData();
          })
          .apiUpdateStatusKematian(idLaporan, status);
      } else if (window.SIJAKA_SIMULATOR) {
        window.SIJAKA_SIMULATOR.updateKematianStatus(idLaporan, status);
        loadDashboardData();
      }
    }
  </script>
</body>
</html>
`;
