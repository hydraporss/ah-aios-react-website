<!-- Exported from Notion page 40966662-b29d-811b-bfa7-e55e1346a6d6; source path docs/learning/content-governance.md; exported 2026-10-30. Content is preserved as retrieved Notion page text. -->

**Source repository:** [hydraporss/ah-aios-react-website](https://github.com/hydraporss/ah-aios-react-website)

**Source branch:** `ah-aios-learning-package`

**Source path:** `docs/learning/content-governance.md`

**Git blob SHA:** `e9a2d234068eacf9327e18ef986448316e73f28d`

**Export method:** Full UTF-8 source text fetched from the exact branch path and copied into this Notion page. Source content follows unchanged.

---

# Learning Content Governance and Data Model

## Governance principles

Learning content must preserve source attribution, distinguish content status, and maintain revision history. Changes to protected canon require explicit authorization and version history. A learning explanation must not silently replace its source or redefine canon.

Use these labels where applicable:

- **CANON** — authorized canonical material.
- **INTERPRETATION** — explanation or analysis derived from sources.
- **SUGGESTION** — proposed content or possible future direction.
- **PROCESS** — operational instructions or workflow definition.

Also distinguish implementation evidence states such as specified, implemented, tested, deployed, and production-assured. These are not interchangeable.

## Content lifecycle

Draft → Review → Approved for Publication → Published → Retired.

A published item may be revised through a recorded change. Retiring content should preserve its historical identity and point to a replacement when one exists.

## Suggested content record

| Field | Purpose |
| --- | --- |
| content\_id | Stable identifier |
| title | Learner-facing title |
| content\_type | Course, module, lesson, lab, assessment, reference |
| learning\_domain | Core, AI Harness, WorldForge, Stewardship |
| competency\_level | L0–L4 |
| learning\_objectives | Observable outcomes |
| prerequisites | Required prior learning |
| body / resource\_refs | Content and linked materials |
| source\_refs | Originating sources |
| content\_status | Draft, Review, Approved, Published, Retired |
| canon\_label | CANON, INTERPRETATION, SUGGESTION, PROCESS, where applicable |
| version | Content version |
| author / reviewer | Responsible contributors |
| change\_history | Recorded revisions and approvals |
| verification | Review and validation evidence |

## Suggested learning records

- Learner profile and role assignments
- Enrollment and learning-path progress
- Lesson completion
- Lab submission and artifact references
- Assessment attempt and rubric results
- Reviewer feedback
- Portfolio item
- Credential record, if authorized
- Content review and publication history

## Access and privacy

Collect only data needed for learning operations. Restrict access according to role and purpose. Do not place secrets, credentials, or unnecessary sensitive personal information in learning records. Define retention, export, correction, and deletion rules before production use.

## Authority boundary

Content publication authority, canon authority, assessment authority, and credential-issuing authority are distinct responsibilities unless explicitly combined by policy. A content editor must not acquire canon or credential authority merely by editing a learning page.
