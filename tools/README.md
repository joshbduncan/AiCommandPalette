# Ai Command Palette - Build Tools

## ExtendScript Compiler

### Why?

To keep development of large ExtendScript projects easier to handle I split the projects into multiple files/modules which you will typically find in the `src` directory. This works great for me but is a pain for users to install. So, to make script installation as easy as possible I needed an automated way to get everything compiled into a single readable '.jsx' script file.

I could just export to a JSXBIN file but I like for my open source scripts to be human readable...

### How it works...

The script reads through the supplied script looking for any [ExtendScript Preprocessor Directives](https://extendscript.docsforadobe.dev/extendscript-tools-features/preprocessor-directives.html) and replaces them with contents from that file.

```bash
./compile.sh src/script.jsx > compiledScript.jsx
```

⚠️ You may need to make the script executable (`chmod +x compile.sh`) before running the command above.

### What can it detect?

This script tries to process `include` and `includepath` statements just as the ExtendScript engine does so that no changes have to be made to the source code.

#### include file

Inserts the contents of the named file into this file at the location of this statement.

```javascript
#include "../include/lib.jsxinc"
//@include "../include/file.jsxinc"
```

If the file to be included cannot be found, the script throws an error.

#### includepath path

One or more paths that the #include statement should use to locate the files to be included. The semicolon (;) separates path names.

If a `#include` file name starts with a slash (/), it is an absolute path name, and the include paths are ignored. Otherwise, the script attempts to find the file by prefixing the file with each path set by the `#includepath` statement.

```javascript
#includepath "include;../include"
#include "file.jsxinc"
//@includepath "include;../include"
//@include "file.jsxinc"
```

Multiple #includepath statements are allowed; the list of paths changes each time an #includepath statement is executed.

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