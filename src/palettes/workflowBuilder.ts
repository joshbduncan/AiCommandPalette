/**
 * Launch the Workflow Builder dialog to create or edit command workflows.
 * @param commands List of available command IDs.
 * @param editWorkflowId ID of the workflow to edit, or undefined to create a new one.
 * @returns Workflow data or false if cancelled.
 */
function workflowBuilder(
    commands: string[],
    editWorkflowId?: string
):
    | {
          name: string;
          actions: string[];
          overwrite: boolean;
      }
    | false {
    let qCache: { [query: string]: string[] } = {};
    let overwrite = false;
    const editableCommandTypes = ["picker"];

    const win = new Window("dialog");
    win.text = localize(strings.wf_builder);
    win.alignChildren = "fill";

    // Search panel
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
        localize(strings.cd_helptip),
        [addToStepsOnDoubleClick]
    );

    const pSteps = win.add("panel", undefined, localize(strings.wf_steps)) as Panel;
    pSteps.alignChildren = ["fill", "center"];
    pSteps.margins = 20;

    let actionSteps: string[] = [];
    if (editWorkflowId) {
        const editWorkflow = commandsData[editWorkflowId];
        for (let i = 0; i < editWorkflow.actions.length; i++) {
            let step = editWorkflow.actions[i];
            if (!commandsData.hasOwnProperty(step)) {
                step += " [NOT FOUND]";
            } else if (!commandVersionCheck(step)) {
                step += " [INCOMPATIBLE AI VERSION]";
            }
            actionSteps.push(step);
        }
    }

    const steps = new ListBoxWrapper(
        actionSteps,
        pSteps,
        "steps",
        [0, 0, paletteSettings.paletteWidth, paletteSettings.paletteHeight],
        paletteSettings.columnSets.standard,
        true,
        localize(strings.wf_steps_helptip),
        []
    );

    steps.listbox.onDoubleClick = function () {
        const selectedItem = steps.listbox.selection[0];
        const command = commandsData[selectedItem.id];
        if (!editableCommandTypes.includes(command.type.toLowerCase())) {
            alert(localize(strings.wf_step_not_editable));
            return;
        }
        const updatedPicker = buildPicker(command.id);
        if (updatedPicker.id !== command.id) selectedItem.id = updatedPicker.id;
        if (updatedPicker.name !== command.name) selectedItem.text = updatedPicker.name;
    };

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

    const edit = stepButtons.add(
        "button",
        undefined,
        localize(strings.step_edit)
    ) as Button;
    edit.preferredSize.width = 100;

    const del = stepButtons.add(
        "button",
        undefined,
        localize(strings.step_delete)
    ) as Button;
    del.preferredSize.width = 100;

    const pName = win.add("panel", undefined, localize(strings.wf_save_as)) as Panel;
    pName.alignChildren = ["fill", "center"];
    pName.margins = 20;
    const workflowNameText = editWorkflowId ? commandsData[editWorkflowId].name : "";
    const workflowName = pName.add("edittext", undefined, workflowNameText) as EditText;
    workflowName.enabled = Boolean(editWorkflowId);

    const winButtons = win.add("group") as Group;
    winButtons.orientation = "row";
    winButtons.alignChildren = ["center", "center"];
    const save = winButtons.add("button", undefined, localize(strings.save), {
        name: "ok",
    }) as Button;
    save.preferredSize.width = 100;
    save.enabled = Boolean(editWorkflowId);
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

    q.onChanging = () => {
        if (q.text === "") {
            matches = commands;
        } else if (qCache.hasOwnProperty(q.text)) {
            matches = qCache[q.text];
        } else {
            matches = matcher(q.text, commands);
            qCache[q.text] = matches;
        }
        // alert(matches.length.toString());
        list.update(matches);
    };

    // allow scrolling of the listbox from within the query input
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

    steps.listbox.onChange = function () {
        workflowName.enabled = steps.listbox.items.length > 0;
        save.enabled = workflowName.enabled && workflowName.text.length > 0;
    };

    workflowName.onChanging = function () {
        save.enabled = workflowName.text.length > 0;
    };

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

    edit.onClick = steps.listbox.onDoubleClick;

    del.onClick = function () {
        const rawSelection = steps.listbox.selection;

        if (!rawSelection || typeof rawSelection === "number") return;

        const selectedListItems: ListItemWithId[] = Array.isArray(rawSelection)
            ? (rawSelection as unknown as ListItemWithId[])
            : [rawSelection as ListItemWithId];

        const selected = sortIndexes(selectedListItems);

        for (let i = selected.length - 1; i >= 0; i--) {
            steps.listbox.remove(selected[i]);
        }

        steps.listbox.selection = null;
        workflowName.enabled = steps.listbox.items.length > 0;
        save.enabled = workflowName.enabled && workflowName.text.length > 0;
    };

    save.onClick = function () {
        const existingNames = prefs.workflows.map((wf) => wf.name);
        if (existingNames.includes(workflowName.text.trim())) {
            overwrite = true;
            const confirmed = confirm(
                `${localize(strings.wf_already_exists)}\n${workflowName.text.trim()}`,
                false,
                localize(strings.wf_already_exists_title)
            );
            if (!confirmed) return;
        }
        win.close(1);
    };

    if (win.show() === 1) {
        const actions: string[] = [];
        for (let i = 0; i < steps.listbox.items.length; i++) {
            const lbi = steps.listbox.items[i] as ListItemWithId;
            actions.push(lbi.id);
        }
        return {
            name: workflowName.text.trim(),
            actions,
            overwrite,
        };
    }

    return false;

    function sortIndexes(sel: ListItem[]): number[] {
        return sel.map((s) => s.index).sort((a, b) => a - b);
    }

    function contiguous(sel: number[]): boolean {
        return sel.length === sel[sel.length - 1] - sel[0] + 1;
    }
}
