# AH-AIOS CORE — Complete Workbench Specification & Technical Architecture

**Document ID:** AH-CORE-ARCH-001 | **Version:** 1.0-Draft | **Classification:** Proposed Architecture Specification | **Domain:** AH-AIOS CORE

**Document purpose:** Define the complete functional, technical, security, governance, and operational architecture of the AH-AIOS CORE Workbench. This document is intended as the primary implementation specification for development, including use by Claude as an engineering implementation assistant.

**Document status:** Proposed Architecture Specification. This document does not independently authorize canon changes or claim that the described capabilities have been implemented, tested, or deployed.

---

## 1. SYSTEM DEFINITION

### 1.1 What is AH-AIOS CORE?

AH-AIOS CORE is the foundational control, governance, security, and assurance domain of the AFTER HUMANITY AI Operating System.

CORE establishes the conditions under which the entire AH-AIOS ecosystem is identified, accessed, authorized, configured, governed, monitored, audited, and verified.

It provides the common institutional and technical foundation that allows the other AH-AIOS domains to operate under consistent authority, security, accountability, and evidence requirements.

CORE is not simply an administration dashboard. It is the central control environment of the AH-AIOS ecosystem.

Its responsibilities include:

- System identity and registration.
- User and organizational identity.
- Authentication and session security.
- Authorization and permission enforcement.
- Governance policies and authority management.
- Security controls and incident management.
- Configuration and secrets management.
- Infrastructure and foundational services.
- Audit and accountability.
- Evidence and verification.
- Risk and compliance.
- Controlled changes and release assurance.
- Cross-domain authorization and control.

### 1.2 AH-AIOS three-domain architecture

AH-AIOS consists of three distinct but integrated domains.

**AH-AIOS CORE** — Foundational Control · Governance · Security · Assurance

**AI HARNESS** — AI execution, orchestration, automation, agents, tools, and workflows.

**WORLDFORGE** — Knowledge intelligence, world models, entities, relationships, evidence, and canon governance.

Human stewardship and accountability apply across all three domains.

**Domain responsibilities**

| Domain | Governing responsibility |
|---|---|
| CORE | Establishes authority, identity, security, policy, audit, and assurance. |
| HARNESS | Executes bounded AI operations under CORE controls. |
| WORLDFORGE | Structures, connects, preserves, and governs knowledge. |

The domains exchange controlled requests, decisions, records, and evidence.

#### 1.2.1 CORE authority boundary

CORE is the governing control domain. It does not absorb the responsibilities of the other domains.

- CORE establishes permissions; HARNESS uses them.
- CORE establishes security requirements; each domain enforces applicable controls within its own environment.
- CORE defines system-wide governance boundaries; WORLDFORGE manages knowledge and canon workflows within those boundaries.
- CORE receives audit events and verification evidence; domain services remain responsible for generating accurate operational records.
- CORE can deny or suspend access when required by policy.
- CORE cannot independently declare a knowledge claim or creative interpretation to be established canon.

### 1.3 Architectural principles

The CORE architecture follows these principles:

1. **Authority Before Execution** — consequential actions require valid authority.
2. **Identity Before Authorization** — access decisions must refer to a verified identity or explicitly defined service principal.
3. **Least Privilege** — every identity receives only the permissions required for its assigned responsibilities.
4. **Separation of Duties** — critical actions must not depend on unrestricted authority held by one actor.
5. **Governance by Enforcement** — policies must be enforced by services, not merely displayed in documentation.
6. **Evidence-Based Assurance** — operational claims require supporting evidence.
7. **Traceable Change** — material changes must retain their origin, rationale, authorization, and history.
8. **Secure by Default** — unconfigured or invalid permissions must fail closed.
9. **Controlled Integration** — domains communicate through defined interfaces and authorization boundaries.
10. **Recoverability** — critical services and records must have documented backup and recovery procedures.
11. **Human Accountability** — automation does not eliminate responsibility for consequential decisions.
12. **Explicit Status** — proposed, implemented, verified, and operational capabilities must remain distinguishable.

---

## 2. CORE WORKBENCH OVERVIEW

### 2.1 Workbench definition

The AH-AIOS CORE Workbench is the administrative and operational interface through which authorized users manage the foundational control environment of AH-AIOS.

It provides:

- Centralized system administration.
- Identity and access management.
- Policy and governance administration.
- Security monitoring.
- Configuration management.
- Infrastructure visibility.
- Audit inspection.
- Evidence and verification management.
- Risk and compliance management.
- Controlled change and release management.
- Cross-domain system oversight.

The Workbench must provide a unified experience while preserving the independence and boundaries of the three AH-AIOS domains.

### 2.2 Primary navigation — 13 modules

The proposed primary navigation consists of thirteen modules.

| # | Module | Primary function |
|---|---|---|
| 01 | CORE Dashboard | Overall system visibility and operational status |
| 02 | System Identity | System identity, registration, architecture, and environment |
| 03 | Users & Organizations | User lifecycle, organizations, teams, and membership |
| 04 | Identity & Authentication | Login, authentication, sessions, and account protection |
| 05 | Roles & Permissions | Roles, access policies, and permission enforcement |
| 06 | Governance Center | Policies, authority, decisions, and governance workflows |
| 07 | Security Center | Security posture, incidents, vulnerabilities, and controls |
| 08 | Configuration & Secrets | Environment configuration and protected secrets |
| 09 | Infrastructure & Services | Service registry, health, dependencies, and infrastructure |
| 10 | Audit & Accountability | System activity, event records, and accountability |
| 11 | Evidence & Verification | Evidence registry, tests, verification, and provenance |
| 12 | Risk & Compliance | Risk register, compliance controls, exceptions, and remediation |
| 13 | Change & Release Management | Change requests, approvals, versions, deployment, and rollback |

### 2.3 Global workbench interface

Every module must follow a consistent application shell.

**A. Global navigation**

The navigation panel contains:

- AH-AIOS CORE identity and logo.
- CORE Dashboard.
- Thirteen primary module links.
- Active module indicator.
- Expandable navigation groups where needed.
- User profile and account menu.
- System environment indicator.

**B. Global header**

The header contains:

- Current module title.
- Breadcrumb navigation.
- Global search.
- Notification center.
- Pending approval indicator.
- System health indicator.
- User identity and role.
- Help and documentation access.

**C. Main workspace**

The workspace supports:

- Dashboard cards.
- Data tables.
- Detail views.
- Record creation and editing.
- Search and filters.
- Approval workflows.
- Activity history.
- Evidence attachments.
- Configuration panels.
- Context-sensitive actions.

**D. Global status indicators**

Use consistent status labels:

| Status | Meaning |
|---|---|
| Draft | Record is being prepared. |
| Proposed | Submitted for consideration. |
| Under Review | Awaiting assessment. |
| Approved | Authorized by the required authority. |
| Rejected | Not approved. |
| Implemented | Change has been applied. |
| Verified | Supporting verification has passed. |
| Operational | Meets applicable operational requirements. |
| Suspended | Temporarily disabled. |
| Deprecated | Retained but no longer recommended. |
| Retired | No longer active. |

A status transition must be recorded and authorized where applicable.

### 2.4 User experience requirements

The interface must be:

- Responsive on desktop, tablet, and mobile.
- Keyboard accessible.
- Consistent across all thirteen modules.
- Searchable and filterable.
- Explicit about permissions and unavailable actions.
- Clear about pending approvals and unresolved issues.
- Capable of showing record history and provenance.
- Designed to avoid destructive actions without confirmation.
- Capable of exporting authorized records and reports.

The desktop experience is the primary administration environment. Mobile support must preserve essential inspection, approval, and incident-response functions.

---

## 3. MODULE 01 — CORE DASHBOARD

### 3.1 Purpose

The CORE Dashboard provides the central operational overview of AH-AIOS.

It answers:

- Is the system healthy?
- Which services are operational?
- Are there security incidents?
- Are there pending approvals?
- Are governance controls functioning?
- Are verification tasks passing?
- Are there unresolved risks?
- Have any critical changes occurred?

### 3.2 Dashboard components

**System overview** — Display:

- System name and version.
- Active environment.
- Current deployment version.
- System availability.
- Service health.
- Last successful backup.
- Last verification run.
- Last configuration change.

**Domain status** — Display independent status for:

- AH-AIOS CORE.
- AI HARNESS.
- WORLDFORGE.

Each domain must report its own health and implementation status. CORE must not infer that a domain is operational merely because its connection responds.

**Security overview** — Display:

- Open security incidents.
- Critical vulnerabilities.
- Failed authentication attempts.
- Suspicious access patterns.
- Active account suspensions.
- Security policy violations.

**Governance overview** — Display:

- Policies awaiting review.
- Pending approvals.
- Expiring exceptions.
- Unresolved governance findings.
- Recent authorization decisions.

**Verification overview** — Display:

- Latest automated test results.
- Failed verification checks.
- Unverified capabilities.
- Overdue verification tasks.
- Evidence awaiting review.

**Audit activity** — Display recent:

- Authentication events.
- Authorization decisions.
- Administrative changes.
- Configuration changes.
- Security events.
- Cross-domain actions.

### 3.3 Dashboard filters

Users may filter dashboard information by:

- Time period.
- Domain.
- Environment.
- Severity.
- Status.
- Organization.
- Service.

### 3.4 Dashboard actions

Authorized users may:

- Open detailed service health.
- Inspect a security incident.
- Review an approval request.
- Open a verification report.
- Inspect an audit event.
- Navigate to an affected module.

Dashboard cards are informational entry points. They must not bypass the permission checks of the underlying module.

### 3.5 Acceptance criteria

- Dashboard loads without exposing unauthorized information.
- Domain status is sourced from domain health records.
- Critical incidents are prominently visible.
- Pending approvals are accurate.
- Dashboard metrics identify their reporting period and source.
- Failed data retrieval is displayed as unavailable, not as a false healthy state.

---

## 4. MODULE 02 — SYSTEM IDENTITY

### 4.1 Purpose

System Identity establishes the identity and registration of the AH-AIOS installation.

It ensures that services, domains, environments, integrations, and audit events can be associated with the correct system.

### 4.2 Functional areas

**System registration** — Manage:

- System identifier.
- System name.
- System description.
- System owner.
- Registration date.
- System version.
- Deployment status.
- Architecture version.

**Domain registration** — Register:

- CORE.
- HARNESS.
- WORLDFORGE.

Each domain record contains:

- Domain identifier.
- Domain name.
- Description.
- Domain owner.
- Service endpoint references.
- Integration status.
- Domain version.
- Current operational status.
- Last successful health check.

**Environment registry** — Support:

- Development.
- Testing.
- Staging.
- Production.

Each environment must have an independent identifier and configuration.

Development credentials must never be silently reused in production.

