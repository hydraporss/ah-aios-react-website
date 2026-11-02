'use strict';
// Copies the static site (same contents GitHub Pages publishes) into desktop/app.
// Cross-platform (no bash needed), so it works on a plain Windows machine.
const fs = require('fs');
const path = require('path');
const SRC = path.resolve(__dirname, '..');
const DEST = path.join(__dirname, 'app');
const SKIP_TOP = new Set(['.git', '.github', 'node_modules', '_site', 'desktop', 'optional-flask-backend', 'archive', 'scripts',
  'AH-AIOS-Standalone.html', 'package.json', 'package-lock.json', 'README.md', '.gitignore', '.gitattributes',
  'start-flask-backend.bat', 'start-flask-backend.command', 'start-local-site.bat', 'start-local-site.command']);
const SKIP_REL = ['learning/tests', 'learning/theories-source-template.csv', 'docs/reconciliation', 'docs/worldforge-reference',
  'docs/learning-app', 'docs/AH-AIOS-ARCHIVE-RECONCILIATION.md'];

function skip(src) {
  const rel = path.relative(SRC, src).split(path.sep).join('/');
  if (!rel) return false;
  if (SKIP_TOP.has(rel.split('/')[0]) && !rel.includes('/')) return true;
  if (SKIP_REL.some((s) => rel === s || rel.startsWith(s + '/'))) return true;
  return rel.toLowerCase().endsWith('.zip');
}

fs.rmSync(DEST, { recursive: true, force: true });
fs.mkdirSync(DEST, { recursive: true });
for (const e of fs.readdirSync(SRC)) {
  const from = path.join(SRC, e);
  if (skip(from)) continue;
  fs.cpSync(from, path.join(DEST, e), { recursive: true, filter: (x) => !skip(x) });
}
for (const must of ['index.html', 'hub.html', 'learning/index.html', 'learning/domains/harness.html', 'harness/overview.html', 'harness/home.html', 'worldforge-app/index.html']) {
  if (!fs.existsSync(path.join(DEST, must))) { console.error('prepare: missing ' + must); process.exit(1); }
}
let n = 0; (function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) e.isDirectory() ? walk(path.join(d, e.name)) : n++; })(DEST);
console.log('prepare: copied ' + n + ' files to desktop/app');
