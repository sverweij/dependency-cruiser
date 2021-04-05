const toTypescriptAST = require("./parse/to-typescript-ast");
const toJavascriptAST = require("./parse/to-javascript-ast");
const toSwcAST = require("./parse/to-swc-ast");
const localNpmHelpers = require("./resolve/external-module-helpers");
const getManifest = require("./resolve/get-manifest");
const resolveAMD = require("./resolve/resolve-amd");
const resolve = require("./resolve/resolve");

module.exports = function clearCaches() {
  toTypescriptAST.clearCache();
  toJavascriptAST.clearCache();
  toSwcAST.clearCache();
  localNpmHelpers.clearCache();
  getManifest.clearCache();
  resolveAMD.clearCache();
  resolve.clearCache();
};
