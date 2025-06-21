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

    const list = new ListBoxWrapper(
        commands,
        pSearch,
        "commands",
        [0, 0, paletteSettings.paletteWidth, paletteSettings.paletteHeight],
        paletteSettings.columnSets.standard,
        false,
        localize(strings.cd_helptip),
        [addToStepsOnDoubleClick, scrollListBoxWithArrows]
    );

    if (windowsFlickerFix) simulateKeypress("TAB", 1);
    else q.active = true;

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

    let matches;
    q.onChanging = function () {
        const query = q.text;
        if (query === "") matches = commands;
        else if (qCache[query]) matches = qCache[query];
        else matches = qCache[query] = matcher(query, commands);
        if (matches.length > 0) list.update(matches);
    };

    steps.listbox.onChange = function () {
        workflowName.enabled = steps.listbox.items.length > 0;
        save.enabled = workflowName.enabled && workflowName.text.length > 0;
    };

    workflowName.onChanging = function () {
        save.enabled = workflowName.text.length > 0;
    };

    up.onClick = function () {
        const selected = sortIndexes(steps.listbox.selection);
        if (selected[0] === 0 || !contiguous(selected)) return;
        for (let i = 0; i < selected.length; i++) {
            swapListboxItems(
                steps.listbox.items[selected[i] - 1],
                steps.listbox.items[selected[i]]
            );
        }
        steps.listbox.selection = selected.map((index) => index - 1);
    };

    down.onClick = function () {
        const selected = sortIndexes(steps.listbox.selection);
        if (
            selected[selected.length - 1] === steps.listbox.items.length - 1 ||
            !contiguous(selected)
        )
            return;
        for (let i = selected.length - 1; i >= 0; i--) {
            swapListboxItems(
                steps.listbox.items[selected[i]],
                steps.listbox.items[selected[i] + 1]
            );
        }
        steps.listbox.selection = selected.map((index) => index + 1);
    };

    edit.onClick = steps.listbox.onDoubleClick;

    del.onClick = function () {
        const selected = sortIndexes(steps.listbox.selection);
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
            actions.push(steps.listbox.items[i].id);
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
