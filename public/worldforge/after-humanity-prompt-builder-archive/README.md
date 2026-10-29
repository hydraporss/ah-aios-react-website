# AH-AIOS WorldForge — After Humanity Redesign

A self-contained redesign of the uploaded WorldForge concept, packaged as a static website. The visual treatment uses the supplied concept art direction with black and gold styling, a cinematic After Humanity hero, and navigation into the Prompt Builder and Complete Archive.

## Run it

1. Extract the ZIP.
2. Open `index.html` in a current desktop or mobile browser.
3. Use the header links or the menu button to move between sections. The main calls to action link into the knowledge archive and Prompt Builder.

No build step or package installation is needed. The CSS, JavaScript, and image assets are included in this folder. It can also be hosted as a static site by uploading the extracted files while preserving their relative paths.

## What works in this package

- Internal navigation for After Humanity, Prompt Builder, Complete Archive, governance, and the other included WorldForge views.
- Local archive search, filtering, record editing, import, and export.
- Structured prompt templates, prompt assembly, copy/export, and a browser-local prompt library.
- Browser-local preferences and workspace export/reset controls.
- Responsive layouts and a menu that opens the application sections.

## Data and authority boundaries

- Records, prompts, and preferences are stored in the current browser profile with `localStorage`. They are not synced to a server and do not provide multi-user persistence.
- The included archive entries are starter/demo content, not the complete original After Humanity archive. Import the project’s real archive JSON to work with that data.
- Prompt Builder uses local templates. It is not connected to an AI model, API, or agent.
- This static package does not provide authenticated identity, trusted server-side authorization, or tamper-resistant audit history. Local role/workflow demonstrations must not be treated as production security controls.
- Export workspace JSON regularly. Import/export is available for portability, but a production-grade backup/restore service is not provided here.

## Files

- `index.html` — application shell and views
- `styles.css` — responsive theme and layout
- `app.js` — navigation, archive, prompt builder, and browser-local persistence
- `assets/worldforge-hero-art.png` — hero artwork cropped from the uploaded design mockup
- `assets/after-humanity-redesign-concept.webp` — included concept image asset
