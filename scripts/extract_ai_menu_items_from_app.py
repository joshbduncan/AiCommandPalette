import re
import subprocess

# cli applescript to generate ai menu data
# osascript -s s -e 'tell app "System Events" to tell application process "Adobe Illustrator" to get entire contents of menu bar 1'

ENTRY_SPLIT_RE = re.compile(r",\s+(?=(?:menu bar item|menu item|menu)\b)")

TOKEN_RE = re.compile(
    r'\b(menu bar item|menu item|menu bar|menu)\s*(?:"([^"]+)"|(\d+))?'
)

SKIP_PATHS = {
    ("Apple",),  # macOS Apple menu
    ("Apple", "Recent Items"),  # Personal app/file/server history
    ("Illustrator",),  # Illustrator menu
    ("File", "Open Recent Files"),  # Personal file history
    ("File", "Cutting Master 5"),  # Cutting Master Plug-in
    ("Edit", "Rasterino"),  # Astute Graphics stuff
    ("Edit", "AutoFill"),  # Mac stuff
    ("Object", "Filters"),  # Astute Graphics stuff
    ("Object", "Width Stamp"),  # Astute Graphics stuff
    ("Object", "Space Fill"),  # Astute Graphics stuff
    ("Type", "Font"),  # Massive font list
    ("Type", "Recent Fonts"),
    ("Type", "Size"),
    ("Select", "Dynamic Shapes"),  # Astute Graphics stuff
    ("Select", "AG Block Shadow Effects"),  # Astute Graphics stuff
    ("Effect", "AG Utilities"),  # Astute Graphics stuff
    ("Effect", "Phantasm"),  # Astute Graphics stuff
    ("Effect", "Randomino"),  # Astute Graphics stuff
    ("Effect", "Stipplism"),  # Astute Graphics stuff
    ("Effect", "Stipplism"),  # Astute Graphics stuff
    ("Effect", "Stylism"),  # Astute Graphics stuff
    ("Effect", "Texturino"),  # Astute Graphics stuff
    ("Effect", "VectorScribe"),  # Astute Graphics stuff
    ("Window", "Workspace"),
    ("Window", "Extensions"),
    ("Window", "Astute Graphics"),  # Astute Graphics stuff
    ("Help", "Astute Graphics Learn"),  # Astute Graphic Plugins
}

SKIP_ITEMS = {
    # "Recent Items",
    # "Clear Recent File List",
    # "Clear Menu",
    "AiCommandPalette",
    "ImageTracing",
    "SaveDocsAsPDF",
    "SaveDocsAsSVG",
    "Astute Graphics Support...",
    "Astute Graphics My Account...",
    "Start Dictation...",
    "Create Symbol Variants...",
    "Create Color Stamp",
    "Create Roulette...",
    "Optimize Width Markers...",
    "Vary Width Markers...",
    "Swap Fill and Stroke",
    "Swap Fill and Stroke with Effects",
    "Path Intersections...",
    "Remove Line Breaks",
    "Remove Paragraph Breaks",
    "Texture Effects",
    "Spot Colors",
    "RGB Images",
    "CMYK Images",
    "Gray Images",
    "Colorized Images",
    "NChannel Images",
    "Phantasm Effects",
    "Stipplism Effects",
    "AG Architect Effects",
    "AG Offset Effects",
    "AG Splatter Effects",
    "Perturb Effects",
    "Illustrator Effects",
    "Photoshop Effects",
    "Additional Effects",
    "Live Effect Explorer...",
    "Application Frame",
    "Application Bar",
}


def get_ai_menu_data() -> str:
    result = subprocess.run(
        [
            "osascript",
            "-s",
            "s",
            "-e",
            'tell app "System Events" to tell application process "Adobe Illustrator" to get entire contents of menu bar 1',
        ],
        capture_output=True,
        text=True,
        check=True,
    )

    return result.stdout.strip()


def get_ai_version() -> str:
    result = subprocess.run(
        [
            "osascript",
            "-e",
            'tell application "Adobe Illustrator" to version',
        ],
        capture_output=True,
        text=True,
        check=True,
    )

    return result.stdout.strip()


def split_entries(data: str) -> list[str]:
    data = data.strip().removeprefix("{").removesuffix("}").strip()
    return [entry.strip() for entry in ENTRY_SPLIT_RE.split(data) if entry.strip()]


def parse_entry(entry: str) -> list[str]:
    parts = []

    for match in TOKEN_RE.finditer(entry):
        kind = match.group(1)
        name = match.group(2) or match.group(3)

        if name is not None:
            parts.append((kind, name))

    parts.reverse()

    return [name for kind, name in parts if kind in {"menu bar item", "menu item"}]


def should_skip_path(path: list[str]) -> bool:
    return any(tuple(path[: len(skip_path)]) == skip_path for skip_path in SKIP_PATHS)


def should_skip_item(path: list[str]) -> bool:
    return path[-1] in SKIP_ITEMS


def sanitize_label(label: str) -> str:
    label = re.sub(r"\s*\([^)]*@[^)]*\)$", "", label)
    label = re.sub(r"^Log Out .+?…?$", "Log Out…", label)
    return label


def extract_menu_items(data: str) -> list[str]:
    submenu_paths = set()
    item_paths = []

    for entry in split_entries(data):
        path = parse_entry(entry)

        if not path:
            continue

        if entry.startswith("menu item "):
            item_paths.append(path)
        elif entry.startswith("menu "):
            submenu_paths.add(tuple(path))

    results = []

    for path in item_paths:
        if path[-1].isdigit():
            continue

        if tuple(path) in submenu_paths:
            continue

        if should_skip_path(path):
            continue

        if should_skip_item(path):
            continue

        path = [sanitize_label(part) for part in path]

        results.append(" > ".join(path))

    return results


def main() -> None:
    data = get_ai_menu_data()
    ai_version = get_ai_version()

    print(f"Adobe Illustrator v{ai_version}")
    for item in extract_menu_items(data):
        print(item)


if __name__ == "__main__":
    main()
