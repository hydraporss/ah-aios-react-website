# AH-AIOS Learning Studio

A local-first, no-build static site: Learning Studio (24 courses, 96 lessons planned), a theory explorer, instructor/admin workbenches, the AI Harness command builder, a WorldForge app, and landing pages. Progress is stored in the browser (`localStorage`). An optional Flask backend lives in `optional-flask-backend/`.

**Status (0.5.1 candidate):** see `docs/learning-studio/RELEASE_0.5.1_VERIFICATION.md`. Partially implemented, not production-ready. See `docs/learning-studio/IMPLEMENTATION_AUDIT_AND_TEST_REPORT.md` and `LEARNING_STUDIO_KNOWN_LIMITATIONS.md`. In short: the 82-theory registry is empty until real records are imported, most lessons are specified but not written, and the workbenches are single-device with no authentication.

**Reconciliation (r7):** `docs/learning-app/` holds the owner's Learning App specs (AH-LRN-APP-001 v1.0 and v1.1; both Specified, not adopted) and their reconciliation against this release; not published to Pages. See `docs/learning-app/AH-LEARNING-APP-RECONCILIATION.md`.

**Reconciliation (r4):** `docs/AH-AIOS-ARCHIVE-RECONCILIATION.md` compares the full `AH-AIOS.zip` working tree with this release (nothing merged). `docs/reconciliation/` holds an 82-record theory import candidate, not yet approved or loaded. Reference-only material from that tree sits in `optional-flask-backend/reference/` (Core engines, Supabase SQL) and `docs/worldforge-reference/`.

**Reference specs and designs:** `docs/AH-CORE-ARCH-001.md` (AH-AIOS CORE Workbench, Proposed Architecture Specification v1.0-Draft, not implemented) and `docs/core-design/` (landing-page design concept, illustrative only).

## Run locally

Open `index.html` (or `landing/index.html`) in a browser. No install needed. Service worker/PWA features need `http://localhost`, not `file://`:

```bash
python3 -m http.server 8000   # then open http://localhost:8000/
```

## Deploy to GitHub Pages

1. Create a repository and push this folder as the repository root (`index.html` at the top level).
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Push to `main`. The `pages` workflow runs the tests, assembles the static site, checks its links, and deploys.

The site is served at `https://<user>.github.io/<repo>/`. All paths are relative, so it works under that subpath.

Pages publishes only the static site (`scripts/build-site.sh`). The Flask backend, tests, scripts and CI config stay in the repo but are not published, because Pages cannot run Python.

## Install as an app (PWA)

Once the site is served over HTTPS (GitHub Pages) or `localhost`, browsers offer **Install** / **Add to Home Screen**. `manifest.webmanifest`, `sw.js` and `pwa.js` at the site root make every page installable and available offline after a first visit (pages are network-first, so online visitors always get the latest version). The Learning Studio keeps its own `/learning/` manifest and service worker. The single-file `AH-AIOS-Standalone.html` and the desktop app don't use a service worker.

Maintainers: bump `VERSION` in `sw.js` on each release, and run `node scripts/add-pwa.js` after adding new pages (then refresh the embedded pages in the standalone file, `npm run sync` and `npm run update:manifest`). Full procedures, test sheet, rollback and risk register: [`docs/PWA_OPERATIONS_GUIDE.md`](docs/PWA_OPERATIONS_GUIDE.md).

## Windows desktop app

`desktop/` wraps the site as a Windows app (installer + portable `.exe`). Build it from the **desktop-windows** GitHub Actions workflow or with `desktop\build-windows.bat`. See `desktop/README.md`.

## Develop

```bash
npm test               # learning + harness tests (Node 20+, no dependencies)
npm run check:links    # every local link on the main pages resolves
npm run sync           # copy learning/ into the Flask backend's copy
npm run verify         # tests + links + sync check + release integrity
npm run update:manifest  # after any edit: refresh release-manifest.json hashes
```

`learning/` is the source of truth. After editing it, run `npm run sync`; CI fails if the backend copy is stale.

### Importing the 82 theories

The authoritative records are not in this repo and are never generated. Fill `learning/theories-source-template.csv` from your real source, then:

```bash
node scripts/build-theories.js your-source.csv theories-import.json
```

It refuses incomplete data, missing provenance, placeholders and dangling relationships. Import the JSON in Learning Studio.

## Workflows

| Workflow | Runs | Purpose |
|---|---|---|
| `ci` | pull requests, pushes to non-`main` branches | syntax checks, tests, links, sync check |
| `pages` | push to `main` | run `ci`, build `_site`, verify links, deploy |
| `backend` | changes under `optional-flask-backend/` | Flask tests (independent of the deploy) |

## Optional Flask backend

`optional-flask-backend/` needs Python 3 and `pip install -r ah_webapp/requirements.txt`. Launch with `start-flask-backend.command` (Mac/Linux) or `.bat` (Windows), then open `http://127.0.0.1:8080/hub`. The SQLite database is created on first run and is git-ignored.

## License

No license has been chosen yet. Add a `LICENSE` file before making the repository public if you want others to be able to reuse it.

## Changelog

- **AI Harness page** (`learning/domains/harness.html`): capabilities, layers, applications and lifecycle steps are now interactive (detail panel, deep links `#cap-N`, keyboard arrows). Course links accept `learning/index.html?q=AH-HAR#courses`. Command Builder banner is dismissible and no longer covers the nav.
- **Windows desktop app** (`desktop/`): Electron wrapper, GitHub Actions build for the `.exe`.
