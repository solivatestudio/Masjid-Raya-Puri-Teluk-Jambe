import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const sql = getSql();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search') || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 50);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const offset = (page - 1) * limit;
    const conditions = ["a.status = 'published'"];
    const params: any[] = [];
    let idx = 1;
    if (category && category !== 'Semua') {
      conditions.push(`a.category = $${idx++}`);
      params.push(category);
    }
    if (search) {
      conditions.push(`(a.title ILIKE '%' || $${idx++} || '%' OR a.excerpt ILIKE '%' || $${idx++} || '%')`);
      params.push(search, search);
    }
    const where = `WHERE ${conditions.join(' AND ')}`;
    const rows = (await (sql as any).query(
      `SELECT a.id, a.slug, a.title, a.excerpt, a.featured_image_url, a.featured_image_alt, a.category, a.tags, a.published_at, a.views_count, u.name as author_name
       FROM articles a LEFT JOIN users u ON u.id = a.author_id
       ${where}
       ORDER BY a.published_at DESC
       LIMIT $${idx++} OFFSET $${idx++}`,
      [...params, limit, offset]
    )) as any[];
    const countRows = (await (sql as any).query(`SELECT COUNT(*)::int as c FROM articles a ${where}`, params)) as any[];
    return NextResponse.json(
      { articles: rows, total: countRows[0]?.c || 0, page, limit },
      { headers: { 'Cache-Control': 'no-store, max-age=0, must-revalidate' } }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
