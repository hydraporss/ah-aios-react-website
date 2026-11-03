# AH-AIOS Platform Capability Map

**Status:** Proposed integration map  
**Authority:** AH-AIOS Kernel architecture proposal  
**Provider implementations:** Not yet integrated or verified

| External product / option | AH-AIOS platform capability | Kernel boundary | Owning domain |
|---|---|---|---|
| Lovable / Next.js / React / Tailwind | Portal and application experience | Application client; calls versioned kernel APIs | Application layer |
| Supabase / PostgreSQL | Structured data, persistence, identity-provider integration | Data and identity adapters; CORE remains authorization authority | CORE + domain-owned data |
| Microsoft Entra ID | Enterprise identity federation | OIDC identity adapter | CORE |
| n8n | Workflow automation | Workflow execution adapter | HARNESS |
| LangGraph / CrewAI | Agent orchestration | Agent runtime adapter | HARNESS |
| GPT / Claude / Gemini / local LLMs | Model inference | Model-provider adapters behind one model capability contract | HARNESS |
| Higgsfield | Image/video/content generation | Media generation adapter | HARNESS |
| Retell / Azure Speech | Voice and speech | Voice adapter | HARNESS |
| Cloudflare R2 | Object and asset storage | Object-storage adapter | CORE platform service; domain data ownership remains separate |
| PostHog | Product analytics and telemetry | Analytics event adapter | CORE operational oversight |
| Fanbasis / billing provider | Subscription and billing | Billing adapter; signed events and reconciliation required | CORE business operations |
| Cloudflare | Edge security, API gateway, routing, WAF | Edge/security integration; never the sole authorization layer | CORE |

## Integration rules

1. Every provider is replaceable. No application may depend on a provider's proprietary response shape outside its adapter.
2. Every adapter declares its supported capabilities, version, health, and configuration requirements.
3. Provider credentials are references to a secret manager, never values embedded in source code or audit payloads.
4. Identity authentication and application authorization are separate. An identity provider authenticates; CORE policies authorize.
5. Storage providers do not become the authority for knowledge meaning, provenance, or canon status.
6. Model and agent outputs are untrusted proposals until validated by the owning domain.
7. Billing and analytics integrations must not grant access or mutate authoritative records without CORE authorization and auditable reconciliation.
8. The kernel routes bounded requests; HARNESS owns orchestration semantics and WORLDFORGE owns knowledge semantics.

## Capability identifiers (initial proposal)

- `model.generate`
- `agent.run`
- `workflow.execute`
- `media.generate`
- `voice.synthesize`
- `voice.converse`
- `identity.authenticate`
- `data.read`
- `data.write`
- `knowledge.query`
- `knowledge.propose`
- `asset.store`
- `asset.retrieve`
- `analytics.emit`
- `billing.subscription.read`
- `billing.subscription.change`
- `edge.security.inspect`

Capability names are contracts, not proof that corresponding adapters exist.
