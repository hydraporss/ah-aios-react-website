#!/usr/bin/env node
'use strict';

// Reconciliation guard for the four Claude/Notion/Canon-Kernel evidence exports.
// This checks cross-artifact structure and accounting. It does NOT verify source truth,
// inspect book contents, prove Notion claims, or recompute hashes from the original books.

const fs = require('node:fs');
const path = require('node:path');

const DEFAULT_EXPECTED = Object.freeze({
  theories: 82,
  files: 203,
  pairs: 2905,
  bytes: 120250436,
  zeroByteFiles: 8,
  uniqueHashes: 196
});

const HEADERS = Object.freeze({
  theories: [
    'id', 'notion_title', 'candidate_file_count', 'candidate_coverage',
    'kernel_status', 'title_compare', 'kernel_has_valid_source_hash',
    'kernel_evidence_rows_total', 'kernel_evidence_rows_to_registry_sources',
    'kernel_evidence_rows_to_book_files'
  ],
  files: [
    'ordinal', 'name', 'candidate_theory_ids', 'match', 'kernel_size_bytes',
    'kernel_zero_byte', 'kernel_sha256', 'kernel_hash_is_valid_hex64',
    'kernel_source_verified_flag', 'kernel_evidence_rows',
    'kernel_evidence_passage_anchored_rows', 'link_level'
  ],
  pairs: [
    'file_ordinal', 'file_name', 'theory_id', 'notion_link_status',
    'relationship_class', 'passage_locator', 'proposition_examined',
    'evidence_quality', 'reviewer_status', 'kernel_file_status',
    'kernel_theory_status', 'kernel_evidence_row_for_this_pair'
  ]
});

function parseCsv(text) {
  if (typeof text !== 'string') throw new TypeError('CSV input must be a string.');
  text = text.replace(/^\uFEFF/, '');
  const rows = [];
  let row = [], cell = '', quoted = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') { cell += '"'; i++; }
        else quoted = false;
      } else cell += ch;
    } else if (ch === '"') {
      if (cell.length !== 0) throw new Error('Unexpected quote in an unquoted CSV field.');
      quoted = true;
    } else if (ch === ',') {
      row.push(cell); cell = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(cell);
      if (row.some(value => value !== '')) rows.push(row);
      row = []; cell = '';
    } else cell += ch;
  }

  if (quoted) throw new Error('CSV ends inside a quoted field.');
  row.push(cell);
  if (row.some(value => value !== '')) rows.push(row);
  if (!rows.length) throw new Error('CSV is empty.');

  const headers = rows.shift().map(value => value.trim());
  if (headers.some(value => !value)) throw new Error('CSV contains an empty header.');
  if (new Set(headers).size !== headers.length) throw new Error('CSV contains duplicate headers.');

  return rows.map((values, index) => {
    if (values.length !== headers.length) {
      throw new Error('CSV row ' + (index + 2) + ' has ' + values.length +
        ' fields; expected ' + headers.length + '.');
    }
    return Object.fromEntries(headers.map((header, i) => [header, values[i]]));
  });
}

function asInteger(value, label, errors) {
  const raw = String(value).trim();
  const n = Number(raw);
  if (!raw || !Number.isSafeInteger(n) || n < 0) {
    errors.push(label + ' must be a non-negative safe integer; got ' + JSON.stringify(value) + '.');
    return null;
  }
  return n;
}

function asBoolean(value, label, errors) {
  if (value === true || String(value).trim().toLowerCase() === 'true') return true;
  if (value === false || String(value).trim().toLowerCase() === 'false') return false;
  errors.push(label + ' must be true or false; got ' + JSON.stringify(value) + '.');
  return null;
}

function parseStringArray(value, label, errors) {
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed) || parsed.some(item => typeof item !== 'string' || !item.trim())) {
      throw new Error('expected an array of non-empty strings');
    }
    return parsed;
  } catch (error) {
    errors.push(label + ' must contain a JSON array of non-empty strings (' + error.message + ').');
    return null;
  }
}

function requireHeaders(rows, required, label, errors) {
  if (!rows.length) { errors.push(label + ' contains no data rows.'); return; }
  const present = new Set(Object.keys(rows[0]));
  for (const header of required) {
    if (!present.has(header)) errors.push(label + ' is missing required column "' + header + '".');
  }
}

