#!/usr/bin/env python3
"""
AH-WebAPP-001 — Administration Blueprint
System administration, user management, and configuration.
"""

from functools import wraps
from flask import Blueprint, render_template, request, redirect, url_for, flash, abort
from flask_login import login_required, current_user
from .models import db, User, AuditLog, World, Artifact

admin_bp = Blueprint('admin', __name__)


def admin_required(view):
    """Require an administrator role for administrative actions."""
    @wraps(view)
    def wrapped(*args, **kwargs):
        if not current_user.can('admin'):
            abort(403)
        return view(*args, **kwargs)
    return wrapped


@admin_bp.route('/dashboard')
@login_required
@admin_required
def dashboard():
    """Admin dashboard."""
    stats = {
        'users': User.query.count(),
        'worlds': World.query.count(),
        'artifacts': Artifact.query.count(),
        'audit_logs': AuditLog.query.count()
    }
    return render_template('admin/dashboard.html', stats=stats, user=current_user)


@admin_bp.route('/users')
@login_required
@admin_required
def users():
    """User management."""
    users = User.query.all()
    return render_template('admin/users.html', users=users, user=current_user)


@admin_bp.route('/users/new', methods=['GET', 'POST'])
@login_required
@admin_required
def create_user():
    """Create a new user."""
    if request.method == 'POST':
        email = (request.form.get('email') or '').strip().lower()
        name = (request.form.get('name') or '').strip()
        password = request.form.get('password')
        role = request.form.get('role', 'member')

        if not email or not name or not password:
            flash('Email, name, and password are required.', 'error')
            return render_template('admin/user_form.html', title='New User')
        if len(password) < 12:
            flash('Passwords must be at least 12 characters long.', 'error')
            return render_template('admin/user_form.html', title='New User')
        if role not in {'member', 'moderator', 'admin'}:
            flash('Invalid user role.', 'error')
            return render_template('admin/user_form.html', title='New User')
        if User.query.filter_by(email=email).first():
            flash('A user with that email already exists.', 'error')
            return render_template('admin/user_form.html', title='New User')

        user = User(
            email=email,
            name=name,
            role=role
        )
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        flash('User created successfully.', 'success')
        return redirect(url_for('admin.users'))

    return render_template('admin/user_form.html', title='New User')


@admin_bp.route('/audit-logs')
@login_required
@admin_required
def audit_logs():
    """Audit log viewer."""
    logs = AuditLog.query.order_by(AuditLog.timestamp.desc()).limit(100).all()
    return render_template('admin/audit_logs.html', logs=logs)


@admin_bp.route('/config')
@login_required
@admin_required
def config():
    """System configuration."""
    return render_template('admin/config.html')


@admin_bp.route('/backup', methods=['GET', 'POST'])
@login_required
@admin_required
def backup():
    """Database backup."""
    if request.method == 'POST':
        # Implementation for backup
        flash('Backup initiated (implementation pending).', 'info')
        return redirect(url_for('admin.backup'))

    return render_template('admin/backup.html')
