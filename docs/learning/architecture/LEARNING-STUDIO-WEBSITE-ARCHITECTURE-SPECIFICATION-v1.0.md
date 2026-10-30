# Learning Studio — Full Website Architecture Specification

**Document ID:** LS-ARCH-WEB-001  
**Version:** 1.0.0  
**Date:** 2026-10-30  
**Status:** Architecture baseline / implementation specification — not a production acceptance or release authorization  
**System:** AH-AIOS Learning Studio  
**Repository:** https://github.com/hydraporss/ah-aios-react-website  
**Target branch:** docs/learning-studio-architecture-v1.0  
**Base branch:** main  
**Repository default branch:** main  
**Package version observed on main:** 0.3.1  
**Notion authority:** Documentation mirror; GitHub remains authoritative for source code, schemas, tests, workflows, and version history.

---

## 1. Purpose and authority

This specification defines the complete Learning Studio website as an interactive learning platform for the AH-AIOS ecosystem. It translates the current repository state, preserved curriculum requirements, and established project decisions into a functional application contract covering product purpose, learner workflows, curriculum, interface, domain model, services, persistence, assessment, verification, security, deployment, and controlled evolution.

Learning Studio enables learners to understand, operate, engineer, and steward AH-AIOS-related systems through structured courses, lessons, guided practice, assessments, projects, reflection, and evidence-backed demonstrations of capability.

**Product phrase:** Learn. Build. Govern. Create.

This document is a software architecture specification. It does not create or revise AFTER HUMANITY canon, approve curriculum content, certify learner competency, or authorize a production release.

### 1.1 Governing principles

- Structure Before Narrative.
- Truth Before Tradition.
- Consequence Before Claim.
- Learning completion is not the same as demonstrated competency.
- A generated explanation is not an authoritative source.
- A course draft is not approved curriculum.
- A proposed theory record is not an authenticated source record.
- AI may assist learning; it must not silently replace evidence, review, or human judgment.
- Preserve source, interpretation, assessment evidence, verification, and approval as distinct states.
- Develop freely. Distinguish clearly. Canonize deliberately. Verify continuously.

### 1.2 Source-of-truth hierarchy

| Concern | Authority |
|---|---|
| Application source, curriculum data, schemas, tests, workflows, releases, version history | GitHub repository |
| Architecture specifications, decision records, implementation inventories, review notes | Notion documentation mirror |
| Runtime learner profile and progress in the current release | Validated browser-local data |
| Curriculum source statements and theory provenance | Explicit source records and their traceable repository references |
| Curriculum review and publication | Explicit authorized review and publication records |
| Learner achievement | Assessment evidence and defined competency criteria; not a UI badge alone |

Notion must derive from and remain aligned with GitHub. A Notion copy does not override a repository file. A Git commit does not itself approve a curriculum item or establish canon.

### 1.3 Evidence labels

This specification distinguishes:
- **Current implementation:** supported by the inspected main-branch README, package manifest, and recorded verification evidence.
- **Existing content status:** status reported by the current repository documentation.
- **Target requirement:** behavior the complete application must provide.
- **Proposed extension:** a capability requiring design, implementation, or approval before it can be treated as existing.
- **Not implemented:** an explicit boundary that must not be represented as available.

---

## 2. Product definition and scope

Learning Studio is the primary root website in the connected repository. It is an interactive learning platform for the AH-AIOS ecosystem.

### 2.1 Learning domains

The programme comprises three technical domains and one cross-cutting stewardship dimension:

1. **AH-AIOS Core — 6 courses:** system orientation, architecture and boundaries, identity and access, security and policy, audit and evidence, governance and controlled change.
2. **AI Harness — 7 courses:** model and agent concepts, tools and connectors, API integration, workflow orchestration, evaluation, reliability, safe operation and human oversight.
3. **WorldForge — 8 courses:** knowledge representation, entity and relationship modeling, sources and claims, evidence, provenance, canon lifecycle, version history, worldbuilding and continuity, trust and risk.
4. **Human Stewardship — 3 cross-cutting courses:** critical thinking, evidence assessment, uncertainty, responsible use, review practices, operational accountability, and change discipline.

Human Stewardship is a cross-cutting learning dimension, not a fourth technical application domain.

### 2.2 Curriculum scale and status

The source programme map defines **24 courses and 96 lesson units**:
- 6 AH-AIOS Core
- 7 AI Harness
- 8 WorldForge
- 3 Human Stewardship

