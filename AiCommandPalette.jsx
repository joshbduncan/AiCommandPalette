/*
Ai Command Palette
Copyright 2022 Josh Duncan
https://joshbduncan.com

This script is distributed under the MIT License.
See the LICENSE file for details.
*/

// TODO: add the ability to edit custom commands

//@target illustrator

var _title = "Ai Command Palette";
var _version = "0.1.0";
var _copyright = "Copyright 2022 Josh Duncan";
var _website = "joshbduncan.com";
var _github = "https://github.com/joshbduncan";

// setup main script variables
var data, dataFolder, dataFile, commandsData, allCommands, filteredCommands, result;

// ai command palette data object
data = {
  commands: {
    custom: {},
    script: {},
    action: getAllActions(),
    defaults: {
      "Command Palette Settings": {
        cmdType: "defaults",
        cmdActions: [{ type: "config", value: "paletteSettings" }],
      },
    },
    menu: builtinMenuCommands(),
    config: {
      "About Ai Command Palette...": {
        cmdType: "config",
        cmdActions: [{ type: "config", value: "about" }],
      },
      "Build Custom Command": {
        cmdType: "config",
        cmdActions: [{ type: "config", value: "buildCustomCommand" }],
      },
      "Load Script(s) Into Command Palette": {
        cmdType: "config",
        cmdActions: [{ type: "config", value: "loadScript" }],
      },
      "Show All Built-In Menu Commands": {
        cmdType: "config",
        cmdActions: [{ type: "config", value: "showBuiltInMenuCommands" }],
      },
      "Hide Built-In Command(s)": {
        cmdType: "config",
        cmdActions: [{ type: "config", value: "hideCommand" }],
      },
      "UnHide Built-In Command(s)": {
        cmdType: "config",
        cmdActions: [{ type: "config", value: "unhideCommand" }],
      },
      "Delete Palette Command(s)": {
        cmdType: "config",
        cmdActions: [{ type: "config", value: "deleteCommand" }],
      },
      "Reveal Preferences File": {
        cmdType: "config",
        cmdActions: [{ type: "config", value: "revealPrefFile" }],
      },
    },
  },
  settings: {
    hiddenCommands: [],
    version: _version,
  },
};

// load user data if available and add to data object
dataFolder = setupFolderObject(Folder.userData + "/" + "JBD");
dataFile = setupFileObject(dataFolder, "AiCommandPalette.json");
loadUserData(dataFile);

// setup commands for palette
commandsData = buildCommands(data.commands);
allCommands = getObjectKeys(commandsData);
filteredCommands = filterHiddenCommands(allCommands);

// present the command palette
result = commandPalette(
  (arr = filteredCommands),
  (title = _title),
  (bounds = [0, 0, 500, 182]),
  (multiselect = false),
  (filter = ["action", "menu", "config"])
);
if (result) processCommandActions(result, commandsData);

/**************************************************
COMMAND EXECUTION
**************************************************/

/** iterate over the actions for the picked command */
function processCommandActions(command, commandsObject) {
  var cmdActions = commandsObject[command].cmdActions;
  for (var i = 0; i < cmdActions.length; i++) {
    executeCommandAction(cmdActions[i]);
  }
}

/** execute `action` based on `action.type` */
function executeCommandAction(action) {
  var type, f;

  type = action.type;
  switch (type.toLowerCase()) {
    case "config":
      try {
        configAction(action.value);
      } catch (e) {
        alert("Error executing " + type + " command: " + action.value + "\n" + e);
      }
      break;
    case "menu":
      try {
        app.executeMenuCommand(action.value);
      } catch (e) {
        alert("Error executing " + type + " command: " + action.value + "\n" + e);
      }
      break;
    case "action":
      try {
        app.doScript(action.value.actionName, action.value.actionSet);
      } catch (e) {
        alert("Error executing action: " + action.value.actionName + "\n" + e);
      }
      break;
    case "script":
      f = new File(action.value.scriptPath);
      if (!f.exists) {
        alert(
          "Sorry, script no longer exists. Try reloading.\nPLEASE NOTE: This script has been removed from your user preferences and will no longer work in any custom commands you previously created where this script was a step.\n\nYou must reload your script and rebuild any custom commands that use it."
        );
        delete data.commands[type]["Script: " + action.value.scriptName];
        writeUserData(dataFile);
      } else {
        try {
          $.evalFile(f);
        } catch (e) {
          alert("Error executing script: " + action.value.scriptName + "\n" + e);
        }
      }
      break;
    default:
      alert("Sorry, " + type + " isn't a valid command type.");
  }
  try {
    app.redraw();
  } catch (e) {
    $.writeln(e);
  }
}

/**************************************************
CONFIGURATION OPERATIONS
**************************************************/

/** execute command palette configuration actions */
function configAction(action) {
  var result;
  var write = true;

  switch (action) {
    case "paletteSettings":
      configPaletteSettings();
      write = false;
      break;
    case "about":
      aboutDialog();
      break;
    case "buildCustomCommand":
      configBuildCustomCommand();
      break;
    case "loadScript":
      configLoadScript();
      break;
    case "showBuiltInMenuCommands":
      showBuiltInMenuCommands();
      write = false;
      break;
    case "hideCommand":
      configHideCommand();
      break;
    case "unhideCommand":
      configUnhideCommand();
      break;
    case "deleteCommand":
      configDeleteCommand();
      break;
    case "revealPrefFile":
      dataFolder.execute();
      write = false;
      break;
    default:
      alert("Sorry, " + action + " isn't a valid configuration option.");
  }
  if (write) writeUserData(dataFile);
}

function aboutDialog() {
  var win = new Window("dialog");
  win.text = "Ai Command Palette " + _version;
  win.alignChildren = "fill";

  // script info
  var pAbout = win.add("panel", undefined, "About");
  pAbout.margins = 20;
  pAbout.alignChildren = "fill";
  var aboutText =
    "If you have worked with Alfred app or VS Code you know how great the 'command palette' is... Well, I wanted that same functionality in Adobe Illustrator so here's what I've come up with.\
  \
  You can execute:\
  - most any Illustrator Menu command\
  - any actions from your Actions Palette\
  - scripts from anywhere on your filesystem\
  \
  AND you can build custom commands that chain other commands together!";
  var about = pAbout.add("statictext", [0, 0, 500, 150], aboutText, {
    multiline: true,
  });

  // window buttons
  var winButtons = win.add("group");
  winButtons.orientation = "row";
  winButtons.alignChildren = ["center", "center"];
  var ok = winButtons.add("button", undefined, "OK");
  ok.preferredSize.width = 100;
  var cancel = winButtons.add("button", undefined, "Cancel");
  cancel.preferredSize.width = 100;

  // copyright info
  var pCopyright = win.add("panel", undefined);
  pCopyright.orientation = "column";
  pCopyright.add("statictext", undefined, "Version " + _version + " " + _copyright);
  var website = pCopyright.add("statictext", undefined, _website);

  website.addEventListener("mousedown", function () {
    openURL("https://" + _website);
  });

  win.show();
}

/** show all config commands in a palette */
function configPaletteSettings() {
  var result = commandPalette(
    (arr = getObjectKeys(data.commands.config)),
    (title = "Palette Settings and Configuration"),
    (bounds = [0, 0, 500, 182]),
    (multiselect = false),
    (filter = [])
  );
  if (result) processCommandActions(result, commandsData);
}

/** load external scripts into the command palette */
function configLoadScript() {
  var files, f, fname;
  var ct = 0;

  var files = File.openDialog("Load Script File(s)", "", true);
  if (files) {
    for (var i = 0; i < files.length; i++) {
      f = files[i];
      fname = decodeURI(f.name);
      if (f.name.search(".jsx$|.js$") >= 0) {
        if (data.commands.script.hasOwnProperty("Script: " + fname)) {
          if (
            data.commands.script["Script: " + fname].cmdActions[0].value.scriptPath ==
            f.fsName
          ) {
            alert("Script " + fname + " already loaded at exact same file path!");
            continue;
          } else {
            if (
              !Window.confirm(
                "Replace " + fname + " script that is already loaded?",
                "noAsDflt",
                "Script Load Conflict"
              )
            )
              continue;
          }
        }
        try {
          data.commands.script["Script: " + fname] = {
            cmdType: "script",
            cmdActions: [
              {
                type: "script",
                value: {
                  scriptName: fname,
                  scriptPath: f.fsName,
                },
              },
            ],
          };
          ct++;
        } catch (e) {
          alert("Error loading script: " + fname + "\nPath: " + f.fsName);
        }
      }
    }
    if (ct > 0) buildCommands(data.commands, true);
    alert("Total scripts loaded: " + ct);
  }
}

