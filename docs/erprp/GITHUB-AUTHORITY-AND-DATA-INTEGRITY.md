# GitHub Authority and Data Integrity Policy

**Document ID:** ERPRP-POL-001  
**Version:** 0.1.0  
**Status:** Proposed — pending formal adoption

## 1. Authority boundary

GitHub is the authoritative system of record for version-controlled AH-AIOS source code, architecture, specifications, schemas, governance definitions, approved policy, and release evidence.

A connected service may be an operational system of record for a narrowly defined runtime domain (for example, active learner progress or transactional state). Such an exception must be explicitly documented with its owner, data contract, provenance, synchronization direction, backup, restore, retention, and reconciliation procedure. It must not silently supersede GitHub-governed definitions or policy.

## 2. Artifact classes

| Artifact | Authoritative location | Required controls |
|---|---|---|
| Source code and build configuration | GitHub repository | Reviewed PR, commit history, reproducible checks |
| Architecture and specifications | GitHub repository | Version, status, owner, references, review history |
| Schemas and data contracts | GitHub repository | Schema validation, compatibility and migration policy |
| Canon/governance definitions | GitHub repository | Explicit status, provenance, approval and supersession |
| Static reference datasets | GitHub repository when suitable | Source lineage, integrity hash, licensing/handling review |
| Runtime/transactional data | Approved operational store | Named owner, schema contract, access control, audit, backup/restore |
| Generated reports and views | Derived artifact | Source commit/data version, generation method, timestamp |
| Release/test evidence | GitHub Actions and versioned records | Run URL, commit SHA, scope, result, retention |

## 3. Required provenance

Material data and claims should record, where applicable:

- Stable identifier and title.
- Source repository, path, URL or external source identifier.
- Source commit/blob SHA or immutable source version.
- Classification and governance status.
- Importer/generator and version.
- Created/updated timestamp and responsible actor or process.
- Validation result and validation-rule version.
- Approval or review record where required.

Missing provenance is represented as missing or unknown; it is never fabricated.

## 4. Data integrity lifecycle

1. **Acquire:** identify source and permitted use; preserve the original input.
2. **Validate:** check schema, required fields, IDs, uniqueness, types, references, classification, and domain constraints.
3. **Reconcile:** detect duplicates, missing records, stale versions, and conflicts against the authoritative source.
4. **Approve:** require the designated reviewer for governed or canon-sensitive data.
5. **Persist:** write only to the designated authoritative or operational store.
6. **Verify:** read back and compare expected identifiers, counts, hashes, and relationships.
7. **Recover:** maintain tested backup, restore, and rollback procedures appropriate to the data class.

Imports must be atomic where practical: invalid input must not partially replace valid state. Destructive replacement requires a preview, explicit authorization, and recoverable prior state.

## 5. Synchronization rules

- Declare the direction for each integration: one-way export, one-way import, or controlled bidirectional synchronization.
- Use stable IDs, source versions, timestamps, and conflict rules.
- Make repeatable imports idempotent where feasible.
- Record synchronization results and failures.
- Never resolve conflicts by silently choosing the newest timestamp alone when authority is ambiguous.
- A downstream copy must retain its source reference and last verified source version.
- Reconciliation must report missing, extra, changed, and conflicting records.

## 6. GitHub change controls

- Work on a feature branch.
- Submit a pull request to `main`.
- Run automated validation and tests.
- Review the diff and evidence before merge.
- Protect release artifacts with commit/version references.
- Do not store secrets, credentials, personal data, or uncontrolled runtime exports in the repository.

Branch protection, required reviews, signed commits, secret scanning, dependency alerts, and repository-level security settings are G0/G3 verification items. Their existence is not assumed by this policy.

## 7. Limits

A successful JSON/schema check establishes structural validity, not truth, completeness, source authenticity, legal permission, or canon approval. A backup job is not a verified backup until restoration is tested. A deployment is not a release approval.
