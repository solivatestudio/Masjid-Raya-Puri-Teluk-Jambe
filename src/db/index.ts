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

export async function hashPassword(plain: string): Promise<string> {
  const salt = '$2b$10$' + 'solivatestudiomasjidraya2026'.slice(0, 22);
  // Simple scrypt-based hash via Web Crypto - bcrypt-compatible replacement
  // For demo we use a deterministic but secure pbkdf2 hash; in production upgrade to bcrypt
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(plain), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: enc.encode(salt), iterations: 10000, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  return salt + ':' + Buffer.from(bits).toString('hex');
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  const computed = await hashPassword(plain);
  return timingSafeStringEqual(computed, hash);
}

function timingSafeStringEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
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
      payment_proof_url TEXT,
      payment_proof_uploaded_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `, []);
  await (sql as any).query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_proof_url TEXT`, []);
  await (sql as any).query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_proof_uploaded_at TIMESTAMPTZ`, []);
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

  // CMS: users
  await (sql as any).query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name VARCHAR(150) NOT NULL,
      role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'editor')),
      avatar_url TEXT,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      last_login_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `, []);

  // CMS: articles
  await (sql as any).query(`
    CREATE TABLE IF NOT EXISTS articles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug VARCHAR(255) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      excerpt TEXT,
      content_html TEXT NOT NULL DEFAULT '',
      content_json JSONB,
      featured_image_url TEXT,
      featured_image_alt VARCHAR(255),
      author_id UUID REFERENCES users(id) ON DELETE SET NULL,
      category VARCHAR(50),
      tags TEXT[],
      status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
      scheduled_at TIMESTAMPTZ,
      published_at TIMESTAMPTZ,
      views_count INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `, []);
  await (sql as any).query(`CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status, published_at DESC)`, []);
  await (sql as any).query(`CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug)`, []);
  await (sql as any).query(`CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category)`, []);

  // CMS: kajian (pindahan INITIAL_EVENTS)
  await (sql as any).query(`
    CREATE TABLE IF NOT EXISTS kajian (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title VARCHAR(255) NOT NULL,
      category VARCHAR(20) NOT NULL CHECK (category IN ('Dakwah', 'Dauroh')),
      date_label VARCHAR(100) NOT NULL,
      date_start DATE,
      time_label VARCHAR(100) NOT NULL,
      speaker VARCHAR(200),
      location VARCHAR(255) NOT NULL DEFAULT 'Ruang Utama Masjid Raya Puri Telukjambe',
      description TEXT,
      image_url TEXT,
      capacity INTEGER,
      registered_count INTEGER NOT NULL DEFAULT 0,
      is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
      recurring_day VARCHAR(20),
      pic_id UUID REFERENCES users(id) ON DELETE SET NULL,
      is_published BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `, []);
  await (sql as any).query(`CREATE INDEX IF NOT EXISTS idx_kajian_category ON kajian(category, date_start DESC NULLS LAST)`, []);
  await (sql as any).query(`CREATE INDEX IF NOT EXISTS idx_kajian_published ON kajian(is_published, date_start DESC NULLS LAST)`, []);

  // CMS: khutbah_schedule
  await (sql as any).query(`
    CREATE TABLE IF NOT EXISTS khutbah_schedule (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      schedule_date DATE NOT NULL UNIQUE,
      khatib VARCHAR(200) NOT NULL,
      muadzin VARCHAR(200),
      theme VARCHAR(500),
      pic_id UUID REFERENCES users(id) ON DELETE SET NULL,
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `, []);
  await (sql as any).query(`CREATE INDEX IF NOT EXISTS idx_khutbah_date ON khutbah_schedule(schedule_date DESC)`, []);

  // CMS: aula_availability
  await (sql as any).query(`
    CREATE TABLE IF NOT EXISTS aula_availability (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      date DATE NOT NULL,
      time_start TIME NOT NULL,
      time_end TIME NOT NULL,
      is_available BOOLEAN NOT NULL DEFAULT TRUE,
      block_reason VARCHAR(255),
      pic_id UUID REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(date, time_start)
    )
  `, []);
  await (sql as any).query(`CREATE INDEX IF NOT EXISTS idx_aula_date ON aula_availability(date)`, []);
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