/** build custom commands with step from other commands */
function configBuildCustomCommand() {
  var command;
  var cmdActions = [];

  result = customCommandsBuilder(
    (arr = filterOutCommands(filteredCommands, ["config"])),
    (title = "Custom Command Builder"),
    (bounds = [0, 0, 500, 182]),
    (multiselect = false)
  );
  if (result) {
    try {
      for (var i = 0; i < result.items.length; i++) {
        command = result.items[i].text;
        for (var a = 0; a < commandsData[command].cmdActions.length; a++) {
          cmdActions.push({
            type: commandsData[command].cmdActions[a].type,
            value: commandsData[command].cmdActions[a].value,
          });
        }
      }
      data.commands.custom[result.name] = {
        cmdType: "custom",
        cmdActions: cmdActions,
      };
    } catch (e) {
      alert("Error saving custom command!");
    }
  }
}

/** show all builtin menu commands in a palette */
function showBuiltInMenuCommands() {
  result = commandPalette(
    (arr = getObjectKeys(data.commands.menu)),
    (title = "All Built-In Menu Commands"),
    (bounds = [0, 0, 500, 182]),
    (multiselect = false),
    (filter = [])
  );
  if (result) processCommandActions(result, commandsData);
}

/** hide commands from the command palette results */
function configHideCommand() {
  var commands, result;
  var ct = 0;

  commands = filterOutCommands(getObjectKeys(commandsData), [
    "config",
    "custom",
    "script",
  ]);
  if (commands.length > 0) {
    result = commandPalette(
      (arr = commands),
      (title = "Select Menu Command(s) To Hide"),
      (bounds = [0, 0, 500, 182]),
      (multiselect = true),
      (filter = [])
    );
    if (result) {
      if (
        Window.confirm(
          "Hide Command(s)?\n" + result.join("\n"),
          "noAsDflt",
          "Confirm Command(s) To Hide"
        )
      ) {
        for (var i = 0; i < result.length; i++) {
          data.settings.hiddenCommands.push(result[i].text);
          ct++;
        }
      }
    }
    if (ct > 0) {
      alert("Total commands hidden: " + ct);
    }
  } else {
    alert("Sorry, there are no commands to hide.");
  }
}

/** unhide commands from the users settings */
function configUnhideCommand() {
  var result;
  var ct = 0;

  if (data.settings.hiddenCommands.length > 0) {
    result = commandPalette(
      (arr = data.settings.hiddenCommands),
      (title = "Select Menu Command(s) To UnHide"),
      (bounds = [0, 0, 500, 182]),
      (multiselect = true),
      (filter = [])
    );
    if (result) {
      if (
        Window.confirm(
          "UnHide Command(s)?\n" + result.join("\n"),
          "noAsDflt",
          "Confirm Command(s) To UnHide"
        )
      ) {
        for (var i = 0; i < result.length; i++) {
          for (var n = 0; n < data.settings.hiddenCommands.length; n++) {
            if (result[i].text == data.settings.hiddenCommands[n]) {
              data.settings.hiddenCommands.splice(n, 1);
              ct++;
            }
          }
        }
      }
    }
    if (ct > 0) {
      alert("Total commands unhidden: " + ct);
    }
  } else {
    alert("Sorry, there are no commands to unhide.");
  }
}

/** delete commands from the command palette */
function configDeleteCommand() {
  var commands, result, cmdToDelete, type;
  var ct = 0;

  commands = filterOutCommands(getObjectKeys(commandsData), [
    "defaults",
    "config",
    "action",
    "menu",
  ]);
  if (commands.length > 0) {
    result = commandPalette(
      (arr = commands),
      (title = "Select Menu Commands To Delete"),
      (bounds = [0, 0, 500, 182]),
      (multiselect = true),
      (filter = [])
    );
    if (result) {
      if (
        Window.confirm(
          "Delete Command(s)?\n" + result.join("\n"),
          "noAsDflt",
          "Confirm Command(s) To Delete"
        )
      ) {
        for (var i = 0; i < result.length; i++) {
          cmdToDelete = result[i].text;
          type = commandsData[cmdToDelete].cmdType;
          try {
            delete data.commands[type][cmdToDelete];
            ct++;
          } catch (e) {
            alert("Couldn't delete command: " + cmdToDelete);
          }
        }
      }
    }
    if (ct > 0) {
      alert("Total commands deleted: " + ct);
    }
  } else {
    alert("Sorry, there are no commands to delete.");
  }
}

/**************************************************
USER DIALOGS (and accompanying functions)
**************************************************/

/** show the command palette to the user populated with commands from `arr` */
function commandPalette(arr, title, bounds, multiselect, filter) {
  var q, filteredArr, matches, temp;
  var visibleListItems = 9;
  var frameStart = 0;

  var win = new Window("dialog");
  win.text = title;
  win.alignChildren = "fill";
  var q = win.add("edittext");
  q.helpTip = "Search for commands, actions, and loaded scripts.";
  q.active = true;

  if (filter.length > 0) {
    filteredArr = filterOutCommands(arr, filter);
  } else {
    filteredArr = arr;
  }

  var list = win.add("listbox", bounds, filteredArr, { multiselect: multiselect });
  list.selection = 0;

  // window buttons
  var winButtons = win.add("group");
  winButtons.orientation = "row";
  winButtons.alignChildren = ["center", "center"];
  var ok = winButtons.add("button", undefined, "OK");
  ok.preferredSize.width = 100;
  var cancel = winButtons.add("button", undefined, "Cancel");
  cancel.preferredSize.width = 100;

  // as a query is typed update the list box
  q.onChanging = function () {
    frameStart = 0;
    q = this.text;
    matches = q === "" ? filteredArr : scoreMatches(q, arr);
    if (matches.length > 0) {
      temp = win.add("listbox", list.bounds, matches, {
        multiselect: list.properties.multiselect,
      });
      // close window when double-clicking a selection
      temp.onDoubleClick = function () {
        if (list.selection) win.close(1);
      };
      win.remove(list);
      list = temp;
      list.selection = 0;
    }
  };

  /*
  Move the listbox frame of visible items when using the
  up and down arrow keys while in the `q` edittext.

  One problem with this functionality is that when a listbox listitem
  is selected via a script the API moves the visible "frame" of items
  so that the new selection is at the top. This is not standard behavior,
  and not even how the listbox behaves when you use the up and down keys inside
  of the actual listbox.

  Only works if multiselect if set to false.
  */
  q.addEventListener("keydown", function (k) {
    if (k.keyName == "Up") {
      k.preventDefault();
      if (list.selection.index > 0) {
        list.selection = list.selection.index - 1;
        if (list.selection.index < frameStart) frameStart--;
      }
    } else if (k.keyName == "Down") {
      k.preventDefault();
      if (list.selection.index < list.items.length) {
        list.selection = list.selection.index + 1;
        if (list.selection.index > frameStart + visibleListItems - 1) {
          if (frameStart < list.items.length - visibleListItems) {
            frameStart++;
          } else {
            frameStart = frameStart;
          }
        }
      }
    }
    /*
    If a selection is made inside of the actual listbox frame by the user,
    the API doesn't offer any way to know which part of the list is currently
    visible in the listbox "frame". If the user was to re-enter the `q` edittext
    and then hit an arrow key the above event listener will not work correctly so
    I just move the next selection (be it up or down) to the middle of the "frame".
    */
    if (
      list.selection.index < frameStart ||
      list.selection.index > frameStart + visibleListItems - 1
    )
      frameStart = list.selection.index - Math.floor(visibleListItems / 2);
    // move the frame by revealing the calculated `frameStart`
    list.revealItem(frameStart);
  });

  // close window when double-clicking a selection
  list.onDoubleClick = function () {
    if (list.selection) win.close(1);
  };

  if (win.show() == 1) {
    if (list.selection) {
      return multiselect ? list.selection : [list.selection];
    }
  }
  return false;
}

