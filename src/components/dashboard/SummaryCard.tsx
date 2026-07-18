import { ReactNode } from 'react';

interface SummaryCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
  variant?: 'primary' | 'default';
}

export default function SummaryCard({ title, value, subtitle, icon, variant = 'default' }: SummaryCardProps) {
  if (variant === 'primary') {
    return (
      <div className="emerald-gradient p-6 rounded-3xl text-white card-shadow border border-emerald-700/40 relative overflow-hidden group">
        <div className="absolute top-1/2 -right-6 -translate-y-1/2 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
        <div className="flex items-center justify-between mb-4 relative z-10">
          <span className="text-xs font-semibold text-emerald-200 tracking-wide uppercase">{title}</span>
          {icon && <div className="p-2 bg-emerald-800 rounded-lg text-amber-400">{icon}</div>}
        </div>
        <div className="relative z-10">
          <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-amber-300">{value}</div>
          {subtitle && <p className="text-[11px] text-emerald-300 mt-2 font-medium">{subtitle}</p>}
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 card-shadow flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold tracking-wide uppercase text-slate-700">{title}</span>
        {icon && <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">{icon}</div>}
      </div>
      <div>
        <div className="text-2xl font-bold font-mono text-slate-900">{value}</div>
        {subtitle && <p className="text-[11px] text-gray-500 mt-2">{subtitle}</p>}
      </div>
    </div>
  );
}
