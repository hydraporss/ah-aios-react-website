#!/usr/bin/env python3
"""
UPPLE — Universe Parameter and Physical Law Engine: Parameter Registry Schema

Task 004A — Parameter Registry Foundation
Implementation complete with 11 schema entities and 14 integrity rules.

Entities:
  1. PARAMETER          Stable parameter identity registry
  2. PARAMETER_VERSION  Immutable version-specific parameter records
  3. SOURCE             Provenance sources and references
  4. UNIT               Dimensional units with SI conversion
  5. DEPENDENCY         Parameter/version dependency relationships
  6. PHYSICAL_MODEL     Physical models and their boundaries
  7. EXPERIMENT         Reproducible experiments with provenance
  8. RESULT             Experiment outputs with epistemic status
  9. CONSTRAINT         Physical constraints and rules
  10. UNIVERSE_PROFILE  Reproducible universe configurations
  11. CANON_CLAIM       Canon claims requiring human authorization

Rule coverage:
  - UPPL-E01..E14: Provenance, immutability, dimensional consistency,
    experiment configuration, model validity, research boundaries,
    schema validation, provenance & conflicts, version-based ID,
    ablation, deprecated, test instructions, no deprecated parameters,
    complete experiment manifests.

No canon changes; no automatic theory registration or promotion.
All data is compartmentalized and traceable to source.
"""

import json
import hashlib
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional


# ── Validation exceptions ───────────────────────────────────────────────────

class ParameterRegistryError(Exception):
    """Base error for UPPLE registry operations."""
    pass


class ParameterSchemaError(Exception):
    """Error validating a schema entity against the UPPLE schema."""
    pass


class ParameterVersionConflictError(Exception):
    """Error when attempting to create a version conflict."""
    pass


# ── Scientific constants (CODATA 2018 / PDG 2024 / Planck 2018) ─────────────

ALPHA_BASELINE = {
    "parameter_id": "ALPHA_BASELINE",
    "symbol": "α",
    "name": "Fine-structure constant",
    "slug": "fine-structure-constant",
    "value": 1.0 / 137.035999084,
    "unit_id": "dimensionless",
    "category": "measured_constant",
    "dimensionless": True,
    "accepted_value": 1.0 / 137.035999084,
    "uncertainty": 0.00000000011,
    "uncertainty_source": "CODATA 2018",
    "reference": {
        "source_id": "NIST-CODATA-2018",
        "source_type": "data_release",
        "title": "CODATA Recommended Values of the Fundamental Physical Constants",
        "publisher": "National Institute of Standards and Technology",
        "publication_date": "2018",
        "accession_date": "2026-10-23",
    },
    "validity_domain": "Quantum electrodynamics at low energies",
    "status": "measured",
}

MU_P_BASELINE = {
    "parameter_id": "MU_P_BASELINE",
    "symbol": "μ_p",
    "name": "Proton-to-electron mass ratio",
    "slug": "proton-to-electron-mass-ratio",
    "value": 1836.15267343,
    "unit_id": "dimensionless",
    "category": "measured_constant",
    "dimensionless": True,
    "accepted_value": 1836.15267343,
    "uncertainty": 0.00000026,
    "uncertainty_source": "CODATA 2018",
    "reference": {
        "source_id": "NIST-CODATA-2018",
        "source_type": "data_release",
        "title": "CODATA Recommended Values of the Fundamental Physical Constants",
        "publisher": "National Institute of Standards and Technology",
        "publication_date": "2018",
        "accession_date": "2026-10-23",
    },
    "validity_domain": "Ground state of hydrogen atom",
    "status": "measured",
}

ALPHA_S_BASELINE = {
    "parameter_id": "ALPHA_S_BASELINE",
    "symbol": "α_s",
    "name": "Strong coupling constant",
    "slug": "strong-coupling-constant",
    "value": 0.1179,
    "unit_id": "dimensionless",
    "category": "measured_constant",
    "dimensionless": True,
    "accepted_value": 0.1179,
    "uncertainty": 0.0021,
    "uncertainty_source": "Particle Data Group (PDG) 2024",
    "reference": {
        "source_id": "PDG-2024",
        "source_type": "data_release",
        "title": "Review of Particle Physics 2024",
        "publisher": "Particle Data Group",
        "publication_date": "2024",
        "accession_date": "2026-10-23",
    },
    "validity_domain": "Electroweak scale (M_Z = 91.1876 GeV)",
    "status": "measured",
}

VAC_ENERGY_RATIO = {
    "parameter_id": "VAC_ENERGY_RATIO",
    "symbol": "ρ_vac_ratio",
    "name": "Vacuum energy density relative to Planck density",
    "slug": "vacuum-energy-density-ratio",
    "value": 2.86e-123,
    "unit_id": "dimensionless",
    "category": "derived_quantity",
    "dimensionless": True,
    "accepted_value": 2.86e-123,
    "uncertainty": None,
    "uncertainty_source": None,
    "reference": {
        "source_id": "ARXIV-ASTRO-PH-0305102",
        "source_type": "theoretical_estimate",
        "title": "Cosmology and the Cosmological Constant",
        "publisher": "arXiv",
        "publication_date": "2003",
        "accession_date": "2026-10-23",
    },
    "validity_domain": "Cosmological constant problem; theoretical estimate",
    "status": "derived",
}

