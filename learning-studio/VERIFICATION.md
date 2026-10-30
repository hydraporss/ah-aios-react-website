# Verification — AH-AIOS Learning 0.2.0

## Automated checks
The redesigned application passed GitHub Actions on commit `7136c6e216c9294dfa4008c56d5c6e5556cf5699`. Run: https://github.com/hydraporss/ah-aios-react-website/actions/runs/41014921189 (completed, success). The workflow executed `node --test tests/*.test.js`, `node --check app.js`, and checked required static app files.

The regression suite checks:
- Nine starter course records.
- 82-theory import count and 68+14 classification checks.
- Progress schema/version validation and rejection of invalid imports.
- Course, lab, tutor, portfolio, and profile interaction hooks.
- Internal navigation anchors and required dashboard mount points.
- Responsive CSS breakpoints and service-worker registration.

## Implemented interactions
- All sidebar, header, domain, library, footer, and course navigation anchors target page sections.
- Course cards open lessons and exercises; answers are graded and update progress.
- Course work can be saved to the learner portfolio.
- Practice labs accept and save submissions.
- Assessment cards launch course checks.
- Competencies and certificates derive from completed course checks; completed path certificates can be printed.
- Search filters the course catalogue.
- Local tutor answers from the bundled course content; it is not connected to a live AI model.
- Progress JSON export/import; imports validate schema/version/module IDs before replacing current progress.
- Theory registry import requires exactly 82 records split into 68 registry and 14 synthesized, each with id and title. This is structural validation only.
- Profile and progress persist in localStorage; reset requires confirmation.
- Service worker caches the app shell for offline reopening after a successful first load.

## Not yet independently verified
- Cross-browser UI behavior, keyboard/screen-reader accessibility, and mobile device acceptance.
- Real-world PWA installation and offline behavior in Chromium, Firefox, and Safari.
- Dedicated GitHub Pages deployment from a new repository.
- Authoritative 82-theory content and provenance. The connected source repositories have not yielded the canonical records, so no records are fabricated.
- Full conformity with the missing development procedure document.
- Cloud accounts, multi-user sync, a backend, and a live AI Tutor are not implemented.

## Source integrity
The three learning domains and nine starter modules are a functional starter curriculum based on available AH-AIOS architecture principles. This does not silently elevate course interpretations to canon or replace authoritative source records.

## 3-Day AI Engineering Sprint addition
- Added three-day task track with 15 persistent checkboxes and a live completion bar.
- Added Governance AI capstone structure and acceptance criteria.
- Added explicit API-key hygiene guidance. The sprint does not provision an API key, call a live model, or deploy the capstone.
- New regression checks verify section navigation, all 15 controls, local persistence wiring, and credential-safety guidance.
- Sprint completion is a learner checklist, not evidence that the capstone has been built.


## Acceptance update — 30 October 2026

### Current automated verification
The latest branch-head run completed successfully on commit `e86b1c72394f5fa9870b38d6cc028b9e3a8ad97e`: https://github.com/hydraporss/ah-aios-react-website/actions/runs/41023671203

The suite now contains 19 regression tests covering course catalogue structure, source-gated theory import, learner progress import, navigation targets, mobile navigation state, learner profile identity, keyboard skip navigation, visible focus, reduced motion, PWA cache scope, icon precaching, and the 3-Day Sprint. CI also checks JavaScript syntax and required static files including the app icon.

### Data-integrity improvement
Progress import now rejects duplicate or unknown completed-course IDs, malformed check maps, non-boolean check values, and malformed portfolio/lab/activity collections before replacing current progress. The import path continues to preserve the existing learner state when validation fails.

The service worker now precaches the app icon and removes only older caches with the Learning Studio cache prefix. It no longer deletes unrelated origin caches.

### Source curriculum coverage — known gap
The source learning package defines 21 specialist courses across the three technical domains (6 Core, 7 AI Harness, 8 WorldForge) and 3 cross-cutting Human Stewardship courses. The current application contains 9 starter course records (3 per technical domain). Therefore the app's course catalogue is a functional starter set, not the complete specified programme. Human Stewardship is cross-cutting and is not a fourth technical domain or a fourth separate website.

The source curriculum also requires each lesson to include observable outcomes, prerequisites, source base, explanation, worked example, guided and independent practice, knowledge check, evidence, feedback, safety boundaries, and version/review lineage. The current compact lesson cards and single knowledge check per course do not yet satisfy that full authoring standard. Course expansion and source-grounded content review remain required before content-complete acceptance.

### Still not independently accepted
- Cross-browser/device UI acceptance and real screen-reader review.
- Real PWA installation and offline acceptance on supported browsers.
- Full course authoring/review against AH-LEARN-MASTER-001 and the three path documents.
- Authoritative 82-Theory source data and provenance; no entries are fabricated.
- Production hosting, root-site promotion, privacy/retention policy, and any multi-user/backend claims.

**Status:** Latest automated code checks pass. The Learning Studio is not yet content-complete, manually accessibility-tested, PWA-accepted, or production-deployed.
