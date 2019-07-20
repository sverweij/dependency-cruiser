const walk = require("./walk");
const extractCommonJSDependencies = require("./extract-commonJS-deps");
const estreeHelpers = require("./estree-helpers");

function extractRegularAMDDependencies(pNode, pDependencies) {
  if (estreeHelpers.isLikelyAMDDefineOrRequire(pNode)) {
    pNode.expression.arguments
      .filter(pArg => pArg.type === "ArrayExpression")
      .forEach(arg =>
        arg.elements.forEach(el => {
          if (Boolean(el.value) && typeof el.value === "string") {
            el.value.split("!").forEach(pString =>
              pDependencies.push({
                moduleName: pString,
                moduleSystem: "amd",
                dynamic: false
              })
            );
          }
        })
      );
  }
}

function extractCommonJSWrappers(pNode, pDependencies) {
  if (estreeHelpers.isLikelyAMDDefine(pNode)) {
    pNode.expression.arguments
      .filter(
        pArg =>
          pArg.type === "FunctionExpression" &&
          pArg.params.some(pParam => pParam.name === "require")
      )
      .forEach(pFunction =>
        extractCommonJSDependencies(pFunction.body, pDependencies, "amd")
      );
  }
}

module.exports = (pAST, pDependencies) => {
  walk.simple(
    pAST,
    {
      ExpressionStatement: pNode => {
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
    },
    // see https://github.com/acornjs/acorn/issues/746
    walk.base
  );
};
