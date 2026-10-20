import { NextRequest, NextResponse } from 'next/server';
import { getSql, ensureSeeded, hashPassword } from '@/db';
import { requireCmsRole, authErrorResponse } from '@/lib/rbac';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    await requireCmsRole('admin');
    await ensureSeeded();
    const sql = getSql();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const rows = (await (sql as any).query(
      `SELECT id, email, name, role, avatar_url, is_active, last_login_at, created_at
       FROM users
       WHERE $1 = '' OR name ILIKE '%' || $1 || '%' OR email ILIKE '%' || $1 || '%'
       ORDER BY created_at DESC`,
      [search]
    )) as any[];
    return NextResponse.json(rows);
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireCmsRole('admin');
    const sql = getSql();
    const body = await req.json();
    const { email, password, name, role } = body;
    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: 'Email, password, nama, dan role wajib diisi' }, { status: 400 });
    }
    if (!['admin', 'editor'].includes(role)) {
      return NextResponse.json({ error: 'Role harus admin atau editor' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password minimal 8 karakter' }, { status: 400 });
    }
    const exists = (await (sql as any).query(`SELECT id FROM users WHERE email = $1`, [email.toLowerCase()])) as any[];
    if (exists[0]) {
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 409 });
    }
    const hash = await hashPassword(password);
    const rows = (await (sql as any).query(
      `INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role, is_active, created_at`,
      [email.toLowerCase().trim(), hash, name, role]
    )) as any[];
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    return authErrorResponse(error);
  }
}
