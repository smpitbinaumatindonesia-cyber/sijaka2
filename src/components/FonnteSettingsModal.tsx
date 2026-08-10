import React, { useState } from 'react';
import { sijakaEngine } from '../services/sijakaEngine';
import { Settings, Save, ShieldCheck, Key, Phone, Bot, FileSpreadsheet } from 'lucide-react';

interface FonnteSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FonnteSettingsModal: React.FC<FonnteSettingsModalProps> = ({ isOpen, onClose }) => {
  const currentConfig = sijakaEngine.getConfig();
  const [config, setConfig] = useState(currentConfig);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sijakaEngine.updateConfig(config);
    alert('✅ Pengaturan Fonnte WhatsApp API & Google Sheets berhasil disimpan!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-lg w-full overflow-hidden shadow-xl border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 font-bold flex justify-between items-center">
          <span className="flex items-center gap-2 text-sm">
            <Settings className="w-4 h-4 text-blue-400" /> Pengaturan Fonnte WA API & Google Sheets
          </span>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-base">✕</button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
          
          <div>
            <label className="block font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Google Spreadsheet ID Database
            </label>
            <input
              type="text"
              value={config.spreadsheetId || '1ZrYAwb8PTg-nTR-6H8HF3c9J130bnhwX-rElXrL-i5E'}
              onChange={(e) => setConfig({ ...config, spreadsheetId: e.target.value })}
              placeholder="1ZrYAwb8PTg-nTR-6H8HF3c9J130bnhwX-rElXrL-i5E"
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 font-mono text-xs"
              required
            />
            <p className="text-[10px] text-slate-500 mt-1">ID Spreadsheet Google Anda dari URL docs.google.com/spreadsheets/d/<strong>ID</strong>/edit</p>
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-blue-600" /> Fonnte WhatsApp API Token
            </label>
            <input
              type="text"
              value={config.fonnteToken}
              onChange={(e) => setConfig({ ...config, fonnteToken: e.target.value })}
              placeholder="e.g. FONNTE_DEMO_TOKEN_998811"
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 font-mono text-xs"
              required
            />
            <p className="text-[10px] text-slate-500 mt-1">Dapatkan Token Fonnte gratis di dashboard Fonnte.com</p>
          </div>

          <div className="pt-2 border-t border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-600" /> Nomor WA Pengurus SIJAKA (Untuk WA Broadcast Kematian)
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ketua</label>
                <input
                  type="text"
                  value={config.nomorKetua}
                  onChange={(e) => setConfig({ ...config, nomorKetua: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bendahara</label>
                <input
                  type="text"
                  value={config.nomorBendahara}
                  onChange={(e) => setConfig({ ...config, nomorBendahara: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sekretaris</label>
                <input
                  type="text"
                  value={config.nomorSekretaris}
                  onChange={(e) => setConfig({ ...config, nomorSekretaris: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tim Operasional</label>
                <input
                  type="text"
                  value={config.nomorOperasional}
                  onChange={(e) => setConfig({ ...config, nomorOperasional: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 text-xs"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 p-3 rounded-md border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-2">
            <Bot className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>Otomatis Broadcast:</strong> Setiap laporan kematian baru akan dikirimkan bersamaan ke 4 nomor pengurus di atas & kontak keluarga/ahli waris.
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-md text-xs transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm text-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" /> Simpan Pengaturan
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
