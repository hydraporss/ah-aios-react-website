# WorldForge Studio — v0.6 prototype

This folder adds a structured, browser-local World Studio to the existing WorldForge website.

## Open
Open `studio.html` in a modern browser, or navigate to the World Studio link from the WorldForge homepage.

## Included workflows
- Create world records with stable identifiers.
- Register entities with world membership, type, identity notes, and descriptions.
- Connect entities with typed, directed or symmetric relationships.
- Register claims with epistemic type, source details, evidence state, and uncertainty.
- Advance a claim through Proposed → Investigating → Needs Evidence → Validated. This is a local review workflow only; it does not approve canon.
- Run structural validation for duplicate IDs, missing fields, dangling relationship endpoints, cross-world relationships, and missing provenance.
- Export a versioned JSON workspace package and import a validated package.

## Data and governance boundary
The app stores records in browser localStorage under `worldforge_studio_v1`. Data does not sync across browsers or devices and is not a secure shared database. Export JSON backups regularly.

No login, server API, PostgreSQL, cloud sync, team collaboration, or live AI integration is included. The client-side validator is useful for prototype feedback but is not a security boundary. Production authorization and canon approval must be enforced server-side.

## Verification status
- Implemented in this branch: static World Studio interface and local CRUD/import/export/validation behavior.
- Requires browser execution testing before L2 (Tested) can be claimed.
- Requires acceptance review before L3 (Verified) can be claimed.
- Not production-ready; do not label L4.

## Related documentation
See the WorldForge Project Documentation Hub in Notion and AH-WF-ARCH-001. These prototype behaviors do not amend the established architecture or canon.

## Structured data layer v1

- Formal JSON Schema Draft 2020-12 contracts live in `schemas/v1/`.
- Browser-local migration and structural integrity helpers live in `assets/data-layer.js`.
- Local edits create revision snapshots in browser `versionHistory` and append audit activity. This remains browser-local history, not a tamper-proof shared audit log.
- The authenticated Supabase adapter is in `assets/supabase-service.js`; it uses the public publishable key from `assets/supabase-config.js`, never a service-role key.
- The current shared schema maps WorldForge worlds to the existing Supabase `projects` table and preserves the existing `entities`, `relationships`, `claims`, `sources`, and `governance_reviews` tables.
- The "Publish local drafts" action is a guarded local-to-cloud sync. It does not download/merge cloud data, delete remote rows, or promote canon. Conflicting remote revisions are skipped.
- Supabase migrations `20261030112015_worldforge_record_versioning.sql` and `20261030112052_worldforge_function_privilege_hardening.sql` add version snapshots, audit events, optimistic version increments, a controlled canon-status RPC, and restricted function privileges.
- Authentication and Row Level Security are required. Only the public publishable key is used in the browser. Do not add service-role keys to frontend files.
- Supabase project schema changes have been applied to the configured development project and checked with Supabase security advisors. Production readiness, full bidirectional sync, and restore drills remain unverified.
