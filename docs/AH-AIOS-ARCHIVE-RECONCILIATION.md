# AH-AIOS.zip vs Master Release r2 - reconciliation

Date: 2026-11-01. Comparison only. Nothing in r2 was modified, and r2's checksum is unchanged.

## Verdict

Keep r2 (`AH-AIOS-Master-Release.zip`, sha256 `6014ccbf...c863d`) as the canonical package. `AH-AIOS.zip` is an older working tree, not a parallel branch. Do not merge it wholesale. One part of it is worth taking: the 82 theory records (below).

## What was compared

| | r2 inner release | AH-AIOS.zip |
|---|---|---|
| Size | 304 files, 23 MB | 10,522 zip entries, 212 MB zipped / ~350 MB extracted |
| Layout | Static site + `optional-flask-backend/` | Raw project root with Flask app at `ah_webapp/`, plus ~47 top-level folders |
| Contents | Release-ready, manifest-checked | Includes `.venv`, `.git`, `__pycache__`, `.db` files, nested `.zip`/`.7z` packages, `.env.supabase`, a file named `nul` |

Only 2 paths are identical by name (`README.md`, `.gitignore`) and both differ in content. A path diff is therefore misleading; the comparison below is by content.

## Flask backend: r2 is newer

- **Line endings only:** 4 files differ only in CRLF vs LF: `hermes_cli.py`, `ah_webapp/commands.py`, `prompt-builder.test.js`, `test_batch1_read_only.py`. Identical logic.
- **Byte-identical:** `hermes.py`, `auth.py`, `admin.py`, requirements files, 3 JSON schemas, `prompts.json`, `templates.json`, 2 phase1 test files.
- **r2 ahead:** r2 has the `utcnow()` fixes (`models.py` has 42 raw `datetime.utcnow()` calls in the working tree and 1 in r2, inside the `_utcnow` helper; `governance.py` has 1 raw call in the working tree and 0 in r2), `GenerationIntentError` and `WorldStateError` defined in-tree, `connect.py`, `test_connected.py`, `pytest.ini`, `run_local.py`, and the rewritten `phase1_vertical_slice.py`.
- **Templates:** all 25 differ in content. r2's `base.html` is the local-workbench shell (dark theme, links to Hub, Learning Studio, WorldForge, Harness); the working tree has the older AH-WebAPP-001 shell loading Google Fonts from a CDN. r2 is the later design.
- **Only in the working tree, not carried to r2:** `wof_generator.py` (545-byte stub imported by the old `main.py`), `wof_world_state.py`, `flask_app_simple.py`, `run_website.py`, `write_commands*.py` (one-off generator scripts), and `conftest.py` fixtures (`client`, `login`, `make_user`) used only by `test_wof_web_flow.py`, which r2 does not ship. I did not review `wof_world_state.py` beyond confirming it exists; r2's `wof_integration.py` appears to have absorbed its role, but that is an inference.

None of these should be merged: they are superseded or scratch.

## The 82 theory records (the one thing worth taking)

r2's open item was "82 theory records (owner)". The working tree has them:

- `data/theories.json`: 82 records. `data/theories.csv`: 82 rows. IDs match, no duplicates.
- Kinds: 44 framework, 23 theory, 14 procedure, 1 principle.
- 14 records have ids `THEORY-*` (JPG-derived, verification `VERIFY`); the other 68 are the original registry records.

Built from those, using r2's own schema:

- `theories-import-82.csv`: the columns r2's `scripts/build-theories.js` expects.
- Passes `node scripts/build-theories.js`: "82 records (68 registry, 14 synthesized)". Passes `validateTheoryCollection` and `validateIntegrity` from r2's `learning/theory-validation.js`.

Caveats, in order of importance:

