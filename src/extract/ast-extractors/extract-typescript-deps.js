"use strict";

/*
 * Both extractImport* assume the imports/ exports can only occur at
 * top level. AFAIK this the only place they're allowed, so we should
 * be good. Otherwise we'll need to walk the tree.
 */
function extractImportsAndExports(pAST) {
    const IMPORT_DECLARATION_KIND = 238;
    const EXPORT_DECLARATION_KIND = 244;

    return pAST.statements
        .filter(pStatement =>
            (
                pStatement.kind === IMPORT_DECLARATION_KIND ||
                pStatement.kind === EXPORT_DECLARATION_KIND
            ) &&
            Boolean(pStatement.moduleSpecifier)
        ).map(pStatement => ({
            moduleName: pStatement.moduleSpecifier.text,
            moduleSystem: 'es6'
        }));
}

function extractImportEquals(pAST) {
    const IMPORT_EQUALS_DECLARATION_KIND = 237;

    return pAST.statements
        .filter(pStatement =>
            pStatement.kind === IMPORT_EQUALS_DECLARATION_KIND
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
    extractImportsAndExports(pTypeScriptAST)
        .concat(extractImportEquals(pTypeScriptAST))
        .concat(extractTrippleSlashDirectives(pTypeScriptAST));

