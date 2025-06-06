// DEVELOPMENT SETTINGS

// localization testing
// $.locale = false;
// $.locale = "de";
// $.locale = "ru";

// ENVIRONMENT VARIABLES

const sysOS = /mac/i.test($.os) ? "mac" : "win";
const windowsFlickerFix =
  sysOS === "win" && parseFloat(app.version) < 26.4 ? true : false;
const settingsRequiredUpdateVersion = "0.10.0";

// DEVELOPMENT SETTINGS
const devMode = $.getenv("USER") === "jbd" ? true : false;
const debugLogging = $.getenv("AICP_DEBUG_LOGGING") === "true" ? true : false;
const logFilePath = Folder.desktop + "/AiCommandPalette.log";
let logger;

if (devMode || debugLogging) {
  logger = new Logger(logFilePath, "a", undefined, true);
  devMode && logger.log("**DEV MODE ENABLED**");
} else {
  logger = {};
  logger.log = function (text) {
    $.writeln(text);
  };
}

logger.log("**SCRIPT LAUNCH**", _title, "v" + _version, $.fileName);

// PALETTE SETTINGS
interface ColumnConfig {
  width: number;
  key: string;
}

interface ColumnSet {
  [columnLabel: string]: ColumnConfig;
}

interface PaletteSettings {
  paletteWidth: number;
  paletteHeight: number;
  bounds: [number, number, number, number];
  columnSets: {
    [setName: string]: ColumnSet;
  };
}

const paletteSettings: PaletteSettings = {
  paletteWidth: 600,
  paletteHeight: sysOS === "win" ? 211 : 201,
  bounds: [0, 0, 600, sysOS === "win" ? 211 : 201],
  columnSets: {
    standard: {
      [localize(strings.name_title_case)]: {
        width: 450,
        key: "name",
      },
      [localize(strings.type_title_case)]: {
        width: 100,
        key: "type",
      },
    },
    customCommand: {
      [localize(strings.name_title_case)]: {
        width: 450,
        key: "name",
      },
      [localize(strings.type_title_case)]: {
        width: 100,
        key: "actionType",
      },
    },
  },
};

// MISCELLANEOUS SETTINGS

const visibleListItems = 9;
const mostRecentCommandsCount = 25;
const namedObjectLimit = 2000;
const regexEllipsis = /\.\.\.$/;
const regexCarrot = /\s>\s/g;

// DEVELOPMENT HELPERS

interface DevInfo {
  folder(): Folder;
  prefsFile(): File;
  commandsFile(): File;
  save(): void;
}

const devInfo: DevInfo = {
  folder(): Folder {
    return userPrefsFolder;
  },

  prefsFile(): File {
    const folder = this.folder();
    return setupFileObject(folder, "prefs.json");
  },

  commandsFile(): File {
    const folder = this.folder();
    return setupFileObject(folder, "commands.json");
  },

  save(): void {
    writeJSONData(prefs, this.prefsFile());
    writeJSONData(commandsData, this.commandsFile());
  },
};
