#!/usr/bin/env bash
set -e

# Paths
HEADER="header.txt"
INFILE="build/bundle.jsx"
OUTFILE="AiCommandPalette.jsx"
TMPFILE="$(mktemp)"

echo "Post-processing compiled bundle..."

# Step 1: Strip TypeScript-specific comments (@ts-ignore, @ts-nocheck, @ts-expect-error)
echo "  - Stripping TS comments..."
sed -E '/\/\/[[:space:]]*(@ ts-(ignore|nocheck|expect-error))/d' "$INFILE" > "$TMPFILE"

# Step 2: Wrap in IIFE with header
echo "  - Wrapping in IIFE..."
{
    cat "$HEADER"
    echo ""
    echo "(function() {"
    cat "$TMPFILE"
    echo "})();"
} > "$OUTFILE"

# Step 3: Format with Prettier
echo "  - Formatting with Prettier..."
prettier --parser babel --write "$OUTFILE" > /dev/null

# Cleanup
rm "$TMPFILE"

echo "✓ Post-build complete: $OUTFILE"
