# AH-AIOS Learning Studio — 0.3.1

A standalone, responsive learning website inspired by the supplied AH-AIOS Learning dashboard reference.

## Included
- Dashboard navigation: Home, Learning Paths, Courses, Labs, AI Tutor, Assessments, Competencies, Certification Center, Knowledge Library, Profile, Settings, Help.
- Three learning domains and nine starter courses with lessons, exercises, and assessed knowledge checks.
- Local progress dashboard, course filtering, learner activity, portfolio, and JSON progress backup/restore.
- Three interactive practice labs; saved submissions appear in the portfolio.
- Local curriculum tutor (rule-based, no live AI backend or external model connection).
- Competency progress and path completion certificates (print/save as PDF).
- 82-Theory Explorer import gate: exactly 82 records, 68 registry + 14 synthesized, required id/title fields.
- Responsive layouts, PWA manifest, and service worker offline app-shell cache.
- GitHub Pages workflow template in `.github/workflows/pages.yml`.

## Run
Serve this directory on localhost or HTTPS. Example: `python -m http.server 8000`, then open `http://localhost:8000`. Opening the HTML file directly disables service workers.

## Independent deployment
Copy the contents of this folder to the root of a new GitHub repository. Copy the included Pages workflow to `.github/workflows/pages.yml` at that repository root. Enable GitHub Actions as the Pages source in repository Settings → Pages.

## Data and limitations
Learner progress/profile are stored in local browser storage. There is no login, backend, cloud sync, or real AI service. The 82-Theory Explorer is empty until the authoritative source registry is imported. Count/field validation does not authenticate provenance. Course materials are a starter curriculum based on the accessible AH-AIOS architecture descriptions; they do not replace an unavailable approved curriculum specification.

- **3-Day AI Engineering Sprint:** Git/GitHub, Python + AI API integration, and testing/CI/CD. Fifteen task checkboxes persist locally and show completion progress.
- Capstone blueprint for a Governance AI application with evidence, approvals, auditability, tests, and deployment checks.


## Current implementation and content status

This is a static, browser-local prototype. It contains nine starter course records (three per technical domain), three practice labs, a local curriculum tutor (not a live model), local progress/profile storage, JSON progress backup/restore, competency views, printable path-completion certificates, and a source-gated 82-Theory Explorer. It has no account system, backend, cloud learner sync, or live AI service.

The source curriculum on branch `ah-aios-learning-package` specifies 21 specialist courses (6 Core, 7 AI Harness, 8 WorldForge) plus 3 cross-cutting Human Stewardship courses. The current 24-course catalogue presents the full specified programme; content authoring and review remain incomplete. Human Stewardship is not a fourth technical domain. Each full lesson also requires outcomes, prerequisites, source references, worked examples, guided/independent practice, knowledge checks, evidence, feedback, safety boundaries, and review/version lineage. The current compact lesson format remains below that content-complete standard.

Latest automated checks passed on commit `e86b1c72394f5fa9870b38d6cc028b9e3a8ad97e`: https://github.com/hydraporss/ah-aios-react-website/actions/runs/41023671203

The service worker caches the SVG app icon and only cleans up older Learning Studio cache versions. Learner profile name is reflected in the header and certificates. Progress import validates nested records and preserves current data on invalid input.

Manual cross-browser/accessibility and PWA acceptance, full course authoring/review, authoritative 82-Theory data/provenance, and production deployment remain outstanding.


## Curriculum roadmap

The Learning Studio now displays the full source-defined course blueprint from `docs/learning/content-master-plan.md`: 6 AH-AIOS Core courses, 7 AI Harness courses, 8 WorldForge courses, and 3 cross-cutting Human Stewardship courses. Each blueprint entry shows its proposed course ID, target competency level, main evidence, and status **Specified · authoring pending**. Human Stewardship is not a fourth technical domain.

