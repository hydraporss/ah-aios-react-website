# AH-AIOS LEARNING STUDIO
## Complete System Architecture Specification

**Document ID:** LS-ARCH-WEB-001
**Document Title:** AH-AIOS Learning Studio — Complete System Architecture Specification
**Architecture Reference Version:** 1.0.0
**Implementation Reference Version:** 0.3.1
**Specification Version:** 1.1.0 — Comprehensive Architecture
**Date:** 31 October 2026
**System:** AH-AIOS Learning Studio
**Repository:** `hydraporss/ah-aios-react-website`
**Implementation Directory:** `learning-studio/`
**Status:** Proposed Complete Specification — implementation alignment and acceptance verification required

### Document purpose

This document defines the complete system architecture for AH-AIOS Learning Studio. It specifies the system's purpose, scope, components, navigation, curriculum, data, workflows, interfaces, validation, security, deployment, verification, and future development requirements.

It is the architectural reference against which implementation can be developed, inspected, tested, and accepted.

The existing website and its source files remain the implementation reference. This specification does not automatically change the implementation or assert that unimplemented requirements are already operational.

### Architectural governance statement

**Specify deliberately. Implement incrementally. Validate against evidence. Preserve source lineage. Approve explicitly.**

A specification is not an implementation. An implementation is not automatically verified. Verification does not, by itself, authorize publication or establish a credential.

---

# 1. SYSTEM DEFINITION AND PURPOSE

## 1.1 Definition

AH-AIOS Learning Studio is the educational application of the AH-AIOS ecosystem.

It provides a structured environment through which users can learn the system architecture, develop technical skills, practise operational workflows, understand governance constraints, produce learning artifacts, and demonstrate competencies through documented evidence.

The application combines:

- A learning dashboard.
- Structured learning paths.
- A course and lesson catalogue.
- Practical learning laboratories.
- Integrated projects.
- A local curriculum tutor.
- Assessments.
- Competency tracking.
- A certification and completion interface.
- A knowledge library.
- Learner profiles.
- A learning portfolio.
- Progress management.
- A guided engineering sprint.
- Application settings and help.

The target system must preserve a clear distinction between learning content, operational tools, assessment evidence, governance decisions, and official credentials.

## 1.2 Mission

Enable users to progress from understanding AH-AIOS concepts to applying them responsibly, creating technical artifacts, evaluating evidence, and participating in governed system development.

## 1.3 Primary objectives

- **LS-OBJ-001** — Provide a coherent entry point into the AH-AIOS learning programme.
- **LS-OBJ-002** — Organize learning around AH-AIOS Core, AI Harness, and WorldForge.
- **LS-OBJ-003** — Include Human Stewardship as a cross-cutting learning dimension.
- **LS-OBJ-004** — Present curriculum content with explicit learning objectives and source references.
- **LS-OBJ-005** — Provide exercises, knowledge checks, practical laboratories, and integrated projects.
- **LS-OBJ-006** — Record learner progress without misrepresenting activity as verified competence.
- **LS-OBJ-007** — Allow learners to preserve and transfer their local learning records.
- **LS-OBJ-008** — Preserve provenance and distinguish source material from interpretation.
- **LS-OBJ-009** — Provide an extensible foundation for future authenticated and server-backed learning.
- **LS-OBJ-010** — Support a maintainable, testable, and deployable website.
- **LS-OBJ-011** — Provide accessible, responsive interfaces.
- **LS-OBJ-012** — Ensure that each claimed capability can be traced to an implementation and verification result.

## 1.4 Intended users

| User type | Primary responsibility |
|---|---|
| Learner | Study content, complete exercises, save work, and track progress |
| Curriculum author | Create and revise course and lesson content |
| Curriculum reviewer | Review correctness, completeness, source quality, and instructional design |
| Programme administrator | Maintain programme structure and publication settings |
| Assessment reviewer | Evaluate evidence against defined criteria |
| System maintainer | Maintain the application, dependencies, deployment, and recovery |
| Governance authority | Approve changes within its defined authority |
| Public visitor | Explore publicly available learning information |

These are target responsibilities. The current static implementation does not provide a complete account system or role-based authorization mechanism.

---

# 2. SYSTEM SCOPE AND BOUNDARIES

## 2.1 Included in scope

The Learning Studio architecture includes:

1. Frontend application.
2. Navigation and interface components.
3. Curriculum data.
4. Course and lesson presentation.
5. Learning activities.
6. Practice laboratories.
7. Integrated project briefs.
8. Knowledge checks and assessment presentation.
9. Learner profile and portfolio.
10. Local progress management.
11. JSON export and import.
12. Curriculum-based local tutor.
13. Theory collection import and validation.
14. Competency presentation.
15. Completion-document generation.
16. PWA installation metadata and application-shell caching.
17. Testing and verification.
18. Deployment configuration.
19. Future backend and integration boundaries.
20. Documentation and requirements traceability.

## 2.2 Excluded from the current implementation

The following are not provided by the inspected standalone website:

- Authenticated user accounts.
- Server-side learner profiles.
- Cloud learner synchronization.
- A shared learner database.
- A live AI model connection.
- An accredited credential issuer.
- An independently verified identity system.
- A production authorization service.
- A complete curriculum authoring and approval backend.
- An authoritative, bundled 82-Theory registry.
- Automatic verification of external credentials.

These capabilities may be introduced through separately specified development.

## 2.3 System boundary

The current runtime boundary is:

**Browser → Learning Studio application → bundled curriculum data → browser-local learner storage.**

The application may import and export files through browser APIs.

The future target may add:

**Browser → authenticated application API → application services → persistent database → governed curriculum and learner records.**

The future architecture must not be described as operational until the relevant services exist and have been verified.

## 2.4 Relationship to the wider AH-AIOS ecosystem

| System or domain | Relationship to Learning Studio |
|---|---|
| AH-AIOS Core | Supplies foundational architectural concepts and learning material |
| AI Harness | Supplies AI integration, orchestration, tooling, evaluation, and reliability subjects |
| WorldForge | Supplies structured-world, source, claim, relationship, and governance learning |
| Human Stewardship | Cross-cutting responsibility for judgment, evidence, safety, and accountability |
| External AI services | Not connected in the current local tutor |
| External identity services | Not connected in the current implementation |
| Future backend services | Integration boundary reserved for later development |

Learning Studio is a learning application about the ecosystem. It is not a substitute for the operational systems it teaches.

---

# 3. ARCHITECTURAL PRINCIPLES

