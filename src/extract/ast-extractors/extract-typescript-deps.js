"use strict";

const tryRequire = require('semver-try-require');
const $package   = require('../../../package.json');

const typescript = tryRequire('typescript', $package.supportedTranspilers.typescript);

/*
 * Both extractImport* assume the imports/ exports can only occur at
 * top level. AFAIK this the only place they're allowed, so we should
 * be good. Otherwise we'll need to walk the tree.
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
 * @param {*} pAST - typescript syntax tree
 * @returns {object} - 'tripple slash' dependencies
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

module.exports = (pTypeScriptAST) =>
    Boolean(typescript)
        ? extractImportsAndExports(pTypeScriptAST)
            .concat(extractImportEquals(pTypeScriptAST))
            .concat(extractTrippleSlashDirectives(pTypeScriptAST))
        : [];

