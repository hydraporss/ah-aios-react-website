"""AH-AIOS Procedural Lore Engine — deterministic generation service.

Hierarchical seed derivation for UNIVERSE -> GALAXY -> SYSTEM -> PLANET ->
REGION -> ENTITY -> EVENT -> DISCOVERY. Independent generation domains that do
not interfere with each other.
"""

import hashlib
from typing import Any


# Independent generation domains
GENERATIVE_DOMAINS = [
    "terrain", "climate", "resources", "flora", "fauna",
    "factions", "civilizations", "technology", "history",
    "ruins", "artifacts", "encounters", "lore_discoveries",
]


class HierarchicalSeed:
    """Hierarchical seed derivation for deterministic generation."""

    def __init__(self, root_seed: int, generator_version: str = "1.0.0"):
        self.root_seed = root_seed
        self.generator_version = generator_version
        self.derived = {}

    def derive(self, level: str, name: str = "") -> int:
        """Derive a seed for a specific generation level.

        Args:
            level: Hierarchy level (UNIVERSE, GALAXY, SYSTEM, PLANET, REGION).
            name: Name or identifier at this level.

        Returns:
            Deterministic seed integer.
        """
        key = f"{level}:{name}"
        hash_input = f"{self.root_seed}:{self.generator_version}:{key}"
        return int(hashlib.sha256(hash_input.encode()).hexdigest()[:16], 16)

    def derive_domain(self, domain: str) -> int:
        """Derive a seed for a generative domain (terrain, climate, etc.)."""
        key = f"domain:{domain}"
        return self.derive("GENERIC", key)


def derive_seed(domain: str, level: str, name: str, root_seed: int, generator_version: str) -> int:
    """Derive a seed for a specific generation domain and level."""
    seed_service = SeedGeneratorService(root_seed=root_seed, generator_version=generator_version)
    return seed_service.derive(level, name) if level else seed_service.derive_domain(domain)


class SeedGeneratorService:
    """Service for deterministic seed derivation and generation."""

    def __init__(self, root_seed: int, generator_version: str = "1.0.0"):
        self.root_seed = root_seed
        self.generator_version = generator_version
        self.derived = {}

    def derive(self, level: str, name: str = "") -> int:
        """Derive a seed for a specific generation level.

        Args:
            level: Hierarchy level (UNIVERSE, GALAXY, SYSTEM, PLANET, REGION).
            name: Name or identifier at this level.

        Returns:
            Deterministic seed integer.
        """
        key = f"{level}:{name}"
        hash_input = f"{self.root_seed}:{self.generator_version}:{key}"
        seed = int(hashlib.sha256(hash_input.encode()).hexdigest()[:16], 16)
        self.derived[key] = seed
        return seed

    def derive_domain(self, domain: str) -> int:
        """Derive a seed for a generative domain."""
        key = f"domain:{domain}"
        hash_input = f"{self.root_seed}:{self.generator_version}:{key}"
        seed = int(hashlib.sha256(hash_input.encode()).hexdigest()[:16], 16)
        self.derived[key] = seed
        return seed

    def derive_all_domains(self) -> dict:
        """Derive seeds for all generative domains."""
        for domain in GENERATIVE_DOMAINS:
            self.derive_domain(domain)
        return self.derived

    def get_seed(self, level: str, name: str = "") -> int:
        """Get a previously derived seed."""
        key = f"{level}:{name}"
        return self.derived.get(key)

    def get_domain_seed(self, domain: str) -> int:
        """Get a previously derived domain seed."""
        key = f"domain:{domain}"
        return self.derived.get(key)
