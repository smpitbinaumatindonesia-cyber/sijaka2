import React, { useState } from 'react';
import { sijakaEngine } from '../services/sijakaEngine';
import { Table, Database, RefreshCw, Plus, Download, FileSpreadsheet, ExternalLink, Lock, ShieldAlert } from 'lucide-react';
import { maskNik, maskPhone } from '../utils/formatters';

interface DatabaseSimulatorProps {
  userRole?: 'Admin' | 'Anggota';
}

export const DatabaseSimulator: React.FC<DatabaseSimulatorProps> = ({ userRole = 'Anggota' }) => {
  const [data, setData] = useState(sijakaEngine.getData());
  const [activeSheet, setActiveSheet] = useState<'Anggota' | 'Keluarga' | 'Kematian' | 'Iuran' | 'BukuKas' | 'Users' | 'Sessions' | 'Pelayanan' | 'Santunan'>('Anggota');
  const spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1b2bMaHY8TiuBtJQwCJgxRz3fzlJh6iakcgpDkhGvA_c/edit?usp=sharing';
  const spreadsheetId = '1b2bMaHY8TiuBtJQwCJgxRz3fzlJh6iakcgpDkhGvA_c';

  const refreshData = () => {
    setData(sijakaEngine.getData());
  };

  const handleReset = () => {
    if (confirm('⚠️ Kosongkan seluruh data SIJAKA?\n\nSemua data dummy anggota, iuran, laporan kematian, dan kas akan dihapus bersih (reset ke 0) untuk memulai data dari nol.')) {
      sijakaEngine.resetDatabase();
      refreshData();
      alert('✅ Seluruh data SIJAKA berhasil dikosongkan. Aplikasi siap diisi data dari awal.');
    }
  };

  const formatRupiah = (num: number) => {
    return 'Rp ' + Number(num || 0).toLocaleString('id-ID');
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-lg p-5 border border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 font-semibold text-xs px-2.5 py-1 rounded-md border border-emerald-500/30 flex items-center gap-1">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" /> Google Sheets Connected
            </span>
            <span className="text-xs text-slate-300 font-mono bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/80">
              ID: {spreadsheetId}
            </span>
          </div>
          <h2 className="text-xl font-bold mt-1.5">Struktur Database Google Sheets SIJAKA</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Mewakili 4 Sheet utama: 'Anggota', 'Kematian', 'Iuran', dan 'BukuKas' yang dikelola oleh backend Apps Script Code.gs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {userRole === 'Admin' && (
            <>
              <a
                href={spreadsheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-md text-xs font-semibold shadow-sm transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Buka Google Spreadsheet Utama
              </a>

              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/80 px-3 py-2 rounded-md text-xs font-semibold transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Kosongkan & Reset Data
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Table View Box */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Sheet Tabs Header */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50 border-b border-slate-200 overflow-x-auto">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveSheet('Anggota')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
                activeSheet === 'Anggota'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Sheet 'Anggota' ({data.anggota.length})</span>
            </button>

            <button
              onClick={() => setActiveSheet('Keluarga')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
                activeSheet === 'Keluarga'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Sheet 'Keluarga' ({data.keluarga.length})</span>
            </button>

            <button
              onClick={() => setActiveSheet('Kematian')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
                activeSheet === 'Kematian'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Sheet 'Kematian' ({data.kematian.length})</span>
            </button>

            <button
              onClick={() => setActiveSheet('Iuran')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
                activeSheet === 'Iuran'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Sheet 'Iuran' ({data.iuran.length})</span>
            </button>

            <button
              onClick={() => setActiveSheet('BukuKas')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
                activeSheet === 'BukuKas'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Sheet 'BukuKas' ({data.bukukas.length})</span>
            </button>

            <button
              onClick={() => setActiveSheet('Users')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
                activeSheet === 'Users'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Sheet 'Users' ({(data as any).users?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveSheet('Sessions')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
                activeSheet === 'Sessions'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Sheet 'Sessions' ({(data as any).sessions?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveSheet('Pelayanan')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
                activeSheet === 'Pelayanan'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Sheet 'Pelayanan' ({(data as any).pelayanan?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveSheet('Santunan')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
                activeSheet === 'Santunan'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Sheet 'Santunan' ({(data as any).santunan?.length || 0})</span>
            </button>
          </div>
        </div>

        {/* Sheet 1: Anggota */}
        {activeSheet === 'Anggota' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">ID_Anggota</th>
                  <th className="px-4 py-3">NIK</th>
                  <th className="px-4 py-3">Nama Lengkap</th>
                  <th className="px-4 py-3">Alamat</th>
                  <th className="px-4 py-3">No_HP</th>
                  <th className="px-4 py-3">Tanggungan / Keluarga</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {data.anggota.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-semibold text-blue-600">{row.id}</td>
                    <td className="px-4 py-3 text-slate-700" title={`NIK Asli: ${row.nik}`}>{maskNik(row.nik)}</td>
                    <td className="px-4 py-3 font-semibold font-sans text-slate-900">{row.nama}</td>
                    <td className="px-4 py-3 font-sans text-slate-700">{row.alamat}</td>
                    <td className="px-4 py-3 text-slate-700" title={`No. Asli: ${row.no_hp}`}>{maskPhone(row.no_hp)}</td>
                    <td className="px-4 py-3 font-sans">
                      <span className="bg-purple-100 text-purple-800 text-[10px] font-semibold px-2 py-0.5 rounded border border-purple-200">
                        {row.jumlah_keluarga || 0} Anggota Keluarga
                      </span>
                    </td>
                    <td className="px-4 py-3 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        row.status === 'Aktif' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/60' : 'bg-rose-100 text-rose-800 border border-rose-200/60'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Sheet 2: Keluarga */}
        {activeSheet === 'Keluarga' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">ID_Keluarga</th>
                  <th className="px-4 py-3">ID_Anggota (Kepala)</th>
                  <th className="px-4 py-3">NIK</th>
                  <th className="px-4 py-3">Nama Anggota Keluarga</th>
                  <th className="px-4 py-3">Hubungan</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {data.keluarga.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-semibold text-purple-600">{row.id}</td>
                    <td className="px-4 py-3 text-blue-600 font-semibold">{row.id_anggota}</td>
                    <td className="px-4 py-3 text-slate-700" title={`NIK Asli: ${row.nik}`}>{maskNik(row.nik)}</td>
                    <td className="px-4 py-3 font-semibold font-sans text-slate-900">{row.nama}</td>
                    <td className="px-4 py-3 font-sans">
                      <span className="bg-slate-100 text-slate-800 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-200">
                        {row.hubungan}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        row.status === 'Hidup' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/60' : 'bg-rose-100 text-rose-800 border border-rose-200/60'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Sheet 2: Kematian */}
        {activeSheet === 'Kematian' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">ID_Laporan</th>
                  <th className="px-4 py-3">Tanggal_Lapor</th>
                  <th className="px-4 py-3">ID_Anggota</th>
                  <th className="px-4 py-3">Waktu_Kematian</th>
                  <th className="px-4 py-3">Tempat</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {data.kematian.map((row) => (
                  <tr key={row.id_laporan} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900">{row.id_laporan}</td>
                    <td className="px-4 py-3 text-slate-700">{row.tanggal_lapor}</td>
                    <td className="px-4 py-3 font-semibold text-blue-600">{row.id_anggota}</td>
                    <td className="px-4 py-3 text-slate-700">{row.waktu_kematian}</td>
                    <td className="px-4 py-3 font-sans text-slate-700">{row.tempat}</td>
                    <td className="px-4 py-3 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        row.status === 'Selesai'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/60'
                          : row.status === 'Terverifikasi'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200/60'
                          : 'bg-amber-100 text-amber-800 border border-amber-200/60'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Sheet 3: Iuran */}
        {activeSheet === 'Iuran' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">ID_Iuran</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">ID_Anggota</th>
                  <th className="px-4 py-3">Bulan_Tahun</th>
                  <th className="px-4 py-3">Nominal</th>
                  <th className="px-4 py-3">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {data.iuran.map((row) => (
                  <tr key={row.id_iuran} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900">{row.id_iuran}</td>
                    <td className="px-4 py-3 text-slate-700">{row.tanggal}</td>
                    <td className="px-4 py-3 font-semibold text-blue-600">{row.id_anggota}</td>
                    <td className="px-4 py-3 font-sans text-slate-700">{row.bulan_tahun}</td>
                    <td className="px-4 py-3 font-semibold text-emerald-700">{formatRupiah(row.nominal)}</td>
                    <td className="px-4 py-3 font-sans text-slate-600">{row.keterangan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Sheet 4: BukuKas */}
        {activeSheet === 'BukuKas' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">ID_Kas</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Tipe</th>
                  <th className="px-4 py-3">Nominal</th>
                  <th className="px-4 py-3">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {data.bukukas.map((row) => {
                  const isMasuk = row.tipe === 'Masuk';
                  return (
                    <tr key={row.id_kas} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-900">{row.id_kas}</td>
                      <td className="px-4 py-3 text-slate-700">{row.tanggal}</td>
                      <td className="px-4 py-3 font-sans">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          isMasuk ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/60' : 'bg-rose-100 text-rose-800 border border-rose-200/60'
                        }`}>
                          {row.tipe}
                        </span>
                      </td>
                      <td className={`px-4 py-3 font-semibold ${isMasuk ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {isMasuk ? '+' : '-'}{formatRupiah(row.nominal)}
                      </td>
                      <td className="px-4 py-3 font-sans text-slate-700">{row.keterangan}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Sheet 5: Users */}
        {activeSheet === 'Users' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-purple-50 text-purple-900 font-semibold border-b border-purple-200">
                <tr>
                  <th className="px-4 py-3">id_user</th>
                  <th className="px-4 py-3">username</th>
                  <th className="px-4 py-3">password</th>
                  <th className="px-4 py-3">role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {((data as any).users || []).map((row: any) => (
                  <tr key={row.id_user} className="hover:bg-purple-50/40 transition-colors">
                    <td className="px-4 py-3 font-semibold text-purple-700">{row.id_user}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{row.username}</td>
                    <td className="px-4 py-3 text-slate-500">{row.password || '••••••'}</td>
                    <td className="px-4 py-3 font-sans">
                      <span className="bg-purple-100 text-purple-800 text-[10px] font-semibold px-2 py-0.5 rounded border border-purple-200">
                        {row.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Sheet 6: Sessions */}
        {activeSheet === 'Sessions' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-purple-50 text-purple-900 font-semibold border-b border-purple-200">
                <tr>
                  <th className="px-4 py-3">session_id</th>
                  <th className="px-4 py-3">username</th>
                  <th className="px-4 py-3">last_login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {((data as any).sessions || []).map((row: any) => (
                  <tr key={row.session_id} className="hover:bg-purple-50/40 transition-colors">
                    <td className="px-4 py-3 font-semibold text-purple-700">{row.session_id}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{row.username}</td>
                    <td className="px-4 py-3 text-slate-700">{row.last_login}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Sheet 7: Pelayanan */}
        {activeSheet === 'Pelayanan' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-emerald-50 text-emerald-900 font-semibold border-b border-emerald-200">
                <tr>
                  <th className="px-4 py-3">ID_Laporan</th>
                  <th className="px-4 py-3">Petugas</th>
                  <th className="px-4 py-3">Dimandikan</th>
                  <th className="px-4 py-3">Dikafani</th>
                  <th className="px-4 py-3">Disalatkan</th>
                  <th className="px-4 py-3">Dimakamkan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {((data as any).pelayanan || []).map((row: any) => (
                  <tr key={row.ID_Laporan} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="px-4 py-3 font-semibold text-rose-700">{row.ID_Laporan}</td>
                    <td className="px-4 py-3 font-sans text-slate-900 font-semibold">{row.Petugas}</td>
                    <td className="px-4 py-3 font-sans">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-200">
                        {String(row.Dimandikan)}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-sans">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-200">
                        {String(row.Dikafani)}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-sans">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-200">
                        {String(row.Disalatkan)}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-sans">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-200">
                        {String(row.Dimakamkan)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Sheet 8: Santunan */}
        {activeSheet === 'Santunan' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-emerald-50 text-emerald-900 font-semibold border-b border-emerald-200">
                <tr>
                  <th className="px-4 py-3">ID_Laporan</th>
                  <th className="px-4 py-3">Tgl_Pencairan</th>
                  <th className="px-4 py-3">Nama_Penerima</th>
                  <th className="px-4 py-3">Nominal_Santunan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {((data as any).santunan || []).map((row: any) => (
                  <tr key={row.ID_Laporan} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="px-4 py-3 font-semibold text-rose-700">{row.ID_Laporan}</td>
                    <td className="px-4 py-3 text-slate-700">{row.Tgl_Pencairan}</td>
                    <td className="px-4 py-3 font-sans text-slate-900 font-bold">{row.Nama_Penerima}</td>
                    <td className="px-4 py-3 font-semibold text-emerald-700">{formatRupiah(row.Nominal_Santunan)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};
