import { useState, FormEvent } from 'react';
import { FinanceRecord } from '../types';
import { ArrowUpRight, ArrowDownLeft, Wallet, Calculator, Calendar, Tag, FileText, Plus, Check } from 'lucide-react';

interface TransparencySectionProps {
  ledger: FinanceRecord[];
  onAddRecord: (record: Omit<FinanceRecord, 'id'>) => void;
}

export default function TransparencySection({ ledger, onAddRecord }: TransparencySectionProps) {
  const [filterType, setFilterType] = useState<'Semua' | 'Pemasukan' | 'Pengeluaran'>('Semua');
  const [showAddForm, setShowAddForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  
  // New Record Form State
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState<'Pemasukan' | 'Pengeluaran'>('Pemasukan');
  const [newCat, setNewCat] = useState('Infaq Umum');
  const [newAmount, setNewAmount] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().substring(0, 10));

  // Calculations
  const totalPemasukan = ledger
    .filter((r) => r.type === 'Pemasukan')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalPengeluaran = ledger
    .filter((r) => r.type === 'Pengeluaran')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const saldoKasMasjid = totalPemasukan - totalPengeluaran;

  const filteredLedger = ledger.filter((record) => {
    if (filterType === 'Semua') return true;
    return record.type === filterType;
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(newAmount);
    if (!newDesc || isNaN(amountVal) || amountVal <= 0) return;

    onAddRecord({
      date: newDate,
      description: newDesc,
      type: newType,
      category: newCat,
      amount: amountVal,
    });

    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
    }, 2000);

    // Reset Form
    setNewDesc('');
    setNewAmount('');
    setShowAddForm(false);
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section id="transparansi" className="py-20 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wider">
            Laporan Keuangan Terbuka
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight mt-3">
            Transparansi Kas & Infaq Masjid
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Sesuai tuntunan syariat Islam mengenai amanah kepengurusan, kami laporkan catatan keluar-masuk dana masjid secara realtime demi menjaga kepercayaan seluruh jamaah.
          </p>
        </div>

        {/* Financial Metrics Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          {/* Card: Saldo Kas */}
          <div className="emerald-gradient p-6.5 rounded-3xl text-white card-shadow border border-emerald-700/40 relative overflow-hidden group">
            <div className="absolute top-1/2 -right-6 -translate-y-1/2 w-40 h-40 bg-white/5 rounded-full blur-2xl transition duration-500 group-hover:scale-110" />
            
            <div className="flex items-center justify-between mb-4 relative z-10">
              <span className="text-xs font-semibold text-emerald-200 tracking-wide uppercase">
                Saldo Kas Masjid Saat Ini
              </span>
              <div className="p-2 bg-emerald-800 rounded-lg text-amber-400">
                <Wallet className="w-5 h-5" />
              </div>
            </div>

            <div className="relative z-10">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-amber-300">
                {formatRupiah(saldoKasMasjid)}
              </div>
              <p className="text-[11px] text-emerald-300 mt-2 font-medium">
                Penyelarasan Buku Pembantu Terakhir: Realtime
              </p>
            </div>
          </div>

          {/* Card: Total Pemasukan */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 card-shadow flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-emerald-800 tracking-wide uppercase">
                Total Pemasukan Juni 2026
              </span>
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>

            <div>
              <div className="text-2xl font-bold font-mono text-emerald-950">
                {formatRupiah(totalPemasukan)}
              </div>
              <p className="text-[11px] text-gray-500 mt-2">
                Dari Infaq Jumat, Harian, Donasi QRIS, & Sewa Aula
              </p>
            </div>
          </div>

          {/* Card: Total Pengeluaran */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 card-shadow flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-amber-800 tracking-wide uppercase">
                Total Pengeluaran Juni 2026
              </span>
              <div className="p-2 bg-amber-100/60 rounded-lg text-amber-600">
                <ArrowDownLeft className="w-5 h-5" />
              </div>
            </div>

            <div>
              <div className="text-2xl font-bold font-mono text-amber-950">
                {formatRupiah(totalPengeluaran)}
              </div>
              <p className="text-[11px] text-gray-500 mt-2">
                Untuk Operasional, Listrik, Kebersihan, Keamanan, & Kegiatan Sosial
              </p>
            </div>
          </div>
        </div>

        {/* Ledger Control Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
          {/* Table Filters */}
          <div className="flex bg-gray-100 p-1 rounded-xl w-full sm:w-auto">
            {['Semua', 'Pemasukan', 'Pengeluaran'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type as any)}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterType === type
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-emerald-700'
                }`}
              >
                {type === 'Semua' ? 'Semua Arus Kas' : type === 'Pemasukan' ? '🟢 Pemasukan' : '🔴 Pengeluaran'}
              </button>
            ))}
          </div>

          {/* Simulate Adding Entry (Interactive feature!) */}
          <button
            id="btn-toggle-add-record"
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow shadow-emerald-600/10 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Simulasi Input Data Kas</span>
          </button>
        </div>

        {/* Simulated Addition Form */}
        {showAddForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-6.5 mb-8 space-y-4 animate-in slide-in-from-top-3 duration-200"
          >
            <div className="flex justify-between items-center pb-2.5 border-b border-emerald-100">
              <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-emerald-600" />
                <span>Simulasi Tambah Arus Kas Baru</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-xs"
              >
                Batal
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Type Selection */}
              <div>
                <label className="block text-[11px] font-bold text-emerald-900 mb-1">
                  Jenis Transaksi
                </label>
                <select
                  value={newType}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    setNewType(val);
                    // Match default category
                    setNewCat(val === 'Pemasukan' ? 'Infaq Umum' : 'Operasional');
                  }}
                  className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Pemasukan">Pemasukan (Infaq/Wakaf)</option>
                  <option value="Pengeluaran">Pengeluaran (Operasional/Sosial)</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-bold text-emerald-900 mb-1">
                  Deskripsi Transaksi
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Infaq Pagi Berkah"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-[11px] font-bold text-emerald-900 mb-1">
                  Kategori Pembukuan
                </label>
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                  className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                >
                  {newType === 'Pemasukan' ? (
                    <>
                      <option value="Infaq Umum">Infaq Umum</option>
                      <option value="Infaq Jumat">Infaq Jumat</option>
                      <option value="Penyewaan Aula">Penyewaan Aula</option>
                      <option value="Wakaf Pembangunan">Wakaf Pembangunan</option>
                    </>
                  ) : (
                    <>
                      <option value="Operasional">Operasional (PLN, PAM, WiFi)</option>
                      <option value="Honorarium">Honor Da\'i & Muadzin</option>
                      <option value="SosialKemasyarakatan">Sosial & Kemasyarakatan</option>
                      <option value="Pemeliharaan">Pemeliharaan Bangunan</option>
                    </>
                  )}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-[11px] font-bold text-emerald-900 mb-1">
                  Jumlah Dana (Rupiah)
                </label>
                <input
                  type="number"
                  required
                  min="1000"
                  step="1000"
                  placeholder="Contoh: 150000"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-[11px] font-bold text-emerald-900 mb-1">
                  Tanggal Pencatatan
                </label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-6 py-2 rounded-xl transition cursor-pointer shadow-md shadow-emerald-700/10"
              >
                Masukkan ke Ledger Kas
              </button>
            </div>
          </form>
        )}

        {/* Financial Record Listing Table */}
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 card-shadow">
          {successMsg && (
            <div className="bg-emerald-100 text-emerald-800 text-xs font-semibold p-3.5 flex items-center justify-center gap-2">
              <Check className="w-4 h-4" />
              <span>Berhasil! Simulasi Transaksi Kas Baru Telah Ditambahkan Secara Realtime.</span>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-100/60 border-b border-gray-200">
                  <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-gray-600">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-gray-400" /> Tanggal</span>
                  </th>
                  <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-gray-600">
                    <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-gray-400" /> Deskripsi Transaksi</span>
                  </th>
                  <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-gray-600">
                    <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5 text-gray-400" /> Kategori</span>
                  </th>
                  <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-gray-600 text-right">
                    <span>Jumlah Dana</span>
                  </th>
                  <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-gray-600 text-center">
                    <span>Arus Cash</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLedger.map((record) => {
                  const isIntake = record.type === 'Pemasukan';
                  return (
                    <tr
                      key={record.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      {/* Date */}
                      <td className="px-6 py-3.5 whitespace-nowrap text-xs font-medium text-gray-500 font-mono">
                        {record.date}
                      </td>

                      {/* Description */}
                      <td className="px-6 py-3.5 text-sm font-semibold text-gray-900">
                        {record.description}
                      </td>

                      {/* Category */}
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          isIntake ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                        }`}>
                          {record.category}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-3.5 whitespace-nowrap text-sm font-bold font-mono text-right">
                        <span className={isIntake ? 'text-emerald-700' : 'text-rose-600'}>
                          {isIntake ? '+' : '-'} {formatRupiah(record.amount)}
                        </span>
                      </td>

                      {/* Cashflow Type Badge */}
                      <td className="px-6 py-3.5 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          isIntake 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isIntake ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {record.type}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
