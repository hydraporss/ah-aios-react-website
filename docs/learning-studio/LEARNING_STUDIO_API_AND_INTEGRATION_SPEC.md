# Learning Studio — API and Integration Specification (as inspected)
## Learning Studio (learning/)
No network API. No backend calls, no authentication, no AI service. The only external requests are Google Fonts (optional; site works without) and outbound documentation links. Tutor: local rule-based, answers from bundled course content; it is not connected to a live model and must not be described as one.
Integration status: AI provider — none; cloud sync — none; LMS/SSO — none.

## Optional Flask backend (WorldForge/governance; NOT integrated with Learning Studio)
Binds 127.0.0.1:8080, debug off (run_local.py). Routes observed: /login, /logout, /register, /profile; /admin/dashboard, /users, /users/new, /audit-logs, /config, /backup; /governance proposals, review, decision, canon; main: /, /worlds, /races, /artifacts, /audit, /archive, /api/health. Auth: Flask-Login; admin role check in admin.py; roles member/moderator/admin. Request/response contracts, timeouts and retention are not documented in source and were not tested here beyond the 19 passing pytest tests. Failing: test_batch1_read_only (missing typing import; unmodified).
Any future Learning Studio integration (accounts, AI Tutor, sync) is PROPOSED only and requires an approved contract; credentials must never appear in frontend source.
