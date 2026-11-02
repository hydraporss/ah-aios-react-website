#!/usr/bin/env bash
cd "$(dirname "$0")"
PORT=8000
echo "AH-AIOS local site -> http://localhost:$PORT/  (Ctrl+C to stop)"
(sleep 1; (open "http://localhost:$PORT/" || xdg-open "http://localhost:$PORT/") >/dev/null 2>&1) &
exec python3 -m http.server $PORT --bind 127.0.0.1
