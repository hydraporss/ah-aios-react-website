# Browser acceptance scripts (optional, not run by CI)

Python + Playwright (`pip install playwright && playwright install chromium`). They test the **built** site:

```bash
npm run build:site
cd _site && python3 -m http.server 8123 &      # scripts expect http://127.0.0.1:8123/
python3 scripts/e2e/learning-studio.e2e.py     # 46 checks
python3 scripts/e2e/worldforge.e2e.py          # 20 checks
python3 scripts/e2e/mobile-and-404.e2e.py      # 390px overflow + 404 base path
```
Theory fixtures in these scripts are synthetic and created in-test only. `mobile-and-404.e2e.py` reads `_site/404.html` by absolute path; edit if your checkout lives elsewhere.
