/*
Ai Command Palette
Copyright 2022 Josh Duncan
https://joshbduncan.com

This script is distributed under the MIT License.
See the LICENSE file for details.
*/

(function () {
  //@target illustrator

  // SCRIPT INFORMATION

  var _title = "Ai Command Palette";
  var _version = "0.10.0";
  var _copyright = "Copyright 2022 Josh Duncan";
  var _website = "joshbduncan.com";
  var _github = "https://github.com/joshbduncan";

  //@includepath "include"
  //@include "polyfills.jsxinc"
  //@include "data.jsxinc"
  //@include "config.jsxinc"
  //@include "preferences.jsxinc"
  //@include "history.jsxinc"
  //@include "helpers.jsxinc"
  //@include "builtin.jsxinc"
  //@include "commands.jsxinc"
  //@include "commandPalette.jsxinc"
  //@include "workflowBuilder.jsxinc"
  //@include "startupBuilder.jsxinc"
  //@include "io.jsxinc"
  //@include "workflows.jsxinc"

  // load the user data
  userPrefs.load();
  userHistory.load();
  loadActions();

  // inject user commands
  typesToInject = ["workflows", "bookmarks"];
  for (var i = 0; i < prefs.bookmarks.length; i++) {
    commandsData[prefs.bookmarks[i].id] = prefs.bookmarks[i];
  }

  // add basic defaults to the startup on a first/fresh install
  if (!prefs.startupCommands) {
    prefs.startupCommands = ["builtin_recentCommands", "config_settings"];
  }

  var appDocuments = app.documents.length > 0;
  var docSelection = appDocuments ? app.activeDocument.selection.length > 0 : false;

  // SHOW THE COMMAND PALETTE
  var queryableCommands = filterCommands(
    (commands = null),
    (types = null),
    (showHidden = false),
    (showNonRelevant = false),
    (hideSpecificCommands = null),
    (docRequired = true),
    (selRequired = true)
  );

  var startupCommands = filterCommands(
    (commands = prefs.startupCommands),
    (types = null),
    (showHidden = false),
    (showNonRelevant = false),
    (hideSpecificCommands = null),
    (docRequired = true),
    (selRequired = true)
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
