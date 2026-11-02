Product summary — generated 31 October 2026 — from the combined archive: WorldForge (20 files) + AI Harness (9 files) + AH-AIOS Core (15 files) = 44 files.
## 1. Overview
This record is the product summary for the complete, combined archive of the three AH-AIOS core domains: WorldForge, AI Harness, and AH-AIOS Core. The packages were combined into a single archive (WorldForge-AIHarness-AH-AIOS-Core-Complete.zip) on 31 October 2026. The archive delivers a set of static web assets plus the AH-AIOS backend command framework.
The three domains map to the AH-AIOS ecosystem as follows: WorldForge supplies structured-world, source, claim, relationship, and governance learning; AI Harness supplies AI integration, orchestration, tooling, evaluation, and reliability subjects; AH-AIOS Core supplies the foundation (commands, governance, models, CLI, versioning, tests).
## 2. Package inventory

## 3. WorldForge package (20 files)
- Static web app shell: index.html, css/style.css
- Data: data/prompts.json, data/templates.json
- Prompt builder: js/prompt-builder.js, js/prompt-builder.test.js
- Schemas: schemas/prompt.schema.json, template.schema.json, validation.schema.json
- Backend command framework (shared with AI Harness): ah_webapp/commands.py, batch1_handlers.py, models.py, governance.py, main.py, admin.py, auth.py, wof_integration.py, __init__.py, requirements.txt, requirements-dev.txt
## 4. AI Harness package (9 files)
- Static web app shell: ah_webapp/app/static/index.html, css/style.css
- Prompt builder: js/prompt-builder.js, js/prompt-builder.test.js
- Schemas: schemas/prompt.schema.json, template.schema.json, validation.schema.json
- Data: data/templates.json, data/prompts.json
## 5. AH-AIOS Core package (15 files)
- Backend command framework: ah_webapp/commands.py, batch1_handlers.py, requirements.txt, __init__.py, governance.py, main.py, models.py
- CLI entry points: hermes_cli.py, hermes.py, VERSION, README.md
- Tests: tests/test_batch1_read_only.py, tests/test_phase1_vertical_slice.py, tests/test_phase1_vertical_slice_optimized.py
## 6. Combined archive
- File: WorldForge-AIHarness-AH-AIOS-Core-Complete.zip
- Total files: 44
- Size: 357,876 bytes (350.6 KB)
- Integrity: testzip() = None (no corruption)
## 7. Relationship and boundaries
- AH-AIOS has three distinct domains: AH-AIOS Core, AI Harness, and WorldForge. AFTER HUMANITY is the intellectual authority behind the ecosystem.
- The combination is a delivery mechanism, not a merge of governance authority. Each domain retains its own status, versioning, and verification state.
- Canon status, proposal status, implementation status, verification status, deployment status, and production readiness must remain explicit and never silently conflated.
## 8. Key constraints
- WorldForge: do not treat a draft proposal or a specified-content outline as an approved or published artifact; preserve provenance and version history.
- AI Harness: no live AI model is connected in the current local tutor; do not represent local tutor output as a live AI service.
- AH-AIOS Core: local learner data is not authenticated identity; browser localStorage is not cloud synchronization or authenticated recordkeeping.
- All domains: a test is passed only when its result has been observed or recorded; the existence of a test file is not proof that the test passed.
## 9. Source reference
- Combined archive: WorldForge-AIHarness-AH-AIOS-Core-Complete.zip
- Source packages: WorldForge-Package.zip, AI-HARNESS-Package.zip, AH-AIOS-Package.zip
- Document: LearningStudio-Complete-System-Architecture-Specification.md (LS-ARCH-WEB-001)
- Notion parent register: AH-AIOS / WorldForge — Cross-Workspace Alignment Register