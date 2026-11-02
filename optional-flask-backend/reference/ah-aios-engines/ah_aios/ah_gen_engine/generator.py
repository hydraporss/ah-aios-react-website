"""AH-AIOS Phase 3 — Generative Prototype / World Realization Engine.

Generates a small, coherent, reproducible world containing terrain, biomes,
resources, flora, fauna, and relationships, connected to the existing world
model (Phase 2).

Pipeline: SEED -> PLANET PARAMETERS -> TERRAIN -> ENVIRONMENT -> BIOMES ->
           FEATURES -> ENTITY PLACEMENT -> RELATIONSHIPS -> VALIDATION -> PERSISTENCE
"""

import hashlib
import math
import random
from typing import Any

from ah_aios.world_model.world_model import (
    create_entity,
    create_relationship,
    create_rule,
    create_event,
    create_world,
    validate_entity,
    validate_relationship,
    validate_rule,
    validate_event,
    ENTITY_TYPES,
    RELATIONSHIP_TYPES,
    EPHEMISTIC_STATUSES,
    CANON_STATUSES,
    EVENT_TYPES,
    now_iso,
    sha256_of_string,
    validate_entity_id,
)

# --- Deterministic pseudo-random generator ---
# Uses SHA-256-based seed derivation (reused from Phase 2 lore engine).

def derive_seed(root_seed: int, generator_version: str, level: str, name: str = "") -> int:
    """Derive a deterministic seed for a generation domain."""
    key = f"{level}:{name}" if name else level
    hash_input = f"{root_seed}:{generator_version}:{key}"
    return int(hashlib.sha256(hash_input.encode()).hexdigest()[:16], 16)


class FracNoise:
    """Fractional Brownian motion noise generator (value noise with fractal brownian motion)."""
    
    def __init__(self, seed: int):
        self.seed = seed
        self.rng = random.Random(seed)
    
    def _smooth_noise(self, x: int) -> float:
        """Smooth interpolation of random noise at integer coordinate."""
        x = x & 0xFFFFFFFF  # Wrap to positive 32-bit
        a = self.rng.random()
        b = self.rng.random()
        v = (1.0 - math.cos(math.pi * x / 256.0)) * 0.5
        return a * (1 - v) + b * v
    
    def _fbm(self, x: float, y: float, octaves: int, freq: float, amplitude: float) -> float:
        """Fractional Brownian motion over 2D coordinates."""
        result = 0.0
        amplitude_factor = 1.0
        frequency = freq
        for _ in range(octaves):
            result += self._smooth_noise(int(x * frequency) & 0xFFFFFFFF) * amplitude_factor
            result += self._smooth_noise(int(y * frequency) & 0xFFFFFFFF) * amplitude_factor
            amplitude_factor *= 0.5
            frequency *= 2.0
        return result


class TerrainGenerator:
    """Deterministic noise-based terrain generator."""
    
    def __init__(self, root_seed: int, generator_version: str = "1.0.0"):
        self.root_seed = root_seed
        self.generator_version = generator_version
        self.seed = derive_seed(root_seed, generator_version, "terrain", "parameters")
        self.rng = random.Random(self.seed)
    
    def generate_height_field(
        self,
        width: int,
        height: int,
        base_elevation: float = 0.5,
        noise_frequency: float = 0.05,
        noise_amplitude: float = 0.5,
        octave_count: int = 4,
    ) -> list[list[float]]:
        """Generate a 2D terrain height field with configurable parameters."""
        noise = FracNoise(self.seed)
        
        height_field = []
        for y in range(height):
            row = []
            for x in range(width):
                # Combine noise into height value (0.0-1.0 range)
                noise_val = noise._fbm(x, y, octave_count, noise_frequency, noise_amplitude)
                # Scale to [0, 1]
                height_val = (noise_val + 1.0) / 2.0
                # Apply base elevation
                height_val = height_val * noise_amplitude + base_elevation * (1 - noise_amplitude)
                # Clamp to [0, 1]
                height_val = max(0.0, min(1.0, height_val))
                row.append(height_val)
            height_field.append(row)
        return height_field
    
    def classify_terrain(self, height: float, base_elevation: float = 0.5) -> str:
        """Classify terrain based on elevation thresholds."""
        # Use configurable thresholds relative to base elevation
        low_threshold = base_elevation - 0.25
        high_threshold = base_elevation + 0.25
        
        if height < low_threshold:
            return "depression" if height < base_elevation - 0.15 else "plains_low"
        elif height < base_elevation:
            return "plains"
        elif height < high_threshold:
            return "highlands"
        else:
            return "mountains"
    
    def get_terrain_class_counts(self, height_field: list[list[float]]) -> dict[str, int]:
        """Count terrain classes in the height field."""
        counts = {}
        for row in height_field:
            for height in row:
                cls = self.classify_terrain(height)
                counts[cls] = counts.get(cls, 0) + 1
        return counts


