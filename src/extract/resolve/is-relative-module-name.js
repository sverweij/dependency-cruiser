module.exports = pString =>
  pString.startsWith("./") ||
  pString.startsWith("../") ||
  pString === "." ||
  pString === "..";
