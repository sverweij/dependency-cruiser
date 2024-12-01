/* eslint-disable security/detect-object-injection */
/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable max-lines */
/* eslint-disable no-inline-comments */
import tryImport from "#utl/try-import.mjs";
import meta from "#meta.cjs";

/**
 * @import typescript, {Node} from "typescript"
 */

/** @type {typescript} */
const typescript = await tryImport(
  "typescript",
  meta.supportedTranspilers.typescript,
);

function isTypeOnlyImport(pStatement) {
  return (
    pStatement.importClause &&
    (pStatement.importClause.isTypeOnly ||
      (pStatement.importClause.namedBindings &&
        pStatement.importClause.namedBindings.elements &&
        pStatement.importClause.namedBindings.elements.every(
          (pElement) => pElement.isTypeOnly,
        )))
  );
}

function isTypeOnlyExport(pStatement) {
  return (
    // for some reason the isTypeOnly indicator is on _statement_ level
    // and not in exportClause as it is in the importClause ¯\_(ツ)_/¯.
    // Also in the case of the omission of an alias the exportClause
    // is not there entirely. So regardless whether there is a
    // pStatement.exportClause or not, we can directly test for the
    // isTypeOnly attribute.
    pStatement.isTypeOnly ||
    // named reexports are per-element though
    (pStatement.exportClause &&
      pStatement.exportClause.elements &&
      pStatement.exportClause.elements.every((pElement) => pElement.isTypeOnly))
  );
}

/*
 * Both extractImport* assume the imports/ exports can only occur at
 * top level. AFAIK this the only place they're allowed, so we should
 * be good. Otherwise we'll need to walk the tree.
 */

/**
 * Get all import statements from the top level AST node
 *
 * @param {Node} pAST - the (top-level in this case) AST node
 * @returns {{module: string; moduleSystem: string; exoticallyRequired: boolean; dependencyTypes?: string[];}[]} -
 *                                  all import statements in the (top level) AST node
 */
function extractImports(pAST) {
  return pAST.statements
    .filter(
      (pStatement) =>
        typescript.SyntaxKind[pStatement.kind] === "ImportDeclaration" &&
        pStatement.moduleSpecifier,
    )
    .map((pStatement) => ({
      module: pStatement.moduleSpecifier.text,
      moduleSystem: "es6",
      exoticallyRequired: false,
      ...(isTypeOnlyImport(pStatement)
        ? { dependencyTypes: ["type-only", "import"] }
        : { dependencyTypes: ["import"] }),
    }));
}

/**
 * Get all export statements from the top level AST node
 *
 * @param {Node} pAST - the (top-level in this case) AST node
 * @returns {{module: string; moduleSystem: string; exoticallyRequired: boolean; dependencyTypes?: string[];}[]} -
 *                                  all export statements in the (top level) AST node
 */
function extractExports(pAST) {
  return pAST.statements
    .filter(
      (pStatement) =>
        typescript.SyntaxKind[pStatement.kind] === "ExportDeclaration" &&
        pStatement.moduleSpecifier,
    )
    .map((pStatement) => ({
      module: pStatement.moduleSpecifier.text,
      moduleSystem: "es6",
      exoticallyRequired: false,
      ...(isTypeOnlyExport(pStatement)
        ? { dependencyTypes: ["type-only", "export"] }
        : { dependencyTypes: ["export"] }),
    }));
}

/**
 * Get all import equals statements from the top level AST node
 *
 * E.g. import thing = require('some-thing')
 * Ignores import equals of variables (e.g. import protocol = ts.server.protocol
 * which happens in typescript/lib/protocol.d.ts)
 *
 * @param {Node} pAST - the (top-level in this case) AST node
 * @returns {{module: string, moduleSystem: string;exoticallyRequired: boolean;}[]} - all import equals statements in the
 *                                  (top level) AST node
 */
function extractImportEquals(pAST) {
  return pAST.statements
    .filter(
      (pStatement) =>
        typescript.SyntaxKind[pStatement.kind] === "ImportEqualsDeclaration" &&
        pStatement.moduleReference &&
        pStatement.moduleReference.expression &&
        pStatement.moduleReference.expression.text,
    )
    .map((pStatement) => ({
      module: pStatement.moduleReference.expression.text,
      moduleSystem: "cjs",
      exoticallyRequired: false,
      dependencyTypes: ["import-equals"],
    }));
}

