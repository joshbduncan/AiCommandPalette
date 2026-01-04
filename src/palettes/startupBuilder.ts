/**
 * Launch the Startup Command Builder dialog for selecting and ordering startup commands.
 * @param commands List of available command IDs.
 * @returns An array of selected command IDs in the desired startup order, or `false` if cancelled.
 */
function startupBuilder(commands: string[]): string[] | false {
    let qCache: { [key: string]: string[] } = {};

    const win = new Window("dialog");
    win.text = localize(strings.startup_builder);
    win.alignChildren = "fill";

    // Search Panel
    const pSearch = win.add(
        "panel",
        undefined,
        localize(strings.cd_search_for)
    ) as Panel;
    pSearch.alignChildren = ["fill", "center"];
    pSearch.margins = 20;

    const q = pSearch.add("edittext") as EditText;
    q.helpTip = localize(strings.cd_q_helptip);

    let matches = commands;

    const list = new ListBoxWrapper(
        matches,
        pSearch,
        "commands",
        [0, 0, paletteSettings.paletteWidth, paletteSettings.paletteHeight],
        paletteSettings.columnSets.standard,
        false,
        localize(strings.startup_helptip),
        [addToStepsOnDoubleClick]
    );

    // Steps Panel
    const pSteps = win.add(
        "panel",
        undefined,
        localize(strings.startup_steps)
    ) as Panel;
    pSteps.alignChildren = ["fill", "center"];
    pSteps.margins = 20;

    const steps = new ListBoxWrapper(
        prefs.startupCommands,
        pSteps,
        "steps",
        [0, 0, paletteSettings.paletteWidth, paletteSettings.paletteHeight],
        paletteSettings.columnSets.standard,
        true,
        localize(strings.startup_steps_helptip),
        []
    );

    const stepButtons = pSteps.add("group") as Group;
    stepButtons.alignment = "center";

    const up = stepButtons.add(
        "button",
        undefined,
        localize(strings.step_up)
    ) as Button;
    up.preferredSize.width = 100;

    const down = stepButtons.add(
        "button",
        undefined,
        localize(strings.step_down)
    ) as Button;
    down.preferredSize.width = 100;

    const del = stepButtons.add(
        "button",
        undefined,
        localize(strings.step_delete)
    ) as Button;
    del.preferredSize.width = 100;

    // Window Buttons
    const winButtons = win.add("group") as Group;
    winButtons.orientation = "row";
    winButtons.alignChildren = ["center", "center"];

    const save = winButtons.add("button", undefined, localize(strings.save), {
        name: "ok",
    }) as Button;
    save.preferredSize.width = 100;
    save.enabled = true;

    const cancel = winButtons.add("button", undefined, localize(strings.cancel), {
        name: "cancel",
    }) as Button;
    cancel.preferredSize.width = 100;

    if (windowsFlickerFix) {
        simulateKeypress("TAB", 1);
    } else {
        q.active = true;
    }

    // catch escape key and close window to stop default startup command reload/flicker on escape
    win.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.keyName === "Escape") {
            e.preventDefault();
            win.close();
        }
    });

    q.onChanging = function () {
        if (q.text === "") {
            matches = commands;
        } else if (qCache.hasOwnProperty(q.text)) {
            matches = qCache[q.text];
        } else {
            matches = matcher(q.text, commands);
            qCache[q.text] = matches;
        }
        list.update(matches);
    };

    // allow scrolling of the listbox from within the query input
    addListboxArrowKeyNavigation(q, list);

    up.onClick = function () {
        const rawSelection = steps.listbox.selection;

        if (!rawSelection || typeof rawSelection === "number") return;

        const selectedListItems: ListItemWithId[] = Array.isArray(rawSelection)
            ? (rawSelection as unknown as ListItemWithId[])
            : [rawSelection as ListItemWithId];

        const selected = sortIndexes(selectedListItems);
        if (selected[0] === 0 || !contiguous(selected)) return;

        for (let i = 0; i < selected.length; i++) {
            swapListboxItems(
                steps.listbox.items[selected[i] - 1] as ListItemWithId,
                steps.listbox.items[selected[i]] as ListItemWithId
            );
        }
        steps.listbox.selection = null;
        for (let n = 0; n < selected.length; n++) {
            steps.listbox.selection = selected[n] - 1;
        }
    };

    down.onClick = function () {
        const rawSelection = steps.listbox.selection;

        if (!rawSelection || typeof rawSelection === "number") return;

        const selectedListItems: ListItemWithId[] = Array.isArray(rawSelection)
            ? (rawSelection as unknown as ListItemWithId[])
            : [rawSelection as ListItemWithId];

        const selected = sortIndexes(selectedListItems);
        if (
            selected[selected.length - 1] === steps.listbox.items.length - 1 ||
            !contiguous(selected)
        )
            return;

        for (let i = selected.length - 1; i >= 0; i--) {
            swapListboxItems(
                steps.listbox.items[selected[i]] as ListItemWithId,
                steps.listbox.items[selected[i] + 1] as ListItemWithId
            );
        }
        steps.listbox.selection = null;
        for (let n = 0; n < selected.length; n++) {
            steps.listbox.selection = selected[n] + 1;
        }
    };

    del.onClick = function () {
        const rawSelection = steps.listbox.selection;

        if (!rawSelection || typeof rawSelection === "number") return;

        const selectedListItems: ListItemWithId[] = Array.isArray(rawSelection)
            ? (rawSelection as unknown as ListItemWithId[])
            : [rawSelection as ListItemWithId];

        const selected = sortIndexes(selectedListItems);

        for (let i = selected.length - 1; i >= 0; i--) {
            const lbi = steps.listbox.items[selected[i]] as ListItemWithId;
            commands.push(lbi.id);
            steps.listbox.remove(selected[i]);
        }

        qCache = {};
        matches = matcher(q.text, commands);
        qCache[q.text] = matches;
        if (matches.length > 0) {
            list.update(matches);
        }

        steps.listbox.selection = null;
    };

    if (win.show() === 1) {
        const items: string[] = [];
        for (let i = 0; i < steps.listbox.items.length; i++) {
            const lbi = steps.listbox.items[i] as ListItemWithId;
            items.push(lbi.id);
        }
        return items;
    }

    return false;
}
