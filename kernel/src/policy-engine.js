export class PolicyEngine {
  #rules = [];

  addRule(rule) {
    if (!rule || typeof rule !== "object" ||
        !["allow", "deny"].includes(rule.effect) ||
        typeof rule.capability !== "string" ||
        typeof rule.evaluate !== "function") {
      throw new TypeError("A policy rule requires effect, capability, and evaluate().");
    }
    this.#rules.push(Object.freeze({ ...rule }));
  }

  decide(request) {
    // Explicit deny takes precedence. No matching allow means deny.
    const matching = this.#rules.filter((rule) => rule.capability === request.capability);
    for (const rule of matching) {
      if (rule.effect === "deny" && rule.evaluate(request) === true) {
        return { allowed: false, reason: rule.reason ?? "Explicit deny policy." };
      }
    }
    const allowed = matching.some(
      (rule) => rule.effect === "allow" && rule.evaluate(request) === true
    );
    return allowed
      ? { allowed: true, reason: "Matched allow policy." }
      : { allowed: false, reason: "No matching allow policy (default deny)." };
  }
}
