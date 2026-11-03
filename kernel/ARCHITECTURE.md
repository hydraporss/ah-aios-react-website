# AH-AIOS Kernel — Architecture Boundary

## 1. Purpose

The kernel is the shared platform control runtime through which AH-AIOS applications request governed capabilities. It provides a stable boundary between applications, the three AH-AIOS domains, and replaceable external providers.

## 2. Relationship to the three domains

- **CORE:** owns verified identity context, authorization policy, security controls, configuration, audit, and assurance.
- **AI HARNESS:** owns model execution, agents, tools, workflows, orchestration, and bounded task execution.
- **WORLDFORGE:** owns entities, relationships, events, governance state, knowledge provenance, and canon review.

The kernel enforces shared contracts; it does not collapse these domains into one data owner or one application module.

## 3. Request lifecycle

1. An application submits a capability request with an authenticated actor context and correlation ID.
2. The kernel validates required request fields.
3. The policy boundary evaluates authorization. Missing or ambiguous policy means deny.
4. The provider registry resolves a provider that explicitly declares the capability.
5. The kernel invokes the provider through its adapter contract.
6. The result or failure is recorded in the audit sink.
7. The owning domain validates and decides whether the returned information becomes an authoritative record.

## 4. Required production controls

The reference implementation is intentionally incomplete. Before production use, add:

- Trusted identity-context injection from CORE; never trust caller-supplied roles.
- Server-side authorization with scoped subjects, actions, resources, and conditions.
- Durable append-oriented audit storage with independent integrity protection.
- Schema validation for requests, provider metadata, and provider responses.
- Secret-manager references and credential rotation.
- Provider timeouts, cancellation, quotas, retries, idempotency, and circuit breakers.
- Tenant and organization isolation.
- Data classification, retention, and redaction rules.
- Observability, health checks, and operational alerts.
- Threat modeling, security review, backup, and recovery tests.

## 5. Status discipline

The current code is a **development reference prototype**. It is not a production kernel, identity system, secure API gateway, durable audit service, or operational integration platform. External provider names in the platform map are proposed integrations, not connected services.

No generated output becomes established knowledge or canon merely because the kernel routed or logged it.
