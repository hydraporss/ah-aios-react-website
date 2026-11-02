"""AH-AIOS L150-IGP / MVA Starter — Procedural Generation Engine.

Implements the L120-IGP image generation protocol for the Modular Visual Architecture
(MVA), based on the established L115-L150 Integrated Image Governance Framework (canon).

Pipeline:
  CANON INPUT → L120-IGP COMPOSITION ENGINE → L150 CANON GOVERNANCE VALIDATION → OUTPUT

This implementation covers the procedural (algorithmic) aspects of the L120-IGP
composition specification. It does NOT generate images — it produces structured
generation instructions and verifies compliance. The 39 master visual artifacts
were not recovered (0 of 39 per C10-R06); image generation requires source evidence.

Status: PROCEDURAL ENGINE ONLY — no image rendering, no source verification.
"""

from __future__ import annotations

import copy
import json
import math
from datetime import datetime, timezone
from typing import Any

# Canonical level sequence (L115 -> L150) per L115_L150_CANON.md
L115 = "L115"
L120 = "L120"
L125 = "L125"
L130 = "L130"
L135 = "L135"
L140 = "L140"
L145 = "L145"
L150 = "L150"

# Seven numbered assessment and governance layers (L120-L150)
SEVEN_LAYERS = [L120, L125, L130, L135, L140, L145, L150]

# Weighted scoring (per VGCI-1.1 standard)
LAYER_RAW_MAX = {
    L120: 15,
    L125: 15,
    L130: 20,
    L135: 15,
    L140: 10,
    L145: 15,
    L150: 10,
}
LAYER_FACTOR = {
    L120: 1.0,
    L125: 1.0,
    L130: 1.5,
    L135: 1.0,
    L140: 0.5,
    L145: 1.5,
    L150: 1.5,
}
TOTAL_WEIGHTED_MAX = 117.5


class L150IGPCompositionError(Exception):
    """Raised when L120-IGP composition rules are violated."""


class L150IGPCanonViolationError(Exception):
    """Raised when L150 governance rules reject the composition."""


class L120IGPCompositionEngine:
    """Procedural engine for the L120-IGP asymmetric cinematic mosaic composition.

    Implements the composition architecture from L120-IGP — Integrated Canon Image
    Matrix (L120-IGP — Integrated Canon Image Matrix, L120-IGP — Integrated Canon
    Image Matrix, L120-IGP — Integrated Canon Image Matrix).

    Key compositional rules:
    - Asymmetric cinematic mosaic, never a simple grid
    - Dominant central hero or world image
    - Irregular diagonal and curved panel boundaries
    - Two-track reading: emotional narrative (left) + analytical (right)
    - Visual hierarchy: World -> Character -> Story -> Evidence -> Detail
    - Organic visual field vs precise analytical spine
    """

    def __init__(self, specification_version: str = "1.0.0"):
        self.specification_version = specification_version
        self.composition_id = f"L120IGP-{specification_version}-{datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')}"

    def compose(
        self,
        world_id: str,
        central_subject: dict,
        narrative_tracks: list[dict],
        analytical_tracks: list[dict],
        structural_identity: dict,
        metadata: dict | None = None,
    ) -> dict:
        """Compose an asymmetric cinematic mosaic from canonical inputs.

        Args:
            world_id: World model entity ID.
            central_subject: Dict with 'id', 'name', 'identity_description'.
            narrative_tracks: List of narrative (emotional) tracks.
            analytical_tracks: List of analytical (canonical) tracks.
            structural_identity: Dict with 'panel_geometry', 'spatial_hierarchy',
                'visual_hierarchy', 'reading_architecture'.
            metadata: Optional metadata dict.

        Returns:
            Structured composition dict ready for L150 governance validation.
        """
        if not central_subject.get("identity_description"):
            raise L150IGPCompositionError("Central subject must have identity_description")

        # Build the asymmetric composition
        composition = {
            "composition_id": self.composition_id,
            "specification_version": self.specification_version,
            "world_id": world_id,
            "composition_type": "asymmetric_cinematic_mosaic",
            "central_subject": central_subject,
            "narrative_tracks": narrative_tracks,
            "analytical_tracks": analytical_tracks,
            "structural_identity": structural_identity,
            "visual_hierarchy": structural_identity.get("visual_hierarchy", "World -> Character -> Story -> Evidence -> Detail"),
            "reading_architecture": structural_identity.get("reading_architecture", "Two-track reading: emotional narrative on the left; canonical and analytical information on the right"),
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "status": "composition_prepared",
        }

        if metadata:
            composition["metadata"] = metadata

        return composition


