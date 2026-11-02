#!/usr/bin/env python3
"""
AH-WebAPP-001 — Main Blueprint
Core routes for the worldbuilding web application.
"""

from flask import Blueprint, render_template, redirect, url_for, request, flash, abort
from flask_login import login_required, current_user
import json
from uuid import uuid4
from .models import (
    db, World, Race, Character, Event, Civilization, Artifact, AuditLog,
    ChangeProposal, WOFWorldStateRecord, WOFGenerationRecord,
)
from .wof_integration import create_world_state_record, WOF_AVAILABLE, WorldStateError

try:
    from src.wof.generator import WOFGenerator, GenerationIntentError
    from src.wof.world_state import RELATION_TYPES, WorldState
except ModuleNotFoundError as exc:
    if exc.name != "src" and not (exc.name or "").startswith("src.wof"):
        raise

    class GenerationIntentError(RuntimeError):
        """WorldForge generation package is not installed."""

    WOFGenerator = None
    WorldState = None
    RELATION_TYPES = ()

main_bp = Blueprint('main', __name__)

WOF_INTENT_TYPES = ('DISCOVERY', 'EXPANSION', 'ENCOUNTER')
WOF_ENTITY_TYPES = (
    'REGION', 'LOCATION', 'FACTION', 'RACE', 'CHARACTER',
    'CIVILIZATION', 'EVENT', 'TECHNOLOGY', 'ARTIFACT',
)


def _parse_generation_entities(raw_lines, allowed_types):
    proposed = []
    for line_number, raw_line in enumerate(raw_lines.splitlines(), start=1):
        line = raw_line.strip()
        if not line:
            continue
        if ':' not in line:
            raise ValueError(f'Entity line {line_number} must use TYPE: Name format.')
        entity_type, name = (part.strip() for part in line.split(':', 1))
        entity_type = entity_type.upper()
        if not name:
            raise ValueError(f'Entity line {line_number} needs a name.')
        if entity_type not in allowed_types:
            raise ValueError(f'{entity_type} on line {line_number} was not selected as an allowed type.')
        proposed.append({'entity_type': entity_type, 'name': name})
    return proposed


def _parse_generation_relations(raw_lines, allowed_relations, existing_entity_ids):
    proposed = []
    for line_number, raw_line in enumerate(raw_lines.splitlines(), start=1):
        line = raw_line.strip()
        if not line:
            continue
        parts = [part.strip() for part in line.split('|')]
        if len(parts) != 3:
            raise ValueError(f'Relation line {line_number} must use subject_id|TYPE|object_id format.')
        subject_id, relation_type, object_id = parts
        relation_type = relation_type.upper()
        if relation_type not in allowed_relations:
            raise ValueError(f'{relation_type} on line {line_number} was not selected as an allowed relation.')
        if subject_id not in existing_entity_ids or object_id not in existing_entity_ids:
            raise ValueError(f'Relation line {line_number} must reference existing entity IDs shown below.')
        proposed.append({
            'subject_id': subject_id,
            'relation_type': relation_type,
            'object_id': object_id,
        })
    return proposed


@main_bp.route('/')
def dashboard():
    """Dashboard showing project overview."""
    return render_template('main/dashboard.html',
                           title='Worldbuilding Dashboard')


@main_bp.route('/worlds')
@login_required
def worlds():
    """World Atlas - list all worlds."""
    worlds = World.query.all()
    return render_template('main/worlds.html', worlds=worlds, user=current_user)


