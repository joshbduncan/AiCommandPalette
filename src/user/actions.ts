interface UserActions {
    loadedActions: boolean;
    load(): void;
}

const userActions: UserActions = {
    loadedActions: false,

    /**
     * Load all user-installed Illustrator actions into the command data model.
     *
     * This method reads action sets from Illustrator's preferences and creates
     * a command entry for each action. Actions are accessed via the app.preferences
     * API under the "plugin/Action/SavedSets" path. The loaded actions can then
     * be executed via the command palette.
     *
     * After loading, the `loadedActions` flag is set to true if any actions were found.
     */
    load(): void {
        logger.log("loading user actions");

        let ct = 0;
        let currentPath: string;
        let set: string;
        let actionCount: number;
        let name: string;

        const pref = app.preferences;
        const path = "plugin/Action/SavedSets/set-";

        for (let i = 1; i <= 100; i++) {
            currentPath = `${path}${i}/`;

            // get action set
            set = pref.getStringPreference(`${currentPath}name`);
            if (!set) break;

            // get actions in set
            actionCount = Number(
                pref.getIntegerPreference(`${currentPath}actionCount`)
            );
            ct += actionCount;

            for (let j = 1; j <= actionCount; j++) {
                name = pref.getStringPreference(`${currentPath}action-${j}/name`);
                let id = generateCommandId(`action_${set}_${name.toLowerCase()}`);
                id = `${set}_${name}`; // FIXME: why?

                const obj: Command = {
                    id,
                    action: "action",
                    type: "action",
                    set,
                    name,
                    docRequired: false,
                    selRequired: false,
                    hidden: false,
                };

                commandsData[id] = obj;
            }
        }

        this.loadedActions = ct > 0;
    },
};
