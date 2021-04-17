import _ from "lodash";
import FastCompare from "react-fast-compare";
import moment from "moment";
import { baseServerURL } from "../config/axios";

export const Composition = "Composition";
export const Collection = "Collection";
export const Association = "Association";
export const serverFormatPostfix = "_$string";
export const Simple = "Simple";
export const allOperators = {
  single: ["=", "!=", ">", ">=", "<", "<=", "!"],
  range: ["Between", "<>"],
  multi: ["In", "in", "LikeIn"],
};

export const leftToRightLanguages = ["English"];
export const simpleTypes = [
  "BlobText",
  "String",
  "Double",
  "Long",
  "EMAIL",
  "TypeName",
  "Password",
  "Boolean",
  "Date",
  "Time",
  "DateTime",
  "Duration",
  "Text",
  "Double16",
];

export const DATE_FORMATS = {
  Time: "HH:mm",
  Date: "DD/MM/YYYY",
  DateTime: "DD/MM/YYYY HH:mm:ss",
};

export const dynamic = "dynamic";

export const isMultiOperator = (op) => op && (op.includes(",") || op.includes(";"));

export const isRangeOperator = (op) => op && (op === "[]" || op === "][");

export const isEqual = (object1, object2) => FastCompare(object1, object2);

export const isEmpty = (object) => _.isEmpty(object);

export const isSimpleGroup = ({ masterKey }) => masterKey.includes("*");

export const cloneDeep = (object) => _.cloneDeep(object);

export const getDateFormat = (type) => DATE_FORMATS[type];

export const resolveRelativeURL = (url) => `${baseServerURL}${url.startsWith("/") ? url : `/${url}`}`;

export const isFileType = (type) => type === "com.elixir.data.File" || type === "com.elixir.data.ImageFile";

export const isImageFileType = (type) => type === "com.elixir.data.ImageFile";

export const isSuccessResponse = (response) =>
  response.status === 200 && response.data && response.data.output && response.data.output.errorMessages.length === 0;

export const transformMainMenu = (object) => {
  const menuObject = {};
  const menuArray = [];
  object.map((item) => {
    const { basedOnModuleLabel, basedOnProcessLabel, basedOn, tdlId, stepLabel } = item;
    if (!menuObject[basedOnModuleLabel]) {
      menuObject[basedOnModuleLabel] = {
        label: basedOnModuleLabel,
        basedOn,
        processes: {},
      };
    }
    const { processes } = menuObject[basedOnModuleLabel];
    if (!processes[basedOnProcessLabel]) {
      processes[basedOnProcessLabel] = {
        label: basedOnProcessLabel,
        basedOn,
        items: [],
      };
    }
    processes[basedOnProcessLabel].items.push({
      label: stepLabel,
      basedOn,
      tdlId,
    });
  });

  Object.keys(menuObject).map((modelKey) => {
    const modelObj = menuObject[modelKey];
    const items = [];
    Object.keys(modelObj.processes).map((processKey) => {
      items.push(modelObj.processes[processKey]);
    });
    items.sort((x1, x2) => x1.basedOn.prcssOrder - x2.basedOn.prcssOrder);
    delete modelObj.processes;
    menuArray.push({
      ...modelObj,
      items,
    });
  });

  menuArray.sort((x1, x2) => x1.basedOn.moduleOrder - x2.basedOn.moduleOrder);

  return menuArray;
};

export const isValidAction = ({ hasPermission, isAvailable }) => hasPermission === "true" && isAvailable === "true";

export const isValidMemberAction = ({ isMember }) => isMember === "true";

export const isValidStaticAction = ({ isMember, isViewAction }) =>
  isMember === "false" || (isMember === "true" && isViewAction === "false");

export const getActionKey = ({ tdlId, actionLabel }) => `${tdlId}${actionLabel}`;

export const splitActions = (actions, splitNumber) => {
  const splittedActions = [[], []];
  splittedActions[0] = actions.slice(0, Math.min(splitNumber, actions.length));
  if (actions.length > splitNumber) {
    splittedActions[1] = actions.slice(splitNumber, actions.length);
  }
  return splittedActions;
};

