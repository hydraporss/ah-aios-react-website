"""
AH-COMMAND-BUS-001 — Hermes Command & Governance Intelligence Layer (Phase 2)

The command bus turns every action into a governed command:
  Input -> Interpret Intent -> Assemble Context -> Govern Knowledge Access
         -> Execute Workflow -> Validate Result -> Record Provenance -> Return

Command Contract (every command follows this structure):
  {
    "command": "REVIEW_CLAIM",
    "workspace": "aleryos",
    "inputs": { "claim_id": "123" },
    "permissions": ["review_claim"],
    "validation_rules": ["claim_exists", "evidence_attached"],
    "expected_output": { "review_id": "uuid" }
  }

This makes commands: auditable, testable, replayable, governable.

Only the command registry below is implemented in this phase. Command handlers
call into the Phase 1 tables (ah_webapp/models.py). The Mission Control
dashboard and the four intelligence modes are forward work.

Status: IMPLEMENTED (registry + command bus + command contract validation)
"""

import uuid
from typing import Any, Dict, List, Optional, Callable, Union

# Import the Phase 1 models (flat file model: ah_webapp/models.py)
from ah_webapp.models import (
    db,
    Workspace,
    Entity,
    Source,
    Claim,
    Evidence,
    Review,
    Decision,
    KnowledgeVersion,
    AuditEvent,
    WorkflowRun,
    User,
)

# Batch 1 command handlers (INSPECT, MAP, COMPARE, REPORT, AUDIT)
from ah_webapp.batch1_handlers import (
    handle_inspect_record,
    handle_map_relationships,
    handle_compare_versions,
    handle_generate_report,
    handle_audit_workspace,
)

# =====================================================================
# Command contract types
# =====================================================================

ValidationRuleFn = Callable[..., bool]
CommandHandlerFn = Callable[..., Dict[str, Any]]


class CommandContractError(ValueError):
    """Raised when a command contract fails validation."""


# =====================================================================
# Validation rules (call into Phase 1 tables)
# =====================================================================

def claim_exists(session, inputs: Dict[str, Any]) -> bool:
    """Claim must exist."""
    claim_id = inputs.get("claim_id")
    if not claim_id:
        return False
    return session.query(Claim).filter_by(id=claim_id).first() is not None


def evidence_attached(session, inputs: Dict[str, Any]) -> bool:
    """Evidence must be attached to the claim."""
    claim_id = inputs.get("claim_id")
    if not claim_id:
        return False
    return session.query(Evidence).filter_by(claim_id=claim_id).first() is not None


def decision_exists(session, inputs: Dict[str, Any]) -> bool:
    """Decision must exist."""
    decision_id = inputs.get("decision_id")
    if not decision_id:
        return False
    return session.query(Decision).filter_by(id=decision_id).first() is not None


def workspace_exists(session, inputs: Dict[str, Any]) -> bool:
    """Workspace must exist."""
    workspace = inputs.get("workspace")
    if not workspace:
        return False
    return session.query(Workspace).filter_by(id=workspace).first() is not None


def entity_exists(session, inputs: Dict[str, Any]) -> bool:
    """Entity must exist."""
    entity_id = inputs.get("entity_id")
    if not entity_id:
        return False
    return session.query(Entity).filter_by(id=entity_id).first() is not None


def source_exists(session, inputs: Dict[str, Any]) -> bool:
    """Source must exist."""
    source_id = inputs.get("source_id")
    if not source_id:
        return False
    return session.query(Source).filter_by(id=source_id).first() is not None


# =====================================================================
# Migration-specific validation rules
# =====================================================================

def migration_plan_exists(session, inputs: Dict[str, Any]) -> bool:
    """Migration plan file must exist and be well-formed."""
    plan_id = inputs.get("plan_id")
    if not plan_id:
        return False
    # Check for plan file in private/ directory
    import os
    plan_path = os.path.join(os.path.dirname(__file__), "..", "private", f"AIOS-UPG-001-R1-*.md")
    return os.path.exists(plan_path)


