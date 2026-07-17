import { useEffect, useState } from 'react';
import { pageviewsApi } from '../../lib/api';
import { getRelativeTime, fillDailyViews } from '../../lib/utils';
import SummaryCard from '../../components/dashboard/SummaryCard';
import StatusBadge from '../../components/dashboard/StatusBadge';
import ProgressRing from '../../components/dashboard/ProgressRing';
import { Eye, Users, Activity, Globe, Link as LinkIcon } from 'lucide-react';
import type { PageviewSummary } from '../../types';

export default function TrafikPage() {
  const [data, setData] = useState<PageviewSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState('');

  const fetchData = async () => {
    try {
      const [summary, recent] = await Promise.all([
        pageviewsApi.summary(),
        pageviewsApi.recent(),
      ]);
      setData({ ...summary, recentVisits: recent, daily7Days: fillDailyViews(summary.daily7Days || []) });
      setLastUpdate(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return <div className="flex items-center justify-center h-64"><p className="text-slate-500">Memuat data...</p></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Live Traffic</h1>
          <p className="text-sm text-slate-500">Data diperbarui otomatis setiap 15 detik</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400">Update:</span>
          <StatusBadge status="active" label={lastUpdate || '...'} />
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold p-3 rounded-xl">{error}</div>
      )}

      {/* Summary Cards */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SummaryCard
            title="Active Visitors (5 Menit)"
            value={String(data.activeVisitors)}
            icon={<Activity className="w-5 h-5" />}
            variant="primary"
          />
          <SummaryCard
            title="Pageviews (7 Hari)"
            value={String(data.total7Days)}
            icon={<Eye className="w-5 h-5" />}
          />
          <SummaryCard
            title="Unique Visitors"
            value={String(data.uniqueVisitors)}
            icon={<Users className="w-5 h-5" />}
          />
          <div className="bg-white p-4 rounded-3xl border border-slate-100 card-shadow flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center">
              <ProgressRing value={data.uniqueVisitors} max={Math.max(data.uniqueVisitors * 2, 1)} size={90} strokeWidth={6} label="Engagement" subtitle={`${data.total7Days} total views`} />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 7-Day Chart */}
        {data && (
          <div className="bg-white rounded-3xl border border-slate-100 card-shadow p-5">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Trafik 7 Hari Terakhir</h3>
            {data.daily7Days.some(d => d.views > 0) ? (
              <div className="flex items-end gap-2 h-32">
                {data.daily7Days.map((d) => {
                  const maxVal = Math.max(...data.daily7Days.map(x => x.views), 1);
                  const h = (d.views / maxVal) * 100;
                  return (
                    <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full bg-emerald-500 rounded-t transition-all" style={{ height: `${Math.max(h, 4)}px` }} title={`${d.views} views`} />
                      <span className="text-[8px] text-slate-400 font-mono">{d.date.slice(5)}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-8">Belum ada data trafik 7 hari</p>
            )}
          </div>
        )}

        {/* Top Pages */}
        {data && (
          <div className="bg-white rounded-3xl border border-slate-100 card-shadow p-5">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" /> Top Pages (7 Hari)
            </h3>
            {data.topPages.length > 0 ? (
              <div className="space-y-2">
                {data.topPages.map((p, i) => (
                  <div key={p.path} className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-400 w-5">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-800 truncate">{p.path || '/'}</span>
                        <span className="text-[10px] font-mono text-slate-500 ml-2">{p.views}x ({p.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${p.percentage}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-8">Belum ada data halaman</p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Referrers */}
        {data && (
          <div className="bg-white rounded-3xl border border-slate-100 card-shadow p-5">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-emerald-600" /> Referrers (7 Hari)
            </h3>
            {data.referrers.length > 0 ? (
              <div className="space-y-2">
                {data.referrers.map((r) => (
                  <div key={r.source} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-xs font-medium text-slate-700">{r.source === 'Direct' ? '🔗 Direct' : r.source.length > 40 ? r.source.slice(0, 40) + '...' : r.source}</span>
                    <span className="text-[10px] font-mono text-slate-500">{r.views} kunjungan</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-8">Belum ada data referrer</p>
            )}
          </div>
        )}

        {/* Latest Visits */}
        {data && (
          <div className="bg-white rounded-3xl border border-slate-100 card-shadow p-5">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" /> Latest Visits (Real-time)
            </h3>
            {data.recentVisits.length > 0 ? (
              <div className="space-y-1.5 max-h-64 overflow-y-auto">
                {data.recentVisits.map((v) => (
                  <div key={v.id} className="flex items-start gap-2 py-1.5 border-b border-gray-50 last:border-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-slate-800 truncate">{v.path || '/'}</span>
                        <span className="text-[9px] text-slate-400 shrink-0">{getRelativeTime(v.timestamp)}</span>
                      </div>
                      <p className="text-[9px] text-slate-400 truncate">{v.referrer || 'Direct'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-8">Belum ada kunjungan</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
