const _get = require("lodash/get");
const bus = require("../utl/bus");
const addFocus = require("../../src/utl/add-focus");
const deriveCirculars = require("./derive/circular");
const deriveOrphans = require("./derive/orphan");
const deriveReachable = require("./derive/reachable");
const addValidations = require("./add-validations");

module.exports = function enrichModules(pModules, pOptions) {
  bus.emit("progress", "analyzing: cycles");
  let lModules = deriveCirculars(pModules);
  bus.emit("progress", "analyzing: orphans");
  lModules = deriveOrphans(lModules);
  bus.emit("progress", "analyzing: reachables");
  lModules = deriveReachable(lModules, pOptions.ruleSet);
  bus.emit("progress", "analyzing: add focus (if any)");
  lModules = addFocus(lModules, _get(pOptions, "focus"));

  // when validate === false we might want to skip the addValidations.
  // We don't at this time, however, as "valid" is a mandatory
  // attribute (to simplify reporter logic)
  bus.emit("progress", "analyzing: validations");
  lModules = addValidations(lModules, pOptions.ruleSet, pOptions.validate);

  return lModules;
};
