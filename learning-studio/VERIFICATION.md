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


## AH-CORE-130 authoring milestone

Four lesson drafts added for AH-CORE-130 M1.1–M1.4. Source lineage: `docs/learning/content-governance.md` blob `e9a2d234068eacf9327e18ef986448316e73f28d`; `src/governance.js` blob `8d21a745155e2463fea802c9325c3a68b972562d`; `tests/governance.test.js` blob `edb13f5c9405155dea176f10f2cd55299d85b894`; `tests/e2e-governance.mjs` blob `e0eb9491ab2b0e23dd9aa03f835c6e0beac3bf50`; `docs/v0.4-sprint-1-and-acceptance.md` blob `8526cccd8dda54f88b574c619eb371e89f23c89c`. Coverage includes asset/attack-surface inventory, policy-to-control enforcement, untrusted content handling, and evidence-bounded incident escalation. Gaps retained: no complete formal threat model, no implemented AI prompt-injection/instruction-conflict defense established by these sources, no full incident-response policy, and browser-local audit records are not tamper-proof. All four lessons are Authored draft / Not reviewed; not published.



## AH-CORE-130 authoritative source verification — 30 October 2026

Verified and recorded the current official external references:
- NIST SP 800-61 Rev. 3 — final publication, 3 April 2025; incident-response guidance; supersedes Rev. 2.
- NIST AI 100-2 E2025 — final publication, 24 March 2025; adversarial machine-learning taxonomy and terminology. The NIST publication page notes a potential errata/update item.
- OWASP GenAI / LLM Top 10 2026 — current OWASP release, published 4 August 2026; includes prompt injection and related LLM application risks.

The lesson mapping is intentionally bounded: NIST AI 100-2 E2025 supports M1.1 and M1.3 as an external taxonomy; OWASP 2026 supports M1.3 as an LLM risk-awareness reference; NIST SP 800-61 Rev. 3 supports M1.4 as general incident-response guidance. M1.2 remains based on repository policy/code/test evidence. Full details and source URLs are in `AH-CORE-130-SOURCE-VERIFICATION.md` and the external source catalog in `curriculum-data.js`.

**Evidence boundary:** external references do not prove project-specific control implementation. The repository still does not establish a complete formal threat model, implemented prompt-injection defense, full operational incident-response policy, or tamper-proof browser-local audit history. All four AH-CORE-130 lessons remain Authored draft / Not reviewed. Source verification is not content approval or publication.

Regression tests now verify the three external source records, publication metadata, canonical URLs, lesson mappings, and explicit implementation-limit language.


The external-source verification additions and regression tests completed successfully in GitHub Actions run [41029942500](https://github.com/hydraporss/ah-aios-react-website/actions/runs/41029942500) on commit `9f810020a3165cf710e92cef1d7a298785a18b05`. This run validates the curriculum-data and regression-test changes. The final documentation-only update is recorded in the branch head after that run; a fresh branch-head run is being triggered to verify the exact final commit.


## Learning Studio 0.3.0 — curriculum quality gate

Added `tests/curriculum-quality-gate.test.js`. The new automated checks validate:
- 24 unique courses and 96 lesson units, with four lessons per course.
- The source-defined 6 Core / 7 AI Harness / 8 WorldForge / 3 cross-cutting Human Stewardship split.
- All 14 required instructional fields for each of the 16 authored lesson drafts.
- Non-empty explanations, source bases, references, and valid knowledge-check option/answer/rationale structures.
- Exactly 80 remaining lessons stay **Specified** and have no authored content.
- Authored lessons remain **Authored draft / Not reviewed**; no course is promoted to published.
- The AH-CORE-140 course and its four source-defined lesson titles remain unchanged and specified-only.

The quality gate is deliberately structural: it verifies completeness of required fields and status boundaries, not the factual correctness of every lesson explanation. Human subject-matter and instructional review remain necessary.

At the time the original 0.3.0 gate was added, the curriculum contained 16 authored drafts and 80 specified-only lessons. The 0.3.1 update below supersedes those counts with 20 authored drafts and 76 specified-only lessons. The new test must pass in GitHub Actions on the exact branch head before its result is treated as verified.


## Deployment candidate 0.3.0 — packaging and smoke checks

Added `tests/deployment-smoke.test.js` to check:
- Package and service-worker cache version alignment at 0.3.0.
- Relative HTML asset references and local asset existence.
- PWA manifest start URL, scope, display mode, and icon.
- Service-worker app-shell precache and Learning Studio-only cache cleanup.
- Absence of root-relative HTML asset references, so the app can be hosted below `/learning-studio/`.

Updated the root GitHub Pages workflow to retain the existing WorldForge root build and additionally:
- Run Learning Studio's Node test suite and JavaScript syntax check.
- Check all required runtime files.
- Copy the Learning Studio runtime files to `dist/learning-studio/`.
- Verify both root and Learning Studio production entry points before uploading the single Pages artifact.

Historical 0.2.0 checkpoint: the branch-specific verification workflow ran on pushes to `learning-studio-0.2.0`; the root deployment workflow ran on pushes to `main` or manual dispatch. This checkpoint is superseded by the 0.3.1 workflow described below.

**Historical 0.2.0 release gates:** exact branch-head CI, merged deployment workflow, public Pages URL, browser/device/accessibility acceptance, and real PWA install/offline behavior remained open at that checkpoint. See the 0.3.1 section and `DEPLOYMENT.md` for the current release gates.


## Learning Studio 0.3.1 verification additions — 30 October 2026

- Added AH-CORE-140 M1.1–M1.4 as source-grounded authored drafts. All remain Not reviewed and unpublished.
- Added automated curriculum quality tests for the 24-course / 96-lesson blueprint, 6/7/8/3 domain split, 20 authored drafts, 76 specified-only lessons, required instructional fields, knowledge-check integrity, and status preservation.
- Added a dedicated 82-Theory import validator. It enforces exactly 82 records, 68 registry and 14 synthesized, non-empty unique IDs, non-empty titles, and unambiguous classification.
- Valid theory imports now persist in the browser profile and restore on reload. Provenance authenticity remains a separate review requirement; no authoritative theory records were fabricated or bundled.
- Updated the service-worker cache version and precache list for the validator.
- Updated the Pages workflow to test and package the new runtime asset.

The current curriculum remains 20/96 authored drafts, 76/96 specified-only, 0 reviewed, and 0 published. This is an implementation milestone, not a declaration that the programme is complete. Post-merge GitHub Actions and live Pages deployment results must be checked before calling this release accepted.
