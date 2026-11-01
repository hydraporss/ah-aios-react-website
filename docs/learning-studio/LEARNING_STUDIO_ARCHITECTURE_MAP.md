# Learning Studio — Architecture Map (as inspected, 2026-11-01)
Maps approved architecture (LS-WB-ARCH-001) to code that actually exists. No module is complete merely because a section exists.

## Runtime
Static HTML/CSS/vanilla JS; no build step, no package.json. Opens from file://; service worker/PWA only over http://localhost or HTTPS.

| Layer | File | Role |
|---|---|---|
| Shell/markup | learning/index.html, styles.css | Single page; sections addressed by anchors |
| Curriculum data | learning/curriculum-data.js | `AH_LEARNING_CURRICULUM` (alias `CURRICULUM_DATA`): 24 courses, 96 lessons, projects, assessmentFramework, sourceCatalog |
| Application logic | learning/app.js | Rendering, 9 legacy primer MODULES, PATHS, progress, portfolio, labs, sprint, local tutor, import/export |
| Theory validation | learning/theory-validation.js | `AHTheoryValidation.validateTheoryCollection` (structural) |
| Theory Explorer | learning/explorer.js | `AHTheoryExplorer`: search, filter, detail, relationships; read-only |
| Offline | learning/sw.js | Cache `ah-aios-learning-studio-0.5.1-v1` |
| Instructor/Admin/Search | learning/workbench.js, workbench.css | `AHWorkbench`: lesson status workflow overlay, role checks, audit log, integrity report, cross-domain search; styles/overflow fix |
| Tests | learning/tests/integrity.test.js, workbench.test.js | node:test (17) |
| CI | .github/workflows/ci.yml | Syntax check + tests (unrun) |

## Workbench mapping
| Workbench | Implementation |
|---|---|
| Learner | learning/ (partial; see traceability) |
| Instructor/Content | Local overlay (workbench.js); partial |
| Administration/Governance | Local integrity/audit/backup panel only (partial). optional-flask-backend/ (Flask 3.1, SQLAlchemy, Flask-Login; models include User, AuditLog, ApprovalDecision, WorkflowRun; blueprints admin/auth/governance/main) serves WorldForge and is unintegrated |

## Sibling components (protected, unmodified)
index.html, hub.html, workbench.html, worldforge-app/, harness/ (prompt builder, schemas), learning/worldforge/ (incl. verified-2026-10-28), docs/.
