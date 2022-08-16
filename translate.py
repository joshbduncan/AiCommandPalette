import argparse
import csv
import re
import sys
from pathlib import Path


def main():
    # setup parser and arguments
    parser = argparse.ArgumentParser(
        description="Translate text files using RegEx.",
        epilog="Copyright 2022 Josh Duncan (joshbduncan.com)",
        prog="translate.py",
    )
    parser.add_argument(
        "-f",
        "--file",
        type=Path,
        required=True,
        help="Path of file to translate.",
    )
    parser.add_argument(
        "-t",
        "--translations",
        type=Path,
        required=True,
        help="Path of CSV file with translations.",
    )
    parser.add_argument(
        "-o",
        "--output",
        type=Path,
        help="Output path for translated file.",
    )

    # capture all cli arguments
    args = parser.parse_args()

    # setup file objects
    file_to_translate = args.file
    file_of_translations = args.translations

    # read all translations into dict
    d = {}
    with open(file_of_translations, newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row["Translation"]:
                d[row["English"]] = row["Translation"]

    # load in content from file to translate
    with open(file_to_translate, "r") as f:
        content_to_translate = f.read()

    # apply translations
    translated_content = content_to_translate
    for k, v in d.items():
        translated_content = re.sub(
            "\\b" + re.escape(k), re.escape(v), translated_content
        )

    # write translated file
    if args.output:
        file_to_save = args.output
        with open(file_to_save, "w") as f:
            f.write(translated_content)
    else:
        sys.stdout.write(translated_content)

    return 0


if __name__ == "__main__":
    sys.exit(main())