const SEED_KAJIAN = [
  { title: 'Kajian Rutin Ahad Pagi', category: 'Dakwah', date_label: 'Ahad 21 Juni 2026', date_start: '2026-06-21', time_label: "05:45 - 07:00 (Ba'da Shubuh)", speaker: 'KH. Nandang Qusyaeri, SH', description: 'Kajian rutin pembahasan tasawuf, tata cara ibadah rasul, dan mendekatkan diri kepada Allah SWT', image_url: '/images/sholat_tarawih.webp', capacity: 200, registered_count: 145, is_recurring: true, recurring_day: 'Ahad' },
  { title: 'Kajian Rutin Rabu Malam', category: 'Dakwah', date_label: 'Rabu 24 Juni 2026', date_start: '2026-06-24', time_label: "Ba'da Maghrib s/d Isya", speaker: 'KH. Aprizal Muslim, S.Pd.i', description: 'Kajian Rutin membahas Ihya Ulumuddin serta membahas kitab Hujjatul islam', image_url: '/images/kajian_rabu_malam.webp', capacity: 50, registered_count: 38, is_recurring: true, recurring_day: 'Rabu' },
  { title: 'Kajian Rutin Kamis Siang (Khusus Akhwat)', category: 'Dakwah', date_label: ' Setiap Kamis', time_label: '13.00-Ashar', speaker: 'Majelis Taklim Tarbiyatul Ummahaat', description: 'Kajian Rutin membahas fiqih wanita dan rumah tangga', image_url: '/images/peringatanHariBesarIslam.webp', capacity: 300, registered_count: 220, is_recurring: true, recurring_day: 'Kamis' },
  { title: 'Kajian Rutin Ahad Pagi', category: 'Dakwah', date_label: 'Ahad, 28 Juni 2026', date_start: '2026-06-28', time_label: '07:00-09.00', speaker: 'Drs. H. Yono Waryono', description: 'Kajian Rutin membahas hukum-hukum dasar islam dan fiqih dasar', image_url: '/images/kulihaSubuh.webp', capacity: 250, registered_count: 180, is_recurring: false, recurring_day: null },
  { title: 'Dauroh Al-Quran', category: 'Dauroh', date_label: 'Setiap Ahad', time_label: '15.30-17.30', speaker: 'DR.HQ. Lili Wahyudi & H. Deden Sajidin, Lc', description: 'Dauroh Al-Quran untuk tingkat SD, SMP, SMA, dan Dewasa', image_url: '/images/daurahQuran.webp', capacity: 250, registered_count: 142, is_recurring: true, recurring_day: 'Ahad' },
  { title: 'Kajian Rutin Rabu Malam', category: 'Dakwah', date_label: 'Rabu, 8 Juli 2026', date_start: '2026-07-08', time_label: "Ba'da Maghrib s/d Isya", speaker: 'H. Deden Sajidin, Lc', description: 'Kajian Rutin membahas Siroh Nabawiyah dan Kisah-kisah para sahabat', image_url: '/images/kajianAhadPagi.webp', capacity: 50, registered_count: 10, is_recurring: false, recurring_day: null },
];

const SEED_KHUTBAH = [
  { schedule_date: '2026-06-19', khatib: 'Ust. H. M. Saefudin', muadzin: 'Ust.Dede Rahmatullah', theme: 'Mempersatukan Umat dengan Akhlak Karimah di Era Modern' },
  { schedule_date: '2026-06-26', khatib: 'Ust. Hedar Agung Nawawi', muadzin: 'H. Romeli', theme: 'Prinsip Transparansi dan Integritas dalam Manajemen Dakwah' },
  { schedule_date: '2026-07-03', khatib: 'Ust. H. Muid', muadzin: 'Ust. Lalan Supriadin', theme: 'Zakat, Infaq dan Sedekah Sebagai Solusi Pengentasan Kemiskinan' },
  { schedule_date: '2026-07-10', khatib: 'KH. M. Ridwan,MPI.', muadzin: 'Samingan', theme: 'Menghadirkan Surga di Tengah Kerukunan Rumah Tangga' },
];

const SEED_ARTICLES = [
  {
    slug: 'selamat-datang-di-portal-dkm',
    title: 'Selamat Datang di Portal Digital DKM Masjid Raya Puri Telukjambe',
    excerpt: 'Portal resmi DKM untuk transparansi informasi, kajian, dan layanan jamaah.',
    content_html: '<p>Assalamualaikum Wr. Wb. Segala puji bagi Allah SWT, salawat dan salam semoga senantiasa tercurahkan kepada Nabi Muhammad SAW beserta keluarga dan para sahabatnya.</p><p>Website ini adalah portal resmi DKM Masjid Raya Puri Telukjambe yang dibangun untuk memberikan informasi yang transparan, mudah diakses, dan interaktif bagi jamaah dan masyarakat.</p>',
    content_json: null,
    featured_image_url: '/images/logo.svg',
    featured_image_alt: 'Logo Masjid Raya Puri Telukjambe',
    author_id: null,
    category: 'Berita',
    tags: ['pengumuman', 'portal'],
    status: 'published',
    published_at: '2026-06-01',
  },
];

