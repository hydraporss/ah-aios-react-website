# AH-AIOS Learning Studio — Complete Workbench Architecture Specification

**Document ID:** LS-WB-ARCH-001 · **Version:** 1.0.0 · **Date:** 1 November 2026
**System:** AH-AIOS Learning Studio · **Classification:** Complete Workbench Architecture Specification
**Architecture status:** Specification baseline · **Product promise:** Learn. Build. Govern. Create.

*Reproduced here independently of the Notion document.*

## 1. Purpose
This specification defines the complete workbench architecture for the AH-AIOS Learning Studio website. It establishes the structure, functional modules, navigation, user experiences, workflows, data architecture, application services, AI capabilities, governance, security, testing, deployment, and operational requirements.

The workbench is the integrated environment through which learners discover knowledge, study structured content, perform practical exercises, build projects, demonstrate competency, and preserve their work. It must function as an integrated learning and capability-development application rather than a static course catalogue.

- Learning journey: Discover → Learn → Experiment → Build → Demonstrate.
- Operating model: Learn → Build → Govern → Create.

## 2. Relationship to existing AH-AIOS architecture
This specification extends the established AH-AIOS Learning Studio product and website architecture. It does not replace the existing source documents.

| Environment | Primary responsibility |
|---|---|
| Learning Studio Application | Learner-facing learning and capability development |
| Learning App Studio | Production environment for designing, creating, validating, and publishing learning applications |
| Instructor and Administration Workspaces | Learning delivery, review, assessment, governance, and operational management |

The learner-facing application and the production environment must not be treated as interchangeable.

### 2.1 Established programme structure
- AH-AIOS Core — 6 courses.
- AI Harness — 7 courses.
- WorldForge — 8 courses.
- Human Stewardship — 3 cross-cutting courses.

Total: 24 courses and 96 lesson units. Human Stewardship is a cross-cutting learning dimension, not a fourth technical application domain. The full programme blueprint must remain distinguishable from the nine interactive starter modules and from content that has actually been authored, reviewed, and published.

### 2.2 Established theory collection
82 theories = 68 existing registry theories + 14 synthesized concrete theories. The 14 synthesized items are theories, not procedures or placeholders. Structural validation, source provenance, and factual verification must remain separate.

### 2.3 Status terminology
Specified · Designed · Implemented · Tested · Verified · Reviewed · Approved · Published · Deployed.

A specified feature is not necessarily implemented. An implemented feature is not necessarily tested. A passing test does not automatically establish production readiness.

## 3. Architectural principles
1. Learning through practical application.
2. Structured knowledge and curriculum.
3. Evidence-based competency development.
4. Source traceability and provenance.
5. Human accountability for approval and governance.
6. Separation of presentation, domain logic, and persistence.
7. Explicit feature availability.
8. Stable identifiers and version control.
9. Accessibility and responsive design.
10. Data integrity and recoverability.
11. Secure integration boundaries.
12. Governed architectural change.

The workbench must never present a proposed, simulated, or unavailable capability as a functioning production feature.

## 4. Users and access boundaries
| User | Responsibility |
|---|---|
| Learner | Study, practice, build, submit, and demonstrate |
| Instructor | Facilitate learning and review progress |
| Curriculum Author | Create courses, lessons, and learning activities |
| Subject-Matter Reviewer | Review factual and technical quality |
| Instructional Reviewer | Review pedagogy and learning outcomes |
| Assessor | Evaluate submissions against criteria |
| Publisher | Authorize content publication |
| Studio Administrator | Manage application and curriculum configuration |
| Platform Administrator | Manage platform-level operations |
| Auditor | Inspect authorized evidence and governance history |

### 4.1 Authorization requirements
In an authenticated deployment: learners access their own permitted records; instructors access assigned learners and cohorts; authors edit authorized content; reviewers inspect submitted versions; publishers perform authorized publication actions; administrators manage assigned configuration scopes; auditors receive appropriately restricted, read-only access. **Authorization must be enforced by the backend. Hiding a frontend button is not security.**

## 5. Complete workbench information architecture
### 5.1 Learner Workbench
1. Home Dashboard. 2. My Learning. 3. Learning Paths. 4. Programme and Curriculum Map. 5. Course Catalogue. 6. Course Overview. 7. Lesson Studio. 8. Practice Lab. 9. Project Studio. 10. Assessment Center. 11. 82-Theory Explorer. 12. Knowledge Library. 13. AI Tutor. 14. Competency Center. 15. Learner Portfolio. 16. Learning Analytics. 17. Sprint and Capstone Workspace. 18. Profile and Preferences. 19. Help and System Information.

