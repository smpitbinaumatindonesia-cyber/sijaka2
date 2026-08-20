import React, { useState } from 'react';
import { CODE_GS_CONTENT } from '../data/codeGsContent';
import { INDEX_HTML_CONTENT } from '../data/indexHtmlContent';
import { Copy, Download, Check, FileCode, ExternalLink, HelpCircle, AlertCircle, ShieldAlert, Lock, Key } from 'lucide-react';
import { SijakaRole } from '../types';

interface CodeExporterProps {
  userRole?: SijakaRole;
  onRequestAdminLogin?: () => void;
}

export const CodeExporter: React.FC<CodeExporterProps> = ({ userRole = 'Admin', onRequestAdminLogin }) => {
  const [activeFile, setActiveFile] = useState<'Code.gs' | 'Index.html'>('Code.gs');
  const [copiedGs, setCopiedGs] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);

  const handleCopy = (type: 'gs' | 'html') => {
    const text = type === 'gs' ? CODE_GS_CONTENT : INDEX_HTML_CONTENT;
    navigator.clipboard.writeText(text);
    if (type === 'gs') {
      setCopiedGs(true);
      setTimeout(() => setCopiedGs(false), 2000);
    } else {
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2000);
    }
  };

  const handleDownload = (type: 'gs' | 'html') => {
    const text = type === 'gs' ? CODE_GS_CONTENT : INDEX_HTML_CONTENT;
    const filename = type === 'gs' ? 'Code.gs' : 'Index.html';
    const mime = type === 'gs' ? 'text/javascript' : 'text/html';
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // If user is not Admin/Super Admin, block access with a clear Admin Login requirement screen
  if (userRole !== 'Admin' && userRole !== 'Super Admin') {
    return (
      <div className="max-w-4xl mx-auto my-10 p-6 sm:p-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden text-center space-y-6 p-8 relative">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600"></div>
          
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-600 shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Akses Terbatas • Khusus Admin / Pengurus</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Kode Google Apps Script SIJAKA
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Menu ekspor source code backend <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">Code.gs</code> dan web app <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">Index.html</code> berisi konfigurasi webhook Fonnte WhatsApp & Spreadsheet ID internal. Untuk menjaga integritas sistem, menu ini khusus diakses oleh <strong>Admin / Pengurus SIJAKA</strong>.
            </p>
          </div>

          {/* Quick Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto text-left text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-800 mb-0.5">⚡ Auto Configured</div>
              <p className="text-[11px] text-slate-500">Mengkoneksikan Sheet ID ke Apps Script Web App</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-800 mb-0.5">💬 WhatsApp Bot</div>
              <p className="text-[11px] text-slate-500">Menerima Webhook Fonnte untuk autoreply AI</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-800 mb-0.5">🔐 Keamanan Webhook</div>
              <p className="text-[11px] text-slate-500">Dibatasi khusus otorisasi Pengurus</p>
            </div>
          </div>

          {/* Action Login Button */}
          <div className="pt-2">
            <button
              onClick={onRequestAdminLogin}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl font-extrabold text-xs transition-all shadow-lg shadow-amber-900/20 hover:scale-105 active:scale-95"
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
      
      {/* Top Banner Guide */}
      <div className="bg-slate-900 text-white rounded-lg p-5 border border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 font-semibold text-xs px-2.5 py-1 rounded-md border border-blue-500/30">
              <FileCode className="w-3.5 h-3.5" /> Ready for Deployment
            </span>
            <span className="text-xs text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              Terhubung Sheet ID: 1ZrYAwb8PTg-nTR-6H8HF3c9J130bnhwX-rElXrL-i5E
            </span>
          </div>
          <h2 className="text-xl font-bold">Kode Lengkap SIJAKA (Google Apps Script)</h2>
          <p className="text-slate-300 text-xs mt-0.5 max-w-3xl">
            Kode `Code.gs` telah dikonfigurasi otomatis menggunakan Google Spreadsheet ID Anda. Salin dan tempel ke Apps Script untuk mengaktifkan Webhost & Webhook Fonnte.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <a
            href="https://docs.google.com/spreadsheets/d/1ZrYAwb8PTg-nTR-6H8HF3c9J130bnhwX-rElXrL-i5E/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-md text-xs font-semibold shadow-sm transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Buka Sheet Utama
          </a>

          <button
            onClick={() => handleCopy(activeFile === 'Code.gs' ? 'gs' : 'html')}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-xs font-semibold shadow-sm transition-colors"
          >
            {activeFile === 'Code.gs' ? (
              copiedGs ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />
            ) : (
              copiedHtml ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />
            )}
            <span>Salin {activeFile}</span>
          </button>

          <button
            onClick={() => handleDownload(activeFile === 'Code.gs' ? 'gs' : 'html')}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-md text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh</span>
          </button>
        </div>
      </div>

      {/* Deployment Walkthrough Steps */}
      <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          Panduan Langkah Pasang ke Google Apps Script & Fonnte WhatsApp
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200 text-xs space-y-1">
            <div className="w-6 h-6 bg-blue-600 text-white font-bold rounded flex items-center justify-center text-xs mb-1.5">1</div>
            <h4 className="font-semibold text-slate-900">Buka Apps Script</h4>
            <p className="text-[11px] text-slate-600">Buka Google Sheets Anda, pilih menu <strong>Ekstensi &gt; Apps Script</strong>.</p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200 text-xs space-y-1">
            <div className="w-6 h-6 bg-blue-600 text-white font-bold rounded flex items-center justify-center text-xs mb-1.5">2</div>
            <h4 className="font-semibold text-slate-900">Paste Code.gs</h4>
            <p className="text-[11px] text-slate-600">Salin seluruh isi <strong>Code.gs</strong> di bawah ke file default `Code.gs`.</p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200 text-xs space-y-1">
            <div className="w-6 h-6 bg-blue-600 text-white font-bold rounded flex items-center justify-center text-xs mb-1.5">3</div>
            <h4 className="font-semibold text-slate-900">Buat Index.html</h4>
            <p className="text-[11px] text-slate-600">Klik tombol `+` di Apps Script, pilih <strong>HTML</strong>, beri nama <strong>Index.html</strong>.</p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200 text-xs space-y-1">
            <div className="w-6 h-6 bg-blue-600 text-white font-bold rounded flex items-center justify-center text-xs mb-1.5">4</div>
            <h4 className="font-semibold text-slate-900">Deploy Web App</h4>
            <p className="text-[11px] text-slate-600">Klik Deploy &gt; Deployment Baru. Akses: <strong>Siapa Saja (Anyone)</strong>.</p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-md border border-slate-200 text-xs space-y-1">
            <div className="w-6 h-6 bg-blue-600 text-white font-bold rounded flex items-center justify-center text-xs mb-1.5">5</div>
            <h4 className="font-semibold text-slate-900">Webhook Fonnte</h4>
            <p className="text-[11px] text-slate-600">Salin Web App URL yang dihasilkan ke menu Webhook di dashboard <strong>Fonnte.com</strong>.</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200/80 rounded-md p-3 flex items-start gap-2.5 text-xs text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>Catatan Fonnte API Token:</strong> Jangan lupa memasukkan Token Fonnte WhatsApp API Anda pada variabel <code className="bg-amber-100/80 px-1 py-0.5 rounded font-mono">FONNTE_TOKEN</code> di bagian paling atas baris <code className="bg-amber-100/80 px-1 py-0.5 rounded font-mono">Code.gs</code> agar pengiriman pesan broadcast otomatis berjalan lancar!
          </div>
        </div>
      </div>

      {/* Main Code Editor Box */}
      <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-800 shadow-md">
        
        {/* Editor File Selector Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFile('Code.gs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeFile === 'Code.gs'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>1. Code.gs (Backend & Bot)</span>
            </button>

            <button
              onClick={() => setActiveFile('Index.html')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeFile === 'Index.html'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>2. Index.html (Frontend Web)</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              {activeFile === 'Code.gs' ? 'Google Apps Script (.gs)' : 'HTML / Bootstrap 5 (.html)'}
            </span>
            <button
              onClick={() => handleCopy(activeFile === 'Code.gs' ? 'gs' : 'html')}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-md text-xs font-semibold border border-slate-700 transition-colors"
            >
              {activeFile === 'Code.gs' ? (
                copiedGs ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />
              ) : (
                copiedHtml ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />
              )}
              <span>{activeFile === 'Code.gs' ? (copiedGs ? 'Tersalin!' : 'Salin') : (copiedHtml ? 'Tersalin!' : 'Salin')}</span>
            </button>
          </div>
        </div>

        {/* Code Content Viewport */}
        <div className="p-5 overflow-x-auto max-h-[580px] font-mono text-xs text-slate-300 leading-relaxed scrollbar-thin">
          <pre>
            <code>
              {activeFile === 'Code.gs' ? CODE_GS_CONTENT : INDEX_HTML_CONTENT}
            </code>
          </pre>
        </div>

      </div>

    </div>
  );
};
