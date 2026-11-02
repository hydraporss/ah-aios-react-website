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

from __future__ import annotations

import hashlib
import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

# Project root (same resolution as recovery.py: 3 levels up from src/ah_aios/)
BASE_DIR = Path(__file__).resolve().parent.parent.parent
REGISTRY_DIR = BASE_DIR / "registry"
WORLD_DIR = BASE_DIR / "world_model"

# Entity type categories
ENTITY_TYPES = [
    "cosmic_entity",
    "world",
    "environment",
    "organism",
    "population",
    "agent",
    "civilization",
    "technology",
    "resource",
    "event",
    "knowledge",
    "rule",
]

# Relationship type categories
RELATIONSHIP_TYPES = [
    "spatial",
    "containment",
    "origin",
    "historical",
    "ecological",
    "social",
    "diplomatic",
    "economic",
    "technological",
    "causal",
    "knowledge",
]

# Provenance origins
PROVENANCE_ORIGINS = ["authored", "imported", "generated", "simulated", "observed"]

# Epistemic statuses
EPHEMISTIC_STATUSES = [
    "hypothesis",
    "interpretation",
    "supported",
    "verified",
    "disputed",
    "unknown",
]

# Canon statuses
CANON_STATUSES = ["established canon", "approved extension", "candidate", "non-canonical exploration"]

# Event types
EVENT_TYPES = ["observed", "simulated", "authored", "hypothesized"]


def now_iso() -> str:
    """Return current UTC time in ISO 8601 format."""
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def sha256_of_string(text: str) -> str:
    """Compute SHA-256 hex digest of a string."""
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def generate_entity_id(entity_type: str, count: int) -> str:
    """Generate a stable unique entity ID."""
    return f"{entity_type.upper()}-{count:03d}"


def generate_relationship_id(count: int) -> str:
    """Generate a stable unique relationship ID."""
    return f"REL-{count:03d}"


def generate_event_id(count: int) -> str:
    """Generate a stable unique event ID."""
    return f"EVT-{count:03d}"


def generate_rule_id(count: int) -> str:
    """Generate a stable unique rule ID."""
    return f"RUL-{count:03d}"


def generate_world_id(count: int) -> str:
    """Generate a stable unique world ID."""
    return f"WLD-{count:03d}"


def generate_event_log_id(count: int) -> str:
    """Generate a stable unique event log ID."""
    return f"EVL-{count:03d}"


def load_json(path: str | Path) -> Any:
    """Load JSON from a file path."""
    from pathlib import Path
    path = Path(path)
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def save_json(path: str | Path, data: Any) -> None:
    """Save JSON to a file path."""
    from pathlib import Path
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def validate_entity_id(entity_id: str) -> bool:
    """Validate an entity ID format."""
    return isinstance(entity_id, str) and entity_id.startswith(("E-", "W-", "O-", "A-", "C-", "T-", "R-", "E-", "K-", "RU-"))


def validate_relationship_id(relationship_id: str) -> bool:
    """Validate a relationship ID format."""
    return isinstance(relationship_id, str) and relationship_id.startswith("REL-")


def validate_event_id(event_id: str) -> bool:
    """Validate an event ID format."""
    return isinstance(event_id, str) and event_id.startswith("EVT-")


def validate_rule_id(rule_id: str) -> bool:
    """Validate a rule ID format."""
    return isinstance(rule_id, str) and rule_id.startswith("RUL-")


def validate_entity(entity: dict) -> list[str]:
    """Validate an entity record."""
    errors = []
    required = ["id", "type", "name", "provenance"]
    for field in required:
        if field not in entity or not entity[field]:
            errors.append(f"missing required field: {field}")
    if entity.get("type") not in ENTITY_TYPES:
        errors.append(f"invalid entity type: {entity.get('type')!r}")
    if entity.get("epistemic_status") not in EPHEMISTIC_STATUSES:
        errors.append(f"invalid epistemic_status: {entity.get('epistemic_status')!r}")
    if entity.get("canon_status") not in CANON_STATUSES:
        errors.append(f"invalid canon_status: {entity.get('canon_status')!r}")
    if not validate_entity_id(entity.get("id", "")):
        errors.append(f"invalid entity ID format: {entity.get('id')!r}")
    return errors


def validate_relationship(relationship: dict) -> list[str]:
    """Validate a relationship record."""
    errors = []
    required = ["id", "type", "subject_id", "object_id"]
    for field in required:
        if field not in relationship or not relationship[field]:
            errors.append(f"missing required field: {field}")
    if relationship.get("type") not in RELATIONSHIP_TYPES:
        errors.append(f"invalid relationship type: {relationship.get('type')!r}")
    if not validate_relationship_id(relationship.get("id", "")):
        errors.append(f"invalid relationship ID format: {relationship.get('id')!r}")
    return errors


