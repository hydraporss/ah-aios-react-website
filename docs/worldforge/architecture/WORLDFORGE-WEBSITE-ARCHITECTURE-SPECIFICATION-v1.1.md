# WorldForge — Full Website Architecture Specification

**Document ID:** WF-ARCH-WEB-001  
**Version:** 1.1.0  
**Date:** 2026-10-30  
**Status:** Architecture baseline / implementation specification — not a canonization action  
**System:** AH-AIOS WorldForge  
**Repository:** https://github.com/hydraporss/ah-aios-react-website  
**Documentation branch:** `feature/worldforge-data-layer-v0.7`  
**Existing development reference:** `feature/worldforge-studio-v0.6`, PR #7 (not merged)  
**Notion project hub:** https://app.notion.com/p/40966662b29d8113a6f5c7fab6cf8f48

---

## 1. Purpose and authority

This specification defines the complete WorldForge website represented by the supplied WorldForge dashboard reference. It translates the visual design into a functional application contract: navigation, pages, domain records, services, governance, persistence, integrity, verification, and release controls.

WorldForge is the structured world-modeling, knowledge-management, and governance environment within AH-AIOS. It turns ideas, worlds, entities, relationships, events, claims, evidence, sources, constitutional rules, and doctrine into identifiable, connected, traceable records.

**Governing principles:**

- Structure Before Narrative.
- Truth Before Tradition.
- Consequence Before Claim.
- AI may propose; authorized humans approve.
- Emergence does not equal canon.
- Preserve source, interpretation, evidence, verification, and canon as distinct states.

This is a software architecture specification. It does not create, revise, or approve AFTER HUMANITY canon. The screenshot is an approved design input for this specification, not proof that every depicted function is already implemented.

### 1.1 Source-of-truth hierarchy

| Concern | Authority |
|---|---|
| Application source code, schemas, tests, workflows, version history | GitHub repository |
| Architecture specifications, implementation records, decisions, inventories | Notion project documentation |
| User-facing runtime data | Validated local WorldForge workspace package |
| Canon status and approval | Explicit WorldForge governance records and authorized human decision |
| Visual direction | Supplied WorldForge dashboard reference and approved design assets |

Notion documentation mirrors and explains the implementation. It does not silently override source code. GitHub commits do not themselves authorize canon changes.

## 2. Repository alignment and implementation boundary

### 2.1 Repository identity

The connected repository is `hydraporss/ah-aios-react-website`, with `main` as its default branch. The current repository README identifies the root application as **Learning Studio**. WorldForge is maintained in the preserved WorldForge project area under `public/worldforge/verified-2026-10-28/`.

This distinction is mandatory:

1. Learning Studio remains the root application.
2. WorldForge remains a distinct AH-AIOS application area and product architecture.
3. Shared AH-AIOS governance concepts may be referenced by both systems.
4. WorldForge work must not replace the Learning Studio root entry point, root styles, or root runtime.
5. Existing WorldForge source files, schemas, tests, assets, and history must be preserved.

### 2.2 Branch and pull-request controls

- This specification is recorded on the existing `feature/worldforge-data-layer-v0.7` development branch.
- `feature/worldforge-studio-v0.6` and PR #7 remain historical implementation references; PR #7 is not treated as merged.
- No branch is merged, no pull request is approved, and no production deployment is authorized by this document.
- Work must be incremental, reviewable, and reversible.
- Before any later implementation change, inspect the target file and current branch state. Never overwrite a file merely because an older specification names it.

### 2.3 Runtime boundary

The existing WorldForge Studio prototype is a browser-local application. The current operating target is local-first JSON persistence, schema validation, audit/version history, import/export, and a replaceable persistence adapter.

**Supabase and a shared cloud database are out of scope for this target.** Historical Supabase configuration, service files, or migrations in older development work must not become required runtime dependencies. Do not run, reactivate, or extend those migrations as part of this architecture. Any future remote adapter requires a separate proposal, explicit approval, security review, migration plan, and acceptance gate.

## 3. Product definition and user workflows

WorldForge must support a user through a complete, traceable workflow:

1. Create or open a world.
2. Register entities and their identities.
3. Connect entities through typed relationships.
4. Record events in a chronology.
5. formulate claims and associate evidence.
6. Register sources and provenance.
7. Review claims and proposed changes through governance.
8. Apply constitutional and doctrinal constraints.
9. Generate structured prompts from selected world records.
10. Inspect the system architecture and integrity state.
11. Save, export, back up, restore, and validate the workspace.

