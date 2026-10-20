import { NextRequest, NextResponse } from 'next/server';
import { getSql, ensureSeeded } from '@/db';
import { requireCmsAuth, authErrorResponse } from '@/lib/rbac';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    await ensureSeeded();
    const sql = getSql();
    const { path, referrer, userAgent } = await req.json();
    if (!path) return NextResponse.json({ error: 'path wajib diisi' }, { status: 400 });
    const ipAddress =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      '';

    await (sql as any).query(
      `INSERT INTO pageviews (path, referrer, user_agent, ip_address) VALUES ($1, $2, $3, $4)`,
      [path, referrer || '', userAgent || '', ipAddress]
    );

    return NextResponse.json({ message: 'ok' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await requireCmsAuth();
    const sql = getSql();
    await (sql as any).query(`DELETE FROM pageviews`);
    return NextResponse.json({ message: 'Semua data pageviews berhasil dihapus' });
  } catch (error) {
    return authErrorResponse(error);
  }
}