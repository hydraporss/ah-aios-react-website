"""AH-AIOS Procedural Lore Engine — entity, relationship, event, and template schemas."""

import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


# Project root (same resolution as recovery.py: 3 levels up from src/ah_aios/ah_lore_engine/)
BASE_DIR = Path(__file__).resolve().parent.parent.parent
REGISTRY_DIR = BASE_DIR / "registry"
WORLD_DIR = BASE_DIR / "world_model"


# Entity types
ENTITY_TYPES = [
    "UNIVERSE", "GALAXY", "STAR_SYSTEM", "PLANET", "REGION", "BIOME",
    "SPECIES", "FACTION", "CHARACTER", "ARTIFACT", "STRUCTURE",
    "EVENT", "ERA", "DISCOVERY", "LORE_FRAGMENT", "SOURCE", "CLAIM",
]


# Relationship types
RELATIONSHIP_TYPES = [
    "CONTAINS", "LOCATED_IN", "HOME_TO", "CREATED_BY", "OWNED_BY",
    "CONTROLLED_BY", "DESCENDED_FROM", "PARTICIPATED_IN", "CAUSED",
    "CONTRIBUTED_TO", "RESULTED_IN", "DESTROYED_BY", "LEFT_TRACE",
    "EVIDENCED_BY", "SUPPORTS", "CONTRADICTS", "REVEALS", "DERIVED_FROM",
]


# Provenance origins
PROVENANCE_ORIGINS = ["authored", "imported", "generated", "simulated", "observed"]


# Epistemic statuses
EPHEMISTIC_STATUSES = ["unknown", "hypothesized", "interpreted", "supported",
                        "verified", "disputed"]


# Lifecycle statuses
LIFECYCLE_STATUSES = ["draft", "generated", "reviewed", "accepted", "rejected", "superseded"]


# Canon statuses
CANON_STATUSES = ["emergent", "candidate", "canon", "conflict", "superseded"]


# Event types
EVENT_TYPES = ["observed", "simulated", "authored", "hypothesized"]


# Discovery triggers
DISCOVERY_TRIGGERS = ["discovery", "quest", "revelation", "mystery", "artifact"]


# Revelation levels
REVELATION_LEVELS = ["HINT", "PARTIAL", "FULL"]


def now_iso():
    """Return current UTC time in ISO 8601 format."""
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def sha256_of_string(text: str) -> str:
    """Compute SHA-256 hex digest of a string."""
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def validate_entity_id(entity_id: str) -> bool:
    """Validate an entity ID format."""
    return isinstance(entity_id, str) and entity_id.startswith(("UNIVERSE-", "GALAXY-", "SYSTEM-",
                                                                "PLANET-", "REGION-", "BIOME-",
                                                                "SPECIES-", "FACTION-", "CHARACTER-",
                                                                "ARTIFACT-", "STRUCTURE-", "EVENT-",
                                                                "ERA-", "DISCOVERY-", "LORE-", "SOURCE-", "CLAIM-"))


def validate_relationship_id(relationship_id: str) -> bool:
    """Validate a relationship ID format."""
    return isinstance(relationship_id, str) and relationship_id.startswith("REL-")


def validate_event_id(event_id: str) -> bool:
    """Validate an event ID format."""
    return isinstance(event_id, str) and event_id.startswith("EVT-")


def validate_rule_id(rule_id: str) -> bool:
    """Validate a rule ID format."""
    return isinstance(rule_id, str) and rule_id.startswith("RUL-")


def validate_template_id(template_id: str) -> bool:
    """Validate a template ID format."""
    return isinstance(template_id, str) and template_id.startswith("TPL-")


def load_json(path: Path | str) -> Any:
    """Load JSON from a file path."""
    if isinstance(path, str):
        path = Path(path)
    with path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def save_json(path: Path | str, data: Any) -> None:
    """Save JSON to a file path."""
    if isinstance(path, str):
        path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as fh:
        json.dump(data, fh, indent=2, ensure_ascii=False)

