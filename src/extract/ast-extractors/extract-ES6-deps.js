const _get = require('lodash/get');
const walk = require('./walk');

function isImportStatement(pNode) {
    return 'Import' === _get(pNode, 'callee.type');
}
function isPlaceholderlessTemplateLiteral(pArgument){
    return pArgument.type === 'TemplateLiteral' &&
        pArgument.quasis.length === 1 &&
        pArgument.expressions.length === 0;
}

function hasPlaceholderlessTemplateLiteralArgument(pNode) {
    return _get(pNode, 'arguments', []).some(isPlaceholderlessTemplateLiteral);
}
function isStringLiteral(pArgument) {
    return pArgument.type === 'Literal' &&
        typeof pArgument.value === 'string';
}

function hasStringArgument(pNode) {
    return _get(pNode, 'arguments', []).some(isStringLiteral);
}

function pushImportNodeValue(pDependencies) {
    return (pNode) => {
        if (isImportStatement(pNode)) {
            if (hasStringArgument(pNode)) {
                pDependencies.push({
                    moduleName: pNode.arguments.find(isStringLiteral).value,
                    moduleSystem: "es6"
                });
            } else if (hasPlaceholderlessTemplateLiteralArgument(pNode)) {
                pDependencies.push({
                    moduleName: pNode.arguments.find(isPlaceholderlessTemplateLiteral).quasis[0].value.cooked,
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
