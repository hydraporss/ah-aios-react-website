"""AH-AIOS Procedural Lore Engine — discovery and mystery layer."""

from enum import Enum
from typing import Any


class RevelationLevel(Enum):
    """Information-disclosure levels, not epistemic certainty levels."""
    HINT = "HINT"
    PARTIAL = "PARTIAL"
    FULL = "FULL"


class DiscoveryTrigger(Enum):
    """Types of discovery triggers."""
    DISCOVERY = "discovery"
    QUEST = "quest"
    REALIZATION = "realization"
    MYSTERY = "mystery"
    ARTIFACT = "artifact"


class Discovery:
    """A discovery event connecting locations, artifacts, events, and lore fragments."""
    
    def __init__(
        self,
        discovery_id: str,
        trigger: str,
        location: str | None = None,
        evidence_revealed: str = "",
        facts_revealed: list[str] | None = None,
        claims_suggested: list[str] | None = None,
        new_questions: list[str] | None = None,
        observer_knowledge_requirements: str = "",
        disclosure_level: str = "PARTIAL",
        source_references: list[str] | None = None,
        lifecycle_status: str = "draft",
        canon_status: str = "non-canonical exploration",
    ):
        self.discovery_id = discovery_id
        self.trigger = trigger
        self.location = location
        self.evidence_revealed = evidence_revealed
        self.facts_revealed = facts_revealed or []
        self.claims_suggested = claims_suggested or []
        self.new_questions = new_questions or []
        self.observer_knowledge_requirements = observer_knowledge_requirements
        self.disclosure_level = disclosure_level
        self.source_references = source_references or []
        self.lifecycle_status = lifecycle_status
        self.canon_status = canon_status
    
    def to_dict(self) -> dict:
        """Serialize discovery to a dictionary."""
        return {
            "discovery_id": self.discovery_id,
            "trigger": self.trigger,
            "location": self.location,
            "evidence_revealed": self.evidence_revealed,
            "facts_revealed": self.facts_revealed,
            "claims_suggested": self.claims_suggested,
            "new_questions": self.new_questions,
            "observer_knowledge_requirements": self.observer_knowledge_requirements,
            "disclosure_level": self.disclosure_level,
            "source_references": self.source_references,
            "lifecycle_status": self.lifecycle_status,
            "canon_status": self.canon_status,
        }


class DiscoveryLayer:
    """Discovery and mystery management layer."""
    
    def __init__(self):
        self.discoveries = []
    
    def add_discovery(self, discovery: Discovery) -> None:
        """Add a discovery to the layer."""
        self.discoveries.append(discovery)
    
    def get_all(self) -> list[Discovery]:
        """Get all discoveries."""
        return self.discoveries
    
    def get_by_location(self, location: str) -> list[Discovery]:
        """Get discoveries at a specific location."""
        return [d for d in self.discoveries if d.location == location]
    
    def get_by_disclosure_level(self, level: str) -> list[Discovery]:
        """Get discoveries at a specific disclosure level."""
        return [d for d in self.discoveries if d.disclosure_level == level]
    
    def filter_by_lifecycle(self, status: str) -> list[Discovery]:
        """Filter discoveries by lifecycle status."""
        return [d for d in self.discoveries if d.lifecycle_status == status]
