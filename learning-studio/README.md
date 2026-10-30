# AH-AIOS Learning Studio 0.2.0

Independent static learning application. It does not modify or replace the WorldForge application.

## Included
- Three learning paths: AH-AIOS Core, AI Harness, WorldForge.
- Nine starter modules with lessons, practice prompts, and knowledge checks.
- Learner dashboard with module/check progress.
- Practice lab and learner portfolio.
- Browser-local progress persistence.
- JSON progress export and schema-validated import; invalid imports are rejected without replacing current progress.
- PWA manifest and service worker for offline shell caching.
- 82-Theory Explorer import gate requiring exactly 82 records, 68 registry-origin and 14 synthesized-origin, each with id and title.

## Important source limitation
The connected repositories currently expose no authoritative 82-theory registry or the required 68+14 record dataset. The explorer therefore starts empty and does not invent records. The import gate checks counts and required fields; it does not prove provenance or authenticity. Attach the authoritative source registry before treating the explorer as populated.

The nine module lessons are a starter curriculum derived from the documented AH-AIOS architecture principles and WorldForge capability descriptions available in the connected project. They are not a replacement for a separately approved curriculum specification.

## Run locally
Serve this directory using any static HTTP server, for example:
`python -m http.server 8000`
Then open `http://localhost:8000`. Service workers require localhost or HTTPS.

## Deploy independently with GitHub Pages
Copy this directory's contents to the root of a dedicated repository, then copy `.github/workflows/pages.yml` from this directory into that repository's `.github/workflows/pages.yml`. In repository Settings → Pages, select GitHub Actions. The workflow builds no dependencies and deploys the static root.

## Data
Progress is local to the browser profile. No backend, login, cloud synchronization, or server-side learner database is included.
