import { isModuleOnlyRule, isFolderScope } from "./rule-classifiers.mjs";
import { propertyEquals, matchesToIsMoreUnstable } from "./matchers.mjs";
import {
  getCachedRegExp,
  extractGroups,
  replaceGroupPlaceholders,
} from "#utl/regex-util.mjs";

function fromFolderPath(pRule, pFromFolder) {
  return (
    !pRule.from.path || getCachedRegExp(pRule.from.path).test(pFromFolder.name)
  );
}

function fromFolderPathNot(pRule, pFromFolder) {
  return (
    !pRule.from.pathNot ||
    !getCachedRegExp(pRule.from.pathNot).test(pFromFolder.name)
  );
}

function toFolderPath(pRule, pToFolder, pGroups) {
  return (
    !pRule.to.path ||
    getCachedRegExp(replaceGroupPlaceholders(pRule.to.path, pGroups)).test(
      pToFolder.name,
    )
  );
}

function toFolderPathNot(pRule, pToFolder, pGroups) {
  return (
    !pRule.to.pathNot ||
    !getCachedRegExp(replaceGroupPlaceholders(pRule.to.pathNot, pGroups)).test(
      pToFolder.name,
    )
  );
}

/**
 *
 * @param {import("../../types/cruise-result.mjs").IFolder} pFromFolder
 * @param {import("../../types/cruise-result.mjs").IFolderDependency} pToFolder
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
      matchesToIsMoreUnstable(pRule, pFromFolder, pToFolder) &&
      propertyEquals(pRule, pToFolder, "circular")
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

export default {
  match,
  isInteresting,
};