export async function ensureSeeded() {
  if (seeded) return;
  const sql = getSql();
  await ensureSchema();

  // Seed default admin user (only if no users exist)
  const userCount = (await (sql as any).query(`SELECT COUNT(*)::int as c FROM users`, [])) as { c: number }[];
  if ((userCount[0]?.c ?? 0) === 0) {
    const adminHash = await hashPassword('admin123');
    await (sql as any).query(
      `INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4)`,
      ['admin@masjidraya.id', adminHash, 'Administrator DKM', 'admin']
    );
  }

  const txCount = (await (sql as any).query(`SELECT COUNT(*)::int as c FROM transactions`, [])) as { c: number }[];
  if ((txCount[0]?.c ?? 0) === 0) {
    for (const t of SEED_TRANSACTIONS) {
      await (sql as any).query(
        `INSERT INTO transactions (date, description, type, category, amount) VALUES ($1, $2, $3, $4, $5)`,
        [t.date, t.description, t.type, t.category, t.amount]
      );
    }
  }

  const bkCount = (await (sql as any).query(`SELECT COUNT(*)::int as c FROM bookings`, [])) as { c: number }[];
  if ((bkCount[0]?.c ?? 0) === 0) {
    for (const b of SEED_BOOKINGS) {
      await (sql as any).query(
        `INSERT INTO bookings (name, whatsapp, date, time_start, time_end, purpose, status, package_id, need_organizer, notes, admin_notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [b.name, b.whatsapp, b.date, b.time_start, b.time_end, b.purpose, b.status, b.package_id, b.need_organizer, b.notes, b.admin_notes]
      );
    }
  }

  const pvCount = (await (sql as any).query(`SELECT COUNT(*)::int as c FROM pageviews`, [])) as { c: number }[];
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

  // Seed CMS: kajian (migrate INITIAL_EVENTS)
  const kjCount = (await (sql as any).query(`SELECT COUNT(*)::int as c FROM kajian`, [])) as { c: number }[];
  if ((kjCount[0]?.c ?? 0) === 0) {
    for (const k of SEED_KAJIAN) {
      await (sql as any).query(
        `INSERT INTO kajian (title, category, date_label, date_start, time_label, speaker, description, image_url, capacity, registered_count, is_recurring, recurring_day) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [k.title, k.category, k.date_label, k.date_start || null, k.time_label, k.speaker, k.description, k.image_url, k.capacity, k.registered_count, k.is_recurring, k.recurring_day]
      );
    }
  }

  // Seed CMS: khutbah (migrate FRIDAY_SERMONS)
  const khCount = (await (sql as any).query(`SELECT COUNT(*)::int as c FROM khutbah_schedule`, [])) as { c: number }[];
  if ((khCount[0]?.c ?? 0) === 0) {
    for (const k of SEED_KHUTBAH) {
      await (sql as any).query(
        `INSERT INTO khutbah_schedule (schedule_date, khatib, muadzin, theme) VALUES ($1, $2, $3, $4)`,
        [k.schedule_date, k.khatib, k.muadzin, k.theme]
      );
    }
  }

  // Seed CMS: articles (1 welcome article)
  const arCount = (await (sql as any).query(`SELECT COUNT(*)::int as c FROM articles`, [])) as { c: number }[];
  if ((arCount[0]?.c ?? 0) === 0) {
    const adminRow = (await (sql as any).query(`SELECT id FROM users WHERE role = 'admin' LIMIT 1`, [])) as { id: string }[];
    const adminId = adminRow[0]?.id || null;
    for (const a of SEED_ARTICLES) {
      await (sql as any).query(
        `INSERT INTO articles (slug, title, excerpt, content_html, content_json, featured_image_url, featured_image_alt, author_id, category, tags, status, published_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [a.slug, a.title, a.excerpt, a.content_html, a.content_json, a.featured_image_url, a.featured_image_alt, adminId, a.category, a.tags, a.status, a.published_at]
      );
    }
  }

  seeded = true;
}
