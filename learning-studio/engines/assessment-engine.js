;(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.AHAssessmentEngine = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const isRecord = value => value !== null && typeof value === "object" && !Array.isArray(value);
  const nonBlank = value => typeof value === "string" && value.trim().length > 0;
  const makeId = () => "attempt-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);

  function gradeKnowledgeCheck(input) {
    if (!isRecord(input) || !nonBlank(input.assessmentId)) throw new TypeError("assessmentId is required.");
    if (!Array.isArray(input.questions) || input.questions.length === 0) throw new TypeError("At least one question is required.");
    if (!isRecord(input.answers)) throw new TypeError("Answers must be an object keyed by question ID.");
    if (!Number.isFinite(input.passMark) || input.passMark < 0 || input.passMark > 100) throw new TypeError("An explicit passMark between 0 and 100 is required.");

    const seen = new Set();
    let answered = 0;
    let correct = 0;
    const questionResults = input.questions.map(question => {
      if (!isRecord(question) || !nonBlank(question.id) || !Array.isArray(question.options) || question.options.length < 2) throw new TypeError("Each question needs an id and at least two options.");
      if (seen.has(question.id)) throw new TypeError("Question IDs must be unique.");
      seen.add(question.id);
      if (!Number.isInteger(question.correctOption) || question.correctOption < 0 || question.correctOption >= question.options.length) throw new TypeError("Question answer key is invalid for " + question.id + ".");
      const supplied = Object.prototype.hasOwnProperty.call(input.answers, question.id);
      const selected = supplied ? input.answers[question.id] : null;
      if (supplied && (!Number.isInteger(selected) || selected < 0 || selected >= question.options.length)) throw new TypeError("Selected option is invalid for " + question.id + ".");
      if (supplied) answered += 1;
      const isCorrect = supplied && selected === question.correctOption;
      if (isCorrect) correct += 1;
      return { questionId: question.id, answered: supplied, correct: isCorrect };
    });
    const complete = answered === input.questions.length;
    const scorePercent = Math.round((correct / input.questions.length) * 10000) / 100;
    return {
      schema: "ah-learning-assessment-attempt",
      version: 1,
      attemptId: nonBlank(input.attemptId) ? input.attemptId : makeId(),
      assessmentId: input.assessmentId.trim(),
      learnerId: nonBlank(input.learnerId) ? input.learnerId.trim() : "local-learner",
      startedAt: input.startedAt || new Date().toISOString(),
      submittedAt: complete ? (input.submittedAt || new Date().toISOString()) : null,
      status: complete ? "graded" : "incomplete",
      answeredCount: answered,
      questionCount: input.questions.length,
      correctCount: correct,
      scorePercent,
      passMark: input.passMark,
      passed: complete ? scorePercent >= input.passMark : null,
      credentialEligible: false,
      results: questionResults
    };
  }

  function scoreRubric(input) {
    if (!isRecord(input) || !nonBlank(input.assessmentId)) throw new TypeError("assessmentId is required.");
    if (!Array.isArray(input.criteria) || input.criteria.length === 0 || !isRecord(input.ratings)) throw new TypeError("Rubric criteria and ratings are required.");
    const seen = new Set();
    let weighted = 0;
    let totalWeight = 0;
    const criteria = input.criteria.map(item => {
      if (!isRecord(item) || !nonBlank(item.id) || !nonBlank(item.title)) throw new TypeError("Each criterion needs an id and title.");
      if (seen.has(item.id)) throw new TypeError("Criterion IDs must be unique.");
      seen.add(item.id);
      const weight = item.weight === undefined ? 1 : item.weight;
      const min = item.minScore === undefined ? 1 : item.minScore;
      const max = item.maxScore === undefined ? 4 : item.maxScore;
      const rating = input.ratings[item.id];
      if (!Number.isFinite(weight) || weight <= 0 || !Number.isFinite(min) || !Number.isFinite(max) || max <= min) throw new TypeError("Criterion scoring configuration is invalid.");
      if (!Number.isFinite(rating) || rating < min || rating > max) throw new TypeError("Missing or invalid rating for " + item.id + ".");
      weighted += ((rating - min) / (max - min)) * 100 * weight;
      totalWeight += weight;
      return { criterionId: item.id, title: item.title, rating, minScore: min, maxScore: max, weight };
    });
    const scorePercent = Math.round((weighted / totalWeight) * 100) / 100;
    const thresholdConfigured = Number.isFinite(input.passMark) && input.passMark >= 0 && input.passMark <= 100;
    return {
      schema: "ah-learning-rubric-result",
      version: 1,
      assessmentId: input.assessmentId,
      scorePercent,
      passMark: thresholdConfigured ? input.passMark : null,
      thresholdResult: thresholdConfigured ? scorePercent >= input.passMark : null,
      status: "scored_pending_human_decision",
      decision: null,
      credentialEligible: false,
      criteria
    };
  }

  return Object.freeze({ gradeKnowledgeCheck, scoreRubric });
});
