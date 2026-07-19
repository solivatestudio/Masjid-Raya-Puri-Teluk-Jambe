import { NextRequest, NextResponse } from 'next/server';
import { getSql, ensureSeeded } from '@/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
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
    return NextResponse.json({ error: error.message }, { status: 500 });
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

    const rows = (await (sql as any).query(
      `INSERT INTO bookings (name, whatsapp, date, time_start, time_end, purpose, package_id, need_organizer, notes, payment_proof_url, payment_proof_uploaded_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [name, whatsapp, date, timeStart, timeEnd, purpose, packageId || null, needOrganizer || false, notes || '', payment_proof_url || null, payment_proof_url ? new Date().toISOString() : null]
    )) as any[];

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}