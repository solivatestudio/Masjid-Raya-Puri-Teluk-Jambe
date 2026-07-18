'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, CalendarRange, ChevronLeft, ChevronRight } from 'lucide-react';

interface Slot {
  id: string; date: string; time_start: string; time_end: string;
  is_available: boolean; block_reason: string | null; pic_name: string | null;
}

const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

export default function AulaPage() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    const m = String(month).padStart(2, '0');
    const res = await fetch(`/api/admin/aula/calendar?month=${year}-${m}`, { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      setSlots(data.slots || []);
    }
    setLoading(false);
  };
  useEffect(() => { load(); }, [month, year]);

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus slot ketersediaan ini?')) return;
    await fetch(`/api/admin/aula/${id}`, { method: 'DELETE', credentials: 'include' });
    load();
  };

  const slotsByDate = slots.reduce<Record<string, Slot[]>>((acc, s) => {
    (acc[s.date] = acc[s.date] || []).push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Ketersediaan Aula</h1>
          <p className="text-sm text-slate-500">Atur slot waktu yang bisa/tidak bisa dibooking</p>
        </div>
        <button onClick={() => setShowForm(true)} className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Tambah Slot
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => { if (month === 1) { setMonth(12); setYear(year - 1); } else { setMonth(month - 1); } }} className="p-2 hover:bg-slate-100 rounded-lg"><ChevronLeft className="w-5 h-5" /></button>
          <h2 className="text-lg font-bold text-slate-800">{monthNames[month - 1]} {year}</h2>
          <button onClick={() => { if (month === 12) { setMonth(1); setYear(year + 1); } else { setMonth(month + 1); } }} className="p-2 hover:bg-slate-100 rounded-lg"><ChevronRight className="w-5 h-5" /></button>
        </div>

        {loading ? (
          <p className="text-center text-slate-500 py-8">Memuat...</p>
        ) : slots.length === 0 ? (
          <p className="text-center text-slate-500 py-8">Belum ada slot ketersediaan di bulan ini.</p>
        ) : (
          <div className="space-y-3">
            {Object.entries(slotsByDate).sort().map(([date, items]) => (
              <div key={date} className="border border-slate-200 rounded-xl p-3">
                <div className="font-bold text-sm text-slate-800 mb-2">{new Date(date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
                <div className="space-y-1.5">
                  {items.map((s) => (
                    <div key={s.id} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2 text-xs">
                      <div>
                        <span className="font-mono font-bold">{s.time_start} - {s.time_end}</span>
                        <span className={`ml-2 px-2 py-0.5 rounded text-[10px] font-bold ${s.is_available ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {s.is_available ? 'TERSEDIA' : 'BLOCKED'}
                        </span>
                        {s.block_reason && <span className="ml-2 text-slate-500">â€” {s.block_reason}</span>}
                      </div>
                      <button onClick={() => handleDelete(s.id)} className="p-1 hover:bg-rose-100 text-rose-600 rounded transition">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && <AulaFormModal onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); load(); }} />}
    </div>
  );
}

function AulaFormModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [date, setDate] = useState('');
  const [timeStart, setTimeStart] = useState('08:00');
  const [timeEnd, setTimeEnd] = useState('14:00');
  const [isAvailable, setIsAvailable] = useState(true);
  const [blockReason, setBlockReason] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!date || !timeStart || !timeEnd) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/aula', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ date, time_start: timeStart, time_end: timeEnd, is_available: isAvailable, block_reason: blockReason || null }),
      });
      if (res.ok) onSaved();
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Tambah Slot Ketersediaan</h3>
        <div className="space-y-3">
          <div><label className="block text-xs font-bold text-slate-700 mb-1">Tanggal</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm" /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="block text-xs font-bold text-slate-700 mb-1">Jam Mulai</label><input type="time" value={timeStart} onChange={(e) => setTimeStart(e.target.value)} className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm" /></div>
            <div><label className="block text-xs font-bold text-slate-700 mb-1">Jam Selesai</label><input type="time" value={timeEnd} onChange={(e) => setTimeEnd(e.target.value)} className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm" /></div>
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} /><span className="text-xs font-bold text-slate-700">Tersedia untuk dibooking</span></label>
          {!isAvailable && <div><label className="block text-xs font-bold text-slate-700 mb-1">Alasan Block</label><input type="text" value={blockReason} onChange={(e) => setBlockReason(e.target.value)} placeholder="Shalat Jumat, Maintenance, dll" className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm" /></div>}
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl">Batal</button>
          <button onClick={handleSave} disabled={saving} className="bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold px-4 py-2 rounded-xl">{saving ? 'Simpan...' : 'Simpan'}</button>
        </div>
      </div>
    </div>
  );
}
