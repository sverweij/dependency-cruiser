/**
 * returns true if there's at least one element in pLeftArray that's also
 * in pRightArray
 *
 * @param {string[]} pLeftArray an array of strings
 * @param {string[]} pRightArray another array of strings
 * @return {boolean} true if there's at least one element in pLeftArray also in pRightArray
 */
export function intersects(pLeftArray, pRightArray) {
  if (pLeftArray.length === 0 || pRightArray.length === 0) {
    return false;
  }
  if (pRightArray.length < pLeftArray.length) {
    return pRightArray.some((pItem) => pLeftArray.includes(pItem));
  }
  return pLeftArray.some((pItem) => pRightArray.includes(pItem));
}

export function uniq(pArray) {
  return [...new Set(pArray)];
}

/**
 * @param {any[]} pArray
 * @param {function} pIteratee
 * @returns {any[]}
 */
export function uniqBy(pArray, pIteratee) {
  const lSeen = new Map();
  const lResult = [];

  for (const lElement of pArray) {
    const lKey = pIteratee(lElement);
    if (!lSeen.has(lKey)) {
      lSeen.set(lKey, true);
      lResult.push(lElement);
    }
  }

  return lResult;
}

/**
 * @param {any[]} pArray
 * @param {function} pComparator
 * @returns {any[]}
 */
export function uniqWith(pArray, pComparator) {
  const lResult = [];

  for (const lElement of pArray) {
    if (!lResult.some((pY) => pComparator(lElement, pY))) {
      lResult.push(lElement);
    }
  }

  return lResult;
}
