import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const sql = getSql();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const conditions = ['is_published = TRUE'];
    const params: any[] = [];
    let idx = 1;
    if (category && category !== 'Semua') {
      conditions.push(`category = $${idx++}`);
      params.push(category);
    }
    const where = `WHERE ${conditions.join(' AND ')}`;
    const rows = (await (sql as any).query(
      `SELECT id, title, category, date_label, date_start, time_label, speaker, location, description, image_url, capacity, registered_count, is_recurring
       FROM kajian ${where}
       ORDER BY date_start DESC NULLS LAST, created_at DESC
       LIMIT 50`,
      params
    )) as any[];
    return NextResponse.json(rows, {
      headers: { 'Cache-Control': 'no-store, max-age=0, must-revalidate' },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
