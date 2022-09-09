# Ai Command Palette - Build Tools

## Build Menu Commands

There are almost 500 menu commands available in Ai Command Palette and since they get updated often, this script helps me build/rebuild the builtinMenuCommands object that is included in the script. It loads all available menu commands from the [ai_menus.csv](/ai_menus.csv) CSV file and builds the JSON object needed in the main script.

```javascript
{
  "File > New...": {
    cmdType: "menu",
    cmdActions: [
      {
        type: "menu",
        value: "new",
      },
    ],
  },
  // ...
}
```

### How It Works

```bash
python3 build_menu_commands_json.py -h                                                           
usage: build_menu_commands_json.py [-h] -f FILE [-o OUTPUT]

Build Ai Menu Comands JSON Object.

options:
  -h, --help            show this help message and exit
  -f FILE, --file FILE  Path of CSV file with Ai menu commands.
  -o OUTPUT, --output OUTPUT
                        Output path for JSON file.

Copyright 2022 Josh Duncan (joshbduncan.com)
```

## Build Tool Commands 

Just like above, there are almost 80 tools available in Ai Command Palette and since they get updated often, this script helps me build/rebuild the builtinToolCommands object that is included in the script. It loads all available tools from the [ai_tools.csv](/ai_tools.csv) CSV file and builds the JSON object needed in the main script.

```javascript
{
  "Add Anchor Point Tool": {
    cmdType: "tool",
    minVersion: 24,
    cmdActions: [
      {
        type: "tool",
        value: "Adobe Add Anchor Point Tool",
      },
    ],
  },
  // ...
}
```

### How It Works

```bash
python3 build_tool_commands_json.py -h 
usage: build_tool_commands_json.py [-h] -f FILE [-o OUTPUT]

Build Ai Tool Comands JSON Object.

options:
  -h, --help            show this help message and exit
  -f FILE, --file FILE  Path of CSV file with Ai tool commands.
  -o OUTPUT, --output OUTPUT
                        Output path for JSON file.

Copyright 2022 Josh Duncan (joshbduncan.com)
```

## Build Translations

Building translations using a brute force approach that utilizes [regular expressions (regex)](https://en.wikipedia.org/wiki/Regular_expression) and a language translation [Comma-separated values (CSV)](https://en.wikipedia.org/wiki/Comma-separated_values) file.

### How It Works

```bash
$ python3 build_translations.py -h
usage: build_translations.py [-h] -f FILE -t TRANSLATIONS [-o OUTPUT]

Translate text files using RegEx.

options:
  -h, --help            show this help message and exit
  -f FILE, --file FILE  Path of file to translate.
  -t TRANSLATIONS, --translations TRANSLATIONS
                        Path of CSV file with translations.
  -o OUTPUT, --output OUTPUT
                        Output path for translated file.

Copyright 2022 Josh Duncan (joshbduncan.com)
```

Simply provide the script the file to translate "AiCommandPalette.jsx", a translation .csv file, and an output file and it will search for any occurrences of the English strings and replace them the the translated strings.

```bash
$ python3 tools/translate.py -f AiCommandPalette.jsx -t localization/German.csv -o AiCommandPalette-German.jsx
```
