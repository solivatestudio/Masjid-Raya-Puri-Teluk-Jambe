import { getPublicArticles } from '@/lib/public-api';
import Link from 'next/link';
import { ArrowRight, Calendar, Eye, BookOpen, ArrowLeft, Search } from 'lucide-react';

export const revalidate = 30;

export default async function BlogListPage({ searchParams }: { searchParams: { page?: string; category?: string; search?: string } }) {
  const page = parseInt(searchParams.page || '1');
  const category = searchParams.category || 'Semua';
  const search = searchParams.search || '';

  let data;
  try {
    data = await getPublicArticles({ category, search, page });
  } catch {
    data = { articles: [], total: 0, page: 1, limit: 12 };
  }

  const { articles, total } = data;
  const totalPages = Math.max(1, Math.ceil(total / 12));

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-emerald-950 text-white py-6 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img className="w-10" src="/images/logo.svg" alt="logo" />
            <div>
              <p className="font-black text-xs">Masjid Raya Puri Telukjambe</p>
              <p className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">Blog & Artikel</p>
            </div>
          </Link>
          <Link href="/" className="text-xs uppercase font-bold text-emerald-300 hover:text-white"><ArrowLeft className="w-4 h-4 inline mr-1" /> Kembali ke Beranda</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5" /> Blog DKM
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Artikel & Berita Terbaru</h1>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
            Kumpulan tulisan dakwah, berita kegiatan, dan opini dari DKM Masjid Raya Puri Telukjambe.
          </p>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {['Semua', 'Berita', 'Dakwah', 'Opini', 'Lainnya'].map((c) => (
            <Link
              key={c}
              href={`/blog${c === 'Semua' ? '' : `?category=${c}`}`}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                category === c
                  ? 'bg-emerald-700 text-white shadow'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-500'
              }`}
            >
              {c}
            </Link>
          ))}
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <div className="flex justify-center mb-3"><Search className="w-12 h-12 text-slate-300" /></div>
            <p className="text-slate-500">Belum ada artikel di kategori ini.</p>
            <Link href="/blog" className="text-emerald-700 font-bold mt-2 inline-block hover:underline">Lihat semua artikel</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a: any) => (
              <Link
                key={a.id}
                href={`/blog/${a.slug}`}
                className="bg-white rounded-3xl overflow-hidden border border-slate-100 card-shadow hover:-translate-y-1 transition group flex flex-col"
              >
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  {a.featured_image_url ? (
                    <img src={a.featured_image_url} alt={a.featured_image_alt || a.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <BookOpen className="w-12 h-12" />
                    </div>
                  )}
                  {a.category && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-700 text-white">
                      {a.category}
                    </span>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition line-clamp-2">{a.title}</h3>
                  {a.excerpt && <p className="text-slate-600 text-xs mt-2 line-clamp-2">{a.excerpt}</p>}
                  <div className="mt-auto pt-4 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(a.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {a.views_count}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/blog?page=${p}${category !== 'Semua' ? `&category=${category}` : ''}`}
                className={`w-10 h-10 rounded-xl text-sm font-bold flex items-center justify-center transition ${
                  p === page ? 'bg-emerald-700 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:border-emerald-500'
                }`}
              >
                {p}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900 font-bold text-sm">
            <ArrowLeft className="w-4 h-4 inline mr-1" /> Kembali ke Beranda
          </Link>
        </div>
      </main>
    </div>
  );
}
