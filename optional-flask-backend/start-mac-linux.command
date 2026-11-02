#!/bin/sh
cd "$(dirname "$0")"
command -v python3 >/dev/null 2>&1 || { echo "Python 3 is required."; exit 1; }
[ -d .venv ] || python3 -m venv .venv
. .venv/bin/activate
python -m pip install --upgrade pip >/dev/null
python -m pip install -r ah_webapp/requirements-dev.txt || { echo "Dependency installation failed (needs internet)."; exit 1; }
python run_local.py
