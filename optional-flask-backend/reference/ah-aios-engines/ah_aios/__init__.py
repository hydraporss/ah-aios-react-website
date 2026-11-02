"""AH-AIOS package root."""

__version__ = "0.1.0"
__author__ = "AH-AIOS project"

from .recovery import (
    BASE_DIR,
    CLAIM_LEDGER,
    DECISION_LEDGER,
    REGISTRY_DIR,
    SCHEMA_PATH,
    SOURCE_MANIFEST,
    THEORY_REGISTRY,
    load_json,
    recovery_sequence,
    run_all_recovery,
    sha256_of_file,
    validate_registry,
)

__all__ = [
    "BASE_DIR",
    "REGISTRY_DIR",
    "THEORY_REGISTRY",
    "CLAIM_LEDGER",
    "DECISION_LEDGER",
    "SOURCE_MANIFEST",
    "SCHEMA_PATH",
    "load_json",
    "validate_registry",
    "recovery_sequence",
    "run_all_recovery",
    "sha256_of_file",
    # World model
    "world_model",
]
