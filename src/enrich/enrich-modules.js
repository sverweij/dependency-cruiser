const _get = require("lodash/get");
const addFocus = require("../../src/utl/add-focus");
const deriveCirculars = require("./derive/circular");
const deriveOrphans = require("./derive/orphan");
const deriveReachable = require("./derive/reachable");
const addValidations = require("./add-validations");

module.exports = function enrichModules(pModules, pOptions) {
  let lModules = deriveCirculars(pModules);
  lModules = deriveOrphans(lModules);
  lModules = deriveReachable(lModules, pOptions.ruleSet);
  lModules = addFocus(lModules, _get(pOptions, "focus"));
  lModules = addValidations(lModules, pOptions.validate, pOptions.ruleSet);
  return lModules;
};