### 5.2 Instructor and Content Workbench
1. Instructor Dashboard. 2. Cohort and Learner Overview. 3. Learning Assignment. 4. Submission Review. 5. Feedback and Remediation. 6. Assessment Authoring. 7. Rubric Management. 8. Curriculum Authoring. 9. Lesson and Activity Authoring. 10. Source and Reference Management. 11. Content Quality Review. 12. Content Version History. 13. Publication Requests.

These capabilities require appropriate authentication, authorization, persistence, and audit services before being represented as operational multi-user functionality.

### 5.3 Administration and Governance Workbench
1. Application Overview. 2. User and Role Administration. 3. Curriculum Registry. 4. Content Lifecycle and Approval. 5. Assessment Configuration. 6. Competency Configuration. 7. Knowledge and Source Integration. 8. AI Service Configuration. 9. Analytics Configuration. 10. Security and Privacy Settings. 11. Audit and Change History. 12. Import, Export, Backup, and Recovery. 13. Release and Deployment Status. 14. System Health and Configuration.

## 6. Global application shell
### 6.1 Components
Application logo and identity; primary navigation; contextual page title; breadcrumb navigation; search interface; profile and preferences; notification area when actual notification events exist; main content area; contextual help; footer and application version.

### 6.2 Responsive behavior
| Environment | Layout |
|---|---|
| Desktop | Persistent navigation and multi-column content |
| Tablet | Collapsible navigation and responsive panels |
| Mobile | Compact navigation and single-column layout |

All critical functionality must remain accessible on mobile.

### 6.3 Shared components
Dashboard, course, lesson, project and assessment cards; progress and status indicators; tables; forms; search and filtering; tabs; dialogs; notifications; empty, loading and error states; confirmation interfaces.

### 6.4 Status semantics
Content status, learner status, assessment status, and system verification status must remain separate.

| Category | Example states |
|---|---|
| Content | Draft, In Review, Approved, Published, Superseded |
| Learning | Not Started, In Progress, Submitted, Completed |
| Assessment | Not Attempted, Attempted, Passed, Needs Practice, Reviewed |
| Verification | Not Tested, In Progress, Passed, Failed, Blocked |
| Persistence | Saved Locally, Save Failed, Import Validated, Import Rejected |

## 7. Learner Workbench functional architecture
### 7.1 Home Dashboard
Purpose: a consolidated starting point. Components: welcome and learner context; Continue Learning; current learning path; course progress; recent activities; pending exercises; recent projects; competency progress; portfolio access; domain navigation. Behavior: resume the last valid learning location; show actual persisted progress; provide meaningful empty states; link every active card to a working destination; avoid fabricated activity, streaks, or recommendations.

### 7.2 My Learning
Views: In Progress, Not Started, Completed, Saved, Needs Practice. Functions: filter by domain, course and learning status; resume learning; view course details; review completion history.

### 7.3 Learning Paths
Each path includes: path ID and version; description and purpose; target audience; entry requirements; learning outcomes; competency relationships; course sequence; prerequisites; completion criteria; required evidence. Path progress must be calculated from actual requirements rather than manually fabricated percentages.

### 7.4 Programme and Curriculum Map
Presents the entire 24-course programme. Functions: browse the four programme areas; view course relationships; inspect learning sequences; identify prerequisites; view lesson counts; track curriculum development status; open individual course pages.

### 7.5 Course Catalogue
Search courses; filter by domain, level and topic; view descriptions, learning outcomes, prerequisites and content availability. Each course must have a stable ID and version.

### 7.6 Course Overview
Every course page contains: course identity; description; learning objectives; prerequisites; modules; lessons; practice activities; projects; assessments; related competencies; references; completion criteria; content status.

### 7.7 Lesson Studio
Every complete lesson requires: lesson ID; version; course and module relationship; learning objectives; prerequisites; instructional content; examples; demonstrations; source references; guided activity; independent practice; knowledge checks; assessment criteria; feedback; evidence requirements; review status.

| Area | Function |
|---|---|
| Left panel | Course and lesson navigation |
| Center | Instructional content |
| Right panel | Objectives, references, and progress |
| Bottom | Practice, assessment, and navigation |

A lesson title or placeholder is not a complete instructional lesson.