class VGCI11ScoringSystem:
    """Weighted scoring system for the VGCI-1.1 standard.

    Implements the seven_layer assessment and governance scoring:
    L120 (15 * 1.0) + L125 (15 * 1.0) + L130 (20 * 1.5) + L135 (15 * 1.0) +
    L140 (10 * 0.5) + L145 (15 * 1.5) + L150 (10 * 1.5) = 117.5

    Normalized Score = (Weighted Total / 117.5) * 100
    """

    def __init__(self):
        self.assessment = {
            L120: {"score": 0, "raw_max": 15, "factor": 1.0},
            L125: {"score": 0, "raw_max": 15, "factor": 1.0},
            L130: {"score": 0, "raw_max": 20, "factor": 1.5},
            L135: {"score": 0, "raw_max": 15, "factor": 1.0},
            L140: {"score": 0, "raw_max": 10, "factor": 0.5},
            L145: {"score": 0, "raw_max": 15, "factor": 1.5},
            L150: {"score": 0, "raw_max": 10, "factor": 1.5},
        }
        self.penalties = []
        self.critical_failures = []

    def set_layer_score(self, layer: str, score: int) -> None:
        if layer not in self.assessment:
            raise ValueError(f"Unknown layer: {layer}")
        if not (0 <= score <= self.assessment[layer]["raw_max"]):
            raise ValueError(f"Score {score} out of range 0-{self.assessment[layer]['raw_max']}")
        self.assessment[layer]["score"] = score

    def apply_penalty(self, layer: str, penalty: int, justification: str) -> None:
        if layer not in self.assessment:
            raise ValueError(f"Unknown layer: {layer}")
        if penalty < 0 or penalty > 10:
            raise ValueError("Penalty must be 0-10")
        penalty_key = f"{layer}_penalty"
        self.assessment[layer][penalty_key] = penalty
        self.penalties.append({"layer": layer, "penalty": penalty, "justification": justification})

    def apply_critical_failure(self, layer: str, reason: str) -> None:
        """Critical failures trigger automatic failure regardless of score."""
        self.critical_failures.append({"layer": layer, "reason": reason})

    def compute(self) -> dict:
        """Compute weighted total and normalized score."""
        weighted_total = sum(
            self.assessment[layer]["score"] * self.assessment[layer]["factor"]
            for layer in SEVEN_LAYERS
        )
        normalized = (weighted_total / TOTAL_WEIGHTED_MAX) * 100
        return {
            "weighted_total": round(weighted_total, 2),
            "weighted_max": TOTAL_WEIGHTED_MAX,
            "normalized_score": round(normalized, 2),
            "raw_max": 100,
            "penalties": self.penalties,
            "critical_failures": self.critical_failures,
            "assessment": self.assessment,
        }

    def normalized_score(self) -> float:
        """Return normalized score (0-100)."""
        result = self.compute()
        return result["normalized_score"]

    def weighted_total(self) -> float:
        """Return weighted total (0-117.5)."""
        result = self.compute()
        return result["weighted_total"]

    def disposition(self) -> str:
        """Return disposition per VGCI-1.1 standard."""
        if self.critical_failures:
            return "REJECTED"
        result = self.compute()
        normalized = result["normalized_score"]
        if normalized >= 95 and all(self.assessment[l]["score"] > 0 for l in [L130, L145, L150]):
            return "APPROVED_CANON"
        elif normalized >= 90:
            return "APPROVED_VISUALIZATION"
        elif normalized >= 75:
            return "CONDITIONAL_APPROVAL"
        else:
            return "REJECTED"


