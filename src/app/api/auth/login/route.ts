import { NextRequest, NextResponse } from 'next/server';
import { checkPassword, setSessionCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ADMIN_PASSWORD || !process.env.AUTH_SECRET) {
      return NextResponse.json(
        { error: 'Server belum dikonfigurasi: ADMIN_PASSWORD dan AUTH_SECRET wajib di-set' },
        { status: 500 }
      );
    }
    const { password } = await req.json();
    if (!password) {
      return NextResponse.json({ error: 'Password wajib diisi' }, { status: 400 });
    }
    if (!checkPassword(password)) {
      return NextResponse.json({ error: 'Password salah' }, { status: 401 });
    }
    await setSessionCookie();
    return NextResponse.json({ message: 'Login berhasil' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