### 7.8 Practice Lab
Purpose: controlled practical learning environments. Each lab defines: lab ID; version; objectives; scenario; setup instructions; required inputs; tasks; expected outputs; validation rules; hints; safety boundaries; submission format; feedback. The system must distinguish self-checks, automated validation, and human review.

### 7.9 Project Studio
Components: project brief; learning objectives; competency targets; requirements; deliverables; milestones; task sequence; resources; acceptance criteria; submission; feedback; reflection; portfolio integration. Lifecycle: Draft → In Progress → Submitted → Reviewed → Revision Required / Accepted. These states are target behavior and require the relevant persistence and review services.

### 7.10 Assessment Center
Types: multiple choice; true/false; short answer; structured response; scenario analysis; practical task; project assessment; rubric-based assessment. Each assessment includes: ID and version; learning objectives; questions or tasks; response types; scoring method; pass criteria; feedback; retry rules; evidence requirements; review requirements. The application must distinguish assessment completion from demonstrated competency and official credential issuance.

### 7.11 82-Theory Explorer
Features: theory catalogue; search and filtering; detail pages; stable identifiers; descriptions and classifications; relationships; available references; provenance information; structural validation; collection integrity reporting. The collection remains 68 existing registry theories plus 14 synthesized concrete theories. Missing source information must be disclosed, not invented.

### 7.12 Knowledge Library
Resource categories: documents; references; articles; procedures; diagrams; videos; research materials; knowledge records; external resources. Every resource should have a stable ID, title, type, source, version where known, related learning objects, and access classification.

### 7.13 AI Tutor
Purpose: support understanding, research, explanation, and reflection. Target capabilities: explain concepts; compare theories; summarize lessons; answer curriculum questions; provide learning guidance; help interpret exercises; retrieve permitted references; support reflective learning.

Target AI architecture: prompt input → context identification → permission validation → knowledge retrieval → context construction → authorized model invocation → response validation → source attribution → user feedback.

**Existing capability boundary:** the earlier architecture identifies a local rule-based tutor rather than a verified live AI model connection. The interface must disclose whether it is using local responses or an actual AI service. The AI Tutor must not independently approve curriculum, change canon, or certify competency.

### 7.14 Competency Center
Each competency includes: ID; description; scope; observable behaviors; required knowledge; required skills; proficiency framework; related courses; assessment criteria; evidence requirements; review status. The established Learning Studio L0–L4 learning progression must remain distinct from WorldForge architecture maturity and other competency frameworks.

### 7.15 Learner Portfolio
Components: project artifacts; exercise outputs; assessment results; learning evidence; competency records; reflections; supporting documents. Each record identifies its source activity, creation date, version, and evaluation state where available. A saved artifact is not automatically accepted evidence.

### 7.16 Learning Analytics
Learning progress; course and lesson completion; assessment performance; project milestones; competency evidence; learning activity; knowledge gaps where supported by actual assessment data. Analytics must distinguish observed measurements, derived metrics, and interpretations.

### 7.17 Sprint and Capstone Workspace
The 3-Day AI Engineering Sprint (15 task controls) and the Governance AI Capstone learning path. Functions: day and task navigation; task instructions; expected outputs; completion state; artifact capture; portfolio integration; capstone evidence. A learner-checked task is not equivalent to independently verified completion.

### 7.18 Profile and Data Management
Display profile; learning preferences; progress settings; export, import and reset data. The local-first implementation must explain that browser-local data is not automatically synchronized across devices.

## 8. Instructor and Content Workbench
- **8.1 Instructor Dashboard:** assigned cohorts; learner progress; pending submissions; assessment reviews; feedback workload; relevant learning activity.
- **8.2 Cohort Management:** create and manage cohorts; assign learning paths; view permitted learner progress; manage cohort activity; track submissions.
- **8.3 Learning Assignment:** programmes, learning paths, courses, projects, assessments. Assignments require stable references, ownership, version information, and audit history.
- **8.4 Submission Review:** review queues; artifact inspection; rubric evaluation; feedback; revision requests; review history.
- **8.5 Curriculum Authoring:** course structures; modules; lessons; learning objectives; examples; activities; assessments; competency mapping; references; versions.
- **8.6 Content Review:** Draft → Submitted for Review → In Review → Approved → Published. Other states: Needs Revision, Rejected, Withdrawn, Superseded. Publication requires the configured checks and explicit authorization.

