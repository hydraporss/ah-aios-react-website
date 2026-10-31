import { AssessmentWorkflow } from "./assessment-workflow.mjs";

const source = window.AH_LEARNING_CURRICULUM;
const root = document.querySelector("#assessment-workspace");

if (source && root) {
  const courses = source.courses ?? [];
  const framework = source.assessmentFramework ?? {};
  const dimensions = (framework.dimensions ?? []).map(([name, description]) => ({
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    name,
    description
  }));

  const engine = new AssessmentWorkflow({
    storage: window.localStorage,
    courseIds: courses.map(course => course.id),
    dimensions
  });

  const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);

  const courseOptions = courses.map(course =>
    '<option value="' + esc(course.id) + '">' +
    esc(course.id + " — " + course.title) + "</option>"
  ).join("");

  root.innerHTML = `
    <div class="assessment-workspace-card">
      <div class="assessment-workspace-heading">
        <div>
          <p class="eyebrow">LEARNER EVIDENCE WORKSPACE</p>
          <h3>Assessment Evidence & Formative Review</h3>
          <p>Prepare work, preserve revisions, and evaluate evidence against the shared learning dimensions.</p>
        </div>
        <div class="assessment-data-actions">
          <button class="outline-btn" id="assessment-export" type="button">Export assessment backup</button>
          <label class="outline-btn assessment-import-label">Import backup
            <input id="assessment-import" type="file" accept="application/json" hidden>
          </label>
        </div>
      </div>
      <div class="notice assessment-boundary">
        <b>Assessment boundary</b>
        <p>Formative submissions and learner self-reviews are supported. Formal competency decisions and credentials remain unavailable until a course-specific rubric, mandatory criteria, and minimum thresholds are approved and published. The common seven-dimension framework does not establish those thresholds.</p>
        <span class="status-pill">Formal assessment not configured</span>
      </div>
      <div class="assessment-workspace-grid">
        <form id="assessment-draft-form" class="assessment-form">
          <h4>Create an evidence draft</h4>
          <label>Course
            <select id="assessment-course" required>${courseOptions}</select>
          </label>
          <label>Assessment / task title
            <input id="assessment-title" required maxlength="180" placeholder="e.g. Evidence trace and governance review">
          </label>
          <label>Competency being demonstrated
            <input id="assessment-competency" required maxlength="240" placeholder="Describe the capability being demonstrated">
          </label>
          <label>Your response / work summary
            <textarea id="assessment-response" required rows="5" placeholder="Describe what you did, the decisions made, and the result."></textarea>
          </label>
          <label>Your contribution
            <textarea id="assessment-contribution" required rows="3" placeholder="Identify the work you personally completed."></textarea>
          </label>
          <label>Tools and methods
            <textarea id="assessment-tools" required rows="2" placeholder="List tools, methods, and verification steps."></textarea>
          </label>
          <label>Artifact references (one URL or local reference per line)
            <textarea id="assessment-artifacts" rows="2" placeholder="Optional links or portfolio references"></textarea>
          </label>
          <label class="assessment-check-row"><input id="assessment-ai-used" type="checkbox"> AI assistance was used</label>
          <label>AI assistance disclosure
            <textarea id="assessment-ai-disclosure" rows="2" placeholder="If used, explain where and how."></textarea>
          </label>
          <label>Reflection and limitations
            <textarea id="assessment-reflection" rows="3" placeholder="What remains uncertain, incomplete, or worth improving?"></textarea>
          </label>
          <button class="primary-btn" type="submit">Save evidence draft</button>
          <p id="assessment-feedback" class="assessment-feedback" role="status" aria-live="polite"></p>
        </form>
        <section class="assessment-submissions-panel" aria-labelledby="assessment-submissions-title">
          <h4 id="assessment-submissions-title">Your assessment records</h4>
          <p class="muted">Records are stored in this browser. Export a backup before clearing site data or changing devices.</p>
          <div id="assessment-submissions"></div>
        </section>
      </div>
    </div>
  `;

  const feedback = message => {
    const node = root.querySelector("#assessment-feedback");
    if (node) node.textContent = message;
  };

  const downloadBackup = () => {
    const blob = new Blob([JSON.stringify(engine.exportBackup(), null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ah-aios-learning-assessment-backup.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const ratingForm = record => `
    <details class="assessment-review-details">
      <summary>Complete formative self-review</summary>
      <form data-assessment-review="${esc(record.id)}">
        <label>Overall reflection
          <textarea name="summary" required rows="3" placeholder="Summarize strengths, gaps, and next steps."></textarea>
        </label>
        ${dimensions.map(dimension => `
          <fieldset class="assessment-rating-field">
            <legend>${esc(dimension.name)}</legend>
            <p>${esc(dimension.description)}</p>
            <label>Self-rating
              <select name="score-${esc(dimension.id)}" required>
                <option value="">Select rating</option>
                <option value="1">1 — Insufficient</option>
                <option value="2">2 — Developing</option>
                <option value="3">3 — Competent</option>
                <option value="4">4 — Strong</option>
              </select>
            </label>
            <label>Evidence
              <textarea name="evidence-${esc(dimension.id)}" required rows="2" placeholder="What specific work supports this rating?"></textarea>
            </label>
            <label>Comment
              <textarea name="comment-${esc(dimension.id)}" required rows="2" placeholder="Explain the rating and what could improve."></textarea>
            </label>
          </fieldset>
        `).join("")}
        <button class="primary-btn" type="submit">Record formative self-review</button>
      </form>
    </details>
  `;

  const revisionForm = record => `
    <details class="assessment-review-details">
      <summary>Prepare requested revision</summary>
      <form data-assessment-revision="${esc(record.id)}">
        <label>Revised response
          <textarea name="response" required rows="5">${esc(record.revisions.at(-1).response)}</textarea>
        </label>
        <label>Updated contribution
          <textarea name="contribution" required rows="3">${esc(record.revisions.at(-1).contribution)}</textarea>
        </label>
        <label>Updated tools and methods
          <textarea name="toolsMethods" required rows="2">${esc(record.revisions.at(-1).toolsMethods)}</textarea>
        </label>
        <label class="assessment-check-row"><input name="aiAssistanceUsed" type="checkbox" ${record.revisions.at(-1).aiAssistanceUsed ? "checked" : ""}> AI assistance was used</label>
        <label>AI assistance disclosure
          <textarea name="aiAssistanceDisclosure" rows="2">${esc(record.revisions.at(-1).aiAssistanceDisclosure)}</textarea>
        </label>
        <label>Artifact references (one per line)
          <textarea name="artifactRefs" rows="2">${esc(record.revisions.at(-1).artifactRefs.join("\n"))}</textarea>
        </label>
        <button class="primary-btn" type="submit">Save new revision</button>
      </form>
    </details>
  `;

  const renderSubmissions = () => {
    const records = engine.listSubmissions();
    const list = root.querySelector("#assessment-submissions");

    if (!records.length) {
      list.innerHTML = '<p class="assessment-empty">No assessment evidence has been saved yet.</p>';
      return;
    }

    list.innerHTML = records.slice().reverse().map(record => {
      const course = courses.find(item => item.id === record.courseId);
      const latest = record.revisions.at(-1);
      const feedbackHtml = record.feedback ? `
        <div class="assessment-feedback-record">
          <b>Formative self-review · not a competency decision</b>
          <p>${esc(record.feedback.summary)}</p>
          <ul>${record.feedback.ratings.map(rating => {
            const dimension = dimensions.find(item => item.id === rating.dimensionId);
            return '<li><b>' + esc(dimension?.name ?? rating.dimensionId) +
              ' — ' + rating.score + '/4</b><br>' + esc(rating.evidence) +
              '<br><span>' + esc(rating.comment) + '</span></li>';
          }).join("")}</ul>
        </div>
      ` : "";

      let actions = "";
      if (record.status === "draft") {
        actions = '<button class="outline-btn" data-assessment-action="submit" data-id="' + esc(record.id) + '">Submit for formative self-review</button>';
      } else if (record.status === "formative_submitted") {
        actions = ratingForm(record);
      } else if (record.status === "feedback_recorded") {
        actions = `
          <details class="assessment-review-details">
            <summary>Request a revision</summary>
            <form data-assessment-request-revision="${esc(record.id)}">
              <label>Reason <textarea name="reason" required rows="2"></textarea></label>
              <label>Required changes <textarea name="requiredChanges" required rows="2"></textarea></label>
              <button class="outline-btn" type="submit">Record revision request</button>
            </form>
          </details>
          <details class="assessment-review-details">
            <summary>Appeal formative feedback</summary>
            <form data-assessment-appeal="${esc(record.id)}">
              <label>Appeal reason <textarea name="reason" required rows="2"></textarea></label>
              <button class="outline-btn" type="submit">Record appeal</button>
            </form>
          </details>
        `;
      } else if (record.status === "revision_requested") {
        actions = revisionForm(record) + `
          <details class="assessment-review-details">
            <summary>Appeal formative feedback</summary>
            <form data-assessment-appeal="${esc(record.id)}">
              <label>Appeal reason <textarea name="reason" required rows="2"></textarea></label>
              <button class="outline-btn" type="submit">Record appeal</button>
            </form>
          </details>
        `;
      } else if (record.status === "appealed") {
        actions = '<p class="muted">Appeal recorded. No appeal outcome is asserted by this local prototype.</p>';
      }

      return `
        <article class="assessment-record-card">
          <div class="assessment-record-top">
            <span class="status-pill">${esc(record.status.replaceAll("_", " "))}</span>
            <small>${esc(record.courseId)}</small>
          </div>
          <h5>${esc(record.assessmentTitle)}</h5>
          <p>${esc(course?.title ?? record.courseId)} · ${esc(record.competency)}</p>
          <p class="assessment-record-summary">${esc(latest.response)}</p>
          <small>Revision ${latest.revision} · ${esc(latest.savedAt)}</small>
          ${record.revisionRequest ? '<p><b>Revision requested:</b> ' + esc(record.revisionRequest.requiredChanges) + '</p>' : ""}
          ${record.appeal ? '<p><b>Appeal:</b> ' + esc(record.appeal.reason) + '</p>' : ""}
          ${feedbackHtml}
          <p class="assessment-noncredential-note">Formative record only. No formal competency or credential decision.</p>
          ${actions}
        </article>
      `;
    }).join("");
  };

  root.querySelector("#assessment-draft-form").addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    const courseId = form.querySelector("#assessment-course").value;
    const course = courses.find(item => item.id === courseId);
    try {
      const record = engine.createDraft({
        learnerId: "LOCAL-LEARNER",
        courseId,
        assessmentTitle: form.querySelector("#assessment-title").value.trim(),
        competency: form.querySelector("#assessment-competency").value.trim(),
        response: form.querySelector("#assessment-response").value.trim(),
        contribution: form.querySelector("#assessment-contribution").value.trim(),
        toolsMethods: form.querySelector("#assessment-tools").value.trim(),
        artifactRefs: form.querySelector("#assessment-artifacts").value.split("\n").map(value => value.trim()).filter(Boolean),
        aiAssistanceUsed: form.querySelector("#assessment-ai-used").checked,
        aiAssistanceDisclosure: form.querySelector("#assessment-ai-disclosure").value.trim(),
        reflection: form.querySelector("#assessment-reflection").value.trim()
      });
      feedback("Evidence draft saved. You can now submit it for formative self-review.");
      form.querySelector("#assessment-title").value = (course?.title ?? courseId) + " — Evidence Submission";
      form.querySelector("#assessment-competency").value = course?.outcome ?? course?.assessment ?? "";
      form.querySelector("#assessment-response").value = "";
      form.querySelector("#assessment-contribution").value = "";
      form.querySelector("#assessment-tools").value = "";
      form.querySelector("#assessment-artifacts").value = "";
      form.querySelector("#assessment-ai-used").checked = false;
      form.querySelector("#assessment-ai-disclosure").value = "";
      form.querySelector("#assessment-reflection").value = "";
      renderSubmissions();
      root.querySelector('[data-id="' + record.id + '"]')?.scrollIntoView({ block: "nearest" });
    } catch (error) {
      feedback(error.message);
    }
  });

  root.addEventListener("click", event => {
    const button = event.target.closest("[data-assessment-action]");
    if (!button) return;
    try {
      if (button.dataset.assessmentAction === "submit") {
        engine.submitForFormativeReview(button.dataset.id);
        feedback("Evidence submitted for formative self-review. No formal grade or competency decision is created.");
        renderSubmissions();
      }
    } catch (error) {
      feedback(error.message);
    }
  });

  root.addEventListener("submit", event => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    try {
      if (form.matches("[data-assessment-review]")) {
        event.preventDefault();
        const ratings = dimensions.map(dimension => ({
          dimensionId: dimension.id,
          score: Number(form.elements["score-" + dimension.id].value),
          evidence: form.elements["evidence-" + dimension.id].value.trim(),
          comment: form.elements["comment-" + dimension.id].value.trim()
        }));
        engine.recordSelfReview(form.dataset.assessmentReview, {
          summary: form.elements.summary.value.trim(),
          ratings
        });
        feedback("Formative self-review saved. This is not a competency decision.");
        renderSubmissions();
      } else if (form.matches("[data-assessment-request-revision]")) {
        event.preventDefault();
        engine.requestRevision(form.dataset.assessmentRequestRevision, {
          reason: form.elements.reason.value.trim(),
          requiredChanges: form.elements.requiredChanges.value.trim()
        });
        feedback("Revision request recorded; previous evidence and review history were preserved.");
        renderSubmissions();
      } else if (form.matches("[data-assessment-revision]")) {
        event.preventDefault();
        engine.reviseSubmission(form.dataset.assessmentRevision, {
          response: form.elements.response.value.trim(),
          contribution: form.elements.contribution.value.trim(),
          toolsMethods: form.elements.toolsMethods.value.trim(),
          aiAssistanceUsed: form.elements.aiAssistanceUsed.checked,
          aiAssistanceDisclosure: form.elements.aiAssistanceDisclosure.value.trim(),
          artifactRefs: form.elements.artifactRefs.value.split("\n").map(value => value.trim()).filter(Boolean)
        });
        feedback("New revision saved. The earlier submission remains in the record.");
        renderSubmissions();
      } else if (form.matches("[data-assessment-appeal]")) {
        event.preventDefault();
        engine.submitAppeal(form.dataset.assessmentAppeal, form.elements.reason.value.trim());
        feedback("Appeal recorded. Its outcome remains unresolved until a separate review process exists.");
        renderSubmissions();
      }
    } catch (error) {
      event.preventDefault();
      feedback(error.message);
    }
  });

  root.querySelector("#assessment-export").addEventListener("click", () => {
    try {
      downloadBackup();
      feedback("Assessment backup exported.");
    } catch (error) {
      feedback(error.message);
    }
  });

  root.querySelector("#assessment-import").addEventListener("change", async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const backup = JSON.parse(await file.text());
      const result = engine.importBackup(backup);
      feedback("Imported " + result.importedCount + " assessment record(s). Existing records were not overwritten.");
      renderSubmissions();
    } catch (error) {
      feedback("Import rejected: " + error.message);
    } finally {
      event.target.value = "";
    }
  });

  const firstCourse = courses[0];
  if (firstCourse) {
    root.querySelector("#assessment-title").value = firstCourse.title + " — Evidence Submission";
    root.querySelector("#assessment-competency").value = firstCourse.outcome ?? firstCourse.assessment ?? "";
  }

  renderSubmissions();
}
