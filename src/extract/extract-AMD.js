"use strict";

const walk                        = require('acorn/dist/walk');
const extractCommonJSDependencies = require("./extract-commonJS");

module.exports = (pAST, pDependencies) => {
    walk.simple(
        pAST,
        {
            "ExpressionStatement": pNode => {
                // module as a function (define(Array, function))
                // module with a name (define(string, Array, function))
                // 'root' require module (require(Array, function)
                if (pNode.expression.type === "CallExpression" &&
                     pNode.expression.callee.type === "Identifier" &&
                     (pNode.expression.callee.name === "define" ||
                       pNode.expression.callee.name === "require")){
                    pNode.expression.arguments
                        .filter(pArg => pArg.type === "ArrayExpression")
                        .forEach(arg =>
                            arg.elements.forEach(el =>
                                el.value.split('!').forEach(pString =>
                                    pDependencies.push({
                                        moduleName: pString,
                                        moduleSystem: "amd"
                                    })
                                )
                            )
                        );
                }
                // CommonJS-wrappers:
                //  (define(function(require, exports, module){
                //  define(["require", ...], function(require, ...){
                //      ... every 'require' call is a depencency
                // Won't work if someone decides to name the first parameter of
                // the function passed to the define something else from "require"
                if (pNode.expression.type === "CallExpression" &&
                     pNode.expression.callee.type === "Identifier" &&
                     pNode.expression.callee.name === "define") {
                    pNode.expression.arguments
                        .filter(pArg => pArg.type === "FunctionExpression")
                        .forEach(pFunction => {
                            if (pFunction.params.filter(pParam => pParam.name === "require")){
                                extractCommonJSDependencies(pFunction.body, pDependencies, "amd");
                            }
                        });
                }
            }
        }
    );
};
