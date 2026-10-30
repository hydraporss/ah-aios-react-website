<!-- Notion source page 40966662-b29d-81bb-8359-e93d885d7764; original path README.md; export date 2026-10-30 -->

<b>Repository:</b> [hydraporss/ah-aios-react-website](https://github.com/hydraporss/ah-aios-react-website)

<b>Branch:</b> `main`

<b>Path:</b> `README.md`

<b>Git blob SHA:</b> `4a99342dfed4eab085162f22b464540e5cc99612`

<b>Export:</b> Complete fetched UTF-8 source content follows.

---

# AH-AIOS WorldForge React Website

## Overview

AH-AIOS WorldForge is a React-based prototype for structured worldbuilding workflows, dashboard-driven creation experiences, and deterministic prompt-to-page generation.

The current release combines browser-local prototype workflows with a separate React-to-Django Server Governance path. The latter has session authentication and server-side authorization in code, but has not passed browser-to-backend acceptance or production deployment review. Live Hermes connectivity and AI model generation are not present.

---

## Included Features

### Dashboard

- Responsive AH-AIOS WorldForge landing dashboard
- World activity overview and creation-stage display
- Recent worlds and activity feed
- Mobile-friendly navigation

Dashboard figures are synthetic examples.

### Prompt Builder

- Enter a world brief
- Generate a responsive landing-page preview
- Download a React component starter (`.jsx`)
- Deterministic local template generation

### World Model (v0.2 prototype)

Supports sample and user-created records for:

- World
- Nation
- Character
- Faction
- Location
- Historical Event

Capabilities:

- Create draft records
- Search and filter records
- Save records in the current browser profile using `localStorage`

### Additional Local Workflow Prototypes

- Create, validate, filter, browse, and remove typed relationships between records
- Inspect an entity connection view with incoming and outgoing links, source references, claims, and local history
- Register source references and link them to records
- Record claims against entities, link sources with author-entered assessments, review claim status transitions, and retain version history
- Submit and review change proposals for protected claims; approved proposals create a new version, stale proposals become Conflict, and rollback restores prior content as a new version
- Create first-class evidence records linking claims and sources, version assessment/notes, and record evidence reviews
- Attach source references directly to relationships
- Inspect claim review history and prior entity versions
- Move canon records through Draft → Proposed → Investigated → Validated → Approved, with Rejected and Superseded outcomes
- Record reviewer rationale and view per-record approval history
- Submit and review change requests for approved records, retaining prior versions
- View a browser-stored activity history
- Import and export a workspace JSON bundle
- Generate six proposed draft records from a prompt using deterministic templates

These are local demonstrations. They do not enforce organizational authority or connect to shared platform services.

### Analytics Dashboard

Illustrative trend, weekly activity, and workflow-stage visualizations implemented with SVG and CSS. No production data source is connected.

### Accessibility & Responsiveness

- Mobile navigation
- Keyboard focus states
- Reduced-motion support
- Responsive layouts

---

## Running Locally

### Requirements

- Node.js 20.19+ or
- Node.js 22.12+

The recommended local/deployment runtime is Node.js 22 with pnpm 11. The supported Node range is declared in `package.json`; `.nvmrc` selects Node 22. The committed `pnpm-lock.yaml` is the dependency lockfile.

### Install

```powershell
pnpm install --frozen-lockfile
```

### Start Development Server

```powershell
pnpm dev
```

Open the Vite development URL displayed in the terminal.

### Production Build

```powershell
pnpm build
pnpm preview
```

`pnpm preview` serves the generated `dist/` build locally for a release smoke check. It is not a production server. The current application uses in-app state navigation rather than URL routes, so it does not need a single-page-app rewrite rule.

### Static deployment

The project includes `netlify.toml` for a static Netlify build (`pnpm build`, publish `dist`) and `.github/workflows/deploy.yml` for GitHub Pages. When GitHub Actions builds the `ah-aios-react-website` repository, Vite uses `/ah-aios-react-website/`; local builds and Netlify builds use `/`. The workflow uses pnpm and the committed `pnpm-lock.yaml`.

To publish with GitHub Pages, put this project in a GitHub repository, push the `main` branch, then set <b>Settings → Pages → Build and deployment → Source</b> to <b>GitHub Actions</b>. The workflow deploys on pushes to `main` and can also be run manually from the Actions tab. GitHub Pages is configured for this repository and publishes the `dist/` output through GitHub Actions. The latest recorded successful deployment is commit `118da62`; see the [After Humanity page preservation README](docs/after-humanity/README.md) and [deployment run](https://github.com/hydraporss/ah-aios-react-website/actions/runs/40628824210).

Deploy from source with a fresh frozen-lockfile install and serve the site over HTTPS. For any other static host, configure its build command and output directory to match `netlify.toml` (`pnpm build`, `dist`).

Before calling a release production-ready, open the production preview and hosted URL, check browser console and asset requests, exercise the core workflows, and verify representative v2–v5 import/export round trips, keyboard use, mobile layouts, and recovery from storage errors. A successful build alone does not verify these behaviors. GitHub Pages is deployed; production governance and full browser acceptance are still separate, unverified properties.

---

## Project Status

### Implemented in the browser prototype

- Responsive dashboard and mobile navigation
- Deterministic prompt builder and landing-page preview
- React component export
- World Model record creation, search, filtering, and browser persistence
- Typed relationships, validation, filtering, and entity connection views
- Source registry and record evidence links
- Sequential local canon workflow with reviewer notes and approval history
- Decision proposals and local activity history
- JSON workspace import/export
- Deterministic prompt-to-record templates

### Prototype and server-backed boundaries

The main World Model, relationship, source, canon, and decision screens remain browser-local. A separate <b>Server Governance</b> page calls the Django API for server-backed workspaces, claims, evidence, proposals, decisions, and archive export. The Django service is an implemented local backend foundation; the React page is integrated with it for local acceptance work. It is hidden in the GitHub Pages build because that static deployment does not include the Django service. The browser-local prototype pages do not synchronize with or authorize against that service.

The following are not established as production capabilities:

- Deployed/shared backend service and configured production database
- Enterprise identity (SSO/MFA) or production authorization assurance
- User-configurable relationship schema rules
- Advanced relationship governance controls
- Production-grade, independently protected audit retention
- Enforced Refraction review process
- Live Hermes integration
- AI-assisted generation or external model calls
- Multi-user synchronization

The Django API does enforce session identity and workspace membership for its protected endpoints. Its audit chain is tamper-evident while the signing key remains secret, not immutable against an administrator who can rewrite both database and key. Browser-to-backend acceptance and deployment of this API with production configuration remain unverified.

### Capability Maturity

| Area | Status |
| --- | --- |
| UI Prototype | Implemented |
| Local World Model | Implemented |
| Relationship Registry & Explorer | Prototype |
| Source Registry | Prototype |
| Claim Registry & Review | Prototype |
| Claim Provenance | Prototype |
| Evidence Registry & Reviews | Implemented Prototype |
| Version Comparison | Implemented Prototype |
| Canon Labels | Prototype |
| Decision Proposals | Prototype |
| Local Canon Transition Workflow | Prototype |
| Change Requests & Review History | Prototype |
| Browser-local Approval Enforcement | Prototype |
| Django API Authorization | Implemented; browser acceptance pending |
| Audit Lineage | Browser prototype plus Django signed audit chain; production integrity pending |
| Identity & Roles | Django session identity and per-world roles implemented; enterprise identity pending |
| Hermes Integration | Planned |
| AI Generation | Planned |

## Governance Maturity

| Capability | Current browser prototype | v0.3 progress | Production requirement |
| --- | --- | --- | --- |
| Knowledge structure | Local entities and validated typed links | Explorer and entity connection views | Shared, versioned schema and integrity constraints |
| Canon workflow | Local transitions plus separate Django API transitions | Prototype workflow plus server-side API capability checks | Accepted end-to-end authorization and production role governance |
| Evidence | First-class evidence records, versioned evidence assessments, evidence reviews, and evidence lineage | Sprint 2 evidence registry and review flow implemented in the local prototype | Durable provenance, access controls, and retention policy |
| Decisions | Local proposals and basic outcomes | Decision history tied to canon transitions | Approved authority, durable records, and appeal/supersession rules |
| Lineage | Browser-stored relationship and governance events | Exported local histories | Tamper-resistant audit storage and operational monitoring |
| Persistence | Browser profile for prototype screens; Django database for Server Governance | Local prototype persistence plus API-backed records | Accepted archive-wide synchronization, managed backups/recovery, and supported multi-user operations |

This matrix separates the browser-local prototype, the Django API foundation, and production controls. The API enforces identity and authority for API mutations; the browser-local flows do not. The end-to-end workflow and production deployment have not passed acceptance.

## v0.3 Progress: Relationship and Canon Integrity

### Application-layer canon transition policy

Canon state changes now pass through a pure application-layer policy function before React state is updated. The policy rejects unknown actors, missing rationales, invalid state transitions, and role/capability mismatches. Creator, Reviewer, and Canon Authority demo roles have distinct transition capabilities. The same guard is applied to approved-record change requests and protected-claim change proposal decisions. Node's built-in test runner covers unauthorized approval, authorized approval with a recorded actor and rationale, invalid transition order, and missing rationale; `pnpm test` runs these tests, and CI runs them before the production build.

The role selector is explicitly a <b>simulated identity</b>. Any browser user can select another demo role or edit local code/storage; there is no authentication, server-side authorization, signed identity, or authoritative canon service. These changes demonstrate application policy behavior and prevent accidental UI-path bypasses, but they do not establish production governance or security. Browser-local audit and recovery limits described below remain.

The current work advances relationship and canon integrity before adding AI capabilities.

### Implemented in the local v0.3 prototype

- Relationship creation checks that both endpoints exist and the type is registered.
- Self-links and duplicate directed links are blocked; orphaned imported links are flagged and hidden from the explorer.
- The relationship registry supports category filtering, text search, endpoint navigation, editing with semantic endpoint validation, removal, local version snapshots, source links, and reviewer-rationale status transitions. Registered relationship types enforce allowed source and target record types; these are prototype domain rules, not configurable schema constraints.
- Entity detail views show incoming and outgoing connections, linked sources, claims, and local history.
- Canon transitions follow the defined sequence and require a reviewer name and rationale.
- Transition history is retained as separate review records. Approved records can receive proposed change requests; approved changes create a new local version.
- Workspace JSON exchange carries review and change-request records alongside relationships and audit events.

These controls demonstrate an interaction model only. They do not provide an authenticated reviewer, an immutable audit store, or enforceable approval authority.

### v0.4 provenance work in progress

- Claims retain stable IDs, append-only version snapshots, and version-to-audit event links. Draft and Proposed claims can be directly revised; every review status transition also creates a version.
- Protected claims can be changed through a separate proposal and reviewer-rationale flow. Approval creates a new Approved version; rejection leaves the claim unchanged; stale proposals are marked Conflict. Rollback creates a new version from an earlier snapshot and does not erase history.
- Claim review transitions retain reviewer rationale and are included in local review and audit records. Claims can be linked to decision proposals, and the claim registry opens the decision register filtered to linked decisions.
- The Provenance Timeline presents chronological, filterable events with event details, date range, reviewer, entity, claim, evidence, and decision filters, and links to originating objects. Filter choices persist when returning from linked pages.
- Relationship records can cite sources; source registry counts show record, claim, and relationship links.
- Entity details display prior record versions created through approved change requests.
- Version 4 workspace exports include claim snapshots, claim change proposals, reviews, and linked audit events. Version 2 and 3 bundles remain importable with legacy claim normalization.

Evidence assessments are explicit labels (Supports, Contradicts, Contextual, or Unassessed); the prototype does not calculate confidence scores or verify sources.

### Remaining relationship validation work

- Both referenced entities must exist.
- Relationship types must come from the approved type registry.
- A record cannot relate to itself unless that relationship type explicitly allows it.
- Relationship edits revalidate endpoints and registered type-specific endpoint rules, then create a new local version and reset review status to Draft. The built-in rules are illustrative and not user-configurable.
- Approved records must not be edited directly; use a change request.

### Canon workflow boundaries and follow-on work

Target states:

```txt
Draft → Proposed → Investigated → Validated → Approved
                         ├── Rejected
                         └── Superseded
```

The prototype implements this workflow sequence, records each reviewer transition with its rationale and date, and retains local history. It does not provide authenticated reviewers, enforceable authority, immutable audit storage, or production governance controls.

Each transition creates a separate local review record rather than overwriting earlier decisions. Browser-local storage does not make these records tamper-resistant or immutable against direct storage edits.

```json
{
  "decisionId": "decision-identifier",
  "entityId": "entity-identifier",
  "fromState": "Validated",
  "toState": "Approved",
  "reviewer": "reviewer-identifier",
  "decisionDate": "2026-10-27T12:00:00Z",
  "rationale": "Recorded approval rationale"
}
```

### v0.3 definition of done

- [x] Registered relationship schema and core endpoint/type validation
- [x] Relationship explorer with search, category filters, and removal
- [x] Entity connection view
- [x] Canon state transitions with reviewer notes
- [x] Decision and approval history for each transition
- [x] Change requests for approved records
- [x] Local lineage trail includes relationship and governance events
- [x] JSON export includes governance and review records
- [x] Relationship editing with built-in endpoint validation
- [x] Domain-specific endpoint constraints
- [ ] Browser interaction review across desktop and mobile layouts

---

## Implementation Boundaries

### Prompt and Draft Generation

Prompt-to-site and prompt-to-record features use local deterministic templates.

- No LLM integration
- No ChatGPT integration
- No remote AI service calls

Generated content uses inferred titles and starter copy. The downloaded `.jsx` file is a React component starter, not a complete project repository, deployment package, or production-ready application.

### World Model and Local Workflows

WorldForge data consists of sample fixtures and user-created local records. Persistence is limited to the current browser profile through `localStorage`.

The application displays a persistent notice that workspace data stays in this browser. It is not automatically synchronized or backed up online. Export workspace JSON regularly and keep the backup somewhere safe. Clearing this site's browser data or losing access to the browser profile can remove the local workspace. Browser-local storage is not encrypted, tamper-proof, or suitable for secrets or collaborative records.

The browser-local pages have no server synchronization or multi-user collaboration. A separate Django API mode is available on the <b>Server Governance</b> page and persists its own records in the configured backend database; it is not a sync layer for the browser-local workspace. New local records begin with:

```txt
Status: Draft
Canon State: Proposed
```

The basic relationship, evidence, canon, decision, and history screens demonstrate interaction concepts. They do not provide enforced governance or authenticated identities; their history can be changed or removed through browser storage controls. The separate Django Server Governance page uses authenticated API operations, but its complete browser-to-backend acceptance remains unverified.

The Hermes exchange is versioned JSON file import/export only. It does not connect to a Hermes service. Import replaces the current browser workspace data; export a backup before importing if you need to preserve it.

### External Services

The application does not use external LLM services, ChatGPT APIs, image-generation services, remote fonts, or third-party charting platforms. Existing canon and source materials are not modified.

---

## Project Structure

```txt
src/
├── App.jsx
├── ServerGovernancePage.jsx
├── governance.js
├── styles.css
└── main.jsx

tests/
├── governance.test.js
└── e2e-governance.mjs

index.html
```

### File Descriptions

#### `src/App.jsx` and `src/governance.js`

`App.jsx` contains navigation and the browser-local prototype workflows. `governance.js` contains the local policy helpers.

#### `src/ServerGovernancePage.jsx`

Contains the separate Django API client UI for authenticated server workspaces, claims, evidence, proposals, decisions, reload, and archive export.

#### `src/styles.css`

Contains the design system, responsive layouts, accessibility styling, and component styling.

#### `src/main.jsx`

React application entry point.

#### `index.html`

Vite document shell.

---

## v0.4 planning documents

- [After Humanity page preservation notes](docs/after-humanity/README.md)
- [Sprint 1 contract, Sprint 2 evidence schema and plan, and v0.4 acceptance checklist](docs/v0.4-sprint-1-and-acceptance.md)
- [v0.4 end-to-end acceptance and audit record](docs/v0.4-end-to-end-acceptance.md)

## Planned Roadmap

### v0.3-beta — Relationship Explorer and Canon Workflow

- Relationship editing and built-in type-specific endpoint validation are implemented in the local prototype.
- Browser interaction review across desktop and mobile layouts remains open.
- Reassess the v0.3 definition of done after visual review

### v0.4 — Claims, Provenance, and Evidence Lineage

- Sprint 1 implemented: claim version snapshots, protected-state change proposals, proposal review, rollback as a new version, conflict detection, and v4 exchange migration.
- Sprint 2 implementation in code: first-class Evidence Registry, evidence versions and reviews, legacy evidence migration, audit events, and v5 exchange. Production build passes; desktop/mobile, keyboard, and round-trip acceptance reviews remain open.
- Sprint 3 implementation in code: navigable Provenance Timeline with combined type/object/reviewer/date filters, event detail drawer, stable chronological ordering, and object navigation. Build passes; browser review and v2-v5 export/import acceptance remain open.
- Sprint 4 implementation in code: read-only side-by-side claim, relationship, evidence, and entity comparisons with added/removed/changed field labels; claim-to-decision and decision-to-claim navigation. Build passes; visual, mobile, keyboard, and long-content acceptance reviews remain open.
- Server Governance integration: React page and Django session-backed API are present in code. The page is available in local development for acceptance work and hidden in the static GitHub Pages build until Django is deployed. Automated API checks passed as reported; the full browser-to-backend acceptance gate remains unverified because Edge automation could not run.
- Sprint 5: add provenance metrics for claim states, evidence assessments, version activity, and pending reviews.
- End-to-end React-to-Django browser acceptance, production deployment configuration, and independent audit retention remain open.

### v0.5 — Decision Register Maturity

- Decision lifecycle and supersession
- Authority basis, alternatives, and evidence requirements
- Governance review process

### v0.6+ — Platform Integrations

- Live Hermes integration, subject to an approved API and security design
- Conversational world queries
- AI-assisted world generation, subject to approved model and data policies

## Capability progression

<b>Release classification:</b> AH-AIOS WorldForge v0.3-beta remains the browser-local prototype for structured entities, relationships, sources, canon and decision workflows, version history, deterministic generation, and JSON exchange. The v0.4 React application also contains a separate Server Governance page integrated in code with a Django API for server-backed workspaces, claims, evidence, proposals, decisions, and archive export. Django session identity and per-world authorization protect API mutations; Playwright browser acceptance remains unverified, so the integrated workflow is not accepted end to end. Django's signed audit chain is tamper-evident under its key-protection assumption, not immutable against an administrator controlling database and key. The browser-local screens are not synchronized with the Django records. Browser layout/accessibility and v2-v5 exchange acceptance remain open; provenance metrics remain planned. No live Hermes integration is present.

WorldForge can currently be described as a <b>browser-local prototype for structured worldbuilding, relationship management, and governance workflow exploration</b>.

The browser-local experience is a <b>governed knowledge-model prototype</b>. The separate API is a <b>server-backed governance foundation</b> with application-level identity and authority checks. The <b>AH-AIOS World Operating System platform</b> description still requires accepted end-to-end behavior, production deployment and identity assurance, connected archive persistence, durable independent audit retention, and Hermes integration.
