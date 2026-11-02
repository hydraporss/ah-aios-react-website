# AH-AIOS Website Deployment Runbook

**Purpose:** Repeat the controlled release process used to publish the AH-AIOS website to GitHub Pages.  
**Repository:** `hydraporss/ah-aios-react-website`  
**Production URL:** https://hydraporss.github.io/ah-aios-react-website/  
**Production branch:** `main`  
**Release branch pattern:** `release/<version>`  
**Last exercised:** 2026-11-01 — Master Release 0.5.1

This is an operational record, not a statement that every feature in the website is complete. A successful static-site deployment proves that the published files built and deployed; it does not prove that every application feature, lesson, backend, account system, or external preview service is production-ready.

> **Restoration note (2026-11-02):** This file was restored into the release package from commit `34a53c4` so that staging does not show it as a deletion. The original text is preserved. Additions made afterwards are marked **[Added in revision 0.5.1-r2]**: Section 9 (extra CI check and the desktop workflow) and Section 15.

---

## 1. Deployment principles

01. **Preserve the production site until the release is approved.** Do all staging and validation on a release branch.
02. **Back up before replacing files.** Record the original `main` commit and create a named backup branch.
03. **Use the release artifact as the source of truth.** Do not invent missing files or silently edit package content.
04. **Separate staging from approval.** A successful extraction is not approval to delete, merge, or deploy.
05. **Review deletions explicitly.** Distinguish removed paths from renamed paths.
06. **Verify before opening the PR.** Compare the staged tree against the release inventory and expected hashes.
07. **Require owner approval before merging to `main`.**
08. **Do not call a release deployed until the Pages workflow succeeds and the live site is checked.**
09. **Keep an evidence trail.** Record commit SHAs, workflow run URLs, test outcomes, manifest status, and any deviations.
10. **Never claim a test passed unless its result is visible in the workflow or test output.**

## 2. Roles and approval gates

| Gate | What must be reviewed | Required decision |
|------|-----------------------|-------------------|
| G1 — Package readiness | Version, archive checksum, manifest, expected file inventory, backup target | Approve staging |
| G2 — Cleanup review | Full deleted-path list; distinguish renames from deletions | Approve or reject cleanup |
| G3 — Integrity review | Every expected path, byte size, and Git blob SHA; only documented optional files may be absent | Approve PR creation |
| G4 — PR review | Diff, CI, backend checks, release notes, deployment workflow | Approve merge |
| G5 — Production verification | Pages deployment success, live page, release version/status | Declare deployed |

If a gate fails, stop at that gate. Do not silently skip it to keep the release moving.

## 3. Prepare the release

Before touching GitHub:

1. Obtain the final release archive and its checksum from the package owner.
2. Confirm the release version and intended target repository.
3. Inspect the archive contents before upload.
4. Confirm that the archive contains:
   - The website entry point, such as `index.html`.
   - The release manifest.
   - All required application directories and assets.
   - The expected file inventory and hash file, if supplied.
   - Required workflow and support files.
5. Record archive filename, byte size, SHA-256, manifest version, manifest file count, and known limitations.
6. Do not fabricate missing lesson content, theory records, credentials, or source files.
7. Keep the original archive unchanged as the release source artifact.

**Important:** A manifest count and a successful ZIP extraction are not substitutes for comparing every expected file against the supplied expected-hash inventory.

## 4. Establish the GitHub release branch and backup

For the next release:

1. Fetch the latest `main` commit from GitHub.
2. Record its full commit SHA.
3. Create a backup branch before staging, named clearly, for example: `backup/before-master-release-<version>`.
4. Create a separate release branch, for example: `release/<version>`.
5. Confirm both branches point to the intended starting commit.
6. Do not make release changes directly on `main`.

For the 0.5.1 release, the recorded pre-release `main` baseline was:

```
6788ecef6c0a34bc94e08f76d1cff5ca45a8fc22
```

Backup branch: `backup/before-master-release-0.5.1`.

## 5. Stage the release artifact

### 5.1 Upload

For 0.5.1, the release ZIP was uploaded to the repository root through the GitHub web interface. The ZIP was not unpacked manually into partial or placeholder files.

