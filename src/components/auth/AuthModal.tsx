import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  LogIn,
  UserPlus
} from 'lucide-react';
import { api } from '../../services/api';
import { User } from '../../types';
import confetti from 'canvas-confetti';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (tab === 'register') {
        if (!name.trim()) throw new Error('Nama lengkap wajib diisi');
        if (!email.trim() || !email.includes('@')) throw new Error('Email tidak valid');
        if (password.length < 6) throw new Error('Password minimal 6 karakter');
        if (password !== confirmPassword) throw new Error('Konfirmasi password tidak cocok');

        const res = await api.register({ name, email, password });
        if (res.success && res.user) {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
          onSuccess(res.user);
          onClose();
        } else {
          setError(res.error || 'Pendaftaran gagal');
        }
      } else {
        if (!email.trim()) throw new Error('Email wajib diisi');
        if (!password.trim()) throw new Error('Password wajib diisi');

        const res = await api.login({ email, password });
        if (res.success && res.user) {
          confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
          onSuccess(res.user);
          onClose();
        } else {
          setError(res.error || 'Login gagal. Periksa kembali email & password Anda.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      // Direct simulation of Google OAuth / One-tap
      const demoEmail = `user.${Math.random().toString(36).substring(2, 6)}@gmail.com`;
      const demoName = 'Google Member';
      const res = await api.loginWithGoogle({
        email: demoEmail,
        name: demoName,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${demoName}`
      });

      if (res.success && res.user) {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
        onSuccess(res.user);
        onClose();
      } else {
        setError(res.error || 'Google Sign-In gagal');
      }
    } catch (err: any) {
      setError(err.message || 'Gagal terhubung dengan layanan Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fadeIn">
      {/* macOS Window Dialog */}
      <div className="w-full max-w-md rounded-3xl liquid-glass border border-white/20 shadow-2xl overflow-hidden water-specular">
        {/* macOS Window Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-white/[0.04] border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-rose-500 hover:bg-rose-600 transition-colors"
              title="Tutup"
            />
            <span className="w-3 h-3 rounded-full bg-amber-500 opacity-60" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 opacity-60" />
            <span className="text-xs font-semibold text-slate-300 ml-2 tracking-wide">
              {tab === 'login' ? 'Masuk ke Fayupedia' : 'Buat Akun Baru'}
            </span>
          </div>
          <span className="text-[10px] text-sky-400 font-mono flex items-center gap-1">
            <ShieldCheck size={12} /> SSL 256-bit
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 space-y-5">
          {/* Header Title */}
          <div className="text-center space-y-1.5">
            <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
              <span>Fayupedia</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
                SMM Panel
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Platform layanan sosial media otomatis dengan tema Liquid Glass
            </p>
          </div>

          {/* Tab Selector (Masuk / Daftar) */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-900/60 border border-white/10">
            <button
              type="button"
              onClick={() => { setTab('login'); setError(null); }}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                tab === 'login'
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn size={14} /> Masuk
            </button>
            <button
              type="button"
              onClick={() => { setTab('register'); setError(null); }}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                tab === 'register'
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus size={14} /> Daftar
            </button>
          </div>

          {/* Google Sign-in Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] text-white font-medium text-xs border border-white/15 transition-all duration-200 shadow-sm group"
          >
            {/* Google SVG Logo */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Lanjutkan dengan Akun Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-[1px] bg-white/10" />
            <span className="text-[11px] text-slate-400 uppercase tracking-wider">atau dengan email</span>
            <div className="flex-1 h-[1px] bg-white/10" />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {tab === 'register' && (
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <UserIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-400 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Alamat Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {tab === 'register' && (
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi password Anda"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-400 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-semibold text-xs shadow-lg shadow-sky-500/25 border border-sky-400/30 transition-all duration-200 flex items-center justify-center gap-2 transform active:scale-95"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{tab === 'login' ? 'Masuk Sekarang' : 'Daftar Akun & Dapatkan Bonus'}</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Demo account quick login helper */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => {
                setEmail('user@fayupedia.id');
                setPassword('password123');
                setTab('login');
              }}
              className="text-[11px] text-sky-400/90 hover:text-sky-300 underline underline-offset-4"
            >
              Coba Akun Demo Cepat (user@fayupedia.id)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
