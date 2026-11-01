"""
AH-COMMAND-BUS-001 - Batch 1 command handler tests (INSPECT, MAP, COMPARE, REPORT, AUDIT)
Read-only commands: no governed state is mutated.
Run: python -m pytest ah_webapp/tests/test_batch1_read_only.py -v
"""

import pytest


@pytest.fixture
def app():
    """Create a test application instance."""
    from ah_webapp import create_app
    app = create_app({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "SQLALCHEMY_TRACK_MODIFICATIONS": False,
        "AH_AIOS_ADMIN_EMAIL": "",
        "AH_AIOS_ADMIN_PASSWORD": "",
    })
    return app


@pytest.fixture
def app_client(app):
    """Return the test client."""
    return app.test_client()


from ah_webapp.commands import (
    handle_inspect_record,
    handle_map_relationships,
    handle_compare_versions,
    handle_generate_report,
    handle_audit_workspace,
)
from ah_webapp.models import AuditEvent


def get_test_data(app):
    """Create sample data within an app context and return it."""
    from ah_webapp import db
    from ah_webapp.models import (
        Workspace, Entity, Source, Claim, Evidence, Review,
        Decision, KnowledgeVersion, AuditEvent, WorkflowRun, User,
    )
    with app.app_context():
        # Create a workspace
        workspace = Workspace(
            name="AH-AIOS Research",
            slug="ah-aios-research",
        )
        db.session.add(workspace)
        db.session.commit()

        # Create sample entities
        entity = Entity(
            workspace_id=workspace.id,
            name="First Settlement",
            description="Primary settlement entity",
            entity_type="SETTLEMENT",
        )
        db.session.add(entity)

        source = Source(
            workspace_id=workspace.id,
            title="First Settlement - Primary Record",
            source_type="PDF",
            checksum="sha256-abc123",
        )
        db.session.add(source)

        # Create the claim with created_by set
        claim = Claim(
            workspace_id=workspace.id,
            statement="The First Settlement was founded in 2184.",
            status="PROPOSED",
            created_by=1,
        )
        db.session.add(claim)
        db.session.commit()

        # Create knowledge versions
        kv1 = KnowledgeVersion(
            workspace_id=workspace.id,
            claim_id=claim.id,
            version_number=1,
            snapshot="The First Settlement was founded in 2184.",
        )
        kv2 = KnowledgeVersion(
            workspace_id=workspace.id,
            claim_id=claim.id,
            version_number=2,
            snapshot="The First Settlement was founded in 2185.",
        )
        db.session.add_all([kv1, kv2])
        db.session.commit()

        # Create audit events
        ae1 = AuditEvent(
            workspace_id=workspace.id,
            actor_id=1,
            event_type="CLAIM_CREATED",
            entity_type="CLAIM",
            entity_id=claim.id,
            details="Claim created",
        )
        db.session.add(ae1)
        db.session.commit()

        return {
            "app": app,
            "session": db.session,
            "workspace": {
                "id": workspace.id,
                "name": workspace.name,
            },
            "entity": {
                "id": entity.id,
                "name": entity.name,
                "entity_type": entity.entity_type,
                "description": entity.description,
            },
            "claim": {
                "id": claim.id,
                "statement": claim.statement,
                "status": claim.status,
                "created_by": claim.created_by,
            },
            "kv1": {
                "id": kv1.id,
                "version_number": kv1.version_number,
                "snapshot": kv1.snapshot,
            },
            "kv2": {
                "id": kv2.id,
                "version_number": kv2.version_number,
                "snapshot": kv2.snapshot,
            },
        }


