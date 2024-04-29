/**
 * Score array items based on regex string match.
 * @param   {String} query    String to search for.
 * @param   {Array}  commands Commands to match `query` against.
 * @returns {Array}           Matching items sorted by score.
 */
function scoreMatches(query, commands) {
  var words = [];
  var matches = [];
  var scores = {};
  var maxScore = 0;
  query = query.toLowerCase();
  var words = query.split(" ");
  var id, command, name, type, score, strippedName;

  // query latching
  if (latches.hasOwnProperty(query) && commands.includes(latches[query])) {
    scores[latches[query]] = 1000;
    matches.push(latches[query]);
  }

  for (var i = 0; i < commands.length; i++) {
    id = commands[i];
    command = commandsData[id];
    score = 0;
    name = determineCorrectString(command, "name").toLowerCase();

    // escape hatch
    if (name == "") name = id.toLowerCase().replace("_", " ");

    type = strings.hasOwnProperty(command.type)
      ? localize(strings[command.type]).toLowerCase()
      : command.type.toLowerCase();

    // check for exact match
    if (
      query === name ||
      query.replace(regexEllipsis, "").replace(regexCarrot, " ") == strippedName ||
      query === type
    ) {
      score += word.length;
    }

    // strip junk from command name
    strippedName = name.replace(regexEllipsis, "").replace(regexCarrot, " ");

    // add the command type to the name if user requested searching type
    if (prefs.searchIncludesType) name = name.concat(" ", type);
    // TODO: maybe allow searching on all columns (pulled from paletteSettings.columnSets)

    // check for singular word matches
    var word, re;
    for (var n = 0; n < words.length; n++) {
      word = words[n];
      if (!word) continue;

      re = new RegExp("\\b" + word, "gi");

      // check for a match at the beginning of a word
      if (re.test(name) || re.test(strippedName)) score += word.length;
    }

    // updated scores for matches
    if (score > 0) {
      // increase score if command found in recent commands
      if (score >= maxScore && recentCommands.hasOwnProperty(command.id)) {
        score += recentCommands[command.id];
      }
      if (scores.hasOwnProperty(id)) {
        scores[id] += score;
      } else {
        scores[id] = score;
        matches.push(id);
      }
      if (scores[id] > maxScore) maxScore = scores[id];
    }
  }

  /* Sort matched by their respective score */
  function sortByScore(arr) {
    for (var i = 0; i < arr.length; i++) {
      for (var j = 0; j < arr.length - i - 1; j++) {
        if (scores[arr[j + 1]] > scores[arr[j]]) {
          var temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
      }
    }
    return arr;
  }

  return sortByScore(matches);
}
