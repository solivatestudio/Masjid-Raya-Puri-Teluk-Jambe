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
  const handleSelectPackage = (pkgId: string) => {
    setSelectedPackage(pkgId);
    // Smooth scroll to the form
    const formElement = document.getElementById('booking-form-element');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!fullName || !whatsapp || !bookingDate) {
      alert('Mohon lengkapi Nama Anda, Nomor WhatsApp, dan Tanggal Acara.');
      return;
    }

    const matchedPkg = BOOKING_PACKAGES.find((p) => p.id === selectedPackage);
    const finalPurpose = purpose === 'Lainnya' ? customPurpose : purpose;

    // Formatting standard Indonesian WhatsApp dispatch template
    const waText = `*RESERVASI AULA SERBAGUNA MASJID RAYA PURI TELUKJAMBE*%0A` +
      `----------------------------------------------%0A` +
      `*Nama Pemesan:* ${fullName}%0A` +
      `*No. WhatsApp:* ${whatsapp}%0A` +
      `*Tanggal Acara:* ${bookingDate}%0A` +
      `*Waktu Sewa:* ${timeStart} s/d ${timeEnd}%0A` +
      `*Tujuan Penggunaan:* ${finalPurpose}%0A` +
      `*Paket yang Dipilih:* ${matchedPkg?.name || 'Kustom'}%0A` +
      `*Tambahan Layanan:*%0A` +
      `  - Event Organizer (EO): ${needEO ? 'Ya (Butuh Panitia)' : 'Tidak'}%0A` +
      `  - Rekomendasi Katering: ${needCatering ? 'Ya (Butuh Diskon Katering)' : 'Tidak'}%0A` +
      `  - Upgrade Audio/Lighting: ${needSoundUpgrade ? 'Ya (Butuh Penambahan)' : 'Tidak'}%0A` +
      `*Catatan Tambahan:* ${additionalNotes || 'Tidak ada'}%0A` +
      `----------------------------------------------%0A` +
      `Assalamualaikum Admin DKM Al-Muttaqin, saya ingin mengajukan verifikasi ketersediaan jadwal aula rincian di atas. Mohon arahan selanjutnya.`;

    // Opens WA api directly
    const waUrl = `https://wa.me/6281234567890?text=${waText}`;
    window.open(waUrl, '_blank');
  };

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
                      onClick={() => handleSelectPackage(pkg.id)}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs md:text-sm transition cursor-pointer ${isSelected
                        ? 'bg-emerald-600 text-white shadow shadow-emerald-600/15'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                        }`}
                    >
                      {isSelected ? '✓ Terpilih di Formulir' : 'Pilih Paket Ini'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reservation Request Interactive Form */}
        <div id="booking-form-element" className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 max-w-3xl mx-auto card-shadow">
          <div className="text-center pb-6 border-b border-slate-100 mb-6.5">
            <h3 className="text-xl font-bold text-slate-800">Form Formulir Reservasi Aula</h3>
            <p className="text-xs text-gray-500 mt-1">Lengkapi data berikut untuk mengirim aplikasi pemesanan tanggal ke Admin DKM via WhatsApp.</p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-5">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">Nama Lengkap Pemohon</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Akhyar Raditya"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* WhatsApp Number */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">Nomor WhatsApp Aktif</label>
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 0812XXXXXXXX"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Event Date */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">Tanggal Rencana Acara</label>
                <input
                  type="date"
                  required
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Time Start */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">Waktu Mulai Acara</label>
                <input
                  type="time"
                  required
                  value={timeStart}
                  onChange={(e) => setTimeStart(e.target.value)}
                  className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Time End */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">Waktu Selesai Acara</label>
                <input
                  type="time"
                  required
                  value={timeEnd}
                  onChange={(e) => setTimeEnd(e.target.value)}
                  className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Rental Purpose */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">Tujuan / Keperluan Rental</label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg p-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Walimah Pernikahan (Akad & Resepsi)">Walimah Pernikahan (Akad & Resepsi)</option>
                  <option value="Syarah & Seminar Keagamaan / Pendidikan">Syarah & Seminar Keagamaan / Pendidikan</option>
                  <option value="Rapat Koordinasi / Musyawarah Besar CSR">Rapat Koordinasi / Musyawarah Besar CSR</option>
                  <option value="Wisuda Penghafal Quran / Tahfidz">Wisuda Penghafal Quran / Tahfidz</option>
                  <option value="Lainnya">Lainnya (Cantumkan di bawah ini)</option>
                </select>
              </div>

              {/* Rental Package Form Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">Konfirmasi Paket Sewa Aula</label>
                <select
                  value={selectedPackage}
                  onChange={(e) => setSelectedPackage(e.target.value)}
                  className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg p-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none font-semibold text-emerald-800"
                >
                  {BOOKING_PACKAGES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.price})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom Purpose conditional */}
            {purpose === 'Lainnya' && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-150">
                <label className="block text-xs font-bold text-gray-800 mb-1">Sebutkan Tujuan Rencana Acara Anda</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pentas Seni Sekolah Islami"
                  value={customPurpose}
                  onChange={(e) => setCustomPurpose(e.target.value)}
                  className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            )}

            {/* Additional checklist requirements options */}
            <div className="bg-white p-4.5 rounded-xl border border-gray-200.5 space-y-3.5">
              <span className="block text-xs font-bold text-gray-800 uppercase tracking-widest pb-1 border-b border-gray-100">
                Layanan Tambahan (Opsional)
              </span>

              <div className="flex items-center justify-between">
                <div className="pr-4">
                  <span className="block text-xs font-bold text-gray-900">Butuh Event Organizer Terpadu Syariah?</span>
                  <span className="block text-[10px] text-gray-400">Tim kami membantu merapikan rundown acara dan protokol tamu sesuai sunnah.</span>
                </div>
                <input
                  type="checkbox"
                  checked={needEO}
                  onChange={(e) => setNeedEO(e.target.checked)}
                  className="w-5 h-5 accent-emerald-600 rounded text-white cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="pr-4">
                  <span className="block text-xs font-bold text-gray-900">Butuh Referensi Menu Katering Halal?</span>
                  <span className="block text-[10px] text-gray-400">Hubungkan saya dengan 5 rekanan catering pilihan penawaran terbaik.</span>
                </div>
                <input
                  type="checkbox"
                  checked={needCatering}
                  onChange={(e) => setNeedCatering(e.target.checked)}
                  className="w-5 h-5 accent-emerald-600 rounded text-white cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="pr-4">
                  <span className="block text-xs font-bold text-gray-900">Upgrade Sound System & Lighting Panggung?</span>
                  <span className="block text-[10px] text-gray-400">Penambahan subwoofer, standing speaker bar tambahan, serta lampu dekorasi hangat.</span>
                </div>
                <input
                  type="checkbox"
                  checked={needSoundUpgrade}
                  onChange={(e) => setNeedSoundUpgrade(e.target.checked)}
                  className="w-5 h-5 accent-emerald-600 rounded text-white cursor-pointer"
                />
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">Catatan Khusus Tambahan</label>
              <textarea
                rows={2}
                placeholder="Contoh: Memerlukan area loading dock barang sehari sebelum acara dimulai..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Submission disclaimer and WhatsApp submit Button */}
            <div className="pt-4 space-y-4">
              <p className="text-[11px] text-gray-500 text-center">
                Dengan menekan tombol kirim, data rincian reservasi Anda akan diringkas secara rapi untuk dilanjutkan ke verifikasi jadwal WhatsApp Admin DKM Al-Muttaqin secara instan.
              </p>

              <button
                type="submit"
                id="btn-submit-booking-wa"
                className="w-full bg-amber-500 hover:bg-amber-600 active:scale-99 text-emerald-950 font-black py-4.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 cursor-pointer"
              >
                <MessageSquare className="w-5 h-5 text-emerald-950" />
                <span>Kirim Formulir Reservasi Ke Admin (WA)</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>

          </form>
        </div>

      </div>
    </section>
  );
}
