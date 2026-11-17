import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Headphones, 
  ExternalLink, 
  CheckCheck,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { ChatMessage, User } from '../../types';
import { api } from '../../services/api';
import { MacOSWindow } from '../common/MacOSWindow';

interface LiveChatWidgetProps {
  user: User | null;
  onOpenAuth: () => void;
  csNumber?: string;
}

export const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({
  user,
  onOpenAuth,
  csNumber = '+628815722784'
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchChats = async () => {
    try {
      const list = await api.getChatMessages();
      setMessages(list);
    } catch {}
  };

  useEffect(() => {
    fetchChats();
    const interval = setInterval(fetchChats, 3000); // Polling real-time 3s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const text = inputMsg.trim();
    setInputMsg('');
    setSending(true);

    try {
      await api.sendChatMessage(text);
      await fetchChats();
    } catch {
      console.error('Gagal mengirim pesan');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <MacOSWindow
        title="Live Chat Real-Time &bull; CS 24 Jam"
        subtitle={`Terhubung langsung dengan tim Customer Service Fayupedia (${csNumber})`}
        icon={<Headphones size={18} />}
        actions={
          <a
            href={`https://wa.me/628815722784?text=${encodeURIComponent('Halo CS Fayupedia, saya butuh bantuan langsung.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-all"
          >
            <PhoneCall size={12} />
            <span className="hidden sm:inline">WhatsApp CS Langsung</span>
          </a>
        }
      >
        <div className="flex flex-col h-[480px] rounded-2xl bg-slate-900/50 border border-white/10 overflow-hidden">
          {/* CS Status Bar */}
          <div className="px-4 py-2.5 bg-white/[0.04] border-b border-white/10 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Tim CS Fayupedia Siap Membantu</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              Cloudflare D1 Realtime Sync
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg) => {
              const isMe = user ? (msg.user_id === user.id || msg.sender_role === 'user') : msg.sender_role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400">
                    <span className="font-semibold text-slate-300">{msg.sender_name}</span>
                    {msg.sender_role === 'cs' && (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
                        OFFICIAL CS
                      </span>
                    )}
                    <span>&bull;</span>
                    <span>
                      {new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-gradient-to-r from-sky-500 to-cyan-600 text-white shadow-md rounded-tr-none'
                        : 'bg-white/[0.08] text-slate-100 border border-white/10 rounded-tl-none'
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSend} className="p-3 bg-white/[0.03] border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Ketik pesan Anda di sini..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
            />
            <button
              type="submit"
              disabled={sending || !inputMsg.trim()}
              className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 transition-all"
            >
              <Send size={14} />
              <span className="hidden sm:inline">Kirim</span>
            </button>
          </form>
        </div>
      </MacOSWindow>
    </div>
  );
};
