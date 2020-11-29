const prettier = require("prettier");
const normalizeNewline = require("normalize-newline");

module.exports = function normalizeSource(pSource) {
  return normalizeNewline(prettier.format(pSource, { parser: "babel" }));
};
