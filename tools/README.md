# Ai Command Palette - Build Tools

## Build Commands

There are almost 500 menu commands, 80 tools, and a handful of custom configuration commands available in Ai Command Palette and since they get updated often, this script helps me build/rebuild the objects used in the script.

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

It also builds the localized strings used in all dialogs and alerts.

```javascript
// generated localized strings data object
var locStrings = {
  about: { en: "About", de: "Über Kurzbefehle …", ru: "О скрипте" },
}
```

### How It Works

Supply a CSV file of commands and specify the commands and the script will build the text for [data.jsxinc](/src/include/data.jsxinc).

```bash
python3 build_commands.py -h                                           
usage: build_commands_json.py [-h] -f FILE

Build Ai Command Palette JSON Objects.

options:
  -h, --help            show this help message and exit
  -f FILE, --file FILE  Path of CSV file with command build data.

Copyright 2022 Josh Duncan (joshbduncan.com)
```

The script simply writes the JSON objects to stdout.

⚠️ PLEASE NOTE: Then exported JSON objects have all `\` (backslashes) escaped, so for everything to display correctly using the ExtendScript `localize()` the output must be piped through [sed](https://www.gnu.org/software/sed/manual/sed.html) first to remove the offending escape characters.

```bash
python3 tools/build_data.py -f $1 | sed 's/\\\\/\\/g' > src/include/data.jsxinc 
```