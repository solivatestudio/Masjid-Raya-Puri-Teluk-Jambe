import { Router, Request, Response } from 'express';
import sql from '../db/pool';

const router = Router();

// GET /api/transactions — list with filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { type, category, startDate, endDate, limit, offset } = req.query;
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIdx = 1;

    if (type && type !== 'Semua') {
      conditions.push(`type = $${paramIdx++}`);
      params.push(type);
    }
    if (category) {
      conditions.push(`category = $${paramIdx++}`);
      params.push(category);
    }
    if (startDate) {
      conditions.push(`date >= $${paramIdx++}`);
      params.push(startDate);
    }
    if (endDate) {
      conditions.push(`date <= $${paramIdx++}`);
      params.push(endDate);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const limitVal = Math.min(parseInt(limit as string) || 50, 100);
    const offsetVal = parseInt(offset as string) || 0;

    const query = `
      SELECT * FROM transactions ${where}
      ORDER BY date DESC, created_at DESC
      LIMIT $${paramIdx++} OFFSET $${paramIdx++}
    `;
    params.push(limitVal, offsetVal);

    const result = await sql.query(query, params);
    res.json(result.rows || result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/transactions/summary — aggregated data
router.get('/summary', async (_req: Request, res: Response) => {
  try {
    const now = new Date();
    const firstDay = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

    const saldoResult = await sql.query(`
      SELECT
        COALESCE(SUM(CASE WHEN type = 'Pemasukan' THEN amount ELSE 0 END), 0) as total_pemasukan,
        COALESCE(SUM(CASE WHEN type = 'Pengeluaran' THEN amount ELSE 0 END), 0) as total_pengeluaran
      FROM transactions
    `, []);

    const monthlyResult = await sql.query(`
      SELECT
        COALESCE(SUM(CASE WHEN type = 'Pemasukan' THEN amount ELSE 0 END), 0) as pemasukan_bulan_ini,
        COALESCE(SUM(CASE WHEN type = 'Pengeluaran' THEN amount ELSE 0 END), 0) as pengeluaran_bulan_ini
      FROM transactions
      WHERE date >= $1 AND date <= $2
    `, [firstDay, lastDay]);

    const sr = (saldoResult.rows || saldoResult)[0];
    const mr = (monthlyResult.rows || monthlyResult)[0];

    res.json({
      saldo: Number(sr.total_pemasukan) - Number(sr.total_pengeluaran),
      totalPemasukan: Number(sr.total_pemasukan),
      totalPengeluaran: Number(sr.total_pengeluaran),
      pemasukanBulanIni: Number(mr.pemasukan_bulan_ini),
      pengeluaranBulanIni: Number(mr.pengeluaran_bulan_ini),
      selisihBulanIni: Number(mr.pemasukan_bulan_ini) - Number(mr.pengeluaran_bulan_ini),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/transactions/monthly — per-bulan breakdown
router.get('/monthly', async (_req: Request, res: Response) => {
  try {
    const result = await sql.query(`
      SELECT
        TO_CHAR(date, 'YYYY-MM') as month,
        COALESCE(SUM(CASE WHEN type = 'Pemasukan' THEN amount ELSE 0 END), 0) as pemasukan,
        COALESCE(SUM(CASE WHEN type = 'Pengeluaran' THEN amount ELSE 0 END), 0) as pengeluaran
      FROM transactions
      WHERE date >= (CURRENT_DATE - INTERVAL '6 months')
      GROUP BY TO_CHAR(date, 'YYYY-MM')
      ORDER BY month ASC
    `, []);
    res.json(result.rows || result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/transactions — create
router.post('/', async (req: Request, res: Response) => {
  try {
    const { date, description, type, category, amount } = req.body;
    if (!date || !description || !type || !category || !amount) {
      return res.status(400).json({ error: 'Semua field wajib diisi' });
    }

    const result = await sql.query(`
      INSERT INTO transactions (date, description, type, category, amount)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [date, description, type, category, amount]);

    const row = (result.rows || result)[0];
    res.status(201).json(row);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/transactions/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const result = await sql.query(`DELETE FROM transactions WHERE id = $1 RETURNING *`, [req.params.id]);
    const row = (result.rows || result)[0];
    if (!row) return res.status(404).json({ error: 'Transaksi tidak ditemukan' });
    res.json({ message: 'Transaksi berhasil dihapus' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
