/*
Ai Command Palette
Copyright 2022 Josh Duncan
https://joshbduncan.com

This script is distributed under the MIT License.
See the LICENSE file for details.
*/

//@target illustrator

var _title = "Ai Command Palette";
var _version = "0.3.0";
var _copyright = "Copyright 2022 Josh Duncan";
var _website = "joshbduncan.com";
var _github = "https://github.com/joshbduncan";

// Get current Ai version to check for function compatibility
var aiVersion = parseFloat(app.version);
// Get the current system operating system type
var sysOS = /mac/i.test($.os) ? "mac" : "win";

// Enable Windows Screen Flicker Bug Fix on older Windows Ai versions
var windowsFlickerFix = sysOS === "win" && aiVersion < 26.4 ? true : false;

// Load Needed JavaScript Polyfills
polyfills();

/**************************************************
RUN THE SCRIPT
**************************************************/

// Ai Command Palette data object
var data = {
  commands: {
    script: {},
    workflow: {},
    action: loadAllActions(),
    defaults: {
      "Command Palette Settings...": {
        cmdType: "defaults",
        cmdActions: [{ type: "config", value: "paletteSettings" }],
      },
    },
    menu: menuCommands(),
    tool: toolCommands(),
    config: configCommands(),
  },
  settings: {
    hiddenCommands: [],
    version: _version,
  },
};

// Load user data
var dataFolder = setupFolderObject(Folder.userData + "/" + "JBD");
var dataFile = setupFileObject(dataFolder, "AiCommandPalette.json");
loadUserData(dataFile);

// Setup commands for Ai Command Palette
var commandsData = buildCommands();
var allCommands = Object.keys(commandsData);
var filteredCommands = filterHiddenCommands();

// Present the Ai Command Palette
var paletteWidth = 600;
var result = commandPalette(
  (arr = filteredCommands),
  (title = _title),
  (bounds = [0, 0, paletteWidth, 182]),
  (multiselect = false),
  (filter = ["action", "menu", "tool", "config"])
);
if (result) processCommandActions(result);

/**************************************************
COMMAND EXECUTION
**************************************************/

/**
 * Iterate over each action for chosen command.
 * @param {String} command Command to execute.
 */
function processCommandActions(command) {
  var type, actions, check;
  if (commandsData.hasOwnProperty(command)) {
    type = commandsData[command].cmdType;
    actions = commandsData[command].cmdActions;
    // is the command is a workflow check all action to make sure they are available
    if (type === "workflow") {
      check = checkWorkflowActions(actions);
      if (check.deletedActions.length > 0) {
        alert(
          "Workflow needs attention.\nThe following action steps from your workflow are are no longer available.\n\n" +
            check.deletedActions.join("\n")
        );
        return;
      }
      if (check.incompatibleActions.length > 0) {
        alert(
          "Workflow needs attention.\nThe following action steps from your workflow are incompatible with your version of Illustrator.\n\n" +
            check.incompatibleActions.join("\n")
        );
        return;
      }
    }
    for (var i = 0; i < actions.length; i++) {
      if (type === "workflow") {
        processCommandActions(actions[i]);
      } else {
        executeCommandAction(actions[i]);
      }
    }
  } else {
    alert("Command was deleted.\nEdit any workflows where it was used.\n\n" + command);
    if (command.indexOf("**DELETED**") < 0) deletedCommandNeedsAttention(command);
  }
}

/**
 * Execute command action based.
 * @param {Object} action Action to execute.
 */
function executeCommandAction(action) {
  var type, f;
  type = action.type;
  switch (type.toLowerCase()) {
    case "config":
      try {
        configAction(action.value);
      } catch (e) {
        alert("Error executing command:\n" + action.value + "\n\n" + e);
      }
      break;
    case "menu":
      try {
        app.executeMenuCommand(action.value);
      } catch (e) {
        alert("Error executing command:\n" + action.value + "\n\n" + e);
      }
      break;
    case "tool":
      try {
        app.selectTool(action.value);
      } catch (e) {
        alert("Error selecting tool:\n" + action.value + "\n\n" + e);
      }
      break;
    case "action":
      try {
        app.doScript(action.value.actionName, action.value.actionSet);
      } catch (e) {
        alert("Error executing action:\n" + action.value.actionName + "\n\n" + e);
      }
      break;
    case "script":
      f = new File(action.value.scriptPath);
      if (!f.exists) {
        alert("Script no longer exists at original path.\n" + action.value.scriptPath);
        delete data.commands[type]["Script:" + " " + action.value.scriptName];
        if (action.value.scriptName.indexOf("**DELETED**") < 0)
          deletedCommandNeedsAttention("Script:" + " " + action.value.scriptName);
      } else {
        try {
          $.evalFile(f);
        } catch (e) {
          alert("Error executing script:\n" + action.value.scriptName + "\n\n" + e);
        }
      }
      break;
    default:
      alert("Invalid command type:\n" + type);
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

/**
 * Execute configuration actions.
 * @param {Object} action Configuration action to execute.
 */
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
    case "buildWorkflow":
      configBuildWorkflow();
      break;
    case "editWorkflow":
      configEditWorkflow();
      break;
    case "workflowsNeedingAttention":
      configWorkflowsNeedingAttention();
      break;
    case "loadScript":
      configLoadScript();
      break;
    case "showBuiltInMenuCommands":
      showBuiltInMenuCommands();
      write = false;
      break;
    case "showBuiltInTools":
      showBuiltInTools();
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
      alert("Invalid configuration option:\n" + action);
  }
  if (write) writeUserData(dataFile);
}

/** Show Ai Command Palette About Dialog. */
function aboutDialog() {
  var win = new Window("dialog");
  win.text = "About";
  win.alignChildren = "fill";

  // script info
  var pAbout = win.add("panel", undefined, "About Ai Command Palette");
  pAbout.margins = 20;
  pAbout.alignChildren = "fill";
  var aboutText =
    "Boost your Adobe Illustrator efficiency with quick access to most menu commands and tools, all of your actions, and any scripts right from your keyboard. And, with custom workflows, you can combine multiple commands, actions, and scripts to get things done in your own way. Replace repetitive tasks with workflows and boost your productivity.";
  pAbout.add("statictext", [0, 0, 500, 100], aboutText, {
    multiline: true,
  });

  var links = pAbout.add("group");
  links.orientation = "column";
  links.alignChildren = ["center", "center"];
  links.add("statictext", undefined, "Version " + _version);
  links.add("statictext", undefined, _copyright);
  var githubText =
    "Click here to learn more:" +
    " " +
    "https://github.com/joshbduncan/AiCommandPalette";
  var github = links.add("statictext", undefined, githubText);
  // window buttons
  var winButtons = win.add("group");
  winButtons.orientation = "row";
  winButtons.alignChildren = ["center", "center"];
  var ok = winButtons.add("button", undefined, "OK");
  ok.preferredSize.width = 100;

  github.addEventListener("mousedown", function () {
    openURL("https://github.com/joshbduncan/AiCommandPalette");
  });

  win.show();
}

/** Show all Ai Command Palette configuration commands. */
function configPaletteSettings() {
  var result = commandPalette(
    (arr = Object.keys(data.commands.config)),
    (title = "Palette Settings and Configuration"),
    (bounds = [0, 0, paletteWidth, 182]),
    (multiselect = false),
    (filter = [])
  );
  if (result) processCommandActions(result);
}

/** Load external scripts into Ai Command Palette. */
function configLoadScript() {
  var files, f, fname;
  var ct = 0;
  var files = loadFileTypes("Load Script Files", true, ".jsx$|.js$");
  if (files.length > 0) {
    for (var i = 0; i < files.length; i++) {
      f = files[i];
      fname = decodeURI(f.name);
      if (data.commands.script.hasOwnProperty("Script:" + " " + fname)) {
        if (
          !Window.confirm(
            "Script already loaded.\nWould you like to replace the previous script with the new one?",
            "noAsDflt",
            "Script Load Conflict"
          )
        )
          continue;
      }
      if (insertScriptIntoUserData(f)) ct++;
    }
    alert("Total scripts loaded:\n" + ct);
  } else {
    alert("No script files selected.\nMust be JavaScript '.js' or '.jsx' files.");
  }
}

/**
 * Build or Edit workflows.
 * @param {String} workflow Workflow to edit.
 */
