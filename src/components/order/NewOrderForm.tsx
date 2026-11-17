import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Search, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Info,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { ServiceItem, User } from '../../types';
import { calculateOrderPrice, formatRupiah } from '../../services/fayupedia';
import { api } from '../../services/api';
import { MacOSWindow } from '../common/MacOSWindow';
import confetti from 'canvas-confetti';

interface NewOrderFormProps {
  user: User | null;
  services: ServiceItem[];
  onOrderSuccess: () => void;
  onNavigateToDeposit: () => void;
  onOpenAuth: () => void;
}

export const NewOrderForm: React.FC<NewOrderFormProps> = ({
  user,
  services,
  onOrderSuccess,
  onNavigateToDeposit,
  onOpenAuth
}) => {
  // Extract categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    services.forEach(s => set.add(s.category));
    return Array.from(set);
  }, [services]);

  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0] || 'Instagram Followers');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState<number>(0);
  const [target, setTarget] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filtered services by category & search
  const filteredServices = useMemo(() => {
    return services.filter(s => {
      const matchCat = selectedCategory ? s.category === selectedCategory : true;
      const matchSearch = searchQuery
        ? s.name.toLowerCase().includes(searchQuery.toLowerCase()) || String(s.id).includes(searchQuery)
        : true;
      return matchCat && matchSearch;
    });
  }, [services, selectedCategory, searchQuery]);

  // Active selected service
  const currentService = useMemo(() => {
    if (selectedServiceId) {
      return services.find(s => s.id === selectedServiceId) || filteredServices[0];
    }
    return filteredServices[0];
  }, [selectedServiceId, filteredServices, services]);

  // Current calculation
  const numQty = typeof quantity === 'number' ? quantity : 0;
  const totalPrice = currentService ? calculateOrderPrice(currentService.price, numQty) : 0;
  const isBalanceEnough = user ? user.balance >= totalPrice : false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!user) {
      onOpenAuth();
      return;
    }

    if (!currentService) {
      setError('Pilih layanan terlebih dahulu.');
      return;
    }

    if (!target.trim()) {
      setError('Target (Username / Link postingan) wajib diisi.');
      return;
    }

    if (!numQty || numQty < currentService.min) {
      setError(`Jumlah pemesanan minimal adalah ${currentService.min.toLocaleString('id-ID')}.`);
      return;
    }

    if (numQty > currentService.max) {
      setError(`Jumlah pemesanan maksimal adalah ${currentService.max.toLocaleString('id-ID')}.`);
      return;
    }

    if (!isBalanceEnough) {
      setError(`Saldo Anda tidak mencukupi untuk melakukan pemesanan ini (Kurang ${formatRupiah(totalPrice - user.balance)}). Silakan lakukan deposit.`);
      return;
    }

    setLoading(true);
    try {
      const res = await api.createOrder({
        serviceId: currentService.id,
        target: target.trim(),
        quantity: numQty
      });

      if (res.success && res.order) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        setSuccessMsg(`Pesanan dengan ID #${res.order.id} berhasil dibuat dan diteruskan ke server Fayupedia.`);
        setTarget('');
        setQuantity('');
        onOrderSuccess();
      } else {
        setError(res.error || 'Gagal membuat pesanan');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <MacOSWindow
        title="Buat Pesanan Baru"
        subtitle="Otomatis 24 Jam &bull; Terhubung Langsung ke Provider Fayupedia"
        icon={<Sparkles size={18} />}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Chips */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Pilih Kategori Platform
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSelectedServiceId(0);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 border ${
                    selectedCategory === cat
                      ? 'bg-sky-500/25 border-sky-400 text-sky-200 shadow-sm'
                      : 'bg-white/[0.04] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Service Search & Dropdown */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                Pilih Layanan
              </label>
              <div className="relative w-48 md:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari ID / nama layanan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>

            <select
              value={currentService?.id || ''}
              onChange={(e) => setSelectedServiceId(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-2xl bg-slate-900/80 border border-white/15 text-xs text-white focus:outline-none focus:border-sky-400 cursor-pointer"
            >
              {filteredServices.map((srv) => (
                <option key={srv.id} value={srv.id} className="bg-slate-900 text-white">
                  [{srv.id}] {srv.name} - {formatRupiah(srv.price)} / 1K
                </option>
              ))}
            </select>
          </div>

          {/* Service Info Box */}
          {currentService && (
            <div className="p-4 rounded-2xl bg-sky-950/25 border border-sky-500/20 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">
                    {currentService.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="px-2 py-0.5 rounded-md bg-white/10 text-slate-300">
                    ID: #{currentService.id}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 font-semibold">
                    {formatRupiah(currentService.price)} / 1.000
                  </span>
                  {currentService.refill === 1 ? (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 flex items-center gap-1">
                      <RotateCcw size={11} /> Garansi Refill
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-slate-700/50 text-slate-400">
                      Non-Refill
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-300">
                <div>
                  <span className="text-slate-500 block">Minimal Order:</span>
                  <span className="font-semibold text-white">{currentService.min.toLocaleString('id-ID')}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Maksimal Order:</span>
                  <span className="font-semibold text-white">{currentService.max.toLocaleString('id-ID')}</span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-slate-500 block">Waktu Mulai:</span>
                  <span className="font-semibold text-emerald-400">1 - 10 Menit</span>
                </div>
              </div>

              {currentService.description && (
                <div className="text-[11px] text-slate-300 bg-black/30 p-2.5 rounded-xl border border-white/5 flex items-start gap-2">
                  <Info size={14} className="text-sky-400 flex-shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{currentService.description}</p>
                </div>
              )}
            </div>
          )}

          {/* Target Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Target (Link / Username)
            </label>
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="Contoh: username atau https://instagram.com/p/..."
              className="w-full px-4 py-3 rounded-2xl bg-white/[0.05] border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Pastikan akun tidak di-private sebelum dan saat pesanan diproses.
            </p>
          </div>

          {/* Quantity Input & Live Price Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Jumlah Pemesanan
              </label>
              <input
                type="number"
                min={currentService?.min || 1}
                max={currentService?.max || 100000}
                value={quantity}
                onChange={(e) => {
                  const val = e.target.value;
                  setQuantity(val === '' ? '' : Number(val));
                }}
                placeholder={currentService ? `Min: ${currentService.min}` : '100'}
                className="w-full px-4 py-3 rounded-2xl bg-white/[0.05] border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Total Biaya (Otomatis)
              </label>
              <div className="px-4 py-3 rounded-2xl bg-white/[0.08] border border-white/15 text-sm font-bold text-sky-300 flex items-center justify-between">
                <span>{formatRupiah(totalPrice)}</span>
                <span className="text-[10px] font-normal text-slate-400">
                  {user ? `Saldo: ${formatRupiah(user.balance)}` : 'Belum Login'}
                </span>
              </div>
            </div>
          </div>

          {/* Error & Success Alerts */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle size={16} className="flex-shrink-0 text-rose-400" />
              <div className="flex-1">{error}</div>
              {!isBalanceEnough && user && (
                <button
                  type="button"
                  onClick={onNavigateToDeposit}
                  className="px-2.5 py-1 rounded-lg bg-rose-500 text-white font-semibold text-[10px] whitespace-nowrap hover:bg-rose-400"
                >
                  Deposit Sekarang
                </button>
              )}
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle2 size={16} className="flex-shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-sky-500/30 border border-sky-400/40 transition-all duration-200 flex items-center justify-center gap-2 transform active:scale-98"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Kirim Pesanan Sekarang</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </MacOSWindow>
    </div>
  );
};
