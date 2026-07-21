import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSql, ensureSeeded } from '@/db';
import { requireCmsRole, authErrorResponse } from '@/lib/rbac';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    await requireCmsRole('admin');
    await ensureSeeded();
    const sql = getSql();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const rows = (status && status !== 'Semua'
      ? await (sql as any).query(
          `SELECT * FROM bookings WHERE status = $1 ORDER BY CASE WHEN status = 'pending' THEN 0 ELSE 1 END, date ASC, time_start ASC`,
          [status]
        )
      : await (sql as any).query(
          `SELECT * FROM bookings ORDER BY CASE WHEN status = 'pending' THEN 0 ELSE 1 END, date ASC, time_start ASC`
        )) as any[];

    return NextResponse.json(rows);
  } catch (error: any) {
    return authErrorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureSeeded();
    const sql = getSql();
    const { name, whatsapp, date, timeStart, timeEnd, purpose, packageId, needOrganizer, notes, payment_proof_url } =
      await req.json();

    if (!name || !whatsapp || !date || !timeStart || !timeEnd || !purpose) {
      return NextResponse.json(
        { error: 'Field wajib: name, whatsapp, date, timeStart, timeEnd, purpose' },
        { status: 400 }
      );
    }
    const unavailable = (await (sql as any).query(
      `SELECT date FROM (
         SELECT date FROM bookings WHERE status = 'approved' AND date = $1
         UNION
         SELECT date FROM aula_availability WHERE is_available = false AND date = $1
       ) unavailable_dates LIMIT 1`,
      [date]
    )) as any[];
    if (unavailable[0]) {
      return NextResponse.json({ error: 'Tanggal aula tidak tersedia atau sudah dibooking' }, { status: 409 });
    }

    const rows = (await (sql as any).query(
      `INSERT INTO bookings (name, whatsapp, date, time_start, time_end, purpose, package_id, need_organizer, notes, status, payment_proof_url, payment_proof_uploaded_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending', $10, $11) RETURNING *`,
      [name, whatsapp, date, timeStart, timeEnd, purpose, packageId || null, needOrganizer || false, notes || '', payment_proof_url || null, payment_proof_url ? new Date().toISOString() : null]
    )) as any[];

    revalidatePath('/', 'page');
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error: any) {
    return authErrorResponse(error);
  }
}
