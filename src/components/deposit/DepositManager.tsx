import React, { useState } from 'react';
import { 
  CreditCard, 
  QrCode, 
  Building2, 
  Smartphone, 
  Copy, 
  Check, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Deposit, User } from '../../types';
import { formatRupiah } from '../../services/fayupedia';
import { api } from '../../services/api';
import { MacOSWindow } from '../common/MacOSWindow';
import confetti from 'canvas-confetti';

interface DepositManagerProps {
  user: User | null;
  deposits: Deposit[];
  onRefresh: () => void;
  onOpenAuth: () => void;
}

export const DepositManager: React.FC<DepositManagerProps> = ({
  user,
  deposits,
  onRefresh,
  onOpenAuth
}) => {
  const [method, setMethod] = useState<'QRIS' | 'BCA' | 'BRI' | 'DANA' | 'GOPAY'>('QRIS');
  const [amount, setAmount] = useState<number | ''>(50000);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdDeposit, setCreatedDeposit] = useState<Deposit | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const presets = [10000, 25000, 50000, 100000, 250000, 500000];

  const paymentMethods = [
    { id: 'QRIS', name: 'QRIS Real-Time', icon: <QrCode size={18} />, badge: 'Semua Bank & E-Wallet', fee: 'Rp 0' },
    { id: 'BCA', name: 'Bank BCA Transfer', icon: <Building2 size={18} />, badge: 'Rekening 873-092-1102 a/n Fayupedia', fee: 'Rp 0' },
    { id: 'BRI', name: 'Bank BRI Transfer', icon: <Building2 size={18} />, badge: 'Rekening 0122-01-0982-12 a/n Fayupedia', fee: 'Rp 0' },
    { id: 'DANA', name: 'DANA E-Wallet', icon: <Smartphone size={18} />, badge: '0881-5722-784 a/n Fayupedia', fee: 'Rp 0' },
    { id: 'GOPAY', name: 'GoPay / OVO', icon: <Smartphone size={18} />, badge: '0881-5722-784 a/n Fayupedia', fee: 'Rp 0' },
  ];

  const handleCreateDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      onOpenAuth();
      return;
    }

    const numAmount = typeof amount === 'number' ? amount : 0;
    if (numAmount < 10000) {
      setError('Minimal deposit saldo adalah Rp 10.000');
      return;
    }

    setLoading(true);
    try {
      const res = await api.createDeposit({
        amount: numAmount,
        paymentMethod: method,
        notes: notes || `Topup Saldo via ${method}`
      });

      if (res.success && res.deposit) {
        setCreatedDeposit(res.deposit);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        onRefresh();
      } else {
        setError(res.error || 'Gagal membuat permintaan deposit');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveDeposit = async (depositId: string) => {
    try {
      const res = await api.approveDeposit(depositId);
      if (res.success) {
        confetti({ particleCount: 70, spread: 70 });
        if (createdDeposit && createdDeposit.id === depositId) {
          setCreatedDeposit(null);
        }
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Window: Formulir Deposit */}
      <MacOSWindow
        title="Deposit Saldo Akun"
        subtitle="Saldo masuk otomatis setelah pembayaran terverifikasi"
        icon={<CreditCard size={18} />}
      >
        {createdDeposit ? (
          /* Invoice / Payment Detail View */
          <div className="space-y-6 p-2 md:p-4 animate-fadeIn">
            <div className="p-4 md:p-6 rounded-3xl bg-slate-900/90 border border-sky-400/30 shadow-glass space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                    <QrCode size={22} />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">Invoice Deposit</span>
                    <h3 className="text-sm md:text-base font-bold text-white font-mono">
                      #{createdDeposit.id}
                    </h3>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                  Menunggu Pembayaran
                </span>
              </div>

              {/* Amount to pay (exact) */}
              <div className="text-center py-4 bg-sky-950/30 rounded-2xl border border-sky-500/20">
                <span className="text-xs text-slate-400 block mb-1">
                  Jumlah Yang Harus Ditransfer (Tepat Termasuk Kode Unik):
                </span>
                <div className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300 font-mono tracking-tight">
                  {formatRupiah(createdDeposit.amount)}
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(String(createdDeposit.amount))}
                  className="mt-2 text-xs font-semibold text-sky-400 hover:text-sky-300 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-500/15 border border-sky-400/30"
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copied ? 'Tersalin!' : 'Salin Jumlah Nominal'}</span>
                </button>
              </div>

              {/* QRIS / Account Info */}
              {createdDeposit.payment_method === 'QRIS' ? (
                <div className="flex flex-col items-center justify-center text-center space-y-3 py-3">
                  {/* Simulated High-Res QRIS Code */}
                  <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-sky-400/30">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020101021126580016ID.FAYUPEDIA.WWW0118936009990000000001520458125303360540${createdDeposit.amount}5802ID5913FAYUPEDIA_SMM6007JAKARTA6304D1A2`}
                      alt="QRIS Fayupedia SMM"
                      className="w-44 h-44 object-contain"
                    />
                  </div>
                  <p className="text-xs text-slate-300 max-w-sm">
                    Scan kode QRIS di atas menggunakan GoPay, OVO, DANA, BCA Mobile, Livin Mandiri, atau aplikasi perbankan lainnya.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Metode:</span>
                    <span className="font-bold text-white">{createdDeposit.payment_method}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Nomor Rekening / Tujuan:</span>
                    <span className="font-mono font-bold text-sky-400">
                      {createdDeposit.payment_method.includes('BCA') ? '873-092-1102' : '0881-5722-784'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Atas Nama:</span>
                    <span className="font-bold text-white">Fayupedia Official</span>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
                {/* Instant Verification Simulation for demo/testing */}
                <button
                  type="button"
                  onClick={() => handleApproveDeposit(createdDeposit.id)}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-xs shadow-md border border-emerald-400/40 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  <span>Konfirmasi Pembayaran Selesai</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCreatedDeposit(null)}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-slate-300 text-xs font-medium border border-white/10"
                >
                  Tutup / Buat Deposit Lain
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Deposit Creation Form */
          <form onSubmit={handleCreateDeposit} className="space-y-6">
            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2.5">
                Pilih Metode Pembayaran
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {paymentMethods.map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setMethod(pm.id as any)}
                    className={`p-3.5 rounded-2xl text-left transition-all duration-200 border flex flex-col justify-between gap-1.5 ${
                      method === pm.id
                        ? 'bg-sky-500/20 border-sky-400 text-white shadow-glass'
                        : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/[0.08]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sky-400">{pm.icon}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-semibold">
                        Biaya {pm.fee}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{pm.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 truncate">{pm.badge}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Nominal Presets */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Pilih Nominal Cepat
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {presets.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-all border ${
                      amount === val
                        ? 'bg-sky-500 text-white border-sky-400 shadow-sm'
                        : 'bg-white/[0.04] border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    {val >= 1000 ? `${val / 1000}K` : val}
                  </button>
                ))}
              </div>
            </div>

            {/* Nominal Custom Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nominal Deposit (IDR)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  Rp
                </span>
                <input
                  type="number"
                  min={10000}
                  step={1000}
                  value={amount}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAmount(val === '' ? '' : Number(val));
                  }}
                  placeholder="Minimal 10000"
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/[0.05] border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 font-mono font-semibold"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Sistem akan menambahkan 3 digit angka unik (misal Rp 50.342) untuk verifikasi otomatis.
              </p>
            </div>

            {/* Notes (Optional) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Catatan Pembayaran (Opsional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Saldo Fayupedia atas nama saya"
                className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.05] border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
              />
            </div>

            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-sky-500/30 border border-sky-400/40 transition-all flex items-center justify-center gap-2 transform active:scale-98"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Lanjutkan ke Pembayaran</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        )}
      </MacOSWindow>

      {/* Bottom Window: Riwayat Deposit */}
      <MacOSWindow
        title="Riwayat Deposit Saldo"
        subtitle="Daftar permintaan topup saldo Anda"
        icon={<Clock size={18} />}
      >
        {deposits.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            Belum ada catatan transaksi deposit.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-medium pb-2">
                  <th className="pb-3 px-3">Invoice</th>
                  <th className="pb-3 px-3">Metode</th>
                  <th className="pb-3 px-3">Nominal</th>
                  <th className="pb-3 px-3">Tanggal</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {deposits.map((dep) => (
                  <tr key={dep.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-sky-400 text-xs">
                      #{dep.id}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-200">
                      {dep.payment_method}
                    </td>
                    <td className="py-3 px-3 font-bold text-white font-mono">
                      {formatRupiah(dep.amount)}
                    </td>
                    <td className="py-3 px-3 text-[11px] text-slate-400">
                      {new Date(dep.created_at).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          dep.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : dep.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {dep.status === 'approved' ? 'Berhasil' : dep.status === 'pending' ? 'Menunggu' : 'Dibatalkan'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {dep.status === 'pending' && (
                        <button
                          type="button"
                          onClick={() => handleApproveDeposit(dep.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold transition-all"
                        >
                          Simulasi Bayar
                        </button>
                      )}
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
