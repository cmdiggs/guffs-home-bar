#!/bin/bash

cd "/Users/cmdiggs/Library/CloudStorage/Dropbox-Personal/Guffs Web App"

# Find all page.tsx files and make them async if they use await
find app -name "page.tsx" | while read file; do
  # Skip v0-export
  if [[ "$file" == *"v0-export"* ]]; then
    continue
  fi

  # Check if file contains await
  if grep -q "await get" "$file"; then
    # Make the function async
    sed -i '' 's/export default function /export default async function /g' "$file"
    echo "Made async: $file"
  fi
done

echo "✅ Updated page components to be async"
