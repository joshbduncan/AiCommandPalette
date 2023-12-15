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
  //@include "config.jsxinc"
  //@include "helpers.jsxinc"
  //@include "builtin.jsxinc"
  //@include "data.jsxinc"
  //@include "commands.jsxinc"
  //@include "commandPalette.jsxinc"
  //@include "workflowBuilder.jsxinc"
  //@include "startupBuilder.jsxinc"
  //@include "io.jsxinc"
  //@include "workflows.jsxinc"

  // SETUP COMMANDS DATA

  var data = {
    commands: {
      bookmark: {},
      script: {},
      workflow: {},
      menu: builtCommands.menu,
      tool: builtCommands.tool,
      action: {},
      builtin: builtCommands.builtin,
      config: builtCommands.config,
    },
    settings: {
      hidden: [],
      startupCommands: [],
    },
    recent: {
      commands: [],
    },
  };

  // load user settings
  settings.load();

  // load current user actions
  loadActions();

  var appDocuments = app.documents.length > 0;
  var docSelection = appDocuments ? app.activeDocument.selection.length : null;
  var insideWorkflow = false;

  // build all commands
  var commandsData = {};
  var localizedCommandLookup = {};
  var hiddenCommands = [];
  buildCommands(data.commands);

  var allCommands = Object.keys(commandsData);

  // SHOW THE COMMAND PALETTE
  var queryableCommands = filterCommands(
    (commands = commandsData),
    (types = null),
    (showHidden = false),
    (hideCommands = null),
    (docRequired = true),
    (selRequired = true)
  );
  // add basic defaults to the startup on a first/fresh install
  if (!settings.data) {
    data.settings.startupCommands = ["builtin_recentCommands", "config_settings"];
  }
  var startupCommands = [];
  for (var i = 0; i < data.settings.startupCommands.length; i++) {
    // check to make sure command is available
    if (!commandsData.hasOwnProperty(data.settings.startupCommands[i])) continue; // FIXME: add alert
    // also hide any commands that aren't relevant
    if (hiddenCommands.includes(data.settings.startupCommands[i])) continue;
    startupCommands.push(commandsData[data.settings.startupCommands[i]]);
  }
  var result = commandPalette(
    (commands = queryableCommands),
    (title = localize(locStrings.title)),
    (columns = paletteSettings.defaultColumns),
    (multiselect = false),
    (showOnly = startupCommands)
  );
  if (!result) return;
  processCommand(result);
})();
