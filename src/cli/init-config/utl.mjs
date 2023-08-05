// @ts-check
/**
 * @param {string[]} pArrayOfStrings
 * @returns string
 */
export function folderNameArrayToRE(pArrayOfStrings) {
  const lFoldersInARE = pArrayOfStrings
    .map((pName) => pName.replace(/\\/g, "\\\\").replace(/\./g, "\\."))
    .join("|");

  return `^(${lFoldersInARE})`;
}
