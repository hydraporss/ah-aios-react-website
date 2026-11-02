#!/usr/bin/env bash
# Assemble the static site that GitHub Pages publishes into ./_site
# Excludes the Flask backend (Pages cannot run Python), tests, tooling and CI config.
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf _site && mkdir _site
tar --exclude='./_site' --exclude='./.git' --exclude='./.github' --exclude='./node_modules' \
    --exclude='./optional-flask-backend' --exclude='./desktop' --exclude='./archive' --exclude='./scripts' --exclude='./learning/tests' \
    --exclude='./learning/theories-source-template.csv' --exclude='*.zip' --exclude='./start-flask-backend.*' \
    --exclude='./docs/reconciliation' --exclude='./docs/worldforge-reference' --exclude='./docs/learning-app' --exclude='./docs/AH-AIOS-ARCHIVE-RECONCILIATION.md' --exclude='./package.json' --exclude='./.gitignore' --exclude='./README.md' -cf - . | tar -xf - -C _site
cp 404.html _site/404.html
touch _site/.nojekyll
echo "Built _site: $(find _site -type f | wc -l) files, $(du -sh _site | cut -f1)"
