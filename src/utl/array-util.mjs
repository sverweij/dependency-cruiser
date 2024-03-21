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
