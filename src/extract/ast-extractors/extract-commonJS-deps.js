"use strict";

const walk = require('acorn/dist/walk');

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

module.exports = (pAST, pDependencies, pModuleSystem) => {

    // var/const lalala = require('./lalala');
    // require('./lalala');
    // require('./lalala').doFunkyStuff();
    // require('zoinks!./wappie')
    walk.simple(
        pAST,
        {
            "CallExpression": pNode => {
                if (isRequireCall(pNode)){
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