The website is not a static collection of pages. All primary controls must perform a real operation, navigate to a real route, or be visibly marked as unavailable/in development.

## 4. Visual and interaction specification

### 4.1 Design identity

Reproduce the supplied reference as a refined, dark cinematic knowledge-work environment:

- Near-black / deep navy application background.
- Dark blue-gray panels with restrained borders.
- Warm metallic gold for identity, primary actions, and important domain icons.
- White and muted gray for readable hierarchy.
- Restrained cyan/blue for links and secondary actions.
- Serif display typography for the WorldForge identity and hero statement; clean sans-serif typography for controls and record data.
- Fine dividers, compact metadata, restrained glow, consistent spacing, and clear focus states.
- Responsive behavior without sacrificing the desktop information hierarchy.

The visual system must support readability and data density. Decoration must not obscure record state, warnings, provenance, or action consequences.

### 4.2 Global application shell

The application shell consists of:

- Brand area: WorldForge / AH-AIOS emblem and wordmark.
- Top bar: governing motto, Canon Mode indicator, notifications, help, user/profile menu.
- Left sidebar: the fixed 13-module navigation registry.
- Main workspace: route-specific content.
- Shared status region: data integrity, canon status, local save/sync state, application version, and integrity-check action.
- Footer: documentation, user guide, support, privacy, terms, license, and copyright links.

Canon Mode must be an explicit, understandable mode/status indicator. It must not imply that all content is canon or that the user has authority to approve every record.

### 4.3 Home dashboard

The Home route is the dashboard shown in the supplied reference. It contains:

1. **Hero panel:** welcome message, WorldForge identity, concise product statement, Enter Studio and Explore Worlds actions.
2. **World Overview:** live counts for worlds, entities, relationships, events, claims, sources, and evidence files.
3. **Recent Worlds:** cards showing world identity, description, entity count, last updated time, and a working open action.
4. **Recent Activity:** attributable activity events with record links, action summaries, and timestamps.
5. **Module shortcuts:** World Atlas, Entity Registry, Relationship Explorer, Claim & Evidence, Governance, and Prompt Builder.
6. **System status:** integrity result, canon-state summary, last local save/backup or sync state, version, and Run Integrity Check.
7. **Documentation footer:** working links to the relevant help resources.

All counts and activity entries must be derived from the active workspace and audit records. The numbers visible in the supplied reference are visual examples only; they must never be hardcoded as real system totals. Empty workspaces must display honest zero states and useful next actions.

### 4.4 Responsive behavior and accessibility

- Desktop: persistent sidebar and multi-panel dashboard.
- Tablet: collapsible navigation and reflowed panels.
- Mobile: compact navigation, stacked content, readable record cards, and no horizontal overflow.
- All actions must be keyboard accessible, have visible focus, and use semantic labels.
- Status must not be conveyed by color alone.
- Respect reduced-motion preferences.
- Provide loading, empty, success, warning, validation-error, permission-denied, and recovery states.

## 5. Fixed navigation and module contracts

The 13 entries below are the authoritative navigation contract derived from the supplied reference. IDs, labels, route keys, and order must be maintained in one navigation registry.

| ID | Module | Route key | Primary responsibility |
|---|---|---|---|
| WF-01 | Home | `/home` | Dashboard, live overview, recent worlds, activity, system status |
| WF-02 | World Atlas | `/worlds` | Browse, create, edit, archive, search, and open worlds |
| WF-03 | Entity Registry | `/entities` | Create, edit, classify, inspect, and link entities |
| WF-04 | Relationship Explorer | `/relationships` | Explore and manage typed, directed/symmetric relationships |
| WF-05 | Event Chronicle | `/events` | Record, order, relate, and inspect historical events |
| WF-06 | Claim & Evidence | `/claims` | Register claims, evidence, uncertainty, and review state |
| WF-07 | Source Library | `/sources` | Register source records, metadata, locations, and provenance |
| WF-08 | Governance | `/governance` | Review proposals, authorize transitions, record decisions |
| WF-09 | Constitution | `/constitution` | Maintain structured constitutional laws and constraints |
| WF-10 | Doctrine | `/doctrine` | Browse and reference approved doctrine and interpretations |
| WF-11 | Prompt Builder | `/prompts` | Build, validate, preview, save, and export structured prompts |
| WF-12 | System Architecture | `/architecture` | Inspect modules, layers, schemas, dependencies, and verification |
| WF-13 | Settings | `/settings` | Configure workspace, appearance, storage, backup, and preferences |

