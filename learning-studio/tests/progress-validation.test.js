import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const app=fs.readFileSync(new URL("../app.js",import.meta.url),"utf8");
const html=fs.readFileSync(new URL("../index.html",import.meta.url),"utf8");
const css=fs.readFileSync(new URL("../styles.css",import.meta.url),"utf8");
const ids=[...html.matchAll(/id="([^"]+)"/g)].map(x=>x[1]);
test("nine starter modules are declared",()=>assert.equal((app.match(/id:"(?:core|harness|world)-0[1-3]"/g)||[]).length,9));
test("theory gate enforces 82 records and 68+14 split",()=>{assert.match(app,/a\.length!==82/);assert.match(app,/r\.length!==68/);assert.match(app,/s\.length!==14/)});
test("progress import validates schema and version before replacing state",()=>{assert.match(app,/schema==="ah-aios-learning-progress"/);assert.match(app,/\[1,2\]\.includes\(x\.version\)/);assert.match(app,/if\(!validate\(x\)\)throw Error/)});
test("invalid progress import is rejected without replacing state",()=>assert.match(app,/Existing progress preserved/));
test("course, lab, tutor, portfolio, and profile interactions are wired",()=>{for(const s of ["openCourse(id)","openLab(kind)","tutor-start","#export","#import","#save-profile","#reset-progress"])assert.ok(app.includes(s),s)});
test("all internal navigation links resolve to a page section",()=>{const links=[...html.matchAll(/href="#([^"]+)"/g)].map(x=>x[1]);const missing=[...new Set(links.filter(x=>!ids.includes(x)))];assert.deepEqual(missing,[])});
test("all required dashboard interaction targets exist",()=>{for(const id of ["domain-grid","continue-grid","all-courses","activity","assessment-list","competency-list","cert-list","portfolio-items","theory-list","modal","modal-content"])assert.ok(ids.includes(id),id)});
test("responsive dashboard styles are present",()=>{assert.match(css,/@media\(max-width:560px\)/);assert.match(css,/\.sidebar\.show/);assert.match(css,/\.domain-grid/)});
test("PWA service worker registration exists",()=>assert.match(app,/serviceWorker\.register\("\.\/sw\.js"\)/));

test("3-day sprint section and all 15 task controls exist",()=>{assert.match(html,/id="sprint"/);assert.equal((html.match(/data-sprint=/g)||[]).length,15);for(const day of ["Day 1 — Git & GitHub","Day 2 — Python & AI API","Day 3 — Quality & CI\/CD"])assert.ok(html.includes(day),day)});
test("sprint progress is persisted locally and restored",()=>{assert.match(app,/ah-aios-learning-sprint-v1/);assert.match(app,/localStorage\.setItem\(SPRINT_KEY/);assert.match(app,/renderSprint\(\)/)});
test("sprint security guidance forbids committing credentials",()=>assert.match(html,/Never commit \.env, tokens or keys/));

test("learner profile is reflected in header identity and completion certificates",()=>{assert.match(app,/function syncProfile\(\)/);assert.match(app,/localStorage\.setItem\(PROFILE,learnerName\)/);assert.match(app,/esc\(learnerName\)/);assert.doesNotMatch(app,/\>Alex Rivera\<\/b\>/)});

test("keyboard skip link, named navigation landmarks, and visible focus are provided",()=>{assert.match(html,/class="skip-link" href="#home"/);assert.match(html,/<nav class="topnav" aria-label="Primary navigation">/);assert.match(html,/<aside class="sidebar" id="sidebar" aria-label="Learning navigation">/);assert.match(css,/:focus-visible/)});
test("mobile navigation exposes its expanded state to assistive technology",()=>{assert.match(html,/id="menu-toggle" aria-label="Toggle navigation" aria-controls="sidebar" aria-expanded="false"/);assert.match(app,/button\.setAttribute\("aria-expanded",String\(open\)\)/)});
test("profile heading and avatar reflect the saved learner identity",()=>{assert.match(html,/id="profile-heading"/);assert.match(html,/id="profile-avatar"/);assert.match(app,/heading\.textContent=name/);assert.match(app,/avatar\.textContent=initials/)});
test("reduced-motion preference is respected",()=>assert.match(css,/@media\(prefers-reduced-motion:reduce\)/));

test("PWA cache includes the icon and only removes prior Learning Studio caches",()=>{const sw=fs.readFileSync(new URL("../sw.js",import.meta.url),"utf8");assert.match(sw,/\.\/icon\.svg/);assert.match(sw,/key\.startsWith\("ah-aios-learning-studio-"\)/);assert.doesNotMatch(sw,/keys\.filter\(key=>key!==CACHE\)/)});
