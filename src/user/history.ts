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
        return pluginDataFolder;
    },

    file() {
        const folder = this.folder();
        return setupFileObject(folder, userHistoryFileName);
    },

    load() {
        const file = this.file();
        logger.log("loading user history:", file.fsName);
        if (!file.exists) return;

        const queryCommandsLUT = {};

        const s: string = readTextFile(file);
        let data;

        // try true JSON first
        try {
            data = JSON.parse(s);
        } catch (e) {}

        // try json-like eval second
        if (data === undefined) {
            try {
                data = eval(s);
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

    clear() {
        const file = this.file();
        logger.log("clearing user history");
        file.remove();
    },

    save() {
        const file = this.file();
        logger.log("writing user history");
        if (history.length > 500) history = history.slice(-500);
        writeTextFile(JSON.stringify(history, undefined, 4), file);
    },

    backup() {
        const file = this.file();
        const ts = Date.now();
        const backupFile = new File(`${file}.${ts}.bak`);
        file.copy(backupFile);
        logger.log("user history backed up to:", backupFile.fsName);
        return backupFile;
    },

    reveal() {
        const folder = this.folder();
        logger.log("revealing history file");
        folder.execute();
    },
};
