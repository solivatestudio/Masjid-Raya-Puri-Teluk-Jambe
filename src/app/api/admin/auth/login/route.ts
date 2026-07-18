import { NextRequest, NextResponse } from 'next/server';
import { getSql, verifyPassword, ensureSeeded } from '@/db';
import { setCmsSessionCookie } from '@/lib/auth-admin';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    if (!process.env.AUTH_SECRET) {
      return NextResponse.json({ error: 'AUTH_SECRET belum diset' }, { status: 500 });
    }
    await ensureSeeded();
    const sql = getSql();
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password wajib diisi' }, { status: 400 });
    }

    const rows = (await (sql as any).query(
      `SELECT id, email, password_hash, name, role, is_active FROM users WHERE email = $1 LIMIT 1`,
      [email.toLowerCase().trim()]
    )) as any[];

    const user = rows[0];
    if (!user) {
      return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 });
    }
    if (!user.is_active) {
      return NextResponse.json({ error: 'Akun dinonaktifkan' }, { status: 403 });
    }
    const ok = await verifyPassword(password, user.password_hash);
    if (!ok) {
      return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 });
    }

    await (sql as any).query(`UPDATE users SET last_login_at = NOW() WHERE id = $1`, [user.id]);
    await setCmsSessionCookie({ userId: user.id, email: user.email, name: user.name, role: user.role });

    return NextResponse.json({
      message: 'Login berhasil',
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
