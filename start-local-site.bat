@echo off
setlocal
cd /d "%~dp0"
set PORT=8000
echo AH-AIOS local site  ->  http://localhost:%PORT%/
echo Keep this window open while you use the site. Close it (or press Ctrl+C) to stop.
where py >nul 2>nul && ( start "" "http://localhost:%PORT%/" & py -3 -m http.server %PORT% --bind 127.0.0.1 & goto :eof )
where python >nul 2>nul && ( start "" "http://localhost:%PORT%/" & python -m http.server %PORT% --bind 127.0.0.1 & goto :eof )
where node >nul 2>nul && ( start "" "http://localhost:%PORT%/" & npx --yes http-server . -p %PORT% -a 127.0.0.1 -c-1 & goto :eof )
echo.
echo Neither Python nor Node.js was found. Install Python from https://www.python.org/downloads/
echo (tick "Add python.exe to PATH"), then run this file again.
echo Or just double-click index.html - the site also works without a server.
pause
