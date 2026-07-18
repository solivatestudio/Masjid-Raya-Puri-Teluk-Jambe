import { neon, neonConfig } from '@neondatabase/serverless';

let cachedSql: ReturnType<typeof neon> | null = null;
let seeded = false;

export function getSql() {
  if (cachedSql) return cachedSql;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is not set');
  }
  neonConfig.fetchConnectionCache = true;
  cachedSql = neon(url);
  return cachedSql;
}

export async function ensureSchema() {
  const sql = getSql();
  await (sql as any).query(`CREATE EXTENSION IF NOT EXISTS pgcrypto`, []);

  await (sql as any).query(`
    CREATE TABLE IF NOT EXISTS transactions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      date DATE NOT NULL,
      description TEXT NOT NULL,
      type VARCHAR(20) NOT NULL CHECK (type IN ('Pemasukan', 'Pengeluaran')),
      category VARCHAR(100) NOT NULL,
      amount BIGINT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `, []);
  await (sql as any).query(`CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date)`, []);
  await (sql as any).query(`CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type)`, []);
  await (sql as any).query(`CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category)`, []);

  await (sql as any).query(`
    CREATE TABLE IF NOT EXISTS bookings (
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
    )
  `, []);
  await (sql as any).query(`CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date)`, []);
  await (sql as any).query(`CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status)`, []);

  await (sql as any).query(`
    CREATE TABLE IF NOT EXISTS pageviews (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      path TEXT NOT NULL,
      referrer TEXT DEFAULT '',
      user_agent TEXT DEFAULT '',
      ip_address VARCHAR(45) DEFAULT '',
      timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `, []);
  await (sql as any).query(`CREATE INDEX IF NOT EXISTS idx_pageviews_timestamp ON pageviews(timestamp)`, []);
  await (sql as any).query(`CREATE INDEX IF NOT EXISTS idx_pageviews_path ON pageviews(path)`, []);
}

const SEED_TRANSACTIONS = [
  { date: '2026-06-01', description: 'Infaq Kotak Amal Shalat Jumat', type: 'Pemasukan', category: 'Infaq Jumat', amount: 14280000 },
  { date: '2026-06-02', description: 'Dana Kebersihan & Listrik Aula (Sewa)', type: 'Pemasukan', category: 'Penyewaan Aula', amount: 7500000 },
  { date: '2026-06-02', description: 'Tagihan Listrik PLN & Air PAM Mei', type: 'Pengeluaran', category: 'Operasional', amount: 5400000 },
  { date: '2026-06-03', description: 'Donasi QRIS Pembangunan Kanopi', type: 'Pemasukan', category: 'Wakaf Pembangunan', amount: 8500000 },
  { date: '2026-06-03', description: 'Sembako Program Santunan Dhuafa', type: 'Pengeluaran', category: 'Sosial Kemasyarakatan', amount: 6200000 },
  { date: '2026-06-04', description: 'Infaq Harian Jamaah Masjid', type: 'Pemasukan', category: 'Infaq Umum', amount: 3250000 },
  { date: '2026-06-04', description: 'Honor Mukim Muadzin & Petugas Kebersihan', type: 'Pengeluaran', category: 'Operasional', amount: 4500000 },
];

const SEED_BOOKINGS = [
  { name: 'H. Ahmad Fauzi', whatsapp: '081234567890', date: '2026-07-20', time_start: '08:00', time_end: '14:00', purpose: 'Walimah Pernikahan Putra', status: 'approved', package_id: 'pkg-weekend', need_organizer: false, notes: 'Akad jam 8, resepsi jam 10', admin_notes: '' },
  { name: 'Ibu Siti Rahmawati', whatsapp: '087812345678', date: '2026-07-25', time_start: '09:00', time_end: '12:00', purpose: 'Aqiqah & Syukuran', status: 'pending', package_id: 'pkg-weekdays', need_organizer: false, notes: '', admin_notes: '' },
  { name: 'Yayasan Al-Hidayah', whatsapp: '082198765432', date: '2026-08-01', time_start: '07:00', time_end: '17:00', purpose: 'Seminar Pendidikan Islam', status: 'pending', package_id: 'pkg-weekend', need_organizer: true, notes: 'Butuh sound system & panggung', admin_notes: '' },
  { name: 'Bapak Deden S.', whatsapp: '085612345678', date: '2026-07-15', time_start: '10:00', time_end: '15:00', purpose: 'Rapat Koordinasi RW', status: 'rejected', package_id: 'pkg-weekdays', need_organizer: false, notes: '', admin_notes: 'Bentrok dengan jadwal Dauroh Al-Quran' },
];

const SEED_PATHS = ['/', '/#kegiatan', '/#khutbah', '/#donasi', '/#galeri', '/#audio-visual-hall'];
const SEED_REFERRERS = ['', 'https://www.google.com', 'https://instagram.com/masjidrayapuritelukjambe', 'https://web.facebook.com'];

export async function ensureSeeded() {
  if (seeded) return;
  const sql = getSql();
  await ensureSchema();

  const txCount = (await sql`SELECT COUNT(*)::int as c FROM transactions`) as unknown as { c: number }[];
  if ((txCount[0]?.c ?? 0) === 0) {
    for (const t of SEED_TRANSACTIONS) {
      await (sql as any).query(
        `INSERT INTO transactions (date, description, type, category, amount) VALUES ($1, $2, $3, $4, $5)`,
        [t.date, t.description, t.type, t.category, t.amount]
      );
    }
  }

  const bkCount = (await sql`SELECT COUNT(*)::int as c FROM bookings`) as unknown as { c: number }[];
  if ((bkCount[0]?.c ?? 0) === 0) {
    for (const b of SEED_BOOKINGS) {
      await (sql as any).query(
        `INSERT INTO bookings (name, whatsapp, date, time_start, time_end, purpose, status, package_id, need_organizer, notes, admin_notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [b.name, b.whatsapp, b.date, b.time_start, b.time_end, b.purpose, b.status, b.package_id, b.need_organizer, b.notes, b.admin_notes]
      );
    }
  }

  const pvCount = (await sql`SELECT COUNT(*)::int as c FROM pageviews`) as unknown as { c: number }[];
  if ((pvCount[0]?.c ?? 0) === 0) {
    const now = new Date();
    for (let day = 6; day >= 0; day--) {
      const viewsPerDay = Math.floor(Math.random() * 30) + 10;
      for (let i = 0; i < viewsPerDay; i++) {
        const path = SEED_PATHS[Math.floor(Math.random() * SEED_PATHS.length)];
        const referrer = SEED_REFERRERS[Math.floor(Math.random() * SEED_REFERRERS.length)];
        const hour = Math.floor(Math.random() * 14) + 6;
        const minute = Math.floor(Math.random() * 60);
        const timestamp = new Date(now);
        timestamp.setDate(timestamp.getDate() - day);
        timestamp.setHours(hour, minute, 0, 0);
        await (sql as any).query(
          `INSERT INTO pageviews (path, referrer, timestamp) VALUES ($1, $2, $3)`,
          [path, referrer, timestamp.toISOString()]
        );
      }
    }
  }

  seeded = true;
}
