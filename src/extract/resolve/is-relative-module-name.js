module.exports = function isRelativeModuleName(pString) {
  return (
    pString.startsWith("./") ||
    pString.startsWith("../") ||
    pString === "." ||
    pString === ".."
  );
};
