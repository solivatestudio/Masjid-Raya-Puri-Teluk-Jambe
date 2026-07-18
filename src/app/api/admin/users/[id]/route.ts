import { NextRequest, NextResponse } from 'next/server';
import { getSql, hashPassword } from '@/db';
import { requireCmsRole, authErrorResponse } from '@/lib/rbac';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireCmsRole('admin');
    const sql = getSql();
    const { id } = await params;
    const rows = (await (sql as any).query(
      `SELECT id, email, name, role, avatar_url, is_active, last_login_at, created_at FROM users WHERE id = $1`,
      [id]
    )) as any[];
    if (!rows[0]) return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireCmsRole('admin');
    const sql = getSql();
    const { id } = await params;
    const body = await req.json();
    const { name, role, is_active, password } = body;

    const updates: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (name !== undefined) {
      updates.push(`name = $${idx++}`);
      values.push(name);
    }
    if (role !== undefined) {
      if (!['admin', 'editor'].includes(role)) {
        return NextResponse.json({ error: 'Role harus admin atau editor' }, { status: 400 });
      }
      updates.push(`role = $${idx++}`);
      values.push(role);
    }
    if (is_active !== undefined) {
      updates.push(`is_active = $${idx++}`);
      values.push(!!is_active);
    }
    if (password) {
      if (password.length < 8) {
        return NextResponse.json({ error: 'Password minimal 8 karakter' }, { status: 400 });
      }
      const hash = await hashPassword(password);
      updates.push(`password_hash = $${idx++}`);
      values.push(hash);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'Tidak ada field untuk diupdate' }, { status: 400 });
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const rows = (await (sql as any).query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${idx} RETURNING id, email, name, role, is_active`,
      values
    )) as any[];
    if (!rows[0]) return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireCmsRole('admin');
    const sql = getSql();
    const { id } = await params;
    if (id === session.userId) {
      return NextResponse.json({ error: 'Tidak bisa menghapus akun sendiri' }, { status: 400 });
    }
    const rows = (await (sql as any).query(`DELETE FROM users WHERE id = $1 RETURNING id`, [id])) as any[];
    if (!rows[0]) return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    return NextResponse.json({ message: 'User berhasil dihapus' });
  } catch (error) {
    return authErrorResponse(error);
  }
}
