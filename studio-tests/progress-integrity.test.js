import test from "node:test";
import assert from "node:assert/strict";
import "../progress-integrity.js";

const integrity = globalThis.AHProgressIntegrity;
const ids = ["core-01", "core-02", "harness-01"];
const valid = {
  schema: "ah-aios-learning-progress",
  version: 2,
  updatedAt: "2026-10-31T00:00:00.000Z",
  completed: ["core-01"],
  checks: { "core-01": true },
  labs: [{ kind: "governance", title: "Review", text: "Evidence checked", when: "today" }],
  portfolio: [{ title: "My work", text: "Saved response", course: "AH-CORE-100", lesson: "M1.1" }],
  activity: [{ text: "Completed a check", when: "today" }]
};

test("validates a supported progress record and normalizes it to version 2", () => {
  assert.equal(integrity.validateProgress(valid, ids).valid, true);
  const normalized = integrity.normalizeProgress(valid, ids);
  assert.equal(normalized.version, 2);
  assert.deepEqual(normalized.completed, ["core-01"]);
  assert.equal(normalized.portfolio[0].course, "AH-CORE-100");
});

test("accepts legacy version 1 progress and migrates it without losing supported data", () => {
  const legacy = { ...valid, version: 1 };
  const normalized = integrity.decodeImport(JSON.stringify(legacy), ids);
  assert.equal(normalized.version, 2);
  assert.deepEqual(normalized.completed, legacy.completed);
});

test("exports a versioned package and imports it losslessly", () => {
  const packageData = integrity.createBackup(valid);
  assert.equal(packageData.format, "ah-aios-learning-studio-backup");
  assert.equal(packageData.packageVersion, 1);
  const restored = integrity.decodeImport(JSON.stringify(packageData), ids);
  assert.deepEqual(restored, integrity.normalizeProgress(valid, ids));
});

test("rejects unsupported package versions and malformed JSON", () => {
  const packageData = integrity.createBackup(valid);
  packageData.packageVersion = 99;
  assert.throws(() => integrity.decodeImport(packageData, ids), /Unsupported backup package version/);
  assert.throws(() => integrity.decodeImport("{broken", ids), /not valid JSON/);
});

test("rejects duplicate IDs, unknown module IDs, invalid booleans, and nested collection objects", () => {
  assert.equal(integrity.validateProgress({ ...valid, completed: ["core-01", "core-01"] }, ids).valid, false);
  assert.equal(integrity.validateProgress({ ...valid, completed: ["unknown-module"] }, ids).valid, false);
  assert.equal(integrity.validateProgress({ ...valid, checks: { "core-01": "yes" } }, ids).valid, false);
  assert.equal(integrity.validateProgress({ ...valid, portfolio: [{ title: "x", text: "y", nested: {} }] }, ids).valid, false);
});

test("rejects unsupported top-level fields rather than silently discarding them", () => {
  assert.equal(integrity.validateProgress({ ...valid, admin: true }, ids).valid, false);
});

test("storage failure leaves the application commit callback untouched", () => {
  let committed = false;
  const failingStorage = { getItem() { return null; }, setItem() { throw new Error("quota exceeded"); }, removeItem() {} };
  assert.throws(() => integrity.persistImport(failingStorage, "progress", valid, () => { committed = true; }), /quota exceeded/);
  assert.equal(committed, false);
});

test("successful storage commit updates state only after persistence succeeds", () => {
  let stored = null;
  let committed = null;
  const storage = { getItem() { return stored?.value ?? null; }, setItem(key, value) { stored = { key, value }; }, removeItem() { stored = null; } };
  integrity.persistImport(storage, "progress", valid, (value) => { committed = value; });
  assert.equal(stored.key, "progress");
  assert.deepEqual(JSON.parse(stored.value), valid);
  assert.equal(committed, valid);
});

test("read-back mismatch restores the previous stored value and does not commit state", () => {
  let value = "previous-record";
  let committed = false;
  let reads = 0;
  const storage = {
    getItem() { reads += 1; return reads === 1 ? value : "corrupted-readback"; },
    setItem(key, next) { value = next; },
    removeItem() { value = null; }
  };
  assert.throws(() => integrity.persistImport(storage, "progress", valid, () => { committed = true; }), /previous record was restored/);
  assert.equal(value, "previous-record");
  assert.equal(committed, false);
});
