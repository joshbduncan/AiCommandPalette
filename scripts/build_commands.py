import csv
import json
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent


def convert_to_num(n) -> int | float:
    try:
        return int(n)
    except ValueError:
        return float(n)


def read_csv_data(fp: Path) -> list[dict]:
    """Safely read CSV data from a file using `csv.DictReader`.

    Args:
        fp: CSV data file path.

    Returns:
        List of CSV rows as a dictionaries.
    """
    with open(fp, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def build_commands(rows: list[dict]) -> dict:
    """Build a dictionary of command objects from CSV data in the following format.

        ```
        menu_1000: {
            id: "menu_new",
            action: "new",
            type: "menu",
            docRequired: false,
            selRequired: false,
            name: {
            en: "File > New...",
            de: "Datei > Neu \u2026",
            ru: "\u0424\u0430\u0439\u043b > \u041d\u043e\u0432\u044b\u0439...",
            "zh-cn": "\u6587\u4ef6>\u65b0\u5efa\u2026",
            },
            hidden: false,
        }
        ```

    Args:
        rows: List of rows from a CSV file (as returned by `csv.DictReader`).

    Returns:
        Dictionary of string objects.
    """

    commands = {}

    for row in rows:
        command_id = row.pop("id", None)

        value = row.pop("value", None)
        if value is None:
            continue

        ignore = row.pop("ignore", "False").lower() == "true"
        if ignore:
            continue

        command_type = row.pop("type", None).lower()
        if command_type is None:
            continue

        # extract all other non localization values
        doc_required = row.pop("docRequired", "False").lower() == "true"
        sel_required = row.pop("selRequired", "False").lower() == "true"

        min_version = row.pop("minVersion", None)
        max_version = row.pop("maxVersion", None)
        _ = row.pop("notes", None)

        # get default english string for incomplete localization
        default_value = row.get("en", None)
        if default_value is None:
            continue

        # set localized values
        localized_strings = {k: v or default_value for k, v in row.items()}

        # cleanup command id
        stripped_value = value.replace(".", "").replace(" ", "_")
        old_command_id = f"{command_type}_{stripped_value}"

        # build final command object
        command = {
            "id": old_command_id,
            "action": value,
            "type": command_type,
            "docRequired": doc_required,
            "selRequired": sel_required,
            "name": localized_strings,
            "hidden": False,
        }

        # only add min and max version if present
        if min_version:
            command["minVersion"] = convert_to_num(min_version)
        if max_version:
            command["maxVersion"] = convert_to_num(max_version)

        commands[command_id or old_command_id] = command

    return commands


def main() -> int:
    csv_files = [
        Path(SCRIPT_DIR / "../data/menu_commands.csv"),
        Path(SCRIPT_DIR / "../data/tool_commands.csv"),
        Path(SCRIPT_DIR / "../data/builtin_commands.csv"),
        Path(SCRIPT_DIR / "../data/config_commands.csv"),
    ]

    all_commands = {}

    # read and parse csv data
    for fp in csv_files:
        rows = read_csv_data(fp)
        commands = build_commands(rows)
        assert commands

        all_commands = all_commands | commands
        assert all_commands

    interface = """
interface CommandEntry {
    action: string;
    actions?: string[];
    actionType?: string;
    colorSpace?: string;
    commands?: string[];
    docRequired: boolean;
    document?: Document | File;
    hidden: boolean;
    id: string;
    idx?: string;
    layer?: string;
    maxVersion?: number;
    minVersion?: number;
    multiselect?: boolean;
    name: LocalizedStringEntry | string;
    pageItem?: PageItem;
    path?: string;
    rulerUnits?: string;
    selRequired: boolean;
    set?: string;
    type: string;
    index?: number;
}

interface CommandsData {
  [key: string]: CommandEntry;
}"""

    output = f"""{interface}

// GENERATED FROM CSV DATA FILES
const commandsData = {json.dumps(all_commands)}"""

    print(output.replace("\\\\n", "\\n"))

    return 0


if __name__ == "__main__":
    sys.exit(main())
