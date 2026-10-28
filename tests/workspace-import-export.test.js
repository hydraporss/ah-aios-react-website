import test from "node:test";
import assert from "node:assert/strict";
import {
  WORKSPACE_SCHEMA_VERSION,
  buildWorkspaceExport,
  prepareWorkspaceImport,
} from "../src/workspaceImportExport.js";

const populatedWorkspace = {
  records: [{ id: "ori", title: "ORI" }],
  relationships: [{ id: "r1", from: "ori", to: "continuants", type: "continues_from" }],
  sources: [{ id: "s1", title: "Locked reference" }],
  decisions: [{ id: "d1", status: "Proposed" }],
  changeRequests: [{ id: "cr1" }],
  reviews: [{ id: "rv1" }],
  changeProposals: [{ id: "cp1", claimId: "c1" }],
  claims: [{ id: "c1", statement: "Test claim", versions: [{ version: 1 }] }],
  activityLog: [{ id: "a1", action: "Created" }],
  exports: [{ id: "e1" }],
};

test("exports every supported collection using the current schema version", () => {
  const exported = JSON.parse(buildWorkspaceExport(populatedWorkspace));
  assert.equal(exported.version, WORKSPACE_SCHEMA_VERSION);
  for (const key of Object.keys(populatedWorkspace)) {
    assert.deepEqual(exported[key], populatedWorkspace[key], `${key} should be preserved`);
  }
});

test("round-trips claims, change proposals, and provenance collections", () => {
  const backup = buildWorkspaceExport(populatedWorkspace);
  const restored = prepareWorkspaceImport(backup);
  assert.deepEqual(restored.workspace, populatedWorkspace);
  assert.deepEqual(restored.warnings, []);
});

test("rejects malformed JSON without producing replacement state", () => {
  assert.throws(
    () => prepareWorkspaceImport("{not-json"),
    /Invalid JSON file.*current workspace has not been changed/
  );
});

test("rejects a backup without a records array", () => {
  assert.throws(
    () => prepareWorkspaceImport(JSON.stringify({ version: 4, claims: [] })),
    /records array.*current workspace has not been changed/
  );
});

test("rejects malformed collection fields", () => {
  assert.throws(
    () => prepareWorkspaceImport({ version: 4, records: [], claims: {} }),
    /claims.*must be an array/
  );
});

test("warns before importing legacy backups that could not contain claims and proposals", () => {
  const result = prepareWorkspaceImport({
    version: 3,
    records: [{ id: "legacy" }],
    relationships: [],
  });
  assert.equal(result.workspace.records[0].id, "legacy");
  assert.deepEqual(result.workspace.claims, []);
  assert.deepEqual(result.workspace.changeProposals, []);
  assert.equal(result.warnings.length, 1);
  assert.match(result.warnings[0], /claims and change-proposals/);
});

test("accepts older valid bundles and fills omitted collections with empty arrays", () => {
  const result = prepareWorkspaceImport({ version: 3, records: [] });
  assert.deepEqual(result.workspace.relationships, []);
  assert.deepEqual(result.workspace.reviews, []);
});
