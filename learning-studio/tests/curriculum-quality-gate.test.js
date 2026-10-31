import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const source = fs.readFileSync(new URL("../curriculum-data.js", import.meta.url), "utf8");
const curriculum = JSON.parse(source.replace(/^window\.AH_LEARNING_CURRICULUM\s*=\s*/, "").replace(/\n\/\/ Expose the source-traced catalogue under the application runtime name\.[\s\S]*$/, "").replace(/;\s*$/, ""));
const courses = curriculum.courses;
const lessons = courses.flatMap(course => course.lessons);
const requiredFields = [
  "purpose", "outcomes", "prerequisites", "sourceBase", "explanation",
  "workedExample", "guidedPractice", "independentExercise", "knowledgeCheck",
  "assessmentEvidence", "feedback", "safetyBoundary", "references", "reviewStatus"
];

test("curriculum quality gate preserves the 24-course, 96-lesson source structure", () => {
  assert.equal(courses.length, 24);
  assert.equal(new Set(courses.map(course => course.id)).size, 24);
  assert.equal(lessons.length, 96);
  assert.ok(courses.every(course => course.lessons.length === 4));
});

test("domain counts remain 6 Core, 7 AI Harness, 8 WorldForge, and 3 cross-cutting Stewardship", () => {
  const count = domain => courses.filter(course => course.domain === domain).length;
  assert.equal(count("AH-AIOS Core"), 6);
  assert.equal(count("AI Harness"), 7);
  assert.equal(count("WorldForge"), 8);
  assert.equal(count("Human Stewardship"), 3);
});

test("all authored lessons contain every required instructional field", () => {
  const authored = lessons.filter(lesson => lesson.content);
  assert.equal(authored.length, 20);
  for (const lesson of authored) {
    assert.equal(lesson.status, "Authored draft", lesson.id + " status");
    for (const field of requiredFields) {
      const value = lesson.content[field];
      assert.notEqual(value, undefined, lesson.id + " missing " + field);
      assert.notEqual(value, null, lesson.id + " null " + field);
      assert.notEqual(value, "", lesson.id + " empty " + field);
      if (Array.isArray(value)) assert.ok(value.length > 0, lesson.id + " empty array " + field);
    }
    assert.equal(lesson.content.reviewStatus, "Not reviewed", lesson.id + " review status");
    assert.ok(lesson.content.explanation.length >= 200, lesson.id + " explanation too short");
    assert.ok(lesson.content.sourceBase.length > 0, lesson.id + " source base");
    assert.ok(lesson.content.references.length > 0, lesson.id + " references");
  }
});

test("every authored knowledge check has a valid answer index and rationale", () => {
  for (const lesson of lessons.filter(item => item.content)) {
    for (const check of lesson.content.knowledgeCheck) {
      assert.ok(Array.isArray(check.options) && check.options.length >= 2, lesson.id + " options");
      assert.ok(Number.isInteger(check.answer), lesson.id + " answer index");
      assert.ok(check.answer >= 0 && check.answer < check.options.length, lesson.id + " answer range");
      assert.ok(typeof check.rationale === "string" && check.rationale.length > 0, lesson.id + " rationale");
    }
  }
});

test("the other 76 lessons remain specified-only rather than receiving invented content", () => {
  const specified = lessons.filter(lesson => !lesson.content);
  assert.equal(specified.length, 76);
  assert.ok(specified.every(lesson => lesson.status === "Specified"));
});

test("authored drafts are not silently promoted to reviewed or published content", () => {
  assert.ok(courses.every(course => course.publicationStatus === "Not published"));
  assert.ok(lessons.filter(lesson => lesson.content).every(lesson => lesson.content.reviewStatus === "Not reviewed"));
  assert.equal(curriculum.source.status, "SUGGESTION / PROCESS");
});

test("AH-CORE-140 retains its four authored, source-linked drafts without implying review or publication", () => {
  const course = courses.find(item => item.id === "AH-CORE-140");
  assert.ok(course, "AH-CORE-140 exists");
  assert.deepEqual(course.lessons.map(lesson => lesson.title), [
    "What counts as evidence",
    "Audit events and traceability",
    "Verification criteria and reproducibility",
    "Reporting limitations and unresolved results"
  ]);
  assert.ok(course.lessons.every(lesson => lesson.status === "Authored draft" && lesson.content && lesson.content.reviewStatus === "Not reviewed"));
});
