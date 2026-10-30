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


## Curriculum roadmap implementation — 30 October 2026

Added a visible, responsive curriculum blueprint sourced from `docs/learning/content-master-plan.md` on branch `ah-aios-learning-package`. It lists all 24 specified course records with their proposed course IDs, target competency levels, and main assessment evidence:
- 6 AH-AIOS Core courses.
- 7 AI Harness courses.
- 8 WorldForge courses.
- 3 Human Stewardship courses, explicitly presented as cross-cutting rather than a fourth technical domain.

The 24-course roadmap is clearly labeled **Specified · authoring pending**. It is not represented as published or interactive lesson content. The nine interactive starter modules remain separately labeled. The page links to the source master plan.

Regression tests verify the 6/7/8/3 course counts, visible roadmap, and distinction between specified blueprint and starter lessons. GitHub Actions run [41024000678](https://github.com/hydraporss/ah-aios-react-website/actions/runs/41024000678) completed successfully on commit `f9d6d2cebc1769270a2a3ed7068dfe15f2836f09`.


## Source-grounded curriculum implementation — 30 October 2026

### Implemented in the learner interface
- Added `curriculum-data.js`, extracted from the exact course and lesson outline in `docs/learning/content-master-plan.md` on branch `ah-aios-learning-package`.
- The data contains 24 unique course records and 96 lesson units: 6 AH-AIOS Core, 7 AI Harness, 8 WorldForge, and 3 cross-cutting Human Stewardship. Human Stewardship is not a fourth technical subsystem.
- Each course opens a course view with its four specified lesson topics, source-specified exercises, course outcome (where supplied), assessment evidence, and exact source document links with Git blob SHAs.
- Each lesson opens in a reader. Four AH-CORE-100 lessons have full authored drafts: purpose, observable outcomes, prerequisites, source base, explanation labeled as interpretation, worked example, guided practice, independent exercise, knowledge checks with rationales, assessment evidence, feedback/remediation, safety boundary, and references.
- The remaining 92 lesson units display the source-defined topic and exercise and explicitly identify missing authoring fields. They remain **Specified**, not authored or published.
- Added all five source-defined integrated project briefs with local learner evidence submission.
- Added the common assessment framework: 1–4 scale, seven dimensions, assessment rules, and remediation sequence. It is not a substitute for course-specific mandatory criteria or thresholds.
- Added a visible lesson quality gate and course definition-of-done data. The learner's saved response is local portfolio evidence only; it does not mark content reviewed or competency assessed.
- Updated the service-worker app shell to cache the curriculum data and lesson reader offline.
- Corrected status presentation: the nine legacy primer checks are no longer presented as the 24-course curriculum, formal competencies, or credentials. No authorized credential issuer is configured.

### Source lineage
The curriculum data records 15 exact source files from `ah-aios-learning-package`, including the master plan, platform definition, curriculum, content governance, three learning paths, assessment and lab specifications, WorldForge README, constitution, doctrine, governance interface, and governance policy code. Each source record includes its Git blob SHA and direct GitHub link. The master plan itself remains labeled **SUGGESTION / PROCESS**, not canon.

### Automated verification
Latest GitHub Actions run [41025750155](https://github.com/hydraporss/ah-aios-react-website/actions/runs/41025750155) passed on commit `6816d56f521a486996affe2012d8828e2d6d472a`. CI passed curriculum integrity tests (24 courses, 96 lessons, 6/7/8/3 domain split, unique IDs, source hashes, authoring/publication status), project and assessment framework tests, learner import checks, JavaScript syntax validation, and required static file checks.

### Not yet complete — do not overstate
- Only four of 96 lesson units have authored drafts; none have subject-matter or instructional review. No course is approved or published.
- The source master plan explicitly lists approved source references and versions for every technical lesson as an unresolved input. In particular, the repository does not contain a detailed AI Harness technical source corpus. Do not fill those gaps with invented AH-AIOS implementation claims.
- Course-specific rubrics, mandatory criteria, minimum thresholds, instructor/reviewer packs, pilot results, and publication approvals are not complete.
- The five integrated projects are specified briefs; they are not piloted or reviewed.
- Complete authoritative 82-Theory registry remains unprovided to this app; no theory entries are fabricated.
- Manual cross-browser, mobile, screen-reader, and PWA offline acceptance remains open.
- No authorized credential issuer, production learner data policy, server-backed learner records, or production deployment is claimed.

**Status:** 24-course/96-lesson source structure is interactive; four lesson drafts are authored. The programme is not content-complete, reviewed, published, or production-deployed.


### Latest documentation and branch-head verification

The README and verification record updates also passed GitHub Actions run [41025973776](https://github.com/hydraporss/ah-aios-react-website/actions/runs/41025973776) on commit `e115c5a472ddca428a584c1b2a78de3f457be6da`. The workflow completed its source regression suite, JavaScript syntax check, and required-file checks successfully.

Current source artifact blob references at that commit:
- `learning-studio/curriculum-data.js`: `e0531ffe850368e3e86a041b2e655c20ccdb2739` (24 courses, 96 lesson units, 15 source records, five projects, assessment framework, four authored lesson drafts).
- `learning-studio/app.js`: `be36507465baaa2bae3e496df44b725a808e5e50` (interactive course/lesson reader, local portfolio save, project briefs, and source/status rendering).

The PR remains open as a draft. No merge, root-site replacement, or production deployment has occurred.


## AH-CORE-110 authoring milestone

Four lesson drafts added for AH-CORE-110 M1.1–M1.4. Source: root `README.md`, blob `4a99342dfed4eab085162f22b464540e5cc99612`. The drafts cover component responsibilities, separate browser-local and Django Server Governance paths, API/interface boundaries, persistence and authorization boundaries, and evidence limits for prototype versus production claims. The source states that the local prototype does not synchronize with Django. Browser-to-backend acceptance remains unverified; lesson wording retains that limitation. All four lessons are marked Authored draft / Not reviewed. No publication or credential claim is made.


## AH-CORE-120 authoring milestone

Four lesson drafts added for AH-CORE-120 M1.1–M1.4. Sources: root README blob `4a99342dfed4eab085162f22b464540e5cc99612`; `docs/v0.4-end-to-end-acceptance.md` blob `668b72567dd22501b70b7b186bc9cc11fe39b4d1`. Coverage: session identity/authentication versus authorization; documented per-world owner/editor/viewer roles; scoped-access and access-lifecycle gaps; access-decision and audit evidence. The cited sources do not provide a complete action-level permission matrix or full grant/change/revoke/expiry/review lifecycle. Those remain open evidence requirements. The Django API's server-side session and membership checks are documented, while browser-to-backend acceptance remains unverified. All four are Authored draft / Not reviewed; none published.