- **Structure before presentation.** Authoritative learning information must be stored in structured records. The website interface should render those records rather than becoming the only place where essential curriculum information exists.
- **Source lineage.** Material claims, lesson explanations, exercises, and assessments should retain references to their source material. A source reference identifies where a statement came from. It does not automatically establish that the statement is true or approved.
- **Explicit content status.** Every governed curriculum artifact must have an identifiable status. Recommended states include: Proposed, Specified, Draft, Under Review, Approved, Published, Rejected, Superseded, Archived. Not every state must be exposed to learners. The underlying system must nevertheless distinguish them where the workflow requires it.
- **Learning is not certification.** Reading a lesson, completing a checkbox, passing a knowledge check, saving a project, and demonstrating competency are different events. The application must not silently equate them.
- **Local data is not authenticated identity.** A locally stored display name or progress record identifies information in a browser profile. It does not prove who the user is.
- **Validate before accepting imported data.** Imported JSON must be parsed and validated before it replaces existing state. Invalid imports must not destroy valid learner data.
- **Separate current capabilities from future services.** The local tutor must not be represented as a live AI service. Browser-local progress must not be represented as cloud storage. Printable completion documents must not be represented as accredited credentials.
- **Incremental implementation.** The architecture must support the existing static application while allowing future services to be introduced without unnecessary rewrites.
- **Evidence-based verification.** A feature is accepted only when its behavior can be demonstrated through a suitable test or documented inspection.
- **Controlled change.** Changes to curriculum, data schemas, application behavior, and deployment configuration must be identifiable, reviewable, and reversible where practical.

---

# 4. SYSTEM CONTEXT ARCHITECTURE

## 4.1 Logical architecture

The system is organized into the following logical layers.

**Layer 1 — Presentation.** Responsibilities: Application shell; Sidebar and top navigation; Dashboard; Course and lesson views; Forms and dialogs; Responsive layout; Accessibility behavior.

**Layer 2 — Interaction.** Responsibilities: Navigation events; Course selection; Knowledge-check submission; Exercise saving; Project interaction; Lab interaction; Profile editing; Import and export controls.

**Layer 3 — Learning domain.** Responsibilities: Curriculum access; Course and lesson interpretation; Learning activity tracking; Assessment presentation; Competency presentation; Project and portfolio association.

**Layer 4 — Data management.** Responsibilities: Learner-state initialization; State validation; Local persistence; Progress serialization; Import and export; Curriculum record loading.

**Layer 5 — Content and source management.** Responsibilities: Course records; Lesson records; Source references; Content status; Theory collection validation; Curriculum lineage.

**Layer 6 — Application platform.** Responsibilities: Browser APIs; Local storage; File handling; Service worker; PWA manifest; Static hosting.

**Layer 7 — Verification.** Responsibilities: Data validation tests; Curriculum checks; Interaction tests; Browser tests; Accessibility checks; Deployment verification.

**Layer 8 — Future service integration.** Reserved responsibilities: Authentication; Authorization; Server-side persistence; Cloud synchronization; Live AI integration; Shared curriculum services; Credential verification.

**Layer 9 — Cross-cutting trust and risk management.** Responsibilities: Source integrity; Input validation; Data preservation; Privacy; Access boundaries; Change history; Error handling; Recovery; Accurate status reporting.

Layer 9 applies across all other layers; it is not merely another sequential application-processing stage.

## 4.2 Architecture diagram

```text
                    AH-AIOS LEARNING STUDIO
                              |
                    Application Interface
                              |
           +------------------+------------------+
           |                  |                  |
        LEARN               BUILD              GOVERN
           |                  |                  |
   Learning Paths          Labs             Governance Study
   Courses and Lessons     Projects          Evidence Concepts
   Curriculum Tutor        Portfolio         Source Lineage
   Assessments             Exercises         Theory Validation
           |                  |                  |
           +------------------+----------------+
                              |
                       Learning Domain
                              |
                 Curriculum and State Services
                              |
               +--------------+--------------+
               |                             |
        Curriculum Data               Learner State
        Courses and Lessons           Profile and Progress
        Source References             Portfolio and Activity
        Project Briefs                Sprint Completion
               |                             |
               +--------------+--------------+
                              |
                      Browser Runtime
                              |
             Local Storage / File Import-Export
                              |
                  Static Website and PWA
                              |
               Future Services — Not Current
               Authentication / API / Database
               Live AI / Cloud Sync / Credentials
```

---

# 5. INFORMATION ARCHITECTURE

## 5.1 Navigation registry

The inspected implementation contains fourteen sidebar destinations.

| ID | Destination | Route fragment | Purpose |
|---|---|---|---|
| LS-NAV-001 | 3-Day Sprint | `#sprint` | Guided engineering sprint |
| LS-NAV-002 | Home | `#home` | Dashboard and progress overview |
| LS-NAV-003 | Learning Paths | `#paths` | Domain and programme exploration |
| LS-NAV-004 | Courses | `#courses` | Course catalogue |
| LS-NAV-005 | Labs | `#labs` | Practical learning laboratories |
| LS-NAV-006 | Integrated Projects | `#projects` | Applied project briefs |
| LS-NAV-007 | AI Tutor | `#tutor` | Curriculum-based local assistance |
| LS-NAV-008 | Assessments | `#assessments` | Knowledge checks and assessment framework |
| LS-NAV-009 | Competencies | `#competencies` | Competency-related progress |
| LS-NAV-010 | Certification Center | `#certifications` | Completion summaries and printable records |
| LS-NAV-011 | Knowledge Library | `#library` | Learning references and knowledge resources |
| LS-NAV-012 | Profile | `#profile` | Learner information and portfolio |
| LS-NAV-013 | Settings | `#settings` | Preferences and local data controls |
| LS-NAV-014 | Help | `#help` | Application guidance |

The primary action groups—Learn, Build, Govern, and Create—are additional interface shortcuts, not additional sidebar destinations.

## 5.2 Navigation requirements

- **LS-NAV-REQ-001:** Every sidebar destination must resolve to an existing section.
- **LS-NAV-REQ-002:** Navigation must work using a pointer and keyboard.
- **LS-NAV-REQ-003:** The active destination must be identifiable.
- **LS-NAV-REQ-004:** Mobile navigation must remain usable at narrow viewport widths.
- **LS-NAV-REQ-005:** Opening a modal must not permanently obstruct navigation.
- **LS-NAV-REQ-006:** Closing a modal must restore the previous context.
- **LS-NAV-REQ-007:** Invalid or missing destination fragments must fail gracefully.
- **LS-NAV-REQ-008:** Navigation must not imply that a section is fully implemented merely because a link exists.

## 5.3 Shared interface components

The architecture defines the following reusable components:

- Application shell.
- Sidebar.
- Top navigation.
- Search field.
- Dashboard metric card.
- Learning-path card.
- Course card.
- Lesson reader.
- Source-reference panel.
- Status badge.
- Progress indicator.
- Practice editor.
- Knowledge-check component.
- Feedback region.
- Project brief card.
- Lab workspace.
- Portfolio record.
- Import dialog.
- Export action.
- Confirmation dialog.
- Modal container.
- Empty-state component.
- Error-state component.
- Help panel.

Existing components may be implemented directly in HTML and JavaScript. This specification does not require a framework migration.

---

# 6. CURRICULUM ARCHITECTURE

## 6.1 Programme structure

The programme blueprint contains twenty-four courses and ninety-six lesson units.

