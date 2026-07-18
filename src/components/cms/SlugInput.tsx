'use client';
import { useState, useEffect, useRef } from 'react';
import { Link as LinkIcon, Check, X, Loader2 } from 'lucide-react';
import { generateSlug } from '@/lib/slug';

interface SlugInputProps {
  value: string;
  onChange: (slug: string) => void;
  titleSource?: string;
  autoFromTitle?: boolean;
}

export default function SlugInput({ value, onChange, titleSource, autoFromTitle = true }: SlugInputProps) {
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const debounce = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!autoFromTitle || !titleSource) return;
    const generated = generateSlug(titleSource);
    if (generated && generated !== value) {
      onChange(generated);
    }
  }, [titleSource, autoFromTitle]);

  useEffect(() => {
    if (!value) {
      setAvailable(null);
      return;
    }
    if (debounce.current) clearTimeout(debounce.current);
    setChecking(true);
    debounce.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/admin/articles/slug-check?slug=${encodeURIComponent(value)}`, {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setAvailable(data.available);
        }
      } finally {
        setChecking(false);
      }
    }, 500);
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [value]);

  return (
    <div>
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center text-slate-400">
          <LinkIcon className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
          placeholder="judul-artikel-ini"
          className="w-full bg-white border border-gray-300 text-gray-900 rounded-xl pl-10 pr-10 py-2.5 text-sm font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
        />
        <div className="absolute inset-y-0 right-3 flex items-center">
          {checking ? (
            <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
          ) : available === true ? (
            <Check className="w-4 h-4 text-emerald-600" />
          ) : available === false ? (
            <X className="w-4 h-4 text-rose-600" />
          ) : null}
        </div>
      </div>
      {value && (
        <p className="text-[10px] text-slate-500 mt-1">
          URL: <span className="font-mono text-emerald-700">/blog/{value}</span>
          {available === false && <span className="text-rose-600 ml-2">â€” sudah dipakai, ganti dengan suffix</span>}
          {available === true && <span className="text-emerald-600 ml-2">â€” tersedia</span>}
        </p>
      )}
    </div>
  );
}
