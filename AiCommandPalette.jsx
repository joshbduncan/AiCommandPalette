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
  // ALL BUILT DATA FROM PYTHON SCRIPT

  var strings = {
    about: {
      en: "About",
      de: "\u00dcber Kurzbefehle \u2026",
      ru: "\u041e \u0441\u043a\u0440\u0438\u043f\u0442\u0435",
    },
    ac_error_execution: {
      en: "Error executing action:\n%1\n\n%2",
      de: "Fehler beim Ausf\u00fchren der Aktion:\n%1\n\n%2",
      ru: "\u041e\u0448\u0438\u0431\u043a\u0430 \u0437\u0430\u043f\u0443\u0441\u043a\u0430 \u043e\u043f\u0435\u0440\u0430\u0446\u0438\u0438:\n%1\n\n%2",
    },
    action: { en: "Action", de: "Action", ru: "Action" },
    Actions: { en: "Actions", de: "Aktionen", ru: "Actions" },
    active_document_not_saved: {
      en: "Active document not yet saved to the file system.",
      de: "Das aktuelle Dokument wurde noch nicht gespeichert.",
      ru: "Active document not yet saved to the file system.",
    },
    artboard: { en: "Artboard", de: "Artboard", ru: "Artboard" },
    artboards: { en: "Artboards", de: "Zeichenfl\u00e4chen", ru: "Artboards" },
    bm_already_loaded: {
      en: "Bookmark already set.\nWould you like to replace the previous bookmark with the new one?",
      de: "Dieses Lesezeichen wurde bereits erstellt..\nM\u00f6chten Sie es mit dem neuen Lesezeichen ersetzen?",
      ru: "Bookmark already set.\nWould you like to replace the previous bookmark with the new one?",
    },
    bm_already_loaded_title: {
      en: "Bookmark Load Conflict",
      de: "Konflikt beim Laden des Lesezeichens",
      ru: "Bookmark Load Conflict",
    },
    bm_error_execution: {
      en: "Error opening bookmark:\n%1\n\n%2",
      de: "Fehler beim \u00d6ffnen des Lesezeichens:\n%1\n\n%2",
      ru: "Error opening bookmark:\n%1\n\n%2",
    },
    bm_error_exists: {
      en: "Bookmark no longer exists at original path. Try reloading.\n%1",
      de: "Das Lesezeichen ist an dieser Stelle nicht mehr vorhanden. Versuchen Sie, es nochmal zu laden.\n%1",
      ru: "Bookmark no longer exists at original path. Try reloading.\n%1",
    },
    bm_error_loading: {
      en: "Error loading bookmark:\n%1",
      de: "Fehler beim Ladenn des Lesezeichens:\n%1",
      ru: "Error loading bookmark:\n%1",
    },
    bm_set_bookmark: {
      en: "Set Bookmark(s)",
      de: "Lesezeichen erstellen",
      ru: "Set Bookmark(s)",
    },
    bm_total_loaded: {
      en: "Total bookmarks loaded:\n%1",
      de: "Anzahl der geladenen Lesezeichen:\n%1",
      ru: "Total bookmarks loaded:\n%1",
    },
    bookmark: { en: "Bookmark", de: "Lesezeichen", ru: "Bookmark" },
    Bookmarks: { en: "Bookmarks", de: "Lesezeichen", ru: "Bookmarks" },
    builtin: { en: "Built-In", de: "Built-In", ru: "Built-In" },
    cancel: { en: "Cancel", de: "Abbrechen", ru: "\u041e\u0442\u043c\u0435\u043d\u0430" },
    cd_active_document_required: {
      en: "Command '%1' requires an active document. Continue Anyway?",
      de: "Der Befehl '%1' erfordert ein ge\u00f6ffnetes Dokument. Trotzdem fortfahren?",
      ru: "Command '%1' requires an active document. Continue Anyway?",
    },
    cd_active_selection_required: {
      en: "Command '%1' requires an active selection. Continue Anyway?",
      de: "Der Befehl '%1' erfordert eine Auswahl. Trotzdem fortfahren?",
      ru: "Command '%1' requires an active selection. Continue Anyway?",
    },
    cd_all: {
      en: "All Built-In Menu Commands",
      de: "Alle integrierten Men\u00fcbefehle",
      ru: "\u0421\u0442\u0430\u043d\u0434\u0430\u0440\u0442\u043d\u044b\u0435 \u043a\u043e\u043c\u0430\u043d\u0434\u044b \u043c\u0435\u043d\u044e",
    },
    cd_clear_recent_confirm: {
      en: "Are you sure you want to clear your recent commands?",
      de: "Are you sure you want to clear your recent commands?",
      ru: "Are you sure you want to clear your recent commands?",
    },
    cd_delete_confirm: {
      en: "Delete Commands?\nDeleted commands will longer work in any workflows you previously created where they were used as a step.\n\n%1",
      de: "Befehle l\u00f6schen?\nGel\u00f6schte Befehle werden in bestehenden Arbeitsabl\u00e4ufen nicht mehr funktionieren.\n\n%1",
      ru: "\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u043a\u043e\u043c\u0430\u043d\u0434\u0443?\n\u0423\u0434\u0430\u043b\u0435\u043d\u043d\u044b\u0435 \u043a\u043e\u043c\u0430\u043d\u0434\u044b \u0431\u043e\u043b\u044c\u0448\u0435 \u043d\u0435 \u0431\u0443\u0434\u0443\u0442 \u0440\u0430\u0431\u043e\u0442\u0430\u0442\u044c \u0432 \u043b\u044e\u0431\u044b\u0445 \u0441\u043e\u0437\u0434\u0430\u043d\u043d\u044b\u0445 \u043d\u0430\u0431\u043e\u0440\u0430\u0445, \u0433\u0434\u0435 \u043e\u043d\u0438 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043b\u0438\u0441\u044c\n\n%1",
    },
    cd_delete_confirm_title: {
      en: "Confirm Commands To Delete",
      de: "Best\u00e4tigen Sie die zu l\u00f6schenden Befehle.",
      ru: "\u041f\u043e\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044c \u0443\u0434\u0430\u043b\u0435\u043d\u0438\u0435 \u043a\u043e\u043c\u0430\u043d\u0434",
    },
    cd_delete_select: {
      en: "Select Commands To Delete",
      de: "W\u00e4hlen Sie die zu l\u00f6schenden Men\u00fcbefehle aus.",
      ru: "\u0412\u044b\u0431\u0440\u0430\u0442\u044c \u043a\u043e\u043c\u0430\u043d\u0434\u044b \u043c\u0435\u043d\u044e \u0434\u043b\u044f \u0443\u0434\u0430\u043b\u0435\u043d\u0438\u044f",
    },
    cd_error_delete: {
      en: "Command couldn't be deleted.\n%1",
      de: "Befehl konnte nicht gel\u00f6scht werden.\n%1",
      ru: "\u041a\u043e\u043c\u0430\u043d\u0434\u0430 \u043d\u0435 \u043c\u043e\u0436\u0435\u0442 \u0431\u044b\u0442\u044c \u0443\u0434\u0430\u043b\u0435\u043d\u0430\n%1",
    },
    cd_error_executing: {
      en: "Error executing command:\n%1\n\n%2",
      de: "Fehler beim Ausf\u00fchren des Befehls:\n%1\n\n%2",
      ru: "\u041e\u0448\u0438\u0431\u043a\u0430 \u0437\u0430\u043f\u0443\u0441\u043a\u0430 \u043a\u043e\u043c\u0430\u043d\u0434\u044b:\n%1\n\n%2",
    },
    cd_exception: {
      en: "Command Exception",
      de: "Befehls-Ausnahme",
      ru: "Command Exception",
    },
    cd_helptip: {
      en: "Double-click a command to add it as a workflow step below.",
      de: "Doppelklicken Sie auf einen Befehl, um ihn unten als benutzerdefinierten Schritt hinzuzuf\u00fcgen.",
      ru: "\u041d\u0430\u0436\u043c\u0438\u0442\u0435 \u0434\u0432\u0430\u0436\u0434\u044b \u043d\u0430 \u043a\u043e\u043c\u0430\u043d\u0434\u0443, \u0447\u0442\u043e\u0431\u044b \u0434\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0435\u0435 \u043a\u0430\u043a \u0448\u0430\u0433 \u043d\u0430\u0431\u043e\u0440\u0430",
    },
    cd_hide_confirm_title: {
      en: "Confirm Commands To Hide",
      de: "Auszublendende Befehle best\u00e4tigen",
      ru: "\u041f\u043e\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044c \u0441\u043a\u0440\u044b\u0442\u0438\u0435 \u043a\u043e\u043c\u0430\u043d\u0434",
    },
    cd_hide_select: {
      en: "Select Commands To Hide",
      de: "W\u00e4hlen Sie die auszublendenden Men\u00fcbefehle aus.",
      ru: "\u0412\u044b\u0431\u0440\u0430\u0442\u044c \u043a\u043e\u043c\u0430\u043d\u0434\u044b \u043c\u0435\u043d\u044e \u0434\u043b\u044f \u0441\u043a\u0440\u044b\u0442\u0438\u044f",
    },
    cd_invalid: {
      en: "Invalid command type:\n%1",
      de: "Ung\u00fcltiger Befehlstyp:\n%1",
      ru: "\u041d\u0435\u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u044b\u0439 \u0442\u0438\u043f:\n%1",
    },
    cd_none_delete: {
      en: "There are no commands to delete.",
      de: "Es gibt keine Befehle zum L\u00f6schen.",
      ru: "\u041d\u0435\u0442 \u043a\u043e\u043c\u0430\u043d\u0434 \u0434\u043b\u044f \u0443\u0434\u0430\u043b\u0435\u043d\u0438\u044f",
    },
    cd_none_hide: {
      en: "There are no commands to hide.",
      de: "Es gibt keine Befehle zum Ausblenden.",
      ru: "\u041d\u0435\u0442 \u043a\u043e\u043c\u0430\u043d\u0434 \u0434\u043b\u044f \u0441\u043a\u0440\u044b\u0442\u0438\u044f",
    },
    cd_none_reveal: {
      en: "There are no hidden commands to reveal.",
      de: "Keine verborgenen Befehle vorhanden.",
      ru: "\u041d\u0435\u0442 \u0441\u043a\u0440\u044b\u0442\u044b\u0445 \u043a\u043e\u043c\u0430\u043d\u0434",
    },
    cd_q_helptip: {
      en: "Search for commands, actions, and loaded scripts.",
      de: "Befehle, Aktionen und geladene Skripte suchen.",
      ru: "\u041f\u043e\u0438\u0441\u043a \u043a\u043e\u043c\u0430\u043d\u0434, \u043e\u043f\u0435\u0440\u0430\u0446\u0438\u0439 \u0438 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043d\u043d\u044b\u0445 \u0441\u043a\u0440\u0438\u043f\u0442\u043e\u0432",
    },
    cd_reveal_confirm: {
      en: "Unhide Commands?\n%1",
      de: "Verborgene Befehle anzeigen?\n%1",
      ru: "\u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c \u0441\u043a\u0440\u044b\u0442\u044b\u0435 \u043a\u043e\u043c\u0430\u043d\u0434\u044b?\n%1",
    },
    cd_reveal_confirm_title: {
      en: "Confirm Commands To Unhide",
      de: "Die ausgew\u00e4hlten Befehle anzeigen?",
      ru: "\u041f\u043e\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044c \u043f\u043e\u043a\u0430\u0437 \u043a\u043e\u043c\u0430\u043d\u0434",
    },
    cd_reveal_menu_select: {
      en: "Select Hidden Menu Commands To Unhide",
      de: "W\u00e4hlen Sie die ausgeblendeten Men\u00fcbefehle aus, die angezeigt werden sollen.",
      ru: "\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0441\u043a\u0440\u044b\u0442\u044b\u0435 \u043a\u043e\u043c\u0430\u043d\u0434\u044b \u0434\u043b\u044f \u043f\u043e\u043a\u0430\u0437\u0430",
    },
    cd_revealed_total: {
      en: "Total hidden commands revealed:\n%1",
      de: "Anzahl der verborgenen Befehle, die wieder angezeigt werden:\n%1",
      ru: "\u041f\u043e\u043a\u0430\u0437\u0430\u043d\u043e \u0441\u043a\u0440\u044b\u0442\u044b\u0445 \u043a\u043e\u043c\u0430\u043d\u0434:\n%1",
    },
    cd_search_for: {
      en: "Search for commands, actions, and loaded scripts.",
      de: "Befehle, Aktionen und geladene Skripte suchen.",
      ru: "\u041f\u043e\u0438\u0441\u043a \u043a\u043e\u043c\u0430\u043d\u0434, \u043e\u043f\u0435\u0440\u0430\u0446\u0438\u0439 \u0438 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043d\u043d\u044b\u0445 \u0441\u043a\u0440\u0438\u043f\u0442\u043e\u0432",
    },
    close: {
      en: "Close",
      de: "Schlie\u00dfen",
      ru: "\u0417\u0430\u043a\u0440\u044b\u0432\u0430\u0442\u044c",
    },
    config: { en: "Configuration", de: "Configuration", ru: "Configuration" },
    copyright: {
      en: "Copyright 2022 Josh Duncan",
      de: "Copyright 2022 Josh Duncan",
      ru: "Copyright 2022 Josh Duncan",
    },
    cp_config: {
      en: "Palette Settings and Configuration",
      de: "Paletteneinstellungen und -konfiguration",
      ru: "\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0430 \u0438 \u043a\u043e\u043d\u0444\u0438\u0433\u0443\u0440\u0430\u0446\u0438\u044f \u043f\u0430\u043d\u0435\u043b\u0438",
    },
    cp_q_helptip: {
      en: "Search for commands, actions, and loaded scripts.",
      de: "Befehle, Aktionen und geladene Skripte suchen.",
      ru: "\u041f\u043e\u0438\u0441\u043a \u043a\u043e\u043c\u0430\u043d\u0434, \u043e\u043f\u0435\u0440\u0430\u0446\u0438\u0439 \u0438 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043d\u043d\u044b\u0445 \u0441\u043a\u0440\u0438\u043f\u0442\u043e\u0432",
    },
    defaults: { en: "Defaults", de: "Defaults", ru: "Defaults" },
    description: {
      en: "Boost your Adobe Illustrator efficiency with quick access to most menu commands and tools, all of your actions, and any scripts right from your keyboard. And, with custom workflows, you can combine multiple commands, actions, and scripts to get things done in your own way. Replace repetitive tasks with workflows and boost your productivity.",
      de: "Steigern Sie Ihre Effizienz in Adobe Illustrator mit schnellem Zugriff auf die meisten Men\u00fcbefehle und Werkzeuge sowie alle Aktionen und Skripte, die direkt \u00fcber die Tastatur ausgef\u00fchrt werden k\u00f6nnen. Mit benutzerdefinierten Arbeitsabl\u00e4ufen k\u00f6nnen Sie mehrere Befehle, Aktionen und Skripte kombinieren. Erledigen Sie wiederkehrende Aufgaben mit Arbeitsabl\u00e4ufen und steigern Sie Ihre Produktivit\u00e4t.",
      ru: "\u041f\u043e\u0432\u044b\u0441\u044c\u0442\u0435 \u0441\u043a\u043e\u0440\u043e\u0441\u0442\u044c \u0440\u0430\u0431\u043e\u0442\u044b \u0432 Adobe Illustrator \u0431\u043b\u0430\u0433\u043e\u0434\u0430\u0440\u044f \u0431\u044b\u0441\u0442\u0440\u043e\u043c\u0443 \u0434\u043e\u0441\u0442\u0443\u043f\u0443 \u043a \u0431\u043e\u043b\u044c\u0448\u0438\u043d\u0441\u0442\u0432\u0443 \u043a\u043e\u043c\u0430\u043d\u0434 \u043c\u0435\u043d\u044e, \u0438\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442\u0430\u043c, \u0432\u0441\u0435\u043c \u043e\u043f\u0435\u0440\u0430\u0446\u0438\u044f\u043c \u0438 \u043b\u044e\u0431\u044b\u043c \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043d\u043d\u044b\u043c \u0441\u043a\u0440\u0438\u043f\u0442\u0430\u043c \u043f\u0440\u044f\u043c\u043e \u0441 \u043a\u043b\u0430\u0432\u0438\u0430\u0442\u0443\u0440\u044b. \u0410 \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c\u0441\u043a\u0438\u0435 \u043d\u0430\u0431\u043e\u0440\u044b \u043f\u043e\u0437\u0432\u043e\u043b\u044f\u044e\u0442 \u043a\u043e\u043c\u0431\u0438\u043d\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u043d\u0435\u0441\u043a\u043e\u043b\u044c\u043a\u043e \u043a\u043e\u043c\u0430\u043d\u0434, \u043e\u043f\u0435\u0440\u0430\u0446\u0438\u0439 \u0438 \u0441\u043a\u0440\u0438\u043f\u0442\u043e\u0432. \u0417\u0430\u043c\u0435\u043d\u0438\u0442\u0435 \u043f\u043e\u0432\u0442\u043e\u0440\u044f\u044e\u0449\u0438\u0435\u0441\u044f \u0437\u0430\u0434\u0430\u0447\u0438 \u043d\u0430\u0431\u043e\u0440\u0430\u043c\u0438 \u043a\u043e\u043c\u0430\u043d\u0434 \u0438 \u043f\u043e\u0432\u044b\u0441\u044c\u0442\u0435 \u0441\u0432\u043e\u044e \u043f\u0440\u043e\u0438\u0437\u0432\u043e\u0434\u0438\u0442\u0435\u043b\u044c\u043d\u043e\u0441\u0442\u044c.",
    },
    document: { en: "Document", de: "Document", ru: "Document" },
    document_report: {
      en: "Active Document Report",
      de: "Dokumentinformationen",
      ru: "Active Document Report",
    },
    document_report_warning: {
      en: "Document Report Warning:\nChanges were made to the documents since the last save so some report information may be incorrect.\n\nPlease save the document before running the report.",
      de: "Achtung:\nSeit dem letzen Speichern des Dokuments wurden \u00c4nderungen vorgenommen. Daher k\u00f6nnten einige Informationen falsch sein.\n\nSpeichern Sie das Dokument, bevor Sie die Dokumentinformationen erneut abrufen.",
      ru: "Document Report Warning:\nChanges were made to the documents since the last save so some report information may be incorrect.\n\nPlease save the document before running the report.",
    },
    dr_color_space: { en: "Color Space: ", de: "Farbmodus: ", ru: "Color Space: " },
    dr_file_created: {
      en: "File Created: ",
      de: "Datei erstellt am: ",
      ru: "File Created: ",
    },
    dr_file_found: { en: "File Found: ", de: "Datei gefunden: ", ru: "File Found: " },
    dr_filename: { en: "File: ", de: "Datei: ", ru: "File: " },
    dr_header: {
      en: "File Information\n-----\n",
      de: "Datei-Information\n-----\n",
      ru: "File Information\n-----\n",
    },
    dr_height: { en: "Height: ", de: "H\u00f6he: ", ru: "Height: " },
    dr_info_string: {
      en: "Ai Document Information",
      de: "AI-Dokument-Information",
      ru: "Ai Document Information",
    },
    dr_name: { en: "Name: ", de: "Name: ", ru: "Name: " },
    dr_path: { en: "Path: ", de: "Pfad: ", ru: "Path: " },
    dr_width: { en: "Width: ", de: "Breite: ", ru: "Width: " },
    file: { en: "File", de: "File", ru: "File" },
    file_saved: {
      en: "File Saved:\n%1",
      de: "Datei gespeichert:\n%1",
      ru: "File Saved:\n%1",
    },
    fl_error_loading: {
      en: "Error loading file:\n%1",
      de: "Fehler beim Laden der Datei:\n%1",
      ru: "\u041e\u0448\u0438\u0431\u043a\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043a\u0438 \u0444\u0430\u0439\u043b\u0430:\n%1",
    },
    fl_error_writing: {
      en: "Error writing file:\n%1",
      de: "Fehler beim Schreiben der Datei:\n%1",
      ru: "\u041e\u0448\u0438\u0431\u043a\u0430 \u0437\u0430\u043f\u0438\u0441\u0438 \u0444\u0430\u0439\u043b\u0430:\n%1",
    },
    fonts: { en: "Fonts", de: "Schriften", ru: "Fonts" },
    github: {
      en: "Click here to learn more",
      de: "Klicken Sie hier f\u00fcr weitere Informationen",
      ru: "\u041d\u0430\u0436\u043c\u0438\u0442\u0435, \u0447\u0442\u043e\u0431\u044b \u0443\u0437\u043d\u0430\u0442\u044c \u0431\u043e\u043b\u044c\u0448\u0435",
    },
    go_to_artboard: {
      en: "Go To Artboard",
      de: "Gehen Sie zur Zeichenfl\u00e4che",
      ru: "\u041f\u0435\u0440\u0435\u0439\u0442\u0438 \u043a \u043c\u043e\u043d\u0442\u0430\u0436\u043d\u043e\u0439 \u043e\u0431\u043b\u0430\u0441\u0442\u0438",
    },
    go_to_named_object: {
      en: "Go To Named Object",
      de: "Gehen Sie zum benannten Objekt",
      ru: "\u041f\u0435\u0440\u0435\u0439\u0442\u0438 \u043a \u0438\u043c\u0435\u043d\u043e\u0432\u0430\u043d\u043d\u043e\u043c\u0443 \u043e\u0431\u044a\u0435\u043a\u0442\u0443",
    },
    go_to_named_object_limit: {
      en: "Attention:\nThis document contains a lot of page items (%1). Please be patient while they load.",
      de: "Attention:\nThis document contains a lot of page items (%1). Please be patient while they load.",
      ru: "Attention:\nThis document contains a lot of page items (%1). Please be patient while they load.",
    },
    go_to_named_object_no_objects: {
      en: "No named page items found.",
      de: "Keine benannten Objekte vorhanden.",
      ru: "No named page items found.",
    },
    go_to_open_document: {
      en: "Go To Open Document",
      de: "Ge\u00f6ffnete Dokumente ausw\u00e4hlen",
      ru: "Go To Open Document",
    },
    layers: { en: "Layers", de: "Ebenen", ru: "Layers" },
    menu: { en: "Menu", de: "Menu", ru: "Menu" },
    name_title_case: { en: "Name", de: "Name", ru: "Name" },
    no_active_document: {
      en: "No active documents.",
      de: "Keine ge\u00f6ffneten Dokumente vorhanden..",
      ru: "No active documents.",
    },
    no_document_variables: {
      en: "No document variables.",
      de: "Keine Variablen vorhanden.",
      ru: "No document variables.",
    },
    none: { en: "None", de: "Ohne", ru: "None" },
    open_recent_file: {
      en: "Open Recent File",
      de: "Zuletzt benutzte Datei \u00f6ffnen",
      ru: "Open Recent File",
    },
    placed_items: { en: "Placed Items", de: "Platzierte Objecte", ru: "Placed Items" },
    pref_file_loading_error: {
      en: "Error Loading Preferences\nA backup copy of your settings has been created.",
      de: "Fehler beim Laden der Voreinstellungen\nEine Sicherungskopie Ihrer Einstellungen wurde erstellt.",
      ru: "Error Loading Preferences\nA backup copy of your settings has been created.",
    },
    pref_file_non_compatible: {
      en: "Error Loading Preferences\nYour preferences file isn't compatible with your current version of Ai Command Palette. Your preferences file will be reset.\n\nA backup copy of your settings has been created.",
      de: "Fehler beim Laden der Voreinstellungen\nIhre Voreinstellungen sind nicht kompatibel mit der aktuellen Version der Kurzbefehle. Ihre Voreinstellungen werden zur\u00fcckgesetzt.\n\nEine Sicherungskopie Ihrer Einstellungen wurde erstellt.",
      ru: "Error Loading Preferences\nYour preferences file isn't compatible with your current version of Ai Command Palette. Your preferences file will be reset.\n\nA backup copy of your settings has been created.",
    },
    pref_update_complete: {
      en: "Preferences Update Complete.",
      de: "Aktualisierung der Voreinstellungen fertiggestellt",
      ru: "Preferences Update Complete",
    },
    recent_commands: {
      en: "Recent Commands",
      de: "Zuletzt verwendete Befehle",
      ru: "Recent Commands",
    },
    recent_commands_cleared: {
      en: "Recent Commands Cleared!",
      de: "Zuletzt verwendete Befehle wurden gel\u00f6scht!",
      ru: "Recent Commands Cleared!",
    },
    save: {
      en: "Save",
      de: "Speichern",
      ru: "\u0421\u043e\u0445\u0440\u0430\u043d\u044f\u0442\u044c",
    },
    sc_already_loaded: {
      en: "Script already loaded.\nWould you like to replace the previous script with the new one?",
      de: "Skript bereits geladen.\nM\u00f6chten Sie es ersetzen?",
      ru: "\u0421\u043a\u0440\u0438\u043f\u0442 \u0443\u0436\u0435 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043d\n\u0425\u043e\u0442\u0438\u0442\u0435 \u0435\u0433\u043e \u0437\u0430\u043c\u0435\u043d\u0438\u0442\u044c?",
    },
    sc_already_loaded_title: {
      en: "Script Load Conflict",
      de: "Skriptladekonflikt",
      ru: "\u041f\u0440\u043e\u0431\u043b\u0435\u043c\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043a\u0438 \u0441\u043a\u0440\u0438\u043f\u0442\u0430",
    },
    sc_error_execution: {
      en: "Error executing script:\n%1\n\n%2",
      de: "Fehler beim Ausf\u00fchren des Skripts:\n%1\n\n%2",
      ru: "\u041e\u0448\u0438\u0431\u043a\u0430 \u0437\u0430\u043f\u0443\u0441\u043a\u0430 \u0441\u043a\u0440\u0438\u043f\u0442\u0430:\n%1\n\n%2",
    },
    sc_error_exists: {
      en: "Script no longer exists at original path. Try reloading.\n%1",
      de: "Skript existiert nicht mehr am urspr\u00fcnglichen Ort.\n%1",
      ru: "\u0421\u043a\u0440\u0438\u043f\u0442 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d \u0432 \u0443\u043a\u0430\u0437\u0430\u043d\u043d\u043e\u0439 \u043f\u0430\u043f\u043a\u0435\n%1",
    },
    sc_error_loading: {
      en: "Error loading script:\n%1",
      de: "Fehler beim Laden des Skripts:\n%1",
      ru: "\u041e\u0448\u0438\u0431\u043a\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043a\u0438 \u0441\u043a\u0440\u0438\u043f\u0442\u0430:\n%1",
    },
    sc_load_script: { en: "Load Script(s)", de: "Skripte laden", ru: "Load Script(s)" },
    sc_none_selected: {
      en: "No script files selected.\nMust be JavaScript '.js' or '.jsx' files.",
      de: "Keine Skriptdateien ausgew\u00e4hlt.\nEs m\u00fcssen JavaScript-'.js'- oder '.jsx'-Dateien sein.",
      ru: "\u041d\u0435 \u0432\u044b\u0431\u0440\u0430\u043d\u044b \u0441\u043a\u0440\u0438\u043f\u0442\u044b\n\u0424\u0430\u0439\u043b\u044b JavaScript \u0438\u043c\u0435\u044e\u0442 \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043d\u0438\u0435 '.js' \u0438\u043b\u0438 '.jsx'",
    },
    sc_total_loaded: {
      en: "Total scripts loaded:\n%1",
      de: "Geladene Skripte insgesamt:\n%1",
      ru: "\u0417\u0430\u0433\u0440\u0443\u0436\u0435\u043d\u043e \u0441\u043a\u0440\u0438\u043f\u0442\u043e\u0432:\n%1",
    },
    script: { en: "Script", de: "Skript", ru: "\u0421\u043a\u0440\u0438\u043f\u0442" },
    Scripts: { en: "Scripts", de: "Skripte laden", ru: "Scripts" },
    spot_colors: { en: "Spot Colors", de: "Volltonfarben", ru: "Spot Colors" },
    startup_builder: {
      en: "Startup Screen Customizer",
      de: "Startup Screen Customizer",
      ru: "Startup Screen Customizer",
    },
    startup_error_saving: {
      en: "Error saving startup commands.\nPrevious settings were reloaded.",
      de: "Error saving startup commands.\nPrevious settings were reloaded.",
      ru: "Error saving startup commands.\nPrevious settings were reloaded.",
    },
    startup_helptip: {
      en: "Double-click a command to add it to your startup command list below.",
      de: "Double-click a command to add it to your startup command list below.",
      ru: "Double-click a command to add it to your startup command list below.",
    },
    startup_steps: {
      en: "Startup Commands",
      de: "Startup Commands",
      ru: "Startup Commands",
    },
    startup_steps_helptip: {
      en: "Startup commands will displayed in order from top to bottom.",
      de: "Startup commands will displayed in order from top to bottom.",
      ru: "Startup commands will displayed in order from top to bottom.",
    },
    step_delete: {
      en: "Delete",
      de: "L\u00f6schen",
      ru: "\u0423\u0434\u0430\u043b\u0438\u0442\u044c",
    },
    step_down: { en: "Move Down", de: "Nach unten", ru: "\u0412\u043d\u0438\u0437" },
    step_up: {
      en: "Move Up",
      de: "Nach oben",
      ru: "\u041d\u0430\u0432\u0435\u0440\u0445",
    },
    title: { en: "Ai Command Palette", de: "Kurzbefehle", ru: "Ai Command Palette" },
    tl_all: {
      en: "All Built-In Tools",
      de: "Alle integrierten Werkzeuge",
      ru: "\u0421\u0442\u0430\u043d\u0434\u0430\u0440\u0442\u043d\u044b\u0435 \u0438\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442\u044b",
    },
    tl_error_selecting: {
      en: "Error selecting tool:\n%1\n\n%2",
      de: "Fehler beim Ausw\u00e4hlen des Werkzeugs:\n%1\n\n%2",
      ru: "\u041e\u0448\u0438\u0431\u043a\u0430 \u0432\u044b\u0431\u043e\u0440\u0430 \u0438\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442\u0430:\n%1\n\n%2",
    },
    tl_none_available: {
      en: "No tools are currently available.",
      de: "Zurzeit sind keine Werkzeuge verf\u00fcgbar.",
      ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442\u044b \u0432 \u0434\u0430\u043d\u043d\u044b\u0439 \u043c\u043e\u043c\u0435\u043d\u0442 \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u043d\u044b",
    },
    tool: { en: "Tool", de: "Tool", ru: "Tool" },
    type_title_case: { en: "Type", de: "Type", ru: "Type" },
    version: {
      en: "Version %1",
      de: "Ausf\u00fchrung %1",
      ru: "\u0432\u0435\u0440\u0441\u0438\u044f %1",
    },
    wf_already_exists: {
      en: "A workflow with that name already exists.\nWould you like to overwrite the previous workflow with the new one?",
      de: "Ein Arbeitsablauf mit diesem Namen existiert bereits.\nSoll der bestehende Arbeitsablauf \u00fcberschrieben werden?",
      ru: "\u041d\u0430\u0431\u043e\u0440 \u0441 \u0442\u0430\u043a\u0438\u043c \u0438\u043c\u0435\u043d\u0435\u043c \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442\n\u0425\u043e\u0442\u0438\u0442\u0435 \u043f\u0435\u0440\u0435\u0437\u0430\u043f\u0438\u0441\u0430\u0442\u044c \u043f\u0440\u0435\u0434\u044b\u0434\u0443\u0449\u0438\u0439?",
    },
    wf_already_exists_title: {
      en: "Save Workflow Conflict",
      de: "Arbeitsablauf-Konflikt speichern?",
      ru: "\u041f\u0440\u043e\u0431\u043b\u0435\u043c\u0430 \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u0438\u044f \u043d\u0430\u0431\u043e\u0440\u0430",
    },
    wf_builder: {
      en: "Workflow Builder",
      de: "Arbeitsabl\u00e4ufe erstellen",
      ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u043e\u0440 \u043d\u0430\u0431\u043e\u0440\u043e\u0432 \u043a\u043e\u043c\u0430\u043d\u0434",
    },
    wf_choose: {
      en: "Choose A Workflow To Edit",
      de: "W\u00e4hlen Sie einen Arbeitsablauf zum Bearbeiten aus.",
      ru: "\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043d\u0430\u0431\u043e\u0440 \u0434\u043b\u044f \u0440\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f",
    },
    wf_error_saving: {
      en: "Error saving workflow:\n%1",
      de: "Fehler beim Speichern des Arbeitsablaufs:\n%1",
      ru: "\u041e\u0448\u0438\u0431\u043a\u0430 \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u0438\u044f \u043d\u0430\u0431\u043e\u0440\u0430:\n%1",
    },
    wf_needs_attention: {
      en: "Workflow needs attention.\nThe following action steps from your workflow are no longer available.\n\nDeleted Actions:\n%1\n\nIncompatible Actions:\n%2",
      de: "Achtung!\nDie folgenden Aktionsschritte sind nicht mehr vorhanden\n\nGel\u00f6schte Aktionen:\n%1\n\nInkompatible Aktionen:\n%2",
      ru: "\u041d\u0430\u0431\u043e\u0440 \u0442\u0440\u0435\u0431\u0443\u0435\u0442 \u0432\u043d\u0438\u043c\u0430\u043d\u0438\u044f\n\u0423\u043a\u0430\u0437\u0430\u043d\u043d\u044b\u0435 \u0448\u0430\u0433\u0438 \u0432 \u0432\u0430\u0448\u0435\u043c \u043d\u0430\u0431\u043e\u0440\u0435 \u043a\u043e\u043c\u0430\u043d\u0434 \u0431\u043e\u043b\u044c\u0448\u0435 \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u043d\u044b.\n\n\u0423\u0434\u0430\u043b\u0435\u043d\u043d\u044b\u0435 \u043a\u043e\u043c\u0430\u043d\u0434\u044b:\n%1\n\n\u041d\u0435\u0441\u043e\u0432\u043c\u0435\u0441\u0442\u0438\u043c\u044b\u0435 \u043a\u043e\u043c\u0430\u043d\u0434\u044b:\n%2",
    },
    wf_none_attention: {
      en: "There are no workflows that need attention.",
      de: "Es gibt keine Arbeitsabl\u00e4ufe, die beachtet werden m\u00fcssen.",
      ru: "\u041d\u0435\u0442 \u043d\u0430\u0431\u043e\u0440\u043e\u0432 \u0442\u0440\u0435\u0431\u0443\u044e\u0449\u0438\u0445 \u0432\u043d\u0438\u043c\u0430\u043d\u0438\u044f",
    },
    wf_none_edit: {
      en: "There are no workflows to edit.",
      de: "Es gibt keine Arbeitsabl\u00e4ufe zum Bearbeiten.",
      ru: "\u041d\u0435\u0442 \u043d\u0430\u0431\u043e\u0440\u043e\u0432 \u0434\u043b\u044f \u0440\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f",
    },
    wf_not_saved: {
      en: "Workflow not saved.",
      de: "Arbeitsablauf nicht gespeichert",
      ru: "\u041d\u0430\u0431\u043e\u0440 \u043d\u0435 \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d",
    },
    wf_save: { en: "Save", de: "Save", ru: "Save" },
    wf_save_as: {
      en: "Save Workflow As",
      de: "Arbeitsablauf speichern als",
      ru: "\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u043d\u0430\u0431\u043e\u0440 \u043a\u0430\u043a",
    },
    wf_steps: {
      en: "Workflow Steps",
      de: "Befehlskombinationen",
      ru: "\u0428\u0430\u0433\u0438 \u043d\u0430\u0431\u043e\u0440\u0430",
    },
    wf_steps_helptip: {
      en: "Workflows will run in order from top to bottom.",
      de: "Die Befehlskombinationen werden in der Reihenfolge von oben nach unten ausgef\u00fchrt.",
      ru: "\u041d\u0430\u0431\u043e\u0440 \u0432\u044b\u043f\u043e\u043b\u043d\u044f\u0435\u0442\u0441\u044f \u0441\u0432\u0435\u0440\u0445\u0443 \u0432\u043d\u0438\u0437",
    },
    workflow: {
      en: "Workflow",
      de: "Arbeitsablauf",
      ru: "\u041d\u0430\u0431\u043e\u0440\u044b",
    },
    Workflows: { en: "Workflows", de: "Arbeitsabl\u00e4ufe", ru: "Workflows" },
  };

  var commandsData = {
    menu_new: {
      id: "menu_new",
      action: "new",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "File > New...",
        de: "Datei > Neu \u2026",
        ru: "\u0424\u0430\u0439\u043b > \u041d\u043e\u0432\u044b\u0439...",
      },
      hidden: false,
    },
    menu_newFromTemplate: {
      id: "menu_newFromTemplate",
      action: "newFromTemplate",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "File > New from Template...",
        de: "Datei > Neu aus Vorlage \u2026",
        ru: "\u0424\u0430\u0439\u043b > \u041d\u043e\u0432\u044b\u0439 \u0438\u0437 \u0448\u0430\u0431\u043b\u043e\u043d\u0430...",
      },
      hidden: false,
    },
    menu_open: {
      id: "menu_open",
      action: "open",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "File > Open...",
        de: "Datei > \u00d6ffnen \u2026",
        ru: "\u0424\u0430\u0439\u043b > \u041e\u0442\u043a\u0440\u044b\u0442\u044c...",
      },
      hidden: false,
    },
    menu_Adobe_Bridge_Browse: {
      id: "menu_Adobe_Bridge_Browse",
      action: "Adobe Bridge Browse",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "File > Browse in Bridge...",
        de: "Datei > Bridge durchsuchen \u2026",
        ru: "\u0424\u0430\u0439\u043b > \u041e\u0431\u0437\u043e\u0440 \u0432 Bridge...",
      },
      hidden: false,
    },
    menu_close: {
      id: "menu_close",
      action: "close",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "File > Close",
        de: "Datei > Schlie\u00dfen",
        ru: "\u0424\u0430\u0439\u043b > \u0417\u0430\u043a\u0440\u044b\u0442\u044c",
      },
      hidden: false,
    },
    menu_save: {
      id: "menu_save",
      action: "save",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "File > Save",
        de: "Datei > Speichern",
        ru: "\u0424\u0430\u0439\u043b > \u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c",
      },
      hidden: false,
    },
    menu_saveas: {
      id: "menu_saveas",
      action: "saveas",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "File > Save As...",
        de: "Datei > Speichern unter \u2026",
        ru: "\u0424\u0430\u0439\u043b > \u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u043a\u0430\u043a...",
      },
      hidden: false,
    },
    menu_saveacopy: {
      id: "menu_saveacopy",
      action: "saveacopy",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "File > Save a Copy...",
        de: "Datei > Kopie speichern \u2026",
        ru: "\u0424\u0430\u0439\u043b > \u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u043a\u043e\u043f\u0438\u044e...",
      },
      hidden: false,
    },
    menu_saveastemplate: {
      id: "menu_saveastemplate",
      action: "saveastemplate",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "File > Save as Template...",
        de: "Datei > Als Vorlage speichern \u2026",
        ru: "\u0424\u0430\u0439\u043b > \u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u043a\u0430\u043a \u0448\u0430\u0431\u043b\u043e\u043d...",
      },
      hidden: false,
    },
    menu_Adobe_AI_Save_Selected_Slices: {
      id: "menu_Adobe_AI_Save_Selected_Slices",
      action: "Adobe AI Save Selected Slices",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "File > Save Selected Slices...",
        de: "Datei > Ausgew\u00e4hlte Slices speichern \u2026",
        ru: "\u0424\u0430\u0439\u043b > \u0424\u0430\u0439\u043b > \u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0432\u044b\u0434\u0435\u043b\u0435\u043d\u043d\u044b\u0435 \u0444\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u044b...",
      },
      hidden: false,
    },
    menu_revert: {
      id: "menu_revert",
      action: "revert",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "File > Revert",
        de: "Datei > Zur\u00fcck zur letzten Version",
        ru: "\u0424\u0430\u0439\u043b > \u0412\u043e\u0441\u0441\u0442\u0430\u043d\u043e\u0432\u0438\u0442\u044c",
      },
      hidden: false,
    },
    menu_Search_Adobe_Stock: {
      id: "menu_Search_Adobe_Stock",
      action: "Search Adobe Stock",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "File > Search Adobe Stock",
        de: "Datei > Adobe Stock durchsuchen \u2026",
        ru: "\u0424\u0430\u0439\u043b > \u041f\u043e\u0438\u0441\u043a \u0432 Adobe Stock...",
      },
      hidden: false,
      minVersion: 19,
    },
    menu_AI_Place: {
      id: "menu_AI_Place",
      action: "AI Place",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "File > Place...",
        de: "Datei > Platzieren \u2026",
        ru: "\u0424\u0430\u0439\u043b > \u041f\u043e\u043c\u0435\u0441\u0442\u0438\u0442\u044c...",
      },
      hidden: false,
    },
    menu_exportForScreens: {
      id: "menu_exportForScreens",
      action: "exportForScreens",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "File > Export > Export For Screens...",
        de: "Datei > Exportieren > F\u00fcr Bildschirme exportieren \u2026",
        ru: "\u0424\u0430\u0439\u043b > \u042d\u043a\u0441\u043f\u043e\u0440\u0442 \u0434\u043b\u044f \u044d\u043a\u0440\u0430\u043d\u043e\u0432...",
      },
      hidden: false,
      minVersion: 20,
    },
    menu_export: {
      id: "menu_export",
      action: "export",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "File > Export > Export As...",
        de: "Datei > Exportieren \u2026",
        ru: "\u0424\u0430\u0439\u043b > \u042d\u043a\u0441\u043f\u043e\u0440\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u043a\u0430\u043a...",
      },
      hidden: false,
    },
    menu_Adobe_AI_Save_For_Web: {
      id: "menu_Adobe_AI_Save_For_Web",
      action: "Adobe AI Save For Web",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "File > Export > Save for Web (Legacy)...",
        de: "Datei > F\u00fcr Web speichern (Legacy) \u2026",
        ru: "\u0424\u0430\u0439\u043b > \u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0434\u043b\u044f \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u043e\u0432...",
      },
      hidden: false,
    },
    menu_exportSelection: {
      id: "menu_exportSelection",
      action: "exportSelection",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "File > Export Selection...",
        de: "Datei > Auswahl exportieren \u2026",
        ru: "\u0424\u0430\u0439\u043b > \u042d\u043a\u0441\u043f\u043e\u0440\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0432\u044b\u0434\u0435\u043b\u0435\u043d\u043d\u044b\u0435 \u044d\u043b\u0435\u043c\u0435\u043d\u0442\u044b...",
      },
      hidden: false,
      minVersion: 20,
    },
    menu_Package_Menu_Item: {
      id: "menu_Package_Menu_Item",
      action: "Package Menu Item",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "File > Package",
        de: "Datei > Verpacken \u2026",
        ru: "\u0424\u0430\u0439\u043b > \u0423\u043f\u0430\u043a\u043e\u0432\u0430\u0442\u044c...",
      },
      hidden: false,
    },
    menu_ai_browse_for_script: {
      id: "menu_ai_browse_for_script",
      action: "ai_browse_for_script",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "File > Scripts > Other Script...",
        de: "Datei > Skripten > Anderes Skript \u2026",
        ru: "\u0424\u0430\u0439\u043b > \u0421\u0446\u0435\u043d\u0430\u0440\u0438\u0438 > \u0414\u0440\u0443\u0433\u043e\u0439 \u0441\u0446\u0435\u043d\u0430\u0440\u0438\u0439...",
      },
      hidden: false,
    },
    menu_document: {
      id: "menu_document",
      action: "document",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "File > Document Setup...",
        de: "Datei > Dokument einrichten \u2026",
        ru: "\u0424\u0430\u0439\u043b > \u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u0430...",
      },
      hidden: false,
    },
    "menu_doc-color-cmyk": {
      id: "menu_doc-color-cmyk",
      action: "doc-color-cmyk",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "File > Document Color Mode > CMYK Color",
        de: "Datei > Dokumentfarbmodus > CMYK-Farbe",
        ru: "\u0424\u0430\u0439\u043b > \u0426\u0432\u0435\u0442\u043e\u0432\u043e\u0439 \u0440\u0435\u0436\u0438\u043c \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u0430 > CMYK",
      },
      hidden: false,
    },
    "menu_doc-color-rgb": {
      id: "menu_doc-color-rgb",
      action: "doc-color-rgb",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "File > Document Color Mode > RGB Color",
        de: "Datei > Dokumentfarbmodus > RGB-Farbe",
        ru: "\u0424\u0430\u0439\u043b > \u0426\u0432\u0435\u0442\u043e\u0432\u043e\u0439 \u0440\u0435\u0436\u0438\u043c \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u0430 > RGB",
      },
      hidden: false,
    },
    menu_File_Info: {
      id: "menu_File_Info",
      action: "File Info",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "File > File Info...",
        de: "Datei > Dateiinformationen \u2026",
        ru: "\u0424\u0430\u0439\u043b > \u0421\u0432\u0435\u0434\u0435\u043d\u0438\u044f \u043e \u0444\u0430\u0439\u043b\u0435...",
      },
      hidden: false,
    },
    menu_Print: {
      id: "menu_Print",
      action: "Print",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "File > Print...",
        de: "Datei > Drucken \u2026",
        ru: "\u0424\u0430\u0439\u043b > \u041f\u0435\u0447\u0430\u0442\u044c...",
      },
      hidden: false,
    },
    menu_quit: {
      id: "menu_quit",
      action: "quit",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "File > Exit",
        de: "Datei > Illustrator beenden",
        ru: "\u0424\u0430\u0439\u043b > \u0412\u044b\u0445\u043e\u0434",
      },
      hidden: false,
    },
    menu_undo: {
      id: "menu_undo",
      action: "undo",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Edit > Undo",
        de: "Bearbeiten > R\u00fcckg\u00e4ngig",
        ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c",
      },
      hidden: false,
    },
    menu_redo: {
      id: "menu_redo",
      action: "redo",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Edit > Redo",
        de: "Bearbeiten > Wiederholen",
        ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c",
      },
      hidden: false,
    },
    menu_cut: {
      id: "menu_cut",
      action: "cut",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Edit > Cut",
        de: "Bearbeiten > Ausschneiden",
        ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0412\u044b\u0440\u0435\u0437\u0430\u0442\u044c",
      },
      hidden: false,
    },
    menu_copy: {
      id: "menu_copy",
      action: "copy",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Edit > Copy",
        de: "Bearbeiten > Kopieren",
        ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u041a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u0442\u044c",
      },
      hidden: false,
    },
    menu_paste: {
      id: "menu_paste",
      action: "paste",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Edit > Paste",
        de: "Bearbeiten > Einf\u00fcgen",
        ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0412\u0441\u0442\u0430\u0432\u0438\u0442\u044c",
      },
      hidden: false,
    },
    menu_pasteFront: {
      id: "menu_pasteFront",
      action: "pasteFront",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Edit > Paste in Front",
        de: "Bearbeiten > Davor einf\u00fcgen",
        ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0412\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u043d\u0430 \u043f\u0435\u0440\u0435\u0434\u043d\u0438\u0439 \u043f\u043b\u0430\u043d",
      },
      hidden: false,
    },
    menu_pasteBack: {
      id: "menu_pasteBack",
      action: "pasteBack",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Edit > Paste in Back",
        de: "Bearbeiten > Dahinter einf\u00fcgen",
        ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0412\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u043d\u0430 \u0437\u0430\u0434\u043d\u0438\u0439 \u043f\u043b\u0430\u043d",
      },
      hidden: false,
    },
    menu_pasteInPlace: {
      id: "menu_pasteInPlace",
      action: "pasteInPlace",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Edit > Paste in Place",
        de: "Bearbeiten > An Originalposition einf\u00fcgen",
        ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0412\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u043d\u0430 \u0442\u043e \u0436\u0435 \u043c\u0435\u0441\u0442\u043e",
      },
      hidden: false,
    },
    menu_pasteInAllArtboard: {
      id: "menu_pasteInAllArtboard",
      action: "pasteInAllArtboard",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Edit > Paste on All Artboards",
        de: "Bearbeiten > In alle Zeichenfl\u00e4chen einf\u00fcgen",
        ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0412\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u043d\u0430 \u0432\u0441\u0435 \u043c\u043e\u043d\u0442\u0430\u0436\u043d\u044b\u0435 \u043e\u0431\u043b\u0430\u0441\u0442\u0438",
      },
      hidden: false,
    },
    menu_pasteWithoutFormatting: {
      id: "menu_pasteWithoutFormatting",
      action: "pasteWithoutFormatting",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Edit > Paste without Formatting",
        de: "Bearbeiten > Ohne Formatierung einf\u00fcgen",
        ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0412\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u0431\u0435\u0437 \u0444\u043e\u0440\u043c\u0430\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f",
      },
      hidden: false,
      minVersion: 25.3,
    },
    menu_clear: {
      id: "menu_clear",
      action: "clear",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Edit > Clear",
        de: "Bearbeiten > L\u00f6schen",
        ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u041e\u0447\u0438\u0441\u0442\u0438\u0442\u044c",
      },
      hidden: false,
    },
    menu_Find_and_Replace: {
      id: "menu_Find_and_Replace",
      action: "Find and Replace",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Edit > Find & Replace...",
        de: "Bearbeiten > Suchen und ersetzen \u2026",
        ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u041d\u0430\u0439\u0442\u0438 \u0438 \u0437\u0430\u043c\u0435\u043d\u0438\u0442\u044c...",
      },
      hidden: false,
    },
    menu_Find_Next: {
      id: "menu_Find_Next",
      action: "Find Next",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Edit > Find Next",
        de: "Bearbeiten > Weitersuchen",
        ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u041d\u0430\u0439\u0442\u0438 \u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u0439",
      },
      hidden: false,
    },
    menu_Auto_Spell_Check: {
      id: "menu_Auto_Spell_Check",
      action: "Auto Spell Check",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Edit > Spelling > Auto Spell Check",
        de: "Bearbeiten > Rechtschreibung > Automatische Rechtschreibpr\u00fcfung",
        ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u041e\u0440\u0444\u043e\u0433\u0440\u0430\u0444\u0438\u044f > \u0410\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0430\u044f \u043f\u0440\u043e\u0432\u0435\u0440\u043a\u0430 \u043e\u0440\u0444\u043e\u0433\u0440\u0430\u0444\u0438\u0438",
      },
      hidden: false,
      minVersion: 24,
    },
    menu_Check_Spelling: {
      id: "menu_Check_Spelling",
      action: "Check Spelling",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Edit > Spelling > Check Spelling...",
        de: "Bearbeiten > Rechtschreibung > Rechtschreibpr\u00fcfung \u2026",
        ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u041e\u0440\u0444\u043e\u0433\u0440\u0430\u0444\u0438\u044f > \u041f\u0440\u043e\u0432\u0435\u0440\u043a\u0430 \u043e\u0440\u0444\u043e\u0433\u0440\u0430\u0444\u0438\u0438\u2026",
      },
      hidden: false,
      minVersion: 24,
    },
    "menu_Edit_Custom_Dictionary...": {
      id: "menu_Edit_Custom_Dictionary...",
      action: "Edit Custom Dictionary...",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Edit > Edit Custom Dictionary...",
        de: "Bearbeiten > Eigenes W\u00f6rterbuch bearbeiten \u2026",
        ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0437\u0430\u043a\u0430\u0437\u043d\u043e\u0439 \u0441\u043b\u043e\u0432\u0430\u0440\u044c...",
      },
      hidden: false,
    },
    menu_Recolor_Art_Dialog: {
      id: "menu_Recolor_Art_Dialog",
      action: "Recolor Art Dialog",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Edit > Edit Colors > Recolor Artwork...",
        de: "Bearbeiten > Farben bearbeiten > Bildmaterial neu f\u00e4rben \u2026",
        ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0446\u0432\u0435\u0442\u0430 > \u041f\u0435\u0440\u0435\u043a\u0440\u0430\u0441\u0438\u0442\u044c \u0433\u0440\u0430\u0444\u0438\u0447\u0435\u0441\u043a\u0438\u0439 \u043e\u0431\u044a\u0435\u043a\u0442...",
      },
      hidden: false,
    },
    menu_Adjust3: {
      id: "menu_Adjust3",
      action: "Adjust3",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Edit > Edit Colors > Adjust Color Balance...",
        de: "Bearbeiten > Farben bearbeiten > Farbbalance einstellen \u2026",
        ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0446\u0432\u0435\u0442\u0430 > \u041a\u043e\u0440\u0440\u0435\u043a\u0446\u0438\u044f \u0446\u0432\u0435\u0442\u043e\u0432\u043e\u0433\u043e \u0431\u0430\u043b\u0430\u043d\u0441\u0430...",
      },
      hidden: false,
    },
    menu_Colors3: {
      id: "menu_Colors3",
      action: "Colors3",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Edit > Edit Colors > Blend Front to Back",
        de: "Bearbeiten > Farben bearbeiten > Vorne -> Hinten angleichen",
        ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0446\u0432\u0435\u0442\u0430 > \u041f\u0435\u0440\u0435\u0445\u043e\u0434 \u043e\u0442 \u0432\u0435\u0440\u0445\u043d\u0435\u0433\u043e \u043a \u043d\u0438\u0436\u043d\u0435\u043c\u0443",
      },
      hidden: false,
    },
    menu_Colors4: {
      id: "menu_Colors4",
      action: "Colors4",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Edit > Edit Colors > Blend Horizontally",
        de: "Bearbeiten > Farben bearbeiten > Horizontal angleichen",
        ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0446\u0432\u0435\u0442\u0430 > \u041f\u0435\u0440\u0435\u0445\u043e\u0434 \u043f\u043e \u0433\u043e\u0440\u0438\u0437\u043e\u043d\u0442\u0430\u043b\u0438",
      },
      hidden: false,
    },
    menu_Colors5: {
      id: "menu_Colors5",
      action: "Colors5",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Edit > Edit Colors > Blend Vertically",
        de: "Bearbeiten > Farben bearbeiten > Vertikal angleichen",
        ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0446\u0432\u0435\u0442\u0430 > \u041f\u0435\u0440\u0435\u0445\u043e\u0434 \u043f\u043e \u0432\u0435\u0440\u0442\u0438\u043a\u0430\u043b\u0438",
      },
      hidden: false,
    },
    menu_Colors8: {
      id: "menu_Colors8",
      action: "Colors8",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Edit > Edit Colors > Convert to CMYK",
        de: "Bearbeiten > Farben bearbeiten > In CMYK konvertieren",
        ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0446\u0432\u0435\u0442\u0430 > \u041f\u0440\u0435\u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u044c \u0432 CMYK",
      },
      hidden: false,
    },
    menu_Colors7: {
      id: "menu_Colors7",
      action: "Colors7",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Edit > Edit Colors > Convert to Grayscale",
        de: "Bearbeiten > Farben bearbeiten > In Graustufen konvertieren",
        ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0446\u0432\u0435\u0442\u0430 > \u041f\u0440\u0435\u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u044c \u0432 \u0433\u0440\u0430\u0434\u0430\u0446\u0438\u0438 \u0441\u0435\u0440\u043e\u0433\u043e",
      },
      hidden: false,
    },
    menu_Colors9: {
      id: "menu_Colors9",
      action: "Colors9",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Edit > Edit Colors > Convert to RGB",
        de: "Bearbeiten > Farben bearbeiten > In RGB konvertieren",
        ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0446\u0432\u0435\u0442\u0430 > \u041f\u0440\u0435\u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u044c \u0432 RGB",
      },
      hidden: false,
    },
    menu_Generative_Recolor_Art_Dialog: {
      id: "menu_Generative_Recolor_Art_Dialog",
      action: "Generative Recolor Art Dialog",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Edit > Edit Colors > Generative Recolor (Beta)",
        de: "Bearbeiten > Farben bearbeiten > Generative Neuf\u00e4rbung",
        ru: "Edit > Edit Colors > Generative Recolor (Beta)",
      },
      hidden: false,
      minVersion: 27.6,
    },
    menu_Colors6: {
      id: "menu_Colors6",
      action: "Colors6",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Edit > Edit Colors > Invert Colors",
        de: "Bearbeiten > Farben bearbeiten > Farben invertieren",
        ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0446\u0432\u0435\u0442\u0430 > \u041d\u0435\u0433\u0430\u0442\u0438\u0432",
      },
      hidden: false,
    },
    menu_Overprint2: {
      id: "menu_Overprint2",
      action: "Overprint2",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Edit > Edit Colors > Overprint Black...",
        de: "Bearbeiten > Farben bearbeiten > Schwarz \u00fcberdrucken \u2026",
        ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0446\u0432\u0435\u0442\u0430 > \u041d\u0430\u043b\u043e\u0436\u0435\u043d\u0438\u0435 \u0447\u0435\u0440\u043d\u043e\u0433\u043e \u0446\u0432\u0435\u0442\u0430...",
      },
      hidden: false,
    },
    menu_Saturate3: {
      id: "menu_Saturate3",
      action: "Saturate3",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Edit > Edit Colors > Saturate...",
        de: "Bearbeiten > Farben bearbeiten > S\u00e4ttigung erh\u00f6hen \u2026",
        ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0446\u0432\u0435\u0442\u0430 > \u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c \u043d\u0430\u0441\u044b\u0449\u0435\u043d\u043d\u043e\u0441\u0442\u044c...",
      },
      hidden: false,
    },
    menu_EditOriginal_Menu_Item: {
      id: "menu_EditOriginal_Menu_Item",
      action: "EditOriginal Menu Item",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Edit > Edit Original",
        de: "Bearbeiten > Original bearbeiten",
        ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u043e\u0440\u0438\u0433\u0438\u043d\u0430\u043b",
      },
      hidden: false,
    },
    menu_Transparency_Presets: {
      id: "menu_Transparency_Presets",
      action: "Transparency Presets",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Edit > Transparency Flattener Presets...",
        de: "Bearbeiten > Transparenzreduzierungsvorgaben \u2026",
        ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0421\u0442\u0438\u043b\u0438 \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0438 \u043f\u0440\u043e\u0437\u0440\u0430\u0447\u043d\u043e\u0441\u0442\u0438...",
      },
      hidden: false,
    },
    menu_Print_Presets: {
      id: "menu_Print_Presets",
      action: "Print Presets",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Edit > Print Presets...",
        de: "Bearbeiten > Druckvorgaben \u2026",
        ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0421\u0442\u0438\u043b\u0438 \u043f\u0435\u0447\u0430\u0442\u0438...",
      },
      hidden: false,
    },
    menu_PDF_Presets: {
      id: "menu_PDF_Presets",
      action: "PDF Presets",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Edit > Adobe PDF Presets...",
        de: "Bearbeiten > Adobe PDF-Vorgaben \u2026",
        ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0421\u0442\u0438\u043b\u0438 \u043f\u0440\u0435\u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u043d\u0438\u044f \u0432 Adobe PDF...",
      },
      hidden: false,
    },
    menu_PerspectiveGridPresets: {
      id: "menu_PerspectiveGridPresets",
      action: "PerspectiveGridPresets",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Edit > Perspective Grid Presets...",
        de: "Bearbeiten > Vorgaben f\u00fcr Perspektivenraster \u2026",
        ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u0421\u0442\u0438\u043b\u0438 \u0441\u0435\u0442\u043a\u0438 \u043f\u0435\u0440\u0441\u043f\u0435\u043a\u0442\u0438\u0432\u044b...",
      },
      hidden: false,
    },
    menu_color: {
      id: "menu_color",
      action: "color",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Edit > Color Settings...",
        de: "Bearbeiten > Farbeinstellungen \u2026",
        ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0430 \u0446\u0432\u0435\u0442\u043e\u0432...",
      },
      hidden: false,
    },
    menu_assignprofile: {
      id: "menu_assignprofile",
      action: "assignprofile",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Edit > Assign Profile...",
        de: "Bearbeiten > Profil zuweisen \u2026",
        ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u041d\u0430\u0437\u043d\u0430\u0447\u0438\u0442\u044c \u043f\u0440\u043e\u0444\u0438\u043b\u044c...",
      },
      hidden: false,
    },
    menu_KBSC_Menu_Item: {
      id: "menu_KBSC_Menu_Item",
      action: "KBSC Menu Item",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Edit > Keyboard Shortcuts...",
        de: "Bearbeiten > Tastaturbefehle \u2026",
        ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 > \u041a\u043e\u043c\u0431\u0438\u043d\u0430\u0446\u0438\u0438 \u043a\u043b\u0430\u0432\u0438\u0448...",
      },
      hidden: false,
    },
    menu_SWFPresets: {
      id: "menu_SWFPresets",
      action: "SWFPresets",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Edit > SWF Presets...",
        de: "Bearbeiten > SWF-Vorgaben \u2026",
        ru: "Edit > SWF Presets...",
      },
      hidden: false,
      minVersion: 22,
      maxVersion: 25.9,
    },
    menu_transformagain: {
      id: "menu_transformagain",
      action: "transformagain",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Transform > Transform Again",
        de: "Objekt > Transformieren > Erneut transformieren",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0422\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c > \u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c \u0442\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435",
      },
      hidden: false,
    },
    menu_transformmove: {
      id: "menu_transformmove",
      action: "transformmove",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Transform > Move...",
        de: "Objekt > Transformieren > Verschieben \u2026",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0422\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c > \u041f\u0435\u0440\u0435\u043c\u0435\u0449\u0435\u043d\u0438\u0435...",
      },
      hidden: false,
    },
    menu_transformrotate: {
      id: "menu_transformrotate",
      action: "transformrotate",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Transform > Rotate...",
        de: "Objekt > Transformieren > Drehen \u2026",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0422\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c > \u041f\u043e\u0432\u043e\u0440\u043e\u0442...",
      },
      hidden: false,
    },
    menu_transformreflect: {
      id: "menu_transformreflect",
      action: "transformreflect",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Transform > Reflect...",
        de: "Objekt > Transformieren > Spiegeln \u2026",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0422\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c > \u0417\u0435\u0440\u043a\u0430\u043b\u044c\u043d\u043e\u0435 \u043e\u0442\u0440\u0430\u0436\u0435\u043d\u0438\u0435...",
      },
      hidden: false,
    },
    menu_transformscale: {
      id: "menu_transformscale",
      action: "transformscale",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Transform > Scale...",
        de: "Objekt > Transformieren > Skalieren \u2026",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0422\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c > \u041c\u0430\u0441\u0448\u0442\u0430\u0431\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435...",
      },
      hidden: false,
    },
    menu_transformshear: {
      id: "menu_transformshear",
      action: "transformshear",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Transform > Shear...",
        de: "Objekt > Transformieren > Verbiegen \u2026",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0422\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c > \u041d\u0430\u043a\u043b\u043e\u043d...",
      },
      hidden: false,
    },
    menu_Transform_v23: {
      id: "menu_Transform_v23",
      action: "Transform v23",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Transform Each...",
        de: "Objekt > Transformieren > Einzeln transformieren \u2026",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0422\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c > \u0422\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u043a\u0430\u0436\u0434\u044b\u0439...",
      },
      hidden: false,
    },
    menu_AI_Reset_Bounding_Box: {
      id: "menu_AI_Reset_Bounding_Box",
      action: "AI Reset Bounding Box",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Transform > Reset Bounding Box",
        de: "Objekt > Transform > Begrenzungsrahmen zur\u00fccksetzen",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0422\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c > \u0412\u043e\u0441\u0441\u0442\u0430\u043d\u043e\u0432\u0438\u0442\u044c \u043d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438 \u043f\u043e \u0443\u043c\u043e\u043b\u0447\u0430\u043d\u0438\u044e \u043e\u0433\u0440\u0430\u043d\u0438\u0447\u0438\u0442\u0435\u043b\u044c\u043d\u043e\u0439 \u0440\u0430\u043c\u043a\u0438",
      },
      hidden: false,
    },
    menu_sendToFront: {
      id: "menu_sendToFront",
      action: "sendToFront",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Arrange > Bring to Front",
        de: "Objekt > Anordnen > In den Vordergrund",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041c\u043e\u043d\u0442\u0430\u0436 > \u041d\u0430 \u043f\u0435\u0440\u0435\u0434\u043d\u0438\u0439 \u043f\u043b\u0430\u043d",
      },
      hidden: false,
    },
    menu_sendForward: {
      id: "menu_sendForward",
      action: "sendForward",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Arrange > Bring Forward",
        de: "Objekt > Anordnen > Schrittweise nach vorne",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041c\u043e\u043d\u0442\u0430\u0436 > \u041d\u0430 \u0437\u0430\u0434\u043d\u0438\u0439 \u043f\u043b\u0430\u043d",
      },
      hidden: false,
    },
    menu_sendBackward: {
      id: "menu_sendBackward",
      action: "sendBackward",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Arrange > Send Backward",
        de: "Objekt > Anordnen > Schrittweise nach hinten",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041c\u043e\u043d\u0442\u0430\u0436 > \u041f\u0435\u0440\u0435\u043b\u043e\u0436\u0438\u0442\u044c \u0432\u043f\u0435\u0440\u0435\u0434",
      },
      hidden: false,
    },
    menu_sendToBack: {
      id: "menu_sendToBack",
      action: "sendToBack",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Arrange > Send to Back",
        de: "Objekt > Anordnen > In den Hintergrund",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041c\u043e\u043d\u0442\u0430\u0436 > \u041f\u0435\u0440\u0435\u043b\u043e\u0436\u0438\u0442\u044c \u043d\u0430\u0437\u0430\u0434",
      },
      hidden: false,
    },
    menu_Selection_Hat_2: {
      id: "menu_Selection_Hat_2",
      action: "Selection Hat 2",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Arrange > Send to Current Layer",
        de: "Objekt > Anordnen > In aktuelle Ebene verschieben",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041c\u043e\u043d\u0442\u0430\u0436 > \u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u043d\u0430 \u0442\u0435\u043a\u0443\u0449\u0438\u0439 \u0441\u043b\u043e\u0439",
      },
      hidden: false,
    },
    menu_Horizontal_Align_Left: {
      id: "menu_Horizontal_Align_Left",
      action: "Horizontal Align Left",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Object > Align > Horizontal Align Left",
        de: "Objekt > Ausrichten > Horizontal links ausrichten",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0412\u044b\u0440\u0430\u0432\u043d\u0438\u0432\u0430\u043d\u0438\u0435 > \u0413\u043e\u0440\u0438\u0437\u043e\u043d\u0442\u0430\u043b\u044c\u043d\u043e\u0435 \u0432\u044b\u0440\u0430\u0432\u043d\u0438\u0432\u0430\u043d\u0438\u0435, \u0432\u043b\u0435\u0432\u043e",
      },
      hidden: false,
      minVersion: 24,
    },
    menu_Horizontal_Align_Center: {
      id: "menu_Horizontal_Align_Center",
      action: "Horizontal Align Center",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Object > Align > Horizontal Align Center",
        de: "Objekt > Ausrichten > Horizontal zentriert ausrichten",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0412\u044b\u0440\u0430\u0432\u043d\u0438\u0432\u0430\u043d\u0438\u0435 > \u0413\u043e\u0440\u0438\u0437\u043e\u043d\u0442\u0430\u043b\u044c\u043d\u043e\u0435 \u0432\u044b\u0440\u0430\u0432\u043d\u0438\u0432\u0430\u043d\u0438\u0435, \u0446\u0435\u043d\u0442\u0440",
      },
      hidden: false,
      minVersion: 24,
    },
    menu_Horizontal_Align_Right: {
      id: "menu_Horizontal_Align_Right",
      action: "Horizontal Align Right",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Object > Align > Horizontal Align Right",
        de: "Objekt > Ausrichten > Horizontal rechts ausrichten",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0412\u044b\u0440\u0430\u0432\u043d\u0438\u0432\u0430\u043d\u0438\u0435 > \u0413\u043e\u0440\u0438\u0437\u043e\u043d\u0442\u0430\u043b\u044c\u043d\u043e\u0435 \u0432\u044b\u0440\u0430\u0432\u043d\u0438\u0432\u0430\u043d\u0438\u0435, \u0432\u043f\u0440\u0430\u0432\u043e",
      },
      hidden: false,
      minVersion: 24,
    },
    menu_Vertical_Align_Top: {
      id: "menu_Vertical_Align_Top",
      action: "Vertical Align Top",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Object > Align > Vertical Align Top",
        de: "Objekt > Ausrichten > Vertikal oben ausrichten",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0412\u044b\u0440\u0430\u0432\u043d\u0438\u0432\u0430\u043d\u0438\u0435 > \u0412\u0435\u0440\u0442\u0438\u043a\u0430\u043b\u044c\u043d\u043e\u0435 \u0432\u044b\u0440\u0430\u0432\u043d\u0438\u0432\u0430\u043d\u0438\u0435, \u0432\u0432\u0435\u0440\u0445",
      },
      hidden: false,
      minVersion: 24,
    },
    menu_Vertical_Align_Center: {
      id: "menu_Vertical_Align_Center",
      action: "Vertical Align Center",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Object > Align > Vertical Align Center",
        de: "Objekt > Ausrichten > Vertikal zentriert ausrichten",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0412\u044b\u0440\u0430\u0432\u043d\u0438\u0432\u0430\u043d\u0438\u0435 > \u0412\u0435\u0440\u0442\u0438\u043a\u0430\u043b\u044c\u043d\u043e\u0435 \u0432\u044b\u0440\u0430\u0432\u043d\u0438\u0432\u0430\u043d\u0438\u0435, \u0446\u0435\u043d\u0442\u0440",
      },
      hidden: false,
      minVersion: 24,
    },
    menu_Vertical_Align_Bottom: {
      id: "menu_Vertical_Align_Bottom",
      action: "Vertical Align Bottom",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Object > Align > Vertical Align Bottom",
        de: "Objekt > Ausrichten > Vertikal unten ausrichten",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0412\u044b\u0440\u0430\u0432\u043d\u0438\u0432\u0430\u043d\u0438\u0435 > \u0412\u0435\u0440\u0442\u0438\u043a\u0430\u043b\u044c\u043d\u043e\u0435 \u0432\u044b\u0440\u0430\u0432\u043d\u0438\u0432\u0430\u043d\u0438\u0435, \u0432\u043d\u0438\u0437",
      },
      hidden: false,
      minVersion: 24,
    },
    menu_Vertical_Distribute_Top: {
      id: "menu_Vertical_Distribute_Top",
      action: "Vertical Distribute Top",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Distribute > Vertical Distribute Top",
        de: "Object > Distribute > Vertical Distribute Top",
        ru: "Object > Distribute > Vertical Distribute Top",
      },
      hidden: false,
      minVersion: 27,
    },
    menu_Vertical_Distribute_Center: {
      id: "menu_Vertical_Distribute_Center",
      action: "Vertical Distribute Center",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Distribute > Vertical Distribute Center",
        de: "Object > Distribute > Vertical Distribute Center",
        ru: "Object > Distribute > Vertical Distribute Center",
      },
      hidden: false,
      minVersion: 27,
    },
    menu_Vertical_Distribute_Bottom: {
      id: "menu_Vertical_Distribute_Bottom",
      action: "Vertical Distribute Bottom",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Distribute > Vertical Distribute Bottom",
        de: "Object > Distribute > Vertical Distribute Bottom",
        ru: "Object > Distribute > Vertical Distribute Bottom",
      },
      hidden: false,
      minVersion: 27,
    },
    menu_Horizontal_Distribute_Left: {
      id: "menu_Horizontal_Distribute_Left",
      action: "Horizontal Distribute Left",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Distribute > Horizontal Distribute Left",
        de: "Object > Distribute > Horizontal Distribute Left",
        ru: "Object > Distribute > Horizontal Distribute Left",
      },
      hidden: false,
      minVersion: 27,
    },
    menu_Horizontal_Distribute_Center: {
      id: "menu_Horizontal_Distribute_Center",
      action: "Horizontal Distribute Center",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Distribute > Horizontal Distribute Center",
        de: "Object > Distribute > Horizontal Distribute Center",
        ru: "Object > Distribute > Horizontal Distribute Center",
      },
      hidden: false,
      minVersion: 27,
    },
    menu_Horizontal_Distribute_Right: {
      id: "menu_Horizontal_Distribute_Right",
      action: "Horizontal Distribute Right",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Distribute > Horizontal Distribute Right",
        de: "Object > Distribute > Horizontal Distribute Right",
        ru: "Object > Distribute > Horizontal Distribute Right",
      },
      hidden: false,
      minVersion: 27,
    },
    menu_group: {
      id: "menu_group",
      action: "group",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Group",
        de: "Objekt > Gruppieren",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0421\u0433\u0440\u0443\u043f\u043f\u0438\u0440\u043e\u0432\u0430\u0442\u044c",
      },
      hidden: false,
    },
    menu_ungroup: {
      id: "menu_ungroup",
      action: "ungroup",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Ungroup",
        de: "Objekt > Gruppierung aufheben",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0420\u0430\u0437\u0433\u0440\u0443\u043f\u043f\u0438\u0440\u043e\u0432\u0430\u0442\u044c",
      },
      hidden: false,
    },
    menu_lock: {
      id: "menu_lock",
      action: "lock",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Lock > Selection",
        de: "Objekt > Sperren > Auswahl",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0417\u0430\u043a\u0440\u0435\u043f\u0438\u0442\u044c > \u0412\u044b\u0434\u0435\u043b\u0435\u043d\u043d\u043e\u0435",
      },
      hidden: false,
    },
    menu_Selection_Hat_5: {
      id: "menu_Selection_Hat_5",
      action: "Selection Hat 5",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Lock > All Artwork Above",
        de: "Objekt > Sperren > S\u00e4mtliches Bildmaterial dar\u00fcber",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0417\u0430\u043a\u0440\u0435\u043f\u0438\u0442\u044c > \u0412\u0441\u0435 \u043e\u0431\u044a\u0435\u043a\u0442\u044b \u0432\u044b\u0448\u0435",
      },
      hidden: false,
    },
    menu_Selection_Hat_7: {
      id: "menu_Selection_Hat_7",
      action: "Selection Hat 7",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Lock > Other Layers",
        de: "Objekt > Sperren > Andere Ebenen",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0417\u0430\u043a\u0440\u0435\u043f\u0438\u0442\u044c > \u041e\u0441\u0442\u0430\u043b\u044c\u043d\u044b\u0435 \u0441\u043b\u043e\u0438",
      },
      hidden: false,
    },
    menu_unlockAll: {
      id: "menu_unlockAll",
      action: "unlockAll",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Object > Unlock All",
        de: "Objekt > Alle entsperren",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041e\u0441\u0432\u043e\u0431\u043e\u0434\u0438\u0442\u044c \u0432\u0441\u0435",
      },
      hidden: false,
    },
    menu_hide: {
      id: "menu_hide",
      action: "hide",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Hide > Selection",
        de: "Objekt > Ausblenden > Auswahl",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0421\u043a\u0440\u044b\u0442\u044c > \u0412\u044b\u0434\u0435\u043b\u0435\u043d\u043d\u043e\u0435",
      },
      hidden: false,
    },
    menu_Selection_Hat_4: {
      id: "menu_Selection_Hat_4",
      action: "Selection Hat 4",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Hide > All Artwork Above",
        de: "Objekt > Ausblenden > S\u00e4mtliches Bildmaterial dar\u00fcber",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0421\u043a\u0440\u044b\u0442\u044c > \u0412\u0441\u0435 \u043e\u0431\u044a\u0435\u043a\u0442\u044b \u0432\u044b\u0448\u0435",
      },
      hidden: false,
    },
    menu_Selection_Hat_6: {
      id: "menu_Selection_Hat_6",
      action: "Selection Hat 6",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Hide > Other Layers",
        de: "Objekt > Ausblenden > Andere Ebenen",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0421\u043a\u0440\u044b\u0442\u044c > \u041e\u0441\u0442\u0430\u043b\u044c\u043d\u044b\u0435 \u0441\u043b\u043e\u0438",
      },
      hidden: false,
    },
    menu_showAll: {
      id: "menu_showAll",
      action: "showAll",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Object > Show All",
        de: "Objekt > Alles einblenden",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c \u0432\u0441\u0435",
      },
      hidden: false,
    },
    menu_Crop_Image: {
      id: "menu_Crop_Image",
      action: "Crop Image",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Crop Image",
        de: "Objekt > Bild zuschneiden",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041e\u0431\u0440\u0435\u0437\u0430\u0442\u044c \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0435",
      },
      hidden: false,
      minVersion: 23,
    },
    menu_Rasterize_8_menu_item: {
      id: "menu_Rasterize_8_menu_item",
      action: "Rasterize 8 menu item",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Rasterize...",
        de: "Objekt > In Pixelbild umwandeln \u2026",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0420\u0430\u0441\u0442\u0440\u0438\u0440\u043e\u0432\u0430\u0442\u044c...",
      },
      hidden: false,
    },
    menu_make_mesh: {
      id: "menu_make_mesh",
      action: "make mesh",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Create Gradient Mesh...",
        de: "Objekt > Verlaufsgitter erstellen \u2026",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0441\u0435\u0442\u0447\u0430\u0442\u044b\u0439 \u0433\u0440\u0430\u0434\u0438\u0435\u043d\u0442...",
      },
      hidden: false,
    },
    "menu_AI_Object_Mosaic_Plug-in4": {
      id: "menu_AI_Object_Mosaic_Plug-in4",
      action: "AI Object Mosaic Plug-in4",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Create Object Mosaic...",
        de: "Objekt > Objektmosaik erstellen \u2026",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0444\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u0430\u0446\u0438\u044e...",
      },
      hidden: false,
    },
    menu_TrimMark_v25: {
      id: "menu_TrimMark_v25",
      action: "TrimMark v25",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Create Trim Marks...",
        de: "Objekt > Schnittmarken erstellen",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0421\u043e\u0437\u0434\u0430\u0442\u044c \u043c\u0435\u0442\u043a\u0438 \u043e\u0431\u0440\u0435\u0437\u0430",
      },
      hidden: false,
    },
    menu_Flatten_Transparency: {
      id: "menu_Flatten_Transparency",
      action: "Flatten Transparency",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Flatten Transparency...",
        de: "Objekt > Transparenz reduzieren \u2026",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u043f\u0440\u043e\u0437\u0440\u0430\u0447\u043d\u043e\u0441\u0442\u0438...",
      },
      hidden: false,
    },
    menu_Make_Pixel_Perfect: {
      id: "menu_Make_Pixel_Perfect",
      action: "Make Pixel Perfect",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Make Pixel Perfect",
        de: "Objekt > Pixelgenaue Darstellung anwenden",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041a\u043e\u0440\u0440\u0435\u043a\u0446\u0438\u044f \u043d\u0430 \u0443\u0440\u043e\u0432\u043d\u0435 \u043f\u0438\u043a\u0441\u0435\u043b\u043e\u0432",
      },
      hidden: false,
    },
    menu_AISlice_Make_Slice: {
      id: "menu_AISlice_Make_Slice",
      action: "AISlice Make Slice",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Slice > Make",
        de: "Objekt > Slice > Erstellen",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0424\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u044b > \u0421\u043e\u0437\u0434\u0430\u0442\u044c",
      },
      hidden: false,
    },
    menu_AISlice_Release_Slice: {
      id: "menu_AISlice_Release_Slice",
      action: "AISlice Release Slice",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Slice > Release",
        de: "Objekt > Slice > Zur\u00fcckwandeln",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0424\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u044b > \u0420\u0430\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c",
      },
      hidden: false,
    },
    menu_AISlice_Create_from_Guides: {
      id: "menu_AISlice_Create_from_Guides",
      action: "AISlice Create from Guides",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Object > Slice > Create from Guides",
        de: "Objekt > Slice > Aus Hilfslinien erstellen",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0424\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u044b > \u0421\u043e\u0437\u0434\u0430\u0442\u044c \u043f\u043e \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u044f\u044e\u0449\u0438\u043c",
      },
      hidden: false,
    },
    menu_AISlice_Create_from_Selection: {
      id: "menu_AISlice_Create_from_Selection",
      action: "AISlice Create from Selection",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Slice > Create from Selection",
        de: "Objekt > Slice > Aus Auswahl erstellen",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0424\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u044b > \u0421\u043e\u0437\u0434\u0430\u0442\u044c \u043f\u043e \u0432\u044b\u0434\u0435\u043b\u0435\u043d\u043d\u043e\u0439 \u043e\u0431\u043b\u0430\u0441\u0442\u0438",
      },
      hidden: false,
    },
    menu_AISlice_Duplicate: {
      id: "menu_AISlice_Duplicate",
      action: "AISlice Duplicate",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Slice > Duplicate Slice",
        de: "Objekt > Slice > Slice duplizieren",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0424\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u044b > \u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0434\u0443\u0431\u043b\u0438\u043a\u0430\u0442 \u0444\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u0430",
      },
      hidden: false,
    },
    menu_AISlice_Combine: {
      id: "menu_AISlice_Combine",
      action: "AISlice Combine",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Slice > Combine Slices",
        de: "Objekt > Slice > Slices kombinieren",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0424\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u044b > \u041e\u0431\u044a\u0435\u0434\u0438\u043d\u0438\u0442\u044c \u0444\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u044b",
      },
      hidden: false,
    },
    menu_AISlice_Divide: {
      id: "menu_AISlice_Divide",
      action: "AISlice Divide",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Slice > Divide Slices...",
        de: "Objekt > Slice > Slices unterteilen \u2026",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0424\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u044b > \u0420\u0430\u0437\u0434\u0435\u043b\u0438\u0442\u044c \u0444\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u044b...",
      },
      hidden: false,
    },
    menu_AISlice_Delete_All_Slices: {
      id: "menu_AISlice_Delete_All_Slices",
      action: "AISlice Delete All Slices",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Slice > Delete All",
        de: "Objekt > Slice > Alle l\u00f6schen",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0424\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u044b > \u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0432\u0441\u0435",
      },
      hidden: false,
    },
    menu_AISlice_Slice_Options: {
      id: "menu_AISlice_Slice_Options",
      action: "AISlice Slice Options",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Slice > Slice Options...",
        de: "Objekt > Slice > Slice-Optionen \u2026",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0424\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u044b > \u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u0444\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u0430...",
      },
      hidden: false,
    },
    menu_AISlice_Clip_to_Artboard: {
      id: "menu_AISlice_Clip_to_Artboard",
      action: "AISlice Clip to Artboard",
      type: "menu",
      docRequired: false,
      selRequired: true,
      loc: {
        en: "Object > Slice > Clip to Artboard",
        de: "Objekt > Slice > Ganze Zeichenfl\u00e4che exportieren",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0424\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u044b > \u041e\u0431\u0440\u0435\u0437\u0430\u0442\u044c \u043f\u043e \u043c\u043e\u043d\u0442\u0430\u0436\u043d\u043e\u0439 \u043e\u0431\u043b\u0430\u0441\u0442\u0438",
      },
      hidden: false,
    },
    menu_Expand3: {
      id: "menu_Expand3",
      action: "Expand3",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Expand...",
        de: "Objekt > Umwandeln \u2026",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0420\u0430\u0437\u043e\u0431\u0440\u0430\u0442\u044c\u2026",
      },
      hidden: false,
    },
    menu_expandStyle: {
      id: "menu_expandStyle",
      action: "expandStyle",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Expand Appearance",
        de: "Objekt > Aussehen umwandeln",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0420\u0430\u0437\u043e\u0431\u0440\u0430\u0442\u044c \u043e\u0444\u043e\u0440\u043c\u043b\u0435\u043d\u0438\u0435",
      },
      hidden: false,
    },
    menu_join: {
      id: "menu_join",
      action: "join",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Path > Join",
        de: "Objekt > Pfad > Zusammenf\u00fcgen",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041a\u043e\u043d\u0442\u0443\u0440 > \u0421\u043e\u0435\u0434\u0438\u043d\u0438\u0442\u044c",
      },
      hidden: false,
    },
    menu_average: {
      id: "menu_average",
      action: "average",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Path > Average...",
        de: "Objekt > Pfad > Durchschnitt berechnen \u2026",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041a\u043e\u043d\u0442\u0443\u0440 > \u0423\u0441\u0440\u0435\u0434\u043d\u0438\u0442\u044c\u2026",
      },
      hidden: false,
    },
    menu_OffsetPath_v22: {
      id: "menu_OffsetPath_v22",
      action: "OffsetPath v22",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Path > Outline Stroke",
        de: "Objekt > Pfad > Konturlinie",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041a\u043e\u043d\u0442\u0443\u0440 > \u041f\u0440\u0435\u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u044c \u043e\u0431\u0432\u043e\u0434\u043a\u0443 \u0432 \u043a\u0440\u0438\u0432\u044b\u0435",
      },
      hidden: false,
    },
    menu_OffsetPath_v23: {
      id: "menu_OffsetPath_v23",
      action: "OffsetPath v23",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Path > Offset Path...",
        de: "Objekt > Pfad > Pfad verschieben \u2026",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041a\u043e\u043d\u0442\u0443\u0440 > \u0421\u043e\u0437\u0434\u0430\u0442\u044c \u043f\u0430\u0440\u0430\u043b\u043b\u0435\u043b\u044c\u043d\u044b\u0439 \u043a\u043e\u043d\u0442\u0443\u0440\u2026",
      },
      hidden: false,
    },
    menu_Reverse_Path_Direction: {
      id: "menu_Reverse_Path_Direction",
      action: "Reverse Path Direction",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Path > Reverse Path Direction",
        de: "Objekt > Pfad > Pfadrichtung umkehren",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041a\u043e\u043d\u0442\u0443\u0440 > \u0418\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u0435 \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u044f \u043a\u043e\u043d\u0442\u0443\u0440\u0430",
      },
      hidden: false,
      minVersion: 21,
    },
    menu_simplify_menu_item: {
      id: "menu_simplify_menu_item",
      action: "simplify menu item",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Path > Simplify...",
        de: "Objekt > Pfad > Vereinfachen \u2026",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041a\u043e\u043d\u0442\u0443\u0440 > \u0423\u043f\u0440\u043e\u0441\u0442\u0438\u0442\u044c\u2026",
      },
      hidden: false,
    },
    menu_Add_Anchor_Points2: {
      id: "menu_Add_Anchor_Points2",
      action: "Add Anchor Points2",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Path > Add Anchor Points",
        de: "Objekt > Pfad > Ankerpunkte hinzuf\u00fcgen",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041a\u043e\u043d\u0442\u0443\u0440 > \u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u043e\u043f\u043e\u0440\u043d\u044b\u0435 \u0442\u043e\u0447\u043a\u0438",
      },
      hidden: false,
    },
    menu_Remove_Anchor_Points_menu: {
      id: "menu_Remove_Anchor_Points_menu",
      action: "Remove Anchor Points menu",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Path > Remove Anchor Points",
        de: "Objekt > Pfad > Ankerpunkte entfernen",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041a\u043e\u043d\u0442\u0443\u0440 > \u0423\u0434\u0430\u043b\u0438\u0442\u044c \u043e\u043f\u043e\u0440\u043d\u044b\u0435 \u0442\u043e\u0447\u043a\u0438",
      },
      hidden: false,
    },
    menu_Knife_Tool2: {
      id: "menu_Knife_Tool2",
      action: "Knife Tool2",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Path > Divide Objects Below",
        de: "Objekt > Pfad > Darunter liegende Objekte aufteilen",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041a\u043e\u043d\u0442\u0443\u0440 > \u0420\u0430\u0437\u0434\u0435\u043b\u0438\u0442\u044c \u043d\u0438\u0436\u043d\u0438\u0435 \u043e\u0431\u044a\u0435\u043a\u0442\u044b",
      },
      hidden: false,
    },
    "menu_Rows_and_Columns....": {
      id: "menu_Rows_and_Columns....",
      action: "Rows and Columns....",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Path > Split Into Grid...",
        de: "Objekt > Pfad > In Raster teilen \u2026",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041a\u043e\u043d\u0442\u0443\u0440 > \u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0441\u0435\u0442\u043a\u0443...",
      },
      hidden: false,
    },
    menu_cleanup_menu_item: {
      id: "menu_cleanup_menu_item",
      action: "cleanup menu item",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Object > Path > Clean Up...",
        de: "Objekt > Pfad > Aufr\u00e4umen \u2026",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041a\u043e\u043d\u0442\u0443\u0440 > \u0412\u044b\u0447\u0438\u0441\u0442\u0438\u0442\u044c\u2026",
      },
      hidden: false,
    },
    menu_smooth_menu_item: {
      id: "menu_smooth_menu_item",
      action: "smooth menu item",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Path > Smooth",
        de: "Object > Path > Smooth",
        ru: "Object > Path > Smooth",
      },
      hidden: false,
      minVersion: 28,
    },
    menu_Convert_to_Shape: {
      id: "menu_Convert_to_Shape",
      action: "Convert to Shape",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Shape > Convert to Shapes",
        de: "Objekt > Form > In Form umwandeln",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0424\u0438\u0433\u0443\u0440\u0430 > \u041f\u0440\u0435\u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u044c \u0432 \u0444\u0438\u0433\u0443\u0440\u044b",
      },
      hidden: false,
      minVersion: 18,
    },
    menu_Expand_Shape: {
      id: "menu_Expand_Shape",
      action: "Expand Shape",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Shape > Expand Shapes",
        de: "Objekt > Form > Form umwandeln",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0424\u0438\u0433\u0443\u0440\u0430 > \u0420\u0430\u0437\u043e\u0431\u0440\u0430\u0442\u044c \u0444\u0438\u0433\u0443\u0440\u0443",
      },
      hidden: false,
      minVersion: 18,
    },
    menu_Adobe_Make_Pattern: {
      id: "menu_Adobe_Make_Pattern",
      action: "Adobe Make Pattern",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Object > Pattern > Make",
        de: "Objekt > Muster > Erstellen",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0423\u0437\u043e\u0440 > \u0421\u043e\u0437\u0434\u0430\u0442\u044c",
      },
      hidden: false,
    },
    menu_Adobe_Edit_Pattern: {
      id: "menu_Adobe_Edit_Pattern",
      action: "Adobe Edit Pattern",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Pattern > Edit Pattern",
        de: "Objekt > Muster > Muster bearbeiten",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0423\u0437\u043e\u0440 > \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0443\u0437\u043e\u0440",
      },
      hidden: false,
    },
    menu_Adobe_Pattern_Tile_Color: {
      id: "menu_Adobe_Pattern_Tile_Color",
      action: "Adobe Pattern Tile Color",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Object > Pattern > Tile Edge Color...",
        de: "Objekt > Muster > Farbe f\u00fcr Musterelement-Kante",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0423\u0437\u043e\u0440 > \u0426\u0432\u0435\u0442 \u043a\u0440\u0430\u044f \u044d\u043b\u0435\u043c\u0435\u043d\u0442\u0430...",
      },
      hidden: false,
    },
    menu_Text_To_Pattern: {
      id: "menu_Text_To_Pattern",
      action: "Text To Pattern",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Pattern > Text to Pattern (Beta)",
        de: "Object > Pattern > Text to Pattern (Beta)",
        ru: "Object > Pattern > Text to Pattern (Beta)",
      },
      hidden: false,
      minVersion: 28,
    },
    menu_Partial_Rearrange_Make: {
      id: "menu_Partial_Rearrange_Make",
      action: "Partial Rearrange Make",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Intertwine > Make",
        de: "Objekt > Verflechtung > Erstellen",
        ru: "Object > Intertwine > Make",
      },
      hidden: false,
      minVersion: 27,
    },
    menu_Partial_Rearrange_Release: {
      id: "menu_Partial_Rearrange_Release",
      action: "Partial Rearrange Release",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Intertwine > Release",
        de: "Objekt > Verflechtung > Zur\u00fcckwandeln",
        ru: "Object > Intertwine > Release",
      },
      hidden: false,
      minVersion: 27,
    },
    menu_Partial_Rearrange_Edit: {
      id: "menu_Partial_Rearrange_Edit",
      action: "Partial Rearrange Edit",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Intertwine > Edit",
        de: "Objekt > Verflechtung > Bearbeiten",
        ru: "Object > Intertwine > Edit",
      },
      hidden: false,
      minVersion: 27,
    },
    menu_Make_Radial_Repeat: {
      id: "menu_Make_Radial_Repeat",
      action: "Make Radial Repeat",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Repeat > Make Radial",
        de: "Objekt > Wiederholen > Radial",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c > \u0420\u0430\u0434\u0438\u0430\u043b\u044c\u043d\u044b\u0439",
      },
      hidden: false,
      minVersion: 25.1,
    },
    menu_Make_Grid_Repeat: {
      id: "menu_Make_Grid_Repeat",
      action: "Make Grid Repeat",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Repeat > Make Grid",
        de: "Objekt > Wiederholen > Raster",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c > \u0421\u0435\u0442\u043a\u0430",
      },
      hidden: false,
      minVersion: 25.1,
    },
    menu_Make_Symmetry_Repeat: {
      id: "menu_Make_Symmetry_Repeat",
      action: "Make Symmetry Repeat",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Repeat > Make Symmetry",
        de: "Objekt > Wiederholen > Spiegeln",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c > \u0417\u0435\u0440\u043a\u0430\u043b\u044c\u043d\u043e",
      },
      hidden: false,
      minVersion: 25.1,
    },
    menu_Release_Repeat_Art: {
      id: "menu_Release_Repeat_Art",
      action: "Release Repeat Art",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Repeat > Release",
        de: "Objekt > Wiederholen > Zur\u00fcckwandeln",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c > \u041e\u0441\u0432\u043e\u0431\u043e\u0434\u0438\u0442\u044c",
      },
      hidden: false,
      minVersion: 25.1,
    },
    menu_Repeat_Art_Options: {
      id: "menu_Repeat_Art_Options",
      action: "Repeat Art Options",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Object > Repeat > Repeat Options...",
        de: "Objekt > Wiederholen > Optionen \u2026",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c > \u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b\u2026",
      },
      hidden: false,
      minVersion: 25.1,
    },
    menu_Path_Blend_Make: {
      id: "menu_Path_Blend_Make",
      action: "Path Blend Make",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Blend > Make",
        de: "Objekt > Angleichen > Erstellen",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041f\u0435\u0440\u0435\u0445\u043e\u0434 > \u0421\u043e\u0437\u0434\u0430\u0442\u044c",
      },
      hidden: false,
    },
    menu_Path_Blend_Release: {
      id: "menu_Path_Blend_Release",
      action: "Path Blend Release",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Blend > Release",
        de: "Objekt > Angleichen > Zur\u00fcckwandeln",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041f\u0435\u0440\u0435\u0445\u043e\u0434 > \u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c",
      },
      hidden: false,
    },
    menu_Path_Blend_Options: {
      id: "menu_Path_Blend_Options",
      action: "Path Blend Options",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Object > Blend > Blend Options...",
        de: "Objekt > Angleichen > Angleichung-Optionen \u2026",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041f\u0435\u0440\u0435\u0445\u043e\u0434 > \u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u043f\u0435\u0440\u0435\u0445\u043e\u0434\u0430\u2026",
      },
      hidden: false,
    },
    menu_Path_Blend_Expand: {
      id: "menu_Path_Blend_Expand",
      action: "Path Blend Expand",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Blend > Expand",
        de: "Objekt > Angleichen > Umwandeln",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041f\u0435\u0440\u0435\u0445\u043e\u0434 > \u0420\u0430\u0437\u043e\u0431\u0440\u0430\u0442\u044c",
      },
      hidden: false,
    },
    menu_Path_Blend_Replace_Spine: {
      id: "menu_Path_Blend_Replace_Spine",
      action: "Path Blend Replace Spine",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Blend > Replace Spine",
        de: "Objekt > Angleichen > Achse ersetzen",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041f\u0435\u0440\u0435\u0445\u043e\u0434 > \u0417\u0430\u043c\u0435\u043d\u0438\u0442\u044c \u0442\u0440\u0430\u0435\u043a\u0442\u043e\u0440\u0438\u044e",
      },
      hidden: false,
    },
    menu_Path_Blend_Reverse_Spine: {
      id: "menu_Path_Blend_Reverse_Spine",
      action: "Path Blend Reverse Spine",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Blend > Reverse Spine",
        de: "Objekt > Angleichen > Achse umkehren",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041f\u0435\u0440\u0435\u0445\u043e\u0434 > \u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435",
      },
      hidden: false,
    },
    menu_Path_Blend_Reverse_Stack: {
      id: "menu_Path_Blend_Reverse_Stack",
      action: "Path Blend Reverse Stack",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Blend > Reverse Front to Back",
        de: "Objekt > Angleichen > Farbrichtung umkehren",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041f\u0435\u0440\u0435\u0445\u043e\u0434 > \u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c \u043f\u043e\u0440\u044f\u0434\u043e\u043a",
      },
      hidden: false,
    },
    menu_Make_Warp: {
      id: "menu_Make_Warp",
      action: "Make Warp",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Envelope Distort > Make with Warp...",
        de: "Objekt > Verzerrungsh\u00fclle > Mit Verkr\u00fcmmung erstellen \u2026",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0418\u0441\u043a\u0430\u0436\u0435\u043d\u0438\u0435 \u0441 \u043f\u043e\u043c\u043e\u0449\u044c\u044e \u043e\u0431\u043e\u043b\u043e\u0447\u043a\u0438 > \u0414\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f...",
      },
      hidden: false,
    },
    menu_Create_Envelope_Grid: {
      id: "menu_Create_Envelope_Grid",
      action: "Create Envelope Grid",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Envelope Distort > Make with Mesh...",
        de: "Objekt > Verzerrungsh\u00fclle > Mit Gitter erstellen \u2026",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0418\u0441\u043a\u0430\u0436\u0435\u043d\u0438\u0435 \u0441 \u043f\u043e\u043c\u043e\u0449\u044c\u044e \u043e\u0431\u043e\u043b\u043e\u0447\u043a\u0438 > \u041f\u043e \u0441\u0435\u0442\u043a\u0435...",
      },
      hidden: false,
    },
    menu_Make_Envelope: {
      id: "menu_Make_Envelope",
      action: "Make Envelope",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Envelope Distort > Make with Top Object",
        de: "Objekt > Verzerrungsh\u00fclle > Mit oberstem Objekt erstellen",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0418\u0441\u043a\u0430\u0436\u0435\u043d\u0438\u0435 \u0441 \u043f\u043e\u043c\u043e\u0449\u044c\u044e \u043e\u0431\u043e\u043b\u043e\u0447\u043a\u0438 > \u041f\u043e \u0444\u043e\u0440\u043c\u0435 \u0432\u0435\u0440\u0445\u043d\u0435\u0433\u043e \u043e\u0431\u044a\u0435\u043a\u0442\u0430",
      },
      hidden: false,
    },
    menu_Release_Envelope: {
      id: "menu_Release_Envelope",
      action: "Release Envelope",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Envelope Distort > Release",
        de: "Objekt > Verzerrungsh\u00fclle > Zur\u00fcckwandeln",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0418\u0441\u043a\u0430\u0436\u0435\u043d\u0438\u0435 \u0441 \u043f\u043e\u043c\u043e\u0449\u044c\u044e \u043e\u0431\u043e\u043b\u043e\u0447\u043a\u0438 > \u041e\u0442\u0434\u0435\u043b\u0438\u0442\u044c",
      },
      hidden: false,
    },
    menu_Envelope_Options: {
      id: "menu_Envelope_Options",
      action: "Envelope Options",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Object > Envelope Distort > Envelope Options...",
        de: "Objekt > Verzerrungsh\u00fclle > H\u00fcllen-Optionen \u2026",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0418\u0441\u043a\u0430\u0436\u0435\u043d\u0438\u0435 \u0441 \u043f\u043e\u043c\u043e\u0449\u044c\u044e \u043e\u0431\u043e\u043b\u043e\u0447\u043a\u0438 > \u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u043e\u0431\u043e\u043b\u043e\u0447\u043a\u0438...",
      },
      hidden: false,
    },
    menu_Expand_Envelope: {
      id: "menu_Expand_Envelope",
      action: "Expand Envelope",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Envelope Distort > Expand",
        de: "Objekt > Verzerrungsh\u00fclle > Umwandeln",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0418\u0441\u043a\u0430\u0436\u0435\u043d\u0438\u0435 \u0441 \u043f\u043e\u043c\u043e\u0449\u044c\u044e \u043e\u0431\u043e\u043b\u043e\u0447\u043a\u0438 > \u0420\u0430\u0437\u043e\u0431\u0440\u0430\u0442\u044c",
      },
      hidden: false,
    },
    menu_Edit_Envelope_Contents: {
      id: "menu_Edit_Envelope_Contents",
      action: "Edit Envelope Contents",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Envelope Distort > Edit Contents",
        de: "Objekt > Verzerrungsh\u00fclle > Inhalt bearbeiten",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0418\u0441\u043a\u0430\u0436\u0435\u043d\u0438\u0435 \u0441 \u043f\u043e\u043c\u043e\u0449\u044c\u044e \u043e\u0431\u043e\u043b\u043e\u0447\u043a\u0438 > \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0441\u043e\u0434\u0435\u0440\u0436\u0438\u043c\u043e\u0435",
      },
      hidden: false,
    },
    menu_Attach_to_Active_Plane: {
      id: "menu_Attach_to_Active_Plane",
      action: "Attach to Active Plane",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Perspective > Attach to Active Plane",
        de: "Objekt > Perspektive > Aktiver Ebene anh\u00e4ngen",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041f\u0435\u0440\u0441\u043f\u0435\u043a\u0442\u0438\u0432\u0430 > \u041f\u0440\u0438\u043a\u0440\u0435\u043f\u0438\u0442\u044c \u043a \u0430\u043a\u0442\u0438\u0432\u043d\u043e\u0439 \u043f\u043b\u043e\u0441\u043a\u043e\u0441\u0442\u0438",
      },
      hidden: false,
    },
    menu_Release_with_Perspective: {
      id: "menu_Release_with_Perspective",
      action: "Release with Perspective",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Perspective > Release with Perspective",
        de: "Objekt > Perspektive > Aus Perspektive freigeben",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041f\u0435\u0440\u0441\u043f\u0435\u043a\u0442\u0438\u0432\u0430 > \u041e\u0442\u043a\u0440\u0435\u043f\u0438\u0442\u044c \u0441 \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u0438\u0435\u043c \u043f\u0435\u0440\u0441\u043f\u0435\u043a\u0442\u0438\u0432\u044b",
      },
      hidden: false,
    },
    menu_Show_Object_Grid_Plane: {
      id: "menu_Show_Object_Grid_Plane",
      action: "Show Object Grid Plane",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Perspective > Move Plane to Match Object",
        de: "Objekt > Perspektive > Ebene an Objekt ausrichten",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041f\u0435\u0440\u0441\u043f\u0435\u043a\u0442\u0438\u0432\u0430 > \u041f\u0435\u0440\u0435\u043c\u0435\u0441\u0442\u0438\u0442\u044c \u043f\u043b\u043e\u0441\u043a\u043e\u0441\u0442\u044c \u0434\u043b\u044f \u043f\u043e\u0434\u0433\u043e\u043d\u043a\u0438 \u043f\u043e \u043e\u0431\u044a\u0435\u043a\u0442\u0443",
      },
      hidden: false,
    },
    menu_Edit_Original_Object: {
      id: "menu_Edit_Original_Object",
      action: "Edit Original Object",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Perspective > Edit Text",
        de: "Objekt > Perspektive > Text bearbeiten",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041f\u0435\u0440\u0441\u043f\u0435\u043a\u0442\u0438\u0432\u0430 > \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0442\u0435\u043a\u0441\u0442",
      },
      hidden: false,
    },
    menu_Make_Planet_X: {
      id: "menu_Make_Planet_X",
      action: "Make Planet X",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Live Paint > Make",
        de: "Objekt > Interaktiv malen > Erstellen",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0411\u044b\u0441\u0442\u0440\u0430\u044f \u0437\u0430\u043b\u0438\u0432\u043a\u0430 > \u0421\u043e\u0437\u0434\u0430\u0442\u044c",
      },
      hidden: false,
    },
    menu_Marge_Planet_X: {
      id: "menu_Marge_Planet_X",
      action: "Marge Planet X",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Live Paint > Merge",
        de: "Objekt > Interaktiv malen > Zusammenf\u00fcgen",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0411\u044b\u0441\u0442\u0440\u0430\u044f \u0437\u0430\u043b\u0438\u0432\u043a\u0430 > \u041e\u0431\u044a\u0435\u0434\u0438\u043d\u0438\u0442\u044c",
      },
      hidden: false,
    },
    menu_Release_Planet_X: {
      id: "menu_Release_Planet_X",
      action: "Release Planet X",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Live Paint > Release",
        de: "Objekt > Interaktiv malen > Zur\u00fcckwandeln",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0411\u044b\u0441\u0442\u0440\u0430\u044f \u0437\u0430\u043b\u0438\u0432\u043a\u0430 > \u0420\u0430\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c",
      },
      hidden: false,
    },
    menu_Planet_X_Options: {
      id: "menu_Planet_X_Options",
      action: "Planet X Options",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Object > Live Paint > Gap Options...",
        de: "Objekt > Interaktiv malen > L\u00fcckenoptionen \u2026",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0411\u044b\u0441\u0442\u0440\u0430\u044f \u0437\u0430\u043b\u0438\u0432\u043a\u0430 > \u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u0437\u0430\u0437\u043e\u0440\u043e\u0432\u2026",
      },
      hidden: false,
    },
    menu_Expand_Planet_X: {
      id: "menu_Expand_Planet_X",
      action: "Expand Planet X",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Live Paint > Expand",
        de: "Objekt > Interaktiv malen > Umwandeln",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0411\u044b\u0441\u0442\u0440\u0430\u044f \u0437\u0430\u043b\u0438\u0432\u043a\u0430 > \u0420\u0430\u0437\u043e\u0431\u0440\u0430\u0442\u044c",
      },
      hidden: false,
    },
    menu_Make_Image_Tracing: {
      id: "menu_Make_Image_Tracing",
      action: "Make Image Tracing",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Image Trace > Make",
        de: "Objekt > Bildnachzeichner > Erstellen",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0422\u0440\u0430\u0441\u0441\u0438\u0440\u043e\u0432\u043a\u0430 \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u044f > \u0421\u043e\u0437\u0434\u0430\u0442\u044c",
      },
      hidden: false,
    },
    menu_Make_and_Expand_Image_Tracing: {
      id: "menu_Make_and_Expand_Image_Tracing",
      action: "Make and Expand Image Tracing",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Image Trace > Make and Expand",
        de: "Objekt > Bildnachzeichner > Erstellen und umwandeln",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0422\u0440\u0430\u0441\u0441\u0438\u0440\u043e\u0432\u043a\u0430 \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u044f > \u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0438 \u0440\u0430\u0437\u043e\u0431\u0440\u0430\u0442\u044c",
      },
      hidden: false,
    },
    menu_Release_Image_Tracing: {
      id: "menu_Release_Image_Tracing",
      action: "Release Image Tracing",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Image Trace > Release",
        de: "Objekt > Bildnachzeichner > Zur\u00fcckwandeln",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0422\u0440\u0430\u0441\u0441\u0438\u0440\u043e\u0432\u043a\u0430 \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u044f > \u0420\u0430\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c",
      },
      hidden: false,
    },
    menu_Expand_Image_Tracing: {
      id: "menu_Expand_Image_Tracing",
      action: "Expand Image Tracing",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Image Trace > Expand",
        de: "Objekt > Bildnachzeichner > Umwandeln",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0422\u0440\u0430\u0441\u0441\u0438\u0440\u043e\u0432\u043a\u0430 \u0438\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u044f > \u0420\u0430\u0437\u043e\u0431\u0440\u0430\u0442\u044c",
      },
      hidden: false,
    },
    menu_Make_Vector_Edge: {
      id: "menu_Make_Vector_Edge",
      action: "Make Vector Edge",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Mockup (Beta) > Make",
        de: "Object > Mockup (Beta) > Make",
        ru: "Object > Mockup (Beta) > Make",
      },
      hidden: false,
      minVersion: 28,
    },
    menu_Release_Vector_Edge: {
      id: "menu_Release_Vector_Edge",
      action: "Release Vector Edge",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Mockup (Beta) > Release",
        de: "Object > Mockup (Beta) > Release",
        ru: "Object > Mockup (Beta) > Release",
      },
      hidden: false,
      minVersion: 28,
    },
    menu_Edit_Vector_Edge: {
      id: "menu_Edit_Vector_Edge",
      action: "Edit Vector Edge",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Mockup (Beta) > Edit",
        de: "Object > Mockup (Beta) > Edit",
        ru: "Object > Mockup (Beta) > Edit",
      },
      hidden: false,
      minVersion: 28,
    },
    menu_Make_Text_Wrap: {
      id: "menu_Make_Text_Wrap",
      action: "Make Text Wrap",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Text Wrap > Make",
        de: "Objekt > Textumfluss > Erstellen",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041e\u0431\u0442\u0435\u043a\u0430\u043d\u0438\u0435 \u0442\u0435\u043a\u0441\u0442\u043e\u043c > \u0421\u043e\u0437\u0434\u0430\u0442\u044c",
      },
      hidden: false,
    },
    menu_Release_Text_Wrap: {
      id: "menu_Release_Text_Wrap",
      action: "Release Text Wrap",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Text Wrap > Release",
        de: "Objekt > Textumfluss > Zur\u00fcckwandeln",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041e\u0431\u0442\u0435\u043a\u0430\u043d\u0438\u0435 \u0442\u0435\u043a\u0441\u0442\u043e\u043c > \u041e\u0441\u0432\u043e\u0431\u043e\u0434\u0438\u0442\u044c",
      },
      hidden: false,
    },
    "menu_Text_Wrap_Options...": {
      id: "menu_Text_Wrap_Options...",
      action: "Text Wrap Options...",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Object > Text Wrap > Text Wrap Options...",
        de: "Objekt > Textumfluss > Textumflussoptionen \u2026",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041e\u0431\u0442\u0435\u043a\u0430\u043d\u0438\u0435 \u0442\u0435\u043a\u0441\u0442\u043e\u043c > \u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u043e\u0431\u0442\u0435\u043a\u0430\u043d\u0438\u044f \u0442\u0435\u043a\u0441\u0442\u043e\u043c...",
      },
      hidden: false,
    },
    menu_makeMask: {
      id: "menu_makeMask",
      action: "makeMask",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Clipping Mask > Make",
        de: "Objekt > Schnittmaske > Erstellen",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041e\u0431\u0442\u0440\u0430\u0432\u043e\u0447\u043d\u0430\u044f \u043c\u0430\u0441\u043a\u0430 > \u0421\u043e\u0437\u0434\u0430\u0442\u044c",
      },
      hidden: false,
    },
    menu_releaseMask: {
      id: "menu_releaseMask",
      action: "releaseMask",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Clipping Mask > Release",
        de: "Objekt > Schnittmaske > Zur\u00fcckwandeln",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041e\u0431\u0442\u0440\u0430\u0432\u043e\u0447\u043d\u0430\u044f \u043c\u0430\u0441\u043a\u0430 > \u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c",
      },
      hidden: false,
    },
    menu_editMask: {
      id: "menu_editMask",
      action: "editMask",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Clipping Mask > Edit Mask",
        de: "Objekt > Schnittmaske > Maske bearbeiten",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041e\u0431\u0442\u0440\u0430\u0432\u043e\u0447\u043d\u0430\u044f \u043c\u0430\u0441\u043a\u0430 > \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u043c\u0430\u0441\u043a\u0443",
      },
      hidden: false,
    },
    menu_compoundPath: {
      id: "menu_compoundPath",
      action: "compoundPath",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Compound Path > Make",
        de: "Objekt > Zusammengesetzter Pfad > Erstellen",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0421\u043e\u0441\u0442\u0430\u0432\u043d\u043e\u0439 \u043a\u043e\u043d\u0442\u0443\u0440 > \u0421\u043e\u0437\u0434\u0430\u0442\u044c",
      },
      hidden: false,
    },
    menu_noCompoundPath: {
      id: "menu_noCompoundPath",
      action: "noCompoundPath",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Compound Path > Release",
        de: "Objekt > Zusammengesetzter Pfad > Zur\u00fcckwandeln",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0421\u043e\u0441\u0442\u0430\u0432\u043d\u043e\u0439 \u043a\u043e\u043d\u0442\u0443\u0440 > \u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c",
      },
      hidden: false,
    },
    menu_setCropMarks: {
      id: "menu_setCropMarks",
      action: "setCropMarks",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Artboards > Convert to Artboards",
        de: "Objekt > Zeichenfl\u00e4chen > In Zeichenfl\u00e4chen konvertieren",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041c\u043e\u043d\u0442\u0430\u0436\u043d\u044b\u0435 \u043e\u0431\u043b\u0430\u0441\u0442\u0438 > \u041f\u0440\u0435\u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u044c \u0432 \u043c\u043e\u043d\u0442\u0430\u0436\u043d\u044b\u0435 \u043e\u0431\u043b\u0430\u0441\u0442\u0438",
      },
      hidden: false,
    },
    menu_ReArrange_Artboards: {
      id: "menu_ReArrange_Artboards",
      action: "ReArrange Artboards",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Object > Artboards > Rearrange All Artboards",
        de: "Objekt > Zeichenfl\u00e4chen > Alle Zeichenfl\u00e4chen neu anordnen",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041c\u043e\u043d\u0442\u0430\u0436\u043d\u044b\u0435 \u043e\u0431\u043b\u0430\u0441\u0442\u0438 > \u041f\u0435\u0440\u0435\u0443\u043f\u043e\u0440\u044f\u0434\u043e\u0447\u0438\u0442\u044c \u0432\u0441\u0435 \u043c\u043e\u043d\u0442. \u043e\u0431\u043b.",
      },
      hidden: false,
    },
    menu_Fit_Artboard_to_artwork_bounds: {
      id: "menu_Fit_Artboard_to_artwork_bounds",
      action: "Fit Artboard to artwork bounds",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Object > Artboards > Fit to Artwork Bounds",
        de: "Objekt > Zeichenfl\u00e4chen > An Bildmaterialbegrenzungen anpassen",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041c\u043e\u043d\u0442\u0430\u0436\u043d\u044b\u0435 \u043e\u0431\u043b\u0430\u0441\u0442\u0438 > \u041f\u043e\u0434\u043e\u0433\u043d\u0430\u0442\u044c \u043f\u043e \u0433\u0440\u0430\u043d\u0438\u0446\u0430\u043c \u0438\u043b\u043b\u044e\u0441\u0442\u0440\u0430\u0446\u0438\u0438",
      },
      hidden: false,
    },
    menu_Fit_Artboard_to_selected_Art: {
      id: "menu_Fit_Artboard_to_selected_Art",
      action: "Fit Artboard to selected Art",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Artboards > Fit to Selected Art",
        de: "Objekt > Zeichenfl\u00e4chen > An ausgew\u00e4hlte Grafik anpassen",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u041c\u043e\u043d\u0442\u0430\u0436\u043d\u044b\u0435 \u043e\u0431\u043b\u0430\u0441\u0442\u0438 > \u041f\u043e\u0434\u043e\u0433\u043d\u0430\u0442\u044c \u043f\u043e \u0433\u0440\u0430\u043d\u0438\u0446\u0430\u043c \u0432\u044b\u0434\u0435\u043b\u0435\u043d\u043d\u043e\u0439 \u0438\u043b\u043b\u044e\u0441\u0442\u0440\u0430\u0446\u0438\u0438",
      },
      hidden: false,
    },
    menu_setGraphStyle: {
      id: "menu_setGraphStyle",
      action: "setGraphStyle",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Object > Graph > Type...",
        de: "Objekt > Diagramm > Art \u2026",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0414\u0438\u0430\u0433\u0440\u0430\u043c\u043c\u0430 > \u0422\u0438\u043f\u2026",
      },
      hidden: false,
    },
    menu_editGraphData: {
      id: "menu_editGraphData",
      action: "editGraphData",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Graph > Data...",
        de: "Objekt > Diagramm > Daten \u2026",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0414\u0438\u0430\u0433\u0440\u0430\u043c\u043c\u0430 > \u0414\u0430\u043d\u043d\u044b\u0435\u2026",
      },
      hidden: false,
    },
    menu_graphDesigns: {
      id: "menu_graphDesigns",
      action: "graphDesigns",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Graph > Design...",
        de: "Objekt > Diagramm > Designs \u2026",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0414\u0438\u0430\u0433\u0440\u0430\u043c\u043c\u0430 > \u041e\u0444\u043e\u0440\u043c\u043b\u0435\u043d\u0438\u0435\u2026",
      },
      hidden: false,
    },
    menu_setBarDesign: {
      id: "menu_setBarDesign",
      action: "setBarDesign",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Graph > Column...",
        de: "Objekt > Diagramm > Balken \u2026",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0414\u0438\u0430\u0433\u0440\u0430\u043c\u043c\u0430 > \u0421\u0442\u043e\u043b\u0431\u0435\u0446\u2026",
      },
      hidden: false,
    },
    menu_setIconDesign: {
      id: "menu_setIconDesign",
      action: "setIconDesign",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Object > Graph > Marker...",
        de: "Objekt > Diagramm > Punkte \u2026",
        ru: "\u041e\u0431\u044a\u0435\u043a\u0442 > \u0414\u0438\u0430\u0433\u0440\u0430\u043c\u043c\u0430 > \u041c\u0430\u0440\u043a\u0435\u0440\u2026",
      },
      hidden: false,
    },
    menu_Browse_Typekit_Fonts_Menu_IllustratorUI: {
      id: "menu_Browse_Typekit_Fonts_Menu_IllustratorUI",
      action: "Browse Typekit Fonts Menu IllustratorUI",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Type > More from Adobe Fonts...",
        de: "Schrift > Mehr bei Adobe Fonts \u2026",
        ru: "\u0422\u0435\u043a\u0441\u0442 > \u041d\u0430\u0439\u0442\u0438 \u0431\u043e\u043b\u044c\u0448\u0435 \u0432 Adobe Fonts...",
      },
      hidden: false,
      minVersion: 17.1,
    },
    menu_alternate_glyph_palette_plugin: {
      id: "menu_alternate_glyph_palette_plugin",
      action: "alternate glyph palette plugin",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Type > Glyphs",
        de: "Schrift > Glyphen",
        ru: "\u0422\u0435\u043a\u0441\u0442 > \u0413\u043b\u0438\u0444\u044b",
      },
      hidden: false,
    },
    "menu_area-type-options": {
      id: "menu_area-type-options",
      action: "area-type-options",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Type > Area Type Options...",
        de: "Schrift > Fl\u00e4chentextoptionen \u2026",
        ru: "\u0422\u0435\u043a\u0441\u0442 > \u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u0442\u0435\u043a\u0441\u0442\u0430 \u0432 \u043e\u0431\u043b\u0430\u0441\u0442\u0438\u2026",
      },
      hidden: false,
    },
    menu_Rainbow: {
      id: "menu_Rainbow",
      action: "Rainbow",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Type > Type on a Path > Rainbow",
        de: "Schrift > Pfadtext > Regenbogen",
        ru: "\u0422\u0435\u043a\u0441\u0442 > \u0422\u0435\u043a\u0441\u0442 \u043f\u043e \u043a\u043e\u043d\u0442\u0443\u0440\u0443 > \u0420\u0430\u0434\u0443\u0433\u0430",
      },
      hidden: false,
    },
    menu_Skew: {
      id: "menu_Skew",
      action: "Skew",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Type > Type on a Path > Skew",
        de: "Schrift > Pfadtext > Asymmetrie",
        ru: "\u0422\u0435\u043a\u0441\u0442 > \u0422\u0435\u043a\u0441\u0442 \u043f\u043e \u043a\u043e\u043d\u0442\u0443\u0440\u0443 > \u041d\u0430\u043a\u043b\u043e\u043d",
      },
      hidden: false,
    },
    menu_3D_ribbon: {
      id: "menu_3D_ribbon",
      action: "3D ribbon",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Type > Type on a Path > 3D Ribbon",
        de: "Schrift > Pfadtext > 3D-Band",
        ru: "\u0422\u0435\u043a\u0441\u0442 > \u0422\u0435\u043a\u0441\u0442 \u043f\u043e \u043a\u043e\u043d\u0442\u0443\u0440\u0443 > \u041a\u0430\u0441\u043a\u0430\u0434",
      },
      hidden: false,
    },
    menu_Stair_Step: {
      id: "menu_Stair_Step",
      action: "Stair Step",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Type > Type on a Path > Stair Step",
        de: "Schrift > Pfadtext > Treppenstufe",
        ru: "\u0422\u0435\u043a\u0441\u0442 > \u0422\u0435\u043a\u0441\u0442 \u043f\u043e \u043a\u043e\u043d\u0442\u0443\u0440\u0443 > \u041b\u0435\u0441\u0435\u043d\u043a\u0430",
      },
      hidden: false,
    },
    menu_Gravity: {
      id: "menu_Gravity",
      action: "Gravity",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Type > Type on a Path > Gravity",
        de: "Schrift > Pfadtext > Schwerkraft",
        ru: "\u0422\u0435\u043a\u0441\u0442 > \u0422\u0435\u043a\u0441\u0442 \u043f\u043e \u043a\u043e\u043d\u0442\u0443\u0440\u0443 > \u0413\u0440\u0430\u0432\u0438\u0442\u0430\u0446\u0438\u044f",
      },
      hidden: false,
    },
    menu_typeOnPathOptions: {
      id: "menu_typeOnPathOptions",
      action: "typeOnPathOptions",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Type > Type on a Path > Type on a Path Options...",
        de: "Schrift > Pfadtext > Pfadtextoptionen \u2026",
        ru: "\u0422\u0435\u043a\u0441\u0442 > \u0422\u0435\u043a\u0441\u0442 \u043f\u043e \u043a\u043e\u043d\u0442\u0443\u0440\u0443 > \u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u0442\u0435\u043a\u0441\u0442\u0430 \u043f\u043e \u043a\u043e\u043d\u0442\u0443\u0440\u0443...",
      },
      hidden: false,
    },
    menu_updateLegacyTOP: {
      id: "menu_updateLegacyTOP",
      action: "updateLegacyTOP",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Type > Type on a Path > Update Legacy Type on a Path",
        de: "Schrift > Pfadtext > Alten Pfadtext aktualisieren",
        ru: "\u0422\u0435\u043a\u0441\u0442 > \u0422\u0435\u043a\u0441\u0442 \u043f\u043e \u043a\u043e\u043d\u0442\u0443\u0440\u0443 > \u041e\u0431\u043d\u043e\u0432\u0438\u0442\u044c \u043f\u0440\u0435\u0436\u043d\u044e\u044e \u0432\u0435\u0440\u0441\u0438\u044e \u0442\u0435\u043a\u0441\u0442\u0430 \u043f\u043e \u043a\u043e\u043d\u0442\u0443\u0440\u0443",
      },
      hidden: false,
    },
    menu_threadTextCreate: {
      id: "menu_threadTextCreate",
      action: "threadTextCreate",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Type > Threaded Text > Create",
        de: "Schrift > Verketteter Text > Erstellen",
        ru: "\u0422\u0435\u043a\u0441\u0442 > \u0421\u0432\u044f\u0437\u0430\u043d\u043d\u044b\u0435 \u0442\u0435\u043a\u0441\u0442\u043e\u0432\u044b\u0435 \u0431\u043b\u043e\u043a\u0438 > \u0421\u0432\u044f\u0437\u0430\u0442\u044c",
      },
      hidden: false,
    },
    menu_releaseThreadedTextSelection: {
      id: "menu_releaseThreadedTextSelection",
      action: "releaseThreadedTextSelection",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Type > Threaded Text > Release Selection",
        de: "Schrift > Verketteter Text > Auswahl zur\u00fcckwandeln",
        ru: "\u0422\u0435\u043a\u0441\u0442 > \u0421\u0432\u044f\u0437\u0430\u043d\u043d\u044b\u0435 \u0442\u0435\u043a\u0441\u0442\u043e\u0432\u044b\u0435 \u0431\u043b\u043e\u043a\u0438 > \u0418\u0441\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u0432\u044b\u0434\u0435\u043b\u0435\u043d\u043d\u044b\u0435",
      },
      hidden: false,
    },
    menu_removeThreading: {
      id: "menu_removeThreading",
      action: "removeThreading",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Type > Threaded Text > Remove Threading",
        de: "Schrift > Verketteter Text > Verkettung entfernen",
        ru: "\u0422\u0435\u043a\u0441\u0442 > \u0421\u0432\u044f\u0437\u0430\u043d\u043d\u044b\u0435 \u0442\u0435\u043a\u0441\u0442\u043e\u0432\u044b\u0435 \u0431\u043b\u043e\u043a\u0438 > \u0423\u0434\u0430\u043b\u0438\u0442\u044c \u0441\u0432\u044f\u0437\u044c \u0442\u0435\u043a\u0441\u0442\u043e\u0432\u044b\u0445 \u0431\u043b\u043e\u043a\u043e\u0432",
      },
      hidden: false,
    },
    menu_fitHeadline: {
      id: "menu_fitHeadline",
      action: "fitHeadline",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Type > Fit Headline",
        de: "Schrift > \u00dcberschrift einpassen",
        ru: "\u0422\u0435\u043a\u0441\u0442 > \u0420\u0430\u0437\u043e\u0433\u043d\u0430\u0442\u044c \u0437\u0430\u0433\u043e\u043b\u043e\u0432\u043e\u043a",
      },
      hidden: false,
    },
    menu_Adobe_IllustratorUI_Resolve_Missing_Font: {
      id: "menu_Adobe_IllustratorUI_Resolve_Missing_Font",
      action: "Adobe IllustratorUI Resolve Missing Font",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Type > Resolve Missing Fonts...",
        de: "Schrift > Fehlende Schriftarten aufl\u00f6sen \u2026",
        ru: "\u0422\u0435\u043a\u0441\u0442 > \u0421\u043e\u043f\u043e\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u043e\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u044e\u0449\u0438\u0435 \u0448\u0440\u0438\u0444\u0442\u044b...",
      },
      hidden: false,
    },
    menu_Adobe_Illustrator_Find_Font_Menu_Item: {
      id: "menu_Adobe_Illustrator_Find_Font_Menu_Item",
      action: "Adobe Illustrator Find Font Menu Item",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Type > Find/Replace Font...",
        de: "Schrift > Schriftart suchen/ersetzen \u2026",
        ru: "\u0422\u0435\u043a\u0441\u0442 > \u041d\u0430\u0439\u0442\u0438/\u0437\u0430\u043c\u0435\u043d\u0438\u0442\u044c \u0448\u0440\u0438\u0444\u0442...",
      },
      hidden: false,
    },
    menu_UpperCase_Change_Case_Item: {
      id: "menu_UpperCase_Change_Case_Item",
      action: "UpperCase Change Case Item",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Type > Change Case > UPPERCASE",
        de: "Schrift > Gro\u00df-/Kleinschreibung \u00e4ndern > GROSSBUCHSTABEN",
        ru: "\u0422\u0435\u043a\u0441\u0442 > \u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c \u0440\u0435\u0433\u0438\u0441\u0442\u0440 > \u0412\u0421\u0415 \u041f\u0420\u041e\u041f\u0418\u0421\u041d\u042b\u0415",
      },
      hidden: false,
    },
    menu_LowerCase_Change_Case_Item: {
      id: "menu_LowerCase_Change_Case_Item",
      action: "LowerCase Change Case Item",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Type > Change Case > lowercase",
        de: "Schrift > Gro\u00df-/Kleinschreibung \u00e4ndern > kleinbuchstaben",
        ru: "\u0422\u0435\u043a\u0441\u0442 > \u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c \u0440\u0435\u0433\u0438\u0441\u0442\u0440 > \u0432\u0441\u0435 \u0441\u0442\u0440\u043e\u0447\u043d\u044b\u0435",
      },
      hidden: false,
    },
    menu_Title_Case_Change_Case_Item: {
      id: "menu_Title_Case_Change_Case_Item",
      action: "Title Case Change Case Item",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Type > Change Case > Title Case",
        de: "Schrift > Gro\u00df-/Kleinschreibung \u00e4ndern > Erster Buchstabe Im Wort Gro\u00df",
        ru: "\u0422\u0435\u043a\u0441\u0442 > \u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c \u0440\u0435\u0433\u0438\u0441\u0442\u0440 > \u041f\u0440\u043e\u043f\u0438\u0441\u043d\u0430\u044f \u0412 \u041d\u0430\u0447\u0430\u043b\u0435 \u041a\u0430\u0436\u0434\u043e\u0433\u043e \u0421\u043b\u043e\u0432\u0430",
      },
      hidden: false,
    },
    menu_Sentence_case_Change_Case_Item: {
      id: "menu_Sentence_case_Change_Case_Item",
      action: "Sentence case Change Case Item",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Type > Change Case > Sentence case",
        de: "Schrift > Gro\u00df-/Kleinschreibung \u00e4ndern > Erster buchstabe im satz gro\u00df",
        ru: "\u0422\u0435\u043a\u0441\u0442 > \u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c \u0440\u0435\u0433\u0438\u0441\u0442\u0440 > \u041f\u0440\u043e\u043f\u0438\u0441\u043d\u0430\u044f \u0432 \u043d\u0430\u0447\u0430\u043b\u0435 \u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u044f",
      },
      hidden: false,
    },
    menu_Adobe_Illustrator_Smart_Punctuation_Menu_Item: {
      id: "menu_Adobe_Illustrator_Smart_Punctuation_Menu_Item",
      action: "Adobe Illustrator Smart Punctuation Menu Item",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Type > Smart Punctuation...",
        de: "Schrift > Satz-/Sonderzeichen \u2026",
        ru: "\u0422\u0435\u043a\u0441\u0442 > \u0422\u0438\u043f\u043e\u0433\u0440\u0430\u0444\u0441\u043a\u0430\u044f \u043f\u0443\u043d\u043a\u0442\u0443\u0430\u0446\u0438\u044f...",
      },
      hidden: false,
    },
    menu_outline: {
      id: "menu_outline",
      action: "outline",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Type > Create Outlines",
        de: "Schrift > In Pfade umwandeln",
        ru: "\u0422\u0435\u043a\u0441\u0442 > \u041f\u0440\u0435\u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u044c \u0432 \u043a\u0440\u0438\u0432\u044b\u0435",
      },
      hidden: false,
    },
    menu_Adobe_Optical_Alignment_Item: {
      id: "menu_Adobe_Optical_Alignment_Item",
      action: "Adobe Optical Alignment Item",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Type > Optical Margin Alignment",
        de: "Schrift > Optischer Randausgleich",
        ru: "\u0422\u0435\u043a\u0441\u0442 > \u0412\u0438\u0437\u0443\u0430\u043b\u044c\u043d\u043e\u0435 \u0432\u044b\u0440\u0430\u0432\u043d\u0438\u0432\u0430\u043d\u0438\u0435 \u043f\u043e\u043b\u0435\u0439",
      },
      hidden: false,
    },
    menu_convert_list_style_to_text: {
      id: "menu_convert_list_style_to_text",
      action: "convert list style to text",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Type > Bullets and Numbering > Convert to text",
        de: "Schrift > Aufz\u00e4hlungszeichen und Nummerierung > In Text konvertieren",
        ru: "Type > Bullets and Numbering > Convert to text",
      },
      hidden: false,
      minVersion: 27.1,
    },
    menu_showHiddenChar: {
      id: "menu_showHiddenChar",
      action: "showHiddenChar",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Type > Show Hidden Characters",
        de: "Schrift > Verborgene Zeichen einblenden / ausblenden",
        ru: "\u0422\u0435\u043a\u0441\u0442 > \u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c \u0441\u043a\u0440\u044b\u0442\u044b\u0435 \u0441\u0438\u043c\u0432\u043e\u043b\u044b",
      },
      hidden: false,
    },
    "menu_type-horizontal": {
      id: "menu_type-horizontal",
      action: "type-horizontal",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Type > Type Orientation > Horizontal",
        de: "Schrift > Textausrichtung > Horizontal",
        ru: "\u0422\u0435\u043a\u0441\u0442 > \u041e\u0440\u0438\u0435\u043d\u0442\u0430\u0446\u0438\u044f \u0442\u0435\u043a\u0441\u0442\u0430 > \u0413\u043e\u0440\u0438\u0437\u043e\u043d\u0442\u0430\u043b\u044c\u043d\u0430\u044f",
      },
      hidden: false,
    },
    "menu_type-vertical": {
      id: "menu_type-vertical",
      action: "type-vertical",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Type > Type Orientation > Vertical",
        de: "Schrift > Textausrichtung > Vertikal",
        ru: "\u0422\u0435\u043a\u0441\u0442 > \u041e\u0440\u0438\u0435\u043d\u0442\u0430\u0446\u0438\u044f \u0442\u0435\u043a\u0441\u0442\u0430 > \u0412\u0435\u0440\u0442\u0438\u043a\u0430\u043b\u044c\u043d\u0430\u044f",
      },
      hidden: false,
    },
    menu_selectall: {
      id: "menu_selectall",
      action: "selectall",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Select > All",
        de: "Auswahl > Alles ausw\u00e4hlen",
        ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u0412\u0441\u0435",
      },
      hidden: false,
    },
    menu_selectallinartboard: {
      id: "menu_selectallinartboard",
      action: "selectallinartboard",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Select > All on Active Artboard",
        de: "Auswahl > Alles auf der aktiven Zeichenfl\u00e4che",
        ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u0412\u0441\u0435 \u043e\u0431\u044a\u0435\u043a\u0442\u044b \u0432 \u0430\u043a\u0442\u0438\u0432\u043d\u043e\u0439 \u043c\u043e\u043d\u0442\u0430\u0436\u043d\u043e\u0439 \u043e\u0431\u043b\u0430\u0441\u0442\u0438",
      },
      hidden: false,
    },
    menu_deselectall: {
      id: "menu_deselectall",
      action: "deselectall",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Select > Deselect",
        de: "Auswahl > Auswahl aufheben",
        ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c \u0432\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435",
      },
      hidden: false,
    },
    menu_Find_Reselect_menu_item: {
      id: "menu_Find_Reselect_menu_item",
      action: "Find Reselect menu item",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Select > Reselect",
        de: "Auswahl > Erneut ausw\u00e4hlen",
        ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u0412\u044b\u0434\u0435\u043b\u0438\u0442\u044c \u0441\u043d\u043e\u0432\u0430",
      },
      hidden: false,
    },
    menu_Inverse_menu_item: {
      id: "menu_Inverse_menu_item",
      action: "Inverse menu item",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Select > Inverse",
        de: "Auswahl > Auswahl umkehren",
        ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u0418\u043d\u0432\u0435\u0440\u0441\u0438\u044f",
      },
      hidden: false,
    },
    menu_Selection_Hat_8: {
      id: "menu_Selection_Hat_8",
      action: "Selection Hat 8",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Select > Next Object Above",
        de: "Auswahl > N\u00e4chstes Objekt dar\u00fcber",
        ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u0421\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u0439 \u043e\u0431\u044a\u0435\u043a\u0442 \u0441\u0432\u0435\u0440\u0445\u0443",
      },
      hidden: false,
    },
    menu_Selection_Hat_9: {
      id: "menu_Selection_Hat_9",
      action: "Selection Hat 9",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Select > Next Object Below",
        de: "Auswahl > N\u00e4chstes Objekt darunter",
        ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u0421\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u0439 \u043e\u0431\u044a\u0435\u043a\u0442 \u0441\u043d\u0438\u0437\u0443",
      },
      hidden: false,
    },
    menu_Find_Appearance_menu_item: {
      id: "menu_Find_Appearance_menu_item",
      action: "Find Appearance menu item",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Select > Same > Appearance",
        de: "Auswahl > Gleich > Aussehen",
        ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u043e\u0431\u0449\u0435\u043c\u0443 \u043f\u0440\u0438\u0437\u043d\u0430\u043a\u0443 > \u041e\u0444\u043e\u0440\u043c\u043b\u0435\u043d\u0438\u0435",
      },
      hidden: false,
    },
    menu_Find_Appearance_Attributes_menu_item: {
      id: "menu_Find_Appearance_Attributes_menu_item",
      action: "Find Appearance Attributes menu item",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Select > Same > Appearance Attribute",
        de: "Auswahl > Gleich > Aussehensattribute",
        ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u043e\u0431\u0449\u0435\u043c\u0443 \u043f\u0440\u0438\u0437\u043d\u0430\u043a\u0443 > \u0410\u0442\u0440\u0438\u0431\u0443\u0442\u044b \u043e\u0444\u043e\u0440\u043c\u043b\u0435\u043d\u0438\u044f",
      },
      hidden: false,
    },
    menu_Find_Blending_Mode_menu_item: {
      id: "menu_Find_Blending_Mode_menu_item",
      action: "Find Blending Mode menu item",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Select > Same > Blending Mode",
        de: "Auswahl > Gleich > F\u00fcllmethode",
        ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u043e\u0431\u0449\u0435\u043c\u0443 \u043f\u0440\u0438\u0437\u043d\u0430\u043a\u0443 > \u0421 \u043e\u0434\u0438\u043d\u0430\u043a\u043e\u0432\u044b\u043c \u0440\u0435\u0436\u0438\u043c\u043e\u043c \u043d\u0430\u043b\u043e\u0436\u0435\u043d\u0438\u044f",
      },
      hidden: false,
    },
    "menu_Find_Fill_&_Stroke_menu_item": {
      id: "menu_Find_Fill_&_Stroke_menu_item",
      action: "Find Fill & Stroke menu item",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Select > Same > Fill & Stroke",
        de: "Auswahl > Gleich > Fl\u00e4che und Kontur",
        ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u043e\u0431\u0449\u0435\u043c\u0443 \u043f\u0440\u0438\u0437\u043d\u0430\u043a\u0443 > \u0421 \u043e\u0434\u0438\u043d\u0430\u043a\u043e\u0432\u044b\u043c\u0438 \u0437\u0430\u043b\u0438\u0432\u043a\u043e\u0439 \u0438 \u043e\u0431\u0432\u043e\u0434\u043a\u043e\u0439",
      },
      hidden: false,
    },
    menu_Find_Fill_Color_menu_item: {
      id: "menu_Find_Fill_Color_menu_item",
      action: "Find Fill Color menu item",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Select > Same > Fill Color",
        de: "Auswahl > Gleich > Fl\u00e4chenfarbe",
        ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u043e\u0431\u0449\u0435\u043c\u0443 \u043f\u0440\u0438\u0437\u043d\u0430\u043a\u0443 > \u0421 \u043e\u0434\u0438\u043d\u0430\u043a\u043e\u0432\u044b\u043c \u0446\u0432\u0435\u0442\u043e\u043c \u0437\u0430\u043b\u0438\u0432\u043a\u0438",
      },
      hidden: false,
    },
    menu_Find_Opacity_menu_item: {
      id: "menu_Find_Opacity_menu_item",
      action: "Find Opacity menu item",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Select > Same > Opacity",
        de: "Auswahl > Gleich > Deckkraft",
        ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u043e\u0431\u0449\u0435\u043c\u0443 \u043f\u0440\u0438\u0437\u043d\u0430\u043a\u0443 > \u0421 \u043e\u0434\u0438\u043d\u0430\u043a\u043e\u0432\u043e\u0439 \u043d\u0435\u043f\u0440\u043e\u0437\u0440\u0430\u0447\u043d\u043e\u0441\u0442\u044c\u044e",
      },
      hidden: false,
    },
    menu_Find_Stroke_Color_menu_item: {
      id: "menu_Find_Stroke_Color_menu_item",
      action: "Find Stroke Color menu item",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Select > Same > Stroke Color",
        de: "Auswahl > Gleich > Konturfarbe",
        ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u043e\u0431\u0449\u0435\u043c\u0443 \u043f\u0440\u0438\u0437\u043d\u0430\u043a\u0443 > \u0421 \u043e\u0434\u0438\u043d\u0430\u043a\u043e\u0432\u044b\u043c \u0446\u0432\u0435\u0442\u043e\u043c \u043e\u0431\u0432\u043e\u0434\u043a\u0438",
      },
      hidden: false,
    },
    menu_Find_Stroke_Weight_menu_item: {
      id: "menu_Find_Stroke_Weight_menu_item",
      action: "Find Stroke Weight menu item",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Select > Same > Stroke Weight",
        de: "Auswahl > Gleich > Konturst\u00e4rke",
        ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u043e\u0431\u0449\u0435\u043c\u0443 \u043f\u0440\u0438\u0437\u043d\u0430\u043a\u0443 > \u0421 \u043e\u0434\u0438\u043d\u0430\u043a\u043e\u0432\u043e\u0439 \u0442\u043e\u043b\u0449\u0438\u043d\u043e\u0439 \u043e\u0431\u0432\u043e\u0434\u043a\u0438",
      },
      hidden: false,
    },
    menu_Find_Style_menu_item: {
      id: "menu_Find_Style_menu_item",
      action: "Find Style menu item",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Select > Same > Graphic Style",
        de: "Auswahl > Gleich > Grafikstil",
        ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u043e\u0431\u0449\u0435\u043c\u0443 \u043f\u0440\u0438\u0437\u043d\u0430\u043a\u0443 > \u0421\u0442\u0438\u043b\u044c \u0433\u0440\u0430\u0444\u0438\u043a\u0438",
      },
      hidden: false,
    },
    menu_Find_Live_Shape_menu_item: {
      id: "menu_Find_Live_Shape_menu_item",
      action: "Find Live Shape menu item",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Select > Same > Shape",
        de: "Auswahl > Gleich > Form",
        ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u043e\u0431\u0449\u0435\u043c\u0443 \u043f\u0440\u0438\u0437\u043d\u0430\u043a\u0443 > \u0424\u0438\u0433\u0443\u0440\u0430",
      },
      hidden: false,
    },
    menu_Find_Symbol_Instance_menu_item: {
      id: "menu_Find_Symbol_Instance_menu_item",
      action: "Find Symbol Instance menu item",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Select > Same > Symbol Instance",
        de: "Auswahl > Gleich > Symbolinstanz",
        ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u043e\u0431\u0449\u0435\u043c\u0443 \u043f\u0440\u0438\u0437\u043d\u0430\u043a\u0443 > \u041e\u0434\u0438\u043d\u0430\u043a\u043e\u0432\u044b\u0435 \u043e\u0431\u0440\u0430\u0437\u0446\u044b \u0441\u0438\u043c\u0432\u043e\u043b\u0430",
      },
      hidden: false,
    },
    menu_Find_Link_Block_Series_menu_item: {
      id: "menu_Find_Link_Block_Series_menu_item",
      action: "Find Link Block Series menu item",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Select > Same > Link Block Series",
        de: "Auswahl > Gleich > Verkn\u00fcpfungsblockreihen",
        ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u043e\u0431\u0449\u0435\u043c\u0443 \u043f\u0440\u0438\u0437\u043d\u0430\u043a\u0443 > \u041f\u043e\u0441\u043b\u0435\u0434\u043e\u0432\u0430\u0442\u0435\u043b\u044c\u043d\u043e\u0441\u0442\u044c \u0441\u0432\u044f\u0437\u0430\u043d\u043d\u044b\u0445 \u0431\u043b\u043e\u043a\u043e\u0432",
      },
      hidden: false,
    },
    menu_Find_Text_Font_Family_menu_item: {
      id: "menu_Find_Text_Font_Family_menu_item",
      action: "Find Text Font Family menu item",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Select > Same > Font Family",
        de: "Auswahl > Gleich > Schriftfamilie",
        ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u043e\u0431\u0449\u0435\u043c\u0443 \u043f\u0440\u0438\u0437\u043d\u0430\u043a\u0443 > \u0421\u0435\u043c\u0435\u0439\u0441\u0442\u0432\u043e \u0448\u0440\u0438\u0444\u0442\u043e\u0432",
      },
      hidden: false,
      minVersion: 26,
    },
    menu_Find_Text_Font_Family_Style_menu_item: {
      id: "menu_Find_Text_Font_Family_Style_menu_item",
      action: "Find Text Font Family Style menu item",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Select > Same > Font Family & Style",
        de: "Auswahl > Gleich > Schriftfamilie und -schnitt",
        ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u043e\u0431\u0449\u0435\u043c\u0443 \u043f\u0440\u0438\u0437\u043d\u0430\u043a\u0443 > \u0421\u0435\u043c\u0435\u0439\u0441\u0442\u0432\u043e \u0438 \u0441\u0442\u0438\u043b\u044c \u0448\u0440\u0438\u0444\u0442\u043e\u0432",
      },
      hidden: false,
      minVersion: 26,
    },
    menu_Find_Text_Font_Family_Style_Size_menu_item: {
      id: "menu_Find_Text_Font_Family_Style_Size_menu_item",
      action: "Find Text Font Family Style Size menu item",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Select > Same > Font Family, Style & Size",
        de: "Auswahl > Gleich > Schriftfamilie, -schnitt und -grad",
        ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u043e\u0431\u0449\u0435\u043c\u0443 \u043f\u0440\u0438\u0437\u043d\u0430\u043a\u0443 > \u0421\u0435\u043c\u0435\u0439\u0441\u0442\u0432\u043e, \u0441\u0442\u0438\u043b\u044c \u0438 \u0440\u0430\u0437\u043c\u0435\u0440 \u0448\u0440\u0438\u0444\u0442\u043e\u0432",
      },
      hidden: false,
      minVersion: 26,
    },
    menu_Find_Text_Font_Size_menu_item: {
      id: "menu_Find_Text_Font_Size_menu_item",
      action: "Find Text Font Size menu item",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Select > Same > Font Size",
        de: "Auswahl > Gleich > Schriftgrad",
        ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u043e\u0431\u0449\u0435\u043c\u0443 \u043f\u0440\u0438\u0437\u043d\u0430\u043a\u0443 > \u0420\u0430\u0437\u043c\u0435\u0440 \u0448\u0440\u0438\u0444\u0442\u0430",
      },
      hidden: false,
      minVersion: 26,
    },
    menu_Find_Text_Fill_Color_menu_item: {
      id: "menu_Find_Text_Fill_Color_menu_item",
      action: "Find Text Fill Color menu item",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Select > Same > Text Fill Color",
        de: "Auswahl > Gleich > Textfl\u00e4chenfarbe",
        ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u043e\u0431\u0449\u0435\u043c\u0443 \u043f\u0440\u0438\u0437\u043d\u0430\u043a\u0443 > \u0426\u0432\u0435\u0442 \u0437\u0430\u043b\u0438\u0432\u043a\u0438 \u0442\u0435\u043a\u0441\u0442\u0430",
      },
      hidden: false,
      minVersion: 26,
    },
    menu_Find_Text_Stroke_Color_menu_item: {
      id: "menu_Find_Text_Stroke_Color_menu_item",
      action: "Find Text Stroke Color menu item",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Select > Same > Text Stroke Color",
        de: "Auswahl > Gleich > Textkonturfarbe",
        ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u043e\u0431\u0449\u0435\u043c\u0443 \u043f\u0440\u0438\u0437\u043d\u0430\u043a\u0443 > \u0426\u0432\u0435\u0442 \u043e\u0431\u0432\u043e\u0434\u043a\u0438 \u0442\u0435\u043a\u0441\u0442\u0430",
      },
      hidden: false,
      minVersion: 26,
    },
    menu_Find_Text_Fill_Stroke_Color_menu_item: {
      id: "menu_Find_Text_Fill_Stroke_Color_menu_item",
      action: "Find Text Fill Stroke Color menu item",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Select > Same > Text Fill & Stroke Color",
        de: "Auswahl > Gleich > Textfl\u00e4chen- und -konturfarbe",
        ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u043e\u0431\u0449\u0435\u043c\u0443 \u043f\u0440\u0438\u0437\u043d\u0430\u043a\u0443 > \u0426\u0432\u0435\u0442 \u0437\u0430\u043b\u0438\u0432\u043a\u0438 \u0438 \u043e\u0431\u0432\u043e\u0434\u043a\u0438 \u0442\u0435\u043a\u0441\u0442\u0430",
      },
      hidden: false,
      minVersion: 26,
    },
    menu_Selection_Hat_3: {
      id: "menu_Selection_Hat_3",
      action: "Selection Hat 3",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Select > Object > All on Same Layers",
        de: "Auswahl > Objekt > Alles auf denselben Ebenen",
        ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u0442\u0438\u043f\u0443 \u043e\u0431\u044a\u0435\u043a\u0442\u043e\u0432 > \u0412\u0441\u0435 \u043d\u0430 \u044d\u0442\u043e\u043c \u0436\u0435 \u0441\u043b\u043e\u0435",
      },
      hidden: false,
    },
    menu_Selection_Hat_1: {
      id: "menu_Selection_Hat_1",
      action: "Selection Hat 1",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Select > Object > Direction Handles",
        de: "Auswahl > Objekt > Richtungsgriffe",
        ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u0442\u0438\u043f\u0443 \u043e\u0431\u044a\u0435\u043a\u0442\u043e\u0432 > \u0423\u043f\u0440\u0430\u0432\u043b\u044f\u044e\u0449\u0438\u0435 \u043c\u0430\u043d\u0438\u043f\u0443\u043b\u044f\u0442\u043e\u0440\u044b",
      },
      hidden: false,
    },
    menu_Bristle_Brush_Strokes_menu_item: {
      id: "menu_Bristle_Brush_Strokes_menu_item",
      action: "Bristle Brush Strokes menu item",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Select > Object > Bristle Brush Strokes",
        de: "Auswahl > Objekt > Borstenpinselstriche",
        ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u0442\u0438\u043f\u0443 \u043e\u0431\u044a\u0435\u043a\u0442\u043e\u0432 > \u041c\u0430\u0437\u043a\u0438 \u0434\u043b\u044f \u043a\u0438\u0441\u0442\u0438 \u0438\u0437 \u0449\u0435\u0442\u0438\u043d\u044b",
      },
      hidden: false,
    },
    menu_Brush_Strokes_menu_item: {
      id: "menu_Brush_Strokes_menu_item",
      action: "Brush Strokes menu item",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Select > Object > Brush Strokes",
        de: "Auswahl > Objekt > Pinselkonturen",
        ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u0442\u0438\u043f\u0443 \u043e\u0431\u044a\u0435\u043a\u0442\u043e\u0432 > \u041c\u0430\u0437\u043a\u0438 \u043a\u0438\u0441\u0442\u0438",
      },
      hidden: false,
    },
    menu_Clipping_Masks_menu_item: {
      id: "menu_Clipping_Masks_menu_item",
      action: "Clipping Masks menu item",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Select > Object > Clipping Masks",
        de: "Auswahl > Objekt > Schnittmasken",
        ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u0442\u0438\u043f\u0443 \u043e\u0431\u044a\u0435\u043a\u0442\u043e\u0432 > \u041e\u0431\u0442\u0440\u0430\u0432\u043e\u0447\u043d\u044b\u0435 \u043c\u0430\u0441\u043a\u0438",
      },
      hidden: false,
    },
    menu_Stray_Points_menu_item: {
      id: "menu_Stray_Points_menu_item",
      action: "Stray Points menu item",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Select > Object > Stray Points",
        de: "Auswahl > Objekt > Einzelne Ankerpunkte",
        ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u0442\u0438\u043f\u0443 \u043e\u0431\u044a\u0435\u043a\u0442\u043e\u0432 > \u0418\u0437\u043e\u043b\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u0435 \u0442\u043e\u0447\u043a\u0438",
      },
      hidden: false,
    },
    menu_Text_Objects_menu_item: {
      id: "menu_Text_Objects_menu_item",
      action: "Text Objects menu item",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Select > Object > All Text Objects",
        de: "Auswahl > Objekt > Alle Textobjekte",
        ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u0442\u0438\u043f\u0443 \u043e\u0431\u044a\u0435\u043a\u0442\u043e\u0432 > \u0412\u0441\u0435 \u043e\u0431\u044a\u0435\u043a\u0442\u044b \u0442\u0435\u043a\u0441\u0442\u0430",
      },
      hidden: false,
    },
    menu_Point_Text_Objects_menu_item: {
      id: "menu_Point_Text_Objects_menu_item",
      action: "Point Text Objects menu item",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Select > Object > Point Text Objects",
        de: "Auswahl > Objekt > Punkttextobjekte",
        ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u0442\u0438\u043f\u0443 \u043e\u0431\u044a\u0435\u043a\u0442\u043e\u0432 > \u041e\u0431\u044a\u0435\u043a\u0442\u044b \u0442\u0435\u043a\u0441\u0442\u0430 \u0438\u0437 \u0442\u043e\u0447\u043a\u0438",
      },
      hidden: false,
    },
    menu_Area_Text_Objects_menu_item: {
      id: "menu_Area_Text_Objects_menu_item",
      action: "Area Text Objects menu item",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Select > Object > Area Text Objects",
        de: "Auswahl > Objekt > Fl\u00e4chenttextobjekte",
        ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041f\u043e \u0442\u0438\u043f\u0443 \u043e\u0431\u044a\u0435\u043a\u0442\u043e\u0432 > \u041e\u0431\u044a\u0435\u043a\u0442\u044b \u0442\u0435\u043a\u0441\u0442\u0430 \u0432 \u043e\u0431\u043b\u0430\u0441\u0442\u0438",
      },
      hidden: false,
    },
    menu_SmartEdit_Menu_Item: {
      id: "menu_SmartEdit_Menu_Item",
      action: "SmartEdit Menu Item",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Select > Start/Stop Global Edit",
        de: "Auswahl > Globale Bearbeitung starten/anhalten",
        ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u041d\u0430\u0447\u0430\u0442\u044c \u0433\u043b\u043e\u0431\u0430\u043b\u044c\u043d\u043e\u0435 \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u0435",
      },
      hidden: false,
      minVersion: 23,
    },
    menu_Selection_Hat_10: {
      id: "menu_Selection_Hat_10",
      action: "Selection Hat 10",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Select > Save Selection...",
        de: "Auswahl > Auswahl speichern \u2026",
        ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0432\u044b\u0434\u0435\u043b\u0435\u043d\u043d\u0443\u044e \u043e\u0431\u043b\u0430\u0441\u0442\u044c\u2026",
      },
      hidden: false,
    },
    menu_Selection_Hat_11: {
      id: "menu_Selection_Hat_11",
      action: "Selection Hat 11",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Select > Edit Selection...",
        de: "Auswahl > Auswahl bearbeiten \u2026",
        ru: "\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 > \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0432\u044b\u0434\u0435\u043b\u0435\u043d\u043d\u0443\u044e \u043e\u0431\u043b\u0430\u0441\u0442\u044c\u2026",
      },
      hidden: false,
    },
    menu_Selection_Hat_14: {
      id: "menu_Selection_Hat_14",
      action: "Selection Hat 14",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "Select > Update Selection",
        de: "Select > Update Selection",
        ru: "Select > Update Selection",
      },
      hidden: false,
      minVersion: 28,
    },
    menu_Adobe_Apply_Last_Effect: {
      id: "menu_Adobe_Apply_Last_Effect",
      action: "Adobe Apply Last Effect",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Apply Last Effect",
        de: "Effekt > Letzten Effekt anwenden",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041f\u0440\u0438\u043c\u0435\u043d\u0438\u0442\u044c \u043f\u043e\u0441\u043b\u0435\u0434\u043d\u0438\u0439 \u044d\u0444\u0444\u0435\u043a\u0442",
      },
      hidden: false,
    },
    menu_Adobe_Last_Effect: {
      id: "menu_Adobe_Last_Effect",
      action: "Adobe Last Effect",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Last Effect",
        de: "Effekt > Letzter Effekt",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041f\u043e\u0441\u043b\u0435\u0434\u043d\u0438\u0439 \u044d\u0444\u0444\u0435\u043a\u0442",
      },
      hidden: false,
    },
    menu_Live_Rasterize_Effect_Setting: {
      id: "menu_Live_Rasterize_Effect_Setting",
      action: "Live Rasterize Effect Setting",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Document Raster Effects Settings...",
        de: "Effekt > Dokument-Rastereffekt-Einstellungen \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u0440\u0430\u0441\u0442\u0440\u043e\u0432\u044b\u0445 \u044d\u0444\u0444\u0435\u043a\u0442\u043e\u0432 \u0432 \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u0435...",
      },
      hidden: false,
    },
    menu_Live_Adobe_Geometry3D_Extrude: {
      id: "menu_Live_Adobe_Geometry3D_Extrude",
      action: "Live Adobe Geometry3D Extrude",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > 3D and Materials > Extrude & Bevel...",
        de: "Effekt > 3D und Materialien > Extrudieren und abgeflachte Kante \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > 3D \u0438 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b > \u0412\u044b\u0442\u044f\u0433\u0438\u0432\u0430\u043d\u0438\u0435 \u0438 \u0444\u0430\u0441\u043a\u0430...",
      },
      hidden: false,
      minVersion: 26,
    },
    menu_Live_Adobe_Geometry3D_Revolve: {
      id: "menu_Live_Adobe_Geometry3D_Revolve",
      action: "Live Adobe Geometry3D Revolve",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > 3D and Materials > Revolve...",
        de: "Effekt > 3D und Materialien > Kreiseln \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > 3D \u0438 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b > \u0412\u0440\u0430\u0449\u0435\u043d\u0438\u0435\u2026",
      },
      hidden: false,
      minVersion: 26,
    },
    menu_Live_Adobe_Geometry3D_Inflate: {
      id: "menu_Live_Adobe_Geometry3D_Inflate",
      action: "Live Adobe Geometry3D Inflate",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > 3D and Materials > Inflate...",
        de: "Effekt > 3D und Materialien > Aufblasen \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > 3D \u0438 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b > \u0420\u0430\u0437\u0434\u0443\u0432\u0430\u043d\u0438\u0435\u2026",
      },
      hidden: false,
      minVersion: 26,
    },
    menu_Live_Adobe_Geometry3D_Rotate: {
      id: "menu_Live_Adobe_Geometry3D_Rotate",
      action: "Live Adobe Geometry3D Rotate",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > 3D and Materials > Rotate...",
        de: "Effekt > 3D und Materialien > Drehen \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > 3D \u0438 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b > \u041f\u043e\u0432\u043e\u0440\u043e\u0442\u2026",
      },
      hidden: false,
      minVersion: 26,
    },
    menu_Live_Adobe_Geometry3D_Materials: {
      id: "menu_Live_Adobe_Geometry3D_Materials",
      action: "Live Adobe Geometry3D Materials",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > 3D and Materials > Materials...",
        de: "Effekt > 3D und Materialien > Materialien \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > 3D \u0438 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b > \u041c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b\u2026",
      },
      hidden: false,
      minVersion: 26,
    },
    menu_Live_3DExtrude: {
      id: "menu_Live_3DExtrude",
      action: "Live 3DExtrude",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > 3D and Materials > 3D (Classic) > Extrude & Bevel (Classic)...",
        de: "Effekt > 3D (klassisch) > Extrudieren und abgeflachte Kante (klassisch) \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > 3D (\u043a\u043b\u0430\u0441\u0441\u0438\u0447\u0435\u0441\u043a\u043e\u0435) > \u0412\u044b\u0442\u044f\u0433\u0438\u0432\u0430\u043d\u0438\u0435 \u0438 \u0444\u0430\u0441\u043a\u0430 (\u043a\u043b\u0430\u0441\u0441\u0438\u0447\u0435\u0441\u043a\u0438\u0439)\u2026",
      },
      hidden: false,
      minVersion: 26,
    },
    menu_Live_3DRevolve: {
      id: "menu_Live_3DRevolve",
      action: "Live 3DRevolve",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > 3D and Materials > 3D (Classic) > Revolve (Classic)...",
        de: "Effekt > 3D (klassisch) > Kreiseln (klassisch) \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > 3D (\u043a\u043b\u0430\u0441\u0441\u0438\u0447\u0435\u0441\u043a\u043e\u0435) > \u0412\u0440\u0430\u0449\u0435\u043d\u0438\u0435 (\u043a\u043b\u0430\u0441\u0441\u0438\u0447\u0435\u0441\u043a\u043e\u0435)\u2026",
      },
      hidden: false,
      minVersion: 26,
    },
    menu_Live_3DRotate: {
      id: "menu_Live_3DRotate",
      action: "Live 3DRotate",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > 3D and Materials > 3D (Classic) > Rotate (Classic)...",
        de: "Effekt > 3D (klassisch) > Drehen (klassisch) \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > 3D (\u043a\u043b\u0430\u0441\u0441\u0438\u0447\u0435\u0441\u043a\u043e\u0435) > \u041f\u043e\u0432\u043e\u0440\u043e\u0442 (\u043a\u043b\u0430\u0441\u0441\u0438\u0447\u0435\u0441\u043a\u0438\u0439)\u2026",
      },
      hidden: false,
      minVersion: 26,
    },
    menu_Live_Rectangle: {
      id: "menu_Live_Rectangle",
      action: "Live Rectangle",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Convert to Shape > Rectangle...",
        de: "Effekt > In Form umwandeln > Rechteck \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041f\u0440\u0435\u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u044c \u0432 \u0444\u0438\u0433\u0443\u0440\u0443> \u041f\u0440\u044f\u043c\u043e\u0443\u0433\u043e\u043b\u044c\u043d\u0438\u043a\u2026",
      },
      hidden: false,
    },
    menu_Live_Rounded_Rectangle: {
      id: "menu_Live_Rounded_Rectangle",
      action: "Live Rounded Rectangle",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Convert to Shape > Rounded Rectangle...",
        de: "Effekt > In Form umwandeln > Abgerundetes Rechteck \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041f\u0440\u0435\u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u044c \u0432 \u0444\u0438\u0433\u0443\u0440\u0443> \u041f\u0440\u044f\u043c\u043e\u0443\u0433\u043e\u043b\u044c\u043d\u0438\u043a \u0441\u043e \u0441\u043a\u0440\u0443\u0433\u043b\u0435\u043d\u043d\u044b\u043c\u0438 \u0443\u0433\u043b\u0430\u043c\u0438\u2026",
      },
      hidden: false,
    },
    menu_Live_Ellipse: {
      id: "menu_Live_Ellipse",
      action: "Live Ellipse",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Convert to Shape > Ellipse...",
        de: "Effekt > In Form umwandeln > Ellipse \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041f\u0440\u0435\u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u044c \u0432 \u0444\u0438\u0433\u0443\u0440\u0443> \u042d\u043b\u043b\u0438\u043f\u0441\u2026",
      },
      hidden: false,
    },
    menu_Live_Trim_Marks: {
      id: "menu_Live_Trim_Marks",
      action: "Live Trim Marks",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Crop Marks",
        de: "Effekt > Schnittmarken",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041c\u0435\u0442\u043a\u0438 \u043e\u0431\u0440\u0435\u0437\u043a\u0438",
      },
      hidden: false,
    },
    menu_Live_Free_Distort: {
      id: "menu_Live_Free_Distort",
      action: "Live Free Distort",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Distort & Transform > Free Distort...",
        de: "Effekt > Verzerrungs- und Transformationsfilter > Frei verzerren \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u0441\u043a\u0430\u0437\u0438\u0442\u044c \u0438 \u0442\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c > \u041f\u0440\u043e\u0438\u0437\u0432\u043e\u043b\u044c\u043d\u043e\u0435 \u0438\u0441\u043a\u0430\u0436\u0435\u043d\u0438\u0435...",
      },
      hidden: false,
    },
    "menu_Live_Pucker_&_Bloat": {
      id: "menu_Live_Pucker_&_Bloat",
      action: "Live Pucker & Bloat",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Distort & Transform > Pucker & Bloat...",
        de: "Effekt > Verzerrungs- und Transformationsfilter > Zusammenziehen und aufblasen \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u0441\u043a\u0430\u0437\u0438\u0442\u044c \u0438 \u0442\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c > \u0412\u0442\u044f\u0433\u0438\u0432\u0430\u043d\u0438\u0435 \u0438 \u0440\u0430\u0437\u0434\u0443\u0432\u0430\u043d\u0438\u0435...",
      },
      hidden: false,
    },
    menu_Live_Roughen: {
      id: "menu_Live_Roughen",
      action: "Live Roughen",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Distort & Transform > Roughen...",
        de: "Effekt > Verzerrungs- und Transformationsfilter > Aufrauen \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u0441\u043a\u0430\u0437\u0438\u0442\u044c \u0438 \u0442\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c > \u041e\u0433\u0440\u0443\u0431\u043b\u0435\u043d\u0438\u0435...",
      },
      hidden: false,
    },
    menu_Live_Transform: {
      id: "menu_Live_Transform",
      action: "Live Transform",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Distort & Transform > Transform...",
        de: "Effekt > Verzerrungs- und Transformationsfilter > Transformieren \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u0441\u043a\u0430\u0437\u0438\u0442\u044c \u0438 \u0442\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c > \u0422\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c...",
      },
      hidden: false,
    },
    menu_Live_Scribble_and_Tweak: {
      id: "menu_Live_Scribble_and_Tweak",
      action: "Live Scribble and Tweak",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Distort & Transform > Tweak...",
        de: "Effekt > Verzerrungs- und Transformationsfilter > Tweak \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u0441\u043a\u0430\u0437\u0438\u0442\u044c \u0438 \u0442\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c > \u041f\u043e\u043c\u0430\u0440\u043a\u0438...",
      },
      hidden: false,
    },
    menu_Live_Twist: {
      id: "menu_Live_Twist",
      action: "Live Twist",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Distort & Transform > Twist...",
        de: "Effekt > Verzerrungs- und Transformationsfilter > Wirbel \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u0441\u043a\u0430\u0437\u0438\u0442\u044c \u0438 \u0442\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c > \u0421\u043a\u0440\u0443\u0447\u0438\u0432\u0430\u043d\u0438\u0435...",
      },
      hidden: false,
    },
    menu_Live_Zig_Zag: {
      id: "menu_Live_Zig_Zag",
      action: "Live Zig Zag",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Distort & Transform > Zig Zag...",
        de: "Effekt > Verzerrungs- und Transformationsfilter > Zickzack \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u0441\u043a\u0430\u0437\u0438\u0442\u044c \u0438 \u0442\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u0442\u044c > \u0417\u0438\u0433\u0437\u0430\u0433...",
      },
      hidden: false,
    },
    menu_Live_Offset_Path: {
      id: "menu_Live_Offset_Path",
      action: "Live Offset Path",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Path > Offset Path...",
        de: "Effekt > Pfad > Pfad verschieben \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041a\u043e\u043d\u0442\u0443\u0440 > \u0421\u043e\u0437\u0434\u0430\u0442\u044c \u043f\u0430\u0440\u0430\u043b\u043b\u0435\u043b\u044c\u043d\u044b\u0439 \u043a\u043e\u043d\u0442\u0443\u0440...",
      },
      hidden: false,
    },
    menu_Live_Outline_Object: {
      id: "menu_Live_Outline_Object",
      action: "Live Outline Object",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Path > Outline Object",
        de: "Effekt > Pfad > Kontur nachzeichnen",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041a\u043e\u043d\u0442\u0443\u0440 > \u041a\u043e\u043d\u0442\u0443\u0440\u043d\u044b\u0439 \u043e\u0431\u044a\u0435\u043a\u0442",
      },
      hidden: false,
    },
    menu_Live_Outline_Stroke: {
      id: "menu_Live_Outline_Stroke",
      action: "Live Outline Stroke",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Path > Outline Stroke",
        de: "Effekt > Pfad > Konturlinie",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041a\u043e\u043d\u0442\u0443\u0440 > \u041f\u0440\u0435\u043e\u0431\u0440\u0430\u0437\u043e\u0432\u0430\u0442\u044c \u043e\u0431\u0432\u043e\u0434\u043a\u0443 \u0432 \u043a\u0440\u0438\u0432\u044b\u0435",
      },
      hidden: false,
    },
    menu_Live_Pathfinder_Add: {
      id: "menu_Live_Pathfinder_Add",
      action: "Live Pathfinder Add",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Pathfinder > Add",
        de: "Effekt > Pathfinder > Hinzuf\u00fcgen",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u043a\u043e\u043d\u0442\u0443\u0440\u043e\u0432 > \u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c",
      },
      hidden: false,
    },
    menu_Live_Pathfinder_Intersect: {
      id: "menu_Live_Pathfinder_Intersect",
      action: "Live Pathfinder Intersect",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Pathfinder > Intersect",
        de: "Effekt > Pathfinder > Schnittmenge bilden",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u043a\u043e\u043d\u0442\u0443\u0440\u043e\u0432 > \u041f\u0435\u0440\u0435\u0441\u0435\u0447\u0435\u043d\u0438\u0435",
      },
      hidden: false,
    },
    menu_Live_Pathfinder_Exclude: {
      id: "menu_Live_Pathfinder_Exclude",
      action: "Live Pathfinder Exclude",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Pathfinder > Exclude",
        de: "Effekt > Pathfinder > Schnittmenge entfernen",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u043a\u043e\u043d\u0442\u0443\u0440\u043e\u0432 > \u0418\u0441\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u0435",
      },
      hidden: false,
    },
    menu_Live_Pathfinder_Subtract: {
      id: "menu_Live_Pathfinder_Subtract",
      action: "Live Pathfinder Subtract",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Pathfinder > Subtract",
        de: "Effekt > Pathfinder > Subtrahieren",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u043a\u043e\u043d\u0442\u0443\u0440\u043e\u0432 > \u0412\u044b\u0447\u0438\u0442\u0430\u043d\u0438\u0435",
      },
      hidden: false,
    },
    menu_Live_Pathfinder_Minus_Back: {
      id: "menu_Live_Pathfinder_Minus_Back",
      action: "Live Pathfinder Minus Back",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Pathfinder > Minus Back",
        de: "Effekt > Pathfinder > Hinteres Objekt abziehen",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u043a\u043e\u043d\u0442\u0443\u0440\u043e\u0432 > \u041c\u0438\u043d\u0443\u0441 \u043d\u0438\u0436\u043d\u0438\u0439",
      },
      hidden: false,
    },
    menu_Live_Pathfinder_Divide: {
      id: "menu_Live_Pathfinder_Divide",
      action: "Live Pathfinder Divide",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Pathfinder > Divide",
        de: "Effekt > Pathfinder > Unterteilen",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u043a\u043e\u043d\u0442\u0443\u0440\u043e\u0432 > \u0420\u0430\u0437\u0434\u0435\u043b\u0435\u043d\u0438\u0435",
      },
      hidden: false,
    },
    menu_Live_Pathfinder_Trim: {
      id: "menu_Live_Pathfinder_Trim",
      action: "Live Pathfinder Trim",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Pathfinder > Trim",
        de: "Effekt > Pathfinder > \u00dcberlappungsbereich entfernen",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u043a\u043e\u043d\u0442\u0443\u0440\u043e\u0432 > \u041e\u0431\u0440\u0435\u0437\u043a\u0430",
      },
      hidden: false,
    },
    menu_Live_Pathfinder_Merge: {
      id: "menu_Live_Pathfinder_Merge",
      action: "Live Pathfinder Merge",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Pathfinder > Merge",
        de: "Effekt > Pathfinder > Verdeckte Fl\u00e4che entfernen",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u043a\u043e\u043d\u0442\u0443\u0440\u043e\u0432 > \u041e\u0431\u044a\u0435\u0434\u0438\u043d\u0435\u043d\u0438\u0435",
      },
      hidden: false,
    },
    menu_Live_Pathfinder_Crop: {
      id: "menu_Live_Pathfinder_Crop",
      action: "Live Pathfinder Crop",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Pathfinder > Crop",
        de: "Effekt > Pathfinder > Schnittmengenfl\u00e4che",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u043a\u043e\u043d\u0442\u0443\u0440\u043e\u0432 > \u041a\u0430\u0434\u0440\u0438\u0440\u043e\u0432\u0430\u0442\u044c",
      },
      hidden: false,
    },
    menu_Live_Pathfinder_Outline: {
      id: "menu_Live_Pathfinder_Outline",
      action: "Live Pathfinder Outline",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Pathfinder > Outline",
        de: "Effekt > Pathfinder > Kontur aufteilen",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u043a\u043e\u043d\u0442\u0443\u0440\u043e\u0432 > \u041a\u043e\u043d\u0442\u0443\u0440",
      },
      hidden: false,
    },
    menu_Live_Pathfinder_Hard_Mix: {
      id: "menu_Live_Pathfinder_Hard_Mix",
      action: "Live Pathfinder Hard Mix",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Pathfinder > Hard Mix",
        de: "Effekt > Pathfinder > Hart mischen",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u043a\u043e\u043d\u0442\u0443\u0440\u043e\u0432 > \u0416\u0435\u0441\u0442\u043a\u043e\u0435 \u0441\u043c\u0435\u0448\u0438\u0432\u0430\u043d\u0438\u0435",
      },
      hidden: false,
    },
    menu_Live_Pathfinder_Soft_Mix: {
      id: "menu_Live_Pathfinder_Soft_Mix",
      action: "Live Pathfinder Soft Mix",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Pathfinder > Soft Mix...",
        de: "Effekt > Pathfinder > Weich mischen \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u043a\u043e\u043d\u0442\u0443\u0440\u043e\u0432 > \u041d\u0435\u0436\u0435\u0441\u0442\u043a\u043e\u0435 \u0441\u043c\u0435\u0448\u0438\u0432\u0430\u043d\u0438\u0435...",
      },
      hidden: false,
    },
    menu_Live_Pathfinder_Trap: {
      id: "menu_Live_Pathfinder_Trap",
      action: "Live Pathfinder Trap",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Pathfinder > Trap...",
        de: "Effekt > Pathfinder > \u00dcberf\u00fcllen \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u043a\u043e\u043d\u0442\u0443\u0440\u043e\u0432 > \u0422\u0440\u0435\u043f\u043f\u0438\u043d\u0433\u2026",
      },
      hidden: false,
    },
    menu_Live_Rasterize: {
      id: "menu_Live_Rasterize",
      action: "Live Rasterize",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Rasterize...",
        de: "Effekt > In Pixelbild umwandeln \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0420\u0430\u0441\u0442\u0440\u0438\u0440\u043e\u0432\u0430\u0442\u044c...",
      },
      hidden: false,
    },
    menu_Live_Adobe_Drop_Shadow: {
      id: "menu_Live_Adobe_Drop_Shadow",
      action: "Live Adobe Drop Shadow",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Stylize > Drop Shadow...",
        de: "Effekt > Stilisierungsfilter > Schlagschatten \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0421\u0442\u0438\u043b\u0438\u0437\u0430\u0446\u0438\u044f > \u0422\u0435\u043d\u044c...",
      },
      hidden: false,
    },
    menu_Live_Feather: {
      id: "menu_Live_Feather",
      action: "Live Feather",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Stylize > Feather...",
        de: "Effekt > Stilisierungsfilter > Weiche Kante \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0421\u0442\u0438\u043b\u0438\u0437\u0430\u0446\u0438\u044f > \u0420\u0430\u0441\u0442\u0443\u0448\u0435\u0432\u043a\u0430...",
      },
      hidden: false,
    },
    menu_Live_Inner_Glow: {
      id: "menu_Live_Inner_Glow",
      action: "Live Inner Glow",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Stylize > Inner Glow...",
        de: "Effekt > Stilisierungsfilter > Schein nach innen \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0421\u0442\u0438\u043b\u0438\u0437\u0430\u0446\u0438\u044f > \u0412\u043d\u0443\u0442\u0440\u0435\u043d\u043d\u0435\u0435 \u0441\u0432\u0435\u0447\u0435\u043d\u0438\u0435...",
      },
      hidden: false,
    },
    menu_Live_Outer_Glow: {
      id: "menu_Live_Outer_Glow",
      action: "Live Outer Glow",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Stylize > Outer Glow...",
        de: "Effekt > Stilisierungsfilter > Schein nach au\u00dfen \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0421\u0442\u0438\u043b\u0438\u0437\u0430\u0446\u0438\u044f > \u0412\u043d\u0435\u0448\u043d\u0435\u0435 \u0441\u0432\u0435\u0447\u0435\u043d\u0438\u0435...",
      },
      hidden: false,
    },
    menu_Live_Adobe_Round_Corners: {
      id: "menu_Live_Adobe_Round_Corners",
      action: "Live Adobe Round Corners",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Stylize > Round Corners...",
        de: "Effekt > Stilisierungsfilter > Ecken abrunden \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0421\u0442\u0438\u043b\u0438\u0437\u0430\u0446\u0438\u044f > \u0421\u043a\u0440\u0443\u0433\u043b\u0435\u043d\u043d\u044b\u0435 \u0443\u0433\u043b\u044b...",
      },
      hidden: false,
    },
    menu_Live_Scribble_Fill: {
      id: "menu_Live_Scribble_Fill",
      action: "Live Scribble Fill",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Stylize > Scribble...",
        de: "Effekt > Stilisierungsfilter > Scribble \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0421\u0442\u0438\u043b\u0438\u0437\u0430\u0446\u0438\u044f > \u041a\u0430\u0440\u0430\u043a\u0443\u043b\u0438\u2026",
      },
      hidden: false,
    },
    menu_Live_SVG_Filters: {
      id: "menu_Live_SVG_Filters",
      action: "Live SVG Filters",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > SVG Filters > Apply SVG Filter...",
        de: "Effekt > SVG-Filter > SVG-Filter anwenden \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0424\u0438\u043b\u044c\u0442\u0440\u044b SVG > \u041f\u0440\u0438\u043c\u0435\u043d\u0438\u0442\u044c SVG-\u0444\u0438\u043b\u044c\u0442\u0440...",
      },
      hidden: false,
    },
    menu_SVG_Filter_Import: {
      id: "menu_SVG_Filter_Import",
      action: "SVG Filter Import",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > SVG Filters > Import SVG Filter...",
        de: "Effekt > SVG-Filter > SVG-Filter importieren \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0424\u0438\u043b\u044c\u0442\u0440\u044b SVG > \u0418\u043c\u043f\u043e\u0440\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0444\u0438\u043b\u044c\u0442\u0440 SVG...",
      },
      hidden: false,
    },
    menu_Live_Deform_Arc: {
      id: "menu_Live_Deform_Arc",
      action: "Live Deform Arc",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Warp > Arc...",
        de: "Effekt > Verkr\u00fcmmungsfilter > Bogen \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0414\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f > \u0414\u0443\u0433\u0430\u2026",
      },
      hidden: false,
    },
    menu_Live_Deform_Arc_Lower: {
      id: "menu_Live_Deform_Arc_Lower",
      action: "Live Deform Arc Lower",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Warp > Arc Lower...",
        de: "Effekt > Verkr\u00fcmmungsfilter > Bogen unten \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0414\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f > \u0414\u0443\u0433\u0430 \u0432\u043d\u0438\u0437\u2026",
      },
      hidden: false,
    },
    menu_Live_Deform_Arc_Upper: {
      id: "menu_Live_Deform_Arc_Upper",
      action: "Live Deform Arc Upper",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Warp > Arc Upper...",
        de: "Effekt > Verkr\u00fcmmungsfilter > Bogen oben \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0414\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f > \u0414\u0443\u0433\u0430 \u0432\u0432\u0435\u0440\u0445\u2026",
      },
      hidden: false,
    },
    menu_Live_Deform_Arch: {
      id: "menu_Live_Deform_Arch",
      action: "Live Deform Arch",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Warp > Arch...",
        de: "Effekt > Verkr\u00fcmmungsfilter > Torbogen \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0414\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f > \u0410\u0440\u043a\u0430\u2026",
      },
      hidden: false,
    },
    menu_Live_Deform_Bulge: {
      id: "menu_Live_Deform_Bulge",
      action: "Live Deform Bulge",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Warp > Bulge...",
        de: "Effekt > Verkr\u00fcmmungsfilter > Wulst \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0414\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f > \u0412\u044b\u043f\u0443\u043a\u043b\u043e\u0441\u0442\u044c\u2026",
      },
      hidden: false,
    },
    menu_Live_Deform_Shell_Lower: {
      id: "menu_Live_Deform_Shell_Lower",
      action: "Live Deform Shell Lower",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Warp > Shell Lower...",
        de: "Effekt > Verkr\u00fcmmungsfilter > Muschel unten \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0414\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f > \u041f\u0430\u043d\u0446\u0438\u0440\u044c \u0432\u043d\u0438\u0437\u2026",
      },
      hidden: false,
    },
    menu_Live_Deform_Shell_Upper: {
      id: "menu_Live_Deform_Shell_Upper",
      action: "Live Deform Shell Upper",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Warp > Shell Upper...",
        de: "Effekt > Verkr\u00fcmmungsfilter > Muschel oben \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0414\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f > \u041f\u0430\u043d\u0446\u0438\u0440\u044c \u0432\u0432\u0435\u0440\u0445\u2026",
      },
      hidden: false,
    },
    menu_Live_Deform_Flag: {
      id: "menu_Live_Deform_Flag",
      action: "Live Deform Flag",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Warp > Flag...",
        de: "Effekt > Verkr\u00fcmmungsfilter > Flagge \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0414\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f > \u0424\u043b\u0430\u0433\u2026",
      },
      hidden: false,
    },
    menu_Live_Deform_Wave: {
      id: "menu_Live_Deform_Wave",
      action: "Live Deform Wave",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Warp > Wave...",
        de: "Effekt > Verkr\u00fcmmungsfilter > Schwingungen \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0414\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f > \u0412\u043e\u043b\u043d\u0430\u2026",
      },
      hidden: false,
    },
    menu_Live_Deform_Fish: {
      id: "menu_Live_Deform_Fish",
      action: "Live Deform Fish",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Warp > Fish...",
        de: "Effekt > Verkr\u00fcmmungsfilter > Fisch \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0414\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f > \u0420\u044b\u0431\u0430\u2026",
      },
      hidden: false,
    },
    menu_Live_Deform_Rise: {
      id: "menu_Live_Deform_Rise",
      action: "Live Deform Rise",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Warp > Rise...",
        de: "Effekt > Verkr\u00fcmmungsfilter > Ansteigend \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0414\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f > \u041f\u043e\u0434\u044a\u0435\u043c\u2026",
      },
      hidden: false,
    },
    menu_Live_Deform_Fisheye: {
      id: "menu_Live_Deform_Fisheye",
      action: "Live Deform Fisheye",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Warp > Fisheye...",
        de: "Effekt > Verkr\u00fcmmungsfilter > Fischauge \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0414\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f > \u0420\u044b\u0431\u0438\u0439 \u0433\u043b\u0430\u0437\u2026",
      },
      hidden: false,
    },
    menu_Live_Deform_Inflate: {
      id: "menu_Live_Deform_Inflate",
      action: "Live Deform Inflate",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Warp > Inflate...",
        de: "Effekt > Verkr\u00fcmmungsfilter > Aufblasen \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0414\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f > \u0420\u0430\u0437\u0434\u0443\u0432\u0430\u043d\u0438\u0435\u2026",
      },
      hidden: false,
    },
    menu_Live_Deform_Squeeze: {
      id: "menu_Live_Deform_Squeeze",
      action: "Live Deform Squeeze",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Warp > Squeeze...",
        de: "Effekt > Verkr\u00fcmmungsfilter > Stauchen \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0414\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f > \u0421\u0436\u0430\u0442\u0438\u0435\u2026",
      },
      hidden: false,
    },
    menu_Live_Deform_Twist: {
      id: "menu_Live_Deform_Twist",
      action: "Live Deform Twist",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Warp > Twist...",
        de: "Effekt > Verkr\u00fcmmungsfilter > Wirbel \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0414\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f > \u0421\u043a\u0440\u0443\u0447\u0438\u0432\u0430\u043d\u0438\u0435\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_GEfc: {
      id: "menu_Live_PSAdapter_plugin_GEfc",
      action: "Live PSAdapter_plugin_GEfc",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Effect Gallery...",
        de: "Effekt > Effekte-Galerie \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0413\u0430\u043b\u0435\u0440\u0435\u044f \u044d\u0444\u0444\u0435\u043a\u0442\u043e\u0432\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_ClrP: {
      id: "menu_Live_PSAdapter_plugin_ClrP",
      action: "Live PSAdapter_plugin_ClrP",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Artistic > Colored Pencil...",
        de: "Effekt > Kunstfilter > Buntstiftschraffur \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u043c\u0438\u0442\u0430\u0446\u0438\u044f > \u0426\u0432\u0435\u0442\u043d\u044b\u0435 \u043a\u0430\u0440\u0430\u043d\u0434\u0430\u0448\u0438\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_Ct: {
      id: "menu_Live_PSAdapter_plugin_Ct",
      action: "Live PSAdapter_plugin_Ct",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Artistic > Cutout...",
        de: "Effekt > Kunstfilter > Farbpapier-Collage \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u043c\u0438\u0442\u0430\u0446\u0438\u044f > \u0410\u043f\u043f\u043b\u0438\u043a\u0430\u0446\u0438\u044f\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_DryB: {
      id: "menu_Live_PSAdapter_plugin_DryB",
      action: "Live PSAdapter_plugin_DryB",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Artistic > Dry Brush...",
        de: "Effekt > Kunstfilter > Grobe Malerei \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u043c\u0438\u0442\u0430\u0446\u0438\u044f > \u0421\u0443\u0445\u0430\u044f \u043a\u0438\u0441\u0442\u044c\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_FlmG: {
      id: "menu_Live_PSAdapter_plugin_FlmG",
      action: "Live PSAdapter_plugin_FlmG",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Artistic > Film Grain...",
        de: "Effekt > Kunstfilter > K\u00f6rnung & Aufhellung \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u043c\u0438\u0442\u0430\u0446\u0438\u044f > \u0417\u0435\u0440\u043d\u0438\u0441\u0442\u043e\u0441\u0442\u044c \u043f\u043b\u0435\u043d\u043a\u0438\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_Frsc: {
      id: "menu_Live_PSAdapter_plugin_Frsc",
      action: "Live PSAdapter_plugin_Frsc",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Artistic > Fresco...",
        de: "Effekt > Kunstfilter > Fresko \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u043c\u0438\u0442\u0430\u0446\u0438\u044f > \u0424\u0440\u0435\u0441\u043a\u0430\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_NGlw: {
      id: "menu_Live_PSAdapter_plugin_NGlw",
      action: "Live PSAdapter_plugin_NGlw",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Artistic > Neon Glow...",
        de: "Effekt > Kunstfilter > Neonschein \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u043c\u0438\u0442\u0430\u0446\u0438\u044f > \u041d\u0435\u043e\u043d\u043e\u0432\u044b\u0439 \u0441\u0432\u0435\u0442\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_PntD: {
      id: "menu_Live_PSAdapter_plugin_PntD",
      action: "Live PSAdapter_plugin_PntD",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Artistic > Paint Daubs...",
        de: "Effekt > Kunstfilter > \u00d6lfarbe getupft \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u043c\u0438\u0442\u0430\u0446\u0438\u044f > \u041c\u0430\u0441\u043b\u044f\u043d\u0430\u044f \u0436\u0438\u0432\u043e\u043f\u0438\u0441\u044c\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_PltK: {
      id: "menu_Live_PSAdapter_plugin_PltK",
      action: "Live PSAdapter_plugin_PltK",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Artistic > Palette Knife...",
        de: "Effekt > Kunstfilter > Malmesser \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u043c\u0438\u0442\u0430\u0446\u0438\u044f > \u0428\u043f\u0430\u0442\u0435\u043b\u044c\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_PlsW: {
      id: "menu_Live_PSAdapter_plugin_PlsW",
      action: "Live PSAdapter_plugin_PlsW",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Artistic > Plastic Wrap...",
        de: "Effekt > Kunstfilter > Kunststofffolie \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u043c\u0438\u0442\u0430\u0446\u0438\u044f > \u0426\u0435\u043b\u043b\u043e\u0444\u0430\u043d\u043e\u0432\u0430\u044f \u0443\u043f\u0430\u043a\u043e\u0432\u043a\u0430\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_PstE: {
      id: "menu_Live_PSAdapter_plugin_PstE",
      action: "Live PSAdapter_plugin_PstE",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Artistic > Poster Edges...",
        de: "Effekt > Kunstfilter > Tontrennung & Kantenbetonung \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u043c\u0438\u0442\u0430\u0446\u0438\u044f > \u041e\u0447\u0435\u0440\u0447\u0435\u043d\u043d\u044b\u0435 \u043a\u0440\u0430\u044f\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_RghP: {
      id: "menu_Live_PSAdapter_plugin_RghP",
      action: "Live PSAdapter_plugin_RghP",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Artistic > Rough Pastels...",
        de: "Effekt > Kunstfilter > Grobes Pastell \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u043c\u0438\u0442\u0430\u0446\u0438\u044f > \u041f\u0430\u0441\u0442\u0435\u043b\u044c\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_SmdS: {
      id: "menu_Live_PSAdapter_plugin_SmdS",
      action: "Live PSAdapter_plugin_SmdS",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Artistic > Smudge Stick...",
        de: "Effekt > Kunstfilter > Diagonal verwischen \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u043c\u0438\u0442\u0430\u0446\u0438\u044f > \u0420\u0430\u0441\u0442\u0443\u0448\u0435\u0432\u043a\u0430\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_Spng: {
      id: "menu_Live_PSAdapter_plugin_Spng",
      action: "Live PSAdapter_plugin_Spng",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Artistic > Sponge...",
        de: "Effekt > Kunstfilter > Schwamm \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u043c\u0438\u0442\u0430\u0446\u0438\u044f > \u0413\u0443\u0431\u043a\u0430\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_Undr: {
      id: "menu_Live_PSAdapter_plugin_Undr",
      action: "Live PSAdapter_plugin_Undr",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Artistic > Underpainting...",
        de: "Effekt > Kunstfilter > Malgrund \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u043c\u0438\u0442\u0430\u0446\u0438\u044f > \u0420\u0438\u0441\u043e\u0432\u0430\u043d\u0438\u0435 \u043d\u0430 \u043e\u0431\u043e\u0440\u043e\u0442\u0435\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_Wtrc: {
      id: "menu_Live_PSAdapter_plugin_Wtrc",
      action: "Live PSAdapter_plugin_Wtrc",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Artistic > Watercolor...",
        de: "Effekt > Kunstfilter > Aquarell \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u043c\u0438\u0442\u0430\u0446\u0438\u044f > \u0410\u043a\u0432\u0430\u0440\u0435\u043b\u044c\u2026",
      },
      hidden: false,
    },
    menu_Live_Adobe_PSL_Gaussian_Blur: {
      id: "menu_Live_Adobe_PSL_Gaussian_Blur",
      action: "Live Adobe PSL Gaussian Blur",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Blur > Gaussian Blur...",
        de: "Effekt > Weichzeichnungsfilter > Gau\u00dfscher Weichzeichner \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0420\u0430\u0437\u043c\u044b\u0442\u0438\u0435 > \u0420\u0430\u0437\u043c\u044b\u0442\u0438\u0435 \u043f\u043e \u0413\u0430\u0443\u0441\u0441\u0443...",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_RdlB: {
      id: "menu_Live_PSAdapter_plugin_RdlB",
      action: "Live PSAdapter_plugin_RdlB",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Blur > Radial Blur...",
        de: "Effekt > Weichzeichnungsfilter > Radialer Weichzeichner \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0420\u0430\u0437\u043c\u044b\u0442\u0438\u0435 > \u0420\u0430\u0434\u0438\u0430\u043b\u044c\u043d\u043e\u0435 \u0440\u0430\u0437\u043c\u044b\u0442\u0438\u0435...",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_SmrB: {
      id: "menu_Live_PSAdapter_plugin_SmrB",
      action: "Live PSAdapter_plugin_SmrB",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Blur > Smart Blur...",
        de: "Effekt > Weichzeichnungsfilter > Selektiver Weichzeichner \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0420\u0430\u0437\u043c\u044b\u0442\u0438\u0435 > \u0423\u043c\u043d\u043e\u0435 \u0440\u0430\u0437\u043c\u044b\u0442\u0438\u0435...",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_AccE: {
      id: "menu_Live_PSAdapter_plugin_AccE",
      action: "Live PSAdapter_plugin_AccE",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Brush Strokes > Accented Edges...",
        de: "Effekt > Malfilter > Kanten betonen \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0428\u0442\u0440\u0438\u0445\u0438 > \u0410\u043a\u0446\u0435\u043d\u0442 \u043d\u0430 \u043a\u0440\u0430\u044f\u0445\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_AngS: {
      id: "menu_Live_PSAdapter_plugin_AngS",
      action: "Live PSAdapter_plugin_AngS",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Brush Strokes > Angled Strokes...",
        de: "Effekt > Malfilter > Gekreuzte Malstriche \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0428\u0442\u0440\u0438\u0445\u0438 > \u041d\u0430\u043a\u043b\u043e\u043d\u043d\u044b\u0435 \u0448\u0442\u0440\u0438\u0445\u0438\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_Crsh: {
      id: "menu_Live_PSAdapter_plugin_Crsh",
      action: "Live PSAdapter_plugin_Crsh",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Brush Strokes > Crosshatch...",
        de: "Effekt > Malfilter > Kreuzschraffur \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0428\u0442\u0440\u0438\u0445\u0438 > \u041f\u0435\u0440\u0435\u043a\u0440\u0435\u0441\u0442\u043d\u044b\u0435 \u0448\u0442\u0440\u0438\u0445\u0438\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_DrkS: {
      id: "menu_Live_PSAdapter_plugin_DrkS",
      action: "Live PSAdapter_plugin_DrkS",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Brush Strokes > Dark Strokes...",
        de: "Effekt > Malfilter > Dunkle Malstriche \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0428\u0442\u0440\u0438\u0445\u0438 > \u0422\u0435\u043c\u043d\u044b\u0435 \u0448\u0442\u0440\u0438\u0445\u0438\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_InkO: {
      id: "menu_Live_PSAdapter_plugin_InkO",
      action: "Live PSAdapter_plugin_InkO",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Brush Strokes > Ink Outlines...",
        de: "Effekt > Malfilter > Konturen mit Tinte nachzeichnen \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0428\u0442\u0440\u0438\u0445\u0438 > \u041e\u0431\u0432\u043e\u0434\u043a\u0430\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_Spt: {
      id: "menu_Live_PSAdapter_plugin_Spt",
      action: "Live PSAdapter_plugin_Spt",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Brush Strokes > Spatter...",
        de: "Effekt > Malfilter > Spritzer \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0428\u0442\u0440\u0438\u0445\u0438 > \u0420\u0430\u0437\u0431\u0440\u044b\u0437\u0433\u0438\u0432\u0430\u043d\u0438\u0435\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_SprS: {
      id: "menu_Live_PSAdapter_plugin_SprS",
      action: "Live PSAdapter_plugin_SprS",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Brush Strokes > Sprayed Strokes...",
        de: "Effekt > Malfilter > Verwackelte Striche \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0428\u0442\u0440\u0438\u0445\u0438 > \u0410\u044d\u0440\u043e\u0433\u0440\u0430\u0444\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_Smie: {
      id: "menu_Live_PSAdapter_plugin_Smie",
      action: "Live PSAdapter_plugin_Smie",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Brush Strokes > Sumi-e...",
        de: "Effekt > Malfilter > Sumi-e \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0428\u0442\u0440\u0438\u0445\u0438 > \u0421\u0443\u043c\u0438-\u044d\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_DfsG: {
      id: "menu_Live_PSAdapter_plugin_DfsG",
      action: "Live PSAdapter_plugin_DfsG",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Distort > Diffuse Glow...",
        de: "Effekt > Verzerrungsfilter > Weiches Licht \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u0441\u043a\u0430\u0436\u0435\u043d\u0438\u0435 > \u0420\u0430\u0441\u0441\u0435\u044f\u043d\u043d\u043e\u0435 \u0441\u0432\u0435\u0447\u0435\u043d\u0438\u0435\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_Gls: {
      id: "menu_Live_PSAdapter_plugin_Gls",
      action: "Live PSAdapter_plugin_Gls",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Distort > Glass...",
        de: "Effekt > Verzerrungsfilter > Glas \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u0441\u043a\u0430\u0436\u0435\u043d\u0438\u0435 > \u0421\u0442\u0435\u043a\u043b\u043e\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_OcnR: {
      id: "menu_Live_PSAdapter_plugin_OcnR",
      action: "Live PSAdapter_plugin_OcnR",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Distort > Ocean Ripple...",
        de: "Effekt > Verzerrungsfilter > Ozeanwellen \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0418\u0441\u043a\u0430\u0436\u0435\u043d\u0438\u0435 > \u041e\u043a\u0435\u0430\u043d\u0441\u043a\u0438\u0435 \u0432\u043e\u043b\u043d\u044b\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_ClrH: {
      id: "menu_Live_PSAdapter_plugin_ClrH",
      action: "Live PSAdapter_plugin_ClrH",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Pixelate > Color Halftone...",
        de: "Effekt > Vergr\u00f6berungsfilter > Farbraster \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041e\u0444\u043e\u0440\u043c\u043b\u0435\u043d\u0438\u0435 > \u0426\u0432\u0435\u0442\u043d\u044b\u0435 \u043f\u043e\u043b\u0443\u0442\u043e\u043d\u0430\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_Crst: {
      id: "menu_Live_PSAdapter_plugin_Crst",
      action: "Live PSAdapter_plugin_Crst",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Pixelate > Crystallize...",
        de: "Effekt > Vergr\u00f6berungsfilter > Kristallisieren \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041e\u0444\u043e\u0440\u043c\u043b\u0435\u043d\u0438\u0435 > \u041a\u0440\u0438\u0441\u0442\u0430\u043b\u043b\u0438\u0437\u0430\u0446\u0438\u044f\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_Mztn: {
      id: "menu_Live_PSAdapter_plugin_Mztn",
      action: "Live PSAdapter_plugin_Mztn",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Pixelate > Mezzotint...",
        de: "Effekt > Vergr\u00f6berungsfilter > Mezzotint \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041e\u0444\u043e\u0440\u043c\u043b\u0435\u043d\u0438\u0435 > \u041c\u0435\u0446\u0446\u043e-\u0442\u0438\u043d\u0442\u043e\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_Pntl: {
      id: "menu_Live_PSAdapter_plugin_Pntl",
      action: "Live PSAdapter_plugin_Pntl",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Pixelate > Pointillize...",
        de: "Effekt > Vergr\u00f6berungsfilter > Punktieren \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u041e\u0444\u043e\u0440\u043c\u043b\u0435\u043d\u0438\u0435 > \u041f\u0443\u0430\u043d\u0442\u0438\u043b\u0438\u0437\u043c\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_BsRl: {
      id: "menu_Live_PSAdapter_plugin_BsRl",
      action: "Live PSAdapter_plugin_BsRl",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Sketch > Bas Relief...",
        de: "Effekt > Zeichenfilter > Basrelief \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u042d\u0441\u043a\u0438\u0437 > \u0420\u0435\u043b\u044c\u0435\u0444\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_ChlC: {
      id: "menu_Live_PSAdapter_plugin_ChlC",
      action: "Live PSAdapter_plugin_ChlC",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Sketch > Chalk & Charcoal...",
        de: "Effekt > Zeichenfilter > Chalk & Charcoal \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u042d\u0441\u043a\u0438\u0437 > \u041c\u0435\u043b \u0438 \u0443\u0433\u043e\u043b\u044c\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_Chrc: {
      id: "menu_Live_PSAdapter_plugin_Chrc",
      action: "Live PSAdapter_plugin_Chrc",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Sketch > Charcoal...",
        de: "Effekt > Zeichenfilter > Kohleumsetzung \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u042d\u0441\u043a\u0438\u0437 > \u0423\u0433\u043e\u043b\u044c\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_Chrm: {
      id: "menu_Live_PSAdapter_plugin_Chrm",
      action: "Live PSAdapter_plugin_Chrm",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Sketch > Chrome...",
        de: "Effekt > Zeichenfilter > Chrom \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u042d\u0441\u043a\u0438\u0437 > \u0425\u0440\u043e\u043c\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_CntC: {
      id: "menu_Live_PSAdapter_plugin_CntC",
      action: "Live PSAdapter_plugin_CntC",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Sketch > Cont\u00e9 Crayon...",
        de: "Effekt > Zeichenfilter > Cont\\u00E9-Stifte \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u042d\u0441\u043a\u0438\u0437 > \u0412\u043e\u043b\u0448\u0435\u0431\u043d\u044b\u0439 \u043a\u0430\u0440\u0430\u043d\u0434\u0430\u0448\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_GraP: {
      id: "menu_Live_PSAdapter_plugin_GraP",
      action: "Live PSAdapter_plugin_GraP",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Sketch > Graphic Pen...",
        de: "Effekt > Zeichenfilter > Strichumsetzung \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u042d\u0441\u043a\u0438\u0437 > \u0422\u0443\u0448\u044c\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_HlfS: {
      id: "menu_Live_PSAdapter_plugin_HlfS",
      action: "Live PSAdapter_plugin_HlfS",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Sketch > Halftone Pattern...",
        de: "Effekt > Zeichenfilter > Rasterungseffekt \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u042d\u0441\u043a\u0438\u0437 > \u041f\u043e\u043b\u0443\u0442\u043e\u043d\u043e\u0432\u044b\u0439 \u0443\u0437\u043e\u0440\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_NtPr: {
      id: "menu_Live_PSAdapter_plugin_NtPr",
      action: "Live PSAdapter_plugin_NtPr",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Sketch > Note Paper...",
        de: "Effekt > Zeichenfilter > Pr\u00e4gepapier \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u042d\u0441\u043a\u0438\u0437 > \u041f\u043e\u0447\u0442\u043e\u0432\u0430\u044f \u0431\u0443\u043c\u0430\u0433\u0430\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_Phtc: {
      id: "menu_Live_PSAdapter_plugin_Phtc",
      action: "Live PSAdapter_plugin_Phtc",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Sketch > Photocopy...",
        de: "Effekt > Zeichenfilter > Fotokopie \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u042d\u0441\u043a\u0438\u0437 > \u041a\u0441\u0435\u0440\u043e\u043a\u043e\u043f\u0438\u044f\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_Plst: {
      id: "menu_Live_PSAdapter_plugin_Plst",
      action: "Live PSAdapter_plugin_Plst",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Sketch > Plaster...",
        de: "Effekt > Zeichenfilter > Stuck \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u042d\u0441\u043a\u0438\u0437 > \u0413\u0438\u043f\u0441\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_Rtcl: {
      id: "menu_Live_PSAdapter_plugin_Rtcl",
      action: "Live PSAdapter_plugin_Rtcl",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Sketch > Reticulation...",
        de: "Effekt > Zeichenfilter > Punktierstich \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u042d\u0441\u043a\u0438\u0437 > \u0420\u0435\u0442\u0438\u043a\u0443\u043b\u044f\u0446\u0438\u044f\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_Stmp: {
      id: "menu_Live_PSAdapter_plugin_Stmp",
      action: "Live PSAdapter_plugin_Stmp",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Sketch > Stamp...",
        de: "Effekt > Zeichenfilter > Stempel \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u042d\u0441\u043a\u0438\u0437 > \u041b\u0438\u043d\u043e\u0433\u0440\u0430\u0432\u044e\u0440\u0430\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_TrnE: {
      id: "menu_Live_PSAdapter_plugin_TrnE",
      action: "Live PSAdapter_plugin_TrnE",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Sketch > Torn Edges...",
        de: "Effekt > Zeichenfilter > Gerissene Kanten \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u042d\u0441\u043a\u0438\u0437 > \u0420\u0432\u0430\u043d\u044b\u0435 \u043a\u0440\u0430\u044f\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_WtrP: {
      id: "menu_Live_PSAdapter_plugin_WtrP",
      action: "Live PSAdapter_plugin_WtrP",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Sketch > Water Paper...",
        de: "Effekt > Zeichenfilter > Feuchtes Papier \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u042d\u0441\u043a\u0438\u0437 > \u041c\u043e\u043a\u0440\u0430\u044f \u0431\u0443\u043c\u0430\u0433\u0430\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_GlwE: {
      id: "menu_Live_PSAdapter_plugin_GlwE",
      action: "Live PSAdapter_plugin_GlwE",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Stylize > Glowing Edges...",
        de: "Effekt > Stilisierungsfilter > Leuchtende Konturen \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0421\u0442\u0438\u043b\u0438\u0437\u0430\u0446\u0438\u044f > \u0421\u0432\u0435\u0447\u0435\u043d\u0438\u0435 \u043a\u0440\u0430\u0435\u0432\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_Crql: {
      id: "menu_Live_PSAdapter_plugin_Crql",
      action: "Live PSAdapter_plugin_Crql",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Texture > Craquelure...",
        de: "Effekt > Strukturierungsfilter > Risse \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0422\u0435\u043a\u0441\u0442\u0443\u0440\u0430 > \u041a\u0440\u0430\u043a\u0435\u043b\u044e\u0440\u044b\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_Grn: {
      id: "menu_Live_PSAdapter_plugin_Grn",
      action: "Live PSAdapter_plugin_Grn",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Texture > Grain...",
        de: "Effekt > Strukturierungsfilter > K\u00f6rnung \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0422\u0435\u043a\u0441\u0442\u0443\u0440\u0430 > \u0417\u0435\u0440\u043d\u043e\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_MscT: {
      id: "menu_Live_PSAdapter_plugin_MscT",
      action: "Live PSAdapter_plugin_MscT",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Texture > Mosaic Tiles...",
        de: "Effekt > Strukturierungsfilter > Kacheln \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0422\u0435\u043a\u0441\u0442\u0443\u0440\u0430 > \u041c\u043e\u0437\u0430\u0438\u0447\u043d\u044b\u0435 \u0444\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u044b\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_Ptch: {
      id: "menu_Live_PSAdapter_plugin_Ptch",
      action: "Live PSAdapter_plugin_Ptch",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Texture > Patchwork...",
        de: "Effekt > Strukturierungsfilter > Patchwork \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0422\u0435\u043a\u0441\u0442\u0443\u0440\u0430 > \u0426\u0432\u0435\u0442\u043d\u0430\u044f \u043f\u043b\u0438\u0442\u043a\u0430\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_StnG: {
      id: "menu_Live_PSAdapter_plugin_StnG",
      action: "Live PSAdapter_plugin_StnG",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Texture > Stained Glass...",
        de: "Effekt > Strukturierungsfilter > Buntglas-Mosaik \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0422\u0435\u043a\u0441\u0442\u0443\u0440\u0430 > \u0412\u0438\u0442\u0440\u0430\u0436\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_Txtz: {
      id: "menu_Live_PSAdapter_plugin_Txtz",
      action: "Live PSAdapter_plugin_Txtz",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Texture > Texturizer...",
        de: "Effekt > Strukturierungsfilter > Mit Struktur versehen \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0422\u0435\u043a\u0441\u0442\u0443\u0440\u0430 > \u0422\u0435\u043a\u0441\u0442\u0443\u0440\u0438\u0437\u0430\u0442\u043e\u0440\u2026",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_Dntr: {
      id: "menu_Live_PSAdapter_plugin_Dntr",
      action: "Live PSAdapter_plugin_Dntr",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Video > De-Interlace...",
        de: "Effekt > Videofilter > De-Interlace \u2026",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0412\u0438\u0434\u0435\u043e > \u0423\u0441\u0442\u0440\u0430\u043d\u0435\u043d\u0438\u0435 \u0447\u0435\u0440\u0435\u0441\u0441\u0442\u0440\u043e\u0447\u043d\u043e\u0439 \u0440\u0430\u0437\u0432\u0435\u0440\u0442\u043a\u0438...",
      },
      hidden: false,
    },
    menu_Live_PSAdapter_plugin_NTSC: {
      id: "menu_Live_PSAdapter_plugin_NTSC",
      action: "Live PSAdapter_plugin_NTSC",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Effect > Video > NTSC Colors",
        de: "Effekt > Videofilter > NTSC-Farben",
        ru: "\u042d\u0444\u0444\u0435\u043a\u0442 > \u0412\u0438\u0434\u0435\u043e > \u0426\u0432\u0435\u0442\u0430 NTSC",
      },
      hidden: false,
    },
    menu_preview: {
      id: "menu_preview",
      action: "preview",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > Outline / Preview",
        de: "Ansicht > Vorschau / Pfadansicht",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041a\u043e\u043d\u0442\u0443\u0440\u044b / \u0418\u043b\u043b\u044e\u0441\u0442\u0440\u0430\u0446\u0438\u044f",
      },
      hidden: false,
    },
    menu_GPU_Preview: {
      id: "menu_GPU_Preview",
      action: "GPU Preview",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > GPU Preview / Preview on CPU",
        de: "Ansicht > Mit GPU anzeigen / Mit CPU anzeigen",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 \u0441 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u0435\u043c \u0426\u041f / \u0413\u041f",
      },
      hidden: false,
    },
    menu_ink: {
      id: "menu_ink",
      action: "ink",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > Overprint Preview",
        de: "Ansicht > \u00dcberdruckenvorschau",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 \u043d\u0430\u043b\u043e\u0436\u0435\u043d\u0438\u044f \u0446\u0432\u0435\u0442\u043e\u0432",
      },
      hidden: false,
    },
    menu_raster: {
      id: "menu_raster",
      action: "raster",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > Pixel Preview",
        de: "Ansicht > Pixelvorschau",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 \u0432 \u0432\u0438\u0434\u0435 \u043f\u0438\u043a\u0441\u0435\u043b\u043e\u0432",
      },
      hidden: false,
    },
    "menu_proof-document": {
      id: "menu_proof-document",
      action: "proof-document",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > Proof Setup > Working CMYK",
        de: "Ansicht > Proof einrichten > Dokument-CMYK",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u0446\u0432\u0435\u0442\u043e\u043f\u0440\u043e\u0431\u044b > \u0420\u0430\u0431\u043e\u0447\u0435\u0435 \u043f\u0440\u043e\u0441\u0442\u0440\u0430\u043d\u0441\u0442\u0432\u043e CMYK",
      },
      hidden: false,
    },
    "menu_proof-mac-rgb": {
      id: "menu_proof-mac-rgb",
      action: "proof-mac-rgb",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > Proof Setup > Legacy Macintosh RGB (Gamma 1.8)",
        de: "Ansicht > Proof einrichten > Altes Macintosh-RGB (Gamma 1.8)",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u0446\u0432\u0435\u0442\u043e\u043f\u0440\u043e\u0431\u044b > \u0420\u0430\u043d\u043d\u044f\u044f \u0432\u0435\u0440\u0441\u0438\u044f Macintosh RGB (Gamma 1.8)",
      },
      hidden: false,
    },
    "menu_proof-win-rgb": {
      id: "menu_proof-win-rgb",
      action: "proof-win-rgb",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > Proof Setup > Internet Standard RGB (sRGB)",
        de: "Ansicht > Proof einrichten > Internet-Standard-RGB (sRGB)",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u0446\u0432\u0435\u0442\u043e\u043f\u0440\u043e\u0431\u044b > \u0421\u0442\u0430\u043d\u0434\u0430\u0440\u0442\u043d\u0430\u044f \u043f\u0430\u043b\u0438\u0442\u0440\u0430 RGB (sRGB) \u0434\u043b\u044f \u0441\u0435\u0442\u0438 \u0418\u043d\u0442\u0435\u0440\u043d\u0435\u0442",
      },
      hidden: false,
    },
    "menu_proof-monitor-rgb": {
      id: "menu_proof-monitor-rgb",
      action: "proof-monitor-rgb",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > Proof Setup > Monitor RGB",
        de: "Ansicht > Proof einrichten > Monitor-RGB",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u0446\u0432\u0435\u0442\u043e\u043f\u0440\u043e\u0431\u044b > \u041f\u0430\u043b\u0438\u0442\u0440\u0430 RGB \u043c\u043e\u043d\u0438\u0442\u043e\u0440\u0430",
      },
      hidden: false,
    },
    "menu_proof-colorblindp": {
      id: "menu_proof-colorblindp",
      action: "proof-colorblindp",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > Proof Setup > Color blindness - Protanopia-type",
        de: "Ansicht > Proof einrichten > Farbenblindheit (Protanopie)",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u0446\u0432\u0435\u0442\u043e\u043f\u0440\u043e\u0431\u044b > \u0414\u0430\u043b\u044c\u0442\u043e\u043d\u0438\u0437\u043c - \u043f\u0440\u043e\u0442\u0430\u043d\u043e\u043f\u0438\u044f",
      },
      hidden: false,
    },
    "menu_proof-colorblindd": {
      id: "menu_proof-colorblindd",
      action: "proof-colorblindd",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > Proof Setup > Color blindness - Deuteranopia-type",
        de: "Ansicht > Proof einrichten > Farbenblindheit (Deuteranopie)",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u0446\u0432\u0435\u0442\u043e\u043f\u0440\u043e\u0431\u044b > \u0414\u0430\u043b\u044c\u0442\u043e\u043d\u0438\u0437\u043c - \u0434\u0435\u0439\u0442\u0435\u0440\u0430\u043d\u043e\u043f\u0438\u044f",
      },
      hidden: false,
    },
    "menu_proof-custom": {
      id: "menu_proof-custom",
      action: "proof-custom",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > Proof Setup > Customize...",
        de: "Ansicht > Proof einrichten > Anpassen \u2026",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u0446\u0432\u0435\u0442\u043e\u043f\u0440\u043e\u0431\u044b > \u0417\u0430\u043a\u0430\u0437\u043d\u044b\u0435 \u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b\u2026",
      },
      hidden: false,
    },
    menu_proofColors: {
      id: "menu_proofColors",
      action: "proofColors",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > Proof Colors",
        de: "Ansicht > Farbproof",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u0426\u0432\u0435\u0442\u043e\u043f\u0440\u043e\u0431\u0430",
      },
      hidden: false,
    },
    menu_zoomin: {
      id: "menu_zoomin",
      action: "zoomin",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > Zoom In",
        de: "Ansicht > Einzoomen",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u0423\u0432\u0435\u043b\u0438\u0447\u0435\u043d\u0438\u0435",
      },
      hidden: false,
    },
    menu_zoomout: {
      id: "menu_zoomout",
      action: "zoomout",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > Zoom Out",
        de: "Ansicht > Auszoomen",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u0423\u043c\u0435\u043d\u044c\u0448\u0435\u043d\u0438\u0435",
      },
      hidden: false,
    },
    menu_fitin: {
      id: "menu_fitin",
      action: "fitin",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > Fit Artboard in Window",
        de: "Ansicht > Zeichenfl\u00e4che in Fenster einpassen",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u043e\u0434\u043e\u0433\u043d\u0430\u0442\u044c \u043c\u043e\u043d\u0442\u0430\u0436\u043d\u0443\u044e \u043e\u0431\u043b\u0430\u0441\u0442\u044c \u043f\u043e \u0440\u0430\u0437\u043c\u0435\u0440\u0443 \u043e\u043a\u043d\u0430",
      },
      hidden: false,
    },
    menu_fitall: {
      id: "menu_fitall",
      action: "fitall",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > Fit All in Window",
        de: "Ansicht > Alle in Fenster einpassen",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u043e\u0434\u043e\u0433\u043d\u0430\u0442\u044c \u0432\u0441\u0435 \u043f\u043e \u0440\u0430\u0437\u043c\u0435\u0440\u0443 \u043e\u043a\u043d\u0430",
      },
      hidden: false,
    },
    menu_AISlice_Feedback_Menu: {
      id: "menu_AISlice_Feedback_Menu",
      action: "AISlice Feedback Menu",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "View > Show / Hide Slices",
        de: "Ansicht > Slices einblenden / ausblenden",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c / \u0441\u043f\u0440\u044f\u0442\u0430\u0442\u044c \u0444\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u044b",
      },
      hidden: false,
    },
    menu_AISlice_Lock_Menu: {
      id: "menu_AISlice_Lock_Menu",
      action: "AISlice Lock Menu",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "View > Lock Slices",
        de: "Ansicht > Slices fixieren",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u0417\u0430\u043a\u0440\u0435\u043f\u0438\u0442\u044c \u0444\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u044b",
      },
      hidden: false,
    },
    menu_AI_Bounding_Box_Toggle: {
      id: "menu_AI_Bounding_Box_Toggle",
      action: "AI Bounding Box Toggle",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "View > Show / Hide Bounding Box",
        de: "Ansicht > Begrenzungsrahmen einblenden / ausblenden",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c / \u0441\u043f\u0440\u044f\u0442\u0430\u0442\u044c \u043e\u0433\u0440\u0430\u043d\u0438\u0447\u0438\u0442\u0435\u043b\u044c\u043d\u0443\u044e \u0440\u0430\u043c\u043a\u0443",
      },
      hidden: false,
    },
    menu_TransparencyGrid_Menu_Item: {
      id: "menu_TransparencyGrid_Menu_Item",
      action: "TransparencyGrid Menu Item",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > Show / Hide Transparency Grid",
        de: "Ansicht > Transparenzraster einblenden / ausblenden",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c / \u0441\u043f\u0440\u044f\u0442\u0430\u0442\u044c \u0441\u0435\u0442\u043a\u0443 \u043f\u0440\u043e\u0437\u0440\u0430\u0447\u043d\u043e\u0441\u0442\u0438",
      },
      hidden: false,
    },
    menu_actualsize: {
      id: "menu_actualsize",
      action: "actualsize",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > Actual Size",
        de: "Ansicht > Originalgr\u00f6\u00dfe",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u0420\u0435\u0430\u043b\u044c\u043d\u044b\u0439 \u0440\u0430\u0437\u043c\u0435\u0440",
      },
      hidden: false,
    },
    menu_Show_Gaps_Planet_X: {
      id: "menu_Show_Gaps_Planet_X",
      action: "Show Gaps Planet X",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "View > Show / Hide Live Paint Gaps",
        de: "Ansicht > Interaktive Mall\u00fccken einblenden / ausblenden",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c / \u0441\u043f\u0440\u044f\u0442\u0430\u0442\u044c \u0437\u0430\u0437\u043e\u0440\u044b \u0431\u044b\u0441\u0442\u0440\u044b\u0445 \u0437\u0430\u043b\u0438\u0432\u043e\u043a",
      },
      hidden: false,
    },
    menu_Gradient_Feedback: {
      id: "menu_Gradient_Feedback",
      action: "Gradient Feedback",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "View > Show / Hide Gradient Annotator",
        de: "Ansicht > Verlaufsoptimierer einblenden / ausblenden",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c / \u0441\u043f\u0440\u044f\u0442\u0430\u0442\u044c \u0433\u0440\u0430\u0434\u0438\u0435\u043d\u0442\u043d\u044b\u0439 \u0430\u043d\u043d\u043e\u0442\u0430\u0442\u043e\u0440",
      },
      hidden: false,
    },
    menu_Live_Corner_Annotator: {
      id: "menu_Live_Corner_Annotator",
      action: "Live Corner Annotator",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "View > Show / Hide Corner Widget",
        de: "Ansicht > Ecken-Widget einblenden / ausblenden",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c / \u0441\u043a\u0440\u044b\u0442\u044c \u0432\u0438\u0434\u0436\u0435\u0442 \u0443\u0433\u043b\u043e\u0432",
      },
      hidden: false,
      minVersion: 17.1,
    },
    menu_edge: {
      id: "menu_edge",
      action: "edge",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > Show / Hide Edges",
        de: "Ansicht > Ecken einblenden / ausblenden",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c / \u0441\u043f\u0440\u044f\u0442\u0430\u0442\u044c \u0433\u0440\u0430\u043d\u0438\u0446\u044b",
      },
      hidden: false,
    },
    "menu_Snapomatic_on-off_menu_item": {
      id: "menu_Snapomatic_on-off_menu_item",
      action: "Snapomatic on-off menu item",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "View > Smart Guides",
        de: "Ansicht > Intelligente Hilfslinien",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u0411\u044b\u0441\u0442\u0440\u044b\u0435 \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u044f\u044e\u0449\u0438\u0435",
      },
      hidden: false,
    },
    menu_Show_Perspective_Grid: {
      id: "menu_Show_Perspective_Grid",
      action: "Show Perspective Grid",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > Perspective Grid > Show / Hide Grid",
        de: "Ansicht > Perspektivenraster > Raster einblenden / ausblenden",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u0421\u0435\u0442\u043a\u0430 \u043f\u0435\u0440\u0441\u043f\u0435\u043a\u0442\u0438\u0432\u044b > \u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c / \u0441\u043a\u0440\u044b\u0442\u044c \u0441\u0435\u0442\u043a\u0443",
      },
      hidden: false,
    },
    menu_Show_Ruler: {
      id: "menu_Show_Ruler",
      action: "Show Ruler",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > Perspective Grid > Show / Hide Rulers",
        de: "Ansicht > Perspektivenraster > Lineale einblenden / ausblenden",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u0421\u0435\u0442\u043a\u0430 \u043f\u0435\u0440\u0441\u043f\u0435\u043a\u0442\u0438\u0432\u044b > \u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c / \u0441\u043a\u0440\u044b\u0442\u044c \u043b\u0438\u043d\u0435\u0439\u043a\u0438",
      },
      hidden: false,
    },
    menu_Snap_to_Grid: {
      id: "menu_Snap_to_Grid",
      action: "Snap to Grid",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > Perspective Grid > Snap to Grid",
        de: "Ansicht > Perspektivenraster > Am Raster ausrichten",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u0421\u0435\u0442\u043a\u0430 \u043f\u0435\u0440\u0441\u043f\u0435\u043a\u0442\u0438\u0432\u044b > \u041f\u0440\u0438\u0432\u044f\u0437\u0430\u0442\u044c \u043a \u0441\u0435\u0442\u043a\u0435",
      },
      hidden: false,
    },
    menu_Lock_Perspective_Grid: {
      id: "menu_Lock_Perspective_Grid",
      action: "Lock Perspective Grid",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > Perspective Grid > Lock Grid",
        de: "Ansicht > Perspektivenraster > Raster sperren",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u0421\u0435\u0442\u043a\u0430 \u043f\u0435\u0440\u0441\u043f\u0435\u043a\u0442\u0438\u0432\u044b > \u0417\u0430\u043a\u0440\u0435\u043f\u0438\u0442\u044c \u0441\u0435\u0442\u043a\u0443",
      },
      hidden: false,
    },
    menu_Lock_Station_Point: {
      id: "menu_Lock_Station_Point",
      action: "Lock Station Point",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > Perspective Grid > Lock Station Point",
        de: "Ansicht > Perspektivenraster > Bezugspunkt sperren",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u0421\u0435\u0442\u043a\u0430 \u043f\u0435\u0440\u0441\u043f\u0435\u043a\u0442\u0438\u0432\u044b > \u0417\u0430\u043a\u0440\u0435\u043f\u0438\u0442\u044c \u0442\u043e\u0447\u043a\u0443 \u043d\u0430\u0431\u043b\u044e\u0434\u0435\u043d\u0438\u044f",
      },
      hidden: false,
    },
    menu_Define_Perspective_Grid: {
      id: "menu_Define_Perspective_Grid",
      action: "Define Perspective Grid",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > Perspective Grid > Define Grid",
        de: "Ansicht > Perspektivenraster > Raster definieren",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u0421\u0435\u0442\u043a\u0430 \u043f\u0435\u0440\u0441\u043f\u0435\u043a\u0442\u0438\u0432\u044b > \u041e\u043f\u0440\u0435\u0434\u0435\u043b\u0438\u0442\u044c \u0441\u0435\u0442\u043a\u0443...",
      },
      hidden: false,
    },
    menu_Save_Perspective_Grid_as_Preset: {
      id: "menu_Save_Perspective_Grid_as_Preset",
      action: "Save Perspective Grid as Preset",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > Perspective Grid > Save Grid as Preset",
        de: "Ansicht > Perspektivenraster > Raster als Vorgabe speichern",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u0421\u0435\u0442\u043a\u0430 \u043f\u0435\u0440\u0441\u043f\u0435\u043a\u0442\u0438\u0432\u044b > \u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0441\u0435\u0442\u043a\u0443 \u043a\u0430\u043a \u0441\u0442\u0438\u043b\u044c...",
      },
      hidden: false,
    },
    menu_artboard: {
      id: "menu_artboard",
      action: "artboard",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > Show / Hide Artboards",
        de: "Ansicht > Zeichenfl\u00e4chen einblenden / ausblenden",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c / \u0441\u043a\u0440\u044b\u0442\u044c \u043c\u043e\u043d\u0442\u0430\u0436\u043d\u044b\u0435 \u043e\u0431\u043b\u0430\u0441\u0442\u0438",
      },
      hidden: false,
    },
    menu_pagetiling: {
      id: "menu_pagetiling",
      action: "pagetiling",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > Show / Hide Print Tiling",
        de: "Ansicht > Druckaufteilung einblenden / ausblenden",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c / \u0441\u043f\u0440\u044f\u0442\u0430\u0442\u044c \u0440\u0430\u0437\u0431\u0438\u0435\u043d\u0438\u0435 \u0434\u043b\u044f \u043f\u0435\u0447\u0430\u0442\u0438",
      },
      hidden: false,
    },
    menu_showtemplate: {
      id: "menu_showtemplate",
      action: "showtemplate",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > Show / Hide Template",
        de: "Ansicht > Vorlage einblenden / ausblenden",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u0421\u043f\u0440\u044f\u0442\u0430\u0442\u044c \u0448\u0430\u0431\u043b\u043e\u043d",
      },
      hidden: false,
    },
    menu_ruler: {
      id: "menu_ruler",
      action: "ruler",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > Rulers > Show / Hide Rulers",
        de: "Ansicht > Lineale > Lineale einblende / ausblendenn",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c / \u0441\u043a\u0440\u044b\u0442\u044c \u043b\u0438\u043d\u0435\u0439\u043a\u0438",
      },
      hidden: false,
    },
    menu_rulerCoordinateSystem: {
      id: "menu_rulerCoordinateSystem",
      action: "rulerCoordinateSystem",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > Rulers > Change to Global Rulers",
        de: "Ansicht > Lineale > In globale Lineale \u00e4ndern",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041b\u0438\u043d\u0435\u0439\u043a\u0438 > \u0421\u043c\u0435\u043d\u0438\u0442\u044c \u043d\u0430 \u043e\u0431\u0449\u0438\u0435 \u043b\u0438\u043d\u0435\u0439\u043a\u0438 / \u043c\u043e\u043d\u0442\u0430\u0436\u043d\u043e\u0439 \u043e\u0431\u043b\u0430\u0441\u0442\u0438",
      },
      hidden: false,
    },
    menu_videoruler: {
      id: "menu_videoruler",
      action: "videoruler",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > Rulers > Show / Hide Video Rulers",
        de: "Ansicht > Lineale > Videolineale einblenden / ausblenden",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c / \u0441\u043a\u0440\u044b\u0442\u044c \u043b\u0438\u043d\u0435\u0439\u043a\u0438 \u0432\u0438\u0434\u0435\u043e",
      },
      hidden: false,
    },
    menu_textthreads: {
      id: "menu_textthreads",
      action: "textthreads",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > Show / Hide Text Threads",
        de: "Ansicht > Textverkettungen einblenden / ausblenden",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c / \u0441\u043f\u0440\u044f\u0442\u0430\u0442\u044c \u0441\u0432\u044f\u0437\u0438 \u0442\u0435\u043a\u0441\u0442\u043e\u0432\u044b\u0445 \u0431\u043b\u043e\u043a\u043e\u0432",
      },
      hidden: false,
    },
    menu_showguide: {
      id: "menu_showguide",
      action: "showguide",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > Guides > Show / Hide Guides",
        de: "Ansicht > Hilfslinien > Hilfslinien einblenden / ausblenden",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041d\u0430\u043f\u0440\u0430\u0432\u043b\u044f\u044e\u0449\u0438\u0435 > \u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c / \u0441\u043f\u0440\u044f\u0442\u0430\u0442\u044c \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u044f\u044e\u0449\u0438\u0435",
      },
      hidden: false,
    },
    menu_lockguide: {
      id: "menu_lockguide",
      action: "lockguide",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > Guides > Lock Guides",
        de: "Ansicht > Hilfslinien > Hilfslinien sperren",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041d\u0430\u043f\u0440\u0430\u0432\u043b\u044f\u044e\u0449\u0438\u0435 > \u0417\u0430\u043a\u0440\u0435\u043f\u0438\u0442\u044c \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u044f\u044e\u0449\u0438\u0435",
      },
      hidden: false,
    },
    menu_makeguide: {
      id: "menu_makeguide",
      action: "makeguide",
      type: "menu",
      docRequired: true,
      selRequired: true,
      loc: {
        en: "View > Guides > Make Guides",
        de: "Ansicht > Hilfslinien > Hilfslinien erstellen",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041d\u0430\u043f\u0440\u0430\u0432\u043b\u044f\u044e\u0449\u0438\u0435 > \u0421\u043e\u0437\u0434\u0430\u0442\u044c \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u044f\u044e\u0449\u0438\u0435",
      },
      hidden: false,
    },
    menu_releaseguide: {
      id: "menu_releaseguide",
      action: "releaseguide",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > Guides > Release Guides",
        de: "Ansicht > Hilfslinien > Hilfslinien zur\u00fcckwandeln",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041d\u0430\u043f\u0440\u0430\u0432\u043b\u044f\u044e\u0449\u0438\u0435 > \u041e\u0441\u0432\u043e\u0431\u043e\u0434\u0438\u0442\u044c \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u044f\u044e\u0449\u0438\u0435",
      },
      hidden: false,
    },
    menu_clearguide: {
      id: "menu_clearguide",
      action: "clearguide",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > Guides > Clear Guides",
        de: "Ansicht > Hilfslinien > Hilfslinien l\u00f6schen",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041d\u0430\u043f\u0440\u0430\u0432\u043b\u044f\u044e\u0449\u0438\u0435 > \u0423\u0434\u0430\u043b\u0438\u0442\u044c \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u044f\u044e\u0449\u0438\u0435",
      },
      hidden: false,
    },
    menu_showgrid: {
      id: "menu_showgrid",
      action: "showgrid",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > Show / Hide Grid",
        de: "Ansicht > Raster einblenden / ausblenden",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c / \u0441\u043f\u0440\u044f\u0442\u0430\u0442\u044c \u0441\u0435\u0442\u043a\u0443",
      },
      hidden: false,
    },
    menu_snapgrid: {
      id: "menu_snapgrid",
      action: "snapgrid",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > Snap to Grid",
        de: "Ansicht > Am Raster ausrichten",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u0412\u044b\u0440\u0430\u0432\u043d\u0438\u0432\u0430\u0442\u044c \u043f\u043e \u0441\u0435\u0442\u043a\u0435",
      },
      hidden: false,
    },
    menu_snappoint: {
      id: "menu_snappoint",
      action: "snappoint",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > Snap to Point",
        de: "Ansicht > An Punkt ausrichten",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u0412\u044b\u0440\u0430\u0432\u043d\u0438\u0432\u0430\u0442\u044c \u043f\u043e \u0442\u043e\u0447\u043a\u0430\u043c",
      },
      hidden: false,
    },
    menu_newview: {
      id: "menu_newview",
      action: "newview",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > New View...",
        de: "Ansicht > Neue Ansicht \u2026",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u041d\u043e\u0432\u044b\u0439 \u0432\u0438\u0434\u2026",
      },
      hidden: false,
    },
    menu_editview: {
      id: "menu_editview",
      action: "editview",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "View > Edit Views...",
        de: "Ansicht > Ansicht bearbeiten \u2026",
        ru: "\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 > \u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0432\u0438\u0434\u044b\u2026",
      },
      hidden: false,
    },
    menu_newwindow: {
      id: "menu_newwindow",
      action: "newwindow",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Window > New Window",
        de: "Fenster > Neues Fenster",
        ru: "\u041e\u043a\u043d\u043e > \u041d\u043e\u0432\u043e\u0435 \u043e\u043a\u043d\u043e",
      },
      hidden: false,
    },
    menu_cascade: {
      id: "menu_cascade",
      action: "cascade",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Window > Arrange > Cascade",
        de: "Fenster > Anordnen > \u00dcberlappend",
        ru: "\u041e\u043a\u043d\u043e > \u0423\u043f\u043e\u0440\u044f\u0434\u0438\u0442\u044c > \u041a\u0430\u0441\u043a\u0430\u0434\u043e\u043c",
      },
      hidden: false,
    },
    menu_tile: {
      id: "menu_tile",
      action: "tile",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Window > Arrange > Tile",
        de: "Fenster > Anordnen > Nebeneinander",
        ru: "\u041e\u043a\u043d\u043e > \u0423\u043f\u043e\u0440\u044f\u0434\u0438\u0442\u044c > \u041c\u043e\u0437\u0430\u0438\u043a\u043e\u0439",
      },
      hidden: false,
    },
    menu_floatInWindow: {
      id: "menu_floatInWindow",
      action: "floatInWindow",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Window > Arrange > Float in Window",
        de: "Fenster > Anordnen > In Fenster verschiebbar machen",
        ru: "\u041e\u043a\u043d\u043e > \u0423\u043f\u043e\u0440\u044f\u0434\u0438\u0442\u044c > \u041f\u043b\u0430\u0432\u0430\u044e\u0449\u0435\u0435 \u0432 \u043e\u043a\u043d\u0435",
      },
      hidden: false,
    },
    menu_floatAllInWindows: {
      id: "menu_floatAllInWindows",
      action: "floatAllInWindows",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Window > Arrange > Float All in Windows",
        de: "Fenster > Anordnen > Alle in Fenstern verschiebbar machen",
        ru: "\u041e\u043a\u043d\u043e > \u0423\u043f\u043e\u0440\u044f\u0434\u0438\u0442\u044c > \u0412\u0441\u0435 \u043f\u043b\u0430\u0432\u0430\u044e\u0449\u0438\u0435 \u0432 \u043e\u043a\u043d\u0430\u0445",
      },
      hidden: false,
    },
    menu_consolidateAllWindows: {
      id: "menu_consolidateAllWindows",
      action: "consolidateAllWindows",
      type: "menu",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Window > Arrange > Consolidate All Windows",
        de: "Fenster > Anordnen > Alle Fenster zusammenf\u00fchren",
        ru: "\u041e\u043a\u043d\u043e > \u0423\u043f\u043e\u0440\u044f\u0434\u0438\u0442\u044c > \u041e\u0431\u044a\u0435\u0434\u0438\u043d\u0438\u0442\u044c \u0432\u0441\u0435 \u043e\u043a\u043d\u0430",
      },
      hidden: false,
    },
    "menu_Browse_Add-Ons_Menu": {
      id: "menu_Browse_Add-Ons_Menu",
      action: "Browse Add-Ons Menu",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Find Extensions on Exchange...",
        de: "Fenster > Erweiterungen auf Exchange suchen \u2026",
        ru: "\u041e\u043a\u043d\u043e > \u041f\u043e\u0438\u0441\u043a \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043d\u0438\u0439 \u043d\u0430 Exchange...",
      },
      hidden: false,
      minVersion: 19,
    },
    menu_Adobe_Reset_Workspace: {
      id: "menu_Adobe_Reset_Workspace",
      action: "Adobe Reset Workspace",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Reset Workspace",
        de: "Fenster > Arbeitsbereich > Zur\u00fccksetzen",
        ru: "\u041e\u043a\u043d\u043e > \u0412\u043e\u0441\u0441\u0442\u0430\u043d\u043e\u0432\u0438\u0442\u044c \u0440\u0430\u0431\u043e\u0447\u0443\u044e \u0441\u0440\u0435\u0434\u0443",
      },
      hidden: false,
    },
    menu_Adobe_New_Workspace: {
      id: "menu_Adobe_New_Workspace",
      action: "Adobe New Workspace",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Workspace > New Workspace...",
        de: "Fenster > Arbeitsbereich > Neuer Arbeitsbereich \u2026",
        ru: "\u041e\u043a\u043d\u043e > \u0420\u0430\u0431\u043e\u0447\u0430\u044f \u0441\u0440\u0435\u0434\u0430 > \u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0440\u0430\u0431\u043e\u0447\u0443\u044e \u0441\u0440\u0435\u0434\u0443...",
      },
      hidden: false,
    },
    menu_Adobe_Manage_Workspace: {
      id: "menu_Adobe_Manage_Workspace",
      action: "Adobe Manage Workspace",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Workspace > Manage Workspaces...",
        de: "Fenster > Arbeitsbereich > Arbeitsbereiche verwalten \u2026",
        ru: "\u041e\u043a\u043d\u043e > \u0420\u0430\u0431\u043e\u0447\u0430\u044f \u0441\u0440\u0435\u0434\u0430 > \u0423\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u0440\u0430\u0431\u043e\u0447\u0438\u043c\u0438 \u0441\u0440\u0435\u0434\u0430\u043c\u0438...",
      },
      hidden: false,
    },
    menu_drover_control_palette_plugin: {
      id: "menu_drover_control_palette_plugin",
      action: "drover control palette plugin",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Control",
        de: "Fenster > Steuerung",
        ru: "\u041e\u043a\u043d\u043e > \u041f\u0430\u043d\u0435\u043b\u044c \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u044f",
      },
      hidden: false,
    },
    menu_Adobe_Advanced_Toolbar_Menu: {
      id: "menu_Adobe_Advanced_Toolbar_Menu",
      action: "Adobe Advanced Toolbar Menu",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Toolbars > Advanced",
        de: "Fenster > Werkzeugleisten > Erweitert",
        ru: "\u041e\u043a\u043d\u043e > \u041f\u0430\u043d\u0435\u043b\u0438 \u0438\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442\u043e\u0432 > \u0414\u043e\u043f\u043e\u043b\u043d\u0438\u0442\u0435\u043b\u044c\u043d\u044b\u0435",
      },
      hidden: false,
      minVersion: 23,
    },
    menu_Adobe_Basic_Toolbar_Menu: {
      id: "menu_Adobe_Basic_Toolbar_Menu",
      action: "Adobe Basic Toolbar Menu",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Toolbars > Basic",
        de: "Fenster > Werkzeugleisten > Einfach",
        ru: "\u041e\u043a\u043d\u043e > \u041f\u0430\u043d\u0435\u043b\u0438 \u0438\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442\u043e\u0432 > \u041e\u0441\u043d\u043e\u0432\u043d\u044b\u0435",
      },
      hidden: false,
      minVersion: 23,
    },
    menu_New_Tools_Panel: {
      id: "menu_New_Tools_Panel",
      action: "New Tools Panel",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Toolbars > New Toolbar...",
        de: "Fenster > Werkzeugleisten > Neue Werkzeugleiste \u2026",
        ru: "\u041e\u043a\u043d\u043e > \u041f\u0430\u043d\u0435\u043b\u0438 \u0438\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442\u043e\u0432 > \u041d\u043e\u0432\u0430\u044f \u043f\u0430\u043d\u0435\u043b\u044c \u0438\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442\u043e\u0432...",
      },
      hidden: false,
      minVersion: 17,
    },
    menu_Manage_Tools_Panel: {
      id: "menu_Manage_Tools_Panel",
      action: "Manage Tools Panel",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Toolbars > Manage Toolbar...",
        de: "Fenster > Werkzeugleisten > Werkzeugleisten verwalten \u2026",
        ru: "\u041e\u043a\u043d\u043e > \u041f\u0430\u043d\u0435\u043b\u0438 \u0438\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442\u043e\u0432 > \u0423\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u043f\u0430\u043d\u0435\u043b\u044f\u043c\u0438 \u0438\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442\u043e\u0432...",
      },
      hidden: false,
      minVersion: 17,
    },
    menu_Adobe_3D_Panel: {
      id: "menu_Adobe_3D_Panel",
      action: "Adobe 3D Panel",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > 3D and Materials",
        de: "Fenster > 3D und Materialien",
        ru: "\u041e\u043a\u043d\u043e > 3D \u0438 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b",
      },
      hidden: false,
      minVersion: 26,
    },
    menu_Adobe_Action_Palette: {
      id: "menu_Adobe_Action_Palette",
      action: "Adobe Action Palette",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Actions",
        de: "Fenster > Aktionen",
        ru: "\u041e\u043a\u043d\u043e > \u041e\u043f\u0435\u0440\u0430\u0446\u0438\u0438",
      },
      hidden: false,
    },
    menu_AdobeAlignObjects2: {
      id: "menu_AdobeAlignObjects2",
      action: "AdobeAlignObjects2",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Align",
        de: "Fenster > Ausrichten",
        ru: "\u041e\u043a\u043d\u043e > \u0412\u044b\u0440\u0430\u0432\u043d\u0438\u0432\u0430\u043d\u0438\u0435",
      },
      hidden: false,
    },
    menu_Style_Palette: {
      id: "menu_Style_Palette",
      action: "Style Palette",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Appearance",
        de: "Fenster > Aussehen",
        ru: "\u041e\u043a\u043d\u043e > \u041e\u0444\u043e\u0440\u043c\u043b\u0435\u043d\u0438\u0435",
      },
      hidden: false,
    },
    menu_Adobe_Artboard_Palette: {
      id: "menu_Adobe_Artboard_Palette",
      action: "Adobe Artboard Palette",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Artboards",
        de: "Fenster > Zeichenfl\u00e4chen",
        ru: "\u041e\u043a\u043d\u043e > \u041c\u043e\u043d\u0442\u0430\u0436\u043d\u044b\u0435 \u043e\u0431\u043b\u0430\u0441\u0442\u0438",
      },
      hidden: false,
    },
    menu_Adobe_SmartExport_Panel_Menu_Item: {
      id: "menu_Adobe_SmartExport_Panel_Menu_Item",
      action: "Adobe SmartExport Panel Menu Item",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Asset Export",
        de: "Fenster > Export von Element",
        ru: "\u041e\u043a\u043d\u043e > \u042d\u043a\u0441\u043f\u043e\u0440\u0442 \u0440\u0435\u0441\u0443\u0440\u0441\u043e\u0432",
      },
      hidden: false,
      minVersion: 20,
    },
    "menu_internal_palettes_posing_as_plug-in_menus-attributes": {
      id: "menu_internal_palettes_posing_as_plug-in_menus-attributes",
      action: "internal palettes posing as plug-in menus-attributes",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Attributes",
        de: "Fenster > Attribute",
        ru: "\u041e\u043a\u043d\u043e > \u0410\u0442\u0440\u0438\u0431\u0443\u0442\u044b",
      },
      hidden: false,
    },
    menu_Adobe_BrushManager_Menu_Item: {
      id: "menu_Adobe_BrushManager_Menu_Item",
      action: "Adobe BrushManager Menu Item",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Brushes",
        de: "Fenster > Pinsel",
        ru: "\u041e\u043a\u043d\u043e > \u041a\u0438\u0441\u0442\u0438",
      },
      hidden: false,
    },
    menu_Adobe_Color_Palette: {
      id: "menu_Adobe_Color_Palette",
      action: "Adobe Color Palette",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Color",
        de: "Fenster > Farbe",
        ru: "\u041e\u043a\u043d\u043e > \u0426\u0432\u0435\u0442",
      },
      hidden: false,
    },
    menu_Adobe_Harmony_Palette: {
      id: "menu_Adobe_Harmony_Palette",
      action: "Adobe Harmony Palette",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Color Guide",
        de: "Fenster > Farbhilfe",
        ru: "\u041e\u043a\u043d\u043e > \u041a\u0430\u0442\u0430\u043b\u043e\u0433 \u0446\u0432\u0435\u0442\u043e\u0432",
      },
      hidden: false,
    },
    menu_Adobe_Illustrator_Kuler_Panel: {
      id: "menu_Adobe_Illustrator_Kuler_Panel",
      action: "Adobe Illustrator Kuler Panel",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Color Themes",
        de: "Window > Color Themes",
        ru: "Window > Color Themes",
      },
      hidden: false,
      minVersion: 22,
      maxVersion: 25.9,
    },
    menu_Adobe_Commenting_Palette: {
      id: "menu_Adobe_Commenting_Palette",
      action: "Adobe Commenting Palette",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Comments",
        de: "Fenster > Kommentare",
        ru: "\u041e\u043a\u043d\u043e > \u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0438",
      },
      hidden: false,
      minVersion: 26,
    },
    menu_CSS_Menu_Item: {
      id: "menu_CSS_Menu_Item",
      action: "CSS Menu Item",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > CSS Properties",
        de: "CSS-Eigenschaften",
        ru: "\u041e\u043a\u043d\u043e > \u0421\u0432\u043e\u0439\u0441\u0442\u0432\u0430 CSS",
      },
      hidden: false,
    },
    menu_DocInfo1: {
      id: "menu_DocInfo1",
      action: "DocInfo1",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Document Info",
        de: "Fenster > Dokumentinformationen",
        ru: "\u041e\u043a\u043d\u043e > \u0418\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f \u043e \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u0435",
      },
      hidden: false,
    },
    menu_Adobe_Flattening_Preview: {
      id: "menu_Adobe_Flattening_Preview",
      action: "Adobe Flattening Preview",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Flattener Preview",
        de: "Fenster > Reduzierungsvorschau",
        ru: "\u041e\u043a\u043d\u043e > \u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 \u0440\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u043e\u0432 \u0441\u0432\u0435\u0434\u0435\u043d\u0438\u044f",
      },
      hidden: false,
    },
    menu_Adobe_Gradient_Palette: {
      id: "menu_Adobe_Gradient_Palette",
      action: "Adobe Gradient Palette",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Gradient",
        de: "Fenster > Verlauf",
        ru: "\u041e\u043a\u043d\u043e > \u0413\u0440\u0430\u0434\u0438\u0435\u043d\u0442",
      },
      hidden: false,
    },
    menu_Adobe_Style_Palette: {
      id: "menu_Adobe_Style_Palette",
      action: "Adobe Style Palette",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Graphic Styles",
        de: "Fenster > Grafikstile",
        ru: "\u041e\u043a\u043d\u043e > \u0421\u0442\u0438\u043b\u0438 \u0433\u0440\u0430\u0444\u0438\u043a\u0438",
      },
      hidden: false,
    },
    menu_Adobe_HistoryPanel_Menu_Item: {
      id: "menu_Adobe_HistoryPanel_Menu_Item",
      action: "Adobe HistoryPanel Menu Item",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > History",
        de: "Fenster > Versionsverlauf",
        ru: "\u041e\u043a\u043d\u043e > \u0418\u0441\u0442\u043e\u0440\u0438\u044f",
      },
      hidden: false,
      minVersion: 26.4,
      maxVersion: 26.9,
    },
    menu_Adobe_History_Panel_Menu_Item: {
      id: "menu_Adobe_History_Panel_Menu_Item",
      action: "Adobe History Panel Menu Item",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > History",
        de: "Fenster > Versionsverlauf",
        ru: "\u041e\u043a\u043d\u043e > \u0418\u0441\u0442\u043e\u0440\u0438\u044f",
      },
      hidden: false,
      minVersion: 27,
    },
    menu_Adobe_Vectorize_Panel: {
      id: "menu_Adobe_Vectorize_Panel",
      action: "Adobe Vectorize Panel",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Image Trace",
        de: "Fenster > Bildnachzeichner",
        ru: "Window > Image Trace",
      },
      hidden: false,
    },
    "menu_internal_palettes_posing_as_plug-in_menus-info": {
      id: "menu_internal_palettes_posing_as_plug-in_menus-info",
      action: "internal palettes posing as plug-in menus-info",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Info",
        de: "Fenster > Info",
        ru: "\u041e\u043a\u043d\u043e > \u0418\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f",
      },
      hidden: false,
    },
    menu_AdobeLayerPalette1: {
      id: "menu_AdobeLayerPalette1",
      action: "AdobeLayerPalette1",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Layers",
        de: "Fenster > Ebenen",
        ru: "\u041e\u043a\u043d\u043e > \u0421\u043b\u043e\u0438",
      },
      hidden: false,
    },
    menu_Adobe_Learn_Panel_Menu_Item: {
      id: "menu_Adobe_Learn_Panel_Menu_Item",
      action: "Adobe Learn Panel Menu Item",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: { en: "Window > Learn", de: "Window > Learn", ru: "Window > Learn" },
      hidden: false,
      minVersion: 22,
      maxVersion: 25.9,
    },
    "menu_Adobe_CSXS_Extension_com.adobe.DesignLibraries.angularLibraries": {
      id: "menu_Adobe_CSXS_Extension_com.adobe.DesignLibraries.angularLibraries",
      action: "Adobe CSXS Extension com.adobe.DesignLibraries.angularLibraries",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Libraries",
        de: "Fenster > Bibliotheken",
        ru: "\u041e\u043a\u043d\u043e > \u0411\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u0438",
      },
      hidden: false,
    },
    menu_Adobe_LinkPalette_Menu_Item: {
      id: "menu_Adobe_LinkPalette_Menu_Item",
      action: "Adobe LinkPalette Menu Item",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Links",
        de: "Fenster > Verkn\u00fcpfungen",
        ru: "\u041e\u043a\u043d\u043e > \u0421\u0432\u044f\u0437\u0438",
      },
      hidden: false,
    },
    menu_AI_Magic_Wand: {
      id: "menu_AI_Magic_Wand",
      action: "AI Magic Wand",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Magic Wand",
        de: "Fenster > Zauberstab",
        ru: "\u041e\u043a\u043d\u043e > \u0412\u043e\u043b\u0448\u0435\u0431\u043d\u0430\u044f \u043f\u0430\u043b\u043e\u0447\u043a\u0430",
      },
      hidden: false,
    },
    menu_Adobe_Vector_Edge_Panel: {
      id: "menu_Adobe_Vector_Edge_Panel",
      action: "Adobe Vector Edge Panel",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Mockup (Beta)",
        de: "Window > Mockup (Beta)",
        ru: "Window > Mockup (Beta)",
      },
      hidden: false,
      minVersion: 28,
    },
    menu_AdobeNavigator: {
      id: "menu_AdobeNavigator",
      action: "AdobeNavigator",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Navigator",
        de: "Fenster > Navigator",
        ru: "\u041e\u043a\u043d\u043e > \u041d\u0430\u0432\u0438\u0433\u0430\u0442\u043e\u0440",
      },
      hidden: false,
    },
    menu_Adobe_PathfinderUI: {
      id: "menu_Adobe_PathfinderUI",
      action: "Adobe PathfinderUI",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Pathfinder",
        de: "Fenster > Pathfinder",
        ru: "\u041e\u043a\u043d\u043e > \u041e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u043a\u043e\u043d\u0442\u0443\u0440\u043e\u0432",
      },
      hidden: false,
    },
    menu_Adobe_Pattern_Panel_Toggle: {
      id: "menu_Adobe_Pattern_Panel_Toggle",
      action: "Adobe Pattern Panel Toggle",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Pattern Options",
        de: "Fenster > Musteroptionen",
        ru: "\u041e\u043a\u043d\u043e > \u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b \u0443\u0437\u043e\u0440\u0430",
      },
      hidden: false,
    },
    menu_ReTypeWindowMenu: {
      id: "menu_ReTypeWindowMenu",
      action: "ReTypeWindowMenu",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Retype (Beta)",
        de: "Fenster > Retype (Beta)",
        ru: "Window > Retype (Beta)",
      },
      hidden: false,
      minVersion: 27.6,
    },
    menu_Adobe_Separation_Preview_Panel: {
      id: "menu_Adobe_Separation_Preview_Panel",
      action: "Adobe Separation Preview Panel",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Separations Preview",
        de: "Fenster > Separationenvorschau",
        ru: "\u041e\u043a\u043d\u043e > \u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 \u0446\u0432\u0435\u0442\u043e\u0434\u0435\u043b\u0435\u043d\u0438\u0439",
      },
      hidden: false,
    },
    menu_Adobe_Stroke_Palette: {
      id: "menu_Adobe_Stroke_Palette",
      action: "Adobe Stroke Palette",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Stroke",
        de: "Fenster > Kontur",
        ru: "\u041e\u043a\u043d\u043e > \u041e\u0431\u0432\u043e\u0434\u043a\u0430",
      },
      hidden: false,
    },
    menu_Adobe_SVG_Interactivity_Palette: {
      id: "menu_Adobe_SVG_Interactivity_Palette",
      action: "Adobe SVG Interactivity Palette",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > SVG Interactivity",
        de: "Fenster > SVG-Interaktivit\u00e4t",
        ru: "\u041e\u043a\u043d\u043e > \u0418\u043d\u0442\u0435\u0440\u0430\u043a\u0442\u0438\u0432\u043d\u043e\u0441\u0442\u044c SVG",
      },
      hidden: false,
    },
    menu_Adobe_Swatches_Menu_Item: {
      id: "menu_Adobe_Swatches_Menu_Item",
      action: "Adobe Swatches Menu Item",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Swatches",
        de: "Fenster > Farbfelder",
        ru: "\u041e\u043a\u043d\u043e > \u041e\u0431\u0440\u0430\u0437\u0446\u044b",
      },
      hidden: false,
    },
    menu_Adobe_Symbol_Palette: {
      id: "menu_Adobe_Symbol_Palette",
      action: "Adobe Symbol Palette",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Symbols",
        de: "Fenster > Symbole",
        ru: "\u041e\u043a\u043d\u043e > \u0421\u0438\u043c\u0432\u043e\u043b\u044b",
      },
      hidden: false,
    },
    menu_Generate: {
      id: "menu_Generate",
      action: "Generate",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Text to Vector Graphic (Beta)",
        de: "Window > Text to Vector Graphic (Beta)",
        ru: "Window > Text to Vector Graphic (Beta)",
      },
      hidden: false,
      minVersion: 28,
    },
    menu_AdobeTransformObjects1: {
      id: "menu_AdobeTransformObjects1",
      action: "AdobeTransformObjects1",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Transform",
        de: "Fenster > Transformieren",
        ru: "\u041e\u043a\u043d\u043e > \u0422\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435",
      },
      hidden: false,
    },
    menu_Adobe_Transparency_Palette_Menu_Item: {
      id: "menu_Adobe_Transparency_Palette_Menu_Item",
      action: "Adobe Transparency Palette Menu Item",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Transparency",
        de: "Fenster > Transparenz",
        ru: "\u041e\u043a\u043d\u043e > \u041f\u0440\u043e\u0437\u0440\u0430\u0447\u043d\u043e\u0441\u0442\u044c",
      },
      hidden: false,
    },
    "menu_internal_palettes_posing_as_plug-in_menus-character": {
      id: "menu_internal_palettes_posing_as_plug-in_menus-character",
      action: "internal palettes posing as plug-in menus-character",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Type > Character",
        de: "Fenster > Schrift > Zeichen",
        ru: "\u041e\u043a\u043d\u043e > \u0422\u0435\u043a\u0441\u0442 > \u0421\u0438\u043c\u0432\u043e\u043b",
      },
      hidden: false,
    },
    menu_Character_Styles: {
      id: "menu_Character_Styles",
      action: "Character Styles",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Type > Character Styles",
        de: "Fenster > Schrift > Zeichenformate",
        ru: "\u041e\u043a\u043d\u043e > \u0422\u0435\u043a\u0441\u0442 > \u0421\u0442\u0438\u043b\u0438 \u0441\u0438\u043c\u0432\u043e\u043b\u043e\u0432",
      },
      hidden: false,
    },
    menu_alternate_glyph_palette_plugin_2: {
      id: "menu_alternate_glyph_palette_plugin_2",
      action: "alternate glyph palette plugin 2",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Type > Glyphs",
        de: "Fenster > Schrift > Glyphen",
        ru: "\u041e\u043a\u043d\u043e > \u0422\u0435\u043a\u0441\u0442 > \u0413\u043b\u0438\u0444\u044b",
      },
      hidden: false,
    },
    "menu_internal_palettes_posing_as_plug-in_menus-opentype": {
      id: "menu_internal_palettes_posing_as_plug-in_menus-opentype",
      action: "internal palettes posing as plug-in menus-opentype",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Type > OpenType",
        de: "Fenster > Schrift > OpenType",
        ru: "\u041e\u043a\u043d\u043e > \u0422\u0435\u043a\u0441\u0442 > OpenType",
      },
      hidden: false,
    },
    "menu_internal_palettes_posing_as_plug-in_menus-paragraph": {
      id: "menu_internal_palettes_posing_as_plug-in_menus-paragraph",
      action: "internal palettes posing as plug-in menus-paragraph",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Type > Paragraph",
        de: "Fenster > Schrift > Absatz",
        ru: "\u041e\u043a\u043d\u043e > \u0422\u0435\u043a\u0441\u0442 > \u0410\u0431\u0437\u0430\u0446",
      },
      hidden: false,
    },
    menu_Adobe_Paragraph_Styles_Palette: {
      id: "menu_Adobe_Paragraph_Styles_Palette",
      action: "Adobe Paragraph Styles Palette",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Type > Paragraph Styles",
        de: "Fenster > Schrift > Absatzformate",
        ru: "\u041e\u043a\u043d\u043e > \u0422\u0435\u043a\u0441\u0442 > \u0421\u0442\u0438\u043b\u0438 \u0430\u0431\u0437\u0430\u0446\u0435\u0432",
      },
      hidden: false,
    },
    "menu_internal_palettes_posing_as_plug-in_menus-tab": {
      id: "menu_internal_palettes_posing_as_plug-in_menus-tab",
      action: "internal palettes posing as plug-in menus-tab",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Type > Tabs",
        de: "Fenster > Schrift > Tabulatoren",
        ru: "\u041e\u043a\u043d\u043e > \u0422\u0435\u043a\u0441\u0442 > \u0422\u0430\u0431\u0443\u043b\u044f\u0446\u0438\u044f",
      },
      hidden: false,
    },
    menu_Adobe_Variables_Palette_Menu_Item: {
      id: "menu_Adobe_Variables_Palette_Menu_Item",
      action: "Adobe Variables Palette Menu Item",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Variables",
        de: "Fenster > Variablen",
        ru: "\u041e\u043a\u043d\u043e > \u041f\u0435\u0440\u0435\u043c\u0435\u043d\u043d\u044b\u0435",
      },
      hidden: false,
    },
    menu_Adobe_Version_History_File_Menu_Item: {
      id: "menu_Adobe_Version_History_File_Menu_Item",
      action: "Adobe Version History File Menu Item",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Version History",
        de: "Fenster > Versionsverlauf",
        ru: "\u041e\u043a\u043d\u043e > \u0416\u0443\u0440\u043d\u0430\u043b \u0432\u0435\u0440\u0441\u0438\u0439",
      },
      hidden: false,
      minVersion: 26,
    },
    menu_AdobeBrushMgrUI_Other_libraries_menu_item: {
      id: "menu_AdobeBrushMgrUI_Other_libraries_menu_item",
      action: "AdobeBrushMgrUI Other libraries menu item",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Brush Libraries > Other Library",
        de: "Fenster > Pinsel-Bibliotheken > Andere Bibliothek \u2026",
        ru: "\u041e\u043a\u043d\u043e > \u0411\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u0438 \u043a\u0438\u0441\u0442\u0435\u0439 > \u0414\u0440\u0443\u0433\u0430\u044f \u0431\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u0430...",
      },
      hidden: false,
    },
    menu_Adobe_Art_Style_Plugin_Other_libraries_menu_item: {
      id: "menu_Adobe_Art_Style_Plugin_Other_libraries_menu_item",
      action: "Adobe Art Style Plugin Other libraries menu item",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Graphic Style Libraries > Other Library...",
        de: "Fenster > Grafikstil-Bibliotheken > Andere Bibliothek \u2026",
        ru: "\u041e\u043a\u043d\u043e > \u0411\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u0438 \u0441\u0442\u0438\u043b\u0435\u0439 \u0433\u0440\u0430\u0444\u0438\u043a\u0438 > \u0414\u0440\u0443\u0433\u0430\u044f \u0431\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u0430...",
      },
      hidden: false,
    },
    menu_AdobeSwatch__Other_libraries_menu_item: {
      id: "menu_AdobeSwatch__Other_libraries_menu_item",
      action: "AdobeSwatch_ Other libraries menu item",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Swatch Libraries > Other Library...",
        de: "Fenster > Farbfeld-Bibliotheken > Andere Bibliothek \u2026",
        ru: "\u041e\u043a\u043d\u043e > \u0411\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u0438 \u043e\u0431\u0440\u0430\u0437\u0446\u043e\u0432 > \u0414\u0440\u0443\u0433\u0430\u044f \u0431\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u0430...",
      },
      hidden: false,
    },
    menu_Adobe_Symbol_Palette_Plugin_Other_libraries_menu_item: {
      id: "menu_Adobe_Symbol_Palette_Plugin_Other_libraries_menu_item",
      action: "Adobe Symbol Palette Plugin Other libraries menu item",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Window > Symbol Libraries > Other Library...",
        de: "Fenster > Symbol-Bibliotheken > Andere Bibliothek \u2026",
        ru: "\u041e\u043a\u043d\u043e > \u0411\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u0438 \u0441\u0438\u043c\u0432\u043e\u043b\u043e\u0432 > \u0414\u0440\u0443\u0433\u0430\u044f \u0431\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u0430...",
      },
      hidden: false,
    },
    menu_helpcontent: {
      id: "menu_helpcontent",
      action: "helpcontent",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Help > Illustrator Help...",
        de: "Hilfe > Illustrator-Hilfe \u2026",
        ru: "\u0421\u043f\u0440\u0430\u0432\u043a\u0430 > \u0421\u043f\u0440\u0430\u0432\u043a\u0430 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u044b Illustrator...",
      },
      hidden: false,
    },
    menu_supportCommunity: {
      id: "menu_supportCommunity",
      action: "supportCommunity",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Help > Support Community",
        de: "Hilfe > Support-Community",
        ru: "\u0421\u043f\u0440\u0430\u0432\u043a\u0430 > \u0421\u043e\u043e\u0431\u0449\u0435\u0441\u0442\u0432\u043e \u0441\u043b\u0443\u0436\u0431\u044b \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0438",
      },
      hidden: false,
      minVersion: 26,
    },
    menu_wishform: {
      id: "menu_wishform",
      action: "wishform",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Help > Submit Bug/Feature Request...",
        de: "Hilfe > Fehlermeldung / Funktionswunsch senden \u2026",
        ru: "\u0421\u043f\u0440\u0430\u0432\u043a\u0430 > \u0421\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0435 \u043e\u0431 \u043e\u0448\u0438\u0431\u043a\u0435/\u0437\u0430\u043f\u0440\u043e\u0441 \u043d\u0430 \u0434\u043e\u0431\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u043d\u043e\u0432\u044b\u0445 \u0444\u0443\u043d\u043a\u0446\u0438\u0439...",
      },
      hidden: false,
      minVersion: 25,
    },
    menu_System_Info: {
      id: "menu_System_Info",
      action: "System Info",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Help > System Info...",
        de: "Hilfe > Systeminformationen \u2026",
        ru: "\u0421\u043f\u0440\u0430\u0432\u043a\u0430 > \u0418\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f \u043e \u0441\u0438\u0441\u0442\u0435\u043c\u0435\u2026",
      },
      hidden: false,
    },
    menu_Adobe_Actions_Batch: {
      id: "menu_Adobe_Actions_Batch",
      action: "Adobe Actions Batch",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Palette > Actions > Batch...",
        de: "Anderes Bedienfeld > Aktionsstapel \u2026",
        ru: "\u041f\u0430\u043b\u0438\u0442\u0440\u0430 > \u041e\u043f\u0435\u0440\u0430\u0446\u0438\u0438 > \u041f\u0430\u043a\u0435\u0442\u043d\u0430\u044f \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430\u2026",
      },
      hidden: false,
    },
    menu_Adobe_New_Fill_Shortcut: {
      id: "menu_Adobe_New_Fill_Shortcut",
      action: "Adobe New Fill Shortcut",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Palette > Appearance > Add New Fill",
        de: "Anderes Bedienfeld > Neue Fl\u00e4che hinzuf\u00fcgen",
        ru: "\u041f\u0430\u043b\u0438\u0442\u0440\u0430 > \u041e\u0444\u043e\u0440\u043c\u043b\u0435\u043d\u0438\u0435 > \u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u043d\u043e\u0432\u0443\u044e \u0437\u0430\u043b\u0438\u0432\u043a\u0443",
      },
      hidden: false,
    },
    menu_Adobe_New_Stroke_Shortcut: {
      id: "menu_Adobe_New_Stroke_Shortcut",
      action: "Adobe New Stroke Shortcut",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Palette > Appearance > Add New Stroke",
        de: "Anderes Bedienfeld > Neue Kontur hinzuf\u00fcgen",
        ru: "\u041f\u0430\u043b\u0438\u0442\u0440\u0430 > \u041e\u0444\u043e\u0440\u043c\u043b\u0435\u043d\u0438\u0435 > \u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u043d\u043e\u0432\u0443\u044e \u043e\u0431\u0432\u043e\u0434\u043a\u0443",
      },
      hidden: false,
    },
    menu_Adobe_New_Style_Shortcut: {
      id: "menu_Adobe_New_Style_Shortcut",
      action: "Adobe New Style Shortcut",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Palette > Graphic Styles > New Graphic Style...",
        de: "Anderes Bedienfeld > Neuer Grafikstil \u2026",
        ru: "\u041f\u0430\u043b\u0438\u0442\u0440\u0430 > \u0421\u0442\u0438\u043b\u0438 \u0433\u0440\u0430\u0444\u0438\u043a\u0438 > \u041d\u043e\u0432\u044b\u0439 \u0441\u0442\u0438\u043b\u044c \u0433\u0440\u0430\u0444\u0438\u043a\u0438",
      },
      hidden: false,
    },
    menu_AdobeLayerPalette2: {
      id: "menu_AdobeLayerPalette2",
      action: "AdobeLayerPalette2",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Palette > Layers > New Layer",
        de: "Anderes Bedienfeld > Neue Ebene",
        ru: "\u041f\u0430\u043b\u0438\u0442\u0440\u0430 > \u0421\u043b\u043e\u0438 > \u0421\u043e\u0437\u0434\u0430\u0442\u044c \u043d\u043e\u0432\u044b\u0439 \u0441\u043b\u043e\u0439",
      },
      hidden: false,
    },
    menu_AdobeLayerPalette3: {
      id: "menu_AdobeLayerPalette3",
      action: "AdobeLayerPalette3",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Palette > Layers > New Layer with Dialog...",
        de: "Anderes Bedienfeld > Neue Ebene mit Dialog \u2026",
        ru: "\u041f\u0430\u043b\u0438\u0442\u0440\u0430 > \u0421\u043b\u043e\u0438 > \u0421\u043e\u0437\u0434\u0430\u0442\u044c \u043d\u043e\u0432\u044b\u0439 \u0441 \u043f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u0430\u043c\u0438...",
      },
      hidden: false,
    },
    menu_Adobe_Update_Link_Shortcut: {
      id: "menu_Adobe_Update_Link_Shortcut",
      action: "Adobe Update Link Shortcut",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Palette > Links > Update Link",
        de: "Anderes Bedienfeld > Verkn\u00fcpfung aktualisieren",
        ru: "\u041f\u0430\u043b\u0438\u0442\u0440\u0430 > \u0421\u0432\u044f\u0437\u0438 > \u041e\u0431\u043d\u043e\u0432\u0438\u0442\u044c \u0441\u0432\u044f\u0437\u044c",
      },
      hidden: false,
    },
    menu_Adobe_New_Swatch_Shortcut_Menu: {
      id: "menu_Adobe_New_Swatch_Shortcut_Menu",
      action: "Adobe New Swatch Shortcut Menu",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Palette > Swatches > New Swatch...",
        de: "Anderes Bedienfeld > Neues Farbfeld \u2026",
        ru: "\u041f\u0430\u043b\u0438\u0442\u0440\u0430 > \u041e\u0431\u0440\u0430\u0437\u0446\u044b > \u041d\u043e\u0432\u044b\u0439 \u043e\u0431\u0440\u0430\u0437\u0435\u0446",
      },
      hidden: false,
    },
    menu_Adobe_New_Symbol_Shortcut: {
      id: "menu_Adobe_New_Symbol_Shortcut",
      action: "Adobe New Symbol Shortcut",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Palette > Symbols > New Symbol...",
        de: "Anderes Bedienfeld > Neues Symbol \u2026",
        ru: "\u041f\u0430\u043b\u0438\u0442\u0440\u0430 > \u0421\u0438\u043c\u0432\u043e\u043b\u044b > \u041d\u043e\u0432\u044b\u0439 \u0441\u0438\u043c\u0432\u043e\u043b",
      },
      hidden: false,
    },
    menu_about: {
      id: "menu_about",
      action: "about",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "About Illustrator...",
        de: "\u00dcber Illustrator \u2026",
        ru: "\u041e \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0435 Illustrator\u2026",
      },
      hidden: false,
    },
    menu_preference: {
      id: "menu_preference",
      action: "preference",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Preferences > General...",
        de: "Voreinstellungen > Allgemein \u2026",
        ru: "\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0438 > \u041e\u0441\u043d\u043e\u0432\u043d\u044b\u0435\u2026",
      },
      hidden: false,
    },
    menu_selectPref: {
      id: "menu_selectPref",
      action: "selectPref",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Preferences > Selection & Anchor Display...",
        de: "Voreinstellungen > Auswahl und Ankerpunkt-Anzeige \u2026",
        ru: "\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0438 > \u041e\u0442\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0435 \u0432\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u044f \u0438 \u043e\u043f\u043e\u0440\u043d\u044b\u0445 \u0442\u043e\u0447\u0435\u043a\u2026",
      },
      hidden: false,
    },
    menu_keyboardPref: {
      id: "menu_keyboardPref",
      action: "keyboardPref",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Preferences > Type...",
        de: "Voreinstellungen > Schrift \u2026",
        ru: "\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0438 > \u0422\u0435\u043a\u0441\u0442\u2026",
      },
      hidden: false,
    },
    menu_unitundoPref: {
      id: "menu_unitundoPref",
      action: "unitundoPref",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Preferences > Units...",
        de: "Voreinstellungen > Einheit \u2026",
        ru: "\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0438 > \u0415\u0434\u0438\u043d\u0438\u0446\u044b \u0438\u0437\u043c\u0435\u0440\u0435\u043d\u0438\u044f\u2026",
      },
      hidden: false,
    },
    menu_guidegridPref: {
      id: "menu_guidegridPref",
      action: "guidegridPref",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Preferences > Guides & Grid...",
        de: "Voreinstellungen > Hilfslinien und Raster \u2026",
        ru: "\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0438 > \u041d\u0430\u043f\u0440\u0430\u0432\u043b\u044f\u044e\u0449\u0438\u0435 \u0438 \u0441\u0435\u0442\u043a\u0430\u2026",
      },
      hidden: false,
    },
    menu_snapPref: {
      id: "menu_snapPref",
      action: "snapPref",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Preferences > Smart Guides...",
        de: "Voreinstellungen > Intelligente Hilfslinien \u2026",
        ru: "\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0438 > \u0411\u044b\u0441\u0442\u0440\u044b\u0435 \u043d\u0430\u043f\u0440\u0430\u0432\u043b\u044f\u044e\u0449\u0438\u0435\u2026",
      },
      hidden: false,
    },
    menu_slicePref: {
      id: "menu_slicePref",
      action: "slicePref",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Preferences > Slices...",
        de: "Voreinstellungen > Slices \u2026",
        ru: "\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0438 > \u0424\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u044b\u2026",
      },
      hidden: false,
    },
    menu_hyphenPref: {
      id: "menu_hyphenPref",
      action: "hyphenPref",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Preferences > Hyphenation...",
        de: "Voreinstellungen > Silbentrennung \u2026",
        ru: "\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0438 > \u0420\u0430\u0441\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0430 \u043f\u0435\u0440\u0435\u043d\u043e\u0441\u043e\u0432\u2026",
      },
      hidden: false,
    },
    menu_pluginPref: {
      id: "menu_pluginPref",
      action: "pluginPref",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Preferences > Plug-ins & Scratch Disks...",
        de: "Voreinstellungen > Zusatzmodule und virtueller Speicher \u2026",
        ru: "\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0438 > \u0412\u043d\u0435\u0448\u043d\u0438\u0435 \u043c\u043e\u0434\u0443\u043b\u0438 \u0438 \u0440\u0430\u0431\u043e\u0447\u0438\u0435 \u0434\u0438\u0441\u043a\u0438\u2026",
      },
      hidden: false,
    },
    menu_UIPref: {
      id: "menu_UIPref",
      action: "UIPref",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Preferences > User Interface...",
        de: "Voreinstellungen > Benutzeroberfl\u00e4che \u2026",
        ru: "\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0438 > \u0418\u043d\u0442\u0435\u0440\u0444\u0435\u0439\u0441 \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044f\u2026",
      },
      hidden: false,
    },
    menu_GPUPerformancePref: {
      id: "menu_GPUPerformancePref",
      action: "GPUPerformancePref",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Preferences > Performance",
        de: "Voreinstellungen > Leistung \u2026",
        ru: "\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0438 > \u041f\u0440\u043e\u0438\u0437\u0432\u043e\u0434\u0438\u0442\u0435\u043b\u044c\u043d\u043e\u0441\u0442\u044c\u2026",
      },
      hidden: false,
      minVersion: 19,
    },
    menu_FilePref: {
      id: "menu_FilePref",
      action: "FilePref",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Preferences > File Handling...",
        de: "Voreinstellungen > Dateihandhabung\u2026",
        ru: "\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0438 > \u041e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u0444\u0430\u0439\u043b\u043e\u0432\u2026",
      },
      hidden: false,
    },
    menu_ClipboardPref: {
      id: "menu_ClipboardPref",
      action: "ClipboardPref",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Preferences > Clipboard Handling",
        de: "Voreinstellungen > Zwischenablageoptionen \u2026",
        ru: "\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0438 > \u041e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430 \u0431\u0443\u0444\u0435\u0440\u0430\u2026",
      },
      hidden: false,
      minVersion: 25,
    },
    menu_BlackPref: {
      id: "menu_BlackPref",
      action: "BlackPref",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Preferences > Appearance of Black...",
        de: "Bearbeiten > Voreinstellungen > Aussehen von Schwarz \u2026",
        ru: "\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0438 > \u0412\u043e\u0441\u043f\u0440\u043e\u0438\u0437\u0432\u0435\u0434\u0435\u043d\u0438\u0435 \u0447\u0435\u0440\u043d\u043e\u0433\u043e \u0446\u0432\u0435\u0442\u0430...",
      },
      hidden: false,
    },
    menu_DevicesPref: {
      id: "menu_DevicesPref",
      action: "DevicesPref",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Preferences > Devices",
        de: "Voreinstellungen > Ger\u00e4te \u2026",
        ru: "\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0438 > \u0423\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u0430\u2026",
      },
      hidden: false,
      minVersion: 24,
    },
    menu_Debug_Panel: {
      id: "menu_Debug_Panel",
      action: "Debug Panel",
      type: "menu",
      docRequired: false,
      selRequired: false,
      loc: { en: "Debug Panel", de: "Debug Panel", ru: "Debug Panel" },
      hidden: false,
    },
    tool_Adobe_Add_Anchor_Point_Tool: {
      id: "tool_Adobe_Add_Anchor_Point_Tool",
      action: "Adobe Add Anchor Point Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Add Anchor Point Tool",
        de: "Ankerpunkt-hinzuf\u00fcgen-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u043e\u043f\u043e\u0440\u043d\u0443\u044e \u0442\u043e\u0447\u043a\u0443",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Anchor_Point_Tool: {
      id: "tool_Adobe_Anchor_Point_Tool",
      action: "Adobe Anchor Point Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Anchor Point Tool",
        de: "Ankerpunkt-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041e\u043f\u043e\u0440\u043d\u0430\u044f \u0442\u043e\u0447\u043a\u0430",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Arc_Tool: {
      id: "tool_Adobe_Arc_Tool",
      action: "Adobe Arc Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Arc Tool",
        de: "Bogen-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0414\u0443\u0433\u0430",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Area_Graph_Tool: {
      id: "tool_Adobe_Area_Graph_Tool",
      action: "Adobe Area Graph Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Area Graph Tool",
        de: "Fl\u00e4chendiagramm",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0414\u0438\u0430\u0433\u0440\u0430\u043c\u043c\u0430 \u0441 \u043e\u0431\u043b\u0430\u0441\u0442\u044f\u043c\u0438",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Area_Type_Tool: {
      id: "tool_Adobe_Area_Type_Tool",
      action: "Adobe Area Type Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Area Type Tool",
        de: "Fl\u00e4chentext-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0422\u0435\u043a\u0441\u0442 \u0432 \u043e\u0431\u043b\u0430\u0441\u0442\u0438",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Crop_Tool: {
      id: "tool_Adobe_Crop_Tool",
      action: "Adobe Crop Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Artboard Tool",
        de: "Zeichenfl\u00e4chen-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041c\u043e\u043d\u0442\u0430\u0436\u043d\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Bar_Graph_Tool: {
      id: "tool_Adobe_Bar_Graph_Tool",
      action: "Adobe Bar Graph Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Bar Graph Tool",
        de: "Horizontales Balkendiagramm",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0414\u0438\u0430\u0433\u0440\u0430\u043c\u043c\u0430 \u0433\u043e\u0440\u0438\u0437\u043e\u043d\u0442\u0430\u043b\u044c\u043d\u044b\u0435 \u043f\u043e\u043b\u043e\u0441\u044b",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Blend_Tool: {
      id: "tool_Adobe_Blend_Tool",
      action: "Adobe Blend Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Blend Tool",
        de: "Angleichen-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041f\u0435\u0440\u0435\u0445\u043e\u0434",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Bloat_Tool: {
      id: "tool_Adobe_Bloat_Tool",
      action: "Adobe Bloat Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Bloat Tool",
        de: "Aufblasen-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0420\u0430\u0437\u0434\u0443\u0432\u0430\u043d\u0438\u0435",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Blob_Brush_Tool: {
      id: "tool_Adobe_Blob_Brush_Tool",
      action: "Adobe Blob Brush Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Blob Brush Tool",
        de: "Tropfenpinsel-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041a\u0438\u0441\u0442\u044c-\u043a\u043b\u044f\u043a\u0441\u0430",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Column_Graph_Tool: {
      id: "tool_Adobe_Column_Graph_Tool",
      action: "Adobe Column Graph Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Column Graph Tool",
        de: "Vertikales Balkendiagramm",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0414\u0438\u0430\u0433\u0440\u0430\u043c\u043c\u0430 \u0432\u0435\u0440\u0442\u0438\u043a\u0430\u043b\u044c\u043d\u044b\u0435 \u043f\u043e\u043b\u043e\u0441\u044b",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Cyrstallize_Tool: {
      id: "tool_Adobe_Cyrstallize_Tool",
      action: "Adobe Cyrstallize Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Crystallize Tool",
        de: "Kristallisieren-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041a\u0440\u0438\u0441\u0442\u0430\u043b\u043b\u0438\u0437\u0430\u0446\u0438\u044f",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Curvature_Tool: {
      id: "tool_Adobe_Curvature_Tool",
      action: "Adobe Curvature Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Curvature Tool",
        de: "Kurvenzeichner",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041a\u0440\u0438\u0432\u0438\u0437\u043d\u0430",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Delete_Anchor_Point_Tool: {
      id: "tool_Adobe_Delete_Anchor_Point_Tool",
      action: "Adobe Delete Anchor Point Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Delete Anchor Point Tool",
        de: "Ankerpunkt-l\u00f6schen-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0423\u0434\u0430\u043b\u0438\u0442\u044c \u043e\u043f\u043e\u0440\u043d\u0443\u044e \u0442\u043e\u0447\u043a\u0443",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Dimension_Tool: {
      id: "tool_Adobe_Dimension_Tool",
      action: "Adobe Dimension Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: { en: "Dimension Tool", de: "Dimension Tool", ru: "Dimension Tool" },
      hidden: false,
      minVersion: 28.1,
    },
    tool_Adobe_Direct_Select_Tool: {
      id: "tool_Adobe_Direct_Select_Tool",
      action: "Adobe Direct Select Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Direct Selection Tool",
        de: "Direktauswahl-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041f\u0440\u044f\u043c\u043e\u0435 \u0432\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Ellipse_Shape_Tool: {
      id: "tool_Adobe_Ellipse_Shape_Tool",
      action: "Adobe Ellipse Shape Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Ellipse Tool",
        de: "Ellipse-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u042d\u043b\u043b\u0438\u043f\u0441",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Eraser_Tool: {
      id: "tool_Adobe_Eraser_Tool",
      action: "Adobe Eraser Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Eraser Tool",
        de: "Radiergummi-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041b\u0430\u0441\u0442\u0438\u043a",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Eyedropper_Tool: {
      id: "tool_Adobe_Eyedropper_Tool",
      action: "Adobe Eyedropper Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Eyedropper Tool",
        de: "Pipette-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041f\u0438\u043f\u0435\u0442\u043a\u0430",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Flare_Tool: {
      id: "tool_Adobe_Flare_Tool",
      action: "Adobe Flare Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Flare Tool",
        de: "Blendenflecke-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0411\u043b\u0438\u043a",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Free_Transform_Tool: {
      id: "tool_Adobe_Free_Transform_Tool",
      action: "Adobe Free Transform Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Free Transform Tool",
        de: "Frei-transformieren-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0421\u0432\u043e\u0431\u043e\u0434\u043d\u043e\u0435 \u0442\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Gradient_Vector_Tool: {
      id: "tool_Adobe_Gradient_Vector_Tool",
      action: "Adobe Gradient Vector Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Gradient Tool",
        de: "Verlauf-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0413\u0440\u0430\u0434\u0438\u0435\u043d\u0442",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Direct_Object_Select_Tool: {
      id: "tool_Adobe_Direct_Object_Select_Tool",
      action: "Adobe Direct Object Select Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Group Selection Tool",
        de: "Gruppenauswahl-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0413\u0440\u0443\u043f\u043f\u043e\u0432\u043e\u0435 \u0432\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Scroll_Tool: {
      id: "tool_Adobe_Scroll_Tool",
      action: "Adobe Scroll Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Hand Tool",
        de: "Hand-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0420\u0443\u043a\u0430",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Intertwine_Zone_Marker_Tool: {
      id: "tool_Adobe_Intertwine_Zone_Marker_Tool",
      action: "Adobe Intertwine Zone Marker Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: { en: "Intertwine Tool", de: "Intertwine Tool", ru: "Intertwine Tool" },
      hidden: false,
      minVersion: 27,
    },
    tool_Adobe_Corner_Join_Tool: {
      id: "tool_Adobe_Corner_Join_Tool",
      action: "Adobe Corner Join Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Join Tool",
        de: "Zusammenf\u00fcgen-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0421\u043e\u0435\u0434\u0438\u043d\u0435\u043d\u0438\u0435",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Knife_Tool: {
      id: "tool_Adobe_Knife_Tool",
      action: "Adobe Knife Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Knife Tool",
        de: "Messer-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041d\u043e\u0436",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Direct_Lasso_Tool: {
      id: "tool_Adobe_Direct_Lasso_Tool",
      action: "Adobe Direct Lasso Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Lasso Tool",
        de: "Lasso-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041b\u0430\u0441\u0441\u043e",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Line_Graph_Tool: {
      id: "tool_Adobe_Line_Graph_Tool",
      action: "Adobe Line Graph Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Line Graph Tool",
        de: "Liniendiagramm",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041b\u0438\u043d\u0435\u0439\u043d\u0430\u044f \u0434\u0438\u0430\u0433\u0440\u0430\u043c\u043c\u0430",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Line_Tool: {
      id: "tool_Adobe_Line_Tool",
      action: "Adobe Line Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Line Segment Tool",
        de: "Liniensegment-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041e\u0442\u0440\u0435\u0437\u043e\u043a \u043b\u0438\u043d\u0438\u0438",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Planar_Paintbucket_Tool: {
      id: "tool_Adobe_Planar_Paintbucket_Tool",
      action: "Adobe Planar Paintbucket Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Live Paint Bucket Tool",
        de: "Interaktiv-malen-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0411\u044b\u0441\u0442\u0440\u0430\u044f \u0437\u0430\u043b\u0438\u0432\u043a\u0430",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Planar_Face_Select_Tool: {
      id: "tool_Adobe_Planar_Face_Select_Tool",
      action: "Adobe Planar Face Select Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Live Paint Selection Tool",
        de: "Interaktiv-malen-Auswahlwerkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 \u0431\u044b\u0441\u0442\u0440\u044b\u0445 \u0437\u0430\u043b\u0438\u0432\u043e\u043a",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Magic_Wand_Tool: {
      id: "tool_Adobe_Magic_Wand_Tool",
      action: "Adobe Magic Wand Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Magic Wand Tool",
        de: "Zauberstab-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0412\u043e\u043b\u0448\u0435\u0431\u043d\u0430\u044f \u043f\u0430\u043b\u043e\u0447\u043a\u0430",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Measure_Tool: {
      id: "tool_Adobe_Measure_Tool",
      action: "Adobe Measure Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Measure Tool",
        de: "Mess-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041b\u0438\u043d\u0435\u0439\u043a\u0430",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Mesh_Editing_Tool: {
      id: "tool_Adobe_Mesh_Editing_Tool",
      action: "Adobe Mesh Editing Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Mesh Tool",
        de: "Gitter-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0421\u0435\u0442\u043a\u0430",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Brush_Tool: {
      id: "tool_Adobe_Brush_Tool",
      action: "Adobe Brush Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Paintbrush Tool",
        de: "Pinsel-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041a\u0438\u0441\u0442\u044c",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Freehand_Erase_Tool: {
      id: "tool_Adobe_Freehand_Erase_Tool",
      action: "Adobe Freehand Erase Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Path Eraser Tool",
        de: "L\u00f6schen-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0421\u0442\u0438\u0440\u0430\u043d\u0438\u0435 \u043a\u043e\u043d\u0442\u0443\u0440\u0430",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Pattern_Tile_Tool: {
      id: "tool_Adobe_Pattern_Tile_Tool",
      action: "Adobe Pattern Tile Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Pattern Tile Tool",
        de: "Musterelement-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u042d\u043b\u0435\u043c\u0435\u043d\u0442 \u0443\u0437\u043e\u0440\u0430",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Pen_Tool: {
      id: "tool_Adobe_Pen_Tool",
      action: "Adobe Pen Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Pen Tool",
        de: "Zeichenstift-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041f\u0435\u0440\u043e",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Freehand_Tool: {
      id: "tool_Adobe_Freehand_Tool",
      action: "Adobe Freehand Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Pencil Tool",
        de: "Buntstift-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041a\u0430\u0440\u0430\u043d\u0434\u0430\u0448",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Perspective_Grid_Tool: {
      id: "tool_Perspective_Grid_Tool",
      action: "Perspective Grid Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Perspective Grid Tool",
        de: "Perspektivenraster-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0421\u0435\u0442\u043a\u0430 \u043f\u0435\u0440\u0441\u043f\u0435\u043a\u0442\u0438\u0432\u044b",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Perspective_Selection_Tool: {
      id: "tool_Perspective_Selection_Tool",
      action: "Perspective Selection Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Perspective Selection Tool",
        de: "Perspektivenauswahl-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0412\u044b\u0431\u043e\u0440 \u043f\u0435\u0440\u0441\u043f\u0435\u043a\u0442\u0438\u0432\u044b",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Pie_Graph_Tool: {
      id: "tool_Adobe_Pie_Graph_Tool",
      action: "Adobe Pie Graph Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Pie Graph Tool",
        de: "Kreisdiagramm-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041a\u0440\u0443\u0433\u043e\u0432\u0430\u044f \u0434\u0438\u0430\u0433\u0440\u0430\u043c\u043c\u0430",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Polar_Grid_Tool: {
      id: "tool_Adobe_Polar_Grid_Tool",
      action: "Adobe Polar Grid Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Polar Grid Tool",
        de: "Radiales-Raster-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041f\u043e\u043b\u044f\u0440\u043d\u0430\u044f \u0441\u0435\u0442\u043a\u0430",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Shape_Construction_Regular_Polygon_Tool: {
      id: "tool_Adobe_Shape_Construction_Regular_Polygon_Tool",
      action: "Adobe Shape Construction Regular Polygon Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Polygon Tool",
        de: "Polygon-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041c\u043d\u043e\u0433\u043e\u0443\u0433\u043e\u043b\u044c\u043d\u0438\u043a",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Page_Tool: {
      id: "tool_Adobe_Page_Tool",
      action: "Adobe Page Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Print Tiling Tool",
        de: "Druckaufteilungs-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0420\u0430\u0437\u0431\u0438\u0435\u043d\u0438\u0435 \u0434\u043b\u044f \u043f\u0435\u0447\u0430\u0442\u0438",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Pucker_Tool: {
      id: "tool_Adobe_Pucker_Tool",
      action: "Adobe Pucker Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Pucker Tool",
        de: "Zusammenziehen-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0412\u0442\u044f\u0433\u0438\u0432\u0430\u043d\u0438\u0435",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Puppet_Warp_Tool: {
      id: "tool_Adobe_Puppet_Warp_Tool",
      action: "Adobe Puppet Warp Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Puppet Warp Tool",
        de: "Formgitter-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041c\u0430\u0440\u0438\u043e\u043d\u0435\u0442\u043e\u0447\u043d\u0430\u044f \u0434\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Radar_Graph_Tool: {
      id: "tool_Adobe_Radar_Graph_Tool",
      action: "Adobe Radar Graph Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Radar Graph Tool",
        de: "Netzdiagramm",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0414\u0438\u0430\u0433\u0440\u0430\u043c\u043c\u0430 \u0440\u0430\u0434\u0430\u0440",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Rectangle_Shape_Tool: {
      id: "tool_Adobe_Rectangle_Shape_Tool",
      action: "Adobe Rectangle Shape Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Rectangle Tool",
        de: "Rechteck-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041f\u0440\u044f\u043c\u043e\u0443\u0433\u043e\u043b\u044c\u043d\u0438\u043a",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Rectangular_Grid_Tool: {
      id: "tool_Adobe_Rectangular_Grid_Tool",
      action: "Adobe Rectangular Grid Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Rectangular Grid Tool",
        de: "Rechteckiges-Raster-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041f\u0440\u044f\u043c\u043e\u0443\u0433\u043e\u043b\u044c\u043d\u0430\u044f \u0441\u0435\u0442\u043a\u0430",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Reflect_Tool: {
      id: "tool_Adobe_Reflect_Tool",
      action: "Adobe Reflect Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Reflect Tool",
        de: "Spiegeln-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0417\u0435\u0440\u043a\u0430\u043b\u044c\u043d\u043e\u0435 \u043e\u0442\u0440\u0430\u0436\u0435\u043d\u0438\u0435",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Reshape_Tool: {
      id: "tool_Adobe_Reshape_Tool",
      action: "Adobe Reshape Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Reshape Tool",
        de: "Form-\u00e4ndern-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041f\u0435\u0440\u0435\u0440\u0438\u0441\u043e\u0432\u043a\u0430",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Rotate_Tool: {
      id: "tool_Adobe_Rotate_Tool",
      action: "Adobe Rotate Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Rotate Tool",
        de: "Drehen-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041f\u043e\u0432\u043e\u0440\u043e\u0442",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Rotate_Canvas_Tool: {
      id: "tool_Adobe_Rotate_Canvas_Tool",
      action: "Adobe Rotate Canvas Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Rotate View Tool",
        de: "Ansichtdrehung-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041f\u043e\u0432\u043e\u0440\u043e\u0442 \u0432\u0438\u0434\u0430",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Rounded_Rectangle_Tool: {
      id: "tool_Adobe_Rounded_Rectangle_Tool",
      action: "Adobe Rounded Rectangle Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Rounded Rectangle Tool",
        de: "Abgerundetes-Rechteck-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041f\u0440\u044f\u043c\u043e\u0443\u0433\u043e\u043b\u044c\u043d\u0438\u043a \u0441\u043e \u0441\u043a\u0440\u0443\u0433\u043b\u0435\u043d\u043d\u044b\u043c\u0438 \u0443\u0433\u043b\u0430\u043c\u0438",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Scale_Tool: {
      id: "tool_Adobe_Scale_Tool",
      action: "Adobe Scale Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Scale Tool",
        de: "Skalieren-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041c\u0430\u0441\u0448\u0442\u0430\u0431",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Scallop_Tool: {
      id: "tool_Adobe_Scallop_Tool",
      action: "Adobe Scallop Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Scallop Tool",
        de: "Ausbuchten-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0417\u0443\u0431\u0446\u044b",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Scatter_Graph_Tool: {
      id: "tool_Adobe_Scatter_Graph_Tool",
      action: "Adobe Scatter Graph Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Scatter Graph Tool",
        de: "Streudiagramm",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0422\u043e\u0447\u0435\u0447\u043d\u0430\u044f \u0434\u0438\u0430\u0433\u0440\u0430\u043c\u043c\u0430",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Scissors_Tool: {
      id: "tool_Adobe_Scissors_Tool",
      action: "Adobe Scissors Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Scissors Tool",
        de: "Schere-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041d\u043e\u0436\u043d\u0438\u0446\u044b",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Select_Tool: {
      id: "tool_Adobe_Select_Tool",
      action: "Adobe Select Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Selection Tool",
        de: "Auswahl-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Shape_Builder_Tool: {
      id: "tool_Adobe_Shape_Builder_Tool",
      action: "Adobe Shape Builder Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Shape Builder Tool",
        de: "Formerstellungs-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0421\u043e\u0437\u0434\u0430\u043d\u0438\u0435 \u0444\u0438\u0433\u0443\u0440",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Shaper_Tool: {
      id: "tool_Adobe_Shaper_Tool",
      action: "Adobe Shaper Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Shaper Tool",
        de: "Shaper-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041f\u0440\u043e\u0438\u0437\u0432\u043e\u043b\u044c\u043d\u0430\u044f \u043a\u0440\u0438\u0432\u0430\u044f",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Shear_Tool: {
      id: "tool_Adobe_Shear_Tool",
      action: "Adobe Shear Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Shear Tool",
        de: "Verbiegen-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041d\u0430\u043a\u043b\u043e\u043d",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Slice_Tool: {
      id: "tool_Adobe_Slice_Tool",
      action: "Adobe Slice Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Slice Tool",
        de: "Slice-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0424\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u044b",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Slice_Select_Tool: {
      id: "tool_Adobe_Slice_Select_Tool",
      action: "Adobe Slice Select Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Slice Selection Tool",
        de: "Slice-Auswahl-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 \u0444\u0440\u0430\u0433\u043c\u0435\u043d\u0442\u0430",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Freehand_Smooth_Tool: {
      id: "tool_Adobe_Freehand_Smooth_Tool",
      action: "Adobe Freehand Smooth Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Smooth Tool",
        de: "Gl\u00e4tten-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0421\u0433\u043b\u0430\u0436\u0438\u0432\u0430\u043d\u0438\u0435",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Shape_Construction_Spiral_Tool: {
      id: "tool_Adobe_Shape_Construction_Spiral_Tool",
      action: "Adobe Shape Construction Spiral Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Spiral Tool",
        de: "Spirale-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0421\u043f\u0438\u0440\u0430\u043b\u044c",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Stacked_Bar_Graph_Tool: {
      id: "tool_Adobe_Stacked_Bar_Graph_Tool",
      action: "Adobe Stacked Bar Graph Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Stacked Bar Graph Tool",
        de: "Gestapeltes horizontales Balkendiagramm",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0414\u0438\u0430\u0433\u0440\u0430\u043c\u043c\u0430 \u0433\u043e\u0440\u0438\u0437\u043e\u043d\u0442\u0430\u043b\u044c\u043d\u044b\u0439 \u0441\u0442\u0435\u043a",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Stacked_Column_Graph_Tool: {
      id: "tool_Adobe_Stacked_Column_Graph_Tool",
      action: "Adobe Stacked Column Graph Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Stacked Column Graph Tool",
        de: "Gestapeltes vertikales Balkendiagramm",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0414\u0438\u0430\u0433\u0440\u0430\u043c\u043c\u0430 \u0432\u0435\u0440\u0442\u0438\u043a\u0430\u043b\u044c\u043d\u044b\u0439 \u0441\u0442\u0435\u043a",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Shape_Construction_Star_Tool: {
      id: "tool_Adobe_Shape_Construction_Star_Tool",
      action: "Adobe Shape Construction Star Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Star Tool",
        de: "Stern-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0417\u0432\u0435\u0437\u0434\u0430",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Symbol_Screener_Tool: {
      id: "tool_Adobe_Symbol_Screener_Tool",
      action: "Adobe Symbol Screener Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Symbol Screener Tool",
        de: "Symbol-transparent-gestalten-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041f\u0440\u043e\u0437\u0440\u0430\u0447\u043d\u043e\u0441\u0442\u044c \u0441\u0438\u043c\u0432\u043e\u043b\u043e\u0432",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Symbol_Scruncher_Tool: {
      id: "tool_Adobe_Symbol_Scruncher_Tool",
      action: "Adobe Symbol Scruncher Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Symbol Scruncher Tool",
        de: "Symbol-stauchen-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0423\u043f\u043b\u043e\u0442\u043d\u0435\u043d\u0438\u0435 \u0441\u0438\u043c\u0432\u043e\u043b\u043e\u0432",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Symbol_Shifter_Tool: {
      id: "tool_Adobe_Symbol_Shifter_Tool",
      action: "Adobe Symbol Shifter Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Symbol Shifter Tool",
        de: "Symbol-verschieben-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0421\u043c\u0435\u0449\u0435\u043d\u0438\u0435 \u0441\u0438\u043c\u0432\u043e\u043b\u043e\u0432",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Symbol_Sizer_Tool: {
      id: "tool_Adobe_Symbol_Sizer_Tool",
      action: "Adobe Symbol Sizer Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Symbol Sizer Tool",
        de: "Symbol-skalieren-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0420\u0430\u0437\u043c\u0435\u0440 \u0441\u0438\u043c\u0432\u043e\u043b\u043e\u0432",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Symbol_Spinner_Tool: {
      id: "tool_Adobe_Symbol_Spinner_Tool",
      action: "Adobe Symbol Spinner Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Symbol Spinner Tool",
        de: "Symbol-drehen-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0412\u0440\u0430\u0449\u0435\u043d\u0438\u0435 \u0441\u0438\u043c\u0432\u043e\u043b\u043e\u0432",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Symbol_Sprayer_Tool: {
      id: "tool_Adobe_Symbol_Sprayer_Tool",
      action: "Adobe Symbol Sprayer Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Symbol Sprayer Tool",
        de: "Symbol-aufspr\u00fchen-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0420\u0430\u0441\u043f\u044b\u043b\u0435\u043d\u0438\u0435 \u0441\u0438\u043c\u0432\u043e\u043b\u043e\u0432",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Symbol_Stainer_Tool: {
      id: "tool_Adobe_Symbol_Stainer_Tool",
      action: "Adobe Symbol Stainer Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Symbol Stainer Tool",
        de: "Symbol-f\u00e4rben-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041e\u0431\u0435\u0441\u0446\u0432\u0435\u0447\u0438\u0432\u0430\u043d\u0438\u0435 \u0441\u0438\u043c\u0432\u043e\u043b\u043e\u0432",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Symbol_Styler_Tool: {
      id: "tool_Adobe_Symbol_Styler_Tool",
      action: "Adobe Symbol Styler Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Symbol Styler Tool",
        de: "Symbol-gestalten-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0421\u0442\u0438\u043b\u0438 \u0441\u0438\u043c\u0432\u043e\u043b\u043e\u0432",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Touch_Type_Tool: {
      id: "tool_Adobe_Touch_Type_Tool",
      action: "Adobe Touch Type Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Touch Type Tool",
        de: "Touch-Type-Textwerkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0418\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u0435 \u0442\u0435\u043a\u0441\u0442\u0430",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_New_Twirl_Tool: {
      id: "tool_Adobe_New_Twirl_Tool",
      action: "Adobe New Twirl Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Twirl Tool",
        de: "Strudel-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0412\u043e\u0440\u043e\u043d\u043a\u0430",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Type_Tool: {
      id: "tool_Adobe_Type_Tool",
      action: "Adobe Type Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Type Tool",
        de: "Text-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0422\u0435\u043a\u0441\u0442",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Path_Type_Tool: {
      id: "tool_Adobe_Path_Type_Tool",
      action: "Adobe Path Type Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Type on a Path Tool",
        de: "Pfadtext-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0422\u0435\u043a\u0441\u0442 \u043f\u043e \u043a\u043e\u043d\u0442\u0443\u0440\u0443",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Vertical_Area_Type_Tool: {
      id: "tool_Adobe_Vertical_Area_Type_Tool",
      action: "Adobe Vertical Area Type Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Vertical Area Type Tool",
        de: "Vertikaler-Fl\u00e4chentext-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0412\u0435\u0440\u0442\u0438\u043a\u0430\u043b\u044c\u043d\u044b\u0439 \u0442\u0435\u043a\u0441\u0442 \u0432 \u043e\u0431\u043b\u0430\u0441\u0442\u0438",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Vertical_Type_Tool: {
      id: "tool_Adobe_Vertical_Type_Tool",
      action: "Adobe Vertical Type Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Vertical Type Tool",
        de: "Vertikaler-Text-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0412\u0435\u0440\u0442\u0438\u043a\u0430\u043b\u044c\u043d\u044b\u0439 \u0442\u0435\u043a\u0441\u0442",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Vertical_Path_Type_Tool: {
      id: "tool_Adobe_Vertical_Path_Type_Tool",
      action: "Adobe Vertical Path Type Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Vertical Type on a Path Tool",
        de: "Vertikaler-Pfadtext-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0412\u0435\u0440\u0442\u0438\u043a\u0430\u043b\u044c\u043d\u044b\u0439 \u0442\u0435\u043a\u0441\u0442 \u043f\u043e \u043a\u043e\u043d\u0442\u0443\u0440\u0443",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Warp_Tool: {
      id: "tool_Adobe_Warp_Tool",
      action: "Adobe Warp Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Warp Tool",
        de: "Verkr\u00fcmmen-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0414\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Width_Tool: {
      id: "tool_Adobe_Width_Tool",
      action: "Adobe Width Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Width Tool",
        de: "Breiten-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u0428\u0438\u0440\u0438\u043d\u0430",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Wrinkle_Tool: {
      id: "tool_Adobe_Wrinkle_Tool",
      action: "Adobe Wrinkle Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Wrinkle Tool",
        de: "Zerknittern-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041c\u043e\u0440\u0449\u0438\u043d\u044b",
      },
      hidden: false,
      minVersion: 24,
    },
    tool_Adobe_Zoom_Tool: {
      id: "tool_Adobe_Zoom_Tool",
      action: "Adobe Zoom Tool",
      type: "tool",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Zoom Tool",
        de: "Zoom-Werkzeug",
        ru: "\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442: \u041c\u0430\u0441\u0448\u0442\u0430\u0431",
      },
      hidden: false,
      minVersion: 24,
    },
    config_about: {
      id: "config_about",
      action: "about",
      type: "config",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "About Ai Command Palette...",
        de: "\u00dcber Kurzbefehle \u2026",
        ru: "\u041e\u0431 Ai Command Palette",
      },
      hidden: false,
    },
    config_buildStartup: {
      id: "config_buildStartup",
      action: "buildStartup",
      type: "config",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Startup Commands...",
        de: "Startup Commands...",
        ru: "Startup Commands...",
      },
      hidden: false,
    },
    config_buildWorkflow: {
      id: "config_buildWorkflow",
      action: "buildWorkflow",
      type: "config",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Build Workflow...",
        de: "Arbeitsablauf erstellen \u2026",
        ru: "\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u043d\u0430\u0431\u043e\u0440 \u043a\u043e\u043c\u0430\u043d\u0434",
      },
      hidden: false,
    },
    config_editWorkflow: {
      id: "config_editWorkflow",
      action: "editWorkflow",
      type: "config",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Edit Workflow...",
        de: "Arbeitsablauf bearbeiten \u2026",
        ru: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u043d\u0430\u0431\u043e\u0440 \u043a\u043e\u043c\u0430\u043d\u0434",
      },
      hidden: false,
    },
    builtin_allWorkflows: {
      id: "builtin_allWorkflows",
      action: "allWorkflows",
      type: "builtin",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "All Workflows...",
        de: "Alle Arbeitsabl\u00e4ufe \u2026",
        ru: "All Workflows...",
      },
      hidden: false,
    },
    config_loadScript: {
      id: "config_loadScript",
      action: "loadScript",
      type: "config",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Load Script(s)...",
        de: "Skripte laden \u2026",
        ru: "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u0441\u043a\u0440\u0438\u043f\u0442\u044b",
      },
      hidden: false,
    },
    builtin_allScripts: {
      id: "builtin_allScripts",
      action: "allScripts",
      type: "builtin",
      docRequired: false,
      selRequired: false,
      loc: { en: "All Scripts...", de: "Alle Skripte \u2026", ru: "All Scripts..." },
      hidden: false,
    },
    config_setFileBookmark: {
      id: "config_setFileBookmark",
      action: "setFileBookmark",
      type: "config",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Set File Bookmark(s)...",
        de: "Lesezeichen erstellen \u2026",
        ru: "Set File Bookmark(s)...",
      },
      hidden: false,
    },
    config_setFolderBookmark: {
      id: "config_setFolderBookmark",
      action: "setFolderBookmark",
      type: "config",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Set Folder Bookmark...",
        de: "Lesezeichen-Ordner erstellen \u2026",
        ru: "Set Folder Bookmark...",
      },
      hidden: false,
    },
    builtin_allBookmarks: {
      id: "builtin_allBookmarks",
      action: "allBookmarks",
      type: "builtin",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "All Bookmarks...",
        de: "Alle Lesezeichen \u2026",
        ru: "All Bookmarks...",
      },
      hidden: false,
    },
    builtin_allActions: {
      id: "builtin_allActions",
      action: "allActions",
      type: "builtin",
      docRequired: false,
      selRequired: false,
      loc: { en: "All Actions...", de: "Alle Aktionen \u2026", ru: "All Actions..." },
      hidden: false,
    },
    config_hideCommand: {
      id: "config_hideCommand",
      action: "hideCommand",
      type: "config",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Hide Commands...",
        de: "Befehle ausblenden \u2026",
        ru: "\u0421\u043a\u0440\u044b\u0442\u044c \u043a\u043e\u043c\u0430\u043d\u0434\u044b",
      },
      hidden: false,
    },
    config_unhideCommand: {
      id: "config_unhideCommand",
      action: "unhideCommand",
      type: "config",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Unhide Commands...",
        de: "Befehle einblenden \u2026",
        ru: "\u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c \u043a\u043e\u043c\u0430\u043d\u0434\u044b",
      },
      hidden: false,
    },
    config_deleteCommand: {
      id: "config_deleteCommand",
      action: "deleteCommand",
      type: "config",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Delete Commands...",
        de: "Befehle l\u00f6schen \u2026",
        ru: "\u0423\u0434\u0430\u043b\u0438\u0442\u044c \u043a\u043e\u043c\u0430\u043d\u0434\u044b",
      },
      hidden: false,
    },
    config_enableTypeInSearch: {
      id: "config_enableTypeInSearch",
      action: "enableTypeInSearch",
      type: "config",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Enable Searching on Command Type",
        de: "Enable Searching on Command Type",
        ru: "Enable Searching on Command Type",
      },
      hidden: false,
    },
    config_disableTypeInSearch: {
      id: "config_disableTypeInSearch",
      action: "disableTypeInSearch",
      type: "config",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Disable Searching on Command Type",
        de: "Disable Searching on Command Type",
        ru: "Disable Searching on Command Type",
      },
      hidden: false,
    },
    config_clearRecentCommands: {
      id: "config_clearRecentCommands",
      action: "clearRecentCommands",
      type: "config",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Clear Recent Commands",
        de: "Die letzten Befehle l\u00f6schen",
        ru: "Clear Recent Comands",
      },
      hidden: false,
    },
    config_revealPrefFile: {
      id: "config_revealPrefFile",
      action: "revealPrefFile",
      type: "config",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Reveal Preferences File",
        de: "Einstellungen-Datei anzeigen",
        ru: "\u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c \u0444\u0430\u0439\u043b \u043d\u0430\u0441\u0442\u0440\u043e\u0435\u043a",
      },
      hidden: false,
    },
    builtin_goToArtboard: {
      id: "builtin_goToArtboard",
      action: "goToArtboard",
      type: "builtin",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Go To Artboard...",
        de: "Zeichenfl\u00e4chen ausw\u00e4hlen \u2026",
        ru: "Gehen Sie zur Zeichenfl\u00e4che...",
      },
      hidden: false,
    },
    builtin_goToDocument: {
      id: "builtin_goToDocument",
      action: "goToDocument",
      type: "builtin",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Go To Open Document",
        de: "Ge\u00f6ffnete Dokumente ausw\u00e4hlen \u2026",
        ru: "Go To Open Document",
      },
      hidden: false,
    },
    builtin_goToNamedObject: {
      id: "builtin_goToNamedObject",
      action: "goToNamedObject",
      type: "builtin",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Go To Named Object...",
        de: "Benannte Objekte ausw\u00e4hlen \u2026",
        ru: "\u041f\u0435\u0440\u0435\u0439\u0442\u0438 \u043a \u0438\u043c\u0435\u043d\u043e\u0432\u0430\u043d\u043d\u043e\u043c\u0443 \u043e\u0431\u044a\u0435\u043a\u0442\u0443...",
      },
      hidden: false,
    },
    builtin_redrawWindows: {
      id: "builtin_redrawWindows",
      action: "redrawWindows",
      type: "builtin",
      docRequired: true,
      selRequired: false,
      loc: { en: "Redraw Windows", de: "Fenster aktualisieren", ru: "Redraw Windows" },
      hidden: false,
    },
    builtin_revealActiveDocument: {
      id: "builtin_revealActiveDocument",
      action: "revealActiveDocument",
      type: "builtin",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Reveal Active Document On System",
        de: "Aktuelles Dokument im Dateimanager anzeigen",
        ru: "Reveal Active Document On System",
      },
      hidden: false,
    },
    builtin_documentReport: {
      id: "builtin_documentReport",
      action: "documentReport",
      type: "builtin",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Active Document Report",
        de: "Dokumentinformationen",
        ru: "Active Document Report",
      },
      hidden: false,
    },
    builtin_imageCapture: {
      id: "builtin_imageCapture",
      action: "imageCapture",
      type: "builtin",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Export Active Artboard As PNG",
        de: "Ausgew\u00e4hlte Zeichenfl\u00e4che als PNG exportieren",
        ru: "Export Active Artboard As PNG",
      },
      hidden: false,
    },
    builtin_exportVariables: {
      id: "builtin_exportVariables",
      action: "exportVariables",
      type: "builtin",
      docRequired: true,
      selRequired: false,
      loc: {
        en: "Export Document Variables As XML",
        de: "Variablen als XML exportieren",
        ru: "Export Document Variables As XML",
      },
      hidden: false,
    },
    builtin_recentFiles: {
      id: "builtin_recentFiles",
      action: "recentFiles",
      type: "builtin",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Open Recent File...",
        de: "Letzte Datei \u00f6ffnen \u2026",
        ru: "Open Recent File...",
      },
      hidden: false,
    },
    builtin_recentCommands: {
      id: "builtin_recentCommands",
      action: "recentCommands",
      type: "builtin",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Recent Commands...",
        de: "Letzte Befehle \u2026",
        ru: "Recent Commands...",
      },
      hidden: false,
    },
    config_settings: {
      id: "config_settings",
      action: "settings",
      type: "config",
      docRequired: false,
      selRequired: false,
      loc: {
        en: "Ai Command Palette Settings...",
        de: "Kurzbefehle \u2013 Einstellungen \u2026",
        ru: "\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438",
      },
      hidden: false,
    },
  };
  // CONFIGURATION

  // ENVIRONMENT VARIABLES

  var aiVersion = parseFloat(app.version);
  var locale = $.locale;
  var os = $.os;
  var sysOS = /mac/i.test(os) ? "mac" : "win";
  var windowsFlickerFix = sysOS === "win" && aiVersion < 26.4 ? true : false;
  var settingsRequiredUpdateVersion = "0.10.0";

  // DEVELOPMENT SETTINGS

  // localization testing
  // $.locale = false;
  // $.locale = "de";
  // $.locale = "ru";

  // DIALOG SETTINGS

  var paletteSettings = {};
  paletteSettings.paletteWidth = 600;
  // was informed windows and mac have different listbox row hights so this makes sure exactly 9 rows show
  paletteSettings.paletteHeight = sysOS === "win" ? 211 : 201;
  paletteSettings.bounds = [
    0,
    0,
    paletteSettings.paletteWidth,
    paletteSettings.paletteHeight,
  ];

  paletteSettings.defaultColumns = {};
  paletteSettings.defaultColumns[localize(strings.name_title_case)] = {
    width: 475,
    key: "loc",
  };
  paletteSettings.defaultColumns[localize(strings.type_title_case)] = {
    width: 100,
    key: "type",
  };

  var visibleListItems = 9;
  var recentCommandsCount = 25;

  // MISCELLANEOUS SETTINGS

  var namedObjectLimit = 2000;
  var regexEllipsis = /\.\.\.$/;
  var regexCarrot = /\s>\s/g;

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
      try {
        var settings = readJSONData(file);
        if (settings == {}) return; // FIXME: add alert
        for (var prop in settings) {
          for (var subProp in settings[prop]) {
            data[prop][subProp] = settings[prop][subProp];
          }
        }
      } catch (e) {
        file.rename(file.name + ".bak");
        this.reveal();
        Error.runtimeError(1, localize(strings.pref_file_loading_error));
      }
    }
  };
  settings.save = function () {
    var file = this.file();
    var obj = {
      commands: {
        bookmark: data.commands.bookmark,
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
        searchIncludesType: data.settings.searchIncludesType
          ? data.settings.searchIncludesType
          : false,
        startupCommands: data.settings.startupCommands,
      },
      recent: data.recent,
    };
    writeJSONData(obj, file);
  };
  settings.backup = function () {
    var backupFile = new File(this.file() + ".bak");
    this.file().copy(backupFile);
  };
  settings.reveal = function () {
    var folder = this.folder();
    folder.execute();
  };

  // DEVELOPMENT HELPERS

  var devInfo = {};
  devInfo.folder = function () {
    return settingsFolder;
  };
  devInfo.dataFile = function () {
    var folder = this.folder();
    var file = setupFileObject(folder, "data.json");
    return file;
  };
  devInfo.commandsFile = function () {
    var folder = this.folder();
    var file = setupFileObject(folder, "commands.json");
    return file;
  };
  devInfo.save = function () {
    writeJSONData(data, this.dataFile());
    writeJSONData(commandsData, this.commandsFile());
  };

  /**
   * Show an alert with all object data for a command.
   * @param command Command to show data about.
   */
  function alertCommandData(command) {
    var s = "";
    for (var prop in command) {
      var subS = "";
      if (typeof command[prop] == "object") {
        for (var subProp in command[prop]) {
          subS += "> " + subProp + ": " + command[prop][subProp] + "\n";
        }
        s += prop + ":\n" + subS;
      } else {
        s += prop + ": " + command[prop] + "\n";
      }
    }
    alert(s);
  }
  /**
   * Check to see if there is an active document.
   * @returns Make sure at least one document is open for certain built-in commands.
   */
  function activeDocument() {
    if (app.documents.length < 1) {
      alert(localize(strings.no_active_document));
      return false;
    }
    return true;
  }

  /**
   * Compare semantic version numbers.
   * @param {String} a Semantic version number.
   * @param {String} b Semantic version number.
   * @returns          1 if `a` > `b`, -1 if `b` > `a`, 0 if `a` == `b`.
   */
  function semanticVersionComparison(a, b) {
    if (a === b) {
      return 0;
    }

    var a_components = a.split(".");
    var b_components = b.split(".");

    var len = Math.min(a_components.length, b_components.length);

    // loop while the components are equal
    for (var i = 0; i < len; i++) {
      // A bigger than B
      if (parseInt(a_components[i]) > parseInt(b_components[i])) {
        return 1;
      }

      // B bigger than A
      if (parseInt(a_components[i]) < parseInt(b_components[i])) {
        return -1;
      }
    }

    // If one's a prefix of the other, the longer one is greater.
    if (a_components.length > b_components.length) {
      return 1;
    }

    if (a_components.length < b_components.length) {
      return -1;
    }
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
   * Get info for all placed files for the current document.
   * @returns {Array} Placed file information.
   */
  function getPlacedFileInfoForReport() {
    if (ExternalObject.AdobeXMPScript == undefined)
      ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");
    //Read xmp string - You can see document XMP in Illustrator -> File-> File Info -> Raw Data
    var xmp = new XMPMeta(app.activeDocument.XMPString);

    var names = [];
    var allFilePaths = getAllPlacedFilePaths(xmp);
    // var brokenFilePaths = getBrokenFilePaths(xmp);

    // convert path to file object for property access
    var fileObjects = [];
    for (var i = 0; i < allFilePaths.length; i++) {
      fileObjects.push(new File(allFilePaths[i]));
    }
    // sort the files by name
    fileObjects.sort(function (a, b) {
      return a.name - b.name;
    });
    // build string with file info for the report
    var f;
    for (var i = 0; i < fileObjects.length; i++) {
      f = fileObjects[i];
      names.push(
        localize(strings.dr_name) +
          decodeURI(f.name) +
          "\n" +
          localize(strings.dr_path) +
          f.fsName.replace(f.name, "") +
          "\n" +
          localize(strings.dr_file_found) +
          f.exists.toString().toUpperCase() +
          (i == fileObjects.length - 1 ? "" : "\n")
      );
    }
    return names;
  }

  /**
   * Great trick to get all placed files (linked and embeded) @pixxxelschubser
   * https://community.adobe.com/t5/user/viewprofilepage/user-id/7720512
   *
   * If you try to do this using the placedItems collection from the API you will have issues.
   */

  /**
   * Great trick to get all placed files (linked and embeded) @pixxxelschubser
   * https://community.adobe.com/t5/user/viewprofilepage/user-id/7720512
   *
   * If you try to do this using the placedItems collection from the API you will have issues.
   * @param   {String} xmp Document xml data.
   * @returns {Array}      Placed file paths.
   */
  function getAllPlacedFilePaths(xmp) {
    //Read file paths from XMP - this returns file paths of both embedded and linked images
    var paths = [];
    var xpath;
    for (var i = 1; i <= xmp.countArrayItems(XMPConst.NS_XMP_MM, "Manifest"); i++) {
      xpath = "xmpMM:Manifest[" + i + "]/stMfs:reference/stRef:filePath";
      paths.push(xmp.getProperty(XMPConst.NS_XMP_MM, xpath).value);
    }
    return paths;
  }

  /**
   * Check for any placed files with broken links in the current document.
   * @param   {String} xmp Document xml data.
   * @returns {Array}      Broken placed file paths.
   */
  function getBrokenFilePaths(xmp) {
    //Read file paths from XMP - this returns file paths of both embedded and linked images
    var paths = [];
    var xpath;
    for (var i = 1; i <= xmp.countArrayItems(XMPConst.NS_XMP_MM, "Ingredients"); i++) {
      xpath = "xmpMM:Ingredients[" + i + "]/stRef:filePath";
      paths.push(xmp.getProperty(XMPConst.NS_XMP_MM, xpath).value);
    }
    return paths;
  }

  /**
   * Return the names of each object in an Ai collection object.
   * https://ai-scripting.docsforadobe.dev/scripting/workingWithObjects.html?highlight=collection#collection-objects
   * @param   {Object} collection Ai collection object.
   * @returns {Array}             Names of each object inside of `collection`.
   */

  /**
   * Return the names of each object in an Ai collection object.
   * https://ai-scripting.docsforadobe.dev/scripting/workingWithObjects.html?highlight=collection#collection-objects
   * @param {Object}  collection Ai collection object.
   * @param {Boolean} sorted     Should the results be sorted.
   * @returns {Array}            Names of each object inside of `collection`.
   */
  function getCollectionObjectNames(collection, sorted) {
    sorted = typeof sorted !== "undefined" ? sorted : false;
    names = [];
    if (collection.length > 0) {
      for (var i = 0; i < collection.length; i++) {
        if (collection.typename == "Spots") {
          if (collection[i].name != "[Registration]") {
            names.push(collection[i].name);
          }
        } else {
          names.push(collection[i].name);
        }
      }
    }
    return sorted ? names.sort() : names;
  }

  /**
   * Return recently opened files as file objects (also found in File > Open Recent Files).
   * @returns {Array} Recent file paths.
   */
  function getRecentFilePaths() {
    var path;
    var paths = [];
    var fileCount = app.preferences.getIntegerPreference("RecentFileNumber");
    for (var i = 0; i < fileCount; i++) {
      path = app.preferences.getStringPreference(
        "plugin/MixedFileList/file" + i + "/path"
      );
      paths.push(path);
    }
    return paths;
  }

  /**************************************************
  DIALOG HELPER FUNCTIONS
  **************************************************/

  /**
   * Filter the supplied commands by multiple factors.
   * @param   {Array}   commandIds Command `id`s to filter through.
   * @param   {Array}   types Types of commands to include in the results (e.g. builtin, tool, config, etc.).
   * @param   {Boolean} showHidden Should user-hidden or non-relevant commands be included?
   * @param   {Array}   hideSpecificCommands Future me including a hack to hide specific commands.
   * @param   {Boolean} docRequired Should commands requiring an active document be included.
   * @param   {Boolean} selRequired Should commands requiring an active selection be included.
   * @returns {Array}   Filtered commands objects.
   */
  function filterCommands(
    commands,
    types,
    showHidden,
    hideSpecificCommands,
    docRequired,
    selRequired
  ) {
    var filteredCommands = [];
    var id, command;
    commands = commands ? commands : Object.keys(commandsData);
    for (var i = 0; i < commands.length; i++) {
      id = commands[i];
      if (!commandsData.hasOwnProperty(id)) continue;
      command = commandsData[id];
      // hide commands requiring an active documents if requested
      if (docRequired && !appDocuments && command.docRequired) continue;
      // hide commands requiring an active selection if requested
      if (selRequired && !docSelection && command.selRequired) continue;
      // make sure Ai version meets command requirements
      if (!versionCheck(command)) continue;
      // skip any hidden commands
      if (!showHidden && command.hidden) continue;
      // skip any specific commands name in hideSpecificCommands
      if (hideSpecificCommands && hideSpecificCommands.includes(id)) continue;
      // then check to see if the command should be included
      if (!types || types.includes(command.type)) filteredCommands.push(id);
    }
    return filteredCommands;
  }

  /**
   * Score array items based on regex string match.
   * @param   {String} query    String to search for.
   * @param   {Array}  commands Commands to match `query` against.
   * @returns {Array}           Matching items sorted by score.
   */
  function scoreMatches(query, commands) {
    var words = [];
    var matches = [];
    var bestMatches = [];
    var scores = {};
    var maxScore = 0;
    query = query.toLowerCase();
    var words = query.split(" ");
    var id, command, name, type, score, strippedString;
    for (var i = 0; i < commands.length; i++) {
      id = commands[i];
      command = commandsData[id];
      if (command.hasOwnProperty("loc")) {
        name = localize(command.loc).toLowerCase();
      } else if (command.hasOwnProperty("name")) {
        name = command.name.toLowerCase();
      } else {
        name = id.toLowerCase().replace("_", " "); // FIXME: not sure about this
      }
      if (strings.hasOwnProperty(command.type)) {
        type = localize(strings[command.type]).toLowerCase();
      } else {
        type = command.type.toLowerCase();
      }
      strippedString = name.replace(regexEllipsis, "").replace(regexCarrot, " ");
      score = 0;

      // check for exact match
      if (
        query == name ||
        query.replace(regexEllipsis, "").replace(regexCarrot, " ") == strippedString
      ) {
        score += 1;
      }

      // check for type match
      // FIXME: reenable
      // if (data.settings.searchIncludesType && query == type) {
      //   score += 1;
      // }

      // check for singular word matches
      var word;
      for (var n = 0; n < words.length; n++) {
        word = words[n];
        if (!word) continue;
        // FIXME: reenable
        // if (
        //   name.match("\\b" + word, "gi") != null ||
        //   strippedString.match("\\b" + word, "gi") != null ||
        //   (data.settings.searchIncludesType && type.match("\\b" + word, "gi") != null)
        // )
        if (
          name.match("\\b" + word, "gi") != null ||
          strippedString.match("\\b" + word, "gi") != null
        )
          score += word.length;
      }

      // updated scores for matches
      if (score > 0) {
        // increase score if command found in recent commands
        // FIXME: reenable
        // if (score == maxScore && data.recent.commands.indexOf(command.id) > -1) {
        //   score++;
        // }
        scores[id] = score;
        matches.push(id);
        if (score > maxScore) maxScore = score;
      }
    }

    // limit the matching commands to only the highest scoring matches
    for (var m = 0; m < matches.length; m++) {
      if (scores[matches[m]] >= maxScore / 2) bestMatches.push(matches[m]);
    }

    // sort the matches by score
    bestMatches.sort(function (a, b) {
      return scores[b] - scores[a];
    });

    return bestMatches;
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
        AiCommandPaletteSettings();
        write = false;
        break;
      case "about":
        about();
        write = false;
        break;
      case "buildStartup":
        buildStartup();
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
      case "setFileBookmark":
        loadFileBookmark();
        write = true;
        break;
      case "setFolderBookmark":
        loadFolderBookmark();
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
      case "enableTypeInSearch":
      case "disableTypeInSearch":
        data.settings.searchIncludesType = !data.settings.searchIncludesType;
        break;
      case "clearRecentCommands":
        if (
          !confirm(
            localize(strings.cd_clear_recent_confirm),
            "noAsDflt",
            localize(strings.cd_exception)
          )
        )
          return;
        data.recent.commands = [];
        alert(localize(strings.recent_commands_cleared));
        break;
      case "revealPrefFile":
        settings.reveal();
        write = false;
        break;
      default:
        alert(localize(strings.cd_invalid, action));
    }
    if (!write) return;
    settings.save();
  }

  /**
   * Execute built-in actions.
   * @param {Object} action Built-in action to execute.
   */
  function builtinAction(action) {
    switch (action) {
      case "recentCommands":
        recentCommands();
        break;
      case "allWorkflows":
        showAllWorkflows();
        break;
      case "allScripts":
        showAllScripts();
        break;
      case "allBookmarks":
        showAllBookmarks();
        break;
      case "allActions":
        showAllActions();
        break;
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
      case "recentFiles":
        recentFiles();
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
            alert(localize(strings.active_document_not_saved));
          }
        }
        break;
      default:
        alert(localize(strings.cd_invalid, action));
    }
  }

  /** Ai Command Palette configuration commands. */
  function AiCommandPaletteSettings() {
    var configCommands = filterCommands(
      (commands = commandsData),
      (types = ["config"]),
      (showHidden = false),
      (hideCommands = null),
      (docRequired = false),
      (selRequired = false)
    );
    var result = commandPalette(
      (commands = configCommands),
      (title = localize(strings.cp_config)),
      (columns = paletteSettings.defaultColumns),
      (multiselect = false)
    );
    if (!result) return;
    processCommand(result);
  }

  /** Ai Command Palette About Dialog. */
  function about() {
    var win = new Window("dialog");
    win.text = localize(strings.about);
    win.alignChildren = "fill";

    // script info
    var pAbout = win.add("panel");
    pAbout.margins = 20;
    pAbout.alignChildren = "fill";
    pAbout.add("statictext", [0, 0, 500, 100], localize(strings.description), {
      multiline: true,
    });

    var links = pAbout.add("group");
    links.orientation = "column";
    links.alignChildren = ["center", "center"];
    links.add("statictext", undefined, localize(strings.version, _version));
    links.add("statictext", undefined, localize(strings.copyright));
    var githubText =
      localize(strings.github) + ": https://github.com/joshbduncan/AiCommandPalette";
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

  function buildStartup() {
    var availableStartupCommands = filterCommands(
      (commands = commandsData),
      (types = [
        "bookmark",
        "script",
        "workflow",
        "menu",
        "tool",
        "action",
        "builtin",
        "config",
      ]),
      (showHidden = false),
      (hideCommands = []),
      (docRequired = true),
      (selRequired = true)
    );
    // show the workflow builder dialog
    var result = startupBuilder(availableStartupCommands);
    if (!result) return;
    var previousStartupCommands = data.settings.startupCommands;
    try {
      var startupCommands = [];
      for (var i = 0; i < result.length; i++) {
        startupCommands.push(result[i].commandId);
      }
      data.settings.startupCommands = startupCommands;
    } catch (e) {
      alert(localize(strings.startup_error_saving));
      data.settings.startupCommands = previousStartupCommands;
    }
  }

  /** Document Info Dialog */
  function documentReport() {
    // setup the basic document info
    var rulerUnits = app.activeDocument.rulerUnits.toString().split(".").pop();
    var fileInfo =
      localize(strings.dr_header) +
      localize(strings.dr_filename) +
      app.activeDocument.name +
      "\n" +
      localize(strings.dr_path) +
      (app.activeDocument.path.fsName
        ? app.activeDocument.path.fsName
        : localize(strings.none)) +
      "\n" +
      localize(strings.dr_color_space) +
      app.activeDocument.documentColorSpace.toString().split(".").pop() +
      "\n" +
      localize(strings.dr_width) +
      convertPointsTo(app.activeDocument.width, rulerUnits) +
      " " +
      rulerUnits +
      "\n" +
      localize(strings.dr_height) +
      convertPointsTo(app.activeDocument.height, rulerUnits) +
      " " +
      rulerUnits;

    // generate all optional report information (all included by default)
    var reportOptions = {
      artboards: {
        str: getCollectionObjectNames(app.activeDocument.artboards)
          .toString()
          .replace(/,/g, "\n"),
        active: true,
      },
      fonts: {
        str: getCollectionObjectNames(getDocumentFonts(app.activeDocument), true)
          .toString()
          .replace(/,/g, "\n"),
        active: true,
      },
      layers: {
        str: getCollectionObjectNames(app.activeDocument.layers)
          .toString()
          .replace(/,/g, "\n"),
        active: true,
      },
      placed_items: {
        str: getPlacedFileInfoForReport().toString().replace(/,/g, "\n"),
        active: true,
      },
      spot_colors: {
        str: getCollectionObjectNames(app.activeDocument.spots, true)
          .toString()
          .replace(/,/g, "\n"),
        active: true,
      },
    };

    // build the report from the selected options (active = true)
    function buildReport() {
      if (!app.activeDocument.saved) alert(localize(strings.document_report_warning));

      var infoString = localize(strings.dr_info_string) + "\n\n" + fileInfo;
      for (var p in reportOptions) {
        if (reportOptions[p].active && reportOptions[p].str) {
          infoString +=
            "\n\n" +
            localize(strings[p.toLowerCase()]) +
            "\n-----\n" +
            reportOptions[p].str;
        }
      }
      infoString += "\n\n" + localize(strings.dr_file_created) + new Date();
      return infoString;
    }

    // setup the dialog
    var win = new Window("dialog");
    win.text = localize(strings.document_report);
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
    });

    // window buttons
    var winButtons = win.add("group");
    winButtons.orientation = "row";
    winButtons.alignChildren = ["center", "center"];
    var saveInfo = winButtons.add("button", undefined, localize(strings.save));
    saveInfo.preferredSize.width = 100;
    var close = winButtons.add("button", undefined, localize(strings.close), {
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
          f.write(info.text);
          f.close();
        } catch (e) {
          alert(localize(strings.fl_error_writing, f));
        }
        if (f.exists) alert(localize(strings.file_saved, f.fsName));
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
          alert(localize(strings.fl_error_writing, f));
        }
        // if chosen file name doesn't end in ".png" add the
        // correct extension so they captured file open correctly
        if (f.name.indexOf(".png") < f.name.length - 4)
          f.rename(f.name.toString() + ".png");
        if (f.exists) alert(localize(strings.file_saved, f.fsName));
      }
    }
  }

  /**
   *
   * https://ai-scripting.docsforadobe.dev/jsobjref/Document.html#document-exportvariables
   */
  function exportVariables() {
    if (app.activeDocument.variables.length > 0) {
      var f = File.saveDialog();
      if (f) {
        try {
          app.activeDocument.exportVariables(f);
        } catch (e) {
          alert(localize(strings.fl_error_writing, f));
        }
        if (f.exists) alert(localize(strings.file_saved, f.fsName));
      }
    } else {
      alert(localize(strings.no_document_variables));
    }
  }

  /** Set bookmarked file to open in Ai from within Ai Command Palette. */
  function loadFileBookmark() {
    var acceptedTypes = [
      ".ai",
      ".ait",
      ".pdf",
      ".dxf",
      ".avif",
      ".BMP",
      ".RLE",
      ".DIB",
      ".cgm",
      ".cdr",
      ".eps",
      ".epsf",
      ".ps",
      ".emf",
      ".gif",
      ".heic",
      ".heif",
      ".eps",
      ".epsf",
      ".ps",
      ".jpg",
      ".jpe",
      ".jpeg",
      ".jpf",
      ".jpx",
      ".jp2",
      ".j2k",
      ".j2c",
      ".jpc",
      ".rtf",
      ".doc",
      ".docx",
      ".PCX",
      ".psd",
      ".psb",
      ".pdd",
      ".PXR",
      ".png",
      ".pns",
      ".svg",
      ".svgz",
      ".TGA",
      ".VDA",
      ".ICB",
      ".VST",
      ".txt",
      ".tif",
      ".tiff",
      ".webp",
      ".wmf",
    ]; // file types taken from Ai open dialog
    re = new RegExp(acceptedTypes.toString().replace(/,/g, "|") + "$", "i");
    var files = loadFileTypes(localize(strings.bm_set_bookmark), true, re);
    if (files.length > 0) {
      var f, fname;
      for (var i = 0; i < files.length; i++) {
        f = files[i];
        fname = decodeURI(f.name);
        if (data.commands.bookmark.hasOwnProperty(fname)) {
          if (
            !confirm(
              localize(strings.bm_already_loaded),
              "noAsDflt",
              localize(strings.bm_already_loaded_title)
            )
          )
            continue;
        }
        try {
          data.commands.bookmark[fname] = {
            type: "bookmark",
            path: f.fsName,
            bookmarkType: "file",
          };
        } catch (e) {
          alert(localize(strings.bm_error_loading, f.fsName));
        }
      }
    }
  }

  /** Set bookmarked folder to open on system from within Ai Command Palette. */
  function loadFolderBookmark() {
    var f, fname;
    f = Folder.selectDialog(localize(strings.bm_set_bookmark));
    if (f) {
      fname = decodeURI(f.name);
      if (data.commands.bookmark.hasOwnProperty(fname)) {
        if (
          !confirm(
            localize(strings.bm_already_loaded),
            "noAsDflt",
            localize(strings.bm_already_loaded_title)
          )
        )
          return;
      }
      try {
        data.commands.bookmark[fname] = {
          type: "bookmark",
          path: f.fsName,
          bookmarkType: "folder",
        };
      } catch (e) {
        alert(localize(strings.bm_error_loading, f.fsName));
      }
    }
  }

  /** Load external scripts into Ai Command Palette. */
  function loadScripts() {
    var acceptedTypes = [".jsx", ".js"];
    re = new RegExp(acceptedTypes.toString().replace(/,/g, "|") + "$", "i");
    var files = loadFileTypes(localize(strings.sc_load_script), true, ".jsx$|.js$");
    if (files.length > 0) {
      var f, fname;
      for (var i = 0; i < files.length; i++) {
        f = files[i];
        fname = decodeURI(f.name);
        if (data.commands.script.hasOwnProperty(fname)) {
          if (
            !confirm(
              localize(strings.sc_already_loaded),
              "noAsDflt",
              localize(strings.sc_already_loaded_title)
            )
          )
            continue;
        }
        try {
          data.commands.script[fname] = { type: "script", path: f.fsName };
        } catch (e) {
          alert(localize(strings.sc_error_loading, f.fsName));
        }
      }
    } else {
      alert(localize(strings.sc_none_selected));
    }
  }

  /** Show all scripts. */
  function showAllScripts() {
    var scriptCommands = filterCommands(
      (commands = commandsData),
      (types = ["script"]),
      (showHidden = false),
      (hideCommands = null),
      (docRequired = false),
      (selRequired = false)
    );
    var result = commandPalette(
      (commands = scriptCommands),
      (title = localize(strings.Scripts)),
      (columns = paletteSettings.defaultColumns),
      (multiselect = false)
    );
    if (!result) return;
    processCommand(result);
  }

  /** Show all bookmarks. */
  function showAllBookmarks() {
    var bookmarkCommands = filterCommands(
      (commands = commandsData),
      (types = ["bookmark"]),
      (showHidden = false),
      (hideCommands = null),
      (docRequired = false),
      (selRequired = false)
    );
    var result = commandPalette(
      (commands = bookmarkCommands),
      (title = localize(strings.Bookmarks)),
      (columns = paletteSettings.defaultColumns),
      (multiselect = false)
    );
    if (!result) return;
    processCommand(result);
  }

  /** Show all actions. */
  function showAllActions() {
    var actionCommands = filterCommands(
      (commands = commandsData),
      (types = ["action"]),
      (showHidden = false),
      (hideCommands = null),
      (docRequired = false),
      (selRequired = false)
    );
    var columns = {
      Name: { width: 475, key: "localizedName" },
      "Action Set": { width: 100, key: "set" },
    };
    var result = commandPalette(
      (commands = actionCommands),
      (title = localize(strings.Actions)),
      (columns = columns),
      (multiselect = false)
    );
    if (!result) return;
    processCommand(result);
  }

  /** Hide commands from Ai Command Palette. */
  function hideCommand() {
    var hideableCommands = filterCommands(
      (commands = commandsData),
      (types = ["bookmark", "script", "workflow", "menu", "tool", "action", "builtin"]),
      (showHidden = false),
      (hideCommands = null),
      (docRequired = false),
      (selRequired = false)
    );
    var result = commandPalette(
      (commands = hideableCommands),
      (title = localize(strings.cd_hide_select)),
      (columns = paletteSettings.defaultColumns),
      (multiselect = true)
    );
    if (!result) return;
    for (var i = 0; i < result.length; i++) {
      if (hiddenCommands.includes(result[i].id)) continue;
      data.settings.hidden.push(result[i].id);
    }
  }

  /** Unhide hidden commands. */
  function unhideCommand() {
    var hiddenCommands = [];
    for (var i = 0; i < data.settings.hidden.length; i++) {
      if (!commandsData.hasOwnProperty(data.settings.hidden[i])) {
        // FIXME: add alert
        data.settings.hidden.splice(i, 1);
        continue;
      }
      hiddenCommands.push(commandsData[data.settings.hidden[i]]);
    }
    var result = commandPalette(
      (commands = hiddenCommands),
      (title = localize(strings.cd_reveal_menu_select)),
      (columns = paletteSettings.defaultColumns),
      (multiselect = true)
    );
    if (!result) return;
    for (var i = 0; i < result.length; i++) {
      data.settings.hidden.splice(data.settings.hidden.indexOf(result[i].id), 1);
    }
  }

  /** Delete commands from Ai Command Palette. */
  function deleteCommand() {
    var deletableCommands = filterCommands(
      (commands = commandsData),
      (types = ["bookmark", "script", "workflow"]),
      (showHidden = false),
      (hideCommands = null),
      (docRequired = false),
      (selRequired = false)
    );
    var result = commandPalette(
      (commands = deletableCommands),
      (title = localize(strings.cd_delete_select)),
      (columns = paletteSettings.defaultColumns),
      (multiselect = true)
    );
    if (!result) return;
    var commandNames = [];
    for (var i = 0; i < result.length; i++)
      names += commandNames.push(result[i].localizedName);
    if (
      confirm(
        localize(strings.cd_delete_confirm, commandNames.join("\n")),
        "noAsDflt",
        localize(strings.cd_delete_confirm_title)
      )
    ) {
      for (var i = 0; i < result.length; i++) {
        try {
          delete data.commands[result[i].type][result[i].id];
        } catch (e) {
          alert(localize(strings.cd_error_delete, command));
        }
      }
    }
  }

  // BUILT-IN COMMANDS

  /** Present a command palette with all open documents and goto the chosen one. */
  function goToOpenDocument() {
    var documentLookup = {};
    var openDocuments = [];
    var curDocument, documentName;
    for (var i = 0; i < app.documents.length; i++) {
      curDocument = app.documents[i];
      var colormode =
        " (" + curDocument.documentColorSpace.toString().split(".").pop() + ")";
      documentName =
        curDocument == app.activeDocument
          ? "x " + curDocument.name + " " + colormode
          : "   " + curDocument.name + " " + colormode;
      openDocuments.push({ name: documentName, type: localize(strings.document) });
      documentLookup[documentName] = curDocument;
    }
    var result = commandPalette(
      (commands = openDocuments),
      (title = localize(strings.go_to_open_document)),
      (multiselect = false)
    );
    if (!result) return;
    documentLookup[result].activate();
  }

  /** Present a command palette with all artboards and zoom to the chosen one. */
  function goToArtboard() {
    var artboardLookup = {};
    var artboards = [];
    var abName;
    for (var i = 0; i < app.activeDocument.artboards.length; i++) {
      abName = "#" + i + "  " + app.activeDocument.artboards[i].name;
      artboards.push({ name: abName, type: localize(strings.artboard) });
      artboardLookup[abName] = i;
    }
    var result = commandPalette(
      (commands = artboards),
      (title = localize(strings.go_to_artboard)),
      (multiselect = false)
    );
    if (!result) return;
    app.activeDocument.artboards.setActiveArtboardIndex(artboardLookup[result]);
    app.executeMenuCommand("fitin");
  }

  /** Present a command palette with all named objects and zoom to and select the chosen one. */
  function goToNamedObject() {
    if (app.activeDocument.pageItems.length > namedObjectLimit)
      alert(
        localize(strings.go_to_named_object_limit, app.activeDocument.pageItems.length)
      );
    var objectLookup = {};
    var namedObjects = [];
    var item, itemName, itemType;
    for (var i = 0; i < app.activeDocument.pageItems.length; i++) {
      item = app.activeDocument.pageItems[i];
      if (
        item.name ||
        item.name.length ||
        item.typename == "PlacedItem" ||
        item.typename == "SymbolItem"
      ) {
        if (item.typename == "PlacedItem") {
          itemName = item.file.name;
        } else if (item.typename == "SymbolItem") {
          itemName = item.name || item.name.length ? item.name : item.symbol.name;
        } else {
          itemName = item.name;
        }
      }
      itemName += " (" + item.layer.name + ")";
      namedObjects.push({ name: itemName, type: item.typename });
      objectLookup[itemName] = item;
    }
    if (!namedObjects.length) alert(localize(strings.go_to_named_object_no_objects));
    var result = commandPalette(
      (commands = namedObjects),
      (title = localize(strings.go_to_named_object)),
      (multiselect = false)
    );
    if (!result) return;
    app.activeDocument.selection = null;
    item = objectLookup[result];
    item.selected = true;

    // reset zoom for current document
    app.activeDocument.views[0].zoom = 1;

    // get screen information
    var screenBounds = app.activeDocument.views[0].bounds;
    var screenW = screenBounds[2] - screenBounds[0];
    var screenH = screenBounds[1] - screenBounds[3];

    // get the (true) visible bounds of the returned object
    var bounds = item.visibleBounds;
    var itemW = bounds[2] - bounds[0];
    var itemH = bounds[1] - bounds[3];
    var itemCX = bounds[0] + itemW / 2;
    var itemCY = bounds[1] - itemH / 2;

    // reset the current view to center of selected object
    app.activeDocument.views[0].centerPoint = [itemCX, itemCY];

    // calculate new zoom ratio to fit view to selected object
    var zoomRatio;
    if (itemW * (screenH / screenW) >= itemH) {
      zoomRatio = screenW / itemW;
    } else {
      zoomRatio = screenH / itemH;
    }

    // set zoom to fit selected object plus a bit of padding
    var padding = 0.9;
    app.activeDocument.views[0].zoom = zoomRatio * padding;
  }

  /** Present a command palette with all recently open files and open the chosen one. */
  function recentFiles() {
    var f, path;
    var filePaths = getRecentFilePaths();
    var files = {};
    var recentFileCommands = [];
    for (var i = 0; i < filePaths.length; i++) {
      path = filePaths[i];
      f = File(path);
      if (!f.exists) continue;
      fname = decodeURI(f.name);
      files[fname] = f;
      recentFileCommands.push({ name: fname, type: localize(strings.file) });
    }
    var result = commandPalette(
      (commands = recentFileCommands),
      (title = localize(strings.open_recent_file)),
      (multiselect = false)
    );
    if (!result) return;
    try {
      app.open(files[result]);
    } catch (e) {
      alert(localize(strings.fl_error_loading, result));
    }
  }

  /** Present a command palette with more recent commands and process the selected one. */
  function recentCommands() {
    var recentCommands = [];
    for (var i = 0; i < data.recent.commands.length; i++) {
      if (!commandsData.hasOwnProperty(data.recent.commands[i])) {
        // FIXME: add alert
        data.recent.commands.splice(i, 1);
        continue;
      }
      recentCommands.push(commandsData[data.recent.commands[i]]);
    }
    var result = commandPalette(
      (commands = recentCommands),
      (title = localize(strings.recent_commands)),
      (columns = paletteSettings.defaultColumns),
      (multiselect = false)
    );
    if (!result) return;
    processCommand(result);
  }
  // COMMANDS SETUP

  /**
   * Build proper command objects for easy access.
   * @param commands  Command objects to build.
   * @param filterOut Command types to ignore.
   */
  function buildCommands(commands, filterOut) {
    var type;
    for (type in commands) {
      if (filterOut && filterOut.includes(type)) continue;
      var command, commandData, hidden;
      for (command in commands[type]) {
        commandData = commands[type][command];
        hidden = false;
        // hide user hidden commands
        if (data.settings.hidden.includes(command)) hidden = true;
        // hide `Edit Workflow...` command if no workflows
        if (
          command == "config_editWorkflow" &&
          Object.keys(data.commands.workflow).length < 1
        )
          hidden = true;
        // hide `All Workflows...` command if no workflows
        if (
          command == "config_allWorkflows" &&
          Object.keys(data.commands.workflow).length < 1
        )
          hidden = true;
        // hide `All Scripts...` command if no scripts
        if (
          command == "config_allScripts" &&
          Object.keys(data.commands.script).length < 1
        )
          hidden = true;
        // hide `All Bookmarks...` command if no bookmarks
        if (
          command == "config_allBookmarks" &&
          Object.keys(data.commands.bookmark).length < 1
        )
          hidden = true;
        // hide `All Actions...` command if no actions
        if (
          command == "config_allActions" &&
          Object.keys(data.commands.action).length < 1
        )
          hidden = true;
        // hide `Enable Searching on Command Type` command if already enabled
        if (command == "config_enableTypeInSearch" && data.settings.searchIncludesType)
          hidden = true;
        // hide `Disable Searching on Command Type` command if already disabled
        if (command == "config_disableTypeInSearch" && !data.settings.searchIncludesType)
          hidden = true;
        // hide `Unhide Commands...` command if no hidden commands
        if (command == "config_unhideCommand" && data.settings.hidden.length < 1)
          hidden = true;
        // // hide `Recent Commands...` and `Clear Recent Commands` if no recent commands
        if (command == "builtin_recentCommands" && data.recent.commands.length == 0) {
          hidden = true;
        }
        if (command == "config_clearRecentCommands" && data.recent.commands.length == 0)
          hidden = true;
        commandData.id = command;
        commandData.localizedName = commandData.hasOwnProperty("loc")
          ? localize(commandData.loc)
          : command;
        commandData.localizedType = strings.hasOwnProperty(commandData.type)
          ? localize(strings[commandData.type])
          : commandData.type;
        commandsData[command] = commandData;
        localizedCommand = commandData.hasOwnProperty("loc")
          ? localize(commandData.loc)
          : command;
        localizedCommandLookup[localizedCommand] = command;
        if (hidden) hiddenCommands.push(command);
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
        name = pref.getStringPreference(currentPath + "action-" + j.toString() + "/name");
        key = name + " [" + set + "]";
        data.commands.action[key] = { name: name, type: "action", set: set };
      }
    }
  }

  function updateRecentCommands(command) {
    if (command.id == "builtin_recentCommands") return;
    // make sure command isn't already in the list
    var idx = data.recent.commands.indexOf(command.id);
    if (idx > -1) data.recent.commands.splice(idx, 1);
    data.recent.commands.unshift(command.id);
    // keep list at 10 items
    if (data.recent.commands.length > recentCommandsCount) data.recent.commands.pop();
    settings.save();
  }

  // COMMAND EXECUTION

  /**
   * Iterate over each action for chosen command.
   * @param {Object} id Command id/key to execute.
   */
  function processCommand(id) {
    var command = commandsData[id];
    if (command.type == "workflow") {
      insideWorkflow = true;
      // check to make sure all workflow commands are valid
      check = checkWorkflowActions(command.actions);
      if (check.deletedActions.length + check.incompatibleActions.length > 0) {
        alert(
          localize(
            strings.wf_needs_attention,
            check.deletedActions,
            check.incompatibleActions
          )
        );
        return;
      }
      // update recent commands list
      updateRecentCommands(command);
      // run each action in the workflow
      actions = command.actions;
      for (var i = 0; i < actions.length; i++) processCommand(commandsData[actions[i]]);
    } else {
      // update recent commands list
      if (!insideWorkflow) {
        updateRecentCommands(command);
      }
      executeCommand(command);
    }
  }

  /**
   * Execute command action.
   * @param {Object} command Command to execute.
   */
  function executeCommand(command) {
    // check command to see if an active document is required
    appDocuments = app.documents.length > 0;
    if (!appDocuments && command.docRequired)
      if (
        !confirm(
          localize(strings.cd_active_document_required, command.action),
          "noAsDflt",
          localize(strings.cd_exception)
        )
      )
        return;
    // check command to see if an active selection is required
    if (appDocuments && app.activeDocument.selection.length < 1 && command.selRequired)
      if (
        !confirm(
          localize(strings.cd_active_selection_required, command.action),
          "noAsDflt",
          localize(strings.cd_exception)
        )
      )
        return;
    switch (command.type.toLowerCase()) {
      case "config":
        try {
          scriptAction(command.action);
        } catch (e) {
          alert(localize(strings.cd_error_executing, command.localizedName, e));
        }
        break;
      case "builtin":
        try {
          builtinAction(command.action);
        } catch (e) {
          alert(localize(strings.cd_error_executing, command.localizedName, e));
        }
        break;
      case "menu":
        try {
          app.executeMenuCommand(command.action);
        } catch (e) {
          alert(localize(strings.cd_error_executing, command.localizedName, e));
        }
        break;
      case "tool":
        try {
          app.selectTool(command.action);
        } catch (e) {
          alert(localize(strings.tl_error_selecting, command, e));
        }
        break;
      case "action":
        try {
          app.doScript(command.name, command.set);
        } catch (e) {
          alert(localize(strings.ac_error_execution, command, e));
        }
        break;
      case "bookmark":
        f =
          command.bookmarkType == "file"
            ? new File(command.path)
            : new Folder(command.path);
        if (!f.exists) {
          alert(localize(strings.bm_error_exists, command.path));
          delete data.commands.bookmark[command];
          settings.save();
        } else {
          try {
            if (command.bookmarkType == "file") {
              app.open(f);
            } else {
              f.execute();
            }
          } catch (e) {
            alert(localize(strings.sc_error_execution, command.name, e));
          }
        }
        break;
      case "script":
        f = new File(command.path);
        if (!f.exists) {
          alert(localize(strings.sc_error_exists, command.path));
          delete data.commands.script[command];
          settings.save();
        } else {
          try {
            $.evalFile(f);
          } catch (e) {
            alert(localize(strings.sc_error_execution, command.name, e));
          }
        }
        break;
      default:
        alert(localize(strings.cd_invalid, command.type));
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
    if (
      (command.hasOwnProperty("minVersion") && command.minVersion > aiVersion) ||
      (command.hasOwnProperty("maxVersion") && command.maxVersion < aiVersion)
    )
      return false;
    return true;
  }
  // CUSTOM SCRIPTUI FILTERABLE LISTBOX

  /**
   * Custom wrapper for a ScriptUI Listbox.
   * @param {Array}   commands    Commands to load into the list box.
   * @param {Object}  container   ScriptUI window the listbox should be attached to.
   * @param {String}  name        Lookup name for the listbox.
   * @param {Array}   bounds      Bounds array for the listbox.
   * @param {Object}  columns     Listbox column information.
   * @param {Boolean} multiselect Should the listbox allow multiple selections (disable some features).
   * @param {String}  helptip     Listbox helptip/tooltip pop-up.
   * @param {Array}   listeners   ScriptUI listeners to add to the listbox.
   */
  function ListBoxWrapper(
    commands,
    container,
    name,
    bounds,
    columns,
    multiselect,
    helptip,
    listeners
  ) {
    this.container = container;
    this.name = name;
    this.columns = columns;
    this.multiselect = multiselect;
    this.helptip = helptip;
    this.listeners = listeners;
    this.listbox = this.make(commands, bounds);
  }

  ListBoxWrapper.prototype = {
    /**
     * Initialize a new ScriptUI listbox, load the initial commands, and attach event listeners.
     * @param commands Item to load into the listbox.
     * @param bounds   ScriptUI bounds array.
     * @returns        ScriptUI listbox.
     */
    make: function (commands, bounds) {
      var column;
      var columnTitles = [];
      var columnWidths = [];
      var columnKeys = [];
      for (column in this.columns) {
        columnTitles.push(column);
        columnWidths.push(this.columns[column].width);
        columnKeys.push(this.columns[column].key);
      }
      listbox = this.container.add("listbox", bounds, undefined, {
        name: this.name,
        numberOfColumns: columnTitles.length,
        showHeaders: true,
        columnTitles: columnTitles,
        columnWidths: columnWidths,
        multiselect: this.multiselect,
      });
      if (commands.length) {
        this.loadCommands(listbox, commands, columnKeys);
        listbox.selection = 0;
      }
      this.addListeners(listbox);
      if (this.helptip) listbox.helpTip = this.helptip;
      listbox.frameStart = 0;

      return listbox;
    },
    /**
     * Update the listbox with new items.
     * @param {Array} matches Update listbox with new commands.
     */
    update: function (matches) {
      temp = this.make(matches, this.listbox.bounds);
      this.listbox.window.remove(this.listbox);
      this.listbox = temp;
    },
    /**
     * Load command items in a ScriptUI listbox.
     * @param {Array}  listbox    ScriptUI listbox to load the command item in to.
     * @param {Array}  commands   Commands to load into the list box.
     * @param {Array}  columnKeys Command lookup key for each column.
     */
    loadCommands: function (listbox, commands, columnKeys) {
      var id, command, item;
      for (var i = 0; i < commands.length; i++) {
        id = commands[i];
        command = commandsData[id];
        item = listbox.add("item", localize(command[columnKeys[0]]));
        for (var j = 1; j < columnKeys.length; j++) {
          item.subItems[0].text = localize(strings[command[columnKeys[j]]]);
        }
        item.id = id;
      }
    },
    /**
     * Attach event listeners to the specified listbox.
     * @param {Object} listbox ScriptUI listbox to attach the listeners to.
     */
    addListeners: function (listbox) {
      var listener;
      for (var i = 0; i < this.listeners.length; i++) {
        listener = this.listeners[i];
        listener(listbox);
      }
    },
  };

  // LISTBOXWRAPPER LISTENERS

  /**
   * Close listbox when double-clicking a command.
   * @param {Object} listbox ScriptUI listbox.
   */
  function selectOnDoubleClick(listbox) {
    listbox.onDoubleClick = function () {
      if (listbox.selection) listbox.window.close(1);
    };
  }

  /**
   * Add listbox command to Workflow when double-clicking.
   * @param {Object}  listbox  ScriptUI listbox.
   */
  function addToStepsOnDoubleClick(listbox) {
    listbox.onDoubleClick = function () {
      var win, steps, command;
      if (listbox.selection) {
        win = listbox.window;
        steps = win.findElement("steps");
        command = commandsData[localizedCommandLookup[listbox.selection]];
        newItem = steps.add("item", command.localizedName);
        newItem.subItems[0].text = command.localizedType;
        newItem.id = command.id;
        steps.notify("onChange");
      }
    };
  }

  /**
   * Allow end-to-end scrolling from within a listbox.
   * @param {Object}  listbox  ScriptUI listbox.
   */
  function scrollListBoxWithArrows(listbox) {
    listbox.addEventListener("keydown", function (e) {
      if (e.fromQuery) {
        if (e.fromQueryShiftKey) {
          if (e.keyName == "Up") {
            if (this.selection.index == 0) {
              this.selection = this.items.length - 1;
              e.preventDefault();
            } else {
              this.selection--;
            }
          }
          if (e.keyName == "Down") {
            if (this.selection.index == this.items.length - 1) {
              this.selection = 0;
              e.preventDefault();
            } else {
              if (e.keyName == "Down") this.selection++;
            }
          }
        } else {
          if (e.keyName == "Up" || e.keyName == "Down") {
            if (e.keyName == "Up") {
              e.preventDefault();
              if (!this.selection) {
                this.selection = 0;
              } else if (this.selection.index == 0) {
                // jump to the bottom if at top
                this.selection = this.items.length - 1;
                this.frameStart = this.items.length - 1 - visibleListItems;
              } else {
                if (this.selection.index > 0) {
                  this.selection = this.selection.index - 1;
                  if (this.selection.index < this.frameStart) this.frameStart--;
                }
              }
            } else if (e.keyName == "Down") {
              e.preventDefault();
              if (!this.selection) {
                this.selection = 0;
              } else if (this.selection.index === this.items.length - 1) {
                // jump to the top if at the bottom
                this.selection = 0;
                this.frameStart = 0;
              } else {
                if (this.selection.index < this.items.length) {
                  this.selection = this.selection.index + 1;
                  if (this.selection.index > this.frameStart + visibleListItems - 1) {
                    if (this.frameStart < this.items.length - visibleListItems) {
                      this.frameStart++;
                    } else {
                      this.frameStart = this.frameStart;
                    }
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
            if (this.selection) {
              if (
                this.selection.index < this.frameStart ||
                this.selection.index > this.frameStart + visibleListItems - 1
              )
                this.frameStart = this.selection.index - Math.floor(visibleListItems / 2);
              // don't move the frame if list items don't fill the available rows
              if (this.items.length <= visibleListItems) return;
              // move the frame by revealing the calculated `this.frameStart`
              this.revealItem(this.frameStart);
            }
          }
        }
      } else {
        if (e.keyName == "Up" && this.selection.index == 0) {
          this.selection = this.items.length - 1;
          e.preventDefault();
        }
        if (e.keyName == "Down" && this.selection.index == this.items.length - 1) {
          this.selection = 0;
          e.preventDefault();
        }
      }
    });
  }

  // USER DIALOGS

  function commandPalette(commands, title, columns, multiselect, showOnly) {
    // create the dialog
    var win = new Window("dialog");
    win.text = title;
    win.alignChildren = "fill";

    // setup the query input
    var q = win.add("edittext");
    q.helpTip = localize(strings.cd_q_helptip);

    // setup the commands listbox
    var matches = showOnly ? showOnly : commands;
    var list = new ListBoxWrapper(
      matches,
      win,
      "commands",
      paletteSettings.bounds,
      columns,
      multiselect,
      null,
      [selectOnDoubleClick, scrollListBoxWithArrows]
    );

    // window buttons
    var winButtons = win.add("group");
    winButtons.orientation = "row";
    winButtons.alignChildren = ["center", "center"];
    var ok = winButtons.add("button", undefined, "OK");
    ok.preferredSize.width = 100;
    var cancel = winButtons.add("button", undefined, localize(strings.cancel), {
      name: "cancel",
    });
    cancel.preferredSize.width = 100;

    // work-around to stop windows from flickering/flashing explorer
    if (windowsFlickerFix) {
      simulateKeypress("TAB", 1);
    } else {
      q.active = true;
    }

    // as a query is typed update the listbox
    q.onChanging = function () {
      if (this.text === "") {
        matches = showOnly ? showOnly : commands;
      } else {
        matches = scoreMatches(this.text, commands);
      }
      list.update(matches);
    };

    // allow using arrow key from query input by sending a custom keyboard event to the list box
    if (!multiselect) {
      var kbEvent = ScriptUI.events.createEvent("KeyboardEvent");
      q.addEventListener("keydown", function (e) {
        // hack to keep original commands from reloading before closing command palette when hitting the escape key while within the query box
        if (e.keyName == "Escape") {
          e.preventDefault();
          win.close();
        }
        if (e.keyName == "Up" || e.keyName == "Down") {
          kbEvent.initKeyboardEvent(
            "keydown",
            true,
            true,
            list.listbox,
            e.keyName,
            0,
            ""
          );
          kbEvent.fromQuery = true;
          kbEvent.fromQueryShiftKey = e.getModifierState("shift");
          list.listbox.dispatchEvent(kbEvent);
          e.preventDefault();
        }
      });
    }

    if (win.show() == 1) {
      if (!list.listbox.selection) return;
      if (multiselect) {
        var items = [];
        for (var i = 0; i < list.listbox.selection.length; i++) {
          items.push(list.listbox.selection[i].id);
        }
        return items;
      } else {
        return list.listbox.selection.id;
      }
    }
    return false;
  }
  function workflowBuilder(commands, editWorkflow) {
    // create the dialog
    var win = new Window("dialog");
    win.text = localize(strings.wf_builder);
    win.alignChildren = "fill";

    // setup the query input
    var pSearch = win.add("panel", undefined, localize(strings.cd_search_for));
    pSearch.alignChildren = ["fill", "center"];
    pSearch.margins = 20;
    var q = pSearch.add("edittext");
    q.helpTip = localize(strings.cd_q_helptip);

    // setup the commands listbox
    var list = new ListBoxWrapper(
      commands,
      pSearch,
      "commands",
      [0, 0, paletteSettings.paletteWidth, paletteSettings.paletteHeight],
      paletteSettings.defaultColumns,
      false,
      localize(strings.cd_helptip),
      [addToStepsOnDoubleClick, scrollListBoxWithArrows]
    );

    // work-around to stop windows from flickering/flashing explorer
    if (windowsFlickerFix) {
      simulateKeypress("TAB", 1);
    } else {
      q.active = true;
    }

    var pSteps = win.add("panel", undefined, localize(strings.wf_steps));
    pSteps.alignChildren = ["fill", "center"];
    pSteps.margins = 20;

    var actionSteps = [];
    if (editWorkflow) {
      for (var i = 0; i < editWorkflow.actions.length; i++) {
        actionSteps.push(commandsData[editWorkflow.actions[i]]);
      }
    }

    // setup the workflow action steps listbox
    var steps = new ListBoxWrapper(
      actionSteps,
      pSteps,
      "steps",
      [0, 0, paletteSettings.paletteWidth, paletteSettings.paletteHeight],
      paletteSettings.defaultColumns,
      true,
      localize(strings.wf_steps_helptip),
      []
    );

    var stepButtons = pSteps.add("group");
    stepButtons.alignment = "center";
    var up = stepButtons.add("button", undefined, localize(strings.step_up));
    up.preferredSize.width = 100;
    var down = stepButtons.add("button", undefined, localize(strings.step_down));
    down.preferredSize.width = 100;
    var del = stepButtons.add("button", undefined, localize(strings.step_delete));
    del.preferredSize.width = 100;

    // command name
    var pName = win.add("panel", undefined, localize(strings.wf_save_as));
    pName.alignChildren = ["fill", "center"];
    pName.margins = 20;
    var workflowNameText = editWorkflow ? editWorkflow.localizedName : "";
    var workflowName = pName.add("edittext", undefined, workflowNameText);
    workflowName.enabled = editWorkflow ? true : false;

    // window buttons
    var winButtons = win.add("group");
    winButtons.orientation = "row";
    winButtons.alignChildren = ["center", "center"];
    var save = winButtons.add("button", undefined, localize(strings.save), {
      name: "ok",
    });
    save.preferredSize.width = 100;
    save.enabled = editWorkflow ? true : false;
    var cancel = winButtons.add("button", undefined, localize(strings.cancel), {
      name: "cancel",
    });
    cancel.preferredSize.width = 100;

    // as a query is typed update the listbox
    var matches;
    q.onChanging = function () {
      if (this.text === "") {
        matches = commands;
      } else {
        matches = scoreMatches(this.text, commands);
      }
      if (matches.length > 0) {
        list.update(matches);
      }
    };

    steps.listbox.onChange = function () {
      workflowName.enabled = steps.listbox.items.length > 0 ? true : false;
      save.enabled =
        steps.listbox.items.length > 0 && workflowName.text.length > 0 ? true : false;
    };

    workflowName.onChanging = function () {
      save.enabled = workflowName.text.length > 0 ? true : false;
    };

    up.onClick = function () {
      var selected = sortIndexes(steps.listbox.selection);
      if (selected[i] == 0 || !contiguous(selected)) return;
      for (var i = 0; i < selected.length; i++)
        swap(steps.listbox.items[selected[i] - 1], steps.listbox.items[selected[i]]);
      steps.listbox.selection = null;
      for (var n = 0; n < selected.length; n++) steps.listbox.selection = selected[n] - 1;
    };

    down.onClick = function () {
      var selected = sortIndexes(steps.listbox.selection);
      if (
        selected[selected.length - 1] == steps.listbox.items.length - 1 ||
        !contiguous(selected)
      )
        return;
      for (var i = steps.listbox.selection.length - 1; i > -1; i--)
        swap(steps.listbox.items[selected[i]], steps.listbox.items[selected[i] + 1]);
      steps.listbox.selection = null;
      for (var n = 0; n < selected.length; n++) steps.listbox.selection = selected[n] + 1;
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
      var selected = sortIndexes(steps.listbox.selection);
      for (var i = steps.listbox.selection.length - 1; i > -1; i--) {
        steps.listbox.remove(selected[i]);
      }
      steps.listbox.selection == null;
      workflowName.enabled = steps.listbox.items.length > 0 ? true : false;
      save.enabled =
        steps.listbox.items.length > 0 && workflowName.text.length > 0 ? true : false;
    };

    save.onClick = function () {
      // check for workflow overwrite
      if (
        !editWorkflow &&
        data.commands.workflow.hasOwnProperty(workflowName.text.trim()) &&
        !confirm(
          localize(strings.wf_already_exists) + "\n" + workflowName.text.trim(),
          "noAsDflt",
          localize(strings.wf_already_exists_title)
        )
      ) {
        return;
      }
      win.close(1);
    };

    if (win.show() == 1) {
      return { name: workflowName.text.trim(), actions: steps.listbox.items };
    }
    return false;
  }
  function startupBuilder(commands) {
    // create the dialog
    var win = new Window("dialog");
    win.text = localize(strings.startup_builder);
    win.alignChildren = "fill";

    // setup the query input
    var pSearch = win.add("panel", undefined, localize(strings.cd_search_for));
    pSearch.alignChildren = ["fill", "center"];
    pSearch.margins = 20;
    var q = pSearch.add("edittext");
    q.helpTip = localize(strings.cd_q_helptip);

    // setup the commands listbox
    var list = new ListBoxWrapper(
      commands,
      pSearch,
      "commands",
      [0, 0, paletteSettings.paletteWidth, paletteSettings.paletteHeight],
      paletteSettings.defaultColumns,
      false,
      localize(strings.startup_helptip),
      [addToStepsOnDoubleClick, scrollListBoxWithArrows]
    );

    // work-around to stop windows from flickering/flashing explorer
    if (windowsFlickerFix) {
      simulateKeypress("TAB", 1);
    } else {
      q.active = true;
    }

    var pSteps = win.add("panel", undefined, localize(strings.startup_steps));
    pSteps.alignChildren = ["fill", "center"];
    pSteps.margins = 20;

    var commandSteps = [];
    for (var i = 0; i < data.settings.startupCommands.length; i++) {
      commandSteps.push(commandsData[data.settings.startupCommands[i]]);
    }

    // setup the workflow action steps listbox
    var steps = new ListBoxWrapper(
      commandSteps,
      pSteps,
      "steps",
      [0, 0, paletteSettings.paletteWidth, paletteSettings.paletteHeight],
      paletteSettings.defaultColumns,
      true,
      localize(strings.startup_steps_helptip),
      []
    );

    var stepButtons = pSteps.add("group");
    stepButtons.alignment = "center";
    var up = stepButtons.add("button", undefined, localize(strings.step_up));
    up.preferredSize.width = 100;
    var down = stepButtons.add("button", undefined, localize(strings.step_down));
    down.preferredSize.width = 100;
    var del = stepButtons.add("button", undefined, localize(strings.step_delete));
    del.preferredSize.width = 100;

    // window buttons
    var winButtons = win.add("group");
    winButtons.orientation = "row";
    winButtons.alignChildren = ["center", "center"];
    var save = winButtons.add("button", undefined, localize(strings.save), {
      name: "ok",
    });
    save.preferredSize.width = 100;
    save.enabled = editWorkflow ? true : false;
    var cancel = winButtons.add("button", undefined, localize(strings.cancel), {
      name: "cancel",
    });
    cancel.preferredSize.width = 100;

    // as a query is typed update the listbox
    var matches;
    q.onChanging = function () {
      if (this.text === "") {
        matches = commands;
      } else {
        matches = scoreMatches(this.text, commands);
      }
      if (matches.length > 0) {
        list.update(matches);
      }
    };

    steps.listbox.onChange = function () {
      save.enabled = steps.listbox.items.length > 0 ? true : false;
    };

    up.onClick = function () {
      var selected = sortIndexes(steps.listbox.selection);
      if (selected[i] == 0 || !contiguous(selected)) return;
      for (var i = 0; i < selected.length; i++)
        swap(steps.listbox.items[selected[i] - 1], steps.listbox.items[selected[i]]);
      steps.listbox.selection = null;
      for (var n = 0; n < selected.length; n++) steps.listbox.selection = selected[n] - 1;
    };

    down.onClick = function () {
      var selected = sortIndexes(steps.listbox.selection);
      if (
        selected[selected.length - 1] == steps.listbox.items.length - 1 ||
        !contiguous(selected)
      )
        return;
      for (var i = steps.listbox.selection.length - 1; i > -1; i--)
        swap(steps.listbox.items[selected[i]], steps.listbox.items[selected[i] + 1]);
      steps.listbox.selection = null;
      for (var n = 0; n < selected.length; n++) steps.listbox.selection = selected[n] + 1;
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
      var selected = sortIndexes(steps.listbox.selection);
      for (var i = steps.listbox.selection.length - 1; i > -1; i--) {
        steps.listbox.remove(selected[i]);
      }
      steps.listbox.selection == null;
      save.enabled = steps.listbox.items.length > 0 ? true : false;
    };

    if (win.show() == 1) {
      return steps.listbox.items;
    }
    return false;
  }
  // FILE/FOLDER OPERATIONS

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
      alert(localize(strings.fl_error_loading, f));
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
      alert(localize(strings.fl_error_writing, f));
    }
  }
  // WORKFLOW AUTOMATION

  /**
   * Build or Edit workflows.
   * @param {String} workflow Workflow to edit.
   */
  function buildWorkflow(workflow) {
    var availableWorkflowCommands = filterCommands(
      (commands = commandsData),
      (types = ["bookmark", "script", "workflow", "menu", "tool", "action", "builtin"]),
      (showHidden = true),
      (hideCommands = workflow ? [workflow.id] : []),
      (docRequired = true),
      (selRequired = true)
    );
    // show the workflow builder dialog
    var result = workflowBuilder(
      (commands = availableWorkflowCommands),
      (editWorkflow = workflow)
    );

    if (!result) return;
    var workflowActions = [];
    try {
      for (var i = 0; i < result.actions.length; i++) {
        workflowActions.push(result.actions[i].commandId);
      }
      data.commands.workflow[result.name] = {
        type: "workflow",
        actions: workflowActions,
      };
    } catch (e) {
      alert(localize(strings.wf_error_saving, result.name));
    }
  }

  /** Show all workflows. */
  function showAllWorkflows() {
    var workflows = filterCommands(
      (commands = commandsData),
      (types = ["workflow"]),
      (showHidden = false),
      (hideCommands = null),
      (docRequired = false),
      (selRequired = false)
    );
    var result = commandPalette(
      (commands = workflows),
      (title = localize(strings.Workflows)),
      (columns = paletteSettings.defaultColumns),
      (multiselect = false)
    );
    if (!result) return;
    processCommand(result);
  }

  /** Choose a workflow to edit. */
  function editWorkflow() {
    var workflows = filterCommands(
      (commands = commandsData),
      (types = ["workflow"]),
      (showHidden = false),
      (hideCommands = null),
      (docRequired = false),
      (selRequired = false)
    );
    var result = commandPalette(
      (commands = workflows),
      (title = localize(strings.wf_choose)),
      (columns = paletteSettings.defaultColumns),
      (multiselect = false)
    );
    if (!result) return;
    buildWorkflow(result);
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
  alert(result);
  processCommand(result);
})();
