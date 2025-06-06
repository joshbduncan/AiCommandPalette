interface UserActions {
  loadedActions: boolean;
  load(): void;
}

const userActions: UserActions = {
  loadedActions: false,

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
      actionCount = Number(pref.getIntegerPreference(`${currentPath}actionCount`));
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
