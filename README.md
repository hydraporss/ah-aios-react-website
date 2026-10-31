# Learning Studio

**Learning Studio** is the primary website and project in this repository. It is an interactive learning platform for the AH-AIOS ecosystem: learn, build, govern, and create.

## Current application

The root of this repository is the Learning Studio website. Its current release candidate includes:

- A responsive learning dashboard and navigation.
- A source-traced 24-course / 96-lesson programme map.
- Starter learning modules, lesson readers, knowledge checks, practice labs, integrated project briefs, and a local tutor.
- Learner portfolio, profile, progress export/import, and browser-local persistence.
- A structured 82-Theory import gate requiring 68 registry and 14 synthesized records.
- PWA manifest and service-worker app-shell caching.
- Automated curriculum, data-integrity, deployment, and browser smoke tests.

## Run locally

Requirements: Node.js 24+ and pnpm 11.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Build and verify:

```sh
pnpm test
pnpm build
pnpm preview
```

The production build is generated in `dist/`. GitHub Actions verifies the application and deploys the verified build to GitHub Pages.

## Content and trust boundaries

The curriculum catalogue defines 24 courses and 96 lesson units: 6 AH-AIOS Core, 7 AI Harness, 8 WorldForge, and 3 cross-cutting Human Stewardship courses. Current content status: **24 authored drafts, 72 specified-only, 0 reviewed, 0 published**. Drafts are not approved curriculum.

The authoritative 82-Theory dataset is not bundled. The import validator checks the expected count, classification, unique IDs, and required titles; structural validation does not authenticate source provenance. No missing theory records are fabricated.

Learner progress and profile data are stored locally in the browser. This release has no account system, shared backend, cloud progress synchronization, or live AI model connection. Local completion summaries are not official credentials.

## Preserved project material

Previous WorldForge work, source files, and AFTER HUMANITY visual/site assets remain in the repository history and preserved project directories. The Learning Studio is now the primary root application; preservation does not imply that legacy WorldForge functionality is part of this website's active runtime.

## Project identity

- Project: **Learning Studio**
- Website: **Learning Studio**
- Repository target name: **learning-studio**
- Default branch: `main`

The repository name itself is a separate GitHub repository setting and will be aligned after this root-level project transition is reviewed and verified.
