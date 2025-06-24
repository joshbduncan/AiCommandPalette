/**
 * Build or edit a picker command via dialog interface.
 * @param editPickerId The ID of the picker to edit, if any.
 * @returns Picker configuration object or false if canceled.
 */
function pickerBuilder(editPickerId?: string):
    | {
          name: string;
          commands: string[];
          multiselect: boolean;
          overwrite: boolean;
      }
    | false {
    let overwrite = false;

    const win = new Window("dialog");
    win.text = localize(strings.picker_builder_title);
    win.alignChildren = "fill";

    const header = win.add(
        "statictext",
        undefined,
        localize(strings.picker_builder_header)
    );
    header.justify = "center";

    const pickerCommands = win.add("edittext", [0, 0, 400, 200], "", {
        multiline: true,
    }) as EditText;
    pickerCommands.text = editPickerId
        ? commandsData[editPickerId].commands.join("\n")
        : "";
    pickerCommands.active = true;

    const cbMultiselect = win.add(
        "checkbox",
        undefined,
        localize(strings.picker_builder_multi_select)
    ) as Checkbox;
    cbMultiselect.value = editPickerId ? commandsData[editPickerId].multiselect : false;

    const pName = win.add(
        "panel",
        undefined,
        localize(strings.picker_builder_name)
    ) as Panel;
    pName.alignChildren = ["fill", "center"];
    pName.margins = 20;

    const pickerNameText = editPickerId ? commandsData[editPickerId].name : "";
    const pickerName = pName.add("edittext", undefined, pickerNameText) as EditText;
    pickerName.enabled = Boolean(editPickerId);

    const winButtons = win.add("group") as Group;
    winButtons.orientation = "row";
    winButtons.alignChildren = ["center", "center"];

    const save = winButtons.add("button", undefined, localize(strings.save), {
        name: "ok",
    }) as Button;
    save.preferredSize.width = 100;
    save.enabled = Boolean(editPickerId);

    const cancel = winButtons.add("button", undefined, localize(strings.cancel), {
        name: "cancel",
    }) as Button;
    cancel.preferredSize.width = 100;

    pickerCommands.onChanging = function () {
        const hasText = pickerCommands.text.length > 0;
        pickerName.enabled = hasText;
        save.enabled = hasText && pickerName.text.length > 0;
    };

    pickerName.onChanging = function () {
        save.enabled = pickerCommands.text.length > 0 && pickerName.text.length > 0;
    };

    save.onClick = function () {
        const nameTrimmed = pickerName.text.trim();
        const currentPickers = prefs.pickers.map((p) => p.name);

        if (currentPickers.includes(nameTrimmed)) {
            overwrite = true;

            const confirmed = confirm(
                localize(strings.picker_builder_save_conflict_message, nameTrimmed),
                false,
                localize(strings.picker_builder_save_conflict_title)
            );

            if (!confirmed) return;
        }

        win.close(1);
    };

    if (win.show() === 1) {
        const newCustomCommandIds: string[] = [];
        const text = pickerCommands.text;
        const normalized = text.replace(/\r\n|\r/g, "\n");

        const commands = normalized
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);

        return {
            name: pickerName.text.trim(),
            commands,
            multiselect: cbMultiselect.value,
            overwrite,
        };
    }

    return false;
}
