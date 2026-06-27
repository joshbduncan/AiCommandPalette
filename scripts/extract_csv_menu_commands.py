#!/usr/bin/env python3

import csv
import sys


def main():
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} FILE.csv", file=sys.stderr)
        sys.exit(1)

    with open(sys.argv[1], newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)

        for row in reader:
            print(row["en"])


if __name__ == "__main__":
    main()
