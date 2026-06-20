import { EventActivity, FinanceRecord, FridaySermon, BookingPackage } from './types';

// Upcoming Mosque activities
export const INITIAL_EVENTS: EventActivity[] = [
  {
    id: 'evt-1',
    title: 'Kajian Rutin Ahad Pagi',
    category: 'Dakwah',
    date: 'Setiap Ahad',
    time: '05:45 - 07:00 (Ba\'da Shubuh)',
    speaker: 'Ustadz DR. Khalid Basalamah, MA',
    location: 'Ruang Utama Masjid Raya Puri Telukjambe',
    description: 'Kajian rutin pembahasan kitab akidah dengan tema utama tauhid, manhaj, dan fiqih ibadah.',
    image: '/src/assets/images/kajianAhadPagi.webp',
    capacity: 200,
    registeredCount: 145,
  },
  {
    id: 'evt-2',
    title: 'Dauroh Quran: Lebih dekat bersama Al-Quran',
    category: 'Dakwah',
    date: 'Setiap Selasa & Kamis',
    time: '20:00 - 21:30 (Ba\'da Isya)',
    speaker: 'Syaikh Abdul Aziz Al-Bukhari',
    location: 'Ruang Utama Masjid Raya Puri Telukjambe',
    description: 'Perbaikan bacaan Al-Quran, pembetulan makhraj huruf, serta pemahaman kaidah-kaidah ilmu tajwid.',
    image: '/src/assets/images/daurahQuran.webp',
    capacity: 50,
    registeredCount: 38,
  },
  {
    id: 'evt-3',
    title: 'Kuliah Shubuh',
    category: 'Dakwah',
    date: ' Setiap Senin - Kamis',
    time: '15.00-17.00 Ahad Sore',
    speaker: 'Ustadz Hanan Attaki, Lc',
    location: 'Ruang Utama Masjid Raya Puri Telukjambe',
    description: 'Mendapatkan spirit keimanan dan siraman rohani untuk mengawali hari dengan penuh semangat dan kebaikan.',
    image: '/src/assets/images/kulihaSubuh.webp',
    capacity: 300,
    registeredCount: 220,
  },
  {
    id: 'evt-4',
    title: 'Santunan Bulanan Anak Yatim Piatu',
    category: 'Sosial',
    date: ' Rabu, 13 Juni 2026',
    time: '09:00 - 11:30 (Pagi)',
    speaker: 'Panitia DKM',
    location: 'Aula Serbaguna Masjid Raya Puri Telukjambe',
    description: 'Pemberian sembako dan santunan tunai kepada 100 anak yatim piatu.',
    image: '/src/assets/images/santunanBlnn.webp',
    capacity: 100,
    registeredCount: 92,
  },
  {
    id: 'evt-5',
    title: 'Kegiatan Donor Darah Rutin Bersama PMI',
    category: 'Sosial',
    date: 'Minggu, 20 Juni 2026',
    time: '08.00-12.00',
    speaker: 'Panitia DKM & PMI',
    location: 'Serambi Kiri Masjid Raya Puri Telukjambe',
    description: 'Donor Darah adalah kegiatan rutin yang diadakan setiap 3 bulan sekali.',
    image: '/src/assets/images/social-donor.webp',
    capacity: 100,
    registeredCount: 142,
  },
  {
    id: 'evt-6',
    title: 'Peringatan Tahun Baru Islam 1 Muharram 1448 H',
    category: 'Dakwah',
    date: 'Minggu, 28 Juni 2026',
    time: '07:30 - 12:00',
    speaker: 'Seksi Kemasyarakatan DKM',
    location: 'Serambi Depan & Ruang Utama Masjid',
    description: 'Peringatan Tahun Baru Islam 1 Muharram 1448 H.',
    image: '/src/assets/images/peringatanHariBesarIslam.webp',
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
    date: 'Jumat, 19 Juni 2026',
    khatib: 'Ust. H. M. Saefudin',
    muadzin: 'Ust.Dede Rahmatullah',
    theme: 'Mempersatukan Umat dengan Akhlak Karimah di Era Modern',
  },
  {
    id: 'sermon-2',
    date: 'Jumat, 26 Juni 2026',
    khatib: 'Ust. Hedar Agung Nawawi',
    muadzin: 'H. Romeli',
    theme: 'Prinsip Transparansi dan Integritas dalam Manajemen Dakwah',
  },
  {
    id: 'sermon-3',
    date: 'Jumat, 03 Juli 2026',
    khatib: 'Ust. H. Muid',
    muadzin: 'Ust. Lalan Supriadin',
    theme: 'Zakat, Infaq dan Sedekah Sebagai Solusi Pengentasan Kemiskinan',
  },
  {
    id: 'sermon-4',
    date: 'Jumat, 10 Juli 2026',
    khatib: 'KH. M. Ridwan,MPI.',
    muadzin: 'Samingan',
    theme: 'Menghadirkan Surga di Tengah Kerukunan Rumah Tangga',
  }
];

