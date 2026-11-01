// Fails if any local href/src in the static pages points at a missing file.
// Usage: node scripts/check-links.js
const fs = require('fs');
const path = require('path');

const root = process.env.SITE_ROOT ? path.resolve(process.env.SITE_ROOT) : path.resolve(__dirname, '..');
// Every .html page in the published tree is checked (not a hand-kept list), so new pages are covered automatically.
// The Flask backend, tooling and dev-only folders are not part of the static site.
const SKIP_DIRS = new Set(['optional-flask-backend', 'node_modules', '_site', '.git', '.github', 'scripts', 'tests']);
function discover(dir, rel = '') {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    if (e.isDirectory()) return SKIP_DIRS.has(e.name) ? [] : discover(path.join(dir, e.name), rel ? rel + '/' + e.name : e.name);
    return e.name.endsWith('.html') ? [rel ? rel + '/' + e.name : e.name] : [];
  });
}
const pages = discover(root).sort();
const REQUIRED = ['index.html', 'hub.html', 'workbench.html', 'learning/index.html', 'landing/index.html', 'harness/index.html', 'worldforge-app/index.html', '404.html'];
const attr = /(?:href|src)\s*=\s*["']([^"']+)["']/gi;
let bad = 0;
for (const r of REQUIRED) if (!pages.includes(r)) { console.error(`MISSING REQUIRED PAGE: ${r}`); bad++; }

for (const page of pages) {
  const file = path.join(root, page);
  if (!fs.existsSync(file)) { console.error(`MISSING PAGE: ${page}`); bad++; continue; }
  const html = fs.readFileSync(file, 'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, m => (/\bsrc\s*=/.test(m.slice(0, m.indexOf('>') + 1)) ? m.slice(0, m.indexOf('>') + 1) : ''));
  for (const m of html.matchAll(attr)) {
    const u = m[1];
    if (/^(https?:|mailto:|javascript:|data:|#|\/\/)/i.test(u) || u.includes('{{') || u.includes('${')) continue;
    const target = path.join(path.dirname(file), decodeURIComponent(u.split('#')[0].split('?')[0]));
    if (!fs.existsSync(target)) { console.error(`BROKEN in ${page}: ${u}`); bad++; }
  }
}
if (bad) { console.error(`${bad} problem(s)`); process.exit(1); }
console.log(`link check OK (${pages.length} pages)`);
