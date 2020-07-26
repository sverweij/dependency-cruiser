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

  // when validate === false we might want to skip the addValidations.
  // We don't at this time, however, as "valid" is a mandatory
  // attribute (to simplify reporter logic)
  lModules = addValidations(lModules, pOptions.ruleSet, pOptions.validate);

  return lModules;
};
