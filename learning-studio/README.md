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
