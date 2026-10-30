# Learning Studio 0.3.1 — deployment and operations

## Deployment layout

The Learning Studio is packaged as a separate static application at:

`/learning-studio/`

The existing WorldForge site remains at the repository root:

`/`

The root GitHub Pages workflow builds and tests WorldForge, runs the Learning Studio tests, then copies only the Learning Studio runtime files into `dist/learning-studio/`. It uploads one Pages artifact containing both applications. The Learning Studio's relative asset paths, manifest scope, and service-worker scope are designed to keep the application isolated under its subdirectory.

## Runtime files

- `index.html`
- `app.js`
- `styles.css`
- `curriculum-data.js`
- `theory-validation.js`
- `manifest.webmanifest`
- `sw.js`
- `icon.svg`

Tests, source-verification records, ZIP archives, and authoring documentation are not copied into the public runtime directory.

## Required checks before release

1. GitHub Actions succeeds for the exact merge commit.
2. GitHub Pages reports a successful deployment and supplies its public URL.
3. Open the root WorldForge URL and confirm its existing landing page and navigation still work.
4. Open the `/learning-studio/` URL and confirm all local assets load without 404 errors.
5. Exercise course/lesson navigation, knowledge checks, labs, portfolio saves, profile edits, progress export/import, and reset confirmation.
6. Test a fresh browser profile, refresh, and a second visit to verify local persistence.
7. Install the PWA over HTTPS, reload offline, navigate the cached app shell, then reconnect and confirm recovery.
8. Test keyboard-only navigation, focus visibility, reduced-motion behavior, screen-reader landmarks, narrow mobile layout, and current Chromium, Firefox, and Safari.
9. Confirm no existing WorldForge root files or workflows were replaced by the Learning Studio packaging step.

## Current product boundaries

This release candidate is a static, browser-local learning application. It has no user account system, server-side learner profile, cloud progress synchronization, or live AI model connection. Learner data is stored in the browser profile; users should export a JSON backup before changing devices or clearing site data.

The 24-course / 96-lesson programme remains in content production. Twenty lessons are authored drafts and 76 are specified-only. All authored lessons remain unreviewed and no course is published. The authoritative 82-Theory dataset is not bundled; the import gate validates 68 registry + 14 synthesized records, unique IDs, titles, and unambiguous classification, then persists a valid import in the current browser. Structural validation does not authenticate source provenance. Website deployment does not imply curriculum approval or canonization.

## Release state

**Merged to `main`; production deployment and live acceptance must be verified separately.**

The Learning Studio is published at `/learning-studio/` by the root GitHub Pages workflow. Do not claim a successful production deployment until the post-merge Pages workflow succeeds and the live routes and runtime assets are checked. Manual keyboard, screen-reader, cross-browser, mobile-device, install, and offline acceptance remain separate release gates.
