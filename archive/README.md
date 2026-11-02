# archive/

Earlier standalone builds, kept for reference. **Not published** by the Pages build (`scripts/build-site.sh` excludes `archive/`) and not covered by `check:links`. Nothing in the live site links to them. They are not the source of truth: the maintained copies live under `learning/worldforge/`.

| Folder | What it is | Source upload (SHA-256) |
|---|---|---|
| `worldforge-website-2026-10-28/` | WorldForge static website (index, architecture, governance, doctrine, constitution, explorer). Dated 2026-10-28. | `worldforge-website-package.zip` `6bdf8f2e…069f9` |
| `after-humanity-prompt-builder-2026-10-29/` | After Humanity Prompt Builder / operational website (index.html, app.js, styles.css, redesign concept PNG). Dated 2026-10-29. | `After_Humanity__Prompt_Builder__and_the_complete_archive.zip` and `after-humanity-operational-website.zip`, byte-identical files with the same SHA `94c34595…685d6`, stored once |

Each folder opens directly (`index.html`); internal links were checked and resolve. They differ from the later builds in `learning/worldforge/after-humanity-prompt-builder-archive/` and `learning/worldforge/verified-2026-10-28/`, so they were not merged into them.

To publish one, move it out of `archive/` (or remove `--exclude='./archive'` from `scripts/build-site.sh`), then run `npm run verify`.