**Service identities** — Register non-human identities for:

- Backend services.
- Automation processes.
- Scheduled jobs.
- API integrations.
- Internal service-to-service communication.

Service identities must have explicit scopes and expiration or rotation requirements.

### 4.3 Architecture registry

Maintain records for:

- System architecture.
- Domain architecture.
- Service architecture.
- API contracts.
- Database schemas.
- Integration contracts.
- Deployment architecture.
- Architecture decisions.

Each architecture record must include version, owner, status, source, and approval history.

### 4.4 Acceptance criteria

- Every registered domain has a unique identifier.
- Every environment has independent configuration.
- Service identities are distinguishable from human users.
- Architecture records preserve version history.
- No registration record automatically grants execution or administrative authority.

---

## 5. MODULE 03 — USERS & ORGANIZATIONS

### 5.1 Purpose

Manage human identities and organizational relationships across AH-AIOS.

### 5.2 User management

The module must support:

- User creation.
- Invitation.
- Account activation.
- Profile updates.
- Account suspension.
- Account deactivation.
- Account recovery.
- Account deletion or anonymization where legally and operationally appropriate.
- User status inspection.
- User activity history.

**User profile fields**

- User ID.
- Display name.
- Email address.
- Organization ID.
- Account status.
- Authentication status.
- Assigned roles.
- Creation date.
- Last login.
- Last profile update.

Sensitive authentication data must not be stored in ordinary profile records.

### 5.3 Organization management

Support:

- Organization creation.
- Organization profiles.
- Organizational membership.
- Team creation.
- Team membership.
- Organization-level roles.
- Organization status.
- Organization activity.

### 5.4 Membership lifecycle

Proposed lifecycle:

`Invited → Pending Acceptance → Active → Suspended → Deactivated`

A user may belong to multiple organizations, subject to explicit membership and authorization rules.

### 5.5 User administration controls

- Administrators cannot grant themselves higher privileges without the required approval.
- Organization administrators cannot access unrelated organizations.
- Suspended users cannot perform protected actions.
- Account removal must preserve required audit and legal records.
- Membership changes must generate audit events.

### 5.6 Acceptance criteria

- User identities are unique.
- Membership is explicitly scoped.
- Organization boundaries are enforced.
- Account lifecycle changes are auditable.
- Deactivated identities cannot obtain new access tokens.

---

## 6. MODULE 04 — IDENTITY & AUTHENTICATION

### 6.1 Purpose

Provide secure identity verification and session management.

Identity, authentication, and authorization are separate capabilities:

- Identity identifies the actor.
- Authentication verifies the actor.
- Authorization determines what the actor may do.

### 6.2 Authentication methods

The architecture should support:

- Email and password authentication.
- Secure password recovery.
- Multi-factor authentication.
- Passkeys or WebAuthn where supported.
- OAuth or OpenID Connect integration.
- Enterprise single sign-on as a future integration.
- Service-to-service authentication.

The implementation must use a trusted authentication provider or a security-reviewed authentication service rather than inventing custom cryptographic mechanisms.

### 6.3 Session management

Support:

- Session creation.
- Session expiration.
- Session revocation.
- Logout.
- Concurrent session visibility.
- Device/session inspection.
- Refresh-token rotation.
- Suspicious-session invalidation.

Session cookies must use appropriate Secure, HttpOnly, and SameSite settings when cookie-based authentication is used.

### 6.4 Authentication protection

Implement:

- Rate limiting.
- Brute-force protection.
- Credential-stuffing mitigation.
- Secure password hashing through a proven library or provider.
- MFA enforcement for privileged roles.
- Login anomaly monitoring.
- Account recovery controls.
- Secure token storage.

### 6.5 Authentication event records

Record:

- Actor or attempted identity.
- Event type.
- Timestamp.
- Result.
- Authentication method.
- Session identifier reference.
- Source metadata where appropriate.
- Risk classification.

Do not store plaintext passwords, full authentication tokens, or secrets in logs.

### 6.6 Acceptance criteria

- Protected routes reject unauthenticated users.
- Expired and revoked sessions cannot access protected resources.
- Privileged accounts require stronger authentication.
- Authentication events are auditable.
- Failed authentication does not reveal whether an account exists.

---

## 7. MODULE 05 — ROLES & PERMISSIONS

### 7.1 Purpose

Control who can access which resources and perform which actions.

### 7.2 Authorization architecture

Use a combination of:

- Role-Based Access Control (RBAC).
- Resource-level permissions.
- Organization and domain scope.
- Attribute-based policy conditions where necessary.

Authorization must be enforced on the server side.

Hiding a button in the frontend is not authorization.

### 7.3 Proposed system roles

| Role | Primary responsibility |
|---|---|
| System Owner | Overall system stewardship and highest authorized administrative responsibility |
| CORE Administrator | CORE configuration and administration |
| Security Administrator | Security controls and incident response |
| Governance Administrator | Policy and governance management |
| Auditor | Read-only audit and evidence inspection |
| Verification Officer | Verification review and evidence assessment |
| Domain Administrator | Administration within an assigned domain |
| Organization Administrator | Management of an assigned organization |
| Standard User | Authorized ordinary application use |
| Service Account | Bounded automated service operations |

These roles are proposed defaults. Final assignments and approval authorities must be configured explicitly.

### 7.4 Permission model

Permissions follow:

`subject + action + resource + scope + conditions`

Example:

- Subject: CORE Administrator.
- Action: update.
- Resource: security policy.
- Scope: production environment.
- Condition: approved change request exists.

### 7.5 Permission categories

- Read.
- Create.
- Update.
- Delete.
- Approve.
- Reject.
- Suspend.
- Configure.
- Execute.
- Export.
- Administer.

Sensitive permissions must be separated.

Examples:

- Creating a policy does not automatically authorize its approval.
- Creating a user does not automatically permit granting system-owner privileges.
- Initiating a release does not automatically authorize its production deployment.
- Reviewing evidence does not automatically allow its author to approve their own evidence.

### 7.6 Permission administration

Provide:

- Role registry.
- Permission registry.
- Role-to-permission mapping.
- User-to-role assignment.
- Scope configuration.
- Policy conditions.
- Access review.
- Permission history.
- Emergency access management.

### 7.7 Authorization decision flow

1. Identify the requesting actor.
2. Authenticate the actor.
3. Resolve assigned roles and permissions.
4. Identify the target resource.
5. Determine applicable scope.
6. Evaluate policy conditions.
7. Apply separation-of-duties restrictions.
8. Return allow or deny.
9. Record the decision.
10. Execute only if authorized.

### 7.8 Acceptance criteria

- Unauthorized operations are rejected server-side.
- Permissions are scoped.
- Privileged role changes are auditable.
- Denied requests generate appropriate records.
- Separation-of-duties rules are enforced for designated actions.
- Default authorization behavior is deny.

---

## 8. MODULE 06 — GOVERNANCE CENTER

### 8.1 Purpose

The Governance Center manages the rules, authority structures, policies, approvals, and controlled decisions that govern AH-AIOS.

It translates governance requirements into reviewable records and enforceable controls.

### 8.2 Governance registry

Maintain structured records for:

- Governance policies.
- System principles.
- Authority definitions.
- Approval requirements.
- Control requirements.
- Governance decisions.
- Exceptions.
- Compliance obligations.
- Policy revisions.
- Governance reviews.

Each policy record must include:

| Field | Description |
|---|---|
| Policy ID | Unique identifier |
| Title | Policy name |
| Domain | CORE, HARNESS, WORLDFORGE, or cross-domain |
| Description | Policy purpose and scope |
| Owner | Responsible authority |
| Version | Policy revision |
| Status | Draft, proposed, approved, active, suspended, retired |
| Effective date | Date policy becomes effective |
| Review date | Next scheduled review |
| Approval record | Authorizing decision |
| Enforcement reference | Service or control implementing the policy |

### 8.3 Policy lifecycle

`Draft → Proposed → Under Review → Approved → Active → Superseded / Retired`

Rejected and suspended states must also be supported.

Approval must not automatically activate a policy if deployment or enforcement is a separate operation.

### 8.4 Governance workflows

The module must support:

- Policy creation.
- Policy submission.
- Policy review.
- Approval or rejection.
- Policy publication.
- Enforcement mapping.
- Periodic policy review.
- Exception requests.
- Exception assessment.
- Exception approval.
- Exception expiration.
- Policy supersession.

### 8.5 Governance authority registry

Define:

- Decision authority.
- Scope of authority.
- Required approvers.
- Delegation rules.
- Escalation paths.
- Effective periods.
- Revocation conditions.

Authority must be explicitly recorded. A user's job title or administrative role alone must not imply unrestricted authority.

### 8.6 Controlled integration governance

CORE must implement system-wide support for the controlled integration principle:

`RECOVER → CLASSIFY → RECONSTRUCT → COMPARE → TEST → INTEGRATE → AUTHORIZE`

Every material integration or change must preserve:

- Original source.
- Classification.
- Reconstructed content.
- Comparison results.
- Test evidence.
- Integration record.
- Authorization.
- Revision history.

The classification system must distinguish:

- CANON.
- INTERPRETATION.
- SUGGESTION.
- PROCESS.

CORE controls the authority and evidence requirements. WORLDFORGE remains responsible for its knowledge and canon records.

### 8.7 Governance decision records

Every consequential decision must capture:

- Decision ID.
- Subject.
- Decision type.
- Requesting actor.
- Reviewing authority.
- Decision outcome.
- Rationale.
- Supporting evidence.
- Applicable policy.
- Timestamp.
- Effective date.
- Revision or supersession reference.

### 8.8 Acceptance criteria

- Policies have unique identifiers and version history.
- Approval authority is checked before approval.
- Exceptions have explicit scope and expiration.
- Governance decisions retain their rationale and evidence.
- Policy activation can be independently verified.
- No generated content becomes authorized policy or canon merely through generation.

---

## 9. MODULE 07 — SECURITY CENTER

### 9.1 Purpose

The Security Center manages security posture, protective controls, security events, incidents, and remediation across AH-AIOS.

### 9.2 Security dashboard

Display:

- Security posture.
- Critical vulnerabilities.
- Active incidents.
- Unresolved security findings.
- Authentication anomalies.
- Privileged access events.
- Failed security checks.
- Outstanding remediation.
- Security control status.

Security posture must be calculated from actual control evidence, not manually selected labels.

### 9.3 Security domains

**Application security**

- Secure coding requirements.
- Input validation.
- Output encoding.
- CSRF protection where applicable.
- Protection against injection.
- Secure session handling.
- API authorization.
- Dependency vulnerability scanning.
- Secure error handling.

**Infrastructure security**

- Environment isolation.
- Network restrictions.
- Secure deployment configuration.
- Service identity protection.
- Encryption in transit.
- Backup protection.
- Administrative access controls.

