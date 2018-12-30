const walk = require('acorn-walk');

function firstArgumentIsAString(pNodeArguments) {
    return Boolean(pNodeArguments) &&
        pNodeArguments[0] &&
        pNodeArguments[0].value &&
        typeof pNodeArguments[0].value === "string";
}

function isRequireIdentifier(pCallee) {
    return pCallee.type === "Identifier" &&
        pCallee.name === "require";
}

function isRequireCall(pNode){
    return isRequireIdentifier(pNode.callee) &&
        firstArgumentIsAString(pNode.arguments);
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
        }
    };
}

module.exports = (pAST, pDependencies, pModuleSystem) => {
    pModuleSystem = pModuleSystem || "cjs";

    // var/const lalala = require('./lalala');
    // require('./lalala');
    // require('./lalala').doFunkyStuff();
    // require('zoinks!./wappie')
    walk.simple(
        pAST,
        {
            "CallExpression": pushRequireCallsToDependencies(pDependencies, pModuleSystem)
        }
    );
};
