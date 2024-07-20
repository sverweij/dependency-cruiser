/* eslint-disable security/detect-object-injection */

export function get(pObject, pPath, pDefault) {
  if (!pObject || !pPath) {
    return pDefault;
  }
  // Regex explained: https://regexr.com/58j0k
  const lPathArray = pPath.match(/([^[.\]])+/g);

  const lReturnValue = lPathArray.reduce((pPreviousObject, pKey) => {
    return pPreviousObject && pPreviousObject[pKey];
  }, pObject);

  if (!lReturnValue) {
    return pDefault;
  }
  return lReturnValue;
}

export function set(pObject, pPath, pValue) {
  const lPathArray = pPath.match(/([^[.\]])+/g);

  lPathArray.reduce((pPreviousObject, pKey, pIndex) => {
    if (pIndex === lPathArray.length - 1) {
      pPreviousObject[pKey] = pValue;
    } else if (!pPreviousObject[pKey]) {
      pPreviousObject[pKey] = {};
    }
    return pPreviousObject[pKey];
  }, pObject);
}

/**
 * @param {any} pObject
 * @param {string} pPath
 * @returns {boolean}
 */
export function has(pObject, pPath) {
  return Boolean(get(pObject, pPath));
}
