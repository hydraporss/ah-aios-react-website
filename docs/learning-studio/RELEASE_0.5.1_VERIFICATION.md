# Release 0.5.1 — Repair & Verification Report

Source package: `AH-AIOS-github-ready.zip` (0.5.0). Status: **candidate; not deployed; awaiting owner approval.**

## Repairs
1. Workbench: error messages were wiped by the re-render → now persist (`learning/workbench.js`).
2. Workbench: added strict, admin-only, non-destructive JSON import; stored state is validated on load.
3. Theory import: shared `validateIntegrity()` (provenance, placeholders, relationship resolution) now enforced in-app and by `scripts/build-theories.js`.
4. Mobile overflow: `workbench.html` summary pill; WorldForge claims grid (`minmax(min(400px,100%),1fr)`).
5. `404.html`: links resolve from the site root on GitHub Pages project sites.
6. Service worker cache `ah-aios-learning-studio-0.5.1-v1`.
7. Pages build excludes `*.zip` (unreferenced 2.6 MB archive).
8. `scripts/check-links.js` crawls every HTML page (9 → 39).
9. WorldForge built bundle: export now includes `claims` and `changeProposals`; import validates (list types, ids, unique ids, relationship endpoints, status/canon enums, claim versions), asks for confirmation, and never replaces data on failure. Bundle file renamed `index-CVQvs4I9-r051.js` to defeat caches. Applied to both bundle copies.

## Verification (executed)
| Check | Result |
|---|---|
| `npm test` | PASS 59/59 |
| `npm run check:links` (source and built `_site`) | PASS 39 pages |
| `npm run check:sync` | PASS |
| `node --check` on all JS | PASS |
| Workflow YAML parse | PASS (parse only) |
| Learning Studio browser E2E (`scripts/e2e/learning-studio.e2e.py`) | PASS 46/46 |
| WorldForge browser E2E (`scripts/e2e/worldforge.e2e.py`) | PASS 20/20 (one check, self-relationship alert, is asserted manually, verified earlier by probe) |
| Mobile 390px overflow, 6 pages | PASS (0px) |
| 404 base path (simulated on a github.io project URL) | PASS |
| Flask `py_compile` | PASS |

## NOT VERIFIED
- Flask pytest suite (pytest / Flask-SQLAlchemy / Flask-Login unavailable offline).
- Real GitHub Actions run and live GitHub Pages deployment.
- Firefox / Safari; real devices; screen-reader testing (only structural a11y checks run in Chromium).
- AI Harness functional behaviour beyond page load and its existing unit tests.
- Static AH-AIOS landing pages beyond load / link / overflow checks.

## Not defects (intentionally incomplete)
82-theory registry empty; 76/96 lessons Specified, 20 Authored draft, 0 Published; no authentication, no multi-user storage, no deployed backend.
