"use strict";

const walk = require('acorn/dist/walk');

function firstArgumentIsAString(pNodeArguments) {
    return Boolean(pNodeArguments) &&
        pNodeArguments[0] &&
        pNodeArguments[0].value &&
        typeof pNodeArguments[0].value === "string";
}

module.exports = (pAST, pDependencies, pModuleSystem) => {

    // var/const lalala = require('./lalala');
    // require('./lalala');
    // require('./lalala').doFunkyStuff();
    // require('zoinks!./wappie')
    walk.simple(
        pAST,
        {
            "CallExpression": pNode => {
                if (pNode.callee.type === "Identifier" &&
                    pNode.callee.name === "require" &&
                    firstArgumentIsAString(pNode.arguments)
                ){
                    pNode.arguments[0].value.split("!").forEach(pString =>
                        pDependencies.push({
                            moduleName: pString,
                            moduleSystem: pModuleSystem ? pModuleSystem : "cjs"
                        })
                    );
                }
            }
        }
    );
};
