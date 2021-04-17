import { GENERAL_ACTION_TYPES } from "../actions/general";

const INITIAL_STATE = {
  isLoading: false,
  isDrawerOpen: false,
  isRTL: true,
  timeZoneOffset: null,
  currentUser: null,
  isSessionInvalidated: true,
  sidebarCollapsed: true,
  mainMenu: [],
  favorite: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GENERAL_ACTION_TYPES.SET_IS_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case GENERAL_ACTION_TYPES.SET_IS_DRAWER_OPEN:
      return {
        ...state,
        isDrawerOpen: action.isDrawerOpen,
      };
    case GENERAL_ACTION_TYPES.SET_TIMEZONE_OFFSET:
      return {
        ...state,
        timeZoneOffset: action.timeZoneOffset,
      };
    case GENERAL_ACTION_TYPES.SET_IS_RTL:
      return {
        ...state,
        isRTL: action.isRTL,
      };
    case GENERAL_ACTION_TYPES.SET_IS_SESSION_INVALIDATED:
      return {
        ...state,
        isSessionInvalidated: action.isSessionInvalidated,
      };
    case GENERAL_ACTION_TYPES.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.currentUser,
      };
      case GENERAL_ACTION_TYPES.SET_CURRENT_PASSWORD:
      return {
        ...state,
        currentPassword: action.currentPassword,
      };
    case GENERAL_ACTION_TYPES.SET_SIDEBAR_COLLAPSED:
      return {
        ...state,
        sidebarCollapsed: action.sidebarCollapsed,
      };
    case GENERAL_ACTION_TYPES.SET_MAIN_MENU:
      return {
        ...state,
        mainMenu: action.mainMenu,
      };
    case GENERAL_ACTION_TYPES.SET_FAVORITE_ITEMS:
      return {
        ...state,
        favorite: action.favorite,
      };
    default:
      return state;
  }
};
