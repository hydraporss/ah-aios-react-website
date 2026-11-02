"""AH-AIOS L150-IGP / MVA Starter — Test Suite.

Implements the test suite for the L150-IGP/MVA Starter procedural engine,
covering:
- L120-IGP composition (asymmetric cinematic mosaic)
- VGCI-1.1 weighted scoring (L120-L150)
- L150 canon governance (authorization boundaries)

Run: python -m pytest tests/test_mva_starter.py -v
"""

import json
import sys
import unittest
from datetime import datetime, timezone

sys.path.insert(0, "src")

from ah_aios.mva_starter.engine import (
    L120IGPCompositionEngine,
    L150CanonGovernance,
    MVAStarter,
    VGCI11ScoringSystem,
    L150IGPCompositionError,
    L150IGPCanonViolationError,
    L120,
    L125,
    L130,
    L135,
    L140,
    L145,
    L150,
)


class TestL120IGPCompositionEngine(unittest.TestCase):
    """Tests for the L120-IGP asymmetric cinematic mosaic composition engine."""

    def setUp(self):
        self.engine = L120IGPCompositionEngine()
        self.central_subject = {
            "id": "WLD-MVA-CENTRAL-001",
            "name": "Test Central Subject",
            "identity_description": "A canonical central subject for testing.",
        }
        self.structural_identity = {
            "panel_geometry": "irregular_diagonal",
            "spatial_hierarchy": "World -> Character -> Story -> Evidence -> Detail",
            "visual_hierarchy": "World -> Character -> Story -> Evidence -> Detail",
            "reading_architecture": "Two-track reading: emotional narrative on the left; canonical and analytical information on the right",
        }

    def test_compose_creates_valid_composition(self):
        """Test that compose produces a valid composition dict."""
        result = self.engine.compose(
            world_id="WLD-MVA-001",
            central_subject=self.central_subject,
            narrative_tracks=[{"track": "Test narrative"}],
            analytical_tracks=[{"track": "Test analytical"}],
            structural_identity=self.structural_identity,
        )
        self.assertEqual(result["composition_type"], "asymmetric_cinematic_mosaic")
        self.assertEqual(result["world_id"], "WLD-MVA-001")
        self.assertEqual(result["status"], "composition_prepared")
        self.assertIn("generated_at", result)

    def test_compose_requires_identity_description(self):
        """Test that compose raises an error without identity_description."""
        central_subject = {"id": "WLD-MVA-CENTRAL-001", "name": "Test"}
        with self.assertRaises(L150IGPCompositionError):
            self.engine.compose(
                world_id="WLD-MVA-001",
                central_subject=central_subject,
                narrative_tracks=[],
                analytical_tracks=[],
                structural_identity=self.structural_identity,
            )

    def test_compose_preserves_visual_hierarchy(self):
        """Test that visual hierarchy is preserved from structural identity."""
        result = self.engine.compose(
            world_id="WLD-MVA-001",
            central_subject=self.central_subject,
            narrative_tracks=[],
            analytical_tracks=[],
            structural_identity=self.structural_identity,
        )
        self.assertEqual(
            result["visual_hierarchy"],
            "World -> Character -> Story -> Evidence -> Detail",
        )


class TestVGCI11ScoringSystem(unittest.TestCase):
    """Tests for the VGCI-1.1 weighted scoring system."""

    def setUp(self):
        self.scorer = VGCI11ScoringSystem()

    def test_weighted_maximum(self):
        """Test that the weighted maximum equals 117.5."""
        self.scorer.set_layer_score(L120, 15)
        self.scorer.set_layer_score(L125, 15)
        self.scorer.set_layer_score(L130, 20)
        self.scorer.set_layer_score(L135, 15)
        self.scorer.set_layer_score(L140, 10)
        self.scorer.set_layer_score(L145, 15)
        self.scorer.set_layer_score(L150, 10)
        self.assertAlmostEqual(self.scorer.weighted_total(), 117.5)
        self.assertAlmostEqual(self.scorer.normalized_score(), 100.0)

    def test_supplied_example(self):
        """Test the supplied example: 13,12,18,14,9,13,10 = 105/117.5 = 89.36%."""
        scores = {"L120": 13, "L125": 12, "L130": 18, "L135": 14, "L140": 9, "L145": 13, "L150": 10}
        for layer, score in scores.items():
            self.scorer.set_layer_score(layer, score)
        self.assertAlmostEqual(self.scorer.weighted_total(), 105.0, places=2)
        self.assertAlmostEqual(self.scorer.normalized_score(), 89.36, places=2)
        self.assertEqual(self.scorer.disposition(), "CONDITIONAL_APPROVAL")

    def test_normalized_score_bounds(self):
        """Test that normalized scores remain within 0-100."""
        # Set valid scores for each layer (each max differs)
        max_scores = {L120: 15, L125: 15, L130: 20, L135: 15, L140: 10, L145: 15, L150: 10}
        for score in [0, 50, 100]:
            for layer, max_score in max_scores.items():
                self.scorer.set_layer_score(layer, min(score, max_score))
            self.assertGreaterEqual(self.scorer.normalized_score(), 0)
            self.assertLessEqual(self.scorer.normalized_score(), 100)

    def test_critical_failure_overrides_score(self):
        """Test that critical failure forces REJECTED regardless of score."""
        self.scorer.set_layer_score(L120, 15)
        self.scorer.set_layer_score(L125, 15)
        self.scorer.set_layer_score(L130, 20)
        self.scorer.set_layer_score(L135, 15)
        self.scorer.set_layer_score(L140, 10)
        self.scorer.set_layer_score(L145, 15)
        self.scorer.set_layer_score(L150, 10)
        self.scorer.apply_critical_failure(L130, "Identity failure")
        self.assertEqual(self.scorer.disposition(), "REJECTED")


