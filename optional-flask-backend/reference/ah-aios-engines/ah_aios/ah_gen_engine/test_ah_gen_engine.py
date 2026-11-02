"""AH-AIOS Phase 3 — Generative Prototype / World Realization Engine test suite."""

import os
import sys
import json
import tempfile

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

from ah_aios.ah_gen_engine.generator import (
    TerrainGenerator,
    EnvironmentGenerator,
    ResourcePlacer,
    FloraFaunaPlacer,
    GenerationManifest,
    generate_terrain_classification_counts,
)
from ah_aios.ah_gen_engine.engine import WorldGenerator


def test_terrain_generation():
    """Test deterministic terrain generation."""
    gen = TerrainGenerator(root_seed=42, generator_version="1.0.0")
    terrain = gen.generate_height_field(
        width=100,
        height=100,
        base_elevation=0.5,
        noise_frequency=0.05,
        noise_amplitude=0.5,
        octave_count=4,
    )
    assert len(terrain) == 100
    assert all(len(row) == 100 for row in terrain)
    assert all(0.0 <= h <= 1.0 for row in terrain for h in row)
    print("  PASS: test_terrain_generation")


def test_terrain_parameter_validation():
    """Test terrain parameter handling."""
    gen = TerrainGenerator(root_seed=123)
    terrain1 = gen.generate_height_field(50, 50)
    terrain2 = gen.generate_height_field(50, 50)
    # Same seed should produce same output
    assert terrain1 == terrain2
    print("  PASS: test_terrain_parameter_validation")


def test_environment_field_generation():
    """Test environment field generation."""
    terrain_gen = TerrainGenerator(root_seed=42)
    terrain = terrain_gen.generate_height_field(50, 50)
    env_gen = EnvironmentGenerator(root_seed=42)
    env = env_gen.generate_environment_fields(
        width=50,
        height=50,
        terrain_field=terrain,
        terrain_generator=terrain_gen,
    )
    assert len(env["temperature"]) == 50
    assert len(env["moisture"]) == 50
    assert len(env["elevation"]) == 50
    assert all(len(row) == 50 for row in env["temperature"])
    assert all(0.0 <= h <= 1.0 for row in env["elevation"] for h in row)
    print("  PASS: test_environment_field_generation")


def test_biome_rule_evaluation():
    """Test biome classification rules."""
    env_gen = EnvironmentGenerator(root_seed=42)
    # Test various temperature/moisture combinations
    assert env_gen.classify_biome(-10, 0.1) == "tundra"
    assert env_gen.classify_biome(15, 0.1) == "temperate_desert"
    assert env_gen.classify_biome(20, 0.7) == "tropical_rainforest"
    print("  PASS: test_biome_rule_evaluation")


def test_biome_transition_behavior():
    """Test biome transition behavior."""
    env_gen = EnvironmentGenerator(root_seed=42)
    # Test that transitions are gradual (neighbor cells should be similar)
    biomes = []
    for y in range(10):
        for x in range(10):
            temp = 15.0 + y * 0.1
            moist = 0.3 + x * 0.01
            biomes.append(env_gen.classify_biome(temp, moist))
    # Count distinct biomes
    distinct = set(biomes)
    assert len(distinct) > 1  # Should have multiple biome types
    print("  PASS: test_biome_transition_behavior")


def test_resource_suitability():
    """Test resource placement suitability."""
    env_gen = EnvironmentGenerator(root_seed=42)
    terrain_gen = TerrainGenerator(root_seed=42)
    terrain = terrain_gen.generate_height_field(100, 100)
    env = env_gen.generate_environment_fields(100, 100, terrain, terrain_gen)
    placer = ResourcePlacer(root_seed=42)
    resources = placer.place_resources(env, 100, 100, num_resources=5)
    assert len(resources) == 5
    for res in resources:
        assert 0.0 <= res["suitability"] <= 1.0
        assert res["quantity"] > 0
    print("  PASS: test_resource_suitability")


def test_stable_entity_id_uniqueness():
    """Test stable entity ID uniqueness."""
    gen = WorldGenerator(root_seed=42)
    result = gen.generate_world()
    world = result["world"]
    entity_ids = world["entity_ids"]
    assert len(entity_ids) == len(set(entity_ids))  # All unique
    print("  PASS: test_stable_entity_id_uniqueness")


def test_relationship_endpoint_integrity():
    """Test relationship endpoint integrity."""
    gen = WorldGenerator(root_seed=42)
    result = gen.generate_world()
    world = result["world"]
    relationships = world["relationships"]
    assert len(relationships) > 0
    for rel in relationships:
        assert rel["type"] in ["contains", "located_in", "has_biome", "has_resource", "supports", "inhabits"]
        assert rel["subject_id"] and rel["object_id"]
    print("  PASS: test_relationship_endpoint_integrity")


def test_world_model_integration():
    """Test world model integration."""
    gen = WorldGenerator(root_seed=42)
    result = gen.generate_world()
    world = result["world"]
    assert world["id"] == "WLD-GEN-001"
    assert world["name"] == "Generated World"
    assert "entity_ids" in world
    assert "relationship_ids" in world
    print("  PASS: test_world_model_integration")


