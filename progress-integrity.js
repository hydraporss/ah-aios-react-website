(function (root) {
  "use strict";
  const FORMAT = "ah-aios-learning-studio-backup";
  const PACKAGE_VERSION = 1;
  const isRecord = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
  const isText = (value) => typeof value === "string";
  const clone = (value) => JSON.parse(JSON.stringify(value));

  function validateProgress(value, allowedModuleIds) {
    const errors = [];
    const allowed = new Set(allowedModuleIds || []);
    if (!isRecord(value)) return { valid: false, errors: ["Progress must be a JSON object."] };
    if (value.schema !== "ah-aios-learning-progress") errors.push("Unsupported progress schema.");
    if (![1, 2].includes(value.version)) errors.push("Unsupported progress version.");
    if (value.updatedAt !== undefined && !isText(value.updatedAt)) errors.push("updatedAt must be a string.");
    if (!Array.isArray(value.completed)) errors.push("completed must be an array.");
    else {
      if (!value.completed.every((id) => isText(id) && allowed.has(id))) errors.push("completed contains an unknown module identifier.");
      if (new Set(value.completed).size !== value.completed.length) errors.push("completed contains duplicate identifiers.");
    }
    if (!isRecord(value.checks)) errors.push("checks must be an object.");
    else if (Object.entries(value.checks).some(([id, passed]) => !allowed.has(id) || typeof passed !== "boolean")) {
      errors.push("checks contains an unknown module identifier or non-boolean result.");
    }
    const collections = [
      ["labs", ["kind", "title", "text"]],
      ["portfolio", ["title", "text"]],
      ["activity", ["text", "when"]]
    ];
    for (const [name, required] of collections) {
      if (value[name] !== undefined && !Array.isArray(value[name])) {
        errors.push(name + " must be an array.");
        continue;
      }
      for (const [index, item] of (value[name] || []).entries()) {
        if (!isRecord(item) || !required.every((key) => isText(item[key]))) {
          errors.push(name + "[" + index + "] is missing required string fields.");
          continue;
        }
        if (Object.values(item).some((field) => !["string", "number", "boolean"].includes(typeof field))) {
          errors.push(name + "[" + index + "] contains an unsupported nested value.");
        }
      }
    }
    const allowedKeys = new Set(["schema", "version", "updatedAt", "completed", "checks", "labs", "portfolio", "activity"]);
    if (Object.keys(value).some((key) => !allowedKeys.has(key))) errors.push("Progress contains unsupported top-level fields.");
    return { valid: errors.length === 0, errors };
  }

  function normalizeProgress(value, allowedModuleIds) {
    const checked = validateProgress(value, allowedModuleIds);
    if (!checked.valid) throw new Error(checked.errors.join(" "));
    return {
      schema: "ah-aios-learning-progress",
      version: 2,
      updatedAt: isText(value.updatedAt) ? value.updatedAt : new Date().toISOString(),
      completed: value.completed.slice(),
      checks: { ...value.checks },
      labs: clone(value.labs || []),
      portfolio: clone(value.portfolio || []),
      activity: clone(value.activity || [])
    };
  }

  function createBackup(progress) {
    return {
      format: FORMAT,
      packageVersion: PACKAGE_VERSION,
      exportedAt: new Date().toISOString(),
      application: "Learning Studio",
      progress: clone(progress)
    };
  }

  function decodeImport(input, allowedModuleIds) {
    let parsed;
    try { parsed = typeof input === "string" ? JSON.parse(input) : input; }
    catch { throw new Error("The selected file is not valid JSON."); }
    let progress = parsed;
    if (isRecord(parsed) && parsed.format === FORMAT) {
      if (parsed.packageVersion !== PACKAGE_VERSION) throw new Error("Unsupported backup package version.");
      if (!isText(parsed.exportedAt) || parsed.application !== "Learning Studio") throw new Error("Backup package metadata is invalid.");
      progress = parsed.progress;
    }
    return normalizeProgress(progress, allowedModuleIds);
  }

  function persistImport(storage, key, candidate, onCommit) {
    const serialized = JSON.stringify(candidate);
    const previous = storage.getItem(key);
    storage.setItem(key, serialized);
    const readBack = storage.getItem(key);
    if (readBack !== serialized) {
      if (previous === null) storage.removeItem(key);
      else storage.setItem(key, previous);
      throw new Error("Saved progress did not match the imported package; the previous record was restored.");
    }
    if (typeof onCommit === "function") onCommit(candidate);
    return serialized;
  }

  root.AHProgressIntegrity = Object.freeze({
    FORMAT, PACKAGE_VERSION, validateProgress, normalizeProgress, createBackup, decodeImport, persistImport
  });
})(globalThis);
