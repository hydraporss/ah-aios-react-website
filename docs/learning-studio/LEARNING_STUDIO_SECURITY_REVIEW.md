# Learning Studio — Security Review (limited, 2026-11-01)
Not a penetration test. No claim of compliance or production security.

## Learning Studio (static)
- Output encoding: app.js and explorer.js escape (`esc`) before innerHTML; explorer escapes all record fields. Not fuzz-tested. Imported JSON is validated before storage.
- Secrets: pattern scan of the bundle found none. Sprint content instructs keeping API keys out of source.
- Authorization: none. Workbench roles are client-side (sessionStorage) and bypassable by any user of the browser; they prevent mistakes, not misuse. Workbench overlay is in localStorage, readable by same-origin scripts. Data in localStorage is readable by any script on the same origin.
- Privacy: no learner data leaves the browser; no analytics observed. Google Fonts requests expose IP to Google when online.
- Dependencies: no package manager; no dependency audit applicable.
- Service worker: cache cleanup limited to its own prefix.

## Flask backend
- SECRET_KEY: FIXED 2026-11-01. No shipped default; if unset a random per-process key is generated with a logged warning (sessions reset on restart). Set SECRET_KEY for real use. Flask tests 42/42 after change.
- Admin bootstrap only when AH_AIOS_ADMIN_EMAIL/PASSWORD are set (no shipped default password).
- Admin routes check role server-side (admin.py); governance/main routes not audited here.
- Registration route creates `member` accounts; CSRF protection and rate limiting not verified.
- Dependencies not audited (pip-audit not run).

## Unverified / open
Accessibility, CSP headers, CSRF, session settings, backup protection, role separation for instructor/reviewer (roles do not exist).
