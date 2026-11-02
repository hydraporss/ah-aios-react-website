from pathlib import Path
from threading import Timer
import webbrowser

from ah_webapp import app

@app.get("/health")
def local_health():
    return {"status": "ok", "application": "AH-AIOS Connected Workbench", "worldforge_available": False}

if __name__ == "__main__":
    url = "http://127.0.0.1:8080/hub"
    print("AH-AIOS Connected Workbench starting")
    print(f"Open: {url}")
    Timer(1.2, lambda: webbrowser.open(url)).start()
    app.run(host="127.0.0.1", port=8080, debug=False, use_reloader=False)