function configBuildWorkflow(workflow) {
  var command;
  var cmdActions = [];
  result = workflowBuilder(
    (arr = filterOutCommands(filteredCommands, ["config"])),
    (edit = workflow)
  );
  if (result) {
    // check to make sure there isn't a workflow already saved with the same name
    var newName;
    var workflows = Object.keys(data.commands.workflow);
    while (workflows.includes(result.name)) {
      if (
        Window.confirm(
          "A workflow with that name already exists.\nWould you like to overwrite the previous workflow with the new one?",
          "noAsDflt",
          "Save Workflow Conflict"
        )
      ) {
        break;
      } else {
        newName = Window.prompt(
          "Enter a new name for your workflow.",
          "",
          "New Workflow Name"
        );
        if (newName == undefined || newName == null || newName === "") {
          alert("Workflow not saved.");
          return false;
        } else {
          result.name = "Workflow:" + " " + newName;
        }
      }
    }

    try {
      for (var i = 0; i < result.items.length; i++) {
        command = result.items[i].text;
        for (var a = 0; a < commandsData[command].cmdActions.length; a++) {
          cmdActions.push(command);
        }
      }
      data.commands.workflow[result.name] = {
        cmdType: "workflow",
        cmdActions: cmdActions,
      };
    } catch (e) {
      alert("Error saving workflow:\n" + result.name);
    }
  }
}

/** Choose a workflow to edit. */
function configEditWorkflow() {
  var commands = Object.keys(data.commands.workflow);
  if (commands.length > 0) {
    var result = commandPalette(
      (arr = commands),
      (title = "Choose A Workflow To Edit"),
      (bounds = [0, 0, paletteWidth, 182]),
      (multiselect = false),
      (filter = [])
    );
    if (result) configBuildWorkflow(result);
  } else {
    alert("There are no workflows to edit.");
  }
}

/** Show workflows that need attention. */
function configWorkflowsNeedingAttention() {
  var actions, check;
  var commands = [];
  for (var p in data.commands.workflow) {
    actions = commandsData[p].cmdActions;
    check = checkWorkflowActions(actions);
    if (check.deletedActions.length + check.incompatibleActions.length > 0)
      commands.push(p);
  }

  if (commands.length > 0) {
    var result = commandPalette(
      (arr = commands),
      (title = "Choose A Workflow To Edit"),
      (bounds = [0, 0, paletteWidth, 182]),
      (multiselect = false),
      (filter = [])
    );
    if (result) configBuildWorkflow(result);
  } else {
    alert("There are no workflows that need attention.");
  }
}

/** Show all built-in Ai menu commands. */
function showBuiltInMenuCommands() {
  result = commandPalette(
    (arr = Object.keys(data.commands.menu)),
    (title = "All Built-In Menu Commands"),
    (bounds = [0, 0, paletteWidth, 182]),
    (multiselect = false),
    (filter = [])
  );
  if (result) processCommandActions(result);
}

/** Show all built-in Ai tools. */
function showBuiltInTools() {
  var commands = Object.keys(data.commands.tool);
  if (commands.length > 0) {
    result = commandPalette(
      (arr = commands),
      (title = "All Built-In Tools"),
      (bounds = [0, 0, paletteWidth, 182]),
      (multiselect = false),
      (filter = [])
    );
    if (result) processCommandActions(result);
  } else {
    alert("No tools are currently available.");
  }
}

/** Hide commands from Ai Command Palette. */
function configHideCommand() {
  var commands, result;
  var ct = 0;
  commands = filterOutCommands(Object.keys(commandsData), [
    "config",
    "workflow",
    "script",
  ]);
  if (commands.length > 0) {
    result = commandPalette(
      (arr = commands),
      (title = "Select Menu Commands To Hide"),
      (bounds = [0, 0, paletteWidth, 182]),
      (multiselect = true),
      (filter = [])
    );
    if (result) {
      if (
        Window.confirm(
          "Hide Commands?\n" + result.join("\n"),
          "noAsDflt",
          "Confirm Commands To Hide"
        )
      ) {
        for (var i = 0; i < result.length; i++) {
          data.settings.hiddenCommands.push(result[i].text);
          ct++;
        }
      }
    }
    if (ct > 0) {
      alert("Total commands hidden:" + " " + ct);
    }
  } else {
    alert("There are no commands to hide.");
  }
}

