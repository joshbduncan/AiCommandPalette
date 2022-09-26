# Ai Command Palette - Build Tools

## Compile Script

To keep development easier I have split the project into multiple files/modules which you can find in the [src](/src) directory. This means the [index.jsx](/src/index.jsx) file has a lot of `//@include` statements.

To make installation as easy as possible I needed an automated way to get everything compiled into a single readable '.jsx' script file.

The compile script reads through the [index.jsx](/src/index.jsx) and whenever it encounters an `//@include` statement, it inserts the text from that file. The script prints the result out to stdout.

```bash
./tools/compile.sh src/index.jsx > AiCommandPalette.jsx > AiCommandPalette.jsx
```

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
usage: build_commands_json.py [-h] file

Build Ai Command Palette JSON Objects.

positional arguments:
  file        Path of CSV file with command build data.

options:
  -h, --help  show this help message and exit

Copyright 2022 Josh Duncan (joshbduncan.com)
```

The script simply writes the JSON objects to stdout.

⚠️ PLEASE NOTE: Then exported JSON objects have all `\` (backslashes) escaped, so for everything to display correctly using the ExtendScript `localize()` the output must be piped through [sed](https://www.gnu.org/software/sed/manual/sed.html) first to remove the offending escape characters.

```bash
python3 tools/build_data.py -f $1 | sed 's/\\\\/\\/g' > src/include/data.jsxinc 
```