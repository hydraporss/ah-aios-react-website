import test from "node:test";
import assert from "node:assert/strict";

import { AssessmentWorkflow } from "../assessment-workflow.mjs";

class MemoryStorage {
  data = new Map();
  getItem(key) { return this.data.has(key) ? this.data.get(key) : null; }
  setItem(key, value) { this.data.set(key, String(value)); }
  removeItem(key) { this.data.delete(key); }
}

const dimensions = [
  ["accuracy", "Accuracy", "Technical and conceptual correctness"],
  ["traceability", "Traceability", "Sources, inputs, decisions, and versions are identifiable"],
  ["completeness", "Completeness", "Required elements, edge cases, and limitations are addressed"],
  ["reasoning", "Reasoning", "Assumptions, alternatives, and uncertainty are explicit"],
  ["verification", "Verification", "Outcomes are tested against stated criteria"],
  ["stewardship", "Stewardship", "Authority, protected assets, privacy, and change discipline are respected"],
  ["communication", "Communication", "Results and limitations are clearly explained"]
].map(([id, name, description]) => ({ id, name, description }));

const makeWorkflow = (storage = new MemoryStorage()) => ({
  storage,
  engine: new AssessmentWorkflow({
    storage,
    courseIds: ["AH-CORE-100", "AH-HAR-100"],
    dimensions
  })
});

const validDraft = {
  learnerId: "LOCAL-LEARNER",
  courseId: "AH-CORE-100",
  assessmentTitle: "Governance evidence exercise",
  competency: "Evidence-based governance review",
  response: "I reviewed the proposed claim, traced its source, and documented the missing approval evidence.",
  contribution: "I authored the analysis and identified the evidence gaps.",
  toolsMethods: "Source comparison, structured review, and manual verification.",
  aiAssistanceUsed: false,
  artifactRefs: ["local:portfolio/governance-review"],
  reflection: "I need to distinguish source presence from claim validation."
};

function validRatings() {
  return dimensions.map((dimension, index) => ({
    dimensionId: dimension.id,
    score: index % 4 + 1,
    evidence: `Evidence for ${dimension.name}: a concrete example from the submitted work.`,
    comment: `Self-review note for ${dimension.name}.`
  }));
}

test("creates a local assessment evidence draft with explicit non-credential boundaries", () => {
  const { engine } = makeWorkflow();
  const record = engine.createDraft(validDraft);

  assert.equal(record.status, "draft");
  assert.equal(record.formalAssessment, false);
  assert.equal(record.competencyDecision, null);
  assert.equal(record.credentialEligible, false);
  assert.equal(record.revisions.length, 1);
  assert.equal(engine.listSubmissions().length, 1);
});

test("rejects a submission that references an unknown course", () => {
  const { engine } = makeWorkflow();
  assert.throws(
    () => engine.createDraft({ ...validDraft, courseId: "UNKNOWN-COURSE" }),
    /Unknown course ID/
  );
});

test("blocks formative submission when the evidence is too thin", () => {
  const { engine } = makeWorkflow();
  const record = engine.createDraft({
    ...validDraft,
    response: "Short response",
    contribution: "I did it.",
    toolsMethods: "AI"
  });

  assert.throws(
    () => engine.submitForFormativeReview(record.id),
    /substantive response/
  );
  assert.equal(engine.getSubmission(record.id).status, "draft");
});

test("submits evidence for formative review without claiming formal assessment", () => {
  const { engine } = makeWorkflow();
  const draft = engine.createDraft(validDraft);
  const submitted = engine.submitForFormativeReview(draft.id);

  assert.equal(submitted.status, "formative_submitted");
  assert.equal(submitted.formalAssessment, false);
  assert.equal(submitted.competencyDecision, null);
  assert.equal(submitted.credentialEligible, false);
  assert.equal(engine.getFormalReadiness("AH-CORE-100").available, false);
});

test("requires every common rubric rating to include score, evidence, and comments", () => {
  const { engine } = makeWorkflow();
  const draft = engine.createDraft(validDraft);
  engine.submitForFormativeReview(draft.id);

  const incomplete = validRatings();
  incomplete[0].evidence = "";

  assert.throws(
    () => engine.recordSelfReview(draft.id, {
      summary: "A useful self-review.",
      ratings: incomplete
    }),
    /score from 1–4, supporting evidence, and a comment/
  );
});

