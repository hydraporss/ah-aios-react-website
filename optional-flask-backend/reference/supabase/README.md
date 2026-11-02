# Supabase SQL (reference only, unverified)

- `002_incremental_changes.sql`: "incremental migration" that adds tables/columns to an existing remote database.
- `seed_ah_aios.sql`: seed data.

Not run against any database. The set is INCOMPLETE: the source README refers to `001_initial_schema.sql`, which is not in `AH-AIOS.zip`. Treat 002 as unusable on a fresh project until 001 is recovered or the schema is reconciled with the Flask models. The source's `config.toml`, `web/app.js` and `.temp/` were deliberately left out (they carry a project reference). No credentials are in this package.
