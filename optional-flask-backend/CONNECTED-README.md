# AH-AIOS Connected Workbench

One local link for every recovered part. Start it, then open **http://127.0.0.1:8080/hub**.

- Windows: extract the whole ZIP, double-click `OPEN-LOCAL-WORKBENCH.bat`
- Mac/Linux: `./start-mac-linux.command`
- Needs Python 3 and an internet connection the first time (installs Flask, Flask-Login, Flask-SQLAlchemy).

## What is connected

| Path | Part | Source |
|---|---|---|
| `/hub` | Hub: links to everything, with presence check | new (`ah_webapp/connect.py`) |
| `/worldforge-app/` | AH-AIOS WorldForge (React build from `dist.7z`) | your Vite build |
| `/learning/` | Learning Studio | learning-studio-local (links fixed) |
| `/learning/worldforge/` | WorldForge archive + verified 2026-10-28 site | same package |
| `/harness/` | AI Harness Command Builder | recovered prompt-builder page |
| `/` , `/worlds`, `/races`, `/governance/…`, `/admin` | AH-AIOS Core Flask workbench | AH-AIOS-Local-Workbench |
| `/docs/…` | Architecture spec (LS-ARCH-WEB-001), Notion product summary | Notion export |
| `/api/connected` | JSON list of parts and whether their files are present | new |

`reference/source-packages/` keeps the original ZIPs untouched, for provenance.

## Changes made while connecting
- WorldForge React build mounted at `/worldforge-app/`. Its files are unchanged on disk; when served, absolute `/assets/` paths are re-based and its two links to the GitHub Pages copy of the archive (cover image, archive link) are pointed at the archive bundled here. The `dist/worldforge/` pages in the build were identical to the archive already included (line endings only), so they were not duplicated.
- The verified 2026-10-28 website embeds the WorldForge app again (as its page intends); in the standalone Learning Studio package it still shows the archive home.
- New `connect.py` blueprint, hub page, and nav links in the Flask header, dashboard, Learning Studio, WorldForge home and Command Builder.
- Command Builder: the recovered page was never served by Flask; it is now at `/harness/`. Its dead `#` nav links point to the real data/schema files and the spec. Its `url_for` tags are resolved without Jinja, because the page contains literal `{{variable}}` prompt tags.
- Fixed a bug in the recovered `prompt-builder.js` (selected `h3`; the heading is `h2`), which stopped the live preview from updating.
- Learning Studio package: dead WorldForge links, a script syntax error in `worldforge/tools.html`, and the self-embedding verified page were fixed earlier.

## Status boundaries (unchanged)
- `src/wof` (WorldForge generator source) is **not** in the recovered archive. Generation routes return 503; nothing is invented.
- The Learning Studio tutor is local content, not a live AI model; learner progress is browser storage, not authenticated records.
- The Command Builder is a prototype interface.
- Being linked together does not verify, canonize or deploy any part. A test file existing is not a passed test.

## Verification actually performed (31 Oct 2026)
- `tests/test_connected.py` (9 tests): run against the connection layer with stubbed Core routes: **9 passed**.
- Browser crawl of 36 pages from `/hub` (all links, Learning Studio + WorldForge pages, Command Builder): **no broken links or script errors**; Command Builder template → sample → validate exercised.
- WorldForge React app opened in a browser: renders, all 12 in-app section links resolve, no script errors, also loads inside the verified website page. Its YouTube embed is external and could not be tested offline. Its records live in this browser's localStorage under `ah-aios-worldforge`; not synced, not authenticated.
- **Not run:** the full Flask app and the existing Core tests (`test_batch1_read_only`, `test_phase1_*`). Flask-Login and Flask-SQLAlchemy could not be installed in the build environment, so they remain unverified. Run `python -m pytest ah_webapp/tests` after first launch.
