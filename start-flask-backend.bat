@echo off
cd /d "%~dp0optional-flask-backend"
if not exist .venv ( py -3 -m venv .venv || python -m venv .venv )
call .venv\Scripts\activate.bat
python -m pip install -q -r ah_webapp\requirements.txt
python run_local.py
pause
