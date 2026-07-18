import { NextRequest, NextResponse } from 'next/server';
import { getSql, ensureSeeded } from '@/db';
import { requireCmsAuth, authErrorResponse } from '@/lib/rbac';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    await requireCmsAuth();
    await ensureSeeded();
    const sql = getSql();
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const conditions: string[] = [];
    const params: any[] = [];
    let idx = 1;
    if (startDate) {
      conditions.push(`a.date >= $${idx++}`);
      params.push(startDate);
    }
    if (endDate) {
      conditions.push(`a.date <= $${idx++}`);
      params.push(endDate);
    }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const rows = (await (sql as any).query(
      `SELECT a.*, u.name as pic_name FROM aula_availability a LEFT JOIN users u ON u.id = a.pic_id ${where} ORDER BY a.date ASC, a.time_start ASC`,
      params
    )) as any[];
    return NextResponse.json(rows);
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireCmsAuth();
    const sql = getSql();
    const body = await req.json();
    const { date, time_start, time_end, is_available, block_reason } = body;
    if (!date || !time_start || !time_end) {
      return NextResponse.json({ error: 'date, time_start, time_end wajib diisi' }, { status: 400 });
    }
    const rows = (await (sql as any).query(
      `INSERT INTO aula_availability (date, time_start, time_end, is_available, block_reason)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (date, time_start) DO UPDATE SET time_end = $3, is_available = $4, block_reason = $5, updated_at = NOW()
       RETURNING *`,
      [date, time_start, time_end, is_available !== false, block_reason || null]
    )) as any[];
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    return authErrorResponse(error);
  }
}
