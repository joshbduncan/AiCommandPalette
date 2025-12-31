/**
 * Ai Command Palette About Dialog.
 */
function about(): void {
    const win = new Window("dialog");
    win.text = localize(strings.about);
    win.alignChildren = "fill";

    // Script info panel
    const pAbout = win.add("panel") as Panel;
    pAbout.margins = 20;
    pAbout.alignChildren = "fill";

    pAbout.add("statictext", [0, 0, 500, 100], localize(strings.description), {
        multiline: true,
    });

    // Info + GitHub link
    const links = pAbout.add("group") as Group;
    links.orientation = "column";
    links.alignChildren = ["center", "center"];

    links.add("statictext", undefined, localize(strings.version, _version));
    links.add("statictext", undefined, localize(strings.copyright));

    const githubText = `${localize(
        strings.github
    )}: https://github.com/joshbduncan/AiCommandPalette`;

    const github = links.add("statictext", undefined, githubText) as StaticText;

    // Footer buttons
    const winButtons = win.add("group") as Group;
    winButtons.orientation = "row";
    winButtons.alignChildren = ["center", "center"];

    const ok = winButtons.add("button", undefined, "OK") as Button;
    ok.preferredSize.width = 100;

    // Event: click GitHub link
    github.addEventListener("mousedown", () => {
        openURL("https://github.com/joshbduncan/AiCommandPalette");
    });

    win.show();
}

/**
 * Present a palette with Ai Command Palette configuration commands.
 */
function settings(): void {
    const configCommands: string[] = filterCommands(null, ["config"], true, false, [
        "config_settings",
    ]);

    const result = commandPalette(
        configCommands,
        localize(strings.cp_config),
        paletteSettings.columnSets.standard,
        false
    );

    if (!result) return;

    const commandId: string = Array.isArray(result) ? result[0] : (result as string);

    processCommand(commandId);
}

interface PickerCommandEntry {
    id: string;
    action: "picker";
    name: string;
    commands: string[];
    type: "picker";
    docRequired: boolean;
    selRequired: boolean;
    hidden: boolean;
    multiselect: boolean;
}

interface PickerBuilderResult {
    name: string;
    commands: string[];
    multiselect: boolean;
    overwrite: boolean;
}

/**
 * Present the Picker Builder dialog for building/editing a user picker.
 * @param editPickerId Id of a current user picker to edit.
 * @returns The created or updated PickerCommandEntry, or undefined if cancelled.
 */
function buildPicker(editPickerId?: string): PickerCommandEntry | undefined {
    const result = pickerBuilder(editPickerId);
    if (!result) return;

    let id: string;
    let picker: PickerCommandEntry;

    if (result.overwrite) {
        // Update existing picker
        for (let i = prefs.pickers.length - 1; i >= 0; i--) {
            if (prefs.pickers[i].name === result.name) {
                prefs.pickers[i].commands = result.commands;
                prefs.pickers[i].multiselect = result.multiselect;
                id = prefs.pickers[i].id;
                picker = prefs.pickers[i];
                break;
            }
        }
    } else {
        // Create new picker
        id = generateCommandId(`picker_${result.name.toLowerCase()}`);
        picker = {
            id,
            action: "picker",
            name: result.name,
            commands: result.commands,
            type: "picker",
            docRequired: false,
            selRequired: false,
            hidden: false,
            multiselect: result.multiselect,
        };
        prefs.pickers.push(picker);
        commandsData[id] = picker;
    }

    addToStartup([id]);
    return picker;
}

/**
 * Present a palette with all user-created pickers. The selected picker will
 * be opened in the picker builder.
 */
function editPicker(): void {
    const pickers: string[] = filterCommands(null, ["picker"], true, false, null);

    const result = commandPalette(
        pickers,
        localize(strings.picker_to_edit),
        paletteSettings.columnSets.standard,
        false
    );

    if (!result) return;

    const commandId: string = Array.isArray(result) ? result[0] : (result as string);

    processCommand(commandId);
}

/**
 * Clear all user history.
 */
function clearHistory(): void {
    const confirmed = confirm(
        localize(strings.cd_clear_history_confirm),
        false,
        localize(strings.cd_exception)
    );

    if (confirmed) {
        userHistory.clear();
        alert(localize(strings.history_cleared));
    }
}

/**
 * Present the Ai Command Palette startup configurator dialog.
 */
