const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { sync } = require('../../scripts/sync-flask-learning.js');

function tree(files) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'sync-'));
  for (const [rel, text] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(d, rel)), { recursive: true });
    fs.writeFileSync(path.join(d, rel), text);
  }
  return d;
}
const read = (d, rel) => fs.readFileSync(path.join(d, rel), 'utf8');
const RULES = { 'index.html': [['href="../index.html"', 'href="/hub"']] };
const EXCLUDE = [/^tests\//];
const base = () => ({ 'index.html': '<a href="../index.html">x</a>', 'app.js': 'a', 'tests/t.js': 't' });

test('copies, applies rewrite rules, skips excluded files', () => {
  const src = tree(base()), dest = tree({});
  const r = sync({ src, dest, rules: RULES, exclude: EXCLUDE });
  assert.deepEqual(r.added.sort(), ['app.js', 'index.html']);
  assert.equal(read(dest, 'index.html'), '<a href="/hub">x</a>');
  assert.ok(!fs.existsSync(path.join(dest, 'tests/t.js')));
});

test('is idempotent: second run changes nothing and reports in sync', () => {
  const src = tree(base()), dest = tree({});
  sync({ src, dest, rules: RULES, exclude: EXCLUDE });
  const r = sync({ src, dest, rules: RULES, exclude: EXCLUDE, write: false });
  assert.ok(r.inSync);
  assert.equal(r.same, 2);
});

test('detects drift without writing when write=false', () => {
  const src = tree(base()), dest = tree({});
  sync({ src, dest, rules: RULES, exclude: EXCLUDE });
  fs.writeFileSync(path.join(src, 'app.js'), 'changed');
  const r = sync({ src, dest, rules: RULES, exclude: EXCLUDE, write: false });
  assert.ok(!r.inSync);
  assert.deepEqual(r.changed, ['app.js']);
  assert.equal(read(dest, 'app.js'), 'a');
});

test('rewrite rule that no longer matches fails loudly', () => {
  const src = tree({ 'index.html': '<p>no link here</p>' }), dest = tree({});
  assert.throws(() => sync({ src, dest, rules: RULES, exclude: EXCLUDE }), /exactly 1 match/);
});

test('rewrite rule that matches twice fails loudly', () => {
  const src = tree({ 'index.html': 'href="../index.html" href="../index.html"' }), dest = tree({});
  assert.throws(() => sync({ src, dest, rules: RULES, exclude: EXCLUDE }), /found 2/);
});

test('extra files in the target are reported, only deleted with prune', () => {
  const src = tree(base()), dest = tree({ 'stray.js': 's' });
  let r = sync({ src, dest, rules: RULES, exclude: EXCLUDE });
  assert.deepEqual(r.extra, ['stray.js']);
  assert.ok(fs.existsSync(path.join(dest, 'stray.js')));
  assert.ok(!r.inSync);
  r = sync({ src, dest, rules: RULES, exclude: EXCLUDE, prune: true });
  assert.ok(!fs.existsSync(path.join(dest, 'stray.js')));
  assert.ok(r.inSync);
});

test('the real backend copy is in sync with learning/', () => {
  const r = sync({ write: false });
  assert.ok(r.inSync, 'run: node scripts/sync-flask-learning.js  (changed: ' + r.changed.concat(r.added).join(', ') + ')');
});
