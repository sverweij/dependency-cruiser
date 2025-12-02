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

const INTERESTING_NODE_KINDS = new Set([
  typescript.SyntaxKind.CallExpression,
  typescript.SyntaxKind.ExportDeclaration,
  typescript.SyntaxKind.ImportDeclaration,
  typescript.SyntaxKind.ImportEqualsDeclaration,
  typescript.SyntaxKind.LastTypeNode,
]);

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
        pStatement.kind === typescript.SyntaxKind.ImportDeclaration &&
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
        pStatement.kind === typescript.SyntaxKind.ExportDeclaration &&
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
        pStatement.kind === typescript.SyntaxKind.ImportEqualsDeclaration &&
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
    (lFirstArgument.kind === typescript.SyntaxKind.StringLiteral ||
      // `thing`
      lFirstArgument.kind === typescript.SyntaxKind.FirstTemplateToken)
  );
}

function isRequireCallExpression(pASTNode) {
  if (
    pASTNode.kind === typescript.SyntaxKind.CallExpression &&
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
    pASTNode.kind === typescript.SyntaxKind.CallExpression &&
    pASTNode.expression &&
    pASTNode.expression.text === pString &&
    firstArgumentIsAString(pASTNode)
  );
}

/* eslint complexity:0 */
function isCompositeExoticRequire(pASTNode, pObjectName, pPropertyName) {
  return (
    pASTNode.kind === typescript.SyntaxKind.CallExpression &&
    pASTNode.expression &&
    pASTNode.expression.kind ===
      typescript.SyntaxKind.PropertyAccessExpression &&
    pASTNode.expression.expression &&
    pASTNode.expression.expression.kind === typescript.SyntaxKind.Identifier &&
    pASTNode.expression.expression.escapedText === pObjectName &&
    pASTNode.expression.name &&
    pASTNode.expression.name.kind === typescript.SyntaxKind.Identifier &&
    pASTNode.expression.name.escapedText === pPropertyName &&
    firstArgumentIsAString(pASTNode)
  );
}

function isTripleCursedCompositeExoticRequire(
  pASTNode,
  pObjectName1,
  pObjectName2,
  pPropertyName,
) {
  return (
    pASTNode.kind === typescript.SyntaxKind.CallExpression &&
    pASTNode.expression &&
    pASTNode.expression.kind ===
      typescript.SyntaxKind.PropertyAccessExpression &&
    pASTNode.expression.expression &&
    pASTNode.expression.expression.kind ===
      typescript.SyntaxKind.PropertyAccessExpression &&
    // globalThis
    pASTNode.expression.expression.expression &&
    pASTNode.expression.expression.expression.kind ===
      typescript.SyntaxKind.Identifier &&
    pASTNode.expression.expression.expression.escapedText === pObjectName1 &&
    // process
    pASTNode.expression.expression.name.kind ===
      typescript.SyntaxKind.Identifier &&
    pASTNode.expression.expression.name.escapedText === pObjectName2 &&
    // getBuiltinModule
    pASTNode.expression.name &&
    pASTNode.expression.name.kind === typescript.SyntaxKind.Identifier &&
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
    pASTNode.kind === typescript.SyntaxKind.CallExpression &&
    pASTNode.expression &&
    pASTNode.expression.kind === typescript.SyntaxKind.ImportKeyword &&
    firstArgumentIsAString(pASTNode)
  );
}

function isTypeImport(pASTNode) {
  return (
    pASTNode.kind === typescript.SyntaxKind.LastTypeNode &&
    pASTNode.argument &&
    pASTNode.argument.kind === typescript.SyntaxKind.LiteralType &&
    ((pASTNode.argument.literal &&
      pASTNode.argument.literal.kind === typescript.SyntaxKind.StringLiteral) ||
      pASTNode.argument.literal.kind ===
        typescript.SyntaxKind.FirstTemplateToken)
  );
}

