/* eslint-disable valid-jsdoc */
const tryRequire = require("semver-try-require");
const $package = require("../../../package.json");

const typescript = tryRequire(
  "typescript",
  $package.supportedTranspilers.typescript
);

/*
 * Both extractImport* assume the imports/ exports can only occur at
 * top level. AFAIK this the only place they're allowed, so we should
 * be good. Otherwise we'll need to walk the tree.
 */

/**
 * Get all import and export statements from the top level AST node
 *
 * @param {import("typescript").Node} pAST - the (top-level in this case) AST node
 * @returns {{module: string, moduleSystem: string, exoticallyRequired: boolean}[]} -
 *                                  all import and export statements in the
 *                                  (top level) AST node
 */
function extractImportsAndExports(pAST) {
  return pAST.statements
    .filter(
      (pStatement) =>
        (typescript.SyntaxKind[pStatement.kind] === "ImportDeclaration" ||
          typescript.SyntaxKind[pStatement.kind] === "ExportDeclaration") &&
        Boolean(pStatement.moduleSpecifier)
    )
    .map((pStatement) => ({
      module: pStatement.moduleSpecifier.text,
      moduleSystem: "es6",
      exoticallyRequired: false,
    }));
}

/**
 * Get all import equals statements from the top level AST node
 *
 * E.g. import thing = require('some-thing')
 * Ignores import equals of variables (e.g. import protocol = ts.server.protocol
 * which happens in typescript/lib/protocol.d.ts)
 *
 * @param {import("typescript").Node} pAST - the (top-level in this case) AST node
 * @returns {{module: string, moduleSystem: string}[]} - all import equals statements in the
 *                                  (top level) AST node
 */
function extractImportEquals(pAST) {
  return pAST.statements
    .filter(
      (pStatement) =>
        typescript.SyntaxKind[pStatement.kind] === "ImportEqualsDeclaration" &&
        pStatement.moduleReference &&
        pStatement.moduleReference.expression &&
        pStatement.moduleReference.expression.text
    )
    .map((pStatement) => ({
      module: pStatement.moduleReference.expression.text,
      moduleSystem: "cjs",
      exoticallyRequired: false,
    }));
}

/**
 * might be wise to distinguish the three types of /// directive that
 * can come out of this as the resolution algorithm might differ
 *
 * @param {import("typescript").Node} pAST - typescript syntax tree
 * @returns {{module: string, moduleSystem: string}[]} - 'tripple slash' dependencies
 */
function extractTrippleSlashDirectives(pAST) {
  return pAST.referencedFiles
    .map((pReference) => ({
      module: pReference.fileName,
      moduleSystem: "tsd",
      exoticallyRequired: false,
    }))
    .concat(
      pAST.typeReferenceDirectives.map((pReference) => ({
        module: pReference.fileName,
        moduleSystem: "tsd",
        exoticallyRequired: false,
      }))
    )
    .concat(
      pAST.amdDependencies.map((pReference) => ({
        module: pReference.path,
        moduleSystem: "tsd",
        exoticallyRequired: false,
      }))
    );
}

function firstArgumentIsAString(pASTNode) {
  const lFirstArgument = pASTNode.arguments[0];

  return (
    lFirstArgument &&
    // "thing" or 'thing'
    (typescript.SyntaxKind[lFirstArgument.kind] === "StringLiteral" ||
      // `thing`
      typescript.SyntaxKind[lFirstArgument.kind] === "FirstTemplateToken")
  );
}

function isRequireCallExpression(pASTNode) {
  return (
    typescript.SyntaxKind[pASTNode.kind] === "CallExpression" &&
    pASTNode.expression &&
    typescript.SyntaxKind[pASTNode.expression.originalKeywordKind] ===
      "RequireKeyword" &&
    firstArgumentIsAString(pASTNode)
  );
}

function isSingleExoticRequire(pASTNode, pString) {
  return (
    typescript.SyntaxKind[pASTNode.kind] === "CallExpression" &&
    pASTNode.expression &&
    pASTNode.expression.text === pString &&
    firstArgumentIsAString(pASTNode)
  );
}

