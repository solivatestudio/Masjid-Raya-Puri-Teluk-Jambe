import { NextResponse } from 'next/server';
import { getSql, ensureSeeded } from '@/db';
import { requireCmsAuth, authErrorResponse } from '@/lib/rbac';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function getNextFridays(count: number, fromDate = new Date()): string[] {
  const result: string[] = [];
  const d = new Date(fromDate);
  // Find this week's Friday (or next week's if today is past Friday)
  const dayOfWeek = d.getDay();
  const daysUntilFriday = (5 - dayOfWeek + 7) % 7;
  d.setDate(d.getDate() + daysUntilFriday);
  for (let i = 0; i < count; i++) {
    const dd = new Date(d);
    dd.setDate(d.getDate() + i * 7);
    result.push(dd.toISOString().slice(0, 10));
  }
  return result;
}

export async function POST() {
  try {
    await requireCmsAuth();
    await ensureSeeded();
    const sql = getSql();
    const fridays = getNextFridays(4);

    const existing = (await (sql as any).query(
      `SELECT schedule_date FROM khutbah_schedule WHERE schedule_date = ANY($1::date[])`,
      [fridays]
    )) as any[];
    const existingDates = new Set(existing.map((r: any) => r.schedule_date.toString().slice(0, 10)));

    let created = 0;
    let skipped = 0;
    for (const date of fridays) {
      if (existingDates.has(date)) {
        skipped++;
        continue;
      }
      await (sql as any).query(
        `INSERT INTO khutbah_schedule (schedule_date, khatib, muadzin, theme, notes) VALUES ($1, $2, $3, $4, $5)`,
        [date, 'TBD', 'TBD', 'Akan diupdate', 'Auto-generated']
      );
      created++;
    }

    return NextResponse.json({ created, skipped, dates: fridays });
  } catch (error) {
    return authErrorResponse(error);
  }
}
