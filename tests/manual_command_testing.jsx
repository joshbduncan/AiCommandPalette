var win = new Window("dialog");
win.text = "Test Ai Menu Command";
win.orientation = "column";
win.alignChildren = ["center", "top"];
win.spacing = 10;
win.margins = 16;

var cmd = win.add("edittext");
cmd.preferredSize.width = 300;
cmd.active = true;

var winButtons = win.add("group");
winButtons.orientation = "row";
winButtons.alignChildren = ["center", "center"];
var cancel = winButtons.add("button", undefined, "Cancel");
cancel.preferredSize.width = 75;
var menu = winButtons.add("button", undefined, "Menu");
menu.preferredSize.width = 75;
var tool = winButtons.add("button", undefined, "Tool");
tool.preferredSize.width = 75;

menu.onClick = function () {
  win.close();
  try {
    app.executeMenuCommand(cmd.text);
  } catch (e) {
    alert(e);
  }
};

tool.onClick = function () {
  win.close();
  try {
    app.selectTool(cmd.text);
  } catch (e) {
    alert(e);
  }
};

win.show();
