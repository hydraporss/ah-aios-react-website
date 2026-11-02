"""
AH-AIOS World Model — Phase 2 core module.

Provides the foundational world model for a generative, interconnected,
explorable, and evolving AFTER HUMANITY universe.

Components:
- Entity: stable unique identity, type, properties, provenance, epistemic status, canon status
- Relationship: typed relationship between entities with temporal validity
- Rule: hard constraints and probabilistic tendencies
- Event: state transition with provenance and event ordering
- World: state container with event history

Design principles:
- Preserve established identities, distinctions, relationships, and known contradictions.
- Use stable unique IDs independent of mutable names or descriptions.
- Record provenance for all records.
- Distinguish hard constraints from probabilistic tendencies.
- Track temporal validity of relationships.
- Distinguish observed, simulated, authored, and hypothesized events.
- Keep generic world-model mechanisms separate from AFTER HUMANITY-specific content.
"""

from .world_model import (
    BASE_DIR,
    REGISTRY_DIR,
    WORLD_DIR,
    ENTITY_TYPES,
    RELATIONSHIP_TYPES,
    PROVENANCE_ORIGINS,
    EPHEMISTIC_STATUSES,
    CANON_STATUSES,
    EVENT_TYPES,
    now_iso,
    sha256_of_string,
    generate_entity_id,
    generate_relationship_id,
    generate_event_id,
    generate_rule_id,
    generate_world_id,
    generate_event_log_id,
    load_json,
    save_json,
    validate_entity_id,
    validate_relationship_id,
    validate_event_id,
    validate_rule_id,
    validate_entity,
    validate_relationship,
    validate_rule,
    validate_event,
    create_entity,
    create_relationship,
    create_rule,
    create_event,
    create_world,
    create_event_log,
)

__all__ = [
    "BASE_DIR",
    "REGISTRY_DIR",
    "WORLD_DIR",
    "ENTITY_TYPES",
    "RELATIONSHIP_TYPES",
    "PROVENANCE_ORIGINS",
    "EPHEMISTIC_STATUSES",
    "CANON_STATUSES",
    "EVENT_TYPES",
    "now_iso",
    "sha256_of_string",
    "generate_entity_id",
    "generate_relationship_id",
    "generate_event_id",
    "generate_rule_id",
    "generate_world_id",
    "generate_event_log_id",
    "load_json",
    "save_json",
    "validate_entity_id",
    "validate_relationship_id",
    "validate_event_id",
    "validate_rule_id",
    "validate_entity",
    "validate_relationship",
    "validate_rule",
    "validate_event",
    "create_entity",
    "create_relationship",
    "create_rule",
    "create_event",
    "create_world",
    "create_event_log",
]
