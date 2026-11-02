#!/usr/bin/env python3
"""
AH-WebAPP-001 — AFTER HUMANITY Worldbuilding Web Application
Application Factory and Entry Point
"""

import os
import sys
from pathlib import Path

# Add src to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from logging.handlers import RotatingFileHandler
import logging

db = SQLAlchemy()
login_manager = LoginManager()


def create_app(config_overrides=None):
    """Application factory for AH-WebAPP-001."""
    app = Flask(
        __name__,
        instance_relative_config=True,
        static_folder=str(Path(__file__).parent / 'app' / 'static'),
        template_folder=str(Path(__file__).parent / 'templates'),
    )

    # Configuration
    _secret = os.environ.get('SECRET_KEY')
    if not _secret:
        # No shipped default: generate a per-process key (sessions reset on restart).
        import secrets
        _secret = secrets.token_hex(32)
        app.logger.warning('SECRET_KEY not set; using a temporary random key. Set SECRET_KEY for persistent sessions.')
    app.config['SECRET_KEY'] = _secret
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
        'DATABASE_URL',
        'sqlite:///' + str(Path(__file__).parent / 'ah_webapp.db')
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['UPLOAD_FOLDER'] = os.path.join(app.instance_path, 'uploads')
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max
    if config_overrides:
        app.config.update(config_overrides)

    # Initialize extensions
    db.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'
    login_manager.login_message_category = 'info'

    # Create instance folder
    os.makedirs(app.instance_path, exist_ok=True)
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Register blueprints
    from .auth import auth_bp
    from .main import main_bp
    from .governance import governance_bp
    from .admin import admin_bp

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(main_bp, url_prefix='/')
    app.register_blueprint(governance_bp, url_prefix='/governance')
    app.register_blueprint(admin_bp, url_prefix='/admin')
    from .connect import connect_bp
    app.register_blueprint(connect_bp)

    # Initialize database
    with app.app_context():
        from .models import User, World, Race, Character, Event, Artifact, AuditLog
        db.create_all()

        @login_manager.user_loader
        def load_user(user_id):
            try:
                return db.session.get(User, int(user_id))
            except (TypeError, ValueError):
                return None

        # Bootstrap an administrator only when credentials are configured.
        # Avoid relying on service modules that are not part of this package or
        # shipping a shared default password.
        admin_email = os.environ.get('AH_AIOS_ADMIN_EMAIL')
        admin_password = os.environ.get('AH_AIOS_ADMIN_PASSWORD')
        if admin_email and admin_password:
            admin = User.query.filter_by(email=admin_email).first()
            if not admin:
                admin = User(
                    email=admin_email,
                    name=os.environ.get('AH_AIOS_ADMIN_NAME', 'Administrator'),
                    role='admin',
                )
                admin.set_password(admin_password)
                db.session.add(admin)
                db.session.commit()

    return app


app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