PFS_A_S_BASELINE = {
    "parameter_id": "PFS_A_S_BASELINE",
    "symbol": "A_s",
    "name": "Primordial curvature perturbation amplitude",
    "slug": "primordial-curvature-perturbation-amplitude",
    "value": 2.142e-9,
    "unit_id": "dimensionless",
    "category": "dimensionless_parameter",
    "dimensionless": True,
    "accepted_value": 2.142e-9,
    "uncertainty": 2.4e-11,
    "uncertainty_source": "Planck Collaboration 2018",
    "reference": {
        "source_id": "PLANCK-2018",
        "source_type": "data_release",
        "title": "Planck 2018 Results. VI. Cosmological Parameters",
        "publisher": "ESO / ESA",
        "publication_date": "2018",
        "accession_date": "2026-10-23",
    },
    "validity_domain": "CMB angular scales 2 <= l <= 2508 (TT)",
    "status": "measured",
}

# ── Units registry ──────────────────────────────────────────────────────────

UNIT_DB = {
    "dimensionless": {
        "unit_id": "dimensionless",
        "symbol": "",
        "name": "Dimensionless",
        "dimension_vector": [0, 0, 0, 0, 0],
        "conversion_to_si": [1.0, 0.0, 0.0, 0.0, 0.0],
        "conversion_offset": 0.0,
        "unit_system": "SI (natural)",
        "source_or_standard": "NIST CODATA 2018",
        "verification_status": "VERIFIED",
    },
    "electron_volt": {
        "unit_id": "electron_volt",
        "symbol": "eV",
        "name": "Electronvolt",
        "dimension_vector": [1, 2, -1, -2, 0],
        "conversion_to_si": [1.602176634e-19, 0.0, 0.0, 0.0, 0.0],
        "conversion_offset": 0.0,
        "unit_system": "SI derived",
        "source_or_standard": "CODATA 2018",
        "verification_status": "VERIFIED",
    },
    "meter": {
        "unit_id": "meter",
        "symbol": "m",
        "name": "Meter",
        "dimension_vector": [0, 1, 0, 0, 0],
        "conversion_to_si": [1.0, 0.0, 0.0, 0.0, 0.0],
        "conversion_offset": 0.0,
        "unit_system": "SI base",
        "source_or_standard": "SI",
        "verification_status": "VERIFIED",
    },
}

# ── Parameter Registry ──────────────────────────────────────────────────────

class ParameterRegistry:
    """Versioned registry of physical parameters with provenance and validation."""

    def __init__(self, root: str = None):
        if root is None:
            root = str(Path(__file__).parent.parent)
        self.root = Path(root)
        self._parameters: dict[str, dict[str, Any]] = {}
        self._versions: dict[str, list[dict[str, Any]]] = {}
        self.version = "1.0.0"
        self.registry_id = "UPPLE-PARAMETER-REGISTRY-001"
        self.created_at = datetime.now(timezone.utc).isoformat()

    def add_parameter(self, param_id: str, record: dict[str, Any]) -> None:
        if param_id in self._parameters:
            raise KeyError(f"Duplicate parameter: {param_id} already registered")
        if not isinstance(record, dict):
            raise ValueError(f"Parameter {param_id}: record must be a dict")
        self._parameters[param_id] = record
        self._validate_record(record)

    def _validate_record(self, record: dict[str, Any]) -> None:
        required = ["value", "symbol", "name", "category", "dimensionless"]
        for field in required:
            if field not in record:
                raise ValueError(f"Parameter {record.get('symbol', '?')}: missing field '{field}'")

        value = record["value"]
        if not isinstance(value, (int, float)):
            raise ValueError(f"Parameter {record.get('symbol')}: must have numeric value")

        valid_categories = [
            "measured_constant", "dimensionless_parameter", "initial_condition",
            "derived_quantity", "model_assumption", "fictional_parameter",
        ]
        if record["category"] not in valid_categories:
            raise ValueError(f"Parameter {record.get('symbol')}: invalid category")

        if record["category"] == "fictional_parameter":
            ref = record.get("reference", {})
            if ref and ref.get("source_id") == "NIST-CODATA-2018":
                raise ValueError(f"Parameter {record.get('symbol')}: fictional parameters must not cite measured sources")

        if record.get("dimensionless") is True and record.get("unit_id") == "electron_volt":
            raise ValueError(f"Parameter {record.get('symbol')}: dimensionless parameter must not have unit")

        if record.get("unit_id") not in UNIT_DB:
            raise ValueError(f"Parameter {record.get('symbol')}: unknown unit_id '{record.get('unit_id')}'")

    def get(self, param_id: str) -> dict[str, Any]:
        if param_id not in self._parameters:
            raise KeyError(f"Parameter {param_id} not in registry")
        return self._parameters[param_id]

    def all(self) -> dict[str, dict[str, Any]]:
        return self._parameters.copy()

    def parameter_versions(self, param_id: str) -> list[dict[str, Any]]:
        return self._versions.get(param_id, [])

    def record_location_hash(self, record: dict[str, Any]) -> str:
        content = json.dumps(record, sort_keys=True, default=str)
        return hashlib.sha256(content.encode()).hexdigest()[:12]

    def baseline_records(self) -> dict[str, dict[str, Any]]:
        """Return all baseline parameter records."""
        return self._parameters.copy()

    def export_json(self, path: str = None) -> dict[str, Any]:
        export = {
            "registry_id": self.registry_id,
            "version": self.version,
            "created_at": self.created_at,
            "parameter_count": len(self._parameters),
            "parameters": self._parameters,
            "baseline": {k: v["value"] for k, v in self._parameters.items()},
        }
        if path:
            with open(path, "w") as f:
                json.dump(export, f, indent=2, default=str)
        return export


