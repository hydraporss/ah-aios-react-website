window.AH_LEARNING_CURRICULUM = {
  "schema": "ah-aios-learning-curriculum",
  "version": 1,
  "source": {
    "documentId": "AH-LEARN-MASTER-001",
    "version": "0.1.0",
    "status": "SUGGESTION / PROCESS",
    "branch": "ah-aios-learning-package",
    "path": "docs/learning/content-master-plan.md",
    "gitBlobSha": "b124c7c55818b2a7e28899139c30745c3fcb343e",
    "url": "https://github.com/hydraporss/ah-aios-react-website/blob/ah-aios-learning-package/docs/learning/content-master-plan.md"
  },
  "courseCount": 24,
  "lessonCount": 96,
  "courses": [
    {
      "id": "AH-CORE-100",
      "title": "AH-AIOS Orientation and System Map",
      "domain": "AH-AIOS Core",
      "outcome": "Explain the purpose, domains, boundaries, and learning progression of AH-AIOS.",
      "lessons": [
        {
          "id": "M1.1",
          "title": "Why AH-AIOS exists — problem space and intended purpose",
          "exercise": "write a source-grounded purpose statement",
          "status": "Authored draft",
          "content": {
            "status": "Authored draft",
            "purpose": "Understand why AH-AIOS Learning exists and the kind of capability it is intended to develop.",
            "outcomes": [
              "State the learning environment's documented purpose in your own words.",
              "Describe the documented learning progression in the correct order.",
              "Distinguish a learning objective from evidence that the objective has been achieved."
            ],
            "prerequisites": [
              "None; orientation lesson."
            ],
            "sourceBase": [
              "docs/learning/platform-definition.md § Product definition and Learning experience",
              "docs/learning/README.md § Purpose"
            ],
            "explanation": "AH-AIOS Learning is defined as a structured learning and capability-development environment for people who design, operate, build, govern, and steward the AH-AIOS ecosystem. It connects conceptual learning with practical work, evidence of competency, and responsible system stewardship. Its stated progression is Discover → Learn → Experiment → Build → Demonstrate. The package defines the learning product and content model; it does not prove that every proposed platform capability is implemented.",
            "workedExample": {
              "title": "Classifying a learning objective",
              "steps": [
                "Objective: explain the difference between a source claim and an interpretation.",
                "Practice: classify statements in a supplied source set.",
                "Build: create a source-to-claim record.",
                "Demonstrate: submit the record with evidence and explain unresolved uncertainty."
              ],
              "result": "The sequence moves from understanding to practice and evidence. Merely reading the objective does not demonstrate the capability."
            },
            "guidedPractice": [
              "Read the product definition and learning progression.",
              "Underline the intended learner groups: design, operate, build, govern, steward.",
              "Map one learning activity to each of the five progression stages."
            ],
            "independentExercise": {
              "input": "The platform definition and a learner's proposed activity.",
              "instructions": "Write a 100–150 word purpose statement using only the supplied sources. Then map one activity to Discover, Learn, Experiment, Build, and Demonstrate.",
              "deliverables": [
                "Purpose statement",
                "Five-stage activity map",
                "One limitation the source explicitly states"
              ]
            },
            "knowledgeCheck": [
              {
                "question": "What is the stated purpose of AH-AIOS Learning?",
                "options": [
                  "To automatically make AI output authoritative",
                  "To develop capability by connecting system knowledge, documented practices, applied work, and evidence",
                  "To replace the AH-AIOS ecosystem"
                ],
                "answer": 1,
                "rationale": "The platform definition describes a structured capability-development environment and a progression from learning to demonstrated evidence."
              },
              {
                "question": "Which sequence is specified by the learning package?",
                "options": [
                  "Build → Discover → Publish → Approve",
                  "Discover → Learn → Experiment → Build → Demonstrate",
                  "Generate → Canonize → Deploy"
                ],
                "answer": 1,
                "rationale": "This is the exact progression stated in the learning package."
              }
            ],
            "assessmentEvidence": "A source-grounded purpose statement and a five-stage learning map.",
            "feedback": "If the statement claims an AI tutor, credential issuer, or analytics service is already implemented, revise it: the platform definition lists some of these as product areas or future capabilities, not verified implementation.",
            "safetyBoundary": "Do not place credentials, secrets, or private learner data in the exercise. Do not present product intent as implemented capability.",
            "references": [
              "docs/learning/platform-definition.md",
              "docs/learning/README.md"
            ],
            "reviewStatus": "Not reviewed"
          }
        },
        {
          "id": "M1.2",
          "title": "AH-AIOS domain map — distinguish Core, AI Harness, WorldForge, and cross-cutting Human Stewardship",
          "exercise": "classify example capabilities and justify the classification",
          "status": "Authored draft",
          "content": {
            "status": "Authored draft",
            "purpose": "Distinguish the three technical learning domains from cross-cutting stewardship and the creative knowledge context.",
            "outcomes": [
              "Name the three technical learning domains.",
              "Explain why Human Stewardship is cross-cutting rather than a fourth technical subsystem.",
              "Classify AFTER HUMANITY as a creative and intellectual knowledge context."
            ],
            "prerequisites": [
              "AH-CORE-100 M1.1"
            ],
            "sourceBase": [
              "docs/learning/README.md § Learning domains",
              "docs/learning/content-master-plan.md § Learning domains"
            ],
            "explanation": "The learning package identifies three technical learning domains: AH-AIOS Core, AI Harness, and WorldForge. Human Stewardship develops judgment, oversight, accountability, and responsible operation across those domains; it is explicitly not a fourth technical subsystem. AFTER HUMANITY is an authorized creative and intellectual context that can supply learning cases and projects; it is not a separate AH-AIOS implementation domain.",
            "workedExample": {
              "title": "Classify five learning activities",
              "steps": [
                "A lesson about identity and access belongs to AH-AIOS Core.",
                "A lesson about agent tools and orchestration belongs to AI Harness.",
                "A lesson about entities, claims, and provenance belongs to WorldForge.",
                "A review of evidence quality and accountability is Human Stewardship and may apply across all three domains.",
                "A continuity case using an authorized AFTER HUMANITY excerpt is a creative knowledge context used in learning."
              ],
              "result": "Classify by the capability being developed, not by the example's theme or visual presentation."
            },
            "guidedPractice": [
              "Read the domain descriptions in the source package.",
              "Place each domain on a three-column map.",
              "Draw Human Stewardship as a cross-cutting band across the three columns.",
              "Place AFTER HUMANITY beside the map as an applied context, not as a technical domain."
            ],
            "independentExercise": {
              "input": "A list of sample activities supplied by the instructor.",
              "instructions": "Classify each activity as Core, AI Harness, WorldForge, cross-cutting Stewardship, or AFTER HUMANITY context. For each, cite the phrase in the source that supports your classification.",
              "deliverables": [
                "Classification table",
                "Source citations",
                "One ambiguous case and the question needed to resolve it"
              ]
            },
            "knowledgeCheck": [
              {
                "question": "How does the source define Human Stewardship?",
                "options": [
                  "A fourth technical subsystem",
                  "A cross-cutting capability for judgment, oversight, accountability, and responsible operation",
                  "A replacement for WorldForge"
                ],
                "answer": 1,
                "rationale": "The learning package explicitly describes Stewardship as cross-cutting and not a fourth technical subsystem."
              },
              {
                "question": "What is AFTER HUMANITY in the learning package?",
                "options": [
                  "A separate AH-AIOS implementation domain",
                  "An authorized creative and intellectual knowledge context for applied examples",
                  "The name of the AI Harness"
                ],
                "answer": 1,
                "rationale": "The source identifies AFTER HUMANITY as a context that can supply learning cases and projects."
              }
            ],
            "assessmentEvidence": "A domain classification map with source-backed rationale.",
            "feedback": "A common error is counting Human Stewardship as a fourth technical subsystem. It is a cross-cutting learning thread. Another error is treating AFTER HUMANITY as an implementation subsystem.",
            "safetyBoundary": "Only use authorized AFTER HUMANITY material in applied exercises. Preserve canon/source distinctions; an exercise classification does not authorize canon changes.",
            "references": [
              "docs/learning/README.md",
              "docs/learning/content-master-plan.md"
            ],
            "reviewStatus": "Not reviewed"
          }
        },
        {
          "id": "M1.3",
          "title": "AFTER HUMANITY as a knowledge context — distinguish creative canon from a technical subsystem",
          "exercise": "classify sample resources by authority",
          "status": "Authored draft",
          "content": {
            "status": "Authored draft",
            "purpose": "Use AFTER HUMANITY as an applied knowledge context without confusing creative canon with technical implementation.",
            "outcomes": [
              "Distinguish a creative-world statement from a technical capability claim.",
              "Identify the source and authority label needed to classify a resource.",
              "Explain why a fictional example cannot prove that a software feature exists."
            ],
            "prerequisites": [
              "AH-CORE-100 M1.1–M1.2"
            ],
            "sourceBase": [
              "docs/learning/content-master-plan.md § Learning domains and § 4.1 AH-CORE-100",
              "docs/learning/content-governance.md § Governance principles and Authority boundary",
              "README.md § Project Status"
            ],
            "explanation": "The learning master plan identifies AFTER HUMANITY as an authorized creative and intellectual context for applied examples, not a separate AH-AIOS implementation domain. Content governance distinguishes CANON, INTERPRETATION, SUGGESTION, and PROCESS where applicable. The repository README separately distinguishes browser prototype capabilities, server foundations, and production requirements. A story statement may be authoritative within its creative canon while providing no evidence that a software component has been implemented.",
            "workedExample": {
              "title": "A fictional event versus a software claim",
              "steps": [
                "Statement A: a character uses a fictional archive in a story. Record it as a creative-world statement and cite the authorized story source.",
                "Statement B: the Learning Studio synchronizes learner progress to a server. Treat it as an implementation claim and require code, deployment, and end-to-end verification evidence.",
                "Do not use Statement A as evidence for Statement B."
              ],
              "result": "Authority is scoped to the kind of claim. Creative authority and implementation evidence answer different questions."
            },
            "guidedPractice": [
              "Choose one supplied creative-world excerpt and one software README statement.",
              "Label the resource type and source.",
              "Write one claim each resource can support and one claim it cannot support."
            ],
            "independentExercise": {
              "input": "One authorized AFTER HUMANITY excerpt and one implementation-status document.",
              "instructions": "Create a two-row authority table. For each row state resource type, source, supported claim, unsupported claim, and unresolved question.",
              "deliverables": [
                "Authority table",
                "Two source references",
                "Boundary explanation"
              ]
            },
            "knowledgeCheck": [
              {
                "question": "Can an AFTER HUMANITY story excerpt prove that a Learning Studio feature is deployed?",
                "options": [
                  "Yes, if the story is canon",
                  "No; deployment needs implementation and environment-specific verification evidence",
                  "Yes, if the feature name is similar"
                ],
                "answer": 1,
                "rationale": "Creative canon and software implementation evidence have different scopes."
              }
            ],
            "assessmentEvidence": "A two-resource authority classification with supported and unsupported claims.",
            "feedback": "If a resource is authoritative for a story fact, do not extend that authority to software behavior. State the scope of every source.",
            "safetyBoundary": "Do not alter creative canon during this exercise. Use only authorized excerpts and preserve the original wording.",
            "references": [
              "docs/learning/content-master-plan.md",
              "docs/learning/content-governance.md",
              "README.md"
            ],
            "reviewStatus": "Not reviewed"
          }
        },
        {
          "id": "M1.4",
          "title": "Vocabulary and status language — distinguish specified, authored, reviewed, implemented, tested, deployed, and production-assured",
          "exercise": "correct an overstated status report",
          "status": "Authored draft",
          "content": {
            "status": "Authored draft",
            "purpose": "Report content, implementation, and release states without collapsing them into one claim of completion.",
            "outcomes": [
              "Distinguish the content lifecycle from implementation evidence states.",
              "Use the source's definitions for specified, authored, reviewed, published, tested, deployed, and production-assured.",
              "Correct an overstated project status report."
            ],
            "prerequisites": [
              "AH-CORE-100 M1.1–M1.3"
            ],
            "sourceBase": [
              "docs/learning/content-master-plan.md § Status language, § Content production and release workflow",
              "docs/learning/content-governance.md § Content lifecycle",
              "README.md § Project Status"
            ],
            "explanation": "The master plan defines content states separately from implementation evidence. Content states include Specified, Authored, Reviewed, Published, Tested, Deployed, and Production-assured. It also describes the content lifecycle Draft → Review → Approved for Publication → Published → Retired. Implementation evidence such as implemented or tested must not be inferred from a content specification. The master plan's release workflow uses Draft → In Review → Approved for Publication → Published → Retired. These states describe different dimensions and must not be merged.",
            "workedExample": {
              "title": "Correct an overstated status report",
              "steps": [
                "Source document describes a feature: mark it Specified.",
                "A lesson author writes the content: mark it Authored, with version and author.",
                "Required reviewers record their review: mark it Reviewed only within the assigned review scope.",
                "Publication approval is recorded and the content is made available: mark it Published.",
                "A test is actually executed and results are recorded: mark it Tested.",
                "A build is released to its target environment: mark it Deployed only after deployment evidence.",
                "Production assurance requires the applicable operational, security, privacy, reliability, and governance checks."
              ],
              "result": "A document or successful build alone does not establish publication, deployment, or production assurance."
            },
            "guidedPractice": [
              "Read the status definitions in the master plan.",
              "Sort sample statements into content state, implementation state, or operational assurance.",
              "Identify what evidence is missing before advancing each state."
            ],
            "independentExercise": {
              "input": "A hypothetical status report containing claims about specified lessons, code, CI, deployment, and production readiness.",
              "instructions": "Rewrite the report. Give each claim a state, supporting evidence, and an explicit unknown where evidence is missing.",
              "deliverables": [
                "Corrected status report",
                "Evidence-to-status table",
                "Unresolved acceptance list"
              ]
            },
            "knowledgeCheck": [
              {
                "question": "A course outline exists, but no full lesson has been written. Which status is supported?",
                "options": [
                  "Authored",
                  "Specified",
                  "Published"
                ],
                "answer": 1,
                "rationale": "A described course blueprint is specified. Authored requires the instructional content to be written."
              },
              {
                "question": "A CI build passes. Does that alone establish production assurance?",
                "options": [
                  "Yes",
                  "No; build success is one verification result and does not establish all operational, security, privacy, reliability, and governance requirements",
                  "Yes, if the README says production"
                ],
                "answer": 1,
                "rationale": "The master plan explicitly separates content and implementation states and requires broader checks for production assurance."
              }
            ],
            "assessmentEvidence": "A corrected status report and evidence-to-status matrix.",
            "feedback": "Do not use 'complete' without stating what is complete: specified, authored, reviewed, published, tested, deployed, or production-assured.",
            "safetyBoundary": "Do not publish, deploy, or change protected content as part of this exercise. Use hypothetical records.",
            "references": [
              "docs/learning/content-master-plan.md",
              "docs/learning/content-governance.md",
              "README.md"
            ],
            "reviewStatus": "Not reviewed"
          }
        }
      ],
      "assessment": "annotated system map, terminology check, and written boundary explanation.",
      "contentStatus": "Specified",
      "publicationStatus": "Not published",
      "sourceRefs": [
        "AH-LEARN-MASTER-001",
        "AH-LEARN-README-001",
        "AH-LEARN-CURRICULUM-001",
        "AH-LEARN-GOV-001",
        "AH-LEARN-ASSESS-001",
        "AH-LEARN-CORE-PATH-001",
        "AH-LEARN-PLATFORM-001",
        "WF-README-001"
      ]
    },
    {
      "id": "AH-CORE-110",
      "title": "Architecture and System Boundaries",
      "domain": "AH-AIOS Core",
      "outcome": "Explain component responsibilities, interfaces, dependencies, and separation of concerns.",
      "lessons": [
        {
          "id": "M1.1",
          "title": "Architecture as responsibilities and relationships",
          "exercise": "identify component responsibilities",
          "status": "Specified"
        },
        {
          "id": "M1.2",
          "title": "Components, interfaces, and dependencies",
          "exercise": "draw and label a dependency map",
          "status": "Specified"
        },
        {
          "id": "M1.3",
          "title": "Trust boundaries and data movement",
          "exercise": "trace a request and mark trust boundaries",
          "status": "Specified"
        },
        {
          "id": "M1.4",
          "title": "Prototype, service foundation, and production system",
          "exercise": "classify implementation evidence without promoting prototype status",
          "status": "Specified"
        }
      ],
      "assessment": "architecture diagram, interface inventory, and boundary analysis.",
      "contentStatus": "Specified",
      "publicationStatus": "Not published",
      "sourceRefs": [
        "AH-LEARN-MASTER-001",
        "AH-LEARN-README-001",
        "AH-LEARN-CURRICULUM-001",
        "AH-LEARN-GOV-001",
        "AH-LEARN-ASSESS-001",
        "AH-LEARN-CORE-PATH-001",
        "AH-LEARN-PLATFORM-001",
        "WF-README-001"
      ]
    },
    {
      "id": "AH-CORE-120",
      "title": "Identity, Roles, and Access Control",
      "domain": "AH-AIOS Core",
      "outcome": "Analyze access scenarios using identity, role, permission, and least-privilege concepts.",
      "lessons": [
        {
          "id": "M1.1",
          "title": "Identity, authentication, and authorization",
          "exercise": "distinguish the three in scenarios",
          "status": "Specified"
        },
        {
          "id": "M1.2",
          "title": "Roles, permissions, and resource scope",
          "exercise": "build a fictional role-permission matrix",
          "status": "Specified"
        },
        {
          "id": "M1.3",
          "title": "Least privilege and access lifecycle",
          "exercise": "review an over-permissioned account and document a correction",
          "status": "Specified"
        },
        {
          "id": "M1.4",
          "title": "Access decisions and audit evidence",
          "exercise": "map a request to the evidence needed to explain its authorization outcome",
          "status": "Specified"
        }
      ],
      "assessment": "role-permission matrix and scenario analysis. Never use real credentials in exercises.",
      "contentStatus": "Specified",
      "publicationStatus": "Not published",
      "sourceRefs": [
        "AH-LEARN-MASTER-001",
        "AH-LEARN-README-001",
        "AH-LEARN-CURRICULUM-001",
        "AH-LEARN-GOV-001",
        "AH-LEARN-ASSESS-001",
        "AH-LEARN-CORE-PATH-001",
        "AH-LEARN-PLATFORM-001",
        "WF-README-001"
      ]
    },
    {
      "id": "AH-CORE-130",
      "title": "Security, Policy, and Safe Operation",
      "domain": "AH-AIOS Core",
      "outcome": "Identify security boundaries and explain how policy and human review constrain operation.",
      "lessons": [
        {
          "id": "M1.1",
          "title": "Assets, threats, and attack surfaces",
          "exercise": "create a bounded threat inventory",
          "status": "Specified"
        },
        {
          "id": "M1.2",
          "title": "Policy rules and enforcement points",
          "exercise": "map policy statements to enforcement responsibilities",
          "status": "Specified"
        },
        {
          "id": "M1.3",
          "title": "Untrusted input and instruction conflicts",
          "exercise": "analyze a sample untrusted-content scenario",
          "status": "Specified"
        },
        {
          "id": "M1.4",
          "title": "Incident recognition and escalation",
          "exercise": "classify incidents and draft an escalation record",
          "status": "Specified"
        }
      ],
      "assessment": "threat model, policy-to-control map, and incident tabletop response.",
      "contentStatus": "Specified",
      "publicationStatus": "Not published",
      "sourceRefs": [
        "AH-LEARN-MASTER-001",
        "AH-LEARN-README-001",
        "AH-LEARN-CURRICULUM-001",
        "AH-LEARN-GOV-001",
        "AH-LEARN-ASSESS-001",
        "AH-LEARN-CORE-PATH-001",
        "AH-LEARN-PLATFORM-001",
        "WF-README-001"
      ]
    },
    {
      "id": "AH-CORE-140",
      "title": "Audit, Evidence, and Verification",
      "domain": "AH-AIOS Core",
      "outcome": "Distinguish claims, evidence, observations, and verification results.",
      "lessons": [
        {
          "id": "M1.1",
          "title": "What counts as evidence",
          "exercise": "sort observations, assertions, artifacts, and assumptions",
          "status": "Specified"
        },
        {
          "id": "M1.2",
          "title": "Audit events and traceability",
          "exercise": "construct an event sequence for a sample operation",
          "status": "Specified"
        },
        {
          "id": "M1.3",
          "title": "Verification criteria and reproducibility",
          "exercise": "turn vague success statements into testable criteria",
          "status": "Specified"
        },
        {
          "id": "M1.4",
          "title": "Reporting limitations and unresolved results",
          "exercise": "write a report that preserves unknowns and failed checks",
          "status": "Specified"
        }
      ],
      "assessment": "evidence dossier with source references, criteria, results, and limitations.",
      "contentStatus": "Specified",
      "publicationStatus": "Not published",
      "sourceRefs": [
        "AH-LEARN-MASTER-001",
        "AH-LEARN-README-001",
        "AH-LEARN-CURRICULUM-001",
        "AH-LEARN-GOV-001",
        "AH-LEARN-ASSESS-001",
        "AH-LEARN-CORE-PATH-001",
        "AH-LEARN-PLATFORM-001",
        "WF-README-001"
      ]
    },
    {
      "id": "AH-CORE-150",
      "title": "Governance and Controlled Change",
      "domain": "AH-AIOS Core",
      "outcome": "Describe how proposals, reviews, approvals, versions, and protected assets are handled.",
      "lessons": [
        {
          "id": "M1.1",
          "title": "Governance authority and scope",
          "exercise": "classify who may propose, review, approve, and implement a sample change",
          "status": "Specified"
        },
        {
          "id": "M1.2",
          "title": "Change proposals and rationale",
          "exercise": "prepare a change record with source, impact, and verification plan",
          "status": "Specified"
        },
        {
          "id": "M1.3",
          "title": "Protected assets, conflicts, and history",
          "exercise": "preserve a conflicting record without overwriting history",
          "status": "Specified"
        },
        {
          "id": "M1.4",
          "title": "Release, rollback, and post-change verification",
          "exercise": "produce a release checklist and rollback conditions",
          "status": "Specified"
        }
      ],
      "assessment": "governed change dossier. Real canon changes always require the applicable explicit authorization.",
      "contentStatus": "Specified",
      "publicationStatus": "Not published",
      "sourceRefs": [
        "AH-LEARN-MASTER-001",
        "AH-LEARN-README-001",
        "AH-LEARN-CURRICULUM-001",
        "AH-LEARN-GOV-001",
        "AH-LEARN-ASSESS-001",
        "AH-LEARN-CORE-PATH-001",
        "AH-LEARN-PLATFORM-001",
        "WF-README-001"
      ]
    },
    {
      "id": "AH-HAR-100",
      "title": "AI Harness Foundations",
      "domain": "AI Harness",
      "outcome": "Explain models, agents, tools, context, instructions, and execution environments.",
      "lessons": [
        {
          "id": "M1.1",
          "title": "Model, agent, harness, and application",
          "exercise": "label components in a sample architecture",
          "status": "Specified"
        },
        {
          "id": "M1.2",
          "title": "Context, instructions, and task boundaries",
          "exercise": "separate task input, trusted instruction, and untrusted data",
          "status": "Specified"
        },
        {
          "id": "M1.3",
          "title": "Tool use and execution flow",
          "exercise": "trace a tool call from request through result handling",
          "status": "Specified"
        },
        {
          "id": "M1.4",
          "title": "Human-in-the-loop operation",
          "exercise": "identify actions requiring approval or escalation",
          "status": "Specified"
        }
      ],
      "assessment": "annotated harness diagram and execution walkthrough.",
      "contentStatus": "Specified",
      "publicationStatus": "Not published",
      "sourceRefs": [
        "AH-LEARN-MASTER-001",
        "AH-LEARN-README-001",
        "AH-LEARN-CURRICULUM-001",
        "AH-LEARN-GOV-001",
        "AH-LEARN-ASSESS-001",
        "AH-LEARN-HAR-PATH-001",
        "AH-LEARN-PLATFORM-001",
        "WF-README-001"
      ]
    },
    {
      "id": "AH-HAR-110",
      "title": "Models, Agents, Context, and Instructions",
      "domain": "AI Harness",
      "outcome": "Specify a bounded agent task and explain its constraints.",
      "lessons": [
        {
          "id": "M1.1",
          "title": "Model capabilities and limitations",
          "exercise": "match tasks to requirements and flag unsupported assumptions",
          "status": "Specified"
        },
        {
          "id": "M1.2",
          "title": "Agent roles and task decomposition",
          "exercise": "decompose a bounded task into verifiable steps",
          "status": "Specified"
        },
        {
          "id": "M1.3",
          "title": "Context selection and source grounding",
          "exercise": "build a context pack with source labels",
          "status": "Specified"
        },
        {
          "id": "M1.4",
          "title": "Instruction hierarchy and untrusted content",
          "exercise": "analyze conflicting instructions and define safe handling",
          "status": "Specified"
        }
      ],
      "assessment": "agent task specification with scope, inputs, outputs, authority limits, and failure behavior.",
      "contentStatus": "Specified",
      "publicationStatus": "Not published",
      "sourceRefs": [
        "AH-LEARN-MASTER-001",
        "AH-LEARN-README-001",
        "AH-LEARN-CURRICULUM-001",
        "AH-LEARN-GOV-001",
        "AH-LEARN-ASSESS-001",
        "AH-LEARN-HAR-PATH-001",
        "AH-LEARN-PLATFORM-001",
        "WF-README-001"
      ]
    },
    {
      "id": "AH-HAR-120",
      "title": "Tool Contracts and Integrations",
      "domain": "AI Harness",
      "outcome": "Define a tool interface that is explicit, constrained, and testable.",
      "lessons": [
        {
          "id": "M1.1",
          "title": "Tool purpose and action boundaries",
          "exercise": "state purpose and prohibited actions",
          "status": "Specified"
        },
        {
          "id": "M1.2",
          "title": "Input and output schemas",
          "exercise": "define fields, types, validation, and examples",
          "status": "Specified"
        },
        {
          "id": "M1.3",
          "title": "Permissions, secrets, and data handling",
          "exercise": "identify excess authority and unsafe data exposure",
          "status": "Specified"
        },
        {
          "id": "M1.4",
          "title": "Errors, timeouts, and idempotency",
          "exercise": "specify failure responses and retry behavior",
          "status": "Specified"
        }
      ],
      "assessment": "tool contract, test cases, and permission review.",
      "contentStatus": "Specified",
      "publicationStatus": "Not published",
      "sourceRefs": [
        "AH-LEARN-MASTER-001",
        "AH-LEARN-README-001",
        "AH-LEARN-CURRICULUM-001",
        "AH-LEARN-GOV-001",
        "AH-LEARN-ASSESS-001",
        "AH-LEARN-HAR-PATH-001",
        "AH-LEARN-PLATFORM-001",
        "WF-README-001"
      ]
    },
    {
      "id": "AH-HAR-130",
      "title": "APIs, Data Contracts, and Service Boundaries",
      "domain": "AI Harness",
      "outcome": "Explain request/response patterns and specify a reliable service interaction.",
      "lessons": [
        {
          "id": "M1.1",
          "title": "HTTP and API fundamentals",
          "exercise": "annotate a sample request and response",
          "status": "Specified"
        },
        {
          "id": "M1.2",
          "title": "Authentication concepts and secret handling",
          "exercise": "identify safe and unsafe fictional patterns",
          "status": "Specified"
        },
        {
          "id": "M1.3",
          "title": "Schemas, validation, and compatibility",
          "exercise": "review a versioned data contract",
          "status": "Specified"
        },
        {
          "id": "M1.4",
          "title": "Service errors and integration boundaries",
          "exercise": "create an API failure-mode table",
          "status": "Specified"
        }
      ],
      "assessment": "API integration specification with schemas, authentication boundary, and error handling.",
      "contentStatus": "Specified",
      "publicationStatus": "Not published",
      "sourceRefs": [
        "AH-LEARN-MASTER-001",
        "AH-LEARN-README-001",
        "AH-LEARN-CURRICULUM-001",
        "AH-LEARN-GOV-001",
        "AH-LEARN-ASSESS-001",
        "AH-LEARN-HAR-PATH-001",
        "AH-LEARN-PLATFORM-001",
        "WF-README-001"
      ]
    },
    {
      "id": "AH-HAR-140",
      "title": "Workflow Orchestration and State",
      "domain": "AI Harness",
      "outcome": "Model a multi-step workflow with explicit state, recovery, and human checkpoints.",
      "lessons": [
        {
          "id": "M1.1",
          "title": "Workflow steps and state transitions",
          "exercise": "draw a state machine",
          "status": "Specified"
        },
        {
          "id": "M1.2",
          "title": "Delegation and tool sequencing",
          "exercise": "assign tasks and define handoff conditions",
          "status": "Specified"
        },
        {
          "id": "M1.3",
          "title": "Retry, recovery, and duplicate-action risks",
          "exercise": "design recovery for interrupted execution",
          "status": "Specified"
        },
        {
          "id": "M1.4",
          "title": "Human approval and escalation gates",
          "exercise": "define review checkpoints and required evidence",
          "status": "Specified"
        }
      ],
      "assessment": "workflow specification, state diagram, and test scenarios.",
      "contentStatus": "Specified",
      "publicationStatus": "Not published",
      "sourceRefs": [
        "AH-LEARN-MASTER-001",
        "AH-LEARN-README-001",
        "AH-LEARN-CURRICULUM-001",
        "AH-LEARN-GOV-001",
        "AH-LEARN-ASSESS-001",
        "AH-LEARN-HAR-PATH-001",
        "AH-LEARN-PLATFORM-001",
        "WF-README-001"
      ]
    },
    {
      "id": "AH-HAR-150",
      "title": "Evaluation, Reliability, and Observability",
      "domain": "AI Harness",
      "outcome": "Evaluate a workflow against explicit expectations and interpret execution evidence.",
      "lessons": [
        {
          "id": "M1.1",
          "title": "Evaluation objectives and test design",
          "exercise": "turn objectives into acceptance criteria",
          "status": "Specified"
        },
        {
          "id": "M1.2",
          "title": "Positive, negative, and edge-case tests",
          "exercise": "construct a balanced test matrix",
          "status": "Specified"
        },
        {
          "id": "M1.3",
          "title": "Logs, traces, and reproducibility",
          "exercise": "interpret a fictional execution trace",
          "status": "Specified"
        },
        {
          "id": "M1.4",
          "title": "Regression and failure analysis",
          "exercise": "diagnose a regression and propose verification tests",
          "status": "Specified"
        }
      ],
      "assessment": "evaluation suite, results report, failure analysis, and reproducibility notes.",
      "contentStatus": "Specified",
      "publicationStatus": "Not published",
      "sourceRefs": [
        "AH-LEARN-MASTER-001",
        "AH-LEARN-README-001",
        "AH-LEARN-CURRICULUM-001",
        "AH-LEARN-GOV-001",
        "AH-LEARN-ASSESS-001",
        "AH-LEARN-HAR-PATH-001",
        "AH-LEARN-PLATFORM-001",
        "WF-README-001"
      ]
    },
    {
      "id": "AH-HAR-160",
      "title": "Safe Agent Operation and Human Oversight",
      "domain": "AI Harness",
      "outcome": "Design oversight that matches action risk and authority.",
      "lessons": [
        {
          "id": "M1.1",
          "title": "Risk tiers and action impact",
          "exercise": "classify actions by consequence and reversibility",
          "status": "Specified"
        },
        {
          "id": "M1.2",
          "title": "Least authority and scoped tools",
          "exercise": "reduce a sample agent's permissions",
          "status": "Specified"
        },
        {
          "id": "M1.3",
          "title": "Prompt injection and hostile data",
          "exercise": "identify untrusted instructions in a supplied dataset",
          "status": "Specified"
        },
        {
          "id": "M1.4",
          "title": "Approval, escalation, and accountability",
          "exercise": "design a review checkpoint and evidence record",
          "status": "Specified"
        }
      ],
      "assessment": "safe-operation plan with risk classification, permissions, approval rules, and escalation path.",
      "contentStatus": "Specified",
      "publicationStatus": "Not published",
      "sourceRefs": [
        "AH-LEARN-MASTER-001",
        "AH-LEARN-README-001",
        "AH-LEARN-CURRICULUM-001",
        "AH-LEARN-GOV-001",
        "AH-LEARN-ASSESS-001",
        "AH-LEARN-HAR-PATH-001",
        "AH-LEARN-PLATFORM-001",
        "WF-README-001"
      ]
    },
    {
      "id": "AH-WF-100",
      "title": "Knowledge-Model Foundations",
      "domain": "WorldForge",
      "outcome": "Build a small structured model with stable entities and typed relationships.",
      "lessons": [
        {
          "id": "M1.1",
          "title": "Entities, attributes, and identifiers",
          "exercise": "define entity types and stable IDs",
          "status": "Specified"
        },
        {
          "id": "M1.2",
          "title": "Relationship types and constraints",
          "exercise": "model relationships and identify invalid combinations",
          "status": "Specified"
        },
        {
          "id": "M1.3",
          "title": "Controlled vocabularies and data quality",
          "exercise": "normalize inconsistent terms",
          "status": "Specified"
        },
        {
          "id": "M1.4",
          "title": "Validation and model evolution",
          "exercise": "test a model against valid and invalid cases",
          "status": "Specified"
        }
      ],
      "assessment": "bounded knowledge model, schema notes, and validation report.",
      "contentStatus": "Specified",
      "publicationStatus": "Not published",
      "sourceRefs": [
        "AH-LEARN-MASTER-001",
        "AH-LEARN-README-001",
        "AH-LEARN-CURRICULUM-001",
        "AH-LEARN-GOV-001",
        "AH-LEARN-ASSESS-001",
        "AH-LEARN-WF-PATH-001",
        "WF-README-001",
        "WF-CONSTITUTION-001",
        "WF-DOCTRINE-001",
        "WF-GOVERNANCE-UI-001",
        "WF-GOVERNANCE-CODE-001"
      ]
    },
    {
      "id": "AH-WF-110",
      "title": "Worldbuilding and Domain Modeling",
      "domain": "WorldForge",
      "outcome": "Represent a world or domain as connected, structured knowledge.",
      "lessons": [
        {
          "id": "M1.1",
          "title": "World scope and design boundaries",
          "exercise": "write a scope statement and exclusions",
          "status": "Specified"
        },
        {
          "id": "M1.2",
          "title": "Places, peoples, groups, and institutions",
          "exercise": "create a linked entity set",
          "status": "Specified"
        },
        {
          "id": "M1.3",
          "title": "Events, chronology, and causality",
          "exercise": "build an event sequence and identify dependencies",
          "status": "Specified"
        },
        {
          "id": "M1.4",
          "title": "Characters, identity, and relationships",
          "exercise": "model identity continuity and relationships over time",
          "status": "Specified"
        }
      ],
      "assessment": "bounded world workspace with entities, relationships, timeline, and scope statement.",
      "contentStatus": "Specified",
      "publicationStatus": "Not published",
      "sourceRefs": [
        "AH-LEARN-MASTER-001",
        "AH-LEARN-README-001",
        "AH-LEARN-CURRICULUM-001",
        "AH-LEARN-GOV-001",
        "AH-LEARN-ASSESS-001",
        "AH-LEARN-WF-PATH-001",
        "WF-README-001",
        "WF-CONSTITUTION-001",
        "WF-DOCTRINE-001",
        "WF-GOVERNANCE-UI-001",
        "WF-GOVERNANCE-CODE-001"
      ]
    },
    {
      "id": "AH-WF-120",
      "title": "Sources, Claims, and Evidence",
      "domain": "WorldForge",
      "outcome": "Connect statements to sources while preserving uncertainty and interpretation.",
      "lessons": [
        {
          "id": "M1.1",
          "title": "Source records and attribution",
          "exercise": "register supplied sources",
          "status": "Specified"
        },
        {
          "id": "M1.2",
          "title": "Claims and atomic statements",
          "exercise": "split compound assertions into reviewable claims",
          "status": "Specified"
        },
        {
          "id": "M1.3",
          "title": "Evidence relevance and strength",
          "exercise": "evaluate whether evidence supports a claim",
          "status": "Specified"
        },
        {
          "id": "M1.4",
          "title": "Interpretation, contradiction, and uncertainty",
          "exercise": "record competing claims without silently resolving them",
          "status": "Specified"
        }
      ],
      "assessment": "source-to-claim map with evidence links and uncertainty labels.",
      "contentStatus": "Specified",
      "publicationStatus": "Not published",
      "sourceRefs": [
        "AH-LEARN-MASTER-001",
        "AH-LEARN-README-001",
        "AH-LEARN-CURRICULUM-001",
        "AH-LEARN-GOV-001",
        "AH-LEARN-ASSESS-001",
        "AH-LEARN-WF-PATH-001",
        "WF-README-001",
        "WF-CONSTITUTION-001",
        "WF-DOCTRINE-001",
        "WF-GOVERNANCE-UI-001",
        "WF-GOVERNANCE-CODE-001"
      ]
    },
    {
      "id": "AH-WF-130",
      "title": "Provenance and Verification",
      "domain": "WorldForge",
      "outcome": "Trace a knowledge item from source through interpretation, review, and verification.",
      "lessons": [
        {
          "id": "M1.1",
          "title": "Provenance chains",
          "exercise": "construct source-to-record lineage",
          "status": "Specified"
        },
        {
          "id": "M1.2",
          "title": "Evidence records and reviewer rationale",
          "exercise": "write a review record for a disputed claim",
          "status": "Specified"
        },
        {
          "id": "M1.3",
          "title": "Verification plans and outcomes",
          "exercise": "define criteria and record test results",
          "status": "Specified"
        },
        {
          "id": "M1.4",
          "title": "Version history and reproducibility",
          "exercise": "reconstruct changes between record versions",
          "status": "Specified"
        }
      ],
      "assessment": "traceability dossier and reproducible verification report.",
      "contentStatus": "Specified",
      "publicationStatus": "Not published",
      "sourceRefs": [
        "AH-LEARN-MASTER-001",
        "AH-LEARN-README-001",
        "AH-LEARN-CURRICULUM-001",
        "AH-LEARN-GOV-001",
        "AH-LEARN-ASSESS-001",
        "AH-LEARN-WF-PATH-001",
        "WF-README-001",
        "WF-CONSTITUTION-001",
        "WF-DOCTRINE-001",
        "WF-GOVERNANCE-UI-001",
        "WF-GOVERNANCE-CODE-001"
      ]
    },
    {
      "id": "AH-WF-140",
      "title": "Canon Governance and Change Control",
      "domain": "WorldForge",
      "outcome": "Apply the canon lifecycle without confusing proposal, interpretation, and authorized canon.",
      "lessons": [
        {
          "id": "M1.1",
          "title": "Canon, interpretation, suggestion, and process",
          "exercise": "label statements and explain distinctions",
          "status": "Specified"
        },
        {
          "id": "M1.2",
          "title": "Canon status and approval authority",
          "exercise": "trace a hypothetical proposal through authorized review",
          "status": "Specified"
        },
        {
          "id": "M1.3",
          "title": "Contradictions and competing records",
          "exercise": "preserve a contradiction and document its status",
          "status": "Specified"
        },
        {
          "id": "M1.4",
          "title": "Revision, supersession, and rollback",
          "exercise": "produce a versioned change history",
          "status": "Specified"
        }
      ],
      "assessment": "simulated canon change dossier with source, proposal, authorization evidence, impact, history, and verification. Do not make real canon changes in the exercise.",
      "contentStatus": "Specified",
      "publicationStatus": "Not published",
      "sourceRefs": [
        "AH-LEARN-MASTER-001",
        "AH-LEARN-README-001",
        "AH-LEARN-CURRICULUM-001",
        "AH-LEARN-GOV-001",
        "AH-LEARN-ASSESS-001",
        "AH-LEARN-WF-PATH-001",
        "WF-README-001",
        "WF-CONSTITUTION-001",
        "WF-DOCTRINE-001",
        "WF-GOVERNANCE-UI-001",
        "WF-GOVERNANCE-CODE-001"
      ]
    },
    {
      "id": "AH-WF-150",
      "title": "Knowledge Graph Operations",
      "domain": "WorldForge",
      "outcome": "Inspect and maintain a graph while preserving valid relationships and exportable records.",
      "lessons": [
        {
          "id": "M1.1",
          "title": "Graph structure and traversal",
          "exercise": "answer questions by traversing a supplied graph",
          "status": "Specified"
        },
        {
          "id": "M1.2",
          "title": "Relationship validation and integrity",
          "exercise": "detect missing, invalid, and orphaned relationships",
          "status": "Specified"
        },
        {
          "id": "M1.3",
          "title": "Search, views, and graph interpretation",
          "exercise": "produce a focused view for a research question",
          "status": "Specified"
        },
        {
          "id": "M1.4",
          "title": "Import, export, and portability",
          "exercise": "export a workspace and verify record counts and IDs",
          "status": "Specified"
        }
      ],
      "assessment": "validated graph, query/view evidence, and import/export report.",
      "contentStatus": "Specified",
      "publicationStatus": "Not published",
      "sourceRefs": [
        "AH-LEARN-MASTER-001",
        "AH-LEARN-README-001",
        "AH-LEARN-CURRICULUM-001",
        "AH-LEARN-GOV-001",
        "AH-LEARN-ASSESS-001",
        "AH-LEARN-WF-PATH-001",
        "WF-README-001",
        "WF-CONSTITUTION-001",
        "WF-DOCTRINE-001",
        "WF-GOVERNANCE-UI-001",
        "WF-GOVERNANCE-CODE-001"
      ]
    },
    {
      "id": "AH-WF-160",
      "title": "Identity, Time, and Narrative Continuity",
      "domain": "WorldForge",
      "outcome": "Detect identity and chronology conflicts in a connected world model.",
      "lessons": [
        {
          "id": "M1.1",
          "title": "Stable identity and aliases",
          "exercise": "distinguish separate entities from aliases",
          "status": "Specified"
        },
        {
          "id": "M1.2",
          "title": "Timelines and temporal constraints",
          "exercise": "identify impossible or unsupported date sequences",
          "status": "Specified"
        },
        {
          "id": "M1.3",
          "title": "Causality and event dependencies",
          "exercise": "map causal chains and flag unsupported links",
          "status": "Specified"
        },
        {
          "id": "M1.4",
          "title": "Continuity review and change impact",
          "exercise": "assess how a proposed edit affects connected records",
          "status": "Specified"
        }
      ],
      "assessment": "continuity audit with issue list, source references, and proposed corrections clearly labeled.",
      "contentStatus": "Specified",
      "publicationStatus": "Not published",
      "sourceRefs": [
        "AH-LEARN-MASTER-001",
        "AH-LEARN-README-001",
        "AH-LEARN-CURRICULUM-001",
        "AH-LEARN-GOV-001",
        "AH-LEARN-ASSESS-001",
        "AH-LEARN-WF-PATH-001",
        "WF-README-001",
        "WF-CONSTITUTION-001",
        "WF-DOCTRINE-001",
        "WF-GOVERNANCE-UI-001",
        "WF-GOVERNANCE-CODE-001"
      ]
    },
    {
      "id": "AH-WF-170",
      "title": "Trust, Risk, and Conflicting Knowledge",
      "domain": "WorldForge",
      "outcome": "Evaluate source trust, knowledge risks, and unresolved conflicts without overstating certainty.",
      "lessons": [
        {
          "id": "M1.1",
          "title": "Source reliability and context",
          "exercise": "assess supplied source profiles",
          "status": "Specified"
        },
        {
          "id": "M1.2",
          "title": "Conflicting claims and adjudication boundaries",
          "exercise": "create a conflict register",
          "status": "Specified"
        },
        {
          "id": "M1.3",
          "title": "Knowledge integrity and operational risk",
          "exercise": "identify provenance, access, continuity, and trust risks",
          "status": "Specified"
        },
        {
          "id": "M1.4",
          "title": "Risk treatment and residual uncertainty",
          "exercise": "write a treatment record that retains unresolved items",
          "status": "Specified"
        }
      ],
      "assessment": "trust and risk report with source assessments, conflict register, treatment actions, and residual uncertainty.",
      "contentStatus": "Specified",
      "publicationStatus": "Not published",
      "sourceRefs": [
        "AH-LEARN-MASTER-001",
        "AH-LEARN-README-001",
        "AH-LEARN-CURRICULUM-001",
        "AH-LEARN-GOV-001",
        "AH-LEARN-ASSESS-001",
        "AH-LEARN-WF-PATH-001",
        "WF-README-001",
        "WF-CONSTITUTION-001",
        "WF-DOCTRINE-001",
        "WF-GOVERNANCE-UI-001",
        "WF-GOVERNANCE-CODE-001"
      ]
    },
    {
      "id": "AH-STW-100",
      "title": "Evidence Literacy and Critical Judgment",
      "domain": "Human Stewardship",
      "outcome": null,
      "lessons": [
        {
          "id": "M1.1",
          "title": "Fact, source claim, inference, and hypothesis",
          "exercise": "classify statements in a mixed evidence set",
          "status": "Specified"
        },
        {
          "id": "M1.2",
          "title": "Evidence quality and relevance",
          "exercise": "assess evidence against a published rubric",
          "status": "Specified"
        },
        {
          "id": "M1.3",
          "title": "Uncertainty and calibrated language",
          "exercise": "rewrite overconfident statements to match evidence",
          "status": "Specified"
        },
        {
          "id": "M1.4",
          "title": "Independent review and dissent",
          "exercise": "preserve disagreement and its rationale",
          "status": "Specified"
        }
      ],
      "assessment": "claim-evaluation dossier with evidence quality and uncertainty notes.",
      "contentStatus": "Specified",
      "publicationStatus": "Not published",
      "sourceRefs": [
        "AH-LEARN-MASTER-001",
        "AH-LEARN-README-001",
        "AH-LEARN-CURRICULUM-001",
        "AH-LEARN-GOV-001",
        "AH-LEARN-ASSESS-001",
        "AH-LEARN-LABS-001"
      ]
    },
    {
      "id": "AH-STW-110",
      "title": "Human Oversight and Accountability",
      "domain": "Human Stewardship",
      "outcome": null,
      "lessons": [
        {
          "id": "M1.1",
          "title": "Human responsibility in automated workflows",
          "exercise": "map accountability across a workflow",
          "status": "Specified"
        },
        {
          "id": "M1.2",
          "title": "Approval and intervention design",
          "exercise": "define intervention conditions",
          "status": "Specified"
        },
        {
          "id": "M1.3",
          "title": "Escalation and exception handling",
          "exercise": "prepare an escalation record",
          "status": "Specified"
        },
        {
          "id": "M1.4",
          "title": "Review quality and auditability",
          "exercise": "assess whether a review can be reconstructed",
          "status": "Specified"
        }
      ],
      "assessment": "oversight plan and scenario-based review.",
      "contentStatus": "Specified",
      "publicationStatus": "Not published",
      "sourceRefs": [
        "AH-LEARN-MASTER-001",
        "AH-LEARN-README-001",
        "AH-LEARN-CURRICULUM-001",
        "AH-LEARN-GOV-001",
        "AH-LEARN-ASSESS-001",
        "AH-LEARN-LABS-001"
      ]
    },
    {
      "id": "AH-STW-120",
      "title": "Responsible Knowledge Stewardship",
      "domain": "Human Stewardship",
      "outcome": null,
      "lessons": [
        {
          "id": "M1.1",
          "title": "Preservation and source integrity",
          "exercise": "identify risks in a proposed content migration",
          "status": "Specified"
        },
        {
          "id": "M1.2",
          "title": "Protected knowledge and change authority",
          "exercise": "classify actions by required authority",
          "status": "Specified"
        },
        {
          "id": "M1.3",
          "title": "Privacy and responsible data handling",
          "exercise": "minimize data in a fictional learner record",
          "status": "Specified"
        },
        {
          "id": "M1.4",
          "title": "Long-term continuity and maintenance",
          "exercise": "create a maintenance and retirement plan",
          "status": "Specified"
        }
      ],
      "assessment": "stewardship review covering preservation, privacy, authority, and maintenance.",
      "contentStatus": "Specified",
      "publicationStatus": "Not published",
      "sourceRefs": [
        "AH-LEARN-MASTER-001",
        "AH-LEARN-README-001",
        "AH-LEARN-CURRICULUM-001",
        "AH-LEARN-GOV-001",
        "AH-LEARN-ASSESS-001",
        "AH-LEARN-LABS-001"
      ]
    }
  ],
  "contentStates": {
    "Specified": "Course/lesson outline exists in source specification.",
    "Authored": "Full lesson package drafted; not necessarily reviewed.",
    "Reviewed": "Required subject and instructional reviews recorded.",
    "Approved": "Approved for publication by authorized approvers.",
    "Published": "Available in designated learning environment."
  },
  "sourceCatalog": [
    {
      "id": "AH-LEARN-MASTER-001",
      "path": "docs/learning/content-master-plan.md",
      "blobSha": "b124c7c55818b2a7e28899139c30745c3fcb343e",
      "branch": "ah-aios-learning-package",
      "url": "https://github.com/hydraporss/ah-aios-react-website/blob/ah-aios-learning-package/docs/learning/content-master-plan.md"
    },
    {
      "id": "AH-LEARN-README-001",
      "path": "docs/learning/README.md",
      "blobSha": "22682025430ba788d5ec5bb5544bc5a7431880b2",
      "branch": "ah-aios-learning-package",
      "url": "https://github.com/hydraporss/ah-aios-react-website/blob/ah-aios-learning-package/docs/learning/README.md"
    },
    {
      "id": "AH-LEARN-CURRICULUM-001",
      "path": "docs/learning/curriculum.md",
      "blobSha": "d58d9992e94bc2ed38a951500ce8813bb5c2259b",
      "branch": "ah-aios-learning-package",
      "url": "https://github.com/hydraporss/ah-aios-react-website/blob/ah-aios-learning-package/docs/learning/curriculum.md"
    },
    {
      "id": "AH-LEARN-PLATFORM-001",
      "path": "docs/learning/platform-definition.md",
      "blobSha": "3ef1df9e6e829aa8f5c07dfed678538c9b7231d3",
      "branch": "ah-aios-learning-package",
      "url": "https://github.com/hydraporss/ah-aios-react-website/blob/ah-aios-learning-package/docs/learning/platform-definition.md"
    },
    {
      "id": "AH-LEARN-GOV-001",
      "path": "docs/learning/content-governance.md",
      "blobSha": "e9a2d234068eacf9327e18ef986448316e73f28d",
      "branch": "ah-aios-learning-package",
      "url": "https://github.com/hydraporss/ah-aios-react-website/blob/ah-aios-learning-package/docs/learning/content-governance.md"
    },
    {
      "id": "AH-LEARN-CORE-PATH-001",
      "path": "docs/learning/paths/core.md",
      "blobSha": "67da1fd2f28958598fa4cbb8d150dd8d10f31c60",
      "branch": "ah-aios-learning-package",
      "url": "https://github.com/hydraporss/ah-aios-react-website/blob/ah-aios-learning-package/docs/learning/paths/core.md"
    },
    {
      "id": "AH-LEARN-HAR-PATH-001",
      "path": "docs/learning/paths/ai-harness.md",
      "blobSha": "062ec80cf587800c7058d01f208e26c41efc8326",
      "branch": "ah-aios-learning-package",
      "url": "https://github.com/hydraporss/ah-aios-react-website/blob/ah-aios-learning-package/docs/learning/paths/ai-harness.md"
    },
    {
      "id": "AH-LEARN-WF-PATH-001",
      "path": "docs/learning/paths/worldforge.md",
      "blobSha": "e5a074ba1458291f4ba74c1b39f0820c185b04aa",
      "branch": "ah-aios-learning-package",
      "url": "https://github.com/hydraporss/ah-aios-react-website/blob/ah-aios-learning-package/docs/learning/paths/worldforge.md"
    },
    {
      "id": "AH-LEARN-ASSESS-001",
      "path": "docs/learning/assessment-portfolio.md",
      "blobSha": "a52b5acbe827b21cde3c9d11d2cf7851163a1f85",
      "branch": "ah-aios-learning-package",
      "url": "https://github.com/hydraporss/ah-aios-react-website/blob/ah-aios-learning-package/docs/learning/assessment-portfolio.md"
    },
    {
      "id": "AH-LEARN-LABS-001",
      "path": "docs/learning/practice-labs.md",
      "blobSha": "8153c4d7831bacf3243bfc8eb3a51ff5e5d53b09",
      "branch": "ah-aios-learning-package",
      "url": "https://github.com/hydraporss/ah-aios-react-website/blob/ah-aios-learning-package/docs/learning/practice-labs.md"
    },
    {
      "id": "WF-README-001",
      "path": "README.md",
      "blobSha": "4a99342dfed4eab085162f22b464540e5cc99612",
      "branch": "ah-aios-learning-package",
      "url": "https://github.com/hydraporss/ah-aios-react-website/blob/ah-aios-learning-package/README.md"
    },
    {
      "id": "WF-CONSTITUTION-001",
      "path": "public/worldforge/verified-2026-10-28/assets/constitution.md",
      "blobSha": "cdfb5aa517c046e1351716a1e544cec11e1b0dae",
      "branch": "ah-aios-learning-package",
      "url": "https://github.com/hydraporss/ah-aios-react-website/blob/ah-aios-learning-package/public/worldforge/verified-2026-10-28/assets/constitution.md"
    },
    {
      "id": "WF-DOCTRINE-001",
      "path": "public/worldforge/verified-2026-10-28/doctrine.html",
      "blobSha": "327879bf96f021fc02ffb497551fef92586abe90",
      "branch": "ah-aios-learning-package",
      "url": "https://github.com/hydraporss/ah-aios-react-website/blob/ah-aios-learning-package/public/worldforge/verified-2026-10-28/doctrine.html"
    },
    {
      "id": "WF-GOVERNANCE-UI-001",
      "path": "public/worldforge/verified-2026-10-28/governance.html",
      "blobSha": "99f0709895add8045a723511e659492ee5218eb1",
      "branch": "ah-aios-learning-package",
      "url": "https://github.com/hydraporss/ah-aios-react-website/blob/ah-aios-learning-package/public/worldforge/verified-2026-10-28/governance.html"
    },
    {
      "id": "WF-GOVERNANCE-CODE-001",
      "path": "src/governance.js",
      "blobSha": "8d21a745155e2463fea802c9325c3a68b972562d",
      "branch": "ah-aios-learning-package",
      "url": "https://github.com/hydraporss/ah-aios-react-website/blob/ah-aios-learning-package/src/governance.js"
    }
  ],
  "projects": [
    {
      "id": "PROJECT-001",
      "title": "AH-AIOS System Orientation Portfolio",
      "level": "L1–L2",
      "courses": [
        "AH-CORE-100",
        "AH-CORE-110",
        "AH-STW-100"
      ],
      "tasks": "produce a domain map, architecture explanation, glossary, and evidence-status review",
      "evidence": "diagram, glossary, explanation, and source list",
      "acceptance": "boundaries are accurate, claims are sourced, and implementation status is not overstated.",
      "status": "Specified"
    },
    {
      "id": "PROJECT-002",
      "title": "Governed Tool Workflow",
      "level": "L2–L3",
      "courses": [
        "AH-HAR-120",
        "AH-HAR-140",
        "AH-HAR-150",
        "AH-HAR-160"
      ],
      "tasks": "specify a tool, model a workflow, define approval gates, and build a test matrix",
      "evidence": "tool contract, state model, permissions table, and test results",
      "acceptance": "inputs/outputs and failure paths are defined; authority and human approval are explicit.",
      "status": "Specified"
    },
    {
      "id": "PROJECT-003",
      "title": "Provenance-Aware Knowledge Workspace",
      "level": "L2–L3",
      "courses": [
        "AH-WF-100",
        "AH-WF-120",
        "AH-WF-130",
        "AH-WF-150"
      ],
      "tasks": "create a graph, register sources, formulate claims, attach evidence, and verify export",
      "evidence": "model, graph snapshot, provenance trail, validation and export report",
      "acceptance": "identifiers are stable, relationships validate, claims trace to sources, and export preserves records.",
      "status": "Specified"
    },
    {
      "id": "PROJECT-004",
      "title": "Governed World and Continuity Case",
      "level": "L3–L4",
      "courses": [
        "AH-WF-110",
        "AH-WF-140",
        "AH-WF-160",
        "AH-WF-170",
        "AH-STW-120"
      ],
      "tasks": "model an authorized fictional setting, record a contradiction, propose a change, assess continuity impact, and preserve review history",
      "evidence": "world model, conflict register, change dossier, and continuity report",
      "acceptance": "source and interpretation remain distinct; no unauthorized canon change occurs; prior versions remain traceable.",
      "status": "Specified"
    },
    {
      "id": "PROJECT-005",
      "title": "Learning Content Authoring Practicum",
      "level": "L3–L4",
      "courses": [
        "AH-CORE-140",
        "AH-CORE-150",
        "AH-STW-100",
        "AH-STW-120"
      ],
      "tasks": "author a lesson, prepare an exercise and rubric, obtain review, and record publication status",
      "evidence": "lesson package, review record, change history, and validation checklist",
      "acceptance": "outcomes are measurable, references traceable, authority clear, and content status accurate.",
      "status": "Specified"
    }
  ],
  "assessmentFramework": {
    "sourceId": "AH-LEARN-MASTER-001 §7",
    "scale": [
      {
        "score": 1,
        "label": "Insufficient"
      },
      {
        "score": 2,
        "label": "Developing"
      },
      {
        "score": 3,
        "label": "Competent"
      },
      {
        "score": 4,
        "label": "Strong"
      }
    ],
    "dimensions": [
      [
        "Accuracy",
        "Technical and conceptual correctness"
      ],
      [
        "Traceability",
        "Sources, inputs, decisions, and versions are identifiable"
      ],
      [
        "Completeness",
        "Required elements, edge cases, and limitations are addressed"
      ],
      [
        "Reasoning",
        "Assumptions, alternatives, and uncertainty are explicit"
      ],
      [
        "Verification",
        "Outcomes are tested against stated criteria"
      ],
      [
        "Stewardship",
        "Authority, protected assets, privacy, and change discipline are respected"
      ],
      [
        "Communication",
        "Results and limitations are clearly explained"
      ]
    ],
    "rules": [
      "Each score requires evidence and reviewer comments.",
      "A total score must not conceal a critical failure.",
      "Each course must publish mandatory criteria and minimum thresholds before assessment.",
      "This plan does not establish credential thresholds."
    ],
    "remediation": [
      "Record the unmet criterion and evidence.",
      "Provide specific feedback and a relevant resource.",
      "Define the resubmission scope.",
      "Preserve the original submission and assessment history.",
      "Reassess against the published rubric unless a formally versioned rubric change applies."
    ]
  },
  "lessonStandard": [
    "Stable lesson ID, title, course, module, version, and status.",
    "Purpose and capability developed.",
    "Observable, assessable learning outcomes.",
    "Prerequisites.",
    "Authoritative source base and versions.",
    "Core explanation with definitions, principles, architecture, and limitations.",
    "Complete worked example with reasoning and expected result.",
    "Guided practice.",
    "Independent exercise with inputs, instructions, and deliverables.",
    "Knowledge check with answer rationale.",
    "Assessment evidence.",
    "Feedback guidance, common errors, and remediation.",
    "Safety, privacy, and authority boundary.",
    "References and change history, including author, reviewer, and revisions."
  ],
  "contentLifecycle": [
    "Draft",
    "In Review",
    "Approved for Publication",
    "Published",
    "Retired"
  ],
  "courseDefinitionOfDone": [
    "All planned lessons authored.",
    "Every lesson has outcomes, sources, explanations, examples, exercises, and knowledge checks.",
    "Practical assessment and rubric complete.",
    "Instructor and reviewer materials available.",
    "Required reviews recorded.",
    "Pilot feedback addressed or retained as unresolved.",
    "Version and publication status accurate."
  ]
};
