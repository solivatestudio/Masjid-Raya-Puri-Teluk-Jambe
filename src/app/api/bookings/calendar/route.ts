import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function withTimeout<T>(promise: Promise<T>, ms = 8000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Database timeout')), ms)),
  ]);
}

export async function GET(_req: NextRequest) {
  try {
    const sql = getSql();
    const rows = (await withTimeout((sql as any).query(
      `SELECT DISTINCT date
       FROM (
         SELECT date FROM bookings WHERE status = 'approved'
         UNION
         SELECT date FROM aula_availability WHERE is_available = false
       ) unavailable_dates
       ORDER BY date ASC`
    ))) as any[];
    const dates = rows.map((r: any) => {
      if (r.date instanceof Date) return r.date.toISOString().slice(0, 10);
      return String(r.date).slice(0, 10);
    });
    return NextResponse.json(dates, {
      headers: { 'Cache-Control': 'no-store, max-age=0, must-revalidate' },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
