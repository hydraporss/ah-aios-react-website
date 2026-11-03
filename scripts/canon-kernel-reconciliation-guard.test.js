'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { parseCsv, validateEvidence, toMarkdown } = require('./canon-kernel-reconciliation-guard.js');

const headers = {
  theories: ['id','notion_title','candidate_file_count','candidate_coverage','kernel_status','title_compare','kernel_has_valid_source_hash','kernel_evidence_rows_total','kernel_evidence_rows_to_registry_sources','kernel_evidence_rows_to_book_files'],
  files: ['ordinal','name','candidate_theory_ids','match','kernel_size_bytes','kernel_zero_byte','kernel_sha256','kernel_hash_is_valid_hex64','kernel_source_verified_flag','kernel_evidence_rows','kernel_evidence_passage_anchored_rows','link_level'],
  pairs: ['file_ordinal','file_name','theory_id','notion_link_status','relationship_class','passage_locator','proposition_examined','evidence_quality','reviewer_status','kernel_file_status','kernel_theory_status','kernel_evidence_row_for_this_pair']
};
const csv = (head, rows) => [head, ...rows].map(row => row.map(value => {
  const s = String(value);
  return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}).join(',')).join('\r\n') + '\r\n';

function fixture() {
  const theoryRows = [
    ['T1','Theory One','1','HAS_CANDIDATES','PRESENT','EXACT','True','1','1','0'],
    ['T2','Theory Two','1','HAS_CANDIDATES','PRESENT','EXACT','True','1','1','0'],
    ['T3','Theory Three','1','HAS_CANDIDATES','PRESENT','DIFFERS','False','0','0','0']
  ];
  const fileRows = [
    ['1','A, source.txt',JSON.stringify(['T1','T2']),'EXACT','5','False','a'.repeat(64),'True','False','0','0','REGISTERED_CANDIDATE_ONLY'],
    ['2','Empty source.txt',JSON.stringify(['T3']),'EXACT','0','True','b'.repeat(64),'True','False','0','0','REGISTERED_CANDIDATE_ONLY']
  ];
  const pairRows = [
    ['1','A, source.txt','T1','CANDIDATE_THEMATIC','UNASSIGNED','','','NOT_ASSESSED','UNREVIEWED','REGISTERED_CANDIDATE_ONLY','PRESENT','False'],
    ['1','A, source.txt','T2','CANDIDATE_THEMATIC','UNASSIGNED','','','NOT_ASSESSED','UNREVIEWED','REGISTERED_CANDIDATE_ONLY','PRESENT','False'],
    ['2','Empty source.txt','T3','CANDIDATE_THEMATIC','UNASSIGNED','','','NOT_ASSESSED','UNREVIEWED','REGISTERED_CANDIDATE_ONLY','PRESENT','False']
  ];
  const resultJson = {
    theory_reconciliation: { summary: {
      notion_records: 3,
      title_compare_counts: { EXACT: 2, DIFFERS: 1 },
      records_with_kernel_evidence_to_registry_source: 2,
      records_with_kernel_evidence_to_a_book_file: 0,
      records_with_candidates_derived_from_notion_table: 3,
      records_without_candidates_derived_from_notion_table: 0,
      records_with_no_valid_source_hash_in_kernel: ['T3']
    }},
    source_reconciliation: { summary: {
      notion_files: 2, kernel_book_rows: 2, kernel_book_rows_zero_byte: 1,
      kernel_book_bytes_total: 5, kernel_distinct_sha256: 2,
      files_with_kernel_evidence_link: 0, kernel_hashes_valid_hex64: 2,
      files_registered_without_evidence_link: 2
    }},
    pair_crosswalk: {
      candidate_pairs: 3, pairs_with_kernel_evidence_row: 0,
      pairs_candidate_only: 3, relationship_class_assigned: 0, passage_anchored: 0
    },
    notion_pages: {
      theory_collection: { notion_verification_state: 'unverified' },
      reconciliation: { notion_verification_state: 'unverified' }
    },
    discrepancies: [
      { id: 'D-1', status: 'OPEN' },
      { id: 'D-2', status: 'RESOLVED' }
    ]
  };
  return {
    resultJson,
    theoryCsv: csv(headers.theories, theoryRows),
    fileCsv: csv(headers.files, fileRows),
    pairCsv: csv(headers.pairs, pairRows),
    expected: { theories: 3, files: 2, pairs: 3, bytes: 5, zeroByteFiles: 1, uniqueHashes: 2 }
  };
}

