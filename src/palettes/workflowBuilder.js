function workflowBuilder(commands, editWorkflowId) {
  var qCache = {};
  var overwrite = false;
  var editableCommandTypes = ["picker"];

  // create the dialog
  var win = new Window("dialog");
  win.text = localize(strings.wf_builder);
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
    localize(strings.cd_helptip),
    [addToStepsOnDoubleClick, scrollListBoxWithArrows]
  );

  // work-around to stop windows from flickering/flashing explorer
  if (windowsFlickerFix) {
    simulateKeypress("TAB", 1);
  } else {
    q.active = true;
  }

  var pSteps = win.add("panel", undefined, localize(strings.wf_steps));
  pSteps.alignChildren = ["fill", "center"];
  pSteps.margins = 20;

  // if editing a workflow check to make sure all of it's actions are still valid
  var editWorkflow, step;
  var actionSteps = [];
  if (editWorkflowId) {
    editWorkflow = commandsData[editWorkflowId];
    for (var i = 0; i < editWorkflow.actions.length; i++) {
      step = editWorkflow.actions[i];
      if (!commandsData.hasOwnProperty(editWorkflow.actions[i])) {
        step += " [NOT FOUND]";
      } else if (!commandVersionCheck(editWorkflow.actions[i])) {
        step += " [INCOMPATIBLE AI VERSION]";
      }
      actionSteps.push(step);
    }
  }

  // setup the workflow action steps listbox
  var steps = new ListBoxWrapper(
    actionSteps,
    pSteps,
    "steps",
    [0, 0, paletteSettings.paletteWidth, paletteSettings.paletteHeight],
    paletteSettings.columnSets.standard,
    true,
    localize(strings.wf_steps_helptip),
    []
  );

  // allow in-line editing of pickers
  steps.listbox.onDoubleClick = function () {
    var selectedItem, command, updatedPicker;
    selectedItem = steps.listbox.selection[0];
    command = commandsData[selectedItem.id];
    if (!editableCommandTypes.includes(command.type.toLowerCase())) {
      alert(localize(strings.wf_step_not_editable));
      return;
    }
    updatedPicker = buildPicker(command.id);
    if (updatedPicker.id != command.id) selectedItem.id = updatedPicker.id;
    if (updatedPicker.name != command.name) selectedItem.text = updatedPicker.name;
  };

  var stepButtons = pSteps.add("group");
  stepButtons.alignment = "center";
  var up = stepButtons.add("button", undefined, localize(strings.step_up));
  up.preferredSize.width = 100;
  var down = stepButtons.add("button", undefined, localize(strings.step_down));
  down.preferredSize.width = 100;
  var edit = stepButtons.add("button", undefined, localize(strings.step_edit));
  edit.preferredSize.width = 100;
  var del = stepButtons.add("button", undefined, localize(strings.step_delete));
  del.preferredSize.width = 100;

  // workflow name
  var pName = win.add("panel", undefined, localize(strings.wf_save_as));
  pName.alignChildren = ["fill", "center"];
  pName.margins = 20;
  var workflowNameText = editWorkflow ? editWorkflow.name : "";
  var workflowName = pName.add("edittext", undefined, workflowNameText);
  workflowName.enabled = editWorkflow ? true : false;

  // window buttons
  var winButtons = win.add("group");
  winButtons.orientation = "row";
  winButtons.alignChildren = ["center", "center"];
  var save = winButtons.add("button", undefined, localize(strings.save), {
    name: "ok",
  });
  save.preferredSize.width = 100;
  save.enabled = editWorkflow ? true : false;
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

  steps.listbox.onChange = function () {
    workflowName.enabled = steps.listbox.items.length > 0 ? true : false;
    save.enabled =
      steps.listbox.items.length > 0 && workflowName.text.length > 0 ? true : false;
  };

  workflowName.onChanging = function () {
    save.enabled = workflowName.text.length > 0 ? true : false;
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
    for (var n = 0; n < selected.length; n++) steps.listbox.selection = selected[n] - 1;
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
    for (var n = 0; n < selected.length; n++) steps.listbox.selection = selected[n] + 1;
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

  edit.onClick = function () {
    var selectedItem, command, updatedPicker;
    selectedItem = steps.listbox.selection[0];
    command = commandsData[selectedItem.id];
    if (!editableCommandTypes.includes(command.type.toLowerCase())) {
      alert(localize(strings.wf_step_not_editable));
      return;
    }
    updatedPicker = buildPicker(command.id);
    if (updatedPicker.id != command.id) selectedItem.id = updatedPicker.id;
    if (updatedPicker.name != command.name) selectedItem.text = updatedPicker.name;
  };

  del.onClick = function () {
    var selected = sortIndexes(steps.listbox.selection);
    for (var i = selected.length - 1; i > -1; i--) {
      steps.listbox.remove(selected[i]);
    }
    steps.listbox.selection == null;
    workflowName.enabled = steps.listbox.items.length > 0 ? true : false;
    save.enabled =
      steps.listbox.items.length > 0 && workflowName.text.length > 0 ? true : false;
  };

  save.onClick = function () {
    // check for workflow overwrite
    var currentWorkflows = [];
    for (var i = 0; i < prefs.workflows.length; i++) {
      currentWorkflows.push(prefs.workflows[i].name);
    }
    if (currentWorkflows.includes(workflowName.text.trim())) {
      overwrite = true;
      if (
        !confirm(
          localize(strings.wf_already_exists) + "\n" + workflowName.text.trim(),
          "noAsDflt",
          localize(strings.wf_already_exists_title)
        )
      ) {
        return;
      }
    }
    win.close(1);
  };

  if (win.show() == 1) {
    var actions = [];
    for (var i = 0; i < steps.listbox.items.length; i++) {
      actions.push(steps.listbox.items[i].id);
    }
    return { name: workflowName.text.trim(), actions: actions, overwrite: overwrite };
  }
  return false;
}
