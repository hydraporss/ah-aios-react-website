> **STATUS: Specified. Reference only. Not adopted, not implemented, not verified.**
> Supplied by the owner on 2026-11-01 and preserved here as received, with lists and some diagrams condensed to single lines (wording kept). It self-describes as "Proposed architecture definition; pending formal approval". See `AH-LEARNING-APP-RECONCILIATION.md` for conflicts with the release.

# AH-AIOS LEARNING APP: Complete System Definition & Functional Architecture

**Document ID:** AH-LRN-APP-001 | **Version:** 1.0, Proposed Architecture Definition | **Parent Platform:** AH-AIOS, Knowledge Operating System | **Product Domain:** Learning & Capability Development | **Primary Intelligence:** AION, Cognitive Mentor | **Knowledge Engine:** WorldForge | **Execution Framework:** AI Harness | **Status:** Proposed architecture definition; pending formal approval

## 1. Executive Definition
The AH-AIOS Learning App is an AI-powered, knowledge-centered learning application designed to help individuals acquire knowledge, understand complex subjects, develop competencies, demonstrate mastery, and continuously improve their capabilities. It is the learner-facing application of the AH-AIOS Learning Operating System. Unlike conventional learning management systems that primarily distribute courses and record completion, it creates an integrated experience around: personalized learning guidance; knowledge discovery and retrieval; conceptual understanding; structured curricula; interactive instruction; practical exercises; continuous assessment; mastery measurement; knowledge retention; adaptive learning pathways; measurable learner development. Its central intelligence is AION, the learner's cognitive mentor. The system combines AION, the Knowledge Graph, WorldForge, AI Harness, the Assessment Engine, and Mastery Analytics into one continuous learning environment. **Its purpose is not simply to deliver information. Its purpose is to develop understanding.**

## 2. Fundamental Product Identity
A Personal Artificial Learning Intelligence Environment. Traditional: Learner > Course > Lesson > Quiz > Completion. AH-AIOS: Learner > AION > Knowledge Retrieval > Instruction > Practice > Assessment > Mastery Measurement > Knowledge Growth. Course completion is not sufficient evidence of learning; the system seeks evidence that the learner understands, remembers, applies, and can transfer knowledge into new situations.

## 3. Strategic Mission
Preserve human knowledge; connect related concepts and disciplines; make complex knowledge understandable; transform knowledge into structured learning; personalize instruction; assess actual understanding; measure competency development; identify knowledge gaps; improve learning pathways; expand the learner's capacity to understand and apply knowledge. Ultimate objective: accelerate human learning through governed artificial intelligence.

## 4. Position Within AH-AIOS
- **4.1 AH-AIOS Core (Governance and Control):** identity and authentication; user and learner authorization; security and access management; governance policies; data protection; audit and accountability; evidence and provenance; verification; controlled configuration; version and change management; system assurance. Core establishes the conditions under which the Learning App operates; it does not perform the learning experience.
- **4.2 AI Harness (AI Execution and Orchestration):** agent orchestration; model execution; tool and API connections; research and retrieval workflows; content processing; assessment assistance; evaluation workflows; automation; external system integration. Enables AION to coordinate bounded AI operations.
- **4.3 WorldForge (Knowledge and Curriculum Intelligence):** knowledge modeling; concept relationships; Knowledge Graph integration; knowledge organization; curriculum architecture; course and lesson structures; learning objectives; instructional resources; knowledge provenance; validation; evolution. Transforms organized knowledge into teachable structures.
- **4.4 AION:** the cognitive intelligence operating across these three domains; coordinates perception, memory operations, reasoning, planning, knowledge retrieval, instruction, and learning evaluation. AION is not a fourth AH-AIOS domain. It is the cognitive architecture that uses the capabilities of the three established domains.

## 5. The AION Cognitive Mentor
The primary intelligence through which learners interact with AH-AIOS; more than a conversational assistant. It understands the learner's objective, identifies relevant knowledge, guides instruction, evaluates understanding, and recommends the next learning action. Capabilities: **Perception** (understand questions; interpret text, documents, supported images and media; identify subjects and concepts; extract information). **Memory** (maintain authorized learner context; recall learning history; track studied concepts; retrieve knowledge; connect new to existing). **Reasoning** (explain relationships; break down subjects; compare; analyze; generate examples; guide problem-solving). **Planning** (interpret objectives; identify prerequisites; recommend sequences; adapt difficulty; identify activities). **Teaching** (explain; guided instruction; diagnostic questions; examples; feedback; encourage independent reasoning). **Evaluation** (interpret assessment evidence; identify misunderstandings and gaps; evaluate progress; recommend reinforcement). **Learning Adaptation** (adjust instruction; recommend review; identify practice areas; update learner progress models; support continuous improvement). AION must distinguish between what it knows, what it retrieves, what it infers, and what remains uncertain.