test("records formative self-review without producing a competency decision", () => {
  const { engine } = makeWorkflow();
  const draft = engine.createDraft(validDraft);
  engine.submitForFormativeReview(draft.id);

  const reviewed = engine.recordSelfReview(draft.id, {
    summary: "The work is traceable, but the verification evidence could be more specific.",
    ratings: validRatings()
  });

  assert.equal(reviewed.status, "feedback_recorded");
  assert.equal(reviewed.feedback.reviewType, "formative_self_review");
  assert.equal(reviewed.feedback.reviewerIdentityVerified, false);
  assert.equal(reviewed.feedback.ratings.length, 7);
  assert.equal(reviewed.feedback.competencyDecision, null);
  assert.equal(reviewed.credentialEligible, false);
});

test("preserves prior revisions when a requested revision is submitted", () => {
  const { engine } = makeWorkflow();
  const draft = engine.createDraft(validDraft);
  engine.submitForFormativeReview(draft.id);
  engine.recordSelfReview(draft.id, {
    summary: "Add a clearer explanation of the evidence verification method.",
    ratings: validRatings()
  });
  engine.requestRevision(draft.id, {
    reason: "Verification evidence needs more detail.",
    requiredChanges: "Add the exact checks performed and their observed results."
  });

  const revised = engine.reviseSubmission(draft.id, {
    response: validDraft.response + " I then repeated the checks and recorded the observed result."
  });

  assert.equal(revised.status, "draft");
  assert.equal(revised.revisions.length, 2);
  assert.equal(revised.revisions[0].response, validDraft.response);
  assert.match(revised.revisions[1].response, /repeated the checks/);
  assert.ok(revised.events.some(event => event.type === "revision_added"));
});

test("records an appeal as an unresolved event rather than inventing an outcome", () => {
  const { engine } = makeWorkflow();
  const draft = engine.createDraft(validDraft);
  engine.submitForFormativeReview(draft.id);
  engine.recordSelfReview(draft.id, {
    summary: "Review completed.",
    ratings: validRatings()
  });

  const appealed = engine.submitAppeal(draft.id, "I believe the evidence for traceability was overlooked.");

  assert.equal(appealed.status, "appealed");
  assert.equal(appealed.appeal.outcome, null);
  assert.equal(appealed.competencyDecision, null);
  assert.ok(appealed.events.some(event => event.type === "appeal_submitted"));
});

test("exports and imports assessment records without overwriting duplicate IDs", () => {
  const first = makeWorkflow();
  const draft = first.engine.createDraft(validDraft);
  const backup = first.engine.exportBackup();

  const second = makeWorkflow();
  assert.deepEqual(second.engine.importBackup(backup), {
    success: true,
    importedCount: 1
  });
  assert.equal(second.engine.getSubmission(draft.id).id, draft.id);

  assert.throws(
    () => second.engine.importBackup(backup),
    /existing submission IDs/
  );
  assert.equal(second.engine.listSubmissions().length, 1);
});

test("refuses to load corrupted persisted assessment data without resetting it", () => {
  const storage = new MemoryStorage();
  const key = "ah-aios-learning-assessment-workflow-v1";
  storage.setItem(key, "{invalid-json");

  assert.throws(
    () => new AssessmentWorkflow({ storage, courseIds: ["AH-CORE-100"], dimensions }),
    /invalid JSON/
  );
  assert.equal(storage.getItem(key), "{invalid-json");
});


test("rejects malformed nested feedback and audit entries without crashing validation", () => {
  const storage = new MemoryStorage();
  const { engine } = makeWorkflow(storage);
  const draft = engine.createDraft(validDraft);
  engine.submitForFormativeReview(draft.id);
  engine.recordSelfReview(draft.id, {
    summary: "A complete formative self-review.",
    ratings: validRatings()
  });

  const backup = engine.exportBackup();
  backup.submissions[0].feedback.ratings[0] = null;
  backup.submissions[0].events.push(null);
  storage.setItem("ah-aios-learning-assessment-workflow-v1", JSON.stringify(backup));

  assert.throws(
    () => new AssessmentWorkflow({ storage, courseIds: ["AH-CORE-100", "AH-HAR-100"], dimensions }),
    /unsupported schema|integrity validation/
  );
  assert.equal(storage.getItem("ah-aios-learning-assessment-workflow-v1"), JSON.stringify(backup));
});

test("rejects a backup containing an invalid competency or credential claim", () => {
  const { engine } = makeWorkflow();
  const draft = engine.createDraft(validDraft);
  const backup = engine.exportBackup();
  backup.submissions[0].competencyDecision = "passed";

  assert.throws(
    () => engine.importBackup(backup),
    /cannot assert formal assessment/
  );
  assert.equal(engine.getSubmission(draft.id).id, draft.id);
});
