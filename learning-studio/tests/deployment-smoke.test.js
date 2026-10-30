import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = path => fs.readFileSync(new URL("../" + path, import.meta.url), "utf8");
const html = read("index.html");
const sw = read("sw.js");
const manifest = JSON.parse(read("manifest.webmanifest"));
const pkg = JSON.parse(read("package.json"));

test("deployment candidate has a consistent 0.3.0 application version", () => {
  assert.equal(pkg.version, "0.3.0");
  assert.match(sw, /ah-aios-learning-studio-0\.3\.0-v1/);
});

test("HTML runtime asset references are relative and resolve to packaged files", () => {
  const refs = [
    ...html.matchAll(/(?:src|href)="\.\/([^"]+)"/g)
  ].map(match => match[1]).filter(name => !name.startsWith("#"));
  for (const name of refs) {
    assert.ok(fs.existsSync(new URL("../" + name, import.meta.url)), "missing local asset: " + name);
  }
  assert.match(html, /<html lang="en">/);
  assert.match(html, /name="viewport"/);
});

test("PWA manifest stays scoped to its installation directory", () => {
  assert.equal(manifest.start_url, "./index.html");
  assert.equal(manifest.scope, "./");
  assert.equal(manifest.display, "standalone");
  assert.ok(manifest.icons.some(icon => icon.src === "./icon.svg"));
});

test("service worker precaches the complete application shell and isolates its cache namespace", () => {
  for (const asset of ["./", "./index.html", "./styles.css", "./app.js", "./manifest.webmanifest", "./icon.svg", "./curriculum-data.js"]) {
    assert.ok(sw.includes(JSON.stringify(asset)), "service worker missing " + asset);
  }
  assert.match(sw, /key\.startsWith\("ah-aios-learning-studio-"/);
  assert.match(sw, /key!==CACHE/);
});

test("deployment does not require a root-relative asset path", () => {
  assert.doesNotMatch(html, /(?:src|href)="\/(?!\/)/);
});
