import { NextRequest, NextResponse } from 'next/server';
import { getSql, ensureSeeded } from '@/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(_req: NextRequest) {
  try {
    await ensureSeeded();
    const sql = getSql();
    const rows = (await (sql as any).query(`
      SELECT
        TO_CHAR(date, 'YYYY-MM') as month,
        COALESCE(SUM(CASE WHEN type = 'Pemasukan' THEN amount ELSE 0 END), 0) as pemasukan,
        COALESCE(SUM(CASE WHEN type = 'Pengeluaran' THEN amount ELSE 0 END), 0) as pengeluaran
      FROM transactions
      WHERE date >= (CURRENT_DATE - INTERVAL '6 months')
      GROUP BY TO_CHAR(date, 'YYYY-MM')
      ORDER BY month ASC
    `)) as any[];
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
