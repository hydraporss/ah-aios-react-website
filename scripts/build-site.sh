#!/usr/bin/env bash
# Assemble a file-for-file mirror of the tracked repository for GitHub Pages.
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf _site && mkdir _site
git archive --format=tar HEAD | tar -xf - -C _site
echo "Built repository mirror: $(find _site -type f | wc -l) files, $(du -sh _site | cut -f1)"
