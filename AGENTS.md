# SIJAKA PRODUCTION BASELINE LOCK v1.0

## Status Rilis
- **Versi**: `v1.0 (Production Baseline)`
- **Status Deployment**: `PRODUCTION READY`
- **Hasil UAT**: `15/15 TEST CASES PASS`
- **Critical / Security / Data Integrity Issues**: `0`
- **Production Blockers**: `0`

---

## Modul Terkunci (Locked Modules)
Komponen dan modul berikut telah lulus pengujian menyeluruh dan **DIBEKUKAN (LOCKED)** dari perubahan otomatis:
1. **Authentication & Session**: PBKDF2-HMAC-SHA256 password hashing, verifikasi sesi, auto logout.
2. **RBAC & Authorization**: 5 Role (`Anggota`, `Pengurus`, `Ketua`, `Admin`, `Super Admin`) dengan isolasi hak akses data.
3. **Financial Integrity**:
   - Pembersih nominal `cleanNominal` regex murni integer numerik.
   - Saldo dinamis Buku Kas (`Total Masuk - Total Keluar`).
   - Anti-Double Claim pada santunan tetap Rp 2.500.000.
   - Idempotency Request ID untuk mencegah transaksi ganda.
4. **Google Sheets Database**: 10 skema Sheet resmi (`Anggota`, `Keluarga`, `Kematian`, `Iuran`, `BukuKas`, `Users`, `Sessions`, `Pelayanan`, `Santunan`, `AuditLogs`).
5. **Google Apps Script (GAS) RPC**: Endpoint Web App `EXEC`, timeout 12s handling, header `text/plain`, penanganan respon malformed.
6. **WhatsApp Fonnte Isolation**: Fallback status `BELUM TERKONFIGURASI` (*"Notifikasi WhatsApp belum tersedia"*) jika token kosong/placeholder, tanpa mengganggu transaksi utama.
7. **Production Configuration & Secret Masking**: Modal konfigurasi terproteksi RBAC (Admin/Super Admin) dengan masking token (`••••••••••••••••••A91X`).
8. **UI, Layout & Responsiveness**:
   - Desktop layout (Executive Sidebar, Topbar, KPI Grid, Charts).
   - Mobile layout (Bottom Navigation, Floating Action Modal).
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
   - Perubahan logika bisnis / formula keuangan yang sudah divalidasi.
   - Modifikasi struktur/skema 10 sheet Google Spreadsheet.
   - Perubahan hirarki navigasi atau perombakan hak akses RBAC.
   - Perubahan proaktif / unsolicited features.

---

## Aturan Regresi (Regression Rule)
Setiap pembaruan berikutnya wajib mempertahankan kelulusan **15/15 UAT Baseline**.
Semua perubahan harus mengikuti siklus:
`STABLE BASELINE` → `CONTROLLED CHANGE` → `REGRESSION TEST` → `RELEASE`.