class L150CanonGovernance:
    """L150 Canon Governance: Validate that an artifact does not become canon
    without explicit authorization.

    Key rules (per L115_L150_CANON.md):
    - "Generation is not canon. Verification is not authorization."
    - "A canon change requires explicit approval and recoverable provenance."
    - L150 governs official AFTER HUMANITY canon.
    """

    def __init__(self, authorizer: str | None = None, authorization_evidence: str | None = None):
        self.authorizer = authorizer
        self.authorization_evidence = authorization_evidence
        self.decisions: list[dict] = []

    def record_decision(
        self,
        artifact_id: str,
        decision: str,
        justification: str,
        canon_status: str,
        authorizer: str | None = None,
        authorization_evidence: str | None = None,
    ) -> dict:
        """Record a canon status decision.

        Args:
            artifact_id: The artifact being decided.
            decision: 'authorized' or 'rejected'.
            justification: Why the decision was made.
            canon_status: 'established', 'proposed', 'uncertain', 'authorized'.
            authorizer: Who authorized the decision (optional).
            authorization_evidence: Supporting evidence (optional).

        Returns:
            The recorded decision dict.
        """
        if decision not in ("authorized", "rejected"):
            raise ValueError("Decision must be 'authorized' or 'rejected'")

        decision_record = {
            "artifact_id": artifact_id,
            "decision": decision,
            "justification": justification,
            "canon_status": canon_status,
            "authorizer": authorizer or self.authorizer,
            "authorization_evidence": authorization_evidence,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "governing_rule": "Generation is not canon. Verification is not authorization.",
        }
        self.decisions.append(decision_record)
        return decision_record

    def authorize_canon_change(self, artifact_id: str, justification: str, evidence: str) -> dict:
        """Authorize a canon change. Requires explicit authorizer and evidence.

        This is the L150 Canon Governance authority. Only authorized governance
        action can establish canon. A score or visual approval cannot substitute
        for authorization.
        """
        if not self.authorizer:
            raise L150IGPCanonViolationError("L150 authorization requires an explicit authorizer")
        if not evidence:
            raise L150IGPCanonViolationError("L150 authorization requires recoverable provenance")

        return self.record_decision(
            artifact_id=artifact_id,
            decision="authorized",
            justification=justification,
            canon_status="established",
            authorizer=self.authorizer,
            authorization_evidence=evidence,
        )

    def can_artifact_become_canon(self, artifact_id: str, has_authorization: bool, score: float) -> bool:
        """Determine if an artifact can become canon.

        A numerical threshold is necessary where specified but never sufficient
        to override a mandatory gate. Only explicit authorization can establish canon.
        """
        return has_authorization


class MVAStarter:
    """Modular Visual Architecture (MVA) Starter: integrates L120-IGP composition
    with L150 canon governance for the after-humanity visual system.

    The MVA Starter implements the procedural pipeline:
      1. L120-IGP composition (asymmetric cinematic mosaic)
      2. L150 governance validation (authorization check)
      3. Output: structured generation instructions
    """

    def __init__(self, specification_version: str = "1.0.0", authorizer: str | None = None):
        self.specification_version = specification_version
        self.composition_engine = L120IGPCompositionEngine(specification_version)
        self.scoring = VGCI11ScoringSystem()
        self.governance = L150CanonGovernance(authorizer=authorizer)

    def compose(self, **kwargs) -> dict:
        """Run the L120-IGP composition pipeline."""
        return self.composition_engine.compose(**kwargs)

    def validate(self, artifact_id: str, has_authorization: bool, score: float) -> bool:
        """Validate whether an artifact can become canon."""
        return self.governance.can_artifact_become_canon(artifact_id, has_authorization, score)

    def generate_instructions(self, composition: dict, scoring_results: dict) -> dict:
        """Generate structured generation instructions from composition and scoring."""
        return {
            "composition_id": composition.get("composition_id"),
            "world_id": composition.get("world_id"),
            "generated_at": composition.get("generated_at"),
            "generation_instructions": {
                "composition_type": composition.get("composition_type"),
                "central_subject": composition.get("central_subject", {}),
                "narrative_tracks": composition.get("narrative_tracks", []),
                "analytical_tracks": composition.get("analytical_tracks", []),
                "visual_hierarchy": composition.get("visual_hierarchy"),
                "reading_architecture": composition.get("reading_architecture"),
            },
            "scoring": scoring_results,
            "canon_status": composition.get("status"),
        }
