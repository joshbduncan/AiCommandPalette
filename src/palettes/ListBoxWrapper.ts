interface ColumnDefinition {
    width: number;
    key: string;
    hideTitle?: boolean;
}

interface ListItemWithId extends ListItem {
    id: string;
}

interface ListBoxWithFrame extends ListBox {
    frameStart: number;
}

// LISTBOXWRAPPER LISTENERS

/**
 * Close the window when an item in the listbox is double-clicked.
 *
 * This is the standard behavior for command selection in the main palette.
 * When a user double-clicks a command in the listbox, the window closes with
 * a return value of 1, signaling that a selection was made.
 *
 * @param listbox - The ScriptUI ListBox to attach the double-click handler to.
 */
function selectOnDoubleClick(listbox: ListBox): void {
    listbox.onDoubleClick = () => {
        listbox.window?.close(1);
    };
}

/**
 * Add listbox command to Workflow builder steps when double-clicking.
 *
 * This listener is used in the Workflow Builder to allow users to quickly add
 * commands to their workflow by double-clicking them. The selected command is
 * added to the "steps" listbox, and special handling is provided for the
 * "buildPicker" command which requires user input to create a custom picker.
 *
 * @param listbox - The ScriptUI ListBox to attach the double-click handler to.
 */
function addToStepsOnDoubleClick(listbox: ListBox): void {
    listbox.onDoubleClick = function () {
        const win = listbox.window as Window;
        // @ts-ignore
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
            newItem.id = selection.id;
        }

        steps.notify("onChange");
    };
}

/**
 * Swap two listbox items in place (along with their corresponding IDs).
 *
 * This function exchanges all properties between two ListBox items, including
 * their main text, subitem text, and custom ID property. Used in the Workflow
 * Builder to reorder workflow steps.
 *
 * @param x - First listbox item to swap.
 * @param y - Second listbox item to swap.
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

interface ListboxNavigationCallbacks {
    /**
     * Called when the user navigates with arrow keys.
     * Used to disable history scrolling in commandPalette.
     */
    onNavigate?: () => void;
    /**
     * Called before handling Up arrow key navigation.
     * Return true to prevent default listbox scrolling behavior.
     * Used for history scrolling in commandPalette.
     */
    shouldBlockUpNavigation?: () => boolean;
}

/**
 * Add arrow key navigation support to an EditText field for controlling a ListBoxWrapper.
 * Allows users to navigate the listbox using arrow keys from the EditText input field.
 *
 * Features:
 * - Up/Down arrows: Navigate through listbox items with frame scrolling
 * - Shift+Up/Down: Simple navigation without frame adjustments
 * - End-to-end wrapping: Jump from top to bottom or vice versa
 * - Smart frame positioning: Keeps selected item visible in the listbox viewport
 *
 * @param q - The EditText field to attach navigation to
 * @param list - The ListBoxWrapper instance to control
 * @param callbacks - Optional callbacks for custom behavior (e.g., history scrolling)
 */
