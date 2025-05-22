function addCustomCommandsDialog() {
  // create the dialog
  var win = new Window("dialog");
  win.text = localize(strings.add_custom_commands_dialog_title);
  win.alignChildren = "fill";

  var header = win.add(
    "statictext",
    [0, 0, 500, 100],
    localize(strings.custom_commands_header),
    {
      justify: "center",
      multiline: true,
    }
  );
  header.justify = "center";

  // custom commands csv text
  var customCommands = win.add("edittext", [0, 0, 400, 200], "", { multiline: true });
  customCommands.text = "";

  // window buttons
  var winButtons = win.add("group");
  winButtons.orientation = "row";
  winButtons.alignChildren = ["center", "center"];
  var save = winButtons.add("button", undefined, localize(strings.save), {
    name: "ok",
  });
  save.preferredSize.width = 100;
  save.enabled = false;
  var cancel = winButtons.add("button", undefined, localize(strings.cancel), {
    name: "cancel",
  });
  cancel.preferredSize.width = 100;

  customCommands.onChanging = function () {
    save.enabled = customCommands.text.length > 0 ? true : false;
  };

  if (win.show() == 1) {
    return customCommands.text;
  }
  return false;
}
