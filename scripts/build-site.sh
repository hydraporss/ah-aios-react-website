#!/usr/bin/env bash
# Assemble a byte-for-byte mirror of the verified ZIP snapshot for GitHub Pages.
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf _site
mkdir _site

SOURCE_SNAPSHOT=5766c2284986840fdf0e5b71afdaee2617b78c6d
file_count=0
while IFS= read -r -d '' entry; do
  metadata=${entry%%$'\t'*}
  path=${entry#*$'\t'}
  read -r mode type oid <<< "$metadata"
  [[ "$type" == blob ]] || continue

  destination="_site/$path"
  mkdir -p -- "$(dirname -- "$destination")"
  git cat-file blob "$oid" > "$destination"
  actual_oid=$(git hash-object --no-filters "$destination")
  if [[ "$actual_oid" != "$oid" ]]; then
    echo "Blob verification failed: $path" >&2
    exit 1
  fi
  file_count=$((file_count + 1))
done < <(git ls-tree -rz --full-tree "$SOURCE_SNAPSHOT")

if [[ "$file_count" -ne 435 ]]; then
  echo "Expected 435 snapshot files; assembled $file_count" >&2
  exit 1
fi

echo "Built exact snapshot: $file_count files, $(du -sh _site | cut -f1)"
