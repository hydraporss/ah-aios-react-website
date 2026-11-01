# Learning Studio — Requirements Traceability Register
Source: LS-IMPL-HANDOFF-001 §5, §18; LS-WB-ARCH-001. Date: 2026-11-01. Bundle is not a git checkout.
Status vocabulary (handoff §3.3/§21): EXISTS, PARTIAL, MISSING, UNVERIFIED, VERIFIED, BLOCKED. VERIFIED = passed an executed test recorded here. Specifications are not implementation.

## Data and canon
| ID | Requirement | Location | Status | Evidence / notes |
|---|---|---|---|---|
| LS-DATA-001 | 24 courses; 6/7/8/3 by programme | learning/curriculum-data.js | VERIFIED (data) | tests/integrity.test.js (pass) |
| LS-DATA-002 | 96 lesson units, declared = actual | same | VERIFIED (data) | same |
| LS-DATA-003 | Lesson status distinction | same | VERIFIED (counts) | 76 Specified only, 20 Authored draft, 0 reviewed, 0 published |
| LS-DATA-004 | 82 theories (68 registry + 14 synthesized) preserved | none in bundle | BLOCKED | Records not supplied. Data-import gap; canon unchanged; nothing invented |
| LS-DATA-005 | Theory import validation (count, split, unique ids) | learning/theory-validation.js | VERIFIED (structure only) | tests with synthetic fixtures; does not prove provenance |
| LS-DATA-006 | Progress import validation / versioned storage | learning/app.js (KEY ...-progress-v2) | UNVERIFIED | Pre-existing; not independently tested here |

## Learner Workbench (handoff §5.1)
| ID | Module | Location | Status | Notes |
|---|---|---|---|---|
| LS-FR-001 | Home Dashboard | learning/index.html #home | EXISTS, UNVERIFIED | Not browser-tested beyond load |
| LS-FR-002 | My Learning | #courses, #continue-grid | EXISTS, UNVERIFIED | Progress covers 9 legacy primers only |
| LS-FR-003 | Learning Paths | #paths | EXISTS, UNVERIFIED | |
| LS-FR-004 | Programme / Curriculum Map | #curriculum-map | EXISTS; card count VERIFIED (24) | Prerequisite dependencies not verified |
| LS-FR-005 | Course Catalogue (search/filter) | #all-courses, #course-filter | PARTIAL | 24 cards render (VERIFIED); filter untested |
| LS-FR-006 | Course Overview | blueprint card/modal | EXISTS, UNVERIFIED | |
| LS-FR-007 | Lesson Studio | blueprint lesson content | PARTIAL | Content only for 20 draft lessons; per-lesson completion tracking not verified |
| LS-FR-008 | Practice Lab | #labs | EXISTS, UNVERIFIED | Local save only; no external execution |
| LS-FR-009 | Project Studio | #projects | PARTIAL | Five briefs displayed; no submission workflow verified |
| LS-FR-010 | Assessment Center | #assessments | PARTIAL | Plans only; no formal rubrics/reviewers |
| LS-FR-011 | 82-Theory Explorer | #theories, explorer.js | PARTIAL; search/filter/detail VERIFIED with synthetic fixture | BLOCKED on real data |
| LS-FR-012 | Knowledge Library | #library | EXISTS, UNVERIFIED | |
| LS-FR-013 | AI Tutor | #tutor | PARTIAL | Local rule-based only; no live AI model |
| LS-FR-014 | Competency Center | #competencies | PARTIAL | Tracks 9 primer checks; not formal ratings |
| LS-FR-015 | Learner Portfolio | #portfolio | EXISTS, UNVERIFIED | JSON export/import |
| LS-FR-016 | Learning Analytics | dashboard | PARTIAL | Primer-based only |
| LS-FR-017 | Sprint / Capstone | #sprint | EXISTS, UNVERIFIED | Learner checklist; not build evidence |
| LS-FR-018 | Profile / Data Management | #profile, #settings | EXISTS, UNVERIFIED | Local export/reset |

## Other workbenches and cross-cutting
| ID | Requirement | Status | Notes |
|---|---|---|---|
| LS-FR-020 | Instructor and Content Workbench | PARTIAL; VERIFIED (local) | #instructor in workbench.js: per-lesson draft text, Specified → Authored draft → Reviewed → Published workflow as a browser-local overlay; source curriculum untouched. 8 unit tests + Chromium run. No multi-user review, rubrics, versioning or authoring of courses/assessments |
| LS-FR-021 | Administration and Governance Workbench | PARTIAL; VERIFIED (local) | #admin: integrity checks (24/96, 82-theory status), local audit history, overlay export/clear. No user administration, curriculum governance workflow or system health. Flask backend remains separate and unintegrated |
| LS-SEC-001 | Accounts, roles, permissions | PARTIAL (client-side only) | Role switch (learner/instructor/admin) gates actions in code and UI, tested; any browser user can switch role, so this is NOT authorization. No accounts or server enforcement |
| LS-INT-001 | Live AI Tutor | MISSING | Needs provider, contract and credentials; not implemented |
| LS-FR-030 | Cross-domain search | PARTIAL; VERIFIED (local) | Header search (Enter) covers courses, lessons, projects, theories; theories only after registry import. Not covered: knowledge library, competencies, learning paths. Unit-tested; Chromium result list verified |
| LS-OPS-001 | Deployment at /learning-studio/ | UNVERIFIED | No deployment config found |
| LS-TEST-001 | Unit tests | PARTIAL | 17 tests pass (data, validator, explorer, workbench workflow/roles/search/audit). Progress calculations and import/export not unit-tested |
| LS-TEST-002 | Prior 19-test suite cited in VERIFICATION.md | BLOCKED | Files absent from bundle |
| LS-TEST-003 | CI | UNVERIFIED | ci.yml added, never run on GitHub |
| LS-TEST-004 | Firefox, Safari, screen reader, PWA install | UNVERIFIED | Not tested |
| LS-TEST-005 | Flask test test_batch1_read_only | VERIFIED (fixed 2026-11-01) | Added `from typing import Any, Dict` to batch1_handlers.py on user instruction ("fix it"); full Flask suite 42/42 pass |
| LS-UX-001 | Responsive layout, no horizontal overflow | VERIFIED (Chromium, 390–1920px) | Fixed pre-existing top-bar overflow (was 1510px at 1280) via workbench.css; keyboard/screen-reader not tested |