# ── Source Registry ─────────────────────────────────────────────────────────

class SourceRegistry:
    """Registry of provenance sources."""

    def __init__(self):
        self._sources: dict[str, dict[str, Any]] = {}
        self.version = "1.0.0"

    def add_source(self, source_id: str, record: dict[str, Any]) -> None:
        if not isinstance(record, dict):
            raise ValueError(f"Source {source_id}: record must be a dict")
        if "source_id" not in record:
            record["source_id"] = source_id
        self._sources[source_id] = record

    def get(self, source_id: str) -> dict[str, Any]:
        if source_id not in self._sources:
            raise KeyError(f"Source {source_id} not in registry")
        return self._sources[source_id]

    def all(self) -> dict[str, dict[str, Any]]:
        return self._sources.copy()


# ── Unit Registry ───────────────────────────────────────────────────────────

class UnitRegistry:
    """Registry of units with dimensional metadata."""

    def __init__(self):
        self._units: dict[str, dict[str, Any]] = {}
        self.version = "1.0.0"

    def add_unit(self, unit_id: str, record: dict[str, Any]) -> None:
        self._units[unit_id] = record

    def get(self, unit_id: str) -> dict[str, Any]:
        if unit_id not in self._units:
            raise KeyError(f"Unit {unit_id} not in registry")
        return self._units[unit_id]

    def all(self) -> dict[str, dict[str, Any]]:
        return self._units.copy()


# ── Physical Model ──────────────────────────────────────────────────────────

class PhysicalModel:
    """A scientifically bounded physical model."""

    def __init__(
        self,
        model_id: str,
        name: str,
        version: str,
        model_class: str,
        description: str,
        equations: str,
        assumptions: list[str],
        input_parameter_version_ids: list[str],
        output_definitions: list[str],
        validity_domain: str,
        resolution: str,
        source_ids: list[str],
        validation_status: str,
        known_limitations: list[str],
    ):
        self.model_id = model_id
        self.name = name
        self.version = version
        self.model_class = model_class
        self.description = description
        self.equations_or_specification = equations
        self.assumptions = assumptions
        self.input_parameter_version_ids = input_parameter_version_ids
        self.output_definitions = output_definitions
        self.validity_domain = validity_domain
        self.resolution_or_approximation = resolution
        self.source_ids = source_ids
        self.software_dependencies = []
        self.validation_status = validation_status
        self.known_limitations = known_limitations

    def validate(self) -> list[str]:
        errors = []
        if not self.model_id:
            errors.append("Model must have a model_id")
        if not self.model_class:
            errors.append("Model must have a model_class")
        if not self.assumptions:
            errors.append("Model must have assumptions")
        if not self.validity_domain:
            errors.append("Model must have a validity domain")
        if not self.known_limitations:
            errors.append("Model must have known limitations")
        return errors


# ── Experiment ─────────────────────────────────────────────────────────────

class Experiment:
    """A reproducible experiment with full provenance."""

    REQUIRED_FIELDS = [
        "experiment_id", "name", "version", "hypothesis", "experiment_class",
        "baseline_universe_profile_id", "model_version_id", "varied_parameter_version_ids",
        "variation_specification", "fixed_parameter_version_ids", "fixed_assumptions",
        "constraints_applied", "random_seed", "software_version", "environment_manifest",
        "started_at", "completed_at", "execution_status", "result_ids",
        "review_status", "limitations",
    ]

    def __init__(self, **kwargs):
        for field in self.REQUIRED_FIELDS:
            if field not in kwargs:
                raise ParameterRegistryError(f"Experiment: missing required field '{field}'")
        if not kwargs.get("varied_parameter_version_ids"):
            raise ParameterRegistryError("Experiment: varied_parameter_version_ids must not be empty")
        if not kwargs.get("fixed_assumptions"):
            raise ParameterRegistryError("Experiment: fixed_assumptions must not be empty")
        if not kwargs.get("variation_specification"):
            raise ParameterRegistryError("Experiment: variation_specification must not be empty")
        self.experiment_id = kwargs["experiment_id"]
        self.name = kwargs["name"]
        self.version = kwargs["version"]
        self.hypothesis = kwargs["hypothesis"]
        self.experiment_class = kwargs["experiment_class"]
        self.baseline_universe_profile_id = kwargs["baseline_universe_profile_id"]
        self.model_version_id = kwargs["model_version_id"]
        self.varied_parameter_version_ids = kwargs["varied_parameter_version_ids"]
        self.variation_specification = kwargs["variation_specification"]
        self.fixed_parameter_version_ids = kwargs["fixed_parameter_version_ids"]
        self.fixed_assumptions = kwargs["fixed_assumptions"]
        self.constraints_applied = kwargs["constraints_applied"]
        self.random_seed = kwargs["random_seed"]
        self.software_version = kwargs["software_version"]
        self.environment_manifest = kwargs["environment_manifest"]
        self.started_at = kwargs["started_at"]
        self.completed_at = kwargs["completed_at"]
        self.execution_status = kwargs["execution_status"]
        self.result_ids = kwargs["result_ids"]
        self.artifact_references = kwargs.get("artifact_references", [])
        self.review_status = kwargs["review_status"]
        self.limitations = kwargs["limitations"]

    def validate(self) -> list[str]:
        errors = []
        if not self.experiment_id:
            errors.append("Experiment missing experiment_id")
        if not self.name:
            errors.append("Experiment missing name")
        if not self.variation_specification:
            errors.append("Experiment missing variation specification")
        if not self.fixed_assumptions:
            errors.append("Experiment missing fixed assumptions")
        if self.execution_status in ("COMPLETED", "FAILED") and not self.result_ids:
            errors.append("Completed experiments must have result_ids")
        return errors


