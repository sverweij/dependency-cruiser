const { isModuleOnlyRule, isFolderScope } = require("./rule-classifiers");
const matchers = require("./matchers");

function match(pFromFolder, pToFolder) {
  return (pRule) =>
    // TODO: add path rules - they need to be frippled from the ones
    // already in place for modules
    matchers.toIsMoreUnstable(pRule, pFromFolder, pToFolder) &&
    matchers.propertyEquals(pRule, pToFolder, "circular");
}

const isInteresting = (pRule) =>
  isFolderScope(pRule) && !isModuleOnlyRule(pRule);

module.exports = {
  match,
  isInteresting,
};
