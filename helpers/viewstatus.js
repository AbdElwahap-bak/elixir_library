import _ from "lodash";
import * as Util from "./util";
import * as Comparer from "./compareobjects";
import * as Updater from "./updateobjectclient";

export default class ViewStatus {
  constructor(requestData, response) {
    this.isLoading = false;
    this.barButtonsCount = null;
    this.oldValue = {};
    this.newValue = {};
    this.oldResult = [];
    this.newResult = [];
    this.tdl = {};
    this.tdlLabel = null;
    this.tdlKeys = {};
    this.tdlSKeys = {};
    this.output = { successMessages: [], errorMessages: [], warningMessages: [] };
    this.usecaseId = response.data.usecaseId;
    this.backtoId = null;
    this.tdlId = null;
    this.searchCriteria = {};
    this.selectedObjects = [];
    this.currKeyFocus = null;
    this.currKeyValue = null;
    this.pageNumber = 0;
    this.rowsNumber = Number(process.env.REACT_APP_DEFAULT_FETCH);
    this.count = 0;
    this.rowsColor = {};
    this.currObjectPath = "";
    this.calledUsecaseId = null;
    this.callerUsecaseId = null;
    this.isPopupOutlet = null;
    this.outletContainerId = null;
    this.outletId = null;
    this.isBlocked = true;
    this.selectedObject = {};
    this.unCalculatedRowsNum = -1;
    this.responseCode = 200;
    this.automaticCountMode = false;
    this.drawInNewTab = null;
    this.isClosedFromServer = false;
    /**
     * This indicates if we should send refresh to this usecase on drawing the outlet
     */
    this.needRefresh = false;
    /**
     * Indicated wheater we should open a new tab for the usecases or it's just a window outlet
     */
    this.isMainOutlet = null;
    /**
     * search bar visible
     */
    this.searchBarVisible = false;
    this.searchBarFixed = false;

    this.exportFormat = "EXCEL";

    this.searchBarMode = "horizontal";

    this.callersLabelsArray = [];

    this.filterName = null;
    this.filterInfo = {
      name: "",
      isDefault: false,
    };

    this.favoriteItemInfo = { pk: undefined, label: undefined };
    this.mainTdlId = null;

    // Max page number for sms navigation
    this.maxPageNumber = 1;
    this.maxRowsSize = 0;

    this.hasServerFilter = null;

    this.currentUploadingObject = {
      isUploading: false,
      percentage: 0,
    };

    this.dealWithSuccess(requestData, response);
  }

  changeTdlKeysFormat(tdlKeys, keyTdl) {
    if (tdlKeys._isSimple_ === true && tdlKeys._isAssociation_ === false) {
      keyTdl.keyType = "Simple";
      keyTdl.isAssociation = false;
    } else if (tdlKeys._isAssociation_ === true) {
      keyTdl.keyType = "Composition";
      keyTdl.isAssociation = true;
    } else if (keyTdl.keyType !== "Collection") {
      keyTdl.keyType = "Composition";
      keyTdl.isAssociation = false;
    }

    Object.keys(tdlKeys).map((key) => {
      if (key !== "_isSimple_" && key !== "_isAssociation_") {
        if (key === "*") {
          keyTdl.keyType = "Collection";
          this.changeTdlKeysFormat(tdlKeys[key], keyTdl);
        } else {
          if (keyTdl.subKeys === undefined) {
            keyTdl.subKeys = {};
          }
          keyTdl.subKeys[key] = { name: key };
          this.changeTdlKeysFormat(tdlKeys[key], keyTdl.subKeys[key]);
        }
      }
    });
  }

  getUpdatedValues() {
    const modifiedObject = {};
    if (this.tdl.type === "SMS") {
      Comparer.updatedKeys(this.newResult, this.oldResult, this.tdlKeys, modifiedObject);
      return modifiedObject;
    }
    Comparer.updatedKeys(this.newValue, this.oldValue, this.tdlKeys, modifiedObject);
    return modifiedObject;
  }

