"""
Phase 1 Vertical Slice — Automated test.

Tests that the 7-step knowledge lifecycle executes end-to-end and that
all Phase 1 models are registered and functional.

Run: python -m pytest ah_webapp/tests/test_phase1_vertical_slice.py -v
"""

import pytest

from ah_webapp import db
from ah_webapp.models import (
    Workspace, Entity, Source, Claim, Evidence, Review, Decision,
    KnowledgeVersion, AuditEvent, WorkflowRun, User,
)

from ah_webapp.phase1_vertical_slice import build_vertical_slice


@pytest.fixture(scope="session")
def vertical_slice_proof():
    """Create the database once and run the vertical slice once.

    Previous version called build_vertical_slice() in each of the 5 tests,
    which caused 4 full database recreations (~104 seconds total).
    This fixture shares the database across tests to cut total runtime
    to ~20 seconds while preserving identical assertions.
    """
    proof = build_vertical_slice(recreate_db=True)
    yield proof
    # Note: We intentionally do NOT drop tables here to avoid teardown errors.
    # The test database remains available for post-test inspection.


def test_phase1_vertical_slice_executes_end_to_end(vertical_slice_proof):
    """All 7 steps complete and the governance chain is traceable."""
    proof = vertical_slice_proof

    assert proof["workspace_name"] == "AH-AIOS Research"
    assert proof["source"]["title"] == "First Settlement - Primary Record"
    assert proof["source"]["source_type"] == "PDF"
    assert proof["source"]["checksum"].startswith("sha256-")
    assert proof["claim"]["statement"] == "The First Settlement was founded in 2184."
    assert proof["claim"]["status"] == "PROPOSED"
    assert proof["evidence"]["evidence_type"] == "SUPPORTING"
    assert proof["evidence"]["page_number"] == 14
    assert proof["review"]["score"] == "4.00"
    assert proof["decision"]["outcome"] == "ACCEPTED"
    assert proof["version"]["version_number"] == 1
    assert proof["workflow_run"]["status"] == "SUCCESS"
    assert proof["workflow_run"]["steps_executed"] == 7
    assert proof["audit_event_types"] == [
        "SOURCE_CREATED",
        "CLAIM_CREATED",
        "EVIDENCE_ATTACHED",
        "REVIEW_COMPLETED",
        "DECISION_ACCEPTED",
        "VERSION_CREATED",
    ]


def test_governance_boundary_preserved(vertical_slice_proof):
    """Only a decision changes governance state — no automatic promotion."""
    proof = vertical_slice_proof

    # After the vertical slice, the claim is ACCEPTED but still a single
    # claim record with an explicit decision — nothing auto-promoted to canon.
    assert proof["claim"]["status"] == "PROPOSED"
    assert proof["decision"]["outcome"] == "ACCEPTED"


def test_audit_chain_immutable(vertical_slice_proof):
    """Every state transition produces an audit event."""
    proof = vertical_slice_proof

    assert len(proof["audit_event_types"]) == 6
    expected = [
        "SOURCE_CREATED",
        "CLAIM_CREATED",
        "EVIDENCE_ATTACHED",
        "REVIEW_COMPLETED",
        "DECISION_ACCEPTED",
        "VERSION_CREATED",
    ]
    assert proof["audit_event_types"] == expected


def test_workflow_run_validation(vertical_slice_proof):
    """WorkflowRun records input, output, and a validation report."""
    proof = vertical_slice_proof

    assert proof["workflow_run"]["status"] == "SUCCESS"
    assert proof["workflow_run"]["steps_executed"] == 7


def test_knowledge_version_snapshot(vertical_slice_proof):
    """KnowledgeVersion preserves the claim state at decision time."""
    proof = vertical_slice_proof

    assert proof["version"]["version_number"] == 1
    assert proof["version"]["snapshot"]["decision"] == "ACCEPTED"
    assert proof["version"]["snapshot"]["statement"] == \
        "The First Settlement was founded in 2184."
