# Ai Command Palette - Localization

This all came about after a suggestion from [Kurt Gold](https://community.adobe.com/t5/illustrator-discussions/command-palette-by-josh-duncan-localised-for-german-illustrator-versions/td-p/13107176) in the Adobe Support [Scripting Forum](https://community.adobe.com/t5/illustrator/ct-p/ct-illustrator?page=1&sort=latest_replies&filter=all&lang=all&tabid=discussions&topics=label-scripting).

## Localization Spreadsheet

There are 650+ strings that need to be translated so to make things easier, Kurt and myself initially used to keep track of everything but now the files are version controlled in this [repository](/data/).

Locale-specific overrides can also be stored in files named
`data/strings.<locale>.csv`. Each override file must contain a `value` column
and one or more locale columns. The build script merges these files into the
main strings data and falls back to English for any empty translation.

The Traditional Chinese localization is stored in
`data/strings.zh_TW.csv`.

## How It Works

All of the localization is done at runtime via the ExtendScript `localize()` function (learn more below).

[Localizing ExtendScript strings — JavaScript Tools Guide CC 0.0.1 documentation](https://extendscript.docsforadobe.dev/extendscript-tools-features/localizing-extendscript-strings.html)

[Localization in ScriptUI objects — JavaScript Tools Guide CC 0.0.1 documentation](https://extendscript.docsforadobe.dev/user-interface-tools/localization-in-scriptui-objects.html)