## 9. Administration and Governance Workbench
- **9.1 Application Administration:** configuration; navigation configuration; feature availability; curriculum registry; application version.
- **9.2 Identity and Access Administration:** user identity; authentication; session management; role assignments; permissions; access revocation; audit events.
- **9.3 Governance Console:** content lifecycle; approval workflow; publication history; version history; change records; audit inspection.
- **9.4 Data Operations:** import validation; export; backup; restore; migration; retention; deletion.
- **9.5 System Monitoring:** only measurable information — application version; build revision; environment; storage availability; service availability; last successful data operation; error state.

## 10. Core user workflows
1. **Learning:** discover → select a path → open a course → study lessons → practice → attempt assessments → build projects → save artifacts and evidence → review competency development.
2. **Practice:** open lab → inspect instructions → prepare environment → perform task → validate output → save response → receive feedback → revise.
3. **Project:** open project → inspect brief → plan milestones → build deliverables → self-check → submit → receive feedback → revise → preserve in portfolio.
4. **Assessment:** load assessment version → present questions → collect answers → validate → evaluate → record results → provide feedback → support remediation.
5. **Competency:** identify competency → inspect criteria → gather evidence → evaluate evidence → record review → determine supported competency state.
6. **Content publication:** create content → attach sources → validate → submit for review → resolve findings → approve → publish version → preserve history.
7. **Data import:** select file → parse → validate schema → inspect changes → confirm → apply → report result. Invalid imports must not overwrite valid existing state.

## 11. Data architecture
### 11.1 Domain boundaries
Curriculum; Instruction; Assessment; Competency; Learner; Knowledge; Governance; Application; Integration.

### 11.2 Core entity catalogue
| Entity | Responsibility |
|---|---|
| LearningApplication | Application identity and configuration |
| Programme | Programme definition |
| LearningDomain | Domain classification |
| LearningPath | Sequenced learning |
| Course | Course definition |
| Module | Course subdivision |
| Lesson | Instructional unit |
| LearningObjective | Learning outcome |
| Activity | Learning activity |
| Lab | Practical exercise |
| Project | Applied learning |
| Assessment | Assessment definition |
| AssessmentItem | Question or task |
| AssessmentAttempt | Learner attempt |
| Rubric | Evaluation criteria |
| Competency | Capability definition |
| Evidence | Supporting competency evidence |
| LearnerProfile | Learner preferences and identity reference |
| ProgressRecord | Learning state |
| PortfolioArtifact | Learner-created output |
| KnowledgeSource | Reference source |
| TheoryRecord | Theory collection record |
| ReviewRecord | Review outcome |
| PublicationRecord | Published version |
| AuditEvent | Change and activity record |
| ApplicationSetting | System configuration |

### 11.3 Data integrity
Stable identifiers; referential integrity; schema validation and versioning; controlled lifecycle values; version preservation; atomic state changes; validated imports; recoverability; explicit deletion semantics.

### 11.4 Progress model
Keep these states distinct: Not Started · In Progress · Activity Submitted · Assessment Attempted · Assessment Passed · Completion Criteria Satisfied · Competency Evidence Reviewed · Credential Issued. Credential issuance requires an authorized issuer and verification process.

## 12. Application and service architecture
### 12.1 Logical layers
| Layer | Responsibility |
|---|---|
| Experience | User interfaces |
| Navigation | Routes and menus |
| Presentation | Components and pages |
| Application Services | Business use cases |
| Domain | Learning and governance rules |
| Content | Curriculum and resources |
| Persistence | Local or remote storage |
| Integration | AI, knowledge, identity, external services |
| Governance and Security | Authorization, validation, audit |
| Infrastructure | Hosting, build, deployment, backup |

### 12.2 Frontend responsibilities
Render interfaces; manage navigation; collect inputs; perform usability validation; call application services; display operation results; manage local state where supported.

### 12.3 Backend responsibilities
A future backend may provide: authentication; authorization; curriculum APIs; learner records; progress persistence; assessment services; submission management; audit records; Knowledge Graph integration; AI orchestration; analytics; backup and recovery. The existence of this architecture does not establish that those backend services are currently deployed.

### 12.4 API requirements
Each API defines: endpoint; method; version; authentication; authorization; request and response schema; validation; error handling; pagination; rate limits; audit behavior; compatibility rules.

## 13. Persistence and synchronization
### 13.1 Current local-first architecture
Browser localStorage is the learner-state mechanism. Lifecycle: Initialize → Read → Parse → Validate → Render → Interact → Persist → Confirm. Requirements: safe initialization; malformed-data handling; storage-error reporting; schema-versioned export; validated import; deliberate reset; data-loss disclosure; no false cloud-sync claims.

