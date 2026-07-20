const fs = require('fs');
const path = require('path');

const targetFiles = [
  'src/components/HeroSection.tsx',
  'src/components/EventSection.tsx',
  'src/components/FridaySermonSection.tsx',
  'src/components/BookingSection.tsx',
  'src/components/DonationSection.tsx',
  'src/components/GallerySection.tsx',
  'src/components/PrayerTimes.tsx',
  'src/app/page.tsx',
  'src/app/LandingPageClient.tsx',
  'src/app/dashboard/kajian/new/page.tsx',
  'src/app/dashboard/articles/new/page.tsx',
  'src/app/dashboard/booking/page.tsx',
];

targetFiles.forEach((f) => {
  if (!fs.existsSync(f)) return;
  const c = fs.readFileSync(f, 'utf8');
  const lines = c.split('\n');
  lines.forEach((l, i) => {
    // Mojibake patterns: ðŸ (UTF-8 bytes 0xC3 0xB0 0xC5 0x9F interpreted as Latin-1)
    // Or common patterns from corrupted UTF-8
    if (/ðŸ|â€|âœ|ï¸/.test(l)) {
      console.log(`${f}:${i + 1}: ${l.substring(l.length - 150)}`);
    }
  });
});