import { Router, Request, Response } from 'express';
import sql from '../db/pool';

const router = Router();

// POST /api/pageviews — record a pageview
router.post('/', async (req: Request, res: Response) => {
  try {
    const { path, referrer, userAgent } = req.body;
    if (!path) return res.status(400).json({ error: 'path wajib diisi' });

    const ipAddress = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.socket.remoteAddress || '';

    await sql.query(`
      INSERT INTO pageviews (path, referrer, user_agent, ip_address)
      VALUES ($1, $2, $3, $4)
    `, [path, referrer || '', userAgent || '', ipAddress]);

    res.status(201).json({ message: 'ok' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/pageviews/summary — aggregated analytics
router.get('/summary', async (_req: Request, res: Response) => {
  try {
    const totalResult = await sql.query(`
      SELECT COUNT(*)::int as count FROM pageviews
      WHERE timestamp >= CURRENT_DATE - INTERVAL '7 days'
    `, []);

    const uniqueResult = await sql.query(`
      SELECT COUNT(DISTINCT ip_address)::int as count FROM pageviews
      WHERE timestamp >= CURRENT_DATE - INTERVAL '7 days' AND ip_address != ''
    `, []);

    const activeResult = await sql.query(`
      SELECT COUNT(DISTINCT ip_address)::int as count FROM pageviews
      WHERE timestamp >= NOW() - INTERVAL '5 minutes' AND ip_address != ''
    `, []);

    const topPages = await sql.query(`
      SELECT path, COUNT(*)::int as views FROM pageviews
      WHERE timestamp >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY path
      ORDER BY views DESC
      LIMIT 10
    `, []);

    const referrers = await sql.query(`
      SELECT
        CASE WHEN referrer = '' OR referrer IS NULL THEN 'Direct' ELSE referrer END as source,
        COUNT(*)::int as views
      FROM pageviews
      WHERE timestamp >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY source
      ORDER BY views DESC
      LIMIT 10
    `, []);

    const daily = await sql.query(`
      SELECT TO_CHAR(timestamp::date, 'YYYY-MM-DD') as date, COUNT(*)::int as views
      FROM pageviews
      WHERE timestamp >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY timestamp::date
      ORDER BY date ASC
    `, []);

    const tr = (totalResult.rows || totalResult)[0];
    const ur = (uniqueResult.rows || uniqueResult)[0];
    const ar = (activeResult.rows || activeResult)[0];
    const tpRows = topPages.rows || topPages;
    const refRows = referrers.rows || referrers;
    const dailyRows = daily.rows || daily;

    const totalViews = tr?.count || 1;
    const topPagesWithPct = (tpRows as any[]).map((p: any) => ({
      ...p,
      percentage: Math.round((p.views / totalViews) * 100),
    }));

    res.json({
      total7Days: tr?.count || 0,
      uniqueVisitors: ur?.count || 0,
      activeVisitors: ar?.count || 0,
      topPages: topPagesWithPct,
      referrers: refRows,
      daily7Days: dailyRows,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/pageviews — clear all pageviews data
router.delete('/', async (_req: Request, res: Response) => {
  try {
    await sql.query('DELETE FROM pageviews', []);
    res.json({ message: 'Semua data pageviews berhasil dihapus' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/pageviews/recent — latest 30 visits
router.get('/recent', async (_req: Request, res: Response) => {
  try {
    const result = await sql.query(`
      SELECT id, path, referrer, user_agent as "userAgent", timestamp
      FROM pageviews
      ORDER BY timestamp DESC
      LIMIT 30
    `, []);
    res.json(result.rows || result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
