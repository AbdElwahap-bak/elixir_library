import * as Util from "./util";

export const simpleKeysEqual = (v1, v2) => {
  if (typeof v1 === "object" || typeof v2 === "object") {
    // debugger;
    if (JSON.stringify(v1) === JSON.stringify(v2)) {
      return true;
    }
  }
  if (((v1 === undefined || v1 === "") && (v2 === undefined || v2 === "")) || v1 === v2) {
    return true;
  }
  return false;
};

export const updatedKeysComposite = (newObj, oldObj, tdlKeys, modifiedValues) => {
  for (const key in tdlKeys) {
    if (
      (tdlKeys[key].keyType === "Simple" &&
        !simpleKeysEqual(newObj[tdlKeys[key].name], oldObj[tdlKeys[key].name])) ||
      tdlKeys[key].isAssociation === true
    ) {
      modifiedValues[tdlKeys[key].name] = newObj[tdlKeys[key].name];
    } else if (tdlKeys[key].keyType === "Composition") {
      const inModefication = {};
      if (oldObj[tdlKeys[key].name] === undefined) {
        oldObj[tdlKeys[key].name] = {};
      }
      if (newObj[tdlKeys[key].name] === undefined) {
        newObj[tdlKeys[key].name] = {};
      }
      updatedKeysComposite(
        newObj[tdlKeys[key].name],
        oldObj[tdlKeys[key].name],
        tdlKeys[key].subKeys,
        inModefication,
      );
      modifiedValues[tdlKeys[key].name] = inModefication;
    } else if (tdlKeys[key].keyType === "Collection") {
      const inModefication = {};
      updatedKeysCollection(
        newObj[tdlKeys[key].name],
        oldObj[tdlKeys[key].name],
        tdlKeys[key].subKeys,
        inModefication,
      );
      modifiedValues[tdlKeys[key].name] = inModefication;
    }
  }
};

export const updatedKeysCollection = (newObj, oldObj, tdlKeys, modifiedValues) => {
  const PKs = Util.getClientPKS(newObj);
  for (const pk in PKs) {
    if (PKs[pk]) {
      let oldObject = Util.findObjInCollection(oldObj, PKs[pk]);
      const newObject = Util.findObjInCollection(newObj, PKs[pk]);
      if (oldObject === undefined) {
        oldObject = {};
      }
      const inModefication = {};
      updatedKeysComposite(newObject, oldObject, tdlKeys, inModefication);
      modifiedValues[PKs[pk]] = inModefication;
    }
    // } else {
    // 	newObject.pk=undefined;
    // 	modifiedValues[PKs[pk]] = newObject;
    // }
  }
};

export const updatedKeys = (newObj, oldObj, tdlKeys, modifiedValues) => {
  if (tdlKeys.keyType === "Composition") {
    updatedKeysComposite(newObj, oldObj, tdlKeys.subKeys, modifiedValues);
  } else if (tdlKeys.keyType === "Collection") {
    updatedKeysCollection(newObj, oldObj, tdlKeys.subKeys, modifiedValues);
  }
};
