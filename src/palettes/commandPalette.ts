type CommandId = string;
type CommandPaletteResult = CommandId[] | CommandId | false;

/**
 * Display a modal command palette dialog and return user selection.
 *
 * @param commands - List of available command IDs. Defaults to user startup commands.
 * @param title - Window title. Defaults to `_title_.
 * @param columns - Column configuration for listbox. Defaults to `paletteSettings.columnSets.standard`
 * @param multiselect - Whether multiple commands can be selected. Defaults to false.
 * @param showOnly - Optional subset of commands to display. Defaults to null.
 * @param saveHistory - Whether to store query and command in user history. Defaults to true.
 * @param scrollHistory - Should command history be accessible via the up arrow. Defaults to false.
 * @returns The selected command ID(s), or false if cancelled.
 */
function commandPalette(
    commands: CommandId[] = startupCommands,
    title: string = _title,
    columns: Record<string, ColumnDefinition> = paletteSettings.columnSets.standard,
    multiselect: boolean = false,
    showOnly: CommandId[] = null,
    saveHistory: boolean = true,
    scrollHistory: boolean = false
): CommandPaletteResult {
    const qCache: Record<string, CommandId[]> = {};
    let historyScrolling = true;
    let historyIndex = 0;

    const win = new Window("dialog");
    win.text = title;
    win.alignChildren = "fill";

    const q = win.add("edittext") as EditText;
    q.helpTip = localize(strings.cd_q_helptip);

    let matches = showOnly ?? commands;

    const list = new ListBoxWrapper(
        matches,
        win,
        "commands",
        paletteSettings.bounds,
        columns,
        multiselect,
        undefined,
        [selectOnDoubleClick]
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
    } else {
        q.active = true;
    }

    // catch escape key and close window to stop default startup command reloadZ on escape
    win.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.keyName === "Escape") {
            e.preventDefault();
            win.close();
        }
    });

    q.onChanging = () => {
        historyScrolling = false;
        historyIndex = 0;
        if (q.text === "") {
            matches = showOnly ?? commands;
            historyScrolling = true;
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

    // allow scrolling through query history
    if (scrollHistory) {
        q.addEventListener("keydown", (e: KeyboardEvent) => {
            if (e.keyName === "Up" && historyScrolling) {
                e.preventDefault();
                if (recentQueries && recentQueries.length > 0) {
                    const historyEntry = recentQueries[historyIndex];
                    logger.log(
                        `scrolling query history, current index = ${historyIndex}, ${historyEntry}`
                    );
                    q.text = historyEntry;
                    historyIndex = Math.min(historyIndex + 1, recentQueries.length - 1);
                    if (qCache.hasOwnProperty(q.text)) {
                        matches = qCache[q.text];
                    } else {
                        matches = matcher(q.text, commands);
                        qCache[q.text] = matches;
                    }
                    list.update(matches);
                }
            }
        });
    }

    // allow scrolling of the listbox from within the query input
    if (!multiselect) {
        q.addEventListener("keydown", (e: KeyboardEvent) => {
            const listbox = list.listbox as ListBoxWithFrame;
            const listboxSelection = listbox.selection as ListItemWithId;

            if (e.keyName === "Up" || e.keyName === "Down") {
                e.preventDefault();

                if (
                    typeof listboxSelection === "number" ||
                    Array.isArray(listboxSelection)
                )
                    return;

                if (!listboxSelection) {
                    listbox.selection = 0;
                    return;
                }

                if (historyScrolling && e.keyName === "Up") {
                    return;
                }

                historyScrolling = false;
                historyIndex = 0;

                if (e.getModifierState("Shift")) {
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
                    if (e.keyName === "Up") {
                        if (listboxSelection.index == 0) {
                            // jump to the bottom it at top
                            listbox.selection = listbox.items.length - 1;
                            listbox.frameStart =
                                listbox.items.length - 1 - visibleListItems;
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
                            updatedListboxSelection.index -
                            Math.floor(visibleListItems / 2);
                    // don't move the frame if list items don't fill the available rows
                    if (listbox.items.length <= visibleListItems) return;
                    // move the frame by revealing the calculated `listbox.frameStart`
                    // @ts-ignore
                    listbox.revealItem(listbox.frameStart);
                }
            }
        });
    }

    if (win.show() === 1) {
        if (!list.listbox.selection) return false;

        const rawSelection = list.listbox.selection;
        if (!rawSelection || typeof rawSelection === "number") return false;

        const selectedListItems: ListItemWithId[] = Array.isArray(rawSelection)
            ? (rawSelection as unknown as ListItemWithId[])
            : [rawSelection as ListItemWithId];

        if (multiselect) {
            const selections = rawSelection as unknown as ListItemWithId[];
            const items: CommandId[] = selections.map((item) => item.id);
            logger.log("user selected commands:", items.join(", "));
            return items;
        } else {
            const selected = rawSelection as ListItemWithId;
            logger.log("user selected command:", selected);
            if (saveHistory) updateHistory();
            return selected.id;
        }
    }

    return false;
}
