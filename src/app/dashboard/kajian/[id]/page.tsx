'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

export default function EditKajianPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Dakwah');
  const [dateLabel, setDateLabel] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [timeLabel, setTimeLabel] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [capacity, setCapacity] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringDay, setRecurringDay] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/kajian/${id}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((k) => {
        setTitle(k.title); setCategory(k.category); setDateLabel(k.date_label);
        setDateStart(k.date_start || ''); setTimeLabel(k.time_label);
        setSpeaker(k.speaker || ''); setLocation(k.location || '');
        setDescription(k.description || ''); setImageUrl(k.image_url || '');
        setCapacity(k.capacity || ''); setIsRecurring(k.is_recurring);
        setRecurringDay(k.recurring_day || ''); setIsPublished(k.is_published);
        setLoading(false);
      });
  }, [id]);

  const handleSave = async () => {
    setError(''); setSaving(true);
    try {
      const res = await fetch(`/api/admin/kajian/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ title, category, date_label: dateLabel, date_start: dateStart || null, time_label: timeLabel,
          speaker: speaker || null, location, description: description || null, image_url: imageUrl || null,
          capacity: capacity ? parseInt(capacity) : null, is_recurring: isRecurring, recurring_day: recurringDay || null,
          is_published: isPublished }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Gagal');
      router.push('/dashboard/kajian');
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center h-64"><Loader2 className="w-8 h-8 text-emerald-600 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <Link href="/dashboard/kajian" className="text-slate-600 hover:text-slate-900 flex items-center gap-2 text-sm">
        <ArrowLeft className="w-4 h-4" /> Kembali
      </Link>
      <h1 className="text-2xl font-extrabold text-slate-900">Edit Kajian</h1>
      {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm p-3 rounded-xl">{error}</div>}
      <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2"><label className="block text-xs font-bold text-slate-700 mb-1">Judul</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none" /></div>
          <div><label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label><select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none"><option value="Dakwah">Dakwah</option><option value="Dauroh">Dauroh</option></select></div>
          <div><label className="block text-xs font-bold text-slate-700 mb-1">Penceramah</label><input type="text" value={speaker} onChange={(e) => setSpeaker(e.target.value)} className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none" /></div>
          <div><label className="block text-xs font-bold text-slate-700 mb-1">Label Tanggal</label><input type="text" value={dateLabel} onChange={(e) => setDateLabel(e.target.value)} className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none" /></div>
          <div><label className="block text-xs font-bold text-slate-700 mb-1">Tanggal (opsional)</label><input type="date" value={dateStart} onChange={(e) => setDateStart(e.target.value)} className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none" /></div>
          <div><label className="block text-xs font-bold text-slate-700 mb-1">Label Waktu</label><input type="text" value={timeLabel} onChange={(e) => setTimeLabel(e.target.value)} className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none" /></div>
          <div><label className="block text-xs font-bold text-slate-700 mb-1">Kapasitas</label><input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none" /></div>
          <div className="sm:col-span-2"><label className="block text-xs font-bold text-slate-700 mb-1">Lokasi</label><input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none" /></div>
          <div className="sm:col-span-2"><label className="block text-xs font-bold text-slate-700 mb-1">Image URL</label><input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none" /></div>
          <div className="sm:col-span-2"><label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none" /></div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} className="rounded" /><span className="text-xs font-bold text-slate-700">Recurring</span></label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="rounded" /><span className="text-xs font-bold text-slate-700">Publish</span></label>
          </div>
          {isRecurring && (
            <div className="sm:col-span-2"><label className="block text-xs font-bold text-slate-700 mb-1">Hari</label>
              <select value={recurringDay} onChange={(e) => setRecurringDay(e.target.value)} className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none">
                <option value="">— pilih —</option>
                {['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          )}
        </div>
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button onClick={handleSave} disabled={saving} className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-6 py-2.5 rounded-xl flex items-center gap-1.5">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan</button>
        </div>
      </div>
    </div>
  );
}
