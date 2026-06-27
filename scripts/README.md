# Ai Command Palette - Build Scripts

## ExtendScript Compiler

To keep development easier to handle I split the project into multiple files/modules which you will find in the `src` directory. This works great for me but is a pain for users to install.

So, to make script installation as easy as possible I use a little utility I wrote called [ExtendScript Compiler](https://github.com/joshbduncan/extendscript-compiler) to get everything compiled into a single readable '.jsx' script file.

```bash
./escompile.sh src/script.jsx > compiledScript.jsx
```

## Build Commands (build_commands.py)

There are almost 500 menu commands, 80 tools, and a handful of custom configuration commands available in Ai Command Palette and since they get updated often, [this script](/scripts/build_commands.py) helps me build/rebuild the objects used in the script from the [command data csv files](/data/).

```bash
$ python3 scripts/build_commands.py
```

> [!NOTE]
> Please Note: The script **ONLY WORKS** with specifically formatted csv files.

All commands are built into a single JavaScript objects like below.

```javascript
// generated localized commands data object
{
  tool: {
    "tool_Adobe Add Anchor Point Tool": {
      action: "Adobe Add Anchor Point Tool",
      type: "tool",
      minVersion: 24,
      loc: {
        en: "Add Anchor Point Tool",
        de: "Ankerpunkt-hinzufügen-Werkzeug",
        ru: "Добавить опорную точку Инструмент",
      },
    },
  },
  // ...
}
```

## Build Strings (build_strings.py)

With the help of some contributors, many of the string values used in Ai Command Palette have been localized. This script builds an object ExtendScript can use to localize the script UI for the user.

```bash
$ python3 scripts/build_strings.py
```

> [!NOTE]
> Please Note: The script **ONLY WORKS** with specifically formatted csv file.

```javascript
// generated localized strings data object
var locStrings = {
  about: { en: "About", de: "Über Kurzbefehle …", ru: "О скрипте" },
}
```

## Finding New Commands (extract_ai_menu_items_from_app.py)

To find new Illustrator menu commands from the app...

```
python scripts/extract_ai_menu_items_from_app.py
```

## Comparing New Commands With Current Commands (extract_ai_menu_commands_from_csv.py)

To extract the currently known menu commands for comparison/diff with the a new Illustrator version...

```
python scripts/extract_ai_menu_commands_from_csv.py data/menu_commands.csv
```

### Find Next Menu Command ID

```bash
cut -d',' -f1 data/menu_commands.csv |
tail -n +2 |
sed 's/.*_//' |
sort -n |
tail -1
```

### Find Duplicate Menu Command IDs

```bash
cut -d',' -f1 data/menu_commands.csv |
tail -n +2 |
sort |
uniq -c |
awk '$1 > 1'
```

### Adding IDs to New Menu Commands

```bash
awk -F, -v OFS=, '
BEGIN { id = 2070 }
$1 == "menu_????" {
    $1 = "menu_" id++
}
{ print }
' data/menu_commands.csv
```