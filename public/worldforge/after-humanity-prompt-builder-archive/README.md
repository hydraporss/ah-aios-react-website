# AFTER HUMANITY — Website Package

A self-contained static website built with HTML, CSS, and vanilla JavaScript. It includes the AFTER HUMANITY interface, Prompt Builder, local archive tools, and the supplied visual concept image.

## Open the website

1. Extract this ZIP file.
2. Open `index.html` in a current browser.

The app has no build step, package installation, or external service dependency. Its CSS, JavaScript, and image load from files included beside `index.html`.

## Features

- Home, Knowledge, Prompt Builder, Complete Archive, Governance, Agents & Tools, Analytics, and Settings sections.
- Local archive search, filters, record editing, import, and export.
- Structured prompt templates, copy/export, and a browser-local prompt library.
- Browser-local preferences and data export/reset controls.

## Data and integration limits

- Archive records, prompts, and preferences are saved in the current browser profile using localStorage. They are not synced to a server; export workspace JSON for a portable backup.
- Prompt generation uses deterministic local templates. No AI model, API, account, or agent service is connected.
- The included seed entries are a starter set, not the complete original AFTER HUMANITY archive. New content is not automatically approved or canonized.

## Package files

- `index.html` — website shell and views
- `styles.css` — responsive styling
- `app.js` — navigation, archive, prompt builder, and local persistence
- `after-humanity-redesign-concept.webp` — concept image used by the interface
