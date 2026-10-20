'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

function isFridayDate(value: string): boolean {
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return false;
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay() === 5;
}

export default function NewKhutbahPage() {
  const router = useRouter();
  const [scheduleDate, setScheduleDate] = useState('');
  const [khatib, setKhatib] = useState('');
  const [muadzin, setMuadzin] = useState('');
  const [theme, setTheme] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleDateChange = (value: string) => {
    setScheduleDate(value);
    if (value && !isFridayDate(value)) setError('Tanggal khutbah harus hari Jumat');
    else setError('');
  };

  const handleSave = async () => {
    setError('');
    if (!scheduleDate || !khatib) { setError('Tanggal dan khatib wajib diisi'); return; }
    if (!isFridayDate(scheduleDate)) { setError('Tanggal khutbah harus hari Jumat'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/khutbah', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        cache: 'no-store',
        body: JSON.stringify({ schedule_date: scheduleDate, khatib, muadzin: muadzin || null, theme: theme || null, notes: notes || null }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Gagal');
      router.push('/dashboard/khutbah');
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <Link href="/dashboard/khutbah" className="text-slate-600 hover:text-slate-900 flex items-center gap-2 text-sm"><ArrowLeft className="w-4 h-4" /> Kembali</Link>
      <h1 className="text-2xl font-extrabold text-slate-900">Tambah Jadwal Khutbah</h1>
      {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm p-3 rounded-xl">{error}</div>}
      <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-6 space-y-4">
        <div><label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Jumat</label><input type="date" value={scheduleDate} min="1970-01-02" step={7} onChange={(e) => handleDateChange(e.target.value)} className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none" /><p className="mt-1 text-[10px] text-slate-500">Hanya hari Jumat yang bisa disimpan.</p></div>
        <div><label className="block text-xs font-bold text-slate-700 mb-1">Khatib / Imam</label><input type="text" value={khatib} onChange={(e) => setKhatib(e.target.value)} className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none" /></div>
        <div><label className="block text-xs font-bold text-slate-700 mb-1">Muadzin</label><input type="text" value={muadzin} onChange={(e) => setMuadzin(e.target.value)} className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none" /></div>
        <div><label className="block text-xs font-bold text-slate-700 mb-1">Tema Khutbah</label><textarea value={theme} onChange={(e) => setTheme(e.target.value)} rows={2} className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none" /></div>
        <div><label className="block text-xs font-bold text-slate-700 mb-1">Catatan Internal</label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none" /></div>
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button onClick={handleSave} disabled={saving} className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-6 py-2.5 rounded-xl flex items-center gap-1.5">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan</button>
        </div>
      </div>
    </div>
  );
}