### 5.1 Module requirements

**WF-01 Home**
- Derive dashboard counts from validated records.
- Open world and record details from cards and activity entries.
- Show the timestamp and outcome of the latest integrity check.
- Distinguish local save/backup state from remote synchronization; do not show a fictitious cloud sync.

**WF-02 World Atlas**
- World list, search, filters, create/edit/archive, world detail.
- Display world identity, description, status, record counts, and change history.
- Protect records belonging to a world when archiving or deleting it.

**WF-03 Entity Registry**
- Entity CRUD, type, world membership, identity notes, attributes, source references.
- Show incoming/outgoing relationships, events, claims, and audit history.
- Prevent unresolved world references and accidental duplicate IDs.

**WF-04 Relationship Explorer**
- Create and inspect relationships with source entity, target entity, type, directionality, context, and constraints.
- Validate both endpoints and world membership.
- Provide list and graph representations; graph display is a view, not a second data store.

**WF-05 Event Chronicle**
- Event creation, editing, ordering, chronology, participants, locations, related entities, sources, and claims.
- Preserve date precision and uncertainty where supplied.
- Event records must be independently identifiable and referenceable.
- **Schema gap:** the inspected v1 schema registry lists common, world, entity, relationship, claim, source, evidence, and manifest schemas; it does not list an Event schema. Add and register `event.schema.json`, define migration behavior, and add tests before claiming this module is fully schema-backed.

**WF-06 Claim & Evidence**
- Claims carry a statement, claim type, scope, uncertainty, workflow state, canon state, and source/evidence references.
- Evidence records identify what they support, contradict, or qualify.
- Display unsupported, partially supported, supported, contradicted, mixed, and unknown states where appropriate.
- A validated claim is not automatically an approved canon claim.

**WF-07 Source Library**
- Stable source IDs, title, creator/author, source type, publication/creation date where known, location/URI, excerpt/reference, and reliability notes.
- Claims and evidence must reference source IDs rather than relying only on copied titles.
- Missing or uncertain metadata must remain explicitly unknown, not fabricated.

**WF-08 Governance**
- Review queue, record comparison, evidence inspection, constitutional checks, decision rationale, reviewer identity, timestamp, and audit event.
- Support Proposed → Investigated → Validated → Approved, and Rejected / Needs Evidence / Superseded outcomes.
- Require explicit authorized human action for approval and canon transitions.
- Preserve before/after state and reason for significant changes.

**WF-09 Constitution**
- Structured, stable, referenceable constitutional laws and constraints.
- Display law ID, title, statement, scope, status, version, references, and validation criteria.
- The three established constitutional laws are Power, Whole, and Relation. Their authoritative wording must be referenced from the approved canon source, not paraphrased into a new law by the UI.
- Constitutional validation may block or flag an operation; it does not itself grant approval.

**WF-10 Doctrine**
- Separate established doctrine, canon-aligned interpretation, proposal, and under-review material.
- Provide source links, references, status, version, and cross-links to constitutional records.
- Do not convert interpretation into canon by saving or displaying it.

**WF-11 Prompt Builder**
- Compose structured prompts from selected worlds, entities, relationships, events, claims, sources, constraints, and output requirements.
- Validate prompt inputs against the prompt schema and referenced records.
- Preview the resolved context and identify excluded, missing, or uncertain data.
- Save and export prompt packages with version and provenance metadata.
- Preserve the existing Prompt Builder specifications and validation requirements; this website architecture does not replace their detailed contracts.

**WF-12 System Architecture**
- Show the nine-layer architecture, module registry, route map, schema registry, persistence boundary, and dependency map.
- Show current implementation state separately from target architecture.
- Link to source files, tests, workflow definitions, and architecture records.
- Never report a proposed component as implemented without repository evidence.

**WF-13 Settings**
- Workspace identity and preferences, appearance, local storage status, backup/export, import/restore, schema/package version, and integrity controls.
- Destructive operations require explicit confirmation and a recoverable backup path.
- Settings cannot silently change canon state or bypass governance.

