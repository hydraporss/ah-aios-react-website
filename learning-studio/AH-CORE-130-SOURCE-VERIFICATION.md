# AH-CORE-130 — External Source Verification

**Record date:** 30 October 2026  
**Course:** AH-CORE-130 — Security, Policy, and Safe Operation  
**Record status:** External references verified; lesson drafts remain unreviewed  
**Repository branch:** `learning-studio-0.2.0`

## Purpose and verification boundary

This record verifies the identity, publication status, canonical location, and teaching scope of authoritative external references for AH-CORE-130. It does not certify the Learning Studio, WorldForge, or AH-AIOS as secure, compliant, or production-ready. External standards and taxonomies are teaching references; repository code and tests remain the evidence for claims about implemented project behavior.

## Verified authoritative references

| ID | Publication | Verified status | Canonical source | Appropriate use |
|---|---|---|---|---|
| NIST-SP-800-61-R3 | NIST SP 800-61 Rev. 3, *Incident Response Recommendations and Considerations for Cybersecurity Risk Management: A CSF 2.0 Community Profile* | Final, published 3 April 2025; supersedes Rev. 2 | https://csrc.nist.gov/pubs/sp/800/61/r3/final | General incident-response preparation, detection, response, and recovery concepts for M1.4 |
| NIST-AI-100-2-E2025 | NIST AI 100-2 E2025, *Adversarial Machine Learning: A Taxonomy and Terminology of Attacks and Mitigations* | Final, published 24 March 2025; NIST page records a potential errata/update note | https://csrc.nist.gov/pubs/ai/100/2/e2025/final | Adversarial ML terminology, attacker goals/capabilities, lifecycle stages, and attack taxonomy for M1.1 and M1.3 |
| OWASP-GENAI-LLM-TOP10-2026 | OWASP GenAI / LLM Top 10 2026 | Current release; official source repository states publication date 4 August 2026 | https://github.com/GenAI-Security-Project/GenAI-LLM-Top10 | LLM application risk awareness, including prompt injection, sensitive information disclosure, excessive agency, supply chain, poisoning, and output-handling risks for M1.3 |

### Lesson mapping and limits

- **M1.1 — Assets, threats, and attack surfaces:** NIST AI 100-2 E2025 supplies an external taxonomy and vocabulary for adversarial ML risks. It is not a project threat model, penetration test, severity rating, or proof that a listed attack is present in WorldForge.
- **M1.2 — Policy rules and enforcement points:** the lesson remains grounded in repository governance policy, code, and tests. The external references above do not prove project-specific policy enforcement; no external control mapping is asserted here.
- **M1.3 — Untrusted input and instruction conflicts:** OWASP 2026 is the current LLM application awareness reference for prompt injection and related risks. NIST AI 100-2 E2025 adds broader adversarial ML taxonomy. Neither reference proves an implemented prompt-injection defense in this repository.
- **M1.4 — Incident recognition and escalation:** NIST SP 800-61 Rev. 3 supplies general incident-response guidance. It does not create an AH-AIOS incident-response team, severity matrix, notification timeline, on-call rota, or approved operational escalation procedure.

## Repository evidence remains separate

The existing lesson claims about WorldForge behavior continue to rely on the pinned repository sources recorded in `curriculum-data.js`: the content-governance policy, governance state machine, unit tests, server end-to-end tests, and v0.4 sprint/acceptance record. These sources support only the behaviors and limitations actually described or exercised there.

The following gaps remain explicit:
- No complete formal project threat model or penetration-test report is evidenced.
- No implemented AI prompt-injection or instruction-conflict defense is established by the cited repository sources.
- No complete operational incident-response policy is established.
- Browser-local audit records are editable/deletable and are not tamper-proof evidence.
- A successful test demonstrates only the tested path and context; it does not prove every endpoint or deployment configuration is secure.

## Verification method

1. Opened the official NIST CSRC publication pages and checked document identifiers, publication dates, final status, and scope.
2. Opened the official OWASP GenAI Security Project source repository and checked the current release date, canonical source location, and 2026 risk categories.
3. Mapped each external source only to lesson topics it actually supports.
4. Kept external teaching references distinct from repository implementation evidence.
5. Added the verified source records and lesson mappings to `curriculum-data.js`, with regression checks for their identifiers, URLs, dates, and lesson links.

## Content status

All four AH-CORE-130 lessons remain **Authored draft / Not reviewed**. External source verification does not approve, publish, or canonize lesson content. Human subject-matter and instructional review remain required.
