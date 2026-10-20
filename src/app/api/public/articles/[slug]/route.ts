import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const sql = getSql();
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const rows = (await (sql as any).query(
      `SELECT a.id, a.slug, a.title, a.excerpt, a.content_html, a.featured_image_url, a.featured_image_alt, a.category, a.tags, a.published_at, a.views_count, u.name as author_name
       FROM articles a LEFT JOIN users u ON u.id = a.author_id
       WHERE a.slug = $1 AND a.status = 'published'`,
      [decodedSlug]
    )) as any[];
    if (!rows[0]) return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 });

    try {
      await (sql as any).query(`UPDATE articles SET views_count = views_count + 1 WHERE id = $1`, [rows[0].id]);
    } catch {
      // View counting must never break public article reads.
    }

    return NextResponse.json(rows[0], {
      headers: { 'Cache-Control': 'no-store, max-age=0, must-revalidate' },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
