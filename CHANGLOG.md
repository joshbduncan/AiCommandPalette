# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.3] 2022-11-06
### Fixed
- versionCheck function comparisons were incorrect

## [0.4.2] 2022-10-25
### Added
- Some older tools with maxVersions
    - Still need to update translations
- [Simple script](/tools/Test%20Ai%20Commands.jsx) for testing Ai menu and tool commands

### Fixed
- typo for command.maxVersion in version check function of base jsx file 


## [0.4.1] 2022-10-25
### Added
- New tools and menu items for [Ai 2023 v27.0](https://helpx.adobe.com/illustrator/using/whats-new.html)
    - Still need to update translations
- [Simple script](/tools/Test%20Ai%20Commands.jsx) for testing Ai menu and tool commands

### Fixed
- typo for command.maxVersion in version check function

## [0.4.0] 2022-10-21
### Added
- Real-Time Localization
    - Handled within the main script file via the ExtendScript `localize()` function.
    - Commands are built at run-time for the current system locale
- New project folder structure
    - Common functionality split into separate files/modules for easier development
    - Final script is compiled into the single jsx file [AiCommandPalette.jsx](AiCommandPalette.jsx)
- Settings menu only shows certain commands when applicable

### Changed
- Script was rewritten from the ground up
    - Variable names have been changed which will break any setting your have save on your system
        - Settings file has been renames to make it easy to roll-back to a previous version

### Removed
- Redundant and no longer needed functions
- Excess command data to speed things up

### Fixed
- Unicode errors for Conté Crayon => Cont\u00E9 Crayon

## [0.3.0] 2022-09-15
### Added
- Ai Version Functionality Checker
    - Original idea brought up by [Sergey Osokin](https://github.com/creold) in issue [#6 selectTool](https://github.com/joshbduncan/AiCommandPalette/issues/6)
    - Ai Command Palette now checks the current Ai version at startup to determine which menu commands and tools are compatible with your version of Adobe Illustrator.
        - If your version doesn't meet the minimum version (or maximum version) of a menu command or tool, it will not be available.
        - Any previous workflows that use a menu command or tool will no longer work. You'll be notified of this when you try to run the workflow. You can edit the workflow to remove that menu command or tool.
    - This should allow Ai Command Palette to easily update with the ever changing Ai menu commands and tools.
    - Any commands/tools can now have properties `minVersion` and `maxVersion`.
        - If either are present and your Ai version doesn't meet the requirement Ai Command Palette will remove that functionality at startup.
    - All current min/max versions for menu commands were referenced from the [menuCommandString](https://judicious-night-bca.notion.site/3346ecd2789d4a55aa043d3619b97c58?v=30f64aad6d39424a9e4f138fad06a126) list provided by [sttk3](https://community.adobe.com/t5/user/viewprofilepage/user-id/6940356).
        - Please note that if the min version listed in the list above was below 17 it was ignored and if the max version was listed at 99 it was also ignored. Ai Command Palette doesn't require a min or max version to be listed for menu commands. All menu commands are executed within a try/catch block so it will fail gracefully and let you know why.
    - Since they `app.selectTool()` method wasn't introduced until Ai version 24, all tools have that as their min version.
- Ai Tools and Ai Menu Commands CSV files
    - [menu_commands.csv](/commands/menu_commands.csv) is where I will track all available menu commands (for use with `app.executeMenuCommand()`) going forward along with their min and max versions. If you see anything that needs to be changed to updated please submit a PR.
    - [tool_commands.csv](/commands/tool_commands.csv) will track all available tool commands (for use with `app.selectTool()`) going forward along with their min and max versions. If you see anything that needs to be changed to updated please submit a PR.
    - If you have updates to either file or see something that is incorrect, please [file an issue](https://github.com/joshbduncan/AiCommandPalette/issues) and I'll check it out.
- New Build Tools
    - [build_commands.py](/tools/build_commands.py) builds the built-in menu commands, the built-in tool commands, and the config commands objects directly from [menu_commands.csv](/commands/menu_commands.csv), [config_commands.csv](/commands/config_commands.csv), and [tool_commands.csv](/commands/tool_commands.csv), so any updates are easier to track and implement.
- New way to build config menu

### Changes
- [translate.py](/tools/build_translations.py) moved to the tools folder.

### Fixed
- Typo in workflow builder move down function caused it to move the wrong items when multiple items were selected.
- Typo on renamed function for moving steps in Workflow builder. (`sortIndexes`)
- Incorrect regex when editing workflows
- Workflow builder name and ok being enabled at wrong times
- Changed some variables from const back to var after reported issues
- Russian and German translations
- ShowBuiltinTools command now checks to make sure there are tools to display before showing the command palette
- EditWorkflows command now checks to make sure there any workflows before showing the command palette
- Windows OS Flicker Bug [issue #8](https://github.com/joshbduncan/AiCommandPalette/issues/8)
    - Very clever solution provided by [Sergey Osokin](https://github.com/creold)
    - Found that simulating a `<TAB>` key press via VBScript was the best solution for keeping the user experience the same on Windows and Mac.
    - Only effects Windows users.

## [0.2.4] - 2022-08-17
### Changed
- More language updates
    - Updates to German by Kurt Gold
    - Updates ro Russian by [Sergey Osokin](https://github.com/creold)

## [0.2.3] - 2022-08-17
### Changed
- Increased the palette size to accommodate alternate languages with longer text
- Workflow steps are now multiselect (you can select more than one at a time)
    - You can move multiple steps up and down (if the selection is contiguous)
    - You can deleted multiple steps in one-click (not required to be contiguous)

## [0.2.2] - 2022-08-17
### Added
- New localized Russian version from @creold

### Changed
- FIX unicode characters where needed
- Updated menu commands
- German translations updates by Kurt Gold

## [0.2.1] - 2022-08-16
### Changed
- FIX to German tool names
- FIX to translate.py to only replace whole strings
- Updated sample.csv
- Update dialog strings to make it easier to do translation

## [0.2.0] - 2022-08-16
### Added
- Ability to activate 80+ of Ai's built-in tools 
- Ability to **edit workflows** (previously called custom commands)
- Workflow action validation
    - Any commands no longer available are tagged with **\*\*DELETED\*\***
    - If a workflow has any deleted steps it will present a warning and **not run**.
    - New menu command "Workflows Needing Attention"
        - Helps locate any workflows that have steps/actions that were deleted and need editing.
        - Takes you right to the workflow editor to fix the problem.
    - When any commands are deleted using "Delete Commands" they will be marked as **\*\*DELETED\*\*** in any workflows using them at the time of deletion
- Error checking with alerts for most functions
- YouTube Video Demo
- A check to make sure loaded scripts still exist at the location they were loaded.
    - If a script doesn't exist it will be removed from user prefs.
    - Will update so any workflows that rely on a script that no longer exists can be edited
- Added docstrings
- Added a Python translator for translating commands and dialogs to other languages [LEARN MORE](/localization/README.md).
    - All prompts, alerts, and commands can be translated.
    - Starting with German (DE) translation compiled with help of [Kurt Gold](https://community.adobe.com/t5/user/viewprofilepage/user-id/8354168).
    - Works by creating a CSV file "[Language].txt" in the localization folder.

### Changed
- **CUSTOM COMMANDS** are now called **WORKFLOWS**
- UPDATED and TESTED all built-in menu commands.
    - Now match format, text, and order of latest Illustrator version.
    - Tested in Ai version 26.4.1.
- Hide Built-In Commands no longer shows workflows
- `scoreMatches()` improvements
    - using regex to match instead of indexOf
    - not counting repeating words for better scoring
    - simplified sorting function
- Up/Down arrow key functionality while in the search box
    - One problem with this functionality is that when a listbox listitem is selected via a script the API moves the visible "frame" of items so that the new selection is at the top. This is not standard behavior, and not even how the listbox behaves when you use the up and down keys inside of the actual listbox.
    - Also, if a selection is made inside of the actual listbox frame by the user (via mouse or keyboard) the API doesn't offer any way to know which part of the list is currently visible in the listbox "frame". If the user was to re-enter the searchbox and then hit an arrow key the above event listener will not work correctly so I just move the next selection (be it up or down) to the middle of the "frame".

### Removed
- Removed around 100 commands that are no longer active or don't work in Ai version 26.4.1.

## [0.1.0] - 2022-07-27
### Added
- First official release!
