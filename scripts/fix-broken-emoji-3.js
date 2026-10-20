const fs = require('fs');

// Final batch fix
const fixes = [
  // EventSection - line 84
  { file: 'src/components/EventSection.tsx', find: `"ðŸ¤ Dauroh Al-Qur'an"`, replace: `"Dauroh Al-Qur'an"` },
  { file: 'src/components/EventSection.tsx', find: `<div className="text-4xl mb-3">ðŸ"ï¸</div>`, replace: `<div className="text-4xl mb-3">🔍</div>` },

  // FridaySermonSection - copy text with emojis
  { file: 'src/components/FridaySermonSection.tsx', find: `*INFO JUMAT MASJID RAYA PURI TELUKJAMBE*\\nðŸ"… Tanggal: ${date}\\nðŸŽ™ï¸ Khatib: ${khatib}\\nðŸ"– Tema:`, replace: `*INFO JUMAT MASJID RAYA PURI TELUKJAMBE*\\nTanggal: ${date}\\nKhatib: ${khatib}\\nTema:` },

  // kajian/new - option text
  { file: 'src/app/dashboard/kajian/new/page.tsx', find: `â€" pilih hari â€"`, replace: `- pilih hari -` },

  // articles/new - info text
  { file: 'src/app/dashboard/articles/new/page.tsx', find: `ðŸ"¡ Gambar otomatis dikonversi ke`, replace: `Gambar otomatis dikonversi ke` },
];

let total = 0;
for (const { file, find, replace } of fixes) {
  if (!fs.existsSync(file)) {
    console.log(`SKIP ${file}`);
    continue;
  }
  let c = fs.readFileSync(file, 'utf8');
  if (c.includes(find)) {
    c = c.split(find).join(replace);
    fs.writeFileSync(file, c, 'utf8');
    console.log(`FIXED: ${file} - "${find.substring(0, 60)}..."`);
    total++;
  } else {
    console.log(`  not found: ${file} - "${find.substring(0, 60)}..."`);
  }
}

console.log(`\nTotal fixed: ${total}`);