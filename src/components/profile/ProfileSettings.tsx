import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Camera, 
  Lock, 
  Mail, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Wallet,
  Sparkles
} from 'lucide-react';
import { User } from '../../types';
import { formatRupiah } from '../../services/fayupedia';
import { api } from '../../services/api';
import { MacOSWindow } from '../common/MacOSWindow';

interface ProfileSettingsProps {
  user: User | null;
  onUpdateSuccess: (updated: User) => void;
  onOpenAuth: () => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  user,
  onUpdateSuccess,
  onOpenAuth
}) => {
  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <UserIcon size={48} className="mx-auto text-slate-500 stroke-1" />
        <h3 className="text-lg font-bold text-white">Sesi Belum Masuk</h3>
        <p className="text-xs text-slate-400">Silakan login untuk mengatur profil Anda.</p>
        <button
          onClick={onOpenAuth}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold text-xs shadow-md"
        >
          Masuk ke Akun
        </button>
      </div>
    );
  }

  const [name, setName] = useState(user.name);
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Avatar presets
  const avatarPresets = [
    `https://api.dicebear.com/7.x/bottts/svg?seed=Fayu1`,
    `https://api.dicebear.com/7.x/bottts/svg?seed=ProGamer`,
    `https://api.dicebear.com/7.x/bottts/svg?seed=CyberNinja`,
    `https://api.dicebear.com/7.x/bottts/svg?seed=MasterSMM`,
    `https://api.dicebear.com/7.x/bottts/svg?seed=CryptoKing`,
  ];

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Nama lengkap tidak boleh kosong');
      return;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        setErrorMsg('Password baru minimal 6 karakter');
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMsg('Konfirmasi password baru tidak cocok');
        return;
      }
    }

    setLoading(true);
    try {
      const res = await api.updateProfile({
        name,
        avatar_url: avatarUrl,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined
      });

      if (res.success && res.user) {
        setSuccessMsg('Profil dan data akun berhasil diperbarui!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        onUpdateSuccess(res.user);
      } else {
        setErrorMsg(res.error || 'Gagal memperbarui profil');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Overview Card */}
      <div className="p-6 rounded-3xl liquid-glass border border-white/15 flex flex-col sm:flex-row items-center gap-6 water-specular">
        <div className="relative group">
          <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-sky-400/50 shadow-glass-hover bg-slate-800 flex items-center justify-center">
            <img
              src={avatarUrl || user.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 rounded-3xl bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
            <Camera size={20} className="text-white" />
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1.5">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">{user.name}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30">
              {user.role === 'admin' ? 'Administrator' : 'VIP Member'}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">{user.email}</p>
          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-white/[0.05] px-3 py-1 rounded-xl border border-white/10">
              <Wallet size={14} className="text-sky-400" />
              <span>Saldo: <strong>{formatRupiah(user.balance)}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-white/[0.05] px-3 py-1 rounded-xl border border-white/10">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Status: <strong className="text-emerald-400">Aktif</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Edit Form */}
      <MacOSWindow
        title="Pengaturan Profil Akun"
        subtitle="Ubah foto profil, identitas pengguna, dan kata sandi"
        icon={<UserIcon size={18} />}
      >
        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Avatar Presets Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Pilih Foto Profil (Preset Avatar)
            </label>
            <div className="flex flex-wrap items-center gap-3">
              {avatarPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatarUrl(preset)}
                  className={`w-12 h-12 rounded-2xl overflow-hidden border-2 transition-all p-1 bg-slate-900/80 ${
                    avatarUrl === preset
                      ? 'border-sky-400 shadow-glass-hover scale-110'
                      : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={preset} alt={`Avatar ${idx}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Custom Avatar URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Atau Masukkan URL Foto Sendiri
            </label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/foto-anda.jpg"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
            />
          </div>

          {/* User Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Nama Lengkap / Username Tampilan
            </label>
            <div className="relative">
              <UserIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>

          {/* Email (Readonly) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Terdaftar (Permanen)
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Password Change Section */}
          <div className="pt-4 border-t border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-300">
              <Lock size={15} />
              <span>Ganti Kata Sandi (Kosongkan jika tidak ingin mengubah)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Password Baru
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Ulangi Password Baru
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password baru"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>
          </div>

          {/* Alerts */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-sky-500/25 border border-sky-400/30 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save size={16} />
                <span>Simpan Perubahan Profil</span>
              </>
            )}
          </button>
        </form>
      </MacOSWindow>
    </div>
  );
};
