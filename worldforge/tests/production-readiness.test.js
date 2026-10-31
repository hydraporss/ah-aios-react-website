import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const siteRoot = path.resolve(process.env.WORLDFORGE_SITE_DIR || "public/worldforge/verified-2026-10-28");
const requiredPages = ["index.html", "doctrine.html", "architecture.html", "governance.html", "constitution.html", "explorer.html"];

test("WorldForge package contains every required page", () => {
  for (const file of requiredPages) {
    const target = path.join(siteRoot, file);
    assert.ok(fs.existsSync(target), "Missing required WorldForge page: " + file);
    assert.ok(fs.statSync(target).size > 0, "WorldForge page is empty: " + file);
  }
});

test("WorldForge entry page has production metadata and a usable viewport", () => {
  const html = fs.readFileSync(path.join(siteRoot, "index.html"), "utf8");
  assert.match(html, /<title>[^<]+<\/title>/i);
  assert.match(html, /name="viewport"/i);
  assert.match(html, /href="assets\/site\.css"/i);
  assert.match(html, /src="assets\/site\.js"/i);
  assert.match(html, /id="classic-worldforge-frame"/);
});

test("all static local HTML and CSS references resolve inside the package", () => {
  const files = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(html|css)$/i.test(entry.name)) files.push(full);
    }
  }
  walk(siteRoot);
  const references = [];
  for (const file of files) {
    const source = fs.readFileSync(file, "utf8");
    const patterns = [
      /<(?:a|link|script|img|iframe|source)\b[^>]*\b(?:href|src)=["']([^"']+)["']/gi,
      /url\(\s*["']?([^)"']+)["']?\s*\)/gi
    ];
    for (const pattern of patterns) {
      for (const match of source.matchAll(pattern)) {
        const ref = match[1].trim();
        if (!ref || ref.includes("$" + "{") || /^(?:https?:|mailto:|tel:|data:|javascript:|\/\/)/i.test(ref)) continue;
        if (ref.startsWith("#") || ref.includes("?")) continue;
        references.push({ file, ref });
      }
    }
  }
  const missing = references.filter(({ file, ref }) => {
    const target = path.resolve(path.dirname(file), decodeURIComponent(ref.split("#")[0]));
    return !target.startsWith(siteRoot + path.sep) && target !== siteRoot ? true : !fs.existsSync(target);
  });
  assert.deepEqual(missing.map(({ file, ref }) => path.relative(siteRoot, file) + " -> " + ref), [], "Static relative references must resolve.");
});

test("deployment package excludes the archived ZIP and retains required visual assets", () => {
  assert.equal(fs.existsSync(path.join(siteRoot, "WorldForge-Website-Verified-2026-10-28 (1).zip")), false);
  for (const asset of ["assets/site.css", "assets/site.js", "assets/hero-world.jpg", "assets/tile-governance.jpg"]) {
    assert.ok(fs.existsSync(path.join(siteRoot, asset)), "Missing required asset: " + asset);
  }
});