/** Unhide user hidden commands. */
function configUnhideCommand() {
  var result;
  var ct = 0;

  if (data.settings.hiddenCommands.length > 0) {
    result = commandPalette(
      (arr = data.settings.hiddenCommands),
      (title = "Select Hidden Menu Commands To Reveal"),
      (bounds = [0, 0, paletteWidth, 182]),
      (multiselect = true),
      (filter = [])
    );
    if (result) {
      if (
        Window.confirm(
          "Reveal Hidden Commands?\n" + result.join("\n"),
          "noAsDflt",
          "Confirm Commands To Reveal"
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
      alert("Total hidden commands revealed:\n" + ct);
    }
  } else {
    alert("There are no hidden commands to reveal.");
  }
}

/** Delete user added commands from Ai Command Palette. */
function configDeleteCommand() {
  var commands, result, cmdToDelete, type;
  var ct = 0;
  commands = filterOutCommands(Object.keys(commandsData), [
    "defaults",
    "config",
    "action",
    "menu",
    "tool",
  ]);
  if (commands.length > 0) {
    result = commandPalette(
      (arr = commands),
      (title = "Select Menu Commands To Delete"),
      (bounds = [0, 0, paletteWidth, 182]),
      (multiselect = true),
      (filter = [])
    );
    if (result) {
      if (
        Window.confirm(
          "Delete Commands?\nDeleted commands will longer work in any workflows you previously created where they were used as a step.\n\n" +
            result.join("\n"),
          "noAsDflt",
          "Confirm Commands To Delete"
        )
      ) {
        for (var i = 0; i < result.length; i++) {
          cmdToDelete = result[i].text;
          type = commandsData[cmdToDelete].cmdType;
          try {
            delete data.commands[type][cmdToDelete];
            ct++;
            deletedCommandNeedsAttention(cmdToDelete);
          } catch (e) {
            alert("Command couldn't be deleted.\n" + cmdToDelete);
          }
        }
      }
    }
    if (ct > 0) {
      alert("Total commands deleted:\n" + ct);
    }
  } else {
    alert("There are no commands to delete.");
  }
}

/**************************************************
USER DIALOGS (and accompanying functions)
**************************************************/

/**
 * Ai Command Palette dialog.
 * @param   {Array}   arr         Commands to list in the ListBox.
 * @param   {String}  title       Dialog title.
 * @param   {Array}   bounds      Dialog size.
 * @param   {Boolean} multiselect Can multiple ListBox items be selected.
 * @param   {Array}   filter      Types of commands to filter out.
 * @returns {Array}               Selected ListBox items.
 */
function commandPalette(arr, title, bounds, multiselect, filter) {
  var q, filteredArr, matches, temp;
  var visibleListItems = 9;
  var frameStart = 0;

  var win = new Window("dialog");
  win.text = title;
  win.alignChildren = "fill";
  var q = win.add("edittext");
  q.helpTip = "Search for commands, actions, and loaded scripts.";

  // work-around to stop windows from flickering/flashing explorer
  if (windowsFlickerFix) {
    simulateKeypress("TAB", 1);
  } else {
    q.active = true;
  }

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
  var cancel = winButtons.add("button", undefined, "Cancel", { name: "cancel" });
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

  if (!multiselect) {
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
  }

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

/**
 * Workflow builder palette dialog.
 * @param   {Array}   arr         Commands to list in the ListBox.
 * @param   {String}  edit        Workflow command to edit.
 * @returns {Object}              Workflow command object.
 */
function workflowBuilder(arr, edit) {
  var win = new Window("dialog");
  win.text = "Workflow Builder";
  win.alignChildren = "fill";

  // if editing a command, pull in variables to prefill dialog with
  var command = "";
  var actions = [];
  if (edit != undefined) {
    var regex = new RegExp("^" + "Workflow:" + "\\s");
    command = edit[0].text.replace(regex, "");
    actions = commandsData[edit].cmdActions;
  }

  // command search
  var pSearch = win.add("panel", undefined, "Search For Commands");
  pSearch.alignChildren = ["fill", "center"];
  pSearch.margins = 20;
  var q = pSearch.add("edittext");
  q.helpTip = "Search for commands, actions, and loaded scripts.";

  // work-around to stop windows from flickering/flashing explorer
  if (windowsFlickerFix) {
    simulateKeypress("TAB", 1);
  } else {
    q.active = true;
  }

  var commands = pSearch.add("listbox", [0, 0, paletteWidth + 40, 182], arr, {
    multiselect: false,
  });
  commands.helpTip = "Double-click a command to add it as a workflow step below.";
  commands.selection = 0;

  // workflow steps
  var pSteps = win.add("panel", undefined, "Workflow Steps");
  pSteps.alignChildren = ["fill", "center"];
  pSteps.margins = 20;
  var steps = pSteps.add("listbox", [0, 0, paletteWidth + 40, 182], actions, {
    multiselect: true,
  });
  steps.helpTip = "Workflows will run in order from top to bottom.";
  var stepButtons = pSteps.add("group");
  stepButtons.alignment = "center";
  var up = stepButtons.add("button", undefined, "Move Up");
  up.preferredSize.width = 100;
  var down = stepButtons.add("button", undefined, "Move Down");
  down.preferredSize.width = 100;
  var del = stepButtons.add("button", undefined, "Delete");
  del.preferredSize.width = 100;

  // command name
  var pName = win.add("panel", undefined, "Save Workflow As");
  pName.alignChildren = ["fill", "center"];
  pName.margins = 20;
  var name = pName.add("edittext", undefined, command);
  name.enabled = edit == undefined ? false : true;

  // window buttons
  var winButtons = win.add("group");
  winButtons.orientation = "row";
  winButtons.alignChildren = ["center", "center"];
  var ok = winButtons.add("button", undefined, "OK");
  ok.preferredSize.width = 100;
  ok.enabled = edit == undefined ? false : true;
  var cancel = winButtons.add("button", undefined, "Cancel", { name: "cancel" });
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
      temp.onDoubleClick = commands.onDoubleClick;
      pSearch.remove(commands);
      commands = temp;
      commands.selection = 0;
      cur = 0;
    }
  };

  name.onChanging = function () {
    ok.enabled = name.text.length > 0 ? true : false;
  };

  up.onClick = function () {
    var selected = sortIndexes(steps.selection);
    if (selected[i] == 0 || !contiguous(selected)) return;
    for (var i = 0; i < selected.length; i++)
      swap(steps.items[selected[i] - 1], steps.items[selected[i]]);
    steps.selection = null;
    for (var n = 0; n < selected.length; n++) steps.selection = selected[n] - 1;
  };

  down.onClick = function () {
    var selected = sortIndexes(steps.selection);
    if (
      selected[selected.length - 1] == steps.items.length - 1 ||
      !contiguous(selected)
    )
      return;
    for (var i = steps.selection.length - 1; i > -1; i--)
      swap(steps.items[selected[i]], steps.items[selected[i] + 1]);
    steps.selection = null;
    for (var n = 0; n < selected.length; n++) steps.selection = selected[n] + 1;
  };

  // the api returns the selected items in the order they were
  // selected/clicked by the user when you call `list.selection`
  // so their actual listbox indexes need to be sorted for the
  // up, down, and delete buttons to work when multiple items are selected
  function sortIndexes(sel) {
    var indexes = [];
    for (var i = 0; i < sel.length; i++) indexes.push(sel[i].index);
    return indexes.sort();
  }

  // check to make sure selection is contiguous
  function contiguous(sel) {
    return sel.length == sel[sel.length - 1] - sel[0] + 1;
  }

  /** swap listbox items in place */
  function swap(x, y) {
    var t = x.text;
    x.text = y.text;
    y.text = t;
  }

  del.onClick = function () {
    var selected = sortIndexes(steps.selection);
    for (var i = steps.selection.length - 1; i > -1; i--) {
      steps.remove(selected[i]);
    }
    steps.selection == null;
    name.enabled = steps.items.length > 0 ? true : false;
    ok.enabled = name.text.length > 0 ? true : false;
  };

  commands.onDoubleClick = function () {
    if (commands.selection) {
      steps.add("item", commands.selection);
      name.enabled = steps.items.length > 0 ? true : false;
      ok.enabled = name.text.length > 0 ? true : false;
    }
  };

  if (win.show() == 1) {
    var finalName = "Workflow:" + " " + name.text.trim();
    return { name: finalName, items: steps.items };
  }
  return false;
}

/**
 * Score array items based on regex string match.
 * @param   {String} q   String to search for.
 * @param   {Array}  arr String items to search for.
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
 * Sort object keys by their value.
 * @param   {Object} obj Simple object with `key`: `value` pairs.
 * @returns {Array}      Array of keys sorted by value.
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

/** Combine all command types into a single object. */
function buildCommands() {
  var commandsData = {};
  for (var type in data.commands) {
    for (var command in data.commands[type]) {
      // check to make sure command meets minimum/maximum Ai version
      if (
        data.commands[type][command].hasOwnProperty("minVersion") &&
        data.commands[type][command].minVersion > aiVersion
      ) {
        delete data.commands[type][command];
        continue;
      } else if (
        data.commands[type][command].hasOwnProperty("maxVersion") &&
        data.commands[type][command].maxVersion <= aiVersion
      ) {
        delete data.commands[type][command];
        continue;
      }
      commandsData[command] = data.commands[type][command];
    }
  }
  return commandsData;
}

/**
 * Check to make sure a workflow doesn't contain deleted actions
 * or actions that are not compatible with the current Ai version.
 * @param   {Array} actions Workflow action steps to check.
 * @returns {Object}        Any deleted or incompatible action.
 */
function checkWorkflowActions(actions) {
  var deletedActions = [];
  var incompatibleActions = [];
  for (var i = 0; i < actions.length; i++) {
    if (actions[i].indexOf("**DELETED**") > -1) {
      var regex = new RegExp("\\s" + "\\*\\*DELETED\\*\\*" + "$");
      deletedActions.push(actions[i].replace(regex, ""));
    } else if (!allCommands.includes(actions[i])) {
      incompatibleActions.push(actions[i]);
    }
  }
  return {
    deletedActions: deletedActions,
    incompatibleActions: incompatibleActions,
  };
}

/**
 * When deleting a command, update any workflows that use it.
 * @param {String} action Command that was deleted.
 */
function deletedCommandNeedsAttention(action) {
  var workflows = Object.keys(data.commands.workflow);
  var command, actions, curAction;
  for (var i = 0; i < workflows.length; i++) {
    command = workflows[i];
    actions = data.commands.workflow[command].cmdActions;
    for (var n = 0; n < actions.length; n++) {
      curAction = actions[n];
      if (curAction === action) {
        data.commands.workflow[command].cmdActions[n] = curAction + " " + "**DELETED**";
      }
    }
  }
  writeUserData(dataFile);
}

/**
 * Filter out commands that are of specific type.
 * @param   {Array} commands Array of commands.
 * @param   {Array} types    Types of commands to filter out.
 * @returns {Array}          Filtered array of commands.
 */
function filterOutCommands(commands, types) {
  var filtered = [];
  for (var i = 0; i < commands.length; i++) {
    if (!types.includes(commandsData[commands[i]].cmdType)) filtered.push(commands[i]);
  }
  return filtered;
}

/** Filter out commands hidden by user. */
function filterHiddenCommands() {
  var arr = [];
  for (var i = 0; i < allCommands.length; i++) {
    if (!data.settings.hiddenCommands.includes(allCommands[i]))
      arr.push(allCommands[i]);
  }
  return arr;
}

/** Load all currently installed action sets and actions. */
function loadAllActions() {
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
      actions["Action:" + " " + actionName + " [" + setName + "]"] = {
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

/**
 * Present File.openDialog() for user to select files to load.
 * @param   {String}  prompt        Prompt for dialog.
 * @param   {Boolean} multiselect   Can multiple files be selected.
 * @param   {String}  fileTypeRegex RegEx search string for file types (e.g. ".jsx$|.js$").
 * @returns {Array}                 Selected file(s).
 */
function loadFileTypes(prompt, multiselect, fileTypeRegex) {
  var results = [];
  var files = File.openDialog(prompt, "", multiselect);
  if (files) {
    for (var i = 0; i < files.length; i++) {
      f = files[i];
      fname = decodeURI(f.name);
      if (f.name.search(fileTypeRegex) >= 0) {
        results.push(f);
      }
    }
  }
  return results;
}

/**
 * Save newly loaded script into user preference file.
 * @param   {Object}  f JavaScript file to load as a File object.
 * @returns {Boolean}   Was the insertion successful.
 */
function insertScriptIntoUserData(f) {
  fname = decodeURI(f.name);
  try {
    data.commands.script["Script:" + " " + fname] = {
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
    return true;
  } catch (e) {
    alert("Error loading script:\n" + f.fsName);
    return false;
  }
}

/**
 *
 *
 */

/**
 * Simulate a key press for Windows users.
 *
 * This function is in response to a known ScriptUI bug on Windows.
 * You can read more about it in the GitHub issue linked below.
 * https://github.com/joshbduncan/AiCommandPalette/issues/8
 *
 * Basically, on some Windows Ai versions, when a ScriptUI dialog is
 * presented and the active attribute is set to true on a field, Windows
 * will flash the Windows Explorer app quickly and then bring Ai back
 * in focus with the dialog front and center. This is a terrible user
 * experience so Sergey and I attempted to fix it the best we could.
 *
 * This clever solution was created by Sergey Osokin (https://github.com/creold)
 *
 * @param {String} k Key to simulate.
 * @param {Number} n Number of times to simulate the keypress.
 */
function simulateKeypress(k, n) {
  if (!n) n = 1;
  try {
    var f = setupFileObject(dataFolder, "SimulateKeypress.vbs");
    if (!f.exists) {
      var data = 'Set WshShell = WScript.CreateObject("WScript.Shell")\n';
      while (n--) {
        data += 'WshShell.SendKeys "{' + k + '}"\n';
      }
      f.encoding = "UTF-8";
      f.open("w");
      f.write(data);
      f.close();
    }
    f.execute();
  } catch (e) {
    $.writeln(e);
  }
}

/**
 * Open a url in the system browser.
 * @param {String} url URL to open.
 */
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

/**
 * Load user saved preferences file.
 * @param {Object} f File object for user preference data.
 */
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
}

/**
 * Write user data to disk.
 * @param {Object} f File object for user preference data.
 */
function writeUserData(f) {
  var userData = {
    commands: {
      workflow: data.commands.workflow,
      script: data.commands.script,
    },
    settings: data.settings,
  };
  writeJSONData(userData, f);
}

/**
 * Setup folder object or create if doesn't exist.
 * @param   {String} path System folder path.
 * @returns {Object}      Folder object.
 */
function setupFolderObject(path) {
  var folder = new Folder(path);
  if (!folder.exists) folder.create();
  return folder;
}

/**
 * Setup file object.
 * @param   {Object} path Folder object where file should exist,
 * @param   {String} name File name.
 * @returns {Object}      File object.
 */
function setupFileObject(path, name) {
  return new File(path + "/" + name);
}

/**
 * Read Ai "json-like" data from file.
 * @param   {Object} f File object to read.
 * @returns {Object}   Evaluated JSON data.
 */
function readJSONData(f) {
  var json, obj;
  try {
    f.encoding = "UTF-8";
    f.open("r");
    json = f.read();
    f.close();
  } catch (e) {
    alert("Error loading file:\n" + f);
  }
  obj = eval(json);
  return obj;
}

/**
 * Write Ai "json-like" data to disk.
 * @param {Object} obj Data to be written.
 * @param {Object} f   File object to write to.
 */
function writeJSONData(obj, f) {
  var data = obj.toSource();
  try {
    f.encoding = "UTF-8";
    f.open("w");
    f.write(data);
    f.close();
  } catch (e) {
    alert("Error writing file:\n" + f);
  }
}

/** Setup JavaScript Polyfills */
function polyfills() {
  /**
   * Array.prototype.indexOf() polyfill
   * https://stackoverflow.com/questions/1744310/how-to-fix-array-indexof-in-javascript-for-internet-explorer-browsers
   */
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (obj, start) {
      for (var i = start || 0, j = this.length; i < j; i++) {
        if (this[i] === obj) {
          return i;
        }
      }
      return -1;
    };
  }

  /**
   * Array.prototype.includes() polyfill
   * @author Chris Ferdinandi
   * @license MIT
   */
  if (!Array.prototype.includes) {
    Array.prototype.includes = function (search, start) {
      "use strict";
      if (search instanceof RegExp) {
        throw TypeError("first argument must not be a RegExp");
      }
      if (start === undefined) {
        start = 0;
      }
      return this.indexOf(search, start) !== -1;
    };
  }

  /**
   * Object.keys() polyfill
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
   */
  if (!Object.keys) {
    Object.keys = (function () {
      "use strict";
      var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !{ toString: null }.propertyIsEnumerable("toString"),
        dontEnums = [
          "toString",
          "toLocaleString",
          "valueOf",
          "hasOwnProperty",
          "isPrototypeOf",
          "propertyIsEnumerable",
          "constructor",
        ],
        dontEnumsLength = dontEnums.length;

      return function (obj) {
        if (typeof obj !== "function" && (typeof obj !== "object" || obj === null)) {
          throw new TypeError("Object.keys called on non-object");
        }

        var result = [],
          prop,
          i;

        for (prop in obj) {
          if (hasOwnProperty.call(obj, prop)) {
            result.push(prop);
          }
        }

        if (hasDontEnumBug) {
          for (i = 0; i < dontEnumsLength; i++) {
            if (hasOwnProperty.call(obj, dontEnums[i])) {
              result.push(dontEnums[i]);
            }
          }
        }
        return result;
      };
    })();
  }

  /**
   * String.prototype.trim() polyfill
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#Polyfill
   */
  if (!String.prototype.trim) {
    String.prototype.trim = function () {
      return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
    };
  }
}

/** Config Menu */
function configCommands() {
  return {
    "About Ai Command Palette...": {
      cmdType: "config",
      cmdActions: [{ type: "config", value: "about" }],
    },
    "Build Workflow...": {
      cmdType: "config",
      cmdActions: [{ type: "config", value: "buildWorkflow" }],
    },
    "Edit Workflow...": {
      cmdType: "config",
      cmdActions: [{ type: "config", value: "editWorkflow" }],
    },
    "Workflows Needing Attention...": {
      cmdType: "config",
      cmdActions: [{ type: "config", value: "workflowsNeedingAttention" }],
    },
    "Load Scripts...": {
      cmdType: "config",
      cmdActions: [{ type: "config", value: "loadScript" }],
    },
    "Show All Built-In Menu Commands...": {
      cmdType: "config",
      cmdActions: [{ type: "config", value: "showBuiltInMenuCommands" }],
    },
    "Show All Built-In Tools...": {
      cmdType: "config",
      cmdActions: [{ type: "config", value: "showBuiltInTools" }],
    },
    "Hide Commands...": {
      cmdType: "config",
      cmdActions: [{ type: "config", value: "hideCommand" }],
    },
    "Reveal Commands...": {
      cmdType: "config",
      cmdActions: [{ type: "config", value: "unhideCommand" }],
    },
    "Delete Commands...": {
      cmdType: "config",
      cmdActions: [{ type: "config", value: "deleteCommand" }],
    },
    "Reveal Preferences File": {
      cmdType: "config",
      cmdActions: [{ type: "config", value: "revealPrefFile" }],
    },
  };
}

/** Default Ai Tools */
function toolCommands() {
  return {
    "Add Anchor Point Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Add Anchor Point Tool" }],
    },
    "Anchor Point Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Anchor Point Tool" }],
    },
    "Arc Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Arc Tool" }],
    },
    "Area Graph Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Area Graph Tool" }],
    },
    "Area Type Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Area Type Tool" }],
    },
    "Artboard Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Crop Tool" }],
    },
    "Bar Graph Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Bar Graph Tool" }],
    },
    "Blend Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Blend Tool" }],
    },
    "Bloat Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Bloat Tool" }],
    },
    "Blob Brush Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Blob Brush Tool" }],
    },
    "Column Graph Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Column Graph Tool" }],
    },
    "Crystallize Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Cyrstallize Tool" }],
    },
    "Curvature Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Curvature Tool" }],
    },
    "Delete Anchor Point Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Delete Anchor Point Tool" }],
    },
    "Direct Selection Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Direct Select Tool" }],
    },
    "Ellipse Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Ellipse Shape Tool" }],
    },
    "Eraser Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Eraser Tool" }],
    },
    "Eyedropper Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Eyedropper Tool" }],
    },
    "Flare Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Flare Tool" }],
    },
    "Free Transform Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Free Transform Tool" }],
    },
    "Gradient Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Gradient Vector Tool" }],
    },
    "Group Selection Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Direct Object Select Tool" }],
    },
    "Hand Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Scroll Tool" }],
    },
    "Join Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Corner Join Tool" }],
    },
    "Knife Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Knife Tool" }],
    },
    "Lasso Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Direct Lasso Tool" }],
    },
    "Line Graph Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Line Graph Tool" }],
    },
    "Line Segment Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Line Tool" }],
    },
    "Live Paint Bucket Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Planar Paintbucket Tool" }],
    },
    "Live Paint Selection Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Planar Face Select Tool" }],
    },
    "Magic Wand Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Magic Wand Tool" }],
    },
    "Measure Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Measure Tool" }],
    },
    "Mesh Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Mesh Editing Tool" }],
    },
    "Paintbrush Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Brush Tool" }],
    },
    "Path Eraser Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Freehand Erase Tool" }],
    },
    "Pattern Tile Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Pattern Tile Tool" }],
    },
    "Pen Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Pen Tool" }],
    },
    "Pencil Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Freehand Tool" }],
    },
    "Perspective Grid Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Perspective Grid Tool" }],
    },
    "Perspective Selection Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Perspective Selection Tool" }],
    },
    "Pie Graph Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Pie Graph Tool" }],
    },
    "Polar Grid Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Polar Grid Tool" }],
    },
    "Polygon Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [
        { type: "tool", value: "Adobe Shape Construction Regular Polygon Tool" },
      ],
    },
    "Print Tiling Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Page Tool" }],
    },
    "Pucker Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Pucker Tool" }],
    },
    "Puppet Warp Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Puppet Warp Tool" }],
    },
    "Radar Graph Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Radar Graph Tool" }],
    },
    "Rectangle Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Rectangle Shape Tool" }],
    },
    "Rectangular Grid Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Rectangular Grid Tool" }],
    },
    "Reflect Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Reflect Tool" }],
    },
    "Reshape Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Reshape Tool" }],
    },
    "Rotate Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Rotate Tool" }],
    },
    "Rotate View Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Rotate Canvas Tool" }],
    },
    "Rounded Rectangle Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Rounded Rectangle Tool" }],
    },
    "Scale Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Scale Tool" }],
    },
    "Scallop Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Scallop Tool" }],
    },
    "Scatter Graph Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Scatter Graph Tool" }],
    },
    "Scissors Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Scissors Tool" }],
    },
    "Selection Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Select Tool" }],
    },
    "Shape Builder Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Shape Builder Tool" }],
    },
    "Shaper Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Shaper Tool" }],
    },
    "Shear Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Shear Tool" }],
    },
    "Slice Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Slice Tool" }],
    },
    "Slice Selection Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Slice Select Tool" }],
    },
    "Smooth Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Freehand Smooth Tool" }],
    },
    "Spiral Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Shape Construction Spiral Tool" }],
    },
    "Stacked Bar Graph Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Stacked Bar Graph Tool" }],
    },
    "Stacked Column Graph Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Stacked Column Graph Tool" }],
    },
    "Star Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Shape Construction Star Tool" }],
    },
    "Symbol Screener Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Symbol Screener Tool" }],
    },
    "Symbol Scruncher Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Symbol Scruncher Tool" }],
    },
    "Symbol Shifter Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Symbol Shifter Tool" }],
    },
    "Symbol Sizer Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Symbol Sizer Tool" }],
    },
    "Symbol Spinner Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Symbol Spinner Tool" }],
    },
    "Symbol Sprayer Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Symbol Sprayer Tool" }],
    },
    "Symbol Stainer Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Symbol Stainer Tool" }],
    },
    "Symbol Styler Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Symbol Styler Tool" }],
    },
    "Touch Type Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Touch Type Tool" }],
    },
    "Twirl Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe New Twirl Tool" }],
    },
    "Type Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Type Tool" }],
    },
    "Type on a Path Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Path Type Tool" }],
    },
    "Vertical Area Type Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Vertical Area Type Tool" }],
    },
    "Vertical Type Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Vertical Type Tool" }],
    },
    "Vertical Type on a Path Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Vertical Path Type Tool" }],
    },
    "Warp Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Warp Tool" }],
    },
    "Width Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Width Tool" }],
    },
    "Wrinkle Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Wrinkle Tool" }],
    },
    "Zoom Tool": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Zoom Tool" }],
    },
  };
}

