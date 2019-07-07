const walk          = require('./walk');
const estreeHelpers = require('./estree-helpers');


function pushRequireCallsToDependencies(pDependencies, pModuleSystem) {
    return (pNode) => {
        if (estreeHelpers.isRequireIdentifier(pNode)) {
            if (estreeHelpers.firstArgumentIsAString(pNode.arguments)) {
                pNode.arguments[0].value.split("!").forEach(
                    pString => pDependencies.push({
                        moduleName: pString,
                        moduleSystem: pModuleSystem,
                        dynamic: false
                    })
                );
            } else if (estreeHelpers.firstArgumentIsATemplateLiteral(pNode.arguments)) {
                pDependencies.push({
                    moduleName: pNode.arguments[0].quasis[0].value.cooked,
                    moduleSystem: pModuleSystem,
                    dynamic: false
                });
            }
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
