import { Router, Request, Response } from 'express';
import sql from '../db/pool';

const router = Router();

// GET /api/bookings — list
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    let result;

    if (status && status !== 'Semua') {
      result = await sql.query(`
        SELECT * FROM bookings
        WHERE status = $1
        ORDER BY
          CASE WHEN status = 'pending' THEN 0 ELSE 1 END,
          date ASC,
          time_start ASC
      `, [status]);
    } else {
      result = await sql.query(`
        SELECT * FROM bookings
        ORDER BY
          CASE WHEN status = 'pending' THEN 0 ELSE 1 END,
          date ASC,
          time_start ASC
      `, []);
    }

    res.json(result.rows || result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/bookings/summary
router.get('/summary', async (_req: Request, res: Response) => {
  try {
    const now = new Date();
    const firstDay = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

    const pendingResult = await sql.query(`SELECT COUNT(*)::int as count FROM bookings WHERE status = 'pending'`, []);
    const approvedResult = await sql.query(`
      SELECT COUNT(*)::int as count FROM bookings
      WHERE status = 'approved' AND date >= $1 AND date <= $2
    `, [firstDay, lastDay]);

    const nearestResult = await sql.query(`
      SELECT date, name, purpose FROM bookings
      WHERE status = 'approved' AND date >= CURRENT_DATE
      ORDER BY date ASC
      LIMIT 1
    `, []);

    const pr = (pendingResult.rows || pendingResult)[0];
    const ar = (approvedResult.rows || approvedResult)[0];
    const nr = (nearestResult.rows || nearestResult)[0] || null;

    res.json({
      totalPending: pr.count,
      totalApprovedThisMonth: ar.count,
      nearestBooking: nr,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/bookings/calendar — approved dates
router.get('/calendar', async (_req: Request, res: Response) => {
  try {
    const result = await sql.query(`
      SELECT DISTINCT date FROM bookings
      WHERE status = 'approved'
      ORDER BY date ASC
    `, []);
    const rows = result.rows || result;
    res.json(rows.map((r: any) => r.date));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/bookings — create
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, whatsapp, date, timeStart, timeEnd, purpose, packageId, needOrganizer, notes } = req.body;
    if (!name || !whatsapp || !date || !timeStart || !timeEnd || !purpose) {
      return res.status(400).json({ error: 'Field wajib: name, whatsapp, date, timeStart, timeEnd, purpose' });
    }

    const result = await sql.query(`
      INSERT INTO bookings (name, whatsapp, date, time_start, time_end, purpose, package_id, need_organizer, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [name, whatsapp, date, timeStart, timeEnd, purpose, packageId || null, needOrganizer || false, notes || '']);

    res.status(201).json((result.rows || result)[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/bookings/:id/status — approve/reject
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { status, adminNotes } = req.body;
    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status harus approved atau rejected' });
    }

    const result = await sql.query(`
      UPDATE bookings SET status = $1, admin_notes = $2, updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `, [status, adminNotes || '', req.params.id]);

    const row = (result.rows || result)[0];
    if (!row) return res.status(404).json({ error: 'Booking tidak ditemukan' });
    res.json(row);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