### 5.2 Shared module contract

Every module must declare:
- Stable module ID, label, route, and version.
- Purpose and supported operations.
- Record types read and written.
- Domain services and schemas used.
- Permission and governance requirements.
- Validation and integrity rules.
- Loading, empty, error, warning, and success states.
- Save, backup, import/export, and recovery behavior.
- Unit, integration, browser, and acceptance tests.

No navigation entry may be decorative. A module not yet implemented must show an honest development status and must not pretend to perform unavailable actions.

## 6. Logical architecture — nine layers

| Layer | Name | Responsibility |
|---|---|---|
| 1 | Presentation | Shell, navigation, responsive UI, forms, cards, tables, graph and status display |
| 2 | Module application | Module workflows, route controllers, user actions, view composition |
| 3 | Domain model | World, entity, relationship, event, claim, evidence, source and governance records |
| 4 | Governance services | Authorization, review transitions, canon-state controls, constitutional checks |
| 5 | Validation and integrity | JSON Schema validation, reference integrity, uniqueness, invariants, package checks |
| 6 | Persistence adapters | Browser-local storage, JSON package import/export, adapter abstraction |
| 7 | Audit and versioning | Revisions, audit events, actor/time/reason, migration history, recovery metadata |
| 8 | Integration and delivery | GitHub, automated tests, CI, build artifacts, release documentation |
| 9 | Trust and risk management | Cross-cutting authorization, provenance, privacy, backup, recovery, failure handling |

Layer 9 is cross-cutting. It applies to every other layer and is not an additional user-facing module.

### 6.1 Dependency direction

Presentation → module application → domain services → validation/governance → persistence adapter.

Audit/version services observe and record significant domain operations. The UI must not bypass domain services and write arbitrary objects directly to storage. Schemas define record shape; domain services enforce cross-record rules and permitted transitions.

## 7. Domain model and canonical record architecture

### 7.1 Core record families

The target authoritative model comprises:

- World
- Entity
- Relationship
- Event
- Claim
- Evidence
- Source
- Governance decision / review record
- Audit event
- Version/revision record
- Package manifest

The inspected v1 JSON Schema family currently includes `common.schema.json`, `world.schema.json`, `entity.schema.json`, `relationship.schema.json`, `claim.schema.json`, `source.schema.json`, `evidence.schema.json`, `manifest.schema.json`, and `registry.json`. Event and explicit governance-decision schemas are identified extensions, not assumed existing files.

### 7.2 Shared record metadata

Where applicable, each record must carry:
- Stable ID.
- Record type and schema version.
- Owning world/workspace ID.
- Created timestamp and actor.
- Updated timestamp and actor.
- Positive integer record version.
- Workflow status.
- Canon status where applicable.
- Source/provenance references.
- Optional supersession reference.
- Revision reason and integrity metadata where supported.

IDs are immutable identity anchors. Renaming a record must not change its ID or break inbound references.

### 7.3 Enumerations and state separation

Workflow state and canon state are separate dimensions.

Workflow examples: Proposed, Investigating, Needs Evidence, Validated, Approved, Rejected, Superseded.

Canon display labels: NOT CANON, VERIFY / UNDER REVIEW, CANON-ALIGNED INTERPRETATION, APPROVED VISUALIZATION, ESTABLISHED CANON.

Evidence state examples: Unknown, Unsupported, Partially Supported, Supported, Contradicted, Mixed.

A structural validation result, evidence assessment, governance decision, and canon status must never be collapsed into one boolean field.

### 7.4 Referential integrity

The integrity engine must verify:
- IDs are unique within the defined package scope.
- Entity world references resolve.
- Relationship source and target entities resolve.
- Cross-world relationships require explicit permission and recorded justification.
- Self-links and cycles follow relationship-specific rules.
- Events resolve participant, location, and related-record references.
- Claims resolve evidence and source references.
- Evidence resolves its claim and source references.
- Governance decisions resolve the reviewed record and reviewer.
- Supersession links resolve and do not create invalid loops.
- Record types and schema versions are supported.

JSON Schema validates record structure. Cross-record constraints require domain/data-layer checks. UI validation alone is not a security boundary.

## 8. Governance and constitutional controls

### 8.1 Controlled lifecycle

The workflow is:

**Proposed → Investigated → Validated → Approved**

