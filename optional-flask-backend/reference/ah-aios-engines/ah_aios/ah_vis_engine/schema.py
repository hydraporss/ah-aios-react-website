"""AH-VIS-INTEGRATION-001 — Visual brief schema.

JSON Schema for the structured visual brief that connects the world model
to image-generation providers. Model-independent and preserves all required
identity, composition, color, and exclusion constraints.
"""

from typing import Any

VISUAL_BRIEF_SCHEMA = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "title": "AfterHumanityVisualBrief",
    "type": "object",
    "additionalProperties": False,
    "required": [
        "task_id",
        "specification_version",
        "world_id",
        "primary_subject",
        "supporting_entities",
        "environment",
        "relationships",
        "required_attributes",
        "required_colors",
        "required_materials",
        "required_symbols",
        "composition",
        "lighting_atmosphere",
        "required_elements",
        "prohibited_changes",
        "source_reference_ids",
        "unresolved_conflicts",
        "validation_criteria",
        "canon_status",
    ],
    "properties": {
        "task_id": {
            "type": "string",
            "pattern": "^AH-[A-Z]+-[0-9]{3}$",
            "description": "Task identifier for the visual generation request.",
        },
        "specification_version": {
            "type": "string",
            "description": "Version of the visual generation specification used.",
        },
        "world_id": {
            "type": "string",
            "description": "World model entity ID this visual brief relates to.",
        },
        "primary_subject": {
            "type": "object",
            "additionalProperties": False,
            "required": ["entity_id", "name", "identity_description"],
            "properties": {
                "entity_id": {"type": "string"},
                "name": {"type": "string"},
                "identity_description": {"type": "string"},
            },
        },
        "supporting_entities": {
            "type": "array",
            "description": "Supporting entities or environmental features.",
            "items": {
                "type": "object",
                "additionalProperties": False,
                "required": ["entity_id", "name", "relationship_type", "description"],
                "properties": {
                    "entity_id": {"type": "string"},
                    "name": {"type": "string"},
                    "relationship_type": {"type": "string"},
                    "description": {"type": "string"},
                },
            },
        },
        "environment": {
            "type": "object",
            "required": ["setting", "climate", "terrain", "atmosphere"],
            "properties": {
                "setting": {"type": "string"},
                "climate": {"type": "string"},
                "terrain": {"type": "string"},
                "atmosphere": {"type": "string"},
            },
        },
        "relationships": {
            "type": "array",
            "description": "Spatial and narrative relationships between entities.",
            "items": {
                "type": "object",
                "additionalProperties": False,
                "required": ["subject_id", "object_id", "relationship_type", "narrative_purpose"],
                "properties": {
                    "subject_id": {"type": "string"},
                    "object_id": {"type": "string"},
                    "relationship_type": {"type": "string"},
                    "narrative_purpose": {"type": "string"},
                },
            },
        },
        "required_attributes": {
            "type": "array",
            "description": "Required visual attributes for the primary subject.",
            "items": {"type": "string"},
        },
        "required_colors": {
            "type": "array",
            "description": "Required colors and their usage (e.g., 'Primor Blue: primary').",
            "items": {"type": "string"},
        },
        "required_materials": {
            "type": "array",
            "description": "Required materials for the primary subject.",
            "items": {"type": "string"},
        },
        "required_symbols": {
            "type": "array",
            "description": "Required symbols and their meaning.",
            "items": {"type": "string"},
        },
        "composition": {
            "type": "object",
            "required": ["focal_subject", "camera_view", "spatial_hierarchy"],
            "properties": {
                "focal_subject": {"type": "string"},
                "camera_view": {"type": "string"},
                "spatial_hierarchy": {"type": "string"},
            },
        },
        "lighting_atmosphere": {
            "type": "object",
            "required": ["lighting", "atmosphere", "depth"],
            "properties": {
                "lighting": {"type": "string"},
                "atmosphere": {"type": "string"},
                "depth": {"type": "string"},
            },
        },
        "required_elements": {
            "type": "array",
            "description": "Elements that must be present in the image.",
            "items": {"type": "string"},
        },
        "prohibited_changes": {
            "type": "array",
            "description": "Changes that are prohibited (e.g., altering established identities or canon).",
            "items": {"type": "string"},
        },
        "source_reference_ids": {
            "type": "array",
            "description": "Reference IDs for canon and source materials used.",
            "items": {"type": "string"},
        },
        "unresolved_conflicts": {
            "type": "array",
            "description": "Conflicting requirements that cannot be silently resolved.",
            "items": {"type": "object"},
        },
        "validation_criteria": {
            "type": "array",
            "description": "Criteria for validating the generated image.",
            "items": {"type": "object"},
        },
        "canon_status": {
            "type": "string",
            "enum": ["emergent", "candidate", "canon", "conflict", "superseded"],
            "description": "Canon status of generated content. Always non-canonical unless explicitly authorized.",
        },
    },
}

