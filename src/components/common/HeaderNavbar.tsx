import React from 'react';
import { 
  Sparkles, 
  Wallet, 
  User as UserIcon, 
  LogIn, 
  LogOut, 
  Radio, 
  ChevronDown,
  ShieldCheck
} from 'lucide-react';
import { User } from '../../types';
import { formatRupiah } from '../../services/fayupedia';

interface HeaderNavbarProps {
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onNavigate: (tab: string) => void;
  onOpenChannel: () => void;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  user,
  onOpenAuth,
  onLogout,
  onNavigate,
  onOpenChannel
}) => {
  return (
    <header className="sticky top-3 z-40 max-w-7xl mx-auto px-4 select-none">
      <div className="flex items-center justify-between px-4 md:px-6 py-2.5 rounded-2xl md:rounded-3xl liquid-glass border border-white/20 shadow-glass backdrop-blur-2xl">
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          {/* Liquid water droplet icon */}
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 p-[1px] shadow-glass-hover">
            <div className="w-full h-full rounded-2xl bg-slate-950/80 flex items-center justify-center">
              <Sparkles size={20} className="text-cyan-300 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm md:text-base font-extrabold text-white tracking-tight">
                Fayupedia
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-md bg-sky-500/20 text-sky-300 border border-sky-500/30">
                SMM
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Cloudflare D1 Realtime</span>
            </div>
          </div>
        </div>

        {/* Center: Official Channel Announcement Button */}
        <button
          onClick={onOpenChannel}
          className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-medium transition-all"
        >
          <Radio size={14} className="text-emerald-400 animate-pulse" />
          <span>Saluran Resmi WhatsApp</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </button>

        {/* Right: Saldo & Profile / Auth */}
        <div className="flex items-center gap-2 md:gap-3">
          {user ? (
            <>
              {/* Saldo Badge */}
              <div 
                onClick={() => onNavigate('deposit')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs cursor-pointer transition-all"
                title="Klik untuk top up saldo"
              >
                <Wallet size={15} className="text-sky-400" />
                <span className="font-bold text-sky-200">
                  {formatRupiah(user.balance)}
                </span>
                <span className="w-4 h-4 rounded-full bg-sky-500/30 text-sky-300 flex items-center justify-center text-[11px] font-bold">
                  +
                </span>
              </div>

              {/* Profile Avatar / Dropdown Trigger */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('profile')}
                  className="flex items-center gap-2 p-1 pl-2 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all"
                >
                  <span className="text-xs font-semibold text-slate-200 hidden sm:inline max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <div className="w-7 h-7 rounded-xl overflow-hidden bg-slate-800 border border-white/20">
                    <img
                      src={user.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </button>

                <button
                  onClick={onLogout}
                  title="Keluar / Logout"
                  className="p-2 rounded-xl bg-white/[0.04] hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-white/5 transition-all"
                >
                  <LogOut size={15} />
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-semibold text-xs shadow-md transition-all active:scale-95"
            >
              <LogIn size={14} />
              <span>Masuk / Daftar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