Alternative outcomes include **Rejected**, **Needs Evidence**, and **Superseded**. Transitions must be explicit, permitted, attributable, and recorded. Validation does not equal approval.

### 8.2 Human authorization

- AI may draft, classify, compare, summarize, and recommend.
- AI output remains proposed or under review until an authorized human decides otherwise.
- Approval requires actor, timestamp, rationale, reviewed version, and resulting state.
- No background task, import, migration, generated prompt, or deployment may promote canon status.
- Rejected and superseded records remain traceable; do not silently erase history.

### 8.3 Constitutional checks

Power = capability is not justification.  
Whole = a perspective on the Whole is not the Whole itself.  
Relation = connection has effects but does not guarantee goodness.

The software must preserve these laws as distinct structured records and allow relevant modules to reference them. Their enforcement is a governance control, not a claim that software can mechanically settle every philosophical judgment.

## 9. Persistence, import, export, and backup

### 9.1 Local-first target

- Browser-local workspace persistence is the active target.
- Existing local storage key observed in the Studio documentation: `worldforge_studio_v1`.
- Local persistence is not a secure shared database and does not synchronize between browsers or devices.
- The UI must say **Local only** or show the actual local save/backup state; never display fabricated sync times.
- A replaceable adapter interface isolates modules from the storage implementation.

### 9.2 JSON package contract

The current package identity is `ah-aios-worldforge`; the inspected data-layer uses package/schema version `1.0.0` and supports migration from `0.1.0` to `1.0.0`.

The manifest must describe package type, schema version, export timestamp, and record counts. The inspected manifest schema currently requires counts for worlds, entities, relationships, claims, sources, and evidence. When Event schema support is added, manifest counts and tests must be extended deliberately.

### 9.3 Safe import

Import is a staged, reviewable operation:

1. Read the selected file without mutating the active workspace.
2. Parse JSON and validate package type.
3. Identify source schema version and supported migration path.
4. Stage migration while preserving IDs, statuses, and provenance.
5. Run schema and cross-record integrity checks.
6. Present counts, warnings, errors, and changes to the user.
7. Require explicit confirmation.
8. Preserve a pre-import recovery snapshot.
9. Apply only if validation passes and the user confirms.
10. Record import result and migration history.

A failed import must leave the active workspace unchanged.

### 9.4 Export and restore

- Export must be deterministic for the declared package scope.
- Include all required records and declared metadata.
- Validate the exported package before offering it as a backup.
- Report counts, package version, timestamp, and validation result.
- Restore must stage and validate before replacing active state.
- Never silently overwrite a newer workspace.
- Provide a recovery path and clearly report partial/failed operations.

## 10. Audit trail and version history

Every significant create, edit, archive, import, restore, migration, governance transition, approval, rejection, and configuration change must be attributable.

Audit event fields should include:
- Event ID and event type.
- Target record ID/type.
- Actor.
- Timestamp.
- Action and reason.
- Before/after version references or snapshots where appropriate.
- Validation outcome.
- Related source/governance decision IDs.

Revisions preserve the stable record ID and increment its version. The inspected data-layer already exposes revision creation that preserves ID, increments version, and records actor and reason. Extend this pattern consistently across all modules. Audit history is append-oriented; correction creates a new event rather than rewriting the historical event.

## 11. Data integrity and automated verification

### 11.1 Integrity engine

The global Run Integrity Check action must execute a real validation pass and return:
- Overall result: PASS, PASS WITH WARNINGS, or FAIL.
- Check timestamp and application/schema version.
- Number of records inspected.
- Errors and warnings grouped by category.
- Record IDs and field paths for actionable findings.
- A clear remediation path.
- A durable audit/verification result where appropriate.

A green status must refer to a dated check and the checks actually executed. It must not imply that canon is stable or that all data has been independently verified.

### 11.2 Required verification categories

1. Package parse and package identity.
2. JSON Schema registry completeness and schema parsing.
3. Required fields and supported enumerations.
4. Stable ID presence and uniqueness.
5. World and entity reference integrity.
6. Relationship endpoint, duplicate edge, self-link, and cross-world rules.
7. Event chronology and event references.
8. Claim/evidence/source provenance.
9. Governance transition and authorization rules.
10. Revision identity and version increments.
11. Migration preservation and unsupported-version rejection.
12. Import/export round-trip and backup/restore.
13. UI route and navigation integrity.
14. Browser interaction and accessibility smoke checks.
15. Build and deployment-artifact integrity.