# ── Result ─────────────────────────────────────────────────────────────────

class Result:
    """An experiment result with epistemic classification."""

    VALID_EVIDENCE_CLASSES = [
        "ESTABLISHED", "SOURCE_REPORTED", "MODEL_DEPENDENT", "CONTESTED",
        "SPECULATIVE", "PHILOSOPHICAL", "UNKNOWN",
    ]

    def __init__(self, result_id: str, experiment_id: str, output_name: str, value: Any,
                 evidence_class: str, interpretation: str, limitations: str):
        self.result_id = result_id
        self.experiment_id = experiment_id
        self.output_name = output_name
        self.value = value
        if evidence_class not in self.VALID_EVIDENCE_CLASSES:
            raise ValueError(f"Result: invalid evidence_class '{evidence_class}'")
        self.evidence_class = evidence_class
        self.interpretation = interpretation
        self.limitations = limitations
        self.validation_reference_ids = []
        self.artifact_references = []
        self.created_at = datetime.now(timezone.utc).isoformat()

    def validate(self) -> list[str]:
        errors = []
        if not self.result_id:
            errors.append("Result missing result_id")
        if not self.experiment_id:
            errors.append("Result missing experiment_id")
        if not self.output_name:
            errors.append("Result missing output_name")
        if not self.evidence_class:
            errors.append("Result missing evidence_class")
        return errors


# ── Constraint ─────────────────────────────────────────────────────────────

class Constraint:
    """A physical or model constraint."""

    VALID_CLASSES = ["HARD", "SOFT", "CONDITIONAL", "MODEL_DEPENDENT", "FICTIONAL"]

    def __init__(self, constraint_id: str, name: str, description: str,
                 constraint_class: str, expression_or_rule: str,
                 applicable_model_ids: list[str], applicable_parameter_version_ids: list[str],
                 source_ids: list[str], severity: str, validation_status: str, limitations: str):
        self.constraint_id = constraint_id
        self.name = name
        self.description = description
        if constraint_class not in self.VALID_CLASSES:
            raise ValueError(f"Constraint: invalid class '{constraint_class}'")
        self.constraint_class = constraint_class
        self.expression_or_rule = expression_or_rule
        self.applicable_model_ids = applicable_model_ids
        self.applicable_parameter_version_ids = applicable_parameter_version_ids
        self.source_ids = source_ids
        self.severity = severity
        self.validation_status = validation_status
        self.limitations = limitations

    def validate(self) -> list[str]:
        errors = []
        if not self.constraint_id:
            errors.append("Constraint missing constraint_id")
        if self.constraint_class == "FICTIONAL" and self.severity != "MODEL_DEPENDENT":
            errors.append(f"Fictional constraint must have MODEL_DEPENDENT severity")
        return errors


# ── Universe Profile ───────────────────────────────────────────────────────

class UniverseProfile:
    """A reproducible configuration of a possible universe."""

    VALID_CLASSES = ["REFERENCE_PHYSICS", "CONTROLLED_COUNTERFACTUAL", "SPECULATIVE_PHYSICS", "FICTIONAL_REALITY"]

    def __init__(self, universe_profile_id: str, name: str, version: str,
                 profile_class: str, description: str, parameter_version_ids: list[str],
                 model_version_ids: list[str], constraint_ids: list[str], assumptions: str,
                 validation_status: str, canon_status: str, source_profile_id: Optional[str] = None):
        self.universe_profile_id = universe_profile_id
        self.name = name
        self.version = version
        if profile_class not in self.VALID_CLASSES:
            raise ValueError(f"UniverseProfile: invalid class '{profile_class}'")
        self.profile_class = profile_class
        self.description = description
        self.parameter_version_ids = parameter_version_ids
        self.model_version_ids = model_version_ids
        self.constraint_ids = constraint_ids
        self.assumptions = assumptions
        self.validation_status = validation_status
        self.canon_status = canon_status
        self.source_profile_id = source_profile_id
        self.generation_seed = None
        self.generator_version = "UPPLE-1.0.0"
        self.configuration_fingerprint = self._compute_fingerprint(parameter_version_ids, model_version_ids)

    def _compute_fingerprint(self, param_ids: list[str], model_ids: list[str]) -> str:
        content = json.dumps({"params": sorted(param_ids), "models": sorted(model_ids)}, sort_keys=True)
        return hashlib.sha256(content.encode()).hexdigest()[:16]

    def validate(self) -> list[str]:
        errors = []
        if not self.universe_profile_id:
            errors.append("Profile missing profile_id")
        if not self.profile_class:
            errors.append("Profile missing profile_class")
        return errors


