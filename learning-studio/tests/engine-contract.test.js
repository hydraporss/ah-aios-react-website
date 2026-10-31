import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const practice = require("../engines/practice-engine.js");
const assessment = require("../engines/assessment-engine.js");
const integrity = require("../engines/data-integrity.js");

test("practice submission requires a real learner response and stable activity reference", () => {
  assert.throws(() => practice.createSubmission({ activityId: "lab-1", learnerId: "learner-1", response: " " }), /response is required/);
  const result = practice.createSubmission({ submissionId: "sub-1", activityId: "lab-1", learnerId: "learner-1", response: "Completed the bounded workflow." });
  assert.equal(result.status, "submitted_pending_review");
  assert.equal(practice.validateSubmission(result).valid, true);
});

test("practice review requires explicit human reviewer, rubric ratings, and decision", () => {
  const submission = practice.createSubmission({ submissionId: "sub-2", activityId: "lab-2", learnerId: "learner-1", response: "Evidence attached." });
  const review = practice.reviewSubmission({
    submission, reviewerId: "reviewer-1", decision: "revision_required", feedback: "Add a recovery test.",
    criteria: [{ id: "scope", title: "Scope control", weight: 2 }, { id: "evidence", title: "Evidence quality" }],
    ratings: { scope: 3, evidence: 2 }
  });
  assert.equal(review.status, "human_review_recorded");
  assert.equal(review.decision, "revision_required");
  assert.ok(review.scorePercent >= 0 && review.scorePercent <= 100);
  assert.throws(() => practice.reviewSubmission({ submission, decision: "accepted", criteria: [], ratings: {} }), /reviewerId/);
});

test("knowledge check grading records incomplete attempts without inventing a result", () => {
  const result = assessment.gradeKnowledgeCheck({
    assessmentId: "kc-1", attemptId: "attempt-1", passMark: 100,
    questions: [{ id: "q1", options: ["A", "B"], correctOption: 1 }, { id: "q2", options: ["A", "B"], correctOption: 0 }],
    answers: { q1: 1 }
  });
  assert.equal(result.status, "incomplete");
  assert.equal(result.passed, null);
  assert.equal(result.answeredCount, 1);
  assert.equal(result.credentialEligible, false);
});

test("knowledge check grading calculates an explicit score and threshold", () => {
  const result = assessment.gradeKnowledgeCheck({
    assessmentId: "kc-2", attemptId: "attempt-2", passMark: 75,
    questions: [{ id: "q1", options: ["A", "B"], correctOption: 1 }, { id: "q2", options: ["A", "B"], correctOption: 0 }],
    answers: { q1: 1, q2: 1 }
  });
  assert.equal(result.status, "graded");
  assert.equal(result.scorePercent, 50);
  assert.equal(result.passed, false);
});

test("rubric scoring does not infer approval or credential eligibility", () => {
  const result = assessment.scoreRubric({
    assessmentId: "project-1",
    criteria: [{ id: "quality", title: "Quality", weight: 2 }, { id: "trace", title: "Traceability" }],
    ratings: { quality: 4, trace: 3 }
  });
  assert.equal(result.status, "scored_pending_human_decision");
  assert.equal(result.thresholdResult, null);
  assert.equal(result.decision, null);
  assert.equal(result.credentialEligible, false);
});

test("progress import accepts the supported schema and upgrades legacy records safely", () => {
  const current = { schema: "ah-aios-learning-progress", version: 2, completed: ["core-01"] };
  const prepared = integrity.prepareProgressImport({ schema: "ah-aios-learning-progress", version: 1, completed: ["core-01"], checks: {} }, current, { moduleIds: ["core-01"] });
  assert.equal(prepared.valid, true);
  assert.equal(prepared.nextState.version, 2);
  assert.deepEqual(prepared.nextState.attempts, []);
});

test("invalid progress import leaves the existing state object untouched", () => {
  const current = { marker: "preserve-me" };
  const prepared = integrity.prepareProgressImport('{"schema":"ah-aios-learning-progress","version":2,"completed":["unknown"],"checks":{}}', current, { moduleIds: ["core-01"] });
  assert.equal(prepared.valid, false);
  assert.equal(prepared.nextState, current);
  assert.ok(prepared.errors.some(error => error.includes("unknown module ID")));
});

test("malformed JSON and malformed nested records are rejected", () => {
  const current = { marker: "safe" };
  assert.equal(integrity.prepareProgressImport("{", current).nextState, current);
  const result = integrity.validateProgressPackage({
    schema: "ah-aios-learning-progress", version: 2, completed: [], checks: {},
    labs: [{ kind: "lab", title: "Lab", text: "response" }],
    portfolio: [], activity: [], attempts: [{ attemptId: "a", assessmentId: "x", status: "graded", scorePercent: 120 }]
  });
  assert.equal(result.valid, false);
});

test("learning graph rejects duplicate IDs and dangling assessment references", () => {
  const result = integrity.validateLearningGraph({
    courses: [{ id: "c1", lessons: [{ id: "l1" }] }, { id: "c1", lessons: [] }],
    assessments: [{ id: "a1", courseId: "missing", lessonId: "l1" }]
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(error => error.includes("Duplicate course ID")));
  assert.ok(result.errors.some(error => error.includes("unknown course")));
});

import fs from "node:fs";

test("browser application loads engines before its application controller", () => {
  const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const app = fs.readFileSync(new URL("../app.js", import.meta.url), "utf8");
  assert.ok(html.indexOf('src="./engines/data-integrity.js"') < html.indexOf('src="./app.js"'));
  assert.ok(html.indexOf('src="./engines/practice-engine.js"') < html.indexOf('src="./app.js"'));
  assert.ok(html.indexOf('src="./engines/assessment-engine.js"') < html.indexOf('src="./app.js"'));
  assert.match(app, /AHAssessmentEngine\.gradeKnowledgeCheck/);
  assert.match(app, /AHPracticeEngine\.createSubmission/);
  assert.match(app, /AHLearningDataIntegrity\.prepareProgressImport/);
});

test("learner state stores assessment attempts and submitted labs are not marked complete", () => {
  const app = fs.readFileSync(new URL("../app.js", import.meta.url), "utf8");
  assert.match(app, /attempts:\[\]/);
  assert.match(app, /state\.attempts\.unshift\(result\)/);
  const practiceSource = fs.readFileSync(new URL("../engines/practice-engine.js", import.meta.url), "utf8");
  assert.match(practiceSource, /submitted_pending_review/);
  assert.match(app, /status:submission.status/);
  assert.match(app, /Submitted lab for review/);
});