function addListboxArrowKeyNavigation(
    q: EditText,
    list: ListBoxWrapper,
    callbacks?: ListboxNavigationCallbacks
): void {
    q.addEventListener("keydown", (e: KeyboardEvent) => {
        const listbox = list.listbox as ListBoxWithFrame;
        const listboxSelection = listbox.selection as ListItemWithId;

        if (e.keyName === "Up" || e.keyName === "Down") {
            e.preventDefault();

            if (typeof listboxSelection === "number" || Array.isArray(listboxSelection))
                return;

            if (!listboxSelection) {
                listbox.selection = 0;
                return;
            }

            // Check if Up navigation should be blocked (e.g., for history scrolling)
            if (
                e.keyName === "Up" &&
                callbacks?.shouldBlockUpNavigation &&
                callbacks.shouldBlockUpNavigation()
            ) {
                return;
            }

            // Notify callback that navigation occurred
            if (callbacks?.onNavigate) {
                callbacks.onNavigate();
            }

            if (e.getModifierState("Shift")) {
                // Simple navigation without frame adjustments
                if (e.keyName === "Up") {
                    if (listboxSelection.index === 0) {
                        listbox.selection = listbox.items.length - 1;
                    } else {
                        listbox.selection = listboxSelection.index - 1;
                    }
                } else if (e.keyName === "Down") {
                    if (listboxSelection.index === listbox.items.length - 1) {
                        listbox.selection = 0;
                    } else {
                        listbox.selection = listboxSelection.index + 1;
                    }
                }
            } else {
                // Full navigation with frame scrolling
                if (e.keyName === "Up") {
                    if (listboxSelection.index == 0) {
                        // jump to the bottom it at top
                        listbox.selection = listbox.items.length - 1;
                        listbox.frameStart = listbox.items.length - 1 - visibleListItems;
                    } else if (listboxSelection.index > 0) {
                        listbox.selection = listboxSelection.index - 1;
                        if (listboxSelection.index < listbox.frameStart)
                            listbox.frameStart--;
                    }
                } else if (e.keyName === "Down") {
                    if (listboxSelection.index === listbox.items.length - 1) {
                        // jump to the top if at the bottom
                        listbox.selection = 0;
                        listbox.frameStart = 0;
                    } else {
                        if (listboxSelection.index < listbox.items.length) {
                            listbox.selection = listboxSelection.index + 1;
                            if (
                                listboxSelection.index >
                                listbox.frameStart + visibleListItems - 1
                            ) {
                                if (
                                    listbox.frameStart <
                                    listbox.items.length - visibleListItems
                                ) {
                                    listbox.frameStart++;
                                } else {
                                    listbox.frameStart = listbox.frameStart;
                                }
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
                const updatedListboxSelection = listbox.selection as ListItemWithId;
                if (
                    updatedListboxSelection.index < listbox.frameStart ||
                    updatedListboxSelection.index >
                        listbox.frameStart + visibleListItems - 1
                )
                    listbox.frameStart =
                        updatedListboxSelection.index - Math.floor(visibleListItems / 2);
                // don't move the frame if list items don't fill the available rows
                if (listbox.items.length <= visibleListItems) return;
                // move the frame by revealing the calculated `listbox.frameStart`
                // @ts-ignore
                listbox.revealItem(listbox.frameStart);
            }
        }
    });
}

/**
 * A custom wrapper for a ScriptUI ListBox that supports multiple columns,
 * optional tooltips, multiselect, and command loading.
 */
class ListBoxWrapper {
    public listbox: ListBox;

    private container: Window | Panel;
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
        container: Window | Panel,
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
        this.listbox = this.make(commands, this.bounds);
    }

    /**
     * Create and configure a new ScriptUI ListBox with columns and commands.
     *
     * This private method handles the actual creation of the ListBox ScriptUI element,
     * configuring columns, loading commands, setting up event listeners, and enabling
     * end-to-end scrolling (jumping from top to bottom and vice versa with arrow keys).
     *
     * @param commands - Array of command IDs to populate the listbox.
     * @param bounds - The bounds of the listbox [left, top, right, bottom].
     * @returns The configured ListBox ScriptUI element.
     */
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
        }) as ListBoxWithFrame;

        listbox.frameStart = 0;
        if (this.helptip) listbox.helpTip = this.helptip;

        if (commands.length > 0) {
            this.loadCommands(listbox, commands, columnKeys);
            listbox.selection = 0;
        }

        // Allow end-to-end scrolling from within a listbox.
        listbox.addEventListener("keydown", (e: KeyboardEvent) => {
            if (
                typeof listbox.selection === "number" ||
                Array.isArray(listbox.selection)
            )
                return;

            if (!listbox.selection) {
                listbox.selection = 0;
                return;
            }

            const listboxSelection = listbox.selection as ListItemWithId;
            if (e.keyName === "Up" && listboxSelection.index === 0) {
                listbox.selection = listbox.items.length - 1;
                e.preventDefault();
            } else if (
                e.keyName === "Down" &&
                listboxSelection.index === listbox.items.length - 1
            ) {
                listbox.selection = 0;
                e.preventDefault();
            }
        });

        this.addListeners(listbox);
        return listbox;
    }

    /**
     * Update the listbox with a new set of commands.
     *
     * This method replaces the current listbox with a new one containing the specified
     * commands. Used when filtering/searching to update the displayed results. The old
     * listbox is removed and a new one is created with the same configuration but
     * different content.
     *
     * @param matches - Array of command IDs to display in the updated listbox.
     */
    public update(matches: string[]): void {
        const newListbox = this.make(matches, this.listbox.bounds);
        this.container.remove(this.listbox);
        this.listbox = newListbox;
    }

    /**
     * Load commands into the listbox by creating ListItem elements.
     *
     * For each command ID, this method creates a ListItem and populates it with
     * data from the command object. The first column shows the main text (usually
     * the command name), and subsequent columns are populated from the command
     * properties specified in columnKeys.
     *
     * @param listbox - The ListBox to populate with items.
     * @param commands - Array of command IDs to load.
     * @param columnKeys - Array of property keys to display in each column.
     */
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

    /**
     * Attach all custom event listeners to the listbox.
     *
     * This method iterates through the listeners array provided during construction
     * and attaches each listener function to the listbox. Common listeners include
     * double-click handlers and custom navigation behaviors.
     *
     * @param listbox - The ListBox to attach listeners to.
     */
    private addListeners(listbox: ListBox): void {
        for (const listener of this.listeners) {
            listener(listbox);
        }
    }
}