  getObject(path, type) {
    if (this.tdl.type === "SMS") {
      return Util.getObjectUsingTdlKeys(this.newResult, path, this.tdlKeys);
    }
    return Util.getObjectUsingTdlKeys(this.newValue, path, this.tdlKeys);
  }

  setObjectWithPath(path, value) {
    if (this.tdl.type === "SMS") {
      if (path === "*") {
        this.newResult = value;
      } else {
        this.newResult = { ...this.newResult };
        Util.setObjectWithPath(path, this.newResult, value);
      }
    } else if (path === "") {
      this.newValue = value;
    } else {
      this.newValue = { ...this.newValue };
      Util.setObjectWithPath(path, this.newValue, value);
    }
  }

  getTdlWithPath(path) {
    return Util.getTdlWithPath(path, this.tdl);
  }

  getRequestBody(options) {
    const diffObject = this.getUpdatedValues();
    options.usecaseId = options.usecaseId === undefined ? this.usecaseId : options.usecaseId;
    options.backtoId = options.backtoId === undefined ? this.backtoId : options.backtoId;
    options.object = options.object === undefined ? diffObject : options.object;
    options.tdlId = options.tdlId === undefined ? this.tdlId : options.tdlId;
    options.selectedObjects =
      options.selectedObjects === undefined ? this.prepareSelectedObjects() : options.selectedObjects;
    options.condition = options.condition === undefined ? this.searchCriteria : options.condition;
    options.currentKeyFocus =
      options.currentKeyFocus === undefined ? this.currKeyFocus : options.currentKeyFocus;
    options.currentKeyValue =
      options.currentKeyValue === undefined ? this.currKeyValue : options.currentKeyValue;
    options.pageNumber = options.pageNumber === undefined ? this.pageNumber : options.pageNumber;
    options.rowsNumber = options.rowsNumber === undefined ? this.rowsNumber : options.rowsNumber;
    options.currentObjectPath =
      options.currentObjectPath === undefined ? this.currObjectPath : options.currentObjectPath;
    options.exportFormat = options.exportFormat === undefined ? this.exportFormat : options.exportFormat;
    options.filterName = options.filterName === undefined ? this.filterName : options.filterName;
    options.filterInfo = options.filterInfo === undefined ? this.filterInfo : options.filterInfo;
    options.favoriteItemInfo =
      options.favoriteItemInfo === undefined ? this.favoriteItemInfo : options.favoriteItemInfo;
    return options;
  }

  prepareSelectedObjects() {
    if (!this.selectedObjects) {
      return [];
    }
    const result = [];
    this.selectedObjects.map((element) => {
      if (typeof element === "string") {
        result.push(element);
      } else {
        result.push(element.pk);
      }
    });
    return result;
  }

