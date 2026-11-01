"""Shared pytest fixtures.

test_phase1_vertical_slice.py requests an `app` fixture but does not define
one; test_batch1_read_only.py defines its own (which takes precedence there).
"""

import pytest


@pytest.fixture
def app():
    """Create an isolated in-memory test application."""
    from ah_webapp import create_app

    return create_app({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "SQLALCHEMY_TRACK_MODIFICATIONS": False,
        "AH_AIOS_ADMIN_EMAIL": "",
        "AH_AIOS_ADMIN_PASSWORD": "",
    })
