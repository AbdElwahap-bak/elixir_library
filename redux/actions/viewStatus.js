export const VIEW_STATUS_ACTIONS = {
  NEW_VIEW_STATUS: "NEW_VIEW_STATUS",
  SET_CURRENT_OBJECT_PATH: "SET_CURRENT_OBJECT_PATH",
  REMOVE_VIEW_STATUS: "REMOVE_VIEW_STATUS",
  CHANGE_VS_LOADING: "CHANGE_VS_LOADING",
  SET_OBJECT: "SET_OBJECT",
  SET_CURRENT_KEY_FOCUS: "SET_CURRENT_KEY_FOCUS",
  SET_CURRENT_KEY_VALUE: "SET_CURRENT_KEY_VALUE",
  SET_SEARCH_CRITERIA_VALUE: "SET_SEARCH_CRITERIA_VALUE",
  SET_SEARCH_CRITERIA_OPERATOR: "SET_SEARCH_CRITERIA_OPERATOR",
  SET_SORT_KEY: "SET_SORT_KEY",
  SET_FILTER_NAME: "SET_FILTER_NAME",
  SET_CURRENT_FILTER_INFO: "SET_CURRENT_FILTER_INFO",
  RESET_VIEW_STATUSES: "RESET_VIEW_STATUSES",
  SET_SELECTED_OBJECTS: "SET_SELECTED_OBJECTS",
  CHANGE_FAVORITE_NAME: "CHANGE_FAVORITE_NAME",
};

export const updateViewStatus = (viewStatus) => ({ type: VIEW_STATUS_ACTIONS.NEW_VIEW_STATUS, viewStatus });

export const setCurrentObjectPath = (usecaseId, pk) => ({
  type: VIEW_STATUS_ACTIONS.SET_CURRENT_OBJECT_PATH,
  pk,
  usecaseId,
});

export const removeUsecase = (usecaseId) => ({
  type: VIEW_STATUS_ACTIONS.REMOVE_VIEW_STATUS,
  usecaseId,
});

export const changeUsecaseIsLoading = (usecaseId, isLoading) => ({
  type: VIEW_STATUS_ACTIONS.CHANGE_VS_LOADING,
  usecaseId,
  isLoading,
});

export const setObject = (usecaseId, path, value) => ({
  type: VIEW_STATUS_ACTIONS.SET_OBJECT,
  usecaseId,
  path,
  value,
  deepClone: false,
});

export const setCurrentKeyFocus = (usecaseId, currentKeyFocus) => ({
  type: VIEW_STATUS_ACTIONS.SET_CURRENT_KEY_FOCUS,
  usecaseId,
  currentKeyFocus,
});

export const setCurrentKeyValue = (usecaseId, currentKeyValue) => ({
  type: VIEW_STATUS_ACTIONS.SET_CURRENT_KEY_VALUE,
  usecaseId,
  currentKeyValue,
});

export const setSearchCriteriaValue = (usecaseId, keyName, value) => ({
  type: VIEW_STATUS_ACTIONS.SET_SEARCH_CRITERIA_VALUE,
  usecaseId,
  keyName,
  value,
});

export const setSearchCriteriaOperator = (usecaseId, keyName, op) => ({
  type: VIEW_STATUS_ACTIONS.SET_SEARCH_CRITERIA_OPERATOR,
  usecaseId,
  keyName,
  op,
});

export const setSortKey = (usecaseId, sortKey) => ({
  type: VIEW_STATUS_ACTIONS.SET_SORT_KEY,
  usecaseId,
  sortKey,
});

export const setFilterName = (usecaseId, filterId) => ({
  type: VIEW_STATUS_ACTIONS.SET_FILTER_NAME,
  usecaseId,
  filterId,
});

export const setCurrentFilterInfo = (usecaseId, filterInfo) => ({
  type: VIEW_STATUS_ACTIONS.SET_CURRENT_FILTER_INFO,
  usecaseId,
  filterInfo,
});

export const setSelectedObjects = (usecaseId, selectedObjects) => ({
  type: VIEW_STATUS_ACTIONS.SET_SELECTED_OBJECTS,
  usecaseId,
  selectedObjects,
});

export const changeFavoriteName = (usecaseId, favoriteName) => ({
  type: VIEW_STATUS_ACTIONS.CHANGE_FAVORITE_NAME,
  usecaseId,
  favoriteName,
});

export const resetViewStatuses = () => ({
  type: VIEW_STATUS_ACTIONS.RESET_VIEW_STATUSES,
});
