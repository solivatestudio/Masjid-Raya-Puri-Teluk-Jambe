import { NextRequest, NextResponse } from 'next/server';
import { getSql, ensureSeeded } from '@/db';
import { getMonthlyFinance } from '@/lib/finance';
import { requireCmsRole, authErrorResponse } from '@/lib/rbac';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(_req: NextRequest) {
  try {
    await requireCmsRole('admin');
    await ensureSeeded();
    const sql = getSql();
    const rows = await getMonthlyFinance(sql);
    return NextResponse.json(rows, { headers: { 'Cache-Control': 'no-store, max-age=0, must-revalidate' } });
  } catch (error: any) {
    return authErrorResponse(error);
  }
}

