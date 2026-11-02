# Learning App specs vs Master Release: reconciliation (r7)

Date: 2026-11-01. Comparison only. Nothing in the release was changed to match either spec. Both are preserved as received and every item in them is **Specified**:

- `AH-LRN-APP-001-v1.0.md` ("001"): Proposed architecture definition, pending approval.
- `AH-AIOS-LEARNING-APP-v1.1.md` ("v1.1"): architecture extensions, schemas, backlog. Its relationship to 001 is not stated; treated here as an extension of 001.

Compared against: `docs/LearningStudio-Complete-System-Architecture-Specification.md` (LS-ADR-001..008), `docs/LS-WB-ARCH-001.md`, `docs/AH-CORE-ARCH-001.md` (ADR-CORE-001..009), `harness/overview.html` (AH-AH-ARCH-001), `docs/AH-AIOS-README.original.md`, `learning/curriculum-data.js`, the Learning Studio data dictionary and known limitations.

## 1. Aligned

| Topic | Spec | Release |
|---|---|---|
| Status honesty | 001: "Proposed… pending formal approval"; criteria "not claims of present implementation" | Specified/Designed/Implemented... vocabulary; "not production-ready" |
| Layering | 001 §4: Core governs, Harness executes, WorldForge knowledge; AION "not a fourth domain" | AH-AH-ARCH-001: CORE governs, HARNESS executes, WorldForge owns knowledge; Learning Studio is an application |
| Technology | 001 §17: React, Vite, FastAPI, PostgreSQL, SQLAlchemy | ADR-CORE-001..003 |
| Studio vs app | 001 §18 | LS-WB-ARCH-001 §2 |
| Evidence over completion | 001 §9, §16; v1.1 ADR-003 | LS-ADR-008; LS-WB-ARCH-001 §11.4 |
| Retrieve before generate | 001 §6.4, P4; v1.1 ADR-002 | Spec §12.3 |
| No single score as mastery | 001 §10 | Assessment framework: "a total score must not conceal a critical failure" |
| Observed vs derived vs inferred analytics | 001 §10 | LS-WB-ARCH-001 §7.16 |
| Data integrity list | 001 §15 | LS-WB-ARCH-001 §11.3 |

## 2. Conflicts needing an owner decision

| # | Spec | Release | Suggested resolution |
|---|---|---|---|
| 1 | AION is the "Cognitive Mentor" (001 and v1.1). v1.1 ADR-004: AION operates across Core, WorldForge, Harness. | Original README: AION is the metaphysical foundation (the First Nine's ninth position). "Cognitive Mentor" appears nowhere in the release. The tutor is local and rule-based. | Rename the mentor, or redefine AION and record the collision. |
| 2 | 001 Phase 1 includes an AION interaction interface; Phase 5 curriculum generation. | No live AI until roadmap Phase 5, after backend and identity (Phase 4). | Phase 1 = rule-based tutor, or move live AION later. |
| 3 | 001 puts identity and access in the final phase (7), yet personalizes throughout. v1.1 G1 includes accounts. | Identity (Phase 4) precedes live AI (Phase 5). No accounts today. | Identity before any per-learner AION. |
| 4 | Three mastery models: 001's 7 dimensions (Awareness, Understanding, Application, Analysis, Integration, Transfer, Retention); v1.1's KGI (4 inputs) and 0-100 threshold of 80. | 1-4 scale over 7 different dimensions (Accuracy, Traceability, Completeness, Reasoning, Verification, Stewardship, Communication); thresholds published per course; no credential thresholds. | Decide whether "what was learned" (001) and "how well it was done" (release) are two views and map them; drop the global 80 and the KGI unless defined. |
| 5 | 001 lifecycle: Proposed, Investigated, Validated, Approved (+ Rejected, Needs Evidence, Superseded). | Curriculum lifecycle: Specified, Authored, Reviewed, Approved, Published. "Investigated" appears in `learning/index.html`; "Needs Evidence" is not in the release. | Declare one lifecycle for knowledge and one for curriculum, and map them. |
| 6 | v1.1: Neo4j graph-first (ADR-001); Kafka / RabbitMQ / Azure Service Bus. 001 leaves "graph-based data structures" open. | ADR-CORE-002 PostgreSQL; no graph DB or bus anywhere; shipped backend is Flask, not FastAPI. | Treat graph and bus as options; state the relationship to PostgreSQL. |
| 7 | v1.1 ADR-001..005. | LS-ADR-001..008 and ADR-CORE-001..009 exist. | Renumber as LA-ADR-xxx. |
| 8 | v1.1 gates G1-G7. 001 phases 1-7. | Roadmap phases 1-5 (stabilize, curriculum completeness, evidence, backend and identity, live AI). 20 lessons authored draft, 76 specified only, 0 reviewed. | One sequence; curriculum completeness must be explicit (001 only has acceptance criterion 8). |
| 9 | 001 P1-P11 principles. v1.1 "now fully defined". | LS-WB-ARCH-001 has 12 principles; status is partially implemented. | Say whether P1-P11 extend or replace the 12; mark v1.1 items Specified. |
| 10 | 001 §7: WorldForge supplies curriculum architecture and course/lesson structures. | WorldForge owns knowledge models, provenance and canon approval; curriculum lives in Learning Studio / Learning App Studio. | Clarify which owns curriculum data. |

## 3. Gaps inside the specs

- v1.1 defines Competency twice with different fields. `objectiveIds` on Lesson/Assessment have no graph edge; no Learner-Competency or Evidence-Assessment edge; Skill, Capability, Concept, Module, Evidence lack JSON schemas.
- v1.1 KGI inputs have no measurement source; Velocity has no unit; Retention divides by a peak that does not exist on a first attempt; "Verified" confidence collides with the release's Verified status (needs an authorized reviewer, impossible in the anonymous local app). Spaced-repetition intervals have no scheduling entity.
- 001 has no data schemas; v1.1 schemas do not cover 001's Learning Program, Learning Activity, learner model or content lifecycle states.
- Entities in LS-WB-ARCH-001 §11.2 missing from both: LearningPath, Lab, Project, AssessmentItem, AssessmentAttempt, ProgressRecord, PortfolioArtifact, ReviewRecord, PublicationRecord, AuditEvent.
- v1.1 events lack the review lifecycle and a structural-vs-provenance validation split.
- Neither maps Bloom levels or 001's 7 dimensions to the Learning Studio L0-L4 progression.
- Naming: "Learning App" vs "Learning Studio". 001 hierarchy "Learning Program" vs release "Programme". Art examples in v1.1 are illustrative; the release programme is Core 6, Harness 7, WorldForge 8, Human Stewardship 3 (24 courses, 96 lessons). `USER-001` implies accounts; the release profile is local and unauthenticated.
- None of 001's 26 acceptance criteria are met today (no accounts, AION or knowledge graph).

## 4. Not done

No merged v1.2 was produced and no release spec was edited. Open release owner decisions (82 vs 86 theories, "68 + 14" wording, LICENSE, deployment approval, WorldForge React source, Supabase key rotation) are unchanged.
