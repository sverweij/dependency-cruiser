const walk = require('./walk');
const estreeHelpers = require('./estree-utl');

function firstArgumentIsAString(pArgumentsNode) {
    return Boolean(pArgumentsNode) &&
        pArgumentsNode[0] &&
        pArgumentsNode[0].value &&
        typeof pArgumentsNode[0].value === "string";
}

function isRequireIdentifier(pCallee) {
    return pCallee.type === "Identifier" &&
        pCallee.name === "require";
}

function isRequireCall(pNode){
    return isRequireIdentifier(pNode.callee) &&
        firstArgumentIsAString(pNode.arguments);
}

function firstArgumentIsATemplateLiteral(pArgumentsNode) {
    return Boolean(pArgumentsNode) &&
        pArgumentsNode[0] &&
        estreeHelpers.isPlaceholderlessTemplateLiteral(pArgumentsNode[0]);
}

function isRequireCallWithTemplateString(pNode){
    return isRequireIdentifier(pNode.callee) &&
        firstArgumentIsATemplateLiteral(pNode.arguments);
}

function pushRequireCallsToDependencies(pDependencies, pModuleSystem) {
    return pNode => {
        if (isRequireCall(pNode)) {
            pNode.arguments[0].value.split("!").forEach(
                pString => pDependencies.push({
                    moduleName: pString,
                    moduleSystem: pModuleSystem
                })
            );
        } else if (isRequireCallWithTemplateString(pNode)) {
            pDependencies.push({
                moduleName: pNode.arguments[0].quasis[0].value.cooked,
                moduleSystem: pModuleSystem
            });
        }
    };
}

module.exports = (pAST, pDependencies, pModuleSystem) => {
    pModuleSystem = pModuleSystem || "cjs";

    // var/const lalala = require('./lalala');
    // require('./lalala');
    // require('./lalala').doFunkyStuff();
    // require('zoinks!./wappie')
    // require(`./withatemplateliteral`)
    walk.simple(
        pAST,
        {
            "CallExpression": pushRequireCallsToDependencies(pDependencies, pModuleSystem)
        },
        // see https://github.com/acornjs/acorn/issues/746
        walk.base
    );
};
