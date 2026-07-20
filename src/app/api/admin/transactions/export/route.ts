import { NextRequest, NextResponse } from 'next/server';
import { getSql, ensureSeeded } from '@/db';
import { requireCmsRole, authErrorResponse } from '@/lib/rbac';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function csvEscape(value: unknown): string {
  const raw = value === null || value === undefined ? '' : String(value);
  return `"${raw.replace(/"/g, '""')}"`;
}

function normalizeDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value || '').slice(0, 10);
}

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
    const rows = (await (sql as any).query(
      `SELECT date, description, type, category, amount, created_at, updated_at
       FROM transactions ${where}
       ORDER BY date DESC, created_at DESC`,
      params
    )) as any[];

    const header = ['Tanggal', 'Deskripsi', 'Tipe', 'Kategori', 'Jumlah', 'Dibuat', 'Diupdate'];
    const lines = [header.map(csvEscape).join(',')];
    for (const row of rows) {
      lines.push([
        normalizeDate(row.date),
        row.description,
        row.type,
        row.category,
        row.amount,
        row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
        row.updated_at instanceof Date ? row.updated_at.toISOString() : row.updated_at,
      ].map(csvEscape).join(','));
    }

    return new NextResponse(lines.join('\n'), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="laporan-keuangan-masjid-${new Date().toISOString().slice(0, 10)}.csv"`,
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}