| Programme group | Course count | Lesson units |
|---|---:|---:|
| AH-AIOS Core | 6 | 24 |
| AI Harness | 7 | 28 |
| WorldForge | 8 | 32 |
| Human Stewardship | 3 | 12 |
| **Total** | **24** | **96** |

The four-lesson allocation per course reflects the current programme blueprint.

The content model must allow future changes to course and lesson counts through versioned data rather than hard-coded assumptions.

## 6.2 Course entity

Each course record should support the following fields.

| Field | Requirement |
|---|---|
| `course_id` | Stable unique identifier |
| `title` | Human-readable title |
| `domain_id` | Technical or cross-cutting domain |
| `summary` | Purpose and scope |
| `competency_level` | Target level, if defined |
| `learning_outcomes` | Expected learning results |
| `prerequisites` | Required prior knowledge |
| `lesson_ids` | Ordered lesson references |
| `source_refs` | Source lineage |
| `status` | Content lifecycle status |
| `version` | Course version |
| `created_at` | Creation timestamp where tracked |
| `updated_at` | Last update timestamp where tracked |

Fields that are not present in the current runtime schema are target architecture requirements, not claims about existing data.

## 6.3 Lesson entity

Each lesson should support:

- Stable lesson ID.
- Parent course ID.
- Title.
- Learning outcomes.
- Prerequisites.
- Source references.
- Explanatory content.
- Worked example.
- Guided practice.
- Independent practice.
- Knowledge-check items.
- Answer explanations.
- Assessment evidence.
- Feedback and remediation.
- Safety boundaries.
- Content status.
- Version and lineage.

## 6.4 Lesson content-completeness rules

A lesson must not be marked content-complete merely because its title and outline exist.

The content-completeness validator must check the required lesson fields.

A lesson can remain `specified_only` when its topic and source outline exist but the required teaching content is missing.

A lesson can be `draft` when authored material exists but has not completed review.

A lesson can be `approved` only after its defined review requirements have been satisfied.

A lesson can be `published` only after explicit publication authorization.

## 6.5 Source references

A source-reference record should contain:

- Source identifier.
- Title.
- Source type.
- Repository or document location.
- Version or commit identifier where applicable.
- Relevant section or content location.
- Access date where appropriate.
- Relationship to the learning claim.
- Verification status.

The source-reference model must distinguish a link to a source from a verified claim about that source.

## 6.6 Curriculum lifecycle

```text
Proposed
   |
   v
Specified
   |
   v
Draft
   |
   v
Under Review
   |
   +-------> Rejected
   |
   v
Approved
   |
   v
Published
   |
   v
Superseded / Archived
```

Additional transitions may be defined for corrections and resubmissions.

The lifecycle is a target governance workflow. The current static website does not implement a complete multi-user curriculum approval service.

---

# 7. FUNCTIONAL SPECIFICATIONS

## 7.1 Home dashboard

**Purpose:** Present the learner's current learning state.

Required behavior:

- Display the learner's configured display name.
- Present available progress indicators.
- Provide entry points into learning paths and courses.
- Show available learning activities.
- Present continuation suggestions where the underlying data supports them.
- Handle a new learner with no saved progress.
- Avoid displaying misleading values when information is unavailable.

Acceptance conditions:

- The dashboard renders without JavaScript errors.
- Missing state produces a valid empty state.
- Progress indicators reflect stored data.
- All primary actions resolve to working destinations.

## 7.2 Learning Paths

Required behavior:

- Display programme domains.
- Display associated courses.
- Display course and lesson counts.
- Show content status.
- Distinguish authored material from specified-only outlines.
- Open associated course and lesson information.

Acceptance conditions:

- Counts are computed from the curriculum data.
- Cross-cutting Human Stewardship is not incorrectly presented as a fourth technical system domain.
- Missing content is not invented to fill a visual card.

## 7.3 Course catalogue

Required behavior:

- Display available course records.
- Filter or search where supported.
- Open a course.
- Present lesson and exercise information.
- Present a knowledge check where configured.
- Save learner practice.
- Display answer feedback.
- Preserve existing progress after navigation.

Acceptance conditions:

- Invalid course identifiers fail gracefully.
- Knowledge checks use the configured answer data.
- Saved work is associated with the correct course.
- User-provided text is safely rendered.

## 7.4 Lesson reader

Required behavior:

- Display lesson identity and parent course.
- Display lesson content and source references.
- Display exercises and checks where available.
- Identify incomplete or specified-only content.
- Allow learner responses to be saved where supported.

Acceptance conditions:

- A specified-only lesson is not represented as a complete authored lesson.
- Missing sources are visible as gaps rather than fabricated references.
- Lesson status is consistent between the catalogue and reader.

## 7.5 Practice laboratories

Required behavior:

- Present the lab objective.
- Provide the task prompt.
- Accept a learner response.
- Reject empty submissions where required.
- Save a submission to the portfolio.
- Preserve the relationship between submission and lab.

The current three labs are:

1. Agent Orchestration Lab.
2. Governance Review Lab.
3. Knowledge Graph Lab.

Acceptance conditions:

- Each lab opens.
- Responses can be saved.
- Saved records remain available after a page reload when local storage is retained.
- The system does not claim that a saved response has been independently evaluated unless an evaluator actually performed that evaluation.

## 7.6 Integrated projects

Required behavior:

- List available project briefs.
- Display project ID, title, level, and task information when supplied.
- Open the project brief.
- Allow the learner to create or revise a response.
- Save the response to the portfolio.
- Preserve project identity.

Acceptance conditions:

- Project briefs are rendered from curriculum data.
- Missing project fields are handled gracefully.
- A project is not represented as reviewed, piloted, or approved without evidence.

## 7.7 Local curriculum tutor

Required behavior for the current implementation:

- Provide local curriculum-oriented assistance.
- Use available application content.
- Avoid implying that an external model was contacted.
- Distinguish supplied curriculum material from generated interface responses.

Future AI integration requirements:

- Explicitly configured provider.
- Server-side secret management.
- Request validation.
- Authorization.
- Rate limiting.
- Failure handling.
- Disclosure of external model use.
- Appropriate logging and privacy controls.
- Protection against instructions embedded in untrusted content.

Acceptance conditions:

- The current tutor operates without claiming live model connectivity.
- Future remote requests are impossible unless the relevant integration is configured.
- No API secret is embedded in public static JavaScript.

## 7.8 Assessments

Required behavior:

- Present knowledge-check questions.
- Accept answer selection.
- Evaluate answers according to configured answer data.
- Present feedback.
- Preserve any recorded learning state.
- Display the common assessment framework.

The common framework includes a four-point scale, seven dimensions, assessment rules, and remediation steps.

Acceptance conditions:

- An answer is evaluated against the configured key.
- Feedback corresponds to the result.
- Missing assessment data is handled safely.
- Completion is not equated with verified competence.
- The common framework is not represented as a completed course-specific rubric.

