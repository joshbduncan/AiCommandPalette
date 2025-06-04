//USER HISTORY

var userHistoryFolder = setupFolderObject(Folder.userData + "/JBD/AiCommandPalette");
var userHistoryFileName = "History.json";

// setup the base prefs model
var history = [];
var recentCommands = {};
var mostRecentCommands = [];
var latches = {};

var userHistory = {};
userHistory.folder = function () {
  return userHistoryFolder;
};
userHistory.file = function () {
  var folder = this.folder();
  var file = setupFileObject(folder, userHistoryFileName);
  return file;
};
userHistory.load = function () {
  var file = this.file();
  logger.log("loading user history:", file.fsName);
  if (file.exists) {
    var queryCommandsLUT = {};
    var loadedData, entry;
    try {
      loadedData = readJSONData(file);
      if (loadedData == []) return;
      history = loadedData;
      for (var i = loadedData.length - 1; i >= 0; i--) {
        entry = loadedData[i];
        // track how many times a query ties to a command
        if (!queryCommandsLUT.hasOwnProperty(entry.query))
          queryCommandsLUT[entry.query] = {};
        if (!queryCommandsLUT[entry.query].hasOwnProperty(entry.command))
          queryCommandsLUT[entry.query][entry.command] = 0;
        queryCommandsLUT[entry.query][entry.command]++;
        // track how often recent command have been ran
        if (!recentCommands.hasOwnProperty(entry.command))
          recentCommands[entry.command] = 0;
        recentCommands[entry.command]++;
        // track the past 25 most recent commands
        if (
          mostRecentCommands.length <= mostRecentCommandsCount &&
          commandsData.hasOwnProperty(entry.command) &&
          !mostRecentCommands.includes(entry.command)
        )
          mostRecentCommands.push(entry.command);
      }
      // build latches with most common command for each query
      var query, command, commands;
      for (query in queryCommandsLUT) {
        commands = [];
        for (command in queryCommandsLUT[query]) {
          commands.push([command, queryCommandsLUT[query][command]]);
        }
        // sort by most used
        commands.sort(function (a, b) {
          return b[1] - a[1];
        });
        latches[query] = commands[0][0];
      }
    } catch (e) {
      file.rename(file.name + ".bak");
      this.reveal();
      Error.runtimeError(1, localize(strings.history_file_loading_error));
    }
  }
};
userHistory.clear = function () {
  var file = this.file();
  logger.log("clearing user history");
  file.remove();
};
userHistory.save = function () {
  var file = this.file();
  logger.log("writing user history");
  if (history.length > 500) history = history.slice(-500);
  writeJSONData(history, file);
};
userHistory.backup = function () {
  var backupFile = new File(this.file() + ".bak");
  logger.log("user history backed up to:", backupFile.fsName);
  this.file().copy(backupFile);
};
userHistory.reveal = function () {
  var folder = this.folder();
  logger.log("revealing history file");
  folder.execute();
};
