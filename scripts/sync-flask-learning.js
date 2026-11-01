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
    [' · <a href="../../worldforge-app/index.html" style="color:var(--gold)">', ' · <a href="/worldforge-app/" style="color:var(--gold)">'],
    [' · <a href="../../index.html" style="color:var(--gold)">', ' · <a href="/hub" style="color:var(--gold)">'],
    [' · <a href="../../harness/index.html" style="color:var(--gold)">', ' · <a href="/harness/" style="color:var(--gold)">'],
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
  const list = rules[rel];
  if (!list) return buf;
  let text = buf.toString('utf8');
  for (const [from, to] of list) {
    const n = text.split(from).length - 1;
    if (n !== 1) throw new Error(`${rel}: expected exactly 1 match for rewrite rule, found ${n}:\n    ${from}`);
    text = text.replace(from, () => to);
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
