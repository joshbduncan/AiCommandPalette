/**
 * Score array items based on regex string match.
 * @param query String to search for.
 * @param commands Command IDs to match `query` against.
 * @returns Matching command IDs sorted by relevance score.
 */
function scoreMatches(query: string, commands: string[]): string[] {
  const words = query.toLowerCase().split(" ");
  const matches: string[] = [];
  const scores: Record<string, number> = {};
  let maxScore = 0;

  // Prioritize latched query
  if (latches.hasOwnProperty(query) && commands.includes(latches[query])) {
    const latchedId = latches[query];
    scores[latchedId] = 1000;
    matches.push(latchedId);
  }

  for (const id of commands) {
    const command = commandsData[id];
    if (!command) continue;

    let score = 0;
    let name = determineCorrectString(command, "name").toLowerCase();
    const type = strings.hasOwnProperty(command.type)
      ? localize(strings[command.type]).toLowerCase()
      : command.type.toLowerCase();

    const strippedName = name.replace(regexEllipsis, "").replace(regexCarrot, " ");

    if (!name) {
      name = id.toLowerCase().replace("_", " ");
    }

    // Exact match checks
    if (query === name || query === strippedName || query === type) {
      score += query.length;
    }

    // add the command type to the name if user requested searching type
    // if (prefs.searchIncludesType) {
    //   name += " " + type;
    // }
    // TODO: maybe allow searching on all columns (pulled from paletteSettings.columnSets)

    // Word-by-word matching
    for (const word of words) {
      if (!word) continue;
      const re = new RegExp("\\b" + word, "gi");
      if (re.test(name) || re.test(strippedName)) {
        score += word.length;
      }
    }

    // Score boost for recent commands
    if (score > 0) {
      if (recentCommands.hasOwnProperty(command.id)) {
        score += recentCommands[command.id];
      }

      scores[id] = (scores[id] || 0) + score;
      matches.push(id);
      if (scores[id] > maxScore) {
        maxScore = scores[id];
      }
    }
  }

  // Sort matches by score descending
  return matches
    .filter((id, i, self) => self.indexOf(id) === i) // remove duplicates
    .sort((a, b) => scores[b] - scores[a]);
}
