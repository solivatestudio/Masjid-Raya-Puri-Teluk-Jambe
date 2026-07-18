'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import DataTable from '@/components/cms/DataTable';
import StatusBadge from '@/components/cms/StatusBadge';

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  status: string;
  category: string | null;
  featured_image_url: string | null;
  published_at: string | null;
  updated_at: string;
  views_count: number;
  author_name: string | null;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/articles', { credentials: 'include' });
      if (res.ok) setArticles(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus artikel "${title}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    const res = await fetch(`/api/admin/articles/${id}`, { method: 'DELETE', credentials: 'include' });
    if (res.ok) fetchData();
    else alert('Gagal menghapus');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Artikel Blog</h1>
          <p className="text-sm text-slate-500">Kelola artikel & berita untuk website masjid</p>
        </div>
        <Link href="/dashboard/articles/new" className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Tulis Artikel
        </Link>
      </div>

      <DataTable<Article>
        data={articles}
        loading={loading}
        searchPlaceholder="Cari judul artikel..."
        searchKeys={['title', 'excerpt']}
        emptyMessage="Belum ada artikel"
        pageSize={15}
        rowKey={(a) => a.id}
        columns={[
          { key: 'title', header: 'Judul', render: (a) => (
            <div>
              <div className="font-bold text-slate-900 line-clamp-1">{a.title}</div>
              {a.excerpt && <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">{a.excerpt}</div>}
            </div>
          )},
          { key: 'category', header: 'Kategori', className: 'w-28', render: (a) => a.category ? <span className="text-xs">{a.category}</span> : <span className="text-xs text-slate-400">â€”</span> },
          { key: 'status', header: 'Status', className: 'w-28', render: (a) => <StatusBadge status={a.status} /> },
          { key: 'views', header: 'Views', className: 'w-20 text-right', render: (a) => <span className="text-xs text-slate-500">{a.views_count}</span> },
          { key: 'updated', header: 'Update', className: 'w-32', render: (a) => <span className="text-xs text-slate-500">{new Date(a.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span> },
          { key: 'actions', header: 'Aksi', className: 'w-28 text-right', render: (a) => (
            <div className="flex items-center justify-end gap-1">
              <Link href={`/dashboard/articles/${a.id}`} className="p-1.5 hover:bg-emerald-100 text-emerald-700 rounded-lg transition" title="Edit">
                <Edit className="w-4 h-4" />
              </Link>
              <button onClick={() => handleDelete(a.id, a.title)} className="p-1.5 hover:bg-rose-100 text-rose-600 rounded-lg transition" title="Hapus">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )},
        ]}
      />
    </div>
  );
}
