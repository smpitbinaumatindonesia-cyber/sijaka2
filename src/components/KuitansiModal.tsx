import React from 'react';
import { Printer, Download, CheckCircle, X, ShieldCheck, Building2, FileText, Stamp } from 'lucide-react';
import { formatTerbilangRupiah } from '../utils/terbilang';
import { formatRupiah } from '../utils/formatters';
import { Anggota, Iuran, Kematian } from '../types';

interface KuitansiModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'iuran' | 'santunan';
  item: Iuran | Kematian | null;
  anggotaList: Anggota[];
}

export const KuitansiModal: React.FC<KuitansiModalProps> = ({
  isOpen,
  onClose,
  type,
  item,
  anggotaList
}) => {
  if (!isOpen || !item) return null;

  // Find associated anggota
  const targetAnggota = anggotaList.find(a => a.id === item.id_anggota) || {
    id: item.id_anggota,
    nama: 'Anggota Jamaah SIJAKA',
    alamat: 'RT/RW Setempat',
    nik: '-'
  };

  const isIuran = type === 'iuran';
  const iuranItem = item as Iuran;
  const kematianItem = item as Kematian;

  // Values calculation
  const noKuitansi = isIuran ? `KW-IRN-${iuranItem.id_iuran}` : `KW-STN-${kematianItem.id_laporan}`;
  const tanggal = isIuran ? iuranItem.tanggal : kematianItem.tanggal_lapor;
  const nominal = isIuran ? iuranItem.nominal : 2500000; // Standard santunan 2.5 Juta if kematian
  const terbilangText = formatTerbilangRupiah(nominal);

  const peruntukan = isIuran
    ? `Pembayaran Iuran Rutin Kas SIJAKA Periode ${iuranItem.bulan_tahun} (${iuranItem.keterangan || 'Lunas'})`
    : `Penyerahan Santunan Duka & Pelayanan Jenazah Laporan ${kematianItem.id_laporan} (${kematianItem.tempat || 'Rumah Duka'})`;

  const namaPenerimaPembayar = isIuran ? targetAnggota.nama : `${targetAnggota.nama} (Ahli Waris/Keluarga Almarhum/ah)`;

  const handlePrint = () => {
    const printContent = document.getElementById('printable-kuitansi');
    if (!printContent) return;

    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      alert('Gagal membuka jendela cetak. Mohon izinkan popup di browser Anda.');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Kuitansi_${noKuitansi}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
              body { margin: 0; padding: 20px; background: #fff !important; color: #000 !important; }
              .no-print { display: none !important; }
            }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
          </style>
        </head>
        <body class="p-8 bg-white">
          ${printContent.innerHTML}
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 500);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-700 overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Modal Toolbar */}
        <div className="bg-slate-800/90 px-6 py-4 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm tracking-tight">
              Cetak Bukti Kuitansi {isIuran ? 'Iuran' : 'Santunan Duka'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs shadow-md transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Unduh PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Canvas Paper View */}
        <div className="p-6 overflow-y-auto bg-slate-950 flex justify-center">
          <div
            id="printable-kuitansi"
            className="w-full bg-white text-slate-900 p-8 rounded-xl shadow-lg border border-slate-200 relative text-xs"
          >
            {/* Background Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
              <ShieldCheck className="w-96 h-96 text-emerald-900" />
            </div>

            {/* Header Kuitansi */}
            <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-800 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-md border border-emerald-600">
                  S
                </div>
                <div>
                  <h1 className="font-black text-base uppercase text-emerald-900 tracking-tight leading-tight">
                    SIJAKA JAMAAH TAHLIL
                  </h1>
                  <p className="text-[10px] text-slate-600 font-medium">
                    Sistem Informasi Jaminan Kematian & Iuran Kas Anggota
                  </p>
                  <p className="text-[9px] text-slate-500">
                    Sekretariat: Kelurahan / Desa Setempat • Kontak: 0812-3456-7890
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-3 py-1 rounded-lg font-black text-sm tracking-wide inline-block mb-1">
                  KUITANSI RESMI
                </div>
                <div className="text-[10px] text-slate-600 font-mono">
                  No: <strong className="text-slate-900">{noKuitansi}</strong>
                </div>
                <div className="text-[10px] text-slate-500">Tgl: {tanggal}</div>
              </div>
            </div>

            {/* Body Info Table */}
            <div className="space-y-3 my-6">
              <div className="grid grid-cols-12 gap-2 items-baseline">
                <div className="col-span-3 text-slate-600 font-semibold">Telah {isIuran ? 'Diterima Dari' : 'Diserahkan Kepada'}</div>
                <div className="col-span-9 font-bold text-slate-900 text-sm border-b border-slate-200 pb-0.5">
                  : {namaPenerimaPembayar} <span className="text-xs text-slate-500 font-normal">({targetAnggota.id})</span>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 items-baseline">
                <div className="col-span-3 text-slate-600 font-semibold">Alamat Anggota</div>
                <div className="col-span-9 text-slate-800 border-b border-slate-200 pb-0.5">
                  : {targetAnggota.alamat}
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 items-baseline">
                <div className="col-span-3 text-slate-600 font-semibold">Uang Sejumlah</div>
                <div className="col-span-9 bg-amber-50/80 border border-amber-200 p-2 rounded-lg italic font-bold text-amber-950 text-xs">
                  # {terbilangText} #
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 items-baseline">
                <div className="col-span-3 text-slate-600 font-semibold">Untuk Peruntukan</div>
                <div className="col-span-9 text-slate-800 border-b border-slate-200 pb-0.5 leading-relaxed">
                  : {peruntukan}
                </div>
              </div>
            </div>

            {/* Large Amount Box & Signature Footer */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-end">
              
              <div className="bg-emerald-950 text-white px-5 py-2.5 rounded-xl border-2 border-emerald-600 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-emerald-300 block">Jumlah Nominal:</span>
                <span className="text-xl font-black text-white font-mono tracking-wider">
                  {formatRupiah(nominal)}
                </span>
              </div>

              <div className="text-center w-48">
                <p className="text-[10px] text-slate-500 mb-1">Ditetapkan & Disahkan Oleh,</p>
                <p className="text-xs font-bold text-slate-800">Bendahara SIJAKA</p>
                
                {/* Digital Stamp Simulation */}
                <div className="my-2 py-1 flex items-center justify-center relative">
                  <div className="border-2 border-dashed border-emerald-600/60 rounded-full px-3 py-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 transform -rotate-6 shadow-sm flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>LUNAS & VALIDATED</span>
                  </div>
                </div>

                <p className="text-xs font-black text-slate-900 border-b border-slate-800 pb-0.5">
                  Bendahara / Pengurus
                </p>
                <p className="text-[9px] text-slate-500 mt-0.5">Jamaah Tahlil SIJAKA</p>
              </div>

            </div>

            {/* Footnote */}
            <div className="mt-6 pt-3 border-t border-slate-100 flex justify-between text-[9px] text-slate-400">
              <span>* Bukti kuitansi ini diterbitkan sah secara digital melalui sistem SIJAKA.</span>
              <span>Dokumen Ref: {noKuitansi}</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
