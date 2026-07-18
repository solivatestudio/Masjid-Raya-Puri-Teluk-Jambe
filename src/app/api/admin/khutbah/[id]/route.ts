import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/db';
import { requireCmsAuth, authErrorResponse } from '@/lib/rbac';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireCmsAuth();
    const sql = getSql();
    const { id } = await params;
    const rows = (await (sql as any).query(`SELECT * FROM khutbah_schedule WHERE id = $1`, [id])) as any[];
    if (!rows[0]) return NextResponse.json({ error: 'Khutbah tidak ditemukan' }, { status: 404 });
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
    const fields = ['schedule_date', 'khatib', 'muadzin', 'theme', 'notes'];
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
      `UPDATE khutbah_schedule SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    )) as any[];
    if (!rows[0]) return NextResponse.json({ error: 'Khutbah tidak ditemukan' }, { status: 404 });
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
    const rows = (await (sql as any).query(`DELETE FROM khutbah_schedule WHERE id = $1 RETURNING id`, [id])) as any[];
    if (!rows[0]) return NextResponse.json({ error: 'Khutbah tidak ditemukan' }, { status: 404 });
    return NextResponse.json({ message: 'Jadwal khutbah berhasil dihapus' });
  } catch (error) {
    return authErrorResponse(error);
  }
}
