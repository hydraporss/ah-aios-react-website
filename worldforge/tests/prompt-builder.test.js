"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { validatePrompt, assemblePrompt } = require("../js/prompt-builder.js");

test("validates a complete prompt record", () => {
  const result = validatePrompt({
    template_id: "research",
    model: "local",
    instructions: "Analyze supplied evidence.",
    context: { source: "source-1" },
    variables: ["{{source_data}}"]
  });
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});

test("reports missing and malformed prompt fields", () => {
  const result = validatePrompt({ template_id: "", variables: [1] });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes("model")));
  assert.ok(result.errors.some((error) => error.includes("instructions")));
  assert.ok(result.errors.some((error) => error.includes("context")));
  assert.ok(result.errors.some((error) => error.includes("non-empty string")));
  assert.ok(result.errors.some((error) => error.includes("array of strings")));
});

test("assembles prompt with governance constraints", () => {
  const output = assemblePrompt(
    { instructions: "Investigate this claim." },
    { claim_id: "C-001" }
  );
  assert.match(output, /Investigate this claim/);
  assert.match(output, /C-001/);
  assert.match(output, /not independently verified/);
  assert.match(output, /not represent generated output as validated or approved/);
});

test("rejects a template without instructions", () => {
  assert.throws(() => assemblePrompt({}, {}), TypeError);
});