function customizeStartup(): void {
    const availableStartupCommands = filterCommands(
        null,
        [
            "file",
            "folder",
            "script",
            "workflow",
            "menu",
            "tool",
            "action",
            "builtin",
            "config",
        ],
        true, // showHidden
        true, // showNonRelevant
        prefs.startupCommands // hideSpecificCommands
    );

    // Show the startup builder dialog
    const result = startupBuilder(availableStartupCommands);
    if (!result) return;

    prefs.startupCommands = result;
}

/**
 * Present a dialog for adding/editing custom user commands.
 */
function addCustomCommands(): void {
    function parseCSVLine(line: string): string[] {
        const result: string[] = [];
        let current = "";
        let quoteChar: '"' | "'" | null = null;

        for (let i = 0; i < line.length; i++) {
            const c = line.charAt(i);

            if (c === '"' || c === "'") {
                if (quoteChar === null) {
                    quoteChar = c;
                } else if (quoteChar === c) {
                    quoteChar = null;
                } else {
                    current += c;
                }
            } else if (c === "," && quoteChar === null) {
                result.push(current);
                current = "";
            } else {
                current += c;
            }
        }

        result.push(current);
        return result;
    }

    const result = addCustomCommandsDialog();
    if (!result || result == "") return;

    // if (!("customCommands" in prefs)) {
    //     prefs.customCommands = [];
    // }

    const newCustomCommandIds: string[] = [];
    const normalized = result.replace(/\r\n|\r/g, "\n");
    const lines = normalized.split("\n");

    for (const lineRaw of lines) {
        const line = lineRaw.trim();
        if (line === "") continue;

        const parts = parseCSVLine(line);
        if (parts.length < 3) continue;

        const [name, action, rawType] = parts;
        const type = rawType.toLowerCase();

        if (type !== "menu" && type !== "tool") continue;

        const id = generateCommandId(`custom_${action.toLowerCase()}`);

        const obj: CommandEntry = {
            id,
            action,
            actionType: type,
            type: "custom",
            name,
            docRequired: false,
            selRequired: false,
            hidden: false,
        };

        newCustomCommandIds.push(id);
        prefs.customCommands.push(obj);
        commandsData[id] = obj;
    }

    addToStartup(newCustomCommandIds);
}

/**
 * Present a palette with all user-created commands (e.g. bookmarks, scripts, workflows).
 * The selected command(s) will be deleted.
 */
function deleteCommand(): void {
    const deletableCommands = filterCommands(
        null,
        ["file", "folder", "script", "workflow", "picker", "custom"],
        false,
        true,
        null
    );

    const result = commandPalette(
        deletableCommands,
        localize(strings.cd_delete_select),
        paletteSettings.columnSets.standard,
        true
    );

    if (!result || result.length === 0) return;

    const commandIds: string[] = Array.isArray(result)
        ? (result as string[])
        : [result as string];

    const commandNames = commandIds.map((id) => commandsData[id].name);

    const confirmed = confirm(
        localize(strings.cd_delete_confirm, commandNames.join("\n")),
        false,
        localize(strings.cd_delete_confirm_title)
    );

    if (!confirmed) return;

    // Delete from prefs collections
    const typesToCheck: any[] = [
        prefs.workflows,
        prefs.bookmarks,
        prefs.scripts,
        prefs.pickers,
    ];
    for (const type of typesToCheck) {
        for (let i = type.length - 1; i >= 0; i--) {
            if (result.includes(type[i].id)) {
                type.splice(i, 1);
            }
        }
    }

    // Delete from startup commands
    for (let i = prefs.startupCommands.length - 1; i >= 0; i--) {
        if (result.includes(prefs.startupCommands[i])) {
            prefs.startupCommands.splice(i, 1);
        }
    }
}

/**
 * Present a palette with all user watched folders.
 * The selected command(s) will be deleted.
 */
function removeWatchedFolders(): void {
    const commands: string[] = [];

    for (let i = 0; i < prefs.watchedFolders.length; i++) {
        const folder = new Folder(prefs.watchedFolders[i]);
        const id = generateCommandId("watchedFolder_" + hashString(folder.fsName));
        const command: CommandEntry = {
            id,
            name: folder.fsName,
            action: "Remove Watched Folder",
            type: "Watched Folder",
            docRequired: false,
            selRequired: false,
            hidden: false,
            index: i,
        };
        commandsData[id] = command;
        commands.push(id);
    }

    const result = commandPalette(
        commands,
        localize(strings.remove_watched_folders),
        paletteSettings.columnSets.standard,
        true
    );

    if (!result || result.length === 0) return;

    const commandIds: string[] = Array.isArray(result)
        ? (result as string[])
        : [result as string];

    const folderLocations = commandIds.map((id) => commandsData[id].path);

    const confirmed = confirm(
        localize(strings.remove_watched_folders_confirm, folderLocations.join("\n")),
        false,
        localize(strings.remove_watched_folders_confirm_title)
    );

    if (!confirmed) return;

    const indexesToRemove: number[] = commandIds.map((id) => commandsData[id].index);

    // sort descending so we remove from the end first
    indexesToRemove.sort((a, b) => b - a);

    // Delete watched folders from prefs
    for (const index of indexesToRemove) {
        if (index >= 0 && index < prefs.watchedFolders.length) {
            prefs.watchedFolders.splice(index, 1);
        }
    }
}

