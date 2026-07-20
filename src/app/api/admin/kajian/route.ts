import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSql, ensureSeeded } from '@/db';
import { requireCmsAuth, authErrorResponse } from '@/lib/rbac';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    await requireCmsAuth();
    await ensureSeeded();
    const sql = getSql();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const rows = (await (sql as any).query(
      `SELECT k.*, u.name as pic_name FROM kajian k LEFT JOIN users u ON u.id = k.pic_id
       WHERE $1 = '' OR k.title ILIKE '%' || $1 || '%' OR k.speaker ILIKE '%' || $1 || '%'
       ORDER BY k.date_start DESC NULLS LAST, k.created_at DESC`,
      [search]
    )) as any[];
    return NextResponse.json(rows);
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireCmsAuth();
    const sql = getSql();
    const body = await req.json();
    const { title, category, date_label, date_start, time_label, speaker, location, description, image_url, capacity, is_recurring, recurring_day, is_published } = body;
    if (!title || !category || !date_label || !time_label) {
      return NextResponse.json({ error: 'title, category, date_label, time_label wajib diisi' }, { status: 400 });
    }
    if (!['Dakwah', 'Dauroh'].includes(category)) {
      return NextResponse.json({ error: 'Category harus Dakwah atau Dauroh' }, { status: 400 });
    }
    const rows = (await (sql as any).query(
      `INSERT INTO kajian (title, category, date_label, date_start, time_label, speaker, location, description, image_url, capacity, is_recurring, recurring_day, is_published)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [title, category, date_label, date_start || null, time_label, speaker || null, location || 'Ruang Utama Masjid Raya Puri Telukjambe', description || null, image_url || null, capacity || null, !!is_recurring, recurring_day || null, is_published !== false]
    )) as any[];
    revalidatePath('/', 'page');
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    return authErrorResponse(error);
  }
}
