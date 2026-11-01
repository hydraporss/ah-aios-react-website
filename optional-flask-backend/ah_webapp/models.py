#!/usr/bin/env python3
"""
AH-WebAPP-001 — Database Models
Defines all data models for the AFTER HUMANITY worldbuilding web application.
"""

from datetime import datetime
from flask_login import UserMixin
from sqlalchemy import String, cast
from sqlalchemy.orm import foreign
from itsdangerous import URLSafeTimedSerializer

import uuid
from . import db

# Ensure itsdangerer is installed or use a simpler approach
try:
    from itsdangerous import URLSafeTimedSerializer
    _has_itsdangerer = True
except ImportError:
    _has_itsdangerer = False


class User(db.Model, UserMixin):
    """User model for authentication and RBAC."""

    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), nullable=False, default='member')
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())
    updated_at = db.Column(db.DateTime, default=lambda: datetime.utcnow(), onupdate=lambda: datetime.utcnow())

    # Relationships
    # AuditLog.actor predates a user foreign key and stores either a user ID
    # string or a system actor. Keep the convenience lookup read-only and
    # match numeric user IDs without changing the existing audit table schema.
    audit_logs = db.relationship(
        'AuditLog',
        primaryjoin=lambda: cast(User.id, String) == foreign(AuditLog.actor),
        viewonly=True,
    )

    def set_password(self, password):
        from werkzeug.security import generate_password_hash
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        from werkzeug.security import check_password_hash
        return check_password_hash(self.password_hash, password)

    def can(self, permission):
        """Check if user has a specific permission."""
        permissions = {
            'admin': ['read', 'write', 'delete', 'admin', 'approve'],
            'moderator': ['read', 'write', 'approve'],
            'member': ['read']
        }
        return permission in permissions.get(self.role, ['read'])


class World(db.Model):
    """World entity for the World Atlas."""

    __tablename__ = 'worlds'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    realm = db.Column(db.String(100), nullable=True)
    description = db.Column(db.Text, nullable=True)
    classification = db.Column(db.String(50), default='SUGGESTION')
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())
    updated_at = db.Column(db.DateTime, default=lambda: datetime.utcnow(), onupdate=lambda: datetime.utcnow())
    version = db.Column(db.Integer, default=1)
    parent_id = db.Column(db.Integer, db.ForeignKey('worlds.id'), nullable=True)

    # Relationships
    locations = db.relationship('WorldLocation', backref='world', lazy='dynamic')
    civilizations = db.relationship('Civilization', backref='world', lazy='dynamic')
    events = db.relationship('Event', backref='world', lazy='dynamic')
    parent = db.relationship('World', remote_side=[id], backref='children')

    def __repr__(self):
        return f'<World {self.name}>'


class WOFWorldStateRecord(db.Model):
    """Persisted WOF state linked to one web-app world record."""

    __tablename__ = 'wof_world_states'

    id = db.Column(db.Integer, primary_key=True)
    world_id = db.Column(db.Integer, db.ForeignKey('worlds.id'), nullable=False, unique=True)
    seed = db.Column(db.String(255), nullable=False)
    state_json = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())
    updated_at = db.Column(db.DateTime, default=lambda: datetime.utcnow(), onupdate=lambda: datetime.utcnow())

    world = db.relationship('World', backref=db.backref('wof_state', uselist=False))

    def __repr__(self):
        return f'<WOFWorldStateRecord world={self.world_id}>'


class WorldLocation(db.Model):
    """Location within a world."""

    __tablename__ = 'world_locations'

    id = db.Column(db.Integer, primary_key=True)
    world_id = db.Column(db.Integer, db.ForeignKey('worlds.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    region = db.Column(db.String(100), nullable=True)
    climate = db.Column(db.String(100), nullable=True)
    classification = db.Column(db.String(50), default='SUGGESTION')
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())
    updated_at = db.Column(db.DateTime, default=lambda: datetime.utcnow(), onupdate=lambda: datetime.utcnow())

    def __repr__(self):
        return f'<WorldLocation {self.name}>'


class Race(db.Model):
    """Race entity for Identity Archive."""

    __tablename__ = 'races'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    type = db.Column(db.String(100), nullable=True)
    description = db.Column(db.Text, nullable=True)
    traits = db.Column(db.Text, nullable=True)  # JSON or text
    physical_attributes = db.Column(db.Text, nullable=True)
    cultural_attributes = db.Column(db.Text, nullable=True)
    classification = db.Column(db.String(50), default='SUGGESTION')
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())
    updated_at = db.Column(db.DateTime, default=lambda: datetime.utcnow(), onupdate=lambda: datetime.utcnow())
    version = db.Column(db.Integer, default=1)

    def __repr__(self):
        return f'<Race {self.name}>'