/**
 * Toggle fuzzy command matching in user preferences.
 */
function toggleFuzzyMatching(): void {
    prefs.fuzzy = Boolean(!prefs.fuzzy);
}

/**
 * Toggle debug logging by updating the environment variable.
 */
function toggleDebugLogging(): void {
    $.setenv("AICP_DEBUG_LOGGING", debugLogging ? "false" : "true");
}

/**
 * Present a palette with all possible commands (excluding config commands).
 * The selected command(s) will be hidden from the palette.
 */
function hideCommand(): void {
    const hideableCommands = filterCommands(
        null,
        [
            "bookmark",
            "custom",
            "script",
            "workflow",
            "menu",
            "tool",
            "action",
            "builtin",
            "picker",
        ],
        false,
        true,
        null
    );

    const result = commandPalette(
        hideableCommands,
        localize(strings.cd_hide_select),
        paletteSettings.columnSets.standard,
        true
    );

    if (!result) return;

    const commandIds: string[] = Array.isArray(result)
        ? (result as string[])
        : [result as string];

    prefs.hiddenCommands = prefs.hiddenCommands.concat(commandIds);
}

/**
 * Reveal the plugin log file in the file system.
 */
function revealLog(): void {
    logger.reveal();
}

/**
 * Reveal the user preference file in the file system.
 */
function revealPrefFile(): void {
    userPrefs.reveal();
}

/**
 * Present a palette with all built-in commands.
 */
function builtinCommands(): void {
    const builtins = filterCommands(null, ["builtin"], true, false, null);

    const result = commandPalette(
        builtins,
        localize(strings.cd_all),
        paletteSettings.columnSets.standard,
        false
    );

    const commandId: string = Array.isArray(result) ? result[0] : (result as string);

    processCommand(commandId);
}

/**
 * Present a palette with all hidden commands.
 * The selected command will be unhidden.
 */
function unhideCommand(): void {
    const result = commandPalette(
        prefs.hiddenCommands,
        localize(strings.cd_reveal_menu_select),
        paletteSettings.columnSets.standard,
        true
    );

    if (!result) return;

    let ids: CommandId[];
    if (typeof result === "string") {
        ids = [result];
    } else {
        ids = result; // CommandId[]
    }

    for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const index = prefs.hiddenCommands.indexOf(id);
        if (index !== -1) prefs.hiddenCommands.splice(index, 1);
    }
}

// AI COMMAND PALETTE BUILT-IN OPERATIONS