The current main-branch README reports 20 authored drafts, 76 specified-only, 0 reviewed, and 0 published. These figures describe content authoring/review status, not learner completion. Earlier branch-specific verification snapshots reported different draft counts; the current main-branch README is the controlling status source until reconciled by a new repository inspection.

The nine interactive starter modules are a separate functional starter experience. They must not be misrepresented as the complete 24-course programme. Curriculum blueprint records and published interactive learning modules must remain distinguishable.

### 2.3 Included scope

- Responsive learning dashboard and navigation.
- Curriculum catalogue and 24-course / 96-lesson programme map.
- Course and lesson readers.
- Learning objectives and prerequisite presentation.
- Guided examples, exercises, knowledge checks, and feedback.
- Practice labs and integrated project briefs.
- Local curriculum-grounded tutor.
- Learner profile and portfolio.
- Progress persistence and JSON import/export.
- Competency and assessment evidence views.
- Local completion summaries and printable completion documents where currently supported.
- Knowledge Library and Theory Explorer import gate.
- 3-Day AI Engineering Sprint with 15 task controls.
- Governance AI capstone learning path.
- PWA manifest and service-worker app-shell caching.
- Automated curriculum, data-integrity, deployment, and browser smoke checks.

### 2.4 Explicit exclusions in the current release

The following must not be represented as implemented:
- User accounts, authentication, or multi-user roles.
- Shared backend or cloud database.
- Cloud progress synchronization.
- Live AI model connection or a remotely powered AI Tutor.
- Official credential issuance or externally verified certificates.
- Authenticated or complete 82-Theory source provenance.
- Full authored, reviewed, and published content for all 24 courses / 96 lessons.
- Production acceptance based solely on passing automated tests.

Supabase and a remote database are not part of the current local-first release architecture. Any future remote service requires a separately approved architecture change, privacy/security review, migration plan, and acceptance gate.

---

## 3. Users and learning journeys

### 3.1 User roles

The current application is a local, single-learner experience. The following roles describe product needs and future authorization boundaries; they do not imply an existing account system.

- **Learner:** browses curriculum, studies lessons, completes exercises, records progress, and assembles portfolio evidence.
- **Curriculum author:** prepares course and lesson content with source references and learning objectives.
- **Reviewer:** evaluates content accuracy, evidence, pedagogy, assessment quality, and safety boundaries.
- **Curriculum publisher:** authorizes publication after required reviews.
- **System maintainer:** maintains application code, schemas, tests, releases, and recovery procedures.

Where no authenticated identity exists, the interface must not claim that a role has been securely authenticated. Local profile labels are display metadata, not identity proof.

### 3.2 Core learner journey

1. Open the Learning Studio dashboard.
2. Review learning domains, curriculum map, and current progress.
3. Select a course and inspect its outcomes, prerequisites, references, and content status.
4. Open a lesson and study its explanation, examples, and source references.
5. Complete a guided activity.
6. Complete an independent exercise or lab.
7. Submit a knowledge check and receive a result with rationale.
8. Save a learning artifact to the portfolio.
9. Review progress and competency evidence.
10. Export a progress package for backup or transfer.
11. Import a previously exported package only after validation.
12. Continue learning without falsely treating completion as formal certification.

### 3.3 Authoring and publication journey

1. Define course scope and intended competency.
2. Define lesson outcomes and prerequisite knowledge.
3. Attach approved source references.
4. Draft explanation, examples, guided activity, independent exercise, assessment, feedback, and safety boundary.
5. Run structural, source-reference, and quality checks.
6. Submit for subject-matter and instructional review.
7. Resolve reviewer findings.
8. Approve publication through an explicit controlled action.
9. Publish a versioned content record.
10. Preserve previous versions and review history.

The authoring/publishing workflow is a target capability and must not be confused with the current learner-facing local application.

---

## 4. Curriculum and instructional architecture

### 4.1 Four dimensions of learning

| Dimension | Learner develops |
|---|---|
| Conceptual understanding | Vocabulary, architecture, principles, and system relationships |
| Operational capability | Ability to use workflows, tools, and documented procedures |
| Engineering capability | Ability to design, implement, test, and improve system components |
| Stewardship capability | Ability to preserve integrity, assess evidence, govern change, and act accountably |

### 4.2 Competency levels

- **L0 — Orientation:** recognizes core terms, purpose, boundaries, and learning resources.
- **L1 — Foundation:** explains concepts and follows guided examples.
- **L2 — Applied:** performs bounded tasks and produces working artifacts with guidance.
- **L3 — Independent:** completes defined tasks, tests outcomes, and explains trade-offs.
- **L4 — Stewardship / Advanced:** designs or reviews systems, handles exceptions, and demonstrates accountable governance.

