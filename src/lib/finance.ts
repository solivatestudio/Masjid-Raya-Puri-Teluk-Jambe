import { getSql } from '@/db';
import type { MonthlyTransaction, TransactionSummary } from '@/types';

type SqlClient = ReturnType<typeof getSql>;

export interface FinanceLatestItem {
  date: string;
  description: string;
  type: string;
  category: string;
  amount: number;
}

export interface FinanceCategoryTotal {
  category: string;
  type: string;
  total: number;
}

export interface PublicFinanceData {
  summary: TransactionSummary & { updatedAt: string | null };
  latest: FinanceLatestItem[];
  categories: FinanceCategoryTotal[];
  monthly: MonthlyTransaction[];
}

function toNumber(value: unknown): number {
  return Number(value || 0);
}

function toDateString(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value || '').slice(0, 10);
}

export async function getFinanceSummary(sql: SqlClient): Promise<TransactionSummary & { updatedAt: string | null }> {
  const now = new Date();
  const firstDay = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

  const [saldoRows, monthlyRows] = await Promise.all([
    (sql as any).query(`
      SELECT
        COALESCE(SUM(CASE WHEN type = 'Pemasukan' THEN amount ELSE 0 END), 0) AS total_pemasukan,
        COALESCE(SUM(CASE WHEN type = 'Pengeluaran' THEN amount ELSE 0 END), 0) AS total_pengeluaran,
        MAX(updated_at) AS updated_at
      FROM transactions
    `),
    (sql as any).query(`
      SELECT
        COALESCE(SUM(CASE WHEN type = 'Pemasukan' THEN amount ELSE 0 END), 0) AS pemasukan_bulan_ini,
        COALESCE(SUM(CASE WHEN type = 'Pengeluaran' THEN amount ELSE 0 END), 0) AS pengeluaran_bulan_ini
      FROM transactions
      WHERE date >= $1 AND date <= $2
    `, [firstDay, lastDay]),
  ]) as any[][];

  const saldo = saldoRows[0] || {};
  const monthly = monthlyRows[0] || {};
  const totalPemasukan = toNumber(saldo.total_pemasukan);
  const totalPengeluaran = toNumber(saldo.total_pengeluaran);
  const pemasukanBulanIni = toNumber(monthly.pemasukan_bulan_ini);
  const pengeluaranBulanIni = toNumber(monthly.pengeluaran_bulan_ini);

  return {
    saldo: totalPemasukan - totalPengeluaran,
    totalPemasukan,
    totalPengeluaran,
    pemasukanBulanIni,
    pengeluaranBulanIni,
    selisihBulanIni: pemasukanBulanIni - pengeluaranBulanIni,
    updatedAt: saldo.updated_at || null,
  };
}

export async function getMonthlyFinance(sql: SqlClient): Promise<MonthlyTransaction[]> {
  const rows = (await (sql as any).query(`
    SELECT
      TO_CHAR(date, 'YYYY-MM') AS month,
      COALESCE(SUM(CASE WHEN type = 'Pemasukan' THEN amount ELSE 0 END), 0) AS pemasukan,
      COALESCE(SUM(CASE WHEN type = 'Pengeluaran' THEN amount ELSE 0 END), 0) AS pengeluaran
    FROM transactions
    WHERE date >= (CURRENT_DATE - INTERVAL '6 months')
    GROUP BY TO_CHAR(date, 'YYYY-MM')
    ORDER BY month ASC
  `)) as any[];

  return rows.map((row) => ({
    month: row.month,
    pemasukan: toNumber(row.pemasukan),
    pengeluaran: toNumber(row.pengeluaran),
  }));
}

export async function getLatestFinance(sql: SqlClient, limit = 8): Promise<FinanceLatestItem[]> {
  const rows = (await (sql as any).query(`
    SELECT date, description, type, category, amount
    FROM transactions
    ORDER BY date DESC, created_at DESC
    LIMIT $1
  `, [limit])) as any[];

  return rows.map((row) => ({
    ...row,
    date: toDateString(row.date),
    amount: toNumber(row.amount),
  }));
}

export async function getFinanceCategoryTotals(sql: SqlClient, limit = 8): Promise<FinanceCategoryTotal[]> {
  const rows = (await (sql as any).query(`
    SELECT category, type, COALESCE(SUM(amount), 0) AS total
    FROM transactions
    GROUP BY category, type
    ORDER BY total DESC
    LIMIT $1
  `, [limit])) as any[];

  return rows.map((row) => ({
    category: row.category,
    type: row.type,
    total: toNumber(row.total),
  }));
}

export async function getPublicFinanceData(): Promise<PublicFinanceData> {
  const sql = getSql();
  const [summary, latest, categories, monthly] = await Promise.all([
    getFinanceSummary(sql),
    getLatestFinance(sql),
    getFinanceCategoryTotals(sql),
    getMonthlyFinance(sql),
  ]);

  return { summary, latest, categories, monthly };
}