function documentReport(): void {
    const doc = app.activeDocument;
    const rulerUnits = doc.rulerUnits.toString().split(".").pop()! as UnitName;
    const docUnitValue = new UnitValue(1, rulerUnits);
    const docUnitNameAbbrev = docUnitValue.type == "?" ? "pt" : docUnitValue.type;

    const fileInfo = [
        localize(strings.dr_header),
        `${localize(strings.dr_filename)}${doc.name}`,
        `${localize(strings.dr_path)}${doc.path.fsName || localize(strings.none)}`,
        `${localize(strings.dr_color_space)}${doc.documentColorSpace
            .toString()
            .split(".")
            .pop()}`,
        `${localize(strings.dr_width)}${UnitValue(`${doc.width} pt`).as(
            docUnitNameAbbrev
        )} ${docUnitNameAbbrev}`,
        `${localize(strings.dr_height)}${UnitValue(`${doc.height} pt`).as(
            docUnitNameAbbrev
        )} ${docUnitValue.type}`,
    ].join("\n");

    const artboards = getCollectionObjectNames(doc.artboards);
    const documentFonts = getDocumentFonts(doc);
    const fonts = getCollectionObjectNames(documentFonts, true);
    const layers = getCollectionObjectNames(doc.layers);
    const placedFiles = getPlacedFileInfoForReport();
    const spotColors = getCollectionObjectNames(doc.spots, true);
    const reportOptions: Record<string, { str: string; active: boolean }> = {
        artboards: {
            str: artboards.join("\n"),
            active: true,
        },
        fonts: {
            str: fonts.join("\n"),
            active: true,
        },
        layers: {
            str: layers.join("\n"),
            active: true,
        },
        placed_items: {
            str: getPlacedFileInfoForReport().join("\n"),
            active: true,
        },
        spot_colors: {
            str: spotColors.join("\n"),
            active: true,
        },
    };

    function buildReport(): string {
        let info = `${localize(strings.dr_info_string)}\n\n${fileInfo}`;
        for (const key in reportOptions) {
            const option = reportOptions[key];
            if (option.active && option.str) {
                info += `\n\n${localize(strings[key.toLowerCase()])}\n-----\n${
                    option.str
                }`;
            }
        }
        return `${info}\n\n${localize(strings.dr_file_created)}${new Date()}`;
    }

    const win = new Window("dialog");
    win.text = localize(strings.document_report);
    win.orientation = "column";
    win.alignChildren = ["center", "top"];
    win.alignChildren = "fill";

    if (!doc.saved) {
        const warning = win.add(
            "statictext",
            undefined,
            localize(strings.document_report_warning)
        );
        warning.justify = "center";

        warning.graphics.foregroundColor = warning.graphics.newPen(
            // @ts-ignore
            win.graphics.PenType.SOLID_COLOR,
            [1, 0, 0],
            1
        );
    }

    const pOptions = win.add("panel", undefined, "Include?");
    pOptions.orientation = "row";
    pOptions.margins = 20;

    for (const key in reportOptions) {
        const option = reportOptions[key];
        const cb = pOptions.add("checkbox", undefined, key) as Checkbox;
        cb.value = !!option.str;
        cb.enabled = !!option.str;
        cb.onClick = function () {
            option.active = this.value;
            info.text = buildReport();
        };
    }

    const info = win.add("edittext", [0, 0, 400, 400], buildReport(), {
        multiline: true,
        scrollable: true,
        readonly: true,
    }) as EditText;

    const winButtons = win.add("group");
    winButtons.orientation = "row";
    winButtons.alignChildren = ["center", "center"];
    const saveInfo = winButtons.add(
        "button",
        undefined,
        localize(strings.save)
    ) as Button;
    saveInfo.preferredSize.width = 100;
    const close = winButtons.add("button", undefined, localize(strings.close), {
        name: "ok",
    }) as Button;
    close.preferredSize.width = 100;

    saveInfo.onClick = function () {
        const f = File.saveDialog(localize(strings.save_active_document_report));
        if (f) {
            try {
                f.encoding = "UTF-8";
                f.open("w");
                f.write(info.text);
            } catch (e) {
                alert(localize(strings.fl_error_writing, f));
            } finally {
                f.close();
            }
            if (f.exists) alert(localize(strings.file_saved, f.fsName));
        }
    };

    win.show();
}

function showAllActions(): void {
    const actionCommands = filterCommands(null, ["action"], true, false, null);

    const columns: Record<string, { width: number; key: string }> = {
        [localize(strings.name_title_case)]: {
            width: 100,
            key: "name",
        },
        [localize(strings.set_title_case)]: {
            width: 100,
            key: "set",
        },
    };

    const result = commandPalette(
        actionCommands,
        localize(strings.Actions),
        columns,
        false
    );

    if (!result) return;

    const commandId: string = Array.isArray(result) ? result[0] : (result as string);

    processCommand(commandId);
}

function showAllBookmarks(): void {
    const bookmarkCommands = filterCommands(null, ["file", "folder"], true, true, null);

    const columns: Record<string, { width: number; key: string }> = {
        [localize(strings.name_title_case)]: {
            width: 100,
            key: "name",
        },
        [localize(strings.type_title_case)]: {
            width: 100,
            key: "type",
        },
        [localize(strings.path_title_case)]: {
            width: 100,
            key: "path",
        },
    };

    const result = commandPalette(
        bookmarkCommands,
        localize(strings.Bookmarks),
        columns,
        false
    );

    if (!result) return;

    const commandId: string = Array.isArray(result) ? result[0] : (result as string);

    processCommand(commandId);
}

function showAllCustomCommands(): void {
    const customCommands = filterCommands(null, ["custom"], true, false, null);

    const result = commandPalette(
        customCommands,
        localize(strings.custom_commands_all),
        paletteSettings.columnSets.customCommand,
        false
    );

    if (!result) return;

    const commandId: string = Array.isArray(result) ? result[0] : (result as string);

    processCommand(commandId);
}