**Data security**

- Data classification.
- Encryption at rest where required.
- Access restrictions.
- Retention policies.
- Secure deletion.
- Backup integrity.
- Export controls.

**AI-specific security**

- Prompt-injection defenses at trust boundaries.
- Untrusted document and tool-output handling.
- Model and provider credential protection.
- Tool permission restrictions.
- Sensitive information exposure controls.
- Human approval for consequential external actions.
- Auditability of AI-initiated operations.

### 9.4 Security incident management

Incident lifecycle:

`Detected → Triaged → Investigating → Contained → Remediating → Resolved → Reviewed`

Support:

- Incident registration.
- Severity assignment.
- Incident ownership.
- Evidence collection.
- Containment actions.
- Remediation plans.
- Impact assessment.
- Stakeholder notification.
- Post-incident review.
- Closure approval.

Severity levels:

| Severity | Description |
|---|---|
| Critical | Active compromise or severe system-wide impact |
| High | Significant security exposure |
| Medium | Limited exposure requiring timely remediation |
| Low | Minor weakness or low-impact event |
| Informational | Security-relevant observation |

### 9.5 Vulnerability management

Record:

- Vulnerability ID.
- Affected service or component.
- Severity.
- Source.
- Discovery date.
- Affected version.
- Remediation owner.
- Target remediation date.
- Fix version.
- Verification result.

A vulnerability must not be marked resolved solely because a patch was applied. Verification evidence is required.

### 9.6 Security response controls

Authorized personnel may:

- Suspend an account.
- Revoke sessions.
- Disable a compromised service identity.
- Disable an affected integration.
- Restrict an affected endpoint.
- Initiate incident response.
- Request emergency changes.

Emergency actions must be logged and reviewed after execution.

### 9.7 Acceptance criteria

- Security events are recorded.
- Incident lifecycle transitions are controlled.
- Critical findings cannot disappear without closure evidence or an authorized exception.
- Credentials are not exposed in logs or UI responses.
- Security actions are permission-checked.
- Security findings can be traced to affected services and remediation records.

---

## 10. MODULE 08 — CONFIGURATION & SECRETS

### 10.1 Purpose

Provide controlled management of application settings, environment configuration, and sensitive credentials.

### 10.2 Configuration registry

Support:

- System settings.
- Domain settings.
- Service settings.
- Environment settings.
- Integration settings.
- Feature flags.
- Operational parameters.

Every configuration record should include:

- Configuration ID.
- Key.
- Description.
- Value or protected reference.
- Environment.
- Owner.
- Version.
- Status.
- Last modified by.
- Last modified date.

### 10.3 Environment separation

Maintain distinct configurations for:

- Development.
- Testing.
- Staging.
- Production.

The system must prevent accidental cross-environment credential reuse.

### 10.4 Secrets management

Secrets include:

- API keys.
- Database passwords.
- OAuth client secrets.
- Signing keys.
- Encryption keys.
- Service credentials.
- Webhook secrets.

Requirements:

- Do not store secrets in source code.
- Do not expose secrets in browser-delivered configuration.
- Use a dedicated secrets manager or secure server-side secret store.
- Encrypt secrets at rest.
- Restrict secret access to authorized service identities.
- Rotate credentials.
- Record secret access metadata.
- Never log plaintext secrets.
- Support revocation and replacement.

### 10.5 Configuration change workflow

1. Create a configuration change.
2. Validate the requested value.
3. Check permission and scope.
4. Determine whether approval is required.
5. Approve if required.
6. Apply the configuration.
7. Verify the resulting state.
8. Record the result and audit event.

### 10.6 Feature flags

Feature flags must support:

- Enable/disable.
- Environment scope.
- Domain scope.
- User or organization targeting where justified.
- Scheduled activation where supported.
- Rollback.
- Change history.

Feature flags must not be treated as substitutes for authorization.

### 10.7 Acceptance criteria

- Configuration is environment-scoped.
- Secret values are never returned to unauthorized clients.
- Changes are auditable.
- Invalid configurations are rejected.
- Production configuration changes follow the required approval workflow.
- Rollback restores a previously verified configuration version.

---

## 11. MODULE 09 — INFRASTRUCTURE & SERVICES

### 11.1 Purpose

Provide visibility and administrative control over the services required by AH-AIOS.

### 11.2 Service registry

Maintain records for:

- CORE services.
- HARNESS services.
- WORLDFORGE services.
- Authentication providers.
- Databases.
- Storage systems.
- API gateways.
- External integrations.
- Monitoring services.
- Backup services.

Each service record must include:

- Service ID.
- Name.
- Domain.
- Description.
- Owner.
- Environment.
- Endpoint reference.
- Version.
- Dependency references.
- Health-check configuration.
- Status.
- Last health check.

### 11.3 Service health monitoring

Support:

- Availability checks.
- Health endpoints.
- Readiness checks.
- Dependency checks.
- Response time monitoring.
- Error-rate monitoring.
- Service status history.

Service health states: **Healthy | Degraded | Unavailable | Unknown | Maintenance**

An unknown health result must never be represented as healthy.

### 11.4 Dependency registry

Map relationships between:

- Applications.
- APIs.
- Databases.
- Authentication services.
- External providers.
- Internal services.

Dependency relationships must identify whether they are required, optional, or conditional.

### 11.5 Infrastructure operations

Provide controlled workflows for:

- Service registration.
- Service configuration.
- Maintenance windows.
- Service restart requests.
- Dependency inspection.
- Health-check execution.
- Incident linkage.
- Service retirement.

CORE may orchestrate authorized infrastructure actions, but the actual operations must be performed by the appropriate deployment or infrastructure service.

### 11.6 Acceptance criteria

- Every registered service has an owner.
- Health results include timestamps.
- Dependencies can be inspected.
- Failed checks create visible findings.
- Service actions are authorized and audited.
- CORE does not claim control of infrastructure it cannot actually access.

---

## 12. MODULE 10 — AUDIT & ACCOUNTABILITY

### 12.1 Purpose

Maintain an attributable record of significant actions, decisions, changes, access events, and system outcomes.

Audit is a foundational control, not merely an application activity log.

### 12.2 Audit event categories

- Authentication.
- Authorization.
- User administration.
- Role and permission changes.
- Governance decisions.
- Policy changes.
- Security events.
- Configuration changes.
- Secret access metadata.
- Service operations.
- Cross-domain requests.
- Verification activity.
- Data imports and exports.
- Release and deployment activity.
- Emergency actions.

### 12.3 Audit event schema

Each audit event should contain:

| Field | Purpose |
|---|---|
| Event ID | Unique identifier |
| Event type | Classification |
| Actor ID | Human or service identity |
| Actor type | User, service, system |
| Domain | Originating domain |
| Resource type | Affected resource category |
| Resource ID | Affected resource |
| Action | Operation performed |
| Outcome | Success, denied, failed |
| Timestamp | UTC event time |
| Correlation ID | Links related operations |
| Request ID | Request traceability |
| Environment | Development, test, staging, production |
| Reason | Rationale when required |
| Evidence reference | Supporting record |
| Integrity metadata | Tamper-evidence information |

### 12.4 Audit integrity

The architecture should provide:

- Append-oriented audit storage.
- Restricted update and deletion privileges.
- Immutable or independently protected retention where required.
- Cryptographic integrity verification.
- Sequential or linked event integrity where appropriate.
- Backup and restoration verification.
- Access monitoring.
- Exportable audit evidence.

A hash chain alone does not guarantee immutability if an administrator can rewrite both the records and the keys. Stronger assurance requires independent key protection, restricted retention, and externally protected evidence where appropriate.

### 12.5 Audit search and reporting

Search by:

- Actor.
- Event type.
- Resource.
- Domain.
- Date range.
- Outcome.
- Environment.
- Correlation ID.
- Severity.

Reports must support authorized export with provenance and generation metadata.

### 12.6 Accountability workflows

Provide:

- Activity investigation.
- Actor attribution.
- Decision reconstruction.
- Change reconstruction.
- Incident timeline.
- Evidence correlation.
- Accountability review.

### 12.7 Acceptance criteria

- Significant operations create attributable events.
- Events can be correlated across services.
- Audit access is restricted.
- Sensitive information is redacted.
- Integrity verification detects unauthorized alteration.
- Audit retention and export behavior are tested.

---

## 13. MODULE 11 — EVIDENCE & VERIFICATION

### 13.1 Purpose

Establish the evidence infrastructure through which AH-AIOS verifies its capabilities, controls, decisions, and operational claims.

The central rule is:

**A capability is not verified merely because its specification says it exists or its developer reports that it works.**

Verification requires an identifiable test or inspection, an expected result, an observed result, and retained evidence.

### 13.2 Evidence registry

Maintain records for:

- Requirements.
- Test cases.
- Automated test results.
- Manual test results.
- Security assessments.
- Architecture reviews.
- Configuration verification.
- Deployment verification.
- Backup and recovery tests.
- Compliance assessments.
- Operational readiness reviews.
- Approval records.

### 13.3 Evidence record structure

Each evidence record contains:

| Field | Description |
|---|---|
| Evidence ID | Unique identifier |
| Title | Evidence name |
| Evidence type | Test, inspection, report, artifact, decision |
| Related requirement | Requirement reference |
| Related capability | Capability reference |
| Source artifact | File, URL, test, commit, or record |
| Version | Tested version |
| Environment | Where verification occurred |
| Created by | Evidence originator |
| Verified by | Reviewer, if applicable |
| Created at | Timestamp |
| Result | Pass, fail, partial, inconclusive |
| Integrity reference | Checksum or storage reference |
| Review status | Pending, accepted, rejected |

### 13.4 Verification lifecycle

`Planned → Executed → Evidence Submitted → Reviewed → Accepted / Rejected`

A failed result must remain visible. A later successful run creates a new evidence record rather than silently overwriting the failed result.

### 13.5 Verification categories

- **Functional verification** — Checks that a capability performs its required functions.
- **Integration verification** — Checks that services exchange data correctly and respect their interface contracts.
- **Security verification** — Checks authentication, authorization, isolation, input validation, and protection controls.
- **Data integrity verification** — Checks schema constraints, relationships, transaction behavior, consistency, and recovery.
- **Operational verification** — Checks monitoring, logging, backups, recovery, and service behavior.
- **Governance verification** — Checks authority, approval requirements, policy enforcement, and audit traceability.

### 13.6 Automated verification engine

The architecture must support:

- Test suite registration.
- Test execution requests.
- Scheduled test runs.
- CI/CD test integration.
- Test result collection.
- Evidence generation.
- Failure classification.
- Regression comparison.
- Verification reporting.

Automated test execution must occur in an isolated, controlled environment.

### 13.7 Capability verification matrix

Every material CORE capability must map to:

