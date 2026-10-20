import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSql } from '@/db';
import { requireCmsAuth, authErrorResponse } from '@/lib/rbac';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    await requireCmsAuth();
    const sql = getSql();
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'id wajib diisi' }, { status: 400 });
    const rows = (await (sql as any).query(
      `UPDATE articles SET status = 'published', published_at = NOW(), updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id]
    )) as any[];
    if (!rows[0]) return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 });
    revalidatePath('/blog', 'page');
    revalidatePath(`/blog/${rows[0].slug}`, 'page');
    return NextResponse.json(rows[0]);
  } catch (error) {
    return authErrorResponse(error);
  }
}
