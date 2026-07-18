import { NextRequest, NextResponse } from 'next/server';
import { getSql, ensureSeeded } from '@/db';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Tidak diotorisasi' }, { status: 401 });
  }
  try {
    await ensureSeeded();
    const sql = getSql();
    const { id } = await params;
    const { status, adminNotes } = await req.json();
    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Status harus approved atau rejected' }, { status: 400 });
    }
    const rows = (await (sql as any).query(
      `UPDATE bookings SET status = $1, admin_notes = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
      [status, adminNotes || '', id]
    )) as any[];
    if (!rows[0]) {
      return NextResponse.json({ error: 'Booking tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
