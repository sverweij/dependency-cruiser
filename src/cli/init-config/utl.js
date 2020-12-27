function folderNameArrayToRE(pArrayOfStrings) {
  return `^(${pArrayOfStrings.join("|")})`;
}
module.exports = {
  folderNameArrayToRE,
};
