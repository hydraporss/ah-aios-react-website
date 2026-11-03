# AH-AIOS Kernel — Foundation

**Status:** Prototype implementation on an isolated feature branch  
**Architecture status:** Proposed; not canonized  
**Implementation scope:** Provider-neutral control kernel foundation

## Purpose

The AH-AIOS Kernel is the platform control plane between users/applications and replaceable service providers. It coordinates capability discovery, policy decisions, bounded invocation, and audit evidence. It does not replace the three established AH-AIOS domains:

- **CORE** owns identity, authority, security, governance, configuration, audit, and assurance.
- **AI HARNESS** owns AI execution, agents, tools, workflows, and orchestration.
- **WORLDFORGE** owns structured knowledge, world models, provenance, and canon governance.

The kernel supplies shared runtime contracts. It must not absorb domain ownership or grant itself authority.

## Architecture

```
Applications (Portal, WorldForge, Learning Studio, future products)
                         |
                  AH-AIOS Kernel
       +-----------------+------------------+
       |                 |                  |
  Identity Context   Policy Gate      Audit / Evidence
       |                 |                  |
       +----------- Capability Router ------+
                         |
              Provider / Service Adapters
       +---------+---------+--------+---------+
       |         |         |        |         |
      LLMs     Voice    Workflow  Storage  Analytics
       GPT     Retell    n8n      R2       PostHog
       Claude  Speech    Agents   Supabase Billing
       Gemini
```

Providers are adapters, not authorities. A provider response is untrusted input until validated and accepted by the owning domain.

## Kernel responsibilities

1. Register named providers and their declared capabilities.
2. Resolve a capability to an eligible provider.
3. Require an explicit actor and invocation context.
4. Evaluate authorization before executing a provider.
5. Fail closed when policy or provider resolution is missing.
6. Emit attributable audit events for allowed, denied, successful, and failed operations.
7. Keep provider-specific details behind adapter contracts.

## Non-responsibilities

- It is not an identity provider. CORE supplies verified identity context.
- It is not a model, agent framework, or workflow engine. HARNESS owns execution semantics.
- It is not the authoritative knowledge database. WORLDFORGE owns knowledge records and provenance.
- It does not make canon decisions.
- It does not claim production-grade security, persistence, or availability.

## Current implementation

The first increment is a dependency-free Node.js reference runtime using:
- a provider registry,
- a default-deny policy engine,
- a capability invocation boundary,
- a tamper-evident in-memory audit chain,
- automated unit tests.

The in-memory audit ledger is for development and tests only. Production requires a durable, access-controlled audit sink and independently protected integrity evidence.

## Run tests

From the repository root:

```bash
node --test kernel/tests/*.test.js
```

## Next increments

1. Replace caller-supplied identity with authenticated CORE identity context.
2. Add versioned JSON Schemas for invocation and provider contracts.
3. Add persistent audit/event storage and integrity verification.
4. Add provider health, timeouts, retries, idempotency, quotas, and secret references.
5. Add authenticated API boundary and contract tests.
6. Integrate Supabase/PostgreSQL and object storage through adapters.
7. Connect HARNESS and WORLDFORGE through explicit domain contracts.

No capability is considered operational until its controls and acceptance tests are implemented and verified.
