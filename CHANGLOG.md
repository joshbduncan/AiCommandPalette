# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- YouTube Video Demo
- A check to make sure loaded scripts still exist at the location they were loaded.
    - if script doesn't exists it will be remove from user prefs
    - will update so any custom commands that rely on a script that no longer exists can be edited

### Changed
- Hide Built-In Commands no longer shows "custom" commands
- `scoreMatches()` improvements
    - using regex to match instead of indexOf
    - not counting repeating words for better scoring
    - simplified sorting function
- Up/Down arrow key functionality while in `q` edittext
    - One problem with this functionality is that when a listbox listitem is selected via a script the API moves the visible "frame" of items so that the new selection is at the top. This is not standard behavior, and not even how the listbox behaves when you use the up and down keys inside of the actual listbox.
    - Also, if a selection is made inside of the actual listbox frame by the user (via mouse or keyboard) the API doesn't offer any way to know which part of the list is currently visible in the listbox "frame". If the user was to re-enter the `q` edittext and then hit an arrow key the above event listener will not work correctly so I just move the next selection (be it up or down) to the middle of the "frame".

## [0.1.0] - 2022-07-27
### Added
- First official release!
