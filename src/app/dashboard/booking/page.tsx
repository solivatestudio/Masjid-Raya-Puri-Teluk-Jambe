'use client';
import { useEffect, useState, FormEvent } from 'react';
import { bookingsApi } from '@/lib/api';
import { formatDate, formatDateShort } from '@/lib/utils';
import SummaryCard from '@/components/dashboard/SummaryCard';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { CalendarCheck, Clock, Users, CheckCircle, XCircle, Plus, X, Check } from 'lucide-react';
import type { BookingSummary, BookingRecord } from '@/types';

export default function BookingPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [summary, setSummary] = useState<BookingSummary | null>(null);
  const [approvedDates, setApprovedDates] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formWhatsapp, setFormWhatsapp] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formTimeStart, setFormTimeStart] = useState('08:00');
  const [formTimeEnd, setFormTimeEnd] = useState('14:00');
  const [formPurpose, setFormPurpose] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const today = new Date();
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bks, sum, dates] = await Promise.all([
        bookingsApi.list(filterStatus !== 'Semua' ? { status: filterStatus } : undefined),
        bookingsApi.summary(),
        bookingsApi.calendar(),
      ]);
      setBookings(bks);
      setSummary(sum);
      setApprovedDates(dates);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterStatus]);

  const handleStatus = async (id: string, status: string) => {
    const notes = status === 'rejected' ? prompt('Alasan penolakan (opsional):') || '' : '';
    try {
      await bookingsApi.updateStatus(id, status, notes);
      fetchData();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!formName || !formWhatsapp || !formDate || !formPurpose) return;
    try {
      await bookingsApi.create({
        name: formName,
        whatsapp: formWhatsapp,
        date: formDate,
        timeStart: formTimeStart,
        timeEnd: formTimeEnd,
        purpose: formPurpose,
        notes: formNotes,
        needOrganizer: false,
      });
      setSuccessMsg('Booking berhasil ditambahkan!');
      setTimeout(() => setSuccessMsg(''), 3000);
      setFormName('');
      setFormWhatsapp('');
      setFormDate('');
      setFormPurpose('');
      setFormNotes('');
      setShowForm(false);
      fetchData();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Manajemen Booking Aula</h1>
          <p className="text-sm text-slate-500">Kelola permintaan sewa aula serbaguna masjid</p>
        </div>
        <StatusBadge status="active" />
      </div>

      {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold p-3 rounded-xl">{error}</div>}
      {successMsg && (
        <div className="bg-emerald-100 text-emerald-800 text-xs font-semibold p-3 rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard title="Total Pending" value={String(summary.totalPending)} subtitle="Butuh review admin" icon={<Clock className="w-5 h-5" />} variant="primary" />
          <SummaryCard title="Approved Bulan Ini" value={String(summary.totalApprovedThisMonth)} icon={<CheckCircle className="w-5 h-5" />} />
          <SummaryCard
            title="Booking Terdekat"
            value={summary.nearestBooking ? formatDateShort(summary.nearestBooking.date) : '-'}
            subtitle={summary.nearestBooking ? `${summary.nearestBooking.name} — ${summary.nearestBooking.purpose}` : 'Tidak ada'}
            icon={<Users className="w-5 h-5" />}
          />
        </div>
      )}

      <div className="flex justify-end">
        <button onClick={() => setShowForm(!showForm)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{showForm ? 'Batal' : 'Tambah Booking'}</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-emerald-900 mb-1">Nama Pemesan</label>
              <input type="text" required placeholder="Nama lengkap" value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-emerald-900 mb-1">No. WhatsApp</label>
              <input type="text" required placeholder="081234567890" value={formWhatsapp} onChange={(e) => setFormWhatsapp(e.target.value)} className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-emerald-900 mb-1">Tanggal</label>
              <input type="date" required value={formDate} onChange={(e) => setFormDate(e.target.value)} className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-emerald-900 mb-1">Keperluan</label>
              <input type="text" required placeholder="Contoh: Walimah Nikah" value={formPurpose} onChange={(e) => setFormPurpose(e.target.value)} className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-emerald-900 mb-1">Jam Mulai</label>
              <input type="time" required value={formTimeStart} onChange={(e) => setFormTimeStart(e.target.value)} className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-emerald-900 mb-1">Jam Selesai</label>
              <input type="time" required value={formTimeEnd} onChange={(e) => setFormTimeEnd(e.target.value)} className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-emerald-900 mb-1">Catatan Tambahan</label>
              <input type="text" placeholder="Opsional" value={formNotes} onChange={(e) => setFormNotes(e.target.value)} className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none" />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-6 py-2 rounded-xl transition cursor-pointer">
              Simpan Booking
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-slate-100 card-shadow p-5">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); } else { setCalMonth(calMonth - 1); } }} className="text-xs font-bold text-slate-600 hover:text-emerald-700 cursor-pointer px-2 py-1">‹</button>
            <span className="text-sm font-bold text-slate-800">{monthNames[calMonth]} {calYear}</span>
            <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); } else { setCalMonth(calMonth + 1); } }} className="text-xs font-bold text-slate-600 hover:text-emerald-700 cursor-pointer px-2 py-1">›</button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d) => (
              <span key={d} className="text-[9px] font-bold text-slate-400 py-1">{d}</span>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isApproved = approvedDates.includes(dateStr);
              const isToday = dateStr === today.toISOString().split('T')[0];
              return (
                <div key={day} className={`relative p-1.5 rounded-lg text-xs font-semibold ${isApproved ? 'bg-emerald-100 text-emerald-800' : isToday ? 'bg-amber-50 text-amber-800' : 'text-slate-700'}`}>
                  {day}
                  {isApproved && <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full" />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 card-shadow overflow-hidden">
          <div className="px-5 pt-4 pb-2 flex gap-1 bg-gray-50/40">
            {['Semua', 'pending', 'approved', 'rejected'].map((s) => (
              <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${filterStatus === s ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600 hover:text-emerald-700'}`}>
                {s === 'Semua' ? 'Semua' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="bg-gray-100/60 border-b border-gray-200">
                  <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-600">Nama</th>
                  <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-600">Kontak</th>
                  <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-600">Keperluan</th>
                  <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-600">Tanggal</th>
                  <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-600">Jam</th>
                  <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-600">Status</th>
                  <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-gray-600 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500">Belum ada booking</td></tr>
                ) : (
                  bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900">{b.name}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        <a href={`https://wa.me/${b.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">{b.whatsapp}</a>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-700 max-w-[160px] truncate">{b.purpose}</td>
                      <td className="px-4 py-3 text-xs text-slate-600 font-mono">{b.date}</td>
                      <td className="px-4 py-3 text-xs text-slate-600 font-mono">{b.time_start.slice(0, 5)} - {b.time_end.slice(0, 5)}</td>
                      <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                      <td className="px-4 py-3">
                        {b.status === 'pending' ? (
                          <div className="flex items-center gap-1.5 justify-center">
                            <button onClick={() => handleStatus(b.id, 'approved')} className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg transition cursor-pointer" title="Approve">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleStatus(b.id, 'rejected')} className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg transition cursor-pointer" title="Reject">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 justify-center">
                            {b.admin_notes && (
                              <span className="text-[9px] text-slate-400 italic max-w-[100px] truncate" title={b.admin_notes}>
                                {b.admin_notes}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
