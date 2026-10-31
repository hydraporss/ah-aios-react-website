import assert from "node:assert/strict";
import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const pageErrors = [];
page.on("dialog", dialog => dialog.accept());
page.on("pageerror", error => pageErrors.push(error.message));

try {
  await page.goto("http://127.0.0.1:4173/learning-studio/", { waitUntil: "domcontentloaded" });
  await page.locator("#curriculum-roadmap").waitFor({ state: "attached" });
  await page.waitForTimeout(500);
  const diagnostics = await page.evaluate(() => ({
    hasRawCurriculum: !!window.AH_LEARNING_CURRICULUM,
    hasRuntimeCurriculum: !!window.CURRICULUM_DATA,
    scriptUrls: [...document.scripts].map(script => script.src),
    roadmapHtml: document.querySelector("#curriculum-roadmap")?.innerHTML.slice(0, 500),
    appReady: !!document.querySelector("#all-courses")?.children.length
  }));
  if (!diagnostics.hasRuntimeCurriculum || !diagnostics.appReady) {
    throw new Error("Application bootstrap failed: " + JSON.stringify({ diagnostics, pageErrors }));
  }
  assert.ok(await page.locator("#curriculum-roadmap .curriculum-card").count() > 0);
  const courseCount = await page.locator("#all-courses .blueprint-course").count();
  assert.ok(courseCount > 0, "course catalogue should contain at least one record");
  const firstCourseId = await page.locator("#all-courses [data-blueprint-course]").first().getAttribute("data-blueprint-course");
  assert.ok(firstCourseId, "first course should have a stable course identifier");

  await page.locator("#global-search").fill(firstCourseId);
  assert.equal(await page.locator("#all-courses .blueprint-course").count(), 1);
  assert.match(await page.locator("#all-courses").innerText(), new RegExp(firstCourseId));
  await page.locator("#global-search").fill("");
  assert.equal(await page.locator("#all-courses .blueprint-course").count(), courseCount);

  await page.locator("#all-courses [data-blueprint-course]").first().click();
  await page.locator("#modal").waitFor({ state: "visible" });
  assert.match(await page.locator("#modal").innerText(), /Lesson sequence/);
  await page.locator("#modal [data-blueprint-lesson]").first().click();
  await page.locator("#blueprint-work").fill("Browser acceptance test: learner work persists after reload.");
  await page.locator("#save-blueprint-work").click();
  assert.match(await page.locator("#modal").innerText(), /Saved to your local portfolio/);

  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("ah-aios-learning-studio-progress-v2")));
  assert.ok(saved && saved.portfolio.some(item => item.text.includes("Browser acceptance test")));
  await page.reload({ waitUntil: "networkidle" });
  const persisted = await page.evaluate(() => JSON.parse(localStorage.getItem("ah-aios-learning-studio-progress-v2")));
  assert.ok(persisted.portfolio.some(item => item.text.includes("Browser acceptance test")));

  await page.locator("#course-filter").fill("AH-CORE-140");
  await page.locator("#all-courses [data-blueprint-course]").click();
  await page.locator("#modal [data-blueprint-lesson]").first().click();
  assert.match(await page.locator("#modal").innerText(), /What counts as evidence/);
  assert.equal(await page.locator('#modal a[href="https://csrc.nist.gov/pubs/sp/800/53/a/r5/final"]').count(),1);
  await page.locator("#modal-close").click();

  await page.locator("#tutor-start").click();
  await page.locator("#chat-input").fill("governance");
  await page.locator("#chat-form button").click();
  assert.match(await page.locator("#chat-log").innerText(), /governance/i);
  await page.locator("#chat-form button").focus();
  await page.keyboard.press("Tab");
  assert.equal(await page.evaluate(()=>document.activeElement.id),"modal-close","modal Tab navigation should wrap to its close control");
  await page.keyboard.press("Escape");
  assert.equal(await page.evaluate(()=>document.activeElement.id),"tutor-start","closing the modal should restore focus to its opener");

  const theoryFixture = [
    ...Array.from({length:68},(_,i)=>({id:"REG-"+String(i+1).padStart(3,"0"),title:"Registry theory "+(i+1),origin:"registry"})),
    ...Array.from({length:14},(_,i)=>({id:"SYN-"+String(i+1).padStart(3,"0"),title:"Synthesized theory "+(i+1),origin:"synthesized"}))
  ];
  const theoryChooser = page.waitForEvent("filechooser");
  await page.locator("#import-theories").click();
  await (await theoryChooser).setFiles({name:"theories-test.json",mimeType:"application/json",buffer:Buffer.from(JSON.stringify(theoryFixture))});
  await page.waitForFunction(()=>document.querySelector("#theory-status")?.textContent.includes("82 records loaded"));
  const storedTheories = await page.evaluate(()=>JSON.parse(localStorage.getItem("ah-aios-learning-theories-v1")));
  assert.equal(storedTheories.length,82);
  await page.reload({waitUntil:"networkidle"});
  assert.match(await page.locator("#theory-status").innerText(),/82 records loaded/);
  assert.match(await page.locator("#theory-source-status").innerText(),/awaiting authoritative source registry/i);

  assert.equal(pageErrors.length, 0, "browser console page errors: " + pageErrors.join("; "));
  process.stdout.write("Learning Studio browser smoke checks passed: catalogue, search, course/lesson navigation, portfolio save, persistence after reload, local tutor, and no uncaught page errors.\n");
} finally {
  await browser.close();
}
