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
    const month = searchParams.get('month'); // YYYY-MM
    if (!month) return NextResponse.json({ error: 'month wajib diisi (YYYY-MM)' }, { status: 400 });
    const [y, m] = month.split('-').map(Number);
    const startDate = `${y}-${String(m).padStart(2, '0')}-01`;
    const lastDay = new Date(y, m, 0).getDate();
    const endDate = `${y}-${String(m).padStart(2, '0')}-${lastDay}`;
    const rows = (await (sql as any).query(
      `SELECT * FROM aula_availability WHERE date >= $1 AND date <= $2 ORDER BY date ASC, time_start ASC`,
      [startDate, endDate]
    )) as any[];
    return NextResponse.json({ month, slots: rows });
  } catch (error) {
    return authErrorResponse(error);
  }
}