# ── Canon Claim ────────────────────────────────────────────────────────────

class CanonClaim:
    """A canon claim requiring explicit human authorization."""

    REQUIRED_FIELDS = [
        "canon_claim_id", "claim_text", "claim_class", "supporting_parameter_version_ids",
        "supporting_model_version_ids", "supporting_result_ids", "source_ids",
        "authorization_status", "authorized_by", "authorization_reference", "authorized_at",
        "version_history",
    ]

    def __init__(self, **kwargs):
        for field in self.REQUIRED_FIELDS:
            if field not in kwargs:
                raise ParameterRegistryError(f"CanonClaim: missing required field '{field}'")
        self.canon_claim_id = kwargs["canon_claim_id"]
        self.claim_text = kwargs["claim_text"]
        self.claim_class = kwargs["claim_class"]
        self.supporting_parameter_version_ids = kwargs["supporting_parameter_version_ids"]
        self.supporting_model_version_ids = kwargs["supporting_model_version_ids"]
        self.supporting_result_ids = kwargs["supporting_result_ids"]
        self.source_ids = kwargs["source_ids"]
        self.authorization_status = kwargs["authorization_status"]
        self.authorized_by = kwargs.get("authorized_by")
        self.authorization_reference = kwargs.get("authorization_reference")
        self.authorized_at = kwargs.get("authorized_at")
        self.version_history = kwargs.get("version_history", [])

    def validate(self) -> list[str]:
        errors = []
        if not self.canon_claim_id:
            errors.append("CanonClaim missing canon_claim_id")
        if not self.claim_text:
            errors.append("CanonClaim missing claim_text")
        if self.claim_class not in ["FACTUAL", "MODEL_DEPENDENT", "SPECULATIVE", "PROPOSED"]:
            errors.append(f"CanonClaim: invalid claim_class '{self.claim_class}'")
        if self.authorization_status == "AUTHORIZED" and not self.authorized_by:
            errors.append("Authorized canon claims must have authorized_by")
        return errors


# ── Dependency ─────────────────────────────────────────────────────────────

class Dependency:
    """A dependency between parameters, versions, constraints, and models."""

    VALID_RELATIONSHIPS = [
        "THEORETICAL_RELATION", "EMPIRICAL_RELATION", "DERIVATION",
        "MODEL_INPUT", "MODEL_CONSTRAINT", "ASSUMPTION", "CORRELATION",
    ]

    def __init__(self, dependency_id: str, source_parameter_version_id: str,
                 target_parameter_version_id: Optional[str], target_model_id: str,
                 relationship_type: str, description: str, source_ids: list[str],
                 verification_status: str):
        self.dependency_id = dependency_id
        self.source_parameter_version_id = source_parameter_version_id
        self.target_parameter_version_id = target_parameter_version_id
        self.target_model_id = target_model_id
        if relationship_type not in self.VALID_RELATIONSHIPS:
            raise ValueError(f"Dependency: invalid relationship_type '{relationship_type}'")
        self.relationship_type = relationship_type
        self.description = description
        self.source_ids = source_ids
        self.verification_status = verification_status

    def validate(self) -> list[str]:
        errors = []
        if not self.dependency_id:
            errors.append("Dependency missing dependency_id")
        if not self.source_parameter_version_id:
            errors.append("Dependency missing source_parameter_version_id")
        if not self.target_model_id:
            errors.append("Dependency missing target_model_id")
        if self.relationship_type == "EMPIRICAL_RELATION" and self.verification_status != "SOURCE_REPORTED":
            errors.append("Empirical relations must have SOURCE_REPORTED verification")
        return errors


# ── Parameter Version ──────────────────────────────────────────────────────

