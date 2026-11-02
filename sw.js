/* AH-AIOS site service worker. Bump VERSION on every release so old caches are dropped.
   Pages: network first (always fresh when online), cached copy offline, offline.html as last resort.
   Other same-origin GETs: stale-while-revalidate. The 9.6 MB single-file build is never cached. */
const VERSION = '0.5.1-pwa1';
const CACHE = 'ah-aios-site-' + VERSION;
const PRECACHE = ['./', 'index.html', 'hub.html', 'offline.html', 'manifest.webmanifest', 'pwa.js',
  'assets/pwa/icon-192.png', 'assets/pwa/icon-512.png', 'assets/pwa/icon-maskable-512.png', 'assets/pwa/apple-touch-icon.png', 'learning/icon.svg'];
const NO_CACHE = /AH-AIOS-Standalone\.html$/;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE)
    .then((cache) => Promise.allSettled(PRECACHE.map((u) => cache.add(u))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k.startsWith('ah-aios-site-') && k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

const put = (req, res) => { if (res && res.ok && res.type === 'basic') { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); } return res; };

self.addEventListener('fetch', (event) => {
  const req = event.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin || req.headers.has('range') || NO_CACHE.test(url.pathname)) return;
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).then((res) => put(req, res))
      .catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => hit || caches.match('offline.html'))));
    return;
  }
  event.respondWith(caches.match(req).then((hit) => {
    const net = fetch(req).then((res) => put(req, res)).catch(() => hit);
    return hit || net;
  }));
});