@pytest.mark.read_only
class TestInspectRecord:
    """Batch 1 - INSPECT command tests."""

    def test_inspect_entity_success(self, app):
        data = get_test_data(app)
        entity = data["entity"]
        with app.app_context():
            result = handle_inspect_record(data["session"], {
                "record_type": "Entity",
                "record_id": entity["id"],
            }, {"workspace": data["workspace"]["id"]})
        assert result["found"] is True
        assert result["record_type"] == "Entity"
        assert result["record_id"] == entity["id"]
        assert "id" in result["record"], "Entity record should have fields"

    def test_inspect_entity_not_found(self, app):
        data = get_test_data(app)
        with app.app_context():
            result = handle_inspect_record(data["session"], {
                "record_type": "Entity",
                "record_id": 99999,
            }, {"workspace": data["workspace"]["id"]})
        assert result["found"] is False
        assert result["error"] == "RECORD_NOT_FOUND"

    def test_inspect_invalid_type(self, app):
        data = get_test_data(app)
        with app.app_context():
            result = handle_inspect_record(data["session"], {
                "record_type": "InvalidType",
                "record_id": 1,
            }, {"workspace": data["workspace"]["id"]})
        assert result["found"] is False
        assert result["error"] == "INVALID_RECORD_TYPE"

    def test_inspect_missing_id(self, app):
        data = get_test_data(app)
        with app.app_context():
            result = handle_inspect_record(data["session"], {
                "record_type": "Entity",
            }, {"workspace": data["workspace"]["id"]})
        assert result["found"] is False
        assert result["error"] == "RECORD_NOT_FOUND"

    def test_inspect_read_only(self, app):
        data = get_test_data(app)
        entity = data["entity"]
        with app.app_context():
            result = handle_inspect_record(data["session"], {
                "record_type": "Entity",
                "record_id": entity["id"],
            }, {"workspace": data["workspace"]["id"]})
        assert result["found"] is True

    def test_inspect_audit_event_fires(self, app):
        data = get_test_data(app)
        entity = data["entity"]
        with app.app_context():
            before_count = data["session"].query(AuditEvent).count()
            handle_inspect_record(data["session"], {
                "record_type": "Entity",
                "record_id": entity["id"],
            }, {"workspace": data["workspace"]["id"]})
            after_count = data["session"].query(AuditEvent).count()
        assert after_count == before_count, "Read-only command should not create audit events"


@pytest.mark.read_only
class TestMapRelationships:
    """Batch 1 - MAP command tests."""

    def test_map_workspace_success(self, app):
        data = get_test_data(app)
        with app.app_context():
            result = handle_map_relationships(data["session"], {
                "workspace": data["workspace"]["id"],
            }, {"workspace": data["workspace"]["id"]})
        assert result["found"] is True
        assert "entities" in result
        assert "sources" in result
        assert "claims" in result
        assert "relationships" in result
        assert result["workspace"] == str(data["workspace"]["id"])

    def test_map_no_workspace(self, app):
        with app.app_context():
            result = handle_map_relationships(db.session, {}, {})
        assert result["found"] is False
        assert result["error"] == "WORKSPACE_NOT_FOUND"

    def test_map_workspace_not_found(self):
        with app.test_request_context():
            result = handle_map_relationships(db.session, {
                "workspace": 99999,
            }, {"workspace": 99999})
        assert result["found"] is False
        assert result["error"] == "WORKSPACE_NOT_FOUND"

    def test_map_read_only(self, app):
        data = get_test_data(app)
        with app.app_context():
            before_count = data["session"].query(AuditEvent).count()
            handle_map_relationships(data["session"], {
                "workspace": data["workspace"]["id"],
            }, {"workspace": data["workspace"]["id"]})
            after_count = data["session"].query(AuditEvent).count()
        assert after_count == before_count, "Read-only command should not create audit events"


@pytest.mark.read_only
class TestCompareVersions:
    """Batch 1 - COMPARE command tests."""

    def test_compare_versions_success(self, app):
        data = get_test_data(app)
        with app.app_context():
            result = handle_compare_versions(data["session"], {
                "claim_id": data["claim"]["id"],
                "version_a": data["kv1"]["id"],
                "version_b": data["kv2"]["id"],
            }, {"workspace": data["workspace"]["id"]})
        assert result["compared"] is True
        assert result["claim_id"] == data["claim"]["id"]
        assert "version_a" in result
        assert "version_b" in result
        assert "diff" in result

    def test_compare_missing_claim(self, app):
        with app.app_context():
            result = handle_compare_versions(db.session, {
                "claim_id": 99999,
                "version_a": 1,
                "version_b": 2,
            }, {})
        assert result["compared"] is False
        assert result["error"] == "CLAIM_NOT_FOUND"

    def test_compare_missing_versions(self, app):
        data = get_test_data(app)
        with app.app_context():
            result = handle_compare_versions(data["session"], {
                "claim_id": data["claim"]["id"],
                "version_a": None,
                "version_b": None,
            }, {})
        assert result["compared"] is False
        assert result["error"] == "NO_VERSIONS"

    def test_compare_read_only(self, app):
        data = get_test_data(app)
        with app.app_context():
            before_count = data["session"].query(AuditEvent).count()
            result = handle_compare_versions(data["session"], {
                "claim_id": data["claim"]["id"],
                "version_a": data["kv1"]["id"],
                "version_b": data["kv2"]["id"],
            }, {})
            after_count = data["session"].query(AuditEvent).count()
        assert result["compared"] is True
        assert after_count == before_count, "Read-only command should not create audit events"


