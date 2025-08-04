/**
 * Remove regex-special characters from input string.
 * @param input The input string to sanitize.
 * @returns A string safe for regex usage.
 */
function stripRegExpChars(input: string): string {
    return input.replace(/[.*+?^=!:${}()|[\]\/\\]/g, "");
}

/**
 * Fuzzy match a query string against a list of command IDs.
 * Scores and sorts matches based on relevance.
 * @param q The user input query.
 * @param commands List of command IDs to match against.
 * @returns A sorted array of matching command IDs.
 */
function fuzzy(q: string, commands: string[]): string[] {
    const sanitizedQuery = stripRegExpChars(q.toLowerCase());
    const scores: Record<string, number> = {};
    const matches: string[] = [];

    for (const id of commands) {
        const command = commandsData[id];
        let commandName = determineCorrectString(command, "name").toLowerCase();
        if (!commandName) commandName = id.toLowerCase().replace("_", " ");
        commandName = stripRegExpChars(commandName).replace(regexEllipsis, "");

        const spans = findMatches(sanitizedQuery.split(" "), commandName);
        if (!spans.length) continue;

        let score = calculateScore(commandName, spans);
        let bonus = 0;

        if (latches.hasOwnProperty(q) && commands.includes(latches[q])) {
            bonus += 1;
        }

        if (recentCommands.hasOwnProperty(command.id)) {
            bonus += 0.5;
        }

        scores[id] = score + bonus;
        matches.push(id);
    }

    matches.sort((a, b) => scores[b] - scores[a]);
    return matches;
}

/**
 * Calculates a score based on match spans and string location.
 * @param command The target string being matched.
 * @param spans An array of start/end index pairs for matches.
 * @returns A numeric relevance score.
 */
function calculateScore(command: string, spans: [number, number][]): number {
    const lastCarrot = findLastCarrot(command);
    let score = 0;

    for (const [s, e] of spans) {
        const wordStart = s === 0 || command.charAt(s - 1) === " ";
        const wordEnd = e === command.length || command.charAt(e) === " ";

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

/**
 * Finds fuzzy match spans for chunks within a target string.
 * Each span is a pair of indices [start, end].
 * @param chunks Query words to match.
 * @param str The target string to search.
 * @returns Array of matching spans or empty array if no match.
 */
function findMatches(chunks: string[], str: string): [number, number][] {
    const spans: [number, number][] = [];

    for (const chunk of chunks) {
        if (!chunk) continue;

        let s = 0;
        let e = 1;
        let offset = 0;
        let lastSpan: [number, number] | null = null;

        while (true) {
            const chars = chunk.substring(s, e);
            const match = str.substring(offset).match(chars);

            if (match) {
                const spanStart = match.index! + offset;
                const spanEnd = spanStart + chars.length;
                lastSpan = [spanStart, spanEnd];
                e++;
            } else {
                if (chars.length === 1) {
                    return [];
                }

                s = e - 1;

                if (lastSpan !== null) {
                    const [spanStart, spanEnd] = lastSpan;
                    offset = spanEnd;
                    spans.push([spanStart, spanEnd]);
                }

                lastSpan = null;
            }

            if (e === chunk.length + 1) {
                if (lastSpan !== null) {
                    spans.push(lastSpan);
                }
                break;
            }
        }
    }

    return spans;
}
