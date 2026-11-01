# Batch 1 - Command Handlers (INSPECT, MAP, COMPARE, REPORT, AUDIT)

from ah_webapp.models import (
    Workspace, Entity, Source, Claim, Evidence, Review,
    Decision, KnowledgeVersion, AuditEvent, db,
)

def handle_inspect_record(session, inputs: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
    """INSPECT: Retrieve a single record by type and ID. Read-only."""
    record_type = inputs.get("record_type")
    record_id = inputs.get("record_id")

    if not record_type or not record_id:
        return {"found": False, "error": "RECORD_NOT_FOUND"}

    # Map record types to models
    record_models = {
        "Workspace": Workspace,
        "Entity": Entity,
        "Source": Source,
        "Claim": Claim,
        "Evidence": Evidence,
        "Review": Review,
        "Decision": Decision,
        "KnowledgeVersion": KnowledgeVersion,
        "AuditEvent": AuditEvent,
    }

    model = record_models.get(record_type)
    if model is None:
        return {"found": False, "error": "INVALID_RECORD_TYPE"}

    record = session.query(model).filter_by(id=record_id).first()
    if record is None:
        return {"found": False, "error": "RECORD_NOT_FOUND"}

    # Build fields dict from the record's attributes
    fields = {}
    for col in record.__table__.columns:
        fields[col.name] = getattr(record, col.name)

    return {
        "found": True,
        "record_type": record_type,
        "record_id": record_id,
        "record": fields,
    }


def handle_map_relationships(session, inputs: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
    """MAP: Map relationships between entities, claims, sources, versions, and decisions in a workspace. Read-only."""
    workspace = inputs.get("workspace")
    if not workspace:
        return {"found": False, "error": "WORKSPACE_NOT_FOUND"}

    workspace_obj = session.query(Workspace).filter_by(id=workspace).first()
    if workspace_obj is None:
        return {"found": False, "error": "WORKSPACE_NOT_FOUND"}

    entities = session.query(Entity).filter_by(workspace_id=workspace).all()
    sources = session.query(Source).filter_by(workspace_id=workspace).all()
    claims = session.query(Claim).filter_by(workspace_id=workspace).all()
    versions = session.query(KnowledgeVersion).filter_by(workspace_id=workspace).all()
    # Get decisions for claims in this workspace (Decision doesn't have workspace_id directly)
    decisions = session.query(Decision).join(Claim).filter(Claim.workspace_id == workspace).all()
    audit_events = session.query(AuditEvent).filter_by(workspace_id=workspace).all()

    relationships = []
    for claim in claims:
        for version in versions:
            if version.claim_id == claim.id:
                relationships.append({
                    "type": "CLAIM_VERSION",
                    "subject": {"type": "CLAIM", "id": claim.id},
                    "object": {"type": "KNOWLEDGE_VERSION", "id": version.id},
                })
        for decision in decisions:
            if decision.claim_id == claim.id:
                relationships.append({
                    "type": "CLAIM_DECISION",
                    "subject": {"type": "CLAIM", "id": claim.id},
                    "object": {"type": "DECISION", "id": decision.id},
                })

    return {
        "found": True,
        "workspace": str(workspace),
        "entities": [{"id": e.id, "name": e.name, "entity_type": e.entity_type} for e in entities],
        "sources": [{"id": s.id, "title": s.title, "source_type": s.source_type} for s in sources],
        "claims": [{"id": c.id, "statement": c.statement, "status": c.status} for c in claims],
        "versions": [{"id": v.id, "claim_id": v.claim_id, "version_number": v.version_number} for v in versions],
        "decisions": [{"id": d.id, "claim_id": d.claim_id, "status": d.status} for d in decisions],
        "audit_events": [{"id": a.id, "event_type": a.event_type} for a in audit_events],
        "relationships": relationships,
    }


def handle_compare_versions(session, inputs: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
    """COMPARE: Compare two KnowledgeVersion records for a claim. Read-only."""
    claim_id = inputs.get("claim_id")
    version_a = inputs.get("version_a")
    version_b = inputs.get("version_b")

    if not claim_id or not version_a or not version_b:
        return {"compared": False, "error": "NO_VERSIONS"}

    claim = session.query(Claim).filter_by(id=claim_id).first()
    if claim is None:
        return {"compared": False, "error": "CLAIM_NOT_FOUND"}

    version_a_obj = session.query(KnowledgeVersion).filter_by(id=version_a).first()
    version_b_obj = session.query(KnowledgeVersion).filter_by(id=version_b).first()

    if version_a_obj is None or version_b_obj is None:
        return {"compared": False, "error": "VERSION_NOT_FOUND"}

    return {
        "compared": True,
        "claim_id": claim_id,
        "version_a": {
            "id": version_a_obj.id,
            "version_number": version_a_obj.version_number,
            "snapshot": version_a_obj.snapshot,
        },
        "version_b": {
            "id": version_b_obj.id,
            "version_number": version_b_obj.version_number,
            "snapshot": version_b_obj.snapshot,
        },
        "diff": {
            "added": [],
            "removed": [],
            "modified": [],
        },
    }


def handle_generate_report(session, inputs: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
    """REPORT: Generate a summary report for a workspace. Read-only."""
    workspace = inputs.get("workspace")
    if not workspace:
        return {"found": False, "error": "WORKSPACE_NOT_FOUND"}

    workspace_obj = session.query(Workspace).filter_by(id=workspace).first()
    if workspace_obj is None:
        return {"found": False, "error": "WORKSPACE_NOT_FOUND"}

    entities = session.query(Entity).filter_by(workspace_id=workspace).all()
    sources = session.query(Source).filter_by(workspace_id=workspace).all()
    claims = session.query(Claim).filter_by(workspace_id=workspace).all()
    versions = session.query(KnowledgeVersion).filter_by(workspace_id=workspace).all()
    # Get decisions for claims in this workspace (Decision doesn't have workspace_id directly)
    decisions = session.query(Decision).join(Claim).filter(Claim.workspace_id == workspace).all()
    audit_events = session.query(AuditEvent).filter_by(workspace_id=workspace).all()

    report_id = str(uuid4())

    content = f"<h2>Workspace Report: {workspace_obj.name}</h2>"
    content += f"<p><strong>Entities:</strong> {len(entities)}</p>"
    content += f"<p><strong>Sources:</strong> {len(sources)}</p>"
    content += f"<p><strong>Claims:</strong> {len(claims)}</p>"
    content += f"<p><strong>Versions:</strong> {len(versions)}</p>"
    content += f"<p><strong>Decisions:</strong> {len(decisions)}</p>"
    content += f"<p><strong>Audit Events:</strong> {len(audit_events)}</p>"

    statistics = {
        "entities": len(entities),
        "sources": len(sources),
        "claims": len(claims),
        "versions": len(versions),
        "decisions": len(decisions),
        "audit_events": len(audit_events),
    }

    return {
        "found": True,
        "report_id": report_id,
        "workspace": str(workspace),
        "content": content,
        "statistics": statistics,
    }


def handle_audit_workspace(session, inputs: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
    """AUDIT: Return the full audit event chain for a workspace. Read-only."""
    workspace = inputs.get("workspace")
    if not workspace:
        return {"found": False, "error": "WORKSPACE_NOT_FOUND"}

    workspace_obj = session.query(Workspace).filter_by(id=workspace).first()
    if workspace_obj is None:
        return {"found": False, "error": "WORKSPACE_NOT_FOUND"}

    audit_events = session.query(AuditEvent).filter_by(workspace_id=workspace).order_by(AuditEvent.created_at).all()

    return {
        "found": True,
        "workspace": str(workspace),
        "audit_events": [
            {
                "id": a.id,
                "event_type": a.event_type,
                "entity_type": a.entity_type,
                "entity_id": a.entity_id,
                "created_at": a.created_at.isoformat() if a.created_at else None,
            }
            for a in audit_events
        ],
        "event_count": len(audit_events),
    }
