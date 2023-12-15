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
  //@include "helpers.jsxinc"
  //@include "builtin.jsxinc"
  //@include "commands.jsxinc"
  //@include "commandPalette.jsxinc"
  //@include "workflowBuilder.jsxinc"
  //@include "startupBuilder.jsxinc"
  //@include "io.jsxinc"
  //@include "workflows.jsxinc"

  // load user settings
  // settings.load();

  // load current user actions
  // loadActions();

  var appDocuments = app.documents.length > 0;
  var docSelection = appDocuments ? app.activeDocument.selection.length : null;
  var insideWorkflow = false;

  // SHOW THE COMMAND PALETTE
  // TODO: set hidden property on any user hidden commands
  // TODO: set hidden property on any non-relevant commands
  var queryableCommands = filterCommands(
    (commands = null),
    (types = null),
    (showHidden = false),
    (hideSpecificCommands = null),
    (docRequired = true),
    (selRequired = true)
  );

  // add basic defaults to the startup on a first/fresh install
  // if (!settings.data) {
  //   data.settings.startupCommands = ["builtin_recentCommands", "config_settings"];
  // }
  // var startupCommands = [];
  // for (var i = 0; i < data.settings.startupCommands.length; i++) {
  //   // check to make sure command is available
  //   if (!commandsData.hasOwnProperty(data.settings.startupCommands[i])) continue; // FIXME: add alert
  //   // also hide any commands that aren't relevant
  //   if (hiddenCommands.includes(data.settings.startupCommands[i])) continue;
  //   startupCommands.push(commandsData[data.settings.startupCommands[i]]);
  // }
  var result = commandPalette(
    (commands = queryableCommands),
    (title = localize(strings.title)),
    (columns = paletteSettings.defaultColumns),
    (multiselect = false),
    (showOnly = null)
  );
  if (!result) return;
  processCommand(result);
})();
