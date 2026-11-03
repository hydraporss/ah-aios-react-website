import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("root environment template documents the required kernel variables", () => {
  const template = read("../../.env.example");
  const required = [
    "SUPABASE_URL",
    "SUPABASE_PROJECT_REF",
    "SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "OPENAI_API_KEY",
    "ANTHROPIC_API_KEY",
    "LUMA_API_KEY",
    "EMBEDDING_MODEL",
    "EMBEDDING_MODEL_VERSION"
  ];

  for (const name of required) {
    assert.match(template, new RegExp("^" + name + "=", "m"), name + " must be documented");
  }

  // Templates must never contain live values.
  for (const line of template.split(/\r?\n/)) {
    if (/^[A-Z][A-Z0-9_]*=/.test(line)) {
      assert.equal(line.slice(line.indexOf("=") + 1).trim(), "", line.split("=")[0] + " must be blank");
    }
  }
});

test("gitignore ignores local env files but explicitly permits .env.example", () => {
  const ignore = read("../../.gitignore");
  assert.match(ignore, /^\.env$/m);
  assert.match(ignore, /^\.env\.\*$/m);
  assert.match(ignore, /^!\.env\.example$/m);
  assert.ok(ignore.indexOf("!.env.example") > ignore.indexOf(".env.*"));
});

test("Supabase CLI configuration exists and contains a project identifier", () => {
  const configPath = new URL("../../supabase/config.toml", import.meta.url);
  assert.equal(existsSync(configPath), true);
  const config = read("../../supabase/config.toml");
  assert.match(config, /^project_id\s*=\s*"ah-aios-kernel"$/m);
});