function showAllMenus(): void {
    const menus = filterCommands(null, ["menu"], true, false, null);

    const result = commandPalette(
        menus,
        localize(strings.menu_commands),
        paletteSettings.columnSets.standard,
        false
    );

    if (!result) return;

    const commandId: string = Array.isArray(result) ? result[0] : (result as string);

    processCommand(commandId);
}

function showAllPickers(): void {
    const pickers = filterCommands(null, ["picker"], true, false, null);
    const result = commandPalette(
        pickers,
        localize(strings.pickers_all),
        paletteSettings.columnSets.standard,
        false
    );
    if (!result) return;

    const commandId: string = Array.isArray(result) ? result[0] : (result as string);

    processCommand(commandId);
}

function showAllScripts(): void {
    const scripts = filterCommands(null, ["script"], true, false, null);
    const columns = {
        [localize(strings.name_title_case)]: { width: 100, key: "name" },
        [localize(strings.type_title_case)]: { width: 100, key: "type" },
        [localize(strings.path_title_case)]: { width: 100, key: "path" },
    };

    const result = commandPalette(scripts, localize(strings.Scripts), columns, false);
    if (!result) return;

    const commandId: string = Array.isArray(result) ? result[0] : (result as string);

    processCommand(commandId);
}

function showAllTools(): void {
    const tools = filterCommands(null, ["tool"], true, false, null);
    const result = commandPalette(
        tools,
        localize(strings.tl_all),
        paletteSettings.columnSets.standard,
        false
    );
    if (!result) return;

    const commandId: string = Array.isArray(result) ? result[0] : (result as string);

    processCommand(commandId);
}

function showAllWorkflows(): void {
    const workflows = filterCommands(null, ["workflow"], true, false, null);
    const result = commandPalette(
        workflows,
        localize(strings.Workflows),
        paletteSettings.columnSets.standard,
        false
    );
    if (!result) return;

    const commandId: string = Array.isArray(result) ? result[0] : (result as string);

    processCommand(commandId);
}

function buildWorkflow(editWorkflowId?: string): void {
    const commandsToHide = [
        "builtin_editPicker",
        "builtin_buildWorkflow",
        "builtin_editWorkflow",
    ];
    if (editWorkflowId) commandsToHide.push(editWorkflowId);

    const availableWorkflowCommands = filterCommands(
        null,
        [
            "file",
            "folder",
            "script",
            "watchedScript",
            "workflow",
            "menu",
            "tool",
            "action",
            "builtin",
            "picker",
        ],
        true,
        true,
        commandsToHide
    );

    const result = workflowBuilder(availableWorkflowCommands, editWorkflowId);
    if (!result) return;

    let id: string;

    if (result.overwrite) {
        for (let i = prefs.workflows.length - 1; i >= 0; i--) {
            if (prefs.workflows[i].name === result.name) {
                prefs.workflows[i].actions = result.actions;
                id = prefs.workflows[i].id;
                break;
            }
        }
    } else {
        id = generateCommandId("workflow_" + result.name.toLowerCase());
        const workflow: CommandEntry = {
            id,
            action: "workflow",
            name: result.name,
            actions: result.actions,
            type: "workflow",
            docRequired: false,
            selRequired: false,
            hidden: false,
        };
        prefs.workflows.push(workflow);
    }

    addToStartup([id]);
}

/**
 * Present a palette with all user-created workflows. The selected workflow will
 * be opened in the workflow builder.
 */
function editWorkflow(): void {
    const workflows = filterCommands(null, ["workflow"], true, false, null);

    const result = commandPalette(
        workflows,
        localize(strings.wf_choose),
        paletteSettings.columnSets.standard,
        false
    );

    if (!result) return;

    const commandId: string = Array.isArray(result) ? result[0] : (result as string);

    buildWorkflow(commandId);
}

/**
 * Export the active artboard as a PNG file using the `Document.imageCapture()` method.
 * https://ai-scripting.docsforadobe.dev/jsobjref/Document.html?#document-imagecapture
 */
function imageCapture(): void {
    if (app.documents.length === 0) {
        alert(localize(strings.no_active_document));
        return;
    }

    const file = File.saveDialog();
    if (!file) return;

    try {
        app.activeDocument.imageCapture(file);
    } catch (e) {
        alert(localize(strings.fl_error_writing, file));
        return;
    }

    // Ensure the filename ends with ".png"
    if (!file.name.toLowerCase().endsWith(".png")) {
        file.rename(`${file.name}.png`);
    }

    if (file.exists) {
        alert(localize(strings.file_saved, file.fsName));
    }
}

