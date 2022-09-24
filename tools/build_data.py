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
        description="Build Ai Command Palette JSON Objects.",
        epilog="Copyright 2022 Josh Duncan (joshbduncan.com)",
        prog="build_commands_json.py",
    )
    parser.add_argument(
        "-f",
        "--file",
        type=Path,
        required=True,
        help="Path of CSV file with command build data.",
    )

    # capture all cli arguments
    args = parser.parse_args()

    # setup file objects
    input_file = args.file

    # read all menu commands into a dictionary
    commands = {}
    strings = {}
    with open(input_file, "r") as f:
        reader = csv.reader(f)

        # iterate over all commands
        for i, row in enumerate(reader):
            if i == 0:
                headers = row
                continue

            # build the command object
            value = row[0]
            _type = row[1]
            key = f"{_type}_{value}"

            if _type not in commands:
                commands[_type] = {}

            obj = {
                "action": value,
                "type": _type,
            }

            # build min/max versions
            if row[2]:
                obj["minVersion"] = convert_to_num(row[2])
            if row[3]:
                obj["maxVersion"] = convert_to_num(row[3])

            # build localizations
            loc = {}
            for n, col in enumerate(row[4:], start=4):
                if col:
                    loc[headers[n]] = col
            obj["loc"] = loc

            # add command to master dict
            if _type != "string":
                commands[obj["type"]][key] = obj
            else:
                strings[value] = loc

    output = f"""// ALL BUILT DATA FROM PYTHON SCRIPT

var locStrings = {json.dumps(strings, ensure_ascii=False)}

var builtCommands = {json.dumps(commands, ensure_ascii=False)}"""

    print(output)

    return 0


if __name__ == "__main__":
    sys.exit(main())
