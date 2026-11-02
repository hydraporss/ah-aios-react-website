#!/usr/bin/env python3
"""
AH-WebAPP-001 — Governance Blueprint
Canon governance, change management, and review workflows.
"""

from flask import Blueprint, render_template, request, redirect, url_for, flash, abort
from flask_login import login_required, current_user
from datetime import datetime, timezone
from uuid import uuid4
from .models import (
    db, ChangeProposal, ApprovalDecision, ReviewRecord, World, Race,
    WOFWorldStateRecord, WOFGenerationRecord,
)
from .wof_integration import record_generation_review, record_world_review
from .wof_integration import WorldStateError

governance_bp = Blueprint('governance', __name__)


@governance_bp.route('/proposals')
@login_required
def proposals():
    """List all change proposals."""
    proposals = ChangeProposal.query.all()
    return render_template('governance/proposals.html', proposals=proposals)


@governance_bp.route('/proposals/new', methods=['GET', 'POST'])
@login_required
def create_proposal():
    """Create a new change proposal."""
    if not current_user.can('write'):
        abort(403)

    if request.method == 'POST':
        proposal_id = f"PROP-{uuid4().hex[:12].upper()}"
        description = (request.form.get('description') or '').strip()
        artifact_type = request.form.get('artifact_type', 'GENERAL')
        artifact_id = request.form.get('artifact_id')
        rationale = (request.form.get('rationale') or '').strip()

        if not description:
            flash('A proposal description is required.', 'error')
            return render_template('governance/proposal_form.html', title='New Change Proposal')

        proposal = ChangeProposal(
            proposal_id=proposal_id,
            artifact_type=artifact_type,
            artifact_id=artifact_id,
            description=description,
            classification='SUGGESTION',
            rationale=rationale,
            author_id=current_user.id,
            status='PENDING_REVIEW',
        )
        db.session.add(proposal)
        db.session.commit()

        flash('Change proposal created. Please review and authorize.', 'info')
        return redirect(url_for('governance.proposals'))

    return render_template('governance/proposal_form.html', title='New Change Proposal')


@governance_bp.route('/proposals/<proposal_id>/review')
@login_required
def review_proposal(proposal_id):
    """Review a change proposal."""
    proposal = ChangeProposal.query.filter_by(proposal_id=proposal_id).first_or_404()
    decisions = ApprovalDecision.query.filter_by(proposal_id=proposal.id).all()
    return render_template('governance/review.html',
                           proposal=proposal,
                           decisions=decisions)


@governance_bp.route('/proposals/<proposal_id>/decision', methods=['POST'])
@login_required
def make_decision(proposal_id):
    """Make a decision on a change proposal."""
    if not current_user.can('approve'):
        abort(403)

    proposal = ChangeProposal.query.filter_by(proposal_id=proposal_id).first_or_404()

    decision = request.form.get('decision')
    comments = request.form.get('comments')

    if decision not in ['APPROVED', 'REJECTED', 'RETURNED']:
        flash('Invalid decision.', 'error')
        return redirect(url_for('governance.review_proposal', proposal_id=proposal_id))

    if proposal.status not in ['DRAFT', 'PENDING_REVIEW', 'RETURNED']:
        flash('This proposal has already received a final decision.', 'error')
        return redirect(url_for('governance.review_proposal', proposal_id=proposal_id))

    artifact = None
    wof_record = None
    generation_record = None
    if proposal.artifact_type.upper() in ['WORLD', 'RACE']:
        try:
            artifact_db_id = int(proposal.artifact_id)
        except (TypeError, ValueError):
            artifact_db_id = None

        if proposal.artifact_type.upper() == 'WORLD':
            artifact = World.query.filter_by(id=artifact_db_id).first() if artifact_db_id else None
        elif proposal.artifact_type.upper() == 'RACE':
            artifact = Race.query.filter_by(id=artifact_db_id).first() if artifact_db_id else None

        if artifact is None:
            flash('The linked worldbuilding item no longer exists; proposal was not approved.', 'error')
            return redirect(url_for('governance.review_proposal', proposal_id=proposal_id))

        if proposal.artifact_type.upper() == 'WORLD':
            wof_record = WOFWorldStateRecord.query.filter_by(world_id=artifact.id).first()
            if wof_record is None:
                flash('The linked world has no WOF state record; proposal was not approved.', 'error')
                return redirect(url_for('governance.review_proposal', proposal_id=proposal_id))

    elif proposal.artifact_type.upper() == 'WOF_GENERATION':
        generation_record = WOFGenerationRecord.query.filter_by(
            generation_id=proposal.artifact_id,
        ).first()
        if generation_record is None:
            flash('The linked WOF generation no longer exists; proposal was not decided.', 'error')
            return redirect(url_for('governance.review_proposal', proposal_id=proposal_id))
        wof_record = WOFWorldStateRecord.query.filter_by(
            world_id=generation_record.world_id,
        ).first()
        if wof_record is None:
            flash('The linked world has no WOF state record; proposal was not decided.', 'error')
            return redirect(url_for('governance.review_proposal', proposal_id=proposal_id))

    if wof_record is not None:
        try:
            reason = comments or f"{decision.title()} by {current_user.email}."
            if generation_record is not None:
                record_generation_review(
                    wof_record,
                    generation_record,
                    proposal_id=proposal.proposal_id,
                    actor_id=current_user.id,
                    decision=decision,
                    reason=reason,
                )
            else:
                record_world_review(
                    wof_record,
                    proposal_id=proposal.proposal_id,
                    actor_id=current_user.id,
                    decision=decision,
                    reason=reason,
                )
        except WorldStateError as exc:
            db.session.rollback()
            flash(str(exc), 'error')
            return redirect(url_for('governance.review_proposal', proposal_id=proposal_id))

    if artifact is not None and decision == 'APPROVED':
        artifact.classification = 'CANON'

    proposal.status = decision
    proposal.approver_id = current_user.id
    if decision == 'APPROVED':
        proposal.approved_at = datetime.now(timezone.utc).replace(tzinfo=None)

    decision_record = ApprovalDecision(
        proposal_id=proposal.id,
        decision=decision,
        comments=comments,
        reviewer=current_user.email
    )
    db.session.add(decision_record)
    db.session.commit()

    flash('Decision recorded.', 'success')
    return redirect(url_for('governance.proposals'))


@governance_bp.route('/canon')
@login_required
def canon():
    """Canon registry with classifications."""
    classifications = ['CANON', 'INTERPRETATION', 'SUGGESTION', 'PROCESS']
    items = []

    # Group items by classification
    canon_items = World.query.filter_by(classification='CANON').all()
    interpretation_items = World.query.filter_by(classification='INTERPRETATION').all()

    for item in canon_items:
        items.append(item)
    for item in interpretation_items:
        item.classification = 'INTERPRETATION'
        items.append(item)

    return render_template('governance/canon.html',
                           classifications=classifications,
                           items=items,
                           user=current_user)


@governance_bp.route('/canon/classify', methods=['POST'])
@login_required
def classify_item():
    """Change the classification of an item."""
    item_id = request.form.get('item_id')
    new_class = request.form.get('classification')

    # Implementation would update the appropriate model
    # For now, just show the form
    flash('Classification change would be recorded here.', 'info')
    return redirect(url_for('governance.canon'))
