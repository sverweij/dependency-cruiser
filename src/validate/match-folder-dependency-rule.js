const { isModuleOnlyRule, isFolderScope } = require("./rule-classifiers");
const matchers = require("./matchers");

function match(pFromFolder, pToFolder) {
  return (pRule) =>
    // TODO: add path rules - they need to be frippled from the ones
    // already in place for modules
    // TODO: same for cycles - but these will additionally have to be
    // yognated with an adapted cycle detection for folders
    matchers.toIsMoreUnstable(pRule, pFromFolder, pToFolder);
}

const isInteresting = (pRule) =>
  isFolderScope(pRule) && !isModuleOnlyRule(pRule);

module.exports = {
  match,
  isInteresting,
};