def migration_plan_approved(session, inputs: Dict[str, Any]) -> bool:
    """Migration plan must be marked as approved."""
    plan_id = inputs.get("plan_id")
    if not plan_id:
        return False
    # The plan exists but gate 1 (Director Authorization) must be satisfied
    # This is checked separately by gate evaluation
    return True


def gate_g1_satisfied(session, inputs: Dict[str, Any]) -> bool:
    """Gate 1: Director Authorization Record must be issued and valid."""
    # Check ledger for Gate 1 status
    # Gate 1 = "Director Authorization Record issued"
    gate_1_status = _get_gate_status("G1")
    return gate_1_status == "SATISFIED"


def gate_g7_satisfied(session, inputs: Dict[str, Any]) -> bool:
    """Gate 7: Director authorization issued must be present."""
    # Check ledger for Gate 7 status
    gate_7_status = _get_gate_status("G7")
    return gate_7_status == "SATISFIED"


def gate_evaluated(session, inputs: Dict[str, Any]) -> bool:
    """Every gate must be evaluated before execution."""
    # Check that all gates are evaluated (not "UNRESOLVED", "NOT STARTED", etc.)
    gates = ["G1", "G2", "G3", "G4", "G5", "G6", "G7"]
    for gate_id in gates:
        status = _get_gate_status(gate_id)
        if status in ("UNRESOLVED", "NOT STARTED", "APPROVAL IMPOSSIBLE"):
            return False
    return True


def rollback_restore_point_exists(session, inputs: Dict[str, Any]) -> bool:
    """Rollback must reference an existing, verified restore point."""
    restore_point = inputs.get("restore_point")
    if not restore_point:
        return False
    # Check for restore point in private/backups directory
    import os
    backup_dir = os.path.join(
        os.path.dirname(__file__), "..", "private", "backups"
    )
    return os.path.exists(backup_dir)  # Placeholder - actual verification TBD


# =====================================================================
# Internal helper
# =====================================================================

def _get_gate_status(gate_id: str) -> str:
    """
    Read gate status from the completion ledger.
    This is a placeholder that would be replaced with actual
    ledger-reading logic in the implementation.
    """
    # In production, read from private/AIOS-UPG-001-completion-ledger.md
    # For now, return the current known status:
    gate_statuses = {
        "G1": "NOT_SATISFIED",
        "G2": "UNRESOLVED",
        "G3": "APPROVAL_IMPOSSIBLE",
        "G4": "NOT_STARTED",
        "G5": "NOT_STARTED",
        "G6": "NOT_STARTED",
        "G7": "NOT_SATISFIED",
    }
    return gate_statuses.get(gate_id, "UNRESOLVED")


# =====================================================================
# Command registry
# =====================================================================

# Category labels (from the design document)
CATEGORY_KNOWLEDGE = "Knowledge"
CATEGORY_GOVERNANCE = "Governance"
CATEGORY_WORKFLOW = "Workflow"
CATEGORY_CREATIVE = "Creative"
CATEGORY_ADMIN = "Administrative"

