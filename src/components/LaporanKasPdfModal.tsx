import React, { useState } from 'react';
import { FileSpreadsheet, Printer, Download, X, Wallet, ArrowDownLeft, ArrowUpRight, Calendar, ShieldCheck, Building2 } from 'lucide-react';
import { BukuKas } from '../types';
import { formatRupiah } from '../utils/formatters';

interface LaporanKasPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  bukuKasList: BukuKas[];
}

export const LaporanKasPdfModal: React.FC<LaporanKasPdfModalProps> = ({
  isOpen,
  onClose,
  bukuKasList
}) => {
  if (!isOpen) return null;

  const [selectedPeriod, setSelectedPeriod] = useState<string>('Semua');

  // Filter list based on selected period
  const filteredList = bukuKasList.filter((item) => {
    if (selectedPeriod === 'Semua') return true;
    return item.tanggal.includes(selectedPeriod) || item.keterangan.toLowerCase().includes(selectedPeriod.toLowerCase());
  });

  // Calculate totals
  const totalMasuk = filteredList
    .filter(i => i.tipe === 'Masuk')
    .reduce((acc, curr) => acc + curr.nominal, 0);

  const totalKeluar = filteredList
    .filter(i => i.tipe === 'Keluar')
    .reduce((acc, curr) => acc + curr.nominal, 0);

  const saldoAkhir = totalMasuk - totalKeluar;

  // Export CSV / Excel handler
  const handleExportExcel = () => {
    const headers = ['ID Kas', 'Tanggal', 'Tipe Transaksi', 'Nominal (Rp)', 'Keterangan Transaksi'];
    
    const rows = filteredList.map(item => [
      `"${item.id_kas}"`,
      `"${item.tanggal}"`,
      `"${item.tipe.toUpperCase()}"`,
      item.nominal,
      `"${item.keterangan.replace(/"/g, '""')}"`
    ]);

    // Append Summary Rows
    rows.push([]);
    rows.push(['"TOTAL KAS MASUK"', '""', '""', totalMasuk, '""']);
    rows.push(['"TOTAL KAS KELUAR"', '""', '""', totalKeluar, '""']);
    rows.push(['"SALDO AKHIR KAS"', '""', '""', saldoAkhir, '""']);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Laporan_Buku_Kas_SIJAKA_${selectedPeriod.replace(/\s+/g, '_')}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print PDF handler
  const handlePrintPdf = () => {
    const printContent = document.getElementById('printable-laporan-kas');
    if (!printContent) return;

    const printWindow = window.open('', '_blank', 'width=900,height=1000');
    if (!printWindow) {
      alert('Gagal membuka jendela cetak. Mohon izinkan popup di browser Anda.');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Laporan_Kas_SIJAKA_${selectedPeriod}</title>
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
      <div className="bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-700 overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Modal Toolbar Header */}
        <div className="bg-slate-800/90 px-6 py-4 flex flex-wrap items-center justify-between border-b border-slate-700 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
              <Wallet className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight text-white">
                Export & Cetak Laporan Buku Kas
              </h3>
              <p className="text-xs text-slate-400">Rekapitulasi Keuangan SIJAKA Jamaah Tahlil</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs shadow-md transition-all active:scale-95"
              title="Ekspor Laporan Kas ke Excel (.CSV)"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Excel</span>
            </button>

            <button
              onClick={handlePrintPdf}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs shadow-md transition-all active:scale-95"
              title="Cetak atau Unduh PDF Laporan"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable & Scrollable Report Body */}
        <div className="p-6 overflow-y-auto bg-slate-950 flex justify-center">
          <div
            id="printable-laporan-kas"
            className="w-full bg-white text-slate-900 p-8 rounded-xl shadow-lg border border-slate-200 text-xs"
          >
            
            {/* Kop Surat Header */}
            <div className="flex justify-between items-center border-b-2 border-slate-900 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-800 text-white rounded-xl flex items-center justify-center font-black text-xl shadow">
                  S
                </div>
                <div>
                  <h1 className="font-black text-base uppercase text-emerald-950 tracking-tight">
                    LAPORAN BUKU KAS SIJAKA
                  </h1>
                  <p className="text-[11px] font-bold text-slate-700">
                    Sistem Informasi Jaminan Kematian & Iuran Kas Anggota
                  </p>
                  <p className="text-[9px] text-slate-500">
                    Satu Pintu Pengelolaan Kas & Pertanggungjawaban Keuangan Jamaah Tahlil
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold text-slate-700">Periode Laporan:</div>
                <div className="text-sm font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 inline-block mt-0.5">
                  Agustus 2026
                </div>
                <div className="text-[9px] text-slate-400 mt-1">Dicetak pada: {new Date().toLocaleDateString('id-ID')}</div>
              </div>
            </div>

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="text-[10px] font-bold text-emerald-800 uppercase">Total Kas Masuk</div>
                <div className="text-base font-black text-emerald-700 font-mono mt-0.5">
                  +{formatRupiah(totalMasuk)}
                </div>
              </div>

              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                <div className="text-[10px] font-bold text-rose-800 uppercase">Total Kas Keluar</div>
                <div className="text-base font-black text-rose-700 font-mono mt-0.5">
                  -{formatRupiah(totalKeluar)}
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="text-[10px] font-bold text-blue-800 uppercase">Saldo Akhir Kas</div>
                <div className="text-base font-black text-blue-800 font-mono mt-0.5">
                  {formatRupiah(saldoAkhir)}
                </div>
              </div>
            </div>

            {/* Transactions Detail Table */}
            <div className="mb-8">
              <h4 className="font-bold text-xs uppercase text-slate-800 mb-2 border-b border-slate-300 pb-1">
                Rincian Transaksi Buku Kas
              </h4>
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-y border-slate-300">
                    <th className="p-2 border-r border-slate-200">ID Kas</th>
                    <th className="p-2 border-r border-slate-200">Tanggal</th>
                    <th className="p-2 border-r border-slate-200">Tipe</th>
                    <th className="p-2 border-r border-slate-200">Keterangan Transaksi</th>
                    <th className="p-2 text-right">Nominal (Rp)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredList.map((r) => {
                    const isMasuk = r.tipe === 'Masuk';
                    return (
                      <tr key={r.id_kas} className="hover:bg-slate-50">
                        <td className="p-2 font-mono font-bold text-slate-800 border-r border-slate-100">{r.id_kas}</td>
                        <td className="p-2 text-slate-600 border-r border-slate-100">{r.tanggal}</td>
                        <td className="p-2 border-r border-slate-100 font-bold">
                          <span className={isMasuk ? 'text-emerald-700' : 'text-rose-700'}>
                            {r.tipe.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-2 text-slate-800 border-r border-slate-100">{r.keterangan}</td>
                        <td className={`p-2 text-right font-mono font-bold ${isMasuk ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {isMasuk ? '+' : '-'}{formatRupiah(r.nominal)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-900 text-white font-bold border-t-2 border-slate-900">
                    <td colSpan={4} className="p-2 text-right uppercase tracking-wider text-[10px]">
                      Saldo Akhir Kas Jamaah:
                    </td>
                    <td className="p-2 text-right font-mono text-sm text-emerald-300">
                      {formatRupiah(saldoAkhir)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Official Signatures Section */}
            <div className="pt-6 border-t border-slate-300 flex justify-between text-center text-[10px]">
              <div className="w-48">
                <p className="text-slate-500 mb-10">Mengetahui,</p>
                <p className="font-bold text-slate-900 border-b border-slate-800 pb-0.5">Ketua Jamaah Tahlil</p>
                <p className="text-slate-500 mt-0.5">Wardjo</p>
              </div>

              <div className="w-48">
                <p className="text-slate-500 mb-10">Dibuat Oleh,</p>
                <p className="font-bold text-slate-900 border-b border-slate-800 pb-0.5">Bendahara Kas</p>
                <p className="text-slate-500 mt-0.5">Imam / Dino</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
