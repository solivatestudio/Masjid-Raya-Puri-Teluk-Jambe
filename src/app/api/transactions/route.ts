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
    return authErrorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireCmsRole('admin');
    const sql = getSql();
    const { date, description, type, category, amount } = await req.json();
    if (!date || !description || !type || !category || !amount) {
      return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 });
    }
    const rows = (await (sql as any).query(
      `INSERT INTO transactions (date, description, type, category, amount) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [date, description, type, category, amount]
    )) as any[];
    revalidatePath('/', 'page');
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error: any) {
    return authErrorResponse(error);
  }
}
