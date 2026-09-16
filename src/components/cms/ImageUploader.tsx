"use client";

import { useState, useRef, useEffect } from "react";
import { X, Image as ImageIcon, Check, AlertCircle, Plus, UploadCloud, Loader2, RefreshCw } from "lucide-react";
import { uploadFiles } from "@/lib/uploadthing";

type UploadEndpoint = "featuredImage" | "galleryImage" | "articleImage";

interface ImageUploaderProps {
  endpoint?: UploadEndpoint;
  value: string;
  onChange: (url: string) => void;
  alt?: string;
  onAltChange?: (alt: string) => void;
  maxSizeMB?: number;
  label?: string;
  description?: string;
  onInsertToArticle?: (url: string, alt: string) => void;
}

export default function ImageUploader({
  endpoint = "featuredImage",
  value,
  onChange,
  alt = "",
  onAltChange,
  label = "Upload Gambar",
  description = "Pilih file dari perangkat. Gambar akan diunggah ke CDN UploadThing.",
  onInsertToArticle,
}: ImageUploaderProps) {
  const [localPreview, setLocalPreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up blob URL on unmount or file change
  useEffect(() => {
    return () => {
      if (localPreview && localPreview.startsWith("blob:")) {
        URL.revokeObjectURL(localPreview);
      }
    };
  }, [localPreview]);

  const handleFile = async (file: File) => {
    setErrorMessage("");

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Format file tidak didukung. Harap pilih gambar (JPG, PNG, WebP, GIF).");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setErrorMessage("Ukuran file melebihi batas 4MB. Harap perkecil ukuran gambar.");
      return;
    }

    if (localPreview && localPreview.startsWith("blob:")) {
      URL.revokeObjectURL(localPreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);
    setSelectedFile(file);
    setIsUploading(true);

    try {
      const res = await uploadFiles(endpoint, {
        files: [file],
      });

      const uploadedUrl = res?.[0]?.ufsUrl || res?.[0]?.url;

      if (!uploadedUrl) {
        throw new Error("Upload berhasil tetapi URL CDN tidak ditemukan.");
      }

      onChange(uploadedUrl);
    } catch (err: any) {
      console.error("UploadThing upload error:", err);
      setErrorMessage(
        err.message || "Gagal mengunggah ke CDN UploadThing. Pastikan koneksi stabil atau coba lagi."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleRetry = () => {
    if (selectedFile) {
      handleFile(selectedFile);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = () => {
    onChange("");
    if (localPreview && localPreview.startsWith("blob:")) {
      URL.revokeObjectURL(localPreview);
    }
    setLocalPreview("");
    setSelectedFile(null);
    setErrorMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const activeImageSrc = value || localPreview;

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
        className="hidden"
      />

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium p-3 rounded-xl flex items-start gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Gagal Mengunggah Gambar</p>
            <p className="mt-0.5">{errorMessage}</p>
            <button
              type="button"
              onClick={handleRetry}
              className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-rose-800 bg-rose-100 hover:bg-rose-200 px-2.5 py-1 rounded-lg transition"
            >
              <RefreshCw className="w-3 h-3" /> Coba Lagi
            </button>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage("")}
            className="text-rose-500 hover:text-rose-700"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {activeImageSrc ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
          <div className="relative max-h-72 flex items-center justify-center bg-slate-900/5">
            <img
              src={activeImageSrc}
              alt={alt || "Preview gambar"}
              className="w-full max-h-72 object-cover"
              referrerPolicy="no-referrer"
            />

            {/* Uploading progress overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mb-2" />
                <p className="text-xs font-bold">Mengunggah ke UploadThing CDN...</p>
                <p className="text-[10px] text-slate-300 mt-0.5">Mohon tunggu sebentar</p>
              </div>
            )}
          </div>

          <div className="p-3 bg-white border-t border-slate-200 space-y-2">
            {onAltChange !== undefined && (
              <div>
                <label className="block text-[10px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Alt Text (SEO & Aksesibilitas)
                </label>
                <input
                  type="text"
                  value={alt}
                  onChange={(e) => onAltChange(e.target.value)}
                  placeholder="Deskripsi gambar untuk SEO & aksesibilitas"
                  disabled={isUploading}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            )}

            {/* Quick insert to article button */}
            {onInsertToArticle && value && (
              <button
                type="button"
                onClick={() => onInsertToArticle(value, alt)}
                className="w-full mt-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
                title="Sisipkan gambar cover ini ke dalam teks artikel pada posisi kursor"
              >
                <Plus className="w-3.5 h-3.5" /> Sisipkan Gambar ke Dalam Teks Artikel
              </button>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline"
              >
                Ganti Gambar
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={isUploading}
                className="text-rose-600 hover:text-rose-700 font-semibold hover:underline"
              >
                Hapus
              </button>
            </div>
          </div>

          {/* Status badge */}
          <div className="absolute top-2 right-2 flex gap-1">
            {value ? (
              <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-md">
                <Check className="w-3 h-3" /> Tersimpan di CDN
              </span>
            ) : isUploading ? (
              <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-md">
                <Loader2 className="w-3 h-3 animate-spin" /> Mengunggah...
              </span>
            ) : null}
            <button
              type="button"
              onClick={handleRemove}
              disabled={isUploading}
              className="bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-md shadow-md transition cursor-pointer"
              title="Hapus gambar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) handleFile(f);
          }}
          className="border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/40 rounded-xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 group"
        >
          <div className="w-11 h-11 rounded-full bg-emerald-100 group-hover:scale-105 transition flex items-center justify-center text-emerald-700">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-700">{label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{description}</p>
          </div>
          <button
            type="button"
            className="mt-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs pointer-events-none"
          >
            Pilih Gambar dari Perangkat
          </button>
          <p className="text-[10px] text-slate-400">Format JPG, PNG, WebP, GIF (Maks. 4MB)</p>
        </div>
      )}
    </div>
  );
}
