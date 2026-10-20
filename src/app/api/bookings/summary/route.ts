import { NextRequest, NextResponse } from 'next/server';
import { getSql, ensureSeeded } from '@/db';
import { requireCmsRole, authErrorResponse } from '@/lib/rbac';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(_req: NextRequest) {
  try {
    await requireCmsRole('admin');
    await ensureSeeded();
    const sql = getSql();
    const now = new Date();
    const firstDay = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

    const pending = (await (sql as any).query(`SELECT COUNT(*)::int as count FROM bookings WHERE status = 'pending'`)) as any[];
    const approved = (await (sql as any).query(
      `SELECT COUNT(*)::int as count FROM bookings WHERE status = 'approved' AND date >= $1 AND date <= $2`,
      [firstDay, lastDay]
    )) as any[];
    const nearest = (await (sql as any).query(
      `SELECT date, name, purpose FROM bookings WHERE status = 'approved' AND date >= CURRENT_DATE ORDER BY date ASC LIMIT 1`
    )) as any[];

    return NextResponse.json({
      totalPending: pending[0]?.count ?? 0,
      totalApprovedThisMonth: approved[0]?.count ?? 0,
      nearestBooking: nearest[0] || null,
    });
  } catch (error: any) {
    return authErrorResponse(error);
  }
}

