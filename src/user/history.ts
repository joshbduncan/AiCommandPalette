const userHistoryFolder = setupFolderObject(Folder.userData + "/JBD/AiCommandPalette");
const userHistoryFileName = "History.json";

// setup the base prefs model
let history = [];
const recentCommands = {};
const recentQueries = [];
const mostRecentCommands = [];
const latches = {};

interface UserHistory {
    folder(): Folder;
    file(): File;
    load(): void;
    clear(): void;
    save(): void;
    backup(): void;
    reveal(): void;
}

const userHistory: UserHistory = {
    folder() {
        return userHistoryFolder;
    },

    file() {
        const folder = this.folder();
        const file = setupFileObject(folder, userHistoryFileName);
        return file;
    },

    load() {
        const file = this.file();
        logger.log("loading user history:", file.fsName);
        if (file.exists) {
            const queryCommandsLUT = {};
            let loadedData, entry;
            try {
                loadedData = readJSONData(file);
                if (Object.keys(loadedData).length === 0) return;

                history = loadedData;
                for (let i = loadedData.length - 1; i >= 0; i--) {
                    entry = loadedData[i];
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
            } catch (e) {
                file.rename(file.name + ".bak");
                this.reveal();
                // @ts-ignore
                Error.runtimeError(1, localize(strings.history_file_loading_error));
            }
        }
    },

    clear() {
        const file = this.file();
        logger.log("clearing user history");
        file.remove();
    },

    save() {
        const file = this.file();
        logger.log("writing user history");
        if (history.length > 500) history = history.slice(-500);
        writeJSONData(history, file);
    },

    backup() {
        const ts = Date.now();
        const backupFile = new File(`${this.file.fsName}.${ts}.bak`);
        this.file.copy(backupFile);
        logger.log("user history backed up to:", backupFile.fsName);
        return backupFile;
    },

    reveal() {
        const folder = this.folder();
        logger.log("revealing history file");
        folder.execute();
    },
};