/**
 * Export active document dataset variables to a file.
 * https://ai-scripting.docsforadobe.dev/jsobjref/Document.html#document-exportvariables
 */
function exportVariables(): void {
    const doc = app.activeDocument;

    if (doc.variables.length === 0) {
        alert(localize(strings.no_document_variables));
        return;
    }

    const file = File.saveDialog();
    if (!file) return;

    try {
        doc.exportVariables(file);
    } catch (e) {
        alert(localize(strings.fl_error_writing, file));
        return;
    }

    if (file.exists) {
        alert(localize(strings.file_saved, file.fsName));
    }
}

/**
 * Load all artboards from the active document as objects into the data model.
 * @returns Artboard command ids.
 */
function loadActiveDocumentArtboards(): string[] {
    const artboardIds: string[] = [];

    const artboards = app.activeDocument.artboards;
    for (let i = 0; i < artboards.length; i++) {
        const artboard = artboards[i];
        const id = generateCommandId(`artboard_${i}`);
        const command: CommandEntry = {
            id,
            name: artboard.name,
            action: "artboard",
            type: "artboard",
            idx: (i + 1).toString(),
            docRequired: false,
            selRequired: false,
            hidden: false,
        };
        commandsData[id] = command;
        artboardIds.push(id);
    }

    return artboardIds;
}

/**
 * Present a goto palette with artboards from the active document.
 * The selected artboard is made active and brought into view.
 */
function goToArtboard(): void {
    const artboards: string[] = loadActiveDocumentArtboards();

    const columns: Record<string, { width: number; key: string; hideTitle?: boolean }> =
        {
            Index: {
                width: 35,
                key: "idx",
                hideTitle: true,
            },
            [localize(strings.name_title_case)]: {
                width: 100,
                key: "name",
            },
        };

    const result = commandPalette(
        artboards,
        localize(strings.go_to_artboard),
        columns,
        false
    );

    if (!result) return;

    const commandId: string = Array.isArray(result) ? result[0] : (result as string);

    const idx = Number(commandsData[commandId].idx) - 1;
    app.activeDocument.artboards.setActiveArtboardIndex(idx);
    app.executeMenuCommand("fitin");
}

/**
 * Load all page items from the active document as objects into the data model.
 * @returns Object command IDs.
 */
function loadActiveDocumentPageItems(): string[] {
    const pageItems: string[] = [];

    for (let i = 0; i < app.activeDocument.pageItems.length; i++) {
        const cur = app.activeDocument.pageItems[i];

        if (!cur.name || cur.name.length === 0) continue;

        const id = generateCommandId(`pageItem_${i}`);
        const obj: CommandEntry = {
            id,
            name: cur.name,
            action: "pageItem",
            type: cur.typename,
            pageItem: cur,
            layer: cur.layer.name,
            docRequired: false,
            selRequired: false,
            hidden: false,
        };

        pageItems.push(id);
        commandsData[id] = obj;
    }

    return pageItems;
}

/**
 * Present a goto palette with named objects from the active document.
 * The selected object is selected within the UI and brought into view.
 */
function goToNamedObject(): void {
    const doc = app.activeDocument;

    if (doc.pageItems.length > namedObjectLimit) {
        alert(localize(strings.go_to_named_object_limit, doc.pageItems.length));
    }

    const pageItems = loadActiveDocumentPageItems();
    if (pageItems.length === 0) {
        alert(localize(strings.go_to_named_object_no_objects));
        return;
    }

    const columns: Record<string, { width: number; key: string }> = {
        [localize(strings.name_title_case)]: {
            width: 100,
            key: "name",
        },
        [localize(strings.type_title_case)]: {
            width: 100,
            key: "type",
        },
        [localize(strings.layer_title_case)]: {
            width: 100,
            key: "layer",
        },
    };

    const result = commandPalette(
        pageItems,
        localize(strings.go_to_named_object),
        columns,
        false
    );

    if (!result) return;

    const commandId: string = Array.isArray(result) ? result[0] : (result as string);

    const pageItem = (commandsData[commandId] as CommandEntry).pageItem;

    doc.selection = null;
    pageItem.selected = true;

    // reset zoom for current document
    doc.views[0].zoom = 1;

    zoomIntoPageItem(pageItem);
}

/**
 * Load all open documents into the data model.
 * @returns Document command IDs.
 */
