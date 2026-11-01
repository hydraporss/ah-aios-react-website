@echo off
setlocal
cd /d "%~dp0"
echo ============================================
echo       AH-AIOS CONNECTED WORKBENCH
echo ============================================
where py >nul 2>nul
if %errorlevel%==0 (
  py -3 -m venv .venv
) else (
  python -m venv .venv
)
if not exist ".venv\Scripts\python.exe" (
  echo Python 3 is required. Install Python and try again.
  pause
  exit /b 1
)
call ".venv\Scripts\activate.bat"
python -m pip install --upgrade pip
python -m pip install -r "ah_webapp\requirements-dev.txt"
if errorlevel 1 (
  echo Dependency installation failed. Check your internet connection and Python installation.
  pause
  exit /b 1
)
python run_local.py
pause
