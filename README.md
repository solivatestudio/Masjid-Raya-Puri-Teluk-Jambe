# Website Portal DKM Masjid Raya Puri Telukjambe

Portal resmi digital untuk **DKM Masjid Raya Puri Telukjambe (PTJ)**, Karawang. Dibangun dengan **Next.js 14 (App Router)** + **TypeScript** + **Tailwind CSS v4** + **Neon PostgreSQL**, di-deploy ke **Vercel Free Tier** sebagai serverless functions.

🌐 **Domain:** https://masjidrayapuritelukjambe.com

---

## ✨ Fitur

### Halaman Publik (`/`)
- Hero banner dengan CTA Donasi
- Jadwal shalat real-time dengan countdown
- Program kajian & Dauroh Al-Quran (filter + pencarian)
- Jadwal Khatib & Muadzin Jumat
- Sewa Aula Serbaguna (2 paket)
- Donasi QRIS + kalkulator infaq
- Galeri dokumentasi (lightbox)
- Footer dengan kontak & tautan sosmed
- SEO lengkap (JSON-LD Mosque, OG, Twitter Cards, sitemap, robots)
- Auto-tracking pageview ke database

### Dashboard Admin (`/dashboard/*` — Protected)
- **Login** dengan password di `/login` (HTTP-only signed cookie session)
- **Overview** — ringkasan saldo, booking pending, active visitors
- **Keuangan** — CRUD transaksi + grafik tren 6 bulan + filter
- **Booking Aula** — kalender interaktif + approve/reject
- **Live Traffic** — auto-refresh 15 detik, top pages, referrer

### API (`/api/*` — sebagian Protected)
- `GET/POST /api/transactions`
- `DELETE /api/transactions/[id]`
- `GET /api/transactions/summary`
- `GET /api/transactions/monthly`
- `GET/POST /api/bookings`
- `PATCH /api/bookings/[id]/status`
- `GET /api/bookings/summary`
- `GET /api/bookings/calendar`
- `POST/DELETE /api/pageviews`
- `GET /api/pageviews/summary`
- `GET /api/pageviews/recent`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/health`

---

## 🚀 Cara Deploy ke Vercel (Free Tier)

### 1. Buat Database Neon (Gratis)
1. Buka https://neon.tech → Sign up (pakai GitHub)
2. **Create Project** → nama bebas (misal `masjid-raya-ptj`)
3. Pilih region Singapore (terdekat dengan ID)
4. Copy **Connection String** dari dashboard, contoh:
   ```
   postgresql://neondb_owner:abc123@ep-cool-name-123456.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```

### 2. Deploy ke Vercel
1. Push kode ke GitHub (private atau public)
2. Buka https://vercel.com/new → Import repo
3. **Environment Variables** — tambahkan 3 var ini:

   | Key | Value | Wajib |
   |---|---|---|
   | `DATABASE_URL` | Connection string Neon dari step 1 | ✅ Ya |
   | `ADMIN_PASSWORD` | Password kuat untuk login dashboard, misal `Mrptj2026!Admin` | ✅ Ya |
   | `AUTH_SECRET` | String random 32 char, generate: `openssl rand -base64 32` | ✅ Ya |
   | `APP_URL` | `https://masjidrayapuritelukjambe.com` | Opsional |

4. Klik **Deploy** → tunggu 1-2 menit
5. Selesai! Database akan auto-seed dengan data contoh pada request pertama

### 3. Setup Custom Domain masjidrayapuritelukjambe.com
1. Vercel Dashboard → Project → **Settings** → **Domains**
2. Ketik `masjidrayapuritelukjambe.com` → **Add**
3. Vercel akan kasih instruksi DNS records (A record + CNAME)
4. Login ke dashboard domain (Niagahoster/Namecheap/dll) → tambahkan record tersebut
5. Tunggu propagasi (5-60 menit)
6. Vercel otomatis generate SSL gratis

---

## 🛠️ Development Lokal

```bash
# 1. Install deps
npm install

# 2. Salin env template
cp .env.example .env.local
# Edit .env.local, isi DATABASE_URL dari Neon (branch development)

# 3. Jalankan
npm run dev
# → http://localhost:3000 (landing)
# → http://localhost:3000/dashboard (perlu login di /login dulu)
```

### Scripts
- `npm run dev` — Next.js dev server
- `npm run build` — Production build
- `npm run start` — Jalankan hasil build
- `npm run typecheck` — TypeScript check
- `npm run lint` — ESLint

---

## 🗂️ Struktur Proyek

```
src/
├── app/
│   ├── layout.tsx              # Root layout (metadata, JSON-LD SEO)
│   ├── page.tsx                # Landing page (/)
│   ├── globals.css             # Tailwind + custom utilities
│   ├── login/page.tsx          # Halaman login admin
│   ├── dashboard/
│   │   ├── layout.tsx          # Sidebar + protected layout
│   │   ├── page.tsx            # Overview
│   │   ├── keuangan/page.tsx
│   │   ├── booking/page.tsx
│   │   └── trafik/page.tsx
│   └── api/
│       ├── auth/{login,logout}/route.ts
│       ├── transactions/{,[id],summary,monthly}/route.ts
│       ├── bookings/{,[id]/status,summary,calendar}/route.ts
│       ├── pageviews/{,summary,recent}/route.ts
│       └── health/route.ts
├── components/
│   ├── HeroSection.tsx, PrayerTimes.tsx, EventSection.tsx,
│   ├── FridaySermonSection.tsx, BookingSection.tsx,
│   ├── DonationSection.tsx, GallerySection.tsx, PageviewTracker.tsx
│   └── dashboard/{SummaryCard,StatusBadge,ProgressRing}.tsx
├── lib/
│   ├── api.ts                  # Client-side fetch helpers
│   ├── auth.ts                 # Server-side session/cookie/password
│   └── utils.ts                # formatRupiah, formatDate, dll.
├── db/
│   └── index.ts                # Neon connection + schema + seed
├── types.ts                    # TypeScript types
├── data.ts                     # Static data (events, sermons, gallery)
└── middleware.ts               # Proteksi route /dashboard/*

public/
├── images/                     # Logo, foto kegiatan, aula, dll.
├── manifest.json               # PWA manifest
├── robots.txt
└── sitemap.xml
```

---

## 🔐 Catatan Keamanan

- Dashboard diproteksi middleware (`src/middleware.ts`) — redirect ke `/login` jika belum auth
- Session disimpan di cookie **HTTP-only + Secure + SameSite=Lax** (tidak bisa diakses JS)
- Cookie ditandatangani HMAC-SHA256 dengan `AUTH_SECRET` (timing-safe comparison)
- Password diverifikasi dengan `timingSafeEqual` (anti timing attack)
- Endpoint mutating (POST/PATCH/DELETE) diverifikasi ulang di server
- `.env*` di-gitignore, jangan pernah commit

---

## 📞 Kontak DKM

- **Alamat:** Jl. Telukjambe Timur No. 23, Karawang, Jawa Barat 41361
- **WhatsApp:** +62 895-4142-83161 (Humas DKM)
- **Email:** puritelukjambemasjidraya@gmail.com
- **Instagram:** @masjidrayapuritelukjambe
- **YouTube:** @masjidrayapuritelukjambe_TV

---

Dibangun dengan ❤️ untuk transparansi dan kemajuan dakwah Masjid Raya Puri Telukjambe.
