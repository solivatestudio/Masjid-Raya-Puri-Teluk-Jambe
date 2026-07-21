'use client';
import { FormEvent, useEffect, useState } from 'react';
import { HALL_INFO, BOOKING_PACKAGES } from '@/data';
import { ArrowRight, CheckCircle2, ShieldCheck, ChevronLeft, ChevronRight, Loader2, Send } from 'lucide-react';
import { WA_NUMBERS } from '@/constants';

const hallBackground = '/images/aula.webp';
const ADMIN_WA = WA_NUMBERS.ADMIN_AULA;

export default function BookingSection() {
  const [selectedPackage, setSelectedPackage] = useState(BOOKING_PACKAGES[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState('');

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

        <div className="space-y-8 mb-12">
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
                    href="#booking-aula-form"
                    onClick={() => setSelectedPackage(pkg.id)}
                    className="block w-full py-2.5 rounded-xl font-bold text-xs md:text-sm text-center transition cursor-pointer bg-emerald-50 hover:bg-emerald-100 text-emerald-800"
                  >
                    Pilih Paket Ini
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div id="booking-aula-form" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5">
            <AvailabilityCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
          </div>
          <div className="lg:col-span-7">
            <BookingRequestForm selectedDate={selectedDate} selectedPackage={selectedPackage} onPackageChange={setSelectedPackage} />
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

      </div>
    </section>
  );
}

function BookingRequestForm({
  selectedDate,
  selectedPackage,
  onPackageChange,
}: {
  selectedDate: string;
  selectedPackage: string;
  onPackageChange: (value: string) => void;
}) {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [date, setDate] = useState(selectedDate);
  const [timeStart, setTimeStart] = useState('08:00');
  const [timeEnd, setTimeEnd] = useState('14:00');
  const [purpose, setPurpose] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedDate) setDate(selectedDate);
  }, [selectedDate]);

  const selectedPackageData = BOOKING_PACKAGES.find((pkg) => pkg.id === selectedPackage) || BOOKING_PACKAGES[0];

  const buildWhatsappTemplate = () => {
    return [
      'Assalamualaikum Admin Aula Masjid Raya Puri Telukjambe.',
      '',
      'Saya sudah mengirim permohonan booking aula melalui website dengan data:',
      `Nama: ${name}`,
      `No. WhatsApp: ${whatsapp}`,
      `Tanggal: ${date}`,
      `Waktu: ${timeStart} - ${timeEnd}`,
      `Paket: ${selectedPackageData?.name || '-'}`,
      `Keperluan: ${purpose}`,
      notes ? `Catatan: ${notes}` : '',
      '',
      'Mohon konfirmasi ketersediaan dan proses selanjutnya. Terima kasih.',
    ].filter(Boolean).join('\n');
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');
    if (!name || !whatsapp || !date || !timeStart || !timeEnd || !purpose) {
      setError('Nama, WhatsApp, tanggal, waktu, dan keperluan wajib diisi.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          whatsapp,
          date,
          timeStart,
          timeEnd,
          purpose,
          packageId: selectedPackage,
          needOrganizer: false,
          notes,
        }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload.error || 'Gagal mengirim booking');
      setMessage('Permohonan booking tersimpan dengan status pending. WhatsApp admin akan terbuka untuk konfirmasi.');
      window.open(`https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(buildWhatsappTemplate())}`, '_blank', 'noopener,noreferrer');
      setName('');
      setWhatsapp('');
      setPurpose('');
      setNotes('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
      <div>
        <h3 className="text-xl font-bold text-gray-900">Form Booking Aula</h3>
        <p className="mt-1 text-xs text-gray-500">Data masuk ke dashboard admin sebagai pending, lalu lanjut konfirmasi melalui WhatsApp.</p>
      </div>
      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">{error}</div>}
      {message && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">{message}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">Nama Pemesan</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600" placeholder="Nama lengkap" />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">No. WhatsApp</label>
          <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value.replace(/[^\d+]/g, ''))} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600" placeholder="08xxxxxxxxxx" />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">Tanggal</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600" />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">Paket</label>
          <select value={selectedPackage} onChange={(e) => onPackageChange(e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white">
            {BOOKING_PACKAGES.map((pkg) => <option key={pkg.id} value={pkg.id}>{pkg.name} - {pkg.price}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">Jam Mulai</label>
          <input type="time" value={timeStart} onChange={(e) => setTimeStart(e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600" />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">Jam Selesai</label>
          <input type="time" value={timeEnd} onChange={(e) => setTimeEnd(e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">Keperluan</label>
          <input value={purpose} onChange={(e) => setPurpose(e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600" placeholder="Contoh: Walimah, seminar, rapat keluarga" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">Catatan</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600" placeholder="Opsional: detail acara, jumlah tamu, kebutuhan tambahan" />
        </div>
      </div>
      <button type="submit" disabled={submitting} className="w-full rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-bold text-sm py-3 flex items-center justify-center gap-2">
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        Kirim Booking & Konfirmasi WhatsApp
      </button>
    </form>
  );
}

function AvailabilityCalendar({ selectedDate, onSelectDate }: { selectedDate: string; onSelectDate: (date: string) => void }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookedDates, setBookedDates] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    const refreshCalendar = () => {
      fetch('/api/bookings/calendar', { cache: 'no-store' })
        .then((res) => res.json())
        .then((data) => {
          if (!active) return;
          if (Array.isArray(data)) {
            setBookedDates(data);
          } else if (data && data.bookedDates) {
            setBookedDates(data.bookedDates);
          }
        })
        .catch((err) => console.error(err));
    };

    refreshCalendar();
    const interval = window.setInterval(refreshCalendar, 15000);
    window.addEventListener('focus', refreshCalendar);
    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener('focus', refreshCalendar);
    };
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
    const isSelected = selectedDate === dateStr;

    days.push(
      <button type="button" key={i} disabled={isBooked} onClick={() => onSelectDate(dateStr)} className={`p-2 border rounded-lg text-center text-sm font-medium transition ${
        isBooked ? 'bg-rose-100 text-rose-800 border-rose-200 cursor-not-allowed' : isSelected ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white text-gray-700 border-gray-100 hover:border-emerald-500 hover:text-emerald-700'
      }`}>
        {i}
      </button>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Kalender Booking Aula</h3>
          <p className="mt-1 text-xs text-gray-500">Pilih tanggal tersedia untuk mengisi form booking.</p>
        </div>
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
          <div className="w-4 h-4 rounded bg-rose-100 border border-rose-200"></div>
          <span className="text-gray-600">Tidak tersedia / telah dibooking</span>
        </div>
      </div>
    </div>
  );
}

