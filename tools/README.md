# Ai Command Palette - Build Tools

## ExtendScript Compiler

To keep development easier to handle I split the project into multiple files/modules which you will find in the `src` directory. This works great for me but is a pain for users to install.

So, to make script installation as easy as possible I use a little utility I wrote called [ExtendScript Compiler](https://github.com/joshbduncan/extendscript-compiler) to get everything compiled into a single readable '.jsx' script file.

```bash
./escompile.sh src/script.jsx > compiledScript.jsx
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

Supply a CSV file of commands and the script will build JSON object for [data.jsxinc](/src/include/data.jsxinc) and output them to stdout.

```bash
python3 tools/build_data.py raw_data/build_data.csv | sed 's/\\\\/\\/g' > src/include/data.jsxinc 
```

⚠️ PLEASE NOTE: Then exported JSON objects have all `\` (backslashes) escaped, so for everything to display correctly using the ExtendScript `localize()` the output must be piped through [sed](https://www.gnu.org/software/sed/manual/sed.html) first to remove the offending escape characters.