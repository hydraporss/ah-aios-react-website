"""AH-AIOS L150-IGP / MVA Starter — Schema.

JSON Schema for the structured generation instructions produced by the
L150-IGP/MVA Starter procedural engine. Model-independent and preserves
all required identity, composition, color, and exclusion constraints.
"""

from typing import Any

# L150-IGP / MVA Starter generation instructions schema
MVA_STARTER_SCHEMA = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "title": "AH-AIOS_MVA_Starter_GenerationInstructions",
    "type": "object",
    "additionalProperties": False,
    "required": [
        "composition_id",
        "specification_version",
        "world_id",
        "generation_instructions",
        "scoring",
        "canon_status",
    ],
    "properties": {
        "composition_id": {"type": "string", "minLength": 1},
        "specification_version": {"type": "string"},
        "world_id": {"type": "string", "minLength": 1},
        "generated_at": {"type": "string"},
        "generation_instructions": {
            "type": "object",
            "required": ["composition_type", "central_subject", "visual_hierarchy", "reading_architecture"],
            "properties": {
                "composition_type": {"type": "string"},
                "central_subject": {"type": "object"},
                "narrative_tracks": {"type": "array", "items": {"type": "object"}},
                "analytical_tracks": {"type": "array", "items": {"type": "object"}},
                "visual_hierarchy": {"type": "string"},
                "reading_architecture": {"type": "string"},
            },
        },
        "scoring": {
            "type": "object",
            "properties": {
                "weighted_total": {"type": "number"},
                "normalized_score": {"type": "number"},
                "penalties": {"type": "array"},
                "critical_failures": {"type": "array"},
            },
        },
        "canon_status": {"type": "string", "enum": ["composition_prepared", "authorized", "rejected", "emergent"]},
    },
}

# Default generation instructions
MVA_STARTER_DEFAULTS = {
    "specification_version": "1.0.0",
    "world_id": "WLD-MVA-001",
    "generation_instructions": {
        "composition_type": "asymmetric_cinematic_mosaic",
        "central_subject": {
            "id": "WLD-MVA-CENTRAL-001",
            "name": "Primary Subject",
            "identity_description": "The central subject of the generated image.",
        },
        "narrative_tracks": [],
        "analytical_tracks": [],
        "visual_hierarchy": "World -> Character -> Story -> Evidence -> Detail",
        "reading_architecture": "Two-track reading: emotional narrative on the left; canonical and analytical information on the right",
    },
    "canon_status": "composition_prepared",
}
