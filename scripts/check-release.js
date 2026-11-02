#!/usr/bin/env node
// Release integrity check.
//   node scripts/check-release.js          verify (exit 1 on any problem)
//   node scripts/check-release.js --write  refresh release-manifest.json hashes/bytes/fileCount
// Checks: (1) every file listed in release-manifest.json exists and matches its sha256,
// (2) no shipped file is missing from the manifest, (3) AH-AIOS-Standalone.html embeds the
// same content as the files on disk (text compared with CRLF normalised, binary byte-for-byte).
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const MANIFEST = path.join(ROOT, 'release-manifest.json');
const STANDALONE = path.join(ROOT, 'AH-AIOS-Standalone.html');
const SKIP_DIRS = new Set(['_site', 'node_modules', '__pycache__', '.pytest_cache', '.git']);
const write = process.argv.includes('--write');
// The manifest lists the Standalone's hash, so the copy embedded in the Standalone can never be current (circular); not compared.
const STANDALONE_EXEMPT = new Set(['release-manifest.json']);

const sha = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
const problems = [];

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) { if (!SKIP_DIRS.has(e.name)) walk(path.join(dir, e.name), out); }
    else out.push(path.relative(ROOT, path.join(dir, e.name)).split(path.sep).join('/'));
  }
  return out;
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
const listed = new Map(manifest.files.map((f) => [f.path, f]));
const onDisk = walk(ROOT).filter((p) => p !== 'release-manifest.json');

if (write) {
  for (const p of onDisk) {
    const buf = fs.readFileSync(path.join(ROOT, p));
    const entry = listed.get(p);
    if (entry) { entry.bytes = buf.length; entry.sha256 = sha(buf); }
    else manifest.files.push({ path: p, bytes: buf.length, sha256: sha(buf) });
  }
  manifest.files = manifest.files.filter((f) => onDisk.includes(f.path));
  manifest.fileCount = manifest.files.length;
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`manifest refreshed: ${manifest.fileCount} files`);
  process.exit(0);
}

// (1) manifest vs disk
for (const f of manifest.files) {
  const full = path.join(ROOT, f.path);
  if (!fs.existsSync(full)) { problems.push(`listed but missing: ${f.path}`); continue; }
  if (sha(fs.readFileSync(full)) !== f.sha256) problems.push(`hash mismatch: ${f.path}`);
}
// (2) disk vs manifest
for (const p of onDisk) if (!listed.has(p)) problems.push(`shipped but not in manifest: ${p}`);
if (manifest.fileCount !== manifest.files.length) problems.push(`fileCount ${manifest.fileCount} != ${manifest.files.length} entries`);

// (3) standalone vs disk
if (fs.existsSync(STANDALONE)) {
  const html = fs.readFileSync(STANDALONE, 'utf8');
  const start = html.indexOf('var FILES=') + 'var FILES='.length;
  const end = html.indexOf(';</script>', start);
  const files = JSON.parse(html.slice(start, end));
  let embedded = 0;
  for (const [p, [, enc, content]] of Object.entries(files)) {
    if (STANDALONE_EXEMPT.has(p)) continue;
    embedded++;
    const full = path.join(ROOT, p);
    if (!fs.existsSync(full)) { problems.push(`standalone embeds a file not on disk: ${p}`); continue; }
    const disk = fs.readFileSync(full);
    const same = enc === 't'
      ? disk.toString('utf8').replace(/\r\n/g, '\n') === content.replace(/\r\n/g, '\n')
      : Buffer.compare(disk, Buffer.from(content, 'base64')) === 0;
    if (!same) problems.push(`standalone is stale for: ${p}`);
  }
  console.log(`standalone: ${embedded} embedded files compared`);
}

if (problems.length) { console.error(problems.map((p) => 'PROBLEM ' + p).join('\n')); process.exit(1); }
console.log(`release check OK (${manifest.files.length} manifest entries)`);
