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
    /**
     * Get the folder where user preferences are stored.
     *
     * @returns Folder object for the plugin data directory.
     */
    folder(): Folder {
        return pluginDataFolder;
    },

    /**
     * Get the File object for the user preferences JSON file.
     *
     * @returns File object for the preferences file.
     */
    file(): File {
        const folder = this.folder();
        return setupFileObject(folder, userPrefsFileName);
    },

    /**
     * Loads user preferences from disk (migrates legacy formats as needed).
     * If `inject` is true, calls `this.inject()` after loading.
     *
     * @param inject - Inject user commands into `commandsData`.
     * @throws {Error} Throws a runtime error if the preferences file is corrupted and cannot
     *                 be parsed. The corrupted file is renamed to .bak and the preferences
     *                 folder is revealed to the user.
     */
    load(inject?: boolean): void {
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
        } catch (e) {
            logger.log("prefs not valid JSON, will try eval fallback:", e.message);
        }

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

                // only add commands where the is new (menu commands for now)
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
            userHistory.backup();
            userHistory.update("0.16.0");
            this.save();
        }
    },

    /**
     * Inject user-created commands into the global commandsData object.
     *
     * This method takes workflows, bookmarks, scripts, pickers, and custom commands
     * from the loaded preferences and adds them to the main command registry so they
     * can be executed by the command palette.
     */
    inject(): void {
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

    /**
     * Load scripts from all watched folders into the command palette.
     *
     * Recursively scans each watched folder for .jsx and .js files, creates command
     * entries for them, and adds them to commandsData. If a watched folder doesn't
     * exist, the user is notified.
     */
    loadWatchedScripts(): void {
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

    /**
     * Save current preferences to disk as JSON.
     *
     * Writes the global `prefs` object to the preferences file with pretty-printing
     * (4-space indentation) for better readability.
     */
    save(): void {
        const file = this.file();
        logger.log("writing user prefs");
        writeTextFile(JSON.stringify(prefs, undefined, 4), file);
    },

    /**
     * Create a timestamped backup of the preferences file.
     *
     * Copies the current preferences file to a new file with the format:
     * `{filename}.{timestamp}.bak`
     *
     * @returns File object representing the backup file.
     */
    backup(): File {
        const file = this.file();
        const ts = Date.now();
        const backupFile = new File(`${file}.${ts}.bak`);
        file.copy(backupFile);
        logger.log("user prefs backed up to:", backupFile.fsName);
        return backupFile;
    },

    /**
     * Open the preferences folder in the system file browser.
     *
     * This is useful for users who want to manually inspect or edit their
     * preferences and related files.
     */
    reveal(): void {
        const folder = this.folder();
        logger.log("revealing user prefs");
        folder.execute();
    },
};
