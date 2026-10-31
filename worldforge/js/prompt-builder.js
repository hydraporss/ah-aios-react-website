/* WorldForge prompt assembly utility.
 * Proposal generation only: no AI calls, persistence, validation, or canon approval.
 */
(function (root) {
  "use strict";
  const REQUIRED = ["template_id", "model", "instructions", "context", "variables"];
  function validatePrompt(prompt) {
    const errors = [];
    if (!prompt || typeof prompt !== "object" || Array.isArray(prompt)) {
      return { valid: false, errors: ["Prompt must be an object."] };
    }
    REQUIRED.forEach((key) => {
      if (!(key in prompt)) errors.push("Missing required field: " + key);
    });
    if (typeof prompt.template_id !== "string" || !prompt.template_id.trim()) errors.push("template_id must be a non-empty string.");
    if (typeof prompt.model !== "string" || !prompt.model.trim()) errors.push("model must be a non-empty string.");
    if (typeof prompt.instructions !== "string" || !prompt.instructions.trim()) errors.push("instructions must be a non-empty string.");
    if (!prompt.context || typeof prompt.context !== "object" || Array.isArray(prompt.context)) errors.push("context must be an object.");
    if (!Array.isArray(prompt.variables) || prompt.variables.some((v) => typeof v !== "string")) errors.push("variables must be an array of strings.");
    return { valid: errors.length === 0, errors };
  }
  function assemblePrompt(template, context) {
    if (!template || typeof template.instructions !== "string") throw new TypeError("A template with instructions is required.");
    const safeContext = context && typeof context === "object" && !Array.isArray(context) ? context : {};
    return [
      template.instructions.trim(),
      "",
      "CONTEXT (source material; not independently verified)",
      JSON.stringify(safeContext, null, 2),
      "",
      "GOVERNANCE REQUIREMENTS",
      "- Distinguish source facts, interpretations, assumptions, and unknowns.",
      "- Preserve source references and uncertainty.",
      "- Do not represent generated output as validated or approved."
    ].join("\n");
  }
  const api = { validatePrompt, assemblePrompt };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.WorldForgePromptBuilder = api;
})(typeof globalThis !== "undefined" ? globalThis : this);