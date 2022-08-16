# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
    - If a script doesn't exists it will be remove from user prefs.
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