VISUAL_BRIEF_PROPERTIES = {
    "task_id": "AH-VIS-GEN-001",
    "specification_version": "1.0.0",
    "world_id": "WLD-GEN-001",
    "primary_subject": {
        "entity_id": "WLD-GEN-PLANET-001",
        "name": "Generated Planet",
        "identity_description": "A deterministically generated world with terrain classes, environmental fields, and entity placements.",
    },
    "supporting_entities": [
        {"entity_id": "WLD-GEN-REGION-001", "name": "Plains Region", "relationship_type": "located_in", "description": "A plains region within the generated world."},
        {"entity_id": "WLD-GEN-REGION-002", "name": "Highlands Region", "relationship_type": "located_in", "description": "A highlands region within the generated world."},
        {"entity_id": "WLD-GEN-ENV-001-001", "name": "Cell (0,0)", "relationship_type": "located_in", "description": "Environment cell at coordinates (0,0)."},
    ],
    "environment": {
        "setting": "Generated world with terrain classes including plains, highlands, mountains, and depressions.",
        "climate": "Temperate with variable moisture levels.",
        "terrain": "Deterministically generated height field with defined thresholds.",
        "atmosphere": "Clean atmospheric conditions for clear visual distinction.",
    },
    "relationships": [
        {"subject_id": "WLD-GEN-PLANET-001", "object_id": "WLD-GEN-REGION-001", "relationship_type": "contains", "narrative_purpose": "Show the planet containing its regions."},
        {"subject_id": "WLD-GEN-ENV-001-001", "object_id": "WLD-GEN-REGION-001", "relationship_type": "located_in", "narrative_purpose": "Show the environment cell located within the region."},
    ],
    "required_attributes": [
        "Terrain classifications clearly visible",
        "Environmental fields consistent with biome rules",
        "Stable entity identities preserved",
    ],
    "required_colors": [],
    "required_materials": [],
    "required_symbols": [],
    "composition": {
        "focal_subject": "The planet as the primary subject, with regions as supporting elements.",
        "camera_view": "Wide-angle exterior view showing the planet's surface features.",
        "spatial_hierarchy": "Planet —> Regions —> Environment cells",
    },
    "lighting_atmosphere": {
        "lighting": "Natural daylight with soft shadows",
        "atmosphere": "Clear, visible terrain features",
        "depth": "Deep perspective showing multiple layers of the world",
    },
    "required_elements": [
        "Planet record clearly visible",
        "Region boundaries marked",
        "Environmental data represented",
    ],
    "prohibited_changes": [
        "Do not alter established entity identities",
        "Do not change canon status without authorization",
    ],
    "source_reference_ids": ["AH-VIS-GEN-001"],
    "unresolved_conflicts": [],
    "validation_criteria": [
        {"criterion": "All required subjects present", "type": "presence"},
        {"criterion": "Entity identity preserved", "type": "identity"},
        {"criterion": "Composition correct", "type": "composition"},
    ],
    "canon_status": "emergent",
}