1. Capability ID.
2. Requirement ID.
3. Implementation artifact.
4. Test case.
5. Test execution.
6. Evidence record.
7. Verification result.
8. Reviewer or verification authority.
9. Current capability status.

### 13.8 Acceptance criteria

- Evidence has unique identifiers.
- Evidence is linked to requirements and implementations.
- Test failures remain preserved.
- Verification results identify the tested version and environment.
- Unverified capabilities are clearly marked.
- Operational status requires the applicable verification evidence.

---

## 14. MODULE 12 — RISK & COMPLIANCE

### 14.1 Purpose

Manage operational, technical, security, governance, and compliance risks across AH-AIOS.

### 14.2 Risk register

Each risk record contains:

- Risk ID.
- Title.
- Description.
- Risk category.
- Affected domain.
- Affected capability.
- Likelihood.
- Impact.
- Severity.
- Risk owner.
- Mitigation strategy.
- Contingency plan.
- Review date.
- Status.
- Residual risk.
- Acceptance authority.

### 14.3 Risk categories

- Security.
- Privacy.
- Data integrity.
- Availability.
- Governance.
- Operational.
- Financial.
- Integration.
- AI reliability.
- Regulatory.
- Human and organizational.
- Reputational.

### 14.4 Risk assessment

A proposed assessment model:

`Inherent Risk = Likelihood × Impact`

Use a defined numerical scale, for example 1–5 for each dimension. The resulting score is a prioritization aid, not a substitute for professional risk judgment.

Assess:

- Inherent risk.
- Existing controls.
- Control effectiveness.
- Residual risk.
- Treatment decision.

Treatment decisions:

- Mitigate.
- Avoid.
- Transfer.
- Accept.
- Monitor.

Risk acceptance must be authorized at the appropriate level and documented.

### 14.5 Compliance control registry

Maintain:

- Control ID.
- Control name.
- Requirement.
- Applicable domain.
- Control owner.
- Implementation reference.
- Evidence requirement.
- Assessment frequency.
- Last assessment.
- Current result.
- Exception reference.

The system should support configurable compliance frameworks without claiming certification or legal compliance merely because a checklist exists.

### 14.6 Exception management

Exception workflow:

`Requested → Assessed → Approved / Rejected → Active → Expired / Revoked / Closed`

Every exception must record:

- Justification.
- Scope.
- Affected control.
- Risk assessment.
- Compensating controls.
- Approver.
- Start date.
- Expiration date.
- Remediation plan.
- Closure evidence.

Exceptions must not silently become permanent policy.

### 14.7 Remediation management

Track:

- Finding.
- Assigned owner.
- Remediation action.
- Priority.
- Due date.
- Dependencies.
- Progress.
- Validation.
- Closure evidence.

### 14.8 Acceptance criteria

- Every material risk has an owner.
- Risk acceptance is authorized.
- Exceptions have expiration dates.
- Compliance claims are evidence-backed.
- Overdue remediation is visible.
- Risk and compliance records are traceable to affected capabilities.

---

## 15. MODULE 13 — CHANGE & RELEASE MANAGEMENT

### 15.1 Purpose

Control the lifecycle of changes to AH-AIOS architecture, services, policies, configuration, data structures, and deployments.

### 15.2 Change registry

Every material change must have:

- Change ID.
- Title.
- Description.
- Requesting actor.
- Responsible owner.
- Affected domain.
- Affected services.
- Change classification.
- Business or technical justification.
- Impact assessment.
- Risk assessment.
- Test plan.
- Rollback plan.
- Approval requirements.
- Implementation record.
- Verification evidence.

### 15.3 Change classification

| Class | Description | Proposed approval |
|---|---|---|
| I — Editorial | Documentation or non-substantive changes | Document owner |
| II — Minor | Limited technical or configuration impact | Domain owner and relevant administrator |
| III — Major | Material architectural, security, or cross-domain impact | Architecture and governance authority |
| IV — Strategic | Changes to system direction or governing principles | Designated executive and architecture authority |

Final authority must be configured in the governance registry.

### 15.4 Change lifecycle

`Draft → Submitted → Assessed → Approved → Scheduled → Implemented → Verified → Closed`

Additional states:

- Rejected.
- On Hold.
- Failed.
- Rolled Back.
- Cancelled.

### 15.5 Release management

Support:

- Release registration.
- Version assignment.
- Release notes.
- Artifact references.
- Source commit references.
- Build evidence.
- Test evidence.
- Security assessment.
- Deployment approval.
- Deployment execution record.
- Post-deployment verification.
- Rollback record.

### 15.6 Version management

Version records must preserve:

- Version identifier.
- Prior version.
- Change set.
- Release date.
- Source commit.
- Build artifact checksum.
- Approval.
- Verification.
- Deployment environment.
- Supersession relationship.

### 15.7 Rollback

Rollback must be planned before high-impact deployment.

Requirements:

- Identify the last known good version.
- Identify affected services and data.
- Preserve current state for investigation.
- Execute rollback through an authorized mechanism.
- Verify restored behavior.
- Record the rollback.
- Assess data compatibility and migrations.

Database rollback must not be assumed safe. Destructive or irreversible data migrations require a separate recovery strategy.

### 15.8 Acceptance criteria

- Material changes have unique identifiers.
- Required approvals precede implementation.
- Releases identify exact source and artifacts.
- Failed deployments remain recorded.
- Rollbacks are authorized and verified.
- Release status is not equivalent to operational status.

---

## 16. CROSS-DOMAIN INTEGRATION ARCHITECTURE

### 16.1 Purpose

CORE provides shared control services to HARNESS and WORLDFORGE through defined, versioned, and enforceable interfaces.

It must not require the domains to share unrestricted database access.

### 16.2 Integration principles

1. Each domain owns its operational data.
2. CORE owns system-wide identity, authority, and control records.
3. Cross-domain operations use authenticated interfaces.
4. Authorization is evaluated at the appropriate service boundary.
5. Requests and responses are traceable.
6. Integration failures must be explicit.
7. Domain independence must be preserved.
8. Contracts must be versioned and validated.
9. A domain cannot override CORE policy through its own local configuration.
10. CORE cannot claim successful execution solely from issuing a request.

### 16.3 CORE–HARNESS contract

CORE provides:

- Identity validation.
- Authorization decisions.
- Policy references.
- Permission scopes.
- Approval requirements.
- Security restrictions.
- Audit requirements.
- Verification requirements.

HARNESS provides:

- Execution requests.
- Agent and tool identity.
- Requested action.
- Execution context.
- Execution result.
- Failure information.
- Resource usage.
- External side-effect records.
- Execution evidence.

**Example execution authorization**

1. HARNESS submits an execution request.
2. CORE identifies the requesting user or service.
3. CORE evaluates the requested operation.
4. CORE checks permission and applicable policy.
5. CORE determines whether human approval is required.
6. CORE returns an authorization decision.
7. HARNESS executes only within the approved scope.
8. HARNESS submits the execution outcome.
9. CORE records the corresponding control and audit evidence.

An authorization decision does not guarantee successful execution or prove the correctness of the result.

### 16.4 CORE–WORLDFORGE contract

CORE provides:

- User and service identity.
- Administrative authorization.
- Governance authority references.
- Security requirements.
- Audit requirements.
- Evidence requirements.
- Controlled change requirements.

WORLDFORGE provides:

- Knowledge operation requests.
- Entity and relationship references.
- Source and provenance records.
- Claim and evidence records.
- Canon workflow events.
- Approval requests.
- Knowledge validation results.
- Change and continuity records.

**Canon authority boundary**

CORE can verify that the required authority and approval process has been satisfied.

WORLDFORGE remains responsible for managing the actual knowledge model, canon status, continuity, and associated records.

CORE must not convert an interpretation, generated story, or unapproved proposal into canon.

### 16.5 Cross-domain request envelope

A common integration request should contain:

```json
{
  "request_id": "uuid",
  "correlation_id": "uuid",
  "source_domain": "HARNESS",
  "target_domain": "CORE",
  "actor": {
    "type": "user",
    "id": "actor-id"
  },
  "action": "execution.authorize",
  "resource": {
    "type": "tool",
    "id": "tool-id"
  },
  "scope": {
    "environment": "development"
  },
  "context": {},
  "timestamp": "ISO-8601 UTC",
  "contract_version": "1.0"
}
```

This is a proposed contract example. Production schemas must define required fields, enumerations, validation rules, authentication, and response structures.

### 16.6 Integration response envelope

```json
{
  "request_id": "uuid",
  "correlation_id": "uuid",
  "decision": "ALLOW",
  "policy_reference": "POL-0001",
  "scope": {},
  "approval_required": false,
  "conditions": [],
  "reason": "Authorized by applicable policy",
  "issued_at": "ISO-8601 UTC",
  "expires_at": "ISO-8601 UTC",
  "decision_id": "decision-id"
}
```

Allowed decisions should include:

- ALLOW.
- DENY.
- REQUIRE_APPROVAL.
- DEFER.
- ERROR.

A decision must have a bounded scope and appropriate validity period. High-risk operations should require short-lived authorization and, where appropriate, single-use authorization tokens.

### 16.7 Integration failure handling

Support:

- Timeout.
- Retry with bounded limits.
- Idempotency.
- Duplicate request detection.
- Circuit breaking.
- Failure logging.
- Escalation.
- Manual review.
- Reconciliation of uncertain outcomes.

A timeout must not be interpreted as permission.

### 16.8 Acceptance criteria

- All cross-domain requests are authenticated.
- Authorization is checked at the appropriate boundary.
- Requests are correlated with audit events.
- Duplicate operations are safely handled.
- Domain-owned data remains under its domain's authority.
- Failed or uncertain requests do not silently become successful operations.

---

## 17. TECHNICAL ARCHITECTURE

### 17.1 Architectural model

CORE should use a modular service architecture with explicit boundaries between its user interface, application services, policy enforcement, persistence, and external integrations.

Proposed architecture:

```
                    AH-AIOS CORE WORKBENCH
                              |
                    Presentation Layer
                              |
                    Application Services
                              |
                   CORE Control Services
                              |
          +-------------------+-------------------+
          |                   |                   |
    Identity Service    Governance Service   Security Service
          |                   |                   |
    Access Control      Policy Engine        Incident Service
          |                   |                   |
          +-------------------+-------------------+
                              |
                    Audit & Evidence Services
                              |
                    Data Access Layer
                              |
                   CORE Database & Storage
                              |
          +-------------------+-------------------+
          |                   |                   |
       HARNESS            WORLDFORGE         External Services
```

Infrastructure monitoring, observability, and assurance operate across these components.

### 17.2 Proposed technology stack

The following is a proposed implementation baseline, not a mandatory technology decision.

