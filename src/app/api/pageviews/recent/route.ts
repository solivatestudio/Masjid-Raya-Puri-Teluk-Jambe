import { NextRequest, NextResponse } from 'next/server';
import { getSql, ensureSeeded } from '@/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(_req: NextRequest) {
  try {
    await ensureSeeded();
    const sql = getSql();
    const rows = (await (sql as any).query(
      `SELECT id, path, referrer, user_agent as "userAgent", timestamp FROM pageviews ORDER BY timestamp DESC LIMIT 30`
    )) as any[];
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
