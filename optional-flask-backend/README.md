# AH-AIOS Learning Studio

Consolidated source for the AH-AIOS Learning Studio, assembled on 31 October 2026 from four uploaded packages
(AH-Learning-Studio, WorldForge, WorldForge + AI Harness + AH-AIOS Core combined, and the Notion product summary).

## Layout

| Path | Contents |
|---|---|
| `ah_webapp/` | Flask backend (commands, models, governance, auth, admin, WoF integration, Batch 1 handlers) |
| `ah_webapp/app/static/` | Static front end: prompt builder, schemas, templates, CSS |
| `ah_webapp/tests/` | Batch 1 read-only tests and Phase 1 vertical-slice tests |
| `hermes.py`, `hermes_cli.py` | Hermes Edition CLI (from the AH-AIOS Core package) |
| `docs/` | LS-ARCH-WEB-001 architecture specification, Notion product summary, Notion blocks export, original AH-AIOS README |
| `reference/ahaios-core-variants/` | Differing copies of `commands.py`, `batch1_handlers.py` and `test_batch1_read_only.py` from the AH-AIOS Core package, kept for review |

## Status (read before relying on this)

- Verification: **NOT_RUN.** No tests were executed during assembly; a test file existing is not evidence that it passes.
- `ah_webapp/phase1_vertical_slice.py` was **written after assembly** (it was not in any supplied package), derived from the Phase 1 tests and `models.py`, plus `ah_webapp/tests/conftest.py` (the `app` fixture those tests request). It has been compiled and statically checked against the model columns but **never executed against the tests**: the sandbox it was written in had no Flask-SQLAlchemy, Flask-Login or pytest. Run the full suite before relying on it.
- The backend in `ah_webapp/` is the Learning Studio package version. It wires in the Batch 1 handlers and is a superset of the AH-AIOS Core copy. The Core copy differs in `commands.py`, `batch1_handlers.py` and the Batch 1 test; see `reference/`.
- `docs/AH-AIOS-README.original.md` mentions `src/`, `registry/`, `recovered_sources/` and `tests/test_registry.js`. None of those were in the supplied packages.
- `SECRET_KEY` falls back to a development default in `ah_webapp/__init__.py`. Set `SECRET_KEY` and `AH_AIOS_ADMIN_PASSWORD` via environment variables for anything beyond local use.
- The local tutor is not a live AI service; browser localStorage is not authenticated recordkeeping or cloud sync.
- LS-ARCH-WEB-001 is a proposed specification, not proof of implementation.

## Running locally

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r ah_webapp/requirements-dev.txt
pytest ah_webapp/tests/test_batch1_read_only.py
node ah_webapp/app/static/js/prompt-builder.test.js
```

(Commands unverified; the Node test's runner requirements were not checked. Also run `pytest ah_webapp/tests/` for the Phase 1 tests.)
