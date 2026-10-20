import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/db';
import { requireCmsAuth, authErrorResponse } from '@/lib/rbac';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    await requireCmsAuth();
    const sql = getSql();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const excludeId = searchParams.get('excludeId');
    if (!slug) return NextResponse.json({ available: false, error: 'slug wajib diisi' }, { status: 400 });
    const rows = excludeId
      ? (await (sql as any).query(`SELECT id FROM articles WHERE slug = $1 AND id != $2`, [slug, excludeId])) as any[]
      : (await (sql as any).query(`SELECT id FROM articles WHERE slug = $1`, [slug])) as any[];
    return NextResponse.json({ available: rows.length === 0 });
  } catch (error) {
    return authErrorResponse(error);
  }
}
