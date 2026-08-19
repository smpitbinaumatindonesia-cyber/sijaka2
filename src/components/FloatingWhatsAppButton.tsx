import React, { useState } from 'react';
import { 
  MessageCircle, 
  Send, 
  X, 
  CheckCircle2, 
  Bot, 
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface FloatingWhatsAppButtonProps {
  onOpenSimulator?: () => void;
  userRole?: 'Admin' | 'Anggota';
}

export const FloatingWhatsAppButton: React.FC<FloatingWhatsAppButtonProps> = ({
  onOpenSimulator,
  userRole
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const quickPrompts = [
    'INFO',
    'STATUS',
    'BAYAR',
    'KLAIM',
    'BANTUAN'
  ];

  const handleSendToWhatsApp = (textToSend?: string) => {
    const query = textToSend || message;
    if (!query.trim()) return;
    
    // Direct link to WhatsApp Bot API or WhatsApp web
    const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(query)}`;
    window.open(waUrl, '_blank');
    setMessage('');
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Action Circular Icon */}
      <div 
        id="sijaka-floating-wa"
        className="fixed z-40 right-6 bottom-6 md:bottom-6 mb-16 md:mb-0"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 md:w-13 md:h-13 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 text-white flex items-center justify-center shadow-xl shadow-emerald-950/80 border-2 border-emerald-300/40 hover:scale-105 active:scale-95 transition-all duration-300 relative group"
          title="WhatsApp Gateway Layanan SIJAKA"
          aria-label="Hubungi WhatsApp Bot SIJAKA"
        >
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse"></span>
          <MessageCircle className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* Popover Card */}
      {isOpen && (
        <div className="fixed z-50 right-6 bottom-24 md:bottom-22 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Card Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>SIJAKA WhatsApp Bot</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </h4>
                <p className="text-[10px] text-slate-400">Layanan Otomatis Fonnte API</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="py-3 space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 leading-relaxed text-[11px]">
              Assalamu'alaikum, ada yang bisa dibantu untuk jaminan kematian jamaah? Silakan pilih kata kunci cepat atau ketik pesan.
            </div>

            {/* Quick Keyword Pills */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Perintah Cepat Bot:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickPrompts.map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => handleSendToWhatsApp(cmd)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-emerald-600/30 text-emerald-300 border border-slate-700 hover:border-emerald-500/50 text-[10px] font-extrabold transition-all"
                  >
                    #{cmd}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulator Shortcut for Web Testing */}
            {onOpenSimulator && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenSimulator();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-blue-950/40 hover:bg-blue-950/70 border border-blue-500/30 text-blue-300 text-[11px] font-bold transition-all"
              >
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>Buka Simulator WhatsApp Bot di Tab</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
              </button>
            )}

            {/* Input & Send */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendToWhatsApp()}
                placeholder="Ketik pesan WhatsApp..."
                className="flex-1 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none"
              />
              <button
                onClick={() => handleSendToWhatsApp()}
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-950/50 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}
    </>
  );
};
