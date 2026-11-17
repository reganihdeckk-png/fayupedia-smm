import React from 'react';
import { Radio, ExternalLink, ShieldCheck, Bell, Sparkles } from 'lucide-react';

interface PostLoginAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelUrl?: string;
}

export const PostLoginAnnouncementModal: React.FC<PostLoginAnnouncementModalProps> = ({
  isOpen,
  onClose,
  channelUrl = 'https://whatsapp.com/channel/0029VbE5A9VBPzjScJYKA50E'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      {/* macOS Window Card */}
      <div className="w-full max-w-lg rounded-3xl liquid-glass border border-white/25 shadow-2xl overflow-hidden water-specular">
        {/* Window Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-white/[0.06] border-b border-white/[0.1]">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 mr-2">
              <button 
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-rose-500 hover:bg-rose-600 transition-colors"
                title="Tutup"
              />
              <span className="w-3 h-3 rounded-full bg-amber-500 opacity-60" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 opacity-60" />
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <Radio size={14} className="text-emerald-400 animate-pulse" />
              <span>Notifikasi Resmi Fayupedia</span>
            </div>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Wajib Dibaca
          </span>
        </div>

        {/* Modal Content */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Header Icon & Title */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500/30 to-teal-400/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0 shadow-lg text-emerald-400">
              <Bell size={28} className="animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
                  Saluran WhatsApp Resmi
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  <ShieldCheck size={11} /> Terverifikasi
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-300 mt-1 leading-relaxed">
                Demi kelancaran transaksi & informasi update server, seluruh pengguna Fayupedia diharapkan telah bergabung ke saluran resmi.
              </p>
            </div>
          </div>

          {/* Key Announcements Box */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-2.5 text-xs text-slate-300">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <Sparkles size={14} /> Manfaat Bergabung di Saluran:
            </div>
            <ul className="space-y-1.5 pl-5 list-disc text-slate-300/90 text-xs">
              <li>Pemberitahuan perubahan harga layanan & promo harian</li>
              <li>Status maintenance server real-time 24 jam</li>
              <li>Giveaway saldo gratis dan voucher diskon bulanan</li>
              <li>Bantuan cepat langsung dari tim pengembang Fayupedia</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 border border-emerald-400/40 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <span>Gabung Saluran WhatsApp</span>
              <ExternalLink size={16} />
            </a>

            <button
              onClick={onClose}
              className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] text-slate-300 hover:text-white font-medium text-sm border border-white/15 transition-all duration-200"
            >
              Saya Mengerti
            </button>
          </div>

          <p className="text-[11px] text-center text-slate-400">
            Saluran: <span className="text-emerald-400 font-mono select-all">0029VbE5A9VBPzjScJYKA50E</span>
          </p>
        </div>
      </div>
    </div>
  );
};