### 5.2 One-time staging workflow

A temporary `stage-release.yml` workflow was added to perform the controlled extraction. Because the ZIP was already present, the workflow was configured to run when the workflow file itself was pushed. It also failed clearly if the ZIP was missing.

The staging workflow:

1. Checked the uploaded archive checksum.
2. Validated the ZIP.
3. Inspected the archive manifest.
4. Confirmed 275 declared payload files and zero staging-manifest problems.
5. Confirmed the backup branch.
6. Replaced the old site tree on the release branch with the release contents.
7. Preserved repository control files as designed.
8. Removed the uploaded ZIP after extraction.
9. Committed the staged tree to the release branch.

For 0.5.1:

- Archive SHA-256: `7aa7514155520686672973ed4e003103487a32ae5b9941a0e0b22015b3a2d3ad`
- Archive entries: 276 including the manifest
- Manifest payload entries: 275
- Staging problems reported: 0
- Successful staging run: https://github.com/hydraporss/ah-aios-react-website/actions/runs/41300135918

**Temporary workflow rule:** A one-time staging helper must be inspected, used only for the intended release, and removed after successful staging. Do not leave it active as a permanent deployment workflow or blindly reuse it for another archive.

## 6. Review all changes and deletions

Compare the release branch against the recorded pre-release `main` baseline.

For each changed path, classify it as:

- Added
- Modified
- Deleted
- Renamed (record both old and new paths)

Do not count a rename as a deletion. Do not delete anything else until the owner has reviewed the complete deletion list.

### 0.5.1 comparison summary

The GitHub comparison reported:

- 195 added
- 31 removed
- 70 renamed
- 4 modified

The 31 paths removed from the old site were:

```
.github/workflows/deploy.yml
.nvmrc
docs/AH-AIOS-SYSTEM-DEFINITION.md
docs/after-humanity/README.md
docs/after-humanity/after-humanity-whole-page.txt
docs/after-humanity/source-txt/App.jsx.txt
docs/after-humanity/source-txt/main.jsx.txt
docs/after-humanity/source-txt/styles.css.txt
docs/learning/combined-package-integration-review.md
docs/v0.4-end-to-end-acceptance.md
docs/v0.4-sprint-1-and-acceptance.md
learning-studio/.gitignore
learning-studio/AH-AIOS-Learning-0.2.0.zip
learning-studio/AH-AIOS-Learning-Studio-0.2.0.zip
learning-studio/AH-CORE-130-SOURCE-REGISTER.json
learning-studio/AH-CORE-130-SOURCE-VERIFICATION.md
learning-studio/DEPLOYMENT.md
learning-studio/README.md
learning-studio/assessment-ui.mjs
learning-studio/assessment-workflow.mjs
learning-studio/package.json
learning-studio/tests/assessment-workflow.test.js
learning-studio/tests/browser-smoke.mjs
learning-studio/tests/curriculum-quality-gate.test.js
learning-studio/tests/curriculum-quality.test.js
learning-studio/tests/deployment-smoke.test.js
learning-studio/tests/progress-validation.test.js
learning-studio/tests/theory-validation.test.js
learning-studio/theory-validation.js
netlify.toml
pnpm-lock.yaml
```

The 70 renamed paths were not treated as deletions. The comparison and deletion list were reviewed before proceeding with the release. Preserve this review discipline for every release.

## 7. Remove temporary and obsolete workflows carefully

After successful extraction:

1. Inspect the one-time staging helper and remove it from the release branch.
2. Inspect any old workflows that refer to the previous directory layout.
3. Remove an obsolete workflow only after confirming that it is superseded and recording why.
4. Do not delete the current Pages, CI, or backend workflows merely because an earlier run failed.
5. Re-run the applicable checks after workflow cleanup.

For 0.5.1:

- Temporary `.github/workflows/stage-release.yml` was removed after staging.
- The old `.github/workflows/learning-studio-verify.yml` was removed after inspection because it targeted the superseded Learning Studio 0.2.0 layout.
- The initial CI run failed before archive extraction because the new release paths were not yet present. After staging, the release CI checks passed; the CI workflow itself did not need a path rewrite.