class Entity:
    """A persistent entity in the world model."""

    def __init__(
        self,
        entity_type: str,
        name: str,
        description: str = "",
        properties: dict | None = None,
        provenance: dict | None = None,
        epistemic_status: str = "hypothesized",
        canon_status: str = "candidate",
        version: str = "1.0.0",
    ):
        self.entity_type = entity_type
        self.name = name
        self.description = description
        self.properties = properties or {}
        self.created_at = now_iso()
        self.updated_at = self.created_at
        self.provenance = provenance or {
            "source": "authored",
            "source_location": "",
            "source_sha256": "",
        }
        self.epistemic_status = epistemic_status
        self.canon_status = canon_status
        self.version = version

    @property
    def id(self) -> str:
        """Stable unique entity ID derived from type and properties."""
        return f"{self.entity_type.upper()}-{self.name.replace(' ', '_').upper()[:8].upper()}"

    def to_dict(self) -> dict:
        """Serialize entity to a dictionary."""
        return {
            "id": self.id,
            "type": self.entity_type,
            "name": self.name,
            "description": self.description,
            "properties": self.properties,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "provenance": self.provenance,
            "epistemic_status": self.epistemic_status,
            "canon_status": self.canon_status,
            "version": self.version,
        }

    @classmethod
    def from_dict(cls, data: dict) -> "Entity":
        """Deserialize entity from a dictionary."""
        return cls(
            entity_type=data.get("type", ""),
            name=data.get("name", ""),
            description=data.get("description", ""),
            properties=data.get("properties", {}),
            provenance=data.get("provenance", {}),
            epistemic_status=data.get("epistemic_status", "hypothesized"),
            canon_status=data.get("canon_status", "candidate"),
            version=data.get("version", "1.0.0"),
        )

