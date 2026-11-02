// Adds a floating "Home" button (links to the root index.html) to every page.
// Safe to re-run: pages that already have it are skipped.  Usage: node scripts/add-home-button.js
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const SKIP = new Set(['index.html', 'AH-AIOS-Standalone.html']);          // root home itself + single-file build
const FLASK = 'optional-flask-backend/';
const flaskGenerated = rel => rel.startsWith(FLASK + 'ah_webapp/connected/learning/'); // written by sync-flask-learning.js

const snippet = href => `<a class="ah-home" data-ah-home href="${href}" aria-label="Home: AH-AIOS Learning App Studio"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h13V10M10 20v-5h4v5"/></svg>Home</a>
<style>.ah-home{position:fixed;right:18px;bottom:calc(18px + env(safe-area-inset-bottom,0px));z-index:2147483000;display:inline-flex;align-items:center;gap:7px;padding:10px 16px;border-radius:999px;background:rgba(8,24,42,.94);color:#f1f7ff;border:1px solid #39c8ff;font:600 13px/1 system-ui,-apple-system,Segoe UI,Arial,sans-serif;text-decoration:none;box-shadow:0 0 18px rgba(57,200,255,.35);transition:background .2s}.ah-home:hover{background:#1597ff}.ah-home:focus-visible{outline:2px solid #fff;outline-offset:2px}.ah-home[hidden]{display:none}@media print{.ah-home{display:none}}</style>
<script>if(self!==top){var h=document.querySelector('[data-ah-home]');if(h)h.hidden=true}</script>`;

function walk(d, out = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === '_site' || e.name.startsWith('.')) continue;
    const p = path.join(d, e.name);
    e.isDirectory() ? walk(p, out) : /\.html$/i.test(e.name) && out.push(p);
  }
  return out;
}
let n = 0;
for (const file of walk(ROOT)) {
  const rel = path.relative(ROOT, file).split(path.sep).join('/');
  if (SKIP.has(rel) || flaskGenerated(rel)) continue;
  let t = fs.readFileSync(file, 'utf8');
  if (t.includes('data-ah-home')) continue;
  const inFlask = rel.startsWith(FLASK);
  const href = inFlask ? '/hub' : (path.relative(path.dirname(file), path.join(ROOT, 'index.html')).split(path.sep).join('/'));
  const eol = t.includes('\r\n') ? '\r\n' : '\n';
  const s = snippet(href).replace(/\n/g, eol) + eol;
  const i = t.search(/<\/body\s*>/i);
  t = i >= 0 ? t.slice(0, i) + s + t.slice(i) : t + eol + s;
  fs.writeFileSync(file, t); n++;
}
console.log(`Home button added to ${n} page(s).`);
