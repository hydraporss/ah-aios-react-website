export class ProviderRegistry {
  #providers = new Map();

  register({ id, capabilities, execute, metadata = {} }) {
    if (typeof id !== "string" || !/^[a-z0-9][a-z0-9._-]*$/i.test(id)) {
      throw new TypeError("Provider id must be a non-empty identifier.");
    }
    if (this.#providers.has(id)) throw new Error(`Provider already registered: ${id}`);
    if (!Array.isArray(capabilities) || capabilities.length === 0 ||
        capabilities.some((item) => typeof item !== "string" || !item.trim())) {
      throw new TypeError("Provider must declare one or more capabilities.");
    }
    if (typeof execute !== "function") throw new TypeError("Provider execute must be a function.");

    const record = Object.freeze({
      id,
      capabilities: Object.freeze([...new Set(capabilities)]),
      execute,
      metadata: Object.freeze({ ...metadata })
    });
    this.#providers.set(id, record);
    return this.describe(id);
  }

  resolve(capability, providerId) {
    const candidates = providerId
      ? [this.#providers.get(providerId)].filter(Boolean)
      : [...this.#providers.values()];
    return candidates.find((provider) => provider.capabilities.includes(capability)) ?? null;
  }

  describe(id) {
    const provider = this.#providers.get(id);
    if (!provider) return null;
    return Object.freeze({
      id: provider.id,
      capabilities: [...provider.capabilities],
      metadata: { ...provider.metadata }
    });
  }

  list() {
    return [...this.#providers.keys()].map((id) => this.describe(id));
  }
}