/* eslint complexity:0 */
function isCompositeExoticRequire(pASTNode, pObjectName, pPropertyName) {
  return (
    typescript.SyntaxKind[pASTNode.kind] === "CallExpression" &&
    pASTNode.expression &&
    typescript.SyntaxKind[pASTNode.expression.kind] ===
      "PropertyAccessExpression" &&
    pASTNode.expression.expression &&
    typescript.SyntaxKind[pASTNode.expression.expression.kind] ===
      "Identifier" &&
    pASTNode.expression.expression.escapedText === pObjectName &&
    pASTNode.expression.name &&
    typescript.SyntaxKind[pASTNode.expression.name.kind] === "Identifier" &&
    pASTNode.expression.name.escapedText === pPropertyName &&
    firstArgumentIsAString(pASTNode)
  );
}

function isExoticRequire(pASTNode, pString) {
  const lRequireStringElements = pString.split(".");

  return lRequireStringElements.length > 1
    ? isCompositeExoticRequire(pASTNode, ...lRequireStringElements)
    : isSingleExoticRequire(pASTNode, pString);
}

function isDynamicImportExpression(pASTNode) {
  return (
    typescript.SyntaxKind[pASTNode.kind] === "CallExpression" &&
    pASTNode.expression &&
    typescript.SyntaxKind[pASTNode.expression.kind] === "ImportKeyword" &&
    firstArgumentIsAString(pASTNode)
  );
}

function isTypeImport(pASTNode) {
  return (
    typescript.SyntaxKind[pASTNode.kind] === "LastTypeNode" &&
    pASTNode.argument &&
    typescript.SyntaxKind[pASTNode.argument.kind] === "LiteralType" &&
    ((pASTNode.argument.literal &&
      typescript.SyntaxKind[pASTNode.argument.literal.kind] ===
        "StringLiteral") ||
      typescript.SyntaxKind[pASTNode.argument.literal.kind] ===
        "FirstTemplateToken")
  );
}
function walk(pResult, pExoticRequireStrings) {
  return (pASTNode) => {
    // require('a-string'), require(`a-template-literal`)
    if (isRequireCallExpression(pASTNode)) {
      pResult.push({
        module: pASTNode.arguments[0].text,
        moduleSystem: "cjs",
        exoticallyRequired: false,
      });
    }

    // const want = require; {lalala} = want('yudelyo'), window.require('elektron')
    pExoticRequireStrings.forEach((pExoticRequireString) => {
      if (isExoticRequire(pASTNode, pExoticRequireString)) {
        pResult.push({
          module: pASTNode.arguments[0].text,
          moduleSystem: "cjs",
          exoticallyRequired: true,
          exoticRequire: pExoticRequireString,
        });
      }
    });

    // import('a-string'), import(`a-template-literal`)
    if (isDynamicImportExpression(pASTNode)) {
      pResult.push({
        module: pASTNode.arguments[0].text,
        moduleSystem: "es6",
        dynamic: true,
        exoticallyRequired: false,
      });
    }

    // const atype: import('./types').T
    // const atype: import(`./types`).T
    if (isTypeImport(pASTNode)) {
      pResult.push({
        module: pASTNode.argument.literal.text,
        moduleSystem: "es6",
        exoticallyRequired: false,
      });
    }
    typescript.forEachChild(pASTNode, walk(pResult, pExoticRequireStrings));
  };
}

/**
 * returns an array of dependencies that come potentially nested within
 * a source file, like commonJS or dynamic imports
 *
 * @param {import("typescript").Node} pAST - typescript syntax tree
 * @returns {{module: string, moduleSystem: string}[]} - all commonJS dependencies
 */
function extractNestedDependencies(pAST, pExoticRequireStrings) {
  let lResult = [];

  walk(lResult, pExoticRequireStrings)(pAST);

  return lResult;
}

/**
 * returns all dependencies in the AST
 *
 * @type {(pTypeScriptAST: (import("typescript").Node), pExoticRequireStrings: string[]) => {module: string, moduleSystem: string, dynamic: boolean}[]}
 */
module.exports = function extractTypeScriptDependencies(
  pTypeScriptAST,
  pExoticRequireStrings
) {
  return Boolean(typescript)
    ? extractImportsAndExports(pTypeScriptAST)
        .concat(extractImportEquals(pTypeScriptAST))
        .concat(extractTrippleSlashDirectives(pTypeScriptAST))
        .concat(
          extractNestedDependencies(pTypeScriptAST, pExoticRequireStrings)
        )
        .map((pModule) => ({ dynamic: false, ...pModule }))
    : [];
};
