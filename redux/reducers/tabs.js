import 'react-native-get-random-values';
import { v4 as uuidv4 } from "uuid";
import { TABS_ACTIONS_TYPES } from "../actions/tabs";

const INITIAL_STATE = {
  tabs: [
    {
      id: "popup",
      usecaseId: null,
      mainTab: false,
    },
  ],
  currentActiveTab: "home",
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TABS_ACTIONS_TYPES.NEW_TAB:
      // eslint-disable-next-line no-case-declarations
      const tabId = `${action.id || uuidv4()}`;
      return {
        ...state,
        currentActiveTab: action.mainTab ? tabId : state.currentActiveTab,
        tabs: [...state.tabs, { id: tabId, usecaseId: action.usecaseId, mainTab: action.mainTab }],
      };
    case TABS_ACTIONS_TYPES.CHANGE_TAB_VS:
      // eslint-disable-next-line no-case-declarations
      const currentTabIndex = state.tabs.findIndex((item) => item.id === action.id);
      // eslint-disable-next-line no-case-declarations
      const newTabsAfterChange = state.tabs;
      newTabsAfterChange[currentTabIndex].usecaseId = action.usecaseId;
      return {
        ...state,
        tabs: [...newTabsAfterChange],
      };
    case TABS_ACTIONS_TYPES.CHANGE_ACTIVE_TAB:
      return {
        ...state,
        currentActiveTab: action.id,
      };
    case TABS_ACTIONS_TYPES.CLOSE_TAB:
      // eslint-disable-next-line no-case-declarations
      let newTabsAfterClose = state.tabs;
      if (action.id === "popup") {
        const index = newTabsAfterClose.findIndex((item) => item.id === action.id);
        newTabsAfterClose[index].usecaseId = null;
      } else {
        newTabsAfterClose = state.tabs.filter((item) => item.id !== action.id);
      }
      return {
        ...state,
        tabs: [...newTabsAfterClose],
        currentActiveTab: state.currentActiveTab === action.id ? "home" : state.currentActiveTab,
      };
    case TABS_ACTIONS_TYPES.CLOSE_ALL_TABS:
      return { ...INITIAL_STATE };
    default:
      return state;
  }
};
