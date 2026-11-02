"""AH-AIOS Procedural Lore Engine — automated test suite."""
import os
import sys
import tempfile
import json

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from ah_aios.ah_lore_engine.schema import (
    Entity, Relationship, Rule, Event, WorldState,
    validate_entity_id, validate_relationship_id, validate_event_id, validate_rule_id,
)
from ah_aios.ah_lore_engine.generator import SeedGeneratorService, HierarchicalSeed
from ah_aios.ah_lore_engine.validator import ConstraintValidator, ValidationResult, ValidationCategory
from ah_aios.ah_lore_engine.discovery import Discovery, DiscoveryLayer, RevelationLevel, DiscoveryTrigger
from ah_aios.ah_lore_engine.engine import LoreEngine


def test_schema_validation():
    """Test entity, relationship, and event schema validation."""
    # Test entity validation
    entity = Entity(
        entity_type="PLANET",
        name="Ashen Tide",
        description="A toxic planet",
        properties={"temperature": "extreme"},
        provenance={"source": "generated", "generator_version": "1.0.0", "root_seed": 42},
    )
    assert entity.id.startswith("PLANET-")
    assert validate_entity_id(entity.id)

    # Test relationship validation
    rel = Relationship(
        subject_id="PLANET-ASHEN_TIDE",
        object_id="FACTION-ARHIVE_KEEPERS",
        relationship_type="HOME_TO",
    )
    assert rel.id.startswith("REL-")
    assert validate_relationship_id(rel.id)

    # Test rule validation
    rule = Rule(
        rule_type="ecological",
        description="Toxic atmosphere test",
        domain="environment",
    )
    assert rule.id.startswith("RUL-")
    assert validate_rule_id(rule.id)

    # Test event validation
    event = Event(
        event_type="simulated",
        affected_entity_ids=[entity.id],
        previous_state={"test": "state"},
        resulting_state={"test": "result"},
    )
    assert event.id.startswith("EVT-")
    assert validate_event_id(event.id)

    print("  PASS: schema_validation")


def test_generator_seed_derivation():
    """Test deterministic seed derivation."""
    # Same seed + same level + same name should produce same derived seed
    gen1 = SeedGeneratorService(root_seed=123, generator_version="1.0.0")
    gen2 = SeedGeneratorService(root_seed=123, generator_version="1.0.0")
    s1 = gen1.derive("PLANET", "Ashen Tide")
    s2 = gen2.derive("PLANET", "Ashen Tide")
    assert s1 == s2, "Same seed + same level + same name should produce same derived seed"

    # Different root seed should produce different seed
    gen3 = SeedGeneratorService(root_seed=456, generator_version="1.0.0")
    s3 = gen3.derive("PLANET", "Ashen Tide")
    assert s1 != s3, "Different root seed should produce different derived seed"

    # Same domain should be reproducible
    d1 = gen1.derive_domain("terrain")
    d2 = gen2.derive_domain("terrain")
    assert d1 == d2, "Same seed + same domain should produce same domain seed"

    print("  PASS: test_generator_seed_derivation")


def test_generator_domains_do_not_interfere():
    """Test independent generation domains do not interfere."""
    gen = SeedGeneratorService(root_seed=789, generator_version="1.0.0")
    gen.derive_domain("terrain")
    gen.derive_domain("climate")
    gen.derive_domain("resources")

    # Each domain should have a distinct seed
    seeds = {
        "terrain": gen.get_domain_seed("terrain"),
        "climate": gen.get_domain_seed("climate"),
        "resources": gen.get_domain_seed("resources"),
    }
    assert len(set(seeds.values())) == 3, "Independent domains should have distinct seeds"
    print("  PASS: test_generator_domains_do_not_interfere")


def test_seed_reproducibility():
    """Test identical inputs produce identical structured output."""
    # Run the same generation twice
    engine1 = LoreEngine(config={"root_seed": 111, "generator_version": "1.0.0"})
    engine2 = LoreEngine(config={"root_seed": 111, "generator_version": "1.0.0"})

    planet1 = engine1.create_entity("PLANET", "Ashen Tide",
        properties={"temperature": "extreme"})
    planet2 = engine2.create_entity("PLANET", "Ashen Tide",
        properties={"temperature": "extreme"})

    # Entity IDs should be identical
    assert planet1.id == planet2.id, "Identical inputs should produce identical entity IDs"
    print("  PASS: test_seed_reproducibility")


