# Ai Command Palette

Below you'll find a list of potential new features, needed fixes, issues, and anything else I think I might want to do with this project. ✌️

The format is based on [TODO.md](https://github.com/todomd/todo.md)

### Todo

### Doing

- [ ] startup screens customization: Allow the user to set what shows up when the command palette is first opened. Could be favorite commands, workflows, etc.

### Done

- [x] sort filtered items by most used: Track command usage counts in the user settings file, and use that count in the scoring algorithm for sorting the palette items.
- [x] store recent command history and make accessible via command palette
- [x] recent files built-in action
- [x] fix command truncation (e.g. 'Effect > Distort & Transform > Zig Z...')
- [x] filter commands out if they require a document and none are open
- [x] filter commands out if they require a selection
- [x] alphabetize fonts and spot colors in document report
- [x] file/folder bookmarks: allow users to save 'bookmarks' to commonly used files and folders, the use the File.execute() method to open them up.
- [x] new built-in commands: add new commands available to the api and not already accessible via the menu system
- [x] goto functionality: goto artboard, goto named object [(commit 0ad82b4)](https://github.com/joshbduncan/AiCommandPalette/commit/0ad82b4f250d49ebe5a0aacf87e7bd77bc4f46c0)