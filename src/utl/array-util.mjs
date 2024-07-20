/**
 * returns true if there's at least one element in pLeftArray that's also
 * in pRightArray
 *
 * @param {string[]} pLeftArray an array of strings
 * @param {string[]} pRightArray another array of strings
 * @return {boolean} true if there's at least one element in pLeftArray also in pRightArray
 */
export function intersects(pLeftArray, pRightArray) {
  return pLeftArray.some((pLeftItem) => pRightArray.includes(pLeftItem));
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
  return pArray.filter(
    (pElement, pIndex, pSelf) =>
      pIndex === pSelf.findIndex((pY) => pIteratee(pElement) === pIteratee(pY)),
  );
}

/**
 * @param {any[]} pArray
 * @param {function} pComparator
 * @returns {any[]}
 */
export function uniqWith(pArray, pComparator) {
  return pArray.filter(
    (pElement, pIndex, pSelf) =>
      pIndex === pSelf.findIndex((pY) => pComparator(pElement, pY)),
  );
}
