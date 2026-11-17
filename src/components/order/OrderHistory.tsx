import React, { useState } from 'react';
import { 
  Clock, 
  RotateCcw, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';
import { Order } from '../../types';
import { formatRupiah } from '../../services/fayupedia';
import { api } from '../../services/api';
import { MacOSWindow } from '../common/MacOSWindow';

interface OrderHistoryProps {
  orders: Order[];
  onRefresh: () => void;
  defaultFilter?: string; // 'all' | 'pending' | 'processing' | 'completed'
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({
  orders,
  onRefresh,
  defaultFilter = 'all'
}) => {
  const [filter, setFilter] = useState<string>(defaultFilter);
  const [search, setSearch] = useState('');
  const [checkingId, setCheckingId] = useState<string | null>(null);
  const [refillingId, setRefillingId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ id: string; text: string; type: 'success' | 'error' } | null>(null);

  const filteredOrders = orders.filter(o => {
    let matchFilter = true;
    if (filter === 'pending') {
      matchFilter = o.status === 'pending' || o.status === 'processing';
    } else if (filter !== 'all') {
      matchFilter = o.status === filter;
    }

    const matchSearch = search
      ? o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.service_name.toLowerCase().includes(search.toLowerCase()) ||
        o.target.toLowerCase().includes(search.toLowerCase())
      : true;

    return matchFilter && matchSearch;
  });

  const handleCheckStatus = async (orderId: string) => {
    setCheckingId(orderId);
    setActionMessage(null);
    try {
      const res = await api.checkOrderStatus(orderId);
      if (res.success) {
        setActionMessage({
          id: orderId,
          text: `Status terbaru: ${res.status?.toUpperCase()} (Sisa: ${res.remains ?? 0})`,
          type: 'success'
        });
        onRefresh();
      } else {
        setActionMessage({
          id: orderId,
          text: res.error || 'Gagal mengecek status',
          type: 'error'
        });
      }
    } catch {
      setActionMessage({
        id: orderId,
        text: 'Koneksi gagal',
        type: 'error'
      });
    } finally {
      setCheckingId(null);
    }
  };

  const handleRefill = async (orderId: string) => {
    setRefillingId(orderId);
    setActionMessage(null);
    try {
      const res = await api.requestRefill(orderId);
      if (res.success) {
        setActionMessage({
          id: orderId,
          text: `Permintaan refill #${res.refillId || ''} berhasil diajukan!`,
          type: 'success'
        });
        onRefresh();
      } else {
        setActionMessage({
          id: orderId,
          text: res.error || 'Gagal mengajukan refill',
          type: 'error'
        });
      }
    } catch {
      setActionMessage({
        id: orderId,
        text: 'Koneksi gagal',
        type: 'error'
      });
    } finally {
      setRefillingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <MacOSWindow
        title={filter === 'pending' ? 'Pesanan Dalam Antrean (Pending)' : 'Riwayat & Status Pesanan'}
        subtitle="Sinkronisasi status real-time dengan server Fayupedia"
        icon={<Clock size={18} />}
        actions={
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 text-xs font-medium transition-colors"
          >
            <RefreshCw size={13} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>
        }
      >
        {/* Filter Tabs & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/60 border border-white/10 w-full sm:w-auto overflow-x-auto">
            {[
              { id: 'all', label: 'Semua' },
              { id: 'pending', label: 'Pending / Proses' },
              { id: 'completed', label: 'Selesai' },
              { id: 'canceled', label: 'Batal' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  filter === tab.id
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari ID, layanan, target..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
            />
          </div>
        </div>

        {/* Global Action Message Banner */}
        {actionMessage && (
          <div
            className={`p-3 rounded-2xl mb-4 text-xs flex items-center justify-between gap-2 border ${
              actionMessage.type === 'success'
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {actionMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{actionMessage.text}</span>
            </div>
            <button
              onClick={() => setActionMessage(null)}
              className="text-xs opacity-70 hover:opacity-100"
            >
              &times;
            </button>
          </div>
        )}

        {/* Orders Table */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Clock size={40} className="mx-auto text-slate-600 stroke-1" />
            <p className="text-xs text-slate-400">Tidak ada pesanan yang sesuai filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-medium pb-2">
                  <th className="pb-3 px-3">ID & Tanggal</th>
                  <th className="pb-3 px-3">Layanan</th>
                  <th className="pb-3 px-3">Target</th>
                  <th className="pb-3 px-3">Jumlah / Biaya</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-white/[0.03] transition-colors">
                    {/* ID & Date */}
                    <td className="py-3 px-3">
                      <div className="font-mono font-bold text-sky-400 text-xs">
                        #{ord.id}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {new Date(ord.created_at).toLocaleString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>

                    {/* Service */}
                    <td className="py-3 px-3 max-w-xs">
                      <div className="font-medium text-slate-200 truncate">
                        {ord.service_name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {ord.category}
                      </div>
                    </td>

                    {/* Target */}
                    <td className="py-3 px-3 max-w-[150px]">
                      <span className="font-mono text-[11px] text-slate-300 break-all">
                        {ord.target}
                      </span>
                    </td>

                    {/* Qty & Charge */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-200">
                        {ord.quantity.toLocaleString('id-ID')} unit
                      </div>
                      <div className="text-[11px] text-sky-400 font-medium">
                        {formatRupiah(ord.charge)}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
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
                        {ord.remains !== undefined && ord.remains > 0 && (
                          <div className="text-[10px] text-slate-400">
                            Sisa: {ord.remains.toLocaleString('id-ID')}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleCheckStatus(ord.id)}
                          disabled={checkingId === ord.id}
                          title="Cek Status Terkini dari Server"
                          className="px-2.5 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-sky-300 text-[11px] font-medium transition-colors flex items-center gap-1"
                        >
                          <RefreshCw size={12} className={checkingId === ord.id ? 'animate-spin' : ''} />
                          <span className="hidden md:inline">Cek Status</span>
                        </button>

                        {ord.can_refill === 1 && (
                          <button
                            onClick={() => handleRefill(ord.id)}
                            disabled={refillingId === ord.id || Boolean(ord.refill_id)}
                            title="Ajukan Isi Ulang (Refill)"
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 ${
                              ord.refill_id
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default'
                                : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            <RotateCcw size={12} className={refillingId === ord.id ? 'animate-spin' : ''} />
                            <span className="hidden md:inline">
                              {ord.refill_id ? 'Refill Aktif' : 'Refill'}
                            </span>
                          </button>
                        )}
                      </div>
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
