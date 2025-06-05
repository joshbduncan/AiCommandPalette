import csv
import json
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent


def read_csv_data(fp: Path) -> list[dict]:
    """Safely read CSV data from a file using `csv.DictReader`.

    Args:
        fp: CSV data file path.

    Returns:
        List of CSV rows as a dictionaries.
    """
    with open(fp, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def build_strings(rows: list[dict]) -> dict[dict[str, str]]:
    """Build a dictionary of string objects from CSV data in the following format.

        ```
        about: {
            en: "About",
            de: "\u00dcber Kurzbefehle \u2026",
            ru: "\u041e \u0441\u043a\u0440\u0438\u043f\u0442\u0435",
            "zh-cn": "About",
        }
        ```

    Args:
        rows: List of rows from a CSV file (as returned by `csv.DictReader`).

    Returns:
        Dictionary of string objects.
    """

    strings = {}

    for row in rows:
        id = row.pop("value", None)
        if id is None:
            continue

        notes = row.pop("notes", None)

        # get default english string for incomplete localization
        default_value = row.get("en", None)
        if default_value is None:
            continue

        # set localized values
        localized_strings = {k: v or default_value for k, v in row.items()}

        strings[id] = localized_strings

    return strings


def main() -> int:
    # read and parse csv data
    fp = Path(SCRIPT_DIR / "../data/strings.csv")
    rows = read_csv_data(fp)
    strings = build_strings(rows)
    assert strings

    header = "// GENERATED FROM CSV DATA FILES"
    interface = """
interface LocalizedStrings {
  [key: string]: {
    [langCode: string]: string,
  };
}
"""

    output = f"""{header}

{interface}

const strings = {json.dumps(strings)}
"""

    print(output.replace("\\\\n", "\\n"))

    return 0


if __name__ == "__main__":
    sys.exit(main())