| Layer | Proposed technology |
|---|---|
| Frontend | React |
| Build tooling | Vite |
| Language | TypeScript |
| UI styling | CSS / Tailwind CSS |
| Backend | Python FastAPI |
| API format | REST / JSON |
| API documentation | OpenAPI |
| Database | PostgreSQL |
| Data access | SQLAlchemy |
| Schema migrations | Alembic |
| Validation | Pydantic |
| Authentication | OIDC-compatible provider |
| Authorization | CORE policy service |
| Background jobs | Worker service and queue |
| Cache | Redis where justified |
| Object storage | S3-compatible storage |
| Testing | Pytest, Vitest, Playwright |
| CI/CD | GitHub Actions |
| Deployment | Container-based deployment |
| Monitoring | Structured logs, metrics, tracing |

The implementation should prefer existing infrastructure and working repository conventions over introducing unnecessary new technologies.

### 17.3 Application architecture

**Frontend responsibilities**

The React frontend is responsible for:

- Rendering the thirteen modules.
- Navigation.
- Forms and validation feedback.
- Dashboard visualization.
- Record inspection.
- Approval interfaces.
- Search and filtering.
- User interaction.
- Displaying authorization results.
- Presenting audit and verification records.

The frontend is not the authority for security, policy, or permission enforcement.

**Backend responsibilities**

FastAPI services are responsible for:

- Authentication integration.
- Authorization enforcement.
- Business rules.
- Governance workflows.
- Policy evaluation.
- Audit generation.
- Evidence management.
- Configuration management.
- Cross-domain interfaces.
- Database transactions.
- Data validation.
- Operational APIs.

**Database responsibilities**

PostgreSQL stores authoritative CORE records.

It must enforce:

- Primary keys.
- Foreign keys.
- Unique constraints.
- Check constraints.
- Appropriate indexes.
- Transaction integrity.
- Tenant and organization boundaries where applicable.

### 17.4 Backend module boundaries

Organize the backend into independently testable modules.

```
core/
├── main.py
├── api/
│   ├── router.py
│   └── dependencies.py
├── identity/
├── users/
├── organizations/
├── authentication/
├── authorization/
├── governance/
├── policies/
├── security/
├── configuration/
├── secrets/
├── infrastructure/
├── audit/
├── evidence/
├── verification/
├── risk/
├── compliance/
├── changes/
├── releases/
├── integrations/
├── database/
├── schemas/
├── services/
├── workers/
├── monitoring/
└── tests/
```

Each module should have:

- Models.
- Schemas.
- Repository or data-access logic.
- Service logic.
- API routes.
- Permission requirements.
- Tests.

Avoid circular dependencies and unrestricted cross-module database operations.

### 17.5 Frontend module organization

```
src/
├── app/
│   ├── App.tsx
│   ├── routes.tsx
│   └── providers/
├── components/
│   ├── layout/
│   ├── navigation/
│   ├── tables/
│   ├── forms/
│   ├── dialogs/
│   ├── status/
│   └── charts/
├── modules/
│   ├── dashboard/
│   ├── system-identity/
│   ├── users-organizations/
│   ├── authentication/
│   ├── roles-permissions/
│   ├── governance/
│   ├── security/
│   ├── configuration/
│   ├── infrastructure/
│   ├── audit/
│   ├── evidence-verification/
│   ├── risk-compliance/
│   └── change-release/
├── services/
├── hooks/
├── types/
├── utils/
└── styles/
```

Module-specific UI and API calls must remain separated from shared layout components.

---

## 18. DATA ARCHITECTURE

### 18.1 Purpose

The CORE data architecture establishes authoritative records for identity, authority, governance, security, audit, verification, risk, and change management.

The database must preserve relationships and historical accountability.

### 18.2 Primary entity groups

| Group | Main entities |
|---|---|
| System | systems, domains, environments, architecture_records |
| Identity | users, service_identities, organizations, teams, memberships |
| Authentication | auth_sessions, identity_providers, authentication_events |
| Authorization | roles, permissions, role_permissions, assignments, access_policies |
| Governance | policies, policy_versions, decisions, authorities, delegations, exceptions |
| Security | incidents, vulnerabilities, findings, security_controls |
| Configuration | configurations, configuration_versions, feature_flags, secret_references |
| Infrastructure | services, dependencies, health_checks, service_events |
| Audit | audit_events, audit_integrity_records |
| Evidence | evidence_records, evidence_reviews, test_cases, test_runs |
| Risk | risks, risk_assessments, treatments, compliance_controls |
| Change | change_requests, approvals, releases, deployments, rollback_records |
| Integration | integration_clients, contracts, authorization_decisions, request_records |

### 18.3 Core data conventions

All primary records should use stable identifiers, preferably UUIDs.

All system timestamps should be stored in UTC.

Every material record should include:

- Created timestamp.
- Updated timestamp.
- Created by.
- Updated by.
- Status.
- Version or revision where applicable.

Historical records should not be silently overwritten.

### 18.4 Data ownership

| Data category | Authoritative owner |
|---|---|
| System identity | CORE |
| User identity and access | CORE |
| Authentication configuration | CORE or designated identity provider |
| System permissions | CORE |
| System-wide governance policies | CORE |
| HARNESS execution records | HARNESS, with required audit events in CORE |
| WorldForge knowledge entities | WORLDFORGE |
| WorldForge canon records | WORLDFORGE |
| Cross-domain authorization decisions | CORE |
| CORE audit records | CORE |
| Domain-specific operational evidence | Originating domain, referenced by CORE |

A central dashboard may aggregate domain information, but aggregation does not transfer ownership of the source data.

### 18.5 Data integrity requirements

Implement:

- Referential integrity.
- Unique identifiers.
- Valid state transitions.
- Schema validation.
- Transactional updates.
- Idempotent request handling.
- Duplicate detection.
- Optimistic concurrency where appropriate.
- Explicit deletion and retention policies.
- Migration version control.
- Backup integrity checks.

Critical records such as approvals, audit events, and release history should use append-oriented or version-preserving models.

### 18.6 Database transaction requirements

Operations that require multiple related updates must use database transactions.

Example: approving a governance policy must ensure that:

1. The approver is authorized.
2. The policy version is valid.
3. Required review conditions are satisfied.
4. The approval record is created.
5. The policy state is updated if appropriate.
6. The audit event is recorded.

These changes must succeed or fail as a controlled transaction, with reliable handling for audit systems that use a separate event store.

### 18.7 Data retention and deletion

The architecture must define retention by record category.

Records subject to legal, security, or accountability requirements may require restricted deletion, archival, or anonymization rather than ordinary deletion.

A deletion request must:

- Check authorization.
- Check retention obligations.
- Identify dependent records.
- Record the decision.
- Execute approved deletion or anonymization.
- Preserve required audit evidence.

---

## 19. API ARCHITECTURE

### 19.1 API conventions

All APIs should:

- Use HTTPS in deployed environments.
- Use versioned paths.
- Validate request and response schemas.
- Enforce server-side authorization.
- Return predictable error structures.
- Use consistent pagination.
- Support filtering and sorting where applicable.
- Include request and correlation IDs.
- Apply rate limits.
- Document all public and internal contracts.

Proposed base path: `/api/v1/`

### 19.2 Primary endpoint groups

| Endpoint | Purpose |
|---|---|
| /system | System registration and status |
| /domains | Domain registry |
| /environments | Environment management |
| /users | User administration |
| /organizations | Organizations and teams |
| /auth | Authentication integration and sessions |
| /roles | Role management |
| /permissions | Permission management |
| /access-policies | Authorization policies |
| /governance/policies | Governance policy management |
| /governance/decisions | Governance decisions |
| /governance/exceptions | Governance exceptions |
| /security/incidents | Security incidents |
| /security/vulnerabilities | Vulnerability management |
| /configurations | Configuration registry |
| /services | Infrastructure service registry |
| /audit/events | Audit event search |
| /evidence | Evidence registry |
| /verification/runs | Verification execution records |
| /risks | Risk register |
| /compliance/controls | Compliance controls |
| /changes | Change management |
| /releases | Release management |
| /integrations/authorize | Cross-domain authorization |
| /health | Service health |
| /readiness | Service readiness |

### 19.3 API response format

A consistent success response:

```json
{
  "success": true,
  "data": {},
  "meta": {
    "request_id": "uuid",
    "timestamp": "ISO-8601 UTC"
  }
}
```

