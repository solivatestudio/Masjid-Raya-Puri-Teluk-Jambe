import { motion } from 'motion/react';
import { Landmark, ArrowRight, HeartHandshake, CalendarClock, Compass } from 'lucide-react';

const heroImage = "/src/assets/images/mosque_hero_bg_1780566419443.png";

interface HeroSectionProps {
  onDonateClick: () => void;
  onSermonClick: () => void;
  onBookingClick: () => void;
}

export default function HeroSection({ onDonateClick, onSermonClick, onBookingClick }: HeroSectionProps) {
  return (
    <section id="hero" className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center emerald-gradient overflow-hidden">
      {/* Background Image with Layer Mask Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Masjid Al-Muttaqin"
          className="w-full h-full object-cover object-center opacity-40 scale-105 transform transition duration-10000 hover:scale-100"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/70 to-emerald-900/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-transparent to-emerald-950/20 z-10" />
      </div>

      {/* Decorative Floating Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />

      {/* Hero Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 text-center lg:text-left flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          {/* Badge Tag */}
          <div className="inline-flex items-center gap-2 bg-emerald-900/80 border border-emerald-700/50 backdrop-blur px-4 py-1.5 rounded-full text-xs font-semibold text-amber-400 tracking-wide">
            <Landmark className="w-3.5 h-3.5" />
            <span>Dewan Kemakmuran Masjid (DKM) Pasifik</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Masjid <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-300">Al-Muttaqin</span>
          </h1>

          <p className="text-lg text-emerald-100 max-w-2xl leading-relaxed font-light mx-auto lg:mx-0">
            Membangun oase kedamaian spiritual, menguatkan ukhuwah islamiyah, dan melayani umat secara profesional, transparan, dan amanah di pusat administrasi DKI Jakarta.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <button
              id="cta-donate"
              onClick={onDonateClick}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 active:scale-98 text-emerald-950 font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition flex items-center justify-center gap-2 group cursor-pointer"
            >
              <HeartHandshake className="w-5 h-5 text-emerald-900" />
              <span>Donasi Sekarang</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              id="cta-schedule"
              onClick={onSermonClick}
              className="w-full sm:w-auto bg-emerald-900/90 hover:bg-emerald-800 text-white border border-emerald-700 font-semibold px-6 py-3.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <CalendarClock className="w-5 h-5 text-emerald-300" />
              <span>Jadwal Khutbah</span>
            </button>

            <button
              id="cta-booking"
              onClick={onBookingClick}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/15 text-emerald-100 border border-white/20 font-semibold px-6 py-3.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer backdrop-blur"
            >
              <Compass className="w-5 h-5 text-amber-400" />
              <span>Sewa Aula</span>
            </button>
          </div>

          {/* Quick Statistics Counters */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6 max-w-md mx-auto lg:mx-0 border-t border-emerald-900">
            <div>
              <div className="text-2xl font-bold font-mono text-amber-400">10,000+</div>
              <div className="text-xs text-emerald-300/80">Jamaah Aktif Bulanan</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-amber-400">24 Jam</div>
              <div className="text-xs text-emerald-300/80">Layanan Siaga Sosial</div>
            </div>
            <div className="col-span-2 md:col-span-1">
              <div className="text-2xl font-bold font-mono text-amber-400">100%</div>
              <div className="text-xs text-emerald-300/80">Laporan Keuangan Terbuka</div>
            </div>
          </div>
        </div>

        {/* Feature Cards Showcase */}
        <div className="flex-1 w-full max-w-md hidden md:block">
          <div className="bg-emerald-950/40 border border-emerald-800/60 backdrop-blur-md rounded-2xl p-6 card-shadow space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400">Layanan Unggulan Masjid</h3>
            
            <div className="space-y-3.5">
              <div className="flex gap-4 p-3 bg-emerald-900/60 rounded-xl border border-emerald-800/50">
                <div className="w-10 h-10 rounded-lg bg-emerald-800 flex items-center justify-center shrink-0">
                  <span className="text-base">🕌</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">Pesantren & Kajian Dakwah Syar'i</h4>
                  <p className="text-xs text-emerald-200/70">Program pendidikan tahsin & bedah kitab hadrawi terstruktur.</p>
                </div>
              </div>

              <div className="flex gap-4 p-3 bg-emerald-900/60 rounded-xl border border-emerald-800/50">
                <div className="w-10 h-10 rounded-lg bg-emerald-800 flex items-center justify-center shrink-0">
                  <span className="text-base">🚑</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">Layanan Ambulans & Sosial Siaga</h4>
                  <p className="text-xs text-emerald-200/70">Siap melayani kebutuhan gawat darurat warga 24 jam gratis.</p>
                </div>
              </div>

              <div className="flex gap-4 p-3 bg-emerald-900/60 rounded-xl border border-emerald-800/50">
                <div className="w-10 h-10 rounded-lg bg-emerald-800 flex items-center justify-center shrink-0">
                  <span className="text-base">🏛️</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">Aula Serbaguna Syariah</h4>
                  <p className="text-xs text-emerald-200/70">Disewakan untuk walimah nikah, seminar, & rapat akbar umat.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
