import React from 'react';
import { 
  Shield, 
  Heart, 
  Users, 
  DollarSign, 
  CheckCircle2, 
  ArrowRight, 
  PhoneCall, 
  Clock, 
  FileText, 
  HelpCircle,
  LogIn,
  AlertTriangle,
  Award,
  Sparkles
} from 'lucide-react';
import { SijakaRole } from '../../types';

interface PublicDashboardProps {
  onLoginClick: () => void;
  onSelectRole: (role: SijakaRole) => void;
  onOpenWaContact: () => void;
  totalMembersCount: number;
  totalProtectedSouls: number;
}

export const PublicDashboard: React.FC<PublicDashboardProps> = ({
  onLoginClick,
  onSelectRole,
  onOpenWaContact,
  totalMembersCount,
  totalProtectedSouls
}) => {
  return (
    <div className="space-y-6 sm:space-y-8 font-sans animate-in fade-in duration-300">
      
      {/* 1. HERO UTAMA: WELCOME & TRUST */}
      <div className="relative rounded-3xl p-6 sm:p-8 lg:p-10 bg-[#0B1428] border border-slate-800/80 shadow-xl overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl space-y-5 sm:space-y-6">
          
          {/* Header Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>Portal Informasi Layanan Publik Jamaah</span>
          </div>

          {/* Titles */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Selamat Datang di SIJAKA
            </h1>
            <div className="text-lg sm:text-xl font-bold text-blue-400">
              Sistem Informasi Jaminan Kematian
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-400">
              Jamaah Tahlil Ar Rohman • RT 06 • RT 07 • RT 10 — Perum GPA Ngijo
            </div>
          </div>

          {/* Narrative Body */}
          <div className="space-y-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            <p>
              SIJAKA hadir sebagai sarana pelayanan dan informasi jaminan kematian untuk memperkuat kepedulian dan kebersamaan antaranggota.
            </p>
            <p>
              Kami berkomitmen memberikan pelayanan yang amanah, tertib, transparan, dan penuh kepedulian, serta membantu keluarga dalam proses pengurusan jaminan ketika menghadapi musibah.
            </p>
          </div>

          {/* Quotation */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-200 text-sm sm:text-base italic flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-white">“Bersama dalam kepedulian, hadir dalam setiap keadaan.”</div>
              <div className="text-xs text-slate-400 mt-1 not-italic">
                Semoga kebersamaan ini menjadi ikhtiar kebaikan dan kebermanfaatan bagi kita semua.
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
              Tagline Identitas:
            </span>
            <span className="text-sm font-bold text-white tracking-tight">
              “Bersama dalam Kepedulian, Hadir dalam Setiap Keadaan.”
            </span>
          </div>

          {/* Call to Actions */}
          <div className="pt-3 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={onLoginClick}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk / Pilih Akun</span>
            </button>

            <button
              onClick={onOpenWaContact}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 font-semibold text-sm flex items-center gap-2 transition-all"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>Hubungi Pengurus / Layanan WA</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. RINGKASAN MANFAAT / PROGRAM */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">Program & Manfaat Kepesertaan</h2>
            <p className="text-xs sm:text-sm text-slate-400">Layanan perlindungan dan pemulasaraan jenazah untuk warga jamaah</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#0B1428] border border-slate-800/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Santunan Tunai Rp 2.500.000</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Santunan duka diserahkan langsung kepada keluarga ahli waris saat terjadi musibah kematian.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B1428] border border-slate-800/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Pemulasaraan Jenazah Lengkap</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Bantuan kain kafan, memandikan, mengkafani, hingga pendampingan proses pemakaman jenazah.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B1428] border border-slate-800/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Perlindungan Seluruh Keluarga</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Iuran per Kepala Keluarga mencakup perlindungan istri, anak, dan tanggungan yang tercantum dalam KK.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B1428] border border-slate-800/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Amanah & Transparan</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Pencatatan kas dan laporan pertanggungjawaban terbuka untuk seluruh jamaah RT 06, 07, & 10.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. STATISTIK PUBLIK YANG AMAN */}
      <div className="p-6 rounded-2xl bg-[#0B1428] border border-slate-800/80 space-y-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white">Statistik Kesiapsiagaan Jamaah</h2>
          <p className="text-xs text-slate-400">Ringkasan cakupan pelayanan dan kebersamaan warga</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-[11px] text-slate-400 font-semibold">Kepala Keluarga</div>
            <div className="text-xl sm:text-2xl font-black text-white mt-1">{totalMembersCount} KK</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Terdaftar Aktif</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-[11px] text-slate-400 font-semibold">Warga Terlindungi</div>
            <div className="text-xl sm:text-2xl font-black text-blue-400 mt-1">{totalProtectedSouls} Jiwa</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Anggota & Keluarga</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-[11px] text-slate-400 font-semibold">Nilai Santunan</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">Rp 2.500.000</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Tetap per Peristiwa</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-[11px] text-slate-400 font-semibold">Layanan Pelayanan</div>
            <div className="text-xl sm:text-2xl font-black text-amber-400 mt-1">24 Jam</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Respon Cepat Tim Rukun Kematian</div>
          </div>
        </div>
      </div>

      {/* 4. CARA KERJA SIJAKA */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white">Cara Kerja SIJAKA</h2>
          <p className="text-xs sm:text-sm text-slate-400">Empat alur tertib pelayanan jaminan kematian jamaah</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-2 relative">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
              1
            </div>
            <h3 className="font-bold text-white text-sm">Pendaftaran KK</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Kepala keluarga mendaftarkan data KK dan anggota keluarga ke pengurus rukun kematian.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-2 relative">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
              2
            </div>
            <h3 className="font-bold text-white text-sm">Iuran Rutin Gotong Royong</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Penyetoran iuran kas berkala untuk menjaga kesiapsiagaan dana santunan sosial bersama.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-2 relative">
            <div className="w-8 h-8 rounded-lg bg-rose-600 text-white font-black text-xs flex items-center justify-center">
              3
            </div>
            <h3 className="font-bold text-white text-sm">Pelaporan Musibah</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Keluarga/ahli waris melapor kepada petugas saat terjadi kedukaan melalui portal atau WhatsApp.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-2 relative">
            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white font-black text-xs flex items-center justify-center">
              4
            </div>
            <h3 className="font-bold text-white text-sm">Penyaluran Santunan</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tim pengurus langsung menyalurkan santunan tunai Rp 2,5jt dan membantu pemulasaraan jenazah.
            </p>
          </div>
        </div>
      </div>

      {/* 5. INFORMASI IURAN & KETENTUAN */}
      <div className="p-6 rounded-2xl bg-[#0B1428] border border-slate-800/80 space-y-4">
        <div className="flex items-center gap-2.5">
          <FileText className="w-5 h-5 text-blue-400" />
          <h2 className="text-base sm:text-lg font-bold text-white">Ketentuan Iuran & Hak Jamaah</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Besaran Iuran Bulanan</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Rp 50.000 per bulan untuk setiap Kepala Keluarga (KK). Pembayaran dapat dilakukan per bulan, per triwulan, atau tahunan.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Cakupan Perlindungan</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Kepala keluarga, pasangan (istri/suami), anak yang masih dalam tanggungan, dan orang tua/mertua yang tercantum resmi dalam KK.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Syarat Penerimaan Santunan</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Anggota aktif terdaftar dan tertib administrasi iuran tanpa tunggakan yang melebihi ketentuan musyawarah jamaah.
            </p>
          </div>
        </div>
      </div>

      {/* 6. CALL TO ACTION SECTION */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-base sm:text-lg font-bold text-white">
            Ingin Mengakses Layanan atau Memeriksa Status Anda?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Pilih akun sesuai peran Anda untuk masuk ke sistem SIJAKA.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onLoginClick}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>Masuk Sekarang</span>
          </button>
        </div>
      </div>

    </div>
  );
};
