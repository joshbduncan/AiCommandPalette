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

        const chunks = sanitizedQuery.split(" ");
        const spans = findMatches(chunks, commandName);
        if (!spans.length) continue;

        let score = calculateScore(commandName, spans, chunks);
        let bonus = 0;

        if (latches.hasOwnProperty(q) && latches[q] == command.id) {
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
 * Calculates a fuzzy-match relevance score for a command string.
 *
 * This scoring function considers both the positional context of each match
 * span (e.g., word boundaries and sections after the last `>` carrot) and the
 * quality of the match itself. Longer contiguous spans earn exponentially
 * higher scores, and exact matches against query chunks (when provided) receive
 * an additional bonus — even when embedded inside larger tokens (e.g. inside
 * camelCase or compound identifiers).
 *
 * Intended use: highlight spans, boost meaningful exact matches, and emulate
 * modern command-palette ranking where complete token matches outrank scattered
 * partial matches.
 *
 * @param command The command text being evaluated.
 * @param spans Array of `[start, end)` tuples representing fuzzy-matched
 *        character ranges within `command`.
 * @param chunks (Optional) Original query chunks; used to award extra credit
 *        when a span exactly equals a user-typed chunk, regardless of position.
 * @returns A numeric relevance score where higher values indicate a stronger
 *          fuzzy match.
 */
function calculateScore(
    command: string,
    spans: [number, number][],
    chunks?: string[]
): number {
    const lastCarrot = findLastCarrot(command);
    let score = 0;

    for (const [s, e] of spans) {
        const len = e - s;
        const startBoundary = s === 0 || command.charAt(s - 1) === " ";
        const endBoundary = e === command.length || command.charAt(e) === " ";

        const boundaryMult = startBoundary && endBoundary ? 3 : startBoundary ? 2 : 1;

        let spanScore = len * boundaryMult;
        spanScore += len * len; // contiguity boost

        if (chunks) {
            const spanText = command.slice(s, e).toLowerCase();
            if (chunks.some((c) => c.toLowerCase() === spanText)) {
                // Exact-chunk bonus (tune the factor as you like)
                spanScore += len * 3;
            }
        }

        if (s >= lastCarrot) spanScore += 0.5 * len;

        score += spanScore;
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
