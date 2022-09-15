/*
Ai Command Palette
Copyright 2022 Josh Duncan
https://joshbduncan.com

This script is distributed under the MIT License.
See the LICENSE file for details.
*/

//@target illustrator

var _title = "Kurzbefehle";
var _version = "0.2.5";
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
      "Kurzbefehle\ –\ Einstellungen\ …": {
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
var dataFile = setupFileObject(dataFolder, "Kurzbefehle\.json");
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
          "Achtung:\ Die\ folgenden\ Aktionen\ in\ Ihrem\ Arbeitsablauf\ sind\ nicht\ mehr\ verfügbar\.\n\n" +
            check.deletedActions.join("\n")
        );
        return;
      }
      if (check.incompatibleActions.length > 0) {
        alert(
          "Achtung:\ Die\ folgenden\ Aktionen\ in\ Ihrem\ Arbeitsablauf\ sind\ mit\ Ihrer\ Illustrator\-Version\ inkompatibel\.\n\n" +
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
    alert("Der\ Befehl\ wurde\ gelöscht\.\nBearbeiten\ Sie\ die\ Arbeitsabläufe,\ in\ denen\ er\ benutzt\ wurde\.\n\n" + command);
    if (command.indexOf("\*\*GELÖSCHT\*\*") < 0) deletedCommandNeedsAttention(command);
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
        alert("Fehler\ beim\ Ausführen\ des\ Befehls:\n" + action.value + "\n\n" + e);
      }
      break;
    case "menu":
      try {
        app.executeMenuCommand(action.value);
      } catch (e) {
        alert("Fehler\ beim\ Ausführen\ des\ Befehls:\n" + action.value + "\n\n" + e);
      }
      break;
    case "tool":
      try {
        app.selectTool(action.value);
      } catch (e) {
        alert("Fehler\ beim\ Auswählen\ des\ Werkzeugs:\n" + action.value + "\n\n" + e);
      }
      break;
    case "action":
      try {
        app.doScript(action.value.actionName, action.value.actionSet);
      } catch (e) {
        alert("Fehler\ beim\ Ausführen\ der\ Aktion:\n" + action.value.actionName + "\n\n" + e);
      }
      break;
    case "script":
      f = new File(action.value.scriptPath);
      if (!f.exists) {
        alert("Skript\ existiert\ nicht\ mehr\ am\ ursprünglichen\ Ort\.\n" + action.value.scriptPath);
        delete data.commands[type]["Skript:" + " " + action.value.scriptName];
        if (action.value.scriptName.indexOf("\*\*GELÖSCHT\*\*") < 0)
          deletedCommandNeedsAttention("Skript:" + " " + action.value.scriptName);
      } else {
        try {
          $.evalFile(f);
        } catch (e) {
          alert("Fehler\ beim\ Ausführen\ des\ Skripts:\n" + action.value.scriptName + "\n\n" + e);
        }
      }
      break;
    default:
      alert("Ungültiger\ Befehlstyp:\n" + type);
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
      alert("Ungültige\ Konfigurationsoption:\n" + action);
  }
  if (write) writeUserData(dataFile);
}

/** Show Ai Command Palette About Dialog. */
function aboutDialog() {
  var win = new Window("dialog");
  win.text = "Über\ Kurzbefehle\ …";
  win.alignChildren = "fill";

  // script info
  var pAbout = win.add("panel", undefined, "Kurzbefehle");
  pAbout.margins = 20;
  pAbout.alignChildren = "fill";
  var aboutText =
    "Steigern\ Sie\ Ihre\ Effizienz\ in\ Adobe\ Illustrator\ mit\ schnellem\ Zugriff\ auf\ die\ meisten\ Menübefehle\ und\ Werkzeuge\ sowie\ alle\ Aktionen\ und\ Skripte,\ die\ direkt\ über\ die\ Tastatur\ ausgeführt\ werden\ können\.\ Mit\ benutzerdefinierten\ Arbeitsabläufen\ können\ Sie\ mehrere\ Befehle,\ Aktionen\ und\ Skripte\ kombinieren\.\ Erledigen\ Sie\ wiederkehrende\ Aufgaben\ mit\ Arbeitsabläufen\ und\ steigern\ Sie\ Ihre\ Produktivität\.";
  pAbout.add("statictext", [0, 0, 500, 100], aboutText, {
    multiline: true,
  });

  var links = pAbout.add("group");
  links.orientation = "column";
  links.alignChildren = ["center", "center"];
  links.add("statictext", undefined, "Version " + _version);
  links.add("statictext", undefined, _copyright);
  var githubText =
    "Klicken\ Sie\ hier\ für\ weitere\ Informationen:" +
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
    (title = "Paletteneinstellungen\ und\ \-konfiguration"),
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
  var files = loadFileTypes("Skriptdateien\ laden", true, ".jsx$|.js$");
  if (files.length > 0) {
    for (var i = 0; i < files.length; i++) {
      f = files[i];
      fname = decodeURI(f.name);
      if (data.commands.script.hasOwnProperty("Skript:" + " " + fname)) {
        if (
          !Window.confirm(
            "Skript\ bereits\ geladen\.\nMöchten\ Sie\ es\ ersetzen\?",
            "noAsDflt",
            "Skriptladekonflikt"
          )
        )
          continue;
      }
      if (insertScriptIntoUserData(f)) ct++;
    }
    alert("Geladene\ Skripte\ insgesamt:\n" + ct);
  } else {
    alert("Keine\ Skriptdateien\ ausgewählt\.\nEs\ müssen\ JavaScript\-'\.js'\-\ oder\ '\.jsx'\-Dateien\ sein\.");
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
          "Ein\ Arbeitsablauf\ mit\ diesem\ Namen\ existiert\ bereits\.\nSoll\ der\ bestehende\ Arbeitsablauf\ überschrieben\ werden\?",
          "noAsDflt",
          "Arbeitsablauf\-Konflikt\ speichern\?"
        )
      ) {
        break;
      } else {
        newName = Window.prompt(
          "Geben\ Sie\ einen\ neuen\ Namen\ für\ den\ Arbeitsablauf\ an\.",
          "",
          "Name\ des\ neuen\ Arbeitsablaufs"
        );
        if (newName == undefined || newName == null || newName === "") {
          alert("Arbeitsablauf\ nicht\ gespeichert");
          return false;
        } else {
          result.name = "Arbeitsablauf:" + " " + newName;
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
      alert("Fehler\ beim\ Speichern\ des\ Arbeitsablaufs:\n" + result.name);
    }
  }
}

/** Choose a workflow to edit. */
function configEditWorkflow() {
  var commands = Object.keys(data.commands.workflow);
  if (commands.length > 0) {
    var result = commandPalette(
      (arr = commands),
      (title = "Wählen\ Sie\ einen\ Arbeitsablauf\ zum\ Bearbeiten\ aus\."),
      (bounds = [0, 0, paletteWidth, 182]),
      (multiselect = false),
      (filter = [])
    );
    if (result) configBuildWorkflow(result);
  } else {
    alert("Es\ gibt\ keine\ Arbeitsabläufe\ zum\ Bearbeiten\.");
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
      (title = "Wählen\ Sie\ einen\ Arbeitsablauf\ zum\ Bearbeiten\ aus\."),
      (bounds = [0, 0, paletteWidth, 182]),
      (multiselect = false),
      (filter = [])
    );
    if (result) configBuildWorkflow(result);
  } else {
    alert("Es\ gibt\ keine\ Arbeitsabläufe,\ die\ beachtet\ werden\ müssen\.");
  }
}

/** Show all built-in Ai menu commands. */
function showBuiltInMenuCommands() {
  result = commandPalette(
    (arr = Object.keys(data.commands.menu)),
    (title = "Alle\ integrierten\ Menübefehle"),
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
      (title = "Alle\ integrierten\ Werkzeuge"),
      (bounds = [0, 0, paletteWidth, 182]),
      (multiselect = false),
      (filter = [])
    );
    if (result) processCommandActions(result);
  } else {
    alert("Zurzeit\ sind\ keine\ Werkzeuge\ verfügbar\.");
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
      (title = "Wählen\ Sie\ die\ auszublendenden\ Menübefehle\ aus\."),
      (bounds = [0, 0, paletteWidth, 182]),
      (multiselect = true),
      (filter = [])
    );
    if (result) {
      if (
        Window.confirm(
          "Befehle\ ausblenden\?\n" + result.join("\n"),
          "noAsDflt",
          "Auszublendende\ Befehle\ bestätigen"
        )
      ) {
        for (var i = 0; i < result.length; i++) {
          data.settings.hiddenCommands.push(result[i].text);
          ct++;
        }
      }
    }
    if (ct > 0) {
      alert("Gesamtzahl\ der\ ausgeblendeten\ Befehle:" + " " + ct);
    }
  } else {
    alert("Es\ gibt\ keine\ Befehle\ zum\ Ausblenden\.");
  }
}

