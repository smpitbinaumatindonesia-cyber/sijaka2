import React from 'react';
import { 
  Shield, 
  Heart, 
  Users, 
  DollarSign, 
  CheckCircle2, 
  PhoneCall, 
  FileText, 
  LogIn
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
  onOpenWaContact,
  totalMembersCount,
  totalProtectedSouls
}) => {
  return (
    <div className="space-y-8 sm:space-y-10 font-sans max-w-6xl mx-auto animate-in fade-in duration-300">
      
      {/* 1. HERO UTAMA: WELCOME & TRUST (Tenang, Lapang, Jelas dalam 3 detik) */}
      <div className="relative rounded-3xl p-6 sm:p-10 lg:p-12 bg-[#0B1428] border border-slate-800 shadow-xl overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-6">
          
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>Portal Informasi Pelayanan Jamaah</span>
          </div>

          {/* Titles */}
          <div className="space-y-2.5">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Sistem Informasi Jaminan Kematian
            </h1>
            <p className="text-sm sm:text-base font-semibold text-blue-400">
              Jamaah Tahlil Ar Rohman • RT 06 • RT 07 • RT 10 — Perum GPA Ngijo
            </p>
          </div>

          {/* Narrative */}
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            SIJAKA hadir sebagai wujud kepedulian dan ta’awun antarwarga jamaah dalam memberikan santunan duka cita dan pendampingan pemulasaraan jenazah secara amanah, tertib, dan transparan.
          </p>

          {/* Call to Actions */}
          <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={onLoginClick}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-950/50 hover:scale-[1.01] active:scale-[0.99] transition-all min-h-[48px]"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk ke Dashboard</span>
            </button>

            <button
              onClick={onOpenWaContact}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 font-semibold text-sm flex items-center gap-2 transition-all min-h-[48px]"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>Hubungi Pengurus WA</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. STATISTIK PUBLIK UTAMA (Compact & Berjarak) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0B1428] border border-slate-800 shadow-sm space-y-1.5">
          <div className="text-xs sm:text-sm text-slate-400 font-semibold">Kepala Keluarga</div>
          <div className="text-2xl sm:text-3xl font-bold text-white">{totalMembersCount} KK</div>
          <div className="text-xs text-emerald-400 font-semibold pt-0.5">Terdaftar Aktif</div>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-[#0B1428] border border-slate-800 shadow-sm space-y-1.5">
          <div className="text-xs sm:text-sm text-slate-400 font-semibold">Warga Terlindungi</div>
          <div className="text-2xl sm:text-3xl font-bold text-blue-400">{totalProtectedSouls} Jiwa</div>
          <div className="text-xs text-slate-400 font-semibold pt-0.5">Anggota & Keluarga</div>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-[#0B1428] border border-slate-800 shadow-sm space-y-1.5">
          <div className="text-xs sm:text-sm text-slate-400 font-semibold">Nilai Santunan</div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono">Rp 2,5 Juta</div>
          <div className="text-xs text-emerald-400 font-semibold pt-0.5">Tetap per Musibah</div>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-[#0B1428] border border-slate-800 shadow-sm space-y-1.5">
          <div className="text-xs sm:text-sm text-slate-400 font-semibold">Respon Layanan</div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-400">Siap 24 Jam</div>
          <div className="text-xs text-slate-400 font-semibold pt-0.5">Tim Rukun Kematian</div>
        </div>
      </div>

      {/* 3. PROGRAM & MANFAAT KEPESERTAAN */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Manfaat & Program Kepesertaan</h2>
          <p className="text-xs sm:text-sm text-slate-400">Fasilitas pelayanan dan perlindungan duka bagi warga jamaah</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#0B1428] border border-slate-800 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base">Santunan Rp 2.500.000</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                Diserahkan langsung secara tunai kepada ahli waris saat menghadapi musibah duka.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B1428] border border-slate-800 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base">Pemulasaraan Lengkap</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                Bantuan kain kafan, perlengkapan, memandikan, mengkafani, hingga pemakaman.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B1428] border border-slate-800 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base">Perlindungan 1 KK</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                Iuran per Kepala Keluarga mencakup pasangan, anak, dan tanggungan dalam KK.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B1428] border border-slate-800 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base">Kas Transparan</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                Pencatatan kas dan laporan keuangan terbuka untuk seluruh jamaah RT 06, 07, & 10.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. CARA KERJA SIJAKA (Alur Sederhana & Bersih) */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Cara Kerja Pelayanan</h2>
          <p className="text-xs sm:text-sm text-slate-400">4 langkah alur tertib jaminan kematian jamaah</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#0B1428] border border-slate-800 space-y-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              1
            </div>
            <h3 className="font-bold text-white text-sm sm:text-base">Pendaftaran KK</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Kepala keluarga mendaftarkan data KK dan susunan anggota keluarga ke pengurus.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B1428] border border-slate-800 space-y-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
              2
            </div>
            <h3 className="font-bold text-white text-sm sm:text-base">Iuran Gotong Royong</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Penyetoran iuran kas berkala untuk menjaga ketersediaan dana cadangan santunan.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B1428] border border-slate-800 space-y-2.5">
            <div className="w-7 h-7 rounded-lg bg-rose-600 text-white font-bold text-xs flex items-center justify-center">
              3
            </div>
            <h3 className="font-bold text-white text-sm sm:text-base">Pelaporan Musibah</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Keluarga melapor saat terjadi kedukaan melalui portal sistem atau kontak WhatsApp.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B1428] border border-slate-800 space-y-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
              4
            </div>
            <h3 className="font-bold text-white text-sm sm:text-base">Penyaluran Santunan</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Pengurus menyalurkan santunan Rp 2,5jt dan mendampingi proses pemulasaraan.
            </p>
          </div>
        </div>
      </div>

      {/* 5. KETENTUAN IURAN & HAK */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1428] border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-400" />
          <h2 className="text-base sm:text-lg font-bold text-white">Ketentuan & Hak Jamaah</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Besaran Iuran Bulanan</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Rp 50.000 per bulan per Kepala Keluarga (KK). Pembayaran dapat bulanan atau tahunan.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Cakupan Santunan</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Kepala keluarga, pasangan, anak tanggungan, dan orang tua/mertua dalam KK resmi.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Syarat Penerimaan</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Anggota aktif terdaftar dan tertib administrasi sesuai kesepakatan musyawarah jamaah.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
