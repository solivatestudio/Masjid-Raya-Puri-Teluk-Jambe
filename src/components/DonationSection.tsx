import { useState, FormEvent } from 'react';
import { QrCode, CreditCard, Heart, ArrowRight, CheckCircle, Smartphone, AlertCircle, Copy } from 'lucide-react';

interface DonationSectionProps {
  onSimulateDonation: (amount: number, description: string) => void;
}

export default function DonationSection({ onSimulateDonation }: DonationSectionProps) {
  const [donateAmount, setDonateAmount] = useState('100000');
  const [customAmount, setCustomAmount] = useState('');
  const [copiedBank, setCopiedBank] = useState<string | null>(null);
  const [simulatedRecordPosted, setSimulatedRecordPosted] = useState(false);
  const [donorName, setDonorName] = useState('Hamba Allah');

  const suggestedAmounts = [25000, 50000, 100000, 250000, 500000];

  const getActiveAmount = () => {
    if (donateAmount === 'Lainnya') {
      return parseFloat(customAmount) || 0;
    }
    return parseFloat(donateAmount) || 0;
  };

  const handleCopyBankAccount = (accNum: string) => {
    navigator.clipboard.writeText(accNum).then(() => {
      setCopiedBank(accNum);
      setTimeout(() => setCopiedBank(null), 2000);
    });
  };

  const handleSimulateDonationSubmit = (e: FormEvent) => {
    e.preventDefault();
    const finalAmount = getActiveAmount();
    if (finalAmount <= 0) {
      alert('Mohon tentukan jumlah nominal donasi terlebih dahulu.');
      return;
    }

    onSimulateDonation(finalAmount, `Donasi Online QRIS (${donorName})`);
    
    setSimulatedRecordPosted(true);
    setTimeout(() => {
      setSimulatedRecordPosted(false);
      setDonorName('Hamba Allah');
      setDonateAmount('100000');
      setCustomAmount('');
    }, 4000);
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section id="donasi" className="py-20 emerald-gradient text-white relative overflow-hidden">
      
      {/* Decorative Blur Backdrops */}
      <div className="absolute top-1/4 -left-12 w-80 h-80 bg-emerald-800/40 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-1/4 -right-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl z-0" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="px-3 py-1 bg-amber-400 text-emerald-950 rounded-full text-xs font-bold uppercase tracking-wider">
            Infaq & Sedekah Jariyah
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-3">
            Pintu Amalan Donasi QRIS & Transfer
          </h2>
          <p className="mt-3 text-base text-emerald-200">
            &ldquo;Perumpamaan orang yang menafkahkan hartanya di jalan Allah adalah serupa dengan sebutir benih yang menumbuhkan tujuh bulir.&rdquo; (QS. Al-Baqarah: 261)
          </p>
        </div>

        {/* Main Donation Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Block: QRIS Dynamic Generator Mockup */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            {/* Elegant QRIS Codeboard Stand card */}
            <div className="bg-white text-gray-900 rounded-3xl p-6 shadow-2xl max-w-sm w-full border-4 border-amber-400 relative overflow-hidden flex flex-col items-center">
              
              {/* QRIS Header Sticker */}
              <div className="w-full bg-emerald-900 text-center py-2.5 rounded-xl text-white font-extrabold text-sm tracking-widest flex items-center justify-center gap-1.5 mb-4">
                <QrCode className="w-5 h-5 text-amber-400" />
                <span>QRIS NASIONAL</span>
              </div>

              {/* Merchant Title */}
              <div className="text-center pb-3 border-b border-gray-100 w-full mb-3">
                <h4 className="font-extrabold text-sm text-gray-950">MASJID AL-MUTTAQIN</h4>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-0.5">NMID: ID10202657890</p>
                <p className="text-[9px] text-emerald-700 bg-emerald-50 inline-block px-1.5 py-0.5 rounded font-black mt-1">GOPAY, OVO, DANA, LINKAJA & M-BANKING</p>
              </div>

              {/* Generated QR visual Grid mockup */}
              <div className="w-64 h-64 bg-gray-50 rounded-2xl border border-gray-200 p-4 flex flex-col items-center justify-center relative group">
                {/* Simulated QR block layout */}
                <div className="w-full h-full relative flex items-center justify-center opacity-90">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-950">
                    <rect x="0" y="0" width="100" height="100" fill="transparent" />
                    {/* Decorative QR Squares positioning anchors */}
                    <rect x="5" y="5" width="25" height="25" fill="currentColor" rx="2" />
                    <rect x="10" y="10" width="15" height="15" fill="white" />
                    <rect x="13" y="13" width="9" height="9" fill="currentColor" />

                    <rect x="70" y="5" width="25" height="25" fill="currentColor" rx="2" />
                    <rect x="75" y="10" width="15" height="15" fill="white" />
                    <rect x="78" y="13" width="9" height="9" fill="currentColor" />

                    <rect x="5" y="70" width="25" height="25" fill="currentColor" rx="2" />
                    <rect x="10" y="75" width="15" height="15" fill="white" />
                    <rect x="13" y="78" width="9" height="9" fill="currentColor" />

                    {/* Simulating barcodes using pathways */}
                    <path d="M 38,5 H 42 V 22 H 38 Z" fill="currentColor" />
                    <path d="M 46,5 H 48 V 12 H 46 Z" fill="currentColor" />
                    <path d="M 52,5 H 64 V 9 H 52 Z" fill="currentColor" />
                    <path d="M 38,26 H 55 V 30 H 38 Z" fill="currentColor" />
                    <path d="M 5,38 H 32 V 42 H 5 Z" fill="currentColor" />
                    <path d="M 13,46 H 25 V 48 H 13 Z" fill="currentColor" />
                    <path d="M 38,38 H 62 V 62 H 38 Z" fill="currentColor" />
                    <path d="M 44,44 H 56 V 56 H 44 Z" fill="white" />
                    {/* Heart symbol right in the center */}
                    <path d="M 50,46 C 49,44 46,44 46,47 C 46,50 50,53 50,53 C 50,53 54,50 54,47 C 54,44 51,44 50,46 Z" fill="currentColor" />

                    <path d="M 70,38 H 92 V 42 H 70 Z" fill="currentColor" />
                    <path d="M 80,46 H 88 V 65 H 80 Z" fill="currentColor" />
                    <path d="M 5,50 H 12 V 64 H 5 Z" fill="currentColor" />
                    <path d="M 18,52 H 30 V 55 H 18 Z" fill="currentColor" />
                    <path d="M 38,70 H 45 V 90 H 38 Z" fill="currentColor" />
                    <path d="M 50,70 H 68 V 74 H 50 Z" fill="currentColor" />
                    <path d="M 72,70 H 92 V 90 H 72 Z" fill="currentColor" />
                    <path d="M 50,80 H 64 V 83 H 50 Z" fill="currentColor" />
                    <path d="M 56,86 H 68 V 92 H 56 Z" fill="currentColor" />
                    <path d="M 28,60 H 34 V 74 H 28 Z" fill="currentColor" />
                  </svg>
                </div>

                {/* Laser scan animation line overlay */}
                <div className="absolute inset-x-0 h-1 bg-amber-400 opacity-60 animate-bounce" style={{ top: '15%', animationDuration: '3s' }} />
              </div>

              {/* Dynamic QRIS Indicator */}
              <div className="w-full mt-4 bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                <span className="block text-[10px] text-gray-400 uppercase font-semibold">Estimasi Pemindaian</span>
                <span className="block text-base font-extrabold text-emerald-950 font-mono">
                  {formatRupiah(getActiveAmount())}
                </span>
                <span className="block text-[9px] text-gray-500 mt-0.5">Silakan scan kode QRIS gratis biaya admin</span>
              </div>
            </div>

            {/* Simulated Live counter */}
            <div className="mt-4 flex items-center gap-2.5 bg-emerald-900/40 text-emerald-300 font-medium border border-emerald-800 rounded-xl px-4 py-2.5 text-xs max-w-sm w-full">
              <Smartphone className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Dapat dipindai dari kamera HP atau Semua aplikasi dompet digital.</span>
            </div>
          </div>

          {/* Right Block: Amount Picker & Bank Transfer Details */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Donation Simulated Calculator */}
            <form onSubmit={handleSimulateDonationSubmit} className="bg-emerald-900/30 border border-emerald-800 rounded-2xl p-6.5 space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Heart className="w-5 h-5 text-amber-400 text-lg animate-pulse" />
                <span>Simulasi Kalkulator Donasi Instan</span>
              </h3>

              <div className="space-y-4">
                
                {/* Donor Name input */}
                <div>
                  <label className="block text-[11px] font-bold text-emerald-300 uppercase tracking-wider mb-1">
                    Nama Pewakaf / Donatur
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Hamba Allah / Nama Pribadi"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full bg-emerald-950/60 border border-emerald-800 text-white placeholder-emerald-400 rounded-xl px-3 py-2.5 text-sm focus:ring-1 focus:ring-amber-400 focus:outline-none"
                  />
                </div>

                {/* Amount suggestions chips */}
                <div>
                  <label className="block text-[11px] font-bold text-emerald-300 uppercase tracking-wider mb-2">
                    Pilih Nominal Infaq Jariyah
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {suggestedAmounts.map((amt) => {
                      const isSelected = donateAmount === String(amt);
                      return (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => {
                            setDonateAmount(String(amt));
                            setCustomAmount('');
                          }}
                          className={`py-2 rounded-xl text-xs font-bold transition duration-150 cursor-pointer ${
                            isSelected
                              ? 'bg-amber-400 text-emerald-950 font-black shadow-lg shadow-amber-400/10'
                              : 'bg-emerald-950 hover:bg-emerald-800 border border-emerald-800 text-emerald-200'
                          }`}
                        >
                          {formatRupiah(amt)}
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => setDonateAmount('Lainnya')}
                      className={`py-2 rounded-xl text-xs font-bold transition duration-150 cursor-pointer ${
                        donateAmount === 'Lainnya'
                          ? 'bg-amber-400 text-emerald-950 font-black'
                          : 'bg-emerald-950 hover:bg-emerald-800 border border-emerald-800 text-emerald-200'
                      }`}
                    >
                      Nominal Kustom
                    </button>
                  </div>
                </div>

                {/* Custom Amount input field conditional */}
                {donateAmount === 'Lainnya' && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-150">
                    <label className="block text-[11px] font-bold text-emerald-300 uppercase mb-1">
                      Ketik Nominal Kustom Anda (Rupiah)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3 flex items-center text-xs font-bold text-emerald-300 font-mono">
                        Rp
                      </span>
                      <input
                        type="number"
                        required
                        min="1000"
                        step="1000"
                        placeholder="Contoh: 1000000"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="w-full bg-emerald-950/60 border border-emerald-800 text-white placeholder-emerald-400 rounded-xl pl-9 pr-4 py-2.5 text-sm font-mono focus:ring-1 focus:ring-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* CTA Simulation Submission */}
              <div className="pt-2 border-t border-emerald-800">
                {simulatedRecordPosted ? (
                  <div className="bg-amber-400 text-emerald-950 py-3 px-4 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2 animate-bounce">
                    <CheckCircle className="w-5 h-5 text-emerald-950" />
                    <span>Infaq Sebesar {formatRupiah(getActiveAmount())} Berhasil Terposting ke Buku Kas Secara Realtime!</span>
                  </div>
                ) : (
                  <button
                    type="submit"
                    id="btn-simulate-checkout"
                    className="w-full bg-amber-400 hover:bg-amber-500 active:scale-99 text-emerald-950 font-extrabold py-3.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-amber-400/10 cursor-pointer text-xs md:text-sm"
                  >
                    <span>Saya Sudah Transfer / Klik Konfirmasi Donasi</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
                <p className="text-[10px] text-emerald-300/80 text-center mt-3 leading-tight italic">
                  * Tombol konfirmasi di atas memfasilitasi simulasi interaktif kami. Mengkliknya akan langsung mendebit nominal donasi Anda ke Buku Kas Transparansi di atas dalam sesi pengujian Anda!
                </p>
              </div>
            </form>

            {/* Bank Transfer Alternatives Option Card */}
            <div className="bg-emerald-900/10 border border-emerald-800/60 rounded-2xl p-6.5 space-y-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-400" />
                <h4 className="font-bold text-sm">Metode Alternatif: Layanan Transfer Perbankan</h4>
              </div>

              <p className="text-xs text-emerald-200">
                Jika Anda bermaksud menyalurkan dana infaq rutin bulanan dalam jumlah tertentu melalui autodebet atau m-banking dengan nominal tetap, silakan salurkan ke rekening DKM resmi berikut:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Account 1 */}
                <div className="bg-emerald-950/70 p-4 rounded-xl border border-emerald-800/50 flex flex-col justify-between relative group">
                  <div>
                    <span className="block text-[10px] font-bold text-emerald-300 uppercase tracking-widest">Bank Syariah Indonesia (BSI)</span>
                    <span className="block text-sm font-extrabold tracking-wider font-mono text-white mt-1">712 345 6112</span>
                    <span className="block text-[10px] text-emerald-300/80 mt-0.5">Yayasan Dewan Kemakmuran Masjid Al-Muttaqin</span>
                  </div>
                  
                  <button
                    onClick={() => handleCopyBankAccount('7123456112')}
                    className="absolute bottom-4 right-4 bg-emerald-900 hover:bg-emerald-800 rounded p-1.5 text-emerald-300 transition cursor-pointer"
                    title="Salin No. Rekening"
                  >
                    {copiedBank === '7123456112' ? <span className="text-[10px] text-amber-400 font-bold">Salin!</span> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Account 2 */}
                <div className="bg-emerald-950/70 p-4 rounded-xl border border-emerald-800/50 flex flex-col justify-between relative group">
                  <div>
                    <span className="block text-[10px] font-bold text-emerald-300 uppercase tracking-widest">Bank Muamalat Indonesia (BMI)</span>
                    <span className="block text-sm font-extrabold tracking-wider font-mono text-white mt-1">328 000 4561</span>
                    <span className="block text-[10px] text-emerald-300/80 mt-0.5">Keuangan Kas Operasional DKM Al-Muttaqin</span>
                  </div>

                  <button
                    onClick={() => handleCopyBankAccount('3280004561')}
                    className="absolute bottom-4 right-4 bg-emerald-900 hover:bg-emerald-800 rounded p-1.5 text-emerald-300 transition cursor-pointer"
                    title="Salin No. Rekening"
                  >
                    {copiedBank === '3280004561' ? <span className="text-[10px] text-amber-400 font-bold">Salin!</span> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-emerald-300/80 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-900">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Harap tambahkan kode unik *01* di akhir nominal transfer Bank (contoh: Rp 100.001) untuk memudahkan verifikasi pelaporan DKM otomatis.</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
