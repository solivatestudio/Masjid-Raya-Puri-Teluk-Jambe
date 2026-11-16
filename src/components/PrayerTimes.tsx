'use client';

import { useEffect, useState } from 'react';
import { Clock, Volume2 } from 'lucide-react';

const TIME_ZONE = 'Asia/Jakarta';
const TELUKJAMBE_TIMUR = { latitude: -6.352, longitude: 107.31 };

type PrayerTime = { name: string; timeStr: string; hour: number; minute: number };
type JakartaTime = { date: string; hour: number; minute: number; second: number };

function getJakartaTime(date: Date): JakartaTime {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value ?? 0);
  const year = value('year');
  const month = value('month');
  const day = value('day');
  return {
    date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    hour: value('hour'), minute: value('minute'), second: value('second'),
  };
}

function toPrayerTime(name: string, rawTime?: string): PrayerTime | null {
  const [hour, minute] = (rawTime ?? '').split(' ')[0].split(':').map(Number);
  if (!Number.isInteger(hour) || !Number.isInteger(minute)) return null;
  return { name, timeStr: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`, hour, minute };
}

export default function PrayerTimes() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [scheduleDate, setScheduleDate] = useState('');
  const [activePrayerIndex, setActivePrayerIndex] = useState(0);
  const [countdownText, setCountdownText] = useState('Memuat jadwal...');
  const currentDate = currentTime ? getJakartaTime(currentTime).date : '';

  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date());
    updateTime();
    const timer = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!currentDate) return;
    const date = currentDate;
    if (date === scheduleDate) return;

    const controller = new AbortController();
    const [year, month, day] = date.split('-');
    const params = new URLSearchParams({
      latitude: String(TELUKJAMBE_TIMUR.latitude), longitude: String(TELUKJAMBE_TIMUR.longitude), method: '20',
    });
    fetch(`https://api.aladhan.com/v1/timings/${day}-${month}-${year}?${params}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Jadwal shalat tidak tersedia');
        return response.json();
      })
      .then((data) => {
        const timings = data?.data?.timings;
        const times = [
          toPrayerTime('Subuh', timings?.Fajr), toPrayerTime('Syuruq', timings?.Sunrise),
          toPrayerTime('Dzuhur', timings?.Dhuhr), toPrayerTime('Ashar', timings?.Asr),
          toPrayerTime('Maghrib', timings?.Maghrib), toPrayerTime('Isya', timings?.Isha),
        ].filter((time): time is PrayerTime => time !== null);
        if (times.length !== 6) throw new Error('Format jadwal shalat tidak lengkap');
        setPrayerTimes(times);
        setScheduleDate(date);
      })
      .catch((error: unknown) => {
        if ((error as Error).name !== 'AbortError') setCountdownText('Jadwal belum tersedia');
      });
    return () => controller.abort();
  }, [currentDate, scheduleDate]);

  useEffect(() => {
    if (!currentTime || prayerTimes.length === 0) return;
    const now = getJakartaTime(currentTime);
    const totalSecondsNow = now.hour * 3600 + now.minute * 60 + now.second;
    let targetIndex = 0;
    let secondsDiff = 0;
    for (let index = 0; index < prayerTimes.length; index++) {
      const prayerSeconds = prayerTimes[index].hour * 3600 + prayerTimes[index].minute * 60;
      if (prayerSeconds > totalSecondsNow) {
        targetIndex = index;
        secondsDiff = prayerSeconds - totalSecondsNow;
        break;
      }
      if (index === prayerTimes.length - 1) {
        secondsDiff = prayerTimes[0].hour * 3600 + prayerTimes[0].minute * 60 + 24 * 3600 - totalSecondsNow;
      }
    }
    let currentIndex = prayerTimes.length - 1;
    prayerTimes.forEach((prayer, index) => {
      if (totalSecondsNow >= prayer.hour * 3600 + prayer.minute * 60) currentIndex = index;
    });
    setActivePrayerIndex(currentIndex);
    const pad = (value: number) => String(value).padStart(2, '0');
    setCountdownText(`menuju ${prayerTimes[targetIndex].name}: ${pad(Math.floor(secondsDiff / 3600))}:${pad(Math.floor((secondsDiff % 3600) / 60))}:${pad(secondsDiff % 60)}`);
  }, [currentTime, prayerTimes]);

  if (!currentTime) return <div className="emerald-gradient text-white border-y border-emerald-800 card-shadow"><div className="max-w-7xl mx-auto px-4 md:px-6 py-4" /></div>;

  return (
    <div className="emerald-gradient text-white border-y border-emerald-800 card-shadow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-900 rounded-lg text-amber-400 border border-emerald-700 animate-pulse"><Clock className="w-5 h-5" /></div>
          <div>
            <div className="font-mono text-xl font-bold tracking-wider">{currentTime.toLocaleTimeString('id-ID', { timeZone: TIME_ZONE, hour12: false })}</div>
            <div className="text-xs text-emerald-300 font-medium tracking-tight">{currentTime.toLocaleDateString('id-ID', { timeZone: TIME_ZONE, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
          </div>
        </div>
        <div className="bg-emerald-900/60 hover:bg-emerald-900/80 transition px-4 py-2 rounded-full border border-emerald-700/50 flex items-center gap-2 text-xs md:text-sm shadow-inner">
          <Volume2 className="w-4 h-4 text-amber-400 animate-bounce" />
          <span className="font-medium text-emerald-100">Waktu Shalat Telukjambe Timur, Karawang</span>
          <span className="text-emerald-400 font-bold font-mono">|</span>
          <span className="text-amber-300 font-bold font-mono text-xs md:text-sm tracking-wide">{countdownText}</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 w-full lg:w-auto">
          {prayerTimes.map((item, index) => (
            <div key={item.name} className={`px-3 py-2 rounded-lg text-center transition-all ${index === activePrayerIndex ? 'bg-amber-500 text-emerald-950 font-bold scale-105 ring-2 ring-amber-300 shadow-lg shadow-amber-500/20' : 'bg-emerald-900/40 text-emerald-200 border border-emerald-800/60 hover:bg-emerald-900/60'}`}>
              <div className="text-[10px] md:text-xs uppercase tracking-wider font-semibold opacity-80">{item.name}</div>
              <div className="font-mono text-sm md:text-base font-bold">{item.timeStr}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
