import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Clock, 
  CreditCard, 
  ListOrdered, 
  MessageSquare, 
  User as UserIcon, 
  Sparkles,
  Radio
} from 'lucide-react';

interface MacOSDockProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadChatCount?: number;
  pendingOrderCount?: number;
  onOpenChannel: () => void;
}

export const MacOSDock: React.FC<MacOSDockProps> = ({
  activeTab,
  setActiveTab,
  unreadChatCount = 0,
  pendingOrderCount = 0,
  onOpenChannel
}) => {
  const dockItems = [
    { id: 'dashboard', label: 'Beranda', icon: <LayoutDashboard size={20} /> },
    { id: 'new-order', label: 'Order Baru', icon: <PlusCircle size={20} />, highlight: true },
    { id: 'pending-orders', label: 'Pending', icon: <Clock size={20} />, badge: pendingOrderCount },
    { id: 'order-history', label: 'Riwayat', icon: <ListOrdered size={20} /> },
    { id: 'services', label: 'Layanan', icon: <Sparkles size={20} /> },
    { id: 'deposit', label: 'Deposit', icon: <CreditCard size={20} /> },
    { id: 'chat', label: 'Live Chat', icon: <MessageSquare size={20} />, badge: unreadChatCount },
    { id: 'profile', label: 'Profil', icon: <UserIcon size={20} /> },
  ];

  return (
    <div className="fixed bottom-3 md:bottom-5 left-1/2 -translate-x-1/2 z-40 select-none max-w-[96vw]">
      <div className="flex items-center gap-1.5 md:gap-2.5 px-3 md:px-4 py-2 md:py-2.5 rounded-2xl md:rounded-3xl liquid-glass border border-white/20 shadow-dock backdrop-blur-2xl">
        {dockItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="group relative flex flex-col items-center focus:outline-none"
            >
              {/* Tooltip on hover */}
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-900/90 text-[11px] font-medium text-slate-200 border border-white/10 shadow-lg backdrop-blur-md">
                {item.label}
              </div>

              {/* Icon Container with macOS magnification */}
              <div
                className={`
                  dock-item relative w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-tr from-sky-500/30 to-cyan-400/20 text-sky-300 border border-sky-400/40 shadow-glass-hover' 
                    : item.highlight
                    ? 'bg-sky-500/15 text-sky-400 border border-sky-500/25 hover:bg-sky-500/25'
                    : 'bg-white/[0.06] text-slate-300 hover:text-white hover:bg-white/[0.12] border border-white/10'
                  }
                `}
              >
                {item.icon}

                {/* Badge if present */}
                {Boolean(item.badge && item.badge > 0) && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-rose-500 text-white flex items-center justify-center border border-white/20 shadow-md animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Active Dot indicator (macOS style) */}
              <div
                className={`
                  w-1.5 h-1.5 rounded-full mt-1 transition-all duration-200
                  ${isActive ? 'bg-sky-400 shadow-sm shadow-sky-400' : 'bg-transparent'}
                `}
              />
            </button>
          );
        })}

        {/* Divider */}
        <div className="w-[1px] h-7 bg-white/20 mx-1" />

        {/* Official Channel shortcut */}
        <button
          onClick={onOpenChannel}
          className="group relative flex flex-col items-center focus:outline-none"
        >
          <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap px-2.5 py-1 rounded-lg bg-emerald-950/90 text-[11px] font-medium text-emerald-300 border border-emerald-500/20 shadow-lg backdrop-blur-md">
            Saluran WhatsApp Resmi
          </div>
          <div className="dock-item relative w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all duration-200 shadow-sm">
            <Radio size={20} className="animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div className="w-1.5 h-1.5 rounded-full mt-1 bg-transparent" />
        </button>
      </div>
    </div>
  );
};