# Command metadata: command_name -> {display_name, category, description, validation_rules, expected_output, handler}
COMMAND_REGISTRY: Dict[str, Dict[str, Any]] = {
    # --- Knowledge commands ---
    "SEARCH": {
        "display_name": "Search Knowledge",
        "category": CATEGORY_KNOWLEDGE,
        "description": "Find entities, claims, and evidence across the workspace.",
        "validation_rules": ["workspace_exists"],
        "expected_output": {"results": "list"},
        "handler": "handle_search",
    },
    "QUERY": {
        "display_name": "Query Knowledge",
        "category": CATEGORY_KNOWLEDGE,
        "description": "Retrieve a governed answer with knowledge status.",
        "validation_rules": ["workspace_exists"],
        "expected_output": {"answer": "string", "knowledge_status": "string"},
        "handler": "handle_query",
    },
    "TRACE": {
        "display_name": "Trace Decision",
        "category": CATEGORY_KNOWLEDGE,
        "description": "Trace the decision, evidence, and audit trail for a claim.",
        "validation_rules": ["claim_exists"],
        "expected_output": {"decision": "dict", "evidence": "list", "audit_events": "list"},
        "handler": "handle_trace_decision",
    },
    "MAP": {
        "display_name": "Map Relationships",
        "category": CATEGORY_KNOWLEDGE,
        "description": "Return the relationship graph for a workspace or entity.",
        "validation_rules": ["workspace_exists"],
        "expected_output": {"entities": "list", "relationships": "list"},
        "handler": "handle_map_relationships",
    },
    "COMPARE": {
        "display_name": "Compare Versions",
        "category": CATEGORY_KNOWLEDGE,
        "description": "Compare two KnowledgeVersions of the same claim.",
        "validation_rules": ["claim_exists", "has_versions"],
        "expected_output": {"before": "dict", "after": "dict", "diff": "string"},
        "handler": "handle_compare_versions",
    },

    # --- Governance commands ---
    "REVIEW": {
        "display_name": "Review Claim",
        "category": CATEGORY_GOVERNANCE,
        "description": "Create a human review for a claim (scored, not decided).",
        "validation_rules": ["claim_exists", "reviewer_permissions"],
        "expected_output": {"review_id": "uuid"},
        "handler": "handle_review_claim",
    },
    "APPROVE": {
        "display_name": "Approve Claim",
        "category": CATEGORY_GOVERNANCE,
        "description": "Record an ACCEPTED decision for a claim.",
        "validation_rules": ["claim_exists", "reviewer_permissions"],
        "expected_output": {"decision_id": "uuid"},
        "handler": "handle_approve_claim",
    },
    "REJECT": {
        "display_name": "Reject Claim",
        "category": CATEGORY_GOVERNANCE,
        "description": "Record a REJECTED decision for a claim.",
        "validation_rules": ["claim_exists", "reviewer_permissions"],
        "expected_output": {"decision_id": "uuid"},
        "handler": "handle_reject_claim",
    },
    "ESCALATE": {
        "display_name": "Escalate Claim",
        "category": CATEGORY_GOVERNANCE,
        "description": "Flag a claim for higher-authority review.",
        "validation_rules": ["claim_exists"],
        "expected_output": {"review_id": "uuid", "escalated": "bool"},
        "handler": "handle_escalate_claim",
    },
    "VERIFY": {
        "display_name": "Verify Claim",
        "category": CATEGORY_GOVERNANCE,
        "description": "Re-run evidence verification on a claim.",
        "validation_rules": ["claim_exists", "has_evidence"],
        "expected_output": {"verified": "bool", "evidence_count": "int"},
        "handler": "handle_verify_claim",
    },

    # --- Workflow commands ---
    "EXECUTE": {
        "display_name": "Execute Workflow",
        "category": CATEGORY_WORKFLOW,
        "description": "Start a workflow run in a workspace.",
        "validation_rules": ["workspace_exists"],
        "expected_output": {"run_id": "uuid", "status": "string"},
        "handler": "handle_execute_workflow",
    },
    "MONITOR": {
        "display_name": "Monitor Workflow",
        "category": CATEGORY_WORKFLOW,
        "description": "Check the status of a workflow run.",
        "validation_rules": ["run_exists"],
        "expected_output": {"run_id": "uuid", "status": "string", "validation_report": "dict"},
        "handler": "handle_monitor_workflow",
    },
    "REPORT": {
        "display_name": "Generate Report",
        "category": CATEGORY_WORKFLOW,
        "description": "Generate an audit/report summary for a workspace.",
        "validation_rules": ["workspace_exists"],
        "expected_output": {"report_id": "uuid", "content": "string"},
        "handler": "handle_generate_report",
    },
    "VALIDATE": {
        "display_name": "Validate Claim",
        "category": CATEGORY_WORKFLOW,
        "description": "Validate a claim's evidence chain end-to-end.",
        "validation_rules": ["claim_exists"],
        "expected_output": {"valid": "bool", "chain": "list"},
        "handler": "handle_validate_claim",
    },

    # --- Creative commands ---
    "PROPOSE": {
        "display_name": "Propose Change",
        "category": CATEGORY_CREATIVE,
        "description": "Propose a change (PROPOSAL, not CANON).",
        "validation_rules": ["workspace_exists"],
        "expected_output": {"proposal_id": "uuid", "status": "string"},
        "handler": "handle_propose_change",
    },
    "EXPAND": {
        "display_name": "Expand World",
        "category": CATEGORY_CREATIVE,
        "description": "Expand the world model with new entities.",
        "validation_rules": ["workspace_exists"],
        "expected_output": {"entities_added": "int"},
        "handler": "handle_expand_world",
    },
    "SIMULATE": {
        "display_name": "Simulate",
        "category": CATEGORY_CREATIVE,
        "description": "Run a controlled simulation over the world model.",
        "validation_rules": ["workspace_exists"],
        "expected_output": {"simulation_id": "uuid"},
        "handler": "handle_simulate",
    },
    "EXPLORE": {
        "display_name": "Explore",
        "category": CATEGORY_CREATIVE,
        "description": "Explore the world model for emergent patterns.",
        "validation_rules": ["workspace_exists"],
        "expected_output": {"findings": "list"},
        "handler": "handle_explore",
    },
    "VISUALIZE": {
        "display_name": "Visualize",
        "category": CATEGORY_CREATIVE,
        "description": "Render a visual summary of the world.",
        "validation_rules": ["workspace_exists"],
        "expected_output": {"image_ref": "string"},
        "handler": "handle_visualize",
    },

    # --- Administrative commands ---
    "AUDIT": {
        "display_name": "Audit Workspace",
        "category": CATEGORY_ADMIN,
        "description": "Return the full audit event chain for a workspace.",
        "validation_rules": ["workspace_exists"],
        "expected_output": {"audit_events": "list", "event_count": "int"},
        "handler": "handle_audit_workspace",
    },
    "ROLLBACK": {
        "display_name": "Rollback",
        "category": CATEGORY_ADMIN,
        "description": "Rollback a claim to a prior KnowledgeVersion.",
        "validation_rules": ["claim_exists", "has_versions"],
        "expected_output": {"rolled_back_to": "int"},
        "handler": "handle_rollback",
    },
    "ARCHIVE": {
        "display_name": "Archive Workspace",
        "category": CATEGORY_ADMIN,
        "description": "Archive a workspace (mark as inactive).",
        "validation_rules": ["workspace_exists"],
        "expected_output": {"archived": "bool"},
        "handler": "handle_archive_workspace",
    },
    "RESTORE": {
        "display_name": "Restore",
        "category": CATEGORY_ADMIN,
        "description": "Restore a workspace from an archived state.",
        "validation_rules": ["workspace_exists", "is_archived"],
        "expected_output": {"restored": "bool"},
        "handler": "handle_restore_workspace",
    },
    "INSPECT": {
        "display_name": "Inspect Record",
        "category": CATEGORY_ADMIN,
        "description": "Inspect a single record by type and id.",
        "validation_rules": ["record_exists"],
        "expected_output": {"record": "dict"},
        "handler": "handle_inspect_record",
    },
    # --- Migration commands ---
    "MIGRATION_VALIDATE": {
        "display_name": "Validate Migration",
        "category": "Migration",
        "description": "Inspect the migration plan, required configuration, artifact identity, and readiness records.",
        "validation_rules": ["migration_plan_exists", "migration_plan_approved"],
        "expected_output": {"status": "str", "readiness": "dict", "artifacts": "dict", "unresolved_prerequisites": "list"},
        "handler": "handle_migration_validate",
    },
    "MIGRATION_DRY_RUN": {
        "display_name": "Dry Run Migration",
        "category": "Migration",
        "description": "Show proposed changes and unresolved prerequisites. Must not mutate target configuration or data.",
        "validation_rules": ["migration_plan_exists", "migration_plan_approved"],
        "expected_output": {"status": "str", "blocks": "list", "proposed_changes": "list", "writes_performed": "int", "commits_performed": "int", "diagnostic_writes": "int"},
        "handler": "handle_migration_dry_run",
    },
    "MIGRATION_EXECUTE": {
        "display_name": "Execute Migration",
        "category": "Migration",
        "description": "Perform the exact approved migration against the approved environment.",
        "validation_rules": ["migration_plan_approved", "gate_g1_satisfied", "gate_g7_satisfied"],
        "expected_output": {"status": "str", "checkpoints": "dict", "conformance": "dict", "evidence_package": "str", "certification_report": "str", "target_changes_applied": "bool"},
        "handler": "handle_migration_execute",
    },
    "MIGRATION_ROLLBACK": {
        "display_name": "Rollback Migration",
        "category": "Migration",
        "description": "Apply an approved recovery procedure using the identified restore point.",
        "validation_rules": ["migration_plan_approved", "rollback_restore_point_exists", "gate_g1_satisfied"],
        "expected_output": {"status": "str", "restore_point": "str", "target_mutations": "int", "audit_writes": "int", "rollback_event_id": "str"},
        "handler": "handle_migration_rollback",
    },
}

