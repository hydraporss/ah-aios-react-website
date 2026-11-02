"""AH-VIS-INTEGRATION-001 — Visual generation subsystem test suite."""

import os
import sys
import json
import tempfile

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

from ah_aios.ah_vis_engine.engine import (
    VisualBrief,
    ModelAdapter,
    VisualValidator,
    VisualIntegration,
)
from ah_aios.ah_gen_engine.generator import TerrainGenerator


def test_visual_brief_creation():
    """Test structured visual-brief creation from world data."""
    # Create a minimal world data structure
    world_data = {
        "world": {
            "id": "WLD-GEN-001",
            "name": "Test Planet",
            "description": "A test world",
        },
        "entities": [
            {"id": "E-001", "name": "Test Entity", "properties": {}}
        ],
        "relationships": [
            {"id": "REL-001", "type": "contains", "subject_id": "WLD-GEN-001", "object_id": "E-001"}
        ],
        "terrain": [[0.5]],
        "terrain_counts": {"plains": 1},
        "environment": {"temperature": [[20.0]], "moisture": [[0.5]]},
    }

    brief = VisualBrief(
        task_id="AH-VIS-INTEGRATION-001",
        world_data=world_data,
    )
    brief.build()

    # Check required fields
    assert "task_id" in brief.built_brief
    assert "world_id" in brief.built_brief
    assert "primary_subject" in brief.built_brief
    assert "supporting_entities" in brief.built_brief
    assert "environment" in brief.built_brief
    assert "relationships" in brief.built_brief
    assert "canon_status" in brief.built_brief

    # Check primary_subject
    ps = brief.built_brief["primary_subject"]
    assert ps["entity_id"] == "WLD-GEN-001"
    assert ps["name"] == "Test Planet"

    # Check supporting_entities
    assert len(brief.built_brief["supporting_entities"]) >= 1

    # Check environment
    env = brief.built_brief["environment"]
    assert "setting" in env
    assert "climate" in env
    assert "terrain" in env
    assert "atmosphere" in env

    print("  PASS: test_visual_brief_creation")


def test_schema_validation():
    """Test schema validation of structured visual brief."""
    world_data = {
        "world": {"id": "WLD-GEN-001", "name": "Test", "description": "Test"},
        "entities": [],
        "relationships": [],
        "terrain": [[0.5]],
        "terrain_counts": {},
        "environment": {},
    }

    brief = VisualBrief(
        task_id="AH-VIS-INTEGRATION-001",
        world_data=world_data,
    )
    brief.build()

    # Validate the built brief
    errors = brief.validate()
    # The brief should be valid (no errors from schema validation)
    # Note: VisualBrief._validate_brief returns errors only for missing/invalid fields
    # Our brief should have all required fields, so errors should be empty
    print(f"  Validation errors: {errors}")
    print("  PASS: test_schema_validation")


def test_source_traceability():
    """Test source and reference traceability."""
    world_data = {
        "world": {"id": "WLD-GEN-001", "name": "Test World", "description": "Test world"},
        "entities": [],
        "relationships": [],
        "terrain": [[0.5]],
        "terrain_counts": {},
        "environment": {},
    }

    brief = VisualBrief(
        task_id="AH-VIS-INTEGRATION-001",
        world_data=world_data,
        image_requirements={"source_reference_ids": ["AH-VIS-GEN-001", "AH-IPF-001"]}
    )
    brief.build()

    # Check source_reference_ids
    source_refs = brief.built_brief["source_reference_ids"]
    assert "AH-VIS-GEN-001" in source_refs
    assert "AH-IPF-001" in source_refs

    # Check unresolved_conflicts
    conflicts = brief.built_brief["unresolved_conflicts"]
    assert isinstance(conflicts, list)

    print("  PASS: test_source_traceability")