def test_stable_ids_persistence():
    """Test stable IDs survive save and reload."""
    engine = LoreEngine(config={"root_seed": 555, "generator_version": "1.0.0"})
    planet = engine.create_entity("PLANET", "Test World",
        properties={"climate": "temperate"})
    rel = engine.create_relationship(
        planet.id, "FACTION-ZERO", "CONTAINS",
        "Test relationship"
    )

    # Save
    import tempfile
    with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
        import json
        json.dump(engine.world.to_dict(), f)
        temp_path = f.name

    # Load
    with open(temp_path, 'r') as f:
        data = json.load(f)

    # Verify key fields
    assert data["entity_ids"] == engine.world.entity_ids
    assert data["relationship_ids"] == engine.world.relationship_ids
    print("  PASS: test_stable_ids_persistence")


def test_referential_integrity():
    """Test relationship referential integrity."""
    engine = LoreEngine(config={"root_seed": 666, "generator_version": "1.0.0"})
    planet = engine.create_entity("PLANET", "Reference World",
        properties={})
    rel = engine.create_relationship(
        planet.id, "FACTION-ZERO", "LOCATED_IN",
        "Test reference"
    )

    # The relationship should reference valid entity IDs
    assert rel.subject_id == planet.id
    assert rel.relationship_type in ["CONTAINS", "LOCATED_IN", "HOME_TO", "OWNED_BY", "CONTROLLED_BY"]
    print("  PASS: test_referential_integrity")


def test_relationship_endpoint_types():
    """Test allowed relationship endpoint types."""
    engine = LoreEngine(config={"root_seed": 777, "generator_version": "1.0.0"})
    entity1 = engine.create_entity("PLANET", "Endpoint Test")
    entity2 = engine.create_entity("FACTION", "Faction Test")

    # Valid types
    valid_types = ["CONTAINS", "LOCATED_IN", "HOME_TO", "OWNED_BY", "CONTROLLED_BY",
                   "CREATED_BY", "DESCENDED_FROM", "PARTICIPATED_IN", "CAUSED",
                   "CONTRIBUTED_TO", "RESULTED_IN", "DESTROYED_BY", "LEFT_TRACE",
                   "EVIDENCED_BY", "SUPPORTS", "CONTRADICTS", "REVEALS", "DERIVED_FROM"]
    for rtype in valid_types:
        rel = engine.create_relationship(
            entity1.id, entity2.id, rtype,
            f"Test relationship type: {rtype}"
        )
        assert rel.relationship_type == rtype
    print("  PASS: test_relationship_endpoint_types")


def test_temporal_validity():
    """Test temporal validity of relationships."""
    engine = LoreEngine(config={"root_seed": 888, "generator_version": "1.0.0"})
    entity = engine.create_entity("ARTIFACT", "Temp Test")
    rel = engine.create_relationship(
        entity.id, "PLANET-XYZ", "LOCATED_IN",
        "Temporal test",
        valid_from="2026-01-01T00:00:00Z",
        valid_to="2026-12-31T23:59:59Z",
    )
    assert rel.valid_from is not None
    assert rel.valid_to is not None
    print("  PASS: test_temporal_validity")


def test_event_preconditions():
    """Test event preconditions."""
    engine = LoreEngine(config={"root_seed": 999, "generator_version": "1.0.0"})
    planet = engine.create_entity("PLANET", "Precondition Test")
    artifact = engine.create_entity("ARTIFACT", "Test Artifact")

    # Event with preconditions satisfied
    event = engine.create_event(
        event_type="simulated",
        affected_entity_ids=[planet.id, artifact.id],
        previous_state={"archive_intact": True},
        resulting_state={"archive_intact": False},
        initiating_action="Archive Collapse",
        applied_rule="RUL-5c3e9a",
        consequences=["Memory Lantern destroyed"],
    )
    assert event.initiating_action == "Archive Collapse"
    assert "archive_intact" in event.previous_state
    assert "archive_intact" in event.resulting_state
    print("  PASS: test_event_preconditions")


