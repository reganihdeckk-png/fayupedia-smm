import React from 'react';
import { MessageCircle } from 'lucide-react';

interface FloatingWhatsAppButtonProps {
  phoneNumber?: string;
}

export const FloatingWhatsAppButton: React.FC<FloatingWhatsAppButtonProps> = ({
  phoneNumber = '628815722784'
}) => {
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const message = encodeURIComponent('Halo CS Fayupedia SMM, saya butuh bantuan mengenai akun/pesanan saya.');
  const waUrl = `https://wa.me/${cleanNumber}?text=${message}`;

  return (
    <div className="fixed right-4 md:right-6 bottom-24 md:bottom-28 z-40 group">
      {/* Tooltip */}
      <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-900/95 text-xs text-slate-100 border border-emerald-500/30 shadow-xl backdrop-blur-md flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Hubungi CS WhatsApp (+62 881-5722-784)</span>
      </div>

      {/* Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white shadow-xl shadow-emerald-600/30 border border-white/25 transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Hubungi WhatsApp Customer Support"
      >
        <MessageCircle size={26} className="fill-white/20" />
        {/* Radar ping */}
        <span className="absolute inset-0 rounded-full bg-emerald-400/40 animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
      </a>
    </div>
  );
};
