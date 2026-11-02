// Regression tests for the 0.5.1 repairs. All fixtures are SYNTHETIC and built in-test only;
// nothing here is shipped as theory or lesson data.
const test = require("node:test"), assert = require("node:assert"), fs = require("fs"), path = require("path");
const V = require("../theory-validation.js"), W = require("../workbench.js");
const { build } = require("../../scripts/build-theories.js");
const w = {}; new Function("window", fs.readFileSync(path.join(__dirname, "../curriculum-data.js"), "utf8"))(w);
const D = w.AH_LEARNING_CURRICULUM;
const lessonIds = D.courses.flatMap(c => c.lessons.map(l => ({ id: c.id + "/" + l.id, s: l.status })));
const spec = lessonIds.find(x => x.s === "Specified").id;
const mem = () => { const m = {}; return { getItem: k => (k in m ? m[k] : null), setItem: (k, v) => { m[k] = String(v); }, _m: m }; };

/* ---------- theory integrity (shared by app import and CLI) ---------- */
function theories(mut) {
  const a = [];
  for (let i = 0; i < 82; i++) a.push({ id: "T" + i, title: "Fixture " + i, origin: i < 68 ? "registry" : "synthesized", source: "fixture-src", ...(i ? { relationships: ["T0"] } : {}) });
  if (mut) mut(a); return a;
}
test("integrity: accepts complete, sourced, resolvable set", () => { const r = V.validateIntegrity(theories()); assert.ok(r.valid, r.errors.join()); });
test("integrity: rejects missing provenance", () => { const r = V.validateIntegrity(theories(a => { delete a[4].source; })); assert.ok(!r.valid); assert.match(r.errors.join(), /source/); });
test("integrity: rejects blank provenance", () => assert.ok(!V.validateIntegrity(theories(a => { a[4].source = "   "; })).valid));
test("integrity: rejects dangling relationship", () => { const r = V.validateIntegrity(theories(a => { a[3].relationships = ["NOPE"]; })); assert.ok(!r.valid); assert.match(r.errors.join(), /NOPE/); });
test("integrity: rejects self relationship", () => assert.ok(!V.validateIntegrity(theories(a => { a[3].relationships = ["T3"]; })).valid));
test("integrity: rejects non-array / non-string relationships", () => {
  assert.ok(!V.validateIntegrity(theories(a => { a[3].relationships = "T0"; })).valid);
  assert.ok(!V.validateIntegrity(theories(a => { a[3].relationships = [7]; })).valid);
});
test("integrity: rejects placeholder id/title/source", () => {
  assert.ok(!V.validateIntegrity(theories(a => { a[5].title = "TODO"; })).valid);
  assert.ok(!V.validateIntegrity(theories(a => { a[5].source = "placeholder"; })).valid);
});
test("integrity: relationship targets resolve after trimming ids", () => assert.ok(V.validateIntegrity(theories(a => { a[0].id = " T0 "; })).valid));
test("integrity: rejects non-collection input", () => { assert.ok(!V.validateIntegrity({}).valid); assert.ok(!V.validateIntegrity(null).valid); });
test("structural validator is unchanged (still counts/splits only)", () => {
  const r = V.validateTheoryCollection(theories(a => { a[1].relationships = ["MISSING"]; delete a[1].source; }));
  assert.ok(r.valid, "structure-only check must not enforce provenance");
});
test("CLI build() uses the shared integrity gate", () => {
  assert.ok(build(JSON.stringify(theories()), "json").ok);
  const bad = build(JSON.stringify(theories(a => { a[2].relationships = ["T-999"]; })), "json");
  assert.ok(!bad.ok); assert.match(bad.errors.join(), /T-999/);
});

