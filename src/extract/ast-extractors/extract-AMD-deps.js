const walk                        = require('acorn-walk');
const extractCommonJSDependencies = require("./extract-commonJS-deps");

function extractRegularAMDDependencies(pNode, pDependencies) {
    if (pNode.expression.type === "CallExpression" &&
        pNode.expression.callee.type === "Identifier" &&
        (pNode.expression.callee.name === "define" ||
            pNode.expression.callee.name === "require")) {
        pNode.expression.arguments
            .filter(pArg => pArg.type === "ArrayExpression")
            .forEach(arg => arg.elements.forEach(el => {
                if (Boolean(el.value) && typeof el.value === "string") {
                    el.value.split('!').forEach(pString => pDependencies.push({
                        moduleName: pString,
                        moduleSystem: "amd"
                    }));
                }
            }));
    }
}

function extractCommonJSWrappers(pNode, pDependencies) {
    if (pNode.expression.type === "CallExpression" &&
        pNode.expression.callee.type === "Identifier" &&
        pNode.expression.callee.name === "define") {
        pNode.expression.arguments
            .filter(pArg => pArg.type === "FunctionExpression")
            .filter(pFunction => pFunction.params.some(pParam => pParam.name === "require"))
            .forEach(pFunction => extractCommonJSDependencies(pFunction.body, pDependencies, "amd"));
    }
}

module.exports = (pAST, pDependencies) => {
    walk.simple(
        pAST,
        {
            "ExpressionStatement": pNode => {
                // module as a function (define(Array, function))
                // module with a name (define(string, Array, function))
                // 'root' require module (require(Array, function)
                extractRegularAMDDependencies(pNode, pDependencies);
                // CommonJS-wrappers:
                //  (define(function(require, exports, module){
                //  define(["require", ...], function(require, ...){
                //      ... every 'require' call is a depencency
                // Won't work if someone decides to name the first parameter of
                // the function passed to the define something else from "require"
                extractCommonJSWrappers(pNode, pDependencies);
            }
        }
    );
};