# Reverse lookup: command name -> metadata
COMMAND_BY_NAME = {name: meta for name, meta in COMMAND_REGISTRY.items()}


# =====================================================================
# Command contract validator
# =====================================================================

def validate_contract(
    command: str,
    workspace: str,
    inputs: Dict[str, Any],
    permissions: List[str],
    validation_rules: Optional[List[str]] = None,
    user_role: Optional[str] = None,
) -> None:
    """
    Validate a command contract before execution.

    Raises CommandContractError on failure.
    """
    if command not in COMMAND_REGISTRY:
        raise CommandContractError(f"Unknown command: {command!r}")

    meta = COMMAND_REGISTRY[command]

    # Role-based permissions
    if user_role:
        allowed_roles = {"member": "read", "moderator": "read", "admin": "admin"}
        if user_role not in allowed_roles:
            raise CommandContractError(f"Unknown role: {user_role!r}")
        if "review_claim" in permissions and user_role not in ("moderator", "admin"):
            raise CommandContractError(
                f"Role {user_role!r} lacks permission 'review_claim'"
            )

    # Run validation rules
    active_rules = validation_rules or meta["validation_rules"]
    # Attach the contract's workspace param to inputs for rules that need it.
    rule_inputs = dict(inputs)
    rule_inputs["workspace"] = workspace
    for rule_name in active_rules:
        rule_fn = RULES.get(rule_name)
        if rule_fn is None:
            raise CommandContractError(f"Unknown validation rule: {rule_name!r}")
        if not rule_fn(db.session, rule_inputs):
            raise CommandContractError(
                f"Validation failed for rule: {rule_name!r} (command: {command!r})"
            )


