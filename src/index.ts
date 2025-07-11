// load the user data
userPrefs.load(true);
userActions.load();
userHistory.load();
userPrefs.loadWatchedScripts();

// set command palette matching algo
const matcher = prefs["fuzzy"] ? fuzzy : scoreMatches;

// add basic defaults to the startup on a first-run/fresh install
if (!prefs.startupCommands) {
    prefs.startupCommands = ["builtin_recentCommands", "config_settings"];
}

// SHOW THE COMMAND PALETTE
let queryableCommands = filterCommands(null, null, false, false, null);

let startupCommands = filterCommands(prefs.startupCommands, null, false, false, null);

var result = commandPalette(
    queryableCommands,
    localize(strings.title),
    paletteSettings.columnSets.standard,
    false,
    startupCommands,
    true
);

if (result) {
    const commandId: string = Array.isArray(result) ? result[0] : (result as string);

    processCommand(commandId);
}
