#!/usr/bin/env node
// Keep the Flask backend's copy of the Learning Studio in step with learning/.
//
//   learning/  (source of truth, works from file://)
//     -> optional-flask-backend/ah_webapp/connected/learning/  (served by Flask)
//
// The two copies differ ONLY by a few deliberate link rewrites (relative file
// paths -> server routes such as /hub). Those rewrites live in RULES below and
// each must match exactly once, so if the source changes shape the sync fails
// loudly instead of silently shipping a broken link.
//
// Usage:
//   node scripts/sync-flask-learning.js            copy + transform (writes)
//   node scripts/sync-flask-learning.js --dry-run  show what would change
//   node scripts/sync-flask-learning.js --check    exit 1 if out of sync (for CI)
//   node scripts/sync-flask-learning.js --prune    also delete files only present in the target
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'learning');
const DEST = path.join(ROOT, 'optional-flask-backend', 'ah_webapp', 'connected', 'learning');

// Dev-only files that the backend does not need.
const EXCLUDE = [/^tests\//, /^theories-source-template\.csv$/];

// [relative path, exact text in the static copy, replacement for the Flask copy]
const RULES = {
  'index.html': [
    ['<a href="../worldforge-app/index.html" data-workbench-link>', '<a href="/worldforge-app/" data-workbench-link>'],
    ['<a href="../index.html" data-workbench-link>', '<a href="/hub" data-workbench-link>'],
    ['<a href="../harness/index.html" data-workbench-link>', '<a href="/harness/" data-workbench-link>'],
  ],
  'worldforge/index.html': [
    ['<a class="p" href="../../worldforge-app/index.html">', '<a class="p" href="/worldforge-app/">'],
  ],
  'worldforge/wf-shell.js': [
    ["var APP='../../worldforge-app/index.html'", "var APP='/worldforge-app/'"],
    ["HUB='../../hub.html'", "HUB='/hub'"],
  ],
  'domains/harness.html': [
    // The new overview page (harness/home.html) is static-site only; Flask serves just the Command Builder at /harness/.
    ['href="../../harness/home.html"', 'href="/harness/"', 2],
    // Flask serves only the Command Builder at /harness/ (no overview.html), so capability/overview links land there.
    ['href="../../harness/overview.html', 'href="/harness/', 8],
    ['href="../../docs/AH-CORE-ARCH-001.html#capability-maturity-levels"', 'href="/hub"'],
    ['href="../../index.html"', 'href="/hub"'],
  ],
  // The Flask app does not serve /docs, so spec links fall back to the hub.
  // Third element = exact number of matches expected (default 1).
  'domains/core.html': [
    ['href="../../docs/AH-CORE-ARCH-001.html"', 'href="/hub"'],
    ['href="../../docs/AH-CORE-ARCH-001.html#authority-boundary"', 'href="/hub"'],
    ['href="../../index.html"', 'href="/hub"'],
  ],
  'domains/core-module.js': [
    ["var SPEC = '../../docs/AH-CORE-ARCH-001.html', HUB = '../../index.html'", "var SPEC = '/hub', HUB = '/hub'"],
  ],
  'domains/worldforge.html': [
    ['href="../../worldforge-app/index.html"', 'href="/worldforge-app/"'],
    ['href="../../index.html"', 'href="/hub"'],
  ],
  'worldforge/verified-2026-10-28/index.html': [
    ['src="../../../worldforge-app/index.html#after-humanity"', 'src="/worldforge-app/#after-humanity"'],
  ],
};

function walk(dir, base = dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, base, out);
    else out.push(path.relative(base, p).split(path.sep).join('/'));
  }
  return out;
}

function expectedContent(rel, src, rules) {
  const buf = fs.readFileSync(path.join(src, rel));
  const list = rules[rel] || [];
  const isHtml = /\.html$/i.test(rel);
  if (!list.length && !isHtml) return buf;
  let text = buf.toString('utf8');
  // The floating Home button points at the root index.html; Flask serves that page at /hub.
  if (isHtml) text = text.replace(/(<a class="ah-home" data-ah-home href=")[^"]*(")/g, '$1/hub$2');
  for (const [from, to, want = 1] of list) {
    const n = text.split(from).length - 1;
    if (n !== want) throw new Error(`${rel}: expected exactly ${want} match${want === 1 ? '' : 'es'} for rewrite rule, found ${n}:\n    ${from}`);
    text = text.split(from).join(to);
  }
  return Buffer.from(text, 'utf8');
}

function sync({ src = SRC, dest = DEST, rules = RULES, exclude = EXCLUDE, write = true, prune = false } = {}) {
  const files = walk(src).filter(r => !exclude.some(rx => rx.test(r)));
  const report = { added: [], changed: [], same: 0, extra: [], pruned: [] };
  for (const rel of files) {
    const want = expectedContent(rel, src, rules);
    const target = path.join(dest, rel);
    if (!fs.existsSync(target)) report.added.push(rel);
    else if (!fs.readFileSync(target).equals(want)) report.changed.push(rel);
    else { report.same++; continue; }
    if (write) { fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, want); }
  }
  const wanted = new Set(files);
  if (fs.existsSync(dest)) {
    for (const rel of walk(dest)) if (!wanted.has(rel)) {
      report.extra.push(rel);
      if (write && prune) { fs.unlinkSync(path.join(dest, rel)); report.pruned.push(rel); }
    }
  }
  report.inSync = !report.added.length && !report.changed.length && (!report.extra.length || report.pruned.length === report.extra.length);
  return report;
}

module.exports = { sync, RULES, EXCLUDE };

if (require.main === module) {
  const a = new Set(process.argv.slice(2));
  const check = a.has('--check'), dry = a.has('--dry-run'), prune = a.has('--prune');
  let r;
  try { r = sync({ write: !check && !dry, prune }); }
  catch (e) { console.error('SYNC FAILED: ' + e.message); process.exit(2); }
  const show = (label, xs) => xs.length && console.log(`${label} (${xs.length}):\n` + xs.map(x => '  ' + x).join('\n'));
  show(check || dry ? 'Would add' : 'Added', r.added);
  show(check || dry ? 'Out of date' : 'Updated', r.changed);
  show(prune && !check && !dry ? 'Pruned' : 'Only in backend copy', prune && !check && !dry ? r.pruned : r.extra);
  console.log(`${r.same} file(s) already identical.`);
  if (check) {
    if (r.inSync) console.log('OK: backend copy is in sync.');
    else { console.error('OUT OF SYNC. Run: node scripts/sync-flask-learning.js'); process.exit(1); }
  }
}