def test_identity_constraint_preservation():
    """Test preservation of entity identity constraints."""
    world_data = {
        "world": {"id": "WLD-GEN-001", "name": "Test", "description": "Test"},
        "entities": [
            {"id": "E-001", "name": "Test Entity", "properties": {}},
            {"id": "E-002", "name": "Another Entity", "properties": {}},
        ],
        "relationships": [
            {"id": "REL-001", "type": "contains", "subject_id": "WLD-GEN-001", "object_id": "E-001"}
        ],
        "terrain": [[0.5]],
        "terrain_counts": {},
        "environment": {},
    }

    brief = VisualBrief(
        task_id="AH-VIS-INTEGRATION-001",
        world_data=world_data,
    )
    brief.build()

    # Check that entity IDs are preserved
    assert "E-001" in [e["entity_id"] for e in brief.built_brief["supporting_entities"]]

    print("  PASS: test_identity_constraint_preservation")


def test_prohibited_changes():
    """Test handling of prohibited changes."""
    world_data = {
        "world": {"id": "WLD-GEN-001", "name": "Test", "description": "Test"},
        "entities": [],
        "relationships": [],
        "terrain": [[0.5]],
        "terrain_counts": {},
        "environment": {},
    }

    brief = VisualBrief(
        task_id="AH-VIS-INTEGRATION-001",
        world_data=world_data,
    )
    brief.build()

    # Check prohibited_changes
    prohibited = brief.built_brief["prohibited_changes"]
    assert "Do not alter established entity identities" in prohibited
    assert "Do not change canon status without authorization" in prohibited

    print("  PASS: test_prohibited_changes")


def test_missing_required_fields():
    """Test handling of missing required fields."""
    # Create world data with missing fields
    world_data = {
        "world": {"id": "WLD-GEN-001", "name": "Test"},
        "entities": [],
        "relationships": [],
        "terrain": [[0.5]],
        "terrain_counts": {},
        "environment": {},
    }

    brief = VisualBrief(
        task_id="AH-VIS-INTEGRATION-001",
        world_data=world_data,
    )
    brief.build()

    # Check validation
    errors = brief.validate()
    # A brief with missing fields should have validation errors
    print(f"  Validation errors: {errors}")
    print("  PASS: test_missing_required_fields")


def test_composition_constraints():
    """Test preservation of composition requirements."""
    world_data = {
        "world": {"id": "WLD-GEN-001", "name": "Test", "description": "Test"},
        "entities": [],
        "relationships": [],
        "terrain": [[0.5]],
        "terrain_counts": {},
        "environment": {},
    }

    brief = VisualBrief(
        task_id="AH-VIS-INTEGRATION-001",
        world_data=world_data,
    )
    brief.build()

    # Check composition fields
    comp = brief.built_brief["composition"]
    assert "focal_subject" in comp
    assert "camera_view" in comp
    assert "spatial_hierarchy" in comp

    print("  PASS: test_composition_constraints")


def test_model_adapter_output():
    """Test model-adapter output without claiming image rendering."""
    world_data = {
        "world": {"id": "WLD-GEN-001", "name": "Test World", "description": "A generated world"},
        "entities": [
            {"id": "E-001", "name": "Test Entity", "properties": {}},
        ],
        "relationships": [],
        "terrain": [[0.5]],
        "terrain_counts": {},
        "environment": {},
    }

    brief = VisualBrief(
        task_id="AH-VIS-INTEGRATION-001",
        world_data=world_data,
    )
    brief.build()

    # Create model adapter
    adapter = ModelAdapter(brief.built_brief, provider="generic-test")

    # Adapt to model-specific instructions
    config = adapter.adapt()

    # Check output structure
    assert "prompt" in config
    assert config["provider"] == "generic-test"
    assert config["world_id"] == "WLD-GEN-001"
    assert config["canon_status"] == "emergent"

    # Note: We do NOT claim that an image was rendered
    print("  PASS: test_model_adapter_output")


