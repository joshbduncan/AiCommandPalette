# Ai Command Palette - Build Tools

## Build Commands

There are almost 500 menu commands and 80 tools and a handful of custom configuration commands available in Ai Command Palette and since they get updated often, this script helps me build/rebuild the objects used in the script.

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

Supply a CSV file of commands and specify the commands type ('config', 'menu', 'tool') and the script will build the proper JSON object to be manually inserted at the bottom of [AiCommandPalette.jsx](/AiCommandPalette.jsx).
```bash
python3 build_commands.py -h                                           
usage: build_commands_json.py [-h] -f FILE [-t {config,menu,tool}]

Build Ai Command Palette Commands JSON Object.

options:
  -h, --help            show this help message and exit
  -f FILE, --file FILE  Path of CSV file with Ai commands.
  -t {config,menu,tool}, --type {config,menu,tool}
                        Type of commands to build.

Copyright 2022 Josh Duncan (joshbduncan.com)
```

The script simply writes the JSON to stdout but you can redirect that to the clipboard or a file for further inspection.

```bash
# redirect JSON to a file
python3 build_commands.py -f menu_commands.csv -t menu > output.json

# place JSON on you clipboard
python3 build_commands.py -f config_commands.csv -t config | pbcopy
```

## Build Translations

Build translations using a brute force approach that utilizes [regular expressions (regex)](https://en.wikipedia.org/wiki/Regular_expression) and a language translation [Comma-separated values (CSV)](https://en.wikipedia.org/wiki/Comma-separated_values) file.

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
