'use client';
import { useState, useEffect } from 'react';
import { HALL_INFO, BOOKING_PACKAGES } from '@/data';
import { ArrowRight, CheckCircle2, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { WA_NUMBERS } from '@/constants';

const hallBackground = '/images/aula.webp';
const ADMIN_WA = WA_NUMBERS.ADMIN_AULA;

export default function BookingSection() {
  return (
    <section id="audio-visual-hall" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider">
            Sewa Aula Syari&apos;ah & Serbaguna
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mt-3">
            Aula Serbaguna Masjid Raya Puri Teluk Jambe
          </h2>
          <p className="mt-3 text-base text-gray-600">
            Fasilitas ruang pertemuan megah bernuansa islami modern. Tersedia untuk resepsi pernikahan, haflatul ikhtitam, seminar nasional, wisuda tahfiz, serta rapat kerja kemasyarakatan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          <div className="lg:col-span-7 rounded-2xl overflow-hidden relative min-h-[320px] lg:min-h-auto shadow-md border border-gray-100 flex flex-col justify-end">
            <img src={hallBackground} alt="Aula Serbaguna" className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
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
              <div className="flex items-center gap-2 text-xs text-amber-300">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span className="font-semibold">Aturan Syariat Islami (Tidak bercampur baur berlebihan & menu halal)</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-gray-50 rounded-2xl p-6 border border-gray-200 flex flex-col justify-between">
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

        <div className="space-y-8 mb-16">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900">Pilihan Paket Sewa Aula</h3>
            <p className="text-sm text-gray-500 mt-1">Kami menyediakan paket fleksibel sesuai anggaran dan format acara Anda.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BOOKING_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`bg-white rounded-3xl border transition-all p-6 flex flex-col justify-between relative ${
                  pkg.isPopular ? 'ring-2 ring-emerald-500 card-shadow md:-translate-y-2' : 'border-slate-100 card-shadow hover:-translate-y-0.5'
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
                  <a
                    href={`https://wa.me/${ADMIN_WA}?text=Assalamualaikum%20Admin%2C%20saya%20ingin%20booking%20${encodeURIComponent(pkg.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2.5 rounded-xl font-bold text-xs md:text-sm text-center transition cursor-pointer bg-emerald-50 hover:bg-emerald-100 text-emerald-800"
                  >
                    Booking dan Tanya Detail
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 emerald-gradient text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-800 card-shadow relative overflow-hidden">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-amber-500/5 rounded-full blur-2xl" />
          <div className="space-y-2 relative z-10">
            <h3 className="text-lg md:text-xl font-bold">Ada hal yang ingin ditanyakan?</h3>
            <p className="text-xs md:text-sm text-emerald-200">Silahkan hubungi admin untuk konsultasi dan bertanya-tanya, Gratis!</p>
          </div>
          <a
            href={`https://wa.me/${ADMIN_WA}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto text-center shrink-0 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold px-6 py-3 rounded-xl shadow-lg cursor-pointer relative z-10"
          >
            Hubungi Admin Aula <ArrowRight className="w-4 h-4 inline ml-1" />
          </a>
        </div>

        <AvailabilityCalendar />
      </div>
    </section>
  );
}

function AvailabilityCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookedDates, setBookedDates] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/bookings/calendar')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.bookedDates) {
          setBookedDates(data.bookedDates);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="p-2"></div>);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const isBooked = bookedDates.includes(dateStr);

    days.push(
      <div key={i} className={`p-2 border rounded-lg text-center text-sm font-medium ${isBooked ? 'bg-green-100 text-green-800 border-green-200' : 'bg-white text-gray-700 border-gray-100'}`}>
        {i}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mt-14 relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Ketersediaan Aula</h3>
        <div className="flex items-center gap-4">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full transition cursor-pointer"><ChevronLeft className="w-5 h-5" /></button>
          <span className="font-semibold text-gray-800 w-32 text-center">{monthNames[month]} {year}</span>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full transition cursor-pointer"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-bold text-gray-500">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days}
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-white border border-gray-200"></div>
          <span className="text-gray-600">Tersedia</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-100 border border-green-200"></div>
          <span className="text-gray-600">Telah Dibooking</span>
        </div>
      </div>
    </div>
  );
}
