import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSql } from '@/db';
import { requireCmsAuth, authErrorResponse } from '@/lib/rbac';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireCmsAuth();
    const sql = getSql();
    const { id } = await params;
    const body = await req.json();
    const { status, adminNotes } = body;
    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Status harus approved atau rejected' }, { status: 400 });
    }
    const rows = (await (sql as any).query(
      `UPDATE bookings SET status = $1, admin_notes = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
      [status, adminNotes || '', id]
    )) as any[];
    const row = rows[0];
    if (!row) return NextResponse.json({ error: 'Booking tidak ditemukan' }, { status: 404 });
    revalidatePath('/', 'page');
    return NextResponse.json(row);
  } catch (error) {
    return authErrorResponse(error);
  }
}
