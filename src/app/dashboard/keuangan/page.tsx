'use client';
import { useEffect, useState, FormEvent } from 'react';
import { transactionsApi } from '@/lib/api';
import { formatRupiah, formatRupiahInput, parseRupiahInput, formatDateIDN, formatTimestamp } from '@/lib/utils';
import SummaryCard from '@/components/dashboard/SummaryCard';
import StatusBadge from '@/components/dashboard/StatusBadge';
import LineChart from '@/components/dashboard/LineChart';
import { Wallet, ArrowUpRight, ArrowDownLeft, Plus, X, Check, Calendar, Tag, FileText, TrendingUp, TrendingDown, FileSpreadsheet } from 'lucide-react';
import type { TransactionSummary, MonthlyTransaction } from '@/types';

const CATEGORIES = ['Semua', 'Infaq Umum', 'Infaq Jumat', 'Penyewaan Aula', 'Wakaf Pembangunan', 'Operasional', 'Honorarium', 'Sosial Kemasyarakatan', 'Pemeliharaan'];

export default function KeuanganPage() {
  const [summary, setSummary] = useState<TransactionSummary | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filterType, setFilterType] = useState('Semua');
  const [filterCategory, setFilterCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [formDesc, setFormDesc] = useState('');
  const [formType, setFormType] = useState<'Pemasukan' | 'Pengeluaran'>('Pemasukan');
  const [formCat, setFormCat] = useState('Infaq Umum');
  const [formAmountDisplay, setFormAmountDisplay] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().substring(0, 10));
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sum, txns, monthly] = await Promise.all([
        transactionsApi.summary(),
        transactionsApi.list({
          ...(filterType !== 'Semua' ? { type: filterType } : {}),
          ...(filterCategory ? { category: filterCategory } : {}),
          ...(startDate ? { startDate } : {}),
          ...(endDate ? { endDate } : {}),
          limit: '50',
        }),
        transactionsApi.monthly(),
      ]);
      setSummary(sum);
      setTransactions(txns);
      setMonthlyData(monthly);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterType, filterCategory, startDate, endDate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const amount = parseRupiahInput(formAmount);
    if (!formDesc || amount <= 0) {
      setError('Deskripsi dan jumlah wajib diisi');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await transactionsApi.create({
        date: formDate,
        description: formDesc,
        type: formType,
        category: formCat,
        amount,
      });
      setSuccessMsg('Transaksi berhasil ditambahkan!');
      setTimeout(() => setSuccessMsg(''), 3000);
      setFormDesc('');
      setFormAmount('');
      setFormAmountDisplay('');
      setShowForm(false);
      await fetchData();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus transaksi ini?')) return;
    try {
      await transactionsApi.delete(id);
      await fetchData();
      setSuccessMsg('Transaksi berhasil dihapus!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleExportCsv = () => {
    const params = new URLSearchParams();
    if (filterType !== 'Semua') params.set('type', filterType);
    if (filterCategory) params.set('category', filterCategory);
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    window.location.href = `/api/admin/transactions/export${params.toString() ? `?${params.toString()}` : ''}`;
  };
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    setFormAmountDisplay(raw ? formatRupiahInput(raw) : '');
    setFormAmount(raw);
  };

  if (loading && !summary) {
    return <div className="flex items-center justify-center h-64"><p className="text-slate-500">Memuat data...</p></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Keuangan Masjid</h1>
          <p className="text-sm text-slate-500">Laporan pemasukan & pengeluaran dana masjid</p>
        </div>
        <StatusBadge status="active" label={formatTimestamp(new Date().toISOString())} />
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold p-3 rounded-xl">{error}</div>
      )}
      {successMsg && (
        <div className="bg-emerald-100 text-emerald-800 text-xs font-semibold p-3 rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SummaryCard title="Saldo Kas Saat Ini" value={formatRupiah(summary.saldo)} subtitle="Total all-time" icon={<Wallet className="w-5 h-5" />} variant="primary" />
          <SummaryCard title="Pemasukan Bulan Ini" value={formatRupiah(summary.pemasukanBulanIni)} icon={<ArrowUpRight className="w-5 h-5" />} />
          <SummaryCard title="Pengeluaran Bulan Ini" value={formatRupiah(summary.pengeluaranBulanIni)} icon={<ArrowDownLeft className="w-5 h-5" />} />
          <SummaryCard
            title="Selisih Bulan Ini"
            value={formatRupiah(summary.selisihBulanIni)}
            subtitle={summary.selisihBulanIni >= 0 ? 'Surplus' : 'Defisit'}
            icon={summary.selisihBulanIni >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
          />
        </div>
      )}

      {monthlyData.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-100 card-shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">Tren Keuangan 6 Bulan</h3>
            <div className="flex items-center gap-4 text-[10px] text-slate-500">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Pemasukan</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Pengeluaran</span>
            </div>
          </div>
          <LineChart
            labels={monthlyData.map((m) => {
              const [y, mm] = m.month.split('-');
              const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
              return `${monthNames[parseInt(mm, 10) - 1]} '${y.slice(2)}`;
            })}
            series={[
              { label: 'Pemasukan', data: monthlyData.map((m) => m.pemasukan), color: 'emerald' },
              { label: 'Pengeluaran', data: monthlyData.map((m) => m.pengeluaran), color: 'amber' },
            ]}
            height={280}
            yFormatter={(v) => formatRupiah(v)}
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            {['Semua', 'Pemasukan', 'Pengeluaran'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                  filterType === t ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600 hover:text-emerald-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="bg-white border border-gray-200 text-xs rounded-lg px-2.5 py-1.5 text-slate-700 focus:ring-1 focus:ring-emerald-500 focus:outline-none">
            {CATEGORIES.map((c) => (
              <option key={c} value={c === 'Semua' ? '' : c}>{c}</option>
            ))}
          </select>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-white border border-gray-200 text-xs rounded-lg px-2 py-1.5 text-slate-700 focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
          <span className="text-[10px] text-slate-400">s/d</span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-white border border-gray-200 text-xs rounded-lg px-2 py-1.5 text-slate-700 focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleExportCsv} className="bg-white border border-emerald-200 hover:bg-emerald-50 text-emerald-800 text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Spreadsheet</span>
          </button>
          <button onClick={() => setShowForm(!showForm)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer">
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{showForm ? 'Batal' : 'Tambah Transaksi'}</span>
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-emerald-900 mb-1">Jenis</label>
              <select value={formType} onChange={(e) => { setFormType(e.target.value as any); setFormCat(e.target.value === 'Pemasukan' ? 'Infaq Umum' : 'Operasional'); }} className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none">
                <option value="Pemasukan">Pemasukan</option>
                <option value="Pengeluaran">Pengeluaran</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-emerald-900 mb-1">Deskripsi</label>
              <input type="text" required placeholder="Deskripsi transaksi" value={formDesc} onChange={(e) => setFormDesc(e.target.value)} className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-emerald-900 mb-1">Kategori</label>
              <select value={formCat} onChange={(e) => setFormCat(e.target.value)} className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none">
                {formType === 'Pemasukan' ? (
                  <><option value="Infaq Umum">Infaq Umum</option><option value="Infaq Jumat">Infaq Jumat</option><option value="Penyewaan Aula">Penyewaan Aula</option><option value="Wakaf Pembangunan">Wakaf Pembangunan</option></>
                ) : (
                  <><option value="Operasional">Operasional</option><option value="Honorarium">Honorarium</option><option value="Sosial Kemasyarakatan">Sosial Kemasyarakatan</option><option value="Pemeliharaan">Pemeliharaan</option></>
                )}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-emerald-900 mb-1">Jumlah (Rp)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-2 flex items-center text-xs text-slate-500 pointer-events-none">Rp</span>
                <input
                  type="text"
                  required
                  inputMode="numeric"
                  placeholder="1.000.000"
                  value={formAmountDisplay}
                  onChange={handleAmountChange}
                  className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg p-2 pl-8 text-xs font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <p className="text-[9px] text-slate-400 mt-0.5">Otomatis format: {formAmountDisplay || '1.000.000'}</p>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-emerald-900 mb-1">Tanggal</label>
              <input type="date" required value={formDate} onChange={(e) => setFormDate(e.target.value)} className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={submitting} className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold px-6 py-2 rounded-xl transition cursor-pointer">
              {submitting ? 'Menyimpan...' : 'Simpan Transaksi'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 card-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-gray-100/60 border-b border-gray-200">
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-600"><span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Tanggal</span></th>
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-600"><span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> Deskripsi</span></th>
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-600"><span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> Kategori</span></th>
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-600 text-right">Jumlah</th>
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-600 text-center">Tipe</th>
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-600 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-slate-500">Belum ada transaksi</td></tr>
              ) : (
                transactions.map((tx: any) => {
                  const isIn = tx.type === 'Pemasukan';
                  return (
                    <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5 whitespace-nowrap text-xs text-slate-600">{formatDateIDN(tx.date)}</td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-slate-900">{tx.description}</td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${isIn ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>{tx.category}</span>
                      </td>
                      <td className={`px-5 py-3.5 whitespace-nowrap text-sm font-bold font-mono text-right ${isIn ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {isIn ? '+' : '-'}{formatRupiah(tx.amount)}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <StatusBadge status={isIn ? 'approved' : 'rejected'} label={tx.type} />
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <button onClick={() => handleDelete(tx.id)} className="text-[10px] text-rose-500 hover:text-rose-700 hover:underline cursor-pointer">
                          Hapus
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