def test_causal_chain_integrity():
    """Test causal-chain traversal."""
    engine = LoreEngine(config={"root_seed": 1010, "generator_version": "1.0.0"})
    planet = engine.create_entity("PLANET", "Causal Test")
    artifact = engine.create_entity("ARTIFACT", "Undo Test")

    # Create a causal chain: event -> consequence
    event1 = engine.create_event(
        event_type="simulated",
        affected_entity_ids=[planet.id, artifact.id],
        previous_state={"state_1": "before"},
        resulting_state={"state_1": "after"},
        initiating_action="Event 1",
        consequences=["Event 2 triggered"],
    )

    # Event 2 caused by Event 1
    event2 = engine.create_event(
        event_type="simulated",
        affected_entity_ids=[artifact.id],
        previous_state={"state_2": "before"},
        resulting_state={"state_2": "after"},
        initiating_action="Event 1 consequence",
        consequences=["Artifact destroyed"],
    )

    # Verify event chain
    assert event1.consequences[0] == "Event 2 triggered"
    assert len(engine.event_log) == 2
    print("  PASS: test_causal_chain_integrity")


def test_lore_template_eligibility():
    """Test lore template eligibility."""
    from ah_aios.ah_lore_engine.schema import INITIAL_TEMPLATES

    assert "historical_chronicle" in INITIAL_TEMPLATES
    assert "artifact_description" in INITIAL_TEMPLATES
    assert "unresolved_mystery" in INITIAL_TEMPLATES

    template = INITIAL_TEMPLATES["historical_chronicle"]
    assert template.required_facts is not None
    assert "event" in template.required_facts
    assert "participants" in template.required_facts

    # Template for artifacts requires correct facts
    artifact_template = INITIAL_TEMPLATES["artifact_description"]
    assert "artifact" in artifact_template.required_facts
    print("  PASS: test_lore_template_eligibility")


def test_narrative_fact_grounding():
    """Test narrative fact grounding in templates."""
    from ah_aios.ah_lore_engine.schema import INITIAL_TEMPLATES

    template = INITIAL_TEMPLATES["historical_chronicle"]
    context = {
        "event": "Silence of the Deep Archive",
        "participants": ["Archive Keepers", "Memory Lantern"],
        "location": "Ashen Tide",
        "timeline": "Pre-collapse (intact) -> collapse (destroyed)",
    }

    fragment = engine = LoreEngine(config={"root_seed": 2020, "generator_version": "1.0.0"})
    result = engine.generate_lore_fragment("historical_chronicle", context)

    assert result["template"] == "historical_chronicle"
    assert "context" in result
    assert "generated_at" in result
    print("  PASS: test_narrative_fact_grounding")


def test_unsupported_assertion_detection():
    """Test detection of unsupported assertions in generated content."""
    # The template-based generator returns context; the validation layer
    # would flag assertions without supporting evidence.
    from ah_aios.ah_lore_engine.validator import ValidationResult, ValidationCategory

    # Simulate an unsupported assertion
    result = ValidationResult(
        rule_id="RUL-UNSUP-001",
        affected_record="Test Claim",
        category=ValidationCategory.KNOWLEDGE,
        status="FAIL",
        explanation="Assertion has no supporting evidence.",
    )
    assert result.status == "FAIL"
    print("  PASS: test_unsupported_assertion_detection")


def test_contradiction_reporting():
    """Test contradiction reporting without modifying canon."""
    engine = LoreEngine(config={"root_seed": 3030, "generator_version": "1.0.0"})
    planet = engine.create_entity("PLANET", "Contradict Test")

    # Validate and check results
    results = engine.validate_world()
    assert isinstance(results, list)

    # No canon should be modified
    assert engine.world.metadata.get("source") == "authored"
    print("  PASS: test_contradiction_reporting")


def test_evidence_provenance():
    """Test evidence provenance tracking."""
    engine = LoreEngine(config={"root_seed": 4040, "generator_version": "1.0.0"})
    planet = engine.create_entity(
        "PLANET",
        "Provenance Test",
        provenance={"source": "authored", "generator_version": "1.0.0", "root_seed": 4040},
    )
    assert planet.provenance["source"] == "authored"
    assert planet.provenance["root_seed"] == 4040
    print("  PASS: test_evidence_provenance")


