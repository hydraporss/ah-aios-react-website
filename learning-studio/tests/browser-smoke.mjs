import assert from "node:assert/strict";
import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const pageErrors = [];
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

  await page.locator("#tutor-start").click();
  await page.locator("#chat-input").fill("governance");
  await page.locator("#chat-form button").click();
  assert.match(await page.locator("#chat-log").innerText(), /governance/i);

  await page.locator("#modal-close").click();
  assert.equal(pageErrors.length, 0, "browser console page errors: " + pageErrors.join("; "));
  process.stdout.write("Learning Studio browser smoke checks passed: catalogue, search, course/lesson navigation, portfolio save, persistence after reload, local tutor, and no uncaught page errors.\n");
} finally {
  await browser.close();
}
