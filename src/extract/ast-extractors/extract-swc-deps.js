const SwcDependencyVisitor = require("./swc-dependency-visitor");

/**
 *
 * @param {import('@swc/core').ModuleItem[]} pAST
 * @returns {{module: string, moduleSystem: string, dynamic: boolean}[]}
 */
function extractImportsAndExports(pAST) {
  return pAST.body
    .filter(
      (pNode) =>
        [
          "ImportDeclaration",
          "ExportAllDeclaration",
          "ExportNamedDeclaration",
        ].includes(pNode.type) && Boolean(pNode.source)
    )
    .map((pNode) => ({
      module: pNode.source.value,
      moduleSystem: "es6",
      exoticallyRequired: false,
    }));
}

function extractImportEquals(pAST) {
  return pAST.body
    .filter(
      (pNode) =>
        pNode.type === "TsImportEqualsDeclaration" &&
        pNode.moduleRef.type === "TsExternalModuleReference"
    )
    .map((pNode) => ({
      module: pNode.moduleRef.expression.value,
      moduleSystem: "cjs",
      exoticallyRequired: false,
    }));
}

function extractNestedDependencies(pAST, pExoticRequireStrings) {
  const visitor = new SwcDependencyVisitor(pExoticRequireStrings);
  return visitor.getDependencies(pAST);
}

/**
 *
 * @param {import('@swc/core').ModuleItem[]} pSwcAST
 * @param {*} pExoticRequireStrings
 * @returns {{module: string, moduleSystem: string, dynamic: boolean}[]}
 */
module.exports = function extractSwcDependencies(
  pSwcAST,
  pExoticRequireStrings
) {
  return (
    extractImportsAndExports(pSwcAST)
      .concat(extractImportEquals(pSwcAST))
      // as far as I can tell swc doesn't do tripple slash directives
      // .concat(extractTrippleSlashDirectives(pSwcAST))
      .concat(extractNestedDependencies(pSwcAST, pExoticRequireStrings))
      .map((pModule) => ({ dynamic: false, ...pModule }))
  );
};
