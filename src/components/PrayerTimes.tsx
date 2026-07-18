'use client';
import { useState, useEffect } from 'react';
import { Clock, Volume2 } from 'lucide-react';

const basePrayerTimes = [
  { name: 'Subuh', timeStr: '04:38', hour: 4, minute: 38 },
  { name: 'Syuruq', timeStr: '05:56', hour: 5, minute: 56 },
  { name: 'Dzuhur', timeStr: '11:54', hour: 11, minute: 54 },
  { name: 'Ashar', timeStr: '15:15', hour: 15, minute: 15 },
  { name: 'Maghrib', timeStr: '17:48', hour: 17, minute: 48 },
  { name: 'Isya', timeStr: '19:02', hour: 19, minute: 2 },
];

export default function PrayerTimes() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [activePrayerIndex, setActivePrayerIndex] = useState<number>(0);
  const [countdownText, setCountdownText] = useState<string>('');

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!currentTime) return;
    const nowHour = currentTime.getHours();
    const nowMin = currentTime.getMinutes();
    const nowSec = currentTime.getSeconds();
    const totalSecsNow = nowHour * 3600 + nowMin * 60 + nowSec;

    let targetIndex = 0;
    let secondsDiff = 0;

    for (let i = 0; i < basePrayerTimes.length; i++) {
      const p = basePrayerTimes[i];
      const pSecs = p.hour * 3600 + p.minute * 60;
      if (pSecs > totalSecsNow) {
        targetIndex = i;
        secondsDiff = pSecs - totalSecsNow;
        break;
      }
      if (i === basePrayerTimes.length - 1) {
        targetIndex = 0;
        const subSecsTomorrow = basePrayerTimes[0].hour * 3600 + basePrayerTimes[0].minute * 60 + 24 * 3600;
        secondsDiff = subSecsTomorrow - totalSecsNow;
      }
    }

    let currentIndex = basePrayerTimes.length - 1;
    for (let i = 0; i < basePrayerTimes.length; i++) {
      const pSecs = basePrayerTimes[i].hour * 3600 + basePrayerTimes[i].minute * 60;
      if (totalSecsNow >= pSecs) currentIndex = i;
    }
    setActivePrayerIndex(currentIndex);

    const h = Math.floor(secondsDiff / 3600);
    const m = Math.floor((secondsDiff % 3600) / 60);
    const s = secondsDiff % 60;
    const pad = (v: number) => String(v).padStart(2, '0');
    setCountdownText(`menuju ${basePrayerTimes[targetIndex].name}: ${pad(h)}:${pad(m)}:${pad(s)}`);
  }, [currentTime]);

  if (!currentTime) {
    return (
      <div className="emerald-gradient text-white border-y border-emerald-800 card-shadow">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4" />
      </div>
    );
  }

  return (
    <div className="emerald-gradient text-white border-y border-emerald-800 card-shadow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-900 rounded-lg text-amber-400 border border-emerald-700 animate-pulse">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="font-mono text-xl font-bold tracking-wider">
              {currentTime.toLocaleTimeString('id-ID', { hour12: false })}
            </div>
            <div className="text-xs text-emerald-300 font-medium tracking-tight">
              {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>
        <div className="bg-emerald-900/60 hover:bg-emerald-900/80 transition px-4 py-2 rounded-full border border-emerald-700/50 flex items-center gap-2 text-xs md:text-sm shadow-inner">
          <Volume2 className="w-4 h-4 text-amber-400 animate-bounce" />
          <span className="font-medium text-emerald-100">Waktu Shalat Kota Karawang & Sekitarnya</span>
          <span className="text-emerald-400 font-bold font-mono">|</span>
          <span className="text-amber-300 font-bold font-mono text-xs md:text-sm tracking-wide">{countdownText}</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 w-full lg:w-auto">
          {basePrayerTimes.map((item, index) => {
            const isActive = index === activePrayerIndex;
            return (
              <div
                key={item.name}
                className={`px-3 py-2 rounded-lg text-center transition-all ${
                  isActive
                    ? 'bg-amber-500 text-emerald-950 font-bold scale-105 ring-2 ring-amber-300 shadow-lg shadow-amber-500/20'
                    : 'bg-emerald-900/40 text-emerald-200 border border-emerald-800/60 hover:bg-emerald-900/60'
                }`}
              >
                <div className="text-[10px] md:text-xs uppercase tracking-wider font-semibold opacity-80">{item.name}</div>
                <div className="font-mono text-sm md:text-base font-bold">{item.timeStr}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
