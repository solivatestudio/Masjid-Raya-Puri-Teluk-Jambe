import { NextRequest, NextResponse } from 'next/server';
import { getSql, ensureSeeded } from '@/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(_req: NextRequest) {
  try {
    await ensureSeeded();
    const sql = getSql();
    const now = new Date();
    const firstDay = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

    const saldo = (await (sql as any).query(`
      SELECT
        COALESCE(SUM(CASE WHEN type = 'Pemasukan' THEN amount ELSE 0 END), 0) as total_pemasukan,
        COALESCE(SUM(CASE WHEN type = 'Pengeluaran' THEN amount ELSE 0 END), 0) as total_pengeluaran
      FROM transactions
    `)) as any[];

    const monthly = (await (sql as any).query(`
      SELECT
        COALESCE(SUM(CASE WHEN type = 'Pemasukan' THEN amount ELSE 0 END), 0) as pemasukan_bulan_ini,
        COALESCE(SUM(CASE WHEN type = 'Pengeluaran' THEN amount ELSE 0 END), 0) as pengeluaran_bulan_ini
      FROM transactions
      WHERE date >= $1 AND date <= $2
    `, [firstDay, lastDay])) as any[];

    const sr = saldo[0];
    const mr = monthly[0];

    return NextResponse.json({
      saldo: Number(sr.total_pemasukan) - Number(sr.total_pengeluaran),
      totalPemasukan: Number(sr.total_pemasukan),
      totalPengeluaran: Number(sr.total_pengeluaran),
      pemasukanBulanIni: Number(mr.pemasukan_bulan_ini),
      pengeluaranBulanIni: Number(mr.pengeluaran_bulan_ini),
      selisihBulanIni: Number(mr.pemasukan_bulan_ini) - Number(mr.pengeluaran_bulan_ini),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
