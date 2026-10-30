# Learning Studio 0.3.0 — deployment and operations

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

The 24-course / 96-lesson programme is not content-complete. Sixteen lessons are authored drafts and 80 are specified-only. No lessons are reviewed or published. The authoritative 82-Theory registry has not been imported. Website deployment does not imply curriculum approval or canonization.

## Release state

**Prepared for deployment; not yet deployed or release-accepted.**

The PR must be reviewed and merged into `main` before the root deployment workflow publishes the combined site. Do not claim a public URL or successful production deployment until the GitHub Pages workflow and live-site checks succeed.