function loadOpenDocuments(): string[] {
    const openDocuments: string[] = [];

    for (let i = 0; i < app.documents.length; i++) {
        const cur = app.documents[i];
        const id = generateCommandId(`document_${cur.name.toLowerCase()}`);
        const obj: CommandEntry = {
            id,
            name: cur.name,
            action: "document",
            type: "document",
            document: cur,
            rulerUnits: cur.rulerUnits.toString().split(".").pop() ?? "",
            colorSpace: cur.documentColorSpace.toString().split(".").pop() ?? "",
            path: cur.path.toString(),
            docRequired: false,
            selRequired: false,
            hidden: false,
        };
        openDocuments.push(id);
        commandsData[id] = obj;
    }

    return openDocuments;
}

/**
 * Present a goto palette with currently open documents.
 * The selected document is activated.
 */
function goToOpenDocument(): void {
    const openDocuments = loadOpenDocuments();

    const columns: Record<string, { width: number; key: string }> = {
        [localize(strings.name_title_case)]: {
            width: 100,
            key: "name",
        },
        [localize(strings.color_space_title_case)]: {
            width: 100,
            key: "colorSpace",
        },
        [localize(strings.ruler_units_title_case)]: {
            width: 100,
            key: "rulerUnits",
        },
        [localize(strings.path_title_case)]: {
            width: 100,
            key: "path",
        },
    };

    const result = commandPalette(
        openDocuments,
        localize(strings.go_to_open_document),
        columns,
        false
    );

    if (!result) return;

    const commandId: string = Array.isArray(result) ? result[0] : (result as string);

    const entry = commandsData[commandId] as CommandEntry & { document: Document };
    entry.document.activate();
}

/**
 * Load file bookmarks from the user's system into the command palette.
 */
function loadFileBookmark(): void {
    const acceptedTypes = [
        ".ai",
        ".ait",
        ".pdf",
        ".dxf",
        ".avif",
        ".BMP",
        ".RLE",
        ".DIB",
        ".cgm",
        ".cdr",
        ".eps",
        ".epsf",
        ".ps",
        ".emf",
        ".gif",
        ".heic",
        ".heif",
        ".jpg",
        ".jpe",
        ".jpeg",
        ".jpf",
        ".jpx",
        ".jp2",
        ".j2k",
        ".j2c",
        ".jpc",
        ".rtf",
        ".doc",
        ".docx",
        ".PCX",
        ".psd",
        ".psb",
        ".pdd",
        ".PXR",
        ".png",
        ".pns",
        ".svg",
        ".svgz",
        ".TGA",
        ".VDA",
        ".ICB",
        ".VST",
        ".txt",
        ".tif",
        ".tiff",
        ".webp",
        ".wmf",
    ]; // file types taken from Ai open dialog

    const re = new RegExp(`${acceptedTypes.join("|")}$`, "i");
    const files: File[] = loadFileTypes(
        localize(strings.bm_load_bookmark),
        true,
        re.toString()
    );

    if (files.length === 0) return;

    const currentFileBookmarkPaths = prefs.bookmarks
        .filter((b) => b.type === "file")
        .map((b) => b.path);

    const newBookmarks: CommandEntry[] = [];
    const newBookmarkIds: string[] = [];

    for (const f of files) {
        if (currentFileBookmarkPaths.includes(f.fsName)) continue;

        const bookmarkName = decodeURI(f.name);
        const id = generateCommandId(`bookmark_${bookmarkName.toLowerCase()}`);
        const bookmark: CommandEntry = {
            id,
            name: bookmarkName,
            action: "bookmark",
            type: "file",
            path: f.fsName,
            docRequired: false,
            selRequired: false,
            hidden: false,
        };
        newBookmarks.push(bookmark);
        newBookmarkIds.push(id);
    }

    if (newBookmarks.length === 0) return;

    prefs.bookmarks = [...prefs.bookmarks, ...newBookmarks];
    addToStartup(newBookmarkIds);
}

/**
 * Load folder bookmarks from the user's system into the command palette.
 */
function loadFolderBookmark(): void {
    const folder: Folder | null = Folder.selectDialog(
        localize(strings.bm_load_bookmark)
    );
    if (!folder) return;

    const currentFolderBookmarks: string[] = prefs.bookmarks
        .filter((b) => b.type === "folder")
        .map((b) => b.path);

    if (currentFolderBookmarks.includes(folder.fsName)) {
        alert(localize(strings.bm_already_loaded));
        return;
    }

    const bookmarkName = decodeURI(folder.name);
    const bookmark: CommandEntry = {
        id: `bookmark_${bookmarkName.toLowerCase().replace(/ /g, "_")}`,
        name: bookmarkName,
        action: "bookmark",
        type: "folder",
        path: folder.fsName,
        docRequired: false,
        selRequired: false,
        hidden: false,
    };

    prefs.bookmarks.push(bookmark);
    addToStartup([bookmark.id]);
}