class Character(db.Model):
    """Character entity for Identity Archive."""

    __tablename__ = 'characters'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    race_id = db.Column(db.Integer, db.ForeignKey('races.id'), nullable=True)
    description = db.Column(db.Text, nullable=True)
    role = db.Column(db.String(100), nullable=True)
    attributes = db.Column(db.Text, nullable=True)
    classification = db.Column(db.String(50), default='SUGGESTION')
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())
    updated_at = db.Column(db.DateTime, default=lambda: datetime.utcnow(), onupdate=lambda: datetime.utcnow())
    version = db.Column(db.Integer, default=1)

    def __repr__(self):
        return f'<Character {self.name}>'


class Technology(db.Model):
    """Technology entity for Identity Archive."""

    __tablename__ = 'technologies'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    type = db.Column(db.String(100), nullable=True)
    description = db.Column(db.Text, nullable=True)
    applications = db.Column(db.Text, nullable=True)
    classification = db.Column(db.String(50), default='SUGGESTION')
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())
    updated_at = db.Column(db.DateTime, default=lambda: datetime.utcnow(), onupdate=lambda: datetime.utcnow())
    version = db.Column(db.Integer, default=1)

    def __repr__(self):
        return f'<Technology {self.name}>'


class Event(db.Model):
    """Historical Event entity."""

    __tablename__ = 'historical_events'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    world_id = db.Column(db.Integer, db.ForeignKey('worlds.id'), nullable=True)
    date = db.Column(db.DateTime, nullable=True)
    description = db.Column(db.Text, nullable=True)
    impact = db.Column(db.String(255), nullable=True)
    classification = db.Column(db.String(50), default='SUGGESTION')
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())
    updated_at = db.Column(db.DateTime, default=lambda: datetime.utcnow(), onupdate=lambda: datetime.utcnow())
    version = db.Column(db.Integer, default=1)

    def __repr__(self):
        return f'<Event {self.name}>'


class Civilization(db.Model):
    """Civilization entity."""

    __tablename__ = 'civilizations'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    world_id = db.Column(db.Integer, db.ForeignKey('worlds.id'), nullable=True)
    description = db.Column(db.Text, nullable=True)
    era = db.Column(db.String(100), nullable=True)
    classification = db.Column(db.String(50), default='SUGGESTION')
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())
    updated_at = db.Column(db.DateTime, default=lambda: datetime.utcnow(), onupdate=lambda: datetime.utcnow())
    version = db.Column(db.Integer, default=1)

    def __repr__(self):
        return f'<Civilization {self.name}>'


class Artifact(db.Model):
    """Visual Artifact (Generated Image) record."""

    __tablename__ = 'artifacts'

    id = db.Column(db.Integer, primary_key=True)
    artifact_id = db.Column(db.String(255), unique=True, nullable=False)
    generation_id = db.Column(db.String(255), nullable=True)
    provider = db.Column(db.String(50), nullable=True)
    model = db.Column(db.String(50), nullable=True)
    prompt = db.Column(db.Text, nullable=True)
    content = db.Column(db.Text, nullable=True)  # Reference or data
    assessment_status = db.Column(db.String(50), default='PENDING')
    classification = db.Column(db.String(50), default='SUGGESTION')
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())
    updated_at = db.Column(db.DateTime, default=lambda: datetime.utcnow(), onupdate=lambda: datetime.utcnow())
    version = db.Column(db.Integer, default=1)

    # Relationships
    generations = db.relationship('GenerationRecord', backref='artifact', lazy='dynamic')

    def __repr__(self):
        return f'<Artifact {self.artifact_id}>'