These are learning proficiency levels. They do not replace WorldForge architecture maturity levels, AH-AIOS production gates, or security assurance.

### 4.3 Required lesson contract

Every lesson must define:
1. What the learner will be able to do.
2. Required prior knowledge.
3. Concepts and references.
4. Guided activity.
5. Independent exercise.
6. Evidence to submit or produce.
7. Assessment criteria.
8. Known limitations and safety boundaries.

A lesson must distinguish source-backed statements from interpretation, examples, hypotheses, and generated explanations.

### 4.4 Lesson quality standard

A complete lesson must include:
- Stable lesson ID and version.
- Course membership and sequence.
- Competency level and prerequisite links.
- Measurable learning outcomes.
- Source references and provenance.
- Accurate explanation with interpretation labels where needed.
- Worked example or demonstration.
- Guided practice.
- Independent practice.
- Knowledge check with answer rationale.
- Feedback and remediation guidance.
- Evidence artifact definition.
- Assessment criteria/rubric.
- Safety, scope, and known limitations.
- Review and publication state.

A short placeholder or lesson title is not a completed lesson.

### 4.5 Assessment model

Assessment should evaluate demonstrated performance, not mere page visits or checkbox completion. The common rubric should cover:
- Conceptual accuracy.
- Application and execution.
- Evidence and source quality.
- Reasoning and explanation.
- Integrity, safety, and governance.
- Reflection and correction.

Course-specific criteria may add domain requirements. A learner may complete a lesson without passing its assessment. A passing knowledge check does not automatically prove advanced operational competency.

### 4.6 Progress and completion semantics

Keep these states separate:
- Not started.
- In progress.
- Submitted.
- Attempt evaluated.
- Passed / needs further practice.
- Course requirements completed.
- Competency evidence reviewed.
- Completion summary generated.

The current browser-local progress state is personal application data. It is not a verified identity, official transcript, accredited credential, or independently authenticated competency record.

---

## 5. Application shell and visual architecture

### 5.1 Design direction

Learning Studio should present a clear, focused learning workspace consistent with AH-AIOS visual identity. It must prioritize curriculum clarity, readable lesson content, progress visibility, and practical work over decorative complexity.

Visual system requirements:
- Consistent global header and navigation.
- Clear domain differentiation without implying separate applications.
- Readable typography and content width.
- Consistent cards, panels, controls, badges, progress indicators, and dialogs.
- Strong visual distinction between draft, specified, reviewed, and published content.
- Clear distinction between learner progress and content publication status.
- Responsive layout and accessible interaction states.
- No fabricated counts, scores, reviews, credentials, or synchronization indicators.

### 5.2 Global shell

The application shell includes:
- Learning Studio identity and product navigation.
- Learner profile display.
- Primary curriculum navigation.
- Current learning context and progress.
- Search and Knowledge Library access where supported.
- Help/documentation access.
- Responsive menu and accessible landmarks.
- Application version and local data status where useful.

The shell must preserve a coherent root experience. WorldForge remains a distinct preserved project area and must not be accidentally mounted as the Learning Studio root runtime.

### 5.3 Primary functional areas

The application capability registry should expose the following functional areas. Exact route names are implementation details and must be taken from the actual route/navigation registry rather than invented by this specification.

1. **Dashboard:** learning overview, resume action, domain entry points, progress summary, recent activity.
2. **Curriculum Map:** all 24 courses and 96 lesson units, domain grouping, level, status, and prerequisites.
3. **Course Catalogue:** searchable/filterable course cards and course details.
4. **Lesson Reader:** outcomes, content, references, examples, activities, checks, and lesson navigation.
5. **Practice and Labs:** interactive task execution, submission, feedback, and saved artifacts.
6. **Assessments:** knowledge checks, graded responses, rationales, and results.
7. **Learning Projects:** integrated project briefs, milestones, evidence requirements, and capstone tasks.
8. **Knowledge Library:** curated learning references and discoverable supporting material.
9. **Theory Explorer:** structured 82-Theory import/inspection boundary, with provenance and completeness warnings.
10. **Local Tutor:** retrieval/explanation from bundled curriculum content only; disclose that it is not a live AI service.
11. **Learner Portfolio:** saved artifacts, reflections, project work, and evidence links.
12. **Profile and Progress:** local learner display preferences, progress summaries, import/export, and reset controls.
13. **Competency and Completion:** evidence-derived results and printable local completion summaries, clearly marked non-official.
14. **Engineering Sprint:** 3-day / 15-task guided checklist and Governance AI capstone structure.
15. **System and Help:** version, data integrity, local storage, verification status, user guide, and support references.

