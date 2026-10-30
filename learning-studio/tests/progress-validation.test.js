import test from "node:test";import assert from "node:assert/strict";import fs from "node:fs";import path from "node:path";
const app=fs.readFileSync(new URL("../app.js",import.meta.url),"utf8");
test("app declares nine starter modules",()=>{const n=(app.match(/id:"(?:core|harness|world)-0[1-3]"/g)||[]).length;assert.equal(n,9)});
test("theory import gate enforces 82 records and 68+14 split",()=>{assert.match(app,/arr\.length!==82/);assert.match(app,/registry\.length!==68/);assert.match(app,/synth\.length!==14/)});
test("progress import checks schema and version before replacing state",()=>{assert.match(app,/schema==="ah-aios-learning-progress"/);assert.match(app,/version===1/);assert.match(app,/if\(!validate\(x\)\)throw Error/)});
test("invalid progress import preserves current record",()=>{assert.match(app,/Current progress was preserved/);assert.match(app,/state=x;persist\(\)/)});
test("PWA service worker is registered",()=>{assert.match(app,/serviceWorker\.register\("\.\/sw\.js"\)/)});