@main_bp.route('/worlds/<int:world_id>/generate', methods=['GET', 'POST'])
@login_required
def generate_world(world_id):
    """Run a bounded WOF generation intent and submit output for review."""
    if not WOF_AVAILABLE:
        abort(503, description='WorldForge module not installed. The local Workbench is running; generation is unavailable until the original src/wof package is restored.')
    if not current_user.can('write'):
        abort(403)

    world = World.query.get_or_404(world_id)
    state_record = WOFWorldStateRecord.query.filter_by(world_id=world.id).first()
    if state_record is None:
        flash('This world has no WOF state record yet. Create a new WOF-backed world first.', 'error')
        return redirect(url_for('main.worlds'))

    try:
        state = WorldState.from_dict(json.loads(state_record.state_json))
    except (TypeError, json.JSONDecodeError, WorldStateError) as exc:
        flash(f'The saved WOF state could not be loaded: {exc}', 'error')
        return redirect(url_for('main.worlds'))

    generation_result = None
    proposal = None
    if request.method == 'POST':
        intent_type = (request.form.get('intent_type') or '').upper()
        seed = (request.form.get('seed') or '').strip()
        selected_entity_types = request.form.getlist('allowed_entity_types')
        selected_relations = request.form.getlist('allowed_relations')

        if intent_type not in WOF_INTENT_TYPES:
            flash('Choose a supported WOF intent type.', 'error')
        elif not seed:
            flash('A reproducibility seed is required.', 'error')
        elif not selected_entity_types or any(value not in WOF_ENTITY_TYPES for value in selected_entity_types):
            flash('Choose one or more supported entity types.', 'error')
        elif any(value not in RELATION_TYPES for value in selected_relations):
            flash('The selected relation list contains an unsupported type.', 'error')
        else:
            try:
                proposed_entities = _parse_generation_entities(
                    request.form.get('proposed_entities', ''),
                    set(selected_entity_types),
                )
                proposed_relations = _parse_generation_relations(
                    request.form.get('proposed_relations', ''),
                    set(selected_relations),
                    set(state.entities),
                )
                if not proposed_entities and not proposed_relations:
                    raise ValueError('Provide at least one entity or relation to generate.')

                generation_id = f"WOF-GEN-{uuid4().hex[:12].upper()}"
                intent = {
                    'generation_intent_id': generation_id,
                    'intent_type': intent_type,
                    'seed': seed,
                    'allowed_entity_types': selected_entity_types,
                    'allowed_relations': selected_relations,
                    'proposed_entities': proposed_entities,
                    'proposed_relations': proposed_relations,
                }
                generation_result = WOFGenerator(state).run(intent)
                generated_entities = generation_result['new_entities']
                generated_relations = generation_result['new_relations']

                generation_record = WOFGenerationRecord(
                    generation_id=generation_id,
                    world_id=world.id,
                    intent_json=json.dumps(intent, sort_keys=True),
                    result_json=json.dumps(generation_result, sort_keys=True),
                    created_by=current_user.id,
                )
                db.session.add(generation_record)

                if generated_entities or generated_relations:
                    generated_names = [item['name'] for item in generated_entities]
                    proposal = ChangeProposal(
                        proposal_id=f"PROP-{uuid4().hex[:12].upper()}",
                        artifact_type='WOF_GENERATION',
                        artifact_id=generation_id,
                        description=(
                            f"WOF {intent_type.lower()} run for {world.name}: "
                            f"{len(generated_entities)} entities and {len(generated_relations)} relations"
                        ),
                        classification='SUGGESTION',
                        current_version=0,
                        proposed_version=1,
                        rationale=f"Seed: {seed}. Generated names: {', '.join(generated_names) or 'relation updates'}.",
                        status='PENDING_REVIEW',
                        author_id=current_user.id,
                    )
                    db.session.add(proposal)
                    db.session.flush()
                    generation_record.proposal_record_id = proposal.id
                    generation_result['proposal_id'] = proposal.proposal_id

                state_record.state_json = json.dumps(state.to_dict(), sort_keys=True)
                db.session.commit()
                flash('WOF generation run recorded. Output remains research-only pending review.', 'success')
            except (ValueError, GenerationIntentError, WorldStateError) as exc:
                db.session.rollback()
                generation_result = None
                proposal = None
                flash(str(exc), 'error')

    return render_template(
        'main/generate.html',
        title=f'Generate for {world.name}',
        world=world,
        intent_types=WOF_INTENT_TYPES,
        allowed_entity_types=WOF_ENTITY_TYPES,
        allowed_relations=sorted(RELATION_TYPES),
        existing_entities=list(state.entities.values()),
        generation_result=generation_result,
        proposal=proposal,
    )