class EnvironmentGenerator:
    """Environment and climate field generator."""
    
    def __init__(self, root_seed: int, generator_version: str = "1.0.0"):
        self.root_seed = root_seed
        self.generator_version = generator_version
        self.seed = derive_seed(root_seed, generator_version, "environment", "parameters")
        self.rng = random.Random(self.seed)
    
    def generate_environment_fields(
        self,
        width: int,
        height: int,
        terrain_field: list[list[float]],
        terrain_generator: TerrainGenerator,
        base_temperature: float = 15.0,
        base_moisture: float = 0.5,
        temp_amplitude: float = 10.0,
        moisture_amplitude: float = 0.3,
    ) -> dict[str, list[list[float]]]:
        """Generate environment fields (temperature, moisture, elevation, hazard)."""
        env = {
            "temperature": [[0.0] * width for _ in range(height)],
            "moisture": [[0.0] * width for _ in range(height)],
            "elevation": [[0.0] * width for _ in range(height)],
            "hazard": [[0.0] * width for _ in range(height)],
        }
        
        noise = FracNoise(self.seed)
        base_elevation = 0.5
        
        for y in range(height):
            for x in range(width):
                h = terrain_field[y][x]
                # Temperature: heated by elevation
                temp = base_temperature + h * temp_amplitude
                # Moisture: inverse of temperature
                moisture = 1.0 - h * moisture_amplitude
                # Hazard: based on terrain type
                terrain = terrain_generator.classify_terrain(h, base_elevation)
                if terrain in ("mountains", "depression"):
                    hazard = 0.7
                elif terrain == "highlands":
                    hazard = 0.4
                elif terrain == "basin":
                    hazard = 0.3
                else:
                    hazard = 0.1
                # Add noise
                temp += (noise._smooth_noise(x + 100) - 0.5) * 2.0
                moisture += (noise._smooth_noise(x + 200) - 0.5) * 0.1
                hazard += (noise._smooth_noise(x + 300) - 0.5) * 0.1
                # Clamp
                temp = max(-50.0, min(60.0, temp))
                moisture = max(0.0, min(1.0, moisture))
                hazard = max(0.0, min(1.0, hazard))
                
                env["temperature"][y][x] = round(temp, 2)
                env["moisture"][y][x] = round(moisture, 2)
                env["elevation"][y][x] = round(h, 4)
                env["hazard"][y][x] = round(hazard, 2)
        
        return env
    
    def classify_biome(self, temperature: float, moisture: float) -> str:
        """Classify biome from temperature and moisture.
        Temperature in Celsius, moisture as 0.0-1.0.
        """
        if temperature < 0:
            if moisture < 0.2:
                return "tundra"
            else:
                return "boreal_forest"
        elif temperature <= 15:
            if moisture < 0.2:
                return "temperate_desert"
            elif moisture < 0.5:
                return "grassland"
            else:
                return "temperate_rainforest"
        elif temperature < 25:
            if moisture < 0.3:
                return "arid"
            elif moisture < 0.7:
                return "savanna"
            else:
                return "tropical_rainforest"
        else:
            if moisture < 0.2:
                return "volcanic"
            elif moisture < 0.5:
                return "alpine_desert"
            else:
                return "alpine_meadow"
    
    def get_biome_counts(self, env: dict[str, list[list[float]]]) -> dict[str, int]:
        """Count biome classifications."""
        counts = {}
        width = len(env["temperature"][0])
        height = len(env["temperature"])
        
        for y in range(height):
            for x in range(width):
                temp = env["temperature"][y][x]
                moist = env["moisture"][y][x]
                biome = self.classify_biome(temp, moist)
                counts[biome] = counts.get(biome, 0) + 1
        
        return counts


class ResourcePlacer:
    """Resource placement with environmental suitability."""
    
    def __init__(self, root_seed: int, generator_version: str = "1.0.0"):
        self.root_seed = root_seed
        self.generator_version = generator_version
        self.seed = derive_seed(root_seed, generator_version, "resources", "placement")
        self.rng = random.Random(self.seed)
    
    def place_resources(
        self,
        env: dict[str, list[list[float]]],
        width: int,
        height: int,
        num_resources: int = 5,
    ) -> list[dict]:
        """Place resources based on environmental suitability."""
        resources = []
        candidates = []
        
        # Find suitable locations based on environmental conditions
        for y in range(height):
            for x in range(width):
                temp = env["temperature"][y][x]
                moist = env["moisture"][y][x]
                
                # Resource suitability: needs moderate temperature and moisture
                temperature_suitability = 1.0 - abs(temp - 20.0) / 40.0  # Optimal at 20C
                moisture_suitability = 1.0 - abs(moist - 0.5) / 0.5  # Optimal at 0.5
                suitability = temperature_suitability * 0.5 + moisture_suitability * 0.5
                
                if suitability > 0.3:
                    candidates.append((x, y, suitability))
        
        # Sort by suitability and place resources
        candidates.sort(key=lambda c: c[2], reverse=True)
        placed = 0
        for x, y, suitability in candidates:
            if placed >= num_resources:
                break
            # Check for duplicate locations
            if all(r["x"] != x or r["y"] != y for r in resources):
                res_type = self._get_resource_type(suitability)
                resources.append({
                    "x": x,
                    "y": y,
                    "type": res_type,
                    "suitability": round(suitability, 3),
                    "quantity": round(suitability * 100, 1),
                })
                placed += 1
        
        return resources
    
    def _get_resource_type(self, suitability: float) -> str:
        """Determine resource type based on suitability."""
        if suitability > 0.7:
            return "mineral_deposit"
        elif suitability > 0.5:
            return "fertile_soil"
        elif suitability > 0.3:
            return "water_source"
        else:
            return "rare_ore"


