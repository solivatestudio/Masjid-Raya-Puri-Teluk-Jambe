import { NextRequest, NextResponse } from 'next/server';
import { getSql, ensureSeeded } from '@/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(_req: NextRequest) {
  try {
    await ensureSeeded();
    const sql = getSql();
    const total = (await (sql as any).query(
      `SELECT COUNT(*)::int as count FROM pageviews WHERE timestamp >= CURRENT_DATE - INTERVAL '7 days'`
    )) as any[];
    const unique = (await (sql as any).query(
      `SELECT COUNT(DISTINCT ip_address)::int as count FROM pageviews WHERE timestamp >= CURRENT_DATE - INTERVAL '7 days' AND ip_address != ''`
    )) as any[];
    const active = (await (sql as any).query(
      `SELECT COUNT(DISTINCT ip_address)::int as count FROM pageviews WHERE timestamp >= NOW() - INTERVAL '5 minutes' AND ip_address != ''`
    )) as any[];
    const topPages = (await (sql as any).query(
      `SELECT path, COUNT(*)::int as views FROM pageviews WHERE timestamp >= CURRENT_DATE - INTERVAL '7 days' GROUP BY path ORDER BY views DESC LIMIT 10`
    )) as any[];
    const referrers = (await (sql as any).query(
      `SELECT CASE WHEN referrer = '' OR referrer IS NULL THEN 'Direct' ELSE referrer END as source, COUNT(*)::int as views FROM pageviews WHERE timestamp >= CURRENT_DATE - INTERVAL '7 days' GROUP BY source ORDER BY views DESC LIMIT 10`
    )) as any[];
    const daily = (await (sql as any).query(
      `SELECT TO_CHAR(timestamp::date, 'YYYY-MM-DD') as date, COUNT(*)::int as views FROM pageviews WHERE timestamp >= CURRENT_DATE - INTERVAL '7 days' GROUP BY timestamp::date ORDER BY date ASC`
    )) as any[];

    const totalViews = total[0]?.count || 1;
    const topPagesWithPct = topPages.map((p: any) => ({
      ...p,
      percentage: Math.round((p.views / totalViews) * 100),
    }));

    return NextResponse.json({
      total7Days: total[0]?.count || 0,
      uniqueVisitors: unique[0]?.count || 0,
      activeVisitors: active[0]?.count || 0,
      topPages: topPagesWithPct,
      referrers,
      daily7Days: daily,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
