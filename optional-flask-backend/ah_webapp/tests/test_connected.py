"""Link-level checks for the connection layer: every hub link and every internal link
on the connected pages must resolve. Passing means these requests were observed to return
success; it says nothing about content verification or production readiness."""
import re
import pytest


@pytest.fixture
def client(app):
    return app.test_client()


def _internal_links(html):
    for m in re.finditer(r'''href\s*=\s*["']([^"']+)["']''', html):
        u = m.group(1)
        if u.startswith(("http", "mailto:", "javascript:", "#", "data:")) or "{{" in u or "${" in u:
            continue
        yield u.split("#")[0]


def test_hub_and_components_resolve(client):
    r = client.get("/hub")
    assert r.status_code == 200
    data = client.get("/api/connected").get_json()
    assert data["status"] == "ok"
    for c in data["components"]:
        assert c["present"], c
        resp = client.get(c["url"], follow_redirects=True)
        assert resp.status_code in (200, 302, 401), (c["url"], resp.status_code)


@pytest.mark.parametrize("start", ["/hub", "/learning/", "/learning/worldforge/", "/worldforge-app/", "/harness/",
                                   "/docs/notion_product_summary.md"])
def test_internal_links_from_pages(client, start):
    seen, queue, bad = set(), [start], []
    while queue:
        url = queue.pop()
        if url in seen:
            continue
        seen.add(url)
        r = client.get(url, follow_redirects=True)
        if r.status_code >= 400:
            bad.append((url, r.status_code)); continue
        if "text/html" in r.content_type:
            base = url.rsplit("/", 1)[0] + "/" if not url.endswith("/") else url
            for u in _internal_links(r.get_data(as_text=True)):
                if u.startswith("/"):
                    t = u
                elif u == "":
                    continue
                else:
                    from urllib.parse import urljoin
                    t = urljoin(url if url.endswith("/") or "." in url.rsplit("/", 1)[-1] else url + "/", u)
                if t.startswith(("/auth", "/admin", "/worlds", "/races", "/governance", "/artifacts", "/audit", "/archive")):
                    continue  # login-protected Flask routes are covered by the existing tests
                queue.append(t)
    assert not bad, bad


def test_harness_keeps_literal_variable_tags(client):
    html = client.get("/harness/").get_data(as_text=True)
    assert "{{claim_id}}" in html and "{{ url_for" not in html
    assert client.get("/static/css/style.css").status_code == 200
    assert client.get("/static/js/prompt-builder.js").status_code == 200


def test_worldforge_app_is_rebased_and_local(client):
    html = client.get("/worldforge-app/").get_data(as_text=True)
    assets = re.findall(r'(?:src|href)="(/worldforge-app/assets/[^"]+)"', html)
    assert len(assets) == 2 and "\"/assets/" not in html
    for a in assets:
        r = client.get(a)
        assert r.status_code == 200
        assert "hydraporss.github.io" not in r.get_data(as_text=True)
    assert client.get("/worldforge-app/worldforge.svg").status_code == 200
    assert client.get("/worldforge-app/../connect.py").status_code == 404
