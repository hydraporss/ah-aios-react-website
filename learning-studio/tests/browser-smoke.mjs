import assert from "node:assert/strict";
import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const pageErrors = [];
page.on("pageerror", error => pageErrors.push(error.message));

try {
  await page.goto("http://127.0.0.1:4173/learning-studio/", { waitUntil: "domcontentloaded" });
  await page.locator("#curriculum-roadmap").waitFor();
  assert.match(await page.locator("#curriculum-roadmap").innerText(), /24 courses/);
  assert.match(await page.locator("#curriculum-roadmap").innerText(), /96 lesson units/);
  assert.equal(await page.locator("#all-courses .blueprint-course").count(), 24);

  await page.locator("#global-search").fill("AH-CORE-140");
  assert.equal(await page.locator("#all-courses .blueprint-course").count(), 1);
  assert.match(await page.locator("#all-courses").innerText(), /Audit, Evidence, and Verification/);
  await page.locator("#global-search").fill("");
  assert.equal(await page.locator("#all-courses .blueprint-course").count(), 24);

  await page.locator("#all-courses [data-blueprint-course]").first().click();
  await page.locator("#modal").waitFor({ state: "visible" });
  assert.match(await page.locator("#modal").innerText(), /Lesson sequence/);
  await page.locator("#modal [data-blueprint-lesson]").first().click();
  await page.locator("#blueprint-work").fill("Browser acceptance test: learner work persists after reload.");
  await page.locator("#save-blueprint-work").click();
  assert.match(await page.locator("#modal").innerText(), /Saved to your local portfolio/);

  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("ah-aios-learning-progress-v2")));
  assert.ok(saved && saved.portfolio.some(item => item.text.includes("Browser acceptance test")));
  await page.reload({ waitUntil: "networkidle" });
  const persisted = await page.evaluate(() => JSON.parse(localStorage.getItem("ah-aios-learning-progress-v2")));
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