## 7.9 Competencies

Required behavior:

- Present relevant competency categories.
- Link progress to the underlying learning records.
- Distinguish self-reported or activity-derived evidence from reviewed evidence.
- Identify missing evidence where applicable.

Acceptance conditions:

- The interface does not infer competence solely from viewing a lesson.
- Competency labels correspond to defined criteria.
- Where criteria are not yet configured, the interface identifies the competency as unverified or unspecified.

## 7.10 Certification Center

Required behavior:

- Present local completion information.
- Generate printable completion summaries where supported.
- Identify the source of the completion state.
- Avoid implying external accreditation.

Acceptance conditions:

- Generated documents accurately describe the local record.
- No unconfigured issuer is invented.
- A completion summary does not claim independently verified competence without supporting evidence.

## 7.11 Knowledge Library and Theory Explorer

Required behavior:

- Present available knowledge resources.
- Support theory collection import.
- Validate imported structure.
- Reject malformed collections.
- Preserve source information.
- Report the distinction between structural validation and source verification.

Acceptance conditions:

- The 82-Theory collection requires exactly 82 records.
- The expected classification counts are 68 registry records and 14 synthesized records.
- Each record has a non-empty ID and title.
- IDs are unique.
- Classification counts are validated.
- Invalid imports do not overwrite previously valid records.
- Structural validation is not represented as provenance authentication.

## 7.12 Profile and portfolio

Required behavior:

- Display and update the local learner name.
- Present saved learning artifacts.
- Associate artifacts with courses, labs, or projects.
- Allow review of saved work.
- Preserve records in local storage.

Acceptance conditions:

- Profile changes are reflected in the interface.
- Saved work appears in the portfolio.
- The same artifact is not unintentionally duplicated when a workflow is intended to update an existing record.
- The interface explains the local nature of the data.

## 7.13 Settings and progress management

Required behavior:

- Support available interface preferences.
- Support progress export.
- Support progress import.
- Support a reset operation.
- Confirm destructive actions.
- Report errors without silently discarding data.

Acceptance conditions:

- A valid export produces a usable JSON file.
- A valid import restores the expected records.
- An invalid import leaves current state unchanged.
- Resetting progress requires deliberate confirmation.
- The application returns to a valid state after reset.

## 7.14 Help

Required behavior:

- Explain application navigation.
- Explain local data persistence.
- Explain import and export.
- Explain relevant feature limitations.
- Explain how to recover from common user errors.

Acceptance conditions:

- Help is accessible from the navigation.
- Instructions match the current implementation.
- Help does not claim unavailable services.

---

# 8. DATA ARCHITECTURE

## 8.1 Data categories

The architecture separates the following categories:

1. Curriculum definitions.
2. Source references.
3. Lesson content.
4. Assessment definitions.
5. Learner profile.
6. Learner progress.
7. Learning activity.
8. Portfolio artifacts.
9. Lab submissions.
10. Project responses.
11. Sprint state.
12. Imported theory records.
13. Application preferences.
14. Verification and audit records, where supported.

## 8.2 Core logical entities

**Domain.** Represents a learning domain or cross-cutting programme group.

Key fields: `domain_id`, `name`, `description`, `domain_type`. The `domain_type` distinguishes a technical domain from a cross-cutting programme dimension.

**Course.** Represents a learning course.

Key fields: `course_id`, `domain_id`, `title`, `summary`, `level`, `status`, `version`.

**Lesson.** Represents a lesson within a course.

Key fields: `lesson_id`, `course_id`, `title`, `content_status`, `learning_outcomes`, `content`, `source_refs`, `version`.

**Source.** Represents a referenced source document or artifact.

Key fields: `source_id`, `title`, `source_type`, `location`, `version_ref`, `verification_status`.

**Assessment.** Represents a knowledge check or assessment definition.

Key fields: `assessment_id`, `course_id` or `lesson_id`, `items`, `scoring_rules`, `status`.

**Learner profile.** Represents local learner preferences and display metadata.

Key fields: `profile_id`, `display_name`, `preferences`. In the current local-only implementation, the profile identifier is not an authenticated account identifier.

**Progress record.** Represents learner progress against a learning object.

Key fields: `progress_id`, `learning_object_id`, `state`, `updated_at`.

**Portfolio artifact.** Represents saved learner work.

Key fields: `artifact_id`, `artifact_type`, `parent_object_id`, `title`, `text`, `created_at`, `updated_at`.

**Theory record.** Represents an imported theory item.

Key fields: `id`, `title`, `classification`, `source_refs`. The exact field names and schema for existing runtime records must be aligned to the current implementation before a migration is applied.

## 8.3 Relationship model

```text
Domain
  └── Course
       ├── Lesson
       │    ├── Source References
       │    ├── Practice Activities
       │    └── Knowledge Checks
       ├── Assessments
       └── Projects

Learner Profile
  ├── Progress Records
  ├── Activity Records
  ├── Portfolio Artifacts
  └── Sprint State

Theory Collection
  └── Theory Records
       └── Source References
```

## 8.4 Identifier requirements

- IDs must be stable across ordinary content revisions.
- IDs must not be generated from mutable display titles alone.
- Imported IDs must be validated for uniqueness.
- Relationships must reference existing records.
- Version changes must not silently redirect a learner's saved work to an unrelated course.
- Record removal must be handled without corrupting dependent records.

## 8.5 Schema versioning

Every exported learner-data file must include a schema version.

The import mechanism must:

1. Parse the file.
2. Check the schema version.
3. Validate required fields.
4. Validate identifiers and relationships.
5. Apply a supported migration if available.
6. Reject unsupported versions without changing current state.
7. Report a comprehensible error.

A future schema migration must preserve a backup or allow recovery before destructive transformation.

---

# 9. STATE MANAGEMENT AND PERSISTENCE

## 9.1 Current persistence model

The current application uses browser `localStorage`.

This is appropriate for a standalone prototype and individual browser-local use.

It does not provide centralized or cross-device persistence.

## 9.2 State lifecycle

```text
Application Startup
       |
       v
Read Local State
       |
       v
Parse and Validate
       |
       +---- Invalid or Missing ----> Initialize Safe Defaults
       |
       v
Render Application
       |
       v
User Interaction
       |
       v
Validate Change
       |
       v
Update State
       |
       v
Persist Local State
       |
       v
Render Updated Interface
```

## 9.3 Persistence requirements

- **LS-DATA-001:** State must initialize safely when storage is empty.
- **LS-DATA-002:** Malformed JSON must not crash the application.
- **LS-DATA-003:** Invalid imports must not overwrite valid state.
- **LS-DATA-004:** State updates must use a consistent schema.
- **LS-DATA-005:** Export must produce valid JSON.
- **LS-DATA-006:** Import must validate the complete supported structure.
- **LS-DATA-007:** Reset must require deliberate user confirmation.
- **LS-DATA-008:** Storage errors must be handled visibly.
- **LS-DATA-009:** The interface must explain that browser data can be lost.
- **LS-DATA-010:** Data migrations must preserve recoverability.

