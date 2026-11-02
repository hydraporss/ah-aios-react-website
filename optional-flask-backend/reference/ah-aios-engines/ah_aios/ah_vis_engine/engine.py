"""AH-VIS-INTEGRATION-001 — Visual generation subsystem engine.

Implements the model-independent visual generation subsystem that connects
the world model to image-generation providers through a structured visual
brief, model adapters, and validation.

Pipeline:
WORLD MODEL → GENERATED WORLD STATE → VISUAL BRIEF → MODEL ADAPTER → IMAGE RENDERING → VISUAL AUDIT
"""

import copy
from datetime import datetime, timezone
from typing import Any

from .schema import VISUAL_BRIEF_SCHEMA, VISUAL_BRIEF_PROPERTIES


class VisualBrief:
    """Structured, model-independent visual brief from world data."""

    def __init__(
        self,
        task_id: str,
        world_data: dict,
        image_requirements: dict | None = None,
        specification_version: str = "1.0.0",
    ):
        """
        Initialize a visual brief.

        Args:
            task_id: Task identifier (e.g., "AH-VIS-INTEGRATION-001").
            world_data: World model data from Phase 3 generation.
            image_requirements: Optional user image requirements.
            specification_version: Version of the visual generation spec.
        """
        self.task_id = task_id
        self.specification_version = specification_version
        self.world_data = world_data
        self.image_requirements = image_requirements or {}
        self._built = False
        self.built_brief = None

    def build(self) -> dict:
        """Build the structured visual brief from world data."""
        world = self.world_data.get("world", {})
        entities = self.world_data.get("entities", [])
        relationships = self.world_data.get("relationships", [])
        environment = self.world_data.get("environment", {})

        # Build primary subject
        primary_subject = self._build_primary_subject(world, entities)

        # Build supporting entities
        supporting_entities = self._build_supporting_entities(world, entities, relationships)

        # Build relationships
        relationships_list = self._build_relationships(relationships, entities)

        # Build environment from Phase 3 generation
        env = self._build_environment(environment, world)

        # Build required attributes
        required_attributes = self._build_required_attributes(world, entities)

        # Build color/material constraints (from entity properties and user requirements)
        required_colors = self._build_required_colors(entities, self.image_requirements)
        required_materials = self._build_required_materials(entities, self.image_requirements)
        required_symbols = self._build_required_symbols(entities, self.image_requirements)

        # Build composition
        composition = self._build_composition(world)

        # Build lighting/atmosphere
        lighting_atmosphere = self._build_lighting_atmosphere(environment)

        # Build required elements
        required_elements = self._build_required_elements(world, entities)

        # Prohibited changes
        prohibited_changes = [
            "Do not alter established entity identities",
            "Do not change canon status without authorization",
        ]

        # Source reference IDs
        source_reference_ids = self.image_requirements.get("source_reference_ids", ["AH-VIS-GEN-001"])

        # Unresolved conflicts
        unresolved_conflicts = self._detect_unresolved_conflicts()

        # Validation criteria
        validation_criteria = self._build_validation_criteria()

        # Build the brief
        self.built_brief = {
            "task_id": self.task_id,
            "specification_version": self.specification_version,
            "world_id": world.get("id", "WLD-GEN-001"),
            "primary_subject": primary_subject,
            "supporting_entities": supporting_entities,
            "environment": env,
            "relationships": relationships_list,
            "required_attributes": required_attributes,
            "required_colors": required_colors,
            "required_materials": required_materials,
            "required_symbols": required_symbols,
            "composition": composition,
            "lighting_atmosphere": lighting_atmosphere,
            "required_elements": required_elements,
            "prohibited_changes": prohibited_changes,
            "source_reference_ids": source_reference_ids,
            "unresolved_conflicts": unresolved_conflicts,
            "validation_criteria": validation_criteria,
            "canon_status": "emergent",
        }
        self._built = True
        return copy.deepcopy(self.built_brief)

    def _build_primary_subject(self, world: dict, entities: list) -> dict:
        """Build the primary subject from world data."""
        return {
            "entity_id": world.get("id", "WLD-GEN-001"),
            "name": world.get("name", "Generated World"),
            "identity_description": world.get("description", "Unnamed world"),
        }

    def _build_supporting_entities(self, world: dict, entities: list, relationships: list) -> list:
        """Build supporting entities list."""
        if not entities:
            return []

        # Get unique entities linked via relationships
        subject_id = world.get("id", "WLD-GEN-001")
        seen = set()
        supporting = []

        for rel in relationships:
            for endpoint in [rel.get("subject_id"), rel.get("object_id")]:
                if endpoint and endpoint != subject_id and endpoint not in seen:
                    seen.add(endpoint)
                    # Find the entity name
                    entity_name = self._find_entity_name(endpoint, entities)
                    supporting.append({
                        "entity_id": endpoint,
                        "name": entity_name,
                        "relationship_type": rel.get("type", "related_to"),
                        "description": f"Entity {endpoint} linked via {rel.get('type', 'relationship')}",
                    })
                    if len(supporting) >= 3:
                        return supporting

        # If no relationships, use environment entities
        if not supporting:
            for env in entities[:3]:
                supporting.append({
                    "entity_id": env.get("id", ""),
                    "name": env.get("name", "Environment"),
                    "relationship_type": "located_in",
                    "description": f"Environment cell {env.get('id', '')}",
                })

        return supporting

    def _find_entity_name(self, entity_id: str, entities: list) -> str:
        """Find an entity's name by its ID."""
        for entity in entities:
            if entity.get("id") == entity_id:
                return entity.get("name", entity_id)
        return entity_id

    def _build_relationships(self, relationships: list, entities: list) -> list:
        """Build relationship list with narrative purpose."""
        result = []
        for rel in relationships:
            result.append({
                "subject_id": rel.get("subject_id"),
                "object_id": rel.get("object_id"),
                "relationship_type": rel.get("type", "related_to"),
                "narrative_purpose": rel.get("description", "Spatial or narrative relationship"),
            })
        return result

    def _build_environment(self, environment: dict, world: dict) -> dict:
        """Build environment data from world model."""
        # Get terrain info from generation
        terrain = self.world_data.get("terrain", [])
        terrain_counts = self.world_data.get("terrain_counts", {})

        env = {
            "setting": world.get("description", "Generated world"),
            "climate": "Configurable per generation parameters",
            "terrain": "Deterministic noise-based height field",
            "atmosphere": "Clear visibility for terrain features",
        }

        # Add terrain classification counts if available
        if terrain_counts:
            env["terrain_classes"] = terrain_counts

        return env

    def _build_required_attributes(self, world: dict, entities: list) -> list:
        """Build required visual attributes."""
        attributes = [
            "Terrain classifications clearly visible",
            "Environmental fields consistent with biome rules",
            "Stable entity identities preserved",
            "All entity references resolve to actual entities",
        ]
        return attributes

    def _build_required_colors(self, entities: list, requirements: dict) -> list:
        """Build required colors from entity properties and user requirements."""
        colors = []
        # Check for faction color references in world data
        for entity in entities:
            props = entity.get("properties", {})
            if isinstance(props, dict):
                if "color" in props:
                    colors.append(f"{props['color']} entity: {entity.get('id')}")
        # Add from user requirements
        if requirements.get("required_colors"):
            colors.extend(requirements["required_colors"])
        return colors

    def _build_required_materials(self, entities: list, requirements: dict) -> list:
        """Build required materials from entity properties and user requirements."""
        materials = []
        for entity in entities:
            props = entity.get("properties", {})
            if isinstance(props, dict):
                if "material" in props:
                    materials.append(f"{props['material']} entity: {entity.get('id')}")
        if requirements.get("required_materials"):
            materials.extend(requirements["required_materials"])
        return materials

    def _build_required_symbols(self, entities: list, requirements: dict) -> list:
        """Build required symbols from entity properties and user requirements."""
        symbols = []
        for entity in entities:
            props = entity.get("properties", {})
            if isinstance(props, dict):
                if "symbol" in props:
                    symbols.append(f"{props['symbol']} entity: {entity.get('id')}")
        if requirements.get("required_symbols"):
            symbols.extend(requirements["required_symbols"])
        return symbols

    def _build_composition(self, world: dict) -> dict:
        """Build composition guidance."""
        return {
            "focal_subject": world.get("name", "Generated World"),
            "camera_view": "Wide-angle exterior view suitable for world visualization",
            "spatial_hierarchy": "World level —> Region level —> Environment details",
        }

    def _build_lighting_atmosphere(self, environment: dict) -> dict:
        """Build lighting and atmosphere guidance."""
        return {
            "lighting": "Natural scene lighting",
            "atmosphere": "Clear, descriptive atmosphere",
            "depth": "Multiple depth layers for world scale",
        }

    def _build_required_elements(self, world: dict, entities: list) -> list:
        """Build required elements list."""
        elements = [
            f"World record: {world.get('id', 'WLD-GEN-001')}",
            "Entity records with stable IDs",
        ]
        return elements

    def _detect_unresolved_conflicts(self) -> list:
        """Detect unresolved conflicts between requirements."""
        conflicts = []
        # Currently no automated conflict detection
        # Future: check for conflicting color assignments, etc.
        return conflicts

    def _build_validation_criteria(self) -> list:
        """Build validation criteria for the brief."""
        return [
            {"criterion": "All required subjects present", "type": "presence"},
            {"criterion": "Entity identity preserved", "type": "identity"},
            {"criterion": "Composition correct", "type": "composition"},
            {"criterion": "Color constraints honored", "type": "color"},
            {"criterion": "Source traceability confirmed", "type": "provenance"},
        ]

    def validate(self) -> list:
        """Validate the built visual brief against schema."""
        if not self._built:
            self.build()
        return self._validate_brief(self.built_brief)

    @classmethod
    def _validate_brief(cls, brief: dict) -> list:
        """Validate brief against schema, return list of validation errors."""
        errors = []

        # Check required top-level fields
        required_fields = VISUAL_BRIEF_SCHEMA.get("required", [])
        for field in required_fields:
            if field not in brief:
                errors.append(f"Missing required field: {field}")

        # Check primary_subject
        if "primary_subject" in brief:
            ps = brief["primary_subject"]
            if not isinstance(ps, dict):
                errors.append("primary_subject must be an object")
            else:
                for field in ["entity_id", "name", "identity_description"]:
                    if field not in ps:
                        errors.append(f"primary_subject missing field: {field}")

        # Check composition
        if "composition" in brief:
            comp = brief["composition"]
            if not isinstance(comp, dict):
                errors.append("composition must be an object")
            else:
                for field in ["focal_subject", "camera_view", "spatial_hierarchy"]:
                    if field not in comp:
                        errors.append(f"composition missing field: {field}")

        # Check environment
        if "environment" in brief:
            env = brief["environment"]
            if not isinstance(env, dict):
                errors.append("environment must be an object")
            else:
                for field in ["setting", "climate", "terrain", "atmosphere"]:
                    if field not in env:
                        errors.append(f"environment missing field: {field}")

        # Check relationships
        if "relationships" in brief:
            rels = brief["relationships"]
            if not isinstance(rels, list):
                errors.append("relationships must be an array")
            else:
                for i, rel in enumerate(rels):
                    if not isinstance(rel, dict):
                        errors.append(f"relationships[{i}] must be an object")
                    elif not rel.get("subject_id") or not rel.get("object_id"):
                        errors.append(f"relationships[{i}] missing subject_id or object_id")

        # Check required_attributes
        if "required_attributes" in brief and not isinstance(brief["required_attributes"], list):
            errors.append("required_attributes must be an array")

        # Check canon_status
        if "canon_status" in brief:
            valid_canons = ["emergent", "candidate", "canon", "conflict", "superseded"]
            if brief["canon_status"] not in valid_canons:
                errors.append(f"Invalid canon_status: {brief['canon_status']}")

        return errors

    def to_json(self, path: str) -> None:
        """Save the built brief to a JSON file."""
        import json
        with open(path, 'w') as f:
            json.dump(self.built_brief, f, indent=2)
        self._built = True


