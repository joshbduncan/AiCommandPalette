function startupBuilder(commands) {
    var qCache = {};

    // create the dialog
    var win = new Window("dialog");
    win.text = localize(strings.startup_builder);
    win.alignChildren = "fill";

    // setup the query input
    var pSearch = win.add("panel", undefined, localize(strings.cd_search_for));
    pSearch.alignChildren = ["fill", "center"];
    pSearch.margins = 20;
    var q = pSearch.add("edittext");
    q.helpTip = localize(strings.cd_q_helptip);

    // setup the commands listbox
    var list = new ListBoxWrapper(
        commands,
        pSearch,
        "commands",
        [0, 0, paletteSettings.paletteWidth, paletteSettings.paletteHeight],
        paletteSettings.columnSets.standard,
        false,
        localize(strings.startup_helptip),
        [addToStepsOnDoubleClick, scrollListBoxWithArrows]
    );

    // work-around to stop windows from flickering/flashing explorer
    if (windowsFlickerFix) {
        simulateKeypress("TAB", 1);
    } else {
        q.active = true;
    }

    var pSteps = win.add("panel", undefined, localize(strings.startup_steps));
    pSteps.alignChildren = ["fill", "center"];
    pSteps.margins = 20;

    // setup the workflow action steps listbox
    var steps = new ListBoxWrapper(
        prefs.startupCommands,
        pSteps,
        "steps",
        [0, 0, paletteSettings.paletteWidth, paletteSettings.paletteHeight],
        paletteSettings.columnSets.standard,
        true,
        localize(strings.startup_steps_helptip),
        []
    );

    var stepButtons = pSteps.add("group");
    stepButtons.alignment = "center";
    var up = stepButtons.add("button", undefined, localize(strings.step_up));
    up.preferredSize.width = 100;
    var down = stepButtons.add("button", undefined, localize(strings.step_down));
    down.preferredSize.width = 100;
    var del = stepButtons.add("button", undefined, localize(strings.step_delete));
    del.preferredSize.width = 100;

    // window buttons
    var winButtons = win.add("group");
    winButtons.orientation = "row";
    winButtons.alignChildren = ["center", "center"];
    var save = winButtons.add("button", undefined, localize(strings.save), {
        name: "ok",
    });
    save.preferredSize.width = 100;
    save.enabled = true;
    var cancel = winButtons.add("button", undefined, localize(strings.cancel), {
        name: "cancel",
    });
    cancel.preferredSize.width = 100;

    // as a query is typed update the listbox
    var matches;
    q.onChanging = function () {
        if (q.text === "") {
            matches = commands;
        } else if (qCache.hasOwnProperty(q.text)) {
            matches = qCache[q.text];
        } else {
            matches = matcher(q.text, commands);
            qCache[q.text] = matches;
        }
        if (matches.length > 0) {
            list.update(matches);
        }
    };

    up.onClick = function () {
        var selected = sortIndexes(steps.listbox.selection);
        if (selected[i] == 0 || !contiguous(selected)) return;
        for (var i = 0; i < selected.length; i++)
            swapListboxItems(
                steps.listbox.items[selected[i] - 1],
                steps.listbox.items[selected[i]]
            );
        steps.listbox.selection = null;
        for (var n = 0; n < selected.length; n++)
            steps.listbox.selection = selected[n] - 1;
    };

    down.onClick = function () {
        var selected = sortIndexes(steps.listbox.selection);
        if (
            selected[selected.length - 1] == steps.listbox.items.length - 1 ||
            !contiguous(selected)
        )
            return;
        for (var i = steps.listbox.selection.length - 1; i > -1; i--)
            swapListboxItems(
                steps.listbox.items[selected[i]],
                steps.listbox.items[selected[i] + 1]
            );
        steps.listbox.selection = null;
        for (var n = 0; n < selected.length; n++)
            steps.listbox.selection = selected[n] + 1;
    };

    // the api returns the selected items in the order they were
    // selected/clicked by the user when you call `list.selection`
    // so their actual listbox indexes need to be sorted for the
    // up, down, and delete buttons to work when multiple items are selected
    function sortIndexes(sel) {
        var indexes = [];
        for (var i = 0; i < sel.length; i++) indexes.push(sel[i].index);
        return indexes.sort();
    }

    // check to make sure selection is contiguous
    function contiguous(sel) {
        return sel.length == sel[sel.length - 1] - sel[0] + 1;
    }

    del.onClick = function () {
        var selected = sortIndexes(steps.listbox.selection);
        for (var i = selected.length - 1; i > -1; i--) {
            // add removed item back to listbox
            commands.push(steps.listbox.items[selected[i]].id);
            steps.listbox.remove(selected[i]);
        }

        // clear cache and re-index matches
        qCache = {};
        matches = matcher(q.text, commands);
        qCache[q.text] = matches;
        if (matches.length > 0) {
            list.update(matches);
        }

        steps.listbox.selection == null;
    };

    if (win.show() == 1) {
        var items = [];
        for (var i = 0; i < steps.listbox.items.length; i++) {
            items.push(steps.listbox.items[i].id);
        }
        return items;
    }
    return false;
}
