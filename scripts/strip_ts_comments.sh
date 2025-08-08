#!/usr/bin/env bash
set -e

FILE="build/bundle.jsx"

if [ ! -f "$FILE" ]; then
  echo "File not found: $FILE"
  exit 1
fi

sed -E -i '' '/\/\/[[:space:]]*@ts-(ignore|nocheck|expect-error)/d' "$FILE"
