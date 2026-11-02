# Learning Studio — Backup and Recovery Guide
Procedures below are documented; restoration was NOT tested end-to-end except where noted.

| Asset | Backup | Recovery | Tested |
|---|---|---|---|
| Source and curriculum/theory data | Keep zip/git copy before changes | Re-extract / git restore | No |
| Learner progress (localStorage) | Portfolio → Export progress JSON | Import progress JSON (validated; invalid files rejected, existing progress preserved) | Not tested here |
| Theory registry | Keep the source JSON file used for import | Re-import (exactly 82 records) | Validator tested with synthetic data only |
| Flask DB | Admin /backup route exists | Unverified | No |
Notes: localStorage is per-browser; clearing site data erases progress. Rollback = redeploy the previous zip and bump/clear the service-worker cache. No migration exists for localStorage schema changes beyond the version field.
