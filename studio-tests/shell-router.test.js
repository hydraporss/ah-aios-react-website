import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { ROUTES, resolveRoute, routeForSection } from "../shell-router.js";

test("shell routes have unique paths and map to real workspace sections", () => {
  const paths = ROUTES.map(route => route.path);
  assert.equal(new Set(paths).size, paths.length);
  for (const route of ROUTES) {
    assert.ok(route.path.startsWith("/"));
    assert.ok(route.section);
    assert.ok(route.title);
    assert.ok(route.description);
    assert.ok(route.objective);
  }
});

test("unknown paths resolve safely to the dashboard", () => {
  assert.equal(resolveRoute("/not-a-real-module").path, "/dashboard");
});

test("all three technical domains have explicit route identities", () => {
  assert.equal(resolveRoute("/domains/core").domain, "core");
  assert.equal(resolveRoute("/domains/harness").domain, "harness");
  assert.equal(resolveRoute("/domains/worldforge").domain, "worldforge");
});

test("legacy section links resolve to the same route registry", () => {
  assert.equal(routeForSection("home").path, "/dashboard");
  assert.equal(routeForSection("paths").path, "/curriculum/domains");
  assert.equal(routeForSection("curriculum-map").path, "/curriculum");
  assert.equal(routeForSection("labs").path, "/practice");
  assert.equal(routeForSection("govern").path, "/stewardship");
  assert.equal(routeForSection("missing-section"), null);
});

test("every registered route targets a section present in the root website", () => {
  const root = new URL("../index.html", import.meta.url);
  const html = readFileSync(fileURLToPath(root), "utf8");
  for (const route of ROUTES) {
    assert.match(html, new RegExp('id="' + route.section + '"'), route.path + " must target an existing section");
  }
});

test("the shared shell exposes the three domains and context panel", () => {
  const root = new URL("../index.html", import.meta.url);
  const html = readFileSync(fileURLToPath(root), "utf8");
  for (const domain of ["all", "core", "harness", "worldforge"]) {
    assert.match(html, new RegExp('option value="' + domain + '"'));
  }
  assert.match(html, /id="context-panel"/);
  assert.match(html, /id="context-toggle"/);
});
