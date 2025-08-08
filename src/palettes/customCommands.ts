/**
 * Show dialog for entering custom commands in CSV format.
 * @returns User-entered CSV string, or empty string if cancelled.
 */
function addCustomCommandsDialog(): string {
    // Create the dialog window
    const win = new Window("dialog");
    win.text = localize(strings.add_custom_commands_dialog_title);
    win.alignChildren = "fill";

    // Header text
    const header = win.add(
        // @ts-ignore
        "statictext",
        [0, 0, 500, 100],
        localize(strings.custom_commands_header),
        { justify: "center", multiline: true }
    ) as StaticText;
    header.justify = "center";

    // Multiline input field for custom commands
    const customCommands = win.add("edittext", [0, 0, 400, 200], "", {
        multiline: true,
    }) as EditText;
    customCommands.text = "";

    // Dialog buttons
    const winButtons = win.add("group") as Group;
    winButtons.orientation = "row";
    winButtons.alignChildren = ["center", "center"];

    const save = winButtons.add("button", undefined, localize(strings.save), {
        name: "ok",
    }) as Button;
    save.preferredSize.width = 100;
    save.enabled = false;

    const cancel = winButtons.add("button", undefined, localize(strings.cancel), {
        name: "cancel",
    }) as Button;
    cancel.preferredSize.width = 100;

    // Enable save button only if text is entered
    customCommands.onChanging = () => {
        save.enabled = customCommands.text.length > 0;
    };

    // Show the dialog and return the result
    const confirmed = win.show() === 1;
    return confirmed ? customCommands.text : "";
}