class Relationship:
    """A typed, directed relationship between two entities."""
    
    def __init__(
        self,
        subject_id: str,
        object_id: str,
        relationship_type: str,
        description: str = "",
        strength: str = "moderate",
        valid_from: str | None = None,
        valid_to: str | None = None,
        certainty: str = "confirmed",
        provenance: dict | None = None,
    ):
        self.subject_id = subject_id
        self.object_id = object_id
        self.relationship_type = relationship_type
        self.description = description
        self.strength = strength
        self.valid_from = valid_from or now_iso()
        self.valid_to = valid_to
        self.certainty = certainty
        self.created_at = now_iso()
        self.updated_at = self.created_at
        self.provenance = provenance or {
            "source": "authored",
            "source_location": "",
            "source_sha256": "",
        }
    
    @property
    def id(self) -> str:
        """Stable unique relationship ID."""
        return f"REL-{self.subject_id[:8].upper()}-{self.object_id[:8].upper()}"
    
    def to_dict(self) -> dict:
        """Serialize relationship to a dictionary."""
        return {
            "id": self.id,
            "type": self.relationship_type,
            "subject_id": self.subject_id,
            "object_id": self.object_id,
            "description": self.description,
            "strength": self.strength,
            "valid_from": self.valid_from,
            "valid_to": self.valid_to,
            "certainty": self.certainty,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "provenance": self.provenance,
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> "Relationship":
        """Deserialize relationship from a dictionary."""
        return cls(
            subject_id=data.get("subject_id", ""),
            object_id=data.get("object_id", ""),
            relationship_type=data.get("type", ""),
            description=data.get("description", ""),
            strength=data.get("strength", "moderate"),
            valid_from=data.get("valid_from", ""),
            valid_to=data.get("valid_to"),
            certainty=data.get("certainty", "confirmed"),
            provenance=data.get("provenance", {}),
        )


class Rule:
    """A constraint rule governing world behavior."""
    
    def __init__(
        self,
        rule_type: str,
        description: str,
        domain: str,
        conditions: dict | None = None,
        action: dict | None = None,
        probabilistic: bool = False,
        hard_constraint: bool = True,
        version: str = "1.0.0",
    ):
        self.rule_type = rule_type
        self.description = description
        self.domain = domain
        self.conditions = conditions or {}
        self.action = action or {}
        self.probabilistic = probabilistic
        self.hard_constraint = hard_constraint
        self.created_at = now_iso()
        self.updated_at = self.created_at
        self.version = version
    
    @property
    def id(self) -> str:
        """Stable unique rule ID."""
        return f"RUL-{self.domain[:4].upper()}-{hashlib.md5(self.description.encode()).hexdigest()[:6].upper()}"
    
    def to_dict(self) -> dict:
        """Serialize rule to a dictionary."""
        return {
            "id": self.id,
            "type": self.rule_type,
            "description": self.description,
            "domain": self.domain,
            "conditions": self.conditions,
            "action": self.action,
            "probabilistic": self.probabilistic,
            "hard_constraint": self.hard_constraint,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "version": self.version,
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> "Rule":
        """Deserialize rule from a dictionary."""
        return cls(
            rule_type=data.get("type", ""),
            description=data.get("description", ""),
            domain=data.get("domain", ""),
            conditions=data.get("conditions", {}),
            action=data.get("action", {}),
            probabilistic=data.get("probabilistic", False),
            hard_constraint=data.get("hard_constraint", True),
            version=data.get("version", "1.0.0"),
        )


class Event:
    """A causal event in world history."""
    
    def __init__(
        self,
        event_type: str,
        affected_entity_ids: list[str],
        previous_state: dict | None = None,
        resulting_state: dict | None = None,
        initiating_action: str = "",
        applied_rule: str = "",
        consequences: list[str] = None,
        provenance: dict | None = None,
    ):
        self.event_type = event_type
        self.affected_entity_ids = affected_entity_ids
        self.previous_state = previous_state or {}
        self.resulting_state = resulting_state or {}
        self.initiating_action = initiating_action
        self.applied_rule = applied_rule
        self.consequences = consequences or []
        self.created_at = now_iso()
        self.provenance = provenance or {
            "source": "authored",
            "source_location": "",
            "source_sha256": "",
        }
    
    @property
    def id(self) -> str:
        """Stable unique event ID."""
        return f"EVT-{self.created_at[:19].replace(':', '')[:15]}-{hashlib.md5(self.initiating_action.encode()).hexdigest()[:6].upper()}"
    
    def to_dict(self) -> dict:
        """Serialize event to a dictionary."""
        return {
            "id": self.id,
            "type": self.event_type,
            "affected_entity_ids": self.affected_entity_ids,
            "previous_state": self.previous_state,
            "resulting_state": self.resulting_state,
            "initiating_action": self.initiating_action,
            "applied_rule": self.applied_rule,
            "consequences": self.consequences,
            "created_at": self.created_at,
            "provenance": self.provenance,
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> "Event":
        """Deserialize event from a dictionary."""
        return cls(
            event_type=data.get("type", ""),
            affected_entity_ids=data.get("affected_entity_ids", []),
            previous_state=data.get("previous_state", {}),
            resulting_state=data.get("resulting_state", {}),
            initiating_action=data.get("initiating_action", ""),
            applied_rule=data.get("applied_rule", ""),
            consequences=data.get("consequences", []),
            provenance=data.get("provenance", {}),
        )


class WorldState:
    """The complete state of a generated world."""
    
    def __init__(
        self,
        name: str,
        version: str = "1.0.0",
        entity_ids: list[str] | None = None,
        relationship_ids: list[str] | None = None,
        rule_ids: list[str] | None = None,
        metadata: dict | None = None,
    ):
        self.name = name
        self.version = version
        self.created_at = now_iso()
        self.saved_at = self.created_at
        self.entity_ids = entity_ids or []
        self.relationship_ids = relationship_ids or []
        self.rule_ids = rule_ids or []
        self.entities = []
        self.relationships = []
        self.rules = []
        self.metadata = metadata or {
            "source": "authored",
            "engine_version": "1.0.0",
            "root_seed": 42,
        }
    
    def add_entity(self, entity: Entity) -> None:
        """Add an entity to the world state."""
        if entity.id not in self.entity_ids:
            self.entity_ids.append(entity.id)
    
    def add_relationship(self, relationship: Relationship) -> None:
        """Add a relationship to the world state."""
        if relationship.id not in self.relationship_ids:
            self.relationship_ids.append(relationship.id)
    
    def add_rule(self, rule: Rule) -> None:
        """Add a rule to the world state."""
        if rule.id not in self.rule_ids:
            self.rule_ids.append(rule.id)
    
    def to_dict(self) -> dict:
        """Serialize world state to a dictionary."""
        return {
            "id": self.id,
            "name": self.name,
            "version": self.version,
            "created_at": self.created_at,
            "saved_at": self.saved_at,
            "entity_ids": self.entity_ids,
            "relationship_ids": self.relationship_ids,
            "rule_ids": self.rule_ids,
            "metadata": self.metadata,
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> "WorldState":
        """Deserialize world state from a dictionary."""
        instance = cls(
            name=data.get("name", "Unnamed World"),
            version=data.get("version", "1.0.0"),
            entity_ids=data.get("entity_ids", []),
            relationship_ids=data.get("relationship_ids", []),
            rule_ids=data.get("rule_ids", []),
            metadata=data.get("metadata", {"source": "authored"}),
        )
        # Deserialize entities, relationships, rules
        if "entities" in data:
            for e_data in data["entities"]:
                instance.entities.append(Entity.from_dict(e_data))
        if "relationships" in data:
            for r_data in data["relationships"]:
                instance.relationships.append(Relationship.from_dict(r_data))
        if "rules" in data:
            for r_data in data["rules"]:
                instance.rules.append(Rule.from_dict(r_data))
        return instance
    
    @property
    def id(self) -> str:
        """World state ID."""
        return f"WLD-{self.name.replace(' ', '_').upper()[:8]}"


class Template:
    """A lore template for narrative realization."""
    
    def __init__(
        self,
        template_id: str,
        template_name: str,
        template_type: str,
        required_facts: list[str] | None = None,
        relationship_types: list[str] | None = None,
        uncertainty: str = "ALLOWED",
        output_format: str = "prose",
        validation_rules: list[str] | None = None,
    ):
        self.template_id = template_id
        self.template_name = template_name
        self.template_type = template_type
        self.required_facts = required_facts or []
        self.relationship_types = relationship_types or []
        self.uncertainty = uncertainty
        self.output_format = output_format
        self.validation_rules = validation_rules or []
    
    def to_dict(self) -> dict:
        """Serialize template to a dictionary."""
        return {
            "template_id": self.template_id,
            "template_name": self.template_name,
            "template_type": self.template_type,
            "required_facts": self.required_facts,
            "relationship_types": self.relationship_types,
            "uncertainty": self.uncertainty,
            "output_format": self.output_format,
            "validation_rules": self.validation_rules,
        }

# --------------------------- Initial Template Set ---------------------------

INITIAL_TEMPLATES = {
    "origin_record": Template(
        template_id="TPL-ORIGIN",
        template_name="Origin Record",
        template_type="origin",
        required_facts=["actor", "time", "place", "circumstance"],
        relationship_types=["CAUSED", "RESULTED_IN"],
        uncertainty="ALLOWED",
        output_format="prose",
        validation_rules=["identity", "causality"],
    ),
    "historical_chronicle": Template(
        template_id="TPL-CHRONICLE",
        template_name="Historical Chronicle",
        template_type="chronicle",
        required_facts=["event", "participants", "timeline"],
        relationship_types=["CAUSED", "RESULTED_IN"],
        uncertainty="ALLOWED",
        output_format="prose",
        validation_rules=["causality", "temporal"],
    ),
    "artifact_description": Template(
        template_id="TPL-ARTIFACT",
        template_name="Artifact Description",
        template_type="artifact",
        required_facts=["artifact", "description", "purpose"],
        relationship_types=["CONTAINS", "LOCATED_IN"],
        uncertainty="FULL",
        output_format="structured",
        validation_rules=["identity", "geography"],
    ),
    "ruin_inscription": Template(
        template_id="TPL-RUIN",
        template_name="Ruin Inscription",
        template_type="ruin",
        required_facts=["ruin", "text", "date"],
        relationship_types=["LOCATED_IN", "EVIDENCED_BY"],
        uncertainty="PARTIAL",
        output_format="structured",
        validation_rules=["geography"],
    ),
    "faction_account": Template(
        template_id="TPL-FACTION",
        template_name="Faction Account",
        template_type="faction",
        required_facts=["faction", "beliefs", "actions"],
        relationship_types=["OWNED_BY", "CONTROLLED_BY"],
        uncertainty="ALLOWED",
        output_format="prose",
        validation_rules=["identity", "causality"],
    ),
    "character_testimony": Template(
        template_id="TPL-TESTIMONY",
        template_name="Character Testimony",
        template_type="character",
        required_facts=["character", "statement", "context"],
        relationship_types=["PARTICIPATED_IN"],
        uncertainty="FULL",
        output_format="structured",
        validation_rules=["identity"],
    ),
    "scientific_observation": Template(
        template_id="TPL-SCIENCE",
        template_name="Scientific Observation",
        template_type="observation",
        required_facts=["observation", "method", "result"],
        relationship_types=["EVIDENCED_BY"],
        uncertainty="FULL",
        output_format="structured",
        validation_rules=["identity"],
    ),
    "historical_rumor": Template(
        template_id="TPL-RUMOR",
        template_name="Historical Rumor",
        template_type="rumor",
        required_facts=["claim", "source", "reliability"],
        relationship_types=["EVIDENCED_BY"],
        uncertainty="FULL",
        output_format="prose",
        validation_rules=["identity"],
    ),
    "discovery_report": Template(
        template_id="TPL-DISCOVERY",
        template_name="Discovery Report",
        template_type="discovery",
        required_facts=["discovery", "location", "evidence"],
        relationship_types=["LOCATED_IN", "EVIDENCED_BY"],
        uncertainty="PARTIAL",
        output_format="prose",
        validation_rules=["identity", "geography"],
    ),
    "unresolved_mystery": Template(
        template_id="TPL-MYSTERY",
        template_name="Unresolved Mystery",
        template_type="mystery",
        required_facts=["question", "evidence", "unknowns"],
        relationship_types=["EVIDENCED_BY"],
        uncertainty="FULL",
        output_format="structured",
        validation_rules=["identity"],
    ),
}
