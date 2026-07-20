const fs = require('fs');
const path = require('path');

const files = [
  'src/components/HeroSection.tsx',
  'src/components/EventSection.tsx',
  'src/components/FridaySermonSection.tsx',
  'src/components/BookingSection.tsx',
  'src/components/DonationSection.tsx',
  'src/components/GallerySection.tsx',
  'src/components/PrayerTimes.tsx',
  'src/app/page.tsx',
  'src/app/LandingPageClient.tsx',
];

files.forEach((f) => {
  const c = fs.readFileSync(f, 'utf8');
  const lines = c.split('\n');
  lines.forEach((l, i) => {
    const emojis = l.match(/[\u{1F000}-\u{1FFFF}]|[\u{2600}-\u{27BF}]/gu);
    if (emojis) {
      console.log(`${f}:${i + 1}: ${emojis.join(' ')}`);
    }
  });
});