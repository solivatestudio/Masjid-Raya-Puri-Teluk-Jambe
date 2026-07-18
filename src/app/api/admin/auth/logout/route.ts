import { NextResponse } from 'next/server';
import { clearCmsSessionCookie } from '@/lib/auth-admin';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST() {
  await clearCmsSessionCookie();
  return NextResponse.json({ message: 'Logout berhasil' });
}
