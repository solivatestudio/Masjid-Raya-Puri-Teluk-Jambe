import { NextRequest, NextResponse } from 'next/server';
import { getSql, ensureSeeded } from '@/db';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    await ensureSeeded();
    const sql = getSql();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    const conditions: string[] = [];
    const params: any[] = [];
    let idx = 1;

    if (type && type !== 'Semua') {
      conditions.push(`type = $${idx++}`);
      params.push(type);
    }
    if (category) {
      conditions.push(`category = $${idx++}`);
      params.push(category);
    }
    if (startDate) {
      conditions.push(`date >= $${idx++}`);
      params.push(startDate);
    }
    if (endDate) {
      conditions.push(`date <= $${idx++}`);
      params.push(endDate);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    params.push(limit, offset);

    const rows = (await (sql as any).query(
      `SELECT * FROM transactions ${where} ORDER BY date DESC, created_at DESC LIMIT $${idx++} OFFSET $${idx++}`,
      params
    )) as any[];

    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Tidak diotorisasi' }, { status: 401 });
  }
  try {
    await ensureSeeded();
    const sql = getSql();
    const { date, description, type, category, amount } = await req.json();
    if (!date || !description || !type || !category || !amount) {
      return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 });
    }
    const rows = (await (sql as any).query(
      `INSERT INTO transactions (date, description, type, category, amount) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [date, description, type, category, amount]
    )) as any[];
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