/**
 * might be wise to distinguish the three types of /// directive that
 * can come out of this as the resolution algorithm might differ
 *
 * @param {Node} pAST - typescript syntax tree
 * @returns {{module: string, moduleSystem: string}[]} - 'tripple slash' dependencies
 */
function extractTripleSlashDirectives(pAST) {
  return pAST.referencedFiles
    .map((pReference) => ({
      module: pReference.fileName,
      moduleSystem: "tsd",
      exoticallyRequired: false,
      dependencyTypes: [
        "triple-slash-directive",
        "triple-slash-file-reference",
      ],
    }))
    .concat(
      pAST.typeReferenceDirectives.map((pReference) => ({
        module: pReference.fileName,
        moduleSystem: "tsd",
        exoticallyRequired: false,
        dependencyTypes: [
          "triple-slash-directive",
          "triple-slash-type-reference",
        ],
      })),
    )
    .concat(
      pAST.amdDependencies.map((pReference) => ({
        module: pReference.path,
        moduleSystem: "tsd",
        exoticallyRequired: false,
        dependencyTypes: [
          "triple-slash-directive",
          "triple-slash-amd-dependency",
        ],
      })),
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
  if (
    typescript.SyntaxKind[pASTNode.kind] === "CallExpression" &&
    pASTNode.expression
  ) {
    /*
     * from typescript 5.0.0 the `originalKeywordKind` attribute is deprecated
     * and from 5.2.0 it will be gone. However, in typescript < 5.0.0 (still used
     * heavily IRL) it's the only way to get it - hence this test for the
     * existence of the * identifierToKeywordKind function to remain backwards
     * compatible
     */
    const lSyntaxKind = typescript.identifierToKeywordKind
      ? typescript.SyntaxKind[
          typescript.identifierToKeywordKind(pASTNode.expression)
        ]
      : /* c8 ignore next 1 */
        typescript.SyntaxKind[pASTNode.expression.originalKeywordKind];
    return lSyntaxKind === "RequireKeyword" && firstArgumentIsAString(pASTNode);
  }
  return false;
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

function extractJSDocImportTags(pJSDocTags) {
  return pJSDocTags
    .filter(
      (pTag) =>
        pTag.tagName.escapedText === "import" &&
        pTag.moduleSpecifier &&
        typescript.SyntaxKind[pTag.moduleSpecifier.kind] === "StringLiteral" &&
        pTag.moduleSpecifier.text,
    )
    .map((pTag) => ({
      module: pTag.moduleSpecifier.text,
      moduleSystem: "es6",
      exoticallyRequired: false,
      dependencyTypes: ["type-only", "import", "jsdoc", "jsdoc-import-tag"],
    }));
}

function isJSDocImport(pTypeNode) {
  // import('./hello.mjs') within jsdoc
  return (
    typescript.SyntaxKind[pTypeNode?.kind] === "LastTypeNode" &&
    typescript.SyntaxKind[pTypeNode.argument?.kind] === "LiteralType" &&
    typescript.SyntaxKind[pTypeNode.argument?.literal?.kind] ===
      "StringLiteral" &&
    pTypeNode.argument.literal.text
  );
}

function keyInJSDocIsIgnorable(pKey) {
  return [
    "parent",
    "pos",
    "end",
    "flags",
    "emitNode",
    "modifierFlagsCache",
    "transformFlags",
    "id",
    "flowNode",
    "symbol",
    "original",
  ].includes(pKey);
}

export function walkJSDoc(pObject, pCollection = new Set()) {
  if (isJSDocImport(pObject)) {
    pCollection.add(pObject.argument.literal.text);
  } else if (Array.isArray(pObject)) {
    pObject.forEach((pValue) => walkJSDoc(pValue, pCollection));
  } else if (typeof pObject === "object") {
    for (const lKey in pObject) {
      if (!keyInJSDocIsIgnorable(lKey) && pObject[lKey]) {
        walkJSDoc(pObject[lKey], pCollection);
      }
    }
  }
}

export function getJSDocImports(pTagNode) {
  const lCollection = new Set();
  walkJSDoc(pTagNode, lCollection);
  return Array.from(lCollection);
}

function extractJSDocBracketImports(pJSDocTags) {
  // https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html
  return pJSDocTags
    .filter(
      (pTag) =>
        pTag.tagName.escapedText !== "import" &&
        typescript.SyntaxKind[pTag.typeExpression?.kind] === "FirstJSDocNode",
    )
    .flatMap((pTag) => getJSDocImports(pTag))
    .map((pImportName) => ({
      module: pImportName,
      moduleSystem: "es6",
      exoticallyRequired: false,
      dependencyTypes: ["type-only", "import", "jsdoc", "jsdoc-bracket-import"],
    }));
}

function extractJSDocImports(pJSDocNodes) {
  // https://devblogs.microsoft.com/typescript/announcing-typescript-5-5/#the-jsdoc-import-tag
  const lJSDocNodesWithTags = pJSDocNodes.filter(
    (pJSDocLine) => pJSDocLine.tags,
  );
  const lJSDocImportTags = lJSDocNodesWithTags.flatMap((pJSDocLine) =>
    extractJSDocImportTags(pJSDocLine.tags),
  );
  const lJSDocBracketImports = lJSDocNodesWithTags.flatMap((pJSDocLine) =>
    extractJSDocBracketImports(pJSDocLine.tags),
  );
  return lJSDocImportTags.concat(lJSDocBracketImports);
}

/**
 * Walks the AST and collects all dependencies
 *
 * @param {Node} pASTNode - the AST node to start from
 * @param {string[]} pExoticRequireStrings - exotic require strings to look for
 * @param {boolean} pDetectJSDocImports - whether to detect jsdoc imports
 * @returns {(pASTNode: Node) => void} - the walker function
 */
// eslint-disable-next-line max-lines-per-function
function walk(pResult, pExoticRequireStrings, pDetectJSDocImports) {
  // eslint-disable-next-line max-lines-per-function
  return (pASTNode) => {
    // require('a-string'), require(`a-template-literal`)
    if (isRequireCallExpression(pASTNode)) {
      pResult.push({
        module: pASTNode.arguments[0].text,
        moduleSystem: "cjs",
        exoticallyRequired: false,
        dependencyTypes: ["require"],
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
          dependencyTypes: ["exotic-require"],
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
        dependencyTypes: ["dynamic-import"],
      });
    }

    // const atype: import('./types').T
    // const atype: import(`./types`).T
    if (isTypeImport(pASTNode)) {
      pResult.push({
        module: pASTNode.argument.literal.text,
        moduleSystem: "es6",
        exoticallyRequired: false,
        dependencyTypes: ["type-import"],
      });
    }

    // /** @import thing from './module' */ etc
    // /** @type {import('module').thing}*/ etc
    if (pDetectJSDocImports && pASTNode.jsDoc) {
      const lJSDocImports = extractJSDocImports(pASTNode.jsDoc);

      // pResult = pResult.concat(lJSDocImports) looks like the more obvious
      // way to do this, but it re-assigns the pResult parameter
      lJSDocImports.forEach((pImport) => {
        pResult.push(pImport);
      });
    }
    typescript.forEachChild(
      pASTNode,
      walk(pResult, pExoticRequireStrings, pDetectJSDocImports),
    );
  };
}

/**
 * returns an array of dependencies that come potentially nested within
 * a source file, like commonJS or dynamic imports
 *
 * @param {Node} pAST - typescript syntax tree
 * @param {string[]} pExoticRequireStrings - exotic require strings to look for
 * @param {boolean} pDetectJSDocImports - whether to detect jsdoc imports
 * @returns {{module: string, moduleSystem: string}[]} - all commonJS dependencies
 */
function extractNestedDependencies(
  pAST,
  pExoticRequireStrings,
  pDetectJSDocImports,
) {
  let lResult = [];

  walk(lResult, pExoticRequireStrings, pDetectJSDocImports)(pAST);

  return lResult;
}

/**
 * returns all dependencies in the AST
 *
 * @type {(pTypeScriptAST: (Node), pExoticRequireStrings: string[], pDetectJSDocImports: boolean) => {module: string, moduleSystem: string, dynamic: boolean}[]}
 */
export default function extractTypeScriptDependencies(
  pTypeScriptAST,
  pExoticRequireStrings,
  pDetectJSDocImports,
) {
  // console.dir(pTypeScriptAST, { depth: 100 });
  return typescript
    ? extractImports(pTypeScriptAST)
        .concat(extractExports(pTypeScriptAST))
        .concat(extractImportEquals(pTypeScriptAST))
        .concat(extractTripleSlashDirectives(pTypeScriptAST))
        .concat(
          extractNestedDependencies(
            pTypeScriptAST,
            pExoticRequireStrings,
            pDetectJSDocImports,
          ),
        )
        .map((pModule) => ({ dynamic: false, ...pModule }))
    : /* c8 ignore next */ [];
}
