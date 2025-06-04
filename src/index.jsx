/*
Ai Command Palette
Copyright 2024 Josh Duncan
https://joshbduncan.com

This script is distributed under the MIT License.
See the LICENSE file for details.
*/

(function () {
  //@target illustrator

  // SCRIPT INFORMATION

  var _title = "Ai Command Palette";
  var _version = "0.13.2";
  var _copyright = "Copyright 2024 Josh Duncan";
  var _website = "joshbduncan.com";
  var _github = "https://github.com/joshbduncan";

  //@includepath "include"
  //@includepath "include/commands"
  //@includepath "include/data"
  //@includepath "include/palettes"
  //@includepath "include/user"

  //@include "polyfills.jsxinc"
  //@include "helpers.jsxinc"
  //@include "io.jsxinc"
  //@include "built_strings.jsxinc"
  //@include "built_commands.jsxinc"
  //@include "config.jsxinc"

  //@include "user.jsxinc"
  //@include "palettes.jsxinc"
  //@include "commands.jsxinc"

  // load the user data
  userPrefs.load(true);
  userActions.load();
  userHistory.load();

  // set command palette matching algo
  var matcher = prefs["fuzzy"] ? fuzzy : scoreMatches;
  // TODO: allow disable keyword latching

  // add basic defaults to the startup on a first-run/fresh install
  if (!prefs.startupCommands) {
    prefs.startupCommands = ["builtin_recentCommands", "config_settings"];
  }

  // SHOW THE COMMAND PALETTE
  var queryableCommands = filterCommands(
    (commands = null),
    (types = null),
    (showHidden = false),
    (showNonRelevant = false),
    (hideSpecificCommands = null)
  );

  var startupCommands = filterCommands(
    (commands = prefs.startupCommands),
    (types = null),
    (showHidden = false),
    (showNonRelevant = false),
    (hideSpecificCommands = null)
  );

  var result = commandPalette(
    (commands = queryableCommands),
    (title = localize(strings.title)),
    (columns = paletteSettings.columnSets.default),
    (multiselect = false),
    (showOnly = startupCommands),
    (saveHistory = true)
  );
  if (!result) return;
  processCommand(result);
})();
