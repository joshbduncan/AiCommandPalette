// keeping around for alerting users of breaking changes
const settingsFolderName = "JBD";
const settingsFolder = setupFolderObject(Folder.userData + "/" + settingsFolderName);
const settingsFileName = "AiCommandPaletteSettings.json";

// new v0.10.0 preferences
const userPrefsFolderName = "JBD";
const userPrefsFolder = setupFolderObject(Folder.userData + "/JBD/AiCommandPalette");
const userPrefsFileName = "Preferences.json";

// setup the base prefs model
interface Prefs {
    startupCommands: string[];
    hiddenCommands: string[];
    workflows: any[];
    customCommands: any[];
    bookmarks: any[];
    scripts: any[];
    pickers: any[];
    fuzzy: boolean;
    latches: Record<string, any>;
    version: string;
    os: string;
    locale: string;
    aiVersion: number;
    timestamp: number;
}

const prefs: Prefs = {
    startupCommands: null,
    hiddenCommands: [],
    workflows: [],
    customCommands: [],
    bookmarks: [],
    scripts: [],
    pickers: [],
    fuzzy: true, // set to new fuzzy matcher as default
    latches: {},
    version: _version,
    os: $.os,
    locale: $.locale,
    aiVersion: parseFloat(app.version),
    timestamp: Date.now(),
};

interface UserPrefs {
    folder(): Folder;
    file(): File;
    load(inject?: boolean): void;
    inject(): void;
    save(): void;
    backup(): void;
    reveal(): void;
}

const userPrefs: UserPrefs = {
    folder() {
        return userPrefsFolder;
    },

    file() {
        const folder = this.folder();
        return setupFileObject(folder, userPrefsFileName);
    },

    load(inject?: boolean) {
        const file = this.file();
        logger.log("loading user preferences:", file.fsName);

        if (!file.exists) {
            logger.log("no user prefs files found, checking for old 'settings' file");
            const oldFile = setupFileObject(settingsFolder, settingsFileName);

            if (!oldFile.exists) return;

            alert(localize(strings.pref_file_non_compatible));
            const backupFile = new File(oldFile + ".bak");
            logger.log("backing up old `settings` file to:", backupFile.fsName);
            oldFile.copy(backupFile);

            try {
                updateOldPreferences(oldFile);
            } catch (e) {
                alert(localize(strings.pref_file_loading_error) + "\n\n" + e);
                settingsFolder.execute();
                return;
            }

            alert(localize(strings.pref_update_complete));
        }

        if (file.exists) {
            try {
                const loadedData = readJSONData(file);
                if (Object.keys(loadedData).length === 0) return;

                const propsToSkip = [
                    "version",
                    "os",
                    "locale",
                    "aiVersion",
                    "timestamp",
                ];
                for (const prop in loadedData) {
                    if (propsToSkip.indexOf(prop) !== -1) continue;
                    prefs[prop] = loadedData[prop];
                }

                if (inject) {
                    this.inject();
                }
            } catch (e) {
                file.rename(file.name + ".bak");
                logger.log("error loading user prefs", e);
                logger.log("renaming prefs file:", file.fsName);
                this.reveal();
                Error.runtimeError(1, localize(strings.pref_file_loading_error, e));
            }
        }
    },

    inject() {
        const typesToInject = [
            "workflows",
            "bookmarks",
            "scripts",
            "pickers",
            "customCommands",
        ];
        for (let i = 0; i < typesToInject.length; i++) {
            const type = typesToInject[i];
            for (let j = 0; j < prefs[type].length; j++) {
                const item = prefs[type][j];
                commandsData[item.id] = item;
            }
        }
    },

    save() {
        const file = this.file();
        logger.log("writing user prefs");
        writeJSONData(prefs, file);
    },

    backup() {
        const ts = Date.now();
        const backupFile = new File(`${this.file.fsName}.${ts}.bak`);
        this.file.copy(backupFile);
        logger.log("user prefs backed up to:", backupFile.fsName);
        return backupFile;
    },

    reveal() {
        const folder = this.folder();
        logger.log("revealing user prefs");
        folder.execute();
    },
};

