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
  var _version = "0.9.0";
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
  //@include "dialogs.jsxinc"
  //@include "io.jsxinc"
  //@include "workflows.jsxinc"

  // SETUP COMMANDS DATA

  var data = {
    commands: {
      bookmark: {},
      script: {},
      workflow: {},
      defaults: builtCommands.defaults,
      menu: builtCommands.menu,
      tool: builtCommands.tool,
      action: {},
      builtin: builtCommands.builtin,
      config: builtCommands.config,
    },
    settings: {
      hidden: [],
    },
    recent: {
      commands: [],
    },
  };

  // load user settings
  settings.load();
  loadActions();

  var appDocuments = app.documents.length > 0;
  var docSelection = appDocuments ? app.activeDocument.selection.length : null;
  var insideWorkflow = false;

  // build all commands
  var commandsData = {};
  var idCommandLookup = {};
  var localizedCommandLookup = {};
  buildCommands(data.commands, []);

  // check preferences file
  if (data.settings.hasOwnProperty("version") && data.settings.version < "0.8.1") {
    alert(localize(locStrings.pref_file_non_compatible));
    settings.backup();
    updateOldPreferences();
    settings.save();
    alert(localize(locStrings.pref_update_complete));
    return;
  }

  var allCommands = Object.keys(commandsData);
  var allCommandsLocalized = Object.keys(localizedCommandLookup);

  // SHOW THE COMMAND PALETTE

  var result = commandPalette(
    (commands = allCommandsLocalized),
    (showHidden = false),
    (queryFilter = []),
    (visibleFilter = ["action", "builtin", "config", "menu", "tool"]),
    (title = localize(locStrings.title)),
    (bounds = [0, 0, paletteSettings.paletteWidth, paletteSettings.paletteHeight]),
    (multiselect = false),
    (docRequired = true),
    (selRequired = true)
  );
  if (result) processCommand(localizedCommandLookup[result[0].text]);
})();
