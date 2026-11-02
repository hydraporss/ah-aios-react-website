'use strict';
const test = require('node:test');
const assert = require('node:assert');
const path = require('path');
const { resolveAppPath } = require('./paths');
const root = path.resolve('/tmp/approot');
const inside = (p) => p && (p === root || p.startsWith(root + path.sep));

test('root and trailing slash map to index.html', () => {
  assert.strictEqual(resolveAppPath('ahaios://app/', root), path.join(root, 'index.html'));
  assert.strictEqual(resolveAppPath('ahaios://app/learning/', root), path.join(root, 'learning', 'index.html'));
});
test('normal files resolve, query and hash ignored', () => {
  assert.strictEqual(resolveAppPath('ahaios://app/learning/domains/harness.html?q=AH-HAR#cap-1', root), path.join(root, 'learning', 'domains', 'harness.html'));
});
test('traversal can never leave the root', () => {
  for (const u of ['ahaios://app/../../etc/passwd', 'ahaios://app/%2e%2e/%2e%2e/etc/passwd', 'ahaios://app/a/..%2f..%2f..%2fsecret', 'ahaios://app/..%5c..%5cwindows%5cwin.ini']) {
    const r = resolveAppPath(u, root);
    assert.ok(r === null || inside(r), u + ' -> ' + r);
  }
});
test('malformed input is rejected', () => {
  assert.strictEqual(resolveAppPath('not a url', root), null);
  assert.strictEqual(resolveAppPath('ahaios://app/%E0%A4%A', root), null);
  assert.strictEqual(resolveAppPath('ahaios://app/x%00.html', root), null);
});
