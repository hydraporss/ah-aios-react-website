# AH-AIOS reconciliation of the four uploads

Date: 2026-11-01. Nothing was modified, merged or repackaged. This is a comparison report only.

## Verdict

Use `AH-AIOS-Master-Release-with-Harness.zip` (A) as the single canonical package. It is a strict superset of the other three. The other three can be retired.

## Lineage

| Order | Upload | Inner build | Files | SHA-256 (verified) | Role |
|---|---|---|---|---|---|
| 1 | `AH-AIOS-Local-Site-landing.zip` (L) | 0.5.0-era working tree | 261 | n/a (no checksum shipped) | Predecessor, superseded |
| 2 | `Master_Release1.zip` (C) | 0.5.1 baseline, 08:32 | 276 | 7aa75141...3ad | Base of the chain |
| 3 | `AH-AIOS-Master-Release-with-Harness_1.zip` (B) | C + Harness site, 12:40 | 282 | dcac4523...8b740 | Intermediate |
| 4 | `AH-AIOS-Master-Release-with-Harness.zip` (A) | B + fixes, archive, CORE spec, 13:31 | 303 | cf8e0040...99 | Latest, canonical |

Outer-zip checksums match the inner `.sha256` files for A, B and C.

## C -> B -> A (clean, additive chain)

- C -> B: adds `harness/overview.html`, `harness/workbench.html`, `harness/css/site.css`, `harness/js/site.js`, `site-data.js`, `site-data.test.js`; edits `hub.html`, `package.json`, `release-manifest.json`. Nothing else changes.
- B -> A: no file exists only in B except the superseded `index-CVQvs4I9-r051.js` WorldForge bundles, which A replaces with `-r052.js`. All of B's harness additions are present in A. A adds: 58 `utcnow()` fixes (models, governance, phase1), `pytest.ini`, WorldForge empty-title fix (`-r052` bundle + both `index.html`), E2E script fixes, `archive/` (two unpublished site archives), `docs/AH-CORE-ARCH-001.md`, `docs/core-design/`, README link updates, refreshed `release-manifest.json`.
- A's own manifest: 302 entries, 0 missing, 0 hash mismatches; 303 files on disk (the manifest does not list itself).
- Re-run on A here: `npm test` 64/64, `check:sync` 68 files identical, `check:links` 41 pages.

## L (Local-Site landing) vs the chain

L is older, not parallel. Of 258 paths shared with A, 231 are byte-identical. The 27 that differ are all older versions in L:

- `learning/sw.js`: cache name `0.5.0-v1` (C/A: `0.5.1-v1`).
- `learning/app.js`, `theory-validation.js`, `workbench.js`: L lacks the provenance/reference-integrity validation (`validateIntegrity`) and the stricter workbench-overlay validation that C/A have.
- `scripts/build-theories.js`: L carries its own copy of the integrity checks; C/A refactored them into the shared `validateIntegrity` so the app and the script cannot drift. L has no logic that C/A lack.
- `scripts/check-links.js`: L checks a hand-kept list of 9 pages; C/A discover every `.html` page and honour `SITE_ROOT`.
- `.github/workflows/ci.yml`: L runs on every push; C/A avoid duplicate runs on `main`.
- WorldForge: L's bundle (836,067 bytes) is an older build. It lacks `changeProposals` and `claims` in the export and the import validation that C/A have. Its CSS is 10 bytes smaller. The Flask `connected/` copy is a separate 485,889-byte build (A: 487,868).
- `hub.html`, `workbench.html`, three `docs/learning-studio/*.md`, `learning/VERIFICATION.md`: older text (e.g. no superseded-status notice).
- Missing from L entirely: `package.json`, `release-manifest.json`, `404.html`, `README.md`, `.gitignore`, `.nojekyll`, `backend.yml`, `pages.yml`, `build-site.sh`, the three E2E scripts, `release-0.5.1.test.js`, `RELEASE_0.5.1_VERIFICATION.md`.

Unique to L (nothing worth keeping):

- `optional-flask-backend/ah_webapp/ah_webapp.db` (249,856 bytes). A SQLite runtime file with 29 tables and 0 rows in every one. It is a leftover from running the backend, contains no data, and should not ship. A correctly excludes it.
- The three old WorldForge bundles above (superseded).

## Open items that reconciliation does not change

These are carried unchanged in A and were not touched:

