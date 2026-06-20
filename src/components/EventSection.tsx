import { useState, FormEvent } from 'react';
import { Calendar, Clock, MapPin, User, ChevronRight, CheckCircle, Search, Sparkles } from 'lucide-react';
import { EventActivity } from '../types';

interface EventSectionProps {
  events: EventActivity[];
  onRegisterEvent: (eventId: string) => void;
}

export default function EventSection({ events, onRegisterEvent }: EventSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<'Semua' | 'Dakwah' | 'Sosial'>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [registeringEvent, setRegisteringEvent] = useState<EventActivity | null>(null);
  const [regForm, setRegForm] = useState({ name: '', phone: '' });
  const [regSuccess, setRegSuccess] = useState(false);

  // Filters
  const filteredEvents = events.filter((evt) => {
    const matchesCategory = selectedCategory === 'Semua' || evt.category === selectedCategory;
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (evt.speaker && evt.speaker.toLowerCase().includes(searchQuery.toLowerCase())) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleRegisterSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!regForm.name || !regForm.phone) return;

    // Simulate update in state
    if (registeringEvent) {
      onRegisterEvent(registeringEvent.id);
      setRegSuccess(true);
      setTimeout(() => {
        setRegSuccess(false);
        setRegisteringEvent(null);
        setRegForm({ name: '', phone: '' });
      }, 2000);
    }
  };

  const handleRegisterWhatsApp = (evt: EventActivity) => {
    const waNumber = "6281219118993"; // dari 081219118993
    const message = `Assalamualaikum Admin, saya ingin mendaftar untuk mengikuti kegiatan:\n\n*${evt.title}*\nTanggal: ${evt.date}\nWaktu: ${evt.time}\n\nMohon informasi selanjutnya.`;
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="kegiatan" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Program & Kegiatan</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
            Syiar Dakwah & Kemaslahatan Sosial
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Temukan jadwal kajian ilmiah keislaman (Dakwah) dan inisiatif kepedulian nyata (Sosial) untuk bersama menggapai keridhaan Allah Ta'ala.
          </p>
        </div>

        {/* Filters and Search Bar Container */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 pb-4 border-b border-gray-200">

          {/* Tabs */}
          <div className="flex bg-gray-100 p-1.5 rounded-xl w-full md:w-auto">
            {['Semua', 'Dakwah', 'Sosial'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat as any)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-emerald-700'
                  }`}
              >
                {cat === 'Semua' ? 'Semua Kegiatan' : cat === 'Dakwah' ? '📖 Dakwah & Kajian' : '🤝 Sosial & Bakti'}
              </button>
            ))}
          </div>

          {/* Search Box */}
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

        {/* Events Grid layout */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm max-w-xl mx-auto">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-lg font-bold text-gray-800">Tidak ada kegiatan ditemukan</h3>
            <p className="text-sm text-gray-500 mt-1">Coba sesuaikan kata pencarian atau pilih kategori lain.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6.5">
            {filteredEvents.map((evt) => {
              const fillPercentage = evt.capacity ? Math.min(100, Math.floor((evt.registeredCount / evt.capacity) * 100)) : 100;

              return (
                <div
                  key={evt.id}
                  id={`activity-card-${evt.id}`}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-100 transition-all hover:-translate-y-0.5 card-shadow flex flex-col group h-full"
                >
                  {/* Card Banner */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={evt.image}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {/* Badge Category */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${evt.category === 'Dakwah'
                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                        : 'bg-amber-500 text-emerald-950 shadow-sm shadow-amber-500/20'
                        }`}>
                        {evt.category}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* Technical Info Row */}
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

                      <h3 className="font-bold text-gray-900 group-hover:text-emerald-700 transition line-clamp-1">
                        {evt.title}
                      </h3>

                      <p className="text-gray-600 text-xs md:text-sm line-clamp-2 leading-relaxed">
                        {evt.description}
                      </p>

                      {/* Speakers Row */}
                      <div className="pt-3.5 border-t border-gray-100 flex items-center gap-2">
                        <div className="p-1.5 bg-emerald-50 rounded text-emerald-700 shrink-0">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <div className="text-xs">
                          <div className="text-gray-400 font-medium">Pengisi / Penanggungjawab</div>
                          <div className="font-semibold text-gray-800 line-clamp-1">{evt.speaker || 'Panitia DKM'}</div>
                        </div>
                      </div>

                      {/* Location Row */}
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                        <span className="line-clamp-1">{evt.location}</span>
                      </div>
                    </div>

                    {/* Progress Bar & CTA */}
                    <div className="pt-5 mt-5 border-t border-gray-100 space-y-4">
                      {evt.capacity && evt.capacity <= 500 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] font-semibold text-gray-500">
                            <span>Kuota Terdaftar: {evt.registeredCount}/{evt.capacity} Jamaah</span>
                            <span className="text-emerald-600">{fillPercentage}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${fillPercentage > 85 ? 'bg-amber-500' : 'bg-emerald-600'
                                }`}
                              style={{ width: `${fillPercentage}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <button
                        id={`btn-register-${evt.id}`}
                        onClick={() => handleRegisterWhatsApp(evt)}
                        className="w-full bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white font-bold py-2.5 rounded-xl border border-emerald-100 hover:border-emerald-600 transition flex items-center justify-center gap-1.5 text-xs md:text-sm cursor-pointer group/btn"
                      >
                        <span>Ikuti Kegiatan</span>
                        <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Help Box */}
        <div className="mt-14 emerald-gradient text-white rounded-3xl p-6.5 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-800 card-shadow relative overflow-hidden">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-amber-500/5 rounded-full blur-2xl" />
          <div className="space-y-2 relative z-10">
            <h3 className="text-lg md:text-xl font-bold">Butuh Layanan Kedinasan atau Sosial Darurat?</h3>
            <p className="text-xs md:text-sm text-emerald-200">
              Butuh bantuan ambulans darurat (Zakat/Santunan), bimbingan konseling syariah keluarga, atau pengantaran fardhu kifayah jenazah? Hubungi tim siaga DKM kami siap membantu 24 Jam.
            </p>
          </div>
          <a
            href="https://wa.me/6285210535379?text=Assalamualaikum%20Admin%20DKM%20Masjid%20Raya%20PTJ.%20Saya%20memerlukan%20bantuan%20layanan%20sosial%20darurat."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto text-center shrink-0 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-amber-500/10 cursor-pointer relative z-10"
          >
            Hubungi Siaga Sosial DKM
          </a>
        </div>
      </div>

      {/* Registration Modal Popup Dialog */}
      {registeringEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 relative shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">

            <button
              onClick={() => setRegisteringEvent(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-extrabold text-lg cursor-pointer"
            >
              ✕
            </button>

            {regSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-gray-900">Pendaftaran Berhasil!</h3>
                <p className="text-xs text-gray-500">
                  Konfirmasi kehadiran telah dikirim ke panitia. Harap hadir 10 menit sebelum acara. Jazakumullah Khairan!
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="text-center pb-2 border-b border-gray-100">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                    Registrasi Kehadiran
                  </span>
                  <h3 className="text-base font-bold text-gray-900 line-clamp-1 mt-2">
                    {registeringEvent.title}
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Sesi: {registeringEvent.date} ({registeringEvent.time})
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Nama Lengkap Jamaah
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Muhammad Akhyar"
                      value={regForm.name}
                      onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                      className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Nomor WhatsApp Aktif
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Contoh: 081234567890"
                      value={regForm.phone}
                      onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                      className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <p className="text-[10px] text-gray-500 italic">
                    * Data pendaftaran disimpan oleh DKM Raya Puri Telukjambe untuk keperluan estimasi kuota konsumsi & verifikasi tempat duduk.
                  </p>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRegisteringEvent(null)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl py-2.5 text-xs font-bold transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2.5 text-xs font-bold transition shadow-md shadow-emerald-600/10 cursor-pointer"
                  >
                    Daftar Sekarang
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
