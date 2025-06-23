// set flags for query arrow navigation fix
let fromQuery = false;
let fromQueryShiftKey = false;

interface ColumnDefinition {
    width: number;
    key: string;
    hideTitle?: boolean;
}

interface ListItemWithId extends ListItem {
    id: string;
}

/**
 * A custom wrapper for a ScriptUI ListBox that supports multiple columns,
 * optional tooltips, multiselect, and command loading.
 */
class ListBoxWrapper {
    public listbox: ListBox;

    private container: _Control;
    private name: string;
    private bounds: number[];
    private columns: Record<string, ColumnDefinition>;
    private multiselect: boolean;
    private helptip?: string;
    private listeners: ((listbox: ListBox) => void)[];

    /**
     * Create a new ListBoxWrapper instance.
     *
     * @param commands - The command IDs to populate the listbox.
     * @param container - The ScriptUI container to which the listbox will be added.
     * @param name - A name for the listbox instance.
     * @param bounds - The bounds of the listbox (left, top, right, bottom).
     * @param columns - Column definitions including width and key.
     * @param multiselect - Whether multiple items can be selected.
     * @param helptip - Optional help tooltip for the listbox.
     * @param listeners - Optional array of event listeners to attach to the listbox.
     */
    constructor(
        commands: string[],
        container: any,
        name: string,
        bounds: number[],
        columns: Record<string, ColumnDefinition>,
        multiselect: boolean,
        helptip: string | undefined,
        listeners: ((listbox: ListBox) => void)[]
    ) {
        this.container = container;
        this.name = name;
        this.bounds = bounds;
        this.columns = columns;
        this.multiselect = multiselect;
        this.helptip = helptip;
        this.listeners = listeners;
        this.listbox = this.make(commands, bounds);
    }

    private make(commands: string[], bounds: number[]): ListBox {
        const columnTitles: string[] = [];
        const columnWidths: number[] = [];
        const columnKeys: string[] = [];

        for (const title in this.columns) {
            const col = this.columns[title];
            columnTitles.push(col.hideTitle ? "" : title);
            columnWidths.push(col.width);
            columnKeys.push(col.key);
        }

        const listbox = this.container.add("listbox", bounds, undefined, {
            name: this.name,
            numberOfColumns: columnTitles.length,
            showHeaders: true,
            columnTitles,
            columnWidths,
            multiselect: this.multiselect,
        }) as ListBox;

        listbox.frameStart = 0;
        if (this.helptip) listbox.helpTip = this.helptip;

        if (commands.length > 0) {
            this.loadCommands(listbox, commands, columnKeys);
            listbox.selection = 0;
        }

        this.addListeners(listbox);
        return listbox;
    }

    public update(matches: string[]): void {
        const newListbox = this.make(matches, this.listbox.bounds);
        this.listbox.window.remove(this.listbox);
        this.listbox = newListbox;
    }

    private loadCommands(
        listbox: ListBox,
        commands: string[],
        columnKeys: string[]
    ): void {
        for (const id of commands) {
            let item: ListItemWithId;

            if (!commandsData.hasOwnProperty(id)) {
                item = listbox.add("item", id) as ListItemWithId;
            } else {
                const command = commandsData[id];
                const name = determineCorrectString(command, "name");
                const mainText = determineCorrectString(command, columnKeys[0]) || name;

                item = listbox.add("item", mainText) as ListItemWithId;

                for (let j = 1; j < columnKeys.length; j++) {
                    const str = determineCorrectString(command, columnKeys[j]);
                    item.subItems[j - 1].text = str || "<missing>";
                }
            }

            item.id = id;
        }
    }

    private addListeners(listbox: ListBox): void {
        for (const listener of this.listeners) {
            listener(listbox);
        }
    }
}

// LISTBOXWRAPPER LISTENERS

/**
 * Close the window when an item in the listbox is double-clicked.
 * @param listbox ScriptUI ListBox
 */
function selectOnDoubleClick(listbox: ListBox): void {
    listbox.onDoubleClick = () => {
        listbox.window?.close(1);
    };
}

/**
 * Add listbox command to Workflow when double-clicking.
 * @param listbox ScriptUI ListBox
 */
