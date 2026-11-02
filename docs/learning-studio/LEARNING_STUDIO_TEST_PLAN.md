# Learning Studio — Test Plan
Executed items are in the Test Report section of IMPLEMENTATION_AUDIT_AND_TEST_REPORT.md (reused, not duplicated).

| Level | Planned | Status |
|---|---|---|
| Static | `node --check` on app.js/explorer.js; schema checks | Syntax check run: pass. No lint/type config |
| Unit | Curriculum integrity; theory validator; explorer search; progress validate/import; progress calculation | Curriculum, validator, explorer, workbench workflow/roles/audit/search EXECUTED (17 tests). Others NOT WRITTEN |
| Integration | Persistence round-trip; import/export; SW cache | NOT RUN |
| E2E (learner, theory) | Browser journeys | Partially executed in Chromium (courses render; explorer with synthetic fixture). Full learner journey not run |
| E2E (instructor, admin) | n/a | Features not implemented |
| Regression | Existing pages, worldforge, harness, localStorage keys | Harness test and 19 Flask tests run; Learning Studio pre-existing 19-test suite unavailable |
| Cross-browser | Firefox, Safari, mobile devices | NOT RUN |
| Accessibility | Keyboard, screen reader, contrast | NOT RUN |
| PWA | Install/offline on http://localhost | NOT RUN |
| CI | GitHub Actions | NOT RUN |
Commands: `node --test learning/tests/*.test.js`; `cd optional-flask-backend && pip install -r ah_webapp/requirements.txt pytest && python -m pytest ah_webapp/tests` (42 pass as of 2026-11-01).