## 8. Verify the staged tree before opening a PR

This is a mandatory gate for future releases.

For every file in the release inventory, compare:

1. Exact repository path.
2. Exact byte size.
3. Git blob SHA (or the explicitly specified hash algorithm in the supplied expected-hash file).

Produce a report with:

- MATCHED
- MISSING
- MISMATCHED
- UNEXPECTED

Only omit files that the release specification explicitly marks optional. Record each permitted omission by path and reason.

**0.5.1 evidence limitation:** The staging workflow verified the archive checksum, archive integrity, manifest count, and zero staging-manifest problems. The retained run record does not demonstrate a completed, path-by-path comparison of the final Git tree against a separate `expected-blob-shas.txt` file. Do not represent that stronger check as completed for 0.5.1. Make it a hard pre-PR requirement next time.

If any required file is missing or mismatched, stop and identify the exact upload batch or path that must be corrected. Do not open the production PR.

## 9. CI and release checks

The current GitHub Pages workflow is `.github/workflows/pages.yml`. It:

1. Calls the reusable CI workflow.
2. Builds the static site with `npm run build:site`.
3. Checks links in the generated `_site` directory.
4. Uploads the Pages artifact.
5. Deploys using `actions/deploy-pages@v4`.

The reusable CI workflow is `.github/workflows/ci.yml`. It runs:

- JavaScript syntax checks
- `npm test`
- `npm run check:links`
- `npm run check:sync`
- `npm run check:release` **[Added in revision 0.5.1-r2]**

The optional Flask workflow is `.github/workflows/backend.yml`. It runs the Flask pytest suite when `optional-flask-backend/**` changes. It is separate from the static Pages site; a static Pages deployment does not host the Flask backend.

**[Added in revision 0.5.1-r2]** The Windows desktop app is built by `.github/workflows/desktop.yml` (workflow `desktop-windows`), which runs manually or on `v*` tags. It is independent of Pages: it never deploys the website, and the `desktop/` folder is excluded from the published site. Its artifact is unsigned.

Before merge:

- Confirm the PR-triggered CI is green.
- Confirm the optional backend workflow if it was triggered and the backend is in scope.
- Review external preview statuses separately. A failed Vercel or Netlify preview is not automatically a Pages failure; determine whether that preview is required for the release.
- Do not ignore a failed required check.

For 0.5.1:

- Static CI passed.
- Flask tests passed.
- Pages build passed.
- An external Vercel preview status failed; it did not block the GitHub Pages workflow.

## 10. Open and review the production pull request

Only after cleanup review and integrity verification:

1. Open a PR from `release/<version>` into `main`.
2. Use a clear title, e.g. `Release <version>`.
3. Include the release summary, archive checksum, manifest count, cleanup summary, checks, known limitations, and rollback reference.
4. Confirm the PR base is `main` and the head is the intended release branch.
5. Review the entire diff and check results.
6. Wait for the owner's explicit merge approval.

For 0.5.1:

- PR: #15 (https://github.com/hydraporss/ah-aios-react-website/pull/15)
- Title: `Release 0.5.1`
- Merge commit: `4ffc65dc3350ac990f993bf518c6862ed5da1529`
- Merged: 2026-11-01

## 11. Deploy to GitHub Pages

After explicit approval to merge:

01. Merge the approved PR into `main`.
02. Confirm the Pages workflow starts from the new `main` commit.
03. Watch all jobs: test, build, deploy.
04. Require the entire Pages workflow to finish with conclusion `success`.
05. Confirm the deployment job ran `actions/deploy-pages@v4` successfully.
06. If the GitHub Pages settings are accessible, confirm the publishing source is GitHub Actions. Do not claim this setting was inspected if it was not.
07. Open the production URL in a browser after the workflow succeeds.
08. Confirm the expected site title, primary navigation, and key entry points.
09. Read the release manifest from the production site (prefer a cache-busting request) and confirm its version and deployment status.
10. Record the live verification time, workflow run URL, deployed commit, and manifest version.

