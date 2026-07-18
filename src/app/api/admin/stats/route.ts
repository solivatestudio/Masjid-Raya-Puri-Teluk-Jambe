import { NextResponse } from 'next/server';
import { getSql, ensureSeeded } from '@/db';
import { requireCmsAuth } from '@/lib/rbac';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    await requireCmsAuth();
    await ensureSeeded();
    const sql = getSql();
    const articles = (await (sql as any).query(`
      SELECT
        COUNT(*)::int as total,
        COUNT(*) FILTER (WHERE status = 'published')::int as published,
        COUNT(*) FILTER (WHERE status = 'draft')::int as drafts,
        COUNT(*) FILTER (WHERE status = 'scheduled')::int as scheduled
      FROM articles
    `)) as any[];
    const kajian = (await (sql as any).query(`SELECT COUNT(*)::int as total, COUNT(*) FILTER (WHERE is_published)::int as published FROM kajian`)) as any[];
    const khutbah = (await (sql as any).query(`SELECT COUNT(*)::int as total, COUNT(*) FILTER (WHERE schedule_date >= CURRENT_DATE)::int as upcoming FROM khutbah_schedule`)) as any[];
    const aula = (await (sql as any).query(`SELECT COUNT(*)::int as total, COUNT(*) FILTER (WHERE is_available = false)::int as blocked FROM aula_availability`)) as any[];
    const pic = (await (sql as any).query(`
      SELECT
        COUNT(*)::int as total,
        COUNT(*) FILTER (WHERE role = 'admin')::int as admins,
        COUNT(*) FILTER (WHERE role = 'editor')::int as editors
      FROM users
    `)) as any[];
    const recentArticles = (await (sql as any).query(`
      SELECT id, title, status, updated_at FROM articles ORDER BY updated_at DESC LIMIT 5
    `)) as any[];

    return NextResponse.json({
      articles: articles[0],
      kajian: kajian[0],
      khutbah: khutbah[0],
      aula: aula[0],
      pic: pic[0],
      recent_articles: recentArticles,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 });
  }
}