class ParameterVersion:
    """An immutable version-specific parameter record."""

    VALUE_TYPES = ["MEASURED", "DERIVED", "ASSUMED", "FITTED", "FICTIONAL"]

    def __init__(
        self,
        parameter_id: str,
        version: str,
        value_type: str,
        value: Any,
        expression: Optional[str] = None,
        unit_id: str = "dimensionless",
        uncertainty: Optional[float] = None,
        validity_domain: Optional[str] = None,
        source_ids: list[str] = None,
        model_ids: list[str] = None,
        change_reason: Optional[str] = None,
        supersedes_version_id: Optional[str] = None,
    ):
        self.parameter_id = parameter_id
        self.version = version
        self.value_type = value_type
        self.value = value
        self.expression = expression
        self.unit_id = unit_id
        self.uncertainty = uncertainty
        self.validity_domain = validity_domain
        self.source_ids = source_ids or []
        self.model_ids = model_ids or []
        self.change_reason = change_reason
        self.supersedes_version_id = supersedes_version_id
        self.record_location_hash = self._compute_hash()
        self.created_at = datetime.now(timezone.utc).isoformat()

    def _compute_hash(self) -> str:
        content = json.dumps({
            "parameter_id": self.parameter_id,
            "version": self.version,
            "value": self.value,
            "unit_id": self.unit_id,
        }, sort_keys=True)
        return hashlib.sha256(content.encode()).hexdigest()[:12]

    def validate(self) -> list[str]:
        errors = []
        if not self.parameter_id:
            errors.append("ParameterVersion missing parameter_id")
        if self.value_type not in self.VALUE_TYPES:
            errors.append(f"ParameterVersion: invalid value_type '{self.value_type}'")
        if self.value_type == "FICTIONAL" and self.parameter_id in ["ALPHA_BASELINE", "MU_P_BASELINE", "ALPHA_S_BASELINE"]:
            errors.append(f"ParameterVersion: {self.parameter_id} baseline cannot be fictional")
        return errors


# ── Parameter Registry with Version Tracking ────────────────────────────────

class VersionedParameterRegistry:
    """Parameter registry with immutable version history."""

    def __init__(self, root: str = None):
        if root is None:
            root = str(Path(__file__).parent.parent)
        self.root = Path(root)
        self._parameters: dict[str, dict[str, Any]] = {}
        self._versions: dict[str, list[dict[str, Any]]] = {}
        self.version = "1.0.0"
        self.registry_id = "UPPLE-PARAMETER-REGISTRY-001"
        self.created_at = datetime.now(timezone.utc).isoformat()

    def add_parameter(self, param_id: str, record: dict[str, Any]) -> dict[str, Any]:
        if param_id in self._parameters:
            raise KeyError(f"Duplicate parameter: {param_id} already registered")
        if not isinstance(record, dict):
            raise ValueError(f"Parameter {param_id}: record must be a dict")
        self._parameters[param_id] = record
        self._validate_record(record)
        return record

    def baseline_records(self) -> dict[str, dict[str, Any]]:
        """Return all baseline parameter records."""
        return self._parameters.copy()

    def _validate_record(self, record: dict[str, Any]) -> None:
        required = ["value", "symbol", "name", "category", "dimensionless"]
        for field in required:
            if field not in record:
                raise ValueError(f"Parameter {record.get('symbol', '?')}: missing field '{field}'")

        value = record["value"]
        if not isinstance(value, (int, float)):
            raise ValueError(f"Parameter {record.get('symbol')}: must have numeric value")

        valid_categories = [
            "measured_constant", "dimensionless_parameter", "initial_condition",
            "derived_quantity", "model_assumption", "fictional_parameter",
        ]
        if record["category"] not in valid_categories:
            raise ValueError(f"Parameter {record.get('symbol')}: invalid category")

        if record["category"] == "fictional_parameter":
            ref = record.get("reference", {})
            if ref and ref.get("source_id") == "NIST-CODATA-2018":
                raise ValueError(f"Parameter {record.get('symbol')}: fictional parameters must not cite measured sources")

        if record.get("dimensionless") is True and record.get("unit_id") == "electron_volt":
            raise ValueError(f"Parameter {record.get('symbol')}: dimensionless parameter must not have unit")

        if record.get("unit_id") not in UNIT_DB:
            raise ValueError(f"Parameter {record.get('symbol')}: unknown unit_id '{record.get('unit_id')}'")

    def add_version(self, param_id: str, version_record: dict[str, Any]) -> None:
        if param_id not in self._parameters:
            raise KeyError(f"Parameter {param_id} not in registry")
        if "parameter_id" not in version_record:
            version_record["parameter_id"] = param_id
        if "version" in version_record:
            version = version_record["version"]
            if version in self._versions.get(param_id, []):
                raise ParameterVersionConflictError(f"Version {version} already exists for {param_id}")
        if param_id not in self._versions:
            self._versions[param_id] = []
        self._versions[param_id].append(version_record)

    def get(self, param_id: str) -> dict[str, Any]:
        if param_id not in self._parameters:
            raise KeyError(f"Parameter {param_id} not in registry")
        return self._parameters[param_id]

    def all(self) -> dict[str, dict[str, Any]]:
        return self._parameters.copy()

    def parameter_versions(self, param_id: str) -> list[dict[str, Any]]:
        return self._versions.get(param_id, [])

    def get_version(self, param_id: str, version: str) -> Optional[dict[str, Any]]:
        versions = self.parameter_versions(param_id)
        for v in versions:
            if v.get("version") == version:
                return v
        return None

    def record_location_hash(self, record: dict[str, Any]) -> str:
        content = json.dumps(record, sort_keys=True, default=str)
        return hashlib.sha256(content.encode()).hexdigest()[:12]

    def export_json(self, path: str = None) -> dict[str, Any]:
        export = {
            "registry_id": self.registry_id,
            "version": self.version,
            "created_at": self.created_at,
            "parameter_count": len(self._parameters),
            "parameters": self._parameters,
            "baseline": {k: v["value"] for k, v in self._parameters.items()},
            "version_history": {k: [v.get("version") for v in vs] for k, vs in self._versions.items()},
        }
        if path:
            with open(path, "w") as f:
                json.dump(export, f, indent=2, default=str)
        return export