The blueprint is not a claim that all courses have been authored. The interactive catalogue still contains nine starter modules. The full lessons, worked examples, exercises, rubrics, source references, review records, and publication workflow remain to be completed against the source standard.

The roadmap and responsive layout passed CI in run https://github.com/hydraporss/ah-aios-react-website/actions/runs/41024000678.


## Full curriculum catalogue and lesson reader

The application now includes a source-traced interactive catalogue of all 24 courses and 96 lesson units from `docs/learning/content-master-plan.md` (AH-LEARN-MASTER-001 v0.1.0, **SUGGESTION / PROCESS**). It preserves the 6 AH-AIOS Core, 7 AI Harness, 8 WorldForge, and 3 cross-cutting Human Stewardship course structure. Each course opens its four specified lesson topics, source exercises, assessment evidence, and exact source links with Git blob hashes. Each lesson has a working reader and a local response-save path.

Four AH-CORE-100 lesson units have authored drafts with outcomes, prerequisites, source references, interpretation-labeled explanations, worked examples, guided and independent practice, knowledge checks with rationales, assessment evidence, feedback, safety boundaries, and references. The remaining lesson units retain their exact source outlines and are visibly marked **Specified only**; missing explanations, examples, checks, and safety notes are not invented. No lesson is reviewed or published.

Five source-defined integrated project briefs and the common 1–4 assessment framework (seven dimensions and remediation steps) are available in the app. The common rubric does not establish course-specific thresholds or credentials. The nine legacy quick-start primers are labeled separately from the 24-course programme. No authorized credential issuer is configured.

See `VERIFICATION.md` for exact source hashes, CI evidence, and remaining content gaps. The source plan identifies approved technical source references for every lesson as an unresolved input; detailed AI Harness source material is not present in the repository, so those lessons remain specified until approved references are available.


## AH-AIOS Core architecture lessons — 30 October 2026

Four additional source-grounded lesson drafts have been authored for AH-CORE-110 (Architecture and System Boundaries). The drafts cover component responsibilities and separate data paths, documented interfaces/dependencies, browser-local versus server-backed trust boundaries, and the distinction between prototype, backend foundation, acceptance, deployment, and production assurance. They cite the repository README blob recorded in `curriculum-data.js`. The lesson explanations preserve the documented boundary that browser-to-backend acceptance remains unverified. Total authored drafts: 8 of 96; remaining 88 are specified-only. None is reviewed or published.


## AH-CORE-110 authoring milestone

Four source-grounded lesson drafts now cover architecture responsibilities and data paths, component interfaces and dependencies, trust/persistence boundaries, and the distinction between prototype, backend foundation, acceptance, deployment, and production assurance. Source basis: repository README (root `README.md`, blob `4a99342dfed4eab085162f22b464540e5cc99612`). The lesson wording preserves the documented separation between browser-local workflows and the Django Server Governance path, and does not claim browser-to-backend acceptance. These four lessons are authored drafts only; they are not reviewed or published.


## AH-CORE-120 authoring milestone

Four source-grounded lesson drafts now cover identity/authentication/authorization, per-world owner/editor/viewer roles, access-scope and lifecycle gaps, and access-decision evidence. Sources are the root README (blob `4a99342dfed4eab085162f22b464540e5cc99612`) and the WorldForge v0.4 End-to-End Acceptance Record (blob `668b72567dd22501b70b7b186bc9cc11fe39b4d1`). The lessons distinguish documented API session and membership checks from the unauthenticated browser-local demo. The available sources do not define a complete action-by-action role matrix or full membership lifecycle; those remain explicit evidence gaps. All four lessons are authored drafts, not reviewed or published.


## AH-CORE-130 authoring milestone

Four source-grounded lessons now cover project assets and attack surfaces; policy-to-control mapping; untrusted source content and instruction conflicts; and incident recognition, evidence preservation, and escalation. Sources include the learning content-governance policy, WorldForge governance state machine and unit tests, server end-to-end authorization tests, and v0.4 sprint/acceptance notes. The lessons preserve key limitations: no complete formal threat model, no documented AI prompt-injection defense, no complete operational incident-response procedure, and browser-local audit records are not tamper-proof. All four lessons are Authored draft / Not reviewed.



