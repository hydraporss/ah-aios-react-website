# AFTER HUMANITY — Operational Website Package

A responsive, multi-page-feeling single-page web app built with HTML, CSS, and vanilla JavaScript. The visual design is based on the AFTER HUMANITY / Prompt Builder / Complete Archive redesign concept.

## Run it
1. Extract the ZIP file.
2. Open `index.html` in a modern browser.
3. For best results, run a local server from the extracted directory: `python -m http.server 8000`, then open `http://localhost:8000`.

## Operational features
- Navigation between Home, Knowledge, Prompt Builder, Complete Archive, Governance, Agents & Tools, Analytics, and Settings.
- Search across the workspace; enter a search phrase to jump to matching archive records.
- Seed archive containing the project framework and explicitly recorded project-status items.
- Archive search and category/status filters.
- Create, edit, duplicate, delete, and inspect archive records.
- Import archive JSON and export archive or full workspace backups.
- Prompt Builder that assembles structured prompts from user inputs and project integrity safeguards.
- Prompt templates for worldbuilding, evidence audit, visual concepts, and story development.
- Copy prompt, export prompt as Markdown, save prompt library entries, load saved prompts/history, delete saved prompts.
- Browser-local settings for contrast, compact cards, and reduced motion.
- Live local counts for archive records, canon/proposal status, and saved prompts.

## Important boundaries
- Prompt assembly is local template logic; it does **not** call an AI model or external API.
- Archive edits and prompts are stored in the browser's localStorage, not a database. Use Export Workspace JSON to back up or move data.
- Imported source/provenance strings and status labels are preserved, not independently verified.
- The included seed entries are a starter set based on established project context and are not a substitute for the complete original archive.
- This package does not deploy itself or change any GitHub repository.
- No authentication, shared collaboration, remote database, live agent runtime, or AI API is connected.
- New records default to Proposal. The app does not canonize or approve records automatically.

## Files
- `index.html` — application shell and all views
- `styles.css` — responsive dark sci-fi UI
- `app.js` — navigation, archive, prompt builder, local persistence, import/export
- `assets/after-humanity-redesign-concept.png` — supplied visual concept reference