@main_bp.route('/worlds/new', methods=['GET', 'POST'])
@login_required
def create_world():
    """Submit a new world as a proposal for governance review."""
    if not current_user.can('write'):
        abort(403)

    if request.method == 'POST':
        name = (request.form.get('name') or '').strip()
        realm = (request.form.get('realm') or '').strip()
        description = (request.form.get('description') or '').strip()
        rationale = (request.form.get('rationale') or '').strip()

        if not name:
            flash('A world name is required.', 'error')
            return render_template('main/world_form.html', title='New World')

        world = World(
            name=name,
            realm=realm or None,
            description=description,
            classification='SUGGESTION',
            created_by=current_user.id
        )
        db.session.add(world)
        db.session.flush()
        proposal = ChangeProposal(
            proposal_id=f"PROP-{uuid4().hex[:12].upper()}",
            artifact_type='WORLD',
            artifact_id=str(world.id),
            description=f"New world submission: {name}",
            classification='SUGGESTION',
            current_version=0,
            proposed_version=1,
            rationale=rationale,
            status='PENDING_REVIEW',
            author_id=current_user.id,
        )
        db.session.add(proposal)
        if WOF_AVAILABLE:
            db.session.add(create_world_state_record(world, proposal.proposal_id))
        db.session.commit()

        if WOF_AVAILABLE:
            flash('World submitted as a suggestion for governance review.', 'success')
        else:
            flash('World proposal saved. WorldForge state integration is not installed; generation and linked-state approval remain unavailable.', 'warning')
        return redirect(url_for('governance.proposals'))

    return render_template('main/world_form.html', title='New World')


@main_bp.route('/races')
@login_required
def races():
    """Identity Archive - list all races."""
    races = Race.query.all()
    return render_template('main/races.html', races=races, user=current_user)


@main_bp.route('/races/new', methods=['GET', 'POST'])
@login_required
def create_race():
    """Submit a new race as a proposal for governance review."""
    if not current_user.can('write'):
        abort(403)

    if request.method == 'POST':
        name = (request.form.get('name') or '').strip()
        type_ = (request.form.get('type') or '').strip()
        description = (request.form.get('description') or '').strip()
        traits = (request.form.get('traits') or '').strip()
        physical_attributes = (request.form.get('physical_attributes') or '').strip()
        cultural_attributes = (request.form.get('cultural_attributes') or '').strip()
        rationale = (request.form.get('rationale') or '').strip()

        if not name:
            flash('A race name is required.', 'error')
            return render_template('main/race_form.html', title='New Race')

        race = Race(
            name=name,
            type=type_ or None,
            description=description,
            traits=traits or None,
            physical_attributes=physical_attributes or None,
            cultural_attributes=cultural_attributes or None,
            classification='SUGGESTION',
            created_by=current_user.id
        )
        db.session.add(race)
        db.session.flush()
        proposal = ChangeProposal(
            proposal_id=f"PROP-{uuid4().hex[:12].upper()}",
            artifact_type='RACE',
            artifact_id=str(race.id),
            description=f"New race submission: {name}",
            classification='SUGGESTION',
            current_version=0,
            proposed_version=1,
            rationale=rationale,
            status='PENDING_REVIEW',
            author_id=current_user.id,
        )
        db.session.add(proposal)
        db.session.commit()

        flash('Race submitted as a suggestion for governance review.', 'success')
        return redirect(url_for('governance.proposals'))

    return render_template('main/race_form.html', title='New Race')


@main_bp.route('/artifacts')
@login_required
def artifacts():
    """Visual Artifact Studio."""
    artifacts = Artifact.query.all()
    return render_template('main/artifacts.html', artifacts=artifacts, user=current_user)


@main_bp.route('/audit')
@login_required
def audit():
    """Audit Center."""
    logs = AuditLog.query.order_by(AuditLog.timestamp.desc()).limit(50).all()
    return render_template('main/audit.html', logs=logs, user=current_user)


@main_bp.route('/archive')
@login_required
def archive():
    """Archive and record view."""
    return render_template('main/archive.html', user=current_user)


@main_bp.route('/admin')
@login_required
def admin_dashboard():
    """Admin dashboard."""
    return redirect(url_for('admin.dashboard'))


@main_bp.route('/api/health')
def health_check():
    """API health check."""
    return {'status': 'ok', 'service': 'AH-WebAPP-001'}, 200
