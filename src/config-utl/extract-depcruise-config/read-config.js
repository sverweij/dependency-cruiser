const fs = require("fs");
const path = require("path");
const json5 = require("json5");

module.exports = (pConfigFileName) => {
  if ([".js", ".cjs", ""].includes(path.extname(pConfigFileName))) {
    /* eslint node/global-require:0, security/detect-non-literal-require:0, import/no-dynamic-require:0 */
    return require(pConfigFileName);
  }

  return json5.parse(fs.readFileSync(pConfigFileName, "utf8"));
};