/** show the custom commands builder palette populated with commands from `arr` */
function customCommandsBuilder(arr, title, bounds, multiselect) {
  var win = new Window("dialog");
  win.text = title;
  win.alignChildren = "fill";

  // command search
  var pSearch = win.add("panel", undefined, "Search For Commands");
  pSearch.alignChildren = ["fill", "center"];
  pSearch.margins = 20;
  var q = pSearch.add("edittext");
  q.helpTip = "Search for commands, actions, and loaded scripts.";
  q.active = true;
  var commands = pSearch.add("listbox", bounds, arr, { multiselect: multiselect });
  commands.helpTip = "Double-click a command to add it as a custom step below.";
  commands.selection = 0;

  // custom command steps
  var pSteps = win.add("panel", undefined, "Custom Command Steps");
  pSteps.alignChildren = ["fill", "center"];
  pSteps.margins = 20;
  var steps = pSteps.add("listbox", bounds, [], { multiselect: false });
  steps.helpTip = "Commands will run in order from top to bottom.";
  var stepButtons = pSteps.add("group");
  stepButtons.alignment = "center";
  var up = stepButtons.add("button", undefined, "Move Up");
  up.preferredSize.width = 100;
  var down = stepButtons.add("button", undefined, "Move Down");
  down.preferredSize.width = 100;
  var del = stepButtons.add("button", undefined, "Delete");
  del.preferredSize.width = 100;

  // command name
  var pName = win.add("panel", undefined, "Save Custom Command As");
  pName.alignChildren = ["fill", "center"];
  pName.margins = 20;
  var name = pName.add("edittext", undefined, "");
  name.enabled = false;

  // window buttons
  var winButtons = win.add("group");
  winButtons.orientation = "row";
  winButtons.alignChildren = ["center", "center"];
  var ok = winButtons.add("button", undefined, "OK");
  ok.preferredSize.width = 100;
  ok.enabled = false;
  var cancel = winButtons.add("button", undefined, "Cancel");
  cancel.preferredSize.width = 100;

  // as a query is typed update the list box
  var matches, temp;
  q.onChanging = function () {
    q = this.text;
    matches = q === "" ? arr : scoreMatches(q, arr);
    if (matches.length > 0) {
      temp = pSearch.add("listbox", commands.bounds, matches, {
        multiselect: commands.properties.multiselect,
      });
      // add command when double-clicking
      temp.onDoubleClick = function () {
        if (commands.selection) {
          steps.add("item", commands.selection);
          name.enabled = true;
        }
      };
      pSearch.remove(commands);
      commands = temp;
      commands.selection = 0;
      cur = 0;
    }
  };

  name.onChanging = function () {
    if (name.text.length > 0) {
      ok.enabled = true;
    } else {
      ok.enabled = false;
    }
  };

  up.onClick = function () {
    var n = steps.selection.index;
    if (n > 0) {
      swap(steps.items[n - 1], steps.items[n]);
      steps.selection = n - 1;
    }
  };

  down.onClick = function () {
    var n = steps.selection.index;
    if (n < steps.items.length - 1) {
      swap(steps.items[n], steps.items[n + 1]);
      steps.selection = n + 1;
    }
  };

  del.onClick = function () {
    if (steps.selection) {
      steps.remove(steps.selection.index);
      if (steps.items.length == 0) {
        name.enabled = false;
        ok.enabled = false;
      }
    }
  };

  // add command when double-clicking
  commands.onDoubleClick = function () {
    if (commands.selection) {
      steps.add("item", commands.selection);
      name.enabled = true;
    }
  };

  /** swap listbox items in place */
  function swap(x, y) {
    var t = x.text;
    x.text = y.text;
    y.text = t;
  }

  if (win.show() == 1) {
    var finalName = "Custom: " + name.text;
    return { name: finalName, items: steps.items };
    // TODO: check if custom name already exists
  }
  return false;
}

/**
 * Score array items based on string match with query.
 * @param   {String} q   String to search for withing `arr`
 * @param   {Array}  arr String items to try and match.
 * @returns {Array}      Matching items sorted by score.
 */
function scoreMatches(q, arr) {
  var word;
  var words = [];
  var scores = {};
  var words = q.split(" ");
  for (var i = 0; i < arr.length; i++) {
    var score = 0;
    for (var n = 0; n < words.length; n++) {
      word = words[n];
      if (word != "" && arr[i].match("(?:^|\\s)(" + word + ")", "gi") != null) score++;
    }
    if (score > 0) scores[arr[i]] = score;
  }
  return sortKeysByValue(scores, "score", "name");
}

/**
 * Sort an objects key by their value.
 * @param   {Object} obj Simple object with `key`: `value` pairs.
 * @returns {Array}      Array of sorted keys.
 */
function sortKeysByValue(obj) {
  var sorted = [];
  for (var key in obj) {
    for (var i = 0; i < sorted.length; i++) {
      if (obj[key] > obj[sorted[i]]) break;
    }
    sorted.splice(i, 0, key);
  }
  return sorted;
}

/**************************************************
SUPPLEMENTAL FUNCTIONS
**************************************************/

/** build overall command object and list objects from `obj` */
function buildCommands(obj) {
  var commandsData = {};
  for (var commandsType in obj) {
    for (var command in obj[commandsType]) {
      commandsData[command] = obj[commandsType][command];
    }
  }
  return commandsData;
}

/** get all commands that aren't of specific type or name */
function filterOutCommands(commandsArr, types) {
  var filtered = [];
  for (var i = 0; i < commandsArr.length; i++) {
    if (!includes(types, commandsData[commandsArr[i]].cmdType))
      filtered.push(commandsArr[i]);
  }
  return filtered;
}

/** filter out all commands hidden by user */
function filterHiddenCommands() {
  var arr = [];
  for (var i = 0; i < allCommands.length; i++) {
    if (!includes(data.settings.hiddenCommands, allCommands[i]))
      arr.push(allCommands[i]);
  }
  return arr;
}

/** get all currently installed action sets and actions */
function getAllActions() {
  var currentPath, setName, actionCount, actionName;
  var actions = {};
  var pref = app.preferences;
  var path = "plugin/Action/SavedSets/set-";

  for (var i = 1; i <= 100; i++) {
    currentPath = path + i.toString() + "/";
    // get action sets
    setName = pref.getStringPreference(currentPath + "name");
    if (!setName) {
      break;
    }
    // get actions in set
    actionCount = Number(pref.getIntegerPreference(currentPath + "actionCount"));
    for (var j = 1; j <= actionCount; j++) {
      actionName = pref.getStringPreference(
        currentPath + "action-" + j.toString() + "/name"
      );
      actions["Action: " + actionName + " [" + setName + "]"] = {
        cmdType: "action",
        cmdActions: [
          {
            type: "action",
            value: {
              actionSet: setName,
              actionName: actionName,
            },
          },
        ],
      };
    }
  }
  return actions;
}

/** get all key from `obj` */
function getObjectKeys(obj) {
  var keys = [];
  for (var k in obj) {
    keys.push(k);
  }
  return keys;
}

/** check to see if `arr` includes `q` */
function includes(arr, q) {
  for (var i = 0; i < arr.length; i++) {
    if (q === arr[i]) return true;
  }
  return false;
}

/** open `url` in browser */
function openURL(url) {
  var html = new File(Folder.temp.absoluteURI + "/aisLink.html");
  html.open("w");
  var htmlBody =
    '<html><head><META HTTP-EQUIV=Refresh CONTENT="0; URL=' +
    url +
    '"></head><body> <p></body></html>';
  html.write(htmlBody);
  html.close();
  html.execute();
}

/**************************************************
FILE/FOLDER OPERATIONS
**************************************************/

/** load user saved preferences from disk at `f` and add to `data` object */
function loadUserData(f) {
  var userData = {};
  if (f.exists) {
    userData = readJSONData(f);
    for (var prop in userData) {
      for (var subProp in userData[prop]) {
        data[prop][subProp] = userData[prop][subProp];
      }
    }
  }
  return userData;
}

