<!-- Notion source export 40966662-b29d-8167-85b2-e2352aa4da50; original repository path src/governance.js; exported 2026-10-30. -->

<b>Repository:</b> [hydraporss/ah-aios-react-website](https://github.com/hydraporss/ah-aios-react-website)
<b>Branch:</b> `main`
<b>Source path:</b> `src/governance.js`
<b>Size:</b> 3705 bytes
<b>Git blob SHA:</b> `8d21a745155e2463fea802c9325c3a68b972562d`
<b>GitHub source:</b> [Open original](https://github.com/hydraporss/ah-aios-react-website/blob/main/src/governance.js)

---

```javascript
export const CANON_TRANSITIONS = Object.freeze({
  Draft: Object.freeze(['Proposed', 'Rejected']),
  Proposed: Object.freeze(['Investigated', 'Rejected']),
  Investigated: Object.freeze(['Validated', 'Rejected']),
  Validated: Object.freeze(['Approved', 'Rejected']),
  Approved: Object.freeze(['Superseded']),
  Rejected: Object.freeze([]),
  Superseded: Object.freeze([]),
});

export const GOVERNANCE_ACTORS = Object.freeze({
  creator: Object.freeze({ id: 'demo-creator', name: 'Atlas Researcher', role: 'Creator' }),
  reviewer: Object.freeze({ id: 'demo-reviewer', name: 'Demo Reviewer', role: 'Reviewer' }),
  canonAuthority: Object.freeze({ id: 'demo-canon-authority', name: 'Demo Canon Authority', role: 'CanonAuthority' }),
});

const ROLE_CAPABILITIES = Object.freeze({
  Creator: Object.freeze(['canon:propose']),
  Reviewer: Object.freeze(['canon:investigate', 'canon:validate', 'canon:reject']),
  CanonAuthority: Object.freeze(['canon:approve', 'canon:reject', 'canon:supersede']),
});

const TRANSITION_CAPABILITY = Object.freeze({
  Proposed: 'canon:propose',
  Investigated: 'canon:investigate',
  Validated: 'canon:validate',
  Approved: 'canon:approve',
  Rejected: 'canon:reject',
  Superseded: 'canon:supersede',
});

export class GovernanceError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'GovernanceError';
    this.code = code;
  }
}

export function requireGovernanceCapability(actor, capability) {
  if (!actor?.id || !ROLE_CAPABILITIES[actor.role]) {
    throw new GovernanceError('ACTOR_REQUIRED', 'A recognized actor is required.');
  }
  if (!ROLE_CAPABILITIES[actor.role].includes(capability)) {
    throw new GovernanceError('FORBIDDEN', `${actor.role} is not authorized for ${capability}.`);
  }
}

export function canTransitionCanon(actor, currentState, nextState) {
  if (!actor?.id || !ROLE_CAPABILITIES[actor.role]) return false;
  const capability = TRANSITION_CAPABILITY[nextState];
  return Boolean(capability && ROLE_CAPABILITIES[actor.role].includes(capability)
    && CANON_TRANSITIONS[currentState]?.includes(nextState));
}

/** Pure application-layer policy and state transition. UI visibility is not an authorization check. */
export function applyCanonTransition({ record, nextState, actor, rationale, at = new Date().toISOString(), reviewId }) {
  if (!record?.id) throw new GovernanceError('RECORD_REQUIRED', 'A canon record is required.');
  if (!actor?.id || !ROLE_CAPABILITIES[actor.role]) throw new GovernanceError('ACTOR_REQUIRED', 'A recognized actor is required.');

  const currentState = record.canonState || 'Draft';
  if (!CANON_TRANSITIONS[currentState]?.includes(nextState)) {
    throw new GovernanceError('INVALID_TRANSITION', `Invalid canon transition: ${currentState} → ${nextState}.`);
  }
  requireGovernanceCapability(actor, TRANSITION_CAPABILITY[nextState]);
  if (!String(rationale || '').trim()) throw new GovernanceError('RATIONALE_REQUIRED', 'A decision rationale is required.');

  const review = {
    id: reviewId,
    targetType: record.type,
    targetId: record.id,
    decision: nextState,
    fromState: currentState,
    toState: nextState,
    reviewer: actor.name || actor.id,
    actorId: actor.id,
    actorRole: actor.role,
    rationale: String(rationale).trim(),
    createdAt: at,
  };
  const history = {
    at,
    action: `Canon state changed to ${nextState}`,
    actor: review.reviewer,
    actorId: actor.id,
    actorRole: actor.role,
    reviewId,
    rationale: review.rationale,
  };

  return {
    review,
    record: {
      ...record,
      canonState: nextState,
      status: nextState,
      history: [...(record.history || []), history],
    },
  };
}

```