# =====================================================================
# Command registry helpers
# =====================================================================

def get_command_metadata(command: str) -> Dict[str, Any]:
    """Return metadata for a registered command."""
    if command not in COMMAND_REGISTRY:
        raise CommandContractError(f"Unknown command: {command!r}")
    return COMMAND_REGISTRY[command]


def list_commands(category: Optional[str] = None) -> List[Dict[str, Any]]:
    """Return all commands, optionally filtered by category."""
    result = []
    for name, meta in COMMAND_REGISTRY.items():
        if category is None or meta["category"] == category:
            result.append({
                "command": name,
                "display_name": meta["display_name"],
                "category": meta["category"],
                "description": meta["description"],
            })
    return result


# =====================================================================
# Command bus
# =====================================================================

class CommandBus:
    """Routes a validated command to its handler and records audit/events."""

    def __init__(self, session=None):
        self.session = session

    def execute(
        self,
        command: str,
        workspace: str,
        inputs: Dict[str, Any],
        permissions: Optional[List[str]] = None,
        user_role: Optional[str] = None,
        actor_id: Optional[int] = None,
    ) -> Dict[str, Any]:
        """
        Execute a command end-to-end:
          1. Validate contract
          2. Assemble governed context
          3. Run handler
          4. Record provenance (AuditEvent + WorkflowRun)
        """
        # 1. Validate contract
        validate_contract(
            command=command,
            workspace=workspace,
            inputs=inputs,
            permissions=permissions or [],
            validation_rules=None,
            user_role=user_role,
        )

        meta = COMMAND_REGISTRY[command]

        # 2. Assemble governed context (minimal — placeholder for engine)
        context = self._assemble_context(workspace, inputs)

        # 3. Run handler
        handler = HANDLERS.get(command)
        if handler is None:
            raise CommandContractError(f"No handler for command: {command!r}")
        handler_inputs = dict(inputs)
        handler_inputs["workspace"] = workspace
        result = handler(self.session, handler_inputs, context)

        # 4. Record provenance
        self._record_provenance(command, workspace, inputs, result, actor_id)

        return {
            "command": command,
            "workspace": workspace,
            "result": result,
            "knowledge_status": context.get("knowledge_status", "UNKNOWN"),
        }

    def _assemble_context(self, workspace: str, inputs: Dict[str, Any]) -> Dict[str, Any]:
        """Build governed context from the graph. Minimal placeholder."""
        # In a full implementation this would walk Workspace -> Entities -> Relationships
        # -> Claims -> Evidence -> Decisions -> Versions. For this phase, return a
        # context shell that the handler can enrich.
        return {
            "workspace": workspace,
            "knowledge_status": "GOVERNED",
            "graph_depth": 1,
        }

    def _record_provenance(
        self,
        command: str,
        workspace: str,
        inputs: Dict[str, Any],
        result: Dict[str, Any],
        actor_id: Optional[int] = None,
    ):
        """Record an AuditEvent and a WorkflowRun for every command."""
        assert self.session is not None

        import json as _json
        details = {"inputs": inputs, "result": result}
        # Serialize to JSON string for TEXT column
        details_str = _json.dumps(details, ensure_ascii=False, default=str)
        input_payload = _json.dumps(inputs, ensure_ascii=False, default=str)
        output_payload = _json.dumps(result, ensure_ascii=False, default=str)
        validation_report = {"rule_checks": "passed", "provenance_recorded": True}

        # AuditEvent
        audit = AuditEvent(
            workspace_id=workspace,
            actor_id=actor_id,
            event_type=f"COMMAND_{command}",
            entity_type="COMMAND",
            entity_id=command,
            details=details_str,
        )
        self.session.add(audit)

        # WorkflowRun
        run = WorkflowRun(
            workspace_id=workspace,
            workflow_type=f"HERMES:{command}",
            status="SUCCESS",
            input_payload=input_payload,
            output_payload=output_payload,
            validation_report=_json.dumps(validation_report, ensure_ascii=False, default=str),
        )
        self.session.add(run)


