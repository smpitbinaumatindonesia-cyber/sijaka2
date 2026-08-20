import React, { useState, useEffect } from 'react';
import { sijakaEngine } from '../services/sijakaEngine';
import { Table, Database, RefreshCw, Plus, Download, FileSpreadsheet, ExternalLink, Lock, ShieldAlert, Key, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { maskNik, maskPhone } from '../utils/formatters';
import { SijakaRole } from '../types';

interface DatabaseSimulatorProps {
  userRole?: SijakaRole;
  onRequestAdminLogin?: () => void;
}

export const DatabaseSimulator: React.FC<DatabaseSimulatorProps> = ({ userRole = 'Admin', onRequestAdminLogin }) => {
  const [data, setData] = useState(sijakaEngine.getData());
  const [activeSheet, setActiveSheet] = useState<'Anggota' | 'Keluarga' | 'Kematian' | 'Iuran' | 'BukuKas' | 'Users' | 'Sessions' | 'Pelayanan' | 'Santunan'>('Anggota');
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetSuccessToast, setResetSuccessToast] = useState(false);

  const spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1ZrYAwb8PTg-nTR-6H8HF3c9J130bnhwX-rElXrL-i5E/edit?usp=sharing';
  const spreadsheetId = '1ZrYAwb8PTg-nTR-6H8HF3c9J130bnhwX-rElXrL-i5E';

  const refreshData = () => {
    setData(sijakaEngine.getData());
  };

  useEffect(() => {
    const handleStorageUpdate = () => {
      refreshData();
    };
    window.addEventListener('sijaka_storage_update', handleStorageUpdate);
    return () => window.removeEventListener('sijaka_storage_update', handleStorageUpdate);
  }, []);

  const handleExecuteReset = () => {
    sijakaEngine.resetDatabase();
    refreshData();
    setShowResetModal(false);
    setResetSuccessToast(true);
  };

  const formatRupiah = (num: number) => {
    return 'Rp ' + Number(num || 0).toLocaleString('id-ID');
  };

  // If user is not Admin/Super Admin, block access with a clear Admin Login requirement screen
  if (userRole !== 'Admin' && userRole !== 'Super Admin') {
    return (
      <div className="max-w-4xl mx-auto my-10 p-6 sm:p-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden text-center space-y-6 p-8 relative">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-600"></div>
          
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto text-purple-600 shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold">
              <Lock className="w-3.5 h-3.5 text-purple-600" />
              <span>Akses Terbatas • Khusus Admin / Pengurus</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Database Google Sheets SIJAKA
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Menu simulator tabel Google Sheets internal (<code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">Anggota</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">Iuran</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">BukuKas</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">Kematian</code>) serta opsi Reset Data khusus diakses oleh <strong>Admin / Pengurus SIJAKA</strong>.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onRequestAdminLogin}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl font-extrabold text-xs transition-all shadow-lg shadow-purple-900/20 hover:scale-105 active:scale-95"
            >
              <Key className="w-4 h-4" />
              <span>Login sebagai Admin / Pengurus</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                onClick={() => setShowResetModal(true)}
                className="flex items-center gap-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/80 px-3 py-2 rounded-md text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm"
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

      {/* Confirmation Modal for Resetting Database */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative space-y-5">
            <button
              onClick={() => setShowResetModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Kosongkan & Reset Data SIJAKA?</h3>
                <p className="text-xs text-slate-500">Konfirmasi tindakan Admin / Pengurus</p>
              </div>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-xs text-rose-900 space-y-1.5 leading-relaxed">
              <p className="font-bold">⚠️ Perhatian Data Baru SIJAKA:</p>
              <p>Tindakan ini akan menghapus seluruh data demo anggota, keluarga, laporan kematian, iuran, dan kas lokal.</p>
              <p className="text-[11px] text-rose-700">Aplikasi akan menjadi bersih (0 records) dan siap diisi data riil dari awal.</p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteReset}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition-all shadow-lg shadow-rose-600/30 flex items-center gap-1.5 hover:scale-105 active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Ya, Kosongkan Data Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast Notification */}
      {resetSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white border border-emerald-500/40 p-4 rounded-2xl shadow-2xl flex items-start gap-3 max-w-md animate-bounce-in">
          <div className="w-9 h-9 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center shrink-0 border border-emerald-500/30">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs space-y-0.5">
            <div className="font-bold text-emerald-300">Database Berhasil Dikosongkan!</div>
            <p className="text-slate-300">Seluruh tabel SIJAKA telah dibersihkan. Aplikasi siap digunakan untuk menginput data baru.</p>
          </div>
          <button
            onClick={() => setResetSuccessToast(false)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
