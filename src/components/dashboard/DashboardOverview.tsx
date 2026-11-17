import React from 'react';
import { 
  Wallet, 
  ShoppingBag, 
  Clock, 
  ArrowUpRight, 
  CreditCard, 
  Sparkles, 
  ShieldCheck, 
  Activity,
  Radio,
  ExternalLink
} from 'lucide-react';
import { User, Order } from '../../types';
import { formatRupiah } from '../../services/fayupedia';
import { MacOSWindow } from '../common/MacOSWindow';

interface DashboardOverviewProps {
  user: User | null;
  orders: Order[];
  onNavigate: (tab: string) => void;
  onOpenAuth: () => void;
  onOpenChannel: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  user,
  orders,
  onNavigate,
  onOpenAuth,
  onOpenChannel
}) => {
  const pendingCount = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  const completedCount = orders.filter(o => o.status === 'completed').length;
  const totalSpent = orders.reduce((sum, o) => sum + (o.charge || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Welcome / Hero Banner */}
      <div className="relative rounded-3xl liquid-glass p-6 md:p-8 overflow-hidden water-specular">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SMM Server Online 24/7 &bull; Realtime Cloudflare D1</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Halo, {user ? user.name : 'Sahabat Fayupedia'}!
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed">
              Tingkatkan popularitas akun media sosial Anda dengan layanan followers, likes, views otomatis tercepat & bergaransi.
            </p>
          </div>

          {/* Quick CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            {user ? (
              <>
                <button
                  onClick={() => onNavigate('new-order')}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-semibold text-xs shadow-lg shadow-sky-500/25 border border-sky-400/30 transition-all hover:scale-105 active:scale-95"
                >
                  <Sparkles size={16} />
                  <span>Order Layanan Baru</span>
                </button>
                <button
                  onClick={() => onNavigate('deposit')}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] text-white font-semibold text-xs border border-white/15 transition-all hover:scale-105 active:scale-95"
                >
                  <CreditCard size={16} />
                  <span>Isi Saldo</span>
                </button>
              </>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-sky-500/30 border border-sky-400/30 transition-all hover:scale-105"
              >
                <span>Masuk / Daftar Sekarang</span>
                <ArrowUpRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Saldo */}
        <div className="p-5 rounded-2xl md:rounded-3xl liquid-glass border border-white/15 space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium tracking-wide">Saldo Anda</span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Wallet size={16} />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-bold text-white tracking-tight">
            {formatRupiah(user ? user.balance : 0)}
          </div>
          <button
            onClick={() => onNavigate('deposit')}
            className="text-[10px] text-sky-400 font-semibold flex items-center gap-1 hover:underline"
          >
            <span>+ Topup Saldo</span>
          </button>
        </div>

        {/* Card 2: Pesanan Aktif / Pending */}
        <div className="p-5 rounded-2xl md:rounded-3xl liquid-glass border border-white/15 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium tracking-wide">Sedang Diproses</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-bold text-amber-300 tracking-tight">
            {pendingCount} Pesanan
          </div>
          <button
            onClick={() => onNavigate('pending-orders')}
            className="text-[10px] text-amber-400 font-semibold flex items-center gap-1 hover:underline"
          >
            <span>Lihat antrean</span>
          </button>
        </div>

        {/* Card 3: Pesanan Selesai */}
        <div className="p-5 rounded-2xl md:rounded-3xl liquid-glass border border-white/15 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium tracking-wide">Pesanan Selesai</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck size={16} />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-bold text-emerald-300 tracking-tight">
            {completedCount} Sukses
          </div>
          <span className="text-[10px] text-emerald-400/80 font-medium">
            Garansi Refill 30 Hari
          </span>
        </div>

        {/* Card 4: Total Pengeluaran */}
        <div className="p-5 rounded-2xl md:rounded-3xl liquid-glass border border-white/15 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium tracking-wide">Total Pengeluaran</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <ShoppingBag size={16} />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-bold text-purple-300 tracking-tight">
            {formatRupiah(totalSpent)}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            Dari {orders.length} transaksi
          </span>
        </div>
      </div>

      {/* Official WhatsApp Channel Highlight Card */}
      <div className="p-5 md:p-6 rounded-3xl liquid-glass border border-emerald-500/30 bg-emerald-950/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Radio size={24} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm md:text-base font-bold text-white">
                Saluran Resmi WhatsApp Fayupedia
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 font-medium">
                Penting
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Dapatkan informasi promo saldo harian, update layanan, dan status server terkini.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenChannel}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-semibold shadow-md transition-all whitespace-nowrap"
        >
          <span>Buka Saluran Sekarang</span>
          <ExternalLink size={14} />
        </button>
      </div>

      {/* Recent Orders macOS Window */}
      <MacOSWindow
        title="Pesanan Terbaru"
        subtitle="Pantau status transaksi Anda secara langsung"
        icon={<Activity size={16} />}
        actions={
          <button
            onClick={() => onNavigate('order-history')}
            className="text-xs text-sky-400 hover:text-sky-300 font-semibold"
          >
            Lihat Semua &rarr;
          </button>
        }
      >
        {orders.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <ShoppingBag size={40} className="mx-auto text-slate-500 stroke-1" />
            <p className="text-xs text-slate-400">Belum ada riwayat pesanan.</p>
            <button
              onClick={() => onNavigate('new-order')}
              className="text-xs font-semibold text-sky-400 hover:underline"
            >
              Buat pesanan pertama sekarang
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-medium pb-2">
                  <th className="pb-3 px-2">ID</th>
                  <th className="pb-3 px-2">Layanan</th>
                  <th className="pb-3 px-2">Target</th>
                  <th className="pb-3 px-2">Jumlah</th>
                  <th className="pb-3 px-2">Biaya</th>
                  <th className="pb-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {orders.slice(0, 5).map((ord) => (
                  <tr key={ord.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3 px-2 font-mono text-[11px] text-sky-400">
                      #{ord.id}
                    </td>
                    <td className="py-3 px-2 font-medium text-slate-200 max-w-xs truncate">
                      {ord.service_name}
                    </td>
                    <td className="py-3 px-2 text-slate-300 font-mono text-[11px] max-w-[120px] truncate">
                      {ord.target}
                    </td>
                    <td className="py-3 px-2 text-slate-200">
                      {ord.quantity.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-2 text-slate-200 font-semibold">
                      {formatRupiah(ord.charge)}
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          ord.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : ord.status === 'processing'
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                            : ord.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </MacOSWindow>
    </div>
  );
};
