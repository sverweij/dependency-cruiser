/**
 * returns true if there's at least one element in pLeftArray that's also in pRightArray
 *
 * @param {string[]} pLeftArray an array of strings
 * @param {string[]} pRightArray another array of strings
 * @return {boolean} true if there's at least one element in pLeftArray also in pRightArray
 */
function intersects(pLeftArray, pRightArray) {
  return pLeftArray.some((pLeftItem) => pRightArray.includes(pLeftItem));
}

module.exports = {
  intersects,
};