/** Unhide user hidden commands. */
function configUnhideCommand() {
  var result;
  var ct = 0;

  if (data.settings.hiddenCommands.length > 0) {
    result = commandPalette(
      (arr = data.settings.hiddenCommands),
      (title = "Wählen\ Sie\ die\ ausgeblendeten\ Menübefehle\ aus,\ die\ angezeigt\ werden\ sollen\."),
      (bounds = [0, 0, paletteWidth, 182]),
      (multiselect = true),
      (filter = [])
    );
    if (result) {
      if (
        Window.confirm(
          "Verborgene\ Befehle\ anzeigen\?" + result.join("\n"),
          "noAsDflt",
          "Die\ ausgewählten\ Befehle\ anzeigen\?"
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
      alert("Anzahl\ der\ verborgenen\ Befehle,\ die\ wieder\ angezeigt\ werden:\n" + ct);
    }
  } else {
    alert("Keine\ verborgenen\ Befehle\ vorhanden\.");
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
      (title = "Wählen\ Sie\ die\ zu\ löschenden\ Menübefehle\ aus\."),
      (bounds = [0, 0, paletteWidth, 182]),
      (multiselect = true),
      (filter = [])
    );
    if (result) {
      if (
        Window.confirm(
          "Befehle\ löschen\?\nGelöschte\ Befehle\ werden\ in\ bestehenden\ Arbeitsabläufen\ nicht\ mehr\ funktionieren\.\n\n" +
            result.join("\n"),
          "noAsDflt",
          "Bestätigen\ Sie\ die\ zu\ löschenden\ Befehle\."
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
      alert("Insgesamt\ gelöschte\ Befehle:" + ct);
    }
  } else {
    alert("Es\ gibt\ keine\ Befehle\ zum\ Löschen\.");
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
  q.helpTip = "Befehle,\ Aktionen\ und\ geladene\ Skripte\ suchen\.";

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
  var cancel = winButtons.add("button", undefined, "Abbrechen", { name: "cancel" });
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
  win.text = "Arbeitsabläufe\ erstellen";
  win.alignChildren = "fill";

  // if editing a command, pull in variables to prefill dialog with
  var command = "";
  var actions = [];
  if (edit != undefined) {
    var regex = new RegExp("^" + "Arbeitsablauf:" + "\\s");
    command = edit[0].text.replace(regex, "");
    actions = commandsData[edit].cmdActions;
  }

  // command search
  var pSearch = win.add("panel", undefined, "Befehle\ suchen\.");
  pSearch.alignChildren = ["fill", "center"];
  pSearch.margins = 20;
  var q = pSearch.add("edittext");
  q.helpTip = "Befehle,\ Aktionen\ und\ geladene\ Skripte\ suchen\.";

  // work-around to stop windows from flickering/flashing explorer
  if (windowsFlickerFix) {
    simulateKeypress("TAB", 1);
  } else {
    q.active = true;
  }

  var commands = pSearch.add("listbox", [0, 0, paletteWidth + 40, 182], arr, {
    multiselect: false,
  });
  commands.helpTip = "Doppelklicken\ Sie\ auf\ einen\ Befehl,\ um\ ihn\ unten\ als\ benutzerdefinierten\ Schritt\ hinzuzufügen\.";
  commands.selection = 0;

  // workflow steps
  var pSteps = win.add("panel", undefined, "Befehlskombinationen");
  pSteps.alignChildren = ["fill", "center"];
  pSteps.margins = 20;
  var steps = pSteps.add("listbox", [0, 0, paletteWidth + 40, 182], actions, {
    multiselect: true,
  });
  steps.helpTip = "Die\ Befehlskombinationen\ werden\ in\ der\ Reihenfolge\ von\ oben\ nach\ unten\ ausgeführt\.";
  var stepButtons = pSteps.add("group");
  stepButtons.alignment = "center";
  var up = stepButtons.add("button", undefined, "Nach\ oben");
  up.preferredSize.width = 100;
  var down = stepButtons.add("button", undefined, "Nach\ unten");
  down.preferredSize.width = 100;
  var del = stepButtons.add("button", undefined, "Löschen");
  del.preferredSize.width = 100;

  // command name
  var pName = win.add("panel", undefined, "Arbeitsablauf\ speichern\ als");
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
  var cancel = winButtons.add("button", undefined, "Abbrechen", { name: "cancel" });
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
    var finalName = "Arbeitsablauf:" + " " + name.text.trim();
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
    if (actions[i].indexOf("\*\*GELÖSCHT\*\*") > -1) {
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
        data.commands.workflow[command].cmdActions[n] = curAction + " " + "\*\*GELÖSCHT\*\*";
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
      actions["Aktion:" + " " + actionName + " [" + setName + "]"] = {
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
    data.commands.script["Skript:" + " " + fname] = {
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
    alert("Fehler\ beim\ Laden\ des\ Skripts:\n" + f.fsName);
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
    alert("Fehler\ beim\ Laden\ der\ Datei:\n" + f);
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
    alert("Fehler\ beim\ Schreiben\ der\ Datei\n:" + f);
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
    "Über\ Kurzbefehle\ …": {
      cmdType: "config",
      cmdActions: [{ type: "config", value: "about" }],
    },
    "Arbeitsablauf\ erstellen\ …": {
      cmdType: "config",
      cmdActions: [{ type: "config", value: "buildWorkflow" }],
    },
    "Arbeitsablauf\ bearbeiten\ …": {
      cmdType: "config",
      cmdActions: [{ type: "config", value: "editWorkflow" }],
    },
    "Achtung\ …": {
      cmdType: "config",
      cmdActions: [{ type: "config", value: "workflowsNeedingAttention" }],
    },
    "Skripte\ laden\ …": {
      cmdType: "config",
      cmdActions: [{ type: "config", value: "loadScript" }],
    },
    "Alle\ integrierten\ Menübefehle\ anzeigen\ …": {
      cmdType: "config",
      cmdActions: [{ type: "config", value: "showBuiltInMenuCommands" }],
    },
    "Alle\ integrierten\ Werkzeuge\ anzeigen\ …": {
      cmdType: "config",
      cmdActions: [{ type: "config", value: "showBuiltInTools" }],
    },
    "Befehle\ ausblenden\ …": {
      cmdType: "config",
      cmdActions: [{ type: "config", value: "hideCommand" }],
    },
    "Befehle\ einblenden\ …": {
      cmdType: "config",
      cmdActions: [{ type: "config", value: "unhideCommand" }],
    },
    "Befehle\ löschen\ …": {
      cmdType: "config",
      cmdActions: [{ type: "config", value: "deleteCommand" }],
    },
    "Einstellungen\-Datei\ anzeigen": {
      cmdType: "config",
      cmdActions: [{ type: "config", value: "revealPrefFile" }],
    },
  };
}

/** Default Ai Tools */
function toolCommands() {
  return {
    "Ankerpunkt\-hinzufügen\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Add Anchor Point Tool" }],
    },
    "Ankerpunkt\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Anchor Point Tool" }],
    },
    "Bogen\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Arc Tool" }],
    },
    "Flächendiagramm": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Area Graph Tool" }],
    },
    "Flächentext\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Area Type Tool" }],
    },
    "Zeichenflächen\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Crop Tool" }],
    },
    "Horizontales\ Balkendiagramm": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Bar Graph Tool" }],
    },
    "Angleichen\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Blend Tool" }],
    },
    "Aufblasen\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Bloat Tool" }],
    },
    "Tropfenpinsel\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Blob Brush Tool" }],
    },
    "Vertikales\ Balkendiagramm": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Column Graph Tool" }],
    },
    "Kristallisieren\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Cyrstallize Tool" }],
    },
    "Kurvenzeichner": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Curvature Tool" }],
    },
    "Ankerpunkt\-löschen\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Delete Anchor Point Tool" }],
    },
    "Direktauswahl\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Direct Select Tool" }],
    },
    "Ellipse\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Ellipse Shape Tool" }],
    },
    "Radiergummi\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Eraser Tool" }],
    },
    "Pipette\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Eyedropper Tool" }],
    },
    "Blendenflecke\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Flare Tool" }],
    },
    "Frei\-transformieren\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Free Transform Tool" }],
    },
    "Verlauf\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Gradient Vector Tool" }],
    },
    "Gruppenauswahl\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Direct Object Select Tool" }],
    },
    "Hand\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Scroll Tool" }],
    },
    "Zusammenfügen\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Corner Join Tool" }],
    },
    "Messer\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Knife Tool" }],
    },
    "Lasso\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Direct Lasso Tool" }],
    },
    "Liniendiagramm": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Line Graph Tool" }],
    },
    "Liniensegment\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Line Tool" }],
    },
    "Interaktiv\-malen\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Planar Paintbucket Tool" }],
    },
    "Interaktiv\-malen\-Auswahlwerkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Planar Face Select Tool" }],
    },
    "Zauberstab\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Magic Wand Tool" }],
    },
    "Mess\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Measure Tool" }],
    },
    "Gitter\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Mesh Editing Tool" }],
    },
    "Pinsel\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Brush Tool" }],
    },
    "Löschen\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Freehand Erase Tool" }],
    },
    "Musterelement\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Pattern Tile Tool" }],
    },
    "Zeichenstift\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Pen Tool" }],
    },
    "Buntstift\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Freehand Tool" }],
    },
    "Perspektivenraster\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Perspektivenraster\-Werkzeug" }],
    },
    "Perspektivenauswahl\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Perspektivenauswahl\-Werkzeug" }],
    },
    "Kreisdiagramm\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Pie Graph Tool" }],
    },
    "Radiales\-Raster\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Polar Grid Tool" }],
    },
    "Polygon\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [
        { type: "tool", value: "Adobe Shape Construction Regular Polygon Tool" },
      ],
    },
    "Druckaufteilungs\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Page Tool" }],
    },
    "Zusammenziehen\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Pucker Tool" }],
    },
    "Formgitter\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Puppet Warp Tool" }],
    },
    "Netzdiagramm": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Radar Graph Tool" }],
    },
    "Rechteck\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Rectangle Shape Tool" }],
    },
    "Rechteckiges\-Raster\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Rectangular Grid Tool" }],
    },
    "Spiegeln\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Reflect Tool" }],
    },
    "Form\-ändern\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Reshape Tool" }],
    },
    "Drehen\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Rotate Tool" }],
    },
    "Ansichtdrehung\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Rotate Canvas Tool" }],
    },
    "Abgerundetes\-Rechteck\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Rounded Rectangle Tool" }],
    },
    "Skalieren\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Scale Tool" }],
    },
    "Ausbuchten\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Scallop Tool" }],
    },
    "Streudiagramm": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Scatter Graph Tool" }],
    },
    "Schere\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Scissors Tool" }],
    },
    "Auswahl\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Select Tool" }],
    },
    "Formerstellungs\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Shape Builder Tool" }],
    },
    "Shaper\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Shaper Tool" }],
    },
    "Verbiegen\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Shear Tool" }],
    },
    "Slice\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Slice Tool" }],
    },
    "Slice\-Auswahl\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Slice Select Tool" }],
    },
    "Glätten\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Freehand Smooth Tool" }],
    },
    "Spirale\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Shape Construction Spiral Tool" }],
    },
    "Gestapeltes\ horizontales\ Balkendiagramm": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Stacked Bar Graph Tool" }],
    },
    "Gestapeltes\ vertikales\ Balkendiagramm": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Stacked Column Graph Tool" }],
    },
    "Stern\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Shape Construction Star Tool" }],
    },
    "Symbol\-transparent\-gestalten\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Symbol Screener Tool" }],
    },
    "Symbol\-stauchen\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Symbol Scruncher Tool" }],
    },
    "Symbol\-verschieben\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Symbol Shifter Tool" }],
    },
    "Symbol\-skalieren\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Symbol Sizer Tool" }],
    },
    "Symbol\-drehen\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Symbol Spinner Tool" }],
    },
    "Symbol\-aufsprühen\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Symbol Sprayer Tool" }],
    },
    "Symbol\-färben\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Symbol Stainer Tool" }],
    },
    "Symbol\-gestalten\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Symbol Styler Tool" }],
    },
    "Touch\-Type\-Textwerkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Touch Type Tool" }],
    },
    "Strudel\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe New Twirl Tool" }],
    },
    "Text\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Type Tool" }],
    },
    "Pfadtext\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Path Type Tool" }],
    },
    "Vertikaler\-Flächentext\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Vertical Area Type Tool" }],
    },
    "Vertikaler\-Text\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Vertical Type Tool" }],
    },
    "Vertikaler\-Pfadtext\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Vertical Path Type Tool" }],
    },
    "Verkrümmen\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Warp Tool" }],
    },
    "Breiten\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Width Tool" }],
    },
    "Zerknittern\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Wrinkle Tool" }],
    },
    "Zoom\-Werkzeug": {
      cmdType: "tool",
      minVersion: 24,
      cmdActions: [{ type: "tool", value: "Adobe Zoom Tool" }],
    },
  };
}

