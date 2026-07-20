const fs = require('fs');

// Map of file -> list of replacements (find -> replace)
const replacements = {
  'src/components/EventSection.tsx': [
    ["'ðŸ“– Dakwah & Kajian'", "'Dakwah & Kajian'"],
    ["\"ðŸ¤ Dauroh Al-Qur'an\"", "\"Dauroh Al-Qur'an\""],
    ['<div className="text-4xl mb-3">ðŸ"ï¸</div>', '<div className="text-4xl mb-3">🔍</div>'],
  ],
  'src/components/FridaySermonSection.tsx': [
    ['*INFO JUMAT MASJID RAYA PURI TELUKJAMBE*\\nðŸ"… Tanggal: ${date}\\nðŸŽ™ï¸ Khatib: ${khatib}\\nðŸ"– Tema: "${theme}"\\nMari bersiap bergegas menghadiri shalat jumat berjamaah tepat waktu.`',
     '*INFO JUMAT MASJID RAYA PURI TELUKJAMBE*\\nTanggal: ${date}\\nKhatib: ${khatib}\\nTema: "${theme}"\\nMari bersiap bergegas menghadiri shalat jumat berjamaah tepat waktu.'],
  ],
  'src/components/DonationSection.tsx': [
    ['*${formatRupiah(finalAmount)}*\\nâ€¢ Metode: QRIS / Transfer Bank', '*${formatRupiah(finalAmount)}*\\n- Metode: QRIS / Transfer Bank'],
  ],
  'src/app/LandingPageClient.tsx': [
    ['>âœ•</button>', '>✕</button>'],
    ['pukul 08:30 â€“ 16:30 WIB.', 'pukul 08:30 - 16:30 WIB.'],
    ['<span>â€¢</span>', '<span>|</span>'],
  ],
  'src/app/dashboard/kajian/new/page.tsx': [
    ['<option value="">â€" pilih hari â€"</option>', '<option value="">- pilih hari -</option>'],
  ],
  'src/app/dashboard/articles/new/page.tsx': [
    ['ðŸ"¡ Gambar otomatis dikonversi ke', 'Gambar otomatis dikonversi ke'],
  ],
};

let totalFixed = 0;
for (const [f, pairs] of Object.entries(replacements)) {
  if (!fs.existsSync(f)) {
    console.log(`SKIP (not found): ${f}`);
    continue;
  }
  let c = fs.readFileSync(f, 'utf8');
  let fileChanged = false;
  for (const [find, replace] of pairs) {
    if (c.includes(find)) {
      c = c.split(find).join(replace);
      console.log(`Fixed: ${f} - "${find.substring(0, 50)}..."`);
      totalFixed++;
      fileChanged = true;
    } else {
      console.log(`  (not found): "${find.substring(0, 50)}..."`);
    }
  }
  if (fileChanged) fs.writeFileSync(f, c, 'utf8');
}

console.log(`\nTotal replacements made: ${totalFixed}`);