# ERPRP Ecosystem System Registry

**Document ID:** ERPRP-REG-001  
**Version:** 0.1.0  
**Status:** Baseline — initial inventory; owner and interface details require confirmation

## System boundaries

| System | Program role | Repository / evidence observed | Baseline status |
|---|---|---|---|
| AH-AIOS Core | Core intelligence, world model, governance | Current repository includes AH-AIOS system definition and related architecture material; full implementation boundary must be mapped | Needs G0 inventory |
| AI Harness | Controlled execution, evaluation, and test environment | Curriculum and program materials describe the domain; authoritative implementation repository and deployed boundary not established by this baseline | Needs G0 inventory |
| World Forge | Structured world-model authoring and governance application | Existing WorldForge source, governance tests, and build material are preserved in this repository | Needs G0 inventory |
| Learning Studio | Integrated learning and development package | Root website in this repository; curriculum and local learner-state features documented | Application-level verification exists; production readiness not established |
| GitHub | Authoritative version-controlled source and governance record | Repository `hydraporss/ah-aios-react-website`, default branch `main` | Repository identity still requires alignment |

## Current repository facts observed for this baseline

- Default branch: `main`.
- Current repository name: `ah-aios-react-website`; intended project identity is Learning Studio. Repository rename is not completed.
- Root README identifies Learning Studio as the primary website.
- Root deployment workflow runs tests, syntax checks, build, browser smoke test, and deploys GitHub Pages after verification.
- A separate Learning Studio verification workflow targets branch `learning-studio-0.2.0` for push events and `main` for pull requests; it also contains older subdirectory assumptions. This workflow requires reconciliation with the root deployment workflow.
- Learning Studio documentation reports 24 specified courses and 96 lesson units, with four authored lesson drafts at the documented point in time; the remaining lesson content is not approved/published.
- The documented authoritative 82-Theory dataset is not bundled; structural import validation does not establish source authenticity.
- Learner profile/progress is browser-local in the documented release; no shared backend or cloud synchronization is claimed.
- Existing automated checks passing do not establish cross-browser, accessibility, PWA, security, backup/restore, or production operational acceptance.

## G0 open questions / evidence required

1. Confirm canonical repository names and map all repositories to the three applications.
2. Identify application owners, program authority, reviewers, and release approvers.
3. Inventory active deployments, environments, domains, secrets, and hosting configuration.
4. Map application interfaces, data flows, dependencies, and version compatibility.
5. Identify every authoritative dataset and its source lineage.
6. Identify operational stores (including any Supabase use), data owners, retention, backup, restore, and reconciliation rules.
7. Confirm security controls, branch protection, access membership, secret scanning, dependency alerts, and incident process.
8. Reconcile duplicated or obsolete workflows and define required status checks.
9. Establish manual acceptance plans for accessibility, supported browsers/devices, PWA behavior, and operational readiness.

**No missing repository, owner, deployment, dataset, or control is inferred to exist. Unknowns remain open G0 findings.**
