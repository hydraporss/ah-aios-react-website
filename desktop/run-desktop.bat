@echo off
rem Runs the desktop app without building an installer (for testing). Needs Node.js 20+ and internet the first time.
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (echo Node.js 20 or newer is required: https://nodejs.org & pause & exit /b 1)
if not exist node_modules call npm install
call npm start
