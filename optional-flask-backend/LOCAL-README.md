# AH-AIOS Local Workbench — Windows startup

This package is assembled from the consolidated Learning Studio repository archive recovered from the connected Notion Library. It preserves the supplied Flask backend and static front-end assets.

## Start the local link

1. Extract the complete ZIP folder (do not open the ZIP and run a single file from inside it).
2. Open the extracted `AH-AIOS-Local-Workbench` folder.
3. Double-click `OPEN-LOCAL-WORKBENCH.bat`.
4. The launcher creates `.venv`, installs the package dependencies, and starts Flask on loopback.
5. Browser opens at **http://127.0.0.1:8080/**. Health check: **http://127.0.0.1:8080/health**.
6. Keep the terminal window open while using the local link. Press Ctrl+C in that window to stop the server.

## What this package changes

- Uses the actual recovered `ah_webapp` code and its static assets.
- Configures Flask to use the package's real `ah_webapp/app/static` directory and the `ah_webapp/templates` directory.
- Adds local compatibility templates for all 22 `render_template` paths found in the recovered Python modules. These are minimal local views, not recovered original template designs.
- Makes imports from the missing `src.wof` package optional. The rest of the Flask application can start without it.
- WorldForge generation endpoints return HTTP 503 with a clear explanation when `src/wof` is absent. Creating a world proposal remains possible, but no fake WorldState is created.
- No Supabase, GitHub, Vercel, Netlify, or production deployment changes are made.

## Important source boundary

The recovered archive did not contain the original `src/wof` implementation. This package does not invent `WorldState`, `WOFGenerator`, `RELATION_TYPES`, or their governance semantics. It keeps the integration disabled until the real source is restored.

The package README's earlier test note was stale: the consolidated ZIP does include `ah_webapp/phase1_vertical_slice.py`. Test execution remains a separate verification step.

## Local-only security

The server binds to `127.0.0.1`, not the public network. The bundled development secret fallback is for local use only. Do not deploy this package without setting secure environment variables, reviewing authentication, and restoring the missing WorldForge source.