These are functional capability areas, not a claim that the current interface already exposes 15 separate sidebar links. The actual navigation registry remains the implementation authority.

### 5.4 Interaction requirements

Every visible control must:
- Navigate to a real destination, or
- Perform a documented operation, or
- Be visibly disabled/marked as unavailable with an explanation.

No decorative button may imply a successful save, import, assessment, sync, AI response, publication, or certificate issuance when no such operation occurred.

### 5.5 Accessibility and responsive behavior

- Semantic landmarks and headings.
- Keyboard-accessible navigation and controls.
- Visible focus indicators and skip navigation.
- Screen-reader names and state announcements.
- Correct expanded/collapsed state for menus.
- Reduced-motion support.
- Sufficient contrast and non-color status cues.
- Mobile layout without horizontal overflow.
- Usable lesson reading and assessment on narrow screens.
- Error messages associated with the relevant control.
- Manual keyboard, screen-reader, and mobile acceptance in addition to automated checks.

---

## 6. Domain model and data contracts

The data model must separate curriculum definitions, learner activity, assessment evidence, source provenance, and application settings.

### 6.1 Core record families

| Record | Purpose | Key fields / relationships |
|---|---|---|
| CurriculumProgramme | Programme identity and version | programme ID, title, version, domains, status |
| LearningDomain | Technical domain or cross-cutting dimension | domain ID, name, classification |
| Course | Course definition | course ID, domain, title, outcomes, level, prerequisites, status |
| Lesson | Lesson definition | lesson ID, course ID, sequence, objectives, content, references, status |
| LearningObjective | Measurable outcome | objective ID, lesson/course link, action, criteria |
| Activity | Guided or independent practice | activity ID, lesson ID, type, instructions, expected evidence |
| KnowledgeCheck | Assessment definition | check ID, lesson/course ID, questions, scoring rules |
| AssessmentAttempt | Learner attempt | attempt ID, check ID, answers, result, timestamp |
| AssessmentEvidence | Evidence of demonstrated capability | evidence ID, objective/competency link, artifact reference, review state |
| ProjectBrief | Integrated project definition | project ID, outcomes, milestones, deliverables, rubric |
| LearnerProfile | Local learner display/preferences | profile ID, display name, preferences, schema version |
| LearnerProgress | Local completion/activity state | progress ID, course/lesson IDs, state, timestamps |
| PortfolioArtifact | Saved learner work | artifact ID, title, type, content/reference, related objectives |
| CompetencyRecord | Evidence-based capability record | competency ID, level, evidence links, assessment/review status |
| CompletionSummary | Local derived completion view | summary ID, included requirements, issue time, non-official label |
| SourceReference | Citation/provenance metadata | source ID, title, author, URI/path, version/hash, access date |
| TheoryRecord | Imported theory entry | theory ID, title, classification, provenance, validation state |
| ApplicationSettings | Local application preferences | setting key, value, schema version |
| AuditEvent | Significant local changes | event ID, action, target, timestamp, before/after summary |

### 6.2 Identity and references

- Every durable record must have a stable, unique ID.
- References must use IDs rather than display titles alone.
- Orphan references must be detected by integrity validation.
- Duplicate IDs must be rejected.
- Course and lesson ordering must be explicit.
- Imported records must preserve source IDs and source provenance.
- Display labels may change without changing stable identity.
- Content version and learner-progress schema version must be distinct.

### 6.3 Content status model

Curriculum content states must distinguish:
- Specified only.
- Draft.
- In review.
- Needs revision.
- Reviewed.
- Approved for publication.
- Published.
- Superseded.
- Rejected / withdrawn.

Only the explicit publication workflow may move content into Published. A draft in the catalogue is not an approved teaching resource.

### 6.4 Source and interpretation labels

Content statements should be classifiable as:
- Source-backed statement.
- Direct quotation or close paraphrase with reference.
- Interpretation.
- Example or illustration.
- Hypothesis / proposal.
- Generated explanation.
- Unverified statement.

The UI must not collapse these labels into a generic authoritative answer.

### 6.5 Schema registry

The target architecture requires versioned JSON Schemas for programme, domain, course, lesson, activity, assessment, attempt, evidence, project, learner profile, learner progress, portfolio artifact, competency, completion summary, source reference, theory record, settings, and import/export package.

The inspected package manifest and README do not establish that every proposed schema currently exists. The implementation inventory must be verified before marking a schema implemented. Schema changes require versioning, migration rules, compatibility tests, and documented rejection behavior.

---