/**
 * Watch a folder, and load all found scripts into the command palette.
 */
function watchScriptFolder(): void {
    // pick a folder
    var folder = Folder.selectDialog(localize(strings.watched_folder_select));
    if (!folder) return;

    // check prefs to see if folder is already watched
    if (prefs.watchedFolders.includes(folder.fsName)) {
        logger.log(`watched folder already in prefs: ${folder.fsName}`);
        alert(localize(strings.folder_already_watched, decodeURI(folder.name)));
        return;
    }

    prefs.watchedFolders.push(folder.fsName);
}

/**
 * Load ExtendScript (.jsx and .js) scripts into the command palette.
 */
function loadScripts(): void {
    const acceptedTypes = [".jsx", ".js"];
    const re = new RegExp(`${acceptedTypes.join("|")}$`, "i");
    const files: File[] = loadFileTypes(
        localize(strings.sc_load_script),
        true,
        re.toString()
    );

    if (files.length === 0) return;

    const currentScripts: string[] = prefs.scripts.map((s) => s.path);

    const scripts: CommandEntry[] = [];
    const newScriptIDs: string[] = [];

    for (const f of files) {
        if (currentScripts.includes(f.fsName)) continue;

        const scriptParent = decodeURI(f.parent.name);
        const scriptName = decodeURI(f.name);
        const id = generateCommandId(`script_${scriptName.toLowerCase()}`);
        const script: CommandEntry = {
            id,
            name: `${scriptParent} > ${scriptName}`,
            action: "script",
            type: "script",
            path: f.fsName,
            docRequired: false,
            selRequired: false,
            hidden: false,
        };

        scripts.push(script);
        newScriptIDs.push(id);
    }

    if (scripts.length === 0) return;

    prefs.scripts = prefs.scripts.concat(scripts);
    addToStartup(newScriptIDs);
}

/**
 * Present a palette with the most recent user commands.
 * The selected is executed.
 */
function recentUserCommands(): void {
    const result = commandPalette(
        mostRecentCommands,
        localize(strings.recent_commands),
        paletteSettings.columnSets.standard,
        false
    );

    if (!result) return;

    const commandId: string = Array.isArray(result) ? result[0] : (result as string);

    processCommand(commandId);
}

/**
 * Load recently opened files as objects into the data model.
 * @returns File command ids.
 */
function loadRecentFiles(): string[] {
    const recentFiles: string[] = [];
    const fileCount = app.preferences.getIntegerPreference("RecentFileNumber");

    for (let i = 0; i < fileCount; i++) {
        const path = app.preferences.getStringPreference(
            `plugin/MixedFileList/file${i}/path`
        );
        const cur = new File(path);

        if (!cur.exists) continue;

        const id = generateCommandId(`recentFile_${i}`);
        const obj: CommandEntry = {
            id,
            name: decodeURI(cur.name),
            action: "document",
            type: "document",
            document: cur,
            path: cur.fsName,
            docRequired: false,
            selRequired: false,
            hidden: false,
        };

        recentFiles.push(id);
        commandsData[id] = obj;
    }

    return recentFiles;
}

/**
 * Present a palette with recently opened files.
 * The selected file is opened.
 */
function recentFiles(): void {
    const arr = loadRecentFiles();
    const columns = {
        [localize(strings.name_title_case)]: {
            width: 100,
            key: "name",
        },
        [localize(strings.path_title_case)]: {
            width: 100,
            key: "path",
        },
    };

    const result = commandPalette(
        arr,
        localize(strings.open_recent_file),
        columns,
        false
    );
    if (!result) return;

    const commandId: string = Array.isArray(result) ? result[0] : (result as string);

    try {
        app.open(commandsData[commandId].document);
    } catch (e) {
        alert(localize(strings.fl_error_loading, result));
    }
}

/**
 * Redraw all application windows.
 */
function redrawWindows(): void {
    app.redraw();
}

/**
 * Reveal the active document on the user's system by opening its parent folder.
 */
function revealActiveDocument(): void {
    if (app.documents.length === 0) {
        alert(localize(strings.no_active_document));
        return;
    }

    const path = app.activeDocument.path?.fsName;
    if (path) {
        const folder = new Folder(path);
        folder.execute();
    } else {
        alert(localize(strings.active_document_not_saved));
    }
}
