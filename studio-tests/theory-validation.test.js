import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../theory-validation.js", import.meta.url), "utf8");
const context = { module: { exports: {} }, window: {}, globalThis: {} };
vm.runInNewContext(source, context);
const { validateTheoryCollection } = context.module.exports;
const validRecords = [
  ...Array.from({ length: 68 }, (_, i) => ({ id: "REG-" + String(i + 1).padStart(3, "0"), title: "Registry theory " + (i + 1), origin: "registry" })),
  ...Array.from({ length: 14 }, (_, i) => ({ id: "SYN-" + String(i + 1).padStart(3, "0"), title: "Synthesized theory " + (i + 1), origin: "synthesized" }))
];

test("accepts exactly 68 registry and 14 synthesized records", () => {
  const result = validateTheoryCollection({ records: validRecords });
  assert.equal(result.valid, true);
  assert.deepEqual(JSON.parse(JSON.stringify(result.counts)), { registry: 68, synthesized: 14 });
  assert.equal(result.records.length, 82);
});

test("rejects duplicate identifiers", () => {
  const records = validRecords.map(record => ({ ...record }));
  records[81].id = records[0].id;
  const result = validateTheoryCollection(records);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(error => error.includes("duplicate id")));
});

test("rejects ambiguous or missing classifications", () => {
  const conflicting = validRecords.map(record => ({ ...record }));
  conflicting[0].collection = "synthesized";
  assert.equal(validateTheoryCollection(conflicting).valid, false);
  const missing = validRecords.map(record => ({ ...record }));
  delete missing[0].origin;
  assert.equal(validateTheoryCollection(missing).valid, false);
});

test("rejects blank identifiers and titles", () => {
  const records = validRecords.map(record => ({ ...record }));
  records[0].id = "  ";
  records[1].title = " ";
  const result = validateTheoryCollection(records);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(error => error.includes("non-empty string id")));
  assert.ok(result.errors.some(error => error.includes("non-empty string title")));
});

test("rejects incorrect 68 / 14 distribution and malformed input", () => {
  const records = validRecords.map(record => ({ ...record }));
  records[0].origin = "synthesized";
  assert.equal(validateTheoryCollection(records).valid, false);
  assert.equal(validateTheoryCollection({ records: "not an array" }).valid, false);
});
