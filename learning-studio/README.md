# AH-AIOS Learning — 0.2.0

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

The source curriculum on branch `ah-aios-learning-package` specifies 21 specialist courses (6 Core, 7 AI Harness, 8 WorldForge) plus 3 cross-cutting Human Stewardship courses. The current nine-course catalogue is not the full specified programme. Human Stewardship is not a fourth technical domain. Each full lesson also requires outcomes, prerequisites, source references, worked examples, guided/independent practice, knowledge checks, evidence, feedback, safety boundaries, and review/version lineage. The current compact lesson format remains below that content-complete standard.

Latest automated checks passed on commit `e86b1c72394f5fa9870b38d6cc028b9e3a8ad97e`: https://github.com/hydraporss/ah-aios-react-website/actions/runs/41023671203

The service worker caches the SVG app icon and only cleans up older Learning Studio cache versions. Learner profile name is reflected in the header and certificates. Progress import validates nested records and preserves current data on invalid input.

Manual cross-browser/accessibility and PWA acceptance, full course authoring/review, authoritative 82-Theory data/provenance, and production deployment remain outstanding.


## Curriculum roadmap

The Learning Studio now displays the full source-defined course blueprint from `docs/learning/content-master-plan.md`: 6 AH-AIOS Core courses, 7 AI Harness courses, 8 WorldForge courses, and 3 cross-cutting Human Stewardship courses. Each blueprint entry shows its proposed course ID, target competency level, main evidence, and status **Specified · authoring pending**. Human Stewardship is not a fourth technical domain.

The blueprint is not a claim that all courses have been authored. The interactive catalogue still contains nine starter modules. The full lessons, worked examples, exercises, rubrics, source references, review records, and publication workflow remain to be completed against the source standard.

The roadmap and responsive layout passed CI in run https://github.com/hydraporss/ah-aios-react-website/actions/runs/41024000678.


## Full curriculum catalogue and lesson reader

The application now includes a source-traced interactive catalogue of all 24 courses and 96 lesson units from `docs/learning/content-master-plan.md` (AH-LEARN-MASTER-001 v0.1.0, **SUGGESTION / PROCESS**). It preserves the 6 AH-AIOS Core, 7 AI Harness, 8 WorldForge, and 3 cross-cutting Human Stewardship course structure. Each course opens its four specified lesson topics, source exercises, assessment evidence, and exact source links with Git blob hashes. Each lesson has a working reader and a local response-save path.

Four AH-CORE-100 lesson units currently have authored drafts with outcomes, prerequisites, source references, interpretation-labeled explanations, worked examples, guided and independent practice, knowledge checks with rationales, assessment evidence, feedback, safety boundaries, and references. The remaining 92 lesson units retain their exact source outlines and are visibly marked **Specified only**; missing explanations, examples, checks, and safety notes are not invented. No lesson is reviewed or published.

Five source-defined integrated project briefs and the common 1–4 assessment framework (seven dimensions and remediation steps) are available in the app. The common rubric does not establish course-specific thresholds or credentials. The nine legacy quick-start primers are labeled separately from the 24-course programme. No authorized credential issuer is configured.

See `VERIFICATION.md` for exact source hashes, CI evidence, and remaining content gaps. The source plan identifies approved technical source references for every lesson as an unresolved input; detailed AI Harness source material is not present in the repository, so those lessons remain specified until approved references are available.
