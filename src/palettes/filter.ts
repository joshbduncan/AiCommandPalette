interface Command {
    id: string;
    type: string;
    [key: string]: any;
}

/**
 * Filter the supplied commands by multiple factors.
 * @param commands Command `id`s to filter through. If `null`, all commands are checked.
 * @param types Types of commands to include in the results (e.g. builtin, tool, config, etc.).
 * @param showHidden Should user-hidden commands be included?
 * @param showNonRelevant Should non-relevant commands be included?
 * @param hideSpecificCommands Specific commands to exclude from results.
 * @returns Filtered command IDs.
 */
function filterCommands(
    commands: string[] | null,
    types: string[] | null,
    showHidden: boolean,
    showNonRelevant: boolean,
    hideSpecificCommands?: string[]
): string[] {
    const filteredCommands: string[] = [];
    const allCommands = commands ?? Object.keys(commandsData);

    for (let i = 0; i < allCommands.length; i++) {
        const id = allCommands[i];
        if (!commandsData.hasOwnProperty(id)) continue;

        const command = commandsData[id];

        if (!commandVersionCheck(command)) {
            // logger.log(`incompatible version command: ${command.name["en"]} (${id})`);
            continue;
        }
        if (!showHidden && prefs.hiddenCommands.includes(id)) {
            // logger.log(`hidden command: ${command.name["en"]} (${id})`);
            continue;
        }
        if (!showNonRelevant && !relevantCommand(command)) {
            // logger.log(`not relevant command: ${command.name["en"]} (${id})`);
            continue;
        }
        if (hideSpecificCommands && hideSpecificCommands.includes(id)) {
            // logger.log(`user hidden command: ${command.name["en"]} (${id})`);
            continue;
        }
        if (!types || types.includes(command.type.toLowerCase()))
            filteredCommands.push(id);
    }

    return filteredCommands;
}

/**
 * Determine if a command is relevant at the current moment.
 * @param command Command object to check.
 * @returns Whether the command is relevant.
 */
function relevantCommand(command: Command): boolean {
    // hide commands requiring an active documents if requested
    if (command.docRequired && app.documents.length < 1) return false;
    // hide commands requiring an active selection if requested
    if (command.selRequired && app.activeDocument.selection.length < 1) return false;

    // hide `Remove Watched Folder...`
    if (command.id === "config_removeWatchedFolders" && !prefs.watchedFolders.length)
        return false;
    // hide `Edit Workflow...` command if no workflows
    if (command.id === "builtin_editWorkflow" && !prefs.workflows.length) return false;
    // hide `All Workflows...` command if no workflows
    if (command.id === "builtin_allWorkflows" && !prefs.workflows.length) return false;
    // hide `All Scripts...` command if no scripts
    if (command.id === "builtin_allScripts" && !prefs.scripts.length) return false;
    // hide `All Bookmarks...` command if no bookmarks
    if (command.id === "builtin_allBookmarks" && !prefs.bookmarks.length) return false;
    // hide `All Actions...` command if no actions
    if (command.id === "builtin_allActions" && !userActions.loadedActions) return false;
    // hide `Edit Picker...` command if no pickers
    if (command.id === "builtin_editPicker" && !prefs.pickers.length) return false;
    // hide `All Pickers...` command if no pickers
    if (command.id === "builtin_allPickers" && !prefs.pickers.length) return false;

    // hide `Enable Fuzzy Matching` command if already enabled
    if (command.id === "config_enableFuzzyMatching" && prefs.fuzzy) return false;
    // hide `Disable Fuzzy Matching` command if already disabled
    if (command.id === "config_disableFuzzyMatching" && !prefs.fuzzy) return false;

    // hide `Enable Debug Logging` command if already enabled
    if (command.id === "config_enableDebugLogging" && debugLogging) return false;
    // hide `Disable Debug Logging` command if already disabled
    if (command.id === "config_disableDebugLogging" && !debugLogging) return false;

    // hide `Unhide Commands...` command if no hidden commands
    if (command.id === "config_unhideCommand" && !prefs.hiddenCommands.length)
        return false;
    // hide `Recent Commands...` and `Clear History` if no recent commands
    if (
        command.id === "builtin_recentCommands" &&
        Object.keys(recentCommands).length === 0
    ) {
        return false;
    }

    return true;
}
