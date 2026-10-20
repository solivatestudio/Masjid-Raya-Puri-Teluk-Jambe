'use client';

import { useState } from 'react';
import { User, Copy, Check } from 'lucide-react';
import type { FridaySermon } from '@/types';

function buildFourWeekSchedule(sermons: FridaySermon[]): FridaySermon[] {
  const result = sermons.slice(0, 4);
  const today = new Date();
  const nextFriday = new Date(today);
  const diff = (5 - today.getDay() + 7) % 7;
  nextFriday.setDate(today.getDate() + diff);
  const existingDates = new Set(result.map((item) => item.date));
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  for (let i = 0; result.length < 4 && i < 8; i++) {
    const d = new Date(nextFriday);
    d.setDate(nextFriday.getDate() + i * 7);
    const label = `${dayNames[d.getDay()]}, ${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    if (existingDates.has(label)) continue;
    result.push({
      id: `empty-${d.toISOString().slice(0, 10)}`,
      date: label,
      khatib: 'Belum dijadwalkan',
      muadzin: 'Belum dijadwalkan',
      theme: 'Tema khutbah akan diperbarui oleh DKM',
    });
  }
  return result;
}

export default function FridaySermonSection({ sermons }: { sermons: FridaySermon[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAllMobile, setShowAllMobile] = useState(false);
  const visibleSermons = buildFourWeekSchedule(sermons);

  const handleCopy = (id: string, theme: string, khatib: string, date: string) => {
    const textToCopy = `*INFO JUMAT MASJID RAYA PURI TELUKJAMBE*\nTanggal: ${date}\nKhatib: ${khatib}\nTema: "${theme}"\nMari bersiap bergegas menghadiri shalat jumat berjamaah tepat waktu.`;
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {visibleSermons.map((sermon, idx) => {
            const isFirst = idx === 0;
            const isPlaceholder = sermon.id.startsWith('empty-');
            const isHiddenOnMobile = idx >= 1 && !showAllMobile;
            return (
              <div
                key={sermon.id}
                className={`p-5 rounded-2xl transition-all border ${
                  isFirst
                    ? 'emerald-gradient text-white border-emerald-800 card-shadow relative overflow-hidden'
                    : 'bg-white text-slate-800 border-slate-100 card-shadow'
                } ${isHiddenOnMobile ? 'hidden sm:block' : 'block'}`}
              >
                {isFirst && (
                  <div className="absolute top-4 right-0 transform translate-x-14 -translate-y-5 rotate-45 bg-amber-500 text-emerald-950 text-[9px] font-bold py-1.5 px-12 uppercase tracking-widest shadow-sm">
                    Terdekat
                  </div>
                )}
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded ${isFirst ? 'bg-amber-400 text-emerald-950 font-extrabold' : 'bg-emerald-50 text-emerald-800'}`}>
                      {sermon.date}
                    </span>
                    <button
                      onClick={() => handleCopy(sermon.id, sermon.theme, sermon.khatib, sermon.date)}
                      title="Salin Undangan Shalat Jumat"
                      disabled={isPlaceholder}
                      className={`p-1.5 rounded-lg border transition ${
                        isPlaceholder
                          ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                          : isFirst
                            ? 'border-emerald-700 hover:bg-emerald-800/80 text-emerald-300 cursor-pointer'
                            : 'border-gray-200 hover:bg-gray-100 text-gray-500 cursor-pointer'
                      }`}
                    >
                      {copiedId === sermon.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="space-y-2 min-h-[72px]">
                    <div className="text-[10px] uppercase font-bold opacity-70">Tema Khutbah</div>
                    <p className={`text-sm font-medium italic ${isFirst ? 'text-amber-100' : 'text-slate-700'}`}>&ldquo;{sermon.theme}&rdquo;</p>
                  </div>
                  <div className={`space-y-3 pt-3 border-t ${isFirst ? 'border-white/50' : 'border-emerald-800/20'}`}>
                    <div className={`p-3 rounded-xl flex items-start gap-2.5 ${isFirst ? 'bg-emerald-900/40 border border-emerald-800/60' : 'bg-gray-50 border border-gray-100'}`}>
                      <div className={`p-1.5 rounded-lg shrink-0 ${isFirst ? 'bg-emerald-800 text-amber-400' : 'bg-emerald-100/80 text-emerald-800'}`}>
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className={`text-[10px] font-semibold uppercase ${isFirst ? 'text-emerald-300' : 'text-gray-400'}`}>
                          Khatib & Imam Jumat
                        </div>
                        <div className={`font-bold text-xs leading-tight mt-0.5 ${isFirst ? 'text-white' : 'text-gray-800'}`}>
                          {sermon.khatib}
                        </div>
                      </div>
                    </div>
                    <div className={`p-3 rounded-xl flex items-start gap-2.5 ${isFirst ? 'bg-emerald-900/40 border border-emerald-800/60' : 'bg-gray-50 border border-gray-100'}`}>
                      <div className={`p-1.5 rounded-lg shrink-0 ${isFirst ? 'bg-emerald-800 text-amber-400' : 'bg-emerald-100/80 text-emerald-800'}`}>
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className={`text-[10px] font-semibold uppercase ${isFirst ? 'text-emerald-300' : 'text-gray-400'}`}>
                          Muadzin Jumat
                        </div>
                        <div className={`font-semibold text-xs leading-tight mt-0.5 ${isFirst ? 'text-white' : 'text-gray-800'}`}>
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

        {!showAllMobile && visibleSermons.length > 1 && (
          <div className="mt-8 flex justify-center sm:hidden">
            <button onClick={() => setShowAllMobile(true)} className="px-6 py-2.5 bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-bold rounded-xl transition text-sm cursor-pointer shadow-sm">
              Lihat selengkapnya
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
