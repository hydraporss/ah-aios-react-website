import { createHash } from "node:crypto";

export class MemoryAuditLedger {
  #events = [];

  append(event) {
    const previousHash = this.#events.at(-1)?.hash ?? "GENESIS";
    const payload = {
      ...event,
      sequence: this.#events.length + 1,
      previousHash
    };
    const hash = createHash("sha256").update(JSON.stringify(payload)).digest("hex");
    const record = Object.freeze({ ...payload, hash });
    this.#events.push(record);
    return record;
  }

  list() {
    return this.#events.map((event) => ({ ...event }));
  }

  verify() {
    let previousHash = "GENESIS";
    for (let index = 0; index < this.#events.length; index += 1) {
      const { hash, ...payload } = this.#events[index];
      if (payload.sequence !== index + 1 || payload.previousHash !== previousHash) return false;
      const expected = createHash("sha256").update(JSON.stringify(payload)).digest("hex");
      if (hash !== expected) return false;
      previousHash = hash;
    }
    return true;
  }
}
