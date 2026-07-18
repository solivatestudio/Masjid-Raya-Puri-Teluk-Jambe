'use client';
import { useState, FormEvent } from 'react';
import { Calendar, Clock, MapPin, User, ChevronRight, Search, Sparkles } from 'lucide-react';
import type { EventActivity } from '@/types';

interface EventSectionProps {
  events: EventActivity[];
}

const months: Record<string, string> = {
  januari: 'Jan', februari: 'Feb', maret: 'Mar', april: 'Apr',
  mei: 'May', juni: 'Jun', juli: 'Jul', agustus: 'Aug',
  september: 'Sep', oktober: 'Oct', november: 'Nov', desember: 'Dec',
};

function getEventStatus(dateStr: string) {
  if (dateStr.toLowerCase().includes('setiap')) return { passed: false, liveStreamReady: true };
  let cleanDate = dateStr.replace(/(Ahad|Senin|Selasa|Rabu|Kamis|Jumat|Sabtu|Minggu),?/i, '').trim();
  for (const [id, en] of Object.entries(months)) {
    if (cleanDate.toLowerCase().includes(id)) {
      cleanDate = cleanDate.toLowerCase().replace(id, en);
      break;
    }
  }
  const eventDate = new Date(cleanDate);
  if (isNaN(eventDate.getTime())) return { passed: false, liveStreamReady: true };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return { passed: eventDate < today, liveStreamReady: eventDate <= tomorrow };
}

