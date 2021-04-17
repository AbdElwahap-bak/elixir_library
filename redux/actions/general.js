export const GENERAL_ACTION_TYPES = {
  SET_IS_LOADING: "SET_IS_LOADING",
  SET_TIMEZONE_OFFSET: "SET_TIMEZONE_OFFSET",
  SET_IS_RTL: "SET_IS_RTL",
  SEND_REQUEST: "SEND_REQUEST",
  SET_CURRENT_USER: "CURRENT_USER",
  SET_CURRENT_PASSWORD: "CURRENT_PASSWORD",
  SET_IS_SESSION_INVALIDATED: "SET_IS_SESSION_INVALIDATED",
  GET_MAIN_MENU: "GET_MAIN_MENU",
  SET_SIDEBAR_COLLAPSED: "SET_SIDEBAR_COLLAPSED",
  SET_MAIN_MENU: "SET_MAIN_MENU",
  SET_FAVORITE_ITEMS: "SET_FAVORITE_ITEMS",
  UPLOAD_FILE: "UPLOAD_FILE",
  FETCH_FAVORITE_LIST: "FETCH_FAVORITE_LIST",
  SET_IS_DRAWER_OPEN: "SET_IS_DRAWER_OPEN"
};

export const setIsLoading = (isLoading) => ({ type: GENERAL_ACTION_TYPES.SET_IS_LOADING, isLoading });

export const setIsDrawerOpen = (isDrawerOpen) => ({ type: GENERAL_ACTION_TYPES.SET_IS_DRAWER_OPEN, isDrawerOpen });

export const setTimezoneOffset = (timeZoneOffset) => ({
  type: GENERAL_ACTION_TYPES.SET_TIMEZONE_OFFSET,
  timeZoneOffset,
});

export const setIsRTL = (isRTL) => ({ type: GENERAL_ACTION_TYPES.SET_IS_RTL, isRTL });

export const sendRequest = (options, context, auth, callback) => ({
  type: GENERAL_ACTION_TYPES.SEND_REQUEST,
  options,
  context,
  auth,
  callback,
});

export const setCurrentUser = (currentUser) => ({ type: GENERAL_ACTION_TYPES.SET_CURRENT_USER, currentUser });

export const setCurrentPassword = (currentPassword) => ({ type: GENERAL_ACTION_TYPES.SET_CURRENT_PASSWORD, currentPassword });

export const setIsSessionInvalidated = (isSessionInvalidated) => ({
  type: GENERAL_ACTION_TYPES.SET_IS_SESSION_INVALIDATED,
  isSessionInvalidated,
});

export const setSidebarCollapsed = (sidebarCollapsed) => ({
  type: GENERAL_ACTION_TYPES.SET_SIDEBAR_COLLAPSED,
  sidebarCollapsed,
});

export const setMainMenu = (mainMenu) => ({ type: GENERAL_ACTION_TYPES.SET_MAIN_MENU, mainMenu });

export const setFavoriteItems = (favorite) => ({ type: GENERAL_ACTION_TYPES.SET_FAVORITE_ITEMS, favorite });

export const login = (username, password, callback) => ({
  type: GENERAL_ACTION_TYPES.SEND_REQUEST,
  options: { tdlId: "login" },
  auth: { username, password },
  callback,
});

export const checkSession = (callback = null) => ({
  type: GENERAL_ACTION_TYPES.SEND_REQUEST,
  options: { tdlId: "checkSession" },
  context: { disableMessages: true },
  callback,
});

export const fetchMainMenu = () => ({
  type: GENERAL_ACTION_TYPES.SEND_REQUEST,
  options: { tdlId: "EDMS$$modeling$$-$$mainmenue", pageNumber: 0, rowsNumber: 1000000 },
  context: { withLoader: false, closeUsecase: true },
});

export const Logout = () => ({
  type: GENERAL_ACTION_TYPES.SEND_REQUEST,
  options: { tdlId: "logout" },
});

export const sendRefreshRequest = (usecaseId, vsLoader = true, callback = null) => ({
  type: GENERAL_ACTION_TYPES.SEND_REQUEST,
  options: { tdlId: "refresh" },
  context: { usecaseId, vsLoader },
  callback,
});

export const sendRefreshWithoutUpdate = (usecaseId, callback = null) => ({
  type: GENERAL_ACTION_TYPES.SEND_REQUEST,
  options: { tdlId: "refreshWithoutUpdate" },
  context: { usecaseId, vsLoader: true },
  callback,
});

export const fetchDashboard = (callback) => ({
  type: GENERAL_ACTION_TYPES.SEND_REQUEST,
  options: { tdlId: "CMS$$CMS$$-$$getUserDashBoards" },
  context: { withLoader: false, drawUsecaseId: false },
  callback,
});

export const fetchDashboardItems = (usecaseId, callback) => ({
  type: GENERAL_ACTION_TYPES.SEND_REQUEST,
  options: { tdlId: "CMS$$CMS$$com.elixir.cms.DashBoard.DashBoardSettings$$viewDashboardSetting" },
  context: { usecaseId, withLoader: false, closeUsecase: true, drawUsecaseId: false },
  callback,
});

export const closeUsecaseId = (usecaseId) => ({
  type: GENERAL_ACTION_TYPES.SEND_REQUEST,
  options: { tdlId: "closeUseCase" },
  context: { usecaseId },
});

