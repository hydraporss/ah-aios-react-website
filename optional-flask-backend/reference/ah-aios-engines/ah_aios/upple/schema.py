#!/usr/bin/env python3
"""
UPPLE — Parameter Registry Schema: Schema definitions and validators.

This module defines the schema contracts for the Task 004A parameter registry.
"""

from typing import Any


# ── Schema validators ───────────────────────────────────────────────────────

def validate_parameter_record(record: dict[str, Any]) -> list[str]:
    """
    Validate a parameter record against the UPPLE schema.
    Returns a list of error messages (empty if valid).
    """
    errors = []
    required = ["value", "symbol", "name", "category", "dimensionless"]
    for field in required:
        if field not in record:
            errors.append(f"Missing required field: '{field}'")

    if errors:
        return errors

    if not isinstance(record["value"], (int, float)):
        errors.append("Value must be numeric")

    if record.get("dimensionless") is True:
        if record.get("unit_id") != "dimensionless":
            errors.append("Dimensionless parameter must have unit_id='dimensionless'")
        elif record.get("unit_id") not in UNIT_DB:
            errors.append(f"Unit '{record.get('unit_id')}' is not a registered unit")

    if record.get("category") == "measured_constant" and record.get("uncertainty") is not None:
        if not isinstance(record["uncertainty"], (int, float)):
            errors.append("Uncertainty must be numeric for measured constants")

    if record["category"] == "fictional_parameter":
        ref = record.get("reference", {})
        if ref.get("source_id") == "NIST-CODATA-2018":
            errors.append("Fictional parameter must not cite measured sources")

    return errors


def validate_experiment_record(record: dict[str, Any]) -> list[str]:
    """Validate an experiment record."""
    errors = []
    required = [
        "experiment_id", "name", "version", "hypothesis", "experiment_class",
        "baseline_universe_profile_id", "model_version_id",
        "varied_parameter_version_ids", "variation_specification",
        "fixed_parameter_version_ids", "fixed_assumptions",
        "constraints_applied", "random_seed", "software_version",
        "environment_manifest", "started_at", "completed_at",
        "execution_status", "result_ids", "review_status", "limitations",
    ]
    for field in required:
        if field not in record:
            errors.append(f"Missing required field: '{field}'")
    return errors


def validate_universe_profile(profile: dict[str, Any]) -> list[str]:
    """Validate a universe profile record."""
    errors = []
    valid_classes = ["REFERENCE_PHYSICS", "CONTROLLED_COUNTERFACTUAL", "SPECULATIVE_PHYSICS", "FICTIONAL_REALITY"]
    if profile.get("profile_class") not in valid_classes:
        errors.append(f"Invalid profile_class: '{profile.get('profile_class')}'")
    return errors


def validate_canons(claim: dict[str, Any]) -> list[str]:
    """Validate a canon claim record."""
    errors = []
    valid_classes = ["FACTUAL", "MODEL_DEPENDENT", "SPECULATIVE", "PROPOSED"]
    if claim.get("claim_class") not in valid_classes:
        errors.append(f"Invalid claim_class: '{claim.get('claim_class')}'")
    return errors


# ── Unit registry ───────────────────────────────────────────────────────────

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


# ── Default registry data structure ────────────────────────────────────────

def create_default_registry_data() -> dict[str, Any]:
    """Create the default registry data structure for UPPLE."""
    return {
        "registry_id": "UPPLE-PARAMETER-REGISTRY-001",
        "version": "1.0.0",
        "created_at": None,
        "parameter_count": 0,
        "parameters": {},
        "baseline": {},
    }
