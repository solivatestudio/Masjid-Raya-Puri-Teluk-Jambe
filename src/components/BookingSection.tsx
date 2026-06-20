import { useState, FormEvent } from 'react';
import { HALL_INFO, BOOKING_PACKAGES } from '../data';
import { Landmark, ArrowRight, MessageSquare, ShieldCheck, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';

const hallBackground = "/src/assets/images/aula.webp";

export default function BookingSection() {
  const [selectedPackage, setSelectedPackage] = useState(BOOKING_PACKAGES[1].id); // Mawaddah default
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [timeStart, setTimeStart] = useState('08:00');
  const [timeEnd, setTimeEnd] = useState('14:00');
  const [purpose, setPurpose] = useState('Walimah Pernikahan (Akad & Resepsi)');
  const [customPurpose, setCustomPurpose] = useState('');
  const [needEO, setNeedEO] = useState(false);
  const [needCatering, setNeedCatering] = useState(false);
  const [needSoundUpgrade, setNeedSoundUpgrade] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Select package trigger updates form
  const number = '6281218595315'

  const message = `Assalamu'alaykum Wr. Wb. Saya ingin mengajukan reservasi Aula Serbaguna`

  const handleWhatsapp = () => {
    window.open(`https://wa.me/${number}?text=${message}`)
  }

  return (
    <section id="audio-visual-hall" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider">
            Sewa Aula Syari'ah & Serbaguna
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mt-3">
            Aula Serbaguna Masjid Raya Puri Teluk Jambe
          </h2>
          <p className="mt-3 text-base text-gray-600">
            Fasilitas ruang pertemuan megah bernuansa islami modern. Tersedia untuk resepsi pernikahan, haflatul ikhtitam, seminar nasional, wisuda tahfiz, serta rapat kerja kemasyarakatan.
          </p>
        </div>

        {/* Info & Specifications Showcase block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">

          {/* Left specification picture banner */}
          <div className="lg:col-span-7 rounded-2xl overflow-hidden relative min-h-[320px] lg:min-h-auto shadow-md border border-gray-100 flex flex-col justify-end">
            <img
              src={hallBackground}
              alt="Aula Serbaguna"
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/60 to-transparent z-10" />

            <div className="relative z-20 p-6 md:p-8 text-white space-y-4">
              <div className="inline-flex items-center gap-1 bg-amber-500 text-emerald-950 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                Spesifikasi Utama Gedung
              </div>

              <h3 className="text-2xl font-bold">{HALL_INFO.name}</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2">
                <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
                  <span className="block text-[10px] text-emerald-200 uppercase font-bold">Luas Area Hall</span>
                  <span className="text-sm font-bold font-mono">{HALL_INFO.dimensions}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
                  <span className="block text-[10px] text-emerald-200 uppercase font-bold">Daya Tampung Maksimal</span>
                  <span className="text-sm font-bold font-mono">{HALL_INFO.capacity}</span>
                </div>
              </div>

              {/* Security verification stamp */}
              <div className="flex items-center gap-2 text-xs text-amber-300">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span className="font-semibold">Aturan Syariat Islami (Tidak bercampur baur berlebihan & menu halal)</span>
              </div>
            </div>
          </div>

          {/* Right facilities highlights */}
          <div className="lg:col-span-5 bg-gray-50 rounded-2xl p-6.5 border border-gray-200 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-900 border-b border-gray-200 pb-2">
                Fasilitas Gedung Termasuk Sewa:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                {HALL_INFO.facilities.map((facility, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{facility}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <span className="text-[11px] text-gray-500 font-medium italic">
                * Keuntungan sewa dialokasikan penuh untuk kas pemeliharaan masjid Raya Puri Telukjambe.
              </span>
            </div>
          </div>

        </div>

        {/* Pricing & Booking Packages Listing */}
        <div className="space-y-8 mb-16">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900">Pilihan Paket Sewa Aula</h3>
            <p className="text-sm text-gray-500 mt-1">Kami menyediakan paket fleksibel sesuai anggaran dan format acara Anda.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BOOKING_PACKAGES.map((pkg) => {
              const isSelected = selectedPackage === pkg.id;

              return (
                <div
                  key={pkg.id}
                  className={`bg-white rounded-3xl border transition-all p-6 flex flex-col justify-between relative ${pkg.isPopular
                    ? 'ring-2 ring-emerald-500 card-shadow md:-translate-y-2'
                    : 'border-slate-100 card-shadow hover:-translate-y-0.5'
                    }`}
                >
                  {pkg.isPopular && (
                    <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Terfavorit
                    </span>
                  )}

                  <div className="space-y-4">
                    <div className="text-center pb-4 border-b border-gray-100">
                      <h4 className="font-extrabold text-sm text-gray-900">{pkg.name}</h4>
                      <p className="text-2xl font-black text-emerald-700 tracking-tight mt-2">{pkg.price}</p>
                      <span className="text-[10px] text-gray-400 font-semibold uppercase">Per Sesi Kontrak</span>
                    </div>

                    <ul className="space-y-2.5 pt-2">
                      {pkg.features.map((feat, i) => (
                        <li key={i} className="flex gap-2 text-xs text-gray-600 leading-tight">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 mt-6 border-t border-gray-100">
                    <button
                      id={`btn-select-pkg-${pkg.id}`}
                      onClick={() => handleWhatsapp()}
                      className="w-full py-2.5 rounded-xl font-bold text-xs md:text-sm transition cursor-pointer bg-emerald-50 hover:bg-emerald-100 text-emerald-800"
                    >
                      Pilih Paket Ini
                    </button>
                    <p className='text-center mt-5 italic text-xs text-gray-500 font-medium'>* Tidak termasuk dekorasi, informasi detail lainnya, silahkan hubungi admin di kolom bawah</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reservation Request Interactive Form */}
        <div className="mt-14 emerald-gradient text-white rounded-3xl p-6.5 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-800 card-shadow relative overflow-hidden">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-amber-500/5 rounded-full blur-2xl" />
          <div className="space-y-2 relative z-10">
            <h3 className="text-lg md:text-xl font-bold">Ada hal yang ingin ditanyakan?</h3>
            <p className="text-xs md:text-sm text-emerald-200">
              Silahkan hubungi admin untuk konsultasi dan bertanya-tanya, Gratis!
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <a
              href="https://wa.me/6285210535379."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto text-center shrink-0 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-amber-500/10 cursor-pointer relative z-10"
            >
              Hubungi Admin Aula 1
            </a>

            <a
              href="https://wa.me/6285210535379."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto text-center shrink-0 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-amber-500/10 cursor-pointer relative z-10"
            >
              Hubungi Admin Aula 2
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
