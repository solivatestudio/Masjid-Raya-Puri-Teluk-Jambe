export interface EventActivity {
  id: string;
  title: string;
  category: 'Dakwah' | 'Dauroh';
  date: string;
  time: string;
  speaker?: string;
  location: string;
  description: string;
  image: string;
  capacity?: number;
  registeredCount: number;
}

export interface FinanceRecord {
  id: string;
  date: string;
  description: string;
  type: 'Pemasukan' | 'Pengeluaran';
  category: string;
  amount: number;
}

export interface FridaySermon {
  id: string;
  date: string;
  khatib: string;
  muadzin: string;
  theme: string;
}

export interface BookingPackage {
  id: string;
  name: string;
  price: string;
  features: string[];
  isPopular?: boolean;
}

export interface BookingRequest {
  name: string;
  whatsapp: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  purpose: string;
  packageId: string;
  needOrganizer: boolean;
  notes: string;
}

export interface PrayerTime {
  name: string;
  time: string;
  isPassed: boolean;
}

export interface BookingRecord {
  id: string;
  name: string;
  whatsapp: string;
  date: string;
  time_start: string;
  time_end: string;
  purpose: string;
  package_id?: string;
  need_organizer: boolean;
  notes: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionSummary {
  saldo: number;
  totalPemasukan: number;
  totalPengeluaran: number;
  pemasukanBulanIni: number;
  pengeluaranBulanIni: number;
  selisihBulanIni: number;
}

export interface MonthlyTransaction {
  month: string;
  pemasukan: number;
  pengeluaran: number;
}

export interface BookingSummary {
  totalPending: number;
  totalApprovedThisMonth: number;
  nearestBooking: { date: string; name: string; purpose: string } | null;
}

export interface PageviewSummary {
  total7Days: number;
  uniqueVisitors: number;
  activeVisitors: number;
  topPages: { path: string; views: number; percentage: number }[];
  referrers: { source: string; views: number }[];
  daily7Days: { date: string; views: number }[];
  recentVisits: { id: string; path: string; referrer: string; timestamp: string; userAgent: string }[];
}
