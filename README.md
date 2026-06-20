# Website Profil & Sistem Informasi Masjid Raya Puri Telukjambe (PTJ)

Proyek ini adalah sistem informasi dan portal website interaktif untuk **Masjid Raya Puri Telukjambe (PTJ)**, Karawang. Website ini dibangun menggunakan teknologi modern web development (React, TypeScript, Vite, Tailwind CSS) dengan tujuan untuk memberikan informasi yang transparan, mudah diakses, dan interaktif bagi jamaah dan masyarakat.

## 🌟 Fitur Utama yang Telah Diimplementasikan (Crosscheck)

1. **Dashboard Beranda & Hero Section**: Tampilan selamat datang yang informatif dengan call-to-action (CTA) yang jelas.
2. **Jadwal Shalat Real-time**: Menampilkan jadwal shalat 5 waktu.
3. **Kajian Dakwah & Sosial (Event Section)**: Menginformasikan kegiatan rutin, kajian akbar, dan acara sosial.
4. **Transparansi Catatan Kas**: Menampilkan laporan keuangan masjid (infaq, sedekah, dan pengeluaran) secara transparan.
5. **Jadwal Dewan Khutbah**: Informasi khatib Jumat yang bertugas.
6. **Layanan Sewa Aula & Booking System**: Formulir untuk memfasilitasi jamaah yang ingin menyewa aula serbaguna masjid, terintegrasi dengan WhatsApp admin.
7. **Pintu Infaq & Sedekah (Donation Section)**: Fitur donasi digital (QRIS & Transfer Bank) dengan kalkulator simulasi dan konfirmasi via WhatsApp.
8. **Galeri Kegiatan**: Dokumentasi visual (lightbox gallery) untuk aktivitas masjid.
9. **Integrasi Media Sosial**: Tautan interaktif menuju Instagram, Facebook, dan YouTube masjid.

## 🚀 Rencana Pengembangan Selanjutnya (Future Work Plan)

Berikut adalah *roadmap* pengembangan sistem yang direkomendasikan untuk fase selanjutnya:

### Fase 1: Backend & Database Integration (CMS)
- [ ] **Pengembangan API**: Membangun backend (contoh: Node.js/Express atau Laravel) untuk menyediakan data dinamis.
- [ ] **Database Management**: Mengintegrasikan database (PostgreSQL/MySQL/MongoDB) untuk menyimpan data jadwal shalat, event, laporan kas, dan log pemesanan aula.
- [ ] **Dashboard Admin Panel**: Membuat antarmuka khusus (CMS) bagi pengurus DKM untuk menambah, mengedit, dan menghapus konten website tanpa perlu mengubah kode sumber.

### Fase 2: Otomatisasi & Pembayaran (Payment Gateway)
- [ ] **Integrasi Payment Gateway**: Mengganti simulasi donasi dengan integrasi *payment gateway* (seperti Midtrans atau Xendit) agar donasi QRIS/Transfer dapat diverifikasi secara otomatis.
- [ ] **Sistem Notifikasi Booking**: Mengimplementasikan notifikasi email otomatis atau bot WhatsApp untuk konfirmasi penyewaan aula kepada jamaah dan admin.

### Fase 3: Peningkatan Pengalaman Pengguna (UX) & Optimasi
- [ ] **PWA (Progressive Web App)**: Mengonfigurasi website agar dapat diunduh/di-install ke *homescreen* smartphone jamaah selayaknya aplikasi *native*.
- [ ] **Fitur Multi-bahasa (i18n)**: Menambahkan dukungan multi-bahasa (Bahasa Indonesia, Inggris, dan Arab) untuk memperluas jangkauan dakwah.
- [ ] **Live Streaming Kajian**: Integrasi langsung ke YouTube API untuk menampilkan *live streaming* kajian dan khutbah Jumat di halaman beranda.
- [ ] **Artikel & Blog Dakwah**: Menambahkan section untuk mempublikasikan artikel islami, buletin Jumat, dan ringkasan kajian.

## 🛠 Panduan Instalasi (Run Locally)

**Persyaratan:** Node.js versi terbaru

1. Install dependensi:
   ```bash
   npm install
   ```
2. Jalankan aplikasi di lingkungan *development*:
   ```bash
   npm run dev
   ```
3. *Build* untuk lingkungan *production*:
   ```bash
   npm run build
   ```

---
*Dibuat dengan ❤️ untuk transparansi dan kemajuan dakwah Masjid Raya Puri Telukjambe.*
