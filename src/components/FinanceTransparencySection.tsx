'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, FileSpreadsheet, RefreshCw, ShieldCheck, Wallet } from 'lucide-react';

type FinanceRow = {
  date: string;
  description: string;
  type: 'Pemasukan' | 'Pengeluaran';
  category: string;
  amount: number;
};

type FinancePayload = {
  summary: {
    saldo: number;
    totalPemasukan: number;
    totalPengeluaran: number;
    updatedAt: string | null;
  };
  latest: FinanceRow[];
  categories: { category: string; type: 'Pemasukan' | 'Pengeluaran'; total: number }[];
};

const formatRupiah = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

export default function FinanceTransparencySection() {
  const [data, setData] = useState<FinancePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetch('/api/public/finance', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('Gagal memuat data keuangan');
        return res.json();
      })
      .then((payload) => {
        if (active) setData(payload);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const topCategories = useMemo(() => data?.categories.slice(0, 4) || [], [data]);

  return (
    <section id="transparansi-keuangan" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" /> Transparansi Kas Masjid
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              Laporan Keuangan Terbuka untuk Jamaah
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Ringkasan pemasukan dan pengeluaran kas DKM diperbarui dari dashboard bendahara agar jamaah dapat memantau amanah dana masjid secara terbuka.
            </p>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-emerald-600" />
            {data?.summary.updatedAt ? `Update terakhir ${new Date(data.summary.updatedAt).toLocaleString('id-ID')}` : 'Data real-time dari dashboard'}
          </div>
        </div>

        {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-emerald-950 text-white rounded-2xl p-6 border border-emerald-900 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-emerald-300 font-bold">Saldo Kas Saat Ini</p>
                <p className="text-3xl font-black mt-2 font-mono">{loading ? 'Memuat...' : formatRupiah(data?.summary.saldo || 0)}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center">
                <Wallet className="w-6 h-6" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-8">
              <div className="bg-white/8 border border-white/10 rounded-xl p-4">
                <ArrowUpRight className="w-4 h-4 text-emerald-300 mb-2" />
                <p className="text-[10px] uppercase tracking-widest text-emerald-300 font-bold">Total Pemasukan</p>
                <p className="text-sm font-black font-mono mt-1">{formatRupiah(data?.summary.totalPemasukan || 0)}</p>
              </div>
              <div className="bg-white/8 border border-white/10 rounded-xl p-4">
                <ArrowDownLeft className="w-4 h-4 text-amber-300 mb-2" />
                <p className="text-[10px] uppercase tracking-widest text-emerald-300 font-bold">Total Pengeluaran</p>
                <p className="text-sm font-black font-mono mt-1">{formatRupiah(data?.summary.totalPengeluaran || 0)}</p>
              </div>
            </div>
            <div className="mt-6 rounded-xl bg-emerald-900/70 border border-emerald-800 p-4 flex items-start gap-3">
              <FileSpreadsheet className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-100 leading-relaxed">
                Data detail dikelola bendahara melalui dashboard dan dapat diekspor ke spreadsheet untuk arsip rapat DKM.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-sm font-extrabold text-slate-900 mb-4">Kategori Terbesar</h3>
              <div className="space-y-3">
                {topCategories.length === 0 ? (
                  <p className="text-xs text-slate-500">Belum ada data kategori.</p>
                ) : topCategories.map((item) => (
                  <div key={`${item.category}-${item.type}`} className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{item.category}</p>
                      <p className={`text-[10px] font-bold ${item.type === 'Pemasukan' ? 'text-emerald-700' : 'text-rose-600'}`}>{item.type}</p>
                    </div>
                    <p className="text-xs font-black font-mono text-slate-900">{formatRupiah(item.total)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="text-sm font-extrabold text-slate-900 mb-4">Transaksi Terbaru</h3>
              <div className="space-y-3">
                {(data?.latest || []).slice(0, 5).map((tx) => (
                  <div key={`${tx.date}-${tx.description}-${tx.amount}`} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-bold text-slate-900 truncate">{tx.description}</p>
                      <p className={`text-xs font-black font-mono whitespace-nowrap ${tx.type === 'Pemasukan' ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {tx.type === 'Pemasukan' ? '+' : '-'}{formatRupiah(tx.amount)}
                      </p>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">{formatDate(tx.date)} · {tx.category}</p>
                  </div>
                ))}
                {!loading && (!data || data.latest.length === 0) && <p className="text-xs text-slate-500">Belum ada transaksi.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
