import React, { useState } from 'react';
import { Sparkles, Search, RotateCcw, ArrowRight, Check } from 'lucide-react';
import { ServiceItem } from '../../types';
import { formatRupiah } from '../../services/fayupedia';
import { MacOSWindow } from '../common/MacOSWindow';

interface ServiceCatalogModalProps {
  services: ServiceItem[];
  onSelectService: (service: ServiceItem) => void;
}

export const ServiceCatalogModal: React.FC<ServiceCatalogModalProps> = ({
  services,
  onSelectService
}) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('Semua');

  const categories = ['Semua', ...Array.from(new Set(services.map(s => s.category)))];

  const filtered = services.filter(s => {
    const matchCat = selectedCat === 'Semua' ? true : s.category === selectedCat;
    const matchSearch = search
      ? s.name.toLowerCase().includes(search.toLowerCase()) ||
        String(s.id).includes(search) ||
        s.category.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      <MacOSWindow
        title="Daftar Layanan & Harga Lengkap"
        subtitle="Harga termurah, update otomatis dari server Fayupedia"
        icon={<Sparkles size={18} />}
      >
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/60 border border-white/10 w-full sm:w-auto overflow-x-auto">
            {categories.slice(0, 6).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCat === cat
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari ID / nama layanan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-medium pb-2">
                <th className="pb-3 px-3">ID</th>
                <th className="pb-3 px-3">Kategori & Layanan</th>
                <th className="pb-3 px-3">Harga / 1.000</th>
                <th className="pb-3 px-3">Min / Max</th>
                <th className="pb-3 px-3">Refill</th>
                <th className="pb-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filtered.map((srv) => (
                <tr key={srv.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-sky-400 text-xs">
                    #{srv.id}
                  </td>
                  <td className="py-3 px-3 max-w-sm">
                    <div className="font-semibold text-slate-200">
                      {srv.name}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {srv.category}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-bold text-sky-300 font-mono">
                    {formatRupiah(srv.price)}
                  </td>
                  <td className="py-3 px-3 text-[11px] text-slate-300">
                    {srv.min.toLocaleString('id-ID')} / {srv.max.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-3">
                    {srv.refill === 1 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <RotateCcw size={10} /> Garansi 30H
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400">
                        Non-Refill
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onSelectService(srv)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white font-semibold text-xs shadow-sm transition-all"
                    >
                      Pesan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </MacOSWindow>
    </div>
  );
};
