"use strict";

const walk = require('acorn/dist/walk');

module.exports = (pAST, pDependencies, pModuleSystem) => {

    // var/const lalala = require('./lalala');
    // require('./lalala');
    // require('./lalala').doFunkyStuff();
    // require('zoinks!./wappie')
    walk.simple(
        pAST,
        {
            "CallExpression": pNode => {
                if (pNode.callee.type === "Identifier" && pNode.callee.name === "require"){
                    if (pNode.arguments && pNode.arguments[0] && pNode.arguments[0].value){
                        pNode.arguments[0].value.split("!").forEach(pString =>
                            pDependencies.push({
                                moduleName: pString,
                                moduleSystem: pModuleSystem ? pModuleSystem : "cjs"
                            })
                        );
                    }
                }
            }
        }
    );
};
