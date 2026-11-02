/* Registers the site-wide service worker (sw.js, same folder as this file).
   No-ops on file://, inside frames, in the single-file build, and where service workers don't exist. */
(function () {
  try {
    if (self !== top || !('serviceWorker' in navigator) || !/^https?:$/.test(location.protocol)) return;
    var cs = document.currentScript;
    if (!cs || !cs.src || cs.src.indexOf('http') !== 0) return;
    var sw = new URL('sw.js', cs.src).href, scope = new URL('./', cs.src).href;
    window.addEventListener('load', function () {
      navigator.serviceWorker.register(sw, { scope: scope }).catch(function () {});
    });
  } catch (e) {}
})();