class FloraFaunaPlacer:
    """Flora and fauna placement system."""
    
    def __init__(self, root_seed: int, generator_version: str = "1.0.0"):
        self.root_seed = root_seed
        self.generator_version = generator_version
        self.seed = derive_seed(root_seed, generator_version, "flora_fauna", "placement")
        self.rng = random.Random(self.seed)
        
        # Minimal flora candidates
        self.flora_candidates = [
            {"name": "desert_cactus", "tolerance": {"temp": [0, 50], "moisture": [0.0, 0.3]}},
            {"name": "grass", "tolerance": {"temp": [-10, 35], "moisture": [0.2, 1.0]}},
            {"name": "pine_tree", "tolerance": {"temp": [-20, 20], "moisture": [0.3, 1.0]}},
            {"name": "flowering_plant", "tolerance": {"temp": [10, 30], "moisture": [0.3, 1.0]}},
        ]
        
        # Minimal fauna candidates
        self.fauna_candidates = [
            {"name": "lizard", "tolerance": {"temp": [10, 45], "moisture": [0.0, 0.3]}},
            {"name": "rodent", "tolerance": {"temp": [-10, 35], "moisture": [0.2, 0.8]}},
            {"name": "bird", "tolerance": {"temp": [-10, 40], "moisture": [0.1, 1.0]}},
            {"name": "insect", "tolerance": {"temp": [5, 40], "moisture": [0.1, 0.9]}},
        ]
    
    def place_flora_fauna(
        self,
        env: dict[str, list[list[float]]],
        width: int,
        height: int,
        max_flora: int = 5,
        max_fauna: int = 3,
    ) -> dict:
        """Place flora and fauna based on environmental tolerance."""
        placements = {"flora": [], "fauna": []}
        
        # Flatten environment for iteration
        flat_env = []
        for y in range(height):
            for x in range(width):
                flat_env.append((x, y, env["temperature"][y][x], env["moisture"][y][x]))
        
        # Shuffle for randomness within deterministic seed
        rng = random.Random(self.seed + 42)
        rng.shuffle(flat_env)
        
        # Place flora and fauna
        for x, y, temp, moist in flat_env:
            if len(placements["flora"]) < max_flora:
                for flora in self.flora_candidates:
                    t_min, t_max = flora["tolerance"]["temp"]
                    m_min, m_max = flora["tolerance"]["moisture"]
                    if t_min <= temp <= t_max and m_min <= moist <= m_max:
                        placements["flora"].append({
                            "x": x, "y": y,
                            "type": flora["name"],
                            "env_temp": round(temp, 2),
                            "env_moisture": round(moist, 2),
                        })
                        break
            
            if len(placements["fauna"]) < max_fauna:
                for fauna in self.fauna_candidates:
                    t_min, t_max = fauna["tolerance"]["temp"]
                    m_min, m_max = fauna["tolerance"]["moisture"]
                    if t_min <= temp <= t_max and m_min <= moist <= m_max:
                        placements["fauna"].append({
                            "x": x, "y": y,
                            "type": fauna["name"],
                            "env_temp": round(temp, 2),
                            "env_moisture": round(moist, 2),
                        })
                        break
        
        return placements


class GenerationManifest:
    """Machine-readable generation manifest."""
    
    def __init__(self, root_seed: int, generator_version: str, config: dict, results: dict):
        self.root_seed = root_seed
        self.generator_version = generator_version
        self.config = config
        self.results = results
    
    def to_dict(self) -> dict:
        """Serialize manifest to dictionary."""
        return {
            "manifest_version": "1.0.0",
            "root_seed": self.root_seed,
            "generator_version": self.generator_version,
            "config": self.config,
            "results": self.results,
        }
    
    def save(self, path: str) -> None:
        """Save manifest to JSON file."""
        from ah_aios.world_model.world_model import save_json
        save_json(path, self.to_dict())


def generate_terrain_classification_counts(
    height_field: list[list[float]],
    base_elevation: float = 0.5,
) -> dict[str, int]:
    """Count terrain classes."""
    counts = {}
    for row in height_field:
        for h in row:
            # Classify
            if h < base_elevation - 0.25:
                cls = "depression"
            elif h < base_elevation:
                cls = "plains"
            elif h < base_elevation + 0.25:
                cls = "highlands"
            else:
                cls = "mountains"
            counts[cls] = counts.get(cls, 0) + 1
    return counts
