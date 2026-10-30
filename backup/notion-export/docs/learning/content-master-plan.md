<!-- Exported from Notion page 40966662-b29d-814f-bca6-d94c6fc16fde; source path docs/learning/content-master-plan.md; exported 2026-10-30. Content is preserved as retrieved Notion page text. -->

**Source repository:** [hydraporss/ah-aios-react-website](https://github.com/hydraporss/ah-aios-react-website)

**Source branch:** `ah-aios-learning-package`

**Source path:** `docs/learning/content-master-plan.md`

**Git blob SHA:** `b124c7c55818b2a7e28899139c30745c3fcb343e`

**Export method:** Full UTF-8 source text fetched from the exact branch path and copied into this Notion page. Source content follows unchanged.

---

# AH-AIOS Learning Content Master Plan

**Document ID:** AH-LEARN-MASTER-001
**Version:** 0.1.0
**Status:** SUGGESTION / PROCESS — instructional design plan, not canon
**Parent package:** AH-AIOS Learning Package v0.1.0
**Branch:** ah-aios-learning-package

## 1. Purpose and boundaries

This plan expands the existing AH-AIOS Learning package into a detailed instructional blueprint. It defines the course catalogue, module and lesson coverage, exercises, assessment evidence, content standards, and production workflow.

It does not authorize changes to AH-AIOS or AFTER HUMANITY canon. It does not assert that a learning application, AI tutor, analytics service, or credential issuer has been implemented.

**Learning progression:** Discover → Learn → Experiment → Build → Demonstrate.

### Learning domains

1. **AH-AIOS Core** — architecture foundations, identity and access, security and policy, audit and evidence, governance and controlled change.
2. **AI Harness** — models, agents, tools, APIs, orchestration, evaluation, reliability, and safe operation.
3. **WorldForge** — knowledge modeling, worldbuilding, sources and claims, evidence and provenance, canon governance, graph operations, continuity, and trust/risk.
4. **Human Stewardship** — cross-cutting judgment, oversight, accountability, evidence literacy, and responsible operation. It is not a fourth technical subsystem.
5. **AFTER HUMANITY** — an authorized creative and intellectual context for applied examples, not a separate AH-AIOS implementation domain.

### Status language

- **Specified:** described in a document.
- **Authored:** instructional content has been written.
- **Reviewed:** required subject and instructional reviews have occurred.
- **Published:** available to learners in the designated delivery environment.
- **Tested:** exercised against stated criteria.
- **Deployed:** operating in its target software environment.
- **Production-assured:** operational, security, privacy, reliability, and governance requirements have been verified to the applicable standard.

These states are not interchangeable. Course completion alone does not demonstrate competency.

## 2. Program architecture

| Level | Learning object | Required contents |
| --- | --- | --- |
| Program | AH-AIOS Learning | Domains, audience, competency model, governance |
| Path | Core, AI Harness, WorldForge, Stewardship | Entry requirements, sequence, outcomes |
| Course | Bounded subject area | Outcomes, modules, assessment plan |
| Module | Coherent capability unit | Objectives, lessons, practice, checkpoint |
| Lesson | One teachable topic | Explanation, examples, activity, knowledge check |
| Exercise | Bounded learner task | Inputs, instructions, expected output, feedback |
| Lab / Project | Integrated applied work | Environment, tasks, artifacts, validation |
| Assessment | Evaluation event | Published rubric, evidence, outcome, reviewer record |

### Competency levels

- **L0 — Orientation:** recognizes purpose, vocabulary, boundaries, and learning resources.
- **L1 — Foundation:** explains concepts and follows guided examples.
- **L2 — Applied:** completes bounded tasks and produces artifacts with guidance.
- **L3 — Independent:** completes defined work, tests outcomes, and explains trade-offs.
- **L4 — Stewardship / Advanced:** designs or reviews systems, handles exceptions, and demonstrates accountable governance.

These are learner proficiency levels. They do not replace WorldForge's architecture maturity model or establish production assurance.

## 3. Course catalogue

| Course ID | Course | Domain | Target level | Main evidence |
| --- | --- | --- | --- | --- |
| AH-CORE-100 | AH-AIOS Orientation and System Map | Core | L0–L1 | System map and glossary check |
| AH-CORE-110 | Architecture and System Boundaries | Core | L1–L2 | Architecture explanation |
| AH-CORE-120 | Identity, Roles, and Access Control | Core | L1–L3 | Access scenario analysis |
| AH-CORE-130 | Security, Policy, and Safe Operation | Core | L1–L3 | Threat and policy review |
| AH-CORE-140 | Audit, Evidence, and Verification | Core | L1–L3 | Evidence trace |
| AH-CORE-150 | Governance and Controlled Change | Core | L1–L4 | Governed change case |
| AH-HAR-100 | AI Harness Foundations | AI Harness | L0–L1 | Component and execution map |
| AH-HAR-110 | Models, Agents, Context, and Instructions | AI Harness | L1–L2 | Agent task specification |
| AH-HAR-120 | Tool Contracts and Integrations | AI Harness | L1–L3 | Tool contract and tests |
| AH-HAR-130 | APIs, Data Contracts, and Service Boundaries | AI Harness | L1–L3 | API interaction specification |
| AH-HAR-140 | Workflow Orchestration and State | AI Harness | L2–L3 | Workflow model |
| AH-HAR-150 | Evaluation, Reliability, and Observability | AI Harness | L2–L4 | Evaluation suite and trace review |
| AH-HAR-160 | Safe Agent Operation and Human Oversight | AI Harness | L1–L4 | Safety analysis and approval design |
| AH-WF-100 | Knowledge-Model Foundations | WorldForge | L0–L2 | Entity and relationship model |
| AH-WF-110 | Worldbuilding and Domain Modeling | WorldForge | L1–L3 | Bounded world model |
| AH-WF-120 | Sources, Claims, and Evidence | WorldForge | L1–L3 | Source-to-claim map |
| AH-WF-130 | Provenance and Verification | WorldForge | L2–L4 | Traceability case |
| AH-WF-140 | Canon Governance and Change Control | WorldForge | L2–L4 | Canon change dossier |
| AH-WF-150 | Knowledge Graph Operations | WorldForge | L2–L4 | Validated graph and export |
| AH-WF-160 | Identity, Time, and Narrative Continuity | WorldForge | L2–L4 | Continuity audit |
| AH-WF-170 | Trust, Risk, and Conflicting Knowledge | WorldForge | L2–L4 | Conflict and risk assessment |
| AH-STW-100 | Evidence Literacy and Critical Judgment | Stewardship | L0–L2 | Claim evaluation |
| AH-STW-110 | Human Oversight and Accountability | Stewardship | L1–L3 | Oversight plan |
| AH-STW-120 | Responsible Knowledge Stewardship | Stewardship | L2–L4 | Stewardship review |

Course IDs in this document are proposed instructional identifiers. They do not replace or modify existing AH-AIOS, WorldForge, or theory identifiers.

## 4. Detailed course and lesson blueprint

Each lesson is a separate authoring unit. The exercise listed for each lesson should produce reviewable evidence. Full scripts, examples, answer keys, media, and instructor notes are authored during course production.

### 4.1 AH-AIOS Core

#### AH-CORE-100 — AH-AIOS Orientation and System Map

**Outcome:** Explain the purpose, domains, boundaries, and learning progression of AH-AIOS.

- M1.1 Why AH-AIOS exists — problem space and intended purpose. Exercise: write a source-grounded purpose statement.
- M1.2 AH-AIOS domain map — distinguish Core, AI Harness, WorldForge, and cross-cutting Human Stewardship. Exercise: classify example capabilities and justify the classification.
- M1.3 AFTER HUMANITY as a knowledge context — distinguish creative canon from a technical subsystem. Exercise: classify sample resources by authority.
- M1.4 Vocabulary and status language — distinguish specified, authored, reviewed, implemented, tested, deployed, and production-assured. Exercise: correct an overstated status report.
**Assessment:** annotated system map, terminology check, and written boundary explanation.

#### AH-CORE-110 — Architecture and System Boundaries

**Outcome:** Explain component responsibilities, interfaces, dependencies, and separation of concerns.

- M1.1 Architecture as responsibilities and relationships. Exercise: identify component responsibilities.
- M1.2 Components, interfaces, and dependencies. Exercise: draw and label a dependency map.
- M1.3 Trust boundaries and data movement. Exercise: trace a request and mark trust boundaries.
- M1.4 Prototype, service foundation, and production system. Exercise: classify implementation evidence without promoting prototype status.
**Assessment:** architecture diagram, interface inventory, and boundary analysis.

#### AH-CORE-120 — Identity, Roles, and Access Control

**Outcome:** Analyze access scenarios using identity, role, permission, and least-privilege concepts.

- M1.1 Identity, authentication, and authorization. Exercise: distinguish the three in scenarios.
- M1.2 Roles, permissions, and resource scope. Exercise: build a fictional role-permission matrix.
- M1.3 Least privilege and access lifecycle. Exercise: review an over-permissioned account and document a correction.
- M1.4 Access decisions and audit evidence. Exercise: map a request to the evidence needed to explain its authorization outcome.
**Assessment:** role-permission matrix and scenario analysis. Never use real credentials in exercises.

#### AH-CORE-130 — Security, Policy, and Safe Operation

**Outcome:** Identify security boundaries and explain how policy and human review constrain operation.

- M1.1 Assets, threats, and attack surfaces. Exercise: create a bounded threat inventory.
- M1.2 Policy rules and enforcement points. Exercise: map policy statements to enforcement responsibilities.
- M1.3 Untrusted input and instruction conflicts. Exercise: analyze a sample untrusted-content scenario.
- M1.4 Incident recognition and escalation. Exercise: classify incidents and draft an escalation record.
**Assessment:** threat model, policy-to-control map, and incident tabletop response.

#### AH-CORE-140 — Audit, Evidence, and Verification

**Outcome:** Distinguish claims, evidence, observations, and verification results.

- M1.1 What counts as evidence. Exercise: sort observations, assertions, artifacts, and assumptions.
- M1.2 Audit events and traceability. Exercise: construct an event sequence for a sample operation.
- M1.3 Verification criteria and reproducibility. Exercise: turn vague success statements into testable criteria.
- M1.4 Reporting limitations and unresolved results. Exercise: write a report that preserves unknowns and failed checks.
**Assessment:** evidence dossier with source references, criteria, results, and limitations.

#### AH-CORE-150 — Governance and Controlled Change

**Outcome:** Describe how proposals, reviews, approvals, versions, and protected assets are handled.

- M1.1 Governance authority and scope. Exercise: classify who may propose, review, approve, and implement a sample change.
- M1.2 Change proposals and rationale. Exercise: prepare a change record with source, impact, and verification plan.
- M1.3 Protected assets, conflicts, and history. Exercise: preserve a conflicting record without overwriting history.
- M1.4 Release, rollback, and post-change verification. Exercise: produce a release checklist and rollback conditions.
**Assessment:** governed change dossier. Real canon changes always require the applicable explicit authorization.

### 4.2 AI Harness

#### AH-HAR-100 — AI Harness Foundations

**Outcome:** Explain models, agents, tools, context, instructions, and execution environments.

- M1.1 Model, agent, harness, and application. Exercise: label components in a sample architecture.
- M1.2 Context, instructions, and task boundaries. Exercise: separate task input, trusted instruction, and untrusted data.
- M1.3 Tool use and execution flow. Exercise: trace a tool call from request through result handling.
- M1.4 Human-in-the-loop operation. Exercise: identify actions requiring approval or escalation.
**Assessment:** annotated harness diagram and execution walkthrough.

#### AH-HAR-110 — Models, Agents, Context, and Instructions

**Outcome:** Specify a bounded agent task and explain its constraints.

- M1.1 Model capabilities and limitations. Exercise: match tasks to requirements and flag unsupported assumptions.
- M1.2 Agent roles and task decomposition. Exercise: decompose a bounded task into verifiable steps.
- M1.3 Context selection and source grounding. Exercise: build a context pack with source labels.
- M1.4 Instruction hierarchy and untrusted content. Exercise: analyze conflicting instructions and define safe handling.
**Assessment:** agent task specification with scope, inputs, outputs, authority limits, and failure behavior.

#### AH-HAR-120 — Tool Contracts and Integrations

**Outcome:** Define a tool interface that is explicit, constrained, and testable.

- M1.1 Tool purpose and action boundaries. Exercise: state purpose and prohibited actions.
- M1.2 Input and output schemas. Exercise: define fields, types, validation, and examples.
- M1.3 Permissions, secrets, and data handling. Exercise: identify excess authority and unsafe data exposure.
- M1.4 Errors, timeouts, and idempotency. Exercise: specify failure responses and retry behavior.
**Assessment:** tool contract, test cases, and permission review.

#### AH-HAR-130 — APIs, Data Contracts, and Service Boundaries

**Outcome:** Explain request/response patterns and specify a reliable service interaction.

- M1.1 HTTP and API fundamentals. Exercise: annotate a sample request and response.
- M1.2 Authentication concepts and secret handling. Exercise: identify safe and unsafe fictional patterns.
- M1.3 Schemas, validation, and compatibility. Exercise: review a versioned data contract.
- M1.4 Service errors and integration boundaries. Exercise: create an API failure-mode table.
**Assessment:** API integration specification with schemas, authentication boundary, and error handling.

#### AH-HAR-140 — Workflow Orchestration and State

**Outcome:** Model a multi-step workflow with explicit state, recovery, and human checkpoints.

- M1.1 Workflow steps and state transitions. Exercise: draw a state machine.
- M1.2 Delegation and tool sequencing. Exercise: assign tasks and define handoff conditions.
- M1.3 Retry, recovery, and duplicate-action risks. Exercise: design recovery for interrupted execution.
- M1.4 Human approval and escalation gates. Exercise: define review checkpoints and required evidence.
**Assessment:** workflow specification, state diagram, and test scenarios.

#### AH-HAR-150 — Evaluation, Reliability, and Observability

**Outcome:** Evaluate a workflow against explicit expectations and interpret execution evidence.

- M1.1 Evaluation objectives and test design. Exercise: turn objectives into acceptance criteria.
- M1.2 Positive, negative, and edge-case tests. Exercise: construct a balanced test matrix.
- M1.3 Logs, traces, and reproducibility. Exercise: interpret a fictional execution trace.
- M1.4 Regression and failure analysis. Exercise: diagnose a regression and propose verification tests.
**Assessment:** evaluation suite, results report, failure analysis, and reproducibility notes.

#### AH-HAR-160 — Safe Agent Operation and Human Oversight

**Outcome:** Design oversight that matches action risk and authority.

- M1.1 Risk tiers and action impact. Exercise: classify actions by consequence and reversibility.
- M1.2 Least authority and scoped tools. Exercise: reduce a sample agent's permissions.
- M1.3 Prompt injection and hostile data. Exercise: identify untrusted instructions in a supplied dataset.
- M1.4 Approval, escalation, and accountability. Exercise: design a review checkpoint and evidence record.
**Assessment:** safe-operation plan with risk classification, permissions, approval rules, and escalation path.

### 4.3 WorldForge

#### AH-WF-100 — Knowledge-Model Foundations

**Outcome:** Build a small structured model with stable entities and typed relationships.

- M1.1 Entities, attributes, and identifiers. Exercise: define entity types and stable IDs.
- M1.2 Relationship types and constraints. Exercise: model relationships and identify invalid combinations.
- M1.3 Controlled vocabularies and data quality. Exercise: normalize inconsistent terms.
- M1.4 Validation and model evolution. Exercise: test a model against valid and invalid cases.
**Assessment:** bounded knowledge model, schema notes, and validation report.

#### AH-WF-110 — Worldbuilding and Domain Modeling

**Outcome:** Represent a world or domain as connected, structured knowledge.

- M1.1 World scope and design boundaries. Exercise: write a scope statement and exclusions.
- M1.2 Places, peoples, groups, and institutions. Exercise: create a linked entity set.
- M1.3 Events, chronology, and causality. Exercise: build an event sequence and identify dependencies.
- M1.4 Characters, identity, and relationships. Exercise: model identity continuity and relationships over time.
**Assessment:** bounded world workspace with entities, relationships, timeline, and scope statement.

#### AH-WF-120 — Sources, Claims, and Evidence

**Outcome:** Connect statements to sources while preserving uncertainty and interpretation.

- M1.1 Source records and attribution. Exercise: register supplied sources.
- M1.2 Claims and atomic statements. Exercise: split compound assertions into reviewable claims.
- M1.3 Evidence relevance and strength. Exercise: evaluate whether evidence supports a claim.
- M1.4 Interpretation, contradiction, and uncertainty. Exercise: record competing claims without silently resolving them.
**Assessment:** source-to-claim map with evidence links and uncertainty labels.

#### AH-WF-130 — Provenance and Verification

**Outcome:** Trace a knowledge item from source through interpretation, review, and verification.

- M1.1 Provenance chains. Exercise: construct source-to-record lineage.
- M1.2 Evidence records and reviewer rationale. Exercise: write a review record for a disputed claim.
- M1.3 Verification plans and outcomes. Exercise: define criteria and record test results.
- M1.4 Version history and reproducibility. Exercise: reconstruct changes between record versions.
**Assessment:** traceability dossier and reproducible verification report.

#### AH-WF-140 — Canon Governance and Change Control

**Outcome:** Apply the canon lifecycle without confusing proposal, interpretation, and authorized canon.

- M1.1 Canon, interpretation, suggestion, and process. Exercise: label statements and explain distinctions.
- M1.2 Canon status and approval authority. Exercise: trace a hypothetical proposal through authorized review.
- M1.3 Contradictions and competing records. Exercise: preserve a contradiction and document its status.
- M1.4 Revision, supersession, and rollback. Exercise: produce a versioned change history.
**Assessment:** simulated canon change dossier with source, proposal, authorization evidence, impact, history, and verification. Do not make real canon changes in the exercise.

#### AH-WF-150 — Knowledge Graph Operations

**Outcome:** Inspect and maintain a graph while preserving valid relationships and exportable records.

- M1.1 Graph structure and traversal. Exercise: answer questions by traversing a supplied graph.
- M1.2 Relationship validation and integrity. Exercise: detect missing, invalid, and orphaned relationships.
- M1.3 Search, views, and graph interpretation. Exercise: produce a focused view for a research question.
- M1.4 Import, export, and portability. Exercise: export a workspace and verify record counts and IDs.
**Assessment:** validated graph, query/view evidence, and import/export report.

#### AH-WF-160 — Identity, Time, and Narrative Continuity

**Outcome:** Detect identity and chronology conflicts in a connected world model.

- M1.1 Stable identity and aliases. Exercise: distinguish separate entities from aliases.
- M1.2 Timelines and temporal constraints. Exercise: identify impossible or unsupported date sequences.
- M1.3 Causality and event dependencies. Exercise: map causal chains and flag unsupported links.
- M1.4 Continuity review and change impact. Exercise: assess how a proposed edit affects connected records.
**Assessment:** continuity audit with issue list, source references, and proposed corrections clearly labeled.

#### AH-WF-170 — Trust, Risk, and Conflicting Knowledge

**Outcome:** Evaluate source trust, knowledge risks, and unresolved conflicts without overstating certainty.

- M1.1 Source reliability and context. Exercise: assess supplied source profiles.
- M1.2 Conflicting claims and adjudication boundaries. Exercise: create a conflict register.
- M1.3 Knowledge integrity and operational risk. Exercise: identify provenance, access, continuity, and trust risks.
- M1.4 Risk treatment and residual uncertainty. Exercise: write a treatment record that retains unresolved items.
**Assessment:** trust and risk report with source assessments, conflict register, treatment actions, and residual uncertainty.

### 4.4 Human Stewardship — cross-cutting curriculum

#### AH-STW-100 — Evidence Literacy and Critical Judgment

- M1.1 Fact, source claim, inference, and hypothesis. Exercise: classify statements in a mixed evidence set.
- M1.2 Evidence quality and relevance. Exercise: assess evidence against a published rubric.
- M1.3 Uncertainty and calibrated language. Exercise: rewrite overconfident statements to match evidence.
- M1.4 Independent review and dissent. Exercise: preserve disagreement and its rationale.
**Assessment:** claim-evaluation dossier with evidence quality and uncertainty notes.

#### AH-STW-110 — Human Oversight and Accountability

- M1.1 Human responsibility in automated workflows. Exercise: map accountability across a workflow.
- M1.2 Approval and intervention design. Exercise: define intervention conditions.
- M1.3 Escalation and exception handling. Exercise: prepare an escalation record.
- M1.4 Review quality and auditability. Exercise: assess whether a review can be reconstructed.
**Assessment:** oversight plan and scenario-based review.

#### AH-STW-120 — Responsible Knowledge Stewardship

- M1.1 Preservation and source integrity. Exercise: identify risks in a proposed content migration.
- M1.2 Protected knowledge and change authority. Exercise: classify actions by required authority.
- M1.3 Privacy and responsible data handling. Exercise: minimize data in a fictional learner record.
- M1.4 Long-term continuity and maintenance. Exercise: create a maintenance and retirement plan.
**Assessment:** stewardship review covering preservation, privacy, authority, and maintenance.

## 5. Integrated practice projects

### PROJECT-001 — AH-AIOS System Orientation Portfolio

**Level:** L1–L2. Courses: AH-CORE-100, AH-CORE-110, AH-STW-100.
Tasks: produce a domain map, architecture explanation, glossary, and evidence-status review.
Evidence: diagram, glossary, explanation, and source list.
Acceptance: boundaries are accurate, claims are sourced, and implementation status is not overstated.

### PROJECT-002 — Governed Tool Workflow

**Level:** L2–L3. Courses: AH-HAR-120, AH-HAR-140, AH-HAR-150, AH-HAR-160.
Tasks: specify a tool, model a workflow, define approval gates, and build a test matrix.
Evidence: tool contract, state model, permissions table, and test results.
Acceptance: inputs/outputs and failure paths are defined; authority and human approval are explicit.

### PROJECT-003 — Provenance-Aware Knowledge Workspace

**Level:** L2–L3. Courses: AH-WF-100, AH-WF-120, AH-WF-130, AH-WF-150.
Tasks: create a graph, register sources, formulate claims, attach evidence, and verify export.
Evidence: model, graph snapshot, provenance trail, validation and export report.
Acceptance: identifiers are stable, relationships validate, claims trace to sources, and export preserves records.

### PROJECT-004 — Governed World and Continuity Case

**Level:** L3–L4. Courses: AH-WF-110, AH-WF-140, AH-WF-160, AH-WF-170, AH-STW-120.
Tasks: model an authorized fictional setting, record a contradiction, propose a change, assess continuity impact, and preserve review history.
Evidence: world model, conflict register, change dossier, and continuity report.
Acceptance: source and interpretation remain distinct; no unauthorized canon change occurs; prior versions remain traceable.

### PROJECT-005 — Learning Content Authoring Practicum

**Level:** L3–L4. Courses: AH-CORE-140, AH-CORE-150, AH-STW-100, AH-STW-120.
Tasks: author a lesson, prepare an exercise and rubric, obtain review, and record publication status.
Evidence: lesson package, review record, change history, and validation checklist.
Acceptance: outcomes are measurable, references traceable, authority clear, and content status accurate.

## 6. Standard lesson specification

Every lesson must include:

1. Lesson identity: stable lesson ID, title, course, module, version, and status.
2. Purpose: why the lesson exists and what capability it develops.
3. Learning outcomes: observable verbs and assessable performance.
4. Prerequisites: prior lessons, vocabulary, tools, or access.
5. Source base: authoritative references and versions.
6. Core explanation: definitions, principles, architecture, and limitations.
7. Worked example: complete example with reasoning and expected result.
8. Guided practice: staged task with support.
9. Independent exercise: inputs, instructions, and deliverables.
10. Knowledge check: questions or scenario prompts with answer rationale.
11. Assessment evidence: what the learner must submit or demonstrate.
12. Feedback guidance: common errors, hints, and remediation.
13. Safety and authority boundary: data handling, permissions, and actions requiring approval.
14. References and change history: sources, version, author, reviewer, and revisions.

### Lesson quality gate

A lesson is ready for review only when outcomes are observable; explanations are source-grounded; examples do not imply unsupported capabilities; exercises have defined inputs and outputs; knowledge checks include answer rationale; assessment criteria are published in advance; safety and privacy boundaries are stated; and canon, interpretation, suggestion, and process are distinguished where relevant.

## 7. Assessment architecture

### Assessment types

- **Diagnostic:** identifies prior knowledge; not a credential.
- **Formative:** provides feedback during learning.
- **Practical:** evaluates task execution and artifacts.
- **Integrated project:** evaluates combined capabilities across courses.
- **Review / defense:** asks the learner to explain decisions, evidence, and limitations.
- **Portfolio review:** evaluates evidence accumulated across a path.

### Common rubric

Score each dimension from 1 to 4: 1 = insufficient, 2 = developing, 3 = competent, 4 = strong. Each score requires evidence and reviewer comments.

| Dimension | Evaluation |
| --- | --- |
| Accuracy | Technical and conceptual correctness |
| Traceability | Sources, inputs, decisions, and versions are identifiable |
| Completeness | Required elements, edge cases, and limitations are addressed |
| Reasoning | Assumptions, alternatives, and uncertainty are explicit |
| Verification | Outcomes are tested against stated criteria |
| Stewardship | Authority, protected assets, privacy, and change discipline are respected |
| Communication | Results and limitations are clearly explained |

A total score must not conceal a critical failure. Each course must publish mandatory criteria and minimum thresholds before assessment. This plan does not establish credential thresholds.

### Remediation

1. Record the unmet criterion and evidence.
2. Provide specific feedback and a relevant resource.
3. Define the resubmission scope.
4. Preserve the original submission and assessment history.
5. Reassess against the published rubric unless a formally versioned rubric change applies.

## 8. Learning path sequencing

**Core:** AH-CORE-100 → 110 → 120 → 130 → 140 → 150. AH-STW-100 accompanies evidence and governance modules; AH-STW-110 and 120 extend advanced practice.

**AI Harness:** AH-HAR-100 → 110 → 120 → 130 → 140 → 150 → 160. Safe-operation concepts are introduced early and revisited in every practical exercise.

**WorldForge:** AH-WF-100 → 110 → 120 → 130 → 140 → 150 → 160 → 170. Provenance and canon governance are introduced before advanced world editing.

**Cross-domain orientation:** AH-CORE-100 → AH-HAR-100 → AH-WF-100 → AH-STW-100 → one integrated project. This is an orientation route, not a substitute for a specialist path.

Prerequisites may be satisfied by prior evidence or diagnostic assessment. Exemptions must be recorded and must not be inferred from job title.

## 9. The 82-Theory Explorer learning track

The collection remains established as **68 existing registry theories + 14 synthesized concrete theories = 82**. The 14 are theories, not procedures or placeholders. Their synthesis from the 39 Master Visual Artifacts is complete. Recovery or separate inventory of those artifacts is not a prerequisite for the collection.

This plan does not recreate, rename, reorder, or redefine the theory registry. The registry remains the source of record.

### Theory learning unit

For each theory, author a linked learning unit containing:

- Exact theory ID and canonical title from the registry.
- Canonical definition, version, and status from the authorized source.
- Provenance and source references as recorded.
- Plain-language explanation clearly labeled as interpretation.
- Key terms and concept map.
- Relationships to other theories, using recorded links only.
- Worked example and applied exercise.
- Comprehension and critical examination questions.
- Known uncertainty, disagreement, or open questions.
- Reviewer and content version.

### Theory learning sequence

1. Orientation to the collection and source-of-record distinction.
2. Individual study of one theory at a time.
3. Relationship study using recorded relationships or explicitly labeled proposals.
4. Applied exercises that demonstrate understanding without changing the theory.
5. Learner synthesis with source links and interpretation labels.
6. Review for comprehension and source discipline.

### Theory content integrity

- Do not invent the unlisted 14th identifier or any other theory ID.
- Do not treat the currently listed 13 known identifiers as the complete list.
- Do not turn learning explanations into canonical definitions.
- Do not infer missing relationships or provenance.
- Route proposed theory-record corrections through the separate canon governance process.

## 10. Instructor, reviewer, and administrator materials

Each course package should include:

- Instructor overview and expected learner profile.
- Teaching sequence and effort estimate, once validated.
- Slide or demonstration outline where useful.
- Exercise setup and reset instructions.
- Sample outputs and answer rationale.
- Common misconceptions and remediation guidance.
- Assessment rubric and reviewer checklist.
- Accessibility notes and alternative activity formats.
- Source list and version history.

Subject-matter review, instructional-design review, security/privacy review, canon review, and publication approval are separate checks where applicable. A reviewer must not be presumed to hold authority outside the assigned scope.

## 11. Content production and release workflow

1. **Scope:** confirm course purpose, learner, outcomes, and boundaries.
2. **Source:** identify authoritative source documents and versions.
3. **Outline:** define modules, lessons, exercises, and assessment.
4. **Author:** prepare lesson content and instructor materials.
5. **Subject review:** verify technical and domain accuracy.
6. **Instructional review:** verify clarity, sequence, accessibility, and assessment alignment.
7. **Governance review:** check source integrity, canon labels, privacy, and authority boundaries.
8. **Pilot:** test with representative learners or reviewers.
9. **Revise:** record feedback and changes.
10. **Publish:** publish only after required approvals.
11. **Maintain:** monitor accuracy, review dates, and source changes.

Content states: Draft → In Review → Approved for Publication → Published → Retired.

A published lesson may be revised only through a recorded version change. Retired content remains identifiable and should point to a replacement where one exists.

### Definition of done for a course

A course is content-complete when all planned lessons are authored; every lesson has outcomes, sources, explanations, examples, exercises, and knowledge checks; practical assessment and rubric are complete; instructor/reviewer materials are available; required reviews are recorded; pilot feedback is addressed or retained as unresolved; and version/publication status is accurate.

Content-complete does not mean the learning application is implemented or deployed.

## 12. Platform requirements traceability

These are capabilities to verify or implement, not claims about current availability.

| Platform capability | Content dependency | Verification evidence |
| --- | --- | --- |
| Course catalog | Course metadata and path definitions | Learner can discover and open published courses |
| Lesson delivery | Lesson content and references | Content renders correctly and access is controlled |
| Progress tracking | Completion rules | Progress persists and can be audited |
| Exercises and labs | Instructions and artifacts | Learner can submit and retrieve work |
| Assessment | Rubrics, attempts, reviewer workflow | Scores, rationale, and history are retained |
| Portfolio | Artifact metadata and evidence links | Learner can assemble and export a portfolio |
| Content administration | Lifecycle and permissions | Authorized editors can revise and publish |
| AI tutor (future capability) | Approved source corpus and answer policy | Retrieval grounding, evaluation, and safety tests |
| Credential records | Authorized issuer and policy | Issuance, verification, correction, and revocation tests |
| Analytics | Defined measures and privacy rules | Accuracy, access control, and retention are verified |

A manual workflow may support a pilot where platform automation is not available. Do not represent a manual process as automated functionality.

## 13. Content and learner data model

Suggested records:

- Course, module, lesson, and learning objective.
- Learning path and prerequisite relation.
- Exercise, lab, project, and starter resource.
- Assessment, rubric, criterion, and attempt.
- Submission, artifact, feedback, and reviewer record.
- Learner progress and completion evidence.
- Portfolio item.
- Content source, version, review, and publication event.
- Credential record only when an authorized issuer exists.

Collect only learner data needed for the stated purpose. Define role-based access, retention, export, correction, and deletion rules before production use. Never place secrets or unnecessary sensitive personal information in learning artifacts.

## 14. Quality assurance and program evaluation

### Content QA

- Source links resolve and point to the intended version.
- Definitions and examples are consistent with authoritative material.
- Exercises can be completed using stated inputs and environment.
- Answer keys and rubrics match learning outcomes.
- Accessibility and readability checks are complete.
- Status labels accurately describe content and platform.
- Canon-sensitive material has required authority and review.

### Learning effectiveness

Potential measures, subject to a defined privacy and measurement policy:

- Lesson and course completion.
- Assessment performance by published criterion.
- Lab success and common failure patterns.
- Resubmission and remediation outcomes.
- Learner feedback on clarity and usefulness.
- Demonstrated transfer to an applied project.

Completion rates alone do not establish learning effectiveness. Analytics require a clear purpose, access rules, and retention policy.

### Release gates

A release should include a versioned course manifest, content review records, assessment and rubric versions, source-reference validation, accessibility and privacy review, pilot results or documented reason for no pilot, known limitations, unresolved issues, and publication approval.

## 15. Production work packages

| Work package | Deliverables | Completion evidence |
| --- | --- | --- |
| WP-01 Foundation alignment | Course catalogue, IDs, audience, prerequisites | Reviewed catalogue and traceability |
| WP-02 Authoring templates | Lesson, exercise, lab, assessment, instructor templates | Templates reviewed and versioned |
| WP-03 Core course content | Six Core courses and assessments | Course definition-of-done met |
| WP-04 AI Harness content | Seven Harness courses and assessments | Course definition-of-done met |
| WP-05 WorldForge content | Eight WorldForge courses and assessments | Course definition-of-done met |
| WP-06 Stewardship content | Three cross-cutting courses and assessments | Course definition-of-done met |
| WP-07 Theory learning units | 82 units linked to registry records | Coverage checked against registry |
| WP-08 Integrated projects | Five project briefs, starter assets, rubrics | Projects piloted and reviewed |
| WP-09 Instructor/reviewer pack | Guides, answer rationale, checklists | Review and pilot evidence |
| WP-10 Platform traceability | Requirement-to-feature matrix and tests | Feature states independently verified |
| WP-11 Publication governance | Review workflow, release checklist, retention policy | Authorized publication process recorded |

These work packages describe deliverables, not a decision about priority. Each can be tracked independently. No work package changes protected canon.

## 16. Open items for detailed authoring

These are unresolved inputs, not assumptions to fill silently:

1. Official time/effort estimates for each course and lesson.
2. Initial learner audience and role-specific variants.
3. Courses requiring formal prerequisites versus diagnostic entry.
4. Approved source references and versions for every technical lesson.
5. Complete theory registry data to bind all 82 learning units to exact records.
6. Target learning delivery environment and its verified feature set.
7. Authority and policy, if any, for formal credentials.
8. Privacy, retention, and analytics policy for learner records.
9. Required accessibility standard and supported languages.
10. Designated subject-matter reviewers and publication approvers.

Resolve these from authorized sources or explicit instruction. This plan does not invent answers.

## 17. Relationship to the existing package

This plan expands, but does not replace:

- [README.md](http://README.md) — package index and scope.
- [platform-definition.md](http://platform-definition.md) — learning product definition.
- [curriculum.md](http://curriculum.md) — curriculum and competency framework.
- paths/[core.md](http://core.md) — Core path.
- paths/[ai-harness.md](http://ai-harness.md) — AI Harness path.
- paths/[worldforge.md](http://worldforge.md) — WorldForge path.
- [theory-explorer.md](http://theory-explorer.md) — established 82-theory learning resource.
- [practice-labs.md](http://practice-labs.md) — starter lab definitions.
- [assessment-portfolio.md](http://assessment-portfolio.md) — assessment and portfolio framework.
- [content-governance.md](http://content-governance.md) — content lifecycle and governance.

The master plan is the detailed instructional blueprint. Individual course documents and lesson files should be authored as separate, versioned resources as production proceeds.

## 18. Governance statement

This document is an instructional design plan labeled **SUGGESTION / PROCESS**. It does not amend AH-AIOS architecture canon, WorldForge canon, AFTER HUMANITY canon, or the 82-theory registry. It preserves the distinction between source material, interpretation, proposed learning content, implementation evidence, and authorized canon.

**Develop freely. Distinguish clearly. Canonize deliberately. Verify continuously.**