def validate_rule(rule: dict) -> list[str]:
    """Validate a rule record."""
    errors = []
    required = ["id", "type", "description", "domain", "action"]
    for field in required:
        if field not in rule or not rule[field]:
            errors.append(f"missing required field: {field}")
    if rule.get("id") and not validate_rule_id(rule["id"]):
        errors.append(f"invalid rule ID format: {rule.get('id')!r}")
    return errors


def validate_event(event: dict) -> list[str]:
    """Validate an event record."""
    errors = []
    required = ["id", "type", "event_type", "affected_entity_ids"]
    for field in required:
        if field not in event or not event[field]:
            errors.append(f"missing required field: {field}")
    if event.get("event_type") not in EVENT_TYPES:
        errors.append(f"invalid event_type: {event.get('event_type')!r}")
    if not validate_event_id(event.get("id", "")):
        errors.append(f"invalid event ID format: {event.get('id')!r}")
    return errors


def create_entity(
    entity_type: str,
    name: str,
    description: str = "",
    properties: dict | None = None,
    provenance: dict | None = None,
    epistemic_status: str = "hypothesis",
    canon_status: str = "candidate",
    version: str = "1.0.0",
) -> dict:
    """Create a new entity record."""
    if properties is None:
        properties = {}
    if provenance is None:
        provenance = {
            "source": "authored",
            "source_location": "",
            "source_sha256": "",
        }
    timestamp = now_iso()
    return {
        "id": generate_entity_id(entity_type, 1),
        "type": entity_type,
        "name": name,
        "description": description,
        "properties": properties,
        "created_at": timestamp,
        "updated_at": timestamp,
        "provenance": provenance,
        "epistemic_status": epistemic_status,
        "canon_status": canon_status,
        "version": version,
    }


def create_relationship(
    subject_id: str,
    object_id: str,
    relationship_type: str,
    description: str = "",
    strength: str = "moderate",
    valid_from: str | None = None,
    valid_to: str | None = None,
    provenance: dict | None = None,
) -> dict:
    """Create a new relationship record."""
    if provenance is None:
        provenance = {
            "source": "authored",
            "source_location": "",
            "source_sha256": "",
        }
    timestamp = now_iso()
    return {
        "id": generate_relationship_id(1),
        "type": relationship_type,
        "subject_id": subject_id,
        "object_id": object_id,
        "description": description,
        "strength": strength,
        "valid_from": valid_from or timestamp,
        "valid_to": valid_to,
        "created_at": timestamp,
        "updated_at": timestamp,
        "provenance": provenance,
    }


def create_rule(
    rule_type: str,
    description: str,
    domain: str,
    conditions: dict | None = None,
    action: dict | None = None,
    probabilistic: bool = False,
    hard_constraint: bool = True,
    version: str = "1.0.0",
) -> dict:
    """Create a new rule record."""
    if conditions is None:
        conditions = {}
    if action is None:
        action = {}
    timestamp = now_iso()
    return {
        "id": generate_rule_id(1),
        "type": rule_type,
        "description": description,
        "domain": domain,
        "conditions": conditions,
        "action": action,
        "probabilistic": probabilistic,
        "hard_constraint": hard_constraint,
        "created_at": timestamp,
        "updated_at": timestamp,
        "version": version,
    }


def create_event(
    event_type: str,
    event_name: str,
    affected_entity_ids: list[str],
    previous_state: dict | None = None,
    resulting_state: dict | None = None,
    initiating_action: str = "",
    applied_rule: str = "",
    consequences: list[str] = None,
    random_seed: int | None = None,
    provenance: dict | None = None,
    source: str = "authored",
) -> dict:
    """Create a new event record."""
    if consequences is None:
        consequences = []
    if provenance is None:
        provenance = {
            "source": "authored",
            "source_location": "",
            "source_sha256": "",
        }
    timestamp = now_iso()
    return {
        "id": generate_event_id(1),
        "type": event_name,
        "event_type": event_type,
        "affected_entity_ids": affected_entity_ids,
        "timestamp": timestamp,
        "previous_state": previous_state or {},
        "resulting_state": resulting_state or {},
        "initiating_action": initiating_action,
        "applied_rule": applied_rule,
        "consequences": consequences,
        "random_seed": random_seed,
        "created_at": timestamp,
        "updated_at": timestamp,
        "provenance": provenance,
        "source": source,
    }


def create_world(
    name: str,
    version: str = "1.0.0",
    entity_ids: list[str] | None = None,
    relationship_ids: list[str] | None = None,
    rule_ids: list[str] | None = None,
) -> dict:
    """Create a new world state record."""
    timestamp = now_iso()
    return {
        "id": generate_world_id(1),
        "name": name,
        "version": version,
        "created_at": timestamp,
        "saved_at": timestamp,
        "entity_ids": entity_ids or [],
        "relationship_ids": relationship_ids or [],
        "rule_ids": rule_ids or [],
        "metadata": {
            "source": "authored",
            "notes": "Initial world state",
        },
    }


def create_event_log():
    """Create an empty event log."""
    return {
        "id": generate_event_log_id(1),
        "events": [],
        "created_at": now_iso(),
    }