## 9.4 Future server-backed model

If server-side persistence is introduced, the architecture must define:

- Authenticated learner identity.
- Record ownership.
- Access authorization.
- API validation.
- Database constraints.
- Transaction behavior.
- Conflict resolution.
- Audit history.
- Backup and restoration.
- Retention and deletion.
- Synchronization semantics.

The existing browser-local model must not be described as already providing these properties.

---

# 10. LEARNING WORKFLOW ARCHITECTURE

## 10.1 Standard learning workflow

```text
Choose Learning Path
        |
        v
Select Course
        |
        v
Open Lesson
        |
        v
Study Content and Sources
        |
        v
Complete Practice
        |
        v
Submit Knowledge Check
        |
        v
Review Feedback
        |
        v
Save Learning Evidence
        |
        v
Review Progress
        |
        v
Continue or Revisit
```

## 10.2 Practice workflow

1. Learner opens an exercise.
2. Application displays the exercise prompt.
3. Learner enters a response.
4. Application validates required input.
5. Learner saves the response.
6. Application associates the response with the learning object.
7. Application confirms the result.
8. The portfolio displays the saved artifact.

Saving an exercise does not automatically mean the exercise passed review.

## 10.3 Assessment workflow

1. Application loads assessment items.
2. Learner submits an answer.
3. Application validates the submission.
4. Assessment logic evaluates the response.
5. Feedback is displayed.
6. Any supported result is recorded.
7. Learner may retry or follow remediation instructions.

Assessment thresholds and scoring rules must be explicitly defined for each assessment. The existence of a shared four-point framework does not automatically establish course-specific pass criteria.

## 10.4 Completion model

The system must distinguish:

- Not started.
- In progress.
- Activity submitted.
- Assessment attempted.
- Assessment passed.
- Completion criteria satisfied.
- Competency evidence reviewed.
- Credential issued by an authorized issuer.

These are different states.

The current local application may support only a subset. Unsupported states must not be inferred or fabricated.

## 10.5 Sprint workflow

The sprint tracks fifteen task checkboxes across the three-day engineering programme.

The application calculates completion progress and persists the selected task state locally.

A checked task means the learner marked it complete. It does not independently verify that the task was performed.

---

# 11. ASSESSMENT, COMPETENCY, AND CREDENTIAL ARCHITECTURE

## 11.1 Assessment dimensions

The shared assessment framework contains seven dimensions defined by the curriculum data.

The application must render the authoritative dimension labels and explanations rather than duplicating them in unrelated hard-coded locations.

## 11.2 Assessment record

A target assessment result should distinguish:

1. Assessment definition.
2. Learner response.
3. Scoring result.
4. Feedback.
5. Attempt timestamp.
6. Evidence references.
7. Evaluation method.
8. Reviewer identity, if applicable.
9. Review status.
10. Assessment version.

Fields requiring an authenticated reviewer cannot be treated as verified in the current anonymous local application.

## 11.3 Competency evidence

A competency claim should identify:

1. The competency being evaluated.
2. The required criteria.
3. The submitted evidence.
4. The evaluation method.
5. The evaluation result.
6. Any remediation requirement.
7. The reviewer or evaluation authority, if applicable.
8. The version of the competency standard.

Progress indicators alone are insufficient evidence of independent competency.

## 11.4 Credential boundary

A local printable completion document may record that a local application reached a defined state.

It must not imply:

- External accreditation.
- Government recognition.
- An authorized credential issuer.
- Identity verification.
- Independent professional qualification.

A future credential service requires an explicit issuer, defined standards, verification mechanisms, and a separate implementation.

---

# 12. AI TUTOR ARCHITECTURE

## 12.1 Current implementation

The current tutor is local and rule-based.

It does not call a live AI model.

## 12.2 Logical components

The current or target tutor architecture separates:

- User question input.
- Available curriculum context.
- Local response logic.
- Response presentation.
- Error and fallback behavior.

## 12.3 Future model integration

A future model-backed tutor should use a service boundary:

```text
Browser
   |
   v
Tutor Interface
   |
   v
Application API
   |
   v
Tutor Service
   |
   +----> Curriculum Retrieval
   |
   +----> Source and Permission Checks
   |
   v
Configured AI Provider
   |
   v
Response Validation and Presentation
```

## 12.4 Required controls for future integration

- Provider configuration.
- Secret management outside public frontend code.
- Request validation.
- Rate limiting.
- Authorization.
- Data-minimization controls.
- Error handling.
- Disclosure that a model is being used.
- Appropriate handling of untrusted curriculum text.
- Source attribution where retrieval is used.
- Distinction between generated interpretation and approved learning content.

The tutor must not write directly to authoritative curriculum records or change content status without a separately authorized workflow.

---

# 13. KNOWLEDGE LIBRARY AND THEORY REGISTRY

## 13.1 Theory collection

The intended Theory Explorer collection contains 82 records:

- 68 registry records.
- 14 synthesized records.

## 13.2 Structural validation

The validator must check:

- Collection shape.
- Exact record count.
- Record object structure.
- Required ID.
- Required title.
- Unique IDs.
- Classification validity.
- Expected classification counts.

## 13.3 Provenance validation

Structural validation is not provenance validation.

A structurally valid record can still contain an incorrect, unsupported, or misattributed claim.

Source verification requires separate evidence and must be represented separately from the structural validation result.

## 13.4 Import behavior

The import workflow must:

1. Read the selected file.
2. Parse JSON.
3. Validate the collection.
4. Reject invalid input.
5. Preserve current records on failure.
6. Save valid records.
7. Display the result.
8. Preserve the distinction between imported and verified material.

## 13.5 Future source registry

A future registry service may support:

- Source identifiers.
- Source versions.
- Source locations.
- Claim-to-source relationships.
- Verification records.
- Provenance history.
- Supersession and correction.

These capabilities require additional implementation and are not implied by the current import validator.

---

# 14. UI/UX AND DESIGN SYSTEM

## 14.1 Design objectives

The interface must be:

- Readable.
- Responsive.
- Consistent.
- Keyboard-accessible.
- Clear about state.
- Appropriate for long-form learning.
- Usable without unnecessary navigation.
- Explicit about missing and incomplete content.

## 14.2 Layout

The target layout includes:

- Sidebar navigation.
- Main content region.
- Dashboard and feature cards.
- Course and curriculum views.
- Contextual modal dialogs.
- Responsive layouts for smaller screens.

## 14.3 Responsive behavior

The interface must remain usable across:

- Desktop monitors.
- Laptops.
- Tablets.
- Mobile browsers.

Requirements:

- No critical horizontal overflow.
- Navigation must remain reachable.
- Forms must fit available space.
- Dialogs must remain scrollable.
- Content must reflow rather than shrink into unreadable text.
- Interactive targets must remain usable on touch devices.

## 14.4 Accessibility

The target application should conform to WCAG 2.2 Level AA to the extent applicable.

