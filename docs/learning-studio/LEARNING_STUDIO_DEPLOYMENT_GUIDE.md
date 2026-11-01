# Learning Studio — Deployment Guide
Status: local use verified (file://). `/learning-studio/` hosting is UNVERIFIED; no deployment config exists in the bundle.

## Local
Extract the zip fully; open index.html (hub.html lists all parts). Learning Studio: learning/index.html. For service worker/PWA, serve over http://localhost (`python3 -m http.server` from the folder).

## Static hosting at /learning-studio/ (PROPOSED, untested)
Publish the `learning/` directory contents at that path. Asset URLs are relative, so a sub-path should work; verify: base path, nested refresh, service-worker scope, `manifest` path, cache bump (`sw.js` CACHE) on each release. Do not replace the root site.

## Flask backend (optional, separate)
See optional-flask-backend/README.md. Set SECRET_KEY and, if needed, AH_AIOS_ADMIN_EMAIL/PASSWORD. Local binding only by default.

## Release checklist
Run tests; bump SW cache; smoke-test in browser; confirm 24/96 counts; keep previous zip for rollback.