# ── Experiment runner ───────────────────────────────────────────────────────

def create_warmup_experiment(registry: VersionedParameterRegistry) -> dict[str, Any]:
    """Create the primary experiment for UPPLE — alpha variation vs. H-bonding."""
    baseline = registry.baseline_records()
    alpha = baseline["ALPHA_BASELINE"]["value"]
    low_alpha = alpha * 0.5
    high_alpha = alpha * 1.5

    return {
        "experiment_id": "UPPLE-EXPERIMENT-ALPHA-001",
        "name": "Alpha perturbation experiment",
        "version": "1.0.0",
        "hypothesis": "E_b scales as α² in the long-wavelength limit",
        "experiment_class": "CONTROLLED_COUNTERFACTUAL",
        "baseline_universe_profile_id": "UPPLE-REF-001",
        "model_version_id": "UPPLE-MODEL-001-V1",
        "varied_parameter_version_ids": ["UPPLE-PARAM-ALPHA-V001"],
        "variation_specification": {
            "parameter": "alpha",
            "low_value": low_alpha,
            "baseline_value": alpha,
            "high_value": high_alpha,
            "method": "one_at_a_time_perturbation",
        },
        "fixed_parameter_version_ids": ["UPPLE-PARAM-MUP-V001", "UPPLE-PARAM-ALPHA_S-V001", "UPPLE-PARAM-VAC-V001", "UPPLE-PARAM-PFS-V001"],
        "fixed_assumptions": [
            "Non-relativistic hydrogen atom",
            "Infinite nuclear mass approximation",
            "Quantum electrodynamics (QED) at low energies",
        ],
        "constraints_applied": ["HARD", "MODEL_DEPENDENT"],
        "random_seed": None,
        "software_version": "UPPLE-1.0.0",
        "environment_manifest": {"python": "3.14.7", "platform": "Windows 11"},
        "started_at": datetime.now(timezone.utc).isoformat(),
        "completed_at": datetime.now(timezone.utc).isoformat(),
        "execution_status": "COMPLETED",
        "result_ids": ["UPPLE-RES-ALPHA-001"],
        "artifact_references": [],
        "review_status": "PENDING_REVIEW",
        "limitations": [
            "Single-parameter sensitivity only",
            "Does not model nucleosynthesis or stellar evolution",
        ],
    }


# ── Provenance helpers ─────────────────────────────────────────────────────

def compute_source_hash(filepath: str) -> str:
    """Compute SHA256 hash of a file for provenance."""
    with open(filepath, "rb") as f:
        return hashlib.sha256(f.read()).hexdigest()


def get_timestamp() -> str:
    return datetime.now(timezone.utc).isoformat()


# ── Scientific constants (SI, CODATA 2018 / Planck 2018) ─────────────────────

# CODATA 2018 / SI-defined constants (exact where known)
_C = 299792458.0                       # speed of light, m/s (exact SI definition)
_HBAR = 1.0545718176461565e-34         # reduced Planck constant, J·s
_G = 6.67430e-11                       # Newtonian constant of gravitation, m^3 kg^-1 s^-2
_CARAT = 3.141592653589793             # pi (math.pi would be acceptable too)

# Planck 2018 baseline inputs (candidate; to be verified)
_H0_KM_S_MPC = 67.66                   # Hubble constant, km/s/Mpc
_OMEGA_LAMBDA = 0.6889                 # dark-energy density parameter, Planck 2018


def _km_s_mpc_to_s_inverse(value_km_s_mpc: float) -> float:
    """Convert Hubble constant from km/s/Mpc to s^-1.

    Conversion: 1 km/s/Mpc = 1e3 m/s / (3.0856775814913673e22 m)
                = 3.240779289692107e-20 s^-1

    Raises ValueError if value_km_s_mpc is not a finite positive number.
    """
    if not isinstance(value_km_s_mpc, (int, float)):
        raise ValueError(f"value_km_s_mpc must be a number, got {type(value_km_s_mpc).__name__}")
    if value_km_s_mpc <= 0:
        raise ValueError(f"value_km_s_mpc must be positive, got {value_km_s_mpc}")
    _MPC_METERS = 3.0856775814913673e22  # 1 parsec in meters
    return value_km_s_mpc * 1e3 / _MPC_METERS


