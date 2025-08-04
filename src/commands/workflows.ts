/**
 * Check if any workflow actions are currently non-active (nonexistent or AI version incompatible).
 * @param actions Array of command IDs representing workflow action steps.
 * @returns Array of non-active command IDs.
 */
function checkWorkflowActions(actions: string[]): string[] {
    const badActions: string[] = [];

    for (let i = 0; i < actions.length; i++) {
        const commandId = actions[i];
        if (
            !commandsData.hasOwnProperty(commandId) ||
            !commandVersionCheck(commandsData[commandId])
        ) {
            badActions.push(commandId);
        }
    }

    return badActions;
}
