'use client';
import { useState } from 'react';
import { UploadButton } from '@/lib/uploadthing';
import { X, Image as ImageIcon, Check, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  endpoint?: 'featuredImage' | 'galleryImage';
  value: string;
  onChange: (url: string) => void;
  alt?: string;
  onAltChange?: (alt: string) => void;
  maxSizeMB?: number;
}

export default function ImageUploader({
  endpoint = 'featuredImage',
  value,
  onChange,
  alt = '',
  onAltChange,
  maxSizeMB = 4,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
          <img src={value} alt={alt} className="w-full max-h-72 object-cover" />
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
              <Check className="w-3 h-3" /> WebP
            </span>
            <button
              type="button"
              onClick={() => onChange('')}
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
              {uploading ? (
                <Loader2 className="w-6 h-6 text-emerald-700 animate-spin" />
              ) : (
                <ImageIcon className="w-6 h-6 text-emerald-700" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">Upload Featured Image</p>
              <p className="text-xs text-slate-500 mt-1">
                JPG, PNG, atau WebP. Maks {maxSizeMB}MB. Auto-convert ke WebP.
              </p>
            </div>

            <UploadButton
              endpoint={endpoint}
              onClientUploadComplete={(res) => {
                setUploading(false);
                setError('');
                if (res && res[0]) {
                  onChange(res[0].ufsUrl || res[0].url);
                }
              }}
              onUploadError={(error: Error) => {
                setUploading(false);
                setError(error.message);
              }}
              onUploadBegin={() => {
                setUploading(true);
                setError('');
              }}
              appearance={{
                button: 'bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl ut-uploading:cursor-not-allowed ut-uploading:bg-emerald-400',
                container: 'flex flex-col items-center',
                allowedContent: 'text-xs text-slate-500 mt-2',
              }}
              content={{
                button({ ready, isUploading }: any) {
                  if (isUploading) return <span>Mengupload...</span>;
                  if (ready) return <span>Pilih File Gambar</span>;
                  return <span>Memuat...</span>;
                },
                allowedContent({ ready, fileTypes }: any) {
                  if (!ready) return 'Menyiapkan...';
                  return `Format: ${fileTypes.join(', ')}. Maks ${maxSizeMB}MB.`;
                },
              }}
            />

            {error && (
              <div className="text-xs text-rose-600 bg-rose-50 px-3 py-2 rounded-lg border border-rose-200">
                âŒ {error}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
