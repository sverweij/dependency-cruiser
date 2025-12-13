// @ts-check
/**
 * @param {string[]} pArrayOfStrings
 * @returns string
 */
export function folderNameArrayToRE(pArrayOfStrings) {
  const lFoldersInARE = pArrayOfStrings
    .map((pName) => pName.replaceAll("\\", "\\\\").replaceAll(".", "\\."))
    .join("|");

  return `^(${lFoldersInARE})`;
}
