# WorldForge image concepts → Evidence register / governance map

**Package:** WORLDFORGE-EVIDENCE-MAP-001
**Purpose:** Concrete audit — map the poster's concepts to the actual AH-AIOS evidence registers, governance records, and WOF specs. Grounds the branding in what can be verified, and exposes the gaps.
**Status:** Adapted for audit; reads alongside `CII_SOURCE_EVIDENCE_REGISTER.csv`, `CII_EXTERNAL_SOURCE_EVIDENCE_REGISTER.csv`, `WOF_CORE_SPEC_v0.1.md`, `WOF_GENERATIVE_PROCEDURE_REGISTER_v0.1.csv`, `WOF_GENERATOR_ARCHITECTURE_v0.1.md`, `registry/canon_index.json`, `ah_webapp/wof_integration.py`, `docs/ONTO-001`.
**Status legend:** REQUIRED = something must exist/hold; CURRENT = what actually exists; GAP = missing or not yet proven.

---

## Status legend

| Status | Meaning |
|---|---|
| **PROPOSED** | Drafted as a design requirement, not implemented or validated |
| **IMPLEMENTATION_UNVERIFIED** | Documented, but no test/e2e evidence |
| **NOT FOUND** | Desired source/artifact not recovered |
| **EXTERNAL_NOT_FOUND** | Searched, no CII spec found |
| **ESTABLISHED_CANON** | Established project canon (e.g., L115-L150); not CII |
| **VERIFIED_SOURCE** | Verified source, documented for contrast only |

---

## Mapping table

| Image concept | What it claims (from the poster) | Where it maps in AH-AIOS records | Verifiable from that record? | Current status | Audit gap / open question |
|---|---|---|---|---|---|
| **Universe layer** (planets, cities, starships) | Aspiration: viewer sees a world worth preserving, not software first | `docs/ONTO-001` (Civ-OS conceptual layers); `docs/AFTER-HUMANITY-IPF-001` (interpretive framework); `WOF_CORE_SPEC §3` world model | Partially | Conceptual (ONTO-001, IPF-001); WOF §3 is *proposed* design | No recovered authority layer defining what a "universe" IS as a first-class record |
| **Hermes = brain / identity layer** | "Not a chatbot. Not an assistant. An operating intelligence." | `ah_webapp/wof_integration.py` (governance review decisions on generated entities); `docs/GOVERNANCE.md` (recovery sequence, no ChatGPT/Imagegen claim) | Partially | Governance hooks exist; Hermes role documented elsewhere | Hermes as an "operating intelligence" is a brand claim, not yet encoded as a named capability in the registry |
| **World Atlas = Space** | Where? Geography? Locations? Timelines? | `WOF_GENERATIVE_PROCEDURE_REGISTER` Proc-05 (Civilization & Faction Design); `WOF_CORE_SPEC §3.B` entities | Plausible | PROC-05 is RECOVERED SOURCE, but **IMPLEMENTATION_UNVERIFIED** | No recovered original WOF spec/test to prove Atlas = spatial registry |
| **Identity Archive = People / citizenship** | Who? Characters? Species? Organizations? | `WOF_CORE_SPEC §3.A` world identity & identity constraints; `registry/canon_index.json` (CAN-ON-001 visual artifact) | Partially | World identity proposed; registry holds one visual-artifact canon record | No recovered original WOF schema proving ID-Archive = entity citizenship role |
| **Relationship Explorer = Connections** | Who affects whom? Alliances? Bloodlines? Networks? | `WOF_CORE_SPEC §3.C` relationships, "consequences not attributable to either participant independently"; Proc-03 continuity/contradiction check | Plausible | PROC-03 RECOVERED SOURCE, IMPLEMENTATION_UNVERIFIED | No verified provenance proving Relation-Explorer = social-network model |
| **Source & Evidence Registry = Truth** | Where did this claim come from? Verified? Interpretation? | `CII_SOURCE_EVIDENCE_REGISTER.csv` (22 records — **all** "No CII implementation" / "NO CII record"); `CII_EXTERNAL_SOURCE_EVIDENCE_REGISTER.csv` (13 records — **all** EXTERNAL_NOT_FOUND); `WOF_CORE_SPEC §7` (world fact / observation / inference / hypothesis / verified claim / canonized claim) | YES — but the register proves the *absence* | Register is fully populated; it documents that no CII source exists | The register proves NO CII exists; it does NOT prove WorldForge's registry is equivalent to CII |
| **Canon Governance = Authority** | What is official? Who decides? | `WOF_GENERATIVE_PROCEDURE_REGISTER` Proc-01 (Canon Management), Proc-02 (Revision & Supersession); `ah_webapp/wof_integration.py` (review decisions: approve/reject with authorization reference); `registry` (canon_index, claim_ledger, decision_ledger) | YES — governance hooks exist | Governance hooks are code; procedure register is RECOVERED SOURCE with IMPLEMENTATION_UNVERIFIED status | No working end-to-end test proving the governance flow; no recovered original WOF procedure set |
| **Canon Protection** | Protect identity, keep things from breaking | `WOF_CORE_SPEC §8` evolution & identity preservation (authorization, prior-state recovery) | Plausible | Proposed §8; not implemented | No executed test of a rejected/approved transition |
| **Source Traceability** | Protect truth | `WOF_CORE_SPEC §2` (results must have provenance), §6 (deterministic, versioned), §9 (provenance failure) | Plausible | PROPOSED, not implemented | Provenance recorder exists as an MVP component (PROPOSED), not verified in a run |
| **Intelligent Assistance** | Protect growth | `WOF_GENERATOR_ARCHITECTURE §C` Procedure Executor (only registered operations, no silent invocation of undefined ones) | Partially | PROPOSED design; no implementation | Executor is not yet built; "intelligent assistance" remains a brand term |
| **Three pillars (Identity / Truth / Evolution)** | The thesis condensed | `WOF_CORE_SPEC §3.A/§7/§8`; `ah_webapp/wof_integration.py` review decisions | YES — coherent with WOF | Coherent mapping | Not independently verified as a principle set; WOF claims it as *proposed* design |
| **Era progression (PH1 → WOF → AH-AIOS)** | Forward narrative | `docs/ONTO-001` (layers), `WOF_CORE_SPEC §11` (unresolved originals) | NO — aspirational only | Not grounded in any recovered artifact | The 3-phase story is brand framing, **not** a chronology of what has been recovered |

