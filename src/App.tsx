import { useState, useEffect } from 'react';
import { EventActivity, FinanceRecord } from './types';
import { INITIAL_EVENTS, INITIAL_FINANCEDATA } from './data';

// Component Imports
import HeroSection from './components/HeroSection';
import PrayerTimes from './components/PrayerTimes';
import EventSection from './components/EventSection';
import TransparencySection from './components/TransparencySection';
import FridaySermonSection from './components/FridaySermonSection';
import BookingSection from './components/BookingSection';
import DonationSection from './components/DonationSection';
import GallerySection from './components/GallerySection';

// Lucide Icons
import { Menu, X, Landmark, Phone, Mail, MapPin, Heart, ChevronUp, Share2, Compass, HelpCircle, Instagram, Facebook, Youtube, MessageCircle } from 'lucide-react';

export default function App() {
  const [events, setEvents] = useState<EventActivity[]>(INITIAL_EVENTS);
  const [ledger, setLedger] = useState<FinanceRecord[]>(INITIAL_FINANCEDATA);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Check scroll position for back to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handler: Increase event registered counts upon registration simulation
  const handleRegisterEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id === eventId) {
          return {
            ...evt,
            registeredCount: evt.registeredCount + 1,
          };
        }
        return evt;
      })
    );
  };

  // Handler: Add a custom record to the financial ledger list
  const handleAddRecord = (record: Omit<FinanceRecord, 'id'>) => {
    const newRecord: FinanceRecord = {
      ...record,
      id: `fin-added-${Date.now()}`,
    };
    setLedger((prev) => [newRecord, ...prev]);
  };

  // Handler: Post QRIS custom checkout values to Ledger list directly
  const handleSimulateDonation = (amount: number, description: string) => {
    handleAddRecord({
      date: new Date().toISOString().substring(0, 10),
      description,
      type: 'Pemasukan',
      category: 'Infaq Umum',
      amount,
    });
  };

  // Scroll Helper
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Quick Share URL trigger
  const handleShareWebsite = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Masjid Raya Puri Telukjambe',
        text: 'Portal DKM Transparansi Kas, Jadwal Syiar Dakwah, Donasi QRIS & Booking Aula Serbaguna Masjid Raya Puri Telukjambe.',
        url: window.location.href,
      }).catch((err) => console.log(err));
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Tautan website berhasil dicopy ke clipboard!');
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans select-none antialiased">

      {/* Dynamic Back to top button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 bg-amber-500 hover:bg-amber-600 text-emerald-950 p-3 rounded-full transition-all duration-300 shadow-xl cursor-pointer hover:scale-105 active:scale-95 flex items-center justify-center border border-amber-400"
          title="Kembali ke atas"
        >
          <ChevronUp className="w-5 h-5 font-bold" />
        </button>
      )}

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/62895414283161?text=Assalamualaikum...%20Saya%20ingin%20bertanya%20seputar%20Masjid%20Raya%20Puri%20Telukjambe."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-6 z-40 bg-[#25D366] hover:bg-[#128C7E] text-white p-3 rounded-full transition-all duration-300 shadow-xl cursor-pointer hover:scale-105 active:scale-95 flex items-center justify-center border border-[#128C7E]"
        title="Hubungi via WhatsApp"
      >
        <MessageCircle className="w-5 h-5 font-bold" />
      </a>

      {/* DKM Top Announcement Bar */}
      <div className="bg-emerald-900 border-b border-emerald-800 text-emerald-100 py-2.5 px-4 text-center text-xs font-semibold relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-1.5 flex-wrap">
          <span className="bg-amber-400 text-emerald-950 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest mr-1.5 animate-pulse">Pemberitahuan</span>
          <span>Yayasan Masjid Raya Puri Telukjambe membuka pendaftaran Kelas Tahsin Al-Quran Semester Ganjil 2026.</span>
          <button
            onClick={() => scrollToSection('kegiatan')}
            className="underline hover:text-white font-bold ml-1 cursor-pointer"
          >
            Lihat Jadwal
          </button>
        </div>
      </div>

      {/* Main navigation header */}
      <header className="sticky top-0 z-40 bg-emerald-950/90 border-b border-emerald-900/60 backdrop-blur-sm text-white card-shadow">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-18 flex items-center justify-between">

          {/* Logo Brand Emblem */}
          <div
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <img className='w-15' src="/images/logo.svg" alt="logo" />
            <div>
              <span className="block font-black text-base text-white tracking-tight leading-none">
                Masjid Raya Puri Telukjambe
              </span>
              <span className="block text-[10px] text-emerald-300 font-bold uppercase tracking-wider mt-0.5">
                Portal Resmi
              </span>
            </div>
          </div>

          {/* Desktop Sitemap Menu links */}
          <nav className="hidden lg:flex items-center gap-6.5">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-xs uppercase font-extrabold tracking-wider text-emerald-100 hover:text-amber-400 transition cursor-pointer"
            >
              Beranda
            </button>
            <button
              onClick={() => scrollToSection('kegiatan')}
              className="text-xs uppercase font-extrabold tracking-wider text-emerald-100 hover:text-amber-400 transition cursor-pointer"
            >
              Program Masjid
            </button>
            {/* <button
              onClick={() => scrollToSection('transparansi')}
              className="text-xs uppercase font-extrabold tracking-wider text-emerald-100 hover:text-amber-400 transition cursor-pointer"
            >
              Transparansi Kas
            </button> */}
            <button
              onClick={() => scrollToSection('khutbah')}
              className="text-xs uppercase font-extrabold tracking-wider text-emerald-100 hover:text-amber-400 transition cursor-pointer"
            >
              Khatib Jumat
            </button>
            <button
              onClick={() => scrollToSection('audio-visual-hall')}
              className="text-xs uppercase font-extrabold tracking-wider text-emerald-100 hover:text-amber-400 transition cursor-pointer"
            >
              Sewa Aula
            </button>
            <button
              onClick={() => scrollToSection('galeri')}
              className="text-xs uppercase font-extrabold tracking-wider text-emerald-100 hover:text-amber-400 transition cursor-pointer"
            >
              Galeri
            </button>
          </nav>

          {/* CTA Header Actions */}
          <div className="hidden lg:flex items-center gap-4">

            {/* Social Media Header Icons (Desktop) */}
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

            {/* Share Page Button */}
            <button
              onClick={handleShareWebsite}
              className="p-2 border border-emerald-800 bg-emerald-900/50 hover:bg-emerald-900 text-emerald-200 hover:text-white rounded-xl transition cursor-pointer"
              title="Bagikan Tautan Web"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Anchor Donasi buttons */}
            <button
              onClick={() => scrollToSection('donasi')}
              className="bg-amber-400 hover:bg-amber-500 active:scale-98 text-emerald-950 font-black text-xs px-5 py-2.5 rounded-xl transition cursor-pointer shadow-md shadow-amber-400/10 flex items-center gap-1.5"
            >
              <Heart className="w-4 h-4 fill-emerald-950" />
              <span>Donasi (QRIS)</span>
            </button>
          </div>

          {/* Mobile hamburger menu toggle & Social Icons */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Social Media Header Icons (Mobile) */}
            <div className="flex items-center gap-3 mr-1">
              <a href="https://instagram.com/masjidrayapuritelukjambe" target="_blank" rel="noopener noreferrer" className="text-emerald-200 hover:text-amber-400 transition" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://web.facebook.com/pages/Aula%20Masjid%20Raya%20Puri%20Teluk%20Jambe%20(PERURI)%20Karawang/732935826736923/" target="_blank" rel="noopener noreferrer" className="text-emerald-200 hover:text-amber-400 transition" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.youtube.com/@masjidrayapuritelukjambe_TV" target="_blank" rel="noopener noreferrer" className="text-emerald-200 hover:text-amber-400 transition" aria-label="YouTube">
                <Youtube className="w-5 h-5" />
              </a>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-emerald-100 hover:text-white hover:bg-emerald-900 rounded-lg transition cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Side Drawer overlay portal */}
      {mobileMenuOpen && (
        <div className="fixed inset-y-0 right-0 w-64 bg-emerald-950 border-l border-emerald-900 z-50 p-6 flex flex-col justify-between text-white shadow-2xl lg:hidden animate-in slide-in-from-right duration-250">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-emerald-900">
              <span className="font-extrabold text-sm tracking-wider text-amber-300 uppercase">Navigasi DKM</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-400 hover:text-white font-extrabold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection('hero')}
                className="text-left py-2 text-sm font-bold text-emerald-100 hover:text-amber-400"
              >
                Beranda
              </button>
              <button
                onClick={() => scrollToSection('kegiatan')}
                className="text-left py-2 text-sm font-bold text-emerald-100 hover:text-amber-400"
              >
                Program Dakwah & Sosial
              </button>
              {/* <button
                onClick={() => scrollToSection('transparansi')}
                className="text-left py-2 text-sm font-bold text-emerald-100 hover:text-amber-400"
              >
                Transparansi Arus Kas
              </button> */}
              <button
                onClick={() => scrollToSection('khutbah')}
                className="text-left py-2 text-sm font-bold text-emerald-100 hover:text-amber-400"
              >
                Jadwal Khatib Jumat
              </button>
              <button
                onClick={() => scrollToSection('audio-visual-hall')}
                className="text-left py-2 text-sm font-bold text-emerald-100 hover:text-amber-400"
              >
                Booking Aula Serbaguna
              </button>
              <button
                onClick={() => scrollToSection('galeri')}
                className="text-left py-2 text-sm font-bold text-emerald-100 hover:text-amber-400"
              >
                Galeri Kebersamaan
              </button>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-emerald-900">
            <button
              onClick={() => scrollToSection('donasi')}
              className="w-full bg-amber-400 text-emerald-950 font-black py-3 rounded-xl transition text-center text-xs flex items-center justify-center gap-1.5 shadow"
            >
              <Heart className="w-4 h-4 fill-emerald-900" />
              <span>Infaq Sekarang (QRIS)</span>
            </button>

            <button
              onClick={handleShareWebsite}
              className="w-full bg-emerald-900 hover:bg-emerald-800 text-xs text-emerald-200 py-2.5 rounded-xl transition border border-emerald-800"
            >
              Bagikan Link Portal
            </button>
          </div>
        </div>
      )}

      {/* Main Page Sections Container */}
      <main className="flex-1">

        {/* H. Hero Banner with background */}
        <HeroSection
          onDonateClick={() => scrollToSection('donasi')}
          onSermonClick={() => scrollToSection('khutbah')}
          onBookingClick={() => scrollToSection('audio-visual-hall')}
        />

        {/* P. Pray Times real-time Countdown component */}
        <PrayerTimes />

        {/* B. Informational activities (Dakwah & Sosial grid logs) */}
        <EventSection
          events={events}
          onRegisterEvent={handleRegisterEvent}
        />

        {/* C. Transparansi Kas (financial report simulated journal ledgers) */}
        {/* <TransparencySection 
          ledger={ledger}
          onAddRecord={handleAddRecord}
        /> */}

        {/* D. Friday Pulpit Sermon bulletin tables */}
        <FridaySermonSection />

        {/* G. Multipurpose Rent & Reservation form triggers */}
        <BookingSection />

        {/* F. QRIS Donation calculator interface */}
        <DonationSection
          onSimulateDonation={handleSimulateDonation}
        />

        {/* E. Gallery documentation slider components */}
        <GallerySection />

      </main>

      {/* Footer Branding, sitemaps and legal credits */}
      <footer className="bg-emerald-950 text-white border-t border-emerald-900">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8.5">

            {/* Footer Column 1: Brand & Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img className='w-15' src="/images/logo.svg" alt="logo" />
                <span className="font-extrabold text-sm tracking-wider">Masjid Raya Puri Telukjambe</span>
              </div>

              <p className="text-xs text-emerald-200/80 leading-relaxed max-w-sm">
                Masjid Raya Puri Telukjambe di bawah pengelolaan Yayasan Dewan Kemakmuran Masjid (DKM). Kompleks terintegrasi Dakwah, Sosial, Pendidikan, & Pemberdayaan Ekonomi Syariah.
              </p>

              <div className="space-y-2 text-xs text-emerald-300">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Jl. Telukjambe Timur No. 23, Karawang</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <a href="https://wa.me/62895414283161" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition cursor-pointer">0895-4142-83161 (Humas DKM)</a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <a href="mailto:puritelukjambemasjidraya@gmail.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition cursor-pointer">puritelukjambemasjidraya@gmail.com</a>
                </div>
              </div>
            </div>

            {/* Footer Column 2: Navigation Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Navigasi Portal</h4>
              <ul className="space-y-2 text-xs text-emerald-200/80 font-medium">
                <li>
                  <button onClick={() => scrollToSection('hero')} className="hover:text-amber-400 transition cursor-pointer">
                    Dashboard Beranda
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('kegiatan')} className="hover:text-amber-400 transition cursor-pointer">
                    Kajian Dakwah & Sosial
                  </button>
                </li>
                <li className='flex items-center gap-2'>
                  <button onClick={() => scrollToSection('transparansi')} className="hover:text-amber-400 transition cursor-pointer">
                    Transparansi Catatan Kas
                  </button>
                  <div className='w-fit p-1 text-xs rounded-lg bg-amber-400 font-bold text-center text-emerald-900'>
                    <p>Coming Soon!</p>
                  </div>
                </li>
                <li>
                  <button onClick={() => scrollToSection('khutbah')} className="hover:text-amber-400 transition cursor-pointer">
                    Jadwal Dewan Khutbah
                  </button>
                </li>
              </ul>
            </div>

            {/* Footer Column 3: Services Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Layanan & Fasilitas</h4>
              <ul className="space-y-2 text-xs text-emerald-200/80 font-medium">
                <li>
                  <button onClick={() => scrollToSection('audio-visual-hall')} className="hover:text-amber-400 transition cursor-pointer">
                    Sewa Aula Serbaguna
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('donasi')} className="hover:text-amber-400 transition cursor-pointer">
                    Gerbang Infaq QRIS
                  </button>
                </li>
                <li>
                  <a
                    href="https://wa.me/6285210535379?text=Assalamualaikum...%20Saya%20memerlukan%20informasi%20bantuan%20ambulans%20Masjid."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-400 transition"
                  >
                    Pelayanan Ambulans Gratis
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/62895414283161?text=Assalamualaikum...%20Saya%20ingin%20berkonsultasi%20syariah."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-400 transition"
                  >
                    Konseling & Konsultasi Syari'ah
                  </a>
                </li>
              </ul>
            </div>

            {/* Footer Column 4: Operational Notice */}
            <div className="space-y-3 bg-emerald-900/35 border border-emerald-800/40 p-4.5 rounded-2xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Seksi Sekretariat</h4>
              <p className="text-xs text-emerald-200/70 leading-relaxed">
                Kantor kesekretariatan DKM Masjid raya puri telukjambe melayani administrasi berkas walimah, pendaftaran jamaah mabit, dan verifikasi kas masuk setiap hari kerja pukul 08:30 - 16:30 WIB.
              </p>
              <div className="text-[10px] text-amber-300 font-bold bg-emerald-900 border border-emerald-800 p-2 rounded text-center">
                ● Layanan Jamaah Siaga 24 Jam
              </div>
            </div>

          </div>

          {/* Social icons, copyrights, and technical stamps */}
          <div className="pt-8 mt-8 border-t border-emerald-900/80 text-center text-xs text-emerald-300/70 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              &copy; {new Date().getFullYear()} Design & Development by <a href="https://kinetcstudio.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-500 transition cursor-pointer">Kinetic Studio</a>. All Rights Reserved.
            </div>

            <div className="flex items-center gap-6 text-emerald-400 my-4 sm:my-0">
              <a href="https://instagram.com/masjidrayapuritelukjambe" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition" aria-label="Instagram">
                <Instagram className="w-8 h-8" />
              </a>
              <a href="https://web.facebook.com/pages/Aula%20Masjid%20Raya%20Puri%20Teluk%20Jambe%20(PERURI)%20Karawang/732935826736923/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition" aria-label="Facebook">
                <Facebook className="w-8 h-8" />
              </a>
              <a href="https://www.youtube.com/@masjidrayapuritelukjambe_TV" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition" aria-label="YouTube">
                <Youtube className="w-8 h-8" />
              </a>
            </div>

            <div className="flex items-center gap-1.5 text-[10px]">
              <span>Masyarakat Transparansi Syari'ah Indonesia</span>
              <span>•</span>
              <span>Amanah & Profesional</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
