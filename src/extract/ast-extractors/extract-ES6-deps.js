const _get = require('lodash/get');
const walk = require('./walk');

function isImportStatement(pNode) {
    return 'Import' === _get(pNode, 'callee.type');
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
        if (isImportStatement(pNode) && hasStringArgument(pNode)) {
            pDependencies.push({
                moduleName: pNode.arguments.find(isStringLiteral).value,
                moduleSystem: "es6"
            });
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
