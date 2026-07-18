import { NextRequest, NextResponse } from 'next/server';
import { CMS_COOKIE_NAME, verifySessionToken } from '@/lib/auth-admin';

export const config = {
  matcher: ['/dashboard/:path*'],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/dashboard')) {
    const token = req.cookies.get(CMS_COOKIE_NAME)?.value;
    const session = await verifySessionToken(token);
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}