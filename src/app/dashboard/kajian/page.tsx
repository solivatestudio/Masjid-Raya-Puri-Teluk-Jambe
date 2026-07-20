'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import { revalidateCMS } from '@/lib/revalidate';
import DataTable from '@/components/cms/DataTable';

interface Kajian {
  id: string; title: string; category: string; date_label: string;
  date_start: string | null; time_label: string; speaker: string | null;
  registered_count: number; capacity: number | null; is_recurring: boolean;
  is_published: boolean; pic_name: string | null;
}

export default function KajianPage() {
  const [items, setItems] = useState<Kajian[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const res = await fetch('/api/admin/kajian', { credentials: 'include', cache: 'no-store' });
    if (res.ok) setItems(await res.json());
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus kajian "${title}"?`)) return;
    await fetch(`/api/admin/kajian/${id}`, { method: 'DELETE', credentials: 'include', cache: 'no-store' });
    await load();
    await revalidateCMS();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Kajian & Dauroh</h1>
          <p className="text-sm text-slate-500">Kelola jadwal kajian rutin dan kegiatan dauroh</p>
        </div>
        <Link href="/dashboard/kajian/new" className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Tambah Kajian
        </Link>
      </div>

      <DataTable<Kajian>
        data={items}
        loading={loading}
        searchPlaceholder="Cari judul / penceramah..."
        searchKeys={['title', 'speaker']}
        emptyMessage="Belum ada kajian"
        rowKey={(k) => k.id}
        columns={[
          { key: 'title', header: 'Judul', render: (k) => (
            <div>
              <div className="font-bold text-slate-900 line-clamp-1">{k.title}</div>
              <div className="text-xs text-slate-500">{k.speaker || '—'}</div>
            </div>
          )},
          { key: 'category', header: 'Kategori', className: 'w-24', render: (k) => <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${k.category === 'Dakwah' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{k.category}</span> },
          { key: 'date', header: 'Tanggal', className: 'w-32', render: (k) => <span className="text-xs">{k.date_label}</span> },
          { key: 'time', header: 'Waktu', className: 'w-32', render: (k) => <span className="text-xs text-slate-600">{k.time_label}</span> },
          { key: 'pic', header: 'PIC', className: 'w-24', render: (k) => <span className="text-xs">{k.pic_name || '—'}</span> },
          { key: 'actions', header: '', className: 'w-24 text-right', render: (k) => (
            <div className="flex items-center justify-end gap-1">
              <Link href={`/dashboard/kajian/${k.id}`} className="p-1.5 hover:bg-emerald-100 text-emerald-700 rounded-lg transition"><Edit className="w-4 h-4" /></Link>
              <button onClick={() => handleDelete(k.id, k.title)} className="p-1.5 hover:bg-rose-100 text-rose-600 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
            </div>
          )},
        ]}
      />
    </div>
  );
}
