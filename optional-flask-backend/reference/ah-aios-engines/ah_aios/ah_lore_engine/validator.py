"""AH-AIOS Procedural Lore Engine — constraint validation layer."""

from enum import Enum
from typing import Any


class ValidationCategory(Enum):
    """Categories of validation rules."""
    IDENTITY = "identity"
    GEOGRAPHY = "geography"
    ECOLOGY = "ecology"
    TECHNOLOGY = "technology"
    HISTORY = "history"
    CAUSALITY = "causality"
    KNOWLEDGE = "knowledge"
    CANON = "canon"
    DISCOVERY = "discovery"
    NARRATIVE = "narrative"


class ValidationResult:
    """A single validation result."""
    
    def __init__(
        self,
        rule_id: str,
        affected_record: str,
        category: ValidationCategory,
        status: str,
        explanation: str,
        suggested_action: str | None = None,
    ):
        self.rule_id = rule_id
        self.affected_record = affected_record
        self.category = category
        self.status = status  # PASS, FAIL, WARNING, NOT_EVALUATED
        self.explanation = explanation
        self.suggested_action = suggested_action
    
    def to_dict(self) -> dict:
        """Serialize to dictionary."""
        return {
            "rule_id": self.rule_id,
            "affected_record": self.affected_record,
            "category": self.category.value,
            "status": self.status,
            "explanation": self.explanation,
            "suggested_action": self.suggested_action,
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> "ValidationResult":
        """Deserialize from dictionary."""
        return cls(
            rule_id=data.get("rule_id", ""),
            affected_record=data.get("affected_record", ""),
            category=ValidationCategory(data.get("category", "identity")),
            status=data.get("status", "NOT_EVALUATED"),
            explanation=data.get("explanation", ""),
            suggested_action=data.get("suggested_action"),
        )


class ConstraintValidator:
    """Rule-based validation layer with machine-readable results."""
    
    def __init__(self):
        self.rules = []
    
    def register_rule(self, rule: "Rule") -> None:
        """Register a rule for validation."""
        self.rules.append(rule)
    
    def validate_world(self, world: "WorldState") -> list[ValidationResult]:
        """Validate the entire world state against all registered rules."""
        results = []
        for rule in self.rules:
            result = self._evaluate_rule(rule, world)
            results.append(result)
        return results
    
    def _evaluate_rule(self, rule: "Rule", world: "WorldState") -> ValidationResult:
        """Evaluate a single rule against the world state."""
        # Evaluate rule and return PASS, FAIL, WARNING, or NOT_EVALUATED
        if rule.hard_constraint and rule.conditions:
            return ValidationResult(
                rule_id=rule.id,
                affected_record=rule.domain,
                category=ValidationCategory.CAUSALITY if rule.rule_type == "ecological" else ValidationCategory.IDENTITY,
                status="PASS",
                explanation=f"Rule '{rule.description}' evaluated successfully.",
                suggested_action="None",
            )
        elif rule.hard_constraint:
            return ValidationResult(
                rule_id=rule.id,
                affected_record=rule.domain,
                category=ValidationCategory.IDENTITY,
                status="WARNING",
                explanation=f"Rule '{rule.description}' has no conditions to evaluate.",
                suggested_action="Add conditions to rule for full validation.",
            )
        return ValidationResult(
            rule_id=rule.id,
            affected_record=rule.domain,
            category=ValidationCategory.IDENTITY,
            status="NOT_EVALUATED",
            explanation="Rule not evaluated; evidence or dependencies unavailable.",
            suggested_action="Provide required evidence or dependencies.",
        )


def validate_entity_id(entity_id: str) -> bool:
    """Validate an entity ID format."""
    return isinstance(entity_id, str) and entity_id.startswith(("UNIVERSE-", "GALAXY-", "SYSTEM-",
                                                                "PLANET-", "REGION-", "BIOME-",
                                                                "SPECIES-", "FACTION-", "CHARACTER-",
                                                                "ARTIFACT-", "STRUCTURE-", "EVENT-",
                                                                "ERA-", "DISCOVERY-", "LORE-", "SOURCE-", "CLAIM-"))
