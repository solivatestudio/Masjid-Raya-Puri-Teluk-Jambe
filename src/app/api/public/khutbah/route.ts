import { NextRequest, NextResponse } from 'next/server';
import { getSql, ensureSeeded } from '@/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    await ensureSeeded();
    const sql = getSql();
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '4'), 20);
    const rows = (await (sql as any).query(
      `SELECT id, schedule_date, khatib, muadzin, theme FROM khutbah_schedule WHERE schedule_date >= (CURRENT_DATE - INTERVAL '14 days') ORDER BY schedule_date ASC LIMIT $1`,
      [limit]
    )) as any[];
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
