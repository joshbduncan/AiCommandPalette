/*
Ai Command Palette
Copyright 2022 Josh Duncan
https://joshbduncan.com

This script is distributed under the MIT License.
See the LICENSE file for details.
*/

//@target illustrator

const _title = "Ai Command Palette";
const _version = "0.2.4";
const _copyright = "Copyright 2022 Josh Duncan";
const _website = "joshbduncan.com";
const _github = "https://github.com/joshbduncan";

// Load Needed JavaScript Polyfills
polyfills();

/**************************************************
RUN THE SCRIPT
**************************************************/

// Ai Command Palette data object
const data = {
  commands: {
    script: {},
    workflow: {},
    action: loadAllActions(),
    defaults: {
      Настройки: {
        cmdType: "defaults",
        cmdActions: [{ type: "config", value: "paletteSettings" }],
      },
    },
    menu: builtinMenuCommands(),
    tool: builtinTools(),
    config: {
      "Об Ai Command Palette": {
        cmdType: "config",
        cmdActions: [{ type: "config", value: "about" }],
      },
      "Создать набор команд": {
        cmdType: "config",
        cmdActions: [{ type: "config", value: "buildWorkflow" }],
      },
      "Редактировать набор команд": {
        cmdType: "config",
        cmdActions: [{ type: "config", value: "editWorkflow" }],
      },
      "Наборы требующие внимания": {
        cmdType: "config",
        cmdActions: [{ type: "config", value: "workflowsNeedingAttention" }],
      },
      "Загрузить скрипты": {
        cmdType: "config",
        cmdActions: [{ type: "config", value: "loadScript" }],
      },
      "Показать стандартные команды меню": {
        cmdType: "config",
        cmdActions: [{ type: "config", value: "showBuiltInMenuCommands" }],
      },
      "Показать стандартные инструменты": {
        cmdType: "config",
        cmdActions: [{ type: "config", value: "showBuiltInTools" }],
      },
      "Скрыть команды": {
        cmdType: "config",
        cmdActions: [{ type: "config", value: "hideCommand" }],
      },
      "Показать команды": {
        cmdType: "config",
        cmdActions: [{ type: "config", value: "unhideCommand" }],
      },
      "Удалить команды": {
        cmdType: "config",
        cmdActions: [{ type: "config", value: "deleteCommand" }],
      },
      "Показать файл настроек": {
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

// Check Ai version for proper functionality
const aiVersion = parseFloat(app.version);
const versionedCommands = {
  "Окно\ >\ История": {
    minVersion: 36.4, // set to 36.4 for testing (should be 26.4)
    type: "commands",
    subtype: "menu",
  },
  tool: {
    minVersion: 34, // set to 34 for testing (should be 24)
    type: "commands",
    subtype: "tool",
  },
  "Показать\ стандартные\ инструменты": {
    minVersion: 34, // set to 34 for testing (should be 24)
    type: "commands",
    subtype: "config",
  },
};
var cmd, minVersion, type, subtype;
for (cmd in versionedCommands) {
  minVersion = versionedCommands[cmd].minVersion;
  type = versionedCommands[cmd].type;
  subtype = versionedCommands[cmd].subtype;
  if (aiVersion < minVersion) {
    // this is to delete the entire tool object
    // as it was not supported before Ai v24
    if (cmd == subtype) {
      delete data[type][subtype];
    } else {
      delete data[type][subtype][cmd];
    }
  }
}

// Load user data
const dataFolder = setupFolderObject(Folder.userData + "/" + "JBD");
const dataFile = setupFileObject(dataFolder, "AiCommandPalette.json");
loadUserData(dataFile);

// Setup commands for Ai Command Palette
const commandsData = buildCommands();
const allCommands = Object.keys(commandsData);
const filteredCommands = filterHiddenCommands();

// Present the Ai Command Palette
const paletteWidth = 600;
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
  var type, actions;
  if (commandsData.hasOwnProperty(command)) {
    type = commandsData[command].cmdType;
    actions = commandsData[command].cmdActions;
    // check to make sure any workflow steps haven't been deleted
    if (type === "workflow" && actions.join(" ").indexOf("**УДАЛЕНО**") >= 0) {
      alert(
        "Внимание\nЭтот набор команд включает шаги, которые были удалены\n\n" + command
      );
    } else {
      for (var i = 0; i < actions.length; i++) {
        if (type === "workflow") {
          processCommandActions(actions[i]);
        } else {
          executeCommandAction(actions[i]);
        }
      }
    }
  } else {
    alert(
      "Команда удалена\nОтредактируйте наборы, в которых она использовалась\n\n" +
        command
    );
    if (command.indexOf("**УДАЛЕНО**") < 0) deletedCommandNeedsAttention(command);
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
        alert("Ошибка запуска команды:\n" + action.value + "\n\n" + e);
      }
      break;
    case "menu":
      try {
        app.executeMenuCommand(action.value);
      } catch (e) {
        alert("Ошибка запуска команды:\n" + action.value + "\n\n" + e);
      }
      break;
    case "tool":
      try {
        app.selectTool(action.value);
      } catch (e) {
        alert("Ошибка выбора инструмента:\n" + action.value + "\n\n" + e);
      }
      break;
    case "action":
      try {
        app.doScript(action.value.actionName, action.value.actionSet);
      } catch (e) {
        alert("Ошибка запуска операции:\n" + action.value.actionName + "\n\n" + e);
      }
      break;
    case "script":
      f = new File(action.value.scriptPath);
      if (!f.exists) {
        alert("Скрипт не найден в указанной папке\n" + action.value.scriptPath);
        delete data.commands[type]["Скрипт:" + " " + action.value.scriptName];
        if (action.value.scriptName.indexOf("**УДАЛЕНО**") < 0)
          deletedCommandNeedsAttention("Скрипт:" + " " + action.value.scriptName);
      } else {
        try {
          $.evalFile(f);
        } catch (e) {
          alert("Ошибка запуска скрипта:\n" + action.value.scriptName + "\n\n" + e);
        }
      }
      break;
    default:
      alert("Неправильный тип:\n" + type);
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
      alert("Неправильный параметр конфигурации:\n" + action);
  }
  if (write) writeUserData(dataFile);
}

/** Show Ai Command Palette About Dialog. */
function aboutDialog() {
  var win = new Window("dialog");
  win.text = "О скрипте";
  win.alignChildren = "fill";

  // script info
  var pAbout = win.add("panel", undefined, "Об Ai Command Palette");
  pAbout.margins = 20;
  pAbout.alignChildren = "fill";
  var aboutText =
    "Повысьте скорость работы в Adobe Illustrator благодаря быстрому доступу к большинству команд меню, инструментам, всем операциям и любым загруженным скриптам прямо с клавиатуры. А пользовательские наборы позволяют комбинировать несколько команд, операций и скриптов. Замените повторяющиеся задачи наборами команд и повысьте свою производительность.";
  pAbout.add("statictext", [0, 0, 500, 100], aboutText, {
    multiline: true,
  });

  var links = pAbout.add("group");
  links.orientation = "column";
  links.alignChildren = ["center", "center"];
  links.add("statictext", undefined, "Version " + _version);
  links.add("statictext", undefined, _copyright);
  var githubText =
    "Нажмите, чтобы узнать больше:" +
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
    (title = "Настройка и конфигурация панели"),
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
  var files = loadFileTypes("Загрузка файлов скриптов", true, ".jsx$|.js$");
  if (files.length > 0) {
    for (var i = 0; i < files.length; i++) {
      f = files[i];
      fname = decodeURI(f.name);
      if (data.commands.script.hasOwnProperty("Скрипт:" + " " + fname)) {
        if (
          !Window.confirm(
            "Скрипт уже загружен\nХотите его заменить?",
            "noAsDflt",
            "Проблема загрузки скрипта"
          )
        )
          continue;
      }
      if (insertScriptIntoUserData(f)) ct++;
    }
    if (ct > 0) buildCommands(data.commands, true);
    alert("Загружено скриптов:\n" + ct);
  } else {
    alert("Не выбраны скрипты\nФайлы JavaScript имеют расширение '.js' или '.jsx'");
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
          "Набор с таким именем уже существует\nХотите перезаписать предыдущий?",
          "noAsDflt",
          "Проблема сохранения набора"
        )
      ) {
        break;
      } else {
        newName = Window.prompt("Введите новое имя набора", "", "Имя нового набора");
        if (newName == undefined || newName == null || newName === "") {
          alert("Набор не сохранен");
          return false;
        } else {
          result.name = "Набор:" + " " + newName;
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
      alert("Ошибка сохранения набора:\n" + result.name);
    }
  }
}

/** Choose a workflow to edit. */
function configEditWorkflow() {
  var result = commandPalette(
    (arr = Object.keys(data.commands.workflow)),
    (title = "Выберите набор для редактирования"),
    (bounds = [0, 0, paletteWidth, 182]),
    (multiselect = false),
    (filter = [])
  );
  if (result) configBuildWorkflow(result);
}

/** Show workflows that need attention. */
function configWorkflowsNeedingAttention() {
  var commands = [];
  for (var p in data.commands.workflow) {
    if (data.commands.workflow[p].cmdActions.join(" ").indexOf("**УДАЛЕНО**") >= 0)
      commands.push(p);
  }

  if (commands.length > 0) {
    var result = commandPalette(
      (arr = commands),
      (title = "Выберите набор для редактирования"),
      (bounds = [0, 0, paletteWidth, 182]),
      (multiselect = false),
      (filter = [])
    );
    if (result) configBuildWorkflow(result);
  } else {
    alert("Нет наборов требующих внимания");
  }
}

/** Show all built-in Ai menu commands. */
function showBuiltInMenuCommands() {
  result = commandPalette(
    (arr = Object.keys(data.commands.menu)),
    (title = "Стандартные команды меню"),
    (bounds = [0, 0, paletteWidth, 182]),
    (multiselect = false),
    (filter = [])
  );
  if (result) processCommandActions(result);
}

/** Show all built-in Ai tools. */
function showBuiltInTools() {
  result = commandPalette(
    (arr = Object.keys(data.commands.tool)),
    (title = "Стандартные инструменты"),
    (bounds = [0, 0, paletteWidth, 182]),
    (multiselect = false),
    (filter = [])
  );
  if (result) processCommandActions(result);
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
      (title = "Выбрать команды меню для скрытия"),
      (bounds = [0, 0, paletteWidth, 182]),
      (multiselect = true),
      (filter = [])
    );
    if (result) {
      if (
        Window.confirm(
          "Скрыть команды?\n" + result.join("\n"),
          "noAsDflt",
          "Подтвердить скрытие команд"
        )
      ) {
        for (var i = 0; i < result.length; i++) {
          data.settings.hiddenCommands.push(result[i].text);
          ct++;
        }
      }
    }
    if (ct > 0) {
      alert("Скрыто команд:" + " " + ct);
    }
  } else {
    alert("Нет команд для скрытия");
  }
}

