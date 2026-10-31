;(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.AHLearningDataIntegrity = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const isRecord = value => value !== null && typeof value === "object" && !Array.isArray(value);
  const stringEntries = (value, fields) => Array.isArray(value) && value.every(item => isRecord(item) && fields.every(key => typeof item[key] === "string"));
  const uniqueStrings = value => Array.isArray(value) && value.every(item => typeof item === "string" && item.trim()) && new Set(value).size === value.length;

  function validateProgressPackage(value, references = {}) {
    const errors = [];
    if (!isRecord(value)) return { valid: false, errors: ["Progress package must be an object."] };
    if (value.schema !== "ah-aios-learning-progress") errors.push("Unsupported progress schema.");
    if (![1, 2].includes(value.version)) errors.push("Unsupported progress schema version.");
    if (!uniqueStrings(value.completed)) errors.push("completed must contain unique non-empty IDs.");
    if (isRecord(references.moduleIds)) errors.push("moduleIds must be supplied as an array.");
    if (Array.isArray(references.moduleIds) && Array.isArray(value.completed) && value.completed.some(id => !references.moduleIds.includes(id))) errors.push("completed contains an unknown module ID.");
    if (!isRecord(value.checks)) errors.push("checks must be an object.");
    else for (const [id, result] of Object.entries(value.checks)) {
      if (typeof result !== "boolean") errors.push("Check result for " + id + " must be boolean.");
      if (Array.isArray(references.moduleIds) && !references.moduleIds.includes(id)) errors.push("checks contains an unknown module ID: " + id + ".");
    }
    if (value.labs !== undefined && !stringEntries(value.labs, ["kind", "title", "text"])) errors.push("labs contains an invalid submission.");
    if (value.portfolio !== undefined && !stringEntries(value.portfolio, ["title", "text"])) errors.push("portfolio contains an invalid item.");
    if (value.activity !== undefined && !stringEntries(value.activity, ["text", "when"])) errors.push("activity contains an invalid event.");
    if (value.attempts !== undefined && (!Array.isArray(value.attempts) || !value.attempts.every(item =>
      isRecord(item) && typeof item.attemptId === "string" && item.attemptId.trim() &&
      typeof item.assessmentId === "string" && item.assessmentId.trim() &&
      typeof item.status === "string" && item.status.trim() &&
      (item.scorePercent === undefined || (Number.isFinite(item.scorePercent) && item.scorePercent >= 0 && item.scorePercent <= 100))
    ))) errors.push("attempts contains an invalid assessment record.");
    return { valid: errors.length === 0, errors };
  }

  function prepareProgressImport(raw, currentState, references = {}) {
    let parsed = raw;
    if (typeof raw === "string") {
      try { parsed = JSON.parse(raw); }
      catch { return { valid: false, nextState: currentState, errors: ["Import is not valid JSON."] }; }
    }
    const checked = validateProgressPackage(parsed, references);
    if (!checked.valid) return { valid: false, nextState: currentState, errors: checked.errors };
    const defaults = {
      schema: "ah-aios-learning-progress",
      version: 2,
      completed: [],
      checks: {},
      labs: [],
      portfolio: [],
      activity: [],
      attempts: []
    };
    return {
      valid: true,
      nextState: { ...defaults, ...parsed, version: 2, attempts: parsed.attempts || [] },
      errors: []
    };
  }

  function validateLearningGraph(input) {
    const errors = [];
    if (!isRecord(input) || !Array.isArray(input.courses) || !Array.isArray(input.assessments)) {
      return { valid: false, errors: ["Learning graph requires courses and assessments arrays."] };
    }
    const courseIds = new Set();
    const lessonIds = new Set();
    for (const course of input.courses) {
      if (!isRecord(course) || typeof course.id !== "string" || !course.id.trim()) { errors.push("Course has no valid ID."); continue; }
      if (courseIds.has(course.id)) errors.push("Duplicate course ID: " + course.id + ".");
      courseIds.add(course.id);
      if (!Array.isArray(course.lessons)) { errors.push("Course " + course.id + " has no lessons array."); continue; }
      for (const lesson of course.lessons) {
        if (!isRecord(lesson) || typeof lesson.id !== "string" || !lesson.id.trim()) { errors.push("Course " + course.id + " contains a lesson without an ID."); continue; }
        if (lessonIds.has(lesson.id)) errors.push("Duplicate lesson ID: " + lesson.id + ".");
        lessonIds.add(lesson.id);
      }
    }
    const assessmentIds = new Set();
    for (const assessment of input.assessments) {
      if (!isRecord(assessment) || typeof assessment.id !== "string" || !assessment.id.trim()) { errors.push("Assessment has no valid ID."); continue; }
      if (assessmentIds.has(assessment.id)) errors.push("Duplicate assessment ID: " + assessment.id + ".");
      assessmentIds.add(assessment.id);
      if (assessment.courseId && !courseIds.has(assessment.courseId)) errors.push("Assessment " + assessment.id + " references an unknown course.");
      if (assessment.lessonId && !lessonIds.has(assessment.lessonId)) errors.push("Assessment " + assessment.id + " references an unknown lesson.");
    }
    return { valid: errors.length === 0, errors };
  }

  return Object.freeze({ validateProgressPackage, prepareProgressImport, validateLearningGraph });
});
