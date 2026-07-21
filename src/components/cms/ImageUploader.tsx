"use client";

import { X, Image as ImageIcon, Check } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing";

type UploadEndpoint = "featuredImage" | "galleryImage";

interface ImageUploaderProps {
  endpoint?: UploadEndpoint;
  value: string;
  onChange: (url: string) => void;
  alt?: string;
  onAltChange?: (alt: string) => void;
  maxSizeMB?: number;
}

export default function ImageUploader({
  endpoint = "featuredImage",
  value,
  onChange,
  alt = "",
  onAltChange,
}: ImageUploaderProps) {
  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
          <img
            src={value}
            alt={alt}
            className="w-full max-h-72 object-cover"
            referrerPolicy="no-referrer"
          />
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
              onClick={() => onChange("")}
              className="bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-md shadow-md transition"
              title="Hapus gambar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 bg-slate-50 hover:bg-slate-100 transition">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <ImageIcon className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">Upload Gambar</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilih file dari perangkat. Gambar akan diunggah melalui
                UploadThing.
              </p>
            </div>
          </div>
          <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(files) => {
              const uploadedUrl = files?.[0]?.ufsUrl || files?.[0]?.url;
              if (uploadedUrl) onChange(uploadedUrl);
            }}
            onUploadError={(error) => {
              console.error(error);
            }}
            appearance={{
              container: "border-slate-200 bg-white rounded-xl p-4",
              button:
                "bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl after:bg-emerald-800",
              label: "text-slate-700 text-xs font-bold",
              allowedContent: "text-slate-500 text-[10px]",
            }}
            content={{
              label: "Pilih atau tarik gambar ke sini",
              allowedContent: "Format gambar, maksimal 4MB",
              button: "Upload Gambar",
            }}
          />
        </div>
      )}
    </div>
  );
}