/** Unhide user hidden commands. */
function configUnhideCommand() {
  var result;
  var ct = 0;

  if (data.settings.hiddenCommands.length > 0) {
    result = commandPalette(
      (arr = data.settings.hiddenCommands),
      (title = "Выберите скрытые команды для показа"),
      (bounds = [0, 0, paletteWidth, 182]),
      (multiselect = true),
      (filter = [])
    );
    if (result) {
      if (
        Window.confirm(
          "Показать скрытые команды?\n" + result.join("\n"),
          "noAsDflt",
          "Подтвердить показ команд"
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
      alert("Показано скрытых команд:\n" + ct);
    }
  } else {
    alert("Нет скрытых команд");
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
      (title = "Выбрать команды меню для удаления"),
      (bounds = [0, 0, paletteWidth, 182]),
      (multiselect = true),
      (filter = [])
    );
    if (result) {
      if (
        Window.confirm(
          "Удалить команду?\nУдаленные команды больше не будут работать в любых созданных наборах, где они использовались\n\n" +
            result.join("\n"),
          "noAsDflt",
          "Подтвердить удаление команд"
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
      alert("Удалено команд:" + ct);
    }
  } else {
    alert("Нет команд для удаления");
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
  q.helpTip = "Поиск команд, операций и загруженных скриптов";
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
  var cancel = winButtons.add("button", undefined, "Отмена", { name: "cancel" });
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
  win.text = "Редактор наборов команд";
  win.alignChildren = "fill";

  // if editing a command, pull in variables to prefill dialog with
  var command = "";
  var actions = [];
  if (edit != undefined) {
    var regex = new RegExp("^" + "Набор:" + "\\s");
    command = edit[0].text.replace(regex, "");
    actions = commandsData[edit].cmdActions;
  }

  // command search
  var pSearch = win.add("panel", undefined, "Поиск команд");
  pSearch.alignChildren = ["fill", "center"];
  pSearch.margins = 20;
  var q = pSearch.add("edittext");
  q.helpTip = "Поиск команд, операций и загруженных скриптов";
  q.active = true;
  var commands = pSearch.add("listbox", [0, 0, paletteWidth + 40, 182], arr, {
    multiselect: false,
  });
  commands.helpTip = "Нажмите дважды на команду, чтобы добавить ее как шаг набора";
  commands.selection = 0;

  // workflow steps
  var pSteps = win.add("panel", undefined, "Шаги набора");
  pSteps.alignChildren = ["fill", "center"];
  pSteps.margins = 20;
  var steps = pSteps.add("listbox", [0, 0, paletteWidth + 40, 182], actions, {
    multiselect: true,
  });
  steps.helpTip = "Набор выполняется сверху вниз";
  var stepButtons = pSteps.add("group");
  stepButtons.alignment = "center";
  var up = stepButtons.add("button", undefined, "Наверх");
  up.preferredSize.width = 100;
  var down = stepButtons.add("button", undefined, "Вниз");
  down.preferredSize.width = 100;
  var del = stepButtons.add("button", undefined, "Удалить");
  del.preferredSize.width = 100;

  // command name
  var pName = win.add("panel", undefined, "Сохранить набор как");
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
  var cancel = winButtons.add("button", undefined, "Отмена", { name: "cancel" });
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
    if (steps.items.length == 0) {
      {
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
      if (steps.items.length > 0) {
        ok.enabled = true;
      }
    }
  };

  if (win.show() == 1) {
    var finalName = "Набор:" + " " + name.text.trim();
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
      commandsData[command] = data.commands[type][command];
    }
  }
  return commandsData;
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
        data.commands.workflow[command].cmdActions[n] = curAction + " " + "**УДАЛЕНО**";
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
      actions["Операция:" + " " + actionName + " [" + setName + "]"] = {
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
    data.commands.script["Скрипт:" + " " + fname] = {
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
    alert("Ошибка загрузки скрипта:\n" + f.fsName);
    return false;
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
 * Read Ai "json-like" data from file `f`.
 * @param   {Object} f File object to read.
 * @returns {Object}   Evaluated JSON data.
 */

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
    alert("Ошибка загрузки файла:\n" + f);
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
    alert("Ошибка записи файла:\n" + f);
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

/** Default Ai Tools */
function builtinTools() {
  return {
    "Инструмент: Добавить опорную точку": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Add Anchor Point Tool" }],
    },
    "Инструмент: Опорная точка": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Anchor Point Tool" }],
    },
    "Инструмент: Дуга": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Arc Tool" }],
    },
    "Инструмент: Диаграмма с областями": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Area Graph Tool" }],
    },
    "Инструмент: Текст в области": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Area Type Tool" }],
    },
    "Инструмент: Монтажная область": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Crop Tool" }],
    },
    "Инструмент: Диаграмма горизонтальные полосы": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Bar Graph Tool" }],
    },
    "Инструмент: Переход": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Blend Tool" }],
    },
    "Инструмент: Раздувание": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Bloat Tool" }],
    },
    "Инструмент: Кисть-клякса": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Blob Brush Tool" }],
    },
    "Инструмент: Диаграмма вертикальные полосы": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Column Graph Tool" }],
    },
    "Инструмент: Кристаллизация": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Cyrstallize Tool" }],
    },
    "Инструмент: Кривизна": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Curvature Tool" }],
    },
    "Инструмент: Удалить опорную точку": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Delete Anchor Point Tool" }],
    },
    "Инструмент: Прямое выделение": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Direct Select Tool" }],
    },
    "Инструмент: Эллипс": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Ellipse Shape Tool" }],
    },
    "Инструмент: Ластик": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Eraser Tool" }],
    },
    "Инструмент: Пипетка": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Eyedropper Tool" }],
    },
    "Инструмент: Блик": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Flare Tool" }],
    },
    "Инструмент: Свободное трансформирование": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Free Transform Tool" }],
    },
    "Инструмент: Градиент": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Gradient Vector Tool" }],
    },
    "Инструмент: Групповое выделение": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Direct Object Select Tool" }],
    },
    "Инструмент: Рука": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Scroll Tool" }],
    },
    "Инструмент: Соединение": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Corner Join Tool" }],
    },
    "Инструмент: Нож": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Knife Tool" }],
    },
    "Инструмент: Лассо": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Direct Lasso Tool" }],
    },
    "Инструмент: Линейная диаграмма": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Line Graph Tool" }],
    },
    "Инструмент: Отрезок линии": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Line Tool" }],
    },
    "Инструмент: Быстрая заливка": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Planar Paintbucket Tool" }],
    },
    "Инструмент: Выделение быстрых заливок": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Planar Face Select Tool" }],
    },
    "Инструмент: Волшебная палочка": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Magic Wand Tool" }],
    },
    "Инструмент: Линейка": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Measure Tool" }],
    },
    "Инструмент: Сетка": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Mesh Editing Tool" }],
    },
    "Инструмент: Кисть": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Brush Tool" }],
    },
    "Инструмент: Стирание контура": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Freehand Erase Tool" }],
    },
    "Инструмент: Элемент узора": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Pattern Tile Tool" }],
    },
    "Инструмент: Перо": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Pen Tool" }],
    },
    "Инструмент: Карандаш": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Freehand Tool" }],
    },
    "Инструмент: Сетка перспективы": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Инструмент: Сетка перспективы" }],
    },
    "Инструмент: Выбор перспективы": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Инструмент: Выбор перспективы" }],
    },
    "Инструмент: Круговая диаграмма": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Pie Graph Tool" }],
    },
    "Инструмент: Полярная сетка": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Polar Grid Tool" }],
    },
    "Инструмент: Многоугольник": {
      cmdType: "tool",
      cmdActions: [
        { type: "tool", value: "Adobe Shape Construction Regular Polygon Tool" },
      ],
    },
    "Инструмент: Разбиение для печати": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Page Tool" }],
    },
    "Инструмент: Втягивание": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Pucker Tool" }],
    },
    "Инструмент: Марионеточная деформация": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Puppet Warp Tool" }],
    },
    "Инструмент: Диаграмма радар": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Radar Graph Tool" }],
    },
    "Инструмент: Прямоугольник": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Rectangle Shape Tool" }],
    },
    "Инструмент: Прямоугольная сетка": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Rectangular Grid Tool" }],
    },
    "Инструмент: Зеркальное отражение": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Reflect Tool" }],
    },
    "Инструмент: Перерисовка": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Reshape Tool" }],
    },
    "Инструмент: Поворот": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Rotate Tool" }],
    },
    "Инструмент: Поворот вида": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Rotate Canvas Tool" }],
    },
    "Инструмент: Прямоугольник со скругленными углами": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Rounded Rectangle Tool" }],
    },
    "Инструмент: Масштаб": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Scale Tool" }],
    },
    "Инструмент: Зубцы": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Scallop Tool" }],
    },
    "Инструмент: Точечная диаграмма": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Scatter Graph Tool" }],
    },
    "Инструмент: Ножницы": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Scissors Tool" }],
    },
    "Инструмент: Выделение": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Select Tool" }],
    },
    "Инструмент: Создание фигур": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Shape Builder Tool" }],
    },
    "Инструмент: Shaper": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Shaper Tool" }],
    },
    "Инструмент: Наклон": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Shear Tool" }],
    },
    "Инструмент: Фрагменты": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Slice Tool" }],
    },
    "Инструмент: Выделение фрагмента": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Slice Select Tool" }],
    },
    "Инструмент: Сглаживание": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Freehand Smooth Tool" }],
    },
    "Инструмент: Спираль": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Shape Construction Spiral Tool" }],
    },
    "Инструмент: Диаграмма горизонтальный стек": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Stacked Bar Graph Tool" }],
    },
    "Инструмент: Диаграмма вертикальный стек": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Stacked Column Graph Tool" }],
    },
    "Инструмент: Звезда": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Shape Construction Star Tool" }],
    },
    "Инструмент: Прозрачность символов": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Symbol Screener Tool" }],
    },
    "Инструмент: Уплотнение символов": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Symbol Scruncher Tool" }],
    },
    "Инструмент: Смещение символов": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Symbol Shifter Tool" }],
    },
    "Инструмент: Размер символов": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Symbol Sizer Tool" }],
    },
    "Инструмент: Вращение символов": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Symbol Spinner Tool" }],
    },
    "Инструмент: Распыление символов": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Symbol Sprayer Tool" }],
    },
    "Инструмент: Обесцвечивание символов": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Symbol Stainer Tool" }],
    },
    "Инструмент: Стили символов": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Symbol Styler Tool" }],
    },
    "Инструмент: Изменение текста": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Touch Type Tool" }],
    },
    "Инструмент: Воронка": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe New Twirl Tool" }],
    },
    "Инструмент: Текст": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Type Tool" }],
    },
    "Инструмент: Текст по контуру": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Path Type Tool" }],
    },
    "Инструмент: Вертикальный текст в области": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Vertical Area Type Tool" }],
    },
    "Инструмент: Вертикальный текст": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Vertical Type Tool" }],
    },
    "Инструмент: Вертикальный текст по контуру": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Vertical Path Type Tool" }],
    },
    "Инструмент: Деформация": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Warp Tool" }],
    },
    "Инструмент: Ширина": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Width Tool" }],
    },
    "Инструмент: Морщины": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Wrinkle Tool" }],
    },
    "Инструмент: Масштаб": {
      cmdType: "tool",
      cmdActions: [{ type: "tool", value: "Adobe Zoom Tool" }],
    },
  };
}