A consistent error response:

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "The requested operation is not authorized.",
    "details": []
  },
  "meta": {
    "request_id": "uuid",
    "timestamp": "ISO-8601 UTC"
  }
}
```

Do not return stack traces, credentials, internal secrets, or sensitive database information to clients.

### 19.4 API authorization

Each endpoint must declare:

- Required authentication.
- Required permission.
- Resource scope.
- Applicable policy.
- Approval requirement.
- Audit requirement.

Public health endpoints must expose only minimal operational information.

### 19.5 API documentation

OpenAPI documentation must include:

- Endpoint description.
- Request schema.
- Response schema.
- Authentication requirements.
- Permission requirements.
- Error codes.
- Example requests.
- Example responses.
- Deprecation status.

### 19.6 Acceptance criteria

- API schemas are validated.
- Authorization is enforced at the backend.
- Errors use consistent structures.
- Request IDs support troubleshooting.
- Sensitive fields are excluded from responses.
- API versions are documented and tested.

---

## 20. SECURITY, PRIVACY, AND TRUST ARCHITECTURE

### 20.1 Security model

CORE must apply defense in depth.

Security must exist across:

1. Identity.
2. Authentication.
3. Authorization.
4. Application.
5. API.
6. Data.
7. Infrastructure.
8. Integrations.
9. Monitoring.
10. Recovery.

### 20.2 Data classification

Proposed classification:

| Level | Classification | Handling |
|---|---|---|
| 1 | Public | Approved for public disclosure |
| 2 | Internal | Restricted to authorized system users |
| 3 | Confidential | Limited access based on role and purpose |
| 4 | Restricted | Strongly controlled, sensitive, or security-critical |

The system must classify sensitive fields and records according to the applicable data policy.

### 20.3 Privacy requirements

Support:

- Data minimization.
- Purpose limitation.
- Access transparency.
- Retention controls.
- Secure deletion where appropriate.
- Subject-access workflows where applicable.
- Privacy incident handling.
- Data export controls.

Legal compliance must be evaluated against applicable jurisdictions and actual operational practices. Technical implementation alone does not prove compliance.

### 20.4 Secure development requirements

- Dependency scanning.
- Secret scanning.
- Static analysis.
- Code review.
- Input validation.
- API authorization tests.
- Secure database access.
- Production configuration review.
- Vulnerability remediation.
- Build artifact integrity verification.

### 20.5 Trust boundaries

The architecture must explicitly distinguish:

- Trusted CORE services.
- Authenticated internal domain services.
- External providers.
- User-submitted content.
- AI-generated content.
- Retrieved external content.
- Unverified evidence.
- Approved evidence.

External and AI-generated information must not automatically receive trusted status.

### 20.6 Acceptance criteria

- Sensitive records are classified.
- Security boundaries are documented.
- Access is enforced at the backend.
- Secrets are protected.
- Untrusted inputs are handled safely.
- Security verification is retained as evidence.

---

## 21. DATA INTEGRITY AND AUTOMATED VERIFICATION FRAMEWORK

### 21.1 Purpose

Data integrity and automated verification are mandatory architectural capabilities of CORE.

The system must be able to determine whether:

- Records are structurally valid.
- Relationships are consistent.
- Changes are authorized.
- Transactions are complete.
- Audit records are attributable.
- Policies are enforced.
- Integrations honor their contracts.
- Backups can be restored.
- Deployments match their approved artifacts.
- Reported system status is supported by evidence.

### 21.2 Verification layers

| Layer | Verification responsibility |
|---|---|
| L1 — Schema | Field types, required fields, enumerations, formats |
| L2 — Database | Constraints, relationships, uniqueness, transactions |
| L3 — Business logic | Valid workflows and state transitions |
| L4 — Authorization | Roles, permissions, scopes, and policy decisions |
| L5 — API | Request validation, response correctness, error handling |
| L6 — Integration | CORE–HARNESS–WORLDFORGE contracts |
| L7 — Security | Access control, secrets, injection, session security |
| L8 — Operations | Monitoring, backup, restore, recovery, deployment |

Every layer must have corresponding verification cases.

### 21.3 Automated test suites

The implementation should include the following test suites.

**Test suite A — Identity**

- Unique user identity.
- Valid account creation.
- Invalid account rejection.
- Suspended account restrictions.
- Session expiration.
- Session revocation.
- Service identity restrictions.

**Test suite B — Authorization**

- Authorized read.
- Unauthorized read.
- Authorized write.
- Unauthorized write.
- Role scope enforcement.
- Organization isolation.
- Privileged action restrictions.
- Separation-of-duties enforcement.
- Expired authorization rejection.

**Test suite C — Governance**

- Policy creation.
- Invalid policy rejection.
- Policy approval.
- Unauthorized approval rejection.
- Policy activation.
- Policy suspension.
- Exception expiration.
- Decision history preservation.

**Test suite D — Audit**

- Audit event creation.
- Actor attribution.
- Timestamp validation.
- Correlation ID consistency.
- Sensitive data redaction.
- Audit integrity verification.
- Unauthorized audit modification rejection.

**Test suite E — Evidence**

- Evidence registration.
- Evidence-to-requirement linkage.
- Evidence review.
- Failed test preservation.
- Version matching.
- Evidence integrity validation.

**Test suite F — Configuration**

- Environment isolation.
- Invalid configuration rejection.
- Secret redaction.
- Configuration versioning.
- Approved production changes.
- Configuration rollback.

**Test suite G — Integration**

- CORE authorization request.
- HARNESS execution request.
- WORLDFORGE governance request.
- Invalid identity rejection.
- Invalid contract rejection.
- Timeout handling.
- Duplicate request handling.
- Correlation and audit continuity.

**Test suite H — Recovery**

- Backup creation.
- Backup integrity.
- Database restoration.
- Service recovery.
- Configuration recovery.
- Audit continuity after restoration.

### 21.4 CI/CD verification pipeline

Proposed pipeline:

```
Developer Commit
       |
       v
Source Validation
       |
       v
Dependency and Secret Scanning
       |
       v
Static Code Analysis
       |
       v
Unit Tests
       |
       v
Database and Migration Tests
       |
       v
Integration Tests
       |
       v
Authorization and Security Tests
       |
       v
Frontend Build
       |
       v
End-to-End Tests
       |
       v
Artifact Generation
       |
       v
Artifact Integrity Check
       |
       v
Deployment Approval
       |
       v
Deployment
       |
       v
Post-Deployment Verification
       |
       v
