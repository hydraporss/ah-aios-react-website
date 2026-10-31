import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { fileURLToPath } from "node:url";

const read = path => readFileSync(fileURLToPath(new URL(path, import.meta.url)), "utf8");
function loadCurriculum() {
  const sandbox = { window: {} };
  runInNewContext(read("../curriculum-data.js"), sandbox);
  return sandbox.window.AH_LEARNING_CURRICULUM;
}

test("canonical learning programme contains 24 courses and 96 lesson units", () => {
  const data = loadCurriculum();
  assert.equal(data.courses.length, 24);
  assert.equal(data.courses.reduce((sum, course) => sum + course.lessons.length, 0), 96);
  assert.ok(data.courses.every(course => course.lessons.length === 4));
});

test("curriculum preserves three technical domains and cross-cutting stewardship", () => {
  const data = loadCurriculum();
  const domains = new Set(data.courses.map(course => course.domain));
  assert.deepEqual([...domains].sort(), ["AH-AIOS Core", "AI Harness", "Human Stewardship", "WorldForge"].sort());
  assert.equal(data.courses.filter(course => course.domain === "AH-AIOS Core").length, 6);
  assert.equal(data.courses.filter(course => course.domain === "AI Harness").length, 7);
  assert.equal(data.courses.filter(course => course.domain === "WorldForge").length, 8);
  assert.equal(data.courses.filter(course => course.domain === "Human Stewardship").length, 3);
});

test("course and lesson identifiers are unique and every lesson retains a status", () => {
  const data = loadCurriculum();
  const courseIds = data.courses.map(course => course.id);
  const lessonIds = data.courses.flatMap(course => course.lessons.map(lesson => lesson.id));
  assert.equal(new Set(courseIds).size, courseIds.length);
  assert.equal(new Set(lessonIds).size, lessonIds.length);
  assert.ok(data.courses.every(course => course.lessons.every(lesson => typeof lesson.status === "string" && lesson.status.length > 0)));
});

test("authored lesson drafts retain review boundaries and source lineage", () => {
  const data = loadCurriculum();
  const authored = data.courses.flatMap(course => course.lessons.filter(lesson => lesson.content));
  assert.ok(authored.length > 0);
  for (const lesson of authored) {
    assert.ok(lesson.content.status);
    assert.ok(lesson.content.reviewStatus);
    assert.ok(Array.isArray(lesson.content.references));
    assert.ok(lesson.content.references.length > 0);
  }
});

test("curriculum cards and domain selector are wired to real filtering handlers", () => {
  const app = read("../app.js");
  const router = read("../shell-router.js");
  assert.match(app, /data-curriculum-domain/);
  assert.match(app, /submit-blueprint-check/);
  assert.match(app, /Practice result:/);
  assert.match(app, /learning-studio:domain-change/);
  assert.match(router, /learning-studio:domain-change/);
  assert.match(router, /selectedDomain/);
});
