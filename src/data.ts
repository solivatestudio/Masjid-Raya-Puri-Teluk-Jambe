import { EventActivity, FinanceRecord, FridaySermon, BookingPackage } from './types';

// Upcoming Mosque activities
export const INITIAL_EVENTS: EventActivity[] = [
  {
    id: 'evt-1',
    title: 'Kajian Rutin Riadush Shalihin',
    category: 'Dakwah',
    date: 'Setiap Ahad',
    time: '18:30 - 20:00 (Ba\'da Maghrib)',
    speaker: 'Ustadz DR. Khalid Basalamah, MA',
    location: 'Ruang Utama Masjid Al-Muttaqin',
    description: 'Bedah kitab hadits Riyadhus Shalihin dengan bahasan bab akhlak dan tata cara hidup islami harian.',
    image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=600',
    capacity: 200,
    registeredCount: 145,
  },
  {
    id: 'evt-2',
    title: 'Tahsin Al-Quran & Tajwid Dewasa',
    category: 'Dakwah',
    date: 'Setiap Selasa & Kamis',
    time: '20:00 - 21:30 (Ba\'da Isya)',
    speaker: 'Syaikh Abdul Aziz Al-Bukhari',
    location: 'Serambi Kiri Masjid Al-Muttaqin',
    description: 'Perbaikan bacaan Al-Quran, pembetulan makhraj huruf, serta pemahaman kaidah-kaidah ilmu tajwid.',
    image: 'https://images.unsplash.com/photo-1609599006353-e629f1d41139?auto=format&fit=crop&q=80&w=600',
    capacity: 50,
    registeredCount: 38,
  },
  {
    id: 'evt-3',
    title: 'Mabit Pemuda: Hijrah & Produktif',
    category: 'Dakwah',
    date: 'Sabtu, 14 Juni 2026',
    time: '20:00 - Selesai',
    speaker: 'Ustadz Hanan Attaki, Lc',
    location: 'Masjid Al-Muttaqin Kompleks',
    description: 'Malam bina iman dan takwa khusus pemuda, dilanjutkan dengan Qiyamul Lail dan subuh berjamaah.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600',
    capacity: 300,
    registeredCount: 220,
  },
  {
    id: 'evt-4',
    title: 'Santunan Akbar & Khitanan Massal',
    category: 'Sosial',
    date: 'Sabtu, 20 Juni 2026',
    time: '08:00 - 15:00',
    speaker: 'Panitia DKM & Tim Dokter Gigi',
    location: 'Multipurpose Aula Al-Muttaqin',
    description: 'Pemberian sembako dan santunan tunai kepada 100 anak yatim piatu, dilanjutkan program khitanan massal gratis.',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600',
    capacity: 100,
    registeredCount: 92,
  },
  {
    id: 'evt-5',
    title: 'Layanan Ambulans Masjid Gratis',
    category: 'Sosial',
    date: 'Siaga 24 Jam',
    time: 'Setiap Hari',
    speaker: 'Tim Siaga Masjid (0812-3456-7890)',
    location: 'Area Parkir Utama',
    description: 'Layanan armada ambulans siaga 24 jam gratis untuk rujukan rumah sakit maupun pengantaran jenazah bagi warga sekitar.',
    image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&q=80&w=600',
    capacity: 1000,
    registeredCount: 142,
  },
  {
    id: 'evt-6',
    title: 'Pasar Murah Ramah Rakyat',
    category: 'Sosial',
    date: 'Minggu, 28 Juni 2026',
    time: '07:30 - 12:00',
    speaker: 'Seksi Kemasyarakatan DKM',
    location: 'Lapangan Depan Masjid',
    description: 'Bazar sembako murah bersubsidi khusus untuk warga berpenghasilan rendah dan dhuafa di kelurahan sekitar masjid.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
    capacity: 500,
    registeredCount: 310,
  }
];

// Initial Financial Ledger Data
export const INITIAL_FINANCEDATA: FinanceRecord[] = [
  {
    id: 'fin-1',
    date: '2026-06-01',
    description: 'Infaq Kotak Amal Shalat Jumat',
    type: 'Pemasukan',
    category: 'Infaq Jumat',
    amount: 14280000,
  },
  {
    id: 'fin-2',
    date: '2026-06-02',
    description: 'Dana Kebersihan & Listrik Aula (Sewa)',
    type: 'Pemasukan',
    category: 'Penyewaan Aula',
    amount: 7500000,
  },
  {
    id: 'fin-3',
    date: '2026-06-02',
    description: 'Tagihan Listrik PLN & Air PAM Mei',
    type: 'Pengeluaran',
    category: 'Operasional',
    amount: 5400000,
  },
  {
    id: 'fin-4',
    date: '2026-06-03',
    description: 'Donasi QRIS Pembangunan Kanopi',
    type: 'Pemasukan',
    category: 'Wakaf Pembangunan',
    amount: 8500000,
  },
  {
    id: 'fin-5',
    date: '2026-06-03',
    description: 'Sembako Program Santunan Dhuafa',
    type: 'Pengeluaran',
    category: 'SosialKemasyarakatan',
    amount: 6200000,
  },
  {
    id: 'fin-6',
    date: '2026-06-04',
    description: 'Infaq Harian Jamaah Masjid',
    type: 'Pemasukan',
    category: 'Infaq Umum',
    amount: 3250000,
  },
  {
    id: 'fin-7',
    date: '2026-06-04',
    description: 'Honor Mukim Muadzin & Petugas Kebersihan',
    type: 'Pengeluaran',
    category: 'Operasional',
    amount: 4500000,
  }
];