## 7. Application architecture and layers

The target application is organized into nine layers:

1. **Presentation layer:** React UI, layout, navigation, accessible controls, responsive views.
2. **Learning experience layer:** curriculum navigation, lesson sequencing, activities, tutor presentation, portfolio workflows.
3. **Curriculum domain layer:** programme, domains, courses, lessons, objectives, projects, and content states.
4. **Assessment and competency layer:** checks, attempts, rubrics, evidence, competency evaluation, completion derivation.
5. **Local application services:** progress management, profile, search, import/export, validation, local tutor retrieval.
6. **Persistence and package layer:** versioned browser-local storage, JSON package serialization, backup and restore.
7. **Provenance and audit layer:** source references, content lineage, change history, timestamps, integrity reports.
8. **Delivery and verification layer:** Vite build, automated tests, GitHub Actions, GitHub Pages deployment, release evidence.
9. **Cross-cutting trust, privacy, security, and risk management:** data minimization, truthful status, input validation, recovery, safe AI boundaries, human review.

The layers are logical responsibility boundaries. They do not require nine deployable services or a backend.

### 7.1 Current technology baseline

The inspected main-branch package manifest records:
- React 19.3.
- React DOM 19.3.
- Vite 8.3.
- Playwright 1.64.1.
- pnpm 11.25.0.
- Node.js 24 or later.
- JavaScript ES modules.
- Static production output in dist/.

No additional framework, database, hosted AI provider, or backend should be assumed without repository evidence and an approved change.

### 7.2 Dependency direction

- UI components call application services.
- Application services validate inputs and invoke domain operations.
- Domain operations enforce curriculum and learner-progress rules.
- Persistence adapters serialize only validated records.
- Views derive their state from domain/application data; they must not maintain conflicting shadow copies.
- External/remote adapters remain optional future extensions and are not required by the current local-first architecture.

---

## 8. Local-first persistence, import, export, and recovery

### 8.1 Current persistence boundary

Learner profile and progress are stored in browser localStorage in the current release. The application has no account system, shared backend, or cloud synchronization.

The UI must accurately state that progress is local to the current browser/device context and may be lost if browser storage is cleared or unavailable. It should encourage regular export backups without claiming that a backup was completed until the file operation succeeds.

### 8.2 JSON export package

A progress export should contain:
- Package format identifier and version.
- Export timestamp.
- Application and progress schema versions.
- Learner profile data selected for export.
- Progress records.
- Assessment attempts/results included by policy.
- Portfolio artifacts included by policy.
- Stable IDs and references.
- Integrity metadata/checksum where supported.

The package must not silently include secrets, API keys, authentication tokens, or unrelated browser data.

### 8.3 Import validation

Import must be transactional:
1. Read the selected file.
2. Parse JSON safely.
3. Validate package format and supported version.
4. Validate required top-level fields.
5. Validate every record against its schema.
6. Validate IDs, uniqueness, enumerations, and references.
7. Check nested collection types and boolean/number constraints.
8. Detect unsupported future versions.
9. Produce a preview of records and conflicts.
10. Require explicit confirmation before replacement or merge.
11. Preserve a recoverable prior export where feasible.
12. Apply only after all required checks pass.
13. Read back and verify the persisted result.
14. Report exactly what was imported, skipped, or rejected.

Invalid input must not partially overwrite existing learner progress.

### 8.4 Recovery

- Provide a clear export/backup workflow.
- Confirm before destructive reset.
- Keep import validation separate from mutation.
- Provide actionable recovery errors.
- Never promise recovery from data that was never exported.
- Test corrupted JSON, truncated files, duplicate IDs, missing fields, invalid types, unsupported versions, and reference mismatches.

### 8.5 Future synchronization

Cloud accounts, remote storage, multi-device sync, and conflict resolution are future proposals only. They require explicit product approval, security/privacy design, data ownership rules, identity and authorization, migration/backfill strategy, conflict semantics, backup/restore design, and a separate acceptance gate. They are not part of this release baseline.

---

## 9. Local curriculum tutor and AI boundaries

The current Local Tutor answers from bundled curriculum content. It is not connected to a live AI model.

Required behavior:
- State clearly that answers are grounded in the local curriculum package.
- Do not claim web research, live model reasoning, or remote inference.
- Prefer answers traceable to available lesson/source content.
- Indicate when the local material does not contain an answer.
- Distinguish source-backed information from explanation or interpretation.
- Avoid inventing missing theory records or citations.
- Provide links back to relevant lessons and references where available.
- Do not claim a tutor response is reviewed curriculum or an authoritative canon decision.

