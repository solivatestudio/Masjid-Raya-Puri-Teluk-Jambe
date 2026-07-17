import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import sql from './db/pool';
import { seedDatabase } from './db/seed';
import transactionsRouter from './routes/transactions';
import bookingsRouter from './routes/bookings';
import pageviewsRouter from './routes/pageviews';

config();

const app = express();
app.use(cors());
app.use(express.json());

// Auto-initialize schema on first request
async function initDb() {
  try {
    // Create tables if not exist
    await sql.query(`CREATE TABLE IF NOT EXISTS transactions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      date DATE NOT NULL,
      description TEXT NOT NULL,
      type VARCHAR(20) NOT NULL CHECK (type IN ('Pemasukan', 'Pengeluaran')),
      category VARCHAR(100) NOT NULL,
      amount BIGINT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`, []);
    await sql.query(`CREATE TABLE IF NOT EXISTS bookings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(150) NOT NULL,
      whatsapp VARCHAR(20) NOT NULL,
      date DATE NOT NULL,
      time_start TIME NOT NULL,
      time_end TIME NOT NULL,
      purpose TEXT NOT NULL,
      package_id VARCHAR(20),
      need_organizer BOOLEAN NOT NULL DEFAULT FALSE,
      notes TEXT DEFAULT '',
      status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
      admin_notes TEXT DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`, []);
    await sql.query(`CREATE TABLE IF NOT EXISTS pageviews (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      path TEXT NOT NULL,
      referrer TEXT DEFAULT '',
      user_agent TEXT DEFAULT '',
      ip_address VARCHAR(45) DEFAULT '',
      timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`, []);

    console.log('Tables initialized');

    // Auto-seed
    await seedDatabase();
  } catch (error) {
    console.error('DB init error:', error);
  }
}

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/transactions', transactionsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/pageviews', pageviewsRouter);

const PORT = process.env.PORT || 3001;

// Init DB then start server
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
  });
});
