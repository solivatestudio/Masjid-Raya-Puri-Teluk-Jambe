import 'server-only';
import { getPublicKajian, getPublicKhutbah } from '@/lib/public-api';
import LandingPageClient from './LandingPageClient';

export const revalidate = 300;

export default async function LandingPage() {
  let kajian: any[] = [];
  let khutbah: any[] = [];
  try {
    [kajian, khutbah] = await Promise.all([getPublicKajian(), getPublicKhutbah(4)]);
  } catch (e) {
    // fallback ke array kosong jika DB belum ready
  }

  const events = kajian.map((k) => ({
    id: k.id,
    title: k.title,
    category: k.category,
    date: k.date_label,
    time: k.time_label,
    speaker: k.speaker,
    location: k.location,
    description: k.description || '',
    image: k.image_url || '/images/sholat_tarawih.webp',
    capacity: k.capacity,
    registeredCount: k.registered_count,
  }));

  const sermons = khutbah.map((s) => {
    const d = new Date(s.schedule_date);
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const formatted = `${days[d.getUTCDay()]}, ${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
    return {
      id: s.id,
      date: formatted,
      khatib: s.khatib,
      muadzin: s.muadzin || '',
      theme: s.theme || '',
    };
  });

  return <LandingPageClient events={events} sermons={sermons} />;
}