class ModelAdapter:
    """Provider-neutral interface for converting visual briefs into model-specific instructions."""

    def __init__(self, brief: dict, provider: str = "generic"):
        """
        Initialize a model adapter.

        Args:
            brief: A VisualBrief instance or built brief dictionary.
            provider: Image-generation provider name (e.g., "openai", "stable-diffusion").
        """
        if isinstance(brief, VisualBrief):
            self.brief = brief.build()
        else:
            self.brief = brief
        self.provider = provider
        self._adapter_config = {}

    def adapt(self) -> dict:
        """
        Adapt the visual brief into a model-ready instruction structure.

        Returns:
            Dictionary containing the adapted prompt and configuration.
        """
        prompt = self._build_prompt()
        config = {
            "provider": self.provider,
            "prompt": prompt,
            "brief_version": self.brief.get("specification_version", "1.0.0"),
            "world_id": self.brief.get("world_id"),
            "canon_status": self.brief.get("canon_status"),
        }
        return config

    def _build_prompt(self) -> str:
        """Build the image-generation prompt from the brief."""
        lines = []

        # Primary subject
        ps = self.brief.get("primary_subject", {})
        lines.append(f"Subject: {ps.get('name', 'Unnamed')} ({ps.get('entity_id', 'unknown')})")

        # Identity description
        identity = ps.get("identity_description", "A generated entity.")
        lines.append(f"Identity: {identity}")

        # Supporting entities
        for ent in self.brief.get("supporting_entities", []):
            lines.append(f"Supporting: {ent.get('name', 'Unknown')} ({ent.get('entity_id', 'unknown')})")

        # Environment
        env = self.brief.get("environment", {})
        lines.append(f"Environment: {env.get('setting', 'Unknown')}")
        lines.append(f"Climate: {env.get('climate', 'Unknown')}")
        lines.append(f"Terrain: {env.get('terrain', 'Unknown')}")

        # Required attributes
        for attr in self.brief.get("required_attributes", []):
            lines.append(f"Visual requirement: {attr}")

        # Required colors
        for color in self.brief.get("required_colors", []):
            lines.append(f"Color: {color}")

        # Required materials
        for mat in self.brief.get("required_materials", []):
            lines.append(f"Material: {mat}")

        # Required symbols
        for sym in self.brief.get("required_symbols", []):
            lines.append(f"Symbol: {sym}")

        # Composition
        comp = self.brief.get("composition", {})
        lines.append(f"Composition: focal subject = {comp.get('focal_subject', 'Unknown')}")
        lines.append(f"Camera: {comp.get('camera_view', 'Unknown')}")

        # Lighting/atmosphere
        la = self.brief.get("lighting_atmosphere", {})
        lines.append(f"Lighting: {la.get('lighting', 'Unknown')}")
        lines.append(f"Atmosphere: {la.get('atmosphere', 'Unknown')}")

        # Required elements
        for elem in self.brief.get("required_elements", []):
            lines.append(f"Required: {elem}")

        # Prohibited changes
        for prohib in self.brief.get("prohibited_changes", []):
            lines.append(f"Prohibited: {prohib}")

        # Source references
        for ref in self.brief.get("source_reference_ids", []):
            lines.append(f"Source: {ref}")

        # Build prompt text
        prompt = "Generate an AFTER HUMANITY image based on the following structured brief:\n\n"
        prompt += "\n".join(lines)
        prompt += "\n\nEnsure:\n"
        prompt += "1. Identity preservation for all entities.\n"
        prompt += "2. Environmental consistency with described biome and terrain.\n"
        prompt += "3. Composition reflects the spatial hierarchy.\n"
        prompt += "4. Color, material, and symbol constraints are honored.\n"
        prompt += "5. No prohibited changes are made.\n"

        return prompt


