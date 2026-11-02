# AH-AIOS engines (reference source)

Status: REFERENCE ONLY. Not wired into the site or the Flask app. Not approved.

Origin: `src/ah_aios/` of the AH-AIOS working tree (`AH-AIOS.zip`, files dated up to 2026-10-31). Copied unchanged except that `*.bak`/`*.old` leftovers and `__pycache__` were dropped.

Contents: `ah_gen_engine`, `ah_lore_engine` (incl. `theory_inventory.py`), `ah_vis_engine`, `mva_starter`, `world_model`, `upple`, `recovery.py`. Files keep their original (mostly CRLF) line endings.

Tests (run from this folder, needs `pytest`):

    PYTHONPATH=. python3 -m pytest ah_aios --ignore=ah_aios/ah_vis_engine

Verified 2026-11-01: 75 passed. `ah_vis_engine` tests were not run: its `prompt_bible.py` imports `pydantic`, which was not available offline. `openai_adapter.py` in `ah_vis_engine` was not exercised.

The AH-AIOS CORE spec (`docs/AH-CORE-ARCH-001.md`) is still "proposed, not implemented". This code is the nearest existing implementation material for it; whether it satisfies the spec is not assessed.
