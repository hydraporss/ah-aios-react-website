# Learning Studio Combined Package — Integration Review

**Review ID:** LS-INT-REVIEW-001  
**Reviewed:** 2026-10-31  
**Notion evidence:**  
- [Combined Package — Modules, Lab & Findings](https://app.notion.com/p/40a66662b29d817286dced3abb8655a3)  
- [Learning Studio — Website Package & Deployment Checklist](https://app.notion.com/p/40a66662b29d81679be3ea93653ddf3e)  
- [LS-ARCH-WEB-001 — System Architecture Specification](https://app.notion.com/p/40a66662b29d8162ac2fcadaa54ad9fa)  
**Repository:** `hydraporss/ah-aios-react-website`  
**Working branch:** `feat/learning-studio-core-governance-content-v1`

## 1. Review conclusion

The Notion page describes a combined archive named `learning-studio-combined.zip` containing a static Learning Studio, a Prompt Builder Lab, and supplied WorldForge, AI Harness, and AH-AIOS Core modules.

The page explicitly labels that package **combined, not verified**. Its tests were not run and nothing was deployed.

The combined archive itself is not present in the inspected repository tree or as a downloadable attachment on the Notion page. The current repository branch also does not contain the described `modules/` directory, `MODULES-NOTES.md`, or `learning-studio/labs/prompt-builder/` path. Therefore, those modules must be treated as **documented package contents, not integrated repository components**.

This review does not infer that the package contents are safe, complete, or operational.

## 2. Reconciliation against the architecture specification

LS-ARCH-WEB-001 defines the current application as a standalone browser application. Its target future services—authenticated accounts, server-side learner records, live AI, and credential verification—are explicitly not operational merely because they appear in the architecture.

The combined package does not supersede that boundary. It is an integration candidate that must pass source, security, functional, and deployment checks before any of its capabilities are described as part of the Learning Studio.

### Current curriculum state on this working branch

- 24 of 96 lesson units have authored drafts.
- 72 of 96 lesson units remain specified-only.
- 0 lessons have independent review approval.
- 0 courses are published.

This working-branch state is newer than the earlier Notion checklist, which says all 96 lessons are specified-only. It is not a claim that the changes are merged to the default branch or published.

## 3. Package findings and required actions

| Finding in package record | Current evidence | Required action | Status |
|---|---|---|---|
| Python and JavaScript tests were not run | Notion package record says syntax checks only | Obtain the exact archive/source tree; run Python tests and JavaScript tests in their intended runners; record versions and results | Blocked — source archive not present |
| `commands.py` and `batch1_handlers.py` differ between WorldForge and AH-AIOS Core | Reported in package findings; source files not in inspected repository paths | Compare both versions, trace imports and callers, define authoritative ownership, test behavior before merging | Blocked — source files unavailable in repository |
| AH-AIOS Core README references missing folders | Reported folders include `src/`, `docs/`, `registry/`, `tests/`, and `recovered_sources/` | Inventory expected versus supplied files; classify omissions; do not fabricate replacements | Blocked — source archive not present |
| Flask apps use a default `SECRET_KEY` | Package findings identify `dev-secret-key-change-in-production` | Remove hard-coded fallback for non-development use; load secret from server environment/secret manager; fail closed when absent; rotate any exposed value | Security blocker — app source unavailable |
| Prompt Builder writes messages with `innerHTML` | Package findings identify this sink | Replace with safe DOM text APIs or rigorously sanitized trusted markup; test hostile user input and imported strings | Security blocker — lab source unavailable |
| Prompt Builder Lab is described as included in the combined site | No `learning-studio/labs/prompt-builder/` path in inspected branch tree | Integrate only after source review, route/base-path checks, and functional tests | Not integrated |
| Nothing was deployed | Package record explicitly says nothing deployed | Deploy only after CI, security, browser, PWA, accessibility, and live acceptance checks | Not deployed |

## 4. Repository verification boundary

The current Learning Studio working branch contains the application, curriculum data, assessment workflow modules, tests, and deployment configuration. It does not contain the combined package's reported Flask module tree or its Prompt Builder Lab directory.

The repository's existing Learning Studio test suite and the combined package's unrun module tests are separate verification scopes. A passing Learning Studio CI run cannot be used as evidence that the absent Python modules or Prompt Builder Lab passed tests.

## 5. Integration sequence

1. **Source inventory:** establish exact archive contents, file hashes, versions, and provenance from the package record; compare against the repository tree.
2. **Security remediation:** resolve the Flask secret configuration and unsafe HTML sink before exposing the affected components.
3. **Source reconciliation:** compare WorldForge and AH-AIOS Core command/handler implementations; document the selected source and behavior.
4. **Module tests:** execute Python and JavaScript tests separately; add regression tests for reconciled behavior and hostile input.
5. **Learning Studio integration:** add reviewed modules and the Prompt Builder Lab through explicit interfaces; do not deploy raw Flask applications into static hosting.
6. **Acceptance:** verify routes, base paths, responsive and keyboard behavior, PWA behavior, deployment artifact, and live URL against LS-TST requirements.
7. **Status update:** mark each requirement Passed, Failed, Blocked, or Not Tested only from recorded evidence.

## 6. Non-negotiable boundaries

- A supplied package is not an integrated application.
- Syntax checking is not a substitute for executing tests.
- A source file existing is not proof that its behavior is correct.
- A static site cannot safely hold server-side secrets.
- Local learner state is not an authenticated account or cloud record.
- A local/rule-based tutor is not a live AI service.
- A printable completion document is not an independently verifiable credential.
- Generated or adapted learning content remains draft until independently reviewed.
- This integration review does not approve or alter AFTER HUMANITY canon or WorldForge governance records.

## 7. Review status

**Overall:** Integration blocked pending the exact combined package source tree and execution of its unrun tests.

**Safe to continue:** development and verification of the existing Learning Studio branch, including curriculum authoring and data-integrity work that does not depend on the absent modules.

**Not authorized by this review:** claiming the Prompt Builder Lab or Flask modules are integrated, declaring the combined package verified, deploying it, or exposing its default-secret configuration.

---