Required areas include:

- Semantic HTML.
- Correct heading hierarchy.
- Keyboard navigation.
- Visible focus indicators.
- Accessible form labels.
- Accessible dialog behavior.
- Screen-reader feedback.
- Sufficient contrast.
- Reduced reliance on color alone.
- Text alternatives for meaningful icons.
- Appropriate error messages.

Accessibility acceptance requires actual testing. A specification statement is not proof of conformance.

## 14.5 Interface status indicators

The UI should distinguish:

- Available.
- In progress.
- Specified only.
- Draft.
- Under review.
- Approved.
- Published.
- Saved locally.
- Import failed.
- Verification pending.

A status badge must reflect the underlying record rather than merely the visual appearance of the component.

---

# 15. SECURITY, PRIVACY, AND TRUST ARCHITECTURE

## 15.1 Current trust boundary

The application runs in the browser and stores learner state locally.

Anyone with access to the relevant browser profile may potentially access its local application data.

The current application does not establish a secure authenticated identity or server-enforced access control.

## 15.2 Input handling

The application must treat user-entered text and imported files as untrusted input.

Requirements:

- Escape text before inserting it into HTML contexts.
- Prefer safe DOM APIs for untrusted content.
- Validate JSON before use.
- Reject malformed structures.
- Validate identifiers and references.
- Avoid evaluating imported content as executable code.
- Avoid inserting untrusted content as raw HTML.
- Provide safe error messages.

## 15.3 Import safety

- Do not replace current state before successful validation.
- Validate required fields and expected record relationships.
- Reject unsupported schema versions.
- Preserve current data after an invalid import.
- Explain validation errors without exposing unnecessary internal details.

## 15.4 Privacy

The current application should minimize personal information.

It should not imply that local profile information is transmitted to a server.

Future remote services must define what information is sent, why it is needed, how long it is retained, and who can access it.

## 15.5 Security requirements for future services

Any backend must define:

- Authentication.
- Authorization.
- Session management.
- Access scopes.
- Input validation.
- Rate limiting.
- Secrets management.
- Audit logging.
- Backup protection.
- Data retention.
- Deletion and recovery.
- Security monitoring.

These controls are future service requirements, not current static-application capabilities.

## 15.6 Trust and content integrity

The application must distinguish:

- Source content.
- Generated explanation.
- Learner submission.
- Automated validation.
- Human review.
- Approved curriculum.
- Official credential.

One state must not silently become another.

---

# 16. INTEGRATION ARCHITECTURE

## 16.1 Current integrations

The inspected standalone application uses local browser capabilities and bundled files.

Its operation does not require a live backend.

## 16.2 Future integration boundaries

Future integrations may include:

- AH-AIOS backend services.
- Authenticated user identity.
- Curriculum management services.
- Shared learning progress.
- AI model services.
- External source registries.
- Credential verification.

Each integration requires a defined interface contract.

## 16.3 Interface contract requirements

Each future interface must specify:

- Purpose.
- Endpoint or service identifier.
- Request schema.
- Response schema.
- Authentication method.
- Authorization requirements.
- Error responses.
- Timeout behavior.
- Retry behavior.
- Rate limits.
- Versioning.
- Data classification.
- Logging requirements.

No external integration should be assumed merely because a module has a corresponding name in the sidebar.

---

# 17. DEPLOYMENT ARCHITECTURE

## 17.1 Deployment model

The current Learning Studio is designed for static hosting.

The intended deployment directory is:

`/learning-studio/`

This preserves the existing root application and prevents Learning Studio from replacing WorldForge.

## 17.2 Runtime files

The public runtime should include:

```text
learning-studio/
├── index.html
├── app.js
├── styles.css
├── curriculum-data.js
├── theory-validation.js
├── manifest.webmanifest
├── sw.js
└── icon.svg
```

The exact deployed file set must match the actual source imports and runtime dependencies.

Tests, internal verification documents, and package archives do not need to be exposed as public runtime files.

## 17.3 Hosting requirements

- Static files must be served over HTTPS in production.
- Relative asset paths must work under the `/learning-studio/` base path.
- The service worker scope must remain within the Learning Studio directory.
- The deployment must not overwrite unrelated site content.
- The deployment artifact must be traceable to a source revision.
- Rollback must be possible through the hosting or repository history.

## 17.4 PWA requirements

The PWA implementation includes:

- Web App Manifest.
- Application icon.
- Service worker.
- Application-shell caching.
- Versioned cache naming.

The application must be tested in a supported browser to confirm installation and offline behavior.

## 17.5 Release procedure

The target release procedure is:

1. Identify the intended source revision.
2. Build or assemble the deployable artifact.
3. Run the relevant automated tests.
4. Verify required runtime files.
5. Deploy to the intended location.
6. Open the deployed site.
7. Test navigation and core interactions.
8. Confirm the correct version is served.
9. Record the live URL and source revision.
10. Preserve a rollback path.

This is a practical deployment procedure, not a requirement to create unnecessary governance paperwork for every static file change.

## 17.6 Deployment status

This specification does not assert that a particular live deployment has succeeded.

Deployment completion must be established by the actual hosting result and a successful live-site check.

---

# 18. TESTING AND VERIFICATION ARCHITECTURE

## 18.1 Test categories

**Unit tests.** Verify isolated functions such as: Progress validation; Theory validation; Curriculum validation; Scoring logic; Serialization; Identifier checks.

**Integration tests.** Verify interactions between: Curriculum data and rendering; Course workflows and portfolio storage; Import validation and persistence; Sprint task state and progress display; Assessment definitions and feedback.

**Browser tests.** Verify: Application startup; Navigation; Modal interactions; Course opening; Lab submission; Profile changes; Progress export and import; Responsive behavior.

**Accessibility tests.** Verify: Keyboard operation; Focus order; Dialog focus management; Accessible labels; Screen-reader announcements; Contrast and text readability.

**Deployment tests.** Verify: Runtime files are present; Asset paths resolve; The application loads at the intended subdirectory; The service worker registers correctly; The live site serves the intended version.

## 18.2 Core acceptance tests

| Test ID | Test | Expected result |
|---|---|---|
| LS-TST-001 | Load application | Main interface renders without fatal error |
| LS-TST-002 | Open all sidebar destinations | Every destination resolves |
| LS-TST-003 | Open course | Correct course content appears |
| LS-TST-004 | Submit knowledge check | Correct evaluation and feedback appear |
| LS-TST-005 | Save practice response | Response appears in portfolio |
| LS-TST-006 | Submit lab response | Lab submission is saved |
| LS-TST-007 | Save profile change | Display name updates and persists |
| LS-TST-008 | Export progress | Valid JSON file is generated |
| LS-TST-009 | Import valid progress | Supported records are restored |
| LS-TST-010 | Import invalid progress | Existing state remains unchanged |
| LS-TST-011 | Validate theory collection | Count, fields, uniqueness, and classification rules are checked |
| LS-TST-012 | Track sprint tasks | Progress count and bar update |
| LS-TST-013 | Reload application | Saved local state is restored |
| LS-TST-014 | Use mobile viewport | Navigation and forms remain usable |
| LS-TST-015 | Test keyboard access | Core workflows can be operated by keyboard |
| LS-TST-016 | Test PWA | Manifest and service worker behave as intended |
| LS-TST-017 | Deploy to subdirectory | All required assets load under `/learning-studio/` |
| LS-TST-018 | Open deployed site | Live URL serves the intended application version |

