# AH-AIOS for Windows (desktop app)

An Electron wrapper around the same static site GitHub Pages publishes. Local-first: no server, no account; progress is stored on the computer. The optional Flask backend is not included.

## Get the .exe (no tools needed): GitHub Actions
1. GitHub repo -> **Actions** -> **desktop-windows** -> **Run workflow**.
2. When it finishes, open the run and download the artifact **AH-AIOS-windows**. It contains:
   - `AH-AIOS-Setup-<version>.exe` (installer with Start Menu and Desktop shortcuts)
   - `AH-AIOS-Portable-<version>.exe` (runs from any folder or USB stick, no install)
3. Pushing a tag such as `v0.5.1` also attaches both files to a GitHub Release.

## Build on your own Windows PC
Install Node.js 20+, then double-click `desktop\build-windows.bat`. Output: `desktop\dist\`.
To try it without building an installer: `desktop\run-desktop.bat`.

## Notes
- **Unsigned:** Windows SmartScreen will warn ("Windows protected your PC"). Choose *More info -> Run anyway*. A code-signing certificate removes the warning; none is configured.
- `desktop/app/` is generated from the site by `node prepare.js` and is git-ignored.
- External (http/https) links open in your default browser. Menu: Go -> Hub, Learning Studio, AI Harness, Core, WorldForge, Command Builder, Workbench.
- Fonts load from Google Fonts when online; the app works offline without them.
- Tests: `node --test desktop/paths.test.js` (path-traversal protection for the app's `ahaios://` scheme).
