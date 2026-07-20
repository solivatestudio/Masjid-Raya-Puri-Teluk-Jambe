import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSql, ensureSeeded } from '@/db';
import { requireCmsAuth, authErrorResponse } from '@/lib/rbac';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireCmsAuth();
    await ensureSeeded();
    const sql = getSql();
    const { id } = await params;
    const rows = (await (sql as any).query(`DELETE FROM transactions WHERE id = $1 RETURNING *`, [id])) as any[];
    if (!rows[0]) return NextResponse.json({ error: 'Transaksi tidak ditemukan' }, { status: 404 });
    revalidatePath('/', 'page');
    return NextResponse.json({ message: 'Transaksi berhasil dihapus' });
  } catch (error) {
    return authErrorResponse(error);
  }
}
