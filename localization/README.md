# Ai Command Palette - Translations

This all came about after a suggestion from [Kurt Gold](https://community.adobe.com/t5/illustrator-discussions/command-palette-by-josh-duncan-localised-for-german-illustrator-versions/td-p/13107176) in the Adobe Support [Scripting Forum](https://community.adobe.com/t5/illustrator/ct-p/ct-illustrator?page=1&sort=latest_replies&filter=all&lang=all&tabid=discussions&topics=label-scripting).

## CSV File Format

With the help of [Kurt Gold](https://community.adobe.com/t5/user/viewprofilepage/user-id/8354168) the first localized version is for German versions of Adobe Illustrator. You can view a sample translation [sample.csv](sample.csv) (with only the English text) or the current German translation [German.csv](German.csv).

There are 650+ strings that need to be translated so to make things easier, Kurt and myself used [this spreadsheet](https://docs.google.com/spreadsheets/d/1KojP9U64bvt4eVWsy5W8ieGnV8_dTQWASX109feehnw/edit?usp=sharing) to keep track of everything.

⚠️ If there is an English string (column 1) that doesn't need to be translated just leave the Translation (column 2) blank (e.g. "") and the translator program will skip it.

## Tooling

The translation/localization process is done via a [Python script](/tools/build_translations.py) which you can read about more [here](/tools/README.md).