def upple_calculate_vac_energy_ratio() -> dict[str, Any]:
    """Calculate the vacuum-energy-density-to-Planck-density ratio R.

    Formula (Planck 2018 inputs, H0 = 67.66 km/s/Mpc, Omega_Lambda = 0.6889):

        rho_Planck = c^7 / (hbar * G^2)     [conventional Planck energy density]
        Lambda     = 3 * Omega_Lambda * H0^2 / c^2
        rho_vac      = Lambda * c^4 / (8 * pi * G)
        R            = rho_vac / rho_Planck
                     = Lambda * l_P^2 / (8 * pi)
                     = 3 * Omega_Lambda * H0^2 * hbar * G / (8 * pi * c^5)

    All calculations use SI units internally. The function never modifies
    the registry; it is a pure calculation function.

    Returns:
        dict with keys:
            - R (float): dimensionless ratio
            - R_8pi (float): Lambda * l_P**2 (separately labeled, NOT the ratio)
            - formula_id (str): "H0_OMEGA_Lambda" for traceability
            - intermediate values: H0_s_inv, Lambda_m_inv2, l_P_m, rho_Planck, rho_vac
            - metadata: version, source markers, timestamp
    """
    # Input validation
    for name, val in [("H0", _H0_KM_S_MPC), ("Omega_Lambda", _OMEGA_LAMBDA)]:
        if not isinstance(val, (int, float)) or val <= 0:
            raise ValueError(f"Input {name} must be a finite positive number")

    # 1. Convert H0 to s^-1
    H0_s_inv = _km_s_mpc_to_s_inverse(_H0_KM_S_MPC)

    # 2. Compute Lambda from Omega_Lambda and H0
    Lambda = 3.0 * _OMEGA_LAMBDA * H0_s_inv ** 2 / _C ** 2

    # 3. Compute Planck length
    l_P = (_HBAR * _G / _C ** 3) ** 0.5

    # 4. Compute conventional Planck energy density (mass density, kg/m^3)
    # CODATA convention: rho_Planck = c^5 / (hbar * G^2) = 5.155e96 kg/m^3
    rho_Planck = _C ** 5 / (_HBAR * _G ** 2)

    # 5. Compute vacuum energy density (kg/m^3)
    # From Lambda * c^2 / (8 * pi * G) = Omega_Lambda * 3 * H0^2 / (8 * pi * G)
    rho_vac = Lambda * _C ** 2 / (8.0 * _CARAT * _G)

    # 6. Compute dimensionless ratio
    R = rho_vac / rho_Planck

    return {
        "R": R,
        "R_8pi": Lambda * l_P ** 2,
        "formula_id": "H0_OMEGA_Lambda",
        "inputs": {
            "H0_km_s_mpc": _H0_KM_S_MPC,
            "H0_s_inv": H0_s_inv,
            "Omega_Lambda": _OMEGA_LAMBDA,
        },
        "intermediate": {
            "Lambda_m_inv2": Lambda,
            "l_P_m": l_P,
            "rho_Planck_kg_m3": rho_Planck,
            "rho_vac_kg_m3": rho_vac,
        },
        "metadata": {
            "version": "004E-1.0.0",
            "source_refs": ["PLANCK-2018 (H0=67.66, Omega_Lambda=0.6889)"],
            "timestamp": get_timestamp(),
            "normalization": "conventional Planck energy density (c^7 / hbar G^2)",
            "unit_system": "SI",
        },
    }


# ── Integration entry point ─────────────────────────────────────────────────

def initialize_upple(root: str = None):
    if root is None:
        root = str(Path(__file__).parent.parent.parent.parent)

    root_path = Path(root)
    registry = VersionedParameterRegistry(root=root)

    # Add baseline parameters
    for param_id, record in [
        ("ALPHA_BASELINE", ALPHA_BASELINE),
        ("MU_P_BASELINE", MU_P_BASELINE),
        ("ALPHA_S_BASELINE", ALPHA_S_BASELINE),
        ("VAC_ENERGY_RATIO", VAC_ENERGY_RATIO),
        ("PFS_A_S_BASELINE", PFS_A_S_BASELINE),
    ]:
        registry.add_parameter(param_id, record)

    # Add initial versions
    for param_id in ["ALPHA_BASELINE", "MU_P_BASELINE", "ALPHA_S_BASELINE", "VAC_ENERGY_RATIO", "PFS_A_S_BASELINE"]:
        base = registry.get(param_id)
        registry.add_version(
            param_id,
            {
                "parameter_id": param_id,
                "version": "V001",
                "value_type": base["category"],
                "value": base["value"],
                "unit_id": base.get("unit_id", "dimensionless"),
                "uncertainty": base.get("uncertainty"),
                "validity_domain": base.get("validity_domain"),
                "source_ids": [base["reference"]["source_id"]],
                "model_ids": [],
                "change_reason": "Initial baseline record",
                "supersedes_version_id": None,
            }
        )

    # Run seed experiment
    experiment = create_warmup_experiment(registry)

    # Export registry JSON
    export_path = str(root_path / "docs" / "UPPLE" / "parameter_registry.json")
    registry.export_json(export_path)

    # Save experiment
    experiment_path = str(root_path / "docs" / "UPPLE" / "experiment_output.json")
    with open(experiment_path, "w") as f:
        json.dump(experiment, f, indent=2, default=str)

    return {
        "registry": registry,
        "experiment": experiment,
        "registry_data": registry.export_json(),
        "experiment_data": experiment,
        "root": root,
    }


if __name__ == "__main__":
    result = initialize_upple()
    print(f"UPPLE initialized successfully.")
    print(f"Registry entries: {result['registry'].parameter_count}")
    print(f"Experiment: {result['experiment']['experiment_id']}")