function addToStepsOnDoubleClick(listbox: ListBox): void {
    listbox.onDoubleClick = function () {
        const win = listbox.window as Window;
        const steps = win.findElement("steps") as ListBox;
        const selection = listbox.selection as ListItemWithId;
        const command = commandsData[selection.id];

        let newItem: ListItemWithId;

        if (command.id === "builtin_buildPicker") {
            const newPicker = buildPicker();
            newItem = steps.add("item", newPicker.name) as ListItemWithId;
            newItem.subItems[0].text = newPicker.type;
            newItem.id = newPicker.id;
        } else {
            newItem = steps.add(
                "item",
                determineCorrectString(command, "name")
            ) as ListItemWithId;
            newItem.subItems[0].text = determineCorrectString(command, "type");
            newItem.id = command.id;
        }

        steps.notify("onChange");
    };
}

/**
 * Swap listbox items in place (along with their corresponding id).
 * @param x Listbox item to swap.
 * @param y Listbox item to swap.
 */
function swapListboxItems(x: ListItemWithId, y: ListItemWithId): void {
    const tempText = x.text;
    const tempSubText = x.subItems[0].text;
    const tempId = x.id;

    x.text = y.text;
    x.subItems[0].text = y.subItems[0].text;
    x.id = y.id;

    y.text = tempText;
    y.subItems[0].text = tempSubText;
    y.id = tempId;
}

/**
 * Allow end-to-end scrolling from within a listbox.
 * @param listbox ScriptUI listbox.
 */
function scrollListBoxWithArrows(listbox: ListBox): void {
    listbox.addEventListener("keydown", (e: KeyboardEvent) => {
        if (fromQuery) {
            if (fromQueryShiftKey) {
                if (e.keyName === "Up") {
                    if (listbox.selection.index === 0) {
                        listbox.selection = listbox.items.length - 1;
                        e.preventDefault();
                    } else {
                        listbox.selection--;
                    }
                } else if (e.keyName === "Down") {
                    if (listbox.selection.index === listbox.items.length - 1) {
                        listbox.selection = 0;
                        e.preventDefault();
                    } else {
                        listbox.selection++;
                    }
                }
            } else {
                if (e.keyName === "Up" || e.keyName === "Down") {
                    if (e.keyName === "Up") {
                        e.preventDefault();
                        if (!listbox.selection) {
                            listbox.selection = 0;
                        } else if (listbox.selection.index === 0) {
                            listbox.selection = listbox.items.length - 1;
                            listbox.frameStart =
                                listbox.items.length - 1 - visibleListItems;
                        } else {
                            listbox.selection = listbox.selection.index - 1;
                            if (listbox.selection.index < listbox.frameStart) {
                                listbox.frameStart--;
                            }
                        }
                    } else if (e.keyName === "Down") {
                        e.preventDefault();
                        if (!listbox.selection) {
                            listbox.selection = 0;
                        } else if (
                            listbox.selection.index ===
                            listbox.items.length - 1
                        ) {
                            listbox.selection = 0;
                            listbox.frameStart = 0;
                        } else {
                            listbox.selection = listbox.selection.index + 1;
                            if (
                                listbox.selection.index >
                                listbox.frameStart + visibleListItems - 1
                            ) {
                                if (
                                    listbox.frameStart <
                                    listbox.items.length - visibleListItems
                                ) {
                                    listbox.frameStart++;
                                }
                            }
                        }
                    }

                    /*
        If a selection is made inside of the actual listbox frame by the user,
        the API doesn't offer any way to know which part of the list is currently
        visible in the listbox "frame". If the user was to re-enter the `q` edittext
        and then hit an arrow key the above event listener will not work correctly so
        I just move the next selection (be it up or down) to the middle of the "frame".
        */
                    if (
                        listbox.selection &&
                        (listbox.selection.index < listbox.frameStart ||
                            listbox.selection.index >
                                listbox.frameStart + visibleListItems - 1)
                    ) {
                        listbox.frameStart =
                            listbox.selection.index - Math.floor(visibleListItems / 2);
                    }

                    if (listbox.items.length > visibleListItems) {
                        listbox.revealItem(listbox.frameStart);
                    }
                }
            }

            fromQuery = false;
            fromQueryShiftKey = false;
        } else {
            if (e.keyName === "Up" && listbox.selection.index === 0) {
                listbox.selection = listbox.items.length - 1;
                e.preventDefault();
            } else if (
                e.keyName === "Down" &&
                listbox.selection.index === listbox.items.length - 1
            ) {
                listbox.selection = 0;
                e.preventDefault();
            }
        }
    });
}