A future live AI Tutor would require a separately approved provider, data-flow and privacy assessment, credential handling, model/tool policy, source retrieval, evaluation, monitoring, failure handling, and human oversight. API keys must never be placed in public client-side source code.

---

## 10. Knowledge Library and 82-Theory import boundary

The Theory Explorer is governed by a strict import boundary.

Expected dataset structure:
- 82 records total.
- 68 registry records.
- 14 synthesized records.

Structural validation must check:
- Exact expected count.
- Correct 68/14 classification.
- Unique IDs.
- Required titles.
- Required fields and valid types.
- Valid references and supported record version.

**Critical limitation:** structural validity does not authenticate provenance, source correctness, completeness, or authority. The authoritative 82-Theory dataset is not currently bundled or authenticated by the inspected README. Missing records must not be fabricated to satisfy the expected count.

The interface must display the difference between:
- Dataset structure validated.
- Source provenance verified.
- Content reviewed.
- Content approved for use.

These are separate checks and must not be represented by one green checkmark.

---

## 11. Integrated projects and Engineering Sprint

### 11.1 Project architecture

Integrated projects connect learning outcomes across multiple courses. Each project should define:
- Project ID and version.
- Problem statement.
- Required prior learning.
- Learning outcomes.
- Scope and constraints.
- Milestones.
- Required deliverables.
- Evidence requirements.
- Assessment rubric.
- Safety and credential boundaries.
- Review and completion state.

### 11.2 3-Day AI Engineering Sprint

The existing learning experience includes:
- Three-day task track.
- Fifteen persistent task checkboxes.
- Live completion indicator.
- Governance AI capstone structure and acceptance criteria.
- API-key hygiene guidance.

Sprint checklist completion is not proof that the capstone has been implemented, deployed, secured, or verified. The application must distinguish checklist progress from artifact evidence and technical acceptance.

### 11.3 Governance AI capstone

The capstone should teach the learner to specify, build, test, and explain a governed AI workflow. Its learning evidence should include design, implementation artifacts, test results, risk analysis, source references, and a reflection on human oversight. The learning plan does not provision API credentials, call a live model, or deploy the capstone automatically.

---

## 12. Search, navigation, and derived views

- Search must operate on the curriculum and library records actually available in the local package.
- Filters must reflect real domain, level, status, and content type values.
- Search results must open the matching course, lesson, project, or source.
- Dashboard counts must be derived from current records.
- Progress charts and summaries must be derived from learner progress data.
- Competency summaries must be derived from assessment evidence and defined criteria.
- No placeholder counts or sample activity may be presented as live learner history.
- Empty states must guide the learner toward valid next actions.

---

## 13. Security, privacy, and trust requirements

### 13.1 Current threat boundaries

The current release is a browser-local application without accounts or a remote backend. It still requires careful handling of untrusted imported JSON, browser storage, content rendering, and future credentials.

### 13.2 Minimum controls

- Validate all imported data before mutation.
- Render untrusted content safely; avoid unsafe HTML injection.
- Do not store API keys or passwords in learner progress.
- Do not expose credentials in client bundles, repository files, or logs.
- Keep dependency versions locked and review dependency changes.
- Apply least privilege to GitHub workflows and deployment tokens.
- Avoid collecting personal information not required for learning.
- Explain local storage and backup limitations.
- Require confirmation for reset and destructive operations.
- Preserve data integrity and provide useful failure messages.
- Separate content publication authority from ordinary learner access.

### 13.3 Privacy disclosures

The current application should explain:
- What profile/progress information is stored.
- That it is stored locally in the browser.
- How to export or reset it.
- That there is no cloud sync in the current release.
- That the local tutor does not connect to a live AI model.
- That local completion summaries are not official credentials.

---

## 14. Data integrity and automated verification

### 14.1 Verification layers

1. **Static validation:** syntax, required files, package consistency, schema validity.
2. **Unit tests:** curriculum records, progress state, scoring, validation, serialization.
3. **Integration tests:** course-to-lesson references, assessment-to-objective references, portfolio workflows, import/export.
4. **Browser smoke tests:** navigation, course reader, lab, tutor, profile, progress, and responsive interactions.
5. **Accessibility checks:** semantic landmarks, keyboard access, focus, labels, reduced motion; manual screen-reader acceptance remains required.
6. **Build verification:** clean install and production build.
7. **Deployment verification:** deployed artifact availability and root path correctness.
8. **Recovery verification:** export/import round-trip and invalid-import non-mutation.

### 14.2 Required integrity invariants

