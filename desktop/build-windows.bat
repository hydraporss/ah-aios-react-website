@echo off
rem Builds the Windows installer + portable .exe. Needs Node.js 20+ and internet (downloads Electron once).
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (echo Node.js 20 or newer is required: https://nodejs.org & pause & exit /b 1)
call npm install
if errorlevel 1 goto fail
call npm run dist
if errorlevel 1 goto fail
echo.
echo Done. Your files are in %~dp0dist
explorer "%~dp0dist"
exit /b 0
:fail
echo.
echo Build failed. Scroll up for the first error.
pause
exit /b 1
