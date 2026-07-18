import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, verifySessionToken } from '@/lib/auth';
import { CMS_COOKIE_NAME, verifySessionToken as verifyCmsToken } from '@/lib/auth-admin';

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get(CMS_COOKIE_NAME)?.value;
    const session = await verifyCmsToken(token);
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/dashboard')) {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const valid = await verifySessionToken(token);
    if (!valid) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}
