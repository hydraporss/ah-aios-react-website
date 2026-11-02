# Theory import candidate (82 records)

Status: CANDIDATE, not approved, not loaded into the app.

- `theories-import-82.csv`: input for `node scripts/build-theories.js`. Columns id,title,classification,summary,source,relationships plus carried-through kind,cluster,verification,source_sha256.
- `theories-import-82.json`: output of that script (82 records: 68 registry, 14 synthesized). Importable in the Learning Studio workbench.

Source: `data/theories.json` in `AH-AIOS.zip` (2026-10-25). `summary` is intentionally EMPTY (nothing is invented). Open before import:
1. The registry/synthesized split (14 `THEORY-*` ids = synthesized) is inferred. Owner to confirm.
2. The source's `registry/theory_registry.json` (2026-10-27) has 86 records. The extra four (`C-ON`, `HUM-001`, `INV-001`, `INV-PITCH-001`) are framework-kind records whose sources are an OntoMesh paper, a role matrix and two investor documents, so they look like documents rather than theories. An earlier report in the source calls 82 unverifiable. Owner to decide 82 vs 86.
3. 65 records are NOT_RUN, 3 NOT_RECORDED; relationships empty. The script checks structure only, not facts.
