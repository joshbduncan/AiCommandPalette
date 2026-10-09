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
            command["minVersion"] = min_version

        if max_version:
            command["maxVersion"] = max_version

        commands[command_id or old_command_id] = command

    return commands


def apply_zh_tw_aliases(commands: dict, rows: list[dict]) -> None:
    """Attach zh_TW names to built-in command entries."""
    for row in rows:
        command_id = row.get("id", "").strip()
        name = row.get("zh_TW", "").strip()

        if not command_id or not name:
            continue
        if command_id not in commands:
            raise ValueError(f"Unknown command ID in zh_TW aliases: {command_id}")

        commands[command_id]["name"]["zh_TW"] = name


def build_localized_custom_commands(
    english_rows: list[dict], zh_tw_rows: list[dict]
) -> dict:
    """Build bundled custom commands with English and zh_TW search names."""
    if len(english_rows) != len(zh_tw_rows):
        raise ValueError("Custom command localization row counts do not match")

    commands = {}
    for index, (english_row, zh_tw_row) in enumerate(
        zip(english_rows, zh_tw_rows), start=1
    ):
        action = english_row.get("Command Action", "").strip()
        action_type = english_row.get("Command Type", "").strip().lower()
        english_name = english_row.get("Command Name", "").strip()
        zh_tw_name = zh_tw_row.get("Command Name", "").strip()

        if action != zh_tw_row.get("Command Action", "").strip():
            raise ValueError(f"Custom command action mismatch at row {index + 1}")
        if action_type != zh_tw_row.get("Command Type", "").strip().lower():
            raise ValueError(f"Custom command type mismatch at row {index + 1}")
        if action_type not in {"menu", "tool"}:
            raise ValueError(f"Invalid custom command type at row {index + 1}")
        if not action or not english_name or not zh_tw_name:
            raise ValueError(f"Incomplete custom command at row {index + 1}")

        command_id = f"custom_astute_{index:04d}"
        commands[command_id] = {
            "id": command_id,
            "action": action,
            "type": action_type,
            "docRequired": False,
            "selRequired": False,
            "name": {"en": english_name, "zh_TW": zh_tw_name},
            "hidden": False,
        }

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

    zh_tw_alias_rows = read_csv_data(
        Path(SCRIPT_DIR / "../data/command_names_zh_TW.csv")
    )
    apply_zh_tw_aliases(all_commands, zh_tw_alias_rows)

    custom_commands = build_localized_custom_commands(
        read_csv_data(Path(SCRIPT_DIR / "../data/custom_commands.csv")),
        read_csv_data(Path(SCRIPT_DIR / "../data/custom_commands_zh_TW.csv")),
    )
    assert len(custom_commands) == 134
    all_commands = all_commands | custom_commands

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
