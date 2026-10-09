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


def apply_locale_overrides(rows: list[dict], fps: list[Path]) -> list[dict]:
    """Merge locale-specific CSV files into the main strings data.

    Locale files use ``value`` as their lookup key and one or more locale codes
    as the remaining columns. Missing translations are left blank so
    ``build_strings`` can fall back to English.

    Args:
        rows: Main strings CSV rows.
        fps: Locale override CSV files.

    Returns:
        Rows with locale columns added.

    Raises:
        ValueError: If an override references an unknown string key.
    """
    rows_by_value = {row["value"]: row for row in rows}
    locales: set[str] = set()

    for fp in fps:
        override_rows = read_csv_data(fp)
        if not override_rows:
            continue

        locale_columns = [key for key in override_rows[0] if key != "value"]
        locales.update(locale_columns)

        for override in override_rows:
            value = override.get("value")
            if value not in rows_by_value:
                raise ValueError(f"Unknown localization key {value!r} in {fp}")

            for locale in locale_columns:
                rows_by_value[value][locale] = override.get(locale, "")

    for row in rows:
        for locale in locales:
            row.setdefault(locale, "")

    return rows


def build_strings(rows: list[dict]) -> dict:
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

        _ = row.pop("notes", None)

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
    locale_fps = sorted(fp.parent.glob("strings.*.csv"))
    rows = apply_locale_overrides(rows, locale_fps)
    strings = build_strings(rows)
    assert strings

    interface = """
interface LocalizedStrings {
  [key: string]: {
    [langCode: string]: string,
  };
}

interface LocalizedStringEntry {
  en?: string;
  de?: string;
  ru?: string;
  [langCode: string]: string | undefined;
}

declare function localize(
  what: LocalizedStringEntry,
  ...arguments: any[]
): string;"""

    output = f"""{interface}

// GENERATED FROM CSV DATA FILES
const strings = {json.dumps(strings)}
"""

    print(output.replace("\\\\n", "\\n"))

    return 0


if __name__ == "__main__":
    sys.exit(main())
