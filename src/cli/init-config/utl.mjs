export function folderNameArrayToRE(pArrayOfStrings) {
  return `^(${pArrayOfStrings.join("|")})`;
}
