import { NextResponse } from 'next/server';
import { getPublicFinanceData } from '@/lib/finance';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function withTimeout<T>(promise: Promise<T>, ms = 8000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Database timeout')), ms)),
  ]);
}

export async function GET() {
  try {
    const data = await withTimeout(getPublicFinanceData());
    return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store, max-age=0, must-revalidate' } });
  } catch {
    return NextResponse.json({ error: 'Gagal memuat transparansi keuangan' }, { status: 500 });
  }
}