export const SMSPagination = (usecaseId, pageNumber) => ({
  type: GENERAL_ACTION_TYPES.SEND_REQUEST,
  options: { tdlId: "search", pageNumber },
  context: { usecaseId, vsLoader: true, withLoader: false },
});

export const requestBackTo = (usecaseId, backToId) => ({
  type: GENERAL_ACTION_TYPES.SEND_REQUEST,
  options: { tdlId: "backTo", backtoId: backToId },
  context: { usecaseId, vsLoader: true, withLoader: false },
  
});

export const requestBack = (usecaseId, callback=undefined) => ({
  type: GENERAL_ACTION_TYPES.SEND_REQUEST,
  options: { tdlId: "back" },
  context: { usecaseId, vsLoader: true, withLoader: false },
  callback
});

export const executeAction = (usecaseId, tdlId, responseType, callback=undefined) => ({
  type: GENERAL_ACTION_TYPES.SEND_REQUEST,
  options: { tdlId },
  context: { usecaseId, responseType, vsLoader: true, withLoader: false },
  callback
});

export const exportReport = (usecaseId, format) => ({
  type: GENERAL_ACTION_TYPES.SEND_REQUEST,
  options: { tdlId: "export", exportFormat: format },
  context: { usecaseId, responseType: "blob", vsLoader: true, withLoader: false, autoDownload: true },
});

export const downloadFile = (usecaseId, autoDownload , callback) => ({
  type: GENERAL_ACTION_TYPES.SEND_REQUEST,
  options: { tdlId: "downloadFile" },
  context: { usecaseId, responseType: "blob", vsLoader: true, withLoader: false, autoDownload },
  callback
});

export const confirmAction = (usecaseId, tdlId) => ({
  type: GENERAL_ACTION_TYPES.SEND_REQUEST,
  options: { tdlId, isForced: true },
  context: { usecaseId, vsLoader: true },
});

export const askForPossibleValue = (usecaseId) => ({
  type: GENERAL_ACTION_TYPES.SEND_REQUEST,
  options: { tdlId: "getPVs" },
  context: { usecaseId, vsLoader: false, withLoader: false },
});

export const sendSearchRequest = (usecaseId, callback=undefined) => ({
  type: GENERAL_ACTION_TYPES.SEND_REQUEST,
  options: { tdlId: "search" },
  context: { usecaseId, vsLoader: true, withLoader: false },
  callback
});

export const flipCountMode = (usecaseId) => ({
  type: GENERAL_ACTION_TYPES.SEND_REQUEST,
  options: { tdlId: "flipCountMode" },
  context: { usecaseId, vsLoader: true, withLoader: false },
});

export const getRowsCount = (usecaseId) => ({
  type: GENERAL_ACTION_TYPES.SEND_REQUEST,
  options: { tdlId: "getRowsCount" },
  context: { usecaseId, vsLoader: true, withLoader: false },
});

export const applyFilter = (usecaseId) => ({
  type: GENERAL_ACTION_TYPES.SEND_REQUEST,
  options: { tdlId: "applyFilter" },
  context: { usecaseId, vsLoader: true, withLoader: false },
});

export const deleteFilter = (usecaseId, callback) => ({
  type: GENERAL_ACTION_TYPES.SEND_REQUEST,
  options: { tdlId: "deleteFilter" },
  context: { usecaseId, vsLoader: true, withLoader: false },
  callback,
});

export const saveFilter = (usecaseId, callback) => ({
  type: GENERAL_ACTION_TYPES.SEND_REQUEST,
  options: { tdlId: "saveFilter" },
  context: { usecaseId, vsLoader: true, withLoader: false },
  callback,
});

export const addToFavorite = (usecaseId, callback) => ({
  type: GENERAL_ACTION_TYPES.SEND_REQUEST,
  options: { tdlId: "addToFavorite" },
  context: { usecaseId, vsLoader: true, withLoader: false },
  callback,
});

export const removeFromFavorite = (usecaseId, callback) => ({
  type: GENERAL_ACTION_TYPES.SEND_REQUEST,
  options: { tdlId: "removeFromFavorite" },
  context: { usecaseId, vsLoader: true, withLoader: false },
  callback,
});

export const sendNewCollectionElement = (usecaseId, callback) => ({
  type: GENERAL_ACTION_TYPES.SEND_REQUEST,
  options: { tdlId: "newCollectionElement" },
  context: { usecaseId, vsLoader: true, withLoader: false },
  callback,
});

export const cancelCollectionElement = (usecaseId, callback) => ({
  type: GENERAL_ACTION_TYPES.SEND_REQUEST,
  options: { tdlId: "cancelCollectionElement" },
  context: { usecaseId, vsLoader: true, withLoader: false },
  callback,
});

export const requestCheckIntegrity = (usecaseId, callback) => ({
  type: GENERAL_ACTION_TYPES.SEND_REQUEST,
  options: { tdlId: "integrityCheck" },
  context: { usecaseId, vsLoader: true, withLoader: false },
  callback,
});

export const fetchFavoriteList = () => ({
  type: GENERAL_ACTION_TYPES.SEND_REQUEST,
  options: { tdlId: "CMS$$CMS$$-$$favouriteMenu", pageNumber: 0, rowsNumber: 1000000 },
  context: { withLoader: false, closeUsecase: true },
});

export const uploadFile = (usecaseId, file, path, callback = null) => ({
  type: GENERAL_ACTION_TYPES.UPLOAD_FILE,
  usecaseId,
  file,
  path,
  callback,
});