/** Default Ai Menu Commands */
function menuCommands() {
  return {
    "File > New...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "new" }],
    },
    "File > New from Template...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "newFromTemplate" }],
    },
    "File > Open...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "open" }],
    },
    "File > Browse in Bridge...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Bridge Browse" }],
    },
    "File > Close": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "close" }],
    },
    "File > Save": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "save" }],
    },
    "File > Save As...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "saveas" }],
    },
    "File > Save a Copy...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "saveacopy" }],
    },
    "File > Save as Template...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "saveastemplate" }],
    },
    "File > Save Selected Slices...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe AI Save Selected Slices" }],
    },
    "File > Revert": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "revert" }],
    },
    "File > Search Adobe Stock": {
      cmdType: "menu",
      minVersion: 19,
      cmdActions: [{ type: "menu", value: "Search Adobe Stock" }],
    },
    "File > Place...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AI Place" }],
    },
    "File > Export > Export For Screens...": {
      cmdType: "menu",
      minVersion: 20,
      cmdActions: [{ type: "menu", value: "exportForScreens" }],
    },
    "File > Export > Export As...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "export" }],
    },
    "File > Export > Save for Web (Legacy)...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe AI Save For Web" }],
    },
    "File > Export Selection...": {
      cmdType: "menu",
      minVersion: 20,
      cmdActions: [{ type: "menu", value: "exportSelection" }],
    },
    "File > Package": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Package Menu Item" }],
    },
    "File > Scripts > Other Script...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "ai_browse_for_script" }],
    },
    "File > Document Setup...": {
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
    "File > File Info...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "File Info" }],
    },
    "File > Print...": {
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
    "Edit > Paste without Formatting": {
      cmdType: "menu",
      minVersion: 25.3,
      cmdActions: [{ type: "menu", value: "pasteWithoutFormatting" }],
    },
    "Edit > Clear": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "clear" }],
    },
    "Edit > Find & Replace...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find and Replace" }],
    },
    "Edit > Find Next": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find Next" }],
    },
    "Edit > Spelling > Auto Spell Check": {
      cmdType: "menu",
      minVersion: 24,
      cmdActions: [{ type: "menu", value: "Auto Spell Check" }],
    },
    "Edit > Spelling > Check Spelling...": {
      cmdType: "menu",
      minVersion: 24,
      cmdActions: [{ type: "menu", value: "Check Spelling" }],
    },
    "Edit > Edit Custom Dictionary...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Edit Custom Dictionary..." }],
    },
    "Edit > Edit Colors > Recolor Artwork...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Recolor Art Dialog" }],
    },
    "Edit > Edit Colors > Adjust Color Balance...": {
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
    "Edit > Edit Colors > Overprint Black...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Overprint2" }],
    },
    "Edit > Edit Colors > Saturate...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Saturate3" }],
    },
    "Edit > Edit Original": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "EditOriginal Menu Item" }],
    },
    "Edit > Transparency Flattener Presets...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Transparency Presets" }],
    },
    "Edit > Print Presets...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Print Presets" }],
    },
    "Edit > Adobe PDF Presets...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "PDF Presets" }],
    },
    "Edit > Perspective Grid Presets...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "PerspectiveGridPresets" }],
    },
    "Edit > Color Settings...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "color" }],
    },
    "Edit > Assign Profile...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "assignprofile" }],
    },
    "Edit > Keyboard Shortcuts...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "KBSC Menu Item" }],
    },
    "Object > Transform > Transform Again": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "transformagain" }],
    },
    "Object > Transform > Move...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "transformmove" }],
    },
    "Object > Transform > Rotate...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "transformrotate" }],
    },
    "Object > Transform > Reflect...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "transformreflect" }],
    },
    "Object > Transform > Scale...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "transformscale" }],
    },
    "Object > Transform > Shear...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "transformshear" }],
    },
    "Object > Transform Each...": {
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
    "Object > Align > Horizontal Align Left": {
      cmdType: "menu",
      minVersion: 24,
      cmdActions: [{ type: "menu", value: "Horizontal Align Left" }],
    },
    "Object > Align > Horizontal Align Center": {
      cmdType: "menu",
      minVersion: 24,
      cmdActions: [{ type: "menu", value: "Horizontal Align Center" }],
    },
    "Object > Align > Horizontal Align Right": {
      cmdType: "menu",
      minVersion: 24,
      cmdActions: [{ type: "menu", value: "Horizontal Align Right" }],
    },
    "Object > Align > Vertical Align Top": {
      cmdType: "menu",
      minVersion: 24,
      cmdActions: [{ type: "menu", value: "Vertical Align Top" }],
    },
    "Object > Align > Vertical Align Center": {
      cmdType: "menu",
      minVersion: 24,
      cmdActions: [{ type: "menu", value: "Vertical Align Center" }],
    },
    "Object > Align > Vertical Align Bottom": {
      cmdType: "menu",
      minVersion: 24,
      cmdActions: [{ type: "menu", value: "Vertical Align Bottom" }],
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
    "Object > Crop Image": {
      cmdType: "menu",
      minVersion: 23,
      cmdActions: [{ type: "menu", value: "Crop Image" }],
    },
    "Object > Rasterize...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Rasterize 8 menu item" }],
    },
    "Object > Create Gradient Mesh...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "make mesh" }],
    },
    "Object > Create Object Mosaic...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AI Object Mosaic Plug-in4" }],
    },
    "Object > Create Trim Marks...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "TrimMark v25" }],
    },
    "Object > Flatten Transparency...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Flatten Transparency" }],
    },
    "Object > Make Pixel Perfect": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Make Pixel Perfect" }],
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
    "Object > Slice > Divide Slices...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Divide" }],
    },
    "Object > Slice > Delete All": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Delete All Slices" }],
    },
    "Object > Slice > Slice Options...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Slice Options" }],
    },
    "Object > Slice > Clip to Artboard": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Clip to Artboard" }],
    },
    "Object > Expand...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Expand3" }],
    },
    "Object > Expand Appearance": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "expandStyle" }],
    },
    "Object > Path > Join": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "join" }],
    },
    "Object > Path > Average...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "average" }],
    },
    "Object > Path > Outline Stroke": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "OffsetPath v22" }],
    },
    "Object > Path > Offset Path...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "OffsetPath v23" }],
    },
    "Object > Path > Reverse Path Direction": {
      cmdType: "menu",
      minVersion: 21,
      cmdActions: [{ type: "menu", value: "Reverse Path Direction" }],
    },
    "Object > Path > Simplify...": {
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
    "Object > Path > Split Into Grid...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Rows and Columns...." }],
    },
    "Object > Path > Clean Up...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "cleanup menu item" }],
    },
    "Object > Shape > Convert to Shapes": {
      cmdType: "menu",
      minVersion: 18,
      cmdActions: [{ type: "menu", value: "Convert to Shape" }],
    },
    "Object > Shape > Expand Shapes": {
      cmdType: "menu",
      minVersion: 18,
      cmdActions: [{ type: "menu", value: "Expand Shape" }],
    },
    "Object > Pattern > Make": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Make Pattern" }],
    },
    "Object > Pattern > Edit Pattern": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Edit Pattern" }],
    },
    "Object > Pattern > Tile Edge Color...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Pattern Tile Color" }],
    },
    "Object > Repeat > Make Radial": {
      cmdType: "menu",
      minVersion: 25.1,
      cmdActions: [{ type: "menu", value: "Make Radial Repeat" }],
    },
    "Object > Repeat > Make Grid": {
      cmdType: "menu",
      minVersion: 25.1,
      cmdActions: [{ type: "menu", value: "Make Grid Repeat" }],
    },
    "Object > Repeat > Make Symmetry": {
      cmdType: "menu",
      minVersion: 25.1,
      cmdActions: [{ type: "menu", value: "Make Symmetry Repeat" }],
    },
    "Object > Repeat > Release": {
      cmdType: "menu",
      minVersion: 25.1,
      cmdActions: [{ type: "menu", value: "Release Repeat Art" }],
    },
    "Object > Repeat > Repeat Art Options...": {
      cmdType: "menu",
      minVersion: 25.1,
      cmdActions: [{ type: "menu", value: "Repeat Art Options" }],
    },
    "Object > Blend > Make": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Path Blend Make" }],
    },
    "Object > Blend > Release": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Path Blend Release" }],
    },
    "Object > Blend > Blend Options...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Path Blend Options" }],
    },
    "Object > Blend > Expand": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Path Blend Expand" }],
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
    "Object > Envelope Distort > Make with Warp...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Make Warp" }],
    },
    "Object > Envelope Distort > Make with Mesh...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Create Envelope Grid" }],
    },
    "Object > Envelope Distort > Make with Top Object": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Make Envelope" }],
    },
    "Object > Envelope Distort > Release": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Release Envelope" }],
    },
    "Object > Envelope Distort > Envelope Options...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Envelope Options" }],
    },
    "Object > Envelope Distort > Expand": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Expand Envelope" }],
    },
    "Object > Envelope Distort > Edit Contents": {
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
    "Object > Live Paint > Make": {
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
    "Object > Live Paint > Gap Options...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Planet X Options" }],
    },
    "Object > Live Paint > Expand": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Expand Planet X" }],
    },
    "Object > Image Trace > Make": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Make Image Tracing" }],
    },
    "Object > Image Trace > Make and Expand": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Make and Expand Image Tracing" }],
    },
    "Object > Image Trace > Release": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Release Image Tracing" }],
    },
    "Object > Image Trace > Expand": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Expand Image Tracing" }],
    },
    "Object > Text Wrap > Make": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Make Text Wrap" }],
    },
    "Object > Text Wrap > Release": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Release Text Wrap" }],
    },
    "Object > Text Wrap > Text Wrap Options...": {
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
    "Object > Clipping Mask > Edit Mask": {
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
    "Object > Artboards > Rearrange All Artboards": {
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
    "Object > Graph > Type...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "setGraphStyle" }],
    },
    "Object > Graph > Data...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "editGraphData" }],
    },
    "Object > Graph > Design...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "graphDesigns" }],
    },
    "Object > Graph > Column...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "setBarDesign" }],
    },
    "Object > Graph > Marker...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "setIconDesign" }],
    },
    "Type > More from Adobe Fonts...": {
      cmdType: "menu",
      minVersion: 17.1,
      cmdActions: [{ type: "menu", value: "Browse Typekit Fonts Menu IllustratorUI" }],
    },
    "Type > Glyphs": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "alternate glyph palette plugin" }],
    },
    "Type > Area Type Options...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "area-type-options" }],
    },
    "Type > Type on a Path > Rainbow": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Rainbow" }],
    },
    "Type > Type on a Path > Skew": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Skew" }],
    },
    "Type > Type on a Path > 3D Ribbon": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "3D ribbon" }],
    },
    "Type > Type on a Path > Stair Step": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Stair Step" }],
    },
    "Type > Type on a Path > Gravity": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Gravity" }],
    },
    "Type > Type on a Path > Type on a Path Options...": {
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
    "Type > Fit Headline": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "fitHeadline" }],
    },
    "Type > Resolve Missing Fonts...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe IllustratorUI Resolve Missing Font" }],
    },
    "Type > Find/Replace Font...": {
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
    "Type > Smart Punctuation...": {
      cmdType: "menu",
      cmdActions: [
        { type: "menu", value: "Adobe Illustrator Smart Punctuation Menu Item" },
      ],
    },
    "Type > Create Outlines": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "outline" }],
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
    "Select > Reselect": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find Reselect menu item" }],
    },
    "Select > Inverse": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Inverse menu item" }],
    },
    "Select > Next Object Above": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Selection Hat 8" }],
    },
    "Select > Next Object Below": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Selection Hat 9" }],
    },
    "Select > Same > Appearance": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Find Appearance menu item" }],
    },
    "Select > Same > Appearance Attribute": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Find Appearance Attributes menu item" }],
    },
    "Select > Same > Blending Mode": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Find Blending Mode menu item" }],
    },
    "Select > Same > Fill & Stroke": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Find Fill & Stroke menu item" }],
    },
    "Select > Same > Fill Color": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Find Fill Color menu item" }],
    },
    "Select > Same > Opacity": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Find Opacity menu item" }],
    },
    "Select > Same > Stroke Color": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Find Stroke Color menu item" }],
    },
    "Select > Same > Stroke Weight": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Find Stroke Weight menu item" }],
    },
    "Select > Same > Graphic Style": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Find Style menu item" }],
    },
    "Select > Same > Shape": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Find Live Shape menu item" }],
    },
    "Select > Same > Symbol Instance": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Find Symbol Instance menu item" }],
    },
    "Select > Same > Link Block Series": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Find Link Block Series menu item" }],
    },
    "Select > Same > Font Family": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Find Text Font Family menu item" }],
    },
    "Select > Same > Font Family & Style": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Find Text Font Family Style menu item" }],
    },
    "Select > Same > Font Family, Style & Size": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [
        { type: "menu", value: "Find Text Font Family Style Size menu item" },
      ],
    },
    "Select > Same > Font Size": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Find Text Font Size menu item" }],
    },
    "Select > Same > Text Fill Color": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Find Text Fill Color menu item" }],
    },
    "Select > Same > Text Stroke Color": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Find Text Stroke Color menu item" }],
    },
    "Select > Same > Text Fill & Stroke Color": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Find Text Fill Stroke Color menu item" }],
    },
    "Select > Object > All on Same Layers": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Selection Hat 3" }],
    },
    "Select > Object > Direction Handles": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Selection Hat 1" }],
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
    "Select > Object > All Text Objects": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Text Objects menu item" }],
    },
    "Select > Object > Point Text Objects": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Point Text Objects menu item" }],
    },
    "Select > Object > Area Text Objects": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Area Text Objects menu item" }],
    },
    "Select > Start/Stop Global Edit": {
      cmdType: "menu",
      minVersion: 23,
      cmdActions: [{ type: "menu", value: "SmartEdit Menu Item" }],
    },
    "Select > Save Selection...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Selection Hat 10" }],
    },
    "Select > Edit Selection...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Selection Hat 11" }],
    },
    "Effect > Apply Last Effect": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Apply Last Effect" }],
    },
    "Effect > Last Effect": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Last Effect" }],
    },
    "Effect > Document Raster Effects Settings...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Rasterize Effect Setting" }],
    },
    "Effect > 3D and Materials > Extrude & Bevel...": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Live Adobe Geometry3D Extrude" }],
    },
    "Effect > 3D and Materials > Revolve...": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Live Adobe Geometry3D Revolve" }],
    },
    "Effect > 3D and Materials > Inflate...": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Live Adobe Geometry3D Inflate" }],
    },
    "Effect > 3D and Materials > Rotate...": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Live Adobe Geometry3D Rotate" }],
    },
    "Effect > 3D and Materials > Materials...": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Live Adobe Geometry3D Materials" }],
    },
    "Effect > 3D and Materials > 3D (Classic) > Extrude & Bevel (Classic)...": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Live 3DExtrude" }],
    },
    "Effect > 3D and Materials > 3D (Classic) > Revolve (Classic)...": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Live 3DRevolve" }],
    },
    "Effect > 3D and Materials > 3D (Classic) > Rotate (Classic)...": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Live 3DRotate" }],
    },
    "Effect > Convert to Shape > Rectangle...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Rectangle" }],
    },
    "Effect > Convert to Shape > Rounded Rectangle...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Rounded Rectangle" }],
    },
    "Effect > Convert to Shape > Ellipse...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Ellipse" }],
    },
    "Effect > Crop Marks": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Trim Marks" }],
    },
    "Effect > Distort & Transform > Free Distort...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Free Distort" }],
    },
    "Effect > Distort & Transform > Pucker & Bloat...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pucker & Bloat" }],
    },
    "Effect > Distort & Transform > Roughen...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Roughen" }],
    },
    "Effect > Distort & Transform > Transform...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Transform" }],
    },
    "Effect > Distort & Transform > Tweak...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Scribble and Tweak" }],
    },
    "Effect > Distort & Transform > Twist...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Twist" }],
    },
    "Effect > Distort & Transform > Zig Zag...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Zig Zag" }],
    },
    "Effect > Path > Offset Path...": {
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
    "Effect > Pathfinder > Soft Mix...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Soft Mix" }],
    },
    "Effect > Pathfinder > Trap...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Trap" }],
    },
    "Effect > Rasterize...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Rasterize" }],
    },
    "Effect > Stylize > Drop Shadow...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Adobe Drop Shadow" }],
    },
    "Effect > Stylize > Feather...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Feather" }],
    },
    "Effect > Stylize > Inner Glow...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Inner Glow" }],
    },
    "Effect > Stylize > outer Glow...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Outer Glow" }],
    },
    "Effect > Stylize > Round Corners...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Adobe Round Corners" }],
    },
    "Effect > Stylize > Scribble...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Scribble Fill" }],
    },
    "Effect > SVG Filters > Apply SVG Filter...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live SVG Filters" }],
    },
    "Effect > SVG Filters > Import SVG Filter...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "SVG Filter Import" }],
    },
    "Effect > Warp > Arc...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Arc" }],
    },
    "Effect > Warp > Arc Lower...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Arc Lower" }],
    },
    "Effect > Warp > Arc Upper...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Arc Upper" }],
    },
    "Effect > Warp > Arch...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Arch" }],
    },
    "Effect > Warp > Bulge...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Bulge" }],
    },
    "Effect > Warp > Shell Lower...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Shell Lower" }],
    },
    "Effect > Warp > Shell Upper...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Shell Upper" }],
    },
    "Effect > Warp > Flag...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Flag" }],
    },
    "Effect > Warp > Wave...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Wave" }],
    },
    "Effect > Warp > Fish...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Fish" }],
    },
    "Effect > Warp > Rise...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Rise" }],
    },
    "Effect > Warp > Fisheye...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Fisheye" }],
    },
    "Effect > Warp > Inflate...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Inflate" }],
    },
    "Effect > Warp > Squeeze...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Squeeze" }],
    },
    "Effect > Warp > Twist...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Twist" }],
    },
    "Effect > Effect Gallery...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_GEfc" }],
    },
    "Effect > Artistic > Colored Pencil...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_ClrP" }],
    },
    "Effect > Artistic > Cutout...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Ct  " }],
    },
    "Effect > Artistic > Dry Brush...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_DryB" }],
    },
    "Effect > Artistic > Film Grain...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_FlmG" }],
    },
    "Effect > Artistic > Fresco...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Frsc" }],
    },
    "Effect > Artistic > Neon Glow...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_NGlw" }],
    },
    "Effect > Artistic > Paint Daubs...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_PntD" }],
    },
    "Effect > Artistic > Palette Knife...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_PltK" }],
    },
    "Effect > Artistic > Plastic Wrap...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_PlsW" }],
    },
    "Effect > Artistic > Poster Edges...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_PstE" }],
    },
    "Effect > Artistic > Rough Pastels...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_RghP" }],
    },
    "Effect > Artistic > Smudge Stick...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_SmdS" }],
    },
    "Effect > Artistic > Sponge...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Spng" }],
    },
    "Effect > Artistic > Underpainting...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Undr" }],
    },
    "Effect > Artistic > Watercolor...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Wtrc" }],
    },
    "Effect > Blur > Gaussian Blur...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Adobe PSL Gaussian Blur" }],
    },
    "Effect > Blur > Radial Blur...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_RdlB" }],
    },
    "Effect > Blur > Smart Blur...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_SmrB" }],
    },
    "Effect > Brush Strokes > Accented Edges...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_AccE" }],
    },
    "Effect > Brush Strokes > Angled Strokes...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_AngS" }],
    },
    "Effect > Brush Strokes > Crosshatch...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Crsh" }],
    },
    "Effect > Brush Strokes > Dark Strokes...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_DrkS" }],
    },
    "Effect > Brush Strokes > Ink Outlines...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_InkO" }],
    },
    "Effect > Brush Strokes > Spatter...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Spt " }],
    },
    "Effect > Brush Strokes > Sprayed Strokes...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_SprS" }],
    },
    "Effect > Brush Strokes > Sumi-e...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Smie" }],
    },
    "Effect > Distort > Diffuse Glow...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_DfsG" }],
    },
    "Effect > Distort > Glass...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Gls " }],
    },
    "Effect > Distort > Ocean Ripple...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_OcnR" }],
    },
    "Effect > Pixelate > Color Halftone...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_ClrH" }],
    },
    "Effect > Pixelate > Crystallize...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Crst" }],
    },
    "Effect > Pixelate > Mezzotint...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Mztn" }],
    },
    "Effect > Pixelate > Pointillize...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Pntl" }],
    },
    "Effect > Sketch > Bas Relief...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_BsRl" }],
    },
    "Effect > Sketch > Chalk & Charcoal...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_ChlC" }],
    },
    "Effect > Sketch > Charcoal...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Chrc" }],
    },
    "Effect > Sketch > Chrome...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Chrm" }],
    },
    "Effect > Sketch > Conté Crayon...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_CntC" }],
    },
    "Effect > Sketch > Graphic Pen...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_GraP" }],
    },
    "Effect > Sketch > Halftone Pattern...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_HlfS" }],
    },
    "Effect > Sketch > Note Paper...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_NtPr" }],
    },
    "Effect > Sketch > Photocopy...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Phtc" }],
    },
    "Effect > Sketch > Plaster...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Plst" }],
    },
    "Effect > Sketch > Reticulation...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Rtcl" }],
    },
    "Effect > Sketch > Stamp...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Stmp" }],
    },
    "Effect > Sketch > Torn Edges...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_TrnE" }],
    },
    "Effect > Sketch > Water Paper...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_WtrP" }],
    },
    "Effect > Stylize > Glowing Edges...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_GlwE" }],
    },
    "Effect > Texture > Craquelure...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Crql" }],
    },
    "Effect > Texture > Grain...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Grn " }],
    },
    "Effect > Texture > Mosaic Tiles...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_MscT" }],
    },
    "Effect > Texture > Patchwork...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Ptch" }],
    },
    "Effect > Texture > Stained Glass...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_StnG" }],
    },
    "Effect > Texture > Texturizer...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Txtz" }],
    },
    "Effect > Video > De-Interlace...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Dntr" }],
    },
    "Effect > Video > NTSC Colors": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_NTSC" }],
    },
    "View > Outline / Preview": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "preview" }],
    },
    "View > GPU Preview / Preview on CPU": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "GPU Preview" }],
    },
    "View > Overprint Preview": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "ink" }],
    },
    "View > Pixel Preview": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "raster" }],
    },
    "View > Proof Setup > Working CMYK": {
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
    "View > Proof Setup > Customize...": {
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
    "View > Show / Hide Slices": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Feedback Menu" }],
    },
    "View > Lock Slices": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Lock Menu" }],
    },
    "View > Show / Hide Bounding Box": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AI Bounding Box Toggle" }],
    },
    "View > Show / Hide Transparency Grid": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "TransparencyGrid Menu Item" }],
    },
    "View > Actual Size": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "actualsize" }],
    },
    "View > Show / Hide Live Paint Gaps": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Show Gaps Planet X" }],
    },
    "View > Show / Hide Gradient Annotator": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Gradient Feedback" }],
    },
    "View > Show / Hide Corner Widget": {
      cmdType: "menu",
      minVersion: 17.1,
      cmdActions: [{ type: "menu", value: "Live Corner Annotator" }],
    },
    "View > Show / Hide Edges": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "edge" }],
    },
    "View > Smart Guides": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Snapomatic on-off menu item" }],
    },
    "View > Perspective Grid > Show / Hide Grid": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Show Perspective Grid" }],
    },
    "View > Perspective Grid > Show / Hide Rulers": {
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
    "View > Show / Hide Artboards": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "artboard" }],
    },
    "View > Show / Hide Print Tiling": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "pagetiling" }],
    },
    "View > Show / Hide Template": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "showtemplate" }],
    },
    "View > Rulers > Show / Hide Rulers": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "ruler" }],
    },
    "View > Rulers > Change to Global Rulers": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "rulerCoordinateSystem" }],
    },
    "View > Rulers > Show / Hide Video Rulers": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "videoruler" }],
    },
    "View > Show / Hide Text Threads": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "textthreads" }],
    },
    "View > Guides > Show / Hide Guides": {
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
    "View > Show / Hide Grid": {
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
    "View > New View...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "newview" }],
    },
    "View > Edit Views...": {
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
    "Window > Reset Workspace": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Reset Workspace" }],
    },
    "Window > Workspace > New Workspace...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe New Workspace" }],
    },
    "Window > Workspace > Manage Workspaces...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Manage Workspace" }],
    },
    "Window > Find Extensions on Exchange...": {
      cmdType: "menu",
      minVersion: 19,
      cmdActions: [{ type: "menu", value: "Browse Add-Ons Menu" }],
    },
    "Window > Control": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "drover control palette plugin" }],
    },
    "Window > Toolbars > Advanced": {
      cmdType: "menu",
      minVersion: 23,
      cmdActions: [{ type: "menu", value: "Adobe Advanced Toolbar Menu" }],
    },
    "Window > Toolbars > Basic": {
      cmdType: "menu",
      minVersion: 23,
      cmdActions: [{ type: "menu", value: "Adobe Basic Toolbar Menu" }],
    },
    "Window > Toolbars > New Toolbar...": {
      cmdType: "menu",
      minVersion: 17,
      cmdActions: [{ type: "menu", value: "New Tools Panel" }],
    },
    "Window > Toolbars > Manage Toolbar...": {
      cmdType: "menu",
      minVersion: 17,
      cmdActions: [{ type: "menu", value: "Manage Tools Panel" }],
    },
    "Window > 3D and Materials": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Adobe 3D Panel" }],
    },
    "Window > Actions": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Action Palette" }],
    },
    "Window > Align": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AdobeAlignObjects2" }],
    },
    "Window > Appearance": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Style Palette" }],
    },
    "Window > Artboards": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Artboard Palette" }],
    },
    "Window > Asset Export": {
      cmdType: "menu",
      minVersion: 20,
      cmdActions: [{ type: "menu", value: "Adobe SmartExport Panel Menu Item" }],
    },
    "Window > Attributes": {
      cmdType: "menu",
      cmdActions: [
        { type: "menu", value: "internal palettes posing as plug-in menus-attributes" },
      ],
    },
    "Window > Brushes": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe BrushManager Menu Item" }],
    },
    "Window > Color": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Color Palette" }],
    },
    "Window > Color Guide": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Harmony Palette" }],
    },
    "Window > Comments": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Adobe Commenting Palette" }],
    },
    "Window > CSS Properties": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "CSS Menu Item" }],
    },
    "Window > Document Info": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "DocInfo1" }],
    },
    "Window > Flattener Preview": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Flattening Preview" }],
    },
    "Window > Gradient": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Gradient Palette" }],
    },
    "Window > Graphic Styles": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Style Palette" }],
    },
    "Window > History": {
      cmdType: "menu",
      minVersion: 26.4,
      cmdActions: [{ type: "menu", value: "Adobe HistoryPanel Menu Item" }],
    },
    "Window > Info": {
      cmdType: "menu",
      cmdActions: [
        { type: "menu", value: "internal palettes posing as plug-in menus-info" },
      ],
    },
    "Window > Layers": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AdobeLayerPalette1" }],
    },
    "Window > Libraries": {
      cmdType: "menu",
      cmdActions: [
        {
          type: "menu",
          value: "Adobe CSXS Extension com.adobe.DesignLibraries.angularLibraries",
        },
      ],
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
    "Window > Pathfinder": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe PathfinderUI" }],
    },
    "Window > Pattern Options": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Pattern Panel Toggle" }],
    },
    "Window > Properties": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Adobe Property Palette" }],
    },
    "Window > Separations Preview": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Separation Preview Panel" }],
    },
    "Window > Stroke": {
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
    "Window > Symbols": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Symbol Palette" }],
    },
    "Window > Transform": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AdobeTransformObjects1" }],
    },
    "Window > Transparency": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Transparency Palette Menu Item" }],
    },
    "Window > Type > Character": {
      cmdType: "menu",
      cmdActions: [
        { type: "menu", value: "internal palettes posing as plug-in menus-character" },
      ],
    },
    "Window > Type > Character Styles": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Character Styles" }],
    },
    "Window > Type > Glyphs": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "alternate glyph palette plugin 2" }],
    },
    "Window > Type > OpenType": {
      cmdType: "menu",
      cmdActions: [
        { type: "menu", value: "internal palettes posing as plug-in menus-opentype" },
      ],
    },
    "Window > Type > Paragraph": {
      cmdType: "menu",
      cmdActions: [
        { type: "menu", value: "internal palettes posing as plug-in menus-paragraph" },
      ],
    },
    "Window > Type > Paragraph Styles": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Paragraph Styles Palette" }],
    },
    "Window > Type > Tabs": {
      cmdType: "menu",
      cmdActions: [
        { type: "menu", value: "internal palettes posing as plug-in menus-tab" },
      ],
    },
    "Window > Variables": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Variables Palette Menu Item" }],
    },
    "Window > Version History": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Adobe Version History File Menu Item" }],
    },
    "Window > Brush Libraries > Other Library": {
      cmdType: "menu",
      cmdActions: [
        { type: "menu", value: "AdobeBrushMgrUI Other libraries menu item" },
      ],
    },
    "Window > Graphic Style Libraries > Other Library...": {
      cmdType: "menu",
      cmdActions: [
        { type: "menu", value: "Adobe Art Style Plugin Other libraries menu item" },
      ],
    },
    "Window > Swatch Libraries > Other Library...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AdobeSwatch_ Other libraries menu item" }],
    },
    "Window > Symbol Libraries > Other Library...": {
      cmdType: "menu",
      cmdActions: [
        {
          type: "menu",
          value: "Adobe Symbol Palette Plugin Other libraries menu item",
        },
      ],
    },
    "Help > Illustrator Help...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "helpcontent" }],
    },
    "Help > Support Community": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "supportCommunity" }],
    },
    "Help > Submit Bug/Feature Request...": {
      cmdType: "menu",
      minVersion: 25,
      cmdActions: [{ type: "menu", value: "wishform" }],
    },
    "Help > System Info...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "System Info" }],
    },
    "Palette > Actions > Batch...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Actions Batch" }],
    },
    "Palette > Appearance > Add New Fill": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe New Fill Shortcut" }],
    },
    "Palette > Appearance > Add New Stroke": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe New Stroke Shortcut" }],
    },
    "Palette > Graphic Styles > New Graphic Style...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe New Style Shortcut" }],
    },
    "Palette > Layers > New Layer": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AdobeLayerPalette2" }],
    },
    "Palette > Layers > New Layer with Dialog...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AdobeLayerPalette3" }],
    },
    "Palette > Links > Update Link": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Update Link Shortcut" }],
    },
    "Palette > Swatches > New Swatch...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe New Swatch Shortcut Menu" }],
    },
    "Palette > Symbols > New Symbol...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe New Symbol Shortcut" }],
    },
    "About Illustrator...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "about" }],
    },
    "Preferences > General...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "preference" }],
    },
    "Preferences > Selection & Anchor Display...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "selectPref" }],
    },
    "Preferences > Type...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "keyboardPref" }],
    },
    "Preferences > Units...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "unitundoPref" }],
    },
    "Preferences > Guides & Grid...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "guidegridPref" }],
    },
    "Preferences > Smart Guides...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "snapPref" }],
    },
    "Preferences > Slices...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "slicePref" }],
    },
    "Preferences > Hyphenation...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "hyphenPref" }],
    },
    "Preferences > Plug-ins & Scratch Disks...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "pluginPref" }],
    },
    "Preferences > User Interface...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "UIPref" }],
    },
    "Preferences > Performance": {
      cmdType: "menu",
      minVersion: 19,
      cmdActions: [{ type: "menu", value: "GPUPerformancePref" }],
    },
    "Preferences > File Handling...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "FilePref" }],
    },
    "Preferences > Clipboard Handling": {
      cmdType: "menu",
      minVersion: 25,
      cmdActions: [{ type: "menu", value: "ClipboardPref" }],
    },
    "Preferences > Appearance of Black...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "BlackPref" }],
    },
    "Preferences > Devices": {
      cmdType: "menu",
      minVersion: 24,
      cmdActions: [{ type: "menu", value: "DevicesPref" }],
    },
  };
}
