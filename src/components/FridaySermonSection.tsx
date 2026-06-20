import { useState } from 'react';
import { FRIDAY_SERMONS } from '../data';
import { BookOpen, User, Sparkles, Copy, Check } from 'lucide-react';

export default function FridaySermonSection() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider">
            Seksi Pembinaan Ibadah Jum'at
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight mt-3">
            Jadwal Khatib & Imam Shalat Jum'at
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Daftar asatidzah, guru-guru mulia, dan al-hafiz pembina umat yang dijadwalkan mengisi khutbah shalat Jumat di Masjid Raya Puri Telukjambe untuk 4 pekan ke depan.
          </p>
        </div>

        {/* Sermon Bulletins list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FRIDAY_SERMONS.map((sermon, idx) => {
            const isFirst = idx === 0;

            return (
              <div
                key={sermon.id}
                id={`sermon-card-${sermon.id}`}
                className={`p-6 rounded-3xl transition-all border ${isFirst
                  ? 'emerald-gradient text-white border-emerald-800 card-shadow relative overflow-hidden'
                  : 'bg-white text-slate-800 border-slate-100 card-shadow'
                  }`}
              >
                {/* Decorative glow indicator for the upcoming weekly sermon */}
                {isFirst && (
                  <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-4 rotate-45 bg-amber-500 text-emerald-950 text-[10px] font-bold py-1.5 px-12 uppercase tracking-widest shadow-sm">
                    Pekan Terdekat
                  </div>
                )}

                <div className="space-y-4">

                  {/* Sermon Date Header */}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold px-3 py-1 rounded ${isFirst ? 'bg-amber-400 text-emerald-950 font-extrabold' : 'bg-emerald-50 text-emerald-800'
                      }`}>
                      {sermon.date}
                    </span>

                    {/* Copy Share Invite */}
                    <button
                      onClick={() => handleCopy(sermon.id, sermon.theme, sermon.khatib, sermon.date)}
                      title="Salin Undangan Shalat Jumat"
                      className={`p-1.5 rounded-lg border transition ${isFirst
                        ? 'border-emerald-700 hover:bg-emerald-800/80 text-emerald-300'
                        : 'border-gray-200 hover:bg-gray-100 text-gray-500'
                        } cursor-pointer`}
                    >
                      {copiedId === sermon.id ? (
                        <Check className="w-4 h-4 text-emerald-500 animate-scale-up" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Sermon Theme */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className={`w-4 h-4 ${isFirst ? 'text-amber-300' : 'text-emerald-600'}`} />
                      <span className={`text-[11px] font-bold uppercase tracking-wider ${isFirst ? 'text-emerald-300' : 'text-emerald-800'
                        }`}>
                        Tema Pembahasan Khutbah
                      </span>
                    </div>
                    <p className={`font-bold leading-snug line-clamp-2 ${isFirst ? 'text-lg text-white' : 'text-base text-gray-900'
                      }`}>
                      &ldquo;{sermon.theme}&rdquo;
                    </p>
                  </div>

                  {/* Khatib & Imam Credits cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-emerald-800/40">

                    {/* Khatib */}
                    <div className={`p-3.5 rounded-xl flex items-start gap-2.5 ${isFirst ? 'bg-emerald-900/40 border border-emerald-800/60' : 'bg-gray-50 border border-gray-100'
                      }`}>
                      <div className={`p-1.5 rounded-lg shrink-0 ${isFirst ? 'bg-emerald-800 text-amber-400' : 'bg-emerald-100/80 text-emerald-800'
                        }`}>
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className={`text-[10px] font-semibold uppercase ${isFirst ? 'text-emerald-300' : 'text-gray-400'
                          }`}>
                          Khatib & Imam Jumat
                        </div>
                        <div className={`font-bold text-xs leading-tight line-clamp-2 mt-0.5 ${isFirst ? 'text-white' : 'text-gray-800'
                          }`}>
                          {sermon.khatib}
                        </div>
                      </div>
                    </div>

                    {/* Imam */}
                    <div className={`p-3.5 rounded-xl flex items-start gap-2.5 ${isFirst ? 'bg-emerald-900/40 border border-emerald-800/60' : 'bg-gray-50 border border-gray-100'
                      }`}>
                      <div className={`p-1.5 rounded-lg shrink-0 ${isFirst ? 'bg-emerald-800 text-amber-400' : 'bg-emerald-100/80 text-emerald-800'
                        }`}>
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className={`text-[10px] font-semibold uppercase ${isFirst ? 'text-emerald-300' : 'text-gray-400'
                          }`}>
                          Muadzin Jumat
                        </div>
                        <div className={`font-semibold text-xs leading-tight line-clamp-1 mt-0.5 ${isFirst ? 'text-white' : 'text-gray-800'
                          }`}>
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
      </div>
    </section>
  );
}