## 6. Knowledge Architecture
- **6.1 Knowledge Graph:** structured representation of interconnected knowledge: concepts, subjects, disciplines, definitions, claims, evidence, sources, relationships, processes, theories, learning objectives, competencies, lessons, assessments. Every significant knowledge asset preserves its source, relationships, version, and governance status.
- **6.2 Vector Memory:** semantic retrieval by meaning and contextual similarity; complements, does not replace, the graph, source records, or verification.
- **6.3 Foundation Models:** language, reasoning, embedding, vision and other capabilities; computational services, not the authority on organizational knowledge, and do not independently establish truth.
- **6.4 Knowledge Retrieval Principle:** Retrieve before generating. Retrieved information retains its provenance and governance status.

## 7. WorldForge: Curriculum Engine
Instructional hierarchy: 1 Learning Program; 2 Curriculum; 3 Course; 4 Module; 5 Lesson; 6 Learning Activity; 7 Assessment; 8 Learning Evidence; 9 Competency. Supports curriculum design, pathway construction, course organization, lesson development, learning objective definition, prerequisite mapping, instructional sequencing, resource integration, assessment alignment, curriculum revision. A curriculum must have a meaningful relationship between its knowledge content, instructional objectives, and assessment criteria.

## 8. AI Harness: Agent Workforce
Research Agent (finds and examines sources); Knowledge Agent (extracts concepts and relationships); Curriculum Agent (structures pathways); Instructional Agent (explanations, examples, activities); Assessment Agent (assessment instruments); Evaluation Agent (analyzes responses against criteria); Graph Agent (relationship operations); Quality Agent (completeness, consistency, instructional quality); Learning Analytics Agent (progress and patterns). Agents perform bounded tasks under defined permissions, policies, and verification requirements. Agent output is not automatically approved knowledge or a verified learning result.

## 9. Assessment Engine
Methods: multiple-choice; true-or-false; short-answer; written explanations; concept comparisons; problem-solving; scenario-based; practical exercises; projects; simulations; oral or supported interactive; competency-based. Lifecycle: 1 define the learning objective; 2 establish evaluation criteria; 3 create or select tasks; 4 validate assessment quality; 5 present; 6 capture response; 7 evaluate; 8 record evidence and feedback; 9 identify strengths and gaps; 10 recommend next action. Completion, assessment performance, understanding, and verified competency must remain distinct.

## 10. Mastery Analytics
Primary question: Is the learner becoming more capable? Tracks knowledge acquisition, conceptual understanding, assessment performance, retention, practical application, competency progression, repeated gaps, learning consistency, pathway effectiveness, progress over time.

| Dimension | What it measures |
|---|---|
| Awareness | Recognition of concepts and terminology |
| Understanding | Ability to explain concepts and relationships |
| Application | Ability to use knowledge in practical situations |
| Analysis | Ability to examine and compare information |
| Integration | Ability to connect concepts across subjects |
| Transfer | Ability to apply knowledge in unfamiliar situations |
| Retention | Ability to recall and use knowledge over time |

Mastery must be based on defined criteria and supporting evidence. A single assessment score must not automatically be treated as proof of complete mastery. Analytics must distinguish observed results, calculated indicators, and inferred recommendations.

## 11. Personalized Learner Model
May include: learning objectives; enrolled programs; completed lessons; assessment history; demonstrated competencies; knowledge gaps; prerequisite status; preferences where provided; activity history; recommended next steps; retention and review indicators. The model must be transparent, correctable, and governed by privacy and access controls, and must not turn uncertain inferences into permanent facts about the learner.

## 12. The Learning Experience
Core screens: 1 Learning Dashboard; 2 AION Mentor; 3 Knowledge Explorer; 4 Learning Pathways; 5 Course and Lesson Viewer; 6 Practice Center; 7 Assessment Center; 8 Mastery Dashboard; 9 Learning History; 10 Knowledge Library; 11 Feedback and Review.

## 13. The Continuous Learning Cycle
Acquire knowledge > organize > retrieve > teach > practice and apply > assess understanding > measure growth > identify knowledge gaps > improve learning > refine knowledge. The cycle is continuous. Verified new knowledge may be incorporated through the appropriate governance process. Learner responses and AI-generated material are not automatically authoritative knowledge.

## 14. The Eleven Foundational Learning Principles
P1 Knowledge Is a Graph, Not a Document. P2 Learning Outcomes Matter More Than Answer Quality. P3 Measure Before Improving. P4 Retrieve Before Generating. P5 The Learner Model Matters as Much as the Language Model. P6 Assessment Validates Understanding. P7 Every Concept Should Connect to Other Concepts. P8 Tools Change. Principles Last. P9 The Environment Changes Faster Than the Model. P10 Every Learning System Drifts and Must Evolve. P11 Build Learning Systems, Not AI Systems. These do not replace the established AH-AIOS constitutional and governance principles.

## 15. Data and Knowledge Integrity
1 stable identifiers; 2 valid relationship references; 3 required-field validation; 4 content version history; 5 knowledge provenance; 6 assessment results retain evaluation criteria; 7 learner history not silently overwritten; 8 imports validated before modifying data; 9 failed imports cannot destroy valid records; 10 significant changes auditable; 11 controlled access to personal learning information; 12 testable backup and restoration; 13 corrections preserve the original record; 14 synchronization distinguishes pending, successful, and failed operations.

