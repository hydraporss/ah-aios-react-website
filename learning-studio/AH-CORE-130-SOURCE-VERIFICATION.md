# AH-CORE-130 — Source Verification

**Task ID:** AH-CORE-130-SV-001  
**Prepared:** 30 October 2026  
**Course:** AH-CORE-130 — Security, Policy, and Safe Operation  
**Task status:** <b>Source set verified and mapped; independent subject-matter review pending</b>  
**Lesson status:** All four existing lessons remain **Authored draft / Not reviewed**  
**Publication status:** Not published  
**Scope:** Existing AH-CORE-130 M1.1–M1.4 only. No new course, no catalogue edits, no AH-CORE-140 work.

## 1. Purpose and boundary

This record verifies official NIST and OWASP source identities, dates/versions, relevant sections, lesson-claim support, and limitations. It also cross-checks the internal repository sources already cited by the four lessons.

External publications establish security concepts and recommended practices. They do **not** prove that AH-AIOS has implemented those controls. Claims about project behavior must be supported by the project code, tests, and acceptance records. This is not a compliance attestation, penetration-test report, or approval to publish.

## 2. Primary-source register

### NIST publications

| ID | Official title / issuer | Version and date | Official source | Relevant material and lesson use |
|---|---|---|---|---|
| NIST-800-30-R1 | *Guide for Conducting Risk Assessments* — NIST Joint Task Force Transformation Initiative | SP 800-30 Rev. 1; final 17 Sep 2012 | [NIST CSRC record](https://csrc.nist.gov/pubs/sp/800/30/r1/final) · [DOI](https://doi.org/10.6028/NIST.SP.800-30r1) | Risk-assessment process; threat sources/events; vulnerabilities and predisposing conditions; likelihood, impact, and risk determination. Supports M1.1's bounded asset/threat/risk inventory and explicit uncertainty. It does not supply an AH-AIOS threat model or project-specific risk scores. **Type:** NIST guidance, not a project-specific standard or test. |
| NIST-AI-100-2-E2025 | *Adversarial Machine Learning: A Taxonomy and Terminology of Attacks and Mitigations* — NIST Trustworthy and Responsible AI | AI 100-2 E2025; final March 2025; corrected PDF uploaded 1 Apr 2025; NIST records a potential errata note dated 3 Jun 2025 | [NIST CSRC record](https://csrc.nist.gov/pubs/ai/100/2/e2025/final) · [DOI](https://doi.org/10.6028/NIST.AI.100-2e2025) | Taxonomy of ML methods, lifecycle stages, attacker goals/objectives/capabilities/knowledge, attack and mitigation terminology, glossary. Supports M1.1/M1.3 vocabulary and adversarial-ML framing. It is not a prompt-injection implementation assessment or a control baseline. **Type:** NIST taxonomy/terminology report. |
| NIST-800-53-R5 | *Security and Privacy Controls for Information Systems and Organizations* — NIST Joint Task Force | SP 800-53 Rev. 5; final 23 Sep 2020; NIST publication record notes an errata update on 10 Dec 2020 | [NIST CSRC record](https://csrc.nist.gov/pubs/sp/800/53/r5/final) · [DOI](https://doi.org/10.6028/NIST.SP.800-53r5) | AC-3 Access Enforcement; AC-6 Least Privilege; AU-6 Audit Record Review, Analysis, and Reporting; AU-9 Protection of Audit Information; AU-11 Audit Record Retention; IR-4 Incident Handling. Supports M1.2/M1.4 control vocabulary and policy-to-control mapping. Controls must be selected, tailored, implemented, and assessed in context; citing them does not establish AH-AIOS conformance. **Type:** control catalogue; applicability depends on adoption and relevant policy/regulation. |
| NIST-800-61-R3 | *Incident Response Recommendations and Considerations for Cybersecurity Risk Management: A CSF 2.0 Community Profile* — NIST | SP 800-61 Rev. 3; final 3 Apr 2025; supersedes Rev. 2 | [NIST CSRC record](https://csrc.nist.gov/pubs/sp/800/61/r3/final) · [DOI](https://doi.org/10.6028/NIST.SP.800-61r3) · [NIST incident-response overview](https://csrc.nist.gov/projects/incident-response) | CSF 2.0 preparation through Govern, Identify, Protect; incident lifecycle Detect, Respond, Recover; continuous improvement. Supports M1.4 lifecycle concepts and the separation of preparation from response. It does not define an AH-AIOS incident team, severity matrix, notification deadlines, on-call rota, or escalation authority. **Type:** NIST incident-response guidance. |

### OWASP primary project guidance

| ID | Official title / issuer | Version and date | Official source | Relevant material and lesson use |
|---|---|---|---|---|
| OWASP-LLM-TOP10-2026 | *OWASP Top 10 for LLM Applications 2026* — OWASP GenAI Security Project | Version 2026. Official resource page dated 3 Aug 2026. **Metadata caveat:** the downloaded PDF title page still says “[Publication date to be set]” and its revision history says “[2026 release date]”; the landing-page date is therefore the verified publication-page date, not a finalized PDF imprint date. | [Official OWASP resource page](https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/) · [Initiative page](https://genai.owasp.org/initiative/owasp-top-10-for-llm-and-genai/) | LLM01:2026 Prompt Injection (PDF pp. 10–17); LLM03:2026 Excessive Agency; Appendix B LLM Application Architecture and Threat Modeling. Supports M1.1/M1.3 risk taxonomy, direct/indirect prompt injection, delivery surfaces, propagation, multimodal input, and architectural mitigation concepts. The guide itself says prompt injection cannot be reliably prevented by a single interceptive control; it recommends defense-in-depth and limiting consequences. It does not prove AH-AIOS has implemented those controls. **Type:** community-developed security risk guide, not a statutory standard. |
| OWASP-AUTHORIZATION-CS | *Authorization Cheat Sheet* — OWASP Cheat Sheet Series | Maintained guidance; no fixed edition claimed; accessed 30 Oct 2026 | [Official OWASP URL](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) | “Deny by Default”; “Validate the Permissions on Every Request”; least privilege and permission review. Supports M1.2's distinction between UI visibility and real authorization. It does not prove every AH-AIOS endpoint is protected. **Type:** implementation guidance. |
| OWASP-LLM-PIP-CS | *LLM Prompt Injection Prevention* — OWASP Cheat Sheet Series | Maintained guidance; no fixed edition claimed; accessed 30 Oct 2026 | [Official OWASP URL](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html) | Common attack types; primary defenses; structured prompts; human-in-the-loop; least privilege; secure implementation pipeline; testing. Supports M1.3 recommendations to isolate untrusted content, enforce permissions in trusted code at tool boundaries, validate outputs, approve high-risk actions, and test direct/indirect injection. The guide warns that labels or prompt wording alone are not enforcement boundaries. It does not prove these controls exist in AH-AIOS. **Type:** implementation guidance. |
| OWASP-LOGGING-CS | *Logging Cheat Sheet* — OWASP Cheat Sheet Series | Maintained guidance; no fixed edition claimed; accessed 30 Oct 2026 | [Official OWASP URL](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html) | Event data sources; events to log; event attributes; data to exclude; verification; protection; monitoring; disposal. Supports M1.4 evidence-aware event records, logging of authentication/authorization failures, testing, integrity protection, monitoring, and retention planning. It does not make browser-local records immutable. **Type:** operational implementation guidance. |

## 3. Lesson-by-lesson claim verification

### M1.1 — Assets, threats, and attack surfaces

**Supported**
- A bounded risk inventory can identify assets, threat sources/events, vulnerabilities and predisposing conditions, likelihood, impact, and uncertainty (NIST SP 800-30 Rev. 1).
- Adversarial-ML terminology can describe attacker goals, capabilities, lifecycle stages, and attack categories (NIST AI 100-2 E2025).
- OWASP's 2026 LLM Top 10 includes an architecture/threat-modeling appendix and describes prompt-injection delivery surfaces and propagation (LLM01:2026 and Appendix B).
- Project-specific assets and operations can be described from the internal source files listed below.

**Not established**
- No complete formal AH-AIOS threat model, complete adversary catalogue, independently validated likelihood/impact scores, or penetration-test report is evidenced by the cited project sources.
- STRIDE or another threat taxonomy may be used as a named analysis method, but must not be represented as an existing project artifact.

### M1.2 — Policy rules and enforcement points

**Supported**
- Policy statements should be traced to an enforcement point and an allow/deny test.
- NIST AC-3/AC-6 and OWASP Authorization guidance support access enforcement, least privilege, deny-by-default, and checking authorization on every request.
- Internal code and tests support only the specific role transitions and authorization paths they exercise.

**Not established**
- The current sources do not prove that every route, resource, deployment configuration, or permission combination is protected.
- A complete action-level role permission matrix and full membership lifecycle remain evidence gaps.
- Do not claim NIST compliance or complete authorization coverage.

### M1.3 — Untrusted input and instruction conflicts

**Supported**
- OWASP LLM01:2026 directly supports prompt injection as an input-boundary risk, including direct and indirect content, retrieved documents, tool output, memory, and multimodal inputs (PDF pp. 10–17).
- OWASP's prevention guidance supports defense-in-depth: least privilege, deterministic authorization at execution boundaries, human approval for high-risk actions, output validation, and adversarial testing.
- NIST AI 100-2 E2025 provides broader adversarial-ML taxonomy and terminology.
- Internal governance sources support provenance and review of submitted claims and source excerpts.

**Not established**
- Provenance and human review alone are not prompt-injection defenses.
- No repository evidence establishes an implemented trusted/untrusted instruction hierarchy, agent tool-boundary authorization, sandboxing, model-output validation, or a prompt-injection regression suite.
- Do not say prompt injection can be eliminated by RAG, fine-tuning, prompt wording, or a single filter.

**2026 source verification correction:** The existing lesson's OWASP 2026 reference is valid as a current official OWASP project resource. Its resource page is dated 3 Aug 2026. However, the downloaded PDF's publication-date fields are still placeholders. Preserve that metadata caveat rather than claiming the PDF imprint is finalized. The 2025 edition is not a substitute for the verified 2026 resource.

### M1.4 — Incident recognition and escalation

**Supported**
- NIST SP 800-61 Rev. 3 supports integrating incident response with risk management and the Detect/Respond/Recover lifecycle.
- OWASP Logging guidance supports recording relevant event context, logging authorization failures, protecting logs, verifying logging, and monitoring/retention planning.
- The internal end-to-end test supports the narrow claim that the tested anonymous and insufficiently privileged approval attempts were rejected.

**Not established**
- A rejected test request is not proof that a real security incident occurred.
- The repository does not establish a complete operational incident-response procedure, incident commander/team, severity matrix, notification deadline, on-call rota, or approved escalation chain.
- Browser-local audit events are editable/deletable and must not be described as tamper-proof evidence.

## 4. Internal project source lineage cross-check

The following files were fetched from branch `ah-aios-learning-package`. Their current Git blob hashes match the hashes already recorded in the AH-CORE-130 lesson source base:

| Internal source | Verified Git blob SHA | Evidence supported |
|---|---|---|
| `docs/learning/content-governance.md` | `e9a2d234068eacf9327e18ef986448316e73f28d` | Source attribution, content-status separation, revision history, authorization, and data-handling policy statements. |
| `src/governance.js` | `8d21a745155e2463fea802c9325c3a68b972562d` | Application-layer roles/capabilities and legal state transitions; explicit note that UI visibility is not an authorization check. |
| `docs/v0.4-sprint-1-and-acceptance.md` | `8526cccd8dda54f88b574c619eb371e89f23c89c` | Scope and limitations; excludes authenticated identities, server persistence, and tamper-resistant audit storage; states local audit events are editable/deletable. |
| `tests/e2e-governance.mjs` | `e0eb9491ab2b0e23dd9aa03f835c6e0beac3bf50` | Tested CSRF-token use, anonymous approval 401, creator/reviewer approval 403, authorized approval, audit verification, and archive export. |
| `tests/governance.test.js` | `edb13f5c9405155dea176f10f2cd55299d85b894` | Unit-level governance checks, including denied creator approval and transition constraints. |

This is a source-lineage check against the referenced branch revision. It is not a new security test or proof that every route is protected.

## 5. Claims that must not be promoted to established fact

- AH-AIOS has a complete formal threat model.
- AH-AIOS is NIST SP 800-53 compliant.
- All application/API routes enforce authorization.
- AH-AIOS has implemented prompt-injection prevention.
- Prompt injection is prevented by provenance, RAG, or prompt wording alone.
- Browser-local audit history is immutable, tamper-proof, or independently trustworthy.
- AH-AIOS has a complete production incident-response capability.
- A test-denied request proves that a security incident occurred.

Each claim requires new project-specific evidence, implementation review, and tests before it can be asserted.

## 6. Acceptance checklist

- [x] Four existing AH-CORE-130 lesson IDs/titles identified; no lesson added or removed.
- [x] Official NIST and OWASP primary sources identified.
- [x] Titles, issuers, versions/dates, official URLs, relevant material, supported claims, and limitations recorded.
- [x] Control catalogue, guidance, and taxonomy classifications distinguished.
- [x] Five internal project source files fetched and blob hashes matched to the lesson lineage.
- [x] Lesson-specific support and unsupported claims documented.
- [x] OWASP 2026 official resource verified; PDF publication-date placeholder explicitly recorded.
- [x] AH-CORE-140 and course catalogue excluded from scope.
- [ ] Independent security subject-matter review and sign-off.
- [ ] Lesson status changes through a separately authorized content-review workflow only.

## 7. Final disposition

**Source preparation:** complete for this bounded task.  
**Independent subject-matter review:** pending.  
**AH-CORE-130 lessons:** remain **Authored draft / Not reviewed**.  
**Course publication:** not approved.  
**Canon status:** unchanged; this task does not canonize course interpretations or security claims.

The companion `AH-CORE-130-SOURCE-REGISTER.json` is the machine-readable source record. This Markdown file is the human review brief.
