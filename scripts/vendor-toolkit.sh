#!/bin/sh
# Refreshes the vendored Illinois Web Toolkit (vendor/illinois-toolkit) from its
# CDN. Run with `mise run vendor:toolkit` and review the diff; the weekly
# upstream workflow (.github/workflows/upstream.yml) runs it too.
set -e
dir=vendor/illinois-toolkit
for f in toolkit.js toolkit.css; do
  curl -fsSL "https://cdn.toolkit.illinois.edu/3/$f" -o "$dir/$f.tmp"
  mv "$dir/$f.tmp" "$dir/$f"
done
# The CSS points at ../svg/*.svg relative to the CDN; served from here those
# files don't exist, so point them back at the CDN.
perl -pi -e 's#url\(\.\./svg/#url(https://cdn.toolkit.illinois.edu/svg/#g' "$dir/toolkit.css"
perl -pi -e "s#^Fetched \d{4}-\d{2}-\d{2} #Fetched $(date -u +%Y-%m-%d) #" "$dir/README.md"
