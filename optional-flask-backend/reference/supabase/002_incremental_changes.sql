-- ============================================================
-- AH-AIOS Learning Studio - Incremental Migration
-- Version 1.1 - Add missing tables and columns
-- Preserves existing data from previous deployments
-- ============================================================

-- ==========================================
-- 1. CREATE NEW TABLES (not in remote db)
-- ==========================================

-- Users table (not in remote db)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'member',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Worlds table (not in remote db)
CREATE TABLE IF NOT EXISTS worlds (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    realm VARCHAR(100),
    description TEXT,
    classification VARCHAR(50) DEFAULT 'SUGGESTION',
    created_by INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    version INTEGER DEFAULT 1,
    parent_id INTEGER,
    FOREIGN KEY (parent_id) REFERENCES worlds(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- World Locations (not in remote db)
CREATE TABLE IF NOT EXISTS world_locations (
    id SERIAL PRIMARY KEY,
    world_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    region VARCHAR(100),
    climate VARCHAR(100),
    classification VARCHAR(50) DEFAULT 'SUGGESTION',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (world_id) REFERENCES worlds(id) ON DELETE CASCADE
);

-- Races (not in remote db)
CREATE TABLE IF NOT EXISTS races (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    type VARCHAR(100),
    description TEXT,
    traits TEXT,
    physical_attributes TEXT,
    cultural_attributes TEXT,
    classification VARCHAR(50) DEFAULT 'SUGGESTION',
    created_by INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    version INTEGER DEFAULT 1,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Characters (not in remote db)
CREATE TABLE IF NOT EXISTS characters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    race_id INTEGER,
    description TEXT,
    role VARCHAR(100),
    attributes TEXT,
    classification VARCHAR(50) DEFAULT 'SUGGESTION',
    created_by INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    version INTEGER DEFAULT 1,
    FOREIGN KEY (race_id) REFERENCES races(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Technologies (not in remote db)
CREATE TABLE IF NOT EXISTS technologies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    type VARCHAR(100),
    description TEXT,
    applications TEXT,
    classification VARCHAR(50) DEFAULT 'SUGGESTION',
    created_by INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    version INTEGER DEFAULT 1,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Historical Events (not in remote db)
CREATE TABLE IF NOT EXISTS historical_events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    world_id INTEGER,
    date TIMESTAMP WITH TIME ZONE,
    description TEXT,
    impact VARCHAR(255),
    classification VARCHAR(50) DEFAULT 'SUGGESTION',
    created_by INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    version INTEGER DEFAULT 1,
    FOREIGN KEY (world_id) REFERENCES worlds(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Civilizations (not in remote db)
CREATE TABLE IF NOT EXISTS civilizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    world_id INTEGER,
    description TEXT,
    era VARCHAR(100),
    classification VARCHAR(50) DEFAULT 'SUGGESTION',
    created_by INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    version INTEGER DEFAULT 1,
    FOREIGN KEY (world_id) REFERENCES worlds(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Artifacts (not in remote db)
CREATE TABLE IF NOT EXISTS artifacts (
    id SERIAL PRIMARY KEY,
    artifact_id VARCHAR(255) UNIQUE NOT NULL,
    generation_id VARCHAR(255),
    provider VARCHAR(50),
    model VARCHAR(50),
    prompt TEXT,
    content TEXT,
    assessment_status VARCHAR(50) DEFAULT 'PENDING',
    classification VARCHAR(50) DEFAULT 'SUGGESTION',
    created_by INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    version INTEGER DEFAULT 1,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Generation Records (not in remote db)
CREATE TABLE IF NOT EXISTS generation_records (
    id SERIAL PRIMARY KEY,
    generation_id VARCHAR(255) UNIQUE NOT NULL,
    artifact_id INTEGER NOT NULL,
    provider VARCHAR(50),
    model VARCHAR(50),
    request_hash VARCHAR(255),
    response_hash VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (artifact_id) REFERENCES artifacts(id) ON DELETE CASCADE
);

-- Audit Logs (not in remote db)
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    event_id VARCHAR(255) UNIQUE NOT NULL,
    correlation_id VARCHAR(255),
    actor VARCHAR(255),
    action VARCHAR(255) NOT NULL,
    object_type VARCHAR(100),
    object_id VARCHAR(255),
    previous_state TEXT,
    new_state TEXT,
    outcome VARCHAR(50),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata TEXT
);

-- Change Proposals (not in remote db)
CREATE TABLE IF NOT EXISTS change_proposals (
    id SERIAL PRIMARY KEY,
    proposal_id VARCHAR(50) UNIQUE NOT NULL,
    artifact_type VARCHAR(50) NOT NULL,
    artifact_id VARCHAR(255),
    description TEXT NOT NULL,
    classification VARCHAR(50) DEFAULT 'SUGGESTION',
    current_version INTEGER DEFAULT 1,
    proposed_version INTEGER DEFAULT 2,
    rationale TEXT,
    evidence TEXT,
    status VARCHAR(50) DEFAULT 'DRAFT',
    author_id INTEGER,
    reviewer_id INTEGER,
    approver_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    version_commit INTEGER DEFAULT 0,
    FOREIGN KEY (author_id) REFERENCES users(id),
    FOREIGN KEY (reviewer_id) REFERENCES users(id),
    FOREIGN KEY (approver_id) REFERENCES users(id)
);

-- WOF Generation Records (not in remote db)
CREATE TABLE IF NOT EXISTS wof_generation_records (
    id SERIAL PRIMARY KEY,
    generation_id VARCHAR(50) UNIQUE NOT NULL,
    world_id INTEGER NOT NULL,
    proposal_record_id INTEGER,
    intent_json TEXT NOT NULL,
    result_json TEXT NOT NULL,
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (world_id) REFERENCES worlds(id) ON DELETE CASCADE,
    FOREIGN KEY (proposal_record_id) REFERENCES change_proposals(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Approval Decisions (not in remote db)
CREATE TABLE IF NOT EXISTS approval_decisions (
    id SERIAL PRIMARY KEY,
    proposal_id INTEGER NOT NULL,
    decision VARCHAR(20) NOT NULL,
    reviewer VARCHAR(255),
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (proposal_id) REFERENCES change_proposals(id) ON DELETE CASCADE
);

-- Source Records (not in remote db)
CREATE TABLE IF NOT EXISTS source_records (
    id SERIAL PRIMARY KEY,
    source_id VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    origin VARCHAR(255),
    author VARCHAR(255),
    version VARCHAR(50),
    classification VARCHAR(50) DEFAULT 'SUGGESTION',
    provenance TEXT,
    created_by INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Evidence Records (not in remote db)
CREATE TABLE IF NOT EXISTS evidence_records (
    id SERIAL PRIMARY KEY,
    evidence_id VARCHAR(50) UNIQUE NOT NULL,
    source_id VARCHAR(50),
    artifact_id VARCHAR(50),
    classification VARCHAR(50) DEFAULT 'ESTABLISHED',
    evidence_class VARCHAR(50) DEFAULT 'ACQUISITION',
    justification TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by INTEGER,
    FOREIGN KEY (source_id) REFERENCES source_records(source_id) ON DELETE SET NULL,
    FOREIGN KEY (verified_by) REFERENCES users(id)
);

-- Review Records (not in remote db)
CREATE TABLE IF NOT EXISTS review_records (
    id SERIAL PRIMARY KEY,
    review_id VARCHAR(50) UNIQUE NOT NULL,
    artifact_type VARCHAR(50) NOT NULL,
    artifact_id VARCHAR(255),
    reviewer VARCHAR(255),
    decision VARCHAR(20),
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workspaces (not in remote db)
CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Entities (not in remote db)
CREATE TABLE IF NOT EXISTS entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
);

-- Sources (not in remote db)
CREATE TABLE IF NOT EXISTS sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    title VARCHAR(500) NOT NULL,
    source_type VARCHAR(50) NOT NULL,
    file_path TEXT,
    checksum VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
);

-- Claims (not in remote db)
CREATE TABLE IF NOT EXISTS claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    statement TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'PROPOSED',
    confidence NUMERIC(5,2),
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Evidence Links (not in remote db)
CREATE TABLE IF NOT EXISTS evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_id UUID NOT NULL,
    source_id UUID NOT NULL,
    evidence_type VARCHAR(50) NOT NULL,
    excerpt TEXT NOT NULL,
    page_number INTEGER,
    section_reference VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (claim_id) REFERENCES claims(id) ON DELETE CASCADE,
    FOREIGN KEY (source_id) REFERENCES sources(id) ON DELETE CASCADE
);

-- Relationships (not in remote db)
CREATE TABLE IF NOT EXISTS relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    source_entity_id UUID NOT NULL,
    target_entity_id UUID NOT NULL,
    relationship_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
    FOREIGN KEY (source_entity_id) REFERENCES entities(id) ON DELETE CASCADE,
    FOREIGN KEY (target_entity_id) REFERENCES entities(id) ON DELETE CASCADE
);

-- Reviews (not in remote db)
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_id UUID NOT NULL,
    reviewer_id INTEGER,
    score NUMERIC(5,2),
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (claim_id) REFERENCES claims(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(id)
);

-- Decisions (not in remote db)
CREATE TABLE IF NOT EXISTS decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_id UUID NOT NULL,
    outcome VARCHAR(50) NOT NULL,
    rationale TEXT NOT NULL,
    decided_by INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (claim_id) REFERENCES claims(id) ON DELETE CASCADE,
    FOREIGN KEY (decided_by) REFERENCES users(id)
);

-- Knowledge Versions (not in remote db)
CREATE TABLE IF NOT EXISTS knowledge_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    claim_id UUID NOT NULL,
    version_number INTEGER NOT NULL,
    snapshot TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
    FOREIGN KEY (claim_id) REFERENCES claims(id) ON DELETE CASCADE
);

-- Audit Events (not in remote db)
CREATE TABLE IF NOT EXISTS audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    actor_id INTEGER NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
    FOREIGN KEY (actor_id) REFERENCES users(id)
);

-- Workflow Runs (not in remote db)
CREATE TABLE IF NOT EXISTS workflow_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    workflow_type VARCHAR(200) NOT NULL,
    status VARCHAR(50) NOT NULL,
    input_payload TEXT NOT NULL,
    output_payload TEXT,
    validation_report TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
);

-- WOF World States (not in remote db)
CREATE TABLE IF NOT EXISTS wof_world_states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    world_id INTEGER NOT NULL,
    state_name VARCHAR(255) NOT NULL,
    state_type VARCHAR(50) NOT NULL,
    details TEXT,
    sequence_number INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (world_id) REFERENCES worlds(id) ON DELETE CASCADE
);

-- ==========================================
-- 2. ALTER EXISTING TABLES (add missing columns)
-- ==========================================

-- Claims: Add workspace_id column
ALTER TABLE claims ADD COLUMN IF NOT EXISTS workspace_id UUID;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'PROPOSED';
ALTER TABLE claims ADD COLUMN IF NOT EXISTS confidence NUMERIC(5,2);
ALTER TABLE claims ADD COLUMN IF NOT EXISTS created_by INTEGER;

-- Sources: Add workspace_id column
ALTER TABLE sources ADD COLUMN IF NOT EXISTS workspace_id UUID;
ALTER TABLE sources ADD COLUMN IF NOT EXISTS source_type VARCHAR(50);
ALTER TABLE sources ADD COLUMN IF NOT EXISTS file_path TEXT;
ALTER TABLE sources ADD COLUMN IF NOT EXISTS checksum VARCHAR(128);

-- Relationships: Add workspace_id column
ALTER TABLE relationships ADD COLUMN IF NOT EXISTS workspace_id UUID;
ALTER TABLE relationships ADD COLUMN IF NOT EXISTS relationship_type VARCHAR(100);

-- Entities: Add workspace_id column
ALTER TABLE entities ADD COLUMN IF NOT EXISTS workspace_id UUID;
ALTER TABLE entities ADD COLUMN IF NOT EXISTS entity_type VARCHAR(50);

-- Audit Events: Add workspace_id and entity_id columns
ALTER TABLE audit_events ADD COLUMN IF NOT EXISTS workspace_id UUID;
ALTER TABLE audit_events ADD COLUMN IF NOT EXISTS entity_id UUID;
ALTER TABLE audit_events ADD COLUMN IF NOT EXISTS actor_id INTEGER;

-- Workflow Runs: Add workspace_id column
ALTER TABLE workflow_runs ADD COLUMN IF NOT EXISTS workspace_id UUID;

-- Decisions: Add claim_id column
ALTER TABLE decisions ADD COLUMN IF NOT EXISTS claim_id UUID;
ALTER TABLE decisions ADD COLUMN IF NOT EXISTS outcome VARCHAR(50);
ALTER TABLE decisions ADD COLUMN IF NOT EXISTS rationale TEXT;
ALTER TABLE decisions ADD COLUMN IF NOT EXISTS decided_by INTEGER;

-- Knowledge Versions: Add workspace_id and claim_id columns
ALTER TABLE knowledge_versions ADD COLUMN IF NOT EXISTS workspace_id UUID;
ALTER TABLE knowledge_versions ADD COLUMN IF NOT EXISTS claim_id UUID;
ALTER TABLE knowledge_versions ADD COLUMN IF NOT EXISTS version_number INTEGER;
ALTER TABLE knowledge_versions ADD COLUMN IF NOT EXISTS snapshot TEXT;

-- ==========================================
-- 3. CREATE INDEXES
-- ==========================================

-- Users
CREATE INDEX idx_users_email ON users(email);

-- Worlds
CREATE INDEX idx_worlds_name ON worlds(name);
CREATE INDEX idx_worlds_created_by ON worlds(created_by);

-- World Locations
CREATE INDEX idx_world_locations_world_id ON world_locations(world_id);

-- Races
CREATE INDEX idx_races_name ON races(name);
CREATE INDEX idx_races_created_by ON races(created_by);

-- Characters
CREATE INDEX idx_characters_race_id ON characters(race_id);
CREATE INDEX idx_characters_created_by ON characters(created_by);

-- Technologies
CREATE INDEX idx_technologies_name ON technologies(name);

-- Historical Events
CREATE INDEX idx_historical_events_world_id ON historical_events(world_id);

-- Civilizations
CREATE INDEX idx_civilizations_world_id ON civilizations(world_id);

-- Artifacts
CREATE INDEX idx_artifacts_created_by ON artifacts(created_by);

-- Change Proposals
CREATE INDEX idx_change_proposals_status ON change_proposals(status);
CREATE INDEX idx_change_proposals_author_id ON change_proposals(author_id);

-- WOF Generation Records
CREATE INDEX idx_wof_gen_records_world_id ON wof_generation_records(world_id);

-- Approval Decisions
CREATE INDEX idx_approval_decisions_proposal_id ON approval_decisions(proposal_id);

-- Evidence Records
CREATE INDEX idx_evidence_records_source_id ON evidence_records(source_id);
CREATE INDEX idx_evidence_records_verified_by ON evidence_records(verified_by);

-- Review Records
CREATE INDEX idx_review_records_decision ON review_records(decision);

-- Entities
CREATE INDEX idx_entities_workspace_id ON entities(workspace_id);
CREATE INDEX idx_entities_entity_type ON entities(entity_type);

-- Sources
CREATE INDEX idx_sources_workspace_id ON sources(workspace_id);

-- Claims
CREATE INDEX idx_claims_workspace_id ON claims(workspace_id);
CREATE INDEX idx_claims_status ON claims(status);

-- Evidence
CREATE INDEX idx_evidence_claim_id ON evidence(claim_id);

-- Relationships
CREATE INDEX idx_relationships_workspace_id ON relationships(workspace_id);

-- Reviews
CREATE INDEX idx_reviews_claim_id ON reviews(claim_id);

-- Decisions
CREATE INDEX idx_decisions_claim_id ON decisions(claim_id);

-- Knowledge Versions
CREATE INDEX idx_knowledge_versions_workspace_id ON knowledge_versions(workspace_id);

-- Audit Events
CREATE INDEX idx_audit_events_workspace_id ON audit_events(workspace_id);

-- Workflow Runs
CREATE INDEX idx_workflow_runs_workspace_id ON workflow_runs(workspace_id);

-- WOF World States
CREATE INDEX idx_wf_states_world_id ON wof_world_states(world_id);
CREATE INDEX idx_wf_states_state_name ON wof_world_states(state_name);

-- ==========================================
-- 4. CREATE TRIGGERS (update timestamps)
-- ==========================================

-- Function to update updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for worlds
CREATE TRIGGER update_worlds_timestamp BEFORE UPDATE ON worlds
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for world_locations
CREATE TRIGGER update_world_locations_timestamp BEFORE UPDATE ON world_locations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for races
CREATE TRIGGER update_races_timestamp BEFORE UPDATE ON races
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for characters
CREATE TRIGGER update_characters_timestamp BEFORE UPDATE ON characters
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for technologies
CREATE TRIGGER update_technologies_timestamp BEFORE UPDATE ON technologies
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for historical_events
CREATE TRIGGER update_historical_events_timestamp BEFORE UPDATE ON historical_events
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for civilizations
CREATE TRIGGER update_civilizations_timestamp BEFORE UPDATE ON civilizations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for artifacts
CREATE TRIGGER update_artifacts_timestamp BEFORE UPDATE ON artifacts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for generation_records
CREATE TRIGGER update_generation_records_timestamp BEFORE UPDATE ON generation_records
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for audit_logs
CREATE TRIGGER update_audit_logs_timestamp BEFORE UPDATE ON audit_logs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for change_proposals
CREATE TRIGGER update_change_proposals_timestamp BEFORE UPDATE ON change_proposals
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for wof_generation_records
CREATE TRIGGER update_wof_generation_records_timestamp BEFORE UPDATE ON wof_generation_records
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for approval_decisions
CREATE TRIGGER update_approval_decisions_timestamp BEFORE UPDATE ON approval_decisions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for source_records
CREATE TRIGGER update_source_records_timestamp BEFORE UPDATE ON source_records
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for evidence_records
CREATE TRIGGER update_evidence_records_timestamp BEFORE UPDATE ON evidence_records
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for review_records
CREATE TRIGGER update_review_records_timestamp BEFORE UPDATE ON review_records
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for workspaces
CREATE TRIGGER update_workspaces_timestamp BEFORE UPDATE ON workspaces
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for entities
CREATE TRIGGER update_entities_timestamp BEFORE UPDATE ON entities
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for sources (knowledge graph)
CREATE TRIGGER update_sources_timestamp BEFORE UPDATE ON sources
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for claims (knowledge graph)
CREATE TRIGGER update_claims_timestamp BEFORE UPDATE ON claims
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for evidence (knowledge graph)
CREATE TRIGGER update_evidence_timestamp BEFORE UPDATE ON evidence
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for relationships (knowledge graph)
CREATE TRIGGER update_relationships_timestamp BEFORE UPDATE ON relationships
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for reviews (knowledge graph)
CREATE TRIGGER update_reviews_timestamp BEFORE UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for decisions (knowledge graph)
CREATE TRIGGER update_decisions_timestamp BEFORE UPDATE ON decisions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for knowledge_versions (knowledge graph)
CREATE TRIGGER update_knowledge_versions_timestamp BEFORE UPDATE ON knowledge_versions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for audit_events (knowledge graph)
CREATE TRIGGER update_audit_events_timestamp BEFORE UPDATE ON audit_events
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for workflow_runs
CREATE TRIGGER update_workflow_runs_timestamp BEFORE UPDATE ON workflow_runs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for wof_world_states
CREATE TRIGGER update_wof_world_states_timestamp BEFORE UPDATE ON wof_world_states
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

