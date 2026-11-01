"""Connection layer for the AH-AIOS Local Workbench.

Serves every recovered part from one local link and links them together:

  /hub          Hub page (links to everything below, with live availability)
  /learning/    Learning Studio (static) and its WorldForge archive pages
  /worldforge-app/  AH-AIOS WorldForge (React build)
  /harness/     AI Harness Command Builder (the recovered prompt-builder page)
  /docs/<file>  Architecture specification and Notion product summary
  /              Flask workbench dashboard (Core / WorldForge governance routes)
  /api/connected  JSON status of every connected part

Nothing here promotes status: the hub shows what is present on disk, not whether a
component is verified, deployed, or production-ready.
"""
import html
import re
from pathlib import Path

from flask import Blueprint, Response, abort, jsonify, render_template, send_from_directory

HERE = Path(__file__).parent
LEARNING_DIR = HERE / "connected" / "learning"
WFAPP_DIR = HERE / "connected" / "worldforge-app"
STATIC_DIR = HERE / "app" / "static"
DOCS_DIR = HERE.parent / "docs"

connect_bp = Blueprint("connect", __name__)

DOC_FILES = {
    "LearningStudio-Complete-System-Architecture-Specification.md",
    "notion_product_summary.md",
    "AH-AIOS-README.original.md",
}

_URL_FOR_STATIC = re.compile(r"""\{\{\s*url_for\(\s*['"]static['"]\s*,\s*filename\s*=\s*['"]([^'"]+)['"]\s*\)\s*\}\}""")


def components():
    """Describe each connected part and whether its files are present."""
    def has(path):
        return Path(path).exists()

    return [
        {"id": "hub", "name": "Hub", "url": "/hub", "present": True,
         "note": "This page."},
        {"id": "learning", "name": "Learning Studio", "url": "/learning/",
         "present": has(LEARNING_DIR / "index.html"),
         "note": "Starter curriculum, labs, tutor (local only, no live AI model), progress in browser storage."},
        {"id": "worldforge-app", "name": "AH-AIOS WorldForge (app)", "url": "/worldforge-app/",
         "present": has(WFAPP_DIR / "index.html"),
         "note": "React build (local-first records, relationships, evidence, canon review). Data stays in this browser's localStorage."},
        {"id": "worldforge", "name": "WorldForge Archive", "url": "/learning/worldforge/",
         "present": has(LEARNING_DIR / "worldforge" / "index.html"),
         "note": "Static archive pages and the verified 2026-10-28 website. Not the WorldForge generator."},
        {"id": "harness", "name": "AI Harness Command Builder", "url": "/harness/",
         "present": has(STATIC_DIR / "index.html"),
         "note": "Prototype interface; its own page states the components are not yet implemented."},
        {"id": "core", "name": "AH-AIOS Core Workbench", "url": "/",
         "present": has(HERE / "main.py"),
         "note": "Flask dashboard, worlds, races, governance proposals, admin."},
        {"id": "governance", "name": "Governance Proposals", "url": "/governance/proposals",
         "present": has(HERE / "governance.py"),
         "note": "Proposal and review routes (sign-in required)."},
        {"id": "spec", "name": "Architecture Specification", "url": "/docs/LearningStudio-Complete-System-Architecture-Specification.md",
         "present": has(DOCS_DIR / "LearningStudio-Complete-System-Architecture-Specification.md"),
         "note": "LS-ARCH-WEB-001."},
        {"id": "summary", "name": "Notion Product Summary", "url": "/docs/notion_product_summary.md",
         "present": has(DOCS_DIR / "notion_product_summary.md"),
         "note": "Generated 31 October 2026 from the combined archive."},
    ]


@connect_bp.get("/hub")
def hub():
    return render_template("connect/hub.html", components=components())


@connect_bp.get("/api/connected")
def api_connected():
    wof_src = False
    try:
        from . import wof_integration  # noqa: F401
        wof_src = bool(getattr(wof_integration, "WOF_AVAILABLE", False))
    except Exception:
        pass
    return jsonify({"status": "ok", "components": components(),
                    "worldforge_generator_source_present": wof_src})