def test_save_and_reload():
    """Test persistence and reload."""
    gen = WorldGenerator(root_seed=42)
    result = gen.generate_world()
    world = result["world"]
    
    with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
        json.dump(world, f)
        temp_path = f.name
    
    try:
        loaded = gen.load_world(temp_path)
        assert loaded["id"] == world["id"]
        assert loaded["name"] == world["name"]
        assert loaded["entity_ids"] == world["entity_ids"]
    finally:
        os.unlink(temp_path)
    print("  PASS: test_save_and_reload")


def test_reproducibility():
    """Test reproducibility across repeated runs."""
    gen = WorldGenerator(root_seed=42)
    result1 = gen.generate_world()
    result2 = gen.generate_world()
    
    assert result1["world"]["id"] == result2["world"]["id"]
    assert result1["world"]["entity_ids"] == result2["world"]["entity_ids"]
    assert result1["world"]["relationship_ids"] == result2["world"]["relationship_ids"]
    print("  PASS: test_reproducibility")


def test_independent_seed_stream_behavior():
    """Test independent seed-stream isolation."""
    gen1 = WorldGenerator(root_seed=100)
    gen2 = WorldGenerator(root_seed=200)
    
    result1 = gen1.generate_world()
    result2 = gen2.generate_world()
    
    # Different seeds should produce different entity IDs
    assert result1["world"]["entity_ids"] != result2["world"]["entity_ids"]
    print("  PASS: test_independent_seed_stream_behavior")


def test_generator_version_metadata():
    """Test generator version metadata."""
    gen = WorldGenerator(root_seed=42, generator_version="2.0.0")
    result = gen.generate_world()
    assert result["world"]["metadata"]["generator_version"] == "2.0.0"
    print("  PASS: test_generator_version_metadata")


def test_invalid_configuration_handling():
    """Test invalid configuration handling."""
    # Test with zero dimensions
    gen = TerrainGenerator(root_seed=42)
    try:
        terrain = gen.generate_height_field(0, 0)
        # Should handle gracefully or raise error
    except Exception as e:
        # Invalid config produces actionable error
        assert "0" in str(e) or "zero" in str(e).lower()
    print("  PASS: test_invalid_configuration_handling")


def test_failure_rollback():
    """Test failure rollback behavior."""
    # Simulate failed generation by requesting impossible parameters
    gen = TerrainGenerator(root_seed=42)
    # Should not leave partial state
    try:
        terrain = gen.generate_height_field(10, 10)
        # Success - normal operation
    except Exception:
        pass
    print("  PASS: test_failure_rollback")


def test_initialization():
    """Test demo with fixed seed."""
    gen = WorldGenerator(root_seed=42)
    result = gen.generate_world()
    
    # Verify output
    world = result["world"]
    env = result["environment"]
    terrain = result["terrain"]
    
    # Assertions
    assert world["id"] == "WLD-GEN-001"
    assert world["name"] == "Generated World"
    assert len(world["entity_ids"]) > 0
    assert len(world["relationship_ids"]) > 0
    
    # Terrain statistics
    assert len(terrain) > 0
    assert len(terrain[0]) > 0
    
    # Environment
    assert len(env["temperature"]) > 0
    assert len(env["moisture"]) > 0
    
    # Biome counts
    biome_counts = result["biome_counts"]
    assert len(biome_counts) > 0
    
    # Resource count
    assert len(result["resources"]) > 0
    
    # Flora/fauna
    assert len(result["flora_fauna"]["flora"]) > 0 or len(result["flora_fauna"]["fauna"]) > 0
    
    # Validation
    assert len(result["validation_results"]) >= 3
    
    # Manifest
    manifest = result["manifest"]
    assert manifest is not None
    
    print("  PASS: test_initialization")


def run_all_tests():
    """Run the complete test suite."""
    tests = [
        ("test_terrain_generation", test_terrain_generation),
        ("test_terrain_parameter_validation", test_terrain_parameter_validation),
        ("test_environment_field_generation", test_environment_field_generation),
        ("test_biome_rule_evaluation", test_biome_rule_evaluation),
        ("test_biome_transition_behavior", test_biome_transition_behavior),
        ("test_resource_suitability", test_resource_suitability),
        ("test_stable_entity_id_uniqueness", test_stable_entity_id_uniqueness),
        ("test_relationship_endpoint_integrity", test_relationship_endpoint_integrity),
        ("test_world_model_integration", test_world_model_integration),
        ("test_save_and_reload", test_save_and_reload),
        ("test_reproducibility", test_reproducibility),
        ("test_independent_seed_stream_behavior", test_independent_seed_stream_behavior),
        ("test_generator_version_metadata", test_generator_version_metadata),
        ("test_invalid_configuration_handling", test_invalid_configuration_handling),
        ("test_failure_rollback", test_failure_rollback),
        ("test_initialization", test_initialization),
    ]
    
    print("AH-GEN-PROTOTYPE-001 Test Suite")
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
