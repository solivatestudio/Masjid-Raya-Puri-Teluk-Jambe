const fs = require('fs');
const path = require('path');

const exts = /\.(ts|tsx|js|css|json|md|env)$/;
let totalFixed = 0;
const fixedFiles = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir, { withFileTypes: true }).forEach((x) => {
    const p = path.join(dir, x.name);
    if (x.isDirectory()) {
      // skip node_modules, .next, .git
      if (['node_modules', '.next', '.git', 'dist', 'build'].includes(x.name)) return;
      walk(p);
    } else if (exts.test(x.name)) {
      const buf = fs.readFileSync(p);
      // Check for BOM
      if (buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
        fs.writeFileSync(p, buf.subarray(3));
        totalFixed++;
        fixedFiles.push(p);
      }
    }
  });
}

const dirsToScan = ['src', 'scripts'];
dirsToScan.forEach((d) => walk(d));

// Also fix root files
['.env.example', '.env.local', 'package.json', 'tsconfig.json', 'next.config.mjs', 'postcss.config.mjs', 'README.md', 'vercel.json', '.gitignore'].forEach((f) => {
  if (fs.existsSync(f)) {
    const buf = fs.readFileSync(f);
    if (buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
      fs.writeFileSync(f, buf.subarray(3));
      totalFixed++;
      fixedFiles.push(f);
    }
  }
});

console.log(`Fixed ${totalFixed} files with BOM:`);
fixedFiles.forEach((f) => console.log(' -', f));