/** write user data to disk */
function writeUserData(f) {
  var userData = {
    commands: {
      custom: data.commands.custom,
      script: data.commands.script,
    },
    settings: data.settings,
  };
  writeJSONData(userData, f);
}

/** setup a new folder object at `path` and create if doesn't exists */
function setupFolderObject(path) {
  var folder = new Folder(path);
  if (!folder.exists) folder.create();
  return folder;
}

/** setup a new file object with name `fName` at `folderPath` */
function setupFileObject(folderPath, fName) {
  return new File(folderPath + "/" + fName);
}

/** read ai "json-like" data from file `f` */
function readJSONData(f) {
  var json, obj;

  try {
    f.encoding = "UTF-8";
    f.open("r");
    json = f.read();
    f.close();
  } catch (e) {
    alert("Error loading " + f + " file!");
  }
  obj = eval(json);
  return obj;
}

/** write ai "json-like" data in `obj` to file `f` */
function writeJSONData(obj, f) {
  var data = obj.toSource();
  try {
    f.encoding = "UTF-8";
    f.open("w");
    f.write(data);
    f.close();
  } catch (e) {
    alert("Error writing file " + f + "!");
  }
}

/** default ai menu commands */
function builtinMenuCommands() {
  return {
    "File > New": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "new" }],
    },
    "File > New from Template": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "newFromTemplate" }],
    },
    "File > Open": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "open" }],
    },
    "File > Browse in Bridge": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Bridge Browse" }],
    },
    "File > Device Central": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe AI Device center" }],
    },
    "File > Close": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "close" }],
    },
    "File > Save": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "save" }],
    },
    "File > Save As": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "saveas" }],
    },
    "File > Save a Copy": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "saveacopy" }],
    },
    "File > Save as Template": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "saveastemplate" }],
    },
    "File > Save for Web & Devices": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe AI Save For Web" }],
    },
    "File > Save Selected Slices": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe AI Save Selected Slices" }],
    },
    "File > Revert": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "revert" }],
    },
    "File > Place": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AI Place" }],
    },
    "File > Export": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "export" }],
    },
    "File > Export Selection": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "exportSelection" }],
    },
    "File > Export/Export For Screens": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "exportForScreens" }],
    },
    "File > Scripts > Other Script": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "ai_browse_for_script" }],
    },
    "File > Document Setup": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "document" }],
    },
    "File > Document Color Mode > CMYK Color": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "doc-color-cmyk" }],
    },
    "File > Document Color Mode > RGB Color": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "doc-color-rgb" }],
    },
    "File > File Info": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "File Info" }],
    },
    "File > Print": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Print" }],
    },
    "File > Exit": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "quit" }],
    },
    "Edit > Undo": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "undo" }],
    },
    "Edit > Redo": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "redo" }],
    },
    "Edit > Cut": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "cut" }],
    },
    "Edit > Copy": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "copy" }],
    },
    "Edit > Paste": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "paste" }],
    },
    "Edit > Paste in Front": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "pasteFront" }],
    },
    "Edit > Paste in Back": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "pasteBack" }],
    },
    "Edit > Paste in Place": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "pasteInPlace" }],
    },
    "Edit > Paste on All Artboards": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "pasteInAllArtboard" }],
    },
    "Edit > Clear": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "clear" }],
    },
    "Edit > Find & Replace": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find and Replace" }],
    },
    "Edit > Find Next": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find Next" }],
    },
    "Edit > Check Spelling": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Check Spelling" }],
    },
    "Edit > Edit Custom Dictionary": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Edit Custom Dictionary..." }],
    },
    "Edit > Define Pattern": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Define Pattern Menu Item" }],
    },
    "Edit > Edit Colors > Recolor Artwork": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Recolor Art Dialog" }],
    },
    "Edit > Edit Colors > Adjust Color Balance": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adjust3" }],
    },
    "Edit > Edit Colors > Blend Front to Back": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Colors3" }],
    },
    "Edit > Edit Colors > Blend Horizontally": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Colors4" }],
    },
    "Edit > Edit Colors > Blend Vertically": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Colors5" }],
    },
    "Edit > Edit Colors > Convert to CMYK": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Colors8" }],
    },
    "Edit > Edit Colors > Convert to Grayscale": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Colors7" }],
    },
    "Edit > Edit Colors > Convert to RGB": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Colors9" }],
    },
    "Edit > Edit Colors > Invert Colors": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Colors6" }],
    },
    "Edit > Edit Colors > Overprint Black": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Overprint2" }],
    },
    "Edit > Edit Colors > Saturate": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Saturate3" }],
    },
    "Edit > Edit Original": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "EditOriginal Menu Item" }],
    },
    "Edit > Transparency Flattener Presets": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Transparency Presets" }],
    },
    "Edit > Tracing Presets": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "TracingPresets" }],
    },
    "Edit > Print Presets": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Print Presets" }],
    },
    "Edit > Adobe PDF Presets": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "PDF Presets" }],
    },
    "Edit > SWF Presets": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "SWFPresets" }],
    },
    "Edit > Perspective Grid Presets": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "PerspectiveGridPresets" }],
    },
    "Edit > Color Settings": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "color" }],
    },
    "Edit > Assign Profile": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "assignprofile" }],
    },
    "Edit > Keyboard Shortcuts": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "KBSC Menu Item" }],
    },
    "Edit > Run AAT Test": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AAT Menu Item" }],
    },
    "Edit > Edit AAT Script": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Last AAT Menu Item" }],
    },
    "Edit > Abort AAT Script": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Abort AAT Menu Item" }],
    },
    "Edit > Preferences > General": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "preference" }],
    },
    "Edit > Preferences > Selection & Anchor Display": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "selectPref" }],
    },
    "Edit > Preferences > Type": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "keyboardPref" }],
    },
    "Edit > Preferences > Units": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "unitundoPref" }],
    },
    "Edit > Preferences > Guides & Grid": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "guidegridPref" }],
    },
    "Edit > Preferences > Smart Guides": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "snapPref" }],
    },
    "Edit > Preferences > Slices": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "slicePref" }],
    },
    "Edit > Preferences > Hyphenation": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "hyphenPref" }],
    },
    "Edit > Preferences > Plug-ins & Scratch Disks": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "pluginPref" }],
    },
    "Edit > Preferences > User Interface": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "UIPref" }],
    },
    "Edit > Preferences > File Handling & Clipboard": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "FileClipboardPref" }],
    },
    "Edit > Preferences > Appearance of Black": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "BlackPref" }],
    },
    "Object > Transform > Transform Again": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "transformagain" }],
    },
    "Object > Transform > Move": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "transformmove" }],
    },
    "Object > Transform > Rotate": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "transformrotate" }],
    },
    "Object > Transform > Reflect": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "transformreflect" }],
    },
    "Object > Transform > Scale": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "transformscale" }],
    },
    "Object > Transform > Shear": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "transformshear" }],
    },
    "Object > Transform Each": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Transform v23" }],
    },
    "Object > Transform > Reset Bounding Box": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AI Reset Bounding Box" }],
    },
    "Object > Arrange > Bring to Front": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "sendToFront" }],
    },
    "Object > Arrange > Bring Forward": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "sendForward" }],
    },
    "Object > Arrange > Send Backward": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "sendBackward" }],
    },
    "Object > Arrange > Send to Back": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "sendToBack" }],
    },
    "Object > Arrange > Send to Current Layer": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Selection Hat 2" }],
    },
    "Object > Group": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "group" }],
    },
    "Object > Ungroup": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "ungroup" }],
    },
    "Object > Lock > Selection": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "lock" }],
    },
    "Object > Lock > All Artwork Above": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Selection Hat 5" }],
    },
    "Object > Lock > Other Layers": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Selection Hat 7" }],
    },
    "Object > Unlock All": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "unlockAll" }],
    },
    "Object > Hide > Selection": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "hide" }],
    },
    "Object > Hide > All Artwork Above": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Selection Hat 4" }],
    },
    "Object > Hide > Other Layers": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Selection Hat 6" }],
    },
    "Object > Show All": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "showAll" }],
    },
    "Object > Expand": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Expand3" }],
    },
    "Object > Expand Appearance": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "expandStyle" }],
    },
    "Object > Flatten Transparency": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "FlattenTransparency1" }],
    },
    "Object > Rasterize": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Rasterize 8 menu item" }],
    },
    "Object > Create Gradient Mesh": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "make mesh" }],
    },
    "Object > Create Object Mosaic": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AI Object Mosaic Plug-in4" }],
    },
    "Object > Create Trim Marks": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "TrimMark v25" }],
    },
    "Object > Slice > Make": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Make Slice" }],
    },
    "Object > Slice > Release": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Release Slice" }],
    },
    "Object > Slice > Create from Guides": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Create from Guides" }],
    },
    "Object > Slice > Create from Selection": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Create from Selection" }],
    },
    "Object > Slice > Duplicate Slice": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Duplicate" }],
    },
    "Object > Slice > Combine Slices": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Combine" }],
    },
    "Object > Slice > Divide Slices": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Divide" }],
    },
    "Object > Slice > Delete All": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Delete All Slices" }],
    },
    "Object > Slice > Slice Options": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Slice Options" }],
    },
    "Object > Slice > Clip to Artboard": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Clip to Artboard" }],
    },
    "Object > Path > Join": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "join" }],
    },
    "Object > Path > Average": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "average" }],
    },
    "Object > Path > Outline Stroke": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "OffsetPath v22" }],
    },
    "Object > Path > Offset Path": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "OffsetPath v23" }],
    },
    "Object > Path > Simplify": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "simplify menu item" }],
    },
    "Object > Path > Add Anchor Points": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Add Anchor Points2" }],
    },
    "Object > Path > Remove Anchor Points": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Remove Anchor Points menu" }],
    },
    "Object > Path > Divide Objects Below": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Knife Tool2" }],
    },
    "Object > Path > Split Into Grid": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Rows and Columns...." }],
    },
    "Object > Path > Clean Up": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "cleanup menu item" }],
    },
    "Object > Blend > Make": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Path Blend Make" }],
    },
    "Object > Blend > Release": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Path Blend Release" }],
    },
    "Object > Blend > Expand": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Path Blend Expand" }],
    },
    "Object > Blend > Blend Options": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Path Blend Options" }],
    },
    "Object > Blend > Replace Spine": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Path Blend Replace Spine" }],
    },
    "Object > Blend > Reverse Spine": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Path Blend Reverse Spine" }],
    },
    "Object > Blend > Reverse Front to Back": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Path Blend Reverse Stack" }],
    },
    "Object > Envelope Distort > Make with Warp": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Make Warp" }],
    },
    "Object > Envelope Distort > Make with Mesh": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Create Envelope Grid" }],
    },
    "Object > Envelope Distort > Make with Top Object ": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Make Envelope" }],
    },
    "Object > Envelope Distort > Release": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Release Envelope" }],
    },
    "Object > Envelope Distort > Envelope Options": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Envelope Options" }],
    },
    "Object > Envelope Distort > Expand": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Expand Envelope" }],
    },
    "Object > Envelope Distort > Edit Contents ": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Edit Envelope Contents" }],
    },
    "Object > Perspective > Attach to Active Plane": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Attach to Active Plane" }],
    },
    "Object > Perspective > Release with Perspective": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Release with Perspective" }],
    },
    "Object > Perspective > Move Plane to Match Object": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Show Object Grid Plane" }],
    },
    "Object > Perspective > Edit Text": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Edit Original Object" }],
    },
    "Object > Live Paint > Make ": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Make Planet X" }],
    },
    "Object > Live Paint > Merge": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Marge Planet X" }],
    },
    "Object > Live Paint > Release": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Release Planet X" }],
    },
    "Object > Live Paint > Gap Options": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Planet X Options" }],
    },
    "Object > Live Paint > Expand": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Expand Planet X" }],
    },
    "Object > Live Trace > Make": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Make Tracing" }],
    },
    "Object > Live Trace > Make and Expand": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Make and Expand" }],
    },
    "Object > Live Trace > Make and Convert to Live Paint": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Make and Convert to Live Paint" }],
    },
    "Object > Live Trace > Release": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Release Tracing" }],
    },
    "Object > Live Trace > Tracing Options": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Tracing Options" }],
    },
    "Object > Live Trace > Expand": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Expand Tracing" }],
    },
    "Object > Live Trace > Expand as Viewed": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Expand as Viewed" }],
    },
    "Object > Live Trace > Convert to Live Paint": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Paint Tracing" }],
    },
    "Object > Live Trace > Show No Image": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "ShowNoImage" }],
    },
    "Object > Live Trace > Show Original Image": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "ShowOriginalImage" }],
    },
    "Object > Live Trace > Show Adjusted Image": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Show Preprocessed Image" }],
    },
    "Object > Live Trace > Show Transparent Image": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "ShowTransparentImage" }],
    },
    "Object > Live Trace > Show No Tracing Result": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "ShowNoArtwork" }],
    },
    "Object > Live Trace > Show Tracing Result": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "ShowArtwork" }],
    },
    "Object > Live Trace > Show Outlines": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "ShowPaths" }],
    },
    "Object > Live Trace > Show Outlines with Tracing": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "ShowPathsAndTransparentArtwork" }],
    },
    "Object > Text Wrap > Make": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Make Text Wrap" }],
    },
    "Object > Text Wrap > Release": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Release Text Wrap" }],
    },
    "Object > Text Wrap > Text Wrap Options": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Text Wrap Options..." }],
    },
    "Object > Clipping Mask > Make": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "makeMask" }],
    },
    "Object > Clipping Mask > Release": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "releaseMask" }],
    },
    "Object > Clipping Mask > Edit Contents": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "editMask" }],
    },
    "Object > Compound Path > Make": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "compoundPath" }],
    },
    "Object > Compound Path > Release": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "noCompoundPath" }],
    },
    "Object > Artboards > Convert to Artboards": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "setCropMarks" }],
    },
    "Object > Artboards > Rearrange": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "ReArrange Artboards" }],
    },
    "Object > Artboards > Fit to Artwork Bounds": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Fit Artboard to artwork bounds" }],
    },
    "Object > Artboards > Fit to Selected Art": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Fit Artboard to selected Art" }],
    },
    "Object > Graph > Type": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "setGraphStyle" }],
    },
    "Object > Graph > Data": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "editGraphData" }],
    },
    "Object > Graph > Design": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "graphDesigns" }],
    },
    "Object > Graph > Column": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "setBarDesign" }],
    },
    "Object > Graph > Marker": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "setIconDesign" }],
    },
    "Type > Glyphs": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "alternate glyph palette plugin" }],
    },
    "Type > Area Type Options": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "area-type-options" }],
    },
    "Type > Type on a Path > Rainbow": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Rainbow" }],
    },
    "Type > Type on a Path > 3D Ribbon": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "3D ribbon" }],
    },
    "Type > Type on a Path > Skew": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Skew" }],
    },
    "Type > Type on a Path > Stair Step": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Stair Step" }],
    },
    "Type > Type on a Path > Gravity": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Gravity" }],
    },
    "Type > Type on a Path > Type on a path Options": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "typeOnPathOptions" }],
    },
    "Type > Type on a Path > Update Legacy Type on a Path": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "updateLegacyTOP" }],
    },
    "Type > Threaded Text > Create": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "threadTextCreate" }],
    },
    "Type > Threaded Text > Release Selection": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "releaseThreadedTextSelection" }],
    },
    "Type > Threaded Text > Remove Threading": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "removeThreading" }],
    },
    "Type > Composite Fonts": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe internal composite font plugin" }],
    },
    "Type > Kinsoku Shori Settings": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Kinsoku Settings" }],
    },
    "Type > Mojikumi Settings": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe MojiKumi Settings" }],
    },
    "Type > Fit Headline": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "fitHeadline" }],
    },
    "Type > Create Outlines": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "outline" }],
    },
    "Type > Find Font": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Illustrator Find Font Menu Item" }],
    },
    "Type > Change Case > UPPERCASE": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "UpperCase Change Case Item" }],
    },
    "Type > Change Case > lowercase": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "LowerCase Change Case Item" }],
    },
    "Type > Change Case > Title Case": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Title Case Change Case Item" }],
    },
    "Type > Change Case > Sentence case": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Sentence case Change Case Item" }],
    },
    "Type > Smart Punctuation": {
      cmdType: "menu",
      cmdActions: [
        {
          type: "menu",
          value: "Adobe Illustrator Smart Punctuation Menu Item",
        },
      ],
    },
    "Type > Optical Margin Alignment": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Optical Alignment Item" }],
    },
    "Type > Show Hidden Characters": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "showHiddenChar" }],
    },
    "Type > Type Orientation > Horizontal": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "type-horizontal" }],
    },
    "Type > Type Orientation > Vertical": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "type-vertical" }],
    },
    "Select > All": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "selectall" }],
    },
    "Select > All on Active Artboard": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "selectallinartboard" }],
    },
    "Select > Deselect": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "deselectall" }],
    },
    "Select > Reselect ": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find Reselect menu item" }],
    },
    "Select > Inverse": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Inverse menu item" }],
    },
    "Select > Next Object Above ": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Selection Hat 8" }],
    },
    "Select > Next Object Below ": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Selection Hat 9" }],
    },
    "Select > Same > Appearance": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find Appearance menu item" }],
    },
    "Select > Same > Appearance Attribute": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find Appearance Attributes menu item" }],
    },
    "Select > Same > Blending Mode": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find Blending Mode menu item" }],
    },
    "Select > Same > Fill & Stroke": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find Fill & Stroke menu item" }],
    },
    "Select > Same > Fill Color": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find Fill Color menu item" }],
    },
    "Select > Same > Opacity": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find Opacity menu item" }],
    },
    "Select > Same > Stroke Color": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find Stroke Color menu item" }],
    },
    "Select > Same > Stroke Weight": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find Stroke Weight menu item" }],
    },
    "Select > Same > Graphic Style": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find Style menu item" }],
    },
    "Select > Same > Symbol Instance": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find Symbol Instance menu item" }],
    },
    "Select > Same > Link Block Series": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find Link Block Series menu item" }],
    },
    "Select > Object > All on Same Layers": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Selection Hat 3" }],
    },
    "Select > Object > Direction Handles": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Selection Hat 1" }],
    },
    "Select > Object > Not Aligned to Pixel Grid": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Selection Hat 12" }],
    },
    "Select > Object > Bristle Brush Strokes": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Bristle Brush Strokes menu item" }],
    },
    "Select > Object > Brush Strokes": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Brush Strokes menu item" }],
    },
    "Select > Object > Clipping Masks": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Clipping Masks menu item" }],
    },
    "Select > Object > Stray Points": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Stray Points menu item" }],
    },
    "Select > Object > Text Objects": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Text Objects menu item" }],
    },
    "Select > Object > Flash Dynamic Text": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Dynamic Text" }],
    },
    "Select > Object > Flash Input Text": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Input Text" }],
    },
    "Select > Save Selection": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Selection Hat 10" }],
    },
    "Select > Edit Selection": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Selection Hat 11" }],
    },
    "Effect > Apply Last Effect ": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Apply Last Effect" }],
    },
    "Effect > Last Effect ": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Last Effect" }],
    },
    "Effect > Document Raster Effects Settings": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Rasterize Effect Setting" }],
    },
    "Effect > 3D > Extrude & Bevel": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live 3DExtrude" }],
    },
    "Effect > 3D > Revolve": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live 3DRevolve" }],
    },
    "Effect > 3D > Rotate": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live 3DRotate" }],
    },
    "Effect > Convert to Shape > Rectangle": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Rectangle" }],
    },
    "Effect > Convert to Shape > Rounded Rectangle": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Rounded Rectangle" }],
    },
    "Effect > Convert to Shape > Ellipse": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Ellipse" }],
    },
    "Effect > Crop Marks": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Trim Marks" }],
    },
    "Effect > Distort & Transform > Free Distort": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Free Distort" }],
    },
    "Effect > Distort & Transform > Pucker & Bloat": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pucker & Bloat" }],
    },
    "Effect > Distort & Transform > Roughen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Roughen" }],
    },
    "Effect > Distort & Transform > Transform": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Transform" }],
    },
    "Effect > Distort & Transform > Tweak": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Scribble and Tweak" }],
    },
    "Effect > Distort & Transform > Twist": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Twist" }],
    },
    "Effect > Distort & Transform > Zig Zag": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Zig Zag" }],
    },
    "Effect > Path > Offset Path": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Offset Path" }],
    },
    "Effect > Path > Outline Object": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Outline Object" }],
    },
    "Effect > Path > Outline Stroke": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Outline Stroke" }],
    },
    "Effect > Pathfinder > Add": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Add" }],
    },
    "Effect > Pathfinder > Intersect": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Intersect" }],
    },
    "Effect > Pathfinder > Exclude": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Exclude" }],
    },
    "Effect > Pathfinder > Subtract": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Subtract" }],
    },
    "Effect > Pathfinder > Minus Back": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Minus Back" }],
    },
    "Effect > Pathfinder > Divide": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Divide" }],
    },
    "Effect > Pathfinder > Trim": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Trim" }],
    },
    "Effect > Pathfinder > Merge": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Merge" }],
    },
    "Effect > Pathfinder > Crop": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Crop" }],
    },
    "Effect > Pathfinder > Outline": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Outline" }],
    },
    "Effect > Pathfinder > Hard Mix": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Hard Mix" }],
    },
    "Effect > Pathfinder > Soft Mix": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Soft Mix" }],
    },
    "Effect > Pathfinder > Trap": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Trap" }],
    },
    "Effect > Rasterize": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Rasterize" }],
    },
    "Effect > Stylize > Drop Shadow": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Adobe Drop Shadow" }],
    },
    "Effect > Stylize > Feather": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Feather" }],
    },
    "Effetc > Stylize > Inner Glow": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Inner Glow" }],
    },
    "Effect > Stylize > outer Glow": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Outer Glow" }],
    },
    "Effect > Stylize > Round Corners": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Adobe Round Corners" }],
    },
    "Effect > Stylize > Scribble": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Scribble Fill" }],
    },
    "Effect > SVG Filters > Apply SVG Filter": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live SVG Filters" }],
    },
    "Effect > SVG Filters > Import SVG Filter": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "SVG Filter Import" }],
    },
    "Effect > Warp > Arc": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Arc" }],
    },
    "Effect > Warp > Arc Lower": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Arc Lower" }],
    },
    "Effect > Warp > Arc Upper": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Arc Upper" }],
    },
    "Effect > Warp > Arch": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Arch" }],
    },
    "Effect > Warp > Bulge": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Bulge" }],
    },
    "Effect > Warp > Shell Lower": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Shell Lower" }],
    },
    "Effect > Warp > Shell Upper": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Shell Upper" }],
    },
    "Effect > Warp > Flag": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Flag" }],
    },
    "Effect > Warp > Wave": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Wave" }],
    },
    "Effect > Warp > Fish": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Fish" }],
    },
    "Effect > Warp > Rise": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Rise" }],
    },
    "Effect > Warp > Fisheye": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Fisheye" }],
    },
    "Effect > Warp > Inflate": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Inflate" }],
    },
    "Effect > Warp > Squeeze": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Squeeze" }],
    },
    "Effect > Warp > Twist": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Twist" }],
    },
    "Effect > Effect Gallery": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_GEfc" }],
    },
    "Effect > Artistic > Colored Pencil": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_ClrP" }],
    },
    "Effect > Artistic > Cutout": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Ct  " }],
    },
    "Effect > Artistic > Dry Brush": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_DryB" }],
    },
    "Effect > Artistic > Film Grain": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_FlmG" }],
    },
    "Effect > Artistic > Fresco": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Frsc" }],
    },
    "Effect > Artistic > Neon Glow": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_NGlw" }],
    },
    "Effect > Artistic > Paint Daubs": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_PntD" }],
    },
    "Effect > Artistic > Palette Knife": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_PltK" }],
    },
    "Effect > Artistic > Plastic Wrap": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_PlsW" }],
    },
    "Effect > Artistic > Poster Edges": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_PstE" }],
    },
    "Effect > Artistic > Rough Pastels": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_RghP" }],
    },
    "Effect > Artistic > Smudge Stick": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_SmdS" }],
    },
    "Effect > Artistic > Sponge": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Spng" }],
    },
    "Effect > Artistic > Underpainting": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Undr" }],
    },
    "Effect > Artistic > Watercolor": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Wtrc" }],
    },
    "Effect > Blur > Gaussian Blur": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_GblR" }],
    },
    "Effect > Blur > Radial Blur": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_RdlB" }],
    },
    "Effect > Blur > Smart Blur": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_SmrB" }],
    },
    "Effect > Brush Strokes > Accented Edges": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_AccE" }],
    },
    "Effect > Brush Strokes > Angled Strokes": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_AngS" }],
    },
    "Effect > Brush Strokes > Crosshatch": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Crsh" }],
    },
    "Effect > Brush Strokes > Dark Strokes": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_DrkS" }],
    },
    "Effect > Brush Strokes > Ink Outlines": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_InkO" }],
    },
    "Effect > Brush Strokes > Spatter": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Spt " }],
    },
    "Effect > Brush Strokes > Sprayed Strokes": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_SprS" }],
    },
    "Effect > Brush Strokes > Sumi-e": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Smie" }],
    },
    "Effect > Distort > Diffuse Glow": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_DfsG" }],
    },
    "Effect > Distort > Glass": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Gls " }],
    },
    "Effect > Distort > Ocean Ripple": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_OcnR" }],
    },
    "Effect > Pixelate > Color Halftone": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_ClrH" }],
    },
    "Effect > Pixelate > Crystallize": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Crst" }],
    },
    "Effect > Pixelate > Mezzotint": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Mztn" }],
    },
    "Effect > Pixelate > Pointillize": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Pntl" }],
    },
    "Effect > Sharpen > Unsharp Mask": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_USMk" }],
    },
    "Effect > Sketch > Bas Relief": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_BsRl" }],
    },
    "Effect > Sketch > Chalk & Charcoal": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_ChlC" }],
    },
    "Effect > Sketch > Charcoal": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Chrc" }],
    },
    "Effect > Sketch > Chrome": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Chrm" }],
    },
    "Effect > Sketch > Cont￩ Crayon": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_CntC" }],
    },
    "Effect > Sketch > Graphic Pen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_GraP" }],
    },
    "Effect > Sketch > Halftone Pattern": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_HlfS" }],
    },
    "Effect > Sketch > Note Paper": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_NtPr" }],
    },
    "Effect > Sketch > Photocopy": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Phtc" }],
    },
    "Effect > Sketch > Plaster": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Plst" }],
    },
    "Effect > Sketch > Reticulation": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Rtcl" }],
    },
    "Effect > Sketch > Stamp": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Stmp" }],
    },
    "Effect > Sketch > Torn Edges": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_TrnE" }],
    },
    "Effect > Sketch > Water Paper": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_WtrP" }],
    },
    "Effect > Stylize > Glowing Edges": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_GlwE" }],
    },
    "Effect > Texture > Craquelure": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Crql" }],
    },
    "Effect > Texture > Grain": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Grn " }],
    },
    "Effect > Texture > Mosaic Tiles": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_MscT" }],
    },
    "Effect > Texture > Patchwork": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Ptch" }],
    },
    "Effect > Texture > Stained Glass": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_StnG" }],
    },
    "Effect > Texture > Texturizer": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Txtz" }],
    },
    "Effect > Video > De-Interlace": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Dntr" }],
    },
    "Effect > Video > NTSC Colors": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_NTSC" }],
    },
    "View > Preview": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "preview" }],
    },
    "View > Overprint Preview": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "ink" }],
    },
    "View > Pixel Preview": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "raster" }],
    },
    "View > Proof Setup > Document CMYK >  ": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "proof-document" }],
    },
    "View > Proof Setup > Legacy Macintosh RGB (Gamma 1.8)": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "proof-mac-rgb" }],
    },
    "View > Proof Setup > Internet Standard RGB (sRGB)": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "proof-win-rgb" }],
    },
    "View > Proof Setup > Monitor RGB": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "proof-monitor-rgb" }],
    },
    "View > Proof Setup > Color blindness - Protanopia-type": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "proof-colorblindp" }],
    },
    "View > Proof Setup > Color blindness - Deuteranopia-type": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "proof-colorblindd" }],
    },
    "View > Proof Setup > Customize": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "proof-custom" }],
    },
    "View > Proof Colors": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "proofColors" }],
    },
    "View > Zoom In": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "zoomin" }],
    },
    "View > Zoom Out": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "zoomout" }],
    },
    "View > Fit Artboard in Window": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "fitin" }],
    },
    "View > Fit All in Window": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "fitall" }],
    },
    "View > Actual Size": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "actualsize" }],
    },
    "View > Hide Edges": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "edge" }],
    },
    "View > Hide Artboards": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "artboard" }],
    },
    "View > Hide Print Tiling": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "pagetiling" }],
    },
    "View > Show Slices": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Feedback Menu" }],
    },
    "View > Lock Slices": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Lock Menu" }],
    },
    "View > Show Template": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "showtemplate" }],
    },
    "View > Rulers > Show Rulers": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "ruler" }],
    },
    "View > Rulers > Show Video Rulers": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "videoruler" }],
    },
    "View > Rulers > Change to Global Rulers": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "rulerCoordinateSystem" }],
    },
    "View > Hide Bounding Box ": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AI Bounding Box Toggle" }],
    },
    "View > Show Transparency Grid ": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "TransparencyGrid Menu Item" }],
    },
    "View > Show Text Threads": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "textthreads" }],
    },
    "View > Hide Gradient Annotator": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Gradient Feedback" }],
    },
    "View > Show Live Paint Gaps": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Show Gaps Planet X" }],
    },
    "View > Guides > Hide Guides": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "showguide" }],
    },
    "View > Guides > Lock Guides": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "lockguide" }],
    },
    "View > Guides > Make Guides": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "makeguide" }],
    },
    "View > Guides > Release Guides": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "releaseguide" }],
    },
    "View > Guides > Clear Guides": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "clearguide" }],
    },
    "View > Smart Guides ": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Snapomatic on-off menu item" }],
    },
    "View > Perspective Grid > Show Grid ": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Show Perspective Grid" }],
    },
    "View > Perspective Grid > Show Rulers": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Show Ruler" }],
    },
    "View > Perspective Grid > Snap to Grid": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Snap to Grid" }],
    },
    "View > Perspective Grid > Lock Grid": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Lock Perspective Grid" }],
    },
    "View > Perspective Grid > Lock Station Point": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Lock Station Point" }],
    },
    "View > Perspective Grid > Define Grid": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Define Perspective Grid" }],
    },
    "View > Perspective Grid > Save Grid as Preset": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Save Perspective Grid as Preset" }],
    },
    "View > Show Grid": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "showgrid" }],
    },
    "View > Snap to Grid": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "snapgrid" }],
    },
    "View > Snap to Point": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "snappoint" }],
    },
    "View > New View": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "newview" }],
    },
    "View > Edit Views": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "editview" }],
    },
    "Window > New Window": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "newwindow" }],
    },
    "Window > Arrange > Cascade": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "cascade" }],
    },
    "Window > Arrange > Tile": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "tile" }],
    },
    "Window > Arrange > Float in Window": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "floatInWindow" }],
    },
    "Window > Arrange > Float All in Windows": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "floatAllInWindows" }],
    },
    "Window > Arrange > Consolidate All Windows": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "consolidateAllWindows" }],
    },
    "Window > Workspace > Save Workspace": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Save Workspace" }],
    },
    "Window > Workspace > New Workspace": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe New Workspace" }],
    },
    "Window > Workspace > Manage Workspaces": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Manage Workspace" }],
    },
    "Window > Control": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "control palette plugin" }],
    },
    "Window > Tools": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AdobeBuiltInToolbox1" }],
    },
    "Window > Actions": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Action Palette" }],
    },
    "Window > Align": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AdobeAlignObjects2" }],
    },
    "Window > Appearance ": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Style Palette" }],
    },
    "Window > Artboards": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Artboard Palette" }],
    },
    "Window > Attributes ": {
      cmdType: "menu",
      cmdActions: [
        {
          type: "menu",
          value: "internal palettes posing as plug-in menus-attributes",
        },
      ],
    },
    "Window > Brushes ": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe BrushManager Menu Item" }],
    },
    "Window > Color ": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Color Palette" }],
    },
    "Window > Color Guide": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Harmony Palette" }],
    },
    "Window > Document Info": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "DocInfo1" }],
    },
    "Window > Flattener Preview": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Flattening Preview" }],
    },
    "Window > Gradient ": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Gradient Palette" }],
    },
    "Window > Graphic Styles ": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Style Palette" }],
    },
    "Window > Info": {
      cmdType: "menu",
      cmdActions: [
        {
          type: "menu",
          value: "internal palettes posing as plug-in menus-info",
        },
      ],
    },
    "Window > Layers ": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AdobeLayerPalette1" }],
    },
    "Window > Links": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe LinkPalette Menu Item" }],
    },
    "Window > Magic Wand": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AI Magic Wand" }],
    },
    "Window > Navigator": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AdobeNavigator" }],
    },
    "Window > Pathfinder ": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe PathfinderUI" }],
    },
    "Window > Separations Preview": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Separation Preview Panel" }],
    },
    "Window > Stroke ": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Stroke Palette" }],
    },
    "Window > SVG Interactivity": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe SVG Interactivity Palette" }],
    },
    "Window > Swatches": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Swatches Menu Item" }],
    },
    "Window > Symbols ": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Symbol Palette" }],
    },
    "Window > Transform ": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AdobeTransformObjects1" }],
    },
    "Window > Transparency ": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Transparency Palette Menu Item" }],
    },
    "Window > Type > Character": {
      cmdType: "menu",
      cmdActions: [
        {
          type: "menu",
          value: "internal palettes posing as plug-in menus-character",
        },
      ],
    },
    "Window > Type > Character Styles": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Character Styles" }],
    },
    "Window > Type > Flash Text": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Flash Text" }],
    },
    "Window > Type > Glyphs": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "alternate glyph palette plugin 2" }],
    },
    "Window > Type > OpenType": {
      cmdType: "menu",
      cmdActions: [
        {
          type: "menu",
          value: "internal palettes posing as plug-in menus-opentype",
        },
      ],
    },
    "Window > Type > Paragraph": {
      cmdType: "menu",
      cmdActions: [
        {
          type: "menu",
          value: "internal palettes posing as plug-in menus-paragraph",
        },
      ],
    },
    "Window > Type > Paragraph Styles": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Paragraph Styles Palette" }],
    },
    "Window > Type > Tabs": {
      cmdType: "menu",
      cmdActions: [
        {
          type: "menu",
          value: "internal palettes posing as plug-in menus-tab",
        },
      ],
    },
    "Window > Variables": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Variables Palette Menu Item" }],
    },
    "Window > Brush Libraries > No Libraries found": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AdobeBrushMgr No libraries menu item" }],
    },
    "Window > Brush Libraries > Other Library": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AdobeBrushMgr Other libraries menu item" }],
    },
    "Window > Graphic Style Libraries > No Libraries found": {
      cmdType: "menu",
      cmdActions: [
        {
          type: "menu",
          value: "Adobe Art Style Plugin No libraries menu item",
        },
      ],
    },
    "Window > Graphic Style Libraries > Other Library": {
      cmdType: "menu",
      cmdActions: [
        {
          type: "menu",
          value: "Adobe Art Style Plugin Other libraries menu item",
        },
      ],
    },
    "Window > Symbol Libraries > No Libraries found": {
      cmdType: "menu",
      cmdActions: [
        {
          type: "menu",
          value: "Adobe Symbol Palette Plugin No libraries menu item",
        },
      ],
    },
    "Window > Symbol Libraries > Other Library": {
      cmdType: "menu",
      cmdActions: [
        {
          type: "menu",
          value: "Adobe Symbol Palette Plugin Other libraries menu item",
        },
      ],
    },
    "Help > Illustrator Help": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "helpcontent" }],
    },
    "Help > Welcome Screen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Welcome screen menu item" }],
    },
    "Help > Debug > Memory Use Checkpoint": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Memory Use Checkpoint" }],
    },
    "Help > Debug > Save Memory Use": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Save Memory Use" }],
    },
    "Help > Debug > Count Objects": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Count Objects" }],
    },
    "Help > Debug > Object Counts": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Object Counts" }],
    },
    "Help > Debug > Track API Refs": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Track API Refs" }],
    },
    "Help > Debug > Enable New Rendering": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Enable New Rendering" }],
    },
    "Help > Debug > Enable Rendering Timer": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Enable Rendering Timer" }],
    },
    "Help > Debug > Purge Rendering Cache": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Purge Rendering Cache" }],
    },
    "Help > Debug > Redraw": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Redraw" }],
    },
    "Help > Debug > Dump Application Heap Used": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Dump Application Heap Used" }],
    },
    "Help > Debug > Disable Greeking for New Rendering": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Disable Greeking for New Rendering" }],
    },
    "Help > Debug > Enable Threaded Rendering": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Enable Threaded Rendering" }],
    },
    "Help > Debug > Enable AGM Threading": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Enable AGM Threading" }],
    },
    "Help > Debug > Enable Hyper Threading": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Enable Hyper Threading" }],
    },
    "Help > Debug > Enable AGM Internal Memory Pool": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Enable AGM Internal Memory Pool" }],
    },
    "Help > Debug > Enable QuickPort Quartz": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Enable QuickPort Quartz" }],
    },
    "Help > Debug > Heap Check Running": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Heap Check Running" }],
    },
    "Help > Debug > Crash": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Crash" }],
    },
    "Help > Debug > Enable PGF Recovery": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Enable PGF Recovery" }],
    },
    "Help > Debug > Enable ATE Read Recovery": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Enable ATE Read Recovery" }],
    },
    "Help > Debug > Enable ATE Write Recovery": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Enable ATE Write Recovery" }],
    },
    "Help > Debug > Trace Counted Object Refs": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Trace Counted Object Refs" }],
    },
    "Help > Debug > Check Heap": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Check Heap" }],
    },
    "Help > Debug > Track Blocks": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Track Blocks" }],
    },
    "Help > Debug > Defer Freeing": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Defer Freeing" }],
    },
    "Help > Debug > Debug Window": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Debug Window" }],
    },
    "Help > Debug > Flush Preference to File": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Flush Preference to File" }],
    },
    "Help > Debug > Reinterpret Grayscale Image Color Space": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Reinterpret Grayscale Image Color Space" }],
    },
    "Help > Debug > Split and Interleave Raster Channels": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Split and Interleave Raster Channels" }],
    },
    "Help > Debug > Populate Live Effect Graphic Styles": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Populate Live Effect Graphic Styles" }],
    },
    "Help > Debug > Use ContainsTransparency Flag": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Use ContainsTransparency Flag" }],
    },
    "Help > Debug > Add Known Style": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Add Known Style" }],
    },
    "Help > Debug > Mark Logs": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Mark Logs" }],
    },
    "Help > Debug > Clear Logs": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Clear Logs" }],
    },
    "Help > Debug > Run UnicodeString testbed": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Run UnicodeString testbed" }],
    },
    "Help > Debug > Enable Gradient Feedback": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Gradient Feedback Debug" }],
    },
    "Help > Debug > Unit Testing": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Unit testing" }],
    },
    "Help > Create Eve Dialog": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adam Eve dialog menu" }],
    },
    "Help > About Illustrator": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "about" }],
    },
    "Help > System Info": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "System Info" }],
    },
    "Other Panel > New Symbol ": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe New Symbol Shortcut" }],
    },
    "Other Panel > Show Color Panel (Secondary)": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Color Palette Secondary" }],
    },
    "Other Panel > Actions Batch": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Actions Batch" }],
    },
    "Other Panel > Add New Fill ": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe New Fill Shortcut" }],
    },
    "Other Panel > Add New Stroke ": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe New Stroke Shortcut" }],
    },
    "Other Panel > New Graphic Style": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe New Style Shortcut" }],
    },
    "Other Panel > New Layer ": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AdobeLayerPalette2" }],
    },
    "Other Panel > New Layer with Dialog ": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AdobeLayerPalette3" }],
    },
    "Other Panel > Update Link": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Update Link Shortcut" }],
    },
    "Other Panel > Navigator Options": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AdobeNavigator2" }],
    },
    "Other Panel > New Swatch": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe New Swatch Shortcut Menu" }],
    },
  };
}
