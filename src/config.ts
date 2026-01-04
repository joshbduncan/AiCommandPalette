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

// PLUG-IN DATA STORAGE
const pluginDataFolder = setupFolderObject(Folder.userData + "/JBD/AiCommandPalette");
const logFilePath = pluginDataFolder + "/AiCommandPalette.log";
const userPrefsFileName = "Preferences.json";
const userHistoryFileName = "History.json";

// DEVELOPMENT SETTINGS
const devMode = $.getenv("USER") === "jbd" ? true : false;
const debugLogging = $.getenv("AICP_DEBUG_LOGGING") !== "false" ? true : false;

let logger;

if (devMode || debugLogging) {
    logger = new Logger(logFilePath, "a", undefined, true);
} else {
    logger = {};
    logger.log = function (text) {
        $.writeln(text);
    };
}

const devInfo = {
    folder(): Folder {
        return pluginDataFolder;
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
        writeTextFile(JSON.stringify(prefs, undefined, 4), this.prefsFile());
        writeTextFile(JSON.stringify(commandsData, undefined, 4), this.commandsFile());
    },
};

// PALETTE SETTINGS
type ColumnConfig = {
    width: number;
    key: string;
};

type ColumnSet = {
    [columnLabel: string]: ColumnConfig;
};

type PaletteSettings = {
    paletteWidth: number;
    paletteHeight: number;
    bounds: [number, number, number, number];
    columnSets: Record<string, ColumnSet>;
};

const paletteSettings: PaletteSettings = {
    paletteWidth: 600,
    paletteHeight: sysOS === "win" ? 211 : 201,
    bounds: [0, 0, 600, sysOS === "win" ? 211 : 201],
    columnSets: {
        standard: {
            [localize(strings.name_title_case)]: { width: 450, key: "name" },
            [localize(strings.type_title_case)]: { width: 100, key: "type" },
        },
        customCommand: {
            [localize(strings.name_title_case)]: { width: 450, key: "name" },
            [localize(strings.type_title_case)]: { width: 100, key: "actionType" },
        },
    },
};

// MISCELLANEOUS SETTINGS

// Number of items visible in the listbox viewport without scrolling.
// Based on the listbox height (paletteHeight) and standard row height in ScriptUI.
const visibleListItems = 9;

// Maximum number of recent commands to track in user history.
// Keeps the recent commands list manageable and performant.
const mostRecentCommandsCount = 25;

// Maximum number of named objects to load from a document.
// Prevents performance issues when documents have thousands of objects.
// If exceeded, user is shown a warning and objects are still loaded.
const namedObjectLimit = 2000;

// Regex to match trailing ellipsis in menu command names (e.g., "Save As...")
const regexEllipsis = /\.\.\.$/;

// Regex to match the breadcrumb separator (greater-than sign) in menu paths (e.g., "File > Open")
const regexBreadcrumbSeparator = /\s>\s/g;
