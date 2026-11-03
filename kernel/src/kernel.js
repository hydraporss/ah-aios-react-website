export class AHAIOSKernel {
  constructor({ providers, policy, audit }) {
    if (!providers || !policy || !audit) {
      throw new TypeError("Kernel requires provider registry, policy engine, and audit sink.");
    }
    this.providers = providers;
    this.policy = policy;
    this.audit = audit;
  }

  async invoke({ actor, capability, input, providerId, correlationId }) {
    const requestId = correlationId ?? crypto.randomUUID();
    const base = {
      requestId,
      actorId: actor?.id ?? null,
      capability,
      providerId: providerId ?? null,
      timestamp: new Date().toISOString()
    };

    if (!actor?.id || !capability) {
      this.audit.append({ ...base, event: "invocation.denied", reason: "Missing actor or capability." });
      throw new Error("Invocation requires an identified actor and capability.");
    }

    const decision = this.policy.decide({ actor, capability, input, providerId });
    if (!decision.allowed) {
      this.audit.append({ ...base, event: "invocation.denied", reason: decision.reason });
      throw new Error(`Invocation denied: ${decision.reason}`);
    }

    const provider = this.providers.resolve(capability, providerId);
    if (!provider) {
      this.audit.append({ ...base, event: "invocation.failed", reason: "No provider supports capability." });
      throw new Error(`No provider available for capability: ${capability}`);
    }

    this.audit.append({ ...base, providerId: provider.id, event: "invocation.started" });
    try {
      const output = await provider.execute({ actor, capability, input, requestId });
      this.audit.append({ ...base, providerId: provider.id, event: "invocation.succeeded" });
      return { requestId, providerId: provider.id, output };
    } catch (error) {
      this.audit.append({
        ...base,
        providerId: provider.id,
        event: "invocation.failed",
        reason: error instanceof Error ? error.message : "Unknown provider error."
      });
      throw error;
    }
  }
}
