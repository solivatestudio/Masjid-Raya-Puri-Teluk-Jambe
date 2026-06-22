import { EventActivity, FinanceRecord, FridaySermon, BookingPackage } from './types';

// Upcoming Mosque activities
export const INITIAL_EVENTS: EventActivity[] = [
  {
    id: 'evt-1',
    title: 'Kajian Rutin Ahad Pagi',
    category: 'Dakwah',
    date: 'Ahad 21 Juni 2026',
    time: '05:45 - 07:00 (Ba\'da Shubuh)',
    speaker: 'KH. Nandang Qusyaeri, SH',
    location: 'Ruang Utama Masjid Raya Puri Telukjambe',
    description: 'Kajian rutin pembahasan tasawuf, tata cara ibadah rasul, dan mendekatkan diri kepada Allah SWT',
    image: '/images/sholat_tarawih.webp',
    capacity: 200,
    registeredCount: 145,
  },
  {
    id: 'evt-2',
    title: 'Kajian Rutin Rabu Malam',
    category: 'Dakwah',
    date: 'Rabu 24 Juni 2026',
    time: 'Ba\'da Maghrib s/d Isya',
    speaker: 'KH. Aprizal Muslim, S.Pd.i',
    location: 'Ruang Utama Masjid Raya Puri Telukjambe',
    description: 'Kajian Rutin membahas Ihya Ulumuddin serta membahas kitab Hujjatul islam',
    image: '/images/kajian_rabu_malam.webp',
    capacity: 50,
    registeredCount: 38,
  },
  {
    id: 'evt-3',
    title: 'Kajian Rutin Kamis Siang (Khusus Akhwat)',
    category: 'Dakwah',
    date: ' Setiap Kamis',
    time: '13.00-Ashar',
    speaker: 'Majelis Taklim Tarbiyatul Ummahaat',
    location: 'Ruang Utama Masjid Raya Puri Telukjambe',
    description: 'Kajian Rutin membahas fiqih wanita dan rumah tangga',
    image: '/images/peringatanHariBesarIslam.webp',
    capacity: 300,
    registeredCount: 220,
  },
  {
    id: 'evt-4',
    title: 'Kajian Rutin Ahad Pagi',
    category: 'Dakwah',
    date: 'Ahad, 28 Juni 2026',
    time: '07:00-09.00',
    speaker: 'Drs. H. Yono Waryono',
    location: 'Ruang Utama Masjid Raya Puri Telukjambe',
    description: 'Kajian Rutin membahas hukum-hukum dasar islam dan fiqih dasar',
    image: '/images/kulihaSubuh.webp',
    capacity: 250,
    registeredCount: 180,
  },
  {
    id: 'evt-5',
    title: 'Dauroh Al-Quran',
    category: 'Dauroh',
    date: 'Setiap Ahad',
    time: '15.30-17.30',
    speaker: 'DR.HQ. Lili Wahyudi & H. Deden Sajidin, Lc',
    location: 'Ruang Utama Masjid Raya Puri Telukjambe',
    description: 'Dauroh Al-Quran untuk tingkat SD, SMP, SMA, dan Dewasa',
    image: '/images/daurahQuran.webp',
    capacity: 250,
    registeredCount: 142,
  },
  {
    id: 'evt-6',
    title: 'Kajian Rutin Rabu Malam',
    category: 'Dakwah',
    date: 'Rabu, 8 Juli 2026',
    time: 'Ba\'da Maghrib s/d Isya',
    speaker: 'H. Deden Sajidin, Lc',
    location: 'Ruang Utama Masjid Raya Puri Telukjambe',
    description: 'Kajian Rutin membahas Siroh Nabawiyah dan Kisah-kisah para sahabat',
    image: '/images/kajianAhadPagi.webp',
    capacity: 50,
    registeredCount: 10,
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
    src: '/images/dauroh_alquran_2.webp',
    caption: 'Dauroh Al-Quran',
  },
  {
    id: 'g-2',
    src: '/images/bukber_ramadhan.webp',
    caption: 'Buka Puasa Bersama Ramadhan',
  },
  {
    id: 'g-3',
    src: '/images/idul_adha.webp',
    caption: 'Penerimaan Hewan Qurban Idul Adha',
  },
  {
    id: 'g-4',
    src: '/images/mabit_bareng_tahun_baru.webp',
    caption: 'Malam Bina Iman (Mabit) Bareng Tahun Baru',
  },
  {
    id: 'g-5',
    src: '/images/santunan_anak_yatim.webp',
    caption: 'Santunan Anak Yatim Piatu dan Dhuafa',
  },
  {
    id: 'g-6',
    src: '/images/sholat_tarawih.webp',
    caption: 'Sholat Tarawih Berjamaah di Bulan Suci Ramadhan',
  }
];
