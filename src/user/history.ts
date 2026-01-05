// setup the base prefs model
let history = [];
const recentCommands = {};
const recentQueries = [];
const mostRecentCommands = [];
const latches = {};

interface UserHistory {
    folder(): Folder;
    file(): File;
    update(version: string): void;
    load(): void;
    clear(): void;
    save(): void;
    backup(): void;
    reveal(): void;
}

const userHistory: UserHistory = {
    /**
     * Get the folder where user history is stored.
     *
     * @returns Folder object for the plugin data directory.
     */
    folder(): Folder {
        return pluginDataFolder;
    },

    /**
     * Get the File object for the user history JSON file.
     *
     * @returns File object for the history file.
     */
    file(): File {
        const folder = this.folder();
        return setupFileObject(folder, userHistoryFileName);
    },

    /**
     * Load user command history from disk and populate tracking data structures.
     *
     * This method reads the history file and builds several lookup tables:
     * - Recent commands with usage counts (for boosting search results)
     * - Recent queries (for history scrolling with up arrow)
     * - Most recent N commands (for "Recent Commands" feature)
     * - Query latches (most common command for each query string)
     *
     * Supports legacy JSON-like format and migrates to proper JSON automatically.
     *
     * @throws {Error} Throws a runtime error if the history file is corrupted and cannot
     *                 be parsed. The corrupted file is renamed to .bak and the history
     *                 folder is revealed to the user.
     */
    load(): void {
        const file = this.file();
        logger.log("loading user history:", file.fsName);
        if (!file.exists) return;

        const queryCommandsLUT = {};

        const s: string = readTextFile(file);
        let data;

        // try true JSON first
        try {
            data = JSON.parse(s);
            logger.log("history loaded as valid JSON");
        } catch (e) {
            logger.log("history not valid JSON, will try eval fallback:", e.message);
        }

        // try json-like eval second
        if (data === undefined) {
            try {
                data = eval(s);
                logger.log("history loaded as old JSON-like, saving as true JSON");
                // write true JSON back to disk
                writeTextFile(JSON.stringify(data), file);
            } catch (e) {
                file.rename(file.name + ".bak");
                this.reveal();
                // @ts-ignore
                Error.runtimeError(1, localize(strings.history_file_loading_error));
            }
        }

        if (!data || typeof data !== "object") return;
        if (Object.keys(data).length === 0) return;

        if (data === 0) return;

        let entry;
        history = data;
        for (let i = data.length - 1; i >= 0; i--) {
            entry = data[i];
            // track how many times a query ties to a command
            if (!queryCommandsLUT.hasOwnProperty(entry.query))
                queryCommandsLUT[entry.query] = {};
            if (!queryCommandsLUT[entry.query].hasOwnProperty(entry.command))
                queryCommandsLUT[entry.query][entry.command] = 0;
            queryCommandsLUT[entry.query][entry.command]++;
            // track how often recent command have been ran
            if (!recentCommands.hasOwnProperty(entry.command))
                recentCommands[entry.command] = 0;
            recentCommands[entry.command]++;
            // track recent queries
            if (!recentQueries.includes(entry.query)) {
                recentQueries.push(entry.query);
            }
            // track the past 25 most recent commands
            if (
                mostRecentCommands.length <= mostRecentCommandsCount &&
                commandsData.hasOwnProperty(entry.command) &&
                !mostRecentCommands.includes(entry.command)
            )
                mostRecentCommands.push(entry.command);
        }

        // build latches with most common command for each query
        let commands;
        for (const query in queryCommandsLUT) {
            commands = [];
            for (const command in queryCommandsLUT[query]) {
                commands.push([command, queryCommandsLUT[query][command]]);
            }
            // sort by most used
            commands.sort(function (a, b) {
                return b[1] - a[1];
            });
            latches[query] = commands[0][0];
        }
    },

    update(version: string): void {
        const file = this.file();
        logger.log("updating user history:", file.fsName);
        if (!file.exists) return;

        const queryCommandsLUT = {};

        const s: string = readTextFile(file);
        let data;

        // try true JSON first
        try {
            data = JSON.parse(s);
            logger.log("history loaded as valid JSON");
        } catch (e) {
            logger.log("history not valid JSON, will try eval fallback:", e.message);
        }

        // try json-like eval second
        if (data === undefined) {
            try {
                data = eval(s);
                logger.log("history loaded as old JSON-like, saving as true JSON");
                // write true JSON back to disk
                writeTextFile(JSON.stringify(data), file);
            } catch (e) {
                file.rename(file.name + ".bak");
                this.reveal();
                // @ts-ignore
                Error.runtimeError(1, localize(strings.history_file_loading_error));
            }
        }

        if (!data || typeof data !== "object") return;
        if (Object.keys(data).length === 0) return;

        if (data === 0) return;

        switch (version) {
            case "0.16.0":
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

                let entry;
                let updatedHistory = [];
                let updatedEntry = {};
                for (let i = data.length - 1; i >= 0; i--) {
                    entry = data[i];
                    updatedEntry["query"] = entry.query;
                    updatedEntry["timestamp"] = entry.timestamp;
                    updatedEntry["command"] = entry.command;

                    // update command
                    const oldId = entry.command;

                    if (
                        !commandsLUT.hasOwnProperty(oldId) ||
                        oldId == commandsLUT[oldId]
                    )
                        continue;

                    logger.log(
                        `- updating history command: ${oldId} -> ${commandsLUT[oldId]}`
                    );
                    updatedEntry["command"] = commandsLUT[oldId];

                    updatedHistory.push(updatedEntry);
                }
                history = data;
                userHistory.save();
                break;
            default:
                break;
        }
    },

    /**
     * Clear all user command history by deleting the history file.
     *
     * This permanently removes all tracked queries, command usage, and latches.
     * The file will be recreated on the next save() call.
     */
    clear(): void {
        const file = this.file();
        logger.log("clearing user history");
        file.remove();
    },

    /**
     * Save current command history to disk as JSON.
     *
     * Automatically trims the history to the most recent 500 entries to prevent
     * unbounded growth. Writes with pretty-printing (4-space indentation).
     */
    save(): void {
        const file = this.file();
        logger.log("writing user history");
        if (history.length > 500) history = history.slice(-500);
        writeTextFile(JSON.stringify(history, undefined, 4), file);
    },

    /**
     * Create a timestamped backup of the history file.
     *
     * Copies the current history file to a new file with the format:
     * `{filename}.{timestamp}.bak`
     *
     * @returns File object representing the backup file.
     */
    backup(): File {
        const file = this.file();
        const ts = Date.now();
        const backupFile = new File(`${file}.${ts}.bak`);
        file.copy(backupFile);
        logger.log("user history backed up to:", backupFile.fsName);
        return backupFile;
    },

    /**
     * Open the history folder in the system file browser.
     *
     * This is useful for users who want to manually inspect or manage their
     * history file.
     */
    reveal(): void {
        const folder = this.folder();
        logger.log("revealing history file");
        folder.execute();
    },
};
