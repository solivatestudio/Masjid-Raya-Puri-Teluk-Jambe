const fs = require('fs');

const files = [
  'src/components/EventSection.tsx',
  'src/components/FridaySermonSection.tsx',
  'src/app/dashboard/kajian/new/page.tsx',
  'src/app/dashboard/articles/new/page.tsx',
];

for (const f of files) {
  if (!fs.existsSync(f)) continue;
  let c = fs.readFileSync(f, 'utf8');
  const orig = c;
  // Replace any broken UTF-8 mojibake (sequences starting with ðŸ which is U+00F0 followed by Â)
  // Simple approach: replace U+00F0 U+0178 U+00BF (ðŸ¿) which is mostly U+1F... emoji corrupted
  // We'll just search for the mojibake pattern and clean it

  // Find lines with broken chars
  const lines = c.split('\n');
  const broken = [];
  lines.forEach((l, i) => {
    // Detect mojibake: sequences of 2-byte Latin-1 chars from UTF-8
    if (/[\u00C0-\u00DF][\u0080-\u00BF]/.test(l)) {
      broken.push({ line: i + 1, text: l.substring(l.length - 100) });
    }
  });
  if (broken.length) {
    console.log(`\n${f}:`);
    broken.forEach((b) => console.log(`  L${b.line}: ...${b.text}`));
  }
}