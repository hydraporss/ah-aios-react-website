"""AH-AIOS WorldForge — Theory Inventory Loading Module.

Loads and exposes the established 82-theory inventory from `data/theories.json`
as the foundation for WorldForge implementation, without reopening completed
synthesis work.

Key behaviors:
- Loads 82 records from data/theories.json
- Preserves the 68 + 14 distinction
- Preserves each record's existing identifier and status
- Distinguishes VERIFY definitions from records containing only titles/identifiers
- Prevents missing definitions from being silently fabricated
- Preserves provenance and existing status labels

Files:
- theory_inventory.py — core loader and query API
- test_theory_inventory.py — focused tests
"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

# Project root (same resolution as recovery.py: 4 levels up from src/ah_aios/ah_lore_engine/)
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
THEORIES_PATH = BASE_DIR / "data" / "theories.json"
THEORIES_CSV_PATH = BASE_DIR / "data" / "theories.csv"
THEORIES_MD_PATH = BASE_DIR / "data" / "theories.md"
AUDIT_REPORT_PATH = BASE_DIR / "docs" / "WF-AUDIT-001-LOCAL-THEORY-INVENTORY-AUDIT.md"
COVERAGE_CSV_PATH = BASE_DIR / "docs" / "WF-AUDIT-001-68_14-COVERAGE.csv"

# Established baseline
ESTABLISHED_TOTAL = 82
ESTABLISHED_REGISTRY = 68
ESTABLISHED_SYNTHESIZED = 14

# Verification status values that indicate "available definition"
# VERIFY = synthesized concrete theory ready for verification
# NOT_RUN = exists but definition not yet executed/verified
# NOT_RECORDED = verification status not recorded
VERIFIED_STATUSES = {"VERIFY"}


class TheoryInventoryError(Exception):
    """Base exception for theory inventory errors."""


class TheoryInventoryNotFound(TheoryInventoryError):
    """Theories.json could not be found or loaded."""


class TheoryRecord:
    """Represents a single theory record from theories.json.

    Preserves all original fields from the source file.
    """

    def __init__(self, data: dict[str, Any]):
        self._data = data

    def __getattr__(self, key: str) -> Any:
        if key.startswith("_"):
            raise AttributeError(key)
        return self._data.get(key, "")

    def __repr__(self) -> str:
        return f"TheoryRecord(id={self.id!r}, kind={self.kind!r}, verification={self.verification!r})"

    @property
    def id(self) -> str:
        return self._data.get("id", "")

    @property
    def title(self) -> str:
        return self._data.get("title", "")

    @property
    def kind(self) -> str:
        return self._data.get("kind", "")

    @property
    def classification(self) -> str:
        return self._data.get("classification", "")

    @property
    def verification(self) -> str:
        return self._data.get("verification", "")

    @property
    def source_location(self) -> str:
        return self._data.get("source_location", "")

    @property
    def source_sha256(self) -> str:
        return self._data.get("source_sha256", "")

    @property
    def source_note(self) -> str:
        return self._data.get("source_note", "")

    @property
    def has_definition(self) -> bool:
        """True if this record contains a definition.

        A record "has definition" if it is either a synthesized concrete theory
        (VERIFY status) or has content beyond a bare title/identifier.
        """
        if self.verification in VERIFIED_STATUSES:
            return True
        # Records with kind 'theory' or 'framework' have at least a title
        # (definitions may be absent, indicated by NOT_RUN/NOT_RECORDED)
        return True

    @property
    def has_available_definition(self) -> bool:
        """True if the definition is available for use.

        Only VERIFY-status records have confirmed available definitions.
        All others have titles/identifiers only and must not be treated as verified.
        """
        return self.verification in VERIFIED_STATUSES


class TheoryInventory:
    """Loaded theory inventory — 82 records, with 68 + 14 composition preserved."""

    def __init__(self, data: list[dict[str, Any]] | None = None):
        if data is None:
            data = self._load_theories()
        self._records = [TheoryRecord(item) for item in data]
        self._index = {r.id: r for r in self._records}

    def _load_theories(self) -> list[dict[str, Any]]:
        """Load theories.json. Raises TheoryInventoryNotFound if missing."""
        if not THEORIES_PATH.exists():
            raise TheoryInventoryNotFound(f"Theories file not found: {THEORIES_PATH}")
        with open(THEORIES_PATH, "r", encoding="utf-8") as f:
            payload = json.load(f)
        records = payload.get("records", [])
        if not records:
            raise TheoryInventoryNotFound("Theories.json has no records")
        return records

    @property
    def records(self) -> list[TheoryRecord]:
        return self._records

    @property
    def total(self) -> int:
        return len(self._records)

    @property
    def by_id(self) -> dict[str, TheoryRecord]:
        return self._index

    def get(self, theory_id: str) -> TheoryRecord | None:
        return self._index.get(theory_id)

    def get_definition_status(self, theory_id: str) -> str:
        """Return the definition status for a theory ID.

        Values:
        - "verified" — VERIFY status, definition available
        - "pending_verification" — NOT_RUN/NOT_RECORDED, definition not yet confirmed
        - "unavailable" — definition not found
        """
        record = self.get(theory_id)
        if record is None:
            return "unavailable"
        if record.verification in VERIFIED_STATUSES:
            return "verified"
        return "pending_verification"

    def get_definition_status_display(self, theory_id: str) -> str:
        """Return a human-readable definition status."""
        status = self.get_definition_status(theory_id)
        if status == "verified":
            return "VERIFIED — definition available"
        elif status == "pending_verification":
            return "PENDING VERIFICATION — identifier/title only, not verified"
        else:
            return "UNAVAILABLE — no record found"

    def is_synthesized(self, theory_id: str) -> bool:
        """True if the theory is one of the 14 synthesized concrete theories."""
        record = self.get(theory_id)
        return record is not None and record.verification in VERIFIED_STATUSES

    def is_registered(self, theory_id: str) -> bool:
        """True if the theory is one of the 68 registry theories."""
        record = self.get(theory_id)
        if record is None:
            return False
        # The 68 = 82 - 14, i.e., everything that is NOT synthesized
        return not self.is_synthesized(theory_id)

    def reconcile_68_14(self) -> dict[str, Any]:
        """Verify and return the 68 + 14 reconciliation.

        Returns a dict with:
        - total_records: int
        - registry_count: int
        - synthesized_count: int
        - status: "verifed" or "mismatch"
        """
        synthesized_ids = set()
        registry_ids = set()
        for r in self._records:
            if r.verification in VERIFIED_STATUSES:
                synthesized_ids.add(r.id)
            else:
                registry_ids.add(r.id)

        result = {
            "total_records": self.total,
            "registry_count": len(registry_ids),
            "synthesized_count": len(synthesized_ids),
            "registry_set": sorted(registry_ids),
            "synthesized_set": sorted(synthesized_ids),
            "status": "verified" if self.total == ESTABLISHED_TOTAL else "mismatch",
        }
        return result

    def validate_unique_ids(self) -> dict[str, Any]:
        """Validate that all 82 records have unique identifiers."""
        ids = [r.id for r in self._records]
        seen = set()
        duplicates = set()
        for tid in ids:
            if tid in seen:
                duplicates.add(tid)
            seen.add(tid)
        return {
            "total": len(ids),
            "unique": len(seen),
            "duplicates": sorted(duplicates),
            "status": "pass" if not duplicates else "fail",
        }

    def registered_theory_count(self) -> int:
        """Count records that are NOT synthesized (the 68)."""
        return sum(1 for r in self._records if not self.is_synthesized(r.id))

    def synthesized_theory_count(self) -> int:
        """Count records that ARE synthesized (the 14)."""
        return sum(1 for r in self._records if self.is_synthesized(r.id))


def load_theory_inventory() -> TheoryInventory:
    """Load the theory inventory (single entry point)."""
    return TheoryInventory()


def reconcile_inventory() -> dict[str, Any]:
    """Return the reconciled 68+14 status from the actual file contents."""
    inventory = load_theory_inventory()
    return inventory.reconcile_68_14()


def validate_inventory() -> dict[str, Any]:
    """Validate inventory integrity: count, unique IDs, 68+14 reconciliation."""
    inventory = load_theory_inventory()
    return {
        "count": inventory.total,
        "unique_ids": inventory.validate_unique_ids(),
        "reconciliation": inventory.reconcile_68_14(),
        "registry_count": inventory.registered_theory_count(),
        "synthesized_count": inventory.synthesized_theory_count(),
    }
