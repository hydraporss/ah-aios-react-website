"""AH-AIOS Procedural Lore Engine — core package."""
from .engine import LoreEngine
from .generator import SeedGeneratorService, HierarchicalSeed
from .schema import (
    Entity, Relationship, Rule, Event, WorldState,
    validate_entity_id, validate_relationship_id, validate_event_id, validate_rule_id,
)
from .validator import ConstraintValidator, ValidationResult, ValidationCategory
from .discovery import Discovery, DiscoveryLayer, DiscoveryTrigger, RevelationLevel
from .theory_inventory import (
    TheoryInventory,
    load_theory_inventory,
    reconcile_inventory,
    validate_inventory,
    TheoryInventoryError,
    TheoryInventoryNotFound,
    TheoryRecord,
)

__all__ = [
    "LoreEngine",
    "SeedGeneratorService",
    "HierarchicalSeed",
    "Entity", "Relationship", "Rule", "Event", "WorldState",
    "validate_entity_id", "validate_relationship_id", "validate_event_id", "validate_rule_id",
    "ConstraintValidator", "ValidationResult", "ValidationCategory",
    "Discovery", "DiscoveryLayer", "DiscoveryTrigger", "RevelationLevel",
    "TheoryInventory",
    "load_theory_inventory",
    "reconcile_inventory",
    "validate_inventory",
    "TheoryInventoryError",
    "TheoryInventoryNotFound",
    "TheoryRecord",
]
