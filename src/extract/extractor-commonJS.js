"use strict";

const walk        = require('acorn/dist/walk');

exports.extract = (pAST, pDependencies, pModuleSystem) => {

    // var/const lalala = require('./lalala');
    // require('./lalala');
    // require('./lalala').doFunkyStuff();
    walk.simple(
        pAST,
        {
            "CallExpression": pNode => {
                if (pNode.callee.type === "Identifier" && pNode.callee.name === "require"){
                    if (pNode.arguments && pNode.arguments[0] && pNode.arguments[0].value){
                        pDependencies.push({
                            moduleName: pNode.arguments[0].value,
                            moduleSystem: pModuleSystem ? pModuleSystem : "cjs"
                        });
                    }
                }
            }
        }
    );
};
