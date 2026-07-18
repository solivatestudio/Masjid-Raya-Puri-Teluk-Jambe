import { NextRequest, NextResponse } from 'next/server';
import { getSql, ensureSeeded } from '@/db';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    await ensureSeeded();
    const sql = getSql();
    const { path, referrer, userAgent } = await req.json();
    if (!path) {
      return NextResponse.json({ error: 'path wajib diisi' }, { status: 400 });
    }
    const ipAddress =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      '';

    await (sql as any).query(
      `INSERT INTO pageviews (path, referrer, user_agent, ip_address) VALUES ($1, $2, $3, $4)`,
      [path, referrer || '', userAgent || '', ipAddress]
    );

    return NextResponse.json({ message: 'ok' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Tidak diotorisasi' }, { status: 401 });
  }
  try {
    const sql = getSql();
    await (sql as any).query(`DELETE FROM pageviews`);
    return NextResponse.json({ message: 'Semua data pageviews berhasil dihapus' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
