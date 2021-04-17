/*
 *
 *this file updates the object in the client side (clientObject)
 *after getting updates from the server in the form of a json map (serverMap)
 *and a keys from the tdl (tdlKeys)
 *
 * */
import * as Util from "./util";

export const collectionTdl = ["groups", "keys", "subGroups", "SGroups", "actions", "sortedKeys"];

export const updateComposite = (serverMap, clientObject, tdlKeys) => {
  if (clientObject == null) {
    clientObject = {};
  }
  if (serverMap.isNewInstance !== undefined) clientObject.isNewInstance = serverMap.isNewInstance;

  for (const key in tdlKeys) {
    if (serverMap[tdlKeys[key].name] === undefined) {
      if (tdlKeys[key].keyType === "Composition") {
        clientObject[tdlKeys[key].name] = {};
      }
      continue;
    }
    if (tdlKeys[key].keyType === "Simple") {
      clientObject[tdlKeys[key].name] = serverMap[tdlKeys[key].name];
      clientObject[tdlKeys[key].name + "_$string"] = serverMap[tdlKeys[key].name + "_$string"];
    } else if (tdlKeys[key].keyType === "Composition") {
      if (clientObject[tdlKeys[key].name] === undefined) {
        clientObject[tdlKeys[key].name] = {};
      } // getObject(clientObject, tdlKeys[key].name, tdlKeys[key].keyType);//  clientObject[tdlKeys[key].name] = {};
      const keyObj = clientObject[tdlKeys[key].name];
      if (serverMap[tdlKeys[key].name].pk) {
        keyObj.pk = serverMap[tdlKeys[key].name].pk;
      }
      if (serverMap[tdlKeys[key].name]._label) {
        keyObj._label = serverMap[tdlKeys[key].name]._label;
      }
      updateComposite(serverMap[tdlKeys[key].name], keyObj, tdlKeys[key].subKeys);
    } else {
      if (clientObject[tdlKeys[key].name] === undefined) {
        clientObject[tdlKeys[key].name] = [];
      } // getObject(clientObject, tdlKeys[key].name, tdlKeys[key].keyType);//  clientObject[tdlKeys[key].name] = [];
      const keyObj = clientObject[tdlKeys[key].name];
      updateCollection(serverMap[tdlKeys[key].name], keyObj, tdlKeys[key].subKeys);
    }
  }
};

export const updateCollection = (serverMap, clientObject, tdlKeys) => {
  const cloned = clientObject.slice(0);
  clientObject.splice(0, clientObject.length);
  let i = 0;
  for (const keyVar in serverMap) {
    if (serverMap[keyVar]) {
      let mergedObject = null;
      if (Util.findObjInCollection(cloned, serverMap[keyVar].pk) === undefined) {
        const obj = {};
        obj["pk"] = serverMap[keyVar].pk;
        clientObject.push(obj);
        updateComposite(serverMap[keyVar], obj, tdlKeys);
        mergedObject = obj;
      } else {
        // update an existing object in the collection
        mergedObject = Util.findObjInCollection(cloned, serverMap[keyVar].pk);
        updateComposite(serverMap[keyVar], mergedObject, tdlKeys);
      }
      clientObject[i++] = mergedObject;
    }
    // add new object in collection
  }
  const toDelete = [];
  for (const keyVar in clientObject) {
    // delete an object in the collection
    if (Util.findObjInCollection(serverMap, clientObject[keyVar].pk) === undefined) {
      // clientObject.splice(0, Number(key)+1);
      toDelete.push(clientObject[keyVar]);
    }
  }

  for (const keyVar in toDelete) {
    if (toDelete[keyVar]) {
      const index = clientObject.indexOf(toDelete[keyVar]);
      clientObject.splice(index, 1);
    }
  }
};

export const update = (serverMap, clientObject, tdlKeys) => {
  if (tdlKeys.keyType === "Collection") {
    updateCollection(serverMap, clientObject, tdlKeys.subKeys);
  }

  if (tdlKeys.keyType === "Composition") {
    updateComposite(serverMap, clientObject, tdlKeys.subKeys);
  }
};

export const byOrder = (a, b) => {
  if (parseInt(a.order, 0) > parseInt(b.order, 0)) {
    return 1;
  }
  return -1;
};
export const updateTdlCollection = (serverMap, tdl) => {
  for (const keyVar in serverMap) {
    // add new object in collection
    if (Util.findObjInCollection(tdl, serverMap[keyVar].pk) === undefined) {
      const obj = {};
      tdl.push(obj);
      updateTdlComposite(serverMap[keyVar], obj);
    } else {
      // update an existing object in the collection
      updateTdlComposite(serverMap[keyVar], Util.findObjInCollection(tdl, serverMap[keyVar].pk));
    }
  }

  const keys = Util.getClientPKS(serverMap);
  const toDelete = [];
  for (const keyVar in tdl) {
    // delete an object in the collection
    if (keys.indexOf(tdl[keyVar].pk) === -1) {
      // clientObject.splice(0, Number(key)+1);
      toDelete.push(tdl[keyVar]);
    }
  }

  for (const keyVar in toDelete) {
    if (toDelete[keyVar]) {
      const index = tdl.indexOf(toDelete[keyVar]);
      tdl.splice(index, 1);
    }
  }

  if (tdl !== undefined) {
    tdl.sort(byOrder);
  }
};
export const updateTdlComposite = (serverMap, tdl) => {
  for (const key in serverMap) {
    if (serverMap[key] !== undefined && serverMap[key] !== null) {
      if (collectionTdl.indexOf(key) !== -1) {
        if (tdl[key] === undefined) {
          tdl[key] = [];
        }
        updateTdlCollection(serverMap[key], tdl[key]);
      } else {
        if (typeof serverMap[key] === "object" && !Array.isArray(serverMap[key])) {
          if (tdl[key] === undefined) {
            tdl[key] = {};
          }
          updateTdlComposite(serverMap[key], tdl[key]);
        } else {
          tdl[key] = serverMap[key];
        }
      }
    }
  }
};

// HELPER FUNCTIONS
export const getObject = (obj, path, typeName) => {
  const array = path.split(".");
  let tempObject = obj;
  for (const index in array) {
    if (array[index]) {
      if (tempObject[array[index]] === undefined) {
        tempObject[array[index]] = {};
      }
      tempObject = tempObject[array[index]];
    }
  }
  if (typeName === "Collection") {
    tempObject = [];
  }
  return tempObject;
};

export const clear = (obj) => {
  // eslint-disable-next-line array-callback-return
  Object.keys(obj).map((key) => {
    if (obj[key]) delete obj[key];
  });
};