function updateOldPreferences(oldFile) {
    logger.log("converting old 'settings' file to new user prefs file");

    // read old data
    const data: any = readJSONData(oldFile);

    // no need to continue if we don't know the old version
    if (!data.settings.hasOwnProperty("version")) return;

    if (semanticVersionComparison(data.settings.version, "0.8.1") == -1) {
        // build lut to convert old localized command strings to new command ids
        const commandsLUT = {};
        for (const command in commandsData) {
            commandsLUT[localize(commandsData[command].name)] = command;
        }

        // update bookmarks
        const updatedBookmarks = {};
        for (const bookmark in data.commands.bookmark) {
            updatedBookmarks[data.commands.bookmark[bookmark].name] = {
                type: "bookmark",
                path: data.commands.bookmark[bookmark].path,
                bookmarkType: data.commands.bookmark[bookmark].bookmarkType,
            };
        }
        data.commands.bookmark = updatedBookmarks;

        // update scripts
        const updatedScripts = {};
        for (const script in data.commands.script) {
            updatedScripts[data.commands.script[script].name] = {
                type: "script",
                path: data.commands.script[script].path,
            };
        }
        data.commands.script = updatedScripts;

        // update workflows
        const updatedWorkflows = {};
        const updatedActions = [];
        for (const workflow in data.commands.workflow) {
            let cur, updatedAction;
            for (let i = 0; i < data.commands.workflow[workflow].actions.length; i++) {
                cur = data.commands.workflow[workflow].actions[i];
                // if the action can't be found in the LUT, just leave it as user will be prompted when they attempt to run it
                if (!commandsLUT.hasOwnProperty(cur)) {
                    updatedAction = cur;
                } else {
                    updatedAction = commandsLUT[cur];
                }
                updatedActions.push(updatedAction);
            }
            updatedWorkflows[data.commands.workflow[workflow].name] = {
                type: "workflow",
                actions: updatedActions,
            };
        }
        data.commands.workflow = updatedWorkflows;

        // update hidden commands
        const updatedHiddenCommands = [];
        for (let i = 0; i < data.settings.hidden.length; i++) {
            if (commandsLUT.hasOwnProperty(data.settings.hidden[i])) {
                updatedHiddenCommands.push(commandsLUT[data.settings.hidden[i]]);
            }
        }
        data.settings.hidden = updatedHiddenCommands;

        // update recent commands
        const updatedRecentCommands = [];
        for (let i = 0; i < data.recent.commands.length; i++) {
            if (commandsLUT.hasOwnProperty(data.recent.commands[i])) {
                updatedRecentCommands.push(commandsLUT[data.recent.commands[i]]);
            }
        }
        data.recent.commands = updatedRecentCommands;

        // update version number so subsequent updates can be applied
        data.settings.version = "0.8.1";
    }

    if (semanticVersionComparison(data.settings.version, "0.10.0") == -1) {
        let startupCommands = [];

        // update bookmarks
        const bookmarks = [];
        let f, bookmark;
        for (const prop in data.commands.bookmark) {
            f = new File(data.commands.bookmark[prop].path);
            if (!f.exists) continue;
            const bookmarkName = decodeURI(f.name);
            bookmark = {
                id: prop,
                name: bookmarkName,
                action: "bookmark",
                type: data.commands.bookmark[prop].bookmarkType,
                path: f.fsName,
                docRequired: false,
                selRequired: false,
                hidden: false,
            };
            bookmarks.push(bookmark);
            startupCommands.push(prop);
        }
        prefs.bookmarks = bookmarks;

        // update scripts
        const scripts = [];
        let script;
        for (const prop in data.commands.script) {
            f = new File(data.commands.script[prop].path);
            if (!f.exists) continue;
            const scriptName = decodeURI(f.name);
            script = {
                id: prop,
                name: scriptName,
                action: "script",
                type: "script",
                path: f.fsName,
                docRequired: false,
                selRequired: false,
                hidden: false,
            };
            scripts.push(script);
            startupCommands.push(prop);
        }
        prefs.scripts = scripts;

        // update workflows
        const oldCommandIdsLUT = {}; // TODO: find in old commits
        const workflows = [];
        let workflow, actions, action;
        for (const prop in data.commands.workflow) {
            // make sure actions are using the new command id format
            actions = [];
            for (let i = 0; i < data.commands.workflow[prop].actions.length; i++) {
                action = data.commands.workflow[prop].actions[i];
                if (
                    !commandsData.hasOwnProperty(action) &&
                    oldCommandIdsLUT.hasOwnProperty(action)
                )
                    action = oldCommandIdsLUT[action];
                actions.push(action);
            }

            const workflow = {
                id: prop,
                name: prop,
                actions: actions,
                type: "workflow",
                docRequired: false,
                selRequired: false,
                hidden: false,
            };
            workflows.push(workflow);
            startupCommands.push(prop);
        }
        prefs.workflows = workflows;

        // add the base startup commands
        startupCommands = startupCommands.concat([
            "builtin_recentCommands",
            "config_settings",
        ]);
        prefs.startupCommands = startupCommands;

        // update hidden commands
        const hiddenCommands = data.settings.hidden;
        prefs.hiddenCommands = hiddenCommands;

        userPrefs.save();
    }
}