// Multipurpose Building Rental Specifications
export const HALL_INFO = {
  name: 'Aula Serbaguna Masjid Raya Puri Telukjambe',
  dimensions: '25 X 25 M2',
  capacity: '200-300 ORANG, SESUAI KONDISI DEKORASI',
  facilities: [
    'Seluruh ruang ber AC',
    'Back up PLN dengan Genseet 85 KVa',
    'Parkir Luas',
    'Toilet pria dan Wanita',
    '100 unit kursi tanpa cover',
    'Tenaga Satpam dan Parkir',
    'Tenaga Kebersihan',
    'Parkir luas',
    'Ruang cuci perabot/piring'
  ]
};

// Multipurpose Hall Rental Packages
export const BOOKING_PACKAGES: BookingPackage[] = [
  {
    id: 'pkg-weekend',
    name: 'Weekend (Sabtu/Ahad)',
    price: 'Rp 9.000.000',
    features: [
      'Seluruh ruang ber AC',
      'Back up PLN dengan Genseet 85 KVa',
      'Parkir Luas',
      'Toilet pria dan Wanita',
      '100 unit kursi tanpa cover',
      'Tenaga Satpam dan Parkir',
      'Tenaga Kebersihan',
      'Parkir luas',
      'Ruang cuci perabot/piring'
    ],
    isPopular: false
  },
  {
    id: 'pkg-weekdays',
    name: 'Weekdays (Senin-Jumat)',
    price: 'Rp 8.000.000',
    features: [
      'Seluruh ruang ber AC',
      'Back up PLN dengan Genseet 85 KVa',
      'Parkir Luas',
      'Toilet pria dan Wanita',
      '100 unit kursi tanpa cover',
      'Tenaga Satpam dan Parkir',
      'Tenaga Kebersihan',
      'Parkir luas',
      'Ruang cuci perabot/piring'
    ],
    isPopular: true
  },
  // {
  //   id: 'pkg-rahmah',
  //   name: 'Paket Rahmah (Full Event Organizer & Catering)',
  //   price: 'Rp 22.500.000',
  //   features: [
  //     'Semua fasilitas Paket Mawaddah',
  //     'Tambahan sewa s/d 8 jam penuh',
  //     'Pelaminan pernikahan syari modern & rias pengantin lengkap',
  //     'Red carpet & set meja akad nikah',
  //     'Tambahan daya listrik s/d 15.000 Watt',
  //     'Tim penata acara (Event Coordinator) 4 orang',
  //     'Voucher katering rekanan pilihan diskon 15%',
  //   ],
  //   isPopular: false
  // }
];

// Activity Gallery Content
export const GALLERY_PHOTOS = [
  {
    id: 'g-1',
    src: '/src/assets/images/dauroh_alquran_2.webp',
    caption: 'Dauroh Al-Quran',
  },
  {
    id: 'g-2',
    src: '/src/assets/images/bukber_ramadhan.webp',
    caption: 'Buka Puasa Bersama Ramadhan',
  },
  {
    id: 'g-3',
    src: '/src/assets/images/idul_adha.webp',
    caption: 'Penerimaan Hewan Qurban Idul Adha',
  },
  {
    id: 'g-4',
    src: '/src/assets/images/mabit_bareng_tahun_baru.webp',
    caption: 'Malam Bina Iman (Mabit) Bareng Tahun Baru',
  },
  {
    id: 'g-5',
    src: '/src/assets/images/santunan_anak_yatim.webp',
    caption: 'Santunan Anak Yatim Piatu dan Dhuafa',
  },
  {
    id: 'g-6',
    src: '/src/assets/images/sholat_tarawih.webp',
    caption: 'Sholat Tarawih Berjamaah di Bulan Suci Ramadhan',
  }
];