/** Default Ai Menu Commands */
function builtinMenuCommands() {
  return {
    "Файл > Новый...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "new" }],
    },
    "Файл > Новый из шаблона...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "newFromTemplate" }],
    },
    "Файл > Открыть...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "open" }],
    },
    "Файл > Обзор в Bridge...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Bridge Browse" }],
    },
    "Файл > Закрыть": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "close" }],
    },
    "Файл > Сохранить": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "save" }],
    },
    "Файл > Сохранить как...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "saveas" }],
    },
    "Файл > Сохранить копию...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "saveacopy" }],
    },
    "Файл > Журнал версий": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "saveastemplate" }],
    },
    "Файл > Сохранить как шаблон": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe AI Save Selected Slices" }],
    },
    "Файл > Восстановить": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "revert" }],
    },
    "Файл > Поиск в Adobe Stock...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Search Adobe Stock" }],
    },
    "Файл > Поместить...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AI Place" }],
    },
    "Файл > Экспорт для экранов...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "exportForScreens" }],
    },
    "Файл > Экспортировать как...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "export" }],
    },
    "Файл > Сохранить для браузеров...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe AI Save For Web" }],
    },
    "Файл > Экспортировать выделенные элементы...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "exportSelection" }],
    },
    "Файл > Упаковать...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Package Menu Item" }],
    },
    "Файл > Сценарии > Другой сценарий...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "ai_browse_for_script" }],
    },
    "Файл > Параметры документа...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "document" }],
    },
    "Файл > Цветовой режим документа > CMYK": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "doc-color-cmyk" }],
    },
    "Файл > Цветовой режим документа > RGB": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "doc-color-rgb" }],
    },
    "Файл > Сведения о файле...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "File Info" }],
    },
    "Файл > Печать...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Print" }],
    },
    "Файл > Выход": { cmdType: "menu", cmdActions: [{ type: "menu", value: "quit" }] },
    "Редактирование > Отменить": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "undo" }],
    },
    "Редактирование > Повторить": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "redo" }],
    },
    "Редактирование > Вырезать": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "cut" }],
    },
    "Редактирование > Копировать": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "copy" }],
    },
    "Редактирование > Вставить": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "paste" }],
    },
    "Редактирование > Вставить на передний план": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "pasteFront" }],
    },
    "Редактирование > Вставить на задний план": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "pasteBack" }],
    },
    "Редактирование > Вставить на то же место": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "pasteInPlace" }],
    },
    "Редактирование > Вставить на все монтажные области": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "pasteInAllArtboard" }],
    },
    "Редактирование > Вставить без форматирования": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "pasteWithoutFormatting" }],
    },
    "Редактирование > Очистить": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "clear" }],
    },
    "Редактирование > Найти и заменить...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find and Replace" }],
    },
    "Редактирование > Найти следующий": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find Next" }],
    },
    "Редактирование > Орфография > Автоматическая проверка орфографии": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Auto Spell Check" }],
    },
    "Редактирование > Орфография > Проверка орфографии…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Check Spelling" }],
    },
    "Редактирование > Редактировать заказной словарь...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Edit Custom Dictionary..." }],
    },
    "Редактирование > Редактировать цвета > Перекрасить графический объект...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Recolor Art Dialog" }],
    },
    "Редактирование > Редактировать цвета > Коррекция цветового баланса...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adjust3" }],
    },
    "Редактирование > Редактировать цвета > Переход от верхнего к нижнему": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Colors3" }],
    },
    "Редактирование > Редактировать цвета > Переход по горизонтали": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Colors4" }],
    },
    "Редактирование > Редактировать цвета > Переход по вертикали": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Colors5" }],
    },
    "Редактирование > Редактировать цвета > Преобразовать в CMYK": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Colors8" }],
    },
    "Редактирование > Редактировать цвета > Преобразовать в градации серого": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Colors7" }],
    },
    "Редактирование > Редактировать цвета > Преобразовать в RGB": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Colors9" }],
    },
    "Редактирование > Редактировать цвета > Негатив": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Colors6" }],
    },
    "Редактирование > Редактировать цвета > Наложение черного цвета...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Overprint2" }],
    },
    "Редактирование > Редактировать цвета > Изменить насыщенность...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Saturate3" }],
    },
    "Редактирование > Редактировать оригинал": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "EditOriginal Menu Item" }],
    },
    "Редактирование > Стили обработки прозрачности...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Transparency Presets" }],
    },
    "Редактирование > Стили печати...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Print Presets" }],
    },
    "Редактирование > Стили преобразования в Adobe PDF...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "PDF Presets" }],
    },
    "Редактирование > Стили сетки перспективы...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "PerspectiveGridPresets" }],
    },
    "Редактирование > Настройка цветова...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "color" }],
    },
    "Редактирование > Назначить профиль...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "assignprofile" }],
    },
    "Редактирование > Комбинации клавиш...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "KBSC Menu Item" }],
    },
    "Объект > Трансформировать > Повторить трансформирование": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "transformagain" }],
    },
    "Объект > Трансформировать > Перемещение...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "transformmove" }],
    },
    "Объект > Трансформировать > Поворот...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "transformrotate" }],
    },
    "Объект > Трансформировать > Зеркальное отражение...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "transformreflect" }],
    },
    "Объект > Трансформировать > Масштабирование...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "transformscale" }],
    },
    "Объект > Трансформировать > Наклон...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "transformshear" }],
    },
    "Объект > Трансформировать > Трансформировать каждый...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Transform v23" }],
    },
    "Объект > Трансформировать > Восстановить настройки по умолчанию ограничительной рамки":
      {
        cmdType: "menu",
        cmdActions: [{ type: "menu", value: "AI Reset Bounding Box" }],
      },
    "Объект > Монтаж > На передний план": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "sendToFront" }],
    },
    "Объект > Монтаж > На задний план": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "sendForward" }],
    },
    "Объект > Монтаж > Переложить вперед": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "sendBackward" }],
    },
    "Объект > Монтаж > Переложить назад": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "sendToBack" }],
    },
    "Объект > Монтаж > Отправить на текущий слой": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Selection Hat 2" }],
    },
    "Объект > Выравнивание > Горизонтальное выравнивание, влево": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Horizontal Align Left" }],
    },
    "Объект > Выравнивание > Горизонтальное выравнивание, центр": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Horizontal Align Center" }],
    },
    "Объект > Выравнивание > Горизонтальное выравнивание, вправо": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Horizontal Align Right" }],
    },
    "Объект > Выравнивание > Вертикальное выравнивание, вверх": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Vertical Align Top" }],
    },
    "Объект > Выравнивание > Вертикальное выравнивание, центр": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Vertical Align Center" }],
    },
    "Объект > Выравнивание > Вертикальное выравнивание, вниз": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Vertical Align Bottom" }],
    },
    "Объект > Сгруппировать": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "group" }],
    },
    "Объект > Разгруппировать": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "ungroup" }],
    },
    "Объект > Закрепить > Выделенное": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "lock" }],
    },
    "Объект > Закрепить > Все объекты выше": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Selection Hat 5" }],
    },
    "Объект > Закрепить > Остальные слои": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Selection Hat 7" }],
    },
    "Объект > Освободить все": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "unlockAll" }],
    },
    "Объект > Скрыть > Выделенное": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "hide" }],
    },
    "Объект > Скрыть > Все объекты выше": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Selection Hat 4" }],
    },
    "Объект > Скрыть > Остальные слои": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Selection Hat 6" }],
    },
    "Объект > Показать все": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "showAll" }],
    },
    "Объект > Обрезать изображение": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Crop Image" }],
    },
    "Объект > Растрировать...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Rasterize 8 menu item" }],
    },
    "Объект > Создать сетчатый градиент...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "make mesh" }],
    },
    "Объект > Создать фрагментацию...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AI Object Mosaic Plug-in4" }],
    },
    "Объект > Создать метки обреза": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "TrimMark v25" }],
    },
    "Объект > Обработка прозрачности...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Flatten Transparency" }],
    },
    "Объект > Коррекция на уровне пикселов": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Make Pixel Perfect" }],
    },
    "Объект > Фрагменты > Создать": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Make Slice" }],
    },
    "Объект > Фрагменты > Расформировать": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Release Slice" }],
    },
    "Объект > Фрагменты > Создать по направляющим": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Create from Guides" }],
    },
    "Объект > Фрагменты > Создать по выделенной области": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Create from Selection" }],
    },
    "Объект > Фрагменты > Создать дубликат фрагмента": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Duplicate" }],
    },
    "Объект > Фрагменты > Объединить фрагменты": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Combine" }],
    },
    "Объект > Фрагменты > Разделить фрагменты...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Divide" }],
    },
    "Объект > Фрагменты > Удалить все": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Delete All Slices" }],
    },
    "Объект > Фрагменты > Параметры фрагмента...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Slice Options" }],
    },
    "Объект > Фрагменты > Обрезать по монтажной области": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Clip to Artboard" }],
    },
    "Объект > Разобрать…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Expand3" }],
    },
    "Объект > Разобрать оформление": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "expandStyle" }],
    },
    "Объект > Контур > Соединить": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "join" }],
    },
    "Объект > Контур > Усреднить…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "average" }],
    },
    "Объект > Контур > Преобразовать обводку в кривые": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "OffsetPath v22" }],
    },
    "Объект > Контур > Создать параллельный контур…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "OffsetPath v23" }],
    },
    "Объект > Контур > Изменение направления контура": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Reverse Path Direction" }],
    },
    "Объект > Контур > Упростить…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "simplify menu item" }],
    },
    "Объект > Контур > Добавить опорные точки": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Add Anchor Points2" }],
    },
    "Объект > Контур > Удалить опорные точки": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Remove Anchor Points menu" }],
    },
    "Объект > Контур > Разделить нижние объекты": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Knife Tool2" }],
    },
    "Объект > Контур > Создать сетку...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Rows and Columns...." }],
    },
    "Объект > Контур > Вычистить…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "cleanup menu item" }],
    },
    "Объект > Фигура > Преобразовать в фигуры": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Convert to Shape" }],
    },
    "Объект > Фигура > Разобрать фигуру": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Expand Shape" }],
    },
    "Объект > Узор > Создать": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Make Pattern" }],
    },
    "Объект > Узор > Редактировать узор": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Edit Pattern" }],
    },
    "Объект > Узор > Цвет края элемента...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Pattern Tile Color" }],
    },
    "Объект > Повторить > Радиальный": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Make Radial Repeat" }],
    },
    "Объект > Повторить > Сетка": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Make Grid Repeat" }],
    },
    "Объект > Повторить > Зеркально": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Make Symmetry Repeat" }],
    },
    "Объект > Повторить > Освободить": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Release Repeat Art" }],
    },
    "Объект > Повторить > Параметры…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Repeat Art Options" }],
    },
    "Объект > Переход > Создать": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Path Blend Make" }],
    },
    "Объект > Переход > Отменить": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Path Blend Release" }],
    },
    "Объект > Переход > Параметры перехода…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Path Blend Options" }],
    },
    "Объект > Переход > Разобрать": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Path Blend Expand" }],
    },
    "Объект > Переход > Заменить траекторию": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Path Blend Replace Spine" }],
    },
    "Объект > Переход > Изменить направление": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Path Blend Reverse Spine" }],
    },
    "Объект > Переход > Изменить порядок": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Path Blend Reverse Stack" }],
    },
    "Объект > Искажение с помощью оболочки > Деформация...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Make Warp" }],
    },
    "Объект > Искажение с помощью оболочки > По сетке...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Create Envelope Grid" }],
    },
    "Объект > Искажение с помощью оболочки > По форме верхнего объекта": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Make Envelope" }],
    },
    "Объект > Искажение с помощью оболочки > Отделить": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Release Envelope" }],
    },
    "Объект > Искажение с помощью оболочки > Параметры оболочки...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Envelope Options" }],
    },
    "Объект > Искажение с помощью оболочки > Разобрать": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Expand Envelope" }],
    },
    "Объект > Искажение с помощью оболочки > Редактировать содержимое": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Edit Envelope Contents" }],
    },
    "Объект > Перспектива > Прикрепить к активной плоскости": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Attach to Active Plane" }],
    },
    "Объект > Перспектива > Открепить с сохранением перспективы": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Release with Perspective" }],
    },
    "Объект > Перспектива > Переместить плоскость для подгонки по объекту": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Show Object Grid Plane" }],
    },
    "Объект > Перспектива > Редактировать текст": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Edit Original Object" }],
    },
    "Объект > Быстрая заливка > Создать": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Make Planet X" }],
    },
    "Объект > Быстрая заливка > Объединить": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Marge Planet X" }],
    },
    "Объект > Быстрая заливка > Расформировать": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Release Planet X" }],
    },
    "Объект > Быстрая заливка > Параметры зазоров…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Planet X Options" }],
    },
    "Объект > Быстрая заливка > Разобрать": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Expand Planet X" }],
    },
    "Объект > Трассировка изображения > Создать": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Make Image Tracing" }],
    },
    "Объект > Трассировка изображения > Создать и разобрать": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Make and Expand Image Tracing" }],
    },
    "Объект > Трассировка изображения > Расформировать": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Release Image Tracing" }],
    },
    "Объект > Трассировка изображения > Разобрать": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Expand Image Tracing" }],
    },
    "Объект > Обтекание текстом > Создать": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Make Text Wrap" }],
    },
    "Объект > Обтекание текстом > Освободить": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Release Text Wrap" }],
    },
    "Объект > Обтекание текстом > Параметры обтекания текстом...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Text Wrap Options..." }],
    },
    "Объект > Обтравочная маска > Создать": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "makeMask" }],
    },
    "Объект > Обтравочная маска > Отменить": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "releaseMask" }],
    },
    "Объект > Обтравочная маска > Редактировать маску": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "editMask" }],
    },
    "Объект > Составной контур > Создать": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "compoundPath" }],
    },
    "Объект > Составной контур > Отменить": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "noCompoundPath" }],
    },
    "Объект > Монтажные области > Преобразовать в монтажные области": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "setCropMarks" }],
    },
    "Объект > Монтажные области > Переупорядочить все монт. обл.": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "ReArrange Artboards" }],
    },
    "Объект > Монтажные области > Подогнать по границам иллюстрации": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Fit Artboard to artwork bounds" }],
    },
    "Объект > Монтажные области > Подогнать по границам выделенной иллюстрации": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Fit Artboard to selected Art" }],
    },
    "Объект > Диаграмма > Тип…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "setGraphStyle" }],
    },
    "Объект > Диаграмма > Данные…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "editGraphData" }],
    },
    "Объект > Диаграмма > Оформление…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "graphDesigns" }],
    },
    "Объект > Диаграмма > Столбец…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "setBarDesign" }],
    },
    "Объект > Диаграмма > Маркер…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "setIconDesign" }],
    },
    "Текст > Найти больше в Adobe Fonts...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Browse Typekit Fonts Menu IllustratorUI" }],
    },
    "Текст > Глифы": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "alternate glyph palette plugin" }],
    },
    "Текст > Параметры текста в области…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "area-type-options" }],
    },
    "Текст > Текст по контуру > Радуга": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Rainbow" }],
    },
    "Текст > Текст по контуру > Наклон": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Skew" }],
    },
    "Текст > Текст по контуру > Каскад": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "3D ribbon" }],
    },
    "Текст > Текст по контуру > Лесенка": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Stair Step" }],
    },
    "Текст > Текст по контуру > Гравитация": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Gravity" }],
    },
    "Текст > Текст по контуру > Параметры текста по контуру...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "typeOnPathOptions" }],
    },
    "Текст > Текст по контуру > Обновить прежнюю версию текста по контуру": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "updateLegacyTOP" }],
    },
    "Текст > Связанные текстовые блоки > Связать": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "threadTextCreate" }],
    },
    "Текст > Связанные текстовые блоки > Исключить выделенные": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "releaseThreadedTextSelection" }],
    },
    "Текст > Связанные текстовые блоки > Удалить связь текстовых блоков": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "removeThreading" }],
    },
    "Текст > Разогнать заголовок": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "fitHeadline" }],
    },
    "Текст > Сопоставить отсутствующие шрифты...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe IllustratorUI Resolve Missing Font" }],
    },
    "Текст > Найти/заменить шрифт...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Illustrator Find Font Menu Item" }],
    },
    "Текст > Изменить регистр > ВСЕ ПРОПИСНЫЕ": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "UpperCase Change Case Item" }],
    },
    "Текст > Изменить регистр > все строчные": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "LowerCase Change Case Item" }],
    },
    "Текст > Изменить регистр > Прописная В Начале Каждого Слова": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Title Case Change Case Item" }],
    },
    "Текст > Изменить регистр > Прописная в начале предложения": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Sentence case Change Case Item" }],
    },
    "Текст > Типографская пунктуация...": {
      cmdType: "menu",
      cmdActions: [
        { type: "menu", value: "Adobe Illustrator Smart Punctuation Menu Item" },
      ],
    },
    "Текст > Преобразовать в кривые": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "outline" }],
    },
    "Текст > Визуальное выравнивание полей": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Optical Alignment Item" }],
    },
    "Текст > Показать скрытые символы": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "showHiddenChar" }],
    },
    "Текст > Ориентация текста > Горизонтальная": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "type-horizontal" }],
    },
    "Текст > Ориентация текста > Вертикальная": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "type-vertical" }],
    },
    "Выделение > Все": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "selectall" }],
    },
    "Выделение > Все объекты в активной монтажной области": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "selectallinartboard" }],
    },
    "Выделение > Отменить выделение": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "deselectall" }],
    },
    "Выделение > Выделить снова": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find Reselect menu item" }],
    },
    "Выделение > Инверсия": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Inverse menu item" }],
    },
    "Выделение > Следующий объект сверху": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Selection Hat 8" }],
    },
    "Выделение > Следующий объект снизу": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Selection Hat 9" }],
    },
    "Выделение > По общему признаку > Оформление": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find Appearance menu item" }],
    },
    "Выделение > По общему признаку > Атрибуты оформления": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find Appearance Attributes menu item" }],
    },
    "Выделение > По общему признаку > С одинаковым режимом наложения": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find Blending Mode menu item" }],
    },
    "Выделение > По общему признаку > С одинаковыми заливкой и обводкой": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find Fill & Stroke menu item" }],
    },
    "Выделение > По общему признаку > С одинаковым цветом заливки": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find Fill Color menu item" }],
    },
    "Выделение > По общему признаку > С одинаковой непрозрачностью": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find Opacity menu item" }],
    },
    "Выделение > По общему признаку > С одинаковым цветом обводки": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find Stroke Color menu item" }],
    },
    "Выделение > По общему признаку > С одинаковой толщиной обводки": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find Stroke Weight menu item" }],
    },
    "Выделение > По общему признаку > Стиль графики": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find Style menu item" }],
    },
    "Выделение > По общему признаку > Фигура": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find Live Shape menu item" }],
    },
    "Выделение > По общему признаку > Одинаковые образцы символа": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find Symbol Instance menu item" }],
    },
    "Выделение > По общему признаку > Последовательность связанных блоков": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find Link Block Series menu item" }],
    },
    "Выделение > По общему признаку > Семейство шрифтов": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find Text Font Family menu item" }],
    },
    "Выделение > По общему признаку > Семейство и стиль шрифтов": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find Text Font Family Style menu item" }],
    },
    "Выделение > По общему признаку > Семейство, стиль и размер шрифтов": {
      cmdType: "menu",
      cmdActions: [
        { type: "menu", value: "Find Text Font Family Style Size menu item" },
      ],
    },
    "Выделение > По общему признаку > Размер шрифта": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find Text Font Size menu item" }],
    },
    "Выделение > По общему признаку > Цвет заливки текста": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find Text Fill Color menu item" }],
    },
    "Выделение > По общему признаку > Цвет обводки текста": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find Text Stroke Color menu item" }],
    },
    "Выделение > По общему признаку > Цвет заливки и обводки текста": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Find Text Fill Stroke Color menu item" }],
    },
    "Выделение > По типу объектов > Все на этом же слое": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Selection Hat 3" }],
    },
    "Выделение > По типу объектов > Управляющие манипуляторы": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Selection Hat 1" }],
    },
    "Выделение > По типу объектов > Мазки для кисти из щетины": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Bristle Brush Strokes menu item" }],
    },
    "Выделение > По типу объектов > Мазки кисти": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Brush Strokes menu item" }],
    },
    "Выделение > По типу объектов > Обтравочные маски": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Clipping Masks menu item" }],
    },
    "Выделение > По типу объектов > Изолированные точки": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Stray Points menu item" }],
    },
    "Выделение > По типу объектов > Все объекты текста": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Text Objects menu item" }],
    },
    "Выделение > По типу объектов > Объекты текста из точки": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Point Text Objects menu item" }],
    },
    "Выделение > По типу объектов > Объекты текста в области": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Area Text Objects menu item" }],
    },
    "Выделение > Начать глобальное изменение": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "SmartEdit Menu Item" }],
    },
    "Выделение > Сохранить выделенную область…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Selection Hat 10" }],
    },
    "Выделение > Редактировать выделенную область…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Selection Hat 11" }],
    },
    "Эффект > Применить последний эффект": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Apply Last Effect" }],
    },
    "Эффект > Последний эффект": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Last Effect" }],
    },
    "Эффект > Параметры растровых эффектов в документе...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Rasterize Effect Setting" }],
    },
    "Эффект > 3D и материалы > Вытягивание и фаска...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Adobe Geometry3D Extrude" }],
    },
    "Эффект > 3D и материалы > Вращение…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Adobe Geometry3D Revolve" }],
    },
    "Эффект > 3D и материалы > Раздувание…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Adobe Geometry3D Inflate" }],
    },
    "Эффект > 3D и материалы > Поворот…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Adobe Geometry3D Rotate" }],
    },
    "Эффект > 3D и материалы > Материалы…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Adobe Geometry3D Materials" }],
    },
    "Эффект > 3D (классическое) > Вытягивание и фаска (классический)…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live 3DExtrude" }],
    },
    "Эффект > 3D (классическое) > Вращение (классическое)…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live 3DRevolve" }],
    },
    "Эффект > 3D (классическое) > Поворот (классический)…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live 3DRotate" }],
    },
    "Эффект > Преобразовать в фигуру> Прямоугольник…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Rectangle" }],
    },
    "Эффект > Преобразовать в фигуру> Прямоугольник со скругленными углами…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Rounded Rectangle" }],
    },
    "Эффект > Преобразовать в фигуру> Эллипс…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Ellipse" }],
    },
    "Эффект > Метки обрезки": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Trim Marks" }],
    },
    "Эффект > Исказить и трансформировать > Произвольное искажение...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Free Distort" }],
    },
    "Эффект > Исказить и трансформировать > Втягивание и раздувание...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pucker & Bloat" }],
    },
    "Эффект > Исказить и трансформировать > Огрубление...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Roughen" }],
    },
    "Эффект > Исказить и трансформировать > Трансформировать...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Transform" }],
    },
    "Эффект > Исказить и трансформировать > Помарки...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Scribble and Tweak" }],
    },
    "Эффект > Исказить и трансформировать > Скручивание...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Twist" }],
    },
    "Эффект > Исказить и трансформировать > Зигзаг...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Zig Zag" }],
    },
    "Эффект > Контур > Создать параллельный контур...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Offset Path" }],
    },
    "Эффект > Контур > Контурный объект": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Outline Object" }],
    },
    "Эффект > Контур > Преобразовать обводку в кривые": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Outline Stroke" }],
    },
    "Эффект > Обработка контуров > Добавить": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Add" }],
    },
    "Эффект > Обработка контуров > Пересечение": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Intersect" }],
    },
    "Эффект > Обработка контуров > Исключение": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Exclude" }],
    },
    "Эффект > Обработка контуров > Вычитание": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Subtract" }],
    },
    "Эффект > Обработка контуров > Минус нижний": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Minus Back" }],
    },
    "Эффект > Обработка контуров > Разделение": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Divide" }],
    },
    "Эффект > Обработка контуров > Обрезка": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Trim" }],
    },
    "Эффект > Обработка контуров > Объединение": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Merge" }],
    },
    "Эффект > Обработка контуров > Кадрировать": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Crop" }],
    },
    "Эффект > Обработка контуров > Контур": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Outline" }],
    },
    "Эффект > Обработка контуров > Жесткое смешивание": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Hard Mix" }],
    },
    "Эффект > Обработка контуров > Нежесткое смешивание...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Soft Mix" }],
    },
    "Эффект > Обработка контуров > Треппинг…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Pathfinder Trap" }],
    },
    "Эффект > Растрировать...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Rasterize" }],
    },
    "Эффект > Стилизация > Тень...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Adobe Drop Shadow" }],
    },
    "Эффект > Стилизация > Растушевка...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Feather" }],
    },
    "Эффект > Стилизация > Внутреннее свечение...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Inner Glow" }],
    },
    "Эффект > Стилизация > Внешнее свечение...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Outer Glow" }],
    },
    "Эффект > Стилизация > Скругленные углы...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Adobe Round Corners" }],
    },
    "Эффект > Стилизация > Каракули…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Scribble Fill" }],
    },
    "Эффект > Фильтры SVG > Применить SVG-фильтр...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live SVG Filters" }],
    },
    "Эффект > Фильтры SVG > Импортировать фильтр SVG...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "SVG Filter Import" }],
    },
    "Эффект > Деформация > Дуга…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Arc" }],
    },
    "Эффект > Деформация > Дуга вниз…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Arc Lower" }],
    },
    "Эффект > Деформация > Дуга вверх…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Arc Upper" }],
    },
    "Эффект > Деформация > Арка…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Arch" }],
    },
    "Эффект > Деформация > Выпуклость…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Bulge" }],
    },
    "Эффект > Деформация > Панцирь вниз…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Shell Lower" }],
    },
    "Эффект > Деформация > Панцирь вверх…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Shell Upper" }],
    },
    "Эффект > Деформация > Флаг…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Flag" }],
    },
    "Эффект > Деформация > Волна…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Wave" }],
    },
    "Эффект > Деформация > Рыба…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Fish" }],
    },
    "Эффект > Деформация > Подъем…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Rise" }],
    },
    "Эффект > Деформация > Рыбий глаз…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Fisheye" }],
    },
    "Эффект > Деформация > Раздувание…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Inflate" }],
    },
    "Эффект > Деформация > Сжатие…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Squeeze" }],
    },
    "Эффект > Деформация > Скручивание…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Deform Twist" }],
    },
    "Эффект > Галерея эффектов…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_GEfc" }],
    },
    "Эффект > Имитация > Цветные карандаши…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_ClrP" }],
    },
    "Эффект > Имитация > Аппликация…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Ct  " }],
    },
    "Эффект > Имитация > Сухая кисть…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_DryB" }],
    },
    "Эффект > Имитация > Зернистость пленки…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_FlmG" }],
    },
    "Эффект > Имитация > Фреска…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Frsc" }],
    },
    "Эффект > Имитация > Неоновый свет…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_NGlw" }],
    },
    "Эффект > Имитация > Масляная живопись…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_PntD" }],
    },
    "Эффект > Имитация > Шпатель…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_PltK" }],
    },
    "Эффект > Имитация > Целлофановая упаковка…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_PlsW" }],
    },
    "Эффект > Имитация > Очерченные края…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_PstE" }],
    },
    "Эффект > Имитация > Пастель…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_RghP" }],
    },
    "Эффект > Имитация > Растушевка…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_SmdS" }],
    },
    "Эффект > Имитация > Губка…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Spng" }],
    },
    "Эффект > Имитация > Рисование на обороте…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Undr" }],
    },
    "Эффект > Имитация > Акварель…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Wtrc" }],
    },
    "Эффект > Размытие > Размытие по Гауссу...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Adobe PSL Gaussian Blur" }],
    },
    "Эффект > Размытие > Радиальное размытие...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_RdlB" }],
    },
    "Эффект > Размытие > Умное размытие...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_SmrB" }],
    },
    "Эффект > Штрихи > Акцент на краях…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_AccE" }],
    },
    "Эффект > Штрихи > Наклонные штрихи…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_AngS" }],
    },
    "Эффект > Штрихи > Перекрестные штрихи…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Crsh" }],
    },
    "Эффект > Штрихи > Темные штрихи…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_DrkS" }],
    },
    "Эффект > Штрихи > Обводка…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_InkO" }],
    },
    "Эффект > Штрихи > Разбрызгивание…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Spt " }],
    },
    "Эффект > Штрихи > Аэрограф…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_SprS" }],
    },
    "Эффект > Штрихи > Суми-э…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Smie" }],
    },
    "Эффект > Искажение > Рассеянное свечение…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_DfsG" }],
    },
    "Эффект > Искажение > Стекло…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Gls " }],
    },
    "Эффект > Искажение > Океанские волны…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_OcnR" }],
    },
    "Эффект > Оформление > Цветные полутона…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_ClrH" }],
    },
    "Эффект > Оформление > Кристаллизация…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Crst" }],
    },
    "Эффект > Оформление > Меццо-тинто…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Mztn" }],
    },
    "Эффект > Оформление > Пуантилизм…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Pntl" }],
    },
    "Эффект > Эскиз > Рельеф…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_BsRl" }],
    },
    "Эффект > Эскиз > Мел и уголь…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_ChlC" }],
    },
    "Эффект > Эскиз > Уголь…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Chrc" }],
    },
    "Эффект > Эскиз > Хром…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Chrm" }],
    },
    "Эффект > Эскиз > Волшебный карандаш…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_CntC" }],
    },
    "Эффект > Эскиз > Тушь…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_GraP" }],
    },
    "Эффект > Эскиз > Полутоновый узор…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_HlfS" }],
    },
    "Эффект > Эскиз > Почтовая бумага…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_NtPr" }],
    },
    "Эффект > Эскиз > Ксерокопия…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Phtc" }],
    },
    "Эффект > Эскиз > Гипс…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Plst" }],
    },
    "Эффект > Эскиз > Ретикуляция…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Rtcl" }],
    },
    "Эффект > Эскиз > Линогравюра…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Stmp" }],
    },
    "Эффект > Эскиз > Рваные края…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_TrnE" }],
    },
    "Эффект > Эскиз > Мокрая бумага…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_WtrP" }],
    },
    "Эффект > Стилизация > Свечение краев…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_GlwE" }],
    },
    "Эффект > Текстура > Кракелюры…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Crql" }],
    },
    "Эффект > Текстура > Зерно…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Grn " }],
    },
    "Эффект > Текстура > Мозаичные фрагменты…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_MscT" }],
    },
    "Эффект > Текстура > Цветная плитка…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Ptch" }],
    },
    "Эффект > Текстура > Витраж…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_StnG" }],
    },
    "Эффект > Текстура > Текстуризатор…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Txtz" }],
    },
    "Эффект > Видео > Устранение чересстрочной развертки...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_Dntr" }],
    },
    "Эффект > Видео > Цвета NTSC": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live PSAdapter_plugin_NTSC" }],
    },
    "Просмотр > Контуры / Иллюстрация": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "preview" }],
    },
    "Просмотр > Просмотр с использованием ЦП / ГП": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "GPU Preview" }],
    },
    "Просмотр > Просмотр наложения цветов": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "ink" }],
    },
    "Просмотр > Просмотр в виде пикселов": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "raster" }],
    },
    "Просмотр > Параметры цветопробы > Рабочее пространство CMYK": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "proof-document" }],
    },
    "Просмотр > Параметры цветопробы > Ранняя версия Macintosh RGB (Gamma 1.8)": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "proof-mac-rgb" }],
    },
    "Просмотр > Параметры цветопробы > Стандартная палитра RGB (sRGB) для сети Интернет":
      {
        cmdType: "menu",
        cmdActions: [{ type: "menu", value: "proof-win-rgb" }],
      },
    "Просмотр > Параметры цветопробы > Палитра RGB монитора": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "proof-monitor-rgb" }],
    },
    "Просмотр > Параметры цветопробы > Дальтонизм - протанопия": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "proof-colorblindp" }],
    },
    "Просмотр > Параметры цветопробы > Дальтонизм - дейтеранопия": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "proof-colorblindd" }],
    },
    "Просмотр > Параметры цветопробы > Заказные параметры…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "proof-custom" }],
    },
    "Просмотр > Цветопроба": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "proofColors" }],
    },
    "Просмотр > Увеличение": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "zoomin" }],
    },
    "Просмотр > Уменьшение": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "zoomout" }],
    },
    "Просмотр > Подогнать монтажную область по размеру окна": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "fitin" }],
    },
    "Просмотр > Подогнать все по размеру окна": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "fitall" }],
    },
    "Просмотр > Показать / спрятать фрагменты": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Feedback Menu" }],
    },
    "Просмотр > Закрепить фрагменты": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AISlice Lock Menu" }],
    },
    "Просмотр > Показать / спрятать ограничительную рамку": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AI Bounding Box Toggle" }],
    },
    "Просмотр > Показать / спрятать сетку прозрачности": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "TransparencyGrid Menu Item" }],
    },
    "Просмотр > Реальный размер": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "actualsize" }],
    },
    "Просмотр > Показать / спрятать зазоры быстрых заливок": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Show Gaps Planet X" }],
    },
    "Просмотр > Показать / спрятать градиентный аннотатор": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Gradient Feedback" }],
    },
    "View > Show / Hide Corner Widget": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Live Corner Annotator" }],
    },
    "Просмотр > Показать / спрятать границы": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "edge" }],
    },
    "Просмотр > Быстрые направляющие": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Snapomatic on-off menu item" }],
    },
    "Просмотр > Сетка перспективы > Показать / скрыть сетку": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Show Perspective Grid" }],
    },
    "Просмотр > Сетка перспективы > Показать / скрыть линейки": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Show Ruler" }],
    },
    "Просмотр > Сетка перспективы > Привязать к сетке": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Snap to Grid" }],
    },
    "Просмотр > Сетка перспективы > Закрепить сетку": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Lock Perspective Grid" }],
    },
    "Просмотр > Сетка перспективы > Закрепить точку наблюдения": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Lock Station Point" }],
    },
    "Просмотр > Сетка перспективы > Определить сетку...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Define Perspective Grid" }],
    },
    "Просмотр > Сетка перспективы > Сохранить сетку как стиль...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Save Perspective Grid as Preset" }],
    },
    "Просмотр > Показать / скрыть монтажные области": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "artboard" }],
    },
    "Просмотр > Показать / спрятать разбиение для печати": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "pagetiling" }],
    },
    "Просмотр > Спрятать шаблон": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "showtemplate" }],
    },
    "Просмотр > Показать / скрыть линейки": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "ruler" }],
    },
    "Просмотр > Линейки > Сменить на общие линейки / монтажной области": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "rulerCoordinateSystem" }],
    },
    "Просмотр > Показать / скрыть линейки видео": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "videoruler" }],
    },
    "Просмотр > Показать / спрятать связи текстовых блоков": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "textthreads" }],
    },
    "Просмотр > Направляющие > Показать / спрятать направляющие": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "showguide" }],
    },
    "Просмотр > Направляющие > Закрепить направляющие": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "lockguide" }],
    },
    "Просмотр > Направляющие > Создать направляющие": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "makeguide" }],
    },
    "Просмотр > Направляющие > Освободить направляющие": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "releaseguide" }],
    },
    "Просмотр > Направляющие > Удалить направляющие": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "clearguide" }],
    },
    "Просмотр > Показать / спрятать сетку": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "showgrid" }],
    },
    "Просмотр > Выравнивать по сетке": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "snapgrid" }],
    },
    "Просмотр > Выравнивать по точкам": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "snappoint" }],
    },
    "Просмотр > Новый вид…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "newview" }],
    },
    "Просмотр > Редактировать виды…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "editview" }],
    },
    "Окно > Новое окно": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "newwindow" }],
    },
    "Окно > Упорядить > Каскадом": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "cascade" }],
    },
    "Окно > Упорядить > Мозаикой": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "tile" }],
    },
    "Окно > Упорядить > Плавающее в окне": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "floatInWindow" }],
    },
    "Окно > Упорядить > Все плавающие в окнах": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "floatAllInWindows" }],
    },
    "Окно > Упорядить > Объединить все окна": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "consolidateAllWindows" }],
    },
    "Окно > Восстановить рабочую среду": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Reset Workspace" }],
    },
    "Окно > Рабочая среда > Создать рабочую среду...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe New Workspace" }],
    },
    "Окно > Рабочая среда > Управление рабочими средами...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Manage Workspace" }],
    },
    "Окно > Поиск расширений на Exchange...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Browse Add-Ons Menu" }],
    },
    "Окно > Панель управления": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "drover control palette plugin" }],
    },
    "Окно > Панели инструментов > Дополнительные": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Advanced Toolbar Menu" }],
    },
    "Окно > Панели инструментов > Основные": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Basic Toolbar Menu" }],
    },
    "Окно > Панели инструментов > Новая панель инструментов...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "New Tools Panel" }],
    },
    "Окно > Панели инструментов > Управление панелями инструментов...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Manage Tools Panel" }],
    },
    "Окно > 3D и материалы": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe 3D Panel" }],
    },
    "Окно > Операции": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Action Palette" }],
    },
    "Окно > Выравнивание": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AdobeAlignObjects2" }],
    },
    "Окно > Оформление": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Style Palette" }],
    },
    "Окно > Монтажные области": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Artboard Palette" }],
    },
    "Окно > Экспорт ресурсов": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe SmartExport Panel Menu Item" }],
    },
    "Окно > Атрибуты": {
      cmdType: "menu",
      cmdActions: [
        { type: "menu", value: "internal palettes posing as plug-in menus-attributes" },
      ],
    },
    "Окно > Кисти": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe BrushManager Menu Item" }],
    },
    "Окно > Цвет": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Color Palette" }],
    },
    "Окно > Каталог цветов": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Harmony Palette" }],
    },
    "Окно > Комментарии": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Commenting Palette" }],
    },
    "Окно > Свойства CSS": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "CSS Menu Item" }],
    },
    "Окно > Информация о документе": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "DocInfo1" }],
    },
    "Окно > Просмотр результатов сведения": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Flattening Preview" }],
    },
    "Окно > Градиент": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Gradient Palette" }],
    },
    "Окно > Стили графики": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Style Palette" }],
    },
    "Окно > История": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe HistoryPanel Menu Item" }],
    },
    "Окно > Информация": {
      cmdType: "menu",
      cmdActions: [
        { type: "menu", value: "internal palettes posing as plug-in menus-info" },
      ],
    },
    "Окно > Слои": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AdobeLayerPalette1" }],
    },
    "Окно > Библиотеки": {
      cmdType: "menu",
      cmdActions: [
        {
          type: "menu",
          value: "Adobe CSXS Extension com.adobe.DesignLibraries.angularLibraries",
        },
      ],
    },
    "Окно > Связи": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe LinkPalette Menu Item" }],
    },
    "Окно > Волшебная палочка": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AI Magic Wand" }],
    },
    "Окно > Навигатор": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AdobeNavigator" }],
    },
    "Окно > Обработка контуров": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe PathfinderUI" }],
    },
    "Окно > Параметры узора": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Pattern Panel Toggle" }],
    },
    "Окно > Свойства": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Property Palette" }],
    },
    "Окно > Просмотр цветоделений": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Separation Preview Panel" }],
    },
    "Окно > Обводка": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Stroke Palette" }],
    },
    "Окно > Интерактивность SVG": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe SVG Interactivity Palette" }],
    },
    "Окно > Образцы": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Swatches Menu Item" }],
    },
    "Окно > Символы": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Symbol Palette" }],
    },
    "Окно > Трансформирование": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AdobeTransformObjects1" }],
    },
    "Окно > Прозрачность": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Transparency Palette Menu Item" }],
    },
    "Окно > Текст > Символ": {
      cmdType: "menu",
      cmdActions: [
        { type: "menu", value: "internal palettes posing as plug-in menus-character" },
      ],
    },
    "Окно > Текст > Стили символов": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Character Styles" }],
    },
    "Окно > Текст > Глифы": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "alternate glyph palette plugin 2" }],
    },
    "Окно > Текст > OpenType": {
      cmdType: "menu",
      cmdActions: [
        { type: "menu", value: "internal palettes posing as plug-in menus-opentype" },
      ],
    },
    "Окно > Текст > Абзац": {
      cmdType: "menu",
      cmdActions: [
        { type: "menu", value: "internal palettes posing as plug-in menus-paragraph" },
      ],
    },
    "Окно > Текст > Стили абзацев": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Paragraph Styles Palette" }],
    },
    "Окно > Текст > Табуляция": {
      cmdType: "menu",
      cmdActions: [
        { type: "menu", value: "internal palettes posing as plug-in menus-tab" },
      ],
    },
    "Окно > Переменные": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Variables Palette Menu Item" }],
    },
    "Окно > Журнал версий": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Version History File Menu Item" }],
    },
    "Окно > Библиотеки кистей > Другая библиотека...": {
      cmdType: "menu",
      cmdActions: [
        { type: "menu", value: "AdobeBrushMgrUI Other libraries menu item" },
      ],
    },
    "Окно > Библиотеки стилей графики > Другая библиотека...": {
      cmdType: "menu",
      cmdActions: [
        { type: "menu", value: "Adobe Art Style Plugin Other libraries menu item" },
      ],
    },
    "Окно > Библиотеки образцов > Другая библиотека...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AdobeSwatch_ Other libraries menu item" }],
    },
    "Окно > Библиотеки символов > Другая библиотека...": {
      cmdType: "menu",
      cmdActions: [
        {
          type: "menu",
          value: "Adobe Symbol Palette Plugin Other libraries menu item",
        },
      ],
    },
    "Справка > Справка программы Illustrator...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "helpcontent" }],
    },
    "Справка > Сообщество службы поддержки": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "supportCommunity" }],
    },
    "Справка > Сообщение об ошибке/запрос на добавление новых функций...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "wishform" }],
    },
    "Справка > Информация о системе…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "System Info" }],
    },
    "Палитра > Операции > Пакетная обработка…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Actions Batch" }],
    },
    "Палитра > Оформление > Добавить новую заливку": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe New Fill Shortcut" }],
    },
    "Палитра > Оформление > Добавить новую обводку": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe New Stroke Shortcut" }],
    },
    "Палитра > Стили графики > Новый стиль графики": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe New Style Shortcut" }],
    },
    "Палитра > Слои > Создать новый слой": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AdobeLayerPalette2" }],
    },
    "Палитра > Слои > Создать новый с параметрами...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "AdobeLayerPalette3" }],
    },
    "Палитра > Связи > Обновить связь": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe Update Link Shortcut" }],
    },
    "Палитра > Образцы > Новый образец": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe New Swatch Shortcut Menu" }],
    },
    "Палитра > Символы > Новый символ": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "Adobe New Symbol Shortcut" }],
    },
    "О программе Illustrator…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "about" }],
    },
    "Установки > Основные…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "preference" }],
    },
    "Установки > Отображение выделения и опорных точек…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "selectPref" }],
    },
    "Установки > Текст…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "keyboardPref" }],
    },
    "Установки > Единицы измерения…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "unitundoPref" }],
    },
    "Установки > Направляющие и сетка…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "guidegridPref" }],
    },
    "Установки > Быстрые направляющие…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "snapPref" }],
    },
    "Установки > Фрагменты…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "slicePref" }],
    },
    "Установки > Расстановка переносов…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "hyphenPref" }],
    },
    "Установки > Внешние модули и рабочие диски…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "pluginPref" }],
    },
    "Установки > Интерфейс пользователя…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "UIPref" }],
    },
    "Установки > Производительность…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "GPUPerformancePref" }],
    },
    "Установки > Обработка файлов…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "FilePref" }],
    },
    "Установки > Обработка буфера…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "ClipboardPref" }],
    },
    "Установки > Воспроизведение черного цвета...": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "BlackPref" }],
    },
    "Установки > Устройства…": {
      cmdType: "menu",
      cmdActions: [{ type: "menu", value: "DevicesPref" }],
    },
  };
}