  dealWithSuccess(requestData, response) {
    const {
      usecaseId,
      diffTDL,
      count,
      rowsColor,
      automaticCountMode,
      scObject,
      hasServerFilter,
      filter,
    } = response.data;
    const { errorMessages, warningMessages, successMessages } = response.output;
    this.usecaseId = usecaseId;
    this.tdlLabel = diffTDL.tdlLabel ? diffTDL.tdlLabel : this.tdlLabel;
    this.count = count;
    this.rowsColor = rowsColor;
    this.automaticCountMode = automaticCountMode;
    this.hasServerFilter = hasServerFilter;
    this.maxPageNumber = requestData.pageNumber + 1;
    this.rowsNumber = requestData.pageSize;
    this.favoriteItemInfo = { label: diffTDL.tdlLabel, pk: null };

    if (scObject) {
      Object.keys(response.data.scObject).map((keyName) => {
        this.setSearchCriteriaValue(keyName, response.data.scObject[keyName]);
      });
    }

    /* if (response.data.diffTDL.sortKeys != null && response.data.diffTDL.sortKeys != undefined) {
      for (let key in response.data.diffTDL.sortKeys) {
        const sortKey = response.data.diffTDL.sortKeys[key];
        if (sortKey.isDefault === 'true' && !this.getSortKey()) {
          this.setSortKey({ name: sortKey.name, label: sortKey.label, direction: sortKey.direction });
        }
      }
    } */

    // update the tdl
    Updater.updateTdlComposite(response.data.diffTDL, this.tdl);
    // get the tdl keys in the right format

    this.barButtonsCount = this.tdl.type === "SMS" ? 3 : 8;

    if (_.isEmpty(this.tdlKeys)) {
      this.changeTdlKeysFormat(response.data.diffTDL.tdlKeys, this.tdlKeys);
    }

    if (_.isEmpty(this.tdlSKeys)) {
      this.changeTdlKeysFormat(response.data.diffTDL.SKeys, this.tdlSKeys);
      this.tdlSKeys.keyType = "Composition";
    }

    // update the result if SMS
    if (this.tdl.type === "SMS") {
      this.tdlKeys.keyType = "Collection";
      Updater.update(response.data.diffObject, this.newResult, this.tdlKeys);
    } else if (this.tdl.type === "CEV") {
      // update the object if CEV
      Updater.update(response.data.diffObject, this.newValue, this.tdlKeys);
    }

    // clone the object as an old value for future comparing
    this.oldValue = Util.cloneDeep(this.newValue);
    this.oldResult = Util.cloneDeep(this.newResult);

    successMessages.map((item) => this.output.successMessages.push(item));
    errorMessages.map((item) => this.output.errorMessages.push(item));
    warningMessages.map((item) => this.output.warningMessages.push(item));

    // Set default search keys
    if (this.tdl.type === "SMS" && !this.searchCriteria.searchCriteriaKeys) {
      this.searchCriteria.searchCriteriaKeys = {};
      const sKeys = this.tdl.SGroups[0].keys;
      if (sKeys) {
        sKeys.map((key) => {
          if (key.operators) {
            const defaultToSet = Object.keys(key.operators).find((i) => key.operators[i][0] === "%") || 1;
            this.setSearchCriteriaOperator(key.keyName, {
              name: key.operators[defaultToSet][0],
              code: key.operators[defaultToSet][1],
            });
          }
        });
      }
    }

    // Set default sortKey
    if (filter) {
      this.searchCriteria.searchCriteriaKeys = {
        ...this.searchCriteria.searchCriteriaKeys,
        ...filter.searchCriteriaKeys,
      };
      if (this.tdl.sortKeys && filter.sortKeys && Object.keys(filter.sortKeys).length > 0) {
        this.setSortKey(this.tdl.sortKeys[Object.keys(filter.sortKeys)[0]]);
      }
    }

    if (this.tdl.type === "SMS") {
      if (this.calculatedRowsNum()) {
        this.maxRowsSize = this.count;
      }
      if (this.newResult.length < this.rowsNumber) {
        this.maxRowsSize = this.rowsNumber * this.maxPageNumber;
      } else {
        this.maxRowsSize = this.rowsNumber * this.maxPageNumber + 1;
      }
    }
  }

  hasWarningMessage() {
    return this.output.warningMessages && this.output.warningMessages.length > 0;
  }

  getCurrActionTDLFromGroup(group) {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in group.actions) {
      if (group.actions[key].actionName === this.tdlId) {
        return group.actions[key];
      }
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const key in group.subGroups) {
      if (group.subGroups[key]) {
        const actionTDL = this.getCurrActionTDLFromGroup(group.subGroups[key]);
        if (actionTDL != null) {
          return actionTDL;
        }
      }
    }

