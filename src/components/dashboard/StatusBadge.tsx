interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'active' | string;
  label?: string;
}

const statusConfig: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  pending: { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500', label: 'Pending' },
  approved: { bg: 'bg-emerald-100', text: 'text-emerald-800', dot: 'bg-emerald-500', label: 'Approved' },
  rejected: { bg: 'bg-rose-100', text: 'text-rose-800', dot: 'bg-rose-500', label: 'Rejected' },
  active: { bg: 'bg-emerald-100', text: 'text-emerald-800', dot: 'bg-emerald-500', label: 'Online' },
};

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const cfg = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-500', label: status };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {label || cfg.label}
    </span>
  );
}
