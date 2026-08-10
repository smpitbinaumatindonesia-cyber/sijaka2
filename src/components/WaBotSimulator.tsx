import React, { useState, useEffect, useRef } from 'react';
import { sijakaEngine } from '../services/sijakaEngine';
import { ChatMessage, BroadcastLog } from '../types';
import { 
  Send, 
  Bot, 
  User, 
  ShieldAlert, 
  Radio, 
  Users, 
  Zap, 
  MessageSquare, 
  Info, 
  PhoneCall, 
  Trash2,
  CheckCheck
} from 'lucide-react';

export const WaBotSimulator: React.FC = () => {
  const [senderPhone, setSenderPhone] = useState('081234567891'); // Sample ANG-001 phone
  const [inputMsg, setInputMsg] = useState('');
  const [isGroupMsg, setIsGroupMsg] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(sijakaEngine.getChatHistory());
  const [broadcastLogs, setBroadcastLogs] = useState<BroadcastLog[]>(sijakaEngine.getBroadcastLogs());

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSend = (textToSend?: string, isGroupOverride?: boolean) => {
    const msg = textToSend !== undefined ? textToSend : inputMsg;
    if (!msg.trim()) return;

    const payload = {
      sender: isGroupOverride !== undefined && isGroupOverride ? `${senderPhone}-16283948` : senderPhone,
      message: msg,
      isGroup: isGroupOverride !== undefined ? isGroupOverride : isGroupMsg,
      senderName: isGroupOverride || isGroupMsg ? 'Grup Warga SIJAKA' : 'Budi Santoso (ANG-001)'
    };

    sijakaEngine.processIncomingWebhook(payload);
    setChatHistory([...sijakaEngine.getChatHistory()]);
    setBroadcastLogs([...sijakaEngine.getBroadcastLogs()]);
    if (textToSend === undefined) setInputMsg('');
  };

  const handleClearHistory = () => {
    sijakaEngine.resetDatabase();
    setChatHistory([...sijakaEngine.getChatHistory()]);
    setBroadcastLogs([...sijakaEngine.getBroadcastLogs()]);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Title & Info Banner */}
      <div className="bg-slate-900 text-white rounded-lg p-5 border border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-500/20 text-blue-300 font-semibold text-xs px-2.5 py-1 rounded-md border border-blue-500/30 flex items-center gap-1">
              <Bot className="w-3.5 h-3.5" /> Fonnte Webhook Simulator
            </span>
            <span className="text-xs text-slate-400 font-mono">Anti-Spam & Auto Broadcast</span>
          </div>
          <h2 className="text-xl font-bold mt-1.5">Simulator WhatsApp Bot & Webhook Fonnte</h2>
          <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
            Uji coba langsung perintah baku (#bayariuran, #laporkematian), penguji menu 1-8, penangkap sapaan umum/angka salah, dan aturan anti-spam.
          </p>
        </div>

        <button
          onClick={handleClearHistory}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-2 rounded-md text-xs font-semibold transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" /> Reset Chat & DB
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Smartphone Chat Viewport (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col bg-slate-900 rounded-lg border border-slate-800 shadow-md overflow-hidden h-[620px]">
          
          {/* Smartphone Header Bar */}
          <div className="bg-slate-950 p-3.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full absolute -bottom-0.5 -right-0.5"></span>
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  Bot WA SIJAKA
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 font-medium px-1.5 py-0.2 rounded border border-blue-500/30">Official</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  {isGroupMsg ? '👥 Modus Pesan Grup (Akan Diabaikan)' : `📱 Dari: ${senderPhone}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isGroupMsg}
                  onChange={(e) => setIsGroupMsg(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 bg-slate-900 border-slate-700"
                />
                <span>Kirim sbg Grup WA</span>
              </label>
            </div>
          </div>

          {/* Chat Messages Log Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/80 scrollbar-thin">
            {chatHistory.length === 0 ? (
              <div className="text-center py-16 text-slate-500 text-xs space-y-2">
                <MessageSquare className="w-8 h-8 mx-auto opacity-50 text-slate-400" />
                <p className="font-semibold text-slate-400">Belum ada percakapan simulasi.</p>
                <p className="max-w-xs mx-auto text-slate-500">Klik tombol preset di sebelah kanan atau ketik pesan seperti <code className="bg-slate-900 text-blue-400 px-1 py-0.5 rounded">menu</code> untuk menguji bot.</p>
              </div>
            ) : (
              chatHistory.map((item) => {
                if (item.type === 'system') {
                  return (
                    <div key={item.id} className="flex justify-center my-2">
                      <div className="bg-slate-900 text-amber-300 text-[11px] px-3 py-1.5 rounded-md border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{item.message}</span>
                      </div>
                    </div>
                  );
                }

                const isIncoming = item.type === 'incoming';
                return (
                  <div
                    key={item.id}
                    className={`flex flex-col ${isIncoming ? 'items-end' : 'items-start'}`}
                  >
                    <div className="text-[10px] text-slate-400 mb-0.5 px-1">
                      {isIncoming ? item.senderName : 'Bot WA SIJAKA'} • {item.timestamp}
                    </div>

                    <div
                      className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed whitespace-pre-wrap font-sans shadow-sm ${
                        isIncoming
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-slate-800 text-slate-100 border border-slate-700/80 rounded-tl-none'
                      }`}
                    >
                      {item.message}
                      {!isIncoming && (
                        <div className="mt-1 text-[9px] text-emerald-400 font-mono text-right flex items-center justify-end gap-1">
                          <CheckCheck className="w-3 h-3 text-emerald-400" /> Fonnte API Sent
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Ketik perintah (#bayariuran, #laporkematian, menu)..."
              className="flex-1 bg-slate-950 text-slate-100 text-xs px-3.5 py-2 rounded-md border border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md shadow-sm transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

        {/* RIGHT COLUMN: Preset Test Triggers & Broadcast Logs (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Quick Preset Buttons Card */}
          <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-blue-600" /> Penguji Perintah Baku & Anti-Spam
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleSend('menu', false)}
                className="p-2.5 bg-slate-50 hover:bg-blue-50 text-slate-800 font-semibold rounded-md border border-slate-200 text-left transition-colors flex items-center gap-2"
              >
                <div className="w-5 h-5 bg-blue-100 text-blue-700 rounded flex items-center justify-center text-xs font-bold">1</div>
                <div>
                  <div>Ketik 'menu'</div>
                  <div className="text-[10px] text-slate-500 font-normal">Tampilkan menu 1-8</div>
                </div>
              </button>

              <button
                onClick={() => handleSend('5', false)}
                className="p-2.5 bg-slate-50 hover:bg-blue-50 text-slate-800 font-semibold rounded-md border border-slate-200 text-left transition-colors flex items-center gap-2"
              >
                <div className="w-5 h-5 bg-blue-100 text-blue-700 rounded flex items-center justify-center text-xs font-bold">2</div>
                <div>
                  <div>Ketik '5'</div>
                  <div className="text-[10px] text-slate-500 font-normal">Cek Saldo Kas SIJAKA</div>
                </div>
              </button>

              <button
                onClick={() => handleSend('halo', false)}
                className="p-2.5 bg-slate-50 hover:bg-blue-50 text-slate-800 font-semibold rounded-md border border-slate-200 text-left transition-colors flex items-center gap-2"
              >
                <div className="w-5 h-5 bg-blue-100 text-blue-700 rounded flex items-center justify-center text-xs font-bold">3</div>
                <div>
                  <div>Sapaan 'halo / pagi'</div>
                  <div className="text-[10px] text-slate-500 font-normal">Auto Intercept Menu</div>
                </div>
              </button>

              <button
                onClick={() => handleSend('9', false)}
                className="p-2.5 bg-slate-50 hover:bg-blue-50 text-slate-800 font-semibold rounded-md border border-slate-200 text-left transition-colors flex items-center gap-2"
              >
                <div className="w-5 h-5 bg-blue-100 text-blue-700 rounded flex items-center justify-center text-xs font-bold">4</div>
                <div>
                  <div>Angka Salah '9'</div>
                  <div className="text-[10px] text-slate-500 font-normal">Peringatan Menu 1-8</div>
                </div>
              </button>
            </div>

            {/* Test Commands */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => handleSend('#bayariuran|ANG-001|Agustus 2026|Rp 50.000,-|Iuran via Bot', false)}
                className="w-full p-2.5 bg-blue-50 hover:bg-blue-100/80 text-blue-900 font-medium rounded-md border border-blue-200 text-left transition-colors text-xs flex flex-col gap-0.5"
              >
                <div className="font-semibold flex items-center gap-1.5">
                  <span className="bg-blue-600 text-white px-1.5 py-0.2 rounded text-[10px] font-bold">Iuran + Cleaner Regex</span>
                  #bayariuran|ANG-001|Agustus 2026|Rp 50.000,-
                </div>
                <div className="text-[10px] text-blue-800">Menguji pembersih nominal regex <code className="font-mono">/[^0-9]/g</code> menjadi angka 50000 murni.</div>
              </button>

              <button
                onClick={() => handleSend('#laporkematian|ANG-002|09-08-2026 04:30|RS Daerah Citra', false)}
                className="w-full p-2.5 bg-rose-50 hover:bg-rose-100/80 text-rose-900 font-medium rounded-md border border-rose-200 text-left transition-colors text-xs flex flex-col gap-0.5"
              >
                <div className="font-semibold flex items-center gap-1.5">
                  <span className="bg-rose-600 text-white px-1.5 py-0.2 rounded text-[10px] font-bold">Lapor Kematian + Broadcast</span>
                  #laporkematian|ANG-002|09-08-2026 04:30|RS Citra
                </div>
                <div className="text-[10px] text-rose-800">Otomatis mencatat laporan & memicu Broadcast WA Fonnte ke 4 Pengurus & Ahli Waris.</div>
              </button>

              <button
                onClick={() => handleSend('Pesan acak dari grup warga', true)}
                className="w-full p-2 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-md border border-slate-200 text-left transition-colors text-xs flex items-center justify-between"
              >
                <span className="font-semibold">🚫 Uji Pesan Grup (Anti-Spam)</span>
                <span className="text-[10px] text-slate-500">Auto Ignored</span>
              </button>

              <button
                onClick={() => handleSend('tes acak tanpa tag pagar', false)}
                className="w-full p-2 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-md border border-slate-200 text-left transition-colors text-xs flex items-center justify-between"
              >
                <span className="font-semibold">🛡️ Uji Chat Pribadi Tanpa # / !</span>
                <span className="text-[10px] text-slate-500">Silent Ignored</span>
              </button>
            </div>

          </div>

          {/* Broadcast Logs Output Card */}
          <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-emerald-600" /> Log WA Broadcast Notifikasi Kematian
            </h3>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {broadcastLogs.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  Belum ada log broadcast. Jalankan perintah <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded">#laporkematian</code> untuk memicu broadcast.
                </div>
              ) : (
                broadcastLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-50 rounded-md border border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-800">{log.target}</span>
                      <span className="bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.2 rounded text-[10px] border border-emerald-200">{log.status} • {log.timestamp}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 line-clamp-2 whitespace-pre-wrap font-sans bg-white p-2 rounded border border-slate-200 mt-1">
                      {log.message}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
