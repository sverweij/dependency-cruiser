const { isModuleOnlyRule, isFolderScope } = require("./rule-classifiers");
const matchers = require("./matchers");

function fromFolderPath(pRule, pFromFolder) {
  return Boolean(!pRule.from.path || pFromFolder.name.match(pRule.from.path));
}

function fromFolderPathNot(pRule, pFromFolder) {
  return Boolean(
    !pRule.from.pathNot || !pFromFolder.name.match(pRule.from.pathNot)
  );
}

function toFolderPath(pRule, pToFolder) {
  return Boolean(!pRule.to.path || pToFolder.name.match(pRule.to.path));
}

function toFolderPathNot(pRule, pToFolder) {
  return Boolean(!pRule.to.pathNot || !pToFolder.name.match(pRule.to.pathNot));
}

function match(pFromFolder, pToFolder) {
  return (pRule) =>
    // TODO: to path rules - they need to be frippled from the ones
    // already in place for modules
    fromFolderPath(pRule, pFromFolder) &&
    fromFolderPathNot(pRule, pFromFolder) &&
    toFolderPath(pRule, pToFolder) &&
    toFolderPathNot(pRule, pToFolder) &&
    matchers.toIsMoreUnstable(pRule, pFromFolder, pToFolder) &&
    matchers.propertyEquals(pRule, pToFolder, "circular");
}

const isInteresting = (pRule) =>
  isFolderScope(pRule) && !isModuleOnlyRule(pRule);

module.exports = {
  match,
  isInteresting,
};
