interface StatusBadgeProps {
  status: string;
  label?: string;
}

const map: Record<string, { bg: string; text: string; label: string }> = {
  draft: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Draft' },
  published: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Published' },
  scheduled: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Scheduled' },
  pending: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Pending' },
  approved: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Approved' },
  rejected: { bg: 'bg-rose-100', text: 'text-rose-800', label: 'Rejected' },
  admin: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Admin' },
  editor: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Editor' },
  active: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Aktif' },
  inactive: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Nonaktif' },
};

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const cfg = map[status] || { bg: 'bg-slate-100', text: 'text-slate-700', label: status };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${cfg.bg} ${cfg.text}`}>
      {label || cfg.label}
    </span>
  );
}
