import argparse
import csv
import json
import sys
from collections import defaultdict
from pathlib import Path


def convert_to_num(n):
    try:
        return int(n)
    except ValueError:
        return float(n)


def localized_strings_object(row):
    loc = {}
    ignored_cols = ["VALUE", "IGNORE", "TYPE", "MINVERSION", "MAXVERSION"]
    for k, v in row.items():
        if k.upper() not in ignored_cols:
            loc[k] = v
    return loc


def main():
    # setup parser and arguments
    parser = argparse.ArgumentParser(
        description="Build Ai Command Palette JSON Objects.",
        epilog="Copyright 2022 Josh Duncan (joshbduncan.com)",
        prog="build_commands_json.py",
    )
    parser.add_argument(
        "file",
        type=Path,
        help="Path of CSV file with command build data.",
    )

    # capture all cli arguments
    args = parser.parse_args()

    # setup file objects
    input_file = args.file

    # read all menu commands into a dictionary
    commands = defaultdict(dict)
    strings = {}
    with open(input_file, "r") as f:
        reader = csv.DictReader(f)
        for row in reader:

            # check to see if command should be ignored
            if row["ignore"].upper() == "TRUE":
                continue

            # a string just for localization
            if row["type"].upper() == "STRING":
                strings[row["value"]] = localized_strings_object(row)
                continue

            # build a command object
            command_key = f'{row["type"]}_{row["value"]}'
            command = {
                "action": row["value"],
                "type": row["type"],
                "loc": localized_strings_object(row),
            }
            # only add min and max version if present
            if row["minVersion"]:
                command["minVersion"] = convert_to_num(row["minVersion"])
            if row["maxVersion"]:
                command["maxVersion"] = convert_to_num(row["maxVersion"])
            # add command to commands object
            commands[row["type"]][command_key] = command

    output = f"""// ALL BUILT DATA FROM PYTHON SCRIPT

var locStrings = {json.dumps(strings, ensure_ascii=False)}

var builtCommands = {json.dumps(commands, ensure_ascii=False)}"""

    print(output)

    return 0


if __name__ == "__main__":
    sys.exit(main())