1. 82 theory records, LICENSE choice, deployment approval (owner decisions).
2. WorldForge React source is missing. The `-r052` empty-title fix lives only in the built bundle and is lost on any rebuild.
3. ~~Reference copy `commands.py` IndentationError (line 671)~~ FIXED in r2 (see Fixes applied).
4. ~~`optional-flask-backend/VERSION` 0.1.0~~ FIXED in r2: now 0.5.1.
5. ~~Hero image URL in `after-humanity-source.html`~~ FIXED in r2 for both copies (the Flask-connected WorldForge bundle still carries the same remote URL; see Fixes applied).
6. ~~Layout overflows~~ FIXED in r2 (see Fixes applied).
7. A's change log lists the Harness page's state-transition table as the author's interpretation, since the spec lists states but not transitions.
8. Not verified anywhere: Firefox/Safari, real devices, a real GitHub Actions run, deployment.

## Suggested housekeeping

- Keep A (zip + `.sha256` + `CHANGES.md`). Archive B and C only if you want an audit trail; A reproduces both.
- Discard L, or keep it only as a historical 0.5.0 snapshot. Do not merge anything from it.
- A's change log says the standalone `ah-aios-harness.zip` was not changed; that file was not among these uploads, so it was not compared.

## Fixes applied (r2, after the reconciliation)

Each was reproduced in Chromium before the change and re-measured after it.

| Item | Change | Evidence |
|---|---|---|
| Reference `commands.py` syntax error | Removed the 5-line stray dict fragment (old lines 671-675) after the closing brace of `handle_trace_decision`. Nothing else touched. | File now parses (`ast.parse`). The active app's `commands.py` was already valid and is unchanged. |
| `optional-flask-backend/VERSION` | 0.1.0 -> 0.5.1 (matches the release). | n/a |
| Hero image | In `learning/worldforge/after-humanity-source.html` and its Flask mirror: removed the remote `<base href=...github.io...>` and made the cover URL relative (`after-humanity-cover.jpg`, present and byte-identical in both trees). The page has no other relative links. | Built site: 0 failed or 4xx requests when the page loads. |
| `docs/notion-product-summary.html` (12px at 390) and `docs/architecture-spec.html` (1px at 390) | `main{overflow-wrap:anywhere}`: long unbreakable text (a repository path in a `<code>` element, long words) no longer widens the page. | 0px at 390 and 1280. |
| `index.html` overflow (38px at 1280) | Header tightened between 1181-1360px (gap, nav padding, search width) so the avatar no longer sits past the right edge. | 0px at 1181, 1240, 1280, 1360, 1440, 1920. |
| `index.html` flow panel at 1181-1240px | Single-column layout one step earlier (the 3-column grid overflowed by up to 37px just above the existing 1180px breakpoint). Found while testing, not in the earlier report. | 0px across the sweep. |
| `index.html` at 320px (found during testing, pre-existing) | Feature grid goes to one column at <=400px. | 0px at 320. |
| E2E | `scripts/e2e/mobile-and-404.e2e.py` now also checks the two docs pages at 390, `index.html` at 1181/1240/1280/1440 and at 320. | All 0px. |

Not fixed, and why:

- The Flask-connected WorldForge bundle (`optional-flask-backend/ah_webapp/connected/worldforge-app/assets/index-CVQvs4I9-r052.js`) still embeds the remote `<base href>` and cover URL. It is a built artifact whose source is missing, and patching it needs a cache-busting rename. The static `worldforge-app` bundle is unaffected.
- Owner decisions (82 theory records, LICENSE, deployment approval), the README "68 registry + 14 synthesized" wording, and rotating the credential found in `AH-AIOS.zip`'s `.env.supabase`.

## r8 integrity pass (after the AH-AIOS.zip comparison)

| Finding | Action |
|---|---|
| `release-manifest.json` was stale for `README.txt` (3,223 vs 2,838 bytes) and the static WorldForge bundle (838,064 vs 838,046 bytes). | Hashes refreshed. The bundle was loaded in Chromium first: Learning Studio E2E 46/46, WorldForge E2E 22/22 (the report above says 20), mobile/404 overflow 0. |
| `AH-AIOS-Standalone.html` embedded an older `README.txt` (no "0. EASIEST" step). The other six differing entries differed only by CRLF vs LF. | Only the README entry was refreshed; the rest of the file is untouched. |
| `AH-AIOS-Standalone.html`, `start-local-site.bat` and `.command` shipped but were not in the manifest. | Added. |
| Nothing detected this drift. | New `scripts/check-release.js` (`npm run check:release`, part of `npm run verify`) checks manifest hashes, unlisted files and Standalone-vs-disk content. `npm run update:manifest` rewrites the hashes after an intended change. |
| The "Not fixed" note above says the Flask-connected WorldForge bundle still embeds a remote `<base href>` and cover URL. | Out of date: it now uses `../learning/worldforge/` and a relative `after-humanity-cover.jpg` (r4). The note is left as written for the audit trail. |

Still open, because it needs the owner or source material that is not in this package: theory summaries and relationships (not invented), 82 vs 86 records, WorldForge React source, LICENSE, deployment approval, authentication, Firefox/Safari/real-device/GitHub Actions runs.
