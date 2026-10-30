<!-- Notion source page 40966662-b29d-8166-bfaa-d63137e526eb; original path learning-studio/VERIFICATION.md; export date 2026-10-30 -->

<b>Repository:</b> [hydraporss/ah-aios-react-website](https://github.com/hydraporss/ah-aios-react-website)

<b>Branch:</b> `learning-studio-0.2.0`

<b>Path:</b> `learning-studio/VERIFICATION.md`

<b>Git blob SHA:</b> `6fe554700ba0a02fa1ed6a3153516786aacdabd3`

<b>Export:</b> Complete fetched UTF-8 source content follows.

---

# Verification — AH-AIOS Learning 0.2.0

## Automated checks

The redesigned application passed GitHub Actions on commit `7136c6e216c9294dfa4008c56d5c6e5556cf5699`. Run: [https://github.com/hydraporss/ah-aios-react-website/actions/runs/41014921189](https://github.com/hydraporss/ah-aios-react-website/actions/runs/41014921189) (completed, success). The workflow executed `node --test tests/*.test.js`, `node --check app.js`, and checked required static app files.

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

## Incremental verification update — 30 October 2026

Current branch: [learning-studio-0.2.0](https://github.com/hydraporss/ah-aios-react-website/tree/learning-studio-0.2.0)
Current commit: `04ad2f862da3997e2f64eef58822d3ef53d67d03`

### Changes included

- Learner display name is restored from local profile storage and reflected in the header identity/avatar and completion certificate.
- Added an AH-AIOS Learning SVG app icon and declared it in the web app manifest.
- Updated service-worker cache version to invalidate the previous app shell.
- Added regression coverage for profile identity and certificate personalization.

### Automated result

GitHub Actions [run 41022872871](https://github.com/hydraporss/ah-aios-react-website/actions/runs/41022872871) completed with conclusion <b>success</b> on the current branch head. The job passed:

- Learning Studio Node regression tests.
- JavaScript syntax validation (`node --check app.js`).
- Required static application file checks.

### Scope and remaining acceptance

The Learning Studio remains one application containing AH-AIOS Core, AI Harness, and WorldForge learning domains. Separate websites for those domains are deferred until after this application is finished. The original WorldForge/main snapshot is preserved on branch [backup/worldforge-main-2026-10-30](https://github.com/hydraporss/ah-aios-react-website/tree/backup/worldforge-main-2026-10-30).

Still outstanding: keyboard/screen-reader accessibility, cross-browser and mobile device acceptance, real install/offline PWA testing, authoritative 82-theory records and provenance, and root-site/production deployment. No live AI tutor, backend, accounts, or cloud progress sync are claimed.

<b>Status:</b> Incremental code and automated checks verified; Learning Studio not yet fully accepted or deployed to production.

## Acceptance update — 30 October 2026 (continued)

Current code commit: `273d466ba4952aaba180d9862839e4e3fd18f7e3`
Latest successful CI: [https://github.com/hydraporss/ah-aios-react-website/actions/runs/41023768064](https://github.com/hydraporss/ah-aios-react-website/actions/runs/41023768064)

Added keyboard skip navigation, named navigation landmarks, visible focus styling, reduced-motion support, mobile menu expanded-state accessibility, and synchronized learner identity across header/profile/certificate. Progress import now validates nested collections and boolean assessment values before replacing stored learner progress. The service worker caches the SVG app icon and only removes caches belonging to Learning Studio.

The source curriculum was checked on branch `ah-aios-learning-package`: it specifies 21 specialist courses (6 Core, 7 AI Harness, 8 WorldForge) plus 3 cross-cutting Human Stewardship courses. The current app still contains nine starter course records (three per technical domain). The current compact lesson format is not yet at the source's full authoring standard. Human Stewardship is cross-cutting, not a fourth technical domain.

<b>Status:</b> CI passes on the current branch head. Full curriculum authoring/review, manual cross-browser/screen-reader acceptance, real PWA installation/offline tests, authoritative 82-Theory records/provenance, and production deployment remain outstanding. This is not a content-complete or production release.

## Curriculum Blueprint UI — 30 October 2026

Added a responsive in-app curriculum map for the 24 course records specified by the source learning plan: 6 Core, 7 AI Harness, 8 WorldForge, and 3 cross-cutting Human Stewardship. The interface shows proposed IDs, competency levels, assessment evidence, and <b>Specified · authoring pending</b> status. Human Stewardship is explicitly not a fourth technical domain. The nine interactive starter modules remain separately labeled.

Latest successful CI: [https://github.com/hydraporss/ah-aios-react-website/actions/runs/41024066974](https://github.com/hydraporss/ah-aios-react-website/actions/runs/41024066974) (commit `ec237bfcb7470e5e1c570bf6d3f05d0eb410e4f5`). Tests verify the 6/7/8/3 catalogue counts and that the blueprint is distinct from published interactive modules.

This does not complete the 24 courses. Full lesson authoring, worked examples, assessment rubrics, evidence/source links, subject and instructional review, and publication approval remain open.

## Learning Studio content production update — 30 October 2026

The Learning Studio branch now includes a source-traced interactive catalogue of 24 courses and 96 lesson units. Source breakdown: 6 AH-AIOS Core, 7 AI Harness, 8 WorldForge, 3 cross-cutting Human Stewardship. The structured curriculum file records 15 exact source files and Git blob hashes, five integrated project briefs, a seven-dimension common assessment rubric, the 14-item lesson quality standard, and course definition-of-done.

Four AH-CORE-100 lesson units have authored drafts with outcomes, source references, interpretation-labeled explanation, examples, guided/independent practice, knowledge checks with rationales, evidence, feedback, safety boundary, and references. The other 92 lesson units remain <b>Specified only</b>. All lesson and course content remains unpublished and unreviewed. No credentials are issued.

Curriculum data: [https://github.com/hydraporss/ah-aios-react-website/blob/learning-studio-0.2.0/learning-studio/curriculum-data.js](https://github.com/hydraporss/ah-aios-react-website/blob/learning-studio-0.2.0/learning-studio/curriculum-data.js)
Blob SHA: `e0531ffe850368e3e86a041b2e655c20ccdb2739`
App reader: [https://github.com/hydraporss/ah-aios-react-website/blob/learning-studio-0.2.0/learning-studio/app.js](https://github.com/hydraporss/ah-aios-react-website/blob/learning-studio-0.2.0/learning-studio/app.js)
Latest successful branch-head checks: [https://github.com/hydraporss/ah-aios-react-website/actions/runs/41025973776](https://github.com/hydraporss/ah-aios-react-website/actions/runs/41025973776) (commit `e115c5a472ddca428a584c1b2a78de3f457be6da`).

The source plan explicitly leaves approved technical references for every lesson unresolved; detailed AI Harness technical source material is not present. Remaining content must be grounded in approved source material, not invented. Course-specific rubrics, instructor/reviewer packs, pilots, required reviews, publication approval, 82-Theory registry data, manual accessibility/PWA acceptance, and production deployment remain open.

The PR remains open as a draft. The original WorldForge/main backup branch is unchanged. This Notion page is an index and verification record, not a full mirror of the repository or the 67 KB curriculum data file.
