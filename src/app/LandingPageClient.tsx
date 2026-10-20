"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { showAlert } from "@/lib/dialog";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import PrayerTimes from "@/components/PrayerTimes";
import EventSection from "@/components/EventSection";
import FridaySermonSection from "@/components/FridaySermonSection";
import BookingSection from "@/components/BookingSection";
import DonationSection from "@/components/DonationSection";
import FinanceTransparencySection from "@/components/FinanceTransparencySection";
import GallerySection from "@/components/GallerySection";
import Footer from "@/components/Footer";
import PageviewTracker from "@/components/PageviewTracker";
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Heart,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Share2,
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
} from "lucide-react";
import type { EventActivity, FridaySermon } from "@/types";

interface Props {
  events: EventActivity[];
  sermons: FridaySermon[];
}

type NavigationItem = {
  label: string;
  href?: string;
  section?: string;
  external?: boolean;
};

type NavigationGroup = {
  label: string;
  items: NavigationItem[];
};

function LandingContent({ events, sermons }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null);
  const [openDesktopGroup, setOpenDesktopGroup] = useState<string | null>(null);
  const desktopNavigationRef = useRef<HTMLElement>(null);
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
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!desktopNavigationRef.current?.contains(event.target as Node)) {
        setOpenDesktopGroup(null);
      }
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, []);

  useEffect(() => {
    let active = true;
    const days = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    const formatKhutbahDate = (value: string) => {
      const d = new Date(value);
      return `${days[d.getUTCDay()]}, ${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
    };

    const refreshPublicData = async () => {
      try {
        const [kajianRes, khutbahRes] = await Promise.all([
          fetch("/api/public/kajian", { cache: "no-store" }),
          fetch("/api/public/khutbah?limit=4", { cache: "no-store" }),
        ]);
        if (!kajianRes.ok || !khutbahRes.ok) return;
        const [kajianRows, khutbahRows] = await Promise.all([
          kajianRes.json(),
          khutbahRes.json(),
        ]);
        if (!active) return;
        setLiveEvents(
          kajianRows.map((k: any) => ({
            id: k.id,
            title: k.title,
            category: k.category,
            date: k.date_label,
            time: k.time_label,
            speaker: k.speaker,
            location: k.location,
            description: k.description || "",
            image: k.image_url || "/images/sholat_tarawih.webp",
            capacity: k.capacity,
            registeredCount: k.registered_count,
          })),
        );
        setLiveSermons(
          khutbahRows.map((s: any) => ({
            id: s.id,
            date: formatKhutbahDate(s.schedule_date),
            khatib: s.khatib,
            muadzin: s.muadzin || "",
            theme: s.theme || "",
          })),
        );
      } catch {
        // Keep the last good payload on transient network/database errors.
      }
    };

    refreshPublicData();
    const interval = window.setInterval(refreshPublicData, 15000);
    window.addEventListener("focus", refreshPublicData);
    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener("focus", refreshPublicData);
    };
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    setOpenMobileGroup(null);
    setOpenDesktopGroup(null);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const closeNavigation = () => {
    setMobileMenuOpen(false);
    setOpenMobileGroup(null);
    setOpenDesktopGroup(null);
  };

  const navigationGroups: NavigationGroup[] = [
    {
      label: "Tentang Kami",
      items: [
        { label: "Profil Yayasan & DKM", href: "/profile-yayasan-dkm" },
        { label: "Visi & Misi", href: "/profile-yayasan-dkm#visi-misi" },
        { label: "Struktur Pengurus", href: "/profile-yayasan-dkm#struktur-pengurus" },
      ],
    },
    {
      label: "Program",
      items: [
        { label: "Program Yayasan / DKM", section: "kegiatan" },
        { label: "Baabussalam", href: "https://baabussalam.masjidrayapuritelukjambe.com/", external: true },
      ],
    },
    {
      label: "Kegiatan",
      items: [
        { label: "Khutbah", section: "khutbah" },
        { label: "Aula", section: "audio-visual-hall" },
      ],
    },
    {
      label: "Informasi",
      items: [
        { label: "Blog / Berita", href: "/blog" },
        { label: "Keuangan", section: "transparansi-keuangan" },
      ],
    },
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Masjid Raya Puri Telukjambe",
          text: "Portal DKM Transparansi Kas, Jadwal Syiar Dakwah, Donasi QRIS & Booking Aula Serbaguna Masjid Raya Puri Telukjambe.",
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).then(() =>
        showAlert("Tautan website berhasil dicopy ke clipboard!", {
          title: "Tautan Disalin",
        }),
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased">
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-40 bg-amber-500 hover:bg-amber-600 text-emerald-950 p-3 rounded-full transition-all duration-300 shadow-xl cursor-pointer hover:scale-105 active:scale-95 flex items-center justify-center border border-amber-400"
          title="Kembali ke atas"
        >
          <ChevronUp className="w-5 h-5 font-bold" />
        </button>
      )}

      <a
        href="https://wa.me/62895414283161?text=Assalamualaikum...%20Saya%20ingin%20bertanya%20seputar%20Masjid%20Raya%20Puri%20Telukjambe."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-6 z-40 bg-[#25D366] hover:bg-[#128C7E] text-white p-3 rounded-full transition-all duration-300 shadow-xl cursor-pointer hover:scale-105 active:scale-95 flex items-center justify-center border border-[#128C7E]"
        title="Hubungi via WhatsApp"
      >
        <MessageCircle className="w-5 h-5 font-bold" />
      </a>

      <div className="bg-emerald-900 border-b border-emerald-800 text-emerald-100 px-3 py-2 text-center text-[11px] sm:text-xs font-semibold relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-1.5">
          <span className="hidden sm:inline bg-amber-400 text-emerald-950 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest mr-1.5 animate-pulse">
            Pemberitahuan
          </span>
          <span className="min-w-0 truncate">
            Pendaftaran Kelas Tahsin Al-Quran Semester Ganjil 2026 dibuka.
          </span>
          <button
            onClick={() => scrollToSection("kegiatan")}
            className="shrink-0 underline hover:text-white font-bold cursor-pointer"
          >
            Lihat Jadwal
          </button>
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-emerald-950/95 border-b border-emerald-900/70 backdrop-blur-sm text-white card-shadow">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 h-16 lg:h-[68px] flex items-center justify-between gap-3">
          <button
            onClick={() => scrollToSection("hero")}
            className="min-w-0 flex items-center gap-2.5 cursor-pointer group text-left shrink"
          >
            <img
              className="w-10 h-10 sm:w-11 sm:h-11 shrink-0"
              src="/images/logo.svg"
              alt="logo"
            />
            <div className="min-w-0">
              <span className="block font-black text-sm lg:text-base text-white tracking-tight leading-tight truncate max-w-[190px] sm:max-w-[260px] lg:max-w-[310px]">
                Masjid Raya Puri Telukjambe
              </span>
              <span className="block text-[10px] text-emerald-300 font-bold uppercase tracking-wider mt-0.5 truncate">
                Portal Resmi DKM
              </span>
            </div>
          </button>

          <nav
            ref={desktopNavigationRef}
            className="hidden xl:flex items-center justify-center gap-1 xl:gap-1.5"
            aria-label="Menu utama"
          >
            <button
              onClick={() => scrollToSection("hero")}
              className="px-2 py-2 text-xs uppercase font-extrabold tracking-wider text-emerald-100 hover:text-amber-400 transition cursor-pointer"
            >
              Beranda
            </button>
            {navigationGroups.map((group) => (
              <div
                key={group.label}
                className="relative"
                onMouseEnter={() => setOpenDesktopGroup(group.label)}
                onMouseLeave={() => setOpenDesktopGroup(null)}
              >
                <button
                  onClick={() => setOpenDesktopGroup(openDesktopGroup === group.label ? null : group.label)}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-xs uppercase font-extrabold tracking-wider text-emerald-100 hover:bg-emerald-900/70 hover:text-amber-400 transition cursor-pointer"
                  aria-expanded={openDesktopGroup === group.label}
                  aria-haspopup="menu"
                >
                  {group.label}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-150 ${openDesktopGroup === group.label ? "rotate-180" : ""}`} />
                </button>
                <div
                  className={`absolute left-0 top-full w-60 origin-top-left pt-2 transition duration-150 ${openDesktopGroup === group.label ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"}`}
                  role="menu"
                >
                  <div className="rounded-xl border border-emerald-800 bg-emerald-950 p-1.5 shadow-2xl">
                    {group.items.map((item) => item.section ? (
                      <button
                        key={item.label}
                        onClick={() => scrollToSection(item.section!)}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-emerald-100 hover:bg-emerald-900 hover:text-amber-300 transition cursor-pointer"
                        role="menuitem"
                      >
                        {item.label}
                      </button>
                    ) : (
                      <Link
                        key={item.label}
                        href={item.href!}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                        onClick={closeNavigation}
                        className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold text-emerald-100 hover:bg-emerald-900 hover:text-amber-300 transition"
                        role="menuitem"
                      >
                        {item.label}
                        {item.external && <ExternalLink className="h-3.5 w-3.5" aria-label="Tautan eksternal" />}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => scrollToSection("galeri")}
              className="px-2 py-2 text-xs uppercase font-extrabold tracking-wider text-emerald-100 hover:text-amber-400 transition cursor-pointer"
            >
              Galeri
            </button>
          </nav>

          <div className="hidden xl:flex items-center gap-2 shrink-0">
            <div className="hidden xl:flex items-center gap-2 border-r border-emerald-800 pr-3 mr-1">
              <a
                href="https://instagram.com/masjidrayapuritelukjambe"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-200 hover:text-amber-400 transition hover:-translate-y-1"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://web.facebook.com/pages/Aula%20Masjid%20Raya%20Puri%20Teluk%20Jambe%20(PERURI)%20Karawang/732935826736923/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-200 hover:text-amber-400 transition hover:-translate-y-1"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.youtube.com/@masjidrayapuritelukjambe_TV"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-200 hover:text-amber-400 transition hover:-translate-y-1"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
            <button
              onClick={handleShare}
              className="hidden xl:flex p-2 border border-emerald-800 bg-emerald-900/50 hover:bg-emerald-900 text-emerald-200 hover:text-white rounded-xl transition cursor-pointer"
              title="Bagikan Tautan Web"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollToSection("audio-visual-hall")}
              className="bg-amber-400 hover:bg-amber-500 text-emerald-950 font-black text-xs px-4 py-2.5 rounded-xl transition cursor-pointer shadow-md flex items-center gap-1.5 whitespace-nowrap"
            >
              <Heart className="w-4 h-4 fill-emerald-950" />
              <span>Booking Aula</span>
            </button>
          </div>

          <div className="flex xl:hidden items-center gap-2 shrink-0">
            <button
              onClick={() => scrollToSection("audio-visual-hall")}
              className="hidden sm:inline-flex bg-amber-400 text-emerald-950 font-black text-xs px-3 py-2 rounded-lg shadow-sm"
            >
              Booking
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-emerald-100 hover:text-white hover:bg-emerald-900 rounded-xl transition cursor-pointer border border-emerald-800"
              aria-expanded={mobileMenuOpen}
              aria-label="Buka menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-emerald-950/70 backdrop-blur-sm xl:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute left-3 right-3 top-[76px] rounded-2xl bg-emerald-950 border border-emerald-800 text-white shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-4 border-b border-emerald-900">
              <span className="font-extrabold text-xs tracking-widest text-amber-300 uppercase">
                Navigasi DKM
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-emerald-200 hover:text-white hover:bg-emerald-900 rounded-lg cursor-pointer"
                aria-label="Tutup menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-1.5 p-3">
              <button
                onClick={() => scrollToSection("hero")}
                className="w-full text-left px-4 py-3 text-sm font-bold text-emerald-100 hover:bg-emerald-900 rounded-xl transition"
              >
                Beranda
              </button>
              {navigationGroups.map((group) => (
                <div key={group.label} className="overflow-hidden rounded-xl bg-emerald-900/50">
                  <button
                    onClick={() => setOpenMobileGroup(openMobileGroup === group.label ? null : group.label)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-bold text-emerald-100 hover:bg-emerald-900 transition cursor-pointer"
                    aria-expanded={openMobileGroup === group.label}
                  >
                    {group.label}
                    <ChevronDown className={`h-4 w-4 text-amber-300 transition-transform duration-150 ${openMobileGroup === group.label ? "rotate-180" : ""}`} />
                  </button>
                  <div className={`grid transition-[grid-template-rows] duration-200 ease-out ${openMobileGroup === group.label ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="min-h-0 overflow-hidden">
                      <div className="border-t border-emerald-800/70 px-2 py-1.5">
                        {group.items.map((item) => item.section ? (
                          <button
                            key={item.label}
                            onClick={() => scrollToSection(item.section!)}
                            className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium text-emerald-200 hover:bg-emerald-800 hover:text-white transition cursor-pointer"
                          >
                            {item.label}
                          </button>
                        ) : (
                          <Link
                            key={item.label}
                            href={item.href!}
                            target={item.external ? "_blank" : undefined}
                            rel={item.external ? "noopener noreferrer" : undefined}
                            onClick={closeNavigation}
                            className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-emerald-200 hover:bg-emerald-800 hover:text-white transition"
                          >
                            {item.label}
                            {item.external && <ExternalLink className="h-3.5 w-3.5" aria-label="Tautan eksternal" />}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => scrollToSection("galeri")}
                className="w-full text-left px-4 py-3 text-sm font-bold text-emerald-100 hover:bg-emerald-900 rounded-xl transition"
              >
                Galeri
              </button>
            </div>
            <div className="p-4 pt-0 grid grid-cols-2 gap-2">
              <button
                onClick={() => scrollToSection("donasi")}
                className="bg-amber-400 text-emerald-950 font-black py-3 rounded-xl text-center text-xs flex items-center justify-center gap-1.5 shadow"
              >
                <Heart className="w-4 h-4 fill-emerald-900" />
                <span>Infaq</span>
              </button>
              <button
                onClick={handleShare}
                className="bg-emerald-900 hover:bg-emerald-800 text-xs font-bold text-emerald-200 py-3 rounded-xl border border-emerald-800"
              >
                Bagikan
              </button>
            </div>
            <div className="flex items-center justify-center gap-5 px-4 py-4 border-t border-emerald-900 text-emerald-200">
              <a
                href="https://instagram.com/masjidrayapuritelukjambe"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 transition"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://web.facebook.com/pages/Aula%20Masjid%20Raya%20Puri%20Teluk%20Jambe%20(PERURI)%20Karawang/732935826736923/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 transition"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.youtube.com/@masjidrayapuritelukjambe_TV"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 transition"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1" role="main">
        <HeroSection
          onDonateClick={() => scrollToSection("donasi")}
          onSermonClick={() => scrollToSection("khutbah")}
          onBookingClick={() => scrollToSection("audio-visual-hall")}
        />
        <PrayerTimes />
        <EventSection events={finalEvents} />
        <FridaySermonSection sermons={finalSermons} />
        <BookingSection />
        <FinanceTransparencySection />
        <DonationSection />
        <GallerySection />
      </main>

      <Footer />
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