## 16. Governance and Learning Quality
Mandatory distinctions: retrieved knowledge is not automatically verified; generated content is not automatically approved; a completed lesson is not proof of understanding; a completed course is not proof of competence; an assessment score is not automatically mastery; an AI recommendation is not an established learner fact; a prediction is not a guaranteed outcome. Content lifecycle: Proposed > Investigated > Validated > Approved; alternative outcomes Rejected, Needs Evidence, Superseded. Authorized human review remains necessary where required by policy.

## 17. Technical Architecture
Components: Learner Experience; AION Cognitive Layer; WorldForge; AI Harness; Knowledge Graph; Vector Memory; Foundation Models; Assessment Engine; Mastery Analytics; AH-AIOS Core (identity, governance, security, assurance). Not a one-directional pipeline: services exchange information through controlled interfaces in a continuous feedback cycle. Proposed technologies: React; JavaScript and Vite; JSON and JSON Schema; Python and FastAPI; PostgreSQL; SQLAlchemy and migrations; REST and documented service contracts; embedding and vector-search services; graph-based data structures; AI Harness; controlled CI/CD; responsive web and PWA where supported. These are target choices, not claims that every component is implemented or deployed.

## 18. Integration With Learning App Studio
**Learning App Studio** is the production environment: create learning applications, design curricula, develop courses and lessons, build assessments, configure learner experiences, validate content, manage versions, approve and publish. **AH-AIOS Learning App** is the learner-facing product: access published applications, interact with AION, explore knowledge, follow curricula, complete lessons, practice, take assessments, review feedback, measure mastery, develop competencies. They share AH-AIOS services, knowledge structures, governance, and release controls.

## 19. Functional Acceptance Criteria (26; not claims of present implementation)
*Learner interaction:* 1 access an authorized environment; 2 interact with AION; 3 AION identifies the learning objective; 4 retrieves relevant authorized knowledge; 5 provides structured instruction; 6 learner explores related concepts. *Instruction and practice:* 7 access structured curricula; 8 lessons contain substantive content; 9 activities support active practice; 10 prerequisites and objectives identifiable. *Assessment and mastery:* 11 assessments evaluate defined objectives; 12 responses and results recorded; 13 feedback explains performance and gaps; 14 progress preserved; 15 mastery indicators supported by evidence; 16 recommendations respond to demonstrated needs. *Knowledge and governance:* 17 assets preserve source and version; 18 relationships validated; 19 AI-generated content follows review; 20 learner records protected; 21 export and import validated; 22 backup and restoration tested. *Production and operations:* 23 published applications have identifiable versions; 24 deployed application independently testable; 25 automated verification of data, application and learning workflows; 26 operational limitations documented accurately.

## 20. Implementation Roadmap
Phase 1 Learning Foundation (application shell, learner dashboard, AION interaction interface, curriculum and lesson data structures, initial learner model, data validation). Phase 2 Instructional Experience (course and lesson delivery, Knowledge Explorer, learning pathways, activities, Practice Center). Phase 3 Assessment and Feedback (Assessment Engine, records, evaluation criteria, feedback workflows, learning history). Phase 4 Mastery Analytics (progress model, gap identification, competency tracking, mastery indicators, recommendations). Phase 5 WorldForge and Knowledge Integration (graph integration, curriculum generation, retrieval, provenance, validation). Phase 6 AI Harness Integration (Research, Knowledge, Curriculum, Instructional, Assessment, Evaluation, Quality, Learning Analytics agents). Phase 7 Production and Continuous Improvement (identity and access integration, security and privacy validation, persistent storage, automated tests, deployment pipeline, backup and restoration, performance and accessibility testing, monitoring). Phases may overlap where dependencies permit, but each capability must pass its own acceptance requirements.

## 21. Definition of Success
Not determined solely by number of agents, size of the Knowledge Graph, generated lessons, model calls, completed courses, or answer speed. Measured by improved conceptual understanding, retention, problem-solving, practical competence, cross-discipline connection, transfer to unfamiliar situations, and demonstrable progression. Primary question: can the learner understand, explain, remember, and apply something today that they could not yesterday?

## 22. Final Product Definition
The AH-AIOS Learning App, the Personal Artificial Learning Intelligence Environment, integrates AION as the Cognitive Mentor, WorldForge as the Knowledge and Curriculum Engine, AI Harness as the Agent Workforce, the Knowledge Graph as Collective Memory, the Assessment Engine as the evaluator of demonstrated understanding, and Mastery Analytics as the measurement system. AION guides the learner. WorldForge structures what can be learned. AI Harness performs the work. The Knowledge Graph connects what is known. Assessment establishes what is understood. Mastery Analytics measures how the learner develops. AH-AIOS governs the entire environment. The ultimate objective is not to build a better chatbot; it is to build a system that makes human beings better learners.

**Architectural positioning:** defines the proposed target scope of the new AH-AIOS Learning App. Distinct from the existing Learning App Studio specification. Preserves the established three-domain architecture and does not independently authorize implementation, deployment, or canonization.