- All course IDs are unique.
- All lesson IDs are unique.
- Every lesson references an existing course.
- Course and lesson ordering is deterministic.
- Every required learning objective has a valid owner.
- Every assessment references valid course/lesson/objective records.
- Every learner-progress reference resolves to a known course or lesson.
- Imported progress uses supported schema versions.
- Assessment answers have valid types and allowed values.
- Portfolio artifacts retain stable identity and relevant links.
- Theory import count and classification are exact when validating the 82-record package.
- No invalid import mutates current state.
- Derived progress and completion summaries reconcile with source records.
- No unapproved curriculum content is labeled published.
- No local completion summary is represented as an official credential.

### 14.3 Current verification commands

The inspected package manifest defines:
- pnpm install --frozen-lockfile
- pnpm test
- pnpm build
- pnpm preview
- pnpm test:browser
- pnpm test:worldforge
- pnpm test:e2e

The exact scripts are defined in package.json and must remain the command authority. A passing CI run proves only the checks actually executed; it does not replace manual browser, accessibility, content, or production acceptance.

### 14.4 Required automated test coverage

- Curriculum counts: 6 / 7 / 8 / 3 and total 24.
- Lesson count and course membership: 96 total.
- Blueprint versus interactive starter-module distinction.
- Course/lesson navigation and reader loading.
- Assessment scoring and rationale.
- Progress update and persistence.
- Portfolio artifact save/load.
- Local tutor source-boundary behavior.
- Profile display and persistence.
- JSON export/import round-trip.
- Invalid import rejection without mutation.
- Nested collection and type validation.
- Theory 82 / 68+14 import validation.
- Search and filters.
- Mobile menu and accessibility states.
- Service-worker cache versioning and safe cache cleanup.
- Production build and deployed route behavior.

---

## 15. PWA and offline behavior

The current application includes a web app manifest and service-worker app-shell caching. Offline reopening is expected only after a successful first load and within browser/service-worker limitations.

The application must:
- Version its cache.
- Invalidate stale app-shell assets safely.
- Cache only intended Learning Studio resources.
- Avoid deleting unrelated applications' caches.
- Handle unavailable network resources honestly.
- Avoid claiming all lessons or datasets are offline-ready unless they are actually cached.
- Be tested for installation and offline behavior in supported browsers and devices.

Manual PWA installation and offline acceptance remain separate from the existence of a manifest or service-worker file.

---

## 16. GitHub repository and delivery architecture

### 16.1 Repository identity

- Current repository: hydraporss/ah-aios-react-website.
- Root application: Learning Studio.
- Package name: learning-studio.
- Package version observed on main: 0.3.1.
- Default branch: main.
- Intended repository rename: learning-studio, subject to separate GitHub repository-setting action and verification.

The repository rename is not performed by this specification.

### 16.2 Branch and preservation rules

- main is the current root application baseline.
- The documentation change is isolated on docs/learning-studio-architecture-v1.0.
- Existing learning branches and historical WorldForge preservation branches must not be overwritten.
- WorldForge source assets and preserved project material remain separate from the Learning Studio active runtime.
- Review and compare branches before merging.
- Never force-push or rewrite history as a routine documentation operation.
- Do not merge, approve, or deploy solely because this specification was created.

### 16.3 CI/CD contract

The delivery pipeline should:
1. Check out the intended branch and commit.
2. Install locked dependencies.
3. Run automated tests.
4. Run syntax/static validation where defined.
5. Build the production application.
6. Preserve test/build evidence.
7. Deploy only from the authorized branch and workflow.
8. Verify the deployed site and expected entry route.
9. Record commit SHA, workflow run, artifact, and deployment result.

GitHub Actions is the automation authority. Notion records the links and evidence; it does not replace the workflow result.

### 16.4 Documentation layout

Target documentation location:

- docs/learning/architecture/LEARNING-STUDIO-WEBSITE-ARCHITECTURE-SPECIFICATION-v1.0.md

Related source documentation should include:
- Curriculum and competency framework.
- Curriculum source inventory and content status.
- Data contracts and schema registry.
- Import/export and recovery specification.
- Assessment and evidence model.
- Accessibility and UX acceptance.
- Verification matrix.
- Deployment and release runbook.
- Change log and implementation roadmap.

The above are documentation requirements; their existence must be checked before claiming they are all present.

---

## 17. Release gates and acceptance

Learning Studio must move through explicit gates. A passing build alone is not production acceptance.

### Gate A — Repository and source integrity
- Main branch and protected project history identified.
- Dependency lockfile and source tree verified.
- Learning Studio / WorldForge separation preserved.
- Documentation and code references reconcile.

