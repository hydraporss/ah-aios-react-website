# After Humanity page preservation notes

This file records the deployed After Humanity page structure and the files needed to preserve it.

## Live page

- **Current page:** [AH-AIOS WorldForge — After Humanity](https://hydraporss.github.io/ah-aios-react-website/?v=118da62#after-humanity)
- **Repository:** [hydraporss/ah-aios-react-website](https://github.com/hydraporss/ah-aios-react-website)
- **Preserved HTML code:** [View HTML source](https://github.com/hydraporss/ah-aios-react-website/blob/main/public/worldforge/after-humanity-source.html) · [Raw HTML](https://raw.githubusercontent.com/hydraporss/ah-aios-react-website/main/public/worldforge/after-humanity-source.html) · [Hosted HTML copy](https://hydraporss.github.io/ah-aios-react-website/worldforge/after-humanity-source.html)
- **Recorded source revision:** `118da62`
- **Deployment workflow:** [GitHub Pages build and deployment](https://github.com/hydraporss/ah-aios-react-website/actions/runs/40628824210)

The old link with `?v=32eec0f` refers to an earlier browser-cached build. Use the live page link above for the recorded layout.

## Page structure to preserve

Keep the existing layout and section order:

1. WorldForge navigation.
2. The embedded After Humanity archive, including its hero, navigation, archive cards, and updates.
3. The featured After Humanity YouTube section directly below the embedded archive.
4. The WorldForge dashboard and its other sections.
5. Prompt Builder in its existing lower-page position.

The supplied After Humanity cover artwork belongs in the hero of the embedded archive. It must not replace the React page, rearrange the other WorldForge sections, or remove the YouTube or Prompt Builder sections.

## Source files and artwork

- `src/App.jsx` — contains the embedded After Humanity page, its hero image reference, and the parent page sections.
- `public/worldforge/after-humanity-source.html` — standalone, readable HTML source extracted from the embedded page for preservation.
- `src/styles.css` — styles the React application and the featured YouTube section.
- `public/worldforge/after-humanity-cover.jpg` — cropped cover artwork supplied for the After Humanity hero.
- `.github/workflows/deploy.yml` — builds and publishes the site to GitHub Pages when changes are pushed to `main`.

The hero references the public image at:

`https://hydraporss.github.io/ah-aios-react-website/worldforge/after-humanity-cover.jpg`

Keep the image file in `public/worldforge/`. If the hosted site path changes, update the image URL in the embedded page in `src/App.jsx` as well.

## Rebuild and redeploy

From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm build
```

Push the intended changes to `main`; the GitHub Actions workflow publishes the `dist/` output to GitHub Pages. Confirm the Actions run succeeds before sharing the updated page.

## Preserve browser-local world data separately

The repository preserves the application and its artwork. WorldForge records created in the browser-local prototype are stored in that browser profile, not in GitHub. Export a workspace JSON backup in **Import/Export** and keep it separately if those records also need preservation.