/**
 * Process a command by its ID.
 * Handles workflows recursively and validates them before execution.
 * @param id - The ID of the command to process.
 */
function processCommand(id: string): void {
    const command: CommandEntry = commandsData[id];
    logger.log("processing command:", command.id);

    if (command.type === "workflow") {
        const badActions = checkWorkflowActions(command.actions);
        if (badActions.length > 0) {
            alert(localize(strings.wf_needs_attention, badActions.join("\n")));
            // TODO: should bad actions be displayed differently in the workflow builder?
            buildWorkflow(id);
            userPrefs.save();
            return;
        }

        for (const actionId of command.actions) {
            processCommand(actionId);
        }
    } else {
        executeAction(command);
    }
}

/**
 * Execute a command action based on its type.
 * @param command - The command object to execute.
 */
function executeAction(command: CommandEntry): void {
    // Check if an active document is required
    if (command.docRequired && app.documents.length < 1) {
        const shouldProceed = confirm(
            localize(strings.cd_active_document_required, command.action),
            false,
            localize(strings.cd_exception)
        );
        if (!shouldProceed) return;
    }

    // Check if an active selection is required
    if (command.selRequired && app.activeDocument.selection.length < 1) {
        const shouldProceed = confirm(
            localize(strings.cd_active_selection_required, command.action),
            false,
            localize(strings.cd_exception)
        );
        if (!shouldProceed) return;
    }

    let func;
    let alertString: LocalizedStringEntry = strings.cd_error_executing;

    switch (command.type.toLowerCase()) {
        case "config":
        case "builtin":
            func = internalAction;
            break;
        case "custom":
            func = command.actionType === "menu" ? menuAction : toolAction;
            break;
        case "menu":
            func = menuAction;
            break;
        case "tool":
            func = toolAction;
            alertString = strings.tl_error_selecting;
            break;
        case "action":
            func = actionAction;
            alertString = strings.ac_error_execution;
            break;
        case "bookmark":
        case "file":
        case "folder":
            func = bookmarkAction;
            break;
        case "picker":
            func = runCustomPicker;
            break;
        case "script":
            func = scriptAction;
            alertString = strings.sc_error_execution;
            break;
        default:
            alert(localize(strings.cd_invalid, command.type));
            return;
    }

    try {
        func(command);
    } catch (e) {
        const name = isLocalizedEntry(command.name)
            ? localize(command.name)
            : command.name;
        logger.log("Error executing command:", command.id, "-", e.message);
        alert(localize(alertString, name, e.message));
    }
}

function menuAction(command: CommandEntry): void {
    app.executeMenuCommand(command.action);
}

function toolAction(command: CommandEntry): void {
    // @ts-ignore
    app.selectTool(command.action);
}

function actionAction(command: CommandEntry): void {
    const actionName = isLocalizedEntry(command.name)
        ? localize(command.name)
        : command.name;
    app.doScript(actionName, command.set);
}

function bookmarkAction(command: CommandEntry): void {
    if (command.type === "file") {
        const f = new File(command.path);
        if (!f.exists) {
            alert(localize(strings.bm_error_exists, command.path));
            return;
        }
        app.open(f);
    } else if (command.type === "folder") {
        const f = new Folder(command.path);
        if (!f.exists) {
            alert(localize(strings.bm_error_exists, command.path));
            return;
        }
        f.execute();
    }
}

interface Picker {
    name: string;
    commands: string[];
    multiselect: boolean;
}

function runCustomPicker(picker: Picker): void {
    const commands: string[] = [];

    for (let i = 0; i < picker.commands.length; i++) {
        const id = `${picker.name}_option_${i}`;
        const command: CommandEntry = {
            id,
            action: "picker_option",
            type: "Option",
            docRequired: false,
            selRequired: false,
            name: picker.commands[i],
            hidden: false,
        };
        commandsData[id] = command;
        commands.push(id);
    }

    const result = commandPalette(
        commands,
        picker.name,
        paletteSettings.columnSets.standard,
        picker.multiselect
    );

    if (!result) {
        $.setenv("aic_picker_last", null);
    }

    const commandIds: string[] = Array.isArray(result)
        ? (result as string[])
        : [result as string];

    const args = commandIds.map((id) => commandsData[id].name as string);

    $.setenv("aic_picker_last", args.toSource());
}