class TestL150CanonGovernance(unittest.TestCase):
    """Tests for the L150 Canon Governance validation system."""

    def setUp(self):
        self.governance = L150CanonGovernance(authorizer="TEST_AUTHORIZER")

    def test_authorize_requires_authorizer(self):
        """Test that authorization requires an explicit authorizer."""
        governance = L150CanonGovernance()
        with self.assertRaises(L150IGPCanonViolationError):
            governance.authorize_canon_change("ART-001", "Test justification", "Test evidence")

    def test_can_artifact_become_canon(self):
        """Test that authorization gates canonization."""
        self.assertTrue(self.governance.can_artifact_become_canon("ART-001", True, 95))
        self.assertFalse(self.governance.can_artifact_become_canon("ART-001", False, 95))

    def test_record_decision(self):
        """Test that record_decision creates a valid decision."""
        result = self.governance.record_decision(
            artifact_id="ART-001",
            decision="authorized",
            justification="Test justification",
            canon_status="established",
        )
        self.assertEqual(result["decision"], "authorized")
        self.assertEqual(result["canon_status"], "established")
        self.assertIn("governing_rule", result)


class TestMVAStarter(unittest.TestCase):
    """Tests for the MVA Starter integration."""

    def setUp(self):
        self.mva = MVAStarter(specification_version="1.0.0", authorizer="TEST_AUTHORIZER")

    def test_mva_compose(self):
        """Test that MVA compose produces a valid composition."""
        central_subject = {
            "id": "WLD-MVA-CENTRAL-001",
            "name": "Test Subject",
            "identity_description": "A canonical central subject.",
        }
        structural_identity = {
            "panel_geometry": "irregular_diagonal",
            "spatial_hierarchy": "World -> Character -> Story -> Evidence -> Detail",
            "visual_hierarchy": "World -> Character -> Story -> Evidence -> Detail",
            "reading_architecture": "Two-track reading: emotional narrative on the left; canonical and analytical information on the right",
        }
        result = self.mva.compose(
            world_id="WLD-MVA-001",
            central_subject=central_subject,
            narrative_tracks=[],
            analytical_tracks=[],
            structural_identity=structural_identity,
        )
        self.assertEqual(result["composition_type"], "asymmetric_cinematic_mosaic")
        self.assertEqual(result["world_id"], "WLD-MVA-001")

    def test_mva_validate(self):
        """Test that MVA validate checks authorization."""
        self.assertTrue(self.mva.validate("ART-001", True, 95))
        self.assertFalse(self.mva.validate("ART-001", False, 95))

    def test_mva_generate_instructions(self):
        """Test that MVA generate_instructions produces structured output."""
        central_subject = {
            "id": "WLD-MVA-CENTRAL-001",
            "name": "Test Subject",
            "identity_description": "A canonical central subject.",
        }
        structural_identity = {
            "panel_geometry": "irregular_diagonal",
            "spatial_hierarchy": "World -> Character -> Story -> Evidence -> Detail",
            "visual_hierarchy": "World -> Character -> Story -> Evidence -> Detail",
            "reading_architecture": "Two-track reading: emotional narrative on the left; canonical and analytical information on the right",
        }
        composition = self.mva.compose(
            world_id="WLD-MVA-001",
            central_subject=central_subject,
            narrative_tracks=[],
            analytical_tracks=[],
            structural_identity=structural_identity,
        )
        scoring = VGCI11ScoringSystem()
        scoring.set_layer_score(L120, 13)
        scoring.set_layer_score(L125, 12)
        scoring.set_layer_score(L130, 18)
        scoring.set_layer_score(L135, 14)
        scoring.set_layer_score(L140, 9)
        scoring.set_layer_score(L145, 13)
        scoring.set_layer_score(L150, 10)
        scoring_result = scoring.compute()

        instructions = self.mva.generate_instructions(composition, scoring_result)
        self.assertIn("composition_id", instructions)
        self.assertIn("generation_instructions", instructions)
        self.assertIn("scoring", instructions)
        self.assertEqual(instructions["canon_status"], "composition_prepared")


class TestMVAStarterSchema(unittest.TestCase):
    """Tests for the MVA Starter schema."""

    def test_mva_starter_schema(self):
        """Test that the schema is a valid JSON schema object."""
        from ah_aios.mva_starter.schema import MVA_STARTER_SCHEMA
        self.assertIsInstance(MVA_STARTER_SCHEMA, dict)
        self.assertIn("$schema", MVA_STARTER_SCHEMA)
        self.assertIn("required", MVA_STARTER_SCHEMA)

    def test_schema_required_fields(self):
        """Test that the schema has the required fields."""
        from ah_aios.mva_starter.schema import MVA_STARTER_SCHEMA
        required = MVA_STARTER_SCHEMA.get("required", [])
        self.assertIn("composition_id", required)
        self.assertIn("generation_instructions", required)
        self.assertIn("canon_status", required)


if __name__ == "__main__":
    unittest.main()
