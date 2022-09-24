# Ai Command Palette - Localization

This all came about after a suggestion from [Kurt Gold](https://community.adobe.com/t5/illustrator-discussions/command-palette-by-josh-duncan-localised-for-german-illustrator-versions/td-p/13107176) in the Adobe Support [Scripting Forum](https://community.adobe.com/t5/illustrator/ct-p/ct-illustrator?page=1&sort=latest_replies&filter=all&lang=all&tabid=discussions&topics=label-scripting).

## Localization Spreadsheet

There are 650+ strings that need to be translated so to make things easier, Kurt and myself used [Google Sheets](https://docs.google.com/spreadsheets/d/1T-pBrLAOL3WuF1K7h6Wo_vIUa0tui9YiX591YqqKMdA/edit#gid=1896695315) to keep track of everything.

## How It Work

All of the localization is done at runtime via the ExtendScript `localize()` function (learn more below).

[Localizing ExtendScript strings — JavaScript Tools Guide CC 0.0.1 documentation](https://extendscript.docsforadobe.dev/extendscript-tools-features/localizing-extendscript-strings.html)

[Localization in ScriptUI objects — JavaScript Tools Guide CC 0.0.1 documentation](https://extendscript.docsforadobe.dev/user-interface-tools/localization-in-scriptui-objects.html)