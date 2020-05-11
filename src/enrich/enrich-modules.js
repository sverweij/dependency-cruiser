const _get = require("lodash/get");
const deriveCirculars = require("./derive/circular");
const deriveOrphans = require("./derive/orphan");
const deriveReachable = require("./derive/reachable");
const addFocus = require("./add-focus");
const addValidations = require("./add-validations");

module.exports = function enrichModules(pModules, pOptions) {
  let lModules = deriveCirculars(pModules);
  lModules = deriveOrphans(lModules);
  lModules = deriveReachable(lModules, pOptions.ruleSet);
  lModules = addFocus(lModules, _get(pOptions, "focus"));
  lModules = addValidations(lModules, pOptions.validate, pOptions.ruleSet);
  return lModules;
};