### Gate B — Curriculum integrity
- 24 courses and 96 lessons reconcile with the approved programme map.
- Domain distribution is correct.
- Source references and content statuses are explicit.
- No fabricated theory records or invented sources.
- Draft, specified, reviewed, and published states are accurate.

### Gate C — Functional workflows
- Course catalogue and reader work.
- Activities, labs, checks, and feedback work.
- Local tutor boundary is disclosed.
- Profile, progress, and portfolio work.
- Export/import is lossless within its defined scope.

### Gate D — Data integrity and recovery
- Schema validation passes.
- Referential integrity passes.
- Invalid imports do not mutate stored data.
- Backup/export and restore tests pass.
- Recovery instructions are usable.

### Gate E — Accessibility and device acceptance
- Keyboard-only acceptance.
- Screen-reader review.
- Responsive mobile/tablet/desktop acceptance.
- Cross-browser review.
- PWA install and offline behavior acceptance.

### Gate F — Security and privacy
- Imported content and storage boundaries reviewed.
- No exposed secrets.
- Privacy disclosures accurate.
- Dependency and workflow permissions reviewed.
- Future AI/backend boundaries documented.

### Gate G — Production readiness and release authorization
- Required CI checks pass.
- Production build is reproducible.
- Deployment target and root route are verified.
- Release notes, version, rollback and recovery instructions exist.
- Authorized human release approval recorded.

A gate may be Not Started, In Progress, Blocked, Passed, or Accepted. Evidence and approver must be recorded. No gate may be marked passed solely by inference.

---

## 18. Roadmap

### Phase 1 — Baseline and integrity
- Reconcile current repository source and documentation.
- Lock the curriculum catalogue and status model.
- Verify learner progress and import/export invariants.
- Complete schema inventory and missing schema work.
- Preserve local-first operation.

### Phase 2 — Complete learning experience
- Complete course and lesson authoring.
- Add worked examples, activities, and rubrics.
- Review source references and technical accuracy.
- Improve course sequencing and remediation.
- Distinguish curriculum blueprint from published interactive content.

### Phase 3 — Evidence and competency
- Strengthen project evidence capture.
- Add consistent competency mapping.
- Improve portfolio review and assessment records.
- Keep local completion summaries non-official unless a separate credential authority is approved.

### Phase 4 — Acceptance and operational readiness
- Complete accessibility and cross-browser acceptance.
- Verify PWA installation and offline behavior.
- Verify deployment, recovery, and backup procedures.
- Complete security/privacy review.
- Obtain explicit production release approval.

### Future proposals — Separate approval required
- Authenticated learner accounts.
- Shared backend and multi-device synchronization.
- Live AI Tutor.
- Remote content management and publishing.
- Verified credential issuance.

These future proposals are not current capabilities or implied commitments.

---

## 19. Risks and controls

| Risk | Control |
|---|---|
| Curriculum draft mistaken for approved instruction | Explicit content lifecycle and visible status |
| Nine starter modules mistaken for 24-course completion | Separate starter experience and curriculum blueprint |
| Human Stewardship treated as a fourth technical domain | Model it as a cross-cutting dimension |
| Theory records fabricated to satisfy count | Strict import gate and provenance requirement |
| Local progress mistaken for cloud-synced data | Explicit local-only disclosure |
| Local Tutor mistaken for live AI | Clear tutor boundary and source-limited behavior |
| Checkbox completion mistaken for capstone implementation | Separate checklist, artifact, and technical acceptance |
| Invalid import corrupts learner state | Transactional validation and non-mutation tests |
| Lesson completion mistaken for competency | Evidence-based assessment model |
| Local completion summary mistaken for credential | Non-official labeling and no accreditation claims |
| WorldForge runtime mixed into Learning Studio | Repository/runtime separation and preservation rules |
| Passing CI mistaken for production acceptance | Explicit gates and manual acceptance evidence |

---

## 20. Change control and synchronization

- This specification is versioned independently of application releases.
- GitHub is the source-code authority.
- Notion is the documentation and project-record mirror.
- Notion changes must cite the GitHub path, branch, version, and commit SHA.
- Implementation changes affecting curriculum, schemas, progress, assessment, persistence, accessibility, security, or deployment require corresponding tests and documentation updates.
- Material discrepancies must be recorded and reconciled.
- Existing source and historical records must be preserved.
- Proposed features remain proposed until implemented and verified.
- No documentation update silently changes curriculum authority or canon status.

**Architecture directive:** Learn with structure. Build with evidence. Govern with integrity. Verify continuously.