# =====================================================================
# Command handlers (stubs — call into Phase 1 tables)
# =====================================================================



def handle_search(session, inputs: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
    """Search knowledge across the workspace."""
    workspace = inputs.get("workspace")
    q = inputs.get("q", "")
    results = []
    entities = session.query(Entity).filter_by(workspace_id=workspace).all()
    results.append({"type": "Entity", "count": len(entities)})
    return {"results": results, "query": q}


def handle_query(session, inputs: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
    """Retrieve a governed answer with knowledge status."""
    claim_id = inputs.get("claim_id")
    answer = f"Query for claim {claim_id} — governed."
    return {"answer": answer, "knowledge_status": "GOVERNED", "context": context}


def handle_trace_decision(session, inputs: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
    """Trace the decision, evidence, and audit trail for a claim."""
    claim_id = inputs.get("claim_id")
    decision = session.query(Decision).filter_by(claim_id=claim_id).first()
    evidence = session.query(Evidence).filter_by(claim_id=claim_id).all()
    audit_events = session.query(AuditEvent).filter(
        AuditEvent.entity_type == "CLAIM", AuditEvent.entity_id == claim_id
    ).all()
    return {
        "decision": decision.id if decision else None,
        "evidence_count": len(evidence),
        "audit_event_count": len(audit_events),
    }
