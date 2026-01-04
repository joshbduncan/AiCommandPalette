// setup the base prefs model
interface Prefs {
    startupCommands: string[];
    hiddenCommands: string[];
    workflows: CommandEntry[];
    customCommands: CommandEntry[];
    bookmarks: CommandEntry[];
    scripts: CommandEntry[];
    watchedFolders: string[];
    pickers: CommandEntry[];
    fuzzy: boolean;
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
    watchedFolders: [],
    pickers: [],
    fuzzy: true, // set to new fuzzy matcher as default
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
    loadWatchedScripts(): void;
    save(): void;
    backup(): void;
    reveal(): void;
}

const userPrefs: UserPrefs = {
    folder() {
        return pluginDataFolder;
    },

    file() {
        const folder = this.folder();
        return setupFileObject(folder, userPrefsFileName);
    },

    /**
     * Loads user preferences from disk (migrates legacy formats as needed).
     * If `inject` is true, calls `this.inject()` after loading.
     *
     * @param inject Inject user commands into `commandsData`.
     * @returns {void} Nothing.
     */
    load(inject?: boolean) {
        const file = this.file();
        logger.log("loading user preferences:", file.fsName);

        if (!file.exists) return;

        // Track which updates have been applied
        let updateVersion0_16_0 = false;

        const s: string = readTextFile(file);
        let data;

        // try true JSON first
        try {
            data = JSON.parse(s);
            logger.log("prefs loaded as valid JSON");
        } catch (e) {}

        // try json-like eval second
        if (data === undefined) {
            try {
                data = eval(s);
                logger.log("prefs loaded as old JSON-like, saving as true JSON");
                // write true JSON back to disk
                writeTextFile(JSON.stringify(data), file);
            } catch (e) {
                file.rename(file.name + ".bak");
                logger.log("error loading user prefs", e);
                logger.log("renaming prefs file:", file.fsName);
                this.reveal();
                // @ts-ignore
                Error.runtimeError(1, localize(strings.pref_file_loading_error, e));
            }
        }

        if (!data || typeof data !== "object") return;
        if (Object.keys(data).length === 0) return;

        // update stored command ids to v0.15.0 unique ids
        logger.log(`loaded prefs saved from ${_title} v${data.version}`);
        if (semanticVersionComparison(data.version, "0.16.0") == -1) {
            logger.log("applying v0.16.0 prefs command id update");
            updateVersion0_16_0 = true;

            // build lut to convert old menu command ids to updated versions
            const commandsLUT: Record<string, string> = {};
            for (const key in commandsData) {
                const command = commandsData[key] as CommandEntry;

                // only add command where the is new (menu commands for now)
                if (key == command.id) continue;

                // skip any ids already added to the LUT
                if (commandsLUT.hasOwnProperty(command.id)) continue;

                commandsLUT[command.id] = key;
            }

            // update startup commands
            for (let i = 0; i < data.startupCommands.length; i++) {
                const oldId = data.startupCommands[i];
                if (!commandsLUT.hasOwnProperty(oldId) || oldId == commandsLUT[oldId])
                    continue;
                logger.log(
                    `- updating startup command: ${oldId} -> ${commandsLUT[oldId]}`
                );
                data.startupCommands[i] = commandsLUT[oldId];
            }

            // update hidden commands
            for (let i = 0; i < data.hiddenCommands.length; i++) {
                const oldId = data.hiddenCommands[i];
                if (!commandsLUT.hasOwnProperty(oldId) || oldId == commandsLUT[oldId])
                    continue;
                logger.log(
                    `- updating hidden command: ${oldId} -> ${commandsLUT[oldId]}`
                );
                data.hiddenCommands[i] = commandsLUT[oldId];
            }

            // update workflow commands
            for (let i = 0; i < data.workflows.length; i++) {
                let workflow = data.workflows[i];
                for (let j = 0; j < data.workflows[i].actions.length; j++) {
                    const oldId = data.workflows[i].actions[j];
                    if (
                        !commandsLUT.hasOwnProperty(oldId) ||
                        oldId == commandsLUT[oldId]
                    )
                        continue;
                    logger.log(
                        `- updating ${workflow.id} action: ${oldId} -> ${commandsLUT[oldId]}`
                    );
                    data.workflows[i].actions[j] = commandsLUT[oldId];
                }
            }
        }

        const propsToSkip = [
            "version",
            "os",
            "locale",
            "aiVersion",
            "timestamp",
            "latches",
        ];
        for (const prop in data) {
            if (propsToSkip.includes(prop)) continue;
            prefs[prop] = data[prop];
        }

        if (inject) {
            this.inject();
        }

        if (updateVersion0_16_0) {
            // TODO: alert use of clean history
            // userHistory.backup();
            // userHistory.clear();
            this.save();
        }
    },

    /**
     * Inject commands loaded from user preference file into `commandsData`.
     */
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

    loadWatchedScripts() {
        for (const path of prefs.watchedFolders) {
            const folder = new Folder(path);

            if (!folder.exists) {
                logger.log(`folder not found: ${folder.fsName}`);
                alert(
                    localize(strings.watched_folder_not_found, decodeURI(folder.name))
                );
                continue;
            }

            logger.log(`loading watched script folder: ${folder.fsName}`);

            // find all scripts
            let files = findScriptFiles(folder, true);

            const scripts: CommandEntry[] = [];

            for (const f of files) {
                const scriptParent = decodeURI(f.parent.name);
                const scriptName = decodeURI(f.name);
                const id = generateCommandId(
                    "watchedScript_" + scriptName + hashString(f.fsName)
                );

                if (commandsData[id]) {
                    logger.log(`Duplicate script ID skipped: ${id}`);
                    continue;
                }

                const script: CommandEntry = {
                    id,
                    name: `${scriptParent} > ${scriptName}`,
                    action: "script",
                    type: "Script",
                    path: f.fsName,
                    docRequired: false,
                    selRequired: false,
                    hidden: false,
                };

                commandsData[id] = script;
                scripts.push(script);
            }
        }
    },

    save() {
        const file = this.file();
        logger.log("writing user prefs");
        writeTextFile(JSON.stringify(prefs, undefined, 4), file);
    },

    backup() {
        const file = this.file();
        const ts = Date.now();
        const backupFile = new File(`${file}.${ts}.bak`);
        file.copy(backupFile);
        logger.log("user prefs backed up to:", backupFile.fsName);
        return backupFile;
    },

    reveal() {
        const folder = this.folder();
        logger.log("revealing user prefs");
        folder.execute();
    },
};
