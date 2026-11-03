import test from "node:test";
import assert from "node:assert/strict";
import {
  AHAIOSKernel,
  MemoryAuditLedger,
  PolicyEngine,
  ProviderRegistry
} from "../src/index.js";

const fixture = () => {
  const providers = new ProviderRegistry();
  const policy = new PolicyEngine();
  const audit = new MemoryAuditLedger();
  const kernel = new AHAIOSKernel({ providers, policy, audit });
  return { providers, policy, audit, kernel };
};

test("kernel denies by default when no allow policy exists", async () => {
  const { providers, audit, kernel } = fixture();
  providers.register({ id: "mock-llm", capabilities: ["model.generate"], execute: async () => "ok" });
  await assert.rejects(
    kernel.invoke({ actor: { id: "user-1" }, capability: "model.generate", input: {} }),
    /Invocation denied/
  );
  assert.equal(audit.list()[0].event, "invocation.denied");
  assert.equal(audit.verify(), true);
});

test("kernel authorizes then routes to a provider and records the result", async () => {
  const { providers, policy, audit, kernel } = fixture();
  providers.register({
    id: "mock-llm",
    capabilities: ["model.generate"],
    execute: async ({ input }) => ({ text: input.prompt })
  });
  policy.addRule({
    effect: "allow",
    capability: "model.generate",
    evaluate: ({ actor }) => actor.roles?.includes("operator") === true
  });

  const result = await kernel.invoke({
    actor: { id: "user-2", roles: ["operator"] },
    capability: "model.generate",
    input: { prompt: "hello" }
  });
  assert.deepEqual(result.output, { text: "hello" });
  assert.equal(result.providerId, "mock-llm");
  assert.deepEqual(audit.list().map((event) => event.event), [
    "invocation.started",
    "invocation.succeeded"
  ]);
  assert.equal(audit.verify(), true);
});

test("explicit deny overrides allow", async () => {
  const { policy } = fixture();
  policy.addRule({ effect: "allow", capability: "asset.write", evaluate: () => true });
  policy.addRule({ effect: "deny", capability: "asset.write", evaluate: () => true });
  assert.equal(policy.decide({ capability: "asset.write" }).allowed, false);
});

test("provider registry rejects duplicate IDs and unknown capabilities", () => {
  const registry = new ProviderRegistry();
  registry.register({ id: "storage-a", capabilities: ["asset.store"], execute: async () => true });
  assert.throws(
    () => registry.register({ id: "storage-a", capabilities: ["asset.store"], execute: async () => true }),
    /already registered/
  );
  assert.equal(registry.resolve("asset.read"), null);
});

test("audit chain verifies its sequence and hash links", () => {
  const ledger = new MemoryAuditLedger();
  ledger.append({ event: "test.one", actorId: "a1" });
  ledger.append({ event: "test.two", actorId: "a1" });
  assert.equal(ledger.verify(), true);
  assert.equal(ledger.list()[1].previousHash, ledger.list()[0].hash);
});
