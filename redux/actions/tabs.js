export const TABS_ACTIONS_TYPES = {
  NEW_TAB: "NEW_TAB",
  CHANGE_TAB_VS: "CHANGE_TAB_VS",
  CHANGE_ACTIVE_TAB: "CHANGE_ACTIVE_TAB",
  CLOSE_TAB: "CLOSE_TAB",
  CLOSE_ALL_TABS: "CLOSE_ALL_TABS",
};

export const createNewTab = (usecaseId, id = null, mainTab = true) => ({
  type: TABS_ACTIONS_TYPES.NEW_TAB,
  id,
  usecaseId,
  mainTab,
});

export const changeTabVS = (usecaseId, id) => ({ type: TABS_ACTIONS_TYPES.CHANGE_TAB_VS, id, usecaseId });

export const changeActiveTab = (id) => ({ type: TABS_ACTIONS_TYPES.CHANGE_ACTIVE_TAB, id });

export const closeTab = (id) => ({ type: TABS_ACTIONS_TYPES.CLOSE_TAB, id });

export const closeAllTabs = () => ({ type: TABS_ACTIONS_TYPES.CLOSE_ALL_TABS });