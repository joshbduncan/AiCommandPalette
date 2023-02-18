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
  var _version = "0.5.0";
  var _copyright = "Copyright 2022 Josh Duncan";
  var _website = "joshbduncan.com";
  var _github = "https://github.com/joshbduncan";

  // JAVASCRIPT POLYFILLS

  //ARRAY POLYFILLS

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

  // OBJECT POLYFILLS

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

  // STRING POLYFILLS

  /**
   * String.prototype.trim() polyfill
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#Polyfill
   */
  if (!String.prototype.trim) {
    String.prototype.trim = function () {
      return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
    };
  }
  // CONFIGURATION

  // ENVIRONMENT VARIABLES

  var aiVersion = parseFloat(app.version);
  var locale = $.locale;
  var os = $.os;
  var sysOS = /mac/i.test(os) ? "mac" : "win";
  var windowsFlickerFix = sysOS === "win" && aiVersion < 26.4 ? true : false;

  // DEVELOPMENT SETTINGS

  // localization testing
  // $.locale = false;
  // $.locale = "de";
  // $.locale = "ru";

  // DIALOG SETTINGS

  var paletteWidth = 600;
  var visibleListItems = 9;

  // MISCELLANEOUS SETTINGS

  var namedObjectLimit = 2000;

  //USER SETTINGS

  var settingsFolderName = "JBD";
  var settingsFolder = setupFolderObject(Folder.userData + "/" + settingsFolderName);
  var settingsFileName = "AiCommandPaletteSettings.json";

  var settings = {};
  settings.folder = function () {
    return settingsFolder;
  };
  settings.file = function () {
    var folder = this.folder();
    var file = setupFileObject(folder, settingsFileName);
    return file;
  };
  settings.load = function () {
    var file = this.file();
    if (file.exists) {
      var settings = readJSONData(file);
      if (settings != {}) {
        for (var prop in settings) {
          for (var subProp in settings[prop]) {
            data[prop][subProp] = settings[prop][subProp];
          }
        }
      }
    }
  };
  settings.save = function () {
    var file = this.file();
    var obj = {
      commands: {
        script: data.commands.script,
        workflow: data.commands.workflow,
      },
      settings: {
        hidden: data.settings.hidden,
        name: _title,
        version: _version,
        os: os,
        locale: locale,
        aiVersion: aiVersion,
      },
    };
    writeJSONData(obj, file);
  };
  settings.reveal = function () {
    folder = this.folder();
    folder.execute();
  };
  /**
   *
   * @returns Make sure at least one document is open for certain built-in commands.
   */
  function activeDocument() {
    if (app.documents.length < 1) {
      alert(localize(locStrings.no_active_document));
      return false;
    }
    return true;
  }

  /**
   * Get every font used inside of an the Ai document.
   * @param {Object} doc Ai document.
   */
  function getDocumentFonts(doc) {
    var fonts = [];
    for (var i = 0; i < doc.textFrames.length; i++) {
      for (var j = 0; j < doc.textFrames[i].textRanges.length; j++) {
        if (!fonts.includes(doc.textFrames[i].textRanges[j].textFont)) {
          fonts.push(doc.textFrames[i].textRanges[j].textFont);
        }
      }
    }
    return fonts;
  }

  /**
   * Convert Ai points unit to another api ruler constant.
   * https://ai-scripting.docsforadobe.dev/jsobjref/scripting-constants.html#jsobjref-scripting-constants-rulerunits
   * @param   {Number} points Point value to convert.
   * @param   {String} unit   RulerUnit to convert `points` to.
   * @returns {Number}        Converted number.
   */
  function convertPointsTo(points, unit) {
    var conversions = {
      Centimeters: 28.346,
      Qs: 0.709,
      Inches: 72.0,
      Pixels: 1.0,
      Millimeters: 2.834645,
      Unknown: 1.0,
      Picas: 12.0,
      Points: 1.0,
    };
    return points / conversions[unit];
  }

  /**
   * Return the names of each object in an Ai collection object.
   * https://ai-scripting.docsforadobe.dev/scripting/workingWithObjects.html?highlight=collection#collection-objects
   * @param   {Object} o Ai collection object.
   * @returns {Array}    Array containing each object name.
   */
  function getCollectionObjectNames(c) {
    names = [];
    var s;
    if (c.length > 0) {
      for (var i = 0; i < c.length; i++) {
        if (c.typename == "PlacedItems" || c.typename == "RasterItems") {
          s = "";
          if (
            c[i].typename == "PlacedItem" ||
            (c[i].typename == "RasterItem" && c[i].embedded == true)
          )
            s += c[i].file.name;
          if (c[i].file.fsName) {
            s += " (path: " + c[i].file.fsName.replace(c[i].file.name, "") + ")";
          } else {
            s += " (path: ?)";
          }
          names.push(s);
        } else if (c.typename == "Spots") {
          if (c[i].name != "[Registration]") {
            names.push(c[i].name);
          }
        } else {
          names.push(c[i].name);
        }
      }
    }
    return names;
  }

  /**************************************************
DIALOG HELPER FUNCTIONS
**************************************************/

  function filterCommands(
    commands,
    queryFilter,
    visibleFilter,
    showHidden,
    hideCommands
  ) {
    var query = [];
    var visible = [];
    var command;
    for (var i = 0; i < commands.length; i++) {
      command = commands[i];
      commandData = commandsData[command];
      // make sure Ai version meets command requirements
      if (!versionCheck(command)) continue;
      // skip any hidden commands
      if (!showHidden && data.settings.hidden.includes(command)) continue;
      // skip any specific commands name in hideSpecificCommands
      if (hideCommands.includes(command)) continue;
      // then check to see if the command should be filtered out
      if (!queryFilter.includes(commandsData[command].type)) query.push(command);
      if (!visibleFilter.includes(commandsData[command].type)) visible.push(command);
    }
    return {
      query: query,
      visible: visible,
    };
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
        if (word != "" && arr[i].match("(?:^|\\s)(" + word + ")", "gi") != null)
          score++;
      }
      if (score > 0) scores[arr[i]] = score;
    }
    return sortKeysByValue(scores, "score", "name");
  }

  /**
   * Score array items based on regex string match.
   * @param   {String} q    String to search for.
   * @param   {Array}  arr  Array of object to search through.
   * @param   {String} prop Object property to match on.
   * @returns {Array}       Matching items sorted by score.
   */
  function scoreObjectMatches(q, arr, prop) {
    var word;
    var words = q.split(" ");
    var matches = [];
    for (var i = 0; i < arr.length; i++) {
      var score = 0;
      for (var n = 0; n < words.length; n++) {
        word = words[n];
        if (!arr[i].hasOwnProperty(prop)) continue;
        if (word != "" && arr[i][prop].match("(?:^|\\s)(" + word + ")", "gi") != null)
          score++;
      }
      if (score > 0) {
        arr[i].score = score;
        matches.push(arr[i]);
      }
    }
    // sort all matches by score
    matches.sort(function (a, b) {
      return a.score.localeCompare(b.score);
    });
    return matches;
  }

  function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      var result = a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
      return result * sortOrder;
    };
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
      var f = setupFileObject(settingsFolder, "SimulateKeypress.vbs");
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
  // AI COMMAND PALETTE OPERATIONS

  /**
   * Execute script actions.
   * @param {Object} action Script action to execute.
   */
  function scriptAction(action) {
    var write = true;
    switch (action) {
      case "settings":
        paletteSettings();
        write = false;
        break;
      case "about":
        about();
        write = false;
        break;
      case "buildWorkflow":
        buildWorkflow();
        break;
      case "editWorkflow":
        editWorkflow();
        break;
      case "loadScript":
        loadScripts();
        break;
      case "runAction":
        runAction();
        break;
      case "hideCommand":
        hideCommand();
        break;
      case "unhideCommand":
        unhideCommand();
        break;
      case "deleteCommand":
        deleteCommand();
        break;
      case "revealPrefFile":
        settings.reveal();
        write = false;
        break;
      default:
        alert(localize(locStrings.cd_invalid, action));
    }
    if (write) settings.save();
  }

  /**
   * Execute built-in actions.
   * @param {Object} action Built-in action to execute.
   */
  function builtinAction(action) {
    switch (action) {
      case "documentReport":
        if (activeDocument) documentReport();
        break;
      case "exportVariables":
        if (activeDocument) exportVariables();
        break;
      case "goToArtboard":
        if (activeDocument) goToArtboard();
        break;
      case "goToDocument":
        if (app.documents.length > 1) {
          goToOpenDocument();
        }
        break;
      case "goToNamedObject":
        if (activeDocument) goToNamedObject();
        break;
      case "imageCapture":
        imageCapture();
        break;
      case "redrawWindows":
        app.redraw();
        break;
      case "revealActiveDocument":
        if (activeDocument) {
          if (app.activeDocument.path.fsName) {
            var fp = new Folder(app.activeDocument.path.fsName);
            fp.execute();
          } else {
            alert(localize(locStrings.active_document_not_saved));
          }
        }
        break;
      default:
        alert(localize(locStrings.cd_invalid, action));
    }
  }

  /** Ai Command Palette configuration commands. */
  function paletteSettings() {
    var result = commandPalette(
      (commands = allCommands),
      (showHidden = false),
      (queryFilter = [
        "builtin",
        "script",
        "workflow",
        "defaults",
        "action",
        "menu",
        "tool",
      ]),
      (visibleFilter = []),
      (title = localize(locStrings.cp_config)),
      (bounds = [0, 0, paletteWidth, 182]),
      (multiselect = false)
    );
    if (result) processCommand(result);
  }

  /** Ai Command Palette About Dialog. */
  function about() {
    var win = new Window("dialog");
    win.text = localize(locStrings.about);
    win.alignChildren = "fill";

    // script info
    var pAbout = win.add("panel");
    pAbout.margins = 20;
    pAbout.alignChildren = "fill";
    pAbout.add("statictext", [0, 0, 500, 100], localize(locStrings.description), {
      multiline: true,
    });

    var links = pAbout.add("group");
    links.orientation = "column";
    links.alignChildren = ["center", "center"];
    links.add("statictext", undefined, localize(locStrings.version, _version));
    links.add("statictext", undefined, localize(locStrings.copyright));
    var githubText =
      localize(locStrings.github) + ": https://github.com/joshbduncan/AiCommandPalette";
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

  /** Document Info Dialog */
  function documentReport() {
    // setup the basic document info
    var rulerUnits = app.activeDocument.rulerUnits.toString().split(".").pop();
    var fileInfo =
      "File Information:\n-----\nFile: " +
      app.activeDocument.name +
      "\nPath: " +
      (app.activeDocument.path.fsName ? app.activeDocument.path.fsName : "None") +
      "\nColor Space: " +
      app.activeDocument.documentColorSpace.toString().split(".").pop() +
      "\nWidth: " +
      convertPointsTo(app.activeDocument.width, rulerUnits) +
      " " +
      rulerUnits +
      "\nHeight: " +
      convertPointsTo(app.activeDocument.height, rulerUnits) +
      " " +
      rulerUnits;

    // generate all optional report information (all included by default)
    // TODO: localize options
    var reportOptions = {
      Artboards: {
        str: getCollectionObjectNames(app.activeDocument.artboards)
          .toString()
          .replace(/,/g, "\n"),
        active: true,
      },
      "Embedded Items": {
        str: getCollectionObjectNames(app.activeDocument.rasterItems)
          .toString()
          .replace(/,/g, "\n"),
        active: true,
      },
      Fonts: {
        str: getCollectionObjectNames(getDocumentFonts(app.activeDocument))
          .toString()
          .replace(/,/g, "\n"),
        active: true,
      },
      Layers: {
        str: getCollectionObjectNames(app.activeDocument.layers)
          .toString()
          .replace(/,/g, "\n"),
        active: true,
      },
      "Placed Items": {
        str: getCollectionObjectNames(app.activeDocument.placedItems)
          .toString()
          .replace(/,/g, "\n"),
        active: true,
      },
      "Spot Colors": {
        str: getCollectionObjectNames(app.activeDocument.spots)
          .toString()
          .replace(/,/g, "\n"),
        active: true,
      },
    };

    // build the report from the selected options (active = true)
    function buildReport() {
      var infoString = "Ai Document Information\n\n" + fileInfo;
      for (var p in reportOptions) {
        if (reportOptions[p].active && reportOptions[p].str) {
          infoString += "\n\n" + p + "\n-----\n" + reportOptions[p].str;
        }
      }
      infoString += "\n\nFile Created: " + new Date();
      return infoString;
    }

    // setup the dialog
    var win = new Window("dialog");
    win.text = localize(locStrings.document_report);
    win.orientation = "column";
    win.alignChildren = ["center", "top"];
    win.alignChildren = "fill";

    // panel - options
    var pOptions = win.add("panel", undefined, "Include?");
    pOptions.orientation = "row";
    pOptions.margins = 20;

    // add checkboxes for each report option
    var cb;
    for (var p in reportOptions) {
      cb = pOptions.add("checkbox", undefined, p);
      if (reportOptions[p].str) {
        cb.value = true;
        // add onClick function for each cb to update rebuild report
        cb.onClick = function () {
          if (this.value) {
            reportOptions[this.text].active = true;
          } else {
            reportOptions[this.text].active = false;
          }
          info.text = buildReport();
        };
      } else {
        cb.value = false;
        cb.enabled = false;
      }
    }

    // script info
    var info = win.add("edittext", [0, 0, 400, 400], buildReport(), {
      multiline: true,
      scrollable: true,
      readonly: true,
    }); // TODO: localize

    // window buttons
    var winButtons = win.add("group");
    winButtons.orientation = "row";
    winButtons.alignChildren = ["center", "center"];
    var saveInfo = winButtons.add("button", undefined, localize(locStrings.save));
    saveInfo.preferredSize.width = 100;
    var close = winButtons.add("button", undefined, localize(locStrings.close), {
      name: "ok",
    });
    close.preferredSize.width = 100;

    // save document info to selected file
    saveInfo.onClick = function () {
      var f = File.saveDialog();
      if (f) {
        try {
          f.encoding = "UTF-8";
          f.open("w");
          f.write(infoString);
          f.close();
        } catch (e) {
          alert(localize(locStrings.fl_error_writing, f));
        }
        if (f.exists) alert(localize(locStrings.file_saved, f.fsName));
      }
    };
    // show the info dialog
    win.show();
  }

  /**
   * Export the active artboard as a png file using the api `Document.imageCapture()` method.
   * https://ai-scripting.docsforadobe.dev/jsobjref/Document.html?#document-imagecapture
   */
  function imageCapture() {
    if (activeDocument) {
      var f = File.saveDialog();
      if (f) {
        try {
          app.activeDocument.imageCapture(f);
        } catch (e) {
          alert(localize(locStrings.fl_error_writing, f));
        }
        // if chosen file name doesn't end in ".png" add the
        // correct extension so they captured file open correctly
        if (f.name.indexOf(".png") < f.name.length - 4)
          f.rename(f.name.toString() + ".png");
        if (f.exists) alert(localize(locStrings.file_saved, f.fsName));
      }
    }
  }

  /**
   *
   * https://ai-scripting.docsforadobe.dev/jsobjref/Document.html#document-exportvariables
   */
  function exportVariables() {
    if (app.activeDocument.variables.length > 0) {
      var dp = new Folder(app.activeDocument.path.fsName);
      var fp = dp.selectDlg("Choose Save Location");
      if (fp) {
        try {
          var f = new File(fp + "/" + "Variables.xml");
          app.activeDocument.exportVariables(f);
        } catch (e) {
          alert(localize(locStrings.fl_error_writing, f));
        }
        if (f.exists) alert(localize(locStrings.file_saved, f.fsName));
      }
    } else {
      alert(localize(locStrings.no_document_variables));
    }
  }

  /** Load external scripts into Ai Command Palette. */
  function loadScripts() {
    var files = loadFileTypes(
      localize(locStrings.cp_config_load_scripts),
      true,
      ".jsx$|.js$"
    );
    if (files.length > 0) {
      var f, key, fname;
      for (var i = 0; i < files.length; i++) {
        f = files[i];
        fname = decodeURI(f.name);
        key = localize(locStrings.script) + ": " + fname;
        if (data.commands.script.hasOwnProperty(key)) {
          if (
            !Window.confirm(
              localize(locStrings.sc_already_loaded),
              "noAsDflt",
              localize(locStrings.sc_already_loaded_title)
            )
          )
            continue;
        }
        try {
          data.commands.script[key] = { name: fname, type: "script", path: f.fsName };
        } catch (e) {
          alert(localize(locStrings.sc_error_loading, f.fsName));
        }
      }
    } else {
      alert(localize(locStrings.sc_none_selected));
    }
  }

  /** Hide commands from Ai Command Palette. */
  function hideCommand() {
    var result = commandPalette(
      (commands = allCommands),
      (showHidden = false),
      (queryFilter = ["config", "defaults"]),
      (visibleFilter = []),
      (title = localize(locStrings.cd_hide_select)),
      (bounds = [0, 0, paletteWidth, 182]),
      (multiselect = true)
    );
    if (result) {
      for (var i = 0; i < result.length; i++) data.settings.hidden.push(result[i].text);
    }
  }

  /** Unhide hidden commands. */
  function unhideCommand() {
    if (data.settings.hidden.length > 0) {
      var result = commandPalette(
        (commands = data.settings.hidden),
        (showHidden = true),
        (queryFilter = []),
        (visibleFilter = []),
        (title = localize(locStrings.cd_reveal_menu_select)),
        (bounds = [0, 0, paletteWidth, 182]),
        (multiselect = true)
      );
      if (result) {
        for (var i = 0; i < result.length; i++) {
          for (var n = 0; n < data.settings.hidden.length; n++) {
            if (result[i].text == data.settings.hidden[n]) {
              data.settings.hidden.splice(n, 1);
            }
          }
        }
      }
    } else {
      alert(localize(logStrings.cd_none_reveal));
    }
  }

  /** Delete commands from Ai Command Palette. */
  function deleteCommand() {
    var result = commandPalette(
      (commands = allCommands),
      (showHidden = true),
      (queryFilter = ["action", "builtin", "config", "defaults", "menu", "tool"]),
      (visibleFilter = []),
      (title = localize(locStrings.cd_delete_select)),
      (bounds = [0, 0, paletteWidth, 182]),
      (multiselect = true)
    );
    if (result) {
      if (
        Window.confirm(
          localize(locStrings.cd_delete_confirm, result.join("\n")),
          "noAsDflt",
          localize(locStrings.cd_delete_confirm_title)
        )
      ) {
        var command, type;
        for (var i = 0; i < result.length; i++) {
          command = result[i].text;
          type = commandsData[command].type;
          try {
            delete data.commands[type][command];
          } catch (e) {
            alert(localize(locStrings.cd_error_delete, command));
          }
        }
      }
    }
  }

  // BUILT-IN COMMANDS

  /** Present a command palette with all open documents and open the chosen one. */
  function goToOpenDocument() {
    var docs = [];
    for (var i = 0; i < app.documents.length; i++) {
      if (app.documents[i] != app.activeDocument) docs.push(app.documents[i]);
    }
    var item = goToPalette(
      (commands = docs),
      (title = localize(locStrings["go_to_open_document"])),
      (bounds = [0, 0, paletteWidth, 182])
    );
    if (item) {
      item.activate();
    }
  }

  /** Present a command palette with all artboards and zoom to the chosen one. */
  function goToArtboard() {
    var artboards = [];
    for (var i = 0; i < app.activeDocument.artboards.length; i++) {
      artboards.push(app.activeDocument.artboards[i]);
    }
    var item = goToPalette(
      (commands = artboards),
      (title = localize(locStrings["go_to_artboard"])),
      (bounds = [0, 0, paletteWidth, 182])
    );
    // FIXME: if two artboards have the same name it will select the first that matches
    if (item) {
      var ab;
      for (var i = 0; i < app.activeDocument.artboards.length; i++) {
        ab = app.activeDocument.artboards[i];
        if (ab.name == item.name) {
          app.activeDocument.artboards.setActiveArtboardIndex(i);
          app.executeMenuCommand("fitin");
          break;
        }
      }
    }
  }

  /** Present a command palette with all named objects and zoom to and select the chosen one. */
  function goToNamedObject() {
    if (app.activeDocument.pageItems.length > namedObjectLimit)
      alert(
        localize(
          locStrings.go_to_named_object_limit,
          app.activeDocument.pageItems.length
        )
      );
    var namedObjects = [];
    var item;
    for (var i = 0; i < app.activeDocument.pageItems.length; i++) {
      item = app.activeDocument.pageItems[i];
      if (
        item.name ||
        item.name.length ||
        item.typename == "PlacedItem" ||
        item.typename == "SymbolItem"
      )
        namedObjects.push(item);
    }
    if (namedObjects.length) {
      var selectedObject = goToPalette(
        (commands = namedObjects),
        (title = localize(locStrings["goto_named_object"])),
        (bounds = [0, 0, paletteWidth, 182])
      );
      if (selectedObject) {
        app.activeDocument.selection = null;
        selectedObject.selected = true;

        // reset zoom for current document
        app.activeDocument.views[0].zoom = 1;

        // get screen information
        var screenBounds = app.activeDocument.views[0].bounds;
        var screenW = screenBounds[2] - screenBounds[0];
        var screenH = screenBounds[1] - screenBounds[3];

        // get the (true) visible bounds of the returned object
        var bounds = selectedObject.visibleBounds;
        var selectedObjectW = bounds[2] - bounds[0];
        var selectedObjectH = bounds[1] - bounds[3];
        var selectedObjectCX = bounds[0] + selectedObjectW / 2;
        var selectedObjectCY = bounds[1] - selectedObjectH / 2;

        // reset the current view to center of selected object
        doc.views[0].centerPoint = [selectedObjectCX, selectedObjectCY];

        // calculate new zoom ratio to fit view to selected object
        var zoomRatio;
        if (selectedObjectW * (screenH / screenW) >= selectedObjectH) {
          zoomRatio = screenW / selectedObjectW;
        } else {
          zoomRatio = screenH / selectedObjectH;
        }

        // set zoom to fit selected object plus a bit of padding
        var padding = 0.9;
        doc.views[0].zoom = zoomRatio * padding;
      }
    } else {
      alert(localize(locStrings.go_to_named_object_no_objects));
    }
  }
  // ALL BUILT DATA FROM PYTHON SCRIPT

  var locStrings = {
    about: { en: "About", de: "Über Kurzbefehle …", ru: "О скрипте" },
    ac_error_execution: {
      en: "Error executing action:\n%1\n\n%2",
      de: "Fehler beim Ausführen der Aktion:\n%1\n\n%2",
      ru: "Ошибка запуска операции:\n%1\n\n%2",
    },
    active_document_not_saved: {
      en: "Active document not yet saved to the file system.",
      de: "",
      ru: "",
    },
    cancel: { en: "Cancel", de: "Abbrechen", ru: "Отмена" },
    cd_all: {
      en: "All Built-In Menu Commands",
      de: "Alle integrierten Menübefehle",
      ru: "Стандартные команды меню",
    },
    cd_delete_confirm: {
      en: "Delete Commands?\nDeleted commands will longer work in any workflows you previously created where they were used as a step.\n\n%1",
      de: "Befehle löschen?\nGelöschte Befehle werden in bestehenden Arbeitsabläufen nicht mehr funktionieren.\n\n%1",
      ru: "Удалить команду?\nУдаленные команды больше не будут работать в любых созданных наборах, где они использовались\n\n%1",
    },
    cd_delete_confirm_title: {
      en: "Confirm Commands To Delete",
      de: "Bestätigen Sie die zu löschenden Befehle.",
      ru: "Подтвердить удаление команд",
    },
    cd_delete_select: {
      en: "Select Menu Commands To Delete",
      de: "Wählen Sie die zu löschenden Menübefehle aus.",
      ru: "Выбрать команды меню для удаления",
    },
    cd_error_delete: {
      en: "Command couldn't be deleted.\n%1",
      de: "Befehl konnte nicht gelöscht werden.\n%1",
      ru: "Команда не может быть удалена\n%1",
    },
    cd_error_executing: {
      en: "Error executing command:\n%1\n\n%2",
      de: "Fehler beim Ausführen des Befehls:\n%1\n\n%2",
      ru: "Ошибка запуска команды:\n%1\n\n%2",
    },
    cd_helptip: {
      en: "Double-click a command to add it as a workflow step below.",
      de: "Doppelklicken Sie auf einen Befehl, um ihn unten als benutzerdefinierten Schritt hinzuzufügen.",
      ru: "Нажмите дважды на команду, чтобы добавить ее как шаг набора",
    },
    cd_hide_confirm_title: {
      en: "Confirm Commands To Hide",
      de: "Auszublendende Befehle bestätigen",
      ru: "Подтвердить скрытие команд",
    },
    cd_hide_select: {
      en: "Select Menu Commands To Hide",
      de: "Wählen Sie die auszublendenden Menübefehle aus.",
      ru: "Выбрать команды меню для скрытия",
    },
    cd_invalid: {
      en: "Invalid command type:\n%1",
      de: "Ungültiger Befehlstyp:\n%1",
      ru: "Неправильный тип:\n%1",
    },
    cd_none_delete: {
      en: "There are no commands to delete.",
      de: "Es gibt keine Befehle zum Löschen.",
      ru: "Нет команд для удаления",
    },
    cd_none_hide: {
      en: "There are no commands to hide.",
      de: "Es gibt keine Befehle zum Ausblenden.",
      ru: "Нет команд для скрытия",
    },
    cd_none_reveal: {
      en: "There are no hidden commands to reveal.",
      de: "Keine verborgenen Befehle vorhanden.",
      ru: "Нет скрытых команд",
    },
    cd_q_helptip: {
      en: "Search for commands, actions, and loaded scripts.",
      de: "Befehle, Aktionen und geladene Skripte suchen.",
      ru: "Поиск команд, операций и загруженных скриптов",
    },
    cd_reveal_confirm: {
      en: "Unhide Commands?\n%1",
      de: "Verborgene Befehle anzeigen?\n%1",
      ru: "Показать скрытые команды?\n%1",
    },
    cd_reveal_confirm_title: {
      en: "Confirm Commands To Unhide",
      de: "Die ausgewählten Befehle anzeigen?",
      ru: "Подтвердить показ команд",
    },
    cd_reveal_menu_select: {
      en: "Select Hidden Menu Commands To Unhide",
      de: "Wählen Sie die ausgeblendeten Menübefehle aus, die angezeigt werden sollen.",
      ru: "Выберите скрытые команды для показа",
    },
    cd_revealed_total: {
      en: "Total hidden commands revealed:\n%1",
      de: "Anzahl der verborgenen Befehle, die wieder angezeigt werden:\n%1",
      ru: "Показано скрытых команд:\n%1",
    },
    cd_search_for: {
      en: "Search for commands, actions, and loaded scripts.",
      de: "Befehle, Aktionen und geladene Skripte suchen.",
      ru: "Поиск команд, операций и загруженных скриптов",
    },
    close: { en: "Close", de: "Schließen", ru: "Закрывать" },
    copyright: { en: "Copyright 2022 Josh Duncan", de: "", ru: "" },
    cp_config: {
      en: "Palette Settings and Configuration",
      de: "Paletteneinstellungen und -konfiguration",
      ru: "Настройка и конфигурация панели",
    },
    cp_q_helptip: {
      en: "Search for commands, actions, and loaded scripts.",
      de: "Befehle, Aktionen und geladene Skripte suchen.",
      ru: "Поиск команд, операций и загруженных скриптов",
    },
    description: {
      en: "Boost your Adobe Illustrator efficiency with quick access to most menu commands and tools, all of your actions, and any scripts right from your keyboard. And, with custom workflows, you can combine multiple commands, actions, and scripts to get things done in your own way. Replace repetitive tasks with workflows and boost your productivity.",
      de: "Steigern Sie Ihre Effizienz in Adobe Illustrator mit schnellem Zugriff auf die meisten Menübefehle und Werkzeuge sowie alle Aktionen und Skripte, die direkt über die Tastatur ausgeführt werden können. Mit benutzerdefinierten Arbeitsabläufen können Sie mehrere Befehle, Aktionen und Skripte kombinieren. Erledigen Sie wiederkehrende Aufgaben mit Arbeitsabläufen und steigern Sie Ihre Produktivität.",
      ru: "Повысьте скорость работы в Adobe Illustrator благодаря быстрому доступу к большинству команд меню, инструментам, всем операциям и любым загруженным скриптам прямо с клавиатуры. А пользовательские наборы позволяют комбинировать несколько команд, операций и скриптов. Замените повторяющиеся задачи наборами команд и повысьте свою производительность.",
    },
    document_report: { en: "Active Document Report", de: "", ru: "" },
    file_saved: { en: "File Saved:\n%1", de: "", ru: "" },
    fl_error_loading: {
      en: "Error loading file:\n%1",
      de: "Fehler beim Laden der Datei:\n%1",
      ru: "Ошибка загрузки файла:\n%1",
    },
    fl_error_writing: {
      en: "Error writing file:\n%1",
      de: "Fehler beim Schreiben der Datei:\n%1",
      ru: "Ошибка записи файла:\n%1",
    },
    github: {
      en: "Click here to learn more",
      de: "Klicken Sie hier für weitere Informationen",
      ru: "Нажмите, чтобы узнать больше",
    },
    go_to_artboard: {
      en: "Go To Artboard",
      de: "Gehen Sie zur Zeichenfläche",
      ru: "Перейти к монтажной области",
    },
    go_to_open_document: { en: "Go To Open Document", de: "", ru: "" },
    go_to_named_object: {
      en: "Go To Named Object",
      de: "Gehen Sie zum benannten Objekt",
      ru: "Перейти к именованному объекту",
    },
    go_to_named_object_limit: {
      en: "Attention:\nThis document contains a lot of page items (%1). Please be patient while they load.",
      de: "",
      ru: "",
    },
    go_to_named_object_no_objects: { en: "No named page items found.", de: "", ru: "" },
    no_active_document: { en: "No active documents.", de: "", ru: "" },
    no_document_variables: { en: "No document variables.", de: "", ru: "" },
    save: { en: "Save", de: "Speichern", ru: "Сохранять" },
    sc_already_loaded: {
      en: "Script already loaded.\nWould you like to replace the previous script with the new one?",
      de: "Skript bereits geladen.\nMöchten Sie es ersetzen?",
      ru: "Скрипт уже загружен\nХотите его заменить?",
    },
    sc_already_loaded_title: {
      en: "Script Load Conflict",
      de: "Skriptladekonflikt",
      ru: "Проблема загрузки скрипта",
    },
    sc_error_execution: {
      en: "Error executing script:\n%1\n\n%2",
      de: "Fehler beim Ausführen des Skripts:\n%1\n\n%2",
      ru: "Ошибка запуска скрипта:\n%1\n\n%2",
    },
    sc_error_exists: {
      en: "Script no longer exists at original path. Try reloading.\n%1",
      de: "Skript existiert nicht mehr am ursprünglichen Ort.\n%1",
      ru: "Скрипт не найден в указанной папке\n%1",
    },
    sc_error_loading: {
      en: "Error loading script:\n%1",
      de: "Fehler beim Laden des Skripts:\n%1",
      ru: "Ошибка загрузки скрипта:\n%1",
    },
    sc_none_selected: {
      en: "No script files selected.\nMust be JavaScript '.js' or '.jsx' files.",
      de: "Keine Skriptdateien ausgewählt.\nEs müssen JavaScript-'.js'- oder '.jsx'-Dateien sein.",
      ru: "Не выбраны скрипты\nФайлы JavaScript имеют расширение '.js' или '.jsx'",
    },
    sc_total_loaded: {
      en: "Total scripts loaded:\n%1",
      de: "Geladene Skripte insgesamt:\n%1",
      ru: "Загружено скриптов:\n%1",
    },
    script: { en: "Script", de: "Skript", ru: "Скрипт" },
    step_delete: { en: "Delete", de: "Löschen", ru: "Удалить" },
    step_down: { en: "Move Down", de: "Nach unten", ru: "Вниз" },
    step_up: { en: "Move Up", de: "Nach oben", ru: "Наверх" },
    title: { en: "Ai Command Palette", de: "Kurzbefehle", ru: "" },
    tl_all: {
      en: "All Built-In Tools",
      de: "Alle integrierten Werkzeuge",
      ru: "Стандартные инструменты",
    },
    tl_error_selecting: {
      en: "Error selecting tool:\n%1\n\n%2",
      de: "Fehler beim Auswählen des Werkzeugs:\n%1\n\n%2",
      ru: "Ошибка выбора инструмента:\n%1\n\n%2",
    },
    tl_none_available: {
      en: "No tools are currently available.",
      de: "Zurzeit sind keine Werkzeuge verfügbar.",
      ru: "Инструменты в данный момент недоступны",
    },
    version: { en: "Version %1", de: "Ausführung %1", ru: "версия %1" },
    wf_already_exists: {
      en: "A workflow with that name already exists.\nWould you like to overwrite the previous workflow with the new one?",
      de: "Ein Arbeitsablauf mit diesem Namen existiert bereits.\nSoll der bestehende Arbeitsablauf überschrieben werden?",
      ru: "Набор с таким именем уже существует\nХотите перезаписать предыдущий?",
    },
    wf_already_exists_title: {
      en: "Save Workflow Conflict",
      de: "Arbeitsablauf-Konflikt speichern?",
      ru: "Проблема сохранения набора",
    },
    wf_builder: {
      en: "Workflow Builder",
      de: "Arbeitsabläufe erstellen",
      ru: "Редактор наборов команд",
    },
    wf_choose: {
      en: "Choose A Workflow To Edit",
      de: "Wählen Sie einen Arbeitsablauf zum Bearbeiten aus.",
      ru: "Выберите набор для редактирования",
    },
    wf_error_saving: {
      en: "Error saving workflow:\n%1",
      de: "Fehler beim Speichern des Arbeitsablaufs:\n%1",
      ru: "Ошибка сохранения набора:\n%1",
    },
    wf_needs_attention: {
      en: "Workflow needs attention.\nThe following action steps from your workflow are no longer available.\n\nDeleted Actions:\n%1\n\nIncompatible Actions:\n%2",
      de: "",
      ru: "Набор требует внимания\nУказанные шаги в вашем наборе команд больше недоступны.\n\nУдаленные команды:\n%1\n\nНесовместимые команды:\n%2",
    },
    wf_name: {
      en: "Enter a new name for your workflow.",
      de: "Geben Sie einen neuen Namen für den Arbeitsablauf an.",
      ru: "Введите новое имя набора",
    },
    wf_name_title: {
      en: "New Workflow Name",
      de: "Name des neuen Arbeitsablaufs",
      ru: "Имя нового набора",
    },
    wf_none_attention: {
      en: "There are no workflows that need attention.",
      de: "Es gibt keine Arbeitsabläufe, die beachtet werden müssen.",
      ru: "Нет наборов требующих внимания",
    },
    wf_none_edit: {
      en: "There are no workflows to edit.",
      de: "Es gibt keine Arbeitsabläufe zum Bearbeiten.",
      ru: "Нет наборов для редактирования",
    },
    wf_not_saved: {
      en: "Workflow not saved.",
      de: "Arbeitsablauf nicht gespeichert",
      ru: "Набор не сохранен",
    },
    wf_save_as: {
      en: "Save Workflow As",
      de: "Arbeitsablauf speichern als",
      ru: "Сохранить набор как",
    },
    wf_steps: { en: "Workflow Steps", de: "Befehlskombinationen", ru: "Шаги набора" },
    wf_steps_helptip: {
      en: "Workflows will run in order from top to bottom.",
      de: "Die Befehlskombinationen werden in der Reihenfolge von oben nach unten ausgeführt.",
      ru: "Набор выполняется сверху вниз",
    },
    wf_titlecase: { en: "Workflow", de: "Arbeitsablauf", ru: "Наборы" },
    workflow: { en: "workflow", de: "Arbeitsablauf", ru: "Наборы" },
  };

  var builtCommands = {
    menu: {
      menu_new: {
        action: "new",
        type: "menu",
        loc: { en: "File > New...", de: "Datei > Neu …", ru: "Файл > Новый..." },
      },
      menu_newFromTemplate: {
        action: "newFromTemplate",
        type: "menu",
        loc: {
          en: "File > New from Template...",
          de: "Datei > Neu aus Vorlage …",
          ru: "Файл > Новый из шаблона...",
        },
      },
      menu_open: {
        action: "open",
        type: "menu",
        loc: { en: "File > Open...", de: "Datei > Öffnen …", ru: "Файл > Открыть..." },
      },
      "menu_Adobe Bridge Browse": {
        action: "Adobe Bridge Browse",
        type: "menu",
        loc: {
          en: "File > Browse in Bridge...",
          de: "Datei > Bridge durchsuchen …",
          ru: "Файл > Обзор в Bridge...",
        },
      },
      menu_close: {
        action: "close",
        type: "menu",
        loc: { en: "File > Close", de: "Datei > Schließen", ru: "Файл > Закрыть" },
      },
      menu_save: {
        action: "save",
        type: "menu",
        loc: { en: "File > Save", de: "Datei > Speichern", ru: "Файл > Сохранить" },
      },
      menu_saveas: {
        action: "saveas",
        type: "menu",
        loc: {
          en: "File > Save As...",
          de: "Datei > Speichern unter …",
          ru: "Файл > Сохранить как...",
        },
      },
      menu_saveacopy: {
        action: "saveacopy",
        type: "menu",
        loc: {
          en: "File > Save a Copy...",
          de: "Datei > Kopie speichern …",
          ru: "Файл > Сохранить копию...",
        },
      },
      menu_saveastemplate: {
        action: "saveastemplate",
        type: "menu",
        loc: {
          en: "File > Save as Template...",
          de: "Datei > Als Vorlage speichern …",
          ru: "Файл > Сохранить как шаблон...",
        },
      },
      "menu_Adobe AI Save Selected Slices": {
        action: "Adobe AI Save Selected Slices",
        type: "menu",
        loc: {
          en: "File > Save Selected Slices...",
          de: "Datei > Ausgewählte Slices speichern …",
          ru: "Файл > Файл > Сохранить выделенные фрагменты...",
        },
      },
      menu_revert: {
        action: "revert",
        type: "menu",
        loc: {
          en: "File > Revert",
          de: "Datei > Zurück zur letzten Version",
          ru: "Файл > Восстановить",
        },
      },
      "menu_Search Adobe Stock": {
        action: "Search Adobe Stock",
        type: "menu",
        loc: {
          en: "File > Search Adobe Stock",
          de: "Datei > Adobe Stock durchsuchen …",
          ru: "Файл > Поиск в Adobe Stock...",
        },
        minVersion: 19,
      },
      "menu_AI Place": {
        action: "AI Place",
        type: "menu",
        loc: {
          en: "File > Place...",
          de: "Datei > Platzieren …",
          ru: "Файл > Поместить...",
        },
      },
      menu_exportForScreens: {
        action: "exportForScreens",
        type: "menu",
        loc: {
          en: "File > Export > Export For Screens...",
          de: "Datei > Exportieren > Für Bildschirme exportieren …",
          ru: "Файл > Экспорт для экранов...",
        },
        minVersion: 20,
      },
      menu_export: {
        action: "export",
        type: "menu",
        loc: {
          en: "File > Export > Export As...",
          de: "Datei > Exportieren …",
          ru: "Файл > Экспортировать как...",
        },
      },
      "menu_Adobe AI Save For Web": {
        action: "Adobe AI Save For Web",
        type: "menu",
        loc: {
          en: "File > Export > Save for Web (Legacy)...",
          de: "Datei > Für Web speichern (Legacy) …",
          ru: "Файл > Сохранить для браузеров...",
        },
      },
      menu_exportSelection: {
        action: "exportSelection",
        type: "menu",
        loc: {
          en: "File > Export Selection...",
          de: "Datei > Auswahl exportieren …",
          ru: "Файл > Экспортировать выделенные элементы...",
        },
        minVersion: 20,
      },
      "menu_Package Menu Item": {
        action: "Package Menu Item",
        type: "menu",
        loc: {
          en: "File > Package",
          de: "Datei > Verpacken …",
          ru: "Файл > Упаковать...",
        },
      },
      menu_ai_browse_for_script: {
        action: "ai_browse_for_script",
        type: "menu",
        loc: {
          en: "File > Scripts > Other Script...",
          de: "Datei > Skripten > Anderes Skript …",
          ru: "Файл > Сценарии > Другой сценарий...",
        },
      },
      menu_document: {
        action: "document",
        type: "menu",
        loc: {
          en: "File > Document Setup...",
          de: "Datei > Dokument einrichten …",
          ru: "Файл > Параметры документа...",
        },
      },
      "menu_doc-color-cmyk": {
        action: "doc-color-cmyk",
        type: "menu",
        loc: {
          en: "File > Document Color Mode > CMYK Color",
          de: "Datei > Dokumentfarbmodus > CMYK-Farbe",
          ru: "Файл > Цветовой режим документа > CMYK",
        },
      },
      "menu_doc-color-rgb": {
        action: "doc-color-rgb",
        type: "menu",
        loc: {
          en: "File > Document Color Mode > RGB Color",
          de: "Datei > Dokumentfarbmodus > RGB-Farbe",
          ru: "Файл > Цветовой режим документа > RGB",
        },
      },
      "menu_File Info": {
        action: "File Info",
        type: "menu",
        loc: {
          en: "File > File Info...",
          de: "Datei > Dateiinformationen …",
          ru: "Файл > Сведения о файле...",
        },
      },
      menu_Print: {
        action: "Print",
        type: "menu",
        loc: { en: "File > Print...", de: "Datei > Drucken …", ru: "Файл > Печать..." },
      },
      menu_quit: {
        action: "quit",
        type: "menu",
        loc: {
          en: "File > Exit",
          de: "Datei > Illustrator beenden",
          ru: "Файл > Выход",
        },
      },
      menu_undo: {
        action: "undo",
        type: "menu",
        loc: {
          en: "Edit > Undo",
          de: "Bearbeiten > Rückgängig",
          ru: "Редактирование > Отменить",
        },
      },
      menu_redo: {
        action: "redo",
        type: "menu",
        loc: {
          en: "Edit > Redo",
          de: "Bearbeiten > Wiederholen",
          ru: "Редактирование > Повторить",
        },
      },
      menu_cut: {
        action: "cut",
        type: "menu",
        loc: {
          en: "Edit > Cut",
          de: "Bearbeiten > Ausschneiden",
          ru: "Редактирование > Вырезать",
        },
      },
      menu_copy: {
        action: "copy",
        type: "menu",
        loc: {
          en: "Edit > Copy",
          de: "Bearbeiten > Kopieren",
          ru: "Редактирование > Копировать",
        },
      },
      menu_paste: {
        action: "paste",
        type: "menu",
        loc: {
          en: "Edit > Paste",
          de: "Bearbeiten > Einfügen",
          ru: "Редактирование > Вставить",
        },
      },
      menu_pasteFront: {
        action: "pasteFront",
        type: "menu",
        loc: {
          en: "Edit > Paste in Front",
          de: "Bearbeiten > Davor einfügen",
          ru: "Редактирование > Вставить на передний план",
        },
      },
      menu_pasteBack: {
        action: "pasteBack",
        type: "menu",
        loc: {
          en: "Edit > Paste in Back",
          de: "Bearbeiten > Dahinter einfügen",
          ru: "Редактирование > Вставить на задний план",
        },
      },
      menu_pasteInPlace: {
        action: "pasteInPlace",
        type: "menu",
        loc: {
          en: "Edit > Paste in Place",
          de: "Bearbeiten > An Originalposition einfügen",
          ru: "Редактирование > Вставить на то же место",
        },
      },
      menu_pasteInAllArtboard: {
        action: "pasteInAllArtboard",
        type: "menu",
        loc: {
          en: "Edit > Paste on All Artboards",
          de: "Bearbeiten > In alle Zeichenflächen einfügen",
          ru: "Редактирование > Вставить на все монтажные области",
        },
      },
      menu_pasteWithoutFormatting: {
        action: "pasteWithoutFormatting",
        type: "menu",
        loc: {
          en: "Edit > Paste without Formatting",
          de: "Bearbeiten > Ohne Formatierung einfügen",
          ru: "Редактирование > Вставить без форматирования",
        },
        minVersion: 25.3,
      },
      menu_clear: {
        action: "clear",
        type: "menu",
        loc: {
          en: "Edit > Clear",
          de: "Bearbeiten > Löschen",
          ru: "Редактирование > Очистить",
        },
      },
      "menu_Find and Replace": {
        action: "Find and Replace",
        type: "menu",
        loc: {
          en: "Edit > Find & Replace...",
          de: "Bearbeiten > Suchen und ersetzen …",
          ru: "Редактирование > Найти и заменить...",
        },
      },
      "menu_Find Next": {
        action: "Find Next",
        type: "menu",
        loc: {
          en: "Edit > Find Next",
          de: "Bearbeiten > Weitersuchen",
          ru: "Редактирование > Найти следующий",
        },
      },
      "menu_Auto Spell Check": {
        action: "Auto Spell Check",
        type: "menu",
        loc: {
          en: "Edit > Spelling > Auto Spell Check",
          de: "Bearbeiten > Rechtschreibung > Automatische Rechtschreibprüfung",
          ru: "Редактирование > Орфография > Автоматическая проверка орфографии",
        },
        minVersion: 24,
      },
      "menu_Check Spelling": {
        action: "Check Spelling",
        type: "menu",
        loc: {
          en: "Edit > Spelling > Check Spelling...",
          de: "Bearbeiten > Rechtschreibung > Rechtschreibprüfung …",
          ru: "Редактирование > Орфография > Проверка орфографии…",
        },
        minVersion: 24,
      },
      "menu_Edit Custom Dictionary...": {
        action: "Edit Custom Dictionary...",
        type: "menu",
        loc: {
          en: "Edit > Edit Custom Dictionary...",
          de: "Bearbeiten > Eigenes Wörterbuch bearbeiten …",
          ru: "Редактирование > Редактировать заказной словарь...",
        },
      },
      "menu_Recolor Art Dialog": {
        action: "Recolor Art Dialog",
        type: "menu",
        loc: {
          en: "Edit > Edit Colors > Recolor Artwork...",
          de: "Bearbeiten > Farben bearbeiten > Bildmaterial neu färben …",
          ru: "Редактирование > Редактировать цвета > Перекрасить графический объект...",
        },
      },
      menu_Adjust3: {
        action: "Adjust3",
        type: "menu",
        loc: {
          en: "Edit > Edit Colors > Adjust Color Balance...",
          de: "Bearbeiten > Farben bearbeiten > Farbbalance einstellen …",
          ru: "Редактирование > Редактировать цвета > Коррекция цветового баланса...",
        },
      },
      menu_Colors3: {
        action: "Colors3",
        type: "menu",
        loc: {
          en: "Edit > Edit Colors > Blend Front to Back",
          de: "Bearbeiten > Farben bearbeiten > Vorne -> Hinten angleichen",
          ru: "Редактирование > Редактировать цвета > Переход от верхнего к нижнему",
        },
      },
      menu_Colors4: {
        action: "Colors4",
        type: "menu",
        loc: {
          en: "Edit > Edit Colors > Blend Horizontally",
          de: "Bearbeiten > Farben bearbeiten > Horizontal angleichen",
          ru: "Редактирование > Редактировать цвета > Переход по горизонтали",
        },
      },
      menu_Colors5: {
        action: "Colors5",
        type: "menu",
        loc: {
          en: "Edit > Edit Colors > Blend Vertically",
          de: "Bearbeiten > Farben bearbeiten > Vertikal angleichen",
          ru: "Редактирование > Редактировать цвета > Переход по вертикали",
        },
      },
      menu_Colors8: {
        action: "Colors8",
        type: "menu",
        loc: {
          en: "Edit > Edit Colors > Convert to CMYK",
          de: "Bearbeiten > Farben bearbeiten > In CMYK konvertieren",
          ru: "Редактирование > Редактировать цвета > Преобразовать в CMYK",
        },
      },
      menu_Colors7: {
        action: "Colors7",
        type: "menu",
        loc: {
          en: "Edit > Edit Colors > Convert to Grayscale",
          de: "Bearbeiten > Farben bearbeiten > In Graustufen konvertieren",
          ru: "Редактирование > Редактировать цвета > Преобразовать в градации серого",
        },
      },
      menu_Colors9: {
        action: "Colors9",
        type: "menu",
        loc: {
          en: "Edit > Edit Colors > Convert to RGB",
          de: "Bearbeiten > Farben bearbeiten > In RGB konvertieren",
          ru: "Редактирование > Редактировать цвета > Преобразовать в RGB",
        },
      },
      menu_Colors6: {
        action: "Colors6",
        type: "menu",
        loc: {
          en: "Edit > Edit Colors > Invert Colors",
          de: "Bearbeiten > Farben bearbeiten > Farben invertieren",
          ru: "Редактирование > Редактировать цвета > Негатив",
        },
      },
      menu_Overprint2: {
        action: "Overprint2",
        type: "menu",
        loc: {
          en: "Edit > Edit Colors > Overprint Black...",
          de: "Bearbeiten > Farben bearbeiten > Schwarz überdrucken …",
          ru: "Редактирование > Редактировать цвета > Наложение черного цвета...",
        },
      },
      menu_Saturate3: {
        action: "Saturate3",
        type: "menu",
        loc: {
          en: "Edit > Edit Colors > Saturate...",
          de: "Bearbeiten > Farben bearbeiten > Sättigung erhöhen …",
          ru: "Редактирование > Редактировать цвета > Изменить насыщенность...",
        },
      },
      "menu_EditOriginal Menu Item": {
        action: "EditOriginal Menu Item",
        type: "menu",
        loc: {
          en: "Edit > Edit Original",
          de: "Bearbeiten > Original bearbeiten",
          ru: "Редактирование > Редактировать оригинал",
        },
      },
      "menu_Transparency Presets": {
        action: "Transparency Presets",
        type: "menu",
        loc: {
          en: "Edit > Transparency Flattener Presets...",
          de: "Bearbeiten > Transparenzreduzierungsvorgaben …",
          ru: "Редактирование > Стили обработки прозрачности...",
        },
      },
      "menu_Print Presets": {
        action: "Print Presets",
        type: "menu",
        loc: {
          en: "Edit > Print Presets...",
          de: "Bearbeiten > Druckvorgaben …",
          ru: "Редактирование > Стили печати...",
        },
      },
      "menu_PDF Presets": {
        action: "PDF Presets",
        type: "menu",
        loc: {
          en: "Edit > Adobe PDF Presets...",
          de: "Bearbeiten > Adobe PDF-Vorgaben …",
          ru: "Редактирование > Стили преобразования в Adobe PDF...",
        },
      },
      menu_PerspectiveGridPresets: {
        action: "PerspectiveGridPresets",
        type: "menu",
        loc: {
          en: "Edit > Perspective Grid Presets...",
          de: "Bearbeiten > Vorgaben für Perspektivenraster …",
          ru: "Редактирование > Стили сетки перспективы...",
        },
      },
      menu_color: {
        action: "color",
        type: "menu",
        loc: {
          en: "Edit > Color Settings...",
          de: "Bearbeiten > Farbeinstellungen …",
          ru: "Редактирование > Настройка цветов...",
        },
      },
      menu_assignprofile: {
        action: "assignprofile",
        type: "menu",
        loc: {
          en: "Edit > Assign Profile...",
          de: "Bearbeiten > Profil zuweisen …",
          ru: "Редактирование > Назначить профиль...",
        },
      },
      "menu_KBSC Menu Item": {
        action: "KBSC Menu Item",
        type: "menu",
        loc: {
          en: "Edit > Keyboard Shortcuts...",
          de: "Bearbeiten > Tastaturbefehle …",
          ru: "Редактирование > Комбинации клавиш...",
        },
      },
      menu_SWFPresets: {
        action: "SWFPresets",
        type: "menu",
        loc: { en: "Edit > SWF Presets...", de: "", ru: "" },
        minVersion: 22,
        maxVersion: 25.9,
      },
      menu_transformagain: {
        action: "transformagain",
        type: "menu",
        loc: {
          en: "Object > Transform > Transform Again",
          de: "Objekt > Transformieren > Erneut transformieren",
          ru: "Объект > Трансформировать > Повторить трансформирование",
        },
      },
      menu_transformmove: {
        action: "transformmove",
        type: "menu",
        loc: {
          en: "Object > Transform > Move...",
          de: "Objekt > Transformieren > Verschieben …",
          ru: "Объект > Трансформировать > Перемещение...",
        },
      },
      menu_transformrotate: {
        action: "transformrotate",
        type: "menu",
        loc: {
          en: "Object > Transform > Rotate...",
          de: "Objekt > Transformieren > Drehen …",
          ru: "Объект > Трансформировать > Поворот...",
        },
      },
      menu_transformreflect: {
        action: "transformreflect",
        type: "menu",
        loc: {
          en: "Object > Transform > Reflect...",
          de: "Objekt > Transformieren > Spiegeln …",
          ru: "Объект > Трансформировать > Зеркальное отражение...",
        },
      },
      menu_transformscale: {
        action: "transformscale",
        type: "menu",
        loc: {
          en: "Object > Transform > Scale...",
          de: "Objekt > Transformieren > Skalieren …",
          ru: "Объект > Трансформировать > Масштабирование...",
        },
      },
      menu_transformshear: {
        action: "transformshear",
        type: "menu",
        loc: {
          en: "Object > Transform > Shear...",
          de: "Objekt > Transformieren > Verbiegen …",
          ru: "Объект > Трансформировать > Наклон...",
        },
      },
      "menu_Transform v23": {
        action: "Transform v23",
        type: "menu",
        loc: {
          en: "Object > Transform Each...",
          de: "Objekt > Transformieren > Einzeln transformieren …",
          ru: "Объект > Трансформировать > Трансформировать каждый...",
        },
      },
      "menu_AI Reset Bounding Box": {
        action: "AI Reset Bounding Box",
        type: "menu",
        loc: {
          en: "Object > Transform > Reset Bounding Box",
          de: "Objekt > Transform > Begrenzungsrahmen zurücksetzen",
          ru: "Объект > Трансформировать > Восстановить настройки по умолчанию ограничительной рамки",
        },
      },
      menu_sendToFront: {
        action: "sendToFront",
        type: "menu",
        loc: {
          en: "Object > Arrange > Bring to Front",
          de: "Objekt > Anordnen > In den Vordergrund",
          ru: "Объект > Монтаж > На передний план",
        },
      },
      menu_sendForward: {
        action: "sendForward",
        type: "menu",
        loc: {
          en: "Object > Arrange > Bring Forward",
          de: "Objekt > Anordnen > Schrittweise nach vorne",
          ru: "Объект > Монтаж > На задний план",
        },
      },
      menu_sendBackward: {
        action: "sendBackward",
        type: "menu",
        loc: {
          en: "Object > Arrange > Send Backward",
          de: "Objekt > Anordnen > Schrittweise nach hinten",
          ru: "Объект > Монтаж > Переложить вперед",
        },
      },
      menu_sendToBack: {
        action: "sendToBack",
        type: "menu",
        loc: {
          en: "Object > Arrange > Send to Back",
          de: "Objekt > Anordnen > In den Hintergrund",
          ru: "Объект > Монтаж > Переложить назад",
        },
      },
      "menu_Selection Hat 2": {
        action: "Selection Hat 2",
        type: "menu",
        loc: {
          en: "Object > Arrange > Send to Current Layer",
          de: "Objekt > Anordnen > In aktuelle Ebene verschieben",
          ru: "Объект > Монтаж > Отправить на текущий слой",
        },
      },
      "menu_Horizontal Align Left": {
        action: "Horizontal Align Left",
        type: "menu",
        loc: {
          en: "Object > Align > Horizontal Align Left",
          de: "Objekt > Ausrichten > Horizontal links ausrichten",
          ru: "Объект > Выравнивание > Горизонтальное выравнивание, влево",
        },
        minVersion: 24,
      },
      "menu_Horizontal Align Center": {
        action: "Horizontal Align Center",
        type: "menu",
        loc: {
          en: "Object > Align > Horizontal Align Center",
          de: "Objekt > Ausrichten > Horizontal zentriert ausrichten",
          ru: "Объект > Выравнивание > Горизонтальное выравнивание, центр",
        },
        minVersion: 24,
      },
      "menu_Horizontal Align Right": {
        action: "Horizontal Align Right",
        type: "menu",
        loc: {
          en: "Object > Align > Horizontal Align Right",
          de: "Objekt > Ausrichten > Horizontal rechts ausrichten",
          ru: "Объект > Выравнивание > Горизонтальное выравнивание, вправо",
        },
        minVersion: 24,
      },
      "menu_Vertical Align Top": {
        action: "Vertical Align Top",
        type: "menu",
        loc: {
          en: "Object > Align > Vertical Align Top",
          de: "Objekt > Ausrichten > Vertikal oben ausrichten",
          ru: "Объект > Выравнивание > Вертикальное выравнивание, вверх",
        },
        minVersion: 24,
      },
      "menu_Vertical Align Center": {
        action: "Vertical Align Center",
        type: "menu",
        loc: {
          en: "Object > Align > Vertical Align Center",
          de: "Objekt > Ausrichten > Vertikal zentriert ausrichten",
          ru: "Объект > Выравнивание > Вертикальное выравнивание, центр",
        },
        minVersion: 24,
      },
      "menu_Vertical Align Bottom": {
        action: "Vertical Align Bottom",
        type: "menu",
        loc: {
          en: "Object > Align > Vertical Align Bottom",
          de: "Objekt > Ausrichten > Vertikal unten ausrichten",
          ru: "Объект > Выравнивание > Вертикальное выравнивание, вниз",
        },
        minVersion: 24,
      },
      "menu_Vertical Distribute Top": {
        action: "Vertical Distribute Top",
        type: "menu",
        loc: { en: "Object > Distribute > Vertical Distribute Top", de: "", ru: "" },
        minVersion: 27,
      },
      "menu_Vertical Distribute Center": {
        action: "Vertical Distribute Center",
        type: "menu",
        loc: { en: "Object > Distribute > Vertical Distribute Center", de: "", ru: "" },
        minVersion: 27,
      },
      "menu_Vertical Distribute Bottom": {
        action: "Vertical Distribute Bottom",
        type: "menu",
        loc: { en: "Object > Distribute > Vertical Distribute Bottom", de: "", ru: "" },
        minVersion: 27,
      },
      "menu_Horizontal Distribute Left": {
        action: "Horizontal Distribute Left",
        type: "menu",
        loc: { en: "Object > Distribute > Horizontal Distribute Left", de: "", ru: "" },
        minVersion: 27,
      },
      "menu_Horizontal Distribute Center": {
        action: "Horizontal Distribute Center",
        type: "menu",
        loc: {
          en: "Object > Distribute > Horizontal Distribute Center",
          de: "",
          ru: "",
        },
        minVersion: 27,
      },
      "menu_Horizontal Distribute Right": {
        action: "Horizontal Distribute Right",
        type: "menu",
        loc: {
          en: "Object > Distribute > Horizontal Distribute Right",
          de: "",
          ru: "",
        },
        minVersion: 27,
      },
      menu_group: {
        action: "group",
        type: "menu",
        loc: {
          en: "Object > Group",
          de: "Objekt > Gruppieren",
          ru: "Объект > Сгруппировать",
        },
      },
      menu_ungroup: {
        action: "ungroup",
        type: "menu",
        loc: {
          en: "Object > Ungroup",
          de: "Objekt > Gruppierung aufheben",
          ru: "Объект > Разгруппировать",
        },
      },
      menu_lock: {
        action: "lock",
        type: "menu",
        loc: {
          en: "Object > Lock > Selection",
          de: "Objekt > Sperren > Auswahl",
          ru: "Объект > Закрепить > Выделенное",
        },
      },
      "menu_Selection Hat 5": {
        action: "Selection Hat 5",
        type: "menu",
        loc: {
          en: "Object > Lock > All Artwork Above",
          de: "Objekt > Sperren > Sämtliches Bildmaterial darüber",
          ru: "Объект > Закрепить > Все объекты выше",
        },
      },
      "menu_Selection Hat 7": {
        action: "Selection Hat 7",
        type: "menu",
        loc: {
          en: "Object > Lock > Other Layers",
          de: "Objekt > Sperren > Andere Ebenen",
          ru: "Объект > Закрепить > Остальные слои",
        },
      },
      menu_unlockAll: {
        action: "unlockAll",
        type: "menu",
        loc: {
          en: "Object > Unlock All",
          de: "Objekt > Alle entsperren",
          ru: "Объект > Освободить все",
        },
      },
      menu_hide: {
        action: "hide",
        type: "menu",
        loc: {
          en: "Object > Hide > Selection",
          de: "Objekt > Ausblenden > Auswahl",
          ru: "Объект > Скрыть > Выделенное",
        },
      },
      "menu_Selection Hat 4": {
        action: "Selection Hat 4",
        type: "menu",
        loc: {
          en: "Object > Hide > All Artwork Above",
          de: "Objekt > Ausblenden > Sämtliches Bildmaterial darüber",
          ru: "Объект > Скрыть > Все объекты выше",
        },
      },
      "menu_Selection Hat 6": {
        action: "Selection Hat 6",
        type: "menu",
        loc: {
          en: "Object > Hide > Other Layers",
          de: "Objekt > Ausblenden > Andere Ebenen",
          ru: "Объект > Скрыть > Остальные слои",
        },
      },
      menu_showAll: {
        action: "showAll",
        type: "menu",
        loc: {
          en: "Object > Show All",
          de: "Objekt > Alles einblenden",
          ru: "Объект > Показать все",
        },
      },
      "menu_Crop Image": {
        action: "Crop Image",
        type: "menu",
        loc: {
          en: "Object > Crop Image",
          de: "Objekt > Bild zuschneiden",
          ru: "Объект > Обрезать изображение",
        },
        minVersion: 23,
      },
      "menu_Rasterize 8 menu item": {
        action: "Rasterize 8 menu item",
        type: "menu",
        loc: {
          en: "Object > Rasterize...",
          de: "Objekt > In Pixelbild umwandeln …",
          ru: "Объект > Растрировать...",
        },
      },
      "menu_make mesh": {
        action: "make mesh",
        type: "menu",
        loc: {
          en: "Object > Create Gradient Mesh...",
          de: "Objekt > Verlaufsgitter erstellen …",
          ru: "Объект > Создать сетчатый градиент...",
        },
      },
      "menu_AI Object Mosaic Plug-in4": {
        action: "AI Object Mosaic Plug-in4",
        type: "menu",
        loc: {
          en: "Object > Create Object Mosaic...",
          de: "Objekt > Objektmosaik erstellen …",
          ru: "Объект > Создать фрагментацию...",
        },
      },
      "menu_TrimMark v25": {
        action: "TrimMark v25",
        type: "menu",
        loc: {
          en: "Object > Create Trim Marks...",
          de: "Objekt > Schnittmarken erstellen",
          ru: "Объект > Создать метки обреза",
        },
      },
      "menu_Flatten Transparency": {
        action: "Flatten Transparency",
        type: "menu",
        loc: {
          en: "Object > Flatten Transparency...",
          de: "Objekt > Transparenz reduzieren …",
          ru: "Объект > Обработка прозрачности...",
        },
      },
      "menu_Make Pixel Perfect": {
        action: "Make Pixel Perfect",
        type: "menu",
        loc: {
          en: "Object > Make Pixel Perfect",
          de: "Objekt > Pixelgenaue Darstellung anwenden",
          ru: "Объект > Коррекция на уровне пикселов",
        },
      },
      "menu_AISlice Make Slice": {
        action: "AISlice Make Slice",
        type: "menu",
        loc: {
          en: "Object > Slice > Make",
          de: "Objekt > Slice > Erstellen",
          ru: "Объект > Фрагменты > Создать",
        },
      },
      "menu_AISlice Release Slice": {
        action: "AISlice Release Slice",
        type: "menu",
        loc: {
          en: "Object > Slice > Release",
          de: "Objekt > Slice > Zurückwandeln",
          ru: "Объект > Фрагменты > Расформировать",
        },
      },
      "menu_AISlice Create from Guides": {
        action: "AISlice Create from Guides",
        type: "menu",
        loc: {
          en: "Object > Slice > Create from Guides",
          de: "Objekt > Slice > Aus Hilfslinien erstellen",
          ru: "Объект > Фрагменты > Создать по направляющим",
        },
      },
      "menu_AISlice Create from Selection": {
        action: "AISlice Create from Selection",
        type: "menu",
        loc: {
          en: "Object > Slice > Create from Selection",
          de: "Objekt > Slice > Aus Auswahl erstellen",
          ru: "Объект > Фрагменты > Создать по выделенной области",
        },
      },
      "menu_AISlice Duplicate": {
        action: "AISlice Duplicate",
        type: "menu",
        loc: {
          en: "Object > Slice > Duplicate Slice",
          de: "Objekt > Slice > Slice duplizieren",
          ru: "Объект > Фрагменты > Создать дубликат фрагмента",
        },
      },
      "menu_AISlice Combine": {
        action: "AISlice Combine",
        type: "menu",
        loc: {
          en: "Object > Slice > Combine Slices",
          de: "Objekt > Slice > Slices kombinieren",
          ru: "Объект > Фрагменты > Объединить фрагменты",
        },
      },
      "menu_AISlice Divide": {
        action: "AISlice Divide",
        type: "menu",
        loc: {
          en: "Object > Slice > Divide Slices...",
          de: "Objekt > Slice > Slices unterteilen …",
          ru: "Объект > Фрагменты > Разделить фрагменты...",
        },
      },
      "menu_AISlice Delete All Slices": {
        action: "AISlice Delete All Slices",
        type: "menu",
        loc: {
          en: "Object > Slice > Delete All",
          de: "Objekt > Slice > Alle löschen",
          ru: "Объект > Фрагменты > Удалить все",
        },
      },
      "menu_AISlice Slice Options": {
        action: "AISlice Slice Options",
        type: "menu",
        loc: {
          en: "Object > Slice > Slice Options...",
          de: "Objekt > Slice > Slice-Optionen …",
          ru: "Объект > Фрагменты > Параметры фрагмента...",
        },
      },
      "menu_AISlice Clip to Artboard": {
        action: "AISlice Clip to Artboard",
        type: "menu",
        loc: {
          en: "Object > Slice > Clip to Artboard",
          de: "Objekt > Slice > Ganze Zeichenfläche exportieren",
          ru: "Объект > Фрагменты > Обрезать по монтажной области",
        },
      },
      menu_Expand3: {
        action: "Expand3",
        type: "menu",
        loc: {
          en: "Object > Expand...",
          de: "Objekt > Umwandeln …",
          ru: "Объект > Разобрать…",
        },
      },
      menu_expandStyle: {
        action: "expandStyle",
        type: "menu",
        loc: {
          en: "Object > Expand Appearance",
          de: "Objekt > Aussehen umwandeln",
          ru: "Объект > Разобрать оформление",
        },
      },
      menu_join: {
        action: "join",
        type: "menu",
        loc: {
          en: "Object > Path > Join",
          de: "Objekt > Pfad > Zusammenfügen",
          ru: "Объект > Контур > Соединить",
        },
      },
      menu_average: {
        action: "average",
        type: "menu",
        loc: {
          en: "Object > Path > Average...",
          de: "Objekt > Pfad > Durchschnitt berechnen …",
          ru: "Объект > Контур > Усреднить…",
        },
      },
      "menu_OffsetPath v22": {
        action: "OffsetPath v22",
        type: "menu",
        loc: {
          en: "Object > Path > Outline Stroke",
          de: "Objekt > Pfad > Konturlinie",
          ru: "Объект > Контур > Преобразовать обводку в кривые",
        },
      },
      "menu_OffsetPath v23": {
        action: "OffsetPath v23",
        type: "menu",
        loc: {
          en: "Object > Path > Offset Path...",
          de: "Objekt > Pfad > Pfad verschieben …",
          ru: "Объект > Контур > Создать параллельный контур…",
        },
      },
      "menu_Reverse Path Direction": {
        action: "Reverse Path Direction",
        type: "menu",
        loc: {
          en: "Object > Path > Reverse Path Direction",
          de: "Objekt > Pfad > Pfadrichtung umkehren",
          ru: "Объект > Контур > Изменение направления контура",
        },
        minVersion: 21,
      },
      "menu_simplify menu item": {
        action: "simplify menu item",
        type: "menu",
        loc: {
          en: "Object > Path > Simplify...",
          de: "Objekt > Pfad > Vereinfachen …",
          ru: "Объект > Контур > Упростить…",
        },
      },
      "menu_Add Anchor Points2": {
        action: "Add Anchor Points2",
        type: "menu",
        loc: {
          en: "Object > Path > Add Anchor Points",
          de: "Objekt > Pfad > Ankerpunkte hinzufügen",
          ru: "Объект > Контур > Добавить опорные точки",
        },
      },
      "menu_Remove Anchor Points menu": {
        action: "Remove Anchor Points menu",
        type: "menu",
        loc: {
          en: "Object > Path > Remove Anchor Points",
          de: "Objekt > Pfad > Ankerpunkte entfernen",
          ru: "Объект > Контур > Удалить опорные точки",
        },
      },
      "menu_Knife Tool2": {
        action: "Knife Tool2",
        type: "menu",
        loc: {
          en: "Object > Path > Divide Objects Below",
          de: "Objekt > Pfad > Darunter liegende Objekte aufteilen",
          ru: "Объект > Контур > Разделить нижние объекты",
        },
      },
      "menu_Rows and Columns....": {
        action: "Rows and Columns....",
        type: "menu",
        loc: {
          en: "Object > Path > Split Into Grid...",
          de: "Objekt > Pfad > In Raster teilen …",
          ru: "Объект > Контур > Создать сетку...",
        },
      },
      "menu_cleanup menu item": {
        action: "cleanup menu item",
        type: "menu",
        loc: {
          en: "Object > Path > Clean Up...",
          de: "Objekt > Pfad > Aufräumen …",
          ru: "Объект > Контур > Вычистить…",
        },
      },
      "menu_Convert to Shape": {
        action: "Convert to Shape",
        type: "menu",
        loc: {
          en: "Object > Shape > Convert to Shapes",
          de: "Objekt > Form > In Form umwandeln",
          ru: "Объект > Фигура > Преобразовать в фигуры",
        },
        minVersion: 18,
      },
      "menu_Expand Shape": {
        action: "Expand Shape",
        type: "menu",
        loc: {
          en: "Object > Shape > Expand Shapes",
          de: "Objekt > Form > Form umwandeln",
          ru: "Объект > Фигура > Разобрать фигуру",
        },
        minVersion: 18,
      },
      "menu_Adobe Make Pattern": {
        action: "Adobe Make Pattern",
        type: "menu",
        loc: {
          en: "Object > Pattern > Make",
          de: "Objekt > Muster > Erstellen",
          ru: "Объект > Узор > Создать",
        },
      },
      "menu_Adobe Edit Pattern": {
        action: "Adobe Edit Pattern",
        type: "menu",
        loc: {
          en: "Object > Pattern > Edit Pattern",
          de: "Objekt > Muster > Muster bearbeiten",
          ru: "Объект > Узор > Редактировать узор",
        },
      },
      "menu_Adobe Pattern Tile Color": {
        action: "Adobe Pattern Tile Color",
        type: "menu",
        loc: {
          en: "Object > Pattern > Tile Edge Color...",
          de: "Objekt > Muster > Farbe für Musterelement-Kante",
          ru: "Объект > Узор > Цвет края элемента...",
        },
      },
      "menu_Partial Rearrange Make": {
        action: "Partial Rearrange Make",
        type: "menu",
        loc: { en: "Object > Intertwine > Make", de: "", ru: "" },
        minVersion: 27,
      },
      "menu_Partial Rearrange Release": {
        action: "Partial Rearrange Release",
        type: "menu",
        loc: { en: "Object > Intertwine > Release", de: "", ru: "" },
        minVersion: 27,
      },
      "menu_Partial Rearrange Edit": {
        action: "Partial Rearrange Edit",
        type: "menu",
        loc: { en: "Object > Intertwine > Edit", de: "", ru: "" },
        minVersion: 27,
      },
      "menu_Make Radial Repeat": {
        action: "Make Radial Repeat",
        type: "menu",
        loc: {
          en: "Object > Repeat > Make Radial",
          de: "Objekt > Wiederholen > Radial",
          ru: "Объект > Повторить > Радиальный",
        },
        minVersion: 25.1,
      },
      "menu_Make Grid Repeat": {
        action: "Make Grid Repeat",
        type: "menu",
        loc: {
          en: "Object > Repeat > Make Grid",
          de: "Objekt > Wiederholen > Raster",
          ru: "Объект > Повторить > Сетка",
        },
        minVersion: 25.1,
      },
      "menu_Make Symmetry Repeat": {
        action: "Make Symmetry Repeat",
        type: "menu",
        loc: {
          en: "Object > Repeat > Make Symmetry",
          de: "Objekt > Wiederholen > Spiegeln",
          ru: "Объект > Повторить > Зеркально",
        },
        minVersion: 25.1,
      },
      "menu_Release Repeat Art": {
        action: "Release Repeat Art",
        type: "menu",
        loc: {
          en: "Object > Repeat > Release",
          de: "Objekt > Wiederholen > Zurückwandeln",
          ru: "Объект > Повторить > Освободить",
        },
        minVersion: 25.1,
      },
      "menu_Repeat Art Options": {
        action: "Repeat Art Options",
        type: "menu",
        loc: {
          en: "Object > Repeat > Repeat Art Options...",
          de: "Objekt > Wiederholen > Optionen …",
          ru: "Объект > Повторить > Параметры…",
        },
        minVersion: 25.1,
      },
      "menu_Path Blend Make": {
        action: "Path Blend Make",
        type: "menu",
        loc: {
          en: "Object > Blend > Make",
          de: "Objekt > Angleichen > Erstellen",
          ru: "Объект > Переход > Создать",
        },
      },
      "menu_Path Blend Release": {
        action: "Path Blend Release",
        type: "menu",
        loc: {
          en: "Object > Blend > Release",
          de: "Objekt > Angleichen > Zurückwandeln",
          ru: "Объект > Переход > Отменить",
        },
      },
      "menu_Path Blend Options": {
        action: "Path Blend Options",
        type: "menu",
        loc: {
          en: "Object > Blend > Blend Options...",
          de: "Objekt > Angleichen > Angleichung-Optionen …",
          ru: "Объект > Переход > Параметры перехода…",
        },
      },
      "menu_Path Blend Expand": {
        action: "Path Blend Expand",
        type: "menu",
        loc: {
          en: "Object > Blend > Expand",
          de: "Objekt > Angleichen > Umwandeln",
          ru: "Объект > Переход > Разобрать",
        },
      },
      "menu_Path Blend Replace Spine": {
        action: "Path Blend Replace Spine",
        type: "menu",
        loc: {
          en: "Object > Blend > Replace Spine",
          de: "Objekt > Angleichen > Achse ersetzen",
          ru: "Объект > Переход > Заменить траекторию",
        },
      },
      "menu_Path Blend Reverse Spine": {
        action: "Path Blend Reverse Spine",
        type: "menu",
        loc: {
          en: "Object > Blend > Reverse Spine",
          de: "Objekt > Angleichen > Achse umkehren",
          ru: "Объект > Переход > Изменить направление",
        },
      },
      "menu_Path Blend Reverse Stack": {
        action: "Path Blend Reverse Stack",
        type: "menu",
        loc: {
          en: "Object > Blend > Reverse Front to Back",
          de: "Objekt > Angleichen > Farbrichtung umkehren",
          ru: "Объект > Переход > Изменить порядок",
        },
      },
      "menu_Make Warp": {
        action: "Make Warp",
        type: "menu",
        loc: {
          en: "Object > Envelope Distort > Make with Warp...",
          de: "Objekt > Verzerrungshülle > Mit Verkrümmung erstellen …",
          ru: "Объект > Искажение с помощью оболочки > Деформация...",
        },
      },
      "menu_Create Envelope Grid": {
        action: "Create Envelope Grid",
        type: "menu",
        loc: {
          en: "Object > Envelope Distort > Make with Mesh...",
          de: "Objekt > Verzerrungshülle > Mit Gitter erstellen …",
          ru: "Объект > Искажение с помощью оболочки > По сетке...",
        },
      },
      "menu_Make Envelope": {
        action: "Make Envelope",
        type: "menu",
        loc: {
          en: "Object > Envelope Distort > Make with Top Object",
          de: "Objekt > Verzerrungshülle > Mit oberstem Objekt erstellen",
          ru: "Объект > Искажение с помощью оболочки > По форме верхнего объекта",
        },
      },
      "menu_Release Envelope": {
        action: "Release Envelope",
        type: "menu",
        loc: {
          en: "Object > Envelope Distort > Release",
          de: "Objekt > Verzerrungshülle > Zurückwandeln",
          ru: "Объект > Искажение с помощью оболочки > Отделить",
        },
      },
      "menu_Envelope Options": {
        action: "Envelope Options",
        type: "menu",
        loc: {
          en: "Object > Envelope Distort > Envelope Options...",
          de: "Objekt > Verzerrungshülle > Hüllen-Optionen …",
          ru: "Объект > Искажение с помощью оболочки > Параметры оболочки...",
        },
      },
      "menu_Expand Envelope": {
        action: "Expand Envelope",
        type: "menu",
        loc: {
          en: "Object > Envelope Distort > Expand",
          de: "Objekt > Verzerrungshülle > Umwandeln",
          ru: "Объект > Искажение с помощью оболочки > Разобрать",
        },
      },
      "menu_Edit Envelope Contents": {
        action: "Edit Envelope Contents",
        type: "menu",
        loc: {
          en: "Object > Envelope Distort > Edit Contents",
          de: "Objekt > Verzerrungshülle > Inhalt bearbeiten",
          ru: "Объект > Искажение с помощью оболочки > Редактировать содержимое",
        },
      },
      "menu_Attach to Active Plane": {
        action: "Attach to Active Plane",
        type: "menu",
        loc: {
          en: "Object > Perspective > Attach to Active Plane",
          de: "Objekt > Perspektive > Aktiver Ebene anhängen",
          ru: "Объект > Перспектива > Прикрепить к активной плоскости",
        },
      },
      "menu_Release with Perspective": {
        action: "Release with Perspective",
        type: "menu",
        loc: {
          en: "Object > Perspective > Release with Perspective",
          de: "Objekt > Perspektive > Aus Perspektive freigeben",
          ru: "Объект > Перспектива > Открепить с сохранением перспективы",
        },
      },
      "menu_Show Object Grid Plane": {
        action: "Show Object Grid Plane",
        type: "menu",
        loc: {
          en: "Object > Perspective > Move Plane to Match Object",
          de: "Objekt > Perspektive > Ebene an Objekt ausrichten",
          ru: "Объект > Перспектива > Переместить плоскость для подгонки по объекту",
        },
      },
      "menu_Edit Original Object": {
        action: "Edit Original Object",
        type: "menu",
        loc: {
          en: "Object > Perspective > Edit Text",
          de: "Objekt > Perspektive > Text bearbeiten",
          ru: "Объект > Перспектива > Редактировать текст",
        },
      },
      "menu_Make Planet X": {
        action: "Make Planet X",
        type: "menu",
        loc: {
          en: "Object > Live Paint > Make",
          de: "Objekt > Interaktiv malen > Erstellen",
          ru: "Объект > Быстрая заливка > Создать",
        },
      },
      "menu_Marge Planet X": {
        action: "Marge Planet X",
        type: "menu",
        loc: {
          en: "Object > Live Paint > Merge",
          de: "Objekt > Interaktiv malen > Zusammenfügen",
          ru: "Объект > Быстрая заливка > Объединить",
        },
      },
      "menu_Release Planet X": {
        action: "Release Planet X",
        type: "menu",
        loc: {
          en: "Object > Live Paint > Release",
          de: "Objekt > Interaktiv malen > Zurückwandeln",
          ru: "Объект > Быстрая заливка > Расформировать",
        },
      },
      "menu_Planet X Options": {
        action: "Planet X Options",
        type: "menu",
        loc: {
          en: "Object > Live Paint > Gap Options...",
          de: "Objekt > Interaktiv malen > Lückenoptionen …",
          ru: "Объект > Быстрая заливка > Параметры зазоров…",
        },
      },
      "menu_Expand Planet X": {
        action: "Expand Planet X",
        type: "menu",
        loc: {
          en: "Object > Live Paint > Expand",
          de: "Objekt > Interaktiv malen > Umwandeln",
          ru: "Объект > Быстрая заливка > Разобрать",
        },
      },
      "menu_Make Image Tracing": {
        action: "Make Image Tracing",
        type: "menu",
        loc: {
          en: "Object > Image Trace > Make",
          de: "Objekt > Bildnachzeichner > Erstellen",
          ru: "Объект > Трассировка изображения > Создать",
        },
      },
      "menu_Make and Expand Image Tracing": {
        action: "Make and Expand Image Tracing",
        type: "menu",
        loc: {
          en: "Object > Image Trace > Make and Expand",
          de: "Objekt > Bildnachzeichner > Erstellen und umwandeln",
          ru: "Объект > Трассировка изображения > Создать и разобрать",
        },
      },
      "menu_Release Image Tracing": {
        action: "Release Image Tracing",
        type: "menu",
        loc: {
          en: "Object > Image Trace > Release",
          de: "Objekt > Bildnachzeichner > Zurückwandeln",
          ru: "Объект > Трассировка изображения > Расформировать",
        },
      },
      "menu_Expand Image Tracing": {
        action: "Expand Image Tracing",
        type: "menu",
        loc: {
          en: "Object > Image Trace > Expand",
          de: "Objekt > Bildnachzeichner > Umwandeln",
          ru: "Объект > Трассировка изображения > Разобрать",
        },
      },
      "menu_Make Text Wrap": {
        action: "Make Text Wrap",
        type: "menu",
        loc: {
          en: "Object > Text Wrap > Make",
          de: "Objekt > Textumfluss > Erstellen",
          ru: "Объект > Обтекание текстом > Создать",
        },
      },
      "menu_Release Text Wrap": {
        action: "Release Text Wrap",
        type: "menu",
        loc: {
          en: "Object > Text Wrap > Release",
          de: "Objekt > Textumfluss > Zurückwandeln",
          ru: "Объект > Обтекание текстом > Освободить",
        },
      },
      "menu_Text Wrap Options...": {
        action: "Text Wrap Options...",
        type: "menu",
        loc: {
          en: "Object > Text Wrap > Text Wrap Options...",
          de: "Objekt > Textumfluss > Textumflussoptionen …",
          ru: "Объект > Обтекание текстом > Параметры обтекания текстом...",
        },
      },
      menu_makeMask: {
        action: "makeMask",
        type: "menu",
        loc: {
          en: "Object > Clipping Mask > Make",
          de: "Objekt > Schnittmaske > Erstellen",
          ru: "Объект > Обтравочная маска > Создать",
        },
      },
      menu_releaseMask: {
        action: "releaseMask",
        type: "menu",
        loc: {
          en: "Object > Clipping Mask > Release",
          de: "Objekt > Schnittmaske > Zurückwandeln",
          ru: "Объект > Обтравочная маска > Отменить",
        },
      },
      menu_editMask: {
        action: "editMask",
        type: "menu",
        loc: {
          en: "Object > Clipping Mask > Edit Mask",
          de: "Objekt > Schnittmaske > Maske bearbeiten",
          ru: "Объект > Обтравочная маска > Редактировать маску",
        },
      },
      menu_compoundPath: {
        action: "compoundPath",
        type: "menu",
        loc: {
          en: "Object > Compound Path > Make",
          de: "Objekt > Zusammengesetzter Pfad > Erstellen",
          ru: "Объект > Составной контур > Создать",
        },
      },
      menu_noCompoundPath: {
        action: "noCompoundPath",
        type: "menu",
        loc: {
          en: "Object > Compound Path > Release",
          de: "Objekt > Zusammengesetzter Pfad > Zurückwandeln",
          ru: "Объект > Составной контур > Отменить",
        },
      },
      menu_setCropMarks: {
        action: "setCropMarks",
        type: "menu",
        loc: {
          en: "Object > Artboards > Convert to Artboards",
          de: "Objekt > Zeichenflächen > In Zeichenflächen konvertieren",
          ru: "Объект > Монтажные области > Преобразовать в монтажные области",
        },
      },
      "menu_ReArrange Artboards": {
        action: "ReArrange Artboards",
        type: "menu",
        loc: {
          en: "Object > Artboards > Rearrange All Artboards",
          de: "Objekt > Zeichenflächen > Alle Zeichenflächen neu anordnen",
          ru: "Объект > Монтажные области > Переупорядочить все монт. обл.",
        },
      },
      "menu_Fit Artboard to artwork bounds": {
        action: "Fit Artboard to artwork bounds",
        type: "menu",
        loc: {
          en: "Object > Artboards > Fit to Artwork Bounds",
          de: "Objekt > Zeichenflächen > An Bildmaterialbegrenzungen anpassen",
          ru: "Объект > Монтажные области > Подогнать по границам иллюстрации",
        },
      },
      "menu_Fit Artboard to selected Art": {
        action: "Fit Artboard to selected Art",
        type: "menu",
        loc: {
          en: "Object > Artboards > Fit to Selected Art",
          de: "Objekt > Zeichenflächen > An ausgewählte Grafik anpassen",
          ru: "Объект > Монтажные области > Подогнать по границам выделенной иллюстрации",
        },
      },
      menu_setGraphStyle: {
        action: "setGraphStyle",
        type: "menu",
        loc: {
          en: "Object > Graph > Type...",
          de: "Objekt > Diagramm > Art …",
          ru: "Объект > Диаграмма > Тип…",
        },
      },
      menu_editGraphData: {
        action: "editGraphData",
        type: "menu",
        loc: {
          en: "Object > Graph > Data...",
          de: "Objekt > Diagramm > Daten …",
          ru: "Объект > Диаграмма > Данные…",
        },
      },
      menu_graphDesigns: {
        action: "graphDesigns",
        type: "menu",
        loc: {
          en: "Object > Graph > Design...",
          de: "Objekt > Diagramm > Designs …",
          ru: "Объект > Диаграмма > Оформление…",
        },
      },
      menu_setBarDesign: {
        action: "setBarDesign",
        type: "menu",
        loc: {
          en: "Object > Graph > Column...",
          de: "Objekt > Diagramm > Balken …",
          ru: "Объект > Диаграмма > Столбец…",
        },
      },
      menu_setIconDesign: {
        action: "setIconDesign",
        type: "menu",
        loc: {
          en: "Object > Graph > Marker...",
          de: "Objekt > Diagramm > Punkte …",
          ru: "Объект > Диаграмма > Маркер…",
        },
      },
      "menu_Browse Typekit Fonts Menu IllustratorUI": {
        action: "Browse Typekit Fonts Menu IllustratorUI",
        type: "menu",
        loc: {
          en: "Type > More from Adobe Fonts...",
          de: "Schrift > Mehr bei Adobe Fonts …",
          ru: "Текст > Найти больше в Adobe Fonts...",
        },
        minVersion: 17.1,
      },
      "menu_alternate glyph palette plugin": {
        action: "alternate glyph palette plugin",
        type: "menu",
        loc: { en: "Type > Glyphs", de: "Schrift > Glyphen", ru: "Текст > Глифы" },
      },
      "menu_area-type-options": {
        action: "area-type-options",
        type: "menu",
        loc: {
          en: "Type > Area Type Options...",
          de: "Schrift > Flächentextoptionen …",
          ru: "Текст > Параметры текста в области…",
        },
      },
      menu_Rainbow: {
        action: "Rainbow",
        type: "menu",
        loc: {
          en: "Type > Type on a Path > Rainbow",
          de: "Schrift > Pfadtext > Regenbogen",
          ru: "Текст > Текст по контуру > Радуга",
        },
      },
      menu_Skew: {
        action: "Skew",
        type: "menu",
        loc: {
          en: "Type > Type on a Path > Skew",
          de: "Schrift > Pfadtext > Asymmetrie",
          ru: "Текст > Текст по контуру > Наклон",
        },
      },
      "menu_3D ribbon": {
        action: "3D ribbon",
        type: "menu",
        loc: {
          en: "Type > Type on a Path > 3D Ribbon",
          de: "Schrift > Pfadtext > 3D-Band",
          ru: "Текст > Текст по контуру > Каскад",
        },
      },
      "menu_Stair Step": {
        action: "Stair Step",
        type: "menu",
        loc: {
          en: "Type > Type on a Path > Stair Step",
          de: "Schrift > Pfadtext > Treppenstufe",
          ru: "Текст > Текст по контуру > Лесенка",
        },
      },
      menu_Gravity: {
        action: "Gravity",
        type: "menu",
        loc: {
          en: "Type > Type on a Path > Gravity",
          de: "Schrift > Pfadtext > Schwerkraft",
          ru: "Текст > Текст по контуру > Гравитация",
        },
      },
      menu_typeOnPathOptions: {
        action: "typeOnPathOptions",
        type: "menu",
        loc: {
          en: "Type > Type on a Path > Type on a Path Options...",
          de: "Schrift > Pfadtext > Pfadtextoptionen …",
          ru: "Текст > Текст по контуру > Параметры текста по контуру...",
        },
      },
      menu_updateLegacyTOP: {
        action: "updateLegacyTOP",
        type: "menu",
        loc: {
          en: "Type > Type on a Path > Update Legacy Type on a Path",
          de: "Schrift > Pfadtext > Alten Pfadtext aktualisieren",
          ru: "Текст > Текст по контуру > Обновить прежнюю версию текста по контуру",
        },
      },
      menu_threadTextCreate: {
        action: "threadTextCreate",
        type: "menu",
        loc: {
          en: "Type > Threaded Text > Create",
          de: "Schrift > Verketteter Text > Erstellen",
          ru: "Текст > Связанные текстовые блоки > Связать",
        },
      },
      menu_releaseThreadedTextSelection: {
        action: "releaseThreadedTextSelection",
        type: "menu",
        loc: {
          en: "Type > Threaded Text > Release Selection",
          de: "Schrift > Verketteter Text > Auswahl zurückwandeln",
          ru: "Текст > Связанные текстовые блоки > Исключить выделенные",
        },
      },
      menu_removeThreading: {
        action: "removeThreading",
        type: "menu",
        loc: {
          en: "Type > Threaded Text > Remove Threading",
          de: "Schrift > Verketteter Text > Verkettung entfernen",
          ru: "Текст > Связанные текстовые блоки > Удалить связь текстовых блоков",
        },
      },
      menu_fitHeadline: {
        action: "fitHeadline",
        type: "menu",
        loc: {
          en: "Type > Fit Headline",
          de: "Schrift > Überschrift einpassen",
          ru: "Текст > Разогнать заголовок",
        },
      },
      "menu_Adobe IllustratorUI Resolve Missing Font": {
        action: "Adobe IllustratorUI Resolve Missing Font",
        type: "menu",
        loc: {
          en: "Type > Resolve Missing Fonts...",
          de: "Schrift > Fehlende Schriftarten auflösen …",
          ru: "Текст > Сопоставить отсутствующие шрифты...",
        },
      },
      "menu_Adobe Illustrator Find Font Menu Item": {
        action: "Adobe Illustrator Find Font Menu Item",
        type: "menu",
        loc: {
          en: "Type > Find/Replace Font...",
          de: "Schrift > Schriftart suchen/ersetzen …",
          ru: "Текст > Найти/заменить шрифт...",
        },
      },
      "menu_UpperCase Change Case Item": {
        action: "UpperCase Change Case Item",
        type: "menu",
        loc: {
          en: "Type > Change Case > UPPERCASE",
          de: "Schrift > Groß-/Kleinschreibung ändern > GROSSBUCHSTABEN",
          ru: "Текст > Изменить регистр > ВСЕ ПРОПИСНЫЕ",
        },
      },
      "menu_LowerCase Change Case Item": {
        action: "LowerCase Change Case Item",
        type: "menu",
        loc: {
          en: "Type > Change Case > lowercase",
          de: "Schrift > Groß-/Kleinschreibung ändern > kleinbuchstaben",
          ru: "Текст > Изменить регистр > все строчные",
        },
      },
      "menu_Title Case Change Case Item": {
        action: "Title Case Change Case Item",
        type: "menu",
        loc: {
          en: "Type > Change Case > Title Case",
          de: "Schrift > Groß-/Kleinschreibung ändern > Erster Buchstabe Im Wort Groß",
          ru: "Текст > Изменить регистр > Прописная В Начале Каждого Слова",
        },
      },
      "menu_Sentence case Change Case Item": {
        action: "Sentence case Change Case Item",
        type: "menu",
        loc: {
          en: "Type > Change Case > Sentence case",
          de: "Schrift > Groß-/Kleinschreibung ändern > Erster buchstabe im satz groß",
          ru: "Текст > Изменить регистр > Прописная в начале предложения",
        },
      },
      "menu_Adobe Illustrator Smart Punctuation Menu Item": {
        action: "Adobe Illustrator Smart Punctuation Menu Item",
        type: "menu",
        loc: {
          en: "Type > Smart Punctuation...",
          de: "Schrift > Satz-/Sonderzeichen …",
          ru: "Текст > Типографская пунктуация...",
        },
      },
      menu_outline: {
        action: "outline",
        type: "menu",
        loc: {
          en: "Type > Create Outlines",
          de: "Schrift > In Pfade umwandeln",
          ru: "Текст > Преобразовать в кривые",
        },
      },
      "menu_Adobe Optical Alignment Item": {
        action: "Adobe Optical Alignment Item",
        type: "menu",
        loc: {
          en: "Type > Optical Margin Alignment",
          de: "Schrift > Optischer Randausgleich",
          ru: "Текст > Визуальное выравнивание полей",
        },
      },
      menu_showHiddenChar: {
        action: "showHiddenChar",
        type: "menu",
        loc: {
          en: "Type > Show Hidden Characters",
          de: "Schrift > Verborgene Zeichen einblenden / ausblenden",
          ru: "Текст > Показать скрытые символы",
        },
      },
      "menu_type-horizontal": {
        action: "type-horizontal",
        type: "menu",
        loc: {
          en: "Type > Type Orientation > Horizontal",
          de: "Schrift > Textausrichtung > Horizontal",
          ru: "Текст > Ориентация текста > Горизонтальная",
        },
      },
      "menu_type-vertical": {
        action: "type-vertical",
        type: "menu",
        loc: {
          en: "Type > Type Orientation > Vertical",
          de: "Schrift > Textausrichtung > Vertikal",
          ru: "Текст > Ориентация текста > Вертикальная",
        },
      },
      menu_selectall: {
        action: "selectall",
        type: "menu",
        loc: {
          en: "Select > All",
          de: "Auswahl > Alles auswählen",
          ru: "Выделение > Все",
        },
      },
      menu_selectallinartboard: {
        action: "selectallinartboard",
        type: "menu",
        loc: {
          en: "Select > All on Active Artboard",
          de: "Auswahl > Alles auf der aktiven Zeichenfläche",
          ru: "Выделение > Все объекты в активной монтажной области",
        },
      },
      menu_deselectall: {
        action: "deselectall",
        type: "menu",
        loc: {
          en: "Select > Deselect",
          de: "Auswahl > Auswahl aufheben",
          ru: "Выделение > Отменить выделение",
        },
      },
      "menu_Find Reselect menu item": {
        action: "Find Reselect menu item",
        type: "menu",
        loc: {
          en: "Select > Reselect",
          de: "Auswahl > Erneut auswählen",
          ru: "Выделение > Выделить снова",
        },
      },
      "menu_Inverse menu item": {
        action: "Inverse menu item",
        type: "menu",
        loc: {
          en: "Select > Inverse",
          de: "Auswahl > Auswahl umkehren",
          ru: "Выделение > Инверсия",
        },
      },
      "menu_Selection Hat 8": {
        action: "Selection Hat 8",
        type: "menu",
        loc: {
          en: "Select > Next Object Above",
          de: "Auswahl > Nächstes Objekt darüber",
          ru: "Выделение > Следующий объект сверху",
        },
      },
      "menu_Selection Hat 9": {
        action: "Selection Hat 9",
        type: "menu",
        loc: {
          en: "Select > Next Object Below",
          de: "Auswahl > Nächstes Objekt darunter",
          ru: "Выделение > Следующий объект снизу",
        },
      },
      "menu_Find Appearance menu item": {
        action: "Find Appearance menu item",
        type: "menu",
        loc: {
          en: "Select > Same > Appearance",
          de: "Auswahl > Gleich > Aussehen",
          ru: "Выделение > По общему признаку > Оформление",
        },
        minVersion: 26,
      },
      "menu_Find Appearance Attributes menu item": {
        action: "Find Appearance Attributes menu item",
        type: "menu",
        loc: {
          en: "Select > Same > Appearance Attribute",
          de: "Auswahl > Gleich > Aussehensattribute",
          ru: "Выделение > По общему признаку > Атрибуты оформления",
        },
        minVersion: 26,
      },
      "menu_Find Blending Mode menu item": {
        action: "Find Blending Mode menu item",
        type: "menu",
        loc: {
          en: "Select > Same > Blending Mode",
          de: "Auswahl > Gleich > Füllmethode",
          ru: "Выделение > По общему признаку > С одинаковым режимом наложения",
        },
        minVersion: 26,
      },
      "menu_Find Fill & Stroke menu item": {
        action: "Find Fill & Stroke menu item",
        type: "menu",
        loc: {
          en: "Select > Same > Fill & Stroke",
          de: "Auswahl > Gleich > Fläche und Kontur",
          ru: "Выделение > По общему признаку > С одинаковыми заливкой и обводкой",
        },
        minVersion: 26,
      },
      "menu_Find Fill Color menu item": {
        action: "Find Fill Color menu item",
        type: "menu",
        loc: {
          en: "Select > Same > Fill Color",
          de: "Auswahl > Gleich > Flächenfarbe",
          ru: "Выделение > По общему признаку > С одинаковым цветом заливки",
        },
        minVersion: 26,
      },
      "menu_Find Opacity menu item": {
        action: "Find Opacity menu item",
        type: "menu",
        loc: {
          en: "Select > Same > Opacity",
          de: "Auswahl > Gleich > Deckkraft",
          ru: "Выделение > По общему признаку > С одинаковой непрозрачностью",
        },
        minVersion: 26,
      },
      "menu_Find Stroke Color menu item": {
        action: "Find Stroke Color menu item",
        type: "menu",
        loc: {
          en: "Select > Same > Stroke Color",
          de: "Auswahl > Gleich > Konturfarbe",
          ru: "Выделение > По общему признаку > С одинаковым цветом обводки",
        },
        minVersion: 26,
      },
      "menu_Find Stroke Weight menu item": {
        action: "Find Stroke Weight menu item",
        type: "menu",
        loc: {
          en: "Select > Same > Stroke Weight",
          de: "Auswahl > Gleich > Konturstärke",
          ru: "Выделение > По общему признаку > С одинаковой толщиной обводки",
        },
        minVersion: 26,
      },
      "menu_Find Style menu item": {
        action: "Find Style menu item",
        type: "menu",
        loc: {
          en: "Select > Same > Graphic Style",
          de: "Auswahl > Gleich > Grafikstil",
          ru: "Выделение > По общему признаку > Стиль графики",
        },
        minVersion: 26,
      },
      "menu_Find Live Shape menu item": {
        action: "Find Live Shape menu item",
        type: "menu",
        loc: {
          en: "Select > Same > Shape",
          de: "Auswahl > Gleich > Form",
          ru: "Выделение > По общему признаку > Фигура",
        },
        minVersion: 26,
      },
      "menu_Find Symbol Instance menu item": {
        action: "Find Symbol Instance menu item",
        type: "menu",
        loc: {
          en: "Select > Same > Symbol Instance",
          de: "Auswahl > Gleich > Symbolinstanz",
          ru: "Выделение > По общему признаку > Одинаковые образцы символа",
        },
        minVersion: 26,
      },
      "menu_Find Link Block Series menu item": {
        action: "Find Link Block Series menu item",
        type: "menu",
        loc: {
          en: "Select > Same > Link Block Series",
          de: "Auswahl > Gleich > Verknüpfungsblockreihen",
          ru: "Выделение > По общему признаку > Последовательность связанных блоков",
        },
        minVersion: 26,
      },
      "menu_Find Text Font Family menu item": {
        action: "Find Text Font Family menu item",
        type: "menu",
        loc: {
          en: "Select > Same > Font Family",
          de: "Auswahl > Gleich > Schriftfamilie",
          ru: "Выделение > По общему признаку > Семейство шрифтов",
        },
        minVersion: 26,
      },
      "menu_Find Text Font Family Style menu item": {
        action: "Find Text Font Family Style menu item",
        type: "menu",
        loc: {
          en: "Select > Same > Font Family & Style",
          de: "Auswahl > Gleich > Schriftfamilie und -schnitt",
          ru: "Выделение > По общему признаку > Семейство и стиль шрифтов",
        },
        minVersion: 26,
      },
      "menu_Find Text Font Family Style Size menu item": {
        action: "Find Text Font Family Style Size menu item",
        type: "menu",
        loc: {
          en: "Select > Same > Font Family, Style & Size",
          de: "Auswahl > Gleich > Schriftfamilie, -schnitt und -grad",
          ru: "Выделение > По общему признаку > Семейство, стиль и размер шрифтов",
        },
        minVersion: 26,
      },
      "menu_Find Text Font Size menu item": {
        action: "Find Text Font Size menu item",
        type: "menu",
        loc: {
          en: "Select > Same > Font Size",
          de: "Auswahl > Gleich > Schriftgrad",
          ru: "Выделение > По общему признаку > Размер шрифта",
        },
        minVersion: 26,
      },
      "menu_Find Text Fill Color menu item": {
        action: "Find Text Fill Color menu item",
        type: "menu",
        loc: {
          en: "Select > Same > Text Fill Color",
          de: "Auswahl > Gleich > Textflächenfarbe",
          ru: "Выделение > По общему признаку > Цвет заливки текста",
        },
        minVersion: 26,
      },
      "menu_Find Text Stroke Color menu item": {
        action: "Find Text Stroke Color menu item",
        type: "menu",
        loc: {
          en: "Select > Same > Text Stroke Color",
          de: "Auswahl > Gleich > Textkonturfarbe",
          ru: "Выделение > По общему признаку > Цвет обводки текста",
        },
        minVersion: 26,
      },
      "menu_Find Text Fill Stroke Color menu item": {
        action: "Find Text Fill Stroke Color menu item",
        type: "menu",
        loc: {
          en: "Select > Same > Text Fill & Stroke Color",
          de: "Auswahl > Gleich > Textflächen- und -konturfarbe",
          ru: "Выделение > По общему признаку > Цвет заливки и обводки текста",
        },
        minVersion: 26,
      },
      "menu_Selection Hat 3": {
        action: "Selection Hat 3",
        type: "menu",
        loc: {
          en: "Select > Object > All on Same Layers",
          de: "Auswahl > Objekt > Alles auf denselben Ebenen",
          ru: "Выделение > По типу объектов > Все на этом же слое",
        },
      },
      "menu_Selection Hat 1": {
        action: "Selection Hat 1",
        type: "menu",
        loc: {
          en: "Select > Object > Direction Handles",
          de: "Auswahl > Objekt > Richtungsgriffe",
          ru: "Выделение > По типу объектов > Управляющие манипуляторы",
        },
      },
      "menu_Bristle Brush Strokes menu item": {
        action: "Bristle Brush Strokes menu item",
        type: "menu",
        loc: {
          en: "Select > Object > Bristle Brush Strokes",
          de: "Auswahl > Objekt > Borstenpinselstriche",
          ru: "Выделение > По типу объектов > Мазки для кисти из щетины",
        },
      },
      "menu_Brush Strokes menu item": {
        action: "Brush Strokes menu item",
        type: "menu",
        loc: {
          en: "Select > Object > Brush Strokes",
          de: "Auswahl > Objekt > Pinselkonturen",
          ru: "Выделение > По типу объектов > Мазки кисти",
        },
      },
      "menu_Clipping Masks menu item": {
        action: "Clipping Masks menu item",
        type: "menu",
        loc: {
          en: "Select > Object > Clipping Masks",
          de: "Auswahl > Objekt > Schnittmasken",
          ru: "Выделение > По типу объектов > Обтравочные маски",
        },
      },
      "menu_Stray Points menu item": {
        action: "Stray Points menu item",
        type: "menu",
        loc: {
          en: "Select > Object > Stray Points",
          de: "Auswahl > Objekt > Einzelne Ankerpunkte",
          ru: "Выделение > По типу объектов > Изолированные точки",
        },
      },
      "menu_Text Objects menu item": {
        action: "Text Objects menu item",
        type: "menu",
        loc: {
          en: "Select > Object > All Text Objects",
          de: "Auswahl > Objekt > Alle Textobjekte",
          ru: "Выделение > По типу объектов > Все объекты текста",
        },
      },
      "menu_Point Text Objects menu item": {
        action: "Point Text Objects menu item",
        type: "menu",
        loc: {
          en: "Select > Object > Point Text Objects",
          de: "Auswahl > Objekt > Punkttextobjekte",
          ru: "Выделение > По типу объектов > Объекты текста из точки",
        },
      },
      "menu_Area Text Objects menu item": {
        action: "Area Text Objects menu item",
        type: "menu",
        loc: {
          en: "Select > Object > Area Text Objects",
          de: "Auswahl > Objekt > Flächenttextobjekte",
          ru: "Выделение > По типу объектов > Объекты текста в области",
        },
      },
      "menu_SmartEdit Menu Item": {
        action: "SmartEdit Menu Item",
        type: "menu",
        loc: {
          en: "Select > Start/Stop Global Edit",
          de: "Auswahl > Globale Bearbeitung starten/anhalten",
          ru: "Выделение > Начать глобальное изменение",
        },
        minVersion: 23,
      },
      "menu_Selection Hat 10": {
        action: "Selection Hat 10",
        type: "menu",
        loc: {
          en: "Select > Save Selection...",
          de: "Auswahl > Auswahl speichern …",
          ru: "Выделение > Сохранить выделенную область…",
        },
      },
      "menu_Selection Hat 11": {
        action: "Selection Hat 11",
        type: "menu",
        loc: {
          en: "Select > Edit Selection...",
          de: "Auswahl > Auswahl bearbeiten …",
          ru: "Выделение > Редактировать выделенную область…",
        },
      },
      "menu_Adobe Apply Last Effect": {
        action: "Adobe Apply Last Effect",
        type: "menu",
        loc: {
          en: "Effect > Apply Last Effect",
          de: "Effekt > Letzten Effekt anwenden",
          ru: "Эффект > Применить последний эффект",
        },
      },
      "menu_Adobe Last Effect": {
        action: "Adobe Last Effect",
        type: "menu",
        loc: {
          en: "Effect > Last Effect",
          de: "Effekt > Letzter Effekt",
          ru: "Эффект > Последний эффект",
        },
      },
      "menu_Live Rasterize Effect Setting": {
        action: "Live Rasterize Effect Setting",
        type: "menu",
        loc: {
          en: "Effect > Document Raster Effects Settings...",
          de: "Effekt > Dokument-Rastereffekt-Einstellungen …",
          ru: "Эффект > Параметры растровых эффектов в документе...",
        },
      },
      "menu_Live Adobe Geometry3D Extrude": {
        action: "Live Adobe Geometry3D Extrude",
        type: "menu",
        loc: {
          en: "Effect > 3D and Materials > Extrude & Bevel...",
          de: "Effekt > 3D und Materialien > Extrudieren und abgeflachte Kante …",
          ru: "Эффект > 3D и материалы > Вытягивание и фаска...",
        },
        minVersion: 26,
      },
      "menu_Live Adobe Geometry3D Revolve": {
        action: "Live Adobe Geometry3D Revolve",
        type: "menu",
        loc: {
          en: "Effect > 3D and Materials > Revolve...",
          de: "Effekt > 3D und Materialien > Kreiseln …",
          ru: "Эффект > 3D и материалы > Вращение…",
        },
        minVersion: 26,
      },
      "menu_Live Adobe Geometry3D Inflate": {
        action: "Live Adobe Geometry3D Inflate",
        type: "menu",
        loc: {
          en: "Effect > 3D and Materials > Inflate...",
          de: "Effekt > 3D und Materialien > Aufblasen …",
          ru: "Эффект > 3D и материалы > Раздувание…",
        },
        minVersion: 26,
      },
      "menu_Live Adobe Geometry3D Rotate": {
        action: "Live Adobe Geometry3D Rotate",
        type: "menu",
        loc: {
          en: "Effect > 3D and Materials > Rotate...",
          de: "Effekt > 3D und Materialien > Drehen …",
          ru: "Эффект > 3D и материалы > Поворот…",
        },
        minVersion: 26,
      },
      "menu_Live Adobe Geometry3D Materials": {
        action: "Live Adobe Geometry3D Materials",
        type: "menu",
        loc: {
          en: "Effect > 3D and Materials > Materials...",
          de: "Effekt > 3D und Materialien > Materialien …",
          ru: "Эффект > 3D и материалы > Материалы…",
        },
        minVersion: 26,
      },
      "menu_Live 3DExtrude": {
        action: "Live 3DExtrude",
        type: "menu",
        loc: {
          en: "Effect > 3D and Materials > 3D (Classic) > Extrude & Bevel (Classic)...",
          de: "Effekt > 3D (klassisch) > Extrudieren und abgeflachte Kante (klassisch) …",
          ru: "Эффект > 3D (классическое) > Вытягивание и фаска (классический)…",
        },
        minVersion: 26,
      },
      "menu_Live 3DRevolve": {
        action: "Live 3DRevolve",
        type: "menu",
        loc: {
          en: "Effect > 3D and Materials > 3D (Classic) > Revolve (Classic)...",
          de: "Effekt > 3D (klassisch) > Kreiseln (klassisch) …",
          ru: "Эффект > 3D (классическое) > Вращение (классическое)…",
        },
        minVersion: 26,
      },
      "menu_Live 3DRotate": {
        action: "Live 3DRotate",
        type: "menu",
        loc: {
          en: "Effect > 3D and Materials > 3D (Classic) > Rotate (Classic)...",
          de: "Effekt > 3D (klassisch) > Drehen (klassisch) …",
          ru: "Эффект > 3D (классическое) > Поворот (классический)…",
        },
        minVersion: 26,
      },
      "menu_Live Rectangle": {
        action: "Live Rectangle",
        type: "menu",
        loc: {
          en: "Effect > Convert to Shape > Rectangle...",
          de: "Effekt > In Form umwandeln > Rechteck …",
          ru: "Эффект > Преобразовать в фигуру> Прямоугольник…",
        },
      },
      "menu_Live Rounded Rectangle": {
        action: "Live Rounded Rectangle",
        type: "menu",
        loc: {
          en: "Effect > Convert to Shape > Rounded Rectangle...",
          de: "Effekt > In Form umwandeln > Abgerundetes Rechteck …",
          ru: "Эффект > Преобразовать в фигуру> Прямоугольник со скругленными углами…",
        },
      },
      "menu_Live Ellipse": {
        action: "Live Ellipse",
        type: "menu",
        loc: {
          en: "Effect > Convert to Shape > Ellipse...",
          de: "Effekt > In Form umwandeln > Ellipse …",
          ru: "Эффект > Преобразовать в фигуру> Эллипс…",
        },
      },
      "menu_Live Trim Marks": {
        action: "Live Trim Marks",
        type: "menu",
        loc: {
          en: "Effect > Crop Marks",
          de: "Effekt > Schnittmarken",
          ru: "Эффект > Метки обрезки",
        },
      },
      "menu_Live Free Distort": {
        action: "Live Free Distort",
        type: "menu",
        loc: {
          en: "Effect > Distort & Transform > Free Distort...",
          de: "Effekt > Verzerrungs- und Transformationsfilter > Frei verzerren …",
          ru: "Эффект > Исказить и трансформировать > Произвольное искажение...",
        },
      },
      "menu_Live Pucker & Bloat": {
        action: "Live Pucker & Bloat",
        type: "menu",
        loc: {
          en: "Effect > Distort & Transform > Pucker & Bloat...",
          de: "Effekt > Verzerrungs- und Transformationsfilter > Zusammenziehen und aufblasen …",
          ru: "Эффект > Исказить и трансформировать > Втягивание и раздувание...",
        },
      },
      "menu_Live Roughen": {
        action: "Live Roughen",
        type: "menu",
        loc: {
          en: "Effect > Distort & Transform > Roughen...",
          de: "Effekt > Verzerrungs- und Transformationsfilter > Aufrauen …",
          ru: "Эффект > Исказить и трансформировать > Огрубление...",
        },
      },
      "menu_Live Transform": {
        action: "Live Transform",
        type: "menu",
        loc: {
          en: "Effect > Distort & Transform > Transform...",
          de: "Effekt > Verzerrungs- und Transformationsfilter > Transformieren …",
          ru: "Эффект > Исказить и трансформировать > Трансформировать...",
        },
      },
      "menu_Live Scribble and Tweak": {
        action: "Live Scribble and Tweak",
        type: "menu",
        loc: {
          en: "Effect > Distort & Transform > Tweak...",
          de: "Effekt > Verzerrungs- und Transformationsfilter > Tweak …",
          ru: "Эффект > Исказить и трансформировать > Помарки...",
        },
      },
      "menu_Live Twist": {
        action: "Live Twist",
        type: "menu",
        loc: {
          en: "Effect > Distort & Transform > Twist...",
          de: "Effekt > Verzerrungs- und Transformationsfilter > Wirbel …",
          ru: "Эффект > Исказить и трансформировать > Скручивание...",
        },
      },
      "menu_Live Zig Zag": {
        action: "Live Zig Zag",
        type: "menu",
        loc: {
          en: "Effect > Distort & Transform > Zig Zag...",
          de: "Effekt > Verzerrungs- und Transformationsfilter > Zickzack …",
          ru: "Эффект > Исказить и трансформировать > Зигзаг...",
        },
      },
      "menu_Live Offset Path": {
        action: "Live Offset Path",
        type: "menu",
        loc: {
          en: "Effect > Path > Offset Path...",
          de: "Effekt > Pfad > Pfad verschieben …",
          ru: "Эффект > Контур > Создать параллельный контур...",
        },
      },
      "menu_Live Outline Object": {
        action: "Live Outline Object",
        type: "menu",
        loc: {
          en: "Effect > Path > Outline Object",
          de: "Effekt > Pfad > Kontur nachzeichnen",
          ru: "Эффект > Контур > Контурный объект",
        },
      },
      "menu_Live Outline Stroke": {
        action: "Live Outline Stroke",
        type: "menu",
        loc: {
          en: "Effect > Path > Outline Stroke",
          de: "Effekt > Pfad > Konturlinie",
          ru: "Эффект > Контур > Преобразовать обводку в кривые",
        },
      },
      "menu_Live Pathfinder Add": {
        action: "Live Pathfinder Add",
        type: "menu",
        loc: {
          en: "Effect > Pathfinder > Add",
          de: "Effekt > Pathfinder > Hinzufügen",
          ru: "Эффект > Обработка контуров > Добавить",
        },
      },
      "menu_Live Pathfinder Intersect": {
        action: "Live Pathfinder Intersect",
        type: "menu",
        loc: {
          en: "Effect > Pathfinder > Intersect",
          de: "Effekt > Pathfinder > Schnittmenge bilden",
          ru: "Эффект > Обработка контуров > Пересечение",
        },
      },
      "menu_Live Pathfinder Exclude": {
        action: "Live Pathfinder Exclude",
        type: "menu",
        loc: {
          en: "Effect > Pathfinder > Exclude",
          de: "Effekt > Pathfinder > Schnittmenge entfernen",
          ru: "Эффект > Обработка контуров > Исключение",
        },
      },
      "menu_Live Pathfinder Subtract": {
        action: "Live Pathfinder Subtract",
        type: "menu",
        loc: {
          en: "Effect > Pathfinder > Subtract",
          de: "Effekt > Pathfinder > Subtrahieren",
          ru: "Эффект > Обработка контуров > Вычитание",
        },
      },
      "menu_Live Pathfinder Minus Back": {
        action: "Live Pathfinder Minus Back",
        type: "menu",
        loc: {
          en: "Effect > Pathfinder > Minus Back",
          de: "Effekt > Pathfinder > Hinteres Objekt abziehen",
          ru: "Эффект > Обработка контуров > Минус нижний",
        },
      },
      "menu_Live Pathfinder Divide": {
        action: "Live Pathfinder Divide",
        type: "menu",
        loc: {
          en: "Effect > Pathfinder > Divide",
          de: "Effekt > Pathfinder > Unterteilen",
          ru: "Эффект > Обработка контуров > Разделение",
        },
      },
      "menu_Live Pathfinder Trim": {
        action: "Live Pathfinder Trim",
        type: "menu",
        loc: {
          en: "Effect > Pathfinder > Trim",
          de: "Effekt > Pathfinder > Überlappungsbereich entfernen",
          ru: "Эффект > Обработка контуров > Обрезка",
        },
      },
      "menu_Live Pathfinder Merge": {
        action: "Live Pathfinder Merge",
        type: "menu",
        loc: {
          en: "Effect > Pathfinder > Merge",
          de: "Effekt > Pathfinder > Verdeckte Fläche entfernen",
          ru: "Эффект > Обработка контуров > Объединение",
        },
      },
      "menu_Live Pathfinder Crop": {
        action: "Live Pathfinder Crop",
        type: "menu",
        loc: {
          en: "Effect > Pathfinder > Crop",
          de: "Effekt > Pathfinder > Schnittmengenfläche",
          ru: "Эффект > Обработка контуров > Кадрировать",
        },
      },
      "menu_Live Pathfinder Outline": {
        action: "Live Pathfinder Outline",
        type: "menu",
        loc: {
          en: "Effect > Pathfinder > Outline",
          de: "Effekt > Pathfinder > Kontur aufteilen",
          ru: "Эффект > Обработка контуров > Контур",
        },
      },
      "menu_Live Pathfinder Hard Mix": {
        action: "Live Pathfinder Hard Mix",
        type: "menu",
        loc: {
          en: "Effect > Pathfinder > Hard Mix",
          de: "Effekt > Pathfinder > Hart mischen",
          ru: "Эффект > Обработка контуров > Жесткое смешивание",
        },
      },
      "menu_Live Pathfinder Soft Mix": {
        action: "Live Pathfinder Soft Mix",
        type: "menu",
        loc: {
          en: "Effect > Pathfinder > Soft Mix...",
          de: "Effekt > Pathfinder > Weich mischen …",
          ru: "Эффект > Обработка контуров > Нежесткое смешивание...",
        },
      },
      "menu_Live Pathfinder Trap": {
        action: "Live Pathfinder Trap",
        type: "menu",
        loc: {
          en: "Effect > Pathfinder > Trap...",
          de: "Effekt > Pathfinder > Überfüllen …",
          ru: "Эффект > Обработка контуров > Треппинг…",
        },
      },
      "menu_Live Rasterize": {
        action: "Live Rasterize",
        type: "menu",
        loc: {
          en: "Effect > Rasterize...",
          de: "Effekt > In Pixelbild umwandeln …",
          ru: "Эффект > Растрировать...",
        },
      },
      "menu_Live Adobe Drop Shadow": {
        action: "Live Adobe Drop Shadow",
        type: "menu",
        loc: {
          en: "Effect > Stylize > Drop Shadow...",
          de: "Effekt > Stilisierungsfilter > Schlagschatten …",
          ru: "Эффект > Стилизация > Тень...",
        },
      },
      "menu_Live Feather": {
        action: "Live Feather",
        type: "menu",
        loc: {
          en: "Effect > Stylize > Feather...",
          de: "Effekt > Stilisierungsfilter > Weiche Kante …",
          ru: "Эффект > Стилизация > Растушевка...",
        },
      },
      "menu_Live Inner Glow": {
        action: "Live Inner Glow",
        type: "menu",
        loc: {
          en: "Effect > Stylize > Inner Glow...",
          de: "Effekt > Stilisierungsfilter > Schein nach innen …",
          ru: "Эффект > Стилизация > Внутреннее свечение...",
        },
      },
      "menu_Live Outer Glow": {
        action: "Live Outer Glow",
        type: "menu",
        loc: {
          en: "Effect > Stylize > Outer Glow...",
          de: "Effekt > Stilisierungsfilter > Schein nach außen …",
          ru: "Эффект > Стилизация > Внешнее свечение...",
        },
      },
      "menu_Live Adobe Round Corners": {
        action: "Live Adobe Round Corners",
        type: "menu",
        loc: {
          en: "Effect > Stylize > Round Corners...",
          de: "Effekt > Stilisierungsfilter > Ecken abrunden …",
          ru: "Эффект > Стилизация > Скругленные углы...",
        },
      },
      "menu_Live Scribble Fill": {
        action: "Live Scribble Fill",
        type: "menu",
        loc: {
          en: "Effect > Stylize > Scribble...",
          de: "Effekt > Stilisierungsfilter > Scribble …",
          ru: "Эффект > Стилизация > Каракули…",
        },
      },
      "menu_Live SVG Filters": {
        action: "Live SVG Filters",
        type: "menu",
        loc: {
          en: "Effect > SVG Filters > Apply SVG Filter...",
          de: "Effekt > SVG-Filter > SVG-Filter anwenden …",
          ru: "Эффект > Фильтры SVG > Применить SVG-фильтр...",
        },
      },
      "menu_SVG Filter Import": {
        action: "SVG Filter Import",
        type: "menu",
        loc: {
          en: "Effect > SVG Filters > Import SVG Filter...",
          de: "Effekt > SVG-Filter > SVG-Filter importieren …",
          ru: "Эффект > Фильтры SVG > Импортировать фильтр SVG...",
        },
      },
      "menu_Live Deform Arc": {
        action: "Live Deform Arc",
        type: "menu",
        loc: {
          en: "Effect > Warp > Arc...",
          de: "Effekt > Verkrümmungsfilter > Bogen …",
          ru: "Эффект > Деформация > Дуга…",
        },
      },
      "menu_Live Deform Arc Lower": {
        action: "Live Deform Arc Lower",
        type: "menu",
        loc: {
          en: "Effect > Warp > Arc Lower...",
          de: "Effekt > Verkrümmungsfilter > Bogen unten …",
          ru: "Эффект > Деформация > Дуга вниз…",
        },
      },
      "menu_Live Deform Arc Upper": {
        action: "Live Deform Arc Upper",
        type: "menu",
        loc: {
          en: "Effect > Warp > Arc Upper...",
          de: "Effekt > Verkrümmungsfilter > Bogen oben …",
          ru: "Эффект > Деформация > Дуга вверх…",
        },
      },
      "menu_Live Deform Arch": {
        action: "Live Deform Arch",
        type: "menu",
        loc: {
          en: "Effect > Warp > Arch...",
          de: "Effekt > Verkrümmungsfilter > Torbogen …",
          ru: "Эффект > Деформация > Арка…",
        },
      },
      "menu_Live Deform Bulge": {
        action: "Live Deform Bulge",
        type: "menu",
        loc: {
          en: "Effect > Warp > Bulge...",
          de: "Effekt > Verkrümmungsfilter > Wulst …",
          ru: "Эффект > Деформация > Выпуклость…",
        },
      },
      "menu_Live Deform Shell Lower": {
        action: "Live Deform Shell Lower",
        type: "menu",
        loc: {
          en: "Effect > Warp > Shell Lower...",
          de: "Effekt > Verkrümmungsfilter > Muschel unten …",
          ru: "Эффект > Деформация > Панцирь вниз…",
        },
      },
      "menu_Live Deform Shell Upper": {
        action: "Live Deform Shell Upper",
        type: "menu",
        loc: {
          en: "Effect > Warp > Shell Upper...",
          de: "Effekt > Verkrümmungsfilter > Muschel oben …",
          ru: "Эффект > Деформация > Панцирь вверх…",
        },
      },
      "menu_Live Deform Flag": {
        action: "Live Deform Flag",
        type: "menu",
        loc: {
          en: "Effect > Warp > Flag...",
          de: "Effekt > Verkrümmungsfilter > Flagge …",
          ru: "Эффект > Деформация > Флаг…",
        },
      },
      "menu_Live Deform Wave": {
        action: "Live Deform Wave",
        type: "menu",
        loc: {
          en: "Effect > Warp > Wave...",
          de: "Effekt > Verkrümmungsfilter > Schwingungen …",
          ru: "Эффект > Деформация > Волна…",
        },
      },
      "menu_Live Deform Fish": {
        action: "Live Deform Fish",
        type: "menu",
        loc: {
          en: "Effect > Warp > Fish...",
          de: "Effekt > Verkrümmungsfilter > Fisch …",
          ru: "Эффект > Деформация > Рыба…",
        },
      },
      "menu_Live Deform Rise": {
        action: "Live Deform Rise",
        type: "menu",
        loc: {
          en: "Effect > Warp > Rise...",
          de: "Effekt > Verkrümmungsfilter > Ansteigend …",
          ru: "Эффект > Деформация > Подъем…",
        },
      },
      "menu_Live Deform Fisheye": {
        action: "Live Deform Fisheye",
        type: "menu",
        loc: {
          en: "Effect > Warp > Fisheye...",
          de: "Effekt > Verkrümmungsfilter > Fischauge …",
          ru: "Эффект > Деформация > Рыбий глаз…",
        },
      },
      "menu_Live Deform Inflate": {
        action: "Live Deform Inflate",
        type: "menu",
        loc: {
          en: "Effect > Warp > Inflate...",
          de: "Effekt > Verkrümmungsfilter > Aufblasen …",
          ru: "Эффект > Деформация > Раздувание…",
        },
      },
      "menu_Live Deform Squeeze": {
        action: "Live Deform Squeeze",
        type: "menu",
        loc: {
          en: "Effect > Warp > Squeeze...",
          de: "Effekt > Verkrümmungsfilter > Stauchen …",
          ru: "Эффект > Деформация > Сжатие…",
        },
      },
      "menu_Live Deform Twist": {
        action: "Live Deform Twist",
        type: "menu",
        loc: {
          en: "Effect > Warp > Twist...",
          de: "Effekt > Verkrümmungsfilter > Wirbel …",
          ru: "Эффект > Деформация > Скручивание…",
        },
      },
      "menu_Live PSAdapter_plugin_GEfc": {
        action: "Live PSAdapter_plugin_GEfc",
        type: "menu",
        loc: {
          en: "Effect > Effect Gallery...",
          de: "Effekt > Effekte-Galerie …",
          ru: "Эффект > Галерея эффектов…",
        },
      },
      "menu_Live PSAdapter_plugin_ClrP": {
        action: "Live PSAdapter_plugin_ClrP",
        type: "menu",
        loc: {
          en: "Effect > Artistic > Colored Pencil...",
          de: "Effekt > Kunstfilter > Buntstiftschraffur …",
          ru: "Эффект > Имитация > Цветные карандаши…",
        },
      },
      "menu_Live PSAdapter_plugin_Ct": {
        action: "Live PSAdapter_plugin_Ct",
        type: "menu",
        loc: {
          en: "Effect > Artistic > Cutout...",
          de: "Effekt > Kunstfilter > Farbpapier-Collage …",
          ru: "Эффект > Имитация > Аппликация…",
        },
      },
      "menu_Live PSAdapter_plugin_DryB": {
        action: "Live PSAdapter_plugin_DryB",
        type: "menu",
        loc: {
          en: "Effect > Artistic > Dry Brush...",
          de: "Effekt > Kunstfilter > Grobe Malerei …",
          ru: "Эффект > Имитация > Сухая кисть…",
        },
      },
      "menu_Live PSAdapter_plugin_FlmG": {
        action: "Live PSAdapter_plugin_FlmG",
        type: "menu",
        loc: {
          en: "Effect > Artistic > Film Grain...",
          de: "Effekt > Kunstfilter > Körnung & Aufhellung …",
          ru: "Эффект > Имитация > Зернистость пленки…",
        },
      },
      "menu_Live PSAdapter_plugin_Frsc": {
        action: "Live PSAdapter_plugin_Frsc",
        type: "menu",
        loc: {
          en: "Effect > Artistic > Fresco...",
          de: "Effekt > Kunstfilter > Fresko …",
          ru: "Эффект > Имитация > Фреска…",
        },
      },
      "menu_Live PSAdapter_plugin_NGlw": {
        action: "Live PSAdapter_plugin_NGlw",
        type: "menu",
        loc: {
          en: "Effect > Artistic > Neon Glow...",
          de: "Effekt > Kunstfilter > Neonschein …",
          ru: "Эффект > Имитация > Неоновый свет…",
        },
      },
      "menu_Live PSAdapter_plugin_PntD": {
        action: "Live PSAdapter_plugin_PntD",
        type: "menu",
        loc: {
          en: "Effect > Artistic > Paint Daubs...",
          de: "Effekt > Kunstfilter > Ölfarbe getupft …",
          ru: "Эффект > Имитация > Масляная живопись…",
        },
      },
      "menu_Live PSAdapter_plugin_PltK": {
        action: "Live PSAdapter_plugin_PltK",
        type: "menu",
        loc: {
          en: "Effect > Artistic > Palette Knife...",
          de: "Effekt > Kunstfilter > Malmesser …",
          ru: "Эффект > Имитация > Шпатель…",
        },
      },
      "menu_Live PSAdapter_plugin_PlsW": {
        action: "Live PSAdapter_plugin_PlsW",
        type: "menu",
        loc: {
          en: "Effect > Artistic > Plastic Wrap...",
          de: "Effekt > Kunstfilter > Kunststofffolie …",
          ru: "Эффект > Имитация > Целлофановая упаковка…",
        },
      },
      "menu_Live PSAdapter_plugin_PstE": {
        action: "Live PSAdapter_plugin_PstE",
        type: "menu",
        loc: {
          en: "Effect > Artistic > Poster Edges...",
          de: "Effekt > Kunstfilter > Tontrennung & Kantenbetonung …",
          ru: "Эффект > Имитация > Очерченные края…",
        },
      },
      "menu_Live PSAdapter_plugin_RghP": {
        action: "Live PSAdapter_plugin_RghP",
        type: "menu",
        loc: {
          en: "Effect > Artistic > Rough Pastels...",
          de: "Effekt > Kunstfilter > Grobes Pastell …",
          ru: "Эффект > Имитация > Пастель…",
        },
      },
      "menu_Live PSAdapter_plugin_SmdS": {
        action: "Live PSAdapter_plugin_SmdS",
        type: "menu",
        loc: {
          en: "Effect > Artistic > Smudge Stick...",
          de: "Effekt > Kunstfilter > Diagonal verwischen …",
          ru: "Эффект > Имитация > Растушевка…",
        },
      },
      "menu_Live PSAdapter_plugin_Spng": {
        action: "Live PSAdapter_plugin_Spng",
        type: "menu",
        loc: {
          en: "Effect > Artistic > Sponge...",
          de: "Effekt > Kunstfilter > Schwamm …",
          ru: "Эффект > Имитация > Губка…",
        },
      },
      "menu_Live PSAdapter_plugin_Undr": {
        action: "Live PSAdapter_plugin_Undr",
        type: "menu",
        loc: {
          en: "Effect > Artistic > Underpainting...",
          de: "Effekt > Kunstfilter > Malgrund …",
          ru: "Эффект > Имитация > Рисование на обороте…",
        },
      },
      "menu_Live PSAdapter_plugin_Wtrc": {
        action: "Live PSAdapter_plugin_Wtrc",
        type: "menu",
        loc: {
          en: "Effect > Artistic > Watercolor...",
          de: "Effekt > Kunstfilter > Aquarell …",
          ru: "Эффект > Имитация > Акварель…",
        },
      },
      "menu_Live Adobe PSL Gaussian Blur": {
        action: "Live Adobe PSL Gaussian Blur",
        type: "menu",
        loc: {
          en: "Effect > Blur > Gaussian Blur...",
          de: "Effekt > Weichzeichnungsfilter > Gaußscher Weichzeichner …",
          ru: "Эффект > Размытие > Размытие по Гауссу...",
        },
      },
      "menu_Live PSAdapter_plugin_RdlB": {
        action: "Live PSAdapter_plugin_RdlB",
        type: "menu",
        loc: {
          en: "Effect > Blur > Radial Blur...",
          de: "Effekt > Weichzeichnungsfilter > Radialer Weichzeichner …",
          ru: "Эффект > Размытие > Радиальное размытие...",
        },
      },
      "menu_Live PSAdapter_plugin_SmrB": {
        action: "Live PSAdapter_plugin_SmrB",
        type: "menu",
        loc: {
          en: "Effect > Blur > Smart Blur...",
          de: "Effekt > Weichzeichnungsfilter > Selektiver Weichzeichner …",
          ru: "Эффект > Размытие > Умное размытие...",
        },
      },
      "menu_Live PSAdapter_plugin_AccE": {
        action: "Live PSAdapter_plugin_AccE",
        type: "menu",
        loc: {
          en: "Effect > Brush Strokes > Accented Edges...",
          de: "Effekt > Malfilter > Kanten betonen …",
          ru: "Эффект > Штрихи > Акцент на краях…",
        },
      },
      "menu_Live PSAdapter_plugin_AngS": {
        action: "Live PSAdapter_plugin_AngS",
        type: "menu",
        loc: {
          en: "Effect > Brush Strokes > Angled Strokes...",
          de: "Effekt > Malfilter > Gekreuzte Malstriche …",
          ru: "Эффект > Штрихи > Наклонные штрихи…",
        },
      },
      "menu_Live PSAdapter_plugin_Crsh": {
        action: "Live PSAdapter_plugin_Crsh",
        type: "menu",
        loc: {
          en: "Effect > Brush Strokes > Crosshatch...",
          de: "Effekt > Malfilter > Kreuzschraffur …",
          ru: "Эффект > Штрихи > Перекрестные штрихи…",
        },
      },
      "menu_Live PSAdapter_plugin_DrkS": {
        action: "Live PSAdapter_plugin_DrkS",
        type: "menu",
        loc: {
          en: "Effect > Brush Strokes > Dark Strokes...",
          de: "Effekt > Malfilter > Dunkle Malstriche …",
          ru: "Эффект > Штрихи > Темные штрихи…",
        },
      },
      "menu_Live PSAdapter_plugin_InkO": {
        action: "Live PSAdapter_plugin_InkO",
        type: "menu",
        loc: {
          en: "Effect > Brush Strokes > Ink Outlines...",
          de: "Effekt > Malfilter > Konturen mit Tinte nachzeichnen …",
          ru: "Эффект > Штрихи > Обводка…",
        },
      },
      "menu_Live PSAdapter_plugin_Spt": {
        action: "Live PSAdapter_plugin_Spt",
        type: "menu",
        loc: {
          en: "Effect > Brush Strokes > Spatter...",
          de: "Effekt > Malfilter > Spritzer …",
          ru: "Эффект > Штрихи > Разбрызгивание…",
        },
      },
      "menu_Live PSAdapter_plugin_SprS": {
        action: "Live PSAdapter_plugin_SprS",
        type: "menu",
        loc: {
          en: "Effect > Brush Strokes > Sprayed Strokes...",
          de: "Effekt > Malfilter > Verwackelte Striche …",
          ru: "Эффект > Штрихи > Аэрограф…",
        },
      },
      "menu_Live PSAdapter_plugin_Smie": {
        action: "Live PSAdapter_plugin_Smie",
        type: "menu",
        loc: {
          en: "Effect > Brush Strokes > Sumi-e...",
          de: "Effekt > Malfilter > Sumi-e …",
          ru: "Эффект > Штрихи > Суми-э…",
        },
      },
      "menu_Live PSAdapter_plugin_DfsG": {
        action: "Live PSAdapter_plugin_DfsG",
        type: "menu",
        loc: {
          en: "Effect > Distort > Diffuse Glow...",
          de: "Effekt > Verzerrungsfilter > Weiches Licht …",
          ru: "Эффект > Искажение > Рассеянное свечение…",
        },
      },
      "menu_Live PSAdapter_plugin_Gls": {
        action: "Live PSAdapter_plugin_Gls",
        type: "menu",
        loc: {
          en: "Effect > Distort > Glass...",
          de: "Effekt > Verzerrungsfilter > Glas …",
          ru: "Эффект > Искажение > Стекло…",
        },
      },
      "menu_Live PSAdapter_plugin_OcnR": {
        action: "Live PSAdapter_plugin_OcnR",
        type: "menu",
        loc: {
          en: "Effect > Distort > Ocean Ripple...",
          de: "Effekt > Verzerrungsfilter > Ozeanwellen …",
          ru: "Эффект > Искажение > Океанские волны…",
        },
      },
      "menu_Live PSAdapter_plugin_ClrH": {
        action: "Live PSAdapter_plugin_ClrH",
        type: "menu",
        loc: {
          en: "Effect > Pixelate > Color Halftone...",
          de: "Effekt > Vergröberungsfilter > Farbraster …",
          ru: "Эффект > Оформление > Цветные полутона…",
        },
      },
      "menu_Live PSAdapter_plugin_Crst": {
        action: "Live PSAdapter_plugin_Crst",
        type: "menu",
        loc: {
          en: "Effect > Pixelate > Crystallize...",
          de: "Effekt > Vergröberungsfilter > Kristallisieren …",
          ru: "Эффект > Оформление > Кристаллизация…",
        },
      },
      "menu_Live PSAdapter_plugin_Mztn": {
        action: "Live PSAdapter_plugin_Mztn",
        type: "menu",
        loc: {
          en: "Effect > Pixelate > Mezzotint...",
          de: "Effekt > Vergröberungsfilter > Mezzotint …",
          ru: "Эффект > Оформление > Меццо-тинто…",
        },
      },
      "menu_Live PSAdapter_plugin_Pntl": {
        action: "Live PSAdapter_plugin_Pntl",
        type: "menu",
        loc: {
          en: "Effect > Pixelate > Pointillize...",
          de: "Effekt > Vergröberungsfilter > Punktieren …",
          ru: "Эффект > Оформление > Пуантилизм…",
        },
      },
      "menu_Live PSAdapter_plugin_BsRl": {
        action: "Live PSAdapter_plugin_BsRl",
        type: "menu",
        loc: {
          en: "Effect > Sketch > Bas Relief...",
          de: "Effekt > Zeichenfilter > Basrelief …",
          ru: "Эффект > Эскиз > Рельеф…",
        },
      },
      "menu_Live PSAdapter_plugin_ChlC": {
        action: "Live PSAdapter_plugin_ChlC",
        type: "menu",
        loc: {
          en: "Effect > Sketch > Chalk & Charcoal...",
          de: "Effekt > Zeichenfilter > Chalk & Charcoal …",
          ru: "Эффект > Эскиз > Мел и уголь…",
        },
      },
      "menu_Live PSAdapter_plugin_Chrc": {
        action: "Live PSAdapter_plugin_Chrc",
        type: "menu",
        loc: {
          en: "Effect > Sketch > Charcoal...",
          de: "Effekt > Zeichenfilter > Kohleumsetzung …",
          ru: "Эффект > Эскиз > Уголь…",
        },
      },
      "menu_Live PSAdapter_plugin_Chrm": {
        action: "Live PSAdapter_plugin_Chrm",
        type: "menu",
        loc: {
          en: "Effect > Sketch > Chrome...",
          de: "Effekt > Zeichenfilter > Chrom …",
          ru: "Эффект > Эскиз > Хром…",
        },
      },
      "menu_Live PSAdapter_plugin_CntC": {
        action: "Live PSAdapter_plugin_CntC",
        type: "menu",
        loc: {
          en: "Effect > Sketch > Cont\\u00E9 Crayon...",
          de: "Effekt > Zeichenfilter > Cont\\u00E9-Stifte …",
          ru: "Эффект > Эскиз > Волшебный карандаш…",
        },
      },
      "menu_Live PSAdapter_plugin_GraP": {
        action: "Live PSAdapter_plugin_GraP",
        type: "menu",
        loc: {
          en: "Effect > Sketch > Graphic Pen...",
          de: "Effekt > Zeichenfilter > Strichumsetzung …",
          ru: "Эффект > Эскиз > Тушь…",
        },
      },
      "menu_Live PSAdapter_plugin_HlfS": {
        action: "Live PSAdapter_plugin_HlfS",
        type: "menu",
        loc: {
          en: "Effect > Sketch > Halftone Pattern...",
          de: "Effekt > Zeichenfilter > Rasterungseffekt …",
          ru: "Эффект > Эскиз > Полутоновый узор…",
        },
      },
      "menu_Live PSAdapter_plugin_NtPr": {
        action: "Live PSAdapter_plugin_NtPr",
        type: "menu",
        loc: {
          en: "Effect > Sketch > Note Paper...",
          de: "Effekt > Zeichenfilter > Prägepapier …",
          ru: "Эффект > Эскиз > Почтовая бумага…",
        },
      },
      "menu_Live PSAdapter_plugin_Phtc": {
        action: "Live PSAdapter_plugin_Phtc",
        type: "menu",
        loc: {
          en: "Effect > Sketch > Photocopy...",
          de: "Effekt > Zeichenfilter > Fotokopie …",
          ru: "Эффект > Эскиз > Ксерокопия…",
        },
      },
      "menu_Live PSAdapter_plugin_Plst": {
        action: "Live PSAdapter_plugin_Plst",
        type: "menu",
        loc: {
          en: "Effect > Sketch > Plaster...",
          de: "Effekt > Zeichenfilter > Stuck …",
          ru: "Эффект > Эскиз > Гипс…",
        },
      },
      "menu_Live PSAdapter_plugin_Rtcl": {
        action: "Live PSAdapter_plugin_Rtcl",
        type: "menu",
        loc: {
          en: "Effect > Sketch > Reticulation...",
          de: "Effekt > Zeichenfilter > Punktierstich …",
          ru: "Эффект > Эскиз > Ретикуляция…",
        },
      },
      "menu_Live PSAdapter_plugin_Stmp": {
        action: "Live PSAdapter_plugin_Stmp",
        type: "menu",
        loc: {
          en: "Effect > Sketch > Stamp...",
          de: "Effekt > Zeichenfilter > Stempel …",
          ru: "Эффект > Эскиз > Линогравюра…",
        },
      },
      "menu_Live PSAdapter_plugin_TrnE": {
        action: "Live PSAdapter_plugin_TrnE",
        type: "menu",
        loc: {
          en: "Effect > Sketch > Torn Edges...",
          de: "Effekt > Zeichenfilter > Gerissene Kanten …",
          ru: "Эффект > Эскиз > Рваные края…",
        },
      },
      "menu_Live PSAdapter_plugin_WtrP": {
        action: "Live PSAdapter_plugin_WtrP",
        type: "menu",
        loc: {
          en: "Effect > Sketch > Water Paper...",
          de: "Effekt > Zeichenfilter > Feuchtes Papier …",
          ru: "Эффект > Эскиз > Мокрая бумага…",
        },
      },
      "menu_Live PSAdapter_plugin_GlwE": {
        action: "Live PSAdapter_plugin_GlwE",
        type: "menu",
        loc: {
          en: "Effect > Stylize > Glowing Edges...",
          de: "Effekt > Stilisierungsfilter > Leuchtende Konturen …",
          ru: "Эффект > Стилизация > Свечение краев…",
        },
      },
      "menu_Live PSAdapter_plugin_Crql": {
        action: "Live PSAdapter_plugin_Crql",
        type: "menu",
        loc: {
          en: "Effect > Texture > Craquelure...",
          de: "Effekt > Strukturierungsfilter > Risse …",
          ru: "Эффект > Текстура > Кракелюры…",
        },
      },
      "menu_Live PSAdapter_plugin_Grn": {
        action: "Live PSAdapter_plugin_Grn",
        type: "menu",
        loc: {
          en: "Effect > Texture > Grain...",
          de: "Effekt > Strukturierungsfilter > Körnung …",
          ru: "Эффект > Текстура > Зерно…",
        },
      },
      "menu_Live PSAdapter_plugin_MscT": {
        action: "Live PSAdapter_plugin_MscT",
        type: "menu",
        loc: {
          en: "Effect > Texture > Mosaic Tiles...",
          de: "Effekt > Strukturierungsfilter > Kacheln …",
          ru: "Эффект > Текстура > Мозаичные фрагменты…",
        },
      },
      "menu_Live PSAdapter_plugin_Ptch": {
        action: "Live PSAdapter_plugin_Ptch",
        type: "menu",
        loc: {
          en: "Effect > Texture > Patchwork...",
          de: "Effekt > Strukturierungsfilter > Patchwork …",
          ru: "Эффект > Текстура > Цветная плитка…",
        },
      },
      "menu_Live PSAdapter_plugin_StnG": {
        action: "Live PSAdapter_plugin_StnG",
        type: "menu",
        loc: {
          en: "Effect > Texture > Stained Glass...",
          de: "Effekt > Strukturierungsfilter > Buntglas-Mosaik …",
          ru: "Эффект > Текстура > Витраж…",
        },
      },
      "menu_Live PSAdapter_plugin_Txtz": {
        action: "Live PSAdapter_plugin_Txtz",
        type: "menu",
        loc: {
          en: "Effect > Texture > Texturizer...",
          de: "Effekt > Strukturierungsfilter > Mit Struktur versehen …",
          ru: "Эффект > Текстура > Текстуризатор…",
        },
      },
      "menu_Live PSAdapter_plugin_Dntr": {
        action: "Live PSAdapter_plugin_Dntr",
        type: "menu",
        loc: {
          en: "Effect > Video > De-Interlace...",
          de: "Effekt > Videofilter > De-Interlace …",
          ru: "Эффект > Видео > Устранение чересстрочной развертки...",
        },
      },
      "menu_Live PSAdapter_plugin_NTSC": {
        action: "Live PSAdapter_plugin_NTSC",
        type: "menu",
        loc: {
          en: "Effect > Video > NTSC Colors",
          de: "Effekt > Videofilter > NTSC-Farben",
          ru: "Эффект > Видео > Цвета NTSC",
        },
      },
      menu_preview: {
        action: "preview",
        type: "menu",
        loc: {
          en: "View > Outline / Preview",
          de: "Ansicht > Vorschau / Pfadansicht",
          ru: "Просмотр > Контуры / Иллюстрация",
        },
      },
      "menu_GPU Preview": {
        action: "GPU Preview",
        type: "menu",
        loc: {
          en: "View > GPU Preview / Preview on CPU",
          de: "Ansicht > Mit GPU anzeigen / Mit CPU anzeigen",
          ru: "Просмотр > Просмотр с использованием ЦП / ГП",
        },
      },
      menu_ink: {
        action: "ink",
        type: "menu",
        loc: {
          en: "View > Overprint Preview",
          de: "Ansicht > Überdruckenvorschau",
          ru: "Просмотр > Просмотр наложения цветов",
        },
      },
      menu_raster: {
        action: "raster",
        type: "menu",
        loc: {
          en: "View > Pixel Preview",
          de: "Ansicht > Pixelvorschau",
          ru: "Просмотр > Просмотр в виде пикселов",
        },
      },
      "menu_proof-document": {
        action: "proof-document",
        type: "menu",
        loc: {
          en: "View > Proof Setup > Working CMYK",
          de: "Ansicht > Proof einrichten > Dokument-CMYK",
          ru: "Просмотр > Параметры цветопробы > Рабочее пространство CMYK",
        },
      },
      "menu_proof-mac-rgb": {
        action: "proof-mac-rgb",
        type: "menu",
        loc: {
          en: "View > Proof Setup > Legacy Macintosh RGB (Gamma 1.8)",
          de: "Ansicht > Proof einrichten > Altes Macintosh-RGB (Gamma 1.8)",
          ru: "Просмотр > Параметры цветопробы > Ранняя версия Macintosh RGB (Gamma 1.8)",
        },
      },
      "menu_proof-win-rgb": {
        action: "proof-win-rgb",
        type: "menu",
        loc: {
          en: "View > Proof Setup > Internet Standard RGB (sRGB)",
          de: "Ansicht > Proof einrichten > Internet-Standard-RGB (sRGB)",
          ru: "Просмотр > Параметры цветопробы > Стандартная палитра RGB (sRGB) для сети Интернет",
        },
      },
      "menu_proof-monitor-rgb": {
        action: "proof-monitor-rgb",
        type: "menu",
        loc: {
          en: "View > Proof Setup > Monitor RGB",
          de: "Ansicht > Proof einrichten > Monitor-RGB",
          ru: "Просмотр > Параметры цветопробы > Палитра RGB монитора",
        },
      },
      "menu_proof-colorblindp": {
        action: "proof-colorblindp",
        type: "menu",
        loc: {
          en: "View > Proof Setup > Color blindness - Protanopia-type",
          de: "Ansicht > Proof einrichten > Farbenblindheit (Protanopie)",
          ru: "Просмотр > Параметры цветопробы > Дальтонизм - протанопия",
        },
      },
      "menu_proof-colorblindd": {
        action: "proof-colorblindd",
        type: "menu",
        loc: {
          en: "View > Proof Setup > Color blindness - Deuteranopia-type",
          de: "Ansicht > Proof einrichten > Farbenblindheit (Deuteranopie)",
          ru: "Просмотр > Параметры цветопробы > Дальтонизм - дейтеранопия",
        },
      },
      "menu_proof-custom": {
        action: "proof-custom",
        type: "menu",
        loc: {
          en: "View > Proof Setup > Customize...",
          de: "Ansicht > Proof einrichten > Anpassen …",
          ru: "Просмотр > Параметры цветопробы > Заказные параметры…",
        },
      },
      menu_proofColors: {
        action: "proofColors",
        type: "menu",
        loc: {
          en: "View > Proof Colors",
          de: "Ansicht > Farbproof",
          ru: "Просмотр > Цветопроба",
        },
      },
      menu_zoomin: {
        action: "zoomin",
        type: "menu",
        loc: {
          en: "View > Zoom In",
          de: "Ansicht > Einzoomen",
          ru: "Просмотр > Увеличение",
        },
      },
      menu_zoomout: {
        action: "zoomout",
        type: "menu",
        loc: {
          en: "View > Zoom Out",
          de: "Ansicht > Auszoomen",
          ru: "Просмотр > Уменьшение",
        },
      },
      menu_fitin: {
        action: "fitin",
        type: "menu",
        loc: {
          en: "View > Fit Artboard in Window",
          de: "Ansicht > Zeichenfläche in Fenster einpassen",
          ru: "Просмотр > Подогнать монтажную область по размеру окна",
        },
      },
      menu_fitall: {
        action: "fitall",
        type: "menu",
        loc: {
          en: "View > Fit All in Window",
          de: "Ansicht > Alle in Fenster einpassen",
          ru: "Просмотр > Подогнать все по размеру окна",
        },
      },
      "menu_AISlice Feedback Menu": {
        action: "AISlice Feedback Menu",
        type: "menu",
        loc: {
          en: "View > Show / Hide Slices",
          de: "Ansicht > Slices einblenden / ausblenden",
          ru: "Просмотр > Показать / спрятать фрагменты",
        },
      },
      "menu_AISlice Lock Menu": {
        action: "AISlice Lock Menu",
        type: "menu",
        loc: {
          en: "View > Lock Slices",
          de: "Ansicht > Slices fixieren",
          ru: "Просмотр > Закрепить фрагменты",
        },
      },
      "menu_AI Bounding Box Toggle": {
        action: "AI Bounding Box Toggle",
        type: "menu",
        loc: {
          en: "View > Show / Hide Bounding Box",
          de: "Ansicht > Begrenzungsrahmen einblenden / ausblenden",
          ru: "Просмотр > Показать / спрятать ограничительную рамку",
        },
      },
      "menu_TransparencyGrid Menu Item": {
        action: "TransparencyGrid Menu Item",
        type: "menu",
        loc: {
          en: "View > Show / Hide Transparency Grid",
          de: "Ansicht > Transparenzraster einblenden / ausblenden",
          ru: "Просмотр > Показать / спрятать сетку прозрачности",
        },
      },
      menu_actualsize: {
        action: "actualsize",
        type: "menu",
        loc: {
          en: "View > Actual Size",
          de: "Ansicht > Originalgröße",
          ru: "Просмотр > Реальный размер",
        },
      },
      "menu_Show Gaps Planet X": {
        action: "Show Gaps Planet X",
        type: "menu",
        loc: {
          en: "View > Show / Hide Live Paint Gaps",
          de: "Ansicht > Interaktive Mallücken einblenden / ausblenden",
          ru: "Просмотр > Показать / спрятать зазоры быстрых заливок",
        },
      },
      "menu_Gradient Feedback": {
        action: "Gradient Feedback",
        type: "menu",
        loc: {
          en: "View > Show / Hide Gradient Annotator",
          de: "Ansicht > Verlaufsoptimierer einblenden / ausblenden",
          ru: "Просмотр > Показать / спрятать градиентный аннотатор",
        },
      },
      "menu_Live Corner Annotator": {
        action: "Live Corner Annotator",
        type: "menu",
        loc: {
          en: "View > Show / Hide Corner Widget",
          de: "Ansicht > Ecken-Widget einblenden / ausblenden",
          ru: "Просмотр > Показать / скрыть виджет углов",
        },
        minVersion: 17.1,
      },
      menu_edge: {
        action: "edge",
        type: "menu",
        loc: {
          en: "View > Show / Hide Edges",
          de: "Ansicht > Ecken einblenden / ausblenden",
          ru: "Просмотр > Показать / спрятать границы",
        },
      },
      "menu_Snapomatic on-off menu item": {
        action: "Snapomatic on-off menu item",
        type: "menu",
        loc: {
          en: "View > Smart Guides",
          de: "Ansicht > Intelligente Hilfslinien",
          ru: "Просмотр > Быстрые направляющие",
        },
      },
      "menu_Show Perspective Grid": {
        action: "Show Perspective Grid",
        type: "menu",
        loc: {
          en: "View > Perspective Grid > Show / Hide Grid",
          de: "Ansicht > Perspektivenraster > Raster einblenden / ausblenden",
          ru: "Просмотр > Сетка перспективы > Показать / скрыть сетку",
        },
      },
      "menu_Show Ruler": {
        action: "Show Ruler",
        type: "menu",
        loc: {
          en: "View > Perspective Grid > Show / Hide Rulers",
          de: "Ansicht > Perspektivenraster > Lineale einblenden / ausblenden",
          ru: "Просмотр > Сетка перспективы > Показать / скрыть линейки",
        },
      },
      "menu_Snap to Grid": {
        action: "Snap to Grid",
        type: "menu",
        loc: {
          en: "View > Perspective Grid > Snap to Grid",
          de: "Ansicht > Perspektivenraster > Am Raster ausrichten",
          ru: "Просмотр > Сетка перспективы > Привязать к сетке",
        },
      },
      "menu_Lock Perspective Grid": {
        action: "Lock Perspective Grid",
        type: "menu",
        loc: {
          en: "View > Perspective Grid > Lock Grid",
          de: "Ansicht > Perspektivenraster > Raster sperren",
          ru: "Просмотр > Сетка перспективы > Закрепить сетку",
        },
      },
      "menu_Lock Station Point": {
        action: "Lock Station Point",
        type: "menu",
        loc: {
          en: "View > Perspective Grid > Lock Station Point",
          de: "Ansicht > Perspektivenraster > Bezugspunkt sperren",
          ru: "Просмотр > Сетка перспективы > Закрепить точку наблюдения",
        },
      },
      "menu_Define Perspective Grid": {
        action: "Define Perspective Grid",
        type: "menu",
        loc: {
          en: "View > Perspective Grid > Define Grid",
          de: "Ansicht > Perspektivenraster > Raster definieren",
          ru: "Просмотр > Сетка перспективы > Определить сетку...",
        },
      },
      "menu_Save Perspective Grid as Preset": {
        action: "Save Perspective Grid as Preset",
        type: "menu",
        loc: {
          en: "View > Perspective Grid > Save Grid as Preset",
          de: "Ansicht > Perspektivenraster > Raster als Vorgabe speichern",
          ru: "Просмотр > Сетка перспективы > Сохранить сетку как стиль...",
        },
      },
      menu_artboard: {
        action: "artboard",
        type: "menu",
        loc: {
          en: "View > Show / Hide Artboards",
          de: "Ansicht > Zeichenflächen einblenden / ausblenden",
          ru: "Просмотр > Показать / скрыть монтажные области",
        },
      },
      menu_pagetiling: {
        action: "pagetiling",
        type: "menu",
        loc: {
          en: "View > Show / Hide Print Tiling",
          de: "Ansicht > Druckaufteilung einblenden / ausblenden",
          ru: "Просмотр > Показать / спрятать разбиение для печати",
        },
      },
      menu_showtemplate: {
        action: "showtemplate",
        type: "menu",
        loc: {
          en: "View > Show / Hide Template",
          de: "Ansicht > Vorlage einblenden / ausblenden",
          ru: "Просмотр > Спрятать шаблон",
        },
      },
      menu_ruler: {
        action: "ruler",
        type: "menu",
        loc: {
          en: "View > Rulers > Show / Hide Rulers",
          de: "Ansicht > Lineale > Lineale einblende / ausblendenn",
          ru: "Просмотр > Показать / скрыть линейки",
        },
      },
      menu_rulerCoordinateSystem: {
        action: "rulerCoordinateSystem",
        type: "menu",
        loc: {
          en: "View > Rulers > Change to Global Rulers",
          de: "Ansicht > Lineale > In globale Lineale ändern",
          ru: "Просмотр > Линейки > Сменить на общие линейки / монтажной области",
        },
      },
      menu_videoruler: {
        action: "videoruler",
        type: "menu",
        loc: {
          en: "View > Rulers > Show / Hide Video Rulers",
          de: "Ansicht > Lineale > Videolineale einblenden / ausblenden",
          ru: "Просмотр > Показать / скрыть линейки видео",
        },
      },
      menu_textthreads: {
        action: "textthreads",
        type: "menu",
        loc: {
          en: "View > Show / Hide Text Threads",
          de: "Ansicht > Textverkettungen einblenden / ausblenden",
          ru: "Просмотр > Показать / спрятать связи текстовых блоков",
        },
      },
      menu_showguide: {
        action: "showguide",
        type: "menu",
        loc: {
          en: "View > Guides > Show / Hide Guides",
          de: "Ansicht > Hilfslinien > Hilfslinien einblenden / ausblenden",
          ru: "Просмотр > Направляющие > Показать / спрятать направляющие",
        },
      },
      menu_lockguide: {
        action: "lockguide",
        type: "menu",
        loc: {
          en: "View > Guides > Lock Guides",
          de: "Ansicht > Hilfslinien > Hilfslinien sperren",
          ru: "Просмотр > Направляющие > Закрепить направляющие",
        },
      },
      menu_makeguide: {
        action: "makeguide",
        type: "menu",
        loc: {
          en: "View > Guides > Make Guides",
          de: "Ansicht > Hilfslinien > Hilfslinien erstellen",
          ru: "Просмотр > Направляющие > Создать направляющие",
        },
      },
      menu_releaseguide: {
        action: "releaseguide",
        type: "menu",
        loc: {
          en: "View > Guides > Release Guides",
          de: "Ansicht > Hilfslinien > Hilfslinien zurückwandeln",
          ru: "Просмотр > Направляющие > Освободить направляющие",
        },
      },
      menu_clearguide: {
        action: "clearguide",
        type: "menu",
        loc: {
          en: "View > Guides > Clear Guides",
          de: "Ansicht > Hilfslinien > Hilfslinien löschen",
          ru: "Просмотр > Направляющие > Удалить направляющие",
        },
      },
      menu_showgrid: {
        action: "showgrid",
        type: "menu",
        loc: {
          en: "View > Show / Hide Grid",
          de: "Ansicht > Raster einblenden / ausblenden",
          ru: "Просмотр > Показать / спрятать сетку",
        },
      },
      menu_snapgrid: {
        action: "snapgrid",
        type: "menu",
        loc: {
          en: "View > Snap to Grid",
          de: "Ansicht > Am Raster ausrichten",
          ru: "Просмотр > Выравнивать по сетке",
        },
      },
      menu_snappoint: {
        action: "snappoint",
        type: "menu",
        loc: {
          en: "View > Snap to Point",
          de: "Ansicht > An Punkt ausrichten",
          ru: "Просмотр > Выравнивать по точкам",
        },
      },
      menu_newview: {
        action: "newview",
        type: "menu",
        loc: {
          en: "View > New View...",
          de: "Ansicht > Neue Ansicht …",
          ru: "Просмотр > Новый вид…",
        },
      },
      menu_editview: {
        action: "editview",
        type: "menu",
        loc: {
          en: "View > Edit Views...",
          de: "Ansicht > Ansicht bearbeiten …",
          ru: "Просмотр > Редактировать виды…",
        },
      },
      menu_newwindow: {
        action: "newwindow",
        type: "menu",
        loc: {
          en: "Window > New Window",
          de: "Fenster > Neues Fenster",
          ru: "Окно > Новое окно",
        },
      },
      menu_cascade: {
        action: "cascade",
        type: "menu",
        loc: {
          en: "Window > Arrange > Cascade",
          de: "Fenster > Anordnen > Überlappend",
          ru: "Окно > Упорядить > Каскадом",
        },
      },
      menu_tile: {
        action: "tile",
        type: "menu",
        loc: {
          en: "Window > Arrange > Tile",
          de: "Fenster > Anordnen > Nebeneinander",
          ru: "Окно > Упорядить > Мозаикой",
        },
      },
      menu_floatInWindow: {
        action: "floatInWindow",
        type: "menu",
        loc: {
          en: "Window > Arrange > Float in Window",
          de: "Fenster > Anordnen > In Fenster verschiebbar machen",
          ru: "Окно > Упорядить > Плавающее в окне",
        },
      },
      menu_floatAllInWindows: {
        action: "floatAllInWindows",
        type: "menu",
        loc: {
          en: "Window > Arrange > Float All in Windows",
          de: "Fenster > Anordnen > Alle in Fenstern verschiebbar machen",
          ru: "Окно > Упорядить > Все плавающие в окнах",
        },
      },
      menu_consolidateAllWindows: {
        action: "consolidateAllWindows",
        type: "menu",
        loc: {
          en: "Window > Arrange > Consolidate All Windows",
          de: "Fenster > Anordnen > Alle Fenster zusammenführen",
          ru: "Окно > Упорядить > Объединить все окна",
        },
      },
      "menu_Adobe Reset Workspace": {
        action: "Adobe Reset Workspace",
        type: "menu",
        loc: {
          en: "Window > Reset Workspace",
          de: "Fenster > Arbeitsbereich > Zurücksetzen",
          ru: "Окно > Восстановить рабочую среду",
        },
      },
      "menu_Adobe New Workspace": {
        action: "Adobe New Workspace",
        type: "menu",
        loc: {
          en: "Window > Workspace > New Workspace...",
          de: "Fenster > Arbeitsbereich > Neuer Arbeitsbereich …",
          ru: "Окно > Рабочая среда > Создать рабочую среду...",
        },
      },
      "menu_Adobe Manage Workspace": {
        action: "Adobe Manage Workspace",
        type: "menu",
        loc: {
          en: "Window > Workspace > Manage Workspaces...",
          de: "Fenster > Arbeitsbereich > Arbeitsbereiche verwalten …",
          ru: "Окно > Рабочая среда > Управление рабочими средами...",
        },
      },
      "menu_Browse Add-Ons Menu": {
        action: "Browse Add-Ons Menu",
        type: "menu",
        loc: {
          en: "Window > Find Extensions on Exchange...",
          de: "Fenster > Erweiterungen auf Exchange suchen …",
          ru: "Окно > Поиск расширений на Exchange...",
        },
        minVersion: 19,
      },
      "menu_drover control palette plugin": {
        action: "drover control palette plugin",
        type: "menu",
        loc: {
          en: "Window > Control",
          de: "Fenster > Steuerung",
          ru: "Окно > Панель управления",
        },
      },
      "menu_Adobe Advanced Toolbar Menu": {
        action: "Adobe Advanced Toolbar Menu",
        type: "menu",
        loc: {
          en: "Window > Toolbars > Advanced",
          de: "Fenster > Werkzeugleisten > Erweitert",
          ru: "Окно > Панели инструментов > Дополнительные",
        },
        minVersion: 23,
      },
      "menu_Adobe Basic Toolbar Menu": {
        action: "Adobe Basic Toolbar Menu",
        type: "menu",
        loc: {
          en: "Window > Toolbars > Basic",
          de: "Fenster > Werkzeugleisten > Einfach",
          ru: "Окно > Панели инструментов > Основные",
        },
        minVersion: 23,
      },
      "menu_New Tools Panel": {
        action: "New Tools Panel",
        type: "menu",
        loc: {
          en: "Window > Toolbars > New Toolbar...",
          de: "Fenster > Werkzeugleisten > Neue Werkzeugleiste …",
          ru: "Окно > Панели инструментов > Новая панель инструментов...",
        },
        minVersion: 17,
      },
      "menu_Manage Tools Panel": {
        action: "Manage Tools Panel",
        type: "menu",
        loc: {
          en: "Window > Toolbars > Manage Toolbar...",
          de: "Fenster > Werkzeugleisten > Werkzeugleisten verwalten …",
          ru: "Окно > Панели инструментов > Управление панелями инструментов...",
        },
        minVersion: 17,
      },
      "menu_Adobe 3D Panel": {
        action: "Adobe 3D Panel",
        type: "menu",
        loc: {
          en: "Window > 3D and Materials",
          de: "Fenster > 3D und Materialien",
          ru: "Окно > 3D и материалы",
        },
        minVersion: 26,
      },
      "menu_Adobe Action Palette": {
        action: "Adobe Action Palette",
        type: "menu",
        loc: {
          en: "Window > Actions",
          de: "Fenster > Aktionen",
          ru: "Окно > Операции",
        },
      },
      menu_AdobeAlignObjects2: {
        action: "AdobeAlignObjects2",
        type: "menu",
        loc: {
          en: "Window > Align",
          de: "Fenster > Ausrichten",
          ru: "Окно > Выравнивание",
        },
      },
      "menu_Style Palette": {
        action: "Style Palette",
        type: "menu",
        loc: {
          en: "Window > Appearance",
          de: "Fenster > Aussehen",
          ru: "Окно > Оформление",
        },
      },
      "menu_Adobe Artboard Palette": {
        action: "Adobe Artboard Palette",
        type: "menu",
        loc: {
          en: "Window > Artboards",
          de: "Fenster > Zeichenflächen",
          ru: "Окно > Монтажные области",
        },
      },
      "menu_Adobe SmartExport Panel Menu Item": {
        action: "Adobe SmartExport Panel Menu Item",
        type: "menu",
        loc: {
          en: "Window > Asset Export",
          de: "Fenster > Export von Element",
          ru: "Окно > Экспорт ресурсов",
        },
        minVersion: 20,
      },
      "menu_internal palettes posing as plug-in menus-attributes": {
        action: "internal palettes posing as plug-in menus-attributes",
        type: "menu",
        loc: {
          en: "Window > Attributes",
          de: "Fenster > Attribute",
          ru: "Окно > Атрибуты",
        },
      },
      "menu_Adobe BrushManager Menu Item": {
        action: "Adobe BrushManager Menu Item",
        type: "menu",
        loc: { en: "Window > Brushes", de: "Fenster > Pinsel", ru: "Окно > Кисти" },
      },
      "menu_Adobe Color Palette": {
        action: "Adobe Color Palette",
        type: "menu",
        loc: { en: "Window > Color", de: "Fenster > Farbe", ru: "Окно > Цвет" },
      },
      "menu_Adobe Harmony Palette": {
        action: "Adobe Harmony Palette",
        type: "menu",
        loc: {
          en: "Window > Color Guide",
          de: "Fenster > Farbhilfe",
          ru: "Окно > Каталог цветов",
        },
      },
      "menu_Adobe Illustrator Kuler Panel": {
        action: "Adobe Illustrator Kuler Panel",
        type: "menu",
        loc: { en: "Window > Color Themes", de: "", ru: "" },
        minVersion: 22,
        maxVersion: 25.9,
      },
      "menu_Adobe Commenting Palette": {
        action: "Adobe Commenting Palette",
        type: "menu",
        loc: {
          en: "Window > Comments",
          de: "Fenster > Kommentare",
          ru: "Окно > Комментарии",
        },
        minVersion: 26,
      },
      "menu_CSS Menu Item": {
        action: "CSS Menu Item",
        type: "menu",
        loc: {
          en: "Window > CSS Properties",
          de: "CSS-Eigenschaften",
          ru: "Окно > Свойства CSS",
        },
      },
      menu_DocInfo1: {
        action: "DocInfo1",
        type: "menu",
        loc: {
          en: "Window > Document Info",
          de: "Fenster > Dokumentinformationen",
          ru: "Окно > Информация о документе",
        },
      },
      "menu_Adobe Flattening Preview": {
        action: "Adobe Flattening Preview",
        type: "menu",
        loc: {
          en: "Window > Flattener Preview",
          de: "Fenster > Reduzierungsvorschau",
          ru: "Окно > Просмотр результатов сведения",
        },
      },
      "menu_Adobe Gradient Palette": {
        action: "Adobe Gradient Palette",
        type: "menu",
        loc: {
          en: "Window > Gradient",
          de: "Fenster > Verlauf",
          ru: "Окно > Градиент",
        },
      },
      "menu_Adobe Style Palette": {
        action: "Adobe Style Palette",
        type: "menu",
        loc: {
          en: "Window > Graphic Styles",
          de: "Fenster > Grafikstile",
          ru: "Окно > Стили графики",
        },
      },
      "menu_Adobe HistoryPanel Menu Item": {
        action: "Adobe HistoryPanel Menu Item",
        type: "menu",
        loc: {
          en: "Window > History",
          de: "Fenster > Versionsverlauf",
          ru: "Окно > История",
        },
        minVersion: 26.4,
        maxVersion: 26.9,
      },
      "menu_Adobe History Panel Menu Item": {
        action: "Adobe History Panel Menu Item",
        type: "menu",
        loc: {
          en: "Window > History",
          de: "Fenster > Versionsverlauf",
          ru: "Окно > История",
        },
        minVersion: 27,
      },
      "menu_Adobe Vectorize Panel": {
        action: "Adobe Vectorize Panel",
        type: "menu",
        loc: { en: "Window > Image Trace", de: "", ru: "" },
      },
      "menu_internal palettes posing as plug-in menus-info": {
        action: "internal palettes posing as plug-in menus-info",
        type: "menu",
        loc: { en: "Window > Info", de: "Fenster > Info", ru: "Окно > Информация" },
      },
      menu_AdobeLayerPalette1: {
        action: "AdobeLayerPalette1",
        type: "menu",
        loc: { en: "Window > Layers", de: "Fenster > Ebenen", ru: "Окно > Слои" },
      },
      "menu_Adobe Learn Panel Menu Item": {
        action: "Adobe Learn Panel Menu Item",
        type: "menu",
        loc: { en: "Window > Learn", de: "", ru: "" },
        minVersion: 22,
        maxVersion: 25.9,
      },
      "menu_Adobe CSXS Extension com.adobe.DesignLibraries.angularLibraries": {
        action: "Adobe CSXS Extension com.adobe.DesignLibraries.angularLibraries",
        type: "menu",
        loc: {
          en: "Window > Libraries",
          de: "Fenster > Bibliotheken",
          ru: "Окно > Библиотеки",
        },
      },
      "menu_Adobe LinkPalette Menu Item": {
        action: "Adobe LinkPalette Menu Item",
        type: "menu",
        loc: {
          en: "Window > Links",
          de: "Fenster > Verknüpfungen",
          ru: "Окно > Связи",
        },
      },
      "menu_AI Magic Wand": {
        action: "AI Magic Wand",
        type: "menu",
        loc: {
          en: "Window > Magic Wand",
          de: "Fenster > Zauberstab",
          ru: "Окно > Волшебная палочка",
        },
      },
      menu_AdobeNavigator: {
        action: "AdobeNavigator",
        type: "menu",
        loc: {
          en: "Window > Navigator",
          de: "Fenster > Navigator",
          ru: "Окно > Навигатор",
        },
      },
      "menu_Adobe PathfinderUI": {
        action: "Adobe PathfinderUI",
        type: "menu",
        loc: {
          en: "Window > Pathfinder",
          de: "Fenster > Pathfinder",
          ru: "Окно > Обработка контуров",
        },
      },
      "menu_Adobe Pattern Panel Toggle": {
        action: "Adobe Pattern Panel Toggle",
        type: "menu",
        loc: {
          en: "Window > Pattern Options",
          de: "Fenster > Musteroptionen",
          ru: "Окно > Параметры узора",
        },
      },
      "menu_Adobe Property Palette": {
        action: "Adobe Property Palette",
        type: "menu",
        loc: {
          en: "Window > Properties",
          de: "Fenster > Eigenschaften",
          ru: "Окно > Свойства",
        },
        minVersion: 26,
      },
      "menu_Adobe Separation Preview Panel": {
        action: "Adobe Separation Preview Panel",
        type: "menu",
        loc: {
          en: "Window > Separations Preview",
          de: "Fenster > Separationenvorschau",
          ru: "Окно > Просмотр цветоделений",
        },
      },
      "menu_Adobe Stroke Palette": {
        action: "Adobe Stroke Palette",
        type: "menu",
        loc: { en: "Window > Stroke", de: "Fenster > Kontur", ru: "Окно > Обводка" },
      },
      "menu_Adobe SVG Interactivity Palette": {
        action: "Adobe SVG Interactivity Palette",
        type: "menu",
        loc: {
          en: "Window > SVG Interactivity",
          de: "Fenster > SVG-Interaktivität",
          ru: "Окно > Интерактивность SVG",
        },
      },
      "menu_Adobe Swatches Menu Item": {
        action: "Adobe Swatches Menu Item",
        type: "menu",
        loc: {
          en: "Window > Swatches",
          de: "Fenster > Farbfelder",
          ru: "Окно > Образцы",
        },
      },
      "menu_Adobe Symbol Palette": {
        action: "Adobe Symbol Palette",
        type: "menu",
        loc: { en: "Window > Symbols", de: "Fenster > Symbole", ru: "Окно > Символы" },
      },
      menu_AdobeTransformObjects1: {
        action: "AdobeTransformObjects1",
        type: "menu",
        loc: {
          en: "Window > Transform",
          de: "Fenster > Transformieren",
          ru: "Окно > Трансформирование",
        },
      },
      "menu_Adobe Transparency Palette Menu Item": {
        action: "Adobe Transparency Palette Menu Item",
        type: "menu",
        loc: {
          en: "Window > Transparency",
          de: "Fenster > Transparenz",
          ru: "Окно > Прозрачность",
        },
      },
      "menu_internal palettes posing as plug-in menus-character": {
        action: "internal palettes posing as plug-in menus-character",
        type: "menu",
        loc: {
          en: "Window > Type > Character",
          de: "Fenster > Schrift > Zeichen",
          ru: "Окно > Текст > Символ",
        },
      },
      "menu_Character Styles": {
        action: "Character Styles",
        type: "menu",
        loc: {
          en: "Window > Type > Character Styles",
          de: "Fenster > Schrift > Zeichenformate",
          ru: "Окно > Текст > Стили символов",
        },
      },
      "menu_alternate glyph palette plugin 2": {
        action: "alternate glyph palette plugin 2",
        type: "menu",
        loc: {
          en: "Window > Type > Glyphs",
          de: "Fenster > Schrift > Glyphen",
          ru: "Окно > Текст > Глифы",
        },
      },
      "menu_internal palettes posing as plug-in menus-opentype": {
        action: "internal palettes posing as plug-in menus-opentype",
        type: "menu",
        loc: {
          en: "Window > Type > OpenType",
          de: "Fenster > Schrift > OpenType",
          ru: "Окно > Текст > OpenType",
        },
      },
      "menu_internal palettes posing as plug-in menus-paragraph": {
        action: "internal palettes posing as plug-in menus-paragraph",
        type: "menu",
        loc: {
          en: "Window > Type > Paragraph",
          de: "Fenster > Schrift > Absatz",
          ru: "Окно > Текст > Абзац",
        },
      },
      "menu_Adobe Paragraph Styles Palette": {
        action: "Adobe Paragraph Styles Palette",
        type: "menu",
        loc: {
          en: "Window > Type > Paragraph Styles",
          de: "Fenster > Schrift > Absatzformate",
          ru: "Окно > Текст > Стили абзацев",
        },
      },
      "menu_internal palettes posing as plug-in menus-tab": {
        action: "internal palettes posing as plug-in menus-tab",
        type: "menu",
        loc: {
          en: "Window > Type > Tabs",
          de: "Fenster > Schrift > Tabulatoren",
          ru: "Окно > Текст > Табуляция",
        },
      },
      "menu_Adobe Variables Palette Menu Item": {
        action: "Adobe Variables Palette Menu Item",
        type: "menu",
        loc: {
          en: "Window > Variables",
          de: "Fenster > Variablen",
          ru: "Окно > Переменные",
        },
      },
      "menu_Adobe Version History File Menu Item": {
        action: "Adobe Version History File Menu Item",
        type: "menu",
        loc: {
          en: "Window > Version History",
          de: "Fenster > Versionsverlauf",
          ru: "Окно > Журнал версий",
        },
        minVersion: 26,
      },
      "menu_AdobeBrushMgrUI Other libraries menu item": {
        action: "AdobeBrushMgrUI Other libraries menu item",
        type: "menu",
        loc: {
          en: "Window > Brush Libraries > Other Library",
          de: "Fenster > Pinsel-Bibliotheken > Andere Bibliothek …",
          ru: "Окно > Библиотеки кистей > Другая библиотека...",
        },
      },
      "menu_Adobe Art Style Plugin Other libraries menu item": {
        action: "Adobe Art Style Plugin Other libraries menu item",
        type: "menu",
        loc: {
          en: "Window > Graphic Style Libraries > Other Library...",
          de: "Fenster > Grafikstil-Bibliotheken > Andere Bibliothek …",
          ru: "Окно > Библиотеки стилей графики > Другая библиотека...",
        },
      },
      "menu_AdobeSwatch_ Other libraries menu item": {
        action: "AdobeSwatch_ Other libraries menu item",
        type: "menu",
        loc: {
          en: "Window > Swatch Libraries > Other Library...",
          de: "Fenster > Farbfeld-Bibliotheken > Andere Bibliothek …",
          ru: "Окно > Библиотеки образцов > Другая библиотека...",
        },
      },
      "menu_Adobe Symbol Palette Plugin Other libraries menu item": {
        action: "Adobe Symbol Palette Plugin Other libraries menu item",
        type: "menu",
        loc: {
          en: "Window > Symbol Libraries > Other Library...",
          de: "Fenster > Symbol-Bibliotheken > Andere Bibliothek …",
          ru: "Окно > Библиотеки символов > Другая библиотека...",
        },
      },
      menu_helpcontent: {
        action: "helpcontent",
        type: "menu",
        loc: {
          en: "Help > Illustrator Help...",
          de: "Hilfe > Illustrator-Hilfe …",
          ru: "Справка > Справка программы Illustrator...",
        },
      },
      menu_supportCommunity: {
        action: "supportCommunity",
        type: "menu",
        loc: {
          en: "Help > Support Community",
          de: "Hilfe > Support-Community",
          ru: "Справка > Сообщество службы поддержки",
        },
        minVersion: 26,
      },
      menu_wishform: {
        action: "wishform",
        type: "menu",
        loc: {
          en: "Help > Submit Bug/Feature Request...",
          de: "Hilfe > Fehlermeldung / Funktionswunsch senden …",
          ru: "Справка > Сообщение об ошибке/запрос на добавление новых функций...",
        },
        minVersion: 25,
      },
      "menu_System Info": {
        action: "System Info",
        type: "menu",
        loc: {
          en: "Help > System Info...",
          de: "Hilfe > Systeminformationen …",
          ru: "Справка > Информация о системе…",
        },
      },
      "menu_Adobe Actions Batch": {
        action: "Adobe Actions Batch",
        type: "menu",
        loc: {
          en: "Palette > Actions > Batch...",
          de: "Anderes Bedienfeld > Aktionsstapel …",
          ru: "Палитра > Операции > Пакетная обработка…",
        },
      },
      "menu_Adobe New Fill Shortcut": {
        action: "Adobe New Fill Shortcut",
        type: "menu",
        loc: {
          en: "Palette > Appearance > Add New Fill",
          de: "Anderes Bedienfeld > Neue Fläche hinzufügen",
          ru: "Палитра > Оформление > Добавить новую заливку",
        },
      },
      "menu_Adobe New Stroke Shortcut": {
        action: "Adobe New Stroke Shortcut",
        type: "menu",
        loc: {
          en: "Palette > Appearance > Add New Stroke",
          de: "Anderes Bedienfeld > Neue Kontur hinzufügen",
          ru: "Палитра > Оформление > Добавить новую обводку",
        },
      },
      "menu_Adobe New Style Shortcut": {
        action: "Adobe New Style Shortcut",
        type: "menu",
        loc: {
          en: "Palette > Graphic Styles > New Graphic Style...",
          de: "Anderes Bedienfeld > Neuer Grafikstil …",
          ru: "Палитра > Стили графики > Новый стиль графики",
        },
      },
      menu_AdobeLayerPalette2: {
        action: "AdobeLayerPalette2",
        type: "menu",
        loc: {
          en: "Palette > Layers > New Layer",
          de: "Anderes Bedienfeld > Neue Ebene",
          ru: "Палитра > Слои > Создать новый слой",
        },
      },
      menu_AdobeLayerPalette3: {
        action: "AdobeLayerPalette3",
        type: "menu",
        loc: {
          en: "Palette > Layers > New Layer with Dialog...",
          de: "Anderes Bedienfeld > Neue Ebene mit Dialog …",
          ru: "Палитра > Слои > Создать новый с параметрами...",
        },
      },
      "menu_Adobe Update Link Shortcut": {
        action: "Adobe Update Link Shortcut",
        type: "menu",
        loc: {
          en: "Palette > Links > Update Link",
          de: "Anderes Bedienfeld > Verknüpfung aktualisieren",
          ru: "Палитра > Связи > Обновить связь",
        },
      },
      "menu_Adobe New Swatch Shortcut Menu": {
        action: "Adobe New Swatch Shortcut Menu",
        type: "menu",
        loc: {
          en: "Palette > Swatches > New Swatch...",
          de: "Anderes Bedienfeld > Neues Farbfeld …",
          ru: "Палитра > Образцы > Новый образец",
        },
      },
      "menu_Adobe New Symbol Shortcut": {
        action: "Adobe New Symbol Shortcut",
        type: "menu",
        loc: {
          en: "Palette > Symbols > New Symbol...",
          de: "Anderes Bedienfeld > Neues Symbol …",
          ru: "Палитра > Символы > Новый символ",
        },
      },
      menu_about: {
        action: "about",
        type: "menu",
        loc: {
          en: "About Illustrator...",
          de: "Über Illustrator …",
          ru: "О программе Illustrator…",
        },
      },
      menu_preference: {
        action: "preference",
        type: "menu",
        loc: {
          en: "Preferences > General...",
          de: "Voreinstellungen > Allgemein …",
          ru: "Установки > Основные…",
        },
      },
      menu_selectPref: {
        action: "selectPref",
        type: "menu",
        loc: {
          en: "Preferences > Selection & Anchor Display...",
          de: "Voreinstellungen > Auswahl und Ankerpunkt-Anzeige …",
          ru: "Установки > Отображение выделения и опорных точек…",
        },
      },
      menu_keyboardPref: {
        action: "keyboardPref",
        type: "menu",
        loc: {
          en: "Preferences > Type...",
          de: "Voreinstellungen > Schrift …",
          ru: "Установки > Текст…",
        },
      },
      menu_unitundoPref: {
        action: "unitundoPref",
        type: "menu",
        loc: {
          en: "Preferences > Units...",
          de: "Voreinstellungen > Einheit …",
          ru: "Установки > Единицы измерения…",
        },
      },
      menu_guidegridPref: {
        action: "guidegridPref",
        type: "menu",
        loc: {
          en: "Preferences > Guides & Grid...",
          de: "Voreinstellungen > Hilfslinien und Raster …",
          ru: "Установки > Направляющие и сетка…",
        },
      },
      menu_snapPref: {
        action: "snapPref",
        type: "menu",
        loc: {
          en: "Preferences > Smart Guides...",
          de: "Voreinstellungen > Intelligente Hilfslinien …",
          ru: "Установки > Быстрые направляющие…",
        },
      },
      menu_slicePref: {
        action: "slicePref",
        type: "menu",
        loc: {
          en: "Preferences > Slices...",
          de: "Voreinstellungen > Slices …",
          ru: "Установки > Фрагменты…",
        },
      },
      menu_hyphenPref: {
        action: "hyphenPref",
        type: "menu",
        loc: {
          en: "Preferences > Hyphenation...",
          de: "Voreinstellungen > Silbentrennung …",
          ru: "Установки > Расстановка переносов…",
        },
      },
      menu_pluginPref: {
        action: "pluginPref",
        type: "menu",
        loc: {
          en: "Preferences > Plug-ins & Scratch Disks...",
          de: "Voreinstellungen > Zusatzmodule und virtueller Speicher …",
          ru: "Установки > Внешние модули и рабочие диски…",
        },
      },
      menu_UIPref: {
        action: "UIPref",
        type: "menu",
        loc: {
          en: "Preferences > User Interface...",
          de: "Voreinstellungen > Benutzeroberfläche …",
          ru: "Установки > Интерфейс пользователя…",
        },
      },
      menu_GPUPerformancePref: {
        action: "GPUPerformancePref",
        type: "menu",
        loc: {
          en: "Preferences > Performance",
          de: "Voreinstellungen > Leistung …",
          ru: "Установки > Производительность…",
        },
        minVersion: 19,
      },
      menu_FilePref: {
        action: "FilePref",
        type: "menu",
        loc: {
          en: "Preferences > File Handling...",
          de: "Voreinstellungen > Dateihandhabung…",
          ru: "Установки > Обработка файлов…",
        },
      },
      menu_ClipboardPref: {
        action: "ClipboardPref",
        type: "menu",
        loc: {
          en: "Preferences > Clipboard Handling",
          de: "Voreinstellungen > Zwischenablageoptionen …",
          ru: "Установки > Обработка буфера…",
        },
        minVersion: 25,
      },
      menu_BlackPref: {
        action: "BlackPref",
        type: "menu",
        loc: {
          en: "Preferences > Appearance of Black...",
          de: "Bearbeiten > Voreinstellungen > Aussehen von Schwarz …",
          ru: "Установки > Воспроизведение черного цвета...",
        },
      },
      menu_DevicesPref: {
        action: "DevicesPref",
        type: "menu",
        loc: {
          en: "Preferences > Devices",
          de: "Voreinstellungen > Geräte …",
          ru: "Установки > Устройства…",
        },
        minVersion: 24,
      },
      "menu_Debug Panel": {
        action: "Debug Panel",
        type: "menu",
        loc: { en: "Debug Panel", de: "", ru: "" },
      },
    },
    tool: {
      "tool_Adobe Add Anchor Point Tool": {
        action: "Adobe Add Anchor Point Tool",
        type: "tool",
        loc: {
          en: "Add Anchor Point Tool",
          de: "Ankerpunkt-hinzufügen-Werkzeug",
          ru: "Инструмент: Добавить опорную точку",
        },
        minVersion: 24,
      },
      "tool_Adobe Anchor Point Tool": {
        action: "Adobe Anchor Point Tool",
        type: "tool",
        loc: {
          en: "Anchor Point Tool",
          de: "Ankerpunkt-Werkzeug",
          ru: "Инструмент: Опорная точка",
        },
        minVersion: 24,
      },
      "tool_Adobe Arc Tool": {
        action: "Adobe Arc Tool",
        type: "tool",
        loc: { en: "Arc Tool", de: "Bogen-Werkzeug", ru: "Инструмент: Дуга" },
        minVersion: 24,
      },
      "tool_Adobe Area Graph Tool": {
        action: "Adobe Area Graph Tool",
        type: "tool",
        loc: {
          en: "Area Graph Tool",
          de: "Flächendiagramm",
          ru: "Инструмент: Диаграмма с областями",
        },
        minVersion: 24,
      },
      "tool_Adobe Area Type Tool": {
        action: "Adobe Area Type Tool",
        type: "tool",
        loc: {
          en: "Area Type Tool",
          de: "Flächentext-Werkzeug",
          ru: "Инструмент: Текст в области",
        },
        minVersion: 24,
      },
      "tool_Adobe Crop Tool": {
        action: "Adobe Crop Tool",
        type: "tool",
        loc: {
          en: "Artboard Tool",
          de: "Zeichenflächen-Werkzeug",
          ru: "Инструмент: Монтажная область",
        },
        minVersion: 24,
      },
      "tool_Adobe Bar Graph Tool": {
        action: "Adobe Bar Graph Tool",
        type: "tool",
        loc: {
          en: "Bar Graph Tool",
          de: "Horizontales Balkendiagramm",
          ru: "Инструмент: Диаграмма горизонтальные полосы",
        },
        minVersion: 24,
      },
      "tool_Adobe Blend Tool": {
        action: "Adobe Blend Tool",
        type: "tool",
        loc: { en: "Blend Tool", de: "Angleichen-Werkzeug", ru: "Инструмент: Переход" },
        minVersion: 24,
      },
      "tool_Adobe Bloat Tool": {
        action: "Adobe Bloat Tool",
        type: "tool",
        loc: {
          en: "Bloat Tool",
          de: "Aufblasen-Werkzeug",
          ru: "Инструмент: Раздувание",
        },
        minVersion: 24,
      },
      "tool_Adobe Blob Brush Tool": {
        action: "Adobe Blob Brush Tool",
        type: "tool",
        loc: {
          en: "Blob Brush Tool",
          de: "Tropfenpinsel-Werkzeug",
          ru: "Инструмент: Кисть-клякса",
        },
        minVersion: 24,
      },
      "tool_Adobe Column Graph Tool": {
        action: "Adobe Column Graph Tool",
        type: "tool",
        loc: {
          en: "Column Graph Tool",
          de: "Vertikales Balkendiagramm",
          ru: "Инструмент: Диаграмма вертикальные полосы",
        },
        minVersion: 24,
      },
      "tool_Adobe Cyrstallize Tool": {
        action: "Adobe Cyrstallize Tool",
        type: "tool",
        loc: {
          en: "Crystallize Tool",
          de: "Kristallisieren-Werkzeug",
          ru: "Инструмент: Кристаллизация",
        },
        minVersion: 24,
      },
      "tool_Adobe Curvature Tool": {
        action: "Adobe Curvature Tool",
        type: "tool",
        loc: { en: "Curvature Tool", de: "Kurvenzeichner", ru: "Инструмент: Кривизна" },
        minVersion: 24,
      },
      "tool_Adobe Delete Anchor Point Tool": {
        action: "Adobe Delete Anchor Point Tool",
        type: "tool",
        loc: {
          en: "Delete Anchor Point Tool",
          de: "Ankerpunkt-löschen-Werkzeug",
          ru: "Инструмент: Удалить опорную точку",
        },
        minVersion: 24,
      },
      "tool_Adobe Direct Select Tool": {
        action: "Adobe Direct Select Tool",
        type: "tool",
        loc: {
          en: "Direct Selection Tool",
          de: "Direktauswahl-Werkzeug",
          ru: "Инструмент: Прямое выделение",
        },
        minVersion: 24,
      },
      "tool_Adobe Ellipse Shape Tool": {
        action: "Adobe Ellipse Shape Tool",
        type: "tool",
        loc: { en: "Ellipse Tool", de: "Ellipse-Werkzeug", ru: "Инструмент: Эллипс" },
        minVersion: 24,
      },
      "tool_Adobe Eraser Tool": {
        action: "Adobe Eraser Tool",
        type: "tool",
        loc: {
          en: "Eraser Tool",
          de: "Radiergummi-Werkzeug",
          ru: "Инструмент: Ластик",
        },
        minVersion: 24,
      },
      "tool_Adobe Eyedropper Tool": {
        action: "Adobe Eyedropper Tool",
        type: "tool",
        loc: {
          en: "Eyedropper Tool",
          de: "Pipette-Werkzeug",
          ru: "Инструмент: Пипетка",
        },
        minVersion: 24,
      },
      "tool_Adobe Flare Tool": {
        action: "Adobe Flare Tool",
        type: "tool",
        loc: { en: "Flare Tool", de: "Blendenflecke-Werkzeug", ru: "Инструмент: Блик" },
        minVersion: 24,
      },
      "tool_Adobe Free Transform Tool": {
        action: "Adobe Free Transform Tool",
        type: "tool",
        loc: {
          en: "Free Transform Tool",
          de: "Frei-transformieren-Werkzeug",
          ru: "Инструмент: Свободное трансформирование",
        },
        minVersion: 24,
      },
      "tool_Adobe Gradient Vector Tool": {
        action: "Adobe Gradient Vector Tool",
        type: "tool",
        loc: {
          en: "Gradient Tool",
          de: "Verlauf-Werkzeug",
          ru: "Инструмент: Градиент",
        },
        minVersion: 24,
      },
      "tool_Adobe Direct Object Select Tool": {
        action: "Adobe Direct Object Select Tool",
        type: "tool",
        loc: {
          en: "Group Selection Tool",
          de: "Gruppenauswahl-Werkzeug",
          ru: "Инструмент: Групповое выделение",
        },
        minVersion: 24,
      },
      "tool_Adobe Scroll Tool": {
        action: "Adobe Scroll Tool",
        type: "tool",
        loc: { en: "Hand Tool", de: "Hand-Werkzeug", ru: "Инструмент: Рука" },
        minVersion: 24,
      },
      "tool_Adobe Intertwine Zone Marker Tool": {
        action: "Adobe Intertwine Zone Marker Tool",
        type: "tool",
        loc: { en: "Intertwine Tool", de: "", ru: "" },
        minVersion: 27,
      },
      "tool_Adobe Corner Join Tool": {
        action: "Adobe Corner Join Tool",
        type: "tool",
        loc: {
          en: "Join Tool",
          de: "Zusammenfügen-Werkzeug",
          ru: "Инструмент: Соединение",
        },
        minVersion: 24,
      },
      "tool_Adobe Knife Tool": {
        action: "Adobe Knife Tool",
        type: "tool",
        loc: { en: "Knife Tool", de: "Messer-Werkzeug", ru: "Инструмент: Нож" },
        minVersion: 24,
      },
      "tool_Adobe Direct Lasso Tool": {
        action: "Adobe Direct Lasso Tool",
        type: "tool",
        loc: { en: "Lasso Tool", de: "Lasso-Werkzeug", ru: "Инструмент: Лассо" },
        minVersion: 24,
      },
      "tool_Adobe Line Graph Tool": {
        action: "Adobe Line Graph Tool",
        type: "tool",
        loc: {
          en: "Line Graph Tool",
          de: "Liniendiagramm",
          ru: "Инструмент: Линейная диаграмма",
        },
        minVersion: 24,
      },
      "tool_Adobe Line Tool": {
        action: "Adobe Line Tool",
        type: "tool",
        loc: {
          en: "Line Segment Tool",
          de: "Liniensegment-Werkzeug",
          ru: "Инструмент: Отрезок линии",
        },
        minVersion: 24,
      },
      "tool_Adobe Planar Paintbucket Tool": {
        action: "Adobe Planar Paintbucket Tool",
        type: "tool",
        loc: {
          en: "Live Paint Bucket Tool",
          de: "Interaktiv-malen-Werkzeug",
          ru: "Инструмент: Быстрая заливка",
        },
        minVersion: 24,
      },
      "tool_Adobe Planar Face Select Tool": {
        action: "Adobe Planar Face Select Tool",
        type: "tool",
        loc: {
          en: "Live Paint Selection Tool",
          de: "Interaktiv-malen-Auswahlwerkzeug",
          ru: "Инструмент: Выделение быстрых заливок",
        },
        minVersion: 24,
      },
      "tool_Adobe Magic Wand Tool": {
        action: "Adobe Magic Wand Tool",
        type: "tool",
        loc: {
          en: "Magic Wand Tool",
          de: "Zauberstab-Werkzeug",
          ru: "Инструмент: Волшебная палочка",
        },
        minVersion: 24,
      },
      "tool_Adobe Measure Tool": {
        action: "Adobe Measure Tool",
        type: "tool",
        loc: { en: "Measure Tool", de: "Mess-Werkzeug", ru: "Инструмент: Линейка" },
        minVersion: 24,
      },
      "tool_Adobe Mesh Editing Tool": {
        action: "Adobe Mesh Editing Tool",
        type: "tool",
        loc: { en: "Mesh Tool", de: "Gitter-Werkzeug", ru: "Инструмент: Сетка" },
        minVersion: 24,
      },
      "tool_Adobe Brush Tool": {
        action: "Adobe Brush Tool",
        type: "tool",
        loc: { en: "Paintbrush Tool", de: "Pinsel-Werkzeug", ru: "Инструмент: Кисть" },
        minVersion: 24,
      },
      "tool_Adobe Freehand Erase Tool": {
        action: "Adobe Freehand Erase Tool",
        type: "tool",
        loc: {
          en: "Path Eraser Tool",
          de: "Löschen-Werkzeug",
          ru: "Инструмент: Стирание контура",
        },
        minVersion: 24,
      },
      "tool_Adobe Pattern Tile Tool": {
        action: "Adobe Pattern Tile Tool",
        type: "tool",
        loc: {
          en: "Pattern Tile Tool",
          de: "Musterelement-Werkzeug",
          ru: "Инструмент: Элемент узора",
        },
        minVersion: 24,
      },
      "tool_Adobe Pen Tool": {
        action: "Adobe Pen Tool",
        type: "tool",
        loc: { en: "Pen Tool", de: "Zeichenstift-Werkzeug", ru: "Инструмент: Перо" },
        minVersion: 24,
      },
      "tool_Adobe Freehand Tool": {
        action: "Adobe Freehand Tool",
        type: "tool",
        loc: {
          en: "Pencil Tool",
          de: "Buntstift-Werkzeug",
          ru: "Инструмент: Карандаш",
        },
        minVersion: 24,
      },
      "tool_Perspective Grid Tool": {
        action: "Perspective Grid Tool",
        type: "tool",
        loc: {
          en: "Perspective Grid Tool",
          de: "Perspektivenraster-Werkzeug",
          ru: "Инструмент: Сетка перспективы",
        },
        minVersion: 24,
      },
      "tool_Perspective Selection Tool": {
        action: "Perspective Selection Tool",
        type: "tool",
        loc: {
          en: "Perspective Selection Tool",
          de: "Perspektivenauswahl-Werkzeug",
          ru: "Инструмент: Выбор перспективы",
        },
        minVersion: 24,
      },
      "tool_Adobe Pie Graph Tool": {
        action: "Adobe Pie Graph Tool",
        type: "tool",
        loc: {
          en: "Pie Graph Tool",
          de: "Kreisdiagramm-Werkzeug",
          ru: "Инструмент: Круговая диаграмма",
        },
        minVersion: 24,
      },
      "tool_Adobe Polar Grid Tool": {
        action: "Adobe Polar Grid Tool",
        type: "tool",
        loc: {
          en: "Polar Grid Tool",
          de: "Radiales-Raster-Werkzeug",
          ru: "Инструмент: Полярная сетка",
        },
        minVersion: 24,
      },
      "tool_Adobe Shape Construction Regular Polygon Tool": {
        action: "Adobe Shape Construction Regular Polygon Tool",
        type: "tool",
        loc: {
          en: "Polygon Tool",
          de: "Polygon-Werkzeug",
          ru: "Инструмент: Многоугольник",
        },
        minVersion: 24,
      },
      "tool_Adobe Page Tool": {
        action: "Adobe Page Tool",
        type: "tool",
        loc: {
          en: "Print Tiling Tool",
          de: "Druckaufteilungs-Werkzeug",
          ru: "Инструмент: Разбиение для печати",
        },
        minVersion: 24,
      },
      "tool_Adobe Pucker Tool": {
        action: "Adobe Pucker Tool",
        type: "tool",
        loc: {
          en: "Pucker Tool",
          de: "Zusammenziehen-Werkzeug",
          ru: "Инструмент: Втягивание",
        },
        minVersion: 24,
      },
      "tool_Adobe Puppet Warp Tool": {
        action: "Adobe Puppet Warp Tool",
        type: "tool",
        loc: {
          en: "Puppet Warp Tool",
          de: "Formgitter-Werkzeug",
          ru: "Инструмент: Марионеточная деформация",
        },
        minVersion: 24,
      },
      "tool_Adobe Radar Graph Tool": {
        action: "Adobe Radar Graph Tool",
        type: "tool",
        loc: {
          en: "Radar Graph Tool",
          de: "Netzdiagramm",
          ru: "Инструмент: Диаграмма радар",
        },
        minVersion: 24,
      },
      "tool_Adobe Rectangle Shape Tool": {
        action: "Adobe Rectangle Shape Tool",
        type: "tool",
        loc: {
          en: "Rectangle Tool",
          de: "Rechteck-Werkzeug",
          ru: "Инструмент: Прямоугольник",
        },
        minVersion: 24,
      },
      "tool_Adobe Rectangular Grid Tool": {
        action: "Adobe Rectangular Grid Tool",
        type: "tool",
        loc: {
          en: "Rectangular Grid Tool",
          de: "Rechteckiges-Raster-Werkzeug",
          ru: "Инструмент: Прямоугольная сетка",
        },
        minVersion: 24,
      },
      "tool_Adobe Reflect Tool": {
        action: "Adobe Reflect Tool",
        type: "tool",
        loc: {
          en: "Reflect Tool",
          de: "Spiegeln-Werkzeug",
          ru: "Инструмент: Зеркальное отражение",
        },
        minVersion: 24,
      },
      "tool_Adobe Reshape Tool": {
        action: "Adobe Reshape Tool",
        type: "tool",
        loc: {
          en: "Reshape Tool",
          de: "Form-ändern-Werkzeug",
          ru: "Инструмент: Перерисовка",
        },
        minVersion: 24,
      },
      "tool_Adobe Rotate Tool": {
        action: "Adobe Rotate Tool",
        type: "tool",
        loc: { en: "Rotate Tool", de: "Drehen-Werkzeug", ru: "Инструмент: Поворот" },
        minVersion: 24,
      },
      "tool_Adobe Rotate Canvas Tool": {
        action: "Adobe Rotate Canvas Tool",
        type: "tool",
        loc: {
          en: "Rotate View Tool",
          de: "Ansichtdrehung-Werkzeug",
          ru: "Инструмент: Поворот вида",
        },
        minVersion: 24,
      },
      "tool_Adobe Rounded Rectangle Tool": {
        action: "Adobe Rounded Rectangle Tool",
        type: "tool",
        loc: {
          en: "Rounded Rectangle Tool",
          de: "Abgerundetes-Rechteck-Werkzeug",
          ru: "Инструмент: Прямоугольник со скругленными углами",
        },
        minVersion: 24,
      },
      "tool_Adobe Scale Tool": {
        action: "Adobe Scale Tool",
        type: "tool",
        loc: { en: "Scale Tool", de: "Skalieren-Werkzeug", ru: "Инструмент: Масштаб" },
        minVersion: 24,
      },
      "tool_Adobe Scallop Tool": {
        action: "Adobe Scallop Tool",
        type: "tool",
        loc: { en: "Scallop Tool", de: "Ausbuchten-Werkzeug", ru: "Инструмент: Зубцы" },
        minVersion: 24,
      },
      "tool_Adobe Scatter Graph Tool": {
        action: "Adobe Scatter Graph Tool",
        type: "tool",
        loc: {
          en: "Scatter Graph Tool",
          de: "Streudiagramm",
          ru: "Инструмент: Точечная диаграмма",
        },
        minVersion: 24,
      },
      "tool_Adobe Scissors Tool": {
        action: "Adobe Scissors Tool",
        type: "tool",
        loc: { en: "Scissors Tool", de: "Schere-Werkzeug", ru: "Инструмент: Ножницы" },
        minVersion: 24,
      },
      "tool_Adobe Select Tool": {
        action: "Adobe Select Tool",
        type: "tool",
        loc: {
          en: "Selection Tool",
          de: "Auswahl-Werkzeug",
          ru: "Инструмент: Выделение",
        },
        minVersion: 24,
      },
      "tool_Adobe Shape Builder Tool": {
        action: "Adobe Shape Builder Tool",
        type: "tool",
        loc: {
          en: "Shape Builder Tool",
          de: "Formerstellungs-Werkzeug",
          ru: "Инструмент: Создание фигур",
        },
        minVersion: 24,
      },
      "tool_Adobe Shaper Tool": {
        action: "Adobe Shaper Tool",
        type: "tool",
        loc: {
          en: "Shaper Tool",
          de: "Shaper-Werkzeug",
          ru: "Инструмент: Произвольная кривая",
        },
        minVersion: 24,
      },
      "tool_Adobe Shear Tool": {
        action: "Adobe Shear Tool",
        type: "tool",
        loc: { en: "Shear Tool", de: "Verbiegen-Werkzeug", ru: "Инструмент: Наклон" },
        minVersion: 24,
      },
      "tool_Adobe Slice Tool": {
        action: "Adobe Slice Tool",
        type: "tool",
        loc: { en: "Slice Tool", de: "Slice-Werkzeug", ru: "Инструмент: Фрагменты" },
        minVersion: 24,
      },
      "tool_Adobe Slice Select Tool": {
        action: "Adobe Slice Select Tool",
        type: "tool",
        loc: {
          en: "Slice Selection Tool",
          de: "Slice-Auswahl-Werkzeug",
          ru: "Инструмент: Выделение фрагмента",
        },
        minVersion: 24,
      },
      "tool_Adobe Freehand Smooth Tool": {
        action: "Adobe Freehand Smooth Tool",
        type: "tool",
        loc: {
          en: "Smooth Tool",
          de: "Glätten-Werkzeug",
          ru: "Инструмент: Сглаживание",
        },
        minVersion: 24,
      },
      "tool_Adobe Shape Construction Spiral Tool": {
        action: "Adobe Shape Construction Spiral Tool",
        type: "tool",
        loc: { en: "Spiral Tool", de: "Spirale-Werkzeug", ru: "Инструмент: Спираль" },
        minVersion: 24,
      },
      "tool_Adobe Stacked Bar Graph Tool": {
        action: "Adobe Stacked Bar Graph Tool",
        type: "tool",
        loc: {
          en: "Stacked Bar Graph Tool",
          de: "Gestapeltes horizontales Balkendiagramm",
          ru: "Инструмент: Диаграмма горизонтальный стек",
        },
        minVersion: 24,
      },
      "tool_Adobe Stacked Column Graph Tool": {
        action: "Adobe Stacked Column Graph Tool",
        type: "tool",
        loc: {
          en: "Stacked Column Graph Tool",
          de: "Gestapeltes vertikales Balkendiagramm",
          ru: "Инструмент: Диаграмма вертикальный стек",
        },
        minVersion: 24,
      },
      "tool_Adobe Shape Construction Star Tool": {
        action: "Adobe Shape Construction Star Tool",
        type: "tool",
        loc: { en: "Star Tool", de: "Stern-Werkzeug", ru: "Инструмент: Звезда" },
        minVersion: 24,
      },
      "tool_Adobe Symbol Screener Tool": {
        action: "Adobe Symbol Screener Tool",
        type: "tool",
        loc: {
          en: "Symbol Screener Tool",
          de: "Symbol-transparent-gestalten-Werkzeug",
          ru: "Инструмент: Прозрачность символов",
        },
        minVersion: 24,
      },
      "tool_Adobe Symbol Scruncher Tool": {
        action: "Adobe Symbol Scruncher Tool",
        type: "tool",
        loc: {
          en: "Symbol Scruncher Tool",
          de: "Symbol-stauchen-Werkzeug",
          ru: "Инструмент: Уплотнение символов",
        },
        minVersion: 24,
      },
      "tool_Adobe Symbol Shifter Tool": {
        action: "Adobe Symbol Shifter Tool",
        type: "tool",
        loc: {
          en: "Symbol Shifter Tool",
          de: "Symbol-verschieben-Werkzeug",
          ru: "Инструмент: Смещение символов",
        },
        minVersion: 24,
      },
      "tool_Adobe Symbol Sizer Tool": {
        action: "Adobe Symbol Sizer Tool",
        type: "tool",
        loc: {
          en: "Symbol Sizer Tool",
          de: "Symbol-skalieren-Werkzeug",
          ru: "Инструмент: Размер символов",
        },
        minVersion: 24,
      },
      "tool_Adobe Symbol Spinner Tool": {
        action: "Adobe Symbol Spinner Tool",
        type: "tool",
        loc: {
          en: "Symbol Spinner Tool",
          de: "Symbol-drehen-Werkzeug",
          ru: "Инструмент: Вращение символов",
        },
        minVersion: 24,
      },
      "tool_Adobe Symbol Sprayer Tool": {
        action: "Adobe Symbol Sprayer Tool",
        type: "tool",
        loc: {
          en: "Symbol Sprayer Tool",
          de: "Symbol-aufsprühen-Werkzeug",
          ru: "Инструмент: Распыление символов",
        },
        minVersion: 24,
      },
      "tool_Adobe Symbol Stainer Tool": {
        action: "Adobe Symbol Stainer Tool",
        type: "tool",
        loc: {
          en: "Symbol Stainer Tool",
          de: "Symbol-färben-Werkzeug",
          ru: "Инструмент: Обесцвечивание символов",
        },
        minVersion: 24,
      },
      "tool_Adobe Symbol Styler Tool": {
        action: "Adobe Symbol Styler Tool",
        type: "tool",
        loc: {
          en: "Symbol Styler Tool",
          de: "Symbol-gestalten-Werkzeug",
          ru: "Инструмент: Стили символов",
        },
        minVersion: 24,
      },
      "tool_Adobe Touch Type Tool": {
        action: "Adobe Touch Type Tool",
        type: "tool",
        loc: {
          en: "Touch Type Tool",
          de: "Touch-Type-Textwerkzeug",
          ru: "Инструмент: Изменение текста",
        },
        minVersion: 24,
      },
      "tool_Adobe New Twirl Tool": {
        action: "Adobe New Twirl Tool",
        type: "tool",
        loc: { en: "Twirl Tool", de: "Strudel-Werkzeug", ru: "Инструмент: Воронка" },
        minVersion: 24,
      },
      "tool_Adobe Type Tool": {
        action: "Adobe Type Tool",
        type: "tool",
        loc: { en: "Type Tool", de: "Text-Werkzeug", ru: "Инструмент: Текст" },
        minVersion: 24,
      },
      "tool_Adobe Path Type Tool": {
        action: "Adobe Path Type Tool",
        type: "tool",
        loc: {
          en: "Type on a Path Tool",
          de: "Pfadtext-Werkzeug",
          ru: "Инструмент: Текст по контуру",
        },
        minVersion: 24,
      },
      "tool_Adobe Vertical Area Type Tool": {
        action: "Adobe Vertical Area Type Tool",
        type: "tool",
        loc: {
          en: "Vertical Area Type Tool",
          de: "Vertikaler-Flächentext-Werkzeug",
          ru: "Инструмент: Вертикальный текст в области",
        },
        minVersion: 24,
      },
      "tool_Adobe Vertical Type Tool": {
        action: "Adobe Vertical Type Tool",
        type: "tool",
        loc: {
          en: "Vertical Type Tool",
          de: "Vertikaler-Text-Werkzeug",
          ru: "Инструмент: Вертикальный текст",
        },
        minVersion: 24,
      },
      "tool_Adobe Vertical Path Type Tool": {
        action: "Adobe Vertical Path Type Tool",
        type: "tool",
        loc: {
          en: "Vertical Type on a Path Tool",
          de: "Vertikaler-Pfadtext-Werkzeug",
          ru: "Инструмент: Вертикальный текст по контуру",
        },
        minVersion: 24,
      },
      "tool_Adobe Warp Tool": {
        action: "Adobe Warp Tool",
        type: "tool",
        loc: {
          en: "Warp Tool",
          de: "Verkrümmen-Werkzeug",
          ru: "Инструмент: Деформация",
        },
        minVersion: 24,
      },
      "tool_Adobe Width Tool": {
        action: "Adobe Width Tool",
        type: "tool",
        loc: { en: "Width Tool", de: "Breiten-Werkzeug", ru: "Инструмент: Ширина" },
        minVersion: 24,
      },
      "tool_Adobe Wrinkle Tool": {
        action: "Adobe Wrinkle Tool",
        type: "tool",
        loc: {
          en: "Wrinkle Tool",
          de: "Zerknittern-Werkzeug",
          ru: "Инструмент: Морщины",
        },
        minVersion: 24,
      },
      "tool_Adobe Zoom Tool": {
        action: "Adobe Zoom Tool",
        type: "tool",
        loc: { en: "Zoom Tool", de: "Zoom-Werkzeug", ru: "Инструмент: Масштаб" },
        minVersion: 24,
      },
    },
    defaults: {
      defaults_settings: {
        action: "settings",
        type: "defaults",
        loc: {
          en: "Ai Command Palette Settings...",
          de: "Kurzbefehle – Einstellungen …",
          ru: "Настройки",
        },
      },
    },
    config: {
      config_about: {
        action: "about",
        type: "config",
        loc: {
          en: "About Ai Command Palette...",
          de: "Über Kurzbefehle …",
          ru: "Об Ai Command Palette",
        },
      },
      config_buildWorkflow: {
        action: "buildWorkflow",
        type: "config",
        loc: {
          en: "Build Workflow...",
          de: "Arbeitsablauf erstellen …",
          ru: "Создать набор команд",
        },
      },
      config_editWorkflow: {
        action: "editWorkflow",
        type: "config",
        loc: {
          en: "Edit Workflow...",
          de: "Arbeitsablauf bearbeiten …",
          ru: "Редактировать набор команд",
        },
      },
      config_loadScript: {
        action: "loadScript",
        type: "config",
        loc: { en: "Load Scripts...", de: "Skripte laden …", ru: "Загрузить скрипты" },
      },
      config_hideCommand: {
        action: "hideCommand",
        type: "config",
        loc: {
          en: "Hide Commands...",
          de: "Befehle ausblenden …",
          ru: "Скрыть команды",
        },
      },
      config_unhideCommand: {
        action: "unhideCommand",
        type: "config",
        loc: {
          en: "Unhide Commands...",
          de: "Befehle einblenden …",
          ru: "Показать команды",
        },
      },
      config_deleteCommand: {
        action: "deleteCommand",
        type: "config",
        loc: {
          en: "Delete Commands...",
          de: "Befehle löschen …",
          ru: "Удалить команды",
        },
      },
      config_revealPrefFile: {
        action: "revealPrefFile",
        type: "config",
        loc: {
          en: "Reveal Preferences File",
          de: "Einstellungen-Datei anzeigen",
          ru: "Показать файл настроек",
        },
      },
    },
    builtin: {
      builtin_goToArtboard: {
        action: "goToArtboard",
        type: "builtin",
        loc: {
          en: "Go To Artboard...",
          de: "Gehen Sie zur Zeichenfläche...",
          ru: "Gehen Sie zur Zeichenfläche...",
        },
      },
      builtin_goToDocument: {
        action: "goToDocument",
        type: "builtin",
        loc: { en: "Go To Open Document", de: "", ru: "" },
      },
      builtin_goToNamedObject: {
        action: "goToNamedObject",
        type: "builtin",
        loc: {
          en: "Go To Named Object...",
          de: "Gehen Sie zum benannten Objekt...",
          ru: "Перейти к именованному объекту...",
        },
      },
      builtin_redrawWindows: {
        action: "redrawWindows",
        type: "builtin",
        loc: { en: "Redraw Windows", de: "", ru: "" },
      },
      builtin_revealActiveDocument: {
        action: "revealActiveDocument",
        type: "builtin",
        loc: { en: "Reveal Active Document On System", de: "", ru: "" },
      },
      builtin_documentReport: {
        action: "documentReport",
        type: "builtin",
        loc: { en: "Active Document Report", de: "", ru: "" },
      },
      builtin_imageCapture: {
        action: "imageCapture",
        type: "builtin",
        loc: { en: "Export Active Artboard As PNG", de: "", ru: "" },
      },
      builtin_exportVariables: {
        action: "exportVariables",
        type: "builtin",
        loc: { en: "Export Document Variables", de: "", ru: "" },
      },
    },
  };
  // COMMANDS SETUP

  function buildCommands(commands, filter) {
    for (var type in commands) {
      if (!filter.includes(type)) {
        var commandData;
        for (var command in commands[type]) {
          commandData = commands[type][command];
          // hide `Edit Workflow...` setting command if no workflows
          if (
            command == "config_editWorkflow" &&
            Object.keys(data.commands.workflow).length < 1
          )
            continue;
          // hide `Unhide Commands...` setting command if no hidden commands
          if (command == "config_unhideCommand" && data.settings.hidden.length < 1)
            continue;
          // make sure commands has localized strings
          if (commandData.hasOwnProperty("loc"))
            commandsData[localize(commandData.loc)] = commandData;
          else {
            commandsData[command] = commandData;
          }
        }
      }
    }
  }

  function loadActions() {
    var currentPath, set, actionCount, name;
    var pref = app.preferences;
    var path = "plugin/Action/SavedSets/set-";

    for (var i = 1; i <= 100; i++) {
      currentPath = path + i.toString() + "/";
      // get action sets
      set = pref.getStringPreference(currentPath + "name");
      if (!set) {
        break;
      }
      // get actions in set
      actionCount = Number(pref.getIntegerPreference(currentPath + "actionCount"));
      var name, key;
      for (var j = 1; j <= actionCount; j++) {
        name = pref.getStringPreference(
          currentPath + "action-" + j.toString() + "/name"
        );
        key = "Action: " + name + " [" + set + "]";
        data.commands.action[key] = { name: name, type: "action", set: set };
      }
    }
  }

  // COMMAND EXECUTION

  /**
   * Iterate over each action for chosen command.
   * @param {String} command Command to execute.
   */
  function processCommand(command) {
    var commandData = commandsData[command];
    var type = commandData.type;
    if (type == "workflow") {
      var actions = commandData.actions;
      // check to make sure all workflow commands are valid
      check = checkWorkflowActions(actions);
      if (check.deletedActions.length + check.incompatibleActions.length > 0) {
        alert(
          localize(
            locStrings.wf_needs_attention,
            check.deletedActions,
            check.incompatibleActions
          )
        );
        return;
      }
      // run each command in the workflow
      commands = commandsData[command].actions;
      for (var i = 0; i < commands.length; i++) processCommand(commands[i]);
    } else {
      executeCommand(command);
    }
  }

  /**
   * Execute command action.
   * @param {Object} command Action to execute.
   */
  function executeCommand(command) {
    var commandData = commandsData[command];
    switch (commandData.type.toLowerCase()) {
      case "config":
      case "defaults":
        try {
          scriptAction(commandData.action);
        } catch (e) {
          alert(localize(locStrings.cd_error_executing, command, e));
        }
        break;
      case "builtin":
        try {
          builtinAction(commandData.action);
        } catch (e) {
          alert(localize(locStrings.cd_error_executing, command, e));
        }
        break;
      case "menu":
        try {
          app.executeMenuCommand(commandData.action);
        } catch (e) {
          alert(localize(locStrings.cd_error_executing, command, e));
        }
        break;
      case "tool":
        try {
          app.selectTool(commandData.action);
        } catch (e) {
          alert(localize(locStrings.tl_error_selecting, command, e));
        }
        break;
      case "action":
        try {
          app.doScript(commandData.name, commandData.set);
        } catch (e) {
          alert(localize(locStrings.ac_error_execution, command, e));
        }
        break;
      case "script":
        f = new File(commandData.path);
        if (!f.exists) {
          alert(localize(locStrings.sc_error_exists, commandData.path));
          delete data.commands.script[command];
          settings.save();
        } else {
          try {
            $.evalFile(f);
          } catch (e) {
            alert(localize(locStrings.sc_error_execution, commandData.name, e));
          }
        }
        break;
      default:
        alert(localize(locStrings.cd_invalid, commandData.type));
    }
    try {
      app.redraw();
    } catch (e) {
      $.writeln(e);
    }
  }

  /**************************************************
SUPPLEMENTAL COMMAND FUNCTIONS
**************************************************/

  function versionCheck(command) {
    var commandData = commandsData[command];
    if (
      (commandData.minVersion && commandData.minVersion > aiVersion) ||
      (commandData.maxVersion && commandData.maxVersion < aiVersion)
    )
      return false;
    return true;
  }
  // USER DIALOGS

  function commandPalette(
    commands,
    showHidden,
    queryFilter,
    visibleFilter,
    title,
    bounds,
    multiselect,
    simple
  ) {
    // if a simple dialog is requested all filtering is skipped
    if (simple) {
      commands = {
        visible: commands,
        query: commands,
      };
    } else {
      // filter the commands based on supplied args
      // make it so you don't have to specify the same array
      // for both filters if they should be the same
      if (visibleFilter.length == 0) visibleFilter = queryFilter;
      commands = filterCommands(commands, queryFilter, visibleFilter, showHidden, []);
    }

    // create the dialog
    var win = new Window("dialog");
    win.text = title;
    win.alignChildren = "fill";
    var q = win.add("edittext");
    q.helpTip = localize(locStrings.cd_q_helptip);

    // work-around to stop windows from flickering/flashing explorer
    if (windowsFlickerFix) {
      simulateKeypress("TAB", 1);
    } else {
      q.active = true;
    }

    // setup the commands listbox
    var list = win.add("listbox", bounds, commands.visible, {
      multiselect: multiselect,
    });
    list.selection = 0;

    // window buttons
    var winButtons = win.add("group");
    winButtons.orientation = "row";
    winButtons.alignChildren = ["center", "center"];
    var ok = winButtons.add("button", undefined, "OK");
    ok.preferredSize.width = 100;
    var cancel = winButtons.add("button", undefined, localize(locStrings.cancel), {
      name: "cancel",
    });
    cancel.preferredSize.width = 100;

    // as a query is typed update the list box
    var frameStart = 0;
    q.onChanging = function () {
      frameStart = 0;
      matches =
        this.text === "" ? commands.visible : scoreMatches(this.text, commands.query);
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

    if (!multiselect && list.items.length > 0) {
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

  function goToPalette(commands, title, bounds) {
    // copy the commands
    var matches = commands;

    // create the dialog
    var win = new Window("dialog");
    win.text = title;
    win.alignChildren = "fill";
    var q = win.add("edittext");
    q.helpTip = localize(locStrings.cd_q_helptip);

    // work-around to stop windows from flickering/flashing explorer
    if (windowsFlickerFix) {
      simulateKeypress("TAB", 1);
    } else {
      q.active = true;
    }

    // setup the commands listbox
    var list = win.add("listbox", bounds, [], {
      numberOfColumns: 2,
      showHeaders: true,
      columnTitles: ["Name", "Type"],
      columnWidths: [bounds[2] - 200, 195],
    });

    // add items to list
    for (var i = 0; i < matches.length; i++) {
      switch (matches[i].typename) {
        case "PlacedItem":
          matches[i]["queryName"] = matches[i].file.name;
          break;
        case "SymbolItem":
          matches[i]["queryName"] =
            matches[i].name || matches[i].name.length
              ? matches[i].name
              : matches[i].symbol.name;
          break;
        default:
          matches[i]["queryName"] = matches[i].name;
          break;
      }
      with (list.add("Item", truncateCommandName(matches[i].queryName, 50))) {
        subItems[0].text = matches[i].typename;
      }
    }
    list.selection = 0;

    // window buttons
    var winButtons = win.add("group");
    winButtons.orientation = "row";
    winButtons.alignChildren = ["center", "center"];
    var ok = winButtons.add("button", undefined, "OK");
    ok.preferredSize.width = 100;
    var cancel = winButtons.add("button", undefined, localize(locStrings.cancel), {
      name: "cancel",
    });
    cancel.preferredSize.width = 100;

    // as a query is typed update the list box
    var frameStart = 0;
    q.onChanging = function () {
      frameStart = 0;
      matches =
        this.text === ""
          ? commands
          : scoreObjectMatches(this.text, matches, "queryName");
      if (matches.length > 0) {
        var temp = win.add("listbox", list.bounds, [], {
          numberOfColumns: list.properties.numberOfColumns,
          showHeaders: list.properties.showHeaders,
          columnTitles: list.properties.columnTitles,
          columnWidths: list.properties.columnWidths,
        });

        for (var i = 0; i < matches.length; i++) {
          with (temp.add("Item", truncateCommandName(matches[i].queryName, 50))) {
            subItems[0].text = matches[i].typename;
          }
        }
        temp.selection = 0;

        // close window when double-clicking a selection
        temp.onDoubleClick = function () {
          if (list.selection) win.close(1);
        };
        win.remove(list);
        list = temp;
      }
    };

    if (list.items.length > 0) {
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

    function truncateCommandName(s, n) {
      return s.length <= n ? s : s.slice(0, n) + "...";
    }

    // close window when double-clicking a selection
    list.onDoubleClick = function () {
      if (list.selection) win.close(1);
    };

    if (win.show() == 1) {
      if (list.selection) {
        return matches[list.selection.index];
      }
    }
    return false;
  }

  function workflowBuilder(commands, showHidden, queryFilter, visibleFilter, edit) {
    // if editing a command, pull in variables to prefill dialog with
    var command;
    var actions = [];
    var hideCommands = [];
    if (edit != undefined) {
      command = commandsData[edit[0].text];
      actions = command.actions;
      // make sure workflows can't include themselves
      hideCommands.push(edit[0].text);
    }

    // filter the commands based on supplied args
    // make it so you don't have to specify the same array
    // for both filters if they should be the same
    if (visibleFilter.length == 0) visibleFilter = queryFilter;
    commands = filterCommands(
      commands,
      queryFilter,
      visibleFilter,
      showHidden,
      hideCommands
    );

    // create the dialog
    var win = new Window("dialog");
    win.text = localize(locStrings.wf_builder);
    win.alignChildren = "fill";

    // command search
    var pSearch = win.add("panel", undefined, localize(locStrings.cd_search_for));
    pSearch.alignChildren = ["fill", "center"];
    pSearch.margins = 20;
    var q = pSearch.add("edittext");
    q.helpTip = localize(locStrings.cd_q_helptip);

    // work-around to stop windows from flickering/flashing explorer
    if (windowsFlickerFix) {
      simulateKeypress("TAB", 1);
    } else {
      q.active = true;
    }

    var list = pSearch.add(
      "listbox",
      [0, 0, paletteWidth + 40, 182],
      commands.visible,
      {
        multiselect: false,
      }
    );
    list.helpTip = localize(locStrings.cd_helptip);
    list.selection = 0;

    // workflow steps
    var pSteps = win.add("panel", undefined, localize(locStrings.wf_steps));
    pSteps.alignChildren = ["fill", "center"];
    pSteps.margins = 20;
    var steps = pSteps.add("listbox", [0, 0, paletteWidth + 40, 182], actions, {
      multiselect: true,
    });
    steps.helpTip = localize(locStrings.wf_steps_helptip);
    var stepButtons = pSteps.add("group");
    stepButtons.alignment = "center";
    var up = stepButtons.add("button", undefined, localize(locStrings.step_up));
    up.preferredSize.width = 100;
    var down = stepButtons.add("button", undefined, localize(locStrings.step_down));
    down.preferredSize.width = 100;
    var del = stepButtons.add("button", undefined, localize(locStrings.step_delete));
    del.preferredSize.width = 100;

    // command name
    var pName = win.add("panel", undefined, localize(locStrings.wf_save_as));
    pName.alignChildren = ["fill", "center"];
    pName.margins = 20;
    var workflowNameText = edit == undefined ? "" : command.name;
    var workflowName = pName.add("edittext", undefined, workflowNameText);
    workflowName.enabled = edit == undefined ? false : true;

    // window buttons
    var winButtons = win.add("group");
    winButtons.orientation = "row";
    winButtons.alignChildren = ["center", "center"];
    var ok = winButtons.add("button", undefined, "OK");
    ok.preferredSize.width = 100;
    ok.enabled = edit == undefined ? false : true;
    var cancel = winButtons.add("button", undefined, localize(locStrings.cancel), {
      name: "cancel",
    });
    cancel.preferredSize.width = 100;

    // as a query is typed update the list box
    var matches, temp;
    q.onChanging = function () {
      matches =
        this.text === "" ? commands.visible : scoreMatches(this.text, commands.visible);
      if (matches.length > 0) {
        temp = pSearch.add("listbox", list.bounds, matches, {
          multiselect: list.properties.multiselect,
        });
        // add command when double-clicking
        temp.onDoubleClick = list.onDoubleClick;
        pSearch.remove(list);
        list = temp;
        list.selection = 0;
        cur = 0;
      }
    };

    workflowName.onChanging = function () {
      ok.enabled = workflowName.text.length > 0 ? true : false;
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
      workflowName.enabled = steps.items.length > 0 ? true : false;
      ok.enabled = workflowName.text.length > 0 ? true : false;
    };

    list.onDoubleClick = function () {
      if (list.selection) {
        steps.add("item", list.selection);
        workflowName.enabled = steps.items.length > 0 ? true : false;
        ok.enabled = workflowName.text.length > 0 ? true : false;
      }
    };

    if (win.show() == 1) {
      var key = localize(locStrings.wf_titlecase) + ": " + workflowName.text.trim();
      return { key: key, name: workflowName.text, actions: steps.items };
    }
    return false;
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
  // FILE/FOLDER OPERATIONS

  /**
   * Write user data to disk.
   * @param {Object} f File object for user preference data.
   */
  function writeUserData(f) {
    writeJSONData(data.settings, f);
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
   * Read ExtendScript "json-like" data from file.
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
      alert(localize(locStrings.fl_error_loading, f));
    }
    obj = eval(json);
    return obj;
  }

  /**
   * Write ExtendScript "json-like" data to disk.
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
      alert(localize(locStrings.fl_error_writing, f));
    }
  }
  // WORKFLOW AUTOMATION

  /**
   * Build or Edit workflows.
   * @param {String} workflow Workflow to edit.
   */
  function buildWorkflow(workflow) {
    // show the workflow builder dialog
    var result = workflowBuilder(
      (commands = allCommands),
      (showHidden = true),
      (queryFilter = ["config", "defaults"]),
      (visibleFilter = []),
      (edit = workflow)
    );

    if (result) {
      // check to make sure there isn't a workflow already saved with the same name
      var newName;
      while (allCommands.includes(result.key)) {
        if (
          Window.confirm(
            localize(locStrings.wf_already_exists),
            "noAsDflt",
            localize(locStrings.wf_already_exists_title)
          )
        ) {
          break;
        } else {
          newName = Window.prompt(
            localize(locStrings.wf_name),
            "",
            localize(locStrings.wf_name)
          );
          if (newName == undefined || newName == null || newName === "") {
            alert(localize(locStrings.wf_not_saved));
            return false;
          } else {
            result.key = localize(locStrings.workflow) + ": " + newName;
            result.name = newName;
          }
        }
      }

      var workflowActions = [];
      try {
        for (var i = 0; i < result.actions.length; i++)
          workflowActions.push(result.actions[i].text);
        data.commands.workflow[result.key] = {
          name: result.name,
          type: "workflow",
          actions: workflowActions,
        };
      } catch (e) {
        alert(localize(locStrings.wf_error_saving, result.name));
      }
    }
  }

  /** Choose a workflow to edit. */
  function editWorkflow() {
    var result = commandPalette(
      (commands = allCommands),
      (showHidden = false),
      (queryFilter = []),
      (visibleFilter = ["action", "config", "defaults", "menu", "script", "tool"]),
      (title = localize(locStrings.wf_edit)),
      (bounds = [0, 0, paletteWidth, 182]),
      (multiselect = false)
    );
    if (result) buildWorkflow(result);
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
    var command;
    for (var i = 0; i < actions.length; i++) {
      command = actions[i];
      if (!allCommands.includes(command)) {
        deletedActions.push(command);
      } else if (!versionCheck(command)) {
        incompatibleActions.push(command);
      }
    }
    return {
      deletedActions: deletedActions,
      incompatibleActions: incompatibleActions,
    };
  }

  // SETUP COMMANDS DATA

  var data = {
    commands: {
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
    (visibleFilter = ["action", "builtin", "config", "menu", "tool"]),
    (title = localize(locStrings.title)),
    (bounds = [0, 0, paletteWidth, 182]),
    (multiselect = false)
  );
  if (result) processCommand(result);
})();
