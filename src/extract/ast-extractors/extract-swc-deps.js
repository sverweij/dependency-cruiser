const SwcDependencyVisitor = require("./swc-dependency-visitor");

/**
 *
 * @param {import('@swc/core').ModuleItem[]} pSwcAST
 * @param {string[]} pExoticRequireStrings
 * @returns {{module: string, moduleSystem: string, dynamic: boolean}[]}
 */
module.exports = function extractSwcDependencies(
  pSwcAST,
  pExoticRequireStrings
) {
  const visitor = new SwcDependencyVisitor(pExoticRequireStrings);
  return visitor
    .getDependencies(pSwcAST)
    .map((pModule) => ({ dynamic: false, ...pModule }));
};
