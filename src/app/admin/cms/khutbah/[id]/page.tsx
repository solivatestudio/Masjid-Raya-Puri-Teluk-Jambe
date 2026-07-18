'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

export default function EditKhutbahPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [khatib, setKhatib] = useState('');
  const [muadzin, setMuadzin] = useState('');
  const [theme, setTheme] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetch(`/api/admin/khutbah/${id}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((k) => {
        setScheduleDate(k.schedule_date); setKhatib(k.khatib);
        setMuadzin(k.muadzin || ''); setTheme(k.theme || '');
        setNotes(k.notes || ''); setLoading(false);
      });
  }, [id]);

  const handleSave = async () => {
    setError(''); setSaving(true);
    try {
      const res = await fetch(`/api/admin/khutbah/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ schedule_date: scheduleDate, khatib, muadzin: muadzin || null, theme: theme || null, notes: notes || null }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Gagal');
      router.push('/admin/cms/khutbah');
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center h-64"><Loader2 className="w-8 h-8 text-emerald-600 animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <Link href="/admin/cms/khutbah" className="text-slate-600 hover:text-slate-900 flex items-center gap-2 text-sm"><ArrowLeft className="w-4 h-4" /> Kembali</Link>
      <h1 className="text-2xl font-extrabold text-slate-900">Edit Jadwal Khutbah</h1>
      {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm p-3 rounded-xl">{error}</div>}
      <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-6 space-y-4">
        <div><label className="block text-xs font-bold text-slate-700 mb-1">Tanggal</label><input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none" /></div>
        <div><label className="block text-xs font-bold text-slate-700 mb-1">Khatib</label><input type="text" value={khatib} onChange={(e) => setKhatib(e.target.value)} className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none" /></div>
        <div><label className="block text-xs font-bold text-slate-700 mb-1">Muadzin</label><input type="text" value={muadzin} onChange={(e) => setMuadzin(e.target.value)} className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none" /></div>
        <div><label className="block text-xs font-bold text-slate-700 mb-1">Tema</label><textarea value={theme} onChange={(e) => setTheme(e.target.value)} rows={2} className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none" /></div>
        <div><label className="block text-xs font-bold text-slate-700 mb-1">Catatan</label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none" /></div>
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button onClick={handleSave} disabled={saving} className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-6 py-2.5 rounded-xl flex items-center gap-1.5">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan</button>
        </div>
      </div>
    </div>
  );
}