## 18.3 Acceptance principle

A test is passed only when its result has been observed or recorded.

The existence of a test file is not proof that the test passed.

A successful automated test run is not proof of curriculum completeness, accessibility conformance, or production readiness unless those areas were explicitly tested.

---

# 19. REQUIREMENTS TRACEABILITY

## 19.1 Traceability model

Each material requirement should map to:

1. Requirement identifier.
2. Architecture section.
3. Implementation file or component.
4. Test identifier.
5. Verification result.
6. Known limitation, if any.

## 19.2 Example traceability table

| Requirement | Implementation area | Verification |
|---|---|---|
| LS-NAV-REQ-001 — Navigation targets resolve | `index.html`, `app.js` | LS-TST-002 |
| LS-DATA-003 — Invalid imports preserve data | `app.js` | LS-TST-010 |
| Theory collection structure | `theory-validation.js` | LS-TST-011 |
| Course interaction | `app.js`, `curriculum-data.js` | LS-TST-003 |
| Progress persistence | `app.js` | LS-TST-013 |
| PWA asset resolution | `manifest.webmanifest`, `sw.js` | LS-TST-016 |
| Subdirectory deployment | Deployment configuration and runtime assets | LS-TST-017 |
| Live deployment verification | Hosting environment | LS-TST-018 |

The table is a target traceability model. Actual verification results must be populated from executed tests and observed behavior.

## 19.3 Verification states

Use explicit verification states:

- Not Tested.
- In Progress.
- Passed.
- Failed.
- Blocked.
- Not Applicable.

A feature must not be marked passed solely because it is specified or implemented.

---

# 20. OPERATIONAL ARCHITECTURE

## 20.1 Routine maintenance

Maintenance should cover:

- Correctness of curriculum references.
- Browser compatibility.
- JavaScript errors.
- Broken navigation.
- Dependency updates where applicable.
- Service-worker cache behavior.
- Import and export reliability.
- Accessibility regressions.
- Deployment integrity.

## 20.2 Backup and recovery

For the current implementation:

- Learners should export progress periodically.
- The application should preserve existing state when imports fail.
- The source repository should preserve version history.
- Deployment changes should be reversible.

The local progress export is a learner backup, not a centralized application backup.

## 20.3 Error handling

Errors should be:

- Visible to the user when they affect a workflow.
- Understandable.
- Specific enough to support correction.
- Safe to display.
- Non-destructive whenever possible.

The application should not silently ignore failed persistence, failed import, or invalid curriculum references.

## 20.4 Monitoring

The static application has no required centralized monitoring service.

Future server-backed deployments should define operational monitoring appropriate to their services, including error rates, service availability, backup success, and security events.

---

# 21. PERFORMANCE AND RELIABILITY REQUIREMENTS

## 21.1 Performance objectives

The application should:

- Load the main interface promptly on a typical broadband connection.
- Avoid unnecessary blocking operations.
- Render large curriculum lists efficiently.
- Avoid repeated full-page reloads for ordinary interactions.
- Handle missing local storage gracefully.
- Avoid fatal errors when an optional feature lacks data.

Exact numerical performance thresholds must be defined against the intended hosting environment and representative devices before formal performance acceptance.

## 21.2 Reliability requirements

- A malformed learner record must not prevent the application from opening.
- An invalid import must not overwrite valid state.
- A missing optional content record must not crash unrelated modules.
- Navigation failures must be recoverable.
- Service-worker failures must not be mistaken for successful offline operation.
- A deployment must preserve the unrelated root application.

---

# 22. IMPLEMENTATION ROADMAP

## Phase 1 — Existing static application stabilization

**Goal:** Establish the current website as a dependable, deployable application.

Scope:

- Align navigation labels and documented counts.
- Verify all navigation destinations.
- Verify core interactions.
- Confirm progress import and export.
- Confirm theory validation.
- Confirm PWA assets and service-worker paths.
- Verify deployment under `/learning-studio/`.

**Exit condition:** Core application workflows pass their relevant acceptance tests.

## Phase 2 — Curriculum completeness

**Goal:** Convert the programme blueprint into complete learning content.

Scope:

- Complete lesson explanations.
- Add worked examples.
- Add guided and independent exercises.
- Add knowledge checks and rationales.
- Add approved source references.
- Add lesson-specific assessment criteria.
- Review content and track publication status.

**Exit condition:** Each published lesson satisfies the defined completeness and review requirements.

## Phase 3 — Learning evidence and competency

**Goal:** Improve the distinction between learner activity and demonstrated capability.

Scope:

- Define competency criteria.
- Link evidence to criteria.
- Add explicit evaluation status.
- Define remediation.
- Distinguish local activity from reviewed evidence.

**Exit condition:** Competency displays are supported by clearly identified criteria and evidence.

## Phase 4 — Backend and identity

**Goal:** Introduce shared, authenticated learning only when authorized and required.

Scope:

- Define API contracts.
- Implement authentication.
- Implement authorization.
- Add persistent storage.
- Add learner synchronization.
- Add audit history.
- Add backup and recovery.

**Exit condition:** Server-backed workflows pass security, data-integrity, and functional acceptance tests.

## Phase 5 — Live AI and external integrations

**Goal:** Add external services without weakening trust boundaries.

Scope:

- Define AI service interface.
- Implement secure provider configuration.
- Add request validation and rate limits.
- Add source-aware retrieval where required.
- Define failure behavior and privacy controls.

**Exit condition:** Integration behavior, security controls, and disclosure are verified.

These phases describe the target development path. They do not mean that later-phase features currently exist.

---

# 23. RISKS AND MITIGATIONS

| Risk | Impact | Mitigation |
|---|---|---|
| Specified-only content presented as complete | Misleads learners | Display explicit content status |
| Local progress lost | Learner work lost | Export, validation, and recovery guidance |
| Invalid JSON accepted | Corrupted state | Strict schema validation |
| Imported source treated as verified | False provenance claims | Separate structural and provenance validation |
| Local completion treated as certification | Misleading credential claim | Explicit credential boundary |
| Local tutor mistaken for live AI | Misleading capability claim | Clearly disclose local operation |
| Stale service-worker cache | Outdated interface | Versioned cache and deployment testing |
| Deployment overwrites root site | Existing website disrupted | Preserve subdirectory deployment |
| Course identifiers change unexpectedly | Broken learner records | Stable IDs and controlled migrations |
| Future API secrets exposed in frontend | Service compromise | Server-side secret management |
| Accessibility defects | Excludes users | Accessibility testing and remediation |
| Tests assumed to have passed | False confidence | Record actual test execution results |

