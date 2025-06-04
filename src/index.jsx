// load the user data
userPrefs.load(true);
userActions.load();
userHistory.load();

// set command palette matching algo
var matcher = prefs["fuzzy"] ? fuzzy : scoreMatches;
// TODO: allow disable keyword latching

// add basic defaults to the startup on a first-run/fresh install
if (!prefs.startupCommands) {
  prefs.startupCommands = ["builtin_recentCommands", "config_settings"];
}

// SHOW THE COMMAND PALETTE
var queryableCommands = filterCommands(null, null, false, false, null);

var startupCommands = filterCommands(prefs.startupCommands, null, false, false, null);

launchCommandPalette();

function launchCommandPalette() {
  var result = commandPalette(
    queryableCommands,
    localize(strings.title),
    paletteSettings.columnSets.default,
    false,
    startupCommands,
    true
  );
  if (!result) return;
  processCommand(result);
}
