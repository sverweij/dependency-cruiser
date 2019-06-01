const _get = require('lodash/get');
const walk = require('./walk');
const estreeHelpers = require('./estree-utl');

function isImportStatement(pNode) {
    return 'Import' === _get(pNode, 'callee.type');
}

function hasPlaceholderlessTemplateLiteralArgument(pNode) {
    return estreeHelpers.isPlaceholderlessTemplateLiteral(
        _get(pNode, 'arguments[0]', {})
    );
}
function isStringLiteral(pArgument) {
    return pArgument.type === 'Literal' &&
        typeof pArgument.value === 'string';
}

function hasStringArgument(pNode) {
    return isStringLiteral(
        _get(pNode, 'arguments[0]', {})
    );
}

function pushImportNodeValue(pDependencies) {
    return (pNode) => {
        if (isImportStatement(pNode)) {
            if (hasStringArgument(pNode)) {
                pDependencies.push({
                    moduleName: pNode.arguments[0].value,
                    moduleSystem: "es6"
                });
            } else if (hasPlaceholderlessTemplateLiteralArgument(pNode)) {
                pDependencies.push({
                    moduleName: pNode.arguments[0].quasis[0].value.cooked,
                    moduleSystem: "es6"
                });
            }

        }
    };
}

module.exports = (pAST, pDependencies) => {
    function pushSourceValue(pNode){
        if (pNode.source && pNode.source.value){
            pDependencies.push({
                moduleName: pNode.source.value,
                moduleSystem: "es6"
            });
        }
    }

    walk.simple(
        pAST,
        {
            "ImportDeclaration"     : pushSourceValue,
            "ExportAllDeclaration"  : pushSourceValue,
            "ExportNamedDeclaration": pushSourceValue,
            "CallExpression"        : pushImportNodeValue(pDependencies)
        },
        // see https://github.com/acornjs/acorn/issues/746
        walk.base
    );
};
