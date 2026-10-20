import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import sanitizeHtml from 'sanitize-html';
import { getSql } from '@/db';
import { requireCmsAuth, authErrorResponse } from '@/lib/rbac';
import { SANITIZE_CONFIG } from '@/lib/tiptap';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireCmsAuth();
    const sql = getSql();
    const { id } = await params;
    const rows = (await (sql as any).query(
      `SELECT a.*, u.name as author_name FROM articles a LEFT JOIN users u ON u.id = a.author_id WHERE a.id = $1`,
      [id]
    )) as any[];
    if (!rows[0]) return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireCmsAuth();
    const sql = getSql();
    const { id } = await params;
    const body = await req.json();
    const fields = ['slug', 'title', 'excerpt', 'content_html', 'featured_image_url', 'featured_image_alt', 'category', 'tags', 'status', 'scheduled_at'];
    const updates: string[] = [];
    const values: any[] = [];
    let idx = 1;

    for (const field of fields) {
      if (body[field] !== undefined) {
        updates.push(`${field} = $${idx++}`);
        values.push(field === 'content_html' ? sanitizeHtml(body[field] || '', SANITIZE_CONFIG) : body[field]);
      }
    }
    if (body.content_json !== undefined) {
      updates.push(`content_json = $${idx++}`);
      values.push(JSON.stringify(body.content_json));
    }
    if (body.status === 'published') {
      updates.push(`published_at = COALESCE(published_at, NOW())`);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'Tidak ada field untuk diupdate' }, { status: 400 });
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const rows = (await (sql as any).query(
      `UPDATE articles SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    )) as any[];
    if (!rows[0]) return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 });
    revalidatePath('/blog', 'page');
    revalidatePath(`/blog/${rows[0].slug}`, 'page');
    return NextResponse.json(rows[0]);
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireCmsAuth();
    const sql = getSql();
    const { id } = await params;
    const rows = (await (sql as any).query(`DELETE FROM articles WHERE id = $1 RETURNING id, slug`, [id])) as any[];
    if (!rows[0]) return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 });
    revalidatePath('/blog', 'page');
    revalidatePath(`/blog/${rows[0].slug}`, 'page');
    return NextResponse.json({ message: 'Artikel berhasil dihapus' });
  } catch (error) {
    return authErrorResponse(error);
  }
}

