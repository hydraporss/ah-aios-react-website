export const WORKSPACE_SCHEMA_VERSION = 4;

export const WORKSPACE_COLLECTIONS = Object.freeze([
  "records",
  "relationships",
  "sources",
  "decisions",
  "changeRequests",
  "reviews",
  "changeProposals",
  "claims",
  "activityLog",
  "exports",
]);

const isObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

export function buildWorkspaceExport(workspace) {
  if (!isObject(workspace)) {
    throw new TypeError("Cannot export an invalid workspace.");
  }

  const bundle = { schemaVersion: WORKSPACE_SCHEMA_VERSION };

  for (const collection of WORKSPACE_COLLECTIONS) {
    const value = workspace[collection] ?? [];
    if (!Array.isArray(value)) {
      throw new TypeError(`Cannot export workspace: "${collection}" must be an array.`);
    }
    bundle[collection] = value;
  }

  return JSON.stringify(bundle, null, 2);
}

export function prepareWorkspaceImport(input) {
  let parsed;

  try {
    parsed = typeof input === "string" ? JSON.parse(input) : input;
  } catch {
    throw new Error("Invalid JSON file. Your current workspace has not been changed.");
  }

  if (!isObject(parsed) || !Array.isArray(parsed.records)) {
    throw new Error("Unexpected file format: a workspace backup must contain a records array. Your current workspace has not been changed.");
  }

  const hasSchemaVersion = parsed.schemaVersion !== undefined;
  const hasLegacyVersion = parsed.version !== undefined;
  if (hasSchemaVersion && hasLegacyVersion && parsed.schemaVersion !== parsed.version) {
    throw new Error("Conflicting schemaVersion and legacy version fields. Your current workspace has not been changed.");
  }
  const sourceVersion = hasSchemaVersion ? parsed.schemaVersion : (parsed.version ?? 1);
  if (!Number.isInteger(sourceVersion) || sourceVersion < 1 || sourceVersion > WORKSPACE_SCHEMA_VERSION) {
    throw new Error(`Unsupported workspace schema version "${sourceVersion}". Your current workspace has not been changed.`);
  }

  for (const collection of WORKSPACE_COLLECTIONS) {
    if (parsed[collection] !== undefined && !Array.isArray(parsed[collection])) {
      throw new Error(`Invalid workspace: "${collection}" must be an array. Your current workspace has not been changed.`);
    }
  }

  const workspace = {};
  for (const collection of WORKSPACE_COLLECTIONS) {
    workspace[collection] = parsed[collection] ?? [];
  }

  const warnings = [];
  if (sourceVersion < WORKSPACE_SCHEMA_VERSION &&
      (!Array.isArray(parsed.claims) || !Array.isArray(parsed.changeProposals))) {
    warnings.push(
      "This older backup does not contain one or both of the claims and change-proposals collections. Those items cannot be recovered from this file and will be empty after import."
    );
  }

  return { workspace, warnings };
}
