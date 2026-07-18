import { NextRequest, NextResponse } from 'next/server';
import { getSql, ensureSeeded } from '@/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(_req: NextRequest) {
  try {
    await ensureSeeded();
    const sql = getSql();
    const rows = (await (sql as any).query(
      `SELECT DISTINCT date FROM bookings WHERE status = 'approved' ORDER BY date ASC`
    )) as any[];
    return NextResponse.json(rows.map((r: any) => r.date));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
