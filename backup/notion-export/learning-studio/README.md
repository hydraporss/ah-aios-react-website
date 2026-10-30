<!-- Notion source page 40966662-b29d-8173-b04a-f2e3790e018a; original path learning-studio/README.md; export date 2026-10-30 -->

<b>Repository:</b> [hydraporss/ah-aios-react-website](https://github.com/hydraporss/ah-aios-react-website)

<b>Branch:</b> `learning-studio-0.2.0`

<b>Path:</b> `learning-studio/README.md`

<b>Git blob SHA:</b> `405021e4d382d830be8d2c0e7eec874b649201ef`

<b>Export:</b> Complete fetched UTF-8 source content follows.

---

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

Serve this directory on [localhost](http://localhost) or HTTPS. Example: `python -m http.server 8000`, then open `http://localhost:8000`. Opening the HTML file directly disables service workers.

## Independent deployment

Copy the contents of this folder to the root of a new GitHub repository. Copy the included Pages workflow to `.github/workflows/pages.yml` at that repository root. Enable GitHub Actions as the Pages source in repository Settings → Pages.

## Data and limitations

Learner progress/profile are stored in local browser storage. There is no login, backend, cloud sync, or real AI service. The 82-Theory Explorer is empty until the authoritative source registry is imported. Count/field validation does not authenticate provenance. Course materials are a starter curriculum based on the accessible AH-AIOS architecture descriptions; they do not replace an unavailable approved curriculum specification.

- <b>3-Day AI Engineering Sprint:</b> Git/GitHub, Python + AI API integration, and testing/CI/CD. Fifteen task checkboxes persist locally and show completion progress.
- Capstone blueprint for a Governance AI application with evidence, approvals, auditability, tests, and deployment checks.
