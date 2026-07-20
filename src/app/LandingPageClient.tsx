'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import PrayerTimes from '@/components/PrayerTimes';
import EventSection from '@/components/EventSection';
import FridaySermonSection from '@/components/FridaySermonSection';
import BookingSection from '@/components/BookingSection';
import DonationSection from '@/components/DonationSection';
import FinanceTransparencySection from '@/components/FinanceTransparencySection';
import GallerySection from '@/components/GallerySection';
import PageviewTracker from '@/components/PageviewTracker';
import { Menu, X, Phone, Mail, MapPin, Heart, ChevronUp, Share2, Instagram, Facebook, Youtube, MessageCircle } from 'lucide-react';
import type { EventActivity, FridaySermon } from '@/types';

interface Props {
  events: EventActivity[];
  sermons: FridaySermon[];
}

function LandingContent({ events, sermons }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [liveEvents, setLiveEvents] = useState<EventActivity[]>(events);
  const [liveSermons, setLiveSermons] = useState<FridaySermon[]>(sermons);

  const finalEvents = liveEvents;
  const finalSermons = liveSermons;

  useEffect(() => {
    setLiveEvents(events);
  }, [events]);

  useEffect(() => {
    setLiveSermons(sermons);
  }, [sermons]);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let active = true;
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    const formatKhutbahDate = (value: string) => {
      const d = new Date(value);
      return `${days[d.getUTCDay()]}, ${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
    };

    const refreshPublicData = async () => {
      try {
        const [kajianRes, khutbahRes] = await Promise.all([
          fetch('/api/public/kajian', { cache: 'no-store' }),
          fetch('/api/public/khutbah?limit=4', { cache: 'no-store' }),
        ]);
        if (!kajianRes.ok || !khutbahRes.ok) return;
        const [kajianRows, khutbahRows] = await Promise.all([kajianRes.json(), khutbahRes.json()]);
        if (!active) return;
        setLiveEvents(kajianRows.map((k: any) => ({
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
        })));
        setLiveSermons(khutbahRows.map((s: any) => ({
          id: s.id,
          date: formatKhutbahDate(s.schedule_date),
          khatib: s.khatib,
          muadzin: s.muadzin || '',
          theme: s.theme || '',
        })));
      } catch {
        // Keep the last good payload on transient network/database errors.
      }
    };

    refreshPublicData();
    const interval = window.setInterval(refreshPublicData, 15000);
    window.addEventListener('focus', refreshPublicData);
    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener('focus', refreshPublicData);
    };
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Masjid Raya Puri Telukjambe',
        text: 'Portal DKM Transparansi Kas, Jadwal Syiar Dakwah, Donasi QRIS & Booking Aula Serbaguna Masjid Raya Puri Telukjambe.',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => alert('Tautan website berhasil dicopy ke clipboard!'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased">
      {showBackToTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-6 right-6 z-40 bg-amber-500 hover:bg-amber-600 text-emerald-950 p-3 rounded-full transition-all duration-300 shadow-xl cursor-pointer hover:scale-105 active:scale-95 flex items-center justify-center border border-amber-400" title="Kembali ke atas">
          <ChevronUp className="w-5 h-5 font-bold" />
        </button>
      )}

      <a href="https://wa.me/62895414283161?text=Assalamualaikum...%20Saya%20ingin%20bertanya%20seputar%20Masjid%20Raya%20Puri%20Telukjambe." target="_blank" rel="noopener noreferrer" className="fixed bottom-20 right-6 z-40 bg-[#25D366] hover:bg-[#128C7E] text-white p-3 rounded-full transition-all duration-300 shadow-xl cursor-pointer hover:scale-105 active:scale-95 flex items-center justify-center border border-[#128C7E]" title="Hubungi via WhatsApp">
        <MessageCircle className="w-5 h-5 font-bold" />
      </a>

      <div className="bg-emerald-900 border-b border-emerald-800 text-emerald-100 px-3 py-2 text-center text-[11px] sm:text-xs font-semibold relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-1.5">
          <span className="hidden sm:inline bg-amber-400 text-emerald-950 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest mr-1.5 animate-pulse">Pemberitahuan</span>
          <span className="min-w-0 truncate">Pendaftaran Kelas Tahsin Al-Quran Semester Ganjil 2026 dibuka.</span>
          <button onClick={() => scrollToSection('kegiatan')} className="shrink-0 underline hover:text-white font-bold cursor-pointer">
            Lihat Jadwal
          </button>
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-emerald-950/95 border-b border-emerald-900/70 backdrop-blur-sm text-white card-shadow">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 h-16 lg:h-[72px] flex items-center justify-between gap-3">
          <button onClick={() => scrollToSection('hero')} className="min-w-0 flex items-center gap-2.5 cursor-pointer group text-left">
            <img className="w-10 h-10 sm:w-12 sm:h-12 shrink-0" src="/images/logo.svg" alt="logo" />
            <div className="min-w-0">
              <span className="block font-black text-sm sm:text-base text-white tracking-tight leading-tight truncate">Masjid Raya Puri Telukjambe</span>
              <span className="block text-[10px] text-emerald-300 font-bold uppercase tracking-wider mt-0.5 truncate">Portal Resmi DKM</span>
            </div>
          </button>

          <nav className="hidden xl:flex items-center gap-5" aria-label="Menu utama">
            <button onClick={() => scrollToSection('hero')} className="text-xs uppercase font-extrabold tracking-wider text-emerald-100 hover:text-amber-400 transition cursor-pointer">Beranda</button>
            <button onClick={() => scrollToSection('kegiatan')} className="text-xs uppercase font-extrabold tracking-wider text-emerald-100 hover:text-amber-400 transition cursor-pointer">Program Masjid</button>
            <button onClick={() => scrollToSection('khutbah')} className="text-xs uppercase font-extrabold tracking-wider text-emerald-100 hover:text-amber-400 transition cursor-pointer">Khatib Jumat</button>
            <button onClick={() => scrollToSection('audio-visual-hall')} className="text-xs uppercase font-extrabold tracking-wider text-emerald-100 hover:text-amber-400 transition cursor-pointer">Sewa Aula</button>
            <button onClick={() => scrollToSection('transparansi-keuangan')} className="text-xs uppercase font-extrabold tracking-wider text-emerald-100 hover:text-amber-400 transition cursor-pointer">Keuangan</button>
            <button onClick={() => scrollToSection('galeri')} className="text-xs uppercase font-extrabold tracking-wider text-emerald-100 hover:text-amber-400 transition cursor-pointer">Galeri</button>
            <Link href="/blog" className="text-xs uppercase font-extrabold tracking-wider text-emerald-100 hover:text-amber-400 transition cursor-pointer">Blog</Link>
          </nav>

          <div className="hidden xl:flex items-center gap-4">
            <div className="flex items-center gap-3 mr-2 border-r border-emerald-800 pr-5">
              <a href="https://instagram.com/masjidrayapuritelukjambe" target="_blank" rel="noopener noreferrer" className="text-emerald-200 hover:text-amber-400 transition hover:-translate-y-1" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://web.facebook.com/pages/Aula%20Masjid%20Raya%20Puri%20Teluk%20Jambe%20(PERURI)%20Karawang/732935826736923/" target="_blank" rel="noopener noreferrer" className="text-emerald-200 hover:text-amber-400 transition hover:-translate-y-1" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.youtube.com/@masjidrayapuritelukjambe_TV" target="_blank" rel="noopener noreferrer" className="text-emerald-200 hover:text-amber-400 transition hover:-translate-y-1" aria-label="YouTube">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
            <button onClick={handleShare} className="p-2 border border-emerald-800 bg-emerald-900/50 hover:bg-emerald-900 text-emerald-200 hover:text-white rounded-xl transition cursor-pointer" title="Bagikan Tautan Web">
              <Share2 className="w-4 h-4" />
            </button>
            <button onClick={() => scrollToSection('donasi')} className="bg-amber-400 hover:bg-amber-500 text-emerald-950 font-black text-xs px-5 py-2.5 rounded-xl transition cursor-pointer shadow-md flex items-center gap-1.5">
              <Heart className="w-4 h-4 fill-emerald-950" />
              <span>Donasi (QRIS)</span>
            </button>
          </div>

          <div className="flex xl:hidden items-center gap-2 shrink-0">
            <button onClick={() => scrollToSection('donasi')} className="hidden sm:inline-flex bg-amber-400 text-emerald-950 font-black text-xs px-3 py-2 rounded-lg shadow-sm">
              Donasi
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2.5 text-emerald-100 hover:text-white hover:bg-emerald-900 rounded-xl transition cursor-pointer border border-emerald-800" aria-expanded={mobileMenuOpen} aria-label="Buka menu">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-emerald-950/70 backdrop-blur-sm xl:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute left-3 right-3 top-[76px] rounded-2xl bg-emerald-950 border border-emerald-800 text-white shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-4 border-b border-emerald-900">
              <span className="font-extrabold text-xs tracking-widest text-amber-300 uppercase">Navigasi DKM</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-emerald-200 hover:text-white hover:bg-emerald-900 rounded-lg cursor-pointer" aria-label="Tutup menu">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-4">
              <button onClick={() => scrollToSection('hero')} className="text-left px-4 py-3 text-sm font-bold text-emerald-100 bg-emerald-900/50 hover:bg-emerald-900 rounded-xl">Beranda</button>
              <button onClick={() => scrollToSection('kegiatan')} className="text-left px-4 py-3 text-sm font-bold text-emerald-100 bg-emerald-900/50 hover:bg-emerald-900 rounded-xl">Program Dakwah</button>
              <button onClick={() => scrollToSection('khutbah')} className="text-left px-4 py-3 text-sm font-bold text-emerald-100 bg-emerald-900/50 hover:bg-emerald-900 rounded-xl">Khatib Jumat</button>
              <button onClick={() => scrollToSection('audio-visual-hall')} className="text-left px-4 py-3 text-sm font-bold text-emerald-100 bg-emerald-900/50 hover:bg-emerald-900 rounded-xl">Booking Aula</button>
              <button onClick={() => scrollToSection('transparansi-keuangan')} className="text-left px-4 py-3 text-sm font-bold text-emerald-100 bg-emerald-900/50 hover:bg-emerald-900 rounded-xl">Keuangan</button>
              <button onClick={() => scrollToSection('galeri')} className="text-left px-4 py-3 text-sm font-bold text-emerald-100 bg-emerald-900/50 hover:bg-emerald-900 rounded-xl">Galeri</button>
              <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="sm:col-span-2 text-left px-4 py-3 text-sm font-bold text-emerald-100 bg-emerald-900/50 hover:bg-emerald-900 rounded-xl">Blog & Artikel</Link>
            </div>
            <div className="p-4 pt-0 grid grid-cols-2 gap-2">
              <button onClick={() => scrollToSection('donasi')} className="bg-amber-400 text-emerald-950 font-black py-3 rounded-xl text-center text-xs flex items-center justify-center gap-1.5 shadow">
                <Heart className="w-4 h-4 fill-emerald-900" />
                <span>Infaq</span>
              </button>
              <button onClick={handleShare} className="bg-emerald-900 hover:bg-emerald-800 text-xs font-bold text-emerald-200 py-3 rounded-xl border border-emerald-800">
                Bagikan
              </button>
            </div>
            <div className="flex items-center justify-center gap-5 px-4 py-4 border-t border-emerald-900 text-emerald-200">
              <a href="https://instagram.com/masjidrayapuritelukjambe" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition" aria-label="Instagram"><Instagram className="w-5 h-5" /></a>
              <a href="https://web.facebook.com/pages/Aula%20Masjid%20Raya%20Puri%20Teluk%20Jambe%20(PERURI)%20Karawang/732935826736923/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition" aria-label="Facebook"><Facebook className="w-5 h-5" /></a>
              <a href="https://www.youtube.com/@masjidrayapuritelukjambe_TV" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition" aria-label="YouTube"><Youtube className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1" role="main">
        <HeroSection onDonateClick={() => scrollToSection('donasi')} onSermonClick={() => scrollToSection('khutbah')} onBookingClick={() => scrollToSection('audio-visual-hall')} />
        <PrayerTimes />
        <EventSection events={finalEvents} />
        <FridaySermonSection sermons={finalSermons} />
        <BookingSection />
        <FinanceTransparencySection />
        <DonationSection />
        <GallerySection />
      </main>

      <footer className="bg-emerald-950 text-white border-t border-emerald-900">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img className="w-15" src="/images/logo.svg" alt="logo" />
                <span className="font-extrabold text-sm tracking-wider">Masjid Raya Puri Telukjambe</span>
              </div>
              <p className="text-xs text-emerald-200/80 leading-relaxed max-w-sm">
                Masjid Raya Puri Telukjambe di bawah pengelolaan Yayasan Dewan Kemakmuran Masjid (DKM). Kompleks terintegrasi Dakwah, Sosial, Pendidikan, & Pemberdayaan Ekonomi Syariah.
              </p>
              <div className="space-y-2 text-xs text-emerald-300">
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-400 shrink-0" /><span>Jl. Telukjambe Timur No. 23, Karawang</span></div>
                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-emerald-400 shrink-0" /><a href="https://wa.me/62895414283161" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition cursor-pointer">0895-4142-83161 (Humas DKM)</a></div>
                <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-emerald-400 shrink-0" /><a href="mailto:puritelukjambemasjidraya@gmail.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition cursor-pointer">puritelukjambemasjidraya@gmail.com</a></div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Navigasi Portal</h4>
              <ul className="space-y-2 text-xs text-emerald-200/80 font-medium">
                <li><button onClick={() => scrollToSection('hero')} className="hover:text-amber-400 transition cursor-pointer">Dashboard Beranda</button></li>
                <li><button onClick={() => scrollToSection('kegiatan')} className="hover:text-amber-400 transition cursor-pointer">Kajian Dakwah & Sosial</button></li>
                <li><button onClick={() => scrollToSection('khutbah')} className="hover:text-amber-400 transition cursor-pointer">Jadwal Dewan Khutbah</button></li>
                <li><a href="/blog" className="hover:text-amber-400 transition cursor-pointer">Blog & Artikel</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Layanan & Fasilitas</h4>
              <ul className="space-y-2 text-xs text-emerald-200/80 font-medium">
                <li><button onClick={() => scrollToSection('audio-visual-hall')} className="hover:text-amber-400 transition cursor-pointer">Sewa Aula Serbaguna</button></li>
                <li><button onClick={() => scrollToSection('donasi')} className="hover:text-amber-400 transition cursor-pointer">Gerbang Infaq QRIS</button></li>
                <li><a href="https://wa.me/6285210535379?text=Assalamualaikum...%20Saya%20memerlukan%20informasi%20bantuan%20ambulans%20Masjid." target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition">Pelayanan Ambulans Gratis</a></li>
                <li><a href="https://wa.me/62895414283161?text=Assalamualaikum...%20Saya%20ingin%20berkonsultasi%20syariah." target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition">Konseling & Konsultasi Syari&apos;ah</a></li>
              </ul>
            </div>
            <div className="space-y-3 bg-emerald-900/35 border border-emerald-800/40 p-4 rounded-2xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Internal DKM</h4>
              <p className="text-xs text-emerald-200/70 leading-relaxed">
                Akses dashboard internal untuk pengurus DKM: kelola artikel, jadwal kajian, booking aula, dan laporan keuangan masjid.
              </p>
              <Link href="/login" className="inline-block w-full text-center text-[14px] text-amber-400 font-bold border border-amber-400 hover:bg-amber-400 hover:text-emerald-900 transition-colors duration-300 p-2 rounded">
                🔐 Masuk Dashboard Admin
              </Link>
            </div>
            <div className="space-y-3 bg-emerald-900/35 border border-emerald-800/40 p-4 rounded-2xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Sekretariat menerima saran dan masukan</h4>
              <p className="text-xs text-emerald-200/70 leading-relaxed">
                Kantor sekertariat DKM Masjid Raya Puri Telukjambe menerima saran dan masukan untuk perkembangan terbaik masjid tiap hari kerja pukul 08:30 - 16:30 WIB.
              </p>
              <a href="https://forms.gle/3JxrimyLqbBcJ3kG8" target="_blank" rel="noopener noreferrer" className="inline-block w-full text-center text-[14px] text-amber-400 font-bold border border-amber-400 hover:bg-amber-400 hover:text-emerald-900 transition-colors duration-300 p-2 rounded">
                Silahkan Klik untuk menyampaikan saran & masukan
              </a>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-emerald-900/80 text-center text-xs text-emerald-300/70 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              &copy; {new Date().getFullYear()} Design & Development by <a href="https://solivate.com" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-500 transition cursor-pointer">Solivate Studio</a>. All Rights Reserved.
            </div>
            <div className="flex items-center gap-6 text-emerald-400 my-4 sm:my-0">
              <a href="https://instagram.com/masjidrayapuritelukjambe" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition" aria-label="Instagram"><Instagram className="w-8 h-8" /></a>
              <a href="https://web.facebook.com/pages/Aula%20Masjid%20Raya%20Puri%20Teluk%20Jambe%20(PERURI)%20Karawang/732935826736923/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition" aria-label="Facebook"><Facebook className="w-8 h-8" /></a>
              <a href="https://www.youtube.com/@masjidrayapuritelukjambe_TV" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition" aria-label="YouTube"><Youtube className="w-8 h-8" /></a>
            </div>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span>Masyarakat Transparansi Syari&apos;ah Indonesia</span>
              <span>|</span>
              <span>Amanah & Profesional</span>
            </div>
          </div>
        </div>
      </footer>
      <PageviewTracker />
    </div>
  );
}

export default function LandingPageClient({ events, sermons }: Props) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <LandingContent events={events} sermons={sermons} />
    </Suspense>
  );
}


