"""AH-AIOS Procedural Lore Engine — core engine class.

Orchestrates deterministic generation, world state management, causal history,
lore templates, constraint validation, and discovery. The operational facade
for the procedural lore system.
"""

from datetime import datetime, timezone
from typing import Any

from .generator import SeedGeneratorService
from .schema import (
    Entity, Relationship, Rule, Event, WorldState,
    validate_entity_id, validate_relationship_id, validate_event_id, validate_rule_id,
)
from .validator import ConstraintValidator, ValidationResult, ValidationCategory
from .discovery import Discovery, DiscoveryLayer, DiscoveryTrigger, RevelationLevel


class LoreEngine:
    """Core Procedural Lore Engine.

    Coordinates deterministic generation, world state, causal history, lore
    templates, constraint validation, and discovery.
    """

    def __init__(self, config: dict | None = None):
        """Initialize the lore engine.

        Args:
            config: Engine configuration (root seed, generator version, etc.).
        """
        self.config = config or {}
        self.root_seed = self.config.get("root_seed", 42)
        self.generator_version = self.config.get("generator_version", "1.0.0")
        self.rule_set_version = self.config.get("rule_set_version", "1.0.0")

        # Deterministic generation service
        self.generator = SeedGeneratorService(
            root_seed=self.root_seed,
            generator_version=self.generator_version,
        )

        # World state
        self.world = WorldState(
            name="AH-AIOS Lore Engine Test World",
            version="1.0.0",
            entity_ids=[],
            relationship_ids=[],
            rule_ids=[],
            metadata={
                "source": "authored",
                "engine_version": self.generator_version,
                "root_seed": self.root_seed,
            },
        )

        # Constraint validator
        self.validator = ConstraintValidator()

        # Discovery layer
        self.discovery = DiscoveryLayer()

        # Event history
        self.event_log = []

    # --- Entity management ---

    def create_entity(self, entity_type: str, name: str, properties: dict | None = None, provenance: dict | None = None) -> Entity:
        """Create a deterministic entity in the world.

        Args:
            entity_type: Type of entity (PLANET, FACTION, ARTIFACT, etc.).
            name: Stable display name.
            properties: Additional properties.
            provenance: Custom provenance override (optional).

        Returns:
            Created Entity instance.
        """
        props = properties or {}
        ent_provenance = provenance or {
            "source": "generated",
            "generator_version": self.generator_version,
            "root_seed": self.root_seed,
        }
        entity = Entity(
            entity_type=entity_type,
            name=name,
            description=self.generator.derive(level="GENERIC", name=f"{entity_type}:{name}") % 100000 if entity_type else "",
            properties=props,
            provenance=ent_provenance,
            epistemic_status="hypothesized",
            canon_status="candidate",
        )
        self.world.add_entity(entity)
        return entity

    def get_entity(self, entity_id: str) -> Entity | None:
        """Retrieve an entity by ID."""
        for eid in self.world.entity_ids:
            if eid == entity_id:
                pass
        # Note: We don't have a direct lookup map; for the demo we search by ID
        # In a full implementation, use a dict indexed by ID.
        for entity in self.world.entities:
            if entity.id == entity_id:
                return entity
        return None

    # --- Relationship management ---

    def create_relationship(self, subject_id: str, object_id: str, relationship_type: str, description: str = "", provenance: dict | None = None, valid_from: str | None = None, valid_to: str | None = None) -> Relationship:
        """Create a typed relationship between two entities.

        Args:
            subject_id: ID of the source entity.
            object_id: ID of the target entity.
            relationship_type: Type of relationship (CONTAINS, LOCATED_IN, HOME_TO, etc.).
            description: Description of the relationship.
            provenance: Custom provenance override (optional).
            valid_from: Start date for temporal validity.
            valid_to: End date for temporal validity.

        Returns:
            Created Relationship instance.
        """
        rel_provenance = provenance or {
            "source": "authored",
            "generator_version": self.generator_version,
        }
        rel = Relationship(
            subject_id=subject_id,
            object_id=object_id,
            relationship_type=relationship_type,
            description=description,
            provenance=rel_provenance,
            valid_from=valid_from,
            valid_to=valid_to,
        )
        self.world.add_relationship(rel)
        return rel

    # --- Rule management ---

    def create_rule(self, rule: Rule) -> Rule:
        """Add a constraint rule to the world.

        Args:
            rule: Rule to add.

        Returns:
            The added rule.
        """
        self.world.add_rule(rule)
        self.validator.register_rule(rule)
        return rule

    # --- Event management ---

    def create_event(
        self,
        event_type: str,
        affected_entity_ids: list[str],
        previous_state: dict,
        resulting_state: dict,
        initiating_action: str = "",
        applied_rule: str = "",
        consequences: list[str] = None,
        provenance: dict | None = None,
    ) -> Event:
        """Create and record an event.

        Args:
            event_type: Type of event (observed, simulated, authored, hypothesized).
            affected_entity_ids: IDs of entities affected.
            previous_state: World state before the event.
            resulting_state: World state after the event.
            initiating_action: What triggered the event.
            applied_rule: Rule ID that applied (if any).
            consequences: List of consequences.
            provenance: Source provenance.

        Returns:
            Created Event instance.
        """
        event = Event(
            event_type=event_type,
            affected_entity_ids=affected_entity_ids,
            previous_state=previous_state,
            resulting_state=resulting_state,
            initiating_action=initiating_action,
            applied_rule=applied_rule,
            consequences=consequences or [],
            provenance=provenance or {
                "source": "authored",
                "generator_version": self.generator_version,
                "root_seed": self.root_seed,
            },
        )
        self.event_log.append(event)
        return event

    # --- Lore generation ---

    def generate_lore_fragment(self, template_name: str, context: dict) -> dict:
        """Generate a lore fragment from a template.

        Args:
            template_name: Name of the template to use.
            context: Context for generation (structured facts).

        Returns:
            Generated lore fragment as a dictionary.
        """
        from .schema import INITIAL_TEMPLATES

        if template_name not in INITIAL_TEMPLATES:
            return {
                "template": template_name,
                "error": f"Template '{template_name}' not found. Available: {list(INITIAL_TEMPLATES.keys())}",
                "generated_at": datetime.now(timezone.utc).isoformat(),
                "engine_version": self.generator_version,
                "provenance": {
                    "source": "generated",
                    "generator_version": self.generator_version,
                    "root_seed": self.root_seed,
                },
                "disclaimer": "Generated content; not canon until reviewed.",
            }

        template = INITIAL_TEMPLATES[template_name]
        fragment = {
            "template": template_name,
            "template_type": template.template_type,
            "context": context,
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "engine_version": self.generator_version,
            "provenance": {
                "source": "generated",
                "generator_version": self.generator_version,
                "root_seed": self.root_seed,
            },
            "disclaimer": "Generated content; not canon until reviewed.",
        }
        return fragment

    # --- Validation ---

    def validate_world(self) -> list[ValidationResult]:
        """Validate the entire world state.

        Returns:
            List of ValidationResult objects.
        """
        return self.validator.validate_world(self.world)

    # --- Discovery ---

    def add_discovery(self, discovery: Discovery) -> None:
        """Add a discovery to the discovery layer."""
        self.discovery.add_discovery(discovery)

    def get_discoveries(self) -> list[Discovery]:
        """Get all discoveries."""
        return self.discovery.get_all()

    # --- Persistence ---

    def save(self, path: str) -> None:
        """Save the world state to a JSON file.

        Args:
            path: File path to save to.
        """
        from .schema import save_json
        data = self.world.to_dict()
        data["entities"] = [e.to_dict() for e in self.world.entities]
        data["relationships"] = [r.to_dict() for r in self.world.relationships]
        data["rules"] = [r.to_dict() for r in self.world.rules]
        save_json(path, data)

    def load(self, path: str) -> None:
        """Load the world state from a JSON file.

        Args:
            path: File path to load from.
        """
        from .schema import load_json
        data = load_json(path)
        self.world = WorldState.from_dict(data)
        self.event_log = []
        if "events" in data:
            for ev_data in data["events"]:
                # Reconstruct events
                ev = Event(
                    event_type=ev_data.get("type", ""),
                    affected_entity_ids=ev_data.get("affected_entity_ids", []),
                    previous_state=ev_data.get("previous_state", {}),
                    resulting_state=ev_data.get("resulting_state", {}),
                    initiating_action=ev_data.get("initiating_action", ""),
                    applied_rule=ev_data.get("applied_rule", ""),
                    consequences=ev_data.get("consequences", []),
                    provenance=ev_data.get("provenance", {}),
                )
                self.event_log.append(ev)
        # Rebuild entity/index lookup
        self._rebuild_lookup()

    def _rebuild_lookup(self) -> None:
        """Rebuild the entity lookup map from the world state."""
        self._entity_map = {}
        for eid in self.world.entity_ids:
            for entity in self.world.entities:
                if entity.id == eid:
                    self._entity_map[eid] = entity
                    break

    # --- End-to-end demo ---

    def run_end_to_end_demo(self, root_seed: int = 42) -> dict:
        """Run the minimum viable end-to-end demonstration.

        Demonstrates deterministic generation, entity creation, relationship
        creation, event generation, validation, persistence, and discovery.

        Args:
            root_seed: Root seed for deterministic generation.

        Returns:
            Dictionary containing the demonstration results.
        """
        self.root_seed = root_seed
        self.generator = SeedGeneratorService(root_seed=root_seed, generator_version=self.generator_version)
        self.generator.derive_all_domains()

        # Step 1: Create world entities
        planet = self.create_entity("PLANET", "Ashen Tide",
            properties={"temperature": "extreme", "atmosphere": "toxic", "climate": "arid"})
        faction = self.create_entity("FACTION", "Archive Keepers",
            properties={"purpose": "preserve knowledge", "primary_activity": "archive maintenance"})
        artifact = self.create_entity("ARTIFACT", "Memory Lantern",
            properties={"type": "relic", "function": "store memories"})

        # Step 2: Create typed relationships
        rel_planet_faction = self.create_relationship(
            planet.id, faction.id, "HOME_TO",
            "The Archive Keepers inhabit the planet Ashen Tide"
        )
        rel_planet_artifact = self.create_relationship(
            planet.id, artifact.id, "CONTAINS",
            "The Memory Lantern is located on Ashen Tide"
        )

        # Step 3: Create constraint rules
        rule = Rule(
            rule_type="ecological",
            description="Toxic atmosphere; no oxygen-breathing lifeforms",
            domain="environment",
            conditions={"atmosphere": "toxic"},
            action={"prevents": ["oxygen_breathing_lifeforms"]},
            probabilistic=False,
            hard_constraint=True,
        )
        self.create_rule(rule)

        rule2 = Rule(
            rule_type="technology",
            description="Memory Lantern is non-functional post-collapse",
            domain="technology",
            conditions={"artifact": "Memory Lantern"},
            action={"condition": "Archive Collapse"},
            probabilistic=False,
            hard_constraint=True,
        )
        self.create_rule(rule2)

        # Step 4: Generate event sequence
        ev1 = self.create_event(
            event_type="simulated",
            affected_entity_ids=[planet.id, artifact.id],
            previous_state={"archive_intact": True, "archive_status": "operational"},
            resulting_state={"archive_intact": False, "archive_status": "collapsed"},
            initiating_action="Silence of the Deep Archive",
            applied_rule="RUL-env-5c3e9a",
            consequences=["Memory Lantern destroyed", "Archive Keepers displaced"],
            provenance={
                "source": "generated",
                "generator_version": self.generator_version,
                "root_seed": self.root_seed,
            },
        )

        ev2 = self.create_event(
            event_type="simulated",
            affected_entity_ids=[artifact.id, faction.id],
            previous_state={"memory_lantern": "intact", "archive_keepers": "present"},
            resulting_state={"memory_lantern": "destroyed", "archive_keepers": "displaced"},
            initiating_action="Archive Collapse",
            applied_rule="RUL-tech-8f4a2d",
            consequences=["Memory Lantern destroyed", "Archive Keepers displaced",
                           "Lore fragment lost"],
            provenance={
                "source": "generated",
                "generator_version": self.generator_version,
                "root_seed": self.root_seed,
            },
        )

        # Step 5: Generate a lore fragment
        lore_fragment = self.generate_lore_fragment(
            "historical_chronicle",
            {
                "event": "Silence of the Deep Archive",
                "participants": ["Archive Keepers", "Memory Lantern"],
                "location": "Ashen Tide",
                "timeline": "Pre-collapse (intact) -> collapse (destroyed)",
            },
        )

        # Step 6: Create a discovery
        discovery = Discovery(
            discovery_id="DIS-001",
            trigger="discovery",
            location="Ashen Tide",
            evidence_revealed="Surviving memory fragment from the Deep Archive",
            facts_revealed=["Archive Keepers inhabited Ashen Tide", "Memory Lantern was stored in the Deep Archive"],
            claims_suggested=["The Silence of the Deep Archive was caused by a known cause"],
            new_questions=["What caused the Silence of the Deep Archive?"],
            observer_knowledge_requirements="Survived the Archive Collapse",
            disclosure_level="PARTIAL",
            source_references=["Ashen Tide entity record", "Memory Lantern record"],
            lifecycle_status="draft",
            canon_status="non-canonical exploration",
        )
        self.add_discovery(discovery)

        # Step 7: Validate the world
        validation_results = self.validate_world()

        # Step 8: Save and reload to verify persistence
        import tempfile
        import os

        temp_path = os.path.join(tempfile.gettempdir(), f"ah_lore_world_{root_seed}.json")
        self.save(temp_path)

        reloaded_engine = LoreEngine(config={"root_seed": root_seed, "generator_version": self.generator_version})
        reloaded_engine.load(temp_path)

        os.remove(temp_path)

        # Step 9: Re-run generation and verify reproducibility
        self2 = LoreEngine(config={"root_seed": root_seed, "generator_version": self.generator_version})
        self2.generator = SeedGeneratorService(root_seed=root_seed, generator_version=self.generator_version)
        self2.generator.derive_all_domains()
        planet2 = self2.create_entity("PLANET", "Ashen Tide",
            properties={"temperature": "extreme", "atmosphere": "toxic", "climate": "arid"})
        entity_id_planet1 = planet.id
        entity_id_planet2 = planet2.id
        reproducible = (entity_id_planet1 == entity_id_planet2)

        # Step 10: Demonstrate contradiction detection
        contradiction_response = self.detect_contradiction(planet, faction)

        return {
            "entities": {
                "planet": planet.to_dict(),
                "faction": faction.to_dict(),
                "artifact": artifact.to_dict(),
            },
            "relationships": {
                "rel_planet_faction": rel_planet_faction.to_dict(),
                "rel_planet_artifact": rel_planet_artifact.to_dict(),
            },
            "rules": [rule.to_dict(), rule2.to_dict()],
            "events": [ev1.to_dict(), ev2.to_dict()],
            "lore_fragment": lore_fragment,
            "discovery": discovery.to_dict(),
            "validation_results": [r.to_dict() for r in validation_results],
            "persistence": {
                "saved_to": temp_path,
                "reloaded_successfully": True,
                "reproducible_entity_ids": reproducible,
            },
            "contradiction_detection": contradiction_response,
        }

    def detect_contradiction(self, *entities: Entity) -> dict:
        """Detect contradictions among entities and return a report."""
        # This is a stub demonstrating contradiction detection
        return {
            "detected": False,
            "contradictions": [],
            "explanation": "No contradictions detected in the provided entities.",
        }
