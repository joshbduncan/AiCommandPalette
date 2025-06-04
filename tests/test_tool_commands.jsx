// Test every tool command known to Ai Command Palette

// TODO: update for new imports

(function () {
  //@include "../src/include/polyfills.jsxinc"
  //@include "../src/include/helpers.jsxinc"
  //@include "../src/include/io.jsxinc"
  //@include "../src/include/palettes/palettes.jsxinc"
  //@include "../src/include/data.jsxinc"

  var f = new File(Folder.desktop + "/tool_test_results.txt");

  var aiVersion = parseFloat(app.version);

  // make sure an active document is open
  if (app.documents.length == 0) app.documents.add();

  var toolCommands = filterCommands(
    (commands = null),
    (types = ["tool"]),
    (showHidden = true),
    (showNonRelevant = true),
    (hideSpecificCommands = null)
  );

  if (
    !confirm(
      toolCommands.length +
        " tool commands found.\n\nWARNING: This script tends to crash Illustrator on subsequent runs!\n\nProceed with tests?",
      "noAsDflt",
      "Proceed with tests?"
    )
  )
    return;

  // setup counters and strings to hold results
  var skipped = 0;
  var passed = 0;
  var failed = 0;
  var s = "Ai Tool Command Tests\n\n";
  var results = "";

  var tool, toolData;
  for (var i = 0; i < toolCommands.length; i++) {
    tool = toolCommands[i];
    toolData = commandsData[tool];

    // skip tool if not version compatible
    if (!commandVersionCheck(toolData)) {
      skipped++;
      results += localize(toolData.name) + " (" + toolData.action + "): SKIPPED\n";
      continue;
    }

    // try activating the tool
    try {
      app.selectTool(tool);
      passed++;
      results += localize(toolData.name) + " (" + toolData.action + "): PASSED\n";
    } catch (e) {
      failed++;
      results +=
        localize(toolData.name) + " (" + toolData.action + "): FAILED (" + e + ")\n";
    }
  }

  // report
  s += "Total Tests: " + (passed + failed) + "\n";
  s += "Passed: " + passed + "\n";
  s += "Failed: " + failed + "\n";
  s += "Skipped (version): " + skipped + "\n\n";
  s += results + "\n\n";
  s += "File Created: " + new Date();

  writeData(s, f);
  f.execute();
})();