class VisualValidator:
    """Validation mechanism for the visual brief and generated images."""

    @staticmethod
    def validate_brief(brief: dict) -> list:
        """
        Validate the structured visual brief.

        Returns a list of validation results. Each result is a dictionary with:
        - field: the validated field name
        - status: PASS, FAIL, or WARNING
        - message: human-readable explanation
        """
        issues = []

        # Check task_id
        if "task_id" in brief:
            if not brief["task_id"].startswith("AH-"):
                issues.append({"field": "task_id", "status": "FAIL", "message": "task_id must start with 'AH-'"})
        else:
            issues.append({"field": "task_id", "status": "FAIL", "message": "task_id is required"})

        # Check world_id
        if "world_id" in brief:
            if not brief["world_id"].startswith("WLD-"):
                issues.append({"field": "world_id", "status": "WARNING", "message": "world_id should follow WLD- format"})
        else:
            issues.append({"field": "world_id", "status": "FAIL", "message": "world_id is required"})

        # Check canon_status
        if "canon_status" in brief:
            valid = ["emergent", "candidate", "canon", "conflict", "superseded"]
            if brief["canon_status"] not in valid:
                issues.append({"field": "canon_status", "status": "FAIL", "message": "Invalid canon_status"})

        # Check primary_subject
        if "primary_subject" in brief:
            ps = brief["primary_subject"]
            if not isinstance(ps, dict) or not ps.get("entity_id"):
                issues.append({"field": "primary_subject", "status": "FAIL", "message": "Missing or invalid primary_subject"})

        # Check supporting_entities
        if "supporting_entities" in brief:
            for i, ent in enumerate(brief["supporting_entities"]):
                if not isinstance(ent, dict) or not ent.get("entity_id"):
                    issues.append({"field": f"supporting_entities[{i}]", "status": "FAIL", "message": "Missing entity_id"})

        # Check environment
        if "environment" in brief:
            env = brief["environment"]
            for field in ["setting", "climate", "terrain", "atmosphere"]:
                if field not in env:
                    issues.append({"field": f"environment.{field}", "status": "FAIL", "message": f"Missing {field}"})

        # Check required_attributes
        if "required_attributes" in brief and not isinstance(brief["required_attributes"], list):
            issues.append({"field": "required_attributes", "status": "FAIL", "message": "Must be an array"})

        # Check prohibited_changes
        if "prohibited_changes" in brief and not isinstance(brief["prohibited_changes"], list):
            issues.append({"field": "prohibited_changes", "status": "FAIL", "message": "Must be an array"})

        # Check source_reference_ids
        if "source_reference_ids" in brief:
            for ref in brief["source_reference_ids"]:
                if not ref.startswith("AH-"):
                    issues.append({"field": "source_reference_ids", "status": "WARNING", "message": f"Invalid source reference: {ref}"})

        return issues

    @staticmethod
    def validate_image_rendered(image_agent: Any, image_path: str | None = None) -> list:
        """
        Validate a rendered image.

        NOTE: This is a specification-level validation. Actual image inspection requires
        a visual-analysis capability. This implementation returns the checklist
        without performing image inspection.

        Args:
            image_agent: The image generation agent (if available).
            image_path: Path to rendered image (if available).

        Returns:
            List of validation results. Actual image inspection is limited by
            available capabilities.
        """
        # This is a specification-level validation placeholder.
        # In a production system, this would call image-analysis APIs.
        # For now, we return the validation criteria checklist.
        results = [
            {"field": "rendered_image", "status": "NOT_VERIFIED", "message": "Actual image inspection not available in this environment"},
            {"field": "image_quality", "status": "NOT_VERIFIED", "message": "Image quality check requires visual-analysis capability"},
            {"field": "identity_preserved", "status": "NOT_VERIFIED", "message": "Entity identity check requires visual inspection"},
            {"field": "composition", "status": "NOT_VERIFIED", "message": "Composition check requires visual inspection"},
        ]
        return results


