import { simple as walk_simple, base as walk_base } from "acorn-walk";
import extractCommonJSDependencies from "./extract-cjs-deps.mjs";
import estreeHelpers from "./estree-helpers.mjs";

function extractRegularAMDDependencies(pNode, pDependencies) {
  if (estreeHelpers.isLikelyAMDDefineOrRequire(pNode)) {
    pNode.expression.arguments
      .filter((pArgument) => pArgument.type === "ArrayExpression")
      .forEach((pArgument) =>
        pArgument.elements.forEach((pElement) => {
          if (Boolean(pElement.value) && typeof pElement.value === "string") {
            pDependencies.push({
              module: pElement.value,
              moduleSystem: "amd",
              dynamic: false,
              exoticallyRequired: false,
              dependencyTypes: ["amd-define"],
            });
          }
        }),
      );
  }
}

function extractCommonJSWrappers(pNode, pDependencies, pExoticRequireStrings) {
  if (estreeHelpers.isLikelyAMDDefine(pNode)) {
    pNode.expression.arguments
      .filter(
        (pArgument) =>
          pArgument.type === "FunctionExpression" &&
          pArgument.params.some(
            (pParameter) =>
              pParameter.name === "require" ||
              pExoticRequireStrings.includes(pParameter.name),
          ),
      )
      .forEach((pFunction) =>
        extractCommonJSDependencies(
          pFunction.body,
          pDependencies,
          "amd",
          pExoticRequireStrings,
        ),
      );
  }
}

export default function extractAMDDependencies(
  pAST,
  pDependencies,
  pExoticRequireStrings,
) {
  walk_simple(
    pAST,
    {
      ExpressionStatement: (pNode) => {
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
        extractCommonJSWrappers(pNode, pDependencies, pExoticRequireStrings);
      },
    },
    // see https://github.com/acornjs/acorn/issues/746
    walk_base,
  );
}