class GenerationRecord(db.Model):
    """Generation record for tracking image generation."""

    __tablename__ = 'generation_records'

    id = db.Column(db.Integer, primary_key=True)
    generation_id = db.Column(db.String(255), unique=True, nullable=False)
    artifact_id = db.Column(db.Integer, db.ForeignKey('artifacts.id'), nullable=False)
    provider = db.Column(db.String(50), nullable=True)
    model = db.Column(db.String(50), nullable=True)
    request_hash = db.Column(db.String(255), nullable=True)
    response_hash = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())

    def __repr__(self):
        return f'<GenerationRecord {self.generation_id}>'


class AuditLog(db.Model):
    """Audit log for tracking all significant events."""

    __tablename__ = 'audit_logs'

    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.String(255), unique=True, nullable=False)
    correlation_id = db.Column(db.String(255), nullable=True)
    actor = db.Column(db.String(255), nullable=True)  # User ID or system name
    action = db.Column(db.String(255), nullable=False)
    object_type = db.Column(db.String(100), nullable=True)
    object_id = db.Column(db.String(255), nullable=True)
    previous_state = db.Column(db.Text, nullable=True)
    new_state = db.Column(db.Text, nullable=True)
    outcome = db.Column(db.String(50), nullable=True)
    timestamp = db.Column(db.DateTime, default=lambda: datetime.utcnow())
    metadata_json = db.Column('metadata', db.Text, nullable=True)  # JSON

    def __repr__(self):
        return f'<AuditLog {self.event_id}>'


class ChangeProposal(db.Model):
    """Change proposal for controlled change workflow."""

    __tablename__ = 'change_proposals'

    id = db.Column(db.Integer, primary_key=True)
    proposal_id = db.Column(db.String(50), unique=True, nullable=False)
    artifact_type = db.Column(db.String(50), nullable=False)
    artifact_id = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text, nullable=False)
    classification = db.Column(db.String(50), default='SUGGESTION')
    current_version = db.Column(db.Integer, default=1)
    proposed_version = db.Column(db.Integer, default=2)
    rationale = db.Column(db.Text, nullable=True)
    evidence = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(50), default='DRAFT')
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    reviewer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    approver_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())
    updated_at = db.Column(db.DateTime, default=lambda: datetime.utcnow(), onupdate=lambda: datetime.utcnow())
    approved_at = db.Column(db.DateTime, nullable=True)
    version_commit = db.Column(db.Integer, default=0)

    # Relationships
    decisions = db.relationship('ApprovalDecision', backref='change_proposal', lazy='dynamic')

    def __repr__(self):
        return f'<ChangeProposal {self.proposal_id}>'


class WOFGenerationRecord(db.Model):
    """Persisted WOF generation intent, output, and optional review proposal."""

    __tablename__ = 'wof_generation_records'

    id = db.Column(db.Integer, primary_key=True)
    generation_id = db.Column(db.String(50), unique=True, nullable=False)
    world_id = db.Column(db.Integer, db.ForeignKey('worlds.id'), nullable=False)
    proposal_record_id = db.Column(db.Integer, db.ForeignKey('change_proposals.id'), nullable=True, unique=True)
    intent_json = db.Column(db.Text, nullable=False)
    result_json = db.Column(db.Text, nullable=False)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())

    world = db.relationship('World', backref=db.backref('wof_generations', lazy='dynamic'))
    proposal = db.relationship('ChangeProposal', backref=db.backref('wof_generation', uselist=False))

    def __repr__(self):
        return f'<WOFGenerationRecord {self.generation_id}>'


class ApprovalDecision(db.Model):
    """Approval decision for a change proposal."""

    __tablename__ = 'approval_decisions'

    id = db.Column(db.Integer, primary_key=True)
    proposal_id = db.Column(db.Integer, db.ForeignKey('change_proposals.id'), nullable=False)
    decision = db.Column(db.String(20), nullable=False)  # APPROVED, REJECTED, RETURN_FOR_REVISION
    reviewer = db.Column(db.String(255), nullable=True)
    comments = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())

    def __repr__(self):
        return f'<ApprovalDecision {self.proposal_id} {self.decision}>'


