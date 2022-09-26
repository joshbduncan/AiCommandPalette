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
  var _version = "0.3.0";
  var _copyright = "Copyright 2022 Josh Duncan";
  var _website = "joshbduncan.com";
  var _github = "https://github.com/joshbduncan";

  //@includepath "include"
  //@include "data.jsxinc"
  //@include "config.jsxinc"
  //@include "commands.jsxinc"
  //@include "dialogs.jsxinc"
  //@include "io.jsxinc"
  //@include "polyfills.jsxinc"
  //@include "settings.jsxinc"
  //@include "workflows.jsxinc"

  // SETUP COMMANDS DATA

  var data = {
    commands: {
      script: {},
      workflow: {},
      defaults: builtCommands.defaults,
      menu: builtCommands.menu,
      tool: builtCommands.tool,
      action: {},
      config: builtCommands.config,
    },
    settings: {
      hidden: [],
    },
  };

  // load user settings
  settings.load();
  loadActions();

  // build all commands
  var commandsData = {};
  buildCommands(data.commands, []);
  var allCommands = Object.keys(commandsData);

  // SHOW THE COMMAND PALETTE

  var result = commandPalette(
    (commands = allCommands),
    (showHidden = false),
    (queryFilter = []),
    (visibleFilter = ["action", "config", "menu", "tool"]),
    (title = localize(locStrings.title)),
    (bounds = [0, 0, paletteWidth, 182]),
    (multiselect = false)
  );
  if (result) processCommand(result);
})();
