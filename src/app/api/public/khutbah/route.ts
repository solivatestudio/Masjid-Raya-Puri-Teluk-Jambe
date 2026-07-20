import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/db';
import { getPublicKhutbahSchedule } from '@/lib/khutbah';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const sql = getSql();
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '4'), 20);
    const rows = await getPublicKhutbahSchedule(sql, limit);
    return NextResponse.json(rows, {
      headers: { 'Cache-Control': 'no-store, max-age=0, must-revalidate' },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
