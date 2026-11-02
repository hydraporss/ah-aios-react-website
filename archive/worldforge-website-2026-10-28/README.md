# WorldForge Website Package

A responsive, multi-page static website prototype for the WorldForge doctrine and AH-AIOS ecosystem. It runs without a build step or external JavaScript libraries.

## Run locally
1. Unzip the package.
2. Open `index.html` in a modern browser.
3. Use the top navigation and page links to move between Home, Doctrine, Architecture, Governance Lab, Constitution, and World Explorer.

For best compatibility, you may serve the folder with any static web server (for example `python -m http.server 8000`) and open `http://localhost:8000`.

## Included functionality
- Responsive multi-page navigation and internal cross-links.
- Manifesto poster embedded as a local image asset.
- Doctrine, architecture, constitutional charter, and knowledge-model pages.
- Governance Lab: create candidate claims, advance their review status, delete records, and clear the register.
- Seven-gate review readiness check.
- Browser-local persistence via `localStorage`.
- Downloadable Constitution in Markdown.

## Important limitations
This is a functional **front-end prototype**, not a production multi-user platform. Candidate records are stored only in the current browser and can be lost if site data is cleared. No account system, cloud database, multi-user collaboration, real authorization, server-side audit trail, or AI API is connected. The readiness check is advisory and does not approve canon.

## Suggested production next step
Add a backend API, database schema for entities/claims/sources/evidence/decisions/versions, authentication, role-based authorization, append-only audit events, backups, and automated tests. Connect AI through a server-side service with explicit permission boundaries and human approval gates.

## Package structure
- `index.html` — Home
- `doctrine.html` — Three Laws
- `architecture.html` — Brand/system architecture
- `governance.html` — Interactive claim register and review gates
- `constitution.html` — Constitution
- `explorer.html` — Knowledge model
- `assets/site.css` — Responsive design
- `assets/site.js` — Browser interactions
- `assets/worldforge-manifesto.png` — Generated manifesto visual
- `assets/constitution.md` — Downloadable charter