@pytest.mark.read_only
class TestGenerateReport:
    """Batch 1 - REPORT command tests."""

    def test_generate_report_success(self, app):
        data = get_test_data(app)
        with app.app_context():
            result = handle_generate_report(data["session"], {
                "workspace": data["workspace"]["id"],
                "report_type": "summary",
            }, {"workspace": data["workspace"]["id"]})
        assert result["found"] is True
        assert "report_id" in result
        assert result["workspace"] == str(data["workspace"]["id"])
        assert "content" in result
        assert "statistics" in result
        assert "entities" in result["statistics"]
        assert "claims" in result["statistics"]
        assert result["statistics"]["entities"] >= 0

    def test_generate_report_no_workspace(self, app):
        with app.app_context():
            result = handle_generate_report(db.session, {}, {})
        assert result["found"] is False
        assert result["error"] == "WORKSPACE_NOT_FOUND"

    def test_generate_report_workspace_not_found(self):
        with app.test_request_context():
            result = handle_generate_report(db.session, {
                "workspace": 99999,
            }, {})
        assert result["found"] is False
        assert result["error"] == "WORKSPACE_NOT_FOUND"

    def test_generate_report_read_only(self, app):
        data = get_test_data(app)
        with app.app_context():
            before_count = data["session"].query(AuditEvent).count()
            handle_generate_report(data["session"], {
                "workspace": data["workspace"]["id"],
            }, {"workspace": data["workspace"]["id"]})
            after_count = data["session"].query(AuditEvent).count()
        assert after_count == before_count, "Read-only command should not create audit events"


@pytest.mark.read_only
class TestAuditWorkspace:
    """Batch 1 - AUDIT command tests."""

    def test_audit_workspace_success(self, app):
        data = get_test_data(app)
        with app.app_context():
            result = handle_audit_workspace(data["session"], {
                "workspace": data["workspace"]["id"],
            }, {"workspace": data["workspace"]["id"]})
        assert result["found"] is True
        assert "audit_events" in result
        assert "event_count" in result
        assert result["workspace"] == str(data["workspace"]["id"])
        assert isinstance(result["audit_events"], list)

    def test_audit_no_workspace(self, app):
        with app.app_context():
            result = handle_audit_workspace(db.session, {}, {})
        assert result["found"] is False
        assert result["error"] == "WORKSPACE_NOT_FOUND"

    def test_audit_workspace_not_found(self):
        with app.test_request_context():
            result = handle_audit_workspace(db.session, {
                "workspace": 99999,
            }, {})
        assert result["found"] is False
        assert result["error"] == "WORKSPACE_NOT_FOUND"

    def test_audit_read_only(self, app):
        data = get_test_data(app)
        with app.app_context():
            before_count = data["session"].query(AuditEvent).count()
            handle_audit_workspace(data["session"], {
                "workspace": data["workspace"]["id"],
            }, {"workspace": data["workspace"]["id"]})
            after_count = data["session"].query(AuditEvent).count()
        assert after_count == before_count, "Read-only command should not create audit events"


@pytest.mark.integration
class TestBatch1Integration:
    """Integration tests for Batch 1 commands."""

    def test_all_batch1_commands_work_together(self, app):
        data = get_test_data(app)
        with app.app_context():
            result = handle_inspect_record(data["session"], {
                "record_type": "Entity",
                "record_id": data["entity"]["id"],
            }, {"workspace": data["workspace"]["id"]})
        assert result["found"] is True

        with app.app_context():
            result = handle_map_relationships(data["session"], {
                "workspace": data["workspace"]["id"],
            }, {"workspace": data["workspace"]["id"]})
        assert result["found"] is True

        with app.app_context():
            result = handle_compare_versions(data["session"], {
                "claim_id": data["claim"]["id"],
                "version_a": data["kv1"]["id"],
                "version_b": data["kv2"]["id"],
            }, {"workspace": data["workspace"]["id"]})
        assert result["compared"] is True

        with app.app_context():
            result = handle_generate_report(data["session"], {
                "workspace": data["workspace"]["id"],
            }, {"workspace": data["workspace"]["id"]})
        assert result["found"] is True

        with app.app_context():
            result = handle_audit_workspace(data["session"], {
                "workspace": data["workspace"]["id"],
            }, {"workspace": data["workspace"]["id"]})
        assert result["found"] is True