class VisualIntegration:
    """Integrate Phase 3 world generation with the visual generation subsystem."""

    def __init__(self, world_generator: Any):
        """
        Initialize the integration.

        Args:
            world_generator: A WorldGenerator instance from ah_gen_engine.
        """
        self.world_generator = world_generator

    def generate_visual_brief(self, task_id: str, image_requirements: dict | None = None) -> VisualBrief:
        """
        Generate a visual brief from a world generation run.

        Pipeline: WORLD MODEL → VISUAL BRIEF

        Args:
            task_id: Task identifier.
            image_requirements: Optional image requirements from the user.

        Returns:
            VisualBrief instance with built brief.
        """
        # Generate world from Phase 3
        result = self.world_generator.generate_world()

        # Build visual brief
        brief = VisualBrief(
            task_id=task_id,
            world_data=result,
            image_requirements=image_requirements,
        )
        return brief

    def validate_visual(self, brief: VisualBrief) -> list:
        """
        Validate a visual brief.

        Pipeline: VISUAL BRIEF → VISUAL VALIDATOR

        Returns:
            List of validation results from VisualValidator.
        """
        from .engine import VisualValidator
        return VisualValidator.validate_brief(brief.built_brief)

    def get_adapter(self, provider: str = "generic") -> ModelAdapter:
        """
        Get a model adapter for the current visual brief.

        Pipeline: VISUAL BRIEF → MODEL ADAPTER

        Returns:
            ModelAdapter instance.
        """
        return ModelAdapter(self.built_brief, provider=provider)