function countBy(rows, field) {
  return rows.reduce((counts, row) => {
    const key = row[field];
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

function validateEvidence(input, options = {}) {
  const expected = { ...DEFAULT_EXPECTED, ...(options.expected || {}) };
  const errors = [];
  const warnings = [];
  let result = input.resultJson;

  if (typeof result === 'string') {
    try { result = JSON.parse(result); }
    catch (error) { errors.push('reconciliation-result.json is invalid JSON: ' + error.message); }
  }
  if (!result || typeof result !== 'object' || Array.isArray(result)) {
    errors.push('reconciliation-result.json must be a JSON object.');
    result = {};
  }

  let theories = [], files = [], pairs = [];
  for (const [key, label] of [
    ['theoryCsv', 'theory-reconciliation CSV'],
    ['fileCsv', 'file-reconciliation CSV'],
    ['pairCsv', 'theory-source-candidate-pairs CSV']
  ]) {
    try {
      const rows = parseCsv(input[key]);
      if (key === 'theoryCsv') theories = rows;
      if (key === 'fileCsv') files = rows;
      if (key === 'pairCsv') pairs = rows;
    } catch (error) { errors.push(label + ': ' + error.message); }
  }

  requireHeaders(theories, HEADERS.theories, 'theory-reconciliation CSV', errors);
  requireHeaders(files, HEADERS.files, 'file-reconciliation CSV', errors);
  requireHeaders(pairs, HEADERS.pairs, 'theory-source-candidate-pairs CSV', errors);

  const theoryIds = new Set();
  const missingSourceHashIds = [];
  let theoryEvidenceTotal = 0;
  for (const row of theories) {
    if (!row.id || !row.id.trim()) { errors.push('Theory row has an empty id.'); continue; }
    if (theoryIds.has(row.id)) errors.push('Duplicate theory id: ' + row.id + '.');
    theoryIds.add(row.id);
    if (row.kernel_status !== 'PRESENT') errors.push('Theory ' + row.id + ' is not PRESENT in the kernel.');
    const hasHash = asBoolean(row.kernel_has_valid_source_hash, 'Theory ' + row.id + ' source-hash flag', errors);
    if (hasHash === false) missingSourceHashIds.push(row.id);
    const total = asInteger(row.kernel_evidence_rows_total, 'Theory ' + row.id + ' total evidence rows', errors);
    const registry = asInteger(row.kernel_evidence_rows_to_registry_sources, 'Theory ' + row.id + ' registry evidence rows', errors);
    const books = asInteger(row.kernel_evidence_rows_to_book_files, 'Theory ' + row.id + ' book evidence rows', errors);
    if (total !== null && registry !== null && books !== null) {
      theoryEvidenceTotal += total;
      if (total !== registry + books) errors.push('Theory ' + row.id + ' evidence total does not equal registry + book evidence rows.');
    }
  }
  if (theories.length !== expected.theories) errors.push('Expected ' + expected.theories + ' theory rows; found ' + theories.length + '.');

  const fileByOrdinal = new Map();
  const fileByName = new Map();
  const fileCandidateIds = new Map();
  let totalBytes = 0, zeroByteFiles = 0, evidenceRowsOnFiles = 0;
  const hashes = new Set();

  for (const row of files) {
    const ordinal = asInteger(row.ordinal, 'File ordinal', errors);
    const size = asInteger(row.kernel_size_bytes, 'File ' + row.name + ' size', errors);
    const zero = asBoolean(row.kernel_zero_byte, 'File ' + row.name + ' zero-byte flag', errors);
    const hashFlag = asBoolean(row.kernel_hash_is_valid_hex64, 'File ' + row.name + ' hash-valid flag', errors);
    const verified = asBoolean(row.kernel_source_verified_flag, 'File ' + row.name + ' source-verified flag', errors);
    const evidenceCount = asInteger(row.kernel_evidence_rows, 'File ' + row.name + ' evidence-row count', errors);
    asInteger(row.kernel_evidence_passage_anchored_rows, 'File ' + row.name + ' passage-anchored evidence count', errors);

    if (!row.name) errors.push('File row has an empty name.');
    else if (fileByName.has(row.name)) errors.push('Duplicate source filename: ' + row.name + '.');
    else fileByName.set(row.name, row);

    if (ordinal !== null) {
      if (fileByOrdinal.has(ordinal)) errors.push('Duplicate source ordinal: ' + ordinal + '.');
      fileByOrdinal.set(ordinal, row);
    }
    if (size !== null) {
      totalBytes += size;
      if (zero !== null && zero !== (size === 0)) errors.push('File ' + row.name + ' zero-byte flag disagrees with byte size.');
    }
    if (zero === true) zeroByteFiles++;
    if (row.kernel_sha256 && /^[a-f0-9]{64}$/i.test(row.kernel_sha256)) hashes.add(row.kernel_sha256.toLowerCase());
    else errors.push('File ' + row.name + ' has an invalid SHA-256 hex string.');
    if (hashFlag !== true) errors.push('File ' + row.name + ' does not mark its SHA-256 syntax as valid.');
    if (verified === true) errors.push('File ' + row.name + ' is flagged source-verified despite candidate-only reconciliation.');
    if (evidenceCount !== null) evidenceRowsOnFiles += evidenceCount;
    if (row.match !== 'EXACT') errors.push('File ' + row.name + ' does not have an EXACT filename match.');
    if (row.link_level !== 'REGISTERED_CANDIDATE_ONLY') errors.push('File ' + row.name + ' is not candidate-only.');
    fileCandidateIds.set(ordinal, parseStringArray(row.candidate_theory_ids, 'File ' + row.name + ' candidate_theory_ids', errors));
  }

  if (files.length !== expected.files) errors.push('Expected ' + expected.files + ' file rows; found ' + files.length + '.');
  if (totalBytes !== expected.bytes) errors.push('Expected ' + expected.bytes + ' source bytes; found ' + totalBytes + '.');
  if (zeroByteFiles !== expected.zeroByteFiles) errors.push('Expected ' + expected.zeroByteFiles + ' zero-byte files; found ' + zeroByteFiles + '.');
  if (hashes.size !== expected.uniqueHashes) errors.push('Expected ' + expected.uniqueHashes + ' distinct SHA-256 values; found ' + hashes.size + '.');
  if (evidenceRowsOnFiles !== 0) errors.push('Expected zero evidence rows linked to book files; found ' + evidenceRowsOnFiles + '.');

  const pairKeys = new Set();
  const pairIdsByFile = new Map();
  const pairCountsByTheory = new Map();
  let pairEvidenceRows = 0, passageAnchored = 0, assignedRelationships = 0;
  for (const row of pairs) {
    const ordinal = asInteger(row.file_ordinal, 'Pair file ordinal', errors);
    const file = fileByOrdinal.get(ordinal);
    if (!file) errors.push('Candidate pair references unknown file ordinal ' + ordinal + '.');
    else if (file.name !== row.file_name) errors.push('Candidate pair filename does not match ordinal ' + ordinal + '.');

    if (!theoryIds.has(row.theory_id)) errors.push('Candidate pair references unknown theory id ' + row.theory_id + '.');
    const key = String(ordinal) + '\u0000' + row.theory_id;
    if (pairKeys.has(key)) errors.push('Duplicate candidate pair: file ordinal ' + ordinal + ' / theory ' + row.theory_id + '.');
    pairKeys.add(key);

    if (row.notion_link_status !== 'CANDIDATE_THEMATIC') errors.push('Pair ' + key + ' is not explicitly candidate-thematic.');
    if (row.relationship_class !== 'UNASSIGNED') assignedRelationships++;
    if (row.relationship_class !== 'UNASSIGNED') errors.push('Pair ' + key + ' has an assigned relationship class.');
    if (row.passage_locator !== '') passageAnchored++;
    if (row.passage_locator !== '') errors.push('Pair ' + key + ' unexpectedly has a passage locator.');
    if (row.proposition_examined !== '') errors.push('Pair ' + key + ' unexpectedly has an examined proposition.');
    if (row.evidence_quality !== 'NOT_ASSESSED') errors.push('Pair ' + key + ' has unexpected evidence-quality status.');
    if (row.reviewer_status !== 'UNREVIEWED') errors.push('Pair ' + key + ' is not marked UNREVIEWED.');
    if (row.kernel_file_status !== 'REGISTERED_CANDIDATE_ONLY') errors.push('Pair ' + key + ' file is not candidate-only.');
    if (row.kernel_theory_status !== 'PRESENT') errors.push('Pair ' + key + ' theory is not PRESENT.');
    const evidence = asBoolean(row.kernel_evidence_row_for_this_pair, 'Pair ' + key + ' evidence flag', errors);
    if (evidence === true) pairEvidenceRows++;

    if (ordinal !== null) {
      if (!pairIdsByFile.has(ordinal)) pairIdsByFile.set(ordinal, new Set());
      pairIdsByFile.get(ordinal).add(row.theory_id);
    }
    pairCountsByTheory.set(row.theory_id, (pairCountsByTheory.get(row.theory_id) || 0) + 1);
  }

  if (pairs.length !== expected.pairs) errors.push('Expected ' + expected.pairs + ' candidate pairs; found ' + pairs.length + '.');
  if (pairEvidenceRows !== 0) errors.push('Expected zero kernel evidence rows on candidate pairs; found ' + pairEvidenceRows + '.');
  if (passageAnchored !== 0) errors.push('Expected zero passage-anchored candidate pairs; found ' + passageAnchored + '.');
  if (assignedRelationships !== 0) errors.push('Expected zero assigned relationship classes; found ' + assignedRelationships + '.');

  // The file-side JSON arrays and pair-side crosswalk must describe exactly the same candidate edges.
  for (const [ordinal, declared] of fileCandidateIds) {
    if (declared === null) continue;
    const observed = pairIdsByFile.get(ordinal) || new Set();
    const declaredSet = new Set(declared);
    if (declaredSet.size !== declared.length) errors.push('File ordinal ' + ordinal + ' has duplicate candidate theory IDs.');
    for (const id of declaredSet) if (!observed.has(id)) errors.push('File ordinal ' + ordinal + ' is missing candidate pair for ' + id + '.');
    for (const id of observed) if (!declaredSet.has(id)) errors.push('File ordinal ' + ordinal + ' has undeclared candidate pair for ' + id + '.');
  }

  for (const row of theories) {
    const observed = pairCountsByTheory.get(row.id) || 0;
    const declared = asInteger(row.candidate_file_count, 'Theory ' + row.id + ' candidate_file_count', errors);
    if (declared !== null && declared !== observed) errors.push('Theory ' + row.id + ' declares ' + declared + ' candidates; crosswalk contains ' + observed + '.');
    const expectedCoverage = observed > 0 ? 'HAS_CANDIDATES' : 'NONE_IN_CROSSWALK';
    if (row.candidate_coverage !== expectedCoverage) errors.push('Theory ' + row.id + ' candidate_coverage disagrees with the crosswalk.');
  }

  // Compare the measured CSV totals with the JSON summary; preserve discrepancy states rather than normalising them.
  const theorySummary = result.theory_reconciliation && result.theory_reconciliation.summary;
  const sourceSummary = result.source_reconciliation && result.source_reconciliation.summary;
  const pairSummary = result.pair_crosswalk;
  if (!theorySummary) errors.push('JSON is missing theory_reconciliation.summary.');
  if (!sourceSummary) errors.push('JSON is missing source_reconciliation.summary.');
  if (!pairSummary) errors.push('JSON is missing pair_crosswalk.');

  if (theorySummary) {
    if (theorySummary.notion_records !== theories.length) errors.push('JSON theory count disagrees with theory CSV.');
    if (theorySummary.title_compare_counts?.EXACT !== theories.filter(r => r.title_compare === 'EXACT').length) errors.push('JSON exact-title count disagrees with theory CSV.');
    if (theorySummary.title_compare_counts?.DIFFERS !== theories.filter(r => r.title_compare === 'DIFFERS').length) errors.push('JSON differing-title count disagrees with theory CSV.');
    const evidenceRegistry = theories.reduce((n, r) => n + Number(r.kernel_evidence_rows_to_registry_sources), 0);
    const evidenceBooks = theories.reduce((n, r) => n + Number(r.kernel_evidence_rows_to_book_files), 0);
    if (theorySummary.records_with_kernel_evidence_to_registry_source !== evidenceRegistry) errors.push('JSON registry-evidence count disagrees with theory CSV.');
    if (theorySummary.records_with_kernel_evidence_to_a_book_file !== evidenceBooks) errors.push('JSON book-evidence count disagrees with theory CSV.');
    if (theoryEvidenceTotal !== evidenceRegistry + evidenceBooks) errors.push('Theory evidence-row totals do not reconcile to their registry/book subtotals.');
    const withCandidates = theories.filter(row => Number(row.candidate_file_count) > 0).length;
    if (theorySummary.records_with_candidates_derived_from_notion_table !== withCandidates) errors.push('JSON candidate-associated theory count disagrees with theory CSV.');
    if (theorySummary.records_without_candidates_derived_from_notion_table !== theories.length - withCandidates) errors.push('JSON theory-without-candidates count disagrees with theory CSV.');
    const declaredMissing = Array.isArray(theorySummary.records_with_no_valid_source_hash_in_kernel)
      ? [...theorySummary.records_with_no_valid_source_hash_in_kernel].sort() : [];
    if (JSON.stringify(declaredMissing) !== JSON.stringify([...missingSourceHashIds].sort())) {
      errors.push('JSON missing-source-hash ID list disagrees with theory CSV.');
    }
  }
  if (sourceSummary) {
    if (sourceSummary.notion_files !== files.length || sourceSummary.kernel_book_rows !== files.length) errors.push('JSON source-row counts disagree with file CSV.');
    if (sourceSummary.kernel_book_rows_zero_byte !== zeroByteFiles) errors.push('JSON zero-byte count disagrees with file CSV.');
    if (sourceSummary.kernel_book_bytes_total !== totalBytes) errors.push('JSON byte total disagrees with file CSV.');
    if (sourceSummary.kernel_distinct_sha256 !== hashes.size) errors.push('JSON distinct-hash count disagrees with file CSV.');
    if (sourceSummary.files_with_kernel_evidence_link !== evidenceRowsOnFiles) errors.push('JSON book-evidence count disagrees with file CSV.');
    if (sourceSummary.kernel_hashes_valid_hex64 !== files.filter(row => /^[a-f0-9]{64}$/i.test(row.kernel_sha256 || '')).length) errors.push('JSON valid-hash count disagrees with file CSV.');
    if (sourceSummary.files_registered_without_evidence_link !== files.length - files.filter(row => Number(row.kernel_evidence_rows) > 0).length) errors.push('JSON candidate-only registration count disagrees with file CSV.');
  }
  if (pairSummary) {
    if (pairSummary.candidate_pairs !== pairs.length) errors.push('JSON candidate-pair count disagrees with pair CSV.');
    if (pairSummary.pairs_with_kernel_evidence_row !== pairEvidenceRows) errors.push('JSON pair-evidence count disagrees with pair CSV.');
    if (pairSummary.pairs_candidate_only !== pairs.filter(r => r.kernel_file_status === 'REGISTERED_CANDIDATE_ONLY').length) errors.push('JSON candidate-only count disagrees with pair CSV.');
    if (pairSummary.relationship_class_assigned !== assignedRelationships) errors.push('JSON relationship-assignment count disagrees with pair CSV.');
    if (pairSummary.passage_anchored !== passageAnchored) errors.push('JSON passage-anchored count disagrees with pair CSV.');
  }

  const discrepancies = Array.isArray(result.discrepancies) ? result.discrepancies : [];
  if (!Array.isArray(result.discrepancies)) errors.push('JSON discrepancies must be an array.');
  const discrepancyIds = new Set();
  for (const item of discrepancies) {
    if (!item || typeof item.id !== 'string' || !item.id.trim()) errors.push('Discrepancy has no id.');
    else if (discrepancyIds.has(item.id)) errors.push('Duplicate discrepancy id: ' + item.id + '.');
    else discrepancyIds.add(item.id);
    if (typeof item.status !== 'string' || !item.status.trim()) errors.push('Discrepancy ' + item.id + ' has no status.');
  }

  const notionStates = [
    result.notion_pages?.theory_collection?.notion_verification_state,
    result.notion_pages?.reconciliation?.notion_verification_state
  ].filter(Boolean);
  if (notionStates.some(state => state !== 'verified')) {
    warnings.push('At least one Notion source page is not marked verified; this guard cannot upgrade that state.');
  }
  warnings.push('PASS means cross-artifact structural/accounting consistency only; it does not prove source truth or original book-file byte integrity.');

  const metrics = {
    theories: theories.length,
    theoriesWithUniqueIds: theoryIds.size,
    exactTitles: theories.filter(r => r.title_compare === 'EXACT').length,
    differingTitles: theories.filter(r => r.title_compare === 'DIFFERS').length,
    registryEvidenceRows: theories.reduce((n, r) => n + Number(r.kernel_evidence_rows_to_registry_sources || 0), 0),
    bookEvidenceRows: theories.reduce((n, r) => n + Number(r.kernel_evidence_rows_to_book_files || 0), 0),
    theoriesMissingSourceHash: missingSourceHashIds,
    files: files.length,
    bytes: totalBytes,
    zeroByteFiles,
    distinctHashes: hashes.size,
    candidatePairs: pairs.length,
    candidatePairsWithEvidence: pairEvidenceRows,
    passageAnchoredPairs: passageAnchored,
    assignedRelationshipClasses: assignedRelationships,
    discrepancies: discrepancies.length,
    discrepancyStatuses: countBy(discrepancies, 'status')
  };

  return {
    status: errors.length ? 'CONSISTENCY_FAIL' : 'CONSISTENCY_PASS',
    scope: 'Cross-artifact structural and accounting consistency only.',
    errors,
    warnings,
    metrics
  };
}

function toMarkdown(report) {
  const lines = [
    '# Canon Kernel Reconciliation Guard',
    '',
    '**Status:** ' + report.status,
    '',
    '**Scope:** ' + report.scope,
    '',
    '## Measured metrics',
    '',
    '| Metric | Value |',
    '|---|---:|',
    ...Object.entries(report.metrics).map(([key, value]) => [
      '| ' + key + ' | ' + (value && typeof value === 'object' ? JSON.stringify(value) : String(value)) + ' |'
    ][0]),
    '',
    '## Errors',
    '',
    ...(report.errors.length ? report.errors.map(error => '- ' + error) : ['- None']),
    '',
    '## Warnings and limits',
    '',
    ...report.warnings.map(warning => '- ' + warning),
    ''
  ];
  return lines.join('\n');
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    if (!key.startsWith('--')) throw new Error('Unexpected argument: ' + key);
    const name = key.slice(2);
    const value = argv[++i];
    if (!value || value.startsWith('--')) throw new Error('Missing value for ' + key + '.');
    if (!['json', 'theories', 'files', 'pairs', 'out', 'markdown'].includes(name)) throw new Error('Unknown option: ' + key);
    args[name] = value;
  }
  for (const name of ['json', 'theories', 'files', 'pairs']) {
    if (!args[name]) throw new Error('Required option missing: --' + name);
  }
  return args;
}

function runCli(argv = process.argv.slice(2)) {
  let args;
  try { args = parseArgs(argv); }
  catch (error) { console.error(error.message); return 2; }

  let report;
  try {
    report = validateEvidence({
      resultJson: fs.readFileSync(args.json, 'utf8'),
      theoryCsv: fs.readFileSync(args.theories, 'utf8'),
      fileCsv: fs.readFileSync(args.files, 'utf8'),
      pairCsv: fs.readFileSync(args.pairs, 'utf8')
    });
  } catch (error) {
    console.error('Could not read evidence inputs: ' + error.message);
    return 2;
  }

  const json = JSON.stringify(report, null, 2) + '\n';
  if (args.out) fs.writeFileSync(args.out, json);
  if (args.markdown) fs.writeFileSync(args.markdown, toMarkdown(report));
  if (!args.out && !args.markdown) process.stdout.write(json);
  else process.stdout.write(report.status + ': ' + report.errors.length + ' error(s)\n');
  return report.errors.length ? 1 : 0;
}

module.exports = { DEFAULT_EXPECTED, parseCsv, validateEvidence, toMarkdown, runCli };

if (require.main === module) process.exitCode = runCli();
