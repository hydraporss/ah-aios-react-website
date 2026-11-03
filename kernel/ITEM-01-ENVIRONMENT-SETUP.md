# Kernel Build Item 01 — Supabase setup and environment configuration

**Scope:** Item 01 only, from the AH-AIOS Incremental Kernel Build Protocol.  
**Classification:** Proposed implementation contribution for independent review.  
**Canon impact:** None.  
**No remote Supabase project was linked, provisioned, or modified.**

## Repository inspection

- Repository: `hydraporss/ah-aios-react-website`
- Base branch inspected: `feature/ah-aios-kernel-foundation`
- Base commit: `488677ef9b7787e4b411825e65686aab5356d251`
- Existing kernel prototype: `kernel/src/` and `kernel/tests/kernel.test.js`
- Existing Supabase CLI configuration: not present in the inspected branch tree.
- Existing root `.gitignore`: ignored `.env.*`, which also ignored `.env.example`; this made a committed safe template impossible without an exception.
- Existing root package scripts already include `kernel/tests/*.test.js`, so the new test is discovered without changing package scripts.

## Files in this item

1. `.env.example` — required environment variable names only; all values blank.
2. `.gitignore` — preserves local-secret ignores and explicitly permits `.env.example`.
3. `supabase/config.toml` — minimal local Supabase CLI project identity; no credentials or remote provisioning.
4. `kernel/tests/environment-config.test.js` — regression checks for required variables, blank values, ignore exception, and config presence.
5. This record — scope, source baseline, and verification status.

## Security boundaries

- `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, and `LUMA_API_KEY` are backend-only.
- No secret value is included.
- No `VITE_` variable is introduced.
- `.env` and `.env.*` remain ignored; only `.env.example` is unignored.
- This item does not create tables, migrations, policies, Edge Functions, or frontend code.

## Verification

The repository CI workflow runs `npm test` on non-main pushes. The existing package script includes `kernel/tests/*.test.js`, which picks up the new regression test. CI status must be read from the resulting workflow run before this item is marked verified.

## Explicit limitations

- No Supabase project reference or credentials were supplied; remote linking/provisioning was not attempted.
- The minimal `project_id` is a local CLI identifier, not evidence of a connected remote project.
- This item does not establish production readiness.
- Next planned queue item is Item 02 — Nodes Table Migration. It must not begin without explicit authorization.
