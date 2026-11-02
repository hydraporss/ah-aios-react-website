const test = require('node:test');
const assert = require('node:assert');
const { build } = require('../../scripts/build-theories.js');

// SYNTHETIC fixture generated in-test only; never shipped as data.
function fixture(mut) {
  const rows = [];
  for (let i = 1; i <= 82; i++) rows.push({ id: 'T-' + i, title: 'Fixture ' + i, origin: i <= 68 ? 'registry' : 'synthesized', source: 'fixture-src', ...(i > 1 ? { relationships: ['T-1'] } : {}) });
  if (mut) mut(rows);
  return JSON.stringify(rows);
}
const ok = f => build(f, 'json');

test('accepts a complete 68+14 set', () => { const r = ok(fixture()); assert.ok(r.ok, r.errors.join()); assert.deepEqual(r.counts, { registry: 68, synthesized: 14 }); });
test('rejects wrong count', () => assert.ok(!ok(fixture(r => r.pop())).ok));
test('rejects wrong split', () => assert.ok(!ok(fixture(r => { r[0].origin = 'synthesized'; })).ok));
test('rejects duplicate ids', () => assert.ok(!ok(fixture(r => { r[1].id = 'T-1'; })).ok));
test('rejects missing source (provenance)', () => assert.ok(ok(fixture(r => { delete r[5].source; })).errors.some(e => /source/.test(e))));
test('rejects placeholder titles', () => assert.ok(!ok(fixture(r => { r[3].title = 'TODO'; })).ok));
test('rejects dangling relationship', () => assert.ok(ok(fixture(r => { r[2].relationships = ['T-999']; })).errors.some(e => /T-999/.test(e))));
test('CSV path: maps classification and splits relationships', () => {
  const csv = 'id,title,classification,source,relationships\nA,"Quoted, title",registry,s,B;C\n';
  const r = build(csv, 'csv');
  assert.equal(r.records[0].title, 'Quoted, title');
  assert.equal(r.records[0].origin, 'registry');
  assert.deepEqual(r.records[0].relationships, ['B', 'C']);
});
test('shipped template cannot be imported as-is', () => {
  const t = require('fs').readFileSync(require('path').join(__dirname, '../theories-source-template.csv'), 'utf8');
  assert.ok(!build(t, 'csv').ok);
});
