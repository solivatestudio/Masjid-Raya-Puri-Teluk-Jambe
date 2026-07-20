'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { transactionsApi, bookingsApi, pageviewsApi } from '@/lib/api';
import { formatRupiah, fillDailyViews } from '@/lib/utils';
import SummaryCard from '@/components/dashboard/SummaryCard';
import StatusBadge from '@/components/dashboard/StatusBadge';
import LineChart, { LineSeries } from '@/components/dashboard/LineChart';
import { Wallet, CalendarCheck, Eye, ArrowRight, TrendingUp, ClipboardList, BarChart3 } from 'lucide-react';
import type { TransactionSummary, BookingSummary, FinanceRecord, BookingRecord } from '@/types';

export default function OverviewPage() {
  const [txnSummary, setTxnSummary] = useState<TransactionSummary | null>(null);
  const [bookingSummary, setBookingSummary] = useState<BookingSummary | null>(null);
  const [visitors, setVisitors] = useState(0);
  const [recentTxns, setRecentTxns] = useState<FinanceRecord[]>([]);
  const [recentBookings, setRecentBookings] = useState<BookingRecord[]>([]);
  const [dailyViews, setDailyViews] = useState<{ date: string; views: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [txnSum, bookSum, traffic, txns, bks] = await Promise.all([
          transactionsApi.summary(),
          bookingsApi.summary(),
          pageviewsApi.summary(),
          transactionsApi.list({ limit: '5' }),
          bookingsApi.list(),
        ]);
        setTxnSummary(txnSum);
        setBookingSummary(bookSum);
        setVisitors(traffic.activeVisitors);
        setRecentTxns(txns);
        setRecentBookings(bks.slice(0, 5));
        setDailyViews(fillDailyViews(traffic.daily7Days || []));
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><p className="text-slate-500">Memuat dashboard...</p></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Ringkasan laporan penting masjid</p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold p-3 rounded-xl">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          title="Saldo Kas Masjid"
          value={txnSummary ? formatRupiah(txnSummary.saldo) : 'Rp 0'}
          subtitle="Saldo all-time"
          icon={<Wallet className="w-5 h-5" />}
          variant="primary"
        />
        <SummaryCard
          title="Booking Pending"
          value={String(bookingSummary?.totalPending || 0)}
          subtitle="Butuh review admin"
          icon={<CalendarCheck className="w-5 h-5" />}
        />
        <SummaryCard
          title="Active Visitors"
          value={String(visitors)}
          subtitle="Dalam 5 menit terakhir"
          icon={<Eye className="w-5 h-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-100 card-shadow p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">Transaksi Terbaru</h3>
            <Link href="/dashboard/keuangan" className="text-[10px] font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1">
              Lihat Semua <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentTxns.length === 0 ? (
              <p className="text-xs text-slate-400">Belum ada transaksi</p>
            ) : (
              recentTxns.map((tx: any) => (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{tx.description}</p>
                    <p className="text-[9px] text-slate-400">{tx.date} — {tx.category}</p>
                  </div>
                  <span className={`text-xs font-bold font-mono ${tx.type === 'Pemasukan' ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {tx.type === 'Pemasukan' ? '+' : '-'}{formatRupiah(tx.amount)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 card-shadow p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">Booking Terbaru</h3>
            <Link href="/dashboard/booking" className="text-[10px] font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1">
              Lihat Semua <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentBookings.length === 0 ? (
              <p className="text-xs text-slate-400">Belum ada booking</p>
            ) : (
              recentBookings.map((b: any) => (
                <div key={b.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800">{b.name}</p>
                    <p className="text-[9px] text-slate-400">{b.date} — {b.purpose?.slice(0, 30)}</p>
                  </div>
                  <StatusBadge status={b.status} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 card-shadow p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" /> Trafik 7 Hari
          </h3>
          {dailyViews.some((d) => d.views > 0) ? (
            <LineChart
              labels={dailyViews.map((d) => {
                const date = new Date(d.date);
                return date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' });
              })}
              series={[{ label: 'Page Views', data: dailyViews.map((d) => d.views), color: 'emerald' }]}
              height={220}
              showGrid={true}
            />
          ) : (
            <p className="text-xs text-slate-400 text-center py-12">Belum ada data trafik</p>
          )}
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 card-shadow p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Aksi Cepat</h3>
          <div className="space-y-3">
            <Link href="/dashboard/keuangan" className="block w-full text-center bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold py-3 rounded-xl transition">
              + Tambah Transaksi
            </Link>
            <Link href="/dashboard/booking" className="block w-full text-center bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold py-3 rounded-xl transition">
              <ClipboardList className="w-4 h-4 inline mr-1" /> Review Booking
            </Link>
            <Link href="/dashboard/trafik" className="block w-full text-center bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold py-3 rounded-xl transition">
              <BarChart3 className="w-4 h-4 inline mr-1" /> Lihat Trafik
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
