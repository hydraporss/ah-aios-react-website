-- AH-AIOS LEARNING STUDIO - SEED DATA
-- Basic seed data for initial setup

-- Insert demo users
INSERT INTO users (email, password_hash, name, role) VALUES
    ('admin@ah-aios.studio', 'demo-admin-password', 'System Administrator', 'admin'),
    ('user@ah-aios.studio', 'demo-user-password', 'Demo Learner', 'member');

-- Insert demo world
INSERT INTO worlds (name, description, classification) VALUES
    ('AH-AIOS Core', 'The foundational operating, identity, security, infrastructure, governance, and trust domain of the AFTER HUMANITY Artificial Intelligence Operating System.', 'SUGGESTION');

-- Insert learning paths
INSERT INTO workspaces (name, slug, description) VALUES
    ('Beginner Learning Path', 'beginner-path', 'Start your journey with the fundamentals of AH-AIOS'),
    ('Advanced AI Engineering', 'advanced-path', 'Master AI engineering and execution'),
    ('WorldForge Deep Dive', 'worldforge-path', 'Explore knowledge engineering and world modeling');

-- Insert sample courses
INSERT INTO entities (workspace_id, name, entity_type) VALUES
    ((SELECT id FROM workspaces WHERE slug = 'beginner-path'), 'AI Governance Essentials', 'course'),
    ((SELECT id FROM workspaces WHERE slug = 'beginner-path'), 'World Model Architecture', 'course'),
    ((SELECT id FROM workspaces WHERE slug = 'advanced-path'), 'Agent Orchestration', 'course'),
    ((SELECT id FROM workspaces WHERE slug = 'advanced-path'), 'Tool Integration', 'course');

-- Insert sample lessons
INSERT INTO claims (workspace_id, statement, status, confidence, created_by) VALUES
    ((SELECT id FROM workspaces WHERE slug = 'beginner-path'), 'AI governance is essential for responsible AI development', 'PROPOSED', 0.8, 1),
    ((SELECT id FROM workspaces WHERE slug = 'beginner-path'), 'World modeling requires structured knowledge representation', 'PROPOSED', 0.7, 1);

-- Insert sample sources
INSERT INTO sources (workspace_id, title, source_type, file_path) VALUES
    ((SELECT id FROM workspaces WHERE slug = 'beginner-path'), 'AH-AIOS System Definition', 'specification', 'docs/AH-AIOS-SYSTEM-DEFINITION.md'),
    ((SELECT id FROM workspaces WHERE slug = 'beginner-path'), 'Learning Curriculum', 'curriculum', 'docs/learning/CURRICULUM.md');

-- Insert sample claims with evidence
INSERT INTO claims (workspace_id, statement, status, confidence, created_by) VALUES
    ((SELECT id FROM workspaces WHERE slug = 'beginner-path'), 'AI governance and safety are critical for autonomous systems', 'PROPOSED', 0.85, 1);

INSERT INTO evidence (claim_id, source_id, evidence_type, excerpt, page_number) VALUES
    (curr.id, src.id, 'direct_quote', 'Governance frameworks ensure ethical AI development', 1);