## AH-CORE-130 external source verification — 30 October 2026

Verified three current authoritative references and mapped them to the relevant security lesson drafts: NIST SP 800-61 Rev. 3 (incident response, final April 2025), NIST AI 100-2 E2025 (adversarial machine-learning taxonomy, final March 2025), and the OWASP GenAI / LLM Top 10 2026 (current release, published 4 August 2026). Exact publication metadata, canonical URLs, lesson mappings, and scope limitations are recorded in `AH-CORE-130-SOURCE-VERIFICATION.md` and `curriculum-data.js`.

These external sources support teaching concepts; they do not prove AH-AIOS or WorldForge has implemented the controls they describe. Existing repository evidence and known gaps remain separate. All four AH-CORE-130 lessons remain Authored draft / Not reviewed; no lesson is approved or published.


## Learning Studio 0.3.1 — curriculum quality gate

The current curriculum data contains 24 source-defined courses and 96 lesson units. Twenty lessons are authored drafts across AH-CORE-100, AH-CORE-110, AH-CORE-120, AH-CORE-130, and AH-CORE-140; the other 76 remain **Specified only**. All authored lessons remain **Not reviewed**, and no course is published. The source master plan remains **SUGGESTION / PROCESS**.

A new automated curriculum quality gate checks the 24/96 structure, 6/7/8/3 domain split, required instructional fields for every authored lesson, knowledge-check answer/rationale integrity, specified-only status for the remaining 76 lessons, and the non-promotion of drafts to reviewed or published status. It also protects the AH-CORE-140 authored-draft content and its unreviewed/unpublished state.

This is a verification milestone, not a claim that the Learning Studio is content-complete. Source recovery, the remaining 80 lesson authoring units, independent reviews, manual accessibility/browser/PWA acceptance, and release acceptance remain open.


## Deployment candidate 0.3.0

The application is versioned as 0.3.1. Its deployment packaging is designed to preserve the existing WorldForge site at the repository root and publish Learning Studio separately under `/learning-studio/`. The root Pages workflow now runs both WorldForge governance tests and Learning Studio checks before building one artifact containing both applications. Only the Learning Studio runtime assets are copied to its public subdirectory.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the release layout, operational boundaries, and live acceptance checklist. The application remains browser-local: there is no account system, cloud progress sync, backend learner store, or live AI model connection. Deployment preparation does not mean the programme is content-complete or that the live site has passed acceptance.


## Learning Studio 0.3.1 — AH-CORE-140 and data-integrity milestone

Four source-grounded AH-CORE-140 lesson drafts now cover evidence classification, audit-event traceability, verification criteria and reproducibility, and reporting limitations. Sources include NIST SP 800-53 Rev. 5 (Release 5.2.0 update), NIST SP 800-53A Rev. 5 (Release 5.2.0 update), NIST SP 800-92, and the NIST Log Management Project page. The materials distinguish external guidance from evidence of AH-AIOS implementation. All four lessons remain Authored draft / Not reviewed.

The 82-Theory import now has a dedicated validator. It rejects duplicate IDs, blank IDs/titles, ambiguous registry/synthesized classification, and incorrect 68/14 counts. Successful imports are persisted in the current browser profile and restored on reload. Structural checks do not authenticate provenance; the authoritative source dataset is still not bundled.

CI now runs curriculum quality tests, theory-import validation tests, and deployment asset tests together. The curriculum gate verifies the 24/96 structure, 6/7/8/3 domain split, complete instructional fields for authored lessons, knowledge-check integrity, and that the remaining specified lessons and all review/publication statuses are not silently promoted.

**Current content state:** 20/96 authored drafts; 76/96 specified only; 0 reviewed; 0 published. The full curriculum is not yet complete.
