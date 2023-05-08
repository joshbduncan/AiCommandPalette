(function () {
  //@include "../src/include/commands.jsxinc"
  //@include "../src/include/data.jsxinc"

  // sample tool object
  // {
  //   "tool_Adobe Add Anchor Point Tool": {
  //     action: "Adobe Add Anchor Point Tool",
  //     type: "tool",
  //     docRequired: true,
  //     loc: {
  //       en: "Add Anchor Point Tool",
  //       de: "Ankerpunkt-hinzufügen-Werkzeug",
  //       ru: "Инструмент: Добавить опорную точку",
  //     },
  //     minVersion: 24,
  //   }

  var aiVersion = parseFloat(app.version);
  var commands = builtCommands.tool;

  // make sure an active document is open
  if (app.documents.length == 0) app.documents.add();

  var command;
  var skipped = 0;
  var passed = 0;
  var failed = 0;
  for (tool in commands) {
    commandData = commands[tool];
    command = commands[tool].action;

    // make sure Ai version meets command requirements
    if (!versionCheck(commandData)) {
      skipped++;
      continue;
    }

    // try activating the tool
    try {
      app.selectTool(command);
      passed++;
      $.writeln("✅ " + command);
    } catch (e) {
      failed++;
      $.writeln("⚠️ " + command);
      $.writeln("ERROR: " + e);
    }
  }

  // report
  $.writeln("TESTING AI TOOL COMMANDS");
  $.writeln("TOTAL TESTS: " + (passed + failed));
  $.writeln("PASSED: " + passed);
  $.writeln("FAILED: " + failed);
  $.writeln("SKIPPED (VERSION): " + skipped);

  function versionCheck(commandData) {
    if (
      (commandData.minVersion && commandData.minVersion > aiVersion) ||
      (commandData.maxVersion && commandData.maxVersion < aiVersion)
    )
      return false;
    return true;
  }
})();