### 13.2 Future remote persistence
Before remote synchronization, define: user ownership; authorization; database schema; transactions; concurrency; conflict resolution; offline behavior; audit history; retention; deletion; backup; restoration; migration. Local and remote data must not be mixed without explicit precedence rules.

## 14. AI-assisted learning architecture
**Learner assistance:** explanation; knowledge retrieval; concept comparison; study support; reflection; feedback assistance.
**Content production:** source extraction; lesson drafting; question generation; rubric drafting; instructional transformation; quality assistance.

Required safeguards: source attribution; human review; permission-aware retrieval; input and output validation; no automatic canon changes; no automatic competency certification; secure credential handling; rate limiting; privacy controls; versioned service configuration.

## 15. Security and privacy
### 15.1 Current trust boundary
The local-first application operates within the browser. Browser storage is not equivalent to secure account authentication or protected multi-user records.

### 15.2 Security requirements
Treat user input as untrusted; validate imported data; prevent unsafe HTML injection; never execute imported content as code; keep secrets out of frontend bundles; use HTTPS in production; enforce server-side authorization; secure session management; apply rate limits; protect backups; define retention and deletion; maintain dependency security; test security boundaries.

### 15.3 Trust distinctions
The system must distinguish: original source material · extracted knowledge · interpretation · AI-generated explanation · learner submission · automated validation · human-reviewed evidence · approved curriculum · competency determination · official credential. **No category silently upgrades into another.**

## 16. UX and visual architecture
**Goals:** consistent, focused, responsive, intuitive, evidence-oriented, content-rich, accessible, scalable.
**Design system:** color; typography; spacing; navigation; layout; cards; forms; dialogs; tables; buttons; status indicators; progress visualization; learning media; feedback states.
**Accessibility:** target WCAG 2.2 AA where applicable — semantic HTML; logical headings; keyboard access; visible focus; accessible labels; screen-reader feedback; sufficient contrast; non-color status indicators; reduced motion; responsive zoom; accessible error messages; captions and transcripts where required. Automated accessibility checks alone do not establish conformance.

## 17. Search and discovery
Search covers authorized programmes, courses, lessons, resources, theories, projects and competencies. Requirements: search by title and content where indexed; filter by type; display record context; preserve stable links; respect access permissions; handle missing and superseded records; avoid exposing restricted information in results.

## 18. Analytics and reporting
Potential metrics: learning participation; course progression; lesson completion; assessment performance; project submissions; competency evidence; programme effectiveness. Metrics must distinguish raw observations, calculated measurements, and interpretations. Privacy and access rules must be defined before organizational reporting is enabled.

## 19. Testing and verification architecture
### 19.1 Test layers
Unit; component; integration; end-to-end; accessibility; security; deployment; recovery.

### 19.2 Core acceptance scenarios
Dashboard loads correctly · active navigation works · course and lesson records resolve · learning objectives display correctly · practice state persists where supported · assessment scoring follows defined rules · portfolio references resolve · theory collection validates against the established 82-record structure · invalid imports preserve existing state · export files are valid and versioned · browser reload restores supported progress · mobile navigation works · keyboard navigation works · AI Tutor capability disclosure is accurate · no unsupported cloud, AI, or certification claims appear · deployment serves the intended revision · existing root website remains intact.

### 19.3 Verification record
Each test records: test ID; requirement ID; environment; browser; repository revision; test command; observed result; evidence location; date; failure or limitation. States: Not Tested, In Progress, Passed, Failed, Blocked, Not Applicable.

## 20. Deployment and operations
### 20.1 Existing deployment boundary
A standalone static frontend deployed under `/learning-studio/`, intended to preserve the existing root website. The actual hosting configuration and live release must be verified against the repository before deployment claims are made.

### 20.2 Release process
1. Identify authorized source revision. 2. Review the change set. 3. Run tests. 4. Validate build output. 5. Verify asset paths. 6. Verify base-path configuration. 7. Deploy without overwriting unrelated root content. 8. Open the deployed URL. 9. Test core workflows. 10. Verify the served revision. 11. Record release evidence. 12. Preserve rollback capability.

### 20.3 Operational requirements
Dependency management; browser compatibility; broken-route monitoring; data integrity; import/export reliability; service-worker cache versioning; accessibility regression checks; backup and recovery; release traceability; incident management.

