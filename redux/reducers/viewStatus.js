import { VIEW_STATUS_ACTIONS } from "../actions/viewStatus";

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  // eslint-disable-next-line no-nested-ternary
  const currentViewStatus = action.usecaseId ? state[action.usecaseId] : null;

  switch (action.type) {
    case VIEW_STATUS_ACTIONS.NEW_VIEW_STATUS:
      return {
        ...state,
        [action.viewStatus.usecaseId]: action.viewStatus,
      };
    case VIEW_STATUS_ACTIONS.REMOVE_VIEW_STATUS:
      return {
        ...state,
        [action.usecaseId]: null,
      };
    case VIEW_STATUS_ACTIONS.RESET_VIEW_STATUSES:
      return { ...INITIAL_STATE };
    case VIEW_STATUS_ACTIONS.SET_CURRENT_OBJECT_PATH:
      currentViewStatus.setCurrentObjectPath(action.pk);
      break;
    case VIEW_STATUS_ACTIONS.CHANGE_VS_LOADING:
      if (currentViewStatus) currentViewStatus.isLoading = action.isLoading;
      break;
    case VIEW_STATUS_ACTIONS.SET_OBJECT:
      currentViewStatus.setObjectWithPath(action.path, action.value);
      break;
    case VIEW_STATUS_ACTIONS.SET_CURRENT_KEY_FOCUS:
      currentViewStatus.setCurrentKeyFocus(action.currentKeyFocus);
      break;
    case VIEW_STATUS_ACTIONS.SET_CURRENT_KEY_VALUE:
      currentViewStatus.setCurrentKeyValue(action.currentKeyValue);
      break;
    case VIEW_STATUS_ACTIONS.SET_SEARCH_CRITERIA_VALUE:
      currentViewStatus.setSearchCriteriaValue(action.keyName, action.value);
      break;
    case VIEW_STATUS_ACTIONS.SET_SEARCH_CRITERIA_OPERATOR:
      currentViewStatus.setSearchCriteriaOperator(action.keyName, action.op);
      break;
    case VIEW_STATUS_ACTIONS.SET_SORT_KEY:
      currentViewStatus.setSortKey(action.sortKey);
      break;
    case VIEW_STATUS_ACTIONS.SET_FILTER_NAME:
      currentViewStatus.filterName = action.filterId;
      break;
    case VIEW_STATUS_ACTIONS.SET_CURRENT_FILTER_INFO:
      currentViewStatus.filterInfo = { ...currentViewStatus.filterInfo, ...action.filterInfo };
      break;
    case VIEW_STATUS_ACTIONS.SET_SELECTED_OBJECTS:
      currentViewStatus.setSelectedObjects(action.selectedObjects);
      break;
    case VIEW_STATUS_ACTIONS.CHANGE_FAVORITE_NAME:
      currentViewStatus.favoriteItemInfo.label = action.favoriteName;
      break;
    default:
      return state;
  }
  return {
    ...state,
    [action.usecaseId]: currentViewStatus,
  };
};
