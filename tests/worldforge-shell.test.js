import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = new URL('../public/worldforge/workspace/', import.meta.url);
const html = readFileSync(new URL('index.html', root), 'utf8');
const css = readFileSync(new URL('workspace.css', root), 'utf8');
const js = readFileSync(new URL('workspace.js', root), 'utf8');

test('WorldForge integrated shell exposes exactly 13 unique module destinations', () => {
  const ids = [...html.matchAll(/class="nav-item[^"]*" data-module="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, 13);
  assert.equal(new Set(ids).size, 13);
  assert.deepEqual(ids, [
    'home','world-atlas','entity-registry','relationship-explorer','event-chronicle',
    'claims-evidence','source-library','governance','constitution','doctrine',
    'prompt-builder','system-architecture','settings'
  ]);
});

test('WorldForge shell loads its local stylesheet and controller', () => {
  assert.match(html, /href="\.\/workspace\.css"/);
  assert.match(html, /src="\.\/workspace\.js"/);
  assert.ok(css.includes('.app-shell'));
  assert.ok(js.includes('function setActive'));
  assert.ok(js.includes('INTEGRATION IN PROGRESS'));
});

test('WorldForge shell clearly distinguishes navigation from implemented modules', () => {
  assert.match(html, /MODULES NOT YET INTEGRATED/);
  assert.match(js, /MODULE IMPLEMENTATION PENDING/);
});

test('WorldForge Home presents honest implementation and data readiness', () => {
  assert.match(html, /class="home-overview"/);
  assert.match(html, /MODULES DEFINED/);
  assert.match(html, /MODULES TO BUILD/);
  assert.match(html, /No records or shared database are being claimed/);
  assert.match(html, /Shared persistence/);
  assert.match(html, /Not implemented/);
});

test('WorldForge Home quick actions navigate to their corresponding modules', () => {
  for (const id of ['entity-registry','source-library','claims-evidence','governance']) {
    assert.match(html, new RegExp('class="quick-action" data-module="' + id + '"'));
  }
  assert.match(js, /homeWorkbench\.querySelector\("\.quick-actions"\)\.addEventListener/);
  assert.match(js, /homeWorkbench\.hidden = false/);
  assert.match(js, /homeWorkbench\.hidden = true/);
});

test('Home dashboard styling includes responsive overview and workbench layouts', () => {
  assert.match(css, /\.home-overview/);
  assert.match(css, /\.home-workbench/);
  assert.match(css, /@media\(max-width:520px\)/);
});
