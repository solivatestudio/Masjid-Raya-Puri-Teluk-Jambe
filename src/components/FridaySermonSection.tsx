'use client';
import { useState } from 'react';
import type { FridaySermon } from '@/types';
import { User, Copy, Check } from 'lucide-react';

export default function FridaySermonSection({ sermons }: { sermons: FridaySermon[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAllMobile, setShowAllMobile] = useState(false);

  const handleCopy = (id: string, theme: string, khatib: string, date: string) => {
    const textToCopy = `*INFO JUMAT MASJID RAYA PURI TELUKJAMBE*\n📅 Tanggal: ${date}\n🎙️ Khatib: ${khatib}\n📖 Tema: "${theme}"\nMari bersiap bergegas menghadiri shalat jumat berjamaah tepat waktu.`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <section id="khutbah" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider">
            Seksi Pembinaan Ibadah Jum&apos;at
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight mt-3">
            Jadwal Imam & Khatib, Muadzin untuk 4 pekan kedepan
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Daftar asatidzah, guru-guru mulia, dan al-hafiz pembina umat yang dijadwalkan mengisi khutbah shalat Jumat di Masjid Raya Puri Telukjambe untuk 4 pekan ke depan.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6">
          {sermons.map((sermon, idx) => {
            const isFirst = idx === 0;
            const isHiddenOnMobile = idx >= 1 && !showAllMobile;
            return (
              <div
                key={sermon.id}
                className={`p-6 rounded-3xl transition-all border ${
                  isFirst
                    ? 'emerald-gradient text-white border-emerald-800 card-shadow relative overflow-hidden'
                    : 'bg-white text-slate-800 border-slate-100 card-shadow'
                } ${isHiddenOnMobile ? 'hidden md:block' : 'block'}`}
              >
                {isFirst && (
                  <div className="absolute top-5 right-0 transform translate-x-14 -translate-y-5 rotate-45 bg-amber-500 text-emerald-950 text-[10px] font-bold py-1.5 px-12 uppercase tracking-widest shadow-sm">
                    Terdekat
                  </div>
                )}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold px-3 py-1 rounded ${isFirst ? 'bg-amber-400 text-emerald-950 font-extrabold' : 'bg-emerald-50 text-emerald-800'}`}>
                      {sermon.date}
                    </span>
                    <button
                      onClick={() => handleCopy(sermon.id, sermon.theme, sermon.khatib, sermon.date)}
                      title="Salin Undangan Shalat Jumat"
                      className={`p-1.5 rounded-lg border transition cursor-pointer ${
                        isFirst ? 'border-emerald-700 hover:bg-emerald-800/80 text-emerald-300' : 'border-gray-200 hover:bg-gray-100 text-gray-500'
                      }`}
                    >
                      {copiedId === sermon.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="text-[10px] uppercase font-bold opacity-70">Tema Khutbah</div>
                    <p className={`text-sm font-medium italic ${isFirst ? 'text-amber-100' : 'text-slate-700'}`}>&ldquo;{sermon.theme}&rdquo;</p>
                  </div>
                  <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t ${isFirst ? 'border-white/50' : 'border-emerald-800'}`}>
                    <div className={`p-3.5 rounded-xl flex items-start gap-2.5 ${isFirst ? 'bg-emerald-900/40 border border-emerald-800/60' : 'bg-gray-50 border border-gray-100'}`}>
                      <div className={`p-1.5 rounded-lg shrink-0 ${isFirst ? 'bg-emerald-800 text-amber-400' : 'bg-emerald-100/80 text-emerald-800'}`}>
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className={`text-[10px] font-semibold uppercase ${isFirst ? 'text-emerald-300' : 'text-gray-400'}`}>
                          Khatib & Imam Jumat
                        </div>
                        <div className={`font-bold text-xs leading-tight line-clamp-2 mt-0.5 ${isFirst ? 'text-white' : 'text-gray-800'}`}>
                          {sermon.khatib}
                        </div>
                      </div>
                    </div>
                    <div className={`p-3.5 rounded-xl flex items-start gap-2.5 ${isFirst ? 'bg-emerald-900/40 border border-emerald-800/60' : 'bg-gray-50 border border-gray-100'}`}>
                      <div className={`p-1.5 rounded-lg shrink-0 ${isFirst ? 'bg-emerald-800 text-amber-400' : 'bg-emerald-100/80 text-emerald-800'}`}>
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className={`text-[10px] font-semibold uppercase ${isFirst ? 'text-emerald-300' : 'text-gray-400'}`}>
                          Muadzin Jumat
                        </div>
                        <div className={`font-semibold text-xs leading-tight line-clamp-1 mt-0.5 ${isFirst ? 'text-white' : 'text-gray-800'}`}>
                          {sermon.muadzin}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!showAllMobile && sermons.length > 1 && (
          <div className="mt-8 flex justify-center md:hidden">
            <button onClick={() => setShowAllMobile(true)} className="px-6 py-2.5 bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-bold rounded-xl transition text-sm cursor-pointer shadow-sm">
              Lihat selengkapnya
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
