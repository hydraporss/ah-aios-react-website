AH-AIOS LOCAL SITE
==================
0. EASIEST: open  AH-AIOS-Standalone.html  (one self-contained file: whole site, works even from inside the zip / any folder).
1. Or extract the whole ZIP (do not run from inside the zip).
2. For the full online-like experience (service worker/PWA, same behaviour as the hosted site):
   double-click  start-local-site.bat  (Windows) or start-local-site.command (Mac/Linux). Needs Python or Node.
   It opens http://localhost:8000/. Otherwise:
   Double-click  index.html  (homepage) -> opens in your browser. Nothing to install.
   hub.html lists every part, doc and the optional backend.

Folders
  learning/                 Learning Studio + WorldForge archive + verified 2026-10-28 site
  worldforge-app/           WorldForge React build (works from file://)
  harness/                  AI Harness Command Builder
  docs/                     Specs as HTML (+ raw .md)
  optional-flask-backend/   Full Flask app (worlds, governance, admin) - needs Python
  start-flask-backend.*     Launchers for the optional backend (http://127.0.0.1:8080/hub)

Notes
  - Progress/records are saved in your browser's localStorage (per browser, not synced).
  - Fonts load from Google Fonts when online; the site works without them.
  - Service worker/PWA install only works over http://localhost, not file://.

Added: workbench.html (module map for LS-WB-ARCH-001) and docs/workbench-architecture.html (full spec).

Update 2026-11-01: Theory Explorer now has search/filter/detail (learning/explorer.js); tests in learning/tests (run: node --test learning/tests/*.test.js).
See docs/learning-studio/IMPLEMENTATION_AUDIT_AND_TEST_REPORT.md for verified status and limitations.
0.5.0: Instructor and Administration panels (local, browser-only), cross-domain search (header search + Enter), top-bar overflow fix. Tests: node --test learning/tests/*.test.js

Theory import (82 = 68 registry + 14 synthesized):
  The authoritative records are NOT in this bundle and are never generated.
  1. Fill learning/theories-source-template.csv from your real source (id,title,classification,summary,source,relationships).
  2. node scripts/build-theories.js your-source.csv theories-import.json
     (refuses incomplete data, missing provenance, placeholders, dangling relationships)
  3. In Learning Studio, import theories-import.json via the Theory import control.
  Tests: node --test learning/tests/*.test.js

Keeping the Flask copy in sync:
  learning/ is the source of truth. The backend serves optional-flask-backend/ah_webapp/connected/learning/.
  After editing anything in learning/, run:   node scripts/sync-flask-learning.js
  (--dry-run to preview, --check for CI, --prune to delete files only present in the backend copy.)
  The only intended differences are link rewrites to server routes (/hub, /harness/, /worldforge-app/),
  defined in scripts/sync-flask-learning.js. If a rewrite stops matching, the script fails instead of guessing.

Landing pages (landing/): index.html (platform), learning-studio.html (portal hero), learning-studio-alt.html (workstation hero).
  Shared styles in landing/styles.css. Stats show real status (e.g. 20 of 96 lessons drafted, theory registry import pending).
