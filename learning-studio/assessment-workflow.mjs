/**
 * AH-AIOS Learning Studio — Assessment Evidence Workflow
 * Version 1.0.0
 *
 * This module implements formative evidence capture and self-review.
 * It deliberately does not issue competency decisions or credentials.
 * Formal assessment is blocked until a course-specific rubric with
 * published mandatory criteria and thresholds exists.
 */

export const ASSESSMENT_WORKFLOW_SCHEMA = "ahls.assessment-workflow";
export const ASSESSMENT_WORKFLOW_VERSION = 1;
export const ASSESSMENT_STORAGE_KEY = "ah-aios-learning-assessment-workflow-v1";

const clone = value => structuredClone(value);
const now = () => new Date().toISOString();
const makeId = () => globalThis.crypto?.randomUUID?.()
  ?? `ahls-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const isObject = value => !!value && typeof value === "object" && !Array.isArray(value);
const nonEmpty = value => typeof value === "string" && value.trim().length > 0;

function validateRevision(revision, expectedNumber) {
  return isObject(revision)
    && revision.revision === expectedNumber
    && nonEmpty(revision.response)
    && nonEmpty(revision.contribution)
    && nonEmpty(revision.toolsMethods)
    && typeof revision.aiAssistanceUsed === "boolean"
    && Array.isArray(revision.artifactRefs)
    && revision.artifactRefs.every(nonEmpty)
    && nonEmpty(revision.savedAt);
}

function validateEvent(event) {
  return isObject(event)
    && nonEmpty(event.id)
    && nonEmpty(event.type)
    && nonEmpty(event.actor)
    && nonEmpty(event.at)
    && isObject(event.details);
}

function validateFeedback(feedback, dimensionIds) {
  if (!isObject(feedback) || !nonEmpty(feedback.summary)
      || feedback.reviewType !== "formative_self_review"
      || feedback.reviewerIdentityVerified !== false
      || feedback.competencyDecision !== null
      || feedback.credentialEligible !== false
      || !Array.isArray(feedback.ratings)) return false;

  if (!feedback.ratings.every(isObject)) return false;

  const ids = feedback.ratings.map(item => item.dimensionId);
  if (ids.length !== dimensionIds.length || new Set(ids).size !== ids.length) return false;
  if (!dimensionIds.every(id => ids.includes(id))) return false;

  return feedback.ratings.every(item =>
    isObject(item)
    && Number.isInteger(item.score)
    && item.score >= 1
    && item.score <= 4
    && nonEmpty(item.evidence)
    && nonEmpty(item.comment)
  );
}

export class AssessmentWorkflow {
  constructor({
    storage = globalThis.localStorage,
    courseIds = [],
    dimensions = [],
    storageKey = ASSESSMENT_STORAGE_KEY
  } = {}) {
    if (!storage) throw new Error("Assessment storage provider is unavailable.");
    if (!Array.isArray(courseIds)) throw new Error("Course IDs must be an array.");
    if (!Array.isArray(dimensions) || dimensions.length === 0) {
      throw new Error("The common assessment dimensions are required.");
    }

    this.storage = storage;
    this.storageKey = storageKey;
    this.courseIds = new Set(courseIds);
    this.dimensions = dimensions.map(d => ({
      id: String(d.id),
      name: String(d.name),
      description: String(d.description ?? "")
    }));

    if (this.dimensions.some(d => !nonEmpty(d.id) || !nonEmpty(d.name))
        || new Set(this.dimensions.map(d => d.id)).size !== this.dimensions.length) {
      throw new Error("Assessment dimensions must have unique IDs and names.");
    }

    this.submissions = this.load();
  }

  validateSubmission(record) {
    if (!isObject(record)) return { valid: false, errors: ["Submission must be an object."] };

    const errors = [];
    if (!nonEmpty(record.id)) errors.push("Missing submission ID.");
    if (!nonEmpty(record.learnerId)) errors.push("Missing learner ID.");
    if (!nonEmpty(record.courseId)) errors.push("Missing course ID.");
    if (this.courseIds.size && !this.courseIds.has(record.courseId)) {
      errors.push("Submission references an unknown course.");
    }
    if (!nonEmpty(record.assessmentTitle)) errors.push("Missing assessment title.");
    if (!nonEmpty(record.competency)) errors.push("Missing competency.");
    if (!["draft", "formative_submitted", "feedback_recorded", "revision_requested", "appealed"].includes(record.status)) {
      errors.push("Invalid submission status.");
    }
    if (!Array.isArray(record.revisions) || record.revisions.length === 0) {
      errors.push("Submission requires revision history.");
    } else if (!record.revisions.every((revision, index) => validateRevision(revision, index + 1))) {
      errors.push("Invalid or non-sequential revision history.");
    }
    if (!Array.isArray(record.events) || !record.events.every(validateEvent)) {
      errors.push("Invalid audit event history.");
    }
    if (Array.isArray(record.events)) {
      const validEventIds = record.events.filter(isObject).map(event => event.id);
      if (new Set(validEventIds).size !== validEventIds.length) {
        errors.push("Duplicate audit event IDs.");
      }
    }
    if (record.status === "feedback_recorded" || record.status === "revision_requested" || record.status === "appealed") {
      if (!validateFeedback(record.feedback, this.dimensions.map(d => d.id))) {
        errors.push("Formative feedback is incomplete or invalid.");
      }
    }
    if (record.formalAssessment !== false || record.competencyDecision !== null || record.credentialEligible !== false) {
      errors.push("This workflow cannot assert formal assessment, competency, or credential eligibility.");
    }

    return { valid: errors.length === 0, errors };
  }

  validateCollection(records) {
    if (!Array.isArray(records)) return { valid: false, errors: ["Submissions must be an array."] };
    const errors = [];
    const ids = records.map(record => record?.id);
    if (ids.some(id => !nonEmpty(id)) || new Set(ids).size !== ids.length) {
      errors.push("Submission IDs must be present and unique.");
    }
    records.forEach((record, index) => {
      const result = this.validateSubmission(record);
      result.errors.forEach(error => errors.push(`Record ${index + 1}: ${error}`));
    });
    return { valid: errors.length === 0, errors };
  }

  load() {
    const raw = this.storage.getItem(this.storageKey);
    if (raw === null) return [];

    let envelope;
    try {
      envelope = JSON.parse(raw);
    } catch {
      throw new Error("Assessment history contains invalid JSON; existing data was not overwritten.");
    }

    if (envelope?.schema !== ASSESSMENT_WORKFLOW_SCHEMA
        || envelope?.version !== ASSESSMENT_WORKFLOW_VERSION
        || !Array.isArray(envelope.submissions)) {
      throw new Error("Assessment history has an unsupported schema; existing data was not overwritten.");
    }

    const validation = this.validateCollection(envelope.submissions);
    if (!validation.valid) {
      throw new Error(`Assessment history failed integrity validation: ${validation.errors.join(" ")}`);
    }

    return clone(envelope.submissions);
  }

  persist(candidate = this.submissions) {
    const validation = this.validateCollection(candidate);
    if (!validation.valid) {
      throw new Error(`Assessment write rejected: ${validation.errors.join(" ")}`);
    }

    const previous = this.storage.getItem(this.storageKey);
    const envelope = {
      schema: ASSESSMENT_WORKFLOW_SCHEMA,
      version: ASSESSMENT_WORKFLOW_VERSION,
      updatedAt: now(),
      submissions: clone(candidate)
    };
    const serialized = JSON.stringify(envelope);

    try {
      this.storage.setItem(this.storageKey, serialized);
      const readBack = this.storage.getItem(this.storageKey);
      if (readBack !== serialized) throw new Error("Storage read-back mismatch.");
      const parsed = JSON.parse(readBack);
      const verified = this.validateCollection(parsed.submissions);
      if (parsed.schema !== ASSESSMENT_WORKFLOW_SCHEMA
          || parsed.version !== ASSESSMENT_WORKFLOW_VERSION
          || !verified.valid) {
        throw new Error("Persisted assessment data failed verification.");
      }
      this.submissions = clone(candidate);
      return { success: true, count: candidate.length, updatedAt: envelope.updatedAt };
    } catch (error) {
      if (previous === null) this.storage.removeItem(this.storageKey);
      else this.storage.setItem(this.storageKey, previous);
      throw new Error(`Assessment persistence failed; previous data restored: ${error.message}`);
    }
  }

  addEvent(record, type, actor, details = {}) {
    record.events.push({ id: makeId(), type, actor, at: now(), details: clone(details) });
    record.updatedAt = now();
  }

  createDraft({
    learnerId,
    courseId,
    assessmentTitle,
    competency,
    response,
    contribution,
    toolsMethods,
    aiAssistanceUsed = false,
    aiAssistanceDisclosure = "",
    artifactRefs = [],
    reflection = ""
  }) {
    if (!nonEmpty(learnerId) || !nonEmpty(courseId) || !nonEmpty(assessmentTitle) || !nonEmpty(competency)) {
      throw new Error("Learner, course, assessment title, and competency are required.");
    }
    if (this.courseIds.size && !this.courseIds.has(courseId)) {
      throw new Error("Unknown course ID.");
    }
    if (!Array.isArray(artifactRefs) || !artifactRefs.every(nonEmpty)) {
      throw new Error("Artifact references must be non-empty strings.");
    }

    const revision = {
      revision: 1,
      response: String(response ?? "").trim(),
      contribution: String(contribution ?? "").trim(),
      toolsMethods: String(toolsMethods ?? "").trim(),
      aiAssistanceUsed: Boolean(aiAssistanceUsed),
      aiAssistanceDisclosure: String(aiAssistanceDisclosure ?? "").trim(),
      artifactRefs: [...new Set(artifactRefs.map(value => value.trim()))],
      reflection: String(reflection ?? "").trim(),
      savedAt: now()
    };

    const record = {
      id: makeId(),
      schema: ASSESSMENT_WORKFLOW_SCHEMA,
      version: ASSESSMENT_WORKFLOW_VERSION,
      learnerId: learnerId.trim(),
      courseId,
      assessmentTitle: assessmentTitle.trim(),
      competency: competency.trim(),
      status: "draft",
      formalAssessment: false,
      competencyDecision: null,
      credentialEligible: false,
      formalAssessmentBlocker: "No published course-specific rubric and minimum thresholds are configured.",
      revisions: [revision],
      feedback: null,
      appeal: null,
      events: [],
      createdAt: now(),
      updatedAt: now()
    };

    this.addEvent(record, "draft_created", learnerId, { courseId, assessmentTitle });
    this.persist([...this.submissions, record]);
    return clone(record);
  }

  updateDraft(submissionId, patch) {
    const record = this.submissions.find(item => item.id === submissionId);
    if (!record) throw new Error("Submission not found.");
    if (record.status !== "draft") throw new Error("Only draft submissions can be edited.");

    const current = record.revisions.at(-1);
    const next = {
      ...current,
      response: patch.response === undefined ? current.response : String(patch.response).trim(),
      contribution: patch.contribution === undefined ? current.contribution : String(patch.contribution).trim(),
      toolsMethods: patch.toolsMethods === undefined ? current.toolsMethods : String(patch.toolsMethods).trim(),
      aiAssistanceUsed: patch.aiAssistanceUsed === undefined ? current.aiAssistanceUsed : Boolean(patch.aiAssistanceUsed),
      aiAssistanceDisclosure: patch.aiAssistanceDisclosure === undefined ? current.aiAssistanceDisclosure : String(patch.aiAssistanceDisclosure).trim(),
      artifactRefs: patch.artifactRefs === undefined ? current.artifactRefs : [...new Set(patch.artifactRefs.map(value => String(value).trim()))],
      reflection: patch.reflection === undefined ? current.reflection : String(patch.reflection).trim(),
      revision: current.revision,
      savedAt: now()
    };

    const candidate = this.submissions.map(item => item.id === submissionId
      ? { ...item, revisions: [...item.revisions.slice(0, -1), next], updatedAt: now() }
      : item);
    const updated = candidate.find(item => item.id === submissionId);
    this.addEvent(updated, "draft_updated", record.learnerId, { revision: next.revision });
    this.persist(candidate);
    return clone(updated);
  }

  submitForFormativeReview(submissionId) {
    const record = this.submissions.find(item => item.id === submissionId);
    if (!record) throw new Error("Submission not found.");
    if (record.status !== "draft") throw new Error("Only a draft can be submitted.");

    const latest = record.revisions.at(-1);
    if (latest.response.length < 20 || latest.contribution.length < 10 || latest.toolsMethods.length < 3) {
      throw new Error("Add a substantive response, learner-contribution statement, and tools/methods before submitting.");
    }

    const candidate = this.submissions.map(item => item.id === submissionId
      ? { ...item, status: "formative_submitted", submittedAt: now(), updatedAt: now() }
      : item);
    const updated = candidate.find(item => item.id === submissionId);
    this.addEvent(updated, "formative_submission_created", record.learnerId, {
      revision: latest.revision,
      formalAssessment: false
    });
    this.persist(candidate);
    return clone(updated);
  }

  recordSelfReview(submissionId, { summary, ratings }) {
    const record = this.submissions.find(item => item.id === submissionId);
    if (!record) throw new Error("Submission not found.");
    if (record.status !== "formative_submitted") {
      throw new Error("Self-review requires a formative submission.");
    }
    if (!nonEmpty(summary) || !Array.isArray(ratings)) {
      throw new Error("A review summary and dimension ratings are required.");
    }

    if (!ratings.every(isObject)) {
      throw new Error("Every dimension rating must be a valid object.");
    }

    const dimensionIds = this.dimensions.map(d => d.id);
    const ids = ratings.map(rating => rating.dimensionId);
    if (ids.length !== dimensionIds.length || new Set(ids).size !== ids.length
        || !dimensionIds.every(id => ids.includes(id))) {
      throw new Error("Every common assessment dimension must be reviewed exactly once.");
    }

    const normalizedRatings = ratings.map(rating => ({
      dimensionId: rating.dimensionId,
      score: Number(rating.score),
      evidence: String(rating.evidence ?? "").trim(),
      comment: String(rating.comment ?? "").trim()
    }));

    if (!normalizedRatings.every(item =>
      Number.isInteger(item.score) && item.score >= 1 && item.score <= 4
      && nonEmpty(item.evidence) && nonEmpty(item.comment)
    )) {
      throw new Error("Every rating needs a score from 1–4, supporting evidence, and a comment.");
    }

    const feedback = {
      reviewType: "formative_self_review",
      reviewerLabel: "Learner self-review",
      reviewerIdentityVerified: false,
      summary: summary.trim(),
      ratings: normalizedRatings,
      competencyDecision: null,
      credentialEligible: false,
      recordedAt: now()
    };

    const candidate = this.submissions.map(item => item.id === submissionId
      ? { ...item, status: "feedback_recorded", feedback, updatedAt: now() }
      : item);
    const updated = candidate.find(item => item.id === submissionId);
    this.addEvent(updated, "formative_self_review_recorded", record.learnerId, {
      ratingCount: normalizedRatings.length,
      competencyDecision: null
    });
    this.persist(candidate);
    return clone(updated);
  }

  requestRevision(submissionId, { reason, requiredChanges }) {
    const record = this.submissions.find(item => item.id === submissionId);
    if (!record) throw new Error("Submission not found.");
    if (record.status !== "feedback_recorded") throw new Error("Revision can only be requested after feedback.");
    if (!nonEmpty(reason) || !nonEmpty(requiredChanges)) {
      throw new Error("Revision reason and required changes are required.");
    }

    const candidate = this.submissions.map(item => item.id === submissionId
      ? { ...item, status: "revision_requested", revisionRequest: {
          reason: reason.trim(),
          requiredChanges: requiredChanges.trim(),
          requestedAt: now()
        }, updatedAt: now() }
      : item);
    const updated = candidate.find(item => item.id === submissionId);
    this.addEvent(updated, "revision_requested", record.learnerId, {
      reason: reason.trim(),
      requiredChanges: requiredChanges.trim()
    });
    this.persist(candidate);
    return clone(updated);
  }

  reviseSubmission(submissionId, patch) {
    const record = this.submissions.find(item => item.id === submissionId);
    if (!record) throw new Error("Submission not found.");
    if (record.status !== "revision_requested") {
      throw new Error("A revision can only be added after a revision request.");
    }

    const previous = record.revisions.at(-1);
    const revision = {
      revision: previous.revision + 1,
      response: patch.response === undefined ? previous.response : String(patch.response).trim(),
      contribution: patch.contribution === undefined ? previous.contribution : String(patch.contribution).trim(),
      toolsMethods: patch.toolsMethods === undefined ? previous.toolsMethods : String(patch.toolsMethods).trim(),
      aiAssistanceUsed: patch.aiAssistanceUsed === undefined ? previous.aiAssistanceUsed : Boolean(patch.aiAssistanceUsed),
      aiAssistanceDisclosure: patch.aiAssistanceDisclosure === undefined ? previous.aiAssistanceDisclosure : String(patch.aiAssistanceDisclosure).trim(),
      artifactRefs: patch.artifactRefs === undefined ? previous.artifactRefs : [...new Set(patch.artifactRefs.map(value => String(value).trim()))],
      reflection: patch.reflection === undefined ? previous.reflection : String(patch.reflection).trim(),
      savedAt: now()
    };

    const candidate = this.submissions.map(item => item.id === submissionId
      ? {
          ...item,
          revisions: [...item.revisions, revision],
          status: "draft",
          feedback: null,
          revisionRequest: null,
          updatedAt: now()
        }
      : item);
    const updated = candidate.find(item => item.id === submissionId);
    this.addEvent(updated, "revision_added", record.learnerId, {
      revision: revision.revision,
      previousRevisionPreserved: true
    });
    this.persist(candidate);
    return clone(updated);
  }

  submitAppeal(submissionId, reason) {
    const record = this.submissions.find(item => item.id === submissionId);
    if (!record) throw new Error("Submission not found.");
    if (!["feedback_recorded", "revision_requested"].includes(record.status)) {
      throw new Error("An appeal requires recorded formative feedback.");
    }
    if (!nonEmpty(reason)) throw new Error("Appeal reason is required.");

    const candidate = this.submissions.map(item => item.id === submissionId
      ? {
          ...item,
          status: "appealed",
          appeal: { reason: reason.trim(), submittedAt: now(), outcome: null },
          updatedAt: now()
        }
      : item);
    const updated = candidate.find(item => item.id === submissionId);
    this.addEvent(updated, "appeal_submitted", record.learnerId, {
      reason: reason.trim(),
      outcome: null
    });
    this.persist(candidate);
    return clone(updated);
  }

  getFormalReadiness(courseId) {
    return {
      available: false,
      courseId,
      reason: "No published course-specific rubric, mandatory criteria, and minimum thresholds are configured.",
      commonFrameworkAvailable: this.dimensions.length > 0,
      commonFrameworkIsNotCourseRubric: true
    };
  }

  getSubmission(submissionId) {
    const record = this.submissions.find(item => item.id === submissionId);
    return record ? clone(record) : null;
  }

  listSubmissions({ learnerId, courseId, status } = {}) {
    return this.submissions
      .filter(item =>
        (!learnerId || item.learnerId === learnerId)
        && (!courseId || item.courseId === courseId)
        && (!status || item.status === status)
      )
      .map(clone);
  }

  exportBackup() {
    return {
      format: "AHLS_ASSESSMENT_WORKFLOW",
      formatVersion: ASSESSMENT_WORKFLOW_VERSION,
      exportedAt: now(),
      submissions: clone(this.submissions)
    };
  }

  validateBackup(backup) {
    if (!isObject(backup) || backup.format !== "AHLS_ASSESSMENT_WORKFLOW"
        || backup.formatVersion !== ASSESSMENT_WORKFLOW_VERSION) {
      return { valid: false, errors: ["Unsupported assessment backup format or version."] };
    }
    return this.validateCollection(backup.submissions);
  }

  importBackup(backup) {
    const validation = this.validateBackup(backup);
    if (!validation.valid) {
      throw new Error(`Assessment backup rejected: ${validation.errors.join(" ")}`);
    }

    const existingIds = new Set(this.submissions.map(item => item.id));
    if (backup.submissions.some(item => existingIds.has(item.id))) {
      throw new Error("Assessment backup contains existing submission IDs; import stopped to prevent overwrite.");
    }

    const candidate = [...this.submissions, ...clone(backup.submissions)];
    this.persist(candidate);
    return { success: true, importedCount: backup.submissions.length };
  }
}
