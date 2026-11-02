# AH-AIOS CORE: landing page design concept

`AH-AIOS-CORE-landing-concept.png` (1536 x 1024) is a **visual design concept** for the CORE Workbench landing screen described in `docs/AH-CORE-ARCH-001.md`. It is a mockup, not a screenshot of a running system.

**Everything in the image is illustrative.** The figures (99.97% governance integrity, 27 pending reviews, 1,428 verified evidence records, the Trust Index and its sub-scores), the live governance stream, the user "Alex Harding", and the date and version are sample content. Nothing in the repository produces or verifies these numbers. AH-CORE-ARCH-001 sections 3.5, 9.2 and 34 (Rule 3) require that real dashboard values come from verified records, that failed or missing data show as unavailable rather than healthy, and that mock content be labeled. Do not reuse these values in a live page without that labeling.

**What the concept shows that matches the spec:** the 13-module navigation (01 to 13, in spec order), the three-domain model (CORE governs, AI HARNESS executes, WORLDFORGE structures knowledge) with human authority across all three, and a shell with global search, notifications and user identity.

**Notes for implementation:**
- The module strip at the bottom of the image shows a 14th unlabeled tile after Change & Release. The spec defines 13 modules.
- The "Operational" status badge and "Trust Index" are not defined in the spec. Under section 31, "Operational" requires verification evidence, so a concept screen should not show it as established.

Status: concept only. No CORE Workbench code exists in this release; AH-CORE-ARCH-001 is a Proposed, not-yet-approved specification.
