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
  payment_proof_url: string | null;
  payment_proof_uploaded_at: string | null;
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

// ── CMS Types ──

export type UserRole = 'admin' | 'editor';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar_url: string | null;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
}

export type ArticleStatus = 'draft' | 'published' | 'scheduled';
export type ArticleCategory = 'Dakwah' | 'Berita' | 'Opini' | 'Lainnya';

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content_html: string;
  content_json: any;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  author_id: string | null;
  author_name?: string | null;
  category: ArticleCategory | null;
  tags: string[] | null;
  status: ArticleStatus;
  scheduled_at: string | null;
  published_at: string | null;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export interface KajianItem {
  id: string;
  title: string;
  category: 'Dakwah' | 'Dauroh';
  date_label: string;
  date_start: string | null;
  time_label: string;
  speaker: string | null;
  location: string;
  description: string | null;
  image_url: string | null;
  capacity: number | null;
  registered_count: number;
  is_recurring: boolean;
  recurring_day: string | null;
  pic_id: string | null;
  pic_name?: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface KhutbahItem {
  id: string;
  schedule_date: string;
  khatib: string;
  muadzin: string | null;
  theme: string | null;
  pic_id: string | null;
  pic_name?: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AulaAvailability {
  id: string;
  date: string;
  time_start: string;
  time_end: string;
  is_available: boolean;
  block_reason: string | null;
  pic_id: string | null;
  pic_name?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CmsSession {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  exp: number;
}
