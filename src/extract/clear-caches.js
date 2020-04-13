const toTypescriptAST = require("./parse/to-typescript-ast");
const toJavascriptAST = require("./parse/to-javascript-ast");
const localNpmHelpers = require("./resolve/local-npm-helpers");
const readPackageDeps = require("./resolve/get-manifest-dependencies");
const resolveAMD = require("./resolve/resolve-amd");
const resolve = require("./resolve/resolve");

module.exports = () => {
  toTypescriptAST.clearCache();
  toJavascriptAST.clearCache();
  localNpmHelpers.clearCache();
  readPackageDeps.clearCache();
  resolveAMD.clearCache();
  resolve.clearCache();
};
