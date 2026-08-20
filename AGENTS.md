# SIJAKA PRODUCTION BASELINE LOCK v1.1

## Status Rilis
- **Versi**: `v1.1 (Production Baseline & Role Dashboards)`
- **Status Deployment**: `PRODUCTION READY`
- **Hasil UAT**: `15/15 TEST CASES PASS (100% REGRESSION PASS)`
- **Critical / Security / Data Integrity Issues**: `0`
- **Production Blockers**: `0`
- **Visual Blockers**: `0`

---

## Modul Terkunci (Locked Modules v1.1)
Komponen dan modul berikut telah lulus pengujian menyeluruh dan **DIBEKUKAN (LOCKED)** dari perubahan otomatis:
1. **5 Role-Specific Dashboard Architecture**:
   - `PublicDashboard`: Information & Trust, pengenalan santunan Rp 2,5jt, transparansi publik, dan akses login.
   - `MemberDashboard`: Personal Status & Service, isolasi data mandiri, progress iuran 2026, dan susunan KK.
   - `OfficerDashboard`: Operational Workspace, fokus antrean *Butuh Tindakan Hari Ini*, verifikasi kematian, dan pencatatan iuran kas.
   - `ChairmanDashboard`: Executive Overview, pemantauan rasio cadangan kas terhadap potensi musibah, grafik tren iuran tahunan, dan log pertanggungjawaban.
   - `AdminDashboard`: System Control, status ketersediaan backend GAS (timeout 12s safe), integritas 10 Sheets, gateway WA Fonnte, dan konfigurasi secret terproteksi.
2. **Authentication & Session**: PBKDF2-HMAC-SHA256 password hashing, verifikasi sesi, auto logout.
3. **RBAC & Authorization**: 5 Role (`Anggota`, `Pengurus`, `Ketua`, `Admin`, `Super Admin`) dengan isolasi ketat hak akses route/tab direct (`/sheets`, `/waBot`, `/code`, `/security`, `/configuration`).
4. **Financial Integrity**:
   - Pembersih nominal `cleanNominal` regex murni integer numerik.
   - Saldo dinamis Buku Kas (`Total Masuk - Total Keluar`).
   - Anti-Double Claim pada santunan tetap Rp 2.500.000.
   - Idempotency Request ID untuk mencegah transaksi ganda.
5. **Google Sheets Database**: 10 skema Sheet resmi (`Anggota`, `Keluarga`, `Kematian`, `Iuran`, `BukuKas`, `Users`, `Sessions`, `Pelayanan`, `Santunan`, `AuditLogs`).
6. **Google Apps Script (GAS) RPC**: Endpoint Web App `EXEC`, timeout 12s handling, header `text/plain`, penanganan respon malformed.
7. **WhatsApp Fonnte Isolation**: Fallback status `BELUM TERKONFIGURASI` (*"Notifikasi WhatsApp belum tersedia"*) jika token kosong/placeholder, tanpa mengganggu transaksi utama.
8. **Production Configuration & Secret Masking**: Modal konfigurasi terproteksi RBAC (Admin/Super Admin) dengan masking token (`••••••••••••••••••A91X`).
9. **UI, Layout & Responsiveness**:
   - Lapang dalam tata letak, jelas dalam informasi, tenang dalam visual, dan premium dalam detail.
   - Desktop layout (Executive Sidebar, Topbar, KPI Grid, Charts).
   - Mobile layout (Bottom Navigation, Floating Action Modal, touch target 36px–48px).
   - Error Boundary (`SijakaErrorBoundary`) dan Offline Network Listener.

---

## Kebijakan Perubahan Pasca Rilis (Post-Release Policy)
1. **DIPERBOLEHKAN**:
   - Perbaikan bug fungsional nyata (*Bug Fix*).
   - Peningkatan keamanan (*Security Hardening*).
   - Koreksi integritas data (*Data Integrity Fix*).
   - Pengaturan konfigurasi produksi mandiri oleh administrator.
2. **DILARANG KERAS (FORBIDDEN)**:
   - Redesign UI tanpa instruksi tertulis yang eksplisit.
   - Perubahan arsitektur 5 role dashboard yang telah dibekukan.
   - Perubahan logika bisnis / formula keuangan yang sudah divalidasi.
   - Modifikasi struktur/skema 10 sheet Google Spreadsheet.
   - Perubahan hirarki navigasi atau perombakan hak akses RBAC.
   - Perubahan proaktif / unsolicited features.

---

## Aturan Regresi (Regression Rule)
Setiap pembaruan berikutnya wajib mempertahankan kelulusan **15/15 UAT Baseline**.
Semua perubahan harus mengikuti siklus:
`STABLE BASELINE` → `CONTROLLED CHANGE` → `REGRESSION TEST` → `RELEASE`.