/** Default Ai Menu Commands */
function menuCommands() {
  return {
    "Datei\ >\ Neu\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "new" }],
    },
    "Datei\ >\ Neu\ aus\ Vorlage\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "newFromTemplate" }],
    },
    "Datei\ >\ Öffnen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "open" }],
    },
    "Datei\ >\ Bridge\ durchsuchen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Bridge Browse" }],
    },
    "Datei\ >\ Schließen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "close" }],
    },
    "Datei\ >\ Speichern": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "save" }],
    },
    "Datei\ >\ Speichern\ unter\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "saveas" }],
    },
    "Datei\ >\ Kopie\ speichern\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "saveacopy" }],
    },
    "Datei\ >\ Als\ Vorlage\ speichern\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "saveastemplate" }],
    },
    "Datei\ >\ Ausgewählte\ Slices\ speichern\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe AI Save Selected Slices" }],
    },
    "Datei\ >\ Zurück\ zur\ letzten\ Version": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "revert" }],
    },
    "Datei\ >\ Adobe\ Stock\ durchsuchen\ …": {
      cmdType: "menu",
      minVersion: 19,
      cmdActions: [{ type: "menu", value: "Search Adobe Stock" }],
    },
    "Datei\ >\ Platzieren\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AI Place" }],
    },
    "Datei\ >\ Exportieren\ >\ Für\ Bildschirme\ exportieren\ …": {
      cmdType: "menu",
      minVersion: 20,
      cmdActions: [{ type: "menu", value: "exportForScreens" }],
    },
    "Datei\ >\ Exportieren\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "export" }],
    },
    "Datei\ >\ Für\ Web\ speichern\ \(Legacy\)\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe AI Save For Web" }],
    },
    "Datei\ >\ Auswahl\ exportieren\ …": {
      cmdType: "menu",
      minVersion: 20,
      cmdActions: [{ type: "menu", value: "exportSelection" }],
    },
    "Datei\ >\ Verpacken\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Package Menu Item" }],
    },
    "Datei\ >\ Skripten\ >\ Anderes\ Skript\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "ai_browse_for_script" }],
    },
    "Datei\ >\ Dokument\ einrichten\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "document" }],
    },
    "Datei\ >\ Dokumentfarbmodus\ >\ CMYK\-Farbe": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "doc-color-cmyk" }],
    },
    "Datei\ >\ Dokumentfarbmodus\ >\ RGB\-Farbe": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "doc-color-rgb" }],
    },
    "Datei\ >\ Dateiinformationen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "File Info" }],
    },
    "Datei\ >\ Drucken\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Print" }],
    },
    "Datei\ >\ Illustrator\ beenden": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "quit" }],
    },
    "Bearbeiten\ >\ Rückgängig": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "undo" }],
    },
    "Bearbeiten\ >\ Wiederholen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "redo" }],
    },
    "Bearbeiten\ >\ Ausschneiden": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "cut" }],
    },
    "Bearbeiten\ >\ Kopieren": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "copy" }],
    },
    "Bearbeiten\ >\ Einfügen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "paste" }],
    },
    "Bearbeiten\ >\ Davor\ einfügen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "pasteFront" }],
    },
    "Bearbeiten\ >\ Dahinter\ einfügen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "pasteBack" }],
    },
    "Bearbeiten\ >\ An\ Originalposition\ einfügen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "pasteInPlace" }],
    },
    "Bearbeiten\ >\ In\ alle\ Zeichenflächen\ einfügen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "pasteInAllArtboard" }],
    },
    "Edit > Paste without Formatting": {
      cmdType: "menu",
      minVersion: 25.3,
      cmdActions: [{ type: "menu", value: "pasteWithoutFormatting" }],
    },
    "Bearbeiten\ >\ Löschen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "clear" }],
    },
    "Bearbeiten\ >\ Suchen\ und\ ersetzen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find and Replace" }],
    },
    "Bearbeiten\ >\ Weitersuchen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find Next" }],
    },
    "Bearbeiten\ >\ Rechtschreibung\ >\ Automatische\ Rechtschreibprüfung": {
      cmdType: "menu",
      minVersion: 24,
      cmdActions: [{ type: "menu", value: "Auto Spell Check" }],
    },
    "Bearbeiten\ >\ Rechtschreibung\ >\ Rechtschreibprüfung\ …": {
      cmdType: "menu",
      minVersion: 24,
      cmdActions: [{ type: "menu", value: "Check Spelling" }],
    },
    "Bearbeiten\ >\ Eigenes\ Wörterbuch\ bearbeiten\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Edit Custom Dictionary..." }],
    },
    "Bearbeiten\ >\ Farben\ bearbeiten\ >\ Bildmaterial\ neu\ färben\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Recolor Art Dialog" }],
    },
    "Bearbeiten\ >\ Farben\ bearbeiten\ >\ Farbbalance\ einstellen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adjust3" }],
    },
    "Bearbeiten\ >\ Farben\ bearbeiten\ >\ Vorne\ \->\ Hinten\ angleichen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Colors3" }],
    },
    "Bearbeiten\ >\ Farben\ bearbeiten\ >\ Horizontal\ angleichen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Colors4" }],
    },
    "Bearbeiten\ >\ Farben\ bearbeiten\ >\ Vertikal\ angleichen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Colors5" }],
    },
    "Bearbeiten\ >\ Farben\ bearbeiten\ >\ In\ CMYK\ konvertieren": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Colors8" }],
    },
    "Bearbeiten\ >\ Farben\ bearbeiten\ >\ In\ Graustufen\ konvertieren": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Colors7" }],
    },
    "Bearbeiten\ >\ Farben\ bearbeiten\ >\ In\ RGB\ konvertieren": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Colors9" }],
    },
    "Bearbeiten\ >\ Farben\ bearbeiten\ >\ Farben\ invertieren": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Colors6" }],
    },
    "Bearbeiten\ >\ Farben\ bearbeiten\ >\ Schwarz\ überdrucken\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Overprint2" }],
    },
    "Bearbeiten\ >\ Farben\ bearbeiten\ >\ Sättigung\ erhöhen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Saturate3" }],
    },
    "Bearbeiten\ >\ Original\ bearbeiten": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "EditOriginal Menu Item" }],
    },
    "Bearbeiten\ >\ Transparenzreduzierungsvorgaben\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Transparency Presets" }],
    },
    "Bearbeiten\ >\ Druckvorgaben\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Print Presets" }],
    },
    "Bearbeiten\ >\ Adobe\ PDF\-Vorgaben\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "PDF Presets" }],
    },
    "Bearbeiten\ >\ Vorgaben\ für\ Perspektivenraster\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "PerspectiveGridPresets" }],
    },
    "Bearbeiten\ >\ Farbeinstellungen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "color" }],
    },
    "Bearbeiten\ >\ Profil\ zuweisen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "assignprofile" }],
    },
    "Bearbeiten\ >\ Tastaturbefehle\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "KBSC Menu Item" }],
    },
    "Objekt\ >\ Transformieren\ >\ Erneut\ transformieren": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "transformagain" }],
    },
    "Objekt\ >\ Transformieren\ >\ Verschieben\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "transformmove" }],
    },
    "Objekt\ >\ Transformieren\ >\ Drehen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "transformrotate" }],
    },
    "Objekt\ >\ Transformieren\ >\ Spiegeln\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "transformreflect" }],
    },
    "Objekt\ >\ Transformieren\ >\ Skalieren\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "transformscale" }],
    },
    "Objekt\ >\ Transformieren\ >\ Verbiegen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "transformshear" }],
    },
    "Objekt\ >\ Transformieren\ >\ Einzeln\ transformieren\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Transform v23" }],
    },
    "Objekt\ >\ Transform\ >\ Begrenzungsrahmen\ zurücksetzen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AI Reset Bounding Box" }],
    },
    "Objekt\ >\ Anordnen\ >\ In\ den\ Vordergrund": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "sendToFront" }],
    },
    "Objekt\ >\ Anordnen\ >\ Schrittweise\ nach\ vorne": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "sendForward" }],
    },
    "Objekt\ >\ Anordnen\ >\ Schrittweise\ nach\ hinten": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "sendBackward" }],
    },
    "Objekt\ >\ Anordnen\ >\ In\ den\ Hintergrund": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "sendToBack" }],
    },
    "Objekt\ >\ Anordnen\ >\ In\ aktuelle\ Ebene\ verschieben": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Selection Hat 2" }],
    },
    "Objekt\ >\ Ausrichten\ >\ Horizontal\ links\ ausrichten": {
      cmdType: "menu",
      minVersion: 24,
      cmdActions: [{ type: "menu", value: "Horizontal Align Left" }],
    },
    "Objekt\ >\ Ausrichten\ >\ Horizontal\ zentriert\ ausrichten": {
      cmdType: "menu",
      minVersion: 24,
      cmdActions: [{ type: "menu", value: "Horizontal Align Center" }],
    },
    "Objekt\ >\ Ausrichten\ >\ Horizontal\ rechts\ ausrichten": {
      cmdType: "menu",
      minVersion: 24,
      cmdActions: [{ type: "menu", value: "Horizontal Align Right" }],
    },
    "Objekt\ >\ Ausrichten\ >\ Vertikal\ oben\ ausrichten": {
      cmdType: "menu",
      minVersion: 24,
      cmdActions: [{ type: "menu", value: "Vertical Align Top" }],
    },
    "Objekt\ >\ Ausrichten\ >\ Vertikal\ zentriert\ ausrichten": {
      cmdType: "menu",
      minVersion: 24,
      cmdActions: [{ type: "menu", value: "Vertical Align Center" }],
    },
    "Objekt\ >\ Ausrichten\ >\ Vertikal\ unten\ ausrichten": {
      cmdType: "menu",
      minVersion: 24,
      cmdActions: [{ type: "menu", value: "Vertical Align Bottom" }],
    },
    "Objekt\ >\ Gruppieren": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "group" }],
    },
    "Objekt\ >\ Gruppierung\ aufheben": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "ungroup" }],
    },
    "Objekt\ >\ Sperren\ >\ Auswahl": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "lock" }],
    },
    "Objekt\ >\ Sperren\ >\ Sämtliches\ Bildmaterial\ darüber": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Selection Hat 5" }],
    },
    "Objekt\ >\ Sperren\ >\ Andere\ Ebenen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Selection Hat 7" }],
    },
    "Objekt\ >\ Alle\ entsperren": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "unlockAll" }],
    },
    "Objekt\ >\ Ausblenden\ >\ Auswahl": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "hide" }],
    },
    "Objekt\ >\ Ausblenden\ >\ Sämtliches\ Bildmaterial\ darüber": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Selection Hat 4" }],
    },
    "Objekt\ >\ Ausblenden\ >\ Andere\ Ebenen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Selection Hat 6" }],
    },
    "Objekt\ >\ Alles\ einblenden": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "showAll" }],
    },
    "Objekt\ >\ Bild\ zuschneiden": {
      cmdType: "menu",
      minVersion: 23,
      cmdActions: [{ type: "menu", value: "Crop Image" }],
    },
    "Objekt\ >\ In\ Pixelbild\ umwandeln\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Rasterize 8 menu item" }],
    },
    "Objekt\ >\ Verlaufsgitter\ erstellen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "make mesh" }],
    },
    "Objekt\ >\ Objektmosaik\ erstellen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AI Object Mosaic Plug-in4" }],
    },
    "Objekt\ >\ Schnittmarken\ erstellen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "TrimMark v25" }],
    },
    "Objekt\ >\ Transparenz\ reduzieren\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Flatten Transparency" }],
    },
    "Objekt\ >\ Pixelgenaue\ Darstellung\ anwenden": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Make Pixel Perfect" }],
    },
    "Objekt\ >\ Slice\ >\ Erstellen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Make Slice" }],
    },
    "Objekt\ >\ Slice\ >\ Zurückwandeln": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Release Slice" }],
    },
    "Objekt\ >\ Slice\ >\ Aus\ Hilfslinien\ erstellen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Create from Guides" }],
    },
    "Objekt\ >\ Slice\ >\ Aus\ Auswahl\ erstellen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Create from Selection" }],
    },
    "Objekt\ >\ Slice\ >\ Slice\ duplizieren": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Duplicate" }],
    },
    "Objekt\ >\ Slice\ >\ Slices\ kombinieren": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Combine" }],
    },
    "Objekt\ >\ Slice\ >\ Slices\ unterteilen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Divide" }],
    },
    "Objekt\ >\ Slice\ >\ Alle\ löschen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Delete All Slices" }],
    },
    "Objekt\ >\ Slice\ >\ Slice\-Optionen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Slice Options" }],
    },
    "Objekt\ >\ Slice\ >\ Ganze\ Zeichenfläche\ exportieren": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Clip to Artboard" }],
    },
    "Objekt\ >\ Umwandeln\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Expand3" }],
    },
    "Objekt\ >\ Aussehen\ umwandeln": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "expandStyle" }],
    },
    "Objekt\ >\ Pfad\ >\ Zusammenfügen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "join" }],
    },
    "Objekt\ >\ Pfad\ >\ Durchschnitt\ berechnen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "average" }],
    },
    "Objekt\ >\ Pfad\ >\ Konturlinie": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "OffsetPath v22" }],
    },
    "Objekt\ >\ Pfad\ >\ Pfad\ verschieben\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "OffsetPath v23" }],
    },
    "Objekt\ >\ Pfad\ >\ Pfadrichtung\ umkehren": {
      cmdType: "menu",
      minVersion: 21,
      cmdActions: [{ type: "menu", value: "Reverse Path Direction" }],
    },
    "Objekt\ >\ Pfad\ >\ Vereinfachen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "simplify menu item" }],
    },
    "Objekt\ >\ Pfad\ >\ Ankerpunkte\ hinzufügen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Add Anchor Points2" }],
    },
    "Objekt\ >\ Pfad\ >\ Ankerpunkte\ entfernen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Remove Anchor Points menu" }],
    },
    "Objekt\ >\ Pfad\ >\ Darunter\ liegende\ Objekte\ aufteilen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Knife Tool2" }],
    },
    "Objekt\ >\ Pfad\ >\ In\ Raster\ teilen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Rows and Columns...." }],
    },
    "Objekt\ >\ Pfad\ >\ Aufräumen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "cleanup menu item" }],
    },
    "Objekt\ >\ Form\ >\ In\ Form\ umwandeln": {
      cmdType: "menu",
      minVersion: 18,
      cmdActions: [{ type: "menu", value: "Convert to Shape" }],
    },
    "Objekt\ >\ Form\ >\ Form\ umwandeln": {
      cmdType: "menu",
      minVersion: 18,
      cmdActions: [{ type: "menu", value: "Expand Shape" }],
    },
    "Objekt\ >\ Muster\ >\ Erstellen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Make Pattern" }],
    },
    "Objekt\ >\ Muster\ >\ Muster\ bearbeiten": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Edit Pattern" }],
    },
    "Objekt\ >\ Muster\ >\ Farbe\ für\ Musterelement\-Kante": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Pattern Tile Color" }],
    },
    "Objekt\ >\ Wiederholen\ >\ Radial": {
      cmdType: "menu",
      minVersion: 25.1,
      cmdActions: [{ type: "menu", value: "Make Radial Repeat" }],
    },
    "Objekt\ >\ Wiederholen\ >\ Raster": {
      cmdType: "menu",
      minVersion: 25.1,
      cmdActions: [{ type: "menu", value: "Make Grid Repeat" }],
    },
    "Objekt\ >\ Wiederholen\ >\ Spiegeln": {
      cmdType: "menu",
      minVersion: 25.1,
      cmdActions: [{ type: "menu", value: "Make Symmetry Repeat" }],
    },
    "Objekt\ >\ Wiederholen\ >\ Zurückwandeln": {
      cmdType: "menu",
      minVersion: 25.1,
      cmdActions: [{ type: "menu", value: "Release Repeat Art" }],
    },
    "Objekt\ >\ Wiederholen\ >\ Optionen\ …": {
      cmdType: "menu",
      minVersion: 25.1,
      cmdActions: [{ type: "menu", value: "Repeat Art Options" }],
    },
    "Objekt\ >\ Angleichen\ >\ Erstellen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Path Blend Make" }],
    },
    "Objekt\ >\ Angleichen\ >\ Zurückwandeln": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Path Blend Release" }],
    },
    "Objekt\ >\ Angleichen\ >\ Angleichung\-Optionen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Path Blend Options" }],
    },
    "Objekt\ >\ Angleichen\ >\ Umwandeln": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Path Blend Expand" }],
    },
    "Objekt\ >\ Angleichen\ >\ Achse\ ersetzen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Path Blend Replace Spine" }],
    },
    "Objekt\ >\ Angleichen\ >\ Achse\ umkehren": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Path Blend Reverse Spine" }],
    },
    "Objekt\ >\ Angleichen\ >\ Farbrichtung\ umkehren": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Path Blend Reverse Stack" }],
    },
    "Objekt\ >\ Verzerrungshülle\ >\ Mit\ Verkrümmung\ erstellen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Make Warp" }],
    },
    "Objekt\ >\ Verzerrungshülle\ >\ Mit\ Gitter\ erstellen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Create Envelope Grid" }],
    },
    "Objekt\ >\ Verzerrungshülle\ >\ Mit\ oberstem\ Objekt\ erstellen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Make Envelope" }],
    },
    "Objekt\ >\ Verzerrungshülle\ >\ Zurückwandeln": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Release Envelope" }],
    },
    "Objekt\ >\ Verzerrungshülle\ >\ Hüllen\-Optionen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Envelope Options" }],
    },
    "Objekt\ >\ Verzerrungshülle\ >\ Umwandeln": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Expand Envelope" }],
    },
    "Objekt\ >\ Verzerrungshülle\ >\ Inhalt\ bearbeiten": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Edit Envelope Contents" }],
    },
    "Objekt\ >\ Perspektive\ >\ Aktiver\ Ebene\ anhängen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Attach to Active Plane" }],
    },
    "Objekt\ >\ Perspektive\ >\ Aus\ Perspektive\ freigeben": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Release with Perspective" }],
    },
    "Objekt\ >\ Perspektive\ >\ Ebene\ an\ Objekt\ ausrichten": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Show Object Grid Plane" }],
    },
    "Objekt\ >\ Perspektive\ >\ Text\ bearbeiten": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Edit Original Object" }],
    },
    "Objekt\ >\ Interaktiv\ malen\ >\ Erstellen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Make Planet X" }],
    },
    "Objekt\ >\ Interaktiv\ malen\ >\ Zusammenfügen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Marge Planet X" }],
    },
    "Objekt\ >\ Interaktiv\ malen\ >\ Zurückwandeln": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Release Planet X" }],
    },
    "Objekt\ >\ Interaktiv\ malen\ >\ Lückenoptionen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Planet X Options" }],
    },
    "Objekt\ >\ Interaktiv\ malen\ >\ Umwandeln": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Expand Planet X" }],
    },
    "Objekt\ >\ Bildnachzeichner\ >\ Erstellen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Make Image Tracing" }],
    },
    "Objekt\ >\ Bildnachzeichner\ >\ Erstellen\ und\ umwandeln": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Make and Expand Image Tracing" }],
    },
    "Objekt\ >\ Bildnachzeichner\ >\ Zurückwandeln": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Release Image Tracing" }],
    },
    "Objekt\ >\ Bildnachzeichner\ >\ Umwandeln": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Expand Image Tracing" }],
    },
    "Objekt\ >\ Textumfluss\ >\ Erstellen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Make Text Wrap" }],
    },
    "Objekt\ >\ Textumfluss\ >\ Zurückwandeln": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Release Text Wrap" }],
    },
    "Objekt\ >\ Textumfluss\ >\ Textumflussoptionen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Text Wrap Options..." }],
    },
    "Objekt\ >\ Schnittmaske\ >\ Erstellen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "makeMask" }],
    },
    "Objekt\ >\ Schnittmaske\ >\ Zurückwandeln": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "releaseMask" }],
    },
    "Objekt\ >\ Schnittmaske\ >\ Maske\ bearbeiten": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "editMask" }],
    },
    "Objekt\ >\ Zusammengesetzter\ Pfad\ >\ Erstellen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "compoundPath" }],
    },
    "Objekt\ >\ Zusammengesetzter\ Pfad\ >\ Zurückwandeln": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "noCompoundPath" }],
    },
    "Objekt\ >\ Zeichenflächen\ >\ In\ Zeichenflächen\ konvertieren": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "setCropMarks" }],
    },
    "Objekt\ >\ Zeichenflächen\ >\ Alle\ Zeichenflächen\ neu\ anordnen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "ReArrange Artboards" }],
    },
    "Objekt\ >\ Zeichenflächen\ >\ An\ Bildmaterialbegrenzungen\ anpassen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Fit Artboard to artwork bounds" }],
    },
    "Objekt\ >\ Zeichenflächen\ >\ An\ ausgewählte\ Grafik\ anpassen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Fit Artboard to selected Art" }],
    },
    "Objekt\ >\ Diagramm\ >\ Art\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "setGraphStyle" }],
    },
    "Objekt\ >\ Diagramm\ >\ Daten\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "editGraphData" }],
    },
    "Objekt\ >\ Diagramm\ >\ Designs\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "graphDesigns" }],
    },
    "Objekt\ >\ Diagramm\ >\ Balken\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "setBarDesign" }],
    },
    "Objekt\ >\ Diagramm\ >\ Punkte\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "setIconDesign" }],
    },
    "Schrift\ >\ Mehr\ bei\ Adobe\ Fonts\ …": {
      cmdType: "menu",
      minVersion: 17.1,
      cmdActions: [{ type: "menu", value: "Browse Typekit Fonts Menu IllustratorUI" }],
    },
    "Schrift\ >\ Glyphen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "alternate glyph palette plugin" }],
    },
    "Schrift\ >\ Flächentextoptionen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "area-type-options" }],
    },
    "Schrift\ >\ Pfadtext\ >\ Regenbogen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Rainbow" }],
    },
    "Schrift\ >\ Pfadtext\ >\ Asymmetrie": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Skew" }],
    },
    "Schrift\ >\ Pfadtext\ >\ 3D\-Band": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "3D ribbon" }],
    },
    "Schrift\ >\ Pfadtext\ >\ Treppenstufe": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Stair Step" }],
    },
    "Schrift\ >\ Pfadtext\ >\ Schwerkraft": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Gravity" }],
    },
    "Schrift\ >\ Pfadtext\ >\ Pfadtextoptionen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "typeOnPathOptions" }],
    },
    "Schrift\ >\ Pfadtext\ >\ Alten\ Pfadtext\ aktualisieren": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "updateLegacyTOP" }],
    },
    "Schrift\ >\ Verketteter\ Text\ >\ Erstellen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "threadTextCreate" }],
    },
    "Schrift\ >\ Verketteter\ Text\ >\ Auswahl\ zurückwandeln": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "releaseThreadedTextSelection" }],
    },
    "Schrift\ >\ Verketteter\ Text\ >\ Verkettung\ entfernen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "removeThreading" }],
    },
    "Schrift\ >\ Überschrift\ einpassen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "fitHeadline" }],
    },
    "Schrift\ >\ Fehlende\ Schriftarten\ auflösen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe IllustratorUI Resolve Missing Font" }],
    },
    "Schrift\ >\ Schriftart\ suchen/ersetzen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Illustrator Find Font Menu Item" }],
    },
    "Schrift\ >\ Groß\-/Kleinschreibung\ ändern\ >\ GROSSBUCHSTABEN": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "UpperCase Change Case Item" }],
    },
    "Schrift\ >\ Groß\-/Kleinschreibung\ ändern\ >\ kleinbuchstaben": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "LowerCase Change Case Item" }],
    },
    "Schrift\ >\ Groß\-/Kleinschreibung\ ändern\ >\ Erster\ Buchstabe\ Im\ Wort\ Groß": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Title Case Change Case Item" }],
    },
    "Schrift\ >\ Groß\-/Kleinschreibung\ ändern\ >\ Erster\ buchstabe\ im\ satz\ groß": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Sentence case Change Case Item" }],
    },
    "Schrift\ >\ Satz\-/Sonderzeichen\ …": {
      cmdType: "menu",
      cmdActions: [
        { type: "menu", value: "Adobe Illustrator Smart Punctuation Menu Item" },
      ],
    },
    "Schrift\ >\ In\ Pfade\ umwandeln": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "outline" }],
    },
    "Schrift\ >\ Optischer\ Randausgleich": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Optical Alignment Item" }],
    },
    "Schrift\ >\ Verborgene\ Zeichen\ einblenden\ /\ ausblenden": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "showHiddenChar" }],
    },
    "Schrift\ >\ Textausrichtung\ >\ Horizontal": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "type-horizontal" }],
    },
    "Schrift\ >\ Textausrichtung\ >\ Vertikal": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "type-vertical" }],
    },
    "Auswahl\ >\ Alles\ auswählen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "selectall" }],
    },
    "Auswahl\ >\ Alles\ auf\ der\ aktiven\ Zeichenfläche": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "selectallinartboard" }],
    },
    "Auswahl\ >\ Auswahl\ aufheben": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "deselectall" }],
    },
    "Auswahl\ >\ Erneut\ auswählen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find Reselect menu item" }],
    },
    "Auswahl\ >\ Auswahl\ umkehren": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Inverse menu item" }],
    },
    "Auswahl\ >\ Nächstes\ Objekt\ darüber": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Selection Hat 8" }],
    },
    "Auswahl\ >\ Nächstes\ Objekt\ darunter": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Selection Hat 9" }],
    },
    "Auswahl\ >\ Gleich\ >\ Aussehen": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Find Appearance menu item" }],
    },
    "Auswahl\ >\ Gleich\ >\ Aussehensattribute": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Find Appearance Attributes menu item" }],
    },
    "Auswahl\ >\ Gleich\ >\ Füllmethode": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Find Blending Mode menu item" }],
    },
    "Auswahl\ >\ Gleich\ >\ Fläche\ und\ Kontur": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Find Fill & Stroke menu item" }],
    },
    "Auswahl\ >\ Gleich\ >\ Flächenfarbe": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Find Fill Color menu item" }],
    },
    "Auswahl\ >\ Gleich\ >\ Deckkraft": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Find Opacity menu item" }],
    },
    "Auswahl\ >\ Gleich\ >\ Konturfarbe": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Find Stroke Color menu item" }],
    },
    "Auswahl\ >\ Gleich\ >\ Konturstärke": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Find Stroke Weight menu item" }],
    },
    "Auswahl\ >\ Gleich\ >\ Grafikstil": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Find Style menu item" }],
    },
    "Auswahl\ >\ Gleich\ >\ Form": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Find Live Shape menu item" }],
    },
    "Auswahl\ >\ Gleich\ >\ Symbolinstanz": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Find Symbol Instance menu item" }],
    },
    "Auswahl\ >\ Gleich\ >\ Verknüpfungsblockreihen": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Find Link Block Series menu item" }],
    },
    "Auswahl\ >\ Gleich\ >\ Schriftfamilie": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Find Text Font Family menu item" }],
    },
    "Auswahl\ >\ Gleich\ >\ Schriftfamilie\ und\ \-schnitt": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Find Text Font Family Style menu item" }],
    },
    "Auswahl\ >\ Gleich\ >\ Schriftfamilie,\ \-schnitt\ und\ \-grad": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [
        { type: "menu", value: "Find Text Font Family Style Size menu item" },
      ],
    },
    "Auswahl\ >\ Gleich\ >\ Schriftgrad": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Find Text Font Size menu item" }],
    },
    "Auswahl\ >\ Gleich\ >\ Textflächenfarbe": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Find Text Fill Color menu item" }],
    },
    "Auswahl\ >\ Gleich\ >\ Textkonturfarbe": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Find Text Stroke Color menu item" }],
    },
    "Auswahl\ >\ Gleich\ >\ Textflächen\-\ und\ \-konturfarbe": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Find Text Fill Stroke Color menu item" }],
    },
    "Auswahl\ >\ Objekt\ >\ Alles\ auf\ denselben\ Ebenen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Selection Hat 3" }],
    },
    "Auswahl\ >\ Objekt\ >\ Richtungsgriffe": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Selection Hat 1" }],
    },
    "Auswahl\ >\ Objekt\ >\ Borstenpinselstriche": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Bristle Brush Strokes menu item" }],
    },
    "Auswahl\ >\ Objekt\ >\ Pinselkonturen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Brush Strokes menu item" }],
    },
    "Auswahl\ >\ Objekt\ >\ Schnittmasken": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Clipping Masks menu item" }],
    },
    "Auswahl\ >\ Objekt\ >\ Einzelne\ Ankerpunkte": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Stray Points menu item" }],
    },
    "Auswahl\ >\ Objekt\ >\ Alle\ Textobjekte": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Text Objects menu item" }],
    },
    "Auswahl\ >\ Objekt\ >\ Punkttextobjekte": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Point Text Objects menu item" }],
    },
    "Auswahl\ >\ Objekt\ >\ Flächenttextobjekte": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Area Text Objects menu item" }],
    },
    "Auswahl\ >\ Globale\ Bearbeitung\ starten/anhalten": {
      cmdType: "menu",
      minVersion: 23,
      cmdActions: [{ type: "menu", value: "SmartEdit Menu Item" }],
    },
    "Auswahl\ >\ Auswahl\ speichern\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Selection Hat 10" }],
    },
    "Auswahl\ >\ Auswahl\ bearbeiten\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Selection Hat 11" }],
    },
    "Effekt\ >\ Letzten\ Effekt\ anwenden": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Apply Last Effect" }],
    },
    "Effekt\ >\ Letzter\ Effekt": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Last Effect" }],
    },
    "Effekt\ >\ Dokument\-Rastereffekt\-Einstellungen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Rasterize Effect Setting" }],
    },
    "Effekt\ >\ 3D\ und\ Materialien\ >\ Extrudieren\ und\ abgeflachte\ Kante\ …": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Live Adobe Geometry3D Extrude" }],
    },
    "Effekt\ >\ 3D\ und\ Materialien\ >\ Kreiseln\ …": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Live Adobe Geometry3D Revolve" }],
    },
    "Effekt\ >\ 3D\ und\ Materialien\ >\ Aufblasen\ …": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Live Adobe Geometry3D Inflate" }],
    },
    "Effekt\ >\ 3D\ und\ Materialien\ >\ Drehen\ …": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Live Adobe Geometry3D Rotate" }],
    },
    "Effekt\ >\ 3D\ und\ Materialien\ >\ Materialien\ …": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Live Adobe Geometry3D Materials" }],
    },
    "Effekt\ >\ 3D\ \(klassisch\)\ >\ Extrudieren\ und\ abgeflachte\ Kante\ \(klassisch\)\ …": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Live 3DExtrude" }],
    },
    "Effekt\ >\ 3D\ \(klassisch\)\ >\ Kreiseln\ \(klassisch\)\ …": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Live 3DRevolve" }],
    },
    "Effekt\ >\ 3D\ \(klassisch\)\ >\ Drehen\ \(klassisch\)\ …": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Live 3DRotate" }],
    },
    "Effekt\ >\ In\ Form\ umwandeln\ >\ Rechteck\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Rectangle" }],
    },
    "Effekt\ >\ In\ Form\ umwandeln\ >\ Abgerundetes\ Rechteck\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Rounded Rectangle" }],
    },
    "Effekt\ >\ In\ Form\ umwandeln\ >\ Ellipse\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Ellipse" }],
    },
    "Effekt\ >\ Schnittmarken": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Trim Marks" }],
    },
    "Effekt\ >\ Verzerrungs\-\ und\ Transformationsfilter\ >\ Frei\ verzerren\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Free Distort" }],
    },
    "Effekt\ >\ Verzerrungs\-\ und\ Transformationsfilter\ >\ Zusammenziehen\ und\ aufblasen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pucker & Bloat" }],
    },
    "Effekt\ >\ Verzerrungs\-\ und\ Transformationsfilter\ >\ Aufrauen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Roughen" }],
    },
    "Effekt\ >\ Verzerrungs\-\ und\ Transformationsfilter\ >\ Transformieren\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Transform" }],
    },
    "Effekt\ >\ Verzerrungs\-\ und\ Transformationsfilter\ >\ Tweak\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Scribble and Tweak" }],
    },
    "Effekt\ >\ Verzerrungs\-\ und\ Transformationsfilter\ >\ Wirbel\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Twist" }],
    },
    "Effekt\ >\ Verzerrungs\-\ und\ Transformationsfilter\ >\ Zickzack\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Zig Zag" }],
    },
    "Effekt\ >\ Pfad\ >\ Pfad\ verschieben\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Offset Path" }],
    },
    "Effekt\ >\ Pfad\ >\ Kontur\ nachzeichnen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Outline Object" }],
    },
    "Effekt\ >\ Pfad\ >\ Konturlinie": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Outline Stroke" }],
    },
    "Effekt\ >\ Pathfinder\ >\ Hinzufügen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Add" }],
    },
    "Effekt\ >\ Pathfinder\ >\ Schnittmenge\ bilden": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Intersect" }],
    },
    "Effekt\ >\ Pathfinder\ >\ Schnittmenge\ entfernen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Exclude" }],
    },
    "Effekt\ >\ Pathfinder\ >\ Subtrahieren": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Subtract" }],
    },
    "Effekt\ >\ Pathfinder\ >\ Hinteres\ Objekt\ abziehen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Minus Back" }],
    },
    "Effekt\ >\ Pathfinder\ >\ Unterteilen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Divide" }],
    },
    "Effekt\ >\ Pathfinder\ >\ Überlappungsbereich\ entfernen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Trim" }],
    },
    "Effekt\ >\ Pathfinder\ >\ Verdeckte\ Fläche\ entfernen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Merge" }],
    },
    "Effekt\ >\ Pathfinder\ >\ Schnittmengenfläche": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Crop" }],
    },
    "Effekt\ >\ Pathfinder\ >\ Kontur\ aufteilen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Outline" }],
    },
    "Effekt\ >\ Pathfinder\ >\ Hart\ mischen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Hard Mix" }],
    },
    "Effekt\ >\ Pathfinder\ >\ Weich\ mischen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Soft Mix" }],
    },
    "Effekt\ >\ Pathfinder\ >\ Überfüllen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Trap" }],
    },
    "Effekt\ >\ In\ Pixelbild\ umwandeln\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Rasterize" }],
    },
    "Effekt\ >\ Stilisierungsfilter\ >\ Schlagschatten\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Adobe Drop Shadow" }],
    },
    "Effekt\ >\ Stilisierungsfilter\ >\ Weiche\ Kante\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Feather" }],
    },
    "Effekt\ >\ Stilisierungsfilter\ >\ Schein\ nach\ innen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Inner Glow" }],
    },
    "Effekt\ >\ Stilisierungsfilter\ >\ Schein\ nach\ außen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Outer Glow" }],
    },
    "Effekt\ >\ Stilisierungsfilter\ >\ Ecken\ abrunden\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Adobe Round Corners" }],
    },
    "Effekt\ >\ Stilisierungsfilter\ >\ Scribble\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Scribble Fill" }],
    },
    "Effekt\ >\ SVG\-Filter\ >\ SVG\-Filter\ anwenden\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live SVG Filters" }],
    },
    "Effekt\ >\ SVG\-Filter\ >\ SVG\-Filter\ importieren\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "SVG Filter Import" }],
    },
    "Effekt\ >\ Verkrümmungsfilter\ >\ Bogen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Arc" }],
    },
    "Effekt\ >\ Verkrümmungsfilter\ >\ Bogen\ unten\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Arc Lower" }],
    },
    "Effekt\ >\ Verkrümmungsfilter\ >\ Bogen\ oben\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Arc Upper" }],
    },
    "Effekt\ >\ Verkrümmungsfilter\ >\ Torbogen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Arch" }],
    },
    "Effekt\ >\ Verkrümmungsfilter\ >\ Wulst\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Bulge" }],
    },
    "Effekt\ >\ Verkrümmungsfilter\ >\ Muschel\ unten\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Shell Lower" }],
    },
    "Effekt\ >\ Verkrümmungsfilter\ >\ Muschel\ oben\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Shell Upper" }],
    },
    "Effekt\ >\ Verkrümmungsfilter\ >\ Flagge\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Flag" }],
    },
    "Effekt\ >\ Verkrümmungsfilter\ >\ Schwingungen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Wave" }],
    },
    "Effekt\ >\ Verkrümmungsfilter\ >\ Fisch\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Fish" }],
    },
    "Effekt\ >\ Verkrümmungsfilter\ >\ Ansteigend\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Rise" }],
    },
    "Effekt\ >\ Verkrümmungsfilter\ >\ Fischauge\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Fisheye" }],
    },
    "Effekt\ >\ Verkrümmungsfilter\ >\ Aufblasen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Inflate" }],
    },
    "Effekt\ >\ Verkrümmungsfilter\ >\ Stauchen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Squeeze" }],
    },
    "Effekt\ >\ Verkrümmungsfilter\ >\ Wirbel\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Twist" }],
    },
    "Effekt\ >\ Effekte\-Galerie\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_GEfc" }],
    },
    "Effekt\ >\ Kunstfilter\ >\ Buntstiftschraffur\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_ClrP" }],
    },
    "Effekt\ >\ Kunstfilter\ >\ Farbpapier\-Collage\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Ct  " }],
    },
    "Effekt\ >\ Kunstfilter\ >\ Grobe\ Malerei\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_DryB" }],
    },
    "Effekt\ >\ Kunstfilter\ >\ Körnung\ \&\ Aufhellung\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_FlmG" }],
    },
    "Effekt\ >\ Kunstfilter\ >\ Fresko\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Frsc" }],
    },
    "Effekt\ >\ Kunstfilter\ >\ Neonschein\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_NGlw" }],
    },
    "Effekt\ >\ Kunstfilter\ >\ Ölfarbe\ getupft\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_PntD" }],
    },
    "Effekt\ >\ Kunstfilter\ >\ Malmesser\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_PltK" }],
    },
    "Effekt\ >\ Kunstfilter\ >\ Kunststofffolie\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_PlsW" }],
    },
    "Effekt\ >\ Kunstfilter\ >\ Tontrennung\ \&\ Kantenbetonung\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_PstE" }],
    },
    "Effekt\ >\ Kunstfilter\ >\ Grobes\ Pastell\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_RghP" }],
    },
    "Effekt\ >\ Kunstfilter\ >\ Diagonal\ verwischen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_SmdS" }],
    },
    "Effekt\ >\ Kunstfilter\ >\ Schwamm\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Spng" }],
    },
    "Effekt\ >\ Kunstfilter\ >\ Malgrund\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Undr" }],
    },
    "Effekt\ >\ Kunstfilter\ >\ Aquarell\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Wtrc" }],
    },
    "Effekt\ >\ Weichzeichnungsfilter\ >\ Gaußscher\ Weichzeichner\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Adobe PSL Gaussian Blur" }],
    },
    "Effekt\ >\ Weichzeichnungsfilter\ >\ Radialer\ Weichzeichner\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_RdlB" }],
    },
    "Effekt\ >\ Weichzeichnungsfilter\ >\ Selektiver\ Weichzeichner\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_SmrB" }],
    },
    "Effekt\ >\ Malfilter\ >\ Kanten\ betonen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_AccE" }],
    },
    "Effekt\ >\ Malfilter\ >\ Gekreuzte\ Malstriche\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_AngS" }],
    },
    "Effekt\ >\ Malfilter\ >\ Kreuzschraffur\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Crsh" }],
    },
    "Effekt\ >\ Malfilter\ >\ Dunkle\ Malstriche\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_DrkS" }],
    },
    "Effekt\ >\ Malfilter\ >\ Konturen\ mit\ Tinte\ nachzeichnen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_InkO" }],
    },
    "Effekt\ >\ Malfilter\ >\ Spritzer\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Spt " }],
    },
    "Effekt\ >\ Malfilter\ >\ Verwackelte\ Striche\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_SprS" }],
    },
    "Effekt\ >\ Malfilter\ >\ Sumi\-e\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Smie" }],
    },
    "Effekt\ >\ Verzerrungsfilter\ >\ Weiches\ Licht\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_DfsG" }],
    },
    "Effekt\ >\ Verzerrungsfilter\ >\ Glas\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Gls " }],
    },
    "Effekt\ >\ Verzerrungsfilter\ >\ Ozeanwellen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_OcnR" }],
    },
    "Effekt\ >\ Vergröberungsfilter\ >\ Farbraster\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_ClrH" }],
    },
    "Effekt\ >\ Vergröberungsfilter\ >\ Kristallisieren\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Crst" }],
    },
    "Effekt\ >\ Vergröberungsfilter\ >\ Mezzotint\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Mztn" }],
    },
    "Effekt\ >\ Vergröberungsfilter\ >\ Punktieren\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Pntl" }],
    },
    "Effekt\ >\ Zeichenfilter\ >\ Basrelief\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_BsRl" }],
    },
    "Effekt\ >\ Zeichenfilter\ >\ Chalk\ \&\ Charcoal\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_ChlC" }],
    },
    "Effekt\ >\ Zeichenfilter\ >\ Kohleumsetzung\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Chrc" }],
    },
    "Effekt\ >\ Zeichenfilter\ >\ Chrom\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Chrm" }],
    },
    "Effect > Sketch > Cont\\u00E9 Crayon...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_CntC" }],
    },
    "Effekt\ >\ Zeichenfilter\ >\ Strichumsetzung\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_GraP" }],
    },
    "Effekt\ >\ Zeichenfilter\ >\ Rasterungseffekt\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_HlfS" }],
    },
    "Effekt\ >\ Zeichenfilter\ >\ Prägepapier\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_NtPr" }],
    },
    "Effekt\ >\ Zeichenfilter\ >\ Fotokopie\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Phtc" }],
    },
    "Effekt\ >\ Zeichenfilter\ >\ Stuck\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Plst" }],
    },
    "Effekt\ >\ Zeichenfilter\ >\ Punktierstich\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Rtcl" }],
    },
    "Effekt\ >\ Zeichenfilter\ >\ Stempel\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Stmp" }],
    },
    "Effekt\ >\ Zeichenfilter\ >\ Gerissene\ Kanten\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_TrnE" }],
    },
    "Effekt\ >\ Zeichenfilter\ >\ Feuchtes\ Papier\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_WtrP" }],
    },
    "Effekt\ >\ Stilisierungsfilter\ >\ Leuchtende\ Konturen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_GlwE" }],
    },
    "Effekt\ >\ Strukturierungsfilter\ >\ Risse\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Crql" }],
    },
    "Effekt\ >\ Strukturierungsfilter\ >\ Körnung\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Grn " }],
    },
    "Effekt\ >\ Strukturierungsfilter\ >\ Kacheln\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_MscT" }],
    },
    "Effekt\ >\ Strukturierungsfilter\ >\ Patchwork\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Ptch" }],
    },
    "Effekt\ >\ Strukturierungsfilter\ >\ Buntglas\-Mosaik\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_StnG" }],
    },
    "Effekt\ >\ Strukturierungsfilter\ >\ Mit\ Struktur\ versehen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Txtz" }],
    },
    "Effekt\ >\ Videofilter\ >\ De\-Interlace\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Dntr" }],
    },
    "Effekt\ >\ Videofilter\ >\ NTSC\-Farben": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_NTSC" }],
    },
    "Ansicht\ >\ Vorschau\ /\ Pfadansicht": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "preview" }],
    },
    "Ansicht\ >\ Mit\ GPU\ anzeigen\ /\ Mit\ CPU\ anzeigen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "GPU Preview" }],
    },
    "Ansicht\ >\ Überdruckenvorschau": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "ink" }],
    },
    "Ansicht\ >\ Pixelvorschau": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "raster" }],
    },
    "Ansicht\ >\ Proof\ einrichten\ >\ Dokument\-CMYK": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "proof-document" }],
    },
    "Ansicht\ >\ Proof\ einrichten\ >\ Altes\ Macintosh\-RGB\ \(Gamma\ 1\.8\)": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "proof-mac-rgb" }],
    },
    "Ansicht\ >\ Proof\ einrichten\ >\ Internet\-Standard\-RGB\ \(sRGB\)": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "proof-win-rgb" }],
    },
    "Ansicht\ >\ Proof\ einrichten\ >\ Monitor\-RGB": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "proof-monitor-rgb" }],
    },
    "Ansicht\ >\ Proof\ einrichten\ >\ Farbenblindheit\ \(Protanopie\)": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "proof-colorblindp" }],
    },
    "Ansicht\ >\ Proof\ einrichten\ >\ Farbenblindheit\ \(Deuteranopie\)": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "proof-colorblindd" }],
    },
    "Ansicht\ >\ Proof\ einrichten\ >\ Anpassen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "proof-custom" }],
    },
    "Ansicht\ >\ Farbproof": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "proofColors" }],
    },
    "Ansicht\ >\ Einzoomen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "zoomin" }],
    },
    "Ansicht\ >\ Auszoomen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "zoomout" }],
    },
    "Ansicht\ >\ Zeichenfläche\ in\ Fenster\ einpassen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "fitin" }],
    },
    "Ansicht\ >\ Alle\ in\ Fenster\ einpassen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "fitall" }],
    },
    "Ansicht\ >\ Slices\ einblenden\ /\ ausblenden": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Feedback Menu" }],
    },
    "Ansicht\ >\ Slices\ fixieren": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Lock Menu" }],
    },
    "Ansicht\ >\ Begrenzungsrahmen\ einblenden\ /\ ausblenden": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AI Bounding Box Toggle" }],
    },
    "Ansicht\ >\ Transparenzraster\ einblenden\ /\ ausblenden": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "TransparencyGrid Menu Item" }],
    },
    "Ansicht\ >\ Originalgröße": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "actualsize" }],
    },
    "Ansicht\ >\ Interaktive\ Mallücken\ einblenden\ /\ ausblenden": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Show Gaps Planet X" }],
    },
    "Ansicht\ >\ Verlaufsoptimierer\ einblenden\ /\ ausblenden": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Gradient Feedback" }],
    },
    "View > Show / Hide Corner Widget": {
      cmdType: "menu",
      minVersion: 17.1,
      cmdActions: [{ type: "menu", value: "Live Corner Annotator" }],
    },
    "Ansicht\ >\ Ecken\ einblenden\ /\ ausblenden": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "edge" }],
    },
    "Ansicht\ >\ Intelligente\ Hilfslinien": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Snapomatic on-off menu item" }],
    },
    "Ansicht\ >\ Perspektivenraster\ >\ Raster\ einblenden\ /\ ausblenden": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Show Perspective Grid" }],
    },
    "Ansicht\ >\ Perspektivenraster\ >\ Lineale\ einblenden\ /\ ausblenden": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Show Ruler" }],
    },
    "Ansicht\ >\ Perspektivenraster\ >\ Am\ Raster\ ausrichten": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Snap to Grid" }],
    },
    "Ansicht\ >\ Perspektivenraster\ >\ Raster\ sperren": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Lock Perspective Grid" }],
    },
    "Ansicht\ >\ Perspektivenraster\ >\ Bezugspunkt\ sperren": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Lock Station Point" }],
    },
    "Ansicht\ >\ Perspektivenraster\ >\ Raster\ definieren": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Define Perspective Grid" }],
    },
    "Ansicht\ >\ Perspektivenraster\ >\ Raster\ als\ Vorgabe\ speichern": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Save Perspective Grid as Preset" }],
    },
    "Ansicht\ >\ Zeichenflächen\ einblenden\ /\ ausblenden": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "artboard" }],
    },
    "Ansicht\ >\ Druckaufteilung\ einblenden\ /\ ausblenden": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "pagetiling" }],
    },
    "Ansicht\ >\ Vorlage\ einblenden\ /\ ausblenden": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "showtemplate" }],
    },
    "Ansicht\ >\ Lineale\ >\ Lineale\ einblende\ /\ ausblendenn": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "ruler" }],
    },
    "Ansicht\ >\ Lineale\ >\ In\ globale\ Lineale\ ändern": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "rulerCoordinateSystem" }],
    },
    "Ansicht\ >\ Lineale\ >\ Videolineale\ einblenden\ /\ ausblenden": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "videoruler" }],
    },
    "Ansicht\ >\ Textverkettungen\ einblenden\ /\ ausblenden": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "textthreads" }],
    },
    "Ansicht\ >\ Hilfslinien\ >\ Hilfslinien\ einblenden\ /\ ausblenden": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "showguide" }],
    },
    "Ansicht\ >\ Hilfslinien\ >\ Hilfslinien\ sperren": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "lockguide" }],
    },
    "Ansicht\ >\ Hilfslinien\ >\ Hilfslinien\ erstellen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "makeguide" }],
    },
    "Ansicht\ >\ Hilfslinien\ >\ Hilfslinien\ zurückwandeln": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "releaseguide" }],
    },
    "Ansicht\ >\ Hilfslinien\ >\ Hilfslinien\ löschen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "clearguide" }],
    },
    "Ansicht\ >\ Raster\ einblenden\ /\ ausblenden": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "showgrid" }],
    },
    "Ansicht\ >\ Am\ Raster\ ausrichten": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "snapgrid" }],
    },
    "Ansicht\ >\ An\ Punkt\ ausrichten": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "snappoint" }],
    },
    "Ansicht\ >\ Neue\ Ansicht\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "newview" }],
    },
    "Ansicht\ >\ Ansicht\ bearbeiten\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "editview" }],
    },
    "Fenster\ >\ Neues\ Fenster": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "newwindow" }],
    },
    "Fenster\ >\ Anordnen\ >\ Überlappend": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "cascade" }],
    },
    "Fenster\ >\ Anordnen\ >\ Nebeneinander": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "tile" }],
    },
    "Fenster\ >\ Anordnen\ >\ In\ Fenster\ verschiebbar\ machen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "floatInWindow" }],
    },
    "Fenster\ >\ Anordnen\ >\ Alle\ in\ Fenstern\ verschiebbar\ machen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "floatAllInWindows" }],
    },
    "Fenster\ >\ Anordnen\ >\ Alle\ Fenster\ zusammenführen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "consolidateAllWindows" }],
    },
    "Fenster\ >\ Arbeitsbereich\ >\ Zurücksetzen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Reset Workspace" }],
    },
    "Fenster\ >\ Arbeitsbereich\ >\ Neuer\ Arbeitsbereich\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe New Workspace" }],
    },
    "Fenster\ >\ Arbeitsbereich\ >\ Arbeitsbereiche\ verwalten\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Manage Workspace" }],
    },
    "Fenster\ >\ Erweiterungen\ auf\ Exchange\ suchen\ …": {
      cmdType: "menu",
      minVersion: 19,
      cmdActions: [{ type: "menu", value: "Browse Add-Ons Menu" }],
    },
    "Fenster\ >\ Steuerung": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "drover control palette plugin" }],
    },
    "Fenster\ >\ Werkzeugleisten\ >\ Erweitert": {
      cmdType: "menu",
      minVersion: 23,
      cmdActions: [{ type: "menu", value: "Adobe Advanced Toolbar Menu" }],
    },
    "Fenster\ >\ Werkzeugleisten\ >\ Einfach": {
      cmdType: "menu",
      minVersion: 23,
      cmdActions: [{ type: "menu", value: "Adobe Basic Toolbar Menu" }],
    },
    "Fenster\ >\ Werkzeugleisten\ >\ Neue\ Werkzeugleiste\ …": {
      cmdType: "menu",
      minVersion: 17,
      cmdActions: [{ type: "menu", value: "New Tools Panel" }],
    },
    "Fenster\ >\ Werkzeugleisten\ >\ Werkzeugleisten\ verwalten\ …": {
      cmdType: "menu",
      minVersion: 17,
      cmdActions: [{ type: "menu", value: "Manage Tools Panel" }],
    },
    "Fenster\ >\ 3D\ und\ Materialien": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Adobe 3D Panel" }],
    },
    "Fenster\ >\ Aktionen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Action Palette" }],
    },
    "Fenster\ >\ Ausrichten": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AdobeAlignObjects2" }],
    },
    "Fenster\ >\ Aussehen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Style Palette" }],
    },
    "Fenster\ >\ Zeichenflächen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Artboard Palette" }],
    },
    "Fenster\ >\ Export\ von\ Element": {
      cmdType: "menu",
      minVersion: 20,
      cmdActions: [{ type: "menu", value: "Adobe SmartExport Panel Menu Item" }],
    },
    "Fenster\ >\ Attribute": {
      cmdType: "menu",
      cmdActions: [
        { type: "menu", value: "internal palettes posing as plug-in menus-attributes" },
      ],
    },
    "Fenster\ >\ Pinsel": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe BrushManager Menu Item" }],
    },
    "Fenster\ >\ Farbe": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Color Palette" }],
    },
    "Fenster\ >\ Farbhilfe": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Harmony Palette" }],
    },
    "Fenster\ >\ Kommentare": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Adobe Commenting Palette" }],
    },
    "CSS\-Eigenschaften": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "CSS Menu Item" }],
    },
    "Fenster\ >\ Dokumentinformationen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "DocInfo1" }],
    },
    "Fenster\ >\ Reduzierungsvorschau": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Flattening Preview" }],
    },
    "Fenster\ >\ Verlauf": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Gradient Palette" }],
    },
    "Fenster\ >\ Grafikstile": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Style Palette" }],
    },
    "Fenster\ >\ Versionsverlauf": {
      cmdType: "menu",
      minVersion: 26.4,
      cmdActions: [{ type: "menu", value: "Adobe HistoryPanel Menu Item" }],
    },
    "Fenster\ >\ Info": {
      cmdType: "menu",
      cmdActions: [
        { type: "menu", value: "internal palettes posing as plug-in menus-info" },
      ],
    },
    "Fenster\ >\ Ebenen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AdobeLayerPalette1" }],
    },
    "Fenster\ >\ Bibliotheken": {
      cmdType: "menu",
      cmdActions: [
        {
          type: "menu",
          value: "Adobe CSXS Extension com.adobe.DesignLibraries.angularLibraries",
        },
      ],
    },
    "Fenster\ >\ Verknüpfungen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe LinkPalette Menu Item" }],
    },
    "Fenster\ >\ Zauberstab": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AI Magic Wand" }],
    },
    "Fenster\ >\ Navigator": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AdobeNavigator" }],
    },
    "Fenster\ >\ Pathfinder": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe PathfinderUI" }],
    },
    "Fenster\ >\ Musteroptionen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Pattern Panel Toggle" }],
    },
    "Fenster\ >\ Eigenschaften": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Adobe Property Palette" }],
    },
    "Fenster\ >\ Separationenvorschau": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Separation Preview Panel" }],
    },
    "Fenster\ >\ Kontur": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Stroke Palette" }],
    },
    "Fenster\ >\ SVG\-Interaktivität": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe SVG Interactivity Palette" }],
    },
    "Fenster\ >\ Farbfelder": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Swatches Menu Item" }],
    },
    "Fenster\ >\ Symbole": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Symbol Palette" }],
    },
    "Fenster\ >\ Transformieren": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AdobeTransformObjects1" }],
    },
    "Fenster\ >\ Transparenz": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Transparency Palette Menu Item" }],
    },
    "Fenster\ >\ Schrift\ >\ Zeichen": {
      cmdType: "menu",
      cmdActions: [
        { type: "menu", value: "internal palettes posing as plug-in menus-character" },
      ],
    },
    "Fenster\ >\ Schrift\ >\ Zeichenformate": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Character Styles" }],
    },
    "Fenster\ >\ Schrift\ >\ Glyphen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "alternate glyph palette plugin 2" }],
    },
    "Fenster\ >\ Schrift\ >\ OpenType": {
      cmdType: "menu",
      cmdActions: [
        { type: "menu", value: "internal palettes posing as plug-in menus-opentype" },
      ],
    },
    "Fenster\ >\ Schrift\ >\ Absatz": {
      cmdType: "menu",
      cmdActions: [
        { type: "menu", value: "internal palettes posing as plug-in menus-paragraph" },
      ],
    },
    "Fenster\ >\ Schrift\ >\ Absatzformate": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Paragraph Styles Palette" }],
    },
    "Fenster\ >\ Schrift\ >\ Tabulatoren": {
      cmdType: "menu",
      cmdActions: [
        { type: "menu", value: "internal palettes posing as plug-in menus-tab" },
      ],
    },
    "Fenster\ >\ Variablen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Variables Palette Menu Item" }],
    },
    "Fenster\ >\ Versionsverlauf": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "Adobe Version History File Menu Item" }],
    },
    "Fenster\ >\ Pinsel\-Bibliotheken\ >\ Andere\ Bibliothek\ …": {
      cmdType: "menu",
      cmdActions: [
        { type: "menu", value: "AdobeBrushMgrUI Other libraries menu item" },
      ],
    },
    "Fenster\ >\ Grafikstil\-Bibliotheken\ >\ Andere\ Bibliothek\ …": {
      cmdType: "menu",
      cmdActions: [
        { type: "menu", value: "Adobe Art Style Plugin Other libraries menu item" },
      ],
    },
    "Fenster\ >\ Farbfeld\-Bibliotheken\ >\ Andere\ Bibliothek\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AdobeSwatch_ Other libraries menu item" }],
    },
    "Fenster\ >\ Symbol\-Bibliotheken\ >\ Andere\ Bibliothek\ …": {
      cmdType: "menu",
      cmdActions: [
        {
          type: "menu",
          value: "Adobe Symbol Palette Plugin Other libraries menu item",
        },
      ],
    },
    "Hilfe\ >\ Illustrator\-Hilfe\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "helpcontent" }],
    },
    "Hilfe\ >\ Support\-Community": {
      cmdType: "menu",
      minVersion: 26,
      cmdActions: [{ type: "menu", value: "supportCommunity" }],
    },
    "Hilfe\ >\ Fehlermeldung\ /\ Funktionswunsch\ senden\ …": {
      cmdType: "menu",
      minVersion: 25,
      cmdActions: [{ type: "menu", value: "wishform" }],
    },
    "Hilfe\ >\ Systeminformationen\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "System Info" }],
    },
    "Anderes\ Bedienfeld\ >\ Aktionsstapel\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Actions Batch" }],
    },
    "Anderes\ Bedienfeld\ >\ Neue\ Fläche\ hinzufügen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe New Fill Shortcut" }],
    },
    "Anderes\ Bedienfeld\ >\ Neue\ Kontur\ hinzufügen": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe New Stroke Shortcut" }],
    },
    "Anderes\ Bedienfeld\ >\ Neuer\ Grafikstil\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe New Style Shortcut" }],
    },
    "Anderes\ Bedienfeld\ >\ Neue\ Ebene": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AdobeLayerPalette2" }],
    },
    "Anderes\ Bedienfeld\ >\ Neue\ Ebene\ mit\ Dialog\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AdobeLayerPalette3" }],
    },
    "Anderes\ Bedienfeld\ >\ Verknüpfung\ aktualisieren": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Update Link Shortcut" }],
    },
    "Anderes\ Bedienfeld\ >\ Neues\ Farbfeld\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe New Swatch Shortcut Menu" }],
    },
    "Anderes\ Bedienfeld\ >\ Neues\ Symbol\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe New Symbol Shortcut" }],
    },
    "Über\ Illustrator\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "about" }],
    },
    "Voreinstellungen\ >\ Allgemein\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "preference" }],
    },
    "Voreinstellungen\ >\ Auswahl\ und\ Ankerpunkt\-Anzeige\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "selectPref" }],
    },
    "Voreinstellungen\ >\ Schrift\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "keyboardPref" }],
    },
    "Voreinstellungen\ >\ Einheit\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "unitundoPref" }],
    },
    "Voreinstellungen\ >\ Hilfslinien\ und\ Raster\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "guidegridPref" }],
    },
    "Voreinstellungen\ >\ Intelligente\ Hilfslinien\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "snapPref" }],
    },
    "Voreinstellungen\ >\ Slices\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "slicePref" }],
    },
    "Voreinstellungen\ >\ Silbentrennung\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "hyphenPref" }],
    },
    "Voreinstellungen\ >\ Zusatzmodule\ und\ virtueller\ Speicher\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "pluginPref" }],
    },
    "Voreinstellungen\ >\ Benutzeroberfläche\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "UIPref" }],
    },
    "Voreinstellungen\ >\ Leistung\ …": {
      cmdType: "menu",
      minVersion: 19,
      cmdActions: [{ type: "menu", value: "GPUPerformancePref" }],
    },
    "Voreinstellungen\ >\ Dateihandhabung…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "FilePref" }],
    },
    "Voreinstellungen\ >\ Zwischenablageoptionen\ …": {
      cmdType: "menu",
      minVersion: 25,
      cmdActions: [{ type: "menu", value: "ClipboardPref" }],
    },
    "Bearbeiten\ >\ Voreinstellungen\ >\ Aussehen\ von\ Schwarz\ …": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "BlackPref" }],
    },
    "Voreinstellungen\ >\ Geräte\ …": {
      cmdType: "menu",
      minVersion: 24,
      cmdActions: [{ type: "menu", value: "DevicesPref" }],
    },
  };
}
