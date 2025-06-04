function fuzzy(q, commands) {
  function stripRegExpChars(input) {
    // Regex pattern to match any of the characters that have special meaning in a regex
    return input.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "");
  }

  q = stripRegExpChars(q.toLowerCase());

  var scores = {};
  var matches = [];

  var id, command, commandName, spans, score, latch, recent, bonus;
  for (var i = 0; i < commands.length; i++) {
    // get command info
    id = commands[i];
    command = commandsData[id];
    commandName = determineCorrectString(command, "name").toLowerCase();
    if (commandName == "") commandName = id.toLowerCase().replace("_", " ");

    // strip regex protected characters
    commandName = stripRegExpChars(commandName);

    // strip out ellipsis for correct full word check
    commandName = commandName.replace(regexEllipsis, "");

    // find fuzzy matches
    spans = findMatches(q.split(" "), commandName);

    // no need to track scores of commands without matches
    if (!spans.length) continue;

    // calculate the command score
    bonus = 0;
    score = calculateScore(commandName, spans);

    // // increase score if latched query
    if (latches.hasOwnProperty(q) && commands.includes(latches[q])) {
      latch = true;
      bonus += 1;
    }

    // increase score recent command
    if (recentCommands.hasOwnProperty(command.id)) {
      recent = true;
      bonus += 0.5;
    }

    scores[id] = score + bonus;

    matches.push(id);
  }

  matches.sort(function (a, b) {
    return scores[b] - scores[a];
  });

  return matches;
}

function calculateScore(command, spans) {
  var lastCarrot = findLastCarrot(command);

  var score = 0;
  var s, e, wordStart, wordEnd;
  for (var i = 0; i < spans.length; i++) {
    s = spans[i][0];
    e = spans[i][1];

    // check for full word
    wordStart = s == 0 || command.charAt(s - 1) == " " ? true : false;
    wordEnd = e == command.length || command.charAt(e) == " " ? true : false;

    if (wordStart && wordEnd) {
      score += (e - s) * 3;
    } else if (wordStart) {
      score += (e - s) * 2;
    } else {
      score += e - s;
    }

    if (s >= lastCarrot) {
      score += 0.5;
    }
  }
  return score;
}

function findMatches(chunks, str) {
  var spans = [];

  var chunk, s, e, offset, lastSpan;
  for (var i = 0; i < chunks.length; i++) {
    var chunk = chunks[i];
    if (!chunk) {
      continue;
    }

    s = 0;
    e = 1;
    offset = 0;
    lastSpan = null;

    var chars, match, spanStart, spanEnd;
    while (true) {
      chars = chunk.substring(s, e);
      match = str.substring(offset).match(chars);

      if (match) {
        spanStart = match.index + offset;
        spanEnd = spanStart + chars.length;
        lastSpan = [spanStart, spanEnd];
        e++;
      } else {
        if (chars.length === 1) {
          spans = [];
          break;
        }

        s = e - 1;

        if (lastSpan !== null) {
          var spanStart = lastSpan[0];
          var spanEnd = lastSpan[1];
          offset = spanEnd;
          spans.push([spanStart, spanEnd]);
        }

        lastSpan = null;
      }

      if (e === chunk.length + 1) {
        if (lastSpan !== null) {
          var hls = lastSpan[0];
          var hle = lastSpan[1];
          spans.push([hls, hle]);
        }
        break;
      }
    }
  }
  return spans;
}