export const isSimpleType = (type) => !!simpleTypes.find((item) => item === type);

export const HtmlRegex = new RegExp(/<\/?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[\^'">\s]+))?)+\s*|\s*)?>/);

export const isHTML = (str) => str && typeof str === "string" && (str.includes("<elixirhtml") || HtmlRegex.test(str));

export const resolveElixirDate = (value, type, timeZoneOffset) => {
  const format = DATE_FORMATS[type];
  console.log("resolveElixirDate " + JSON.stringify(type));
  console.log(value);
  if (value) {
    if (Number.isNaN(value) || Number.isNaN(Number(value))) {
      console.log("getting string input");
      console.log(value);
      let dateObject = null;
      if (value.includes("-") && type === "DateTime") {
        dateObject = new Date(moment(value, "YYYY-MM-DD HH:mm:ss").valueOf());
      } else {
        dateObject = new Date(moment(value, format).valueOf());
      }

      console.log(dateObject);
      // reverse timezone from server to client by removing the timezone of the server and adding that of the client
      // the dateObject.getTimezoneOffset() has - before it because it returns the -timezone so to add it we must subtract. this is not a bug
      // this is only done when we have time value. meaning only in (DateTime and Time)
      if (type !== "Date") {
        dateObject.setMinutes(dateObject.getMinutes() - dateObject.getTimezoneOffset() - timeZoneOffset / 60000);
      }
      return moment(dateObject);
    }

    const dateObject = new Date(Number(value));
    console.log("client offset");
    console.log(moment().utcOffset());
    console.log(dateObject.getTimezoneOffset());
    console.log(dateObject);
    console.log("server offset");
    console.log(timeZoneOffset);
    // in case of pure date timezones have no meaning so we depend on the server timezone that's why we remove the client's
    // timezone and keep that of the client
    if (type === "Date") {
      dateObject.setMinutes(dateObject.getMinutes() + dateObject.getTimezoneOffset() + timeZoneOffset / 60000);
    }
    // console.log("date after timezones")
    // console.log(dateObject)
    return moment(dateObject);
  }
  return "";
};

export const getObject = (path, object, type, tdlKeys) => {
  if (path === undefined || path === "") {
    return object;
  }
  const arr = path.split(".");
  const curr = arr[0];
  if (curr !== "") {
    if (curr === "*") {
      arr.splice(0, 1);
      const newPath = arr.join(".");
      return getObject(newPath, object, type, tdlKeys);
    } else {
      if (curr.indexOf("[") !== -1) {
        const keyName = curr.split("[")[0];
        const index = parseInt(curr.split("[")[1].split("]")[0], 0);
        arr.splice(0, 1);
        const newPath = arr.join(".");
        if (Array.isArray(object)) {
          return getObject(newPath, object[index], type, tdlKeys);
        } else if (object[keyName][index] !== undefined) {
          return getObject(
            newPath,
            object[keyName][index],
            type,
            tdlKeys !== undefined ? tdlKeys["subKeys"][path.split(".")[0]] : tdlKeys,
          );
        }
        return "";
      } else {
        if (object[curr] === undefined) {
          let currentType = "Simple";
          if (!curr.includes("_$string")) {
            console.log("curr")
            console.log(curr)
            currentType = tdlKeys === undefined ? type : tdlKeys["subKeys"][curr]["keyType"];
          }

          if (arr.length === 1) {
            if (currentType === Collection) {
              object[curr] = [];
            } else if (currentType === Composition) {
              object[curr] = {};
            } else {
              object[curr] = "";
            }
          } else {
            if (arr[1] === "*") {
              object = [];
            } else {
              object[curr] = {};
            }
          }
        }
        arr.splice(0, 1);
        const newPath = arr.join(".");
        return getObject(
          newPath,
          object[curr],
          type,
          tdlKeys !== undefined ? tdlKeys["subKeys"][path.split(".")[0]] : undefined,
        );
      }
    }
  }
};

export const getObjectWithPath = (object, path, type, tdlKeys) => {
  return getObject(path, object, type, tdlKeys);
};

export const getObjectUsingType = (object, path, type) => {
  return getObject(path, object, type, undefined);
};

export const getObjectUsingTdlKeys = (object, path, tdlKeys) => {
  return getObject(path, object, undefined, tdlKeys);
};

export const getTdlKeys = (tdlKeys, path) => {
  if (!tdlKeys || !tdlKeys.subKeys) return tdlKeys;
  if (path === "") {
    return tdlKeys.subKeys;
  }
  const arr = path.split(".");
  let index = 0;
  let currentTdlKeys = tdlKeys.subKeys[arr[index]];
  index += 1;
  while (index < arr.length) {
    currentTdlKeys = tdlKeys.subKeys[arr[index]];
    index += 1;
  }
  return currentTdlKeys;
};

export const findObjInCollection = (collection, pk) => {
  for (const object in collection) {
    if (collection[object].pk === pk) {
      return collection[object];
    }
  }
  return undefined;
};

export const getClientPKS = (collection) => {
  const keys = [];
  for (const key in collection) {
    if (collection[key]) {
      keys.push(collection[key].pk);
    }
  }
  return keys;
};

export const getTdlWithPath = (path, tdl) => {
  if (!tdl) {
    return null;
  }
  const arr = path.split(".");
  if (arr.length === 1 && path === "") {
    return tdl;
  }
  const curr = arr[0].split("-");
  arr.splice(0, 1);
  const newPath = arr.join(".");
  if (curr[1] !== undefined) {
    return getTdlWithPath(newPath, tdl[curr[0]][curr[1]]);
  }
  return getTdlWithPath(newPath, tdl[curr[0]]);
};
export const setObjectWithPath = (path, object, value) => {
  const arr = path.split(".");
  if (arr.length === 1 || (arr.length === 2 && arr[1] === "*")) {
    if (path.indexOf("[") !== -1) {
      const keyName = path.split("[")[0];
      const index = path.split("[")[1].split("]")[0];
      if (Array.isArray(object)) {
        object[index] = value;
      } else {
        object[keyName][index] = value;
      }
    } else {
      if (arr[1] === "*") {
        object[arr[0]] = value;
      } else {
        // object[path] = Object.assign(value , object[path]);
        object[path] = value;
        if (value != {}) {
          object[path + serverFormatPostfix] = value;
        }
      }
    }
  } else {
    const curr = arr[0];
    arr.splice(0, 1);
    const newPath = arr.join(".");
    if (curr === "*") {
      setObjectWithPath(newPath, object, value);
    } else if (curr.indexOf("[") !== -1) {
      const keyName = curr.split("[")[0];
      const index = curr.split("[")[1].split("]")[0];
      if (Array.isArray(object)) {
        setObjectWithPath(newPath, object[index], value);
      } else {
        setObjectWithPath(newPath, object[keyName][index], value);
      }
    } else {
      setObjectWithPath(newPath, object[curr], value);
    }
  }
};

export const copyObj1ToObj2 = (obj1, obj2) => {
  _.extend(obj2, obj1);
  return obj2;
};

export const isNotUndefined = (object, path) => {
  const arr = path.split(".");
  const curr = arr[0];
  let newObject = null;
  if (curr.indexOf("[") !== -1) {
    const keyName = curr.split("[")[0];
    const index = curr.split("[")[1].split("]")[0];
    if (object[keyName] === undefined || object[keyName][index] === undefined) {
      return false;
    }
    newObject = object[keyName][index];
  } else {
    if (object[curr] === undefined) {
      return false;
    }
    newObject = object[curr];
  }
  arr.splice(0, 1);
  const newPath = arr.join(".");
  if (newPath === "") {
    return true;
  }
  isNotUndefined(newObject, newPath);
};


export const createClientAction = (actionName, icon, position, execution)=>{
  return {
    actionName, icon, position, execution
  }
}