For 0.5.1:

- Initial Pages run: https://github.com/hydraporss/ah-aios-react-website/actions/runs/41301097521 — success.
- The release manifest was updated to `DEPLOYED` in commit `90a5b0c3b064aa6118346d52afac395b1dbfd5f6`.
- That manifest update triggered a second Pages run: https://github.com/hydraporss/ah-aios-react-website/actions/runs/41301224487 — success.
- The live browser smoke check showed the new AH-AIOS Learning App Studio page and its primary navigation.
- The manifest in the GitHub `main` branch reports version `0.5.1` and status `DEPLOYED`.

**0.5.1 verification limitation:** The retained evidence confirms the live page content and the Pages workflow success, and separately confirms the manifest contents on `main`. It does not retain a distinct cache-busted fetch of `release-manifest.json` from the public Pages URL. For the next release, capture that live manifest response explicitly.

## 12. Update the release manifest

After production deployment is confirmed, update the manifest with:

- `status: DEPLOYED`
- Deployment date/time (UTC)
- Production merge/deployment commit
- Successful Pages workflow run URL

A manifest update on `main` triggers the Pages workflow again. Wait for that follow-up run to finish successfully too. Avoid repeatedly editing the manifest just to point it at the very last workflow run; document the release commit and the run that first deployed it, then record any follow-up deployment separately in the release report.

## 13. Rollback procedure

If the new site is broken after deployment:

1. Stop further release changes.
2. Identify the last known-good production commit and the backup branch.
3. Do not force-push `main`.
4. Prepare a rollback PR that reverts the release merge (or restores the known-good tree in a reviewed commit).
5. Run the same CI and Pages workflow.
6. Confirm the rollback deployment on the live site.
7. Record the incident, cause, rollback commit, and follow-up corrective actions.

The 0.5.1 backup branch points to the pre-release baseline recorded in Section 4.

## 14. Post-deployment checklist

- Release PR merged only after owner approval.
- Pages workflow completed successfully.
- Live home page opened and checked.
- Learning Studio entry point opened.
- WorldForge entry point opened.
- Live `release-manifest.json` fetched and version/status checked.
- Release manifest and deployment evidence committed.
- Temporary staging workflow removed.
- Obsolete workflows reviewed and cleaned up.
- Backup branch retained.
- Known limitations documented.
- Final deployment record linked from the release notes.

## 15. Revision 0.5.1-r2 notes **[Added in revision 0.5.1-r2]**

This revision keeps version `0.5.1` and status `CANDIDATE` (the version number was not changed; the owner has not approved a renumbering). Review these at G2/G3:

**Changed behavior**
- AI Harness domain page (`learning/domains/harness.html`) is interactive (new `learning/domains/harness.js`); course deep links via `learning/index.html?q=<text>#courses`; Harness overview anchors and Command Builder banner fixed.
- `learning/sw.js` cache name bumped to `0.5.1-v2` so browsers drop the old cached `app.js`.
- New `desktop/` Electron project and `.github/workflows/desktop.yml` (Windows `.exe`, unsigned).

**Changed repository hygiene (will appear as modifications in the diff)**
- Line endings normalized to LF in about 30 text files; `.bat` files are CRLF. `.gitattributes` added to keep them stable (needed so `release-manifest.json` hashes match on every checkout).
- `optional-flask-backend/.gitignore` now re-includes `instance/uploads/.gitkeep`.
- `ci.yml` also syntax-checks the new scripts and runs `npm run check:release`.
- `README.md` gained a Windows desktop section and changelog entry.
- `release-manifest.json` gained a `revision` field and refreshed hashes; `AH-AIOS-Standalone.html` regenerated.

**Evidence to capture (not yet done)**
- Path-by-path comparison of the staged tree against the supplied `expected-blob-shas.txt` (Gate G3).
- A successful `desktop-windows` workflow run and a real launch of the produced `.exe` on Windows. The desktop app has been tested only with a stubbed Electron module and a browser crawl of its content, not as a packaged application.
- Live, cache-busted fetch of `release-manifest.json` after deployment.
