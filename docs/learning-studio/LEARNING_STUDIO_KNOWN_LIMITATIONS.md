# Learning Studio — Known Limitations (2026-11-01)
1. Not complete and not production-ready. Status: PARTIALLY IMPLEMENTED.
2. 82-theory canon preserved as defined (68 registry + 14 synthesized); the records are not in this bundle. Explorer shows an empty state until the authoritative JSON is imported (data-import gap). No records invented; structural validation does not prove provenance.
3. 96 lessons preserved: 76 Specified only, 20 Authored draft, 0 reviewed, 0 published. No lesson content invented.
4. Instructor and Administration workbenches exist only as browser-local overlays (single device, no server, no real authentication; roles are client-side and not a security control; no multi-user review, rubrics, versioning, user administration). Not implemented: accounts, server-side permissions, live AI Tutor, cloud sync. Cross-domain search covers courses, lessons, projects and theories only.
5. Tutor is local and rule-based, answering from bundled content.
6. Progress and competency figures cover the 9 legacy primers, not the 24 courses; not formal ratings; no credentials issued.
7. Unverified: Firefox, Safari, screen readers, PWA installation, actual GitHub CI, /learning-studio/ deployment, mobile devices.
8. Flask defect FIXED 2026-11-01: `ah_webapp/batch1_handlers.py` lacked `from typing import Dict, Any`; one import line added on user instruction. Flask suite now 42/42; SECRET_KEY no longer falls back to a shipped default (random per-process key + warning when unset) (was 19 passing + 1 file failing at collection). Backend remains unintegrated with Learning Studio.
9. The earlier 19-test Learning Studio suite and CI evidence cited in VERIFICATION.md are not in the bundle; unverifiable here.
10. Bundle is not a git checkout; branch/commit unknown.

## Added in 0.5.1
- **WorldForge is a built artifact.** `worldforge-app/` (and the Flask copy, which is a different build) is minified output; its React source is not in this repository. The 0.5.1 export/import fix was applied to the built files. If WorldForge is rebuilt from its original source, re-apply: export must include `claims` and `changeProposals`; import must validate and restore them.
- WorldForge shows no message when Add Record / Register Source is submitted empty (it silently does nothing).
- WorldForge allows creating a record directly with status "Approved". Whether creation should be limited to Draft/Proposed is an **owner governance decision**; it was not changed.
- Flask pytest suite was not executed in the 0.5.1 verification environment (dependencies unavailable). Its CI job (`backend.yml`) is the authority.
- External fonts and the YouTube embed need internet access.
