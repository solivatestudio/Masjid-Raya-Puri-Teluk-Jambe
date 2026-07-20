'use client';

import { useState } from 'react';
import { X, Image as ImageIcon, Check, Link as LinkIcon } from 'lucide-react';

interface ImageUploaderProps {
  endpoint?: 'featuredImage' | 'galleryImage';
  value: string;
  onChange: (url: string) => void;
  alt?: string;
  onAltChange?: (alt: string) => void;
  maxSizeMB?: number;
}

export default function ImageUploader({
  value,
  onChange,
  alt = '',
  onAltChange,
}: ImageUploaderProps) {
  const [draftUrl, setDraftUrl] = useState(value || '');
  const [error, setError] = useState('');

  const applyUrl = () => {
    const nextUrl = draftUrl.trim();
    if (!nextUrl) {
      setError('URL gambar wajib diisi');
      return;
    }
    if (!nextUrl.startsWith('/') && !/^https?:\/\//i.test(nextUrl)) {
      setError('Gunakan URL https:// atau path lokal seperti /images/nama-file.webp');
      return;
    }
    setError('');
    onChange(nextUrl);
  };

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
          <img src={value} alt={alt} className="w-full max-h-72 object-cover" referrerPolicy="no-referrer" />
          {onAltChange !== undefined && (
            <div className="p-3 bg-white border-t border-slate-200">
              <label className="block text-[10px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                Alt Text (SEO & Aksesibilitas)
              </label>
              <input
                type="text"
                value={alt}
                onChange={(e) => onAltChange(e.target.value)}
                placeholder="Deskripsi gambar untuk SEO & aksesibilitas"
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          )}
          <div className="absolute top-2 right-2 flex gap-1">
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-md">
              <Check className="w-3 h-3" /> Aktif
            </span>
            <button
              type="button"
              onClick={() => { setDraftUrl(''); onChange(''); }}
              className="bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-md shadow-md transition"
              title="Hapus gambar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 bg-slate-50 hover:bg-slate-100 transition">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">URL Gambar</p>
              <p className="text-xs text-slate-500 mt-1">
                Gunakan gambar dari folder public atau URL HTTPS yang sudah siap pakai.
              </p>
            </div>
            <div className="w-full flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={draftUrl}
                onChange={(e) => setDraftUrl(e.target.value)}
                placeholder="https://... atau /images/nama-file.webp"
                className="flex-1 bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={applyUrl}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center justify-center gap-1.5"
              >
                <LinkIcon className="w-4 h-4" /> Pakai URL
              </button>
            </div>
            {error && (
              <div className="text-xs text-rose-600 bg-rose-50 px-3 py-2 rounded-lg border border-rose-200">
                <X className="w-3.5 h-3.5 inline mr-1" /> {error}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
