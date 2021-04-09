const SwcDependencyVisitor = require("./swc-dependency-visitor");

/**
 *
 * @param {import('@swc/core').ModuleItem[]} pAST
 * @param {string[]} pExoticRequireStrings
 * @returns {{module: string, moduleSystem: string, dynamic: boolean}[]}
 */
function extractNestedDependencies(pAST, pExoticRequireStrings) {
  const visitor = new SwcDependencyVisitor(pExoticRequireStrings);
  return visitor.getDependencies(pAST);
}

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
  return (
    extractNestedDependencies(pSwcAST, pExoticRequireStrings)
      // as far as I can tell swc doesn't do tripple slash directives
      // .concat(extractTrippleSlashDirectives(pSwcAST))
      .map((pModule) => ({ dynamic: false, ...pModule }))
  );
};
