// Makes every site page installable: manifest link, apple-touch-icon, theme-color and the service-worker registration script.
// Safe to re-run: pages that already have data-ah-pwa are skipped.  Usage: node scripts/add-pwa.js
// After running, refresh the pages embedded in AH-AIOS-Standalone.html and run `npm run sync` + `npm run update:manifest`.
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const SKIP_FILES = new Set(['404.html',                    // served at arbitrary depths on Pages, so relative paths would break
  'AH-AIOS-Standalone.html',                              // single-file build, no service worker possible
  'offline.html',
  'learning/index.html']);                                // keeps its own manifest + /learning/ service worker
const SKIP_DIRS = new Set(['node_modules', '_site', 'optional-flask-backend', 'archive', 'desktop']);

function walk(d, out = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.name.startsWith('.') || (e.isDirectory() && SKIP_DIRS.has(e.name))) continue;
    const p = path.join(d, e.name);
    e.isDirectory() ? walk(p, out) : /\.html$/i.test(e.name) && out.push(p);
  }
  return out;
}
let n = 0; const noHead = [];
for (const file of walk(ROOT)) {
  const rel = path.relative(ROOT, file).split(path.sep).join('/');
  if (SKIP_FILES.has(rel)) continue;
  let t = fs.readFileSync(file, 'utf8');
  if (t.includes('data-ah-pwa')) continue;
  const i = t.search(/<\/head\s*>/i);
  if (i < 0) { noHead.push(rel); continue; }
  const up = path.relative(path.dirname(file), ROOT).split(path.sep).join('/');
  const base = up ? up + '/' : '';
  const eol = t.includes('\r\n') ? '\r\n' : '\n';
  const head = t.slice(0, i);
  const lines = [];
  if (!/rel\s*=\s*["']manifest["']/i.test(head)) lines.push(`<link rel="manifest" href="${base}manifest.webmanifest">`);
  if (!/rel\s*=\s*["']apple-touch-icon["']/i.test(head)) lines.push(`<link rel="apple-touch-icon" href="${base}assets/pwa/apple-touch-icon.png">`);
  if (!/name\s*=\s*["']theme-color["']/i.test(head)) lines.push('<meta name="theme-color" content="#050d19">');
  lines.push(`<script src="${base}pwa.js" defer data-ah-pwa></script>`);
  t = t.slice(0, i) + lines.join(eol) + eol + t.slice(i);
  fs.writeFileSync(file, t); n++;
}
console.log(`PWA tags added to ${n} page(s).`);
if (noHead.length) console.log('Skipped (no </head>): ' + noHead.join(', '));