---

# 24. ACCEPTANCE CRITERIA FOR THE COMPLETE LEARNING STUDIO

The application can be accepted as a verified release only when the following applicable conditions have evidence.

## 24.1 Functional acceptance

- All sidebar destinations work.
- Course and lesson workflows behave as specified.
- Practice and project submissions can be saved.
- Knowledge checks return appropriate feedback.
- Profile and settings actions work.
- Export and import preserve data integrity.
- Theory validation enforces the defined structural rules.
- Unsupported features are not represented as operational.

## 24.2 Data acceptance

- Curriculum identifiers are stable.
- Required relationships resolve.
- Content statuses are consistent.
- Import validation rejects malformed records.
- Existing state survives invalid imports.
- Data exports are valid and versioned.

## 24.3 User-experience acceptance

- The application works at supported viewport sizes.
- Navigation remains usable.
- Forms provide understandable feedback.
- Keyboard interaction works for core workflows.
- Accessibility issues are tested and documented.

## 24.4 Deployment acceptance

- The intended source revision is identified.
- All runtime assets are present.
- The application loads at the intended URL.
- The root website remains intact.
- Service-worker behavior is tested.
- The live website is opened and checked.
- The deployed version can be traced to its source revision.
- A rollback path exists.

## 24.5 Content acceptance

- Published lessons satisfy the completeness standard.
- Source references are present where required.
- Review and publication status are explicit.
- Assessment criteria are defined.
- Credentials are not implied without an authorized issuer.

---

# 25. ARCHITECTURE DECISIONS

The following decisions establish the intended system direction.

**LS-ADR-001 — Standalone static frontend.** Decision: Preserve the current standalone browser application for the initial deployment. Reason: It allows the Learning Studio to operate without a backend and keeps deployment simple.

**LS-ADR-002 — Separate deployment directory.** Decision: Deploy Learning Studio under `/learning-studio/`. Reason: Preserve the existing root website and keep the application isolated.

**LS-ADR-003 — Structured curriculum data.** Decision: Keep curriculum records separate from interface markup. Reason: Curriculum can be validated, versioned, reviewed, and reused without rewriting the interface.

**LS-ADR-004 — Local-first learner state.** Decision: Retain browser-local persistence for the current implementation. Reason: The current application does not require accounts or shared storage. Constraint: Local storage must not be described as cloud synchronization or authenticated recordkeeping.

**LS-ADR-005 — Tutor integration boundary.** Decision: Treat the existing tutor as local functionality. Reason: No live model connection is established in the inspected implementation.

**LS-ADR-006 — Explicit curriculum lifecycle.** Decision: Separate specified, drafted, reviewed, approved, and published content. Reason: Curriculum availability and curriculum authority are different conditions.

**LS-ADR-007 — Validation before persistence.** Decision: Validate imports before replacing current state. Reason: Prevent invalid data from destroying valid learner information.

**LS-ADR-008 — Separate competence from activity.** Decision: Do not treat course viewing, checkboxes, or unsupervised completion as proof of verified competency. Reason: Competency claims require defined criteria and appropriate evidence.

---

# 26. CANONICAL REQUIREMENTS REGISTER

The following identifiers provide stable references for implementation and verification.

| ID range | Requirement category |
|---|---|
| LS-OBJ | Product objectives |
| LS-SYS | System scope and boundaries |
| LS-ARCH | System and component architecture |
| LS-NAV | Navigation and information architecture |
| LS-CUR | Curriculum and lesson content |
| LS-FUNC | Functional module requirements |
| LS-DATA | Data integrity and persistence |
| LS-WF | Learning workflows |
| LS-ASSESS | Assessment and competency |
| LS-AI | Tutor and AI integration |
| LS-KB | Knowledge library and theory registry |
| LS-UI | UI/UX and accessibility |
| LS-SEC | Security and privacy |
| LS-INT | External integrations |
| LS-DEP | Deployment |
| LS-TST | Testing and verification |
| LS-OPS | Operations and recovery |
| LS-ADR | Architecture decisions |

Every material implementation requirement should use one of these stable identifiers or an explicitly defined extension.

---

# 27. SOURCE AND VERSION CONTROL

## 27.1 Reference sources

The architecture must be reconciled with the actual source files, including:

- `docs/learning/architecture/LEARNING-STUDIO-WEBSITE-ARCHITECTURE-SPECIFICATION-v1.0.md`
- `learning-studio/index.html`
- `learning-studio/styles.css`
- `learning-studio/app.js`
- `learning-studio/curriculum-data.js`
- `learning-studio/theory-validation.js`
- `learning-studio/manifest.webmanifest`
- `learning-studio/sw.js`
- `learning-studio/package.json`
- `learning-studio/README.md`
- `learning-studio/DEPLOYMENT.md`
- `learning-studio/VERIFICATION.md`

Repository: `hydraporss/ah-aios-react-website`

Implementation reference commit: `b08ddd0bc46f86d6ab6c327f505bf23fb9892694`

## 27.2 Versioning requirements

- Preserve the original architecture specification as a source reference.
- Do not silently overwrite its meaning.
- Assign a version to each accepted architecture revision.
- Record substantive changes to requirements.
- Keep implementation and architecture versions distinguishable.
- Record verification evidence against a known source revision.
- Mark superseded specifications explicitly.

## 27.3 Authority of this document

This document defines the comprehensive target architecture and the requirements needed to align the website with it.

It does not automatically establish that every requirement has been implemented, reviewed, approved, or deployed.

The existing implementation remains evidence of current behavior. Where the implementation differs from the target, the difference must be recorded as a gap and resolved through deliberate development.

---

# 28. FINAL SYSTEM DEFINITION

**AH-AIOS Learning Studio is a structured, extensible educational application for the AH-AIOS ecosystem.** It organizes learning across AH-AIOS Core, AI Harness, and WorldForge, with Human Stewardship as a cross-cutting dimension. It provides course and lesson access, practical laboratories, integrated projects, assessments, competency presentation, a local curriculum tutor, knowledge resources, learner portfolio, local progress management, and PWA functionality.

Its architecture separates interface, learning workflows, curriculum data, learner state, source references, validation, deployment, and future service integration.

The current implementation is a standalone browser application. It does not provide authenticated accounts, shared cloud progress, a live AI service, or an accredited credential issuer. The complete curriculum blueprint is represented in the application, but lesson authoring, review, and publication remain separate content-production responsibilities.

The target system must preserve source lineage, validate imported data, distinguish activity from competence, distinguish generated interpretation from approved curriculum, and report implementation status accurately.

Its governing learning direction is:

**LEARN. BUILD. GOVERN. CREATE.**

Its architectural rule is:

**Specify completely. Implement deliberately. Validate continuously. Preserve evidence. Claim only what has been demonstrated.**

**End of Specification.**
