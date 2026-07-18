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
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 200);
    const rows = (await (sql as any).query(
      `SELECT k.*, u.name as pic_name FROM khutbah_schedule k LEFT JOIN users u ON u.id = k.pic_id
       ORDER BY k.schedule_date DESC LIMIT $1`,
      [limit]
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
    const { schedule_date, khatib, muadzin, theme, notes } = body;
    if (!schedule_date || !khatib) {
      return NextResponse.json({ error: 'schedule_date dan khatib wajib diisi' }, { status: 400 });
    }
    const exists = (await (sql as any).query(`SELECT id FROM khutbah_schedule WHERE schedule_date = $1`, [schedule_date])) as any[];
    if (exists[0]) {
      return NextResponse.json({ error: 'Jadwal untuk tanggal ini sudah ada' }, { status: 409 });
    }
    const rows = (await (sql as any).query(
      `INSERT INTO khutbah_schedule (schedule_date, khatib, muadzin, theme, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [schedule_date, khatib, muadzin || null, theme || null, notes || null]
    )) as any[];
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    return authErrorResponse(error);
  }
}
