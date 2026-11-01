# Learning Studio — Data Dictionary (as inspected)
## Browser storage (localStorage; per browser, not synced)
| Key | Content | Validation |
|---|---|---|
| ah-aios-learning-studio-progress-v2 | `{schema:"ah-aios-learning-progress", version, completed[], checks, portfolio[], labs, activity[], updatedAt, ...}` | `validate()` in app.js; invalid data falls back to blank state; import rejects duplicate/unknown IDs |
| ah-aios-learning-profile-v1 | Display name / profile | Not independently reviewed |
| ah-aios-learning-theories-v1 | Array of theory records (exactly 82) | `validateTheoryCollection`; explorer treats corrupt JSON as empty |
| ah-aios-learning-workbench-v1 | `{schema:"ah-aios-learning-workbench", version:1, lessons:{"<courseId>/<lessonId>":{text,status}}, audit:[{when,role,action,target,detail}]}` (audit capped at 500) | `AHWorkbench.load`: wrong schema/version/corrupt JSON → blank |
(sessionStorage `ah-ls-role` holds the selected role.) Lesson ids are course-scoped (`AH-CORE-100/M1.1`) because lesson ids repeat across courses. Overlay statuses: Specified, Authored draft, Reviewed, Published; transitions enforced in code.
Device/browser-local only; clearing site data erases progress; export JSON for backup.

## Curriculum (curriculum-data.js)
Top level: schema, version, source (AH-LEARN-MASTER-001 v0.1.0, status SUGGESTION / PROCESS), courseCount 24, lessonCount 96, courses, contentStates, sourceCatalog (24), projects (5), assessmentFramework.
Course: id, title, domain, outcome, lessons[], assessment, contentStatus, publicationStatus, sourceRefs.
Lesson: id, title, exercise, status; optional `content` (purpose, outcomes, prerequisites, sourceBase, explanation, workedExample, ...) present for 20 "Authored draft" lessons. 76 are "Specified" only. None reviewed or published.

## Theory record (required by validator)
`id` (unique non-empty string), `title` (non-empty string), exactly one of `origin`/`collection` = `registry` | `synthesized`. Totals 68 + 14 = 82. Optional relationship fields read by explorer: `relationships`, `related`, `relatedTheories` (ids). Authoritative records are NOT in this bundle; their full schema is undocumented here and must not be assumed.

## Flask backend (separate)
Models in optional-flask-backend/ah_webapp/models.py, including User, World, Character, AuditLog, ChangeProposal, ApprovalDecision, Workspace, Entity, Source, Claim, Evidence, Review, Decision, KnowledgeVersion, AuditEvent, WorkflowRun. Not mapped to Learning Studio data; no Learning Studio enrolment, assessment or competency tables exist.
