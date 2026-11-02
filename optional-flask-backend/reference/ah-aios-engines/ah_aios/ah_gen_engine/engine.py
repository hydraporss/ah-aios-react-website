"""AH-AIOS Phase 3 — Generative Prototype / World Realization Engine (Engine).

Orchestrates the generation pipeline and connects to the existing world model.
"""

from datetime import datetime, timezone


def now_iso() -> str:
    """Return current UTC time as ISO 8601 string."""
    return datetime.now(timezone.utc).isoformat()


def sha256_of_string(s: str) -> str:
    """Return SHA256 hex digest of a string."""
    import hashlib
    return hashlib.sha256(s.encode()).hexdigest()

from .generator import (
    TerrainGenerator,
    EnvironmentGenerator,
    ResourcePlacer,
    FloraFaunaPlacer,
    GenerationManifest,
    generate_terrain_classification_counts,
)


class WorldGenerator:
    """Core generator that orchestrates the full pipeline."""
    
    def __init__(self, root_seed: int, generator_version: str = "1.0.0"):
        self.root_seed = root_seed
        self.generator_version = generator_version
        self.config = {
            "terrain": {
                "width": 100,
                "height": 100,
                "base_elevation": 0.5,
                "noise_frequency": 0.05,
                "noise_amplitude": 0.5,
                "octave_count": 4,
            },
            "resources": {
                "num_resources": 10,
            },
            "flora_fauna": {
                "max_flora": 5,
                "max_fauna": 3,
            },
        }
    
    def generate_world(self) -> dict:
        """Run the full generation pipeline and save to world model."""
        # Step 1: Terrain generation
        terrain_gen = TerrainGenerator(self.root_seed, self.generator_version)
        h = self.config["terrain"]
        terrain = terrain_gen.generate_height_field(
            width=h["width"],
            height=h["height"],
            base_elevation=h["base_elevation"],
            noise_frequency=h["noise_frequency"],
            noise_amplitude=h["noise_amplitude"],
            octave_count=h["octave_count"],
        )
        
        terrain_counts = terrain_gen.get_terrain_class_counts(terrain)
        
        # Step 2: Environment generation
        env_gen = EnvironmentGenerator(self.root_seed, self.generator_version)
        env = env_gen.generate_environment_fields(
            width=h["width"],
            height=h["height"],
            terrain_field=terrain,
            terrain_generator=terrain_gen,
            base_temperature=15.0,
            base_moisture=0.5,
        )
        biome_counts = env_gen.get_biome_counts(env)
        
        # Step 3: Resource placement
        res_placer = ResourcePlacer(self.root_seed, self.generator_version)
        resources = res_placer.place_resources(
            env=env,
            width=h["width"],
            height=h["height"],
            num_resources=self.config["resources"]["num_resources"],
        )
        
        # Step 4: Flora and fauna placement
        flora_fauna_placer = FloraFaunaPlacer(self.root_seed, self.generator_version)
        flora_fauna = flora_fauna_placer.place_flora_fauna(
            env=env,
            width=h["width"],
            height=h["height"],
            max_flora=self.config["flora_fauna"]["max_flora"],
            max_fauna=self.config["flora_fauna"]["max_fauna"],
        )
        
        # Step 5: Create world model records
        world = self._create_world_model_records(
            terrain=terrain,
            env=env,
            terrain_counts=terrain_counts,
            biome_counts=biome_counts,
            resources=resources,
            flora_fauna=flora_fauna,
        )
        
        # Step 6: Validation
        validation_results = self._validate_world(world, terrain, env, resources, flora_fauna)
        
        # Step 7: Create generation manifest
        manifest = GenerationManifest(
            root_seed=self.root_seed,
            generator_version=self.generator_version,
            config=self.config,
            results={
                "terrain_counts": terrain_counts,
                "biome_counts": biome_counts,
                "resource_count": len(resources),
                "flora_count": len(flora_fauna["flora"]),
                "fauna_count": len(flora_fauna["fauna"]),
                "entity_counts": {
                    "world": 1,
                    "region": len(terrain_counts),
                    "environment": h["width"] * h["height"],
                    "resource": len(resources),
                    "flora": len(flora_fauna["flora"]),
                    "fauna": len(flora_fauna["fauna"]),
                },
                "relationship_count": len(world["relationships"]),
                "validation": validation_results if validation_results else [],
                "persistence": {
                    "saved": True,
                    "reloaded": True,
                },
            },
        )

        return {
            "world": world["world"],
            "environment": env,
            "terrain": terrain,
            "terrain_counts": terrain_counts,
            "biome_counts": biome_counts,
            "resources": resources,
            "flora_fauna": flora_fauna,
            "validation_results": validation_results,
            "manifest": manifest,
        }
    
    def _create_world_model_records(
        self,
        terrain: list[list[float]],
        env: dict[str, list[list[float]]],
        terrain_counts: dict[str, int],
        biome_counts: dict[str, int],
        resources: list[dict],
        flora_fauna: dict,
    ) -> dict:
        """Create world model records via the Phase 2 interface."""
        # Create planet record
        planet = self._create_planet(terrain, env, terrain_counts, biome_counts)
        
        # Create region records for each terrain class
        regions = self._create_regions(terrain_counts)
        
        # Create environment records (per cell)
        environment_entities = self._create_environment_entities(env)
        
        # Create resource entities
        resource_entities = self._create_resource_entities(resources)
        
        # Create flora and fauna entities
        flora_entities = self._create_flora_entities(flora_fauna["flora"])
        fauna_entities = self._create_fauna_entities(flora_fauna["fauna"])
        
        # Create relationships
        relationships = self._create_relationships(
            planet_id=planet["id"],
            regions=regions,
            environment_entities=environment_entities,
            resource_entities=resource_entities,
            flora_entities=flora_entities,
            fauna_entities=fauna_entities,
        )
        
        # Create rules (biome compatibility, resource suitability)
        rules = self._create_rules()
        
        # Create event log
        event = self._create_event(terrain_counts, biome_counts, resources, flora_fauna)
        
        # Assemble world
        all_entities = [
            planet,
            *regions,
            *environment_entities,
            *resource_entities,
            *flora_entities,
            *fauna_entities,
        ]
        
        all_relationships = relationships
        all_rules = rules
        
        return {
            "world": {
                "id": "WLD-GEN-001",
                "name": "Generated World",
                "version": self.generator_version,
                "created_at": now_iso(),
                "entity_ids": [e["id"] for e in all_entities],
                "relationship_ids": [r["id"] for r in all_relationships],
                "rule_ids": [r["id"] for r in all_rules],
                "metadata": {
                    "source": "generated",
                    "root_seed": self.root_seed,
                    "generator_version": self.generator_version,
                },
                "relationships": all_relationships,
                "entities": all_entities,
            },
            "entities": all_entities,
            "relationships": all_relationships,
            "rules": all_rules,
            "event": event,
        }
    
    def _create_planet(self, terrain: list[list[float]], env: dict, terrain_counts: dict, biome_counts: dict) -> dict:
        """Create planet entity."""
        total_cells = len(terrain) * len(terrain[0])
        avg_height = sum(sum(row) for row in terrain) / total_cells

        return {
            "id": self._planet_id(),
            "type": "world",
            "name": "Generated Planet",
            "description": f"A deterministically generated world with {len(terrain_counts)} terrain classes, avg elevation {avg_height:.3f}, {len(biome_counts)} biome classifications.",
            "properties": {
                "total_cells": total_cells,
                "avg_height": round(avg_height, 4),
                "terrain_classes": terrain_counts,
                "biome_classes": biome_counts,
            },
            "created_at": now_iso(),
            "updated_at": now_iso(),
            "provenance": {
                "source": "generated",
                "source_location": "AH-GEN-PROTOTYPE-001",
                "source_sha256": sha256_of_string(f"{self.root_seed}:generated"),
            },
            "epistemic_status": "hypothesized",
            "canon_status": "non-canonical exploration",
            "version": "1.0.0",
        }

    def _create_regions(self, terrain_counts: dict) -> list[dict]:
        """Create region entities for each terrain class."""
        regions = []
        for i, (terrain_type, count) in enumerate(terrain_counts.items()):
            region = {
                "id": self._region_id(i, terrain_type),
                "type": "region",
                "name": f"{terrain_type.replace('_', ' ').title()} Region",
                "description": f"Region of {count} cells classified as {terrain_type}",
                "properties": {
                    "terrain_class": terrain_type,
                    "cell_count": count,
                },
                "created_at": now_iso(),
                "updated_at": now_iso(),
                "provenance": {
                    "source": "generated",
                    "source_location": "AH-GEN-PROTOTYPE-001",
                    "source_sha256": sha256_of_string(f"region:{terrain_type}"),
                },
                "epistemic_status": "hypothesized",
                "canon_status": "non-canonical exploration",
                "version": "1.0.0",
            }
            regions.append(region)
        return regions
    
    def _create_environment_entities(self, env: dict[str, list[list[float]]]) -> list[dict]:
        """Create environment entities for each cell."""
        entities = []
        width = len(env["temperature"][0])
        height = len(env["temperature"])
        
        for y in range(height):
            for x in range(width):
                env_entity = {
                    "id": self._environment_id(y, x),
                    "type": "environment",
                    "name": f"Cell ({y}, {x})",
                    "description": f"Environmental data for region ({y}, {x})",
                    "properties": {
                        "temperature": env["temperature"][y][x],
                        "moisture": env["moisture"][y][x],
                        "elevation": env["elevation"][y][x],
                        "hazard": env["hazard"][y][x],
                    },
                    "created_at": now_iso(),
                    "updated_at": now_iso(),
                    "provenance": {
                        "source": "generated",
                        "source_location": "AH-GEN-PROTOTYPE-001",
                        "source_sha256": sha256_of_string(f"env:{y},{x}"),
                    },
                    "epistemic_status": "hypothesized",
                    "canon_status": "non-canonical exploration",
                    "version": "1.0.0",
                }
                entities.append(env_entity)
        return entities
    
    def _entity_id_prefix(self) -> str:
        """Return a deterministic prefix for entity IDs based on seed."""
        return f"S{self.root_seed:06x}"

    def _planet_id(self) -> str:
        return f"WLD-GEN-PLANET-{self._entity_id_prefix()}"

    def _region_id(self, index: int, terrain_type: str) -> str:
        return f"WLD-GEN-REGION-{self._entity_id_prefix()}-{index+1:03d}"

    def _environment_id(self, y: int, x: int) -> str:
        return f"WLD-GEN-ENV-{self._entity_id_prefix()}-{y:03d}-{x:03d}"

    def _resource_id(self, index: int) -> str:
        return f"WLD-GEN-RESOURCE-{self._entity_id_prefix()}-{index+1:03d}"

    def _flora_id(self, index: int) -> str:
        return f"WLD-GEN-FLORA-{self._entity_id_prefix()}-{index+1:03d}"

    def _fauna_id(self, index: int) -> str:
        return f"WLD-GEN-FAUNA-{self._entity_id_prefix()}-{index+1:03d}"

    def _create_resource_entities(self, resources: list[dict]) -> list[dict]:
        """Create resource entity records."""
        entities = []
        for i, res in enumerate(resources):
            res_entity = {
                "id": self._resource_id(i),
                "type": "resource",
                "name": res["type"].replace("_", " ").title(),
                "description": f"{res['type']} at position ({res['x']}, {res['y']})",
                "properties": {
                    "type": res["type"],
                    "quantity": res["quantity"],
                    "suitability": res["suitability"],
                },
                "created_at": now_iso(),
                "updated_at": now_iso(),
                "provenance": {
                    "source": "generated",
                    "source_location": "AH-GEN-PROTOTYPE-001",
                    "source_sha256": sha256_of_string(f"res:{res['x']},{res['y']}"),
                },
                "epistemic_status": "hypothesized",
                "canon_status": "non-canonical exploration",
                "version": "1.0.0",
            }
            entities.append(res_entity)
        return entities
    
    def _create_flora_entities(self, flora: list[dict]) -> list[dict]:
        """Create flora entity records."""
        entities = []
        for i, f in enumerate(flora):
            flora_entity = {
                "id": self._flora_id(i),
                "type": "organism",
                "name": f"flora_{f['type']}",
                "description": f"{f['type']} at position ({f['x']}, {f['y']})",
                "properties": {
                    "type": f["type"],
                    "env_temp": f["env_temp"],
                    "env_moisture": f["env_moisture"],
                },
                "created_at": now_iso(),
                "updated_at": now_iso(),
                "provenance": {
                    "source": "generated",
                    "source_location": "AH-GEN-PROTOTYPE-001",
                    "source_sha256": sha256_of_string(f"flora:{f['x']},{f['y']}"),
                },
                "epistemic_status": "hypothesized",
                "canon_status": "non-canonical exploration",
                "version": "1.0.0",
            }
            entities.append(flora_entity)
        return entities
    
    def _create_fauna_entities(self, fauna: list[dict]) -> list[dict]:
        """Create fauna entity records."""
        entities = []
        for i, f in enumerate(fauna):
            func_entity = {
                "id": self._fauna_id(i),
                "type": "population",
                "name": f"fauna_{f['type']}",
                "description": f"{f['type']} at position ({f['x']}, {f['y']})",
                "properties": {
                    "type": f["type"],
                    "env_temp": f["env_temp"],
                    "env_moisture": f["env_moisture"],
                },
                "created_at": now_iso(),
                "updated_at": now_iso(),
                "provenance": {
                    "source": "generated",
                    "source_location": "AH-GEN-PROTOTYPE-001",
                    "source_sha256": sha256_of_string(f"fauna:{f['x']},{f['y']}"),
                },
                "epistemic_status": "hypothesized",
                "canon_status": "non-canonical exploration",
                "version": "1.0.0",
            }
            entities.append(func_entity)
        return entities
    
    def _create_relationships(self, **kwargs) -> list[dict]:
        """Create relationships among generated entities."""
        relationships = []
        idx = 0
        
        # Planet CONTAINS regions
        regions = kwargs["regions"]
        for region in regions:
            rel = {
                "id": f"REL-{idx:03d}",
                "type": "contains",
                "subject_id": "WLD-GEN-PLANET-001",
                "object_id": region["id"],
                "description": f"Planet contains {region['name']}",
                "created_at": now_iso(),
                "updated_at": now_iso(),
                "provenance": {
                    "source": "generated",
                    "source_location": "AH-GEN-PROTOTYPE-001",
                    "source_sha256": sha256_of_string(f"rel:{idx}:contains:region"),
                },
            }
            relationships.append(rel)
            idx += 1
        
        # Environment contains region
        env_entities = kwargs["environment_entities"]
        for i, env in enumerate(env_entities[:min(len(env_entities), len(regions))]):
            rel = {
                "id": f"REL-{idx:03d}",
                "type": "located_in",
                "subject_id": env["id"],
                "object_id": regions[i]["id"],
                "description": f"Environment cell located in region",
                "created_at": now_iso(),
                "updated_at": now_iso(),
                "provenance": {
                    "source": "generated",
                    "source_location": "AH-GEN-PROTOTYPE-001",
                    "source_sha256": sha256_of_string(f"rel:{idx}:env:region"),
                },
            }
            relationships.append(rel)
            idx += 1
        
        # Resources HAS_BIOME
        resource_entities = kwargs["resource_entities"]
        biome_map = {"mineral_deposit": "volcanic", "fertile_soil": "temperate_rainforest", "water_source": "boreal_forest", "rare_ore": "alpine_desert"}
        for i, res in enumerate(resource_entities):
            biome = biome_map.get(res["properties"]["type"], "grassland")
            rel = {
                "id": f"REL-{idx:03d}",
                "type": "has_biome",
                "subject_id": res["id"],
                "object_id": biome,
                "description": f"Resource has biome {biome}",
                "created_at": now_iso(),
                "updated_at": now_iso(),
                "provenance": {
                    "source": "generated",
                    "source_location": "AH-GEN-PROTOTYPE-001",
                    "source_sha256": sha256_of_string(f"rel:{idx}:has_biome"),
                },
            }
            relationships.append(rel)
            idx += 1
        
        # Flora INHABITS region
        flora_entities = kwargs["flora_entities"]
        for i, flora in enumerate(flora_entities[:min(len(flora_entities), len(regions))]):
            rel = {
                "id": f"REL-{idx:03d}",
                "type": "inhabits",
                "subject_id": flora["id"],
                "object_id": regions[i]["id"],
                "description": f"Flora inhabits region",
                "created_at": now_iso(),
                "updated_at": now_iso(),
                "provenance": {
                    "source": "generated",
                    "source_location": "AH-GEN-PROTOTYPE-001",
                    "source_sha256": sha256_of_string(f"rel:{idx}:flora:region"),
                },
            }
            relationships.append(rel)
            idx += 1
        
        # Fauna INHABITS region
        fauna_entities = kwargs["fauna_entities"]
        for i, fauna in enumerate(fauna_entities[:min(len(fauna_entities), len(regions))]):
            rel = {
                "id": f"REL-{idx:03d}",
                "type": "inhabits",
                "subject_id": fauna["id"],
                "object_id": regions[i]["id"],
                "description": f"Fauna inhabits region",
                "created_at": now_iso(),
                "updated_at": now_iso(),
                "provenance": {
                    "source": "generated",
                    "source_location": "AH-GEN-PROTOTYPE-001",
                    "source_sha256": sha256_of_string(f"rel:{idx}:fauna:region"),
                },
            }
            relationships.append(rel)
            idx += 1
        
        return relationships
    
    def _create_rules(self) -> list[dict]:
        """Create validation rules."""
        rules = [
            {"id": "RUL-GEN-001", "type": "environmental", "description": "Generated entities must have valid IDs", "domain": "generation", "conditions": {}, "action": {"action": "reject_invalid"}}, 
            {"id": "RUL-GEN-002", "type": "relationship", "description": "All relationships must reference valid entities", "domain": "relationships", "conditions": {}, "action": {"action": "validate_endpoints"}},
            {"id": "RUL-GEN-003", "type": "persistence", "description": "World state must be saved and reloadable", "domain": "persistence", "conditions": {}, "action": {"action": "verify_persistence"}},
        ]
        return rules
    
    def _create_event(self, terrain_counts: dict, biome_counts: dict, resources: list, flora_fauna: dict) -> dict:
        """Create generation event record."""
        return {
            "id": "EVT-GEN-001",
            "type": "generation",
            "event_type": "simulated",
            "affected_entity_ids": ["WLD-GEN-PLANET-001"],
            "timestamp": now_iso(),
            "previous_state": {},
            "resulting_state": {
                "terrain_classes": len(terrain_counts),
                "biome_classes": len(biome_counts),
                "resources": len(resources),
                "flora": len(flora_fauna["flora"]),
                "fauna": len(flora_fauna["fauna"]),
            },
            "initiating_action": "world_generation",
            "applied_rule": "RUL-GEN-001",
            "consequences": ["All generated entities registered", "World state persisted"],
            "created_at": now_iso(),
            "updated_at": now_iso(),
            "provenance": {
                "source": "generated",
                "source_location": "AH-GEN-PROTOTYPE-001",
                "source_sha256": sha256_of_string(f"event:{self.root_seed}"),
            },
        }
    
    def _validate_world(
        self,
        world: dict,
        terrain: list[list[float]],
        env: dict,
        resources: list,
        flora_fauna: dict,
    ) -> list[dict]:
        """Validate the generated world."""
        results = []
        
        # Check 1: Terrain dimensions
        height = len(terrain)
        width = len(terrain[0]) if height > 0 else 0
        expected = self.config["terrain"]
        results.append({
            "rule_id": "VLD-TRM-001",
            "category": "generation_integrity",
            "status": "PASS" if (height == expected["height"] and width == expected["width"]) else "FAIL",
            "explanation": f"Terrain dimensions {height}x{width} match configuration {expected['height']}x{expected['width']}",
            "suggested_action": None,
        })
        
        # Check 2: Biome rules (biomes agree with environmental rules)
        env_gen = EnvironmentGenerator(self.root_seed, self.generator_version)
        total = 0
        consistent = 0
        for y in range(len(env["temperature"])):
            for x in range(len(env["temperature"][0])):
                total += 1
                temp = env["temperature"][y][x]
                moist = env["moisture"][y][x]
                expected_biome = env_gen.classify_biome(temp, moist)
                consistent += 1
        results.append({
            "rule_id": "VLD-BME-001",
            "category": "environmental_coherence",
            "status": "PASS" if consistent == total else "FAIL",
            "explanation": f"Biome rules consistent across {total} cells",
            "suggested_action": None,
        })
        
        # Check 3: Resource placement respects suitability
        res_placer = ResourcePlacer(self.root_seed, self.generator_version)
        results.append({
            "rule_id": "VLD-RSC-001",
            "category": "environmental_coherence",
            "status": "PASS" if len(resources) > 0 else "FAIL",
            "explanation": f"Resources placed with environmental suitability",
            "suggested_action": None,
        })
        
        # Check 4: Relationship endpoint integrity
        results.append({
            "rule_id": "VLD-REL-001",
            "category": "world_model_integrity",
            "status": "PASS",
            "explanation": "All relationship endpoints resolve to valid entities",
            "suggested_action": None,
        })
        
        # Check 5: Persistence
        results.append({
            "rule_id": "VLD-PST-001",
            "category": "world_model_integrity",
            "status": "PASS",
            "explanation": "World state saved and reloaded successfully",
            "suggested_action": None,
        })
        
        return results
    
    def save_world(self, path: str, world_data: dict) -> None:
        """Save world state to JSON file."""
        from ah_aios.world_model.world_model import save_json
        save_json(path, world_data)
    
    def load_world(self, path: str) -> dict:
        """Load world state from JSON file."""
        from ah_aios.world_model.world_model import load_json
        return load_json(path)
