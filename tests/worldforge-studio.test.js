import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const root = 'public/worldforge/verified-2026-10-28';
const html = readFileSync(`${root}/studio.html`, 'utf8');
const js = readFileSync(`${root}/assets/studio.js`, 'utf8');
const css = readFileSync(`${root}/assets/studio.css`, 'utf8');

test('World Studio ships its runtime assets and all primary workspace panels', () => {
  assert.ok(existsSync(`${root}/assets/site.css`));
  assert.ok(existsSync(`${root}/assets/site.js`));
  assert.match(html, /assets\/studio\.css/);
  assert.match(html, /assets\/studio\.js/);
  for (const panel of ['overview', 'worlds', 'entities', 'relationships', 'claims', 'integrity']) {
    assert.match(html, new RegExp(`data-panel="${panel}"`));
  }
});

test('World Studio exposes the structured world-model workflow', () => {
  for (const field of ['world-form', 'entity-form', 'relationship-form', 'studio-claim-form']) {
    assert.match(html, new RegExp(`id="${field}"`));
  }
  for (const feature of ['worlds', 'entities', 'relationships', 'claims', 'sources', 'auditLog']) {
    assert.match(js, new RegExp(`\\b${feature}\\b`));
  }
  assert.match(js, /function validate/);
  assert.match(js, /function download/);
  assert.match(js, /function importFile/);
});

test('prototype keeps workflow validation separate from canon approval', () => {
  assert.match(js, /canonStatus:'Not Canon'/);
  assert.match(js, /'Proposed','Investigating','Needs Evidence','Validated'/);
  assert.doesNotMatch(js, /canonStatus\s*=\s*['"]Established Canon['"]/);
  assert.match(html, /A successful integrity check is not a canon decision/);
});

test('World Studio stylesheet includes responsive workspace layouts', () => {
  assert.match(css, /@media\(max-width:720px\)/);
  assert.match(css, /\.studio-shell/);
  assert.match(css, /\.studio-form/);
});
