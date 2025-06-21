function pickerBuilder(editPickerId) {
    var overwrite = false;

    // create the dialog
    var win = new Window("dialog");
    win.text = localize(strings.picker_builder_title);
    win.alignChildren = "fill";

    // picker commands
    var header = win.add(
        "statictext",
        undefined,
        localize(strings.picker_builder_header)
    );
    header.justify = "center";
    var pickerCommands = win.add("edittext", [0, 0, 400, 200], "", { multiline: true });
    pickerCommands.text = editPickerId
        ? commandsData[editPickerId].commands.join("\n")
        : "";
    pickerCommands.active = true;
    var cbMultiselect = win.add(
        "checkbox",
        undefined,
        localize(strings.picker_builder_multi_select)
    );
    cbMultiselect.value = editPickerId ? commandsData[editPickerId].multiselect : false;

    // picker name
    var pName = win.add("panel", undefined, localize(strings.picker_builder_name));
    pName.alignChildren = ["fill", "center"];
    pName.margins = 20;
    var pickerNameText = editPickerId ? commandsData[editPickerId].name : "";
    var pickerName = pName.add("edittext", undefined, pickerNameText);
    pickerName.enabled = editPickerId ? true : false;

    // window buttons
    var winButtons = win.add("group");
    winButtons.orientation = "row";
    winButtons.alignChildren = ["center", "center"];
    var save = winButtons.add("button", undefined, localize(strings.save), {
        name: "ok",
    });
    save.preferredSize.width = 100;
    save.enabled = editPickerId ? true : false;
    var cancel = winButtons.add("button", undefined, localize(strings.cancel), {
        name: "cancel",
    });
    cancel.preferredSize.width = 100;

    pickerCommands.onChanging = function () {
        pickerName.enabled = pickerCommands.text.length > 0 ? true : false;
        save.enabled =
            pickerCommands.text.length > 0 && pickerName.text.length > 0 ? true : false;
    };

    pickerName.onChanging = function () {
        save.enabled = pickerCommands.text.length > 0 ? true : false;
    };

    save.onClick = function () {
        // check for picker overwrite
        var currentPickers = [];
        for (var i = 0; i < prefs.pickers.length; i++) {
            currentPickers.push(prefs.pickers[i].name);
        }
        if (currentPickers.includes(pickerName.text.trim())) {
            overwrite = true;
            if (
                !confirm(
                    localize(
                        strings.picker_builder_save_conflict_message,
                        pickerName.text.trim()
                    ),
                    "noAsDflt",
                    localize(strings.picker_builder_save_conflict_title)
                )
            ) {
                return;
            }
        }
        win.close(1);
    };

    if (win.show() == 1) {
        var commands = [];
        var lines = pickerCommands.text.split(/\r\n|\r|\n/);
        for (var i = 0; i < lines.length; i++) {
            commands.push(lines[i].trim());
        }
        return {
            name: pickerName.text.trim(),
            commands: commands,
            multiselect: cbMultiselect.value,
            overwrite: overwrite,
        };
    }
    return false;
}