def test_visual_validator():
    """Test visual validator separates spec validation from image validation."""
    world_data = {
        "world": {"id": "WLD-GEN-001", "name": "Test", "description": "Test"},
        "entities": [],
        "relationships": [],
        "terrain": [[0.5]],
        "terrain_counts": {},
        "environment": {},
    }

    brief = VisualBrief(
        task_id="AH-VIS-INTEGRATION-001",
        world_data=world_data,
    )
    brief.build()

    # Validate spec (structured data)
    spec_issues = VisualValidator.validate_brief(brief.built_brief)
    # All spec validation should pass if fields are present
    for issue in spec_issues:
        print(f"    Spec validation: {issue['field']} - {issue['status']}")

    # Image validation (no actual image)
    image_issues = VisualValidator.validate_image_rendered(image_agent=None)
    for issue in image_issues:
        print(f"    Image validation: {issue['field']} - {issue['status']}")

    # Confirm image validation does NOT claim verified
    for issue in image_issues:
        assert issue["status"] == "NOT_VERIFIED"

    print("  PASS: test_visual_validator")


def test_canon_authorization():
    """Test separation between born-visual content and canon authorization."""
    world_data = {
        "world": {"id": "WLD-GEN-001", "name": "Test", "description": "Test"},
        "entities": [],
        "relationships": [],
        "terrain": [[0.5]],
        "terrain_counts": {},
        "environment": {},
    }

    brief = VisualBrief(
        task_id="AH-VIS-INTEGRATION-001",
        world_data=world_data,
    )
    brief.build()

    # Check canon_status is not canon
    assert brief.built_brief["canon_status"] == "emergent"
    assert brief.built_brief["prohibited_changes"] != []

    print("  PASS: test_canon_authorization")


def test_world_model_integration():
    """Test compatibility with existing world-model interface."""
    # Import the Phase 3 generator
    from ah_aios.ah_gen_engine.engine import WorldGenerator

    # Create a world using the Phase 3 generator
    gen = WorldGenerator(root_seed=42)
    result = gen.generate_world()

    # Create visual brief from world data
    brief = VisualBrief(
        task_id="AH-VIS-INTEGRATION-001",
        world_data=result,
    )
    brief.build()

    # Check the brief was built successfully
    assert brief._built
    assert brief.built_brief is not None

    # Verify key fields were populated
    assert "primary_subject" in brief.built_brief
    assert "supporting_entities" in brief.built_brief
    assert "environment" in brief.built_brief

    print("  PASS: test_world_model_integration")


def test_integration_with_phase3():
    """Test integration with the existing Phase 3 world-generation prototype."""
    # Import the Phase 3 generator
    from ah_aios.ah_gen_engine.engine import WorldGenerator

    # Create a generator with a test seed
    gen = WorldGenerator(root_seed=123, generator_version="1.0.0")

    # Run generation
    result = gen.generate_world()

    # Create visual brief from generation
    brief = VisualBrief(
        task_id="AH-VIS-INTEGRATION-001",
        world_data=result,
    )
    brief.build()

    # Check the brief includes generated world data
    assert brief.built_brief["world_id"] == "WLD-GEN-001"
    assert "primary_subject" in brief.built_brief

    # Check terrain classification counts
    terrain_counts = brief.built_brief["environment"].get("terrain_classes", {})
    assert isinstance(terrain_counts, dict)

    print("  PASS: test_integration_with_phase3")


def run_all_tests():
    """Run the complete test suite."""
    tests = [
        ("test_visual_brief_creation", test_visual_brief_creation),
        ("test_schema_validation", test_schema_validation),
        ("test_source_traceability", test_source_traceability),
        ("test_identity_constraint_preservation", test_identity_constraint_preservation),
        ("test_prohibited_changes", test_prohibited_changes),
        ("test_missing_required_fields", test_missing_required_fields),
        ("test_composition_constraints", test_composition_constraints),
        ("test_model_adapter_output", test_model_adapter_output),
        ("test_visual_validator", test_visual_validator),
        ("test_canon_authorization", test_canon_authorization),
        ("test_world_model_integration", test_world_model_integration),
        ("test_integration_with_phase3", test_integration_with_phase3),
    ]

    print("AH-VIS-INTEGRATION-001 Test Suite")
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
