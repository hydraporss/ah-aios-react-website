'use strict';
const { app, BrowserWindow, Menu, protocol, net, shell, dialog, session } = require('electron');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');
const { resolveAppPath } = require('./paths');

const ROOT = path.join(__dirname, 'app');
const SCHEME = 'ahaios';
const HOME = SCHEME + '://app/index.html';

// A custom "secure, standard" scheme gives the site a real origin, so localStorage (your progress) persists
// and fetch() works, which file:// does not allow. Service workers are intentionally NOT enabled: every file is
// already local, and a cache-first worker could serve stale files after the app is updated.
protocol.registerSchemesAsPrivileged([{ scheme: SCHEME, privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true } }]);

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) app.quit();

let win;
function go(p) { if (win) win.loadURL(SCHEME + '://app/' + p); }

function createWindow() {
  win = new BrowserWindow({
    width: 1360, height: 880, minWidth: 900, minHeight: 600, backgroundColor: '#050d19', show: false, title: 'AH-AIOS',
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true, spellcheck: false }
  });
  win.once('ready-to-show', () => win.show());
  // http(s) links open in the user's browser; everything inside the app stays in the app.
  const external = (url) => { if (/^https?:/i.test(url) || /^mailto:/i.test(url)) shell.openExternal(url); };
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith(SCHEME + '://')) return { action: 'allow' };
    external(url); return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (e, url) => { if (!url.startsWith(SCHEME + '://')) { e.preventDefault(); external(url); } });
  win.webContents.on('page-title-updated', (e, t) => { e.preventDefault(); win.setTitle(t ? t + ' - AH-AIOS' : 'AH-AIOS'); });
  win.loadURL(HOME);
}

function buildMenu() {
  const t = [
    { label: 'File', submenu: [{ label: 'Home', accelerator: 'CmdOrCtrl+Shift+H', click: () => go('index.html') }, { type: 'separator' }, { role: 'quit' }] },
    { label: 'Go', submenu: [
      { label: 'Back', accelerator: 'Alt+Left', click: () => win && win.webContents.canGoBack() && win.webContents.goBack() },
      { label: 'Forward', accelerator: 'Alt+Right', click: () => win && win.webContents.canGoForward() && win.webContents.goForward() },
      { type: 'separator' },
      { label: 'Hub (all parts)', click: () => go('hub.html') },
      { label: 'Learning Studio', click: () => go('learning/index.html') },
      { label: 'AI Harness', click: () => go('learning/domains/harness.html') },
      { label: 'AH-AIOS Core', click: () => go('learning/domains/core.html') },
      { label: 'WorldForge', click: () => go('learning/domains/worldforge.html') },
      { label: 'Harness Command Builder', click: () => go('harness/index.html') },
      { label: 'Harness Workbench', click: () => go('harness/workbench.html') }] },
    { label: 'View', submenu: [{ role: 'reload' }, { role: 'forceReload' }, { type: 'separator' }, { role: 'resetZoom' }, { role: 'zoomIn' }, { role: 'zoomOut' }, { type: 'separator' }, { role: 'togglefullscreen' }, { role: 'toggleDevTools' }] },
    { label: 'Help', submenu: [{ label: 'About AH-AIOS', click: () => dialog.showMessageBox(win, { type: 'info', title: 'About AH-AIOS', message: 'AH-AIOS ' + app.getVersion(), detail: 'Local-first desktop edition. Progress is stored on this computer only. Capabilities shown are planned scope unless the site states otherwise.' }) }] }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(t));
}

if (gotLock) app.whenReady().then(() => {
  // The site needs no camera, microphone, location or notification access.
  session.defaultSession.setPermissionRequestHandler((wc, permission, cb) => cb(false));
  protocol.handle(SCHEME, (request) => {
    let file = resolveAppPath(request.url, ROOT);
    if (!file) return new Response('Forbidden', { status: 403 });
    try { if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html'); } catch (e) { /* 404 below */ }
    if (!fs.existsSync(file)) return new Response('Not found: ' + new URL(request.url).pathname, { status: 404 });
    return net.fetch(pathToFileURL(file).toString());
  });
  buildMenu(); createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