test('CSV parser handles quoted commas, escaped quotes, CRLF and trailing blank lines', () => {
  const rows = parseCsv('id,title\r\n1,"A, ""quoted"" title"\r\n\r\n');
  assert.deepEqual(rows, [{ id: '1', title: 'A, "quoted" title' }]);
});

test('CSV parser rejects malformed row widths and unterminated quoted fields', () => {
  assert.throws(() => parseCsv('a,b\n1\n'), /expected 2/);
  assert.throws(() => parseCsv('a,b\n1,"unfinished'), /inside a quoted field/);
});

test('real evidence schema (snake_case) passes cross-artifact consistency checks', () => {
  const data = fixture();
  const report = validateEvidence(data, { expected: data.expected });
  assert.equal(report.status, 'CONSISTENCY_PASS', report.errors.join('\n'));
  assert.equal(report.metrics.candidatePairs, 3);
  assert.equal(report.metrics.bookEvidenceRows, 0);
  assert.deepEqual(report.metrics.discrepancyStatuses, { OPEN: 1, RESOLVED: 1 });
  assert.match(report.warnings.join(' '), /cannot upgrade that state/);
  assert.match(toMarkdown(report), /CONSISTENCY_PASS/);
});

test('rejects a candidate list that does not agree with the pair crosswalk', () => {
  const data = fixture();
  data.fileCsv = data.fileCsv.replace('[""T1"",""T2""]', '[""T1""]');
  const report = validateEvidence(data, { expected: data.expected });
  assert.equal(report.status, 'CONSISTENCY_FAIL');
  assert.ok(report.errors.some(error => /undeclared candidate pair for T2/.test(error)));
});

test('rejects candidate pairs promoted to evidence or reviewed relationships', () => {
  const data = fixture();
  data.pairCsv = data.pairCsv.replace('UNASSIGNED,,,NOT_ASSESSED,UNREVIEWED', 'SUPPORTS,chapter-2,claim-1,ASSESSED,APPROVED');
  const report = validateEvidence(data, { expected: data.expected });
  assert.equal(report.status, 'CONSISTENCY_FAIL');
  assert.ok(report.errors.some(error => /assigned relationship class/.test(error)));
  assert.ok(report.errors.some(error => /passage locator/.test(error)));
});

test('rejects a missing-source-hash list that disagrees with the theory CSV', () => {
  const data = fixture();
  data.resultJson.theory_reconciliation.summary.records_with_no_valid_source_hash_in_kernel = [];
  const report = validateEvidence(data, { expected: data.expected });
  assert.ok(report.errors.some(error => /missing-source-hash ID list disagrees/.test(error)));
});

test('rejects false summary totals and duplicate pair identifiers', () => {
  const data = fixture();
  data.resultJson.pair_crosswalk.candidate_pairs = 4;
  const report = validateEvidence(data, { expected: data.expected });
  assert.ok(report.errors.some(error => /JSON candidate-pair count disagrees/.test(error)));

  const duplicate = fixture();
  duplicate.pairCsv += duplicate.pairCsv.split(/\r?\n/)[1] + '\r\n';
  const duplicateReport = validateEvidence(duplicate, { expected: duplicate.expected });
  assert.ok(duplicateReport.errors.some(error => /Duplicate candidate pair/.test(error)));
});

test('does not normalize discrepancy states or claim source verification', () => {
  const data = fixture();
  data.resultJson.discrepancies[1].status = 'SUPERSEDED';
  const report = validateEvidence(data, { expected: data.expected });
  assert.equal(report.status, 'CONSISTENCY_PASS', report.errors.join('\n'));
  assert.deepEqual(report.metrics.discrepancyStatuses, { OPEN: 1, SUPERSEDED: 1 });
  assert.match(report.warnings.join(' '), /does not prove source truth/);
});
