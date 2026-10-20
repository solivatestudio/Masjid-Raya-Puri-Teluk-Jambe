import { cookies } from 'next/headers';
import type { CmsSession, UserRole } from '@/types';

const COOKIE_NAME = 'mrptj_cms';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error('AUTH_SECRET is not set');
  return secret;
}

function bytesToHex(bytes: Uint8Array): string {
  let out = '';
  for (let i = 0; i < bytes.length; i++) out += bytes[i].toString(16).padStart(2, '0');
  return out;
}

function hexToBytes(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
  return out;
}

async function hmacSha256(message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(getSecret()), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return bytesToHex(new Uint8Array(sig));
}

async function timingSafeEqualHex(a: string, b: string): Promise<boolean> {
  if (a.length !== b.length) return false;
  const aB = hexToBytes(a);
  const bB = hexToBytes(b);
  let diff = 0;
  for (let i = 0; i < aB.length; i++) diff |= aB[i] ^ bB[i];
  return diff === 0;
}

function b64UrlEncode(s: string): string {
  return Buffer.from(s, 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64UrlDecode(s: string): string {
  const padded = s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4);
  return Buffer.from(padded, 'base64').toString('utf8');
}

export async function createSessionToken(session: Omit<CmsSession, 'exp'>): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const full: CmsSession = { ...session, exp };
  const payload = b64UrlEncode(JSON.stringify(full));
  const sig = await hmacSha256(payload);
  return `${payload}.${sig}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<CmsSession | null> {
  if (!token) return null;
  const dot = token.lastIndexOf('.');
  if (dot < 0) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = await hmacSha256(payload);
  if (!(await timingSafeEqualHex(expected, sig))) return null;
  try {
    const session = JSON.parse(b64UrlDecode(payload)) as CmsSession;
    if (session.exp < Math.floor(Date.now() / 1000)) return null;
    if (!session.userId || !session.role) return null;
    return session;
  } catch {
    return null;
  }
}

export async function setCmsSessionCookie(session: Omit<CmsSession, 'exp'>) {
  const token = await createSessionToken(session);
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearCmsSessionCookie() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function getCmsSession(): Promise<CmsSession | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function getCmsSessionFromHeaderToken(token: string | undefined | null): Promise<CmsSession | null> {
  return verifySessionToken(token);
}

export const CMS_COOKIE_NAME = COOKIE_NAME;
export const CMS_SESSION_TTL = SESSION_TTL_SECONDS;

export type { UserRole };
