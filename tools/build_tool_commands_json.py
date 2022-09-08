import argparse
import csv
import json
import sys
from pathlib import Path


def convert_to_num(n):
    try:
        return int(n)
    except ValueError:
        return float(n)


def main():
    # setup parser and arguments
    parser = argparse.ArgumentParser(
        description="Build Ai Tool Comands JSON Object.",
        epilog="Copyright 2022 Josh Duncan (joshbduncan.com)",
        prog="build_tool_commands_json.py",
    )
    parser.add_argument(
        "-f",
        "--file",
        type=Path,
        required=True,
        help="Path of CSV file with Ai tool commands.",
    )
    parser.add_argument(
        "-o",
        "--output",
        type=Path,
        help="Output path for JSON file.",
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
            d[en] = {"cmdType": "tool"}
            if minVersion:
                d[en]["minVersion"] = convert_to_num(minVersion)
            if maxVersion:
                d[en]["maxVersion"] = convert_to_num(maxVersion)
            d[en]["cmdActions"] = [{"type": "tool", "value": value}]

    # convert dictionary to JSON object
    json_object = json.dumps(d, indent=2)

    # write json object to file or clipboard
    if args.output:
        output_file = args.output
        with open(output_file, "w") as o:
            o.write(json_object)
    else:
        sys.stdout.write(json_object)

    return 0


if __name__ == "__main__":
    sys.exit(main())