function extractJSDocImportTags(pJSDocTags) {
  return pJSDocTags
    .filter(
      (pTag) =>
        pTag.tagName.escapedText === "import" &&
        pTag.moduleSpecifier &&
        pTag.moduleSpecifier.kind === typescript.SyntaxKind.StringLiteral &&
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
    pTypeNode?.kind === typescript.SyntaxKind.LastTypeNode &&
    pTypeNode.argument?.kind === typescript.SyntaxKind.LiteralType &&
    pTypeNode.argument?.literal?.kind === typescript.SyntaxKind.StringLiteral &&
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
    for (const lValue of pObject) {
      walkJSDoc(lValue, pCollection);
    }
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
        pTag.typeExpression?.kind === typescript.SyntaxKind.FirstJSDocNode,
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

// eslint-disable-next-line max-lines-per-function
function visitNode(
  pResult,
  pASTNode,
  pExoticRequireStrings,
  pDetectProcessBuiltinModuleCalls,
) {
  // checks are in order of ~expected frequency

  // early returns as these types of dependencyTypes cannot occur at the same
  // time in a single AST node
  // require('a-string'), require(`a-template-literal`)
  if (isRequireCallExpression(pASTNode)) {
    pResult.push({
      module: pASTNode.arguments[0].text,
      moduleSystem: "cjs",
      exoticallyRequired: false,
      dependencyTypes: ["require"],
    });
    return;
  }

  // import('a-string'), import(`a-template-literal`)
  if (isDynamicImportExpression(pASTNode)) {
    pResult.push({
      module: pASTNode.arguments[0].text,
      moduleSystem: "es6",
      dynamic: true,
      exoticallyRequired: false,
      dependencyTypes: ["dynamic-import"],
    });
    return;
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
    return;
  }

  // const want = require; {lalala} = want('yudelyo'), window.require('elektron')
  if (pASTNode.kind === typescript.SyntaxKind.CallExpression) {
    for (const lExoticRequireString of pExoticRequireStrings) {
      if (isExoticRequire(pASTNode, lExoticRequireString)) {
        pResult.push({
          module: pASTNode.arguments[0].text,
          moduleSystem: "cjs",
          exoticallyRequired: true,
          exoticRequire: lExoticRequireString,
          dependencyTypes: ["exotic-require"],
        });
        return;
      }
    }
  }

  // const path = process.getBuiltinModule('node:path'); const fs = globalThis.process.getBuiltinModule(`node:fs`);
  if (
    pDetectProcessBuiltinModuleCalls &&
    (isCompositeExoticRequire(pASTNode, "process", "getBuiltinModule") ||
      isTripleCursedCompositeExoticRequire(
        pASTNode,
        "globalThis",
        "process",
        "getBuiltinModule",
      ))
  ) {
    pResult.push({
      module: pASTNode.arguments[0].text,
      moduleSystem: "cjs",
      exoticallyRequired: false,
      dependencyTypes: ["process-get-builtin-module"],
    });
  }
}

/**
 * Walks the AST and collects all dependencies
 *
 * @param {Node} pASTNode - the AST node to start from
 * @param {string[]} pExoticRequireStrings - exotic require strings to look for
 * @param {boolean} pDetectJSDocImports - whether to detect jsdoc imports
 * @returns {(pASTNode: Node) => void} - the walker function
 */
function walk(
  pResult,
  pExoticRequireStrings,
  pDetectJSDocImports,
  pDetectProcessBuiltinModuleCalls,
) {
  return (pASTNode) => {
    // /** @import thing from './module' */ etc
    // /** @type {import('module').thing}*/ etc
    if (pDetectJSDocImports && pASTNode.jsDoc) {
      const lJSDocImports = extractJSDocImports(pASTNode.jsDoc);

      // pResult = pResult.concat(lJSDocImports) looks like the more obvious
      // way to do this, but it re-assigns the pResult parameter
      for (const lImport of lJSDocImports) {
        pResult.push(lImport);
      }
    }

    if (INTERESTING_NODE_KINDS.has(pASTNode.kind)) {
      visitNode(
        pResult,
        pASTNode,
        pExoticRequireStrings,
        pDetectProcessBuiltinModuleCalls,
      );
    }

    typescript.forEachChild(
      pASTNode,
      walk(
        pResult,
        pExoticRequireStrings,
        pDetectJSDocImports,
        pDetectProcessBuiltinModuleCalls,
      ),
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
  pDetectProcessBuiltinModuleCalls,
) {
  let lResult = [];

  walk(
    lResult,
    pExoticRequireStrings,
    pDetectJSDocImports,
    pDetectProcessBuiltinModuleCalls,
  )(pAST);

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
  pDetectProcessBuiltinModuleCalls,
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
            pDetectProcessBuiltinModuleCalls,
          ),
        )
        .map((pModule) => ({ dynamic: false, ...pModule }))
    : /* c8 ignore next */ [];
}
