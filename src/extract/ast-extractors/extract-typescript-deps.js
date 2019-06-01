/* eslint-disable valid-jsdoc */
const tryRequire = require('semver-try-require');
const $package   = require('../../../package.json');

const typescript = tryRequire('typescript', $package.supportedTranspilers.typescript);

/*
 * Both extractImport* assume the imports/ exports can only occur at
 * top level. AFAIK this the only place they're allowed, so we should
 * be good. Otherwise we'll need to walk the tree.
 */

/**
 * Get all import and export statements from the top level AST node
 *
 * @param {import("typescript").Node} pAST - the (top-level in this case) AST node
 * @returns {{moduleName: string, moduleSystem: string}[]} - all import and export statements in the
 *                                  (top level) AST node
 */
function extractImportsAndExports(pAST) {
    return pAST.statements
        .filter(pStatement =>
            (
                typescript.SyntaxKind[pStatement.kind] === 'ImportDeclaration' ||
                typescript.SyntaxKind[pStatement.kind] === 'ExportDeclaration'
            ) &&
            Boolean(pStatement.moduleSpecifier)
        ).map(pStatement => ({
            moduleName: pStatement.moduleSpecifier.text,
            moduleSystem: 'es6'
        }));
}

/**
 * Get all import equals statements from the top level AST node
 *
 * @param {import("typescript").Node} pAST - the (top-level in this case) AST node
 * @returns {{moduleName: string, moduleSystem: string}[]} - all import equals statements in the
 *                                  (top level) AST node
 */
function extractImportEquals(pAST) {
    return pAST.statements
        .filter(pStatement =>
            typescript.SyntaxKind[pStatement.kind] === 'ImportEqualsDeclaration' &&
            pStatement.moduleReference &&
            pStatement.moduleReference.expression &&
            pStatement.moduleReference.expression.text
        ).map(pStatement => ({
            moduleName: pStatement.moduleReference.expression.text,
            moduleSystem: 'cjs'
        }));
}

/**
 * might be wise to distinguish the three types of /// directive that
 * can come out of this as the resolution algorithm might differ
 *
 * @param {import("typescript").Node} pAST - typescript syntax tree
 * @returns {{moduleName: string, moduleSystem: string}[]} - 'tripple slash' dependencies
 */
function extractTrippleSlashDirectives(pAST) {
    return pAST.referencedFiles.map(
        pReference => ({
            moduleName: pReference.fileName,
            moduleSystem: 'tsd'
        })
    ).concat(
        pAST.typeReferenceDirectives.map(
            pReference => ({
                moduleName: pReference.fileName,
                moduleSystem: 'tsd'
            })
        )
    ).concat(
        pAST.amdDependencies.map(
            pReference => ({
                moduleName: pReference.path,
                moduleSystem: 'tsd'
            })
        )
    );
}

function isRequireCallExpression(pASTNode) {
    return typescript.SyntaxKind[pASTNode.kind] === 'CallExpression' &&
        typescript.SyntaxKind[pASTNode.expression.originalKeywordKind] === 'RequireKeyword';
}

function isDynamicImportExpression(pASTNode) {
    return typescript.SyntaxKind[pASTNode.kind] === 'CallExpression' &&
        typescript.SyntaxKind[pASTNode.expression.kind] === 'ImportKeyword';
}

function isTypeImport(pASTNode) {
    return typescript.SyntaxKind[pASTNode.kind] === 'LastTypeNode' &&
        typescript.SyntaxKind[pASTNode.argument.kind] === 'LiteralType' &&
        (
            typescript.SyntaxKind[pASTNode.argument.literal.kind] === 'StringLiteral' ||
            typescript.SyntaxKind[pASTNode.argument.literal.kind] === 'FirstTemplateToken'
        );
}

function firstArgIsAString(pASTNode) {
    const lFirstArgument = pASTNode.arguments[0];

    return lFirstArgument &&
        (
            // "thing" or 'thing'
            typescript.SyntaxKind[lFirstArgument.kind] === "StringLiteral" ||
            // `thing`
            typescript.SyntaxKind[lFirstArgument.kind] === "FirstTemplateToken"
        );
}

/**
 * returns an array of dependencies that come potentially nested within
 * a source file, like commonJS or dynamic imports
 *
 * @param {import("typescript").Node} pAST - typescript syntax tree
 * @returns {{moduleName: string, moduleSystem: string}[]} - all commonJS dependencies
 */
function extractNestedDependencies(pAST) {
    let lResult = [];

    function walk (pASTNode) {
        // require('a-string'), require(`a-template-literal`)
        if (isRequireCallExpression(pASTNode) && firstArgIsAString(pASTNode)) {
            lResult.push({
                moduleName: pASTNode.arguments[0].text,
                moduleSystem: 'cjs'
            });
        }
        // import('a-string'), import(`a-template-literal`)
        if (isDynamicImportExpression(pASTNode) && firstArgIsAString(pASTNode)) {
            lResult.push({
                moduleName: pASTNode.arguments[0].text,
                moduleSystem: 'es6'
            });
        }
        // const atype: import('./types').T
        // const atype: import(`./types`).T
        if (isTypeImport(pASTNode)) {
            lResult.push({
                moduleName: pASTNode.argument.literal.text,
                moduleSystem: 'es6'
            });
        }
        typescript.forEachChild(pASTNode, walk);
    }

    walk(pAST);

    return lResult;
}


/**
 * returns all dependencies in the (top level) AST
 *
 * @type {(pTypeScriptAST: import("typescript").Node) => {moduleName: string, moduleSystem: string}[]}
 */
module.exports = (pTypeScriptAST) =>
    Boolean(typescript)
        ? extractImportsAndExports(pTypeScriptAST)
            .concat(extractImportEquals(pTypeScriptAST))
            .concat(extractTrippleSlashDirectives(pTypeScriptAST))
            .concat(extractNestedDependencies(pTypeScriptAST))
        : [];


