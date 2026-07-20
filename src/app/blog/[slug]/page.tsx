import { getPublicArticleBySlug } from '@/lib/public-api';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Eye, User, ArrowLeft, BookOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublicArticleBySlug(decodeURIComponent(slug));
  if (!article) return { title: 'Artikel Tidak Ditemukan' };
  const APP_URL = process.env.APP_URL || 'https://masjidrayapuritelukjambe.com';
  return {
    title: article.title,
    description: article.excerpt || '',
    openGraph: {
      title: article.title,
      description: article.excerpt || '',
      type: 'article',
      url: `${APP_URL}/blog/${article.slug}`,
      images: article.featured_image_url ? [{ url: article.featured_image_url }] : [],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublicArticleBySlug(decodeURIComponent(slug));
  if (!article) notFound();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-emerald-950 text-white px-4 py-4 sm:py-6">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Link href="/blog" className="flex items-center gap-2">
            <img className="w-10 h-10 shrink-0" src="/images/logo.svg" alt="logo" />
            <div className="min-w-0">
              <p className="font-black text-sm leading-tight">Masjid Raya Puri Telukjambe</p>
              <p className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">Blog</p>
            </div>
          </Link>
          <Link href="/blog" className="inline-flex w-fit items-center gap-1 rounded-lg border border-emerald-800 px-3 py-2 text-[11px] uppercase font-bold text-emerald-300 hover:text-white">
            <ArrowLeft className="w-3.5 h-3.5" /> Semua Artikel
          </Link>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        {article.category && (
          <Link href={`/blog?category=${article.category}`} className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider mb-3 hover:bg-emerald-200">
            {article.category}
          </Link>
        )}
        <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {article.title}
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 mt-4 pb-6 border-b border-slate-200">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(article.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
          {article.author_name && (
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> {article.author_name}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" /> {article.views_count} dibaca
          </span>
        </div>

        {article.featured_image_url && (
          <div className="my-8 rounded-2xl overflow-hidden">
            <img src={article.featured_image_url} alt={article.featured_image_alt || article.title} className="w-full" referrerPolicy="no-referrer" />
          </div>
        )}

        <div
          className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-a:text-emerald-700 prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: article.content_html }}
        />

        {article.tags && article.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-slate-200">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((t: string) => (
                <span key={t} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link href="/blog" className="text-emerald-700 hover:text-emerald-900 font-bold text-sm flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Kembali ke daftar artikel
          </Link>
          <Link href="/" className="text-slate-500 hover:text-emerald-700 font-bold text-sm">
            Beranda Masjid →
          </Link>
        </div>
      </article>
    </div>
  );
}
