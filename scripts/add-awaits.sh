#!/bin/bash

# This script adds 'await' to all database function calls

cd "/Users/cmdiggs/Library/CloudStorage/Dropbox-Personal/Guffs Web App"

# Find all TypeScript files in app directory (excluding v0-export)
find app -name "*.ts" -o -name "*.tsx" | while read file; do
  # Skip if file is in v0-export
  if [[ "$file" == *"v0-export"* ]]; then
    continue
  fi

  # Add await to database function calls
  sed -i '' \
    -e 's/= getCocktails()/= await getCocktails()/g' \
    -e 's/= getMemorabilia()/= await getMemorabilia()/g' \
    -e 's/= getHomies()/= await getHomies()/g' \
    -e 's/= getSubmissions()/= await getSubmissions()/g' \
    -e 's/= getApprovedSubmissions()/= await getApprovedSubmissions()/g' \
    -e 's/= getCocktailById(/= await getCocktailById(/g' \
    -e 's/= getMemorabiliaById(/= await getMemorabiliaById(/g' \
    -e 's/= getHomieById(/= await getHomieById(/g' \
    -e 's/createCocktail(/await createCocktail(/g' \
    -e 's/updateCocktail(/await updateCocktail(/g' \
    -e 's/deleteCocktail(/await deleteCocktail(/g' \
    -e 's/createMemorabilia(/await createMemorabilia(/g' \
    -e 's/updateMemorabilia(/await updateMemorabilia(/g' \
    -e 's/deleteMemorabilia(/await deleteMemorabilia(/g' \
    -e 's/createHomie(/await createHomie(/g' \
    -e 's/updateHomie(/await updateHomie(/g' \
    -e 's/deleteHomie(/await deleteHomie(/g' \
    -e 's/createSubmission(/await createSubmission(/g' \
    -e 's/updateSubmissionStatus(/await updateSubmissionStatus(/g' \
    -e 's/await await /await /g' \
    "$file"
done

echo "✅ Added await to all database calls"
