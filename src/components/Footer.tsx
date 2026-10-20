"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Youtube,
  Lock,
  MessageSquareHeart,
} from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  const handleSectionClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    if (pathname === "/") {
      e.preventDefault();
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="bg-emerald-950 text-white border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Kolom 1: Profil Masjid & Kontak */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                className="w-12 h-auto"
                src="/images/logo.svg"
                alt="Logo Masjid Raya Puri Telukjambe"
              />
              <span className="font-extrabold text-sm tracking-wide leading-snug">
                Masjid Raya
                <br />
                Puri Telukjambe
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Di bawah pengelolaan Yayasan Dewan Kemakmuran Masjid (DKM).
              Kompleks terintegrasi Dakwah, Sosial, Pendidikan, & Pemberdayaan
              Ekonomi Syariah.
            </p>
            <div className="space-y-2.5 text-xs text-emerald-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">Jl. Telukjambe Timur No. 23, Karawang</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href="https://wa.me/62895414283161"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition"
                >
                  0895-4142-83161 (Humas DKM)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href="mailto:puritelukjambemasjidraya@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition break-all"
                >
                  puritelukjambemasjidraya@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Kolom 2: Navigasi Portal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Navigasi Portal
            </h4>
            <ul className="space-y-2.5 text-xs text-emerald-200/80 font-medium">
              <li>
                <Link
                  href="/#hero"
                  onClick={(e) => handleSectionClick(e, "hero")}
                  className="hover:text-amber-400 transition inline-block"
                >
                  Beranda Utama
                </Link>
              </li>
              <li>
                <Link
                  href="/profile-yayasan-dkm"
                  className="hover:text-amber-400 transition inline-block"
                >
                  Profile Yayasan / DKM
                </Link>
              </li>
              <li>
                <Link
                  href="/#kegiatan"
                  onClick={(e) => handleSectionClick(e, "kegiatan")}
                  className="hover:text-amber-400 transition inline-block"
                >
                  Kajian Dakwah & Sosial
                </Link>
              </li>
              <li>
                <Link
                  href="/#khutbah"
                  onClick={(e) => handleSectionClick(e, "khutbah")}
                  className="hover:text-amber-400 transition inline-block"
                >
                  Jadwal Dewan Khutbah
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-amber-400 transition inline-block"
                >
                  Blog & Artikel
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Layanan & Fasilitas */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Layanan & Fasilitas
            </h4>
            <ul className="space-y-2.5 text-xs text-emerald-200/80 font-medium">
              <li>
                <Link
                  href="/#audio-visual-hall"
                  onClick={(e) => handleSectionClick(e, "audio-visual-hall")}
                  className="hover:text-amber-400 transition inline-block"
                >
                  Sewa Aula Serbaguna
                </Link>
              </li>
              <li>
                <Link
                  href="/#donasi"
                  onClick={(e) => handleSectionClick(e, "donasi")}
                  className="hover:text-amber-400 transition inline-block"
                >
                  Gerbang Infaq QRIS
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/6285210535379?text=Assalamualaikum...%20Saya%20memerlukan%20informasi%20bantuan%20ambulans%20Masjid."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition inline-block"
                >
                  Pelayanan Ambulans Gratis
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/62895414283161?text=Assalamualaikum...%20Saya%20ingin%20berkonsultasi%20syariah."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition inline-block"
                >
                  Konseling & Konsultasi Syari&apos;ah
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Akses DKM & Kotak Saran (Stacked) */}
          <div className="space-y-4">
            {/* Box Admin */}
            <div className="space-y-2.5 bg-emerald-900/35 border border-emerald-800/50 p-3.5 rounded-2xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Internal DKM
              </h4>
              <p className="text-[11px] text-emerald-200/70 leading-relaxed">
                Kelola artikel, kajian, booking aula, & laporan keuangan masjid.
              </p>
              <Link
                href="/login"
                className="flex items-center justify-center gap-1.5 w-full text-center text-xs text-amber-400 font-bold border border-amber-400/70 hover:bg-amber-400 hover:text-emerald-950 transition-colors duration-200 py-1.5 px-3 rounded-xl"
              >
                Masuk Dashboard
              </Link>
            </div>

            {/* Box Saran & Masukan */}
            <div className="space-y-2.5 bg-emerald-900/35 border border-emerald-800/50 p-3.5 rounded-2xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <MessageSquareHeart className="w-3.5 h-3.5" /> Saran & Masukan
              </h4>
              <p className="text-[11px] text-emerald-200/70 leading-relaxed">
                Kantor sekretariat menerima aspirasi jemaah setiap hari kerja (08:30 - 16:30 WIB).
              </p>
              <a
                href="https://forms.gle/3JxrimyLqbBcJ3kG8"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 w-full text-center text-xs text-emerald-100 font-semibold bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-700/60 hover:text-white transition-colors duration-200 py-1.5 px-3 rounded-xl"
              >
                Kirim Saran Jemaah
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Social Links */}
        <div className="pt-8 mt-8 border-t border-emerald-900/80 text-xs text-emerald-300/70 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            &copy; {new Date().getFullYear()} Design & Development by{" "}
            <a
              href="https://solivate.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 font-medium transition cursor-pointer"
            >
              Solivate Studio
            </a>
            . All Rights Reserved.
          </div>

          <div className="flex items-center gap-3 text-emerald-300 my-2 sm:my-0">
            <a
              href="https://instagram.com/masjidrayapuritelukjambe"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-emerald-900/40 border border-emerald-800/70 hover:bg-amber-400 hover:text-emerald-950 hover:border-amber-400 transition"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://web.facebook.com/pages/Aula%20Masjid%20Raya%20Puri%20Teluk%20Jambe%20(PERURI)%20Karawang/732935826736923/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-emerald-900/40 border border-emerald-800/70 hover:bg-amber-400 hover:text-emerald-950 hover:border-amber-400 transition"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://www.youtube.com/@masjidrayapuritelukjambe_TV"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-emerald-900/40 border border-emerald-800/70 hover:bg-amber-400 hover:text-emerald-950 hover:border-amber-400 transition"
              aria-label="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400/80">
            <span>Masyarakat Transparansi Syari&apos;ah Indonesia</span>
            <span>•</span>
            <span>Amanah & Profesional</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
