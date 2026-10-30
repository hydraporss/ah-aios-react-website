# AH-AIOS — System Definition and GitHub Implementation Alignment

**Record date:** 2026-10-30  
**Classification:** System definition and repository-alignment reference  
**Repository:** [hydraporss/ah-aios-react-website](https://github.com/hydraporss/ah-aios-react-website)

## 1. System definition

**AH-AIOS (AFTER HUMANITY AIOS)** is an integrated AI operating system and governed execution ecosystem built around a controlled integration framework and knowledge-intelligence capabilities.

AH-AIOS is also an integrated AI-powered learning application and capability-development platform for individuals and organizations. It enables people and organizations to learn, practice, build, assess, and develop competencies across artificial intelligence, automation, systems engineering, governance, knowledge intelligence, and ecosystem leadership.

AH-AIOS has three distinct, integrated domains:

1. **AH-AIOS AI CORE** — the foundational control, governance, security, identity, infrastructure, audit, risk, and assurance domain.
2. **AI HARNESS** — the AI execution, orchestration, integration, agent, workflow, automation, and runtime domain.
3. **AH-AIOS WORLD FORGE** — the governed knowledge-intelligence, worldbuilding, research, and knowledge-modeling domain.

The three domains are distinct and complementary:

- **AI CORE governs** identity, authority, policy, security, controls, evidence, audit, risk, and assurance.
- **AI HARNESS executes** bounded AI-assisted work through models, agents, tools, APIs, workflows, integrations, and runtimes within AI CORE controls.
- **AH-AIOS WORLD FORGE structures and governs knowledge** through entities, concepts, theories, relationships, events, histories, sources, claims, evidence, provenance, canon, and continuity.

The domains exchange controlled inputs, outputs, and evidence. AI HARNESS does not override AI CORE policy or authorize canon changes. Knowledge status in WORLD FORGE does not grant execution permissions. A domain's defined scope does not prove that all its capabilities are implemented.

**AFTER HUMANITY** is the intellectual and creative ecosystem/context served by AH-AIOS. It is not a fourth AH-AIOS domain.

## 2. AH-AIOS Learning

AH-AIOS includes an integrated learning and capability-development environment. Its learning journey is:

**Discover → Learn → Experiment → Build → Demonstrate**

The learning environment supports structured learning paths, lessons and reference materials, AI-assisted tutoring and retrieval, practical exercises, labs and simulations, applied build projects, assessment, portfolios, competency tracking, and administration.

Learning content completion or attendance alone does not establish competency. Competency requires observable evidence and the applicable assessment or review.

The definition of this learning environment is system scope; it does not claim that every learning capability is implemented in this repository.

## 3. AH-AIOS WORLD FORGE scope

AH-AIOS WORLD FORGE is the governed knowledge-intelligence, worldbuilding, and knowledge-modeling domain. It is not merely a database or content generator.

Its scope includes:

- Worldbuilding and structured world models.
- Research and theory systems.
- Entities, attributes, concepts, identifiers, relationships, events, and histories.
- Ontologies, schemas, and knowledge graphs.
- Sources, claims, evidence, and provenance.
- Canon governance, continuity, validation, and consistency.
- Knowledge retrieval and AI-assisted research and analysis.
- A workspace for worldbuilding and knowledge operations.

Its six capability areas are:

1. **Worldbuilding Studio** — create worlds, civilizations, characters, histories, and stories.
2. **Knowledge Graph** — connect entities, relationships, events, concepts, and sources.
3. **Canon Governance** — control canon status, approvals, revisions, and continuity.
4. **Provenance & Verification** — track sources, evidence, decisions, and change history.
5. **AI-Assisted Intelligence** — support research, analysis, generation, and knowledge retrieval.
6. **WorldForge Workspace** — provide the working environment for worldbuilding and knowledge operations.

### 3.1 WorldForge architecture

**AH-WF-ARCH-001** is the canon nine-layer governed world-intelligence architecture:

- Layers 1–8 are functional architecture layers.
- Layer 9, **Trust and Risk Management**, is cross-cutting assurance.
- Preserve AP-01–AP-04 and GOV-01–GOV-06.
- Preserve the L0–L4 maturity model and phased roadmap.

Architecture canon is not, by itself, evidence of implementation, deployment, runtime enforcement, verification, or operational readiness.

### 3.2 82-theory collection

The 82-theory collection is established as complete and solid:

- 68 existing registry theories.
- 14 concrete theories synthesized from the 39 Master Visual Artifacts.

The 14 are concrete theories, not procedures or placeholders. Their synthesis is complete. Recovering or separately inventorying the 39 artifacts is not a prerequisite for establishing or using the 82-theory collection. Preserve each theory's identity, identifier, definition, relationships, provenance, and status. Do not invent missing identifiers or definitions.

## 4. Alignment with this GitHub repository

The repository `hydraporss/ah-aios-react-website` is the **AH-AIOS WORLD FORGE application repository**. Its README describes the current software as:

> AH-AIOS WorldForge is a React-based prototype for structured worldbuilding workflows, dashboard-driven creation experiences, and deterministic prompt-to-page generation.

The repository is therefore a concrete application implementation within AH-AIOS WORLD FORGE. It is not, by itself, the complete AH-AIOS system or an implementation of all three domains.

### 4.1 Repository capabilities documented in the README

The repository documents:

- A responsive WorldForge dashboard and navigation.
- A deterministic Prompt Builder with landing-page preview and React component starter export.
- A World Model for worlds, nations, characters, factions, locations, and historical events.
- Record creation, search, filtering, and browser-profile persistence.
- Typed relationships, validation, filtering, and entity connection views.
- Source registration and links between sources and records.
- Claims, claim status transitions, version history, and change proposals.
- First-class evidence records, versioned assessments, and evidence reviews.
- Local canon workflows, reviewer rationale, approval history, and change requests.
- Browser-stored activity history and JSON workspace import/export.
- A separate React Server Governance page connected in code to a Django API for server-backed workspaces, claims, evidence, proposals, decisions, and archive export.

These features map primarily to the Worldbuilding Studio, Knowledge Graph, Canon Governance, Provenance & Verification, and WorldForge Workspace capability areas. The repository does not yet establish the full six-area WorldForge scope as production-complete.

### 4.2 Implementation boundaries recorded by the repository

The repository README distinguishes three different states:

**Browser-local prototype**

The principal World Model, relationship, source, claim, evidence, canon, decision, and provenance workflows are browser-local. Their persistence uses the current browser profile. Local prototype records do not synchronize with the Django API and do not establish organizational authority, authenticated reviewer identity, or tamper-resistant audit retention.

**Django server foundation**

A separate Server Governance page calls a Django API. The README documents session identity and workspace-membership checks for protected API endpoints, and a signed audit chain that is tamper-evident while its signing key remains secret. The browser-to-backend workflow and production deployment/configuration have not passed acceptance. The audit chain is not claimed to be immutable against an administrator able to rewrite both the database and key.

**Not established as production capabilities**

- Deployed shared backend service and configured production database.
- Enterprise identity such as SSO/MFA or production identity assurance.
- Independently protected production audit retention.
- Accepted end-to-end browser-to-backend workflows.
- Live Hermes integration.
- AI model invocation, LLM-based generation, or external model calls.
- Multi-user synchronization or collaborative workspace operation.
- Full production acceptance for import/export round trips, accessibility, mobile behavior, and storage-error recovery.

The README states that prompt and draft generation use deterministic local templates, not an LLM or remote AI service. The Hermes exchange is versioned JSON import/export, not a live Hermes connection.

### 4.3 Repository-level application definition

**The current AH-AIOS WORLD FORGE application in this repository is a React-based worldbuilding and knowledge-governance prototype for creating structured world records, connecting entities through typed relationships, registering sources and evidence, managing claims and local canon workflows, preserving version and provenance history, and exchanging workspace data through JSON. A separate Django Server Governance path provides a server-backed foundation whose end-to-end browser acceptance and production deployment remain unverified.**

This definition describes the software documented in this repository. It must not be used to claim that AH-AIOS AI CORE, AI HARNESS, or the complete AH-AIOS WORLD FORGE architecture is fully implemented.

## 5. Three-domain implementation alignment

| AH-AIOS domain | System responsibility | Relationship to this repository |
| --- | --- | --- |
| AH-AIOS AI CORE | Foundational control, identity, governance, security, infrastructure, audit, risk, and assurance | The repository contains limited application-level and Django API identity/authorization controls for its WorldForge workflows. It is not the implementation of the full AI CORE domain. |
| AI HARNESS | Models, agents, tools, integrations, workflows, orchestration, automation, and runtime execution | Live Hermes integration and AI model generation are explicitly absent from the current repository README. The repository does not implement the full AI HARNESS domain. |
| AH-AIOS WORLD FORGE | Governed knowledge intelligence, worldbuilding, knowledge modeling, provenance, canon, and continuity | This is the repository's application focus. Its current maturity is a browser-local prototype plus a separate Django server foundation, with the acceptance and production limits described above. |

This table is an alignment statement, not a claim that every system responsibility is already implemented.

## 6. Governance and status discipline

The Law of Controlled Integration governs the handling of ideas, sources, knowledge, changes, and canon:

**RECOVER → CLASSIFY → RECONSTRUCT → COMPARE → TEST → INTEGRATE → AUTHORIZE**

Preserve these classifications:

- **CANON** — explicitly authorized governing material.
- **INTERPRETATION** — explanatory synthesis that does not change canon.
- **SUGGESTION** — proposed content or future capability.
- **PROCESS** — operational, review, and maintenance instructions.

Keep scope, architecture, implementation, verification, and operational readiness distinct. Repository documentation is a source claim about the software; implementation claims require code or test evidence, and production claims require their own acceptance evidence. Preserve provenance, authorization, version history, and unresolved contradictions.

The Master Synthesis is an index layer, not a replacement for primary sources.

## 7. Source references

- [AH-AIOS WorldForge React Website repository](https://github.com/hydraporss/ah-aios-react-website)
- [Repository README — current application definition and implementation status](https://github.com/hydraporss/ah-aios-react-website/blob/main/README.md)
- [AH-AIOS — System Definition & Three-Domain Scope Canon — Notion](https://app.notion.com/p/40902ae49126819d98f3f554b4cecdc0)

---

**Alignment rule:** The system definition describes the complete AH-AIOS scope. This repository documents the current AH-AIOS WORLD FORGE application implementation. Do not reduce the full system to this repository, and do not represent unimplemented system scope as delivered software.
