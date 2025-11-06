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

    public update(matches: string[]): void {
        const newListbox = this.make(matches, this.listbox.bounds);
        this.container.remove(this.listbox);
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
