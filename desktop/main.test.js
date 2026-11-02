'use strict';
// Runs main.js against a stubbed `electron` module to check the wiring without needing Electron installed.
const test = require('node:test');
const assert = require('node:assert');
const Module = require('module');
const path = require('path');
const fs = require('fs');
const os = require('os');

function load({ lock = true } = {}) {
  const calls = { quit: 0, windows: [], fetched: [], openExternal: [], menu: null, perm: null, scheme: null, handler: null };
  const win = { once() {}, webContents: { setWindowOpenHandler(f) { win.open = f; }, on(ev, f) { win[ev] = f; }, canGoBack: () => false, loadURL() {} }, loadURL(u) { calls.windows.push(u); }, setTitle() {}, show() {}, isMinimized: () => false, restore() {}, focus() {} };
  const electron = {
    app: { requestSingleInstanceLock: () => lock, quit() { calls.quit++; }, whenReady: () => Promise.resolve(), on() {}, getVersion: () => '0.5.1' },
    BrowserWindow: Object.assign(function () { calls.opts = arguments[0]; return win; }, { getAllWindows: () => [] }),
    Menu: { buildFromTemplate: (t) => { calls.menu = t; return t; }, setApplicationMenu() {} },
    protocol: { registerSchemesAsPrivileged: (a) => { calls.scheme = a; }, handle: (s, f) => { calls.handler = f; } },
    net: { fetch: async (u) => { calls.fetched.push(u); return new Response('ok'); } },
    shell: { openExternal: (u) => calls.openExternal.push(u) },
    dialog: { showMessageBox() {} },
    session: { defaultSession: { setPermissionRequestHandler: (f) => { calls.perm = f; } } }
  };
  const orig = Module._load;
  Module._load = function (req, ...r) { return req === 'electron' ? electron : orig.call(this, req, ...r); };
  const file = require.resolve('./main.js'); delete require.cache[file];
  try { require(file); } finally { Module._load = orig; }
  return { calls, win };
}
const tick = () => new Promise((r) => setImmediate(r));

test('scheme is secure/standard and does NOT enable service workers', () => {
  const { calls } = load();
  const p = calls.scheme[0].privileges;
  assert.strictEqual(calls.scheme[0].scheme, 'ahaios');
  assert.ok(p.standard && p.secure && p.supportFetchAPI);
  assert.ok(!p.allowServiceWorkers);
});
test('window is locked down and opens the home page', async () => {
  const { calls } = load(); await tick(); await tick();
  const wp = calls.opts.webPreferences;
  assert.ok(wp.contextIsolation && wp.sandbox && !wp.nodeIntegration);
  assert.deepStrictEqual(calls.windows, ['ahaios://app/index.html']);
  let granted = null; calls.perm({}, 'media', (v) => { granted = v; }); assert.strictEqual(granted, false);
});
test('second instance quits and creates no window', async () => {
  const { calls } = load({ lock: false }); await tick(); await tick();
  assert.strictEqual(calls.quit, 1); assert.strictEqual(calls.windows.length, 0); assert.strictEqual(calls.handler, null);
});
test('protocol handler: serves files, index for folders, 404 and 403', async () => {
  const { calls } = load(); await tick(); await tick();
  const h = calls.handler, root = path.join(__dirname, 'app');
  fs.mkdirSync(path.join(root, 'zz-test', 'sub'), { recursive: true }); fs.writeFileSync(path.join(root, 'zz-test', 'a.html'), 'x'); fs.writeFileSync(path.join(root, 'zz-test', 'sub', 'index.html'), 'y');
  try {
    assert.strictEqual((await h({ url: 'ahaios://app/zz-test/a.html' })).status, 200);
    await h({ url: 'ahaios://app/zz-test/sub' });
    assert.ok(calls.fetched.pop().endsWith('/zz-test/sub/index.html'), 'folder without slash serves its index.html');
    assert.strictEqual((await h({ url: 'ahaios://app/zz-test/missing.html' })).status, 404);
    const r = await h({ url: 'ahaios://app/..%5c..%5c..%2f..%2fetc/passwd' });
    assert.ok(r.status === 404 || r.status === 403);
    assert.ok(calls.fetched.every((u) => u.includes('/app/')), 'never fetches outside app/');
  } finally { fs.rmSync(path.join(root, 'zz-test'), { recursive: true, force: true }); }
});
test('external links go to the browser, in-app links stay', async () => {
  const { calls, win } = load(); await tick(); await tick();
  assert.deepStrictEqual(win.open({ url: 'https://example.com/x' }), { action: 'deny' });
  assert.deepStrictEqual(calls.openExternal, ['https://example.com/x']);
  assert.deepStrictEqual(win.open({ url: 'ahaios://app/hub.html' }), { action: 'allow' });
  let prevented = false; win['will-navigate']({ preventDefault() { prevented = true; } }, 'https://evil.test/'); assert.ok(prevented);
  assert.strictEqual(calls.openExternal.length, 2);
});
test('menu has the Go destinations and all of them exist in the site', async () => {
  const { calls } = load(); await tick(); await tick();
  const go = calls.menu.find((m) => m.label === 'Go').submenu.filter((m) => m.click);
  assert.ok(go.length >= 7);
  const src = fs.readFileSync(path.join(__dirname, 'main.js'), 'utf8');
  for (const m of src.matchAll(/go\('([^']+)'\)/g)) assert.ok(fs.existsSync(path.join(__dirname, '..', m[1])), 'menu target missing: ' + m[1]);
});
test('electron-builder config points at files that exist', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  assert.strictEqual(pkg.main, 'main.js');
  for (const f of ['main.js', 'paths.js', 'prepare.js', pkg.build.win.icon]) assert.ok(fs.existsSync(path.join(__dirname, f)), f);
  assert.ok(pkg.build.files.includes('app/**/*'));
});
