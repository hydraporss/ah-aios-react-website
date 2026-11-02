#!/usr/bin/env bash
# Assemble a file-for-file mirror of the verified ZIP snapshot for GitHub Pages.
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf _site && mkdir _site
SOURCE_SNAPSHOT=5766c2284986840fdf0e5b71afdaee2617b78c6d
git archive --format=tar "$SOURCE_SNAPSHOT" | tar -xf - -C _site
echo "Built repository mirror: $(find _site -type f | wc -l) files, $(du -sh _site | cut -f1)"
