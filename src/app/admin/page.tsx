'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import SummaryCard from '@/components/dashboard/SummaryCard';
import { FileText, BookOpen, CalendarDays, CalendarRange, Eye, Clock, ArrowRight } from 'lucide-react';

interface CmsStats {
  articles: { total: number; published: number; drafts: number; scheduled: number };
  kajian: { total: number; published: number };
  khutbah: { total: number; upcoming: number };
  aula: { total: number; blocked: number };
  pic: { total: number; admins: number; editors: number };
  recent_articles: Array<{ id: string; title: string; status: string; updated_at: string }>;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<CmsStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><p className="text-slate-500">Memuat...</p></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">CMS Overview</h1>
        <p className="text-sm text-slate-500">Kelola konten website masjid dari satu tempat</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Artikel"
          value={String(stats?.articles.total ?? 0)}
          subtitle={`${stats?.articles.published ?? 0} published · ${stats?.articles.drafts ?? 0} draft`}
          icon={<FileText className="w-5 h-5" />}
        />
        <SummaryCard
          title="Kajian Aktif"
          value={String(stats?.kajian.published ?? 0)}
          subtitle={`${stats?.kajian.total ?? 0} total di sistem`}
          icon={<BookOpen className="w-5 h-5" />}
        />
        <SummaryCard
          title="Khutbah Terjadwal"
          value={String(stats?.khutbah.upcoming ?? 0)}
          subtitle={`${stats?.khutbah.total ?? 0} total entry`}
          icon={<CalendarDays className="w-5 h-5" />}
        />
        <SummaryCard
          title="PIC Users"
          value={String(stats?.pic.total ?? 0)}
          subtitle={`${stats?.pic.admins ?? 0} admin · ${stats?.pic.editors ?? 0} editor`}
          icon={<Eye className="w-5 h-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-100 card-shadow p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">Artikel Terbaru</h3>
            <Link href="/admin/cms/articles" className="text-[10px] font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1">
              Kelola <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {stats?.recent_articles.length === 0 ? (
              <p className="text-xs text-slate-400">Belum ada artikel. <Link href="/admin/cms/articles/new" className="text-emerald-600 font-bold">Buat artikel pertama</Link></p>
            ) : (
              stats?.recent_articles.map((a) => (
                <Link key={a.id} href={`/admin/cms/articles/${a.id}`} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 hover:bg-slate-50 rounded-lg px-2 -mx-2">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{a.title}</p>
                    <p className="text-[9px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(a.updated_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${a.status === 'published' ? 'bg-emerald-100 text-emerald-800' : a.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                    {a.status}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 card-shadow p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Aksi Cepat</h3>
          <div className="space-y-3">
            <Link href="/admin/cms/articles/new" className="block w-full text-center bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold py-3 rounded-xl transition">
              + Tulis Artikel Baru
            </Link>
            <Link href="/admin/cms/kajian/new" className="block w-full text-center bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold py-3 rounded-xl transition">
              + Tambah Kajian / Dauroh
            </Link>
            <Link href="/admin/cms/khutbah" className="block w-full text-center bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold py-3 rounded-xl transition">
              📅 Kelola Jadwal Khutbah
            </Link>
            <Link href="/admin/cms/aula" className="block w-full text-center bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold py-3 rounded-xl transition">
              🏛️ Atur Ketersediaan Aula
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
