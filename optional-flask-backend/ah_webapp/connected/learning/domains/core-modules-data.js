/* Generated from docs/AH-CORE-ARCH-001.md (module purpose, section list, acceptance criteria). */
window.CORE_MODULES=[
 {
  "id": "01",
  "slug": "dashboard",
  "name": "CORE Dashboard",
  "purpose": "The CORE Dashboard provides the central operational overview of AH-AIOS.",
  "sections": [
   [
    "3.1 Purpose",
    "31-purpose"
   ],
   [
    "3.2 Dashboard components",
    "32-dashboard-components"
   ],
   [
    "3.3 Dashboard filters",
    "33-dashboard-filters"
   ],
   [
    "3.4 Dashboard actions",
    "34-dashboard-actions"
   ],
   [
    "3.5 Acceptance criteria",
    "35-acceptance-criteria"
   ]
  ],
  "criteria": [
   "Dashboard loads without exposing unauthorized information.",
   "Domain status is sourced from domain health records.",
   "Critical incidents are prominently visible.",
   "Pending approvals are accurate.",
   "Dashboard metrics identify their reporting period and source.",
   "Failed data retrieval is displayed as unavailable, not as a false healthy state."
  ]
 },
 {
  "id": "02",
  "slug": "system-identity",
  "name": "System Identity",
  "purpose": "System Identity establishes the identity and registration of the AH-AIOS installation.",
  "sections": [
   [
    "4.1 Purpose",
    "41-purpose"
   ],
   [
    "4.2 Functional areas",
    "42-functional-areas"
   ],
   [
    "4.3 Architecture registry",
    "43-architecture-registry"
   ],
   [
    "4.4 Acceptance criteria",
    "44-acceptance-criteria"
   ]
  ],
  "criteria": [
   "Every registered domain has a unique identifier.",
   "Every environment has independent configuration.",
   "Service identities are distinguishable from human users.",
   "Architecture records preserve version history.",
   "No registration record automatically grants execution or administrative authority."
  ]
 },
 {
  "id": "03",
  "slug": "users-organizations",
  "name": "Users & Organizations",
  "purpose": "Manage human identities and organizational relationships across AH-AIOS.",
  "sections": [
   [
    "5.1 Purpose",
    "51-purpose"
   ],
   [
    "5.2 User management",
    "52-user-management"
   ],
   [
    "5.3 Organization management",
    "53-organization-management"
   ],
   [
    "5.4 Membership lifecycle",
    "54-membership-lifecycle"
   ],
   [
    "5.5 User administration controls",
    "55-user-administration-controls"
   ],
   [
    "5.6 Acceptance criteria",
    "56-acceptance-criteria"
   ]
  ],
  "criteria": [
   "User identities are unique.",
   "Membership is explicitly scoped.",
   "Organization boundaries are enforced.",
   "Account lifecycle changes are auditable.",
   "Deactivated identities cannot obtain new access tokens."
  ]
 },
 {
  "id": "04",
  "slug": "identity-authentication",
  "name": "Identity & Authentication",
  "purpose": "Provide secure identity verification and session management.",
  "sections": [
   [
    "6.1 Purpose",
    "61-purpose"
   ],
   [
    "6.2 Authentication methods",
    "62-authentication-methods"
   ],
   [
    "6.3 Session management",
    "63-session-management"
   ],
   [
    "6.4 Authentication protection",
    "64-authentication-protection"
   ],
   [
    "6.5 Authentication event records",
    "65-authentication-event-records"
   ],
   [
    "6.6 Acceptance criteria",
    "66-acceptance-criteria"
   ]
  ],
  "criteria": [
   "Protected routes reject unauthenticated users.",
   "Expired and revoked sessions cannot access protected resources.",
   "Privileged accounts require stronger authentication.",
   "Authentication events are auditable.",
   "Failed authentication does not reveal whether an account exists."
  ]
 },
 {
  "id": "05",
  "slug": "roles-permissions",
  "name": "Roles & Permissions",
  "purpose": "Control who can access which resources and perform which actions.",
  "sections": [
   [
    "7.1 Purpose",
    "71-purpose"
   ],
   [
    "7.2 Authorization architecture",
    "72-authorization-architecture"
   ],
   [
    "7.3 Proposed system roles",
    "73-proposed-system-roles"
   ],
   [
    "7.4 Permission model",
    "74-permission-model"
   ],
   [
    "7.5 Permission categories",
    "75-permission-categories"
   ],
   [
    "7.6 Permission administration",
    "76-permission-administration"
   ],
   [
    "7.7 Authorization decision flow",
    "77-authorization-decision-flow"
   ],
   [
    "7.8 Acceptance criteria",
    "78-acceptance-criteria"
   ]
  ],
  "criteria": [
   "Unauthorized operations are rejected server-side.",
   "Permissions are scoped.",
   "Privileged role changes are auditable.",
   "Denied requests generate appropriate records.",
   "Separation-of-duties rules are enforced for designated actions.",
   "Default authorization behavior is deny."
  ]
 },
 {
  "id": "06",
  "slug": "governance-center",
  "name": "Governance Center",
  "purpose": "The Governance Center manages the rules, authority structures, policies, approvals, and controlled decisions that govern AH-AIOS.",
  "sections": [
   [
    "8.1 Purpose",
    "81-purpose"
   ],
   [
    "8.2 Governance registry",
    "82-governance-registry"
   ],
   [
    "8.3 Policy lifecycle",
    "83-policy-lifecycle"
   ],
   [
    "8.4 Governance workflows",
    "84-governance-workflows"
   ],
   [
    "8.5 Governance authority registry",
    "85-governance-authority-registry"
   ],
   [
    "8.6 Controlled integration governance",
    "86-controlled-integration-governance"
   ],
   [
    "8.7 Governance decision records",
    "87-governance-decision-records"
   ],
   [
    "8.8 Acceptance criteria",
    "88-acceptance-criteria"
   ]
  ],
  "criteria": [
   "Policies have unique identifiers and version history.",
   "Approval authority is checked before approval.",
   "Exceptions have explicit scope and expiration.",
   "Governance decisions retain their rationale and evidence.",
   "Policy activation can be independently verified.",
   "No generated content becomes authorized policy or canon merely through generation."
  ]
 },
 {
  "id": "07",
  "slug": "security-center",
  "name": "Security Center",
  "purpose": "The Security Center manages security posture, protective controls, security events, incidents, and remediation across AH-AIOS.",
  "sections": [
   [
    "9.1 Purpose",
    "91-purpose"
   ],
   [
    "9.2 Security dashboard",
    "92-security-dashboard"
   ],
   [
    "9.3 Security domains",
    "93-security-domains"
   ],
   [
    "9.4 Security incident management",
    "94-security-incident-management"
   ],
   [
    "9.5 Vulnerability management",
    "95-vulnerability-management"
   ],
   [
    "9.6 Security response controls",
    "96-security-response-controls"
   ],
   [
    "9.7 Acceptance criteria",
    "97-acceptance-criteria"
   ]
  ],
  "criteria": [
   "Security events are recorded.",
   "Incident lifecycle transitions are controlled.",
   "Critical findings cannot disappear without closure evidence or an authorized exception.",
   "Credentials are not exposed in logs or UI responses.",
   "Security actions are permission-checked.",
   "Security findings can be traced to affected services and remediation records."
  ]
 },
 {
  "id": "08",
  "slug": "configuration-secrets",
  "name": "Configuration & Secrets",
  "purpose": "Provide controlled management of application settings, environment configuration, and sensitive credentials.",
  "sections": [
   [
    "10.1 Purpose",
    "101-purpose"
   ],
   [
    "10.2 Configuration registry",
    "102-configuration-registry"
   ],
   [
    "10.3 Environment separation",
    "103-environment-separation"
   ],
   [
    "10.4 Secrets management",
    "104-secrets-management"
   ],
   [
    "10.5 Configuration change workflow",
    "105-configuration-change-workflow"
   ],
   [
    "10.6 Feature flags",
    "106-feature-flags"
   ],
   [
    "10.7 Acceptance criteria",
    "107-acceptance-criteria"
   ]
  ],
  "criteria": [
   "Configuration is environment-scoped.",
   "Secret values are never returned to unauthorized clients.",
   "Changes are auditable.",
   "Invalid configurations are rejected.",
   "Production configuration changes follow the required approval workflow.",
   "Rollback restores a previously verified configuration version."
  ]
 },
 {
  "id": "09",
  "slug": "infrastructure-services",
  "name": "Infrastructure & Services",
  "purpose": "Provide visibility and administrative control over the services required by AH-AIOS.",
  "sections": [
   [
    "11.1 Purpose",
    "111-purpose"
   ],
   [
    "11.2 Service registry",
    "112-service-registry"
   ],
   [
    "11.3 Service health monitoring",
    "113-service-health-monitoring"
   ],
   [
    "11.4 Dependency registry",
    "114-dependency-registry"
   ],
   [
    "11.5 Infrastructure operations",
    "115-infrastructure-operations"
   ],
   [
    "11.6 Acceptance criteria",
    "116-acceptance-criteria"
   ]
  ],
  "criteria": [
   "Every registered service has an owner.",
   "Health results include timestamps.",
   "Dependencies can be inspected.",
   "Failed checks create visible findings.",
   "Service actions are authorized and audited.",
   "CORE does not claim control of infrastructure it cannot actually access."
  ]
 },
 {
  "id": "10",
  "slug": "audit-accountability",
  "name": "Audit & Accountability",
  "purpose": "Maintain an attributable record of significant actions, decisions, changes, access events, and system outcomes.",
  "sections": [
   [
    "12.1 Purpose",
    "121-purpose"
   ],
   [
    "12.2 Audit event categories",
    "122-audit-event-categories"
   ],
   [
    "12.3 Audit event schema",
    "123-audit-event-schema"
   ],
   [
    "12.4 Audit integrity",
    "124-audit-integrity"
   ],
   [
    "12.5 Audit search and reporting",
    "125-audit-search-and-reporting"
   ],
   [
    "12.6 Accountability workflows",
    "126-accountability-workflows"
   ],
   [
    "12.7 Acceptance criteria",
    "127-acceptance-criteria"
   ]
  ],
  "criteria": [
   "Significant operations create attributable events.",
   "Events can be correlated across services.",
   "Audit access is restricted.",
   "Sensitive information is redacted.",
   "Integrity verification detects unauthorized alteration.",
   "Audit retention and export behavior are tested."
  ]
 },
 {
  "id": "11",
  "slug": "evidence-verification",
  "name": "Evidence & Verification",
  "purpose": "Establish the evidence infrastructure through which AH-AIOS verifies its capabilities, controls, decisions, and operational claims.",
  "sections": [
   [
    "13.1 Purpose",
    "131-purpose"
   ],
   [
    "13.2 Evidence registry",
    "132-evidence-registry"
   ],
   [
    "13.3 Evidence record structure",
    "133-evidence-record-structure"
   ],
   [
    "13.4 Verification lifecycle",
    "134-verification-lifecycle"
   ],
   [
    "13.5 Verification categories",
    "135-verification-categories"
   ],
   [
    "13.6 Automated verification engine",
    "136-automated-verification-engine"
   ],
   [
    "13.7 Capability verification matrix",
    "137-capability-verification-matrix"
   ],
   [
    "13.8 Acceptance criteria",
    "138-acceptance-criteria"
   ]
  ],
  "criteria": [
   "Evidence has unique identifiers.",
   "Evidence is linked to requirements and implementations.",
   "Test failures remain preserved.",
   "Verification results identify the tested version and environment.",
   "Unverified capabilities are clearly marked.",
   "Operational status requires the applicable verification evidence."
  ]
 },
 {
  "id": "12",
  "slug": "risk-compliance",
  "name": "Risk & Compliance",
  "purpose": "Manage operational, technical, security, governance, and compliance risks across AH-AIOS.",
  "sections": [
   [
    "14.1 Purpose",
    "141-purpose"
   ],
   [
    "14.2 Risk register",
    "142-risk-register"
   ],
   [
    "14.3 Risk categories",
    "143-risk-categories"
   ],
   [
    "14.4 Risk assessment",
    "144-risk-assessment"
   ],
   [
    "14.5 Compliance control registry",
    "145-compliance-control-registry"
   ],
   [
    "14.6 Exception management",
    "146-exception-management"
   ],
   [
    "14.7 Remediation management",
    "147-remediation-management"
   ],
   [
    "14.8 Acceptance criteria",
    "148-acceptance-criteria"
   ]
  ],
  "criteria": [
   "Every material risk has an owner.",
   "Risk acceptance is authorized.",
   "Exceptions have expiration dates.",
   "Compliance claims are evidence-backed.",
   "Overdue remediation is visible.",
   "Risk and compliance records are traceable to affected capabilities."
  ]
 },
 {
  "id": "13",
  "slug": "change-release",
  "name": "Change & Release Management",
  "purpose": "Control the lifecycle of changes to AH-AIOS architecture, services, policies, configuration, data structures, and deployments.",
  "sections": [
   [
    "15.1 Purpose",
    "151-purpose"
   ],
   [
    "15.2 Change registry",
    "152-change-registry"
   ],
   [
    "15.3 Change classification",
    "153-change-classification"
   ],
   [
    "15.4 Change lifecycle",
    "154-change-lifecycle"
   ],
   [
    "15.5 Release management",
    "155-release-management"
   ],
   [
    "15.6 Version management",
    "156-version-management"
   ],
   [
    "15.7 Rollback",
    "157-rollback"
   ],
   [
    "15.8 Acceptance criteria",
    "158-acceptance-criteria"
   ]
  ],
  "criteria": [
   "Material changes have unique identifiers.",
   "Required approvals precede implementation.",
   "Releases identify exact source and artifacts.",
   "Failed deployments remain recorded.",
   "Rollbacks are authorized and verified.",
   "Release status is not equivalent to operational status."
  ]
 }
];
