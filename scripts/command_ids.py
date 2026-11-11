import argparse
import csv
import sys
from collections import defaultdict
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent
DATA_DIR = SCRIPT_DIR.parent / "data"

COMMAND_FILES = {
    "menu": DATA_DIR / "menu_commands.csv",
    "tool": DATA_DIR / "tool_commands.csv",
}


def read_ids(fp: Path) -> list[tuple[int, str, str]]:
    """Read command ids from a CSV data file.

    Args:
        fp: CSV data file path.

    Returns:
        List of (line number, id, raw line) tuples for each data row.
    """
    with open(fp, newline="", encoding="utf-8") as f:
        lines = f.read().splitlines()
    rows = []
    for lineno, row in enumerate(csv.reader(lines[1:]), start=2):
        if row and row[0]:
            rows.append((lineno, row[0], lines[lineno - 1]))
    return rows


def check_duplicates(command_type: str) -> int:
    """Print any duplicate command ids for a command type.

    Args:
        command_type: Command type key from `COMMAND_FILES`.

    Returns:
        Exit code, 1 if duplicates were found, otherwise 0.
    """
    fp = COMMAND_FILES[command_type]
    seen = defaultdict(list)
    for lineno, id_, line in read_ids(fp):
        seen[id_].append((lineno, line))

    dupes = {id_: rows for id_, rows in seen.items() if len(rows) > 1}
    if not dupes:
        print(f"No duplicate {command_type} ids found in {fp.name}.")
        return 0

    print(f"Duplicate {command_type} ids found in {fp.name}:", file=sys.stderr)
    for id_, rows in dupes.items():
        print(f"\n  {id_}", file=sys.stderr)
        for lineno, line in rows:
            print(f"    line {lineno}: {line}", file=sys.stderr)
    return 1


def next_id(command_type: str) -> str:
    """Determine the next available command id for a command type.

    Args:
        command_type: Command type key from `COMMAND_FILES`.

    Returns:
        Next command id (e.g. `menu_2185`).
    """
    prefix = f"{command_type}_"
    nums = [
        int(id_[len(prefix) :])
        for _, id_, _ in read_ids(COMMAND_FILES[command_type])
        if id_.startswith(prefix) and id_[len(prefix) :].isdigit()
    ]
    return f"{prefix}{max(nums) + 1}"


def main() -> int:
    parser = argparse.ArgumentParser(description="Command id utilities.")
    subparsers = parser.add_subparsers(dest="command", required=True)

    check = subparsers.add_parser("check", help="error on duplicate command ids")
    check.add_argument("type", choices=COMMAND_FILES.keys())

    subparsers.add_parser("next", help="print the next available command ids")

    args = parser.parse_args()

    if args.command == "check":
        return check_duplicates(args.type)

    for command_type in COMMAND_FILES:
        print(f"{command_type}: {next_id(command_type)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
