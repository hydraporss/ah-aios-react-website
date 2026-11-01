"""Persistence helpers connecting web worlds to the WOF world-state model."""

import json

try:
    from src.wof.world_state import WorldState, WorldStateError
    WOF_AVAILABLE = True
except ModuleNotFoundError as exc:
    if exc.name != "src" and not (exc.name or "").startswith("src.wof"):
        raise
    WOF_AVAILABLE = False

    class WorldStateError(RuntimeError):
        """WorldForge source package is not installed in this distribution."""

    WorldState = None


def _require_wof():
    if not WOF_AVAILABLE:
        raise WorldStateError(
            "WorldForge module not installed. The Flask Workbench is available, "
            "but WorldForge state and generation routes require the original src/wof package."
        )

from .models import WOFWorldStateRecord


def create_world_state_record(world, source_id):
    """Create a proposed WOF entity for a newly submitted web world."""
    _require_wof()
    state = WorldState(
        world_id=f"web-world-{world.id}",
        seed=f"web-submission-{source_id}",
    )
    state.add_entity(
        entity_type="WORLD",
        name=world.name,
        source_type="WEB_APP_SUBMISSION",
        source_id=source_id,
        status="PROPOSED",
        canon_status="SUGGESTION",
        entity_id=f"web-world-{world.id}",
        reason="World submitted through AH-AIOS web app; awaiting governance review.",
        properties={"realm": world.realm, "description": world.description},
    )

    return WOFWorldStateRecord(
        world_id=world.id,
        seed=state.seed,
        state_json=json.dumps(state.to_dict(), sort_keys=True),
    )


def record_world_review(record, proposal_id, actor_id, decision, reason):
    """Record a human governance decision in the linked WOF world state."""
    _require_wof()
    try:
        saved_state = json.loads(record.state_json)
        state = WorldState.from_dict(saved_state)
        state.record_review_decision(
            entity_id=f"web-world-{record.world_id}",
            decision=decision,
            authorization_reference=proposal_id,
            reviewed_by=str(actor_id),
            reason=reason or f"Approved through proposal {proposal_id}.",
        )
    except (TypeError, json.JSONDecodeError, WorldStateError) as exc:
        raise WorldStateError(f"Unable to authorize linked WOF state: {exc}") from exc

    record.state_json = json.dumps(state.to_dict(), sort_keys=True)
    return record


def record_generation_review(state_record, generation_record, proposal_id, actor_id, decision, reason):
    """Apply one governance decision to every generated WOF entity and relation."""
    _require_wof()
    try:
        state = WorldState.from_dict(json.loads(state_record.state_json))
        result = json.loads(generation_record.result_json)
        targets = [
            ('ENTITY', item['entity_id'])
            for item in result.get('new_entities', [])
        ] + [
            ('RELATION', item['relation_id'])
            for item in result.get('new_relations', [])
        ]
        if not targets:
            raise WorldStateError('The generation run contains no reviewable output.')
        for target_type, target_id in targets:
            state.record_review_decision(
                entity_id=target_id,
                target_type=target_type,
                decision=decision,
                authorization_reference=proposal_id,
                reviewed_by=str(actor_id),
                reason=reason,
            )
    except (TypeError, KeyError, json.JSONDecodeError, WorldStateError) as exc:
        raise WorldStateError(f"Unable to record generation review: {exc}") from exc

    state_record.state_json = json.dumps(state.to_dict(), sort_keys=True)
    return state_record
