import { NextRequest, NextResponse } from 'next/server';
import { getCmsSession } from '@/lib/auth-admin';
import type { CmsSession, UserRole } from '@/types';

export async function requireCmsAuth(): Promise<CmsSession> {
  const session = await getCmsSession();
  if (!session) {
    throw new CmsAuthError('Unauthorized', 401);
  }
  return session;
}

export async function requireCmsRole(role: UserRole): Promise<CmsSession> {
  const session = await requireCmsAuth();
  if (role === 'admin' && session.role !== 'admin') {
    throw new CmsAuthError('Forbidden: admin role required', 403);
  }
  return session;
}

export function authErrorResponse(error: unknown): NextResponse {
  if (error instanceof CmsAuthError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
}

export class CmsAuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function getOptionalSession(): Promise<CmsSession | null> {
  return getCmsSession();
}

export function getCmsSessionFromCookieHeader(cookieHeader: string | null): { cookie: string } | null {
  return cookieHeader ? { cookie: cookieHeader } : null;
}

export async function getCmsSessionFromRequest(req: NextRequest): Promise<CmsSession | null> {
  const token = req.cookies.get('mrptj_cms')?.value;
  if (!token) return null;
  const { verifySessionToken } = await import('@/lib/auth-admin');
  return verifySessionToken(token);
}
