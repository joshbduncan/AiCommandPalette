#!/usr/bin/env bash

# Path to header file
HEADER="header.txt"

# Path to your compiled file
INFILE="build/bundle.jsx"

# Path to final output file
OUTFILE="AiCommandPalette.jsx"

# Temp file to store the wrapped output
TMPFILE="$(mktemp)"

# Wrap content in an IIFE
{
    cat "$HEADER"
    echo ""
    echo "(function() {"
    cat "$INFILE"
    echo "})();"
} | prettier --parser babel >"$TMPFILE"

# Move the wrapped content back to the original output
mv "$TMPFILE" "$OUTFILE"

echo "Wrapped $INFILE in an anonymous function."