Release Evidence and Status
```

A failed required gate must block the release unless a formally authorized exception permits a limited, explicitly documented deviation.

### 21.5 Data integrity controls

Implement automated checks for:

- Duplicate identifiers.
- Orphaned foreign keys.
- Invalid state transitions.
- Missing required relationships.
- Unexpected null values.
- Conflicting versions.
- Invalid approval chains.
- Missing audit events.
- Broken evidence references.
- Invalid timestamps.
- Unexpected schema drift.

Integrity checks should run:

- During relevant writes.
- During migrations.
- In scheduled verification jobs.
- Before and after critical imports.
- Before release.
- After restoration.

### 21.6 Migration verification

Every database migration must have:

- Migration ID.
- Source version.
- Target version.
- Change description.
- Preconditions.
- Execution result.
- Post-migration checks.
- Rollback or recovery strategy.

Test migrations against a representative test database before production execution.

### 21.7 Automated verification result format

```json
{
  "verification_id": "uuid",
  "suite_id": "CORE-SECURITY-001",
  "version": "1.0.0",
  "environment": "testing",
  "started_at": "ISO-8601 UTC",
  "completed_at": "ISO-8601 UTC",
  "result": "PASS",
  "tests": {
    "total": 20,
    "passed": 20,
    "failed": 0,
    "skipped": 0
  },
  "evidence_reference": "evidence-id",
  "source_commit": "commit-sha"
}
```

Allowed overall results:

- PASS.
- FAIL.
- PARTIAL.
- INCONCLUSIVE.
- NOT_RUN.

A skipped test must never be counted as passed.

### 21.8 Acceptance criteria

- Automated suites execute in CI.
- Failed tests block applicable release gates.
- Results identify the exact source commit.
- Evidence is preserved.
- Database migrations are tested.
- Recovery is demonstrated through actual restore tests.
- Verification history cannot be silently overwritten.

---

## 22. OBSERVABILITY AND OPERATIONS

### 22.1 Purpose

CORE must provide operational visibility into its own services and the control environment of AH-AIOS.

### 22.2 Observability components

**Logging** — Use structured logs containing:

- Timestamp.
- Service.
- Environment.
- Severity.
- Request ID.
- Correlation ID.
- Event type.
- Outcome.

Logs must not contain credentials or unnecessary personal information.

**Metrics** — Monitor:

- Request volume.
- Error rates.
- Response times.
- Database performance.
- Authentication failures.
- Authorization denials.
- Queue depth.
- Worker health.
- Service availability.
- Verification success and failure rates.

**Distributed tracing** — Trace related requests across:

- CORE.
- HARNESS.
- WORLDFORGE.
- Databases.
- External integrations.

Trace data must be protected from unauthorized access.

### 22.3 Alert management

Alert categories:

- Availability.
- Performance.
- Security.
- Data integrity.
- Backup failure.
- Verification failure.
- Integration failure.
- Capacity.
- Policy violation.

Each alert should include:

- Alert ID.
- Severity.
- Affected service.
- Detection time.
- Description.
- Related incident.
- Recommended response.
- Current owner.
- Resolution state.

### 22.4 Operational runbooks

Maintain runbooks for:

- Service unavailable.
- Authentication provider unavailable.
- Database unavailable.
- Database integrity failure.
- Suspected credential compromise.
- Unauthorized access.
- Failed deployment.
- Failed migration.
- Backup failure.
- Restore operation.
- Cross-domain integration failure.

Runbooks must identify required permissions, safe actions, escalation paths, and post-action verification.

### 22.5 Acceptance criteria

- Services expose appropriate health and readiness information.
- Logs can be correlated.
- Alerts have owners.
- Critical failures are visible.
- Operational runbooks exist.
- Monitoring failure is not misreported as service health.

---

## 23. BACKUP, DISASTER RECOVERY, AND CONTINUITY

### 23.1 Purpose

Preserve the availability, integrity, and recoverability of CORE and its authoritative records.

### 23.2 Backup scope

Back up:

- CORE database.
- Configuration records.
- Required application artifacts.
- Policy and governance records.
- Audit records.
- Evidence metadata and files.
- Release and deployment metadata.
- Necessary encryption and key-recovery metadata under secure controls.

Secrets must be backed up only through an appropriate protected mechanism.

### 23.3 Backup types

Support:

- Full backups.
- Incremental backups where supported.
- Point-in-time recovery where supported.
- Configuration exports.
- Evidence and artifact backups.

### 23.4 Recovery objectives

Define per-service:

- Recovery Time Objective (RTO).
- Recovery Point Objective (RPO).
- Maximum tolerable downtime.
- Maximum tolerable data loss.
- Recovery priority.

These values must be established from operational requirements rather than invented as universal targets.

### 23.5 Recovery workflow

1. Detect and classify the incident.
2. Declare recovery authorization.
3. Identify the last known good backup.
4. Verify backup integrity.
5. Restore into a controlled environment.
6. Validate schema and relationships.
7. Validate audit and evidence continuity.
8. Restore service dependencies.
9. Run functional and security checks.
10. Obtain recovery acceptance.
11. Return to service.
12. Record the recovery event.

### 23.6 Recovery acceptance criteria

- Backups are scheduled and monitored.
- Failed backups trigger alerts.
- Restoration is tested.
- Recovery results are recorded.
- Data integrity checks run after restoration.
- Recovery objectives are measured against actual results.

---

## 24. WORKFLOW AND APPROVAL ENGINE

### 24.1 Purpose

Provide a reusable workflow capability for CORE operations.

The workflow engine must coordinate tasks and approvals without becoming an independent source of authority.

### 24.2 Workflow capabilities

- Workflow templates.
- Workflow instances.
- Step definitions.
- Conditions.
- Assigned actors.
- Approval requests.
- Rejection handling.
- Escalation.
- Deadlines.
- Notifications.
- Execution history.
- Workflow cancellation.
- Workflow versioning.

### 24.3 Standard workflow patterns

- **Administrative change:** Request → Validate → Authorize → Apply → Verify → Record
- **Governance approval:** Draft → Submit → Review → Decision → Publish → Verify Enforcement
- **Security incident:** Detect → Triage → Contain → Investigate → Remediate → Verify → Close
- **Release:** Build → Test → Review → Approve → Deploy → Verify → Release
- **Risk exception:** Request → Assess → Review → Approve → Monitor → Expire / Close

### 24.4 Approval engine controls

- Approval must be linked to a specific version of the requested action.
- Material changes after approval invalidate or require reassessment of the approval.
- Approval authority must be checked at decision time.
- Approvers must not approve their own requests where separation of duties applies.
- Expired approvals cannot authorize execution.
- Rejected requests cannot proceed without a new authorized submission.
- Every decision must have an audit record.

### 24.5 Acceptance criteria

- Workflow states are validated.
- Unauthorized transitions are rejected.
- Approval decisions are attributable.
- Workflow history is preserved.
- Pending and expired tasks are visible.
- Failed workflow execution does not silently advance to completion.

---

## 25. NOTIFICATIONS AND COMMUNICATION

### 25.1 Purpose

Provide timely notifications about actions, approvals, incidents, verification results, and operational events.

### 25.2 Notification types

- Approval requested.
- Approval granted.
- Approval rejected.
- Security incident detected.
- Account suspended.
- Policy changed.
- Configuration changed.
- Verification failed.
- Release deployed.
- Backup failed.
- Risk exception expiring.
- Service unavailable.
- Remediation overdue.

### 25.3 Notification channels

The architecture may support:

- In-application notifications.
- Email.
- Configured messaging integrations.
- Operational alert channels.

### 25.4 Notification controls

Users should be able to manage non-critical preferences, but security-critical and legally required notifications must follow system policy.

Notifications must not disclose sensitive information to unauthorized recipients.

Every notification should identify its source event and link to the relevant authorized record.

---

## 26. SEARCH, REPORTING, AND EXPORT

### 26.1 Global search

Global search should support authorized discovery across:

- Users.
- Organizations.
- Services.
- Policies.
- Governance decisions.
- Security incidents.
- Audit events.
- Evidence.
- Risks.
- Changes.
- Releases.

Search results must respect the same access restrictions as the underlying records.

### 26.2 Search capabilities

- Exact identifier lookup.
- Keyword search.
- Filtered search.
- Date-range search.
- Status filtering.
- Domain filtering.
- Environment filtering.
- Advanced query conditions.

### 26.3 Reporting

Provide reports for:

- System health.
- Identity and access reviews.
- Privileged access.
- Governance activity.
- Security incidents.
- Audit activity.
- Verification performance.
- Data integrity.
- Risk exposure.
- Compliance status.
- Change and release history.
- Backup and recovery.

### 26.4 Export formats

Support appropriate formats:

- CSV for tabular data.
- JSON for structured records.
- PDF for formal reports.
- ZIP for approved evidence packages.

### 26.5 Export security

- Check export permissions.
- Apply field-level restrictions.
- Record export events.
- Identify report generation time.
- Identify data scope.
- Include provenance where applicable.
- Prevent unauthorized bulk extraction.
- Protect generated files.

---

## 27. ADMINISTRATION AND SYSTEM SETTINGS

The CORE Workbench must provide administrative settings that are distinct from the thirteen primary modules but accessible through the global interface.

### 27.1 General settings

- System name.
- System description.
- Time zone display preference.
- Locale.
- Default pagination.
- Session preferences.
- Interface settings.

System timestamps remain UTC regardless of display preference.

### 27.2 Administrative controls

- Administrator registry.
- Administrative role assignment.
- Privileged account review.
- Emergency access controls.
- Administrative activity history.
- Access review schedules.

### 27.3 Platform settings

- API configuration.
- Service integration registry.
- Notification configuration.
- Monitoring configuration.
- Backup configuration.
- Retention configuration.
- Feature flags.
- Deployment environment references.

### 27.4 System maintenance

- Maintenance announcements.
- Scheduled maintenance.
- Service maintenance states.
- Maintenance history.
- Recovery notices.

### 27.5 Administrative acceptance criteria

- Settings are permission-protected.
- Material changes require audit records.
- Sensitive settings are not exposed to ordinary users.
- Production settings are independently controlled.
- Maintenance activities are visible and traceable.

---

## 28. IMPLEMENTATION ROADMAP

The CORE Workbench should be developed incrementally. The first objective is to establish a reliable control foundation, not to implement every proposed capability simultaneously.

### Phase 1 — Foundation and Workbench Shell

**Objective:** Build the CORE application foundation.

Deliverables:

- React and TypeScript application.
- Global layout.
- Navigation for all thirteen modules.
- Dashboard shell.
- FastAPI backend.
- Database connection.
- Environment configuration.
- Initial schema and migrations.
- Health and readiness endpoints.
- Development deployment pipeline.

Completion criteria:

- Application starts.
- Navigation works.
- API responds.
- Database connectivity is verified.
- Environment configuration is separated.
- Initial automated tests pass.

### Phase 2 — Identity and Access Control

**Objective:** Establish the foundational identity and permission system.

Deliverables:

- User registry.
- Organization registry.
- Authentication integration.
- Session management.
- Roles.
- Permissions.
- Scope enforcement.
- Protected routes.
- Access audit events.

Completion criteria:

- Authenticated access works.
- Unauthorized access is denied.
- Roles and permissions are enforced server-side.
- Organization boundaries are tested.
- Authentication and authorization events are recorded.

### Phase 3 — Governance and Policy

**Objective:** Establish system-wide governance operations.

Deliverables:

- Policy registry.
- Policy versioning.
- Governance decisions.
- Authority registry.
- Approval workflows.
- Exception management.
- Policy enforcement references.

Completion criteria:

- Policies can be created and reviewed.
- Unauthorized approval is rejected.
- Approval history is preserved.
- Exceptions have explicit scope and expiration.
- Governance decisions are auditable.

### Phase 4 — Security and Configuration

**Objective:** Establish security and secure system administration.

Deliverables:

- Security dashboard.
- Incident management.
- Vulnerability register.
- Configuration registry.
- Secrets integration.
- Environment separation.
- Feature flags.
- Security verification.

Completion criteria:

- Secrets are protected.
- Configuration changes are controlled.
- Security incidents can be tracked.
- Critical security controls have tests.
- Sensitive information is redacted.

### Phase 5 — Audit, Evidence, and Verification

**Objective:** Establish reliable evidence and assurance.

Deliverables:

- Audit event service.
- Audit search.
- Evidence registry.
- Verification registry.
- Test execution integration.
- Verification reports.
- Evidence provenance.

Completion criteria:

- Material actions generate audit events.
- Evidence links to requirements and versions.
- Test results are retained.
- Failed verification is visible.
- Audit integrity checks work.

### Phase 6 — Infrastructure, Risk, and Compliance

**Objective:** Establish operational oversight.

Deliverables:

- Service registry.
- Dependency registry.
- Health monitoring.
- Alert management.
- Risk register.
- Compliance controls.
- Remediation workflows.
- Operational reports.

Completion criteria:

- Service health is visible.
- Risks have owners.
- Alerts are traceable.
- Compliance status has supporting evidence.
- Operational findings can be assigned and resolved.

### Phase 7 — Change and Release Management

**Objective:** Establish controlled change and release operations.

Deliverables:

- Change registry.
- Approval workflows.
- Release registry.
- Version history.
- Deployment evidence.
- Rollback records.
- Release assurance dashboard.

Completion criteria:

- Changes require appropriate authorization.
- Releases reference exact source commits and artifacts.
- Deployment results are recorded.
- Rollback is tested.
- Post-deployment verification is retained.

### Phase 8 — Cross-Domain Integration

**Objective:** Connect CORE to HARNESS and WORLDFORGE.

Deliverables:

- Shared request contracts.
- Authentication for service identities.
- Authorization API.
- Policy decision API.
- Audit integration.
- Domain health interfaces.
- Integration monitoring.
- Contract tests.

Completion criteria:

- HARNESS can request authorization.
- WORLDFORGE can request applicable governance authorization.
- CORE decisions are traceable.
- Domain ownership remains separate.
- Integration failures are handled safely.

### Phase 9 — Production Readiness

**Objective:** Demonstrate that CORE is ready for controlled production operation.

Deliverables:

- Security assessment.
- Data integrity assessment.
- Full regression tests.
- Backup and restoration tests.
- Operational runbooks.
- Monitoring and alerting.
- Deployment procedures.
- Disaster recovery plan.
- Production acceptance report.

Completion criteria:

- All required release gates pass.
- Critical security findings are resolved or formally accepted.
- Recovery is demonstrated.
- Production configuration is verified.
- Operational ownership and support are established.

---

## 29. PROJECT STRUCTURE AND DELIVERABLES

A proposed repository structure:

```
ah-aios-core/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── core/
│   ├── tests/
│   ├── alembic/
│   ├── requirements.txt
│   └── pyproject.toml
│
├── contracts/
│   ├── openapi/
│   ├── schemas/
│   └── integration/
│
├── infrastructure/
│   ├── docker/
│   ├── deployment/
│   └── monitoring/
│
├── docs/
│   ├── architecture/
│   ├── api/
│   ├── governance/
│   ├── security/
│   ├── operations/
│   └── verification/
│
├── scripts/
│
├── .github/
│   └── workflows/
│
├── .env.example
├── .gitignore
├── README.md
└── docker-compose.yml
```

The exact structure may be adapted to an existing repository, but module boundaries and separation of concerns must be preserved.

### 29.1 Required deliverables

| Deliverable | Expected result |
|---|---|
| CORE frontend | Functional thirteen-module workbench |
| CORE backend | API and application services |
| Database | Versioned schema and migrations |
| Identity system | Authentication and account lifecycle |
| Authorization | Enforced role and permission model |
| Governance | Policy and approval workflows |
| Security | Incident and control management |
| Audit | Attributable activity records |
| Evidence | Verification and evidence registry |
| Risk | Risk and compliance workflows |
| Change management | Controlled change and release records |
| Integration | CORE–HARNESS–WORLDFORGE interfaces |
| Automated tests | Repeatable verification suites |
| CI/CD | Build, test, and deployment pipeline |
| Documentation | Technical and operational documentation |

---

## 30. ACCEPTANCE AND COMPLETION FRAMEWORK

### 30.1 Functional acceptance

The CORE Workbench must demonstrate:

- All thirteen modules are accessible to authorized users.
- Navigation works.
- Records can be created, inspected, and updated where permitted.
- Search and filters operate correctly.
- Workflows follow defined state transitions.
- Approval requirements are enforced.
- Reports use authoritative records.

### 30.2 Security acceptance

Demonstrate:

- Authentication.
- Authorization.
- Least privilege.
- Organization isolation.
- Privileged account protection.
- Secret management.
- Session security.
- Input validation.
- Secure API behavior.
- Auditability.

### 30.3 Data acceptance

Demonstrate:

- Database constraints.
- Referential integrity.
- Transaction correctness.
- Migration reliability.
- Duplicate handling.
- Version history.
- Backup integrity.
- Restoration.
- Data retention behavior.

### 30.4 Integration acceptance

Demonstrate:

- Authenticated service-to-service communication.
- Authorization requests.
- Valid response contracts.
- Correlation IDs.
- Failure handling.
- Idempotency.
- Domain ownership boundaries.
- Cross-domain audit continuity.

### 30.5 Operational acceptance

Demonstrate:

- Health monitoring.
- Readiness checks.
- Structured logging.
- Alert generation.
- Backup execution.
- Recovery procedures.
- Deployment verification.
- Release traceability.
- Operational runbooks.

### 30.6 Evidence requirements

Each acceptance test must retain:

- Test ID.
- Requirement ID.
- Test description.
- Expected result.
- Actual result.
- Environment.
- Source commit.
- Execution timestamp.
- Test status.
- Evidence reference.
- Reviewer where required.

### 30.7 Completion rule

CORE must not be declared complete because:

- The interface has been built.
- All thirteen menu links exist.
- The backend starts.
- The database connects.
- The application builds successfully.
- A demonstration appears to work.

CORE completion requires evidence that the applicable functional, security, data integrity, governance, integration, and operational requirements have passed.

---

## 31. CAPABILITY MATURITY AND RELEASE STATUS

### 31.1 Capability status

Every CORE capability must have an explicit implementation status.

| Status | Meaning |
|---|---|
| Proposed | Defined as a future capability |
| Approved | Authorized for implementation |
| Planned | Assigned to a roadmap or delivery plan |
| In Development | Implementation underway |
| Implemented | Code or configuration exists |
| Verified | Required verification has passed |
| Pilot | Operating under controlled limited use |
| Operational | Meets applicable operational acceptance requirements |
| Deprecated | No longer recommended |
| Retired | Removed from active operation |

A capability may be implemented but not verified. It may be verified but not operational.

These statuses must not be treated as interchangeable.

### 31.2 Capability maturity levels

Use the following maturity model:

- **CML-0 — Conceptual:** Vision or concept only.
- **CML-1 — Defined:** Requirements and architecture are documented.
- **CML-2 — Development:** Implementation is underway.
- **CML-3 — Functional:** Functionality has passed defined tests.
- **CML-4 — Governed:** Applicable governance, security, provenance, audit, and operational controls are implemented.
- **CML-5 — Enterprise Ready:** Scalable, monitored, auditable, supportable, and operationally ready.

Capability status and maturity level must be recorded independently.

---

## 32. ARCHITECTURAL DECISIONS AND OPEN ITEMS

The following decisions require explicit resolution before or during implementation.

| ID | Decision | Proposed direction |
|---|---|---|
| ADR-CORE-001 | Backend architecture | FastAPI modular backend |
| ADR-CORE-002 | Primary database | PostgreSQL |
| ADR-CORE-003 | Frontend architecture | React + TypeScript + Vite |
| ADR-CORE-004 | Authentication | Trusted OIDC-compatible provider |
| ADR-CORE-005 | Authorization | CORE-controlled server-side RBAC with scoped policies |
| ADR-CORE-006 | Audit integrity | Append-oriented records with independently protected integrity evidence |
| ADR-CORE-007 | Evidence storage | Database metadata plus protected object storage |
| ADR-CORE-008 | Cross-domain integration | Versioned authenticated APIs |
| ADR-CORE-009 | Automated testing | Pytest, Vitest, Playwright, and CI integration |
| ADR-CORE-010 | Deployment | Containerized deployment with environment isolation |

These are proposed decisions, not approved architecture decisions.

Before implementation, the engineering team must inspect the existing repositories, dependencies, deployment arrangements, and working services. Existing verified infrastructure should be reused when appropriate.

Additional decisions include:

- Identity provider selection.
- Database hosting.
- Secret management provider.
- Backup retention.
- Audit retention.
- Recovery objectives.
- Notification provider.
- Monitoring infrastructure.
- Production hosting.
- Organizational and legal requirements.

Each decision should become an Architecture Decision Record (ADR) with rationale, alternatives, consequences, and approval status.

---

## 33. NON-FUNCTIONAL REQUIREMENTS

CORE must satisfy measurable non-functional requirements.

| Category | Requirement |
|---|---|
| Reliability | Critical services expose health and readiness |
| Security | All protected operations enforce server-side authorization |
| Performance | Response targets are defined and tested against expected workloads |
| Scalability | Services and data access support planned growth |
| Availability | Service objectives are defined by operational importance |
| Maintainability | Modular architecture and documented interfaces |
| Accessibility | Keyboard and assistive-technology support |
| Compatibility | Supported desktop and mobile browsers |
| Observability | Structured logs, metrics, traces, and alerts |
| Recoverability | Tested backup and restoration procedures |
| Integrity | Database and evidence consistency checks |
| Auditability | Material actions are attributable and traceable |
| Interoperability | Versioned and documented APIs |
| Portability | Deployment configuration is documented and reproducible |

Numerical service-level objectives must be established during deployment planning and validated against actual infrastructure capacity.

---

## 34. IMPLEMENTATION GOVERNANCE AND ENGINEERING RULES

The implementation team must follow these rules throughout development.

**Rule 1 — Preserve domain boundaries.** Do not combine CORE, HARNESS, and WORLDFORGE into one undifferentiated application module. They may share platform services, but their responsibilities and authoritative data ownership must remain clear.

**Rule 2 — Do not invent existing functionality.** Before implementing a capability, inspect the existing repository and identify:

- Existing files.
- Existing services.
- Existing database structures.
- Existing workflows.
- Existing integrations.
- Existing tests.
- Existing deployment configuration.

Do not recreate working functionality unnecessarily.

**Rule 3 — No mock functionality presented as operational.** A placeholder, mock response, demonstration card, or local-only interaction must be explicitly labeled. A working frontend button is not proof of a working backend operation.

**Rule 4 — Protect data integrity.** Do not perform destructive migrations, overwrite records, or remove existing functionality without examining dependencies and preserving recoverability.

**Rule 5 — Verify every implementation stage.** Each completed module must have:

- Requirements.
- Implementation.
- Tests.
- Test results.
- Evidence.
- Known limitations.
- Status.

**Rule 6 — Preserve version history.** All significant changes must be traceable to source commits, migrations, approvals, and releases.

**Rule 7 — Do not silently expand scope.** New functionality must be classified as:

- Required by this specification.
- Required by an existing authoritative specification.
- Approved change.
- Proposed enhancement.

**Rule 8 — Do not confuse specification with implementation.** The presence of an architectural description does not establish that a feature exists.

**Rule 9 — Stop safely when evidence is missing.** When the engineering team encounters an unknown dependency, missing credential, ambiguous authority, or destructive operation, it must stop and report the issue rather than invent a solution.

**Rule 10 — Keep the system usable throughout development.** Build incrementally. Maintain a working application, working database migrations, and a repeatable test pipeline at each major milestone.

---

## 35. FINAL SYSTEM DEFINITION

AH-AIOS CORE is the foundational control, governance, security, and assurance domain of the AFTER HUMANITY AI Operating System.

It provides the system-wide capabilities required to establish identity, authenticate actors, authorize actions, enforce governance, secure resources, manage infrastructure, preserve accountability, maintain evidence, assess risk, and control changes.

Through its thirteen-module Workbench, CORE provides an integrated administrative and operational environment for the governance of AH-AIOS.

CORE governs the conditions under which AI HARNESS performs execution and WORLDFORGE manages structured knowledge and canon.

It establishes the authority and control framework without absorbing the independent responsibilities of either domain.

Its governing purpose is to ensure that AH-AIOS operates through explicit authority, controlled access, secure infrastructure, traceable decisions, preserved evidence, verified capabilities, and accountable change.

**CORE governs. HARNESS executes. WORLDFORGE structures and governs knowledge. Human stewardship provides direction, judgment, and accountability across all three.**

---

## 36. IMPLEMENTATION HANDOFF — CLAUDE ENGINEERING INSTRUCTIONS

The following is the instruction to use when giving this specification to Claude.

### CLAUDE IMPLEMENTATION DIRECTIVE — AH-AIOS CORE WORKBENCH

You are the engineering implementation assistant for AH-AIOS CORE.

Use the attached AH-CORE-ARCH-001 — Complete Workbench Specification & Technical Architecture, Version 1.0-Draft as the primary proposed technical specification.

**Objective**

Develop the complete AH-AIOS CORE Workbench as the foundational control, governance, security, and assurance application of AH-AIOS.

The application must implement the thirteen specified modules and preserve the boundaries between CORE, AI HARNESS, and WORLDFORGE.

**Mandatory instructions**

1. Inspect the existing project and repository before changing files.
2. Identify the existing architecture, implementation status, database, dependencies, and deployment configuration.
3. Preserve existing working functionality.
4. Do not assume that proposed architecture has already been implemented.
5. Do not fabricate users, operational records, approvals, security results, or verification evidence.
6. Do not expose credentials or secrets.
7. Do not perform destructive migrations without an explicit recovery plan.
8. Implement backend authorization. Frontend visibility is not a security control.
9. Use version-controlled database migrations.
10. Build automated tests alongside implementation.
11. Preserve audit history and provenance.
12. Do not independently authorize changes to established AH-AIOS canon.
13. Do not declare any capability operational without supporting verification evidence.

**Required development sequence**

Proceed incrementally:

- **Milestone 1:** Repository inspection, architecture reconciliation, and implementation plan.
- **Milestone 2:** Application shell, navigation, database foundation, and CI pipeline.
- **Milestone 3:** Identity, authentication, organizations, roles, and permissions.
- **Milestone 4:** Governance Center and policy workflows.
- **Milestone 5:** Security Center and configuration management.
- **Milestone 6:** Infrastructure, audit, evidence, and verification.
- **Milestone 7:** Risk, compliance, change, and release management.
- **Milestone 8:** CORE–HARNESS–WORLDFORGE integration.
- **Milestone 9:** Security, data integrity, recovery, and production-readiness verification.

**Required milestone reporting**

At the end of each milestone, report:

- What was inspected.
- What was implemented.
- Files created or changed.
- Database changes.
- Tests executed.
- Actual test results.
- Verification evidence.
- Known limitations.
- Outstanding decisions.
- Next milestone.

Do not report a test as passed if it was not executed.

Do not report a feature as complete if it is only a frontend placeholder.

**First action**

Do not begin by generating the entire application in one pass.

Start with a repository inspection and a reconciliation report against AH-CORE-ARCH-001.

Identify the smallest safe implementation milestone, then proceed one milestone at a time.

The objective is a functioning, secure, verifiable AH-AIOS CORE Workbench — not merely a visually complete dashboard.

---

## Document governance notice

**PROPOSED — NOT YET APPROVED**

| Attribute | Value |
|---|---|
| Document ID | AH-CORE-ARCH-001 |
| Version | 1.0-Draft |
| Document type | Complete Workbench Specification & Technical Architecture |
| Domain | AH-AIOS CORE |
| Status | Proposed Architecture Specification |
| Scope | Thirteen workbench modules and supporting architecture |
| Implementation status | Not established by this document |
| Canon status | Not independently established by this document |

The established three-domain scope remains the governing system definition. This document expands the proposed technical architecture of CORE without changing that scope.

The next engineering milestone is repository inspection and architecture reconciliation — not immediately generating code.