# ---- Learning Studio + WorldForge archive (static) ----
@connect_bp.get("/learning")
def learning_noslash():
    return Response(status=302, headers={"Location": "/learning/"})


@connect_bp.get("/learning/", defaults={"path": ""})
@connect_bp.get("/learning/<path:path>")
def learning(path):
    target = (LEARNING_DIR / path).resolve()
    if LEARNING_DIR.resolve() not in target.parents and target != LEARNING_DIR.resolve():
        abort(404)
    if target.is_dir():
        if path and not path.endswith("/"):
            return Response(status=302, headers={"Location": "/learning/" + path + "/"})
        path = (path + "/index.html") if path else "index.html"
    return send_from_directory(LEARNING_DIR, path)


# ---- AH-AIOS WorldForge (React build) ----
_PAGES_BASE = "https://hydraporss.github.io/ah-aios-react-website/worldforge/"
_TEXT_EXT = (".js", ".css", ".html")


@connect_bp.get("/worldforge-app", defaults={"path": ""})
@connect_bp.get("/worldforge-app/", defaults={"path": ""})
@connect_bp.get("/worldforge-app/<path:path>")
def worldforge_app(path):
    """Serve the React build under /worldforge-app/.

    The build was made for a site root, so absolute /assets/ and /worldforge.svg
    are re-based, and its two links to the GitHub Pages copy of the archive
    (cover image and archive link) are pointed at the archive bundled here.
    The files on disk are left exactly as built.
    """
    path = path or "index.html"
    target = (WFAPP_DIR / path).resolve()
    if WFAPP_DIR.resolve() not in target.parents or not target.is_file():
        abort(404)
    if target.suffix not in _TEXT_EXT:
        return send_from_directory(WFAPP_DIR, path)
    text = target.read_text(encoding="utf-8")
    text = text.replace(_PAGES_BASE, "/learning/worldforge/")
    if target.name == "index.html":
        text = (text.replace('"/assets/', '"/worldforge-app/assets/')
                    .replace('"/worldforge.svg', '"/worldforge-app/worldforge.svg'))
    mime = {".js": "text/javascript", ".css": "text/css", ".html": "text/html"}[target.suffix]
    return Response(text, mimetype=mime)


# ---- AI Harness Command Builder ----
@connect_bp.get("/harness", defaults={"path": ""})
@connect_bp.get("/harness/", defaults={"path": ""})
@connect_bp.get("/harness/<path:path>")
def harness(path):
    if path in ("", "index.html"):
        source = (STATIC_DIR / "index.html").read_text(encoding="utf-8")
        # The recovered page uses url_for('static', ...) but also contains literal
        # {{variable}} tags for the prompt builder, so it must not go through Jinja.
        page = _URL_FOR_STATIC.sub(lambda m: "/static/" + m.group(1), source)
        return Response(page, mimetype="text/html")
    return send_from_directory(STATIC_DIR, path)


# ---- Documents ----
@connect_bp.get("/docs/<name>")
def docs(name):
    if name not in DOC_FILES or not (DOCS_DIR / name).exists():
        abort(404)
    text = (DOCS_DIR / name).read_text(encoding="utf-8")
    body = ("<!doctype html><meta charset=utf-8><meta name=viewport content='width=device-width,initial-scale=1'>"
            "<title>" + html.escape(name) + "</title><body style=\"margin:0;background:#0b0e14;color:#edf1f7;font:14px/1.6 system-ui\">"
            "<div style='padding:12px 24px;background:#111722;border-bottom:1px solid #30394a'><a style='color:#e4c985' href='/hub'>&larr; Hub</a> &nbsp; <b style='color:#d6b66f'>"
            + html.escape(name) + "</b> </div>"
            "<pre style='white-space:pre-wrap;overflow-wrap:anywhere;max-width:960px;margin:24px auto;padding:0 20px'>"
            + html.escape(text) + "</pre>")
    return Response(body, mimetype="text/html")
