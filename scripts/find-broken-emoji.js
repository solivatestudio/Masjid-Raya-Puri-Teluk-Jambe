const fs = require('fs');
const c = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');
const lines = c.split('\n');
console.log('Line 83 raw bytes:');
const buf = Buffer.from(lines[82] || '', 'utf8');
console.log('hex:', buf.toString('hex').substring(0, 200));
console.log('raw:', JSON.stringify(lines[82]));