### 11.3 Existing implementation evidence

The inspected `feature/worldforge-data-layer-v0.7` source contains a framework-independent data-layer with:
- Package and schema version constants.
- Supported workflow, canon, and evidence state sets.
- Workspace validation.
- Duplicate ID detection.
- Entity-to-world reference checks.
- Relationship endpoint checks.
- Cross-world and self-link checks.
- Duplicate relationship-edge detection.
- Missing claim provenance warnings.
- Workspace migration that preserves record IDs and governance status.
- Revision creation that preserves identity and increments version.

The inspected data-layer test file covers schema registry parsing, valid workspaces, duplicate IDs, dangling relationship endpoints, migration preservation, revision increments, and unsupported migration versions.

These are source-inspected capabilities, not a claim that every test was executed during this documentation operation. Additional required tests are listed above.

### 11.4 Test layers

- Unit tests: pure domain and data-layer functions.
- Schema tests: all registry entries parse and use the declared JSON Schema dialect.
- Integration tests: module services, storage adapter, import/export, migration, audit.
- Browser smoke tests: navigation, CRUD, dialogs, status, responsive shell.
- End-to-end acceptance: complete world-to-claim-to-governance workflow.
- Regression tests: existing Learning Studio root application and preserved WorldForge flows.

### 11.5 CI and release verification

The inspected repository uses Node.js 24, pnpm 11.25.0, Vite, React 19, Node's test runner, and Playwright. The root workflow is named **Learning Studio — verify and deploy** and runs root tests, syntax checks, build, and browser smoke checks including a WorldForge smoke test.

WorldForge changes must preserve the root application's CI and Pages behavior. A pull request must pass the applicable automated checks before review. Deployment occurs only through the repository's authorized release workflow and must not be triggered by documentation alone.

## 12. GitHub source layout and dependency map

The inspected WorldForge project area includes:

```text
public/worldforge/verified-2026-10-28/
  index.html
  studio.html
  STUDIO-README.md
  assets/
    studio.css
    studio.js
    data-layer.js
    [historical adapter files, if retained]

schemas/v1/
  registry.json
  common.schema.json
  world.schema.json
  entity.schema.json
  relationship.schema.json
  claim.schema.json
  source.schema.json
  evidence.schema.json
  manifest.schema.json
  [event.schema.json — required extension]

tests/
  worldforge-data-layer.test.js
  worldforge-schema-validation.test.js
  worldforge-backup-restore.test.js
  worldforge-studio.test.js

studio-tests/
  worldforge-studio-smoke.mjs

.github/workflows/
  deploy.yml

docs/worldforge/architecture/
  WORLDFORGE-WEBSITE-ARCHITECTURE-SPECIFICATION-v1.1.md
```

This is an architecture map, not an assertion that every listed future item already exists at the target branch. Confirm exact file paths before implementation. The current public entry page and Studio prototype must be preserved while the dashboard shell and 13 routes are incrementally implemented.

### 12.1 Dependency flow

```text
Application shell / navigation registry
          |
          v
13 module routes and workflow controllers
          |
          v
Domain services and shared record registry
          |
          +------ Governance / Constitution
          |
          +------ Schema and integrity engine
          |
          +------ Audit and revision services
          |
          v
Local-first persistence adapter
          |
          +------ JSON import / export / backup
          |
          v
GitHub source, tests, CI and release artifact
```

Modules must share the same authoritative records. They must not maintain conflicting copies of the same entity, source, claim, or governance state.

## 13. Security, privacy, and failure handling

- Treat browser-local data as user-controlled and potentially exposed on the device.
- Do not store secrets, private API keys, or privileged credentials in browser code.
- Validate imported files as untrusted input.
- Escape user-supplied content when rendering.
- Use explicit confirmations for destructive actions.
- Preserve backups before bulk changes and migrations.
- Handle corrupt storage with a recoverable error state; do not silently initialize an empty workspace over unreadable data.
- Make errors actionable without leaking sensitive data.
- If future shared persistence is proposed, require a separate authentication, authorization, encryption, conflict, backup, and threat-model specification.

## 14. Implementation sequence

