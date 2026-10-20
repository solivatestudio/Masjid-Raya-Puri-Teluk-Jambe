import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSql } from '@/db';
import { requireCmsAuth, authErrorResponse } from '@/lib/rbac';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireCmsAuth();
    const sql = getSql();
    const { id } = await params;
    const body = await req.json();
    const fields = ['date', 'time_start', 'time_end', 'is_available', 'block_reason'];
    const updates: string[] = [];
    const values: any[] = [];
    let idx = 1;
    for (const f of fields) {
      if (body[f] !== undefined) {
        updates.push(`${f} = $${idx++}`);
        values.push(body[f]);
      }
    }
    if (updates.length === 0) return NextResponse.json({ error: 'Tidak ada field untuk diupdate' }, { status: 400 });
    updates.push(`updated_at = NOW()`);
    values.push(id);
    const rows = (await (sql as any).query(
      `UPDATE aula_availability SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    )) as any[];
    if (!rows[0]) return NextResponse.json({ error: 'Slot tidak ditemukan' }, { status: 404 });
    revalidatePath('/', 'page');
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
    const rows = (await (sql as any).query(`DELETE FROM aula_availability WHERE id = $1 RETURNING id`, [id])) as any[];
    if (!rows[0]) return NextResponse.json({ error: 'Slot tidak ditemukan' }, { status: 404 });
    revalidatePath('/', 'page');
    return NextResponse.json({ message: 'Slot berhasil dihapus' });
  } catch (error) {
    return authErrorResponse(error);
  }
}
