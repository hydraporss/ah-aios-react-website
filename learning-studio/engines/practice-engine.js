;(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.AHPracticeEngine = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const DECISIONS = new Set(["accepted", "revision_required", "rejected"]);
  const isRecord = value => value !== null && typeof value === "object" && !Array.isArray(value);
  const nonBlank = value => typeof value === "string" && value.trim().length > 0;
  const makeId = () => "psub-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);

  function validateSubmission(value) {
    const errors = [];
    if (!isRecord(value)) return { valid: false, errors: ["Submission must be an object."] };
    for (const key of ["submissionId", "activityId", "learnerId", "response", "submittedAt", "status"]) {
      if (!nonBlank(value[key])) errors.push(key + " is required.");
    }
    if (value.schema !== "ah-learning-practice-submission") errors.push("Unsupported practice submission schema.");
    if (value.version !== 1) errors.push("Unsupported practice submission version.");
    if (value.evidence !== undefined && (!Array.isArray(value.evidence) || !value.evidence.every(item =>
      isRecord(item) && nonBlank(item.kind) && nonBlank(item.reference)
    ))) errors.push("Evidence must contain kind and reference for every item.");
    if (value.submittedAt && Number.isNaN(Date.parse(value.submittedAt))) errors.push("submittedAt must be a valid date.");
    return { valid: errors.length === 0, errors };
  }

  function createSubmission(input) {
    if (!isRecord(input)) throw new TypeError("Submission input must be an object.");
    const submission = {
      schema: "ah-learning-practice-submission",
      version: 1,
      submissionId: nonBlank(input.submissionId) ? input.submissionId.trim() : makeId(),
      activityId: nonBlank(input.activityId) ? input.activityId.trim() : "",
      learnerId: nonBlank(input.learnerId) ? input.learnerId.trim() : "",
      response: typeof input.response === "string" ? input.response.trim() : "",
      evidence: Array.isArray(input.evidence) ? input.evidence.map(item => ({ ...item })) : [],
      submittedAt: input.submittedAt || new Date().toISOString(),
      status: "submitted_pending_review"
    };
    const checked = validateSubmission(submission);
    if (!checked.valid) throw new TypeError(checked.errors.join(" "));
    return submission;
  }

  function reviewSubmission(input) {
    if (!isRecord(input) || !isRecord(input.submission)) throw new TypeError("A submission is required.");
    const submissionCheck = validateSubmission(input.submission);
    if (!submissionCheck.valid) throw new TypeError(submissionCheck.errors.join(" "));
    if (!nonBlank(input.reviewerId)) throw new TypeError("A reviewerId is required for a human review.");
    if (!DECISIONS.has(input.decision)) throw new TypeError("A valid human review decision is required.");
    if (!Array.isArray(input.criteria) || input.criteria.length === 0) throw new TypeError("At least one rubric criterion is required.");
    if (!isRecord(input.ratings)) throw new TypeError("Criterion ratings are required.");

    const seen = new Set();
    let weighted = 0;
    let totalWeight = 0;
    const results = input.criteria.map(criterion => {
      if (!isRecord(criterion) || !nonBlank(criterion.id) || !nonBlank(criterion.title)) throw new TypeError("Each rubric criterion needs an id and title.");
      if (seen.has(criterion.id)) throw new TypeError("Rubric criterion IDs must be unique.");
      seen.add(criterion.id);
      const weight = criterion.weight === undefined ? 1 : criterion.weight;
      const min = criterion.minScore === undefined ? 1 : criterion.minScore;
      const max = criterion.maxScore === undefined ? 4 : criterion.maxScore;
      const rating = input.ratings[criterion.id];
      if (!Number.isFinite(weight) || weight <= 0 || !Number.isFinite(min) || !Number.isFinite(max) || max <= min) throw new TypeError("Rubric weights and score bounds are invalid.");
      if (!Number.isFinite(rating) || rating < min || rating > max) throw new TypeError("A valid rating is required for " + criterion.id + ".");
      weighted += ((rating - min) / (max - min)) * 100 * weight;
      totalWeight += weight;
      return { criterionId: criterion.id, title: criterion.title, rating, minScore: min, maxScore: max, weight };
    });
    return {
      schema: "ah-learning-practice-review",
      version: 1,
      submissionId: input.submission.submissionId,
      reviewerId: input.reviewerId.trim(),
      reviewedAt: input.reviewedAt || new Date().toISOString(),
      decision: input.decision,
      scorePercent: Math.round((weighted / totalWeight) * 100) / 100,
      feedback: typeof input.feedback === "string" ? input.feedback.trim() : "",
      criteria: results,
      status: "human_review_recorded"
    };
  }

  return Object.freeze({ createSubmission, validateSubmission, reviewSubmission });
});