// Friday Sermon (Khatib/Imam) Schedule
export const FRIDAY_SERMONS: FridaySermon[] = [
  {
    id: 'sermon-1',
    date: 'Jumat, 05 Juni 2026',
    khatib: 'Prof. Syaikh Dr. Said Aqil Al-Munawar, Lc, MA',
    imam: 'Ustadz H. Salim Ghazali, S.Q (Hafiz)',
    theme: 'Mempersatukan Umat dengan Akhlak Karimah di Era Modern',
  },
  {
    id: 'sermon-2',
    date: 'Jumat, 12 Juni 2026',
    khatib: 'KH. Dr. Muhammad Cholil Nafis, MA',
    imam: 'Ustadz H. Salim Ghazali, S.Q (Hafiz)',
    theme: 'Prinsip Transparansi dan Integritas dalam Manajemen Dakwah',
  },
  {
    id: 'sermon-3',
    date: 'Jumat, 19 Juni 2026',
    khatib: 'Ustadz Dr. Adi Hidayat, Lc, MA',
    imam: 'Syaikh Abdurrahman Al-Ausy',
    theme: 'Zakat, Infaq dan Sedekah Sebagai Solusi Pengentasan Kemiskinan',
  },
  {
    id: 'sermon-4',
    date: 'Jumat, 26 Juni 2026',
    khatib: 'KH. Bahauddin Nursalim (Gus Baha)',
    imam: 'Ustadz H. Ahmad Syarif, M.Ag',
    theme: 'Menghadirkan Surga di Tengah Kerukunan Rumah Tangga',
  }
];

// Multipurpose Building Rental Specifications
export const HALL_INFO = {
  name: 'Aula Serbaguna Al-Muttaqin',
  dimensions: '18m x 25m (450 meter persegi)',
  capacity: 'Sampai 600 tamu duduk / 800 tamu berdiri',
  facilities: [
    'Pendingin Ruangan (Central AC & Standing AC)',
    'Sound System High-Definition 3000 Watt',
    'Panggung Pelaminan / Utama (12m x 3m)',
    'Ruang Rias Pengantin / VIP ber-AC (2 Unit)',
    'Kursi Banquet Futura (300 unit dengan Cover)',
    'Dapur Katering bersih, Tempat Cuci Piring',
    'Parkir Luas (Kapasitas hingga 60 mobil & 150 motor)',
    'Akses Kursi Roda dan Toilet Terpisah Sesuai Syariah',
  ]
};

// Multipurpose Hall Rental Packages
export const BOOKING_PACKAGES: BookingPackage[] = [
  {
    id: 'pkg-sakinah',
    name: 'Paket Sakinah (Semi-Wedding / Seminar)',
    price: 'Rp 6.500.000',
    features: [
      'Gedung Full AC selama 4 Jam',
      'Kursi Futura 150 unit tanpa cover',
      'Sound system basic (2 wireless mic, 1 mixer)',
      'Listrik gedung standar (max 5.000 Watt)',
      'Ruang rias ber-AC (1 unit)',
      'Petugas parkir & kebersihan standar',
    ],
    isPopular: false
  },
  {
    id: 'pkg-mawaddah',
    name: 'Paket Mawaddah (Wedding Hebat / Akbar)',
    price: 'Rp 11.500.000',
    features: [
      'Sewa Gedung Full AC selama 6 Jam',
      'Kursi Futura 300 unit + cover premium',
      'Professional sound system (4 wireless mic, 2 standing speakers)',
      'Listrik gedung ditingkatkan (hingga 10.000 Watt)',
      'Ruang rias ber-AC (2 unit VIP)',
      'Panggung utama & mini garden dekorasi basic',
      'Kebersihan, parkir terpadu, & izin keramaian kelurahan',
    ],
    isPopular: true
  },
  {
    id: 'pkg-rahmah',
    name: 'Paket Rahmah (Full Event Organizer & Catering)',
    price: 'Rp 22.500.000',
    features: [
      'Semua fasilitas Paket Mawaddah',
      'Tambahan sewa s/d 8 jam penuh',
      'Pelaminan pernikahan syari modern & rias pengantin lengkap',
      'Red carpet & set meja akad nikah',
      'Tambahan daya listrik s/d 15.000 Watt',
      'Tim penata acara (Event Coordinator) 4 orang',
      'Voucher katering rekanan pilihan diskon 15%',
    ],
    isPopular: false
  }
];

// Activity Gallery Content
export const GALLERY_PHOTOS = [
  {
    id: 'g-1',
    src: 'https://images.unsplash.com/photo-1594144400612-31047b34ec00?auto=format&fit=crop&q=80&w=600',
    caption: 'Kajian Akbar Ramadhan Bersama Pemuda Hijrah',
  },
  {
    id: 'g-2',
    src: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
    caption: 'Pembagian Sembako Murah Santunan Idul Fitri',
  },
  {
    id: 'g-3',
    src: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=600',
    caption: 'Materi Belajar Baca Quran Kelas Tahsin Dewasa',
  },
  {
    id: 'g-4',
    src: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=600',
    caption: 'Gotong Royong Kebersihan Lingkungan Sekitar Masjid',
  },
  {
    id: 'g-5',
    src: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600',
    caption: 'Kajian Subuh Berjamaah & Kajian Parenting Islami',
  },
  {
    id: 'g-6',
    src: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600',
    caption: 'Program Sunatan Massal Gratis untuk Anak Yatim',
  }
];
