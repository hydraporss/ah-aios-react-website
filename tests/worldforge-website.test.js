import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../public/worldforge-studio/index.html', import.meta.url), 'utf8');

test('WorldForge standalone website has accessible document structure', () => {
  assert.match(html, /<!doctype html>/i);
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<meta name="viewport"/);
  assert.match(html, /<title>WorldForge — Build Worlds That Last<\/title>/);
  assert.match(html, /aria-label="Workspace"/);
});

test('WorldForge exposes all six product capability areas', () => {
  for (const label of ['Worldbuilding Studio', 'Knowledge Graph', 'Canon Governance', 'Provenance & Verification', 'AI-Assisted Intelligence', 'WorldForge Workspace']) {
    assert.ok(html.includes(label), `Missing capability: ${label}`);
  }
});

test('WorldForge preview workflows and data portability are present', () => {
  for (const token of ['Create a world', 'Create knowledge record', 'Register a source', 'Submit change proposal', 'Export workspace JSON', 'Import JSON', 'localStorage']) {
    assert.ok(html.includes(token), `Missing workflow: ${token}`);
  }
});

test('WorldForge inline JavaScript parses', () => {
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/gi)];
  assert.ok(scripts.length > 0, 'Expected an inline application script');
  for (const script of scripts) assert.doesNotThrow(() => new Function(script[1]));
});

test('WorldForge labels prototype limitations and does not simulate canon approval', () => {
  assert.match(html, /LOCAL PREVIEW/);
  assert.match(html, /AI CORE authorization/);
  assert.match(html, /not connected/);
  assert.match(html, /illustrative, not imported canon/);
});