class SourceRecord(db.Model):
    """Source and evidence registry record."""

    __tablename__ = 'source_records'

    id = db.Column(db.Integer, primary_key=True)
    source_id = db.Column(db.String(50), unique=True, nullable=False)
    title = db.Column(db.String(255), nullable=False)
    origin = db.Column(db.String(255), nullable=True)
    author = db.Column(db.String(255), nullable=True)
    version = db.Column(db.String(50), nullable=True)
    classification = db.Column(db.String(50), default='SUGGESTION')
    provenance = db.Column(db.Text, nullable=True)  # JSON
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())
    updated_at = db.Column(db.DateTime, default=lambda: datetime.utcnow(), onupdate=lambda: datetime.utcnow())

    def __repr__(self):
        return f'<SourceRecord {self.source_id}>'


class EvidenceRecord(db.Model):
    """Evidence record for verification."""

    __tablename__ = 'evidence_records'

    id = db.Column(db.Integer, primary_key=True)
    evidence_id = db.Column(db.String(50), unique=True, nullable=False)
    source_id = db.Column(db.String(50), db.ForeignKey('source_records.source_id'), nullable=True)
    artifact_id = db.Column(db.String(50), nullable=True)
    classification = db.Column(db.String(50), default='ESTABLISHED')
    evidence_class = db.Column(db.String(50), default='ACQUISITION')
    justification = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())
    verified_at = db.Column(db.DateTime, nullable=True)
    verified_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)

    def __repr__(self):
        return f'<EvidenceRecord {self.evidence_id}>'


class ReviewRecord(db.Model):
    """Review record for canon governance."""

    __tablename__ = 'review_records'

    id = db.Column(db.Integer, primary_key=True)
    review_id = db.Column(db.String(50), unique=True, nullable=False)
    artifact_type = db.Column(db.String(50), nullable=False)
    artifact_id = db.Column(db.String(255), nullable=True)
    reviewer = db.Column(db.String(255), nullable=True)
    decision = db.Column(db.String(20), nullable=True)  # APPROVED, REJECTED, RETURNED
    comments = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())

    def __repr__(self):
        return f'<ReviewRecord {self.review_id}>'


# =====================================================================
# Phase 1 — Knowledge Lifecycle (vertical slice)
#
# Adapted from the "Phase 1 Django Models" design into the project's
# native Flask/SQLAlchemy stack.
#
# Core guardrails (from the design):
#   - A claim is merely an assertion that exists. It is NOT a fact.
#   - Evidence is NOT approval. Review is NOT a decision.
#   - Only a decision changes governance state.
#   - Every state transition is auditable.
# =====================================================================
import uuid


class Workspace(db.Model):
    """Root boundary for everything governed."""

    __tablename__ = 'workspaces'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(255), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())
    updated_at = db.Column(db.DateTime, default=lambda: datetime.utcnow(), onupdate=lambda: datetime.utcnow())

    # Relationships
    entities = db.relationship('Entity', backref='workspace', lazy='dynamic')
    sources = db.relationship('Source', backref='workspace', lazy='dynamic')
    claims = db.relationship('Claim', backref='workspace', lazy='dynamic')
    relationships = db.relationship('Relationship', backref='workspace', lazy='dynamic')
    knowledge_versions = db.relationship('KnowledgeVersion', backref='workspace', lazy='dynamic')
    audit_events = db.relationship('AuditEvent', backref='workspace', lazy='dynamic')
    workflow_runs = db.relationship('WorkflowRun', backref='workspace', lazy='dynamic')

    def __repr__(self):
        return f'<Workspace {self.name}>'


class Entity(db.Model):
    """Anything that exists in governed knowledge."""

    __tablename__ = 'entities'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    workspace_id = db.Column(db.String(36), db.ForeignKey('workspaces.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    entity_type = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())

    def __repr__(self):
        return f'<Entity {self.name} ({self.entity_type})>'


class Source(db.Model):
    """A document or authoritative source."""

    __tablename__ = 'sources'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    workspace_id = db.Column(db.String(36), db.ForeignKey('workspaces.id'), nullable=False)
    title = db.Column(db.String(500), nullable=False)
    source_type = db.Column(db.String(50), nullable=False)
    file_path = db.Column(db.Text, nullable=True)
    checksum = db.Column(db.String(128), nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())

    def __repr__(self):
        return f'<Source {self.title}>'


class Claim(db.Model):
    """The foundation of governance. A claim is merely an assertion."""

    __tablename__ = 'claims'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    workspace_id = db.Column(db.String(36), db.ForeignKey('workspaces.id'), nullable=False)
    statement = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), nullable=False, default='PROPOSED')
    confidence = db.Column(db.Numeric(5, 2), nullable=True)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())

    # Relationships
    evidence = db.relationship('Evidence', backref='claim', lazy='dynamic', cascade='all, delete-orphan')
    reviews = db.relationship('Review', backref='claim', lazy='dynamic')
    decisions = db.relationship('Decision', backref='claim', lazy='dynamic')
    knowledge_versions = db.relationship('KnowledgeVersion', backref='claim', lazy='dynamic')

    def __repr__(self):
        return f'<Claim {self.statement[:40]}...>'


