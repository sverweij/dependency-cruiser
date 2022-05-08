const {
  extractGroups,
  replaceGroupPlaceholders,
} = require("../utl/regex-util");
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

function toFolderPath(pRule, pToFolder, pGroups) {
  return Boolean(
    !pRule.to.path ||
      pToFolder.name.match(replaceGroupPlaceholders(pRule.to.path, pGroups))
  );
}

function toFolderPathNot(pRule, pToFolder, pGroups) {
  return Boolean(
    !pRule.to.pathNot ||
      !pToFolder.name.match(replaceGroupPlaceholders(pRule.to.pathNot, pGroups))
  );
}

/**
 *
 * @param {import("../../types/cruise-result").IFolder} pFromFolder
 * @param {import("../../types/cruise-result").IFolderDependency} pToFolder
 * @returns {(pRule) => boolean}
 */
function match(pFromFolder, pToFolder) {
  return (pRule) => {
    const lGroups = extractGroups(pRule.from, pFromFolder.name);

    // TODO: via's
    return (
      fromFolderPath(pRule, pFromFolder) &&
      fromFolderPathNot(pRule, pFromFolder) &&
      toFolderPath(pRule, pToFolder, lGroups) &&
      toFolderPathNot(pRule, pToFolder, lGroups) &&
      matchers.toIsMoreUnstable(pRule, pFromFolder, pToFolder) &&
      matchers.propertyEquals(pRule, pToFolder, "circular")
    );
  };
}
/**
 *
 * @param {any} pRule
 * @returns boolean
 */
const isInteresting = (pRule) =>
  isFolderScope(pRule) && !isModuleOnlyRule(pRule);

module.exports = {
  match,
  isInteresting,
};
