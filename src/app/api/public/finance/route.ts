import { NextResponse } from 'next/server';
import { getSql } from '@/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function toNumber(value: unknown): number {
  return Number(value || 0);
}

function withTimeout<T>(promise: Promise<T>, ms = 8000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Database timeout')), ms)),
  ]);
}

export async function GET() {
  try {
    const sql = getSql();

    const [summaryRows, latestRows, categoryRows, monthlyRows] = await withTimeout(Promise.all([
      (sql as any).query(`
        SELECT
          COALESCE(SUM(CASE WHEN type = 'Pemasukan' THEN amount ELSE 0 END), 0) AS total_pemasukan,
          COALESCE(SUM(CASE WHEN type = 'Pengeluaran' THEN amount ELSE 0 END), 0) AS total_pengeluaran,
          MAX(updated_at) AS updated_at
        FROM transactions
      `, []),
      (sql as any).query(`
        SELECT date, description, type, category, amount
        FROM transactions
        ORDER BY date DESC, created_at DESC
        LIMIT 8
      `, []),
      (sql as any).query(`
        SELECT category, type, COALESCE(SUM(amount), 0) AS total
        FROM transactions
        GROUP BY category, type
        ORDER BY total DESC
        LIMIT 8
      `, []),
      (sql as any).query(`
        SELECT
          TO_CHAR(date, 'YYYY-MM') AS month,
          COALESCE(SUM(CASE WHEN type = 'Pemasukan' THEN amount ELSE 0 END), 0) AS pemasukan,
          COALESCE(SUM(CASE WHEN type = 'Pengeluaran' THEN amount ELSE 0 END), 0) AS pengeluaran
        FROM transactions
        WHERE date >= (CURRENT_DATE - INTERVAL '6 months')
        GROUP BY TO_CHAR(date, 'YYYY-MM')
        ORDER BY month ASC
      `, []),
    ]) as Promise<any[]>);

    const summary = summaryRows[0] || {};
    const totalPemasukan = toNumber(summary.total_pemasukan);
    const totalPengeluaran = toNumber(summary.total_pengeluaran);

    return NextResponse.json({
      summary: {
        saldo: totalPemasukan - totalPengeluaran,
        totalPemasukan,
        totalPengeluaran,
        updatedAt: summary.updated_at || null,
      },
      latest: latestRows.map((row: any) => ({
        ...row,
        date: row.date instanceof Date ? row.date.toISOString().slice(0, 10) : String(row.date).slice(0, 10),
        amount: toNumber(row.amount),
      })),
      categories: categoryRows.map((row: any) => ({ ...row, total: toNumber(row.total) })),
      monthly: monthlyRows.map((row: any) => ({
        month: row.month,
        pemasukan: toNumber(row.pemasukan),
        pengeluaran: toNumber(row.pengeluaran),
      })),
    }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch {
    return NextResponse.json({ error: 'Gagal memuat transparansi keuangan' }, { status: 500 });
  }
}
