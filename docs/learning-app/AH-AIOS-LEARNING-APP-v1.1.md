> **STATUS: Specified. Reference only. Not adopted, not implemented, not verified.**
> Supplied by the owner on 2026-11-01 and preserved here as received (formatting normalised only). It conflicts with the release on several points; see `AH-LEARNING-APP-RECONCILIATION.md` before relying on any of it. Its closing statement ("now fully defined") does not match the release status (partially implemented, not production-ready).

# AH-AIOS Learning App v1.1
Architecture Extensions, Core Data Model, Schemas, and Implementation Backlog

## Section 10A: Learning Science Framework

The AH-AIOS Learning App shall be grounded in established learning science principles.

### Learning Model

Learning progresses through increasing levels of cognitive capability (Bloom's Cognitive Taxonomy):

```text
Remember -> Understand -> Apply -> Analyze -> Evaluate -> Create
```

### Learning Reinforcement Strategies

**Retrieval Practice.** Knowledge should be recalled from memory rather than repeatedly reviewed. Examples: quizzes, self-explanation, reflection prompts.

**Spaced Repetition.** Review intervals increase over time:

```text
1 Day, 3 Days, 7 Days, 14 Days, 30 Days, 90 Days
```

**Interleaving.** Learning pathways should mix related topics (Drawing, Perspective, Anatomy, Composition) rather than learning each domain in isolation.

**Deliberate Practice.** Practice activities must: target identified weaknesses; provide feedback; support repetition; increase difficulty progressively.

**Mastery Learning.** Progression is determined by demonstrated understanding rather than content completion. Complete Lesson != Master Concept.

### Learning Science Requirements

All learning paths should support: knowledge acquisition; understanding; application; reflection; reinforcement; retention.

## Section 10B: Competency Framework

### Competency Hierarchy

```text
Domain -> Capability -> Competency -> Skill -> Learning Objective
```

Example:

```text
Art -> Art Analysis -> Visual Interpretation -> Composition Evaluation -> Analyze Composition Techniques
```

### Competency Model

```json
{
  "id": "COMP-ART-001",
  "name": "Visual Interpretation",
  "description": "Interpret artistic works and identify meaning.",
  "skills": [],
  "assessments": [],
  "evidenceRequirements": [],
  "masteryThreshold": 80
}
```

## Section 10C: Learning Analytics Framework

**Knowledge Growth Index (KGI)** measures learning progress. Range 0-100.

```text
KGI = (Understanding + Application + Retention + Transfer) / 4
```

**Learning Velocity** measures learning progression speed.

```text
Velocity = Mastery Gain / Time Period
```

**Competency Confidence Score** measures confidence level of demonstrated competency. Inputs: assessment quantity, assessment quality, recency, performance consistency. Output: Low, Moderate, High, Verified.

**Retention Score** measures retained understanding.

```text
Retention = Current Score / Previous Peak Score
```

## Section 10D: Architecture Decision Records

- **ADR-001 Knowledge Graph First.** Knowledge is represented primarily through interconnected graph structures.
- **ADR-002 Retrieve Before Generate.** Authorized knowledge shall be retrieved before generating instructional content.
- **ADR-003 Evidence-Based Mastery.** Mastery requires evidence.
- **ADR-004 AION Cross-Domain Intelligence.** AION operates across Core, WorldForge, and AI Harness.
- **ADR-005 Learning Outcome Priority.** Learning outcomes outweigh content generation metrics.

## Core AH-AIOS Data Model

```json
{ "$id": "KnowledgeObject", "id": "WF-KNOW-001", "title": "Renaissance Humanism", "type": "Concept", "domain": "Art History", "difficulty": "Intermediate", "description": "", "sources": [], "relationships": [], "version": "1.0" }
{ "$id": "Domain", "id": "DOM-001", "name": "Art History", "description": "", "capabilities": [] }
{ "$id": "Curriculum", "id": "CURR-001", "title": "Foundations of Art History", "courses": [], "competencies": [] }
{ "$id": "Course", "id": "COURSE-001", "title": "Renaissance Art", "modules": [], "prerequisites": [], "learningObjectives": [] }
{ "$id": "Lesson", "id": "LESSON-001", "title": "Introduction to Humanism", "objectiveIds": [], "activityIds": [], "assessmentIds": [] }
{ "$id": "LearningObjective", "id": "LO-001", "description": "Explain Renaissance Humanism", "competencyId": "COMP-ART-001", "cognitiveLevel": "Understand" }
{ "$id": "Competency", "id": "COMP-ART-001", "name": "Visual Interpretation", "skills": [], "masteryThreshold": 80 }
{ "$id": "Assessment", "id": "ASM-001", "type": "Scenario", "objectiveIds": [], "evaluationRubric": {} }
{ "$id": "Learner", "id": "USER-001", "name": "", "enrolledPrograms": [], "competencies": [], "masteryScores": {}, "knowledgeGaps": [] }
{ "$id": "LearningEvidence", "id": "EV-001", "learnerId": "", "assessmentId": "", "score": 87, "feedback": "", "timestamp": "" }
```

(One object per entity; shown together for brevity. Each was a separate JSON block in the source.)

## Neo4j Knowledge Graph Schema

Node types: Domain, Capability, Competency, Skill, LearningObjective, Curriculum, Course, Module, Lesson, Concept, KnowledgeObject, Assessment, Learner, Evidence.

```text
(:Domain)-[:CONTAINS]->(:Capability)
(:Capability)-[:CONTAINS]->(:Competency)
(:Competency)-[:REQUIRES]->(:Skill)
(:Skill)-[:SUPPORTED_BY]->(:LearningObjective)
(:Curriculum)-[:CONTAINS]->(:Course)
(:Course)-[:CONTAINS]->(:Module)
(:Module)-[:CONTAINS]->(:Lesson)
(:Lesson)-[:TEACHES]->(:Concept)
(:Concept)-[:RELATES_TO]->(:Concept)
(:Assessment)-[:MEASURES]->(:Competency)
(:Learner)-[:HAS_EVIDENCE]->(:Evidence)
```

## Event Architecture (Recommended Addition)

Events: LearnerCompletedLesson, AssessmentSubmitted, AssessmentEvaluated, CompetencyUpdated, KnowledgeGraphUpdated, CurriculumPublished, KnowledgeValidated, MasteryUpdated. Platform options: Kafka, RabbitMQ, Azure Service Bus.

## MVP Implementation Backlog

1. **Learning Foundation:** learner account model; profile management; learner dashboard; curriculum browser; lesson viewer; learning history.
2. **AION Mentor:** chat interface; conversation memory; learning goal detection; knowledge retrieval; guided instruction; adaptive recommendations.
3. **Knowledge Layer:** KnowledgeObject schema; Neo4j graph; vector embeddings; relationship engine; knowledge import workflows; source tracking.
4. **WorldForge:** curriculum schema; course builder; module builder; lesson builder; learning objective engine; competency mapping.
5. **Assessment Engine:** quiz engine; rubric engine; short-answer evaluation; scenario evaluation; assessment records; feedback generation.
6. **Mastery Analytics:** KGI calculations; competency tracking; gap analysis; retention tracking; learning velocity tracking; progress dashboards.
7. **AI Harness:** Research, Knowledge, Curriculum, Instructional, Assessment, Evaluation, Graph, Quality and Analytics agents.
8. **Core Platform:** authentication; authorization; audit logging; provenance; versioning; backup/restore; import/export validation.
9. **Production Readiness:** CI/CD; automated testing; API monitoring; security validation; performance testing; accessibility testing; disaster recovery testing.

## Release Gates

G1 Foundation (user accounts, dashboard, curriculum browser, lesson viewer). G2 AION (mentor interface, retrieval, learning guidance). G3 Knowledge (graph, embeddings, knowledge explorer). G4 Assessment (assessments, evidence, feedback). G5 Mastery (analytics, competencies, gap detection). G6 Agent Workforce (AI Harness agents, workflow automation). G7 Production (security, governance, CI/CD, monitoring, operational readiness).

## Final Architectural Statement

The AH-AIOS Learning App is described as an Artificial Learning Intelligence Environment composed of: AION (Cognitive Mentor); WorldForge (Knowledge & Curriculum Engine); AI Harness (Agent Workforce); Knowledge Graph (Collective Memory); Assessment Engine (Evidence Generator); Mastery Analytics (Growth Measurement System); AH-AIOS Core (Governance & Assurance). Its primary objective is not content delivery, course completion, or answer generation, but the measurable development of human understanding, competence, retention, and mastery.
