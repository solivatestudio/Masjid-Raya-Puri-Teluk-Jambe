'use client';
import { useState, ReactNode } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface DataTableColumn<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  emptyMessage?: string;
  pageSize?: number;
  rowKey: (row: T) => string;
  rowClassName?: (row: T) => string;
  onRowClick?: (row: T) => void;
  loading?: boolean;
}

export default function DataTable<T>({
  data, columns, searchPlaceholder = 'Cari...', searchKeys, emptyMessage = 'Belum ada data',
  pageSize = 20, rowKey, rowClassName, onRowClick, loading,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = search && searchKeys
    ? data.filter((row) =>
        searchKeys.some((k) => String(row[k] ?? '').toLowerCase().includes(search.toLowerCase()))
      )
    : data;

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  return (
    <div className="space-y-3">
      {searchKeys && (
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-3 flex items-center text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {columns.map((col) => (
                  <th key={col.key} className={`px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600 ${col.className || ''}`}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paged.length === 0 ? (
                <tr><td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-slate-400">{emptyMessage}</td></tr>
              ) : paged.map((row) => (
                <tr
                  key={rowKey(row)}
                  className={`hover:bg-slate-50/50 transition-colors ${onRowClick ? 'cursor-pointer' : ''} ${rowClassName ? rowClassName(row) : ''}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3 text-sm text-slate-700 ${col.className || ''}`}>
                      {col.render ? col.render(row) : (row as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span>{filtered.length} data · Halaman {page} dari {totalPages}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-1.5 rounded border border-slate-200 disabled:opacity-30 hover:bg-slate-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-1.5 rounded border border-slate-200 disabled:opacity-30 hover:bg-slate-50">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
