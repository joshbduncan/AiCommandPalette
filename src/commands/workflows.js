/**
 * Check is any workflow actions are currently non-active (non deleted, and Ai version compatible).
 * @param   {Array} actions Workflow action steps to check.
 * @returns {Array}         Non-active workflow action.
 */
function checkWorkflowActions(actions) {
  var badActions = [];
  for (var i = 0; i < actions.length; i++) {
    command = actions[i];
    if (!commandsData.hasOwnProperty(actions[i]) || !commandVersionCheck(actions[i]))
      badActions.push(actions[i]);
  }
  return badActions;
}