### Phase A — Foundation and preservation
- Confirm the active branch and existing source paths.
- Preserve Learning Studio root files and the existing WorldForge prototype.
- Establish the navigation registry and route map.
- Reconcile the existing schemas and test inventory.

### Phase B — Application shell and dashboard
- Implement the visual shell and responsive 13-link sidebar.
- Implement Home dashboard using live workspace-derived metrics.
- Implement honest empty, local-only, and integrity states.
- Wire every shortcut and navigation action.

### Phase C — Domain modules
- Implement World Atlas, Entity Registry, Relationship Explorer, Event Chronicle, Claim & Evidence, and Source Library against shared domain services.
- Add Event schema, registry entry, migration, and tests.
- Ensure all CRUD operations preserve IDs, provenance, and revision history.

### Phase D — Governance and knowledge modules
- Implement Governance, Constitution, Doctrine, and Prompt Builder integrations.
- Enforce explicit human approval and controlled state transitions.
- Keep interpretation, proposal, evidence, verification, and canon distinct.

### Phase E — Architecture, settings, and integrity
- Implement System Architecture and Settings.
- Complete backup/restore, import/export, data integrity reports, and recovery flows.
- Complete the audit and versioning coverage.

### Phase F — Verification and release assessment
- Execute unit, schema, integration, browser, and end-to-end tests.
- Verify all 13 routes and all primary actions.
- Run root Learning Studio regression tests.
- Review accessibility, security, backup recovery, and deployment artifact.
- Record evidence and remaining limitations.
- Release only after the authorized gate is passed.

## 15. Acceptance criteria

The website is accepted only when all applicable criteria are evidenced:

- [ ] All 13 navigation entries resolve to their intended routes.
- [ ] The dashboard follows the supplied design reference responsively.
- [ ] Dashboard counts and activity are derived from actual workspace records.
- [ ] World, entity, relationship, event, claim, evidence, and source records use shared stable IDs.
- [ ] Event schema is registered and tested.
- [ ] All modules use shared domain services and do not bypass validation.
- [ ] Governance transitions require authorization and create attributable decisions.
- [ ] Canon status cannot be promoted by AI generation, import, or validation alone.
- [ ] Local-first persistence works without a cloud service.
- [ ] Import/export, migration, backup, and restore preserve identities and governance state.
- [ ] Integrity checks detect and report structural and cross-record failures.
- [ ] Audit and version history preserve significant changes.
- [ ] Empty, warning, error, and recovery states are truthful and usable.
- [ ] Automated tests and browser acceptance pass.
- [ ] Existing Learning Studio root behavior and CI remain intact.
- [ ] Documentation, source paths, test evidence, and release status agree.

## 16. Verification and release status model

Use explicit evidence levels:

- **L0 — Specified:** requirement and acceptance criteria documented.
- **L1 — Implemented:** source code exists; execution not yet established.
- **L2 — Tested:** applicable automated or manual tests executed and passed.
- **L3 — Verified:** acceptance evidence reviewed against the requirement.
- **L4 — Production-ready:** security, recovery, operational, release, and deployment gates approved.

A higher level requires evidence for the lower levels. A document, successful commit, passing build, or screenshot alone does not establish production readiness.

## 17. Known gaps and explicit non-claims

1. The supplied screenshot defines the target experience; it does not prove the complete 13-module website is already implemented.
2. The inspected v1 schema registry does not yet include an Event schema.
3. The current local-first prototype is not a multi-user or cross-device synchronized service.
4. The local validator is not a server-side security boundary.
5. The repository root remains Learning Studio; WorldForge must remain isolated within its preserved project area.
6. Historical Supabase artifacts do not authorize Supabase as a current dependency.
7. PR #7 is not treated as merged or production-ready.
8. No deployment, production approval, or canonization is implied by this specification.

## 18. Change control and documentation synchronization

- This specification is versioned independently of application releases.
- Every implementation change affecting routes, schemas, governance, persistence, or acceptance criteria must update the relevant source documentation and tests.
- GitHub is the source-code authority; Notion is the documentation and project-record authority.
- The Notion page must identify the corresponding GitHub path, branch, version, and commit.
- A discrepancy must be recorded and reconciled; do not silently choose whichever version is more convenient.
- Preserve prior versions and implementation records for traceability.
- New capabilities remain proposed until implemented and verified.

**Architecture directive:** Develop freely. Distinguish clearly. Canonize deliberately. Verify continuously.