1. **Mapping is my inference.** I labelled the 14 `THEORY-*` ids `synthesized` and the other 68 `registry`. That fits the 68 + 14 wording but is not stated in the data. Confirm it.
2. **The count is contested inside the working tree.** `registry/theory_registry.json` has **86** records (the 82 plus `C-ON`, `HUM-001`, `INV-001`, `INV-PITCH-001`: an OntoMesh paper, a role matrix and two investor documents, so they look like documents rather than theories). Two snapshots from 2026-10-24 have 68. The 2026-10-25 report in `NOT_ORIGINAL_RECONSTRUCTION/THEORY_RECONCILIATION_68_14_82.md` says the 82 target "cannot be verified": only 34 of the 39 JPG master artifacts exist, and the original 14 procedures were recovery-workflow procedures, not JPG-derived theories. The 82 in `data/` was produced after that report. Decide whether 82 or 86 is right.
3. **`summary` is empty on purpose** (r4). Nothing is invented; `kind`, `cluster`, `verification` and `source_sha256` are carried through as extra columns. Write real one-line summaries before publishing.
4. **Provenance is thin.** 65 records are `NOT_RUN`, 3 are `NOT_RECORDED` (T-04, T-05, T-07 were `SOURCE_MISSING` in the earlier report). The builder only checks structure, not facts.
5. `relationships` is empty for all records.

## Security

`AH-AIOS/.env.supabase` in the zip holds a Supabase URL, anon key, service-role key and JWT secret (values not reproduced here). r2's notes already flagged a credential. Rotate all four in the Supabase dashboard, and do not publish or re-share `AH-AIOS.zip` as is. The service-role key bypasses row-level security.

## Housekeeping

- Keep: r2 zip + sha256 + CHANGES.md; `theories-import-82.csv` once the caveats are settled.
- Archive privately (not in the release): `AH-AIOS.zip`, after rotating the keys.
- Never ship from it: `.venv`, `.git`, `*.db`, `__pycache__`, nested zips/7z, `nul`.
- Still open and unchanged by this comparison: README "68 + 14" wording, LICENSE, deployment approval, WorldForge React source, Flask-connected bundle's remote hero URL, Flask pytest, Firefox/Safari/real devices/GitHub Actions.

## Triage of the remaining folders (r4)

Added to the package (reference only, not wired in):

| From the working tree | Now at | Check run |
|---|---|---|
| `src/ah_aios/` (Core engines) | `optional-flask-backend/reference/ah-aios-engines/` | 75 tests pass; vision engine untested (needs `pydantic`) |
| `supabase/migrations/002*`, `seed/` | `optional-flask-backend/reference/supabase/` | not run; migration set incomplete (001 missing) |
| `deliverable/WORLDFORGE-*.md` (3 drafts) | `docs/worldforge-reference/` | read headers only; self-labelled drafts |

Checked, nothing to take: `learning_studio_app/` curriculum data is byte-identical to r2's; no authored lesson content exists anywhere in the working tree, so lesson writing is still open work.

Deliberately not included: `governance/CII_Governance_Package` (CII acquisition email, contact/tracking log, certification checklists: process records, not site content), `deliverable/` spreadsheets and zips, `artifacts/`, `2026-10-*` Codex output folders (66 MB, not read), `learning_studio_app/` desktop build and `.exe`, `tools/`, nested zips and `Codex.7z`, `supabase/config.toml` + `web/app.js` + `.temp/` (project reference), `.env.supabase`. The `2026-10-*` folders and the nested archives have still NOT been reviewed in detail.

## Fixes in r4

- Flask-connected WorldForge bundle no longer loads the hero from `hydraporss.github.io` (`<base href>` and the CSS `url()` made relative). Verified in Chromium against the running Flask app: the cover loads from `/learning/worldforge/after-humanity-cover.jpg`, no github.io requests, no failed requests apart from an external YouTube embed that cannot load offline.
- `optional-flask-backend/pytest.ini`: added `testpaths` and `norecursedirs`. Bare `pytest` previously failed at collection on a duplicate test module under `reference/`.
- Flask backend tests are now verified: 42 passed (previously "not verified"). Run offline using pure-Python packages borrowed from the working tree's `.venv`; not shipped.
- Theory candidate: placeholder summaries removed (above).