class Evidence(db.Model):
    """Evidence links claims to sources."""

    __tablename__ = 'evidence'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    claim_id = db.Column(db.String(36), db.ForeignKey('claims.id'), nullable=False)
    source_id = db.Column(db.String(36), db.ForeignKey('sources.id'), nullable=False)
    evidence_type = db.Column(db.String(50), nullable=False)
    excerpt = db.Column(db.Text, nullable=False)
    page_number = db.Column(db.Integer, nullable=True)
    section_reference = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())

    def __repr__(self):
        return f'<Evidence claim={self.claim_id} source={self.source_id}>'


class Relationship(db.Model):
    """Knowledge graph connections."""

    __tablename__ = 'relationships'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    workspace_id = db.Column(db.String(36), db.ForeignKey('workspaces.id'), nullable=False)
    source_entity_id = db.Column(db.String(36), db.ForeignKey('entities.id'), nullable=False)
    target_entity_id = db.Column(db.String(36), db.ForeignKey('entities.id'), nullable=False)
    relationship_type = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())

    def __repr__(self):
        return f'<Relationship {self.relationship_type} {self.source_entity_id} -> {self.target_entity_id}>'


class Review(db.Model):
    """Human review layer."""

    __tablename__ = 'reviews'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    claim_id = db.Column(db.String(36), db.ForeignKey('claims.id'), nullable=False)
    reviewer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    score = db.Column(db.Numeric(5, 2), nullable=True)
    comments = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())

    def __repr__(self):
        return f'<Review claim={self.claim_id} reviewer={self.reviewer_id}>'


class Decision(db.Model):
    """Authority layer. Only a decision changes governance state."""

    __tablename__ = 'decisions'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    claim_id = db.Column(db.String(36), db.ForeignKey('claims.id'), nullable=False)
    outcome = db.Column(db.String(50), nullable=False)
    rationale = db.Column(db.Text, nullable=False)
    decided_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())

    def __repr__(self):
        return f'<Decision claim={self.claim_id} outcome={self.outcome}>'


class KnowledgeVersion(db.Model):
    """Historical continuity."""

    __tablename__ = 'knowledge_versions'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    workspace_id = db.Column(db.String(36), db.ForeignKey('workspaces.id'), nullable=False)
    claim_id = db.Column(db.String(36), db.ForeignKey('claims.id'), nullable=False)
    version_number = db.Column(db.Integer, nullable=False)
    snapshot = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())

    def __repr__(self):
        return f'<KnowledgeVersion v{self.version_number} claim={self.claim_id}>'


class AuditEvent(db.Model):
    """Immutable trail."""

    __tablename__ = 'audit_events'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    workspace_id = db.Column(db.String(36), db.ForeignKey('workspaces.id'), nullable=False)
    actor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    event_type = db.Column(db.String(100), nullable=False)
    entity_type = db.Column(db.String(100), nullable=False)
    entity_id = db.Column(db.String(36), nullable=False)
    details = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())

    def __repr__(self):
        return f'<AuditEvent {self.event_type} {self.entity_type}:{self.entity_id}>'


class WorkflowRun(db.Model):
    """Hermes orchestration tracking."""

    __tablename__ = 'workflow_runs'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    workspace_id = db.Column(db.String(36), db.ForeignKey('workspaces.id'), nullable=False)
    workflow_type = db.Column(db.String(200), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    input_payload = db.Column(db.Text, nullable=False)
    output_payload = db.Column(db.Text, nullable=True)
    validation_report = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())

    def __repr__(self):
        return f'<WorkflowRun {self.workflow_type} status={self.status}>'
