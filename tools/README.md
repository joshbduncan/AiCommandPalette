# Ai Command Palette - Build Tools

## ExtendScript Compiler

To keep development easier to handle I split the project into multiple files/modules which you will find in the `src` directory. This works great for me but is a pain for users to install.

So, to make script installation as easy as possible I use a little utility I wrote called [ExtendScript Compiler](https://github.com/joshbduncan/extendscript-compiler) to get everything compiled into a single readable '.jsx' script file.

```bash
./escompile.sh src/script.jsx > compiledScript.jsx
```

## Build Commands (build_data.py)

There are almost 500 menu commands, 80 tools, and a handful of custom configuration commands available in Ai Command Palette and since they get updated often, [this script](/tools/build_data.py) helps me build/rebuild the objects used in the script.

```bash
$ python3 tools/build_data.py -h                          
usage: build_commands_json.py [-h] [-i INPUT | -d]

Build Ai Command Palette JSX Objects.

options:
  -h, --help            show this help message and exit
  -i INPUT, --input INPUT
                        csv build data
  -d, --download        download latest csv data from google

Copyright 2023 Josh Duncan (joshbduncan.com)
```

> Please Note: The script works with a specifically formatted csv file the built from the same [Google Sheet](https://docs.google.com/spreadsheets/d/1T-pBrLAOL3WuF1K7h6Wo_vIUa0tui9YiX591YqqKMdA/edit#gid=716124557) mentioned in the main project README.

### How It Works

Supply a CSV file of commands and the script will build JSON object for (ex. [data.jsxinc](/src/include/data.jsxinc)) and output them to stdout. You can redirect the output to the appropriate file like I have below.

```bash
python3 tools/build_data.py -i data.csv > src/include/data.jsxinc
```

You can also build the data file directly from the live Google Sheet by using the `-d` flag.

```bash
python3 tools/build_data.py -d > src/include/data.jsxinc
```

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

And all localized strings (used for dialogs and alerts) is built into a single object as well.

```javascript
// generated localized strings data object
var locStrings = {
  about: { en: "About", de: "Über Kurzbefehle …", ru: "О скрипте" },
}
```