---

## Traceability check

For each "app" the poster lists, the strongest evidence chain is:

- **Atlas → Space** → PROC-05 (Civilization & Faction Design) is RECOVERED SOURCE, but IMPLEMENTATION_UNVERIFIED. No original WOF spec/test to confirm the app's exact role.
- **Archive → People** → `WOF_CORE_SPEC §3.A` (identity constraints) is PROPOSED. `registry/canon_index.json` holds one visual-artifact record (CAN-ON-001), not a recovered CII schema.
- **Explorer → Connections** → `WOF_CORE_SPEC §3.C` (relationships with emergent consequences) is PROPOSED. PROC-03 continuity check is RECOVERED/UNVERIFIED.
- **Registry → Truth** → `CII_SOURCE_EVIDENCE_REGISTER.csv` + `CII_EXTERNAL_SOURCE_EVIDENCE_REGISTER.csv` are fully populated; they prove **absence of any CII source**. WOF §7 (fact/observation/inference/hypothesis/verified/canon) gives the *concept*, not the recovered spec.
- **Governance → Authority** → Proc-01/Proc-02 (RECOVERED SOURCE) + `wof_integration.py` review hooks + registry ledgers are the closest to a *working* governance trail; still IMPLEMENTATION_UNVERIFIED, no e2e test yet.

---

## Bottom line for the audit

1. **The image's concepts map cleanly onto the WOF proposal** — the poster really does anticipate WOF's identity/truth/evolution separation.
2. **The mapping is to *proposed* WOF design, not to recovered CII.** Every "verifiable" cell above is anchored in a proposed spec or a populated absence register, not in a recovered original.
3. **The concrete gaps** are: (a) recovered WOF source spec (unresolved), (b) executed WOF e2e tests (unverified), (c) a named "WorldForge" capability register linking the poster's apps to the registry, and (d) proof that the governance flow is live end-to-end (the `wof_integration.py` hooks exist but have no passing E2E record in the reports directory).
4. **Do not reuse this mapping as CII evidence.** It is a roadmap-to-proposal map, correct as far as it goes, but it describes what the system *would* assert, not what it *has* asserted.
