const toTypescriptAST = require("./parse/to-typescript-ast");
const toJavascriptAST = require("./parse/to-javascript-ast");
const localNpmHelpers = require("./resolve/local-npm-helpers");
const readPackageDeps = require("./resolve/read-package-deps");
const resolveAMD = require("./resolve/resolve-amd");
const resolve = require("./resolve/resolve");
const reachable = require("./derive/reachable/is-reachable");

module.exports = () => {
  toTypescriptAST.clearCache();
  toJavascriptAST.clearCache();
  localNpmHelpers.clearCache();
  readPackageDeps.clearCache();
  resolveAMD.clearCache();
  resolve.clearCache();
  reachable.clearCache();
};
