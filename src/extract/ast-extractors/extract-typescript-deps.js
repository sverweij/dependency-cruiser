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

/**
 * returns an array of all commonJS in the AST (toplevel or otherwise)
 *
 * @param {import("typescript").Node} pAST - typescript syntax tree
 * @returns {{moduleName: string, moduleSystem: string}[]} - all commonJS dependencies
 */
function extractCommonJS(pAST) {
    let lResult = [];

    function walk (pASTNode) {
        if (typescript.SyntaxKind[pASTNode.kind] === 'CallExpression' &&
            typescript.SyntaxKind[pASTNode.expression.originalKeywordKind] === 'RequireKeyword') {
            const lFirstArgument = pASTNode.arguments.shift();

            if (lFirstArgument) {
                lResult.push({
                    moduleName: lFirstArgument.text,
                    moduleSystem: 'cjs'
                });
            }
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
            .concat(extractCommonJS(pTypeScriptAST))
        : [];
