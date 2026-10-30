# ERPRP — Repository Alignment

**Program:** AH-AIOS Ecosystem Realization & Production Readiness Program (ERPRP)  
**Repository:** Learning Studio / AH-AIOS ecosystem repository  
**Baseline branch:** `main`  
**Implementation branch:** `erprp/repository-alignment-g0`  
**Status:** Alignment package under review; G0 baseline in progress. This package does not declare any application production-ready or any gate passed.

## Purpose

This directory establishes the program-level governance layer in GitHub. It connects the ERPRP charter, source-of-truth policy, system boundaries, readiness gates, and machine-readable status register.

## Controlled documents

- [Program charter](./ERPRP-CHARTER.md)
- [GitHub authority and data integrity policy](./GITHUB-AUTHORITY-AND-DATA-INTEGRITY.md)
- [Ecosystem system registry](./SYSTEM-REGISTRY.md)
- [Readiness gates and evidence rules](./READINESS-GATES.md)
- [Machine-readable program register](./erprp-register.json)

## Authority and status

GitHub is the authoritative system of record for version-controlled AH-AIOS source code, architecture, specifications, schemas, governance definitions, and approved evidence records. Operational systems may hold runtime data, but must have explicit ownership, provenance, synchronization, backup, and recovery rules.

The ERPRP charter and this alignment package are **proposed program governance artifacts pending formal adoption**. Their presence in GitHub does not itself constitute approval, canonization, successful verification, or production acceptance.

## Baseline rule

G0 records what exists, what is missing, what is verified, and what remains unknown. Unknown is not passed. A workflow passing structural checks proves only that the governance package is present and internally well-formed; it does not prove application readiness.
