import argparse
import csv
import json
import sys
from io import StringIO
from pathlib import Path


def convert_to_num(n):
    try:
        return int(n)
    except ValueError:
        return float(n)


def main():
    # setup parser and arguments
    parser = argparse.ArgumentParser(
        description="Build Ai Command Palette Commands JSON Object.",
        epilog="Copyright 2022 Josh Duncan (joshbduncan.com)",
        prog="build_commands_json.py",
    )
    parser.add_argument(
        "-f",
        "--file",
        type=Path,
        required=True,
        help="Path of CSV file with Ai commands.",
    )
    parser.add_argument(
        "-t",
        "--type",
        type=str,
        choices=["config", "menu", "tool"],
        help="Type of commands to build.",
    )

    # capture all cli arguments
    args = parser.parse_args()

    # setup file objects
    input_file = args.file

    # read all menu commands into a dictionary
    d = {}
    with open(input_file, "r") as f:
        reader = csv.reader(f)
        for i, row in enumerate(reader):
            if i == 0:
                continue
            value = row[0]
            en = row[1]
            minVersion = row[2]
            maxVersion = row[3]
            d[en] = {"cmdType": args.type.lower()}
            if minVersion:
                d[en]["minVersion"] = convert_to_num(minVersion)
            if maxVersion:
                d[en]["maxVersion"] = convert_to_num(maxVersion)
            d[en]["cmdActions"] = [{"type": args.type.lower(), "value": value}]

    # write json to stdout
    print(json.dumps(d))

    return 0


if __name__ == "__main__":
    sys.exit(main())
