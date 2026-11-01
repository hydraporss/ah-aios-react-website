"""
Phase 1 vertical slice: the 7-step knowledge lifecycle.

Steps (each is one governed record or boundary):
  1. Workspace  - root boundary (plus the acting user)
  2. Source     - a document with a checksum
  3. Claim      - an assertion; PROPOSED, never a fact
  4. Evidence   - links the claim to the source
  5. Review     - a human score; a review is NOT a decision
  6. Decision   - the only record that changes governance state
  7. Version    - a snapshot of the claim as it stood at decision time

Governance rules preserved here (see models.py header):
  - A claim is an assertion, not a fact. The Claim row is never mutated by the
    slice; its status stays PROPOSED. The Decision row records the outcome.
  - Evidence is not approval. A review is not a decision.
  - Every state transition writes an AuditEvent (six events in total).

Notes on what this module does NOT do:
  - The source checksum is the SHA-256 of a fixed demonstration payload. No
    real PDF exists behind the Source record (file_path stays NULL).
  - The acting user has an unusable random password and cannot log in.

Usage:
    from ah_webapp.phase1_vertical_slice import build_vertical_slice
    proof = build_vertical_slice()                   # isolated in-memory app
    proof = build_vertical_slice(app=my_app)         # use an existing app
    proof = build_vertical_slice(recreate_db=True)   # test databases only
"""

import hashlib
import json
import secrets
from datetime import datetime, timedelta
from decimal import Decimal

from flask import current_app, has_app_context

from . import db

WORKSPACE_NAME = "AH-AIOS Research"
WORKSPACE_SLUG = "ah-aios-research"
ACTOR_EMAIL = "vertical-slice@example.invalid"
SOURCE_TITLE = "First Settlement - Primary Record"
SOURCE_PAYLOAD = b"AH-AIOS Phase 1 vertical slice demonstration payload: First Settlement - Primary Record"
CLAIM_STATEMENT = "The First Settlement was founded in 2184."
WORKFLOW_TYPE = "PHASE1_VERTICAL_SLICE"
EXPECTED_AUDIT_EVENTS = [
    "SOURCE_CREATED",
    "CLAIM_CREATED",
    "EVIDENCE_ATTACHED",
    "REVIEW_COMPLETED",
    "DECISION_ACCEPTED",
    "VERSION_CREATED",
]
STEPS_TOTAL = 7


# --- small pure helpers (no database) ---------------------------------------

def sha256_checksum(payload: bytes) -> str:
    """Return a checksum string in the form 'sha256-<hex digest>'."""
    return "sha256-" + hashlib.sha256(payload).hexdigest()


def format_score(value) -> str:
    """Format a numeric score with two decimal places, e.g. 4 -> '4.00'."""
    return f"{Decimal(str(value)):.2f}"


def _is_disposable_database(app) -> bool:
    uri = str(app.config.get("SQLALCHEMY_DATABASE_URI", ""))
    return bool(app.config.get("TESTING")) or uri in ("sqlite://", "sqlite:///:memory:")


def _make_isolated_app():
    """Create a throwaway app on an in-memory SQLite database."""
    from . import create_app

    return create_app({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "SQLALCHEMY_TRACK_MODIFICATIONS": False,
        "AH_AIOS_ADMIN_EMAIL": "",
        "AH_AIOS_ADMIN_PASSWORD": "",
    })


# --- the slice ---------------------------------------------------------------

def build_vertical_slice(app=None, recreate_db=False):
    """Run the 7-step lifecycle and return a proof dictionary.

    app          Flask app to use. Default: the current app if one is active,
                 otherwise a new isolated in-memory app.
    recreate_db  Drop and recreate all tables first. Refused unless the app
                 is in TESTING mode or uses an in-memory database, so it can
                 never wipe a real database.
    """
    if app is None:
        app = current_app._get_current_object() if has_app_context() else _make_isolated_app()

    if recreate_db and not _is_disposable_database(app):
        raise RuntimeError(
            "recreate_db=True is only allowed for TESTING apps or in-memory "
            "databases; refusing to drop tables on a non-disposable database."
        )

    with app.app_context():
        if recreate_db:
            db.drop_all()
            db.create_all()
        try:
            return _run_slice()
        except Exception:
            db.session.rollback()
            raise


