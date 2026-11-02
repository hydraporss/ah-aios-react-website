#!/usr/bin/env bash
cd "$(dirname "$0")/optional-flask-backend" || exit 1
[ -d .venv ] || python3 -m venv .venv
. .venv/bin/activate
pip install -q -r ah_webapp/requirements.txt
python run_local.py
