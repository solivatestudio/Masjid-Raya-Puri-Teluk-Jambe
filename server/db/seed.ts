import sql from './pool';

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
  { name: 'H. Ahmad Fauzi', whatsapp: '081234567890', date: '2026-07-20', time_start: '08:00', time_end: '14:00', purpose: 'Walimah Pernikahan Putra', status: 'approved', package_id: 'pkg-weekend', need_organizer: false, notes: 'Akad jam 8, resepsi jam 10' },
  { name: 'Ibu Siti Rahmawati', whatsapp: '087812345678', date: '2026-07-25', time_start: '09:00', time_end: '12:00', purpose: 'Aqiqah & Syukuran', status: 'pending', package_id: 'pkg-weekdays', need_organizer: false, notes: '' },
  { name: 'Yayasan Al-Hidayah', whatsapp: '082198765432', date: '2026-08-01', time_start: '07:00', time_end: '17:00', purpose: 'Seminar Pendidikan Islam', status: 'pending', package_id: 'pkg-weekend', need_organizer: true, notes: 'Butuh sound system & panggung' },
  { name: 'Bapak Deden S.', whatsapp: '085612345678', date: '2026-07-15', time_start: '10:00', time_end: '15:00', purpose: 'Rapat Koordinasi RW', status: 'rejected', package_id: 'pkg-weekdays', need_organizer: false, notes: '', admin_notes: 'Bentrok dengan jadwal Dauroh Al-Quran' },
];

const SEED_PATHS = ['/', '/#kegiatan', '/#khutbah', '/#donasi', '/#galeri', '/#audio-visual-hall'];
const SEED_REFERRERS = ['', 'https://www.google.com', 'https://instagram.com/masjidrayapuritelukjambe', 'https://web.facebook.com'];

export async function seedDatabase() {
  try {
    const countResult = await sql.query(`SELECT COUNT(*)::int as count FROM transactions`, []);
    const count = (countResult.rows || countResult)[0]?.count || 0;
    if (count > 0) {
      console.log('Database already seeded, skipping...');
      return;
    }

    console.log('Seeding database...');

    for (const t of SEED_TRANSACTIONS) {
      await sql.query(`
        INSERT INTO transactions (date, description, type, category, amount)
        VALUES ($1, $2, $3, $4, $5)
      `, [t.date, t.description, t.type, t.category, t.amount]);
    }
    console.log(`Seeded ${SEED_TRANSACTIONS.length} transactions`);

    for (const b of SEED_BOOKINGS) {
      await sql.query(`
        INSERT INTO bookings (name, whatsapp, date, time_start, time_end, purpose, status, package_id, need_organizer, notes, admin_notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [b.name, b.whatsapp, b.date, b.time_start, b.time_end, b.purpose, b.status, b.package_id, b.need_organizer, b.notes, b.admin_notes || '']);
    }
    console.log(`Seeded ${SEED_BOOKINGS.length} bookings`);

    const now = new Date();
    let pageviewCount = 0;
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

        await sql.query(`
          INSERT INTO pageviews (path, referrer, timestamp)
          VALUES ($1, $2, $3)
        `, [path, referrer, timestamp.toISOString()]);
        pageviewCount++;
      }
    }
    console.log(`Seeded ${pageviewCount} pageviews`);

    console.log('Database seeding complete!');
  } catch (error) {
    console.error('Seed error:', error);
    throw error;
  }
}
