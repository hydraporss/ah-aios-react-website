#!/usr/bin/env node
// Build the 82-theory import file for the Learning Studio from YOUR source list.
// It never invents records: it only converts, checks and refuses.
//
// Usage:  node scripts/build-theories.js <source.csv|source.json> [out.json]
//
// CSV columns: id,title,classification,summary,source,relationships
//   classification = registry | synthesized
//   source         = REQUIRED provenance (where this theory comes from)
//   relationships  = other theory ids separated by ';'  (optional)
// Any extra columns are carried through as extra fields.
// JSON input may be an array of records, or {records:[...]}.
const fs = require('fs');
const path = require('path');
const { validateTheoryCollection, validateIntegrity } = require('../learning/theory-validation.js');


function parseCSV(text) {
  const rows = []; let row = [], cell = '', q = false;
  text = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); cell = '';
      if (row.some(x => x.trim() !== '')) rows.push(row);
      row = [];
    } else cell += c;
  }
  row.push(cell);
  if (row.some(x => x.trim() !== '')) rows.push(row);
  return rows;
}

function fromCSV(text) {
  const rows = parseCSV(text);
  if (!rows.length) return [];
  const head = rows[0].map(h => h.trim());
  return rows.slice(1).map(r => {
    const rec = {};
    head.forEach((h, i) => {
      const v = (r[i] || '').trim();
      if (!h || v === '') return;
      if (h === 'classification') rec.origin = v;
      else if (h === 'relationships') rec.relationships = v.split(';').map(s => s.trim()).filter(Boolean);
      else rec[h] = v;
    });
    return rec;
  });
}

function build(text, format) {
  const errors = [];
  let records;
  try {
    if (format === 'json') {
      const x = JSON.parse(text);
      records = Array.isArray(x) ? x : x && Array.isArray(x.records) ? x.records : null;
      if (!records) return { ok: false, errors: ['JSON must be an array or {records:[...]}'] };
    } else records = fromCSV(text);
  } catch (e) { return { ok: false, errors: ['Could not parse input: ' + e.message] }; }

  const integrity = validateIntegrity(records);
  errors.push(...integrity.errors);

  const checked = validateTheoryCollection(records);
  errors.unshift(...checked.errors);
  return { ok: errors.length === 0, errors, records, counts: checked.counts };
}

module.exports = { build, parseCSV };

if (require.main === module) {
  const [src, out = 'theories-import.json'] = process.argv.slice(2);
  if (!src) { console.error('Usage: node scripts/build-theories.js <source.csv|source.json> [out.json]'); process.exit(2); }
  const format = path.extname(src).toLowerCase() === '.json' ? 'json' : 'csv';
  const res = build(fs.readFileSync(src, 'utf8'), format);
  if (!res.ok) {
    console.error(`NOT WRITTEN - ${res.errors.length} problem(s):`);
    res.errors.slice(0, 40).forEach(e => console.error('  - ' + e));
    if (res.errors.length > 40) console.error(`  ... and ${res.errors.length - 40} more`);
    process.exit(1);
  }
  fs.writeFileSync(out, JSON.stringify(res.records, null, 2) + '\n');
  console.log(`Wrote ${out}: ${res.records.length} records (${res.counts.registry} registry, ${res.counts.synthesized} synthesized).`);
  console.log('Structural validation only - provenance and facts still need human review.');
}