export default function EventSection({ events }: EventSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<'Semua' | 'Dakwah' | 'Dauroh'>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllMobile, setShowAllMobile] = useState(false);

  const filteredEvents = events.filter((evt) => {
    const matchesCategory = selectedCategory === 'Semua' || evt.category === selectedCategory;
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (evt.speaker && evt.speaker.toLowerCase().includes(searchQuery.toLowerCase())) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleRegisterWhatsApp = (evt: EventActivity) => {
    const waNumber = '62895414283161';
    const message = `Assalamualaikum Admin, saya ingin mendaftar untuk mengikuti kegiatan:\n\n*${evt.title}*\nTanggal: ${evt.date}\nWaktu: ${evt.time}\n\nMohon informasi selanjutnya.`;
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  const handleRegisterWhatsAppDauroh = (evt: EventActivity) => {
    const waNumber = '6285216590900';
    const message = `Assalamualaikum Admin, saya ingin mendaftar untuk mengikuti kegiatan Dauroh Quran:\n\n*${evt.title}*\nTanggal: ${evt.date}\nWaktu: ${evt.time}\n\nMohon informasi selanjutnya.`;
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="kegiatan" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Program & Kegiatan</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">Syiar Dakwah & Kegiatan Dauroh</h2>
          <p className="mt-3 text-base text-slate-600">
            Temukan jadwal kajian ilmiah keislaman (Dakwah) dan inisiatif kepedulian nyata untuk bersama menggapai keridhaan Allah Ta&apos;ala.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <div className="flex bg-gray-100 p-1.5 rounded-xl w-full md:w-auto">
            {['Semua', 'Dakwah', 'Dauroh'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat as 'Semua' | 'Dakwah' | 'Dauroh')}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600 hover:text-emerald-700'
                }`}
              >
                {cat === 'Semua' ? 'Semua Kegiatan' : cat === 'Dakwah' ? '📖 Dakwah & Kajian' : "🤝 Dauroh Al-Qur'an"}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Cari kegiatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-300 text-gray-900 rounded-xl pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none transition"
            />
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm max-w-xl mx-auto">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-lg font-bold text-gray-800">Tidak ada kegiatan ditemukan</h3>
            <p className="text-sm text-gray-500 mt-1">Coba sesuaikan kata pencarian atau pilih kategori lain.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt, index) => {
              const fillPercentage = evt.capacity ? Math.min(100, Math.floor((evt.registeredCount / evt.capacity) * 100)) : 100;
              const isHiddenOnMobile = index >= 2 && !showAllMobile;
              const { passed, liveStreamReady } = getEventStatus(evt.date);
              return (
                <div
                  key={evt.id}
                  className={`bg-white rounded-3xl overflow-hidden border border-slate-100 transition-all hover:-translate-y-0.5 card-shadow flex-col group h-full ${
                    isHiddenOnMobile ? 'hidden md:flex' : 'flex'
                  }`}
                >
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img src={evt.image} alt={evt.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    <div className="absolute top-4 left-4 z-10">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        evt.category === 'Dakwah' ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20' : 'bg-amber-500 text-emerald-950 shadow-sm shadow-amber-500/20'
                      }`}>
                        {evt.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{evt.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{evt.time}</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-900 group-hover:text-emerald-700 transition line-clamp-1">{evt.title}</h3>
                      <p className="text-gray-600 text-xs md:text-sm line-clamp-2 leading-relaxed">{evt.description}</p>
                      <div className="pt-3.5 border-t border-gray-100 flex items-center gap-2">
                        <div className="p-1.5 bg-emerald-50 rounded text-emerald-700 shrink-0">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <div className="text-xs">
                          <div className="text-gray-400 font-medium">Pengisi / Penanggungjawab</div>
                          <div className="font-semibold text-gray-800 line-clamp-1">{evt.speaker || 'Panitia DKM'}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                        <span className="line-clamp-1">{evt.location}</span>
                      </div>
                    </div>
                    <div className="pt-5 mt-5 border-t border-gray-100 space-y-4">
                      {evt.capacity !== undefined && evt.capacity <= 500 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] font-semibold text-gray-500">
                            <span>Kuota Terdaftar: {evt.registeredCount}/{evt.capacity} Jamaah</span>
                            <span className="text-emerald-600">{fillPercentage}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-500 ${fillPercentage > 85 ? 'bg-amber-500' : 'bg-emerald-600'}`} style={{ width: `${fillPercentage}%` }} />
                          </div>
                        </div>
                      )}
                      {liveStreamReady ? (
                        <a href="https://youtube.com/@masjidrayapuritelukjambe_tv?si=ck_pAAn1s1Uza8Hf" target="_blank" rel="noopener noreferrer" className="w-full bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white font-bold py-2.5 rounded-xl border border-emerald-100 hover:border-emerald-600 transition flex items-center justify-center gap-1.5 text-xs md:text-sm cursor-pointer">
                          Tonton Live Streaming
                        </a>
                      ) : (
                        <button disabled className="w-full bg-gray-100 text-gray-400 font-bold py-2.5 rounded-xl border border-gray-200 cursor-not-allowed flex items-center justify-center gap-1.5 text-xs md:text-sm">
                          Menunggu Jadwal Live
                        </button>
                      )}
                      {!passed ? (
                        <button
                          onClick={() => (evt.category === 'Dauroh' ? handleRegisterWhatsAppDauroh(evt) : handleRegisterWhatsApp(evt))}
                          className="w-full bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white font-bold py-2.5 rounded-xl border border-emerald-100 hover:border-emerald-600 transition flex items-center justify-center gap-1.5 text-xs md:text-sm cursor-pointer"
                        >
                          <span>Ikuti Kegiatan</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button disabled className="w-full bg-gray-100 text-gray-400 font-bold py-2.5 rounded-xl border border-gray-200 cursor-not-allowed flex items-center justify-center gap-1.5 text-xs md:text-sm">
                          <span>Telah Berlalu</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!showAllMobile && filteredEvents.length > 2 && (
          <div className="mt-8 flex justify-center md:hidden">
            <button onClick={() => setShowAllMobile(true)} className="px-6 py-2.5 bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-bold rounded-xl transition text-sm cursor-pointer shadow-sm">
              Lebih banyak
            </button>
          </div>
        )}

        <div className="mt-14 emerald-gradient text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-800 card-shadow relative overflow-hidden">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-amber-500/5 rounded-full blur-2xl" />
          <div className="space-y-2 relative z-10">
            <h3 className="text-lg md:text-xl font-bold">Butuh bantuan Ambulans Darurat?</h3>
            <p className="text-xs md:text-sm text-emerald-200">Hubungi tim siaga DKM, Kami siap membantu anda.</p>
          </div>
          <a href="https://wa.me/6285210535379?text=Assalamualaikum%20Admin%20DKM%20Masjid%20Raya%20PTJ.%20Saya%20memerlukan%20bantuan%20layanan%20sosial%20darurat." target="_blank" rel="noopener noreferrer" className="w-full md:w-auto text-center shrink-0 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold px-6 py-3 rounded-xl shadow-lg cursor-pointer relative z-10">
            Hubungi Siaga Sosial DKM
          </a>
        </div>

        <div className="mt-5 emerald-gradient text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-800 card-shadow relative overflow-hidden">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-amber-500/5 rounded-full blur-2xl" />
          <div className="space-y-2 relative z-10">
            <h3 className="text-lg md:text-xl font-bold">Bingung Ingin Donasi Zakat, Infaq, Sedekah, Wakaf?</h3>
            <p className="text-xs md:text-sm text-emerald-200">
              Dapatkan panduan zakat pribadi, hitung zakat, atau tanyakan kehalalan donasi dari UPZ By Masjid Raya Puri Telukjambe.
            </p>
          </div>
          <a href="https://wa.me/6281380908156?text=Assalamualaikum%20Admin%20DKM%20Saya%20ingin%20konsultasi%20zakat" target="_blank" rel="noopener noreferrer" className="w-full md:w-auto text-center shrink-0 border border-white hover:bg-white hover:text-emerald-800 text-white font-bold px-6 py-3 rounded-xl shadow-lg cursor-pointer relative z-10">
            Hubungi Konsultasi Zakat
          </a>
        </div>
      </div>
    </section>
  );
}