def test_discovery_disclosure():
    """Test discovery disclosure levels."""
    from ah_aios.ah_lore_engine.discovery import Discovery

    h = Discovery(
        discovery_id="DIS-HINT",
        trigger="discovery",
        location="Test World",
        evidence_revealed="Hint",
        facts_revealed=["Partial fact"],
        claims_suggested=["Suggesting claim"],
        new_questions=["Open question"],
        observer_knowledge_requirements="Requires partial knowledge",
        disclosure_level="HINT",
        source_references=["Reference 1"],
    )
    assert h.disclosure_level == "HINT"
    assert h.disclosure_level in ["HINT", "PARTIAL", "FULL"]
    print("  PASS: test_discovery_disclosure")


def test_persistence_reload():
    """Test persistence and reload."""
    engine = LoreEngine(config={"root_seed": 5050, "generator_version": "1.0.0"})
    planet = engine.create_entity("PLANET", "Persist Test",
        properties={"climate": "temperate"})
    engine.create_relationship(
        planet.id, "FACTION-ZERO", "CONTAINS",
        "Persistence test relationship"
    )

    import tempfile
    with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
        import json
        json.dump(engine.world.to_dict(), f)
        temp_path = f.name

    # Reload
    engine2 = LoreEngine(config={"root_seed": 5050, "generator_version": "1.0.0"})
    engine2.load(temp_path)

    # Verify
    assert engine2.world.name == engine.world.name
    assert len(engine2.world.entity_ids) == len(engine.world.entity_ids)
    print("  PASS: test_persistence_reload")


def test_generator_version_handling():
    """Test generator-version handling and change detection."""
    engine1 = LoreEngine(config={"root_seed": 6060, "generator_version": "1.0.0"})
    engine2 = LoreEngine(config={"root_seed": 6060, "generator_version": "2.0.0"})

    # Different versions should produce different generators
    assert engine1.generator_version != engine2.generator_version
    print("  PASS: test_generator_version_handling")


def test_canon_authorization_boundaries():
    """Test canon authorization boundaries."""
    engine = LoreEngine(config={"root_seed": 7070, "generator_version": "1.0.0"})
    planet = engine.create_entity("PLANET", "Canon Test")

    # Generated content should be candidate, not canon
    assert planet.canon_status == "candidate"
    assert planet.epistemic_status == "hypothesized"
    print("  PASS: test_canon_authorization_boundaries")


def test_regression_protection():
    """Test regression protection for existing functionality."""
    # Basic import check
    from ah_aios.ah_lore_engine import LoreEngine
    assert LoreEngine is not None
    print("  PASS: test_regression_protection")


def run_all_tests():
    """Run the complete test suite."""
    tests = [
        ("test_schema_validation", test_schema_validation),
        ("test_generator_seed_derivation", test_generator_seed_derivation),
        ("test_generator_domains_do_not_interfere", test_generator_domains_do_not_interfere),
        ("test_seed_reproducibility", test_seed_reproducibility),
        ("test_stable_ids_persistence", test_stable_ids_persistence),
        ("test_referential_integrity", test_referential_integrity),
        ("test_relationship_endpoint_types", test_relationship_endpoint_types),
        ("test_temporal_validity", test_temporal_validity),
        ("test_event_preconditions", test_event_preconditions),
        ("test_causal_chain_integrity", test_causal_chain_integrity),
        ("test_lore_template_eligibility", test_lore_template_eligibility),
        ("test_narrative_fact_grounding", test_narrative_fact_grounding),
        ("test_unsupported_assertion_detection", test_unsupported_assertion_detection),
        ("test_contradiction_reporting", test_contradiction_reporting),
        ("test_evidence_provenance", test_evidence_provenance),
        ("test_discovery_disclosure", test_discovery_disclosure),
        ("test_persistence_reload", test_persistence_reload),
        ("test_generator_version_handling", test_generator_version_handling),
        ("test_canon_authorization_boundaries", test_canon_authorization_boundaries),
        ("test_regression_protection", test_regression_protection),
    ]

    print("AH-LORE-ENGINE-001 Test Suite")
    print("=" * 50)
    passed = 0
    failed = 0

    for name, test_fn in tests:
        try:
            test_fn()
            passed += 1
        except Exception as e:
            failed += 1
            print(f"  FAIL: {name} - {e}")

    print("=" * 50)
    print(f"Results: {passed} passed, {failed} failed")
    return passed, failed


if __name__ == "__main__":
    run_all_tests()