def _run_slice():
    from .models import (
        Workspace, Source, Claim, Evidence, Review, Decision,
        KnowledgeVersion, AuditEvent, WorkflowRun, User,
    )

    if db.session.scalar(db.select(Workspace).filter_by(slug=WORKSPACE_SLUG)) is not None:
        raise RuntimeError(
            "The vertical slice has already been built in this database. "
            "Use a fresh database (or recreate_db=True on a test database)."
        )

    # Strictly increasing timestamps so audit ordering is deterministic.
    clock_base = datetime.utcnow()
    tick = {"n": 0}

    def now():
        tick["n"] += 1
        return clock_base + timedelta(microseconds=tick["n"])

    def audit(workspace, actor, event_type, entity_type, entity_id, details):
        db.session.add(AuditEvent(
            workspace_id=workspace.id,
            actor_id=actor.id,
            event_type=event_type,
            entity_type=entity_type,
            entity_id=entity_id,
            details=json.dumps(details, sort_keys=True),
            created_at=now(),
        ))

    # Step 1: workspace and acting user -------------------------------------
    actor = db.session.scalar(db.select(User).filter_by(email=ACTOR_EMAIL))
    if actor is None:
        actor = User(email=ACTOR_EMAIL, name="Vertical Slice Operator", role="moderator")
        actor.set_password(secrets.token_urlsafe(32))  # unusable: never shown or stored
        db.session.add(actor)
    workspace = Workspace(name=WORKSPACE_NAME, slug=WORKSPACE_SLUG,
                          description="Phase 1 vertical slice workspace")
    db.session.add(workspace)
    db.session.flush()
    steps_executed = 1

    # Step 2: source --------------------------------------------------------
    source = Source(workspace_id=workspace.id, title=SOURCE_TITLE, source_type="PDF",
                    checksum=sha256_checksum(SOURCE_PAYLOAD))
    db.session.add(source)
    db.session.flush()
    audit(workspace, actor, "SOURCE_CREATED", "Source", source.id,
          {"title": source.title, "checksum": source.checksum})
    steps_executed += 1

    # Step 3: claim (an assertion, not a fact) ------------------------------
    claim = Claim(workspace_id=workspace.id, statement=CLAIM_STATEMENT,
                  status="PROPOSED", created_by=actor.id)
    db.session.add(claim)
    db.session.flush()
    audit(workspace, actor, "CLAIM_CREATED", "Claim", claim.id,
          {"statement": claim.statement, "status": claim.status})
    steps_executed += 1

    # Step 4: evidence links claim to source (evidence is not approval) -----
    evidence = Evidence(claim_id=claim.id, source_id=source.id,
                        evidence_type="SUPPORTING",
                        excerpt="Founding recorded as 2184 in the primary record.",
                        page_number=14)
    db.session.add(evidence)
    db.session.flush()
    audit(workspace, actor, "EVIDENCE_ATTACHED", "Evidence", evidence.id,
          {"claim_id": claim.id, "source_id": source.id})
    steps_executed += 1

    # Step 5: review (a review is not a decision) ---------------------------
    review = Review(claim_id=claim.id, reviewer_id=actor.id, score=Decimal("4.00"),
                    comments="Primary record supports the stated founding year.")
    db.session.add(review)
    db.session.flush()
    audit(workspace, actor, "REVIEW_COMPLETED", "Review", review.id,
          {"claim_id": claim.id, "score": format_score("4.00")})
    steps_executed += 1

    # Step 6: decision (the only record that changes governance state) ------
    decision = Decision(claim_id=claim.id, outcome="ACCEPTED", decided_by=actor.id,
                        rationale="Supported by primary-source evidence and a passing review.")
    db.session.add(decision)
    db.session.flush()
    audit(workspace, actor, "DECISION_ACCEPTED", "Decision", decision.id,
          {"claim_id": claim.id, "outcome": decision.outcome})
    steps_executed += 1

    # Step 7: knowledge version snapshot at decision time -------------------
    snapshot = {
        "claim_id": claim.id,
        "statement": claim.statement,
        "claim_status": claim.status,   # unchanged: the decision, not the claim row, holds the outcome
        "decision": decision.outcome,
        "decision_id": decision.id,
        "evidence_ids": [evidence.id],
        "source_ids": [source.id],
        "review_score": format_score(review.score),
    }
    version = KnowledgeVersion(workspace_id=workspace.id, claim_id=claim.id,
                               version_number=1,
                               snapshot=json.dumps(snapshot, sort_keys=True))
    db.session.add(version)
    db.session.flush()
    audit(workspace, actor, "VERSION_CREATED", "KnowledgeVersion", version.id,
          {"claim_id": claim.id, "version_number": 1})
    steps_executed += 1
    db.session.flush()

    # Validate what was actually persisted (read back from the database) ----
    persisted_events = [
        e.event_type for e in db.session.scalars(
            db.select(AuditEvent)
            .filter_by(workspace_id=workspace.id)
            .order_by(AuditEvent.created_at)
        )
    ]
    checks = {
        "seven_steps_executed": steps_executed == STEPS_TOTAL,
        "audit_chain_complete_and_ordered": persisted_events == EXPECTED_AUDIT_EVENTS,
        "claim_status_unchanged": claim.status == "PROPOSED",
        "decision_recorded": decision.outcome == "ACCEPTED",
        "snapshot_matches_decision": snapshot["decision"] == decision.outcome
                                     and snapshot["statement"] == claim.statement,
    }
    run_status = "SUCCESS" if all(checks.values()) else "FAILED"

    workflow = WorkflowRun(
        workspace_id=workspace.id,
        workflow_type=WORKFLOW_TYPE,
        status=run_status,
        input_payload=json.dumps({"workspace": WORKSPACE_NAME, "claim": CLAIM_STATEMENT}, sort_keys=True),
        output_payload=json.dumps({
            "source_id": source.id, "claim_id": claim.id, "evidence_id": evidence.id,
            "review_id": review.id, "decision_id": decision.id, "version_id": version.id,
        }, sort_keys=True),
        validation_report=json.dumps({"checks": checks, "steps_executed": steps_executed}, sort_keys=True),
    )
    db.session.add(workflow)
    db.session.commit()

    return {
        "workspace_name": workspace.name,
        "source": {"id": source.id, "title": source.title,
                   "source_type": source.source_type, "checksum": source.checksum},
        "claim": {"id": claim.id, "statement": claim.statement, "status": claim.status},
        "evidence": {"id": evidence.id, "evidence_type": evidence.evidence_type,
                     "page_number": evidence.page_number},
        "review": {"id": review.id, "score": format_score(review.score)},
        "decision": {"id": decision.id, "outcome": decision.outcome},
        "version": {"id": version.id, "version_number": version.version_number,
                    "snapshot": json.loads(version.snapshot)},
        "workflow_run": {"id": workflow.id, "status": workflow.status,
                         "steps_executed": steps_executed, "checks": checks},
        "audit_event_types": persisted_events,
    }
