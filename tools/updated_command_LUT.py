import argparse
import csv
import json
import re
import sys

try:
    import httpx
except ImportError:
    print(
        "Import Error: httpx module required (https://www.python-httpx.org/)",
        file=sys.stderr,
    )


def convert_to_num(n):
    try:
        return int(n)
    except ValueError:
        return float(n)


def localized_strings_object(row):
    loc = {}
    ignored_cols = [
        "VALUE",
        "IGNORE",
        "TYPE",
        "MINVERSION",
        "MAXVERSION",
        "DOCREQUIRED",
        "SELREQUIRED",
    ]
    for k, v in row.items():
        if k.upper() not in ignored_cols:
            loc[k] = v
    return loc


def get_data():
    SHEET = "1T-pBrLAOL3WuF1K7h6Wo_vIUa0tui9YiX591YqqKMdA"
    URL = f"https://docs.google.com/spreadsheets/d/{SHEET}/export?exportFormat=csv"
    try:
        response = httpx.get(URL, follow_redirects=True)
        response.raise_for_status()
    except httpx.RequestError as e:
        print(f"An error occurred while requesting {e.request.url!r}.")
    except httpx.HTTPStatusError as e:
        print(
            f"Error response {e.response.status_code} \
                while requesting {e.request.url!r}."
        )
    return response.text.split("\n")


def main(argv=None):
    # setup parser and arguments
    parser = argparse.ArgumentParser(
        description="Build Ai Command Palette JSX Objects.",
        epilog="Copyright 2022 Josh Duncan (joshbduncan.com)",
        prog="build_commands_json.py",
    )
    group = parser.add_mutually_exclusive_group()
    group.add_argument(
        "-i",
        "--input",
        type=argparse.FileType("r"),
        help="csv build data",
    )
    group.add_argument(
        "-d",
        "--download",
        action="store_true",
        help="download latest csv data from google",
    )

    # capture all cli arguments
    args = parser.parse_args(argv)

    # get data from either stdin, file, or via download
    if not args.download or args.input:
        parser.exit(
            "No input file provide. Use -d/--download to download \
commands from google. Learn more with -h/--help"
        )
    if args.download:
        data = get_data() if args.download else args.input.readlines()

    # regex for cleaning up command ids
    regex = re.compile(r"\s|\.")

    # read build data csv file
    commands = {}
    reader = csv.DictReader(data)
    for row in reader:
        # skip any empty rows
        if not row:
            continue

        # a string just for localization
        if row["type"].upper() == "STRING":
            continue

        # build a command object
        old_command_id = f'{row["type"]}_{row["value"]}'
        stripped_command = row["value"].replace(".", "", -1)
        new_command_id = regex.sub("_", f"{row['type']}_{stripped_command}")

        # skip if same
        if old_command_id == new_command_id:
            continue

        commands[old_command_id] = new_command_id

    output = f"""// ALL BUILT DATA FROM PYTHON SCRIPT

var commandsData = {json.dumps(commands)}"""

    print(output.replace("\\\\n", "\\n"))

    return 0


if __name__ == "__main__":
    sys.exit(main())