    return null;
  }

  getCurrActionTdl() {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in this.tdl.SGroups) {
      if (this.tdl.SGroups[key]) {
        const actionTDL = this.getCurrActionTDLFromGroup(this.tdl.SGroups[key]);
        if (actionTDL != null) {
          return actionTDL;
        }
      }
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const key in this.tdl.groups) {
      if (this.tdl.groups[key]) {
        const actionTDL = this.getCurrActionTDLFromGroup(this.tdl.groups[key]);
        if (actionTDL != null) {
          return actionTDL;
        }
      }
    }
    return null;
  }

  getSearchCriteriaOperators(path) {
    const operators = [];
    const operatorsAsObject = this.getTdlWithPath(path).operators;
    if (!operatorsAsObject) return operators;
    Object.keys(operatorsAsObject).map((key) => {
      if (operatorsAsObject[key]) {
        operators.push({
          name: operatorsAsObject[key][0],
          code: operatorsAsObject[key][1],
        });
      }
    });
    return operators;
  }

  flipSearchbarMode() {
    this.searchBarMode = this.searchBarMode === "horizontal" ? "vertical" : "horizontal";
  }

  setSearchCriteriaOperator(keyName, op) {
    if (!this.searchCriteria.searchCriteriaKeys) {
      this.searchCriteria.searchCriteriaKeys = {};
    }
    if (!this.searchCriteria.searchCriteriaKeys[keyName]) {
      this.searchCriteria.searchCriteriaKeys[keyName] = [];
    }
    this.searchCriteria.searchCriteriaKeys[keyName][0] = op;
  }

  setSearchCriteriaValue(keyName, value) {
    if (!this.searchCriteria.searchCriteriaKeys) {
      this.searchCriteria.searchCriteriaKeys = {};
    }
    if (!this.searchCriteria.searchCriteriaKeys[keyName]) {
      this.searchCriteria.searchCriteriaKeys[keyName] = [];
    }
    if (value === "false" || value === "true") value = value === "true";
    this.searchCriteria.searchCriteriaKeys[keyName][1] = value;
  }

  setSortKey(sortKey) {
    this.searchCriteria.orderByKeys = [];
    if (sortKey) {
      this.searchCriteria.orderByKeys.push(sortKey);
    }
  }

  getSortKey() {
    if (!this.searchCriteria.orderByKeys) {
      return null;
    }
    return this.searchCriteria.orderByKeys[0];
  }

  getSearchCriteriaOperator(keyName) {
    if (!this.searchCriteria.searchCriteriaKeys) {
      this.searchCriteria.searchCriteriaKeys = {};
    }
    if (!this.searchCriteria.searchCriteriaKeys[keyName]) {
      return null;
    }
    return this.searchCriteria.searchCriteriaKeys[keyName][0];
  }

  getSearchCriteriaValue(keyName) {
    if (!this.searchCriteria.searchCriteriaKeys) {
      this.searchCriteria.searchCriteriaKeys = {};
    }
    if (!this.searchCriteria.searchCriteriaKeys[keyName]) {
      return null;
    }

    return this.searchCriteria.searchCriteriaKeys[keyName][1];
  }

  getSearchCriteriaObject() {
    return this.searchCriteria.searchCriteriaKeys;
  }

  setSelectedObjects(selectedObjects) {
    this.selectedObjects = selectedObjects;
  }

  getBacktoId() {
    return this.backtoId;
  }

  setBacktoId(backtoId) {
    this.backtoId = backtoId;
  }

  buildBreadcrumItem() {
    const breadcrumItem = {};
    breadcrumItem.label = this.tdlLabel;
    breadcrumItem.usecaseId = this.usecaseId;
    // breadcrumItem.command = (oldUsecaseId) => {
    // this.stub.setBacktoId(oldUsecaseId, this.usecaseId);
    // this.stub.setAction("backTo", oldUsecaseId);
    //   this.stub.sendObject(
    //     { tdlId: "backTo" },
    //     {
    //       usecaseId: oldUsecaseId,
    //       outletId: this.outletId,
    //       outletContainerId: this.outletContainerId,
    //       tabId: this.tabId,
    //       needBlock: true,
    //     },
    //     null,
    //     null,
    //   );
    // };
    return breadcrumItem;
  }

  // back() {
  // this.stub.setAction("back", this.usecaseId);
  // this.stub.sendObject(
  //   { tdlId: "back" },
  //   {
  //     usecaseId: this.usecaseId,
  //     outletId: this.outletId,
  //     outletContainerId: this.outletContainerId,
  //     tabId: this.tabId,
  //     needBlock: true,
  //   },
  //   null,
  //   null,
  // );
  // }

  setExportFormat(value) {
    this.exportFormat = value;
  }

  getExportFormat() {
    return this.exportFormat;
  }

  addErrorMessage(errorMessage) {
    const vc = {
      blocked: this.isBlocked,
      needBlock: false,
      outletContainerId: this.outletContainerId,
      outletId: this.outletId,
      tabId: this.tabId,
      tdlId: this.tdlId,
      usecaseId: this.usecaseId,
      isMainOutlet: this.isMainOutlet,
      isPopupOutlet: this.isPopupOutlet,
      downloadCurrentFile: true,
      drawInNewTab: this.drawInNewTab,
      finalDelete: false,
    };
    this.output.errorMessages.push(errorMessage);
    this.stub.sendBusinessExceptionFiredAlert(vc);
    this.stub.removeErrorMessages(this.usecaseId);
  }

  getViewContext() {
    return {
      blocked: this.isBlocked,
      needBlock: false,
      outletContainerId: this.outletContainerId,
      outletId: this.outletId,
      tabId: this.tabId,
      tdlId: this.tdlId,
      usecaseId: this.usecaseId,
      isMainOutlet: this.isMainOutlet,
      isPopupOutlet: this.isPopupOutlet,
      drawInNewTab: this.drawInNewTab,
    };
  }

  addSuccessMessage(successMessage) {
    const vc = {
      blocked: this.isBlocked,
      needBlock: false,
      outletContainerId: this.outletContainerId,
      outletId: this.outletId,
      tabId: this.tabId,
      tdlId: this.tdlId,
      usecaseId: this.usecaseId,
      isMainOutlet: this.isMainOutlet,
      isPopupOutlet: this.isPopupOutlet,
      downloadCurrentFile: true,
      drawInNewTab: this.drawInNewTab,
      finalDelete: false,
    };
    this.output.successMessages.push(successMessage);
    this.stub.sendSuccessMessageFiredAlert(vc);
    this.stub.removeSuccessMessages(this.usecaseId);
  }

  addWarningMessage(warningMessage) {
    const vc = {
      blocked: this.isBlocked,
      needBlock: false,
      outletContainerId: this.outletContainerId,
      outletId: this.outletId,
      tabId: this.tabId,
      tdlId: this.tdlId,
      usecaseId: this.usecaseId,
      isMainOutlet: this.isMainOutlet,
      isPopupOutlet: this.isPopupOutlet,
      downloadCurrentFile: true,
      drawInNewTab: this.drawInNewTab,
      finalDelete: false,
    };
    this.output.warningMessages.push(warningMessage);
    this.stub.sendBusinessWarningFiredAlert(vc);
    this.stub.removeWarningMessages(this.usecaseId);
  }

  resetFilterInfo() {
    this.filterInfo = { name: "", isDefault: undefined };
  }

  calculatedRowsNum() {
    return this.count !== this.unCalculatedRowsNum;
  }

  setCurrentObjectPath(path) {
    this.currObjectPath = this.replaceIndexWithPK(path);
  }

  setCurrentKeyFocus(currentKeysFocus) {
    this.currKeyFocus = this.replaceIndexWithPK(currentKeysFocus);
  }

  setCurrentKeyValue(currentKeyValue) {
    this.currKeyValue = this.replaceIndexWithPK(currentKeyValue);
  }

  replaceIndexWithPK(path) {
    const paths = path.split(".");
    let fullPath = "";
    let pathsWithPK = "";
    // eslint-disable-next-line no-restricted-syntax
    for (const p of paths) {
      if (fullPath === "") {
        fullPath = p;
      } else {
        fullPath = `${fullPath}.${p}`;
      }

      if (!p.includes("[")) {
        pathsWithPK += `${p}.`;
        continue;
      }

      /**
       * Get the current full Path to get the Object PK
       */
      const currentObject = this.getObject(fullPath, "");
      /**
       * Get the current Path array
       * ex : pathArray[0] : 'emergencyContact[' , pathArray[1] : ']'
       */
      const pathArray = p.split(/[\d+]/);
      const pathWithPK =
        pathArray[0] +
        (currentObject ? currentObject.pk : undefined) +
        pathArray[1] +
        (pathArray.length > 2 ? pathArray[2] : "");
      pathsWithPK += `${pathWithPK}.`;
    }
    if (pathsWithPK.lastIndexOf(".") === pathsWithPK.length - 1) {
      pathsWithPK = pathsWithPK.slice(0, pathsWithPK.length - 1);
    }
    return pathsWithPK;
  }

  getBreadCrumpItems(homeIcon, backToHandler) {
    const breads = [
      {
        icon: homeIcon,
        onClick: () => {
          backToHandler("home");
        },
      },
    ];

    this.callersLabelsArray.map(({ tdlLabel, usecaseId }) => {
      breads.push({
        label: tdlLabel,
        usecaseId,
        onClick: () => {
          backToHandler(usecaseId);
        },
      });
    });

    breads.push({
      label: this.tdlLabel,
      usecaseId: this.usecaseId,
      onClick: () => {
        backToHandler(this.usecaseId);
      },
    });

    return breads;
  }

  getActions(splitted = false) {
    const tdl = this.getTdlWithPath("");
    const { actions } = tdl.groups[0];
    const clonedActions = Util.cloneDeep(actions);
    const filteredActions = clonedActions.filter((action) => Util.isValidAction(action));
    return splitted ? Util.splitActions(filteredActions, this.barButtonsCount) : filteredActions;
  }

  getHeaderActions() {
    if (this.tdl.type === "GOTO") return [[], []];
    const clonedActions = this.getActions(false);
    if (this.tdl.type === "SMS") {
      const filteredActions = clonedActions.filter((action) => Util.isValidStaticAction(action));
      return Util.splitActions(filteredActions, this.barButtonsCount);
    }
    return Util.splitActions(clonedActions, this.barButtonsCount);
  }

  getMemberActions() {
    if (this.tdl.type === "GOTO") return [];
    const clonedActions = this.getActions(false);
    return clonedActions.filter((action) => Util.isValidMemberAction(action));
  }

  getComparableObjects() {
    const {
      tdl,
      newResult,
      isLoading,
      rowsNumber,
      count,
      maxPageNumber,
      maxRowsSize,
      hasServerFilter,
      filterInfo,
      filterName,
      searchCriteria,
      rowsColor,
      currObjectPath,
      currKeyFocus,
      currKeyValue,
      tdlKeys,
      tdlSKeys,
      selectedObjects,
      automaticCountMode,
    } = this;
    return {
      tdl,
      newResult,
      isLoading,
      rowsNumber,
      count,
      maxPageNumber,
      maxRowsSize,
      hasServerFilter,
      filterInfo,
      filterName,
      searchCriteria,
      rowsColor,
      currObjectPath,
      currKeyFocus,
      currKeyValue,
      tdlKeys,
      tdlSKeys,
      selectedObjects,
      automaticCountMode,
    };
  }

  isPopUp() {
    return (
      (this.tdl.tdlOptions && this.tdl.tdlOptions.isPopup && this.tdl.tdlOptions.isPopup.value === "true") ||
      this.isPopupOutlet
    );
  }
}
