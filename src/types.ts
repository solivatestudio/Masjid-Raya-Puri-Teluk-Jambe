export interface EventActivity {
  id: string;
  title: string;
  category: 'Dakwah' | 'Sosial';
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
  imam: string;
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