## 21. Requirements traceability
| Prefix | Scope |
|---|---|
| LS-WB-OBJ | Objectives |
| LS-WB-NAV | Navigation |
| LS-WB-SHELL | Application shell |
| LS-WB-LRN | Learner modules |
| LS-WB-INS | Instructor modules |
| LS-WB-ADM | Administration |
| LS-WB-WF | Workflows |
| LS-WB-DATA | Data architecture |
| LS-WB-SVC | Services |
| LS-WB-AI | AI capabilities |
| LS-WB-SEC | Security |
| LS-WB-UX | UX and accessibility |
| LS-WB-ANA | Analytics |
| LS-WB-TST | Testing |
| LS-WB-DEP | Deployment |

Every requirement must map to: Requirement → Specification → Implementation → Test → Verification → Known Limitations.

## 22. Implementation boundaries and sequencing
This specification defines the target architecture. It does not claim that all features are currently implemented. Implementation areas: 1. Workbench foundation. 2. Core learner experience. 3. Practice and evidence. 4. Knowledge integration. 5. Learning assistance. 6. Instructor and content operations. 7. Administration and governance. 8. Enterprise integrations. Each capability must be tracked against actual code and verification evidence.

## 23. Risks and controls
| Risk | Control |
|---|---|
| Learner application confused with production studio | Maintain product boundary |
| Specified feature presented as implemented | Evidence-based status |
| Programme blueprint mistaken for completed content | Separate curriculum lifecycle states |
| Theory collection mistaken for verified provenance | Separate validation and provenance |
| Local storage mistaken for cloud records | Explicit disclosure |
| Completion mistaken for competency | Evidence-based evaluation |
| Local tutor mistaken for live AI | Capability disclosure |
| Frontend roles mistaken for security | Backend authorization |
| Invalid import destroys data | Validation before replacement |
| AI content published without review | Human approval |
| Analytics overstate ability | Distinguish observed and inferred data |
| Deployment damages root site | Base-path validation and rollback |

## 24. Acceptance criteria
Ready for implementation planning when: the three workspaces are defined; every module has a clear purpose; navigation and routes are documented; core workflows are defined; data entities and relationships are specified; local and remote persistence boundaries are explicit; AI and provenance controls are defined; assessment and competency states are distinct; security, privacy and accessibility requirements are included; testing scenarios are mapped; implementation gaps can be tracked without misrepresenting progress. Production release requires separate evidence of implementation, testing, security review, deployment verification, and authorized acceptance.

## 25. Change control and governance
Additive architecture specification. Preserve existing architecture documents; record conflicts before changing source documents; do not convert proposals into established facts; preserve the 82-theory collection definition; preserve the 24-course and 96-lesson programme definition; record authorized changes and version history; keep architecture status separate from implementation and verification status.

## 26. Source references and implementation anchors
- LS-ARCH-WEB-001 — Learning Studio Full Website Architecture Specification.
- AH-AIOS Learning App Studio — Complete Definition and Platform Specification.
- AH-AIOS Learning Studio — System Architecture Specification.
- AH-AIOS Learning Studio — Claude Development Workbench.
- GitHub: hydraporss/ah-aios-react-website.

Implementation anchors: `index.html`, `styles.css`, `app.js`, `curriculum-data.js`, `theory-validation.js`, `manifest.webmanifest`, `sw.js`, `package.json`, `README.md`, `DEPLOYMENT.md`, `VERIFICATION.md`. These are architecture-document references, not a fresh verification of the current repository contents. GitHub remains the implementation and source-control environment; Notion remains the architecture and governance documentation environment.

## 27. Complete system definition
AH-AIOS Learning Studio Workbench is the integrated, responsive learning environment that connects curriculum discovery, structured instruction, practical experimentation, project execution, assessment, knowledge access, competency evidence, and learner development. It provides a coherent learner experience and defines controlled instructor, content, and administration workspaces. Its architecture preserves the distinction between the current local-first application and future authenticated, integrated, AI-enabled, and governed services.

## 28. Architecture completion statement
The specification establishes the complete target architecture across the application experience, functional workspaces, domain model, workflows, service boundaries, data lifecycle, AI capabilities, governance, security, testing, deployment, and recovery. It is the reference specification for subsequent implementation and verification work.

**LEARN. BUILD. GOVERN. CREATE.**
*Develop freely. Distinguish clearly. Canonize deliberately. Verify continuously.*