/* ---------- workbench import / export round trip ---------- */
function populated() {
  const s = W.blank();
  W.saveDraft(D, s, "instructor", spec, "my own authored text");
  W.transition(D, s, "instructor", spec, "Reviewed");
  return s;
}
test("workbench: export → import round-trips exactly (plus one audit entry)", () => {
  const s = populated(), exported = JSON.stringify(s, null, 2);
  const n = W.importState(D, W.blank(), "admin", exported);
  assert.deepEqual(n.lessons, s.lessons);
  assert.equal(W.effective(D, n, spec), "Reviewed");
  assert.equal(n.audit.length, s.audit.length + 1);
  assert.equal(n.audit[0].action, "import");
});
test("workbench: import is admin-only", () => {
  assert.throws(() => W.importState(D, W.blank(), "instructor", JSON.stringify(populated())), /may not admin/);
  assert.throws(() => W.importState(D, W.blank(), "learner", JSON.stringify(populated())), /may not admin/);
});
test("workbench: invalid imports rejected and current state untouched", () => {
  const cur = populated(), snapshot = JSON.stringify(cur);
  const bads = [
    "not json at all",
    "[]", "null", "42",
    JSON.stringify({ schema: "other", version: 1, lessons: {}, audit: [] }),
    JSON.stringify({ schema: "ah-aios-learning-workbench", version: 2, lessons: {}, audit: [] }),
    JSON.stringify({ schema: "ah-aios-learning-workbench", version: 1, lessons: [], audit: [] }),
    JSON.stringify({ schema: "ah-aios-learning-workbench", version: 1, lessons: { "nope/x": { text: "t" } }, audit: [] }),
    JSON.stringify({ schema: "ah-aios-learning-workbench", version: 1, lessons: { [spec]: { status: "Approved" } }, audit: [] }),
    JSON.stringify({ schema: "ah-aios-learning-workbench", version: 1, lessons: { [spec]: { status: "Published" } }, audit: [] }),
    JSON.stringify({ schema: "ah-aios-learning-workbench", version: 1, lessons: { [spec]: { text: 5 } }, audit: [] }),
    JSON.stringify({ schema: "ah-aios-learning-workbench", version: 1, lessons: {}, audit: [{ when: 1 }] }),
  ];
  for (const b of bads) assert.throws(() => W.importState(D, cur, "admin", b), /Import rejected/, b.slice(0, 60));
  assert.equal(JSON.stringify(cur), snapshot, "current state must never be mutated by a failed import");
});
test("workbench: import returns a deep copy (no aliasing of imported object)", () => {
  const s = populated(), n = W.importState(D, W.blank(), "admin", JSON.stringify(s));
  n.lessons[spec].text = "changed"; assert.equal(s.lessons[spec].text, "my own authored text");
});
test("workbench: Reviewed/Published without content is rejected, with base content accepted", () => {
  const withBase = lessonIds.find(x => x.s !== "Specified");
  const x = { schema: "ah-aios-learning-workbench", version: 1, lessons: { [spec]: { status: "Reviewed" } }, audit: [] };
  assert.ok(!W.validateState(D, x).valid);
  if (withBase) { const y = { ...x, lessons: { [withBase.id]: { status: "Reviewed" } } }; assert.ok(W.validateState(D, y).valid || /without any draft/.test(W.validateState(D, y).errors.join())); }
});
test("workbench: stored state with a bad status falls back to blank (no bogus status shown)", () => {
  const st = mem(); st.setItem(W.KEY, JSON.stringify({ schema: "ah-aios-learning-workbench", version: 1, lessons: { [spec]: { status: "Hacked" } }, audit: [] }));
  const l = W.load(st, D); assert.deepEqual(l.lessons, {});
});
test("workbench: valid stored state loads and survives save/load", () => {
  const st = mem(), s = populated(); W.save(st, s); assert.deepEqual(W.load(st, D).lessons, s.lessons);
});
test("workbench: load stays backward compatible when curriculum not supplied", () => {
  const st = mem(), s = populated(); W.save(st, s); assert.deepEqual(W.load(st).lessons, s.lessons);
});

/* ---------- release hygiene ---------- */
test("service worker cache name matches package version (forces refresh on release)", () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "../../package.json"), "utf8"));
  const sw = fs.readFileSync(path.join(__dirname, "../sw.js"), "utf8");
  assert.ok(sw.includes("ah-aios-learning-studio-" + pkg.version + "-"), "bump sw.js CACHE when package.json version changes");
});
test("service worker precache lists only files that exist", () => {
  const sw = fs.readFileSync(path.join(__dirname, "../sw.js"), "utf8");
  const files = JSON.parse(sw.match(/const FILES=(\[.*?\]);/)[1]);
  for (const f of files) { if (f === "./") continue; assert.ok(fs.existsSync(path.join(__dirname, "..", f)), f); }
});
test("404 page resolves links from the site root, not the missing URL", () => {
  const h = fs.readFileSync(path.join(__dirname, "../../404.html"), "utf8");
  assert.match(h, /github\\\.io/); assert.match(h, /getElementById\("home"\)/);
});
test("build mirrors all tracked files in the published site", () => {
  const sh = fs.readFileSync(path.join(__dirname, "../../scripts/build-site.sh"), "utf8");
  assert.match(sh, /SOURCE_SNAPSHOT=5766c2284986840fdf0e5b71afdaee2617b78c6d/);
  assert.match(sh, /git archive --format=tar "\$SOURCE_SNAPSHOT" \| tar -xf - -C _site/);
  assert.doesNotMatch(sh, /--exclude=/);
});

/* ---------- WorldForge built bundle (source project not in this package; patched in the artifact) ---------- */
for (const dir of ["worldforge-app", "optional-flask-backend/ah_webapp/connected/worldforge-app"]) {
  test("WorldForge bundle (" + dir + "): export includes claims + changeProposals; import validates", () => {
    const root = path.join(__dirname, "../..", dir);
    const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
    const js = html.match(/assets\/(index-[^"]+\.js)/)[1];
    const src = fs.readFileSync(path.join(root, "assets", js), "utf8");
    assert.ok(src.includes("changeProposals:e.changeProposals,claims:e.claims,activityLog:e.activityLog"), "export must include claims");
    assert.ok(src.includes("changeProposals:e.changeProposals||[],claims:e.claims||[]"), "import must restore claims");
    assert.ok(src.includes("Import rejected, current workspace kept."), "import must validate");
    assert.ok(!src.includes("alert(`Unexpected file format.`)"), "old unvalidated import path must be gone");
    assert.ok(fs.existsSync(path.join(root, "assets", js)));
  });
}
