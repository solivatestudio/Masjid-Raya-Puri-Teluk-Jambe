import { useState, MouseEvent } from 'react';
import { GALLERY_PHOTOS } from '../data';
import { Eye, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function GallerySection() {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const handlePrev = (e: MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((prev) => (prev === 0 ? GALLERY_PHOTOS.length - 1 : prev! - 1));
  };

  const handleNext = (e: MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((prev) => (prev === GALLERY_PHOTOS.length - 1 ? 0 : prev! + 1));
  };

  return (
    <section id="galeri" className="py-20 bg-slate-50 border-t border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider">
            Dokumentasi Silaturahim
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight mt-3">
            Galeri Kegiatan & Ukhuwah Jamaah
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Kumpulan lensa dokumentasi aktivitas ibadah berkala, bakti sosial kemasyarakatan, bimbingan syar'i harian, dan kebersamaan umat di lingkungan Masjid Raya Puri Telukjambe.
          </p>
        </div>


        {/* Gallery Responsive Grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_PHOTOS.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => setActivePhotoIndex(index)}
              className="bg-gray-100 group rounded-3xl overflow-hidden aspect-4/3 relative cursor-pointer border border-slate-100 hover:-translate-y-0.5 transition duration-300 card-shadow"
            >
              <img
                src={photo.src}
                alt={photo.caption}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />

              {/* Hover Overlay Visual cue */}
              <div className="absolute inset-0 bg-emerald-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6 z-10">
                <div className="self-end p-2 bg-white/20 backdrop-blur-md rounded-xl text-white">
                  <Eye className="w-5 h-5" />
                </div>

                <div className="text-white space-y-1">
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-widest">Klik untuk Membuka</span>
                  <p className="text-sm font-semibold tracking-tight leading-tight line-clamp-2">
                    {photo.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="mt-12 flex justify-center">
          <a href="https://instagram.com/masjidrayapuritelukjambe/" target="_blank" rel="noopener noreferrer" className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-600/20 transition flex items-center gap-2">
            Lihat lebih banyak di Instagram
          </a>
        </div>

      </div>

      {/* Lightbox Modal slider overlay */}
      {activePhotoIndex !== null && (
        <div
          onClick={() => setActivePhotoIndex(null)}
          className="fixed inset-0 bg-black/95 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          {/* Close trigger button */}
          <button
            onClick={() => setActivePhotoIndex(null)}
            className="absolute top-6 right-6 text-white hover:text-amber-400 bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition cursor-pointer z-50 text-xl font-bold"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left arrow slider trigger */}
          <button
            onClick={handlePrev}
            className="absolute left-4 md:left-8 text-white hover:text-amber-400 bg-white/10 hover:bg-white/20 p-3 rounded-full transition cursor-pointer z-40"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Modal Center picture and caption card */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full flex flex-col items-center justify-center space-y-4"
          >
            <div className="relative aspect-16/10 max-h-[70vh] w-full bg-black/40 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src={GALLERY_PHOTOS[activePhotoIndex].src}
                alt={GALLERY_PHOTOS[activePhotoIndex].caption}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="bg-white/10 backdrop-blur px-6 py-3.5 rounded-2xl border border-white/10 text-center max-w-xl w-full">
              <p className="text-sm text-white font-medium">
                {GALLERY_PHOTOS[activePhotoIndex].caption}
              </p>
              <span className="text-xs text-amber-300 font-mono mt-1 block">
                {activePhotoIndex + 1} / {GALLERY_PHOTOS.length} Foto Dokumentasi
              </span>
            </div>
          </div>

          {/* Right arrow slider trigger */}
          <button
            onClick={handleNext}
            className="absolute right-4 md:right-8 text-white hover:text-amber-400 bg-white/10 hover:bg-white/20 p-3 rounded-full transition cursor-pointer z-40"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </section>
  );
}
