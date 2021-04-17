import { takeEvery, put, call, all, select } from "redux-saga/effects";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import * as FileSystem from "expo-file-system";
import base64 from "react-native-base64";
import { REACT_APP_DEFAULT_FETCH } from "./../../config/options";
import {
  GENERAL_ACTION_TYPES,
  setIsLoading,
  setCurrentUser,
  setIsSessionInvalidated,
  setIsRTL,
  setTimezoneOffset,
  updateViewStatus,
  createNewTab,
  changeTabVS,
  removeUsecase,
  changeUsecaseIsLoading,
  closeUsecaseId,
  closeAllTabs,
  resetViewStatuses,
  setFavoriteItems,
  setMainMenu,
  sendRefreshWithoutUpdate,
} from "../actions";
import { cloneDeep, transformMainMenu } from "../../helpers/util";
import { sendRequest, uploadFile } from "../../service/stub";
import { showNotification, showWarning } from "../../config/notifications";
import ViewStatus from "../../helpers/viewstatus";
import {
  setFavoriteItems as setLocalFavoriteItems,
  setMainMenu as setLocalMainMenuItems,
} from "../../service/localStorage";
import { getTranslation } from "../../labels";

function* sendRequestSaga({ options = {}, context = {}, auth = {}, callback = () => { } }) {
  try {
    console.log("starting sendRequestSaga");
    const {
      usecaseId,
      withLoader,
      drawUsecaseId = true,
      newTab = false,
      vsLoader,
      autoDownload = true,
      mainTab = true,
      tabId: targetTabId,
    } = context;

    const { tdlId } = options;
    let { username, password } = auth;
    console.log("auth");
    console.log(auth);
    if (!username) {
      const user = yield select((state) => state.general.currentUser);
      console.log("getting username from store");
      console.log(user);
      if (user) username = user.username;
    }

    if (!password) {
      password = yield select((state) => state.general.currentPassword);
      if (password && password.currentPassword) password = password.currentPassword;
      console.log("getting password from store");
      console.log(password);
    }
    const tabs = yield select((state) => state.tabs.tabs);
    const currentActiveTab = yield select((state) => state.tabs.currentActiveTab);

    yield put(setIsLoading(typeof withLoader === "boolean" ? withLoader : !usecaseId));

    const headers = {};
    let requestData = {
      pageNumber: 0,
      pageSize: Number(REACT_APP_DEFAULT_FETCH || 15),
      ...options,
    };

    if (username && password) {
      console.log("setting username and password");
      headers.authorization = `Basic${base64.encode(unescape(encodeURIComponent(`${username}:${password}`)))}`;
    }

    let oldVS = null;
    if (usecaseId) {
      oldVS = yield select((state) => state.viewStatus[usecaseId]);
      if (oldVS) {
        console.log("oldVS");
        console.log(oldVS.newValue);
        yield put(changeUsecaseIsLoading(oldVS.usecaseId, typeof vsLoader === "boolean" ? vsLoader : false));
        requestData = { ...requestData, ...oldVS.getRequestBody(options) };
      }
    }

    if (tdlId === "export" || tdlId === "downloadFile" || context.responseType === "blob") {
      headers["Content-Type"] = "blob";
    }

    let response = null;
    console.log("requestData");
    console.log(requestData);

    console.log("headers");
    console.log(headers);
    try {
      response = yield call(sendRequest, requestData, headers);
      console.log({ response })
    } catch (e) {
      console.log("ERRROR while sending Request");
      console.log(e);
      if (!e.response || typeof e.response.data === "string") {
        showNotification({
          message: getTranslation("error"),
          description: getTranslation("networkError"),
          type: "error",
        });
        yield put(setIsLoading(false));
        if (oldVS) {
          yield put(changeUsecaseIsLoading(oldVS.usecaseId, false));
          console.log("oldVS in response");
          console.log(oldVS.newValue);
        }
        if (callback) yield call(callback, null);
        return;
      }
      response = e.response;
    }

    if (headers["Content-Type"] === "blob") {
      yield all([put(setIsLoading(false)), put(changeUsecaseIsLoading(oldVS.usecaseId, false))]);
      if (autoDownload) {
        const fileName = response.headers["content-disposition"]
          .split(";")
          .find((item) => item.includes("filename"))
          .trim()
          .split('"')
          .join("")
          .split("filename=")[1];
        const downloadUrl = URL.createObjectURL(response.data);
        const downloadCallback = (downloadProgress) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          this.setState({
            downloadProgress: progress,
          });
        };
        const downloadResumable = FileSystem.createDownloadResumable(
          downloadUrl,
          FileSystem.documentDirectory + fileName,
          {},
          downloadCallback,
        );

        try {
          yield downloadResumable.downloadAsync();
          // console.log('Finished downloading to ', uri);
        } catch (e) {
          // console.error(e);
        }
      }
      if (callback) yield call(callback, response);
      return;
    }

    const {
      isSessionInvalidated,
      isRTL,
      timeZoneOffset,
      userName: responseUsername,
      agency,
      data,
      output,
    } = response.data;

    if (!context.disableMessages) {
      const { errorMessages, successMessages, warningMessages } = output;
      errorMessages.map((item) =>
        showNotification({
          message: item.title,
          description: item.message || getTranslation(`error${response.status}`),
          type: "error",
        }),
      );
      successMessages.map((item) =>
        showNotification({ message: item.title, description: item.message, type: "success" }),
      );
      warningMessages.map((item) => {
        showWarning(item, requestData.tdlId, context.usecaseId);
      });
    }
    // console.log("response===================")
    // console.log(response)
    if (response.status === 500) {
      yield put(setIsLoading(false));
      return;
    }

    if (options.tdlId === "CMS$$CMS$$-$$favouriteMenu") {
      const favoriteItems = data.diffObject;
      yield put(setFavoriteItems(favoriteItems.filter((item) => item.newTdlId && !item.newTdlId.startsWith("%"))));
      const currentUser = yield select((state) => state.general.currentUser);
      setLocalFavoriteItems(currentUser, favoriteItems);
    } else if (options.tdlId === "EDMS$$modeling$$-$$mainmenue") {
      const mainMenuItems = transformMainMenu(data.diffObject);
      yield put(setMainMenu(mainMenuItems));
      const currentUser = yield select((state) => state.general.currentUser);
      setLocalMainMenuItems(currentUser, mainMenuItems);
    }

    let vs = null;
    let currentTab = null;
    let backAction = false;
    let changeCurrent = false;
    let usecaseIdToClose = null;
    if (data) {
      let newVS = null;
      if (data && data.usecaseId) {
        newVS = yield select((state) => state.viewStatus[data.usecaseId]);
      }

      // We will generate a Random ID for the tab in case we needed it , it can change below
      let tabId = targetTabId || uuidv4();

      // If we don't want to draw new tab anyway
      if (!newTab && !targetTabId) {
        // If we have a newVS that means that we have current tab for the VS already , so tabId = vs tabI
        if (newVS) {
          tabId = newVS.tabId;
          changeCurrent = true;
          // If we have an oldVs we will use the same tabId
        } else if (oldVS) {
          tabId = oldVS.tabId;
          changeCurrent = true;
          // If we don't have a newVs and we don't have oldVs but we want to render it as mainTab so check if there is a current active tab to set it to
        } else if (mainTab) {
          currentTab = tabs.find((item) => item.id === currentActiveTab);
          if (currentTab) {
            tabId = currentActiveTab;
            changeCurrent = true;
          }
        }
      }

      // Is no Old view status then it's new tdlId
      if (!oldVS) {
        vs = new ViewStatus(requestData, response.data);
        vs.tabId = tabId;
        usecaseIdToClose = currentTab && currentTab.usecaseId;
      }
      // Id there is oldVS and no newVS then it's forward
      else if (!newVS) {
        vs = new ViewStatus(requestData, response.data);
        vs.tabId = tabId;
        vs.callerUsecaseId = oldVS.usecaseId;
        vs.callersLabelsArray = [...oldVS.callersLabelsArray, { tdlLabel: oldVS.tdlLabel, usecaseId: oldVS.usecaseId }];
      }
      // If oldVS and newVS are the same
      else if (oldVS.usecaseId === newVS.usecaseId) {
        vs = cloneDeep(newVS);
        vs.dealWithSuccess(requestData, response.data);
      }
      // If oldVS and newVS then and there are not the same then it's back
      else {
        vs = cloneDeep(newVS);
        vs.dealWithSuccess(requestData, response.data);
        backAction = true;
      }
    }

    if (tdlId === "closeUseCase" || context.closeUsecase) {
      if (oldVS) {
        usecaseIdToClose = context.closeUsecase ? oldVS.usecaseId : null;
        yield put(removeUsecase(oldVS.usecaseId));
        oldVS = null;
      }
      if (vs) {
        usecaseIdToClose = context.closeUsecase ? vs.usecaseId : null;
        yield put(removeUsecase(vs.usecaseId));
        vs = null;
      }
    }

    const isPopup = vs && vs.isPopUp();
    if (isPopup) {
      vs.tabId = "popup";
    }
    console.log("before final yield");
    console.log(JSON.stringify({ username: '"' + responseUsername + '"', agency }));
    yield all([
      put(setIsLoading(false)),
      put(setCurrentUser({ username: '"' + responseUsername + '"', agency })),
      put(setIsSessionInvalidated(isSessionInvalidated)),
      put(setIsRTL(isRTL)),
      put(setTimezoneOffset(timeZoneOffset)),
      vs && put(updateViewStatus(vs)),
      oldVS && put(changeUsecaseIsLoading(oldVS.usecaseId, false)),
      isSessionInvalidated && put(closeAllTabs()),
      isSessionInvalidated && put(resetViewStatuses()),
      backAction && put(removeUsecase(oldVS.usecaseId)),
      vs && drawUsecaseId && !changeCurrent && put(createNewTab(vs.usecaseId, vs.tabId, isPopup ? false : mainTab)),
      changeCurrent && drawUsecaseId && vs && put(changeTabVS(vs.usecaseId, vs.tabId)),
      usecaseIdToClose && put(closeUsecaseId(usecaseIdToClose)),
      callback && call(callback, { response, vs }),
    ]);
  } catch (e) {
    console.log("error in sagas general while sending request and getting response from server")
    // console.log("the request tdlID is "+tdlId)
    console.log("the exception is ")
    console.log(e)
  }
}

function* uploadFileSaga({ usecaseId, file, path }) {
  yield put(changeUsecaseIsLoading(usecaseId, true));
  const formData = new FormData();
  formData.append("upload", file);
  formData.append("useCaseId", usecaseId);
  formData.append("fieldPath", path);
  const params = {
    fieldPath: path,
    useCaseId: usecaseId,
  };
  try {
    yield call(uploadFile, formData, params);
    yield put(sendRefreshWithoutUpdate(usecaseId));
  } catch (e) {
    showNotification({ message: getTranslation("errorUpload"), description: e.message });
  } finally {
    yield put(changeUsecaseIsLoading(usecaseId, true));
  }
}

export default [
  takeEvery(GENERAL_ACTION_TYPES.SEND_REQUEST, sendRequestSaga),
  takeEvery(GENERAL_ACTION_TYPES.UPLOAD_FILE, uploadFileSaga),
];