function scriptAction(command: CommandEntry): void {
    const f = new File(command.path);
    if (!f.exists) {
        alert(localize(strings.sc_error_exists, command.path));
        return;
    }
    $.evalFile(f);
}

/**
 * Execute internal script actions.
 * @param command Command to execute.
 */
function internalAction(command: CommandEntry): void {
    let shouldWritePrefs = true;

    const { action } = command;

    switch (action) {
        // config commands
        case "about":
            shouldWritePrefs = false;
            about();
            break;
        case "clearHistory":
            clearHistory();
            break;
        case "customizeStartup":
            customizeStartup();
            break;
        case "deleteCommand":
            deleteCommand();
            break;
        case "removeWatchedFolders":
            removeWatchedFolders();
            break;
        case "enableFuzzyMatching":
        case "disableFuzzyMatching":
            toggleFuzzyMatching();
            break;
        case "enableDebugLogging":
        case "disableDebugLogging":
            toggleDebugLogging();
            break;
        case "hideCommand":
            hideCommand();
            break;
        case "unhideCommand":
            unhideCommand();
            break;
        case "revealLog":
            shouldWritePrefs = false;
            revealLog();
            break;
        case "revealPrefFile":
            shouldWritePrefs = false;
            revealPrefFile();
            break;
        case "builtinCommands":
            shouldWritePrefs = false;
            builtinCommands();
            break;
        case "settings":
            shouldWritePrefs = false;
            settings();
            break;

        // builtin commands
        case "addCustomCommands":
            addCustomCommands();
            break;
        case "allActions":
            shouldWritePrefs = false;
            showAllActions();
            break;
        case "allBookmarks":
            shouldWritePrefs = false;
            showAllBookmarks();
            break;
        case "allCustomCommands":
            shouldWritePrefs = false;
            showAllCustomCommands();
            break;
        case "allMenus":
            shouldWritePrefs = false;
            showAllMenus();
            break;
        case "allPickers":
            shouldWritePrefs = false;
            showAllPickers();
            break;
        case "allScripts":
            shouldWritePrefs = false;
            showAllScripts();
            break;
        case "allTools":
            shouldWritePrefs = false;
            showAllTools();
            break;
        case "allWorkflows":
            shouldWritePrefs = false;
            showAllWorkflows();
            break;
        case "buildWorkflow":
            buildWorkflow();
            break;
        case "editWorkflow":
            editWorkflow();
            break;
        case "buildPicker":
            buildPicker();
            break;
        case "editPicker":
            editPicker();
            break;
        case "documentReport":
            shouldWritePrefs = false;
            documentReport();
            break;
        case "exportVariables":
            shouldWritePrefs = false;
            exportVariables();
            break;
        case "goToArtboard":
            shouldWritePrefs = false;
            goToArtboard();
            break;
        case "goToDocument":
            shouldWritePrefs = false;
            goToOpenDocument();
            break;
        case "goToNamedObject":
            shouldWritePrefs = false;
            goToNamedObject();
            break;
        case "imageCapture":
            shouldWritePrefs = false;
            imageCapture();
            break;
        case "loadFileBookmark":
            loadFileBookmark();
            break;
        case "loadFolderBookmark":
            loadFolderBookmark();
            break;
        case "loadScript":
            loadScripts();
            break;
        case "recentCommands":
            shouldWritePrefs = false;
            recentUserCommands();
            break;
        case "recentFiles":
            shouldWritePrefs = false;
            recentFiles();
            break;
        case "redrawWindows":
            shouldWritePrefs = false;
            redrawWindows();
            break;
        case "revealActiveDocument":
            shouldWritePrefs = false;
            revealActiveDocument();
            break;
        case "watchScriptFolder":
            watchScriptFolder();
            break;
        default:
            alert(localize(strings.cd_invalid, action));
            return;
    }

    if (shouldWritePrefs) {
        userPrefs.save();
    }
}
