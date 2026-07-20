import { NextRequest, NextResponse } from 'next/server';
import { getSql, ensureSeeded } from '@/db';
import { requireCmsAuth, authErrorResponse } from '@/lib/rbac';
import sanitizeHtml from 'sanitize-html';
import { revalidatePath } from 'next/cache';
import { SANITIZE_CONFIG } from '@/lib/tiptap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    await requireCmsAuth();
    await ensureSeeded();
    const sql = getSql();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search') || '';
    const conditions: string[] = [];
    const params: any[] = [];
    let idx = 1;

    if (status) {
      conditions.push(`a.status = $${idx++}`);
      params.push(status);
    }
    if (search) {
      conditions.push(`(a.title ILIKE '%' || $${idx++} || '%' OR a.excerpt ILIKE '%' || $${idx++} || '%')`);
      params.push(search, search);
    }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const rows = (await (sql as any).query(
      `SELECT a.id, a.slug, a.title, a.excerpt, a.status, a.category, a.featured_image_url, a.published_at, a.created_at, a.updated_at, a.views_count, u.name as author_name
       FROM articles a
       LEFT JOIN users u ON u.id = a.author_id
       ${where}
       ORDER BY a.updated_at DESC`,
      params
    )) as any[];
    return NextResponse.json(rows);
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireCmsAuth();
    const sql = getSql();
    const body = await req.json();
    const { slug, title, excerpt, content_html, content_json, featured_image_url, featured_image_alt, category, tags, status, scheduled_at } = body;
    if (!slug || !title) {
      return NextResponse.json({ error: 'Slug dan title wajib diisi' }, { status: 400 });
    }
    const exists = (await (sql as any).query(`SELECT id FROM articles WHERE slug = $1`, [slug])) as any[];
    if (exists[0]) {
      return NextResponse.json({ error: 'Slug sudah dipakai' }, { status: 409 });
    }
    const validStatus = ['draft', 'published', 'scheduled'].includes(status) ? status : 'draft';
    const safeContentHtml = sanitizeHtml(content_html || '', SANITIZE_CONFIG);
    const published_at = validStatus === 'published' ? new Date().toISOString() : null;

    const rows = (await (sql as any).query(
      `INSERT INTO articles (slug, title, excerpt, content_html, content_json, featured_image_url, featured_image_alt, author_id, category, tags, status, scheduled_at, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [slug, title, excerpt || null, safeContentHtml, content_json ? JSON.stringify(content_json) : null, featured_image_url || null, featured_image_alt || null, session.userId, category || null, tags || null, validStatus, scheduled_at || null, published_at]
    )) as any[];
    revalidatePath('/blog', 'page');
    revalidatePath(`/blog/${slug}`, 'page');
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    return authErrorResponse(error);
  }
}