// USER DIALOGS

type CommandId = string;
type CommandPaletteResult = CommandId[] | CommandId | false;

/**
 * Display a modal command palette dialog and return user selection.
 *
 * @param commands - List of available command IDs.
 * @param title - Window title.
 * @param columns - Column configuration for listbox.
 * @param multiselect - Whether multiple commands can be selected.
 * @param showOnly - Optional subset of commands to display.
 * @param saveHistory - Whether to store query and command in user history.
 * @returns The selected command ID(s), or false if cancelled.
 */
function commandPalette(
    commands: CommandId[],
    title: string,
    columns: Record<string, ColumnDefinition>,
    multiselect: boolean,
    showOnly?: CommandId[],
    saveHistory?: boolean
): CommandPaletteResult {
    const qCache: Record<string, CommandId[]> = {};

    const win = new Window("dialog");
    win.text = title;
    win.alignChildren = "fill";

    const q = win.add("edittext") as EditText;
    q.helpTip = localize(strings.cd_q_helptip);
    q.active = true;

    let matches = showOnly ?? commands;

    const list = new ListBoxWrapper(
        matches,
        win,
        "commands",
        paletteSettings.bounds,
        columns,
        multiselect,
        undefined,
        [selectOnDoubleClick, scrollListBoxWithArrows]
    );

    const winButtons = win.add("group");
    winButtons.orientation = "row";
    winButtons.alignChildren = ["center", "center"];

    const ok = winButtons.add("button", undefined, "OK") as Button;
    ok.preferredSize.width = 100;

    const cancel = winButtons.add("button", undefined, localize(strings.cancel), {
        name: "cancel",
    }) as Button;
    cancel.preferredSize.width = 100;

    if (windowsFlickerFix) {
        simulateKeypress("TAB", 1);
    }

    q.onChanging = () => {
        if (q.text === "") {
            matches = showOnly ?? commands;
        } else if (qCache.hasOwnProperty(q.text)) {
            matches = qCache[q.text];
        } else {
            matches = matcher(q.text, commands);
            qCache[q.text] = matches;
        }
        list.update(matches);
    };

    const updateHistory = (): void => {
        if (q.text === "") return;
        const selected = list.listbox.selection as ListItemWithId;
        if (!selected || selected.id === "builtin_recentCommands") return;

        history.push({
            query: q.text,
            command: selected.id,
            timestamp: Date.now(),
        });
        userHistory.save();
    };

    if (!multiselect) {
        const kbEvent = ScriptUI.events.createEvent("KeyboardEvent");
        q.addEventListener("keydown", (e: any) => {
            if (e.keyName === "Escape") {
                e.preventDefault();
                win.close();
            }
            if (e.keyName === "Up" || e.keyName === "Down") {
                kbEvent.initKeyboardEvent(
                    "keydown",
                    true,
                    true,
                    list.listbox,
                    e.keyName,
                    0,
                    ""
                );
                fromQuery = true;
                fromQueryShiftKey = e.getModifierState("shift");
                list.listbox.dispatchEvent(kbEvent);
                e.preventDefault();
            }
        });
    }

    if (win.show() === 1) {
        if (!list.listbox.selection) return false;

        if (multiselect) {
            const items: CommandId[] = [];
            const selections = list.listbox.selection as ListItemWithId[];
            for (let i = 0; i < selections.length; i++) {
                items.push(selections[i].id);
            }
            logger.log("user selected commands:", items.join(", "));
            return items;
        } else {
            const selected = list.listbox.selection as ListItemWithId;
            logger.log("user selected command:", selected);
            if (saveHistory) updateHistory();
            return selected.hasOwnProperty("id") ? selected.id : selected.name;
        }
    }

    return false;
}
