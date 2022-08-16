# Ai Command Palette - Translations

This all came about after a suggestion from [Kurt Gold](https://community.adobe.com/t5/illustrator-discussions/command-palette-by-josh-duncan-localised-for-german-illustrator-versions/td-p/13107176) in the Adobe Support [Scripting Forum](https://community.adobe.com/t5/illustrator/ct-p/ct-illustrator?page=1&sort=latest_replies&filter=all&lang=all&tabid=discussions&topics=label-scripting).

## How It Works

It's a brute force approach that uses [regular expressions (regex)](https://en.wikipedia.org/wiki/Regular_expression) and a language translation [Comma-separated values (CSV)](https://en.wikipedia.org/wiki/Comma-separated_values) file.

```bash
$ python3 translate.py -h
usage: translate.py [-h] -f FILE -t TRANSLATIONS [-o OUTPUT]

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
$ python3 translate.py -f AiCommandPalette.jsx -t localization/German.csv -o AiCommandPalette-German.jsx
```

## CSV File Format

With the help of [Kurt Gold](https://community.adobe.com/t5/user/viewprofilepage/user-id/8354168) the first localized version is for German versions of Adobe Illustrator. You can view a sample translation [CSV template](/localization/Sample.csv) (with only the English text) or the final German translation [CSV file here](/localization/German.csv).

There are 650+ strings that need to be translated so to make things easier, Kurt and myself used [this spreadsheet](https://docs.google.com/spreadsheets/d/1KojP9U64bvt4eVWsy5W8ieGnV8_dTQWASX109feehnw/edit?usp=sharing) to keep track of everything.

⚠️ If there is an English string (column 1) that doesn't need to be translated just leave the Translation (column 2) blank (e.g. "") and the translator program will skip it.