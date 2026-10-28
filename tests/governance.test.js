import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyCanonTransition,
  canTransitionCanon,
  GovernanceError,
  GOVERNANCE_ACTORS,
} from '../src/governance.js';

const record = { id: 'record-1', type: 'World', name: 'Aetherfall', canonState: 'Validated', history: [] };

test('unauthorized creator cannot approve a validated canon record in application logic', () => {
  assert.equal(canTransitionCanon(GOVERNANCE_ACTORS.creator, 'Validated', 'Approved'), false);
  assert.throws(() => applyCanonTransition({
    record,
    nextState: 'Approved',
    actor: GOVERNANCE_ACTORS.creator,
    rationale: 'Looks good',
    reviewId: 'review-1',
  }), error => error instanceof GovernanceError && error.code === 'FORBIDDEN');
  assert.equal(record.canonState, 'Validated', 'rejection must leave the original record untouched');
});

test('canon authority can approve with a rationale and the action records actor and prior state', () => {
  const result = applyCanonTransition({
    record,
    nextState: 'Approved',
    actor: GOVERNANCE_ACTORS.canonAuthority,
    rationale: 'Evidence reviewed against the cited source.',
    at: '2026-10-28T00:00:00.000Z',
    reviewId: 'review-2',
  });

  assert.equal(result.record.canonState, 'Approved');
  assert.equal(result.review.fromState, 'Validated');
  assert.equal(result.review.actorId, GOVERNANCE_ACTORS.canonAuthority.id);
  assert.equal(result.review.actorRole, 'CanonAuthority');
  assert.equal(result.review.rationale, 'Evidence reviewed against the cited source.');
  assert.equal(record.canonState, 'Validated', 'transition must return a new record rather than mutate the input');
});

test('a role cannot bypass the permitted transition sequence', () => {
  assert.throws(() => applyCanonTransition({
    record: { ...record, canonState: 'Proposed' },
    nextState: 'Approved',
    actor: GOVERNANCE_ACTORS.canonAuthority,
    rationale: 'Skip validation',
    reviewId: 'review-3',
  }), error => error instanceof GovernanceError && error.code === 'INVALID_TRANSITION');
});

test('canon transition requires a rationale', () => {
  assert.throws(() => applyCanonTransition({
    record,
    nextState: 'Approved',
    actor: GOVERNANCE_ACTORS.canonAuthority,
    rationale: '  ',
    reviewId: 'review-4',
  }), error => error instanceof GovernanceError && error.code === 'RATIONALE_REQUIRED');
});
